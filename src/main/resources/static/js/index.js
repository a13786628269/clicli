(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var template = require('../plugins/template');
var index = {
	data: {
		getSKUrl: $('#J_get_sk_info').val(),
		getPTUrl: $('#J_get_pt_info').val() 
	},
	UI: {
		catItem: '.c_cat_nav li',
		swiperSelector: '.c_swiper_wrap_container',
		swiperPaginationSelector: '.swiper-pagination',
		gotoTop: '.c_fix_top',
		timeDown:'.c_time',
		timeReadyDown:'.c_sk_ready_time',
		ptTimeDown:'.c_pt_time',
		ptTimeReadyDown:'.c_pt_ready_time',
		floorChange: '.c_floor_change',
		floor: '.c_floor',
		sk: '.c_sk',
		pt: '.c_pt',
		fakeMid:'.c_fake_mid'
	},
	init: function(){
		this.bindEvent();
		this.initPlugins();
	},
	bindEvent: function(){
		var that = this;
		var winHeight = $(window).height();
		var $floor = $(that.UI.floor);
		var $sk = $(that.UI.sk);
		var $pt = $(that.UI.pt);
		$(that.UI.catItem).hover(function(){
			$(this).addClass('c_cat_hovered').find('.c_cat_more').show();
		}, function(){
			$(this).removeClass('c_cat_hovered').find('.c_cat_more').hide();
		});
		$(window).scroll(function(){
			var $this = $(this);
			var scrollTop = $this.scrollTop();
			var jqGotoTop = $(that.UI.gotoTop);
			scrollTop > winHeight ? jqGotoTop.fadeIn(1000):jqGotoTop.fadeOut(1000);

			$floor.each(function(){
				var $item = $(this);
				var top = $item.offset().top;
				var $change = $item.find(that.UI.floorChange);
				if(top - scrollTop - winHeight <= 0 && $change.data('start') == 0){//高度在窗口内且第一次请求
					that.applyFloorData($change);
				}
			})

			var skTop = $sk.offset().top;
			if ( skTop - scrollTop - winHeight <= 0 && !$sk.data('hadInit')){//只执行一次
				that.reflashSK();
				$sk.data('hadInit', 1);
				that.initSkInterval(120000);
			}
			var ptTop = $pt.offset().top;
			console.log($pt.data('hadInitPt'));
			if ( ptTop - scrollTop - winHeight <= 0 && !$pt.data('hadInitPt')){//只执行一次
				that.reflashPT();
				$pt.data('hadInitPt', 1);
				// that.initPtInterval(120000);
			}

		}).resize(function(){
			winHeight = $(window).height();
		}).on('load', function(){
			$(this).scroll();
		});
		$('body').on('click', '.c_recommend_title div', function(){
			if($(this).hasClass('J_new')){
				$('.c_recommend_page .jp-previous').click();
				$('.c_commend_bar').removeClass('c_commend_right');
			}else{
				$('.c_recommend_page .jp-next').click();
				$('.c_commend_bar').addClass('c_commend_right');
			}
			$('.c_on').removeClass('c_on');
			$(this).addClass('c_on');
		}).on('click', '.c_stop_propa', function(e){
			e.stopPropagation();
		}).on('click', that.UI.floorChange, function(){
			that.applyFloorData($(this));
		}).on('click', '#J_top', function(){
			$('html,body').animate({scrollTop: '0px'}, 500);
		}).on('click',that.UI.fakeMid,function(){
			window.location.href = $('.swiper-slide-active a').attr('href');
			
		}).on('click','.c_sk_item',function(){
			if($(this).hasClass('c_sk_now')){
				$("#J_sk_ready_page").hide();
				$('#J_sk_page').show();
				$("#J_sk_ready_container").hide();
				$('#J_sk_container').show();
				$('.c_sk_tlt_ready').hide();
				$('.c_sk_tlt_now').show();
				$('.c_sk_now').addClass('c_sk_on');
				$('.c_sk_ready').removeClass('c_sk_on');
			}else if($(this).hasClass('c_sk_ready')){
				$("#J_sk_ready_page").show();
				$('#J_sk_page').hide();
				$("#J_sk_ready_container").show();
				$('#J_sk_container').hide();
				$('.c_sk_tlt_now').hide();
				$('.c_sk_tlt_ready').show();
				$('.c_sk_ready').addClass('c_sk_on');
				$('.c_sk_now').removeClass('c_sk_on');
			}

		}).on('click','.c_pt_item',function(){
			if($(this).hasClass('c_pt_now')){
				$("#J_pt_ready_page").hide();
				$('#J_pt_page').show();
				$("#J_pt_ready_container").hide();
				$('#J_pt_container').show();
				$('.c_pt_tlt_ready').hide();
				$('.c_pt_tlt_now').show();
				$('.c_pt_now').addClass('c_pt_on');
				$('.c_pt_ready').removeClass('c_pt_on');
			}else if($(this).hasClass('c_pt_ready')){
				$("#J_pt_ready_page").show();
				$('#J_pt_page').hide();
				$("#J_pt_ready_container").show();
				$('#J_pt_container').hide();
				$('.c_pt_tlt_now').hide();
				$('.c_pt_tlt_ready').show();
				$('.c_pt_ready').addClass('c_pt_on');
				$('.c_pt_now').removeClass('c_pt_on');
			}

		});
	},
	initPlugins: function(){
		// $('.swiper-wrapper').cycle({ 
		// 	prev:   '#prev', 
		// 	next:   '#next', 
		// 	timeout: 3500,
		// 	speed:400,
		// 	before:function(currSlideElement,nextSlideElement){
		// 		$('.swiper-slide').removeClass('swiper-slide-active');
		// 		$(nextSlideElement).addClass('swiper-slide-active'); 
		// 	}
		// });
		var bannerSwiper = new Swiper(this.UI.swiperSelector, {
		    mode:'horizontal',
		    loop: true,
		    autoplay:3000,
		    speed: 500,
		    calculateHeight: true,
		    pagination: this.UI.swiperPaginationSelector,
		    paginationClickable: true,
		    effect : 'fade',
		    fade: {
		      crossFade: false,
		    }
		});
		this.setBannerBg();


		// fix ad area cuz 1920 
		$('.c_cus_ad_list area').each(function(idx,ele){

			var arr = $(ele).attr('coords').split(',');
			var tmp = arr.map(function(item,idx,input){
				return item*1.8461;
			})
			$(ele).attr('coords',tmp.join(','));
		})

		$('.c_lazyload').lazyload();

		//活动专场jpage初始化
	    $("div#J_act_page").jPages({
	        containerID : "J_act_container",
	        animation   : false,
	        perPage: 4,
	        fallback: 600,
	        previous: '',
	        next: '',
	        delay: 1 //delay=0 ie8有bug
	    });
	    
	    //推荐
	    $('div.c_recommend_page').jPages({
	    	containerID : "J_recommend_container",
	        animation   : false,
	        perPage: 20,
	        fallback: 600,
	        previous: '',
	        next: '',
	        callback: function(){
	        	$('.c_lazyload').lazyload();
	        }
	    });	    
	},
	initTimeDown: function(){
		var that = this;
		var $timeDown = $(this.UI.timeDown);
		var _time = $timeDown.data('time');
		var _is_begin = $timeDown.data('is-begin');
		if($timeDown.length < 1) return;
		$timeDown.timeCountDown({
			time: _time*1000,
			callback: function (result) {
                var day = this.fillZero(result.d),
                    hour = this.fillZero(result.h),
                    minute = this.fillZero(result.m),
                    second = this.fillZero(result.s),
                    // ms = result.ms,
                    last_time = result.last_times;
                if ( last_time > 0) {
                	var html = day != '00' ? day + '天' : '';
                	html += hour + ':' + minute + ':' + second;
                	$timeDown.html(html);
                }else{
                	//计时结束刷新(允许1秒误差)
                	setTimeout(function(){
	                	that.reflashSK();
                	}, 1000);
                }
            }
		})
	},
	initPtTimeDown: function(){
		var that = this;
		var $timeDown = $(this.UI.ptTimeDown);
		var _time = $timeDown.data('time');
		var _is_begin = $timeDown.data('is-begin');
		if($timeDown.length < 1) return;
		$timeDown.timeCountDown({
			time: _time*1000,
			callback: function (result) {
                var day = this.fillZero(result.d),
                    hour = this.fillZero(result.h),
                    minute = this.fillZero(result.m),
                    second = this.fillZero(result.s),
                    // ms = result.ms,
                    last_time = result.last_times;
                if ( last_time > 0) {
                	var html = day != '00' ? day + '天' : '';
                	html += hour + ':' + minute + ':' + second;
                	$timeDown.html(html);
                }else{
                	//计时结束刷新(允许1秒误差)
                	setTimeout(function(){
	                	that.reflashSK();
                	}, 1000);
                }
            }
		})
	},
	initReadyTimeDown:function(){
		var that = this;
		var $timeDown = $(this.UI.timeReadyDown);
		var _time = $timeDown.data('time');
		var _is_begin = $timeDown.data('is-begin');
		if($timeDown.length < 1) return;
		$timeDown.timeCountDown({
			time: _time*1000,
			callback: function (result) {
                var day = this.fillZero(result.d),
                    hour = this.fillZero(result.h),
                    minute = this.fillZero(result.m),
                    second = this.fillZero(result.s),
                    // ms = result.ms,
                    last_time = result.last_times;
                if ( last_time > 0) {
                	var html = day != '00' ? day + '天' : '';
                	html += hour + ':' + minute + ':' + second;
                	$timeDown.html(html);
                }else{
                	//计时结束刷新(允许1秒误差)
                	// setTimeout(function(){
	                // 	that.reflashSK();
                	// }, 1000);
                }
            }
		})		
	},
	initPtReadyTimeDown:function(){
		var that = this;
		var $timeDown = $(this.UI.ptTimeReadyDown);
		var _time = $timeDown.data('time');
		var _is_begin = $timeDown.data('is-begin');
		if($timeDown.length < 1) return;
		$timeDown.timeCountDown({
			time: _time*1000,
			callback: function (result) {
                var day = this.fillZero(result.d),
                    hour = this.fillZero(result.h),
                    minute = this.fillZero(result.m),
                    second = this.fillZero(result.s),
                    // ms = result.ms,
                    last_time = result.last_times;
                if ( last_time > 0) {
                	var html = day != '00' ? day + '天' : '';
                	html += hour + ':' + minute + ':' + second;
                	$timeDown.html(html);
                }else{
                	//计时结束刷新(允许1秒误差)
                	// setTimeout(function(){
	                // 	that.reflashSK();
                	// }, 1000);
                }
            }
		})		
	},
	initSkInterval: function(delay){
		var that = this;
		setInterval(function(){
			that.reflashSK();
		}, delay);
	},
	initPTInterval: function(delay){
		var that = this;
		setInterval(function(){
			that.reflashPT();
		}, delay);
	},
	reflashSK: function(){
		var that = this;
		$.ajax({
			url: that.data.getSKUrl,
			data: {
				start: 0,
				nums: 99
			},
			dataType: 'json',
			success: function(data){
				if (data.code == 200) {
					if( !Array.isArray(data.result) && (data.result.begin_list.length > 0 || data.result.ready_list.length > 0)){
						$(that.UI.sk).show();
						that.renderSK({
							skList:data.result.begin_list,
							skReadyList:data.result.ready_list
						});
					}else{
						$(that.UI.sk).hide();
					}
				} else {
					console.log(data.result);
				}
			},
			error: function(){
				console.log('get sk info err~');
			}
		})
	},
	reflashPT: function(){
		var that = this;
		$.ajax({
			url: that.data.getPTUrl,
			data: {
				start: 0,
				nums: 99
			},
			dataType: 'json',
			success: function(data){
				if (data.code == 200) {
					if( !Array.isArray(data.result) && (data.result.begin_list.length > 0 || data.result.ready_list.length > 0)){
						$(that.UI.pt).show();
						that.renderPT({
							ptList:data.result.begin_list,
							ptReadyList:data.result.ready_list
						});
						that.data.PTinfo = {
							ptList:data.result.begin_list,
							ptReadyList:data.result.ready_list
						}
					}else{
						$(that.UI.pt).hide();
					}
				} else {
					console.log(data.result);
				}
			},
			error: function(){
				console.log('get pt info err~');
			}
		})
	},
	renderSK: function(SKInfo){
		var $sk = $('.c_sk');
	 	if($sk.data('notFirst') != 1 || this.shouldFlashAll(SKInfo)){
			//第一次 或者 返回列表产品id改变了  走正常的render
	 		var html = template('J_sk_tmpl', SKInfo);
	 		$sk.empty().append(html);
	 		var opt = {
		        containerID : "J_sk_container",
		        animation   : false,
		        perPage: 9,
		        fallback: 600,
		        previous: '',
		        next: ''
		    };
		    var opt_ready = {
		    	containerID : "J_sk_ready_container",
		    	animation   : false,
		    	perPage: 9,
		    	fallback: 600,
		    	previous: '',
		    	next: ''
		    }
		    if($sk.data('notFirst') == 1){
		    	opt.fallback = 1;
		    	opt.delay = 1;
		    }

		    $("div#J_sk_page").jPages(opt);
		    $("div#J_sk_ready_page").jPages(opt_ready);
		    // 后边逻辑控制改展示那一块
		    
		    var leftItemLength = $("#J_sk_container .left_item").length;
		    var readyItemLength = $("#J_sk_ready_container li").length;

		    if(leftItemLength || !readyItemLength){
		    	$("#J_sk_ready_page").hide();
		    	$("#J_sk_ready_container").hide();
		    	$('.c_sk_tlt_ready').hide();
		    	$('.c_sk_now').addClass('c_sk_on');
		    }else{
		    	// 如果 抢购列表空，那么肯定是预购的有
		    	$("#J_sk_ready_page").show();
		    	$("#J_sk_container").hide();
		    	$("#J_sk_ready_container").show();
		    	$('.c_sk_tlt_now').hide();
		    	$('.c_sk_ready').addClass('c_sk_on');
		    }
		    //闪购倒计时 得跟着选中哪个来走的
		    this.data.SKInfo = SKInfo;
		    this.initTimeDown();
		    this.initReadyTimeDown();
		    $sk.data('notFirst', 1);//标记为不是第一次
	 	}else{
	 		//库存不同直接修改dom
	 		for (var i = 0, len = SKInfo.skList.length; i < len; i++) {
	 			if(this.data.SKInfo.skList[i].leaving_proportion != SKInfo.skList[i].leaving_proportion) {
	 				$('.c_sk li[data-product-id="' + SKInfo.skList[i].product_id + '"]')
	 					.find('.c_sk_bar span')
	 					.css('width', 100 - SKInfo.skList[i].leaving_proportion + '%')
	 					.end()
	 					.find('.c_sk_stock')
	 					.text(function(){
	 						if(SKInfo.skList[i].leaving_proportion != 0){
	 							return '已抢购' + (100 - SKInfo.skList[i].leaving_proportion) + '%';
	 						}else{
	 							return '抢光啦';
	 						}
	 					});
	 			}
	 		}
	 		this.data.SKInfo = SKInfo;
	 	}
	},
	renderPT: function(PTInfo){
		var $pt = $('.c_pt');
		// || this.shouldFlashPtAll(PTInfo)
	 	if($pt.data('notPtFirst') != 1 ){
			//第一次 或者 返回列表产品id改变了  走正常的render
	 		var html = template('J_pt_tmpl', PTInfo);
	 		$pt.empty().append(html);
	 		var opt = {
		        containerID : "J_pt_container",
		        animation   : false,
		        perPage: 9,
		        fallback: 600,
		        previous: '',
		        next: ''
		    };
		    var opt_ready = {
		    	containerID : "J_pt_ready_container",
		    	animation   : false,
		    	perPage: 9,
		    	fallback: 600,
		    	previous: '',
		    	next: ''
		    }
		    if($pt.data('notPtFirst') == 1){
		    	opt.fallback = 1;
		    	opt.delay = 1;
		    }

		    $("div#J_pt_page").jPages(opt);
		    $("div#J_pt_ready_page").jPages(opt_ready);
		    // 后边逻辑控制改展示那一块
		    
		    var leftItemLength = $("#J_pt_container .left_item").length;
		    var readyItemLength = $("#J_pt_ready_container li").length;

		    if(leftItemLength || !readyItemLength){
		    	$("#J_pt_ready_page").hide();
		    	$("#J_pt_ready_container").hide();
		    	$('.c_pt_tlt_ready').hide();
		    	$('.c_pt_now').addClass('c_pt_on');
		    }else{
		    	// 如果 抢购列表空，那么肯定是预购的有
		    	$("#J_pt_ready_page").show();
		    	$("#J_pt_container").hide();
		    	$("#J_pt_ready_container").show();
		    	$('.c_pt_tlt_now').hide();
		    	$('.c_pt_ready').addClass('c_pt_on');
		    }
		    //闪购倒计时 得跟着选中哪个来走的
		    this.data.PTInfo = PTInfo;
		    // this.initTimeDown();
		    this.initPtTimeDown();
		    this.initPtReadyTimeDown();
		    $pt.data('notPtFirst', 1);//标记为不是第一次
	 	}else{
	 		//库存不同直接修改dom
	 		for (var i = 0, len = PTInfo.ptList.length; i < len; i++) {
	 			if(this.data.PTInfo.ptList[i].leaving_proportion != PTInfo.ptList[i].leaving_proportion) {
	 				$('.c_pt li[data-product-id="' + PTInfo.ptList[i].product_id + '"]')
	 					.find('.c_pt_bar span')
	 					.css('width', 100 - PTInfo.ptList[i].leaving_proportion + '%')
	 					.end()
	 					.find('.c_pt_stock')
	 					.text(function(){
	 						if(PTInfo.ptList[i].leaving_proportion != 0){
	 							return '已拼' + (PTInfo.ptList[i].sell_nums) + '/'+(PTInfo.ptList[i].nums);
	 						}else{
	 							return '拼团成功';
	 						}
	 					});
	 			}
	 		}
	 		this.data.PTInfo = PTInfo;
	 	}
	},
	shouldFlashAll: function(SKInfo){
		//列表改变
		if(this.data.SKInfo.skList.length != SKInfo.skList.length){
			return true;
		}
		//闪购状态改变
		if(this.data.SKInfo.skList[0].is_finish != SKInfo.skList[0].is_finish || this.data.SKInfo.skList[0].is_begin != SKInfo.skList[0].is_begin){
			return true;
		}
		//列表改变
		for (var i = 0, len = SKInfo.skList.length; i < len; i++ ) {
			if (SKInfo.skList[i].product_id != this.data.SKInfo.skList[i].product_id ) return true;
		}
		return false;
	},
	shouldFlashPtAll: function(PTInfo){
		//列表改变
		if(this.data.PTInfo.ptList.length != PTInfo.ptList.length){
			return true;
		}
		//闪购状态改变
		if(this.data.PTInfo.ptList[0].is_finish != PTInfo.ptList[0].is_finish || this.data.PTInfo.ptList[0].is_begin != PTInfo.ptList[0].is_begin){
			return true;
		}
		//列表改变
		for (var i = 0, len = PTInfo.ptList.length; i < len; i++ ) {
			if (PTInfo.ptList[i].product_id != this.data.PTInfo.ptList[i].product_id ) return true;
		}
		return false;
	},
	//$this->请求楼层换一批按钮的jq对象
	applyFloorData: function($changeBtn){
		var that = this;
		var url = $changeBtn.data('href') + $changeBtn.data('chid');
		var start = $changeBtn.data('start') - 0;
		if($changeBtn.hasClass('getting')) return;
		$changeBtn.addClass('getting');
		$.ajax({
			url: url,
			data: {
				start: start
			},
			dataType: 'json',
			success: function(data){
				if(data.code == 200){
					that.randerFloor($changeBtn.closest(that.UI.floor).find('.c_product_list'), data.result);
					if(data.result.data.list.length < 8) //换完了 重置为首页
						$changeBtn.data('start', 0);
					else
						$changeBtn.data('start', start + 8);
				}else{
					that.randerError($changeBtn.closest(that.UI.floor).find('.c_product_list'), data.result);
				}
				$changeBtn.removeClass('getting');
			},
			error: function(){
				$changeBtn.data('start', start - 8);
				$changeBtn.removeClass('getting');
				that.randerError($changeBtn.closest(that.UI.floor).find('.c_product_list'), '网络出现错误，请刷新再试~~');
			}
		});
	},
	//渲染楼层方法
	randerFloor: function($productList, result){
		var html = template('J_floor_tmpl', result);
		$productList.find('li,p').remove().end().append($(html));
	},
	randerError: function($productList, msg){
		$productList.find('li,p').remove().end().append('<p style="font-size: 16px; text-align:center; line-height: 315px;">' + msg + '<p>');
	},
	setBannerBg: function(){
		var bannerWrap = $('.swiper-slide');
		var bgUrl, bg;
		for (var i=0; i<bannerWrap.length; i++){
			bg = $(bannerWrap[i]);
			bg.css('background-image', 'url('+ bg.data('banner-url') +')');
		}
	}
}

index.init();
},{"../plugins/template":2}],2:[function(require,module,exports){
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();
},{}]},{},[1])