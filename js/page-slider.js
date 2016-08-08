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
      lastModel = null,
      transLock = false;

    var _Event = {
        onPageStart: null,
        onPageEnd: null
    };

    var type = Object.prototype.toString;


    function _makeDiv(cls) {
        return "<div class='" + cls + "'></div>"
    }

    /**
     *事件监听
     **/
    function _eventListener(pages, eventName, callback) {
        //webkit支持webkitAnimationEnd这样的事件.A和E/S大写
        var isWebkit = 'WebkitAppearance' in document.documentElement.style || typeof document.webkitHidden != "undefined";
        eventName = isWebkit ? "webkit" + eventName.replace(/^a|s|e/g, function (matchs) {
            return matchs.toUpperCase();
        }) : eventName;

        pages.each(function (i, v) {

            $(v)[0].addEventListener(eventName, function () {
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
                    var title = "";
                    data = data.replace(/\<meta [^>]+\>/g, "");
                    data = data.replace(/\<title\>[^<]{0,}\<\/title\>/, function (matches) {
                        title = matches.replace("<title>", "").replace("</title>", "");
                        return "";
                    });
                    data = data.replace(/\<[^>]{1,}data-remove[^>]{0,}\>[^>]{1,}\>/g, "");

                    callback.call(null, data, title);
                }
            }
        });
    }

    /**
     * 加载页面js(已过时)
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
     * 加载js文件,并创建一个随机函数名的函数
     * 函数内容为js内容
     * 最后执行该函数
     * 如果函数内包含ready方法,则执行ready()
     * */
    function _jsLoader(url, page, callback) {
        //return

        var jsname = url.replace('.html', '.js');
        $.get(jsname, function (data) {
            var fnName = roundName();
            data = "function " + fnName + "(){" + data + " ; if(typeof ready=='function'){ready();}};"
            data += fnName + "();";
            $(page).append("<script>" + data + "</script>");

            if (type.call(callback) == "[object Function]") {
                callback.call();
            }
        });

        function roundName() {
            var keys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
            var nl = (Math.random(0) * 7).toFixed(0);
            var fnName = "_page_";
            for (var i = 0; i < nl; i++) {
                fnName += keys[(Math.random(0) * 26).toFixed(0)];
            }

            return fnName;
        }

    }

    /**
     * 添加历史记录
     * */
    function _history(url, data, hasScript, title) {
        if (type.call(url) == "[object Object]") {
            hasScript = url.hasScript;
            data = url.data;
            url = url.url;
            title = url.title;
        }
        lastModel = {url: url, data: data, hasScript: hasScript, title: title};
        history.push({url: url, data: data, hasScript: hasScript, title: title});
    }

    /**
     * 新页面事件绑定
     * 为有data-page属性的元素添加事件绑定
     * **/
    function _newPageEventBind(custPage) {
        custPage.find("[data-page]").forEach(function (v, i) {
            var that = $(v);
            var link = that.attr("data-page");

            if (link.length > 0 && link != "goback()") {
                var hasScript = that.attr("data-hasScript");
                that.on("click", function () {
                    _transToPage(link, null, hasScript);
                });
            } else if (link == "goback()") {
                that.on("click", function () {
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
    function _transToPage(url, data, hasScript) {
        if (transLock) return;

        if (type.call(data) == "[object Boolean]") {
            hasScript = data;
            data = null;
        }
        if (lastModel && lastModel.url == url && lastModel.data == data && lastModel.hasScript == hasScript) {

            var nidx = index == 2 ? 0 : index + 1;
            $(pages[nidx]).removeClass("hide").addClass("in").addClass("slide");
            $(pages[index]).addClass("out").addClass("slide")
            index = nidx;
            document.title = lastModel.title;
            _history(lastModel);
            return;
        }

        _loadPage(url, data, function (res, title) {

            var nidx = index == 2 ? 0 : index + 1;

            $(pages[nidx]).removeClass("hide").addClass("in").addClass("slide").html("");
            $(pages[index]).addClass("out").addClass("slide");
            $(pages[nidx]).html(res);

            _newPageEventBind($(pages[nidx]));
            index = nidx;
            document.title = title;

            if (hasScript)
                _jsLoader(url, pages[nidx]);

            _history(url, data, hasScript, title);
        });


    }

    /**
     * 返回前一页面
     * */
    function _goBack() {
        if (transLock) return;

        if (history.length > 1) {
            lastModel = history.pop();
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
                    _newPageEventBind($(pages[index]));

                    if (model.hasScript)
                        _jsLoader(model.url, pages[index]);
                    document.title = model.title;
                });
            }
            return true
        }
        return false

    }

    function _init(container, url, hasScript) {
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
        _loadPage(url, null, function (res, title) {

            $(pages[index]).html(res);
            _newPageEventBind($(pages[index]));

            document.title = title;

            if (hasScript) {
                //_runJs(url);
                _jsLoader(url, pages[index]);
            }

            _history(url, null, hasScript, title);
        });


    }

    return {
        ready: function (options) {

            if (options.el && options.url) {
                _init(options.el, options.url, options.hasScript);
            }

            _Event.onPageEnd = options.onPageEnd;
            _Event.onPageStart = options.onPageStart;


        },
        transToPage: _transToPage,
        goBack: _goBack
    }
}
/**
 * html节点属性说明
 * *****************************************************
 *
 * data-page            : 点击跳转到对应页面
 * data-hasScript=true  : 加载与页面同名且同路径的js文件
 * data-remove          : 页面加载时不加载该节点
 *
 * */