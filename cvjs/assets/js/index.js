!function(e){
    var t={};
    function n(o){
        if(t[o])return t[o].exports;
        var r=t[o]={i:o,l:!1,exports:{}};
        return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports
    }
    n.m=e,
    n.c=t,
    n.d = function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},
    n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),
    Object.defineProperty(e,"__esModule",{value:!0})},
    n.t=function(e,t){
        if(1&t&&(e=n(e)),8&t)return e;
        if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;
        var o=Object.create(null);
        if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)
            for(var r in e)
                n.d(o,r,function(t){return e[t]}.bind(null,r));
            return o
        },
    n.n=function(e){
        var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t
    },
    n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="./assets/",n(n.s=0)
}(
    [
        function(e,t,n){
            n(1);
            const o=n(3),r=240;
            let i=null,c=null,a=null,u=0,d=0;
            function s(e){return`${e}px`}
            function l(...e){
                console.log(...e);
                const t=document.createElement("p");
                t.textContent=e.join(" "),document.querySelector("#log").appendChild(t)
            }
            function f(){
                const e=a.getContext("2d");
                e.drawImage(c,0,0,a.width,a.height);
                const t=e.getImageData(0,0,a.width,a.height);
                i.postMessage({type:"frame",imageData:t},[t.data.buffer])
            }
            !async function(){
                const e=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),
                t=e.getVideoTracks()[0].getSettings();
                u=r/t.width,
                a=function(e,t){
                    const n=document.createElement("canvas");
                    return n.setAttribute("width",e),n.setAttribute("height",t),n.style.display="none",document.body.appendChild(n),n
                }(t.width*u,t.height*u),
                (c=document.querySelector("video")).setAttribute("width",t.width),
                c.setAttribute("height",t.height),
                c.srcObject=e,
                await c.play(),
                l("Initializing the face detection worker"),
                (i=new o).addEventListener("message",({data:e})=>{
                    switch(e.type){
                        case"init":l("Worker initialization finished. Starting face detection"),f();break;
                        case"detect_faces":
                            requestAnimationFrame(
                                ()=>{
                                    !function(e){
                                        document.querySelectorAll(".faceRect").forEach(e=>{e.parentNode.removeChild(e)});
                                        const t=document.querySelector("#videoWrapper");
                                        e.forEach(
                                            e=>{const n=document.createElement("div");
                                            n.classList.add("faceRect"),
                                            n.style.top=s(e.y/u),
                                            n.style.left=s(e.x/u),
                                            n.style.width=s(e.width/u),
                                            n.style.height=s(e.height/u),
                                            t.appendChild(n)}
                                        )
                                    }(e.faces)
                                }
                            ),
                            f(),
                            function(){
                                const e=window.performance.now(),
                                t=e-d;
                                d=e;
                                const n=Math.round(1e3/t);
                                document.querySelector("#fps").textContent=`${n}FPS`
                            }();
                            break;
                        case"log":l("worker",...e.args)}})}()},function(e,t,n){},,function(e,t,n){e.exports=function(){return new Worker(n.p+"js/detectface.worker.js")}}]);
