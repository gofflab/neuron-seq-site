window.hive = {
  plot: function(selector, data) {
    var colors = ["steelblue", "green", "crimson"];

    //New Hive plot
    var width = 300;
    var height = 300;
    var innerRadius = 20;
    var outerRadius = 120;

    //Load data
    var celltypes = ["cpn","subcereb","corticothal"];
    var timepoints = ["E15","E16","E18","P1"];

    var nodes = [
      {"celltype":"cpn","timepoint":"E15"},
      {"celltype":"cpn","timepoint":"E16"},
      {"celltype":"cpn","timepoint":"E18"},
      {"celltype":"cpn","timepoint":"P1"},
      {"celltype":"subcereb","timepoint":"E15"},
      {"celltype":"subcereb","timepoint":"E16"},
      {"celltype":"subcereb","timepoint":"E18"},
      {"celltype":"subcereb","timepoint":"P1"},
      {"celltype":"corticothal","timepoint":"E15"},
      {"celltype":"corticothal","timepoint":"E16"},
      {"celltype":"corticothal","timepoint":"E18"},
      {"celltype":"corticothal","timepoint":"P1"},
    ];

    //Helper functions
    var angle = d3.scale.ordinal()
      .domain(celltypes)
      .rangePoints([0, 4* Math.PI/3]);

    var radius = d3.scale.ordinal()
      .domain(timepoints)
      .rangePoints([innerRadius,outerRadius]);

    //create svg object
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

    //This will be the tricky part
    //Draw the links
/*     svg.append("g")
      .attr("class","hivelinks")
      .selectAll(".hivelink")
      .data(data)
      .enter().append("path")
      .attr("class","hivelink")
      .attr("d", link())*/
//      .angle(function(d) { return angle(d.celltype_1); })
//      .radius(function(d) { return radius(d.timepoint_1); })

    //TODO: Make node drawing work.
    //Draw the nodes
    svg.append("g")
      .attr("class","hivenodes")
      .selectAll(".hivenode")
      .data(nodes)
      .enter().append("circle")
      .style("fill", function(d,i) { console.log(JSON.stringify(d)); console.log(Math.floor(i/4)); return colors[Math.floor(i/4)]; })
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
