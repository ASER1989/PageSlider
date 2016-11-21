/**
 * Created by aser on 16/8/4.
 */
;define(["zepto"],function($){
    var pages,index,isReady=false,isLock=false,baritems=[];
    function init(slides,barItems){

        if(slides.length>0 ){
            pages = slides;
            isReady = true;
            index=0;
            eventListener(pages);
        }
        baritems = barItems||baritems;
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



            $(pages[nidx]).removeClass("hide").removeClass("out").addClass("in").addClass("slide");
            $(pages[index]).offsetWidth = $(pages[index]).offsetWidth;
            $(pages[index]).addClass("out").addClass("slide");


            index=nidx;
            bar();
        }

    }

    function  perv(){
        var nidx = index>=1?index-1:pages.length-1;
        if( isReady && !isLock){
            isLock = true;
            $(pages[nidx]).removeClass("hide").addClass("in").addClass("reverse").addClass("slide");
            $(pages[index]).offsetWidth = $(pages[index]).offsetWidth;
            $(pages[index]).addClass("reverse").addClass("out").addClass("slide");
            index=nidx;
            bar();
        }
    }
    function bar(){
        if(Object.prototype.toString.call(baritems)=="[object Array]" && baritems.length>0){
            baritems.removeClass("hover").eq(index).addClass("hover");
        }

    }

    return {
        init:init,
        next:next,
        perv:perv
    }

})