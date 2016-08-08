/**
 * Created by aser on 16/8/5.
 */

function ready() {

    require(['zepto','boneAnimate'], function ($,QR) {

        /*================Events===================*/

        QR.init($("#_page5").find('.page'));
        $(".leftL").on("click", function () {

            QR.perv()
        });
        $(".rigthL").on("click", function () {
            QR.next()
        });
    })

}

