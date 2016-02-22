var isIE=window.navigator.userAgent.match(/MSIE\s*([\d\.]+)/);
            if(!!isIE)
            {
                document.write('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />')
            }
            
            !function(window){
                function setBaseRem(){
                    var pageWidth=element.getBoundingClientRect().width;
                    pageWidth/dprNum>540&&(pageWidth=540*dprNum);                    
                    window.rem=pageWidth/16;
                    element.style.fontSize=window.rem+"px";                    
                }
                var dprNum,
                    scaleNum,
                    timer,
                    document=window.document,
                    element=document.documentElement,
                    viewport=document.querySelector('meta[name="viewport"]'),
                    flexible=document.querySelector('meta[name="flexible"]');
                    if(viewport){
                        var contentArray=viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
                        contentArray&&(scaleNum=parseFloat(contentArray[2]),dprNum=parseInt(1/scaleNum))
                    }else{
                        if(flexible){var contentArray=flexible.getAttribute("content").match(/initial\-dprNum=(["']?)([\d\.]+)\1?/);
                        contentArray&&(dprNum=parseFloat(contentArray[2]),scaleNum=parseFloat((1/dprNum).toFixed(2)))
                        }
                    }
                    if(!dprNum&&!scaleNum){
                        var platform=(window.navigator.appVersion.match(/android/gi),window.navigator.appVersion.match(/iphone/gi)),
                            dprNum=window.devicePixelRatio;
                        dprNum=platform?dprNum>=3?3:dprNum>=2?2:1:1;
                        scaleNum=1/dprNum;
                    }
                    if(element.setAttribute("data-dprNum",dprNum),!viewport){
                        if(viewport=document.createElement("meta"),viewport.setAttribute("name","viewport"),
                        viewport.setAttribute("content","initial-scale="+scaleNum+", maximum-scale="+scaleNum+", minimum-scale="+scaleNum+", user-scalable=no"),element.firstElementChild){
                            element.firstElementChild.appendChild(viewport)
                        }else{
                            var m=document.createElement("div");
                            m.appendChild(viewport),
                            document.write(m.innerHTML)
                        }
                    }
                    window.dprNum=dprNum;
                    window.addEventListener("resize",function(){clearTimeout(timer),timer=setTimeout(setBaseRem,300)},!1);
                    "complete"===document.readyState?document.body.style.fontSize=12*dprNum+"px":document.addEventListener("DOMContentLoaded",function(){document.body.style.fontSize=12*dprNum+"px"},!1);
                setBaseRem();
            }(window);