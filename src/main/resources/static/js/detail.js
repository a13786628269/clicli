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
var getGeo = {
    init: function(){
        function success(position) {
            var latitude = position.coords.latitude.toFixed(6);
            var longitude = position.coords.longitude.toFixed(6);
            document.cookie = 'cyc_loc=' + longitude +'|'+ latitude 
        };
        function error(err) {
            //获取不到时后台拿ip判断      
        };

        navigator.geolocation.getCurrentPosition(success, error);
    }
}
module.exports = getGeo;
},{}],3:[function(require,module,exports){
var itemSize = {
	container:null,
	min:null,
	add:null,
	ipt:null,
	minNum:0,
	maxNum:0,
	val:0,
	init:function(containerId){
		this.container = $(containerId);
		this.min = this.container.find('.cyc_size_min');
		this.add = this.container.find('.cyc_size_add');
		this.ipt = this.container.find('.cyc_size_ipt');
		this.val = this.minNum = this.ipt.val();
		this.min.addClass('cyc_choose_limit');
		this.unbind();
		this.bind();
		this.initstatus();
	},
	bind:function(){
		var that = this;
		$('.cyc_size_min').on('click',function(){
			if($(this).hasClass('cyc_choose_limit'))return;
			that.val--;
			if(that.val <= that.minNum ){
				that.min.addClass('cyc_choose_limit');
			}else{
				that.add.removeClass('cyc_choose_limit');
				that.min.removeClass('cyc_choose_limit');
			}
			that.ipt.val(that.val);
		});
		$('.cyc_size_add').on('click',function(){
			if($(this).hasClass('cyc_choose_limit'))return;
			that.val++;
			that.ipt.val(that.val);
			if(that.val > that.maxNum){
				that.add.addClass('cyc_choose_limit');
			}else if(that.val >= that.minNum){
				that.add.removeClass('cyc_choose_limit');
				that.min.removeClass('cyc_choose_limit');
			}
		})
	},
	unbind:function(){
		$('.cyc_size_add').off('click');
		$('.cyc_size_min').off('click');
	},
	initstatus:function(){
		var val = this.ipt.val();
		if(val <= this.minNum){
			this.min.addClass('cyc_choose_limit');
		}else{
			this.min.removeClass('cyc_choose_limit');
		}
		if(val >= this.maxNum){
			this.add.addClass('cyc_choose_limit');
		}else{
			this.add.removeClass('cyc_choose_limit');
		}
	}
}
module.exports = itemSize;
},{}],4:[function(require,module,exports){
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
            this.initVaptcha();
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
                sms_verify = $('#c_reg_sms_code'),
                pwd = $('#c_reg_psw'),
                repwd =$('#c_reg_confirm_psw'),
                data = {
                    phone: phone.val(),
                    sms_verify: sms_verify.val(),
                    cycang_pwd: pwd.val(),
                    cycang_repwd: repwd.val()
                };

            if(that.NotBlank(['#c_reg_name', '#c_reg_sms_code', '#c_reg_psw', '#c_reg_confirm_psw'])) {
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
		});
		$('.c_question').mouseover(function(){
			$('.c_pt_tips_all').addClass('show');
		})
		$('.c_question').mouseout(function(){
			$('.c_pt_tips_all').removeClass('show');
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
    // 初始化人机验证
	initVaptcha:function(){
        vaptcha({
            //配置参数
            vid:'5bab4faafc650e9658383491' , // 验证单元id
            type: 'click',
            container: '#vaptchaContainer'
        }).then(function (vaptchaObj) {
            vaptchaObj.listen('pass', function() {
                // 验证成功
                $('#vaptchaToken').val(vaptchaObj.getToken());
              })
            vaptchaObj.render()// 调用验证实例 vaptchaObj 的 render 方法加载验证按钮
        })
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
                           // var imgVerify = $('#c_reg_img_verify').val();
                        var vaptchaToken= $('#vaptchaToken').val();
	                    if (!val) {
	                        alert('手机号码不能为空');
	                        return
	                    }else if (!vaptchaToken) {
	                        alert('单击进行人机验证');
	                        return
	                    }
	                    $.ajax({
	                        url: link,
	                        type: 'POST',
	                        dataType: 'json',  
	                        data: {
	                            phone: val,
	                            token: vaptchaToken
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
},{}],5:[function(require,module,exports){
var selectCity = {
    UI:{
        triggerBtn: $('.c_address_sel_trigger'),
        selectValue: $('.c_address_selected_value'),
        selectPanel: $('.c_addr_bd'),
        cityList : $('.c_city_item'),
        provinceTab: $('.c_sel_province'),
        cityTab: $('.c_sel_city'),
        provincePanel: $('.c_addr_sel_bd_province'),
        cityPanel: $('.c_addr_sel_bd_city'),
        province : $('.c_addr_sel_bd_province span'),
        city : $('.c_addr_sel_bd_city span'),
        selectTab: $('.c_addr_sel_hd'),
        selectBd : $('.c_addr_sel_bd')
    },
    init: function(){
        this.cusEvent(); 
        this.changeItemWidth();
        this.postMarginSet();
        this.addrTriggerBtnAdjust();
    },
    cusEvent: function(){
        var that = this;

        $(that.UI.selectPanel).on('click', function(e){
            // e.stopPropagation();
        });
        $(that.UI.triggerBtn).on('click', function(e){
            e.stopPropagation();
            $(this).toggleClass('on');
            $(that.UI.selectPanel).toggleClass('on');
        });
        $(that.UI.selectTab).on('click', function(e) {
            e.stopPropagation();
            $(this).addClass('on').siblings().removeClass('on');
            var i = $(this).index();
            $($(that.UI.selectBd)[i]).addClass('on').siblings().removeClass('on');
        });
        $(that.UI.province).on('click', function() {
            var provinceId = $($(this)[0]).data('province-id');
            $(that.UI.provinceTab).text($(this).text());
            $.ajax({
                url: 'index.php?c=address&a=getCityList&parent_id='+ provinceId,
                type: 'GET',
                dataType: 'json',
                data: '',
                success: function(rtnData){
                    $(that.UI.cityTab).text('请选择市');
                    var result = rtnData.result;
                    var html = '';
                    for(var i=0; i<result.length; i++){
                        html += '<span data-city-id=' + result[i].id + ' data-city-code='+ result[i].city_code +'>' + result[i].name +'</span>';
                    }
                    $(that.UI.cityPanel).html(html);
                    that.changeItemWidth();
                    that.switchSelList(provinceId);
                }
            });
        });
    },
    switchSelList: function(id){
        var that = this;
        $(that.UI.provincePanel).removeClass('on');
        $(that.UI.provinceTab).removeClass('on');
        $(that.UI.cityTab).addClass('on');
        $(that.UI.cityPanel).addClass('on');
    },
    changeItemWidth: function(){
        var that = this,
            w = 0,
            items = $('.c_addr_sel_bd_city span');
        for(var i=0; i<items.length; i++){
            w = $(items[i]).width() > w ? $(items[i]).width() : w;
        }
        items.width(w);
    },
    postMarginSet: function(){
        var that = this;
        if ( $('.c_addr_postage_wrap')) {
            $('.c_addr_postage_wrap').css('marginLeft', $(that.UI.selectValue).width())
        }
    },
    addrTriggerBtnAdjust: function(){
        var that = this,
            btn = $(that.UI.triggerBtn),
            w = btn.width()+ 13;
        $('.c_address_wrap').css('paddingRight', w);
    }
}

module.exports = selectCity;
/* 
    1.点击 触发按钮，显示选择窗口，内容是省级地址列表
    2.点击省级地址， 显示该省级对应的市级地址列表
    3.点击市级地址，收起选择窗口，并将选择的省市设为触发按钮的值
    **
    a.鼠标点击了触发按钮或选择了省以后，鼠标移出窗口后，窗口不关闭，仅在点击document或者点击触发按钮时关闭；
    b.鼠标没有点击触发按钮，mouseenter/mouseleave事件时窗口关闭。
 */
},{}],6:[function(require,module,exports){
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();
},{}],7:[function(require,module,exports){
var itemSize = require('../plugins/itemsize');
var login = require('../plugins/login');
var fakeA = require('../plugins/FakeA');
var template = require('../plugins/template');
var selectCity = require('../plugins/selectCity');
var getGeo = require('../plugins/get_geo_location');

var detail = {
    UI:{
        styleItem:'.cyc_style_item',
        addMin:'#cyc_add_min',
        sizeIpt:'#c_num_ipt',   
        priceNum:'#c_price_num',
        saleOut:'.c_sale_out',
        priceWrap: '.cyc_price_wrap',
        priceBlock: '.c_price_block',
        priceBenefit: '.c_price_benefit',
        addCart:'#c_add_to_cart',
        typeItem:'.cyc_type_item',
        headerLogin:'#cyc_header_login',
        headerReg:'#cyc_header_reg',
        logRegWrap:'#c_log_reg',
        headCart:'.cyc_cart',
        headCartNums:'.cyc_cart_nums',
        timeDown:'.cyc_timedown',
        timeArea:'.cyc_time_area',
        beginOEnd:'.cyc_skill_begin_or_end',
        qrWrap:'.cyc_qr_wrap',
        qrImg:'.cyc_big_qr_img',
        recoMarquee:'#J_reco_list',
        recoItem:'.cyc_reco_item',
        recoMarqueeLeft:'#J_reco_list_left',
        recoMarqueeRight:'#J_reco_list_right',
        recoWrap:'.cyc_reco_wrap',
        hoverItem:'.cyc_hover_item',
        favProduct:'#J_fav',
        dialogCls:'.c_comm_dialog_close',
        gotoTop:'.c_fix_top',
        tipsDtl:'.cyc_tips_item',
        preDeadline: '.c_pre_deadline',
        finalDeadline: '.c_final_deadline',
        deliverTip: '.c_deliver_tip',
        prePrice: '.c_pre_price',
        finalPrice: '.c_final_price',
        prePercent: '.c_pre_percent',
        finalPercent: '.c_final_percent',
        preSaleHd:'.c_advance_sell_hd',
        preStepIcon: '.c_icon_num',
        preBar: '.c_advance_bar',
        largePicA: '.sp-large a',
        couponWrap: '.c_coupon_wrap',
        couponBox: '.c_coupon_box',
        couponCls: '.c_coupon_box_cls',
        getCoupon: '.c_coupon_get',
        stockNum: '.c_stock_num',
        originPrice: '.c_origin_price',
        discountIcon: '.c_discount_icon',
        discountStart: '.c_discount_start',
        discountEnd: '.c_discount_end',
        advanceRuleBtn: '.c_advance_sell_rule_btn',
        advanceRuleCtt: '.c_advance_rule_ctt',
        sellNum: '.c_sell_num',
        moneySaved: '.c_money_saved',
        vipIcon: '.c_vip_icon',
        promotionBar: '.c_promotion',
        canRefundTips: '.c_no_back',
        buyNow:'.c_buy_now',
        oneDelivery:'.c_one_delivery',
        // addrSelTrigger: '.c_address_sel_trigger',
        // addrSelPanel: '.c_addr_bd',
        // addrSelTab: '.c_addr_sel_hd',
        // addrSelCtt: '.c_addr_sel_bd' 
        redemList:'#cyc_detail_scrollbar',
    },
    tmpl:{
        redemViewTmpl: 'c_redem_shop_layer'
    },
    renderRedemView: function(data){
        var html = template(this.tmpl.redemViewTmpl, data);
        $(this.UI.redemList).append(html);
    },
    status:{
        hover:'cyc_hover'
    },
    data:{
        pid:$('#product_id').val(),
        isPresent: $('#isPresent').val()
    },
    Url:{
        couponUrl: $('#coupon_url').val()
    },
    init:function(){
        this.bindCusEvent();
        this.initPlugin();
        this.adjustUI();
        this.setAddrText();

        if (document.cookie.indexOf('PHPSESSID') != -1){
            this.recordProductId();
        }
    },
    initPlugin:function(){
        var that = this;
        fakeA.init();
        selectCity.init();
        getGeo.init();

        var activeSkus = $(that.UI.styleItem).not(that.UI.saleOut);
        if ( activeSkus.length > 0 ) {
            $(activeSkus[0]).trigger('click');
        }else{
            $(that.UI.priceNum).html("卖光啦！(​⊙​o​⊙​)");
            $(that.UI.priceBenefit).hide();
        }

        // marquee
        $(this.UI.recoMarquee).kxbdSuperMarquee({
            distance:$(that.UI.recoItem).outerWidth(true),
            time:3,
            btnGo:{left:that.UI.recoMarqueeLeft,right:that.UI.recoMarqueeRight},
            direction:'left'
        });
        $(this.UI.timeDown).each(function () {
            var $self = $(this),
                $timeArea = $self.find(that.UI.timeArea),
                _time = $timeArea.data('time'),
                _is_begin = $timeArea.data('is-begin'),
                jqBeginOrEnd = $self.siblings(that.UI.beginOEnd),
                jqTitle = $self.closest(that.UI.todayInfo).find(that.UI.todayInfoTitle);

            if (_is_begin == 0) { 
              jqBeginOrEnd.html('开始'); 
            };

            $timeArea.timeCountDown({
                time: _time * 1000,
                //type: 'ms',
                callback: function (result) {
                    var day = this.fillZero(result.d).split(''),
                        hour = this.fillZero(result.h).split(''),
                        minute = this.fillZero(result.m).split(''),
                        second = this.fillZero(result.s).split(''),
                        ms = result.ms,
                        last_time = result.last_times;

                    if ( last_time == 0) {
                   
                      if (_is_begin == 0) {
                        jqBeginOrEnd.html('结束'); 
                        _start_time = $timeArea.data('product-start-time');
                        _end_time = $timeArea.data('product-end-time');
                        _is_begin = 1 ;
                        this.times = (_end_time - _start_time)*1000;
                      }else{
                        jqTitle.html('<font color="gray">秒杀已结束</font>');
                        this.callback = null;
                      }
                    }
                    $timeArea.find('.day_1').text(day[0]);
                    $timeArea.find('.day_2').text(day[1]);
                    
                    $timeArea.find('.hour_1').text(hour[0]);
                    $timeArea.find('.hour_2').text(hour[1]);
                    
                    $timeArea.find('.minute_1').text(minute[0]);
                    $timeArea.find('.minute_2').text(minute[1]);
                    
                    $timeArea.find('.second_1').text(second[0]);
                    $timeArea.find('.second_2').text(second[1]);
                    
                    $timeArea.find('.ms_1').text(ms);
                }
            });
        });

        $(window).load( function() {
            $('.sp-wrap').smoothproducts();
        });

        var isShowsellNum = $('.cyc_style_item.active').data('is-show-sellnum');
        if(isShowsellNum == 1){
            $('.c_sell_num_wrap').show();
        }else{
            $('.c_sell_num_wrap').hide();
        }
    },
    bindCusEvent:function(){
        var that = this;
        $('body').on('click',that.UI.styleItem,function selectStyleHandler(){ //命名 用来解绑！！
            that.selectStyleHandler = selectStyleHandler;
            var sku = $(this),
                leavings = sku.data('stock-nums');
            if (leavings > 0){
                that.selectSizeItem(sku);
            }
        }).on('click',that.UI.addCart,function(){
           if ($(this).hasClass('off')){
                if ( $(this).data('is-pre') == 1){
                    layer.open({
                        content: '预售已结束，请收藏等待再次开放销售'
                    });   
                }else{
                    var secStatus = $(this).data('sec-status');
                    switch (secStatus) {
                        case 'notbegin' :
                            layer.open({content: '闪购未开始'});
                            break;
                        case 'finished' :
                            layer.open({content: '闪购已结束'});
                            break;
                    }
                }
            }else{
                that.addToCart();
            }
        }).on('click',that.UI.headerReg,function(){
            login.init({
                'headerReg':that.UI.headerReg,
                'headerLogin':that.UI.headerLogin,
                'logRegWrap':that.UI.logRegWrap
                ,type:'reg'
            },that.successCb);
        }).on('mouseover',that.UI.qrWrap,function(){
            $(that.UI.qrImg).show();
        }).on('mouseout',that.UI.qrWrap,function(){
            $(that.UI.qrImg).hide();
        }).on('mouseover',this.UI.recoWrap,function(){
            $(this).find('.cyc_list_left').show();
            $(this).find('.cyc_list_right').show();
        }).on('mouseout',this.UI.recoWrap,function(){
            $(this).find('.cyc_list_left').hide();
            $(this).find('.cyc_list_right').hide();
        }).on('mouseover',this.UI.hoverItem,function(){
            $(this).addClass(that.status.hover);
        }).on('mouseout',this.UI.hoverItem,function(){
            $(this).removeClass(that.status.hover);
        }).on('click',this.UI.favProduct,function(){
            var pid = $(this).data('pid');
            var fav = $(this).data('fav');
            that.favProduct(pid,fav);
        }).on('click',this.UI.dialogCls,function(){
            $('#c_comm_dialog_mask').hide();
            $('.c_comm_dialog').hide();
        }).on('mouseover',that.UI.tipsDtl,function(){
            $(this).addClass(that.status.hover);
        }).on('mouseout',that.UI.tipsDtl,function(){
            $(this).removeClass(that.status.hover);
        }).on('click', that.UI.largePicA, function(e){
            e.preventDefault();
        }).on('click', that.UI.couponWrap, function(e){
            e.stopPropagation();
            $(that.UI.couponBox).toggleClass('on');
        }).on('click', that.UI.couponCls, function(){
            $(that.UI.couponBox).removeClass('on');
        }).on('click', document, function(){
            $(that.UI.couponBox).removeClass('on');
        }).on('click', that.UI.getCoupon, function(){
            if($(this).hasClass('on')){
                var couponId = $(this).parent().data('coupon-act-id');
                that.getCoupon(couponId);
            };
        }).on('mouseenter', that.UI.advanceRuleBtn, function(){
            $(that.UI.advanceRuleCtt).addClass('on');
        }).on('mouseleave', that.UI.advanceRuleBtn, function(){
            $(that.UI.advanceRuleCtt).removeClass('on');
        }).on('click',that.UI.buyNow,function(){
            that.buyNow();
        }).on('mouseover',that.UI.oneDelivery,function(){
            $('.c_one_delivery_tips').show();
        }).on('mouseleave',that.UI.oneDelivery,function(){
            $('.c_one_delivery_tips').hide();
        }).on('click', '.c_addr_sel_bd_city span', function(){
            var city = $(this),
                cityName = city.text(),
                cityCode = city.data('city-code'),
                provinceId = city.data('city-id').toString().substr(0,2) + '0000',
                provName = $('[data-province-id='+ provinceId + ']').text();

            var expireTime = Math.round(new Date().getTime()/1000000) + 2592000;
            document.cookie = 'cyc_city_code=' + city.data('city-code') + ';domain=.cycang.com;max-age='+ expireTime+ ';path=/';
            document.cookie = 'cyc_province_name=' + provName + ';domain=.cycang.com;max-age='+ expireTime+ ';path=/';
            document.cookie = 'cyc_city_name=' + city.text() + ';domain=.cycang.com;max-age='+ expireTime+ ';path=/';
            that.cityChoosed(cityName, cityCode, provName);
        }).on('click', '.c_redemption_goods', function(){
            that.redemGoodsList();
            $('.cyc_redemption_layer').show();            
		}).on('click', '.cyc_redemption_close', function(){
			$('.cyc_redemption_layer').hide();
		});

        $(window).scroll(function(){
            var winHeight = $(window).height();
            var jqGotoTop = $(that.UI.gotoTop);
            $(window).scrollTop() > winHeight ? jqGotoTop.fadeIn(1000):jqGotoTop.fadeOut(1000);
        })
    },
    selectSizeItem:function(sku){
        var that = this,
            minBuy = sku.data('min-nums'),
            limitedBuy = sku.data('limit-nums'),
            saleType = sku.data('sale-type'),
            isSeckill = sku.data('is-seckill')
            ;
        sku.addClass('active').siblings().removeClass('active');//mark choosed
        $(that.UI.sizeIpt).val(minBuy);
        itemSize.init(that.UI.addMin);
        itemSize.maxNum = limitedBuy;
        itemSize.initstatus();

        that.skuPriceHandle(sku); //价格等
        that.skuCheckStockNum(sku); //库存
        that.skuCheckSellNum(sku); //已售数量
        that.skuCheckHasSkuImg(sku);//sku图片
        that.skuCheckIsPresent(sku); //判断是否赠品
        that.skuCheckIsVip(sku); //vip客户价格和折扣图标
        that.skuCheckCanRefund(sku); //是否能够退款

        if (saleType == 3 || saleType == 4) that.skuReserveHandle(sku); //预售     
        if (isSeckill == 1) that.skuSeckill(sku); //闪购
    },
    skuPriceHandle: function(sku){
        var that = this,
            price = Number(sku.data('price')),
            originPrice =  Number(sku.data('origin-price'));

        $(that.UI.priceNum).text(price.toFixed(2));
        $(that.UI.originPrice).text(originPrice.toFixed(2));
        if ( price <= originPrice ) {
            $(that.UI.originPrice).show();
        }else{
            $(that.UI.originPrice).hide();
        }
    },
    skuCheckStockNum: function(sku){
        var that = this,
            stockNums = sku.data('stock-nums'),
            isShowStock = sku.data('is-show-stock-nums')
        if ( stockNums > 0 ){
            $(that.UI.priceWrap).removeClass('c_sale_out');
            if( isShowStock == 1 ){
                $(that.UI.stockNum).show().text('（剩余库存'+ stockNums + '件）');
            }else if( isShowStock == 0 ){
                $(that.UI.stockNum).hide();
            }
        }else{
            $(that.UI.priceWrap).addClass('c_sale_out');
            sku.addClass('off');
        }
    },
    skuSeckill: function(sku){
        var that = this,
            isSecFinish = sku.data('is-sec-finish'),
            price = Number(sku.data('price')),
            originPrice =  Number(sku.data('origin-price'))
           ;
        if ( isSecFinish == 1) {
            sku.addClass('off');
        }
        $(that.UI.moneySaved).text((originPrice - price).toFixed(2));

        if ( price <= originPrice ) {
            $(that.UI.priceBenefit).show();
        }else{
            $(that.UI.priceBenefit).hide();
        }
    },
    skuReserveHandle: function(sku){
        var that = this,
            prePrice = sku.data('pre-pay-price'),
            finalPrice = sku.data('final-payment'),
            saleLastday = sku.data('pre-sale-last-day'),
            preDeadline = sku.data('pre-pay-end-time'),
            finalDeadline = sku.data('final-pay-end-time'),
            isDynamicPre = sku.data('is-dynamic-pre'),
            dynamicFinalDays = sku.data('dynamic-final-days'),
            dynamicDeliver = sku.data('dynamic-deliver'),
            deliverTime = sku.data('delivery-time');
        $(that.UI.prePrice).text('￥' + prePrice);
        $(that.UI.finalPrice).text('￥' + finalPrice);

        if( saleLastday > 0 ){
            $(that.UI.preSaleHd).html('火热预售中  <span class="c_advance_days">' + preDeadline + '</span> 结束预售');
            }else{
                $(that.UI.preSaleHd).text('预售已结束，请收藏等待再次开放销售');
        }
        if( isDynamicPre == 1 ) {//动态预售
            $(that.UI.finalDeadline).html('最迟付定金'+ dynamicFinalDays +'天内<br>支付尾款');
            $(that.UI.deliverTip).html('付尾款后'+ dynamicDeliver + '天内<br>按订单顺序发货');
        }else{
            $(that.UI.finalDeadline).html('最迟'+finalDeadline +'前支付尾款');
            $(that.UI.deliverTip).html(deliverTime + '后按照订单顺序发货');
        }
    },
    skuCheckSellNum: function(sku){
        var that = this,
            sellNums = sku.data('sell-num'),
            isShowsellNum = $('.cyc_style_item.active').data('is-show-sellnum');
        $(that.UI.sellNum).text(sellNums);
        if(isShowsellNum == 1){
            $('.c_sell_num_wrap').show();
        }else{
            $('.c_sell_num_wrap').hide();
        }
    },
    skuCheckHasSkuImg: function(sku){
        var that = this,
            skuUrl = sku.data('sku-figure');
        if (skuUrl) {
            that.showSkuImg(skuUrl);
        }else{
            var originFigure = $(that.UI.largePicA).find('img');
            $(that.UI.largePicA).attr('href',originFigure.data('origin-figure'));
            originFigure.attr('src',originFigure.data('origin-figure'));
        }
    },
    skuCheckIsPresent: function(sku){
        var that = this,
            price = sku.data('price');
        if(that.data.isPresent == 1){
            $(that.UI.priceNum).html('非卖品');
            $(that.UI.styleItem).removeClass('active').addClass('off');
            //解绑事件，禁止点击
            $('body').unbind('click', that.selectStyleHandler);
        }else{
            $(that.UI.priceNum).html('&yen;'+price);
        }
    },
    skuCheckIsVip: function(sku){
        var that = this,
            discount = sku.data('discount'),
            isVip = sku.data('is-vip');
        if (isVip == 1) {
            $(that.UI.vipIcon).addClass('on');
            $(that.UI.discountIcon).removeClass('on');
            $(that.UI.promotionBar).hide();
        }else{
            $(that.UI.vipIcon).removeClass('on');
            $(that.UI.promotionBar).show();
            if (discount != 10 ) {
                $(that.UI.discountIcon).addClass('on');
            }
        }
    },
    skuCheckCanRefund: function(sku){
        var that = this,
            skuCanRefund = sku.data('sku-can-refund');
        if(skuCanRefund == 0)
            $(that.UI.canRefundTips).show();
        else
            $(that.UI.canRefundTips).hide();
    },
    addToCart:function(){
        var that = detail;
        var skuId = $(that.UI.styleItem+'.active').data('sku-id');
        var num = $(that.UI.sizeIpt).val();
        if(!skuId) {
            layer.open({content:'请选择款式'});
            return;
        }
        $.ajax({
            url: 'buy.php?c=cart&a=add',
            type: 'POST',
            dataType: 'json',  
            data: {
                product_id: that.data.pid, 
                sku_id: skuId, 
                nums: num
            }
        }).done(function(data){
            if(data.code == 2002){
                login.init({
                    'headerReg':that.UI.headerReg,
                    'headerLogin':that.UI.headerLogin,
                    'logRegWrap':that.UI.logRegWrap,
                    type:'login'
                },that.successCb);
            }
            else if(data.code == 200) {
                that.picFly();
            }else{
                layer.open({content:data.result});
            }
        })
    },
    buyNow:function(){
        var that = detail;
        var skuId = $(that.UI.styleItem+'.active').data('sku-id');
        var num = $(that.UI.sizeIpt).val();
        if(!skuId) {
            layer.open({content:'请选择款式'});
            return;
        }
        $("#c_buy_now_nums").val(num);
        $("#c_buy_now_id").val(that.data.pid);
        $("#c_buy_now_sku_id").val(skuId);
        $('#c_buy_now_form').submit();
    },
    picFly:function(){
        var that = detail;
        var startTop = $(that.UI.addCart).offset().top,
            startLeft = $(that.UI.addCart).offset().left,
            endTop = $(that.UI.headCart).offset().top,
            endLeft = $(that.UI.headCart).offset().left;
            $('<img id="cyc_fly_icon" src='+$('#flyIconUrl').val()+'>', {'class': 'picfly'})
            .css({ top: startTop,left: startLeft ,position:'absolute'})
            .appendTo('body')
            .animate(
                { top: endTop, left: endLeft, opacity: '0.9'},
                700, 
                'swing', 
                function(){
                    $(this).remove();
                }
            )
        $.ajax({
            url: 'buy.php?c=cart&a=getSkuCounts',
            dataType: 'json'
        }).done(function(data) {
            $(that.UI.headCartNums).show().text(data.result);
        })
    },
    successCb : function(opt){
        $(opt.headerReg).remove();
        $(opt.headerLogin).remove();
        var arr = ['<a href="i.php" class="cyc_tools_item" target="_blank">用户中心</a>','<a href="i.php?c=login&a=logout?c=login&a=logout" class="cyc_tools_item" >退出</a>'];
        $(opt.logRegWrap).append(arr.join(''));
    },
    // 收藏商品
    favProduct:function(pid,fav){
        var that = detail;
        var url = !fav? 'index.php?c=fav&a=addProduct':'index.php?c=fav&a=deleteProduct';
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                product_id: pid
            },
        })
        .done(function(data) {
            if(data.code==200){
                $('#c_comm_dialog_mask').show();
                $('.c_comm_dialog').css({
                    top: window.scrollY+100,
                    left:'45%'
                }).show(); 
                $('#c_comm_dialog_icon').addClass('comm_right_icon');
                $('.cyc_comm_dialog_text').text(data.result);
                var isFav = parseInt(fav)?0:1;
                $(that.UI.favProduct).data('fav',isFav);
                var text = '收藏';
                if(isFav){
                    text = '取消收藏';
                }
                $(that.UI.favProduct).text(text);
            }else if(data.code==3001 || data.code==2002 ){
                login.init({
                    'headerReg':that.UI.headerReg,
                    'headerLogin':that.UI.headerLogin,
                    'logRegWrap':that.UI.logRegWrap,
                    type:'login'
                },that.successCb);
            }else{
                $('#c_comm_dialog_mask').show();
                $('#c_comm_dialog_icon').addClass('comm_warm_icon');
                $('.cyc_comm_dialog_text').text(data.result);
            }
        })
        .fail(function() {
            $('#c_comm_dialog_mask').show();
            $('#c_comm_dialog_icon').addClass('comm_warm_icon');
            $('.cyc_comm_dialog_text').text('啊哦，网络错误，请稍后再试');
        });
    },
    getCoupon: function(couponId){
        var that = this;
        var couponUrl = that.Url.couponUrl;
        $.ajax({
            url: couponUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                coupon_act_id: couponId
            },
        })
        .done(function(rtnData) {
           if( rtnData.code==2002 ){
                login.init({
                    'headerReg':that.UI.headerReg,
                    'headerLogin':that.UI.headerLogin,
                    'logRegWrap':that.UI.logRegWrap,
                    type:'login'
                },that.successCb);
            }else{
                layer.open({
                    content: rtnData.result
                })
            }
        })
        .fail(function() {
            layer.open({
                content: '领取失败，请重新再试'
            })
        })
    },
    showSkuImg: function (skuUrl) {
        var that = this;
        var largePicA = $(that.UI.largePicA);
        var largePic = largePicA.find('img');
        largePicA.attr('href',skuUrl);
        largePic.attr('src', skuUrl);
    },
    recordProductId: function () {
        var that = this;
        var storedPid = store.get('product_id');
        if ( storedPid === undefined) {
            var pids = [];
            pids.push(that.data.pid);
            store.set('product_id', pids);
        }else{
            var equalValue = that.equalCompare(storedPid, that.data.pid);//判断是否记录过了
            if (equalValue == 'equal') {
                if( storedPid.length >= 20 ) {//长度为20的pid队列
                    storedPid.pop();
                }
                var pids = storedPid;
            }else{
                var pids = that.delArrayElement(storedPid, equalValue);
            }
            pids.unshift(that.data.pid);
            store.set('product_id', pids);
        }
    },
    equalCompare: function ( array, pid ) {
        for (var i=0; i<array.length; i++) {
            if (array[i] == pid) {
                return i;
            }
        };
        return 'equal';
    },
    delArrayElement: function (array, i) {
        array = array.slice(0,i).concat(array.slice(i+1));
        return array;
    },
    cityChoosed: function(cityName, cityCode, provName){
        var that = selectCity;
        $(that.UI.cityTab).text(cityName);
        var address = provName + ' ' + cityName;
        $(that.UI.selectValue).text(address);
        that.postMarginSet();
        if( $(that.UI.triggerBtn).css('position') == 'absolute' ) {
            that.addrTriggerBtnAdjust();
        }
        $(that.UI.selectPanel).removeClass('on');
        $(that.UI.triggerBtn).removeClass('on');

        var params = {
            'city_code': cityCode,
            'supplier_code': $('#J_supplier_code').val()
        };
        $.ajax({
            url: 'index.php?c=address&a=getAreaFreight',
            type: 'GET',
            dataType: 'json',
            data: params,
            success: function(rtnData){
                $('.c_addr_postage').text(rtnData.result.freight);
                if( rtnData.result.freight_min != 999999){
                    $('.c_supplier_postage_free').show();
                    $('.c_supplier_postage_free').text(rtnData.result.freight_min);
                }else{
                    $('.c_supplier_postage_free').hide();
                }
                detail.adjustUI();
            }
        })
    },
    setAddrText: function(){
        var that = this;
        var provName = '北京', cityName = '北京市', cityCode = 131;
        if ( document.cookie.match(/cyc_province_name/)){
            provName= document.cookie.match(/cyc_province_name=[^x00-xff]{0,20}/)[0].split('=')[1];
        }
        if ( document.cookie.match(/cyc_city_name/)){
            cityName = document.cookie.match(/cyc_city_name=[^x00-xff]{0,20}/)[0].split('=')[1];
        }
        if ( document.cookie.match(/cyc_city_code/)){
            cityCode = document.cookie.match(/cyc_city_code=[\d]{1,6}/)[0].split('=')[1];
        }
        that.cityChoosed( cityName, cityCode, provName);
    },
    adjustUI: function(){
        //调整地址按钮后邮费提示位置
        var w = $('.c_address_sel_trigger').width() + 18;
        $('.c_addr_postage_wrap').css('marginLeft',w);
        $('.c_address_wrap').css('paddingRight', 0);
    },
    redemGoodsList: function(){
        var supplierCode = $('#J_supplier_code').val();
        $.ajax({
            url: 'index.php?c=page&a=getFullTradeList',
            type: 'GET',
            dataType: 'json',
            data: {
                supplier_code: supplierCode
            },
            success: function(rtnData){                
                if (rtnData.code == 200){
                    $('.cyc_goods_item').remove();
                    detail.renderRedemView(rtnData.result);
                }
            }
        })
    }
}
detail.init();
module.exports = detail;

},{"../plugins/FakeA":1,"../plugins/get_geo_location":2,"../plugins/itemsize":3,"../plugins/login":4,"../plugins/selectCity":5,"../plugins/template":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjeWh1Yi9wYy9QdWJsaWMvc3JjL2pzL3BsdWdpbnMvRmFrZUEuanMiLCJjeWh1Yi9wYy9QdWJsaWMvc3JjL2pzL3BsdWdpbnMvZ2V0X2dlb19sb2NhdGlvbi5qcyIsImN5aHViL3BjL1B1YmxpYy9zcmMvanMvcGx1Z2lucy9pdGVtc2l6ZS5qcyIsImN5aHViL3BjL1B1YmxpYy9zcmMvanMvcGx1Z2lucy9sb2dpbi5qcyIsImN5aHViL3BjL1B1YmxpYy9zcmMvanMvcGx1Z2lucy9zZWxlY3RDaXR5LmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9wbHVnaW5zL3RlbXBsYXRlLmpzIiwiY3lodWIvcGMvUHVibGljL3NyYy9qcy9zaG9wL2RldGFpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiDkvKph5qCH562+4oCm4oCm5rKhaHJlZueahFxyXG4gKiBAdHlwZSB7e2luaXQ6IGluaXR9fVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0OmZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmNfZmFrZV9hJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJ2YXIgZ2V0R2VvID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oKXtcclxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBsYXRpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZS50b0ZpeGVkKDYpO1xyXG4gICAgICAgICAgICB2YXIgbG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZS50b0ZpeGVkKDYpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSAnY3ljX2xvYz0nICsgbG9uZ2l0dWRlICsnfCcrIGxhdGl0dWRlIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZnVuY3Rpb24gZXJyb3IoZXJyKSB7XHJcbiAgICAgICAgICAgIC8v6I635Y+W5LiN5Yiw5pe25ZCO5Y+w5ou/aXDliKTmlq0gICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGdldEdlbzsiLCJ2YXIgaXRlbVNpemUgPSB7XHJcblx0Y29udGFpbmVyOm51bGwsXHJcblx0bWluOm51bGwsXHJcblx0YWRkOm51bGwsXHJcblx0aXB0Om51bGwsXHJcblx0bWluTnVtOjAsXHJcblx0bWF4TnVtOjAsXHJcblx0dmFsOjAsXHJcblx0aW5pdDpmdW5jdGlvbihjb250YWluZXJJZCl7XHJcblx0XHR0aGlzLmNvbnRhaW5lciA9ICQoY29udGFpbmVySWQpO1xyXG5cdFx0dGhpcy5taW4gPSB0aGlzLmNvbnRhaW5lci5maW5kKCcuY3ljX3NpemVfbWluJyk7XHJcblx0XHR0aGlzLmFkZCA9IHRoaXMuY29udGFpbmVyLmZpbmQoJy5jeWNfc2l6ZV9hZGQnKTtcclxuXHRcdHRoaXMuaXB0ID0gdGhpcy5jb250YWluZXIuZmluZCgnLmN5Y19zaXplX2lwdCcpO1xyXG5cdFx0dGhpcy52YWwgPSB0aGlzLm1pbk51bSA9IHRoaXMuaXB0LnZhbCgpO1xyXG5cdFx0dGhpcy5taW4uYWRkQ2xhc3MoJ2N5Y19jaG9vc2VfbGltaXQnKTtcclxuXHRcdHRoaXMudW5iaW5kKCk7XHJcblx0XHR0aGlzLmJpbmQoKTtcclxuXHRcdHRoaXMuaW5pdHN0YXR1cygpO1xyXG5cdH0sXHJcblx0YmluZDpmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0JCgnLmN5Y19zaXplX21pbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJCh0aGlzKS5oYXNDbGFzcygnY3ljX2Nob29zZV9saW1pdCcpKXJldHVybjtcclxuXHRcdFx0dGhhdC52YWwtLTtcclxuXHRcdFx0aWYodGhhdC52YWwgPD0gdGhhdC5taW5OdW0gKXtcclxuXHRcdFx0XHR0aGF0Lm1pbi5hZGRDbGFzcygnY3ljX2Nob29zZV9saW1pdCcpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGF0LmFkZC5yZW1vdmVDbGFzcygnY3ljX2Nob29zZV9saW1pdCcpO1xyXG5cdFx0XHRcdHRoYXQubWluLnJlbW92ZUNsYXNzKCdjeWNfY2hvb3NlX2xpbWl0Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhhdC5pcHQudmFsKHRoYXQudmFsKTtcclxuXHRcdH0pO1xyXG5cdFx0JCgnLmN5Y19zaXplX2FkZCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoJCh0aGlzKS5oYXNDbGFzcygnY3ljX2Nob29zZV9saW1pdCcpKXJldHVybjtcclxuXHRcdFx0dGhhdC52YWwrKztcclxuXHRcdFx0dGhhdC5pcHQudmFsKHRoYXQudmFsKTtcclxuXHRcdFx0aWYodGhhdC52YWwgPiB0aGF0Lm1heE51bSl7XHJcblx0XHRcdFx0dGhhdC5hZGQuYWRkQ2xhc3MoJ2N5Y19jaG9vc2VfbGltaXQnKTtcclxuXHRcdFx0fWVsc2UgaWYodGhhdC52YWwgPj0gdGhhdC5taW5OdW0pe1xyXG5cdFx0XHRcdHRoYXQuYWRkLnJlbW92ZUNsYXNzKCdjeWNfY2hvb3NlX2xpbWl0Jyk7XHJcblx0XHRcdFx0dGhhdC5taW4ucmVtb3ZlQ2xhc3MoJ2N5Y19jaG9vc2VfbGltaXQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdHVuYmluZDpmdW5jdGlvbigpe1xyXG5cdFx0JCgnLmN5Y19zaXplX2FkZCcpLm9mZignY2xpY2snKTtcclxuXHRcdCQoJy5jeWNfc2l6ZV9taW4nKS5vZmYoJ2NsaWNrJyk7XHJcblx0fSxcclxuXHRpbml0c3RhdHVzOmZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgdmFsID0gdGhpcy5pcHQudmFsKCk7XHJcblx0XHRpZih2YWwgPD0gdGhpcy5taW5OdW0pe1xyXG5cdFx0XHR0aGlzLm1pbi5hZGRDbGFzcygnY3ljX2Nob29zZV9saW1pdCcpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoaXMubWluLnJlbW92ZUNsYXNzKCdjeWNfY2hvb3NlX2xpbWl0Jyk7XHJcblx0XHR9XHJcblx0XHRpZih2YWwgPj0gdGhpcy5tYXhOdW0pe1xyXG5cdFx0XHR0aGlzLmFkZC5hZGRDbGFzcygnY3ljX2Nob29zZV9saW1pdCcpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoaXMuYWRkLnJlbW92ZUNsYXNzKCdjeWNfY2hvb3NlX2xpbWl0Jyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gaXRlbVNpemU7IiwidmFyIGxvZ2luID0ge1xyXG5cdGhlaWdodDowLFxyXG5cdHdpZHRoOjAsXHJcblx0dGFiV3JhcDpudWxsLFxyXG5cdHN1Y2Nlc3NDYjpudWxsLFxyXG5cdG1zZ2NvZGU6bnVsbCxcclxuXHRvcHQ6bnVsbCxcclxuXHRpc0luaXQ6ZmFsc2UsXHJcblx0aW5pdDpmdW5jdGlvbihvcHQsY2Ipe1xyXG5cdFx0Ly8gaW5pdCDnmoTml7blgJnliIbkuKTkuKrmraXpqqTjgIIgMeS4quiuoeeul+aRhuaUvuS9jee9riAy5a+5dGFi5Yid5aeL5YyWIDMg5bGV56S65Ye65p2lXHJcblx0XHR2YXIgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHRcdGlmKCF0aGlzLmlzSW5pdCl7XHJcblx0XHRcdHRoaXMuaXNJbml0ID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5vcHQgPSBvcHQ7XHJcblx0XHRcdHRoaXMudGFiV3JhcCA9ICQoJyNjX3RhYl93cmFwJyk7XHJcblx0XHRcdHRoaXMud2lkdGggPSB0aGlzLnRhYldyYXAub3V0ZXJXaWR0aCgpO1xyXG5cdFx0XHR0aGlzLmhlaWdodCA9IHRoaXMudGFiV3JhcC5vdXRlckhlaWdodCgpO1xyXG5cdFx0XHR0aGlzLnRhYldyYXAuY3NzKHtcclxuXHRcdFx0XHRsZWZ0Oih3aW5XaWR0aC10aGlzLmhlaWdodCkvMixcclxuXHRcdFx0XHR0b3A6d2luZG93LnNjcm9sbFkgKyAyMDBcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuc3VjY2Vzc0NiID0gY2I7XHJcblx0ICAgICAgICB0aGlzLmluaXRTdGF0dXMoKTtcclxuXHQgICAgICAgIHRoaXMuaW5pdFBsdWdpbigpO1xyXG5cdCAgICAgICAgdGhpcy5jdXNFdmVudCgpO1xyXG5cdCAgICAgICAgdGhpcy5tc2djb2RlLmluaXQoJCgnI2NfZ2V0X3Ntc19jb2RlJyksJ2kucGhwP2M9bG9naW4mYT1yZWdTbXNWZXJpZnknKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICBcdHRoaXMudGFiV3JhcC5jc3Moe1xyXG5cdFx0XHRcdGxlZnQ6KHdpbldpZHRoLXRoaXMuaGVpZ2h0KS8yLFxyXG5cdFx0XHRcdHRvcDp3aW5kb3cuc2Nyb2xsWSArIDUwXHJcblx0XHRcdH0pO1xyXG4gICAgICAgIFx0JCgnI2NfZGlhX21hc2snKS5zaG93KCk7XHJcblx0XHRcdCQoJyNjX3RhYl93cmFwJykuc2hvdygpO1xyXG5cdFx0fVxyXG4gICAgICAgIG9wdC50eXBlICYmICQoJyN0YWJfJytvcHQudHlwZSsnX3RpdGxlJykudHJpZ2dlcignY2xpY2snKTtcclxuXHJcbiAgICAgICAgLy93ZWNoYXQgbG9naW5cclxuICAgICAgICB0aGlzLndlY2hhdExvZ2luKCk7XHJcbiAgICAgICAgXHJcblx0fSxcclxuXHRjdXNFdmVudDpmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0JCgnYm9keScpLm9uKCdjbGljaycsJy5kaWFfY2xvc2UnLGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNjX2RpYV9tYXNrJykuaGlkZSgpO1xyXG5cdFx0XHQkKCcjY190YWJfd3JhcCcpLmhpZGUoKTtcclxuXHRcdH0pLm9uKCdjbGljaycsJy5pcHRfbGFiZWwnLGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBqcVRoaXMgPSAkKHRoaXMpLnNpYmxpbmdzKCcuaXB0Jyk7XHJcblx0XHRcdGpxVGhpcy5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0anFUaGlzLnNpYmxpbmdzKCdsYWJlbCcpLmhpZGUoKTtcclxuXHRcdFx0anFUaGlzLmZvY3VzKCk7XHJcblx0XHR9KS5vbignZm9jdXMnLCdpbnB1dC5pcHQnLGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBqcVRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0XHRqcVRoaXMucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdGpxVGhpcy5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XHJcblx0XHR9KS5vbignYmx1cicsJ2lucHV0LmlwdCcsZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGpxVGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdGlmKCBqcVRoaXMudmFsKCkgPT0gJycpe1xyXG5cdFx0XHRcdGpxVGhpcy5hZGRDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRqcVRoaXMuc2libGluZ3MoJ2xhYmVsJykuc2hvdygpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRqcVRoaXMucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0anFUaGlzLnNpYmxpbmdzKCdsYWJlbCcpLmhpZGUoKTtcclxuXHRcdFx0fSBcclxuXHRcdH0pLm9uKCdjbGljaycsJyNsb2dfYnRuJyxmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGFyYW1zID0ge307XHJcblx0ICAgICAgICBwYXJhbXMucGhvbmUgPSAkKCcjY191c2VyX25hbWUnKS52YWwoKTtcclxuXHQgICAgICAgIHBhcmFtcy5jYXB0Y2hhID0gJCgnI2NfbG9nX3ZlcmlmeScpLnZhbCgpO1xyXG5cdCAgICAgICAgcGFyYW1zLnBhc3N3b3JkID0gJCgnI2NfdXNlcl9wc3cnKS52YWwoKTtcclxuXHQgICAgICAgIHBhcmFtcy5yZW1lbWJlciA9ICQoJyNyZW1lbWJlcicpLnZhbCgpO1xyXG5cdCAgICAgICAgaWYgKHBhcmFtcy5waG9uZSA9PSAnJykgeyBhbGVydCgn6K+35aGr5YaZ55So5oi35ZCNJyk7IHJldHVybiBmYWxzZTsgfTtcclxuXHQgICAgICAgIGlmIChwYXJhbXMucGFzc3dvcmQgPT0gJycpIHsgYWxlcnQoJ+ivt+Whq+WGmeWvhueggScpOyByZXR1cm4gZmFsc2U7IH07XHJcblx0ICAgICAgICBpZiAocGFyYW1zLmNhcHRjaGEgPT0gJycpIHsgYWxlcnQoJ+ivt+Whq+WGmemqjOivgeeggScpOyByZXR1cm4gZmFsc2U7IH07XHJcblx0ICAgICAgICAkLmFqYXgoeyAgXHJcblx0ICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsICBcclxuXHQgICAgICAgICAgICB1cmw6ICdpLnBocD9jPWxvZ2luJmE9Y2hlY2tMb2dpbiZpc19hamF4PTEnLCAgXHJcblx0ICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLCAgXHJcblx0ICAgICAgICAgICAgZGF0YToge1xyXG5cdCAgICAgICAgICAgICAgICBjeWNhbmdfdXNlcjogcGFyYW1zLnBob25lLFxyXG5cdCAgICAgICAgICAgICAgICBjYXB0Y2hhOiBwYXJhbXMuY2FwdGNoYSxcclxuXHQgICAgICAgICAgICAgICAgY3ljYW5nX3B3ZDogcGFyYW1zLnBhc3N3b3JkLFxyXG5cdCAgICAgICAgICAgICAgICByZW1lbWJlcjogcGFyYW1zLnJlbWVtYmVyXHJcblx0ICAgICAgICAgICAgfSwgIFxyXG5cdCAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJldCl7XHJcblx0ICAgICAgICAgICAgICAgIGlmKHJldC5jb2RlID09IDIwMCl7XHJcblx0ICAgICAgICAgICAgICAgIFx0aWYodGhhdC5zdWNjZXNzQ2Ipe1xyXG5cdCAgICAgICAgICAgICAgICBcdFx0YWxlcnQoJ+eZu+W9leaIkOWKnyzlj6/ku6XkubDkubDkubDllaYoIO+8ns+J77ycKSEhIScpO1xyXG5cdCAgICAgICAgICAgICAgICBcdFx0JCgnLmRpYV9jbG9zZScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcblx0ICAgICAgICAgICAgICAgIFx0XHR0aGF0LnN1Y2Nlc3NDYih0aGF0Lm9wdCk7XHJcblx0ICAgICAgICAgICAgICAgIFx0fWVsc2V7XHJcblx0ICAgICAgICAgICAgICAgIFx0XHQkKCcjY19kaWFfbWFzaycpLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcjY190YWJfd3JhcCcpLmhpZGUoKTtcclxuXHQgICAgICAgICAgICAgICAgXHR9XHRcclxuXHQgICAgICAgICAgICAgICAgfWVsc2V7XHJcblx0ICAgICAgICAgICAgICAgICAgICBhbGVydChyZXQucmVzdWx0KTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH0sXHJcblx0ICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbihyZXQpeyAgICAgIFxyXG5cdCAgICAgICAgICAgICAgICBhbGVydCgn5pyq55+l6ZSZ6K+v77yM6K+36YeN5paw5bCd6K+VJyk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfSk7XHJcblx0XHR9KS5vbignY2xpY2snLCcudmVyaWZ5X2ltZycsZnVuY3Rpb24oKXtcclxuXHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCdpLnBocD9jPWxvZ2luJmE9Y2FwdGNoYScpO1xyXG5cdFx0fSkub24oJ2NsaWNrJywnI3RhYl9yZWdfdGl0bGUnLGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJy5sb2dfZm9ybV93cmFwIC52ZXJpZnlfaW1nJykuYXR0cignc3JjJywnaS5waHA/Yz1sb2dpbiZhPWNhcHRjaGEnKTtcclxuXHRcdH0pLm9uKCdjbGljaycsJyN0YWJfbG9naW5fdGl0bGUnLGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJy5yZWdfZm9ybV93cmFwIC52ZXJpZnlfaW1nJykuYXR0cignc3JjJywnaS5waHA/Yz1sb2dpbiZhPWNhcHRjaGEnKTtcclxuXHRcdH0pLm9uKCdjbGljaycsJyNyZWdfYnRuJyxmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgcGhvbmUgPSAkKCcjY19yZWdfbmFtZScpLFxyXG4gICAgICAgICAgICAgICAgY2FwdGNoYSA9ICQoJyNjX3JlZ19pbWdfdmVyaWZ5JyksXHJcbiAgICAgICAgICAgICAgICBzbXNfdmVyaWZ5ID0gJCgnI2NfcmVnX3Ntc19jb2RlJyksXHJcbiAgICAgICAgICAgICAgICBwd2QgPSAkKCcjY19yZWdfcHN3JyksXHJcbiAgICAgICAgICAgICAgICByZXB3ZCA9JCgnI2NfcmVnX2NvbmZpcm1fcHN3JyksXHJcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZS52YWwoKSxcclxuICAgICAgICAgICAgICAgICAgICBjYXB0Y2hhOiBjYXB0Y2hhLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNtc192ZXJpZnk6IHNtc192ZXJpZnkudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY3ljYW5nX3B3ZDogcHdkLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGN5Y2FuZ19yZXB3ZDogcmVwd2QudmFsKClcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZih0aGF0Lk5vdEJsYW5rKFsnI2NfcmVnX25hbWUnLCAnI2NfcmVnX2ltZ192ZXJpZnknLCAnI2NfcmVnX3Ntc19jb2RlJywgJyNjX3JlZ19wc3cnLCAnI2NfcmVnX2NvbmZpcm1fcHN3J10pKSB7XHJcbiAgICAgICAgICAgICAgICBpZihwd2QudmFsKCkgIT09IHJlcHdkLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+S4pOasoeWvhueggeS4jeebuOWQjCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICQuYWpheCh7ICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIiwgIFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2kucGhwP2M9bG9naW4mYT1yZWdpc3RlcicsICBcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsICBcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmV0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmV0LmNvZGUgPT0gMjAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHRpZih0aGF0LnN1Y2Nlc3NDYil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFx0XHRhbGVydCgn55m75b2V5oiQ5YqfLOWPr+S7peS5sOS5sOS5sOWVpigg77yez4nvvJwpISEhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFx0XHQkKCcuZGlhX2Nsb3NlJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHRcdHRoYXQuc3VjY2Vzc0NiKHRoYXQub3B0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHR9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHRcdCQoJyNjX2RpYV9tYXNrJykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JCgnI2NfdGFiX3dyYXAnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFx0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQocmV0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yIDogZnVuY3Rpb24ocmV0KXsgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+acquefpemUmeivr++8jOivt+mHjeaWsOWwneivlScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Tm90Qmxhbms6ZnVuY3Rpb24oYXJyYXkpe1xyXG5cdFx0IHZhciBsZW4gPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9MDsgaSA8IGxlbjsgaSsrKSB7IFxyXG4gICAgICAgICAgICAgICAgdmFyIGRvbSA9ICQoYXJyYXlbaV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IGRvbS52YWwoKTtcclxuICAgICAgICAgICAgICAgIGlmKHZhbCA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRvbS5kYXRhKCd0ZXh0JykrJ+S4jeiDveS4uuepuicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcblx0fSxcclxuXHRpbml0U3RhdHVzOmZ1bmN0aW9uKCl7XHJcblx0XHQkKCcjY19kaWFfbWFzaycpLnNob3coKTtcclxuXHRcdCQoJyNjX3RhYl93cmFwJykuc2hvdygpO1xyXG4gICAgICAgIHZhciBhVGFiQm9keXMgPSAkKCcjdGFic19ib2R5ID4gZGl2Jyk7XHJcbiAgICAgICAgJCgnI3RhYnMgPiBhJykuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnb24nKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCk7XHJcblx0XHRcdFx0YVRhYkJvZHlzLmhpZGUoKS5lcShpbmRleCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCdpbnB1dC5pcHQnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHR2YXIganFUaGlzID0gJCh0aGlzKTtcclxuICAgICAgICBcdGlmKGpxVGhpcy52YWwoKSAhPSAnJyl7XHJcbiAgICAgICAgXHRcdGpxVGhpcy5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRqcVRoaXMuc2libGluZ3MoJ2xhYmVsJykuaGlkZSgpO1xyXG4gICAgICAgIFx0fWVsc2V7XHJcbiAgICAgICAgXHRcdGpxVGhpcy5hZGRDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRqcVRoaXMuc2libGluZ3MoJ2xhYmVsJykuc2hvdygpO1xyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH0pO1xyXG5cdH0sXHJcblx0aW5pdFBsdWdpbjpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5tc2djb2RlID0ge1xyXG4gICAgICAgICAgICBlbDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB0aXBzOiB1bmRlZmluZWQsXHJcblxyXG4gICAgICAgICAgICBiaW5kOiBmdW5jdGlvbihsaW5rKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIFx0aWYoIXRoYXQuZWwuaGFzQ2xhc3MoJ2J0bi1ncmF5Jykpe1xyXG5cdCAgICAgICAgICAgICAgICAgICBcdHZhciB2YWwgPSAkKCcjY19yZWdfbmFtZScpLnZhbCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICBcdHZhciBpbWdWZXJpZnkgPSAkKCcjY19yZWdfaW1nX3ZlcmlmeScpLnZhbCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWwpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5omL5py65Y+356CB5LiN6IO95Li656m6Jyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcblx0ICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoIWltZ1ZlcmlmeSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflm77lvaLpqozor4HnoIHkuI3og73kuLrnqbonKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBsaW5rLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCAgXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZTogdmFsLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0Y2hhOiBpbWdWZXJpZnlcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIC8v5p2h5Lu2XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jb2RlID09IDIwMCkgeyBcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5yZXN1bHQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmVsLmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2J0bi1ncmF5JykuY3NzKCdjdXJzb3InLCAnbm90LWFsbG93ZWQnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jb3VudERvd24oZnVuY3Rpb24oKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmVsLnZhbCgn6I635Y+W6aqM6K+B56CBJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnYnRuLWdyYXknKS5jc3MoJ2N1cnNvcicsICdwb2ludGVyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJyNlZDNmM2YnKVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChkYXRhLnJlc3VsdCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIFx0fVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKGVsLGxpbmspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwgPSBlbDtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMudGlwcyA9IHRpcHNcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZChsaW5rKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY291bnREb3duOiBmdW5jdGlvbihjYikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50ID0gNjA7XHJcblxyXG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uIGZjb3VudCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb3VudCA8IDApIHJldHVybiBjYigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvdW50ID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIFx0Y291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICBcdHRoYXQuZWwudGV4dCgn6YeN5paw6I635Y+WJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGF0LmVsLnRleHQoJ+mHjeaWsOiOt+WPlignKyBjb3VudC0tICsgJyknKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmVsLmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5lbC5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnI0NDQycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZmNvdW50LCAxMDAwKVxyXG4gICAgICAgICAgICAgICAgfSkoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHR9LFxyXG4gICAgd2VjaGF0TG9naW46IGZ1bmN0aW9uKCl7XHJcbiAgICBcdCQoJy5pY29uX3dlY2hhdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICBcdFx0dmFyIG9iaiA9IG5ldyBXeExvZ2luKHtcclxuXHRcdFx0XHRpZDogXCJ3ZWNoYXRfbG9naW5fY29udGFpbmVyXCIsXHJcblx0XHRcdFx0YXBwaWQ6IFwid3hjNDc1YTNmMWU1NWY1NDJhXCIsXHJcblx0XHRcdFx0c2NvcGU6IFwic25zYXBpX2xvZ2luXCIsXHJcblx0XHRcdFx0cmVkaXJlY3RfdXJpOiBcImh0dHBzOi8vY3ljYW5nLmNvbS93ZWNoYXRfbG9naW5fY2FsbGJhY2sucGhwXCIsXHJcblx0XHRcdFx0c3RhdGU6IFwiXCIsXHJcblx0XHRcdFx0c3R5bGU6IFwiXCIsXHJcblx0XHRcdFx0aHJlZjogXCJcIlxyXG5cdFx0XHR9KTtcclxuICAgIFx0XHQkKCcudGFic19jb250ZW50JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgIFx0XHQkKCcuY193ZWNoYXRfbG9naW5fYm94JykuZmFkZUluKCk7XHJcbiAgICBcdH0pO1x0XHJcbiAgICBcdCQoJy5jX3dlY2hhdF9iYWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnLmNfd2VjaGF0X2xvZ2luX2JveCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcblx0XHRcdCQoJy50YWJzX2NvbnRlbnQnKS5mYWRlSW4oKTtcclxuXHRcdH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2dpbjsiLCJ2YXIgc2VsZWN0Q2l0eSA9IHtcclxuICAgIFVJOntcclxuICAgICAgICB0cmlnZ2VyQnRuOiAkKCcuY19hZGRyZXNzX3NlbF90cmlnZ2VyJyksXHJcbiAgICAgICAgc2VsZWN0VmFsdWU6ICQoJy5jX2FkZHJlc3Nfc2VsZWN0ZWRfdmFsdWUnKSxcclxuICAgICAgICBzZWxlY3RQYW5lbDogJCgnLmNfYWRkcl9iZCcpLFxyXG4gICAgICAgIGNpdHlMaXN0IDogJCgnLmNfY2l0eV9pdGVtJyksXHJcbiAgICAgICAgcHJvdmluY2VUYWI6ICQoJy5jX3NlbF9wcm92aW5jZScpLFxyXG4gICAgICAgIGNpdHlUYWI6ICQoJy5jX3NlbF9jaXR5JyksXHJcbiAgICAgICAgcHJvdmluY2VQYW5lbDogJCgnLmNfYWRkcl9zZWxfYmRfcHJvdmluY2UnKSxcclxuICAgICAgICBjaXR5UGFuZWw6ICQoJy5jX2FkZHJfc2VsX2JkX2NpdHknKSxcclxuICAgICAgICBwcm92aW5jZSA6ICQoJy5jX2FkZHJfc2VsX2JkX3Byb3ZpbmNlIHNwYW4nKSxcclxuICAgICAgICBjaXR5IDogJCgnLmNfYWRkcl9zZWxfYmRfY2l0eSBzcGFuJyksXHJcbiAgICAgICAgc2VsZWN0VGFiOiAkKCcuY19hZGRyX3NlbF9oZCcpLFxyXG4gICAgICAgIHNlbGVjdEJkIDogJCgnLmNfYWRkcl9zZWxfYmQnKVxyXG4gICAgfSxcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5jdXNFdmVudCgpOyBcclxuICAgICAgICB0aGlzLmNoYW5nZUl0ZW1XaWR0aCgpO1xyXG4gICAgICAgIHRoaXMucG9zdE1hcmdpblNldCgpO1xyXG4gICAgICAgIHRoaXMuYWRkclRyaWdnZXJCdG5BZGp1c3QoKTtcclxuICAgIH0sXHJcbiAgICBjdXNFdmVudDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgICQodGhhdC5VSS5zZWxlY3RQYW5lbCkub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGF0LlVJLnRyaWdnZXJCdG4pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvbicpO1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkuc2VsZWN0UGFuZWwpLnRvZ2dsZUNsYXNzKCdvbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhhdC5VSS5zZWxlY3RUYWIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb24nKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgICAgICB2YXIgaSA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgICAgICAgICAgJCgkKHRoYXQuVUkuc2VsZWN0QmQpW2ldKS5hZGRDbGFzcygnb24nKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhhdC5VSS5wcm92aW5jZSkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aW5jZUlkID0gJCgkKHRoaXMpWzBdKS5kYXRhKCdwcm92aW5jZS1pZCcpO1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkucHJvdmluY2VUYWIpLnRleHQoJCh0aGlzKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnaW5kZXgucGhwP2M9YWRkcmVzcyZhPWdldENpdHlMaXN0JnBhcmVudF9pZD0nKyBwcm92aW5jZUlkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogJycsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihydG5EYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoYXQuVUkuY2l0eVRhYikudGV4dCgn6K+36YCJ5oup5biCJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJ0bkRhdGEucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8cmVzdWx0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPHNwYW4gZGF0YS1jaXR5LWlkPScgKyByZXN1bHRbaV0uaWQgKyAnIGRhdGEtY2l0eS1jb2RlPScrIHJlc3VsdFtpXS5jaXR5X2NvZGUgKyc+JyArIHJlc3VsdFtpXS5uYW1lICsnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQodGhhdC5VSS5jaXR5UGFuZWwpLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jaGFuZ2VJdGVtV2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnN3aXRjaFNlbExpc3QocHJvdmluY2VJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHN3aXRjaFNlbExpc3Q6IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGF0LlVJLnByb3ZpbmNlUGFuZWwpLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgICQodGhhdC5VSS5wcm92aW5jZVRhYikucmVtb3ZlQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgJCh0aGF0LlVJLmNpdHlUYWIpLmFkZENsYXNzKCdvbicpO1xyXG4gICAgICAgICQodGhhdC5VSS5jaXR5UGFuZWwpLmFkZENsYXNzKCdvbicpO1xyXG4gICAgfSxcclxuICAgIGNoYW5nZUl0ZW1XaWR0aDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIHcgPSAwLFxyXG4gICAgICAgICAgICBpdGVtcyA9ICQoJy5jX2FkZHJfc2VsX2JkX2NpdHkgc3BhbicpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGl0ZW1zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdyA9ICQoaXRlbXNbaV0pLndpZHRoKCkgPiB3ID8gJChpdGVtc1tpXSkud2lkdGgoKSA6IHc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW1zLndpZHRoKHcpO1xyXG4gICAgfSxcclxuICAgIHBvc3RNYXJnaW5TZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGlmICggJCgnLmNfYWRkcl9wb3N0YWdlX3dyYXAnKSkge1xyXG4gICAgICAgICAgICAkKCcuY19hZGRyX3Bvc3RhZ2Vfd3JhcCcpLmNzcygnbWFyZ2luTGVmdCcsICQodGhhdC5VSS5zZWxlY3RWYWx1ZSkud2lkdGgoKSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWRkclRyaWdnZXJCdG5BZGp1c3Q6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBidG4gPSAkKHRoYXQuVUkudHJpZ2dlckJ0biksXHJcbiAgICAgICAgICAgIHcgPSBidG4ud2lkdGgoKSsgMTM7XHJcbiAgICAgICAgJCgnLmNfYWRkcmVzc193cmFwJykuY3NzKCdwYWRkaW5nUmlnaHQnLCB3KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZWxlY3RDaXR5O1xyXG4vKiBcclxuICAgIDEu54K55Ye7IOinpuWPkeaMiemSru+8jOaYvuekuumAieaLqeeql+WPo++8jOWGheWuueaYr+ecgee6p+WcsOWdgOWIl+ihqFxyXG4gICAgMi7ngrnlh7vnnIHnuqflnLDlnYDvvIwg5pi+56S66K+l55yB57qn5a+55bqU55qE5biC57qn5Zyw5Z2A5YiX6KGoXHJcbiAgICAzLueCueWHu+W4gue6p+WcsOWdgO+8jOaUtui1t+mAieaLqeeql+WPo++8jOW5tuWwhumAieaLqeeahOecgeW4guiuvuS4uuinpuWPkeaMiemSrueahOWAvFxyXG4gICAgKipcclxuICAgIGEu6byg5qCH54K55Ye75LqG6Kem5Y+R5oyJ6ZKu5oiW6YCJ5oup5LqG55yB5Lul5ZCO77yM6byg5qCH56e75Ye656qX5Y+j5ZCO77yM56qX5Y+j5LiN5YWz6Zet77yM5LuF5Zyo54K55Ye7ZG9jdW1lbnTmiJbogIXngrnlh7vop6blj5HmjInpkq7ml7blhbPpl63vvJtcclxuICAgIGIu6byg5qCH5rKh5pyJ54K55Ye76Kem5Y+R5oyJ6ZKu77yMbW91c2VlbnRlci9tb3VzZWxlYXZl5LqL5Lu25pe256qX5Y+j5YWz6Zet44CCXHJcbiAqLyIsIi8qIWFydC10ZW1wbGF0ZSAtIFRlbXBsYXRlIEVuZ2luZSB8IGh0dHA6Ly9hdWkuZ2l0aHViLmNvbS9hcnRUZW1wbGF0ZS8qL1xyXG4hZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVybiBhLnJlcGxhY2UodCxcIlwiKS5yZXBsYWNlKHUsXCIsXCIpLnJlcGxhY2UodixcIlwiKS5yZXBsYWNlKHcsXCJcIikucmVwbGFjZSh4LFwiXCIpLnNwbGl0KHkpfWZ1bmN0aW9uIGIoYSl7cmV0dXJuXCInXCIrYS5yZXBsYWNlKC8oJ3xcXFxcKS9nLFwiXFxcXCQxXCIpLnJlcGxhY2UoL1xcci9nLFwiXFxcXHJcIikucmVwbGFjZSgvXFxuL2csXCJcXFxcblwiKStcIidcIn1mdW5jdGlvbiBjKGMsZCl7ZnVuY3Rpb24gZShhKXtyZXR1cm4gbSs9YS5zcGxpdCgvXFxuLykubGVuZ3RoLTEsayYmKGE9YS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpLnJlcGxhY2UoLzwhLS1bXFx3XFxXXSo/LS0+L2csXCJcIikpLGEmJihhPXNbMV0rYihhKStzWzJdK1wiXFxuXCIpLGF9ZnVuY3Rpb24gZihiKXt2YXIgYz1tO2lmKGo/Yj1qKGIsZCk6ZyYmKGI9Yi5yZXBsYWNlKC9cXG4vZyxmdW5jdGlvbigpe3JldHVybiBtKyssXCIkbGluZT1cIittK1wiO1wifSkpLDA9PT1iLmluZGV4T2YoXCI9XCIpKXt2YXIgZT1sJiYhL149Wz0jXS8udGVzdChiKTtpZihiPWIucmVwbGFjZSgvXj1bPSNdP3xbXFxzO10qJC9nLFwiXCIpLGUpe3ZhciBmPWIucmVwbGFjZSgvXFxzKlxcKFteXFwpXStcXCkvLFwiXCIpO25bZl18fC9eKGluY2x1ZGV8cHJpbnQpJC8udGVzdChmKXx8KGI9XCIkZXNjYXBlKFwiK2IrXCIpXCIpfWVsc2UgYj1cIiRzdHJpbmcoXCIrYitcIilcIjtiPXNbMV0rYitzWzJdfXJldHVybiBnJiYoYj1cIiRsaW5lPVwiK2MrXCI7XCIrYikscihhKGIpLGZ1bmN0aW9uKGEpe2lmKGEmJiFwW2FdKXt2YXIgYjtiPVwicHJpbnRcIj09PWE/dTpcImluY2x1ZGVcIj09PWE/djpuW2FdP1wiJHV0aWxzLlwiK2E6b1thXT9cIiRoZWxwZXJzLlwiK2E6XCIkZGF0YS5cIithLHcrPWErXCI9XCIrYitcIixcIixwW2FdPSEwfX0pLGIrXCJcXG5cIn12YXIgZz1kLmRlYnVnLGg9ZC5vcGVuVGFnLGk9ZC5jbG9zZVRhZyxqPWQucGFyc2VyLGs9ZC5jb21wcmVzcyxsPWQuZXNjYXBlLG09MSxwPXskZGF0YToxLCRmaWxlbmFtZToxLCR1dGlsczoxLCRoZWxwZXJzOjEsJG91dDoxLCRsaW5lOjF9LHE9XCJcIi50cmltLHM9cT9bXCIkb3V0PScnO1wiLFwiJG91dCs9XCIsXCI7XCIsXCIkb3V0XCJdOltcIiRvdXQ9W107XCIsXCIkb3V0LnB1c2goXCIsXCIpO1wiLFwiJG91dC5qb2luKCcnKVwiXSx0PXE/XCIkb3V0Kz10ZXh0O3JldHVybiAkb3V0O1wiOlwiJG91dC5wdXNoKHRleHQpO1wiLHU9XCJmdW5jdGlvbigpe3ZhciB0ZXh0PScnLmNvbmNhdC5hcHBseSgnJyxhcmd1bWVudHMpO1wiK3QrXCJ9XCIsdj1cImZ1bmN0aW9uKGZpbGVuYW1lLGRhdGEpe2RhdGE9ZGF0YXx8JGRhdGE7dmFyIHRleHQ9JHV0aWxzLiRpbmNsdWRlKGZpbGVuYW1lLGRhdGEsJGZpbGVuYW1lKTtcIit0K1wifVwiLHc9XCIndXNlIHN0cmljdCc7dmFyICR1dGlscz10aGlzLCRoZWxwZXJzPSR1dGlscy4kaGVscGVycyxcIisoZz9cIiRsaW5lPTAsXCI6XCJcIikseD1zWzBdLHk9XCJyZXR1cm4gbmV3IFN0cmluZyhcIitzWzNdK1wiKTtcIjtyKGMuc3BsaXQoaCksZnVuY3Rpb24oYSl7YT1hLnNwbGl0KGkpO3ZhciBiPWFbMF0sYz1hWzFdOzE9PT1hLmxlbmd0aD94Kz1lKGIpOih4Kz1mKGIpLGMmJih4Kz1lKGMpKSl9KTt2YXIgej13K3greTtnJiYoej1cInRyeXtcIit6K1wifWNhdGNoKGUpe3Rocm93IHtmaWxlbmFtZTokZmlsZW5hbWUsbmFtZTonUmVuZGVyIEVycm9yJyxtZXNzYWdlOmUubWVzc2FnZSxsaW5lOiRsaW5lLHNvdXJjZTpcIitiKGMpK1wiLnNwbGl0KC9cXFxcbi8pWyRsaW5lLTFdLnJlcGxhY2UoL15cXFxccysvLCcnKX07fVwiKTt0cnl7dmFyIEE9bmV3IEZ1bmN0aW9uKFwiJGRhdGFcIixcIiRmaWxlbmFtZVwiLHopO3JldHVybiBBLnByb3RvdHlwZT1uLEF9Y2F0Y2goQil7dGhyb3cgQi50ZW1wPVwiZnVuY3Rpb24gYW5vbnltb3VzKCRkYXRhLCRmaWxlbmFtZSkge1wiK3orXCJ9XCIsQn19dmFyIGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYj9xKGIse2ZpbGVuYW1lOmF9KTpnKGEsYil9O2QudmVyc2lvbj1cIjMuMC4wXCIsZC5jb25maWc9ZnVuY3Rpb24oYSxiKXtlW2FdPWJ9O3ZhciBlPWQuZGVmYXVsdHM9e29wZW5UYWc6XCI8JVwiLGNsb3NlVGFnOlwiJT5cIixlc2NhcGU6ITAsY2FjaGU6ITAsY29tcHJlc3M6ITEscGFyc2VyOm51bGx9LGY9ZC5jYWNoZT17fTtkLnJlbmRlcj1mdW5jdGlvbihhLGIpe3JldHVybiBxKGEsYil9O3ZhciBnPWQucmVuZGVyRmlsZT1mdW5jdGlvbihhLGIpe3ZhciBjPWQuZ2V0KGEpfHxwKHtmaWxlbmFtZTphLG5hbWU6XCJSZW5kZXIgRXJyb3JcIixtZXNzYWdlOlwiVGVtcGxhdGUgbm90IGZvdW5kXCJ9KTtyZXR1cm4gYj9jKGIpOmN9O2QuZ2V0PWZ1bmN0aW9uKGEpe3ZhciBiO2lmKGZbYV0pYj1mW2FdO2Vsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIGRvY3VtZW50KXt2YXIgYz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChhKTtpZihjKXt2YXIgZD0oYy52YWx1ZXx8Yy5pbm5lckhUTUwpLnJlcGxhY2UoL15cXHMqfFxccyokL2csXCJcIik7Yj1xKGQse2ZpbGVuYW1lOmF9KX19cmV0dXJuIGJ9O3ZhciBoPWZ1bmN0aW9uKGEsYil7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGEmJihiPXR5cGVvZiBhLFwibnVtYmVyXCI9PT1iP2ErPVwiXCI6YT1cImZ1bmN0aW9uXCI9PT1iP2goYS5jYWxsKGEpKTpcIlwiKSxhfSxpPXtcIjxcIjpcIiYjNjA7XCIsXCI+XCI6XCImIzYyO1wiLCdcIic6XCImIzM0O1wiLFwiJ1wiOlwiJiMzOTtcIixcIiZcIjpcIiYjMzg7XCJ9LGo9ZnVuY3Rpb24oYSl7cmV0dXJuIGlbYV19LGs9ZnVuY3Rpb24oYSl7cmV0dXJuIGgoYSkucmVwbGFjZSgvJig/IVtcXHcjXSs7KXxbPD5cIiddL2csail9LGw9QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09e30udG9TdHJpbmcuY2FsbChhKX0sbT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7aWYobChhKSlmb3IoYz0wLGQ9YS5sZW5ndGg7ZD5jO2MrKyliLmNhbGwoYSxhW2NdLGMsYSk7ZWxzZSBmb3IoYyBpbiBhKWIuY2FsbChhLGFbY10sYyl9LG49ZC51dGlscz17JGhlbHBlcnM6e30sJGluY2x1ZGU6Zywkc3RyaW5nOmgsJGVzY2FwZTprLCRlYWNoOm19O2QuaGVscGVyPWZ1bmN0aW9uKGEsYil7b1thXT1ifTt2YXIgbz1kLmhlbHBlcnM9bi4kaGVscGVycztkLm9uZXJyb3I9ZnVuY3Rpb24oYSl7dmFyIGI9XCJUZW1wbGF0ZSBFcnJvclxcblxcblwiO2Zvcih2YXIgYyBpbiBhKWIrPVwiPFwiK2MrXCI+XFxuXCIrYVtjXStcIlxcblxcblwiO1wib2JqZWN0XCI9PXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLmVycm9yKGIpfTt2YXIgcD1mdW5jdGlvbihhKXtyZXR1cm4gZC5vbmVycm9yKGEpLGZ1bmN0aW9uKCl7cmV0dXJuXCJ7VGVtcGxhdGUgRXJyb3J9XCJ9fSxxPWQuY29tcGlsZT1mdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGQoYyl7dHJ5e3JldHVybiBuZXcgaShjLGgpK1wiXCJ9Y2F0Y2goZCl7cmV0dXJuIGIuZGVidWc/cChkKSgpOihiLmRlYnVnPSEwLHEoYSxiKShjKSl9fWI9Ynx8e307Zm9yKHZhciBnIGluIGUpdm9pZCAwPT09YltnXSYmKGJbZ109ZVtnXSk7dmFyIGg9Yi5maWxlbmFtZTt0cnl7dmFyIGk9YyhhLGIpfWNhdGNoKGope3JldHVybiBqLmZpbGVuYW1lPWh8fFwiYW5vbnltb3VzXCIsai5uYW1lPVwiU3ludGF4IEVycm9yXCIscChqKX1yZXR1cm4gZC5wcm90b3R5cGU9aS5wcm90b3R5cGUsZC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBpLnRvU3RyaW5nKCl9LGgmJmIuY2FjaGUmJihmW2hdPWQpLGR9LHI9bi4kZWFjaCxzPVwiYnJlYWssY2FzZSxjYXRjaCxjb250aW51ZSxkZWJ1Z2dlcixkZWZhdWx0LGRlbGV0ZSxkbyxlbHNlLGZhbHNlLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLGluLGluc3RhbmNlb2YsbmV3LG51bGwscmV0dXJuLHN3aXRjaCx0aGlzLHRocm93LHRydWUsdHJ5LHR5cGVvZix2YXIsdm9pZCx3aGlsZSx3aXRoLGFic3RyYWN0LGJvb2xlYW4sYnl0ZSxjaGFyLGNsYXNzLGNvbnN0LGRvdWJsZSxlbnVtLGV4cG9ydCxleHRlbmRzLGZpbmFsLGZsb2F0LGdvdG8saW1wbGVtZW50cyxpbXBvcnQsaW50LGludGVyZmFjZSxsb25nLG5hdGl2ZSxwYWNrYWdlLHByaXZhdGUscHJvdGVjdGVkLHB1YmxpYyxzaG9ydCxzdGF0aWMsc3VwZXIsc3luY2hyb25pemVkLHRocm93cyx0cmFuc2llbnQsdm9sYXRpbGUsYXJndW1lbnRzLGxldCx5aWVsZCx1bmRlZmluZWRcIix0PS9cXC9cXCpbXFx3XFxXXSo/XFwqXFwvfFxcL1xcL1teXFxuXSpcXG58XFwvXFwvW15cXG5dKiR8XCIoPzpbXlwiXFxcXF18XFxcXFtcXHdcXFddKSpcInwnKD86W14nXFxcXF18XFxcXFtcXHdcXFddKSonfFxccypcXC5cXHMqWyRcXHdcXC5dKy9nLHU9L1teXFx3JF0rL2csdj1uZXcgUmVnRXhwKFtcIlxcXFxiXCIrcy5yZXBsYWNlKC8sL2csXCJcXFxcYnxcXFxcYlwiKStcIlxcXFxiXCJdLmpvaW4oXCJ8XCIpLFwiZ1wiKSx3PS9eXFxkW14sXSp8LFxcZFteLF0qL2cseD0vXiwrfCwrJC9nLHk9L14kfCwrLztlLm9wZW5UYWc9XCJ7e1wiLGUuY2xvc2VUYWc9XCJ9fVwiO3ZhciB6PWZ1bmN0aW9uKGEsYil7dmFyIGM9Yi5zcGxpdChcIjpcIiksZD1jLnNoaWZ0KCksZT1jLmpvaW4oXCI6XCIpfHxcIlwiO3JldHVybiBlJiYoZT1cIiwgXCIrZSksXCIkaGVscGVycy5cIitkK1wiKFwiK2ErZStcIilcIn07ZS5wYXJzZXI9ZnVuY3Rpb24oYSl7YT1hLnJlcGxhY2UoL15cXHMvLFwiXCIpO3ZhciBiPWEuc3BsaXQoXCIgXCIpLGM9Yi5zaGlmdCgpLGU9Yi5qb2luKFwiIFwiKTtzd2l0Y2goYyl7Y2FzZVwiaWZcIjphPVwiaWYoXCIrZStcIil7XCI7YnJlYWs7Y2FzZVwiZWxzZVwiOmI9XCJpZlwiPT09Yi5zaGlmdCgpP1wiIGlmKFwiK2Iuam9pbihcIiBcIikrXCIpXCI6XCJcIixhPVwifWVsc2VcIitiK1wie1wiO2JyZWFrO2Nhc2VcIi9pZlwiOmE9XCJ9XCI7YnJlYWs7Y2FzZVwiZWFjaFwiOnZhciBmPWJbMF18fFwiJGRhdGFcIixnPWJbMV18fFwiYXNcIixoPWJbMl18fFwiJHZhbHVlXCIsaT1iWzNdfHxcIiRpbmRleFwiLGo9aCtcIixcIitpO1wiYXNcIiE9PWcmJihmPVwiW11cIiksYT1cIiRlYWNoKFwiK2YrXCIsZnVuY3Rpb24oXCIraitcIil7XCI7YnJlYWs7Y2FzZVwiL2VhY2hcIjphPVwifSk7XCI7YnJlYWs7Y2FzZVwiZWNob1wiOmE9XCJwcmludChcIitlK1wiKTtcIjticmVhaztjYXNlXCJwcmludFwiOmNhc2VcImluY2x1ZGVcIjphPWMrXCIoXCIrYi5qb2luKFwiLFwiKStcIik7XCI7YnJlYWs7ZGVmYXVsdDppZigvXlxccypcXHxcXHMqW1xcd1xcJF0vLnRlc3QoZSkpe3ZhciBrPSEwOzA9PT1hLmluZGV4T2YoXCIjXCIpJiYoYT1hLnN1YnN0cigxKSxrPSExKTtmb3IodmFyIGw9MCxtPWEuc3BsaXQoXCJ8XCIpLG49bS5sZW5ndGgsbz1tW2wrK107bj5sO2wrKylvPXoobyxtW2xdKTthPShrP1wiPVwiOlwiPSNcIikrb31lbHNlIGE9ZC5oZWxwZXJzW2NdP1wiPSNcIitjK1wiKFwiK2Iuam9pbihcIixcIikrXCIpO1wiOlwiPVwiK2F9cmV0dXJuIGF9LFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZT9kZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZH0pOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWQ6dGhpcy50ZW1wbGF0ZT1kfSgpOyIsInZhciBpdGVtU2l6ZSA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvaXRlbXNpemUnKTtcclxudmFyIGxvZ2luID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9sb2dpbicpO1xyXG52YXIgZmFrZUEgPSByZXF1aXJlKCcuLi9wbHVnaW5zL0Zha2VBJyk7XHJcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvdGVtcGxhdGUnKTtcclxudmFyIHNlbGVjdENpdHkgPSByZXF1aXJlKCcuLi9wbHVnaW5zL3NlbGVjdENpdHknKTtcclxudmFyIGdldEdlbyA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvZ2V0X2dlb19sb2NhdGlvbicpO1xyXG5cclxudmFyIGRldGFpbCA9IHtcclxuICAgIFVJOntcclxuICAgICAgICBzdHlsZUl0ZW06Jy5jeWNfc3R5bGVfaXRlbScsXHJcbiAgICAgICAgYWRkTWluOicjY3ljX2FkZF9taW4nLFxyXG4gICAgICAgIHNpemVJcHQ6JyNjX251bV9pcHQnLCAgIFxyXG4gICAgICAgIHByaWNlTnVtOicjY19wcmljZV9udW0nLFxyXG4gICAgICAgIHNhbGVPdXQ6Jy5jX3NhbGVfb3V0JyxcclxuICAgICAgICBwcmljZVdyYXA6ICcuY3ljX3ByaWNlX3dyYXAnLFxyXG4gICAgICAgIHByaWNlQmxvY2s6ICcuY19wcmljZV9ibG9jaycsXHJcbiAgICAgICAgcHJpY2VCZW5lZml0OiAnLmNfcHJpY2VfYmVuZWZpdCcsXHJcbiAgICAgICAgYWRkQ2FydDonI2NfYWRkX3RvX2NhcnQnLFxyXG4gICAgICAgIHR5cGVJdGVtOicuY3ljX3R5cGVfaXRlbScsXHJcbiAgICAgICAgaGVhZGVyTG9naW46JyNjeWNfaGVhZGVyX2xvZ2luJyxcclxuICAgICAgICBoZWFkZXJSZWc6JyNjeWNfaGVhZGVyX3JlZycsXHJcbiAgICAgICAgbG9nUmVnV3JhcDonI2NfbG9nX3JlZycsXHJcbiAgICAgICAgaGVhZENhcnQ6Jy5jeWNfY2FydCcsXHJcbiAgICAgICAgaGVhZENhcnROdW1zOicuY3ljX2NhcnRfbnVtcycsXHJcbiAgICAgICAgdGltZURvd246Jy5jeWNfdGltZWRvd24nLFxyXG4gICAgICAgIHRpbWVBcmVhOicuY3ljX3RpbWVfYXJlYScsXHJcbiAgICAgICAgYmVnaW5PRW5kOicuY3ljX3NraWxsX2JlZ2luX29yX2VuZCcsXHJcbiAgICAgICAgcXJXcmFwOicuY3ljX3FyX3dyYXAnLFxyXG4gICAgICAgIHFySW1nOicuY3ljX2JpZ19xcl9pbWcnLFxyXG4gICAgICAgIHJlY29NYXJxdWVlOicjSl9yZWNvX2xpc3QnLFxyXG4gICAgICAgIHJlY29JdGVtOicuY3ljX3JlY29faXRlbScsXHJcbiAgICAgICAgcmVjb01hcnF1ZWVMZWZ0OicjSl9yZWNvX2xpc3RfbGVmdCcsXHJcbiAgICAgICAgcmVjb01hcnF1ZWVSaWdodDonI0pfcmVjb19saXN0X3JpZ2h0JyxcclxuICAgICAgICByZWNvV3JhcDonLmN5Y19yZWNvX3dyYXAnLFxyXG4gICAgICAgIGhvdmVySXRlbTonLmN5Y19ob3Zlcl9pdGVtJyxcclxuICAgICAgICBmYXZQcm9kdWN0OicjSl9mYXYnLFxyXG4gICAgICAgIGRpYWxvZ0NsczonLmNfY29tbV9kaWFsb2dfY2xvc2UnLFxyXG4gICAgICAgIGdvdG9Ub3A6Jy5jX2ZpeF90b3AnLFxyXG4gICAgICAgIHRpcHNEdGw6Jy5jeWNfdGlwc19pdGVtJyxcclxuICAgICAgICBwcmVEZWFkbGluZTogJy5jX3ByZV9kZWFkbGluZScsXHJcbiAgICAgICAgZmluYWxEZWFkbGluZTogJy5jX2ZpbmFsX2RlYWRsaW5lJyxcclxuICAgICAgICBkZWxpdmVyVGlwOiAnLmNfZGVsaXZlcl90aXAnLFxyXG4gICAgICAgIHByZVByaWNlOiAnLmNfcHJlX3ByaWNlJyxcclxuICAgICAgICBmaW5hbFByaWNlOiAnLmNfZmluYWxfcHJpY2UnLFxyXG4gICAgICAgIHByZVBlcmNlbnQ6ICcuY19wcmVfcGVyY2VudCcsXHJcbiAgICAgICAgZmluYWxQZXJjZW50OiAnLmNfZmluYWxfcGVyY2VudCcsXHJcbiAgICAgICAgcHJlU2FsZUhkOicuY19hZHZhbmNlX3NlbGxfaGQnLFxyXG4gICAgICAgIHByZVN0ZXBJY29uOiAnLmNfaWNvbl9udW0nLFxyXG4gICAgICAgIHByZUJhcjogJy5jX2FkdmFuY2VfYmFyJyxcclxuICAgICAgICBsYXJnZVBpY0E6ICcuc3AtbGFyZ2UgYScsXHJcbiAgICAgICAgY291cG9uV3JhcDogJy5jX2NvdXBvbl93cmFwJyxcclxuICAgICAgICBjb3Vwb25Cb3g6ICcuY19jb3Vwb25fYm94JyxcclxuICAgICAgICBjb3Vwb25DbHM6ICcuY19jb3Vwb25fYm94X2NscycsXHJcbiAgICAgICAgZ2V0Q291cG9uOiAnLmNfY291cG9uX2dldCcsXHJcbiAgICAgICAgc3RvY2tOdW06ICcuY19zdG9ja19udW0nLFxyXG4gICAgICAgIG9yaWdpblByaWNlOiAnLmNfb3JpZ2luX3ByaWNlJyxcclxuICAgICAgICBkaXNjb3VudEljb246ICcuY19kaXNjb3VudF9pY29uJyxcclxuICAgICAgICBkaXNjb3VudFN0YXJ0OiAnLmNfZGlzY291bnRfc3RhcnQnLFxyXG4gICAgICAgIGRpc2NvdW50RW5kOiAnLmNfZGlzY291bnRfZW5kJyxcclxuICAgICAgICBhZHZhbmNlUnVsZUJ0bjogJy5jX2FkdmFuY2Vfc2VsbF9ydWxlX2J0bicsXHJcbiAgICAgICAgYWR2YW5jZVJ1bGVDdHQ6ICcuY19hZHZhbmNlX3J1bGVfY3R0JyxcclxuICAgICAgICBzZWxsTnVtOiAnLmNfc2VsbF9udW0nLFxyXG4gICAgICAgIG1vbmV5U2F2ZWQ6ICcuY19tb25leV9zYXZlZCcsXHJcbiAgICAgICAgdmlwSWNvbjogJy5jX3ZpcF9pY29uJyxcclxuICAgICAgICBwcm9tb3Rpb25CYXI6ICcuY19wcm9tb3Rpb24nLFxyXG4gICAgICAgIGNhblJlZnVuZFRpcHM6ICcuY19ub19iYWNrJyxcclxuICAgICAgICBidXlOb3c6Jy5jX2J1eV9ub3cnLFxyXG4gICAgICAgIG9uZURlbGl2ZXJ5OicuY19vbmVfZGVsaXZlcnknLFxyXG4gICAgICAgIC8vIGFkZHJTZWxUcmlnZ2VyOiAnLmNfYWRkcmVzc19zZWxfdHJpZ2dlcicsXHJcbiAgICAgICAgLy8gYWRkclNlbFBhbmVsOiAnLmNfYWRkcl9iZCcsXHJcbiAgICAgICAgLy8gYWRkclNlbFRhYjogJy5jX2FkZHJfc2VsX2hkJyxcclxuICAgICAgICAvLyBhZGRyU2VsQ3R0OiAnLmNfYWRkcl9zZWxfYmQnIFxyXG4gICAgICAgIHJlZGVtTGlzdDonI2N5Y19kZXRhaWxfc2Nyb2xsYmFyJyxcclxuICAgIH0sXHJcbiAgICB0bXBsOntcclxuICAgICAgICByZWRlbVZpZXdUbXBsOiAnY19yZWRlbV9zaG9wX2xheWVyJ1xyXG4gICAgfSxcclxuICAgIHJlbmRlclJlZGVtVmlldzogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgdmFyIGh0bWwgPSB0ZW1wbGF0ZSh0aGlzLnRtcGwucmVkZW1WaWV3VG1wbCwgZGF0YSk7XHJcbiAgICAgICAgJCh0aGlzLlVJLnJlZGVtTGlzdCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgfSxcclxuICAgIHN0YXR1czp7XHJcbiAgICAgICAgaG92ZXI6J2N5Y19ob3ZlcidcclxuICAgIH0sXHJcbiAgICBkYXRhOntcclxuICAgICAgICBwaWQ6JCgnI3Byb2R1Y3RfaWQnKS52YWwoKSxcclxuICAgICAgICBpc1ByZXNlbnQ6ICQoJyNpc1ByZXNlbnQnKS52YWwoKVxyXG4gICAgfSxcclxuICAgIFVybDp7XHJcbiAgICAgICAgY291cG9uVXJsOiAkKCcjY291cG9uX3VybCcpLnZhbCgpXHJcbiAgICB9LFxyXG4gICAgaW5pdDpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuYmluZEN1c0V2ZW50KCk7XHJcbiAgICAgICAgdGhpcy5pbml0UGx1Z2luKCk7XHJcbiAgICAgICAgdGhpcy5hZGp1c3RVSSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QWRkclRleHQoKTtcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKCdQSFBTRVNTSUQnKSAhPSAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvZHVjdElkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGluaXRQbHVnaW46ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgZmFrZUEuaW5pdCgpO1xyXG4gICAgICAgIHNlbGVjdENpdHkuaW5pdCgpO1xyXG4gICAgICAgIGdldEdlby5pbml0KCk7XHJcblxyXG4gICAgICAgIHZhciBhY3RpdmVTa3VzID0gJCh0aGF0LlVJLnN0eWxlSXRlbSkubm90KHRoYXQuVUkuc2FsZU91dCk7XHJcbiAgICAgICAgaWYgKCBhY3RpdmVTa3VzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgICQoYWN0aXZlU2t1c1swXSkudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLnByaWNlTnVtKS5odG1sKFwi5Y2W5YWJ5ZWm77yBKOKAi+KKmeKAi2/igIviipnigIspXCIpO1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkucHJpY2VCZW5lZml0KS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtYXJxdWVlXHJcbiAgICAgICAgJCh0aGlzLlVJLnJlY29NYXJxdWVlKS5reGJkU3VwZXJNYXJxdWVlKHtcclxuICAgICAgICAgICAgZGlzdGFuY2U6JCh0aGF0LlVJLnJlY29JdGVtKS5vdXRlcldpZHRoKHRydWUpLFxyXG4gICAgICAgICAgICB0aW1lOjMsXHJcbiAgICAgICAgICAgIGJ0bkdvOntsZWZ0OnRoYXQuVUkucmVjb01hcnF1ZWVMZWZ0LHJpZ2h0OnRoYXQuVUkucmVjb01hcnF1ZWVSaWdodH0sXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjonbGVmdCdcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoaXMuVUkudGltZURvd24pLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgJHRpbWVBcmVhID0gJHNlbGYuZmluZCh0aGF0LlVJLnRpbWVBcmVhKSxcclxuICAgICAgICAgICAgICAgIF90aW1lID0gJHRpbWVBcmVhLmRhdGEoJ3RpbWUnKSxcclxuICAgICAgICAgICAgICAgIF9pc19iZWdpbiA9ICR0aW1lQXJlYS5kYXRhKCdpcy1iZWdpbicpLFxyXG4gICAgICAgICAgICAgICAganFCZWdpbk9yRW5kID0gJHNlbGYuc2libGluZ3ModGhhdC5VSS5iZWdpbk9FbmQpLFxyXG4gICAgICAgICAgICAgICAganFUaXRsZSA9ICRzZWxmLmNsb3Nlc3QodGhhdC5VSS50b2RheUluZm8pLmZpbmQodGhhdC5VSS50b2RheUluZm9UaXRsZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2lzX2JlZ2luID09IDApIHsgXHJcbiAgICAgICAgICAgICAganFCZWdpbk9yRW5kLmh0bWwoJ+W8gOWniycpOyBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lQXJlYS50aW1lQ291bnREb3duKHtcclxuICAgICAgICAgICAgICAgIHRpbWU6IF90aW1lICogMTAwMCxcclxuICAgICAgICAgICAgICAgIC8vdHlwZTogJ21zJyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheSA9IHRoaXMuZmlsbFplcm8ocmVzdWx0LmQpLnNwbGl0KCcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG91ciA9IHRoaXMuZmlsbFplcm8ocmVzdWx0LmgpLnNwbGl0KCcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlID0gdGhpcy5maWxsWmVybyhyZXN1bHQubSkuc3BsaXQoJycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmQgPSB0aGlzLmZpbGxaZXJvKHJlc3VsdC5zKS5zcGxpdCgnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gcmVzdWx0Lm1zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0X3RpbWUgPSByZXN1bHQubGFzdF90aW1lcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0X3RpbWUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoX2lzX2JlZ2luID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganFCZWdpbk9yRW5kLmh0bWwoJ+e7k+adnycpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3N0YXJ0X3RpbWUgPSAkdGltZUFyZWEuZGF0YSgncHJvZHVjdC1zdGFydC10aW1lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9lbmRfdGltZSA9ICR0aW1lQXJlYS5kYXRhKCdwcm9kdWN0LWVuZC10aW1lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pc19iZWdpbiA9IDEgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVzID0gKF9lbmRfdGltZSAtIF9zdGFydF90aW1lKSoxMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpxVGl0bGUuaHRtbCgnPGZvbnQgY29sb3I9XCJncmF5XCI+56eS5p2A5bey57uT5p2fPC9mb250PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVBcmVhLmZpbmQoJy5kYXlfMScpLnRleHQoZGF5WzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZUFyZWEuZmluZCgnLmRheV8yJykudGV4dChkYXlbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lQXJlYS5maW5kKCcuaG91cl8xJykudGV4dChob3VyWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZUFyZWEuZmluZCgnLmhvdXJfMicpLnRleHQoaG91clsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVBcmVhLmZpbmQoJy5taW51dGVfMScpLnRleHQobWludXRlWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZUFyZWEuZmluZCgnLm1pbnV0ZV8yJykudGV4dChtaW51dGVbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lQXJlYS5maW5kKCcuc2Vjb25kXzEnKS50ZXh0KHNlY29uZFswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVBcmVhLmZpbmQoJy5zZWNvbmRfMicpLnRleHQoc2Vjb25kWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAkdGltZUFyZWEuZmluZCgnLm1zXzEnKS50ZXh0KG1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5sb2FkKCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnLnNwLXdyYXAnKS5zbW9vdGhwcm9kdWN0cygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgaXNTaG93c2VsbE51bSA9ICQoJy5jeWNfc3R5bGVfaXRlbS5hY3RpdmUnKS5kYXRhKCdpcy1zaG93LXNlbGxudW0nKTtcclxuICAgICAgICBpZihpc1Nob3dzZWxsTnVtID09IDEpe1xyXG4gICAgICAgICAgICAkKCcuY19zZWxsX251bV93cmFwJykuc2hvdygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAkKCcuY19zZWxsX251bV93cmFwJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBiaW5kQ3VzRXZlbnQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsdGhhdC5VSS5zdHlsZUl0ZW0sZnVuY3Rpb24gc2VsZWN0U3R5bGVIYW5kbGVyKCl7IC8v5ZG95ZCNIOeUqOadpeino+e7ke+8ge+8gVxyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdFN0eWxlSGFuZGxlciA9IHNlbGVjdFN0eWxlSGFuZGxlcjtcclxuICAgICAgICAgICAgdmFyIHNrdSA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBsZWF2aW5ncyA9IHNrdS5kYXRhKCdzdG9jay1udW1zJyk7XHJcbiAgICAgICAgICAgIGlmIChsZWF2aW5ncyA+IDApe1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RTaXplSXRlbShza3UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJyx0aGF0LlVJLmFkZENhcnQsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnb2ZmJykpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCAkKHRoaXMpLmRhdGEoJ2lzLXByZScpID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn6aKE5ZSu5bey57uT5p2f77yM6K+35pS26JeP562J5b6F5YaN5qyh5byA5pS+6ZSA5ZSuJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pOyAgIFxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlY1N0YXR1cyA9ICQodGhpcykuZGF0YSgnc2VjLXN0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc2VjU3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vdGJlZ2luJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllci5vcGVuKHtjb250ZW50OiAn6Zeq6LSt5pyq5byA5aeLJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbmlzaGVkJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllci5vcGVuKHtjb250ZW50OiAn6Zeq6LSt5bey57uT5p2fJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoYXQuYWRkVG9DYXJ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5vbignY2xpY2snLHRoYXQuVUkuaGVhZGVyUmVnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxvZ2luLmluaXQoe1xyXG4gICAgICAgICAgICAgICAgJ2hlYWRlclJlZyc6dGhhdC5VSS5oZWFkZXJSZWcsXHJcbiAgICAgICAgICAgICAgICAnaGVhZGVyTG9naW4nOnRoYXQuVUkuaGVhZGVyTG9naW4sXHJcbiAgICAgICAgICAgICAgICAnbG9nUmVnV3JhcCc6dGhhdC5VSS5sb2dSZWdXcmFwXHJcbiAgICAgICAgICAgICAgICAsdHlwZToncmVnJ1xyXG4gICAgICAgICAgICB9LHRoYXQuc3VjY2Vzc0NiKTtcclxuICAgICAgICB9KS5vbignbW91c2VvdmVyJyx0aGF0LlVJLnFyV3JhcCxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkucXJJbWcpLnNob3coKTtcclxuICAgICAgICB9KS5vbignbW91c2VvdXQnLHRoYXQuVUkucXJXcmFwLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5xckltZykuaGlkZSgpO1xyXG4gICAgICAgIH0pLm9uKCdtb3VzZW92ZXInLHRoaXMuVUkucmVjb1dyYXAsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuY3ljX2xpc3RfbGVmdCcpLnNob3coKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuY3ljX2xpc3RfcmlnaHQnKS5zaG93KCk7XHJcbiAgICAgICAgfSkub24oJ21vdXNlb3V0Jyx0aGlzLlVJLnJlY29XcmFwLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmN5Y19saXN0X2xlZnQnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmN5Y19saXN0X3JpZ2h0JykuaGlkZSgpO1xyXG4gICAgICAgIH0pLm9uKCdtb3VzZW92ZXInLHRoaXMuVUkuaG92ZXJJdGVtLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3ModGhhdC5zdGF0dXMuaG92ZXIpO1xyXG4gICAgICAgIH0pLm9uKCdtb3VzZW91dCcsdGhpcy5VSS5ob3Zlckl0ZW0sZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyh0aGF0LnN0YXR1cy5ob3Zlcik7XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJyx0aGlzLlVJLmZhdlByb2R1Y3QsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIHBpZCA9ICQodGhpcykuZGF0YSgncGlkJyk7XHJcbiAgICAgICAgICAgIHZhciBmYXYgPSAkKHRoaXMpLmRhdGEoJ2ZhdicpO1xyXG4gICAgICAgICAgICB0aGF0LmZhdlByb2R1Y3QocGlkLGZhdik7XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJyx0aGlzLlVJLmRpYWxvZ0NscyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCcjY19jb21tX2RpYWxvZ19tYXNrJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKCcuY19jb21tX2RpYWxvZycpLmhpZGUoKTtcclxuICAgICAgICB9KS5vbignbW91c2VvdmVyJyx0aGF0LlVJLnRpcHNEdGwsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyh0aGF0LnN0YXR1cy5ob3Zlcik7XHJcbiAgICAgICAgfSkub24oJ21vdXNlb3V0Jyx0aGF0LlVJLnRpcHNEdGwsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyh0aGF0LnN0YXR1cy5ob3Zlcik7XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJywgdGhhdC5VSS5sYXJnZVBpY0EsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJywgdGhhdC5VSS5jb3Vwb25XcmFwLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLmNvdXBvbkJveCkudG9nZ2xlQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJywgdGhhdC5VSS5jb3Vwb25DbHMsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5jb3Vwb25Cb3gpLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgIH0pLm9uKCdjbGljaycsIGRvY3VtZW50LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkuY291cG9uQm94KS5yZW1vdmVDbGFzcygnb24nKTtcclxuICAgICAgICB9KS5vbignY2xpY2snLCB0aGF0LlVJLmdldENvdXBvbiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb24nKSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY291cG9uSWQgPSAkKHRoaXMpLnBhcmVudCgpLmRhdGEoJ2NvdXBvbi1hY3QtaWQnKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuZ2V0Q291cG9uKGNvdXBvbklkKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KS5vbignbW91c2VlbnRlcicsIHRoYXQuVUkuYWR2YW5jZVJ1bGVCdG4sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5hZHZhbmNlUnVsZUN0dCkuYWRkQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgfSkub24oJ21vdXNlbGVhdmUnLCB0aGF0LlVJLmFkdmFuY2VSdWxlQnRuLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkuYWR2YW5jZVJ1bGVDdHQpLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgIH0pLm9uKCdjbGljaycsdGhhdC5VSS5idXlOb3csZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdGhhdC5idXlOb3coKTtcclxuICAgICAgICB9KS5vbignbW91c2VvdmVyJyx0aGF0LlVJLm9uZURlbGl2ZXJ5LGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy5jX29uZV9kZWxpdmVyeV90aXBzJykuc2hvdygpO1xyXG4gICAgICAgIH0pLm9uKCdtb3VzZWxlYXZlJyx0aGF0LlVJLm9uZURlbGl2ZXJ5LGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy5jX29uZV9kZWxpdmVyeV90aXBzJykuaGlkZSgpO1xyXG4gICAgICAgIH0pLm9uKCdjbGljaycsICcuY19hZGRyX3NlbF9iZF9jaXR5IHNwYW4nLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgY2l0eSA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBjaXR5TmFtZSA9IGNpdHkudGV4dCgpLFxyXG4gICAgICAgICAgICAgICAgY2l0eUNvZGUgPSBjaXR5LmRhdGEoJ2NpdHktY29kZScpLFxyXG4gICAgICAgICAgICAgICAgcHJvdmluY2VJZCA9IGNpdHkuZGF0YSgnY2l0eS1pZCcpLnRvU3RyaW5nKCkuc3Vic3RyKDAsMikgKyAnMDAwMCcsXHJcbiAgICAgICAgICAgICAgICBwcm92TmFtZSA9ICQoJ1tkYXRhLXByb3ZpbmNlLWlkPScrIHByb3ZpbmNlSWQgKyAnXScpLnRleHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBleHBpcmVUaW1lID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwMDAwKSArIDI1OTIwMDA7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICdjeWNfY2l0eV9jb2RlPScgKyBjaXR5LmRhdGEoJ2NpdHktY29kZScpICsgJztkb21haW49LmN5Y2FuZy5jb207bWF4LWFnZT0nKyBleHBpcmVUaW1lKyAnO3BhdGg9Lyc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICdjeWNfcHJvdmluY2VfbmFtZT0nICsgcHJvdk5hbWUgKyAnO2RvbWFpbj0uY3ljYW5nLmNvbTttYXgtYWdlPScrIGV4cGlyZVRpbWUrICc7cGF0aD0vJztcclxuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gJ2N5Y19jaXR5X25hbWU9JyArIGNpdHkudGV4dCgpICsgJztkb21haW49LmN5Y2FuZy5jb207bWF4LWFnZT0nKyBleHBpcmVUaW1lKyAnO3BhdGg9Lyc7XHJcbiAgICAgICAgICAgIHRoYXQuY2l0eUNob29zZWQoY2l0eU5hbWUsIGNpdHlDb2RlLCBwcm92TmFtZSk7XHJcbiAgICAgICAgfSkub24oJ2NsaWNrJywgJy5jX3JlZGVtcHRpb25fZ29vZHMnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB0aGF0LnJlZGVtR29vZHNMaXN0KCk7XHJcbiAgICAgICAgICAgICQoJy5jeWNfcmVkZW1wdGlvbl9sYXllcicpLnNob3coKTsgICAgICAgICAgICBcclxuXHRcdH0pLm9uKCdjbGljaycsICcuY3ljX3JlZGVtcHRpb25fY2xvc2UnLCBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcuY3ljX3JlZGVtcHRpb25fbGF5ZXInKS5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgd2luSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICB2YXIganFHb3RvVG9wID0gJCh0aGF0LlVJLmdvdG9Ub3ApO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPiB3aW5IZWlnaHQgPyBqcUdvdG9Ub3AuZmFkZUluKDEwMDApOmpxR290b1RvcC5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0U2l6ZUl0ZW06ZnVuY3Rpb24oc2t1KXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIG1pbkJ1eSA9IHNrdS5kYXRhKCdtaW4tbnVtcycpLFxyXG4gICAgICAgICAgICBsaW1pdGVkQnV5ID0gc2t1LmRhdGEoJ2xpbWl0LW51bXMnKSxcclxuICAgICAgICAgICAgc2FsZVR5cGUgPSBza3UuZGF0YSgnc2FsZS10eXBlJyksXHJcbiAgICAgICAgICAgIGlzU2Vja2lsbCA9IHNrdS5kYXRhKCdpcy1zZWNraWxsJylcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIHNrdS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7Ly9tYXJrIGNob29zZWRcclxuICAgICAgICAkKHRoYXQuVUkuc2l6ZUlwdCkudmFsKG1pbkJ1eSk7XHJcbiAgICAgICAgaXRlbVNpemUuaW5pdCh0aGF0LlVJLmFkZE1pbik7XHJcbiAgICAgICAgaXRlbVNpemUubWF4TnVtID0gbGltaXRlZEJ1eTtcclxuICAgICAgICBpdGVtU2l6ZS5pbml0c3RhdHVzKCk7XHJcblxyXG4gICAgICAgIHRoYXQuc2t1UHJpY2VIYW5kbGUoc2t1KTsgLy/ku7fmoLznrYlcclxuICAgICAgICB0aGF0LnNrdUNoZWNrU3RvY2tOdW0oc2t1KTsgLy/lupPlrZhcclxuICAgICAgICB0aGF0LnNrdUNoZWNrU2VsbE51bShza3UpOyAvL+W3suWUruaVsOmHj1xyXG4gICAgICAgIHRoYXQuc2t1Q2hlY2tIYXNTa3VJbWcoc2t1KTsvL3NrdeWbvueJh1xyXG4gICAgICAgIHRoYXQuc2t1Q2hlY2tJc1ByZXNlbnQoc2t1KTsgLy/liKTmlq3mmK/lkKbotaDlk4FcclxuICAgICAgICB0aGF0LnNrdUNoZWNrSXNWaXAoc2t1KTsgLy92aXDlrqLmiLfku7fmoLzlkozmipjmiaPlm77moIdcclxuICAgICAgICB0aGF0LnNrdUNoZWNrQ2FuUmVmdW5kKHNrdSk7IC8v5piv5ZCm6IO95aSf6YCA5qy+XHJcblxyXG4gICAgICAgIGlmIChzYWxlVHlwZSA9PSAzIHx8IHNhbGVUeXBlID09IDQpIHRoYXQuc2t1UmVzZXJ2ZUhhbmRsZShza3UpOyAvL+mihOWUriAgICAgXHJcbiAgICAgICAgaWYgKGlzU2Vja2lsbCA9PSAxKSB0aGF0LnNrdVNlY2tpbGwoc2t1KTsgLy/pl6rotK1cclxuICAgIH0sXHJcbiAgICBza3VQcmljZUhhbmRsZTogZnVuY3Rpb24oc2t1KXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIHByaWNlID0gTnVtYmVyKHNrdS5kYXRhKCdwcmljZScpKSxcclxuICAgICAgICAgICAgb3JpZ2luUHJpY2UgPSAgTnVtYmVyKHNrdS5kYXRhKCdvcmlnaW4tcHJpY2UnKSk7XHJcblxyXG4gICAgICAgICQodGhhdC5VSS5wcmljZU51bSkudGV4dChwcmljZS50b0ZpeGVkKDIpKTtcclxuICAgICAgICAkKHRoYXQuVUkub3JpZ2luUHJpY2UpLnRleHQob3JpZ2luUHJpY2UudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgaWYgKCBwcmljZSA8PSBvcmlnaW5QcmljZSApIHtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLm9yaWdpblByaWNlKS5zaG93KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5vcmlnaW5QcmljZSkuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBza3VDaGVja1N0b2NrTnVtOiBmdW5jdGlvbihza3Upe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICAgc3RvY2tOdW1zID0gc2t1LmRhdGEoJ3N0b2NrLW51bXMnKSxcclxuICAgICAgICAgICAgaXNTaG93U3RvY2sgPSBza3UuZGF0YSgnaXMtc2hvdy1zdG9jay1udW1zJylcclxuICAgICAgICBpZiAoIHN0b2NrTnVtcyA+IDAgKXtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLnByaWNlV3JhcCkucmVtb3ZlQ2xhc3MoJ2Nfc2FsZV9vdXQnKTtcclxuICAgICAgICAgICAgaWYoIGlzU2hvd1N0b2NrID09IDEgKXtcclxuICAgICAgICAgICAgICAgICQodGhhdC5VSS5zdG9ja051bSkuc2hvdygpLnRleHQoJ++8iOWJqeS9meW6k+WtmCcrIHN0b2NrTnVtcyArICfku7bvvIknKTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoIGlzU2hvd1N0b2NrID09IDAgKXtcclxuICAgICAgICAgICAgICAgICQodGhhdC5VSS5zdG9ja051bSkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5wcmljZVdyYXApLmFkZENsYXNzKCdjX3NhbGVfb3V0Jyk7XHJcbiAgICAgICAgICAgIHNrdS5hZGRDbGFzcygnb2ZmJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNrdVNlY2tpbGw6IGZ1bmN0aW9uKHNrdSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBpc1NlY0ZpbmlzaCA9IHNrdS5kYXRhKCdpcy1zZWMtZmluaXNoJyksXHJcbiAgICAgICAgICAgIHByaWNlID0gTnVtYmVyKHNrdS5kYXRhKCdwcmljZScpKSxcclxuICAgICAgICAgICAgb3JpZ2luUHJpY2UgPSAgTnVtYmVyKHNrdS5kYXRhKCdvcmlnaW4tcHJpY2UnKSlcclxuICAgICAgICAgICA7XHJcbiAgICAgICAgaWYgKCBpc1NlY0ZpbmlzaCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHNrdS5hZGRDbGFzcygnb2ZmJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQodGhhdC5VSS5tb25leVNhdmVkKS50ZXh0KChvcmlnaW5QcmljZSAtIHByaWNlKS50b0ZpeGVkKDIpKTtcclxuXHJcbiAgICAgICAgaWYgKCBwcmljZSA8PSBvcmlnaW5QcmljZSApIHtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLnByaWNlQmVuZWZpdCkuc2hvdygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkucHJpY2VCZW5lZml0KS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNrdVJlc2VydmVIYW5kbGU6IGZ1bmN0aW9uKHNrdSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBwcmVQcmljZSA9IHNrdS5kYXRhKCdwcmUtcGF5LXByaWNlJyksXHJcbiAgICAgICAgICAgIGZpbmFsUHJpY2UgPSBza3UuZGF0YSgnZmluYWwtcGF5bWVudCcpLFxyXG4gICAgICAgICAgICBzYWxlTGFzdGRheSA9IHNrdS5kYXRhKCdwcmUtc2FsZS1sYXN0LWRheScpLFxyXG4gICAgICAgICAgICBwcmVEZWFkbGluZSA9IHNrdS5kYXRhKCdwcmUtcGF5LWVuZC10aW1lJyksXHJcbiAgICAgICAgICAgIGZpbmFsRGVhZGxpbmUgPSBza3UuZGF0YSgnZmluYWwtcGF5LWVuZC10aW1lJyksXHJcbiAgICAgICAgICAgIGlzRHluYW1pY1ByZSA9IHNrdS5kYXRhKCdpcy1keW5hbWljLXByZScpLFxyXG4gICAgICAgICAgICBkeW5hbWljRmluYWxEYXlzID0gc2t1LmRhdGEoJ2R5bmFtaWMtZmluYWwtZGF5cycpLFxyXG4gICAgICAgICAgICBkeW5hbWljRGVsaXZlciA9IHNrdS5kYXRhKCdkeW5hbWljLWRlbGl2ZXInKSxcclxuICAgICAgICAgICAgZGVsaXZlclRpbWUgPSBza3UuZGF0YSgnZGVsaXZlcnktdGltZScpO1xyXG4gICAgICAgICQodGhhdC5VSS5wcmVQcmljZSkudGV4dCgn77+lJyArIHByZVByaWNlKTtcclxuICAgICAgICAkKHRoYXQuVUkuZmluYWxQcmljZSkudGV4dCgn77+lJyArIGZpbmFsUHJpY2UpO1xyXG5cclxuICAgICAgICBpZiggc2FsZUxhc3RkYXkgPiAwICl7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5wcmVTYWxlSGQpLmh0bWwoJ+eBq+eDremihOWUruS4rSAgPHNwYW4gY2xhc3M9XCJjX2FkdmFuY2VfZGF5c1wiPicgKyBwcmVEZWFkbGluZSArICc8L3NwYW4+IOe7k+adn+mihOWUricpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICQodGhhdC5VSS5wcmVTYWxlSGQpLnRleHQoJ+mihOWUruW3sue7k+adn++8jOivt+aUtuiXj+etieW+heWGjeasoeW8gOaUvumUgOWUricpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggaXNEeW5hbWljUHJlID09IDEgKSB7Ly/liqjmgIHpooTllK5cclxuICAgICAgICAgICAgJCh0aGF0LlVJLmZpbmFsRGVhZGxpbmUpLmh0bWwoJ+acgOi/n+S7mOWumumHkScrIGR5bmFtaWNGaW5hbERheXMgKyflpKnlhoU8YnI+5pSv5LuY5bC+5qy+Jyk7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5kZWxpdmVyVGlwKS5odG1sKCfku5jlsL7mrL7lkI4nKyBkeW5hbWljRGVsaXZlciArICflpKnlhoU8YnI+5oyJ6K6i5Y2V6aG65bqP5Y+R6LSnJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5maW5hbERlYWRsaW5lKS5odG1sKCfmnIDov58nK2ZpbmFsRGVhZGxpbmUgKyfliY3mlK/ku5jlsL7mrL4nKTtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLmRlbGl2ZXJUaXApLmh0bWwoZGVsaXZlclRpbWUgKyAn5ZCO5oyJ54Wn6K6i5Y2V6aG65bqP5Y+R6LSnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNrdUNoZWNrU2VsbE51bTogZnVuY3Rpb24oc2t1KXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIHNlbGxOdW1zID0gc2t1LmRhdGEoJ3NlbGwtbnVtJyksXHJcbiAgICAgICAgICAgIGlzU2hvd3NlbGxOdW0gPSAkKCcuY3ljX3N0eWxlX2l0ZW0uYWN0aXZlJykuZGF0YSgnaXMtc2hvdy1zZWxsbnVtJyk7XHJcbiAgICAgICAgJCh0aGF0LlVJLnNlbGxOdW0pLnRleHQoc2VsbE51bXMpO1xyXG4gICAgICAgIGlmKGlzU2hvd3NlbGxOdW0gPT0gMSl7XHJcbiAgICAgICAgICAgICQoJy5jX3NlbGxfbnVtX3dyYXAnKS5zaG93KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQoJy5jX3NlbGxfbnVtX3dyYXAnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNrdUNoZWNrSGFzU2t1SW1nOiBmdW5jdGlvbihza3Upe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICAgc2t1VXJsID0gc2t1LmRhdGEoJ3NrdS1maWd1cmUnKTtcclxuICAgICAgICBpZiAoc2t1VXJsKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2hvd1NrdUltZyhza3VVcmwpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB2YXIgb3JpZ2luRmlndXJlID0gJCh0aGF0LlVJLmxhcmdlUGljQSkuZmluZCgnaW1nJyk7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5sYXJnZVBpY0EpLmF0dHIoJ2hyZWYnLG9yaWdpbkZpZ3VyZS5kYXRhKCdvcmlnaW4tZmlndXJlJykpO1xyXG4gICAgICAgICAgICBvcmlnaW5GaWd1cmUuYXR0cignc3JjJyxvcmlnaW5GaWd1cmUuZGF0YSgnb3JpZ2luLWZpZ3VyZScpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2t1Q2hlY2tJc1ByZXNlbnQ6IGZ1bmN0aW9uKHNrdSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBwcmljZSA9IHNrdS5kYXRhKCdwcmljZScpO1xyXG4gICAgICAgIGlmKHRoYXQuZGF0YS5pc1ByZXNlbnQgPT0gMSl7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5wcmljZU51bSkuaHRtbCgn6Z2e5Y2W5ZOBJyk7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5zdHlsZUl0ZW0pLnJlbW92ZUNsYXNzKCdhY3RpdmUnKS5hZGRDbGFzcygnb2ZmJyk7XHJcbiAgICAgICAgICAgIC8v6Kej57uR5LqL5Lu277yM56aB5q2i54K55Ye7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS51bmJpbmQoJ2NsaWNrJywgdGhhdC5zZWxlY3RTdHlsZUhhbmRsZXIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkucHJpY2VOdW0pLmh0bWwoJyZ5ZW47JytwcmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNrdUNoZWNrSXNWaXA6IGZ1bmN0aW9uKHNrdSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBkaXNjb3VudCA9IHNrdS5kYXRhKCdkaXNjb3VudCcpLFxyXG4gICAgICAgICAgICBpc1ZpcCA9IHNrdS5kYXRhKCdpcy12aXAnKTtcclxuICAgICAgICBpZiAoaXNWaXAgPT0gMSkge1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkudmlwSWNvbikuYWRkQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS5kaXNjb3VudEljb24pLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgICAgICAkKHRoYXQuVUkucHJvbW90aW9uQmFyKS5oaWRlKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQodGhhdC5VSS52aXBJY29uKS5yZW1vdmVDbGFzcygnb24nKTtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLnByb21vdGlvbkJhcikuc2hvdygpO1xyXG4gICAgICAgICAgICBpZiAoZGlzY291bnQgIT0gMTAgKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQuVUkuZGlzY291bnRJY29uKS5hZGRDbGFzcygnb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBza3VDaGVja0NhblJlZnVuZDogZnVuY3Rpb24oc2t1KXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIHNrdUNhblJlZnVuZCA9IHNrdS5kYXRhKCdza3UtY2FuLXJlZnVuZCcpO1xyXG4gICAgICAgIGlmKHNrdUNhblJlZnVuZCA9PSAwKVxyXG4gICAgICAgICAgICAkKHRoYXQuVUkuY2FuUmVmdW5kVGlwcykuc2hvdygpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgJCh0aGF0LlVJLmNhblJlZnVuZFRpcHMpLmhpZGUoKTtcclxuICAgIH0sXHJcbiAgICBhZGRUb0NhcnQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGhhdCA9IGRldGFpbDtcclxuICAgICAgICB2YXIgc2t1SWQgPSAkKHRoYXQuVUkuc3R5bGVJdGVtKycuYWN0aXZlJykuZGF0YSgnc2t1LWlkJyk7XHJcbiAgICAgICAgdmFyIG51bSA9ICQodGhhdC5VSS5zaXplSXB0KS52YWwoKTtcclxuICAgICAgICBpZighc2t1SWQpIHtcclxuICAgICAgICAgICAgbGF5ZXIub3Blbih7Y29udGVudDon6K+36YCJ5oup5qy+5byPJ30pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJ2J1eS5waHA/Yz1jYXJ0JmE9YWRkJyxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCAgXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHRoYXQuZGF0YS5waWQsIFxyXG4gICAgICAgICAgICAgICAgc2t1X2lkOiBza3VJZCwgXHJcbiAgICAgICAgICAgICAgICBudW1zOiBudW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuY29kZSA9PSAyMDAyKXtcclxuICAgICAgICAgICAgICAgIGxvZ2luLmluaXQoe1xyXG4gICAgICAgICAgICAgICAgICAgICdoZWFkZXJSZWcnOnRoYXQuVUkuaGVhZGVyUmVnLFxyXG4gICAgICAgICAgICAgICAgICAgICdoZWFkZXJMb2dpbic6dGhhdC5VSS5oZWFkZXJMb2dpbixcclxuICAgICAgICAgICAgICAgICAgICAnbG9nUmVnV3JhcCc6dGhhdC5VSS5sb2dSZWdXcmFwLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6J2xvZ2luJ1xyXG4gICAgICAgICAgICAgICAgfSx0aGF0LnN1Y2Nlc3NDYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihkYXRhLmNvZGUgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnBpY0ZseSgpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGxheWVyLm9wZW4oe2NvbnRlbnQ6ZGF0YS5yZXN1bHR9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgYnV5Tm93OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSBkZXRhaWw7XHJcbiAgICAgICAgdmFyIHNrdUlkID0gJCh0aGF0LlVJLnN0eWxlSXRlbSsnLmFjdGl2ZScpLmRhdGEoJ3NrdS1pZCcpO1xyXG4gICAgICAgIHZhciBudW0gPSAkKHRoYXQuVUkuc2l6ZUlwdCkudmFsKCk7XHJcbiAgICAgICAgaWYoIXNrdUlkKSB7XHJcbiAgICAgICAgICAgIGxheWVyLm9wZW4oe2NvbnRlbnQ6J+ivt+mAieaLqeasvuW8jyd9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKFwiI2NfYnV5X25vd19udW1zXCIpLnZhbChudW0pO1xyXG4gICAgICAgICQoXCIjY19idXlfbm93X2lkXCIpLnZhbCh0aGF0LmRhdGEucGlkKTtcclxuICAgICAgICAkKFwiI2NfYnV5X25vd19za3VfaWRcIikudmFsKHNrdUlkKTtcclxuICAgICAgICAkKCcjY19idXlfbm93X2Zvcm0nKS5zdWJtaXQoKTtcclxuICAgIH0sXHJcbiAgICBwaWNGbHk6ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGhhdCA9IGRldGFpbDtcclxuICAgICAgICB2YXIgc3RhcnRUb3AgPSAkKHRoYXQuVUkuYWRkQ2FydCkub2Zmc2V0KCkudG9wLFxyXG4gICAgICAgICAgICBzdGFydExlZnQgPSAkKHRoYXQuVUkuYWRkQ2FydCkub2Zmc2V0KCkubGVmdCxcclxuICAgICAgICAgICAgZW5kVG9wID0gJCh0aGF0LlVJLmhlYWRDYXJ0KS5vZmZzZXQoKS50b3AsXHJcbiAgICAgICAgICAgIGVuZExlZnQgPSAkKHRoYXQuVUkuaGVhZENhcnQpLm9mZnNldCgpLmxlZnQ7XHJcbiAgICAgICAgICAgICQoJzxpbWcgaWQ9XCJjeWNfZmx5X2ljb25cIiBzcmM9JyskKCcjZmx5SWNvblVybCcpLnZhbCgpKyc+JywgeydjbGFzcyc6ICdwaWNmbHknfSlcclxuICAgICAgICAgICAgLmNzcyh7IHRvcDogc3RhcnRUb3AsbGVmdDogc3RhcnRMZWZ0ICxwb3NpdGlvbjonYWJzb2x1dGUnfSlcclxuICAgICAgICAgICAgLmFwcGVuZFRvKCdib2R5JylcclxuICAgICAgICAgICAgLmFuaW1hdGUoXHJcbiAgICAgICAgICAgICAgICB7IHRvcDogZW5kVG9wLCBsZWZ0OiBlbmRMZWZ0LCBvcGFjaXR5OiAnMC45J30sXHJcbiAgICAgICAgICAgICAgICA3MDAsIFxyXG4gICAgICAgICAgICAgICAgJ3N3aW5nJywgXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICdidXkucGhwP2M9Y2FydCZhPWdldFNrdUNvdW50cycsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgJCh0aGF0LlVJLmhlYWRDYXJ0TnVtcykuc2hvdygpLnRleHQoZGF0YS5yZXN1bHQpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc3VjY2Vzc0NiIDogZnVuY3Rpb24ob3B0KXtcclxuICAgICAgICAkKG9wdC5oZWFkZXJSZWcpLnJlbW92ZSgpO1xyXG4gICAgICAgICQob3B0LmhlYWRlckxvZ2luKS5yZW1vdmUoKTtcclxuICAgICAgICB2YXIgYXJyID0gWyc8YSBocmVmPVwiaS5waHBcIiBjbGFzcz1cImN5Y190b29sc19pdGVtXCIgdGFyZ2V0PVwiX2JsYW5rXCI+55So5oi35Lit5b+DPC9hPicsJzxhIGhyZWY9XCJpLnBocD9jPWxvZ2luJmE9bG9nb3V0P2M9bG9naW4mYT1sb2dvdXRcIiBjbGFzcz1cImN5Y190b29sc19pdGVtXCIgPumAgOWHujwvYT4nXTtcclxuICAgICAgICAkKG9wdC5sb2dSZWdXcmFwKS5hcHBlbmQoYXJyLmpvaW4oJycpKTtcclxuICAgIH0sXHJcbiAgICAvLyDmlLbol4/llYblk4FcclxuICAgIGZhdlByb2R1Y3Q6ZnVuY3Rpb24ocGlkLGZhdil7XHJcbiAgICAgICAgdmFyIHRoYXQgPSBkZXRhaWw7XHJcbiAgICAgICAgdmFyIHVybCA9ICFmYXY/ICdpbmRleC5waHA/Yz1mYXYmYT1hZGRQcm9kdWN0JzonaW5kZXgucGhwP2M9ZmF2JmE9ZGVsZXRlUHJvZHVjdCc7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogcGlkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuY29kZT09MjAwKXtcclxuICAgICAgICAgICAgICAgICQoJyNjX2NvbW1fZGlhbG9nX21hc2snKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkKCcuY19jb21tX2RpYWxvZycpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB3aW5kb3cuc2Nyb2xsWSsxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDonNDUlJ1xyXG4gICAgICAgICAgICAgICAgfSkuc2hvdygpOyBcclxuICAgICAgICAgICAgICAgICQoJyNjX2NvbW1fZGlhbG9nX2ljb24nKS5hZGRDbGFzcygnY29tbV9yaWdodF9pY29uJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuY3ljX2NvbW1fZGlhbG9nX3RleHQnKS50ZXh0KGRhdGEucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHZhciBpc0ZhdiA9IHBhcnNlSW50KGZhdik/MDoxO1xyXG4gICAgICAgICAgICAgICAgJCh0aGF0LlVJLmZhdlByb2R1Y3QpLmRhdGEoJ2ZhdicsaXNGYXYpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAn5pS26JePJztcclxuICAgICAgICAgICAgICAgIGlmKGlzRmF2KXtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJ+WPlua2iOaUtuiXjyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQuVUkuZmF2UHJvZHVjdCkudGV4dCh0ZXh0KTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoZGF0YS5jb2RlPT0zMDAxIHx8IGRhdGEuY29kZT09MjAwMiApe1xyXG4gICAgICAgICAgICAgICAgbG9naW4uaW5pdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlclJlZyc6dGhhdC5VSS5oZWFkZXJSZWcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlckxvZ2luJzp0aGF0LlVJLmhlYWRlckxvZ2luLFxyXG4gICAgICAgICAgICAgICAgICAgICdsb2dSZWdXcmFwJzp0aGF0LlVJLmxvZ1JlZ1dyYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTonbG9naW4nXHJcbiAgICAgICAgICAgICAgICB9LHRoYXQuc3VjY2Vzc0NiKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAkKCcjY19jb21tX2RpYWxvZ19tYXNrJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2NfY29tbV9kaWFsb2dfaWNvbicpLmFkZENsYXNzKCdjb21tX3dhcm1faWNvbicpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmN5Y19jb21tX2RpYWxvZ190ZXh0JykudGV4dChkYXRhLnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjY19jb21tX2RpYWxvZ19tYXNrJykuc2hvdygpO1xyXG4gICAgICAgICAgICAkKCcjY19jb21tX2RpYWxvZ19pY29uJykuYWRkQ2xhc3MoJ2NvbW1fd2FybV9pY29uJyk7XHJcbiAgICAgICAgICAgICQoJy5jeWNfY29tbV9kaWFsb2dfdGV4dCcpLnRleHQoJ+WViuWTpu+8jOe9kee7nOmUmeivr++8jOivt+eojeWQjuWGjeivlScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldENvdXBvbjogZnVuY3Rpb24oY291cG9uSWQpe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgY291cG9uVXJsID0gdGhhdC5VcmwuY291cG9uVXJsO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogY291cG9uVXJsLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGNvdXBvbl9hY3RfaWQ6IGNvdXBvbklkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZG9uZShmdW5jdGlvbihydG5EYXRhKSB7XHJcbiAgICAgICAgICAgaWYoIHJ0bkRhdGEuY29kZT09MjAwMiApe1xyXG4gICAgICAgICAgICAgICAgbG9naW4uaW5pdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlclJlZyc6dGhhdC5VSS5oZWFkZXJSZWcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlckxvZ2luJzp0aGF0LlVJLmhlYWRlckxvZ2luLFxyXG4gICAgICAgICAgICAgICAgICAgICdsb2dSZWdXcmFwJzp0aGF0LlVJLmxvZ1JlZ1dyYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTonbG9naW4nXHJcbiAgICAgICAgICAgICAgICB9LHRoYXQuc3VjY2Vzc0NiKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBsYXllci5vcGVuKHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBydG5EYXRhLnJlc3VsdFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxheWVyLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogJ+mihuWPluWksei0pe+8jOivt+mHjeaWsOWGjeivlSdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIHNob3dTa3VJbWc6IGZ1bmN0aW9uIChza3VVcmwpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGxhcmdlUGljQSA9ICQodGhhdC5VSS5sYXJnZVBpY0EpO1xyXG4gICAgICAgIHZhciBsYXJnZVBpYyA9IGxhcmdlUGljQS5maW5kKCdpbWcnKTtcclxuICAgICAgICBsYXJnZVBpY0EuYXR0cignaHJlZicsc2t1VXJsKTtcclxuICAgICAgICBsYXJnZVBpYy5hdHRyKCdzcmMnLCBza3VVcmwpO1xyXG4gICAgfSxcclxuICAgIHJlY29yZFByb2R1Y3RJZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgc3RvcmVkUGlkID0gc3RvcmUuZ2V0KCdwcm9kdWN0X2lkJyk7XHJcbiAgICAgICAgaWYgKCBzdG9yZWRQaWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcGlkcyA9IFtdO1xyXG4gICAgICAgICAgICBwaWRzLnB1c2godGhhdC5kYXRhLnBpZCk7XHJcbiAgICAgICAgICAgIHN0b3JlLnNldCgncHJvZHVjdF9pZCcsIHBpZHMpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB2YXIgZXF1YWxWYWx1ZSA9IHRoYXQuZXF1YWxDb21wYXJlKHN0b3JlZFBpZCwgdGhhdC5kYXRhLnBpZCk7Ly/liKTmlq3mmK/lkKborrDlvZXov4fkuoZcclxuICAgICAgICAgICAgaWYgKGVxdWFsVmFsdWUgPT0gJ2VxdWFsJykge1xyXG4gICAgICAgICAgICAgICAgaWYoIHN0b3JlZFBpZC5sZW5ndGggPj0gMjAgKSB7Ly/plb/luqbkuLoyMOeahHBpZOmYn+WIl1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFBpZC5wb3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwaWRzID0gc3RvcmVkUGlkO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciBwaWRzID0gdGhhdC5kZWxBcnJheUVsZW1lbnQoc3RvcmVkUGlkLCBlcXVhbFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwaWRzLnVuc2hpZnQodGhhdC5kYXRhLnBpZCk7XHJcbiAgICAgICAgICAgIHN0b3JlLnNldCgncHJvZHVjdF9pZCcsIHBpZHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBlcXVhbENvbXBhcmU6IGZ1bmN0aW9uICggYXJyYXksIHBpZCApIHtcclxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGFycmF5W2ldID09IHBpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiAnZXF1YWwnO1xyXG4gICAgfSxcclxuICAgIGRlbEFycmF5RWxlbWVudDogZnVuY3Rpb24gKGFycmF5LCBpKSB7XHJcbiAgICAgICAgYXJyYXkgPSBhcnJheS5zbGljZSgwLGkpLmNvbmNhdChhcnJheS5zbGljZShpKzEpKTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG4gICAgY2l0eUNob29zZWQ6IGZ1bmN0aW9uKGNpdHlOYW1lLCBjaXR5Q29kZSwgcHJvdk5hbWUpe1xyXG4gICAgICAgIHZhciB0aGF0ID0gc2VsZWN0Q2l0eTtcclxuICAgICAgICAkKHRoYXQuVUkuY2l0eVRhYikudGV4dChjaXR5TmFtZSk7XHJcbiAgICAgICAgdmFyIGFkZHJlc3MgPSBwcm92TmFtZSArICcgJyArIGNpdHlOYW1lO1xyXG4gICAgICAgICQodGhhdC5VSS5zZWxlY3RWYWx1ZSkudGV4dChhZGRyZXNzKTtcclxuICAgICAgICB0aGF0LnBvc3RNYXJnaW5TZXQoKTtcclxuICAgICAgICBpZiggJCh0aGF0LlVJLnRyaWdnZXJCdG4pLmNzcygncG9zaXRpb24nKSA9PSAnYWJzb2x1dGUnICkge1xyXG4gICAgICAgICAgICB0aGF0LmFkZHJUcmlnZ2VyQnRuQWRqdXN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQodGhhdC5VSS5zZWxlY3RQYW5lbCkucmVtb3ZlQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgJCh0aGF0LlVJLnRyaWdnZXJCdG4pLnJlbW92ZUNsYXNzKCdvbicpO1xyXG5cclxuICAgICAgICB2YXIgcGFyYW1zID0ge1xyXG4gICAgICAgICAgICAnY2l0eV9jb2RlJzogY2l0eUNvZGUsXHJcbiAgICAgICAgICAgICdzdXBwbGllcl9jb2RlJzogJCgnI0pfc3VwcGxpZXJfY29kZScpLnZhbCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICdpbmRleC5waHA/Yz1hZGRyZXNzJmE9Z2V0QXJlYUZyZWlnaHQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihydG5EYXRhKXtcclxuICAgICAgICAgICAgICAgICQoJy5jX2FkZHJfcG9zdGFnZScpLnRleHQocnRuRGF0YS5yZXN1bHQuZnJlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBpZiggcnRuRGF0YS5yZXN1bHQuZnJlaWdodF9taW4gIT0gOTk5OTk5KXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuY19zdXBwbGllcl9wb3N0YWdlX2ZyZWUnKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNfc3VwcGxpZXJfcG9zdGFnZV9mcmVlJykudGV4dChydG5EYXRhLnJlc3VsdC5mcmVpZ2h0X21pbik7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuY19zdXBwbGllcl9wb3N0YWdlX2ZyZWUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZXRhaWwuYWRqdXN0VUkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc2V0QWRkclRleHQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwcm92TmFtZSA9ICfljJfkuqwnLCBjaXR5TmFtZSA9ICfljJfkuqzluIInLCBjaXR5Q29kZSA9IDEzMTtcclxuICAgICAgICBpZiAoIGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvY3ljX3Byb3ZpbmNlX25hbWUvKSl7XHJcbiAgICAgICAgICAgIHByb3ZOYW1lPSBkb2N1bWVudC5jb29raWUubWF0Y2goL2N5Y19wcm92aW5jZV9uYW1lPVteeDAwLXhmZl17MCwyMH0vKVswXS5zcGxpdCgnPScpWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvY3ljX2NpdHlfbmFtZS8pKXtcclxuICAgICAgICAgICAgY2l0eU5hbWUgPSBkb2N1bWVudC5jb29raWUubWF0Y2goL2N5Y19jaXR5X25hbWU9W154MDAteGZmXXswLDIwfS8pWzBdLnNwbGl0KCc9JylbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggZG9jdW1lbnQuY29va2llLm1hdGNoKC9jeWNfY2l0eV9jb2RlLykpe1xyXG4gICAgICAgICAgICBjaXR5Q29kZSA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvY3ljX2NpdHlfY29kZT1bXFxkXXsxLDZ9LylbMF0uc3BsaXQoJz0nKVsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdC5jaXR5Q2hvb3NlZCggY2l0eU5hbWUsIGNpdHlDb2RlLCBwcm92TmFtZSk7XHJcbiAgICB9LFxyXG4gICAgYWRqdXN0VUk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy/osIPmlbTlnLDlnYDmjInpkq7lkI7pgq7otLnmj5DnpLrkvY3nva5cclxuICAgICAgICB2YXIgdyA9ICQoJy5jX2FkZHJlc3Nfc2VsX3RyaWdnZXInKS53aWR0aCgpICsgMTg7XHJcbiAgICAgICAgJCgnLmNfYWRkcl9wb3N0YWdlX3dyYXAnKS5jc3MoJ21hcmdpbkxlZnQnLHcpO1xyXG4gICAgICAgICQoJy5jX2FkZHJlc3Nfd3JhcCcpLmNzcygncGFkZGluZ1JpZ2h0JywgMCk7XHJcbiAgICB9LFxyXG4gICAgcmVkZW1Hb29kc0xpc3Q6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHN1cHBsaWVyQ29kZSA9ICQoJyNKX3N1cHBsaWVyX2NvZGUnKS52YWwoKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICdpbmRleC5waHA/Yz1wYWdlJmE9Z2V0RnVsbFRyYWRlTGlzdCcsXHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBzdXBwbGllcl9jb2RlOiBzdXBwbGllckNvZGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocnRuRGF0YSl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHJ0bkRhdGEuY29kZSA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5jeWNfZ29vZHNfaXRlbScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbC5yZW5kZXJSZWRlbVZpZXcocnRuRGF0YS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5kZXRhaWwuaW5pdCgpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGRldGFpbDtcclxuIl19
