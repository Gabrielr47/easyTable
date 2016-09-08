/*
 Table plugin for jQuery
 Copyright (c) 2016 Gabriel Rodrigues e Gabriel Leite (http://gabrielr47.github.io/)
 Licensed under the MIT license
 Version: 0.3
 
 Fix By FearLess
 Fix bug initialize more than 1 table in a page 
	$('#table1').easyTable();
	$('#table2').easyTable();
 a little fix on sorting empty tbody entities
 Add
	custom message
	$('#table1').easyTable({
		message:{all:'Select All',clear:'Cancel',search:'Look For'}
	});
	custom icon since anyone use this plugin might not use Awesome Font, Title Placement & check if Tooltip function si loaded or not
	
	$('#table1').easyTable({
		buttonDesc:{
			icon:{check:'fa fa-check',uncheck:'fa fa-close'}
			,placement:'right'
		}
	});
 */
(function( $ ){
	$.fn.easyTable = function (options) {
		this.table=this;
		var trIndex = 'all';
		this.options = {
			tableStyle: 'table easyTable',
			hover: 'btn-success',
			buttons: true,filter:true,
			select: true,
			sortable: true,
			scroll: {active: false, height: '400px'}
			,buttonDesc:{
				icon:{check:'fa fa-check',uncheck:'fa fa-close'}
				,placement:'right'
			},
			page:{
				total:0,limit:0,callback:false
			}
		};
		this.message = {
			all: 'Marcar todos registros.',
			clear: 'Desmarcar todos registos.',
			search: 'Pesquisar em',
			searchText:'Search',prev:'Previous',next:'Next'
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
			table.addClass('easyTableSelect');
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

				if (a.cells[col].children[0] !== 'undefined') {
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
				
				return (typeof str1 !== 'undefined' && typeof str2 !== 'undefined') ? reverse * (str1.localeCompare(str2)) : '';
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
					  tablePlugin.find('input.cari').attr('placeholder', tablePlugin.message.search + ' ' + $(th[i]).text());
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
	   this.makeMenu =function(){
			var menu = this.find('div.row');
			if(menu.length > 0){}else{
				this.prepend('<div class="row" style="margin:9px; "></div>');
				menu = this.find('div.row');
			}
			return menu;
	   };
	   this.buttons = function () {
		  var table = this;
		  var menu = this.makeMenu();
		  var all = '<button id=\'all\' class=\'btn ' + this.options.hover + ' btn-sm\' ' +
				  'data-toggle=\'tooltip\' data-placement="'+this.options.buttonDesc.placement+'" title=\'' + this.message.all + '\'><i class="'+this.options.buttonDesc.icon.check+'"></i></button>';
		  var clear = '<button  id=\'clear\' class=\'btn btn-danger btn-sm\'  ' +
				  'data-toggle=\'tooltip\' data-placement="'+this.options.buttonDesc.placement+'" title=\'' + this.message.clear + '\'><i class="'+this.options.buttonDesc.icon.uncheck+'"></i></button>';
		  
		  menu.prepend('<div class="col-md-6">'+ all + clear +'</div>');
		  if (typeof $.fn.tooltip === "function") { 
			$('[data-toggle="tooltip"]').tooltip( );	
		  }
		  
		  all = menu.find('#all');
		  clear = menu.find('#clear');
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
		  var search = '<div class="col-md-6 pull-right"><div class="input-group"> <label class="input-group-addon"> '+this.message.searchText +' </label> <input type="text" class="form-control cari" placeholder="' + this.message.search + ' " > </div></div>';
		  var menu = this.makeMenu();
		  menu.prepend(search);
		  
		  table.find('.cari').keyup(function () {
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
		  this.find('tbody').css('max-height', this.options.scroll.height);
	   };
	   this.getSelected = function (col) {
		  var selected = [];
		  this.find('tbody .' + this.options.hover).each(function (key, val) {
			 selected.push($(val).find('td').eq(col).text());
		  });
		  return selected;
	   };
	   /***************************** PAGING ************************/
	   this.paging =function(){
		  var table = this;
		  var limit  = parseInt( this.options.page.total ) / parseInt( this.options.page.limit ) ;
		  var callback = this.options.page.callback;
		  
		  table.append('<ul class="pagination pull-right"><li class="disabled"><a href="#" data-info="prev"> '+this.message.prev+' </a></li><li class="active"><a href="#" data-info="cnt">1</a></li><li class="'+(limit <= 1?'disabled':'')+'"><a href="#" data-info="next">'+this.message.next+' </a></li></ul>');
		  table.find('ul.pagination').find('li a').each(function(){
			$(this).click(function(){
				if( typeof $(this).attr('data-info') ==='undefined' )return;
				var a = $(this).parents('ul');
				switch( $(this).attr('data-info') ){
					case 'prev':
						if( $(this).parent().hasClass('disabled') )break;
						
						var a_no = a.find('[data-info="cnt"]').text();
						a_no = a_no < 1 ? 1 : a_no;
						--a_no ;
						
						if(a_no > 1){
							a.find('[data-info="cnt"]').text( a_no );
						}else{
							a.find('[data-info="prev"]').parent().addClass('disabled');
							a.find('[data-info="cnt"]').text( 1 );
						}
						a.find('[data-info="next"]').parent().removeClass('disabled');
						if(typeof callback ==='function')callback(table , a_no);
						break;
					case 'next':
						if( $(this).parent().hasClass('disabled') )break;
						
						var a_no = a.find('[data-info="cnt"]').text();
						a_no = a_no < 1 ? 1 : a_no;
						++a_no;
						if(a_no > 0){
							a.find('[data-info="prev"]').parent().removeClass('disabled');
							a.find('[data-info="cnt"]').text( a_no );
							if(a_no >= limit){
								$(this).parent().addClass('disabled');
							}
						}
						if(typeof callback ==='function')callback(table , a_no);
						break;
					default: break;
				}
			});
		  });
	   };
	   /***************************** END OF PAGING ************************/
	   this.create = function () {
	   
		  this.options = $.extend({}, this.options, options);
		  this.addClass(this.options.tableStyle);
		  this.attr('tabindex', 0);
		  if (this.options.message) {
			  this.message = $.extend({}, this.message, this.options.message );
		  }
		  if( this.options.page.limit > 0 && this.options.page.total > 0){
			this.paging(); 
		  }
		  if (this.options.select) {
			 this.select();
		  }
		  if (this.options.sortable) {
			 this.sortable();
		  }
		  
		  if (this.options.buttons) {
			 this.buttons();
		  }
		  if (this.options.filter) {
			 this.filter();
		  }
		  if (this.options.scroll.active) {
			 this.scroll();
		  }
	   };
	   this.create();
	   return this;
	};
} (jQuery) );
