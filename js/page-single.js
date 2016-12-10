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
    var _state = {
        isDirchange: false,
        poffset: 0,
        custPage: null,
        nextPage: null,
        lastPage: null,
        isAnimateReady:true
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

        document.body.addEventListener("touchmove", function (e) {
            e.preventDefault();
        });
    }

    function next() {
        var nidx = _single.index < _single.pages.length - 1 ? _single.index + 1 : 0;
        if (_single.isReady && !_single.isLock) {
            _single.isLock = true;


            _single.index = nidx;
            bar();
        }

    }

    function perv() {
        var nidx = _single.index >= 1 ? _single.index - 1 : _single.pages.length - 1;
        if (_single.isReady && !_single.isLock) {
            _single.isLock = true;

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

        if (_single.isReady) {


            if (_single.isLock || offset == 0) return;
            _state.isDirchange = (_state.poffset < 0 && offset > 0) || (_state.poffset > 0 && offset < 0)
            _state.poffset = offset;
            var isright = offset <= 0;

            if (_state.isDirchange || !_state.custPage) {

                if (_state.isDirchange) {
                    _state.lastPage = _state.nextPage;
                    _state.lastPage.css({"transform": "translate3d(" + isright ? "100%" : "-100%" + "px,0,0)"});
                    _state.lastPage.addClass("hide");
                    _state.lastPage.offsetWidth = _state.lastPage.offsetWidth;
                    _state.isDirchange = false;
                }

                var nidx = _single.index < _single.pages.length - 1 ? _single.index + 1 : 0;
                nidx = isright ? nidx : _single.index >= 1 ? _single.index - 1 : _single.pages.length - 1;

                _state.custPage = $(_single.pages[_single.index]);
                _state.nextPage = $(_single.pages[nidx]);

            }

            _state.nextPage.removeClass("hide");
            _state.nextPage.css({"transform": "translate3d(" + (isright ? (base.xWidth + offset) : (0 - base.xWidth + offset)) + "px,0,0)"});
            _state.custPage.css({"transform": "translate3d(" + offset + "px,0,0)"});
            //_state.custPage.offsetWidth = _state.custPage.offsetWidth;
        }
    }

    function onSwipeEnd(offset) {
        if (_single.isReady) {
            if (_single.isLock || offset == 0) return;

            var isright = offset <= 0;
            //
            //
            var nidx = _single.index < _single.pages.length - 1 ? _single.index + 1 : 0;
            nidx = isright ? nidx : _single.index >= 1 ? _single.index - 1 : _single.pages.length - 1;
            //
            //var custPage = $(_single.pages[_single.index]);
            //var nextPage = $(_single.pages[nidx]);

            if (Math.abs(offset) >= 30) {
                //isright ? next() : perv();
                _single.isLock = true;
                _single.index = nidx;
                //if (!_state.custPage || !_state.nextPage) {
                //    console.log("-1")
                //}
                pageAnimate(_state.custPage, _state.nextPage, isright ? 0 - base.xWidth : base.xWidth);
                return;
            } else {
                _state.nextPage.css({translation: 'all 1s', '-webkit-translation': 'all 1s'});
                _state.custPage.css({translation: 'all 1s', '-webkit-translation': 'all 1s'});

                _state.custPage.offsetWidth = _state.custPage.offsetWidth;
                _state.custPage.removeAttr('style');
                _state.nextPage.removeAttr('style');


            }
        }
    }

    function onSwipeStart() {
        if (_single.isReady && !_state.isLock) {
            _state = {
                isDirchange: false,
                poffset: 0,
                custPage: null,
                nextPage: null,
                lastPage: null,
                isAnimateReady:true
            };
        }
        //_single.touchTimes = 0;
    }


    function pageAnimate(custObj, nextObj, offset) {

        if (!custObj || !nextObj) {
            _single.isLock = false;
            return;
        }
        _single.isAnimateReady = false;
        nextObj.animate(
            {
                transform: "translate3d(0,0,0)"
            }, 300);

        custObj.animate(
            {
                transform: 'translate3d(' + offset + 'px,0,0)',
                '-webkit-transform': 'translate3d(' + offset + 'px,0,0)'

            },
            {
                complete: function () {
                    custObj.addClass("hide");
                    custObj.removeAttr("style");
                    setTimeout(function(){
                        _single.isLock = false;
                        //_single.isAnimateReady = true;
                    },500);

                },
                duration: 300
            });


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