/**
 * Created by aser on 16/12/5.
 * 图片滑动的升级版,可以用于图片滑动,或制作单页应用.
 */

var pageSingle = function (opt) {

    var _single = {
        warp: null,
        pages: null,
        index: null,
        isReady: false,
        isLock: false,
        touchTimes: 0,
        baritems: []
    };
    var base = {
        xWidth: window.innerWidth
    }
    var onStenp;

    function init(warp, slides, barItems) {

        _single.warp = warp;
        if (slides.length > 0) {
            _single.pages = slides;
            _single.isReady = true;
            _single.index = 0;
            //aimateListener(_single.pages);


        }
        _single.baritems = barItems || _single.baritems;

        document.body.addEventListener("touchmove",  function (e) {
            e.preventDefault();
        });
    }

    //function aimateListener(pages) {
    //    var isWebkit = 'WebkitAppearance' in document.documentElement.style || typeof document.webkitHidden != "undefined";
    //
    //    pages.each(function (i, v) {
    //        var eventName = isWebkit ? 'webkitAnimationEnd' : 'animationend';
    //        $(v)[0].addEventListener(eventName, function () {
    //            $(this).removeClass("slide");
    //            if ($(this).hasClass("out")) {
    //                $(this).addClass("hide");
    //            } else {
    //                $(this).removeClass("hide");
    //            }
    //            $(this).removeClass("out").removeClass("in").removeClass("reverse");
    //            _single.isLock = false;
    //        })
    //    })
    //}

    function next() {
        var nidx = _single.index < _single.pages.length - 1 ? _single.index + 1 : 0;
        if (_single.isReady && !_single.isLock) {
            _single.isLock = true;


            //$(_single.pages[nidx]).removeClass("hide").removeClass("out").addClass("in").addClass("slide");
            //$(_single.pages[_single.index]).offsetWidth = $(_single.pages[_single.index]).offsetWidth;
            //$(_single.pages[_single.index]).addClass("out").addClass("slide");


            _single.index = nidx;
            bar();
        }

    }

    function perv() {
        var nidx = _single.index >= 1 ? _single.index - 1 : _single.pages.length - 1;
        if (_single.isReady && !_single.isLock) {
            _single.isLock = true;

            //$(_single.pages[nidx]).removeClass("hide").addClass("in").addClass("reverse").addClass("slide");
            //$(_single.pages[_single.index]).offsetWidth = $(_single.pages[_single.index]).offsetWidth;
            //$(_single.pages[_single.index]).addClass("reverse").addClass("out").addClass("slide");

            _single.index = nidx;
            bar();
        }
    }

    function bar() {
        if (Object.prototype.toString.call(_single.baritems) == "[object Array]" && _single.baritems.length > 0) {
            _single.baritems.removeClass("hover").eq(_single.index).addClass("hover");
        }

    }

    function onSwipe(offset) {

        if (_single.isLock) return;
        var isright = offset <= 0;


        var nidx = _single.index < _single.pages.length - 1 ? _single.index + 1 : 0;
        nidx = isright ? nidx : _single.index >= 1 ? _single.index - 1 : _single.pages.length - 1;

        var custPage = $(_single.pages[_single.index]);
        var nextPage = $(_single.pages[nidx]);


        nextPage.css({"transform": "translate3d(" + (isright ? (base.xWidth + offset) : (0 - base.xWidth + offset)) + "px,0,0)"});
        custPage.css({"transform": "translate3d(" + offset + "px,0,0)"});
        //$(_single.pages[_single.index]).offsetWidth = $(_single.pages[_single.index]).offsetWidth;
        nextPage.removeClass("hide");
    }

    function onSwipeEnd(offset) {
        if (_single.isLock) return;

        var isright = offset <= 0;


        var nidx = _single.index < _single.pages.length - 1 ? _single.index + 1 : 0;
        nidx = isright ? nidx : _single.index >= 1 ? _single.index - 1 : _single.pages.length - 1;

        var custPage = $(_single.pages[_single.index]);
        var nextPage = $(_single.pages[nidx]);

        if (Math.abs(offset) >= 30) {
            isright ? next() : perv();
            _single.isLock = true;
            _single.index = nidx;
            pageAnimate(custPage, nextPage, isright ? 0 - base.xWidth : base.xWidth);
            return;
        }else{
            custPage.css({translation:'all 1s','-webkit-translation':'all 1s'});
            nextPage.css({translation:'all 1s','-webkit-translation':'all 1s'});

            custPage.offsetWidth = custPage.offsetWidth;
            custPage.removeAttr('style');
            nextPage.removeAttr('style');


        }
    }

    function onSwipeStart() {
        //_single.touchTimes = 0;
    }


    function pageAnimate(custObj, nextObj, offset) {
        custObj.animate(
          {
              transform: 'translate3d(' + offset + 'px,0,0)',
              '-webkit-transform': 'translate3d(' + offset + 'px,0,0)'

          },
          {
              complete: function () {
                  custObj.addClass("hide");
                  custObj.removeAttr("style");
                  _single.isLock = false;
              },
              duration: 300
          });

        nextObj.animate(
          {
              transform: "translate3d(0,0,0)"
          }, 300);
    }

    void function ctor() {
        if (opt && opt.warp && opt.slides) {
            init(opt.warp, opt.slides, opt.barItems);
        }

        //集成swipe
        if (opt.disableSwipe != false) {
            new eventSwiper({
                obj: opt.warp,
                onSwipe: function (e) {
                    onSwipe(this.offset);
                },
                onSwipeEnd: function () {
                    onSwipeEnd(this.offset);
                },
                onSwipeStart: function () {
                    onSwipeStart();
                }
            });
        }
    }();

    return {
        init: init,
        next: next,
        perv: perv,
        state: _single
    }

}
//)