'use strict';
/* =========================================================
   INTERIORS: Thought Bubble room, Theatre, Museum, YMH Week
   ========================================================= */

function exitFront(zn){const s=zn.spot;return{x:s.x,z:s.z,rot:Math.atan2(-s.x,-s.z)};}
function cardTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=8;return t;}
function popSound(f){if(!AUD.ctx||AUD.ctx.state!=='running')return;const c=AUD.ctx,t=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(f||520,t);o.frequency.exponentialRampToValueAtTime((f||520)*2.4,t+0.07);g.gain.setValueAtTime(0.14,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.16);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+0.18);}

/* ---------- Thought Bubble Arcade: balloon room ---------- */
let PIN=null;
const ARCADE_W=newWorld({id:'arcade',title:'Thought Bubble Arcade',pin:true,camDist:7,
  welcome:COARSE?'Tap a balloon to pop it with your pin. Every pop shows a kinder thought.':'Walk up to a balloon and press E, or click it, to pop it with your pin.',
  build:buildArcadeRoom,onEnter(){PIN=new THREE.Group();const n=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.5,5),M('#c9ced6'));n.position.y=-0.25;PIN.add(n);const h=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,6),M('#d97a68'));PIN.add(h);PIN.position.set(0,-0.72,0.06);avatar.userData.arms[1].add(PIN);},
  onExit(){if(PIN&&PIN.parent)PIN.parent.remove(PIN);PIN=null;}});
function buildArcadeRoom(w){const g=roomWorld(w,{w:30,d:30,h:8,floor:'#efe9ff',wall:'#e9e0ff',bg:'#f3eeff',hemi:0.7,amb:0.14,dir:0.5,exitTo:exitFront(Z.arcade),exitSub:'Back to the city'});
  const gc=cardTex(512,512,(x)=>{x.fillStyle='#d6c9f3';x.fillRect(0,0,512,512);x.strokeStyle='rgba(160,110,220,.22)';x.lineWidth=3;for(let i=0;i<=512;i+=64){x.beginPath();x.moveTo(i,0);x.lineTo(i,512);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(512,i);x.stroke();}});gc.wrapS=gc.wrapT=THREE.RepeatWrapping;gc.repeat.set(4,4);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(29.6,29.6),new THREE.MeshLambertMaterial({map:gc}));fl.rotation.x=-Math.PI/2;fl.position.y=0.01;g.add(fl);
  for(const [x,z,c] of [[-8,-8,'#ffd6f2'],[8,-8,'#d6f3ff'],[0,6,'#ece0ff']]){const pl=new THREE.PointLight(c,0.22,26);pl.position.set(x,6,z);scene.add(pl);}
  [[0,7.2,-14.7,0,30],[-14.7,7.2,0,Math.PI/2,30],[14.7,7.2,0,-Math.PI/2,30]].forEach(([x,y,z,ry,L],i)=>{const n=new THREE.Mesh(new THREE.BoxGeometry(L,0.12,0.12),new THREE.MeshStandardMaterial({color:'#fff',emissive:i===1?'#6fd8ff':'#ff7fe0',emissiveIntensity:1}));n.position.set(x,y,z);n.rotation.y=ry;g.add(n);});
  sign('Notice it. Name it. Reframe it.','some thoughts are louder than they are true','#7c4fd0','#ffffff',10,1.6,g,0,5.4,-14.6);
  const sc=document.createElement('canvas');sc.width=640;sc.height=320;const sx=sc.getContext('2d');const stex=new THREE.CanvasTexture(sc);
  const board=new THREE.Mesh(new THREE.PlaneGeometry(6,3),new THREE.MeshBasicMaterial({map:stex}));board.position.set(0,2.55,-14.5);g.add(board);
  let popped=0,lastRe='Pop a balloon to see a kinder thought.';
  const drawBoard=()=>{window.ARC_POP=popped;sx.fillStyle='#fffaf2';sx.fillRect(0,0,640,320);sx.fillStyle='#7c4fd0';sx.font=`800 46px ${FD}`;sx.fillText(`Thoughts popped: ${popped}`,30,80);sx.fillStyle='#3a4658';sx.font=`500 26px ${FB}`;wrapLines(sx,lastRe,580).slice(0,4).forEach((l,i)=>sx.fillText(l,30,150+i*36));stex.needsUpdate=true;};drawBoard();
  bench(10,12,Math.PI);bench(-10,12,Math.PI);
  staticNPC(4,12.5,Math.PI,{shirt:'#c76b80',pack:false},null,"Read the thought first. If it sounds like your head on a bad day, pop it.");
  for(const [x,z] of [[-7,-4],[6,-2]]){const p=staticNPC(x,z,rr(0,TAU),null,(dt,t)=>{idleAnim(p,t);const k=(t*0.8+x)%3;p.userData.arms[1].rotation.x=k<0.3?-1.6-Math.sin(k/0.3*Math.PI)*0.6:-1.1;},pick(["I popped 'I wasted the whole day'. Felt good.","I read the kinder ones out loud. Weird, but it helps.","My favourite one: 'I'm new at this.'"]));}
  const BCOL=['#ff9fd6','#9fe3ff','#ffe59f','#b5f5c8','#d5b8ff','#ffc29f'];const bg=new THREE.SphereGeometry(0.55,18,14);const balloons=[];
  const home=()=>({x:rr(-12,12),y:rr(1.7,3.4),z:rr(-12,9)});
  const assign=b=>{const pr=PAIRS[Math.floor(Math.random()*PAIRS.length)];b.pair=pr;if(b.label){g.remove(b.label);}b.label=pillSprite(pr[0],null,0.42,{fs:44,bg:'rgba(20,16,42,.82)',fg:'#ffffff'});g.add(b.label);b.home=home();b.alive=true;b.m.visible=true;b.label.visible=true;};
  for(let i=0;i<14;i++){const m=new THREE.Mesh(bg,new THREE.MeshStandardMaterial({color:BCOL[i%BCOL.length],roughness:0.3,emissive:BCOL[i%BCOL.length],emissiveIntensity:0.12}));m.scale.set(1,1.15,1);m.castShadow=true;g.add(m);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,1.1,4),M('#ffffff'));st.position.y=-1.15;m.add(st);const b={m,ph:Math.random()*TAU,timer:0};assign(b);balloons.push(b);}
  const fx=[];
  function pop(b){if(!b.alive)return;b.alive=false;b.m.visible=false;b.label.visible=false;b.timer=8;popped++;popSound(480+Math.random()*200);
    const p=b.m.position.clone();for(let i=0;i<10;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,4),new THREE.MeshBasicMaterial({color:b.m.material.color}));s.position.copy(p);g.add(s);fx.push({m:s,v:new THREE.Vector3(rr(-3,3),rr(-1,3),rr(-3,3)),t:0,kind:'p'});}
    const r=pillSprite(b.pair[1],'#2fb08c',0.55,{fs:44});r.position.copy(p);g.add(r);fx.push({m:r,t:0,kind:'r'});lastRe=`"${b.pair[0]}" → ${b.pair[1]}`;drawBoard();award(2,'Thought popped');stampId('arcade');if(popped>=5)done('arcade');
    const dx=p.x-player.x,dz=p.z-player.z;player.rot=Math.atan2(dx,dz);player.gest='jab';player.gestT=player.gestD=0.4;}
  const near=()=>{let best=null,bd=2.8;for(const b of balloons){if(!b.alive)continue;const d=Math.hypot(b.m.position.x-player.x,b.m.position.z-player.z);if(d<bd){bd=d;best=b;}}return best;};
  const spot={label:'Pop it with your pin',sub:'',color:'#a066dd',tx:999,tz:999,tr:3,ok:()=>!!spot.b,run:()=>{if(spot.b)pop(spot.b);}};SPOTS.push(spot);
  w.onClick=(ray)=>{const hits=ray.intersectObjects(balloons.filter(b=>b.alive).map(b=>b.m),false);if(!hits.length)return false;const b=balloons.find(x=>x.m===hits[0].object);const d=Math.hypot(b.m.position.x-player.x,b.m.position.z-player.z);
    if(d<6.5)pop(b);else{toast('Walk a little closer to reach that one.',1500);player.target={x:b.m.position.x,z:b.m.position.z};}return true;};
  updaters.push((dt,t)=>{balloons.forEach(b=>{if(!b.alive){b.timer-=dt;if(b.timer<=0)assign(b);return;}const h=b.home;b.m.position.set(h.x+Math.sin(t*0.5+b.ph)*0.8,h.y+Math.sin(t*0.9+b.ph)*0.25,h.z+Math.cos(t*0.4+b.ph)*0.8);b.label.position.set(b.m.position.x,b.m.position.y+0.95,b.m.position.z);});
    {const al=balloons.filter(b=>b.alive).sort((a,c)=>Math.hypot(a.m.position.x-player.x,a.m.position.z-player.z)-Math.hypot(c.m.position.x-player.x,c.m.position.z-player.z));al.forEach((b,i)=>{b.label.visible=i<3;});}
    const n=near();spot.b=n;if(n){spot.tx=n.m.position.x;spot.tz=n.m.position.z;spot.sub=`"${n.pair[0]}"`;}else{spot.tx=999;spot.tz=999;}
    for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.t+=dt;if(f.kind==='p'){f.v.y-=6*dt;f.m.position.addScaledVector(f.v,dt);f.m.scale.setScalar(Math.max(0.01,1-f.t*2));if(f.t>0.5){g.remove(f.m);fx.splice(i,1);}}else{f.m.position.y+=dt*0.5;f.m.material.opacity=Math.max(0,1-Math.max(0,f.t-2.5));if(f.t>3.5){g.remove(f.m);fx.splice(i,1);}}}});}

/* ---------- Theatre ---------- */
const FILM={t:0,playing:false,ctx:null,tex:null,done:false,len:80};
const THEATRE_W=newWorld({id:'theatre',title:'YMH Theatre',camDist:7,build:buildTheatre,onExit(){FILM.playing=false;}});
function buildTheatre(w){const g=roomWorld(w,{w:26,d:34,h:10,floor:'#4a3036',wall:'#2a2330',bg:'#14161d',hemi:0.75,amb:0.22,dir:0.3,exitTo:CQ.exit.theatre,exitSub:'Back to the Creative Quarter'});
  box(22,1,4,'#3a2a2f',0,0.5,-14.6,g);box(19.2,9.2,0.3,'#0e0f13',0,5.6,-16.6,g,false);
  for(const sx of [-10.6,10.6])box(2.2,9.6,0.6,'#8e2232',sx,4.8,-16.2,g);box(24,1.6,0.6,'#8e2232',0,9.4,-16.2,g);
  const c=document.createElement('canvas');c.width=1024;c.height=461;FILM.ctx=c.getContext('2d');FILM.tex=new THREE.CanvasTexture(c);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(18,8.1),new THREE.MeshBasicMaterial({map:FILM.tex}));scr.position.set(0,5.6,-16.4);g.add(scr);drawPoster(FILM.ctx);FILM.tex.needsUpdate=true;
  const rows=[-6,-3.6,-1.2,1.2,3.6,6,8.4,10.8];const seatM=M('#9e2b3a'),backM=M('#7d2230');const sg=new THREE.BoxGeometry(1,0.18,0.9),bgm=new THREE.BoxGeometry(1,0.9,0.15);const seats=[];
  rows.forEach((z,ri)=>{for(const side of [-1,1]){for(let k=0;k<7;k++){const x=side*(2.4+k*1.15);if(ri===0&&k===0)continue;const s=new THREE.Mesh(sg,seatM);s.position.set(x,0.45,z);g.add(s);const b=new THREE.Mesh(bgm,backM);b.position.set(x,0.9,z+0.45);g.add(b);seats.push({x,z,ri,k});}
    addBox(side*5.85,z+0.1,3.95,0.55,0);}});
  /* wheelchair spaces at the front row by the aisle */
  const wt=cardTex(256,256,(x)=>{x.fillStyle='#2f6fb5';x.fillRect(0,0,256,256);x.strokeStyle='#fff';x.lineWidth=14;x.beginPath();x.arc(118,160,52,0.3,TAU-0.6);x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(120,60,18,0,TAU);x.fill();x.fillRect(110,80,20,70);x.fillRect(110,140,70,18);x.fillRect(170,140,18,60);});
  for(const sx of [-2.4,2.4]){const p=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshBasicMaterial({map:wt}));p.rotation.x=-Math.PI/2;p.position.set(sx,0.02,-6);g.add(p);}
  {const wc=new THREE.Group();wc.add(makeWheelchair());const pp=makePerson({pack:false});sitPose(pp);pp.position.y=-0.2;wc.add(pp);wc.position.set(2.4,0,-6.2);wc.rotation.y=Math.PI;g.add(wc);}
  const used=new Set();for(let i=0;i<20;i++){const s=pick(seats);const key=s.x+','+s.z;if(used.has(key)||Math.abs(s.x)<3)continue;used.add(key);const p=makePerson({pack:false});sitPose(p);p.position.set(s.x,-0.21,s.z);p.rotation.y=Math.PI;g.add(p);}
  rows.slice(1,7).forEach(z=>{for(const sx of [-1,1]){const x=sx*2.4;if(used.has(x+','+z))continue;SPOTS.push({label:'Take a seat',sub:'The film starts when you sit',color:'#c76b80',tx:sx*1.1,tz:z+0.2,tr:1.0,run:()=>sitFilm(w,x,z,sx*1.1)});}});
  staticNPC(-3,15,Math.PI,{shirt:'#c76b80',pack:false},null,"Welcome! Any free aisle seat is yours. Wheelchair spaces are at the front.");
  w.update=(dt,t)=>{if(FILM.playing){FILM.t+=dt;drawFilm(FILM.ctx,FILM.t);FILM.tex.needsUpdate=true;if(FILM.t>=FILM.len&&!FILM.done){FILM.done=true;award(20,'Watched Small Steps');done('theatre');toast('Thanks for watching. Small steps count.');}}
    const target=(FILM.playing&&FILM.t<FILM.len)||(typeof VID!=='undefined'&&VID.el)?0.22:w.hemiBase;w.hemi.intensity+=(target-w.hemi.intensity)*Math.min(1,dt*1.5);};}
function sitFilm(w,x,z,ax){FILM.t=0;FILM.done=false;FILM.playing=true;stampId('theatre');
  openPanel({dock:true,title:'Small Steps',eyebrow:'Now showing',color:'#c76b80',sub:'A short film about asking for help · 80 seconds',build:b=>{b.innerHTML=`<p class="lead" id="fmCap" aria-live="polite">Captions appear here too.</p><div class="row"><button class="btn" type="button" id="fmR">Restart</button><button class="btn primary" type="button" id="fmS">Stand up</button></div>`;
    let lastCap='';const iv=setInterval(()=>{const c=filmCaption(FILM.t);if(c!==lastCap){lastCap=c;b.querySelector('#fmCap').textContent=c||'…';if(c)speak(c);}},300);
    b.querySelector('#fmR').addEventListener('click',()=>{FILM.t=0;FILM.done=false;FILM.playing=true;});b.querySelector('#fmS').addEventListener('click',closePanel);return ()=>clearInterval(iv);}});
  startAction({x,z,rot:Math.PI,y:-0.21,pose:POSE.sit,camOff:Math.PI,dist:5.2,pitch:0.12,exit:{x:ax,z:z+0.2},onEnd:()=>{FILM.playing=false;drawPoster(FILM.ctx);FILM.tex.needsUpdate=true;}});}
function drawPoster(x){const W=1024,H=461;const gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,'#24324a');gr.addColorStop(1,'#3a8f9a');x.fillStyle=gr;x.fillRect(0,0,W,H);x.fillStyle='#fff';x.textAlign='center';x.font=`800 84px ${FD}`;x.fillText('Small Steps',W/2,200);x.font=`500 28px ${FB}`;x.fillText('Now showing · take any aisle seat to start',W/2,268);x.textAlign='left';}
const FILM_SCENES=[[0,8,''],[8,20,'Some weeks feel heavier than others.'],[20,32,'When everything piles up, it\'s easy to go quiet.'],[32,44,'"Hey. I made chai. Want to take a walk?"'],[44,56,'Talking doesn\'t fix everything. But it makes it lighter.'],[56,68,'Asking for help is a small step. Small steps count.'],[68,80,'You are not alone.']];
function filmCaption(t){const s=FILM_SCENES.find(s=>t>=s[0]&&t<s[1]);return s?s[2]:'';}
function fig(x,X,Y,s,shirt,skin,hair,bob){Y-=bob||0;x.fillStyle=shirt;x.beginPath();x.moveTo(X-20*s,Y);x.quadraticCurveTo(X,Y-62*s,X+20*s,Y);x.closePath();x.fill();x.fillRect(X-20*s,Y-4*s,40*s,6*s);
  x.fillStyle=skin;x.beginPath();x.arc(X,Y-74*s,17*s,0,TAU);x.fill();x.fillStyle=hair;x.beginPath();x.arc(X,Y-80*s,17*s,Math.PI,TAU);x.fill();x.fillStyle='#1d2b44';x.beginPath();x.arc(X-6*s,Y-74*s,2*s,0,TAU);x.arc(X+6*s,Y-74*s,2*s,0,TAU);x.fill();}
function cloud(x,X,Y,s,col,rain,t){x.fillStyle=col;[[0,0,26],[24,6,20],[-24,6,20],[10,-12,20]].forEach(([dx,dy,r])=>{x.beginPath();x.arc(X+dx*s,Y+dy*s,r*s,0,TAU);x.fill();});
  if(rain){x.strokeStyle='rgba(160,200,255,.8)';x.lineWidth=2;for(let i=0;i<rain;i++){const rx=X-30*s+((i*37)%60)*s,ry=Y+20*s+((t*120+i*29)%(60*s));x.beginPath();x.moveTo(rx,ry);x.lineTo(rx-2,ry+8);x.stroke();}}}
function drawFilm(x,t){const W=1024,H=461;const sc=FILM_SCENES.findIndex(s=>t>=s[0]&&t<s[1]);x.save();x.textAlign='left';
  if(sc<0){x.fillStyle='#0e0f13';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.textAlign='center';x.font=`800 64px ${FD}`;x.fillText('The end',W/2,H/2);x.font=`500 24px ${FB}`;x.fillText('Tele-MANAS · 14416 · free, 24×7',W/2,H/2+50);x.restore();return;}
  const [a,b]=FILM_SCENES[sc];const lt=t-a,dur=b-a;const SK='#c68a5e',HR='#1b1513';
  if(sc===0){x.fillStyle='#14161d';x.fillRect(0,0,W,H);x.fillStyle=`rgba(255,255,255,${Math.min(1,lt/2)})`;x.textAlign='center';x.font=`800 88px ${FD}`;x.fillText('Small Steps',W/2,220);x.font=`500 26px ${FB}`;x.fillText('a YMH City short',W/2,272);}
  else if(sc<=2){x.fillStyle='#1d2238';x.fillRect(0,0,W,H);x.fillStyle='#2b3456';x.fillRect(640,60,240,170);x.fillStyle='#fff';for(let i=0;i<14;i++){x.globalAlpha=0.4+0.6*Math.abs(Math.sin(t*2+i));x.fillRect(650+((i*53)%220),70+((i*31)%150),2,2);}x.globalAlpha=1;
    x.fillStyle='#4a3a30';x.fillRect(200,300,420,18);x.fillRect(220,318,16,90);x.fillRect(584,318,16,90);x.fillStyle='#c9ced6';x.fillRect(420,250,120,50);x.fillStyle='rgba(160,200,255,.35)';x.beginPath();x.arc(480,270,120,0,TAU);x.fill();
    fig(x,360,330,1.4,'#6f8fc7',SK,HR,0);const cs=sc===1?1+lt*0.03:1.4+lt*0.05;cloud(x,360,150,cs,'#5b6178',sc===1?10:22,t);
    if(sc===2){const msgs=['Assignment due Friday','Mom: Did you eat?','Lab report draft','Group chat: 12 new','Library closes at 9'];x.font=`600 20px ${FB}`;msgs.forEach((m,i)=>{if(lt>i*1.6){const mx=[120,560,700,130,520][i],my=[90,120,300,250,380][i];x.fillStyle='rgba(255,255,255,.92)';const w2=x.measureText(m).width+28;x.fillRect(mx,my,w2,40);x.fillStyle='#24324a';x.fillText(m,mx+14,my+27);}});}}
  else if(sc===3){x.fillStyle='#1d2238';x.fillRect(0,0,W,H);x.fillStyle='#4a3a30';x.fillRect(200,300,420,18);fig(x,360,330,1.4,'#6f8fc7',SK,HR,0);cloud(x,360,150,1.6,'#5b6178',14,t);
    const open=Math.min(1,lt/2);x.fillStyle='#ffd98a';x.fillRect(760,110,150,300);x.fillStyle='#6b4a2e';x.fillRect(760,110,150*(1-open),300);
    if(lt>2){const fx=Math.max(640,900-(lt-2)*120);fig(x,fx,400,1.4,'#d48aa6','#a4693f','#2b1d16',Math.abs(Math.sin(t*6))*4);x.fillStyle='#f2efe8';x.fillRect(fx+22,330,18,22);x.fillRect(fx+44,330,18,22);}}
  else if(sc===4){const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#9fd0f0');gr.addColorStop(1,'#f6e7c9');x.fillStyle=gr;x.fillRect(0,0,W,H);x.fillStyle='#ffd98a';x.beginPath();x.arc(820,110,50+lt*2,0,TAU);x.fill();
    x.fillStyle='#8fbf72';x.fillRect(0,360,W,H-360);x.fillStyle='#e8d6b5';x.fillRect(0,380,W,30);for(let i=0;i<6;i++){const tx=((i*190-lt*30)%1200+1200)%1200-100;x.fillStyle='#7c5a3a';x.fillRect(tx,250,14,120);x.fillStyle='#6aa86a';x.beginPath();x.arc(tx+7,240,55,0,TAU);x.fill();}
    const wx=320+lt*18;fig(x,wx,395,1.3,'#6f8fc7',SK,HR,Math.abs(Math.sin(t*6))*4);fig(x,wx+70,395,1.3,'#d48aa6','#a4693f','#2b1d16',Math.abs(Math.sin(t*6+1))*4);cloud(x,wx,210,Math.max(0.3,1.2-lt*0.08),'#9aa3b8',Math.max(0,8-lt),t);}
  else if(sc===5){x.fillStyle='#f3e6d4';x.fillRect(0,0,W,H);x.fillStyle='#cfe3f0';x.fillRect(400,60,220,150);x.strokeStyle='#fff';x.lineWidth=8;x.strokeRect(400,60,220,150);x.fillStyle='#c9a87c';x.fillRect(0,400,W,61);
    x.fillStyle='#5fa58f';x.fillRect(260,300,120,100);x.fillRect(640,300,120,100);fig(x,320,330,1.3,'#6f8fc7',SK,HR,0);fig(x,700,330,1.3,'#9a86c9','#8d5a36','#3a281c',0);
    x.fillStyle='#7c5a3a';x.fillRect(840,330,40,70);x.fillStyle='#6aa86a';x.beginPath();x.arc(860,310,40,0,TAU);x.fill();
    const k=Math.floor(t*2)%3;x.fillStyle='#24324a';for(let i=0;i<3;i++){x.globalAlpha=i<=k?1:0.25;x.beginPath();x.arc((lt%6<3?380:600)+i*16,200,5,0,TAU);x.fill();}x.globalAlpha=1;}
  else{const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#f6b48a');gr.addColorStop(1,'#ffe9c4');x.fillStyle=gr;x.fillRect(0,0,W,H);x.fillStyle='#ffd98a';x.beginPath();x.arc(W/2,330,60+lt*4,0,TAU);x.fill();x.fillStyle='#8fbf72';x.fillRect(0,360,W,H-360);
    const gh=Math.min(110,lt*16);x.strokeStyle='#4f8f4f';x.lineWidth=6;x.beginPath();x.moveTo(W/2,360);x.lineTo(W/2,360-gh);x.stroke();if(gh>40){x.fillStyle='#6aa86a';x.beginPath();x.ellipse(W/2-24,360-gh*0.6,22,10,-0.5,0,TAU);x.ellipse(W/2+24,360-gh*0.8,22,10,0.5,0,TAU);x.fill();}
    x.fillStyle='#24324a';x.textAlign='center';x.font=`800 54px ${FD}`;x.globalAlpha=Math.min(1,lt/2);x.fillText('You are not alone.',W/2,120);x.font=`600 26px ${FB}`;if(lt>4){x.globalAlpha=Math.min(1,(lt-4)/2);x.fillText('Tele-MANAS · 14416 · free, 24×7, many languages',W/2,170);}x.globalAlpha=1;}
  const cap=FILM_SCENES[sc][2];if(cap&&sc<6){x.textAlign='center';x.font=`600 26px ${FB}`;const w2=x.measureText(cap).width+40;x.fillStyle='rgba(0,0,0,.6)';x.fillRect(W/2-w2/2,H-58,w2,42);x.fillStyle='#fff';x.fillText(cap,W/2,H-28);}
  const fa=Math.min(1,lt/0.6,(dur-lt)/0.6);if(fa<1){x.fillStyle=`rgba(0,0,0,${1-Math.max(0,fa)})`;x.fillRect(0,0,W,H);}x.restore();}

/* ---------- Museum ---------- */
const MUSEUM_W=newWorld({id:'museum',title:'Mental Health Museum',camDist:8,build:buildMuseum});
function panelTex(item,col,w,h){return cardTex(512,Math.round(512*h/w),(x,W,H)=>{x.fillStyle='#fffdf8';x.fillRect(0,0,W,H);x.fillStyle=col;x.fillRect(0,0,W,58);x.fillStyle='#fff';x.font=`700 28px ${FB}`;x.fillText(item.year,22,40);
  x.fillStyle='#1d2b44';x.font=`800 ${item.title.length>22?32:38}px ${FD}`;let y=108;wrapLines(x,item.title,W-44).slice(0,3).forEach(l=>{x.fillText(l,22,y);y+=40;});x.fillStyle='#4e5f7a';x.font=`500 21px ${FB}`;y+=10;wrapLines(x,item.short,W-44).slice(0,Math.floor((H-y-20)/28)).forEach(l=>{x.fillText(l,22,y);y+=28;});});}
function openReading(item,sec){const key='mus-'+sec.title+'-'+item.title;stampId('museum');openPanel({dock:true,title:item.title,eyebrow:sec.title,color:sec.color,sub:item.year,build:b=>{
  b.innerHTML=`<div class="exhibit"><p class="exhibit-year">${esc(item.year)}</p><p>${esc(item.body)}</p><p class="src">A short summary for learning.</p></div><div class="row"><button class="btn" type="button" id="exL">Listen</button><button class="btn primary" type="button" id="exC">Keep exploring</button></div>`;
  b.querySelector('#exL').addEventListener('click',()=>speak(`${item.title}. ${item.year}. ${item.body}`,true));b.querySelector('#exC').addEventListener('click',closePanel);}});award(3,'Learned something new',key);}
function exhibit(g,item,sec,x,z,ry,w,h){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.1),[M('#e9e4da'),M('#e9e4da'),M('#e9e4da'),M('#e9e4da'),new THREE.MeshBasicMaterial({map:panelTex(item,sec.color,w,h)}),M('#e9e4da')]);m.position.set(x,3.4,z);m.rotation.y=ry;g.add(m);
  const fx=x+Math.sin(ry)*1.9,fz=z+Math.cos(ry)*1.9;SPOTS.push({label:`Read: ${item.title.length>28?item.title.slice(0,26)+'…':item.title}`,sub:item.year,color:sec.color,tx:fx,tz:fz,tr:1.5,run:()=>openReading(item,sec)});}
function buildMuseum(w){const g=roomWorld(w,{w:60,d:40,h:9,floor:'#cdbfa8',wall:'#f3eee6',bg:'#efe9df',hemi:0.9,amb:0.3,dir:0.4,exitTo:{x:-132,z:-38.5,rot:0},exitSub:'Back to the Culture Quarter'});
  const H=MUSEUM.history,I=MUSEUM.india,S=MUSEUM.science,MY=MUSEUM.myths,P=MUSEUM.people;
  H.items.forEach((it,i)=>exhibit(g,it,H,-24.3+i*5.4,-19.7,0,4.4,3.2));
  I.items.forEach((it,i)=>exhibit(g,it,I,-29.7,-16.5+i*3.0,Math.PI/2,2.7,3.0));
  [...S.items.map(it=>[it,S]),...MY.items.map(it=>[it,MY])].forEach(([it,sec],i)=>exhibit(g,it,sec,29.7,-16+i*2.95,-Math.PI/2,2.7,3.0));
  const titles=[[H.title,H.color,0,7.4,-19.4,0],[I.title,I.color,-29.4,7.4,0,Math.PI/2],[`${S.title} · ${MY.title}`,S.color,29.4,7.4,0,-Math.PI/2]];
  titles.forEach(([t,c,x,y,z,ry])=>{const s=sign(t,null,c,'#ffffff',Math.min(16,t.length*0.42),1.1,g,x,y,z,ry);});
  const bronze=new THREE.MeshStandardMaterial({color:'#a8865a',metalness:0.5,roughness:0.4});
  P.items.forEach((it,i)=>{const row=i<6?0:1;const n=row?P.items.length-6:6;const k=row?i-6:i;const x=-((n-1)*7)/2+k*7,z=row?4:-7;
    box(1.1,1.2,1.1,'#e2dbcf',x,0.6,z,g);const sh=new THREE.Mesh(new THREE.SphereGeometry(0.55,14,10),bronze);sh.scale.set(1.1,0.55,0.7);sh.position.set(x,1.55,z);sh.castShadow=true;g.add(sh);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(0.34,16,12),bronze);hd.position.set(x,2.15,z);hd.castShadow=true;g.add(hd);
    const pl=sign(it.title,it.year,P.color,'#ffffff',1.9,0.6,g,x,0.75,z+0.6);addCircle(x,z,0.8);
    SPOTS.push({label:`Read: ${it.title}`,sub:it.year,color:P.color,tx:x,tz:z+1.8,tr:1.4,run:()=>openReading(it,P)});});
  sign(P.title,null,P.color,'#ffffff',9,1,g,0,4.4,-1.5);
  /* brain model */
  const bg=grp(14,13,0,g);box(1.6,1.2,1.6,'#e2dbcf',0,0.6,0,bg);const bm=new THREE.MeshStandardMaterial({color:'#e3a6ad',roughness:0.6});
  for(let i=0;i<26;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(rr(0.28,0.42),10,8),bm);s.position.set(rr(-0.75,0.75),1.9+rr(-0.25,0.35),rr(-0.5,0.5));bg.add(s);}
  [['Prefrontal cortex',0,2.6,0.9],['Amygdala',0.8,1.7,0.2],['Hippocampus',-0.8,1.6,-0.2]].forEach(([t,x,y,z])=>{const s=pillSprite(t,'#5fa58f',0.4,{fs:40});s.position.set(x,y+0.5,z);bg.add(s);});addCircle(14,13,1);
  SPOTS.push({label:'Look at the brain model',sub:'Three parts linked to stress and memory',color:'#5fa58f',tx:14,tz:15,tr:1.6,run:()=>openReading({year:'Brain',title:'Three parts to know',body:S.items.slice(0,3).map(i=>`${i.title}: ${i.body}`).join(' '),src:'Neuroscience research'},S)});
  bench(-6,13,Math.PI);bench(4,13,Math.PI);
  staticNPC(-3,16.5,Math.PI,{shirt:'#9a86c9',pack:false},null,"Welcome! Four galleries: history on the far wall, India to your left, science to your right, and the people who shaped it in the middle.");
  for(const [x,z,r] of [[-18,-17.2,Math.PI],[10,-17.2,Math.PI],[-27.4,4,-Math.PI/2],[27.4,-6,Math.PI/2],[-7,-5.2,Math.PI]])staticNPC(x,z,r,null,null,pick(["I didn't know India's first psychoanalytic society started in 1922.","The Mental Healthcare Act 2017 changed a lot.","Half of conditions start by 18. That's why youth support matters."]));
  wheelchairUser([{x:-20,z:9},{x:20,z:9}],0.9,"Every gallery here is step-free. Love that.");}

/* ---------- YMH Week 2027 hall ---------- */
const YMH_VIDEO='https://drive.google.com/file/d/1fKmvHp2Cnvq4_QZoRV7oJOQ-FVPhcFdj/view';
const HALL_W=newWorld({id:'hall',title:'YMH Week 2027',camDist:8,build:buildHall,onEnter(){loadPledges();}});
let PLEDGE_G=null;
function buildHall(w){const g=roomWorld(w,{w:30,d:26,h:9,floor:'#d9c6ae',wall:'#fbefe0',bg:'#f6efe4',hemi:0.7,amb:0.14,dir:0.5,exitTo:CQ.exit.hall,exitSub:'Back to the Creative Quarter'});
  box(16,0.8,5,'#d9734e',0,0.4,-10.4,g);
  const t=cardTex(1024,576,(x,W,H)=>{const gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,'#d97a68');gr.addColorStop(0.5,'#9a86c9');gr.addColorStop(1,'#5aa6c2');x.fillStyle=gr;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.textAlign='center';x.font=`800 64px ${FD}`;x.fillText('Youth Mental Health Week',W/2,150);x.font=`600 40px ${FB}`;x.fillText('2026 highlights',W/2,210);
    x.beginPath();x.arc(W/2,350,70,0,TAU);x.fillStyle='rgba(255,255,255,.95)';x.fill();x.fillStyle='#d97a68';x.beginPath();x.moveTo(W/2-22,315);x.lineTo(W/2-22,385);x.lineTo(W/2+38,350);x.closePath();x.fill();x.fillStyle='#fff';x.font=`500 28px ${FB}`;x.fillText('Walk up to the screen to watch',W/2,490);});
  box(12.4,7.2,0.2,'#0e0f13',0,5,-12.7,g,false);const scr=new THREE.Mesh(new THREE.PlaneGeometry(12,6.75),new THREE.MeshBasicMaterial({map:t}));scr.position.set(0,5,-12.55);g.add(scr);
  const cs=sign('Coming soon','Youth Mental Health Week 2027','#d97a68','#ffffff',8,1.6,g,0,8.0,-12.4);cs.material[4].color=new THREE.Color('#ffffff');
  const big=sign('2027',null,'#ff7a66','#ffffff',4,1.8,g,-10,1.8,-9.4,0.3);sign('YMH',null,'#2fb08c','#ffffff',3.2,1.6,g,10,1.8,-9.4,-0.3);
  ['Speak','Listen','Belong','Thrive'].forEach((wd,i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(1.4,4.2),new THREE.MeshLambertMaterial({map:bannerTex(wd,['#d97a68','#9a86c9','#5aa6c2','#5fa58f'][i]),side:THREE.DoubleSide}));p.position.set(-14.7,5,-6+i*4);p.rotation.y=Math.PI/2;g.add(p);});
  for(const sx of [-5,5]){const c=new THREE.Mesh(new THREE.ConeGeometry(2.4,8,20,1,true),new THREE.MeshBasicMaterial({color:'#fff3c9',transparent:true,opacity:0.08,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));c.position.set(sx,4.6,-9);g.add(c);}
  const N=90,cp=new Float32Array(N*3),cc=new Float32Array(N*3);const pal=['#d97a68','#9a86c9','#5aa6c2','#d9b45f','#5fa58f'].map(c=>new THREE.Color(c));for(let i=0;i<N;i++){cp[i*3]=rr(-14,14);cp[i*3+1]=rr(0,9);cp[i*3+2]=rr(-12,12);const c=pal[i%5];cc[i*3]=c.r;cc[i*3+1]=c.g;cc[i*3+2]=c.b;}
  const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.BufferAttribute(cp,3));cg.setAttribute('color',new THREE.BufferAttribute(cc,3));const conf=new THREE.Points(cg,new THREE.PointsMaterial({size:0.12,vertexColors:true}));g.add(conf);
  updaters.push((dt,t)=>{for(let i=0;i<N;i++){cp[i*3+1]-=dt*0.6;cp[i*3]+=Math.sin(t+i)*dt*0.2;if(cp[i*3+1]<0)cp[i*3+1]=9;}cg.attributes.position.needsUpdate=true;});
  box(0.2,5,11,'#c9a87c',14.6,3.2,0,g);PLEDGE_G=new THREE.Group();g.add(PLEDGE_G);sign('Pledge wall','one small thing for your mind this year','#9a86c9','#ffffff',7,1,g,14.4,6.4,0,-Math.PI/2);
  SPOTS.push({label:'Watch last year\'s highlights',sub:'YMH Week 2026 video',color:'#d97a68',tx:0,tz:-6.5,tr:2.6,run:()=>{award(5,'Watched YMH Week highlights','ymhvid');done('ymhweek');openPanel({title:'YMH Week 2026 highlights',eyebrow:'Youth Mental Health Week',color:'#d97a68',sub:'2027 is coming soon. Here\'s a look at last year.',build:b=>{
    b.innerHTML=`<p class="lead">Videos from other sites can't play inside the city, so this opens on Google Drive in a new tab. Come back any time, the city stays open.</p><div class="row"><a class="btn primary" href="${YMH_VIDEO}" target="_blank" rel="noopener">Watch on Google Drive</a></div><p class="meta" style="margin-top:10px;user-select:all">${YMH_VIDEO}</p><h3 class="h3">Youth Mental Health Week 2027</h3><p class="lead">Dates and events will be announced soon. Leave a pledge on the wall to be part of it.</p>`;}});}});
  SPOTS.push({label:'Add a pledge',sub:'Pin it to the wall',color:'#9a86c9',tx:12.2,tz:0,tr:2.6,run:pledgePanel});
  for(const [x,z,r,l] of [[-4,2,0.4,"Last year's week was so good. Can't wait for 2027."],[3,4,-2.6,"I'm volunteering this year!"],[7,-3,-1.2,"I pledged to check on one friend every week."]])staticNPC(x,z,r,null,null,l);
  wheelchairUser([{x:-10,z:6},{x:6,z:8}],0.8,"See you at YMH Week 2027!");}
async function pledgeItems(){const all=await dbAll('pledges');const items=(all||[]).slice();store.get('pledgesLocal',[]).forEach(x=>{if(!items.some(y=>y.t===x.t&&y.text===x.text))items.push(x);});return items.sort((a,b)=>b.t-a.t);}
async function loadPledges(){if(!PLEDGE_G)return;const items=await pledgeItems();PLEDGE_G.children.slice().forEach(c=>PLEDGE_G.remove(c));
  const show=items.length?items.slice(0,24):[{text:'Sleep before midnight on weeknights.'},{text:'Check on one friend every week.'},{text:'Talk to the campus counsellor when it gets too much.'}];
  const cols=['#fff2a8','#ffd1dc','#c8ecff','#d9f7c8','#e6dcff'];
  show.forEach((it,i)=>{const t=cardTex(256,180,(x,W,H)=>{x.fillStyle=cols[i%5];x.fillRect(0,0,W,H);x.fillStyle='#1d2b44';x.font=`600 20px ${FB}`;wrapLines(x,it.text,W-24).slice(0,5).forEach((l,k)=>x.fillText(l,12,30+k*26));});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.0),new THREE.MeshLambertMaterial({map:t}));const r=Math.floor(i/6),c=i%6;m.position.set(14.45,4.8-r*1.15,-4.2+c*1.65);m.rotation.y=-Math.PI/2;m.rotation.z=rr(-0.06,0.06);PLEDGE_G.add(m);});}
function pledgePanel(){openPanel({title:'Pledge wall',eyebrow:'YMH Week 2027',color:'#9a86c9',sub:'One small thing you\'ll do for your mind this year.',build:b=>{
  b.innerHTML=`<div class="sugg" id="pgS"></div><label class="lbl" for="pgT">My pledge</label><textarea id="pgT" rows="2" maxlength="120" placeholder="I'll take a proper break during exam week."></textarea><p class="err" id="pgE" hidden>Write a few words first.</p><div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="pgGo">Pin it to the wall</button></div><h3 class="h3">Recent pledges</h3><ul class="notes" id="pgL"><li class="empty" style="display:block">Loading…</li></ul>`;
  chips(b.querySelector('#pgS'),['Sleep before midnight on weeknights','Check on one friend every week','Talk to a counsellor when it gets heavy','Take one screen-free hour a day'],b.querySelector('#pgT'));
  const list=b.querySelector('#pgL');const render=async()=>{const it=await pledgeItems();list.innerHTML=it.length?it.slice(0,20).map(x=>`<li><i style="background:#9a86c9"></i><span>${esc(x.text)}</span></li>`).join(''):'<li class="empty" style="display:block">No pledges yet. Be the first.</li>';};render();
  b.querySelector('#pgGo').addEventListener('click',async()=>{const v=b.querySelector('#pgT').value.trim();if(!v){b.querySelector('#pgE').hidden=false;return;}const item={text:v,t:Date.now()};let shared=true;try{await dbAppend('pledges',item,5);}catch(e){shared=false;localAppend('pledgesLocal',item);}
    b.querySelector('#pgT').value='';award(10,'Made a pledge','pledge');done('ymhweek');toast(shared?'Pledge pinned for everyone to see.':'Pledge pinned. It\'s saved on this device.');render();loadPledges();});}});}
