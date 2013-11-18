//New Hive plot
var width = 300,
    height = 300,
    innerRadius = 20,
    outerRadius = 120;
    //majorAngle = 2 * Math.PI / 3,
    //minorAngle = 1 * Math.PI / 12;

//Load data
var data = {{ gene.diffDataHive|safe }};
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
//Sample data
//{"name":"flare.analytics.cluster.AgglomerativeCluster","size":3938,"imports":["flare.animate.Transitioner","flare.vis.data.DataList","flare.util.math.IMatrix","flare.analytics.cluster.MergeEdge","flare.analytics.cluster.HierarchicalCluster","flare.vis.data.Data"]},
//{"name":"flare.analytics.cluster.CommunityStructure","size":3812,"imports":["flare.analytics.cluster.HierarchicalCluster","flare.animate.Transitioner","flare.vis.data.DataList","flare.analytics.cluster.MergeEdge","flare.util.math.IMatrix"]},
//{"name":"flare.analytics.cluster.HierarchicalCluster","size":6714,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.vis.data.Tree","flare.util.Arrays","flare.analytics.cluster.MergeEdge","flare.util.Sort","flare.vis.operator.Operator","flare.util.Property","flare.vis.data.Data"]},
//{"name":"flare.analytics.cluster.MergeEdge","size":743,"imports":[]},
//{"name":"flare.analytics.graph.BetweennessCentrality","size":3534,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.util.Arrays","flare.vis.data.Data","flare.util.Property","flare.vis.operator.Operator"]},

//Helper functions
var angle = d3.scale.ordinal()
    .domain(d3.range(celltypes.length + 1))
    .rangePoints([0, 2* Math.PI]);

var radius = d3.scale.linear()
    //.domain(d3.range(timepoints.length))
    //.rangePoints([innerRadius,outerRadius]);
    .range([innerRadius,outerRadius]);

var color = d3.scale.category10()
    .domain(d3.rangePoints(celltypes)); //TODO: make sure this is correct syntax

//create svg object on .hive
var svg = d3.select("#hive")
    .append("svg:svg")
    .attr("width", width)
    .attr("height",height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//Draw the axes
svg.selectAll(".hiveaxis")
    .data(d3.range(celltypes.length))
    .enter().append("line")
        .attr("class", "hiveaxis")
        .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
        .attr("x1", radius.range()[0])
        .attr("x2", radius.range()[1]);


//This will be the tricky part
//Draw the links
// svg.append("g")
//  .attr("class","hivelinks")
//  .selectAll(".hivelink")
//  .data(data)
//  .enter().append("path")
//  .attr("class","hivelink")
//  .attr("d", link())
//  .angle(function(d) { return angle(d.celltype_1); })
//  .radius(function(d) { return radius(d.timepoint_1); })

//TODO: Make node drawing work.
//Draw the nodes
svg.append("g")
    .attr("class","hivenodes")
    .selectAll(".hivenode")
        .data(nodes)
    .enter().append("g")
        .attr("class","hivenode")
        .style("fill", function(d) { return color(d.celltype); })
    .selectAll("circle")
        .data(nodes)
    .enter().append("circle")
        .attr("transform", function(d) { return "rotate(" + degrees(angle(d.celltype)) + ")"; })
        .attr("cx", function(d) { return radius(d.timepoint) })
        .attr("r", 5)

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