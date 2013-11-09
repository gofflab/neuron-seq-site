from django.contrib import admin
from pyramidal.models import Gene,Isoform,Tss,Cds,Sample

admin.site.register(Gene)
admin.site.register(Isoform)
admin.site.register(Tss)
admin.site.register(Cds)
admin.site.register(Sample)