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
	url(r'^gene/(?P<gene_id>[a-zA-Z0-9_\.]+)/$',views.geneDetail), #This my still be kind funky.
	
	#Isoform Views
	url(r'^gene/(?P<gene_id>\w+)/isoform/(?P<isoform_id>\w+)/$',views.isoformDetail),
	url(r'^gene/(?P<gene_id>\w+)/isoform/(?P<isoform_id>[a-zA-Z0-9_\.]+)/$',views.isoformDetail),
	url(r'^isoform/(?P<isoform_id>\w+)/$',views.isoformDetail),
	url(r'^isoform/(?P<isoform_id>[a-zA-Z0-9_\.]+)/$',views.isoformDetail), #This my still be kind funky.
	
	#Cluster Views
	url(r'^clusters/$',views.clusters),
	url(r'^cluster/(?P<cluster>\d+)/$',views.clusterDetail),

	#Search
	url(r'^search/$', views.search),
)