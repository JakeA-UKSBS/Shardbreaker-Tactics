/* Hit popups and the on-map attack animations (no side-on battle scene in Tactics) */
/* ================= FX ================= */
function pop(u,txt,cls){const p=document.createElement('div'),b=uBox(u);p.className='pop '+cls;p.textContent=txt;p.style.left=b.l+b.w/2-24+'px';p.style.top=b.t+'px';boardEl.appendChild(p);setTimeout(()=>p.remove(),950)}
/* the run's seed, shown as a button that copies it (seedTag) */
const seedTag=s=>`<button type="button" class="seed" data-seed="${s}" title="Copy the seed">Seed ${s}</button>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-seed]');if(!b)return;e.stopPropagation();e.preventDefault();
  const s=b.dataset.seed,done=()=>{sfx('tick');b.textContent='Copied';setTimeout(()=>{b.textContent='Seed '+s},1200)};
  /* the clipboard API needs https or localhost; opened from a file, fall back to a hidden text box */
  const old=()=>{const t=document.createElement('textarea');t.value=s;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove();done()};
  if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(s).then(done,old);else old()},true);
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;vp.appendChild(d);setTimeout(()=>d.remove(),1900)}
/* a notification card in the corner of the board: stays a few seconds, stacks if several arrive at once */
function notify(title,sub,img,ms=4000){let box=vp.querySelector('.notes');if(!box){box=document.createElement('div');box.className='notes';vp.appendChild(box)}
  const d=document.createElement('div');d.className='note';d.innerHTML=`${img?`<img src="${img}" alt="">`:''}<div><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div>`;d.style.setProperty('--t',ms+'ms');box.appendChild(d);setTimeout(()=>d.remove(),ms)}
function banner(t,c){sfx(c==='e'?'ephase':'phase');const b=document.createElement('div');b.className='banner '+c;b.textContent=t;vp.appendChild(b);setTimeout(()=>b.remove(),1150)}
/* the attacker hops toward its target on the map (screen direction, so it reads right in isometric) */
function lunge(a,d,k=14){const el=uEls[a.id];if(!el)return;const p=scrC(a.x,a.y,a.sz),q=scrC(d.x,d.y,d.sz),n=Math.hypot(q.x-p.x,q.y-p.y)||1;el.style.transform=`translate(${(q.x-p.x)/n*k}px,${(q.y-p.y)/n*k}px)`;setTimeout(()=>el.style.transform='',150)}
function flash(u){const el=uEls[u.id];if(!el)return;el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),120)}
/* swap a map sprite to one of its attack frames (windup, critup, swing, follow) or back to idle. t: turn to face that unit.
   Cast members have a PNG per frame; monsters only have idle and strike. */
function mapPose(u,name,t,wk){const el=uEls[u.id];if(!el)return;
  /* bosses (2+ tiles): just swap between the idle and strike frames, refitted to their box */
  if(u.sz>1&&!(!u.cast&&MON_SHEET[u.cls])){if(name!=='idle'&&name!=='swing'&&name!=='follow')return;const img=el.firstChild,src=sprite(u,name==='idle'?'idle':'strike',mapWk(u));if(img.dataset.s===src)return;
    img.src=src;img.dataset.s=src;img.classList.toggle('artl',artLeft(src));if(u.sz===2||src.startsWith('data:'))fillBox(img,src,u.team==='e');return}/* keeps the current fit until the new frame's is measured, so it doesn't jump the first time */const img=el.firstChild;wk=wk||mapWk(u);let src;
  /* animated monsters (MON_SHEET): windup and follow step through their frames */
  const sh=!u.cast&&MON_SHEET[u.cls];
  if(sh){const fr=name==='idle'?[0]:name==='windup'||name==='critup'?sh.windup||[0]:name==='swing'?[sh.swing??0]:name==='follow'?sh.follow||[0]:null;if(!fr)return;el._pose=name;
    const show=i=>{if(el._pose!==name)return;sheetFit(img,`sheet:${u.cls}:${sheetFrame(u,i)}`,u.sz)};fr.forEach((f,j)=>j?setTimeout(()=>show(f),D(70*j)):show(f));
    if(name==='idle'){img.style.transform='';return}
    if(t){const p=scrC(u.x,u.y,u.sz),q=scrC(t.x,t.y,t.sz);if(Math.abs(q.x-p.x)>1)img.style.transform=q.x<p.x?'scaleX(-1)':'scaleX(1)'}return}
  if(name==='idle')src=sprite(u,'idle',mapWk(u));
  else if(u.cast)src=castPng(u,name);
  else if(name==='swing'||name==='follow')src=sprite(u,'strike');
  if(!src)return;img.src=src;img.dataset.s=src;img.classList.toggle('artl',artLeft(src));
  /* hand-drawn frames can be wider than 64px (an axe swung out in front): show them at full width, body still at the left,
     and flip around the body's centre (32px) so it stays on its tile when facing left */
  img.style.transformOrigin='32px 50%';img.onload=()=>{const w=img.naturalWidth;if(w>64)img.style.setProperty('width',w+'px','important');else img.style.removeProperty('width')};
  if(name==='idle'){img.style.transform='';return}
  if(t){const p=scrC(u.x,u.y,u.sz),q=scrC(t.x,t.y,t.sz);if(Math.abs(q.x-p.x)>1)img.style.transform=q.x<p.x?'scaleX(-1)':'scaleX(1)'}}
/* one weapon strike on the map: wind up, swing (the lunge lands on it), then follow through. Resolves when the blow lands */
const SLOW_SWING=new Set(['vaar','morrigan','rook']);
async function swingAt(X,Y,w,crit,ranged){const wk=w&&w.key;
  /* cast members with hand-drawn attack frames hold each frame a little longer than the code-drawn rig, so the swing reads.
     (Every cast member has PNGs, most exported from the rig, so this is a list rather than a check for a PNG.) */
  const k=SLOW_SWING.has(X.cast)?1.4:1;
  /* sigils / spells with an element projectile (EL_PROJ: dark orbs, ice shards), and the frog's acid */
  if(w&&w.t==='art'&&EL_PROJ[w.el]){mapPose(X,crit?'critup':'windup',Y,wk);await sleep(D((crit?120:150)*k));mapPose(X,'swing',Y,wk);lunge(X,Y,-6);await elShot(X,Y,w.el,crit);setTimeout(()=>mapPose(X,'follow',Y,wk),D(90));return}
  if(w&&w.acid){mapPose(X,'windup',Y,wk);await sleep(D(150));mapPose(X,'swing',Y,wk);await acidSpew(X,Y);setTimeout(()=>mapPose(X,'follow',Y,wk),D(90));return}
  /* casters with their own bolt strip (Morrigan): it charges at the hand, then flies to the target */
  if(w&&w.t==='art'&&castPng(X,'bolt')){mapPose(X,crit?'critup':'windup',Y,wk);const ch=boltCharge(X,Y);await sleep(D((crit?120:150)*k));
    mapPose(X,'swing',Y,wk);lunge(X,Y,-6);ch.remove();await boltShot(X,Y);setTimeout(()=>mapPose(X,'follow',Y,wk),D(90));return}
  /* monsters with a fireball (MON_SHEET fireball): rear up, then spit it at the target, adjacent or not */
  const fb=!X.cast&&w&&w.t==='art'&&MON_SHEET[X.cls]&&MON_SHEET[X.cls].fireball;
  if(fb){mapPose(X,'windup',Y,wk);await sleep(D(crit?260:200));mapPose(X,'swing',Y,wk);await sleep(D(90));await fireball(X,Y,crit);await sleep(D(120));mapPose(X,'idle');return}
  mapPose(X,crit?'critup':'windup',Y,wk);await sleep(D((crit?120:150)*k));
  mapPose(X,'swing',Y,wk);if(ranged){lunge(X,Y,-6);await shoot(X,Y,w)}else{lunge(X,Y);if(!X.cast&&CLS[X.cls]&&CLS[X.cls].body==='golem')await slamFx(Y);else{slashFx(X,Y,w,crit);await sleep(D(110*k))}}
  setTimeout(()=>mapPose(X,'follow',Y,wk),D(90))}

/* a cast member's own spell projectile: art/cast/<id>/<class>-bolt.png, 3 frames of 64x64 side by side, facing right:
   0 charging at the hand, 1 in flight, 2 the burst on the target. BOLT_AT is where the skull sits in each frame,
   and BOLT_HAND where the casting hand is in the attack frames (both in the frame's own pixels) */
const BOLT_AT=[[35,31],[37,27],[35,24]],BOLT_HAND={morrigan:[55,24]};
function boltEl(src,f,x,y,flip){const d=document.createElement('div'),[ax,ay]=BOLT_AT[f];
  Object.assign(d.style,{position:'absolute',left:'0',top:'0',width:'64px',height:'64px',backgroundImage:`url(${src})`,backgroundSize:'300% 100%',
    backgroundPosition:f*50+'% 0',imageRendering:'pixelated',pointerEvents:'none',zIndex:9999,transformOrigin:`${ax}px ${ay}px`,transform:`translate(${x-ax}px,${y-ay}px)${flip?' scaleX(-1)':''}`});
  boardEl.appendChild(d);return d}
const boltFlip=(X,Y)=>scrC(Y.x,Y.y,Y.sz).x<scrC(X.x,X.y,X.sz).x;
/* board position of the caster's hand (64px map frames sit 8px left of and 15px above the unit's box, flipped around x 32) */
function boltHand(X,Y){const b=uBox(X),[hx,hy]=BOLT_HAND[X.cast]||[48,28],fl=boltFlip(X,Y);return[b.l-8+(fl?64-hx:hx),b.t-15+hy]}
function boltCharge(X,Y){const[x,y]=boltHand(X,Y);return boltEl(castPng(X,'bolt'),0,x,y,boltFlip(X,Y))}
async function boltShot(X,Y){const[sx,sy]=boltHand(X,Y),b=uBox(Y),ex=b.l+b.w/2,ey=b.t+b.h*.5,fl=boltFlip(X,Y),
    d=boltEl(castPng(X,'bolt'),1,sx,sy,fl),rot=Math.atan2(ey-sy,(ex-sx)*(fl?-1:1))*180/Math.PI*(fl?-1:1),[ax,ay]=BOLT_AT[1];
  const at=(x,y)=>({transform:`translate(${x-ax}px,${y-ay}px) rotate(${rot}deg)${fl?' scaleX(-1)':''}`});
  await d.animate([at(sx,sy),at(ex,ey)],{duration:D(260+Math.hypot(ex-sx,ey-sy)*.6),easing:'ease-in'}).finished;d.remove()}
/* the hit on the target: the caster's own bolt burst if it has one, otherwise a ring in the element's colour */
function hitBurst(X,Y,col,el){if(el==='dark'||el==='lightning'){const[x,y]=fxMid(Y);fxPlay(el==='dark'?FX.darkBurst:FX.ballBurst,x,y,{k:1.3});return}const src=castPng(X,'bolt');if(!src)return burst(Y,col);const b=uBox(Y),d=boltEl(src,2,b.l+b.w/2,b.t+b.h*.5,boltFlip(X,Y));
  d.animate([{opacity:1,offset:.6},{opacity:0}],{duration:D(380)}).finished.then(()=>d.remove())}

/* Krondis's Death Roll: Rhi's 8-frame strip (art/bosses/krondis-roll.png, 300x128 a frame) played over his map sprite.
   The strip faces left (as he does as an enemy) with his body in the first 128px, so it lines up with his standing sprite
   and the roll stretches out behind him */
async function krondisRollFx(u){const img=uEls[u.id]&&uEls[u.id].firstChild;if(!img)return;
  const r=img.getBoundingClientRect(),w=r.width*300/128,flip=u.team!=='e',d=document.createElement('div');
  Object.assign(d.style,{position:'fixed',left:(flip?r.right-w:r.left)+'px',top:r.top+'px',width:w+'px',height:r.height+'px',backgroundImage:'url(art/bosses/krondis-roll.png)',
    backgroundSize:'800% 100%',imageRendering:'pixelated',pointerEvents:'none',zIndex:9999,transform:flip?'scaleX(-1)':''});
  document.body.appendChild(d);img.style.visibility='hidden';
  for(let i=0;i<8;i++){d.style.backgroundPosition=i/7*100+'% 0';await sleep(D(i>1&&i<7?90:160))}
  d.remove();img.style.visibility=''}

/* slash trail: a pale pixel-art arc sweeps across the target as the blow lands (swords and axes arc, lances thrust).
   4 frames of 32x32 drawn once per shape, shown at 2x over the target and flipped to face away from the attacker */
const SLASH_C=['#fffbe8','#efe8c8','#c8c0a0'];
function slashFrames(shape){const c='SLASH|'+shape;if(sprCache[c])return sprCache[c];const out=[];
  for(let f=0;f<4;f++){const p=Px(32,32);
    if(shape==='thrust'){/* a streak that shoots right, then thins out */
      const x1=[14,28,31,31][f],x0=[2,4,12,22][f];for(let x=x0;x<=x1;x++){const t=(x-x0)/Math.max(1,x1-x0),th=f<2?Math.round(1+2*t):Math.round(2*t);for(let d=-th;d<=th;d++)p.set(x,16+d,Math.abs(d)===th?SLASH_C[2]:x>x1-3?SLASH_C[0]:SLASH_C[1])}}
    else{/* a crescent sweeping clockwise from upper left to lower right; the head is thickest, the tail tapers */
      const R=shape==='heavy'?14:13,TH=shape==='heavy'?5:3.5,a0=[-150,-150,-110,-30][f]*Math.PI/180,a1=[-70,10,70,90][f]*Math.PI/180;
      for(let y=0;y<32;y++)for(let x=0;x<32;x++){const dx=x-12.5,dy=y-15.5,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx);if(a<a0||a>a1)continue;
        const t=(a-a0)/(a1-a0),th=TH*(f===3?1-t*.6:t)+.6;if(r>R||r<R-th)continue;p.set(x,y,r>R-1?SLASH_C[0]:r<R-th+1?SLASH_C[2]:SLASH_C[1])}}
    out.push(p.url())}
  return sprCache[c]=out}
/* melee smears (FX): swords, axes and spears; drawn swinging to the right, flipped when the target is to the left */
const SMEAR=w=>w.kind==='sword'?['swordSmear',[1,2,3,4,5],.85,[8,9,10,11,12]]:w.kind==='axe'?['axeSmear',null,.75]:w.t==='pole'&&w.kind==='spear'?['spearThrust',null,1]:null;
function slashFx(X,Y,w,crit){const sm=w&&SMEAR(w);
  if(sm){const[x,y]=fxMid(Y),toL=scrC(Y.x,Y.y,Y.sz).x<scrC(X.x,X.y,X.sz).x,f=FX[sm[0]],fr=sm[1]||[...Array(f.n).keys()],k=sm[2]*(crit?1.25:1);
    const ang=sm[0]==='spearThrust'?Math.atan2(y-fxMid(X)[1],Math.abs(x-fxMid(X)[0])||1)*180/Math.PI:0;
    fxPlay(f,x,y,{frames:crit&&sm[3]?[...fr,...sm[3]]:fr,k,sx:toL?-1:1,rot:toL?-ang:ang});return}
  if(!w||!['blade','heavy'].includes(w.t))return;/* lances ('pole', the 'thrust' frames) are off until the thrust looks right */
  const fr=slashFrames(w.t==='pole'?'thrust':w.t==='heavy'?'heavy':'blade'),b=uBox(Y),a=scrC(X.x,X.y,X.sz),q=scrC(Y.x,Y.y,Y.sz),S=crit?80:64;
  const im=document.createElement('img');im.className='fx-slash';im.alt='';
  Object.assign(im.style,{left:b.l+b.w/2-S/2+'px',top:b.t+b.h*.5-S/2+'px',width:S+'px',height:S+'px',zIndex:9999,transform:q.x<a.x?'scaleX(-1)':''});
  boardEl.appendChild(im);fr.forEach((src,i)=>setTimeout(()=>{im.src=src;if(i===3)im.style.opacity='.6'},D(i*45)));setTimeout(()=>im.remove(),D(4*45+40))}

/* ================= ON-MAP ATTACKS ================= */
let fast=false;
const D=ms=>ms*(fast?.3:1);
const EL_COL={fire:'#ff8a3c',water:'#5ab4ff',ice:'#bfefff',wind:'#8ae8b0',earth:'#c8a060',lightning:'#ffe14a',illusion:'#b46aff',light:'#fff2b0',crystal:'#ff5a6a',nature:'#7ad85a',dark:'#b46aff'};
/* element attacks have their own sound; other magic (light, dark, nature) is silent for now */
/* an animated monster's ability frames (MON_SHEET abil), about 140ms each, then back to idle */
async function sheetPlay(u,frames){const el=uEls[u.id];if(!el)return;el._pose='abil';for(const f of frames){sheetFit(el.firstChild,`sheet:${u.cls}:${f}`,u.sz);await sleep(D(140))}await sleep(D(160));el._pose='idle';sheetFit(el.firstChild,`sheet:${u.cls}:${sheetFrame(u,0)}`,u.sz)}
const EL_SFX={fire:'fire',water:'water',lightning:'thunder',wind:'wind',ice:'ice'};
const CLAW_SFX=['Claws','Fangs','Talons','Bite'];
function hitSfx(w,ranged){return w.acid?'poison':w.kind==='staff'&&!ranged?'swing':w.t==='art'?EL_SFX[w.el]||null:w.t==='bow'?'arrow':ranged?'throw':CLAW_SFX.includes(w.n)?'claw':w.t==='blade'?(w.kind==='sword'?'sword':'slash'):'swing'}
/* a projectile flies from X to Y: arrows and thrown weapons arc (higher when shooting downhill), sigils fly straight and glow */
async function shoot(X,Y,w){
  const a=uBox(X),b=uBox(Y),sx=a.l+a.w/2,sy=a.t+a.h*.45,ex=b.l+b.w/2,ey=b.t+b.h*.5,arc=w.t==='art'?0:30+Math.max(0,sy-ey)*.3;
  if(w.t==='bow'){const f=FX.arrow,N=12,pts=[];for(let i=0;i<=N;i++){const t=i/N;pts.push([sx+(ex-sx)*t,sy+(ey-sy)*t-arc*4*t*(1-t)])}
    const AK=.45/* arrow scale: the art is drawn big for a 48px unit */,d=fxEl(f,sx,sy,AK);fxFrame(d,f,2);const ang=i=>{const[nx,ny]=pts[Math.min(N,i+1)],[px,py]=pts[Math.max(0,i-1)];return Math.atan2(ny-py,nx-px)*180/Math.PI};
    await d.animate(pts.map(([x,y],i)=>({transform:`translate(${x-f.ax}px,${y-f.ay}px) rotate(${ang(i)}deg) scale(${AK})`})),{duration:D(300),easing:'linear'}).finished;d.remove();
    fxPlay({...f,ax:53},ex,ey,{frames:[3,4,5],rot:ang(N),k:AK});return}
  const pj=document.createElement('div');pj.className='proj-m '+(w.t==='bow'?'arrow':w.t==='art'?'':'spin');pj.style.left='0';pj.style.top='0';
  if(w.t==='art')pj.style.color=pj.style.background=EL_COL[w.el]||'#c8b8ff';boardEl.appendChild(pj);
  const N=12,pts=[];for(let i=0;i<=N;i++){const t=i/N;pts.push([sx+(ex-sx)*t,sy+(ey-sy)*t-arc*4*t*(1-t)])}
  const kf=pts.map(([x,y],i)=>{const[nx,ny]=pts[Math.min(N,i+1)],[px,py]=pts[Math.max(0,i-1)];return{transform:`translate(${x}px,${y}px) rotate(${w.t==='bow'?Math.atan2(ny-py,nx-px)*180/Math.PI:i*60}deg)`}});
  await pj.animate(kf,{duration:D(w.t==='bow'?300:380),easing:'linear'}).finished;pj.remove()}
/* a fireball (art/fx/fireball.png, 3 flickering frames of 32x20 facing right) flies from X's mouth to Y and bursts */
async function fireball(X,Y,crit){const img=uEls[X.id]&&uEls[X.id].firstChild,s=MON_SHEET[X.cls],bb=boardEl.getBoundingClientRect(),b=uBox(Y),ex=b.l+b.w/2,ey=b.t+b.h*.5;
  let sx=uBox(X).l+uBox(X).w/2,sy=uBox(X).t+uBox(X).h*.4;
  if(img){const r=img.getBoundingClientRect(),fx=s.fireball[0]/s.w,fy=s.fireball[1]/s.fh,toL=ex<((r.left+r.right)/2-bb.left)/cam.s;/* the mouth is on the side it's facing (towards the target) */
    sx=((toL?r.left+fx*r.width:r.right-fx*r.width)-bb.left)/cam.s;sy=(r.top+fy*r.height-bb.top)/cam.s}
  const k=crit?1.4:1,ang=Math.atan2(ey-sy,ex-sx)*180/Math.PI,pj=document.createElement('div');pj.className='proj-fb';boardEl.appendChild(pj);
  let f=0;const fl=setInterval(()=>{f=(f+1)%3;pj.style.backgroundPosition=`${-f*64}px 0`},D(60));
  const kf=[0,1].map(t=>({transform:`translate(${sx+(ex-sx)*t}px,${sy+(ey-sy)*t}px) rotate(${ang}deg) scale(${(t?1:.6)*k})`}));
  await pj.animate(kf,{duration:D(Math.max(260,Math.hypot(ex-sx,ey-sy)*2.2)),easing:'ease-in'}).finished;clearInterval(fl);pj.remove();burst(Y,'#ff8a1e');if(crit)shake()}
/* ---- spell VFX strips (art/fx/*.png, frames side by side, drawn facing right). See FX below for each. ---- */
const FX={
  darkOrb:{src:'art/fx/dark-orb.png',fw:40,fh:32,n:10,ax:20,ay:16,ms:50},/* Umbral sigils and dark spells: the orb flies, its tail behind */
  darkBurst:{src:'art/fx/dark-burst.png',fw:40,fh:32,n:6,ax:20,ay:16,ms:70},/* the orb pops on the target; played backwards, it gathers at the hand on a crit */
  iceShard:{src:'art/fx/ice-shard.png',fw:48,fh:32,n:3,ax:30,ay:16,ms:70},/* frost sigils and ice spells */
  iceNova:{src:'art/fx/ice-nova.png',fw:32,fh:32,n:25,ax:16,ay:28,ms:55,hit:7},/* a crystal bursts from a tile (frames 0-7), then breaks up */
  holyBeam:{src:'art/fx/holy-beam.png',fw:48,fh:48,n:15,ax:24,ay:45,ms:50,hit:6},/* a pillar of light lands on a tile, then sparks */
  holyCross:{src:'art/fx/holy-cross.png',fw:32,fh:32,n:3,ax:16,ay:16,ms:110},/* healing */
  fireRing:{src:'art/fx/fire-ring.png',fw:96,fh:64,n:17,ax:48,ay:40,ms:65,hit:5},/* Klaus's Circle of Fire: a spark, the ring roars up, then burns down */
  frostBreath:{src:'art/fx/frost-breath.png',fw:96,fh:40,n:14,ax:4,ay:22,ms:60,hit:3},/* Corvin's Frost Wave: a gust of ice from the hand, widening as it goes */
  ballLightning:{src:'art/fx/ball-lightning.png',fw:44,fh:48,n:3,ax:30,ay:24,ms:60},/* lightning sigils (Drecken): the ball flies, crackling */
  ballBurst:{src:'art/fx/ball-lightning-burst.png',fw:58,fh:48,n:8,ax:32,ay:24,ms:65},/* ...and bursts on the target */
  chainArc:{src:'art/fx/chain-lightning.png',fw:180,fh:72,n:13,ax:8,ay:40,ms:55,hit:4},/* Chain Lightning: an arc jumping from one target to the next, stretched to fit */
  earthSlam:{src:'art/fx/earth-slam.png',fw:84,fh:56,n:14,ax:45,ay:47,ms:55,hit:3},/* golems: a rock arm crashes down, then the debris settles */
  swordSmear:{src:'art/fx/sword-smear.png',fw:104,fh:64,n:13,ax:56,ay:30,ms:45},/* swords: a sweep (frames 1-5); a crit adds the downward cut with sparks (8-12) */
  axeSmear:{src:'art/fx/axe-smear.png',fw:128,fh:104,n:8,ax:65,ay:55,ms:50},/* axes (Vaar's hatchet): a big overhead arc */
  spearThrust:{src:'art/fx/spear-thrust.png',fw:72,fh:32,n:9,ax:58,ay:18,ms:45},/* spears: a stab, its tip on the target */
  arrow:{src:'art/fx/arrow.png',fw:64,fh:32,n:6,ax:44,ay:18,ms:60},/* bows: frames 1-2 in flight (tip at 44,18), 3-5 it thunks in (tip at 53) */
  tendrils:{src:'art/fx/dark-tendrils.png',fw:64,fh:56,n:20,ax:31,ay:51,ms:60,hit:7},/* Morrigan's Hex: dark tendrils rise round the target, then sink away */
  levelUp:{src:'art/fx/level-up.png',fw:64,fh:96,n:9,ax:32,ay:80,ms:80},/* levelling up on the map: stars and chevrons rise round the unit */
  sanctuary:{src:'art/fx/sanctuary.png',fw:72,fh:88,n:16,ax:36,ay:82,ms:60},/* Sanctuary: a shimmering shield bubble round each guarded ally */
  earthSpike:{src:'art/fx/earth-spike.png',fw:128,fh:64,n:21,ax:64,ay:56,ms:50,hit:4},/* the Pyrite Colossus's Stalagmite: spikes burst up, then crumble */
  boulder:{src:'art/fx/boulder.png',fw:16,fh:18,n:1,ax:8,ay:9,ms:60},/* Boulder Toss: the rock in flight (spun in code)... */
  boulderImpact:{src:'art/fx/boulder-impact.png',fw:80,fh:56,n:15,ax:50,ay:48,ms:55,hit:2},/* ...and the crash and dust on the target */
  shockwave:{src:'art/fx/shockwave.png',fw:120,fh:52,n:14,ax:60,ay:30,ms:50},/* Leap (Vaar): a ring of shockwave where he lands */
  smoke:{src:'art/fx/smoke.png',fw:64,fh:64,n:11,ax:32,ay:34,ms:75,hit:3},/* Rook's Smoke Bomb: a pop, the cloud, then it thins out */
  acidGlob:{src:'art/fx/acid-glob.png',fw:44,fh:40,n:3,ax:40,ay:16,ms:60},/* the Spirit Frog's acid: a glob with a dripping trail... */
  acidSplash:{src:'art/fx/acid-splash.png',fw:56,fh:40,n:13,ax:37,ay:20,ms:60}/* ...that splashes and drips off the target */
};
/* one FX element at board point (x,y): k = scale, rot = degrees, sx = extra horizontal stretch */
function fxEl(f,x,y,k=1,rot=0,sx=1){const d=document.createElement('div');d.className='fx-strip';
  Object.assign(d.style,{width:f.fw+'px',height:f.fh+'px',backgroundImage:`url(${f.src})`,backgroundSize:`${f.n*f.fw}px ${f.fh}px`,transformOrigin:`${f.ax}px ${f.ay}px`,
    transform:`translate(${x-f.ax}px,${y-f.ay}px) rotate(${rot}deg) scale(${k*sx},${k})`});boardEl.appendChild(d);return d}
const fxFrame=(d,f,i)=>d.style.backgroundPosition=`${-i*f.fw}px 0`;
/* play frames (default all) at (x,y); resolves when frame f.hit shows (or at the end), and removes itself at the end */
function fxPlay(f,x,y,o={}){const fr=o.frames||[...Array(f.n).keys()],d=fxEl(f,x,y,o.k,o.rot,o.sx),ms=D(o.ms||f.ms);let i=0,hitAt=fr.indexOf(f.hit??-1);if(hitAt<0)hitAt=fr.length-1;
  return new Promise(res=>{fxFrame(d,f,fr[0]);if(!hitAt)res();const t=setInterval(()=>{i++;if(i>=fr.length){clearInterval(t);d.remove();res();return}fxFrame(d,f,fr[i]);if(i===hitAt)res()},ms)})}
/* a looping strip flies from (sx,sy) to (ex,ey), turned to face where it's going */
async function fxFly(f,sx,sy,ex,ey,k=1){const rot=Math.atan2(ey-sy,ex-sx)*180/Math.PI,d=fxEl(f,sx,sy,k,rot);let i=0;const t=setInterval(()=>fxFrame(d,f,i=(i+1)%f.n),D(f.ms));
  const at=(x,y)=>({transform:`translate(${x-f.ax}px,${y-f.ay}px) rotate(${rot}deg) scale(${k})`});
  await d.animate([at(sx,sy),at(ex,ey)],{duration:D(240+Math.hypot(ex-sx,ey-sy)*.9),easing:'ease-in'}).finished;clearInterval(t);d.remove()}
const fxMid=u=>{const b=uBox(u);return[b.l+b.w/2,b.t+b.h*.5]};
/* where a spell leaves the caster: Morrigan's hand (BOLT_HAND), otherwise chest height on the side facing the target */
function fxFrom(X,Y){if(BOLT_HAND[X.cast])return boltHand(X,Y);const b=uBox(X),toL=boltFlip(X,Y);return[b.l+b.w/2+(toL?-10:10),b.t+b.h*.42]}
/* element projectiles for sigil attacks and single-target spells; crit: an extra flourish at the hand first */
const EL_PROJ={lightning:{f:'ballLightning',k:1.2},dark:{f:'darkOrb',k:1.3,crit:async(X,Y)=>{const[x,y]=fxFrom(X,Y);await fxPlay(FX.darkBurst,x,y,{frames:[5,4,3,2,1,0],k:1.1})}},ice:{f:'iceShard',k:1.1}};
async function elShot(X,Y,el,crit){const p=EL_PROJ[el];if(crit&&p.crit)await p.crit(X,Y);const[sx,sy]=fxFrom(X,Y),[ex,ey]=fxMid(Y);await fxFly(FX[p.f],sx,sy,ex,ey,p.k*(crit?1.25:1))}
/* the Spirit Frog's acid: a glob from its mouth, then a splash on the target */
async function acidSpew(X,Y){const b=uBox(X),toL=boltFlip(X,Y),[ex,ey]=fxMid(Y);let sx=b.l+b.w/2+(toL?-8:8),sy=b.t+b.h*.6;
  {const s=!X.cast&&MON_SHEET[X.cls],img=uEls[X.id]&&uEls[X.id].firstChild;if(s&&s.mouth&&img){const r=img.getBoundingClientRect(),bb=boardEl.getBoundingClientRect(),fx=s.mouth[0]/s.w,fy=s.mouth[1]/s.fh,l=ex<((r.left+r.right)/2-bb.left)/cam.s;sx=((l?r.left+fx*r.width:r.right-fx*r.width)-bb.left)/cam.s;sy=(r.top+fy*r.height-bb.top)/cam.s}}/* from the mouth (MON_SHEET mouth) */
  await fxFly(FX.acidGlob,sx,sy,ex,ey,1.2);fxPlay(FX.acidSplash,ex,ey,{k:1.3})}
/* tile VFX for area spells (ABIL tfx): a crystal / pillar on every tile of the shape, a little staggered; resolves as they land */
const TILE_FX={
  ice:tiles=>Promise.all(tiles.map(([x,y],i)=>sleep(D(i*35)).then(()=>{const p=tileTop(x,y,vhOf(x,y));return fxPlay(FX.iceNova,p.x,p.y+TH/2,{k:1.3})}))),
  fire:tiles=>{const p=tiles.map(([x,y])=>tileTop(x,y,vhOf(x,y))),n=p.length,cx=p.reduce((a,q)=>a+q.x,0)/n,cy=p.reduce((a,q)=>a+q.y,0)/n+TH/2;return fxPlay(FX.fireRing,cx,cy,{k:2.2})},
  breath:(tiles,u)=>{const ps=tiles.map(([x,y])=>{const p=tileTop(x,y,vhOf(x,y));return[p.x,p.y+TH/2]}),[ex,ey]=ps.reduce((a,p)=>[a[0]+p[0]/ps.length,a[1]+p[1]/ps.length],[0,0]),
      b=uBox(u),toL=ex<b.l+b.w/2,sx=b.l+b.w/2+(toL?-10:10),sy=b.t+b.h*.45,L=Math.max(...ps.map(([x,y])=>Math.hypot(x-sx,y-sy)))+20;
    return fxPlay(FX.frostBreath,sx,sy,{rot:Math.atan2(ey-sy,ex-sx)*180/Math.PI,k:1.5,sx:L/(92*1.5)})},
  tendrils:tiles=>Promise.all(tiles.map(([x,y])=>{const p=tileTop(x,y,vhOf(x,y));return fxPlay(FX.tendrils,p.x,p.y+TH/2+4,{k:1.4})})),
  spike:tiles=>Promise.all(tiles.map(([x,y])=>{const p=tileTop(x,y,vhOf(x,y));return fxPlay(FX.earthSpike,p.x,p.y+TH/2+2,{k:.75})})),
  smoke:(tiles,u)=>{const[x,y]=fxMid(u);return fxPlay(FX.smoke,x,y+8,{k:2.6})},
  holy:tiles=>Promise.all(tiles.map(([x,y])=>sleep(D(Math.random()*260)).then(()=>{const p=tileTop(x,y,vhOf(x,y));return fxPlay(FX.holyBeam,p.x,p.y+TH/2,{k:1.4})})))};
/* an arc of lightning from unit A to unit B (Chain Lightning's jumps); resolves when it strikes */
function arcFx(A,B){const[sx,sy]=fxMid(A),[ex,ey]=fxMid(B),L=Math.hypot(ex-sx,ey-sy);return fxPlay(FX.chainArc,sx,sy,{rot:Math.atan2(ey-sy,ex-sx)*180/Math.PI,sx:Math.max(.4,L/165)})}
/* a golem's slam lands on the target's tile */
function slamFx(Y){const b=uBox(Y);return fxPlay(FX.earthSlam,b.l+b.w/2,b.t+b.h-8,{k:1.2})}
/* Boulder Toss (golems, the Pyrite Colossus): wind up, lob a spinning rock on a high arc, crash on the target */
async function boulderFx(X,Y){mapPose(X,'windup',Y);await sleep(D(220));mapPose(X,'swing',Y);
  const b=uBox(X),[ex,ey]=fxMid(Y),sx=b.l+b.w/2,sy=b.t+b.h*.25,f=FX.boulder,d=fxEl(f,sx,sy,1.6),N=14,arc=40+Math.hypot(ex-sx,ey-sy)*.35,pts=[];
  for(let i=0;i<=N;i++){const t=i/N;pts.push({transform:`translate(${sx+(ex-sx)*t-f.ax}px,${sy+(ey-sy)*t-arc*4*t*(1-t)-f.ay}px) rotate(${t*540}deg) scale(1.6)`})}
  await d.animate(pts,{duration:D(520),easing:'linear'}).finished;d.remove();shake();await fxPlay(FX.boulderImpact,ex,ey+8,{k:1.3});setTimeout(()=>mapPose(X,'idle'),D(200))}
function healFx(t){const[x,y]=fxMid(t);fxPlay(FX.holyCross,x,y-4,{k:1.8,frames:[0,0,1,2]})}
/* a ring bursts on the target: element colour for sigils, white for crits */
function burst(Y,col){const b=uBox(Y),r=document.createElement('div');r.className='fx-m';r.style.left=b.l+b.w/2+'px';r.style.top=b.t+b.h*.55+'px';r.style.color=col;boardEl.appendChild(r);
  r.animate([{transform:'scale(.3)',opacity:1},{transform:'scale(1.4)',opacity:0}],{duration:D(380),easing:'ease-out'}).finished.then(()=>r.remove())}
/* crits shake the whole map (the vp's translate, so the camera's transform is untouched) */
function shake(){vp.animate([{translate:'0 0'},{translate:'-7px 3px'},{translate:'6px -3px'},{translate:'-4px 2px'},{translate:'2px -1px'},{translate:'0 0'}],{duration:D(360)})}
/* red crystal shards burst off the target (crystal weapons) */
function shatterFx(Y){const b=uBox(Y),cx=b.l+b.w/2,cy=b.t+b.h*.5;for(let i=0;i<12;i++){const sh=document.createElement('i'),a=i/12*6.283,r=18+Math.random()*20,sz=3+Math.random()*4;sh.className='shard';
  Object.assign(sh.style,{left:cx+'px',top:cy+'px',width:sz+'px',height:sz*1.8+'px',background:['#ff5a6a','#c8283a','#ffb0b8','#8a1224'][i%4]});boardEl.appendChild(sh);
  sh.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r}px)) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:D(520),easing:'cubic-bezier(.2,.7,.4,1)',fill:'forwards'}).finished.then(()=>sh.remove())}}
/* death: the unit flashes white, staggers, then shatters into crystal shards */
function dieFx(el,host,cx,cy,u,k=1,quiet){if(!quiet){sfx('death');setTimeout(()=>sfx('broke'),D(260))}
  const cols=u.team==='e'?['#c58aff','#9fd8ff','#efe0ff','#7a5ac8']:['#f3f0e8','#ffd27a','#bfe8ff','#d8d0bc'];
  setTimeout(()=>{for(let i=0;i<12;i++){const sh=document.createElement('i'),a=i/12*6.283+Math.random()*.4,r=(26+Math.random()*30)*k,sz=(3+Math.random()*4)*k;sh.className='shard';
    Object.assign(sh.style,{left:cx+'px',top:cy+'px',width:sz+'px',height:sz*1.6+'px',background:cols[i%cols.length]});host.appendChild(sh);
    sh.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r+10*k}px)) rotate(${Math.random()*540-270}deg)`,opacity:0}],{duration:D(650+Math.random()*250),easing:'cubic-bezier(.2,.7,.4,1)',fill:'forwards'}).finished.then(()=>sh.remove())}},D(260));
  return el.animate([{filter:'none',transform:'none',opacity:1},{filter:'brightness(4) saturate(0)',transform:'translateX(-3px)',opacity:1,offset:.15},{filter:'none',transform:'translateX(3px)',opacity:1,offset:.3},{filter:'brightness(4) saturate(0)',transform:'scale(1.05)',opacity:1,offset:.42},{filter:'brightness(4) saturate(0)',transform:'scale(.7)',opacity:0}],{duration:D(620),easing:'ease-in',fill:k>1?'forwards':'none'}).finished}
/* play a fight on the map: hop or shoot, flash, numbers. res.ev is the list of strikes from resolve() */
async function quickPlay(a,d,res){
  fast=false;const f=res.f,wOf=u=>u===a?f.aw:f.dw;
  for(const e of res.ev){const X=e.by==='a'?a:d,Y=X===a?d:a,w=wOf(X)||{t:'blade'},ranged=w.t==='bow'||(w.t==='art'&&f.dist>1)||(w.thrown&&f.dist>1)||f.dist>1;
    if(e.proc)pop(X,e.proc,'crit');
    if(e.crit){sfx('critcharge');const el=uEls[X.id];if(el)el.animate([{filter:'none'},{filter:'brightness(2.2) drop-shadow(0 0 6px #fff)'},{filter:'none'}],{duration:D(320)});await sleep(D(260))}
    /* Krondis opens his jaws (strike frame) and holds it before the sound and the swing */
    if(X.cls==='Krondis'){mapPose(X,'swing',Y);await sleep(D(500))}
    sfx(X.cls==='Krondis'?'sandswipe':hitSfx(w,ranged));
    await swingAt(X,Y,w,e.crit,ranged);
    if(e.hit){sfx(e.crit?(w.t==='art'?'crit':'swordcrit'):'hit');/* weapon crits use the recorded sword crit */Y.hp=Y===a?e.hpA:e.hpD;pop(Y,(e.crit?'Crit ':'')+'-'+e.dmg,e.crit?'crit':'dmg');flash(Y);lunge(Y,X,-6);
      if(w.t==='art')hitBurst(X,Y,EL_COL[w.el]||'#c8b8ff',w.el);if(w.el==='crystal')shatterFx(Y);if(e.crit){shake();burst(Y,'#fff')}if(e.guard){pop(Y,e.guard,'heal');if(e.guard!==SKILLS.retaliate.n)sfx('block')}
      if(e.heal){X.hp=X===a?e.hpA:e.hpD;pop(X,'+'+e.heal,'heal')}}
    else{sfx('miss');pop(Y,'Miss','miss');lunge(Y,X,-10)}
    await sleep(D(240));mapPose(X,'idle');mapPose(Y,'idle');render();await sleep(D(200))}
}
async function showExp(u,g){
  if(!g)return;const host=vp,box=document.createElement('div');box.className='expbox';
  box.innerHTML=`<span>EXP</span><span class="xb"><i style="width:${g.from}%"></i></span><span class="xn">${g.from}</span>`;host.appendChild(box);
  const bar=box.querySelector('i'),num=box.querySelector('.xn'),total=g.from+g.amt,t0=performance.now(),dur=D(650)+g.amt*D(6);
  await new Promise(r=>{(function step(t){const k=Math.min(1,(t-t0)/dur),v=Math.round(g.from+g.amt*k),shown=v>=100&&g.gains?v-100:Math.min(v,100);bar.style.width=shown+'%';num.textContent=shown;if(k<1)requestAnimationFrame(step);else r()})(t0)});
  await sleep(D(450));box.remove();
}

