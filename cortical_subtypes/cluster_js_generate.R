library(cummeRbund)
library(rjson)

cuff <- readCufflinks()

gene_ids <- read.table("clusters.txt", header=TRUE)

# This function clusters the data the way csHeatmap does
.ggclust<-function(object, rescaling='none', clustering='none', labCol=T, labRow=T, logMode=T, pseudocount=1.0,
		border=FALSE, heatscale=c(low='lightyellow',mid='orange',high='darkred'), heatMidpoint=NULL,fullnames=T,replicates=FALSE,method='none',...) {
	## the function can be be viewed as a two step process
	## 1. using the rehape package and other funcs the data is clustered, scaled, and reshaped
	## using simple options or by a user supplied function
	## 2. with the now resahped data the plot, the chosen labels and plot style are built

	if(replicates){
		m=repFpkmMatrix(object,fullnames=fullnames)
	}else{
		m=fpkmMatrix(object,fullnames=fullnames)
	}
	#remove genes with no expression in any condition
	m=m[!apply(m,1,sum)==0,]

	## you can either scale by row or column not both!
	## if you wish to scale by both or use a different scale method then simply supply a scale
	## function instead NB scale is a base funct

    if(logMode)
    {
      m = log10(m+pseudocount)
    }

	## I have supplied the default cluster and euclidean distance (JSdist) - and chose to cluster after scaling
	## if you want a different distance/cluster method-- or to cluster and then scale
	## then you can supply a custom function

	if(!is.function(method)){
		method = function(mat){JSdist(makeprobs(t(mat)))}
	}

	if(clustering=='row')
		m=m[hclust(method(m))$order, ]
	if(clustering=='column')
		m=m[,hclust(method(t(m)))$order]
	if(clustering=='both')
		m=m[hclust(method(m))$order ,hclust(method(t(m)))$order]

	## this is just reshaping into a ggplot format matrix and making a ggplot layer

	if(is.function(rescaling))
	{
		m=rescaling(m)
	} else {
		if(rescaling=='column'){
			m=scale(m, center=T)
		    m[is.nan(m)] = 0
		}
		if(rescaling=='row'){
			m=t(scale(t(m),center=T))
		    m[is.nan(m)] = 0
	    }
	}

  m
}

for(i in 0:19) {
  cluster <- gene_ids[gene_ids[2] == i]
  genes   <- getGenes(cuff, cluster)

  # Replace your csHeatmap call with this function here. Obviously, some parameters will be ignored.
  m <- .ggclust(genes, cluster = "row", rescaling = "row", method = dist, heatscale = c("steelblue", "white", "darkred"), heatMidpoint = 0)

  # Generate a javascript file for this cluster
  sink(paste("../pyramidal/static/js/cluster_",i,".js",sep=""))
  cat(paste("var cluster_",i," = {\n",sep=""))
  for(i in 1:length(rownames(m))) {
    cat("  ")
    cat(toJSON(unlist(strsplit(rownames(m)[i],"[|]"))[[2]]))
    cat(":[")
    for (j in 1:length(colnames(m))) {
      cat(toJSON(m[i,j]))
      if (j < length(colnames(m))) {
        cat(",")
      }
    }
    cat("]")
    if (i < length(rownames(m))) {
      cat(",\n")
    }
  }
  cat("}")
  sink()
}
