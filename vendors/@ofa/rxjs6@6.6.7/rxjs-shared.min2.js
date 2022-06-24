/* rxjs@6.6.7 */
System.register(["./rxjs-shared.min.js"],(function(e){"use strict";var s,r,t,a,i,n,c,o;return{setters:[function(e){s=e.O,r=e.S,t=e.a,a=e.b,i=e.V,n=e.c,c=e.N,o=e.A}],execute:function(){class h{constructor(e,s=Number.POSITIVE_INFINITY){this.subscribedFrame=e,this.unsubscribedFrame=s}}class b{constructor(){this.subscriptions=[]}logSubscribedFrame(){return this.subscriptions.push(new h(this.scheduler.now())),this.subscriptions.length-1}logUnsubscribedFrame(e){const s=this.subscriptions,r=s[e];s[e]=new h(r.subscribedFrame,this.scheduler.now())}}class u extends s{constructor(e,s){super((function(e){const s=this,t=s.logSubscribedFrame(),a=new r;return a.add(new r((()=>{s.logUnsubscribedFrame(t)}))),s.scheduleMessages(e),a})),this.messages=e,this.subscriptions=[],this.scheduler=s}scheduleMessages(e){const s=this.messages.length;for(let r=0;r<s;r++){const s=this.messages[r];e.add(this.scheduler.schedule((({message:e,subscriber:s})=>{e.notification.observe(s)}),s.frame,{message:s,subscriber:e}))}}}t(u,[b]);class l extends a{constructor(e,s){super(),this.messages=e,this.subscriptions=[],this.scheduler=s}_subscribe(e){const s=this,t=s.logSubscribedFrame(),a=new r;return a.add(new r((()=>{s.logUnsubscribedFrame(t)}))),a.add(super._subscribe(e)),a}setup(){const e=this,s=e.messages.length;for(var r=0;r<s;r++)(()=>{var s=e.messages[r];e.scheduler.schedule((()=>{s.notification.observe(e)}),s.frame)})()}}t(l,[b]);class m extends i{constructor(e){super(n,750),this.assertDeepEqual=e,this.hotObservables=[],this.coldObservables=[],this.flushTests=[],this.runMode=!1}createTime(e){const s=e.indexOf("|");if(-1===s)throw new Error('marble diagram for time should have a completion marker "|"');return s*m.frameTimeFactor}createColdObservable(e,s,r){if(-1!==e.indexOf("^"))throw new Error('cold observable cannot have subscription offset "^"');if(-1!==e.indexOf("!"))throw new Error('cold observable cannot have unsubscription marker "!"');const t=m.parseMarbles(e,s,r,void 0,this.runMode),a=new u(t,this);return this.coldObservables.push(a),a}createHotObservable(e,s,r){if(-1!==e.indexOf("!"))throw new Error('hot observable cannot have unsubscription marker "!"');const t=m.parseMarbles(e,s,r,void 0,this.runMode),a=new l(t,this);return this.hotObservables.push(a),a}materializeInnerObservable(e,s){const r=[];return e.subscribe((e=>{r.push({frame:this.frame-s,notification:c.createNext(e)})}),(e=>{r.push({frame:this.frame-s,notification:c.createError(e)})}),(()=>{r.push({frame:this.frame-s,notification:c.createComplete()})})),r}expectObservable(e,r=null){const t=[],a={actual:t,ready:!1},i=m.parseMarblesAsSubscriptions(r,this.runMode),n=i.subscribedFrame===Number.POSITIVE_INFINITY?0:i.subscribedFrame,o=i.unsubscribedFrame;let h;this.schedule((()=>{h=e.subscribe((e=>{let r=e;e instanceof s&&(r=this.materializeInnerObservable(r,this.frame)),t.push({frame:this.frame,notification:c.createNext(r)})}),(e=>{t.push({frame:this.frame,notification:c.createError(e)})}),(()=>{t.push({frame:this.frame,notification:c.createComplete()})}))}),n),o!==Number.POSITIVE_INFINITY&&this.schedule((()=>h.unsubscribe()),o),this.flushTests.push(a);const{runMode:b}=this;return{toBe(e,s,r){a.ready=!0,a.expected=m.parseMarbles(e,s,r,!0,b)}}}expectSubscriptions(e){const s={actual:e,ready:!1};this.flushTests.push(s);const{runMode:r}=this;return{toBe(e){const t="string"==typeof e?[e]:e;s.ready=!0,s.expected=t.map((e=>m.parseMarblesAsSubscriptions(e,r)))}}}flush(){const e=this.hotObservables;for(;e.length>0;)e.shift().setup();super.flush(),this.flushTests=this.flushTests.filter((e=>!e.ready||(this.assertDeepEqual(e.actual,e.expected),!1)))}static parseMarblesAsSubscriptions(e,s=!1){if("string"!=typeof e)return new h(Number.POSITIVE_INFINITY);const r=e.length;let t=-1,a=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY,n=0;for(let c=0;c<r;c++){let r=n;const o=e=>{r+=e*this.frameTimeFactor},h=e[c];switch(h){case" ":s||o(1);break;case"-":o(1);break;case"(":t=n,o(1);break;case")":t=-1,o(1);break;case"^":if(a!==Number.POSITIVE_INFINITY)throw new Error("found a second subscription point '^' in a subscription marble diagram. There can only be one.");a=t>-1?t:n,o(1);break;case"!":if(i!==Number.POSITIVE_INFINITY)throw new Error("found a second subscription point '^' in a subscription marble diagram. There can only be one.");i=t>-1?t:n;break;default:if(s&&h.match(/^[0-9]$/)&&(0===c||" "===e[c-1])){const s=e.slice(c).match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);if(s){c+=s[0].length-1;const e=parseFloat(s[1]);let r;switch(s[2]){case"ms":r=e;break;case"s":r=1e3*e;break;case"m":r=1e3*e*60}o(r/this.frameTimeFactor);break}}throw new Error("there can only be '^' and '!' markers in a subscription marble diagram. Found instead '"+h+"'.")}n=r}return i<0?new h(a):new h(a,i)}static parseMarbles(e,s,r,t=!1,a=!1){if(-1!==e.indexOf("!"))throw new Error('conventional marble diagrams cannot have the unsubscription marker "!"');const i=e.length,n=[],o=a?e.replace(/^[ ]+/,"").indexOf("^"):e.indexOf("^");let h=-1===o?0:o*-this.frameTimeFactor;const b="object"!=typeof s?e=>e:e=>t&&s[e]instanceof u?s[e].messages:s[e];let l=-1;for(let s=0;s<i;s++){let t=h;const i=e=>{t+=e*this.frameTimeFactor};let o;const u=e[s];switch(u){case" ":a||i(1);break;case"-":case"^":i(1);break;case"(":l=h,i(1);break;case")":l=-1,i(1);break;case"|":o=c.createComplete(),i(1);break;case"#":o=c.createError(r||"error"),i(1);break;default:if(a&&u.match(/^[0-9]$/)&&(0===s||" "===e[s-1])){const r=e.slice(s).match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);if(r){s+=r[0].length-1;const e=parseFloat(r[1]);let t;switch(r[2]){case"ms":t=e;break;case"s":t=1e3*e;break;case"m":t=1e3*e*60}i(t/this.frameTimeFactor);break}}o=c.createNext(b(u)),i(1)}o&&n.push({frame:l>-1?l:h,notification:o}),h=t}return n}run(e){const s=m.frameTimeFactor,r=this.maxFrames;m.frameTimeFactor=1,this.maxFrames=Number.POSITIVE_INFINITY,this.runMode=!0,o.delegate=this;const t={cold:this.createColdObservable.bind(this),hot:this.createHotObservable.bind(this),flush:this.flush.bind(this),expectObservable:this.expectObservable.bind(this),expectSubscriptions:this.expectSubscriptions.bind(this)};try{const a=e(t);return this.flush(),a}finally{m.frameTimeFactor=s,this.maxFrames=r,this.runMode=!1,o.delegate=void 0}}}e("T",m)}}}));
