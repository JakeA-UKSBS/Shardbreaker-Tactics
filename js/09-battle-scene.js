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
/* swap a map sprite to one of the rig's poses (windup, critup, swing, follow, hit, dodge, idle), the same frames the
   side-on battle in Shardbreaker uses. t: turn to face that unit. Rigged units get every pose; older sprites only swing. */
function mapPose(u,name,t,wk){const el=uEls[u.id];if(!el||u.sz>1)return;const img=el.firstChild;wk=wk||mapWk(u);let src;
  if(name==='idle')src=sprite(u,'idle',mapWk(u));
  else if(castPng(u,name))src=castPng(u,name);
  else if(isHi(u.cls,u.sz)){const k=['MP',u.cls,u.team,name,wk,JSON.stringify(u.look)].join('|');src=sprCache[k]||(sprCache[k]=hiArt(u.look,u.cls,u.team,wk,name,0,64))}
  else if(name==='swing'||name==='follow')src=sprite(u,'strike',wk);else return;
  img.src=src;img.dataset.s=src;
  if(name==='idle'){img.style.transform='';return}
  if(t){const p=scrC(u.x,u.y,u.sz),q=scrC(t.x,t.y,t.sz);if(Math.abs(q.x-p.x)>1)img.style.transform=q.x<p.x?'scaleX(-1)':'scaleX(1)'}}
/* one weapon strike on the map: wind up, swing (the lunge lands on it), then follow through. Resolves when the blow lands */
async function swingAt(X,Y,w,crit,ranged){const wk=w&&w.key;
  mapPose(X,crit?'critup':'windup',Y,wk);await sleep(D(crit?120:150));
  mapPose(X,'swing',Y,wk);if(ranged){lunge(X,Y,-6);await shoot(X,Y,w)}else{lunge(X,Y);slashFx(X,Y,w,crit);await sleep(D(110))}
  setTimeout(()=>mapPose(X,'follow',Y,wk),D(90))}

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
function slashFx(X,Y,w,crit){if(!w||!['blade','heavy'].includes(w.t))return;/* lances ('pole', the 'thrust' frames) are off until the thrust looks right */
  const fr=slashFrames(w.t==='pole'?'thrust':w.t==='heavy'?'heavy':'blade'),b=uBox(Y),a=scrC(X.x,X.y,X.sz),q=scrC(Y.x,Y.y,Y.sz),S=crit?80:64;
  const im=document.createElement('img');im.className='fx-slash';im.alt='';
  Object.assign(im.style,{left:b.l+b.w/2-S/2+'px',top:b.t+b.h*.5-S/2+'px',width:S+'px',height:S+'px',zIndex:9999,transform:q.x<a.x?'scaleX(-1)':''});
  boardEl.appendChild(im);fr.forEach((src,i)=>setTimeout(()=>{im.src=src;if(i===3)im.style.opacity='.6'},D(i*45)));setTimeout(()=>im.remove(),D(4*45+40))}

/* ================= ON-MAP ATTACKS ================= */
let fast=false;
const D=ms=>ms*(fast?.3:1);
const EL_COL={fire:'#ff8a3c',water:'#5ab4ff',wind:'#8ae8b0',earth:'#c8a060',lightning:'#ffe14a',illusion:'#b46aff',light:'#fff2b0',crystal:'#ff5a6a',nature:'#7ad85a',dark:'#b46aff'};
function hitSfx(w,ranged){return w.kind==='staff'&&!ranged?'swing':w.t==='art'?null/* magic attacks are silent for now */:w.t==='bow'?'arrow':ranged?'throw':w.kind==='whip'?'whip':w.kind==='chain'?'chain':w.kind==='fan'||w.kind==='umbrella'?'wind':'swing'}
/* a projectile flies from X to Y: arrows and thrown weapons arc (higher when shooting downhill), sigils fly straight and glow */
async function shoot(X,Y,w){
  const a=uBox(X),b=uBox(Y),sx=a.l+a.w/2,sy=a.t+a.h*.45,ex=b.l+b.w/2,ey=b.t+b.h*.5,arc=w.t==='art'?0:30+Math.max(0,sy-ey)*.3;
  const pj=document.createElement('div');pj.className='proj-m '+(w.t==='bow'?'arrow':w.t==='art'?'':'spin');pj.style.left='0';pj.style.top='0';
  if(w.t==='art')pj.style.color=pj.style.background=EL_COL[w.el]||'#c8b8ff';boardEl.appendChild(pj);
  const N=12,pts=[];for(let i=0;i<=N;i++){const t=i/N;pts.push([sx+(ex-sx)*t,sy+(ey-sy)*t-arc*4*t*(1-t)])}
  const kf=pts.map(([x,y],i)=>{const[nx,ny]=pts[Math.min(N,i+1)],[px,py]=pts[Math.max(0,i-1)];return{transform:`translate(${x}px,${y}px) rotate(${w.t==='bow'?Math.atan2(ny-py,nx-px)*180/Math.PI:i*60}deg)`}});
  await pj.animate(kf,{duration:D(w.t==='bow'?300:380),easing:'linear'}).finished;pj.remove()}
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
    sfx(X.cls==='Krondis'?'sandswipe':hitSfx(w,ranged));
    await swingAt(X,Y,w,e.crit,ranged);
    if(e.hit){sfx(e.crit?(w.t==='art'?'crit':'swordcrit'):'hit');/* weapon crits use the recorded sword crit */Y.hp=Y===a?e.hpA:e.hpD;pop(Y,(e.crit?'Crit ':'')+'-'+e.dmg,e.crit?'crit':'dmg');flash(Y);lunge(Y,X,-6);mapPose(Y,'hit',X);
      if(w.t==='art')burst(Y,EL_COL[w.el]||'#c8b8ff');if(w.el==='crystal')shatterFx(Y);if(e.crit){shake();burst(Y,'#fff')}if(e.guard)pop(Y,e.guard,'heal');
      if(e.heal){X.hp=X===a?e.hpA:e.hpD;pop(X,'+'+e.heal,'heal')}}
    else{sfx('miss');pop(Y,'Miss','miss');lunge(Y,X,-10);mapPose(Y,'dodge',X)}
    await sleep(D(240));mapPose(X,'idle');mapPose(Y,'idle');render();await sleep(D(200))}
}
async function showExp(u,g){
  if(!g)return;const host=vp,box=document.createElement('div');box.className='expbox';
  box.innerHTML=`<span>EXP</span><span class="xb"><i style="width:${g.from}%"></i></span><span class="xn">${g.from}</span>`;host.appendChild(box);
  const bar=box.querySelector('i'),num=box.querySelector('.xn'),total=g.from+g.amt,t0=performance.now(),dur=D(650)+g.amt*D(6);
  await new Promise(r=>{(function step(t){const k=Math.min(1,(t-t0)/dur),v=Math.round(g.from+g.amt*k),shown=v>=100&&g.gains?v-100:Math.min(v,100);bar.style.width=shown+'%';num.textContent=shown;if(k<1)requestAnimationFrame(step);else r()})(t0)});
  await sleep(D(450));box.remove();
}

