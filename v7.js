'use strict';
/* =========================================================
   V7: support settings, buddy, animals, levels & gates,
   auto-rickshaw, leave-anywhere, wider prompts, trip extras,
   engagement analytics.
   ========================================================= */

/* ---------- settings ---------- */
const SET=Object.assign({mobility:'walk',buddy:'none',bubbles:'show',animals:true,skip:false},store.get('set7',{}));
function saveSet(){store.set('set7',SET);}
const ANIMALS=[];
function applyAnimals(){ANIMALS.forEach(a=>{a.visible=!!SET.animals;});}

/* ---------- avatar: walking stick, wheelchair ---------- */
function makeStick(){const g=new THREE.Group();const m=M('#7a5236');const s=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.95,6),m);s.position.y=-0.47;g.add(s);const h=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.022,5,10,Math.PI),m);h.position.set(0.07,0,0);g.add(h);return g;}
{const _rb=rebuildAvatar;rebuildAvatar=function(){_rb();dressAvatar();};}
function dressAvatar(){if(!avatar)return;const u=avatar.userData;if(u.chair){avatar.remove(u.chair);u.chair=null;}if(u.stick&&u.stick.parent){u.stick.parent.remove(u.stick);u.stick=null;}
  if(SET.mobility==='wheel'){const ch=makeWheelchair();avatar.add(ch);u.chair=ch;}
  if(SET.mobility==='stick'){const st=makeStick();st.position.set(0,-0.62,0.06);u.arms[0].add(st);u.stick=st;}
  if(typeof applyNameTag==='function')applyNameTag();}
function wheelAnim(dt,sp){const u=avatar.userData;resetPose(avatar);sitPose(avatar);u.body.position.y=-0.2;const t=performance.now()/1000;
  u.arms.forEach((a,i)=>a.rotation.x=-0.4-(sp>0.1?Math.max(0,Math.sin(t*sp*0.7+i*0.2))*0.5:0));if(u.chair)u.chair.userData.wheels.forEach(w=>w.rotation.x+=sp*dt/0.32);}
TICKS.push(()=>{if(!avatar)return;const u=avatar.userData;if(u.chair){u.chair.visible=!player.action&&!player.bike;if(!player.action&&!player.bike&&!player.moving&&SET.mobility==='wheel'){resetPose(avatar);sitPose(avatar);u.body.position.y=-0.2;u.arms.forEach(a=>a.rotation.x=-0.4);}}
  if(u.stick)u.stick.visible=!player.action&&!player.bike;});
{const _mb=mountBike;mountBike=function(){if(SET.mobility==='wheel'){toast('Bikes need pedalling. The auto-rickshaws are step-free and go everywhere.');return;}_mb();};}

/* ---------- a walking buddy ---------- */
const BUDDY={p:null,dog:null,x:0,z:0,dx:0,dz:0,said:0};
const BUDDY_LINES=["I like walking with you. No need to talk.","Want to sit somewhere for a bit? Either way is fine.","That was nice. Where next?","Take your time. I'm not in a rush.","Look at the sky right now.","I'm right here."];
function syncBuddy(){[BUDDY.p,BUDDY.dog].forEach(o=>{if(o&&o.parent)o.parent.remove(o);});BUDDY.p=null;BUDDY.dog=null;
  if(SET.buddy==='friend'){BUDDY.p=makePerson({shirt:'#4fc3a1',style:4,pack:true});scene.add(BUDDY.p);}
  if(SET.buddy==='dog'){BUDDY.dog=makeDog('#e0b070');scene.add(BUDDY.dog);}
  BUDDY.x=player.x+1.4;BUDDY.z=player.z+1;BUDDY.dx=player.x-1.2;BUDDY.dz=player.z+1.2;}
function updateBuddy(dt,t){const room=!!W.camBounds;
  const step=(o,ox,oz,isDog)=>{if(!o)return;if(o.parent!==scene)scene.add(o);o.visible=!room&&!player.action&&!(CINE&&CINE.hideAvatar);if(!o.visible){if(isDog){BUDDY.dx=player.x;BUDDY.dz=player.z;}else{BUDDY.x=player.x;BUDDY.z=player.z;}return;}
    const sy=Math.sin(player.rot),cy=Math.cos(player.rot);const tx=player.x+cy*ox-sy*oz,tz=player.z-sy*ox-cy*oz;const cx=isDog?BUDDY.dx:BUDDY.x,cz=isDog?BUDDY.dz:BUDDY.z;const dx=tx-cx,dz=tz-cz;const d=Math.hypot(dx,dz);
    let nx=cx,nz=cz,moving=false;if(d>0.35){const sp=Math.min(d,(player.moving?Math.max(4,d*2.4):2.5)*dt);nx+=dx/d*sp;nz+=dz/d*sp;moving=true;}if(d>14){nx=tx;nz=tz;}
    const p={x:nx,z:nz};resolve(p);if(isDog){BUDDY.dx=p.x;BUDDY.dz=p.z;}else{BUDDY.x=p.x;BUDDY.z=p.z;}o.position.set(p.x,W.groundY?W.groundY(p.x,p.z):0,p.z);
    if(moving){let r=Math.atan2(dx,dz);let da=r-o.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));o.rotation.y+=da*Math.min(1,dt*8);}
    if(isDog)dogAnim(o,t,moving);else if(moving)walkAnim(o,t,1);else idleAnim(o,t);};
  step(BUDDY.p,1.3,-0.4,false);step(BUDDY.dog,-1.1,-0.6,true);
  if(BUDDY.p&&W.main&&!player.action&&!panelOpen){BUDDY.said-=dt;if(BUDDY.said<=0&&!player.moving){BUDDY.said=45;if(SET.bubbles!=='hide')toast(`Your buddy: "${pick(BUDDY_LINES)}"`,3200);}}}
TICKS.push((dt,t)=>{if(started)updateBuddy(dt,t);});

/* ---------- animals: cats and squirrels ---------- */
const CAT_COATS={orange:['#e39550','#f6dcbc'],tux:['#2b2b30','#f6f3ec'],grey:['#9a9da3','#e0e1e4'],calico:['#f4ebdd','#d17a3a']};
function makeCat(coat){const [a,b]=CAT_COATS[coat]||CAT_COATS.orange;const g=new THREE.Group();
  const body=new THREE.Group();g.add(body);const torso=sph(0.24,a,0,0.32,0,body,10);torso.scale.set(0.8,0.75,1.4);sph(0.16,b,0,0.27,0.18,body,8).scale.set(0.8,0.7,1);
  const head=new THREE.Group();head.position.set(0,0.5,0.32);body.add(head);sph(0.16,a,0,0,0,head,10);sph(0.08,b,0,-0.05,0.11,head,8);
  for(const sx of [-0.08,0.08]){const e=cone(0.06,0.12,a,sx,0.15,-0.01,head,4);e.rotation.z=-sx*2;}
  for(const sx of [-0.06,0.06])sph(0.022,'#2a3a24',sx,0.03,0.14,head,6,false);
  const legs=[];for(const [lx,lz] of [[-0.09,0.17],[0.09,0.17],[-0.09,-0.17],[0.09,-0.17]]){const pv=new THREE.Group();pv.position.set(lx,0.24,lz);body.add(pv);cyl(0.04,0.035,0.24,coat==='tux'&&lz>0?b:a,0,-0.12,0,pv,6);legs.push(pv);}
  const tail=new THREE.Group();tail.position.set(0,0.36,-0.3);body.add(tail);const tm=cyl(0.03,0.025,0.5,a,0,0.22,-0.04,tail,6);tm.rotation.x=-0.3;
  g.userData={legs,tail,head,body};return g;}
function makeSquirrel(){const g=new THREE.Group();const fur='#a0724a',belly='#ecd9bd';
  const body=new THREE.Group();g.add(body);const tb=sph(0.1,fur,0,0.13,0,body,8);tb.scale.set(0.8,0.85,1.3);
  for(const sx of [-0.035,0,0.035])box(0.014,0.012,0.2,sx===0?'#3e342c':'#f6efe2',sx,0.215,-0.01,body,false);
  sph(0.07,fur,0,0.2,0.12,body,8);sph(0.012,'#1d1d1d',-0.035,0.225,0.17,body,5,false);sph(0.012,'#1d1d1d',0.035,0.225,0.17,body,5,false);sph(0.05,belly,0,0.1,0.07,body,6,false);
  const tail=new THREE.Group();tail.position.set(0,0.14,-0.12);body.add(tail);const tl=sph(0.07,fur,0,0.14,-0.04,tail,8);tl.scale.set(0.8,2.2,0.8);tl.rotation.x=-0.3;
  g.userData={body,tail};return g;}
function addCat(coat,x,z,home,name,line){const c=makeCat(coat);c.position.set(x,0,z);scene.add(c);ANIMALS.push(c);const st={tx:x,tz:z,wait:rr(1,4),mode:'sit',purr:0};let sp_=null;
  updaters.push((dt,t)=>{if(sp_){sp_.tx=c.position.x;sp_.tz=c.position.z;}if(!c.visible)return;const u=c.userData;u.tail.rotation.y=Math.sin(t*1.5+x)*0.5;
    if(st.purr>0){st.purr-=dt;u.head.rotation.x=Math.sin(t*3)*0.1;}
    if(st.wait>0){st.wait-=dt;u.legs.forEach(l=>l.rotation.x*=0.9);if(st.mode==='sit')u.body.rotation.x=-0.25;return;}
    u.body.rotation.x=0;const dx=st.tx-c.position.x,dz=st.tz-c.position.z;const d=Math.hypot(dx,dz);
    if(d<0.2){st.wait=rr(4,10);st.mode=rnd()<0.6?'sit':'stand';const a=rnd()*TAU,r=rr(1,home.r);st.tx=home.x+Math.cos(a)*r;st.tz=home.z+Math.sin(a)*r;if(onPaved(st.tx,st.tz,0)&&rnd()<0.5){st.tx=home.x;st.tz=home.z;}return;}
    const sp=Math.min(d,0.9*dt);c.position.x+=dx/d*sp;c.position.z+=dz/d*sp;let da=Math.atan2(dx,dz)-c.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));c.rotation.y+=da*Math.min(1,dt*5);
    const s=Math.sin(t*9)*0.5;u.legs[0].rotation.x=s;u.legs[3].rotation.x=s;u.legs[1].rotation.x=-s;u.legs[2].rotation.x=-s;});
  sp_={label:`Say hello to ${name}`,sub:line,color:'#e39550',tx:x,tz:z,tr:1.6,ok:()=>c.visible,run:()=>{st.purr=4;st.wait=Math.max(st.wait,5);c.rotation.y=Math.atan2(player.x-c.position.x,player.z-c.position.z);
    for(let i=0;i<5;i++){const h=pillSprite('♥',null,0.35,{fs:44,bg:'rgba(255,255,255,0)',fg:'#ff6f91'});h.position.set(c.position.x+rr(-0.3,0.3),0.8,c.position.z+rr(-0.3,0.3));scene.add(h);let tt=0;const fn=dt=>{tt+=dt;h.position.y+=dt*0.6;h.material.opacity=Math.max(0,1-tt/1.6);if(tt>1.6){scene.remove(h);updaters.splice(updaters.indexOf(fn),1);}};updaters.push(fn);}
    if(typeof tone==='function'){sfxInit();tone(160,0.6,0.03,'sine',140);}toast(`${name} purrs and leans into your hand.`,2600);track('animal',{id:name.toLowerCase()});award(2,`Said hi to ${name}`,'cat-'+name);{const k=store.get('awarded',{});if(['Mango','Biscuit','Dhuan','Pixel'].every(n=>k['cat-'+n]))earnBadge('catfriend');}}};SPOTS.push(sp_);
  return {c,st};}
function addSquirrel(x,z,r){const s=makeSquirrel();s.position.set(x,0,z);scene.add(s);ANIMALS.push(s);const st={tx:x,tz:z,wait:rr(0,3),hop:0};
  updaters.push((dt,t)=>{if(!s.visible)return;const u=s.userData;u.tail.rotation.x=-0.3+Math.sin(t*4+x)*0.15;
    const near=Math.hypot(player.x-s.position.x,player.z-s.position.z)<3.5;if(near&&st.wait>0){st.wait=0;const a=Math.atan2(s.position.z-player.z,s.position.x-player.x);st.tx=s.position.x+Math.cos(a)*4;st.tz=s.position.z+Math.sin(a)*4;}
    if(st.wait>0){st.wait-=dt;u.body.position.y=0;u.body.rotation.x=-0.5+Math.sin(t*6)*0.05;return;}
    u.body.rotation.x=0;const dx=st.tx-s.position.x,dz=st.tz-s.position.z;const d=Math.hypot(dx,dz);if(d<0.15){st.wait=rr(1.5,5);const a=rnd()*TAU;st.tx=x+Math.cos(a)*rr(0,r);st.tz=z+Math.sin(a)*rr(0,r);return;}
    const sp=Math.min(d,(near?4:2.2)*dt);s.position.x+=dx/d*sp;s.position.z+=dz/d*sp;s.rotation.y=Math.atan2(dx,dz);st.hop+=dt*14;u.body.position.y=Math.abs(Math.sin(st.hop))*0.12;});}
function buildAnimals(){
  addCat('orange',36,30,{x:36,z:30,r:7},'Mango','The café cat. Very much in charge.');
  addCat('tux',-40,44,{x:-40,z:44,r:7},'Biscuit','Shy at first. Then very friendly.');
  addCat('grey',-34,-30,{x:-34,z:-30,r:6},'Dhuan','Loves a sunny patch near the library.');
  addCat('calico',-128,-36,{x:-128,z:-36,r:7},'Pixel','Lives near the museum steps.');
  for(const [x,z] of [[-22,-24],[30,-60],[-70,-12],[22,36],[-66,56]])addSquirrel(x,z,5);
  applyAnimals();}

/* ---------- levels: areas open one by one ---------- */
const DISTRICTS=[
 {id:'centre',name:'City Centre',short:'City Centre',color:'#4fae8a',need:3,blurb:'The heart of the city: the fountain, gardens, café, post office and more.',dir:'You\'re here'},
 {id:'creative',name:'Creative Quarter',short:'Creative Quarter',color:'#9a86c9',need:2,blurb:'An art garden, a dance floor, a theatre, a museum and the Policy Circle.',dir:'Head out of the west (purple) gate, or take an auto.'},
 {id:'joy',name:'Joy Park',short:'Joy Park',color:'#e2729a',need:2,blurb:'Four gentle rides: the giant wheel, carousel, coaster and swings.',dir:'Head out of the east (pink) gate, or take an auto.'},
 {id:'sky',name:'Sky Port',short:'Sky Port',color:'#3fa0c8',need:0,blurb:'Fly to the mountains or the sea, ride a hot air balloon, or take a nap.',dir:'Head out of the north (blue) gate, or take an auto.'}];
DISTRICTS.forEach((d,i)=>d.level=i);const DIST={};DISTRICTS.forEach(d=>DIST[d.id]=d);
const ACTS={fountain:['centre','Wishing Fountain'],breath:['centre','Breathing Garden'],yoga:['centre','Stretch Lawn'],worry:['centre','Worry Lake'],mood:['centre','Mood Café'],kind:['centre','Kindness Post'],help:['centre','Support Booth'],study:['centre','Study Hall & Library'],arcade:['centre','Thought Bubble Arcade'],music:['centre','Music Pavilion'],
  museum:['creative','Museum'],theatre:['creative','Theatre'],ymhweek:['creative','YMH Week'],policy:['creative','Policy Circle'],paint:['creative','Paint Studio'],dance:['creative','Dance Floor'],
  tea:['sky','Tea garden'],scope:['sky','Telescope'],kite:['sky','Kite flying'],bottles:['sky','Messages in bottles'],eye:['joy','Big Picture Wheel'],carousel:['joy','Carousel'],coaster:['joy','Ups & Downs coaster'],swingset:['joy','The Swings'],
  flight:['sky','A flight'],balloonride:['sky','Hot air balloon'],nap:['sky','A nap'],campfire:['sky','Campfire'],cairn:['sky','Pebble Tower'],skip:['sky','Skipping stones'],sand:['sky','Writing in the sand'],castle:['sky','Sandcastle']};
const PROG=Object.assign({done:{},level:0},store.get('prog7',{}));
function saveProg(){store.set('prog7',PROG);}
function openLevel(){return SET.skip?3:PROG.level;}
function isOpen(id){return DIST[id]?DIST[id].level<=openLevel():true;}
function doneIn(d){return Object.keys(PROG.done).filter(k=>ACTS[k]&&ACTS[k][0]===d).length;}
function done(id){const a=ACTS[id];track('activity_complete',{id,district:a?a[0]:'',repeat:PROG.done[id]?1:0});if(!a)return;const first=!PROG.done[id];PROG.done[id]=(PROG.done[id]||0)+1;saveProg();
  if(first){const cur=DISTRICTS[PROG.level];const left=cur&&a[0]===cur.id&&PROG.level<3&&!SET.skip?Math.max(0,cur.need-doneIn(cur.id)):0;floatNote(`${a[1]} · done`,left>0?`${left} more to open ${DISTRICTS[PROG.level+1].name}`:'');}
  checkUnlock();updateLevelCard();}
function floatNote(a,b){const el=document.createElement('div');el.className='donefloat';el.innerHTML=`<b>✓ ${esc(a)}</b>${b?`<span>${esc(b)}</span>`:''}`;document.body.appendChild(el);setTimeout(()=>el.remove(),4600);}
function checkUnlock(){if(SET.skip)return;let opened=null;while(PROG.level<3){const cur=DISTRICTS[PROG.level];if(doneIn(cur.id)<cur.need)break;PROG.level++;saveProg();opened=DISTRICTS[PROG.level];track('level_unlock',{id:opened.id,level:PROG.level});}
  if(opened){syncGates();setTimeout(()=>showUnlock(opened),900);}}
function showUnlock(d){const u=$('unlock');$('unlockLvl').textContent=`Level ${d.level} unlocked`;$('unlockName').textContent=`${d.name} is open`;$('unlockText').textContent=d.blurb;$('unlockDir').textContent=d.dir;
  u.style.setProperty('--zc',d.color);u.hidden=false;speak(`Level ${d.level} unlocked. ${d.name} is open. ${d.blurb} ${d.dir}`);
  $('unlockGo').onclick=()=>{u.hidden=true;const hub={creative:{x:-124,z:-12,rot:-Math.PI/2},joy:{x:112,z:-12,rot:Math.PI/2},sky:{x:24,z:-104,rot:Math.PI}}[d.id];if(hub)goTo({name:d.name,x:hub.x+Math.sin(hub.rot),z:hub.z+Math.cos(hub.rot),spot:{x:hub.x,z:hub.z}});};
  $('unlockLater').onclick=()=>{u.hidden=true;};setTimeout(()=>$('unlockGo').focus(),50);}
function updateLevelCard(){const el=$('lvl');if(!el)return;const L=openLevel();
  if(L>=3){el.innerHTML=`<div class="lv-top"><span class="lv-badge" style="background:#3fa0c8">All open</span><b>Every area is open</b></div><div class="lv-sub">Wander anywhere you like. Tap to see your journey.</div>`;return;}
  const cur=DISTRICTS[L],nx=DISTRICTS[L+1];const n=Math.min(cur.need,doneIn(cur.id));
  el.innerHTML=`<div class="lv-top"><span class="lv-badge" style="background:${cur.color}">${L===0?'Start':'Level '+L}</span><b>${esc(cur.name)}</b></div><div class="lv-goal">Try <b>${cur.need-n}</b> more ${cur.need-n===1?'activity':'activities'} here</div><div class="lv-dots">${Array.from({length:cur.need},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}<span>to open <b>${esc(nx.name)}</b></span></div>`;}
function openJourney(){openPanel({title:'How the city opens up',eyebrow:'Your journey',color:'#4fae8a',sub:'Each area opens when you\'ve tried a few things in the one before. Go at your own pace.',build:b=>{const L=openLevel();
  b.innerHTML=DISTRICTS.map(d=>{const acts=Object.keys(ACTS).filter(k=>ACTS[k][0]===d.id);const open=d.level<=L;const n=doneIn(d.id);
    return `<div class="jr ${open?'open':''}" style="--zc:${d.color}"><div class="jr-h"><span class="lv-badge" style="background:${d.color}">${d.level===0?'Start':'Level '+d.level}</span><b>${esc(d.name)}</b><span class="meta">${open?(d.need?`${Math.min(n,d.need)} of ${d.need} done`:'Open'):'Locked'}</span></div>
    <p class="meta">${esc(d.blurb)}${d.need&&d.level<3?` Try any ${d.need} to open ${esc(DISTRICTS[d.level+1].name)}.`:''}</p><div class="jr-acts">${acts.map(k=>`<span class="${PROG.done[k]?'got':''}">${PROG.done[k]?'✓ ':''}${esc(ACTS[k][1])}</span>`).join('')}</div></div>`;}).join('')+
    `<div class="row" style="margin-top:12px"><button class="btn" type="button" id="jrH">Show the big instructions again</button></div>`;
  b.querySelector('#jrH').addEventListener('click',()=>{closePanel();showHowTo();});}});}
function showHowTo(){const h=$('howto');h.hidden=false;setTimeout(()=>$('howGo').focus(),50);$('howGo').onclick=()=>{h.hidden=true;store.set('howto7',1);};}

/* ---------- locked gates ---------- */
const GATES=[];
function gateLeaf(len,col){const g=new THREE.Group();for(let i=0;i<=Math.round(len/0.45);i++){box(0.1,2.6,0.1,col,i*0.45,1.3,0,g,false);}box(len,0.14,0.14,col,len/2,2.55,0,g,false);box(len,0.14,0.14,col,len/2,0.35,0,g,false);box(len,0.1,0.1,col,len/2,1.45,0,g,false);return g;}
function buildGates(){const G=(id,x,z,ry,gap)=>{const g=grp(x,z,ry);const d=DIST[id];const L=gateLeaf(gap/2-0.15,'#3f4f6b'),R=gateLeaf(gap/2-0.15,'#3f4f6b');L.position.x=-gap/2;R.position.x=gap/2;R.scale.x=-1;g.add(L);g.add(R);
    const dl=Math.hypot(x,z);const sx=x-x/dl*3.2,sz=z-z/dl*3.2;const st=grp(sx,sz,Math.atan2(-x,-z));const prev=DISTRICTS[d.level-1];
    cyl(0.08,0.08,2.2,'#56657d',-2.3,1.1,0,st,6);cyl(0.08,0.08,2.2,'#56657d',2.3,1.1,0,st,6);sign(`${d.name} opens at Level ${d.level}`,`Try ${prev.need} activities in the ${prev.short} first`,d.color,'#ffffff',5.6,1.6,st,0,2.4,0);
    const lk=sph(0.25,'#ffd166',0,3.5,0,st,10);lk.material=LAMP_MAT;
    GATES.push({id,g,L,R,st,open:0,target:0});};
  G('creative',-88,-12,Math.PI/2,10);G('joy',88,-12,-Math.PI/2,10);G('sky',24,-88,Math.PI,10);
  updaters.push(dt=>{for(const q of GATES){q.open+=(q.target-q.open)*Math.min(1,dt*1.5);q.L.rotation.y=-q.open*1.45;q.R.rotation.y=q.open*1.45;q.st.visible=q.target<0.5;}});
  syncGates(true);}
function syncGates(instant){GATES.forEach(q=>{q.target=isOpen(q.id)?1:0;if(instant)q.open=q.target;});}
function lockedAt(x,z){if(SET.skip)return null;const L=PROG.level;if(L<1&&x<-89)return DIST.creative;if(L<2&&x>89)return DIST.joy;if(L<3&&z<-89)return DIST.sky;return null;}
let lockToastT=0;function lockToast(d){const now=performance.now();if(now-lockToastT<3500)return;lockToastT=now;const prev=DISTRICTS[d.level-1];const n=Math.min(prev.need,doneIn(prev.id));
  toast(`${d.name} opens at Level ${d.level}. Try ${prev.need-n} more ${prev.need-n===1?'activity':'activities'} in the ${prev.short} first.`,4200);}
{const _b=MAIN.bounds;MAIN.bounds=(p,ox,oz)=>{_b(p,ox,oz);const d=lockedAt(p.x,p.z);if(d&&!lockedAt(ox,oz)){p.x=ox;p.z=oz;lockToast(d);}};}
{const _g=goTo;goTo=function(pl){const s=pl.spot||pl;const d=lockedAt(s.x,s.z);if(d){lockToast(d);return;}_g(pl);};
 const _t=travelTo;travelTo=function(x,z){const d=lockedAt(x,z);if(d){lockToast(d);return;}_t(x,z);};}
/* train: no getting off at stations that aren't open yet */
function stationLocked(st){return lockedAt(st.plat.x,st.plat.z);}
{const _ta=trainArrive;trainArrive=function(st){if(stationLocked(st)){if(TRAIN.riding)toast(`${st.name}: this stop opens later. Stay on for now.`,2400);return;}_ta(st);};}
function trainCard(b){b.innerHTML=`<p class="mindful" id="trNext"></p><p class="lead" id="trMsg">Look out at the city as it rolls past. No rush to get anywhere.</p><div class="row"><button class="btn" type="button" id="trHop" aria-pressed="false">Get off at the next open stop</button><button class="btn primary" type="button" id="trNow">Get off here</button></div>`;
  const upd=()=>{const st=STATIONS[TRAIN.next];const lk=stationLocked(st);b.querySelector('#trNext').textContent=TRAIN.stop>0?`Stopped at ${st.name}${lk?' (opens later)':''}`:`Next stop: ${st.name}${lk?' (opens later)':''}`;b.querySelector('#trNow').disabled=!(TRAIN.stop>0)||!!lk;b.querySelector('#trHop').textContent=TRAIN.hop?'Getting off at the next open stop':'Get off at the next open stop';};upd();
  b.querySelector('#trHop').addEventListener('click',()=>{TRAIN.hop=!TRAIN.hop;upd();});b.querySelector('#trNow').addEventListener('click',()=>{const st=STATIONS[TRAIN.next];if(TRAIN.stop>0&&!stationLocked(st)){player.action.exit=st.plat;player.action.exitRot=st.face;closePanel();toast(`Welcome to ${st.name}`);}});
  const iv=setInterval(upd,400);return ()=>clearInterval(iv);}

/* ---------- auto-rickshaws ---------- */
const AUTO_STANDS=[
 {id:'gate',dist:'centre',name:'Main gate',x:-16,z:82.5,path:[[-16,82.5],[-8,82.4],[-2.6,80],[-2.6,34],[-2.6,28.4]]},
 {id:'centre',dist:'centre',name:'Central Plaza',x:-23.8,z:24.6,path:[[-23.8,24.6],[-20.2,20.6]]},
 {id:'creative',dist:'creative',name:'Creative Quarter',x:-118.5,z:8,path:[[-118.5,8],[-118.5,-9.6],[-104,-9.6],[-27.2,-9.6]]},
 {id:'joy',dist:'joy',name:'Joy Park',x:114,z:7,path:[[114,7],[114,-9.6],[100,-9.6],[27.2,-9.6]]},
 {id:'sky',dist:'sky',name:'Sky Port',x:34,z:-104,path:[[34,-104],[26.4,-100],[26.4,-30],[22.4,-17.6]]}];
function makeAuto(){const g=new THREE.Group();const green='#2e9e4f',yellow='#ffcc1a',black='#2b2b2b';
  box(1.5,0.35,2.6,green,0,0.55,0,g);const nose=box(1.1,1.0,0.7,green,0,1.0,1.25,g);nose.scale.x=0.9;box(1.2,0.12,0.9,black,0,1.55,1.1,g,false);
  const glass=box(1.0,0.6,0.06,'#cfe3ec',0,1.6,1.5,g,false);glass.material=WIN_MAT;
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,2.4,16,1,false,-Math.PI/2,Math.PI),M(yellow));roof.rotation.x=Math.PI/2;roof.scale.set(0.85,1,0.5);roof.position.set(0,1.85,-0.1);roof.castShadow=true;g.add(roof);
  for(const sx of [-0.7,0.7])for(const sz of [0.9,-1.1])cyl(0.04,0.04,1.3,black,sx,1.25,sz,g,5,false);
  box(1.3,0.45,0.6,black,0,0.95,-0.85,g);box(1.3,0.6,0.12,black,0,1.2,-1.18,g);box(0.5,0.35,0.5,'#5a3d2a',0,0.92,0.45,g);box(1.52,0.12,2.62,yellow,0,0.78,0,g,false);
  const wheels=[];for(const [x,z] of [[0,1.35],[-0.72,-0.8],[0.72,-0.8]]){const w=cyl(0.3,0.3,0.18,black,x,0.3,z,g,14);w.rotation.z=Math.PI/2;wheels.push(w);}
  const hl=sph(0.12,'#fff',0,1.0,1.62,g,8,false);hl.material=LAMP_MAT;bar(g,[-0.35,1.3,0.75],[0.35,1.3,0.75],0.025,'#9aa3ad');
  const drv=makePerson({pack:false,shirt:'#d9c7a5'});sitPose(drv);drv.position.set(0,0.62,0.4);drv.userData.arms.forEach(a=>a.rotation.x=-1.0);g.add(drv);
  const seat=new THREE.Object3D();seat.position.set(-0.28,0.92,-0.82);g.add(seat);g.userData={wheels,seat,drv};return g;}
const AUTO={riding:false,car:null,route:null,s:0,len:0,dest:null,from:null,ui:null};
function buildAutos(){AUTO_STANDS.forEach(st=>{const a=makeAuto();a.position.set(st.x,0,st.z);const nx=(st.path[1]||[0,0])[0]-st.x,nz=(st.path[1]||[0,0])[1]-st.z;a.rotation.y=st.path[1]?Math.atan2(nx,nz):Math.atan2(-st.z,st.x)+Math.PI;scene.add(a);st.car=a;st.home={x:st.x,z:st.z,ry:a.rotation.y};
    const sg_=grp(st.x+Math.cos(a.rotation.y)*2.4,st.z-Math.sin(a.rotation.y)*2.4,a.rotation.y);cyl(0.06,0.06,2.4,'#56657d',0,1.2,0,sg_,6);sign('Auto stand','free rides',"#2e9e4f",'#ffffff',1.9,0.75,sg_,0,2.5,0.05);
    addBox(st.x,st.z,0.8,1.4,a.rotation.y);
    SPOTS.push({label:'Hop in an auto-rickshaw',sub:'Free rides to any open area',color:'#2e9e4f',tx:st.x,tz:st.z,tr:3.4,ok:()=>!AUTO.riding,run:()=>autoPanel(st)});});
  updaters.push((dt,t)=>{if(!AUTO.riding||!AUTO.route)return;const sp=Math.min(13,AUTO.s<6?3+AUTO.s*2:13,Math.max(2.5,(AUTO.len-AUTO.s)*1.6))*(A11Y.rm?0.75:1);AUTO.s+=sp*dt;const p=routeAt(AUTO.route,AUTO.s);const car=AUTO.car;
    let da=p.h-car.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));car.rotation.y+=da*Math.min(1,dt*5);car.position.set(p.x,Math.abs(Math.sin(t*14))*0.02,p.z);car.userData.wheels.forEach(w=>w.rotation.x+=sp*dt/0.3);
    if(AUTO.ui)AUTO.ui(AUTO.s/AUTO.len);if(AUTO.s>=AUTO.len)arriveAuto();});}
function buildRoute(a,b){const R=28.5;const pts=a.path.map(p=>({x:p[0],z:p[1]}));const last=pts[pts.length-1];const a0=Math.atan2(last.z,last.x);const bl=b.path[b.path.length-1];const a1=Math.atan2(bl[1],bl[0]);
  let d=a1-a0;d=Math.atan2(Math.sin(d),Math.cos(d));const n=Math.max(2,Math.ceil(Math.abs(d)/0.12));for(let i=1;i<n;i++){const aa=a0+d*i/n;pts.push({x:Math.cos(aa)*R,z:Math.sin(aa)*R});}
  for(let i=b.path.length-1;i>=0;i--)pts.push({x:b.path[i][0],z:b.path[i][1]});const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z));return{pts,cum,len:cum[cum.length-1]};}
function routeAt(r,s){s=clamp(s,0,r.len);let i=1;while(i<r.cum.length-1&&r.cum[i]<s)i++;const a=r.pts[i-1],b=r.pts[i];const t=(s-r.cum[i-1])/((r.cum[i]-r.cum[i-1])||1);return{x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,h:Math.atan2(b.x-a.x,b.z-a.z)};}
function autoPanel(st){openPanel({title:'Where to?',eyebrow:'Auto-rickshaw',color:'#2e9e4f',sub:'Free, and the driver knows every road.',build:b=>{
  b.innerHTML=`<div class="goto" id="auD"></div><p class="meta" style="margin-top:12px">Step-free. The driver will help you in, wheelchair users too.</p>`;const D=b.querySelector('#auD');
  AUTO_STANDS.forEach(d=>{if(d===st)return;const open=isOpen(d.dist);const x=document.createElement('button');x.type='button';x.disabled=!open;x.innerHTML=`<i style="background:${open?DIST[d.dist].color:'#c3c8ce'}"></i><span>${esc(d.name)}${open?'':` · opens at Level ${DIST[d.dist].level}`}</span>`;x.addEventListener('click',()=>{closePanel();rideAuto(st,d);});D.appendChild(x);});}});}
const AUTO_LINES=['The driver hums along to an old Kishore Kumar song.','"First time in YMH City? You\'ll like it here."','The driver slows down so you can see the fountain.','Wind in your face, city rolling by.','"Take your time getting out. No hurry."'];
function rideAuto(st,d){fadeTo(()=>{AUTO.riding=true;AUTO.car=st.car;AUTO.route=buildRoute(st,d);AUTO.s=0;AUTO.len=AUTO.route.len;AUTO.dest=d;AUTO.from=st;track('ride',{id:'auto-'+d.id});
  openPanel({dock:true,title:`To ${d.name}`,eyebrow:'Auto-rickshaw',color:'#2e9e4f',sub:'Sit back.',build:b=>{b.innerHTML=`<p class="mindful">${pick(AUTO_LINES)}</p><div class="bar"><i id="auB"></i></div><div class="row" style="margin-top:10px"><button class="btn" type="button" id="auS">Skip to the stop</button></div>`;const B_=b.querySelector('#auB');AUTO.ui=k=>{B_.style.width=(k*100)+'%';};b.querySelector('#auS').addEventListener('click',()=>{AUTO.s=AUTO.len;});return ()=>{AUTO.ui=null;};}});
  startAction({lock:true,pose:POSE.sit,follow:()=>{st.car.userData.seat.getWorldPosition(_tv);player.x=_tv.x;player.y=_tv.y-0.15;player.z=_tv.z;player.rot=st.car.rotation.y;},camOff:Math.PI+0.6,dist:8,pitch:0.28,onEnd:()=>{if(AUTO.riding){AUTO.riding=false;resetAuto(st);}}});});}
function resetAuto(st){const a=st.car;setTimeout(()=>{if(AUTO.riding&&AUTO.car===a)return;a.position.set(st.home.x,0,st.home.z);a.rotation.y=st.home.ry;},5000);}
function arriveAuto(){const d=AUTO.dest,st=AUTO.from;AUTO.riding=false;const car=st.car;const side={x:car.position.x+Math.cos(car.rotation.y)*-1.8,z:car.position.z-Math.sin(car.rotation.y)*-1.8};
  if(player.action)player.action.exit=side;if(panelOpen)closePanel();if(player.action)endAction();toast(`${d.name}. Thanks for riding!`,2600);resetAuto(st);}

/* ---------- way-finding posts in each corner of the centre ---------- */
function fingerTex(lines,col,flip){return cardTex(512,128*lines.length,(x,W,H)=>{lines.forEach((l,i)=>{const y=i*128;x.fillStyle=i===0?col:'#ffffff';x.beginPath();if(!flip){x.moveTo(0,y+10);x.lineTo(W-60,y+10);x.lineTo(W-6,y+64);x.lineTo(W-60,y+118);x.lineTo(0,y+118);}else{x.moveTo(W,y+10);x.lineTo(60,y+10);x.lineTo(6,y+64);x.lineTo(60,y+118);x.lineTo(W,y+118);}x.closePath();x.fill();
  x.fillStyle=i===0?'#ffffff':'#1d2b44';x.textBaseline='middle';fitFont(x,l,i===0?800:600,i===0?54:42,i===0?FD:FB,W-100);x.fillText(l,flip?76:24,y+66);});});}
function buildFingerposts(){const HOODS=[{n:'Calm Garden',c:'#5aa63a',ids:['breath','yoga']},{n:'Connect Corner',c:'#f2874f',ids:['mood','kind','help']},{n:'Focus Corner',c:'#3d6fd6',ids:['study','arcade']},{n:'Lakeside',c:'#2f95cc',ids:['worry','sound']}];
  HOODS.forEach(h=>{const zs=h.ids.map(i=>Z[i]);const cx=zs.reduce((a,z)=>a+z.x,0)/zs.length,cz=zs.reduce((a,z)=>a+z.z,0)/zs.length;const a=Math.atan2(cz,cx);const r=34.5;const x=Math.cos(a)*r,z=Math.sin(a)*r;
    const g=grp(x,z,0);cyl(0.1,0.13,4,'#56657d',0,2,0,g,8);sph(0.18,'#ffd166',0,4.1,0,g,8);addCircle(x,z,0.3);
    const tex=fingerTex([h.n,...zs.map(q=>q.name)],h.c);const hgt=0.62*(zs.length+1);
    const bd=new THREE.Mesh(new THREE.PlaneGeometry(2.5,hgt),new THREE.MeshBasicMaterial({map:tex,transparent:true}));const piv=new THREE.Group();piv.position.set(0,3.75-hgt/2,0);piv.rotation.y=-a;g.add(piv);bd.position.set(1.35,0,0);bd.rotation.y=0;piv.add(bd);
    const back=new THREE.Mesh(bd.geometry,new THREE.MeshBasicMaterial({map:fingerTex([h.n,...zs.map(q=>q.name)],h.c,true),transparent:true}));back.position.set(1.35,0,-0.02);back.rotation.y=Math.PI;piv.add(back);
    zs.forEach(zn=>zn.hood=h.n);});}

/* ---------- prompts: bigger and from any side ---------- */
function widenPrompts(){for(const zn of ZONES){if(['mood','kind','help','study','arcade'].includes(zn.id)){zn.tx=zn.x;zn.tz=zn.z;zn.tr=zn.id==='help'?11:13.5;}
    else if(zn.id==='breath'){zn.tx=zn.x;zn.tz=zn.z;zn.tr=14;}else if(zn.id==='sound'){zn.tx=zn.x;zn.tz=zn.z;zn.tr=11;}else if(zn.id==='yoga'){zn.tr=12;}else if(zn.id==='worry'){zn.tx=LAKE.x;zn.tz=LAKE.z;zn.tr=LAKE.r+6;}else if(zn.id==='fountain'){zn.tr=12;}}
  for(const sp of MAIN.spots){if(sp.tr<3)sp.tr*=1.35;}}
/* zones that are rooms now */
{const _oz=openZone;openZone=function(z){track('place',{id:z.id});
  const R={mood:CAFE_W,kind:POST_W,help:HELP_W,study:STUDY_W};if(R[z.id]){const w=R[z.id];enterWorld(w,{x:0,z:(w===STUDY_W?10:w===HELP_W?6.5:w===POST_W?7:8)-4.2},Math.PI);return;}
  _oz(z);};}

/* ---------- small completions in the centre ---------- */
{const f=ACT.fountain;ACT.fountain=b=>{f(b);const go=b.querySelector('#fGo');go.addEventListener('click',()=>{if(b.querySelector('#fWish').value.trim())done('fountain');},true);};}
{const f=ACT.worry;ACT.worry=b=>{f(b);const go=b.querySelector('#wGo');go.addEventListener('click',()=>{if(b.querySelector('#wText').value.trim())done('worry');},true);};}
{const f=ACT.breath;ACT.breath=b=>{const cl=f(b);const iv=setInterval(()=>{const r=b.querySelector('#bRounds');if(r&&parseInt(r.textContent)>=1){done('breath');clearInterval(iv);}},1000);return ()=>{clearInterval(iv);if(cl)cl();};};}
{const f=ACT.yoga;ACT.yoga=b=>{const cl=f(b);const iv=setInterval(()=>{const s=b.querySelector('#yStep');if(s&&/Move [3-6]|Done/.test(s.textContent)){done('yoga');clearInterval(iv);}},1000);return ()=>{clearInterval(iv);if(cl)cl();};};}

/* ---------- leave from anywhere inside ---------- */
function canLeave(){return !!(started&&!W.main&&!CINE&&!switching&&(W.exitTo||W.leave));}
function doLeave(){if(!canLeave())return;if(panelOpen)closePanel();if(player.action)endAction();if(W.exitTo){const e=W.exitTo;enterWorld(MAIN,e,e.rot);}else W.leave();}
TICKS.push(()=>{const b=$('btnLeave');if(!b)return;const ok=canLeave();if(b.hidden===ok){b.hidden=!ok;if(ok)b.querySelector('span').textContent=W.leaveLabel||'Leave';}});
window.addEventListener('keydown',e=>{const tag=(e.target.tagName||'').toLowerCase();if(tag==='textarea'||tag==='input')return;if(e.code==='KeyX'&&canLeave()&&!(panelOpen&&!panelDock))doLeave();if(e.code==='KeyJ'&&started&&!panelOpen)openJourney();});

/* ---------- trips: two new things at the mountains and the sea ---------- */
function spot7(o){SPOTS.push({label:o.label,sub:o.sub,color:o.color,tx:o.x,tz:o.z,tr:o.r*0.6,ok:o.ok,run:o.run});}
function clearAround(x,z,r){scene.children.slice().forEach(c=>{if(c.type==='Group'&&!c.userData.legs&&!c.userData.wheels&&c.position.y===0&&Math.hypot(c.position.x-x,c.position.z-z)<r&&c.children.length>1&&c.children.length<30)scene.remove(c);});for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.t===0&&Math.hypot(c.x-x,c.z-z)<r)colliders.splice(i,1);}}
const STILL=t=>{resetPose(avatar);idleAnim(avatar,t);};
function buildCairn(cx,cz){clearAround(cx,cz,6);cyl(1.1,1.3,0.4,'#8a8f96',cx,0.2,cz,null,10);addCircle(cx,cz,1.2);for(let i=0;i<8;i++){const a=rnd()*TAU;const s=sph(rr(0.25,0.45),pick(['#9aa1a8','#8a8f96','#a8adb3']),cx+2.4+Math.cos(a)*0.8,0.2,cz+Math.sin(a)*0.8,null,6);s.scale.y=0.55;}
  const sg=sign('Pebble Tower','stack six stones, no wobbling','#6f7782','#ffffff',2.8,0.8,null,cx-2.6,1.4,cz+1.2,0.4);
  const C={stack:[],top:0.4,stone:null,t:0,active:false};const MW={scene:scene,updaters:updaters};
  spot7({x:cx,z:cz,r:4,label:'Pebble Tower',sub:'Stack six stones without them falling',color:'#6f7782',run:()=>{C.active=true;
    startAction({x:cx,z:cz+2.4,rot:Math.PI,pose:STILL,camOff:Math.PI+0.3,dist:5.5,pitch:0.25,exit:{x:cx,z:cz+3},onEnd:()=>{C.active=false;if(C.stone){scene.remove(C.stone);C.stone=null;}}});
    const next=()=>{const k=C.stack.length;const s=sph(0.6-k*0.06,pick(['#9aa1a8','#8a8f96','#b0a89c','#a3a9b0']),cx,C.top+1.6,cz,null,9);s.scale.y=0.5;C.stone=s;C.t=0;};next();
    openPanel({dock:true,title:'Pebble Tower',eyebrow:'Mountain Retreat',color:'#6f7782',sub:'Place each stone when it\'s right over the stack.',build:b=>{b.innerHTML=`<p class="lead">The stone sways a little. Wait for the moment it\'s centred, then place it. There\'s no timer.</p><div class="row"><button class="btn primary big" type="button" id="caP">Place the stone</button><span class="meta" id="caN">0 of 6 stones</span></div><p class="mindful" id="caM" aria-live="polite" style="margin-top:10px"></p>`;
      const btn=b.querySelector('#caP'),m=b.querySelector('#caM');const place=()=>{if(!C.stone)return;const off=C.stone.position.x-cx;const tol=0.34-C.stack.length*0.03;
        if(Math.abs(off)<tol){C.stone.position.set(cx+off*0.5,C.top+0.18,cz);C.top+=0.3;C.stack.push(C.stone);C.stone=null;sfxInit();tone(300+C.stack.length*60,0.3,0.06,'sine');b.querySelector('#caN').textContent=`${C.stack.length} of 6 stones`;
          if(C.stack.length>=6){m.textContent='Six stones, balanced. Leave it here for the next person to find.';btn.disabled=true;done('cairn');award(10,'Built a cairn','cairn');}else{m.textContent=pick(['Steady.','That one sat nicely.','Good. Next one.','Nice and slow.']);next();}}
        else{const s=C.stone;C.stone=null;m.textContent='It slid off. That happens. Try again when you\'re ready.';let tt=0;const fn=dt=>{tt+=dt;s.position.y-=dt*3;s.position.x+=Math.sign(off)*dt*1.5;if(s.position.y<0.2){MW.scene.remove(s);MW.updaters.splice(MW.updaters.indexOf(fn),1);next();}};MW.updaters.push(fn);}};
      btn.addEventListener('click',place);const kd=e=>{if(e.code==='Space'){e.preventDefault();place();}};addEventListener('keydown',kd);return ()=>removeEventListener('keydown',kd);}});}});
  updaters.push((dt,t)=>{if(!C.active||!C.stone)return;C.t+=dt;const sp=1.2+C.stack.length*0.15;C.stone.position.x=cx+Math.sin(C.t*sp)*0.9;C.stone.position.y=C.top+1.4+Math.sin(C.t*2)*0.05;});}
function buildSkip(x0,z0,lx,lz){const dirx=lx-x0,dirz=lz-z0,dl=Math.hypot(dirx,dirz);const ux=dirx/dl,uz=dirz/dl;clearAround(x0-ux*1.5,z0-uz*1.5,4);
  for(let i=0;i<6;i++){const s=sph(0.18,'#a3a9b0',x0+rr(-0.8,0.8)-ux*1.5,0.08,z0+rr(-0.8,0.8)-uz*1.5,null,6);s.scale.y=0.4;}
  const S={phase:0,power:0,going:false};const rings=[];const MW={scene:scene,updaters:updaters};
  spot7({x:x0-ux*1.5,z:z0-uz*1.5,r:3.2,label:'Skip stones on the lake',sub:'Let go when the marker is in the green',color:'#4f9fc4',run:()=>{
    startAction({x:x0-ux*1.6,z:z0-uz*1.6,rot:Math.atan2(ux,uz),pose:STILL,camOff:Math.PI-0.3,dist:6,pitch:0.25,exit:{x:x0-ux*3,z:z0-uz*3}});
    openPanel({dock:true,title:'Skip a stone',eyebrow:'Mountain Retreat',color:'#4f9fc4',sub:'Flat stones, still water.',build:b=>{b.innerHTML=`<div class="aim"><span class="aim-g"></span><i id="skI"></i></div><div class="row"><button class="btn primary big" type="button" id="skT">Throw</button><span class="meta" id="skB">Best: 0 skips</span></div><p class="mindful" id="skM" aria-live="polite" style="margin-top:10px">Watch the marker. Throw when it\'s in the green.</p>`;
      let best=0,raf=0;const I=b.querySelector('#skI');const loopA=()=>{S.phase+=0.025;S.power=(Math.sin(S.phase)+1)/2;I.style.left=(S.power*100)+'%';raf=requestAnimationFrame(loopA);};loopA();
      const throwIt=()=>{if(S.going)return;const acc=1-Math.min(1,Math.abs(S.power-0.5)/0.5);const skips=Math.max(1,Math.round(acc*6));S.going=true;player.gest='throw';player.gestT=player.gestD=0.6;sfxInit();
        const st=sph(0.22,'#c9ced6',player.x,1.4,player.z,null,8);st.scale.y=0.45;let k=0;const hop=6/skips+2;const pts=[];for(let i=0;i<=skips;i++)pts.push(2+i*hop*(1-i*0.06));
        let t=0;const fn=dt=>{t+=dt*1.8;const seg=Math.floor(t);if(seg>=skips){MW.scene.remove(st);MW.updaters.splice(MW.updaters.indexOf(fn),1);S.going=false;best=Math.max(best,skips);const _sb=b.querySelector('#skB'),_sm=b.querySelector('#skM')||{};if(_sb)_sb.textContent=`Best: ${best} skip${best===1?'':'s'}`;_sm.textContent=skips>=5?`${skips} skips. Lovely.`:skips>=3?`${skips} skips.`:`${skips} skip${skips===1?'':'s'}. Try another?`;if(skips>=3){done('skip');award(5,'Skipped a stone','skip');}return;}
          const f=t-seg;const d0=pts[seg],d1=pts[seg+1]||pts[seg]+1;const d=d0+(d1-d0)*f;st.position.set(x0+ux*d,0.1+Math.sin(f*Math.PI)*(seg?0.6/seg:1.2),z0+uz*d);
          if(seg!==k){k=seg;const r=new THREE.Mesh(new THREE.RingGeometry(0.2,0.3,24),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.8}));r.rotation.x=-Math.PI/2;r.position.set(st.position.x,0.08,st.position.z);MW.scene.add(r);rings.push({r,t:0});tone(900+k*80,0.08,0.05,'sine',600);burst(1800+k*200,'bandpass',0.18,0.09,1.2);}};MW.updaters.push(fn);burst(400,'lowpass',0.2,0.08);};
      b.querySelector('#skT').addEventListener('click',throwIt);const kd=e=>{if(e.code==='Space'){e.preventDefault();throwIt();}};addEventListener('keydown',kd);return ()=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);};}});}});
  updaters.push(dt=>{for(let i=rings.length-1;i>=0;i--){const o=rings[i];o.t+=dt;o.r.scale.setScalar(1+o.t*6);o.r.material.opacity=Math.max(0,0.8-o.t*0.6);if(o.t>1.4){MW.scene.remove(o.r);rings.splice(i,1);}}});}
function buildSandWriting(cx,cz){clearAround(cx,cz,8);const cv=document.createElement('canvas');cv.width=1024;cv.height=256;const x=cv.getContext('2d');const tex=new THREE.CanvasTexture(cv);
  const draw=(txt,a)=>{x.clearRect(0,0,1024,256);if(!txt)return;x.globalAlpha=a;x.fillStyle='rgba(150,118,80,.85)';x.textAlign='center';x.textBaseline='middle';fitFont(x,txt,600,150,FD,960);x.fillText(txt,512,128);x.fillStyle='rgba(255,245,225,.6)';x.fillText(txt,516,124);x.globalAlpha=1;tex.needsUpdate=true;};
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(12,3),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));pl.rotation.x=-Math.PI/2;pl.position.set(cx,0.05,cz);scene.add(pl);
  const stick=cyl(0.03,0.03,1.4,'#8a6a4e',cx+7,0.7,cz+1,null,5);stick.rotation.z=0.4;
  const wave=new THREE.Mesh(new THREE.PlaneGeometry(16,3),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));wave.rotation.x=-Math.PI/2;wave.position.set(cx,0.07,cz-6);scene.add(wave);
  const S={txt:'',a:0,washing:0};
  updaters.push(dt=>{if(S.washing>0){S.washing+=dt;const k=Math.min(1,S.washing/4);wave.position.z=cz-6+k*8;wave.material.opacity=Math.sin(k*Math.PI)*0.75;if(k>0.45){S.a=Math.max(0,S.a-dt*0.6);draw(S.txt,S.a);}if(k>=1){S.washing=0;S.txt='';draw('',0);}}});
  spot7({x:cx,z:cz+2.5,r:6.5,label:'Write something in the sand',sub:'Then let a wave smooth it over',color:'#c9a87c',run:()=>{startAction({x:cx,z:cz+3,rot:Math.PI,pose:t=>{resetPose(avatar);avatar.userData.arms[1].rotation.x=-0.9+Math.sin(t*4)*0.2;avatar.userData.head.rotation.x=0.4;},camOff:Math.PI+0.2,dist:7,pitch:0.6,exit:{x:cx,z:cz+4}});
    openPanel({dock:true,title:'Write in the sand',eyebrow:'Beach Cove',color:'#c9a87c',sub:'A word, a name, a wish.',build:b=>{b.innerHTML=`<p class="lead">Write it big. When you're ready, let a wave come in and smooth the sand again. Nothing is saved.</p><input type="text" id="sdT" maxlength="24" placeholder="hello sea"><div class="row" style="margin-top:10px"><button class="btn" type="button" id="sdW">Write it</button><button class="btn primary" type="button" id="sdG">Let the wave take it</button></div>`;
      b.querySelector('#sdW').addEventListener('click',()=>{const v=b.querySelector('#sdT').value.trim();if(!v)return;S.txt=v;S.a=1;draw(v,1);});
      b.querySelector('#sdG').addEventListener('click',()=>{if(!S.txt)return;S.washing=0.001;sfxInit();burst(500,'lowpass',2.4,0.12,0.7);b.querySelector('#sdT').value='';done('sand');award(5,'Wrote in the sand','sand');setTimeout(()=>toast('Smooth sand again.',2400),3600);});}});}});}
function buildSandcastle(cx,cz){clearAround(cx,cz,6);const g=grp(cx,cz,0);flat(new THREE.CircleGeometry(3,24),'#dcc69c',0,0.03,0,2,g);const parts=[];const sandC=['#e2c48e','#d8b77f','#e6cf9f'];
  const add_={tower:()=>{const a=parts.length*1.1,r=1.3;const t=cyl(0.42,0.5,1.1,pick(sandC),Math.cos(a)*r,0.55,Math.sin(a)*r,g,10);cone(0.5,0.3,pick(sandC),Math.cos(a)*r,1.25,Math.sin(a)*r,g,10);return t;},
    wall:()=>{const a=parts.length*1.1+0.5,r=1.4;const w_=box(1.4,0.55,0.35,pick(sandC),Math.cos(a)*r,0.28,Math.sin(a)*r,g);w_.rotation.y=-a+Math.PI/2;return w_;},
    keep:()=>{const k=box(1.2,1.5,1.2,pick(sandC),0,0.75+parts.filter(p=>p.k).length*0.9,0,g);k.k=1;return k;},
    flag:()=>{const y=1.6+parts.filter(p=>p.k).length*0.9;cyl(0.02,0.02,1,'#8a6a4e',0,y,0,g,4,false);return box(0.4,0.25,0.02,pick(['#ff6f61','#2fa39a','#ffd166']),0.2,y+0.35,0,g,false);},
    shells:()=>{for(let i=0;i<5;i++){const a=rnd()*TAU;const s=sph(0.1,pick(['#f2c9c0','#fff4e6','#e9b9a8']),Math.cos(a)*2.2,0.08,Math.sin(a)*2.2,g,6);s.scale.y=0.5;}return {};}};
  addCircle(cx,cz,1.8);
  spot7({x:cx,z:cz,r:4.6,label:'Build a sandcastle',sub:'Towers, walls, a flag, some shells',color:'#d9a35b',run:()=>{startAction({x:cx,z:cz+3,rot:Math.PI,pose:t=>{resetPose(avatar);crossPose(avatar);avatar.userData.arms.forEach(a=>a.rotation.x=-1+Math.sin(t*3)*0.2);},y:-0.6,camOff:Math.PI+0.5,dist:6,pitch:0.45,exit:{x:cx,z:cz+4}});
    openPanel({dock:true,title:'Build a sandcastle',eyebrow:'Beach Cove',color:'#d9a35b',sub:'Add pieces in any order. It doesn\'t have to make sense.',build:b=>{b.innerHTML=`<div class="seg" id="scB"><button type="button" data-p="keep">Main tower</button><button type="button" data-p="tower">Small tower</button><button type="button" data-p="wall">Wall</button><button type="button" data-p="flag">Flag</button><button type="button" data-p="shells">Shells</button></div><p class="mindful" id="scM" style="margin-top:12px">Pat the sand down and start wherever you like.</p><div class="row"><button class="btn ghost" type="button" id="scX">Let the tide have it</button></div>`;
      let n=0;b.querySelectorAll('[data-p]').forEach(x=>x.addEventListener('click',()=>{const p=add_[x.dataset.p]();if(p)parts.push(p);n++;sfxInit();burst(400,'lowpass',0.2,0.08,0.7);b.querySelector('#scM').textContent=n>=6?'That\'s a proper castle. Someone walking by will smile at it.':pick(['Pat, pat.','Looking good.','Steady hands.','More?']);if(n===6){done('castle');award(10,'Built a sandcastle','castle');}}));
      b.querySelector('#scX').addEventListener('click',()=>{g.children.slice(1).forEach(c=>g.remove(c));parts.length=0;n=0;b.querySelector('#scM').textContent='Smooth sand. Start again whenever you like.';});}});}});}
{const bm=MOUNTAIN_W.build;MOUNTAIN_W.build=w=>{bm(w);buildCairn(22,-18);buildSkip(-13.4,-12.6,-26,-14);};MOUNTAIN_W.leave=()=>flyHome();MOUNTAIN_W.leaveLabel='Fly home';MOUNTAIN_W.title='Mountain Retreat';}
{const bb=BEACH_W.build;BEACH_W.build=w=>{bb(w);buildSandWriting(40,5);buildSandcastle(-40,15);};BEACH_W.leave=()=>flyHome();BEACH_W.leaveLabel='Fly home';}
{const _o=MOUNTAIN_W.onEnter;MOUNTAIN_W.onEnter=()=>{if(_o)_o();done('flight');track('place',{id:'mountain'});};const _b=BEACH_W.onEnter;BEACH_W.onEnter=()=>{if(_b)_b();done('flight');track('place',{id:'beach'});};}

/* ---------- engagement analytics ---------- */
const CFG=window.YMH_CONFIG||{};
const uid4=()=>{try{return crypto.randomUUID();}catch(e){return 'v'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);}};
const STATS=Object.assign({vid:uid4(),first:Date.now(),last:0,visits:0,ev:{}},store.get('stats7',{}));
(function session(){let sid=null;try{sid=sessionStorage.getItem('ymh7.sid');}catch(e){}const fresh=!sid||Date.now()-(STATS.last||0)>30*60*1000;if(fresh){STATS.visits++;try{sessionStorage.setItem('ymh7.sid',uid4());}catch(e){}}STATS.last=Date.now();store.set('stats7',STATS);})();
if(CFG.ga4&&/^G-[A-Z0-9]+$/.test(CFG.ga4)){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+CFG.ga4;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config',CFG.ga4,{anonymize_ip:true});}
let statsDirty=true;
function track(name,p){p=p||{};const key=name+(p.id?':'+p.id:'');const e=STATS.ev[key]||(STATS.ev[key]={n:0,first:Date.now()});e.n++;e.last=Date.now();STATS.last=Date.now();store.set('stats7',STATS);statsDirty=true;
  const payload=Object.assign({event:name,visitor:STATS.vid,visit:STATS.visits,returning:STATS.visits>1?1:0,first_time_for_visitor:e.n===1?1:0,t:Date.now()},p);
  try{if(window.gtag)gtag('event','ymh_'+name,Object.assign({},p,{returning_visitor:payload.returning,first_time_for_visitor:payload.first_time_for_visitor}));}catch(err){}
  try{if(CFG.endpoint&&navigator.sendBeacon)navigator.sendBeacon(CFG.endpoint,new Blob([JSON.stringify(payload)],{type:'application/json'}));}catch(err){}}
let USER=null;
{const _i=initDB;initDB=async function(){await _i();try{if(window.claude&&window.claude.use){USER=await window.claude.use('user');}}catch(e){}if(DB&&UID){syncStats();setInterval(syncStats,20000);document.addEventListener('visibilitychange',()=>{if(document.hidden)syncStats();});}};}
async function syncStats(){if(!DB||!UID||!statsDirty)return;statsDirty=false;const ev={};for(const k in STATS.ev){ev[k.replace(/[.\/]/g,'_')]=STATS.ev[k];}try{await DB.doc('stats/'+UID).set({vid:STATS.vid,first:STATS.first,last:STATS.last,visits:STATS.visits,ev});}catch(e){}}
async function isOwner(){try{return !!(USER&&USER.isOwner&&await USER.isOwner());}catch(e){return false;}}
async function openStats(){if(!(await isOwner())){toast('Visitor stats are only visible to the city\'s owner.');return;}
  openPanel({wide:true,title:'Visitor stats',eyebrow:'Owner only',color:'#3d6fd6',sub:'Counts from everyone who opened this page and allowed saving.',build:b=>{b.innerHTML='<p class="meta">Loading…</p>';(async()=>{let docs=[];try{const q=await DB.collection('stats').get();docs=q.docs.map(d=>d.data()||{});}catch(e){}
    const visitors=docs.length,returning=docs.filter(d=>(d.visits||0)>1).length,visits=docs.reduce((a,d)=>a+(d.visits||0),0);const agg={};
    docs.forEach(d=>{for(const k in (d.ev||{})){const a=agg[k]||(agg[k]={users:0,total:0,repeat:0});a.users++;a.total+=d.ev[k].n||0;if((d.ev[k].n||0)>1)a.repeat++;}});
    const rows=Object.keys(agg).sort((a,c)=>agg[c].users-agg[a].users).map(k=>`<tr><td>${esc(k.replace(/_/g,' '))}</td><td>${agg[k].users}</td><td>${agg[k].repeat}</td><td>${agg[k].total}</td></tr>`).join('');
    b.innerHTML=`<div class="statgrid"><div><b>${visitors}</b><span>unique visitors</span></div><div><b>${returning}</b><span>came back</span></div><div><b>${visits}</b><span>total visits</span></div></div><div class="tablewrap"><table class="stat"><thead><tr><th>Zone or activity</th><th>Unique</th><th>Repeat users</th><th>Total</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No data yet.</td></tr>'}</tbody></table></div><p class="meta" style="margin-top:10px">On the YMH website, add a Google Analytics 4 ID to config.js to see the same events there.</p>`;})();}});}
/* zone entry tracking */
let lastRegion='';TICKS.push(()=>{if(!started||!W.main)return;const r=player.x>100?'joy':player.x<-100?'creative':player.z<-100?'sky':'centre';if(r!==lastRegion){lastRegion=r;track('zone_enter',{id:r});}});
{const _ew=enterWorld;enterWorld=function(w,s,r,m){if(w!==MAIN)track('enter',{id:w.id});return _ew(w,s,r,m);};}

/* ---------- settings panel ---------- */
function optRow(key,label,opts){return `<div class="optrow"><div class="lbl">${label}</div><div class="seg" data-set="${key}">${opts.map(([v,n])=>`<button type="button" data-v="${v}" aria-pressed="${String(SET[key])===String(v)}">${n}</button>`).join('')}</div></div>`;}
const SUPPORT_OPTS=[['mobility','How you get around',[['walk','Walking'],['stick','Walking stick'],['wheel','Wheelchair']]],['buddy','Walk with someone',[['none','On my own'],['friend','A friend'],['dog','A dog']]],['bubbles','People nearby',[['show','Show what they say'],['hide','Keep to myself']]],['animals','Animals in the city',[['true','Yes please'],['false','No thanks']]]];
function setOpt(k,v){if(k==='animals')v=(v==='true'||v===true);SET[k]=v;saveSet();if(k==='mobility'){if(player.bike&&v==='wheel')dismountBike(true);rebuildAvatar();}if(k==='buddy')syncBuddy();if(k==='animals')applyAnimals();if(k==='bubbles'&&v==='hide'){bubbleEl.hidden=true;bubbleNpc=null;}track('setting',{id:k+'-'+v});}
function wireOpts(root){root.querySelectorAll('[data-set]').forEach(seg=>{const k=seg.dataset.set;seg.querySelectorAll('button').forEach(x=>x.addEventListener('click',()=>{setOpt(k,x.dataset.v);seg.querySelectorAll('button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));}));});}
function openSettings(){openPanel({title:'Settings',eyebrow:'Make it yours',color:'#3f6fb5',sub:'Change any of these whenever you like.',build:b=>{
  b.innerHTML=`<h3 class="h3" style="margin-top:0">Support</h3>${SUPPORT_OPTS.map(o=>optRow(...o)).join('')}<h3 class="h3">Accessibility</h3><div class="mixer" id="axRows"></div>
  <h3 class="h3">Levels</h3><div class="mixer" id="lvRows"></div><h3 class="h3">Controls</h3><ul class="ticks"><li>Walk: WASD or arrow keys, the joystick, or click the ground. Hold Shift to go faster.</li><li>Look around: drag. Zoom: scroll.</li><li>E or Enter: do the thing on the prompt. F: sip, bite or let go. X: leave a building. J: your journey. M: map.</li></ul>
  <div class="row" style="margin-top:12px"><button class="btn" type="button" id="stHow">How the levels work</button><button class="btn ghost" type="button" id="stReset">Start my journey over</button><button class="btn ghost" type="button" id="stOwner" hidden>Visitor stats</button></div>`;
  wireOpts(b);
  const rows=[['narrate','Read aloud','Reads places, messages and panels out loud.'],['click','Click or tap to walk','Click the ground to walk there.'],['big','Larger text','Bigger buttons, panels and messages.'],['contrast','High contrast','Stronger outlines and darker text.'],['rm','Reduce motion','Gentler rides, shorter fades, no camera sway.'],['perf','Performance mode','Lower detail for older laptops and phones.']];
  const box_=b.querySelector('#axRows');rows.forEach(([k,n,d])=>{const r=document.createElement('div');r.className='track';r.innerHTML=`<button class="toggle" type="button" aria-pressed="${!!A11Y[k]}" aria-label="${n}"></button><div><b>${n}</b><span>${d}</span></div>`;r.querySelector('button').addEventListener('click',e=>{A11Y[k]=!A11Y[k];e.currentTarget.setAttribute('aria-pressed',String(A11Y[k]));applyA11y();if(k==='narrate'&&A11Y.narrate)speak('Read aloud is on.');});box_.appendChild(r);});
  const lv=b.querySelector('#lvRows');const r=document.createElement('div');r.className='track';r.innerHTML=`<button class="toggle" type="button" aria-pressed="${!!SET.skip}" aria-label="Open every area now"></button><div><b>Open every area now</b><span>Skip the levels and explore anything straight away.</span></div>`;r.querySelector('button').addEventListener('click',e=>{SET.skip=!SET.skip;saveSet();e.currentTarget.setAttribute('aria-pressed',String(SET.skip));syncGates();updateLevelCard();});lv.appendChild(r);
  b.querySelector('#stHow').addEventListener('click',()=>{closePanel();showHowTo();});
  b.querySelector('#stReset').addEventListener('click',()=>{PROG.done={};PROG.level=0;saveProg();syncGates();updateLevelCard();toast('Your journey has started again from the City Centre.');closePanel();});
  isOwner().then(o=>{if(o){const s=b.querySelector('#stOwner');s.hidden=false;s.addEventListener('click',()=>{closePanel();openStats();});}});}});}
{const ba=$('btnAccess');const nb=ba.cloneNode(true);ba.replaceWith(nb);nb.textContent='Settings';nb.addEventListener('click',openSettings);}
if(location.hash==='#stats')setTimeout(()=>openStats(),4000);

/* ---------- onboarding steps ---------- */
function introStep(n){document.querySelectorAll('.istep').forEach(s=>s.hidden=s.dataset.step!==String(n));const c=document.querySelector('.intro-card');if(c)c.scrollTop=0;document.querySelectorAll('.idots i').forEach((d,i)=>d.classList.toggle('on',i===n-1));}
(function wireIntro(){const it=$('intro');if(!it)return;wireOpts(it);
  $('next1').addEventListener('click',()=>introStep(2));$('next2').addEventListener('click',()=>introStep(3));$('back2').addEventListener('click',()=>introStep(1));$('back3').addEventListener('click',()=>introStep(2));
  introStep(1);})();
$('enterBtn').addEventListener('click',()=>{syncBuddy();updateLevelCard();track('visit',{id:STATS.visits>1?'returning':'new'});setTimeout(()=>{if(!store.get('howto7',0))showHowTo();},2600);});
$('lvl').addEventListener('click',openJourney);$('btnLeave').addEventListener('click',doLeave);
updateLevelCard();

/* ---------- room camera: pull in instead of squashing against walls ---------- */
updateCamera=function(dt,t){
  if(CINE){CINE.update(dt,t);if(CINE&&CINE.done)CINE=null;return;}
  let tx,ty,tz;
  if(!started){const narrow=innerWidth<640;cam.yaw=player.rot+(A11Y.rm?0.75:0.75+Math.sin(t*0.25)*0.45);cam.pitch=narrow?0.32:0.14;cam.distT=narrow?7.5:6.2;tx=player.x+(narrow?0:Math.cos(player.rot)*-1.1);ty=narrow?0.2:1.25;tz=player.z;}
  else{tx=player.x;ty=player.y+(player.bike?2.4:2.1);tz=player.z;}
  const k=1-Math.exp(-dt*(started?7:3));cam.tx+=(tx-cam.tx)*k;cam.ty+=(ty-cam.ty)*k;cam.tz+=(tz-cam.tz)*k;cam.dist+=(cam.distT-cam.dist)*(1-Math.exp(-dt*4));
  const cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch);let d=cam.dist;
  const pos=dd=>[cam.tx+Math.sin(cam.yaw)*cp*dd,cam.ty+sp*dd,cam.tz+Math.cos(cam.yaw)*cp*dd];
  let p=pos(d);
  if(W.camBounds){const b=W.camBounds;const inside=q=>q[0]>=b.x0&&q[0]<=b.x1&&q[2]>=b.z0&&q[2]<=b.z1&&q[1]<=b.y1;let n=0;while(!inside(p)&&d>1.3&&n<30){d*=0.9;p=pos(d);n++;}
    p[0]=clamp(p[0],b.x0,b.x1);p[2]=clamp(p[2],b.z0,b.z1);p[1]=Math.min(p[1],b.y1);}
  camera.position.set(p[0],p[1],p[2]);if(camera.position.y<0.8)camera.position.y=0.8;camera.lookAt(cam.tx,cam.ty,cam.tz);placeSky();};
flyHome=function(){enterWorld(MAIN,{x:-14,z:-106},Math.PI,'Welcome home to YMH City.');};

/* ---------- performance: merge things that never move ---------- */
const STATIC_OBJS=[];
function staticWrap(name){const f=window[name];if(typeof f!=='function')return;window[name]=function(...a){if(scene!==MAIN.scene)return f.apply(this,a);const n0=scene.children.length;const r=f.apply(this,a);for(let i=n0;i<scene.children.length;i++)STATIC_OBJS.push(scene.children[i]);return r;};}
['tree','bench','lamp','pathSeg','bunting','buildHedges','edgeTrees'].forEach(staticWrap);
function mergeStatic(list){const buckets=new Map();const _m=new THREE.Matrix4();const _n=new THREE.Matrix3();
  list.forEach(o=>{if(!o.parent)return;o.updateMatrixWorld(true);o.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||m.isSkinnedMesh)return;if(Array.isArray(m.material))return;
    const key=m.material.uuid+'|'+(m.castShadow?1:0)+'|'+(m.renderOrder||0);let b=buckets.get(key);if(!b){b={mat:m.material,cast:m.castShadow,ro:m.renderOrder||0,pos:[],nor:[],uv:[],hasUv:!!m.geometry.attributes.uv};buckets.set(key,b);}
    let g=m.geometry.index?m.geometry.toNonIndexed():m.geometry;const p=g.attributes.position,nr=g.attributes.normal,uv=g.attributes.uv;_m.copy(m.matrixWorld);_n.getNormalMatrix(_m);const v=new THREE.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(_m);b.pos.push(v.x,v.y,v.z);if(nr){v.fromBufferAttribute(nr,i).applyMatrix3(_n).normalize();b.nor.push(v.x,v.y,v.z);}else b.nor.push(0,1,0);if(b.hasUv){if(uv)b.uv.push(uv.getX(i),uv.getY(i));else b.uv.push(0,0);}}
    m.userData._merged=true;});});
  list.forEach(o=>{if(!o.parent)return;const kill=[];o.traverse(m=>{if(m.userData&&m.userData._merged)kill.push(m);});kill.forEach(m=>{if(m.parent)m.parent.remove(m);});if(o.isMesh&&o.userData._merged&&o.parent)o.parent.remove(o);});
  let made=0;buckets.forEach(b=>{if(!b.pos.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(b.nor,3));if(b.hasUv)g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));g.computeBoundingSphere();
    const m=new THREE.Mesh(g,b.mat);m.castShadow=b.cast;m.receiveShadow=true;m.renderOrder=b.ro;MAIN.scene.add(m);made++;});
  return made;}
