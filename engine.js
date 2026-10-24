'use strict';
/* =========================================================
   ENGINE: worlds, points, accessibility, avatar, vehicles,
   items, places, interactive map. Overrides core functions.
   ========================================================= */

/* ---------- calmer palettes, Indian skin tones ---------- */
SKIN.length=0;SKIN.push('#c68a5e','#b5774c','#a4693f','#8d5a36','#e0ac85','#d29a6c','#7a4a2b','#f1c7a5','#9b6440','#c99068','#6b3f26');
HAIR.length=0;HAIR.push('#1b1513','#2b1d16','#3a281c','#4a3020','#1b1b24','#5a3a28','#1b1513');
SHIRT.length=0;SHIRT.push('#d97a68','#5fa58f','#d9b45f','#6f8fc7','#9a86c9','#d48aa6','#5aa6c2','#d2925c','#8bb07a','#f2efe8','#c76b80','#3f4f6b','#7c6a58','#e0c9a6');
GREENS.length=0;GREENS.push('#6aa86a','#77b273','#5e9e63','#83b97a','#6fa679');
BLOSSOM.length=0;BLOSSOM.push('#e9b9c8','#efc7d3','#e2a9bb');
GOLD.length=0;GOLD.push('#d9b45f','#cfa555','#e0c278');
player.z=104;
const BUBBLE_COLS=['#ffffff','#fbe9dc','#e3f1ea','#e6eaf8','#f5e3ec','#fbf2d3','#dff0f5','#ece6f7'];
const NAMES=['Aarav','Diya','Kabir','Meera','Rohan','Sana','Ishaan','Zoya','Arjun','Priya','Tenzin','Neha','Farhan','Ananya','Vikram','Simran','Joseph','Lakshmi','Harpreet','Aditi','Nikhil','Fatima','Dev','Riya','Karthik','Ayesha','Siddharth','Mehak','Rahul','Leela'];
const HAIR_STYLES=['Short','Long','Bun','Curly','Ponytail','Buzz cut'];const AV_SKIN='#c68a5e';
const SCARF=['#3f4f6b','#7c6a58','#c76b80','#5fa58f','#2b2b33','#d9c7b0','#6f8fc7'];
const _pg2={curl:new THREE.SphereGeometry(0.1,7,5),pony:new THREE.CylinderGeometry(0.075,0.035,0.46,7),
  wrap:new THREE.SphereGeometry(0.31,16,12,Math.PI/2+0.85,TAU-1.7,0,Math.PI*0.66),drape:new THREE.CylinderGeometry(0.27,0.42,0.42,16,1,true),
  turban:new THREE.SphereGeometry(0.33,14,8,0,TAU,0,Math.PI*0.5),buzz:new THREE.SphereGeometry(0.283,12,8,0,TAU,0,Math.PI*0.52),
  beard:new THREE.SphereGeometry(0.2,10,6,0,TAU,Math.PI*0.5,Math.PI*0.4)};

function makePerson(o){o=o||{};const skin=o.skin||pick(SKIN),hair=o.hair||pick(HAIR),shirt=o.shirt||pick(SHIRT),pants=o.pants||pick(PANTS);
  let hs=o.style;if(hs===undefined||hs===null||hs>5){const r=rnd();hs=r<0.26?0:r<0.46?1:r<0.58?2:r<0.72?3:r<0.86?4:5;}
  const g=new THREE.Group();g.rotation.order='YXZ';const body=new THREE.Group();g.add(body);const s=o.scale||1;body.scale.setScalar(s);
  const mk=(geo,c,x,y,z,p,sh)=>{const m=new THREE.Mesh(geo,M(c));m.position.set(x,y,z);m.castShadow=sh!==false;p.add(m);return m;};
  const legs=[],arms=[];
  for(const sx of [-0.15,0.15]){const pv=new THREE.Group();pv.position.set(sx,0.86,0);body.add(pv);mk(_pg.leg,pants,0,-0.39,0,pv);mk(_pg.shoe,'#3b3b46',0,-0.8,0.05,pv);legs.push(pv);}
  mk(_pg.torso,shirt,0,1.24,0,body);
  for(const sx of [-0.4,0.4]){const pv=new THREE.Group();pv.position.set(sx,1.55,0);body.add(pv);mk(_pg.arm,shirt,0,-0.29,0,pv);mk(_pg.hand,skin,0,-0.64,0,pv);arms.push(pv);}
  const head=new THREE.Group();head.position.y=1.93;body.add(head);mk(_pg.head,skin,0,0,0,head);
  if(hs===0)mk(_pg.hair,hair,0,0.03,-0.03,head);
  else if(hs===1){mk(_pg.hair,hair,0,0.03,-0.03,head);mk(_pg.long,hair,0,-0.22,-0.2,head);}
  else if(hs===2){mk(_pg.hair,hair,0,0.03,-0.03,head);mk(_pg.bun,hair,0,0.3,-0.12,head);}
  else if(hs===3){mk(_pg.hair,hair,0,0.04,-0.03,head);for(let i=0;i<14;i++){const a=i/14*TAU;mk(_pg2.curl,hair,Math.cos(a)*0.25,0.1+(i%3)*0.07,Math.sin(a)*0.25-0.04,head);}mk(_pg2.curl,hair,0,0.3,0,head);}
  else if(hs===4){mk(_pg.hair,hair,0,0.03,-0.03,head);const pp=mk(_pg2.pony,hair,0,0.02,-0.33,head);pp.rotation.x=0.5;}
  else if(hs===5)mk(_pg2.buzz,hair,0,0.02,0,head);
  else if(hs===6){const c=o.scarf||pick(SCARF);mk(_pg2.wrap,c,0,0.01,0,head);mk(_pg2.drape,c,0,-0.36,-0.01,head);}
  else{const c=o.scarf||pick(['#d2925c','#c76b80','#3f4f6b','#e0b84c','#f2efe8','#7c6a58']);const tb=mk(_pg2.turban,c,0,0.06,-0.01,head);tb.scale.set(1.04,1.05,1.08);mk(_pg.bun,c,0,0.15,0.24,head).scale.setScalar(0.7);if(o.beard!==false&&rnd()<0.7)mk(_pg2.beard,hair,0,-0.03,0.04,head);}
  for(const ex of [-0.095,0.095])mk(_pg.eye,'#1f2533',ex,0.03,0.255,head,false);
  if(o.pack!==false&&rnd()<0.38)mk(_pg.pack,pick(['#2f3a4f','#7a4b3a','#3f6b62','#5b4f8a','#9a5a46','#b89a5e']),0,1.32,-0.36,body);
  if(hs<6&&(o.phones===true||(o.phones!==false&&rnd()<0.2))){const hp=new THREE.Mesh(_pg.band,M('#1d2b44'));hp.position.y=0.02;head.add(hp);for(const ex of [-0.29,0.29]){const c=new THREE.Mesh(_pg.cup,M('#1d2b44'));c.position.set(ex,0,0);c.rotation.z=Math.PI/2;head.add(c);}}
  g.userData={legs,arms,body,head,phase:rnd()*TAU,scale:s,bubble:pick(BUBBLE_COLS)};
  return g;}

/* ---------- wheelchair users ---------- */
function makeWheelchair(){const g=new THREE.Group();const fr='#3a4a5c';
  box(0.56,0.08,0.5,'#2f3a4f',0,0.55,0,g);box(0.56,0.55,0.07,'#2f3a4f',0,0.86,-0.27,g);
  const wheels=[];for(const sx of [-0.34,0.34]){const pv=new THREE.Group();pv.position.set(sx,0.34,-0.05);g.add(pv);const w=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.035,6,20),M('#222831'));w.rotation.y=Math.PI/2;pv.add(w);
    for(let k=0;k<3;k++){const sp=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.62,0.02),M('#c9ced6'));sp.rotation.x=k*Math.PI/3;pv.add(sp);}wheels.push(pv);}
  for(const sx of [-0.22,0.22]){const c=cyl(0.07,0.07,0.04,'#222831',sx,0.07,0.32,g,8,false);c.rotation.z=Math.PI/2;cyl(0.015,0.015,0.5,fr,sx,0.32,0.3,g,5,false);}
  box(0.42,0.04,0.18,fr,0,0.16,0.42,g,false);g.userData.wheels=wheels;return g;}
function wheelchairUser(points,speed,line){const g=new THREE.Group();g.rotation.order='YXZ';const ch=makeWheelchair();g.add(ch);const p=makePerson({pack:false});sitPose(p);p.position.y=-0.2;p.userData.arms.forEach(a=>a.rotation.x=-0.4);g.add(p);
  g.userData={scale:1,bubble:p.userData.bubble,legs:p.userData.legs,arms:p.userData.arms,head:p.userData.head,body:p.userData.body};
  g.position.set(points[0].x,0,points[0].z);const st={i:1,step:1,wait:rr(0,3)};speed=speed||1.1;
  addNPC(g,(dt,t)=>{if(st.wait>0){st.wait-=dt;return;}const tg=points[st.i];const dx=tg.x-g.position.x,dz=tg.z-g.position.z;const d=Math.hypot(dx,dz);
    if(d<0.15){if(st.i===points.length-1||st.i===0){st.step=-st.step;st.wait=rr(2,5);}st.i+=st.step;return;}const mv=Math.min(d,speed*dt);g.position.x+=dx/d*mv;g.position.z+=dz/d*mv;
    let da=Math.atan2(dx,dz)-g.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));g.rotation.y+=da*Math.min(1,dt*6);ch.userData.wheels.forEach(w=>w.rotation.x+=mv/0.32);
    p.userData.arms.forEach((a,i)=>a.rotation.x=-0.4-Math.max(0,Math.sin(t*3+i))*0.35);},line||pick(["Every ramp here is smooth. That's how it should be everywhere.","I love that I can get to every corner of this city.","Heading to the Museum. Want to join?","Accessible places make everyone's day easier."]));
  return g;}

/* ---------- worlds ---------- */
const MAIN={id:'main',main:true,built:true,title:'YMH City',scene,colliders,spots:SPOTS,npcs,updaters,sky,sun,sunSpr,sunOff:SUN_OFF,camDist:11,camPitch:0.3};
let W=MAIN;let CINE=null;let switching=false;
function newWorld(o){return Object.assign({scene:new THREE.Scene(),colliders:[],spots:[],npcs:[],updaters:[],built:false,camDist:11,camPitch:0.3},o);}
function buildIn(w,fn){const sv=[scene,colliders,SPOTS,npcs,updaters];scene=w.scene;colliders=w.colliders;SPOTS=w.spots;npcs=w.npcs;updaters=w.updaters;try{fn(w);}finally{[scene,colliders,SPOTS,npcs,updaters]=sv;}}
const fadeEl=$('fade');
function fadeTo(fn){return new Promise(res=>{fadeEl.hidden=false;void fadeEl.offsetWidth;fadeEl.classList.add('on');setTimeout(()=>{try{fn();}catch(e){console.error(e);}setTimeout(()=>{fadeEl.classList.remove('on');setTimeout(()=>{fadeEl.hidden=true;res();},380);},140);},A11Y.rm?80:400);});}
function enterWorld(w,spawn,rot,msg){if(switching)return;switching=true;
  fadeTo(()=>{if(panelOpen)closePanel();if(player.action)endAction();if(player.bike&&!w.allowBike)dismountBike(true);if(HOLD.type==='balloon')letGo(true);
    if(!w.built){buildIn(w,w.build);w.built=true;}
    scene.remove(avatar);scene.remove(player.ring);if(W.onExit)W.onExit();
    W=w;scene=w.scene;colliders=w.colliders;SPOTS=w.spots;npcs=w.npcs;updaters=w.updaters;scene.add(avatar);scene.add(player.ring);
    player.x=spawn.x;player.z=spawn.z;player.rot=rot||0;player.y=0;player.target=null;
    cam.yaw=player.rot+Math.PI;cam.tx=player.x;cam.tz=player.z;cam.ty=2;cam.distT=w.camDist;cam.dist=w.camDist;cam.pitch=w.camPitch;
    nearZone=null;promptEl.hidden=true;bubbleNpc=null;bubbleEl.hidden=true;$('mini').hidden=!w.main;
    if(w.onEnter)w.onEnter();
  }).then(()=>{switching=false;const m=msg||w.welcome;if(m)toast(m,3200);});}
function worldSky(w,c){const hemi2=new THREE.HemisphereLight(c.hemiS,c.hemiG,c.hemiI);scene.add(hemi2);scene.add(new THREE.AmbientLight('#ffffff',c.amb||0.12));
  const s2=new THREE.DirectionalLight(c.sun,c.sunI);s2.castShadow=true;s2.shadow.mapSize.set(2048,2048);const sc=s2.shadow.camera;sc.left=-60;sc.right=60;sc.top=60;sc.bottom=-60;sc.near=10;sc.far=280;s2.shadow.bias=-0.0006;scene.add(s2);scene.add(s2.target);
  const sk=new THREE.Mesh(new THREE.SphereGeometry(600,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new THREE.Color(c.top)},mid:{value:new THREE.Color(c.mid)},bot:{value:new THREE.Color(c.bot)}},vertexShader:sky.material.vertexShader,fragmentShader:sky.material.fragmentShader}));sk.renderOrder=-1;scene.add(sk);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:sunSpr.material.map,color:c.spr||'#ffffff',fog:false,depthWrite:false,transparent:true}));sp.scale.set(c.sprS||150,c.sprS||150,1);scene.add(sp);
  scene.background=new THREE.Color(c.fog);scene.fog=new THREE.Fog(c.fog,c.fogNear||110,c.fogFar||380);
  w.sky=sk;w.sun=s2;w.sunSpr=sp;w.sunOff=new THREE.Vector3(...c.sunOff);}
function roomWorld(w,o){/* o: {w,d,h,floor,wall,bg,exitTo:{x,z,rot}} */
  const g=new THREE.Group();scene.add(g);scene.background=new THREE.Color(o.bg||'#2a2f3d');
  const hl=new THREE.HemisphereLight('#ffffff','#5a5050',o.hemi??0.85);scene.add(hl);w.hemi=hl;w.hemiBase=hl.intensity;const al=new THREE.AmbientLight('#ffffff',o.amb??0.25);scene.add(al);w.amb=al;const dl=new THREE.DirectionalLight('#fff4e0',o.dir??0.45);dl.position.set(10,20,8);scene.add(dl);w.dl=dl;
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(o.w,o.d),new THREE.MeshLambertMaterial({color:o.floor||'#b9a58a'}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;g.add(fl);
  const hw=o.w/2,hd=o.d/2,H=o.h||7,wc=o.wall||'#efe8dc';
  box(o.w,H,0.4,wc,0,H/2,-hd,g,false);box(0.4,H,o.d,wc,-hw,H/2,0,g,false);box(0.4,H,o.d,wc,hw,H/2,0,g,false);
  const gap=3.2;box(hw-gap/2,H,0.4,wc,-(hw+gap/2)/2,H/2,hd,g,false);box(hw-gap/2,H,0.4,wc,(hw+gap/2)/2,H/2,hd,g,false);box(gap,H-3.6,0.4,wc,0,3.6+(H-3.6)/2,hd,g,false);
  box(gap,3.6,0.1,'#20242e',0,1.8,hd+0.05,g,false);
  const ex=sign('Exit',null,'#2fb08c','#ffffff',1.6,0.5,g,0,4.1,hd-0.25);
  addBox(0,-hd,hw,0.3,0);addBox(-hw,0,0.3,hd,0);addBox(hw,0,0.3,hd,0);addBox(-(hw+gap/2)/2,hd,(hw-gap/2)/2,0.3,0);addBox((hw+gap/2)/2,hd,(hw-gap/2)/2,0.3,0);
  w.camBounds={x0:-hw+0.6,x1:hw-0.6,z0:-hd+0.6,z1:hd-0.6,y1:H-0.3};w.bounds=(p)=>{p.x=clamp(p.x,-hw+0.8,hw-0.8);p.z=clamp(p.z,-hd+0.8,hd-0.9);};
  SPOTS.push({label:'Go back outside',sub:o.exitSub||'Return to the city',color:'#2fb08c',tx:0,tz:hd-1.5,tr:2.2,run:()=>enterWorld(MAIN,o.exitTo,o.exitTo.rot)});
  w.exitTo=o.exitTo;w.camDist=o.camDist||7.5;w.camPitch=0.32;return g;}

/* ---------- points ---------- */
const LEVELS=[[0,'Newcomer'],[100,'Explorer'],[300,'Regular'],[600,'Calm Champion'],[1000,'City Legend']];
let POINTS=store.get('points',0);
function levelOf(p){let l=LEVELS[0];for(const x of LEVELS)if(p>=x[0])l=x;return l;}
function nextLevel(p){return LEVELS.find(x=>x[0]>p)||null;}
function award(n,why,key){if(key){const k=store.get('awarded',{});if(k[key])return;k[key]=1;store.set('awarded',k);}
  const before=levelOf(POINTS)[1];POINTS+=n;store.set('points',POINTS);$('ptsVal').textContent=POINTS;
  const el=document.createElement('div');el.className='ptsfloat';el.innerHTML=`<b>+${n}</b>${esc(why||'')}`;document.body.appendChild(el);setTimeout(()=>el.remove(),2500);
  const after=levelOf(POINTS)[1];if(after!==before)setTimeout(()=>toast(`New badge: ${after}`,3000),1200);}
$('ptsVal').textContent=POINTS;

/* ---------- accessibility ---------- */
const A11Y=Object.assign({narrate:false,big:false,contrast:false,rm:!!RM,click:true,perf:false},store.get('a11y',{}));
function applyA11y(){document.body.classList.toggle('big-text',A11Y.big);document.body.classList.toggle('contrast',A11Y.contrast);renderer.setPixelRatio(A11Y.perf?1:Math.min(window.devicePixelRatio||1,1.75));resize();store.set('a11y',A11Y);}
function speak(text,force){if(!A11Y.narrate&&!force)return;try{const s=window.speechSynthesis;if(!s||!text)return;s.cancel();const u=new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,''));u.rate=1;u.lang='en-IN';s.speak(u);}catch(e){}}
{const _t=window.toast;window.toast=function(msg,ms){_t(msg,ms);speak(msg);};}
{const _o=window.openPanel;window.openPanel=function(o){_o(o);if(A11Y.narrate){const lead=pBody.querySelector('.lead,.mindful,.exhibit p');speak(`${o.title}. ${o.sub||''}. ${lead?lead.textContent:''}`);}};}
function openAccess(){openPanel({title:'Accessibility',eyebrow:'Settings',color:'#3f6fb5',sub:'Make the city work the way you need it to.',build:b=>{
  const rows=[['narrate','Read aloud','Speaks places, messages, panels and what people say.'],['click','Click or tap to walk','Click the ground to walk there. Great with a mouse, trackpad or switch.'],['big','Larger text','Makes buttons, panels and messages bigger.'],['contrast','High contrast','Stronger outlines and darker text.'],['rm','Reduce motion','Gentler rides, shorter fades, no camera sway.'],['perf','Performance mode','Lower detail for older laptops and phones.']];
  b.innerHTML=`<div class="mixer" id="axRows"></div><h3 class="h3">Controls</h3><ul class="ticks"><li>Move: WASD or arrow keys, the on-screen joystick, or click the ground.</li><li>Look around: drag. Zoom: scroll.</li><li>Interact: E or Enter. Sip, bite or let go: F. Bike: B. Map: M. Close: Esc.</li><li>Every building has a step-free entrance with a ramp.</li></ul><div class="row" style="margin-top:12px"><button class="btn" type="button" id="axTest">Test read aloud</button></div>`;
  const box=b.querySelector('#axRows');rows.forEach(([k,n,d])=>{const r=document.createElement('div');r.className='track';r.innerHTML=`<button class="toggle" type="button" aria-pressed="${!!A11Y[k]}" aria-label="${n}"></button><div><b>${n}</b><span>${d}</span></div>`;r.querySelector('button').addEventListener('click',e=>{A11Y[k]=!A11Y[k];e.currentTarget.setAttribute('aria-pressed',String(A11Y[k]));applyA11y();if(k==='narrate'&&A11Y.narrate)speak('Read aloud is on.');});box.appendChild(r);});
  b.querySelector('#axTest').addEventListener('click',()=>speak('Welcome to Y M H City, the first virtual mental health city.',true));}});}
$('btnAccess').addEventListener('click',openAccess);
applyA11y();

/* ---------- avatar customisation ---------- */
const AV=Object.assign({shirt:'#ff7a66',style:0,name:'',showName:true},store.get('avatar',{}));AV.skin=AV_SKIN;if(AV.style>5)AV.style=0;
function avatarOpts(){return{shirt:AV.shirt,pants:'#3a4250',skin:AV_SKIN,hair:'#1b1513',style:AV.style,pack:false,phones:false};}
function rebuildAvatar(){if(!avatar)return;const pos=avatar.position.clone(),r=avatar.rotation.y;scene.remove(avatar);avatar=makePerson(avatarOpts());avatar.position.copy(pos);avatar.rotation.y=r;scene.add(avatar);store.set('avatar',AV);}
function setOutfit(c){AV.shirt=c;outfit=c;rebuildAvatar();}
{const sws=$('swatches');const pk=document.createElement('button');pk.className='sw';pk.type='button';pk.style.background='#f28ab3';pk.setAttribute('aria-label','Outfit colour pink');pk.setAttribute('aria-pressed','false');
  pk.addEventListener('click',()=>{sws.querySelectorAll('.sw').forEach(y=>y.setAttribute('aria-pressed',String(y===pk)));setOutfit('#f28ab3');});sws.appendChild(pk);
  sws.querySelectorAll('.sw').forEach(b=>b.setAttribute('aria-pressed',String(b.style.background&&new THREE.Color(b.style.background).getHexString()===new THREE.Color(AV.shirt).getHexString())));
  
  const hr=$('hairRow');HAIR_STYLES.forEach((n,i)=>{const x=document.createElement('button');x.className='tbtn';x.type='button';x.textContent=n;x.setAttribute('aria-pressed',String(i===AV.style));x.addEventListener('click',()=>{hr.querySelectorAll('.tbtn').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));AV.style=i;rebuildAvatar();});hr.appendChild(x);});
  const ip=$('introPlaces');ip.innerHTML='';[['City Centre','#5fa58f'],['Joy Park rides','#e2729a'],['Culture Quarter','#9a86c9'],['Sky Port & trips','#5aa6c2'],['Mini train & bikes','#d2925c'],['Points & passport','#d9b45f']].forEach(([n,c])=>{const s=document.createElement('span');s.innerHTML=`<i style="background:${c}"></i>${n}`;ip.appendChild(s);});
  $('controlsText').innerHTML=COARSE?'Use the <b>joystick</b> or <b>tap the ground</b> to walk, drag to look, and tap the button that pops up near places, people and rides.':'Walk with <b>WASD</b>, arrow keys or by <b>clicking the ground</b>. Drag to look. <b>E</b> to interact, <b>F</b> to sip or let go, <b>B</b> for the bike, <b>M</b> for the map. Open <b>Access</b> for read-aloud and other options.';}

/* ---------- bike ---------- */
function bar(g,a,b,r,c){const v=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const L=v.length();const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,6),M(c));m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.castShadow=true;g.add(m);return m;}
function makeBike(color){const g=new THREE.Group();const fr=color||'#2f6f73';const wheels=[];
  for(const z of [-0.6,0.62]){const pv=new THREE.Group();pv.position.set(0,0.12,z);g.add(pv);const w=new THREE.Mesh(new THREE.TorusGeometry(0.4,0.045,8,24),M('#222831'));w.rotation.y=Math.PI/2;pv.add(w);for(let k=0;k<3;k++){const sp=new THREE.Mesh(new THREE.BoxGeometry(0.015,0.78,0.015),M('#c9ced6'));sp.rotation.x=k*Math.PI/3;pv.add(sp);}wheels.push(pv);}
  bar(g,[0,0.12,-0.6],[0,0.15,0],0.03,fr);bar(g,[0,0.15,0],[0,0.76,-0.25],0.035,fr);bar(g,[0,0.12,-0.6],[0,0.7,-0.22],0.025,fr);bar(g,[0,0.15,0],[0,0.72,0.45],0.035,fr);bar(g,[0,0.72,-0.24],[0,0.74,0.45],0.03,fr);bar(g,[0,0.12,0.62],[0,0.98,0.45],0.03,fr);
  box(0.16,0.06,0.3,'#1d2b44',0,0.8,-0.27,g);bar(g,[-0.32,0.98,0.45],[0.32,0.98,0.45],0.025,'#1d2b44');box(0.3,0.2,0.24,'#b98a5e',0,0.84,0.72,g);
  const crank=new THREE.Group();crank.position.set(0,0.15,0);g.add(crank);box(0.04,0.36,0.04,'#555',0.12,0,0,crank,false);box(0.04,0.36,0.04,'#555',-0.12,0,0,crank,false);
  g.position.y=-0.3;g.userData={wheels,crank};return g;}
function mountBike(){if(player.bike)return;if(player.action)endAction();if(panelOpen)closePanel();player.bike=makeBike(pick(['#2f6f73','#c76b80','#3f4f6b','#d2925c']));avatar.add(player.bike);player.pedal=0;
  const b=$('btnBike');b.hidden=false;b.textContent=COARSE?'Get off bike':'Get off bike (B)';toast(COARSE?'Bike ready. Use the joystick or tap the ground to ride.':'Bike ready. Ride with WASD, hold Shift to go faster, press B to get off.');award(5,'First bike ride','bike');}
function dismountBike(quiet){if(!player.bike)return;avatar.remove(player.bike);player.bike=null;resetPose(avatar);avatar.rotation.z=0;$('btnBike').hidden=true;if(!quiet)toast('Bike parked. Back on foot.');}
$('btnBike').addEventListener('click',()=>dismountBike());
function rideAnim(dt,sp){const u=avatar.userData;resetPose(avatar);player.pedal=(player.pedal||0)+dt*sp*1.2;const a=player.pedal;
  u.legs[0].rotation.x=-1.05+Math.sin(a)*0.45;u.legs[1].rotation.x=-1.05-Math.sin(a)*0.45;u.arms.forEach(x=>x.rotation.x=-1.05);u.arms[0].rotation.z=-0.12;u.arms[1].rotation.z=0.12;
  const b=player.bike.userData;b.crank.rotation.x=a;b.wheels.forEach(w=>w.rotation.x+=dt*sp/0.4);}
function bikeStand(x,z,ry){const g=grp(x,z,ry||0);for(let i=0;i<3;i++){const bk=makeBike(['#2f6f73','#c76b80','#d2925c'][i]);bk.position.set(-1.4+i*1.4,0.3,0);bk.rotation.y=0;g.add(bk);}box(4.6,0.08,0.4,'#56677d',0,0.5,-0.9,g);
  sign('Bikes','free · ride anywhere','#2f6f73','#ffffff',2.4,0.9,g,0,2.2,-1.1);box(0.12,1.8,0.12,'#56677d',0,1.1,-1.1,g);gBox(g,0,-0.2,2.3,1);
  const f=L2W(g,0,1.8);SPOTS.push({label:'Ride a bike',sub:'Free bikes · press B to get off',color:'#2f6f73',tx:f.x,tz:f.z,tr:2.6,ok:()=>!player.bike,run:mountBike});return g;}

/* ---------- ice cream ---------- */
const FLAVORS=[{n:'Chill Mint',c:'#a8dcc5'},{n:'Mango Gratitude',c:'#f2c14e'},{n:'Peaceful Pista',c:'#b8cf8b'},{n:'Strawberry Smiles',c:'#f2a7b5'},{n:'Calm Cocoa',c:'#7b5038'},{n:'Vanilla Rest',c:'#f3ead2'}];
function giveIceCream(fl,cup){dropItem();const g=new THREE.Group();
  if(cup){g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.1,0.16,12),M('#f2efe8')));}else{const cn=new THREE.Mesh(new THREE.ConeGeometry(0.115,0.34,10),M('#d9a35b'));cn.rotation.x=Math.PI;cn.position.y=-0.06;g.add(cn);}
  const sc=fl.map((f,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(0.125,10,8),M(f.c));m.position.y=0.13+i*0.17;g.add(m);return m;});
  g.position.set(0,-0.72,0.07);avatar.userData.arms[1].add(g);Object.assign(HOLD,{type:'icecream',mesh:g,scoops:sc,sipT:0,name:'ice cream'});syncItem();}
function bite(){if(HOLD.type!=='icecream'||HOLD.sipT>0)return;HOLD.sipT=1.2;const top=HOLD.scoops[HOLD.scoops.length-1];
  if(top){top.scale.multiplyScalar(0.68);if(top.scale.x<0.4){HOLD.mesh.remove(top);HOLD.scoops.pop();}}
  if(!HOLD.scoops.length)setTimeout(()=>{if(HOLD.type==='icecream'){dropItem();toast('All gone. Treating yourself counts as self-care too.');award(5,'Ice cream break');}},1300);syncItem();}
function useItem(){if(HOLD.type==='drink')sip();else if(HOLD.type==='icecream')bite();else if(HOLD.type==='balloon')letGo();}
function syncItem(){const b=$('btnItem');const k=COARSE?'':' (F)';if(HOLD.type==='drink'){b.hidden=false;b.textContent=`Sip${k} · ${HOLD.sips} left`;}else if(HOLD.type==='icecream'){b.hidden=false;b.textContent=`Take a bite${k}`;}else if(HOLD.type==='balloon'){b.hidden=false;b.textContent=`Let go of balloon${k}`;}else b.hidden=true;}
function iceCreamPanel(){openPanel({title:'Ice Cream Cart',eyebrow:'Ice cream',color:'#e2729a',sub:'Pick up to three scoops. It\'s free.',build:b=>{let sel=[],cup=false;
  b.innerHTML=`<div class="flavors" id="icF"></div><div class="seg" id="icC" style="margin-top:12px"><button type="button" aria-pressed="true" data-c="0">Cone</button><button type="button" aria-pressed="false" data-c="1">Cup</button></div><p class="meta" id="icS" style="margin:12px 0">Choose at least one scoop.</p><button class="btn primary" type="button" id="icGo" disabled>Hand it over</button>`;
  const F=b.querySelector('#icF');FLAVORS.forEach(f=>{const x=document.createElement('button');x.type='button';x.setAttribute('aria-pressed','false');x.innerHTML=`<i style="background:${f.c}"></i>${f.n}`;x.addEventListener('click',()=>{const i=sel.indexOf(f);if(i>=0)sel.splice(i,1);else if(sel.length<3)sel.push(f);F.querySelectorAll('button').forEach((y,k)=>y.setAttribute('aria-pressed',String(sel.includes(FLAVORS[k]))));b.querySelector('#icS').textContent=sel.length?`Your scoops: ${sel.map(s=>s.n).join(', ')}`:'Choose at least one scoop.';b.querySelector('#icGo').disabled=!sel.length;});F.appendChild(x);});
  b.querySelectorAll('#icC button').forEach(x=>x.addEventListener('click',()=>{cup=x.dataset.c==='1';b.querySelectorAll('#icC button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));}));
  b.querySelector('#icGo').addEventListener('click',()=>{const s=sel.slice();closePanel();giveIceCream(s,cup);toast(COARSE?'Enjoy! Tap "Take a bite".':'Enjoy! Press F to take a bite.');});}});}
function iceCreamCart(x,z,ry){const g=grp(x,z,ry||0);box(2.4,1.1,1.2,'#f6efe6',0,0.75,0,g);for(let i=0;i<4;i++)box(0.6,1.1,0.02,i%2?'#e9a9bd':'#f6efe6',-0.9+i*0.6,0.75,0.61,g,false);
  for(const sx of [-0.9,0.9])cyl(0.25,0.25,0.12,'#3a3f4a',sx,0.2,0.62,g,12).rotation.z=Math.PI/2;box(2.5,0.08,1.3,'#d4c8b8',0,1.34,0,g);
  [['#a8dcc5',-0.6],['#f2a7b5',0],['#f2c14e',0.6]].forEach(([c,sx])=>{sph(0.22,c,sx,1.55,0,g,10);});cyl(0.05,0.05,2.4,'#ffffff',1.05,1.9,-0.4,g,6);cone(1.6,0.7,'#e9a9bd',1.05,3.2,-0.4,g,10);
  sign('Ice Cream Cart','free ice cream',"#c76b80",'#ffffff',2.4,0.7,g,0,2.15,-0.55);gBox(g,0,0,1.3,0.7);
  const v=L2W(g,0,-1.1);staticNPC(v.x,v.z,g.rotation.y,{shirt:'#f2efe8',pack:false},null,pick(["Mango Gratitude is the most popular today.","Try Calm Cocoa. Trust me.","Three scoops? Go for it, it's a good day for it."]));
  const f=L2W(g,0,1.8);SPOTS.push({label:'Get ice cream',sub:'Free · six flavours',color:'#e2729a',tx:f.x,tz:f.z,tr:2.4,run:iceCreamPanel});return g;}

/* ---------- main-world bounds ---------- */
const MAIN_RECTS=[[-100,100,-100,112],[100,178,-72,50],[-205,-100,-80,58],[-72,72,-188,-100]];
function inRects(x,z,R){for(const r of R)if(x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3])return true;return false;}
MAIN.bounds=(p,ox,oz)=>{if(inRects(p.x,p.z,MAIN_RECTS))return;if(inRects(p.x,oz,MAIN_RECTS)){p.z=oz;return;}if(inRects(ox,p.z,MAIN_RECTS)){p.x=ox;return;}p.x=ox;p.z=oz;};
MAIN.water=(x,z)=>inWater(x,z);MAIN.groundY=(x,z)=>groundY(x,z);
function hitsCollider(list,x,z){for(const c of list){if(c.t===0){if(Math.hypot(x-c.x,z-c.z)<c.r+0.4)return true;}else{const dx=x-c.x,dz=z-c.z;const lx=dx*c.c-dz*c.s,lz=dx*c.s+dz*c.c;if(Math.abs(lx)<c.hw+0.4&&Math.abs(lz)<c.hd+0.4)return true;}}return false;}

/* ---------- player ---------- */
const RAY=new THREE.Raycaster();
function updatePlayer(dt,t){
  let ix=0,iy=0;const can=started&&!CINE&&!switching&&(!panelOpen||panelDock);
  if(can){if(keys.KeyW||keys.ArrowUp)iy+=1;if(keys.KeyS||keys.ArrowDown)iy-=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;ix+=joy.x;iy+=joy.y;}
  let mag=Math.min(1,Math.hypot(ix,iy));if(mag>0.08)player.target=null;
  if(mag<=0.08&&player.target&&can&&!player.action){const dx=player.target.x-player.x,dz=player.target.z-player.z;const d=Math.hypot(dx,dz);
    if(d<0.5)player.target=null;else{const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw);const mx=dx/d,mz=dz/d;ix=mx*cy-mz*sy;iy=-mx*sy-mz*cy;mag=Math.min(1,d/1.2);if(mag<0.35)mag=0.35;}}
  const A=player.action;if(A&&mag>0.3&&!A.lock){if(panelOpen)closePanel();else endAction();}
  let turn=0;
  if(player.action){const B=player.action;B.pose(t,dt);if(B.follow)B.follow(t,dt);else player.y=B.y||0;player.moving=false;}
  else if(mag>0.08){const hm=Math.max(1e-4,Math.hypot(ix,iy));const nx=ix/hm,ny=iy/hm;const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw);const mx=cy*nx-sy*ny,mz=-sy*nx-cy*ny;
    const run=keys.ShiftLeft||keys.ShiftRight;let sp=player.bike?(run?24:15):(SET.mobility==='wheel'?(run?13:8):(run?16:8.5));if(joy.id!==null||player.target)sp*=Math.max(0.35,mag);
    const ox=player.x,oz=player.z;const p={x:ox+mx*sp*dt,z:oz+mz*sp*dt};if(W.bounds)W.bounds(p,ox,oz);resolve(p);resolve(p);
    if(W.water&&W.water(p.x,p.z)){if(!W.water(p.x,oz))p.z=oz;else if(!W.water(ox,p.z))p.x=ox;else{p.x=ox;p.z=oz;}}
    const moved=Math.hypot(p.x-ox,p.z-oz);if(player.target){if(moved<sp*dt*0.2){player.stuck=(player.stuck||0)+dt;if(player.stuck>0.5){player.target=null;player.stuck=0;}}else player.stuck=0;}
    player.x=p.x;player.z=p.z;const tr=Math.atan2(mx,mz);let da=tr-player.rot;da=Math.atan2(Math.sin(da),Math.cos(da));const k=Math.min(1,dt*(player.bike?6:12));player.rot+=da*k;turn=da*k/Math.max(dt,1e-3);
    if(player.bike)rideAnim(dt,sp);else if(SET.mobility==='wheel')wheelAnim(dt,sp);else walkAnim(avatar,t*(sp/8.5),SET.mobility==='stick'?0.8:1);player.moving=true;}
  else{if(player.bike)rideAnim(dt,0);else if(SET.mobility==='wheel')wheelAnim(dt,0);else idleAnim(avatar,t);player.moving=false;}
  if(!player.action){const gy=(W.groundY?W.groundY(player.x,player.z):0)+(player.bike?0.625*avatar.scale.y+0.01:0);player.y+=(gy-player.y)*Math.min(1,dt*12);}
  const u=avatar.userData;
  if(player.gestT>0){player.gestT-=dt;const k=Math.sin(Math.PI*Math.max(0,player.gestT)/player.gestD);if(player.gest==='throw'){u.arms[1].rotation.x=-2.8*k;}else if(player.gest==='jab'){u.arms[1].rotation.x=-1.6-0.6*k;}else{u.arms[1].rotation.z=2.7*k;u.arms[1].rotation.x=-0.3*k;}}
  else if(HOLD.type==='drink'||HOLD.type==='icecream'){let r=-0.8;if(HOLD.sipT>0){HOLD.sipT-=dt;const k=Math.max(0,Math.sin(Math.PI*(1-HOLD.sipT/(HOLD.type==='drink'?1.4:1.2))));r-=1.5*k;u.head.rotation.x=-0.2*k;}u.arms[1].rotation.x=r;u.arms[1].rotation.z=0.12;if(HOLD.mesh)HOLD.mesh.rotation.x=-r;}
  else if(HOLD.type==='balloon'){u.arms[1].rotation.x=-0.45;u.arms[1].rotation.z=0.25;}
  if(W.pin&&!player.gestT&&!player.action){u.arms[1].rotation.x=Math.min(u.arms[1].rotation.x,-1.1);}
  avatar.position.set(player.x,player.y,player.z);avatar.rotation.y=player.rot;
  avatar.rotation.x=(player.action&&player.action.lie)?-Math.PI/2:0;
  avatar.rotation.z=player.bike?clamp(-turn*0.08,-0.3,0.3):0;avatar.visible=!(CINE&&CINE.hideAvatar);
  player.ring.visible=!player.action&&!CINE;player.ring.position.set(player.x,player.y+0.06-(player.bike?0.625*avatar.scale.y+0.01:0),player.z);player.ring.material.opacity=0.45+Math.sin(t*3)*0.2;
  updateHeld(dt,t);
  if(TMARK.visible){TMARK.material.opacity-=dt*0.8;TMARK.scale.multiplyScalar(1+dt*0.6);if(TMARK.material.opacity<=0||!player.target)TMARK.visible=false;}
}
const TMARK=new THREE.Mesh(new THREE.RingGeometry(0.4,0.6,32),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));TMARK.rotation.x=-Math.PI/2;TMARK.visible=false;
function startAction(a){if(player.bike)dismountBike(true);if(player.action)endAction();player.target=null;player.action=a;if(a.x!==undefined){player.x=a.x;player.z=a.z;}if(a.rot!==undefined)player.rot=a.rot;player.y=a.y||0;resetPose(avatar);
  if(!a.keepCam)cam.yaw=player.rot+(a.camOff===undefined?0.7:a.camOff);cam.distT=a.dist||7.5;cam.pitch=a.pitch||0.28;}
function endAction(){const a=player.action;if(!a)return;player.action=null;resetPose(avatar);avatar.rotation.x=0;if(a.exit){player.x=a.exit.x;player.z=a.exit.z;if(a.exitRot!==undefined)player.rot=a.exitRot;}player.y=0;cam.distT=W.camDist||11;cam.pitch=W.camPitch||0.3;if(a.onEnd)a.onEnd();}

/* ---------- camera ---------- */
const _sd=new THREE.Vector3();
function updateCamera(dt,t){
  if(CINE){CINE.update(dt,t);if(CINE&&CINE.done)CINE=null;return;}
  let tx,ty,tz;
  if(!started){const narrow=innerWidth<640;cam.yaw=player.rot+(A11Y.rm?0.75:0.75+Math.sin(t*0.25)*0.45);cam.pitch=narrow?0.32:0.14;cam.distT=narrow?7.5:6.2;tx=player.x+(narrow?0:Math.cos(player.rot)*-1.1);ty=narrow?0.2:1.25;tz=player.z;}
  else{tx=player.x;ty=player.y+(player.bike?2.4:2.1);tz=player.z;}
  const k=1-Math.exp(-dt*(started?7:3));cam.tx+=(tx-cam.tx)*k;cam.ty+=(ty-cam.ty)*k;cam.tz+=(tz-cam.tz)*k;cam.dist+=(cam.distT-cam.dist)*(1-Math.exp(-dt*4));
  const cp=Math.cos(cam.pitch);camera.position.set(cam.tx+Math.sin(cam.yaw)*cp*cam.dist,cam.ty+Math.sin(cam.pitch)*cam.dist,cam.tz+Math.cos(cam.yaw)*cp*cam.dist);
  if(W.camBounds){const b=W.camBounds;camera.position.x=clamp(camera.position.x,b.x0,b.x1);camera.position.z=clamp(camera.position.z,b.z0,b.z1);camera.position.y=Math.min(camera.position.y,b.y1);}
  if(camera.position.y<0.8)camera.position.y=0.8;camera.lookAt(cam.tx,cam.ty,cam.tz);placeSky();}
function placeSky(){if(W.sky)W.sky.position.copy(camera.position);
  if(W.sunSpr&&W.sunOff){_sd.copy(W.sunOff).normalize();W.sunSpr.position.copy(camera.position).addScaledVector(_sd,500);}
  if(W.sun&&W.sunOff){const fx=Math.round(player.x/4)*4,fz=Math.round(player.z/4)*4;W.sun.position.set(fx+W.sunOff.x,Math.max(20,W.sunOff.y),fz+W.sunOff.z);W.sun.target.position.set(fx,0,fz);W.sun.target.updateMatrixWorld();}}

/* ---------- HUD ---------- */
function regionName(x,z){if(!W.main)return W.title;if(x>100)return 'Joy Park';if(x<-100)return 'Creative Quarter';if(z<-100)return 'Sky Port';if(z>73)return 'Outside the gate';if(Math.abs(x)>88.5||z<-88.5)return 'Ring Road';
  for(const zn of ZONES){if(zn.id==='fountain')continue;const r=zn.id==='worry'?19:zn.area;if(Math.hypot(x-zn.x,z-zn.z)<r)return zn.name;}const r=Math.hypot(x,z);if(r<17)return 'Central Plaza';if(r<32)return 'Rainbow Loop';if(Math.abs(x)<7&&z>15)return 'Welcome Avenue';return 'The Meadows';}
function updateHUD(dt,t){if(!started)return;
  let nz=null;if(!panelOpen&&!player.action&&!CINE&&!switching){let best=1;if(W.main){for(const zn of ZONES){const r=Math.hypot(player.x-zn.tx,player.z-zn.tz)/zn.tr;if(r<best){best=r;nz=zn;}}}
    for(const sp of SPOTS){if(sp.ok&&!sp.ok())continue;const r=Math.hypot(player.x-sp.tx,player.z-sp.tz)/sp.tr*0.6;if(r<best){best=r;nz=sp;}}}
  if(nz!==nearZone){nearZone=nz;if(nz){promptEl.style.setProperty('--zc',nz.color);$('promptKey').textContent=COARSE?'Tap':'E';const lbl=nz.run?nz.label:((COARSE?'':'Enter ')+nz.name);$('promptText').textContent=lbl;$('promptSub').textContent=nz.sub||'';promptEl.hidden=false;promptEl.style.animation='none';void promptEl.offsetWidth;promptEl.style.animation='';speak(`${nz.run?nz.label:nz.name}. ${nz.sub||''}. Press E.`);}else promptEl.hidden=true;}
  hudTick-=dt;if(hudTick<=0){hudTick=0.15;whereEl.textContent=regionName(player.x,player.z);drawMini();}
  let best=null,bd=5.2;if(!panelOpen&&!CINE&&SET.bubbles!=='hide'){for(const n of npcs){if(n.silent)continue;const p=n.world?n.world():n.p.position;const d=Math.hypot(p.x-player.x,p.z-player.z);if(d<bd){bd=d;best=n;}}}
  if(best!==bubbleNpc){bubbleNpc=best;if(best){if(!best.name)best.name=NAMES[Math.floor(Math.random()*NAMES.length)];bubbleEl.innerHTML=`<b>${esc(best.name)}</b>${esc(best.line)}`;bubbleEl.style.setProperty('--bb',(best.p.userData&&best.p.userData.bubble)||'#ffffff');bubbleEl.hidden=false;speak(`${best.name} says: ${best.line}`);}else bubbleEl.hidden=true;}
  if(bubbleNpc){const p=bubbleNpc.world?bubbleNpc.world():bubbleNpc.p.position;_v.set(p.x,p.y+2.6*((bubbleNpc.p.userData&&bubbleNpc.p.userData.scale)||1)+0.3,p.z).project(camera);
    if(_v.z>1||_v.z<-1){bubbleEl.hidden=true;}else{bubbleEl.hidden=false;const sx=(_v.x+1)/2*innerWidth,sy=(1-_v.y)/2*innerHeight;bubbleEl.style.left=clamp(sx,110,innerWidth-110)+'px';bubbleEl.style.top=sy+'px';}}}

/* ---------- click / tap ---------- */
let downAt=null;
canvas.addEventListener('pointerdown',e=>{downAt={x:e.clientX,y:e.clientY,t:performance.now()};});
canvas.addEventListener('pointerup',e=>{if(!downAt)return;const mv=Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y),dtm=performance.now()-downAt.t;downAt=null;if(mv>7||dtm>650)return;if(!started||CINE||switching||(panelOpen&&!panelDock))return;
  RAY.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1),camera);if(W.onClick&&W.onClick(RAY))return;
  if(!A11Y.click||player.action)return;const o=RAY.ray.origin,d=RAY.ray.direction;if(d.y>=-0.02)return;const tt=-o.y/d.y;if(tt>140)return;const x=o.x+d.x*tt,z=o.z+d.z*tt;player.target={x,z};player.stuck=0;
  if(TMARK.parent!==scene)scene.add(TMARK);TMARK.position.set(x,0.08,z);TMARK.scale.setScalar(1);TMARK.material.opacity=0.9;TMARK.visible=true;});
window.addEventListener('keydown',e=>{const tag=(e.target.tagName||'').toLowerCase();if(tag==='textarea'||tag==='input')return;if(!started)return;
  if(e.code==='KeyB'&&player.bike&&!panelOpen)dismountBike();});

/* ---------- places, stamps, passport ---------- */
const PLACES=[];
function addPlace(o){PLACES.push(Object.assign({stamp:true},o));return o;}
function stamp(pl){if(!pl||!pl.id)return;const s=store.get('stamps',[]);if(!s.includes(pl.id)){s.push(pl.id);store.set('stamps',s);updateStampCount();award(20,`New place: ${pl.name}`);}}
function updateStampCount(){const s=store.get('stamps',[]);const all=PLACES.filter(p=>p.stamp);$('stampCount').textContent=`${all.filter(p=>s.includes(p.id)).length}/${all.length}`;}
function openZone(z){if(z.id==='arcade'){stamp(z);enterWorld(ARCADE_W,{x:0,z:11},Math.PI);return;}
  openPanel({title:z.name,eyebrow:z.id==='help'?'Support':'Activity',color:z.color,sub:z.sub,build:ACT[z.id],dock:!!z.seat});if(z.seat)startAction(z.seat);stamp(z);}
function openPassport(){openPanel({title:'Calm Passport',eyebrow:'Your journey',color:'#d9b45f',sub:'Earn points by trying things. Collect a stamp at every place.',build:b=>{const s=store.get('stamps',[]);const lv=levelOf(POINTS),nx=nextLevel(POINTS);
  const areas={};PLACES.filter(p=>p.stamp).forEach(p=>{(areas[p.area||'City Centre']=areas[p.area||'City Centre']||[]).push(p);});
  b.innerHTML=`<div class="level"><div><div class="eyebrow">Badge</div><b>${lv[1]}</b></div><div style="text-align:right"><div class="eyebrow">Points</div><b>${POINTS}</b><div class="meta">${nx?`${nx[0]-POINTS} to ${nx[1]}`:'Top level reached'}</div></div></div>
  <p class="lead">Points come from breathing, stretching, writing notes, rides, trips, reading in the Museum, sharing ideas at the Policy Circle and more.</p>`+
  Object.keys(areas).map(a=>`<h3 class="h3">${a}</h3><div class="stamps">${areas[a].map(z=>`<div class="stampc ${s.includes(z.id)?'got':''}" style="color:${z.color}"><i style="${s.includes(z.id)?`background:${z.color}`:''}"></i><div><b style="color:var(--ink)">${esc(z.name)}</b><span>${s.includes(z.id)?'Visited':esc(z.sub||'')}</span></div></div>`).join('')}</div>`).join('');}});}
$('btnPts').addEventListener('click',openPassport);

/* ---------- map ---------- */
MAPR.x0=-212;MAPR.z0=-200;MAPR.s=400;
function drawMap(S,labels,board){const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');const k=S/MAPR.s;const P=(a,b)=>w2m(a,b,S);
  x.fillStyle='#dfe5d8';x.fillRect(0,0,S,S);
  const rect=(r,col)=>{const a=P(r[0],r[2]),b=P(r[1],r[3]);x.fillStyle=col;x.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);};
  MAIN_RECTS.forEach((r,i)=>rect(r,i?'#cfdcc2':'#d3dfc8'));rect([-88,88,-88,72],'#bfd4ac');
  {const a=P(-88,-88),b=P(88,72);x.strokeStyle='#6f9a6c';x.lineWidth=1.6*k;x.strokeRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);}
  x.fillStyle='rgba(95,143,98,.5)';for(const t of TREES){const q=P(t.x,t.z);if(q[0]<0||q[1]<0||q[0]>S||q[1]>S)continue;x.beginPath();x.arc(q[0],q[1],1.1*k,0,TAU);x.fill();}
  if(typeof TRACK!=='undefined'&&TRACK.pts.length){x.strokeStyle='#9c8f80';x.lineWidth=1.6*k;x.beginPath();TRACK.pts.forEach((p,i)=>{const q=P(p[0],p[1]);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);});x.closePath();x.stroke();}
  x.strokeStyle='#f3e8d2';x.lineCap='round';for(const s of SEGS){const p1=P(s.x1,s.z1),p2=P(s.x2,s.z2);x.lineWidth=Math.max(1.5,s.w*k);x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.stroke();}
  const o=P(0,0);x.lineWidth=5.4*k;x.beginPath();x.arc(o[0],o[1],28.5*k,0,TAU);x.stroke();x.fillStyle='#f1e6d2';x.beginPath();x.arc(o[0],o[1],16.4*k,0,TAU);x.fill();x.fillStyle='#8cc4df';x.beginPath();x.arc(o[0],o[1],5.2*k,0,TAU);x.fill();
  const l=P(LAKE.x,LAKE.z);x.fillStyle='#efe2c4';x.beginPath();x.arc(l[0],l[1],(LAKE.r+2.3)*k,0,TAU);x.fill();x.fillStyle='#7fbfdf';x.beginPath();x.arc(l[0],l[1],LAKE.r*k,0,TAU);x.fill();
  {const a=P(-66,-174),b=P(66,-162);x.fillStyle='#8a929c';x.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);}
  for(const d of (typeof MAP_DECOR!=='undefined'?MAP_DECOR:[])){const q=P(d.x,d.z);x.fillStyle=d.c;x.beginPath();x.arc(q[0],q[1],d.r*k,0,TAU);x.fill();}
  const pts=PLACES.length?PLACES:ZONES.map(z=>({name:z.name,x:z.x,z:z.z,color:z.color}));
  for(const p of pts){const q=P(p.x,p.z);x.fillStyle=p.color;x.strokeStyle='#ffffff';x.lineWidth=Math.max(1.5,0.8*k);x.beginPath();x.arc(q[0],q[1],Math.max(3,(labels?2.6:3.4)*k),0,TAU);x.fill();x.stroke();}
  if(labels){const fs=Math.max(10,Math.round(S/62));x.textAlign='center';x.textBaseline='bottom';x.font=`700 ${fs}px ${FD}`;x.lineJoin='round';
    for(const p of pts){const q=P(p.x,p.z);const tx=clamp(q[0],S*0.08,S*0.92),ty=q[1]-4*k;x.lineWidth=fs*0.35;x.strokeStyle='rgba(255,255,255,.95)';x.strokeText(p.name,tx,ty);x.fillStyle='#1d2b44';x.fillText(p.name,tx,ty);}
    x.font=`700 ${Math.round(fs*1.1)}px ${FB}`;x.fillStyle='rgba(29,43,68,.55)';[['JOY PARK',140,40],['CREATIVE QUARTER',-152,52],['SKY PORT',0,-182],['CITY CENTRE',0,64]].forEach(([n,a,b])=>{const q=P(a,b);x.fillText(n,q[0],q[1]);});}
  if(board){x.fillStyle='#d9534f';const p=P(-11,66);x.beginPath();x.arc(p[0],p[1],3*k,0,TAU);x.fill();x.font=`700 ${Math.round(S/40)}px ${FB}`;x.textAlign='left';x.textBaseline='middle';x.fillStyle='#1d2b44';x.fillText('You are here',p[0]+5*k,p[1]);}
  return c;}
function drawMini(){if(!miniStatic||!W.main)return;const S=300;mctx.clearRect(0,0,S,S);const p=w2m(player.x,player.z,S);mctx.save();mctx.beginPath();mctx.arc(S/2,S/2,S/2,0,TAU);mctx.clip();
  const zoom=3.6;mctx.translate(S/2,S/2);mctx.scale(zoom,zoom);mctx.translate(-p[0],-p[1]);mctx.drawImage(miniStatic,0,0);
  mctx.fillStyle='rgba(29,43,68,.45)';for(const n of npcs){if(n.world)continue;const q=w2m(n.p.position.x,n.p.position.z,S);mctx.beginPath();mctx.arc(q[0],q[1],0.6,0,TAU);mctx.fill();}
  if(typeof TRAIN!=='undefined'&&TRAIN.cars){const q=w2m(TRAIN.cars[0].position.x,TRAIN.cars[0].position.z,S);mctx.fillStyle='#2f6f73';mctx.beginPath();mctx.arc(q[0],q[1],1.4,0,TAU);mctx.fill();}
  mctx.restore();mctx.save();mctx.translate(S/2,S/2);mctx.rotate(-player.rot+Math.PI);mctx.fillStyle='#ffffff';mctx.strokeStyle='#1d2b44';mctx.lineWidth=4;mctx.beginPath();mctx.moveTo(0,-15);mctx.lineTo(11,11);mctx.lineTo(0,5);mctx.lineTo(-11,11);mctx.closePath();mctx.fill();mctx.stroke();mctx.restore();}
function walkableMain(x,z){return inRects(x,z,MAIN_RECTS)&&!inWater(x,z)&&!hitsCollider(MAIN.colliders,x,z);}
function goTo(pl){const s=pl.spot||{x:pl.x,z:pl.z};const dx=pl.x-s.x,dz=pl.z-s.z;const rot=(Math.abs(dx)+Math.abs(dz)>0.1)?Math.atan2(dx,dz):Math.PI;
  if(W!==MAIN){enterWorld(MAIN,s,rot,`Welcome to ${theName(pl.name)}`);return;}
  fadeTo(()=>{if(panelOpen)closePanel();if(player.action)endAction();player.x=s.x;player.z=s.z;player.rot=rot;player.target=null;cam.yaw=rot+Math.PI;cam.tx=s.x;cam.tz=s.z;cam.distT=11;}).then(()=>toast(`Welcome to ${theName(pl.name)}`,1800));}
function travelTo(x,z){if(W!==MAIN){enterWorld(MAIN,{x,z},player.rot);return;}fadeTo(()=>{if(player.action)endAction();player.x=x;player.z=z;player.target=null;cam.tx=x;cam.tz=z;});}
function openMap(){openPanel({title:'City map',eyebrow:'Find your way',color:'#5fa58f',sub:'Click anywhere on the map to go there, or pick a place below.',build:b=>{
  const S=800;const c=drawMap(S,true);c.className='mapc';c.setAttribute('role','img');c.setAttribute('aria-label','Map of YMH City. Use the list below to travel with the keyboard.');
  if(W.main){const ctx=c.getContext('2d');const p=w2m(player.x,player.z,S);ctx.fillStyle='#ffffff';ctx.strokeStyle='#1d2b44';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p[0],p[1],8,0,TAU);ctx.fill();ctx.stroke();ctx.font=`700 16px ${FB}`;ctx.fillStyle='#1d2b44';ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineWidth=5;ctx.strokeStyle='#fff';ctx.strokeText('You',p[0]+12,p[1]);ctx.fillText('You',p[0]+12,p[1]);}
  const box=document.createElement('div');box.className='map-box';box.appendChild(c);b.appendChild(box);const tip=document.createElement('p');tip.className='map-tip';tip.textContent=COARSE?'Tap a place or an open spot.':'Hover over the map to see places.';b.appendChild(tip);
  const toW=e=>{const r=c.getBoundingClientRect();return{x:MAPR.x0+(e.clientX-r.left)/r.width*MAPR.s,z:MAPR.z0+(e.clientY-r.top)/r.height*MAPR.s};};
  const near=w=>{let best=null,bd=9;for(const p of PLACES){const d=Math.hypot(p.x-w.x,p.z-w.z);if(d<bd){bd=d;best=p;}}return best;};
  c.addEventListener('pointermove',e=>{const w=toW(e),p=near(w);const ok=p||walkableMain(w.x,w.z);tip.textContent=p?`${p.name} · click to go there`:ok?'Open ground · click to walk here':'You can\'t go there';c.style.cursor=ok?'pointer':'not-allowed';});
  c.addEventListener('click',e=>{const w=toW(e),p=near(w);if(p){closePanel();goTo(p);}else if(walkableMain(w.x,w.z)){closePanel();travelTo(w.x,w.z);}});
  const g=document.createElement('div');g.className='goto';const vis=store.get('stamps',[]);const areas={};PLACES.forEach(p=>{(areas[p.area||'City Centre']=areas[p.area||'City Centre']||[]).push(p);});
  Object.keys(areas).forEach(a=>{const h=document.createElement('h5');h.textContent=a;g.appendChild(h);areas[a].forEach(z=>{const x=document.createElement('button');x.type='button';x.innerHTML=`<i style="background:${z.color}"></i><span>${esc(z.name)}${vis.includes(z.id)?' ✓':''}</span>`;x.addEventListener('click',()=>{closePanel();goTo(z);});g.appendChild(x);});});b.appendChild(g);}});}

/* ---------- shared store (Policy Circle, pledges) ---------- */
let DB=null,UID=null;
async function initDB(){try{if(!window.claude||!window.claude.use)return;const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);if(!db||!user)return;const id=await user.id();if(!id)return;DB=db;UID=id;}catch(e){DB=null;}}
async function dbAppend(col,item,max){if(!DB||!UID)throw new Error('nodb');const ref=DB.doc(col+'/'+UID);const snap=await ref.get();const items=snap.exists?((snap.data()||{}).items||[]).slice():[];items.push(item);await ref.set({items:items.slice(-(max||40))});}
async function dbAll(col){if(!DB)return null;try{const q=await DB.collection(col).get();const out=[];q.docs.forEach(d=>{((d.data()||{}).items||[]).forEach(x=>out.push(x));});return out.sort((a,b)=>(b.t||0)-(a.t||0));}catch(e){return null;}}
function localAppend(k,item){const a=store.get(k,[]);a.push(item);store.set(k,a.slice(-60));}

/* ---------- loop / boot ---------- */
let last2=performance.now();const TICKS=[];
function loop(now){const dt=Math.min(0.05,(now-last2)/1000);last2=now;T+=dt;
  try{for(let i=0;i<updaters.length;i++)updaters[i](dt,T);for(const n of npcs)n.update(dt,T);if(W.update)W.update(dt,T);for(const f of TICKS)f(dt,T);
    updatePlayer(dt,T);updateCamera(dt,T);updateHUD(dt,T);stepTOD(dt);}catch(e){console.error(e);}
  renderer.render(scene,camera);requestAnimationFrame(loop);}
async function boot(){const eb=$('enterBtn');eb.textContent='Loading…';
  try{await Promise.race([Promise.all([document.fonts.load(`800 64px "Bricolage Grotesque"`),document.fonts.load(`700 64px "Bricolage Grotesque"`),document.fonts.load(`500 32px Lexend`)]),new Promise(r=>setTimeout(r,2500))]);}catch(e){}
  eb.textContent='Building the city…';await new Promise(r=>setTimeout(r,30));
  buildWorld();setTOD(store.get('tod',null)||autoTOD(),true);cam.tx=player.x;cam.ty=1.2;cam.tz=player.z;cam.dist=8;cam.distT=6.2;
  updateStampCount();eb.disabled=false;eb.textContent='Enter the city';initDB();requestAnimationFrame(loop);}
$('enterBtn').addEventListener('click',()=>{player.rot=Math.PI;cam.yaw=0;
  if(!store.get('coached',false)){store.set('coached',true);const tips=[COARSE?'Tap the ground to walk there, or use the joystick.':'Walk with WASD, or click the ground to walk there. Hold Shift to go faster.','Walk through the rainbow gate. Your next step is always in the top-left corner.'];
    tips.forEach((m,i)=>setTimeout(()=>toast(m,4200),1400+i*5200));}});

/* core bound some buttons directly to old functions; rebind them */
['btnMap','btnPassport','btnItem'].forEach(id=>{const b=$(id);const c=b.cloneNode(true);b.replaceWith(c);});
$('btnMap').addEventListener('click',()=>openMap());$('btnPassport').addEventListener('click',()=>openPassport());$('btnItem').addEventListener('click',()=>useItem());
