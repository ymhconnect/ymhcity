'use strict';
/* =========================================================
   SKY PORT: airport + flights, hot air balloon, Nap Garden,
   Mountain Retreat and Beach Cove worlds.
   ========================================================= */

function trail(x1,z1,x2,z2,w,c){const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,len),LM(c,2));m.rotation.order='YXZ';m.rotation.set(-Math.PI/2,Math.atan2(dx,dz),0);m.position.set((x1+x2)/2,0.02,(z1+z2)/2);m.receiveShadow=true;scene.add(m);
  for(const [x,z] of [[x1,z1],[x2,z2]])flat(new THREE.CircleGeometry(w/2,16),c,x,0.02,z,2);}
function showCalm(line,sub,ms){const c=$('calm');$('calmLine').textContent=line;$('calmSub').textContent=sub||'';c.hidden=false;void c.offsetWidth;c.classList.add('show');speak(`${line} ${sub||''}`);clearTimeout(showCalm.t);if(ms)showCalm.t=setTimeout(hideCalm,ms);}
function hideCalm(){const c=$('calm');c.classList.remove('show');setTimeout(()=>{if(!c.classList.contains('show'))c.hidden=true;},2200);}
function fadeMaster(to,sec){if(!AUD.ctx||!AUD.master)return;const t=AUD.ctx.currentTime;AUD.master.gain.cancelScheduledValues(t);AUD.master.gain.setTargetAtTime(to,t,sec/3);if(RADIO.gain){RADIO.gain.gain.setTargetAtTime(to>0?0.8:0,t,sec/3);}}
function lieDown(o){const rot=Math.atan2(o.footX-o.headX,o.footZ-o.headZ);
  startAction({x:o.footX,z:o.footZ,rot,y:o.y,lie:true,lock:!!o.lock,pose:t=>{resetPose(avatar);const u=avatar.userData;u.arms.forEach(a=>a.rotation.x=-0.25);u.body.scale.z=1+Math.sin(t*0.9)*0.02;},camOff:o.camOff??1.2,dist:o.dist||6,pitch:o.pitch||0.6,exit:o.exit,onEnd:o.onEnd});}

/* ---------- plane ---------- */
function makePlane(){const g=new THREE.Group();g.rotation.order='YXZ';const white='#f2efe8',teal='#2f6f8f';
  const fus=cyl(1.3,1.3,12,white,0,2.2,0,g,18);fus.rotation.x=Math.PI/2;const nose=sph(1.3,white,0,2.2,6,g,16);nose.scale.set(1,1,1.5);const tail=cone(1.3,3.4,white,0,2.4,-7.6,g,16);tail.rotation.x=-Math.PI/2;
  box(2.66,0.35,11,teal,0,1.85,0,g);box(16,0.25,3,white,0,1.6,0.6,g);for(const sx of [-4,4]){const e=cyl(0.45,0.45,1.8,'#c9ced6',sx,1.1,1.4,g,12);e.rotation.x=Math.PI/2;}
  box(0.25,3,2.2,teal,0,4.3,-6.4,g);box(5,0.2,1.6,white,0,2.7,-6.8,g);box(2.64,0.3,9,'#1d2b44',0,2.65,-0.3,g,false);box(1.7,0.45,0.6,'#1d2b44',0,2.95,6.4,g,false);
  for(const [x,z] of [[-2,0.6],[2,0.6],[0,5]])cyl(0.32,0.32,0.3,'#1d2b44',x,0.35,z,g,10).rotation.z=Math.PI/2;
  for(const sx of [-1.34,1.34]){const s=sign('YMH AIR',null,white,teal,3.2,0.7,g,sx,2.6,2.6,Math.PI/2);s.scale.z=0.1;}
  return g;}
let PLANE=null;

/* ---------- Sky Port ---------- */
function buildNorth(){flat(new THREE.CircleGeometry(7,40),'#e6dcc8',24,0.03,-114,3);
  [[24,-114,-14,-118],[24,-114,42,-121],[24,-114,52,-135]].forEach(p=>pathSeg(p[0],p[1],p[2],p[3],4,'#e6dcc8'));
  const g=grp(-14,-128,0);box(26,8,12,'#e9edf2',0,4,0,g);const gl=box(24,3.4,0.1,'#bfe0ef',0,4.6,6.05,g,false);gl.material=WIN_MAT;box(28,0.5,14,'#3f4f6b',0,8.25,0,g);
  box(8,0.3,4,'#3f4f6b',0,4.1,7.6,g);for(const sx of [-3.6,3.6])cyl(0.12,0.12,4,'#3f4f6b',sx,2,9.4,g,6);box(3,3,0.2,'#24324a',0,1.5,6.1,g);
  sign('Sky Port','flights to the mountains and the beach','#2f6f8f','#ffffff',9,1.7,g,0,9.6,6.2);
  const db=cardTex(512,256,(x,W,H)=>{x.fillStyle='#14161d';x.fillRect(0,0,W,H);x.fillStyle='#d9b45f';x.font=`700 28px ${FB}`;x.fillText('DEPARTURES',20,40);x.font=`500 24px ${FB}`;x.fillStyle='#fff';[['Mountain Retreat','On time'],['Beach Cove','Boarding']].forEach(([a,b],i)=>{x.fillText(a,20,100+i*50);x.fillStyle=i?'#5fd38a':'#fff';x.fillText(b,330,100+i*50);x.fillStyle='#fff';});});
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.8),new THREE.MeshBasicMaterial({map:db}));bd.position.set(-6,3.2,6.12);g.add(bd);gBox(g,0,0,13,6);
  SPOTS.push({label:'Check in for a flight',sub:'Mountains or beaches · free',color:'#2f6f8f',tx:-14,tz:-118.5,tr:3,run:checkIn});
  const tw=grp(-46,-130,0);cyl(1.4,1.8,18,'#e9edf2',0,9,0,tw,14);const cab=cyl(3,2.6,3,'#bfe0ef',0,19.5,0,tw,12);cab.material=WIN_MAT;cyl(3.3,3.3,0.5,'#3f4f6b',0,21.2,0,tw,12);addCircle(-46,-130,2);
  flat(new THREE.PlaneGeometry(34,20),'#9aa1a8',-14,0.03,-150,3);flat(new THREE.PlaneGeometry(134,12),'#5f666e',0,0.032,-168,3);
  for(let x=-60;x<=60;x+=8)flat(new THREE.PlaneGeometry(4,0.4),'#ffffff',x,0.034,-168,4);for(let x=-64;x<=64;x+=4){for(const z of [-162.4,-173.6]){const b=sph(0.14,'#fff',x,0.15,z,null,6,false);b.material=BULB_MAT;}}
  PLANE=makePlane();PLANE.position.set(-14,0,-150);PLANE.rotation.y=Math.PI/2;scene.add(PLANE);addBox(-14,-150,6.5,8,0);
  const st=box(1.4,0.1,4,'#c9ced6',-12.2,1.1,-148.2,null,false);st.rotation.x=0.5;
  const ws=grp(-60,-158,0);cyl(0.08,0.08,5,'#c9ced6',0,2.5,0,ws,6);const sock=cone(0.4,1.6,'#d97a68',0.8,4.8,0,ws,8);sock.rotation.z=Math.PI/2;
  for(let i=0;i<3;i++){const p=staticNPC(-20+i*3,-114,rr(-0.5,0.5),null,null,pick(["First time flying to the mountains. So excited.","The beach trip is the best way to switch off.","Packing light. Just a book and a playlist."]));const sc=box(0.5,0.7,0.3,pick(['#d97a68','#5fa58f','#6f8fc7']),-20+i*3+0.5,0.35,-113.6);}
  buildBalloon(42,-126);buildNap(58,-142);bikeStand(16,-106,Math.PI/2);
  edgeTrees(-70,70,-186,-102,40);}
function checkIn(){stampId('airport');openPanel({title:'Where to?',eyebrow:'Sky Port',color:'#2f6f8f',sub:'Pick a destination. The flight is free and short.',build:b=>{
  b.innerHTML=`<div class="cards2"><div class="dest"><div class="art" style="background:linear-gradient(160deg,#a9d0f0,#7f8ea3 60%,#5e9e63)"></div><h4>Mountain Retreat</h4><p>Cool air, pine forest, a campfire and a viewpoint over the peaks.</p><button class="btn primary" type="button" data-d="mountain">Fly to the mountains</button></div>
  <div class="dest"><div class="art" style="background:linear-gradient(180deg,#f0a98a,#ffd8a6 45%,#3f8fb5 46%,#ead8b1 80%)"></div><h4>Beach Cove</h4><p>Warm sand, slow waves, a hammock, coconut water and shells to find.</p><button class="btn primary" type="button" data-d="beach">Fly to the beach</button></div></div>`;
  b.querySelectorAll('[data-d]').forEach(x=>x.addEventListener('click',()=>fly(x.dataset.d)));}});}
function fly(dest){const D=dest==='mountain'?MOUNTAIN_W:BEACH_W;closePanel();if(player.bike)dismountBike(true);
  fadeTo(()=>{PLANE.position.set(-58,0,-168);PLANE.rotation.set(0,Math.PI/2,0);
    CINE={t:0,v:0,hideAvatar:true,left:false,update(dt){this.t+=dt;const t=this.t;if(t<7)this.v=Math.min(34,this.v+6*dt);PLANE.position.x+=this.v*dt;
      if(t>6.2){PLANE.position.y+=this.v*0.3*dt;PLANE.rotation.x=-Math.min(0.22,(t-6.2)*0.1);}
      const p=PLANE.position;camera.position.set(p.x-17+Math.min(t,10)*0.4,p.y+5,p.z+10);camera.lookAt(p.x+4,p.y+2,p.z);placeSky();
      if(t>10.5&&!this.left){this.left=true;enterWorld(D,D.spawn,D.spawnRot,D.welcome);}
      if(this.left&&W===D){this.done=true;PLANE.position.set(-14,0,-150);PLANE.rotation.set(0,Math.PI/2,0);award(25,`Trip to ${D.title}`,'trip-'+dest);}}};});}
function flyHome(){enterWorld(MAIN,{x:-14,z:-117},0,'Welcome home to YMH City.');}
function destPlane(x,z,ry){const p=makePlane();p.position.set(x,0,z);p.rotation.y=ry;scene.add(p);addBox(x,z,6.5,8,ry);
  const fx=x-Math.cos(ry)*0+Math.sin(ry)*0,f={x:x+Math.cos(ry)*6,z:z-Math.sin(ry)*6};SPOTS.push({label:'Fly back to YMH City',sub:'The flight home is short',color:'#2f6f8f',tx:f.x,tz:f.z,tr:3,run:flyHome});return p;}

/* ---------- hot air balloon ---------- */
const BAL={riding:false,t:0,phase:'idle',h:0,top:false,lines:0,idx:0};
function stripeTex(cols){return cardTex(512,256,(x,W,H)=>{const n=cols.length*3;for(let i=0;i<n;i++){x.fillStyle=cols[i%cols.length];x.fillRect(i*W/n,0,W/n+1,H);}});}
function balloonMesh(cols){const b=new THREE.Group();const env=new THREE.Mesh(new THREE.SphereGeometry(5,24,18),new THREE.MeshStandardMaterial({map:stripeTex(cols),roughness:0.7}));env.scale.set(1,1.12,1);env.position.y=10;env.castShadow=true;b.add(env);
  const sk=new THREE.Mesh(new THREE.CylinderGeometry(1.3,2.4,2.2,18,1,true),new THREE.MeshStandardMaterial({color:cols[0],side:THREE.DoubleSide}));sk.position.y=4.6;b.add(sk);
  box(2,1.1,2,'#a87b4f',0,0.55,0,b);box(2.2,0.15,2.2,'#7c5a3a',0,1.12,0,b);for(const sx of [-0.9,0.9])for(const sz of [-0.9,0.9])bar(b,[sx,1.1,sz],[sx*1.3,3.6,sz*1.3],0.03,'#5a4632');
  const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:radialTex([[0,'rgba(255,240,180,1)'],[0.3,'rgba(255,160,60,.9)'],[1,'rgba(255,120,40,0)']]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));fl.position.y=3.4;fl.scale.set(1.2,1.6,1);b.add(fl);b.userData.flame=fl;return b;}
function buildBalloon(cx,cz){const g=grp(cx,cz,0);flat(new THREE.CircleGeometry(8,32),'#b6cf9e',0,0.02,0,2,g);
  const bal=balloonMesh(['#d97a68','#f2efe8','#d9b45f','#5aa6c2']);g.add(bal);const an=new THREE.Object3D();an.position.set(0,0.12,0.2);bal.add(an);
  for(const [sx,sz] of [[-3,-3],[3,-3],[-3,3],[3,3]]){cyl(0.08,0.08,0.6,'#7c5a3a',sx,0.3,sz,g,6,false);}
  addBox(cx,cz,1.2,1.2,0);sign('Hot air balloon','rise above it all for a while','#d97a68','#ffffff',4.4,1.1,g,0,1.8,4.6);
  const deco=[];for(const [x,z,h,c] of [[70,-160,46,['#5fa58f','#f2efe8']],[-30,-185,58,['#9a86c9','#d9b45f']],[110,-90,52,['#6f8fc7','#f2efe8']]]){const d=balloonMesh(c);d.position.set(x,h,z);scene.add(d);deco.push({d,x,z,h,ph:Math.random()*TAU});}
  BAL.g=g;BAL.bal=bal;BAL.an=an;
  updaters.push((dt,t)=>{deco.forEach(o=>{o.d.position.set(o.x+Math.sin(t*0.05+o.ph)*20,o.h+Math.sin(t*0.3+o.ph)*2,o.z+Math.cos(t*0.04+o.ph)*15);o.d.userData.flame.material.opacity=0.6+Math.random()*0.4;});
    bal.userData.flame.material.opacity=BAL.riding?0.7+Math.random()*0.3:0.15;
    if(!BAL.riding){bal.position.y=Math.sin(t*0.8)*0.05;return;}
    BAL.t+=dt;let target=0;if(BAL.phase==='up'){const k=Math.min(1,BAL.t/30);target=150*(k*k*(3-2*k));if(k>=1&&!BAL.top){BAL.top=true;}}else if(BAL.phase==='down'){const k=Math.min(1,BAL.t/24);target=BAL.h0*(1-k*k*(3-2*k));if(k>=1){BAL.riding=false;landBalloon();return;}}else target=BAL.h;
    BAL.h=target;bal.position.y=target;bal.position.x=Math.sin(BAL.t*0.02)*Math.min(30,target*0.25);bal.position.z=Math.min(30,target*0.15);if(scene.fog&&W.main)scene.fog.far=360+target*3;});
  SPOTS.push({label:'Board the hot air balloon',sub:'A quiet ride into the sky',color:'#d97a68',tx:cx,tz:cz+5.6,tr:2.8,run:boardBalloon});}
const CALM_LINES=[['Time to relax.','Up here, everything else can wait.'],['Breathe in slowly…','…and let it out even slower.'],['Notice how quiet it is.','Nothing to answer. Nothing to fix.'],['Everything looks smaller from up here.','Even the loud stuff.'],['You\'re doing okay.','Take some of this calm back down with you.']];
let calmTimer=null;
function boardBalloon(){fadeTo(()=>{BAL.riding=true;BAL.phase='up';BAL.t=0;BAL.h=0;BAL.top=false;stampId('balloon');document.body.classList.add('calm-mode');fadeMaster(0.35,5);
  openPanel({dock:true,title:'Hot air balloon',eyebrow:'Sky Port',color:'#d97a68',sub:'Rising slowly.',build:b=>{b.innerHTML=`<p class="lead">Drag to look around: up at the sky, down at the city. Switch views below. Head down whenever you like.</p><div class="row"><button class="btn primary" type="button" id="blD">Begin descent</button></div>`;
    b.querySelector('#blD').addEventListener('click',()=>{if(BAL.phase==='down')return;BAL.phase='down';BAL.h0=BAL.h;BAL.t=0;b.querySelector('#blD').disabled=true;b.querySelector('#blD').textContent='Heading down…';hideCalm();clearInterval(calmTimer);});}});
  startAction({lock:true,balloon:true,viewObj:BAL.bal,fwd:[0,0,1],pose:t=>{resetPose(avatar);idleAnim(avatar,t);},follow:()=>{BAL.an.getWorldPosition(_tv);player.x=_tv.x;player.y=_tv.y;player.z=_tv.z;player.rot=0;},camOff:0.6,dist:15,pitch:0.15,exit:{x:BAL.g.position.x,z:BAL.g.position.z+5.6},onEnd:()=>{BAL.riding=false;BAL.phase='idle';BAL.bal.position.set(0,0,0);endCalm();}});
  BAL.idx=0;});}
function endCalm(){document.body.classList.remove('calm-mode');hideCalm();clearInterval(calmTimer);fadeMaster(0.9,3);if(scene.fog&&W.main)scene.fog.far=360;}
function landBalloon(){award(20,'Hot air balloon ride','balloon');done('balloonride');toast('Back on the ground. Carry a little of that calm with you.');if(panelOpen)closePanel();else if(player.action)endAction();}

/* ---------- Nap Garden ---------- */
let NAP=null;
function hammock(g,x,z,ry){const h=grp(x,z,ry,g);for(const sz of [-1.6,1.6]){cyl(0.08,0.1,2.2,'#7c5a3a',0,1.1,sz,h,6);}const fab=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,3.0,16,1,true,Math.PI*0.6,Math.PI*0.8),new THREE.MeshStandardMaterial({color:pick(['#d9b45f','#c76b80','#5aa6c2','#e0c9a6']),side:THREE.DoubleSide}));fab.rotation.x=Math.PI/2;fab.position.y=1.15;h.add(fab);return h;}
function buildNap(cx,cz){const g=grp(cx,cz,0);flat(new THREE.CircleGeometry(11,40),'#a9c494',0,0.02,0,2,g);
  sign('Nap Garden','shh · rest is productive','#3f4f6b','#ffffff',4.6,1.1,g,-6,1.6,8,-0.6);
  for(let i=0;i<10;i++){const a=i/10*TAU;tree(cx+Math.cos(a)*10.5,cz+Math.sin(a)*10.5,i%3===0?2:0,1.2);addCircle(cx+Math.cos(a)*10.5,cz+Math.sin(a)*10.5,0.6);}
  const ham=[[-4,-2,0.4],[2,-4,-0.2],[5,2,1.2]].map(([x,z,r])=>{const h=hammock(g,x,z,r);gCircle(g,x,z,0.6);return {h,x:cx+x,z:cz+z,r};});
  for(const [x,z] of [[-5,5],[0,6]]){const pod=new THREE.Mesh(new THREE.SphereGeometry(1.6,18,12,0,TAU,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#f2efe8',roughness:0.6}));pod.position.set(x,0,z);pod.scale.set(1,0.9,1.4);pod.castShadow=true;g.add(pod);gCircle(g,x,z,1.6);}
  for(let i=0;i<6;i++){const a=i/6*TAU+0.3;const l=sph(0.22,'#fff',Math.cos(a)*7.5,0.5,Math.sin(a)*7.5,g,8,false);l.material=LANTERN_MAT;}
  {const h=ham[1];const p=makePerson({pack:false});p.rotation.order='YXZ';const ax=Math.sin(h.r),az=Math.cos(h.r);p.position.set(h.x-ax*1.3,1.3,h.z-az*1.3);p.rotation.set(-Math.PI/2,h.r+Math.PI,0);scene.add(p);npcs.push({p,update:()=>{},line:'Zzz…',silent:true});}
  NAP={ham};
  [ham[0],ham[2]].forEach((h,i)=>{const sx=h.x+Math.cos(h.r)*1.4,sz=h.z-Math.sin(h.r)*1.4;SPOTS.push({label:'Take a nap',sub:'Lie in the hammock for a while',color:'#3f4f6b',tx:sx,tz:sz,tr:2.2,run:()=>napPanel(h,{x:sx,z:sz})});});}
function napPanel(h,exit){openPanel({title:'Take a nap',eyebrow:'Nap Garden',color:'#3f4f6b',sub:'A short rest can boost focus and mood. Pick how long.',build:b=>{
  b.innerHTML=`<p class="lead">Power naps of 10 to 20 minutes help many people feel more alert without grogginess. A one-minute rest is great for a quick reset.</p><div class="row"><button class="btn" type="button" data-m="1">1 minute</button><button class="btn" type="button" data-m="10">10 minutes</button><button class="btn primary" type="button" data-m="20">20 minutes</button></div><p class="meta" style="margin-top:10px">A soft chime will wake you. You can wake up any time.</p>`;
  b.querySelectorAll('[data-m]').forEach(x=>x.addEventListener('click',()=>{const m=+x.dataset.m;closePanel();startNap(h,exit,m);}));}});}
let napIv=null;
function startNap(h,exit,mins){stampId('nap');const az=Math.sin(h.r),ax=Math.cos(h.r);const foot={x:h.x+az*1.4,z:h.z+Math.cos(h.r)*1.4},head={x:h.x-az*1.4,z:h.z-Math.cos(h.r)*1.4};
  lieDown({headX:head.x,headZ:head.z,footX:foot.x,footZ:foot.z,y:1.0,lock:true,exit,camOff:1.4,dist:5.5,pitch:0.7,onEnd:wakeUp});
  if(AUD.ctx)setLayer('pad',true);const n=$('nap');n.hidden=false;void n.offsetWidth;n.classList.add('on');let left=mins*60;const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;$('napTime').textContent=`Resting · ${fmt(left)} left`;
  clearInterval(napIv);napIv=setInterval(()=>{left--;$('napTime').textContent=`Resting · ${fmt(Math.max(0,left))} left`;if(left<=0){if(player.action)endAction();}},1000);}
function wakeUp(){clearInterval(napIv);const n=$('nap');n.classList.remove('on');setTimeout(()=>{n.hidden=true;},400);if(AUD.ctx){chime();setTimeout(chime,500);}done('nap');award(15,'Took a rest','nap-'+new Date().toDateString());toast('Welcome back. Notice how your body feels now.');}
$('napWake').addEventListener('click',()=>{if(player.action)endAction();else wakeUp();});

/* ---------- Mountain Retreat ---------- */
const MOUNTAIN_W=newWorld({id:'mountain',title:'Mountain Retreat',welcome:'Welcome to the Mountain Retreat. Fresh air, big skies, slow breaths.',spawn:{x:24,z:33},spawnRot:Math.PI,camDist:11,build:buildMountain,onEnter(){setLayer('birds',true);stampId('airport');}});
function buildMountain(w){worldSky(w,{top:'#4f8fd6',mid:'#a9d0f0',bot:'#e8f1f7',fog:'#dbe8f2',fogNear:140,fogFar:460,sun:'#fff4e0',sunI:0.95,hemiS:'#e6f2ff',hemiG:'#7d9b6a',hemiI:0.7,sunOff:[60,90,40],spr:'#fffbe8',sprS:150});
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#8fb07a';x.fillRect(0,0,256,256);for(let i=0;i<2000;i++){x.fillStyle=Math.random()<0.5?'rgba(110,145,95,.5)':'rgba(170,190,140,.45)';x.fillRect(Math.random()*256,Math.random()*256,2,3);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(110,110);const gr=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),new THREE.MeshLambertMaterial({map:t}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;scene.add(gr);
  for(let i=0;i<24;i++){const a=i/24*TAU+rr(-0.1,0.1),d=rr(170,320),h=rr(80,170),r=rr(50,90);const px=Math.cos(a)*d,pz=Math.sin(a)*d-40;cone(r,h,pick(['#7f8ea3','#8a97ab','#76869b']),px,h/2-2,pz,null,7,false);cone(r*0.36,h*0.36,'#f4f7fb',px,h-h*0.18-2,pz,null,7,false);}
  for(let i=0;i<14;i++){const a=rnd()*TAU,d=rr(100,150);const m=sph(rr(25,40),pick(['#7d9b6a','#86a372','#6f8f60']),Math.cos(a)*d,-5,Math.sin(a)*d,null,10,false);m.scale.y=0.35;}
  const wm=new THREE.MeshPhongMaterial({color:'#5d9fc4',shininess:90,specular:'#ffffff',transparent:true,opacity:0.92,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-6});const lake=new THREE.Mesh(new THREE.CircleGeometry(12,48),wm);lake.rotation.x=-Math.PI/2;lake.position.set(-26,0.05,-14);scene.add(lake);flat(new THREE.RingGeometry(12,13.6,48),'#b9ad97',-26,0.04,-14,2);
  for(let i=0;i<14;i++){const a=rnd()*TAU;const m=sph(rr(0.4,0.9),'#9aa1a8',-26+Math.cos(a)*12.8,0.2,-14+Math.sin(a)*12.8,null,6);m.scale.y=0.6;}
  w.water=(x,z)=>Math.hypot(x+26,z+14)<12.4;w.bounds=(p)=>{const d=Math.hypot(p.x,p.z);if(d>95){p.x*=95/d;p.z*=95/d;}};
  [[24,32,10,-8],[10,-8,0,-58],[10,-8,-14,-14],[10,-8,-6,-30]].forEach(p=>trail(p[0],p[1],p[2],p[3],2.6,'#cdbb9a'));
  let n=0,tries=0;while(n<150&&tries<4000){tries++;const a=rnd()*TAU,d=rr(16,92);const x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.hypot(x+26,z+14)<16||Math.hypot(x-10,z+8)<9||Math.hypot(x,z+58)<9||Math.hypot(x-22,z-20)<14||Math.hypot(x+6,z+30)<9)continue;const tg=grp(x,z,rnd()*TAU);const s=rr(1.1,1.9);cyl(0.25*s,0.35*s,1.8*s,'#6b4a2e',0,0.9*s,0,tg,6);const cc=pick(['#3f7a55','#4a8560','#36704d']);cone(1.9*s,2.8*s,cc,0,2.8*s,0,tg,7);cone(1.4*s,2.3*s,cc,0,4.0*s,0,tg,7);cone(0.9*s,1.8*s,cc,0,5.1*s,0,tg,7);if(d<60)addCircle(x,z,0.6);n++;}
  const cg=grp(-6,-34,0);house(cg,{w:9,h:4.2,d:7,z:0,wall:'#a8865a',roof:'#5a4632',trim:'#e9e1d2',door:'#5a4632',prism:true,ph:0.7});
  /* campfire */
  const fx=10,fz=-8;for(let i=0;i<12;i++){const a=i/12*TAU;sph(0.32,'#8a8f96',fx+Math.cos(a)*1.3,0.15,fz+Math.sin(a)*1.3,null,6);}for(let i=0;i<3;i++){const l=cyl(0.15,0.15,1.8,'#5a3d2a',fx,0.25,fz,null,6);l.rotation.z=Math.PI/2;l.rotation.y=i*1.05;}addCircle(fx,fz,1.6);
  const fm=[0,1,2].map(i=>{const m=new THREE.Mesh(new THREE.ConeGeometry(0.5-i*0.12,1.4-i*0.25,8),new THREE.MeshBasicMaterial({color:['#ff8a3d','#ffb347','#ffe08a'][i],transparent:true,opacity:0.9}));m.position.set(fx,0.75,fz);scene.add(m);return m;});
  const fl=new THREE.PointLight('#ffb36b',1.4,18);fl.position.set(fx,1.6,fz);scene.add(fl);
  updaters.push((dt,t)=>{fm.forEach((m,i)=>{m.scale.set(1+Math.sin(t*9+i)*0.12,1+Math.sin(t*7+i*2)*0.2,1+Math.cos(t*8+i)*0.12);m.rotation.y=t*(1+i);});fl.intensity=1.2+Math.sin(t*13)*0.25+Math.sin(t*7)*0.15;});
  [[0,3.6],[1.6,3.6]].forEach(()=>{});for(let i=0;i<4;i++){const a=i/4*TAU+0.4;const x=fx+Math.cos(a)*3.4,z=fz+Math.sin(a)*3.4;const l=cyl(0.3,0.3,2,'#6b4a2e',x,0.3,z,null,8);l.rotation.z=Math.PI/2;l.rotation.y=-a;addCircle(x,z,0.6);}
  for(const [a,ln] of [[0.4+Math.PI/2,"Campfires make the best conversations."],[0.4+Math.PI,"I left my phone in the cabin. Best decision."]]){const x=fx+Math.cos(a)*3.4,z=fz+Math.sin(a)*3.4;const p=staticNPC(x,z,Math.atan2(fx-x,fz-z),null,'sit',ln,-0.45);sitPose(p);}
  const fireSeat={x:fx+Math.cos(0.4)*3.4,z:fz+Math.sin(0.4)*3.4};
  SPOTS.push({label:'Sit by the campfire',sub:'Watch the flames for a while',color:'#d2925c',tx:fireSeat.x+Math.cos(0.4)*1.4,tz:fireSeat.z+Math.sin(0.4)*1.4,tr:2,run:()=>{award(10,'Campfire moment','campfire');done('campfire');
    openPanel({dock:true,title:'By the campfire',eyebrow:'Mountain Retreat',color:'#d2925c',sub:'Crackle, warmth, nowhere to be.',build:b=>restCard(b,{line:'Pull your knees up. Stay as long as you like.',where:'by the campfire'})});
    startAction({x:fireSeat.x,z:fireSeat.z,rot:Math.atan2(fx-fireSeat.x,fz-fireSeat.z),y:-0.45,pose:POSE.sit,camOff:0.9,dist:6.5,pitch:0.25,exit:{x:fireSeat.x+Math.cos(0.4)*1.6,z:fireSeat.z+Math.sin(0.4)*1.6}});}});
  /* viewpoint */
  box(8,0.3,5,'#a8865a',0,0.15,-58);for(let i=0;i<9;i++)cyl(0.06,0.06,1.1,'#7c5a3a',-4+i,0.75,-60.4,null,5,false);box(8,0.08,0.08,'#7c5a3a',0,1.3,-60.4);
  const vb=bench(0,-57.5,Math.PI);SPOTS.push({label:'Take in the view',sub:'The viewpoint over the peaks',color:'#6f8fc7',tx:0,tz:-54.5,tr:2.2,run:()=>{award(10,'Mountain view','mtnview');sitBench(vb);setTimeout(()=>toast('Look at the furthest peak you can see. Breathe out slowly.',4200),800);}});
  destPlane(30,22,Math.PI/2);flat(new THREE.PlaneGeometry(70,9),'#c7b89c',36,0.02,22,2);
  pathWalker([{x:12,z:-12},{x:-12,z:-30},{x:-38,z:-2},{x:0,z:-56}],1.2,{shirt:'#d97a68'});
  {const p=staticNPC(-16,-4,0.8,null,(dt,t)=>{},"Meditating by the lake. You're welcome to sit nearby.",-0.6);crossPose(p);}
  wheelchairUser([{x:18,z:14},{x:6,z:-4}],0.8,"The trails here are smooth and wide. I love it.");
  for(let i=0;i<8;i++){const gg=new THREE.Group();for(let j=0;j<5;j++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),CLOUD_MAT);m.position.set(rr(-5,5),rr(-0.6,1.2),rr(-2,2));m.scale.setScalar(rr(2.4,4));m.scale.y*=0.7;gg.add(m);}gg.position.set(rr(-200,200),rr(60,90),rr(-200,120));scene.add(gg);}}

/* ---------- Beach Cove ---------- */
const BEACH_W=newWorld({id:'beach',title:'Beach Cove',welcome:'Welcome to Beach Cove. Warm sand, slow waves, nowhere to be.',spawn:{x:-18,z:50},spawnRot:Math.PI,camDist:11,build:buildBeach,onEnter(){setLayer('waves',true);stampId('airport');}});
function palm(x,z,s){s=s||1;const g=grp(x,z,rnd()*TAU);let px=0,py=0;for(let i=0;i<7;i++){const seg=cyl(0.22*s,0.28*s,1.1*s,'#9b7a55',px,py+0.55*s,0,g,7);seg.rotation.z=-0.05*i;px+=0.12*i*s*0.4;py+=1.05*s;}
  for(let i=0;i<8;i++){const a=i/8*TAU;const f=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),M(pick(['#4f8a4f','#5b9a55','#467e47'])));f.scale.set(0.35*s,0.08*s,1.9*s);f.position.set(px+Math.sin(a)*1.4*s,py-0.2*s,Math.cos(a)*1.4*s);f.rotation.y=a;f.rotation.x=0.35;f.castShadow=true;g.add(f);}
  for(let i=0;i<3;i++)sph(0.18*s,'#6b4a2e',px+rr(-0.3,0.3),py-0.35*s,rr(-0.3,0.3),g,6);addCircle(x,z,0.5);return g;}
function buildBeach(w){worldSky(w,{top:'#3d5c99',mid:'#f0a98a',bot:'#ffd8a6',fog:'#f4c9a6',fogNear:150,fogFar:520,sun:'#ffc48a',sunI:0.95,hemiS:'#ffe2c8',hemiG:'#c9a87c',hemiI:0.65,sunOff:[0,24,-160],spr:'#ffcf8f',sprS:280});
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#ead8b1';x.fillRect(0,0,256,256);for(let i=0;i<2600;i++){x.fillStyle=Math.random()<0.5?'rgba(205,185,145,.5)':'rgba(250,240,215,.6)';x.fillRect(Math.random()*256,Math.random()*256,2,2);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(120,120);const sand=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),new THREE.MeshLambertMaterial({map:t}));sand.rotation.x=-Math.PI/2;sand.receiveShadow=true;scene.add(sand);
  flat(new THREE.PlaneGeometry(400,5),'#d6be93',0,0.02,1.5,2);
  const sg=new THREE.PlaneGeometry(1000,500,100,50);sg.rotateX(-Math.PI/2);const sea=new THREE.Mesh(sg,new THREE.MeshPhongMaterial({color:'#3f8fb5',shininess:90,specular:'#ffe2c4',transparent:true,opacity:0.94,flatShading:true}));sea.position.set(0,0.12,-250);scene.add(sea);
  const sp=sg.attributes.position;const base=new Float32Array(sp.count);for(let i=0;i<sp.count;i++)base[i]=sp.getZ(i);
  const foam=new THREE.Mesh(new THREE.PlaneGeometry(400,1.2),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.7,depthWrite:false}));foam.rotation.x=-Math.PI/2;foam.position.set(0,0.2,-0.6);scene.add(foam);
  updaters.push((dt,tt)=>{for(let i=0;i<sp.count;i++){const X=sp.getX(i),Z=base[i];const shore=Math.min(1,Math.abs(Z-250)/30);sp.setY(i,(Math.sin(X*0.07+tt*0.9)*0.3+Math.sin(Z*0.11+tt*1.3)*0.22)*shore);}sp.needsUpdate=true;foam.position.z=-0.8+Math.sin(tt*0.8)*0.7;foam.material.opacity=0.45+Math.sin(tt*0.8)*0.25;});
  w.water=(x,z)=>z<-0.6;w.bounds=(p,ox,oz)=>{p.x=clamp(p.x,-90,90);p.z=clamp(p.z,-1,92);};
  for(let i=0;i<22;i++){const x=rr(-80,80),z=rr(10,85);if(Math.abs(x+20)<12&&z>36)continue;if(Math.abs(x+30)<40&&Math.abs(z-62)<8)continue;palm(x,z,rr(0.9,1.3));}
  const p1=palm(8,16,1),p2=palm(13,20,1);const hm=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,5.2,16,1,true,Math.PI*0.6,Math.PI*0.8),new THREE.MeshStandardMaterial({color:'#d97a68',side:THREE.DoubleSide}));hm.rotation.order='YXZ';hm.rotation.set(Math.PI/2,Math.atan2(5,4),0);hm.position.set(10.5,1.2,18);scene.add(hm);
  SPOTS.push({label:'Lie in the hammock',sub:'Listen to the waves',color:'#d97a68',tx:12.5,tz:16.4,tr:2.2,run:()=>{award(10,'Hammock time','hammock');openPanel({dock:true,title:'Hammock',eyebrow:'Beach Cove',color:'#d97a68',sub:'Rock gently. Listen to the waves.',build:b=>restCard(b,{where:'in the hammock'})});
    lieDown({headX:8.4,headZ:16.4,footX:12.6,footZ:19.6,y:1.05,exit:{x:12.5,z:15.6},camOff:1.4,dist:6,pitch:0.6});}});
  const um=['#d97a68','#5aa6c2','#d9b45f'];[[-6,12],[0,10],[22,12]].forEach(([x,z],i)=>{cyl(0.05,0.05,3,'#f2efe8',x,1.5,z,null,6);cone(2.2,0.9,um[i],x,3.1,z,null,10);box(0.9,0.2,2.2,'#f2efe8',x+1.4,0.35,z,null);
    SPOTS.push({label:'Relax on the lounger',sub:'Soak up the sunset',color:'#d9b45f',tx:x+1.4,tz:z+2.2,tr:1.8,run:()=>{award(5,'Sunset rest','lounger');openPanel({dock:true,title:'Sunset lounger',eyebrow:'Beach Cove',color:'#d9b45f',sub:'Facing the water and the sunset.',build:b=>restCard(b,{line:'Sun on the water, waves on repeat.',where:'on the beach'})});
      lieDown({headX:x+1.4,headZ:z+1.1,footX:x+1.4,footZ:z-1,y:0.62,exit:{x:x+1.4,z:z+2.4},camOff:Math.PI+0.6,dist:6,pitch:0.32});}});});
  const sh=grp(-24,30,0);box(5,2.8,3.6,'#c98b55',0,1.4,0,sh);const rf=cone(4.2,1.6,'#d6be93',0,3.6,0,sh,8);rf.scale.z=0.85;box(5.2,1,0.6,'#9b7a55',0,0.5,2.1,sh);sign('Coconut Stand','free coconut water','#5a4632','#f3e3c3',3.6,0.8,sh,0,2.6,1.9);addBox(-24,30,2.6,2.2,0);
  staticNPC(-24,28.4,0,{shirt:'#f2efe8',pack:false},null,"Fresh coconut water! On the house.");
  SPOTS.push({label:'Get coconut water',sub:'Free · stay hydrated',color:'#5fa58f',tx:-24,tz:34,tr:2.2,run:()=>{giveDrink('coconut water','#f3efe0',5,true);toast(COARSE?'Coconut water in hand. Tap Sip.':'Coconut water in hand. Press F to sip.');}});
  const SH=[];for(let i=0;i<10;i++){const sx=rr(-60,60),sz=rr(1.5,22);const m=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),M(pick(['#f2c9c0','#f6e3cf','#e9b9a8','#fff4e6'])));m.scale.set(1,0.5,1.3);m.position.set(sx,0.12,sz);scene.add(m);
    const s={label:'Pick up a shell',sub:'Collect the shells on the shore',color:'#e9b9a8',tx:sx,tz:sz,tr:1.6,ok:()=>m.visible,run:()=>{m.visible=false;SH.push(1);award(2,'Shell found');if(SH.length>=10)earnBadge('shells');toast(SH.length>=10?'All ten shells found! The beach thanks you.':`Shell ${SH.length} of 10.`,1800);}};SPOTS.push(s);}
  for(let i=0;i<3;i++){const b=new THREE.Group();box(1,0.4,3,'#f2efe8',0,0,0,b);const sl=new THREE.Mesh(new THREE.ConeGeometry(1.2,3.2,3),M(pick(['#d97a68','#f2efe8','#d9b45f'])));sl.position.y=1.8;sl.scale.z=0.15;b.add(sl);b.position.set(rr(-80,80),0.3,rr(-90,-40));scene.add(b);const ph=rnd()*TAU;updaters.push((dt,tt)=>{b.position.y=0.3+Math.sin(tt*1.2+ph)*0.2;b.rotation.z=Math.sin(tt+ph)*0.08;});}
  for(const [x,z] of [[-10,26],[-7,27]]){cone(0.6,0.9,'#d6be93',x,0.45,z,null,8);cone(0.3,0.5,'#d6be93',x+0.6,0.25,z+0.4,null,6);}
  [[-9,24.8,0.2],[-6,25.5,-0.4]].forEach(([x,z,r])=>{const p=staticNPC(x,z,r,null,'sit',pick(["Our sandcastle is called Calm Castle.","Building things with your hands is so relaxing."]),-0.74);crossPose(p);});
  pathWalker([{x:-60,z:4},{x:60,z:4}],1.1);pathWalker([{x:50,z:6},{x:-40,z:5}],1.0,{shirt:'#5aa6c2'});
  {const p=staticNPC(30,14,Math.PI,null,(dt,t)=>{stretchPose(p,2,t);},"Sunset yoga. Join me if you like.");}
  wheelchairUser([{x:-30,z:8},{x:10,z:8}],0.8,"The beach boardwalk makes the shore easy to reach.");box(44,0.12,2.4,'#b98a5e',-10,0.06,8);
  destPlane(-30,62,Math.PI/2);flat(new THREE.PlaneGeometry(70,9),'#e0cda5',-24,0.03,62,2);
  updaters.push(()=>{});}
