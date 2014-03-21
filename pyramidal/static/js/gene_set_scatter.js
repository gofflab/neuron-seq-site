// Gene set scatter plot
window.gene_set_scatter = {
	scatter: function(canvasSelector,xSelector,ySelector,expressionData){
		//variables
	    var margin = {top: 40, right: 40, bottom: 40, left: 40};
	    var width = 800 - margin.left - margin.right;
	    var height = 800 - margin.top - margin.bottom;

	    //scales
	    var xScale = d3.scale.log()
	                    .domain(d3.range(0,numCols)) //Change to range of data
	                    .range([0,width],0.2);

	    var yScale = d3.scale.log()
	                    .domain(d3.range(0,numRows)) //Change to range of data
	                    .range([0,height],0.2);

	    var timeScale = d3.scale.ordinal()
	                    .domain(d3.range(0,4))
	                    .range(["E15","E16","E18","P1"]);

	    //Helper Functions
	    
	    //Setup svg
	    var svg = d3.select( '#genelistscatter' ).append( 'svg:svg' )
	    .attr( 'class', 'chart' )
	    .attr( 'width', width )
	    .attr( 'height', height )
	    .append('g')
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    //plot init
        var geneset = svg.selectAll(".circle")
                .data(expressionData)
                .enter().append("circle")
                    .attr("class","circle")
                    .attr("x", function (d, i) { return xScale(i); })
                    .attr("y", function (d, i) { return yScale(Math.floor(i/numCols))+3; })
                    .attr("stroke","#303030")
                    .on("mouseover", function(d, i) {
                      var pos = coords(
                          expressionData[i][timepoint+"_subcereb"].fpkm,
                          expressionData[i][timepoint+"_cpn"].fpkm,
                          expressionData[i][timepoint+"_corticothal"].fpkm);
                      marker.attr("cx", pos[0]);
                      marker.attr("cy", pos[1]);
                    });
    function redraw(){
        geneset
          .data(expressionData)
          .transition()
          .duration(300)
          .attr("r", function (d, i) {
            return rScale(Math.log(d3.max([d[timepoint+"_subcereb"].fpkm,
                                           d[timepoint+"_cpn"].fpkm,
                                           d[timepoint+"_corticothal"].fpkm])),
                                   10)
          })
          .attr("fill", function (d, i){
            return makeRGB(
              d[timepoint+"_subcereb"].fpkm,
              d[timepoint+"_cpn"].fpkm,
              d[timepoint+"_corticothal"].fpkm
            );
          });
    };

    svg.selectAll(".label")
      .data(expressionData)
      .enter().append("text")
        .attr("class", "gene-set-label")
        .attr("x", function (d, i) {
          return xScale(i);
        })
        .attr("y", function (d, i) {
          return yScale(Math.floor(i/numCols))+55;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(function(d) {
          return d.E16_subcereb.gene_id;
        });

    $(sliderSelector).on('change', function() {
      timepoint = timeScale($(this).val());
      $('#timeOutput').val(timepoint);

      redraw();
    });
	},
	};