// Gene set scatter plot
window.gene_set_scatter = {
	scatter: function(canvasSelector,xSelector,ySelector,expressionData){
		//variables
	    var margin = {top: 20, right: 20, bottom: 30, left: 40};
	    var width = 800 - margin.left - margin.right;
	    var height = 800 - margin.top - margin.bottom;

      //Initial Params
      var xCondition = $(xSelector).val();
          console.log(xCondition);
      var yCondition = $(ySelector).val();
          console.log(yCondition);
	    //scales
	    var xScale = d3.scale.log()
	                    .domain(d3.range(1, 100))
	                    .range([0,width]);

	    var yScale = d3.scale.log()
	                    .domain(d3.range(1,100))
	                    .range([height,0]);
      
      //Define X axis
      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");
          //.ticks(10);

      //Define Y axis
      var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");
          //.ticks(10);

	    //Setup svg
	    var svg = d3.select( canvasSelector ).append( 'svg:svg' )
	    .attr( 'class', 'chart' )
	    .attr( 'width', width + margin.left + margin.right)
	    .attr( 'height', height + margin.top + margin.bottom)
	    .append('g')
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Draw axes

      //Get initial domain
      yScale
          .domain([1,d3.max(expressionData, function(d) { return d[yCondition]+1 })]);

      xScale
        .domain([1,d3.max(expressionData, function(d) { return d[xCondition]+1 })]);

      //X-axis
      svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis)
         .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(xCondition);

      //Y-axis
      svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yCondition);

	    //plot init
      var geneset = svg.selectAll(".circle")
              .data(expressionData)
              .enter().append("circle")
                  .attr("class","dot")
                  .attr("cx", function (d, i) { return xScale(d[xCondition]+1); })
                  .attr("cy", function (d, i) { return yScale(d[yCondition]+1); })
                  .attr("r", 2)
                  .on("mouseover", myMouseOver)
                  .on("mouseout",myMouseOut)

      //Add labels
      geneset
        .append("svg:title")
                  .text(function(d) { return d.gene_id; });

      // add the tooltip area to the webpage
      var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
    
    function myMouseOver(d){
          d3.select(this)
                      .classed("selected",true)
                      .attr("r",4);
          
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);

          tooltip.html(d.gene_id + "<br/> (" + d[xCondition] + ", " + d[yCondition] + ")")
               .style("left", (d3.event.pageX + 8) + "px")
               .style("top", (d3.event.pageY - 32) + "px");
    }

    function myMouseOut(d){
        d3.select(this)
          .classed("selected",false)
          .attr("r",2);

        tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    }

    function redraw(){
        yScale
          .domain([1,d3.max(expressionData, function(d) { return d[yCondition]; })]);

        xScale
          .domain([1,d3.max(expressionData, function(d) { return d[xCondition]; })]);

        //Update x-axis
        svg.select(".x.axis")
          .transition()
            .duration(250)
            .call(xAxis);

        svg.select(".x.axis").select(".label")
          .transition()
            .duration(250)
            .text(xCondition.replace("_"," "));

        //Update y-axis
        svg.select(".y.axis")
          .transition()
            .duration(250)
            .call(yAxis);

        svg.select(".y.axis").select(".label")
          .transition()
            .duration(250)
            .text(yCondition.replace("_"," "));

        geneset
          .data(expressionData)
          .transition()
            .duration(250)
            .attr("cx", function (d, i) { return xScale(d[xCondition]+1); })
            .attr("cy", function (d, i) { return yScale(d[yCondition]+1); })

        };

    var brush = d3.svg.polybrush()
                    .x(d3.scale.linear().range([0, width]))
                    .y(d3.scale.linear().range([0, height]))
                    .on("brushstart", function() {
                      svg.selectAll(".selected").classed("selected", false);
                    })
                    .on("brush", function() {
                        // set the 'selected' class for the circle
                        svg.selectAll(".circle").classed("selected", function(d) {
                          //get the associated circle
                          
                          // set the 'selected' class for the path
                          if (brush.isWithinExtent(d[0], d[1])) {
                            geneset.classed("selected", true);
                            return true;
                          } else {
                            geneset.classed("selected", false);
                            return false;
                          }
                    });
              }); 

    // //brush
    // svg.append("svg:g")
    //     .attr("class", "brush")
    //     .call(brush);


    $(xSelector).add(ySelector).on('change', function() {
      //timepoint = timeScale($(this).val());
      xCondition = $(xSelector).val();
      yCondition = $(ySelector).val();
      redraw();
    });
	},
	};