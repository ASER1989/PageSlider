/**
 * Created by aser on 16/11/18.
 * 工作原理:根据节点上的时间设定,添加或移除指定样式名称,实现动画效果
 * 参数说明
 * @n 父级元素选择器（如：id，class值）
 *
 * 属性说明
 * @data-move 当前节点需要执行动画
 * @data-delay 延迟时间,以毫秒为单位
 * @data-cls 需要添加的样式
 * @data-delCls 需要移除的样式
 *
 * 方法说明
 * @Fn: start 开始执行动画；可接受callback函数，动画队列执行完成后调用（仅队列执行完成，非动画执行完成）
 * @Fn: reset 动画回滚； 参数同上；
 */
var move = function (n) {

    var that = this,
        $ = selectorInit(),
        type = typeInit();

    var threads = [], reThreads = [];

    void function init() {
        var sel = "[data-move='true']";
        sel = n==null?sel:n+" "+sel;

        that.Els = $(sel);
        that.stime = +new Date();//开始时间

        that.Els.forEach(function (item) {
            var time = item.attr("data-delay") || 0;
            var cls = item.attr("data-cls");
            var delcls = item.attr("data-delCls");

            (cls || delcls) &&
            threads.push(new thread(function () {
                cls && item.addClass(cls);
                delcls && item.removeClass(delcls);
            }, time)) &&
            reThreads.push(new thread(function () {
                delcls && item.addClass(delcls);
                cls && item.removeClass(cls);
            }, time));
        });
    }(n);


    var start = function (callback) {
        var len = 0;
        threads.forEach(function (item) {
            item.start(function () {
                len++;
                len == threads.length && type.isFunction(callback) && callback.call();
            });
        });
    }
    var reset = function (callback) {
        var len = 0;
        reThreads.forEach(function (item) {
            item.start(function () {
                len++;
                len == threads.length && type.isFunction(callback) && callback.call();
            });
        });
    }

    /**
     * 工具类
     * **/
    function selectorInit() {
        var $ = function (n) {
            return document.querySelectorAll(n);
        };
        /**
         * 获取属性值
         * @n string
         * **/
        HTMLElement.prototype.attr = function (n) {
            return this.getAttribute(n);
        }
        /**
         * 添加样式
         * @n string||array
         * **/
        HTMLElement.prototype.addClass = function (n) {
            var el = this;
            var ns = n.split(",");
            type.isArray(ns) ? (void function () {
                ns.forEach(function (i) {
                    el.classList.add(i);
                });
            }()) : el.classList.add(n);

            return el;
        }

        /**
         * 移除样式
         * @n string||array
         * **/
        HTMLElement.prototype.removeClass = function (n) {
            var el = this;
            var ns = n.split(",");
            if (type.isArray(ns)) {
                ns.forEach(function (i) {
                    el.classList.remove(i);
                })
            } else {
                el.classList.remove(i);
            }
            return el;
        }

        NodeList.prototype.forEach = Array.prototype.forEach = function (fn) {
            var callback = function (obj, item, i) {
                var res = fn.call(obj, item, i);
                return res == null ? true : res;
            }
            for (var i = 0; i < this.length && callback(this[i], this[i], i); i++) {


            }
        }
        return $;
    }

    function typeInit() {
        var type = new function () {
            return Object.prototype.toString;
        };

        type.isFunction = function (obj) {
            return this.call(obj) === "[object Function]";
        };
        type.isString = function (obj) {
            return this.call(obj) === "[object String]";
        };
        type.isBoolean = function (obj) {
            return this.call(obj) === "[object Boolean]";
        };
        type.isArray = function (obj) {
            return this.call(obj) === "[object Array]";
        }
        return type;
    }

    function thread(fn, time) {
        var timer = null;

        function start(callback) {
            timer = setTimeout(function () {
                fn.call();
                type.isFunction(callback) && callback.call(null, time);
            }, time);
        }

        function end() {
            clearTimeout(timer);
        }

        return {
            start: start,
            end: end
        }
    }

    return {
        start: start,
        reset: reset
    }

}