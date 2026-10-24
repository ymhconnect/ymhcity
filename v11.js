'use strict';
/* =========================================================
   v11: sticky-note boards instead of summaries (Museum, Policy
   Circle), psychology topics, Support Booth placement, weather
   choice at the start
   ========================================================= */

/* ---------- Museum content: titles only for timelines, topics + founders ---------- */
MUSEUM.history.title='Moments in mental health history';
MUSEUM.history.items=[
 {year:'1879',title:'First psychology laboratory, Leipzig'},
 {year:'1890',title:'The Principles of Psychology'},
 {year:'1948',title:'The WHO Constitution'},
 {year:'1960s',title:'Cognitive therapy'},
 {year:'1992',title:'The first World Mental Health Day'},
 {year:'2013',title:'WHO Mental Health Action Plan'},
 {year:'2025',title:'WHO global mental health reports'}].map(o=>Object.assign(o,{short:''}));
MUSEUM.india.title='Milestones in India';
MUSEUM.india.items=[
 {year:'1922',title:'Indian Psychoanalytical Society'},
 {year:'1933',title:'Psychiatry unit at R.G. Kar Medical College'},
 {year:'1974',title:'NIMHANS, Bengaluru'},
 {year:'1982',title:'National Mental Health Programme'},
 {year:'1996',title:'District Mental Health Programme'},
 {year:'2014',title:'National Mental Health Policy'},
 {year:'2016',title:'National Mental Health Survey'},
 {year:'2017',title:'Mental Healthcare Act'},
 {year:'2020',title:'Manodarpan'},
 {year:'2022',title:'Tele-MANAS'},
 {year:'2025',title:'Supreme Court guidelines for institutions'}].map(o=>Object.assign(o,{short:''}));
MUSEUM.science.title='Psychology topics and their founders';
MUSEUM.science.items=[
 {year:'Topic',title:'Psychoanalysis',short:'Sigmund Freud'},
 {year:'Topic',title:'Behaviourism',short:'John B. Watson'},
 {year:'Topic',title:'Humanistic psychology',short:'Abraham Maslow and Carl Rogers'},
 {year:'Topic',title:'Cognitive therapy',short:'Aaron T. Beck'},
 {year:'Topic',title:'Attachment theory',short:'John Bowlby'},
 {year:'Topic',title:'Logotherapy',short:'Viktor Frankl'},
 {year:'Topic',title:'Positive psychology',short:'Martin Seligman'}];
const MUS_ASK={history:'What would you like mental health care to look like in the future?',
  india:'What would make it easier for young people in India to talk about mental health?',
  science:'What is your favourite psychology topic, and who is your favourite expert?'};
{const _or=openReading;openReading=function(item,sec){
  const k=sec===MUSEUM.history?'history':sec===MUSEUM.india?'india':sec===MUSEUM.science?'science':null;
  if(!k)return _or(item,sec);stampId('museum');
  openBoard({key:'mus-'+k,title:item.title,eyebrow:sec.title,color:sec.color,sub:k==='science'?('Founded by '+item.short):item.year,ask:MUS_ASK[k],intro:k==='science'?'':'Everyone sees history differently. There are no wrong answers.'});};}

/* ---------- one shared sticky-note board panel ---------- */
function openBoard(o){done(o.key.startsWith('mus')?'museum':'policy');
  openPanel({wide:true,title:o.title,eyebrow:o.eyebrow,color:o.color,sub:o.sub||'',build:b=>{
  const shared=!!(typeof DB!=='undefined'&&DB);
  b.innerHTML=`<div class="board-ask" style="--zc:${o.color}"><span>Sticky-note question</span><b>${esc(o.ask)}</b></div>
   ${o.intro?`<p class="lead" style="margin:10px 0 0">${esc(o.intro)}</p>`:''}
   <div class="voice" style="margin-top:12px"><b>Your view matters.</b> Write freely. No names are shown, and please keep it kind.</div>
   <label class="lbl" for="plS">Your sticky note</label><textarea id="plS" rows="3" maxlength="300" placeholder="Write a few words or a few lines…"></textarea><p class="err" id="plE" hidden></p>
   <div class="row" style="margin-top:8px"><button class="btn primary" type="button" id="plGo">Stick it on the board</button></div>
   <h3 class="h3">The board <span class="meta" id="plCount"></span></h3><div class="notes-board" id="plWall"><p class="meta">Loading…</p></div>
   <p class="store-note">${shared?'Notes are saved anonymously in YMH City\'s shared database. Everyone who visits can see this board, and the YMH team can download all responses.':'Your notes are saved on this device only.'}</p>`;
  const cols=['#fff3a8','#ffd6e0','#d4f5e2','#d9e8ff','#ffe2c2','#eadcff'];
  const render=async()=>{const items=(await policyItems()).filter(x=>x.act===o.key);const notes=items.filter(x=>x.kind==='note');const agrees=items.filter(x=>x.kind==='agree');const cnt=id=>agrees.filter(a=>a.ref===id).length;const mine=store.get('polAgree',[]);
    notes.sort((a,c)=>cnt(c.id||c.t)-cnt(a.id||a.t)||c.t-a.t);b.querySelector('#plCount').textContent=notes.length?`· ${notes.length} note${notes.length===1?'':'s'}`:'';
    const wall=b.querySelector('#plWall');wall.innerHTML=notes.length?'':'<p class="meta">No notes yet. Yours could be the first.</p>';
    notes.slice(0,60).forEach((n,i)=>{const id=n.id||n.t;const d=document.createElement('div');d.className='sticky';d.style.background=cols[i%cols.length];d.style.transform=`rotate(${((i*37)%7-3)*0.6}deg)`;
      d.innerHTML=`<p>${esc(n.text)}</p><button type="button" ${mine.includes(String(id))?'disabled':''}>Me too · ${cnt(id)}</button>`;
      d.querySelector('button').addEventListener('click',async e=>{e.target.disabled=true;mine.push(String(id));store.set('polAgree',mine);const it={act:o.key,kind:'agree',ref:id,t:Date.now()};try{await dbAppend('policy',it,80);}catch(err){localAppend('policyLocal',it);}render();});wall.appendChild(d);});};
  render();
  b.querySelector('#plGo').addEventListener('click',async()=>{const ta=b.querySelector('#plS');const v=ta.value.trim();const er=b.querySelector('#plE');if(v.length<3){er.textContent='Write a few words first.';er.hidden=false;return;}er.hidden=true;
    const it={act:o.key,kind:'note',id:uid4(),text:v,t:Date.now()};let ok=true;try{await dbAppend('policy',it,80);}catch(e){ok=false;localAppend('policyLocal',it);}
    ta.value='';award(10,'Added a sticky note','board-'+o.key);earnBadge('voice');track('board_post',{id:o.key});toast(ok?'Stuck on the board. Thank you.':'Saved on this device.');render();});}});}

/* ---------- Policy Circle: titles around, one sticky-note board in the middle ---------- */
const POLICY_ASK='What policies do you think India needs for youth mental health?';
function policyBoard(p){stampId('policy');openBoard({key:'policy-wall',title:p?p.name:'The sticky-note board',eyebrow:p?`Policy Circle · ${p.year}`:'Policy Circle',color:p?p.color:'#6f8fc7',sub:p?'Share your idea at the board':'One question for everyone',ask:POLICY_ASK});}
function stickyBoardMesh(g,y,w,h,title){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const x=c.getContext('2d');
  x.fillStyle='#c9a06a';x.fillRect(0,0,c.width,c.height);for(let i=0;i<1800;i++){x.fillStyle=`rgba(${Math.random()<.5?'90,60,30':'255,240,210'},${Math.random()*0.15})`;x.fillRect(Math.random()*c.width,Math.random()*c.height,3,3);}
  x.fillStyle='#24324a';x.fillRect(0,0,c.width,150);x.fillStyle='#ffffff';x.textAlign='center';x.font=`800 50px ${FD}`;wrapLines(x,title,c.width-80).slice(0,2).forEach((l,k)=>x.fillText(l,c.width/2,62+k*56));
  const cols=['#fff3a8','#ffd6e0','#d4f5e2','#d9e8ff','#ffe2c2','#eadcff'];let k=0;
  for(let r=0;r<3;r++)for(let q=0;q<7;q++){const nx=40+q*138+((r*29+q*17)%20),ny=180+r*((c.height-200)/3)+((q*13)%18);x.save();x.translate(nx+60,ny+55);x.rotate(((r*7+q*5)%9-4)*0.03);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(-56,-48,120,112);x.fillStyle=cols[k++%cols.length];x.fillRect(-60,-55,120,110);
    x.strokeStyle='rgba(40,50,70,.45)';x.lineWidth=4;for(let l=0;l<3;l++){x.beginPath();x.moveTo(-44,-28+l*24);x.lineTo(-44+40+((r+q+l)*23)%50,-28+l*24);x.stroke();}x.fillStyle='#e2504f';x.beginPath();x.arc(0,-46,7,0,TAU);x.fill();x.restore();}
  const t=new THREE.CanvasTexture(c);t.anisotropy=8;const face=new THREE.MeshBasicMaterial({map:t});const side=M('#7a5236');
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.16),[side,side,side,side,face,face]);m.position.y=y;m.castShadow=true;g.add(m);box(w+0.3,0.18,0.3,'#7a5236',0,y+h/2+0.09,0,g);box(w+0.3,0.14,0.3,'#7a5236',0,y-h/2-0.07,0,g);return m;}
function buildPolicyCircle(cx,cz){const g=grp(cx,cz,0);flat(new THREE.CircleGeometry(14,56),'#ddd5c8',0,0.03,0,3,g);flat(new THREE.RingGeometry(5.4,5.8,56),'#c9bfae',0,0.035,0,4,g);
  /* centre: a two-sided sticky-note board on sturdy legs */
  const sb=grp(0,0,Math.PI/2,g);for(const sx of [-2.9,2.9]){cyl(0.12,0.14,4.4,'#5a4632',sx,2.2,0,sb,8);}stickyBoardMesh(sb,2.75,5.6,3.0,POLICY_ASK);gBox(sb,0,0,3.1,0.4);
  for(const s of [-1,1]){const f=L2W(sb,0,s*2.4);SPOTS.push({label:'Add a sticky note',sub:'What policies does India need for youth mental health?',color:'#6f8fc7',tx:f.x,tz:f.z,tr:2.4,run:()=>policyBoard(null)});}
  const PA=[[14,0],[-6,-14],[0,14],[10,-10],[10,10],[-13,-5],[-13,6]].map(q=>Math.atan2(q[1],q[0]));for(let i=0;i<12;i++){const a=i/12*TAU+0.26;if(PA.some(v=>Math.abs(Math.atan2(Math.sin(a-v),Math.cos(a-v)))<0.32))continue;const x=Math.cos(a)*12,z=Math.sin(a)*12;bench(cx+x,cz+z,Math.atan2(-x,-z));}
  /* the policies, by name only */
  POLICIES.forEach((p,i)=>{const a=-Math.PI*0.86+i*(Math.PI*1.72/(POLICIES.length-1));const x=Math.cos(a)*8.6,z=Math.sin(a)*8.6;const bg=grp(cx+x,cz+z,Math.atan2(-x,-z));
    box(0.15,2.4,0.15,'#3f4f6b',-1,1.2,-0.1,bg);box(0.15,2.4,0.15,'#3f4f6b',1,1.2,-0.1,bg);
    const c=document.createElement('canvas');c.width=512;c.height=400;const tx=c.getContext('2d');tx.fillStyle='#fffdf8';tx.fillRect(0,0,512,400);tx.fillStyle=p.color;tx.fillRect(0,0,512,70);tx.fillStyle='#fff';tx.font=`700 34px ${FB}`;tx.fillText(p.year,24,47);
    tx.fillStyle='#1d2b44';tx.font=`800 44px ${FD}`;wrapLines(tx,p.name,460).slice(0,4).forEach((l,k)=>tx.fillText(l,24,150+k*52));tx.font=`500 18px ${FB}`;tx.fillStyle='#8592a6';tx.fillText('Share your idea at the board in the middle',24,378);
    const bd=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.0,0.12),[M('#fff'),M('#fff'),M('#fff'),M('#fff'),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}),M('#e9e4da')]);bd.position.set(0,2.2,0);bd.castShadow=true;bg.add(bd);
    const f=L2W(bg,0,1.6);SPOTS.push({label:p.name,sub:`${p.year} · share your idea`,color:p.color,tx:f.x,tz:f.z,tr:1.6,run:()=>policyBoard(p)});});
  const LINES=["I just stuck my note on the board.","Lots of good ideas up there today.","Writing it down is easier than saying it in class.","I came to read what everyone else thinks."];
  for(let i=0;i<4;i++){const a=i/4*TAU+0.4;const p=staticNPC(cx+Math.cos(a)*4.2,cz+Math.sin(a)*4.2,Math.atan2(-Math.cos(a),-Math.sin(a)),null,(dt,t)=>{idleAnim(p,t);p.userData.arms[1].rotation.x=-0.6+Math.max(0,Math.sin(t*1.3+i*2))*-0.6;},LINES[i]);}
  wheelchairUser([{x:cx+6,z:cz+5},{x:cx+6,z:cz-5}],0.8,"Every idea on that board counts.");}
openPolicy=function(p){policyBoard(p);};

/* ---------- Support Booth: set back and turned partly towards the gate ---------- */

function zoneGroup(z){const ry=Math.atan2(-z.x,-z.z)+(z.id==='help'?0.42:0);const g=grp(z.x,z.z,ry);z.g=g;return g;}

/* ---------- weather: choose it at the start too ---------- */
(function(){const t=document.getElementById('introTime');if(!t)return;const row=document.createElement('div');row.className='optrow';
  row.innerHTML='<div class="lbl">Weather</div><div class="seg" id="introWea">'+WEA_KINDS.map(k=>`<button type="button" data-w="${k.id}" aria-pressed="false">${k.ico} ${k.name}</button>`).join('')+'</div>';
  t.insertAdjacentElement('afterend',row);const cur=(()=>{try{return store.get('weather9','clear');}catch(e){return 'clear';}})();
  const sync=v=>row.querySelectorAll('[data-w]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.w===v)));sync(cur);
  row.querySelectorAll('[data-w]').forEach(b=>b.addEventListener('click',()=>{try{store.set('weather9',b.dataset.w);}catch(e){}sync(b.dataset.w);}));})();

/* museum: timeline and topic panels are sticky-note prompts, not readings */
{const bm=MUSEUM_W.build;MUSEUM_W.build=w=>{bm(w);const secs=[MUSEUM.history,MUSEUM.india,MUSEUM.science].map(s=>s.title);
  w.spots.forEach(s=>{if(typeof s.sub==='string'&&secs.some(t=>s.sub.endsWith(t))&&s.label.startsWith('Read: ')){s.label=s.label.slice(6);s.sub='Add a sticky note';}});};}

/* ---------- the bike stays with you: it comes back after rides, sitting and trips ---------- */
const BIKE_KEEP={on:false,color:null};
{const _d=dismountBike;dismountBike=function(quiet){if(player.bike){BIKE_KEEP.on=!!quiet;}_d(quiet);};}
{const _m=mountBike;mountBike=function(){BIKE_KEEP.on=false;_m();};}
function remountBike(){player.bike=makeBike(pick(['#2f6f73','#c76b80','#3f4f6b','#d2925c']));avatar.add(player.bike);player.pedal=0;const b=$('btnBike');b.hidden=false;b.textContent=COARSE?'Get off bike':'Get off bike (B)';}
TICKS.push(()=>{if(!BIKE_KEEP.on||!started||player.bike||player.action||switching||CINE||W!==MAIN||panelOpen)return;BIKE_KEEP.on=false;remountBike();});

/* ---------- board the plane from right next to it ---------- */
{const _bn=buildNorth;buildNorth=function(){_bn();for(const [x,z] of [[-14,-139.5],[-24,-150],[-4,-150]])SPOTS.push({label:'Board the plane',sub:'Mountains or beaches · free',color:'#2f6f8f',tx:x,tz:z,tr:3.4,run:checkIn});};}

/* ---------- more room behind the Support Booth: hedge moved back, booth set back ---------- */
{const zh=ZONES.find(q=>q.id==='help');if(zh){zh.x=17.5;zh.z=66;}}
buildHedges=function(){const hc='#5a8f5c';
  const seg=(x1,z1,x2,z2)=>{const cx=(x1+x2)/2,cz=(z1+z2)/2,len=Math.hypot(x2-x1,z2-z1),rot=Math.atan2(x2-x1,z2-z1);const m=box(1.4,1.7,len,hc,cx,0.85,cz,null);m.rotation.y=rot;addBox(cx,cz,0.7,len/2,rot);
    const n=Math.floor(len/3.4);for(let i=0;i<n;i++){const t=(i+0.5)/n;sph(0.75,'#649a63',x1+(x2-x1)*t,1.7,z1+(z2-z1)*t,null,7,false).scale.set(1,0.6,1);}};
  seg(-88,72,-9,72);seg(9,72,9,80);seg(9,80,88,80);
  seg(-88,-88,-88,-17);seg(-88,-7,-88,72);seg(88,-88,88,-17);seg(88,-7,88,80);
  seg(-88,-88,19,-88);seg(29,-88,88,-88);
  gateArch(88,-12,Math.PI/2,'Joy Park','wheel · carousel · coaster · swings','#d48aa6');gateArch(-88,-12,Math.PI/2,'Creative Quarter','art · stories · ideas','#9a86c9');gateArch(24,-88,0,'Sky Port','flights · balloon · naps','#5aa6c2');
  for(let i=0;i<30;i++){const a=i/30*TAU+rr(-0.1,0.1),d=rr(300,380);const m=sph(rr(45,80),pick(['#9cc286','#8fb87e','#a5c88f','#94bd85']),Math.cos(a)*d,-6,Math.sin(a)*d,null,12,false);m.scale.y=rr(0.3,0.48);}
  for(let i=0;i<16;i++){const a=i/16*TAU+rr(-0.15,0.15),d=rr(470,540);cone(rr(60,95),rr(80,130),pick(['#a7c0d8','#b0c7dc','#b9cfe2']),Math.cos(a)*d,20,Math.sin(a)*d,null,6,false);}};

/* ---------- trackpad: two-finger swipe looks around, pinch zooms ---------- */
window.addEventListener('wheel',e=>{if(!started||e.target!==canvas)return;
  const trackpad=e.ctrlKey||e.deltaX!==0||(e.deltaMode===0&&Math.abs(e.deltaY)<50&&!Number.isInteger(e.deltaY/40));
  if(e.ctrlKey){e.preventDefault();e.stopImmediatePropagation();cam.distT=clamp(cam.distT+e.deltaY*0.06,5,24);return;}
  if(!trackpad)return;e.preventDefault();e.stopImmediatePropagation();
  if(typeof canView==='function'&&canView()&&VIEW.mode!=='third'){const bal=player.action&&player.action.balloon;VIEW.yaw-=e.deltaX*0.004;if(!bal)VIEW.yaw=clamp(VIEW.yaw,-2.2,2.2);VIEW.pitch=clamp(VIEW.pitch+e.deltaY*0.003,bal?-1.45:-0.9,bal?1.35:0.9);return;}
  cam.yaw-=e.deltaX*0.005;cam.pitch=clamp(cam.pitch-e.deltaY*0.0035,0.06,1.2);},{capture:true,passive:false});
