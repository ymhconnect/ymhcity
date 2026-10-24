'use strict';
/* =========================================================
   START: build order, places, boot
   ========================================================= */
function registerPlaces(){
  ZONES.forEach(z=>addPlace({id:z.id,name:z.name,color:z.color,x:z.x,z:z.z,spot:z.spot,area:'City Centre',sub:z.sub}));
  const P=(id,name,color,x,z,sx,sz,area,sub,st)=>addPlace({id,name,color,x,z,spot:{x:sx,z:sz},area,sub,stamp:st!==false});
  P('monument','The Kite Circle','#d9734e',0,44,0,52,'City Centre','City monument');
  P('icecream','Ice Cream Cart','#e2729a',-18.6,-4.4,-16.9,-4.0,'City Centre','Free ice cream');
  P('train','Mini Train','#2f6f73',24,96,STATIONS[0].plat?STATIONS[0].plat.x:24,STATIONS[0].plat?STATIONS[0].plat.z:96,'City Centre','Loops around the whole city');
  P('museum','Mental Health Museum','#9a86c9',CQ.museum.x,CQ.museum.z,CQ.exit.museum.x,CQ.exit.museum.z,'Creative Quarter','History, people, science, India');
  P('theatre','YMH Theatre','#c76b80',CQ.theatre.x,CQ.theatre.z,CQ.exit.theatre.x,CQ.exit.theatre.z,'Creative Quarter','A short film about small steps');
  P('ymhweek','YMH Week 2027','#d97a68',CQ.hall.x,CQ.hall.z,CQ.exit.hall.x,CQ.exit.hall.z,'Creative Quarter','Coming soon');
  P('policy','Policy Circle','#6f8fc7',CQ.x,CQ.z,CQ.x+15,CQ.z,'Creative Quarter','Laws and plans that protect you');
  P('paint','Art Garden','#d2925c',CQ.paint.x,CQ.paint.z,CQ.paint.x-4,CQ.paint.z-7,'Creative Quarter','Paint under the shade sails');
  P('dance','Dance Floor','#9a86c9',CQ.dance.x,CQ.dance.z,CQ.dance.x+8,CQ.dance.z-4,'Creative Quarter','Move to the beat');
  P('eye','Big Picture Wheel','#5aa6c2',156,-50,156,-44.6,'Joy Park','Giant wheel');
  P('carousel','Pace Yourself','#5fa58f',140,-13,140,-3,'Joy Park','Carousel');
  P('coaster','Ups & Downs','#b25a6e',126,14,126,8.4,'Joy Park','Roller coaster');
  P('swingset','The Swings','#ff8f6b',124,-44,124,-39.6,'Joy Park','Children\'s park swings');
  P('airport','Sky Port','#2f6f8f',-14,-128,-14,-118.5,'Sky Port','Fly to the mountains or the beach');P('balloon','Hot air balloon','#d97a68',42,-126,42,-120.4,'Sky Port','Float above it all');
  P('nap','Nap Garden','#3f4f6b',58,-142,50,-134,'Sky Port','Take a nap');
}
function buildWorld(){
  buildGround();buildPlaza();buildBreath();buildLake();buildCafe();buildPost();buildArcade();buildSound();buildYoga();buildHelp();buildStudy();
  buildPaths();buildGate();buildHedges();buildMonument();
  KEEP.push([-18.6,-4.4,3.2],[11,98,3],[-16,82.5,3.4]);iceCreamCart(-18.6,-4.4,Math.atan2(18.6,4.4));bikeStand(11.5,97,-Math.PI/2);
  buildTrain();buildJoyPark();buildCulture();buildPaint();buildNorth();registerPlaces();buildHut(-32,40);
  buildTrees();buildAvenue();buildFlowers();buildSkyLife();buildExtras();buildLabels();buildWalkers();buildRadio();
  buildAnimals();buildGates();buildAutos();buildFingerposts();buildLawnFun();widenPrompts();ZONES.forEach(z=>{if(['mood','kind','help','study','arcade'].includes(z.id))bladeSign(z);});
  avatar=makePerson(avatarOpts());avatar.position.set(player.x,0,player.z);avatar.rotation.y=player.rot;scene.add(avatar);dressAvatar();
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.55,0.75,32),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.7,depthWrite:false}));ring.rotation.x=-Math.PI/2;scene.add(ring);player.ring=ring;
  applyNameTag();miniStatic=drawMap(300,false);
  try{mergeStatic(STATIC_OBJS);}catch(e){console.warn('merge skipped',e);}
  /* area names float high above each district's plaza */
  [['Joy Park',118,-12,'#d48aa6',13],['Creative Quarter',CQ.x,CQ.z,'#9a86c9',13],['Sky Port',24,-114,'#5aa6c2',12]].forEach(([n,x,z,c,h])=>{const s=pillSprite(n,c,1.9);s.position.set(x,h,z);scene.add(s);});
  [['Big Picture Wheel','#5aa6c2',156,40,-50],['The Swings','#ff8f6b',124,7.5,-44],['Ups & Downs','#b25a6e',140,22,30],['Pace Yourself','#5fa58f',140,11.5,-13],['Mental Health Museum','#9a86c9',CQ.museum.x,14,CQ.museum.z],['YMH Theatre','#c76b80',CQ.theatre.x,14,CQ.theatre.z],['YMH Week 2027','#d97a68',CQ.hall.x,10.5,CQ.hall.z],['Policy Circle','#6f8fc7',CQ.x,7.5,CQ.z],['Hot air balloon','#d97a68',42,17,-126],['Dance Floor','#9a86c9',CQ.dance.x,8,CQ.dance.z],['Art Garden','#d2925c',CQ.paint.x,8.5,CQ.paint.z],['Nap Garden','#3f4f6b',58,6,-142],['Sky Port','#2f6f8f',-14,12,-128],['The Kite Circle','#d9734e',0,17.5,44],['Ice Cream Cart','#e2729a',-18.6,5,-4.4]].forEach(([n,c,x,y,z])=>{const s=pillSprite(n,c,1.7);s.position.set(x,y,z);scene.add(s);});
}
boot();
