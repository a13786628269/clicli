(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * 伪a标签……没href的
 * @type {{init: init}}
 */
module.exports = {
    init:function() {
        $('body').on('click', '.c_fake_a', function (e) {
            e.preventDefault(); 
        });
    }
};
},{}],2:[function(require,module,exports){
var bdplugins = {
	init:function(){
		this.bindPushEvent();
	},
	bindPushEvent:function(){
		$('body').on('click','.c_count_item',function(){
			var id = $(this).data('id');
			var page = $(this).data('page');
			_hmt.push(['_trackEvent', id+' '+page, 'click',page]);
		})
	}

} 
module.exports = bdplugins;
},{}],3:[function(require,module,exports){
var login = {
	height:0,
	width:0,
	tabWrap:null,
	successCb:null,
	msgcode:null,
	opt:null,
	isInit:false,
	init:function(opt,cb){
		// init 的时候分两个步骤。 1个计算摆放位置 2对tab初始化 3 展示出来
		var winWidth = $(window).width();
		if(!this.isInit){
			this.isInit = true;
			this.opt = opt;
			this.tabWrap = $('#c_tab_wrap');
			this.width = this.tabWrap.outerWidth();
			this.height = this.tabWrap.outerHeight();
			this.tabWrap.css({
				left:(winWidth-this.height)/2,
				top:window.scrollY + 200
			});
			this.successCb = cb;
	        this.initStatus();
	        this.initPlugin();
	        this.cusEvent();
	        this.msgcode.init($('#c_get_sms_code'),'i.php?c=login&a=regSmsVerify');
        }else{
        	this.tabWrap.css({
				left:(winWidth-this.height)/2,
				top:window.scrollY + 50
			});
        	$('#c_dia_mask').show();
			$('#c_tab_wrap').show();
		}
        opt.type && $('#tab_'+opt.type+'_title').trigger('click');

        //wechat login
        this.wechatLogin();
        
	},
	cusEvent:function(){
		var that = this;
		$('body').on('click','.dia_close',function(){
			$('#c_dia_mask').hide();
			$('#c_tab_wrap').hide();
		}).on('click','.ipt_label',function(){
			var jqThis = $(this).siblings('.ipt');
			jqThis.removeClass('error');
			jqThis.siblings('label').hide();
			jqThis.focus();
		}).on('focus','input.ipt',function(){
			var jqThis = $(this);
			jqThis.removeClass('error');
			jqThis.siblings('label').hide();
		}).on('blur','input.ipt',function(){
			var jqThis = $(this);
			if( jqThis.val() == ''){
				jqThis.addClass('error');
				jqThis.siblings('label').show();
			}else{
				jqThis.removeClass('error');
				jqThis.siblings('label').hide();
			} 
		}).on('click','#log_btn',function(){
			var params = {};
	        params.phone = $('#c_user_name').val();
	        params.captcha = $('#c_log_verify').val();
	        params.password = $('#c_user_psw').val();
	        params.remember = $('#remember').val();
	        if (params.phone == '') { alert('请填写用户名'); return false; };
	        if (params.password == '') { alert('请填写密码'); return false; };
	        if (params.captcha == '') { alert('请填写验证码'); return false; };
	        $.ajax({  
	            type: "post",  
	            url: 'i.php?c=login&a=checkLogin&is_ajax=1',  
	            dataType: "json",  
	            data: {
	                cycang_user: params.phone,
	                captcha: params.captcha,
	                cycang_pwd: params.password,
	                remember: params.remember
	            },  
	            success: function(ret){
	                if(ret.code == 200){
	                	if(that.successCb){
	                		alert('登录成功,可以买买买啦( ＞ω＜)!!!');
	                		$('.dia_close').trigger('click');
	                		that.successCb(that.opt);
	                	}else{
	                		$('#c_dia_mask').hide();
							$('#c_tab_wrap').hide();
	                	}	
	                }else{
	                    alert(ret.result);
	                }
	            },
	            error : function(ret){      
	                alert('未知错误，请重新尝试');
	            }
	        });
		}).on('click','.verify_img',function(){
			$(this).attr('src','i.php?c=login&a=captcha');
		}).on('click','#tab_reg_title',function(){
			$('.log_form_wrap .verify_img').attr('src','i.php?c=login&a=captcha');
		}).on('click','#tab_login_title',function(){
			$('.reg_form_wrap .verify_img').attr('src','i.php?c=login&a=captcha');
		}).on('click','#reg_btn',function(){
			var phone = $('#c_reg_name'),
                captcha = $('#c_reg_img_verify'),
                sms_verify = $('#c_reg_sms_code'),
                pwd = $('#c_reg_psw'),
                repwd =$('#c_reg_confirm_psw'),
                data = {
                    phone: phone.val(),
                    captcha: captcha.val(),
                    sms_verify: sms_verify.val(),
                    cycang_pwd: pwd.val(),
                    cycang_repwd: repwd.val()
                };

            if(that.NotBlank(['#c_reg_name', '#c_reg_img_verify', '#c_reg_sms_code', '#c_reg_psw', '#c_reg_confirm_psw'])) {
                if(pwd.val() !== repwd.val()) {
                    alert('两次密码不相同');
                    return;
                }
                $.ajax({  
                    type: "post",  
                    url: 'i.php?c=login&a=register',  
                    dataType: "json",  
                    data: data,  
                    success: function(ret){
                        if(ret.code == 200){
                        	if(that.successCb){
                        		alert('登录成功,可以买买买啦( ＞ω＜)!!!');
                        		$('.dia_close').trigger('click');
                        		that.successCb(that.opt);
                        	}else{
                        		$('#c_dia_mask').hide();
								$('#c_tab_wrap').hide();
                        	}
                            
                        }else{
                            alert(ret.result);
                        }
                    },
                    error : function(ret){      
                        alert('未知错误，请重新尝试');
                    }
                });
            }
		})
	},
	NotBlank:function(array){
		 var len = array.length;
            for(var i =0; i < len; i++) { 
                var dom = $(array[i]),
                    val = dom.val();
                if(val == '') {
                    alert(dom.data('text')+'不能为空');
                    return false
                }
            }
            return true
	},
	initStatus:function(){
		$('#c_dia_mask').show();
		$('#c_tab_wrap').show();
        var aTabBodys = $('#tabs_body > div');
        $('#tabs > a').each(function(index){
            $(this).click(function(){
                $(this).removeClass().addClass('on').siblings().removeClass();
				aTabBodys.hide().eq(index).show();
            });
        });
        $('input.ipt').each(function(){
        	var jqThis = $(this);
        	if(jqThis.val() != ''){
        		jqThis.removeClass('error');
				jqThis.siblings('label').hide();
        	}else{
        		jqThis.addClass('error');
				jqThis.siblings('label').show();
        	}
        });
	},
	initPlugin:function(){
		this.msgcode = {
            el: undefined,
            tips: undefined,

            bind: function(link) {
                var that = this;

                this.el.click(function() {
                	if(!that.el.hasClass('btn-gray')){
	                   	var val = $('#c_reg_name').val();
	                   	var imgVerify = $('#c_reg_img_verify').val();
	                    if (!val) {
	                        alert('手机号码不能为空');
	                        return
	                    }else if (!imgVerify) {
	                        alert('图形验证码不能为空');
	                        return
	                    }
	                    $.ajax({
	                        url: link,
	                        type: 'POST',
	                        dataType: 'json',  
	                        data: {
	                            phone: val,
	                            captcha: imgVerify
	                        }
	                    }).done(function(data){
	                        //条件
	                        if(data.code == 200) { 
	                            alert(data.result);
	                            that.el.attr('disabled', 'disabled').addClass('btn-gray').css('cursor', 'not-allowed');
	                            that.countDown(function() {
	                                that.el.val('获取验证码').removeAttr('disabled').removeClass('btn-gray').css('cursor', 'pointer').css('background-color', '#ed3f3f')
	                            })
	                        }else{
	                            alert(data.result);
	                        }
	                    })
                	}
                })
            },

            init: function(el,link) {
                this.el = el;
                // this.tips = tips
                this.bind(link);
            },
            countDown: function(cb) {
                var that = this,
                    count = 60;

                (function fcount() {
                    if(count < 0) return cb();
                    if(count == 0){
                    	count--;
                    	that.el.text('重新获取');
                    }else{
                    	that.el.text('重新获取('+ count-- + ')')
                    }
                    
                    that.el.attr('disabled', 'disabled');
                    that.el.css('background-color', '#CCC');
                    setTimeout(fcount, 1000)
                })()
            }
        }

	},
    wechatLogin: function(){
    	$('.icon_wechat').on('click', function(){
    		var obj = new WxLogin({
				id: "wechat_login_container",
				appid: "wxc475a3f1e55f542a",
				scope: "snsapi_login",
				redirect_uri: "https://cycang.com/wechat_login_callback.php",
				state: "",
				style: "",
				href: ""
			});
    		$('.tabs_content').css('display', 'none');
    		$('.c_wechat_login_box').fadeIn();
    	});	
    	$('.c_wechat_back').on('click', function(){
			$('.c_wechat_login_box').css('display', 'none');
			$('.tabs_content').fadeIn();
		});
    }

}

module.exports = login;
},{}],4:[function(require,module,exports){
/**
 * 模拟单选、多选按钮
 */
var Simulate = {
    init:function(options){
    	$.fn.bindCheckboxRadioSimulate = function (options) {
    	    var settings = {
    	        className: 'on',
    	        onclick: null,
    	        checkbox_checked_fn: function (obj) {
    	            obj.parent().addClass(this.className);
    	        },
    	        checkbox_nochecked_fn: function (obj) {
    	            obj.parent().removeClass(this.className);
    	        },
    	        radio_checked_fn: function (obj) {
    	            obj.parent().addClass(this.className);
    	        },
    	        radio_nochecked_fn: function (obj) {
    	            obj.parent().removeClass(this.className);
    	        }
    	    };
    	    $.extend(true, settings, options);

    	    //input判断执行
    	    function inputJudge_fn(obj_this) {
    	       
    	        var $this = obj_this,
    	            $type;
    	        if ($this.attr('type') != undefined) {
    	            $type = $this.attr('type');
    	            if ($type == 'checkbox') {//if=多选按钮
    	                if ($this.prop("checked")) {
    	                    settings.checkbox_checked_fn($this);
    	                } else {
    	                    settings.checkbox_nochecked_fn($this);
    	                }
    	            } else if ($type == 'radio') {//if=单选按钮
    	                var $thisName;
    	                if ($this.attr('name') != undefined) {
    	                    $thisName = $this.attr('name');
    	                    if ($this.prop("checked")) {
    	                        settings.radio_checked_fn($this);
    	                        $("input[name='" + $thisName + "']").not($this).each(function () {
    	                            settings.radio_nochecked_fn($(this));
    	                        });
    	                    } else {
    	                        settings.radio_nochecked_fn($this);
    	                    }
    	                }
    	            }
    	        }
    	    }
    	    return this.each(function () {
    	        inputJudge_fn($(this));
    	    }).click(function () {
    	        inputJudge_fn($(this));
    	        if (settings.onclick) {
    	            settings.onclick(this, {
    	                isChecked: $(this).prop("checked"),//返回是否选中
    	                objThis: $(this)//返回自己
    	            });
    	        }
    	    });
    	};
    }
};

module.exports = Simulate;
},{}],5:[function(require,module,exports){
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();
},{}],6:[function(require,module,exports){
var template = require('../plugins/template');
var fake = require('../plugins/FakeA');
var login = require('../plugins/login');
var simulate = require('../plugins/simulate');
var bdplugins = require('../plugins/bdplugins');
var list = {
	UI:{
		gotoTop:'.c_fix_top',
		listWrap:'.c_normal_list_wrap',
		shopWrap:'.cyc_shop_list',
		listItem:'.c_list_item',
		listBody:'.cyc_list_content',
		scrollLoadImg:'.c_scroll_load',
		catMore:'.cyc_show_more',
		moreParent:'.cyc_more_parent',
		linkItem:'.cyc_link',
		isShowVip:'.c_is_vip_show',
		vipItem:'.c_is_vip_price',
		vipWrap:'.c_vip_wrap',
		isShowDiscount:'.c_is_show_discount'
	},
	data:{
		isAll:0, // 是否全部加载完毕
		isShopAll:0,
		nums:20,// 每次加载的个数
		ajaxUrl:'', // 接口地址
		showBrandNums:14, // 显示的品牌数
		isVipAll:0,
		isAlreadyVip:false
	},
	status:{
		startLoading:'c_list_stat_load',
		openMore:'cyc_open_more'
	},
	tmpl:{
		listItemTmpl:'c_list_item_tmpl',
		vipListItemTmp:'c_vip_list_item_tmpl',
		listShopTmpl:'c_shop_list_item_tmpl'
	},
	ajax:{
		getItemAjax:null,
		getVipItemAjax:null,
		getShopAjax:null
	},
	init:function(){
		this.initPlugin();
		this.bindCusEvent();
		this.couponTips();
	},
	initPlugin:function(){
		fake.init();
		simulate.init();
		bdplugins.init();
	},
	bindCusEvent:function(){
		$(window).scroll(function(){
			var winHeight = $(window).height();
			var jqGotoTop = $(that.UI.gotoTop);
			$(window).scrollTop() > winHeight ? jqGotoTop.fadeIn(1000):jqGotoTop.fadeOut(1000);
			if( !$('.c_list_empty').length && $(document).height() - $(this).scrollTop() - $(this).height() <= 100 ){
				that.loadMore();
			}
		});
		$('.c_checkbox_simulate input').bindCheckboxRadioSimulate();

		var that = this;
		$('body').on('click',this.UI.gotoTop,function(){
			$('body,html').animate({scrollTop:0},1000);
		}).on('click',this.UI.catMore,function(){
			var parent = $(this).closest(that.UI.moreParent);
			if(parent.hasClass(that.status.openMore)){
				parent.removeClass(that.status.openMore);
			}else{
				parent.addClass(that.status.openMore);
			}	
		}).on('click',this.UI.linkItem,function(){
			var jqThis = $(this);
			that.jumpTo(jqThis);
		}).on('click',this.UI.isShowVip,function(){
			if($(this).attr("checked")){ 
				// $(that.UI.listItem).not('.c_is_vip_price').addClass('c_hide');
				// if(!$('.c_is_vip_price').length){
				// 	$('.c_vip_empty').removeClass('c_hide');
				// }else{
				// 	$('.c_vip_empty').addClass('c_hide');
				// }
				if(that.data.isAlreadyVip){
					$(that.UI.listWrap).addClass('c_hide');
					$(that.UI.vipWrap).removeClass('c_hide');
				}else{
					$(that.UI.listBody).addClass(that.status.startLoading);
					var params = {};
					params.nums = that.data.nums;
					params.start = $(that.UI.vipItem).length;
					$.ajax({
						url: 'index.php?c=page&a=getVipProList',
						type: 'GET',
						dataType: 'json',
						data: params
					})
					.done(function(rtnData) {
						that.data.isVipAll = rtnData.result.is_all;
						that.data.isAlreadyVip = true;
						if(rtnData.result.data.list && rtnData.result.data.list.length > 0 ){
							var html = template(that.tmpl.vipListItemTmp,rtnData.result.data);
							$(that.UI.vipWrap).append(html);
						}
						if(!$(that.UI.vipItem).length){
							$('.c_vip_empty').removeClass('c_hide');
						}
						$(that.UI.scrollLoadImg).scrollLoading();
						$(that.UI.listWrap).addClass('c_hide');
						$(that.UI.vipWrap).removeClass('c_hide');
					})
					.fail(function() {
						alert("网络异常，请稍候再试~!"); 
					});
				}
				
			}else{
				$(that.UI.vipWrap).addClass('c_hide');
				$(that.UI.listWrap).removeClass('c_hide');
			}
		}).on('click',that.UI.isShowDiscount,function(){
			that.emptyProductList();
			$(that.UI.listBody).addClass(that.status.startLoading);
			var params = {};
			params.cid = ajaxData.cid;
			params.bid = ajaxData.bid;
			params.sort = ajaxData.sort;
			params.price = that.getQueryString('price');
			params.q = ajaxData.q;
			params.start = $(that.UI.listWrap+" "+that.UI.listItem).length;
			params.nums = that.data.nums;
			params.chid = ajaxData.chid;
			params.is_new = ajaxData.is_new;
			params.supplier_code = ajaxData.supplier_code;
			params.is_get_favourable = $(that.UI.isShowDiscount).attr("checked")?1:0;
			if(that.ajax.getItemAjax !== null){
				that.ajax.getItemAjax.abort();
			}
			that.ajax.getItemAjax = $.ajax({
				url:ajaxData.url,
				data:params,
				dataType:'json',
				success:function(rtnData){
					if(rtnData.code == 200){
						that.data.isAll = rtnData.result.is_all;
						if(rtnData.result.data.list && rtnData.result.data.list.length > 0 ){
							var html = template(that.tmpl.listItemTmpl,rtnData.result.data);
							$(that.UI.listWrap).append(html);
						}
						$(that.UI.scrollLoadImg).scrollLoading();
					}
					$(that.UI.listBody).removeClass(that.status.startLoading);
				},
				error:function(){
					$(that.UI.listBody).removeClass(that.status.startLoading);
				}
			});
		});

	},
	getQueryString: function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if(r!=null){
	    	return  unescape(r[2])
	    }else{
	    	return "";
	    }
	},
	jumpTo:function(jqThis){
		// 拼链接，跳转
		var that = list;
		var chid = ajaxData.chid &&'chid='+ajaxData.chid,
			sort = ajaxData.sort &&'sort='+ajaxData.sort,
			q = ajaxData.q && 'q='+ajaxData.q,
			url = 'index.php?a=page',
			cid = ajaxData.cid && 'cid='+ajaxData.cid,
			bid = ajaxData.bid && 'bid='+ajaxData.bid,
			price = ajaxData.price && 'price='+ajaxData.price;
		if(jqThis.attr('data-cid')){
			cid = 'cid='+jqThis.data('cid');
		}
		if(jqThis.attr('data-bid')){
			bid = 'bid='+jqThis.data('bid');
		}
		if(jqThis.attr('data-price')){
			price = 'price='+jqThis.data('price');
		}

		if (jqThis.attr('data-sort')) {
			var sortVaule = jqThis.data('sort');
			var sortParam = sortVaule.match(/(price|sort_order|new_order)/)[0];

			if ( sortParam == 'price' ) {
				if (sortVaule.indexOf('desc') == -1){
					sort = 'sort=price|desc';
				}else{
					sort = 'sort=price|asc';
				}
			}else if (sortParam == 'new_order') {
				sort = 'sort=new_order|desc';
			}else if (sortParam == 'sort_order'){
				sort = 'sort=sort_order|desc' 
			}
		}

		var link = that.getLink([url,chid,sort,q,cid,bid,price]);
		location.href = link;
	},
	getLink:function(arr){
		var tmp = []
		for (var i = 0; i <= arr.length - 1; i++) {
			if(arr[i]){
				tmp.push(arr[i]);
			}
		}
		return tmp.join("&");
	},
	loadMore:function(){
		var that = this;
		if(ajaxData.pageType == 2 && that.data.isShopAll == 0){
			// 店铺
			var shopParams = {
				start:$('.cyc_shop_item').length, 
				keyword:$('#search_key').val()
			}
			if(this.ajax.getShopAjax !== null){
				this.ajax.getShopAjax.abort();
			}
			// console.log(shopParams)
			this.ajax.getShopAjax = $.ajax({
				url:'index.php?c=page&a=toSearchShop',
				data:shopParams,
				dataType:'json',
				success:function(rtnData){
					if(rtnData.code == 200){
						that.data.isShopAll = rtnData.result.is_all;
						if(rtnData.result.data && rtnData.result.data.length > 0 ){
							var html = template(that.tmpl.listShopTmpl,rtnData.result);
							$(that.UI.shopWrap).append(html);   
						}
						$(that.UI.scrollLoadImg).scrollLoading();
					}
				},
				error:function(){
				}
			});
		}else if(ajaxData.pageType == 1){
			// 商品
			if(!$(this.UI.isShowVip).attr("checked")){ 
				if( !that.data.isAll ){
					// 加loading 
					$(that.UI.listBody).addClass(that.status.startLoading);
					var params = {};
					params.cid = ajaxData.cid;
					params.bid = ajaxData.bid;
					params.sort = ajaxData.sort;
					params.price = that.getQueryString('price');
					params.q = ajaxData.q;
					params.start = $(that.UI.listWrap+" "+that.UI.listItem).length;
					params.nums = that.data.nums;
					params.chid = ajaxData.chid;
					params.is_new = ajaxData.is_new;
					params.supplier_code = ajaxData.supplier_code;
					params.is_get_favourable = $(that.UI.isShowDiscount).attr("checked")?1:0;
					if(this.ajax.getItemAjax !== null){
						this.ajax.getItemAjax.abort();
					}
					this.ajax.getItemAjax = $.ajax({
						url:ajaxData.url,
						data:params,
						dataType:'json',
						success:function(rtnData){
							if(rtnData.code == 200){
								that.data.isAll = rtnData.result.is_all;
								if(rtnData.result.data.list && rtnData.result.data.list.length > 0 ){
									var html = template(that.tmpl.listItemTmpl,rtnData.result.data);
									$(that.UI.listWrap).append(html);
								}
								$(that.UI.scrollLoadImg).scrollLoading();
							}
							$(that.UI.listBody).removeClass(that.status.startLoading);
						},
						error:function(){
							$(that.UI.listBody).removeClass(that.status.startLoading);
						}
					});
				}
			}else{
				if( !that.data.isVipAll ){
					if(this.ajax.getVipItemAjax !== null){
						this.ajax.getVipItemAjax.abort();
					}
					var params = {};
					params.nums = that.data.nums;
					params.start = $(that.UI.vipItem).length;
					this.ajax.getVipItemAjax = $.ajax({
						url: 'index.php?c=page&a=getVipProList',
						type: 'GET',
						dataType: 'json',
						data: params,
						success:function(rtnData){
							that.data.isVipAll = rtnData.result.is_all;
							if(rtnData.result.data.list && rtnData.result.data.list.length > 0 ){
								var html = template(that.tmpl.vipListItemTmp,rtnData.result.data);
								$(that.UI.vipWrap).append(html);
							}
							if(!$(that.UI.vipItem).length){
								$('.c_vip_empty').removeClass('c_hide');
							}
							$(that.UI.scrollLoadImg).scrollLoading();
							$(that.UI.listWrap).addClass('c_hide');
							$(that.UI.vipWrap).removeClass('c_hide');
							$(that.UI.listBody).removeClass(that.status.startLoading);
						},
						error:function(){
							$(that.UI.listBody).removeClass(that.status.startLoading);
						}
					})
				}
			}
		}
		
	},
	emptyProductList:function(){
		$('.c_normal_list_wrap').empty();
	},
	couponTips:function(){
		var that = this;
		var couponUrl = window.location.search;
		var minimumPrice = that.getQueryString('coupon_minimum'),
			couponPrice = that.getQueryString('coupon_price');
		if(couponUrl.indexOf("coupon_minimum") > -1){
			$('.c_coupon_tips').css("display", "block");
			$('.c_coupon_minimum').text(minimumPrice);
			$('.c_coupon_price').text(couponPrice);
		}
	}
}
$(function(){
	$(list.UI.scrollLoadImg).scrollLoading();
	list.init();
})
},{"../plugins/FakeA":1,"../plugins/bdplugins":2,"../plugins/login":3,"../plugins/simulate":4,"../plugins/template":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjeWh1Yi9wYy9QdWJsaWMvc3JjL2pzL3BsdWdpbnMvRmFrZUEuanMiLCJjeWh1Yi9wYy9QdWJsaWMvc3JjL2pzL3BsdWdpbnMvYmRwbHVnaW5zLmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9wbHVnaW5zL2xvZ2luLmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9wbHVnaW5zL3NpbXVsYXRlLmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9wbHVnaW5zL3RlbXBsYXRlLmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9zaG9wL2xpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICog5LyqYeagh+etvuKApuKApuayoWhyZWbnmoRcclxuICogQHR5cGUge3tpbml0OiBpbml0fX1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdDpmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5jX2Zha2VfYScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwidmFyIGJkcGx1Z2lucyA9IHtcclxuXHRpbml0OmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmJpbmRQdXNoRXZlbnQoKTtcclxuXHR9LFxyXG5cdGJpbmRQdXNoRXZlbnQ6ZnVuY3Rpb24oKXtcclxuXHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCcuY19jb3VudF9pdGVtJyxmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XHJcblx0XHRcdHZhciBwYWdlID0gJCh0aGlzKS5kYXRhKCdwYWdlJyk7XHJcblx0XHRcdF9obXQucHVzaChbJ190cmFja0V2ZW50JywgaWQrJyAnK3BhZ2UsICdjbGljaycscGFnZV0pO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG59IFxyXG5tb2R1bGUuZXhwb3J0cyA9IGJkcGx1Z2luczsiLCJ2YXIgbG9naW4gPSB7XHJcblx0aGVpZ2h0OjAsXHJcblx0d2lkdGg6MCxcclxuXHR0YWJXcmFwOm51bGwsXHJcblx0c3VjY2Vzc0NiOm51bGwsXHJcblx0bXNnY29kZTpudWxsLFxyXG5cdG9wdDpudWxsLFxyXG5cdGlzSW5pdDpmYWxzZSxcclxuXHRpbml0OmZ1bmN0aW9uKG9wdCxjYil7XHJcblx0XHQvLyBpbml0IOeahOaXtuWAmeWIhuS4pOS4quatpemqpOOAgiAx5Liq6K6h566X5pGG5pS+5L2N572uIDLlr7l0YWLliJ3lp4vljJYgMyDlsZXnpLrlh7rmnaVcclxuXHRcdHZhciB3aW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cdFx0aWYoIXRoaXMuaXNJbml0KXtcclxuXHRcdFx0dGhpcy5pc0luaXQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLm9wdCA9IG9wdDtcclxuXHRcdFx0dGhpcy50YWJXcmFwID0gJCgnI2NfdGFiX3dyYXAnKTtcclxuXHRcdFx0dGhpcy53aWR0aCA9IHRoaXMudGFiV3JhcC5vdXRlcldpZHRoKCk7XHJcblx0XHRcdHRoaXMuaGVpZ2h0ID0gdGhpcy50YWJXcmFwLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdHRoaXMudGFiV3JhcC5jc3Moe1xyXG5cdFx0XHRcdGxlZnQ6KHdpbldpZHRoLXRoaXMuaGVpZ2h0KS8yLFxyXG5cdFx0XHRcdHRvcDp3aW5kb3cuc2Nyb2xsWSArIDIwMFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5zdWNjZXNzQ2IgPSBjYjtcclxuXHQgICAgICAgIHRoaXMuaW5pdFN0YXR1cygpO1xyXG5cdCAgICAgICAgdGhpcy5pbml0UGx1Z2luKCk7XHJcblx0ICAgICAgICB0aGlzLmN1c0V2ZW50KCk7XHJcblx0ICAgICAgICB0aGlzLm1zZ2NvZGUuaW5pdCgkKCcjY19nZXRfc21zX2NvZGUnKSwnaS5waHA/Yz1sb2dpbiZhPXJlZ1Ntc1ZlcmlmeScpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgIFx0dGhpcy50YWJXcmFwLmNzcyh7XHJcblx0XHRcdFx0bGVmdDood2luV2lkdGgtdGhpcy5oZWlnaHQpLzIsXHJcblx0XHRcdFx0dG9wOndpbmRvdy5zY3JvbGxZICsgNTBcclxuXHRcdFx0fSk7XHJcbiAgICAgICAgXHQkKCcjY19kaWFfbWFzaycpLnNob3coKTtcclxuXHRcdFx0JCgnI2NfdGFiX3dyYXAnKS5zaG93KCk7XHJcblx0XHR9XHJcbiAgICAgICAgb3B0LnR5cGUgJiYgJCgnI3RhYl8nK29wdC50eXBlKydfdGl0bGUnKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuICAgICAgICAvL3dlY2hhdCBsb2dpblxyXG4gICAgICAgIHRoaXMud2VjaGF0TG9naW4oKTtcclxuICAgICAgICBcclxuXHR9LFxyXG5cdGN1c0V2ZW50OmZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHQkKCdib2R5Jykub24oJ2NsaWNrJywnLmRpYV9jbG9zZScsZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI2NfZGlhX21hc2snKS5oaWRlKCk7XHJcblx0XHRcdCQoJyNjX3RhYl93cmFwJykuaGlkZSgpO1xyXG5cdFx0fSkub24oJ2NsaWNrJywnLmlwdF9sYWJlbCcsZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGpxVGhpcyA9ICQodGhpcykuc2libGluZ3MoJy5pcHQnKTtcclxuXHRcdFx0anFUaGlzLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRqcVRoaXMuc2libGluZ3MoJ2xhYmVsJykuaGlkZSgpO1xyXG5cdFx0XHRqcVRoaXMuZm9jdXMoKTtcclxuXHRcdH0pLm9uKCdmb2N1cycsJ2lucHV0LmlwdCcsZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGpxVGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdGpxVGhpcy5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0anFUaGlzLnNpYmxpbmdzKCdsYWJlbCcpLmhpZGUoKTtcclxuXHRcdH0pLm9uKCdibHVyJywnaW5wdXQuaXB0JyxmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIganFUaGlzID0gJCh0aGlzKTtcclxuXHRcdFx0aWYoIGpxVGhpcy52YWwoKSA9PSAnJyl7XHJcblx0XHRcdFx0anFUaGlzLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdGpxVGhpcy5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGpxVGhpcy5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRqcVRoaXMuc2libGluZ3MoJ2xhYmVsJykuaGlkZSgpO1xyXG5cdFx0XHR9IFxyXG5cdFx0fSkub24oJ2NsaWNrJywnI2xvZ19idG4nLGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwYXJhbXMgPSB7fTtcclxuXHQgICAgICAgIHBhcmFtcy5waG9uZSA9ICQoJyNjX3VzZXJfbmFtZScpLnZhbCgpO1xyXG5cdCAgICAgICAgcGFyYW1zLmNhcHRjaGEgPSAkKCcjY19sb2dfdmVyaWZ5JykudmFsKCk7XHJcblx0ICAgICAgICBwYXJhbXMucGFzc3dvcmQgPSAkKCcjY191c2VyX3BzdycpLnZhbCgpO1xyXG5cdCAgICAgICAgcGFyYW1zLnJlbWVtYmVyID0gJCgnI3JlbWVtYmVyJykudmFsKCk7XHJcblx0ICAgICAgICBpZiAocGFyYW1zLnBob25lID09ICcnKSB7IGFsZXJ0KCfor7floavlhpnnlKjmiLflkI0nKTsgcmV0dXJuIGZhbHNlOyB9O1xyXG5cdCAgICAgICAgaWYgKHBhcmFtcy5wYXNzd29yZCA9PSAnJykgeyBhbGVydCgn6K+35aGr5YaZ5a+G56CBJyk7IHJldHVybiBmYWxzZTsgfTtcclxuXHQgICAgICAgIGlmIChwYXJhbXMuY2FwdGNoYSA9PSAnJykgeyBhbGVydCgn6K+35aGr5YaZ6aqM6K+B56CBJyk7IHJldHVybiBmYWxzZTsgfTtcclxuXHQgICAgICAgICQuYWpheCh7ICBcclxuXHQgICAgICAgICAgICB0eXBlOiBcInBvc3RcIiwgIFxyXG5cdCAgICAgICAgICAgIHVybDogJ2kucGhwP2M9bG9naW4mYT1jaGVja0xvZ2luJmlzX2FqYXg9MScsICBcclxuXHQgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsICBcclxuXHQgICAgICAgICAgICBkYXRhOiB7XHJcblx0ICAgICAgICAgICAgICAgIGN5Y2FuZ191c2VyOiBwYXJhbXMucGhvbmUsXHJcblx0ICAgICAgICAgICAgICAgIGNhcHRjaGE6IHBhcmFtcy5jYXB0Y2hhLFxyXG5cdCAgICAgICAgICAgICAgICBjeWNhbmdfcHdkOiBwYXJhbXMucGFzc3dvcmQsXHJcblx0ICAgICAgICAgICAgICAgIHJlbWVtYmVyOiBwYXJhbXMucmVtZW1iZXJcclxuXHQgICAgICAgICAgICB9LCAgXHJcblx0ICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmV0KXtcclxuXHQgICAgICAgICAgICAgICAgaWYocmV0LmNvZGUgPT0gMjAwKXtcclxuXHQgICAgICAgICAgICAgICAgXHRpZih0aGF0LnN1Y2Nlc3NDYil7XHJcblx0ICAgICAgICAgICAgICAgIFx0XHRhbGVydCgn55m75b2V5oiQ5YqfLOWPr+S7peS5sOS5sOS5sOWVpigg77yez4nvvJwpISEhJyk7XHJcblx0ICAgICAgICAgICAgICAgIFx0XHQkKCcuZGlhX2Nsb3NlJykudHJpZ2dlcignY2xpY2snKTtcclxuXHQgICAgICAgICAgICAgICAgXHRcdHRoYXQuc3VjY2Vzc0NiKHRoYXQub3B0KTtcclxuXHQgICAgICAgICAgICAgICAgXHR9ZWxzZXtcclxuXHQgICAgICAgICAgICAgICAgXHRcdCQoJyNjX2RpYV9tYXNrJykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJyNjX3RhYl93cmFwJykuaGlkZSgpO1xyXG5cdCAgICAgICAgICAgICAgICBcdH1cdFxyXG5cdCAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHQgICAgICAgICAgICAgICAgICAgIGFsZXJ0KHJldC5yZXN1bHQpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfSxcclxuXHQgICAgICAgICAgICBlcnJvciA6IGZ1bmN0aW9uKHJldCl7ICAgICAgXHJcblx0ICAgICAgICAgICAgICAgIGFsZXJ0KCfmnKrnn6XplJnor6/vvIzor7fph43mlrDlsJ3or5UnKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9KTtcclxuXHRcdH0pLm9uKCdjbGljaycsJy52ZXJpZnlfaW1nJyxmdW5jdGlvbigpe1xyXG5cdFx0XHQkKHRoaXMpLmF0dHIoJ3NyYycsJ2kucGhwP2M9bG9naW4mYT1jYXB0Y2hhJyk7XHJcblx0XHR9KS5vbignY2xpY2snLCcjdGFiX3JlZ190aXRsZScsZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnLmxvZ19mb3JtX3dyYXAgLnZlcmlmeV9pbWcnKS5hdHRyKCdzcmMnLCdpLnBocD9jPWxvZ2luJmE9Y2FwdGNoYScpO1xyXG5cdFx0fSkub24oJ2NsaWNrJywnI3RhYl9sb2dpbl90aXRsZScsZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnLnJlZ19mb3JtX3dyYXAgLnZlcmlmeV9pbWcnKS5hdHRyKCdzcmMnLCdpLnBocD9jPWxvZ2luJmE9Y2FwdGNoYScpO1xyXG5cdFx0fSkub24oJ2NsaWNrJywnI3JlZ19idG4nLGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwaG9uZSA9ICQoJyNjX3JlZ19uYW1lJyksXHJcbiAgICAgICAgICAgICAgICBjYXB0Y2hhID0gJCgnI2NfcmVnX2ltZ192ZXJpZnknKSxcclxuICAgICAgICAgICAgICAgIHNtc192ZXJpZnkgPSAkKCcjY19yZWdfc21zX2NvZGUnKSxcclxuICAgICAgICAgICAgICAgIHB3ZCA9ICQoJyNjX3JlZ19wc3cnKSxcclxuICAgICAgICAgICAgICAgIHJlcHdkID0kKCcjY19yZWdfY29uZmlybV9wc3cnKSxcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhcHRjaGE6IGNhcHRjaGEudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgc21zX3ZlcmlmeTogc21zX3ZlcmlmeS52YWwoKSxcclxuICAgICAgICAgICAgICAgICAgICBjeWNhbmdfcHdkOiBwd2QudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY3ljYW5nX3JlcHdkOiByZXB3ZC52YWwoKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoYXQuTm90QmxhbmsoWycjY19yZWdfbmFtZScsICcjY19yZWdfaW1nX3ZlcmlmeScsICcjY19yZWdfc21zX2NvZGUnLCAnI2NfcmVnX3BzdycsICcjY19yZWdfY29uZmlybV9wc3cnXSkpIHtcclxuICAgICAgICAgICAgICAgIGlmKHB3ZC52YWwoKSAhPT0gcmVwd2QudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Lik5qyh5a+G56CB5LiN55u45ZCMJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHsgIFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaS5waHA/Yz1sb2dpbiZhPXJlZ2lzdGVyJywgIFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIiwgIFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsICBcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXQuY29kZSA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcdGlmKHRoYXQuc3VjY2Vzc0NiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHRcdGFsZXJ0KCfnmbvlvZXmiJDlip8s5Y+v5Lul5Lmw5Lmw5Lmw5ZWmKCDvvJ7Pie+8nCkhISEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHRcdCQoJy5kaWFfY2xvc2UnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcdFx0dGhhdC5zdWNjZXNzQ2IodGhhdC5vcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcdH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcdFx0JCgnI2NfZGlhX21hc2snKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdFx0XHQkKCcjY190YWJfd3JhcCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChyZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbihyZXQpeyAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5pyq55+l6ZSZ6K+v77yM6K+36YeN5paw5bCd6K+VJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH0pXHJcblx0fSxcclxuXHROb3RCbGFuazpmdW5jdGlvbihhcnJheSl7XHJcblx0XHQgdmFyIGxlbiA9IGFycmF5Lmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0wOyBpIDwgbGVuOyBpKyspIHsgXHJcbiAgICAgICAgICAgICAgICB2YXIgZG9tID0gJChhcnJheVtpXSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gZG9tLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYodmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZG9tLmRhdGEoJ3RleHQnKSsn5LiN6IO95Li656m6Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuXHR9LFxyXG5cdGluaXRTdGF0dXM6ZnVuY3Rpb24oKXtcclxuXHRcdCQoJyNjX2RpYV9tYXNrJykuc2hvdygpO1xyXG5cdFx0JCgnI2NfdGFiX3dyYXAnKS5zaG93KCk7XHJcbiAgICAgICAgdmFyIGFUYWJCb2R5cyA9ICQoJyN0YWJzX2JvZHkgPiBkaXYnKTtcclxuICAgICAgICAkKCcjdGFicyA+IGEnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdvbicpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdFx0XHRhVGFiQm9keXMuaGlkZSgpLmVxKGluZGV4KS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJ2lucHV0LmlwdCcpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICBcdHZhciBqcVRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIFx0aWYoanFUaGlzLnZhbCgpICE9ICcnKXtcclxuICAgICAgICBcdFx0anFUaGlzLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdGpxVGhpcy5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XHJcbiAgICAgICAgXHR9ZWxzZXtcclxuICAgICAgICBcdFx0anFUaGlzLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdGpxVGhpcy5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgfSk7XHJcblx0fSxcclxuXHRpbml0UGx1Z2luOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLm1zZ2NvZGUgPSB7XHJcbiAgICAgICAgICAgIGVsOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHRpcHM6IHVuZGVmaW5lZCxcclxuXHJcbiAgICAgICAgICAgIGJpbmQ6IGZ1bmN0aW9uKGxpbmspIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgXHRpZighdGhhdC5lbC5oYXNDbGFzcygnYnRuLWdyYXknKSl7XHJcblx0ICAgICAgICAgICAgICAgICAgIFx0dmFyIHZhbCA9ICQoJyNjX3JlZ19uYW1lJykudmFsKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgIFx0dmFyIGltZ1ZlcmlmeSA9ICQoJyNjX3JlZ19pbWdfdmVyaWZ5JykudmFsKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfmiYvmnLrlj7fnoIHkuI3og73kuLrnqbonKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuXHQgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmICghaW1nVmVyaWZ5KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WbvuW9oumqjOivgeeggeS4jeiDveS4uuepuicpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGxpbmssXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsICBcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lOiB2YWwsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHRjaGE6IGltZ1ZlcmlmeVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSl7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgLy/mnaHku7ZcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmNvZGUgPT0gMjAwKSB7IFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChkYXRhLnJlc3VsdCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZWwuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKS5hZGRDbGFzcygnYnRuLWdyYXknKS5jc3MoJ2N1cnNvcicsICdub3QtYWxsb3dlZCcpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNvdW50RG93bihmdW5jdGlvbigpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZWwudmFsKCfojrflj5bpqozor4HnoIEnKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdidG4tZ3JheScpLmNzcygnY3Vyc29yJywgJ3BvaW50ZXInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnI2VkM2YzZicpXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEucmVzdWx0KTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXHR9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oZWwsbGluaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbCA9IGVsO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy50aXBzID0gdGlwc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kKGxpbmspO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3VudERvd246IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSA2MDtcclxuXHJcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gZmNvdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvdW50IDwgMCkgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY291bnQgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgXHRjb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIFx0dGhhdC5lbC50ZXh0KCfph43mlrDojrflj5YnKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBcdHRoYXQuZWwudGV4dCgn6YeN5paw6I635Y+WKCcrIGNvdW50LS0gKyAnKScpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZWwuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmVsLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcjQ0NDJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmY291bnQsIDEwMDApXHJcbiAgICAgICAgICAgICAgICB9KSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cdH0sXHJcbiAgICB3ZWNoYXRMb2dpbjogZnVuY3Rpb24oKXtcclxuICAgIFx0JCgnLmljb25fd2VjaGF0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgIFx0XHR2YXIgb2JqID0gbmV3IFd4TG9naW4oe1xyXG5cdFx0XHRcdGlkOiBcIndlY2hhdF9sb2dpbl9jb250YWluZXJcIixcclxuXHRcdFx0XHRhcHBpZDogXCJ3eGM0NzVhM2YxZTU1ZjU0MmFcIixcclxuXHRcdFx0XHRzY29wZTogXCJzbnNhcGlfbG9naW5cIixcclxuXHRcdFx0XHRyZWRpcmVjdF91cmk6IFwiaHR0cHM6Ly9jeWNhbmcuY29tL3dlY2hhdF9sb2dpbl9jYWxsYmFjay5waHBcIixcclxuXHRcdFx0XHRzdGF0ZTogXCJcIixcclxuXHRcdFx0XHRzdHlsZTogXCJcIixcclxuXHRcdFx0XHRocmVmOiBcIlwiXHJcblx0XHRcdH0pO1xyXG4gICAgXHRcdCQoJy50YWJzX2NvbnRlbnQnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgXHRcdCQoJy5jX3dlY2hhdF9sb2dpbl9ib3gnKS5mYWRlSW4oKTtcclxuICAgIFx0fSk7XHRcclxuICAgIFx0JCgnLmNfd2VjaGF0X2JhY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcuY193ZWNoYXRfbG9naW5fYm94JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFx0JCgnLnRhYnNfY29udGVudCcpLmZhZGVJbigpO1xyXG5cdFx0fSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2luOyIsIi8qKlxyXG4gKiDmqKHmi5/ljZXpgInjgIHlpJrpgInmjInpkq5cclxuICovXHJcbnZhciBTaW11bGF0ZSA9IHtcclxuICAgIGluaXQ6ZnVuY3Rpb24ob3B0aW9ucyl7XHJcbiAgICBcdCQuZm4uYmluZENoZWNrYm94UmFkaW9TaW11bGF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBcdCAgICB2YXIgc2V0dGluZ3MgPSB7XHJcbiAgICBcdCAgICAgICAgY2xhc3NOYW1lOiAnb24nLFxyXG4gICAgXHQgICAgICAgIG9uY2xpY2s6IG51bGwsXHJcbiAgICBcdCAgICAgICAgY2hlY2tib3hfY2hlY2tlZF9mbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgXHQgICAgICAgICAgICBvYmoucGFyZW50KCkuYWRkQ2xhc3ModGhpcy5jbGFzc05hbWUpO1xyXG4gICAgXHQgICAgICAgIH0sXHJcbiAgICBcdCAgICAgICAgY2hlY2tib3hfbm9jaGVja2VkX2ZuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICBcdCAgICAgICAgICAgIG9iai5wYXJlbnQoKS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzTmFtZSk7XHJcbiAgICBcdCAgICAgICAgfSxcclxuICAgIFx0ICAgICAgICByYWRpb19jaGVja2VkX2ZuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICBcdCAgICAgICAgICAgIG9iai5wYXJlbnQoKS5hZGRDbGFzcyh0aGlzLmNsYXNzTmFtZSk7XHJcbiAgICBcdCAgICAgICAgfSxcclxuICAgIFx0ICAgICAgICByYWRpb19ub2NoZWNrZWRfZm46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgIFx0ICAgICAgICAgICAgb2JqLnBhcmVudCgpLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NOYW1lKTtcclxuICAgIFx0ICAgICAgICB9XHJcbiAgICBcdCAgICB9O1xyXG4gICAgXHQgICAgJC5leHRlbmQodHJ1ZSwgc2V0dGluZ3MsIG9wdGlvbnMpO1xyXG5cclxuICAgIFx0ICAgIC8vaW5wdXTliKTmlq3miafooYxcclxuICAgIFx0ICAgIGZ1bmN0aW9uIGlucHV0SnVkZ2VfZm4ob2JqX3RoaXMpIHtcclxuICAgIFx0ICAgICAgIFxyXG4gICAgXHQgICAgICAgIHZhciAkdGhpcyA9IG9ial90aGlzLFxyXG4gICAgXHQgICAgICAgICAgICAkdHlwZTtcclxuICAgIFx0ICAgICAgICBpZiAoJHRoaXMuYXR0cigndHlwZScpICE9IHVuZGVmaW5lZCkge1xyXG4gICAgXHQgICAgICAgICAgICAkdHlwZSA9ICR0aGlzLmF0dHIoJ3R5cGUnKTtcclxuICAgIFx0ICAgICAgICAgICAgaWYgKCR0eXBlID09ICdjaGVja2JveCcpIHsvL2lmPeWkmumAieaMiemSrlxyXG4gICAgXHQgICAgICAgICAgICAgICAgaWYgKCR0aGlzLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuY2hlY2tib3hfY2hlY2tlZF9mbigkdGhpcyk7XHJcbiAgICBcdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgXHQgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmNoZWNrYm94X25vY2hlY2tlZF9mbigkdGhpcyk7XHJcbiAgICBcdCAgICAgICAgICAgICAgICB9XHJcbiAgICBcdCAgICAgICAgICAgIH0gZWxzZSBpZiAoJHR5cGUgPT0gJ3JhZGlvJykgey8vaWY95Y2V6YCJ5oyJ6ZKuXHJcbiAgICBcdCAgICAgICAgICAgICAgICB2YXIgJHRoaXNOYW1lO1xyXG4gICAgXHQgICAgICAgICAgICAgICAgaWYgKCR0aGlzLmF0dHIoJ25hbWUnKSAhPSB1bmRlZmluZWQpIHtcclxuICAgIFx0ICAgICAgICAgICAgICAgICAgICAkdGhpc05hbWUgPSAkdGhpcy5hdHRyKCduYW1lJyk7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnJhZGlvX2NoZWNrZWRfZm4oJHRoaXMpO1xyXG4gICAgXHQgICAgICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRbbmFtZT0nXCIgKyAkdGhpc05hbWUgKyBcIiddXCIpLm5vdCgkdGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5yYWRpb19ub2NoZWNrZWRfZm4oJCh0aGlzKSk7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnJhZGlvX25vY2hlY2tlZF9mbigkdGhpcyk7XHJcbiAgICBcdCAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgXHQgICAgICAgICAgICAgICAgfVxyXG4gICAgXHQgICAgICAgICAgICB9XHJcbiAgICBcdCAgICAgICAgfVxyXG4gICAgXHQgICAgfVxyXG4gICAgXHQgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICBcdCAgICAgICAgaW5wdXRKdWRnZV9mbigkKHRoaXMpKTtcclxuICAgIFx0ICAgIH0pLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgIFx0ICAgICAgICBpbnB1dEp1ZGdlX2ZuKCQodGhpcykpO1xyXG4gICAgXHQgICAgICAgIGlmIChzZXR0aW5ncy5vbmNsaWNrKSB7XHJcbiAgICBcdCAgICAgICAgICAgIHNldHRpbmdzLm9uY2xpY2sodGhpcywge1xyXG4gICAgXHQgICAgICAgICAgICAgICAgaXNDaGVja2VkOiAkKHRoaXMpLnByb3AoXCJjaGVja2VkXCIpLC8v6L+U5Zue5piv5ZCm6YCJ5LitXHJcbiAgICBcdCAgICAgICAgICAgICAgICBvYmpUaGlzOiAkKHRoaXMpLy/ov5Tlm57oh6rlt7FcclxuICAgIFx0ICAgICAgICAgICAgfSk7XHJcbiAgICBcdCAgICAgICAgfVxyXG4gICAgXHQgICAgfSk7XHJcbiAgICBcdH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRlOyIsIi8qIWFydC10ZW1wbGF0ZSAtIFRlbXBsYXRlIEVuZ2luZSB8IGh0dHA6Ly9hdWkuZ2l0aHViLmNvbS9hcnRUZW1wbGF0ZS8qL1xyXG4hZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVybiBhLnJlcGxhY2UodCxcIlwiKS5yZXBsYWNlKHUsXCIsXCIpLnJlcGxhY2UodixcIlwiKS5yZXBsYWNlKHcsXCJcIikucmVwbGFjZSh4LFwiXCIpLnNwbGl0KHkpfWZ1bmN0aW9uIGIoYSl7cmV0dXJuXCInXCIrYS5yZXBsYWNlKC8oJ3xcXFxcKS9nLFwiXFxcXCQxXCIpLnJlcGxhY2UoL1xcci9nLFwiXFxcXHJcIikucmVwbGFjZSgvXFxuL2csXCJcXFxcblwiKStcIidcIn1mdW5jdGlvbiBjKGMsZCl7ZnVuY3Rpb24gZShhKXtyZXR1cm4gbSs9YS5zcGxpdCgvXFxuLykubGVuZ3RoLTEsayYmKGE9YS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpLnJlcGxhY2UoLzwhLS1bXFx3XFxXXSo/LS0+L2csXCJcIikpLGEmJihhPXNbMV0rYihhKStzWzJdK1wiXFxuXCIpLGF9ZnVuY3Rpb24gZihiKXt2YXIgYz1tO2lmKGo/Yj1qKGIsZCk6ZyYmKGI9Yi5yZXBsYWNlKC9cXG4vZyxmdW5jdGlvbigpe3JldHVybiBtKyssXCIkbGluZT1cIittK1wiO1wifSkpLDA9PT1iLmluZGV4T2YoXCI9XCIpKXt2YXIgZT1sJiYhL149Wz0jXS8udGVzdChiKTtpZihiPWIucmVwbGFjZSgvXj1bPSNdP3xbXFxzO10qJC9nLFwiXCIpLGUpe3ZhciBmPWIucmVwbGFjZSgvXFxzKlxcKFteXFwpXStcXCkvLFwiXCIpO25bZl18fC9eKGluY2x1ZGV8cHJpbnQpJC8udGVzdChmKXx8KGI9XCIkZXNjYXBlKFwiK2IrXCIpXCIpfWVsc2UgYj1cIiRzdHJpbmcoXCIrYitcIilcIjtiPXNbMV0rYitzWzJdfXJldHVybiBnJiYoYj1cIiRsaW5lPVwiK2MrXCI7XCIrYikscihhKGIpLGZ1bmN0aW9uKGEpe2lmKGEmJiFwW2FdKXt2YXIgYjtiPVwicHJpbnRcIj09PWE/dTpcImluY2x1ZGVcIj09PWE/djpuW2FdP1wiJHV0aWxzLlwiK2E6b1thXT9cIiRoZWxwZXJzLlwiK2E6XCIkZGF0YS5cIithLHcrPWErXCI9XCIrYitcIixcIixwW2FdPSEwfX0pLGIrXCJcXG5cIn12YXIgZz1kLmRlYnVnLGg9ZC5vcGVuVGFnLGk9ZC5jbG9zZVRhZyxqPWQucGFyc2VyLGs9ZC5jb21wcmVzcyxsPWQuZXNjYXBlLG09MSxwPXskZGF0YToxLCRmaWxlbmFtZToxLCR1dGlsczoxLCRoZWxwZXJzOjEsJG91dDoxLCRsaW5lOjF9LHE9XCJcIi50cmltLHM9cT9bXCIkb3V0PScnO1wiLFwiJG91dCs9XCIsXCI7XCIsXCIkb3V0XCJdOltcIiRvdXQ9W107XCIsXCIkb3V0LnB1c2goXCIsXCIpO1wiLFwiJG91dC5qb2luKCcnKVwiXSx0PXE/XCIkb3V0Kz10ZXh0O3JldHVybiAkb3V0O1wiOlwiJG91dC5wdXNoKHRleHQpO1wiLHU9XCJmdW5jdGlvbigpe3ZhciB0ZXh0PScnLmNvbmNhdC5hcHBseSgnJyxhcmd1bWVudHMpO1wiK3QrXCJ9XCIsdj1cImZ1bmN0aW9uKGZpbGVuYW1lLGRhdGEpe2RhdGE9ZGF0YXx8JGRhdGE7dmFyIHRleHQ9JHV0aWxzLiRpbmNsdWRlKGZpbGVuYW1lLGRhdGEsJGZpbGVuYW1lKTtcIit0K1wifVwiLHc9XCIndXNlIHN0cmljdCc7dmFyICR1dGlscz10aGlzLCRoZWxwZXJzPSR1dGlscy4kaGVscGVycyxcIisoZz9cIiRsaW5lPTAsXCI6XCJcIikseD1zWzBdLHk9XCJyZXR1cm4gbmV3IFN0cmluZyhcIitzWzNdK1wiKTtcIjtyKGMuc3BsaXQoaCksZnVuY3Rpb24oYSl7YT1hLnNwbGl0KGkpO3ZhciBiPWFbMF0sYz1hWzFdOzE9PT1hLmxlbmd0aD94Kz1lKGIpOih4Kz1mKGIpLGMmJih4Kz1lKGMpKSl9KTt2YXIgej13K3greTtnJiYoej1cInRyeXtcIit6K1wifWNhdGNoKGUpe3Rocm93IHtmaWxlbmFtZTokZmlsZW5hbWUsbmFtZTonUmVuZGVyIEVycm9yJyxtZXNzYWdlOmUubWVzc2FnZSxsaW5lOiRsaW5lLHNvdXJjZTpcIitiKGMpK1wiLnNwbGl0KC9cXFxcbi8pWyRsaW5lLTFdLnJlcGxhY2UoL15cXFxccysvLCcnKX07fVwiKTt0cnl7dmFyIEE9bmV3IEZ1bmN0aW9uKFwiJGRhdGFcIixcIiRmaWxlbmFtZVwiLHopO3JldHVybiBBLnByb3RvdHlwZT1uLEF9Y2F0Y2goQil7dGhyb3cgQi50ZW1wPVwiZnVuY3Rpb24gYW5vbnltb3VzKCRkYXRhLCRmaWxlbmFtZSkge1wiK3orXCJ9XCIsQn19dmFyIGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYj9xKGIse2ZpbGVuYW1lOmF9KTpnKGEsYil9O2QudmVyc2lvbj1cIjMuMC4wXCIsZC5jb25maWc9ZnVuY3Rpb24oYSxiKXtlW2FdPWJ9O3ZhciBlPWQuZGVmYXVsdHM9e29wZW5UYWc6XCI8JVwiLGNsb3NlVGFnOlwiJT5cIixlc2NhcGU6ITAsY2FjaGU6ITAsY29tcHJlc3M6ITEscGFyc2VyOm51bGx9LGY9ZC5jYWNoZT17fTtkLnJlbmRlcj1mdW5jdGlvbihhLGIpe3JldHVybiBxKGEsYil9O3ZhciBnPWQucmVuZGVyRmlsZT1mdW5jdGlvbihhLGIpe3ZhciBjPWQuZ2V0KGEpfHxwKHtmaWxlbmFtZTphLG5hbWU6XCJSZW5kZXIgRXJyb3JcIixtZXNzYWdlOlwiVGVtcGxhdGUgbm90IGZvdW5kXCJ9KTtyZXR1cm4gYj9jKGIpOmN9O2QuZ2V0PWZ1bmN0aW9uKGEpe3ZhciBiO2lmKGZbYV0pYj1mW2FdO2Vsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIGRvY3VtZW50KXt2YXIgYz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChhKTtpZihjKXt2YXIgZD0oYy52YWx1ZXx8Yy5pbm5lckhUTUwpLnJlcGxhY2UoL15cXHMqfFxccyokL2csXCJcIik7Yj1xKGQse2ZpbGVuYW1lOmF9KX19cmV0dXJuIGJ9O3ZhciBoPWZ1bmN0aW9uKGEsYil7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGEmJihiPXR5cGVvZiBhLFwibnVtYmVyXCI9PT1iP2ErPVwiXCI6YT1cImZ1bmN0aW9uXCI9PT1iP2goYS5jYWxsKGEpKTpcIlwiKSxhfSxpPXtcIjxcIjpcIiYjNjA7XCIsXCI+XCI6XCImIzYyO1wiLCdcIic6XCImIzM0O1wiLFwiJ1wiOlwiJiMzOTtcIixcIiZcIjpcIiYjMzg7XCJ9LGo9ZnVuY3Rpb24oYSl7cmV0dXJuIGlbYV19LGs9ZnVuY3Rpb24oYSl7cmV0dXJuIGgoYSkucmVwbGFjZSgvJig/IVtcXHcjXSs7KXxbPD5cIiddL2csail9LGw9QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09e30udG9TdHJpbmcuY2FsbChhKX0sbT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7aWYobChhKSlmb3IoYz0wLGQ9YS5sZW5ndGg7ZD5jO2MrKyliLmNhbGwoYSxhW2NdLGMsYSk7ZWxzZSBmb3IoYyBpbiBhKWIuY2FsbChhLGFbY10sYyl9LG49ZC51dGlscz17JGhlbHBlcnM6e30sJGluY2x1ZGU6Zywkc3RyaW5nOmgsJGVzY2FwZTprLCRlYWNoOm19O2QuaGVscGVyPWZ1bmN0aW9uKGEsYil7b1thXT1ifTt2YXIgbz1kLmhlbHBlcnM9bi4kaGVscGVycztkLm9uZXJyb3I9ZnVuY3Rpb24oYSl7dmFyIGI9XCJUZW1wbGF0ZSBFcnJvclxcblxcblwiO2Zvcih2YXIgYyBpbiBhKWIrPVwiPFwiK2MrXCI+XFxuXCIrYVtjXStcIlxcblxcblwiO1wib2JqZWN0XCI9PXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLmVycm9yKGIpfTt2YXIgcD1mdW5jdGlvbihhKXtyZXR1cm4gZC5vbmVycm9yKGEpLGZ1bmN0aW9uKCl7cmV0dXJuXCJ7VGVtcGxhdGUgRXJyb3J9XCJ9fSxxPWQuY29tcGlsZT1mdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGQoYyl7dHJ5e3JldHVybiBuZXcgaShjLGgpK1wiXCJ9Y2F0Y2goZCl7cmV0dXJuIGIuZGVidWc/cChkKSgpOihiLmRlYnVnPSEwLHEoYSxiKShjKSl9fWI9Ynx8e307Zm9yKHZhciBnIGluIGUpdm9pZCAwPT09YltnXSYmKGJbZ109ZVtnXSk7dmFyIGg9Yi5maWxlbmFtZTt0cnl7dmFyIGk9YyhhLGIpfWNhdGNoKGope3JldHVybiBqLmZpbGVuYW1lPWh8fFwiYW5vbnltb3VzXCIsai5uYW1lPVwiU3ludGF4IEVycm9yXCIscChqKX1yZXR1cm4gZC5wcm90b3R5cGU9aS5wcm90b3R5cGUsZC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBpLnRvU3RyaW5nKCl9LGgmJmIuY2FjaGUmJihmW2hdPWQpLGR9LHI9bi4kZWFjaCxzPVwiYnJlYWssY2FzZSxjYXRjaCxjb250aW51ZSxkZWJ1Z2dlcixkZWZhdWx0LGRlbGV0ZSxkbyxlbHNlLGZhbHNlLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLGluLGluc3RhbmNlb2YsbmV3LG51bGwscmV0dXJuLHN3aXRjaCx0aGlzLHRocm93LHRydWUsdHJ5LHR5cGVvZix2YXIsdm9pZCx3aGlsZSx3aXRoLGFic3RyYWN0LGJvb2xlYW4sYnl0ZSxjaGFyLGNsYXNzLGNvbnN0LGRvdWJsZSxlbnVtLGV4cG9ydCxleHRlbmRzLGZpbmFsLGZsb2F0LGdvdG8saW1wbGVtZW50cyxpbXBvcnQsaW50LGludGVyZmFjZSxsb25nLG5hdGl2ZSxwYWNrYWdlLHByaXZhdGUscHJvdGVjdGVkLHB1YmxpYyxzaG9ydCxzdGF0aWMsc3VwZXIsc3luY2hyb25pemVkLHRocm93cyx0cmFuc2llbnQsdm9sYXRpbGUsYXJndW1lbnRzLGxldCx5aWVsZCx1bmRlZmluZWRcIix0PS9cXC9cXCpbXFx3XFxXXSo/XFwqXFwvfFxcL1xcL1teXFxuXSpcXG58XFwvXFwvW15cXG5dKiR8XCIoPzpbXlwiXFxcXF18XFxcXFtcXHdcXFddKSpcInwnKD86W14nXFxcXF18XFxcXFtcXHdcXFddKSonfFxccypcXC5cXHMqWyRcXHdcXC5dKy9nLHU9L1teXFx3JF0rL2csdj1uZXcgUmVnRXhwKFtcIlxcXFxiXCIrcy5yZXBsYWNlKC8sL2csXCJcXFxcYnxcXFxcYlwiKStcIlxcXFxiXCJdLmpvaW4oXCJ8XCIpLFwiZ1wiKSx3PS9eXFxkW14sXSp8LFxcZFteLF0qL2cseD0vXiwrfCwrJC9nLHk9L14kfCwrLztlLm9wZW5UYWc9XCJ7e1wiLGUuY2xvc2VUYWc9XCJ9fVwiO3ZhciB6PWZ1bmN0aW9uKGEsYil7dmFyIGM9Yi5zcGxpdChcIjpcIiksZD1jLnNoaWZ0KCksZT1jLmpvaW4oXCI6XCIpfHxcIlwiO3JldHVybiBlJiYoZT1cIiwgXCIrZSksXCIkaGVscGVycy5cIitkK1wiKFwiK2ErZStcIilcIn07ZS5wYXJzZXI9ZnVuY3Rpb24oYSl7YT1hLnJlcGxhY2UoL15cXHMvLFwiXCIpO3ZhciBiPWEuc3BsaXQoXCIgXCIpLGM9Yi5zaGlmdCgpLGU9Yi5qb2luKFwiIFwiKTtzd2l0Y2goYyl7Y2FzZVwiaWZcIjphPVwiaWYoXCIrZStcIil7XCI7YnJlYWs7Y2FzZVwiZWxzZVwiOmI9XCJpZlwiPT09Yi5zaGlmdCgpP1wiIGlmKFwiK2Iuam9pbihcIiBcIikrXCIpXCI6XCJcIixhPVwifWVsc2VcIitiK1wie1wiO2JyZWFrO2Nhc2VcIi9pZlwiOmE9XCJ9XCI7YnJlYWs7Y2FzZVwiZWFjaFwiOnZhciBmPWJbMF18fFwiJGRhdGFcIixnPWJbMV18fFwiYXNcIixoPWJbMl18fFwiJHZhbHVlXCIsaT1iWzNdfHxcIiRpbmRleFwiLGo9aCtcIixcIitpO1wiYXNcIiE9PWcmJihmPVwiW11cIiksYT1cIiRlYWNoKFwiK2YrXCIsZnVuY3Rpb24oXCIraitcIil7XCI7YnJlYWs7Y2FzZVwiL2VhY2hcIjphPVwifSk7XCI7YnJlYWs7Y2FzZVwiZWNob1wiOmE9XCJwcmludChcIitlK1wiKTtcIjticmVhaztjYXNlXCJwcmludFwiOmNhc2VcImluY2x1ZGVcIjphPWMrXCIoXCIrYi5qb2luKFwiLFwiKStcIik7XCI7YnJlYWs7ZGVmYXVsdDppZigvXlxccypcXHxcXHMqW1xcd1xcJF0vLnRlc3QoZSkpe3ZhciBrPSEwOzA9PT1hLmluZGV4T2YoXCIjXCIpJiYoYT1hLnN1YnN0cigxKSxrPSExKTtmb3IodmFyIGw9MCxtPWEuc3BsaXQoXCJ8XCIpLG49bS5sZW5ndGgsbz1tW2wrK107bj5sO2wrKylvPXoobyxtW2xdKTthPShrP1wiPVwiOlwiPSNcIikrb31lbHNlIGE9ZC5oZWxwZXJzW2NdP1wiPSNcIitjK1wiKFwiK2Iuam9pbihcIixcIikrXCIpO1wiOlwiPVwiK2F9cmV0dXJuIGF9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZT9kZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZH0pOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWQ6dGhpcy50ZW1wbGF0ZT1kfSgpOyIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvdGVtcGxhdGUnKTtcclxudmFyIGZha2UgPSByZXF1aXJlKCcuLi9wbHVnaW5zL0Zha2VBJyk7XHJcbnZhciBsb2dpbiA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvbG9naW4nKTtcclxudmFyIHNpbXVsYXRlID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9zaW11bGF0ZScpO1xyXG52YXIgYmRwbHVnaW5zID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9iZHBsdWdpbnMnKTtcclxudmFyIGxpc3QgPSB7XHJcblx0VUk6e1xyXG5cdFx0Z290b1RvcDonLmNfZml4X3RvcCcsXHJcblx0XHRsaXN0V3JhcDonLmNfbm9ybWFsX2xpc3Rfd3JhcCcsXHJcblx0XHRzaG9wV3JhcDonLmN5Y19zaG9wX2xpc3QnLFxyXG5cdFx0bGlzdEl0ZW06Jy5jX2xpc3RfaXRlbScsXHJcblx0XHRsaXN0Qm9keTonLmN5Y19saXN0X2NvbnRlbnQnLFxyXG5cdFx0c2Nyb2xsTG9hZEltZzonLmNfc2Nyb2xsX2xvYWQnLFxyXG5cdFx0Y2F0TW9yZTonLmN5Y19zaG93X21vcmUnLFxyXG5cdFx0bW9yZVBhcmVudDonLmN5Y19tb3JlX3BhcmVudCcsXHJcblx0XHRsaW5rSXRlbTonLmN5Y19saW5rJyxcclxuXHRcdGlzU2hvd1ZpcDonLmNfaXNfdmlwX3Nob3cnLFxyXG5cdFx0dmlwSXRlbTonLmNfaXNfdmlwX3ByaWNlJyxcclxuXHRcdHZpcFdyYXA6Jy5jX3ZpcF93cmFwJyxcclxuXHRcdGlzU2hvd0Rpc2NvdW50OicuY19pc19zaG93X2Rpc2NvdW50J1xyXG5cdH0sXHJcblx0ZGF0YTp7XHJcblx0XHRpc0FsbDowLCAvLyDmmK/lkKblhajpg6jliqDovb3lrozmr5VcclxuXHRcdGlzU2hvcEFsbDowLFxyXG5cdFx0bnVtczoyMCwvLyDmr4/mrKHliqDovb3nmoTkuKrmlbBcclxuXHRcdGFqYXhVcmw6JycsIC8vIOaOpeWPo+WcsOWdgFxyXG5cdFx0c2hvd0JyYW5kTnVtczoxNCwgLy8g5pi+56S655qE5ZOB54mM5pWwXHJcblx0XHRpc1ZpcEFsbDowLFxyXG5cdFx0aXNBbHJlYWR5VmlwOmZhbHNlXHJcblx0fSxcclxuXHRzdGF0dXM6e1xyXG5cdFx0c3RhcnRMb2FkaW5nOidjX2xpc3Rfc3RhdF9sb2FkJyxcclxuXHRcdG9wZW5Nb3JlOidjeWNfb3Blbl9tb3JlJ1xyXG5cdH0sXHJcblx0dG1wbDp7XHJcblx0XHRsaXN0SXRlbVRtcGw6J2NfbGlzdF9pdGVtX3RtcGwnLFxyXG5cdFx0dmlwTGlzdEl0ZW1UbXA6J2NfdmlwX2xpc3RfaXRlbV90bXBsJyxcclxuXHRcdGxpc3RTaG9wVG1wbDonY19zaG9wX2xpc3RfaXRlbV90bXBsJ1xyXG5cdH0sXHJcblx0YWpheDp7XHJcblx0XHRnZXRJdGVtQWpheDpudWxsLFxyXG5cdFx0Z2V0VmlwSXRlbUFqYXg6bnVsbCxcclxuXHRcdGdldFNob3BBamF4Om51bGxcclxuXHR9LFxyXG5cdGluaXQ6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuaW5pdFBsdWdpbigpO1xyXG5cdFx0dGhpcy5iaW5kQ3VzRXZlbnQoKTtcclxuXHRcdHRoaXMuY291cG9uVGlwcygpO1xyXG5cdH0sXHJcblx0aW5pdFBsdWdpbjpmdW5jdGlvbigpe1xyXG5cdFx0ZmFrZS5pbml0KCk7XHJcblx0XHRzaW11bGF0ZS5pbml0KCk7XHJcblx0XHRiZHBsdWdpbnMuaW5pdCgpO1xyXG5cdH0sXHJcblx0YmluZEN1c0V2ZW50OmZ1bmN0aW9uKCl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB3aW5IZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblx0XHRcdHZhciBqcUdvdG9Ub3AgPSAkKHRoYXQuVUkuZ290b1RvcCk7XHJcblx0XHRcdCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHdpbkhlaWdodCA/IGpxR290b1RvcC5mYWRlSW4oMTAwMCk6anFHb3RvVG9wLmZhZGVPdXQoMTAwMCk7XHJcblx0XHRcdGlmKCAhJCgnLmNfbGlzdF9lbXB0eScpLmxlbmd0aCAmJiAkKGRvY3VtZW50KS5oZWlnaHQoKSAtICQodGhpcykuc2Nyb2xsVG9wKCkgLSAkKHRoaXMpLmhlaWdodCgpIDw9IDEwMCApe1xyXG5cdFx0XHRcdHRoYXQubG9hZE1vcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHQkKCcuY19jaGVja2JveF9zaW11bGF0ZSBpbnB1dCcpLmJpbmRDaGVja2JveFJhZGlvU2ltdWxhdGUoKTtcclxuXHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHQkKCdib2R5Jykub24oJ2NsaWNrJyx0aGlzLlVJLmdvdG9Ub3AsZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnYm9keSxodG1sJykuYW5pbWF0ZSh7c2Nyb2xsVG9wOjB9LDEwMDApO1xyXG5cdFx0fSkub24oJ2NsaWNrJyx0aGlzLlVJLmNhdE1vcmUsZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCh0aGF0LlVJLm1vcmVQYXJlbnQpO1xyXG5cdFx0XHRpZihwYXJlbnQuaGFzQ2xhc3ModGhhdC5zdGF0dXMub3Blbk1vcmUpKXtcclxuXHRcdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3ModGhhdC5zdGF0dXMub3Blbk1vcmUpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwYXJlbnQuYWRkQ2xhc3ModGhhdC5zdGF0dXMub3Blbk1vcmUpO1xyXG5cdFx0XHR9XHRcclxuXHRcdH0pLm9uKCdjbGljaycsdGhpcy5VSS5saW5rSXRlbSxmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIganFUaGlzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhhdC5qdW1wVG8oanFUaGlzKTtcclxuXHRcdH0pLm9uKCdjbGljaycsdGhpcy5VSS5pc1Nob3dWaXAsZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJCh0aGlzKS5hdHRyKFwiY2hlY2tlZFwiKSl7IFxyXG5cdFx0XHRcdC8vICQodGhhdC5VSS5saXN0SXRlbSkubm90KCcuY19pc192aXBfcHJpY2UnKS5hZGRDbGFzcygnY19oaWRlJyk7XHJcblx0XHRcdFx0Ly8gaWYoISQoJy5jX2lzX3ZpcF9wcmljZScpLmxlbmd0aCl7XHJcblx0XHRcdFx0Ly8gXHQkKCcuY192aXBfZW1wdHknKS5yZW1vdmVDbGFzcygnY19oaWRlJyk7XHJcblx0XHRcdFx0Ly8gfWVsc2V7XHJcblx0XHRcdFx0Ly8gXHQkKCcuY192aXBfZW1wdHknKS5hZGRDbGFzcygnY19oaWRlJyk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdGlmKHRoYXQuZGF0YS5pc0FscmVhZHlWaXApe1xyXG5cdFx0XHRcdFx0JCh0aGF0LlVJLmxpc3RXcmFwKS5hZGRDbGFzcygnY19oaWRlJyk7XHJcblx0XHRcdFx0XHQkKHRoYXQuVUkudmlwV3JhcCkucmVtb3ZlQ2xhc3MoJ2NfaGlkZScpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JCh0aGF0LlVJLmxpc3RCb2R5KS5hZGRDbGFzcyh0aGF0LnN0YXR1cy5zdGFydExvYWRpbmcpO1xyXG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IHt9O1xyXG5cdFx0XHRcdFx0cGFyYW1zLm51bXMgPSB0aGF0LmRhdGEubnVtcztcclxuXHRcdFx0XHRcdHBhcmFtcy5zdGFydCA9ICQodGhhdC5VSS52aXBJdGVtKS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdFx0XHR1cmw6ICdpbmRleC5waHA/Yz1wYWdlJmE9Z2V0VmlwUHJvTGlzdCcsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICdHRVQnLFxyXG5cdFx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBwYXJhbXNcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuZG9uZShmdW5jdGlvbihydG5EYXRhKSB7XHJcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5pc1ZpcEFsbCA9IHJ0bkRhdGEucmVzdWx0LmlzX2FsbDtcclxuXHRcdFx0XHRcdFx0dGhhdC5kYXRhLmlzQWxyZWFkeVZpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGlmKHJ0bkRhdGEucmVzdWx0LmRhdGEubGlzdCAmJiBydG5EYXRhLnJlc3VsdC5kYXRhLmxpc3QubGVuZ3RoID4gMCApe1xyXG5cdFx0XHRcdFx0XHRcdHZhciBodG1sID0gdGVtcGxhdGUodGhhdC50bXBsLnZpcExpc3RJdGVtVG1wLHJ0bkRhdGEucmVzdWx0LmRhdGEpO1xyXG5cdFx0XHRcdFx0XHRcdCQodGhhdC5VSS52aXBXcmFwKS5hcHBlbmQoaHRtbCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoISQodGhhdC5VSS52aXBJdGVtKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5jX3ZpcF9lbXB0eScpLnJlbW92ZUNsYXNzKCdjX2hpZGUnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkKHRoYXQuVUkuc2Nyb2xsTG9hZEltZykuc2Nyb2xsTG9hZGluZygpO1xyXG5cdFx0XHRcdFx0XHQkKHRoYXQuVUkubGlzdFdyYXApLmFkZENsYXNzKCdjX2hpZGUnKTtcclxuXHRcdFx0XHRcdFx0JCh0aGF0LlVJLnZpcFdyYXApLnJlbW92ZUNsYXNzKCdjX2hpZGUnKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuZmFpbChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0YWxlcnQoXCLnvZHnu5zlvILluLjvvIzor7fnqI3lgJnlho3or5V+IVwiKTsgXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCQodGhhdC5VSS52aXBXcmFwKS5hZGRDbGFzcygnY19oaWRlJyk7XHJcblx0XHRcdFx0JCh0aGF0LlVJLmxpc3RXcmFwKS5yZW1vdmVDbGFzcygnY19oaWRlJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pLm9uKCdjbGljaycsdGhhdC5VSS5pc1Nob3dEaXNjb3VudCxmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGF0LmVtcHR5UHJvZHVjdExpc3QoKTtcclxuXHRcdFx0JCh0aGF0LlVJLmxpc3RCb2R5KS5hZGRDbGFzcyh0aGF0LnN0YXR1cy5zdGFydExvYWRpbmcpO1xyXG5cdFx0XHR2YXIgcGFyYW1zID0ge307XHJcblx0XHRcdHBhcmFtcy5jaWQgPSBhamF4RGF0YS5jaWQ7XHJcblx0XHRcdHBhcmFtcy5iaWQgPSBhamF4RGF0YS5iaWQ7XHJcblx0XHRcdHBhcmFtcy5zb3J0ID0gYWpheERhdGEuc29ydDtcclxuXHRcdFx0cGFyYW1zLnByaWNlID0gdGhhdC5nZXRRdWVyeVN0cmluZygncHJpY2UnKTtcclxuXHRcdFx0cGFyYW1zLnEgPSBhamF4RGF0YS5xO1xyXG5cdFx0XHRwYXJhbXMuc3RhcnQgPSAkKHRoYXQuVUkubGlzdFdyYXArXCIgXCIrdGhhdC5VSS5saXN0SXRlbSkubGVuZ3RoO1xyXG5cdFx0XHRwYXJhbXMubnVtcyA9IHRoYXQuZGF0YS5udW1zO1xyXG5cdFx0XHRwYXJhbXMuY2hpZCA9IGFqYXhEYXRhLmNoaWQ7XHJcblx0XHRcdHBhcmFtcy5pc19uZXcgPSBhamF4RGF0YS5pc19uZXc7XHJcblx0XHRcdHBhcmFtcy5zdXBwbGllcl9jb2RlID0gYWpheERhdGEuc3VwcGxpZXJfY29kZTtcclxuXHRcdFx0cGFyYW1zLmlzX2dldF9mYXZvdXJhYmxlID0gJCh0aGF0LlVJLmlzU2hvd0Rpc2NvdW50KS5hdHRyKFwiY2hlY2tlZFwiKT8xOjA7XHJcblx0XHRcdGlmKHRoYXQuYWpheC5nZXRJdGVtQWpheCAhPT0gbnVsbCl7XHJcblx0XHRcdFx0dGhhdC5hamF4LmdldEl0ZW1BamF4LmFib3J0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhhdC5hamF4LmdldEl0ZW1BamF4ID0gJC5hamF4KHtcclxuXHRcdFx0XHR1cmw6YWpheERhdGEudXJsLFxyXG5cdFx0XHRcdGRhdGE6cGFyYW1zLFxyXG5cdFx0XHRcdGRhdGFUeXBlOidqc29uJyxcclxuXHRcdFx0XHRzdWNjZXNzOmZ1bmN0aW9uKHJ0bkRhdGEpe1xyXG5cdFx0XHRcdFx0aWYocnRuRGF0YS5jb2RlID09IDIwMCl7XHJcblx0XHRcdFx0XHRcdHRoYXQuZGF0YS5pc0FsbCA9IHJ0bkRhdGEucmVzdWx0LmlzX2FsbDtcclxuXHRcdFx0XHRcdFx0aWYocnRuRGF0YS5yZXN1bHQuZGF0YS5saXN0ICYmIHJ0bkRhdGEucmVzdWx0LmRhdGEubGlzdC5sZW5ndGggPiAwICl7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGh0bWwgPSB0ZW1wbGF0ZSh0aGF0LnRtcGwubGlzdEl0ZW1UbXBsLHJ0bkRhdGEucmVzdWx0LmRhdGEpO1xyXG5cdFx0XHRcdFx0XHRcdCQodGhhdC5VSS5saXN0V3JhcCkuYXBwZW5kKGh0bWwpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCQodGhhdC5VSS5zY3JvbGxMb2FkSW1nKS5zY3JvbGxMb2FkaW5nKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkKHRoYXQuVUkubGlzdEJvZHkpLnJlbW92ZUNsYXNzKHRoYXQuc3RhdHVzLnN0YXJ0TG9hZGluZyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRlcnJvcjpmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0JCh0aGF0LlVJLmxpc3RCb2R5KS5yZW1vdmVDbGFzcyh0aGF0LnN0YXR1cy5zdGFydExvYWRpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fSxcclxuXHRnZXRRdWVyeVN0cmluZzogZnVuY3Rpb24obmFtZSl7XHJcblx0XHR2YXIgcmVnID0gbmV3IFJlZ0V4cChcIihefCYpXCIrIG5hbWUgK1wiPShbXiZdKikoJnwkKVwiKTtcclxuXHQgICAgdmFyIHIgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG5cdCAgICBpZihyIT1udWxsKXtcclxuXHQgICAgXHRyZXR1cm4gIHVuZXNjYXBlKHJbMl0pXHJcblx0ICAgIH1lbHNle1xyXG5cdCAgICBcdHJldHVybiBcIlwiO1xyXG5cdCAgICB9XHJcblx0fSxcclxuXHRqdW1wVG86ZnVuY3Rpb24oanFUaGlzKXtcclxuXHRcdC8vIOaLvOmTvuaOpe+8jOi3s+i9rFxyXG5cdFx0dmFyIHRoYXQgPSBsaXN0O1xyXG5cdFx0dmFyIGNoaWQgPSBhamF4RGF0YS5jaGlkICYmJ2NoaWQ9JythamF4RGF0YS5jaGlkLFxyXG5cdFx0XHRzb3J0ID0gYWpheERhdGEuc29ydCAmJidzb3J0PScrYWpheERhdGEuc29ydCxcclxuXHRcdFx0cSA9IGFqYXhEYXRhLnEgJiYgJ3E9JythamF4RGF0YS5xLFxyXG5cdFx0XHR1cmwgPSAnaW5kZXgucGhwP2E9cGFnZScsXHJcblx0XHRcdGNpZCA9IGFqYXhEYXRhLmNpZCAmJiAnY2lkPScrYWpheERhdGEuY2lkLFxyXG5cdFx0XHRiaWQgPSBhamF4RGF0YS5iaWQgJiYgJ2JpZD0nK2FqYXhEYXRhLmJpZCxcclxuXHRcdFx0cHJpY2UgPSBhamF4RGF0YS5wcmljZSAmJiAncHJpY2U9JythamF4RGF0YS5wcmljZTtcclxuXHRcdGlmKGpxVGhpcy5hdHRyKCdkYXRhLWNpZCcpKXtcclxuXHRcdFx0Y2lkID0gJ2NpZD0nK2pxVGhpcy5kYXRhKCdjaWQnKTtcclxuXHRcdH1cclxuXHRcdGlmKGpxVGhpcy5hdHRyKCdkYXRhLWJpZCcpKXtcclxuXHRcdFx0YmlkID0gJ2JpZD0nK2pxVGhpcy5kYXRhKCdiaWQnKTtcclxuXHRcdH1cclxuXHRcdGlmKGpxVGhpcy5hdHRyKCdkYXRhLXByaWNlJykpe1xyXG5cdFx0XHRwcmljZSA9ICdwcmljZT0nK2pxVGhpcy5kYXRhKCdwcmljZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChqcVRoaXMuYXR0cignZGF0YS1zb3J0JykpIHtcclxuXHRcdFx0dmFyIHNvcnRWYXVsZSA9IGpxVGhpcy5kYXRhKCdzb3J0Jyk7XHJcblx0XHRcdHZhciBzb3J0UGFyYW0gPSBzb3J0VmF1bGUubWF0Y2goLyhwcmljZXxzb3J0X29yZGVyfG5ld19vcmRlcikvKVswXTtcclxuXHJcblx0XHRcdGlmICggc29ydFBhcmFtID09ICdwcmljZScgKSB7XHJcblx0XHRcdFx0aWYgKHNvcnRWYXVsZS5pbmRleE9mKCdkZXNjJykgPT0gLTEpe1xyXG5cdFx0XHRcdFx0c29ydCA9ICdzb3J0PXByaWNlfGRlc2MnO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c29ydCA9ICdzb3J0PXByaWNlfGFzYyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZSBpZiAoc29ydFBhcmFtID09ICduZXdfb3JkZXInKSB7XHJcblx0XHRcdFx0c29ydCA9ICdzb3J0PW5ld19vcmRlcnxkZXNjJztcclxuXHRcdFx0fWVsc2UgaWYgKHNvcnRQYXJhbSA9PSAnc29ydF9vcmRlcicpe1xyXG5cdFx0XHRcdHNvcnQgPSAnc29ydD1zb3J0X29yZGVyfGRlc2MnIFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGxpbmsgPSB0aGF0LmdldExpbmsoW3VybCxjaGlkLHNvcnQscSxjaWQsYmlkLHByaWNlXSk7XHJcblx0XHRsb2NhdGlvbi5ocmVmID0gbGluaztcclxuXHR9LFxyXG5cdGdldExpbms6ZnVuY3Rpb24oYXJyKXtcclxuXHRcdHZhciB0bXAgPSBbXVxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gYXJyLmxlbmd0aCAtIDE7IGkrKykge1xyXG5cdFx0XHRpZihhcnJbaV0pe1xyXG5cdFx0XHRcdHRtcC5wdXNoKGFycltpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0bXAuam9pbihcIiZcIik7XHJcblx0fSxcclxuXHRsb2FkTW9yZTpmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0aWYoYWpheERhdGEucGFnZVR5cGUgPT0gMiAmJiB0aGF0LmRhdGEuaXNTaG9wQWxsID09IDApe1xyXG5cdFx0XHQvLyDlupfpk7pcclxuXHRcdFx0dmFyIHNob3BQYXJhbXMgPSB7XHJcblx0XHRcdFx0c3RhcnQ6JCgnLmN5Y19zaG9wX2l0ZW0nKS5sZW5ndGgsIFxyXG5cdFx0XHRcdGtleXdvcmQ6JCgnI3NlYXJjaF9rZXknKS52YWwoKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRoaXMuYWpheC5nZXRTaG9wQWpheCAhPT0gbnVsbCl7XHJcblx0XHRcdFx0dGhpcy5hamF4LmdldFNob3BBamF4LmFib3J0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coc2hvcFBhcmFtcylcclxuXHRcdFx0dGhpcy5hamF4LmdldFNob3BBamF4ID0gJC5hamF4KHtcclxuXHRcdFx0XHR1cmw6J2luZGV4LnBocD9jPXBhZ2UmYT10b1NlYXJjaFNob3AnLFxyXG5cdFx0XHRcdGRhdGE6c2hvcFBhcmFtcyxcclxuXHRcdFx0XHRkYXRhVHlwZTonanNvbicsXHJcblx0XHRcdFx0c3VjY2VzczpmdW5jdGlvbihydG5EYXRhKXtcclxuXHRcdFx0XHRcdGlmKHJ0bkRhdGEuY29kZSA9PSAyMDApe1xyXG5cdFx0XHRcdFx0XHR0aGF0LmRhdGEuaXNTaG9wQWxsID0gcnRuRGF0YS5yZXN1bHQuaXNfYWxsO1xyXG5cdFx0XHRcdFx0XHRpZihydG5EYXRhLnJlc3VsdC5kYXRhICYmIHJ0bkRhdGEucmVzdWx0LmRhdGEubGVuZ3RoID4gMCApe1xyXG5cdFx0XHRcdFx0XHRcdHZhciBodG1sID0gdGVtcGxhdGUodGhhdC50bXBsLmxpc3RTaG9wVG1wbCxydG5EYXRhLnJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdFx0JCh0aGF0LlVJLnNob3BXcmFwKS5hcHBlbmQoaHRtbCk7ICAgXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0JCh0aGF0LlVJLnNjcm9sbExvYWRJbWcpLnNjcm9sbExvYWRpbmcoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGVycm9yOmZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNlIGlmKGFqYXhEYXRhLnBhZ2VUeXBlID09IDEpe1xyXG5cdFx0XHQvLyDllYblk4FcclxuXHRcdFx0aWYoISQodGhpcy5VSS5pc1Nob3dWaXApLmF0dHIoXCJjaGVja2VkXCIpKXsgXHJcblx0XHRcdFx0aWYoICF0aGF0LmRhdGEuaXNBbGwgKXtcclxuXHRcdFx0XHRcdC8vIOWKoGxvYWRpbmcgXHJcblx0XHRcdFx0XHQkKHRoYXQuVUkubGlzdEJvZHkpLmFkZENsYXNzKHRoYXQuc3RhdHVzLnN0YXJ0TG9hZGluZyk7XHJcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0ge307XHJcblx0XHRcdFx0XHRwYXJhbXMuY2lkID0gYWpheERhdGEuY2lkO1xyXG5cdFx0XHRcdFx0cGFyYW1zLmJpZCA9IGFqYXhEYXRhLmJpZDtcclxuXHRcdFx0XHRcdHBhcmFtcy5zb3J0ID0gYWpheERhdGEuc29ydDtcclxuXHRcdFx0XHRcdHBhcmFtcy5wcmljZSA9IHRoYXQuZ2V0UXVlcnlTdHJpbmcoJ3ByaWNlJyk7XHJcblx0XHRcdFx0XHRwYXJhbXMucSA9IGFqYXhEYXRhLnE7XHJcblx0XHRcdFx0XHRwYXJhbXMuc3RhcnQgPSAkKHRoYXQuVUkubGlzdFdyYXArXCIgXCIrdGhhdC5VSS5saXN0SXRlbSkubGVuZ3RoO1xyXG5cdFx0XHRcdFx0cGFyYW1zLm51bXMgPSB0aGF0LmRhdGEubnVtcztcclxuXHRcdFx0XHRcdHBhcmFtcy5jaGlkID0gYWpheERhdGEuY2hpZDtcclxuXHRcdFx0XHRcdHBhcmFtcy5pc19uZXcgPSBhamF4RGF0YS5pc19uZXc7XHJcblx0XHRcdFx0XHRwYXJhbXMuc3VwcGxpZXJfY29kZSA9IGFqYXhEYXRhLnN1cHBsaWVyX2NvZGU7XHJcblx0XHRcdFx0XHRwYXJhbXMuaXNfZ2V0X2Zhdm91cmFibGUgPSAkKHRoYXQuVUkuaXNTaG93RGlzY291bnQpLmF0dHIoXCJjaGVja2VkXCIpPzE6MDtcclxuXHRcdFx0XHRcdGlmKHRoaXMuYWpheC5nZXRJdGVtQWpheCAhPT0gbnVsbCl7XHJcblx0XHRcdFx0XHRcdHRoaXMuYWpheC5nZXRJdGVtQWpheC5hYm9ydCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5hamF4LmdldEl0ZW1BamF4ID0gJC5hamF4KHtcclxuXHRcdFx0XHRcdFx0dXJsOmFqYXhEYXRhLnVybCxcclxuXHRcdFx0XHRcdFx0ZGF0YTpwYXJhbXMsXHJcblx0XHRcdFx0XHRcdGRhdGFUeXBlOidqc29uJyxcclxuXHRcdFx0XHRcdFx0c3VjY2VzczpmdW5jdGlvbihydG5EYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRpZihydG5EYXRhLmNvZGUgPT0gMjAwKXtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQuZGF0YS5pc0FsbCA9IHJ0bkRhdGEucmVzdWx0LmlzX2FsbDtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKHJ0bkRhdGEucmVzdWx0LmRhdGEubGlzdCAmJiBydG5EYXRhLnJlc3VsdC5kYXRhLmxpc3QubGVuZ3RoID4gMCApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgaHRtbCA9IHRlbXBsYXRlKHRoYXQudG1wbC5saXN0SXRlbVRtcGwscnRuRGF0YS5yZXN1bHQuZGF0YSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCQodGhhdC5VSS5saXN0V3JhcCkuYXBwZW5kKGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0JCh0aGF0LlVJLnNjcm9sbExvYWRJbWcpLnNjcm9sbExvYWRpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0JCh0aGF0LlVJLmxpc3RCb2R5KS5yZW1vdmVDbGFzcyh0aGF0LnN0YXR1cy5zdGFydExvYWRpbmcpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRlcnJvcjpmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRcdCQodGhhdC5VSS5saXN0Qm9keSkucmVtb3ZlQ2xhc3ModGhhdC5zdGF0dXMuc3RhcnRMb2FkaW5nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiggIXRoYXQuZGF0YS5pc1ZpcEFsbCApe1xyXG5cdFx0XHRcdFx0aWYodGhpcy5hamF4LmdldFZpcEl0ZW1BamF4ICE9PSBudWxsKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5hamF4LmdldFZpcEl0ZW1BamF4LmFib3J0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0ge307XHJcblx0XHRcdFx0XHRwYXJhbXMubnVtcyA9IHRoYXQuZGF0YS5udW1zO1xyXG5cdFx0XHRcdFx0cGFyYW1zLnN0YXJ0ID0gJCh0aGF0LlVJLnZpcEl0ZW0pLmxlbmd0aDtcclxuXHRcdFx0XHRcdHRoaXMuYWpheC5nZXRWaXBJdGVtQWpheCA9ICQuYWpheCh7XHJcblx0XHRcdFx0XHRcdHVybDogJ2luZGV4LnBocD9jPXBhZ2UmYT1nZXRWaXBQcm9MaXN0JyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ0dFVCcsXHJcblx0XHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRcdGRhdGE6IHBhcmFtcyxcclxuXHRcdFx0XHRcdFx0c3VjY2VzczpmdW5jdGlvbihydG5EYXRhKXtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LmRhdGEuaXNWaXBBbGwgPSBydG5EYXRhLnJlc3VsdC5pc19hbGw7XHJcblx0XHRcdFx0XHRcdFx0aWYocnRuRGF0YS5yZXN1bHQuZGF0YS5saXN0ICYmIHJ0bkRhdGEucmVzdWx0LmRhdGEubGlzdC5sZW5ndGggPiAwICl7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgaHRtbCA9IHRlbXBsYXRlKHRoYXQudG1wbC52aXBMaXN0SXRlbVRtcCxydG5EYXRhLnJlc3VsdC5kYXRhKTtcclxuXHRcdFx0XHRcdFx0XHRcdCQodGhhdC5VSS52aXBXcmFwKS5hcHBlbmQoaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKCEkKHRoYXQuVUkudmlwSXRlbSkubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0XHRcdCQoJy5jX3ZpcF9lbXB0eScpLnJlbW92ZUNsYXNzKCdjX2hpZGUnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0JCh0aGF0LlVJLnNjcm9sbExvYWRJbWcpLnNjcm9sbExvYWRpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHQkKHRoYXQuVUkubGlzdFdyYXApLmFkZENsYXNzKCdjX2hpZGUnKTtcclxuXHRcdFx0XHRcdFx0XHQkKHRoYXQuVUkudmlwV3JhcCkucmVtb3ZlQ2xhc3MoJ2NfaGlkZScpO1xyXG5cdFx0XHRcdFx0XHRcdCQodGhhdC5VSS5saXN0Qm9keSkucmVtb3ZlQ2xhc3ModGhhdC5zdGF0dXMuc3RhcnRMb2FkaW5nKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0ZXJyb3I6ZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0XHQkKHRoYXQuVUkubGlzdEJvZHkpLnJlbW92ZUNsYXNzKHRoYXQuc3RhdHVzLnN0YXJ0TG9hZGluZyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHR9LFxyXG5cdGVtcHR5UHJvZHVjdExpc3Q6ZnVuY3Rpb24oKXtcclxuXHRcdCQoJy5jX25vcm1hbF9saXN0X3dyYXAnKS5lbXB0eSgpO1xyXG5cdH0sXHJcblx0Y291cG9uVGlwczpmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIGNvdXBvblVybCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcblx0XHR2YXIgbWluaW11bVByaWNlID0gdGhhdC5nZXRRdWVyeVN0cmluZygnY291cG9uX21pbmltdW0nKSxcclxuXHRcdFx0Y291cG9uUHJpY2UgPSB0aGF0LmdldFF1ZXJ5U3RyaW5nKCdjb3Vwb25fcHJpY2UnKTtcclxuXHRcdGlmKGNvdXBvblVybC5pbmRleE9mKFwiY291cG9uX21pbmltdW1cIikgPiAtMSl7XHJcblx0XHRcdCQoJy5jX2NvdXBvbl90aXBzJykuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xyXG5cdFx0XHQkKCcuY19jb3Vwb25fbWluaW11bScpLnRleHQobWluaW11bVByaWNlKTtcclxuXHRcdFx0JCgnLmNfY291cG9uX3ByaWNlJykudGV4dChjb3Vwb25QcmljZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiQoZnVuY3Rpb24oKXtcclxuXHQkKGxpc3QuVUkuc2Nyb2xsTG9hZEltZykuc2Nyb2xsTG9hZGluZygpO1xyXG5cdGxpc3QuaW5pdCgpO1xyXG59KSJdfQ==
