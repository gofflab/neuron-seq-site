from django.conf.urls import patterns, url

from pyramidal import views

urlpatterns = patterns('',
	#Index
	url(r'^$',views.index,name='index'),

	#Geneset Views
	url(r'^geneset/(?P<gene_list>[a-zA-Z0-9_\-\.\+]+)/?$',views.geneset,name='gene_set'),

	#Isoform Views
	url(r'^genes?/(?P<gene_id>[\w.-]+)/isoforms?/?$',views.geneIsoforms,name='isoform_index'),
	url(r'^genes?/(?P<gene_id>[\w.-]+)/isoforms?/(?P<isoform_id>[\w.]+)/?$',views.isoformDetail,name='isoform_show'),

        #Isoform Data
	url(r'^genes?/(?P<gene_id>[\w.-]+)/isoforms?/(?P<isoform_id>[\w.]+)/hivedata/?$',views.isoformHiveData,name='isoform_hive_data'),
	url(r'^genes?/(?P<gene_id>[\w.-]+)/isoforms?/(?P<isoform_id>[\w.]+)/expression/?$',views.isoformExpression,name='isoform_expression'),

	#Gene detail view
	url(r'^genes?/(?P<gene_id>[\w.-]+)/?$',views.geneShow,name='gene_show'),

        #Gene Data
	url(r'^genes?/(?P<gene_id>[\w.-]+)/hivedata/?$',views.geneHiveData,name='gene_hive_data'),
	url(r'^genes?/(?P<gene_id>[\w.-]+)/expression/?$',views.geneExpression,name='gene_expression'),

 #        #Gene Data
	# url(r'^genes?/(?P<gene_id>[\w.-]+)/hivedata/?$',views.geneHiveData,name='gene_hive_data'),
	# url(r'^genes?/(?P<gene_id>[\w.-]+)/expression/?$',views.geneExpression,name='gene_expression'),

	#All Genes
	url(r'^genes/?$',views.geneIndex,name='gene_index'),

	#Cluster Views
	url(r'^clusters/?$',views.clusterIndex,name='cluster_index'),
	url(r'^clusters/(?P<cluster_id>\d+)/?$',views.clusterShow,name='cluster_show'),

	#Search
	url(r'^search/?$', views.search, name = 'search'),

	#Dev
	url(r'^dev/$',views.dev),

	#Markers
	url(r'^markers/?$',views.markers,name = 'markers'),

	#Supplement
	url(r'^supp/?$',views.supplement,name = 'supplement'),

	#TFBS
	url(r'^tfbs/?$',views.tfbs,name = 'tfbs'),

	#help
	url(r'^help/?$',views.help,name = 'help'),

	#Devel
	url(r'^devel/?$',views.devel,name='devel'),

	#About
	url(r'^about/?$',views.about,name='about'),
)
