'use strict';
/* =========================================================
   V8 (part D): views on rides (1st / 2nd / 3rd person),
   better sounds, mountain and beach extras, balloon free
   look, player counts for the YMH team.
   ========================================================= */

/* ---------- ride views ---------- */
const VIEW={mode:store.get('view8','third'),yaw:0,pitch:0,drag:null};
{const _sa=startAction;startAction=function(a){if(a&&a.lock&&!a.viewObj){if(TRAIN.riding){a.viewObj=TRAIN.cars[1];a.fwd=[0,0,1];}else if(AUTO.riding&&AUTO.car){a.viewObj=AUTO.car;a.fwd=[0,0,1];}}
  _sa(a);VIEW.yaw=0;VIEW.pitch=a&&a.balloon?-0.25:0;if(a&&a.balloon&&!store.get('view8set',false))VIEW.mode='first';syncViewUI();};}
{const _rs=rideStart;rideStart=function(o){_rs(o);if(player.action&&o.anchor){player.action.viewObj=o.anchor.parent;player.action.fwd=(RIDE.eye&&RIDE.eye.riding)?[-1,0,0]:[0,0,1];syncViewUI();}};}
{const _ea=endAction;endAction=function(){_ea();if(avatar)avatar.visible=true;syncViewUI();};}
function canView(){return !!(player.action&&player.action.viewObj);}
function syncViewUI(){let el=$('viewSw');if(!el){el=document.createElement('div');el.id='viewSw';el.innerHTML='<span>View</span><button type="button" data-v="first">1st person</button><button type="button" data-v="second">2nd person</button><button type="button" data-v="third">3rd person</button><small>V to switch</small>';document.body.appendChild(el);
    el.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{VIEW.mode=b.dataset.v;store.set('view8',VIEW.mode);store.set('view8set',true);VIEW.yaw=0;VIEW.pitch=player.action&&player.action.balloon?-0.25:0;syncViewUI();track('view',{id:VIEW.mode});}));}
  el.hidden=!canView();el.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===VIEW.mode)));}
window.addEventListener('keydown',e=>{const tag=(e.target.tagName||'').toLowerCase();if(tag==='textarea'||tag==='input')return;if(e.code==='KeyV'&&canView()){const order=['first','second','third'];VIEW.mode=order[(order.indexOf(VIEW.mode)+1)%3];store.set('view8',VIEW.mode);store.set('view8set',true);VIEW.yaw=0;syncViewUI();}});
canvas.addEventListener('pointerdown',e=>{if(canView()&&VIEW.mode!=='third'){VIEW.drag={x:e.clientX,y:e.clientY};}});
window.addEventListener('pointermove',e=>{if(!VIEW.drag)return;const dx=e.clientX-VIEW.drag.x,dy=e.clientY-VIEW.drag.y;VIEW.drag.x=e.clientX;VIEW.drag.y=e.clientY;const bal=player.action&&player.action.balloon;VIEW.yaw-=dx*0.005;if(!bal)VIEW.yaw=clamp(VIEW.yaw,-2.2,2.2);VIEW.pitch=clamp(VIEW.pitch-dy*0.004,bal?-1.45:-0.9,bal?1.35:0.9);});
window.addEventListener('pointerup',()=>{VIEW.drag=null;});
const _vq=new THREE.Quaternion(),_vp=new THREE.Vector3(),_vf=new THREE.Vector3(),_vu=new THREE.Vector3(),_vr=new THREE.Vector3(),_vt=new THREE.Vector3();
{const _uc=updateCamera;updateCamera=function(dt,t){if(CINE||!canView()||VIEW.mode==='third'){if(avatar)avatar.visible=!(CINE&&CINE.hideAvatar);_uc(dt,t);return;}
  const a=player.action;const o=a.viewObj;o.updateMatrixWorld();o.getWorldQuaternion(_vq);const f=a.fwd||[0,0,1];_vf.set(f[0],f[1],f[2]).applyQuaternion(_vq);if(a.balloon){_vf.set(0,0,1);}
  _vf.y*=a.balloon?0:1;_vf.normalize();_vu.set(0,1,0);
  const head=_vp.set(player.x,player.y+1.35,player.z);
  if(VIEW.mode==='first'){avatar.visible=false;const yawQ=new THREE.Quaternion().setFromAxisAngle(_vu,VIEW.yaw);const dir=_vf.clone().applyQuaternion(yawQ);_vr.crossVectors(dir,_vu).normalize();dir.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(_vr,VIEW.pitch));
    camera.position.copy(head).addScaledVector(_vf,0.25);if(a.balloon){_vt.set(dir.x,0,dir.z);if(_vt.lengthSq()>1e-4){_vt.normalize();camera.position.addScaledVector(_vt,1.5);}camera.position.y+=0.5;}camera.lookAt(_vt.copy(camera.position).add(dir));}
  else{avatar.visible=true;const yawQ=new THREE.Quaternion().setFromAxisAngle(_vu,VIEW.yaw);const back=_vf.clone().applyQuaternion(yawQ);camera.position.copy(head).addScaledVector(back,3.4).add(_vt.set(0,0.5+VIEW.pitch*1.5,0));camera.lookAt(head.x,head.y-0.1,head.z);}
  if(camera.position.y<0.5)camera.position.y=0.5;placeSky();};}

/* ---------- sounds: bike, train, rain, fire ---------- */
function loopNoise(type,f,q,color){const c=AUD.ctx;const n=c.sampleRate*3;const b=c.createBuffer(1,n,c.sampleRate);const d=b.getChannelData(0);let last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(color==='brown'){last=(last+0.02*w)/1.02;d[i]=last*3.5;}else d[i]=w;}
  const s=c.createBufferSource();s.buffer=b;s.loop=true;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||0.7;const g=c.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(SFX.out);s.start();return{g,fl};}
const SND={ready:false,tick:0,chuff:0,clack:0,drop:0,pop:0};
function sndInit(){if(SND.ready||!sfxInit())return SND.ready;SND.tyre=loopNoise('lowpass',420,0.6,'brown');SND.trainR=loopNoise('lowpass',160,0.7,'brown');SND.fire=loopNoise('lowpass',320,0.5,'brown');SND.rain=loopNoise('lowpass',1600,0.5,'brown');SND.ready=true;return true;}
TICKS.push((dt,t)=>{if(!SFX.ready||!AUD.ctx||AUD.ctx.state!=='running')return;sndInit();const on=anyOn();
  /* bicycle: soft tyres on the path and a freewheel tick when coasting */
  const bk=player.bike&&player.moving?((keys.ShiftLeft||keys.ShiftRight)?1:0.65):0;sg(SND.tyre,on?bk*0.22:0);
  if(on&&player.bike&&player.moving&&t>SND.tick){SND.tick=t+(0.09-bk*0.04);burst(rr(5200,6800),'bandpass',0.015,0.018,6);}
  /* train: a soft chuff, a low rumble and the clickety-clack of rail joints */
  const tn=TRAIN.cars&&TRAIN.cars[0]?(TRAIN.riding?0.9:(SFX.trainNear||0)):0;const v=TRAIN.v||0;sg(SND.trainR,on&&W.main?tn*Math.min(1,v/6)*0.35:0);
  if(on&&W.main&&tn>0.03&&v>0.4){if(t>SND.chuff){SND.chuff=t+Math.max(0.22,1.4/v);burst(rr(500,700),'bandpass',0.16,0.1*tn,0.9);}
    if(t>SND.clack){SND.clack=t+4.3/Math.max(1,v);burst(160,'lowpass',0.06,0.22*tn,1);setTimeout(()=>burst(170,'lowpass',0.06,0.2*tn,1),120);}}
  /* rain: a soft wash plus lots of tiny drops */
  const rl=AUD.L.rain&&AUD.L.rain.on?AUD.L.rain.vol:0;sg(SND.rain,on?rl*0.5:0);
  if(on&&rl>0.02&&t>SND.drop){SND.drop=t+rr(0.02,0.09);burst(rr(1800,5200),'bandpass',rr(0.01,0.03),rr(0.006,0.02)*rl,rr(2,8));}
  /* campfire: low roar, crackles, the odd pop */
  let fv=0;if(W.id==='mountain'){const d=Math.hypot(player.x-10,player.z+8);fv=d<22?Math.pow(1-d/22,1.6):0;}
  sg(SND.fire,on?fv*(0.18+Math.sin(t*3)*0.04+Math.random()*0.04):0);
  if(on&&fv>0.05&&t>SND.pop){SND.pop=t+rr(0.6,2.2);burst(rr(900,1800),'bandpass',0.05,0.25*fv,1.4);}});

/* ---------- mountain: pebble tower (renamed), rest by the lake, tea garden, telescope ---------- */
function teaBush(x,z){const g=grp(x,z,rnd()*TAU);for(let i=0;i<5;i++){const s=sph(rr(0.45,0.65),pick(['#3f8f4f','#4f9e5a','#5aa863']),rr(-0.5,0.5),0.55,rr(-0.35,0.35),g,7);s.scale.y=0.75;}return g;}
function buildTea(cx,cz){clearAround(cx,cz,11);const rows=[];for(let r=0;r<4;r++){for(let i=0;i<7;i++){const x=cx-6+i*2,z=cz-4.5+r*3;teaBush(x,z);rows.push({x,z});}addBox(cx,cz-4.5+r*3,6.6,0.6,0);}
  const sh=grp(cx+8.5,cz,0);box(2.6,0.1,2.2,'#a8865a',0,1.6,0,sh);for(const sx of [-1.1,1.1])for(const sz of [-0.9,0.9])cyl(0.06,0.06,1.6,'#7c5a3a',sx,0.8,sz,sh,5);const rf=cone(2.2,1,'#c76b80',0,2.3,0,sh,4);rf.rotation.y=Math.PI/4;sign('Tea Garden','pick ten leaves for hill chai','#3f8f4f','#ffffff',2.8,0.8,sh,0,1.2,1.15);gBox(sh,0,0,1.3,1.1);
  const picker=staticNPC(cx-7.5,cz+5,Math.PI/2,{shirt:'#e84393',style:6,pack:false},(dt,t)=>{idleAnim(picker,t);picker.userData.arms[1].rotation.x=-1.2+Math.sin(t*2)*0.25;},"Two leaves and a bud, that's the rule. Want to try?");
  const basket=new THREE.Group();cyl(0.18,0.13,0.25,'#c98b55',0,0,0,basket,10);let picked=0;const leaves=[];
  const spotT={label:'Pick tea leaves',sub:'Two leaves and a bud, from any bush',color:'#3f8f4f',tx:cx,tz:cz,tr:7,run:()=>{if(!basket.parent){basket.position.set(0,-0.72,0.12);avatar.userData.arms[0].add(basket);}const near_=rows.reduce((a,b)=>Math.hypot(b.x-player.x,b.z-player.z)<Math.hypot(a.x-player.x,a.z-player.z)?b:a,rows[0]);
    player.rot=Math.atan2(near_.x-player.x,near_.z-player.z);player.gest='reach';player.gestT=player.gestD=0.7;picked++;const lf=sph(0.06,'#5aa863',rr(-0.08,0.08),0.12+picked*0.008,rr(-0.08,0.08),basket,5,false);leaves.push(lf);if(SFX.ready)burst(2600,'bandpass',0.08,0.06,2);
    if(picked<10)toast(`${picked} of 10 · ${pick(['Nice and gentle.','Two leaves and a bud.','That smells amazing.','Good one.'])}`,1400);
    else{toast('Ten! The tea-shed hands you a cup of fresh hill chai.',3000);basket.parent&&basket.parent.remove(basket);leaves.length=0;picked=0;giveDrink('hill chai','#c9965f',5,false);earnBadge('tea');done('tea');award(10,'Picked tea leaves','tea');track('activity',{id:'tea'});}}};
  SPOTS.push(spotT);}
function buildTelescope(vx,vz){const g=grp(vx,vz,Math.PI);cyl(0.06,0.08,1.2,'#3a3f4a',0,0.6,0,g,6);const tb=cyl(0.12,0.16,1.1,'#d9b45f',0,1.35,0.2,g,12);tb.rotation.x=Math.PI/2-0.25;gCircle(g,0,0,0.4);
  /* things to find, far away */
  const FIND=[];const add=(name,obj,hint)=>{obj.userData.find=true;scene.add(obj);FIND.push({name,obj,hint,found:false});};
  {const t=new THREE.Group();box(4,3,4,'#f2efe8',0,1.5,0,t);const r=cone(3.6,4,'#c0563f',0,5,0,t,4);r.rotation.y=Math.PI/4;cyl(0.08,0.08,3,'#7a5236',0,8,0,t,4);box(1.4,0.8,0.05,'#ffb000',0.7,9,0,t);const hl=sph(24,'#7d9b6a',70,-6,-170,null,12,false);hl.scale.y=0.55;t.position.set(70,6.5,-170);add('a little temple',t,'on a hill to the right');}
  {const w=new THREE.Mesh(new THREE.PlaneGeometry(6,40),new THREE.MeshBasicMaterial({color:'#e8f6ff'}));box(16,70,8,'#7f8ea3',-58,35,-195);w.position.set(-58,32,-190.9);add('a waterfall',w,'down the side of a mountain');}
  {const e=new THREE.Group();box(3,0.25,1,'#4a3a2e',0,0,0,e);sph(0.5,'#ffffff',0,0.2,0.6,e,6);e.scale.setScalar(1.4);add('an eagle',e,'circling in the sky');updaters.push((dt,tt)=>{e.position.set(Math.cos(tt*0.15)*40,58+Math.sin(tt*0.4)*3,-140+Math.sin(tt*0.15)*30);e.rotation.y=-tt*0.15;});}
  {const h=new THREE.Group();const p=makePerson({shirt:'#e2504f',pack:true});p.scale.setScalar(2.4);h.add(p);h.position.set(-34,0,-112);add('a hiker in a red jacket',h,'on the trail to the left');}
  {const rb=new THREE.Group();['#ff6f61','#ffb000','#ffd166','#4fc3a1','#7aa7ff','#b28dff'].forEach((c,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(60-i*2,1,6,40,Math.PI),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.45,fog:false}));rb.add(m);});rb.position.set(-150,0,-260);rb.rotation.y=0.5;add('a rainbow',rb,'far away on the left');}
  const T={on:false,yaw:Math.PI,pitch:0.05,drag:null,fov:camera.fov};
  const TW=MOUNTAIN_W;
  SPOTS.push({label:'Look through the telescope',sub:'Find five hidden things',color:'#6f7782',tx:vx,tz:vz+1.6,tr:2,run:()=>{T.on=true;T.yaw=0;T.pitch=0.06;const eye=new THREE.Vector3(vx,2.2,vz-0.4);
    CINE={hideAvatar:true,update(){camera.fov=18;camera.updateProjectionMatrix();camera.position.copy(eye);camera.lookAt(eye.x+Math.sin(T.yaw+Math.PI)*Math.cos(T.pitch)*10,eye.y+Math.sin(T.pitch)*10,eye.z+Math.cos(T.yaw+Math.PI)*Math.cos(T.pitch)*10);placeSky();},done:false};
    document.body.classList.add('scope');openPanel({dock:true,title:'Telescope',eyebrow:'Mountain Retreat',color:'#6f7782',sub:'Drag to look. Click anything you spot.',build:b=>{const list=()=>b.querySelector('#tsL').innerHTML=FIND.map(f=>`<li class="${f.found?'got':''}">${f.found?'✓ ':'○ '}${f.found?esc(f.name):esc(f.hint)}</li>`).join('');
      b.innerHTML=`<ul class="scope-list" id="tsL"></ul><div class="row"><button class="btn primary" type="button" id="tsX">Step away</button></div>`;list();b.querySelector('#tsX').addEventListener('click',closePanel);T.list=list;return ()=>{T.on=false;CINE.done=true;camera.fov=T.fov;camera.updateProjectionMatrix();document.body.classList.remove('scope');};}});
    track('activity',{id:'telescope'});}});
  canvas.addEventListener('pointerdown',e=>{if(!T.on||W!==TW)return;T.drag={x:e.clientX,y:e.clientY,m:0};});
  window.addEventListener('pointermove',e=>{if(!T.drag)return;const dx=e.clientX-T.drag.x,dy=e.clientY-T.drag.y;T.drag.m+=Math.abs(dx)+Math.abs(dy);T.drag.x=e.clientX;T.drag.y=e.clientY;T.yaw-=dx*0.0016;T.pitch=clamp(T.pitch-dy*0.0016,-0.3,0.6);});
  window.addEventListener('pointerup',e=>{if(!T.drag)return;const moved=T.drag.m>6;T.drag=null;if(moved||!T.on)return;RAY.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1),camera);
    for(const f of FIND){if(f.found)continue;const hits=RAY.intersectObject(f.obj,true);if(hits.length){f.found=true;if(SFX.ready){tone(880,0.2,0.07,'triangle');tone(1320,0.3,0.05,'triangle',null,0.12);}toast(`Spotted ${f.name}!`,1800);if(T.list)T.list();if(FIND.every(q=>q.found)){earnBadge('spotter');done('scope');award(10,'Found everything','scope');}return;}}
    toast('Nothing there. Keep looking.',1000);});}
function buildLakeRest(x,z,ry){clearAround(x,z,3);const b=bench(x,z,ry);SPOTS.push({label:'Sit by the lake',sub:'Watch the water. Study, or don\'t.',color:'#4f9fc4',tx:x,tz:z,tr:2.2,run:()=>{const w=L2W(b,0,0.08);openPanel({dock:true,title:'By the lake',eyebrow:'Mountain Retreat',color:'#4f9fc4',sub:'Still water, pine trees.',build:bb=>restCard(bb,{line:'Nobody needs anything from you here.',where:'by the lake'})});startAction({x:w.x,z:w.z,rot:b.rotation.y,y:-0.18,exit:L2W(b,0,1.5),pose:POSE.sit,camOff:Math.PI+0.35,dist:6.5,pitch:0.32});}});}
{const bm=MOUNTAIN_W.build;MOUNTAIN_W.build=w=>{bm(w);buildTea(40,4);buildTelescope(3.2,-59.6);buildLakeRest(-26,0.6,Math.PI);};}

/* ---------- beach: fly a kite, messages in bottles, lounger rest ---------- */
function buildBeachKite(cx,cz){clearAround(cx,cz,6);const post=grp(cx,cz,0);cyl(0.08,0.08,2.2,'#8a6a4e',0,1.1,0,post,6);sign('Kite hire','free · the wind does the work','#e84393','#ffffff',2.4,0.7,post,0,2.4,0.1);gCircle(post,0,0,0.3);
  const kite=kiteMesh('#e84393','#ffd166');kite.scale.setScalar(1.3);kite.visible=false;scene.add(kite);const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:'#ffffff'}));ln.frustumCulled=false;ln.visible=false;scene.add(ln);
  const K={on:false,h:0.5,v:0,t:0,best:store.get('kiteBest',0)};
  updaters.push((dt,tt)=>{if(!K.on)return;K.t+=dt;K.v-=dt*(0.18+Math.sin(tt*0.7)*0.08);K.h=clamp(K.h+K.v*dt,0,1);K.v*=0.985;if(K.h<=0.02){K.on=false;kite.visible=false;ln.visible=false;toast(`The kite came down after ${Math.floor(K.t)} seconds.`,2400);if(K.ui)K.ui(true);return;}
    const h=handPos();const kx=player.x+Math.sin(tt*0.5)*4,kz=player.z-12-K.h*6,ky=4+K.h*16;kite.position.set(kx,ky,kz);kite.rotation.set(0.3,Math.sin(tt*1.3)*0.3,Math.sin(tt*1.1)*0.4);kite.userData.tail.forEach((b,j)=>{b.position.x=Math.sin(tt*2.6-j*0.7)*0.12*(j+1);});
    const p=lg.attributes.position.array;p[0]=h.x;p[1]=h.y;p[2]=h.z;p[3]=kx;p[4]=ky-1;p[5]=kz;lg.attributes.position.needsUpdate=true;if(K.ui)K.ui(false);
    if(K.t>30&&!K.badge){K.badge=true;earnBadge('kite');done('kite');award(10,'Kept the kite up','kite30');}});
  const tug=()=>{if(!K.on)return;K.v+=0.22;if(K.h>0.93){K.v=-0.25;toast('Too much tug! It dipped.',1000);}player.gest='reach';player.gestT=player.gestD=0.4;if(SFX.ready)burst(700,'bandpass',0.15,0.05,1);};
  SPOTS.push({label:'Fly a kite',sub:'Keep it up as long as you can',color:'#e84393',tx:cx,tz:cz,tr:3,run:()=>{K.on=true;K.h=0.5;K.v=0.1;K.t=0;K.badge=false;kite.visible=true;ln.visible=true;player.rot=Math.PI;cam.yaw=0;
    openPanel({dock:true,title:'Fly a kite',eyebrow:'Beach Cove',color:'#e84393',sub:'The sea breeze does most of the work.',build:b=>{b.innerHTML=`<p class="lead">Press <b>Tug</b> (Space) when the kite starts to sink. Don't overdo it.</p><div class="kmeter"><span class="kband"></span><i id="kM"></i></div><div class="row"><button class="btn primary big" type="button" id="kT">Tug</button><span class="meta" id="kS"></span></div><div class="row"><button class="btn ghost" type="button" id="kX">Reel it in</button></div>`;
      K.ui=(downNow)=>{b.querySelector('#kM').style.bottom=(K.h*100)+'%';b.querySelector('#kS').textContent=`${Math.floor(K.t)} s up · best ${K.best} s`;if(Math.floor(K.t)>K.best){K.best=Math.floor(K.t);store.set('kiteBest',K.best);}};
      b.querySelector('#kT').addEventListener('click',tug);b.querySelector('#kX').addEventListener('click',closePanel);const kd=e=>{if(e.code==='Space'){e.preventDefault();tug();}};addEventListener('keydown',kd);track('activity',{id:'kite'});
      return ()=>{removeEventListener('keydown',kd);K.on=false;kite.visible=false;ln.visible=false;K.ui=null;};}});
    startAction({x:cx,z:cz+2,rot:Math.PI,pose:t=>{resetPose(avatar);idleAnim(avatar,t);avatar.userData.arms[1].rotation.x=-1.9;},camOff:Math.PI+0.0001,dist:9,pitch:0.15});cam.yaw=0;}});}
const BOTTLES=['To whoever finds this: I lost a flip-flop on this beach in 2019. If you see a green one, it\'s mine. Please return it to the sea, it was happy there.','Dear future person. Is Maggi still two minutes? Be honest. It was never two minutes.','I\'m writing this from a boat. I don\'t know how to sail. Send snacks. Actually, I can see the shore. Never mind.','Message from a crab: please stop building sandcastles on my house. Thank you. Regards, Crab.','Hi! I put this in a bottle because my group chat never reads my messages. Thank you for reading it. You\'re my favourite person now.'];
function buildBottles(){const B=[];const xs=[-70,-34,14,52,78];xs.forEach((x0,i)=>{const x=x0+rr(-6,6),z=rr(1.2,3.5);const g=grp(x,z,rnd()*TAU);const bt=cyl(0.14,0.14,0.55,'#7fd3c2',0,0.14,0,g,10);bt.rotation.z=Math.PI/2;bt.material=new THREE.MeshPhongMaterial({color:'#9fe3d6',transparent:true,opacity:0.75,shininess:90});cyl(0.06,0.06,0.18,'#a8744a',0.36,0.14,0,g,6).rotation.z=Math.PI/2;box(0.3,0.06,0.12,'#fff6d8',0,0.14,0,g,false);
    const o={g,read:false};B.push(o);SPOTS.push({label:'Pick up a message in a bottle',sub:'Someone wrote something',color:'#4f9fc4',tx:x,tz:z,tr:2,ok:()=>!o.read,run:()=>{o.read=true;g.visible=false;player.gest='reach';player.gestT=player.gestD=0.8;const n=B.filter(q=>q.read).length;
      openPanel({title:'A message in a bottle',eyebrow:`Beach Cove · ${n} of ${B.length}`,color:'#4f9fc4',sub:'The paper is a bit damp.',build:b=>{b.innerHTML=`<div class="letter" style="text-align:left"><p style="margin:0">${esc(BOTTLES[i])}</p></div><div class="row" style="margin-top:12px"><button class="btn primary" type="button" id="btX">Put it back in the sea</button></div>`;b.querySelector('#btX').addEventListener('click',closePanel);}});
      if(n>=B.length){earnBadge('bottles');done('bottles');award(10,'Read every bottle','bottles');}track('activity',{id:'bottle'});}});});}
{const bb=BEACH_W.build;BEACH_W.build=w=>{bb(w);buildBeachKite(58,26);buildBottles();};}
{const _m=MOUNTAIN_W.onEnter,_b=BEACH_W.onEnter;const tv=()=>{const v=store.get('trips8',{});v[W.id]=1;store.set('trips8',v);if(v.mountain&&v.beach)earnBadge('traveller');};MOUNTAIN_W.onEnter=()=>{_m&&_m();tv();};BEACH_W.onEnter=()=>{_b&&_b();tv();};}

/* ---------- balloon: hide its label while you're in it ---------- */
TICKS.push(()=>{if(!W.main||typeof BAL==='undefined')return;const riding=!!BAL.riding;if(BAL._lbl===undefined){BAL._lbl=MAIN.scene.children.filter(o=>o.isSprite&&Math.abs(o.position.x-42)<1&&Math.abs(o.position.z+126)<1);}BAL._lbl.forEach(s=>s.visible=!riding);});

/* ---------- who's playing: heartbeat + owner panel ---------- */
setInterval(()=>{if(started&&!document.hidden){STATS.last=Date.now();STATS.mins=(STATS.mins||0)+1;store.set('stats7',STATS);statsDirty=true;}},60000);
{const _ss=syncStats;syncStats=async function(){if(!DB||!UID||!statsDirty)return;statsDirty=false;const ev={};for(const k in STATS.ev){ev[k.replace(/[.\/]/g,'_')]=STATS.ev[k];}try{await DB.doc('stats/'+UID).set({vid:STATS.vid,first:STATS.first,last:STATS.last,visits:STATS.visits,mins:STATS.mins||0,ev});}catch(e){}};}
openStats=async function(){if(!(await isOwner())){toast('Visitor stats are only visible to the city\'s owner.');return;}
  openPanel({wide:true,title:'Who\'s playing',eyebrow:'Owner only',color:'#3d6fd6',sub:'Every visitor who opens the city is counted once. Numbers refresh each time you open this.',build:b=>{b.innerHTML='<p class="meta">Loading…</p>';(async()=>{let docs=[];try{const q=await DB.collection('stats').get();docs=q.docs.map(d=>d.data()||{});}catch(e){}
    const now=Date.now(),day=864e5;const players=docs.length,active=docs.filter(d=>now-(d.last||0)<5*60e3).length,today=docs.filter(d=>now-(d.last||0)<day).length,week=docs.filter(d=>now-(d.last||0)<7*day).length,ret=docs.filter(d=>(d.visits||0)>1).length,visits=docs.reduce((a,d)=>a+(d.visits||0),0),mins=docs.reduce((a,d)=>a+(d.mins||0),0);
    const agg={};docs.forEach(d=>{for(const k in (d.ev||{})){const a=agg[k]||(agg[k]={users:0,total:0,repeat:0});a.users++;a.total+=d.ev[k].n||0;if((d.ev[k].n||0)>1)a.repeat++;}});
    const rows=Object.keys(agg).sort((a,c)=>agg[c].users-agg[a].users).map(k=>`<tr><td>${esc(k.replace(/_/g,' '))}</td><td>${agg[k].users}</td><td>${agg[k].repeat}</td><td>${agg[k].total}</td></tr>`).join('');
    b.innerHTML=`<div class="statgrid"><div><b>${players}</b><span>people have played</span></div><div><b>${active}</b><span>playing right now</span></div><div><b>${today}</b><span>in the last 24 hours</span></div><div><b>${week}</b><span>in the last 7 days</span></div><div><b>${ret}</b><span>came back again</span></div><div><b>${visits}</b><span>total visits · ${Math.round(mins/60)} hours played</span></div></div>
      <div class="row" style="margin:6px 0 12px"><button class="btn" type="button" id="stCsv">Download Policy Circle responses (CSV)</button></div><div class="tablewrap"><table class="stat"><thead><tr><th>Zone or activity</th><th>Unique</th><th>Repeat users</th><th>Total</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No data yet.</td></tr>'}</tbody></table></div><p class="meta" style="margin-top:10px">On the YMH website, add a Google Analytics 4 ID to config.js to see the same events there.</p>`;
    b.querySelector('#stCsv').addEventListener('click',exportPolicy);})();}});};
