(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var searchSuggest = require('../plugins/search_suggest.js');

//以后头部可能更复杂 先抽离出来 方便管理
var headerJS = {
	init: function(){
		this.initPlugins();
	},
	initPlugins: function(){
		//搜索提示
		searchSuggest.init({
			searchWrap: '.cyc_search,.c_search',
			url: $('#J_search').data('suggest-url')
		});
	}
};
headerJS.init();

},{"../plugins/search_suggest.js":2}],2:[function(require,module,exports){
/**
 * cyc搜索建议
 * @author: lian 2016/12/9 18:26
 * @type {Object}
 * 
 */
var searchSuggest = {
	data: {
		timer: null,
		delay: 500,
		focusClass: 'c_focus',//聚焦样式
		url: '',
		ajaxObj: null
	},
	UI: {
		searchWrap: '.c_search',
		suggestList: '#J_search_suggest',//提示列表
		suggestListItem: '#J_search_suggest li',
		searchInput: '#search_key',//搜索输入框
		searchForm: '#J_search'//搜索表单
	},
	init: function(opt){
		if(opt){
			for(k in opt){
				if(k == 'delay' || k == 'focusClass' || k == 'url') this.data[k] = opt[k];
				else this.UI[k] = opt[k];
			}
		}
		this.bindEvent();
	},
	bindEvent: function(){
		var that = this;
		var searchVal = '';
		// var ajaxObj = null;
		var $searchList = $(this.UI.suggestList);
		$('body').on('click', function(){
			$searchList.hide();
		});
		$(that.UI.searchWrap).on('click', function(e){
			e.stopPropagation();
		}).on('keyup', that.UI.searchInput, function(e){
			var exclude = "|108|112|113|114|115|116|117|118|119|120|121|122|123|9|12|13|16|17|18|20|27|33|34|35|36|37|38|39|40|41|42|43|44|45|46|144|108|";
			if(exclude.indexOf('|' + e.keyCode + '|') >= 0) return;
			var $this = $(this);
			var val = $this.val();
			//值没有变
			if(searchVal === val) return;
			searchVal = val;

			//空值
			if(val === ''){
				clearTimeout(that.data.timer);
				$searchList.hide();
				return;
			}

			clearTimeout(that.data.timer);

			that.data.timer = setTimeout(function(){
				that.data.ajaxObj && that.data.ajaxObj.abort();
				that.data.ajaxObj = $.ajax({
					url: that.data.url,
					dataType: 'json',
					data: {
						keyword: val
					},
					success: function(data){
						if(data.code == 200){
							if(data.result && data.result.length > 0)
								that.renderResult(data.result);
							else
								$searchList.empty().hide();
						}
					}
				});
			}, that.data.delay);
		}).on('keydown', that.UI.searchInput, function(e){
			var index = $searchList.find('.' + that.data.focusClass).index();
			if(e.keyCode == 38){
				e.preventDefault();
				var value = $searchList.find('li').removeClass(that.data.focusClass).eq(--index).addClass(that.data.focusClass).text();
				$(this).val(value);
			}else if(e.keyCode == 40){
				e.preventDefault();
				var value = $searchList.find('li').removeClass(that.data.focusClass).eq(++index).addClass(that.data.focusClass).text();
				$(this).val(value);
			}
		}).on('click', that.UI.searchInput, function(){
			var val = $(this).val();
			if(val === '') return;
			that.data.ajaxObj && that.data.ajaxObj.abort();
			that.data.ajaxObj = $.ajax({
				url: that.data.url,
				dataType: 'json',
				data: {
					keyword: val
				},
				success: function(data){
					if(data.code == 200){
						if(data.result && data.result.length > 0)
							that.renderResult(data.result);
						else
							$searchList.empty().hide();
					}
				}
			});
		});
	},
	bindHover: function(){
		var that = this;
		$(that.UI.suggestListItem).hover(function(){
			$(this).addClass(that.data.focusClass);
			$(that.UI.searchInput).val($(this).text());
		},function(){
			$(this).removeClass(that.data.focusClass);
		}).on('click', function(){
			$(that.UI.searchForm).submit();
		});
	},
	renderResult: function(list){
		var html = '';
		for(var i=0,len=list.length; i<len; i++){
			html += '<li>' + list[i] + '</li>';
		}
		$(this.UI.suggestList).empty().append(html).show();
		this.bindHover();
	}
};

module.exports = searchSuggest;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjeWh1Yi9wYy9QdWJsaWMvc3JjL2pzL2NvbW0vaGVhZGVyLmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9wbHVnaW5zL3NlYXJjaF9zdWdnZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHNlYXJjaFN1Z2dlc3QgPSByZXF1aXJlKCcuLi9wbHVnaW5zL3NlYXJjaF9zdWdnZXN0LmpzJyk7XHJcblxyXG4vL+S7peWQjuWktOmDqOWPr+iDveabtOWkjeadgiDlhYjmir3nprvlh7rmnaUg5pa55L6/566h55CGXHJcbnZhciBoZWFkZXJKUyA9IHtcclxuXHRpbml0OiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5pbml0UGx1Z2lucygpO1xyXG5cdH0sXHJcblx0aW5pdFBsdWdpbnM6IGZ1bmN0aW9uKCl7XHJcblx0XHQvL+aQnOe0ouaPkOekulxyXG5cdFx0c2VhcmNoU3VnZ2VzdC5pbml0KHtcclxuXHRcdFx0c2VhcmNoV3JhcDogJy5jeWNfc2VhcmNoLC5jX3NlYXJjaCcsXHJcblx0XHRcdHVybDogJCgnI0pfc2VhcmNoJykuZGF0YSgnc3VnZ2VzdC11cmwnKVxyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG5oZWFkZXJKUy5pbml0KCk7XHJcbiIsIi8qKlxyXG4gKiBjeWPmkJzntKLlu7rorq5cclxuICogQGF1dGhvcjogbGlhbiAyMDE2LzEyLzkgMTg6MjZcclxuICogQHR5cGUge09iamVjdH1cclxuICogXHJcbiAqL1xyXG52YXIgc2VhcmNoU3VnZ2VzdCA9IHtcclxuXHRkYXRhOiB7XHJcblx0XHR0aW1lcjogbnVsbCxcclxuXHRcdGRlbGF5OiA1MDAsXHJcblx0XHRmb2N1c0NsYXNzOiAnY19mb2N1cycsLy/ogZrnhKbmoLflvI9cclxuXHRcdHVybDogJycsXHJcblx0XHRhamF4T2JqOiBudWxsXHJcblx0fSxcclxuXHRVSToge1xyXG5cdFx0c2VhcmNoV3JhcDogJy5jX3NlYXJjaCcsXHJcblx0XHRzdWdnZXN0TGlzdDogJyNKX3NlYXJjaF9zdWdnZXN0JywvL+aPkOekuuWIl+ihqFxyXG5cdFx0c3VnZ2VzdExpc3RJdGVtOiAnI0pfc2VhcmNoX3N1Z2dlc3QgbGknLFxyXG5cdFx0c2VhcmNoSW5wdXQ6ICcjc2VhcmNoX2tleScsLy/mkJzntKLovpPlhaXmoYZcclxuXHRcdHNlYXJjaEZvcm06ICcjSl9zZWFyY2gnLy/mkJzntKLooajljZVcclxuXHR9LFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdCl7XHJcblx0XHRpZihvcHQpe1xyXG5cdFx0XHRmb3IoayBpbiBvcHQpe1xyXG5cdFx0XHRcdGlmKGsgPT0gJ2RlbGF5JyB8fCBrID09ICdmb2N1c0NsYXNzJyB8fCBrID09ICd1cmwnKSB0aGlzLmRhdGFba10gPSBvcHRba107XHJcblx0XHRcdFx0ZWxzZSB0aGlzLlVJW2tdID0gb3B0W2tdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmJpbmRFdmVudCgpO1xyXG5cdH0sXHJcblx0YmluZEV2ZW50OiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIHNlYXJjaFZhbCA9ICcnO1xyXG5cdFx0Ly8gdmFyIGFqYXhPYmogPSBudWxsO1xyXG5cdFx0dmFyICRzZWFyY2hMaXN0ID0gJCh0aGlzLlVJLnN1Z2dlc3RMaXN0KTtcclxuXHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG5cdFx0XHQkc2VhcmNoTGlzdC5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHRcdCQodGhhdC5VSS5zZWFyY2hXcmFwKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdH0pLm9uKCdrZXl1cCcsIHRoYXQuVUkuc2VhcmNoSW5wdXQsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgZXhjbHVkZSA9IFwifDEwOHwxMTJ8MTEzfDExNHwxMTV8MTE2fDExN3wxMTh8MTE5fDEyMHwxMjF8MTIyfDEyM3w5fDEyfDEzfDE2fDE3fDE4fDIwfDI3fDMzfDM0fDM1fDM2fDM3fDM4fDM5fDQwfDQxfDQyfDQzfDQ0fDQ1fDQ2fDE0NHwxMDh8XCI7XHJcblx0XHRcdGlmKGV4Y2x1ZGUuaW5kZXhPZignfCcgKyBlLmtleUNvZGUgKyAnfCcpID49IDApIHJldHVybjtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIHZhbCA9ICR0aGlzLnZhbCgpO1xyXG5cdFx0XHQvL+WAvOayoeacieWPmFxyXG5cdFx0XHRpZihzZWFyY2hWYWwgPT09IHZhbCkgcmV0dXJuO1xyXG5cdFx0XHRzZWFyY2hWYWwgPSB2YWw7XHJcblxyXG5cdFx0XHQvL+epuuWAvFxyXG5cdFx0XHRpZih2YWwgPT09ICcnKXtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhhdC5kYXRhLnRpbWVyKTtcclxuXHRcdFx0XHQkc2VhcmNoTGlzdC5oaWRlKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjbGVhclRpbWVvdXQodGhhdC5kYXRhLnRpbWVyKTtcclxuXHJcblx0XHRcdHRoYXQuZGF0YS50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGF0LmRhdGEuYWpheE9iaiAmJiB0aGF0LmRhdGEuYWpheE9iai5hYm9ydCgpO1xyXG5cdFx0XHRcdHRoYXQuZGF0YS5hamF4T2JqID0gJC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogdGhhdC5kYXRhLnVybCxcclxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGtleXdvcmQ6IHZhbFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhLmNvZGUgPT0gMjAwKXtcclxuXHRcdFx0XHRcdFx0XHRpZihkYXRhLnJlc3VsdCAmJiBkYXRhLnJlc3VsdC5sZW5ndGggPiAwKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5yZW5kZXJSZXN1bHQoZGF0YS5yZXN1bHQpO1xyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdCRzZWFyY2hMaXN0LmVtcHR5KCkuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sIHRoYXQuZGF0YS5kZWxheSk7XHJcblx0XHR9KS5vbigna2V5ZG93bicsIHRoYXQuVUkuc2VhcmNoSW5wdXQsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgaW5kZXggPSAkc2VhcmNoTGlzdC5maW5kKCcuJyArIHRoYXQuZGF0YS5mb2N1c0NsYXNzKS5pbmRleCgpO1xyXG5cdFx0XHRpZihlLmtleUNvZGUgPT0gMzgpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSAkc2VhcmNoTGlzdC5maW5kKCdsaScpLnJlbW92ZUNsYXNzKHRoYXQuZGF0YS5mb2N1c0NsYXNzKS5lcSgtLWluZGV4KS5hZGRDbGFzcyh0aGF0LmRhdGEuZm9jdXNDbGFzcykudGV4dCgpO1xyXG5cdFx0XHRcdCQodGhpcykudmFsKHZhbHVlKTtcclxuXHRcdFx0fWVsc2UgaWYoZS5rZXlDb2RlID09IDQwKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gJHNlYXJjaExpc3QuZmluZCgnbGknKS5yZW1vdmVDbGFzcyh0aGF0LmRhdGEuZm9jdXNDbGFzcykuZXEoKytpbmRleCkuYWRkQ2xhc3ModGhhdC5kYXRhLmZvY3VzQ2xhc3MpLnRleHQoKTtcclxuXHRcdFx0XHQkKHRoaXMpLnZhbCh2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pLm9uKCdjbGljaycsIHRoYXQuVUkuc2VhcmNoSW5wdXQsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0XHRpZih2YWwgPT09ICcnKSByZXR1cm47XHJcblx0XHRcdHRoYXQuZGF0YS5hamF4T2JqICYmIHRoYXQuZGF0YS5hamF4T2JqLmFib3J0KCk7XHJcblx0XHRcdHRoYXQuZGF0YS5hamF4T2JqID0gJC5hamF4KHtcclxuXHRcdFx0XHR1cmw6IHRoYXQuZGF0YS51cmwsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRrZXl3b3JkOiB2YWxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0aWYoZGF0YS5jb2RlID09IDIwMCl7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGEucmVzdWx0ICYmIGRhdGEucmVzdWx0Lmxlbmd0aCA+IDApXHJcblx0XHRcdFx0XHRcdFx0dGhhdC5yZW5kZXJSZXN1bHQoZGF0YS5yZXN1bHQpO1xyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0JHNlYXJjaExpc3QuZW1wdHkoKS5oaWRlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0YmluZEhvdmVyOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0JCh0aGF0LlVJLnN1Z2dlc3RMaXN0SXRlbSkuaG92ZXIoZnVuY3Rpb24oKXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyh0aGF0LmRhdGEuZm9jdXNDbGFzcyk7XHJcblx0XHRcdCQodGhhdC5VSS5zZWFyY2hJbnB1dCkudmFsKCQodGhpcykudGV4dCgpKTtcclxuXHRcdH0sZnVuY3Rpb24oKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyh0aGF0LmRhdGEuZm9jdXNDbGFzcyk7XHJcblx0XHR9KS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKHRoYXQuVUkuc2VhcmNoRm9ybSkuc3VibWl0KCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHJlbmRlclJlc3VsdDogZnVuY3Rpb24obGlzdCl7XHJcblx0XHR2YXIgaHRtbCA9ICcnO1xyXG5cdFx0Zm9yKHZhciBpPTAsbGVuPWxpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKXtcclxuXHRcdFx0aHRtbCArPSAnPGxpPicgKyBsaXN0W2ldICsgJzwvbGk+JztcclxuXHRcdH1cclxuXHRcdCQodGhpcy5VSS5zdWdnZXN0TGlzdCkuZW1wdHkoKS5hcHBlbmQoaHRtbCkuc2hvdygpO1xyXG5cdFx0dGhpcy5iaW5kSG92ZXIoKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNlYXJjaFN1Z2dlc3Q7Il19
