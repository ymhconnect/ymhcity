'use strict';
/* =========================================================
   EXTRAS: name tag, sound effects, Dance Floor, Paint Studio
   ========================================================= */

/* ---------- name tag ---------- */
let NAMETAG=null;
function applyNameTag(){if(!avatar)return;if(NAMETAG&&NAMETAG.parent)NAMETAG.parent.remove(NAMETAG);NAMETAG=null;const n=(AV.name||'').trim();if(!n||!AV.showName)return;
  NAMETAG=pillSprite(n,'#2fb08c',0.42,{fs:48});NAMETAG.position.set(0,2.75,0);avatar.add(NAMETAG);}
{const _rb=window.rebuildAvatar;window.rebuildAvatar=function(){_rb();applyNameTag();};}
{const ni=$('nameIn'),ns=$('nameShow');ni.value=AV.name||'';ns.checked=AV.showName!==false;
  const upd=()=>{AV.name=ni.value.replace(/[<>]/g,'').slice(0,18);AV.showName=ns.checked;store.set('avatar',AV);applyNameTag();};ni.addEventListener('input',upd);ns.addEventListener('change',upd);}
{const _oa=window.openAccess;window.openAccess=function(){_oa();const b=pBody;const sec=document.createElement('div');
  sec.innerHTML=`<h3 class="h3">Your name tag</h3><div class="row"><input type="text" id="axName" maxlength="18" placeholder="Your name" value="${esc(AV.name||'')}" style="flex:1;min-width:0"><label class="chk"><input type="checkbox" id="axShow" ${AV.showName!==false?'checked':''}> Show above my head</label></div><p class="meta" style="margin-top:6px">Your name only shows on your own screen.</p>`;
  b.insertBefore(sec,b.querySelector('.h3'));const ni=sec.querySelector('#axName'),ns=sec.querySelector('#axShow');const upd=()=>{AV.name=ni.value.replace(/[<>]/g,'').slice(0,18);AV.showName=ns.checked;store.set('avatar',AV);applyNameTag();$('nameIn').value=AV.name;$('nameShow').checked=AV.showName;};ni.addEventListener('input',upd);ns.addEventListener('change',upd);};
  const b=$('btnAccess');const c=b.cloneNode(true);b.replaceWith(c);c.addEventListener('click',()=>openAccess());}
{const _o=window.openPanel;window.openPanel=function(o){pw.classList.toggle('wide',!!o.wide);_o(o);};}

/* ---------- sound effects ---------- */
const SFX={ready:false,trainPrev:0,ph:0,lastBurn:0,lastQuack:0,lastCrackle:0,carNext:0,carStep:0,cPrev:null};
function sfxInit(){if(SFX.ready)return true;if(!audioInit())return false;const c=AUD.ctx;SFX.out=c.createGain();SFX.out.gain.value=0.9;SFX.out.connect(AUD.master);
  const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;SFX.nb=nb;
  const loop=(type,f,q)=>{const s=c.createBufferSource();s.buffer=nb;s.loop=true;s.playbackRate.value=0.8+Math.random()*0.4;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||1;const g=c.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(SFX.out);s.start();return{g,fl};};
  SFX.train=loop('bandpass',240,1.4);SFX.rumble=loop('lowpass',200,0.7);SFX.rattle=loop('bandpass',1500,4);SFX.wind=loop('bandpass',650,0.8);SFX.whoosh=loop('bandpass',900,0.6);SFX.whir=loop('highpass',2600,0.5);
  SFX.crowd=loop('bandpass',520,0.7);SFX.fountain=loop('highpass',1800,0.4);SFX.jet=loop('lowpass',300,0.8);
  const o=c.createOscillator();o.type='sawtooth';o.frequency.value=70;const of=c.createBiquadFilter();of.type='lowpass';of.frequency.value=220;const og=c.createGain();og.gain.value=0;o.connect(of);of.connect(og);og.connect(SFX.out);o.start();SFX.hum={g:og,o};
  SFX.ready=true;return true;}
function sg(n,v){if(n)n.g.gain.setTargetAtTime(Math.max(0,v),AUD.ctx.currentTime,0.08);}
function burst(f,type,dur,vol,q){if(!SFX.ready)return;const c=AUD.ctx,t=c.currentTime;const s=c.createBufferSource();s.buffer=SFX.nb;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||1;const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(0.0002,vol),t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(fl);fl.connect(g);g.connect(SFX.out);s.start(t,Math.random());s.stop(t+dur+0.05);}
function tone(f,dur,vol,type,slideTo,delay){if(!SFX.ready)return;const c=AUD.ctx,t=c.currentTime+(delay||0);const o=c.createOscillator();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(0.0002,vol),t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(SFX.out);o.start(t);o.stop(t+dur+0.05);}
function near(x,z,r){if(!W.main)return 0;const d=Math.hypot(player.x-x,player.z-z);return d>=r?0:Math.pow(1-d/r,2);}
function whistle(v){tone(587,1.1,0.12*v,'sine');tone(740,1.1,0.1*v,'sine');tone(880,0.5,0.06*v,'sine',null,0.6);}
function bell(){tone(2300,0.35,0.08,'sine');tone(2300,0.35,0.08,'sine',null,0.18);}
const MUSICBOX=[72,76,79,76,74,77,81,77,72,76,79,84,83,79,76,72];
TICKS.push((dt,t)=>{if(!SFX.ready||!AUD.ctx||AUD.ctx.state!=='running')return;const on=anyOn();SFX.out.gain.setTargetAtTime(on?0.9:0,AUD.ctx.currentTime,0.2);if(!on)return;
  /* train */
  if(TRAIN.cars&&TRAIN.cars[0]){const p=TRAIN.cars[0].position;const v=TRAIN.v;const near_=TRAIN.riding?0.8:near(p.x,p.z,70);SFX.ph+=dt*v*0.9;const pulse=Math.sin(SFX.ph*TAU)>0.5?1:0.25;SFX.trainNear=near_;
    if(SFX.trainPrev>0&&TRAIN.stop<=0&&near_>0.02)whistle(Math.max(0.3,near_));SFX.trainPrev=TRAIN.stop;}
  /* coaster */
  if(RIDE.coaster){const c=RIDE.coaster.car.position;let spd=0;if(SFX.cPrev){spd=Math.hypot(c.x-SFX.cPrev.x,c.y-SFX.cPrev.y,c.z-SFX.cPrev.z)/Math.max(dt,1e-3);}SFX.cPrev={x:c.x,y:c.y,z:c.z};
    const climbing=SFX.cy!==undefined&&c.y>SFX.cy+0.002;SFX.cy=c.y;const n=RIDE.coaster.riding?1:near(c.x,c.z,70);sg(SFX.rumble,n*Math.min(1,spd/14)*0.7);sg(SFX.rattle,n*(climbing&&spd<8?0.22:0.04));}
  /* swings + drop + crowd + carousel */
  if(RIDE.swing)sg(SFX.wind,(RIDE.swing.riding?0.9:near(124,-46,40))*Math.min(1,RIDE.swing.w/1.5)*0.35);
  if(RIDE.drop){const d=RIDE.drop,tt=Math.min(d.t,24);const n=d.riding?1:near(168,-12,45);sg(SFX.hum,tt<16&&tt>0.2?n*0.07:0);if(SFX.hum)SFX.hum.o.frequency.setTargetAtTime(60+tt*4,AUD.ctx.currentTime,0.1);sg(SFX.whoosh,tt>20&&tt<21.6?n*0.9:0);}
  sg(SFX.crowd,near(138,-14,75)*0.1);
  const cb=near(138,-13,32);if(cb>0.02&&t>SFX.carNext){SFX.carNext=t+0.32;const m=MUSICBOX[SFX.carStep++%MUSICBOX.length];tone(440*Math.pow(2,(m-69)/12),0.6,0.09*cb,'triangle');}
  /* fountain, ducks, bike, plane */
  sg(SFX.fountain,near(0,0,26)*0.12);
  const dl=near(LAKE.x,LAKE.z,32);if(dl>0.05&&t>SFX.lastQuack){SFX.lastQuack=t+rr(6,14);tone(520,0.12,0.06*dl,'sawtooth',300);tone(500,0.12,0.05*dl,'sawtooth',290,0.18);}
  if(player.bike){const sp=player.moving?(keys.ShiftLeft||keys.ShiftRight?1:0.7):0;sg(SFX.whir,0);}else sg(SFX.whir,0);
  const flying=CINE&&CINE.v!==undefined&&!CINE.done;if(flying){sg(SFX.jet,Math.min(0.8,CINE.t*0.12));SFX.jet.fl.frequency.setTargetAtTime(300+CINE.t*90,AUD.ctx.currentTime,0.2);}else sg(SFX.jet,W.main?near(-14,-150,30)*0.06:0);
  /* hot air balloon burner */
  if(typeof BAL!=='undefined'&&BAL.riding&&t>SFX.lastBurn){SFX.lastBurn=t+rr(5,9);burst(800,'bandpass',1.3,0.25,0.5);}
  /* campfire */
  if(W.id==='mountain'){const d=Math.hypot(player.x-10,player.z+8);const v=d<20?Math.pow(1-d/20,2):0;if(v>0.03&&t>SFX.lastCrackle){SFX.lastCrackle=t+rr(0.05,0.35);burst(rr(2000,5000),'highpass',0.04,0.25*v,1);}}
});
{const _eb=$('enterBtn');_eb.addEventListener('click',()=>{sfxInit();});}
{const _m=window.mountBike;window.mountBike=function(){_m();bell();};}
{const _tc=window.tossCoin;window.tossCoin=function(){_tc();setTimeout(()=>{burst(1200,'bandpass',0.4,0.25,0.8);tone(1600,0.25,0.05,'sine',900);},1100);};}
{const _sf=window.sitFilm;window.sitFilm=function(...a){_sf(...a);setLayer('pad',true);};}
{const _bt=window.boardTrain;window.boardTrain=function(i){_bt(i);setTimeout(()=>whistle(0.8),900);};}

/* =========================================================
   DANCE FLOOR (Joy Park)
   ========================================================= */
const DANCE={move:'sway',auto:false,riding:false,secs:0,bpm:112,g:null,next:0,step:0,tiles:[]};
const MOVES=[['sway','Sway'],['clap','Clap'],['up','Hands up'],['step','Step touch'],['spin','Spin'],['wave','Wave'],['robot','Robot']];
function beatPos(){const tt=(AUD.ctx&&AUD.ctx.state==='running')?AUD.ctx.currentTime:T;return tt*DANCE.bpm/60;}
function dancePose(p,move,b,dt,isPlayer){const u=p.userData;resetPose(p);const ph=b*Math.PI;const k=Math.abs(Math.sin(ph));u.body.position.y=k*0.07;
  if(move==='sway'){const f=Math.sin(ph)*0.14;u.body.rotation.z=f;u.body.position.x=0.86*Math.sin(f);u.legs.forEach(l=>l.rotation.z=-f);u.arms[0].rotation.z=-0.3-Math.sin(ph)*0.2;u.arms[1].rotation.z=0.3-Math.sin(ph)*0.2;}
  else if(move==='clap'){const c=(Math.sin(ph*2)+1)/2;u.arms.forEach(a=>a.rotation.x=-1.25);u.arms[0].rotation.z=-0.45+c*0.55;u.arms[1].rotation.z=0.45-c*0.55;}
  else if(move==='up'){const a=Math.PI-0.25-k*0.4;u.arms[0].rotation.z=-a;u.arms[1].rotation.z=a;}
  else if(move==='step'){const s=Math.sin(ph/2);u.body.position.x=s*0.25;u.legs[0].rotation.z=s>0?0.3:0;u.legs[1].rotation.z=s<0?-0.3:0;u.arms[0].rotation.x=-0.6*Math.max(0,s);u.arms[1].rotation.x=-0.6*Math.max(0,-s);}
  else if(move==='spin'){if(isPlayer)player.rot+=dt*3.2;else p.rotation.y+=dt*3.2;u.arms[0].rotation.z=-1.1;u.arms[1].rotation.z=1.1;}
  else if(move==='wave'){u.arms[1].rotation.z=2.5+Math.sin(ph*2)*0.4;u.arms[0].rotation.z=-0.2;u.head.rotation.z=Math.sin(ph)*0.1;}
  else if(move==='robot'){const s=Math.floor(b)%2;u.arms[0].rotation.x=s?-1.57:0;u.arms[1].rotation.x=s?0:-1.57;u.head.rotation.y=s?0.4:-0.4;u.body.position.y=0;}}
function danceMusic(){if(!sfxInit())return;const c=AUD.ctx;if(!DANCE.g){DANCE.g=c.createGain();DANCE.g.gain.value=0;DANCE.g.connect(SFX.out);}
  const spb=60/DANCE.bpm/4;if(DANCE.next<c.currentTime)DANCE.next=c.currentTime+0.05;
  const roots=[45,41,43,40];
  while(DANCE.next<c.currentTime+0.25){const t=DANCE.next,s=DANCE.step%16,bar=Math.floor(DANCE.step/16)%4;const g=DANCE.g;
    const out=(node,vol,dur)=>{const e=c.createGain();e.gain.setValueAtTime(0.0001,t);e.gain.exponentialRampToValueAtTime(vol,t+0.005);e.gain.exponentialRampToValueAtTime(0.0001,t+dur);node.connect(e);e.connect(g);};
    if(s%4===0){const o=c.createOscillator();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+0.2);out(o,0.5,0.25);o.start(t);o.stop(t+0.3);}
    if(s%4===2){const n=c.createBufferSource();n.buffer=SFX.nb;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=7000;n.connect(f);out(f,0.12,0.05);n.start(t,Math.random());n.stop(t+0.07);}
    if(s===4||s===12){const n=c.createBufferSource();n.buffer=SFX.nb;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1500;n.connect(f);out(f,0.25,0.14);n.start(t,Math.random());n.stop(t+0.16);}
    if([0,3,6,8,11,14].includes(s)){const o=c.createOscillator();o.type='triangle';o.frequency.value=440*Math.pow(2,(roots[bar]-69)/12);out(o,0.22,0.18);o.start(t);o.stop(t+0.2);}
    if(s===6||s===14){[0,4,7].forEach(iv=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=440*Math.pow(2,(roots[bar]+24+iv-69)/12);out(o,0.05,0.22);o.start(t);o.stop(t+0.25);});}
    DANCE.next+=spb;DANCE.step++;}}
function buildDance(cx,cz,ry){const g=grp(cx,cz,ry===undefined?-Math.PI/2:ry);box(11,0.3,11,'#24324a',0,0.15,0,g);
  const cols=['#d97a68','#9a86c9','#5aa6c2','#d9b45f','#5fa58f'];for(let i=0;i<5;i++)for(let j=0;j<5;j++){const m=new THREE.MeshStandardMaterial({color:'#2b3442',emissive:cols[(i+j)%5],emissiveIntensity:0.2});const tl=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.06,1.9),m);tl.position.set(-4+i*2,0.33,-4+j*2);g.add(tl);DANCE.tiles.push({m,i,j});}
  for(const sx of [-6.4,6.4]){box(1.2,2.6,1.2,'#1d2b44',sx,1.3,-4.6,g);for(const y of [0.8,1.9]){const sp=cyl(0.35,0.35,0.05,'#5a6478',sx,y,-3.99,g,14,false);sp.rotation.x=Math.PI/2;}}
  box(3,1.2,1.2,'#3f4f6b',0,0.9,-5.2,g);box(3.2,0.1,1.4,'#c9ced6',0,1.55,-5.2,g);
  for(const sx of [-5.6,5.6])cyl(0.1,0.1,5.2,'#9aa3ad',sx,2.6,-5.8,g,6);box(11.4,0.2,0.2,'#9aa3ad',0,5.2,-5.8,g);const lights=[];for(let i=0;i<5;i++){const l=sph(0.22,'#fff',-4+i*2,4.95,-5.8,g,8,false);l.material=new THREE.MeshStandardMaterial({color:'#fff',emissive:cols[i],emissiveIntensity:1});lights.push(l);}
  sign('Dance Floor','move your body, lift your mood','#9a86c9','#ffffff',4.8,1.2,g,0,6.1,-5.8);gBox(g,0,-5.2,1.6,0.7);
  const dj=L2W(g,0,-5.9);staticNPC(dj.x,dj.z,g.rotation.y,{shirt:'#24324a',pack:false},(dt,t)=>{},"Step on! Pick any move, there's no wrong way to dance.");
  const dancers=[];[[-2.5,-1.5,'clap'],[2.5,-1,'sway'],[-1.5,2.5,'up'],[2.5,2.5,'step']].forEach(([x,z,mv],i)=>{const w=L2W(g,x,z);const p=staticNPC(w.x,w.z,g.rotation.y+rr(-0.4,0.4),{pack:false},(dt)=>{const b=beatPos();const m=DANCE.riding?DANCE.move:MOVES[(Math.floor(b/8)+i)%MOVES.length][0];dancePose(p,m==='spin'?'sway':m,b+i*0.25,dt,false);p.position.y=0.3;},pick(["This song is so good.","I dance badly and happily.","Copy my moves if you want.","Nobody's watching. Promise."]),0.3);dancers.push(p);});
  updaters.push((dt,t)=>{const b=beatPos();const k=Math.pow(1-(b%1),3);DANCE.tiles.forEach(o=>{o.m.emissiveIntensity=0.15+((o.i+o.j+Math.floor(b))%3===0?k*0.9:0.05)*(TOD.cur?0.6+TOD.cur.lamp*0.4:1);});lights.forEach((l,i)=>l.material.emissiveIntensity=0.4+((Math.floor(b)+i)%2)*0.8);
    const v=DANCE.riding?1:near(cx,cz,34);if(v>0.01&&SFX.ready&&anyOn()){danceMusic();DANCE.g.gain.setTargetAtTime(v*0.55,AUD.ctx.currentTime,0.2);}else if(DANCE.g)DANCE.g.gain.setTargetAtTime(0,AUD.ctx.currentTime,0.2);
    if(DANCE.riding){DANCE.secs+=dt;if(DANCE.auto&&Math.floor(b/8)!==DANCE.lastBar){DANCE.lastBar=Math.floor(b/8);DANCE.move=MOVES[DANCE.lastBar%MOVES.length][0];if(DANCE.ui)DANCE.ui();}if(DANCE.secs>30&&!DANCE.done30){DANCE.done30=true;award(10,'Danced for 30 seconds','dance30');done('dance');}}});
  const front=L2W(g,0,6.5);const spotIn=L2W(g,0,1.5);
  SPOTS.push({label:'Dance',sub:'Step onto the floor and pick a move',color:'#9a86c9',tx:cx,tz:cz,tr:10,run:()=>{stampId('dance');sfxInit();DANCE.riding=true;DANCE.secs=0;DANCE.move='sway';DANCE.auto=false;
    openPanel({dock:true,title:'Dance Floor',eyebrow:'Creative Quarter',color:'#9a86c9',sub:'Pick a move. Freestyle mixes them up.',build:b=>{b.innerHTML=`<div class="seg" id="dnM"></div><p class="lead" style="margin-top:10px">Moving your body for even a few minutes can lift your mood and ease stress.</p><div class="row"><button class="btn primary" type="button" id="dnX">Step off</button></div>`;
      const box=b.querySelector('#dnM');const all=[...MOVES,['free','Freestyle']];all.forEach(([id,n])=>{const x=document.createElement('button');x.type='button';x.textContent=n;x.addEventListener('click',()=>{if(id==='free'){DANCE.auto=true;}else{DANCE.auto=false;DANCE.move=id;award(2,`New move: ${n}`,'move-'+id);}DANCE.ui();});box.appendChild(x);});
      DANCE.ui=()=>{box.querySelectorAll('button').forEach((x,i)=>x.setAttribute('aria-pressed',String(DANCE.auto?all[i][0]==='free':all[i][0]===DANCE.move)));};DANCE.ui();b.querySelector('#dnX').addEventListener('click',closePanel);return ()=>{DANCE.ui=null;};}});
    startAction({x:spotIn.x,z:spotIn.z,rot:g.rotation.y,y:0.3,pose:(t,dt)=>dancePose(avatar,DANCE.move,beatPos(),dt||0.016,true),camOff:0,dist:7.5,pitch:0.22,exit:front,onEnd:()=>{DANCE.riding=false;}});
    cam.yaw=g.rotation.y;}});
  MAP_DECOR.push({x:cx,z:cz,r:5,c:'rgba(154,134,201,.3)'});}

/* =========================================================
   PAINT STUDIO (Culture Quarter)
   ========================================================= */
const PAINT={c:null,x:null,tex:null,undo:[],redo:[],tool:'brush',color:'#2f6f8f',size:14,gallery:[]};
function paintInit(){if(PAINT.c)return;const c=document.createElement('canvas');c.width=800;c.height=600;const x=c.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,800,600);PAINT.c=c;PAINT.x=x;PAINT.tex=new THREE.CanvasTexture(c);}
function abstractTex(seed){return cardTex(400,300,(x,W,H)=>{const pal=[['#f2c14e','#d97a68','#5aa6c2'],['#9a86c9','#f2efe8','#5fa58f'],['#d48aa6','#ffd98a','#3f4f6b'],['#8bb07a','#e0c9a6','#2f6f8f']][seed%4];x.fillStyle=pal[1];x.fillRect(0,0,W,H);
  for(let i=0;i<9;i++){x.fillStyle=pal[i%3];x.globalAlpha=0.65;x.beginPath();x.arc(((seed*97+i*53)%W),((seed*31+i*71)%H),20+((i*17+seed*13)%70),0,TAU);x.fill();}x.globalAlpha=1;});}
function loadGallery(frames){const saved=store.get('paintings',[]);frames.forEach((f,i)=>{const src=saved[saved.length-1-i];if(src){const img=new Image();img.onload=()=>{const t=new THREE.Texture(img);t.needsUpdate=true;f.material=new THREE.MeshBasicMaterial({map:t});};img.src=src;}else f.material=new THREE.MeshBasicMaterial({map:abstractTex(i+1)});});}
let GALLERY=[];
function easel(g,x,z,mat){const e=grp(x,z,0,g);for(const sx of [-0.5,0.5]){const l=box(0.08,2.4,0.08,'#7a5236',sx,1.2,0.1,e);l.rotation.z=-sx*0.12;}const bk=box(0.08,2.2,0.08,'#7a5236',0,1.1,-0.5,e);bk.rotation.x=0.25;box(1.4,0.06,0.15,'#7a5236',0,0.95,0.15,e);
  const cv=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.2,0.05),[M('#f2efe8'),M('#f2efe8'),M('#f2efe8'),M('#f2efe8'),mat,M('#f2efe8')]);cv.position.set(0,1.65,0.12);cv.rotation.x=-0.1;cv.castShadow=true;e.add(cv);return e;}
function buildPaint(){paintInit();const cx=CQ.paint.x,cz=CQ.paint.z;const ry=Math.atan2(CQ.x-cx,CQ.z-cz);const g=grp(cx,cz,ry);
  box(12,0.3,9,'#e6dccb',0,0.15,0,g);for(const sx of [-5.6,5.6])for(const sz of [-4.2,4.2])cyl(0.15,0.15,4,'#7a5236',sx,2.2,sz,g,8);box(12.8,0.3,9.6,'#d2925c',0,4.3,0,g);const rmp=box(3,0.1,2,'#e6dccb',0,0.15,5.4,g,false);rmp.rotation.x=0.15;
  box(11.6,3.4,0.2,'#f2efe8',0,2.0,-4.3,g);GALLERY=[];for(let i=0;i<4;i++){box(2.4,1.9,0.08,'#7a5236',-4.2+i*2.8,2.3,-4.15,g,false);const f=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.65),M('#fff'));f.position.set(-4.2+i*2.8,2.3,-4.1);g.add(f);GALLERY.push(f);}loadGallery(GALLERY);
  sign('Paint Studio','paint how you feel · take it home','#d2925c','#ffffff',4.6,1.1,g,0,5.0,4.4);
  easel(g,0,0.6,new THREE.MeshBasicMaterial({map:PAINT.tex}));const e1=easel(g,-3.4,1,new THREE.MeshBasicMaterial({map:abstractTex(5)}));e1.rotation.y=0.25;const e2=easel(g,3.4,1,new THREE.MeshBasicMaterial({map:abstractTex(6)}));e2.rotation.y=-0.25;
  box(1.6,0.9,0.7,'#7c6a58',-5,0.6,-2.6,g);['#d97a68','#f2c14e','#5aa6c2','#5fa58f','#9a86c9'].forEach((c,i)=>cyl(0.12,0.12,0.22,c,-5.6+i*0.3,1.15,-2.6,g,10,false));
  for(const [lx,lz,r] of [[-3.4,2.2,Math.PI+0.25],[3.4,2.2,Math.PI-0.25]]){const w=L2W(g,lx,lz);const p=staticNPC(w.x,w.z,g.rotation.y+r,{pack:false},(dt,t)=>{const u=p.userData;idleAnim(p,t);u.arms[1].rotation.x=-1.4+Math.sin(t*2.2+lx)*0.2;u.arms[1].rotation.z=0.25+Math.sin(t*1.6+lx)*0.15;},pick(["I'm painting the sky from this morning.","No talent needed. Just colours.","Painting gets my head quiet."]));}
  gBox(g,0,-4.3,5.8,0.3);const front=L2W(g,0,2.6);const ex=L2W(g,0,5.4);
  SPOTS.push({label:'Paint something',sub:'Pick colours and brushes, then take it home',color:'#d2925c',tx:cx,tz:cz,tr:9,run:()=>{stampId('paint');paintPanel();startAction({x:front.x,z:front.z,rot:g.rotation.y+Math.PI,pose:t=>{resetPose(avatar);avatar.userData.arms[1].rotation.x=-1.3+Math.sin(t*3)*0.15;},camOff:Math.PI+0.4,dist:5,pitch:0.2,exit:ex});}});
  MAP_DECOR.push({x:cx,z:cz,r:4,c:'rgba(210,146,92,.3)'});}
function pushUndo(){PAINT.undo.push(PAINT.x.getImageData(0,0,800,600));if(PAINT.undo.length>20)PAINT.undo.shift();PAINT.redo=[];}
function floodFill(sx,sy,hex){const x=PAINT.x;const img=x.getImageData(0,0,800,600);const d=new Uint32Array(img.data.buffer);const W=800,H=600;sx|=0;sy|=0;if(sx<0||sy<0||sx>=W||sy>=H)return;
  const c=new THREE.Color(hex);const fill=(255<<24)|(Math.round(c.b*255)<<16)|(Math.round(c.g*255)<<8)|Math.round(c.r*255);const target=d[sy*W+sx];if(target===fill)return;
  const tr=target&255,tg=(target>>8)&255,tb=(target>>16)&255;const same=v=>Math.abs((v&255)-tr)+Math.abs(((v>>8)&255)-tg)+Math.abs(((v>>16)&255)-tb)<60;
  const st=[sy*W+sx];while(st.length){let i=st.pop();let px=i%W;const py=(i-px)/W;let l=px;while(l>0&&same(d[py*W+l-1]))l--;let r=px;while(r<W-1&&same(d[py*W+r+1]))r++;
    for(let k=l;k<=r;k++){d[py*W+k]=fill;if(py>0&&same(d[(py-1)*W+k]))st.push((py-1)*W+k);if(py<H-1&&same(d[(py+1)*W+k]))st.push((py+1)*W+k);}}x.putImageData(img,0,0);}
function paintPanel(){openPanel({wide:true,title:'Paint Studio',eyebrow:'Creative Quarter',color:'#d2925c',sub:'There\'s no right way to do this. Paint how you feel.',build:b=>{
  const COLS=['#1d2b44','#ffffff','#d97a68','#e9a9bd','#f2c14e','#f3e3c3','#8bb07a','#2f8f6c','#5aa6c2','#2f6f8f','#9a86c9','#6b4a2e','#c9ced6','#000000'];
  const TOOLS=[['brush','Brush'],['spray','Spray'],['eraser','Eraser'],['fill','Fill'],['line','Line'],['rect','Rectangle'],['circle','Circle']];
  b.innerHTML=`<div class="sugg" id="ptI"></div><div class="seg" id="ptT" style="margin-top:10px"></div>
  <div class="row" style="margin-top:10px"><div class="swatches" id="ptC" style="gap:6px"></div><label class="meta" for="ptCustom">Any colour</label><input type="color" id="ptCustom" value="${PAINT.color}" aria-label="Pick any colour"></div>
  <div class="row" style="margin-top:8px"><label class="meta" for="ptS">Brush size</label><input type="range" id="ptS" min="2" max="70" value="${PAINT.size}" style="max-width:200px"><span class="meta" id="ptSV">${PAINT.size}</span></div>
  <div class="paint-wrap" id="ptW"></div>
  <div class="row" style="margin-top:10px"><button class="btn" type="button" id="ptU">Undo</button><button class="btn" type="button" id="ptR">Redo</button><button class="btn ghost" type="button" id="ptX">Clear</button><button class="btn primary" type="button" id="ptH">Hang it in the studio</button><button class="btn" type="button" id="ptD">Download</button></div>
  <p class="meta" id="ptM" style="margin-top:8px">Your painting also shows on the easel in the studio as you paint.</p><div id="ptImg"></div>`;
  const q=s=>b.querySelector(s);const msg=t=>{q('#ptM').textContent=t;};
  ['How today feels, as colours','Your calm place','The sky right now','Something you\'re grateful for','A shape for a worry, then paint over it'].forEach(t=>{const x=document.createElement('button');x.type='button';x.textContent=t;x.addEventListener('click',()=>msg(`Idea: ${t}. Take your time.`));q('#ptI').appendChild(x);});
  TOOLS.forEach(([id,n])=>{const x=document.createElement('button');x.type='button';x.textContent=n;x.setAttribute('aria-pressed',String(PAINT.tool===id));x.addEventListener('click',()=>{PAINT.tool=id;q('#ptT').querySelectorAll('button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));});q('#ptT').appendChild(x);});
  COLS.forEach((c,i)=>{const x=document.createElement('button');x.type='button';x.className='sw';x.style.cssText=`background:${c};width:26px;height:26px`;x.setAttribute('aria-label','Colour '+(i+1));x.setAttribute('aria-pressed',String(c===PAINT.color));x.addEventListener('click',()=>{PAINT.color=c;q('#ptCustom').value=c;q('#ptC').querySelectorAll('.sw').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));});q('#ptC').appendChild(x);});
  q('#ptCustom').addEventListener('input',e=>{PAINT.color=e.target.value;q('#ptC').querySelectorAll('.sw').forEach(y=>y.setAttribute('aria-pressed','false'));});
  q('#ptS').addEventListener('input',e=>{PAINT.size=+e.target.value;q('#ptSV').textContent=PAINT.size;});
  const c=PAINT.c,x=PAINT.x;q('#ptW').appendChild(c);c.className='paintc';
  const P=e=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*800/r.width,y:(e.clientY-r.top)*600/r.height};};let st=null,snap=null,last=null;
  const dot=(p)=>{if(PAINT.tool==='spray'){x.fillStyle=PAINT.color;for(let i=0;i<PAINT.size*1.5;i++){const a=Math.random()*TAU,r=Math.random()*PAINT.size;x.fillRect(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,1.6,1.6);}return;}
    x.strokeStyle=PAINT.tool==='eraser'?'#ffffff':PAINT.color;x.lineWidth=PAINT.size;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(last.x,last.y);x.lineTo(p.x,p.y);x.stroke();};
  const shape=(a,p)=>{x.putImageData(snap,0,0);x.strokeStyle=PAINT.color;x.lineWidth=Math.max(2,PAINT.size/2);x.lineCap='round';x.beginPath();
    if(PAINT.tool==='line'){x.moveTo(a.x,a.y);x.lineTo(p.x,p.y);}else if(PAINT.tool==='rect'){x.rect(Math.min(a.x,p.x),Math.min(a.y,p.y),Math.abs(p.x-a.x),Math.abs(p.y-a.y));}else{x.ellipse((a.x+p.x)/2,(a.y+p.y)/2,Math.abs(p.x-a.x)/2,Math.abs(p.y-a.y)/2,0,0,TAU);}x.stroke();};
  c.onpointerdown=e=>{e.preventDefault();pushUndo();const p=P(e);try{c.setPointerCapture(e.pointerId);}catch(_){}
    if(PAINT.tool==='fill'){floodFill(p.x,p.y,PAINT.color);PAINT.tex.needsUpdate=true;return;}st=p;last=p;if(['line','rect','circle'].includes(PAINT.tool))snap=x.getImageData(0,0,800,600);else{dot({x:p.x+0.01,y:p.y+0.01});}PAINT.tex.needsUpdate=true;};
  c.onpointermove=e=>{if(!st)return;const p=P(e);if(snap)shape(st,p);else{dot(p);last=p;}PAINT.tex.needsUpdate=true;};
  c.onpointerup=c.onpointercancel=()=>{st=null;snap=null;PAINT.tex.needsUpdate=true;};
  q('#ptU').addEventListener('click',()=>{if(!PAINT.undo.length)return;PAINT.redo.push(x.getImageData(0,0,800,600));x.putImageData(PAINT.undo.pop(),0,0);PAINT.tex.needsUpdate=true;});
  q('#ptR').addEventListener('click',()=>{if(!PAINT.redo.length)return;PAINT.undo.push(x.getImageData(0,0,800,600));x.putImageData(PAINT.redo.pop(),0,0);PAINT.tex.needsUpdate=true;});
  q('#ptX').addEventListener('click',()=>{pushUndo();x.fillStyle='#ffffff';x.fillRect(0,0,800,600);PAINT.tex.needsUpdate=true;msg('Fresh canvas. Undo brings the old one back.');});
  q('#ptH').addEventListener('click',()=>{const s=document.createElement('canvas');s.width=400;s.height=300;s.getContext('2d').drawImage(c,0,0,400,300);let url='';try{url=s.toDataURL('image/jpeg',0.85);}catch(e){}
    if(url){const a=store.get('paintings',[]);a.push(url);store.set('paintings',a.slice(-4));loadGallery(GALLERY);}const first=!store.get('awarded',{})['paint1'];award(first?15:5,'Painting hung',first?'paint1':undefined);done('paint');msg('Hung on the studio wall. It stays here on this device.');});
  q('#ptD').addEventListener('click',async()=>{msg('Preparing your painting…');const blob=await new Promise(r=>c.toBlob(r,'image/png'));let dl=null;try{dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;}catch(e){}
    if(dl&&blob){try{await dl.save({filename:'my-ymh-painting.png',data:blob});msg('Saved. Enjoy your painting!');}catch(e){msg(e&&e.code==='declined'?'Download cancelled.':'Downloading isn\'t available here. Right-click or long-press the image below to save it.');showImg();}}else{msg('Right-click or long-press the image below to save it.');showImg();}});
  const showImg=()=>{let u='';try{u=c.toDataURL('image/png');}catch(e){}q('#ptImg').innerHTML=u?`<img src="${u}" alt="Your painting" style="width:100%;border-radius:12px;margin-top:8px">`:'';};
  return ()=>{c.onpointerdown=c.onpointermove=c.onpointerup=null;};}});}
