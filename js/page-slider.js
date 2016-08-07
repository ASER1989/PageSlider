/**
 * Created by aser on 16/8/5.
 */
;'use strict';
define(['zepto'], function ($) {
    return pageSlider($)
});


var pageSlider = function ($) {
    var index = 1,
      pages,
      history = [],
      lastModel =null,
      transLock =false;

    var _Event={
        onPageStart:null,
        onPageEnd:null
    } ;

    var type = Object.prototype.toString;


    function _makeDiv(cls) {
        return "<div class='" + cls + "'></div>"
    }

    /**
     *事件监听
     **/
    function _eventListener(pages, eventName, callback) {
        var isWebkit = 'WebkitAppearance' in document.documentElement.style || typeof document.webkitHidden != "undefined";
        pages.each(function (i, v) {
//                animationstart
//            var eventName = isWebkit?'webkitAnimationend':'animationend';

            $(this)[0].addEventListener(eventName, function () {

                if (type.call(callback) == "[object Function]") {
                    callback.call(this);
                }
            })
        })
    }

    function _pageEndcallBack() {

        var that = $(this);


        that.removeClass("slide");

        if (that.hasClass("out")) {
            that.addClass("hide");
        } else {
            that.removeClass("hide");
        }

        that.removeClass("out").removeClass("in").removeClass("reverse");

        if (type.call(_Event.onPageEnd) == "[object Function]") {
            _Event.onPageEnd.call(this);
        }
        transLock = false;
    }

    function _pageStartCallBack() {
        transLock = true;
        if (type.call(_Event.onPageStart) == "[object Function]") {
            _Event.onPageStart.call(this);
        }

    }

    /**
     * 加载新页面
     * url:页面地址
     * data:可以用于ajax的data
     * callback:回调
     * */
    function _loadPage(url, data, callback) {
        if (type.call(data) == "[object Function]") {
            callback = data;
            data = null;
        }
        $.ajax({
            url: url,
            type: "GET",
            data: data,
            success: function (data) {
                if (type.call(callback) == "[object Function]") {
                    data = data.replace(/\<meta [^>]+\>/g,"");
                    data = data.replace(/\<title [^>]+\>/g,"");

                    callback.call(null, data);
                }
            }
        });
    }

    /**
     * 加载页面js
     * 并执行被加载文件的ready函数
     * 此处约定被加载文件与页面同名,且包含ready初始化函数,否则可能无法被执行
     * */
    function _runJs(url) {
        //return
        try {
            var jsname = url.replace('.html', '.js');
            require([jsname], function (pagejs) {
                pagejs.ready();
            }, function () {
                alert("error")
            });
        } catch (e) {

        }

    }

    /**
     * 添加历史记录
     * */
    function _history(url, data, hasScript) {
        if(type.call(url)=="[object Object]"){
            hasScript = url.hasScript;
            data = url.data;
            url = url.url;
        }
        lastModel ={url: url, data: data, hasScript: hasScript};
        history.push({url: url, data: data, hasScript: hasScript});
    }

    /**
     * 新页面事件绑定
     * 为有data-page属性的元素添加事件绑定
     * **/
    function _newPageEventBind(custPage){
        custPage.find("[data-page]").forEach(function(v,i){
            var that = $(v);
            var link = that.attr("data-page");

            if(link.length>0 && link !="goback()"){
                var hasScript = that.attr("data-hasScript");
                that.on("click",function(){
                    _transToPage(link,null,hasScript);
                });
            }else if(link == "goback()"){
                that.on("click",function(){
                    _goBack();
                });
            }

        });


    }
    /**
     * 跳转至新页面
     * 如果是后退后再次打开上次页面则直接使用上次加载的页面
     * (此处存在不准确判断 data==data ; 无法对对象进行对比.)
     * */
    function _transToPage (url, data, hasScript) {
        if(transLock) return;

        if (type.call(data) == "[object Boolean]") {
            hasScript = data;
            data = null;
        }
        if(lastModel && lastModel.url==url && lastModel.data==data && lastModel.hasScript ==hasScript){

            var nidx = index == 2 ? 0 : index + 1;
            $(pages[nidx]).removeClass("hide").addClass("in").addClass("slide");
            $(pages[index]).addClass("out").addClass("slide")
            index = nidx;

            _history(lastModel)
            return;
        }

        _loadPage(url, data, function (res) {

            var nidx = index == 2 ? 0 : index + 1;

            $(pages[nidx]).html(res).removeClass("hide").addClass("in").addClass("slide");
            $(pages[index]).addClass("out").addClass("slide")
            _newPageEventBind( $(pages[nidx]));
            index = nidx;

            if (hasScript)
                _runJs(url);
        });

        _history(url, data, hasScript);

    }
    /**
     * 返回前一页面
     * */
    function _goBack () {
        if(transLock) return;

        if (history.length > 1) {
            lastModel=history.pop();
            var model = history[history.length - 1];


            var nidx = index == 0 ? 2 : index - 1;

            $(pages[nidx]).removeClass("hide").addClass("in").addClass("reverse").addClass("slide");
            $(pages[index]).addClass("reverse").addClass("out").addClass("slide");

            index = nidx;

            if (model) {
                if (type.call(model.data) == "[object Boolean]") {
                    model.hasScript = model.data;
                    model.data = null;
                }
                _loadPage(model.url, model.data, function (res) {
                    $(pages[index]).html(res);
                    _newPageEventBind( $(pages[index]));

                    if (model.hasScript)
                        _runJs(model.url);
                });
            }
            return true
        }
        return false

    }
    function  _init(container, url, hasScript) {
        /**
         *容器初始化
         **/
        if (type.call(container) == "[object String]") {
            container = $(container);
        }

        //创建page容器
        var div = _makeDiv("page") + _makeDiv("page") + _makeDiv("page");
        container.append(div);

        container.find(".page").addClass("hide").eq(1).removeClass("hide");
        //容器事件监听
        pages = container.find(".page");
        _eventListener(pages, 'animationstart', _pageStartCallBack);
        _eventListener(pages, 'animationend', _pageEndcallBack);

        /**
         * 加载新页面
         * */
        _loadPage(url, null, function (res) {

            $(pages[index]).html(res);
            _newPageEventBind( $(pages[index]));

            if (hasScript) {
                _runJs(url);
            }


        });

        _history(url, null, hasScript);
    }

    return {
        ready: function (options) {

            if(options.el && options.url){
                _init(options.el,options.url,options.hasScript);
            }

            _Event.onPageEnd = options.onPageEnd;
            _Event.onPageStart = options.onPageStart;



        },
        transToPage: _transToPage,
        goBack: _goBack
    }
}