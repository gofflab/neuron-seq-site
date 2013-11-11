from django.http import HttpResponse
from django.template import RequestContext, loader
from django.http import Http404
from django.shortcuts import render

import json

from pyramidal.models import Gene,Isoform

def index(request):
	context = {}
	return render(request,'pyramidal/index.html',context)

def genes(request):
	allGenes = Gene.objects.all()
	context = {
		'genes': allGenes,
	}
	return HttpResponse("You found the master gene list!")

def geneDetail(request,gene_id):
	try:
		#get Gene object
		gene = Gene.objects.get(gene_id=gene_id)

		#Get list of Isoform objects
		isoforms = Isoform.objects.filter(gene_id=gene_id)

		#Expression info as dict
		expression = gene.expression()
		#Expression info as cleaned JSON
		expressionJson = gene.expressionJson

		#response = "You found the gene page for %s"

		context = {
			'gene': gene,
			'isoforms': isoforms,
			'expression': expression,
			'expressionJson': expressionJson,
		}
		return render(request,'pyramidal/geneDetail.html',context)
	except Gene.DoesNotExist:
		return Http404

def isoformDetail(request,isoform_id):
	try:
		#get Isoform object
		isoform = Isoform.objects.get(isoform_id=isoform_id)

		#Expression info as dict
		expression = isoform.expression()
		#Expression info as cleaned JSON
		expressionJson = isoform.expressionJson

		#response = "You found the gene page for %s"

		context = {
			'isoform': isoform,
			'expression': expression,
			'expressionJson': expressionJson,
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