# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines for those models you wish to give write DB access
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.
from __future__ import unicode_literals

from django.db import models

class Cds(models.Model):
    cds_id = models.CharField(db_column='CDS_id', unique=True, max_length=45) # Field name made lowercase.
    class_code = models.CharField(max_length=45, blank=True)
    nearest_ref_id = models.CharField(max_length=45, blank=True)
    gene_id = models.CharField(max_length=45, blank=True)
    gene_short_name = models.CharField(max_length=45, blank=True)
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45, blank=True) # Field name made lowercase.
    locus = models.CharField(max_length=45, blank=True)
    length = models.IntegerField(blank=True, null=True)
    coverage = models.TextField(blank=True) # This field type is a guess.
    class Meta:
        managed = False
        db_table = 'CDS'

class Cdscount(models.Model):
    cds_id = models.CharField(db_column='CDS_id', max_length=45) # Field name made lowercase.
    sample_name = models.CharField(max_length=45)
    count = models.TextField(blank=True) # This field type is a guess.
    variance = models.TextField(blank=True) # This field type is a guess.
    uncertainty = models.TextField(blank=True) # This field type is a guess.
    dispersion = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'CDSCount'

class Cdsdata(models.Model):
    cds_id = models.CharField(db_column='CDS_id', max_length=45) # Field name made lowercase.
    sample_name = models.CharField(max_length=45)
    fpkm = models.TextField(blank=True) # This field type is a guess.
    conf_hi = models.TextField(blank=True) # This field type is a guess.
    conf_lo = models.TextField(blank=True) # This field type is a guess.
    quant_status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'CDSData'

class Cdsdiffdata(models.Model):
    gene_id = models.CharField(max_length=45)
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    js_dist = models.TextField(db_column='JS_dist', blank=True) # Field name made lowercase. This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'CDSDiffData'

class Cdsexpdiffdata(models.Model):
    cds_id = models.CharField(db_column='CDS_id', max_length=45) # Field name made lowercase.
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    log2_fold_change = models.TextField(blank=True) # This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'CDSExpDiffData'

class Cdsfeatures(models.Model):
    cds_id = models.CharField(db_column='CDS_id', max_length=45) # Field name made lowercase.
    class Meta:
        managed = False
        db_table = 'CDSFeatures'

class Cdsreplicatedata(models.Model):
    cds_id = models.CharField(db_column='CDS_id', max_length=45) # Field name made lowercase.
    sample_name = models.CharField(max_length=45)
    replicate = models.IntegerField(blank=True, null=True)
    rep_name = models.CharField(max_length=45)
    raw_frags = models.TextField(blank=True) # This field type is a guess.
    internal_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    external_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    fpkm = models.TextField(blank=True) # This field type is a guess.
    effective_length = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'CDSReplicateData'

class Tss(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', unique=True, max_length=45) # Field name made lowercase.
    class_code = models.CharField(max_length=45, blank=True)
    nearest_ref_id = models.CharField(max_length=45, blank=True)
    gene_id = models.CharField(max_length=45)
    gene_short_name = models.CharField(max_length=45, blank=True)
    locus = models.CharField(max_length=45, blank=True)
    length = models.IntegerField(blank=True, null=True)
    coverage = models.TextField(blank=True) # This field type is a guess.
    class Meta:
        managed = False
        db_table = 'TSS'

class Tsscount(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45) # Field name made lowercase.
    sample_name = models.CharField(max_length=45)
    count = models.TextField(blank=True) # This field type is a guess.
    variance = models.TextField(blank=True) # This field type is a guess.
    uncertainty = models.TextField(blank=True) # This field type is a guess.
    dispersion = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'TSSCount'

class Tssdata(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45) # Field name made lowercase.
    sample_name = models.CharField(max_length=45)
    fpkm = models.TextField(blank=True) # This field type is a guess.
    conf_hi = models.TextField(blank=True) # This field type is a guess.
    conf_lo = models.TextField(blank=True) # This field type is a guess.
    quant_status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'TSSData'

class Tssexpdiffdata(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45) # Field name made lowercase.
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    log2_fold_change = models.TextField(blank=True) # This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'TSSExpDiffData'

class Tssfeatures(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45) # Field name made lowercase.
    class Meta:
        managed = False
        db_table = 'TSSFeatures'

class Tssreplicatedata(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45) # Field name made lowercase.
    sample_name = models.CharField(max_length=45)
    replicate = models.CharField(max_length=45, blank=True)
    rep_name = models.CharField(max_length=45)
    raw_frags = models.TextField(blank=True) # This field type is a guess.
    internal_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    external_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    fpkm = models.TextField(blank=True) # This field type is a guess.
    effective_length = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'TSSReplicateData'

class Attributes(models.Model):
    attribute_lookup_id = models.IntegerField(primary_key=True)
    feature_id = models.IntegerField()
    attribute = models.CharField(max_length=45)
    value = models.CharField(max_length=45)
    class Meta:
        managed = False
        db_table = 'attributes'

class Biasdata(models.Model):
    biasdata_id = models.IntegerField(db_column='biasData_id', primary_key=True) # Field name made lowercase.
    class Meta:
        managed = False
        db_table = 'biasData'

class Features(models.Model):
    seqnames = models.TextField(blank=True)
    start = models.IntegerField(blank=True, null=True)
    end = models.IntegerField(blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    strand = models.TextField(blank=True)
    source = models.TextField(blank=True)
    type = models.TextField(blank=True)
    score = models.FloatField(blank=True, null=True)
    phase = models.IntegerField(blank=True, null=True)
    gene_id = models.TextField(blank=True)
    isoform_id = models.TextField(blank=True)
    exon_number = models.FloatField(blank=True, null=True)
    oid = models.TextField(db_column='oId', blank=True) # Field name made lowercase.
    linc_name = models.TextField(blank=True)
    tss_group_id = models.TextField(db_column='TSS_group_id', blank=True) # Field name made lowercase.
    class_code = models.TextField(blank=True)
    gene_name = models.TextField(blank=True)
    pfam_domains = models.TextField(db_column='PFAM_Domains', blank=True) # Field name made lowercase.
    csf = models.FloatField(blank=True, null=True)
    csf_start = models.FloatField(blank=True, null=True)
    csf_end = models.FloatField(blank=True, null=True)
    pseudogene = models.FloatField(blank=True, null=True)
    nearest_ref = models.TextField(blank=True)
    antisense = models.TextField(blank=True)
    bidirectional_prom = models.TextField(blank=True)
    contained_in = models.TextField(blank=True)
    cds_id = models.TextField(db_column='CDS_id', blank=True) # Field name made lowercase.
    class Meta:
        managed = False
        db_table = 'features'

class Genecount(models.Model):
    gene_id = models.CharField(max_length=45)
    sample_name = models.CharField(max_length=45)
    count = models.TextField(blank=True) # This field type is a guess.
    variance = models.TextField(blank=True) # This field type is a guess.
    uncertainty = models.TextField(blank=True) # This field type is a guess.
    dispersion = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'geneCount'

class Genedata(models.Model):
    gene_id = models.CharField(max_length=45)
    sample_name = models.CharField(max_length=45)
    fpkm = models.TextField(blank=True) # This field type is a guess.
    conf_hi = models.TextField(blank=True) # This field type is a guess.
    conf_lo = models.TextField(blank=True) # This field type is a guess.
    quant_status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'geneData'

class Geneexpdiffdata(models.Model):
    gene_id = models.CharField(max_length=45)
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    log2_fold_change = models.TextField(blank=True) # This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'geneExpDiffData'

class Genefeatures(models.Model):
    gene_id = models.CharField(max_length=45)
    class Meta:
        managed = False
        db_table = 'geneFeatures'

class Genereplicatedata(models.Model):
    gene_id = models.CharField(max_length=45)
    sample_name = models.CharField(max_length=45)
    replicate = models.IntegerField(blank=True, null=True)
    rep_name = models.CharField(max_length=45)
    raw_frags = models.TextField(blank=True) # This field type is a guess.
    internal_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    external_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    fpkm = models.TextField(blank=True) # This field type is a guess.
    effective_length = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'geneReplicateData'

class Genes(models.Model):
    gene_id = models.CharField(unique=True, max_length=45)
    class_code = models.CharField(max_length=45, blank=True)
    nearest_ref_id = models.CharField(max_length=45, blank=True)
    gene_short_name = models.CharField(max_length=45, blank=True)
    locus = models.CharField(max_length=45, blank=True)
    length = models.IntegerField(blank=True, null=True)
    coverage = models.TextField(blank=True) # This field type is a guess.
    class Meta:
        managed = False
        db_table = 'genes'

class Isoformcount(models.Model):
    isoform_id = models.CharField(max_length=45)
    sample_name = models.CharField(max_length=45)
    count = models.TextField(blank=True) # This field type is a guess.
    variance = models.TextField(blank=True) # This field type is a guess.
    uncertainty = models.TextField(blank=True) # This field type is a guess.
    dispersion = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'isoformCount'

class Isoformdata(models.Model):
    isoform_id = models.CharField(max_length=45)
    sample_name = models.CharField(max_length=45)
    fpkm = models.TextField() # This field type is a guess.
    conf_hi = models.TextField(blank=True) # This field type is a guess.
    conf_lo = models.TextField(blank=True) # This field type is a guess.
    quant_status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'isoformData'

class Isoformexpdiffdata(models.Model):
    isoform_id = models.CharField(max_length=45)
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    log2_fold_change = models.TextField(blank=True) # This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'isoformExpDiffData'

class Isoformfeatures(models.Model):
    isoform_id = models.CharField(max_length=45)
    class Meta:
        managed = False
        db_table = 'isoformFeatures'

class Isoformreplicatedata(models.Model):
    isoform_id = models.CharField(max_length=45)
    sample_name = models.CharField(max_length=45)
    replicate = models.IntegerField(blank=True, null=True)
    rep_name = models.CharField(max_length=45)
    raw_frags = models.TextField(blank=True) # This field type is a guess.
    internal_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    external_scaled_frags = models.TextField(blank=True) # This field type is a guess.
    fpkm = models.TextField(blank=True) # This field type is a guess.
    effective_length = models.TextField(blank=True) # This field type is a guess.
    status = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'isoformReplicateData'

class Isoforms(models.Model):
    isoform_id = models.CharField(unique=True, max_length=45)
    gene_id = models.CharField(max_length=45, blank=True)
    cds_id = models.CharField(db_column='CDS_id', max_length=45, blank=True) # Field name made lowercase.
    gene_short_name = models.CharField(max_length=45, blank=True)
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45, blank=True) # Field name made lowercase.
    class_code = models.CharField(max_length=45, blank=True)
    nearest_ref_id = models.CharField(max_length=45, blank=True)
    locus = models.CharField(max_length=45, blank=True)
    length = models.IntegerField(blank=True, null=True)
    coverage = models.TextField(blank=True) # This field type is a guess.
    class Meta:
        managed = False
        db_table = 'isoforms'

class ModelTranscripts(models.Model):
    model_transcript_id = models.IntegerField(primary_key=True)
    class Meta:
        managed = False
        db_table = 'model_transcripts'

class Phenodata(models.Model):
    sample_name = models.CharField(max_length=45)
    parameter = models.CharField(max_length=45)
    value = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'phenoData'

class Promoterdiffdata(models.Model):
    gene_id = models.CharField(max_length=45)
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    js_dist = models.TextField(db_column='JS_dist', blank=True) # Field name made lowercase. This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'promoterDiffData'

class Replicates(models.Model):
    file = models.IntegerField()
    sample_name = models.CharField(max_length=45)
    replicate = models.IntegerField()
    rep_name = models.CharField(unique=True, max_length=45)
    total_mass = models.TextField(blank=True) # This field type is a guess.
    norm_mass = models.TextField(blank=True) # This field type is a guess.
    internal_scale = models.TextField(blank=True) # This field type is a guess.
    external_scale = models.TextField(blank=True) # This field type is a guess.
    class Meta:
        managed = False
        db_table = 'replicates'

class Runinfo(models.Model):
    param = models.CharField(max_length=45, blank=True)
    value = models.TextField(blank=True)
    class Meta:
        managed = False
        db_table = 'runInfo'

class Samples(models.Model):
    sample_index = models.IntegerField()
    sample_name = models.CharField(unique=True, max_length=45)
    class Meta:
        managed = False
        db_table = 'samples'

class Splicingdiffdata(models.Model):
    tss_group_id = models.CharField(db_column='TSS_group_id', max_length=45) # Field name made lowercase.
    gene_id = models.CharField(max_length=45)
    sample_1 = models.CharField(max_length=45)
    sample_2 = models.CharField(max_length=45)
    status = models.CharField(max_length=45, blank=True)
    value_1 = models.TextField(blank=True) # This field type is a guess.
    value_2 = models.TextField(blank=True) # This field type is a guess.
    js_dist = models.TextField(db_column='JS_dist', blank=True) # Field name made lowercase. This field type is a guess.
    test_stat = models.TextField(blank=True) # This field type is a guess.
    p_value = models.TextField(blank=True) # This field type is a guess.
    q_value = models.TextField(blank=True) # This field type is a guess.
    significant = models.CharField(max_length=45, blank=True)
    class Meta:
        managed = False
        db_table = 'splicingDiffData'

class Varmodel(models.Model):
    condition = models.CharField(max_length=45)
    locus = models.CharField(max_length=45)
    compatible_count_mean = models.TextField(blank=True) # This field type is a guess.
    compatible_count_var = models.TextField(blank=True) # This field type is a guess.
    total_count_mean = models.TextField(blank=True) # This field type is a guess.
    total_count_var = models.TextField(blank=True) # This field type is a guess.
    fitted_var = models.TextField(blank=True) # This field type is a guess.
    class Meta:
        managed = False
        db_table = 'varModel'

