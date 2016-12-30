/**
 * Created by ASER_MANAGER on 2016/12/10.
 */
var dialoger = function () {
    var that = this;
    this.dialogBox = document.querySelector("#_page_dialog") || init();
    function init() {
        var dialogBox = document.createElement("div");
        dialogBox.id = "_page_dialog";

        var warp = document.createElement("div");
        that.title = document.createElement("div");
        that.content = document.createElement("div");
        var bottom = document.createElement("div");
        var close = document.createElement("a");
        close.innerHTML="关闭"


        warp.classList.add("warp");
        that.title.classList.add("title");
        that.content.classList.add("content");
        bottom.classList.add("bottom");
        close.classList.add("close");

        close.onclick=function(){
            dialogBox.classList.add("hide");
        }

        bottom.appendChild(close);

        warp.appendChild(that.title);
        warp.appendChild(that.content);
        warp.appendChild(bottom);

        dialogBox.classList.add("hide");
        dialogBox.classList.add("slider-loading");
        dialogBox.appendChild(warp);

        document.body.appendChild(dialogBox);
        return dialogBox;
    }

    return {
        show: function (title,content,style,fn) {
            that.title.innerHTML = title ||"提示";
            that.content.innerHTML=content;
            dialogBox.classList.remove("hide");

            if(style!=null && typeof style!="function"){
                for(var i in style){
                    that.content.style[i]=style[i];
                }
            }

            fn= typeof style=="function" ?style:fn;
            typeof fn == "function" && fn.call(null);
        },
        hide: function (fn) {
            dialogBox.classList.add("hide");
            that.title.innerHTML ="提示";
            that.content.innerHTML="";
            typeof fn == "function" && fn.call(null);
        }
    }

}