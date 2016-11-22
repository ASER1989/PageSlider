/**
 * Created by aser on 16/8/5.
 */

function ready() {

    require(['./js/zepto.js', './js/boneAnimate.js'], function () {


        /*================Events===================*/

        var QR = new boneAnimate($);
        QR.init($("#_page5").find('.page'), $(".bar-box").find(".bar-item"));
        $(".leftL").on("click", function () {

            QR.perv()
        });
        $(".rigthL").on("click", function () {
            QR.next()
        });

    })

}

