from django.conf.urls import patterns, url

from pyramidal import views

urlpatterns = patterns('',
	#Index
	url(r'^$',views.index,name='index'),

	#Gene Views
	#All Genes
	url(r'^genes/',views.genes,name='genes'),
	
	#Gene detail view
	url(r'^gene/(?P<gene_id>\w+)/$',views.geneDetail),
	url(r'^gene/(?P<gene_id>[a-zA-Z0-9_-]+)/$',views.geneDetail), #This my still be kind funky.
	
	#Isoform Views
	url(r'^gene/(?P<gene_id>\w+)/isoform/(?P<isoform_id>\w+)/$',views.isoform),
	url(r'^isoform/(?P<isoform_id>\w+)/$',views.isoform),
	
	#Cluster Views
	url(r'^cluster/(?P<cluster>\d+)/$',views.cluster)
)