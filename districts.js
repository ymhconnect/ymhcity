'use strict';
/* =========================================================
   DISTRICTS: city overrides, monument, train, Joy Park,
   Culture Quarter exteriors, Policy Circle, radio, carts.
   ========================================================= */

/* ---------- step-free entrances on every building ---------- */
{const _house=window.house;window.house=function(g,o){const fz=_house(g,o);const r=box(2.4,0.12,1.9,'#d8d2c8',0,0.2,fz+1.1,g,false);r.rotation.x=0.21;
  for(const sx of [-1.25,1.25]){const h=box(0.06,0.06,2,'#8a96a8',sx,1.05,fz+1.1,g,false);h.rotation.x=0.21;cyl(0.03,0.03,0.9,'#8a96a8',sx,0.62,fz+2,g,5,false);cyl(0.03,0.03,0.9,'#8a96a8',sx,0.9,fz+0.25,g,5,false);}
  return fz;};}

/* ---------- city overrides ---------- */
function buildGround(){
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#9cc27f';x.fillRect(0,0,256,256);
  for(let i=0;i<2200;i++){const g=Math.random();x.fillStyle=g<.5?'rgba(122,165,96,.45)':g<.86?'rgba(172,204,138,.45)':'rgba(222,232,190,.3)';x.fillRect(Math.random()*256,Math.random()*256,2,2+Math.random()*3);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(120,120);t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1100,1100),new THREE.MeshLambertMaterial({map:t}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const pc=document.createElement('canvas');pc.width=pc.height=1024;const p=pc.getContext('2d');p.fillStyle='#efe4d2';p.fillRect(0,0,1024,1024);
  p.translate(512,512);p.strokeStyle='#dccab0';p.lineWidth=4;for(let r=96;r<=512;r+=64){p.beginPath();p.arc(0,0,r,0,TAU);p.stroke();}
  for(let a=0;a<36;a++){const ang=a/36*TAU;p.beginPath();p.moveTo(Math.cos(ang)*96,Math.sin(ang)*96);p.lineTo(Math.cos(ang)*512,Math.sin(ang)*512);p.stroke();}
  const ring=['#e8d3bf','#d5e0e6','#ddd8e6','#d6e2d6'];for(let a=0;a<36;a++){const ang=(a+0.5)/36*TAU;p.fillStyle=ring[a%4];p.beginPath();p.arc(Math.cos(ang)*416,Math.sin(ang)*416,20,0,TAU);p.fill();}
  const pt=new THREE.CanvasTexture(pc);pt.anisotropy=8;const pm=new THREE.MeshLambertMaterial({map:pt,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8});
  const plaza=new THREE.Mesh(new THREE.CircleGeometry(16.4,72),pm);plaza.rotation.x=-Math.PI/2;plaza.position.y=0.03;plaza.receiveShadow=true;scene.add(plaza);
  flat(new THREE.RingGeometry(25.8,31.2,120),'#efdfc2',0,0.02,0,2);
  const rc=['#dba99c','#dcc58f','#a6c8b1','#a6bfd6','#bdb3d6'];const dg=new THREE.CircleGeometry(0.3,12);for(let i=0;i<70;i++){const a=i/70*TAU;flat(dg,rc[i%5],Math.cos(a)*28.5,0.024,Math.sin(a)*28.5,3);}
  [25.95,31.05].forEach(r=>flat(new THREE.RingGeometry(r-0.12,r+0.12,120),'#e2cfa8',0,0.022,0,3));
  pathSeg(0,15,0,112,8.6,'#eedcbd');
  for(let z=20;z<110;z+=4)flat(new THREE.PlaneGeometry(0.4,1.6),'#ffffff',0,0.025,z,3);
  /* tactile guidance strips near crossings */
  for(const z0 of [16,66,88]){for(let i=0;i<4;i++)for(const sx of [-3.6,3.6])flat(new THREE.PlaneGeometry(0.7,0.7),'#e2c25a',sx,0.026,z0+i*0.9,3);}
  /* monument roundabout */
  flat(new THREE.CircleGeometry(7.5,48),'#e7d6bb',0,0.028,44,3);
}
const GATE_PATHS=[[28.6,-12,122,-12],[-28.6,-12,-122,-12],[24,-19.6,24,-114]];
function buildPaths(){
  for(const zn of ZONES){if(!zn.area||zn.id==='yoga')continue;const a=Math.atan2(zn.spot.z,zn.spot.x);pathSeg(Math.cos(a)*15,Math.sin(a)*15,zn.spot.x,zn.spot.z,4.2);}
  pathSeg(-4.3,57,Z.yoga.x+8.5,57.5,3.2);
  GATE_PATHS.forEach(p=>pathSeg(p[0],p[1],p[2],p[3],5,'#ecdcbf'));
}
function gateArch(x,z,ry,title,sub,col){const g=grp(x,z,ry);for(const s of [-1,1]){box(1.2,6,1.2,'#24324a',s*4,3,0,g);sph(0.6,'#ffd166',s*4,6.5,0,g,10).material=LAMP_MAT;}box(9.4,0.6,1,col||'#5fa58f',0,6,0,g);sign(title,sub,'#24324a','#ffffff',7,1.7,g,0,7.3,0);return g;}
function buildHedges(){
  const hc='#5a8f5c';
  const seg=(x1,z1,x2,z2)=>{const cx=(x1+x2)/2,cz=(z1+z2)/2,len=Math.hypot(x2-x1,z2-z1),rot=Math.atan2(x2-x1,z2-z1);const m=box(1.4,1.7,len,hc,cx,0.85,cz,null);m.rotation.y=rot;addBox(cx,cz,0.7,len/2,rot);
    const n=Math.floor(len/3.4);for(let i=0;i<n;i++){const t=(i+0.5)/n;sph(0.75,'#649a63',x1+(x2-x1)*t,1.7,z1+(z2-z1)*t,null,7,false).scale.set(1,0.6,1);}};
  seg(-88,72,-9,72);seg(9,72,88,72);
  seg(-88,-88,-88,-17);seg(-88,-7,-88,72);seg(88,-88,88,-17);seg(88,-7,88,72);
  seg(-88,-88,19,-88);seg(29,-88,88,-88);
  gateArch(88,-12,Math.PI/2,'Joy Park','wheel · carousel · coaster · swings','#d48aa6');gateArch(-88,-12,Math.PI/2,'Creative Quarter','art · stories · ideas','#9a86c9');gateArch(24,-88,0,'Sky Port','flights · balloon · naps','#5aa6c2');
  for(let i=0;i<30;i++){const a=i/30*TAU+rr(-0.1,0.1),d=rr(300,380);const m=sph(rr(45,80),pick(['#9cc286','#8fb87e','#a5c88f','#94bd85']),Math.cos(a)*d,-6,Math.sin(a)*d,null,12,false);m.scale.y=rr(0.3,0.48);}
  for(let i=0;i<16;i++){const a=i/16*TAU+rr(-0.15,0.15),d=rr(470,540);cone(rr(60,95),rr(80,130),pick(['#a7c0d8','#b0c7dc','#b9cfe2']),Math.cos(a)*d,20,Math.sin(a)*d,null,6,false);}
}
const OUT_RECTS=[[-106,106,-106,118],[94,184,-78,56],[-211,-94,-86,64],[-78,78,-194,-94]];
function buildTrees(){
  let n=0,tries=0;
  while(n<102&&tries<6000){tries++;const x=rr(-83,83),z=rr(-83,68);if(!isFree(x,z,3.4))continue;if(TREES.some(t=>Math.hypot(t.x-x,t.z-z)<5))continue;
    const k=rnd();tree(x,z,k<0.42?0:k<0.68?1:k<0.84?2:3,rr(0.85,1.25));addCircle(x,z,0.55);n++;}
  tries=0;n=0;
  while(n<170&&tries<8000){tries++;const x=rr(-280,280),z=rr(-280,260);if(inRects(x,z,OUT_RECTS))continue;if(TREES.some(t=>Math.hypot(t.x-x,t.z-z)<6))continue;
    const k=rnd();tree(x,z,k<0.42?0:k<0.78?1:k<0.9?2:3,rr(1.1,1.7),false);n++;}
  for(const a of [-2.05,-1.1,-0.25,0.5,1.2,1.95,2.65]){const r=21;tree(Math.cos(a)*r,Math.sin(a)*r,2,0.9);addCircle(Math.cos(a)*r,Math.sin(a)*r,0.6);cyl(1.4,1.5,0.5,'#e8d6b8',Math.cos(a)*r,0.25,Math.sin(a)*r,null,14);}
}
function edgeTrees(x0,x1,z0,z1,n){n=Math.round(n*0.85);let k=0,tries=0;while(k<n&&tries<n*40){tries++;const side=Math.floor(rnd()*4);const x=side<2?rr(x0,x1):(side===2?x0+rr(0,3):x1-rr(0,3)),z=side>=2?rr(z0,z1):(side===0?z0+rr(0,3):z1-rr(0,3));
  if(onPaved(x,z,2))continue;if(TREES.some(t=>Math.hypot(t.x-x,t.z-z)<4.5))continue;tree(x,z,rnd()<0.5?0:1,rr(1,1.4));addCircle(x,z,0.6);k++;}}
function buildFlowers(){
  const pos=[];const addF=(x,z)=>{if(!onPaved(x,z,0.15))pos.push([x,z]);};
  for(let z=18;z<70;z+=7.3){for(const sd of [-1,1])addF(sd*rr(5.4,7.2),z+rr(-.4,.4));}
  for(let i=0;i<51;i++){const a=rnd()*TAU,r=rr(17,24.6);addF(Math.cos(a)*r,Math.sin(a)*r);}
  for(let i=0;i<5;i++){const cx=rr(-80,80),cz=rr(-80,66);if(!isFree(cx,cz,2))continue;for(let j=0;j<9;j++)addF(cx+rr(-1.5,1.5),cz+rr(-1.5,1.5));}
  ZONES.forEach(zn=>{if(!zn.area)return;for(let j=0;j<7;j++){const a=rnd()*TAU,r=zn.area-rr(0,2.5);addF(zn.x+Math.cos(a)*r,zn.z+Math.sin(a)*r);}});
  flowerSpots=pos;const FC=['#f2efe6','#dcd2ea','#efd9a6','#e6bcc4','#c9d9ea','#f3e3c3'];
  const im=new THREE.InstancedMesh(new THREE.SphereGeometry(0.15,6,4),new THREE.MeshLambertMaterial({color:'#ffffff'}),pos.length);
  const lm=new THREE.InstancedMesh(new THREE.ConeGeometry(0.22,0.45,5),new THREE.MeshLambertMaterial({color:'#5f9a5c'}),pos.length);
  const d=new THREE.Object3D();const col=new THREE.Color();
  pos.forEach((p,i)=>{d.position.set(p[0],0.42,p[1]);d.scale.setScalar(rr(0.8,1.2));d.rotation.set(0,0,0);d.updateMatrix();im.setMatrixAt(i,d.matrix);col.set(pick(FC));im.setColorAt(i,col);d.position.set(p[0],0.2,p[1]);d.updateMatrix();lm.setMatrixAt(i,d.matrix);});
  if(im.instanceColor)im.instanceColor.needsUpdate=true;scene.add(im);scene.add(lm);
  const N=1260;const gm=new THREE.InstancedMesh(new THREE.ConeGeometry(0.12,0.55,4),new THREE.MeshLambertMaterial({color:'#6b9e5c'}),N);let k=0;
  for(let i=0;i<N*3&&k<N;i++){const x=rr(-205,180),z=rr(-190,130);if(onPaved(x,z,0.3))continue;if(Math.hypot(x-LAKE.x,z-LAKE.z)<17)continue;if(z<-160&&z>-176)continue;d.position.set(x,0.25,z);d.rotation.set(rr(-.2,.2),0,rr(-.2,.2));d.scale.set(1,rr(0.6,1.4),1);d.updateMatrix();gm.setMatrixAt(k++,d.matrix);}
  gm.count=k;scene.add(gm);
}
function buildAvenue(){
  for(const z of [22,33,55,66]){lamp(-5.6,z,'#d97a68');lamp(5.6,z,'#5fa58f');bunting(-5.6,4.4,z,5.6,4.4,z,1.1);}
  for(const z of [80,102]){lamp(-5.6,z);lamp(5.6,z);}
  const avoid=[Math.PI/2,Math.atan2(-12,28.6),Math.atan2(-12,-28.6),Math.atan2(-19.6,24)];
  for(let i=0;i<16;i++){const a=i/16*TAU+0.1;if(avoid.some(v=>Math.abs(Math.atan2(Math.sin(a-v),Math.cos(a-v)))<0.25))continue;let ok=true;for(const zn of ZONES){if(!zn.area||zn.id==='yoga'||zn.id==='help')continue;const za=Math.atan2(zn.z,zn.x);if(Math.abs(Math.atan2(Math.sin(a-za),Math.cos(a-za)))<0.16)ok=false;}if(!ok)continue;
    if(i%2===0)lamp(Math.cos(a)*32.4,Math.sin(a)*32.4);else{const x=Math.cos(a)*33,z=Math.sin(a)*33;bench(x,z,Math.atan2(-x,-z));}}
  const mb=grp(-11,66,0.25);box(0.3,3.6,0.3,'#36536b',-2.3,1.8,0,mb);box(0.3,3.6,0.3,'#36536b',2.3,1.8,0,mb);
  const tex=new THREE.CanvasTexture(drawMap(700,true,true));tex.anisotropy=8;const face=new THREE.MeshBasicMaterial({map:tex});const side=M('#ffffff');
  const board=new THREE.Mesh(new THREE.BoxGeometry(4.6,4.6,0.25),[side,side,side,side,face,side]);board.position.set(0,4.2,0.1);board.castShadow=true;mb.add(board);
  box(5,0.4,0.6,'#36536b',0,6.6,0.1,mb);addBox(-11,66,2.5,0.4,0.25);pillLabel(mb,'City map',0,7.6,0,'#d9b45f',1.1);
}
function buildWalkers(){
  for(let i=0;i<9;i++)ringWalker(rnd()*TAU,i%2?1:-1,rr(26.8,30.2),(i===2||i===6)&&typeof SET!=='undefined'?SET.animals:(i===2||i===6));
  for(let i=0;i<4;i++){const lx=(i%2?1:-1)*rr(4.1,4.5);pathWalker([{x:lx,z:rr(100,110)},{x:lx,z:rr(17,24)}],rr(1.2,1.7));}
  for(const id of ['mood','kind','arcade','breath','worry','study']){const zn=Z[id];const a=Math.atan2(zn.spot.z,zn.spot.x);const off=rr(-0.6,0.6);const s={x:Math.cos(a)*28.5+Math.sin(a)*off,z:Math.sin(a)*28.5-Math.cos(a)*off};pathWalker([s,{x:zn.spot.x+Math.sin(a)*off,z:zn.spot.z-Math.cos(a)*off}],rr(1.1,1.6));}
  
  const ring=[];for(let i=0;i<=12;i++){const a=-0.4+i*0.12;ring.push({x:Math.cos(a)*28.2,z:Math.sin(a)*28.2});}wheelchairUser(ring,1.0);
  const ring2=[];for(let i=0;i<=10;i++){const a=2.1+i*0.12;ring2.push({x:Math.cos(a)*29.4,z:Math.sin(a)*29.4});}wheelchairUser(ring2,1.1);
  wheelchairUser([{x:-3.4,z:24},{x:-3.4,z:66}],1.0,"The avenue is smooth all the way to the gate.");
  pathWalker([{x:40,z:-12},{x:116,z:-12}],1.5);pathWalker([{x:-40,z:-12},{x:-120,z:-12}],1.4);
}

/* ---------- monument: the Kite Circle ---------- */
function kiteMesh(c1,c2){const g=new THREE.Group();const sh=new THREE.Shape();sh.moveTo(0,1.15);sh.lineTo(0.8,0.15);sh.lineTo(0,-1.05);sh.lineTo(-0.8,0.15);sh.closePath();
  const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshLambertMaterial({color:c1,side:THREE.DoubleSide}));g.add(m);
  const h=new THREE.Shape();h.moveTo(0,1.15);h.lineTo(0.8,0.15);h.lineTo(0,0.15);h.closePath();const m2=new THREE.Mesh(new THREE.ShapeGeometry(h),new THREE.MeshLambertMaterial({color:c2,side:THREE.DoubleSide}));m2.position.z=0.01;g.add(m2);
  const h2=new THREE.Shape();h2.moveTo(0,-1.05);h2.lineTo(-0.8,0.15);h2.lineTo(0,0.15);h2.closePath();const m3=new THREE.Mesh(new THREE.ShapeGeometry(h2),new THREE.MeshLambertMaterial({color:c2,side:THREE.DoubleSide}));m3.position.z=0.01;g.add(m3);
  box(0.05,2.2,0.05,'#7a5236',0,0.05,0.03,g,false);box(1.6,0.05,0.05,'#7a5236',0,0.15,0.03,g,false);
  const tail=[];for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.16),new THREE.MeshLambertMaterial({color:i%2?c1:c2,side:THREE.DoubleSide}));b.position.set(0,-1.25-i*0.42,0);g.add(b);tail.push(b);}
  g.userData.tail=tail;return g;}
function buildMonument(){const g=grp(0,44,0);
  /* round sitting steps in warm sandstone */
  cyl(4.6,4.8,0.45,'#e9c9a8',0,0.22,0,g,40);cyl(3.7,3.9,0.45,'#f3dcc0',0,0.67,0,g,40);cyl(2.8,3.0,0.45,'#fbe9d4',0,1.12,0,g,40);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(4.75,0.12,6,64),M('#d9a37a'));ring.rotation.x=Math.PI/2;ring.position.y=0.46;g.add(ring);
  /* the spool: a slim mast like a charkhi handle, wrapped in thread */
  cyl(0.55,0.7,1.2,'#d9734e',0,1.95,0,g,16);cyl(0.22,0.26,7.2,'#fff8ee',0,5.9,0,g,12);
  for(let i=0;i<14;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.045,6,18),M(['#ff9f43','#e84393','#00a8a8','#ffd23f'][i%4]));t.rotation.x=Math.PI/2;t.position.y=2.7+i*0.32;g.add(t);}
  sph(0.45,'#ffd23f',0,9.7,0,g,14).material=LAMP_MAT;
  /* seven kites, each on its own thread, each at its own height */
  const KC=[['#ff9f43','#ffd23f'],['#e84393','#ffb3d1'],['#00a8a8','#9ff0e6'],['#ffd23f','#ff6f61'],['#7b6cf6','#c9c2ff'],['#2f9e44','#b2f2bb'],['#ff6f61','#ffd8a8']];
  const kites=[];const lines=[];
  KC.forEach((c,i)=>{const a=i/KC.length*TAU+0.3;const r=4.2+(i%3)*1.6;const y=6.6+((i*5)%7)*0.62;const k=kiteMesh(c[0],c[1]);k.scale.setScalar(1.25+(i%3)*0.2);g.add(k);
    const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:'#ffffff',transparent:true,opacity:0.8}));ln.frustumCulled=false;g.add(ln);
    kites.push({k,a,r,y,ph:i*1.7,ln});});
  updaters.push((dt,t)=>{const s=A11Y&&A11Y.rm?0.4:1;for(const q of kites){const x=Math.cos(q.a+Math.sin(t*0.12+q.ph)*0.08*s)*q.r,z=Math.sin(q.a+Math.sin(t*0.12+q.ph)*0.08*s)*q.r,y=q.y+Math.sin(t*0.7+q.ph)*0.45*s;
      q.k.position.set(x,y,z);q.k.rotation.set(Math.sin(t*0.9+q.ph)*0.12*s,-q.a+Math.PI/2,Math.sin(t*1.1+q.ph)*0.18*s);q.k.userData.tail.forEach((b,j)=>{b.position.x=Math.sin(t*2.2-j*0.7+q.ph)*0.12*(j+1)*s;b.rotation.y=Math.sin(t*2-j)*0.4;});
      const p=q.ln.geometry.attributes.position.array;p[0]=0;p[1]=8.9;p[2]=0;p[3]=x;p[4]=y-0.9;p[5]=z;q.ln.geometry.attributes.position.needsUpdate=true;}});
  const pl=sign('The Kite Circle','we rise at our own pace','#d9734e','#fff8ee',3,0.95,g,0,1.0,4.0);pl.rotation.x=-0.3;
  addCircle(0,44,4.9);
  SPOTS.push({label:'Read the Kite Circle plaque',sub:'The city monument',color:'#d9734e',tx:0,tz:51,tr:4.5,run:()=>{stampId('monument');award(5,'Visited the Kite Circle','monument');openPanel({title:'The Kite Circle',eyebrow:'City monument',color:'#d9734e',sub:'We rise at our own pace.',build:b=>{b.innerHTML=`<p class="lead">Seven kites, seven heights. None of them is racing the others.</p><p class="lead">Every kite needs a thread and a hand on the other end. The thread here is wound around one spool in the middle, the way all of us are held up by the same few things: people who check on us, rest, food, a bit of hope.</p><p class="lead">The steps around it are for sitting. Stay as long as you like and watch them fly.</p>`;}});}});
}

/* ---------- carts, bikes, small things ---------- */
function stampId(id){const p=PLACES.find(p=>p.id===id);if(p)stamp(p);}

/* =========================================================
   MINI TRAIN
   ========================================================= */
const TRACK={pts:[],cum:[],len:0};
function buildTrackPath(){const X=96,ZN=-96,ZS=92,r=10;const P=[];
  const line=(x1,z1,x2,z2)=>{const L=Math.hypot(x2-x1,z2-z1);const n=Math.max(1,Math.round(L/2));for(let i=0;i<n;i++){const t=i/n;P.push([x1+(x2-x1)*t,z1+(z2-z1)*t]);}};
  const arc=(cx,cz,a0,a1)=>{for(let i=0;i<10;i++){const a=a0+(a1-a0)*i/10;P.push([cx+Math.cos(a)*r,cz+Math.sin(a)*r]);}};
  line(-X+r,ZS,X-r,ZS);arc(X-r,ZS-r,Math.PI/2,0);line(X,ZS-r,X,ZN+r);arc(X-r,ZN+r,0,-Math.PI/2);line(X-r,ZN,-X+r,ZN);arc(-X+r,ZN+r,-Math.PI/2,-Math.PI);line(-X,ZN+r,-X,ZS-r);arc(-X+r,ZS-r,Math.PI,Math.PI/2);
  TRACK.pts=P;let c=0;TRACK.cum=[0];for(let i=1;i<=P.length;i++){const a=P[i-1],b=P[i%P.length];c+=Math.hypot(b[0]-a[0],b[1]-a[1]);TRACK.cum.push(c);}TRACK.len=c;}
function trackAt(s){const L=TRACK.len;s=((s%L)+L)%L;const C=TRACK.cum;let lo=0,hi=C.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(C[m]<=s)lo=m;else hi=m;}
  const a=TRACK.pts[lo],b=TRACK.pts[(lo+1)%TRACK.pts.length];const t=(s-C[lo])/((C[lo+1]-C[lo])||1);return{x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,h:Math.atan2(b[0]-a[0],b[1]-a[1])};}
function trackS(x,z){let best=0,bd=1e9;TRACK.pts.forEach((p,i)=>{const d=(p[0]-x)**2+(p[1]-z)**2;if(d<bd){bd=d;best=i;}});return TRACK.cum[best];}
function trackNormal(i){const n=TRACK.pts.length;const a=TRACK.pts[(i-1+n)%n],b=TRACK.pts[(i+1)%n];let dx=b[0]-a[0],dz=b[1]-a[1];const L=Math.hypot(dx,dz)||1;return[-dz/L,dx/L];}
const TRAIN={s:0,v:0,stop:0,next:0,cars:[],riding:false,hop:false,anchor:null};
const STATIONS=[{id:'st-gate',name:'City Gate',x:24,z:92},{id:'st-joy',name:'Joy Park',x:96,z:-30},{id:'st-sky',name:'Sky Port',x:40,z:-96},{id:'st-cul',name:'Creative Quarter',x:-96,z:-30}];
function trainCar(color,engine){const g=new THREE.Group();box(1.8,0.45,3.5,'#2b3442',0,0.5,0,g);
  for(const z of [-1.1,1.1])for(const x of [-0.92,0.92]){const w=cyl(0.3,0.3,0.14,'#1d2b44',x,0.3,z,g,12);w.rotation.z=Math.PI/2;}
  if(engine){const b=cyl(0.72,0.72,2.1,color,0,1.25,0.6,g,16);b.rotation.x=Math.PI/2;box(1.8,1.8,1.3,color,0,1.6,-1.0,g);box(2.0,0.15,1.6,'#1d2b44',0,2.55,-1.0,g);cyl(0.2,0.28,0.9,'#1d2b44',0,2.2,1.25,g,10);
    const hl=sph(0.17,'#ffffff',0,1.25,1.68,g,8,false);hl.material=LAMP_MAT;box(1.82,0.18,3.52,'#d9b45f',0,0.8,0,g,false);
    const wnd=box(1.3,0.6,0.05,'#bfe0ef',0,1.9,-0.34,g,false);wnd.material=WIN_MAT;}
  else{box(1.8,0.12,3.4,color,0,0.78,0,g);for(const sx of [-0.9,0.9])box(0.08,0.5,3.4,color,sx,1.05,0,g);for(const sz of [-1.7,1.7])box(1.8,0.5,0.08,color,0,1.05,sz,g);
    for(const sz of [-0.75,0.75]){box(1.5,0.12,0.5,'#f2efe8',0,1.02,sz,g);box(1.5,0.45,0.08,'#f2efe8',0,1.3,sz-0.25,g);}
    for(const sx of [-0.85,0.85])for(const sz of [-1.6,1.6])cyl(0.04,0.04,1.6,'#f2efe8',sx,1.85,sz,g,5,false);box(2.0,0.1,3.6,'#f2efe8',0,2.65,0,g);}
  return g;}
function buildTrain(){buildTrackPath();
  const bed=[],L=TRACK.len;TRACK.pts.forEach((p,i)=>bed.push(p));
  {const pos=[],idx=[];const n=TRACK.pts.length;for(let i=0;i<n;i++){const [nx,nz]=trackNormal(i);const p=TRACK.pts[i];pos.push(p[0]+nx*1.4,0.035,p[1]+nz*1.4,p[0]-nx*1.4,0.035,p[1]-nz*1.4);}
    for(let i=0;i<n;i++){const a=i*2,b=((i+1)%n)*2;idx.push(a,a+1,b,b,a+1,b+1);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:'#b8afa3',side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));m.receiveShadow=true;scene.add(m);}
  for(const d of [-0.55,0.55]){const pts=TRACK.pts.map((p,i)=>{const [nx,nz]=trackNormal(i);return new THREE.Vector3(p[0]+nx*d,0.17,p[1]+nz*d);});const c=new THREE.CatmullRomCurve3(pts,true);const tm=new THREE.Mesh(new THREE.TubeGeometry(c,TRACK.pts.length*2,0.06,5,true),M('#7d8590'));scene.add(tm);}
  const NS=Math.floor(L/1.1);const sl=new THREE.InstancedMesh(new THREE.BoxGeometry(1.7,0.1,0.32),new THREE.MeshLambertMaterial({color:'#7a5a44'}),NS);const d=new THREE.Object3D();
  for(let i=0;i<NS;i++){const p=trackAt(i*1.1);d.position.set(p.x,0.08,p.z);d.rotation.set(0,p.h,0);d.updateMatrix();sl.setMatrixAt(i,d.matrix);}scene.add(sl);
  /* stations */
  STATIONS.forEach((st,i)=>{const s=trackS(st.x,st.z);const idx=TRACK.cum.indexOf(s);const [nx,nz]=trackNormal(Math.max(0,idx));let ox=nx,oz=nz;if(ox*st.x+oz*st.z<0){ox=-ox;oz=-oz;}
    const p=trackAt(s);const g=grp(p.x+ox*2.6,p.z+oz*2.6,p.h);box(2.6,0.25,12,'#d8d2c8',0,0.12,0,g);for(const sz of [-6.6,6.6]){const r=box(2.6,0.1,1.4,'#d8d2c8',0,0.08,sz,g,false);r.rotation.x=sz>0?0.15:-0.15;}
    for(const sz of [-4,0,4])cyl(0.1,0.1,3.2,'#3f4f6b',0.9*(ox*0+1),1.6,sz,g,6);box(2.8,0.15,10,'#3f4f6b',0.4,3.25,0,g);
    const sg=sign(st.name,'Mini Train station','#2f6f73','#ffffff',3.4,1,g,0.4,4.1,0);sg.rotation.y=Math.PI/2;
    bench(p.x+ox*3.7-Math.sin(p.h)*3.2,p.z+oz*3.7-Math.cos(p.h)*3.2,Math.atan2(-ox,-oz));
    st.s=s+4.3;st.plat={x:p.x+ox*3.4,z:p.z+oz*3.4};st.face=Math.atan2(-ox,-oz);st.idx=i;
    SPOTS.push({label:'Board the Mini Train',sub:`${st.name} station · round the whole city`,color:'#2f6f73',tx:st.plat.x,tz:st.plat.z,tr:3.2,run:()=>boardTrain(i)});});
  const cols=['#2f6f73','#d97a68','#d9b45f','#6f8fc7'];for(let i=0;i<4;i++){const c=trainCar(cols[i],i===0);scene.add(c);TRAIN.cars.push(c);}
  const seat=new THREE.Object3D();seat.position.set(-0.4,0.33,0.75);TRAIN.cars[1].add(seat);TRAIN.anchor=seat;
  [[2,0.4,0.75],[2,-0.4,-0.75],[3,0.4,0.75],[1,0.4,-0.75]].forEach(([ci,x,z])=>{const p=makePerson({pack:false});sitPose(p);p.position.set(x,0.33,z);TRAIN.cars[ci].add(p);});
  TRAIN.s=STATIONS[0].s+20;TRAIN.next=1;
  updaters.push((dt)=>trainTick(dt));}
function trainTick(dt){const L=TRACK.len;const st=STATIONS[TRAIN.next];const ds=((st.s-TRAIN.s)%L+L)%L;
  if(TRAIN.stop>0){TRAIN.stop-=dt;TRAIN.v=0;if(TRAIN.stop<=0)TRAIN.next=(TRAIN.next+1)%STATIONS.length;}
  else{const vt=Math.min(9,Math.sqrt(2*1.3*ds)+0.5);TRAIN.v+=clamp(vt-TRAIN.v,-3*dt,1.6*dt);TRAIN.s+=TRAIN.v*dt;if(ds<0.25||ds>L-1){TRAIN.s=st.s;TRAIN.stop=5;trainArrive(st);}}
  TRAIN.cars.forEach((c,i)=>{const p=trackAt(TRAIN.s-i*4.3);c.position.set(p.x,0,p.z);c.rotation.y=p.h;});}
const _tv=new THREE.Vector3();
function boardTrain(i){const st=STATIONS[i];fadeTo(()=>{TRAIN.s=st.s;TRAIN.stop=4;TRAIN.next=i;TRAIN.riding=true;TRAIN.hop=false;trainTick(0.0001);
  openPanel({dock:true,title:'Mini Train',eyebrow:'All aboard',color:'#2f6f73',sub:'A slow loop around the whole city.',build:trainCard});
  startAction({lock:true,pose:POSE.sit,follow:()=>{TRAIN.anchor.getWorldPosition(_tv);player.x=_tv.x;player.y=_tv.y;player.z=_tv.z;player.rot=TRAIN.cars[1].rotation.y;},camOff:Math.PI+0.5,dist:10,pitch:0.32,exit:st.plat,onEnd:()=>{TRAIN.riding=false;}});
  stampId('train');award(10,'Mini Train ride','train');});}
function trainCard(b){b.innerHTML=`<p class="mindful" id="trNext"></p><p class="lead" id="trMsg">Look out at the city as it rolls past. No rush to get anywhere.</p><div class="row"><button class="btn" type="button" id="trHop" aria-pressed="false">Get off at the next stop</button><button class="btn primary" type="button" id="trNow">Get off here</button></div>`;
  const upd=()=>{const st=STATIONS[TRAIN.next];b.querySelector('#trNext').textContent=TRAIN.stop>0?`Stopped at ${st.name}`:`Next stop: ${st.name}`;b.querySelector('#trNow').disabled=!(TRAIN.stop>0);b.querySelector('#trHop').textContent=TRAIN.hop?'Getting off at the next stop':'Get off at the next stop';};upd();
  b.querySelector('#trHop').addEventListener('click',()=>{TRAIN.hop=!TRAIN.hop;upd();});b.querySelector('#trNow').addEventListener('click',()=>{if(TRAIN.stop>0){player.action.exit=STATIONS[TRAIN.next].plat;player.action.exitRot=STATIONS[TRAIN.next].face;closePanel();toast(`Welcome to ${STATIONS[TRAIN.next].name}`);}});
  const iv=setInterval(upd,400);return ()=>clearInterval(iv);}
function trainArrive(st){if(!TRAIN.riding)return;if(TRAIN.hop&&player.action){player.action.exit=st.plat;player.action.exitRot=st.face;closePanel();toast(`Welcome to ${st.name}`);}else toast(`${st.name} station`,1800);}

/* =========================================================
   JOY PARK (east)
   ========================================================= */
const RIDE={};
function rideCard(title,sub,msg,color){return {dock:true,title,eyebrow:'Joy Park',color,sub,build:b=>{b.innerHTML=`<p class="mindful">${msg}</p><div class="row"><button class="btn primary" type="button" id="rdEnd">Get off</button></div>`;b.querySelector('#rdEnd').addEventListener('click',closePanel);}};}
function rideStart(o){/* o: anchor, rot(fn|num), exit, exitRot, camOff, dist, pitch, title, sub, msg, color, onEnd, chase */
  openPanel(rideCard(o.title,o.sub,o.msg,o.color));
  startAction({lock:true,pose:o.pose||POSE.sit,keepCam:!!o.chase,camOff:o.camOff,dist:o.dist||10,pitch:o.pitch||0.3,exit:o.exit,exitRot:o.exitRot,onEnd:o.onEnd,
    follow:()=>{o.anchor.getWorldPosition(_tv);const px=player.x,pz=player.z;player.x=_tv.x;player.y=_tv.y;player.z=_tv.z;if(typeof o.rot==='function')player.rot=o.rot();else if(o.rot!==undefined)player.rot=o.rot;else{const dx=player.x-px,dz=player.z-pz;if(dx*dx+dz*dz>1e-5)player.rot=Math.atan2(dx,dz);}
      if(o.chase){cam.yaw=player.rot+Math.PI;}}});}

function buildEye(cx,cz){const g=grp(cx,cz,0);const H=19,R=16;
  for(const sx of [-3,3])for(const sz of [-8,8])bar(g,[sx,0,sz],[sx*0.5,H,0],0.32,'#e9edf2');
  const hub=new THREE.Group();hub.position.y=H;g.add(hub);const ax=cyl(0.5,0.5,6.4,'#c9ced6',0,0,0,hub,12);ax.rotation.z=Math.PI/2;
  const wheel=new THREE.Group();hub.add(wheel);
  for(const sx of [-1.3,1.3]){const t=new THREE.Mesh(new THREE.TorusGeometry(R,0.3,8,72),M('#f2efe8'));t.rotation.y=Math.PI/2;t.position.x=sx;t.castShadow=true;wheel.add(t);}
  const ic=document.createElement('canvas');ic.width=ic.height=512;const x=ic.getContext('2d');const gr=x.createRadialGradient(256,256,50,256,256,252);
  gr.addColorStop(0,'#1d2b44');gr.addColorStop(0.27,'#1d2b44');gr.addColorStop(0.29,'#3c8a8e');gr.addColorStop(0.55,'#6fb3a8');gr.addColorStop(0.82,'#2f6f8f');gr.addColorStop(0.97,'#24324a');gr.addColorStop(1,'rgba(36,50,74,0)');x.fillStyle=gr;x.beginPath();x.arc(256,256,252,0,TAU);x.fill();
  for(let i=0;i<110;i++){const a=i/110*TAU;x.strokeStyle=`rgba(255,255,255,${0.06+Math.random()*0.14})`;x.lineWidth=2;x.beginPath();x.moveTo(256+Math.cos(a)*78,256+Math.sin(a)*78);x.lineTo(256+Math.cos(a)*(200+Math.random()*40),256+Math.sin(a)*(200+Math.random()*40));x.stroke();}
  x.fillStyle='rgba(255,255,255,.92)';x.beginPath();x.arc(214,212,20,0,TAU);x.fill();
  const iris=new THREE.Mesh(new THREE.CircleGeometry(R*0.62,72),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(ic),transparent:true,side:THREE.DoubleSide}));iris.rotation.y=Math.PI/2;wheel.add(iris);
  for(let k=0;k<24;k++){const a=k/24*TAU;for(const sx of [-1.3,1.3])bar(wheel,[sx,0,0],[sx,Math.sin(a)*R,Math.cos(a)*R],0.07,'#c9ced6');}
  /* eyelid arcs */
  const lid=new THREE.Mesh(new THREE.TorusGeometry(R+2.2,0.45,8,60,Math.PI*0.62),M('#24324a'));lid.rotation.y=Math.PI/2;lid.rotation.x=Math.PI*0.19;lid.position.y=H;g.add(lid);
  for(let k=0;k<9;k++){const a=Math.PI*0.19+k/8*Math.PI*0.62;const y=H+Math.sin(a)*(R+2.2),z=Math.cos(a)*(R+2.2);const l=cyl(0.12,0.05,2.2,'#24324a',0,y+Math.sin(a)*1,z+Math.cos(a)*1,g,5,false);l.rotation.x=Math.PI/2-a;}
  const gcol=['#d97a68','#5fa58f','#d9b45f','#6f8fc7','#9a86c9','#d48aa6'];const gond=[];
  for(let k=0;k<12;k++){const a=k/12*TAU;const pv=new THREE.Group();pv.position.set(0,Math.sin(a)*R,Math.cos(a)*R);wheel.add(pv);const c=new THREE.Group();c.position.y=-1.5;pv.add(c);const col=gcol[k%gcol.length];
    cyl(0.05,0.05,1.5,'#9aa3ad',0,0.75,0,c,5,false);box(2.0,0.14,2.0,col,0,-0.9,0,c);box(2.2,0.14,2.2,col,0,0.75,0,c);for(const sx of [-0.95,0.95])for(const sz of [-0.95,0.95])cyl(0.04,0.04,1.6,'#f2efe8',sx,-0.1,sz,c,5,false);
    box(1.8,0.5,0.1,col,0,-0.6,0.95,c);box(1.8,0.5,0.1,col,0,-0.6,-0.95,c);box(0.5,0.14,1.6,'#f2efe8',0.55,-0.6,0,c);
    const an=new THREE.Object3D();an.position.set(0.55,-1.28,0);c.add(an);if(k%3===1){const p=makePerson({pack:false});sitPose(p);p.position.copy(an.position);p.rotation.y=-Math.PI/2;c.add(p);}
    gond.push({pv,c,an});}
  box(10,0.5,6,'#d8d2c8',0,0.25,0,g);for(const sx of [-5.6,5.6]){const r=box(1.6,0.1,6,'#d8d2c8',sx,0.18,0,g,false);r.rotation.z=sx>0?-0.25:0.25;}
  sign('Big Picture Wheel','see things from a little higher up','#24324a','#ffffff',5,1.4,g,0,2.2,3.6);
  addBox(cx,cz,5,3,0);
  const E=RIDE.eye={wheel,gond,w:TAU/80,riding:false,acc:0,top:false};
  updaters.push((dt)=>{wheel.rotation.x+=E.w*dt;gond.forEach(o=>o.pv.rotation.x=-wheel.rotation.x);if(E.riding){E.acc+=E.w*dt;if(!E.top&&E.acc>Math.PI){E.top=true;toast('Look how far you can see from up here.',3800);}if(E.acc>=TAU-0.05){E.riding=false;award(10,'Rode the Big Picture Wheel');done('eye');closePanel();}}});
  SPOTS.push({label:'Ride the Big Picture Wheel',sub:'One slow turn · about 80 seconds',color:'#5aa6c2',tx:cx,tz:cz+5.4,tr:7,run:()=>{
    fadeTo(()=>{let best=null,by=1e9;gond.forEach(o=>{o.c.getWorldPosition(_tv);if(_tv.y<by&&!o.c.children.some(ch=>ch.userData&&ch.userData.legs)){by=_tv.y;best=o;}});if(!best)best=gond[0];
      E.riding=true;E.acc=0;E.top=false;stampId('eye');rideStart({anchor:best.an,rot:-Math.PI/2,exit:{x:cx,z:cz+5.4},title:'Big Picture Wheel',sub:'One slow turn',msg:'Breathe out slowly as you rise. Try to spot the fountain, the lake and the kites.',color:'#5aa6c2',camOff:0.9,dist:14,pitch:0.2,onEnd:()=>{E.riding=false;}});});}});}

function buildCarousel(cx,cz){const g=grp(cx,cz,0);const plat=new THREE.Group();g.add(plat);cyl(7,7.2,0.5,'#f2efe8',0,0.25,0,plat,36);cyl(1.2,1.2,6,'#d9b45f',0,3,0,plat,16);
  cyl(8,8,0.6,'#f2efe8',0,6.3,0,g,36);cone(8.4,3,'#5fa58f',0,8.1,0,g,18);sph(0.6,'#d9b45f',0,9.8,0,g,10).material=LAMP_MAT;
  for(let i=0;i<24;i++){const a=i/24*TAU;const b=sph(0.12,'#fff',Math.cos(a)*8,6.0,Math.sin(a)*8,g,6,false);b.material=BULB_MAT;}
  const horses=[];const hc=['#f2efe8','#e6c9a8','#c9d9ea','#e9b9c8','#cfe3c2','#e0d4ef','#f3e3c3','#d6e2ea'];
  for(let i=0;i<8;i++){const a=i/8*TAU;const hg=new THREE.Group();hg.position.set(Math.cos(a)*5,0,Math.sin(a)*5);hg.rotation.y=-a;plat.add(hg);cyl(0.06,0.06,6,'#d9b45f',0,3.3,0,hg,6,false);
    const hb=new THREE.Group();hg.add(hb);const col=hc[i];const bd=sph(0.5,col,0,1.6,0,hb,10);bd.scale.set(0.75,0.75,1.5);box(0.3,0.55,0.35,col,0,2.05,0.62,hb);box(0.28,0.28,0.5,col,0,2.35,0.85,hb);
    for(const lx of [-0.18,0.18])for(const lz of [-0.45,0.45]){const l=box(0.1,0.6,0.1,col,lx,1.1,lz,hb,false);l.rotation.x=lz>0?-0.4:0.4;}box(0.5,0.08,0.6,'#c76b80',0,2.0,-0.05,hb);
    const an=new THREE.Object3D();an.position.set(0,1.32,-0.05);hb.add(an);if(i%3===0){const p=makePerson({pack:false});sitPose(p);p.position.copy(an.position);hb.add(p);}horses.push({hb,an,ph:a,busy:i%3===0});}
  sign('Pace Yourself','slow is still moving','#5fa58f','#ffffff',4.8,1.2,g,0,5.0,8.2);addCircle(cx,cz,7.4);
  const C=RIDE.carousel={t:0,riding:false};
  updaters.push((dt,t)=>{plat.rotation.y-=0.28*dt;horses.forEach(h=>h.hb.position.y=Math.sin(t*1.5+h.ph*2)*0.35);if(C.riding){C.t+=dt;if(C.t>40){C.riding=false;award(10,'Carousel ride');done('carousel');closePanel();}}});
  SPOTS.push({label:'Ride the carousel',sub:'Pace Yourself · gentle and slow',color:'#5fa58f',tx:cx,tz:cz,tr:12,run:()=>{fadeTo(()=>{C.t=0;C.riding=true;stampId('carousel');const h=horses.find(o=>!o.busy);rideStart({anchor:h.an,exit:{x:cx,z:cz+9},title:'Pace Yourself',sub:'About 40 seconds',msg:'You don\'t have to keep up with anyone. Slow is still moving forward.',color:'#5fa58f',camOff:0.5,dist:8,pitch:0.25,onEnd:()=>{C.riding=false;}});});}});}

function buildCoaster(){const CP=[[118,2.2,14],[134,2.2,14],[146,9,14],[154,19,17],[161,7,23],[168,3.4,31],[168,11,41],[157,15,46],[143,4.5,44],[131,9.5,40],[118,5,35],[110,3,26],[110,2.4,18]];
  const curve=new THREE.CatmullRomCurve3(CP.map(p=>new THREE.Vector3(p[0],p[1],p[2])),true,'centripetal');const N=420;const L=curve.getLength();const up=new THREE.Vector3(0,1,0);
  const lp=[],rp=[],sp=[];for(let i=0;i<N;i++){const u=i/N;const p=curve.getPointAt(u),t=curve.getTangentAt(u);const lat=new THREE.Vector3().crossVectors(t,up).normalize();lp.push(p.clone().addScaledVector(lat,0.55));rp.push(p.clone().addScaledVector(lat,-0.55));sp.push(p.clone().add(new THREE.Vector3(0,-0.35,0)));}
  [lp,rp].forEach(a=>scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(a,true),N,0.08,6,true),M('#c76b80'))));
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp,true),N,0.16,6,true),M('#e9edf2')));
  for(let i=0;i<N;i+=3){const u=i/N,p=curve.getPointAt(u),t=curve.getTangentAt(u);const m=box(1.3,0.08,0.22,'#7c6a58',p.x,p.y-0.05,p.z,null,false);m.lookAt(p.x+t.x,p.y+t.y,p.z+t.z);}
  for(let i=0;i<N;i+=9){const p=curve.getPointAt(i/N);if(p.y>1.6){cyl(0.12,0.16,p.y-0.4,'#e9edf2',p.x,(p.y-0.4)/2,p.z,null,6);addCircle(p.x,p.z,0.3);}}
  box(16,1.4,3,'#d8d2c8',126,0.7,11.4);const rmp=box(3,0.1,4,'#d8d2c8',116,0.7,11.4,null,false);rmp.rotation.z=0.35;box(16,0.15,3.6,'#c76b80',126,4,11.4);for(const x of [119,126,133])cyl(0.12,0.12,2.6,'#3f4f6b',x,2.7,10.2,null,6);
  const sg=sign('Ups & Downs','every low has a way back up','#c76b80','#ffffff',5,1.3,null,126,5.2,10.8);addBox(126,11.4,8,1.5,0);
  const car=new THREE.Group();scene.add(car);box(1.6,0.4,2.8,'#c76b80',0,0.2,0,car);for(const z of [-0.6,0.6]){box(1.4,0.3,0.5,'#1d2b44',0,0.55,z,car);box(1.4,0.5,0.1,'#1d2b44',0,0.85,z-0.25,car);}cone(0.8,0.6,'#d9b45f',0,0.3,1.6,car,8).rotation.x=Math.PI/2;
  const an=new THREE.Object3D();an.position.set(-0.35,-0.05,0.6);car.add(an);[[0.35,-0.6],[-0.35,-0.6]].forEach(([x,z])=>{const p=makePerson({pack:false});sitPose(p);p.position.set(x,-0.05,z);p.userData.arms.forEach(a=>a.rotation.z=a.position.x<0?-2.6:2.6);car.add(p);});
  const C=RIDE.coaster={u:0.02,riding:false,acc:0,car};
  updaters.push((dt)=>{const p=curve.getPointAt(C.u);let v=4+Math.sqrt(Math.max(0,2*9.8*(19.5-p.y)))*0.62;if(A11Y.rm)v*=0.6;const du=v*dt/L;C.u=(C.u+du)%1;if(C.riding){C.acc+=du;if(C.acc>=1){C.riding=false;award(15,'Rode Ups & Downs');done('coaster');closePanel();}}
    const q=curve.getPointAt(C.u),t=curve.getTangentAt(C.u);car.position.set(q.x,q.y+0.3,q.z);car.lookAt(q.x+t.x,q.y+0.3+t.y,q.z+t.z);});
  SPOTS.push({label:'Ride Ups & Downs',sub:'The roller coaster · about 40 seconds',color:'#c76b80',tx:126,tz:8.4,tr:7,run:()=>{fadeTo(()=>{C.u=0.02;C.acc=0;C.riding=true;stampId('coaster');
    rideStart({anchor:an,rot:()=>{const t=curve.getTangentAt(C.u);return Math.atan2(t.x,t.z);},chase:true,exit:{x:126,z:8.4},title:'Ups & Downs',sub:'Hold on',msg:'Some days climb slowly, some drop fast. Every low on this track leads back up.',color:'#c76b80',dist:7,pitch:0.22,onEnd:()=>{C.riding=false;}});});}});
  MAP_DECOR.push({x:139,z:30,r:12,c:'rgba(199,107,128,.25)'});}

const MAP_DECOR=[];
/* a children's-park swing set: sit, swing gently, breathe with it */
function buildSwingSet(cx,cz,ry){const g=grp(cx,cz,ry||0);const fr='#4fa3c7',W=9;
  flat(new THREE.PlaneGeometry(W+3,6.5),'#f0d9a8',0,0.03,0,3,g);
  for(const sx of [-W/2,W/2]){bar(g,[sx,0,-1.6],[sx,4.2,0],0.12,fr);bar(g,[sx,0,1.6],[sx,4.2,0],0.12,fr);}
  bar(g,[-W/2-0.2,4.2,0],[W/2+0.2,4.2,0],0.14,'#ff8f6b');
  const seats=[];const SC=['#ffd166','#7ad1a8','#ff9fc6'];
  [-2.8,0,2.8].forEach((x,i)=>{const pv=new THREE.Group();pv.position.set(x,4.1,0);g.add(pv);
    for(const sx of [-0.45,0.45]){const ch=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,3.1,5),M('#c9ced6'));ch.position.set(sx,-1.55,0);pv.add(ch);}
    box(1.1,0.1,0.5,SC[i],0,-3.12,0,pv);const an=new THREE.Object3D();an.position.set(0,-3.62,0.02);pv.add(an);seats.push({pv,an,ph:i*1.3,busy:i===2});
    if(i===2){const p=makePerson({pack:false});sitPose(p);p.position.copy(an.position);p.userData.arms.forEach(a=>a.rotation.x=-2.6);pv.add(p);}});
  sign('The Swings','as high as feels good','#ff8f6b','#ffffff',3.6,1,g,0,5.3,0);gBox(g,0,0,W/2+0.4,0.4);
  const S=RIDE.swingset={t:0,riding:false,seat:seats[1],amp:0};
  updaters.push((dt,t)=>{seats.forEach(q=>{if(q===S.seat&&S.riding){S.t+=dt;const target=Math.min(0.55,0.15+S.t*0.03)*(A11Y.rm?0.5:1);S.amp+=(target-S.amp)*Math.min(1,dt);q.pv.rotation.x=Math.sin(S.t*1.55)*S.amp;
      if(S.t>32&&!S.done){S.done=true;award(10,'A swing in the park');if(typeof done==='function')done('swingset');}}
    else if(q.busy)q.pv.rotation.x=Math.sin(t*1.55+q.ph)*0.38;else q.pv.rotation.x*=0.97;});});
  const f=L2W(g,0,3.6);
  SPOTS.push({label:'Sit on a swing',sub:'Swing gently for half a minute',color:'#ff8f6b',tx:cx,tz:cz,tr:7,run:()=>{fadeTo(()=>{S.t=0;S.amp=0;S.done=false;S.riding=true;stampId('swingset');
    rideStart({anchor:S.seat.an,rot:g.rotation.y,exit:f,exitRot:g.rotation.y,title:'The Swings',sub:'Swing as long as you like',msg:'Breathe in as you swing forward. Breathe out as you swing back. Let your feet hang.',color:'#ff8f6b',camOff:Math.PI/2+0.25,dist:7.5,pitch:0.18,onEnd:()=>{S.riding=false;}});});}});
  MAP_DECOR.push({x:cx,z:cz,r:6,c:'rgba(255,143,107,.22)'});}
function buildJoyPark(){
  flat(new THREE.CircleGeometry(9,40),'#ead9c2',118,0.03,-12,3);
  const pp=[[118,-12,124,-34],[118,-12,152,-42],[118,-12,129,-12],[118,-12,124,6],[124,6,140,6]];pp.forEach(p=>pathSeg(p[0],p[1],p[2],p[3],4,'#ead9c2'));
  gateArch(104,-12,Math.PI/2,'Joy Park','four gentle rides','#d48aa6');
  buildEye(156,-50);buildSwingSet(124,-44,0);buildCarousel(140,-13);buildCoaster();
  iceCreamCart(112,-26,Math.PI/2);bikeStand(108,0,Math.PI/2);
  for(const [x,z] of [[110,-20],[126,-20],[126,-4],[110,-4]]){lamp(x,z,'#d48aa6');}bunting(110,4.4,-20,126,4.4,-20,1);bunting(110,4.4,-4,126,4.4,-4,1);
  for(const [x,z,r] of [[132,-28,0.3],[114,-34,1.2],[160,-24,-1.4]])bench(x,z,r);
  for(let i=0;i<3;i++)pathWalker([{x:rr(110,124),z:rr(-18,-6)},{x:rr(130,160),z:rr(-36,-2)},{x:rr(112,140),z:rr(-36,6)}],rr(1.1,1.5));
  wheelchairUser([{x:112,z:-10},{x:150,z:-38}],1.0,"The big wheel has a step-free cabin. Best view in the city.");
  [[121,9.6],[125,9.7]].forEach(([x,z],i)=>staticNPC(x,z,-Math.PI/2,null,null,["First time on a coaster. Excited-nervous.","The queue is short today."][i]));
  edgeTrees(100,176,-70,48,40);
  MAP_DECOR.push({x:156,z:-50,r:5,c:'rgba(90,166,194,.35)'});}

/* =========================================================
   CULTURE QUARTER (west) exteriors + Policy Circle
   ========================================================= */
function bannerTex(t,c){const cv=document.createElement('canvas');cv.width=128;cv.height=384;const x=cv.getContext('2d');x.fillStyle=c;x.fillRect(0,0,128,384);x.fillStyle='#fff';x.font=`700 26px ${FD}`;x.save();x.translate(64,192);x.rotate(-Math.PI/2);x.textAlign='center';x.textBaseline='middle';x.fillText(t,0,0);x.restore();return new THREE.CanvasTexture(cv);}
const CQ={x:-140,z:-12,museum:{x:-146,z:-62},theatre:{x:-114,z:38},hall:{x:-112,z:-50},paint:{x:-140,z:24},dance:{x:-180,z:14}};
CQ.exit={museum:{x:-146,z:-47.5,rot:0},theatre:{x:-114,z:26,rot:Math.PI},hall:null};
function buildMuseumExt(){const M0=CQ.museum;const g=grp(M0.x,M0.z,0);box(27,0.6,18,'#d8d2c8',0,0.3,0,g);box(26,9,15,'#ece6dc',0,4.8,-1,g);
  const r=(16+1.4)/1.732,k=0.5;const ped=new THREE.Mesh(new THREE.CylinderGeometry(r,r,27,3,1,false,Math.PI/2),M('#e2dbcf'));ped.rotation.z=Math.PI/2;ped.scale.set(k,1,1);ped.position.set(0,9.3+0.5*r*k,-0.4);ped.castShadow=true;g.add(ped);
  box(26.4,0.8,1,'#e2dbcf',0,9.6,7.5,g);for(let i=0;i<8;i++)cyl(0.5,0.55,8.6,'#f4efe6',-10.5+i*3,4.9,8.0,g,14);
  sign('Mental Health Museum','history · people · science · India','#4a3a28','#f3e3c3',13,1.6,g,0,8.6,8.2);
  ['History','People','India','Science'].forEach((t,i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(1.4,4.2),new THREE.MeshLambertMaterial({map:bannerTex(t,['#6f8fc7','#9a86c9','#d2925c','#5fa58f'][i]),side:THREE.DoubleSide}));p.position.set(-9+i*6,5.2,7.3);g.add(p);});
  box(3.4,4.2,0.2,'#3a2f28',0,2.5,6.55,g);const rmp=box(4,0.1,3,'#d8d2c8',0,0.3,10.4,g,false);rmp.rotation.x=0.18;gBox(g,0,-1,13.2,8);
  for(const sx of [-11,11]){cyl(0.9,0.75,0.9,'#c9b79c',sx,0.95,10.2,g,12);sph(1,'#6aa86a',sx,2,10.2,g,9);}
  SPOTS.push({label:'Enter the Museum',sub:'Mental Health Museum · free entry',color:'#9a86c9',tx:M0.x,tz:M0.z+2,tr:17,run:()=>{stampId('museum');enterWorld(MUSEUM_W,{x:0,z:17},Math.PI,'Welcome to the Museum. Walk up to anything that catches your eye.');}});}
function posterTex(){const c=document.createElement('canvas');c.width=384;c.height=576;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,0,576);gr.addColorStop(0,'#24324a');gr.addColorStop(1,'#5aa6c2');x.fillStyle=gr;x.fillRect(0,0,384,576);
  x.fillStyle='#ffd98a';x.beginPath();x.arc(192,250,70,0,TAU);x.fill();x.fillStyle='#24324a';x.beginPath();x.arc(150,330,26,0,TAU);x.arc(234,330,26,0,TAU);x.fill();x.fillRect(128,350,44,90);x.fillRect(212,350,44,90);
  x.fillStyle='#fff';x.textAlign='center';x.font=`800 54px ${FD}`;x.fillText('Small',192,90);x.fillText('Steps',192,146);x.font=`500 20px ${FB}`;x.fillText('a short film about asking for help',192,510);return new THREE.CanvasTexture(c);}
function buildTheatreExt(){const T0=CQ.theatre;const g=grp(T0.x,T0.z,Math.PI);box(22,11,18,'#3f4f6b',0,5.5,-2,g);box(23,1.2,19,'#2b3442',0,11.4,-2,g);
  box(12,0.5,3.4,'#24324a',0,5.2,8.2,g);for(let i=0;i<20;i++){const b=sph(0.14,'#fff',-5.7+i*0.6,4.92,9.85,g,6,false);b.material=BULB_MAT;}
  sign('YMH Theatre','now showing · Small Steps','#c76b80','#ffffff',8,1.6,g,0,6.6,8.2);
  for(const sx of [-7,7]){const p=new THREE.Mesh(new THREE.PlaneGeometry(2.4,3.6),new THREE.MeshBasicMaterial({map:posterTex()}));p.position.set(sx,3.2,7.02);g.add(p);box(2.7,3.9,0.1,'#d9b45f',sx,3.2,6.98,g,false);}
  box(4,3.8,0.2,'#1d2026',0,2.1,7.05,g);gBox(g,0,-2,11,9);
  SPOTS.push({label:'Go to the theatre',sub:'Take a seat and watch Small Steps',color:'#c76b80',tx:T0.x,tz:T0.z-1,tr:15,run:()=>{stampId('theatre');enterWorld(THEATRE_W,{x:0,z:14},Math.PI,'Find a seat. The film starts when you sit down.');}});}
function buildHallExt(){const H0=CQ.hall;const ry=Math.atan2(CQ.x-H0.x,CQ.z-H0.z);const g=grp(H0.x,H0.z,ry);const cols=['#ff7a66','#9a86c9','#2fb08c','#ffc94a','#5aa6c2'];
  box(17,0.5,13,'#e6ded2',0,0.25,0,g);
  /* main hall: warm white walls, a full glass front */
  box(15,6.2,9,'#fbf4ea',0,3.35,-1.5,g);box(15.4,0.5,9.4,'#e9dccb',0,6.7,-1.5,g);
  for(let i=0;i<5;i++){const x=-6+i*3;const gl=box(2.7,4.6,0.12,'#bfe9ff',x,2.85,3.05,g,false);gl.material=WIN_MAT;}
  for(let i=0;i<6;i++)box(0.34,5.1,0.6,cols[i%5],-7.5+i*3,2.95,3.25,g);box(15.2,0.25,0.35,'#3f4f6b',0,5.3,3.1,g);
  /* festival canopy with stripes in the YMH colours */
  for(let i=0;i<10;i++)box(1.62,0.22,5,cols[i%5],-7.3+i*1.62,6.15,4.6,g);
  box(16.4,0.7,0.5,'#24324a',0,6.25,7.15,g);
  for(const sx of [-7.6,7.6])cyl(0.16,0.16,6,'#f2efe8',sx,3.1,6.9,g,8);
  sign('YMH Week 2027','Youth Mental Health Week · coming soon','#24324a','#ffe7a8',9.6,1.4,g,0,7.45,7.1);
  for(let i=0;i<22;i++){const b=sph(0.13,'#fff',-7.6+i*0.72,5.75+Math.sin(i/21*Math.PI)*-0.35,7.1,g,6,false);b.material=BULB_MAT;}
  /* four tall flags line the way in */
  ['Speak','Listen','Belong','Thrive'].forEach((wd,i)=>{const sx=i<2?-1:1;const z=9.5+(i%2)*3.2;const x=sx*4.2;cyl(0.07,0.07,6,'#c9ced6',x,3,z,g,6);
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.2,3.4),new THREE.MeshLambertMaterial({map:bannerTex(wd,cols[i]),side:THREE.DoubleSide}));fl.position.set(x-sx*0.68,4.2,z);g.add(fl);gCircle(g,x,z,0.3);
    updaters.push((dt,t)=>{fl.rotation.y=Math.sin(t*1.3+i)*0.15;});});
  for(const sx of [-6,6]){cyl(0.8,0.65,0.8,'#d9734e',sx,0.9,8,g,12);sph(0.9,'#5dbb63',sx,1.8,8,g,8);}
  box(3,3.6,0.2,'#24324a',0,1.8,3.2,g,false);
  gBox(g,0,-1.5,7.6,4.8);
  const ex=L2W(g,0,8.8);CQ.exit.hall={x:ex.x,z:ex.z,rot:ry};
  SPOTS.push({label:'Step into YMH Week 2027',sub:'Coming soon · see last year\'s highlights',color:'#9a86c9',tx:H0.x,tz:H0.z,tr:13,run:()=>{stampId('ymhweek');enterWorld(HALL_W,{x:0,z:10},Math.PI,'Youth Mental Health Week 2027 is coming soon.');}});}
function buildPolicyCircle(cx,cz){const g=grp(cx,cz,0);flat(new THREE.CircleGeometry(14,56),'#ddd5c8',0,0.03,0,3,g);flat(new THREE.RingGeometry(5.4,5.8,56),'#c9bfae',0,0.035,0,4,g);
  cyl(1.2,1.4,0.9,'#7c6a58',0,0.45,0,g,16);cyl(0.05,0.05,1.2,'#24324a',0.3,1.5,0,g,5,false);sph(0.12,'#24324a',0.3,2.15,0,g,8,false);addCircle(cx,cz,1.5);
  
  const PA=[[14,0],[-6,-14],[0,14],[10,-10],[10,10],[-13,-5],[-13,6]].map(q=>Math.atan2(q[1],q[0]));for(let i=0;i<12;i++){const a=i/12*TAU+0.26;if(PA.some(v=>Math.abs(Math.atan2(Math.sin(a-v),Math.cos(a-v)))<0.32))continue;const x=Math.cos(a)*12,z=Math.sin(a)*12;bench(cx+x,cz+z,Math.atan2(-x,-z));}
  POLICIES.forEach((p,i)=>{const a=-Math.PI*0.86+i*(Math.PI*1.72/(POLICIES.length-1));const x=Math.cos(a)*8.6,z=Math.sin(a)*8.6;const bg=grp(cx+x,cz+z,Math.atan2(-x,-z));
    box(0.15,2.4,0.15,'#3f4f6b',-1,1.2,-0.1,bg);box(0.15,2.4,0.15,'#3f4f6b',1,1.2,-0.1,bg);
    const c=document.createElement('canvas');c.width=512;c.height=400;const tx=c.getContext('2d');tx.fillStyle='#fffdf8';tx.fillRect(0,0,512,400);tx.fillStyle=p.color;tx.fillRect(0,0,512,70);tx.fillStyle='#fff';tx.font=`700 34px ${FB}`;tx.fillText(p.year,24,47);
    tx.fillStyle='#1d2b44';tx.font=`800 40px ${FD}`;wrapLines(tx,p.name,460).forEach((l,k)=>tx.fillText(l,24,130+k*46));tx.font=`500 22px ${FB}`;tx.fillStyle='#4e5f7a';wrapLines(tx,p.what[0],460).slice(0,4).forEach((l,k)=>tx.fillText(l,24,250+k*30));tx.font=`500 15px ${FB}`;tx.fillStyle='#8592a6';tx.fillText('Walk up to read more and share your view',24,384);
    const bd=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.0,0.12),[M('#fff'),M('#fff'),M('#fff'),M('#fff'),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}),M('#e9e4da')]);bd.position.set(0,2.2,0);bd.castShadow=true;bg.add(bd);
    const f=L2W(bg,0,1.6);SPOTS.push({label:`Read: ${p.name}`,sub:`${p.year} · share your ideas`,color:p.color,tx:f.x,tz:f.z,tr:1.6,run:()=>openPolicy(p)});});
  for(let i=0;i<4;i++){const a=i/4*TAU+0.4;const p=staticNPC(cx+Math.cos(a)*3.4,cz+Math.sin(a)*3.4,Math.atan2(-Math.cos(a),-Math.sin(a)),null,(dt,t)=>{idleAnim(p,t);p.userData.arms[1].rotation.x=-0.6+Math.max(0,Math.sin(t*1.3+i*2))*-0.6;},["Colleges should publish their counsellor-to-student ratio.","I think every hostel needs a peer support group.","The 2017 Act says care is a right. Let's make it real on campus.","More regional-language support, please."][i]);}
  wheelchairUser([{x:cx+6,z:cz+5},{x:cx+6,z:cz-5}],0.8,"Policy is more than paper. It's what reaches us.");}
function openPolicy(p){stampId('policy');done('policy');openPanel({dock:false,title:p.name,eyebrow:`Policy Circle · ${p.year}`,color:p.color,sub:'What it does, why it matters for students, and your ideas.',build:b=>{
  b.innerHTML=`<ul class="ticks">${p.what.map(w=>`<li>${esc(w)}</li>`).join('')}</ul><h3 class="h3">Why it matters for students</h3><p class="lead">${esc(p.students)}</p>
  <h3 class="h3">Your suggestion</h3><label class="lbl" for="plS" style="margin-top:0">What would make this work better for young people?</label><textarea id="plS" rows="3" maxlength="400" placeholder="For example: every college should have a counsellor available after 6 pm."></textarea>
  <p class="err" id="plE" hidden></p><div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="plGo">Share my suggestion</button><button class="btn ghost" type="button" id="plL">Listen</button></div>
  <h3 class="h3">Ideas from others</h3><ul class="notes" id="plList"><li class="empty" style="display:block">Loading ideas…</li></ul><p class="src">A short summary for learning, not legal advice. The official text of the law has the full details.</p>`;
  const list=b.querySelector('#plList');
  async function load(){const all=await dbAll('policy');let items=(all||[]).filter(x=>x.act===p.id);store.get('policyLocal',[]).filter(x=>x.act===p.id).forEach(x=>{if(!items.some(y=>y.t===x.t&&y.text===x.text))items.push(x);});items.sort((a,b)=>b.t-a.t);
    list.innerHTML=items.length?items.slice(0,25).map(x=>`<li><i style="background:${p.color}"></i><span>${esc(x.text)}</span></li>`).join(''):'<li class="empty" style="display:block">No ideas yet. Yours can be the first.</li>';}
  load();
  b.querySelector('#plL').addEventListener('click',()=>speak(`${p.name}, ${p.year}. ${p.what.join(' ')} Why it matters for students: ${p.students}`,true));
  b.querySelector('#plGo').addEventListener('click',async()=>{const ta=b.querySelector('#plS');const v=ta.value.trim();const er=b.querySelector('#plE');if(v.length<8){er.textContent='Write a little more so others understand your idea.';er.hidden=false;return;}er.hidden=true;
    const item={act:p.id,text:v,t:Date.now()};let shared=true;try{await dbAppend('policy',item,40);}catch(e){shared=false;localAppend('policyLocal',item);}
    ta.value='';award(15,'Shared a policy idea','policy-'+p.id);toast(shared?'Thank you. Your idea is now on the Policy Circle board for others to see.':'Thank you. Your idea is saved on this device.');load();});}});}
function buildCulture(){const C=CQ;flat(new THREE.CircleGeometry(15,56),'#e4d8c4',C.x,0.028,C.z,3);
  [[-104,-12,-126,-12],[-146,-26,-146,-49],[-140,2,-140,15],[-130,-22,-117,-42],[-130,-2,-114,28],[-153,-17,-172,-31],[-153,-6,-172,9]].forEach(p=>pathSeg(p[0],p[1],p[2],p[3],4,'#e4d8c4'));
  gateArch(-104,-12,Math.PI/2,'Creative Quarter','art · stories · ideas','#9a86c9');
  buildMuseumExt();buildTheatreExt();buildHallExt();buildPolicyCircle(C.x,C.z);buildDance(C.dance.x,C.dance.z,Math.atan2(C.x-C.dance.x,C.z-C.dance.z));
  bikeStand(-112,4,-Math.PI/2);for(const [x,z] of [[-122,-24],[-158,-24],[-122,0],[-158,0]])lamp(x,z,'#9a86c9');
  bench(-124,-30,0.5);bench(-156,6,Math.PI-0.5);
  for(let i=0;i<3;i++)pathWalker([{x:rr(-150,-130),z:rr(-26,-20)},{x:rr(-150,-120),z:rr(-40,-30)},{x:rr(-165,-115),z:rr(4,14)}],rr(1.1,1.4));
  wheelchairUser([{x:-124,z:-12},{x:-146,z:-40}],1.0,"Every building here has a ramp. The museum is my favourite.");
  edgeTrees(-203,-100,-78,56,34);}

/* =========================================================
   MUSIC PAVILION: calm radio stations made in the browser
   (no uploads) + the sound mixer
   ========================================================= */
const RADIO={st:null,g:null,iv:null,step:0,next:0,listen:0,level:0,counted:false};
const RSTATIONS=[
 {id:'lofi',name:'Lo-fi Loft',desc:'Soft beats and slow keys. Good for reading.'},
 {id:'tanpura',name:'Tanpura Evening',desc:'A warm drone with a slow, wandering melody.'},
 {id:'rain',name:'Rain on the Window',desc:'Gentle rain and a low hum.'},
 {id:'garden',name:'Morning Garden',desc:'Birdsong, a breeze and the odd chime.'}];
const mtof=m=>440*Math.pow(2,(m-69)/12);
function radioInit(){if(RADIO.g||!audioInit())return !!RADIO.g;const c=AUD.ctx;RADIO.g=c.createGain();RADIO.g.gain.value=0;RADIO.g.connect(AUD.master);
  const nb=c.createBuffer(1,c.sampleRate,c.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;RADIO.nb=nb;return true;}
function rtone(t,m,dur,vol,type,att){const c=AUD.ctx;const o=c.createOscillator();o.type=type||'sine';o.frequency.value=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(att||0.02));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(RADIO.g);o.start(t);o.stop(t+dur+0.05);return o;}
function radioPlay(id){if(!radioInit())return false;const c=AUD.ctx;if(c.state!=='running')c.resume();radioStop(true);RADIO.st=RSTATIONS.find(s=>s.id===id);RADIO.step=0;RADIO.next=c.currentTime+0.1;
  RADIO.g.gain.setTargetAtTime(0.75,c.currentTime,0.6);if(AUD.L.pad&&AUD.L.pad.on)setLayer('pad',false);
  if(id==='rain')setLayer('rain',true,0.5);if(id==='garden'){setLayer('birds',true,0.55);setLayer('chimes',true,0.35);}
  RADIO.iv=setInterval(radioTick,90);if(typeof track==='function')track('radio',{id});return true;}
function radioStop(keep){clearInterval(RADIO.iv);RADIO.iv=null;if(RADIO.g&&AUD.ctx)RADIO.g.gain.setTargetAtTime(0,AUD.ctx.currentTime,0.3);if(RADIO.drone){try{RADIO.drone.forEach(o=>o.stop(AUD.ctx.currentTime+1));}catch(e){}RADIO.drone=null;}if(!keep)RADIO.st=null;}
function radioTick(){const c=AUD.ctx;if(!c||!RADIO.st)return;const id=RADIO.st.id;
  if(id==='tanpura'&&!RADIO.drone){const base=48;RADIO.drone=[base,base+7,base+12,base-12].map((m,i)=>{const o=c.createOscillator();o.type=i===3?'sine':'triangle';o.frequency.value=mtof(m)*(1+(i-1.5)*0.0015);const g=c.createGain();g.gain.value=[0.05,0.035,0.03,0.05][i];const lfo=c.createOscillator();lfo.frequency.value=0.15+i*0.07;const lg=c.createGain();lg.gain.value=0.015;lfo.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(RADIO.g);o.start();lfo.start();return o;});}
  if(id==='rain'&&!RADIO.drone){RADIO.drone=[48,55].map(m=>{const o=c.createOscillator();o.frequency.value=mtof(m);const g=c.createGain();g.gain.value=0.03;o.connect(g);g.connect(RADIO.g);o.start();return o;});}
  while(RADIO.next<c.currentTime+0.3){const t=RADIO.next,s=RADIO.step;
    if(id==='lofi'){const spb=60/72/2;const bar=Math.floor(s/8)%4;const CH=[[57,60,64,67],[53,57,60,64],[55,59,62,65],[52,55,59,62]][bar];
      if(s%8===0){CH.forEach((m,i)=>rtone(t+i*0.03,m,spb*7,0.035,'triangle',0.05));rtone(t,CH[0]-24,spb*3,0.09,'sine',0.02);}
      if(s%8===4)rtone(t,CH[0]-24,spb*2,0.07,'sine',0.02);
      if(s%4===0){const o=c.createOscillator();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(45,t+0.18);const g=c.createGain();g.gain.setValueAtTime(0.18,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.22);o.connect(g);g.connect(RADIO.g);o.start(t);o.stop(t+0.25);}
      if(s%8===4){const n=c.createBufferSource();n.buffer=RADIO.nb;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;const g=c.createGain();g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.12);n.connect(f);f.connect(g);g.connect(RADIO.g);n.start(t,Math.random()*0.5);n.stop(t+0.15);}
      if(s%2===0&&Math.random()<0.35)rtone(t,pick([72,74,76,79,81]),spb*3,0.03,'sine',0.01);
      RADIO.next+=spb;}
    else if(id==='tanpura'){if(Math.random()<0.45){rtone(t,pick([60,62,64,67,69,72]),rr(1.4,2.6),0.04,'sine',0.25);}if(s%6===0)rtone(t,48,1.2,0.03,'triangle',0.005);RADIO.next+=0.85;}
    else if(id==='rain'){if(Math.random()<0.2)rtone(t,pick([64,67,71,72]),3,0.025,'sine',0.4);RADIO.next+=1.2;}
    else{if(Math.random()<0.3)rtone(t,pick([76,79,83,84,88]),1.4,0.02,'sine',0.01);RADIO.next+=0.9;}
    RADIO.step++;}}
function radioPanel(dock){radioInit();openPanel({dock:!!dock,title:'What do you feel like hearing?',eyebrow:'Music Pavilion',color:'#1fa98a',sub:'Pick a station, or make your own mix of sounds.',build:b=>{
  b.innerHTML=`<div class="stations" id="rS"></div><p class="radio-now" id="rNow" aria-live="polite"></p><div class="row"><button class="btn" type="button" id="rOff">Stop the music</button>${dock?'<button class="btn primary" type="button" id="rUp">Stand up</button>':''}</div>
  <h3 class="h3">Your own mix</h3><p class="meta" style="margin-top:-4px">Background sounds that keep playing while you walk around.</p><div class="mixer" id="rMix"></div>`;
  const now=b.querySelector('#rNow');const sts=b.querySelector('#rS');
  const draw=()=>{sts.innerHTML='';RSTATIONS.forEach(s=>{const x=document.createElement('button');x.type='button';x.className='station';x.setAttribute('aria-pressed',String(!!(RADIO.st&&RADIO.st.id===s.id)));x.innerHTML=`<b>${esc(s.name)}</b><span>${esc(s.desc)}</span>`;x.addEventListener('click',()=>{radioPlay(s.id);draw();});sts.appendChild(x);});now.textContent=RADIO.st?`Now playing: ${RADIO.st.name}. It keeps playing if you walk away.`:'Nothing playing yet.';};
  draw();b.querySelector('#rOff').addEventListener('click',()=>{radioStop();draw();});if(dock)b.querySelector('#rUp').addEventListener('click',closePanel);
  const mix=b.querySelector('#rMix');const render=()=>{mix.innerHTML='';if(!audioInit()){mix.innerHTML='<p class="meta">Sound isn\'t available in this browser.</p>';return;}LAYERS.forEach(l=>{const st=AUD.L[l.id];const row=document.createElement('div');row.className='track';row.innerHTML=`<button class="toggle" type="button" aria-pressed="${st.on}" aria-label="${l.name}"></button><div><b>${l.name}</b><span>${l.desc}</span></div><input type="range" min="0" max="1" step="0.05" value="${st.vol}" aria-label="${l.name} volume">`;
    row.querySelector('.toggle').addEventListener('click',()=>{setLayer(l.id,!AUD.L[l.id].on);render();});row.querySelector('input').addEventListener('input',e=>setLayer(l.id,undefined,parseFloat(e.target.value)));mix.appendChild(row);});};render();}});}
function buildRadio(){const z=Z.sound;const g=z.g;const t=grp(3.6,1.4,0,g);t.position.y=0.45;cyl(0.5,0.5,0.08,'#c98b55',0,0.8,0,t,14);cyl(0.06,0.06,0.8,'#7a5236',0,0.4,0,t,6);
  const bx=grp(0,0,-0.4,t);bx.position.y=0.84;box(1.0,0.5,0.3,'#24324a',0,0.25,0,bx);box(0.8,0.04,0.04,'#c9ced6',0,0.55,0,bx);
  const spk=[];for(const sx of [-0.3,0.3]){const s=cyl(0.15,0.15,0.04,'#5aa6c2',sx,0.25,0.16,bx,14);s.rotation.x=Math.PI/2;s.material=new THREE.MeshStandardMaterial({color:'#5aa6c2',emissive:'#5aa6c2',emissiveIntensity:0.2});spk.push(s);}
  const rp=box(2.6,0.1,2.8,'#e9e1d2',-4.6,0.22,4.2,g,false);rp.rotation.set(0.16,0,0);rp.rotation.y=0.6;
  TICKS.push((dt,t)=>{const on=!!(RADIO.st&&AUD.ctx&&AUD.ctx.state==='running');if(on){RADIO.listen+=dt;if(RADIO.listen>45&&!RADIO.counted){RADIO.counted=true;award(10,'Listened for a while','music45');done('music');}}
    RADIO.level+=((on?0.45+Math.sin(t*6)*0.25:0)-RADIO.level)*0.2;spk.forEach(s=>{s.scale.set(1+RADIO.level*0.5,1,1+RADIO.level*0.5);s.material.emissiveIntensity=0.2+RADIO.level*1.2;});});}
