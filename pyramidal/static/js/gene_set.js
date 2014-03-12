/*
 * GeneSet functionality
 *
 * This collection of functions maintains the geneset for the user.
 *
 * Example:
 * gene_set.add("Fezf2");      // Adds the given gene
 * gene_set.add("Foo");        // Adds the given gene
 * gene_set.contains("Fezf2"); // => true
 * gene_set.genes();           // => ["Fezf2", "Foo"]
 * gene_set.remove("Fezf2");   // Removes the given gene
 * gene_set.genes();           // => ["Foo"]
 * gene_set.count();           // => 1
 * gene_set.removeAll();      // Removes all the genes
 * gene_set.count();           // => 0
 *
 */

window.gene_set = {
  count: function() {
    return gene_set.genes().length;
  },

  add: function(gene_id) {
    var genes = gene_set.genes();
    if (genes.indexOf(gene_id) == -1) {
      $.cookie("geneSet", gene_set.genes().concat(gene_id), { path: '/' });
    }
  },

  contains: function(gene_id) {
    return (gene_set.genes().indexOf(gene_id) > -1);
  },

  genes: function() {
    var arr = $.cookie("geneSet");
    if (arr == undefined || arr == "") {
      return [];
    }
    return arr.split(",");
  },

  remove: function(gene_id) {
    var genes = gene_set.genes();
    var index = genes.indexOf(gene_id);
    if (index > -1) {
      genes.splice(index, 1);
      $.cookie("geneSet", genes, { path: '/' });
    }
  },

  removeAll: function() {
    $.cookie("geneSet", [], { path: '/' });
  },

  renderAddButtonAfter: function(gene_id, selector) {
    var el = $("<div></div>");
    el.addClass("gene_set_button");
    el.attr("id", "gene_set_button_"+gene_id);
    if (gene_set.contains(gene_id)) {
      el.addClass("remove_from_gene_set");
      el.text("added");
    }
    else {
      el.addClass("add_to_gene_set");
      el.text("gene set");
    }
    el.click(function(e) {
      if ($(this).hasClass("add_to_gene_set")) {
        $(this).removeClass("add_to_gene_set");
        $(this).addClass("remove_from_gene_set");
        $(this).text("added");
        gene_set.add(gene_id);
      }
      else {
        $(this).removeClass("remove_from_gene_set");
        $(this).addClass("add_to_gene_set");
        $(this).text("gene set");
        gene_set.remove(gene_id);
      }

      gene_set.renderDropdown();
    });

    $(selector).append(el);
  },

  renderDropdown: function() {
    var genes = gene_set.genes();

    var dropdown = $('#gene_set_dropdown');

    if (dropdown == undefined) {
      return;
    }

    dropdown.find('#gene_set_dropdown_view_link a')
            .attr('href', "/pyramidal/geneset/"+genes.join('+'));

    dropdown.find('#gene_set_dropdown_remove_all_link a').click(function(e) {
      gene_set.removeAll();

      var gene_set_button = $('.gene_set_button');
      if (!(gene_set_button == undefined)) {
        if (gene_set_button.hasClass("remove_from_gene_set")) {
          gene_set_button.trigger("click");
        }
      }

      e.preventDefault();
    });

    dropdown.find('.disabled').remove();
    dropdown.find('.gene_set_dropdown_item').remove();

    if (genes.length == 0) {
      dropdown.append('<li class="disabled"><a href="#">Empty...</a></li>');
    }
    else {
      genes.forEach(function(gene_id) {
        dropdown.append('<li class="gene_set_dropdown_item"><a href="#" class="gene_set_dropdown_remove">Remove '+gene_id+'</a></li>');
      });

      $('.gene_set_dropdown_remove').click(function(e) {
        var gene_id = $(this).text().slice(7);
        gene_set.remove(gene_id);
        var gene_set_button = $('.gene_set_button');
        if (!(gene_set_button == undefined)) {
          var tags = gene_set_button.attr("id").split('_');
          var gene_button_id = tags[tags.length-1];
          if (gene_button_id == gene_id) {
            gene_set_button.trigger("click");
          }
        }
        e.preventDefault();
      });
    }
  },
};

$(function() {
  gene_set.renderDropdown();

  $('#gene_set_dropdown_label').click(function(e) {
    gene_set.renderDropdown();
  });
});
