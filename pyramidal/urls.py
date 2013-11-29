from django.conf.urls import patterns, url

from pyramidal import views

urlpatterns = patterns('',
	#Index
	url(r'^$',views.index,name='index'),

	#Geneset Views
	url(r'^geneset/(?P<gene_list>[a-zA-Z0-9_\.\+]+)/$',views.genesDetail),

	#Isoform Views
	url(r'^genes/(?P<gene_id>\w+)/isoforms/$',views.geneIsoforms),
	url(r'^genes/(?P<gene_id>\w+)/isoform/(?P<isoform_id>\w+)/$',views.isoformDetail),
	url(r'^genes/(?P<gene_id>\w+)/isoform/(?P<isoform_id>[a-zA-Z0-9_\.]+)/$',views.isoformDetail),
	url(r'^isoform/(?P<isoform_id>\w+)/$',views.isoformDetail),
	url(r'^isoform/(?P<isoform_id>[a-zA-Z0-9_\.]+)/$',views.isoformDetail), #This my still be kind funky.

	#Gene detail view
	url(r'^genes/(?P<gene_id>\w+)/$',views.geneDetail,name='gene_detail'),
	url(r'^genes/(?P<gene_id>[a-zA-Z0-9_\.]+)/$',views.geneDetail), #This my still be kind funky.

	#All Genes
	url(r'^genes/',views.genes,name='genes'),

	#Cluster Views
	url(r'^clusters/$',views.clusters),
	url(r'^cluster/(?P<cluster>\d+)/$',views.clusterDetail),

	#Search
	url(r'^search/$', views.search),

	#Dev
	url(r'^dev/$',views.dev),
)
