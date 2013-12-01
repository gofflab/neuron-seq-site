from django.conf.urls import patterns, url

from pyramidal import views

urlpatterns = patterns('',
	#Index
	url(r'^$',views.index,name='index'),

	#Geneset Views
	url(r'^geneset/(?P<gene_list>[a-zA-Z0-9_\.\+]+)/$',views.genesDetail),

	#Isoform Views
	url(r'^genes/(?P<gene_id>\w+)/isoforms/?$',views.geneIsoforms,name='isoform_index'),
	url(r'^genes/(?P<gene_id>\w+)/isoforms/(?P<isoform_id>[\w.]+)/?$',views.isoformDetail,name='isoform_show'),

	#Gene detail view
	url(r'^genes/(?P<gene_id>[\w.-]+)/?$',views.geneDetail,name='gene_show'),

	#All Genes
	url(r'^genes/?$',views.genes,name='gene_index'),

	#Cluster Views
	url(r'^clusters/?$',views.clusterIndex,name='cluster_index'),
	url(r'^clusters/(?P<cluster_id>\d+)/?$',views.clusterShow,name='cluster_show'),

	#Search
	url(r'^search/?$', views.search, name = 'search'),

	#Dev
	url(r'^dev/$',views.dev),
)
