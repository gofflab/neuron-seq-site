window.gene_set_viz = {
  draw: function(sliderSelector, canvasSelector, expressionData, diffData) {
    //variables
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var w = 850 - margin.left - margin.right;
    var h = 800 - margin.top - margin.bottom;
    var numCols = 10;

    var qFilter = 0.001;

    var timepoint = "P1";
    document.getElementById('slider').addEventListener('change', function() {
        timepoint = timeScale(document.getElementById("slider").value);
        redraw();
    });

    //scales
    var xScale = d3.scale.ordinal()
                    .domain(d3.range(0,numCols))
                    .rangeBands([0,w],0.2);

    var yScale = d3.scale.ordinal()
                    .domain(d3.range(0,Math.floor(expressionData.length/numCols)+1))
                    .rangeBands([0,h],0.2);

    var rScale = d3.scale.linear()
                    .domain([0,6])
                    .range([5,40])
                    .clamp(true);

    var timeScale = d3.scale.ordinal()
                    .domain(d3.range(0,4))
                    .range(["E15","E16","E18","P1"])

    // var borderScale = d3.scale.ordinal()
    //                 .domain([true,false])
    //                 .range(["red","black"])

    //Helper Functions
    function makeRGB(r,g,b){
        tot = r+g+b
        r_1 = (r/tot)*255
        g_1 = (g/tot)*255
        b_1 = (b/tot)*255
        return d3.rgb(r_1,g_1,b_1)
    };

    // function isSig(diffArray,timepoint){
    //     var sig = false;
    //     for (i=0;i<diffArray.length;i++){
    //         if(diffArray[i].timepoint_1 == diffArray[i].timepoint_2 == timepoint){
    //             if (diffArray[i].q_value<=qFilter){
    //                 sig = true;
    //             }
    //         }
    //     }
    //     return sig;
    // }

    //Initialize SVG
    var svg = d3.select( '#genelist' ).append( 'svg:svg' )
    .attr( 'class', 'chart' )
    .attr( 'width', w )
    .attr( 'height', h )
    //.style('position','absolute')
    .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var geneset = svg.selectAll(".circle")
                    .data(expressionData)
                    .enter().append("circle")
                        .attr("class","circle")
                        .attr("cx", function (d, i) { return xScale(i); })
                        .attr("cy", function (d, i) { return yScale(Math.floor(i/numCols)); })
                        .attr("r", function (d, i) { return rScale(Math.log(d3.max([
                            d[timepoint+"_subcereb"].fpkm,
                            d[timepoint+"_cpn"].fpkm,
                            d[timepoint+"_corticothal"].fpkm])),10)})
                        //.attr("fill","white")
                        .attr("fill", function (d, i){
                            return makeRGB(
                                d[timepoint+"_subcereb"].fpkm,
                                d[timepoint+"_cpn"].fpkm,
                                d[timepoint+"_corticothal"].fpkm);
                        })
                        .attr("stroke","black")
                    ;

    svg.selectAll(".label")
        .data(expressionData)
        .enter().append("text")
            .attr("class","label")
            .attr("x", function (d, i) { return xScale(i); })
            .attr("y", function (d, i) { return yScale(Math.floor(i/numCols))+3; })
            .attr("text-anchor", "middle")
            .attr("fill","black")
            .text(function(d){return d.E16_subcereb.gene_id; });

    function redraw(){
        geneset
            .data(expressionData)
            .transition()
                .duration(300)
                .attr("r", function (d, i) { return rScale(Math.log(d3.max([
                            d[timepoint+"_subcereb"].fpkm,
                            d[timepoint+"_cpn"].fpkm,
                            d[timepoint+"_corticothal"].fpkm])),10)
                })
                .attr("fill", function (d, i){
                            return makeRGB(
                                d[timepoint+"_subcereb"].fpkm,
                                d[timepoint+"_cpn"].fpkm,
                                d[timepoint+"_corticothal"].fpkm);
                });

    };

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
                .range(['CPN','CthPN',"ScPN"])

    legendFillColor = d3.scale.ordinal()
                .domain(d3.range(0,3))
                .range(["url(#gradientGreen)","url(#gradientBlue)","url(#gradientRed)"])

    //Helper Funcs
    // var triangle = d3.svg.line()
    //     .x(function(d){return [0,lw/2,lw];})
    //     .y(function(d){return [lh,0,lh];})
    //     ;

    //Create Canvas
    legend = d3.select( '#legend' )
                .append('svg:svg')
                .attr('class','legend')
                .attr( 'width', sw )
                .attr( 'height', sh )
                //.style('position','absolute')
                .append('g')
                .attr(
                       'transform',
                       'translate(' + (sw - lw)/2 + ',' + (sh - lh)/2 + ')'
                     );

    //SVG gradients
    defs = svg.append('defs');

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
                .attr('stop-opacity','0%')
                .attr('stop-color','#303030');

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
                .attr('stop-opacity','0%')
                .attr('stop-color','#303030');

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
                .attr('stop-opacity','0%')
                .attr('stop-color','#303030');

    //Triangles
    legend.selectAll('.triangle')
            .data(d3.range(0,3))
            .enter().append("path")
                .attr('class','triangle')
                //.attr('d',"M " + 0 + " " + lh +
                //            "L " + lw/2 + " " + 0 +
                //            "L " + lw + " " + lh +
                //            "L " + 0 + " " + lh +
                //            "Z")
                //.attr('transform',function(d){return "translate("+lw/2+","+lh/2+")";})
                .attr("d", "M "+0+" "+lh+" L "+lw/2+" "+0+" L "+lw+" "+lh+" z")
                .attr("stroke","black")
                .attr("transform",function(d){ return "rotate("+rotate(d)+","+lw/2+","+(lh/3)*2+")"})
                //.attr("rotation-point",lw/2+" "+lh/2)
                .attr("fill",function(d){return legendFillColor(d);})
                ;

    //Labels
    legend.selectAll('.legendLabel')
            .data(d3.range(0,3))
            .enter().append("text")
                .attr('class','legendLabel')
                .attr("x",lw/2)
                .attr("y",-5)
                .attr("text-anchor","middle")
                .attr("transform",function(d){ return "rotate("+rotate(d)+","+lw/2+","+(lh/3)*2+")"})
                .attr("fill",function(d){return legendColor(d);})
                .text(function(d){ return sampleScale(d);});
  }
};
