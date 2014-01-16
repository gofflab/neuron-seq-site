import json

try:
  # python 3
  from urllib.request import urlopen
  def pullJson(url):
    response = urlopen(url)
    encoding = response.headers.get_content_charset()
    data = json.loads(response.read().decode(encoding))
    return data
except ImportError:
  # python 2
  from urllib2 import urlopen
  def pullJson(url):
    response = urlopen(url)
    data = json.load(response)
    return data

# This class provides a python API to the Allen Brain Map
class AllenExplorer:
  # Pulls the section dataset for the given gene
  def sectionData(self,gene_id = 'Fezf2'):
    baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqDevMouse],genes[acronym$eq'%s']&include=genes,section_images,specimen(donor(age))" % gene_id
    data = pullJson(baseUrl)
    if data['success']:
      return data
    else:
      return False

   # Pulls out experiment ids for the given gene
  def experimentIds(self,gene_id = 'Fezf2'):
    # Mouse
    baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqMouse],genes[acronym$eq%s]" % gene_id

    # DevMouse
    #baseUrl = "http://api.brain-map.org/api/v2/data/SectionDataSet/query.json?criteria=[failed$eqfalse],products[abbreviation$eqDevMouse],genes[acronym$eq%s]" % gene_id

    data = pullJson(baseUrl)
    if data['success']:
      res = [x['id'] for x in data['msg']]
    else:
      res = []
    return res
