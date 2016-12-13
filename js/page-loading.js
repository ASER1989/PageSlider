/**
 * Created by ASER_MANAGER on 2016/12/10.
 */
var loader = function () {
    this.loaderBox = document.querySelector("#_page_loader") || init();

    function init() {
        var loaderBox = document.createElement("div");
        loaderBox.id = "_page_loader";
        loaderBox.isPre = false;

        var text = "加载中...";

        var lodiv = document.createElement("div");
        var innerdiv = document.createElement("div");

        lodiv.classList.add("loader");

        innerdiv.classList.add("des");
        innerdiv.innerText = text;

        loaderBox.classList.add("slider-loading");
        loaderBox.classList.add("hide");
        loaderBox.appendChild(lodiv);
        loaderBox.appendChild(innerdiv);

        document.body.appendChild(loaderBox);
        return loaderBox;
    }

    return {
        show: function (fn) {
            loaderBox.classList.remove("hide");
            typeof fn == "function" && fn.call(null);
        },
        hide: function (fn) {
            loaderBox.classList.add("hide");
            typeof fn == "function" && fn.call(null);
        }
    }

}