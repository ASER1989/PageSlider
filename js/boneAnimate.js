/**
 * Created by aser on 16/8/4.
 */
;define(["zepto"],function($){
    var pages,index,isReady=false,isLock=false;
    function init(slides){

        if(slides.length>0 ){
            pages = slides;
            isReady = true;
            index=0;
            eventListener(pages);
        }
    }
    function eventListener(pages){
        var isWebkit = 'WebkitAppearance' in document.documentElement.style || typeof document.webkitHidden != "undefined";

        pages.each(function(i,v){
            var eventName = isWebkit?'webkitAnimationEnd':'animationend';
            $(v)[0].addEventListener(eventName,function(){
                $(this).removeClass("slide");
                if($(this).hasClass("out")){
                    $(this).addClass("hide");
                }else{
                    $(this).removeClass("hide");
                }
                $(this).removeClass("out").removeClass("in").removeClass("reverse");
                isLock = false;
            })
        })
    }
    function next(){
        var nidx = index<pages.length-1? index+1:0;
        if( isReady &&!isLock){
            isLock =true;

            $(pages[index]).addClass("out").addClass("slide");
            $(pages[nidx]).removeClass("hide").removeClass("out").addClass("in").addClass("slide");


            index=nidx;

        }

    }

    function  perv(){
        var nidx = index>=1?index-1:pages.length-1;
        if( isReady && !isLock){
            isLock = true;
            $(pages[nidx]).removeClass("hide").addClass("in").addClass("reverse").addClass("slide");
            $(pages[index]).addClass("reverse").addClass("out").addClass("slide");
            index=nidx;
        }
    }

    return {
        init:init,
        next:next,
        perv:perv
    }

})