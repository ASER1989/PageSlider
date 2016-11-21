/**
 * Created by aser on 16/8/2.
 */


    var version = "1.87";
    require.config({
        //bathUrl:"../../",
        paths:{
            jquery:"jquery",
            zepto:"zepto",
            underscore:"underscore",
            zoom:"zoom",
            ImgLoader:"ImgLoader.js",
            boneAnimate:"boneAnimate.js?v="+version,
            pageSlider:"page-slider.js?v="+version
        },
        shim: {

            'zepto':{
                exports: '$'
            },
            zoom:{
                deps:['zepto']
            }
        }
    });

    if(typeof pageReady=="function"){

        pageReady.call();
    }
