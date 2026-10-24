'use strict';
/* =========================================================
   V8 (part A): cuter buildings, nicer labels, landing text,
   collisions, auto routes, music pavilion, art garden.
   Loaded after v7.js, before start.js.
   ========================================================= */

/* ---------- landing ---------- */
$('controlsText').innerHTML=COARSE?
 '<ul class="how-list"><li><b>Walk</b> with the joystick, or tap the ground</li><li><b>Look around</b> by dragging</li><li><b>Tap the button</b> that pops up near places and people</li><li>Your <b>next step</b> is always in the top-left corner</li></ul>':
 '<ul class="how-list"><li><b>Walk</b> with WASD or the arrow keys</li><li><b>Hold Shift</b> to go faster</li><li><b>Drag</b> or <b>swipe with two fingers</b> to look around, <b>pinch</b> or <b>scroll</b> to zoom</li><li><b>Press E</b> to step into a place or start something</li><li>Your <b>next step</b> is always in the top-left corner</li></ul>';

/* ---------- labels: a little icon, a soft shadow, a pointer ---------- */
const ICONS={cup:['Café','Mood','Coconut','Ice Cream','Lemonade','chai'],mail:['Kindness','Post','letter'],heart:['Talk','Kiran'],book:['Study','Library','Museum','read'],bubble:['Thought','Arcade','balloon'],leaf:['Breathing','Stretch','Garden','Lawn','Nap'],wave:['Lake','Worry','Fountain','Beach','skip','Skip'],note:['Music','Dance','Radio'],star:['Wheel','Carousel','Swings','Ups','Pace','Joy','coaster'],brush:['Paint','Art','Creative'],film:['Theatre','YMH Week'],plane:['Sky Port','flight','Hot air'],kite:['Kite'],scale:['Policy']};
function iconFor(text){for(const k in ICONS)if(ICONS[k].some(w=>text.indexOf(w)>=0))return k;return null;}
function drawIcon(x,k,cx,cy,r){x.save();x.translate(cx,cy);x.strokeStyle='#fff';x.fillStyle='#fff';x.lineWidth=r*0.16;x.lineCap='round';x.lineJoin='round';const s=r;
  if(k==='cup'){x.beginPath();x.moveTo(-s*.45,-s*.25);x.lineTo(-s*.35,s*.45);x.lineTo(s*.3,s*.45);x.lineTo(s*.4,-s*.25);x.closePath();x.fill();x.beginPath();x.arc(s*.48,s*.08,s*.17,-1.4,1.4);x.stroke();x.beginPath();x.moveTo(-s*.1,-s*.45);x.quadraticCurveTo(0,-s*.6,-s*.05,-s*.75);x.stroke();}
  else if(k==='mail'){x.strokeRect(-s*.5,-s*.32,s,s*.64);x.beginPath();x.moveTo(-s*.5,-s*.32);x.lineTo(0,s*.08);x.lineTo(s*.5,-s*.32);x.stroke();}
  else if(k==='heart'){x.beginPath();x.moveTo(0,s*.45);x.bezierCurveTo(-s*.7,0,-s*.45,-s*.55,0,-s*.18);x.bezierCurveTo(s*.45,-s*.55,s*.7,0,0,s*.45);x.fill();}
  else if(k==='book'){x.beginPath();x.moveTo(0,-s*.3);x.quadraticCurveTo(-s*.3,-s*.45,-s*.55,-s*.35);x.lineTo(-s*.55,s*.4);x.quadraticCurveTo(-s*.3,s*.3,0,s*.45);x.quadraticCurveTo(s*.3,s*.3,s*.55,s*.4);x.lineTo(s*.55,-s*.35);x.quadraticCurveTo(s*.3,-s*.45,0,-s*.3);x.lineTo(0,s*.45);x.stroke();}
  else if(k==='bubble'){x.beginPath();x.arc(-s*.12,-s*.05,s*.38,0,TAU);x.stroke();x.beginPath();x.arc(s*.35,s*.32,s*.15,0,TAU);x.stroke();}
  else if(k==='leaf'){x.beginPath();x.moveTo(-s*.45,s*.45);x.quadraticCurveTo(-s*.5,-s*.45,s*.45,-s*.45);x.quadraticCurveTo(s*.45,s*.4,-s*.45,s*.45);x.fill();}
  else if(k==='wave'){x.beginPath();for(let i=0;i<2;i++){const y=-s*.12+i*s*.32;x.moveTo(-s*.55,y);x.quadraticCurveTo(-s*.28,y-s*.25,0,y);x.quadraticCurveTo(s*.28,y+s*.25,s*.55,y);}x.stroke();}
  else if(k==='note'){x.beginPath();x.ellipse(-s*.22,s*.32,s*.2,s*.15,-0.4,0,TAU);x.fill();x.fillRect(-s*.07,-s*.5,s*.12,s*.85);x.beginPath();x.moveTo(-s*.02,-s*.5);x.quadraticCurveTo(s*.35,-s*.35,s*.35,-s*.05);x.stroke();}
  else if(k==='star'){x.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-Math.PI/2,rr_=i%2?s*.24:s*.55;x.lineTo(Math.cos(a)*rr_,Math.sin(a)*rr_);}x.closePath();x.fill();}
  else if(k==='brush'){x.rotate(-0.7);x.fillRect(-s*.08,-s*.6,s*.16,s*.65);x.beginPath();x.ellipse(0,s*.18,s*.16,s*.26,0,0,TAU);x.fill();}
  else if(k==='film'){x.strokeRect(-s*.5,-s*.35,s,s*.7);x.beginPath();x.moveTo(-s*.12,-s*.18);x.lineTo(s*.22,0);x.lineTo(-s*.12,s*.18);x.closePath();x.fill();}
  else if(k==='plane'){x.rotate(-0.6);x.beginPath();x.moveTo(0,-s*.6);x.lineTo(s*.1,-s*.1);x.lineTo(s*.55,s*.1);x.lineTo(s*.1,s*.05);x.lineTo(s*.08,s*.4);x.lineTo(s*.22,s*.52);x.lineTo(0,s*.46);x.lineTo(-s*.22,s*.52);x.lineTo(-s*.08,s*.4);x.lineTo(-s*.1,s*.05);x.lineTo(-s*.55,s*.1);x.lineTo(-s*.1,-s*.1);x.closePath();x.fill();}
  else if(k==='kite'){x.beginPath();x.moveTo(0,-s*.55);x.lineTo(s*.38,0);x.lineTo(0,s*.55);x.lineTo(-s*.38,0);x.closePath();x.fill();}
  else if(k==='scale'){x.beginPath();x.moveTo(0,-s*.5);x.lineTo(0,s*.45);x.moveTo(-s*.45,-s*.3);x.lineTo(s*.45,-s*.3);x.moveTo(-s*.3,s*.45);x.lineTo(s*.3,s*.45);x.stroke();x.beginPath();x.arc(-s*.45,-s*.05,s*.16,0,Math.PI);x.arc(s*.45,-s*.05,s*.16,0,Math.PI);x.fill();}
  x.restore();}
pillCanvas=function(text,dot,o){o=o||{};const fs=o.fs||60;const c=document.createElement('canvas');const x=c.getContext('2d');x.font=`700 ${fs}px ${FD}`;const tw=x.measureText(text).width;
  const ic=dot&&!o.plain?iconFor(text):null;const H=Math.round(fs*1.85),pad=fs*0.62,dw=dot?(ic?fs*1.25:fs*0.75):0;const tail=o.tail===false||!dot?0:fs*0.42;const sh=fs*0.18;
  c.width=Math.ceil(tw+pad*2+dw+sh);c.height=H+tail+sh;
  if(!o.bg){x.fillStyle='rgba(29,43,68,.16)';rrect(x,4+sh*0.5,4+sh,c.width-8-sh,H-8,(H-8)/2);x.fill();}
  x.fillStyle=o.bg||'#ffffff';rrect(x,4,4,c.width-8-sh,H-8,(H-8)/2);x.fill();
  if(tail){x.beginPath();x.moveTo((c.width-sh)/2-tail*0.7,H-6);x.lineTo((c.width-sh)/2,H-6+tail);x.lineTo((c.width-sh)/2+tail*0.7,H-6);x.closePath();x.fill();}
  if(dot&&!o.bg){x.strokeStyle=dot;x.lineWidth=fs*0.09;rrect(x,4+fs*0.05,4+fs*0.05,c.width-8-sh-fs*0.1,H-8-fs*0.1,(H-8)/2);x.stroke();}
  if(dot){const r=ic?fs*0.5:fs*0.24;const cx=pad*0.55+r,cy=(H)/2;x.fillStyle=dot;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();if(ic)drawIcon(x,ic,cx,cy,r);}
  x.font=`700 ${fs}px ${FD}`;x.fillStyle=o.fg||'#1d2b44';x.textBaseline='middle';x.fillText(text,pad+dw+(ic?fs*0.12:0),H/2+fs*0.07);return c;};
pillSprite=function(text,dot,h,o){const c=pillCanvas(text,dot,o);const m=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,fog:false});m.map.anisotropy=4;const s=new THREE.Sprite(m);const hh=(h||1.6)*c.height/(Math.round((o&&o.fs||60)*1.85));s.scale.set(hh*c.width/c.height,hh,1);s.center.set(0.5,0.12);s.renderOrder=5;return s;};

/* ---------- building signs: framed boards with a ribbon edge ---------- */
signTex=function(title,sub,bg,fg,w,h){const W=1024,H=Math.max(64,Math.round(W*h/w));const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,H);const b=new THREE.Color(bg);const l='#'+b.clone().lerp(new THREE.Color('#ffffff'),0.14).getHexString(),d='#'+b.clone().lerp(new THREE.Color('#000000'),0.12).getHexString();g.addColorStop(0,l);g.addColorStop(1,d);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=Math.max(4,H*0.04);rrect(x,H*0.08,H*0.08,W-H*0.16,H-H*0.16,H*0.16);x.stroke();
  x.setLineDash([H*0.05,H*0.05]);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=Math.max(2,H*0.015);rrect(x,H*0.15,H*0.15,W-H*0.3,H-H*0.3,H*0.1);x.stroke();x.setLineDash([]);
  x.fillStyle='rgba(255,255,255,.9)';for(const cx of [H*0.2,W-H*0.2]){x.beginPath();x.arc(cx,H/2,H*0.035,0,TAU);x.fill();}
  x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.shadowColor='rgba(0,0,0,.18)';x.shadowOffsetY=H*0.02;
  fitFont(x,title,800,sub?H*0.44:H*0.56,FD,W*0.78);x.fillText(title,W/2,sub?H*0.43:H*0.54);x.shadowColor='transparent';
  if(sub){fitFont(x,sub,500,H*0.15,FB,W*0.72);x.globalAlpha=.9;x.fillText(sub,W/2,H*0.74);x.globalAlpha=1;}
  const t=new THREE.CanvasTexture(c);t.anisotropy=8;return t;};

/* ---------- cuter houses ---------- */
{const _h=house;house=function(g,o){const fz=_h(g,o);const {w,h,d}=o,zc=o.z||0;const tr=o.trim||'#ffffff',ac=o.accent||o.roof;
  /* corner posts and a wavy eave trim */
  for(const sx of [-1,1])for(const sz of [-1,1])box(0.38,h,0.38,tr,sx*(w/2+0.04),h/2,zc+sz*(d/2+0.04),g,false);
  const n=Math.max(6,Math.round(w/0.9));for(let i=0;i<n;i++){const sc=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.12,12,1,false,0,Math.PI),M(i%2?tr:ac));sc.rotation.set(Math.PI/2,0,Math.PI);sc.position.set(-w/2+w*(i+0.5)/n,h-0.05,fz+0.12);g.add(sc);}
  /* shutters beside both windows */
  for(const sx of [-1,1]){const xw=sx*(w/2-w*0.2);for(const s2 of [-1,1])box(0.42,1.9,0.1,ac,xw+s2*1.38,h*0.52+0.35,fz+0.09,g,false);}
  /* a little door canopy, lanterns and pots */
  const cn=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,0.16,20,1,false,-Math.PI/2,Math.PI),M(ac));cn.scale.set(1,1,0.72);cn.position.set(0,3.42,fz+0.05);cn.castShadow=true;g.add(cn);
  for(const sx of [-1.45,1.45]){box(0.08,0.4,0.08,'#3a3f4a',sx,2.95,fz+0.2,g,false);const l=box(0.22,0.3,0.22,'#fff6d8',sx,2.7,fz+0.32,g,false);l.material=LAMP_MAT;}
  for(const sx of [-1.75,1.75]){cyl(0.34,0.26,0.55,'#e88a62',sx,0.28,fz+0.75,g,10);sph(0.42,pick(['#5dbb63','#4fae5a']),sx,0.85,fz+0.75,g,7);sph(0.1,pick(['#ff6f91','#ffd166','#ffffff']),sx+0.15,1.15,fz+0.9,g,6,false);}
  /* side windows so the house looks good from every side */
  for(const sx of [-1,1]){const wx=sx*(w/2+0.06);const gl=box(0.12,1.5,1.7,'#bfe9ff',wx,h*0.55,zc,g,false);gl.material=WIN_MAT;box(0.16,1.75,1.95,tr,wx-sx*0.03,h*0.55,zc,g,false).scale.set(1,1,1);box(0.2,0.12,2.1,tr,wx,h*0.55-0.92,zc,g,false);}
  /* chimney (puffs for the café) */
  if(o.chimney){const cx=w*0.28;box(0.9,2.4,0.9,'#c97a5a',cx,h+1.4,zc-d*0.18,g);box(1.1,0.25,1.1,'#8a4f33',cx,h+2.6,zc-d*0.18,g);const puffs=[];for(let i=0;i<4;i++){const s=sph(0.35,'#ffffff',cx,h+3,zc-d*0.18,g,8,false);s.material=new THREE.MeshLambertMaterial({color:'#ffffff',transparent:true,opacity:0.6});puffs.push({s,ph:i/4});}
    updaters.push((dt,t)=>{for(const q of puffs){const k=(t*0.25+q.ph)%1;q.s.position.set(cx+Math.sin(k*5+q.ph*7)*0.3,h+3+k*3.2,zc-d*0.18);q.s.scale.setScalar(0.6+k*1.6);q.s.material.opacity=0.55*(1-k);}});}
  /* string lights under the eave */
  {const pts=[];const N=Math.round(w/0.7);for(let i=0;i<=N;i++){const t_=i/N;pts.push(new THREE.Vector3(-w/2+w*t_,h-0.35-Math.sin(t_*Math.PI)*0.35,fz+0.35));}g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#5b6676'})));for(let i=1;i<N;i+=1){const m=new THREE.Mesh(BULB_GEO,BULB_MAT);m.position.copy(pts[i]);m.position.y-=0.1;g.add(m);}}
  return fz;};}
/* each building gets its own accent */
{const ACC={mood:'#2fa39a',kind:'#ffd166',help:'#2fa39a',study:'#ffb347',arcade:'#ff9fd6'};const _hz=zoneGroup;zoneGroup=function(z){const g=_hz(z);g.userData.zone=z.id;return g;};
 const _h2=house;house=function(g,o){const id=g.userData&&g.userData.zone;if(id&&ACC[id]&&!o.accent)o.accent=ACC[id];if(id==='mood')o.chimney=true;return _h2(g,o);};}

/* ---------- a blade sign on each centre building, with its icon ---------- */
function bladeSign(z){if(!z.g)return;const g=z.g;const fz=z.id==='help'?1.5:z.id==='study'?1:z.id==='arcade'?1:1;const side=z.id==='kind'?-1:1;
  const bx=side*(z.id==='study'?7.6:z.id==='mood'?6.6:z.id==='help'?5.6:z.id==='arcade'?6.6:5.6);
  box(1.2,0.12,0.12,'#3a3f4a',bx-side*0.55,4.4,fz+0.8,g,false);
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#ffffff';x.beginPath();x.arc(128,128,124,0,TAU);x.fill();x.fillStyle=z.color;x.beginPath();x.arc(128,128,108,0,TAU);x.fill();drawIcon(x,iconFor(z.name)||'star',128,128,110);
  const t=new THREE.CanvasTexture(c);const disc=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.75,0.12,28),[M('#ffffff'),new THREE.MeshBasicMaterial({map:t}),new THREE.MeshBasicMaterial({map:t})]);disc.rotation.z=Math.PI/2;disc.position.set(bx,3.75,fz+0.8);g.add(disc);
  updaters.push((dt,tt)=>{disc.rotation.x=Math.sin(tt*1.2+z.x)*0.08;});}

/* ---------- music pavilion back in the centre ---------- */
{const _oz=openZone;openZone=function(z){if(z.id==='sound'){stampId('sound');track('place',{id:'sound'});if(z.seat)startAction(z.seat);radioPanel(true);return;}_oz(z);};}

/* ---------- art garden: open air, shade sails, easels ---------- */
function shadeSail(parent,pts,col){const g=new THREE.BufferGeometry();const v=new Float32Array(pts.flat());g.setAttribute('position',new THREE.BufferAttribute(v,3));g.setIndex([0,1,2]);g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide,transparent:true,opacity:0.92}));m.castShadow=true;parent.add(m);return m;}
buildPaint=function(){paintInit();const cx=CQ.paint.x,cz=CQ.paint.z;const ry=Math.atan2(CQ.x-cx,CQ.z-cz);const g=grp(cx,cz,ry);
  /* splashy round patio */
  const pc=cardTex(1024,1024,(x,Wd)=>{x.fillStyle='#f3e6d2';x.beginPath();x.arc(512,512,510,0,TAU);x.fill();const cols=['#ff6f61','#ffd166','#2fa39a','#7aa7ff','#b28dff','#ff9fc6'];for(let i=0;i<46;i++){x.globalAlpha=0.55;x.fillStyle=cols[i%6];const a=Math.random()*TAU,r=Math.random()*440;const px=512+Math.cos(a)*r,py=512+Math.sin(a)*r;x.beginPath();x.arc(px,py,8+Math.random()*26,0,TAU);x.fill();for(let k=0;k<5;k++){x.beginPath();x.arc(px+rr(-40,40),py+rr(-40,40),3+Math.random()*7,0,TAU);x.fill();}}x.globalAlpha=1;x.strokeStyle='#e2cfae';x.lineWidth=14;x.beginPath();x.arc(512,512,496,0,TAU);x.stroke();});
  const pt=new THREE.Mesh(new THREE.CircleGeometry(9,48),new THREE.MeshLambertMaterial({map:pc,transparent:true,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-6}));pt.rotation.x=-Math.PI/2;pt.position.y=0.04;pt.receiveShadow=true;g.add(pt);
  /* masts + three colourful shade sails */
  const MP=[[-7,-5],[7,-5],[0,7.5],[-7.5,4],[7.5,4]];const mh=[5.2,4.6,5.4,4.3,4.9];MP.forEach(([x,z],i)=>{cyl(0.12,0.15,mh[i],'#5b6676',x,mh[i]/2,z,g,8);sph(0.2,'#ffd166',x,mh[i]+0.1,z,g,8);gCircle(g,x,z,0.3);});
  const T=(i)=>[MP[i][0],mh[i]-0.2,MP[i][1]];
  shadeSail(g,[T(0),T(1),[0,3.2,0.5]],'#ff8f6b');shadeSail(g,[T(2),T(3),[-1.5,3.4,1]],'#ffd166');shadeSail(g,[T(2),T(4),[1.5,3.1,1]],'#2fa39a');
  /* easels in a soft arc */
  easel(g,0,-1.2,new THREE.MeshBasicMaterial({map:PAINT.tex}));
  [[-3.6,-0.6,0.35,5],[3.6,-0.6,-0.35,6],[-5.4,1.8,0.8,7],[5.4,1.8,-0.8,8]].forEach(([x,z,r,s])=>{const e=easel(g,x,z,new THREE.MeshBasicMaterial({map:abstractTex(s)}));e.rotation.y=r;cyl(0.3,0.3,0.55,'#c98b55',x+Math.sin(r)*0.9,0.28,z+Math.cos(r)*0.9,g,10);});
  /* gallery wall at the back */
  box(10.4,3.4,0.25,'#ffffff',0,1.9,-7.2,g);box(10.8,0.25,0.5,'#2fa39a',0,3.7,-7.2,g);GALLERY=[];for(let i=0;i<4;i++){box(2.2,1.75,0.08,'#7a5236',-3.75+i*2.5,2,-7.05,g,false);const f=new THREE.Mesh(new THREE.PlaneGeometry(2.0,1.5),M('#fff'));f.position.set(-3.75+i*2.5,2,-7.0);g.add(f);GALLERY.push(f);}loadGallery(GALLERY);gBox(g,0,-7.2,5.3,0.3);
  /* paint table, jars of brushes, a mural of handprints */
  box(2.4,0.9,1.1,'#c98b55',-6,0.45,-3.4,g);['#ff6f61','#ffd166','#2fa39a','#7aa7ff','#b28dff'].forEach((c,i)=>{cyl(0.14,0.14,0.26,c,-6.9+i*0.45,1.03,-3.4,g,10,false);box(0.03,0.42,0.03,'#7a5236',-6.9+i*0.45,1.28,-3.4,g,false);});gBox(g,-6,-3.4,1.25,0.6);
  const sg=sign('Art Garden','paint in the open air · take it home','#ff8f6b','#ffffff',4.6,1.1,g,0,5.6,7.9);
  bunting(L2W(g,-7.5,4).x,4.2,L2W(g,-7.5,4).z,L2W(g,0,7.5).x,5.0,L2W(g,0,7.5).z,0.5);bunting(L2W(g,0,7.5).x,5.0,L2W(g,0,7.5).z,L2W(g,7.5,4).x,4.2,L2W(g,7.5,4).z,0.5);
  for(const [x,z] of [[-8.6,-1],[8.6,-1],[-4,8.4],[4,8.4]]){cyl(0.5,0.4,0.7,'#d9734e',x,0.35,z,g,10);sph(0.7,pick(['#5dbb63','#7fd36f']),x,1.1,z,g,8);sph(0.14,pick(['#ff6f91','#ffd166','#b28dff']),x+0.2,1.5,z+0.2,g,6,false);gCircle(g,x,z,0.6);}
  for(const [lx,lz,r] of [[-3.6,0.6,Math.PI+0.35],[5.4,3,Math.PI-0.8]]){const w=L2W(g,lx,lz);const p=staticNPC(w.x,w.z,g.rotation.y+r,{pack:false},(dt,t)=>{const u=p.userData;idleAnim(p,t);u.arms[1].rotation.x=-1.4+Math.sin(t*2.2+lx)*0.2;u.arms[1].rotation.z=0.25+Math.sin(t*1.6+lx)*0.15;},pick(["I came to paint a sunset. It's becoming a mango.","My painting has six legs. It started as a cat.","No rules here. That's the best part."]));}
  const front=L2W(g,0,0.4);const ex=L2W(g,0,2.6);
  SPOTS.push({label:'Paint something',sub:'Pick colours and brushes, then take it home',color:'#d2925c',tx:cx,tz:cz,tr:10,run:()=>{stampId('paint');paintPanel();startAction({x:front.x,z:front.z,rot:g.rotation.y+Math.PI,pose:t=>{resetPose(avatar);avatar.userData.arms[1].rotation.x=-1.3+Math.sin(t*3)*0.15;},camOff:Math.PI+0.4,dist:5,pitch:0.2,exit:ex});}});
  MAP_DECOR.push({x:cx,z:cz,r:9,c:'rgba(255,143,107,.28)'});};

/* ---------- collisions with anything that moves ---------- */
const DYN=[];
function moverList(){DYN.length=0;if(!W)return DYN;
  for(const n of npcs){if(!n.p||!n.p.parent||n.p.parent!==scene)continue;DYN.push({x:n.p.position.x,z:n.p.position.z,r:0.42,npc:n});}
  if(W.main){for(const a of ANIMALS){if(a.visible)DYN.push({x:a.position.x,z:a.position.z,r:0.28});}
    if(typeof AUTO_STANDS!=='undefined')for(const st of AUTO_STANDS){if(st.car&&(AUTO.riding&&AUTO.car===st.car))continue;if(st.car)DYN.push({x:st.car.position.x,z:st.car.position.z,r:1.45,car:true});}
    if(TRAIN&&TRAIN.cars)TRAIN.cars.forEach(c=>{if(!TRAIN.riding)DYN.push({x:c.position.x,z:c.position.z,r:1.9,train:true});});}
  return DYN;}
{const _r=resolve;resolve=function(p){_r(p);for(const d of DYN){const dx=p.x-d.x,dz=p.z-d.z;const m=d.r+PR;if(Math.abs(dx)>m||Math.abs(dz)>m)continue;const q=Math.hypot(dx,dz);if(q<m&&q>1e-4){p.x=d.x+dx/q*m;p.z=d.z+dz/q*m;}}};}
/* walking people pause instead of walking through you, a moving auto or the train */
{const _add=addNPC;addNPC=function(p,update,line){const r=_add(p,update,line);const n=npcs[npcs.length-1];const fn=n.update;n.update=function(dt,t){const ox=p.position.x,oz=p.position.z;fn(dt,t);const mx=p.position.x-ox,mz=p.position.z-oz;if(mx*mx+mz*mz<1e-8)return;
    if(started){const ahead=(px,pz,rad)=>{const dx=px-p.position.x,dz=pz-p.position.z;const d=Math.hypot(dx,dz);return d<rad&&(dx*mx+dz*mz)>0;};
      let stop=ahead(player.x,player.z,1.15);
      if(!stop&&W===MAIN){if(AUTO.riding&&AUTO.car&&AUTO.v>0.5)stop=ahead(AUTO.car.position.x,AUTO.car.position.z,2.6);if(!stop&&TRAIN.cars)for(const c of TRAIN.cars){if(Math.hypot(c.position.x-p.position.x,c.position.z-p.position.z)<3.2&&TRAIN.v>0.3){stop=true;break;}}}
      if(stop){p.position.x=ox;p.position.z=oz;idleAnim(p,t);}}};return r;};}
TICKS.unshift(()=>moverList());

/* ---------- autos: drive on their own lane, never through the monument, stop for anyone in front ---------- */
AUTO_STANDS[0].path=[[-16,82.5],[-8,82.4],[-2.2,80],[-2.2,52.5],[-6.6,47],[-6.6,41],[-2.2,35.5],[-2.2,28.4]];
AUTO_STANDS[2].path=[[-118.5,8],[-118.5,-8.6],[-104,-8.6],[-27.2,-8.6]];AUTO_STANDS[3].path=[[114,7],[114,-8.6],[100,-8.6],[27.2,-8.6]];
{const _ra=rideAuto;rideAuto=function(st,d){AUTO.v=0;AUTO.wait=0;_ra(st,d);};}
function autoBlocked(){if(!AUTO.car)return false;const c=AUTO.car;const fx=Math.sin(c.rotation.y),fz=Math.cos(c.rotation.y);
  const chk=(x,z,rad)=>{const dx=x-c.position.x,dz=z-c.position.z;const along=dx*fx+dz*fz;const side=Math.abs(dx*fz-dz*fx);return along>0.8&&along<rad&&side<1.4;};
  for(const n of npcs){if(!n.p.parent||n.p.parent!==scene)continue;if(chk(n.p.position.x,n.p.position.z,4))return true;}for(const a of ANIMALS)if(a.visible&&chk(a.position.x,a.position.z,3))return true;
  if(TRAIN.cars)for(const tc of TRAIN.cars)if(chk(tc.position.x,tc.position.z,6))return true;return false;}
/* replace the auto driving updater with one that brakes */
TICKS.push((dt,t)=>{if(!AUTO.riding||!AUTO.route||!W.main)return;});
{const _ba=buildAutos;buildAutos=function(){const n0=updaters.length;_ba();const i=updaters.length-1;updaters[i]=(dt,t)=>{if(!AUTO.riding||!AUTO.route)return;
  const blocked=autoBlocked();const want=blocked?0:Math.min(13,AUTO.s<6?3+AUTO.s*2:13,Math.max(2.5,(AUTO.len-AUTO.s)*1.6))*(A11Y.rm?0.75:1);
  AUTO.v=(AUTO.v||0)+(want-(AUTO.v||0))*Math.min(1,dt*(blocked?6:2));if(blocked){AUTO.wait=(AUTO.wait||0)+dt;if(AUTO.wait>1.2&&t>(AUTO.honk||0)){AUTO.honk=t+3;if(SFX.ready){tone(420,0.12,0.04,'square');tone(420,0.12,0.04,'square',null,0.18);}}}else AUTO.wait=0;
  const sp=AUTO.v;AUTO.s+=sp*dt;const p=routeAt(AUTO.route,AUTO.s);const car=AUTO.car;let da=p.h-car.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));car.rotation.y+=da*Math.min(1,dt*5);car.position.set(p.x,Math.abs(Math.sin(t*14))*0.02*(sp>0.5?1:0),p.z);car.userData.wheels.forEach(w=>w.rotation.x+=sp*dt/0.3);
  if(AUTO.ui)AUTO.ui(AUTO.s/AUTO.len);if(AUTO.s>=AUTO.len)arriveAuto();};};}
/* the trip back from the beach shouldn't keep the waves playing in the city */
{const _ew=enterWorld;let before=null;enterWorld=function(w,s,r,m){if(w===BEACH_W||w===MOUNTAIN_W){if(W===MAIN&&AUD.ctx)before={waves:AUD.L.waves.on,birds:AUD.L.birds.on};}
  else if(w===MAIN&&(W===BEACH_W||W===MOUNTAIN_W)&&AUD.ctx){const b=before||{waves:false,birds:true};setLayer('waves',b.waves);setLayer('birds',b.birds);if(SFX.ready){sg(SFX.jet,0);SFX.jet.fl.frequency.value=300;}}
  return _ew(w,s,r,m);};}
