window.gene_expression = {
  bars: function(selector, headers, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    if (!("width" in attr)) {
      attr.width = 800;
    }
    if (!("height" in attr)) {
      attr.height = 400;
    }
    if (!("margin" in attr)) {
      attr.margin = {left: 50, right: 10, bottom: 80, top: 10};
    }
    if (!("resizable" in attr)) {
      attr.resizable = false;
    }

    var chart_attr = {
      width:  attr.width+attr.margin.left+attr.margin.right,
      height: attr.height+attr.margin.top+attr.margin.bottom
    };

    var rangeWidth = attr.width / 4;
    var barPadding = rangeWidth / 20;
    var barWidth = (attr.width - (barPadding * 11)) / 18;
    var barSpan = barWidth + barPadding;
    var rangeSpan = barWidth * 3 + barPadding * 2;

    var svg = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .data([data])
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
      .attr(chart_attr);

    var chart = svg.append("svg:g")
                   .attr('transform', 'translate('+attr.margin.left+', '+attr.margin.top+')');

    if (attr.resizable) {
      var aspect_ratio = chart_attr.width / chart_attr.height;
      var chart_dom = $(selector).find('svg');
      $(window).on("resize", function() {
        var width = chart_dom.parent().width();
        svg.attr("width", width);
        svg.attr("height", width / aspect_ratio);
      }).trigger("resize");
    }

    var x0 = d3.scale.ordinal()
               .domain(headers[0])
               .rangeBands([0, attr.width]);

    var x1 = d3.scale.ordinal()
               .domain(headers[1])
               .rangeBands([0, attr.width]);

    var y = d3.scale.linear()
              .domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] )
              .rangeRound( [0, attr.height] );

    // Bars
    var bars = chart.append('g')
                    .attr('class', 'bars');

    bars.selectAll( 'rect' )
      .data( data )
      .enter().append( 'rect' )
      .attr( 'x', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5; } )
      .attr( 'y', function( d ) { return attr.height - y( d.fpkm ) + .5 } )
      .attr( 'width', barWidth)
      .attr( 'height', function( d ) { return y( d.fpkm ) } )
      .style({
        stroke: "white",
        fill:   function(d, i){return colors[i%3];}});

    // lines
    errorbars = chart.append('g')
      .attr('class','errorbars');
    topmarks = chart.append('g')
      .attr('class','errorbars');
    bottommarks = chart.append('g')
      .attr('class','errorbars');

    errorbars.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (barWidth / 2); } )
      .attr( 'x2', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (barWidth / 2); } )
      .attr( 'y1', function( d ) { return attr.height - y( d.conf_lo ) + .5 } )
      .attr( 'y2', function( d ) { return attr.height - y( d.conf_hi ) + .5 } )
      .style({
        "stroke": "black"});

    topmarks.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (barWidth / 4); } )
      .attr( 'x2', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (3 * barWidth / 4); } )
      .attr( 'y1', function( d ) { return attr.height - y( d.conf_hi ) + .5 } )
      .attr( 'y2', function( d ) { return attr.height - y( d.conf_hi ) + .5 } )
      .style({
        "stroke": "black"});

    bottommarks.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (barWidth / 4); } )
      .attr( 'x2', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (3 * barWidth / 4); } )
      .attr( 'y1', function( d ) { return attr.height - y( d.conf_lo ) + .5 } )
      .attr( 'y2', function( d ) { return attr.height - y( d.conf_lo ) + .5 } )
      .style({
        "stroke": "black"});


    // Axis
    var xAxis = d3.svg.axis()
      .scale(x0)
      .ticks(headers[0].length)
      .tickSize(6, 3, 1)
      .tickValues(headers[0]);

    var yAxis = d3.svg.axis()
      .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [attr.height, 0] ))
      .tickSize(6, 3, 1)
      .orient('left');

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + attr.height + ')')
      .call(xAxis)

    chart.selectAll('.axis line')
      .style({
        "stroke": "black"});

    chart.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + x0.range()[0] + ')')
      .call(yAxis)
      .append("text")
      .style()
      .style({
        "text-anchor": "end"})
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("FPKM");

    chart.selectAll('.tick line')
      .style({
        "stroke": "black"});

    var legend = chart.selectAll(".legend")
                      .data(headers[1])
                      .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(" + (((attr.width / 3) * i) + attr.margin.left + (attr.width/3*0.4)) + "," + (attr.height+attr.margin.top+attr.margin.bottom-40) + ")"; });

    legend.append("rect")
      .attr("transform", "translate(10,-9)")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d,i){return colors[i]});

    legend.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  },

  lines: function(selector, headers, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    if (!("width" in attr)) {
      attr.width = 800;
    }
    if (!("height" in attr)) {
      attr.height = 400;
    }
    if (!("margin" in attr)) {
      attr.margin = {left: 50, right: 10, bottom: 80, top: 10};
    }
    if (!("resizable" in attr)) {
      attr.resizable = false;
    }

    var chart_attr = {
      width:  attr.width+attr.margin.left+attr.margin.right,
      height: attr.height+attr.margin.top+attr.margin.bottom
    };

    var svg = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .data([data])
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
      .attr(chart_attr);

    var chart = svg.append("svg:g")
                   .attr('transform', 'translate('+attr.margin.left+', '+attr.margin.top+')');

    if (attr.resizable) {
      var aspect_ratio = chart_attr.width / chart_attr.height;
      var chart_dom = $(selector).find('svg');
      $(window).on("resize", function() {
        var width = chart_dom.parent().width();
        svg.attr("width", width);
        svg.attr("height", width / aspect_ratio);
      }).trigger("resize");
    }

    var chart_graphic = chart.append("svg:g")
                             .attr("class", "plot");

    chart_graphic.append("svg:clipPath")
      .attr("id", "clip-boundary")
      .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", attr.width)
        .attr("height", attr.height);

    var lines,
        xAxis, yAxis;

    var x = d3.scale.linear()
              .domain([0, headers[0].length-1])
              .range([0, attr.width]);

    var y = d3.scale.linear()
              .domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] )
              .rangeRound( [0, attr.height] );

    // Data
    var line = d3.svg.line()
      .x(function(d) { return x(headers[0].indexOf(d.timepoint)) })
      .y(function(d) { return attr.height - y(d.fpkm) + .5 });

    var data_lines = headers[1].map(function(elem) {
      return data.filter(function(datapoint) {
        return datapoint.celltype == elem;
      });
    });

    // Confidence areas
    errorPolys = chart_graphic.append('g')
      .attr('class','errorpolys');

    errorPolys.selectAll('polygon')
      .data( data_lines )
      .enter().append('polygon')
      .attr("points", function(d) {
        return [
          d.map(function(elem) {
            return [x(headers[0].indexOf(elem.timepoint)) , attr.height - y(elem.conf_lo) + 0.5].join(",")
          }).join(" "),
          d.map(function(elem) {
            return [x(headers[0].indexOf(elem.timepoint)) , attr.height - y(elem.conf_hi) + 0.5].join(",")
          }).reverse().join(" ")
        ].join(" ")
      })
      .style({
        "fill": function(d,i){ return colors[i%3] },
        "opacity": "0.1",
        "stroke": "none"});

    // Lines
    lines = chart_graphic.append('g')
      .attr('class', 'lines');

    lines.selectAll('path')
      .data(data_lines)
      .enter().append('path')
      .style({
        fill: "none",
        "stroke-width": attr.width/100,
        stroke: function(d, i){return colors[i%3];}})
      .attr('d', line)
      .attr("clip-path", "url(#clip-boundary)");

    // Axis
    if ((attr.margin.left+attr.margin.right) > 10) {
      xAxis = d3.svg.axis()
        .scale(x)
        .ticks(headers[0].length)
        .tickSize(6, 3, 1)
        .tickFormat(function(tick) {
          return headers[0][tick]
        });

      yAxis = d3.svg.axis()
        .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [attr.height, 0] ))
        .tickSize(6, 3, 1)
        .orient('left');

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + attr.height + ')')
        .call(xAxis);

      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append("text")
        .style()
        .style({
          "text-anchor": "end"})
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .text("FPKM");

      chart.selectAll('.axis line')
        .style({
          "stroke": "black"});

      chart.selectAll('.tick line')
        .style({
          "stroke": "black"});

      var legend = chart.selectAll(".legend")
                        .data(headers[1])
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(" + (((attr.width / 3) * i) + attr.margin.left + (attr.width/3*0.4)) + "," + (attr.height+attr.margin.top+attr.margin.bottom-40) + ")"; });

      legend.append("rect")
        .attr("transform", "translate(10,-9)")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d,i){return colors[i]});

      legend.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
    }
  },

  isoforms: function(selector, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    if (attr == undefined) { attr = {}; }
    attr.width  = attr.width  || 700;
    attr.height = attr.height || 50;
    attr.margin = attr.margin || 10;
    if (!("resizable" in attr)) {
      attr.resizable = false;
    }

    var chart_attr = {
      width:  attr.width,
      height: attr.height
    };

    var isoform_height = attr.height - attr.margin;
    var isoform_rail_height = 0.3;

    var isoform_names = Object.keys(data);

    // Get extents
    var x_min = Math.min.apply(null,
      isoform_names.map(function(isoform, i) {
        var isoform_data = data[isoform];
        return Math.min.apply(null,
          isoform_data.map(function(elem) {
            return elem.start;
          })
        );
      })
    );

    var x_max = Math.max.apply(null,
      isoform_names.map(function(isoform, i) {
        var isoform_data = data[isoform];
        return Math.max.apply(null,
          isoform_data.map(function(elem) {
            return elem.end;
          })
        );
      })
    );

    var x = d3.scale.linear()
              .domain( [x_min, x_max] )
              .range( [0, attr.width - attr.margin] );

    // For every isoform
    isoform_names.forEach(function(isoform, i) {
      var isoform_data = data[isoform];
      var starts = isoform_data.map(function(elem) {
        return elem.start;
      });

      var ends = isoform_data.map(function(elem) {
        return elem.end;
      });

      var dataset = isoform_data.map(function(elem) {
        return {start: elem.start, end: elem.end, width: elem.width};
      });

      var isoform_selector = selector + "#isoform-" + isoform.replace('.', '_');

      var svg = d3.select(isoform_selector)
        .append("svg:svg")
        .attr("class", "chart")
        .data([data])
        .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
        .attr(chart_attr);

      var chart = svg.append("svg:g")
                     .attr('transform', 'translate(5, 5)');

      if (attr.resizable) {
        var aspect_ratio = chart_attr.width / chart_attr.height;
        var chart_dom = $(selector).find('svg');
        $(window).on("resize", function() {
          var width = chart_dom.parent().width();
          svg.attr("width", width);
          svg.attr("height", chart_dom.parent().height());
        }).trigger("resize");
      }

      // Middle Rail
      var rail = chart.append('g')
                      .attr('class', 'rail');

      var x_min_local = Math.min.apply(null, starts);
      var x_max_local = Math.max.apply(null, ends);
      rail.append( 'rect' )
          .attr( 'x', x(x_min_local))
          .attr( 'y', (isoform_height-(isoform_height*isoform_rail_height))/2)
          .attr( 'width', x(x_max_local) - x(x_min_local))
          .attr( 'height', isoform_height * isoform_rail_height)
          .style({
            stroke: "none",
            fill:   "lightGray"});

      // Bars
      var bars = chart.append('g')
                      .attr('class', 'bars');

      bars.selectAll( 'rect' )
        .data( dataset )
        .enter().append( 'rect' )
        .attr( 'x', function(d) {
          return x(d.start)
        })
        .attr( 'y', 0.5)
        .attr( 'width', function(d) {
          var width = x(d.end) - x(d.start);
          if (width < 2) {
            width = 2;
          }
          return width;
        })
        .attr( 'height', isoform_height)
        .style({
          stroke: "none",
          fill:   "crimson"});
    });
  },

  clusterHeatmap: function(selector, headers, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    var gene_ids = Object.keys(data);

    if (attr == undefined) { attr = {}; }
    if (!("width" in attr)) {
      attr.width = 800;
    }
    if (!("height" in attr)) {
      attr.height = (20 * gene_ids.length);
    }
    if (!("margin" in attr)) {
      attr.margin = {left: 120, right: 10, bottom: 80, top: 10};
    }
    if (!("resizable" in attr)) {
      attr.resizable = false;
    }

    var chart_attr = {
      width:  attr.width+attr.margin.left+attr.margin.right,
      height: attr.height+attr.margin.top+attr.margin.bottom
    };

    var svg = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .data([data])
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
      .attr(chart_attr);

    var chart = svg.append("svg:g")
                   .attr('transform', 'translate('+attr.margin.left+', '+attr.margin.top+')');

    if (attr.resizable) {
      var aspect_ratio = chart_attr.width / chart_attr.height;
      var chart_dom = $(selector).find('svg');
      $(window).on("resize", function() {
        var width = chart_dom.parent().width();
        svg.attr("width", width);
        svg.attr("height", width / aspect_ratio);
      }).trigger("resize");
    }

    // Get extents
    var fpkm_max = Math.max.apply(null,
      gene_ids.map(function(gene_id, i) {
        return Math.max.apply(null,
          data[gene_id]
        );
      })
    );

    var fpkm_min = Math.min.apply(null,
      gene_ids.map(function(gene_id, i) {
        return Math.min.apply(null,
          data[gene_id]
        );
      })
    );

    var all_headers = [];
    headers[1].forEach(function(header) {
      headers[0].forEach(function(subheader) {
        all_headers.push(header+'_'+subheader);
      });
    });

    var x0 = d3.scale.ordinal()
               .domain(all_headers)
               .rangeBands([0, attr.width]);

    var x1 = d3.scale.ordinal()
               .domain(headers[1])
               .rangeBands([0, attr.width]);

    var y = d3.scale.ordinal()
              .domain(gene_ids)
              .rangeBands([0, attr.height]);

    // Axis
    var xAxis = d3.svg.axis()
      .scale(x0)
      .ticks(12)
      .tickSize(6, 3, 1)
      .tickFormat(function(d,i) {
        return headers[0][i % 4]
      })
      .orient('bottom');

    var xAxisLegend = d3.svg.axis()
      .scale(x1)
      .ticks(headers[1].length)
      .tickSize(6, 3, 0)
      .tickValues(headers[1])
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(data.length)
      .tickSize(6, 3, 1)
      .orient('left');

    chart.append('g')
      .attr('class', 'x axis')
      .attr("transform", "translate(0,"+attr.height+")")
      .call(xAxis);

    chart.append('g')
      .attr('class', 'x legend')
      .attr("transform", "translate(0,"+(attr.height+30)+")")
      .call(xAxisLegend);

    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    chart.selectAll('.tick line')
      .style({
        "fill": "none",
        "stroke": "none"});

    chart.selectAll('.tick text')
      .style({
        "cursor": "pointer"})
      .on("click", function(d) {
        document.location.href = "/pyramidal/genes/"+d
      });

    chart.selectAll('.axis line')
      .style({
        "stroke": "none"});

    var rows = chart.selectAll( '.rows' )
      .data( gene_ids )
      .enter().append('svg:g').attr("class", "rows")

    var map = rows.selectAll('rect')
      .data(function(gene_id,i,j) { return data[gene_id] })
      .enter().append('rect')
      .attr('x', function(gene,i,j) {
        var type_index = i % 3;
        var time_index = Math.floor(i/3);

        // cpn and corticothal are swapped in the cluster data
        if (type_index == 0) {
          type_index = 1;
        }
        else if (type_index == 1) {
          type_index = 0;
        }
        console.log(gene_ids[j] + ":" + headers[0][time_index] + "_" + headers[1][type_index] + " = " + gene);
        return x0(headers[0][time_index] + "_" + headers[1][type_index])
      })
      .attr('y', function(gene,i,j) { console.log(j); console.log(gene_ids[j]); return y(gene_ids[j])})
      .attr('width', attr.width / 12)
      .attr('height', y(gene_ids[1]) - y(gene_ids[0]))
      .style({
        stroke: "none",
        opacity: function(fpkm) {
          if (fpkm < 0) {
            return fpkm / fpkm_min;
          }
          else {
            return fpkm / fpkm_max;
          }
        },
        fill: function(fpkm,i,j) {
          if (fpkm < 0) {
            return colors[0];
          }
          else {
            return colors[2];
          }
        }
      });
  }
};
