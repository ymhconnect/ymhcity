'use strict';
/* =========================================================
   v10: YMH Hut you can walk into (counters, team, helper bot),
   Mood chip removed from the top bar
   ========================================================= */
{const b=document.getElementById('btnMood');if(b)b.remove();}

const HUT={exit:null};
/* outside: the round hut, set back from the avenue, with a path to its door */
function buildHut(x,z){KEEP.push([x,z,10]);const ry=Math.PI/2;const g=grp(x,z,ry);
  cyl(4.9,5.1,0.3,'#e9dccb',0,0.15,0,g,28);
  cyl(3.4,3.4,3.3,'#fff4e2',0,1.8,0,g,24);cyl(3.46,3.46,0.4,'#ff7a66',0,0.55,0,g,24);cyl(3.46,3.46,0.18,'#2fb08c',0,3.3,0,g,24);
  cone(4.7,3.3,'#ffc94a',0,5.1,0,g,14);cone(4.75,0.5,'#ff7a66',0,3.62,0,g,14);
  for(let k=0;k<14;k++){const a=k/14*TAU;sph(0.28,['#ff7a66','#2fb08c','#8b7cf0','#5aa6c2'][k%4],Math.sin(a)*4.55,3.4,Math.cos(a)*4.55,g,6,false);}
  cyl(0.06,0.06,2,'#3a3f4a',0,7.4,0,g,6);const fl=box(1.2,0.7,0.05,'#2fb08c',0.62,8,0,g,false);updaters.push((dt,t)=>{fl.rotation.y=Math.sin(t*2.2)*0.25;});sph(0.2,'#ff7a66',0,8.5,0,g,8,false);
  /* open doorway with warm light inside */
  box(2.2,3.0,0.2,'#ffffff',0,1.5,3.32,g);const dw=box(1.7,2.65,0.22,'#ffd99a',0,1.33,3.36,g,false);dw.material=new THREE.MeshBasicMaterial({color:'#ffe3b0'});
  for(const a of [-0.95,0.95,2.2,-2.2]){const wg=grp(0,0,a,g);box(1.25,1.15,0.12,'#ffffff',0,2.05,3.36,wg);const gl=box(1.0,0.9,0.14,'#bfe9ff',0,2.05,3.4,wg,false);gl.material=WIN_MAT;box(1.3,0.18,0.35,'#d08a52',0,1.38,3.5,wg);}
  for(const sx of [-2.1,2.1]){cyl(0.1,0.12,3.6,'#7a5236',sx,1.8,6.2,g,8);gCircle(g,sx,6.2,0.25);}
  sign('YMH Hut','come in · volunteer · join us','#2fb08c','#ffffff',4.1,1.15,g,0,3.15,6.25);
  for(const sx of [-1.6,1.6]){cyl(0.34,0.26,0.55,'#e88a62',sx,0.28,4.3,g,10);sph(0.42,'#5dbb63',sx,0.85,4.3,g,7);sph(0.1,'#ff6f91',sx+0.15,1.15,4.45,g,6,false);}
  for(const sx of [-1.15,1.15]){box(0.08,0.4,0.08,'#3a3f4a',sx,3.0,3.5,g,false);const l=box(0.22,0.3,0.22,'#fff6d8',sx,2.75,3.6,g,false);l.material=LAMP_MAT;}
  {const a=L2W(g,-2.1,6.2),b2=L2W(g,2.1,6.2);try{bunting(a.x,3.75,a.z,b2.x,3.75,b2.z,0.35);}catch(e){}}
  gCircle(g,0,0,3.6);
  {const p=L2W(g,3.1,6.6);const n=staticNPC(p.x,p.z,ry+0.4,{shirt:'#2fb08c',pack:false},(dt,t)=>{idleAnim(n,t);const u=n.userData;if(u&&u.arms)u.arms[1].rotation.x=-2.6+Math.sin(t*5)*0.35*(Math.sin(t*0.5)>0.3?1:0);},"Hi! Come inside. You can sign up to volunteer or join our community.");}
  /* a short path from the loop to the door */
  try{pathSeg(x+5,z,-10,z,3,'#eedcbd');}catch(e){}for(let px=x+8;px<-10;px+=4)KEEP.push([px,z,3]);
  const s=pillSprite('YMH Hut','#2fb08c',1.7);s.position.set(x,10.2,z);scene.add(s);
  const f=L2W(g,0,8);addPlace({id:'hut',name:'YMH Hut',color:'#2fb08c',x,z,spot:{x:f.x,z:f.z},area:'City Centre',sub:'Volunteer, join the community, say hi',stamp:false});
  const door=L2W(g,0,5.4);HUT.exit={x:door.x,z:door.z,rot:ry};
  SPOTS.push({label:'Enter the YMH Hut',sub:'Volunteer, join our community, say hi',color:'#2fb08c',tx:door.x,tz:door.z,tr:3.4,run:()=>{if(!store.get('hut9',0)){store.set('hut9',1);award(5,'Visited the YMH Hut','hut');}enterWorld(HUT_W,{x:0,z:4.6},Math.PI,'Welcome to the YMH Hut. Visit any counter.');}});}

/* helper bot: a small friendly robot, clearly a guide, not a person */
function helperBot(g,x,z,ry,col){const r=grp(x,z,ry,g);cyl(0.32,0.38,0.5,'#e9eef5',0,0.25,0,r,14);const body=box(0.62,0.62,0.5,'#ffffff',0,0.85,0,r);
  box(0.66,0.08,0.54,col,0,0.56,0,r,false);const head=grp(0,0,0,r);head.position.y=1.42;box(0.66,0.48,0.5,'#ffffff',0,0,0,head);
  const sc=box(0.5,0.3,0.04,'#1d2b44',0,0,0.26,head,false);for(const sx of [-0.12,0.12]){const e=sph(0.05,'#7ef0d0',sx,0.02,0.29,head,8,false);e.material=new THREE.MeshBasicMaterial({color:'#7ef0d0'});}
  cyl(0.02,0.02,0.24,'#3a3f4a',0,0.36,0,head,5,false);const bl=sph(0.07,col,0,0.5,0,head,8,false);bl.material=new THREE.MeshBasicMaterial({color:col});
  for(const sx of [-0.4,0.4]){const a=box(0.12,0.42,0.12,'#e9eef5',sx,0.9,0,r,false);a.rotation.z=sx>0?-0.2:0.2;}
  updaters.push((dt,t)=>{r.position.y=Math.sin(t*2+x)*0.05;head.rotation.y=Math.sin(t*0.7+z)*0.35;bl.scale.setScalar(0.8+0.3*Math.abs(Math.sin(t*3)));});addCircle(L2W(g,x,z).x,L2W(g,x,z).z,0.45);return r;}

function counter(g,x,z,ry,o){const c=grp(x,z,ry,g);
  box(3.4,1.05,0.9,o.color,0,0.53,0,c);box(3.6,0.08,1.05,'#ffffff',0,1.08,0.02,c);box(3.4,0.14,0.92,lighten(o.color),0,0.07,0,c,false);
  const front=new THREE.Mesh(new THREE.PlaneGeometry(3.0,0.7),new THREE.MeshBasicMaterial({map:signTex(o.short,null,o.color,'#ffffff',3.0,0.7)}));front.position.set(0,0.55,0.46);c.add(front);
  for(const sx of [-1.55,1.55])cyl(0.06,0.06,2.6,'#3a3f4a',sx,2.25,-0.3,c,6,false);
  sign(o.title,o.sub,o.color,'#ffffff',3.4,0.95,c,0,3.15,-0.3);
  (o.props||(()=>{}))(c);
  gBox(c,0,0,1.75,0.5);return c;}

function buildHutRoom(w){const g=room7(w,{w:18,d:14,h:5.6,floor:'#e8c79a',tile:4,wall:'#fff4e2',wain:'#2fb08c',trim:'#ffffff',ceiling:'#fffaf2',exitTo:HUT.exit,exitSub:'Back to the City Centre',
    windows:[{x:-8.85,z:0,ry:Math.PI/2,w:3,h:2.2,y:2.7,curtain:'#ffd166'},{x:8.85,z:0,ry:-Math.PI/2,w:3,h:2.2,y:2.7,curtain:'#ffd166'}],pendants:[[-4.5,-2.5,'#ff7a66',0.35],[0,-2.5,'#ffc94a',0.35],[4.5,-2.5,'#2fb08c',0.35]]});
  rug(g,0,1.2,7,4,'#fff1dc','#2fb08c','#ff7a66');
  /* back wall: big YMH banner */
  sign('Youth for Mental Health','Change starts young','#1d2b44','#ffffff',8.6,1.5,g,0,4.35,-6.8);
  /* string lights across the ceiling */
  for(let i=0;i<3;i++){try{bunting(-8.6,4.9-i*0.05,-5+i*4,8.6,4.9-i*0.05,-5+i*4,0.5);}catch(e){}}
  /* 1. Volunteer counter (left) */
  counter(g,-5.4,-3.6,0.35,{color:'#ff7a66',short:'VOLUNTEER',title:'Volunteer with us',sub:'give a few hours · make a difference',props:c=>{box(0.5,0.04,0.36,'#ffffff',-0.9,1.14,0.1,c,false);box(0.5,0.04,0.36,'#ffd166',-0.3,1.14,0.15,c,false);cyl(0.05,0.05,0.2,'#1d2b44',0.5,1.2,0.2,c,6,false);cyl(0.14,0.11,0.2,'#2fb08c',1.1,1.2,0,c,10,false);}});
  {const n=staticNPC(-5.75,-4.6,0.35,{shirt:'#ff7a66',pack:false},(dt,t)=>{idleAnim(n,t);n.userData.head.rotation.y=Math.sin(t*0.4)*0.3;},"Hi, I'm Riya. Want to help out? Tap the counter to sign up as a volunteer.");}
  /* 2. Community counter (right) */
  counter(g,5.4,-3.6,-0.35,{color:'#25a865',short:'COMMUNITY',title:'Join our community',sub:'updates · opportunities · resources',props:c=>{const ph=box(0.34,0.6,0.05,'#1d2b44',0.6,1.42,0.05,c,false);ph.rotation.x=-0.3;const sc=box(0.3,0.54,0.02,'#d6ffe9',0.6,1.43,0.08,c,false);sc.rotation.x=-0.3;sc.material=new THREE.MeshBasicMaterial({color:'#d6ffe9'});for(let k=0;k<3;k++)box(0.45,0.03,0.32,['#ffffff','#bfe9ff','#ffd166'][k],-0.8,1.14+k*0.035,0.1,c,false);}});
  {const n=staticNPC(5.75,-4.6,-0.35,{shirt:'#25a865',pack:false},(dt,t)=>{idleAnim(n,t);n.userData.head.rotation.y=Math.sin(t*0.45+1)*0.3;},"I'm Kabir. Our WhatsApp community shares opportunities and resources. Tap the counter to join.");}
  /* 3. Find-us kiosk with the helper bot (centre back) */
  {const k=grp(0,-5.2,0,g);box(1.6,1.1,0.7,'#8b7cf0',0,0.55,0,k);box(1.7,0.08,0.8,'#ffffff',0,1.12,0,k);const scr=box(1.3,0.8,0.06,'#1d2b44',0,1.65,-0.15,k,false);scr.rotation.x=-0.25;
    const st=new THREE.Mesh(new THREE.PlaneGeometry(1.2,0.7),new THREE.MeshBasicMaterial({map:signTex('Find us','web · insta · email','#8b7cf0','#ffffff',1.2,0.7)}));st.position.set(0,1.66,-0.11);st.rotation.x=-0.25;k.add(st);gBox(k,0,0,0.85,0.4);}
  {const n=staticNPC(1.55,-4.75,-0.3,{shirt:'#8b7cf0',pack:false},(dt,t)=>{idleAnim(n,t);n.userData.head.rotation.y=Math.sin(t*0.5+2)*0.3;},"I'm Meera. Need our website or Instagram? Tap the Find us desk.");}
  w.botLine=true;
  /* seating, plants and wall art */
  for(const [x,z,c] of [[-3.4,1.4,'#ffc94a'],[3.4,1.4,'#5aa6c2'],[3.6,3.8,'#ff9fc6']]){const bb=sph(0.7,c,x,0.42,z,g,12);bb.scale.set(1,0.6,1);addCircle(x,z,0.6);}
  plant(g,-8,-6,1.3);plant(g,8,-6,1.3,'#2fa39a');plant(g,-8,5.6,1);plant(g,8,5.6,1);
  frameArt(g,-8.82,2.7,-4.4,Math.PI/2,1.6,1.1,11,'#ffffff');frameArt(g,8.82,2.7,-4.4,-Math.PI/2,1.6,1.1,12,'#ffffff');
  {const q=staticNPC(-3.4,1.4,Math.PI*0.75,{pack:true},'sit',"Just signed up to volunteer. Now waiting for my friend.",0.15);sitPose(q);}
  /* the three counters as places to interact */
  const sp=(label,sub,color,x,z,run)=>SPOTS.push({label,sub,color,tx:x,tz:z,tr:2,run});
  sp('Volunteer counter','Sign up to volunteer with YMH','#ff7a66',-4.8,-2.0,hutVolunteer);
  sp('Community counter','Join our WhatsApp community','#25a865',4.8,-2.0,hutCommunity);
  sp('Find us desk','Our website, Instagram and email','#8b7cf0',0.6,-3.6,hutFindUs);}

const HUT_W=newWorld({id:'hut',title:'YMH Hut',camDist:7,build:buildHutRoom,welcome:'Welcome to the YMH Hut.',onEnter(){track('room',{id:'hut'});}});

function hutVolunteer(){openPanel({title:'Volunteer with YMH',eyebrow:'YMH Hut · Volunteer counter',color:'#ff7a66',sub:'Riya can help you get started',
  build:b=>{b.innerHTML=`<p class="lead">Want to be part of Youth for Mental Health? Fill in the short form to tell us a little about yourself and how you'd like to help. The team will get in touch.</p>${linkCards(['volunteer'])}`;}});track('activity',{id:'hut-volunteer'});}
function hutCommunity(){openPanel({title:'Join our WhatsApp community',eyebrow:'YMH Hut · Community counter',color:'#25a865',sub:'Kabir runs the community desk',
  build:b=>{b.innerHTML=`<p class="lead"><b>To stay updated with our projects, opportunities, academic and well-being resources, join our WhatsApp community.</b></p><p class="lead">You can mute it or leave any time.</p>${linkCards(['whatsapp'])}`;}});track('activity',{id:'hut-community'});}
function hutFindUs(){openPanel({title:'Find us',eyebrow:'YMH Hut · Find us desk',color:'#8b7cf0',sub:'Meera can point you to the team',
  build:b=>{b.innerHTML=`<p class="lead">For feedback, ideas or copyright concerns, write to the team. They read every message.</p>${linkCards(['website','instagram','email'])}`;}});track('activity',{id:'hut-findus'});}
/* the old outside-only panel now opens the room's info */
function openHut(){hutCommunity();}

/* ---------- gentle screening for anything posted to a shared wall ---------- */
const SCREEN={
  crisis:/(suicid|kill\s*(my\s*self|myself|me\b)|end\s*(my\s*life|it\s*all)|want\s*to\s*die|wanna\s*die|don'?t\s*want\s*to\s*(live|be\s*here|exist)|self[\s-]*harm|cut(ting)?\s*myself|hurt(ing)?\s*myself|no\s*reason\s*to\s*live)/i,
  contact:/(https?:\/\/|www\.|\b[\w.+-]+@[\w-]+\.[\w.]+\b|\+?\d[\d\s-]{8,}\d|instagram\.com|wa\.me)/i,
  abuse:/\b(f+u+c+k+\w*|sh[i1]t\w*|b[i1]tch\w*|bastard\w*|a+ss+hole\w*|c+u+n+t\w*|slut\w*|wh[o0]re\w*|retard\w*|chut[i1]y\w*|madar\s*chod\w*|ma+d+a*r*chod|b(e|a)h?e?n\s*chod\w*|bhosd\w*|gaa?ndu\w*|randi\w*|haraa?mi\w*|lund\w*|bsdk|mc|bc)\b/i};
function screenText(t){if(SCREEN.crisis.test(t))return 'crisis';if(SCREEN.contact.test(t))return 'contact';if(SCREEN.abuse.test(t))return 'abuse';return '';}
function crisisCard(){openPanel({title:'Thank you for writing that',eyebrow:'You are not alone',color:'#2fa39a',sub:'This wall is public, so we haven\'t posted it.',build:b=>{
  b.innerHTML=`<p class="lead">It sounds like things may be really hard right now. You deserve support from a real person.</p>
  <div class="contact"><h3>Tele-MANAS</h3><p>Free, 24 hours a day, every day, in many Indian languages.</p><div class="num-row"><span class="bignum">14416</span></div><p>or 1-800-891-4416</p></div>
  <p class="lead" style="margin-top:12px">If you are in immediate danger, call <b>112</b>. You can also tell someone you trust how you're feeling, today.</p>`;}});}
document.addEventListener('click',e=>{const id=e.target&&e.target.id;if(id!=='plGo'&&id!=='pgGo')return;const ta=document.getElementById(id==='plGo'?'plS':'pgT');if(!ta)return;const r=screenText(ta.value||'');if(!r)return;
  e.stopImmediatePropagation();e.preventDefault();
  if(r==='crisis'){crisisCard();return;}
  toast(r==='contact'?'Please leave out links, phone numbers and emails. This wall is public.':'Please keep it kind. Posts with abusive words aren\'t shared.',3200);},true);
