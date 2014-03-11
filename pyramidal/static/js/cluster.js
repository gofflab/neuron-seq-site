window.cluster = {
  heatmap: function(selector, headers, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    var gene_ids = Object.keys(data);

    if (attr == undefined) { attr = {}; }
    if (!("width" in attr)) {
      attr.width = 800;
    }
    if (!("height" in attr)) {
      attr.height = 5*gene_ids.length + 20*10 - 5*10;
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
        console.log(header+'_'+subheader);
        all_headers.push(header+'_'+subheader);
      });
    });

    gene_ids_subset = gene_ids;

    var x0 = d3.scale.ordinal()
               .domain(all_headers)
               .rangeBands([0, attr.width]);

    d3.range(all_headers.length).forEach(function(i) {
      var type_index = i % 3;
      var time_index = Math.floor(i / 3);

      // cpn and corticothal are swapped in the cluster data
      if (type_index == 0) {
        type_index = 1;
      }
      else if (type_index == 1) {
        type_index = 0;
      }

      console.log("i = " + i + "; header=" + headers[0][time_index] + "_" + headers[1][type_index]);
      var ret = x0(headers[1][type_index] + "_" + headers[0][time_index]);
      console.log(ret);
    });

    var x1 = d3.scale.ordinal()
               .domain(headers[1])
               .rangeBands([0, attr.width]);

    var y = d3.scale.ordinal()
              .domain(gene_ids_subset)
              .rangeBands([0, attr.height-150]);

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
      .attr('class', 'y axis');

    var rows = chart.selectAll( '.rows' )
      .data(gene_ids_subset)
      .enter().append('svg:g').attr("class", "rows")
                              .attr("id", function(d,i) { return "row-"+i; });

    var yAxisSelection = chart.append('g')
                              .attr('class', 'y axis');

    var single_row_height = y(gene_ids_subset[1]) - y(gene_ids_subset[0]);

    var createInset = function(row, i) {
      // Hide old inset
      if (toggled_row > -1) {
        d3.selectAll('#row-'+toggled_row+' .sub-rows')
          .remove();
      }

      // Get rid of / add back the row
      if (toggled_row > -1) {
        d3.selectAll('#row-'+toggled_row+' rect').style("fill-opacity", null);
      }
      d3.selectAll('#row-'+i+' rect').style("fill-opacity", 0);

      // Move rows down to fit expanded inset
      d3.selectAll('.rows')
        .attr("transform", function(d, j) { if (j <= (i+9)) return null; else return "translate(0,"+(20*10 - single_row_height*10)+")"; })
        .style("opacity", function(d, j) { if (j > i && j <= (i+9)) return "0.0"; else return null } );

      // Determine data for inset
      var datas = gene_ids.slice(i, (i+10));

      var sub_y = d3.scale.ordinal()
                          .domain(datas)
                          .rangeBands([0, 20*datas.length]);

      var subYAxis = d3.svg.axis()
        .scale(sub_y)
        .ticks(datas.length)
        .tickSize(6, 3, 1)
        .orient('left');

      yAxisSelection.attr("transform", "translate(0,"+y(gene_ids_subset[i])+")")
                    .call(subYAxis);

      chart.selectAll('.tick text')
        .on("click", function(d) {
          document.location.href = "/pyramidal/genes/"+d
        });

      // Create inset
      var sub_rows = d3.select('#row-'+i).selectAll('.sub-rows')
        .data(datas)
        .enter().append('svg:g')
        .attr("class", "sub-rows")
        .attr("id", function(d,j) { return "sub-row-"+i+"-"+j; });

      var sub_map = sub_rows.selectAll('rect')
        .data(function(gene_id, j, k) { return data[gene_id] })
        .enter().append('rect')
        .attr('x', function(gene, i, j) {
          var type_index = i % 3;
          var time_index = Math.floor(i / 3);

          // 0 - cpn
          // 1 - corticothal
          // 2 - subcereb

          // We want:
          // 0 - cpn
          // 1 - subcereb
          // 2 - corticothal

          // cpn and corticothal are swapped in the cluster data
          if (type_index == 0) {
            type_index = 1;
          }
          else if (type_index == 1) {
            type_index = 0;
          }

          // Subtract one
          type_index--;

          type_index = (type_index+3) % 3;

          return x0(headers[1][type_index] + "_" + headers[0][time_index]);
        })
        .attr('y', function(gene,j,k) {
          return y(gene_ids_subset[i]) + (k * 20);
        })
        .attr('width', attr.width / 12)
        .attr('height', 20)
        .style({
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

      toggled_row = i;
    };

    var toggled_row = -1;
    chart.selectAll('.rows')
         .on("click", createInset);

    var map = rows.selectAll('rect')
      .data(function(gene_id,i,j) { return data[gene_id] })
      .enter().append('rect')
      .attr('x', function(gene,i,j) {
        var type_index = i % 3;
        var time_index = Math.floor(i/3);

        // 0 - cpn
        // 1 - corticothal
        // 2 - subcereb

        // We want:
        // 0 - cpn
        // 1 - subcereb
        // 2 - corticothal

        // cpn and corticothal are swapped in the cluster data
        if (type_index == 0) {
          type_index = 1;
        }
        else if (type_index == 1) {
          type_index = 0;
        }

        // Subtract one
        type_index--;

        type_index = (type_index+3) % 3;

        return x0(headers[1][type_index] + "_" + headers[0][time_index]);
      })
      .attr('y', function(gene,i,j) { return y(gene_ids_subset[j]) })
      .attr('width', attr.width / 12)
      .attr('height', single_row_height)
      .style({
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

    var old_scale = 1.0;
    var zoom = d3.behavior.zoom()
      .on("zoom", function() {
        var delta = -4;
        if (old_scale > d3.event.scale) {
          delta = 4;
        }
        old_scale = d3.event.scale;
        var new_toggled = toggled_row + delta;

        if (new_toggled < 0) {
          new_toggled = 0;
        }
        else if (new_toggled > gene_ids.length - 10) {
          new_toggled = gene_ids.length - 10;
        }

        createInset(d3.select("#row-" + new_toggled), new_toggled);
      });

    chart.call(zoom);

    createInset(d3.select('#row-0'), 0);
  }
};
