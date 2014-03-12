window.gene_set_viz = {
  // TODO: extract out legend drawing and handling
  legend: function(legendSelector) {
    //Setup legend
    var sw = 200;
    var sh = 200;

    var lw = 150;
    var lh = lw*(Math.sqrt(3)/2);

    //Scales
    rotate = d3.scale.ordinal()
      .domain(d3.range(0,3))
      .rangeBands([0,360]);

    legendColor = d3.scale.ordinal()
      .domain(d3.range(0,3))
      .range(["green","blue","red"]);

    sampleScale = d3.scale.ordinal()
      .domain(d3.range(0,3))
      .range(['CPN','CThPN','ScPN'])


    legendFillColor = d3.scale.ordinal()
      .domain(d3.range(0,3))
      .range(["url(#gradientGreen)",
              "url(#gradientBlue)",
              "url(#gradientRed)"])

    //Create Canvas
    legend = d3.select(legendSelector)
      .append('svg:svg')
        .attr('class','legend')
        .attr( 'width', sw )
        .attr( 'height', sh )
        .append('g')
          .attr('transform', 'translate(' + (sw - lw)/2 + ',' + (sh - lh)/2 + ')');

    //SVG gradients
    defs = legend.append('defs');

    var gradientGreen = defs.append( 'linearGradient' )
      .attr( 'id', 'gradientGreen' )
      .attr( 'x1', '0' )
      .attr( 'x2', '0' )
      .attr( 'y1', '0' )
      .attr( 'y2', '1' );

    gradientGreen.append('stop')
      .attr('class','gradientGreenStop1')
      .attr('offset','0%')
      .attr('stop-color','#00ff00');

    gradientGreen.append('stop')
      .attr('class','gradientGreenStop2')
      .attr('offset','100%')
      .attr('stop-opacity','0')
      .attr('stop-color','#00ff00');

    var gradientRed = defs.append( 'linearGradient' )
      .attr( 'id', 'gradientRed' )
      .attr( 'x1', '0' )
      .attr( 'x2', '0' )
      .attr( 'y1', '0' )
      .attr( 'y2', '1' );

    gradientRed.append('stop')
      .attr('class','gradientRedStop1')
      .attr('offset','0%')
      .attr('stop-color','#ff0000');

    gradientRed.append('stop')
      .attr('class','gradientRedStop2')
      .attr('offset','100%')
      .attr('stop-opacity','0')
      .attr('stop-color','#ff0000');

    var gradientBlue = defs.append( 'linearGradient' )
      .attr( 'id', 'gradientBlue' )
      .attr( 'x1', '0' )
      .attr( 'x2', '0' )
      .attr( 'y1', '0' )
      .attr( 'y2', '1' );

    gradientBlue.append('stop')
      .attr('class','gradientBlueStop1')
      .attr('offset','0%')
      .attr('stop-color','#0000ff');

    gradientBlue.append('stop')
      .attr('class','gradientBlueStop2')
      .attr('offset','100%')
      .attr('stop-opacity','0')
      .attr('stop-color','#0000ff');

    //Triangles
    legend.selectAll('.triangle')
      .data(d3.range(0,3))
      .enter().append("path")
        .attr('class','triangle')
        .attr("d", "M "+0+" "+lh+" L "+lw/2+" "+0+" L "+lw+" "+lh+" z")
        .attr("stroke","#606060")
        .attr("stroke-opacity", "0.5")
        .attr("transform",function(d) {
          return "rotate("+rotate(d)+","+lw/2+","+(lh/3)*2+")"
        })
        .attr("fill",function(d) {
          return legendFillColor(d);
        });

    //Labels
    legend.selectAll('.legendLabel')
      .data(d3.range(0,3))
      .enter().append("text")
        .attr('class','gene-set-legend-label')
        .attr("x",lw/2)
        .attr("y",-5)
        .attr("text-anchor","middle")
        .attr("transform",function(d) {
          return "rotate("+rotate(d)+","+lw/2+","+(lh/3)*2+")"
        })
        .attr("fill",function(d) {
          return legendColor(d);
        })
        .text(function(d) {
          return sampleScale(d);
        });

    var marker = legend.append("circle")
      .attr("class", "gene-set-legend-marker")
      .attr("cx", lw/2.0)
      .attr("cy", lh/2.0 + 10)
      .attr("r",  5);
  },

  // Tabular visualizer. Neat and orderly.
  tabular: function(sliderSelector, canvasSelector, expressionData, diffData) {
    var marker = d3.select('.gene-set-legend-marker');

    //variables
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var numCols = 10;
    var numRows = Math.floor(expressionData.length/numCols) + 1;
    var width = 850 - margin.left - margin.right;
    var height = 130 * numRows + margin.top + margin.bottom;

    var qFilter = 0.001;

    //scales
    var xScale = d3.scale.ordinal()
                    .domain(d3.range(0,numCols))
                    .rangeBands([0,width],0.2);

    var yScale = d3.scale.ordinal()
                    .domain(d3.range(0,numRows))
                    .rangeBands([0,height],0.2);

    var rScale = d3.scale.linear()
                    .domain([0,6])
                    .range([5,40])
                    .clamp(true);

    var timeScale = d3.scale.ordinal()
                    .domain(d3.range(0,4))
                    .range(["E15","E16","E18","P1"]);

    var timepoint = $('#timeOutput').val();

    //Helper Functions

    // Computes a rgb color from the given raw values
    function makeRGB(r,g,b){
        tot = r+g+b
        r_1 = (r/tot)*255
        g_1 = (g/tot)*255
        b_1 = (b/tot)*255
        return d3.rgb(r_1,g_1,b_1)
    };

    // Computes x,y coord on triangle from barycentric (rgb) coord
    function coords(r,g,b) {
      var lw = 150;
      var lh = lw*(Math.sqrt(3)/2);

      tot = r+g+b;
      r_1 = (r/tot);
      g_1 = (g/tot);
      b_1 = (b/tot);
      return [r_1 * 0  + g_1 * (lw/2) + b_1 * lw,
              r_1 * lh + g_1 * 0      + b_1 * lh];
    };

    //Initialize SVG
    var svg = d3.select( '#genelist' ).append( 'svg:svg' )
    .attr( 'class', 'chart' )
    .attr( 'width', width )
    .attr( 'height', height )
    .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var geneset = svg.selectAll(".circle")
                    .data(expressionData)
                    .enter().append("circle")
                        .attr("class","circle")
                        .attr("cx", function (d, i) { return xScale(i); })
                        .attr("cy", function (d, i) { return yScale(Math.floor(i/numCols))+3; })
                        .attr("r",  function (d, i) { return rScale(Math.log(d3.max([
                                    d[timepoint+"_subcereb"].fpkm,
                                    d[timepoint+"_cpn"].fpkm,
                                    d[timepoint+"_corticothal"].fpkm])),10)
                        })
                        .attr("fill", function (d, i){
                            return makeRGB(
                                d[timepoint+"_subcereb"].fpkm,
                                d[timepoint+"_cpn"].fpkm,
                                d[timepoint+"_corticothal"].fpkm);
                        })
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

  // Clustering based visualizer.
  //
  // Good for seeing general trend differences.
  // Bad for tracking individual genes and keeping order.
  cluster: function(sliderSelector, canvasSelector, expressionData, diffData) {
    var marker = d3.select('.gene-set-legend-marker');

    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var numCols = 10;
    var numRows = Math.floor(expressionData.length/numCols) + 1;
    var width = 850 - margin.left - margin.right;
    var height = 130 * numRows + margin.top + margin.bottom;

    //Helper Functions
    function makeRGB(r,g,b){
      tot = r+g+b;
      r_1 = (r/tot)*255;
      g_1 = (g/tot)*255;
      b_1 = (b/tot)*255;
      return d3.rgb(r_1,g_1,b_1);
    };

    // Computes x,y coord on triangle from barycentric (rgb) coord
    function coords(r,g,b) {
      var lw = 150;
      var lh = lw*(Math.sqrt(3)/2);

      tot = r+g+b;
      r_1 = (r/tot);
      g_1 = (g/tot);
      b_1 = (b/tot);
      return [r_1 * 0  + g_1 * (lw/2) + b_1 * lw,
              r_1 * lh + g_1 * 0      + b_1 * lh];
    };

    // Scales
    var xScale = d3.scale.ordinal()
                    .domain(d3.range(0,numCols))
                    .rangeBands([0,width],0.2);

    var yScale = d3.scale.ordinal()
                    .domain(d3.range(0,Math.floor(expressionData.length/numCols)+1))
                    .rangeBands([0,height],0.2);

    var rScale = d3.scale.linear()
                    .domain([0,6])
                    .range([5,40])
                    .clamp(true);

    var timeScale = d3.scale.ordinal()
                    .domain(d3.range(0,4))
                    .range(["E15","E16","E18","P1"]);

    var timepoint = $('#timeOutput').val();

    var circles = [];

    circles.push({});
    circles[0].radius = 0;
    circles[0].fixed = true;

    // Create a list of circles
    expressionData.forEach(function(el, idx) {
      var circle = {
        weight: 100,
        x: xScale(idx) + margin.left,
        y: yScale(Math.floor(idx/numCols))+3+margin.top,
        radius: rScale(Math.log(d3.max([el[timepoint+"_subcereb"].fpkm,
                                        el[timepoint+"_cpn"].fpkm,
                                        el[timepoint+"_corticothal"].fpkm]),
                                10))
      };

      circles.push(circle);
    });

    var svg = d3.select(canvasSelector).append("svg")
      .attr("width", width)
      .attr("height", height);

    var tooltip = d3.select("body").append("div")
                     .style("position", "absolute")
                     .style("z-index", "10")
                     .style("visibility", "hidden");

    var geneset = svg.selectAll("circle")
      .data(circles.slice(1))
      .enter().append("circle")
      .attr("cx", function(d) { return d.x })
      .attr("cy", function(d) { return d.y })
      .attr("r", function(d, i) { return d.radius; })
      .attr("stroke", "#303030")
      .attr("fill", function (d, i) {
        return makeRGB(
            expressionData[i][timepoint+"_subcereb"].fpkm,
            expressionData[i][timepoint+"_cpn"].fpkm,
            expressionData[i][timepoint+"_corticothal"].fpkm);
      })
      .on("mouseover", function(d, i) {
        var pos = coords(
            expressionData[i][timepoint+"_subcereb"].fpkm,
            expressionData[i][timepoint+"_cpn"].fpkm,
            expressionData[i][timepoint+"_corticothal"].fpkm);
        marker.attr("cx", pos[0]);
        marker.attr("cy", pos[1]);
        return tooltip.text(expressionData[i].E16_subcereb.gene_id)
                      .style("visibility", "visible");
      })
      .on("mousemove", function() {
        return tooltip.style("top",  (d3.event.pageY-10) + "px")
                      .style("left", (d3.event.pageX+10) + "px");
      })
      .on("mouseout", function() {
        return tooltip.style("visibility", "hidden");
      });

    var force = d3.layout.force()
      .gravity(0.02)
      .charge(0)
      .nodes(circles)
      .size([width, height]);

    force.start();

    force.on("tick", function(e) {
      var q = d3.geom.quadtree(circles),
      i = 0,
      n = circles.length;

      while (++i < n) q.visit(collide(circles[i]));

      svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });

    function collide(node) {
      var r = node.radius + 16,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = node.radius + quad.point.radius;
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    }

    function redraw(){
      geneset
        .data(circles.slice(1))
        .transition()
        .duration(300)
        .attr("r", function(d, i) { return d.radius; })
        .attr("fill", function (d, i) {
          return makeRGB(
            expressionData[i][timepoint+"_subcereb"].fpkm,
            expressionData[i][timepoint+"_cpn"].fpkm,
            expressionData[i][timepoint+"_corticothal"].fpkm);
        });

      force.resume();
    };

    $(sliderSelector).on('change', function() {
        timepoint = timeScale($(this).val());
        $('#timeOutput').val(timepoint);
        expressionData.forEach(function(el, idx) {
          circles[idx+1].radius =
            rScale(Math.log(d3.max([el[timepoint+"_subcereb"].fpkm,
                                    el[timepoint+"_cpn"].fpkm,
                                    el[timepoint+"_corticothal"].fpkm]),
                            10));
        });

        redraw();
    });
  }
};
