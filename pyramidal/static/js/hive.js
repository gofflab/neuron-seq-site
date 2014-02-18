window.hive = {
  /* Hive plotter
   *
   * selector: css selector for the element to place the svg hive plot
   * info_selector: css selector for where to place the table of info
   * options: an object that may have one of the following:
   *     url - where to pull JSON data for the plot from
   *    data - an object that contains the data
   *  colors - an array of 3 colors to use
   */
  plot: function(selector, info_selector, options) {
    if (typeof options === "undefined") {
      options = {};
    }

    if (!("colors" in options)) {
      options.colors = ["steelblue", "green", "crimson"];
    }

    if ("url" in options) {
      $.getJSON(options.url, function(data) {
         options.data = data;
      });
    }

    var colors = [options.colors[1], options.colors[0], options.colors[2]];
    var data = options.data;

    //New Hive plot
    var width  = 450;
    var height = 450;
    var innerRadius = (height/2)/6;
    var outerRadius = (height/2)*5/6;

    //Load data
    var celltypes = ["cpn","corticothal","subcereb"];
    var timepoints = ["E15","E16","E18","P1"];

    var nodesByName = {
      "E15_cpn":{"celltype":"cpn","timepoint":"E15","name":"E15_cpn"},
      "E16_cpn":{"celltype":"cpn","timepoint":"E16","name":"E16_cpn"},
      "E18_cpn":{"celltype":"cpn","timepoint":"E18","name":"E18_cpn"},
      "P1_cpn":{"celltype":"cpn","timepoint":"P1","name":"P1_cpn"},
      "E15_corticothal":{"celltype":"corticothal","timepoint":"E15","name":"E15_corticothal"},
      "E16_corticothal":{"celltype":"corticothal","timepoint":"E16","name":"E16_corticothal"},
      "E18_corticothal":{"celltype":"corticothal","timepoint":"E18","name":"E18_corticothal"},
      "P1_corticothal":{"celltype":"corticothal","timepoint":"P1","name":"P1_corticothal"},
      "E15_subcereb":{"celltype":"subcereb","timepoint":"E15","name":"E15_subcereb"},
      "E16_subcereb":{"celltype":"subcereb","timepoint":"E16","name":"E16_subcereb"},
      "E18_subcereb":{"celltype":"subcereb","timepoint":"E18","name":"E18_subcereb"},
      "P1_subcereb":{"celltype":"subcereb","timepoint":"P1","name":"P1_subcereb"},
    };

    var nodes= [
      {"celltype":"cpn","timepoint":"E15","name":"E15_cpn"},
      {"celltype":"cpn","timepoint":"E16","name":"E16_cpn"},
      {"celltype":"cpn","timepoint":"E18","name":"E18_cpn"},
      {"celltype":"cpn","timepoint":"P1","name":"P1_cpn"},
      {"celltype":"corticothal","timepoint":"E15","name":"E15_corticothal"},
      {"celltype":"corticothal","timepoint":"E16","name":"E16_corticothal"},
      {"celltype":"corticothal","timepoint":"E18","name":"E18_corticothal"},
      {"celltype":"corticothal","timepoint":"P1","name":"P1_corticothal"},
      {"celltype":"subcereb","timepoint":"E15","name":"E15_subcereb"},
      {"celltype":"subcereb","timepoint":"E16","name":"E16_subcereb"},
      {"celltype":"subcereb","timepoint":"E18","name":"E18_subcereb"},
      {"celltype":"subcereb","timepoint":"P1","name":"P1_subcereb"},
    ];

    //Helper functions
    var angle = d3.scale.ordinal()
      .domain(celltypes)
      .rangePoints([0, 4* Math.PI/3]);

    var radius = d3.scale.ordinal()
      .domain(timepoints)
      .rangePoints([innerRadius,outerRadius]);

    var logFCarray =
      d3.entries(data)
        .sort(function(a,b){
          return d3.ascending(
            Math.abs(a.value.values.log2_fold_change),
            Math.abs(b.value.values.log2_fold_change))
        });

    var fcMin = logFCarray[0].value.values.log2_fold_change;
    var fcMax = Math.abs(d3.min([logFCarray[logFCarray.length-1].value.values.log2_fold_change,10]));

    var linkSize = d3.scale.linear()
                           .domain([fcMin,fcMax])
                           .range([0.5,10])
                           .clamp(true);

    var info = d3.select(info_selector);
    var qFilter = 0.001;

    info.html("<h4>" +
      "Hover or tap a line to investigate" +
      "</h4>");

    // Create svg object
    var svg = d3.select(selector)
      .append("svg:svg")
      .attr("width", width)
      .attr("height",height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    //Draw the axes
    svg.selectAll(".hiveaxis")
      .data(celltypes)
      .enter().append("line")
      .attr("class", "hiveaxis")
      .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
      .attr("x1", radius.range()[0])
      .attr("x2", radius.range()[1]);

      // Draw the links.
      svg.append("g")
        .attr("class", "links")
        .selectAll(".link")
        .data(data)
        .enter().append("path")
        .filter(function(d) { return d.values.q_value <= qFilter })
        .attr("class", "link")
        .attr("d", link()
            .angle(function(d) { return angle(celltypes.indexOf(d.celltype)); })
            .radius(function(d) { return radius(d.timepoint); }))
        .style("stroke-width",function(d) {return linkSize(Math.abs(d.values.log2_fold_change))})
        .style("stroke","#999")
        .style("fill","none")
        .style("stroke-opacity",".3")
        .on("mouseover", function(d){
          d3.select(this)
          .classed("active",true)
          .style("stroke","#f00")
          .style("stroke-opacity","1");

        info.html("<h4>" +
          d.source.sample +
          " vs " +
          d.target.sample +
          "</h4> <table class='table table-striped table-condensed'>" +
          "<tr><td><h5>"+d.values.sample_1+"</h5></td><td>" + d.values.value_1 + "</td></tr>" +
          "<tr><td><h5>" + d.values.sample_2 +"</h5></td><td>" + d.values.value_2 + "</td></tr>" +
          "<tr><td><h5>Log2 Ratio:</h5></td><td>" +
          d.values.log2_fold_change + "</td></tr>" +
          "<tr><td><h5>Test Statistic:</h5></td><td>" +
          d.values.test_stat + "</td></tr>" +
          "<tr><td><h5>p-value:</h5></td><td>" +
          d.values.p_value + "</td></tr>" +
          "<tr><td><h5>q-value:</h5></td><td>" +
          d.values.q_value + "</td></tr>" +
          "<tr><td><h5>Significant</h5></td><td>" +
          d.values.significant + "</td></tr>" +
          "</table>");
        })
      .on("mouseout", function(d){
        d3.select(this)
        .classed("active", false)
        .style("stroke-width",function(d) {return linkSize(Math.abs(d.values.log2_fold_change))})
        .style("stroke","#999")
        .style("fill","none")
        .style("stroke-opacity",".3");
      });

   svg.selectAll(".hiveaxislabel")
      .data(celltypes)
      .enter()
        .append("text")
        .attr("y", 6)
        .attr("dy", ".9em")
        .attr("x", function(d,i) {
          if (i == 2) {
            return -(radius.range()[radius.range().length-1] / 4);
          }
          else {
            return radius.range()[radius.range().length-1] / 4;
          }
        })
        .attr("dx", function(d,i) {
          if (i == 2) {
            return "0.8em";
          }
          else {
            return "-0.8em";
          }
        })
        .attr("text-anchor", function(d,i) {
          if (i == 2) {
            return "end";
          }
          else {
            return "start";
          }
        })
        .attr("transform", function(d,i) {
          if (i == 2) {
            return "rotate(" + (180 + degrees(angle(d))) + ")";
          }
          else {
            return "rotate(" + degrees(angle(d)) + ")";
          }
        })
        .text(function(d){
          return d
        })
        .style("stroke", function(d,i) { return colors[i]; })
        .attr("text-decoration","none");

    //Draw the nodes
    svg.append("g")
      .attr("class","hivenodes")
      .selectAll(".hivenode")
      .data(nodes)
      .enter().append("circle")
      .style("fill", function(d,i) { return colors[Math.floor(i/4)]; })
      .attr("transform", function(d) { return "rotate(" + degrees(angle(d.celltype)) + ")"; })
      .attr("cx", function(d) { return radius(d.timepoint) })
      .attr("r", 5);

    // A shape generator for Hive links, based on a source and a target.
    // The source and target are defined in polar coordinates (angle and radius).
    // Ratio links can also be drawn by using a startRadius and endRadius.
    // This class is modeled after d3.svg.chord.
    function link() {
      var source = function(d) { return d.source; },
          target = function(d) { return d.target; },
          angle = function(d) { return d.angle; },
          startRadius = function(d) { return d.radius; },
          endRadius = startRadius,
          arcOffset = -Math.PI / 2;

      function link(d, i) {
        var s = node(source, this, d, i),
            t = node(target, this, d, i),
            x;
        if (t.a < s.a) x = t, t = s, s = x;
        if (t.a - s.a > Math.PI) s.a += 2 * Math.PI;
        var a1 = s.a + (t.a - s.a) / 3,
          a2 = t.a - (t.a - s.a) / 3;
        return s.r0 - s.r1 || t.r0 - t.r1
          ? "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
          + "L" + Math.cos(s.a) * s.r1 + "," + Math.sin(s.a) * s.r1
          + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
          + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
          + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1
          + "L" + Math.cos(t.a) * t.r0 + "," + Math.sin(t.a) * t.r0
          + "C" + Math.cos(a2) * t.r0 + "," + Math.sin(a2) * t.r0
          + " " + Math.cos(a1) * s.r0 + "," + Math.sin(a1) * s.r0
          + " " + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
          : "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
          + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
          + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
          + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1;
      }

      function node(method, thiz, d, i) {
        var node = method.call(thiz, d, i),
            a = +(typeof angle === "function" ? angle.call(thiz, node, i) : angle) + arcOffset,
            r0 = +(typeof startRadius === "function" ? startRadius.call(thiz, node, i) : startRadius),
            r1 = (startRadius === endRadius ? r0 : +(typeof endRadius === "function" ? endRadius.call(thiz, node, i) : endRadius));
        return {r0: r0, r1: r1, a: a};
      }

      link.source = function(_) {
        if (!arguments.length) return source;
        source = _;
        return link;
      };

      link.target = function(_) {
        if (!arguments.length) return target;
        target = _;
        return link;
      };

      link.angle = function(_) {
        if (!arguments.length) return angle;
        angle = _;
        return link;
      };

      link.radius = function(_) {
        if (!arguments.length) return startRadius;
        startRadius = endRadius = _;
        return link;
      };

      link.startRadius = function(_) {
        if (!arguments.length) return startRadius;
        startRadius = _;
        return link;
      };

      link.endRadius = function(_) {
        if (!arguments.length) return endRadius;
        endRadius = _;
        return link;
      };

      return link;
    }

    function degrees(radians) {
      return radians / Math.PI * 180 - 90;
    }
  }
}
