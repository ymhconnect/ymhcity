'use strict';
/* =========================================================
   V8 (part B): storybooks that flip, a cosier Study Hall,
   quiet rest spots and a study timer you can take anywhere.
   ========================================================= */

/* ---------- the reads ---------- */
const READS8=[
 {t:'The Case of the Missing Gulab Jamun',g:'Mystery',c:'#c0563f',pages:[
  'Hostel C, 11:42 pm. The last gulab jamun from Meera\'s birthday box was gone. The box was still there. The syrup was still there. Only the jamun had vanished, like a magician\'s rabbit, if the rabbit was soaked in sugar.',
  'Detective Rohan (second year, Mechanical, owns one trench coat for the cold) took the case. Suspect one: Kabir, who said "I don\'t even like sweets" a little too quickly. Suspect two: the warden\'s cat, who was licking her paws in a way that felt personal.',
  'Clue: a trail of syrup drops led from the common room to room 214. Room 214 belonged to… Rohan. "Interesting," said Rohan, very slowly.',
  'In his defence, he had been sleepwalking. In his prosecution, there was syrup on his pillow. Sentence: buy Meera a new box. He bought two. The case was closed, and so, eventually, was the box.'],art:'jamun'},
 {t:'Chotu the Chai Robot',g:'Storybook',c:'#e48a12',pages:[
  'In a small town where it always smelled of rain, there lived a robot named Chotu. Chotu had one job: making chai at the corner stall.',
  'Chotu\'s chai was terrible. Too sweet on Mondays, too salty on Tuesdays, and on Wednesdays, for reasons nobody understood, it tasted of oranges.',
  'So Chotu asked Dadi from the house next door to teach him. She said, "Ginger first. Then the leaves. Then patience. Never skip the patience."',
  'Chotu practised for 41 days. On day 42, the whole street lined up. Chotu still can\'t make orange chai on purpose. Nobody has asked him to.'],art:'chotu',story:true},
 {t:'Exam Hall: A Nature Documentary',g:'Comedy',c:'#3f9f78',pages:[
  'Here, in the great Exam Hall, we observe the student in its natural habitat. It arrives four minutes before the bell, clutching a clear pouch containing seven pens. It will use one.',
  'Watch closely. The student reads question one. A long pause. It looks up at the ceiling fan, as if the answer lives there. Its ancestors did the same.',
  'Nearby, a rare species: the Early Finisher. It stands at the forty-minute mark. The herd panics. The Early Finisher has only gone to sharpen a pencil. The herd recovers.',
  'The bell rings. The students migrate to the canteen, where they gather to compare answers, a ritual that has never once made anyone feel better. Nature is beautiful.'],art:'exam'},
 {t:'The Library Ghost',g:'Spooky (but nice)',c:'#6c5ce7',pages:[
  'Every library has a ghost. Ours is called Mrs. Pillai. She was the librarian for thirty-eight years, and she is not done shushing.',
  'She doesn\'t rattle chains. She rattles book trolleys. At exactly 8:55 pm the lights flicker twice. That\'s her way of saying, "Closing time, beta."',
  'Once a first-year fell asleep on Volume 3 of an encyclopaedia. When he woke up there was a shawl over his shoulders and a bookmark on page 212, exactly where he\'d stopped.',
  'Nobody has ever seen her. But overdue books keep turning up on the returns cart, gently dusted, with a note in perfect handwriting: "Late is fine. Lost is not."'],art:'ghost',story:true},
 {t:'Monsoon Umbrella Diaries',g:'Slice of life',c:'#2f80d1',pages:[
  'Day 1 of the monsoon. My umbrella flipped inside out at the main gate. A stranger laughed. Then her umbrella flipped too. Then we both laughed.',
  'Day 4. Same gate, same wind. We now hold our umbrellas at a professional angle. She\'s in Chemistry. I\'m in History. We agree the wind is in neither syllabus.',
  'Day 9. We share one umbrella to the canteen because hers is "resting". One plate of bhajiyas, two cutting chais. Rain sounds better with company.',
  'Day 30. The monsoon is over. We still meet at the gate. There is no rain. We bring umbrellas anyway. I think it\'s a tradition now.'],art:'rain'},
 {t:'The Moon Who Wanted a Day Off',g:'Storybook',c:'#3f4f6b',pages:[
  'The Moon had worked every single night for a very, very long time. One evening she asked the Sun, "Could you cover for me, just once?"',
  'The Sun tried. It was a disaster. The owls wore sunglasses. The crickets went on strike. Couples on rooftops got sunburnt at midnight.',
  'So the Moon came back. But she made one rule: once a month, she would go completely dark, and nobody was allowed to ask why.',
  'If you look up one night and can\'t find her, don\'t worry. She hasn\'t gone anywhere. She\'s on her day off. Good for her.'],art:'moon',story:true},
 {t:'A Brief History of My Alarm Clock',g:'Comedy',c:'#ff6f61',pages:[
  '6:00 am. Alarm. I am a disciplined person who wakes up early. Snooze.',
  '6:09. Alarm. 6:18. Alarm. I have now had three tiny dreams. In one of them my HOD was a pigeon and he was disappointed in me.',
  '7:02. I set a new alarm called FINAL. 7:11: FINAL 2. 7:20: FINAL FINAL (REAL). 7:21: I open my eyes and it is somehow 7:48.',
  'Fun fact I learned while late: sleep experts say adults need seven or more hours a night. I got five. My brain spent the whole morning opening the fridge to look for my phone.'],art:'alarm',src:'sleep'},
 {t:'Group Project Survival Guide',g:'Humour',c:'#d9a35b',pages:[
  'Every group project has the same five members. The Leader. The Ghost. The One Who Formats. The One Who Says "Sounds good!" to everything. And you.',
  'The Ghost reappears the night before submission with the words "Sorry guys, network issue." He has had a network issue since first year.',
  'Survival tips: make the shared doc on day one. Put a name next to every task. Be the person who sends the "quick check-in?" message. It works more often than you\'d think.',
  'If it all goes wrong anyway, at least you\'ll have a story for the canteen. Some of the best friendships begin with surviving the same group project.'],art:'group'},
 {t:'Comparison Is a Thief',g:'Thoughts',c:'#b28dff',pages:['Everyone posts their results. Nobody posts the night before.','You\'re comparing your inside to everyone else\'s outside. That\'s not a fair match.','Try comparing yourself to you, last month. That\'s the only race that\'s actually yours.'],art:'compare'},
 {t:'Being Kind to Yourself',g:'Thoughts',c:'#e2504f',pages:['Notice how you talk to yourself after a mistake. Would you say that to a friend?','Try answering yourself the way you\'d answer them: "That was hard. You did your best with what you knew."','It might feel strange at first. Most new habits do.'],art:'kind'}];

/* ---------- illustrations, drawn page by page ---------- */
function artCanvas(r,p,W,H){const c=document.createElement('canvas');c.width=W||560;c.height=H||420;const x=c.getContext('2d');drawArt(x,r.art,p,c.width,c.height,r.c);return c;}
function person_(x,X,Y,s,shirt,skin,hair,o){o=o||{};x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle=shirt;x.beginPath();x.moveTo(-22,0);x.quadraticCurveTo(0,-70,22,0);x.closePath();x.fill();x.fillStyle=skin||'#c68a5e';x.beginPath();x.arc(0,-78,18,0,TAU);x.fill();x.fillStyle=hair||'#1b1513';x.beginPath();x.arc(0,-84,18,Math.PI,TAU);x.fill();if(o.bun){x.beginPath();x.arc(0,-104,8,0,TAU);x.fill();}
  x.fillStyle='#1d2b44';x.beginPath();x.arc(-6,-78,2.2,0,TAU);x.arc(6,-78,2.2,0,TAU);x.fill();x.strokeStyle='#1d2b44';x.lineWidth=2;x.beginPath();x.arc(0,-72,6,0.2,Math.PI-0.2,o.sad);x.stroke();if(o.glasses){x.beginPath();x.arc(-6,-78,5,0,TAU);x.arc(6,-78,5,0,TAU);x.stroke();}x.restore();}
function sky_(x,W,H,top,bot){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,W,H);}
function drawArt(x,art,p,W,H,col){x.save();x.lineCap='round';x.lineJoin='round';
  const ground=(c)=>{x.fillStyle=c;x.fillRect(0,H*0.72,W,H*0.28);};
  if(art==='chotu'){sky_(x,W,H,p===3?'#ffd8a8':'#bfe3f2','#f6f1e7');ground('#d9c7a5');
    const cart=()=>{x.fillStyle='#c0563f';x.fillRect(W*0.12,H*0.5,W*0.36,H*0.2);x.fillStyle='#ffd166';x.fillRect(W*0.1,H*0.34,W*0.4,H*0.05);for(let i=0;i<6;i++){x.fillStyle=i%2?'#ffffff':'#e84393';x.fillRect(W*0.1+i*W*0.0667,H*0.3,W*0.0667,H*0.05);}x.fillStyle='#3a3f4a';x.beginPath();x.arc(W*0.18,H*0.72,14,0,TAU);x.arc(W*0.42,H*0.72,14,0,TAU);x.fill();
      x.fillStyle='#c9ced6';x.fillRect(W*0.32,H*0.42,26,30);x.fillStyle='#fff';for(let i=0;i<3;i++){x.globalAlpha=0.6;x.beginPath();x.arc(W*0.345+Math.sin(i)*6,H*0.38-i*14,6+i*2,0,TAU);x.fill();}x.globalAlpha=1;};
    const robot=(X,Y,mood)=>{x.fillStyle='#7aa7ff';x.fillRect(X-26,Y-60,52,50);x.fillStyle='#5b7fc4';x.fillRect(X-20,Y-10,14,24);x.fillRect(X+6,Y-10,14,24);x.fillStyle='#9fd7ff';x.fillRect(X-22,Y-108,44,40);x.fillStyle='#1d2b44';x.beginPath();x.arc(X-9,Y-90,5,0,TAU);x.arc(X+9,Y-90,5,0,TAU);x.fill();x.strokeStyle='#1d2b44';x.lineWidth=3;x.beginPath();x.arc(X,Y-82,7,mood?0.2:Math.PI+0.2,mood?Math.PI-0.2:-0.2,!mood);x.stroke();x.strokeStyle='#5b7fc4';x.beginPath();x.moveTo(X,Y-108);x.lineTo(X,Y-122);x.stroke();x.fillStyle='#ff6f61';x.beginPath();x.arc(X,Y-125,5,0,TAU);x.fill();};
    cart();if(p===0)robot(W*0.66,H*0.7,true);
    if(p===1){robot(W*0.66,H*0.7,false);person_(x,W*0.85,H*0.78,1,'#2fa39a',null,null,{sad:true});x.fillStyle='#1d2b44';x.font=`700 26px ${FD}`;x.fillText('?!',W*0.82,H*0.3);}
    if(p===2){robot(W*0.58,H*0.7,true);person_(x,W*0.8,H*0.78,1.1,'#e84393','#b5774c','#d9d9d9',{bun:true,glasses:true});x.fillStyle='#fff';x.strokeStyle='#1d2b44';x.lineWidth=2;rrect(x,W*0.62,H*0.08,W*0.34,H*0.16,14);x.fill();x.stroke();x.fillStyle='#1d2b44';x.font=`600 18px ${FB}`;x.fillText('Patience, beta.',W*0.65,H*0.18);}
    if(p===3){robot(W*0.62,H*0.7,true);for(let i=0;i<4;i++)person_(x,W*0.74+i*W*0.07,H*0.8,0.8,['#2fa39a','#ffd166','#7aa7ff','#e84393'][i]);x.fillStyle='#ff6f61';x.font=`800 28px ${FD}`;x.fillText('♥',W*0.6,H*0.2);}}
  else if(art==='ghost'){sky_(x,W,H,'#2b2f55','#4b4f7a');x.fillStyle='#6b4a2e';for(let i=0;i<4;i++){x.fillRect(W*0.04+i*W*0.24,H*0.12,W*0.2,H*0.6);for(let j=0;j<5;j++)for(let k=0;k<7;k++){x.fillStyle=pick(['#ff6f61','#ffd166','#4fc3a1','#7aa7ff','#b28dff']);x.fillRect(W*0.05+i*W*0.24+k*W*0.026,H*0.14+j*H*0.11,W*0.022,H*0.09);}x.fillStyle='#6b4a2e';}ground('#3a2f28');
    const ghost=(X,Y,s)=>{x.save();x.globalAlpha=0.9;x.fillStyle='#f6f3ff';x.beginPath();x.arc(X,Y,34*s,Math.PI,TAU);x.lineTo(X+34*s,Y+50*s);for(let i=0;i<4;i++)x.quadraticCurveTo(X+34*s-(i+0.5)*17*s,Y+40*s,X+34*s-(i+1)*17*s,Y+50*s);x.closePath();x.fill();x.fillStyle='#2b2f55';x.beginPath();x.arc(X-11*s,Y-4*s,4*s,0,TAU);x.arc(X+11*s,Y-4*s,4*s,0,TAU);x.fill();x.strokeStyle='#2b2f55';x.lineWidth=2;x.beginPath();x.arc(X-11*s,Y-4*s,8*s,0,TAU);x.arc(X+11*s,Y-4*s,8*s,0,TAU);x.stroke();x.fillStyle='#d9d9d9';x.beginPath();x.arc(X,Y-34*s,10*s,0,TAU);x.fill();x.restore();};
    if(p===0)ghost(W*0.5,H*0.45,1.3);if(p===1){x.fillStyle='rgba(255,240,180,.25)';x.fillRect(0,0,W,H);x.fillStyle='#c9ced6';x.fillRect(W*0.55,H*0.6,W*0.25,H*0.1);ghost(W*0.4,H*0.4,1);}
    if(p===2){x.fillStyle='#e8d9b8';x.fillRect(W*0.25,H*0.62,W*0.5,H*0.06);person_(x,W*0.5,H*0.78,1.1,'#7aa7ff');x.fillStyle='#e84393';x.fillRect(W*0.38,H*0.6,W*0.24,H*0.12);x.fillStyle='rgba(255,255,255,.8)';x.font=`700 26px ${FD}`;x.fillText('z z',W*0.6,H*0.4);ghost(W*0.82,H*0.35,0.7);}
    if(p===3){x.fillStyle='#c9ced6';x.fillRect(W*0.3,H*0.55,W*0.4,H*0.2);for(let i=0;i<5;i++){x.fillStyle=pick(['#ff6f61','#ffd166','#4fc3a1','#7aa7ff']);x.fillRect(W*0.33+i*W*0.07,H*0.45,W*0.05,H*0.1);}x.fillStyle='#fff';x.fillRect(W*0.55,H*0.38,W*0.16,H*0.1);x.fillStyle='#2b2f55';x.font=`italic 14px ${FB}`;x.fillText('Late is fine.',W*0.56,H*0.42);x.fillText('Lost is not.',W*0.56,H*0.46);}}
  else if(art==='moon'){const night=p!==1;sky_(x,W,H,night?'#14183a':'#7cc4f2',night?'#3a3f7a':'#ffe8b0');if(night){x.fillStyle='#fff';for(let i=0;i<40;i++){x.globalAlpha=Math.random();x.fillRect(Math.random()*W,Math.random()*H*0.7,2,2);}x.globalAlpha=1;}
    ground(night?'#1f2a4a':'#8fd16f');
    const face=(X,Y,r,c,sleep)=>{x.fillStyle=c;x.beginPath();x.arc(X,Y,r,0,TAU);x.fill();x.strokeStyle='#3a3f4a';x.lineWidth=3;if(sleep){x.beginPath();x.arc(X-r*0.3,Y-r*0.1,r*0.12,0,Math.PI);x.arc(X+r*0.3,Y-r*0.1,r*0.12,0,Math.PI);x.stroke();}else{x.fillStyle='#3a3f4a';x.beginPath();x.arc(X-r*0.3,Y-r*0.1,r*0.07,0,TAU);x.arc(X+r*0.3,Y-r*0.1,r*0.07,0,TAU);x.fill();}x.beginPath();x.arc(X,Y+r*0.15,r*0.25,0.2,Math.PI-0.2);x.stroke();};
    if(p===0){face(W*0.3,H*0.3,60,'#f6f0d8');face(W*0.75,H*0.35,52,'#ffd166');}
    if(p===1){face(W*0.5,H*0.25,70,'#ffd166');const owl=(X,Y)=>{x.fillStyle='#8a6a4e';x.beginPath();x.ellipse(X,Y,22,30,0,0,TAU);x.fill();x.fillStyle='#1d2b44';x.fillRect(X-18,Y-14,36,10);};owl(W*0.25,H*0.65);owl(W*0.75,H*0.66);}
    if(p===2){x.fillStyle='#f6f0d8';x.beginPath();x.arc(W*0.5,H*0.32,60,0,TAU);x.fill();x.fillStyle='#14183a';x.beginPath();x.arc(W*0.5+30,H*0.32,58,0,TAU);x.fill();}
    if(p===3){x.strokeStyle='rgba(255,255,255,.35)';x.setLineDash([6,8]);x.lineWidth=3;x.beginPath();x.arc(W*0.5,H*0.32,60,0,TAU);x.stroke();x.setLineDash([]);x.fillStyle='#fff';x.font=`700 22px ${FD}`;x.fillText('OUT OF OFFICE',W*0.33,H*0.34);person_(x,W*0.5,H*0.86,0.9,'#7aa7ff');}}
  else if(art==='jamun'){sky_(x,W,H,'#f6e7c9','#f1d7b5');x.fillStyle='#8a5a3b';x.fillRect(0,H*0.68,W,H*0.32);x.fillStyle='#fff';x.fillRect(W*0.3,H*0.45,W*0.4,H*0.22);x.fillStyle='#e84393';x.fillRect(W*0.3,H*0.45,W*0.4,H*0.05);
    for(let i=0;i<(p===0?0:0);i++);for(let i=0;i<5;i++){if(p>=0&&i===4)continue;x.fillStyle='#7a3b1f';x.beginPath();x.arc(W*0.36+i*W*0.07,H*0.58,13,0,TAU);x.fill();}
    if(p===0){x.fillStyle='#1d2b44';x.font=`800 40px ${FD}`;x.fillText('?',W*0.64,H*0.4);}
    if(p===1){person_(x,W*0.18,H*0.95,1.1,'#7c6a58');person_(x,W*0.82,H*0.95,1,'#2fa39a');x.fillStyle='#e39550';x.beginPath();x.ellipse(W*0.5,H*0.86,28,16,0,0,TAU);x.fill();}
    if(p===2){x.fillStyle='rgba(180,90,40,.7)';for(let i=0;i<8;i++){x.beginPath();x.arc(W*0.15+i*W*0.1,H*0.85+Math.sin(i)*6,5,0,TAU);x.fill();}x.fillStyle='#fff';x.font=`800 22px ${FD}`;x.fillText('ROOM 214',W*0.72,H*0.3);}
    if(p===3){person_(x,W*0.5,H*0.92,1.2,'#7c6a58',null,null,{sad:false});x.fillStyle='#fff';x.fillRect(W*0.62,H*0.62,W*0.16,H*0.12);x.fillRect(W*0.2,H*0.62,W*0.16,H*0.12);}}
  else if(art==='rain'){sky_(x,W,H,p===3?'#bfe3f2':'#8a9bb0','#d8dde4');ground('#9aa1a8');if(p<3){x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2;for(let i=0;i<60;i++){const rx=Math.random()*W,ry=Math.random()*H*0.7;x.beginPath();x.moveTo(rx,ry);x.lineTo(rx-4,ry+14);x.stroke();}}
    const umb=(X,Y,c,flip)=>{x.fillStyle=c;x.beginPath();if(flip){x.moveTo(X-40,Y-50);x.quadraticCurveTo(X,Y+5,X+40,Y-50);x.lineTo(X,Y-20);}else{x.arc(X,Y-40,40,Math.PI,TAU);}x.closePath();x.fill();x.strokeStyle='#3a3f4a';x.lineWidth=3;x.beginPath();x.moveTo(X,Y-40);x.lineTo(X,Y+10);x.stroke();};
    if(p===0){person_(x,W*0.35,H*0.9,1,'#7aa7ff');umb(W*0.35,H*0.52,'#e84393',true);person_(x,W*0.65,H*0.9,1,'#ffd166',null,null,{bun:true});umb(W*0.65,H*0.52,'#2fa39a',true);}
    if(p===1){person_(x,W*0.4,H*0.9,1,'#7aa7ff');umb(W*0.4,H*0.52,'#e84393');person_(x,W*0.6,H*0.9,1,'#ffd166',null,null,{bun:true});umb(W*0.6,H*0.52,'#2fa39a');}
    if(p===2){person_(x,W*0.44,H*0.9,1,'#7aa7ff');person_(x,W*0.56,H*0.9,1,'#ffd166',null,null,{bun:true});umb(W*0.5,H*0.48,'#e84393');}
    if(p===3){x.fillStyle='#ffd166';x.beginPath();x.arc(W*0.8,H*0.2,36,0,TAU);x.fill();person_(x,W*0.42,H*0.9,1,'#7aa7ff');person_(x,W*0.58,H*0.9,1,'#ffd166',null,null,{bun:true});x.strokeStyle='#e84393';x.lineWidth=4;x.beginPath();x.moveTo(W*0.3,H*0.85);x.lineTo(W*0.3,H*0.55);x.stroke();}}
  else if(art==='exam'){sky_(x,W,H,'#f4efe6','#e9e1d2');ground('#c9b79c');for(let r=0;r<2;r++)for(let i=0;i<4;i++){const X=W*0.15+i*W*0.23,Y=H*(0.62+r*0.22);x.fillStyle='#a8744a';x.fillRect(X-30,Y-10,60,8);person_(x,X,Y+2,0.65,pick(['#7aa7ff','#ffd166','#4fc3a1','#ff9fc6']));}
    x.strokeStyle='#5b6676';x.lineWidth=3;x.beginPath();x.moveTo(W*0.5,0);x.lineTo(W*0.5,H*0.1);x.stroke();x.save();x.translate(W*0.5,H*0.12);x.rotate(p*0.5);x.fillStyle='#5b6676';for(let i=0;i<3;i++){x.rotate(TAU/3);x.fillRect(0,-5,60,10);}x.restore();
    if(p===2){person_(x,W*0.85,H*0.45,0.8,'#e84393');x.fillStyle='#1d2b44';x.font=`800 22px ${FD}`;x.fillText('!!!',W*0.1,H*0.3);}if(p===3){x.fillStyle='#ffd166';x.font=`800 30px ${FD}`;x.fillText('CANTEEN →',W*0.6,H*0.3);}}
  else if(art==='alarm'){sky_(x,W,H,p<2?'#2b2f55':'#ffd8a8','#f6f1e7');x.fillStyle='#e9d7b8';x.fillRect(W*0.1,H*0.55,W*0.8,H*0.25);x.fillStyle='#fff';x.fillRect(W*0.15,H*0.48,W*0.25,H*0.1);x.fillStyle='#7aa7ff';x.fillRect(W*0.35,H*0.52,W*0.5,H*0.12);
    const clock=(X,Y)=>{x.fillStyle='#ff6f61';x.beginPath();x.arc(X,Y,34,0,TAU);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(X,Y,26,0,TAU);x.fill();x.strokeStyle='#1d2b44';x.lineWidth=3;x.beginPath();x.moveTo(X,Y);x.lineTo(X,Y-18);x.moveTo(X,Y);x.lineTo(X+12,Y+4);x.stroke();x.fillStyle='#ff6f61';x.beginPath();x.arc(X-24,Y-28,9,0,TAU);x.arc(X+24,Y-28,9,0,TAU);x.fill();};
    clock(W*0.8,H*0.3);x.fillStyle='#1d2b44';x.font=`800 28px ${FD}`;x.fillText(['6:00','6:18','7:21','7:48'][p],W*0.7,H*0.18);if(p===1){x.fillStyle='#9aa1a8';x.beginPath();x.ellipse(W*0.3,H*0.25,26,18,0,0,TAU);x.fill();x.fillStyle='#fff';x.font=`600 16px ${FB}`;x.fillText('coo?',W*0.25,H*0.15);}}
  else if(art==='group'){sky_(x,W,H,'#eaf3ff','#f6f1e7');x.fillStyle='#a8744a';x.fillRect(W*0.1,H*0.6,W*0.8,H*0.08);const cols=['#ff6f61','#ffd166','#4fc3a1','#7aa7ff','#b28dff'];for(let i=0;i<5;i++){if(p===1&&i===1){x.globalAlpha=0.25;}person_(x,W*0.18+i*W*0.16,H*0.62,0.9,cols[i]);x.globalAlpha=1;}
    if(p===1){x.fillStyle='#1d2b44';x.font=`600 16px ${FB}`;x.fillText('network issue',W*0.25,H*0.2);}if(p===2){x.fillStyle='#fff';x.fillRect(W*0.3,H*0.68,W*0.4,H*0.25);x.fillStyle='#1d2b44';for(let i=0;i<4;i++)x.fillRect(W*0.33,H*0.72+i*12,W*0.3,4);}if(p===3){x.fillStyle='#ffd166';x.font=`800 30px ${FD}`;x.fillText('★',W*0.48,H*0.25);}}
  else{sky_(x,W,H,'#fff6ea','#f6e6d6');x.fillStyle=col;x.globalAlpha=0.25;for(let i=0;i<5;i++){x.beginPath();x.arc(W*(0.2+i*0.15),H*(0.4+Math.sin(i+p)*0.15),40+i*8,0,TAU);x.fill();}x.globalAlpha=1;
    if(art==='kind'){x.fillStyle=col;x.save();x.translate(W/2,H/2);x.scale(3,3);x.beginPath();x.moveTo(0,12);x.bezierCurveTo(-22,0,-14,-18,0,-8);x.bezierCurveTo(14,-18,22,0,0,12);x.fill();x.restore();}
    if(art==='compare'){person_(x,W*0.3,H*0.85,1.2,'#7aa7ff');person_(x,W*0.7,H*0.85,1.2,'#7aa7ff');x.fillStyle='#ffd166';x.font=`800 26px ${FD}`;x.fillText('me',W*0.27,H*0.4);x.fillText('me, last month',W*0.55,H*0.4);}}
  x.restore();}

/* ---------- the book that opens in the middle of the screen ---------- */
const BOOK={r:null,p:0,el:null,busy:false};
function ensureBook(){if(BOOK.el)return;const el=document.createElement('div');el.id='book';el.hidden=true;el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
  el.innerHTML=`<div class="bk"><button class="bk-x" type="button" aria-label="Close the book">×</button><div class="bk-spread"><div class="bk-page bk-left"><div class="bk-art"></div></div><div class="bk-page bk-right"><div class="bk-text"></div><div class="bk-foot"></div></div><div class="bk-flip"><div class="bk-flip-front"></div><div class="bk-flip-back"></div></div></div><div class="bk-nav"><button class="btn" type="button" id="bkPrev">← Back</button><span id="bkNum"></span><button class="btn primary" type="button" id="bkNext">Next page →</button></div></div>`;
  document.body.appendChild(el);BOOK.el=el;el.querySelector('.bk-x').addEventListener('click',closeBook);el.addEventListener('pointerdown',e=>{if(e.target===el)closeBook();});
  el.querySelector('#bkNext').addEventListener('click',()=>turnPage(1));el.querySelector('#bkPrev').addEventListener('click',()=>turnPage(-1));
  window.addEventListener('keydown',e=>{if(el.hidden)return;if(e.key==='ArrowRight'){e.preventDefault();turnPage(1);}else if(e.key==='ArrowLeft'){e.preventDefault();turnPage(-1);}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeBook();}},true);}
function pageHTML(r,p){const last=p===r.pages.length-1;return `<div class="bk-genre" style="color:${r.c}">${esc(r.g)}</div>${p===0?`<h2 class="bk-title">${esc(r.t)}</h2>`:''}<p>${esc(r.pages[p])}</p>${last?'<p class="bk-end">The end</p>':''}`;}
function fillPage(){const r=BOOK.r,p=BOOK.p,el=BOOK.el;const art=el.querySelector('.bk-art');art.innerHTML='';art.appendChild(artCanvas(r,p));el.querySelector('.bk-text').innerHTML=pageHTML(r,p);el.querySelector('.bk-foot').textContent=`${p+1}`;
  el.querySelector('#bkNum').textContent=`Page ${p+1} of ${r.pages.length}`;el.querySelector('#bkPrev').disabled=p===0;const nx=el.querySelector('#bkNext');nx.textContent=p===r.pages.length-1?'Close the book':'Next page →';
  if(p===r.pages.length-1){const a=store.get('reads8',[]);if(!a.includes(r.t)){a.push(r.t);store.set('reads8',a);award(10,'Finished a story');if(a.length>=3&&typeof earnBadge==='function')earnBadge('bookworm');}done('study');track('activity',{id:'read-'+r.t.slice(0,24)});}}
function turnPage(dir){if(!BOOK.r)return;clearTimeout(BOOK.t1);clearTimeout(BOOK.t2);const r=BOOK.r;const np=BOOK.p+dir;if(np>=r.pages.length){closeBook();return;}if(np<0)return;
  const el=BOOK.el;const fl=el.querySelector('.bk-flip');BOOK.busy=true;if(SFX&&SFX.ready)burst(2600,'bandpass',0.25,0.05,0.6);
  fl.querySelector('.bk-flip-front').innerHTML=dir>0?el.querySelector('.bk-right').innerHTML:'';fl.querySelector('.bk-flip-back').innerHTML='';
  fl.className='bk-flip';void fl.offsetWidth;fl.className='bk-flip '+(dir>0?'go-next':'go-prev');BOOK.p=np;BOOK.t1=setTimeout(fillPage,280);BOOK.t2=setTimeout(()=>{fl.className='bk-flip';},620);}
function openBook(i){ensureBook();BOOK.r=READS8[i];BOOK.p=0;clearTimeout(BOOK.t1);fillPage();BOOK.el.hidden=false;BOOK.el.classList.remove('open');void BOOK.el.offsetWidth;BOOK.el.classList.add('open');setTimeout(()=>BOOK.el.querySelector('#bkNext').focus(),60);speak(`${BOOK.r.t}. ${BOOK.r.pages[0]}`);}
function closeBook(){if(!BOOK.el)return;BOOK.el.hidden=true;BOOK.r=null;if(player.action&&player.action.reading)endAction();canvas.focus({preventScroll:true});}
bookChooser=function(sit){openPanel({title:'Pick something to read',eyebrow:'Library',color:'#e2504f',sub:'Mysteries, storybooks, comedies. Each one takes about two minutes.',build:b=>{
  const readN=store.get('reads8',[]);b.innerHTML=`<div class="books">${READS8.map((r,i)=>`<button type="button" class="book" data-i="${i}" style="--bc:${r.c}"><small>${esc(r.g)}</small><b>${esc(r.t)}</b><span>${r.pages.length} pages${readN.includes(r.t)?' · read ✓':''}</span></button>`).join('')}</div>`;
  b.querySelectorAll('.book').forEach(x=>x.addEventListener('click',()=>{const i=+x.dataset.i;closePanel();readBook(i);}));}});};
readBook=function(i){if(W===STUDY_W)sitAt(6.6,5.6,Math.PI*0.85,-0.2,{x:6.9,z:3.9},{reading:true,pose:t=>{const u=avatar.userData;resetPose(avatar);u.legs.forEach(l=>l.rotation.x=-Math.PI/2);u.arms.forEach(a=>a.rotation.x=-1.1);u.head.rotation.x=0.35;},camOff:0.7,dist:4.6,pitch:0.32});openBook(i);};

/* ---------- a study timer you can take anywhere ---------- */
const POMO={on:false,mode:'focus',left:25*60,F:25,B:5,iv:null,rounds:0};
function ensurePomo(){if($('pomo'))return;const el=document.createElement('div');el.id='pomo';el.hidden=true;
  el.innerHTML=`<div class="pm-top"><b id="pmMode">Focus</b><button type="button" class="pm-x" aria-label="Close the study timer">×</button></div><div class="pm-time" id="pmTime">25:00</div><div class="pm-bar"><i id="pmBar"></i></div><div class="pm-row"><button type="button" id="pmGo" class="btn primary">Start</button><button type="button" id="pmReset" class="btn">Reset</button></div><div class="pm-row pm-presets"><button type="button" data-f="25" data-b="5" aria-pressed="true">25 / 5</button><button type="button" data-f="50" data-b="10" aria-pressed="false">50 / 10</button><button type="button" data-f="15" data-b="3" aria-pressed="false">15 / 3</button></div><p class="pm-note" id="pmNote">Focus timer. It keeps going wherever you walk.</p>`;
  document.body.appendChild(el);el.querySelector('.pm-x').addEventListener('click',()=>{pomoStop();el.hidden=true;});
  el.querySelector('#pmGo').addEventListener('click',()=>{POMO.iv?pomoPause():pomoStart();});el.querySelector('#pmReset').addEventListener('click',()=>{pomoPause();POMO.mode='focus';POMO.left=POMO.F*60;pomoDraw();});
  el.querySelectorAll('[data-f]').forEach(x=>x.addEventListener('click',()=>{POMO.F=+x.dataset.f;POMO.B=+x.dataset.b;pomoPause();POMO.mode='focus';POMO.left=POMO.F*60;el.querySelectorAll('[data-f]').forEach(y=>y.setAttribute('aria-pressed',String(y===x)));pomoDraw();}));}
function pomoDraw(){const el=$('pomo');if(!el)return;const s=POMO.left;$('pmTime').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;$('pmMode').textContent=POMO.mode==='focus'?'Focus':'Break';el.classList.toggle('brk',POMO.mode!=='focus');
  const tot=(POMO.mode==='focus'?POMO.F:POMO.B)*60;$('pmBar').style.width=((tot-s)/tot*100)+'%';$('pmGo').textContent=POMO.iv?'Pause':'Start';}
function pomoStart(){if(POMO.iv)return;POMO.iv=setInterval(()=>{POMO.left--;if(POMO.left<=0){if(POMO.mode==='focus'){POMO.rounds++;award(20,'Study session done');track('pomodoro',{id:W.id||'main'});POMO.mode='break';POMO.left=POMO.B*60;$('pmNote').textContent='Break time. Stretch, sip some water, look at something far away.';}else{POMO.mode='focus';POMO.left=POMO.F*60;$('pmNote').textContent='Back to it whenever you\'re ready.';pomoPause();}
    if(AUD.ctx){chime();setTimeout(chime,350);}toast(POMO.mode==='break'?'Focus session done. Take a break.':'Break over.',3000);}pomoDraw();},1000);pomoDraw();}
function pomoPause(){clearInterval(POMO.iv);POMO.iv=null;pomoDraw();}
function pomoStop(){pomoPause();}
function openPomo(where){ensurePomo();const el=$('pomo');el.hidden=false;$('pmNote').textContent=where?`Studying ${where}. The timer keeps going wherever you walk.`:'Focus timer. It keeps going wherever you walk.';pomoDraw();track('pomodoro_open',{id:W.id||'main'});}

/* ---------- quiet rest spots: no prompts, just sit ---------- */
function restCard(b,o){o=o||{};let sec=0;b.innerHTML=`<p class="rest-line">${esc(o.line||'Stay as long as you like.')}</p><div class="row"><button class="btn" type="button" id="rsT">Study here with a timer</button><button class="btn primary" type="button" id="rsUp">Get up</button></div><p class="meta" id="rsS" style="margin-top:8px"></p>`;
  b.querySelector('#rsT').addEventListener('click',()=>openPomo(o.where||'here'));b.querySelector('#rsUp').addEventListener('click',closePanel);
  const iv=setInterval(()=>{sec++;if(sec===60)award(5,'Sat for a minute');},1000);return ()=>clearInterval(iv);}
sitCard=b=>restCard(b,{where:'on a bench'});
sitBench=function(g){const lx=g.userData.seat||0;const w=L2W(g,lx,0.08);openPanel({dock:true,title:'A bench',eyebrow:'Rest',color:'#2fb08c',sub:'Nobody needs anything from you here.',build:b=>restCard(b,{where:'on a bench'})});startAction({x:w.x,z:w.z,rot:g.rotation.y,y:-0.18,exit:L2W(g,lx,1.5),pose:POSE.sit,camOff:0.75,dist:7});track('rest',{id:'bench'});};

/* ---------- a cosier study hall ---------- */
const STUDY_MODE={dark:store.get('studyDark',false)};
function nightWinTex(){return cardTex(256,256,(x,Wd,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e1438');g.addColorStop(0.62,'#27306a');g.addColorStop(0.63,'#1f3a2a');g.addColorStop(1,'#16291e');x.fillStyle=g;x.fillRect(0,0,Wd,H);x.fillStyle='#fff';for(let i=0;i<30;i++)x.fillRect(Math.random()*Wd,Math.random()*H*0.6,2,2);x.fillStyle='#fff6d8';x.beginPath();x.arc(190,50,18,0,TAU);x.fill();});}
{const sb=STUDY_W.build;STUDY_W.build=w=>{sb(w);const g=scene.children.find(c=>c.type==='Group');
  /* warm wood ceiling beams and wall sconces */
  for(let i=-2;i<=2;i++)box(28,0.32,0.4,'#a8744a',0,6.95,i*4,g,false);
  const glows=[];const sconce=(x,z,ry)=>{const s=grp(x,z,ry,g);s.position.y=3.4;box(0.3,0.5,0.12,'#c9a24a',0,0,0.06,s,false);const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,0.4,12,1,true),new THREE.MeshStandardMaterial({color:'#fff3d6',emissive:'#ffcf8a',emissiveIntensity:0.6,side:THREE.DoubleSide}));sh.position.set(0,0.25,0.3);s.add(sh);glows.push(sh.material);const pl=new THREE.PointLight('#ffd6a0',0.3,9,2);pl.position.set(0,0.2,0.6);s.add(pl);glows.push(pl);};
  for(const z of [-6.5,6.5])sconce(-13.8,z,Math.PI/2);for(const z of [-1,6.5])sconce(13.8,z,-Math.PI/2);for(const x of [-9,9])sconce(x,-9.8,0);
  /* rugs, plants, a cosy beanbag corner on the study side */
  rug(g,-7.7,-1.2,10,10,'#f3ead8','#3d6fd6','#ffb347');
  for(const [x,z] of [[-12.8,-3],[-12.8,0.5]]){const b=sph(0.8,pick(['#ff8f6b','#2fa39a','#ffd166']),x,0.45,z,g,12);b.scale.set(1.1,0.55,1.1);}
  plant(g,-1.8,8.4,1.2,'#3d6fd6');plant(g,1.8,8.4,1.2,'#3d6fd6');plant(g,-13,-1.4,0.9);
  /* curtains on the big windows */
  for(const [x,z,ry] of [[-13.75,-5,Math.PI/2],[-13.75,2.5,Math.PI/2],[-6,-9.75,0],[6,-9.75,0]]){const c=grp(x,z,ry,g);c.position.y=3.4;for(const sx of [-1,1])box(0.7,3.9,0.1,'#e9784b',sx*2.1,0,0.35,c,false);box(5,0.14,0.14,'#a8744a',0,2.05,0.35,c,false);}
  /* a board that suggests other places to study */
  const bt=boardTex((x,Wd,H)=>{x.fillStyle='#2f4a3f';x.fillRect(0,0,Wd,H);x.strokeStyle='#e9d7b8';x.lineWidth=12;x.strokeRect(14,14,Wd-28,H-28);x.fillStyle='#fff6e6';x.font=`800 58px ${FD}`;x.fillText('Fancy a change of scenery?',56,104);
    x.font=`500 34px ${FB}`;x.fillStyle='#d9e8df';['Every bench in the city','The campfire in the mountains','The lounger on the beach','By the lake, with the ducks','The Kite Circle steps'].forEach((t,i)=>{x.fillStyle='#ffd166';x.fillText('•',64,190+i*80);x.fillStyle='#fff6e6';x.fillText(t,100,190+i*80);});
    x.fillStyle='#9fd7c2';x.font=`500 28px ${FB}`;x.fillText('Each one has a study timer. Sit down and press "Study here".',56,H-48);},1024,640);
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.75),new THREE.MeshBasicMaterial({map:bt}));bd.position.set(-7.6,3.2,-9.8);g.add(bd);box(4.6,2.95,0.1,'#7a5236',-7.6,3.2,-9.86,g,false);
  /* light switch for dark mode */
  const sw=grp(-1.6,9.7,Math.PI,g);sw.position.y=1.4;box(0.35,0.55,0.08,'#ffffff',0,0,0,sw,false);box(0.1,0.2,0.1,'#3a3f4a',0,0,0.05,sw,false);
  const NWT=nightWinTex();const winMats=[];g.traverse(m=>{if(m.isMesh&&m.material&&m.material.map===VIEW_TEX)winMats.push(m.material);});
  const lights=[];scene.traverse(o=>{if(o.isHemisphereLight||o.isDirectionalLight||o.isAmbientLight)lights.push({o,base:o.intensity});});
  w.applyDark=()=>{const d=STUDY_MODE.dark;lights.forEach(l=>l.o.intensity=l.base*(d?0.32:1));winMats.forEach(m=>{m.map=d?NWT:VIEW_TEX;m.needsUpdate=true;});glows.forEach(x=>{if(x.isLight)x.intensity=d?0.9:0.3;else x.emissiveIntensity=d?1.1:0.5;});scene.background=new THREE.Color(d?'#11131f':'#f6efe4');};
  w.applyDark();
  SPOTS.push({label:STUDY_MODE.dark?'Turn the big lights back on':'Dim the lights (cosy mode)',sub:'Lamps only, night outside',color:'#3d6fd6',tx:-1.6,tz:8.6,tr:1.6,run:function(){STUDY_MODE.dark=!STUDY_MODE.dark;store.set('studyDark',STUDY_MODE.dark);w.applyDark();this.label=STUDY_MODE.dark?'Turn the big lights back on':'Dim the lights (cosy mode)';nearZone=null;toast(STUDY_MODE.dark?'Cosy mode on.':'Lights back on.',1600);}});};}
/* typing and pencil sounds, only inside the study hall */
const STUDY_SND={next:0,burst:0};
TICKS.push((dt,t)=>{if(W!==STUDY_W||!SFX.ready||!AUD.ctx||AUD.ctx.state!=='running'||!anyOn())return;
  if(t>STUDY_SND.next){if(STUDY_SND.burst<=0){STUDY_SND.burst=Math.floor(rr(4,14));STUDY_SND.kind=rnd()<0.7?'key':'pen';STUDY_SND.next=t+rr(0.6,2.4);return;}
    STUDY_SND.burst--;if(STUDY_SND.kind==='key'){burst(rr(2600,4200),'bandpass',0.03,rr(0.025,0.05),3);STUDY_SND.next=t+rr(0.07,0.2);}else{burst(rr(5000,7000),'bandpass',rr(0.12,0.3),0.02,2);STUDY_SND.next=t+rr(0.15,0.4);}}});
{const sf=studyFocus;studyFocus=function(b){const cl=sf(b);const p=document.createElement('p');p.className='meta';p.style.marginTop='10px';p.innerHTML='Want a change of scenery? Every bench, the campfire, the lake and the beach lounger have a study timer too.';b.appendChild(p);return cl;};}
