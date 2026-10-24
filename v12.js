'use strict';
/* =========================================================
   v12: sound stops with its activity, menus open under their
   own button, one name per volunteer, autos get a clear road
   ========================================================= */

/* ---------- closing a panel stops anything playing inside it ---------- */
{const _cp=closePanel;closePanel=function(){const body=document.getElementById('pBody');let radio=false;
  if(body){body.querySelectorAll('iframe').forEach(f=>{try{f.src='about:blank';}catch(e){}f.remove();});body.querySelectorAll('video,audio').forEach(m=>{try{m.pause();m.removeAttribute('src');m.load();}catch(e){}});radio=!!body.querySelector('#rS');}
  const vidOn=typeof VID!=='undefined'&&VID&&VID.el&&!VID.el.paused;
  _cp();
  if(radio&&typeof radioStop==='function')try{radioStop();}catch(e){}
  if(vidOn&&typeof stopVideo==='function')try{stopVideo();}catch(e){}};}
/* the radio text no longer promises to keep playing */
{const _rp=radioPanel;radioPanel=function(d){_rp(d);const n=document.getElementById('rNow');if(!n)return;const fix=()=>{n.textContent=n.textContent.replace(' It keeps playing if you walk away.',' It stops when you close this.');};fix();new MutationObserver(fix).observe(n,{childList:true,characterData:true,subtree:true});};}

/* ---------- time and weather menus open right under their buttons ---------- */
function placeMenu(menu,btn){if(!menu||!btn||menu.hidden)return;const r=btn.getBoundingClientRect();const w=menu.offsetWidth||200;
  let left=r.right-w;left=Math.max(8,Math.min(left,innerWidth-w-8));menu.style.left=left+'px';menu.style.right='auto';menu.style.top=(r.bottom+8)+'px';}
for(const [m,b] of [['timeMenu','btnTime'],['weaMenu','btnWeather']]){const bt=document.getElementById(b);if(bt)bt.addEventListener('click',()=>{requestAnimationFrame(()=>placeMenu(document.getElementById(m),bt));});}
addEventListener('resize',()=>{placeMenu(document.getElementById('timeMenu'),document.getElementById('btnTime'));placeMenu(document.getElementById('weaMenu'),document.getElementById('btnWeather'));});

/* ---------- people who introduce themselves keep that name in their bubble ---------- */
TICKS.push(()=>{for(const n of npcs){if(n._named)continue;n._named=true;const m=/\bI'm ([A-Z][a-z]+)\b/.exec(n.line||'');if(m&&!['Just','Only','So','Not','Here','Going','Still','Sure','Fine','On','In'].includes(m[1]))n.name=m[1];}});

/* ---------- autos: people step aside instead of blocking the road ---------- */
let AUTO_T=performance.now();
autoBlocked=function(){if(!AUTO.car)return false;const now=performance.now();const dt=Math.min(0.1,(now-AUTO_T)/1000);AUTO_T=now;
  const c=AUTO.car;const fx=Math.sin(c.rotation.y),fz=Math.cos(c.rotation.y);let block=false;
  const rel=(x,z)=>{const dx=x-c.position.x,dz=z-c.position.z;return{along:dx*fx+dz*fz,side:dx*fz-dz*fx};};
  for(const n of npcs){const p=n.p;if(!p||!p.parent||p.parent!==scene||(p.userData&&p.userData.legs&&p.userData.legs[0].rotation.x<-1))continue;const q=rel(p.position.x,p.position.z);if(q.along<0.4||q.along>6)continue;const as=Math.abs(q.side);if(as>1.9)continue;
    /* step sideways, away from the auto's line */
    const sgn=q.side>=0?1:-1;const step=Math.min(1.9-as,dt*3.2);p.position.x+=fz*sgn*step;p.position.z+=-fx*sgn*step;
    if(as<1.15&&q.along<3)block=true;}
  for(const a of ANIMALS){if(!a.visible)continue;const q=rel(a.position.x,a.position.z);if(q.along>0.4&&q.along<4&&Math.abs(q.side)<1.7){const sgn=q.side>=0?1:-1;a.position.x+=fz*sgn*dt*3;a.position.z+=-fx*sgn*dt*3;if(Math.abs(q.side)<1&&q.along<2.5)block=true;}}
  if(TRAIN.cars)for(const tc of TRAIN.cars){const q=rel(tc.position.x,tc.position.z);if(q.along>0.8&&q.along<6&&Math.abs(q.side)<1.8)return true;}
  if(block){AUTO.blockT=(AUTO.blockT||0)+dt;if(AUTO.blockT>2.5)block=false;}else AUTO.blockT=0;
  return block;};
