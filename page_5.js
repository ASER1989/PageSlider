/**
 * Created by aser on 16/8/5.
 */

function ready() {

    require(['zepto','boneAnimate'], function ($,QR) {


        /*================Events===================*/

        QR.init($("#_page5").find('.page'), $(".bar-box").find(".bar-item"));
        $(".leftL").on("click", function () {

            QR.perv()
        });
        $(".rigthL").on("click", function () {
            QR.next()
        });

    })

}

