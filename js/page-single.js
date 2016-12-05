/**
 * Created by aser on 16/12/5.
 * 图片滑动的升级版,可以用于图片滑动,或制作单页应用.
 */

var pageSingle = function (opt) {
    var warp, pages, index, isReady = false, isLock = false, baritems = [];
    var onStenp;

    function init(warp, slides, barItems) {

        warp = warp;
        if (slides.length > 0) {
            pages = slides;
            isReady = true;
            index = 0;
            aimateListener(pages);

            warp.on("touchmove",function(){return false;}).on("drag", function (a, b, c) {

                console.log(a, b, c);
            }).on("drop", function (e, b, c) {
                e.preventDefault();
                console.log("drag",e, b, c);
            });
        }
        baritems = barItems || baritems;
    }

    function aimateListener(pages) {
        var isWebkit = 'WebkitAppearance' in document.documentElement.style || typeof document.webkitHidden != "undefined";

        pages.each(function (i, v) {
            var eventName = isWebkit ? 'webkitAnimationEnd' : 'animationend';
            $(v)[0].addEventListener(eventName, function () {
                $(this).removeClass("slide");
                if ($(this).hasClass("out")) {
                    $(this).addClass("hide");
                } else {
                    $(this).removeClass("hide");
                }
                $(this).removeClass("out").removeClass("in").removeClass("reverse");
                isLock = false;
            })
        })
    }

    function next() {
        var nidx = index < pages.length - 1 ? index + 1 : 0;
        if (isReady && !isLock) {
            isLock = true;


            $(pages[nidx]).removeClass("hide").removeClass("out").addClass("in").addClass("slide");
            $(pages[index]).offsetWidth = $(pages[index]).offsetWidth;
            $(pages[index]).addClass("out").addClass("slide");


            index = nidx;
            bar();
        }

    }

    function perv() {
        var nidx = index >= 1 ? index - 1 : pages.length - 1;
        if (isReady && !isLock) {
            isLock = true;
            $(pages[nidx]).removeClass("hide").addClass("in").addClass("reverse").addClass("slide");
            $(pages[index]).offsetWidth = $(pages[index]).offsetWidth;
            $(pages[index]).addClass("reverse").addClass("out").addClass("slide");
            index = nidx;
            bar();
        }
    }

    function bar() {
        if (Object.prototype.toString.call(baritems) == "[object Array]" && baritems.length > 0) {
            baritems.removeClass("hover").eq(index).addClass("hover");
        }

    }

    void function ctor() {
        if (opt && opt.warp && opt.slides) {
            init(opt.warp,opt.slides,opt.barItems);
        }
    }();

    return {
        init: init,
        next: next,
        perv: perv
    }

}
//)