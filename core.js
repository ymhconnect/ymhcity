'use strict';
function theName(n){return /^(Support Booth|Study Hall|Thought Bubble|Breathing Garden|Stretch Lawn|Wishing Fountain|Music Pavilion|Kindness Post|Mood Café|Worry Lake|Art Garden|Dance Floor|Policy Circle|Mental Health Museum|YMH Theatre|YMH Hut|Ice Cream Cart|Mini Train|Big Picture Wheel|Kite Circle|Nap Garden|Swings|Creative Quarter)/.test(n)?'the '+n:n;}
const $=id=>document.getElementById(id);
if(!window.THREE){ $('introErr').hidden=false; $('enterBtn').textContent='Unavailable'; throw new Error('3D engine failed to load'); }

const TAU=Math.PI*2;
let _s=20261021;
function rnd(){_s|=0;_s=_s+0x6D2B79F5|0;let t=Math.imul(_s^_s>>>15,1|_s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
const rr=(a,b)=>a+(b-a)*rnd();
const pick=a=>a[Math.floor(rnd()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE=window.matchMedia&&matchMedia('(pointer: coarse)').matches;
const store={get(k,d){try{const v=localStorage.getItem('ymh.'+k);return v?JSON.parse(v):d;}catch(e){return d;}},set(k,v){try{localStorage.setItem('ymh.'+k,JSON.stringify(v));}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FD='"Bricolage Grotesque", "Trebuchet MS", sans-serif', FB='Lexend, "Segoe UI", sans-serif';

/* ================= ZONES ================= */
const ZONES=[
 {id:'fountain',name:'Wishing Fountain',sub:'Make one kind wish for yourself',color:'#3a9fdc',x:0,z:0,area:0,lh:8,hood:'Central Plaza'},
 {id:'breath',name:'Breathing Garden',sub:'Let the glowing orb set your pace',color:'#8b7cf0',x:-58,z:30,area:15,lh:10,hood:'Calm Garden'},
 {id:'yoga',name:'Stretch Lawn',sub:'Loosen up with the people on the lawn',color:'#5aa63a',x:-34,z:58,area:9,lh:6.5,hood:'Calm Garden'},
 {id:'worry',name:'Worry Lake',sub:'Fold a worry into a paper boat',color:'#2f95cc',x:54,z:-46,area:21,lh:7,hood:'Lakeside'},
 {id:'mood',name:'Mood Café',sub:'Tell the barista how you feel',color:'#f2874f',x:60,z:24,area:14,lh:12,hood:'Connect Corner'},
 {id:'kind',name:'Kindness Post',sub:'Read a letter, leave one for a stranger',color:'#e2504f',x:42,z:56,area:14,lh:12,hood:'Connect Corner'},
 {id:'help',name:'Support Booth',sub:'Real people you can reach',color:'#e48a12',x:16,z:60,area:9,lh:9.5,hood:'Connect Corner'},
 {id:'study',name:'Study Hall & Library',sub:'Focus with others or pick up a book',color:'#3d6fd6',x:-12,z:-64,area:14,lh:12,hood:'Focus Corner'},
 {id:'arcade',name:'Thought Bubble Arcade',sub:'Pop the thoughts that weigh on you',color:'#a066dd',x:-54,z:-48,area:14,lh:12,hood:'Focus Corner'},
 {id:'sound',name:'Music Pavilion',sub:'Calm radio stations and a sound mixer',color:'#1fa98a',x:68,z:-24,area:12,lh:11,hood:'Lakeside'},
];
const Z={}; ZONES.forEach(z=>Z[z.id]=z);
const LAKE={x:54,z:-46,r:14};
/* the Sound Pavilion now lives in the Creative Quarter, outside the centre ring */


/* ================= RENDERER ================= */
const canvas=$('world');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
let scene=new THREE.Scene();
scene.background=new THREE.Color('#cfeeff');
scene.fog=new THREE.Fog('#d4eeff',130,360);
const camera=new THREE.PerspectiveCamera(55,1,0.5,1000);
function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize); resize();

const hemi=new THREE.HemisphereLight('#e2f4ff','#8cc96d',0.72);scene.add(hemi);
const amb=new THREE.AmbientLight('#ffffff',0.12);scene.add(amb);
const sun=new THREE.DirectionalLight('#fff0d4',0.9);
sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
{const c=sun.shadow.camera;c.left=-65;c.right=65;c.top=65;c.bottom=-65;c.near=10;c.far=280;}
sun.shadow.bias=-0.0006;
scene.add(sun); scene.add(sun.target);
const SUN_OFF=new THREE.Vector3(55,95,38);
const SUN_DIR=SUN_OFF.clone().normalize();

/* sky dome */
const sky=new THREE.Mesh(new THREE.SphereGeometry(600,32,16),new THREE.ShaderMaterial({
  side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{top:{value:new THREE.Color('#3f9ced')},mid:{value:new THREE.Color('#9fd6ff')},bot:{value:new THREE.Color('#e4f6ff')}},
  vertexShader:'varying float vH;void main(){vH=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 top;uniform vec3 mid;uniform vec3 bot;varying float vH;void main(){float h=clamp(vH,0.0,1.0);vec3 c=mix(bot,mid,smoothstep(0.0,0.16,h));c=mix(c,top,smoothstep(0.16,0.8,h));gl_FragColor=vec4(c,1.0);}'
}));
sky.renderOrder=-1; scene.add(sky);
let STARS=null;{const n=1100,a=new Float32Array(n*3);for(let i=0;i<n;i++){const th=Math.random()*TAU,y=0.04+Math.random()*0.96,r=Math.sqrt(1-y*y);a[i*3]=Math.cos(th)*r*520;a[i*3+1]=y*520;a[i*3+2]=Math.sin(th)*r*520;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));STARS=new THREE.Points(g,new THREE.PointsMaterial({color:'#ffffff',size:2.2,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));STARS.frustumCulled=false;sky.add(STARS);}
let FIRE=null;
function radialTex(stops,size=256){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);stops.forEach(s=>g.addColorStop(s[0],s[1]));x.fillStyle=g;x.fillRect(0,0,size,size);return new THREE.CanvasTexture(c);}
const sunSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:radialTex([[0,'rgba(255,255,245,1)'],[0.16,'rgba(255,250,222,1)'],[0.22,'rgba(255,238,175,.6)'],[1,'rgba(255,230,160,0)']]),fog:false,depthWrite:false,transparent:true}));
sunSpr.scale.set(150,150,1); scene.add(sunSpr);

/* ================= HELPERS ================= */
const _mc={};
function M(c,o){const k=c+(o?JSON.stringify(o):'');if(!_mc[k])_mc[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,metalness:0,flatShading:true},o||{}));return _mc[k];}
const _lc={};
function LM(c,po){const k=c+'|'+(po||0);if(!_lc[k]){const m=new THREE.MeshLambertMaterial({color:c});if(po){m.polygonOffset=true;m.polygonOffsetFactor=-po;m.polygonOffsetUnits=-po*2;}_lc[k]=m;}return _lc[k];}
function add(geo,mat,x,y,z,parent,shadow){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=shadow!==false;m.receiveShadow=true;(parent||scene).add(m);return m;}
const box=(w,h,d,c,x,y,z,p,s)=>add(new THREE.BoxGeometry(w,h,d),M(c),x,y,z,p,s);
const cyl=(rt,rb,h,c,x,y,z,p,seg,s)=>add(new THREE.CylinderGeometry(rt,rb,h,seg||12),M(c),x,y,z,p,s);
const sph=(r,c,x,y,z,p,seg,s)=>add(new THREE.SphereGeometry(r,seg||10,Math.max(6,((seg||10)*0.7)|0)),M(c),x,y,z,p,s);
const cone=(r,h,c,x,y,z,p,seg,s)=>add(new THREE.ConeGeometry(r,h,seg||10),M(c),x,y,z,p,s);
function flat(geo,c,x,y,z,po,parent){const m=new THREE.Mesh(geo,LM(c,po===undefined?1:po));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;(parent||scene).add(m);return m;}
function grp(x,z,ry,parent){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;(parent||scene).add(g);return g;}
function L2W(g,lx,lz){const c=Math.cos(g.rotation.y),s=Math.sin(g.rotation.y);return{x:g.position.x+lx*c+lz*s,z:g.position.z-lx*s+lz*c};}
function rrect(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath();}
function fitFont(x,text,weight,size,family,maxW){let s=size;x.font=`${weight} ${s}px ${family}`;while(x.measureText(text).width>maxW&&s>10){s-=2;x.font=`${weight} ${s}px ${family}`;}return s;}
function wrapLines(x,text,maxW){const words=text.split(' ');const lines=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;if(x.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;}if(cur)lines.push(cur);return lines;}

/* shared glowing materials (driven by time of day) */
const LAMP_MAT=new THREE.MeshStandardMaterial({color:'#fff6d8',emissive:'#ffe2a0',emissiveIntensity:0.3});
const WIN_MAT=new THREE.MeshStandardMaterial({color:'#c9ecff',emissive:'#9fd8ff',emissiveIntensity:0.15,roughness:.2});
const BULB_MAT=new THREE.MeshStandardMaterial({color:'#fff1c9',emissive:'#ffcf73',emissiveIntensity:0.3});
const LANTERN_MAT=new THREE.MeshStandardMaterial({color:'#f3eeff',emissive:'#cbbfff',emissiveIntensity:0.6});
const SCREEN_MAT=new THREE.MeshStandardMaterial({color:'#dfe9ff',emissive:'#a9c4ff',emissiveIntensity:0.5});
const CLOUD_MAT=new THREE.MeshLambertMaterial({color:'#ffffff',emissive:'#ffffff',emissiveIntensity:0.32});
const POOL_MAT=new THREE.MeshBasicMaterial({map:radialTex([[0,'rgba(255,214,150,0.95)'],[0.45,'rgba(255,196,120,0.4)'],[1,'rgba(255,196,120,0)']]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});
const BULB_GEO=new THREE.SphereGeometry(0.12,8,6),POOL_GEO=new THREE.CircleGeometry(4.2,24);
let SPOTS=[];

/* colliders */
let colliders=[];
function addCircle(x,z,r){colliders.push({t:0,x,z,r});}
function addBox(x,z,hw,hd,rot){colliders.push({t:1,x,z,hw,hd,c:Math.cos(rot||0),s:Math.sin(rot||0)});}
function gBox(g,lx,lz,hw,hd){const w=L2W(g,lx,lz);addBox(w.x,w.z,hw,hd,g.rotation.y);}
function gCircle(g,lx,lz,r){const w=L2W(g,lx,lz);addCircle(w.x,w.z,r);}
const PR=0.55;
function resolve(p){for(const c of colliders){if(c.t===0){const dx=p.x-c.x,dz=p.z-c.z;const m=c.r+PR;if(Math.abs(dx)>m||Math.abs(dz)>m)continue;const d=Math.hypot(dx,dz);if(d<m&&d>1e-4){p.x=c.x+dx/d*m;p.z=c.z+dz/d*m;}}else{const dx=p.x-c.x,dz=p.z-c.z;if(Math.abs(dx)>c.hw+c.hd+2&&Math.abs(dz)>c.hw+c.hd+2)continue;let lx=dx*c.c-dz*c.s,lz=dx*c.s+dz*c.c;const ox=c.hw+PR-Math.abs(lx),oz=c.hd+PR-Math.abs(lz);if(ox>0&&oz>0){if(ox<oz)lx=Math.sign(lx||1)*(c.hw+PR);else lz=Math.sign(lz||1)*(c.hd+PR);p.x=c.x+lx*c.c+lz*c.s;p.z=c.z-lx*c.s+lz*c.c;}}}}

/* text textures */
function signTex(title,sub,bg,fg,w,h){const W=1024,H=Math.max(64,Math.round(W*h/w));const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.fillStyle=bg;x.fillRect(0,0,W,H);x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=H*0.045;rrect(x,H*0.07,H*0.07,W-H*0.14,H-H*0.14,H*0.14);x.stroke();
  x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';
  fitFont(x,title,800,sub?H*0.46:H*0.6,FD,W*0.84);x.fillText(title,W/2,sub?H*0.45:H*0.56);
  if(sub){fitFont(x,sub,500,H*0.15,FB,W*0.78);x.globalAlpha=.88;x.fillText(sub,W/2,H*0.77);x.globalAlpha=1;}
  const t=new THREE.CanvasTexture(c);t.anisotropy=8;return t;}
function sign(title,sub,bg,fg,w,h,parent,x,y,z,ry){const face=new THREE.MeshBasicMaterial({map:signTex(title,sub,bg,fg,w,h)});const side=M(bg);const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.3),[side,side,side,side,face,face]);m.position.set(x,y,z);m.rotation.y=ry||0;m.castShadow=true;(parent||scene).add(m);return m;}
function pillCanvas(text,dot,o){o=o||{};const fs=o.fs||60;const c=document.createElement('canvas');const x=c.getContext('2d');x.font=`700 ${fs}px ${FD}`;const tw=x.measureText(text).width;const H=Math.round(fs*1.85),pad=fs*0.62,dw=dot?fs*0.75:0;c.width=Math.ceil(tw+pad*2+dw);c.height=H;
  x.fillStyle=o.bg||'rgba(255,255,255,0.95)';rrect(x,4,4,c.width-8,H-8,(H-8)/2);x.fill();
  if(dot){x.fillStyle=dot;x.beginPath();x.arc(pad+fs*0.24,H/2,fs*0.24,0,TAU);x.fill();}
  x.font=`700 ${fs}px ${FD}`;x.fillStyle=o.fg||'#1d2b44';x.textBaseline='middle';x.fillText(text,pad+dw,H/2+fs*0.07);return c;}
function pillSprite(text,dot,h,o){const c=pillCanvas(text,dot,o);const m=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,fog:false});const s=new THREE.Sprite(m);s.scale.set((h||1.6)*c.width/c.height,h||1.6,1);s.renderOrder=5;return s;}

/* ================= PEOPLE ================= */
const SKIN=['#f6d2b8','#e8b48f','#c98d66','#a86d4a','#7d4f34','#f2c6a0','#d9a47c'];
const HAIR=['#2b1d16','#4a3020','#8a5a32','#d9a35b','#1b1b24','#c0563f','#6b4fb0','#2b1d16'];
const SHIRT=['#ff8f7a','#4fc3a1','#ffd166','#7aa7ff','#b28dff','#ff9fc6','#5cc8e8','#f7a35c','#8bd17c','#ffffff','#ff6f91'];
const PANTS=['#3a4a6b','#5a6b8a','#2f3a4f','#7a6a5a','#4b5d7a','#6b4f6b','#3f6b62'];
const _pg={leg:new THREE.BoxGeometry(0.2,0.78,0.22),shoe:new THREE.BoxGeometry(0.22,0.14,0.32),torso:new THREE.CylinderGeometry(0.27,0.33,0.78,10),arm:new THREE.BoxGeometry(0.15,0.62,0.16),hand:new THREE.SphereGeometry(0.1,8,6),head:new THREE.SphereGeometry(0.28,14,10),hair:new THREE.SphereGeometry(0.3,14,8,0,TAU,0,Math.PI*0.55),eye:new THREE.SphereGeometry(0.04,6,5),cheek:new THREE.SphereGeometry(0.05,6,5),long:new THREE.BoxGeometry(0.52,0.55,0.16),bun:new THREE.SphereGeometry(0.14,8,6),pack:new THREE.BoxGeometry(0.44,0.52,0.22),band:new THREE.TorusGeometry(0.3,0.035,6,16,Math.PI),cup:new THREE.CylinderGeometry(0.09,0.09,0.08,10)};
function makePerson(o){o=o||{};const skin=o.skin||pick(SKIN),hair=o.hair||pick(HAIR),shirt=o.shirt||pick(SHIRT),pants=o.pants||pick(PANTS);
  const g=new THREE.Group();const body=new THREE.Group();g.add(body);const s=o.scale||1;body.scale.setScalar(s);
  const mk=(geo,c,x,y,z,p,sh)=>{const m=new THREE.Mesh(geo,M(c));m.position.set(x,y,z);m.castShadow=sh!==false;p.add(m);return m;};
  const legs=[],arms=[];
  for(const sx of [-0.15,0.15]){const pv=new THREE.Group();pv.position.set(sx,0.86,0);body.add(pv);mk(_pg.leg,pants,0,-0.39,0,pv);mk(_pg.shoe,'#3b3b46',0,-0.8,0.05,pv);legs.push(pv);}
  mk(_pg.torso,shirt,0,1.24,0,body);
  for(const sx of [-0.4,0.4]){const pv=new THREE.Group();pv.position.set(sx,1.55,0);body.add(pv);mk(_pg.arm,shirt,0,-0.29,0,pv);mk(_pg.hand,skin,0,-0.64,0,pv);arms.push(pv);}
  const head=new THREE.Group();head.position.y=1.93;body.add(head);
  mk(_pg.head,skin,0,0,0,head);mk(_pg.hair,hair,0,0.03,-0.03,head);
  const hs=o.style!==undefined?o.style:Math.floor(rnd()*4);
  if(hs===1)mk(_pg.long,hair,0,-0.22,-0.2,head);
  if(hs===2)mk(_pg.bun,hair,0,0.3,-0.12,head);
  for(const ex of [-0.095,0.095])mk(_pg.eye,'#1f2533',ex,0.03,0.255,head,false);
  if(o.pack!==false&&rnd()<0.38)mk(_pg.pack,pick(['#2f3a4f','#7a4b3a','#3f6b62','#5b4f8a','#c0563f','#d9a35b']),0,1.32,-0.36,body);
  if(o.phones!==false&&rnd()<0.22){const hp=new THREE.Mesh(_pg.band,M('#1d2b44'));hp.position.y=0.02;head.add(hp);for(const ex of [-0.29,0.29]){const c=new THREE.Mesh(_pg.cup,M('#1d2b44'));c.position.set(ex,0,0);c.rotation.z=Math.PI/2;head.add(c);}}
  g.userData={legs,arms,body,head,phase:rnd()*TAU,scale:s};
  return g;}
function walkAnim(p,t,amt){const u=p.userData;const a=t*9+u.phase;const sw=Math.sin(a)*0.55*amt;u.legs[0].rotation.x=sw;u.legs[1].rotation.x=-sw;u.arms[0].rotation.x=-sw*0.8;u.arms[1].rotation.x=sw*0.8;u.arms[0].rotation.z=0;u.arms[1].rotation.z=0;u.body.position.y=Math.abs(Math.cos(a))*0.07*amt;}
function idleAnim(p,t){const u=p.userData;u.legs[0].rotation.x*=0.85;u.legs[1].rotation.x*=0.85;u.arms[0].rotation.x*=0.85;u.arms[1].rotation.x*=0.85;u.arms[0].rotation.z=-0.06-Math.sin(t*1.4+u.phase)*0.03;u.arms[1].rotation.z=0.06+Math.sin(t*1.4+u.phase)*0.03;u.body.position.y=Math.sin(t*1.8+u.phase)*0.015;}
function sitPose(p){const u=p.userData;u.legs.forEach(l=>l.rotation.x=-Math.PI/2);}
function crossPose(p){const u=p.userData;u.legs[0].rotation.set(-Math.PI/2,0,0.5);u.legs[1].rotation.set(-Math.PI/2,0,-0.5);u.arms[0].rotation.set(-0.5,0,-0.35);u.arms[1].rotation.set(-0.5,0,0.35);}

function resetPose(p){const u=p.userData;u.legs.forEach(l=>l.rotation.set(0,0,0));u.arms.forEach(a=>{a.rotation.set(0,0,0);a.position.y=1.55;});u.head.rotation.set(0,0,0);u.body.rotation.set(0,0,0);u.body.position.set(0,0,0);u.body.scale.setScalar(u.scale||1);}
function stretchPose(p,m,t){const u=p.userData;resetPose(p);
  if(m===0){u.head.rotation.z=Math.sin(t*0.9)*0.45;u.head.rotation.x=0.25+Math.cos(t*0.9)*0.15;}
  else if(m===1){const k=Math.max(0,Math.sin(t*1.6));u.arms.forEach(a=>a.position.y=1.55+k*0.15);u.head.rotation.x=-0.05*k;}
  else if(m===2){const a=Math.PI-0.12;u.arms[0].rotation.z=-a;u.arms[1].rotation.z=a;u.body.scale.y=(u.scale||1)*(1.02+Math.sin(t*0.8)*0.015);}
  else if(m===3){const a=Math.PI-0.15;u.arms[0].rotation.z=-a;u.arms[1].rotation.z=a;const f=Math.sin(t*0.6)*0.32;u.body.rotation.z=f;u.body.position.set(0.86*Math.sin(f),0.86-0.86*Math.cos(f),0);u.legs.forEach(l=>l.rotation.z=-f);}
  else if(m===4){const th=1.05+Math.sin(t*0.8)*0.08;u.body.rotation.x=th;u.body.position.set(0,0.86-0.86*Math.cos(th),-0.86*Math.sin(th));u.legs.forEach(l=>l.rotation.x=-th);u.arms.forEach(a=>a.rotation.x=-th+Math.sin(t*1.5)*0.1);}
  else{u.arms[0].rotation.z=-0.3+Math.sin(t*18)*0.25;u.arms[1].rotation.z=0.3+Math.cos(t*17)*0.25;u.arms[0].rotation.x=Math.sin(t*15)*0.3;u.arms[1].rotation.x=Math.cos(t*16)*0.3;u.body.position.y=Math.abs(Math.sin(t*9))*0.08;u.legs[0].rotation.x=Math.sin(t*12)*0.15;}}
const BREATH={active:false,target:0.72,cur:0.72,rate:0.125,word:0};const YOGA={active:false,move:0};const STUDY={mode:'idle'};
const POSE={
  sit:t=>{const u=avatar.userData;resetPose(avatar);u.legs.forEach(l=>l.rotation.x=-Math.PI/2);u.arms.forEach(a=>a.rotation.x=-0.5);u.head.rotation.y=Math.sin(t*0.3)*0.4;},
  cross:t=>{const u=avatar.userData;resetPose(avatar);crossPose(avatar);const e=BREATH.cur-0.72;u.body.scale.set(1+e*0.08,1+e*0.04,1+e*0.12);u.head.rotation.x=0.12;},
  listen:t=>{const u=avatar.userData;resetPose(avatar);crossPose(avatar);u.head.rotation.z=Math.sin(t*2.2)*0.1;u.head.rotation.x=Math.abs(Math.sin(t*2.2))*0.12;},
  stretch:t=>{if(YOGA.active)stretchPose(avatar,YOGA.move,t);else{resetPose(avatar);idleAnim(avatar,t);}},
  type:t=>{const u=avatar.userData;resetPose(avatar);u.legs.forEach(l=>l.rotation.x=-Math.PI/2);if(STUDY.mode==='break'){const a=Math.PI-0.2+Math.sin(t*1.2)*0.1;u.arms[0].rotation.z=-a;u.arms[1].rotation.z=a;}else{u.arms[0].rotation.x=-1.25+Math.sin(t*14)*0.05;u.arms[1].rotation.x=-1.25+Math.cos(t*13)*0.05;u.head.rotation.x=0.15;}}
};
function makeDog(c){c=c||pick(['#c98d5a','#f2e2c4','#3b3030','#e0b070']);const g=new THREE.Group();
  box(0.36,0.36,0.85,c,0,0.55,0,g);box(0.36,0.34,0.38,c,0,0.85,0.5,g);box(0.2,0.15,0.2,'#7a5236',0,0.78,0.74,g);
  box(0.1,0.18,0.08,'#5a3d2a',-0.14,1.06,0.45,g);box(0.1,0.18,0.08,'#5a3d2a',0.14,1.06,0.45,g);
  const legs=[];for(const [lx,lz] of [[-0.12,0.3],[0.12,0.3],[-0.12,-0.3],[0.12,-0.3]]){const pv=new THREE.Group();pv.position.set(lx,0.42,lz);g.add(pv);box(0.1,0.42,0.1,c,0,-0.21,0,pv);legs.push(pv);}
  const tail=new THREE.Group();tail.position.set(0,0.7,-0.42);g.add(tail);box(0.07,0.07,0.4,c,0,0.08,-0.18,tail).rotation.x=0.6;
  g.userData={legs,tail};return g;}
function dogAnim(d,t,moving){const u=d.userData;const sw=moving?Math.sin(t*12)*0.6:0;u.legs[0].rotation.x=sw;u.legs[3].rotation.x=sw;u.legs[1].rotation.x=-sw;u.legs[2].rotation.x=-sw;u.tail.rotation.y=Math.sin(t*14)*0.6;}

/* ================= WORLD STATE ================= */
let updaters=[]; let npcs=[]; const SEGS=[]; const TREES=[];
const player={x:0,z:96,y:0,rot:Math.PI,moving:false};
let avatar=null; let started=false; let panelOpen=false;

function pathSeg(x1,z1,x2,z2,w,c){w=w||4.2;c=c||'#f3e1bf';SEGS.push({x1,z1,x2,z2,w});const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,len),LM(c,2));m.rotation.order='YXZ';m.rotation.set(-Math.PI/2,Math.atan2(dx,dz),0);m.position.set((x1+x2)/2,0.02,(z1+z2)/2);m.receiveShadow=true;scene.add(m);
  for(const [x,z] of [[x1,z1],[x2,z2]])flat(new THREE.CircleGeometry(w/2,20),c,x,0.02,z,2);}
function distSeg(px,pz,s){const dx=s.x2-s.x1,dz=s.z2-s.z1;const L=dx*dx+dz*dz||1;const t=clamp(((px-s.x1)*dx+(pz-s.z1)*dz)/L,0,1);return Math.hypot(px-(s.x1+dx*t),pz-(s.z1+dz*t));}
function onPaved(x,z,m){m=m||0;const r=Math.hypot(x,z);if(r<16.5+m)return true;if(r>25.6-m&&r<31.4+m)return true;if(Math.abs(x)<4.6+m&&z>10&&z<106)return true;for(const s of SEGS){if(distSeg(x,z,s)<s.w/2+m)return true;}if(Math.hypot(x-LAKE.x,z-LAKE.z)<16.4+m)return true;return false;}

/* ================= GROUND & PATHS ================= */
function buildGround(){
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#93d371';x.fillRect(0,0,256,256);
  for(let i=0;i<2400;i++){const g=Math.random();x.fillStyle=g<.5?'rgba(110,184,84,.5)':g<.86?'rgba(170,224,124,.5)':'rgba(236,248,180,.35)';x.fillRect(Math.random()*256,Math.random()*256,2,2+Math.random()*3);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(100,100);t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.MeshLambertMaterial({map:t}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

  /* plaza tiles */
  const pc=document.createElement('canvas');pc.width=pc.height=1024;const p=pc.getContext('2d');p.fillStyle='#f5e8d2';p.fillRect(0,0,1024,1024);
  p.translate(512,512);p.strokeStyle='#e4cfae';p.lineWidth=4;
  for(let r=96;r<=512;r+=64){p.beginPath();p.arc(0,0,r,0,TAU);p.stroke();}
  for(let a=0;a<36;a++){const ang=a/36*TAU;p.beginPath();p.moveTo(Math.cos(ang)*96,Math.sin(ang)*96);p.lineTo(Math.cos(ang)*512,Math.sin(ang)*512);p.stroke();}
  const ring=['#ffd6b8','#cfe9ff','#e6defd','#d6f2df'];
  for(let a=0;a<36;a++){const ang=(a+0.5)/36*TAU;p.fillStyle=ring[a%4];p.beginPath();p.arc(Math.cos(ang)*416,Math.sin(ang)*416,20,0,TAU);p.fill();}
  const pt=new THREE.CanvasTexture(pc);pt.anisotropy=8;
  const pm=new THREE.MeshLambertMaterial({map:pt,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8});
  const plaza=new THREE.Mesh(new THREE.CircleGeometry(16.4,72),pm);plaza.rotation.x=-Math.PI/2;plaza.position.y=0.03;plaza.receiveShadow=true;scene.add(plaza);

  /* rainbow loop */
  flat(new THREE.RingGeometry(25.8,31.2,120),'#f3e1bf',0,0.02,0,2);
  const rc=['#ff9f8f','#ffcf6a','#8fdcb2','#8fc8ff','#bba8ff'];
  const dg=new THREE.CircleGeometry(0.34,12);for(let i=0;i<70;i++){const a=i/70*TAU;flat(dg,rc[i%5],Math.cos(a)*28.5,0.024,Math.sin(a)*28.5,3);}
  [25.95,31.05].forEach((r,i)=>flat(new THREE.RingGeometry(r-0.12,r+0.12,120),i?'#e7cfa4':'#e7cfa4',0,0.022,0,3));

  /* avenue */
  pathSeg(0,15,0,108,8.6,'#f1dcb8');
  /* stripes on avenue */
  for(let z=20;z<106;z+=4)flat(new THREE.PlaneGeometry(0.5,1.6),'#ffffff',0,0.025,z,3);
}

/* ================= TREES & NATURE ================= */
const GREENS=['#5dbb63','#6cc96b','#4fae5a','#7fd36f','#58b86a'];
const BLOSSOM=['#ffb7d0','#ffc8dc','#f7a6c4','#ffd1e1'];
const GOLD=['#f4c95d','#f7b955','#ffd77a'];
function tree(x,z,kind,s,shadow){s=s||1;const g=grp(x,z,rnd()*TAU);const sh=shadow!==false;
  const tc=pick(['#8a5a3b','#7b4f33','#946243']);
  if(kind===1){cyl(0.22*s,0.32*s,1.6*s,tc,0,0.8*s,0,g,6,sh);const c=pick(['#3f9a5b','#4aa865','#3a8f62']);cone(1.8*s,2.6*s,c,0,2.6*s,0,g,7,sh);cone(1.35*s,2.2*s,c,0,3.8*s,0,g,7,sh);cone(0.85*s,1.7*s,c,0,4.9*s,0,g,7,sh);}
  else{cyl(0.25*s,0.36*s,2.4*s,tc,0,1.2*s,0,g,7,sh);const pal=kind===2?BLOSSOM:kind===3?GOLD:GREENS;
    sph(1.7*s,pick(pal),0,3.2*s,0,g,9,sh);sph(1.15*s,pick(pal),0.95*s,3.7*s,0.3*s,g,8,sh);sph(1.1*s,pick(pal),-0.8*s,3.55*s,-0.45*s,g,8,sh);sph(0.95*s,pick(pal),0.1*s,4.4*s,-0.3*s,g,8,sh);}
  TREES.push({x,z,kind});return g;}
function isFree(x,z,m){if(onPaved(x,z,m))return false;if(Math.hypot(x,z)<34)return false;for(const zn of ZONES){if(zn.area&&Math.hypot(x-zn.x,z-zn.z)<zn.area)return false;}
  for(const k of KEEP){if(Math.hypot(x-k[0],z-k[1])<k[2])return false;}return true;}
const KEEP=[[14,-36,6],[-26,-22,4.5],[-11,66,3.5],[-22,66,6],[24,22,4],[-74,-74,6],[0,44,9]];

function buildTrees(){
  let n=0,tries=0;
  while(n<120&&tries<6000){tries++;const x=rr(-83,83),z=rr(-83,68);if(!isFree(x,z,2.6))continue;if(TREES.some(t=>Math.hypot(t.x-x,t.z-z)<4.2))continue;
    const k=rnd();tree(x,z,k<0.38?0:k<0.6?1:k<0.82?2:3,rr(0.85,1.25));addCircle(x,z,0.55);n++;}
  /* outside the city walls */
  tries=0;n=0;
  while(n<160&&tries<6000){tries++;const x=rr(-170,170),z=rr(-170,150);const inCity=Math.abs(x)<89&&z<74&&z>-89;if(inCity)continue;
    if(Math.abs(x)<9&&z>70&&z<120)continue;if(z>70&&z<112&&Math.abs(x)<16)continue;if(TREES.some(t=>Math.hypot(t.x-x,t.z-z)<5))continue;
    const k=rnd();const near=Math.abs(x)<60&&z>68&&z<130;tree(x,z,k<0.4?0:k<0.75?1:k<0.88?2:3,rr(1,1.6),near);if(near)addCircle(x,z,0.6);n++;}
  /* plaza planters */
  for(const a of [-2.05,-1.1,-0.25,0.5,1.2,1.95,2.65]){const r=21;tree(Math.cos(a)*r,Math.sin(a)*r,2,0.9);addCircle(Math.cos(a)*r,Math.sin(a)*r,0.6);
    cyl(1.4,1.5,0.5,'#f0d7b0',Math.cos(a)*r,0.25,Math.sin(a)*r,null,14);}
}
function buildHedges(){
  const hc='#4f9d55';
  const seg=(x1,z1,x2,z2)=>{const cx=(x1+x2)/2,cz=(z1+z2)/2,len=Math.hypot(x2-x1,z2-z1),rot=Math.atan2(x2-x1,z2-z1);const m=box(1.4,1.7,len,hc,cx,0.85,cz,null);m.rotation.y=rot;addBox(cx,cz,0.7,len/2,rot);
    const n=Math.floor(len/3.2);for(let i=0;i<n;i++){const t=(i+0.5)/n;sph(0.75,'#5aab5f',x1+(x2-x1)*t,1.7,z1+(z2-z1)*t,null,7,false).scale.set(1,0.6,1);}};
  seg(-88,72,-9,72);seg(9,72,88,72);seg(-88,-88,-88,72);seg(88,-88,88,72);seg(-88,-88,88,-88);
  /* hills & mountains */
  for(let i=0;i<26;i++){const a=i/26*TAU+rr(-0.1,0.1),d=rr(230,300);const m=sph(rr(40,75),pick(['#8fcf74','#7cc06a','#9bd57f','#86c77a']),Math.cos(a)*d,-6,Math.sin(a)*d,null,12,false);m.scale.y=rr(0.32,0.5);}
  for(let i=0;i<14;i++){const a=i/14*TAU+rr(-0.15,0.15),d=rr(380,430);cone(rr(50,85),rr(70,120),pick(['#9cc3e6','#a7cbea','#b4d4ef']),Math.cos(a)*d,20,Math.sin(a)*d,null,6,false);}
}
let flowerSpots=[];
function buildFlowers(){
  const pos=[];const addF=(x,z)=>{if(!onPaved(x,z,0.15))pos.push([x,z]);};
  for(let z=18;z<108;z+=0.9){for(const sd of [-1,1]){if(z>69&&z<75)continue;addF(sd*rr(5.1,7.3),z+rr(-.3,.3));}}
  for(let i=0;i<520;i++){const a=rnd()*TAU,r=rr(16.8,24.6);addF(Math.cos(a)*r,Math.sin(a)*r);}
  for(let i=0;i<36;i++){const cx=rr(-80,80),cz=rr(-80,66);if(!isFree(cx,cz,2))continue;for(let j=0;j<16;j++)addF(cx+rr(-2,2),cz+rr(-2,2));}
  ZONES.forEach(zn=>{if(!zn.area)return;for(let j=0;j<60;j++){const a=rnd()*TAU,r=zn.area-rr(0,2.5);addF(zn.x+Math.cos(a)*r,zn.z+Math.sin(a)*r);}});
  flowerSpots=pos;
  const FC=['#ff6f91','#ffd166','#ffffff','#b28dff','#ff9a5c','#7ac8ff','#ff8fb8','#ffe680'];
  const im=new THREE.InstancedMesh(new THREE.SphereGeometry(0.17,6,4),new THREE.MeshLambertMaterial({color:'#ffffff'}),pos.length);
  const lm=new THREE.InstancedMesh(new THREE.ConeGeometry(0.22,0.45,5),new THREE.MeshLambertMaterial({color:'#4a9e50'}),pos.length);
  const d=new THREE.Object3D();const col=new THREE.Color();
  pos.forEach((p,i)=>{d.position.set(p[0],0.42,p[1]);d.scale.setScalar(rr(0.8,1.3));d.rotation.set(0,0,0);d.updateMatrix();im.setMatrixAt(i,d.matrix);col.set(pick(FC));im.setColorAt(i,col);
    d.position.set(p[0],0.2,p[1]);d.scale.setScalar(rr(0.8,1.2));d.updateMatrix();lm.setMatrixAt(i,d.matrix);});
  im.instanceColor.needsUpdate=true;scene.add(im);scene.add(lm);
  /* grass tufts */
  const N=3200;const gm=new THREE.InstancedMesh(new THREE.ConeGeometry(0.12,0.55,4),new THREE.MeshLambertMaterial({color:'#5fae4f'}),N);let k=0;
  for(let i=0;i<N*3&&k<N;i++){const x=rr(-120,120),z=rr(-110,130);if(onPaved(x,z,0.3))continue;if(Math.hypot(x-LAKE.x,z-LAKE.z)<17)continue;d.position.set(x,0.25,z);d.rotation.set(rr(-.2,.2),0,rr(-.2,.2));d.scale.set(1,rr(0.6,1.4),1);d.updateMatrix();gm.setMatrixAt(k++,d.matrix);}
  gm.count=k;scene.add(gm);
}
function buildSkyLife(){
  const cg=new THREE.SphereGeometry(1,10,8);const cm=CLOUD_MAT;
  const clouds=[];
  for(let i=0;i<18;i++){const g=new THREE.Group();const s=rr(1,2.2);for(let j=0;j<6;j++){const m=new THREE.Mesh(cg,cm);m.position.set(rr(-5,5)*s,rr(-0.6,1.4)*s,rr(-2.5,2.5)*s);m.scale.setScalar(rr(2.4,4)*s);m.scale.y*=0.7;g.add(m);}
    g.position.set(rr(-260,260),rr(55,95),rr(-230,200));scene.add(g);clouds.push({g,sp:rr(0.8,1.8)});}
  updaters.push(dt=>{for(const c of clouds){c.g.position.x+=c.sp*dt;if(c.g.position.x>280)c.g.position.x=-280;}});
  /* birds */
  const wg=new THREE.BoxGeometry(1,0.05,0.38);const bm=M('#40506a');const birds=[];
  for(let f=0;f<4;f++){const cx=rr(-60,60),cz=rr(-60,40),R=rr(30,60),h=rr(28,42),sp=rr(0.12,0.2)*(rnd()<.5?-1:1),ph=rnd()*TAU;
    for(let j=0;j<4;j++){const g=new THREE.Group();sph(0.18,'#40506a',0,0,0,g,6,false);const L=new THREE.Group(),Rr=new THREE.Group();g.add(L);g.add(Rr);const lm=new THREE.Mesh(wg,bm);lm.position.x=-0.5;L.add(lm);const rm=new THREE.Mesh(wg,bm);rm.position.x=0.5;Rr.add(rm);scene.add(g);
      birds.push({g,L,R:Rr,cx,cz,rad:R+j*1.2,h:h+j*0.6,sp,ph:ph-j*0.05});}}
  updaters.push((dt,t)=>{for(const b of birds){const a=b.ph+t*b.sp;const x=b.cx+Math.cos(a)*b.rad,z=b.cz+Math.sin(a)*b.rad;b.g.position.set(x,b.h+Math.sin(t*0.7+b.ph)*1.5,z);b.g.rotation.y=Math.atan2(-Math.sin(a)*Math.sign(b.sp),Math.cos(a)*Math.sign(b.sp));const f=Math.sin(t*9+b.ph*7)*0.55;b.L.rotation.z=f;b.R.rotation.z=-f;}});
  /* butterflies */
  const bw=new THREE.PlaneGeometry(0.32,0.26);const flies=[];
  for(let i=0;i<22;i++){const sp=flowerSpots[Math.floor(rnd()*flowerSpots.length)];if(!sp)continue;const col=pick(['#ffd166','#ff8fb8','#8fd3ff','#ffffff','#c7a6ff','#ff9a5c']);const mm=new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide});
    const g=new THREE.Group();const L=new THREE.Group(),Rr=new THREE.Group();const lw=new THREE.Mesh(bw,mm);lw.rotation.x=-Math.PI/2;lw.position.x=-0.16;L.add(lw);const rw=new THREE.Mesh(bw,mm);rw.rotation.x=-Math.PI/2;rw.position.x=0.16;Rr.add(rw);g.add(L);g.add(Rr);scene.add(g);
    flies.push({g,L,R:Rr,x:sp[0],z:sp[1],ph:rnd()*TAU,sp:rr(0.4,0.8)});}
  updaters.push((dt,t)=>{for(const f of flies){const a=t*f.sp+f.ph;const x=f.x+Math.sin(a)*2.2+Math.sin(a*2.3)*0.8,z=f.z+Math.cos(a*0.8)*2.2;const y=1.1+Math.sin(a*3)*0.35;const g=f.g;const dx=x-g.position.x,dz=z-g.position.z;g.position.set(x,y,z);if(Math.abs(dx)+Math.abs(dz)>1e-4)g.rotation.y=Math.atan2(dx,dz);const fl=Math.sin(t*22+f.ph)*1.0;f.L.rotation.z=fl;f.R.rotation.z=-fl;}});
  /* fireflies (evening & night) */
  const FN=110,fp=new Float32Array(FN*3),fbase=[];for(let i=0;i<FN;i++){const s=flowerSpots[Math.floor(rnd()*flowerSpots.length)]||[0,0];fbase.push([s[0]+rr(-3,3),rr(0.6,2.4),s[1]+rr(-3,3),rnd()*TAU]);}
  const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.BufferAttribute(fp,3));FIRE=new THREE.Points(fg,new THREE.PointsMaterial({color:'#fff3a0',size:0.38,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));FIRE.frustumCulled=false;scene.add(FIRE);
  updaters.push((dt,t)=>{if(FIRE.material.opacity<0.01)return;for(let i=0;i<FN;i++){const b=fbase[i];fp[i*3]=b[0]+Math.sin(t*0.5+b[3])*1.3;fp[i*3+1]=b[1]+Math.sin(t*0.9+b[3]*2)*0.4;fp[i*3+2]=b[2]+Math.cos(t*0.4+b[3])*1.3;}fg.attributes.position.needsUpdate=true;});
}

/* ================= FURNITURE ================= */
function bench(x,z,rot,color){color=color||'#d08a52';const g=grp(x,z,rot);box(2.4,0.14,0.7,color,0,0.52,0,g);box(2.4,0.55,0.12,color,0,0.88,-0.32,g);for(const sx of [-1.02,1.02]){box(0.12,0.52,0.62,'#56677d',sx,0.26,0,g);}addBox(x,z,1.25,0.42,rot);
  const fr=L2W(g,0,1.1);SPOTS.push({label:'Sit on the bench',sub:'Take a mindful minute',color:'#2fb08c',tx:fr.x,tz:fr.z,tr:1.8,ok:()=>!g.userData.full,run:()=>sitBench(g)});return g;}
function lamp(x,z,c){cyl(0.09,0.12,4.2,'#36536b',x,2.1,z,null,8);const l=sph(0.38,'#fff3c4',x,4.45,z,null,10,false);l.material=LAMP_MAT;const pool=new THREE.Mesh(POOL_GEO,POOL_MAT);pool.rotation.x=-Math.PI/2;pool.position.set(x,0.07,z);pool.renderOrder=2;scene.add(pool);cone(0.5,0.35,c||'#36536b',x,4.85,z,null,10,false);addCircle(x,z,0.25);}
function balloonCluster(parent,x,y,z,n,spread){const bs=[];const pos=new Float32Array(n*6);const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(pos,3));const lines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:'#ffffff'}));parent.add(lines);
  const bc=['#ff6f91','#ffd166','#7aa7ff','#4fc3a1','#b28dff','#ff9a5c','#ff8fb8'];
  for(let i=0;i<n;i++){const m=sph(0.48,bc[i%bc.length],0,0,0,parent,10,false);m.material=new THREE.MeshStandardMaterial({color:bc[i%bc.length],roughness:.35,metalness:0});m.scale.set(1,1.2,1);bs.push({m,ox:rr(-spread,spread),oz:rr(-spread,spread),oy:rr(1.8,3.2),ph:rnd()*TAU});}
  updaters.push((dt,t)=>{bs.forEach((b,i)=>{const bx=x+b.ox+Math.sin(t*0.9+b.ph)*0.18,by=y+b.oy+Math.sin(t*1.3+b.ph)*0.1,bz=z+b.oz+Math.cos(t*0.8+b.ph)*0.18;b.m.position.set(bx,by,bz);pos[i*6]=x;pos[i*6+1]=y;pos[i*6+2]=z;pos[i*6+3]=bx;pos[i*6+4]=by-0.55;pos[i*6+5]=bz;});lg.attributes.position.needsUpdate=true;});
  lg.computeBoundingSphere=function(){this.boundingSphere=new THREE.Sphere(new THREE.Vector3(x,y,z),8);};
}

/* ================= NPC SYSTEM ================= */
const LINES=["The canteen ran out of samosas again. Tragic.","I came here to do nothing for ten minutes. It's going well.","My roommate snores. I nap here now.","Mess food was actually good today. Mark the date.","Hostel Wi-Fi is down so I'm touching grass. Literally.","Got my first internship reply. It was a no. Still proud I applied.","I called my mom on the walk here. Feeling lighter.","Chai first, then the assignment. That's the order.","My friend and I walk this loop every evening.","Nobody's in a hurry here. I like that.","I'm learning to say no to group calls after 11.","The ducks on the lake have names. I made them up.","First week in a new city. Still finding my way around.","I'm just here for the sunset, honestly.","Drank actual water today. Small wins.","Took the long way back to my room. On purpose.","We're planning a weekend trip. Mostly planning snacks.","Library closes at 9, so I'm making the most of the daylight."];
function addNPC(p,update,line){scene.add(p);npcs.push({p,update,line:line||pick(LINES)});return p;}
function ringWalker(th,dir,R,dog){const p=makePerson();const st={th,dir,R,sp:rr(1.1,1.7)};let d=null;if(dog){d=makeDog();scene.add(d);}
  addNPC(p,(dt,t)=>{st.th+=dt*st.sp/st.R*st.dir;const x=Math.cos(st.th)*st.R,z=Math.sin(st.th)*st.R;p.position.set(x,0,z);const tx=-Math.sin(st.th)*st.dir,tz=Math.cos(st.th)*st.dir;p.rotation.y=Math.atan2(tx,tz);walkAnim(p,t*st.sp/1.4,1);
    if(d){const a2=st.th+st.dir*1.4/st.R;const r2=st.R+0.9;d.position.set(Math.cos(a2)*r2,0,Math.sin(a2)*r2);d.rotation.y=p.rotation.y;dogAnim(d,t,true);}},dog?"This little one walks me, really.":undefined);}
function pathWalker(points,speed,o){const p=makePerson(o);const st={i:1,step:1,wait:rr(0,3)};p.position.set(points[0].x,0,points[0].z);speed=speed||rr(1.2,1.8);
  addNPC(p,(dt,t)=>{if(st.wait>0){st.wait-=dt;idleAnim(p,t);return;}const tg=points[st.i];const dx=tg.x-p.position.x,dz=tg.z-p.position.z;const d=Math.hypot(dx,dz);
    if(d<0.15){if(st.i===points.length-1||st.i===0){st.step=-st.step;st.wait=rr(2,6);}st.i+=st.step;return;}const mv=Math.min(d,speed*dt);p.position.x+=dx/d*mv;p.position.z+=dz/d*mv;
    const tr=Math.atan2(dx,dz);let da=tr-p.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));p.rotation.y+=da*Math.min(1,dt*8);walkAnim(p,t*speed/1.4,1);});return p;}
function staticNPC(x,z,rot,o,anim,line,y){const p=makePerson(o);p.position.set(x,y||0,z);p.rotation.y=rot;const fn=anim==='sit'?((dt,t)=>{p.userData.head.rotation.y=Math.sin(t*0.35+p.userData.phase)*0.35;}):(anim||((dt,t)=>idleAnim(p,t)));addNPC(p,fn,line);return p;}

/* ================= GATE ================= */
function buildGate(){
  const g=grp(0,72,0);
  for(const s of [-1,1]){const px=s*7.5;box(2.2,10,2.2,'#24324a',px,5,0,g);for(const y of [1.6,5,8.4])box(2.45,0.45,2.45,'#fff4e2',px,y,0,g);box(2.7,0.6,2.7,'#fff4e2',px,10.2,0,g);sph(1.1,'#ffd166',px,11.4,0,g,12).material=LAMP_MAT;addCircle(px,72,1.6);
    cyl(0.9,0.7,1.1,'#e88a62',px+s*2.4,0.55,1.4,g,12);sph(1,pick(['#ff8fb8','#ffd166']),px+s*2.4,1.5,1.4,g,8);}
  const rainbow=['#ff6b57','#ffa630','#ffd23f','#2fb08c','#2f80d1','#6c5ce7'];
  rainbow.forEach((c,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(7.6-i*0.42,0.22,8,48,Math.PI),M(c));m.position.set(0,10.4,-0.5);m.castShadow=true;g.add(m);});
  box(17.2,0.9,1.6,'#ffffff',0,10.4,0,g);
  {const W_=1024,H_=330;const c=document.createElement('canvas');c.width=W_;c.height=H_;const x=c.getContext('2d');x.fillStyle='#1d2b44';x.fillRect(0,0,W_,H_);x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=12;rrect(x,22,22,W_-44,H_-44,40);x.stroke();
    x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffffff';fitFont(x,'YMH City',800,140,FD,W_*0.8);x.fillText('YMH City',W_/2,112);
    x.fillStyle='#ffd98a';fitFont(x,'First virtual mental health city',600,50,FB,W_*0.82);x.fillText('First virtual mental health city',W_/2,212);
    x.fillStyle='rgba(255,255,255,.78)';fitFont(x,'By Youth for Mental Health',500,28,FB,W_*0.6);x.fillText('By Youth for Mental Health',W_/2,268);
    const t=new THREE.CanvasTexture(c);t.anisotropy=8;const face=new THREE.MeshBasicMaterial({map:t});const side=M('#1d2b44');const m=new THREE.Mesh(new THREE.BoxGeometry(12.5,4.03,0.3),[side,side,side,side,face,face]);m.position.set(0,12.8,0.2);m.castShadow=true;g.add(m);}
  balloonCluster(g,-7.5,11.6,0.8,5,1.2);balloonCluster(g,7.5,11.6,0.8,5,1.2);
  /* bunting across gate */
  bunting(-7.5,9.6,72.9,7.5,9.6,72.9,1.6);
  /* welcome sign outside */
  const ws=grp(7.5,88,-0.5);box(0.25,2.6,0.25,'#8a5a3b',-1.4,1.3,0,ws);box(0.25,2.6,0.25,'#8a5a3b',1.4,1.3,0,ws);sign('Welcome!','Take your time here','#ffd166','#1d2b44',3.8,1.7,ws,0,2.4,0.15);addCircle(7.5,88,1.6);
  bench(-11,79,Math.PI/2);bench(-11,85,Math.PI/2);
}
const BUNT=['#ff6f91','#ffd166','#4fc3a1','#7aa7ff','#b28dff','#ff9a5c'];
const flagGeo=new THREE.CircleGeometry(0.42,3);
function bunting(x1,y1,z1,x2,y2,z2,sag){const n=Math.max(6,Math.round(Math.hypot(x2-x1,z2-z1)/0.9));const pts=[];
  for(let i=0;i<=n;i++){const t=i/n;pts.push(new THREE.Vector3(x1+(x2-x1)*t,y1+(y2-y1)*t-Math.sin(t*Math.PI)*sag,z1+(z2-z1)*t));}
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#5b6676'})));
  for(let i=1;i<n;i++){const m=new THREE.Mesh(BULB_GEO,BULB_MAT);m.position.copy(pts[i]);m.position.y-=0.12;scene.add(m);}}

function buildAvenue(){
  for(let z=22;z<=66;z+=11){lamp(-5.6,z,'#ff8f7a');lamp(5.6,z,'#4fc3a1');bunting(-5.6,4.4,z,5.6,4.4,z,1.1);}
  for(let z=80;z<=104;z+=12){lamp(-5.6,z);lamp(5.6,z);}
  /* ring lamps & benches */
  for(let i=0;i<16;i++){const a=i/16*TAU+0.1;if(Math.abs(Math.atan2(Math.sin(a-Math.PI/2),Math.cos(a-Math.PI/2)))<0.25)continue;let ok=true;for(const zn of ZONES){if(!zn.area||zn.id==='yoga'||zn.id==='help')continue;const za=Math.atan2(zn.z,zn.x);if(Math.abs(Math.atan2(Math.sin(a-za),Math.cos(a-za)))<0.16)ok=false;}if(!ok)continue;
    if(i%2===0)lamp(Math.cos(a)*32.4,Math.sin(a)*32.4);else{const x=Math.cos(a)*33,z=Math.sin(a)*33;bench(x,z,Math.atan2(-x,-z));}}
  /* map board */
  const mb=grp(-11,66,0.25);box(0.3,3.6,0.3,'#36536b',-2.3,1.8,0,mb);box(0.3,3.6,0.3,'#36536b',2.3,1.8,0,mb);
  const tex=new THREE.CanvasTexture(drawMap(600,true,true));tex.anisotropy=8;const face=new THREE.MeshBasicMaterial({map:tex});const side=M('#ffffff');
  const board=new THREE.Mesh(new THREE.BoxGeometry(4.6,4.6,0.25),[side,side,side,side,face,side]);board.position.set(0,4.2,0.1);board.castShadow=true;mb.add(board);
  box(5,0.4,0.6,'#36536b',0,6.6,0.1,mb);addBox(-11,66,2.5,0.4,0.25);
  pillLabel(mb,'City map',0,7.6,0,'#ffd166',1.1);
}
function pillLabel(parent,text,x,y,z,dot,h){const s=pillSprite(text,dot,h||1.7);s.position.set(x,y,z);parent.add(s);return s;}

/* ================= PLAZA / FOUNTAIN ================= */
const coins=[];let fountainSplash=null;
function buildPlaza(){
  const g=grp(0,0,0);Z.fountain.g=g;
  cyl(5.2,5.6,0.9,'#ebe4d8',0,0.45,0,g,32);cyl(5.4,5.4,0.18,'#d8cfbf',0,0.92,0,g,32);
  const wm=new THREE.MeshPhongMaterial({color:'#6cc6f0',shininess:90,specular:'#ffffff',transparent:true,opacity:0.86});
  const w1=new THREE.Mesh(new THREE.CylinderGeometry(4.75,4.75,0.08,40),wm);w1.position.y=0.86;g.add(w1);
  cyl(0.8,1.1,2.2,'#ebe4d8',0,1.6,0,g,16);cyl(2.4,1.2,0.6,'#ebe4d8',0,2.9,0,g,24);
  const w2=new THREE.Mesh(new THREE.CylinderGeometry(2.25,2.25,0.06,30),wm);w2.position.y=3.17;g.add(w2);
  cyl(0.35,0.5,1.4,'#ebe4d8',0,3.8,0,g,12);sph(0.5,'#ffd166',0,4.7,0,g,12);
  addCircle(0,0,5.6);
  /* water particles */
  const N=420,A=260;const pos=new Float32Array(N*3),vel=new Float32Array(N*3);
  function reset(i){if(i<A){pos[i*3]=0;pos[i*3+1]=4.9;pos[i*3+2]=0;const a=Math.random()*TAU,s=Math.random()*1.0+0.5;vel[i*3]=Math.cos(a)*s;vel[i*3+1]=Math.random()*2+3.4;vel[i*3+2]=Math.sin(a)*s;}
    else{const k=(i-A)%10,a=k/10*TAU;pos[i*3]=Math.cos(a)*5;pos[i*3+1]=1.05;pos[i*3+2]=Math.sin(a)*5;vel[i*3]=-Math.cos(a)*1.55;vel[i*3+1]=2.6+Math.random()*0.4;vel[i*3+2]=-Math.sin(a)*1.55;}}
  for(let i=0;i<N;i++){reset(i);const t0=Math.random()*1.1;pos[i*3]+=vel[i*3]*t0;pos[i*3+1]+=vel[i*3+1]*t0-4.9*t0*t0;pos[i*3+2]+=vel[i*3+2]*t0;vel[i*3+1]-=9.8*t0;}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:'#eaf8ff',size:0.26,transparent:true,opacity:0.85,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
  updaters.push(dt=>{for(let i=0;i<N;i++){vel[i*3+1]-=9.8*dt;pos[i*3]+=vel[i*3]*dt;pos[i*3+1]+=vel[i*3+1]*dt;pos[i*3+2]+=vel[i*3+2]*dt;if(pos[i*3+1]<0.9&&vel[i*3+1]<0)reset(i);}pg.attributes.position.needsUpdate=true;});
  /* saved coins */
  const n=Math.min(40,store.get('wishes',0));for(let i=0;i<n;i++)dropCoin(rr(-3.4,3.4),rr(-3.4,3.4),true);
  /* benches & seated people */
  const BA=[-2.05,-1.1,-0.25,0.5,1.2,1.95,2.65];
  BA.forEach((a,i)=>{const x=Math.cos(a)*12.5,z=Math.sin(a)*12.5;const b=bench(x,z,Math.atan2(-x,-z));
    if(i%2===0){b.userData.seat=i===2?0.6:-0.6;if(i===4)b.userData.full=true;const w=L2W(b,i===2?-0.5:0.4,0.08);const p=staticNPC(w.x,w.z,b.rotation.y,null,'sit',null,-0.18);sitPose(p);
      if(i===4){const w2=L2W(b,-0.6,0.08);const p2=staticNPC(w2.x,w2.z,b.rotation.y,null,(dt,t)=>{p2.userData.head.rotation.y=0.5+Math.sin(t*0.6)*0.15;},"We come here every Sunday after the market.",-0.18);sitPose(p2);p.userData.head.rotation.y=-0.4;}}});
  /* balloon seller */
  const bs=staticNPC(7.5,11.2,-2.4,{shirt:'#ff6f91'},null,"Balloons are free today. Pick any colour.");
  bs.userData.arms[1].rotation.x=-0.3;
  const bw=L2W({position:{x:7.5,z:11.2},rotation:{y:-2.4}},0.45,0.2);balloonCluster(scene,bw.x,1.25,bw.z,7,0.9);
  SPOTS.push({label:'Get a balloon',sub:'Free · pick a happy colour',color:'#ff6f91',tx:6.6,tz:13.6,tr:2.6,run:()=>{giveBalloon();toast("Balloon in hand. Let it go whenever you're ready.");}});
  /* cart */
  const cart=grp(9.6,9.2,-2.4);box(1.8,0.9,1.1,'#ffd166',0,0.85,0,cart);cyl(0.3,0.3,0.1,'#36536b',-0.6,0.3,0.6,cart,10).rotation.x=Math.PI/2;cyl(0.3,0.3,0.1,'#36536b',0.6,0.3,0.6,cart,10).rotation.x=Math.PI/2;addCircle(9.6,9.2,1.1);
  /* frisbee between classes */
  const FA={x:-9.6,z:3.4},FB={x:-3.6,z:10.6},FP=2.3;
  const thr=(p,side)=>(dt,t)=>{idleAnim(p,t);const u=p.userData;const ph=((t/FP)+side)%2;if(ph<0.18)u.arms[1].rotation.x=-1.7*Math.sin(ph/0.18*Math.PI);else if(ph>1.75)u.arms[1].rotation.x=-1.2;};
  const pA=staticNPC(FA.x,FA.z,Math.atan2(FB.x-FA.x,FB.z-FA.z),{shirt:'#2f80d1',pack:false},null,"Frisbee between lectures. You can join.");pA.userData.anim=thr(pA,0);
  const pB=staticNPC(FB.x,FB.z,Math.atan2(FA.x-FB.x,FA.z-FB.z),{shirt:'#ff7a66',pack:false},null,"Best study break there is.");pB.userData.anim=thr(pB,1);
  npcs[npcs.length-2].update=pA.userData.anim;npcs[npcs.length-1].update=pB.userData.anim;
  const disc=cyl(0.26,0.26,0.05,'#ffd23f',0,0,0,null,16,false);
  updaters.push((dt,t)=>{const c=(t/FP)%2;const fwd=c<1;const f=fwd?c:c-1;const a=fwd?FA:FB,b=fwd?FB:FA;disc.position.set(a.x+(b.x-a.x)*f,1.5+Math.sin(f*Math.PI)*1.3,a.z+(b.z-a.z)*f);disc.rotation.y+=dt*16;disc.rotation.z=0.15;});
  Z.fountain.tx=0;Z.fountain.tz=0;Z.fountain.tr=9.5;Z.fountain.spot={x:0,z:9};
}
function dropCoin(x,z,instant){const c=cyl(0.22,0.22,0.06,'#ffcf4a',x,instant?0.84:1.6,z,null,14,false);c.material=new THREE.MeshStandardMaterial({color:'#ffcf4a',metalness:0.6,roughness:0.35});c.rotation.set(rr(-.2,.2),0,rr(-.2,.2));coins.push(c);if(coins.length>40){scene.remove(coins.shift());}return c;}
function tossCoin(){const sx=player.x,sz=player.z;const a=rnd()*TAU,r=rr(2.8,4);const ex=Math.cos(a)*r,ez=Math.sin(a)*r;const c=dropCoin(sx,sz,false);let t=0;const dur=1.1;
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.2,0.32,32),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0}));ring.rotation.x=-Math.PI/2;ring.position.set(ex,0.92,ez);scene.add(ring);
  const fn=dt=>{t+=dt;const k=Math.min(1,t/dur);c.position.set(sx+(ex-sx)*k,1.6+Math.sin(k*Math.PI)*4-(0.76*k),sz+(ez-sz)*k);c.rotation.x+=dt*12;
    if(k>=1){c.position.y=0.84;c.rotation.x=0;const s=1+(t-dur)*14;ring.scale.setScalar(s);ring.material.opacity=Math.max(0,0.9-(t-dur)*1.2);if(t>dur+0.9){scene.remove(ring);updaters.splice(updaters.indexOf(fn),1);}}};
  updaters.push(fn);}

/* ================= HOUSE BUILDER ================= */
function house(g,o){const {w,h,d}=o,zc=o.z||0,fz=zc+d/2;
  box(w,h,d,o.wall,0,h/2,zc,g);box(w+0.3,0.4,d+0.3,o.trim||'#ffffff',0,0.2,zc,g);
  if(o.prism){const k=o.ph||0.55;const r=(d+1.4)/1.732;const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w+1,3,1,false,Math.PI/2),M(o.roof));m.rotation.z=Math.PI/2;m.scale.set(k,1,1);m.position.set(0,h+0.5*r*k,zc);m.castShadow=true;g.add(m);}
  else{box(w+0.8,0.5,d+0.8,o.roof,0,h+0.25,zc,g);box(w+0.8,0.5,0.3,o.trim||'#ffffff',0,h+0.75,zc+d/2+0.25,g);}
  box(2.2,3.25,0.14,'#ffffff',0,1.62,fz+0.03,g);box(1.8,2.95,0.2,o.door||'#7a5236',0,1.48,fz+0.06,g);sph(0.09,'#ffd166',0.6,1.5,fz+0.2,g,6,false);
  for(const sx of [-1,1]){const x=sx*(w/2-w*0.2);box(2.3,1.9,0.12,'#ffffff',x,h*0.52+0.35,fz+0.03,g);const gl=box(2.0,1.6,0.14,'#bfe9ff',x,h*0.52+0.35,fz+0.06,g,false);gl.material=WIN_MAT;
    box(2.3,0.38,0.5,'#b5774e',x,h*0.52-0.75,fz+0.3,g);for(let i=0;i<5;i++)sph(0.17,pick(['#ff6f91','#ffd166','#ffffff','#b28dff']),x-0.9+i*0.45,h*0.52-0.45,fz+0.3,g,6,false);}
  gBox(g,0,zc,w/2+0.1,d/2+0.1);return fz;}
function awning(g,w,y,z,c1,c2,depth){depth=depth||2.2;const n=Math.max(4,Math.round(w/0.8));const sw=w/n;const a=new THREE.Group();a.position.set(0,y,z);a.rotation.x=0.42;g.add(a);
  for(let i=0;i<n;i++){const c=i%2?c2:c1;box(sw,0.1,depth,c,-w/2+sw*(i+0.5),0,depth/2,a);box(sw,0.42,0.06,c,-w/2+sw*(i+0.5),-0.2,depth,a);}return a;}
function zoneGroup(z){const g=grp(z.x,z.z,Math.atan2(-z.x,-z.z));z.g=g;return g;}
function setSpot(z,lx,lz,tr,tlx,tlz){const s=L2W(z.g,lx,lz);z.spot=s;const t=tlx!==undefined?L2W(z.g,tlx,tlz):s;z.tx=t.x;z.tz=t.z;z.tr=tr;}

/* ================= GRATITUDE TREE ================= */
let gratNotes=null;
function buildGratitude(){
  const z=Z.gratitude;const g=zoneGroup(z);
  flat(new THREE.CircleGeometry(9,40),'#c6e9a8',0,0.015,0,1,g);
  cyl(1.2,1.9,7.2,'#8b5a3c',0,3.6,0,g,10);
  for(const [rx,rz,ry] of [[0.8,0,0],[-0.8,0,1.2],[0.7,0,2.4],[-0.6,0,3.6]]){const b=cyl(0.35,0.55,4,'#8b5a3c',0,6.4,0,g,7);b.rotation.set(rx,ry,rz);b.position.set(Math.sin(ry)*1.2,6.6,Math.cos(ry)*1.2);}
  const cpal=['#ff9fc0','#ffb3cf','#f78bb0','#ffc9dc','#8fd57a'];
  for(const [x,y,zz,r] of [[0,9.6,0,5.2],[3.6,8.4,1,3.7],[-3.7,8.6,-0.6,3.9],[1,11.8,-1,3.5],[-1.5,8,3.1,3.3],[1.2,8.1,-3.4,3.4],[-2.6,10.8,1.6,3]]){sph(r,pick(cpal),x,y,zz,g,10);}
  const pl=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.4,0.7,28,1,true),M('#f0d7b0'));pl.material.side=THREE.DoubleSide;pl.position.y=0.35;pl.castShadow=true;g.add(pl);
  const top=new THREE.Mesh(new THREE.TorusGeometry(4.3,0.18,6,40),M('#e6c79b'));top.rotation.x=Math.PI/2;top.position.y=0.72;g.add(top);
  addCircle(z.x,z.z,4.5);
  gratNotes=new THREE.Group();g.add(gratNotes);
  const sway=[];
  z.addNote=function(color,fresh){const a=rnd()*TAU,r=rr(3.6,6.6),y=rr(5.3,7.4);const pv=new THREE.Group();pv.position.set(Math.cos(a)*r,y,Math.sin(a)*r);pv.rotation.y=a+Math.PI/2;gratNotes.add(pv);
    const s=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.8,4),M('#ffffff'));s.position.y=0.4;pv.add(s);
    const n=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.72),new THREE.MeshLambertMaterial({color,side:THREE.DoubleSide,emissive:fresh?color:'#000000',emissiveIntensity:fresh?0.6:0}));n.position.y=-0.36;n.castShadow=true;pv.add(n);
    sway.push({pv,ph:rnd()*TAU,n,glow:fresh?3:0});};
  const NC=['#fff2a8','#ffd1dc','#c8ecff','#d9f7c8','#e6dcff','#ffe0b8'];
  for(let i=0;i<20;i++)z.addNote(pick(NC),false);
  store.get('grat',[]).forEach(n=>z.addNote(n.c||pick(NC),false));
  z.NC=NC;
  updaters.push((dt,t)=>{for(const s of sway){s.pv.rotation.z=Math.sin(t*1.3+s.ph)*0.14;if(s.glow>0){s.glow-=dt;s.n.material.emissiveIntensity=Math.max(0,s.glow/3)*0.6;}}});
  /* little sign, watering person & reader */
  const sg=grp(0,0,0,g);sg.position.set(5.6,0,5.2);box(0.2,1.6,0.2,'#8a5a3b',0,0.8,0,sg);sign('Leave a thank-you',null,'#fff2a8','#6b4a2e',2.6,0.9,sg,0,1.7,0.12);gCircle(g,5.6,5.2,0.5);
  const rw=L2W(g,-3.2,5.6);const reader=staticNPC(rw.x,rw.z,g.rotation.y+Math.PI-0.4,null,(dt,t)=>{idleAnim(reader,t);reader.userData.head.rotation.x=-0.35;},"Someone wrote 'my grandma's chai'. Same!");
  const ww=L2W(g,4.6,-3);const waterer=staticNPC(ww.x,ww.z,g.rotation.y-1.9,{shirt:'#8bd17c'},(dt,t)=>{idleAnim(waterer,t);waterer.userData.arms[1].rotation.x=-1.0+Math.sin(t*1.5)*0.1;},"Even big trees need a little water every day.");
  const can=new THREE.Group();can.position.set(0,-0.7,0.15);waterer.userData.arms[1].add(can);box(0.3,0.28,0.4,'#4fa3e8',0,0,0,can);box(0.05,0.05,0.4,'#4fa3e8',0,0.1,0.32,can).rotation.x=-0.6;
  setSpot(z,0,6.8,7.2,0,0);
}

/* ================= BREATHING GARDEN ================= */
function buildBreath(){
  const z=Z.breath;const g=zoneGroup(z);
  flat(new THREE.CircleGeometry(11,56),'#ece6fb',0,0.035,0,4,g);
  flat(new THREE.RingGeometry(5.3,5.9,56),'#d3c9f6',0,0.04,0,5,g);
  flat(new THREE.RingGeometry(8.6,8.9,56),'#d3c9f6',0,0.04,0,5,g);
  for(let i=0;i<34;i++){const a=i/34*TAU;const d=Math.atan2(Math.sin(a-Math.PI/2),Math.cos(a-Math.PI/2));if(Math.abs(d)<0.32)continue;const x=Math.cos(a)*12.2,zz=Math.sin(a)*12.2;const b=sph(1.25,i%5===0?'#c9a6ff':'#5aa95f',x,0.95,zz,g,8);b.scale.y=0.85;gCircle(g,x,zz,1.1);}
  cyl(1.5,1.9,0.8,'#d8d0f0',0,0.4,0,g,16);gCircle(g,0,0,2);
  const orbM=new THREE.MeshStandardMaterial({color:'#c4b6ff',transparent:true,opacity:0.5,emissive:'#8f7bff',emissiveIntensity:0.35,roughness:.25});
  const orb=new THREE.Mesh(new THREE.SphereGeometry(2.1,28,18),orbM);orb.position.y=3.5;g.add(orb);
  const core=new THREE.Mesh(new THREE.SphereGeometry(0.9,20,14),new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#e8e2ff',emissiveIntensity:0.6}));core.position.y=3.5;g.add(core);
  const words=['Breathe in','Hold','Breathe out','Hold'].map(w=>pillCanvas(w,'#8b7cf0'));
  const texs=words.map(c=>new THREE.CanvasTexture(c));
  const ws=new THREE.Sprite(new THREE.SpriteMaterial({map:texs[0],transparent:true,depthWrite:false,fog:false}));ws.position.y=7;g.add(ws);
  for(let i=0;i<6;i++){const a=i/6*TAU+0.26;const x=Math.cos(a)*9.6,zz=Math.sin(a)*9.6;cyl(0.08,0.1,1.8,'#36536b',x,0.9,zz,g,6);const l=sph(0.3,'#fff',x,1.95,zz,g,8,false);l.material=LANTERN_MAT;}
  const med=[];
  for(const a of [0.3,2.1,3.9,-1.2]){const x=Math.cos(a)*6.6,zz=Math.sin(a)*6.6;const w=L2W(g,x,zz);cyl(0.62,0.62,0.22,pick(['#ffc4d6','#c9e8ff','#ffe3a3']),w.x,0.11,w.z,null,14);
    const p=staticNPC(w.x,w.z,Math.atan2(z.x-w.x,z.z-w.z),null,(dt,t)=>{},"I just sit and breathe here. No rules.",-0.52);crossPose(p);med.push(p);}
  updaters.push((dt,t)=>{const c=t%16;let s,ph;if(c<4){ph=0;s=0.72+0.5*(c/4);}else if(c<8){ph=1;s=1.22;}else if(c<12){ph=2;s=1.22-0.5*((c-8)/4);}else{ph=3;s=0.72;}
    if(BREATH.active){const d=BREATH.target-BREATH.cur;BREATH.cur+=Math.sign(d)*Math.min(Math.abs(d),BREATH.rate*dt);s=BREATH.cur;ph=BREATH.word;}else BREATH.cur=s;
    const e=s;orb.scale.setScalar(e);core.scale.setScalar(0.8+e*0.35);if(ws.material.map!==texs[ph]){ws.material.map=texs[ph];ws.material.needsUpdate=true;const cv=words[ph];ws.scale.set(1.7*cv.width/cv.height,1.7,1);}
    med.forEach(p=>{p.userData.body.scale.setScalar(1+(e-0.72)*0.03);});});
  {const cv=words[0];ws.scale.set(1.7*cv.width/cv.height,1.7,1);}
  {const sa=1.15,sw=L2W(g,Math.cos(sa)*6.6,Math.sin(sa)*6.6);cyl(0.62,0.62,0.22,'#ffe3a3',sw.x,0.11,sw.z,null,14);
   z.seat={x:sw.x,z:sw.z,rot:Math.atan2(z.x-sw.x,z.z-sw.z),y:-0.52,exit:L2W(g,0,9),pose:POSE.cross,camOff:Math.PI-0.6,dist:8.5,pitch:0.35};}
  setSpot(z,0,8.5,9.5,0,4);
}

/* ================= WORRY LAKE ================= */
const boats=[];let lakeU=null;
function onDock(x,z){if(!lakeU)return false;const dx=x-LAKE.x,dz=z-LAKE.z;const s=dx*lakeU.x+dz*lakeU.z;const p=Math.abs(dx*lakeU.z-dz*lakeU.x);return s>5.6&&s<16.4&&p<1.25;}
function inWater(x,z){const dx=x-LAKE.x,dz=z-LAKE.z;return dx*dx+dz*dz<(LAKE.r+0.4)*(LAKE.r+0.4)&&!onDock(x,z);}
function paperBoat(color){const g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:color||'#ffffff',transparent:true,opacity:1,flatShading:true});
  const h=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.35,0.35,4,1),m);h.rotation.y=Math.PI/4;h.scale.set(1.5,1,0.6);h.position.y=0.17;g.add(h);
  const s=new THREE.Mesh(new THREE.ConeGeometry(0.42,0.8,4),m);s.position.y=0.65;s.scale.z=0.35;g.add(s);g.userData.m=m;return g;}
function buildLake(){
  const z=Z.worry;const c=LAKE;
  lakeU={x:-c.x/Math.hypot(c.x,c.z),z:-c.z/Math.hypot(c.x,c.z)};
  const wm=new THREE.MeshPhongMaterial({color:'#58bde9',shininess:100,specular:'#ffffff',transparent:true,opacity:0.94,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-6});
  const water=new THREE.Mesh(new THREE.CircleGeometry(c.r,72),wm);water.rotation.x=-Math.PI/2;water.position.set(c.x,0.06,c.z);water.receiveShadow=true;scene.add(water);
  flat(new THREE.RingGeometry(c.r,c.r+2.3,72),'#f3e2b8',c.x,0.045,c.z,2);
  flat(new THREE.CircleGeometry(c.r*0.55,48),'#4aaee0',c.x,0.065,c.z,4);
  /* ripples */
  const rips=[];for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.RingGeometry(0.92,1,40),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;scene.add(m);rips.push({m,t:i*0.9,x:0,z:0});}
  updaters.push(dt=>{for(const r of rips){r.t+=dt;if(r.t>4.5){r.t=0;const a=Math.random()*TAU,d=Math.random()*(c.r-4);r.x=c.x+Math.cos(a)*d;r.z=c.z+Math.sin(a)*d;}r.m.position.set(r.x,0.09,r.z);r.m.scale.setScalar(0.5+r.t*1.2);r.m.material.opacity=Math.max(0,0.5*(1-r.t/4.5));}});
  /* reeds, rocks, lily pads */
  for(let i=0;i<40;i++){const a=rnd()*TAU;const d=Math.atan2(Math.sin(a-Math.atan2(lakeU.z,lakeU.x)),Math.cos(a-Math.atan2(lakeU.z,lakeU.x)));if(Math.abs(d)<0.25)continue;const r=c.r+rr(-0.4,0.8);const x=c.x+Math.cos(a)*r,zz=c.z+Math.sin(a)*r;
    if(i%3===0){const m=sph(rr(0.4,0.8),'#b8c2cc',x,0.2,zz,null,6);m.scale.y=0.6;}else{for(let k=0;k<3;k++){cone(0.06,rr(1,1.8),'#5f9e4f',x+rr(-.3,.3),0.6,zz+rr(-.3,.3),null,4,false);}}}
  for(let i=0;i<10;i++){const a=rnd()*TAU,d=rr(4,c.r-1.5);const x=c.x+Math.cos(a)*d,zz=c.z+Math.sin(a)*d;if(onDock(x,zz))continue;const l=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.7,0.04,14,1,false,0,TAU-0.6),M('#5fb35a'));l.position.set(x,0.1,zz);l.rotation.y=rnd()*TAU;scene.add(l);if(i%3===0)sph(0.18,'#ffb3cf',x+0.2,0.22,zz,null,6,false);}
  /* dock */
  const dg=grp(c.x,c.z,Math.atan2(lakeU.x,lakeU.z));
  for(let s=5.6;s<16.4;s+=0.62)box(2.6,0.14,0.52,s%1.24<0.62?'#c48a5a':'#b47d50',0,0.36,s,dg);
  for(const s of [6,10,14])for(const sx of [-1.25,1.25]){cyl(0.12,0.12,1.4,'#7a5236',sx,0.2,s,dg,6);}
  for(const sx of [-1.25,1.25]){cyl(0.07,0.07,0.9,'#7a5236',sx,0.8,6,dg,6);}
  /* ducks */
  const ducks=[];for(let i=0;i<5;i++){const d=new THREE.Group();const b=sph(0.38,'#ffd84a',0,0.25,0,d,8);b.scale.set(1,0.8,1.4);sph(0.24,'#ffd84a',0,0.62,0.38,d,8);cone(0.08,0.24,'#ff8f3a',0,0.6,0.66,d,6).rotation.x=Math.PI/2;
    if(i===0){d.scale.setScalar(1.3);}if(i>2){d.scale.setScalar(0.6);}scene.add(d);ducks.push({d,R:rr(5,11),sp:rr(0.08,0.18)*(i%2?1:-1),ph:i<3?rnd()*TAU:ducks[0]?ducks[0].ph-0.2*(i-2):0});}
  for(let i=3;i<5;i++){ducks[i].R=ducks[0].R;ducks[i].sp=ducks[0].sp;ducks[i].ph=ducks[0].ph-Math.sign(ducks[0].sp)*0.12*(i-2);}
  updaters.push((dt,t)=>{for(const k of ducks){const a=k.ph+t*k.sp;k.d.position.set(c.x+Math.cos(a)*k.R,0.08+Math.sin(t*2+k.ph)*0.03,c.z+Math.sin(a)*k.R);const sg=Math.sign(k.sp);k.d.rotation.y=Math.atan2(-Math.sin(a)*sg,Math.cos(a)*sg);}});
  /* ambient paper boats */
  const ab=[];for(let i=0;i<3;i++){const b=paperBoat(pick(['#ffffff','#fff2a8','#ffd1dc']));scene.add(b);ab.push({b,R:rr(6,10),sp:rr(0.04,0.08),ph:rnd()*TAU});}
  updaters.push((dt,t)=>{for(const k of ab){const a=k.ph+t*k.sp;k.b.position.set(c.x+Math.cos(a)*k.R,0.08+Math.sin(t*1.6+k.ph)*0.04,c.z+Math.sin(a)*k.R);k.b.rotation.set(Math.sin(t*1.3+k.ph)*0.06,-a,Math.sin(t*1.1)*0.05);}});
  /* released boats */
  updaters.push((dt)=>{for(let i=boats.length-1;i>=0;i--){const b=boats[i];b.t+=dt;b.b.position.x+=b.vx*dt;b.b.position.z+=b.vz*dt;b.b.position.y=0.1+Math.sin(b.t*2)*0.04;b.b.rotation.z=Math.sin(b.t*1.5)*0.08;
    if(b.t>9){const k=(b.t-9)/5;b.b.userData.m.opacity=Math.max(0,1-k);b.b.position.y-=k*0.3;b.b.scale.setScalar(1-k*0.4);if(k>=1){scene.remove(b.b);boats.splice(i,1);}}}});
  /* fisher on dock */
  const fw=L2W(dg,0.5,6.1);const fisher=staticNPC(fw.x,fw.z,dg.rotation.y+Math.PI,{shirt:'#ffd166'},(dt,t)=>{fisher.userData.arms[1].rotation.x=-1.1+Math.sin(t*0.8)*0.06;},"I don't catch fish. I just like sitting here.",-0.12);
  fisher.userData.legs.forEach(l=>l.rotation.x=-1.2);fisher.userData.arms[0].rotation.x=-0.5;
  const rod=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.04,3.4,5),M('#6b4a2e'));rod.position.set(0,-0.6,1.4);rod.rotation.x=1.1;fisher.userData.arms[1].add(rod);
  /* lake-side bench */
  const bw=L2W(dg,-7.6,16.4);const lb=bench(bw.x,bw.z,dg.rotation.y+Math.PI);const sw=L2W(lb,0.3,0.08);const sitter=staticNPC(sw.x,sw.z,lb.rotation.y,null,'sit',"I come here between classes to watch the ducks.",-0.18);sitPose(sitter);lb.userData.seat=-0.7;
  z.dock=dg;
  const spot=L2W(dg,0,16.9);z.spot=spot;const tt=L2W(dg,0,11);z.tx=tt.x;z.tz=tt.z;z.tr=6.6;
}
function launchBoat(text){const z=Z.worry;const s=L2W(z.dock,0,5.4);const b=paperBoat(pick(['#ffffff','#fff2a8','#ffd1dc','#d6ecff']));b.position.set(s.x,0.1,s.z);b.rotation.y=Math.atan2(-lakeU.x,-lakeU.z);b.scale.setScalar(1.3);scene.add(b);
  const ang=Math.atan2(-lakeU.z,-lakeU.x)+rr(-0.4,0.4);boats.push({b,t:0,vx:Math.cos(ang)*1.15,vz:Math.sin(ang)*1.15});}

/* ================= MOOD CAFÉ ================= */
function buildCafe(){
  const z=Z.mood;const g=zoneGroup(z);
  const fz=house(g,{w:12,h:5.6,d:8,z:-3,wall:'#ffc29b',roof:'#e8704f',trim:'#fff4e6',door:'#8a4f33'});
  awning(g,12.4,4.6,fz+0.05,'#ff7a66','#ffffff',2.4);
  sign('Mood Café','cocoa · tea · check-ins','#7a3e26','#ffe6c9',6.4,1.7,g,0,7.35,fz+0.55);
  const cup=grp(3.6,-4.6,0.3,g);cup.position.y=6.1;cyl(1.25,0.95,1.7,'#ffffff',0,0.85,0,cup,16);cyl(1.12,1.12,0.06,'#7a4a2a',0,1.66,0,cup,16);const hd=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.13,6,14),M('#ffffff'));hd.position.set(1.25,0.85,0);hd.rotation.y=0;cup.add(hd);
  const steam=[];for(let i=0;i<4;i++){const s=sph(0.3,'#ffffff',0,0,0,cup,8,false);s.material=new THREE.MeshLambertMaterial({color:'#ffffff',transparent:true,opacity:0.7});steam.push({s,ph:i/4});}
  updaters.push((dt,t)=>{for(const q of steam){const k=(t*0.3+q.ph)%1;q.s.position.set(Math.sin(k*6+q.ph*5)*0.3,1.8+k*2.6,0);q.s.scale.setScalar(0.6+k*1.2);q.s.material.opacity=0.7*(1-k);}});
  flat(new THREE.PlaneGeometry(15,8),'#f7dcc6',0,0.035,5,4,g);
  for(let i=-7;i<=7;i+=1)flat(new THREE.PlaneGeometry(0.06,8),'#efcdb2',i,0.04,5,5,g);
  const tables=[[-4.8,4.4,'#ff8f7a'],[4.8,4.4,'#4fc3a1'],[-4.8,7.6,'#ffd166'],[4.8,7.6,'#b28dff']];
  tables.forEach(([lx,lz,uc],i)=>{const t=grp(lx,lz,0,g);cyl(0.85,0.85,0.08,'#ffffff',0,0.95,0,t,16);cyl(0.07,0.07,0.95,'#556677',0,0.47,0,t,6);cyl(0.42,0.42,0.05,'#556677',0,0.03,0,t,10);cyl(0.05,0.05,2.6,'#ffffff',0,2.2,0,t,6);cone(1.9,0.8,uc,0,3.3,0,t,8);sph(0.1,'#ffffff',0,3.75,0,t,6,false);cyl(0.09,0.07,0.16,'#ffffff',0.3,1.07,0.1,t,8,false);cyl(0.09,0.07,0.16,'#ffffff',-0.3,1.07,-0.1,t,8,false);
    for(const sx of [-1,1]){box(0.62,0.08,0.62,'#ffd27a',sx*1.3,0.55,0,t);box(0.08,0.6,0.62,'#ffd27a',sx*1.6,0.85,0,t);cyl(0.05,0.05,0.55,'#556677',sx*1.3,0.27,0,t,5,false);}
    gCircle(g,lx,lz,1.1);
    if(i<2){const sides=[i===0?1:-1];sides.forEach(sx=>{const w=L2W(g,lx+sx*1.3,lz);const p=staticNPC(w.x,w.z,g.rotation.y+(sx<0?Math.PI/2:-Math.PI/2),null,(dt,t)=>{p.userData.arms[1].rotation.x=-0.9+Math.max(0,Math.sin(t*0.5+p.userData.phase))*-0.5;p.userData.head.rotation.x=Math.sin(t*0.5+p.userData.phase)*0.08;},pick(["The barista asked how I was. Like, actually asked.","We're doing a slow chai date.","I said I was tired. They gave me cocoa and told me to sleep early."]),-0.16);sitPose(p);});}});
  /* menu board */
  const mb=grp(6.9,1.8,-0.3,g);const b1=box(1.4,1.8,0.1,'#2c3a4f',0,0.95,0.15,mb);b1.rotation.x=-0.18;sign('Today','check in, sip slow','#2c3a4f','#ffffff',1.2,0.8,mb,0,1.2,0.33,0).rotation.x=-0.18;gCircle(g,6.9,1.8,0.7);
  /* waiter */
  const a=L2W(g,-2.6,3.2),b=L2W(g,2.6,3.2),c2=L2W(g,2.6,6),d=L2W(g,-2.6,6);
  const wtr=pathWalker([a,b,c2,d],1.1,{shirt:'#ffffff',pants:'#2f3a4f',pack:false});
  {const w=L2W(g,3.5,7.6);z.cafeSeat={x:w.x,z:w.z,rot:g.rotation.y+Math.PI/2,y:-0.16,exit:L2W(g,2.2,9.6),pose:POSE.sit,camOff:0.9,dist:6.5,pitch:0.3};}
  setSpot(z,0,2.7,3.6);
}

/* ================= KINDNESS POST ================= */
function buildPost(){
  const z=Z.kind;const g=zoneGroup(z);
  const fz=house(g,{w:10,h:5,d:8,z:-3,wall:'#a8e6cf',roof:'#2f8f83',trim:'#ffffff',door:'#e2504f',prism:true,ph:0.55});
  sign('Kindness Post','letters for whoever needs them','#e2504f','#ffffff',3.6,1.1,g,0,4.35,fz+0.2);
  flat(new THREE.PlaneGeometry(12,6),'#e7f6ee',0,0.035,4,4,g);
  /* mailbox */
  const mbx=grp(4,3.2,-0.4,g);cyl(0.12,0.12,1,'#36536b',0,0.5,0,mbx,6);box(1.3,1.5,1.1,'#e2504f',0,1.75,0,mbx);const top=new THREE.Mesh(new THREE.CylinderGeometry(0.65,0.65,1.1,14,1,false,0,Math.PI),M('#e2504f'));top.rotation.set(Math.PI/2,0,Math.PI/2);top.position.set(0,2.5,0);top.castShadow=true;mbx.add(top);box(0.8,0.1,0.06,'#1d2b44',0,2.2,0.56,mbx);sph(0.28,'#ffd166',0,3.25,0,mbx,8);
  gCircle(g,4,3.2,0.9);
  const mw=L2W(mbx,0,0.6);const target=new THREE.Vector3(L2W(g,4,3.8).x,2.3,L2W(g,4,3.8).z);z.slot=target;
  /* flying envelopes */
  const envs=[];const em=new THREE.MeshLambertMaterial({color:'#fffdf4',side:THREE.DoubleSide});const hm=new THREE.MeshLambertMaterial({color:'#ff6f91',side:THREE.DoubleSide});
  for(let i=0;i<5;i++){const e=new THREE.Group();const p=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.46),em);e.add(p);const h=new THREE.Mesh(new THREE.CircleGeometry(0.08,8),hm);h.position.z=0.01;e.add(h);scene.add(e);envs.push({e,ph:i/5,a:rnd()*TAU});}
  updaters.push((dt,t)=>{for(const v of envs){const k=(t*0.12+v.ph)%1;if(k<0.02)v.a=Math.random()*TAU;const sx=target.x+Math.cos(v.a)*14,sz=target.z+Math.sin(v.a)*14;const x=sx+(target.x-sx)*k,zz=sz+(target.z-sz)*k;const y=target.y+Math.sin(k*Math.PI)*6+ (1-k)*3;v.e.position.set(x,y,zz);v.e.rotation.set(Math.sin(t*3+v.ph*9)*0.4,Math.atan2(target.x-sx,target.z-sz),Math.sin(t*4+v.ph*5)*0.3);const s=k>0.92?(1-k)/0.08:1;v.e.scale.setScalar(Math.max(0.01,s));}});
  /* letter writer */
  const desk=grp(-4,3.6,0.2,g);box(1.6,0.08,0.9,'#c98b55',0,0.95,0,desk);for(const sx of [-0.7,0.7])box(0.08,0.95,0.8,'#a46d3f',sx,0.47,0,desk);box(0.5,0.02,0.36,'#ffffff',0.1,1,0,desk,false);gCircle(g,-4,3.6,0.9);
  const sw=L2W(g,-4,4.6);box(0.6,0.08,0.6,'#ffd27a',sw.x,0.55,sw.z,null);
  const wr=staticNPC(sw.x,sw.z,g.rotation.y+Math.PI+0.2,{shirt:'#b28dff'},(dt,t)=>{wr.userData.arms[1].rotation.x=-1.15+Math.sin(t*6)*0.05;wr.userData.arms[0].rotation.x=-1.0;wr.userData.head.rotation.x=0.3;},"Writing to my best friend. Old-school, with stamps.",-0.16);sitPose(wr);
  /* poster */
  const mp=L2W(g,2.8,5);const poster=staticNPC(mp.x,mp.z,g.rotation.y-0.9,{shirt:'#7aa7ff'},(dt,t)=>{const k=(Math.sin(t*0.9)+1)/2;poster.userData.arms[1].rotation.x=-1.6*k;},"Posting a thank-you note to my school teacher.");
  setSpot(z,0,2.7,3.6);
}

/* ================= ARCADE ================= */
function buildArcade(){
  const z=Z.arcade;const g=zoneGroup(z);
  const fz=house(g,{w:12,h:6.4,d:9,z:-3.5,wall:'#d4c0ff',roof:'#7c4fd0',trim:'#ffffff',door:'#5b3aa8'});
  sign('Thought Bubble Arcade','pop the thoughts that weigh you down','#2a1f4f','#ffd6ff',8.4,1.9,g,0,8.25,fz+0.6);
  for(const sx of [-1,1]){const n=box(0.25,6,0.25,'#ff7fe0',sx*6.05,3.2,fz+0.02,g,false);n.material=new THREE.MeshStandardMaterial({color:'#ff9fe9',emissive:'#ff5fd0',emissiveIntensity:0.6});}
  flat(new THREE.PlaneGeometry(14,6),'#efe8ff',0,0.035,3.6,4,g);
  for(let i=-6;i<=6;i+=2)flat(new THREE.PlaneGeometry(1,6),i%4===0?'#e2d6ff':'#f6f1ff',i+0.5,0.04,3.6,5,g);
  for(const sx of [-1,1]){const cb=grp(sx*4.6,2,sx*-0.25,g);box(1.1,2.1,0.9,sx<0?'#ffd166':'#4fc3a1',0,1.05,0,cb);const sc=box(0.8,0.6,0.06,'#000',0,1.55,0.46,cb,false);sc.material=new THREE.MeshStandardMaterial({color:'#7fe9ff',emissive:'#4fd5ff',emissiveIntensity:0.9});box(1.1,0.1,0.5,'#1d2b44',0,1.1,0.55,cb);gCircle(g,sx*4.6,2,0.8);}
  const pw=L2W(g,4.6,3.3);const gamer=staticNPC(pw.x,pw.z,g.rotation.y+Math.PI+0.25,{phones:true},(dt,t)=>{const u=gamer.userData;u.arms[0].rotation.x=-1.2+Math.sin(t*14)*0.08;u.arms[1].rotation.x=-1.2+Math.cos(t*13)*0.08;u.body.position.y=Math.abs(Math.sin(t*2))*0.03;},"I popped 'I'm always behind'. Felt good.");
  const bubbles=[];const bc=['#ffd6ff','#c9f1ff','#fff2b3','#d6ffe8','#e3d6ff'];
  for(let i=0;i<26;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(rr(0.25,0.7),16,12),new THREE.MeshStandardMaterial({color:pick(bc),transparent:true,opacity:0.55,roughness:0.1,emissive:'#ffffff',emissiveIntensity:0.15}));scene.add(m);const w=L2W(g,rr(-7,7),rr(-7,7));bubbles.push({m,x:w.x,z:w.z,y:rr(0,12),sp:rr(0.5,1.2),ph:rnd()*TAU});}
  updaters.push((dt,t)=>{for(const b of bubbles){b.y+=b.sp*dt;if(b.y>13){b.y=0;}b.m.position.set(b.x+Math.sin(t+b.ph)*0.5,b.y,b.z+Math.cos(t*0.8+b.ph)*0.5);}});
  setSpot(z,0,2.6,3.6);
}

/* ================= SOUND PAVILION ================= */
function buildSound(){
  const z=Z.sound;const g=zoneGroup(z);
  cyl(6,6.3,0.45,'#fff6ea',0,0.22,0,g,8);box(3,0.22,1.2,'#f1e4cf',0,0.11,6.6,g);
  for(let i=0;i<8;i++){const a=i/8*TAU+Math.PI/8;const x=Math.cos(a)*5.4,zz=Math.sin(a)*5.4;cyl(0.22,0.22,4.2,'#ffffff',x,2.55,zz,g,8);gCircle(g,x,zz,0.35);}
  cone(7.6,3.2,'#2bb59a',0,6.25,0,g,8);cyl(7.5,7.5,0.35,'#ffffff',0,4.8,0,g,8);sph(0.55,'#ffd166',0,8.1,0,g,10);
  const chimes=[];for(let i=0;i<10;i++){const a=i/10*TAU;const pv=new THREE.Group();pv.position.set(Math.cos(a)*4.6,4.55,Math.sin(a)*4.6);g.add(pv);const L=rr(0.7,1.5);const m=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,L,8),new THREE.MeshStandardMaterial({color:i%2?'#e8eef5':'#ffd98a',metalness:0.5,roughness:0.3}));m.position.y=-L/2-0.2;pv.add(m);chimes.push({pv,ph:rnd()*TAU});}
  updaters.push((dt,t)=>{for(const c of chimes){c.pv.rotation.z=Math.sin(t*1.7+c.ph)*0.18;c.pv.rotation.x=Math.cos(t*1.3+c.ph)*0.12;}});
  /* musician */
  const sw=L2W(g,-1.6,-1.8);cyl(0.35,0.35,0.6,'#a46d3f',sw.x,0.75,sw.z,null,10);
  const mus=staticNPC(sw.x,sw.z,g.rotation.y+0.3,{shirt:'#ff9fc6'},(dt,t)=>{mus.userData.arms[1].rotation.x=-0.9+Math.sin(t*7)*0.25;mus.userData.head.rotation.z=Math.sin(t*1.5)*0.1;},"Just practising. Request a song if you like.",0.27);sitPose(mus);mus.userData.arms[0].rotation.set(-1.2,0,0.5);
  const gt=new THREE.Group();gt.position.set(0.05,1.25,0.35);gt.rotation.z=0.9;mus.userData.body.add(gt);const gb=sph(0.32,'#c47a3a',0,-0.15,0,gt,10);gb.scale.set(1,1.1,0.4);box(0.1,0.9,0.06,'#6b4a2e',0,0.45,0,gt);
  const dw=L2W(g,1.8,-1.4);cyl(0.5,0.5,0.7,'#ff8f7a',dw.x,0.8,dw.z,null,14);cyl(0.52,0.52,0.05,'#ffffff',dw.x,1.17,dw.z,null,14);
  const dr=staticNPC(L2W(g,2.6,-2.1).x,L2W(g,2.6,-2.1).z,g.rotation.y-0.7,{shirt:'#4fc3a1'},(dt,t)=>{dr.userData.arms[0].rotation.x=-1+Math.max(0,Math.sin(t*5))*-0.3;dr.userData.arms[1].rotation.x=-1+Math.max(0,Math.sin(t*5+Math.PI))*-0.3;},"Tap along if you want. No wrong notes.",0.45);
  /* floating notes */
  const nt=[];const glyphs=['♪','♫','♩','♬'];
  for(let i=0;i<8;i++){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=pick(['#1fa98a','#ff6f91','#7c4fd0','#e48a12']);x.font='700 100px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(glyphs[i%4],64,70);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.set(0.9,0.9,1);scene.add(s);nt.push({s,ph:i/8});}
  const base=L2W(g,0,-1.6);
  updaters.push((dt,t)=>{for(const n of nt){const k=(t*0.18+n.ph)%1;n.s.position.set(base.x+Math.sin(k*8+n.ph*20)*1.5,1.8+k*6,base.z+Math.cos(k*6+n.ph*10)*1.5);n.s.material.opacity=k<0.15?k/0.15:1-(k-0.15)/0.85;}});
  {const w=L2W(g,0.4,2.6);z.seat={x:w.x,z:w.z,rot:g.rotation.y+Math.PI,y:-0.29,exit:L2W(g,0,7.4),pose:POSE.listen,camOff:0.8,dist:8,pitch:0.3};}
  setSpot(z,0,7.6,6.6,0,0);z.floor=true;
}

/* ================= STRETCH LAWN ================= */
let kite=null;
function buildYoga(){
  const z=Z.yoga;const g=grp(z.x,z.z,0);z.g=g;
  flat(new THREE.CircleGeometry(8.4,40),'#a6e383',0,0.02,0,2,g);
  const mats=['#ff9fc6','#7aa7ff','#ffd166','#4fc3a1','#b28dff','#ff9a5c'];
  let i=0;
  for(const row of [0.4,3.4])for(const col of [-3.2,0,3.2]){flat(new THREE.PlaneGeometry(1.1,2.2),mats[i],col,0.04,row,4,g);const w=L2W(g,col,row);
    const off=i*0.5,sd=i%2?1:-1;const p=staticNPC(w.x,w.z,Math.PI,null,(dt,t)=>{const u=p.userData;if(YOGA.active){stretchPose(p,YOGA.move,t+off*0.05);return;}resetPose(p);const k=Math.sin(t*0.9+off*0.3);const a=1.6+1.35*k;u.arms[0].rotation.z=-a;u.arms[1].rotation.z=a;u.body.rotation.z=Math.max(0,Math.sin(t*0.45+off*0.3))*0.18*sd;},pick(["My shoulders were so tight after the lab.","I sit for eight hours a day. This helps.","Stretching between classes is my secret."]));i++;}
  const iw=L2W(g,0,-3.2);const ins=staticNPC(iw.x,iw.z,0,{shirt:'#5aa63a',pack:false},(dt,t)=>{const u=ins.userData;if(YOGA.active){stretchPose(ins,YOGA.move,t);return;}resetPose(ins);const k=Math.sin(t*0.9);const a=1.6+1.35*k;u.arms[0].rotation.z=-a;u.arms[1].rotation.z=a;},"Hi! Stretch with us. Any level is fine, even just arms.");
  flat(new THREE.PlaneGeometry(1.3,2.4),'#5aa63a',0,0.045,-3.2,5,g);
  flat(new THREE.PlaneGeometry(1.1,2.2),'#ff6b57',-6.4,0.04,1.9,4,g);{const w=L2W(g,-6.4,1.9);z.seat={x:w.x,z:w.z,rot:Math.PI,y:0,exit:L2W(g,-6.4,4.2),pose:POSE.stretch,camOff:0.65,dist:8.5,pitch:0.25};}
  /* kite flyer */
  const kx=z.x+10,kz=z.z+7;const flyer=staticNPC(kx,kz,Math.PI,{shirt:'#ffd166',pack:false},(dt,t)=>{flyer.userData.arms[1].rotation.x=-2.2+Math.sin(t*1.3)*0.15;flyer.userData.arms[0].rotation.x=-1.6;},"Learnt kite flying from my grandfather. Still not as good as him.");
  const kg=new THREE.Group();const km=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.6),new THREE.MeshLambertMaterial({color:'#ff6f91',side:THREE.DoubleSide}));km.rotation.z=Math.PI/4;km.scale.set(1,1.3,1);kg.add(km);
  const k2=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.8),new THREE.MeshLambertMaterial({color:'#ffd166',side:THREE.DoubleSide}));k2.rotation.z=Math.PI/4;k2.position.z=0.01;k2.scale.set(1,1.3,1);kg.add(k2);scene.add(kg);
  const tail=[];for(let j=0;j<6;j++){const b=sph(0.14,BUNT[j%BUNT.length],0,0,0,null,6,false);tail.push(b);}
  const lp=new Float32Array(6);const lgeo=new THREE.BufferGeometry();lgeo.setAttribute('position',new THREE.BufferAttribute(lp,3));const line=new THREE.Line(lgeo,new THREE.LineBasicMaterial({color:'#ffffff'}));line.frustumCulled=false;scene.add(line);
  updaters.push((dt,t)=>{const x=kx+Math.sin(t*0.4)*3,y=19+Math.sin(t*0.7)*1.6,zz=kz-13+Math.cos(t*0.33)*2;kg.position.set(x,y,zz);kg.rotation.set(0,Math.sin(t*0.5)*0.3,Math.sin(t*0.9)*0.25);
    tail.forEach((b,j)=>{b.position.set(x+Math.sin(t*1.5-j*0.6)*0.4*(j+1)*0.3,y-1.3-j*0.55,zz+Math.cos(t*1.2-j*0.5)*0.2);});
    lp[0]=kx-0.2;lp[1]=2.5;lp[2]=kz-0.4;lp[3]=x;lp[4]=y-0.9;lp[5]=zz;lgeo.attributes.position.needsUpdate=true;});
  z.spot={x:z.x+8,z:z.z+0.5};z.tx=z.x;z.tz=z.z;z.tr=12;
}

/* ================= TALK BOOTH ================= */
function buildHelp(){
  const z=Z.help;const g=zoneGroup(z);
  const fz=house(g,{w:10,h:4.8,d:8,z:-2.5,wall:'#ffe1bd',roof:'#e48a12',trim:'#fffaf2',door:'#7a4a2a',prism:true,ph:0.6});
  sign('Support Booth','real people · free · kind','#e48a12','#ffffff',4.4,1.2,g,0,4.45,fz+0.22);
  const hs=new THREE.Shape();hs.moveTo(0,0.3);hs.bezierCurveTo(0,0.6,-0.5,0.6,-0.5,0.3);hs.bezierCurveTo(-0.5,0,0,-0.15,0,-0.45);hs.bezierCurveTo(0,-0.15,0.5,0,0.5,0.3);hs.bezierCurveTo(0.5,0.6,0,0.6,0,0.3);
  const heart=new THREE.Mesh(new THREE.ExtrudeGeometry(hs,{depth:0.25,bevelEnabled:false}),M('#ff7f8f'));heart.position.set(0,8.3,-2.5);heart.scale.setScalar(1.5);g.add(heart);
  updaters.push((dt,t)=>{heart.rotation.y=Math.sin(t*0.6)*0.5;heart.position.y=8.3+Math.sin(t*1.1)*0.12;});
  /* little porch garden */
  flat(new THREE.PlaneGeometry(10,5),'#f6e9d6',0,0.035,4.4,4,g);
  for(const sx of [-3.8,3.8]){cyl(0.55,0.45,0.75,'#e88a62',sx,0.37,3.2,g,12);sph(0.75,'#5dbb63',sx,1.15,3.2,g,8);}
  const bw=L2W(g,-3.2,5.6);bench(bw.x,bw.z,g.rotation.y);
  const vw=L2W(g,2.4,3.4);staticNPC(vw.x,vw.z,g.rotation.y,{shirt:'#ffd166',pack:false},(dt,t)=>{const u=vol.userData;const near=Math.hypot(player.x-vol.position.x,player.z-vol.position.z)<9;u.arms[1].rotation.z=near?2.5+Math.sin(t*7)*0.35:0.05;},"Hi, I'm Kiran. I volunteer here. Come in whenever you like.");
  const vol=npcs[npcs.length-1].p;
  setSpot(z,0,2.7,3.6);
}

/* ================= STUDY HALL ================= */
function laptop(parent,lx,lz,sx,sz){const l=grp(lx,lz,Math.atan2(sx-lx,sz-lz),parent);l.position.y=0.99;box(0.52,0.03,0.36,'#c9ced6',0,0,0,l,false);const s=box(0.52,0.34,0.02,'#c9ced6',0,0.17,-0.18,l,false);s.rotation.x=-0.25;const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.46,0.28),SCREEN_MAT);sc.position.set(0,0.17,-0.165);sc.rotation.x=-0.25;l.add(sc);return l;}
function buildStudy(){
  const z=Z.study;const g=zoneGroup(z);
  const fz=house(g,{w:14,h:6,d:9,z:-3.5,wall:'#ebe5da',roof:'#33415c',trim:'#ffffff',door:'#33415c'});
  sign('Study Hall','focus together · rest on time','#33415c','#ffffff',6,1.6,g,0,7.35,fz+0.55);
  flat(new THREE.PlaneGeometry(15,8),'#e8e6f2',0,0.035,5,4,g);
  const seated=[];
  for(const tx of [-4,4]){box(1.5,0.08,3.6,'#b98a5e',tx,0.95,5,g);for(const tz of [3.5,6.5])for(const lx of [-0.6,0.6])box(0.08,0.95,0.08,'#6b4a2e',tx+lx,0.47,tz,g,false);gBox(g,tx,5,0.8,1.85);
    for(let k=0;k<4;k++)box(0.3,0.08,0.22,pick(['#ff6b57','#2f80d1','#ffd23f','#2fb08c']),tx+rr(-0.3,0.3),1.03+k*0.08,3.6,g,false);
    for(const side of [-1,1])for(const tz of [4,6]){const cx=tx+side*1.15;box(0.55,0.08,0.55,'#33415c',cx,0.55,tz,g);box(0.08,0.55,0.55,'#33415c',cx+side*0.28,0.83,tz,g);seated.push({cx,tz,side,tx});}}
  const SL=["Studying outside today. The breeze helps.","We study quietly, but together. It helps.","Taking my five-minute break like a responsible adult.","Notes, highlighters and way too much chai.","The library inside has beanbags. Just saying."];
  seated.forEach((s,i)=>{const lr=s.side<0?Math.PI/2:-Math.PI/2;laptop(g,s.tx+s.side*0.4,s.tz,s.cx,s.tz);const w=L2W(g,s.cx,s.tz);
    
    if(i%2===1)return;const p=staticNPC(w.x,w.z,g.rotation.y+lr,{phones:i%4===0},(dt,t)=>{const u=p.userData;u.arms[0].rotation.x=-1.25+Math.sin(t*13+u.phase)*0.05;u.arms[1].rotation.x=-1.25+Math.cos(t*12+u.phase)*0.05;u.head.rotation.x=0.15+Math.sin(t*0.3+u.phase)*0.05;},SL[i%SL.length],-0.16);sitPose(p);});
  setSpot(z,0,2.7,3.6);
}

/* ================= EXTRAS ================= */
function buildExtras(){
  /* picnic */
  const pc=document.createElement('canvas');pc.width=pc.height=128;const x=pc.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#ffffff':'#ff8f7a';x.fillRect(i*16,j*16,16,16);}
  const bl=new THREE.Mesh(new THREE.PlaneGeometry(3.2,3.2),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(pc),polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));bl.rotation.x=-Math.PI/2;bl.rotation.z=0.4;bl.position.set(14,0.03,-36);bl.receiveShadow=true;scene.add(bl);
  box(0.7,0.45,0.5,'#c98b55',14.4,0.25,-36.6);cyl(0.12,0.1,0.3,'#ffffff',13.6,0.18,-35.6,null,8);
  for(const [px,pz,r,l] of [[13,-35.2,2.4,"Picnic with my sister. She packed too many parathas."],[15.2,-36.8,-0.6,"There's no such thing as too many parathas."]]){const p=staticNPC(px,pz,r,null,(dt,t)=>{p.userData.head.rotation.y=Math.sin(t*0.7+p.userData.phase)*0.3;},l,-0.74);crossPose(p);}
  /* painter */
  const eg=grp(-26,-26,0.9);for(const sx of [-0.4,0.4]){const l=box(0.08,2.2,0.08,'#8a5a3b',sx,1.1,0,eg);l.rotation.z=sx*-0.15;}
  const ec=document.createElement('canvas');ec.width=128;ec.height=100;const e=ec.getContext('2d');const gr=e.createLinearGradient(0,0,0,100);gr.addColorStop(0,'#8fd3ff');gr.addColorStop(1,'#e8f8ff');e.fillStyle=gr;e.fillRect(0,0,128,100);e.fillStyle='#ffd166';e.beginPath();e.arc(96,26,13,0,TAU);e.fill();e.fillStyle='#7fcf7a';e.beginPath();e.ellipse(30,100,70,36,0,0,TAU);e.fill();e.fillStyle='#5dbb63';e.beginPath();e.ellipse(100,104,60,30,0,0,TAU);e.fill();e.fillStyle='#ff8fb8';for(let i=0;i<8;i++){e.beginPath();e.arc(10+i*15,88+Math.sin(i)*4,3,0,TAU);e.fill();}
  const cv=new THREE.Mesh(new THREE.BoxGeometry(1.3,1,0.06),[M('#fff'),M('#fff'),M('#fff'),M('#fff'),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(ec)}),M('#fff')]);cv.position.set(0,1.75,0.06);cv.rotation.x=-0.12;cv.castShadow=true;eg.add(cv);addCircle(-26,-26,0.7);
  const pw=L2W(eg,0.2,1.4);const painter=staticNPC(pw.x,pw.z,eg.rotation.y+Math.PI,{shirt:'#ffffff'},(dt,t)=>{painter.userData.arms[1].rotation.x=-1.4+Math.sin(t*2.2)*0.2;painter.userData.arms[1].rotation.z=0.3+Math.sin(t*1.7)*0.15;},"Painting the sky. It keeps changing on me.");
  /* reading under a tree */
  tree(-76,-72,0,1.4);addCircle(-76,-72,0.7);const rd=staticNPC(-76,-70.6,0,null,(dt,t)=>{rd.userData.arms[0].rotation.x=-1.1;rd.userData.arms[1].rotation.x=-1.1;rd.userData.head.rotation.x=0.4;},"Reading a novel that has nothing to do with my syllabus. Bliss.",-0.74);crossPose(rd);rd.userData.arms[0].rotation.set(-1.1,0,0.2);rd.userData.arms[1].rotation.set(-1.1,0,-0.2);
  box(0.6,0.08,0.4,'#e2504f',-76,0.5,-70.05,null);
  /* stall near ring: lemonade */
  const ls=grp(24,22,Math.atan2(-24,-22));box(2.4,1.1,1,'#ffd166',0,0.55,0,ls);for(const sx of [-1.1,1.1])box(0.1,2.2,0.1,'#ffffff',sx,1.6,0.4,ls);awning(ls,2.6,2.6,-0.4,'#ff8f7a','#ffffff',1.3);sign('Lemonade','pay with a smile',"#ff8f7a",'#ffffff',2.2,0.7,ls,0,3.3,-0.2);addCircle(24,22,1.4);
  const lw=L2W(ls,0,-0.9);staticNPC(lw.x,lw.z,ls.rotation.y,{shirt:'#ffd166',pack:false},null,"Nimbu pani, on the house. Any kind of day.");
  {const f=L2W(ls,0,1.6);SPOTS.push({label:'Grab a lemonade',sub:'Free · pay with a smile',color:'#e9a500',tx:f.x,tz:f.z,tr:2.4,run:()=>{giveDrink('lemonade','#ffe066',6,true);toast(COARSE?'Lemonade in hand. Tap Sip to drink it.':'Lemonade in hand. Press F to take a sip.');}});}
}

/* ================= ZONE LABELS & RADIAL PATHS ================= */
function buildPaths(){
  for(const zn of ZONES){if(!zn.area||zn.id==='yoga'||zn.id==='help')continue;const a=Math.atan2(zn.spot.z,zn.spot.x);pathSeg(Math.cos(a)*15,Math.sin(a)*15,zn.spot.x,zn.spot.z,4.2);}
  pathSeg(-4.3,59,-11,59.4,3.2);pathSeg(4.3,60,14,60,3.2);
}
function buildLabels(){for(const zn of ZONES){const s=pillSprite(zn.name,zn.color,1.9);s.position.set(zn.x,zn.lh,zn.z);if(zn.id==='worry'){s.position.set(LAKE.x,zn.lh,LAKE.z);}scene.add(s);zn.label=s;
  const base=s.scale.clone();updaters.push((dt,t)=>{const d=Math.hypot(camera.position.x-zn.x,camera.position.z-zn.z);const k=clamp(d/40,1,2.4);s.scale.set(base.x*k,base.y*k,1);s.position.y=zn.lh+Math.sin(t*1.2+zn.x)*0.15;});}}

/* ================= WALKERS ================= */
function buildWalkers(){
  for(let i=0;i<11;i++)ringWalker(rnd()*TAU,i%2?1:-1,rr(26.8,30.2),i===2||i===7);
  for(let i=0;i<5;i++){const lx=(i%2?1:-1)*rr(1.2,3.2);pathWalker([{x:lx,z:rr(98,106)},{x:lx,z:rr(17,24)}],rr(1.2,1.7));}
  for(const id of ['mood','kind','arcade','gratitude','breath','sound','worry','study']){const zn=Z[id];const a=Math.atan2(zn.spot.z,zn.spot.x);const off=rr(-0.6,0.6);const s={x:Math.cos(a)*28.5+Math.sin(a)*off,z:Math.sin(a)*28.5-Math.cos(a)*off};pathWalker([s,{x:zn.spot.x+Math.sin(a)*off,z:zn.spot.z-Math.cos(a)*off}],rr(1.1,1.6));}
  /* couple walking avenue side-by-side */
  pathWalker([{x:-6.8,z:48},{x:-14,z:59.6}],1.1);
}

/* ================= MAP DRAWING ================= */
const MAPR={x0:-100,z0:-92,s:200};
function w2m(x,z,S){return[(x-MAPR.x0)/MAPR.s*S,(z-MAPR.z0)/MAPR.s*S];}
function drawMap(S,labels,board){const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');const k=S/200;
  x.fillStyle='#c4e6a8';x.fillRect(0,0,S,S);
  let [a,b]=w2m(-88,-88,S);let [a2,b2]=w2m(88,72,S);x.fillStyle='#a9dc8c';x.fillRect(a,b,a2-a,b2-b);x.strokeStyle='#4f9d55';x.lineWidth=2.2*k;x.strokeRect(a,b,a2-a,b2-b);
  if(TREES.length){x.fillStyle='rgba(79,157,85,.55)';for(const t of TREES){const [tx,tz]=w2m(t.x,t.z,S);if(tx<0||tz<0||tx>S||tz>S)continue;x.beginPath();x.arc(tx,tz,1.3*k,0,TAU);x.fill();}}
  x.strokeStyle='#f6e6c6';x.lineCap='round';
  for(const s of SEGS){const p1=w2m(s.x1,s.z1,S),p2=w2m(s.x2,s.z2,S);x.lineWidth=s.w*k;x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.stroke();}
  if(!SEGS.length){x.lineWidth=8.6*k;const p1=w2m(0,15,S),p2=w2m(0,108,S);x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.stroke();}
  const o=w2m(0,0,S);x.lineWidth=5.4*k;x.beginPath();x.arc(o[0],o[1],28.5*k,0,TAU);x.stroke();
  x.fillStyle='#f5e8d2';x.beginPath();x.arc(o[0],o[1],16.4*k,0,TAU);x.fill();x.fillStyle='#6cc6f0';x.beginPath();x.arc(o[0],o[1],5.2*k,0,TAU);x.fill();
  const l=w2m(LAKE.x,LAKE.z,S);x.fillStyle='#f3e2b8';x.beginPath();x.arc(l[0],l[1],(LAKE.r+2.3)*k,0,TAU);x.fill();x.fillStyle='#58bde9';x.beginPath();x.arc(l[0],l[1],LAKE.r*k,0,TAU);x.fill();
  const gt=w2m(0,72,S);x.fillStyle='#1d2b44';x.fillRect(gt[0]-9*k,gt[1]-1.2*k,18*k,2.4*k);
  for(const zn of ZONES){const p=w2m(zn.x,zn.z,S);x.fillStyle=zn.color;x.strokeStyle='#ffffff';x.lineWidth=Math.max(2,1.1*k);x.beginPath();x.arc(p[0],p[1],(labels?3.6:4.2)*k,0,TAU);x.fill();x.stroke();}
  if(labels){const fs=Math.round(S/36);x.textAlign='center';x.textBaseline='bottom';x.font=`700 ${fs}px ${FD}`;x.lineJoin='round';
    for(const zn of ZONES){const p=w2m(zn.x,zn.z,S);let ty=p[1]-5*k;if(zn.id==='fountain')ty=p[1]+11*k;x.lineWidth=fs*0.35;x.strokeStyle='#ffffff';x.strokeText(zn.name,clamp(p[0],S*0.13,S*0.87),ty);x.fillStyle='#1d2b44';x.fillText(zn.name,clamp(p[0],S*0.13,S*0.87),ty);}
    x.font=`700 ${Math.round(fs*0.9)}px ${FB}`;x.lineWidth=fs*0.3;x.strokeText('Main gate',gt[0],gt[1]+fs*1.5);x.fillText('Main gate',gt[0],gt[1]+fs*1.5);}
  if(board){x.fillStyle='#ff6f91';const p=w2m(-11,66,S);x.beginPath();x.arc(p[0],p[1],3*k,0,TAU);x.fill();x.font=`700 ${Math.round(S/34)}px ${FB}`;x.textAlign='left';x.textBaseline='middle';x.fillStyle='#1d2b44';x.fillText('You are here',p[0]+5*k,p[1]);}
  return c;}

/* ================= BUILD ================= */
function buildWorld(){
  buildGround();
  buildPlaza();buildGratitude();buildBreath();buildLake();buildCafe();buildPost();buildArcade();buildSound();buildYoga();buildHelp();buildStudy();
  buildPaths();buildGate();buildHedges();buildTrees();buildAvenue();buildFlowers();buildSkyLife();buildExtras();buildLabels();buildWalkers();
  avatar=makePerson({shirt:outfit,pants:'#2f3a4f',skin:'#e8b48f',hair:'#2b1d16',style:2,pack:false,phones:false});scene.add(avatar);
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.55,0.75,32),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.7,depthWrite:false}));ring.rotation.x=-Math.PI/2;scene.add(ring);player.ring=ring;
  miniStatic=drawMap(300,false);
}
let outfit='#ff7a66';let miniStatic=null;
function setOutfit(c){outfit=c;if(!avatar)return;const pos=avatar.position.clone(),r=avatar.rotation.y;scene.remove(avatar);avatar=makePerson({shirt:c,pants:'#2f3a4f',skin:'#e8b48f',hair:'#2b1d16',style:2,pack:false,phones:false});avatar.position.copy(pos);avatar.rotation.y=r;scene.add(avatar);}

/* ================= INPUT ================= */
const keys={};
window.addEventListener('keydown',e=>{const tag=(e.target.tagName||'').toLowerCase();if(tag==='textarea'||tag==='input')return;
  if(e.key==='Escape'){if(!$('timeMenu').hidden){$('timeMenu').hidden=true;return;}if(panelOpen){closePanel();return;}}
  if(!started||(panelOpen&&!panelDock))return;
  keys[e.code]=true;
  if(e.code==='KeyE'||e.code==='Enter'){if(nearZone){e.preventDefault();activate(nearZone);}}
  if(e.code==='KeyF'){useItem();}
  if(e.code==='KeyM'){openMap();}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
window.addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
const cam={yaw:0,pitch:0.3,dist:11,distT:11,tx:0,ty:6,tz:66};
let look=null;
canvas.addEventListener('pointerdown',e=>{if(!started||(panelOpen&&!panelDock))return;look={id:e.pointerId,x:e.clientX,y:e.clientY};try{canvas.setPointerCapture(e.pointerId);}catch(_){}});
canvas.addEventListener('pointermove',e=>{if(!look||look.id!==e.pointerId)return;const dx=e.clientX-look.x,dy=e.clientY-look.y;look.x=e.clientX;look.y=e.clientY;cam.yaw-=dx*0.0055;cam.pitch=clamp(cam.pitch+dy*0.004,0.06,1.2);});
const endLook=e=>{if(look&&look.id===e.pointerId)look=null;};
canvas.addEventListener('pointerup',endLook);canvas.addEventListener('pointercancel',endLook);
canvas.addEventListener('wheel',e=>{if(!started)return;e.preventDefault();cam.distT=clamp(cam.distT+e.deltaY*0.01,5,24);},{passive:false});
/* joystick */
const joy={x:0,y:0,id:null};const joyEl=$('joy'),knob=$('knob');
if(COARSE){joyEl.hidden=false;$('controlsText').innerHTML='Use the <b>joystick</b> to walk, drag anywhere to look around and tap the button that pops up when you reach a place.';}
joyEl.addEventListener('pointerdown',e=>{joy.id=e.pointerId;joyEl.setPointerCapture(e.pointerId);moveJoy(e);});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joy.id)moveJoy(e);});
const endJoy=e=>{if(e.pointerId!==joy.id)return;joy.id=null;joy.x=joy.y=0;knob.style.transform='';};
joyEl.addEventListener('pointerup',endJoy);joyEl.addEventListener('pointercancel',endJoy);
function moveJoy(e){const r=joyEl.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const m=Math.hypot(dx,dy),max=r.width/2-14;if(m>max){dx*=max/m;dy*=max/m;}knob.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/max;joy.y=-dy/max;}

/* ================= PLAYER & CAMERA ================= */
function groundY(x,z){if(onDock(x,z))return 0.43;if(Z.sound.g&&Math.hypot(x-Z.sound.x,z-Z.sound.z)<6.1)return 0.45;return 0;}
function bounds(p){p.x=clamp(p.x,-86.5,86.5);p.z=clamp(p.z,-86.5,112);if(p.z>73.5)p.x=clamp(p.x,-40,40);}
function updatePlayer(dt,t){
  let ix=0,iy=0;
  if(started&&(!panelOpen||panelDock)){if(keys.KeyW||keys.ArrowUp)iy+=1;if(keys.KeyS||keys.ArrowDown)iy-=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;ix+=joy.x;iy+=joy.y;}
  const mag=Math.min(1,Math.hypot(ix,iy));
  if(player.action&&mag>0.3){if(panelOpen)closePanel();else endAction();}
  if(player.action){player.action.pose(t,dt);player.y=player.action.y||0;player.moving=false;}
  else if(mag>0.08){const nx=ix/Math.max(1e-4,Math.hypot(ix,iy)),ny=iy/Math.max(1e-4,Math.hypot(ix,iy));const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw);
    const mx=cy*nx+(-sy)*ny,mz=(-sy)*nx+(-cy)*ny;const run=keys.ShiftLeft||keys.ShiftRight;const sp=(run?12:6.5)*(joy.id!==null?Math.max(0.35,mag):1);
    const ox=player.x,oz=player.z;const p={x:ox+mx*sp*dt,z:oz+mz*sp*dt};bounds(p);resolve(p);resolve(p);
    if(inWater(p.x,p.z)){if(!inWater(p.x,oz)){p.z=oz;}else if(!inWater(ox,p.z)){p.x=ox;}else{p.x=ox;p.z=oz;}}
    player.x=p.x;player.z=p.z;const tr=Math.atan2(mx,mz);let da=tr-player.rot;da=Math.atan2(Math.sin(da),Math.cos(da));player.rot+=da*Math.min(1,dt*12);
    walkAnim(avatar,t*(sp/6.5),1);player.moving=true;}
  else{idleAnim(avatar,t);player.moving=false;}
  if(!player.action)player.y+=(groundY(player.x,player.z)-player.y)*Math.min(1,dt*12);
  const u=avatar.userData;
  if(player.gestT>0){player.gestT-=dt;const k=Math.sin(Math.PI*Math.max(0,player.gestT)/player.gestD);if(player.gest==='throw'){u.arms[1].rotation.x=-2.8*k;}else{u.arms[1].rotation.z=2.7*k;u.arms[1].rotation.x=-0.3*k;}}
  else if(HOLD.type==='drink'){let r=-0.8;if(HOLD.sipT>0){HOLD.sipT-=dt;const k=Math.max(0,Math.sin(Math.PI*(1-HOLD.sipT/1.4)));r-=1.5*k;u.head.rotation.x=-0.2*k;}u.arms[1].rotation.x=r;u.arms[1].rotation.z=0.12;if(HOLD.mesh)HOLD.mesh.rotation.x=-r-0.0;}
  else if(HOLD.type==='balloon'){u.arms[1].rotation.x=-0.45;u.arms[1].rotation.z=0.25;}
  avatar.position.set(player.x,player.y,player.z);avatar.rotation.y=player.rot;
  player.ring.visible=!player.action;player.ring.position.set(player.x,player.y+0.06,player.z);player.ring.material.opacity=0.45+Math.sin(t*3)*0.2;
  updateHeld(dt,t);
}
/* ---------- actions (sitting, poses) ---------- */
function startAction(a){if(player.action)endAction();player.action=a;player.x=a.x;player.z=a.z;player.rot=a.rot;player.y=a.y||0;resetPose(avatar);cam.yaw=a.rot+(a.camOff===undefined?0.7:a.camOff);cam.distT=a.dist||7.5;cam.pitch=a.pitch||0.28;}
function endAction(){const a=player.action;if(!a)return;player.action=null;resetPose(avatar);if(a.exit){player.x=a.exit.x;player.z=a.exit.z;}player.y=0;cam.distT=11;cam.pitch=0.3;if(a.onEnd)a.onEnd();}
function sitBench(g){const lx=g.userData.seat||0;const w=L2W(g,lx,0.08);openPanel({dock:true,title:'Take a moment',eyebrow:'Bench',color:'#2fb08c',sub:'Nothing to do. Just sit.',build:sitCard});startAction({x:w.x,z:w.z,rot:g.rotation.y,y:-0.18,exit:L2W(g,lx,1.5),pose:POSE.sit,camOff:0.75,dist:7});}
function sitCafe(m){giveDrink(m.drink,m.c,5,false);openPanel({dock:true,title:m.drink,eyebrow:'Mood Café',color:Z.mood.color,sub:'Sip slowly. No rush at all.',build:b=>drinkCard(b,m.tip)});startAction(Z.mood.cafeSeat);}
/* ---------- held items ---------- */
const HOLD={type:null,mesh:null,sips:0,sipT:0,name:'',balloon:null,line:null};const FLOAT=[];const BCOLS=['#ff6f91','#ffd23f','#2f80d1','#2fb08c','#6c5ce7','#ff8a3d'];let bci=0;const _hv=new THREE.Vector3();
function handPos(){avatar.userData.arms[1].children[1].getWorldPosition(_hv);return _hv.clone();}
function mkLine(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:'#ffffff'}));l.frustumCulled=false;scene.add(l);return l;}
function setLine(l,a,b){const p=l.geometry.attributes.position.array;p[0]=a.x;p[1]=a.y;p[2]=a.z;p[3]=b.x;p[4]=b.y;p[5]=b.z;l.geometry.attributes.position.needsUpdate=true;}
function makeCup(color,straw){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.085,0.26,12),M('#ffffff')));const l=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.02,12),M(color));l.position.y=0.12;g.add(l);
  if(straw){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.014,0.38,5),M('#ff6f91'));s.position.set(0.03,0.22,0);s.rotation.z=-0.2;g.add(s);}else{const h=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.022,5,10),M('#ffffff'));h.position.set(0.12,0,0);g.add(h);}return g;}
function giveDrink(name,color,sips,straw){dropItem();const g=makeCup(color,straw);g.position.set(0,-0.72,0.07);avatar.userData.arms[1].add(g);Object.assign(HOLD,{type:'drink',name,sips,mesh:g,sipT:0});syncItem();}
function sip(){if(HOLD.type!=='drink'||HOLD.sipT>0)return;HOLD.sipT=1.4;HOLD.sips--;
  if(AUD.ctx&&AUD.ctx.state==='running'){const t=AUD.ctx.currentTime+0.5;const o=AUD.ctx.createOscillator();const g=AUD.ctx.createGain();o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(170,t+0.25);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.05,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+0.3);o.connect(g);g.connect(AUD.ctx.destination);o.start(t);o.stop(t+0.32);}
  if(HOLD.sips<=0){const n=HOLD.name;setTimeout(()=>{if(HOLD.type==='drink'&&HOLD.sips<=0){dropItem();award(5,'Stayed hydrated');toast(`Finished your ${n}. Hydration counts as self-care.`);}},1450);}syncItem();}
function giveBalloon(){dropItem();const col=BCOLS[bci++%BCOLS.length];const m=new THREE.Mesh(new THREE.SphereGeometry(0.5,16,12),new THREE.MeshStandardMaterial({color:col,roughness:.35}));m.scale.set(1,1.2,1);m.castShadow=true;const h=handPos();m.position.set(h.x,h.y+2.2,h.z);scene.add(m);Object.assign(HOLD,{type:'balloon',balloon:m,line:mkLine()});syncItem();}
function letGo(quiet){if(HOLD.type!=='balloon')return;FLOAT.push({m:HOLD.balloon,line:HOLD.line,t:0});Object.assign(HOLD,{type:null,balloon:null,line:null});syncItem();if(!quiet){toast('There it goes. Some things are okay to let go of.');award(3,'Let it go');}}
function dropItem(){if(HOLD.type==='balloon'){letGo(true);return;}if(HOLD.mesh&&HOLD.mesh.parent)HOLD.mesh.parent.remove(HOLD.mesh);Object.assign(HOLD,{type:null,mesh:null});syncItem();}
function useItem(){if(HOLD.type==='drink')sip();else if(HOLD.type==='balloon')letGo();}
function syncItem(){const b=$('btnItem');if(HOLD.type==='drink'){b.hidden=false;b.textContent=`Sip${COARSE?'':' (F)'} · ${HOLD.sips} left`;}else if(HOLD.type==='balloon'){b.hidden=false;b.textContent=`Let go of balloon${COARSE?'':' (F)'}`;}else b.hidden=true;}
function updateHeld(dt,t){
  if(HOLD.type==='balloon'){const h=handPos();const b=HOLD.balloon;const k=Math.min(1,dt*5);b.position.x+=(h.x+0.3+Math.sin(t*1.1)*0.15-b.position.x)*k;b.position.y+=(h.y+2.3+Math.sin(t*1.6)*0.08-b.position.y)*k;b.position.z+=(h.z+Math.cos(t*0.9)*0.15-b.position.z)*k;setLine(HOLD.line,h,{x:b.position.x,y:b.position.y-0.6,z:b.position.z});}
  for(let i=FLOAT.length-1;i>=0;i--){const f=FLOAT[i];f.t+=dt;f.m.position.y+=dt*(1.6+f.t*0.2);f.m.position.x+=dt*0.7;f.m.position.z+=Math.sin(f.t*0.8)*dt*0.5;setLine(f.line,{x:f.m.position.x,y:f.m.position.y-0.6,z:f.m.position.z},{x:f.m.position.x+Math.sin(f.t*2)*0.2,y:f.m.position.y-2,z:f.m.position.z});
    if(f.t>18){scene.remove(f.m);scene.remove(f.line);FLOAT.splice(i,1);}}
}
function postLetter(){const env=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.4),new THREE.MeshLambertMaterial({color:'#fffdf4',side:THREE.DoubleSide}));scene.add(env);const s=handPos(),e=Z.kind.slot.clone();let t=0;player.gest='reach';player.gestT=player.gestD=1;
  const fn=dt=>{t+=dt;const k=Math.min(1,t/1.3);env.position.lerpVectors(s,e,k);env.position.y+=Math.sin(k*Math.PI)*2;env.rotation.y+=dt*6;if(k>=1){scene.remove(env);updaters.splice(updaters.indexOf(fn),1);}};updaters.push(fn);}
function updateCamera(dt,t){
  let tx,ty,tz;
  if(!started){const a=RM?0.25:Math.sin(t*0.12)*0.55;cam.yaw=a;cam.pitch=0.2;cam.distT=40;tx=0;ty=8;tz=70;}
  else{tx=player.x;ty=player.y+2.1;tz=player.z;}
  const k=1-Math.exp(-dt*(started?7:2));cam.tx+=(tx-cam.tx)*k;cam.ty+=(ty-cam.ty)*k;cam.tz+=(tz-cam.tz)*k;cam.dist+=(cam.distT-cam.dist)*(1-Math.exp(-dt*4));
  const cp=Math.cos(cam.pitch);camera.position.set(cam.tx+Math.sin(cam.yaw)*cp*cam.dist,cam.ty+Math.sin(cam.pitch)*cam.dist,cam.tz+Math.cos(cam.yaw)*cp*cam.dist);
  if(camera.position.y<0.8)camera.position.y=0.8;
  camera.lookAt(cam.tx,cam.ty,cam.tz);
  sky.position.copy(camera.position);
  sunSpr.position.copy(camera.position).addScaledVector(SUN_DIR,500);
  const fx=Math.round(cam.tx/4)*4,fz=Math.round(cam.tz/4)*4;sun.position.set(fx+SUN_OFF.x,SUN_OFF.y,fz+SUN_OFF.z);sun.target.position.set(fx,0,fz);sun.target.updateMatrixWorld();
}

/* ================= HUD ================= */
let nearZone=null;let hudTick=0;const whereEl=$('where'),promptEl=$('prompt'),bubbleEl=$('npcBubble');
let bubbleNpc=null,bubbleT=0;const _v=new THREE.Vector3();
function regionName(x,z){if(z>73)return 'Outside the gate';for(const zn of ZONES){if(zn.id==='fountain')continue;const r=zn.id==='worry'?19:zn.area;if(Math.hypot(x-zn.x,z-zn.z)<r)return zn.name;}const r=Math.hypot(x,z);if(r<17)return 'Central Plaza';if(r<32)return 'Rainbow Loop';if(Math.abs(x)<7&&z>15)return 'Welcome Avenue';return 'The Meadows';}
function updateHUD(dt,t){
  if(!started)return;
  /* zone proximity */
  let nz=null;if(!panelOpen&&!player.action){let best=1;for(const zn of ZONES){const r=Math.hypot(player.x-zn.tx,player.z-zn.tz)/zn.tr;if(r<best){best=r;nz=zn;}}for(const sp of SPOTS){if(sp.ok&&!sp.ok())continue;const r=Math.hypot(player.x-sp.tx,player.z-sp.tz)/sp.tr*0.6;if(r<best){best=r;nz=sp;}}}
  if(nz!==nearZone){nearZone=nz;if(nz){promptEl.style.setProperty('--zc',nz.color);$('promptKey').textContent=COARSE?'Tap':'E';$('promptText').textContent=nz.run?nz.label:((COARSE?'':'Enter ')+nz.name);$('promptSub').textContent=nz.sub;promptEl.hidden=false;promptEl.style.animation='none';void promptEl.offsetWidth;promptEl.style.animation='';}else promptEl.hidden=true;}
  hudTick-=dt;if(hudTick<=0){hudTick=0.12;whereEl.textContent=regionName(player.x,player.z);drawMini();}
  /* npc chat bubble */
  let best=null,bd=5.2;if(!panelOpen){for(const n of npcs){const p=n.world?n.world():n.p.position;const d=Math.hypot(p.x-player.x,p.z-player.z);if(d<bd){bd=d;best=n;}}}
  if(best!==bubbleNpc){bubbleNpc=best;if(best){bubbleEl.textContent=best.line;bubbleEl.hidden=false;}else bubbleEl.hidden=true;}
  if(bubbleNpc){const p=bubbleNpc.world?bubbleNpc.world():bubbleNpc.p.position;_v.set(p.x,p.y+2.6*(bubbleNpc.p.userData.scale||1)+0.3,p.z).project(camera);
    if(_v.z>1||_v.z<-1){bubbleEl.hidden=true;}else{bubbleEl.hidden=false;const sx=(_v.x+1)/2*innerWidth,sy=(1-_v.y)/2*innerHeight;bubbleEl.style.left=clamp(sx,110,innerWidth-110)+'px';bubbleEl.style.top=sy+'px';}}
}
const mini=$('mini'),mctx=mini.getContext('2d');
function drawMini(){if(!miniStatic)return;const S=300;mctx.clearRect(0,0,S,S);const p=w2m(player.x,player.z,S);mctx.save();mctx.beginPath();mctx.arc(S/2,S/2,S/2,0,TAU);mctx.clip();
  const zoom=1.9;mctx.translate(S/2,S/2);mctx.scale(zoom,zoom);mctx.translate(-p[0],-p[1]);mctx.drawImage(miniStatic,0,0);
  mctx.fillStyle='rgba(29,43,68,.45)';for(const n of npcs){if(n.world)continue;const q=w2m(n.p.position.x,n.p.position.z,S);mctx.beginPath();mctx.arc(q[0],q[1],1.1,0,TAU);mctx.fill();}
  mctx.restore();
  mctx.save();mctx.translate(S/2,S/2);mctx.rotate(-player.rot+Math.PI);mctx.fillStyle='#ffffff';mctx.strokeStyle='#1d2b44';mctx.lineWidth=4;mctx.beginPath();mctx.moveTo(0,-15);mctx.lineTo(11,11);mctx.lineTo(0,5);mctx.lineTo(-11,11);mctx.closePath();mctx.fill();mctx.stroke();mctx.restore();}
mini.addEventListener('click',()=>openMap());

/* toast */
let toastTimer=null;function toast(msg,ms){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;},ms||3400);}

/* ================= AUDIO ================= */
const LAYERS=[{id:'birds',name:'Nature',desc:'Birds by day, crickets by night',vol:.5},{id:'pad',name:'Calm music',desc:'Soft chords and a gentle melody',vol:.6},{id:'rain',name:'Gentle rain',desc:'Light rain on leaves',vol:.45},{id:'waves',name:'Lake water',desc:'Slow waves, in and out',vol:.55},{id:'chimes',name:'Wind chimes',desc:'Notes from the pavilion',vol:.4}];
const AUD={ctx:null,L:{}};
function audioInit(){if(AUD.ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;const ctx=new AC();AUD.ctx=ctx;const m=ctx.createGain();m.gain.value=0.9;m.connect(ctx.destination);AUD.master=m;
  const nb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  for(const l of LAYERS){const g=ctx.createGain();g.gain.value=0;g.connect(m);AUD.L[l.id]={on:false,vol:l.vol,g};}
  {const s=ctx.createBufferSource();s.buffer=nb;s.loop=true;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=380;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;const g=ctx.createGain();g.gain.value=0.2;s.connect(hp);hp.connect(lp);lp.connect(g);g.connect(AUD.L.rain.g);s.start();}
  {const s=ctx.createBufferSource();s.buffer=nb;s.loop=true;s.playbackRate.value=0.7;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;const wg=ctx.createGain();wg.gain.value=0.55;const lfo=ctx.createOscillator();lfo.frequency.value=0.09;const lg=ctx.createGain();lg.gain.value=0.5;lfo.connect(lg);lg.connect(wg.gain);s.connect(lp);lp.connect(wg);wg.connect(AUD.L.waves.g);s.start();lfo.start();}
  musicInit(ctx);
  setInterval(()=>{if(ctx.state!=='running')return;if(AUD.L.chimes.on&&Math.random()<0.5)chime();if(AUD.L.birds.on&&Math.random()<0.42)chirp();},650);
  return true;}
function musicInit(ctx){
  const out=ctx.createGain();out.gain.value=0.9;out.connect(AUD.L.pad.g);
  const dl=ctx.createDelay(1);dl.delayTime.value=0.44;const fb=ctx.createGain();fb.gain.value=0.33;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1700;
  out.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);const wet=ctx.createGain();wet.gain.value=0.4;lp.connect(wet);wet.connect(AUD.L.pad.g);
  const mtof=m=>440*Math.pow(2,(m-69)/12);
  const CH=[[48,55,64,71],[45,52,60,67],[41,48,57,64],[43,50,59,64]];
  const MEL=[67,69,72,74,76,79,81,84];let mi=3;
  const beat=60/66;let next=ctx.currentTime+0.3,step=0,bar=0;
  function tone(t,m,dur,vol,type,att){const o=ctx.createOscillator();o.type=type||'sine';o.frequency.value=mtof(m);const g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(att||0.02));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+0.05);}
  function key(t,m,vol){tone(t,m,2.4,vol,'sine',0.006);tone(t,m+12,1.1,vol*0.25,'triangle',0.004);tone(t,m+19,0.4,vol*0.06,'sine',0.003);}
  setInterval(()=>{if(ctx.state!=='running'||!AUD.L.pad.on){next=Math.max(next,ctx.currentTime+0.15);return;}
    while(next<ctx.currentTime+0.4){const ch=CH[bar%4];const s=step%8;const t=next;
      if(s===0){ch.forEach((m,i)=>tone(t+i*0.04,m,beat*4.8,0.045,'triangle',0.7));tone(t,ch[0]-12,beat*3.6,0.09,'sine',0.04);}
      if(s===4)tone(t,ch[0]-5,beat*2.2,0.045,'sine',0.04);
      if(Math.random()<(s%2===0?0.55:0.22)){const moves=[-2,-1,-1,0,1,1,2];mi=clamp(mi+moves[Math.floor(Math.random()*moves.length)],0,MEL.length-1);key(t,MEL[mi],0.065);}
      next+=beat/2;step++;if(step%8===0)bar++;}},100);
}
function chime(){const ctx=AUD.ctx;const notes=[523.25,587.33,659.25,783.99,880,1046.5,1174.66];const f=notes[Math.random()*notes.length|0];const t=ctx.currentTime;const o=ctx.createOscillator();o.frequency.value=f;const o2=ctx.createOscillator();o2.frequency.value=f*2.76;const g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.16,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+3);const g2=ctx.createGain();g2.gain.value=0.22;o.connect(g);o2.connect(g2);g2.connect(g);g.connect(AUD.L.chimes.g);o.start(t);o2.start(t);o.stop(t+3.1);o2.stop(t+3.1);}
function cricket(){const ctx=AUD.ctx;let t=ctx.currentTime;const f=4200+Math.random()*600;for(let r=0;r<2;r++){for(let i=0;i<4;i++){const o=ctx.createOscillator();const g=ctx.createGain();o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.03,t+0.005);g.gain.exponentialRampToValueAtTime(0.0001,t+0.03);o.connect(g);g.connect(AUD.L.birds.g);o.start(t);o.stop(t+0.04);t+=0.045;}t+=0.16;}}
function chirp(){if(TOD.name==='night'){cricket();return;}const ctx=AUD.ctx;let t=ctx.currentTime;const n=2+(Math.random()*3|0);const base=2200+Math.random()*1500;for(let i=0;i<n;i++){const o=ctx.createOscillator();const g=ctx.createGain();o.frequency.setValueAtTime(base,t);o.frequency.exponentialRampToValueAtTime(base*(1.25+Math.random()*0.4),t+0.08);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.09,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.11);o.connect(g);g.connect(AUD.L.birds.g);o.start(t);o.stop(t+0.13);t+=0.13+Math.random()*0.06;}}
function setLayer(id,on,vol){if(!audioInit())return;if(AUD.ctx.state!=='running')AUD.ctx.resume();const l=AUD.L[id];if(on!==undefined)l.on=on;if(vol!==undefined)l.vol=vol;l.g.gain.setTargetAtTime(l.on?l.vol:0,AUD.ctx.currentTime,0.35);syncSound();}
function anyOn(){return AUD.ctx&&Object.values(AUD.L).some(l=>l.on);}
function syncSound(){const on=!!anyOn();const b=$('btnSound');b.setAttribute('aria-pressed',String(on));$('soundLbl').textContent=on?'Sound on':'Sound off';}
$('btnSound').addEventListener('click',()=>{if(anyOn()){for(const id in AUD.L)setLayer(id,false);}else{setLayer('birds',true);setLayer('pad',true);}});

/* ================= PANELS ================= */
const pw=$('panelWrap'),pBody=$('pBody');let cleanup=null;let panelDock=false;
function openPanel(o){if(cleanup){try{cleanup();}catch(e){}cleanup=null;}panelOpen=true;panelDock=!!o.dock;pw.classList.toggle('docked',panelDock);for(const k in keys)keys[k]=false;pw.hidden=false;pw.style.setProperty('--zc',o.color||'#ff7a66');$('pEyebrow').textContent=o.eyebrow||'';$('pTitle').textContent=o.title;$('pSub').textContent=o.sub||'';pBody.innerHTML='';pBody.scrollTop=0;promptEl.hidden=true;bubbleEl.hidden=true;nearZone=null;bubbleNpc=null;cleanup=o.build(pBody)||null;if(!panelDock)setTimeout(()=>$('pClose').focus(),30);}
function closePanel(){if(!panelOpen)return;if(cleanup)try{cleanup();}catch(e){}cleanup=null;pw.hidden=true;panelOpen=false;panelDock=false;if(player.action)endAction();canvas.focus({preventScroll:true});}
$('pClose').addEventListener('click',closePanel);
pw.addEventListener('pointerdown',e=>{if(e.target===pw)closePanel();});
promptEl.addEventListener('click',()=>{if(nearZone)activate(nearZone);});
function activate(t){if(t.run)t.run();else openZone(t);}
function stamp(z){const s=store.get('stamps',[]);if(!s.includes(z.id)){s.push(z.id);store.set('stamps',s);updateStampCount();setTimeout(()=>toast(s.length===ZONES.length?'Passport complete! You visited every place in YMH City.':`Passport stamp: ${z.name} · ${s.length}/${ZONES.length}`),400);}}
function updateStampCount(){$('stampCount').textContent=`${store.get('stamps',[]).length}/${ZONES.length}`;}
function openZone(z){openPanel({title:z.name,eyebrow:z.id==='help'?'Support':'Activity',color:z.color,sub:z.sub,build:ACT[z.id],dock:!!z.seat});if(z.seat)startAction(z.seat);stamp(z);}
function chips(el,list,target){list.forEach(s=>{const b=document.createElement('button');b.type='button';b.textContent=s;b.addEventListener('click',()=>{target.value=s;target.focus();});el.appendChild(b);});}
function copyBtn(btn,text){btn.addEventListener('click',()=>{const done=()=>{const o=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=o,1400);};try{navigator.clipboard.writeText(text).then(done,()=>{btn.textContent='Select & copy';});}catch(e){btn.textContent='Select & copy';}});}

const ACT={};
ACT.fountain=b=>{const n=store.get('wishes',0);
  b.innerHTML=`<p class="lead">Every coin here carries a wish you make for yourself. Make it kind, the way you'd wish for a good friend.</p><div class="sugg" id="fSug"></div><label class="lbl" for="fWish">My wish for me</label><textarea id="fWish" rows="2" maxlength="100" placeholder="I hope I go easy on myself this week"></textarea><p class="err" id="fErr" hidden>Write a few words first. Even one is enough.</p><div class="row" style="margin-top:12px"><button class="btn primary" id="fGo" type="button">Toss a coin</button><span class="meta">${n?`${n} wish${n>1?'es':''} made here`:'Your coin stays in the fountain'}</span></div>`;
  chips(b.querySelector('#fSug'),['I hope I rest without guilt','I hope I ask for help when I need it','I hope I notice one good thing a day','I hope I feel proud of small wins'],b.querySelector('#fWish'));
  b.querySelector('#fGo').addEventListener('click',()=>{const v=b.querySelector('#fWish').value.trim();if(!v){b.querySelector('#fErr').hidden=false;return;}store.set('wishes',n+1);award(5,'Kind wish made');closePanel();player.gest='throw';player.gestT=player.gestD=0.7;setTimeout(tossCoin,250);setTimeout(()=>toast('Splash! Your wish is in the fountain.'),1400);});};

ACT.breath=b=>{b.innerHTML=`<p class="lead">You're sitting on a cushion in the garden. Breathe in as the orb grows, out as it shrinks. Three rounds is a great start.</p><div class="seg" id="bPat"><button type="button" data-p="box" aria-pressed="true">Box · 4-4-4-4</button><button type="button" data-p="calm" aria-pressed="false">Calm · 4-2-6</button><button type="button" data-p="sleep" aria-pressed="false">Sleepy · 4-7-8</button></div><div class="breath"><div class="orb" id="bOrb"></div><div class="orb-text"><div id="bWord">Ready when you are</div><div class="num" id="bNum"></div></div></div><div class="row"><button class="btn primary" id="bGo" type="button">Start</button><span class="meta" id="bRounds">0 rounds</span></div>`;
  const P={box:[['Breathe in',4,1],['Hold',4,1],['Breathe out',4,.5],['Hold',4,.5]],calm:[['Breathe in',4,1],['Hold',2,1],['Breathe out',6,.5]],sleep:[['Breathe in',4,1],['Hold',7,1],['Breathe out',8,.5]]};
  let pat='box',timer=null,phase=0,left=0,rounds=0;const orb=b.querySelector('#bOrb'),word=b.querySelector('#bWord'),num=b.querySelector('#bNum'),go=b.querySelector('#bGo'),rd=b.querySelector('#bRounds');
  function setPhase(){const [w,s,sc]=P[pat][phase];word.textContent=w;left=s;num.textContent=left;orb.style.transitionDuration=s+'s';orb.style.transform=`scale(${sc})`;BREATH.active=true;BREATH.target=sc===1?1.22:0.72;BREATH.rate=0.5/s;BREATH.word=w==='Breathe in'?0:w==='Breathe out'?2:(sc===1?1:3);}
  function tick(){left--;if(left<=0){phase=(phase+1)%P[pat].length;if(phase===0){rounds++;award(5,'Breathing round');rd.textContent=rounds+(rounds===1?' round':' rounds');}setPhase();}else num.textContent=left;}
  function start(){phase=0;setPhase();timer=setInterval(tick,1000);go.textContent='Pause';}
  function stop(){clearInterval(timer);timer=null;BREATH.active=false;go.textContent='Start';word.textContent=rounds?'Nicely done':'Ready when you are';num.textContent='';orb.style.transitionDuration='1.2s';orb.style.transform='scale(.62)';}
  go.addEventListener('click',()=>timer?stop():start());
  b.querySelectorAll('#bPat button').forEach(x=>x.addEventListener('click',()=>{pat=x.dataset.p;b.querySelectorAll('#bPat button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));if(timer){clearInterval(timer);start();}}));
  return ()=>{clearInterval(timer);BREATH.active=false;};};

ACT.gratitude=b=>{const z=Z.gratitude;
  b.innerHTML=`<p class="lead">Write down one thing you're thankful for. It becomes a little note hanging on the tree, and you can come back to read it.</p><div class="sugg" id="gSug"></div><label class="lbl" for="gText">I'm grateful for…</label><textarea id="gText" rows="2" maxlength="90" placeholder="My friend who checked on me yesterday"></textarea><p class="err" id="gErr" hidden>Write a few words first.</p><div class="row" style="margin-top:12px"><button class="btn primary" id="gAdd" type="button">Hang it on the tree</button></div><h3 class="h3">Your notes</h3><ul class="notes" id="gList"></ul>`;
  chips(b.querySelector('#gSug'),['Someone who made me smile','A small comfort today','Something my body did for me','A song I love','A place I feel safe'],b.querySelector('#gText'));
  const list=b.querySelector('#gList');
  function render(){const n=store.get('grat',[]);list.innerHTML=n.length?n.slice().reverse().map(x=>`<li><i style="background:${x.c}"></i><span>${esc(x.text)}</span></li>`).join(''):'<li class="empty" style="display:block">Your notes will show up here. The tree is waiting for the first one.</li>';}
  render();
  b.querySelector('#gAdd').addEventListener('click',()=>{const ta=b.querySelector('#gText');const v=ta.value.trim();if(!v){b.querySelector('#gErr').hidden=false;return;}b.querySelector('#gErr').hidden=true;const c=pick(z.NC);const n=store.get('grat',[]);n.push({text:v,c,t:Date.now()});store.set('grat',n);z.addNote(c,true);award(10,'Gratitude note');player.gest='reach';player.gestT=player.gestD=1.2;ta.value='';render();toast('Your note is on the tree. Look for the glowing one.');});};

const MOODS=[
 {k:'Happy',e:'😊',c:'#ffc94a',drink:'Sunshine Lemonade',tip:'Savour it. Pause for 20 seconds and notice where you feel this good mood in your body. Then share it with someone.'},
 {k:'Calm',e:'😌',c:'#5cc9a7',drink:'Mint Cloud Tea',tip:'Make a mental note of what helped you get here, so you can find your way back on harder days.'},
 {k:'Tired',e:'😴',c:'#9aa7c7',drink:'Slow Oat Cocoa',tip:'Rest counts as doing something. Try ten minutes away from screens, a glass of water, or an earlier night.'},
 {k:'Anxious',e:'😟',c:'#b39ddb',drink:'Chamomile Grounding Latte',tip:'Try 5-4-3-2-1: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell and 1 you taste.'},
 {k:'Sad',e:'😢',c:'#6fa8dc',drink:'Warm Honey Hug',tip:'Be gentle with yourself today. Send a message to one person you trust, even if it\'s just "hey".'},
 {k:'Angry',e:'😠',c:'#ff7a66',drink:'Iced Cool-Down',tip:'Move the energy first: a brisk walk, or squeeze and release your fists five times. Then name what felt unfair.'},
 {k:'Overwhelmed',e:'😵‍💫',c:'#f5a15b',drink:'One-Sip Espresso',tip:'Write everything down, then pick only the smallest next step. Just one. The list can wait.'},
 {k:'Lonely',e:'🥺',c:'#d692c2',drink:'Friendship Chai (comes with two cups)',tip:'Loneliness is common and it does pass. Reach out to one person, or write a note at the Kindness Post.'}];
ACT.mood=b=>{b.innerHTML=`<p class="lead">Welcome in! How are you feeling right now? Pick the closest one. Every feeling is welcome at this counter.</p><div class="moods" id="mGrid"></div><div id="mOut"></div><h3 class="h3">Your recent check-ins</h3><div class="history" id="mHist"></div>`;
  const grid=b.querySelector('#mGrid');MOODS.forEach(m=>{const x=document.createElement('button');x.type='button';x.setAttribute('aria-pressed','false');x.innerHTML=`<span aria-hidden="true">${m.e}</span>${m.k}`;x.addEventListener('click',()=>{grid.querySelectorAll('button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));
    b.querySelector('#mOut').innerHTML=`<div class="order"><div class="eyebrow">Your order</div><h4>${m.drink}</h4><p>${m.tip}</p><div class="row" style="margin-top:12px"><button class="btn primary" type="button" id="mSit">Take a seat and sip</button></div></div>`;b.querySelector('#mSit').addEventListener('click',()=>{closePanel();sitCafe(m);});award(5,'Mood check-in');const h=store.get('moods',[]);h.push({k:m.k,c:m.c,t:Date.now()});store.set('moods',h.slice(-10));hist();});grid.appendChild(x);});
  function hist(){const h=store.get('moods',[]);const el=b.querySelector('#mHist');if(!h.length){el.innerHTML='<div class="empty" style="flex-direction:row">Your check-ins will appear here, so you can spot patterns over time.</div>';return;}
    el.innerHTML=h.slice(-8).map(x=>{const d=new Date(x.t);return `<div title="${x.k}"><i style="background:${x.c}"></i>${d.toLocaleDateString(undefined,{weekday:'short'})}</div>`;}).join('');}
  hist();};

ACT.worry=b=>{const n=store.get('boats',0);
  b.innerHTML=`<p class="lead">Write down what's on your mind, fold it into a paper boat and watch it drift across the lake. A worry is a thought, not a fact.</p><label class="lbl" for="wText">What's weighing on you?</label><textarea id="wText" rows="3" maxlength="160" placeholder="I'm nervous about tomorrow's presentation"></textarea><p class="err" id="wErr" hidden>Write a few words first. Nobody else will see it.</p>
  <div class="lbl">Is there one small thing you could do about it today?</div><div class="choice"><button class="btn ghost" type="button" id="wYes">Yes, one small thing</button><button class="btn ghost" type="button" id="wNo">Not really</button></div>
  <div id="wStep" hidden><label class="lbl" for="wStepIn">My one small step</label><input type="text" id="wStepIn" maxlength="90" placeholder="Practise the first slide once"></div>
  <p class="meta" id="wNoMsg" hidden style="margin-top:10px">That's okay. Some things aren't ours to fix right now. Letting them float for a while is allowed.</p>
  <div class="row" style="margin-top:16px"><button class="btn primary" type="button" id="wGo">Fold it into a boat</button><span class="meta">${n?`${n} boat${n>1?'s':''} sailed so far`:'Your words stay on this device'}</span></div>`;
  b.querySelector('#wYes').addEventListener('click',()=>{b.querySelector('#wStep').hidden=false;b.querySelector('#wNoMsg').hidden=true;b.querySelector('#wStepIn').focus();});
  b.querySelector('#wNo').addEventListener('click',()=>{b.querySelector('#wStep').hidden=true;b.querySelector('#wNoMsg').hidden=false;});
  b.querySelector('#wGo').addEventListener('click',()=>{const v=b.querySelector('#wText').value.trim();if(!v){b.querySelector('#wErr').hidden=false;return;}const step=b.querySelector('#wStepIn').value.trim();store.set('boats',n+1);award(10,'Worry set afloat');closePanel();{const ds=L2W(Z.worry.dock,0,6.9);player.x=ds.x;player.z=ds.z;player.rot=Math.atan2(-lakeU.x,-lakeU.z);}player.gest='reach';player.gestT=player.gestD=0.9;setTimeout(()=>launchBoat(v),350);
    const z=Z.worry;cam.yaw=Math.atan2(lakeU.x,lakeU.z);setTimeout(()=>toast(step?`Your boat is sailing. Your one step for today: ${step}`:'Your boat is sailing away. Watch it get smaller.',5200),300);});};

const PAIRS=[["I always mess things up","I mess some things up. I get plenty right too."],["Everyone has it figured out except me","Most people are figuring it out as they go."],["I can't do this","I can't do all of it today. I can do the first bit."],["Everyone noticed my mistake","Most people were busy with their own day."],["I should be further along by now","There's no single timeline. I'm on mine."],["If it's not perfect, it's not worth doing","Done with care is worth a lot."],["They didn't reply, so they must be upset","People get busy. I don't know the reason yet."],["I'm bad at this","I'm new at this."],["One bad result means I'm not good enough","One result is one moment, not the whole picture."],["Nobody would want to hang out with me","I can't read minds. I could ask someone."],["I'll never get used to this place","New places take a while. It's only been a while."],["I have to say yes to everything","I can say no and still be kind."],["Resting means I'm being lazy","Rest is part of doing things well."],["What if it all goes wrong?","What if it goes okay?"],["I always say the wrong thing","Most conversations go better than I think."],["I wasted the whole day","Some days are slower. Tomorrow's a new one."]];
ACT.arcade=b=>{b.innerHTML=`<p class="lead">Unhelpful thoughts float up as bubbles. Pop them to reveal a kinder way to see things. There's no losing here.</p><div class="scorebar"><span id="aScore">0 popped</span><span id="aTime">45s</span></div><div class="game"><canvas id="aCan"></canvas><div class="game-over" id="aOver"><div><h4 id="aOT">Thought Bubble Pop</h4><p id="aOP">45 seconds. Tap or click the bubbles.</p><button class="btn primary" type="button" id="aGo">Start</button></div></div></div><div class="reframe" id="aRe">Kinder thoughts will appear here.</div>`;
  const cv=b.querySelector('#aCan'),ctx=cv.getContext('2d');let W=0,H=330,dpr=Math.min(2,window.devicePixelRatio||1);function size(){W=cv.clientWidth||480;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}size();
  let bubbles=[],parts=[],running=false,score=0,left=45,spawn=0,raf=0,last=performance.now();const cols=['#ffd6ff','#c9f1ff','#fff2b3','#d6ffe8','#e3d6ff','#ffe0c9'];
  function add(){const p=PAIRS[Math.random()*PAIRS.length|0];const r=46+Math.random()*14;bubbles.push({x:r+Math.random()*(W-2*r),y:H+r,r,vy:28+Math.random()*26,ph:Math.random()*TAU,p,c:cols[Math.random()*cols.length|0]});}
  function draw(dt){ctx.clearRect(0,0,W,H);for(const q of bubbles){if(running){q.y-=q.vy*dt;q.ph+=dt;}const x=q.x+Math.sin(q.ph*1.4)*8;const g=ctx.createRadialGradient(x-q.r*0.35,q.y-q.r*0.4,q.r*0.1,x,q.y,q.r);g.addColorStop(0,'#ffffff');g.addColorStop(0.6,q.c);g.addColorStop(1,'rgba(160,140,230,.55)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,q.y,q.r,0,TAU);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#2a3550';ctx.font=`500 12.5px ${FB}`;ctx.textAlign='center';ctx.textBaseline='middle';const ls=wrapLines(ctx,q.p[0],q.r*1.6);ls.forEach((l,i)=>ctx.fillText(l,x,q.y+(i-(ls.length-1)/2)*15));q.dx=x;}
    bubbles=bubbles.filter(q=>q.y>-q.r);
    for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt;p.l-=dt;ctx.globalAlpha=Math.max(0,p.l*2);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,TAU);ctx.fill();ctx.globalAlpha=1;}
    parts=parts.filter(p=>p.l>0);}
  function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;if(running){left-=dt;spawn-=dt;if(spawn<=0){add();spawn=0.9+Math.random()*0.6;}b.querySelector('#aTime').textContent=Math.max(0,Math.ceil(left))+'s';if(left<=0)end();}draw(dt);raf=requestAnimationFrame(loop);}
  function end(){running=false;const o=b.querySelector('#aOver');o.hidden=false;b.querySelector('#aOT').textContent=`You popped ${score} thought${score===1?'':'s'}!`;b.querySelector('#aOP').textContent='Noticing an unhelpful thought is the first step to changing it. Kinder thoughts get easier with practice.';b.querySelector('#aGo').textContent='Play again';}
  b.querySelector('#aGo').addEventListener('click',()=>{size();bubbles=[];score=0;left=45;spawn=0;running=true;b.querySelector('#aOver').hidden=true;b.querySelector('#aScore').textContent='0 popped';});
  cv.addEventListener('pointerdown',e=>{if(!running)return;const r=cv.getBoundingClientRect();const px=e.clientX-r.left,py=e.clientY-r.top;for(let i=bubbles.length-1;i>=0;i--){const q=bubbles[i];if(Math.hypot(px-(q.dx||q.x),py-q.y)<q.r){bubbles.splice(i,1);score++;b.querySelector('#aScore').textContent=score+' popped';
    for(let k=0;k<14;k++){const a=Math.random()*TAU,s=60+Math.random()*120;parts.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:0.6,c:q.c==='#fff2b3'?'#ffc94a':'#a98bf0'});}
    b.querySelector('#aRe').innerHTML=`<s>${esc(q.p[0])}</s><br><b>${esc(q.p[1])}</b>`;if(AUD.ctx&&AUD.ctx.state==='running'){const t=AUD.ctx.currentTime;const o=AUD.ctx.createOscillator();const g=AUD.ctx.createGain();o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(1200,t+0.08);g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.15);o.connect(g);g.connect(AUD.ctx.destination);o.start(t);o.stop(t+0.16);}break;}}});
  for(let i=0;i<4;i++){add();bubbles[i].y=H*0.3+i*60;}
  raf=requestAnimationFrame(loop);window.addEventListener('resize',size);
  return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',size);};};

const AFFIRM=["You don't have to have it all figured out today.","Your feelings make sense, even the messy ones.","Rest is not something you have to earn.","You've survived every hard day so far. That's a real track record.","Asking for help is a strength, not a weakness.","You are allowed to take up space.","Progress can be quiet. It still counts.","Someone is glad you exist, even if they haven't said it lately.","You can start again at any moment of the day.","Be as kind to yourself as you are to your friends.","Your worth isn't measured by your grades or your likes.","It's okay to say no to protect your energy.","You are more than your worst day.","Little by little is still a way forward.","The world is better with you in it."];
const CHALL=["Text a friend one thing you appreciate about them.","Thank someone whose work often goes unnoticed: a guard, a cleaner, a bus driver.","Leave a kind comment on someone's work or post.","Ask someone how they're really doing, then listen.","Give a genuine compliment that isn't about looks.","Hold the door, share your snack, make room at the table.","Write down three things you like about yourself.","Invite someone who's often left out to join you.","Send a voice note to a grandparent or older relative.","Say sorry for something small you've been carrying."];
ACT.kind=b=>{b.innerHTML=`<div class="letter"><div class="stamp" aria-hidden="true">♥</div><p id="kMsg">There's a letter here with your name on it.</p></div><div class="row" style="margin-top:14px"><button class="btn primary" type="button" id="kOpen">Open a letter</button></div>
  <h3 class="h3">Today's kindness challenge</h3><p class="lead" id="kChal" style="margin-bottom:8px"></p><button class="btn ghost" type="button" id="kNext">Another idea</button>
  <h3 class="h3">Write a kind note for someone</h3><label class="lbl" for="kText" style="margin-top:0">Your note</label><textarea id="kText" rows="2" maxlength="160" placeholder="Hey, I'm really glad we're friends."></textarea><div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="kSave">Post it in the mailbox</button></div><p class="meta">Notes stay on this device. Copy one and send it to someone you care about.</p><ul class="notes" id="kList"></ul>`;
  let ai=-1,ci=Math.floor(Math.random()*CHALL.length);const chal=b.querySelector('#kChal');chal.textContent=CHALL[ci];
  b.querySelector('#kOpen').addEventListener('click',()=>{let i;do{i=Math.floor(Math.random()*AFFIRM.length);}while(i===ai);ai=i;b.querySelector('#kMsg').textContent=AFFIRM[i];b.querySelector('#kOpen').textContent='Open another';});
  b.querySelector('#kNext').addEventListener('click',()=>{ci=(ci+1)%CHALL.length;chal.textContent=CHALL[ci];});
  const list=b.querySelector('#kList');function render(){const n=store.get('kind',[]);list.innerHTML='';n.slice().reverse().forEach(x=>{const li=document.createElement('li');li.innerHTML=`<i style="background:#ff8f91"></i><span>${esc(x)}</span><button type="button">Copy</button>`;copyBtn(li.querySelector('button'),x);list.appendChild(li);});}render();
  b.querySelector('#kSave').addEventListener('click',()=>{const ta=b.querySelector('#kText');const v=ta.value.trim();if(!v)return;const n=store.get('kind',[]);n.push(v);store.set('kind',n.slice(-12));award(10,'Kind note posted');ta.value='';render();closePanel();postLetter();setTimeout(()=>toast('Posted! Your note is saved here too, ready to copy and send.'),900);});};

ACT.sound=b=>{if(!audioInit()){b.innerHTML='<p class="lead">Sound isn\'t supported in this browser.</p>';return;}if(AUD.ctx.state!=='running')AUD.ctx.resume();
  b.innerHTML=`<p class="lead">Mix your own calm. Switch sounds on, set the volume, and they keep playing while you explore the city.</p><div class="seg" id="sPre" style="margin-bottom:12px"><button type="button" data-p="rain,pad">Rainy afternoon</button><button type="button" data-p="waves,chimes,pad">Lake at dusk</button><button type="button" data-p="birds,chimes">Park morning</button><button type="button" data-p="">All off</button></div><div class="mixer" id="sMix"></div>`;
  const mix=b.querySelector('#sMix');
  function render(){mix.innerHTML='';LAYERS.forEach(l=>{const st=AUD.L[l.id];const row=document.createElement('div');row.className='track';row.innerHTML=`<button class="toggle" type="button" aria-pressed="${st.on}" aria-label="${l.name}"></button><div><b>${l.name}<span class="eq ${st.on?'on':''}"><i></i><i></i><i></i></span></b><span>${l.desc}</span></div><input type="range" id="vol-${l.id}" min="0" max="1" step="0.05" value="${st.vol}" aria-label="${l.name} volume">`;
    row.querySelector('.toggle').addEventListener('click',()=>{setLayer(l.id,!AUD.L[l.id].on);render();});row.querySelector('input').addEventListener('input',e=>{setLayer(l.id,undefined,parseFloat(e.target.value));});mix.appendChild(row);});}
  render();
  b.querySelectorAll('#sPre button').forEach(x=>x.addEventListener('click',()=>{const on=x.dataset.p?x.dataset.p.split(','):[];LAYERS.forEach(l=>setLayer(l.id,on.includes(l.id)));render();}));};

ACT.help=b=>{b.innerHTML=RESOURCES.map(r=>`<div class="contact"><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p><div class="num-row"><span class="bignum">${esc(r.num)}</span></div>${r.alt?`<p>${esc(r.alt)}</p>`:''}</div>`).join('');};

const STRETCH=[["Neck rolls","Drop your chin and slowly roll your head from one shoulder to the other. Gentle half circles, never forced.",30],["Shoulder shrugs","Lift your shoulders up to your ears, hold for a breath, then let them drop. Feel them get heavy.",30],["Reach for the sky","Stretch both arms overhead, link your fingers and lengthen through your sides.",30],["Side bends","One arm up, lean gently to the opposite side. Switch halfway through.",30],["Forward fold","Soft knees, let your upper body hang down. Sway a little and let your head be heavy.",30],["Shake it out","Shake out your hands, arms and legs for a few seconds. Then stand still and notice how you feel.",20]];
ACT.yoga=b=>{b.innerHTML=`<p class="lead">Six easy moves, about three minutes. Your avatar and the whole lawn move with you, so follow along wherever you are. Only move in ways that feel okay.</p><div class="stretch"><div class="step" id="yStep">Ready</div><h4 id="yName">Body reset</h4><p id="yDesc">Press start and follow along with the people on the lawn.</p><div class="bar"><i id="yBar"></i></div><div class="row" style="justify-content:space-between"><span class="timer" id="yTime">3:00</span><div class="row"><button class="btn ghost" type="button" id="ySkip" disabled>Skip</button><button class="btn primary" type="button" id="yGo">Start</button></div></div></div>`;
  let i=-1,left=0,timer=null;const total=STRETCH.reduce((a,s)=>a+s[2],0);const bar=b.querySelector('#yBar');
  function show(){YOGA.move=i;const s=STRETCH[i];b.querySelector('#yStep').textContent=`Move ${i+1} of ${STRETCH.length}`;b.querySelector('#yName').textContent=s[0];b.querySelector('#yDesc').textContent=s[1];left=s[2];b.querySelector('#yTime').textContent=`0:${String(left).padStart(2,'0')}`;bar.style.transition='none';bar.style.width='0%';void bar.offsetWidth;bar.style.transition='';}
  function next(){i++;if(i>=STRETCH.length){clearInterval(timer);timer=null;YOGA.active=false;award(25,'Stretch routine done');b.querySelector('#yStep').textContent='Done';b.querySelector('#yName').textContent='Nice work';b.querySelector('#yDesc').textContent='Take one slow breath and notice anything that feels looser now.';b.querySelector('#yTime').textContent='';bar.style.width='100%';b.querySelector('#yGo').textContent='Again';b.querySelector('#ySkip').disabled=true;i=-1;return;}show();}
  function tick(){left--;const s=STRETCH[i];bar.style.width=((s[2]-left)/s[2]*100)+'%';b.querySelector('#yTime').textContent=`0:${String(Math.max(0,left)).padStart(2,'0')}`;if(left<=0)next();}
  b.querySelector('#yGo').addEventListener('click',()=>{const go=b.querySelector('#yGo');if(timer){clearInterval(timer);timer=null;go.textContent='Resume';return;}if(i<0)next();YOGA.active=true;timer=setInterval(tick,1000);go.textContent='Pause';b.querySelector('#ySkip').disabled=false;});
  b.querySelector('#ySkip').addEventListener('click',()=>{next();});
  b.querySelector('#yTime').textContent=`${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
  return ()=>{clearInterval(timer);YOGA.active=false;};};

const MINDFUL=[()=>'Notice three sounds around you. Near, far, and somewhere in between.',()=>`Look up. It's ${TOD_LBL[TOD.name].toLowerCase()} here. What colours can you see in the sky?`,()=>'Let your shoulders drop. Unclench your jaw. Soften your hands.',()=>'Feel the bench holding you up. You can let it do some of the work.',()=>'Breathe out a little longer than you breathe in. Do it three times.',()=>'Name one thing that went okay today, even a tiny one.',()=>'Watch someone walk past. Wish them a good day in your head.',()=>"What would you tell a friend who felt the way you feel right now?"];
function sitCard(b){let i=Math.floor(Math.random()*MINDFUL.length),sec=0;
  b.innerHTML=`<p class="mindful" id="mfP"></p><div class="row"><button class="btn" type="button" id="mfN">Another prompt</button><button class="btn primary" type="button" id="mfS">Stand up</button></div><p class="meta" id="mfT" style="margin-top:10px">Sitting for 0:00</p>`;
  const show=()=>{b.querySelector('#mfP').textContent=MINDFUL[i%MINDFUL.length]();};show();
  b.querySelector('#mfN').addEventListener('click',()=>{i++;show();});b.querySelector('#mfS').addEventListener('click',closePanel);
  const iv=setInterval(()=>{sec++;b.querySelector('#mfT').textContent=`Sitting for ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;if(sec%25===0){i++;show();}if(sec===60)award(5,'Mindful minute');},1000);return ()=>clearInterval(iv);}
function drinkCard(b,tip){b.innerHTML=`<p class="lead">${tip}</p><div class="row"><button class="btn primary" type="button" id="dSip">Take a sip</button><button class="btn ghost" type="button" id="dUp">Stand up</button></div><p class="meta" id="dLeft" style="margin-top:10px"></p>`;
  const left=b.querySelector('#dLeft'),btn=b.querySelector('#dSip');const upd=()=>{if(HOLD.type==='drink'&&HOLD.sips>0){left.textContent=`${HOLD.sips} sip${HOLD.sips===1?'':'s'} left`;btn.disabled=false;}else{left.textContent='All done. Notice one thing that feels different from when you walked in.';btn.disabled=true;}};upd();
  btn.addEventListener('click',()=>{sip();upd();setTimeout(upd,1500);});b.querySelector('#dUp').addEventListener('click',closePanel);}
ACT.study=b=>{const done=store.get('pomos',0);const musicOn=()=>!!(AUD.L.pad&&AUD.L.pad.on);
  b.innerHTML=`<div class="seg" id="stPre"><button type="button" data-f="25" data-b="5" aria-pressed="true">25 / 5</button><button type="button" data-f="50" data-b="10" aria-pressed="false">50 / 10</button><button type="button" data-f="15" data-b="3" aria-pressed="false">15 / 3</button></div>
  <label class="lbl" for="stTask">What are you working on?</label><input type="text" id="stTask" maxlength="60" placeholder="Chapter 4 notes">
  <div class="focus"><div><div class="step" id="stPh">Ready to focus</div><div class="clock" id="stClock">25:00</div></div><button class="btn primary" type="button" id="stGo">Start focus</button></div>
  <div class="bar"><i id="stBar"></i></div><p class="meta" id="stTip">You're at a desk with everyone else. Your avatar studies while the timer runs.</p>
  <div class="row" style="margin-top:8px"><button class="btn ghost" type="button" id="stMusic">${musicOn()?'Pause calm music':'Play calm music'}</button><span class="meta" id="stDone">${done} focus session${done===1?'':'s'} done</span></div>`;
  let F=25,B=5,mode='idle',left=F*60,total=F*60,iv=null;const q=s=>b.querySelector(s);const clock=q('#stClock'),ph=q('#stPh'),go=q('#stGo'),bar=q('#stBar'),tip=q('#stTip');
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;const BT=['Stand up and stretch your arms over your head.','Refill your water bottle.','Look at something far away for 20 seconds.','Roll your shoulders a few times.','Step away from the screen. Breathe out slowly.'];
  function render(){clock.textContent=fmt(left);bar.style.width=((total-left)/total*100)+'%';}
  function phase(m){mode=m;STUDY.mode=m;total=left=(m==='focus'?F:B)*60;ph.textContent=m==='focus'?'Focus':'Break';tip.textContent=m==='focus'?`Phone face down. Just ${q('#stTask').value.trim()||'one thing'}, nothing else.`:BT[Math.floor(Math.random()*BT.length)];bar.style.transition='none';render();void bar.offsetWidth;bar.style.transition='';}
  function tick(){left--;render();if(left>0)return;if(mode==='focus'){const n=store.get('pomos',0)+1;store.set('pomos',n);award(30,'Focus session done');q('#stDone').textContent=`${n} focus session${n===1?'':'s'} done`;toast('Focus session done. Time for a proper break.');phase('break');}else{toast('Break over. Ready for another round?');clearInterval(iv);iv=null;go.textContent='Start focus';mode='idle';STUDY.mode='idle';ph.textContent='Ready to focus';left=total=F*60;render();}}
  go.addEventListener('click',()=>{if(iv){clearInterval(iv);iv=null;go.textContent='Resume';return;}if(mode==='idle')phase('focus');iv=setInterval(tick,1000);go.textContent='Pause';});
  b.querySelectorAll('#stPre button').forEach(x=>x.addEventListener('click',()=>{if(mode!=='idle')return;F=+x.dataset.f;B=+x.dataset.b;left=total=F*60;render();b.querySelectorAll('#stPre button').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));}));
  q('#stMusic').addEventListener('click',()=>{setLayer('pad',!musicOn());q('#stMusic').textContent=musicOn()?'Pause calm music':'Play calm music';});
  return ()=>{clearInterval(iv);STUDY.mode='idle';};};

function openMap(){openPanel({title:'City map',eyebrow:'Find your way',color:'#4fc3a1',sub:'Tap a place to walk straight there.',build:b=>{const c=drawMap(640,true);c.className='mapc';const ctx=c.getContext('2d');const p=w2m(player.x,player.z,640);ctx.fillStyle='#ffffff';ctx.strokeStyle='#1d2b44';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p[0],p[1],9,0,TAU);ctx.fill();ctx.stroke();ctx.font=`700 18px ${FB}`;ctx.fillStyle='#1d2b44';ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineWidth=5;ctx.strokeStyle='#fff';ctx.strokeText('You',p[0]+14,p[1]);ctx.fillText('You',p[0]+14,p[1]);
  c.setAttribute('role','img');c.setAttribute('aria-label','Map of YMH City');b.appendChild(c);const g=document.createElement('div');g.className='goto';const vis=store.get('stamps',[]);
  ZONES.forEach(z=>{const x=document.createElement('button');x.type='button';x.innerHTML=`<i style="background:${z.color}"></i><span>${z.name}${vis.includes(z.id)?' ✓':''}</span>`;x.addEventListener('click',()=>{closePanel();goTo(z);});g.appendChild(x);});b.appendChild(g);}});}
function goTo(z){const s=z.spot;player.x=s.x;player.z=s.z;const dx=z.x-s.x,dz=z.z-s.z;player.rot=Math.atan2(dx,dz);cam.yaw=Math.atan2(-dx,-dz);cam.pitch=0.32;cam.tx=s.x;cam.tz=s.z;toast(`Welcome to ${theName(z.name)}`,1800);}
function openPassport(){openPanel({title:'Calm Passport',eyebrow:'Your journey',color:'#ffc94a',sub:'Collect a stamp at every place you visit.',build:b=>{const s=store.get('stamps',[]);
  b.innerHTML=`<p class="lead">${s.length===ZONES.length?'Every stamp collected. You explored the whole city!':`${s.length} of ${ZONES.length} places visited. Step inside a place to get its stamp.`}</p><div class="stamps">${ZONES.map(z=>`<div class="stampc ${s.includes(z.id)?'got':''}" style="color:${z.color}"><i style="${s.includes(z.id)?`background:${z.color}`:''}"></i><div><b style="color:var(--ink)">${z.name}</b><span>${s.includes(z.id)?'Visited':z.sub}</span></div></div>`).join('')}</div>`;}});}
$('btnMap').addEventListener('click',openMap);$('btnPassport').addEventListener('click',openPassport);

/* ================= INTRO ================= */
const ip=$('introPlaces');ZONES.forEach(z=>{const s=document.createElement('span');s.innerHTML=`<i style="background:${z.color}"></i>${z.name}`;ip.appendChild(s);});
const sws=$('swatches');['#ff7a66','#4fc3a1','#7aa7ff','#ffc94a','#b28dff'].forEach((c,i)=>{const x=document.createElement('button');x.className='sw';x.type='button';x.style.background=c;x.setAttribute('aria-label','Outfit colour '+(i+1));x.setAttribute('aria-pressed',String(i===0));x.addEventListener('click',()=>{sws.querySelectorAll('.sw').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));setOutfit(c);});sws.appendChild(x);});
$('enterBtn').addEventListener('click',()=>{started=true;$('intro').hidden=true;$('hud').hidden=false;cam.yaw=0;cam.pitch=0.3;cam.distT=11;updateStampCount();canvas.focus({preventScroll:true});setLayer('birds',true);setLayer('pad',true);setTimeout(()=>toast('Walk through the rainbow gate to enter the city.'),600);});

/* ================= TIME OF DAY ================= */
const TODS={
 morning:{top:'#6fb4ee',mid:'#c4e2ff',bot:'#ffe3c8',fog:'#f0e5dc',sun:'#ffd7a8',sunI:0.8,hemiS:'#e9f1ff',hemiG:'#8cbf6d',hemiI:0.66,amb:0.12,lamp:0,win:0.1,stars:0,cloud:'#ffffff',cloudE:0.3,sunOff:[85,42,75],spr:'#fff0d6',sprS:150,fire:0},
 afternoon:{top:'#3f9ced',mid:'#9fd6ff',bot:'#e4f6ff',fog:'#d4eeff',sun:'#fff0d4',sunI:0.9,hemiS:'#e2f4ff',hemiG:'#8cc96d',hemiI:0.72,amb:0.12,lamp:0,win:0.12,stars:0,cloud:'#ffffff',cloudE:0.32,sunOff:[55,95,38],spr:'#fffbe8',sprS:150,fire:0},
 evening:{top:'#2c3d7d',mid:'#ea8f7d',bot:'#ffc888',fog:'#eaa98c',sun:'#ffa868',sunI:0.82,hemiS:'#ffd0b4',hemiG:'#6f8c5c',hemiI:0.55,amb:0.12,lamp:0.85,win:0.75,stars:0.2,cloud:'#ffc9b8',cloudE:0.28,sunOff:[-40,20,-95],spr:'#ffb27a',sprS:230,fire:0.45},
 night:{top:'#050920',mid:'#111b44',bot:'#25325e',fog:'#18213f',sun:'#9fb3ff',sunI:0.38,hemiS:'#6274b8',hemiG:'#1d2a37',hemiI:0.45,amb:0.14,lamp:1.5,win:1,stars:1,cloud:'#4c5785',cloudE:0.06,sunOff:[30,80,-70],spr:'#eef2ff',sprS:60,fire:1}};
const TOD_LBL={morning:'Morning',afternoon:'Afternoon',evening:'Evening',night:'Night'};const TOD_DOT={morning:'#ffb46b',afternoon:'#ffd23f',evening:'#ff7a66',night:'#4b5bd6'};
const WIN_DAY=new THREE.Color('#9fd8ff'),WIN_NIGHT=new THREE.Color('#ffc86a'),WINC_DAY=new THREE.Color('#c9ecff'),WINC_NIGHT=new THREE.Color('#ffe2a8');
function autoTOD(){const h=new Date().getHours();if(h>=5&&h<11)return 'morning';if(h>=11&&h<16)return 'afternoon';if(h>=16&&h<19)return 'evening';return 'night';}
function todState(p){const o={};for(const k in p){const v=p[k];o[k]=typeof v==='string'?new THREE.Color(v):Array.isArray(v)?new THREE.Vector3(v[0],v[1],v[2]):v;}return o;}
function cloneState(s){const o={};for(const k in s)o[k]=s[k]&&s[k].clone?s[k].clone():s[k];return o;}
const TOD={name:'afternoon',cur:null,from:null,to:null,k:1};
function setTOD(name,instant){if(!TODS[name])name='afternoon';TOD.name=name;store.set('tod',name);const tg=todState(TODS[name]);if(instant||!TOD.cur){TOD.cur=tg;TOD.from=null;TOD.k=1;}else{TOD.from=cloneState(TOD.cur);TOD.to=tg;TOD.k=0;}syncTODUI();}
function stepTOD(dt){if(!TOD.cur)return;if(TOD.from&&TOD.k<1){TOD.k=Math.min(1,TOD.k+dt/2.5);const e=TOD.k*TOD.k*(3-2*TOD.k);for(const k in TOD.from){const a=TOD.from[k],b=TOD.to[k];if(a.isColor||a.isVector3)TOD.cur[k].copy(a).lerp(b,e);else TOD.cur[k]=a+(b-a)*e;}}
  const s=TOD.cur;const u=sky.material.uniforms;u.top.value.copy(s.top);u.mid.value.copy(s.mid);u.bot.value.copy(s.bot);MAIN.scene.fog.color.copy(s.fog);MAIN.scene.background.copy(s.fog);
  sun.color.copy(s.sun);sun.intensity=s.sunI;hemi.color.copy(s.hemiS);hemi.groundColor.copy(s.hemiG);hemi.intensity=s.hemiI;amb.intensity=s.amb;
  LAMP_MAT.emissiveIntensity=0.3+s.lamp*1.1;BULB_MAT.emissiveIntensity=0.25+s.lamp*1.4;LANTERN_MAT.emissiveIntensity=0.5+s.lamp*0.9;POOL_MAT.opacity=s.lamp*0.5;SCREEN_MAT.emissiveIntensity=0.5+s.lamp*0.5;
  const w=Math.min(1,s.win);WIN_MAT.emissive.copy(WIN_DAY).lerp(WIN_NIGHT,w);WIN_MAT.color.copy(WINC_DAY).lerp(WINC_NIGHT,w);WIN_MAT.emissiveIntensity=0.15+s.win*0.75;
  STARS.material.opacity=s.stars;if(FIRE)FIRE.material.opacity=s.fire;CLOUD_MAT.color.copy(s.cloud);CLOUD_MAT.emissive.copy(s.cloud);CLOUD_MAT.emissiveIntensity=s.cloudE;
  sunSpr.material.color.copy(s.spr);sunSpr.scale.set(s.sprS,s.sprS,1);SUN_OFF.copy(s.sunOff);SUN_DIR.copy(s.sunOff).normalize();}
function syncTODUI(){$('timeLbl').textContent=TOD_LBL[TOD.name];$('timeDot').style.background=TOD_DOT[TOD.name];document.querySelectorAll('[data-tod]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tod===TOD.name)));}
{const menu=$('timeMenu'),it=$('introTime');Object.keys(TODS).forEach(k=>{const mk=cls=>{const x=document.createElement('button');x.type='button';x.dataset.tod=k;if(cls)x.className=cls;x.innerHTML=`<span class="tdot" style="background:${TOD_DOT[k]}"></span>${TOD_LBL[k]}`;x.addEventListener('click',()=>{setTOD(k);menu.hidden=true;$('btnTime').setAttribute('aria-expanded','false');});return x;};menu.appendChild(mk());it.appendChild(mk('tbtn'));});
  $('btnTime').addEventListener('click',e=>{e.stopPropagation();menu.hidden=!menu.hidden;$('btnTime').setAttribute('aria-expanded',String(!menu.hidden));});
  document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&e.target.closest('#btnTime')===null)menu.hidden=true;});}

/* ================= LOOP ================= */
let last=performance.now(),T=0;
function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;T+=dt;
  for(let i=0;i<updaters.length;i++)updaters[i](dt,T);
  for(const n of npcs)n.update(dt,T);
  updatePlayer(dt,T);updateCamera(dt,T);updateHUD(dt,T);stepTOD(dt);
  renderer.render(scene,camera);requestAnimationFrame(loop);}
async function boot(){try{await Promise.race([Promise.all([document.fonts.load(`800 64px "Bricolage Grotesque"`),document.fonts.load(`700 64px "Bricolage Grotesque"`),document.fonts.load(`500 32px Lexend`)]),new Promise(r=>setTimeout(r,2500))]);}catch(e){}
  buildWorld();setTOD(store.get('tod',null)||autoTOD(),true);cam.tx=0;cam.ty=8;cam.tz=70;cam.dist=40;cam.distT=40;
  const eb=$('enterBtn');eb.disabled=false;eb.textContent='Enter the city';
  requestAnimationFrame(loop);}

