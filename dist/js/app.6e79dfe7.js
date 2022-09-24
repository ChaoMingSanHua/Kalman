(function(){var t={5613:function(t,e,a){"use strict";var r=a(6369),n=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[t._m(0),e("router-view")],1)},i=[function(){var t=this,e=t._self._c;return e("nav",[e("p",[t._v("热爱可达星辰彼岸 @潮鸣散花")])])}],s=a(1001),o={},l=(0,s.Z)(o,n,i,!1,null,null,null),c=l.exports,h=a(2631),u=function(){var t=this,e=t._self._c;return e("div",{staticClass:"home"},[e("DataDisplay")],1)},m=[],d=function(){var t=this,e=t._self._c;return e("div",{staticClass:"com-container"},[e("h1",[t._v("卡尔曼滤波")]),t._m(0),e("h2",[t._v("实际参数")]),e("div",{staticClass:"com-sim-data"},[e("div",[e("p",[t._v("初始速度")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.realInitVel,expression:"realInitVel"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.realInitVel},on:{input:function(e){e.target.composing||(t.realInitVel=e.target.value)}}})]),e("div",[e("p",[t._v("加速度")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.realInitAcc,expression:"realInitAcc"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.realInitAcc},on:{input:function(e){e.target.composing||(t.realInitAcc=e.target.value)}}})])]),e("h2",[t._v("理论参数")]),e("div",{staticClass:"com-data-init"},[e("div",[e("p",[t._v("初始位置")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.initPos,expression:"initPos"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.initPos},on:{input:function(e){e.target.composing||(t.initPos=e.target.value)}}})]),e("div",[e("p",[t._v("初始速度")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.initVel,expression:"initVel"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.initVel},on:{input:function(e){e.target.composing||(t.initVel=e.target.value)}}})]),e("div",[e("p",[t._v("初始状态噪声方差")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.pPara,expression:"pPara"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.pPara},on:{input:function(e){e.target.composing||(t.pPara=e.target.value)}}})]),e("div",[e("p",[t._v("模型噪声方差")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.qPara,expression:"qPara"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.qPara},on:{input:function(e){e.target.composing||(t.qPara=e.target.value)}}})]),e("div",[e("p",[t._v("传感器噪声方差")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.rPara,expression:"rPara"}],attrs:{type:"number",min:"0",max:"10"},domProps:{value:t.rPara},on:{input:function(e){e.target.composing||(t.rPara=e.target.value)}}})])]),e("button",{on:{click:t.sim}},[t._v("仿真")]),e("div",{staticClass:"com-figure"},[e("h2",[t._v("小车位置")]),e("div",{ref:"chart1",staticClass:"com-chart"}),e("h2",[t._v("小车速度")]),e("div",{ref:"chart2",staticClass:"com-chart"})])])},p=[function(){var t=this,e=t._self._c;return e("div",[e("canvas",{attrs:{id:"canvas",width:"1000",height:"280"}},[t._v("抱歉,您的浏览器不支持canvas元素")])])}],v=a(4867),f=a(6614);const y={number:"number",precision:1},g=(0,v.U)(f.$,y);var P={name:"DataDisPlay",data(){return{leftSpacing:40,topSpacing:40,carLength:160,carHeight:50,wheelSpacing:80,wheelRadius:20,sensorLength:10,sensorHeight:20,sensorDot:!1,sensorRadius:2,sensorNum:0,roadBegin:0,roadEnd:1e3,roadLength:50,roadSpacing:100,canvas:null,ctx:null,timer:null,t:null,deltaT:.02,realInitVel:5,realInitAcc:.1,initPos:0,initVel:3,pPara:.1,qPara:1e-4,rPara:10,time:null,realPosArray:null,realVelArray:null,modelPosArray:null,modelVelArray:null,observePosArray:null,observeVelArray:null,kalmanPosArray:null,kalmanVelArray:null,chart1Instance:null,chart2Instance:null}},mounted(){this.initCanvas(),this.canvasRender(),this.initChart()},methods:{sim(){this.initCanvas(),this.canvasRun(),setTimeout(this.chartSim,6e3)},initCanvas(){this.carCenter=[this.leftSpacing+this.carLength/2,this.topSpacing+this.carHeight/2],this.t=0,this.canvas=document.getElementById("canvas"),this.ctx=this.canvas.getContext("2d")},canvasRender(){const t=this.ctx;t.clearRect(0,0,1e3,1e3),t.save(),t.restore(),t.strokeRect(this.carCenter[0]-this.carLength/2,this.carCenter[1]-this.carHeight/2,this.carLength,this.carHeight);const e=this.carCenter[1]+this.carHeight/2+this.wheelRadius;t.beginPath(),t.arc(this.carCenter[0]-this.wheelSpacing/2,e,this.wheelRadius,0,2*Math.PI),t.stroke(),t.beginPath(),t.arc(this.carCenter[0]+this.wheelSpacing/2,e,this.wheelRadius,0,2*Math.PI),t.stroke(),t.strokeRect(this.carCenter[0]-this.sensorLength/2,this.carCenter[1]-this.carHeight/2-this.sensorHeight,this.sensorLength,this.sensorHeight),this.sensorNum+=1,this.sensorNum>=50&&(this.sensorDot=!0,this.sensorNum=0),this.sensorDot&&(t.beginPath(),t.arc(this.carCenter[0],this.carCenter[1]-this.carHeight/2-this.sensorHeight/2,this.sensorRadius,0,2*Math.PI,!1),t.fillStyle="red",t.fill(),this.sensorDot=!1);const a=this.carCenter[1]+this.carHeight/2+2*this.wheelRadius;t.beginPath(),t.moveTo(this.roadBegin,a),t.lineTo(this.roadEnd,a),t.closePath(),t.stroke();for(let r=0;r<10;r++)t.beginPath(),t.moveTo(this.roadBegin+50+this.roadSpacing*r,a),t.lineTo(this.roadBegin+50+this.roadSpacing*r+this.roadLength*Math.cos(3*Math.PI/4),a+this.roadLength*Math.sin(3*Math.PI/4)),t.closePath(),t.stroke()},canvasRun(){this.timer&&clearInterval(this.timer),this.timer=setInterval(this.canvasSim,1e3*this.deltaT)},canvasSim(){const t=100,e=1;this.carCenter[0]+=t*this.deltaT+.5*e*this.deltaT*(2*this.t+1),this.t+=this.deltaT,this.canvasRender(),this.timer&&this.t>6&&clearInterval(this.timer)},initChart(){this.chart1Instance=this.$echarts.init(this.$refs.chart1),this.chart2Instance=this.$echarts.init(this.$refs.chart2);const t={grid:{left:"3%",top:"35%",right:"4%",bottom:"1%",containLabel:!0},tooltip:{trigger:"axis"},legend:{left:20,top:"15%",icon:"circle"},xAxis:{type:"category",boundaryGap:!1},yAxis:{type:"value"}};this.chart1Instance.setOption(t),this.chart2Instance.setOption(t)},updateChart(){const t={xAxis:{data:this.time._data},series:[{name:"actual",type:"line",data:this.realPosArray._data},{name:"observation",type:"scatter",data:this.observePosArray},{name:"model",type:"scatter",data:this.modelPosArray},{name:"kalman",type:"scatter",data:this.kalmanPosArray}]},e={xAxis:{data:this.time._data},series:[{name:"actual",type:"line",data:this.realVelArray._data},{name:"observation",type:"scatter",data:this.observeVelArray},{name:"model",type:"scatter",data:this.modelVelArray},{name:"kalman",type:"scatter",data:this.kalmanVelArray}]};this.chart1Instance.setOption(t),this.chart2Instance.setOption(e)},chartSim(){const t=51;this.time=g.range(0,t,1),this.realPosArray=g.zeros(t),this.realVelArray=g.zeros(t),this.time.forEach(((t,e)=>{this.realPosArray._data[e]=this.realInitVel*t+.5*this.realInitAcc*t*t,this.realVelArray._data[e]=this.realInitVel+this.realInitAcc*t})),this.modelPosArray=new Array(t),this.modelVelArray=new Array(t);const e=g.matrix([[1,1],[0,1]]),a=g.matrix([[.5],[1]]),r=g.matrix([[1,0]]);let n=g.matrix([[this.initPos],[this.initVel]]);const i=g.matrix([[this.realInitAcc]]);this.time.forEach(((t,r)=>{this.modelPosArray[r]=n._data[0][0],this.modelVelArray[r]=n._data[1][0],n=g.add(g.multiply(e,n),g.multiply(a,i))})),this.observePosArray=new Array(t),this.observeVelArray=new Array(t);const s=0,o=this.rPara,l=this.normalRandomSize(s,o,t);this.realPosArray._data.forEach(((t,e)=>{this.observePosArray[e]=t+l[e],this.observeVelArray[e]=e?this.observePosArray[e]-this.observePosArray[e-1]:0}));let c=g.matrix([[this.initPos],[this.initVel]]);const h=g.matrix([[this.realInitAcc]]);let u=g.matrix([[this.pPara,0],[0,this.pPara]]);const m=g.matrix([[this.qPara,0],[0,this.qPara]]),d=g.matrix([[this.rPara]]);let p,v,f;this.kalmanPosArray=new Array(t),this.kalmanVelArray=new Array(t),this.time.forEach(((t,n)=>{this.kalmanPosArray[n]=c._data[0][0],this.kalmanVelArray[n]=c._data[1][0],p=g.add(g.multiply(e,c),g.multiply(a,h)),v=g.add(g.multiply(g.multiply(e,u),g.transpose(e)),m),f=g.multiply(g.multiply(v,g.transpose(r)),g.inv(g.add(g.multiply(g.multiply(r,v),g.transpose(r)),d))),c=g.add(p,g.multiply(f,g.subtract(this.observePosArray[n],g.multiply(r,p)))),u=g.multiply(g.subtract(g.identity(2),g.multiply(f,r)),v)})),this.updateChart()},normalRandom(t,e){let a=0,r=0,n=0,i=0;do{a=2*Math.random()-1,r=2*Math.random()-1,n=a*a+r*r}while(0===n||n>=1);i=Math.sqrt(-2*Math.log(n)/n);const s=t+a*i*e;return s},normalRandomSize(t,e,a){const r=[];for(let n=0;n<a;n++)r[n]=this.normalRandom(t,e);return r}}},b=P,A=(0,s.Z)(b,d,p,!1,null,"0ca932a1",null),w=A.exports,x={name:"HomeView",components:{DataDisplay:w}},_=x,C=(0,s.Z)(_,u,m,!1,null,null,null),I=C.exports;r.ZP.use(h.ZP);const k=[{path:"/",name:"home",component:I},{path:"/about",name:"about",component:()=>a.e(443).then(a.bind(a,5399))}],V=new h.ZP({routes:k});var S=V,O=a(3822);r.ZP.use(O.ZP);var R=new O.ZP.Store({state:{},getters:{},mutations:{},actions:{},modules:{}});r.ZP.prototype.$echarts=window.echarts,r.ZP.config.productionTip=!1,new r.ZP({router:S,store:R,render:t=>t(c)}).$mount("#app")},5042:function(){}},e={};function a(r){var n=e[r];if(void 0!==n)return n.exports;var i=e[r]={id:r,loaded:!1,exports:{}};return t[r].call(i.exports,i,i.exports,a),i.loaded=!0,i.exports}a.m=t,function(){a.amdD=function(){throw new Error("define cannot be used indirect")}}(),function(){a.amdO={}}(),function(){var t=[];a.O=function(e,r,n,i){if(!r){var s=1/0;for(h=0;h<t.length;h++){r=t[h][0],n=t[h][1],i=t[h][2];for(var o=!0,l=0;l<r.length;l++)(!1&i||s>=i)&&Object.keys(a.O).every((function(t){return a.O[t](r[l])}))?r.splice(l--,1):(o=!1,i<s&&(s=i));if(o){t.splice(h--,1);var c=n();void 0!==c&&(e=c)}}return e}i=i||0;for(var h=t.length;h>0&&t[h-1][2]>i;h--)t[h]=t[h-1];t[h]=[r,n,i]}}(),function(){a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,{a:e}),e}}(),function(){a.d=function(t,e){for(var r in e)a.o(e,r)&&!a.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}}(),function(){a.f={},a.e=function(t){return Promise.all(Object.keys(a.f).reduce((function(e,r){return a.f[r](t,e),e}),[]))}}(),function(){a.u=function(t){return"js/about.763262d5.js"}}(),function(){a.miniCssF=function(t){}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={},e="kalman:";a.l=function(r,n,i,s){if(t[r])t[r].push(n);else{var o,l;if(void 0!==i)for(var c=document.getElementsByTagName("script"),h=0;h<c.length;h++){var u=c[h];if(u.getAttribute("src")==r||u.getAttribute("data-webpack")==e+i){o=u;break}}o||(l=!0,o=document.createElement("script"),o.charset="utf-8",o.timeout=120,a.nc&&o.setAttribute("nonce",a.nc),o.setAttribute("data-webpack",e+i),o.src=r),t[r]=[n];var m=function(e,a){o.onerror=o.onload=null,clearTimeout(d);var n=t[r];if(delete t[r],o.parentNode&&o.parentNode.removeChild(o),n&&n.forEach((function(t){return t(a)})),e)return e(a)},d=setTimeout(m.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=m.bind(null,o.onerror),o.onload=m.bind(null,o.onload),l&&document.head.appendChild(o)}}}(),function(){a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){a.nmd=function(t){return t.paths=[],t.children||(t.children=[]),t}}(),function(){a.p="/"}(),function(){var t={143:0};a.f.j=function(e,r){var n=a.o(t,e)?t[e]:void 0;if(0!==n)if(n)r.push(n[2]);else{var i=new Promise((function(a,r){n=t[e]=[a,r]}));r.push(n[2]=i);var s=a.p+a.u(e),o=new Error,l=function(r){if(a.o(t,e)&&(n=t[e],0!==n&&(t[e]=void 0),n)){var i=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;o.message="Loading chunk "+e+" failed.\n("+i+": "+s+")",o.name="ChunkLoadError",o.type=i,o.request=s,n[1](o)}};a.l(s,l,"chunk-"+e,e)}},a.O.j=function(e){return 0===t[e]};var e=function(e,r){var n,i,s=r[0],o=r[1],l=r[2],c=0;if(s.some((function(e){return 0!==t[e]}))){for(n in o)a.o(o,n)&&(a.m[n]=o[n]);if(l)var h=l(a)}for(e&&e(r);c<s.length;c++)i=s[c],a.o(t,i)&&t[i]&&t[i][0](),t[i]=0;return a.O(h)},r=self["webpackChunkkalman"]=self["webpackChunkkalman"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var r=a.O(void 0,[998],(function(){return a(5613)}));r=a.O(r)})();
//# sourceMappingURL=app.6e79dfe7.js.map