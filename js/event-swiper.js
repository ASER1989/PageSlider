/**
 * Created by aser on 16/12/5.
 */
var eventSwiper = function (opt) {
    //opt = obj, dir,onSwipeStart,onSwipe,onSwipeEnd;

    requestAnimationFrame = requestAnimationFrame || function (fn) {
          fn.call();
      };
    var nop = function () {
    };

    var _swiper = this;
    _swiper.warp = opt.obj;
    _swiper.dir = opt.dir || "htouch"; //默认横向-htocuh,纵向-vtouch
    _swiper.swipeStart = opt.onSwipeStart || nop;
    _swiper.swipe = opt.onSwipe || nop;
    _swiper.swipeEnd = opt.onSwipeEnd || nop;

    var _eventer = {
        slidswitch: 1,
        offset: 0,
        start: 0,
        end: 0
    }

    delete  opt.onSwipeStart;
    delete  opt.onSwipe;
    delete  opt.onSwipeEnd;

    ximi(_eventer, opt);


    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
      hasTouch = 'ontouchstart' in window && !isTouchPad;

    'on' in _swiper.warp ? _swiper.warp.addEventListener = _swiper.warp.on : void(0);

    _swiper.warp.addEventListener((hasTouch ? "touchstart" : "mousedown"), touchStart);
    _swiper.warp.addEventListener((hasTouch ? "touchend" : "mouseup"), touchEnd);
    _swiper.warp.addEventListener(hasTouch ? "touchmove" : "mousemove", touchMove);

    function getPosition(even) {

        return _swiper.dir == "vtouch" ? (hasTouch ? even.touches[0].pageY : even.pageY) :
          (hasTouch ? even.touches[0].pageX : even.pageX);
    }

    function touchStart(e) {
        _eventer.slidswitch = 0;

        var even = typeof event == "undefined" ? e : event;
        _eventer.offset = 0;
        _eventer.start = getPosition(even);
        _swiper.swipeStart.call(_eventer);
    };

    function touchEnd(e) {
        _swiper.swipeEnd.call(_eventer);
        _eventer.slidswitch = 1;
        _eventer.start = 0;
        _eventer.offset = 0;
    }

    function touchMove(e) {
        if (!_eventer.slidswitch) {
            var even = typeof event == "undefined" ? e : event;
            _eventer.end = getPosition(even);
            _eventer.offset = _eventer.end - _eventer.start;

            //run.call(_eventer);
            _swiper.swipe.call(_eventer);
        } else {
            touchStart(e);
        }
    }

    function ximi(a, b) {
        for (i in b) {
            a[i] = b[i];
        }
    }


    //function run() {
    //    this.offset = this.offset <= -522 ? this.offset + 522 : this.offset;
    //
    //    this.offset = this.offset >= 0 ? (this.offset % 521) - 521 : this.offset;
    //    console.log(this.offset);
    //
    //    //requestAnimationFrame(function () {
    //    //
    //    //    coke_bg.css({
    //    //        "transform": "translateX(" + offset + "px) ",
    //    //        "-webkit-transform": "translateX(" + offset + "px)"
    //    //    });
    //    //
    //    //
    //    //});
    //}

}
