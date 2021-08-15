(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{209:function(t,e,n){var content=n(211);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(85).default)("5281baa3",content,!0,{sourceMap:!1})},210:function(t,e,n){"use strict";n(209)},211:function(t,e,n){var o=n(84)(!1);o.push([t.i,".my-canvas{position:relative;width:100%;height:100%;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}",""]),t.exports=o},213:function(t,e,n){"use strict";n.r(e);n(44),n(34),n(45),n(30),n(46),n(47);var o=n(115),r=n(116),l=(n(12),n(26),n(31),n(57),n(83),n(212)),c=n(214);function h(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return m(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,o=function(){};return{s:o,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,l=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return l=t.done,t},e:function(t){c=!0,r=t},f:function(){try{l||null==n.return||n.return()}finally{if(c)throw r}}}}function m(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}function map(t,e,n,o,r){var l=!(arguments.length>5&&void 0!==arguments[5])||arguments[5];if(!0===l){if(t<e)return o;if(t>n)return r}return(t-e)*((r-o)/(n-e))+o}var f=function(){function t(data,e,n){Object(o.a)(this,t),this._BLOCK_NOISE_TEXTURE_SIZE=256,this.data=data,this.width=e,this.height=n,this.textures=[],this.textureIndex=0,this.numTextures=data.length,this.numTotalImgs=0,this.numLoadedImgs=0,this.blockNoiseCanvas=document.createElement("canvas"),this.blockNoiseCanvas.width=this._BLOCK_NOISE_TEXTURE_SIZE,this.blockNoiseCanvas.height=this._BLOCK_NOISE_TEXTURE_SIZE,this.blockNoiseCtx=this.blockNoiseCanvas.getContext("2d"),this.blockNoiseTexture=new l.j(this.blockNoiseCanvas),this.blockNoiseTexture.minFilter=l.d,this.blockNoiseTexture.magFilter=l.d,this.blockNoiseTexture.wrapS=l.c,this.blockNoiseTexture.wrapT=l.c,this.blockNoiseCanvas.style.zIndex=1e3,this.blockNoiseCanvas.style.position="fixed",this.blockNoiseCanvas.style.top="0px",this.blockNoiseCanvas.style.left="0px";var r=new l.f(e,n);this.material=new l.g({vertexShader:"uniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nuniform sampler2D img1;\nuniform sampler2D img2;\nuniform sampler2D blockNoiseTexture;\nuniform float time;\nuniform float timeOffset;\nuniform float glitchValue;\nuniform float imgRatio;\nuniform vec2 resolution;\nuniform vec3 randomValues;\n\nvarying vec2 vUv;\n\nfloat PI = 3.1415926535897932384626433832795;\n\nfloat map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n    if(clamp == true) {\n      if(value < inputMin) return outputMin;\n      if(value > inputMax) return outputMax;\n    }\n\n    float p = (outputMax - outputMin) / (inputMax - inputMin);\n    return ((value - inputMin) * p) + outputMin;\n}\n\nconst int   oct  = 8;\nconst float per  = 0.5;\nconst float cCorners = 1.0 / 16.0;\nconst float cSides   = 1.0 / 8.0;\nconst float cCenter  = 1.0 / 4.0;\n\n// 補間関数\nfloat interpolate(float a, float b, float x){\n    float f = (1.0 - cos(x * PI)) * 0.5;\n    return a * (1.0 - f) + b * f;\n}\n\n// 乱数生成\nfloat rnd(vec2 p){\n    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\n// 補間乱数\nfloat irnd(vec2 p){\n    vec2 i = floor(p);\n    vec2 f = fract(p);\n    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),\n                rnd(vec2(i.x + 1.0, i.y      )),\n                rnd(vec2(i.x,       i.y + 1.0)),\n                rnd(vec2(i.x + 1.0, i.y + 1.0)));\n    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);\n}\n\n// ノイズ生成\nfloat noise(vec2 p){\n    float t = 0.0;\n    for(int i = 0; i < oct; i++){\n        float freq = pow(2.0, float(i));\n        float amp  = pow(per, float(oct - i));\n        t += irnd(vec2(p.x / freq, p.y / freq)) * amp;\n    }\n    return t;\n}\n\nvoid main(){\n    vec2 uv = vUv;\n\n    float posY = floor(mod(-time * 0.02, resolution.y));\n    float subY = posY - uv.t * resolution.y;\n    if(subY > -0.45 && subY < 0.45) {\n        uv.x += 0.02 * randomValues.x;\n    }\n\n    posY = floor(mod(-time * 0.03, resolution.y));\n    subY = posY - uv.t * resolution.y;\n    if(subY > -0.25 && subY < 0.25) {\n        uv.x += 0.02 * randomValues.z;\n    }\n\n    float r = mod(time, 10.0) * 100000.0 * uv.y;\n    uv.x += map(noise(vec2(randomValues.y * r, randomValues.x * r)), 0.0, 1.0, -1.0, 1.0, true) * 0.1 * glitchValue;\n    uv.y += map(noise(vec2(randomValues.x * r, randomValues.z * r)), 0.0, 1.0, -1.0, 1.0, true) * 0.1 * glitchValue;\n\n    vec4 blockNoise = texture2D(blockNoiseTexture, vUv);\n    uv.x += blockNoise.r * glitchValue * 0.3;\n    uv.y += blockNoise.g * glitchValue * 0.3;\n\n    vec4 color1 = texture2D(img1, uv);\n    vec4 color2 = texture2D(img2, uv);\n    vec4 color = mix(color1, color2, imgRatio);\n    if(color.a == 0.0) {\n        discard;\n    } else {\n        gl_FragColor = color;\n    }\n}\n",depthTest:!1,depthWrite:!1,transparent:!0,uniforms:{time:{type:"1f",value:0},timeOffset:{type:"1f",value:1e3*Math.random()},img1:{type:"t",value:null},img2:{type:"t",value:null},resolution:{type:"2f",value:new l.l(e,n)},blockNoiseTexture:{type:"t",value:this.blockNoiseTexture},randomValues:{type:"3f",value:new l.m},glitchValue:{type:"1f",value:0},imgRatio:{type:"1f",value:0}}}),this.mesh=new l.b(r,this.material),this.swapTexturesTimeline=null,this.glitchTimer=null}return Object(r.a)(t,[{key:"init",value:function(){var t,e=this,n=[],o=h(this.data);try{for(o.s();!(t=o.n()).done;){var r=t.value;n.push(this.loadTexture(r.imgPath))}}catch(t){o.e(t)}finally{o.f()}return Promise.all(n).then((function(){return e.setImgs(),!0}))}},{key:"loadTexture",value:function(t){var e=this;this.numTotalImgs++;var n=new l.k;return new Promise((function(o){var r=n.load(t,(function(){e.numLoadedImgs++,o()}));r.wrapS=l.h,r.wrapT=l.h,r.minFilter=l.a,r.maxFilter=l.a,r.wrapS=l.c,r.wrapT=l.c,e.textures.push(r)}))}},{key:"setImgs",value:function(){this.material.uniforms.img1.value=this.textures[this.textureIndex],this.textureIndex=++this.textureIndex%this.numTextures,this.material.uniforms.img2.value=this.textures[this.textureIndex],this.material.needUpdate=!0}},{key:"update",value:function(time){this.material.uniforms.time.value=time,this.material.uniforms.randomValues.value.set(map(Math.random(),0,1,-1,1),map(Math.random(),0,1,-1,1),map(Math.random(),0,1,-1,1)),this.material.needsUpdate=!0}},{key:"start",value:function(){this.setGlitchTimer()}},{key:"setGlitchTimer",value:function(){var t=this;this.clearGlitchTimer(),this.glitchTimer=setTimeout((function(){return t.swapTextures()}),5e3)}},{key:"clearGlitchTimer",value:function(){this.glitchTimer&&clearTimeout(this.glitchTimer),this.glitchTimer=null}},{key:"swapTextures",value:function(){var t=this;this.swapTexturesTimeline&&this.swapTexturesTimeline.kill(),this.material.uniforms.glitchValue.value=1,this.swapTexturesTimeline=c.a.timeline().to(this.material.uniforms.imgRatio,.2,{value:1,ease:"Expo.easeInOut"},.2).add((function(){return t.updateBlockNoise()}),.05).add((function(){return t.updateBlockNoise()}),.1).add((function(){return t.updateBlockNoise()}),.15).add((function(){return t.updateBlockNoise()}),.2).add((function(){return t.updateBlockNoise()}),.25).add((function(){return t.updateBlockNoise()}),.3).add((function(){return t.updateBlockNoise()}),.35).add((function(){t.material.uniforms.glitchValue.value=0,t.material.uniforms.imgRatio.value=0,t.setImgs(),t.setGlitchTimer()}),.4)}},{key:"updateBlockNoise",value:function(){this.blockNoiseCtx.clearRect(0,0,this._BLOCK_NOISE_TEXTURE_SIZE,this._BLOCK_NOISE_TEXTURE_SIZE);for(var i=0;i<4+4*Math.floor(Math.random());i++){var t=Math.random(),e=Math.random(),n=Math.random()*this._BLOCK_NOISE_TEXTURE_SIZE,o=Math.random()*this._BLOCK_NOISE_TEXTURE_SIZE,r=(.1+.1*Math.random())*this._BLOCK_NOISE_TEXTURE_SIZE,l=(.04+.04*Math.random())*this._BLOCK_NOISE_TEXTURE_SIZE;this.blockNoiseCtx.fillStyle="rgba(".concat(Math.floor(256*t),", ").concat(Math.floor(256*e),", 0, 1)"),this.blockNoiseCtx.fillRect(n-r/2,o-l/2,r,l)}this.blockNoiseTexture.needsUpdate=!0,this.material.needUpdate=!0}}]),t}(),d=function(){function t(e){Object(o.a)(this,t),this.startTime=void 0,this.time=void 0,this.container=document.querySelector(".js-mainCanvas"),this.renderer=new l.n({canvas:this.container.querySelector("canvas"),alpha:!0,antialias:!1}),this.devicePixelRatio=Math.min(2,window.devicePixelRatio||1),this.renderer.setPixelRatio(devicePixelRatio),this.scene=new l.i,this.canvasSize={width:this.container.offsetWidth,height:this.container.offsetHeight},this.camera=new l.e(45,this.canvasSize.width/this.canvasSize.height,1,1e3),this.camera.position.z=100,this.imgList=[];var n,r=h(e);try{for(r.s();!(n=r.n()).done;){var c=n.value;this.imgList.push({imgPath:c})}}catch(t){r.e(t)}finally{r.f()}this.glitchAnimation=new f(this.imgList,40,40),this.scene.add(this.glitchAnimation.mesh),window.addEventListener("resize",this.resize.bind(this)),this.resize()}return Object(r.a)(t,[{key:"init",value:function(t){this.glitchAnimation.init().then(t)}},{key:"start",value:function(){this.startTime=(new Date).getTime(),this.glitchAnimation.start(),this.update()}},{key:"resize",value:function(){this.canvasSize.width=this.container.offsetWidth,this.canvasSize.height=this.container.offsetHeight,this.renderer.setSize(this.canvasSize.width,this.canvasSize.height),this.camera.aspect=this.canvasSize.width/this.canvasSize.height,this.camera.updateProjectionMatrix()}},{key:"update",value:function(){requestAnimationFrame(this.update.bind(this)),this.time=(new Date).getTime()-this.startTime,this.glitchAnimation.update(this.time),this.renderer.render(this.scene,this.camera)}},{key:"destroy",value:function(){window.removeEventListener("resize",this.resize.bind(this))}}]),t}(),v={data:function(){return{imgList:["./images/img01.png","./images/img02.png","./images/img03.png","./images/img04.png"]}},mounted:function(){var t=this;this.glitch=new d(this.imgList),this.glitch.init((function(){t.glitch.start()}))},destroyed:function(){this.glitch.destroyed()}},x=(n(210),n(42)),component=Object(x.a)(v,(function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"my-canvas js-mainCanvas"},[e("canvas")])}],!1,null,null,null);e.default=component.exports}}]);