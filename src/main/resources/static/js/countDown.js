/*
* 倒计时函数 TimeCountDown
* 
* @para { String } options 传入的参数 
* options.time 距离结束时间(毫秒) options.type 显示类型('ms'为显示到毫秒，不传则显示到秒)
* options.callback 业务处理的回调函数 options.end 倒计时结束触发的回调函数
*
*/
;(function (w) {
    var noop = function () {},
        offloadFn = function (fn) { setTimeout(fn || noop, 0) };
    
    TimeCountDown = function (options) {
        var _default = {
            end: noop
        };
        
        this.options = $.extend({}, _default, options);
        
        this.times = Number(options.time) || 0;
        
        this.init();
    };
    
    TimeCountDown.prototype.init = function () {
        this.setup();
    }
    
    TimeCountDown.prototype.setup = function () {
        if (this.options.type === 'ms') {
            // 显示到毫秒时的时间间隔 0.1s
            this.speed = 100;
        } else {
            // 显示到秒的时间间隔 1s
            this.speed = 1000;
        }
        this.time();
    }
        
    TimeCountDown.prototype.fillZero = function (num, digit) {
        var str = '' + num;
        digit = digit || 2;
        
        while (str.length < digit) {
            str = '0' + str;
        }
        return str;
    }
    
    TimeCountDown.prototype.time = function () {
        var result = null,
            _time = this.times,
            that = this;
            
        if (this.times === 0) {
            clearTimeout(this.timeId);
            offloadFn(this.options.end && this.options.end.call(this, result));
            return;
        }
        
        this.options.type === 'ms' ? (this.times -= 100) : (this.times -= 1000);
        
        result = {
            d: parseInt( this.times / (1000 * 60 * 60 * 24) ),
            h: parseInt( this.times / (1000 * 60 * 60)) % 24,
            m: parseInt( this.times / (1000 * 60)) % 60,
            s: parseInt( this.times / 1000) % 60,
            ms: parseInt( this.times / 100) % 10,
            last_times : this.times > 0 ? this.times : 0
        }
        
        offloadFn(this.options.callback && this.options.callback.call(this, result));
        
        this.timeId = setTimeout(function(){
            that.time();
            
        }, this.speed);
            
    }
    
    w.TimeCountDown = TimeCountDown;
    
    if (w.jQuery || w.Zepto) {
      (function($) {
        $.fn.timeCountDown = function(params) {
          return this.each(function() {
            $(this).data('timeCountDown', new TimeCountDown(params));
          });
        }
      })( w.jQuery || w.Zepto )
    }

})(window);