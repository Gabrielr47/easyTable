/*
 Table plugin for jQuery
 Copyright (c) 2016 Gabriel Rodrigues e Gabriel Leite (http://gabrielr47.github.io/)
 Licensed under the MIT license
 Version: 0.2
 */

$.fn.easyTable = function (options) {
   var trIndex = 'all';
   this.options = {
      tableStyle: 'table easyTable',
      hover: 'btn-success',
      buttons: true,
      select: true,
      sortable: true,
      scroll: {active: false, height: '400px'}
   };
   this.message = {
      all: 'Marcar todos registros.',
      clear: 'Desmarcar todos registos.',
      search: 'Pesquisar em'
   };
   this.select = function () {
      var table = this;
      var options = this.options;
      var posCurrentTr = 0;
      var pressCrl = false;
      var pressShift = false;
      var pressDir = '';
      var posIniShift = 0;
      var maxLength = table.find('tbody tr').length - 1;
      table.find('tbody').on('click', 'tr', function () {
         if (pressCrl) {
            $(this).toggleClass(options.hover);
            posCurrentTr = $(this).index();
            posIniShift = posCurrentTr;
         } else if (pressShift) {
            $(this).toggleClass(options.hover);
         } else {
            table.find('tbody tr').removeClass(options.hover);
            $(this).addClass(options.hover);
            posCurrentTr = $(this).index();
            posIniShift = posCurrentTr;
         }
      });

      table.on('keydown', function (e) {

         if ((e.shiftKey) && (e.which === 40)) {
            if (posCurrentTr < (maxLength)) {
               if (pressDir === '') {
                  pressDir = 'Down';
               }
               if (pressDir === 'Up' && (posCurrentTr < posIniShift)) {
                  table.find('tbody tr').eq(posCurrentTr).click();
                  posCurrentTr++;
               } else if ((posCurrentTr === posIniShift) && (pressDir !== 'Down')) {
                  pressDir = '';
                  posCurrentTr++;
                  table.find('tbody tr').eq(posCurrentTr).click();
               } else {
                  posCurrentTr++;
                  if (!table.find('tbody tr').eq(posCurrentTr).hasClass(options.hover)) {
                     table.find('tbody tr').eq(posCurrentTr).click();
                  }
               }
            }
         } else if ((e.shiftKey) && (e.which === 38)) {
            if (posCurrentTr > 0) {
               if (pressDir === '') {
                  pressDir = 'Up';
               }
               if (pressDir === 'Down' && (posCurrentTr > posIniShift)) {
                  table.find('tbody tr').eq(posCurrentTr).click();
                  posCurrentTr--;
               } else if ((posCurrentTr === posIniShift) && (pressDir !== 'Up')) {
                  pressDir = '';
                  posCurrentTr--;
                  table.find('tbody tr').eq(posCurrentTr).click();
               } else {
                  posCurrentTr--;
                  if (!table.find('tbody tr').eq(posCurrentTr).hasClass(options.hover)) {
                     table.find('tbody tr').eq(posCurrentTr).click();
                  }
               }
            }

         } else if (e.which === 16) {
            pressShift = true;
         } else if (e.which === 17) {
            pressCrl = true;
         }

      });

      table.on('keyup', function (e) {
         if (e.which === 16) {
            pressShift = false;
         } else if (e.which === 17) {
            pressCrl = false;
         }
      });
   };
   this.sortable = function () {
      function sortTr(table, col, reverse) {
         var tb = table.tBodies[0];
         var tr = Array.prototype.slice.call(tb.rows, 0);
         var i;
         reverse = -((+reverse) || -1);
         var str1;
         var str2;
         tr = tr.sort(function (a, b) {

            if (a.cells[col].children[0] === undefined) {
               str1 = a.cells[col].textContent.trim();
               str2 = b.cells[col].textContent.trim();
            } else {
               str1 = a.cells[col].getElementsByTagName(a.cells[col].children[0].tagName)[0].value;
               str2 = b.cells[col].getElementsByTagName(a.cells[col].children[0].tagName)[0].value;
            }

            if (!isNaN(str1)) {
               if (str1.length === 1) {
                  str1 = '0' + str1;
               }
               if (str2.length === 1) {
                  str2 = '0' + str2;
               }
            }
            return reverse * (str1.localeCompare(str2));
         });

         for (i = 0; i < tr.length; ++i) {
            tb.appendChild(tr[i]);
         }
      }

      this.makeSortable = function (table) {
         var th = table.tHead;
         var tablePlugin = this;
         var i;
         th && (th = th.rows[0]) && (th = th.cells);

         if (th) {
            i = th.length;
         } else {
            return;
         }

         while (--i >= 0) {
            (function (i) {
               var dir = 1;
               $(th[i]).append(' <i class="fa fa-sort-amount-asc  hidden" data-order="up"></i>');
               $(th[i]).append(' <i class="fa fa-sort-amount-desc hidden" data-order="down"></i>');
               $(th[i]).click(function () {
                  trIndex = $(th[i]).index();
                  $("#search").attr('placeholder', tablePlugin.message.search + ' ' + $(th[i]).text());
                  sortTr(table, i, (dir = 1 - dir));
                  if ((1 - dir) === 1) {
                     $(th).find('i[data-order=down],i[data-order=up]').addClass('hidden');
                     $(th[i]).find('i[data-order=up]').removeClass('hidden');
                  } else {
                     $(th).find('i[data-order=down],i[data-order=up]').addClass('hidden');
                     $(th[i]).find('i[data-order=down]').removeClass('hidden');
                  }
               });
            }(i));
         }
      };

      this.makeAllSortable = function (table) {
         var t = table;
         var i = t.length;
         while (--i >= 0) {
            this.makeSortable(t[i]);
         }
      };

      this.makeAllSortable(this);

   };
   this.buttons = function () {
      var table = this;
      var menu = '<div id=\'easyMenuTable\' class=\'row\'><div class=\'col-md-6 pull-left\'></div> <div class=\'col-md-4 pull-right\'></div></div>';
      var all = '<button id=\'all\' class=\'btn ' + this.options.hover + ' btn-sm\' ' +
              'data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + this.message.all + '\'><i class=\'fa fa-check\'></i></button>';
      var clear = '<button  id=\'clear\' class=\'btn btn-danger btn-sm\'  ' +
              'data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + this.message.clear + '\'><i class=\'fa fa-close\'></i></button>';
      this.parent().prepend(menu);
      var menuId = $("#easyMenuTable .pull-left");
      menuId.append(all + clear);
      $('[data-toggle="tooltip"]').tooltip();
      all = $("#easyMenuTable .pull-left #all");
      clear = $("#easyMenuTable .pull-left #clear");
      if (this.options.select) {
         all.click(function () {
            table.find('tbody tr').addClass(table.options.hover);
         });
         clear.click(function () {
            table.find('tbody tr').removeClass(table.options.hover);
         });
      } else {
         console.log('allow the method select to this work');
      }
   };
   this.filter = function () {
      var table = this;
      var menuId = $("#easyMenuTable .pull-right");
      var search = '<input type=\'text\' class=\'form-control\' placeholder=\'' + this.message.search + '\' id=\'search\'>';
      menuId.prepend(search);
      if (trIndex === 'all') {
         $("#search").attr('placeholder', $("#search").attr('placeholder') + ' Todos');
      } else {
      }
      $("#search").keyup(function () {
         var colunaSel = false;
         var termo = $(this).val().toLowerCase();
         table.find('tbody tr').each(function () {
            if (trIndex === 'all') {
               var td = $(this).find('td');
            } else {
               var td = $(this).find("td:eq(" + trIndex + ")");
            }
            if (td.text().toLowerCase().indexOf(termo) > -1) {
               colunaSel = true;
            }
            if ((!colunaSel)) {
               $(this).hide();
            } else
               $(this).show();
            colunaSel = false;

         });
      });
   };
   this.scroll = function () {
      this.find('tbody').css('height', this.options.scroll.height);
   };
   this.getSelected = function (col) {
      var selected = [];
      this.find('tbody .' + this.options.hover).each(function (key, val) {
         selected.push($(val).find('td').eq(col).text());
      });
      return selected;
   };
   this.create = function () {
      $("#easyMenuTable").remove();
      this.options = $.extend({}, this.options, options);
      this.addClass(this.options.tableStyle);
      this.attr('tabindex', 0);

      if (this.options.select) {
         this.select();
      }
      if (this.options.sortable) {
         this.sortable();
      }
      if (this.options.buttons) {
         this.buttons();
         this.filter();
      }
      if (this.options.scroll.active) {
         this.scroll();
      }
   };
   this.create();
   return this;
};

