from django.http import HttpResponse
from django.template import RequestContext, loader
from django.http import Http404
from django.shortcuts import render, redirect

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from pyramidal.models import Gene,Isoform,ClusterAssignment,Features,Sample,FpkmMat

from pyramidal.allen import AllenExplorer

import json

from numpy import zeros, array
from math import sqrt, log

def index(request):
    context = {}
    return render(request,'pyramidal/index.html',context)

def geneIndex(request):
    if ('order_by' in request.GET) and request.GET['order_by'].strip():
        order_by = request.GET.get('order_by','defaultOrderField')
    else:
        order_by = 'gene_id'
    allGenes = Gene.objects.all().order_by(order_by)
    paginator = Paginator(allGenes,20) # Show 20 genes per page
    page = request.GET.get('page')
    try:
        genes = paginator.page(page)
    except PageNotAnInteger:
        #If page is not an integer, deliver first page
        genes = paginator.page(1)
    except EmptyPage:
        #If page is out of range, deliver last page of results
        genes = paginator.page(paginator.num_pages)
    context = {
        'genes': genes,
    }
    return render(request,'pyramidal/geneIndex.html',context)

def geneset(request,gene_list):
    """Takes a '+'-separated list of genes as <gene_list>"""
    gene_list_clean = gene_list.rstrip().split("+")
    try:
        genes = Gene.objects.filter(gene_id__in=gene_list_clean)
        expression = []
        diffData = {}
        for gene in genes:
            expression.append(gene.expression())
            diffData[gene.gene_id]=gene.diffData()
    except Gene.DoesNotExist:
        raise Http404
    context = {
        'genes': genes,
        'diffData': json.dumps(diffData,separators=(',',':')),
        'expression' :json.dumps(expression,separators=(',',':'))
    }
    return render(request,'pyramidal/geneset.html',context)

##################
# Gene & Isoform detail
##################

def geneShow(request,gene_id):
  try:
    # Get Gene object
    #gene_id = gene_id.replace("."," ").replace("_", " ")
    # Get Gene object
    # gene = Gene.objects.get(gene_id=gene_id)
    gene = Gene.objects.get(gene_id__iexact=gene_id)
    if gene.gene_id != gene_id:
      return redirect('gene_show', gene_id = gene.gene_id)

    isoforms = gene.isoforms()
    promoters = gene.promoters()
    cds = gene.CDS()
    AE = AllenExplorer()
    allenExpIds = AE.experimentIds(gene.gene_short_name)
    allenSectionData = AE.sectionData(gene.gene_short_name)

  except Gene.DoesNotExist:
    raise Http404
  context = {
      'gene': gene,
      'isoforms': isoforms,
      'promoters': promoters,
      'cds': cds,
      'sunburstIds': allenExpIds,
      'sectionData': allenSectionData,
      }
  return render(request,'pyramidal/geneShow.html',context)

def geneHiveData(request,gene_id):
  try:
    # Get Gene object
    gene = Gene.objects.get(gene_id=gene_id)

    return HttpResponse(gene.diffDataHive(), content_type="application/json")
  except Gene.DoesNotExist:
    raise Http404

def geneExpression(request,gene_id):
  try:
    # Get Gene object
    gene = Gene.objects.get(gene_id=gene_id)

    return HttpResponse(gene.expressionJson(), content_type="application/json")
  except Gene.DoesNotExist:
    raise Http404

def geneIsoforms(request, gene_id):
  try:
    # Get Gene object
    gene = Gene.objects.get(gene_id__iexact=gene_id)
    if gene.gene_id != gene_id:
      return redirect('gene_show', gene_id = gene.gene_id)

    allenExpIds = AllenExplorer.experimentIds(gene.gene_short_name)
    allenSectionData = AllenExplorer.sectionData(gene.gene_short_name)
  except Gene.DoesNotExist:
    raise Http404
  context = {
      'gene': gene,
      'sunburstIds': allenExpIds,
      'sectionData': allenSectionData,
      }
  return render(request,'pyramidal/geneShow.html',context)

def isoformExpression(request,gene_id,isoform_id):
  try:
    # Get Gene object
    isoform = Isoform.objects.get(isoform_id=isoform_id)

    return HttpResponse(isoform.expressionJson(), content_type="application/json")
  except Isoform.DoesNotExist:
    raise Http404

def isoformHiveData(request,gene_id,isoform_id):
  try:
    # Get Isoform object
    isoform = Isoform.objects.get(isoform_id=isoform_id)

    return HttpResponse(isoform.diffDataHive(), content_type="application/json")
  except Isoform.DoesNotExist:
    raise Http404

def isoformDetail(request,gene_id,isoform_id):
  try:
    # Get Isoform object
    isoform = Isoform.objects.get(isoform_id=isoform_id)

    context = {
      'isoform': isoform,
    }
    return render(request,'pyramidal/isoformDetail.html',context)
  except Gene.DoesNotExist:
    raise Http404

def clusterIndex(request):
  context = {
  }
  return render(request,'pyramidal/clusterIndex.html',context)

def clusterShow(request, cluster_id):
  context = {
    'cluster_id': cluster_id
  }
  return render(request,'pyramidal/clusterShow.html',context)

#####################
# Search functionality
#####################
import re

from django.db.models import Q

def normalize_query(query_string,
                      findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                      normspace=re.compile(r'\s{2,}').sub):
      ''' Splits the query string in invidual keywords, getting rid of unecessary spaces
          and grouping quoted words together.
          Example:

          >>> normalize_query('  some random  words "with   quotes  " and   spaces')
          ['some', 'random', 'words', 'with quotes', 'and', 'spaces']

      '''
      return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]

def get_query(query_string, search_fields):
      ''' Returns a query, that is a combination of Q objects. That combination
          aims to search keywords within a model by testing the given search fields.

      '''
      query = None # Query to search for every search term
      terms = normalize_query(query_string)
      for term in terms:
          or_query = None # Query to search for a given term in each field
          for field_name in search_fields:
              q = Q(**{"%s__icontains" % field_name: term})
              if or_query is None:
                  or_query = q
              else:
                  or_query = or_query | q
          if query is None:
              query = or_query
          else:
              query = query & or_query
      return query

def parseLocusQuery(query_string):
    chrom, ranges = query_string.strip().split(":")
    start,end = ranges.strip().split("-")
    return [chrom,start,end]

def findGenesFromLocus(chrom,start,end):
    found_features = Features.objects.filter(seqnames__iexact=chrom
        ).filter(end__gte=start
        ).filter(start__lte=end)
    gene_ids = [f.gene_id for f in found_features]
    gene_ids = set(gene_ids)
    found_genes = Gene.objects.filter(gene_id__in=gene_ids).order_by('gene_id')
    return found_genes

##############
# Search
##############
def search(request):
  query_string = ''
  found_genes = None
  if ('q' in request.GET) and request.GET['q'].strip():
    query_string = request.GET['q']

  if query_string.find(":")!=-1:
    query_string = query_string.replace(",","")
    chrom,start,end = parseLocusQuery(query_string)
    found_genes = findGenesFromLocus(chrom,start,end)
  else:
    entry_query = get_query(query_string, ['gene_id', 'gene_short_name',])
    found_genes = Gene.objects.filter(entry_query).order_by('gene_id')

  return render(request,'pyramidal/search_results.html',
        { 'query_string': query_string, 'found_genes': found_genes }
               )

####################
# Development
#####################
def dev(request):
    context = {}
    return render(request,'pyramidal/testKegg.html',context)

####################
# Markers
#####################
# Deprecated in favor of parcoords approach
# def markers(request,expProfile,sigFlag,nGenes):
#     #Sample Order
#     sampleOrder=["E15_cpn","E15_subcereb","E15_corticothal","E16_cpn","E16_subcereb","E16_corticothal","E18_cpn","E18_subcereb","E18_corticothal","P1_cpn","P1_subcereb","P1_corticothal",]

#     #Clean expProfile
#     expProfile = makeProb(expProfile)

#     #Find JS distance values for each gene
#     allGenes = Gene.objects.all()
#     JSD = {}
#     for gene in allGenes:
#         geneDict = gene.fpkm()
#         geneProfile = []
#         for sample in sampleOrder:
#             geneProfile.append(geneDict[sample])
#         try:
#             geneProfile = makeProb(geneProfile)
#         except ZeroDivisionError:
#             continue
#         #print >>sys.stderr, "%s:\n%s" % (gene.gene_id,"\t".join([str(x) for x in geneProfile]))
#         JSD[gene.gene_id] = sqrt(Jensen_Shannon_divergence(geneProfile,expProfile))
#     #return JSD

#     context = {}
#     return render(request,'base.html',context)

def markers(request):
    context = {}
    return render(request,'pyramidal/markers.html',context)

def KL_divergence(p, q):
        return sum(_p * log(_p / _q) for _p, _q in zip(p, q) if _p != 0)

def makeProb(p):
     return [x/float(sum(p)) for x in p]

def Jensen_Shannon_divergence(p, q):
    JSD = 0.0
    weight = 0.5
    average = zeros(len(p))
    for x in range(len(p)):
        average[x] = weight * p[x] + (1 - weight) * q[x]
        JSD = (weight * KL_divergence(array(p), average)) + ((1 - weight) * KL_divergence(array(q), average))
    return (1-(JSD/sqrt(2 * log(2))))


####################
# TFBS
#####################
def tfbs(request):
    context = {}
    return render(request,'pyramidal/tfbs.html',context)

####################
# Supplement
#####################
def supplement(request):
    context = {}
    return render(request,'pyramidal/supplement.html',context)

####################
# Help
#####################
def help(request):
    context = {}
    return render(request,'pyramidal/help.html',context)


####################
# About
#####################
def about(request):
    context = {}
    return render(request,'pyramidal/about.html',context)


####################
# Devel
#####################
def devel(request):

    samples = Sample.objects.all()
    samples = [sample.sample_name for sample in samples]

    #Make JSON
    expressionData = FpkmMat()
    expressionData = json.dumps(expressionData,separators=(',',':'))
    context = {
        #'genes': genes,
        'samples': samples,
        'expressionData': expressionData,
    }
    return render(request,'pyramidal/devel.html',context)
