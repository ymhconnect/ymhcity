'use strict';
/* =========================================================
   v9: YMH Hut, About (i) panel, weather (rain, snow, autumn)
   ========================================================= */
const LINKS=Object.assign({website:'https://www.youthformentalhealth.org',instagram:'',email:'communications@youthformentalhealth.org',volunteer:'',whatsapp:''},(window.YMH_CONFIG&&YMH_CONFIG.links)||{});
function linkCards(keys){const L=LINKS;const handle=u=>{const m=(u||'').match(/instagram\.com\/([^/?#]+)/i);return m?'@'+m[1]:u;};
  const card=(href,title,sub,ico)=>href?`<a class="hut-link" href="${esc(href)}" target="_blank" rel="noopener"><i>${ico}</i><span><b>${esc(title)}</b><small>${esc(sub)}</small></span></a>`:`<div class="hut-link soon"><i>${ico}</i><span><b>${esc(title)}</b><small>Link coming soon</small></span></div>`;
  const C={website:()=>card(L.website,'Visit our website',(L.website||'').replace(/^https?:\/\//,'').replace(/\/$/,''),'🌐'),
    instagram:()=>card(L.instagram,'Follow us on Instagram',handle(L.instagram),'📷'),
    email:()=>card(L.email?'mailto:'+L.email+'?subject='+encodeURIComponent('YMH City feedback'):'','Write to us',(L.email||'')+' · feedback or copyright concerns','✉️'),
    volunteer:()=>card(L.volunteer,'Join YMH as a volunteer','Fill in our sign-up form','🙌'),
    whatsapp:()=>card(L.whatsapp,'Join our WhatsApp community','Updates, events and good company','💬')};
  return `<div class="hut-grid">${keys.map(k=>C[k]()).join('')}</div>`;}

/* ---------- About (i) ---------- */
function openAbout(){const inClaude=!!window.claude;openPanel({title:'About YMH City',eyebrow:'Information',color:'#2fb08c',sub:'A virtual mental health city',build:b=>{
  b.innerHTML=`<p class="lead"><b>YMH City is a virtual mental health city designed by Youth for Mental Health.</b></p>
  <p class="lead">The city has been developed with limited and most efficient use of tech resources. No AI is used while you explore and engage with the city and its zones.${inClaude?'':' The city is hosted on the website of Youth for Mental Health and not on an AI platform.'}</p>
  <p class="lead">This is a place to explore and unwind and not a replacement for professional care.</p>
  ${linkCards(['website','instagram','email'])}`;}});track('about',{});}

/* ---------- YMH Hut ---------- */
function buildHut(x,z){KEEP.push([x,z,10]);const ry=Math.atan2(-x,4);const g=grp(x,z,ry);
  cyl(4.9,5.1,0.3,'#e9dccb',0,0.15,0,g,28);
  cyl(3.4,3.4,3.3,'#fff4e2',0,1.8,0,g,24);cyl(3.46,3.46,0.4,'#ff7a66',0,0.55,0,g,24);cyl(3.46,3.46,0.18,'#2fb08c',0,3.3,0,g,24);
  const roof=cone(4.7,3.3,'#ffc94a',0,5.1,0,g,14);cone(4.75,0.5,'#ff7a66',0,3.62,0,g,14);
  for(let k=0;k<14;k++){const a=k/14*TAU;const s=sph(0.28,['#ff7a66','#2fb08c','#8b7cf0','#5aa6c2'][k%4],Math.sin(a)*4.55,3.4,Math.cos(a)*4.55,g,6,false);}
  cyl(0.06,0.06,2,'#3a3f4a',0,7.4,0,g,6);const fl=box(1.2,0.7,0.05,'#2fb08c',0.62,8,0,g,false);updatersPushSafe((dt,t)=>{fl.rotation.y=Math.sin(t*2.2)*0.25;});sph(0.2,'#ff7a66',0,8.5,0,g,8,false);
  box(1.9,2.75,0.2,'#ffffff',0,1.42,3.32,g);box(1.5,2.45,0.24,'#7a5236',0,1.28,3.36,g);sph(0.08,'#ffd166',0.5,1.35,3.52,g,6,false);
  for(const a of [-0.95,0.95,2.2,-2.2]){const wg=grp(0,0,a,g);box(1.25,1.15,0.12,'#ffffff',0,2.05,3.36,wg);const gl=box(1.0,0.9,0.14,'#bfe9ff',0,2.05,3.4,wg,false);gl.material=WIN_MAT;box(1.3,0.18,0.35,'#d08a52',0,1.38,3.5,wg);}
  /* welcome sign on two posts in front */
  for(const sx of [-2.1,2.1]){cyl(0.1,0.12,3.6,'#7a5236',sx,1.8,6.2,g,8);gCircle(g,sx,6.2,0.25);}
  sign('YMH Hut','say hi · volunteer · get in touch','#2fb08c','#ffffff',4.1,1.15,g,0,3.15,6.25);
  /* a little info table with flyers */
  box(2.2,0.85,0.9,'#d97a68',2.9,0.43,4.6,g);['#ffc94a','#8b7cf0','#5aa6c2','#ffffff'].forEach((c,k)=>{const f=box(0.42,0.04,0.56,c,2.2+k*0.48,0.88,4.6,g,false);f.rotation.y=(k-1.5)*0.12;});gBox(g,2.9,4.6,1.2,0.55);
  for(const sx of [-1.6,1.6]){cyl(0.34,0.26,0.55,'#e88a62',sx,0.28,4.1,g,10);sph(0.42,'#5dbb63',sx,0.85,4.1,g,7);sph(0.1,'#ff6f91',sx+0.15,1.15,4.25,g,6,false);}
  for(const sx of [-1.15,1.15]){box(0.08,0.4,0.08,'#3a3f4a',sx,3.0,3.5,g,false);const l=box(0.22,0.3,0.22,'#fff6d8',sx,2.75,3.6,g,false);l.material=LAMP_MAT;}
  {const a=L2W(g,-2.1,6.2),b2=L2W(g,2.1,6.2);try{bunting(a.x,3.75,a.z,b2.x,3.75,b2.z,0.35);}catch(e){}}
  gCircle(g,0,0,3.6);
  {const p=L2W(g,4.3,4.4);staticNPC(p.x,p.z,ry+0.5,{shirt:'#2fb08c',pack:false},null,"Hi! I'm Riya from the YMH team. Want to volunteer, or just say hi?");}
  const s=pillSprite('YMH Hut','#2fb08c',1.7);s.position.set(x,10.2,z);scene.add(s);
  const f=L2W(g,0,8);addPlace({id:'hut',name:'YMH Hut',color:'#2fb08c',x,z,spot:{x:f.x,z:f.z},area:'City Centre',sub:'Say hi to the YMH team',stamp:false});
  SPOTS.push({label:'Visit the YMH Hut',sub:'Say hi, volunteer or get in touch',color:'#2fb08c',tx:L2W(g,0,6).x,tz:L2W(g,0,6).z,tr:4.2,run:openHut});}
function updatersPushSafe(fn){updaters.push(fn);}
function openHut(){if(typeof award==='function'&&!store.get('hut9',0)){store.set('hut9',1);award(5,'Said hi at the YMH Hut','hut');}
  openPanel({title:'YMH Hut',eyebrow:'City Centre',color:'#2fb08c',sub:'The team behind YMH City',build:b=>{
    b.innerHTML=`<p class="lead">Youth for Mental Health is a youth-led community working to make mental health something we can all talk about. Come and be part of it.</p>
    <h3 class="h3" style="margin-top:6px">Join us</h3>${linkCards(['volunteer','whatsapp'])}
    <h3 class="h3">Find us</h3>${linkCards(['website','instagram','email'])}`;}});track('place',{id:'hut'});}

/* =========================================================
   WEATHER
   ========================================================= */
const WEA_KINDS=[{id:'clear',name:'Clear',ico:'☀️',sub:'blue skies'},{id:'rain',name:'Rain',ico:'🌧️',sub:'puddles'},{id:'snow',name:'Snow',ico:'❄️',sub:'snowfall'},{id:'autumn',name:'Autumn',ico:'🍂',sub:'falling leaves'}];
const WEA={mode:'clear',u:{uSnow:{value:0},uWet:{value:0},uAut:{value:0}},patched:new WeakSet(),o:null,rainMine:false,lastW:null};
const WEA_BASE=THREE.Material.prototype.onBeforeCompile;
function weaOBC(sh){sh.uniforms.uSnow=WEA.u.uSnow;sh.uniforms.uWet=WEA.u.uWet;sh.uniforms.uAut=WEA.u.uAut;
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWN;').replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nvWN=(vec4(transformedNormal,0.0)*viewMatrix).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWN;\nuniform float uSnow;\nuniform float uWet;\nuniform float uAut;').replace('#include <color_fragment>',`#include <color_fragment>
  float wUp=smoothstep(0.35,0.85,normalize(vWN).y);
  vec3 wc=diffuseColor.rgb;float wgr=wc.g-max(wc.r,wc.b);
  wc=mix(wc,vec3(0.74,0.36,0.12)*(0.55+0.6*wc.g),uAut*0.58*smoothstep(0.02,0.12,wgr));
  wc*=1.0-0.3*uWet*(0.35+0.65*wUp);
  wc=mix(wc,vec3(0.93,0.95,1.0),uSnow*smoothstep(0.18,0.6,normalize(vWN).y));
  diffuseColor.rgb=wc;`).replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,0.22,uWet*wUp);');}
function weaPatchMat(m){if(!m||WEA.patched.has(m))return;WEA.patched.add(m);if(!(m.isMeshStandardMaterial||m.isMeshLambertMaterial||m.isMeshPhongMaterial))return;if(m.transparent&&m.opacity<0.98)return;if(m.onBeforeCompile!==WEA_BASE)return;m.onBeforeCompile=weaOBC;m.needsUpdate=true;}
function weaPatchScene(sc){sc.traverse(o=>{if(!o.isMesh||o.userData.noWeather)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(weaPatchMat);});}
const weaOutdoor=()=>!!W&&(W.main||W.id==='mountain'||W.id==='beach');

function weaBuild(){const o={};const H=26;o.H=H;
  /* rain streaks */
  const NR=1400;o.NR=NR;o.r=new Float32Array(NR*3);for(let i=0;i<NR;i++){o.r[i*3]=(Math.random()*2-1)*H;o.r[i*3+1]=Math.random()*24;o.r[i*3+2]=(Math.random()*2-1)*H;}
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NR*6),3));
  o.rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:'#c4d6e8',transparent:true,opacity:0.55,depthWrite:false}));o.rain.frustumCulled=false;o.rain.userData.noWeather=true;
  /* snow flakes */
  const NS=1800;o.NS=NS;o.s=new Float32Array(NS*4);for(let i=0;i<NS;i++){o.s[i*4]=(Math.random()*2-1)*H;o.s[i*4+1]=Math.random()*22;o.s[i*4+2]=(Math.random()*2-1)*H;o.s[i*4+3]=Math.random()*TAU;}
  const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');const gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.55,'rgba(255,255,255,.85)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NS*3),3));
  o.snow=new THREE.Points(sg,new THREE.PointsMaterial({size:0.22,map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,color:'#ffffff'}));o.snow.frustumCulled=false;
  /* falling leaves */
  const NL=240;o.NL=NL;o.l=[];const LC=['#d9622b','#e8932f','#c43d2a','#f2b632','#a8552a'];
  const lg=new THREE.PlaneGeometry(0.34,0.22);o.leaves=new THREE.InstancedMesh(lg,new THREE.MeshLambertMaterial({side:THREE.DoubleSide}),NL);o.leaves.frustumCulled=false;o.leaves.userData.noWeather=true;
  const col=new THREE.Color();for(let i=0;i<NL;i++){o.l.push({x:(Math.random()*2-1)*20,y:Math.random()*14,z:(Math.random()*2-1)*20,a:Math.random()*TAU,b:Math.random()*TAU,s:0.6+Math.random()*0.9});o.leaves.setColorAt(i,col.set(LC[i%LC.length]));}
  o.dm=new THREE.Object3D();
  /* puddles and fallen leaves in the city */
  const pm=new THREE.MeshStandardMaterial({color:'#5d7488',roughness:0.05,metalness:0.25,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const NP=170;o.pud=new THREE.InstancedMesh(new THREE.CircleGeometry(1,22),pm,NP);o.pud.userData.noWeather=true;o.pud.renderOrder=1;
  let k=0,tries=0;while(k<NP&&tries<20000){tries++;const px=-90+Math.random()*180,pz=-90+Math.random()*170;if(typeof walkableMain==='function'&&!walkableMain(px,pz))continue;o.dm.position.set(px,0.035,pz);o.dm.rotation.set(-Math.PI/2,0,Math.random()*TAU);o.dm.scale.set(0.6+Math.random()*1.3,0.35+Math.random()*0.8,1);o.dm.updateMatrix();o.pud.setMatrixAt(k++,o.dm.matrix);}o.pud.count=k;
  const lm=new THREE.MeshLambertMaterial({transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const NG=2600;o.gl=new THREE.InstancedMesh(new THREE.PlaneGeometry(0.36,0.24),lm,NG);o.gl.userData.noWeather=true;o.gl.renderOrder=1;
  k=0;tries=0;while(k<NG&&tries<40000){tries++;const px=-200+Math.random()*380,pz=-150+Math.random()*245;if(typeof walkableMain==='function'&&!walkableMain(px,pz))continue;o.dm.position.set(px,0.04,pz);o.dm.rotation.set(-Math.PI/2,0,Math.random()*TAU);const sc=1.1+Math.random()*1.2;o.dm.scale.set(sc,sc,1);o.dm.updateMatrix();o.gl.setMatrixAt(k,o.dm.matrix);o.gl.setColorAt(k,col.set(LC[(Math.random()*LC.length)|0]));k++;}o.gl.count=k;
  o.pud.visible=o.gl.visible=false;MAIN.scene.add(o.pud);MAIN.scene.add(o.gl);
  o.tint=document.createElement('div');o.tint.id='weaTint';document.body.appendChild(o.tint);
  WEA.o=o;}

function setWeather(id,quiet){if(!WEA_KINDS.find(k=>k.id===id))id='clear';WEA.mode=id;try{store.set('weather9',id);}catch(e){}
  const k=WEA_KINDS.find(q=>q.id===id);const ic=$('weaIco'),lb=$('weaLbl');if(ic)ic.textContent=k.ico;if(lb)lb.textContent=k.name;
  document.querySelectorAll('#weaMenu [data-w]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.w===id)));
  if(id!=='clear'){if(!WEA.o)weaBuild();weaPatchScene(W.scene);if(W!==MAIN)weaPatchScene(MAIN.scene);}
  weaSound();if(!quiet&&started){toast(id==='clear'?'The sky clears up.':id==='rain'?'Here comes the rain. Puddles soon.':id==='snow'?'It\'s starting to snow.':'Autumn leaves are falling.',2000);track('weather',{id});}}
function weaSound(){if(typeof AUD==='undefined'||!AUD.ctx||!AUD.L||!AUD.L.rain)return;const want=WEA.mode==='rain'&&weaOutdoor()&&(WEA.rainMine||anyOn());
  if(want&&!AUD.L.rain.on){setLayer('rain',true);WEA.rainMine=true;}else if(!want&&WEA.rainMine){setLayer('rain',false);WEA.rainMine=false;}}

let weaT0=performance.now();
TICKS.push(()=>{const _n=performance.now();let dt=Math.min((_n-weaT0)/1000,0.5);weaT0=_n;if(!WEA.o&&WEA.mode==='clear')return;if(!WEA.o)weaBuild();const o=WEA.o;
  const out=weaOutdoor();
  if(WEA.lastW!==W){WEA.lastW=W;if(out){[o.rain,o.snow,o.leaves].forEach(m=>W.scene.add(m));if(WEA.mode!=='clear')weaPatchScene(W.scene);}weaSound();
    if(!out){WEA.u.uSnow.value=WEA.u.uWet.value=WEA.u.uAut.value=0;}}
  const m=WEA.mode;const tS=out&&m==='snow'?1:0,tW=out&&m==='rain'?1:0,tA=out&&m==='autumn'?1:0;
  const ease=(u,t,up,down)=>{u.value+=(t-u.value)*Math.min(1,dt/(t>u.value?up:down));if(Math.abs(t-u.value)<0.002)u.value=t;};
  ease(WEA.u.uSnow,tS,6,5);ease(WEA.u.uWet,tW,4,6);ease(WEA.u.uAut,tA,4,4);
  o.pud.visible=W===MAIN&&WEA.u.uWet.value>0.01;o.pud.material.opacity=0.6*WEA.u.uWet.value;
  o.gl.visible=W===MAIN&&WEA.u.uAut.value>0.01;o.gl.material.opacity=WEA.u.uAut.value;
  o.tint.className=out?m:'';
  const cx=camera.position.x,cz=camera.position.z,H=o.H,wrap=(v,c)=>v-c>H?v-2*H:v-c<-H?v+2*H:v;
  o.rain.visible=out&&m==='rain';if(o.rain.visible){const p=o.rain.geometry.attributes.position.array;for(let i=0;i<o.NR;i++){let x=wrap(o.r[i*3],cx),y=o.r[i*3+1]-24*dt,z=wrap(o.r[i*3+2],cz);if(y<0)y+=24;o.r[i*3]=x;o.r[i*3+1]=y;o.r[i*3+2]=z;const j=i*6;p[j]=x;p[j+1]=y;p[j+2]=z;p[j+3]=x+0.06;p[j+4]=y-0.75;p[j+5]=z+0.03;}o.rain.geometry.attributes.position.needsUpdate=true;}
  o.snow.visible=out&&m==='snow';if(o.snow.visible){const p=o.snow.geometry.attributes.position.array;const T=performance.now()/1000;for(let i=0;i<o.NS;i++){const q=i*4;let x=wrap(o.s[q],cx),y=o.s[q+1]-(1.1+(i%5)*0.12)*dt,z=wrap(o.s[q+2],cz);if(y<0)y+=22;o.s[q]=x;o.s[q+1]=y;o.s[q+2]=z;const ph=o.s[q+3];p[i*3]=x+Math.sin(T*0.8+ph)*0.35;p[i*3+1]=y;p[i*3+2]=z+Math.cos(T*0.6+ph)*0.35;}o.snow.geometry.attributes.position.needsUpdate=true;}
  o.leaves.visible=out&&m==='autumn';if(o.leaves.visible){const T=performance.now()/1000;const LH=20;for(let i=0;i<o.NL;i++){const L=o.l[i];L.y-=0.9*L.s*dt;L.x+=0.7*dt;if(L.y<0.05){L.y+=14;L.x=cx+(Math.random()*2-1)*LH;L.z=cz+(Math.random()*2-1)*LH;}if(L.x-cx>LH)L.x-=2*LH;if(L.x-cx<-LH)L.x+=2*LH;if(L.z-cz>LH)L.z-=2*LH;if(L.z-cz<-LH)L.z+=2*LH;
    o.dm.position.set(L.x+Math.sin(T*1.3+L.a)*0.6,L.y,L.z);o.dm.rotation.set(T*L.s*1.7+L.a,T*0.9+L.b,Math.sin(T*2+L.a)*0.8);o.dm.scale.setScalar(1);o.dm.updateMatrix();o.leaves.setMatrixAt(i,o.dm.matrix);}o.leaves.instanceMatrix.needsUpdate=true;}});

/* ---------- HUD: weather chip + (i) button ---------- */
(function(){const tr=document.querySelector('.hud-tr');if(!tr)return;
  const w=document.createElement('button');w.className='chip';w.id='btnWeather';w.type='button';w.setAttribute('aria-haspopup','true');w.setAttribute('aria-expanded','false');w.innerHTML='<span id="weaIco" aria-hidden="true">☀️</span><span id="weaLbl">Clear</span>';
  const acc=$('btnAccess');tr.insertBefore(w,acc);
  const i=document.createElement('button');i.className='chip info-btn';i.id='btnInfo';i.type='button';i.setAttribute('aria-label','About YMH City');i.textContent='i';tr.appendChild(i);i.addEventListener('click',openAbout);
  const menu=document.createElement('div');menu.className='time-menu';menu.id='weaMenu';menu.setAttribute('role','menu');menu.hidden=true;document.getElementById('hud').appendChild(menu);
  WEA_KINDS.forEach(k=>{const b=document.createElement('button');b.type='button';b.dataset.w=k.id;b.innerHTML=`<span style="font-size:17px">${k.ico}</span>${k.name}<small style="margin-left:auto;color:var(--ink-2);font-size:12px">${k.sub}</small>`;b.addEventListener('click',()=>{setWeather(k.id);menu.hidden=true;w.setAttribute('aria-expanded','false');});menu.appendChild(b);});
  w.addEventListener('click',e=>{e.stopPropagation();const h=!menu.hidden;menu.hidden=h;w.setAttribute('aria-expanded',String(!h));if(!h){const tm=$('timeMenu');if(tm)tm.hidden=true;}});
  document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&e.target!==w)menu.hidden=true;});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')menu.hidden=true;});})();


/* restore the last chosen weather once the city is running */
{let tries=0;const iv=setInterval(()=>{tries++;if(typeof started!=='undefined'&&started&&typeof W!=='undefined'&&W){clearInterval(iv);let w='clear';try{w=store.get('weather9','clear');}catch(e){}if(w!=='clear')setWeather(w,true);else setWeather('clear',true);}else if(tries>600)clearInterval(iv);},500);}
