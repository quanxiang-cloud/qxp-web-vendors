System.register(["@one-for-all/utils","rxjs"],(function(e){"use strict";var t,s,n,r,i,o,a,c,u,p,d;return{setters:[function(e){t=e.logger},function(e){s=e.Subject,n=e.filter,r=e.switchMap,i=e.from,o=e.map,a=e.interval,c=e.tap,u=e.takeUntil,p=e.take,d=e.find}],execute:function(){e("n",(function(e,t){if(e&&"undefined"!=typeof document){var s,n=!0===t.prepend?"prepend":"append",r=!0===t.singleTag,i="string"==typeof t.container?document.querySelector(t.container):document.getElementsByTagName("head")[0];if(r){var o=l.indexOf(i);-1===o&&(o=l.push(i)-1,g[o]={}),s=g[o]&&g[o][n]?g[o][n]:g[o][n]=a()}else s=a();65279===e.charCodeAt(0)&&(e=e.substring(1)),s.styleSheet?s.styleSheet.cssText+=e:s.appendChild(document.createTextNode(e))}function a(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),t.attributes)for(var s=Object.keys(t.attributes),r=0;r<s.length;r++)e.setAttribute(s[r],t.attributes[s[r]]);var o="prepend"===n?"afterbegin":"beforeend";return i.insertAdjacentElement(o,e),e}}));var h,m={exports:{}};
/*!
			  Copyright (c) 2018 Jed Watson.
			  Licensed under the MIT License (MIT), see
			  http://jedwatson.github.io/classnames
			*/h=m,function(){var e={}.hasOwnProperty;function t(){for(var s=[],n=0;n<arguments.length;n++){var r=arguments[n];if(r){var i=typeof r;if("string"===i||"number"===i)s.push(r);else if(Array.isArray(r)){if(r.length){var o=t.apply(null,r);o&&s.push(o)}}else if("object"===i)if(r.toString===Object.prototype.toString)for(var a in r)e.call(r,a)&&r[a]&&s.push(a);else s.push(r.toString())}}return s.join(" ")}h.exports?(t.default=t,h.exports=t):window.classNames=t}();e("e",m.exports);e("d",class{constructor(e,n){if(this.seq=0,this.connected=!1,this.responderMap={},this.target=e,this.name=n,this.send$=new s,this.receive$=new s,window===e)throw new Error("Messenger: target can not be same as current window");this.isSubWin=window.parent===e,window.addEventListener("message",(e=>{if(e.origin!==window.origin)return;if(this.name===e.data.name)return;const s=performance.now();this.receive$.next(e.data);const n=performance.now()-s;n>10&&t.log(this.name,"execute on message cost:",n,"message type:",e.data.type)})),this.send$.subscribe((e=>{this.target.postMessage(e,window.origin)}))}addResponders(e){Object.entries(e).forEach((([e,t])=>{const s=this.receive$.pipe(n((t=>!!t.type&&t.type===e)),r((({message:e,seq:s})=>i(Promise.all([t(e),Promise.resolve(s)])))),o((([t,s])=>({type:`echo_${e}`,message:t,echoSeq:s,seq:this.nextSeq(),name:this.name})))).subscribe(this.send$);this.responderMap[e]&&this.responderMap[e].unsubscribe(),this.responderMap[e]=s}))}waitForReady(){return new Promise(((e,t)=>{let s;const n=setTimeout((()=>{null==s||s.unsubscribe(),t(new Error(`${this.name} messenger connection timeout`))}),5e3);this.isSubWin?s=a(200).pipe(c((()=>this.send("ping","ping"))),u(this.listen("ping"))).subscribe({complete:()=>{null==s||s.unsubscribe(),clearTimeout(n),this.connected=!0,e()}}):this.listen("ping").pipe(p(1)).subscribe((()=>{this.send("ping","ping"),clearTimeout(n),this.connected=!0,e()}))}))}nextSeq(){return this.seq=this.seq+1,this.seq}send(e,t){this.send$.next({type:e,message:t,seq:this.nextSeq(),name:this.name})}listen(e){return this.receive$.pipe(n((t=>!!t.type&&t.type===e)),o((({message:e})=>e)))}request(e,t){const s=this.nextSeq(),n=new Promise(((t,n)=>{const r=setTimeout((()=>{n(new Error(`messenger request timeout, request message type is: ${e}`))}),5e3),i=this.receive$.pipe(d((({echoSeq:e})=>e===s))).subscribe((e=>{i.unsubscribe(),clearTimeout(r),e?t(e.message):n(new Error("fatal"))}))}));return this.send$.next({type:e,message:t,seq:s,name:this.name}),n}});e("D","simulator_dragging_node_id"),e("f","artery_node"),e("c","artery"),e("b","active_node"),e("a","active_over_layer_node_id"),e("M","check_node_support_children"),e("g","dummy_artery_root_node_id");var l=[],g=[]}}}));
