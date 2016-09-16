/**
 * Created by aser on 16/9/15.
 */
;'use strict';

var ImgLoader = function () {

    var count = 0,
      loadCount = 0,
      loadVal = 0,
      loadingBox = null,
      onComplate,
      onLoad
      ;


    function _add(url) {
        count += 1;
        loadVal = (100 / count).toFixed(0);

        var img = new Image();

        img.onload = function () {
            _success(url, 1);
        };
        img.onerror = function () {
            _success(url, 0);
        }
        img.src = url;


    }

    function _success(url, isSucc) {
        loadCount += 1;

        if (typeof onLoad == "function") {
            onLoad.call(null, loadCount, count, isSucc==1);
        }

        if (loadingBox) {
            loadingBox.html(((count - loadCount) * loadVal) + "%");
        }
        if (loadCount == count) {
            if (loadingBox) {
                loadingBox.html("100%");
            }
            if (typeof  onComplate == "function") {
                onComplate.apply();
            }
        }
    }

    function load(url, opt) {
        if (opt) {
            loadingBox = opt.loadingbox;
            onComplate = opt.onComplate;
            onLoad = opt.onload;
        }

        if (Object.prototype.toString.call(url) == "[object Array]") {
            for (var i in url) {
                var item = url[i];
                _add(item);
            }
            return;
        }

        _add(url);
    }


    function watch() {

        for (var els = document.getElementsByTagName("img"), count = 0,
               loaded = function () {
                   this.removeEventListener && this.removeEventListener("load", loaded, !1);

                   count += 1;
                   if (typeof onload == "function") {
                       onload.call(null, count, els.length);
                   }
               },
               i = 0;
             i < els.length; i++) {

            var el = els[i];
            el.addEventListener ? !el.complete && el.addEventListener("load", loaded, false) : el.attachEvent && el.attachEvent("onreadystatechange", function () {
                "complete" == el.readyState && loaded.call(el, loaded)
            })

        }
    }

    function watchInit(callback) {
        onload = callback;
        watch();
    }


    return {
        preload: load,
        watch: watchInit
    }


}

if (typeof define === "function" && define.amd) {
    define([], function () {
        return ImgLoader;
    });
}

