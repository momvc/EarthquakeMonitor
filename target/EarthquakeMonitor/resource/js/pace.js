(function(){var AjaxMonitor,Bar,DocumentMonitor,ElementMonitor,ElementTracker,EventLagMonitor,Evented,Events,NoTargetError,Pace,RequestIntercept,SOURCE_KEYS,Scaler,SocketRequestTracker,XHRRequestTracker,animation,avgAmplitude,bar,cancelAnimation,cancelAnimationFrame,defaultOptions,extend,extendNative,getFromDOM,getIntercept,handlePushState,ignoreStack,init,now,options,requestAnimationFrame,result,runAnimation,scalers,shouldIgnoreURL,shouldTrack,source,sources,uniScaler,_WebSocket,_XDomainRequest,_XMLHttpRequest,_i,_intercept,_len,_pushState,_ref,_ref1,_replaceState,__slice=[].slice,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child},__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;l>i;i++)if(i in this&&this[i]===item)return i;return-1};for(defaultOptions={catchupTime:100,initialRate:.03,minTime:250,ghostTime:100,maxProgressPerFrame:20,easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnRequestAfter:500,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10,sampleCount:3,lagThreshold:3},ajax:{trackMethods:["GET"],trackWebSockets:!0,ignoreURLs:[]}},now=function(){var _ref;return null!=(_ref="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance.now():void 0)?_ref:+new Date},requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,cancelAnimationFrame=window.cancelAnimationFrame||window.mozCancelAnimationFrame,null==requestAnimationFrame&&(requestAnimationFrame=function(fn){return setTimeout(fn,50)},cancelAnimationFrame=function(id){return clearTimeout(id)}),runAnimation=function(fn){var last,tick;return last=now(),(tick=function(){var diff;return diff=now()-last,diff>=33?(last=now(),fn(diff,function(){return requestAnimationFrame(tick)})):setTimeout(tick,33-diff)})()},result=function(){var args,key,obj;return obj=arguments[0],key=arguments[1],args=3<=arguments.length?__slice.call(arguments,2):[],"function"==typeof obj[key]?obj[key].apply(obj,args):obj[key]},extend=function(){var key,out,source,sources,val,_i,_len;for(out=arguments[0],sources=2<=arguments.length?__slice.call(arguments,1):[],_i=0,_len=sources.length;_len>_i;_i++)if(source=sources[_i])for(key in source)__hasProp.call(source,key)&&(val=source[key],null!=out[key]&&"object"==typeof out[key]&&null!=val&&"object"==typeof val?extend(out[key],val):out[key]=val);return out},avgAmplitude=function(arr){var count,sum,v,_i,_len;for(sum=count=0,_i=0,_len=arr.length;_len>_i;_i++)v=arr[_i],sum+=Math.abs(v),count++;return sum/count},getFromDOM=function(key,json){var data,e,el;if(null==key&&(key="options"),null==json&&(json=!0),el=document.querySelector("[data-pace-"+key+"]")){if(data=el.getAttribute("data-pace-"+key),!json)return data;try{return JSON.parse(data)}catch(_error){return e=_error,"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",e):void 0}}},Evented=function(){function Evented(){}return Evented.prototype.on=function(event,handler,ctx,once){var _base;return null==once&&(once=!1),null==this.bindings&&(this.bindings={}),null==(_base=this.bindings)[event]&&(_base[event]=[]),this.bindings[event].push({handler:handler,ctx:ctx,once:once})},Evented.prototype.once=function(event,handler,ctx){return this.on(event,handler,ctx,!0)},Evented.prototype.off=function(event,handler){var i,_ref,_results;if(null!=(null!=(_ref=this.bindings)?_ref[event]:void 0)){if(null==handler)return delete this.bindings[event];for(i=0,_results=[];i<this.bindings[event].length;)_results.push(this.bindings[event][i].handler===handler?this.bindings[event].splice(i,1):i++);return _results}},Evented.prototype.trigger=function(){var args,ctx,event,handler,i,once,_ref,_ref1,_results;if(event=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[],null!=(_ref=this.bindings)?_ref[event]:void 0){for(i=0,_results=[];i<this.bindings[event].length;)_ref1=this.bindings[event][i],handler=_ref1.handler,ctx=_ref1.ctx,once=_ref1.once,handler.apply(null!=ctx?ctx:this,args),_results.push(once?this.bindings[event].splice(i,1):i++);return _results}},Evented}(),Pace=window.Pace||{},window.Pace=Pace,extend(Pace,Evented.prototype),options=Pace.options=extend({},defaultOptions,window.paceOptions,getFromDOM()),_ref=["ajax","document","eventLag","elements"],_i=0,_len=_ref.length;_len>_i;_i++)source=_ref[_i],options[source]===!0&&(options[source]=defaultOptions[source]);NoTargetError=function(_super){function NoTargetError(){return _ref1=NoTargetError.__super__.constructor.apply(this,arguments)}return __extends(NoTargetError,_super),NoTargetError}(Error),Bar=function(){function Bar(){this.progress=0}return Bar.prototype.getElement=function(){var targetElement;if(null==this.el){if(targetElement=document.querySelector(options.target),!targetElement)throw new NoTargetError;this.el=document.createElement("div"),this.el.className="pace pace-active",document.body.className=document.body.className.replace(/pace-done/g,""),document.body.className+=" pace-running",this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',null!=targetElement.firstChild?targetElement.insertBefore(this.el,targetElement.firstChild):targetElement.appendChild(this.el)}return this.el},Bar.prototype.finish=function(){var el;return el=this.getElement(),el.className=el.className.replace("pace-active",""),el.className+=" pace-inactive",document.body.className=document.body.className.replace("pace-running",""),document.body.className+=" pace-done"},Bar.prototype.update=function(prog){return this.progress=prog,this.render()},Bar.prototype.destroy=function(){try{this.getElement().parentNode.removeChild(this.getElement())}catch(_error){NoTargetError=_error}return this.el=void 0},Bar.prototype.render=function(){var el,key,progressStr,transform,_j,_len1,_ref2;if(null==document.querySelector(options.target))return!1;for(el=this.getElement(),transform="translate3d("+this.progress+"%, 0, 0)",_ref2=["webkitTransform","msTransform","transform"],_j=0,_len1=_ref2.length;_len1>_j;_j++)key=_ref2[_j],el.children[0].style[key]=transform;return(!this.lastRenderedProgress||this.lastRenderedProgress|0!==this.progress|0)&&(el.children[0].setAttribute("data-progress-text",""+(0|this.progress)+"%"),this.progress>=100?progressStr="99":(progressStr=this.progress<10?"0":"",progressStr+=0|this.progress),el.children[0].setAttribute("data-progress",""+progressStr)),this.lastRenderedProgress=this.progress},Bar.prototype.done=function(){return this.progress>=100},Bar}(),Events=function(){function Events(){this.bindings={}}return Events.prototype.trigger=function(name,val){var binding,_j,_len1,_ref2,_results;if(null!=this.bindings[name]){for(_ref2=this.bindings[name],_results=[],_j=0,_len1=_ref2.length;_len1>_j;_j++)binding=_ref2[_j],_results.push(binding.call(this,val));return _results}},Events.prototype.on=function(name,fn){var _base;return null==(_base=this.bindings)[name]&&(_base[name]=[]),this.bindings[name].push(fn)},Events}(),_XMLHttpRequest=window.XMLHttpRequest,_XDomainRequest=window.XDomainRequest,_WebSocket=window.WebSocket,extendNative=function(to,from){var e,key,_results;_results=[];for(key in from.prototype)try{_results.push(null==to[key]&&"function"!=typeof from[key]?"function"==typeof Object.defineProperty?Object.defineProperty(to,key,{get:function(){return from.prototype[key]},configurable:!0,enumerable:!0}):to[key]=from.prototype[key]:void 0)}catch(_error){e=_error}return _results},ignoreStack=[],Pace.ignore=function(){var args,fn,ret;return fn=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[],ignoreStack.unshift("ignore"),ret=fn.apply(null,args),ignoreStack.shift(),ret},Pace.track=function(){var args,fn,ret;return fn=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[],ignoreStack.unshift("track"),ret=fn.apply(null,args),ignoreStack.shift(),ret},shouldTrack=function(method){var _ref2;if(null==method&&(method="GET"),"track"===ignoreStack[0])return"force";if(!ignoreStack.length&&options.ajax){if("socket"===method&&options.ajax.trackWebSockets)return!0;if(_ref2=method.toUpperCase(),__indexOf.call(options.ajax.trackMethods,_ref2)>=0)return!0}return!1},RequestIntercept=function(_super){function RequestIntercept(){var monitorXHR,_this=this;RequestIntercept.__super__.constructor.apply(this,arguments),monitorXHR=function(req){var _open;return _open=req.open,req.open=function(type,url){return shouldTrack(type)&&_this.trigger("request",{type:type,url:url,request:req}),_open.apply(req,arguments)}},window.XMLHttpRequest=function(flags){var req;return req=new _XMLHttpRequest(flags),monitorXHR(req),req};try{extendNative(window.XMLHttpRequest,_XMLHttpRequest)}catch(_error){}if(null!=_XDomainRequest){window.XDomainRequest=function(){var req;return req=new _XDomainRequest,monitorXHR(req),req};try{extendNative(window.XDomainRequest,_XDomainRequest)}catch(_error){}}if(null!=_WebSocket&&options.ajax.trackWebSockets){window.WebSocket=function(url,protocols){var req;return req=null!=protocols?new _WebSocket(url,protocols):new _WebSocket(url),shouldTrack("socket")&&_this.trigger("request",{type:"socket",url:url,protocols:protocols,request:req}),req};try{extendNative(window.WebSocket,_WebSocket)}catch(_error){}}}return __extends(RequestIntercept,_super),RequestIntercept}(Events),_intercept=null,getIntercept=function(){return null==_intercept&&(_intercept=new RequestIntercept),_intercept},shouldIgnoreURL=function(url){var pattern,_j,_len1,_ref2;for(_ref2=options.ajax.ignoreURLs,_j=0,_len1=_ref2.length;_len1>_j;_j++)if(pattern=_ref2[_j],"string"==typeof pattern){if(-1!==url.indexOf(pattern))return!0}else if(pattern.test(url))return!0;return!1},getIntercept().on("request",function(_arg){var after,args,request,type,url;return type=_arg.type,request=_arg.request,url=_arg.url,shouldIgnoreURL(url)?void 0:Pace.running||options.restartOnRequestAfter===!1&&"force"!==shouldTrack(type)?void 0:(args=arguments,after=options.restartOnRequestAfter||0,"boolean"==typeof after&&(after=0),setTimeout(function(){var stillActive,_j,_len1,_ref2,_ref3,_results;if(stillActive="socket"===type?request.readyState<2:0<(_ref2=request.readyState)&&4>_ref2){for(Pace.restart(),_ref3=Pace.sources,_results=[],_j=0,_len1=_ref3.length;_len1>_j;_j++){if(source=_ref3[_j],source instanceof AjaxMonitor){source.watch.apply(source,args);break}_results.push(void 0)}return _results}},after))}),AjaxMonitor=function(){function AjaxMonitor(){var _this=this;this.elements=[],getIntercept().on("request",function(){return _this.watch.apply(_this,arguments)})}return AjaxMonitor.prototype.watch=function(_arg){var request,tracker,type,url;return type=_arg.type,request=_arg.request,url=_arg.url,shouldIgnoreURL(url)?void 0:(tracker="socket"===type?new SocketRequestTracker(request):new XHRRequestTracker(request),this.elements.push(tracker))},AjaxMonitor}(),XHRRequestTracker=function(){function XHRRequestTracker(request){var event,size,_j,_len1,_onreadystatechange,_ref2,_this=this;if(this.progress=0,null!=window.ProgressEvent)for(size=null,request.addEventListener("progress",function(evt){return _this.progress=evt.lengthComputable?100*evt.loaded/evt.total:_this.progress+(100-_this.progress)/2},!1),_ref2=["load","abort","timeout","error"],_j=0,_len1=_ref2.length;_len1>_j;_j++)event=_ref2[_j],request.addEventListener(event,function(){return _this.progress=100},!1);else _onreadystatechange=request.onreadystatechange,request.onreadystatechange=function(){var _ref3;return 0===(_ref3=request.readyState)||4===_ref3?_this.progress=100:3===request.readyState&&(_this.progress=50),"function"==typeof _onreadystatechange?_onreadystatechange.apply(null,arguments):void 0}}return XHRRequestTracker}(),SocketRequestTracker=function(){function SocketRequestTracker(request){var event,_j,_len1,_ref2,_this=this;for(this.progress=0,_ref2=["error","open"],_j=0,_len1=_ref2.length;_len1>_j;_j++)event=_ref2[_j],request.addEventListener(event,function(){return _this.progress=100},!1)}return SocketRequestTracker}(),ElementMonitor=function(){function ElementMonitor(options){var selector,_j,_len1,_ref2;for(null==options&&(options={}),this.elements=[],null==options.selectors&&(options.selectors=[]),_ref2=options.selectors,_j=0,_len1=_ref2.length;_len1>_j;_j++)selector=_ref2[_j],this.elements.push(new ElementTracker(selector))}return ElementMonitor}(),ElementTracker=function(){function ElementTracker(selector){this.selector=selector,this.progress=0,this.check()}return ElementTracker.prototype.check=function(){var _this=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return _this.check()},options.elements.checkInterval)},ElementTracker.prototype.done=function(){return this.progress=100},ElementTracker}(),DocumentMonitor=function(){function DocumentMonitor(){var _onreadystatechange,_ref2,_this=this;this.progress=null!=(_ref2=this.states[document.readyState])?_ref2:100,_onreadystatechange=document.onreadystatechange,document.onreadystatechange=function(){return null!=_this.states[document.readyState]&&(_this.progress=_this.states[document.readyState]),"function"==typeof _onreadystatechange?_onreadystatechange.apply(null,arguments):void 0}}return DocumentMonitor.prototype.states={loading:0,interactive:50,complete:100},DocumentMonitor}(),EventLagMonitor=function(){function EventLagMonitor(){var avg,interval,last,points,samples,_this=this;this.progress=0,avg=0,samples=[],points=0,last=now(),interval=setInterval(function(){var diff;return diff=now()-last-50,last=now(),samples.push(diff),samples.length>options.eventLag.sampleCount&&samples.shift(),avg=avgAmplitude(samples),++points>=options.eventLag.minSamples&&avg<options.eventLag.lagThreshold?(_this.progress=100,clearInterval(interval)):_this.progress=100*(3/(avg+3))},50)}return EventLagMonitor}(),Scaler=function(){function Scaler(source){this.source=source,this.last=this.sinceLastUpdate=0,this.rate=options.initialRate,this.catchup=0,this.progress=this.lastProgress=0,null!=this.source&&(this.progress=result(this.source,"progress"))}return Scaler.prototype.tick=function(frameTime,val){var scaling;return null==val&&(val=result(this.source,"progress")),val>=100&&(this.done=!0),val===this.last?this.sinceLastUpdate+=frameTime:(this.sinceLastUpdate&&(this.rate=(val-this.last)/this.sinceLastUpdate),this.catchup=(val-this.progress)/options.catchupTime,this.sinceLastUpdate=0,this.last=val),val>this.progress&&(this.progress+=this.catchup*frameTime),scaling=1-Math.pow(this.progress/100,options.easeFactor),this.progress+=scaling*this.rate*frameTime,this.progress=Math.min(this.lastProgress+options.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},Scaler}(),sources=null,scalers=null,bar=null,uniScaler=null,animation=null,cancelAnimation=null,Pace.running=!1,handlePushState=function(){return options.restartOnPushState?Pace.restart():void 0},null!=window.history.pushState&&(_pushState=window.history.pushState,window.history.pushState=function(){return handlePushState(),_pushState.apply(window.history,arguments)}),null!=window.history.replaceState&&(_replaceState=window.history.replaceState,window.history.replaceState=function(){return handlePushState(),_replaceState.apply(window.history,arguments)}),SOURCE_KEYS={ajax:AjaxMonitor,elements:ElementMonitor,document:DocumentMonitor,eventLag:EventLagMonitor},(init=function(){var type,_j,_k,_len1,_len2,_ref2,_ref3,_ref4;for(Pace.sources=sources=[],_ref2=["ajax","elements","document","eventLag"],_j=0,_len1=_ref2.length;_len1>_j;_j++)type=_ref2[_j],options[type]!==!1&&sources.push(new SOURCE_KEYS[type](options[type]));for(_ref4=null!=(_ref3=options.extraSources)?_ref3:[],_k=0,_len2=_ref4.length;_len2>_k;_k++)source=_ref4[_k],sources.push(new source(options));return Pace.bar=bar=new Bar,scalers=[],uniScaler=new Scaler})(),Pace.stop=function(){return Pace.trigger("stop"),Pace.running=!1,bar.destroy(),cancelAnimation=!0,null!=animation&&("function"==typeof cancelAnimationFrame&&cancelAnimationFrame(animation),animation=null),init()},Pace.restart=function(){return Pace.trigger("restart"),Pace.stop(),Pace.start()},Pace.go=function(){var start;return Pace.running=!0,bar.render(),start=now(),cancelAnimation=!1,animation=runAnimation(function(frameTime,enqueueNextFrame){var avg,count,done,element,elements,i,j,remaining,scaler,scalerList,sum,_j,_k,_len1,_len2,_ref2;for(remaining=100-bar.progress,count=sum=0,done=!0,i=_j=0,_len1=sources.length;_len1>_j;i=++_j)for(source=sources[i],scalerList=null!=scalers[i]?scalers[i]:scalers[i]=[],elements=null!=(_ref2=source.elements)?_ref2:[source],j=_k=0,_len2=elements.length;_len2>_k;j=++_k)element=elements[j],scaler=null!=scalerList[j]?scalerList[j]:scalerList[j]=new Scaler(element),done&=scaler.done,scaler.done||(count++,sum+=scaler.tick(frameTime));return avg=sum/count,bar.update(uniScaler.tick(frameTime,avg)),bar.done()||done||cancelAnimation?(bar.update(100),Pace.trigger("done"),setTimeout(function(){return bar.finish(),Pace.running=!1,Pace.trigger("hide")},Math.max(options.ghostTime,Math.max(options.minTime-(now()-start),0)))):enqueueNextFrame()})},Pace.start=function(_options){extend(options,_options),Pace.running=!0;try{bar.render()}catch(_error){NoTargetError=_error}return document.querySelector(".pace")?(Pace.trigger("start"),Pace.go()):setTimeout(Pace.start,50)},"function"==typeof define&&define.amd?define(["pace"],function(){return Pace}):"object"==typeof exports?module.exports=Pace:options.startOnPageLoad&&Pace.start()}).call(this);