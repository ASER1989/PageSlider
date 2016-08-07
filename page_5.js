/**
 * Created by aser on 16/8/5.
 */
;define(['zepto'], function () {
    return {
        ready: function () {

            require(['boneAnimate'], function (QR) {

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
    }
})