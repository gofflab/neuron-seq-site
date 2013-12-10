from django.http import HttpResponse
from django.template import RequestContext, loader
from django.http import Http404
from django.shortcuts import render

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

import json, urllib2

from pyramidal.models import Gene,Isoform

def index(request):
	context = {}
	return render(request,'pyramidal/index.html',context)

def genes(request):
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
	return render(request,'pyramidal/genes.html',context)

def genesDetail(request,gene_list):
	"""Takes a comma-separated list of genes as <gene_list>"""
	gene_list_clean = gene_list.rstrip().split(",")
	try:
		genes = Gene.objects.filter(gene_id__in=gene_list_clean)
		expression = {}
		diffData = {}
		for gene in genes:
			expression[gene.gene_id]=gene.expression()
			diffData[gene.gene_id]=gene.diffData()
	except Gene.DoesNotExist:
		return Http404
	context = {
		'genes': genes,
		'diffData': json.dumps(diffData,separators=(',',':')),
		'expression' :json.dumps(expression,separators=(',',':'))
	}
	return render(request,'pyramidal/genesDetail.html',context)

##################
# Gene & Isoform detail
##################

# Allen Interaction
##########

def getAllenExperimentIds(gene_id='Fezf2'):
	# Mouse
	baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqMouse],genes[acronym$eq%s]" % gene_id
	# DevMouse
	#baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqDevMouse],genes[acronym$eq%s]" % gene_id 
	#print baseUrl
	response = urllib2.urlopen(baseUrl)
	data = json.load(response)
	if data['success']:
		res = [x['id'] for x in data['msg']]
	else:
		res = []
	return res

def getAllenSectionData(gene_id='Fezf2'):
	#baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqDevMouse],plane_of_section[name$eq'coronal'],genes[acronym$eq'%s']&include=genes,section_images,specimen(donor(age))" % gene_id
	baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqDevMouse],genes[acronym$eq'%s']&include=genes,section_images,specimen(donor(age))" % gene_id
	response = urllib2.urlopen(baseUrl)
	data = json.load(response)
	if data['success']:
		return data
	else:
		return False


def geneDetail(request,gene_id):
	try:
		#get Gene object
		gene = Gene.objects.get(gene_id=gene_id)
		allenExpIds = getAllenExperimentIds(gene.gene_short_name)
		allenSectionData = getAllenSectionData(gene.gene_short_name)
	except Gene.DoesNotExist:
		return Http404
	context = {
		'gene': gene,
		'sunburstIds': allenExpIds,
		'sectionData': allenSectionData,
	}
	return render(request,'pyramidal/geneDetail.html',context)
	

def isoformDetail(request,isoform_id):
	try:
		#get Isoform object
		isoform = Isoform.objects.get(isoform_id=isoform_id)
		
		context = {
			'isoform': isoform,
		}
		return render(request,'pyramidal/isoformDetail.html',context)
	except Gene.DoesNotExist:
		return Http404

def clusters(request):
	context={}
	return HttpResponse("You found the master cluster list!")

def clusterDetail(request,cluster):
	response = "You have found the cluster page for cluster number %s"
	return HttpResponse(response % cluster)

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


##############
# Search
##############
def search(request):
    query_string = ''
    found_genes = None
    if ('q' in request.GET) and request.GET['q'].strip():
        query_string = request.GET['q']
        
        entry_query = get_query(query_string, ['gene_id', 'gene_short_name',])
        
        found_genes = Gene.objects.filter(entry_query).order_by('gene_id')

    return render(request,'pyramidal/search_results.html',
                          { 'query_string': query_string, 'found_genes': found_genes }
                 )