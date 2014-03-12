window.gene_expression = {
  /* Gene expression bar graph
   *
   * selector    - css selector for the chart
   * headers     - labels for the areas
   * options     - options:
   *   url       - the url to retrieve the JSON for this chart
   *   data      - the data to use to fill the chart
   *   colors    - an array of 3 colors to use for the chart
   *   width     - width of the chart in pixels
   *   height    - height of the chart in pixels
   *   margin    - object with left/right/bottom/top properties defining the margins
   *   resizable - when true, the chart will automatically resize to fit its container
   */
  bars: function(selector, headers, options) {
    if (typeof options === "undefined") {
      options = {};
    }

    if (!("colors" in options)) {
      options.colors = ["steelblue", "green", "crimson"];
    }

    if ("url" in options) {
      $.getJSON(options.url, function(data) {
        options.data = data;
        delete options['url'];

        window.gene_expression.bars(selector, headers, options);
      });
      return;
    }

    var colors = options.colors;
    var data = options.data;

    if (!("width" in options)) {
      options.width = 800;
    }
    if (!("height" in options)) {
      options.height = 400;
    }
    if (!("margin" in options)) {
      options.margin = {left: 50, right: 10, bottom: 80, top: 10};
    }
    if (!("resizable" in options)) {
      options.resizable = false;
    }

    var chart_attr = {
      width:  options.width+options.margin.left+options.margin.right,
      height: options.height+options.margin.top+options.margin.bottom
    };

    var rangeWidth = options.width / 4;
    var barPadding = rangeWidth / 20;
    var barWidth = (options.width - (barPadding * 11)) / 18;
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
                   .attr('transform', 'translate('+options.margin.left+', '+options.margin.top+')');

    if (options.resizable) {
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
               .rangeBands([0, options.width]);

    var x1 = d3.scale.ordinal()
               .domain(headers[1])
               .rangeBands([0, options.width]);

    var y = d3.scale.linear()
              .domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] )
              .rangeRound( [0, options.height] );

    // Bars
    var bars = chart.append('g')
                    .attr('class', 'bars');

    bars.selectAll( 'rect' )
      .data( data )
      .enter().append( 'rect' )
      .attr( 'x', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5; } )
      .attr( 'y', function( d ) { return options.height - y( d.fpkm ) + .5 } )
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
      .attr( 'y1', function( d ) { return options.height - y( d.conf_lo ) + .5 } )
      .attr( 'y2', function( d ) { return options.height - y( d.conf_hi ) + .5 } )
      .style({
        "stroke": "black"});

    topmarks.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (barWidth / 4); } )
      .attr( 'x2', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (3 * barWidth / 4); } )
      .attr( 'y1', function( d ) { return options.height - y( d.conf_hi ) + .5 } )
      .attr( 'y2', function( d ) { return options.height - y( d.conf_hi ) + .5 } )
      .style({
        "stroke": "black"});

    bottommarks.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (barWidth / 4); } )
      .attr( 'x2', function( d, i ) { return x0( d.timepoint ) + (rangeWidth/2) + (rangeSpan/2) - barWidth - (i%3) * barSpan - 0.5 + (3 * barWidth / 4); } )
      .attr( 'y1', function( d ) { return options.height - y( d.conf_lo ) + .5 } )
      .attr( 'y2', function( d ) { return options.height - y( d.conf_lo ) + .5 } )
      .style({
        "stroke": "black"});

    // Axis
    var xAxis = d3.svg.axis()
      .scale(x0)
      .ticks(headers[0].length)
      .tickSize(6, 3, 1)
      .tickValues(headers[0]);

    var yAxis = d3.svg.axis()
      .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [options.height, 0] ))
      .tickSize(6, 3, 1)
      .orient('left');

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + options.height + ')')
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
                      .attr("transform", function(d, i) { return "translate(" + (((options.width / 3) * i) + options.margin.left + (options.width/3*0.4)) + "," + (options.height+options.margin.top+options.margin.bottom-40) + ")"; });

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

  /* Gene expression line chart
   *
   * selector    - css selector for the chart
   * headers     - labels for the areas
   * options     - options:
   *   url       - the url to retrieve the JSON for this chart
   *   data      - the data to use to fill the chart
   *   colors    - an array of 3 colors to use for the chart
   *   width     - width of the chart in pixels
   *   height    - height of the chart in pixels
   *   margin    - object with left/right/bottom/top properties defining the margins
   *   resizable - when true, the chart will automatically resize to fit its container
   */
  lines: function(selector, headers, options) {
    if (typeof options === "undefined") {
      options = {};
    }

    if (!("colors" in options)) {
      options.colors = ["steelblue", "green", "crimson"];
    }

    if ("url" in options) {
      $.getJSON(options.url, function(data) {
        options.data = data;
        delete options['url'];

        window.gene_expression.lines(selector, headers, options);
      });
      return;
    }

    var colors = options.colors;
    var data = options.data;

    if (!("width" in options)) {
      options.width = 800;
    }
    if (!("height" in options)) {
      options.height = 400;
    }
    if (!("margin" in options)) {
      options.margin = {left: 50, right: 10, bottom: 80, top: 10};
    }
    if (!("resizable" in options)) {
      options.resizable = false;
    }

    var chart_attr = {
      width:  options.width+options.margin.left+options.margin.right,
      height: options.height+options.margin.top+options.margin.bottom
    };

    var svg = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .data([data])
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
      .attr(chart_attr);

    var chart = svg.append("svg:g")
                   .attr('transform', 'translate('+options.margin.left+', '+options.margin.top+')');

    if (options.resizable) {
      var aspect_ratio = chart_attr.width / chart_attr.height;
      var chart_dom = $(selector).find('svg');
      $(window).on("resize", function() {
        var width = chart_dom.parent().width();
        svg.attr("width", width);
        svg.attr("height", width / aspect_ratio);
      }).trigger("resize");
    }

    var uuid = Math.random() + "-" + (new Date().getTime());

    var chart_graphic = chart.append("svg:g")
                             .attr("class", "plot");

    chart_graphic.append("svg:clipPath")
      .attr("id", "clip-boundary-" + uuid)
      .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", options.width)
        .attr("height", options.height);

    var lines,
        xAxis, yAxis;

    var x = d3.scale.linear()
              .domain([0, headers[0].length-1])
              .range([0, options.width]);

    var y = d3.scale.linear()
              .domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] )
              .rangeRound( [0, options.height] );

    // Data
    var line = d3.svg.line()
      .x(function(d) { return x(headers[0].indexOf(d.timepoint)) })
      .y(function(d) { return options.height - y(d.fpkm) + .5 });

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
            return [x(headers[0].indexOf(elem.timepoint)) , options.height - y(elem.conf_lo) + 0.5].join(",")
          }).join(" "),
          d.map(function(elem) {
            return [x(headers[0].indexOf(elem.timepoint)) , options.height - y(elem.conf_hi) + 0.5].join(",")
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
        "stroke-width": options.width/400,
        stroke: function(d, i){return colors[i%3];}})
      .attr('d', line)
      .attr("clip-path", "url(#clip-boundary-" + uuid + ")");

    // Axis
    if ((options.margin.left+options.margin.right) > 10) {
      xAxis = d3.svg.axis()
        .scale(x)
        .ticks(headers[0].length)
        .tickSize(6, 3, 1)
        .tickFormat(function(tick) {
          return headers[0][tick]
        });

      yAxis = d3.svg.axis()
        .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [options.height, 0] ))
        .tickSize(6, 3, 1)
        .orient('left');

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + options.height + ')')
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
                        .attr("transform", function(d, i) { return "translate(" + (((options.width / 3) * i) + options.margin.left + (options.width/3*0.4)) + "," + (options.height+options.margin.top+options.margin.bottom-40) + ")"; });

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
    else {
      xAxis = d3.svg.axis()
        .scale(x)
        .ticks(headers[0].length)
        .tickSize(0, 0, 0)
        .tickFormat(function(tick) {
          return headers[0][tick]
        });

      yAxis = d3.svg.axis()
        .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [options.height, 0] ))
        .tickSize(0, 0, 0)
        .orient('left');

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + options.height + ')')
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
        .attr("dy", ".71em");

      chart.selectAll('.axis .domain')
        .style({
          "stroke": "#44f"});

      chart.selectAll('.tick .domain')
        .style({
          "stroke": "#44f"});

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
    var isoform_rail_height = 0.2;

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
        return {
          start: elem.start,
          end: elem.end,
          width: elem.width,
          direction: elem.strand == "+" ? "left-to-right" : "right-to-left"
        };
      });

      var isoform_selector = selector + "#isoform-" + isoform.replace('.', '_');

      var svg = d3.select(isoform_selector)
        .append("svg:svg")
        .attr("class", "chart")
        .data([data])
        .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
        .attr(chart_attr);

      var defs = svg.append('defs');

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

      defs.append("svg:clipPath")
        .attr("id", "clip-boundary-rail-" + isoform)
        .append("rect")
          .attr('x', x(x_min_local))
          .attr('y', (isoform_height-(isoform_height*isoform_rail_height))/2)
          .attr('width', x(x_max_local) - x(x_min_local))
          .attr('height', isoform_height * isoform_rail_height);

      rail.append( 'rect' )
          .attr( 'x', x(x_min_local))
          .attr( 'y', (isoform_height-(isoform_height*isoform_rail_height/4))/2)
          .attr( 'width', x(x_max_local) - x(x_min_local))
          .attr( 'height', isoform_height * isoform_rail_height / 4)
          .style({
            stroke: "none",
            fill:   "lightGray"});

      // Bars
      var bars = chart.append('g')
                      .attr('class', 'bars');

      var direction = "left-to-right";
      if (dataset.length > 1) {
        direction = dataset[0].direction;
      }

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

      // Draw arrows
      var rail_height = (isoform_height * isoform_rail_height);
      var rail_top    = (isoform_height - rail_height) / 2;
      var rail_bottom = (isoform_height + rail_height) / 2;
      var rail_middle = isoform_height / 2;
      rail.selectAll('.triangle')
        .data(d3.range(0, attr.width - attr.margin, rail_height))
        .enter().append( 'path' )
          .attr('class', 'triangle')
          .attr("d", function(x) {
            var path = "";
            if (direction == "left-to-right") {
              path = path + "M " + x + " " + rail_top + " ";
              path = path + "L " + (x + rail_height) + " " + rail_middle + " ";
              path = path + "L " + x + " " + rail_bottom + " z";
            }
            else {
              path = path + "M " + (x + rail_height) + " " + rail_top + " ";
              path = path + "L " + x + " " + rail_middle + " ";
              path = path + "L " + (x + rail_height) + " " + rail_bottom + " z";
            }
            return path;
          })
          .attr("clip-path", "url(#clip-boundary-rail-" + isoform + ")")
          .style({
            stroke: "none",
            fill:   "#bbb"});

      // Second Arrow Rail
      var arrow_clip =
        defs.append("svg:clipPath")
          .attr("id", "clip-boundary-arrows-" + isoform);

      // Clip only to the drawn rectangles within the expression
      arrow_clip.selectAll( 'rect' )
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
        .attr( 'height', isoform_height);

      var arrows = chart.append('g')
                        .attr('class', 'arrow-rail');
      arrows.selectAll('.triangle')
        .data(d3.range(0, attr.width - attr.margin, rail_height))
        .enter().append( 'path' )
          .attr('class', 'triangle')
          .attr("d", function(x) {
            var path = "";
            if (direction == "left-to-right") {
              path = path + "M " + x + " " + rail_top + " ";
              path = path + "L " + (x + rail_height) + " " + rail_middle + " ";
              path = path + "L " + x + " " + rail_bottom + " z";
            }
            else {
              path = path + "M " + (x + rail_height) + " " + rail_top + " ";
              path = path + "L " + x + " " + rail_middle + " ";
              path = path + "L " + (x + rail_height) + " " + rail_bottom + " z";
            }
            return path;
          })
          .attr("clip-path", "url(#clip-boundary-arrows-" + isoform + ")")
          .style({
            stroke: "none",
            fill:   "#Fbb"});
    });
  },

  pie: function(selector, data, id, attr){
    var color = d3.scale.category20();

    var timepoints    = ['E15','E16','E18','P1'];
    var celltypes     = ['cpn','subcereb','corticothal'];
    var tweenDuration = 500;
    var pieData       = [];
    var oldPieData    = [];

    if (!("width" in attr)) {
      attr.width = 400;
    }
    if (!("height" in attr)) {
      attr.height = 400;
    }
    if (!("radius" in attr)) {
      attr.radius = Math.min(attr.width, attr.height) / 2;
    }
    if (!("margin" in attr)) {
      attr.margin = {left: 50, right: 50, bottom: 50, top: 50};
    }
    if (!("resizable" in attr)) {
      attr.resizable = false;
    }

    var chart_attr = {
      width:  attr.width+attr.margin.left+attr.margin.right,
      height: attr.height+attr.margin.top+attr.margin.bottom
    }

    var nest = d3.nest()
                 .key(function(d) { return d.sample_name; })
                 .map(data, d3.map);

    // Mock a 'nest' model when there is no data so it displays an empty pie
    // chart with a "No Data" label
    if (data.length == 0) {
      data = [{"fpkm": 1}];
      data[0][id] = "No Data";

      nest = {
        get: function(d) {
          return data;
        },
      };
    }

    var timepoint = "E15";
    var celltype  = "cpn";

    var timescale = d3.scale.ordinal()
                      .domain(d3.range(0,4))
                      .range(timepoints);

    var celltime = timepoint + "_" + celltype;

    var pie = d3.layout.pie()
      .value(function(d) { return d.fpkm; })
      .sort(null);

    var arc = d3.svg.arc()
      .innerRadius(attr.radius - chart_attr.width/4)
      .outerRadius(attr.radius - 10);

    var svg = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 '+chart_attr.width+' '+chart_attr.height)
      .attr(chart_attr);

    var arcs = svg
      .append("g")
        .attr("transform", "translate(" + chart_attr.width / 2 + "," + chart_attr.height / 2 + ")")
        .selectAll(".arc")
        .data(pie(nest.get(celltime)))
        .enter().append("path")
          .attr("class", "arc")
          .attr("d", arc)
          .attr("fill", function(d,i) { return color(i); })
          .each(function(d) { this._current = d; });

    // Labels
    function addLabels() {
      svg.selectAll(".pieLabelBox").remove();
      svg.selectAll(".pieLabel").remove();
      var boxes = svg.append("g")
        .attr("transform", "translate(" + chart_attr.width / 2 + "," + chart_attr.height / 2 + ")")
        .selectAll(".pieLabelBox")
        .data(pie(nest.get(celltime)))
        .enter().append("rect")
          .attr('class', 'pieLabelBox');

      var labels = svg.append("g")
        .attr("transform", "translate(" + chart_attr.width / 2 + "," + chart_attr.height / 2 + ")")
        .selectAll(".pieLabel")
        .data(pie(nest.get(celltime)))
        .enter().append("text")
          .attr("class", "pieLabel")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("text-anchor", function(d){
            if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
              return "beginning";
            } else {
              return "end";
            }
          })
          .attr("fill",function(d,i) { return color(i); })
          .text(function(d) { return d.data[id]; })
          .each(function(d,i) {
            var center = arc.centroid(d);

            var box = d3.select(boxes[0][i]);

            // Determine placement within chart bounds
            var x = center[0];
            var y = center[1];

            var d = Math.sqrt(x*x + y*y);

            var new_x = x/d * (attr.radius+10);
            var new_y = y/d * (attr.radius+10);

            var bbox = this.getBBox();

            var dy = -7;
            if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5) {
              dy = 5;
            }

            // Force within the graph bounds
            if (d3.select(this).attr('text-anchor') == 'end') {
              if (new_x - 2 - bbox.width < -chart_attr.width/2) {
                new_x = -chart_attr.width/2 + bbox.width + 2;
              }

              box.attr("transform", "translate(" + (new_x-bbox.width-2) + ", "
                                                 + (new_y+dy-bbox.height) + ")")
                 .attr("width", bbox.width+4)
                 .attr("height", bbox.height + 4)
                 .style("fill", "rgba(255, 255, 255, 0.5)");
            }
            else {
              if (new_x + bbox.width > chart_attr.width/2) {
                new_x = chart_attr.width/2 - bbox.width;
              }
            }

            d3.select(this).attr("transform", "translate(" + new_x + "," + new_y + ")")
                           .attr("dy" , dy);
          });
    }

    addLabels();

    $(".inputPieCell").on("change", function() {
      celltype = this.value;
      celltime = timepoint + "_" + celltype;
      change(selector);
    });

    $(".inputPieTime").on("change", function() {
      timepoint = timescale(this.value);
      celltime  = timepoint + "_" + celltype;
      change(selector);
    });

    function change(selector) {
      //clearTimeout(timeout);
      pie.value(function(d) { return d.fpkm; })
      arcs = d3.select(selector)
                  .selectAll(".arc")
                  .data(pie(nest.get(celltime))); // compute the new angles


      arcs.transition()
          .duration(tweenDuration)
          .attrTween("d", arcTween); // redraw the arcs

      addLabels();
    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      //console.log(this._current);
      //console.log(a);
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        //console.log(arc(i(t)));
        return arc(i(t));
      };
    }

    // Add legend (for labels that do not fit)
  }
};
