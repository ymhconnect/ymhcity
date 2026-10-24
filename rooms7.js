'use strict';
/* =========================================================
   ROOMS (v7): bright, cosy interiors you walk into.
   Mood Café · Kindness Post · Support Booth · Study Hall & Library
   and a redesigned Museum.
   ========================================================= */

/* ---------- textures ---------- */
function plankTex(base,line){return cardTex(512,512,(x,W,H)=>{x.fillStyle=base;x.fillRect(0,0,W,H);const rows=8;for(let r=0;r<rows;r++){const y=r*H/rows;x.fillStyle=`rgba(255,255,255,${0.02+((r*37)%5)*0.012})`;x.fillRect(0,y,W,H/rows);x.fillStyle=line;x.fillRect(0,y,W,2);x.fillRect(((r*173)%W),y,2,H/rows);x.fillRect(((r*173+256)%W),y,2,H/rows);}
  for(let i=0;i<200;i++){x.fillStyle=`rgba(90,50,20,${Math.random()*0.05})`;x.fillRect(Math.random()*W,Math.random()*H,Math.random()*40+10,1);}});}
function checkTex(a,b,n){return cardTex(512,512,(x,W,H)=>{const k=W/(n||8);for(let i=0;i<(n||8);i++)for(let j=0;j<(n||8);j++){x.fillStyle=(i+j)%2?a:b;x.fillRect(i*k,j*k,k,k);}x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=2;for(let i=0;i<=(n||8);i++){x.beginPath();x.moveTo(i*k,0);x.lineTo(i*k,H);x.stroke();x.beginPath();x.moveTo(0,i*k);x.lineTo(W,i*k);x.stroke();}});}
function rugTex(c1,c2,c3){return cardTex(512,512,(x,W,H)=>{x.fillStyle=c1;x.fillRect(0,0,W,H);x.strokeStyle=c2;x.lineWidth=18;x.strokeRect(30,30,W-60,H-60);x.lineWidth=6;x.strokeStyle=c3;x.strokeRect(62,62,W-124,H-124);
  x.fillStyle=c3;for(let i=0;i<6;i++)for(let j=0;j<6;j++){if((i+j)%2)continue;x.beginPath();x.moveTo(110+i*58,110+j*58-14);x.lineTo(110+i*58+14,110+j*58);x.lineTo(110+i*58,110+j*58+14);x.lineTo(110+i*58-14,110+j*58);x.closePath();x.fill();}});}
function viewTex(){return cardTex(256,256,(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#7cc4f2');g.addColorStop(0.62,'#d8f0ff');g.addColorStop(0.63,'#8fd16f');g.addColorStop(1,'#6fbf5c');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(255,255,255,.9)';[[56,52,22],[80,46,18],[184,72,20],[204,66,15]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,TAU);x.fill();});
  const tc=['#4fae5a','#6cc96b','#ffb7d0','#58b86a'];for(let i=0;i<8;i++){x.fillStyle='#8a5a3b';x.fillRect(18+i*32,168,5,22);x.fillStyle=tc[i%4];x.beginPath();x.arc(20+i*32,160,18,0,TAU);x.fill();}});}
let VIEW_TEX=null;
function outsideTex(){return cardTex(256,256,(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#bfe6ff');g.addColorStop(0.55,'#f6fbff');g.addColorStop(0.56,'#a9dc8c');g.addColorStop(1,'#93d371');x.fillStyle=g;x.fillRect(0,0,W,H);x.fillStyle='#f3e1bf';x.beginPath();x.moveTo(90,H);x.lineTo(118,145);x.lineTo(138,145);x.lineTo(166,H);x.closePath();x.fill();});}

/* ---------- the room builder ---------- */
function room7(w,o){const g=new THREE.Group();scene.add(g);scene.background=new THREE.Color(o.bg||'#f6efe4');
  const hl=new THREE.HemisphereLight('#fff6ea',o.groundLight||'#b8a48a',o.hemi??0.72);scene.add(hl);w.hemi=hl;w.hemiBase=hl.intensity;
  scene.add(new THREE.AmbientLight('#ffffff',o.amb??0.16));
  const hw=o.w/2,hd=o.d/2,H=o.h||6;
  const dl=new THREE.DirectionalLight('#fff1dc',o.dir??0.62);dl.position.set(hw*0.6,H*2.6,hd*0.8);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);const sc=dl.shadow.camera;sc.left=-hw-2;sc.right=hw+2;sc.top=hd+2;sc.bottom=-hd-2;sc.near=1;sc.far=80;dl.shadow.bias=-0.0008;scene.add(dl);scene.add(dl.target);
  const ft=o.floorTex||plankTex(o.floor||'#d9a46c','rgba(120,70,30,.28)');ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(o.w/(o.tile||5),o.d/(o.tile||5));
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(o.w,o.d),new THREE.MeshLambertMaterial({map:ft}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;g.add(fl);
  const ceil=new THREE.Mesh(new THREE.PlaneGeometry(o.w,o.d),new THREE.MeshLambertMaterial({color:o.ceiling||'#fffaf3'}));ceil.rotation.x=Math.PI/2;ceil.position.y=H;g.add(ceil);
  const wallM=new THREE.MeshLambertMaterial({color:o.wall||'#fff1e0'}),wainM=new THREE.MeshLambertMaterial({color:o.wain||'#ffffff'}),trimM=new THREE.MeshLambertMaterial({color:o.trim||'#ffffff'});
  const WALL=(x,z,len,rot,inward)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(len,H,0.3),wallM);m.position.set(x,H/2,z);m.rotation.y=rot;m.receiveShadow=true;g.add(m);
    const off=(v)=>{const d=new THREE.Vector3(inward[0],0,inward[1]).multiplyScalar(v);return d;};
    const wn=new THREE.Mesh(new THREE.BoxGeometry(len,1.15,0.08),wainM);wn.position.set(x,0.58,z).add(off(0.19));wn.rotation.y=rot;g.add(wn);
    const rail=new THREE.Mesh(new THREE.BoxGeometry(len,0.1,0.14),trimM);rail.position.set(x,1.18,z).add(off(0.22));rail.rotation.y=rot;g.add(rail);
    const sk=new THREE.Mesh(new THREE.BoxGeometry(len,0.16,0.12),trimM);sk.position.set(x,0.08,z).add(off(0.24));sk.rotation.y=rot;g.add(sk);
    const co=new THREE.Mesh(new THREE.BoxGeometry(len,0.18,0.2),trimM);co.position.set(x,H-0.09,z).add(off(0.2));co.rotation.y=rot;g.add(co);};
  WALL(0,-hd,o.w,0,[0,1]);WALL(-hw,0,o.d,Math.PI/2,[1,0]);WALL(hw,0,o.d,Math.PI/2,[-1,0]);
  const gap=3.2,side=hw-gap/2;
  {const m=new THREE.Mesh(new THREE.BoxGeometry(side,H,0.3),wallM);m.position.set(-(hw+gap/2)/2,H/2,hd);g.add(m);const m2=m.clone();m2.position.x=(hw+gap/2)/2;g.add(m2);
   for(const sx of [-1,1]){const wn=new THREE.Mesh(new THREE.BoxGeometry(side,1.15,0.08),wainM);wn.position.set(sx*(hw+gap/2)/2,0.58,hd-0.19);g.add(wn);const r=new THREE.Mesh(new THREE.BoxGeometry(side,0.1,0.14),trimM);r.position.set(sx*(hw+gap/2)/2,1.18,hd-0.22);g.add(r);}
   const top=new THREE.Mesh(new THREE.BoxGeometry(gap,H-3.4,0.3),wallM);top.position.set(0,3.4+(H-3.4)/2,hd);g.add(top);}
  for(const sx of [-1,1])box(0.28,3.5,0.5,o.doorTrim||'#ffffff',sx*gap/2,1.75,hd,g,false);box(gap+0.56,0.3,0.5,o.doorTrim||'#ffffff',0,3.5,hd,g,false);
  const out=new THREE.Mesh(new THREE.PlaneGeometry(gap+1,4),new THREE.MeshBasicMaterial({map:outsideTex()}));out.position.set(0,1.9,hd+0.9);out.rotation.y=Math.PI;g.add(out);
  const ex=pillSprite('Way out','#2fb08c',0.5,{fs:44});ex.position.set(0,4.1,hd-0.45);g.add(ex);
  if(!VIEW_TEX)VIEW_TEX=viewTex();
  (o.windows||[]).forEach(q=>windowPane(g,q));
  (o.pendants||[]).forEach(q=>pendant(g,q[0],H,q[1],q[2]||'#ffffff',q[3]));
  addBox(0,-hd,hw,0.3,0);addBox(-hw,0,0.3,hd,0);addBox(hw,0,0.3,hd,0);addBox(-(hw+gap/2)/2,hd,side/2,0.3,0);addBox((hw+gap/2)/2,hd,side/2,0.3,0);
  w.camBounds={x0:-hw+0.5,x1:hw-0.5,z0:-hd+0.5,z1:hd-0.5,y1:H-0.35};w.bounds=(p)=>{p.x=clamp(p.x,-hw+0.75,hw-0.75);p.z=clamp(p.z,-hd+0.75,hd-0.9);};
  w.exitTo=o.exitTo;w.camDist=o.camDist||6.8;w.camPitch=0.3;w.H=H;
  SPOTS.push({label:'Head back outside',sub:o.exitSub||'Back to the city',color:'#2fb08c',tx:0,tz:hd-1.1,tr:1.5,run:()=>leaveRoom()});
  return g;}
function leaveRoom(){if(W.exitTo){const e=W.exitTo;enterWorld(MAIN,e,e.rot);}else if(W.leave)W.leave();}
function windowPane(g,q){/* q: {x,z,ry,w,h,y} on a wall, facing into the room */
  const wg=grp(q.x,q.z,q.ry||0,g);wg.position.y=q.y||2.9;const ww=q.w||3,wh=q.h||2.4;
  const gl=new THREE.Mesh(new THREE.PlaneGeometry(ww,wh),new THREE.MeshBasicMaterial({map:VIEW_TEX}));gl.position.z=0.17;wg.add(gl);
  const fc=q.frame||'#ffffff';box(ww+0.3,0.18,0.24,fc,0,wh/2+0.05,0.2,wg,false);box(ww+0.5,0.16,0.42,fc,0,-wh/2-0.05,0.28,wg,false);for(const sx of [-1,1])box(0.16,wh+0.2,0.24,fc,sx*(ww/2+0.05),0,0.2,wg,false);
  box(0.08,wh,0.1,fc,0,0,0.22,wg,false);box(ww,0.08,0.1,fc,0,wh*0.1,0.22,wg,false);
  if(q.curtain){for(const sx of [-1,1]){const c=box(0.6,wh+0.7,0.08,q.curtain,sx*(ww/2+0.35),0.15,0.36,wg,false);}}
  return wg;}
function pendant(g,x,H,z,shade,light){const drop=1.4;cyl(0.02,0.02,drop,'#3a3f4a',x,H-drop/2,z,g,4,false);const s=new THREE.Mesh(new THREE.ConeGeometry(0.42,0.42,16,1,true),new THREE.MeshLambertMaterial({color:shade,side:THREE.DoubleSide}));s.position.set(x,H-drop-0.1,z);g.add(s);
  const b=new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),BULB_MAT);b.position.set(x,H-drop-0.3,z);g.add(b);
  if(light){const pl=new THREE.PointLight('#ffe2b8',light,10,2);pl.position.set(x,H-drop-0.6,z);g.add(pl);}}
function plant(g,x,z,s,potC){s=s||1;cyl(0.38*s,0.3*s,0.62*s,potC||'#e88a62',x,0.31*s,z,g,12);const lc=['#4fae5a','#6cc96b','#3f9a5b'];
  for(let i=0;i<6;i++){const a=i/6*TAU;const l=sph(0.42*s,lc[i%3],x+Math.cos(a)*0.28*s,0.95*s+(i%2)*0.3*s,z+Math.sin(a)*0.28*s,g,7);l.scale.set(1,1.3,1);}sph(0.4*s,lc[1],x,1.45*s,z,g,7);addCircle(g.position.x+x,g.position.z+z,0.4*s);}
function rug(g,x,z,w,d,c1,c2,c3,ry){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshLambertMaterial({map:rugTex(c1,c2,c3||c2),polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));m.rotation.x=-Math.PI/2;m.rotation.z=ry||0;m.position.set(x,0.02,z);m.receiveShadow=true;g.add(m);return m;}
const BOOKC=['#ff6f61','#ffd166','#4fc3a1','#7aa7ff','#b28dff','#ff9fc6','#f4a259','#2fa39a','#e2504f','#3d6fd6','#9cd67a','#ffffff'];
function bookshelf(g,x,z,ry,w,h,o){o=o||{};const s=grp(x,z,ry||0,g);const wood=o.wood||'#a8744a';const d=0.55;
  const dbl=!!o.double;const D=dbl?d*1.6:d;box(w,h,0.08,wood,0,h/2,dbl?0:-d/2,s);for(const sx of [-1,1])box(0.1,h,D,wood,sx*w/2,h/2,0,s);const rows=Math.max(2,Math.round(h/0.62));
  for(let r=0;r<=rows;r++)box(w,0.07,D,wood,0,0.04+r*(h-0.08)/rows,0,s,false);
  for(const side of (dbl?[1,-1]:[1]))for(let r=0;r<rows;r++){let cx=-w/2+0.12;const y0=0.08+r*(h-0.08)/rows;while(cx<w/2-0.2){const bw=rr(0.08,0.16),bh=rr(0.3,0.48);if(rnd()<0.08){cx+=0.25;continue;}const b=box(bw,bh,dbl?D*0.42:d*0.75,pick(BOOKC),cx+bw/2,y0+bh/2,dbl?side*D*0.24:0.02,s,false);if(rnd()<0.12)b.rotation.z=0.18;cx+=bw+0.015;}}
  return s;}
function armchair(g,x,z,ry,c){const a=grp(x,z,ry||0,g);box(1.2,0.45,1.1,c,0,0.42,0,a);box(1.2,0.85,0.25,c,0,0.95,-0.45,a);for(const sx of [-0.55,0.55])box(0.18,0.6,1.1,c,sx,0.62,0,a);box(1.0,0.14,0.8,'#ffffff',0,0.7,0.06,a).material=M(lighten(c));
  for(const sx of [-0.5,0.5])for(const sz of [-0.42,0.42])cyl(0.04,0.03,0.2,'#5a4632',sx,0.1,sz,a,5,false);gBox(a,0,0,0.65,0.6);return a;}
function sofa(g,x,z,ry,c,w){w=w||2.6;const a=grp(x,z,ry||0,g);box(w,0.45,1.1,c,0,0.42,0,a);box(w,0.9,0.3,c,0,0.98,-0.42,a);for(const sx of [-1,1])box(0.24,0.65,1.1,c,sx*(w/2-0.12),0.64,0,a);
  const cc=['#ffd166','#ff8f6b','#ffffff'];for(let i=0;i<3;i++){const cu=box(0.55,0.5,0.16,cc[i%3],-w/2+0.6+i*(w-1.2)/2,0.95,-0.22,a);cu.rotation.x=-0.25;}gBox(a,0,0,w/2,0.6);return a;}
function lighten(c){const k=new THREE.Color(c);k.lerp(new THREE.Color('#ffffff'),0.35);return '#'+k.getHexString();}
function roundTable(g,x,z,top){const t=grp(x,z,0,g);cyl(0.78,0.78,0.07,top||'#ffffff',0,0.95,0,t,20);cyl(0.06,0.06,0.92,'#5a6170',0,0.47,0,t,6);cyl(0.38,0.42,0.05,'#5a6170',0,0.03,0,t,12);gCircle(t,0,0,0.85);return t;}
function chair(g,x,z,ry,c){const a=grp(x,z,ry||0,g);box(0.55,0.07,0.55,c,0,0.55,0,a);box(0.55,0.6,0.07,c,0,0.88,-0.25,a);for(const sx of [-0.23,0.23])for(const sz of [-0.23,0.23])cyl(0.03,0.03,0.55,'#5a6170',sx,0.27,sz,a,5,false);return a;}
function frameArt(g,x,y,z,ry,w,h,seed,fc){const f=grp(x,z,ry||0,g);f.position.y=y;box(w+0.18,h+0.18,0.08,fc||'#3a2f28',0,0,0,f,false);const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:abstractTex(seed||1)}));p.position.z=0.05;f.add(p);return f;}
function stringLights(g,x1,y,z1,x2,z2,sag){const n=Math.max(6,Math.round(Math.hypot(x2-x1,z2-z1)/0.6));const pts=[];for(let i=0;i<=n;i++){const t=i/n;pts.push(new THREE.Vector3(x1+(x2-x1)*t,y-Math.sin(t*Math.PI)*sag,z1+(z2-z1)*t));}
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#6b6f7a'})));for(let i=1;i<n;i++){const m=new THREE.Mesh(BULB_GEO,BULB_MAT);m.position.copy(pts[i]);m.position.y-=0.1;g.add(m);}}
function floorLamp(g,x,z,c){cyl(0.22,0.26,0.06,'#3a3f4a',x,0.03,z,g,10);cyl(0.03,0.03,1.7,'#3a3f4a',x,0.88,z,g,5,false);const s=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.4,0.42,16,1,true),new THREE.MeshLambertMaterial({color:c||'#fff3d6',side:THREE.DoubleSide,emissive:'#ffdca0',emissiveIntensity:0.35}));s.position.set(x,1.85,z);g.add(s);addCircle(x,z,0.3);}
function boardTex(draw,w,h){return cardTex(w||1024,h||640,draw);}
function sitAt(x,z,rot,y,exit,o){o=o||{};startAction(Object.assign({x,z,rot,y:y===undefined?-0.16:y,pose:o.pose||POSE.sit,camOff:o.camOff===undefined?0.85:o.camOff,dist:o.dist||5.6,pitch:o.pitch||0.3,exit},o));}

/* =========================================================
   MOOD CAFÉ
   ========================================================= */
const CAFE_W=newWorld({id:'cafe',title:'Mood Café',camDist:6.8,build:buildCafeRoom,welcome:'Welcome in. Riya at the counter will ask how you\'re feeling.',onEnter(){stamp(Z.mood);track('room',{id:'mood'});}});
const DRINK_LINES={Happy:'"Ooh, a good day! Sunshine Lemonade, extra fizz."',Calm:'"Calm is a nice place to be. Mint Cloud Tea, nice and light."',Tired:'"Long day? Slow Oat Cocoa. Drink it slowly."',Anxious:'"Okay. Chamomile, warm, not too hot. Take your time with it."',Sad:'"I\'m glad you came in. Warm Honey Hug, on the house."',Angry:'"Fair enough. Iced Cool-Down, lots of ice."',Overwhelmed:'"One thing at a time. Just this cup for now."',Lonely:'"Friendship Chai. It comes with two cups, so you can share it later."'};
function buildCafeRoom(w){const g=room7(w,{w:20,d:16,h:6,floor:'#c98f58',wall:'#ffe0c4',wain:'#e9784b',trim:'#ffffff',ceiling:'#fffaf3',exitTo:exitFront(Z.mood),exitSub:'Back to the City Centre',
    windows:[{x:-9.85,z:-2.4,ry:Math.PI/2,w:3,h:2.4,y:2.6,frame:'#ffffff'},{x:-9.85,z:3.4,ry:Math.PI/2,w:3,h:2.4,y:2.6,frame:'#ffffff'},{x:9.85,z:2.5,ry:-Math.PI/2,w:3.4,h:2.4,y:2.6}],
    pendants:[[-5.5,-0.5,'#2fa39a',0.35],[4.5,-0.5,'#ff8f6b',0.35],[5.5,4,'#ffd166'],[-1,-5.5,'#ffffff',0.3]]});
  rug(g,0,1.5,7,5,'#fff1dd','#f08a5d','#2fa39a');
  /* counter */
  box(10,1.1,1.15,'#f08a5d',-1,0.55,-5.4,g);box(10.3,0.1,1.35,'#fff6ea',-1,1.15,-5.4,g);for(let i=0;i<11;i++)box(0.06,0.9,0.04,'#ffffff',-5.8+i*0.96,0.55,-4.82,g,false);addBox(-1,-5.4,5.2,0.7,0);
  box(1.2,0.8,0.7,'#c9ced6',-4.2,1.6,-5.6,g);box(1.25,0.12,0.75,'#3a3f4a',-4.2,2.05,-5.6,g);for(const sx of [-0.3,0.3])cyl(0.05,0.05,0.25,'#3a3f4a',-4.2+sx,1.25,-5.25,g,6,false);
  const cups=['#ffffff','#ffd166','#7ad1a8','#ff9fc6'];cups.forEach((c,i)=>cyl(0.11,0.09,0.2,c,-2.9+i*0.32,1.3,-5.3,g,10,false));
  {const k=cyl(0.25,0.32,0.38,'#c97a3f',0.2,1.39,-5.5,g,12);k.material=new THREE.MeshStandardMaterial({color:'#c97a3f',metalness:0.5,roughness:0.35});cone(0.12,0.3,'#c97a3f',0.48,1.5,-5.5,g,6).rotation.z=-1.2;}
  /* cake display */
  const gl=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.8,0.9),new THREE.MeshPhongMaterial({color:'#e8f6ff',transparent:true,opacity:0.32,shininess:90}));gl.position.set(2.4,1.6,-5.4);g.add(gl);
  ['#ff9fc6','#ffd166','#8a5a3b','#7ad1a8'].forEach((c,i)=>{cyl(0.22,0.22,0.22,c,1.65+i*0.5,1.32,-5.4,g,14,false);cyl(0.23,0.23,0.04,'#ffffff',1.65+i*0.5,1.45,-5.4,g,14,false);});
  /* shelves + jars + menu */
  for(const y of [2.4,3.1])box(9,0.08,0.45,'#a8744a',-1,y,-7.6,g,false);
  for(let i=0;i<16;i++){const x=-5.2+i*0.56;cyl(0.14,0.14,0.36,pick(['#ffd166','#ff8f6b','#7ad1a8','#b28dff','#fff1dd']),x,(i%2?3.32:2.62),-7.55,g,8,false);}
  const mt=boardTex((x,W,H)=>{x.fillStyle='#2f4a3f';x.fillRect(0,0,W,H);x.strokeStyle='#e9d7b8';x.lineWidth=10;x.strokeRect(14,14,W-28,H-28);x.fillStyle='#fff6e6';x.textAlign='center';x.font=`800 64px ${FD}`;x.fillText('How are you feeling?',W/2,100);
    x.font=`500 30px ${FB}`;x.textAlign='left';MOODS.forEach((m,i)=>{const col=i%2,row=Math.floor(i/2);const X=60+col*490,Y=180+row*104;x.fillStyle=m.c;x.beginPath();x.arc(X+12,Y-10,12,0,TAU);x.fill();x.fillStyle='#fff6e6';x.font=`700 30px ${FB}`;x.fillText(m.k,X+36,Y);x.font=`400 24px ${FB}`;x.fillStyle='#d9e8df';x.fillText(m.drink.replace(' (comes with two cups)',''),X+36,Y+34);});});
  const menu=new THREE.Mesh(new THREE.PlaneGeometry(6.4,4),new THREE.MeshBasicMaterial({map:mt}));menu.position.set(-1,4.3,-7.8);g.add(menu);
  sign('Mood Café','every feeling is welcome here','#f08a5d','#ffffff',4.4,1,g,6.6,4.6,-7.75);
  /* tables */
  const TB=[[-5.5,-0.5,'#2fa39a'],[4.5,-0.5,'#ff8f6b'],[5.5,4,'#ffd166']];
  TB.forEach(([x,z,c],i)=>{roundTable(g,x,z,'#ffffff');chair(g,x-1.2,z,Math.PI/2,c);chair(g,x+1.2,z,-Math.PI/2,c);cyl(0.1,0.08,0.18,'#ffffff',x+0.3,1.07,z+0.1,g,10,false);sph(0.12,'#ff6f61',x,1.08,z-0.2,g,8,false);});
  {const p=staticNPC(4.5-1.2,-0.5,Math.PI/2,{pack:false},(dt,t)=>{p.userData.arms[1].rotation.x=-0.9+Math.max(0,Math.sin(t*0.5))*-0.5;p.userData.head.rotation.x=Math.sin(t*0.5)*0.08;},"I come here after labs. Same table every time.",-0.16);sitPose(p);}
  {const p=staticNPC(5.5+1.2,4,-Math.PI/2,{pack:false,style:1},(dt,t)=>{p.userData.head.rotation.y=Math.sin(t*0.3)*0.3;},"Trying the Mint Cloud Tea. It's very… minty.",-0.16);sitPose(p);}
  /* window bench */
  box(1.0,0.5,9,'#2fa39a',-9.2,0.25,0.5,g);for(let i=0;i<4;i++){const c=box(0.9,0.14,2.1,['#ffd166','#ff9fc6','#ffffff','#7ad1a8'][i],-9.15,0.57,-3+i*2.3,g,false);}for(let i=0;i<3;i++){const cu=box(0.18,0.55,0.6,['#ff8f6b','#ffffff','#ffd166'][i],-9.6,0.95,-2.4+i*2.9,g,false);cu.rotation.z=0.25;}
  addBox(-9.2,0.5,0.5,4.5,0);box(1.1,0.06,2,'#fff6ea',-7.8,0.8,0.5,g);cyl(0.06,0.06,0.78,'#5a6170',-7.8,0.4,0.5,g,6,false);
  {const p=staticNPC(-8.9,3.6,Math.PI/2,{pack:false},(dt,t)=>{const u=p.userData;u.arms.forEach(a=>a.rotation.x=-1.1);u.head.rotation.x=0.35;},"Window seat with a book. Perfect afternoon.",-0.05);sitPose(p);}
  plant(g,8.8,-6.8,1.2);plant(g,-8.8,-6.8,1);plant(g,8.8,6.8,0.9,'#2fa39a');
  frameArt(g,9.8,3,-3,-Math.PI/2,2,1.5,2);frameArt(g,9.8,3.2,6.2,-Math.PI/2,1.4,1.4,3);
  stringLights(g,-9.6,5.6,-7.6,9.6,-7.6,0.5);
  const bar=staticNPC(-1,-6.6,0,{shirt:'#ffffff',pants:'#3a4250',pack:false,style:4},(dt,t)=>{idleAnim(bar,t);bar.userData.arms[1].rotation.x=-0.6+Math.sin(t*1.3)*0.15;},"Hi, I'm Riya. Tell me how you're feeling and I'll make something to match.");
  /* spots */
  SPOTS.push({label:'Order at the counter',sub:'Tell Riya how you\'re feeling',color:Z.mood.color,tx:-1,tz:-4,tr:2.2,run:cafeOrder});
  SPOTS.push({label:'Sit on the window bench',sub:'Cushions and sunshine',color:'#2fa39a',tx:-8,tz:-1.8,tr:1.5,run:()=>{openPanel({dock:true,title:'By the window',eyebrow:'Mood Café',color:'#2fa39a',sub:'Nothing to do. Just look outside.',build:sitCard});sitAt(-8.95,-1.6,Math.PI/2,-0.05,{x:-7.2,z:-1.6},{camOff:0.9,dist:5});}});}
function cafeOrder(){openPanel({title:'How are you feeling?',eyebrow:'Mood Café',color:Z.mood.color,sub:'Pick the one that\'s closest. There\'s no wrong answer.',build:b=>{
  b.innerHTML=`<div class="moods" id="mGrid"></div><div id="mOut"></div><h3 class="h3">Your recent check-ins</h3><div class="history" id="mHist"></div>`;
  const grid=b.querySelector('#mGrid');MOODS.forEach(m=>{const x=document.createElement('button');x.type='button';x.setAttribute('aria-pressed','false');x.innerHTML=`<span aria-hidden="true">${m.e}</span>${m.k}`;
    x.addEventListener('click',()=>{grid.querySelectorAll('button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));
      b.querySelector('#mOut').innerHTML=`<div class="order"><div class="eyebrow">Riya says</div><p style="margin:6px 0 10px;font-style:italic">${esc(DRINK_LINES[m.k]||'')}</p><h4>${esc(m.drink)}</h4><p>${esc(m.tip)}</p><div class="row" style="margin-top:12px"><button class="btn primary" type="button" id="mSit">Take it to a table</button></div></div>`;
      b.querySelector('#mSit').addEventListener('click',()=>{closePanel();giveDrink(m.drink.replace(' (comes with two cups)',''),m.c,5,false);openPanel({dock:true,title:m.drink.replace(' (comes with two cups)',''),eyebrow:'Mood Café',color:Z.mood.color,sub:'Sip slowly. No rush at all.',build:bb=>drinkCard(bb,m.tip)});sitAt(-5.5-1.2,-0.5,Math.PI/2,-0.16,{x:-5.5-1.2,z:1.2},{camOff:0.7,dist:5.2});});
      award(5,'Mood check-in');done('mood');const h=store.get('moods',[]);h.push({k:m.k,c:m.c,t:Date.now()});store.set('moods',h.slice(-10));hist();});grid.appendChild(x);});
  function hist(){const h=store.get('moods',[]);const el=b.querySelector('#mHist');if(!h.length){el.innerHTML='<div class="empty" style="flex-direction:row">Your check-ins show up here, so you can notice patterns over time.</div>';return;}
    el.innerHTML=h.slice(-8).map(x=>{const d=new Date(x.t);return `<div title="${x.k}"><i style="background:${x.c}"></i>${d.toLocaleDateString(undefined,{weekday:'short'})}</div>`;}).join('');}
  hist();}});}

/* =========================================================
   KINDNESS POST
   ========================================================= */
const POST_W=newWorld({id:'post',title:'Kindness Post',camDist:6.8,build:buildPostRoom,welcome:'Letters from strangers on the back wall. A desk to write your own.',onEnter(){stamp(Z.kind);track('room',{id:'kind'});}});
const LETTERS=[
 ['Hi stranger,','I don\'t know what kind of week you\'re having. If it\'s a good one, I hope it keeps going. If it\'s a hard one, I hope something small and nice happens before it ends. A good meal. A text from someone. A song you forgot you loved.','Meera, 2nd year'],
 ['Dear you,','When I moved to a new city for college I cried in the hostel bathroom for a week. Now that city feels like home. Things that feel strange right now can become yours. Give it time.','Farhan'],
 ['Hello!','Quick reminder from someone who forgets this a lot: you\'re allowed to rest before you\'ve finished everything. The list will still be there. You\'ll be better at it after a break.','Lakshmi'],
 ['To whoever opens this,','I failed my first semester exam in maths and thought it was the end of the world. It wasn\'t. I passed the next one. One result is one moment, not your whole story.','Kabir, final year'],
 ['Hey,','You don\'t have to be the funny one, or the strong one, or the one with the answers, all the time. You can just be a person today.','Ayesha'],
 ['Hi there,','My grandmother used to say: eat on time, sleep on time, and call home on Sundays. I laughed at it then. Now I think it\'s the best advice I\'ve ever had.','Tenzin'],
 ['Dear stranger,','If someone was kind to you this week, tell them. If nobody was, I\'m sorry. Here\'s mine: I hope you know you matter, even on the days you don\'t feel it.','Riya, from the café'],
 ['Hi!','Small thing that helps me: when my head is too loud, I name five things I can see. The ceiling fan. My blue bottle. A crack in the wall. It brings me back to the room.','Joseph'],
 ['To you,','Comparing your behind-the-scenes with everyone else\'s highlight reel is unfair to you. Everyone has messy drafts. You just don\'t get to see theirs.','Diya'],
 ['Hello friend,','Asking for help felt so awkward the first time. The person I asked just said "of course". Most people are kinder than our worries say they\'ll be.','Arjun']];
const CHALLENGES=["Text a friend one thing you like about them. No reason needed.","Thank someone whose work usually goes unnoticed: the guard, the mess staff, the cleaner.","Ask someone how they're really doing, and then just listen.","Save a seat for someone who usually sits alone.","Send a voice note to a grandparent or an older relative.","Share your notes with someone who missed class.","Leave a kind comment on a friend's work or post.","Write down three things you like about yourself. Keep the note."];
function buildPostRoom(w){const g=room7(w,{w:18,d:14,h:6,floorTex:checkTex('#f2dcc4','#e2bf9c',6),tile:4,wall:'#dcf3e8',wain:'#2f8f83',trim:'#ffffff',ceiling:'#fbfffd',exitTo:exitFront(Z.kind),exitSub:'Back to the City Centre',
    windows:[{x:-8.85,z:3,ry:Math.PI/2,w:2.6,h:2.2,y:2.7}],pendants:[[-4.5,0,'#e2504f',0.35],[3,0.5,'#2f8f83',0.35]]});
  rug(g,0,1.5,6,4,'#fff6ea','#e2504f','#2f8f83');
  /* the letter wall */
  const LW=10,LH=4,cols=10,rows=5;box(LW+0.3,LH+0.3,0.5,'#a8744a',0,0.8+LH/2,-6.6,g);
  for(let i=0;i<=cols;i++)box(0.06,LH,0.5,'#c99466',-LW/2+i*LW/cols,0.8+LH/2,-6.42,g,false);for(let j=0;j<=rows;j++)box(LW,0.06,0.5,'#c99466',0,0.8+j*LH/rows,-6.42,g,false);
  const envs=[];for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){if(rnd()<0.35)continue;const e=box(0.62,0.42,0.04,pick(['#ffffff','#fff6d6','#ffe3ec','#e3f4ff','#e6f7df']),-LW/2+(i+0.5)*LW/cols,0.8+(j+0.5)*LH/rows,-6.22,g,false);e.rotation.x=-0.25;e.rotation.z=rr(-0.08,0.08);sph(0.05,pick(['#e2504f','#2f8f83','#ffd166']),e.position.x,e.position.y-0.05,-6.15,g,6,false);envs.push(e);}
  addBox(0,-6.6,LW/2+0.2,0.35,0);
  sign('Letters from strangers','take one, it\'s for you','#e2504f','#ffffff',5,0.9,g,0,5.3,-6.4);
  /* post box */
  const pb=grp(6.4,-4.4,-0.5,g);cyl(0.62,0.66,1.7,'#e2504f',0,0.85,0,pb,18);const dome=new THREE.Mesh(new THREE.SphereGeometry(0.66,18,10,0,TAU,0,Math.PI/2),M('#e2504f'));dome.position.y=1.7;pb.add(dome);
  box(0.6,0.07,0.08,'#2b2b2b',0,1.45,0.62,pb,false);cyl(0.68,0.68,0.12,'#c43b3b',0,0.06,0,pb,18);sph(0.12,'#ffd166',0,2.4,0,pb,8);gCircle(pb,0,0,0.75);
  w.slot=new THREE.Vector3(L2W(pb,0,0.7).x,1.45,L2W(pb,0,0.7).z);
  /* writing desks along the left wall */
  for(const z of [-3.2,0.4]){const d=grp(-7.6,z,Math.PI/2,g);box(2.2,0.08,1,'#c98b55',0,0.95,0,d);for(const sx of [-1,1])box(0.08,0.95,0.9,'#a46d3f',sx,0.47,0,d,false);box(0.5,0.02,0.36,'#ffffff',0.2,1,0.05,d,false);
    cyl(0.03,0.03,0.4,'#3a3f4a',-0.8,1.2,-0.2,d,5,false);const sh=cone(0.18,0.2,'#2f8f83',-0.8,1.45,-0.15,d,10,false);sh.rotation.x=0.5;gBox(d,0,0,1.1,0.55);}
  for(const z of [-3.2,0.4])chair(g,-6.6,z,-Math.PI/2,'#ffd166');
  {const p=staticNPC(-6.6,0.4,-Math.PI/2,{pack:false,shirt:'#b28dff'},(dt,t)=>{const u=p.userData;u.arms[1].rotation.x=-1.15+Math.sin(t*6)*0.05;u.arms[0].rotation.x=-1.0;u.head.rotation.x=0.3;},"Writing to my best friend. With stamps and everything.",-0.16);sitPose(p);}
  /* kindness noticeboard */
  const cards=CHALLENGES.slice(0,6);const nb=boardTex((x,W,H)=>{x.fillStyle='#c9925e';x.fillRect(0,0,W,H);for(let i=0;i<900;i++){x.fillStyle=`rgba(90,50,20,${Math.random()*0.15})`;x.fillRect(Math.random()*W,Math.random()*H,3,3);}
    x.fillStyle='#ffffff';x.font=`800 54px ${FD}`;x.textAlign='center';x.fillText('Kindness challenges',W/2,74);x.textAlign='left';
    const cc=['#fff2a8','#ffd1dc','#c8ecff','#d9f7c8','#e6dcff','#ffe0b8'];cards.forEach((t,i)=>{const X=40+(i%3)*325,Y=110+Math.floor(i/3)*250;x.save();x.translate(X+140,Y+110);x.rotate((i%2?1:-1)*0.03);x.fillStyle=cc[i];x.fillRect(-140,-105,290,220);x.fillStyle='#e2504f';x.beginPath();x.arc(0,-92,9,0,TAU);x.fill();x.fillStyle='#24324a';x.font=`500 24px ${FB}`;wrapLines(x,t,250).slice(0,6).forEach((l,k)=>x.fillText(l,-125,-48+k*32));x.restore();});},1024,640);
  const board=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.75),new THREE.MeshBasicMaterial({map:nb}));board.position.set(8.83,2.9,0.5);board.rotation.y=-Math.PI/2;g.add(board);box(0.12,2.95,4.6,'#7a5236',8.9,2.9,0.5,g,false);
  /* envelope garland */
  for(const z of [-2,2]){const pts=[];for(let i=0;i<=14;i++){const t=i/14;pts.push(new THREE.Vector3(-8.5+17*t,5.4-Math.sin(t*Math.PI)*0.6,z));}g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#8a7462'})));
    for(let i=1;i<14;i++){const e=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.28),new THREE.MeshLambertMaterial({color:pick(['#ffffff','#ffe3ec','#e3f4ff','#fff2a8']),side:THREE.DoubleSide}));e.position.copy(pts[i]);e.position.y-=0.2;g.add(e);}}
  plant(g,-8.2,-6.2,1);plant(g,8.2,6.2,1,'#2f8f83');plant(g,-8.2,6.2,0.9);
  const pm=staticNPC(5.2,-5.6,0.3,{shirt:'#2f8f83',pack:false,style:7},null,"Morning! I'm Mr. D'Souza. Every letter on that wall was written by someone who hoped it would find you.");
  SPOTS.push({label:'Open a letter',sub:'Pick one from the wall',color:'#e2504f',tx:0,tz:-5,tr:2.4,run:openLetter});
  SPOTS.push({label:'Write a letter for someone',sub:'Sit at the desk',color:'#2f8f83',tx:-5.6,tz:-3.2,tr:1.5,run:writeLetter});
  SPOTS.push({label:'Pick a kindness challenge',sub:'From the noticeboard',color:'#ffb000',tx:7.2,tz:0.5,tr:1.8,run:pickChallenge});}
function openLetter(){let i=store.get('letterI',Math.floor(Math.random()*LETTERS.length));player.gest='reach';player.gestT=player.gestD=0.8;
  openPanel({title:'A letter for you',eyebrow:'Kindness Post',color:'#e2504f',sub:'Written by someone who hoped it would find you.',build:b=>{
    const show=()=>{const L=LETTERS[i%LETTERS.length];b.querySelector('#ltr').innerHTML=`<p style="margin:0 0 8px"><b>${esc(L[0])}</b></p><p style="margin:0 0 12px">${esc(L[1])}</p><p style="margin:0;text-align:right">— ${esc(L[2])}</p>`;store.set('letterI',i+1);};
    b.innerHTML=`<div class="letter" id="ltr" style="text-align:left"></div><div class="row" style="margin-top:14px"><button class="btn" type="button" id="lN">Open another</button><button class="btn primary" type="button" id="lW">Write one back</button></div>`;
    show();b.querySelector('#lN').addEventListener('click',()=>{i++;show();});b.querySelector('#lW').addEventListener('click',()=>{closePanel();writeLetter();});}});
  award(5,'Opened a letter','letter1');done('kind');}
function writeLetter(){sitAt(-6.6,-3.2,-Math.PI/2,-0.16,{x:-5.4,z:-3.2},{pose:POSE.type,camOff:2.3,dist:4.6,pitch:0.4});
  openPanel({dock:true,title:'Write a letter for a stranger',eyebrow:'Kindness Post',color:'#2f8f83',sub:'It goes in the post box. Someone you\'ll never meet might need it.',build:b=>{
    b.innerHTML=`<div class="sugg" id="kSug"></div><label class="lbl" for="kText">Your letter</label><textarea id="kText" rows="4" maxlength="280" placeholder="Hi stranger, I hope today is kind to you…"></textarea><p class="err" id="kErr" hidden>Write a line or two first.</p>
    <div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="kPost">Post it</button><button class="btn ghost" type="button" id="kUp">Stand up</button></div><p class="meta">Your letters are saved on this device too, so you can copy one and send it to someone you know.</p><ul class="notes" id="kList"></ul>`;
    chips(b.querySelector('#kSug'),['Hi stranger, I hope something good happens to you today.','You\'re doing better than you think.','Eat something nice and drink some water. That\'s an order.'],b.querySelector('#kText'));
    const list=b.querySelector('#kList');const render=()=>{const n=store.get('kind',[]);list.innerHTML='';n.slice().reverse().forEach(x=>{const li=document.createElement('li');li.innerHTML=`<i style="background:#e2504f"></i><span>${esc(x)}</span><button type="button">Copy</button>`;copyBtn(li.querySelector('button'),x);list.appendChild(li);});};render();
    b.querySelector('#kUp').addEventListener('click',closePanel);
    b.querySelector('#kPost').addEventListener('click',()=>{const ta=b.querySelector('#kText');const v=ta.value.trim();if(v.length<3){b.querySelector('#kErr').hidden=false;return;}const n=store.get('kind',[]);n.push(v);store.set('kind',n.slice(-12));ta.value='';render();award(10,'Letter posted');done('kind');track('activity',{id:'kind-letter'});
      closePanel();setTimeout(()=>{flyEnvelope(W.slot);toast('Posted. Somebody will open that one day.',3600);},300);});}});}
function flyEnvelope(to){if(!to)return;const env=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.4),new THREE.MeshLambertMaterial({color:'#fffdf4',side:THREE.DoubleSide}));scene.add(env);const s=handPos(),e=to.clone();let t=0;player.gest='reach';player.gestT=player.gestD=1;
  const fn=dt=>{t+=dt;const k=Math.min(1,t/1.4);env.position.lerpVectors(s,e,k);env.position.y+=Math.sin(k*Math.PI)*1.6;env.rotation.y+=dt*6;if(k>=1){scene.remove(env);updaters.splice(updaters.indexOf(fn),1);popSound(700);}};updaters.push(fn);}
function pickChallenge(){let i=Math.floor(Math.random()*CHALLENGES.length);openPanel({title:'A kindness challenge',eyebrow:'Kindness Post',color:'#ffb000',sub:'Small, doable, and it tends to make both of you feel better.',build:b=>{
  b.innerHTML=`<div class="order"><div class="eyebrow">This week</div><h4 id="chT" style="font-size:20px;line-height:1.35"></h4></div><div class="row" style="margin-top:12px"><button class="btn" type="button" id="chN">Another one</button><button class="btn primary" type="button" id="chY">I\'ll try this</button></div><h3 class="h3">Your challenges</h3><ul class="notes" id="chL"></ul>`;
  const show=()=>{b.querySelector('#chT').textContent=CHALLENGES[i%CHALLENGES.length];};const list=()=>{const a=store.get('chal',[]);b.querySelector('#chL').innerHTML=a.length?a.slice().reverse().map(x=>`<li><i style="background:#ffb000"></i><span>${esc(x)}</span></li>`).join(''):'<li class="empty" style="display:block">Challenges you pick show up here.</li>';};show();list();
  b.querySelector('#chN').addEventListener('click',()=>{i++;show();});b.querySelector('#chY').addEventListener('click',()=>{const a=store.get('chal',[]);const c=CHALLENGES[i%CHALLENGES.length];if(!a.includes(c)){a.push(c);store.set('chal',a.slice(-8));}list();award(5,'Picked a kindness challenge');done('kind');toast('Pinned to your list. Good luck!');});}});}

/* =========================================================
   TALK SPACE
   ========================================================= */
const HELP_W=newWorld({id:'talk',title:'Support Booth',camDist:6.4,build:buildTalkRoom,welcome:'Take a seat if you like. Kiran is around if you want to say hi.',onEnter(){stamp(Z.help);track('room',{id:'help'});done('help');}});
const RESOURCES=[
 {name:'Tele-MANAS',org:'Government of India',num:'14416',alt:'or 1-800-891-4416',desc:'Free, 24 hours a day, every day. Trained counsellors in many Indian languages.',copy:'14416'},
 {name:'iCALL',org:'Tata Institute of Social Sciences (TISS)',num:'022-25521111',alt:'',desc:'Free counselling by phone with trained professionals. Monday to Saturday, 8 am to 9 pm.',copy:'02225521111'},
 {name:'YMH Therapy Platform',org:'Youth for Mental Health',num:'Coming soon',alt:'',desc:'Our own space to connect with trained professionals. We\'re building it now.',soon:true}];
function helpPanel(dock){openPanel({dock:!!dock,title:'People you can reach',eyebrow:'Support Booth',color:Z.help.color,sub:'Free and confidential. You don\'t need a "big enough" reason to call.',build:b=>{
  b.innerHTML=RESOURCES.map((r,i)=>`<div class="contact${r.soon?' soon':''}"><h3>${esc(r.name)}</h3><p class="meta" style="margin:0 0 6px">${esc(r.org)}</p><p>${esc(r.desc)}</p><div class="num-row"><span class="bignum">${esc(r.num)}</span>${r.copy?`<button class="btn" type="button" data-c="${r.copy}">Copy</button>`:''}</div>${r.alt?`<p>${esc(r.alt)}</p>`:''}</div>`).join('')+(dock?'<div class="row" style="margin-top:12px"><button class="btn primary" type="button" id="hUp">Stand up</button></div>':'');
  b.querySelectorAll('[data-c]').forEach(x=>copyBtn(x,x.dataset.c));if(dock)b.querySelector('#hUp').addEventListener('click',closePanel);}});}
function buildTalkRoom(w){const g=room7(w,{w:16,d:13,h:5.4,floorTex:carpetTex2('#d9bb92'),tile:3,wall:'#fff3df',wain:'#f4a259',trim:'#ffffff',ceiling:'#fffaf2',exitTo:exitFront(Z.help),exitSub:'Back to the City Centre',
    windows:[{x:-7.85,z:-1.5,ry:Math.PI/2,w:3,h:2.3,y:2.6,curtain:'#ffd6a8'}],pendants:[[0,-1.5,'#f4a259',0.4]]});
  rug(g,-0.5,-2.4,6.4,4.4,'#fff1dc','#2fa39a','#f4a259');
  sofa(g,-0.5,-5.4,0,'#2fa39a',3.2);armchair(g,-4.4,-1.6,Math.PI/2+0.4,'#ffb36b');armchair(g,3.4,-1.6,-Math.PI/2-0.4,'#ff8f8f');
  const tb=grp(-0.5,-2.6,0,g);box(1.8,0.08,1,'#c98b55',0,0.5,0,tb);for(const sx of [-0.8,0.8])for(const sz of [-0.4,0.4])cyl(0.04,0.04,0.48,'#7a5236',sx,0.24,sz,tb,5,false);gBox(tb,0,0,0.95,0.55);
  cyl(0.1,0.08,0.16,'#ffffff',-0.2,0.62,0.1,tb,10,false);cyl(0.1,0.08,0.16,'#ffd166',0.3,0.62,-0.1,tb,10,false);box(0.3,0.16,0.2,'#c8ecff',-0.6,0.62,-0.1,tb,false);cyl(0.12,0.1,0.2,'#e88a62',0.6,0.64,0.15,tb,8,false);sph(0.16,'#5dbb63',0.6,0.82,0.15,tb,7,false);
  floorLamp(g,-2.9,-5.6);bookshelf(g,7.4,-4.5,-Math.PI/2,2.6,2.6);plant(g,-7,-5.6,1.3);plant(g,7,5.4,1,'#2fa39a');plant(g,-7,5.4,0.9);
  frameArt(g,-0.5,3.3,-6.35,0,2.6,1.5,4,'#ffffff');
  sign('You don\'t have to carry it alone.',null,'#f4a259','#ffffff',5.6,0.8,g,-0.5,4.6,-6.3);
  /* resources board */
  const rb=boardTex((x,W,H)=>{x.fillStyle='#ffffff';x.fillRect(0,0,W,H);x.fillStyle='#e48a12';x.fillRect(0,0,W,96);x.fillStyle='#ffffff';x.font=`800 54px ${FD}`;x.fillText('People you can reach',36,66);
    RESOURCES.forEach((r,i)=>{const Y=150+i*160;x.fillStyle=r.soon?'#f3eefe':'#fff5e8';x.fillRect(30,Y-40,W-60,140);x.fillStyle='#1d2b44';x.font=`800 40px ${FD}`;x.fillText(r.name,56,Y+8);x.font=`800 44px ${FB}`;x.fillStyle=r.soon?'#8a6fd1':'#e48a12';x.textAlign='right';x.fillText(r.num,W-56,Y+10);x.textAlign='left';x.font=`400 24px ${FB}`;x.fillStyle='#4e5f7a';x.fillText(r.desc.slice(0,72)+(r.desc.length>72?'…':''),56,Y+60);});},1024,640);
  const board=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6),new THREE.MeshBasicMaterial({map:rb}));board.position.set(7.83,2.9,1.2);board.rotation.y=-Math.PI/2;g.add(board);box(0.1,2.8,4.4,'#c98b55',7.9,2.9,1.2,g,false);
  const asha=staticNPC(3.4,-1.6,-Math.PI/2-0.4,{shirt:'#ffd166',pack:false,style:1},(dt,t)=>{asha.userData.head.rotation.y=Math.sin(t*0.35)*0.25;},"Hi, I'm Kiran. I volunteer here. Helpline numbers and resources are on the wall board if you need them.",-0.2);sitPose(asha);
  SPOTS.push({label:'Sit on the sofa',sub:'See who you can reach',color:Z.help.color,tx:-0.5,tz:-4.2,tr:1.8,run:()=>{sitAt(-0.5,-5.3,0,-0.2,{x:-0.5,z:-3.6},{camOff:0.5,dist:5.2,pitch:0.28});helpPanel(true);}});
  SPOTS.push({label:'Read the board',sub:'Three ways to reach someone',color:Z.help.color,tx:6.2,tz:1.2,tr:1.8,run:()=>helpPanel(false)});}
function carpetTex2(base){return cardTex(256,256,(x,W,H)=>{x.fillStyle=base;x.fillRect(0,0,W,H);for(let i=0;i<2600;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*0.07})`;x.fillRect(Math.random()*W,Math.random()*H,1,1);x.fillStyle=`rgba(120,80,40,${Math.random()*0.06})`;x.fillRect(Math.random()*W,Math.random()*H,1,1);}});}

/* =========================================================
   STUDY HALL & LIBRARY
   ========================================================= */
const STUDY_W=newWorld({id:'study',title:'Study Hall & Library',camDist:7.5,build:buildStudyRoom,welcome:'Desks on the left for focus. The library is on the right.',onEnter(){stamp(Z.study);track('room',{id:'study'});}});
const READS=[
 {t:'Sleep Is a Study Skill',c:'#3d6fd6',pages:['Pulling an all-nighter feels productive. It usually isn\'t.','Sleep helps your brain hold on to what you learned during the day. Sleep experts recommend that adults get 7 or more hours a night, regularly.','Try this tonight: pick a time to put the phone face down, and keep it the same for a week. See how your mornings feel.'],src:'sleep'},
 {t:'The Two-Minute Start',c:'#ff8f6b',pages:['Big tasks are hard to start. Tiny ones aren\'t.','Tell yourself you\'ll work on it for just two minutes. Open the file. Write one bad sentence. Read one page.','Often you\'ll keep going. If you don\'t, you still started, and starting is the hardest part.'],src:null},
 {t:'Two Hours Outside',c:'#3f9f78',pages:['A study of about 20,000 people in England found that those who spent at least 120 minutes a week in nature were more likely to report good health and well-being.','It didn\'t matter if it was one long walk or a few short ones.','Lunch on the lawn counts. So does the long way back to your room.'],src:'nature'},
 {t:'Comparison Is a Thief',c:'#b28dff',pages:['Everyone posts their results. Nobody posts the night before.','You\'re comparing your inside to everyone else\'s outside. That\'s not a fair match.','Try comparing yourself to you, last month. That\'s the only race that\'s actually yours.'],src:null},
 {t:'Move a Little',c:'#f4a259',pages:['The World Health Organization says regular physical activity can reduce symptoms of depression and anxiety in adults.','WHO suggests at least 150 minutes of moderate activity a week. That\'s about 20 minutes a day.','Walking to class counts. Dancing in your room counts. Taking the stairs counts.'],src:'who_pa'},
 {t:'Being Kind to Yourself',c:'#e2504f',pages:['Notice how you talk to yourself after a mistake. Would you say that to a friend?','Try answering yourself the way you\'d answer them: "That was hard. You did your best with what you knew."','It might feel strange at first. Most new habits do.'],src:null}];
function buildStudyRoom(w){const g=room7(w,{w:28,d:20,h:7.2,floor:'#c08a55',wall:'#e3ecff',wain:'#3d6fd6',trim:'#ffffff',ceiling:'#fbfcff',exitTo:exitFront(Z.study),exitSub:'Back to the City Centre',camDist:7.5,
    windows:[{x:-13.85,z:-5,ry:Math.PI/2,w:3.4,h:3.4,y:3.4},{x:-13.85,z:2.5,ry:Math.PI/2,w:3.4,h:3.4,y:3.4},{x:-6,z:-9.85,ry:0,w:3.4,h:3.4,y:3.6},{x:6,z:-9.85,ry:0,w:3.4,h:3.4,y:3.6}],
    pendants:[[-8.5,-4,'#ffffff',0.35],[-8.5,2,'#ffffff',0.35],[7,4.5,'#ffd166',0.4]]});
  /* low shelf dividing the room */
  for(const z of [-8.2,-5.4,-2.6])bookshelf(g,0,z,Math.PI/2,2.6,1.5,{wood:'#c99466',double:true});addBox(0,-5.4,0.35,4,0);
  /* study side */
  const desks=[];for(const tx of [-9.8,-5.6]){box(1.6,0.08,8,'#c98b55',tx,0.95,-1.2,g);for(const tz of [-4.6,2.2])for(const lx of [-0.65,0.65])box(0.08,0.95,0.08,'#7a5236',tx+lx,0.47,tz,g,false);gBox(g,tx,-1.2,0.85,4.05);
    for(const tz of [-4,-1.2,1.6]){const lp=grp(tx,tz+0.6,0,g);lp.position.y=0.99;cyl(0.12,0.14,0.04,'#2f6f4f',0,0,0,lp,10,false);cyl(0.02,0.02,0.4,'#c9a24a',0,0.2,0,lp,5,false);const sh=box(0.5,0.14,0.2,'#2f8f5f',0,0.42,0.05,lp,false);sh.material=new THREE.MeshStandardMaterial({color:'#2f8f5f',emissive:'#9fe0b8',emissiveIntensity:0.25});}
    for(const side of [-1,1])for(const tz of [-3.4,-0.6,2.2]){const cx=tx+side*1.15;chair(g,cx,tz,side<0?Math.PI/2:-Math.PI/2,'#3d6fd6');desks.push({cx,tz,side,tx});}}
  const SL=["Two more pages, then a chai break.","We study quietly, but together. It helps.","Highlighting everything. Help.","My break timer just went off. Stretching."];let k=0;
  desks.forEach((d,i)=>{const lr=d.side<0?Math.PI/2:-Math.PI/2;laptop(g,d.tx+d.side*0.4,d.tz,d.cx,d.tz);if(i%3!==0)return;const p=staticNPC(d.cx,d.tz,lr,{phones:i%2===0,pack:false},(dt,t)=>{const u=p.userData;u.arms[0].rotation.x=-1.25+Math.sin(t*13+u.phase)*0.05;u.arms[1].rotation.x=-1.25+Math.cos(t*12+u.phase)*0.05;u.head.rotation.x=0.15+Math.sin(t*0.3+u.phase)*0.05;},SL[k++%SL.length],-0.16);sitPose(p);d.busy=true;});
  const free=desks.find(d=>!d.busy&&d.tx===-5.6&&d.side>0)||desks.find(d=>!d.busy);
  const st=pillSprite('Study Hall','#3d6fd6',0.7,{fs:52});st.position.set(-7.6,5.6,-1);g.add(st);
  /* library side */
  for(const x of [4.2,7.6,11])bookshelf(g,x,-5.6,Math.PI/2,7,3.4,{double:true});for(const x of [4.2,7.6,11])addBox(x,-5.6,0.35,3.5,0);
  bookshelf(g,13.6,3.5,-Math.PI/2,5,3.4);addBox(13.6,3.5,0.35,2.5,0);
  const lad=grp(9.3,-3.4,0.25,g);for(const sx of [-0.3,0.3]){const r=box(0.07,3.6,0.07,'#a8744a',sx,1.8,0,lad,false);r.rotation.x=-0.18;}for(let i=0;i<7;i++){const s=box(0.6,0.05,0.07,'#a8744a',0,0.35+i*0.48,-0.06*i,lad,false);}
  const lt=pillSprite('Library','#e2504f',0.7,{fs:52});lt.position.set(7.6,5.6,-1);g.add(lt);
  /* reading nook */
  rug(g,8.6,4.4,6,4.4,'#fff6ea','#e2504f','#3d6fd6');armchair(g,6.6,5.6,Math.PI*0.85,'#ff8f6b');armchair(g,10.6,5.6,-Math.PI*0.85,'#2fa39a');
  const bb=sph(0.7,'#ffd166',8.6,0.45,2.6,g,12);bb.scale.set(1.2,0.6,1.2);addCircle(8.6,2.6,0.8);floorLamp(g,12.6,6.8);plant(g,4.4,7.6,1);plant(g,-12.8,7.6,1.1);plant(g,-12.8,-8.6,1);
  {const p=staticNPC(10.6,5.6,-Math.PI*0.85,{pack:false},(dt,t)=>{const u=p.userData;u.arms.forEach(a=>a.rotation.x=-1.1);u.head.rotation.x=0.35;},"This chair is the best seat in the whole city. Don't tell anyone.",-0.2);sitPose(p);}
  /* librarian */
  const ld=grp(4.6,4.8,-Math.PI/2,g);box(2.4,1.05,0.8,'#c98b55',0,0.52,0,ld);box(2.5,0.08,0.95,'#e9d7b8',0,1.08,0,ld);gBox(ld,0,0,1.25,0.5);box(0.4,0.3,0.3,pick(BOOKC),0.6,1.27,0,ld,false);
  staticNPC(3.6,4.8,Math.PI/2,{shirt:'#3d6fd6',pack:false,style:5},null,"Hello! I'm Mr. Iyer. Short reads on the shelves, all under five minutes. Take any one you like.");
  frameArt(g,-13.8,3.4,-1.2,Math.PI/2,1.8,1.3,5);
  SPOTS.push({label:'Sit at a free desk',sub:'Focus timer with gentle breaks',color:'#3d6fd6',tx:free.cx+free.side*0.8,tz:free.tz,tr:1.6,run:()=>{sitAt(free.cx,free.tz,free.side<0?Math.PI/2:-Math.PI/2,-0.16,{x:free.cx+free.side*0.9,z:free.tz},{pose:POSE.type,camOff:0.9,dist:5.2,pitch:0.34});
    openPanel({dock:true,title:'Focus session',eyebrow:'Study Hall',color:'#3d6fd6',sub:'Phone face down. One thing at a time.',build:studyFocus});}});
  SPOTS.push({label:'Browse the shelves',sub:'Short reads, under five minutes each',color:'#e2504f',tx:5.9,tz:-4,tr:2,run:()=>bookChooser()});
  SPOTS.push({label:'Curl up in the reading chair',sub:'Read something short',color:'#ff8f6b',tx:6.9,tz:4.3,tr:1.6,run:()=>bookChooser(true)});}
function studyFocus(b){const cl=ACT.study(b);let sec=0;const iv=setInterval(()=>{if(STUDY.mode==='focus'){sec++;if(sec===60){done('study');award(5,'Focused for a minute','focus1');}}},1000);
  const row=document.createElement('div');row.className='row';row.style.marginTop='10px';row.innerHTML='<button class="btn primary" type="button">Stand up</button>';row.querySelector('button').addEventListener('click',closePanel);b.appendChild(row);
  return ()=>{clearInterval(iv);if(cl)cl();};}
function bookChooser(sit){openPanel({title:'Pick a short read',eyebrow:'Library',color:'#e2504f',sub:'Each one takes a few minutes. Nothing to remember afterwards.',build:b=>{
  const readN=store.get('reads',[]);b.innerHTML=`<div class="books">${READS.map((r,i)=>`<button type="button" class="book" data-i="${i}" style="--bc:${r.c}"><b>${esc(r.t)}</b><span>${r.pages.length} pages${readN.includes(i)?' · read':''}</span></button>`).join('')}</div>`;
  b.querySelectorAll('.book').forEach(x=>x.addEventListener('click',()=>{const i=+x.dataset.i;closePanel();readBook(i);}));}});}
function readBook(i){const r=READS[i];sitAt(6.6,5.6,Math.PI*0.85,-0.2,{x:6.9,z:3.9},{pose:t=>{const u=avatar.userData;resetPose(avatar);u.legs.forEach(l=>l.rotation.x=-Math.PI/2);u.arms.forEach(a=>a.rotation.x=-1.1);u.head.rotation.x=0.35;},camOff:0.7,dist:4.6,pitch:0.32});
  let p=0;openPanel({dock:true,title:r.t,eyebrow:'Library',color:r.c,sub:'A short read',build:b=>{
    const draw=()=>{const last=p===r.pages.length-1;b.innerHTML=`<p class="meta">Page ${p+1} of ${r.pages.length}</p><p class="lead" style="font-size:17px">${esc(r.pages[p])}</p>
      <div class="row"><button class="btn" type="button" id="bkP" ${p===0?'disabled':''}>Back</button>${last?'<button class="btn primary" type="button" id="bkD">Close the book</button>':'<button class="btn primary" type="button" id="bkN">Next page</button>'}<button class="btn" type="button" id="bkL">Read it to me</button></div>`;
      const q=s=>b.querySelector(s);q('#bkP').addEventListener('click',()=>{p=Math.max(0,p-1);draw();});if(q('#bkN'))q('#bkN').addEventListener('click',()=>{p++;draw();});q('#bkL').addEventListener('click',()=>speak(r.pages[p],true));
      if(last){const a=store.get('reads',[]);if(!a.includes(i)){a.push(i);store.set('reads',a);award(10,'Finished a short read');}done('study');track('activity',{id:'read-'+i});q('#bkD').addEventListener('click',closePanel);}};draw();}});}

/* =========================================================
   MUSEUM (redesigned)
   ========================================================= */
function museumFloorTex(){return cardTex(1024,1024,(x,W,H)=>{x.fillStyle='#cf9f6c';x.fillRect(0,0,W,H);const n=16;for(let r=0;r<n;r++){const y=r*H/n;x.fillStyle=`rgba(255,255,255,${0.03+((r*37)%5)*0.015})`;x.fillRect(0,y,W,H/n);x.fillStyle='rgba(140,90,40,.25)';x.fillRect(0,y,W,2);for(let k=0;k<3;k++)x.fillRect(((r*173+k*331)%W),y,2,H/n);}});}
function buildMuseum(w){const g=room7(w,{w:58,d:42,h:10,floorTex:museumFloorTex(),tile:14,wall:'#f8efe2',wain:'#e3d2b8',trim:'#ffffff',ceiling:'#fffdf8',bg:'#f6efe4',hemi:0.66,amb:0.14,dir:0.6,camDist:8,
    exitTo:CQ.exit.museum,exitSub:'Back to the Creative Quarter',pendants:[]});
  const hw=29,hd=21;
  const H=MUSEUM.history,I=MUSEUM.india,S=MUSEUM.science,MY=MUSEUM.myths,P=MUSEUM.people;
  /* skylight */
  const sky=new THREE.Mesh(new THREE.PlaneGeometry(18,12),new THREE.MeshBasicMaterial({color:'#f4fbff'}));sky.rotation.x=Math.PI/2;sky.position.set(0,9.98,-1);g.add(sky);
  for(let i=0;i<=6;i++)box(0.18,0.3,12,'#d8cbb6',-9+i*3,9.85,-1,g,false);for(let j=0;j<=4;j++)box(18,0.3,0.18,'#d8cbb6',0,9.85,-7+j*3,g,false);
  const sl=new THREE.PointLight('#fff8e8',0.5,40,1.5);sl.position.set(0,8,-1);g.add(sl);
  /* gallery colour walls behind the panels */
  const band=(x,z,len,ry,c)=>{const m=box(len,5.2,0.06,c,x,3.6,z,g,false);m.rotation.y=ry;};
  band(0,-hd+0.2,40,0,'#e6eefc');band(-hw+0.2,-1,36,Math.PI/2,'#fde9d9');band(hw-0.2,-1,36,Math.PI/2,'#def3ea');
  /* exhibit helper: framed panel with a picture light */
  const ex=(item,sec,x,z,ry,wd,ht,read)=>{const f=grp(x,z,ry,g);f.position.y=3.5;
    box(wd+0.3,ht+0.3,0.12,'#5a4632',0,0,0,f,false);const m=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:panelTex(item,sec.color,wd,ht)}));m.position.z=0.07;f.add(m);
    box(wd*0.6,0.08,0.3,'#3a3f4a',0,ht/2+0.4,0.18,f,false);const lb=box(wd*0.55,0.04,0.06,'#fff',0,ht/2+0.35,0.32,f,false);lb.material=BULB_MAT;
    const fx=x+Math.sin(ry)*2.2,fz=z+Math.cos(ry)*2.2;SPOTS.push({label:`Read: ${item.title.length>30?item.title.slice(0,28)+'…':item.title}`,sub:`${item.year} · ${sec.title}`,color:sec.color,tx:fx,tz:fz,tr:1.6,run:()=>openReading(item,sec)});};
  H.items.forEach((it,i)=>ex(it,H,-21+i*7,-hd+0.35,0,4.6,3.3));
  const tl=box(46,0.04,0.35,H.color,0,0.03,-hd+2.6,g,false);H.items.forEach((it,i)=>{cyl(0.28,0.28,0.06,H.color,-21+i*7,0.04,-hd+2.6,g,14,false);});
  I.items.forEach((it,i)=>ex(it,I,-hw+0.35,-16.5+i*3.05,Math.PI/2,2.7,3.1));
  [...S.items.map(it=>[it,S]),...MY.items.map(it=>[it,MY])].forEach(([it,sec],i)=>ex(it,sec,hw-0.35,-16.5+i*3.2,-Math.PI/2,2.8,3.1));
  const title=(t,c,x,z,ry,len)=>{sign(t,null,c,'#ffffff',len,1.1,g,x,7.6,z,ry);};
  title(H.title,H.color,0,-hd+0.4,0,14);title(I.title,I.color,-hw+0.4,-1,Math.PI/2,12);title(`${S.title}  ·  ${MY.title}`,S.color,hw-0.4,-1,-Math.PI/2,17);
  /* rotunda with the brain sculpture under the skylight */
  cyl(5.2,5.4,0.35,'#efe3cf',0,0.17,-1,g,40);cyl(4.6,4.6,0.04,'#e2d3bb',0,0.36,-1,g,40);addCircle(0,-1,1.6);
  const pl=cyl(1,1.2,1.3,'#ffffff',0,0.98,-1,g,20);const bm=[new THREE.MeshStandardMaterial({color:'#ff9fb0',roughness:0.55}),new THREE.MeshStandardMaterial({color:'#ffc48a',roughness:0.55}),new THREE.MeshStandardMaterial({color:'#9fd7c2',roughness:0.55}),new THREE.MeshStandardMaterial({color:'#b9a8ff',roughness:0.55})];
  const brain=new THREE.Group();brain.position.set(0,2.5,-1);g.add(brain);for(let i=0;i<46;i++){const a=rnd()*TAU,b=rr(0.15,1.35);const r=rr(0.32,0.5);const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),bm[(i%4)]);m.position.set(Math.cos(a)*Math.sin(b)*1.05,Math.cos(b)*0.75,Math.sin(a)*Math.sin(b)*0.8);m.castShadow=true;brain.add(m);}
  updaters.push((dt,t)=>{brain.rotation.y+=dt*0.15;});
  [['Prefrontal cortex','#ff7f95',0,1.7,1.1],['Amygdala','#e6973f',1.3,0.9,0],['Hippocampus','#3f9f78',-1.3,0.8,0]].forEach(([t,c,x,y,z])=>{const s=pillSprite(t,c,0.42,{fs:40});s.position.set(x,y+0.6,z);brain.add(s);});
  SPOTS.push({label:'Look at the brain model',sub:'Spin it and tap the parts',color:'#3f9f78',tx:0,tz:4.6,tr:2.2,run:()=>openBrain()});
  for(let i=0;i<6;i++){const a=i/6*TAU+0.5;const x=Math.cos(a)*7.2,z=-1+Math.sin(a)*7.2;if(z>3.5&&Math.abs(x)<3)continue;const bg=grp(x,z,Math.atan2(-x,-1-z),g);box(2.2,0.1,0.6,'#c98b55',0,0.5,0,bg);for(const sx of [-0.9,0.9])box(0.1,0.5,0.5,'#7a5236',sx,0.25,0,bg,false);gBox(bg,0,0,1.15,0.35);}
  for(const [x,z] of [[-9,-12],[9,-12],[-9,8],[9,8]])plant(g,x,z,1.3,'#ffffff');
  /* people gallery: portrait stands in an arc behind the rotunda */
  P.items.forEach((it,i)=>{const n=P.items.length;const a=Math.PI*(0.18+0.64*i/(n-1));const x=Math.cos(a)*-14,z=-1-Math.sin(a)*12.6;const ry=Math.atan2(-x,(-1-z));const st=grp(x,z,ry,g);
    box(1.2,1.1,0.7,'#efe3cf',0,0.55,0,st);box(0.12,1.6,0.12,'#5a4632',0,1.9,-0.1,st,false);
    const pt=portraitTex(it,P.color);
    const fr=grp(0,0,0,st);fr.position.set(0,2.75,0);box(1.25,1.55,0.08,'#5a4632',0,0,0,fr,false);const pic=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.4),new THREE.MeshBasicMaterial({map:pt}));pic.position.z=0.05;fr.add(pic);
    sign(it.title,it.year,P.color,'#ffffff',1.6,0.55,st,0,0.8,0.37);gBox(st,0,0,0.65,0.4);
    const f=L2W(st,0,1.8);SPOTS.push({label:`Read: ${it.title}`,sub:`${it.year} · ${P.title}`,color:P.color,tx:f.x,tz:f.z,tr:1.4,run:()=>openReading(it,P)});});
  {const ps=pillSprite(P.title,P.color,0.8,{fs:52});ps.position.set(0,6.2,-14.5);g.add(ps);}
  /* visitors */
  staticNPC(-3,hd-3.2,Math.PI,{shirt:'#9a86c9',pack:false,style:4},null,"Welcome! History is on the far wall, India on your left, psychology topics and myths on your right. The people who shaped the field are around the brain.");
  for(const [x,z,r,l] of [[-14,-18.2,Math.PI,"I left a sticky note on the history wall."],[7,-18.2,Math.PI,"Which psychology topic would you pick? I'm stuck between two."],[-26.2,6,-Math.PI/2,"Girindrasekhar Bose wrote letters to Freud. Wild."],[26.2,-8,Math.PI/2,"The myths wall surprised me."]])staticNPC(x,z,r,null,null,l);
  wheelchairUser([{x:-16,z:12},{x:16,z:12}],0.9,"Every gallery here is step-free. Love that.");}
{const _or=openReading;openReading=function(item,sec){_or(item,sec);const n=(store.get('musReads',0))+1;store.set('musReads',n);track('activity',{id:'museum-read'});if(n>=2)done('museum');};}

MUSEUM_W.build=buildMuseum;
