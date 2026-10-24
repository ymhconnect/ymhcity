/* v8e: camera never hides inside trees or walls; nearby floating labels step aside */
function camHit(x,z){for(const c of colliders){if(c.t===0){const r=c.r+0.45;const dx=x-c.x,dz=z-c.z;if(dx*dx+dz*dz<r*r)return true;}else{const dx=x-c.x,dz=z-c.z;const lx=dx*c.c-dz*c.s,lz=dx*c.s+dz*c.c;if(Math.abs(lx)<c.hw+0.3&&Math.abs(lz)<c.hd+0.3)return true;}}return false;}
let CAMPULL=1;
{const _uc=updateCamera;updateCamera=function(dt,t){_uc(dt,t);hideNearLabels();
  if(CINE||!started||player.action||!W.main||(typeof VIEW!=='undefined'&&VIEW.mode==='first'&&typeof canView==='function'&&canView()))return;
  const p=camera.position,tx=cam.tx,ty=cam.ty,tz=cam.tz;let f=1;
  if(!camHit(tx,tz)){for(let i=1;i<=8;i++){const s=i/8;const y=ty+(p.y-ty)*s;if(y>4.2)break;if(camHit(tx+(p.x-tx)*s,tz+(p.z-tz)*s)){f=Math.max(0.22,s-0.14);break;}}}
  CAMPULL+=(f-CAMPULL)*(f<CAMPULL?0.5:1-Math.exp(-dt*3));
  if(CAMPULL<0.995){p.set(tx+(p.x-tx)*CAMPULL,Math.max(0.8,ty+(p.y-ty)*CAMPULL),tz+(p.z-tz)*CAMPULL);camera.lookAt(tx,ty,tz);}};}
let LBLW=null,LBLS=[],lblT=0;
function hideNearLabels(){lblT-=1;if(LBLW!==W||lblT<0){if(LBLW!==W){LBLS=[];W.scene.traverse(o=>{if(o.isSprite&&o.renderOrder===5&&o.scale.y>1.2)LBLS.push(o);});LBLW=W;}lblT=10;
  const p=camera.position;const ball=typeof BAL!=='undefined'&&BAL&&BAL.riding;for(const s of LBLS){if(ball){s.visible=false;continue;}if(s.userData.hideRide)continue;const w=s.getWorldPosition(_lblV);const d=w.distanceTo(p);s.visible=d>9&&!(typeof BAL!=="undefined"&&BAL&&BAL.riding&&BAL._lbl&&BAL._lbl.includes(s));}}}
const _lblV=new THREE.Vector3();
/* clear sightline in front of the mountain telescope (trees only) */
{const bm=MOUNTAIN_W.build;MOUNTAIN_W.build=w=>{bm(w);const vx=3.2,vz=-59.6;
  w.scene.children.slice().forEach(c=>{if(c.type!=='Group'||c.position.y!==0||c.children.length>6||c.userData.legs||c.userData.find)return;const dx=c.position.x-vx,dz=vz-c.position.z;const d=Math.hypot(dx,dz);if(dz<1||d>220)return;if(Math.abs(Math.atan2(dx,dz))<0.95+2.5/Math.max(d,3))w.scene.remove(c);});};}
