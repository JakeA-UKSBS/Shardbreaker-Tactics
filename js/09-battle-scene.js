/* Hit popups and the on-map attack animations (no side-on battle scene in Tactics) */
/* ================= FX ================= */
function pop(u,txt,cls){const p=document.createElement('div'),b=uBox(u);p.className='pop '+cls;p.textContent=txt;p.style.left=b.l+b.w/2-24+'px';p.style.top=b.t+'px';boardEl.appendChild(p);setTimeout(()=>p.remove(),950)}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;vp.appendChild(d);setTimeout(()=>d.remove(),1900)}
function banner(t,c){sfx(c==='e'?'ephase':'phase');const b=document.createElement('div');b.className='banner '+c;b.textContent=t;vp.appendChild(b);setTimeout(()=>b.remove(),1150)}
/* the attacker hops toward its target on the map (screen direction, so it reads right in isometric) */
function lunge(a,d,k=14){const el=uEls[a.id];if(!el)return;const p=scrC(a.x,a.y,a.sz),q=scrC(d.x,d.y,d.sz),n=Math.hypot(q.x-p.x,q.y-p.y)||1;el.style.transform=`translate(${(q.x-p.x)/n*k}px,${(q.y-p.y)/n*k}px)`;setTimeout(()=>el.style.transform='',150)}
function flash(u){const el=uEls[u.id];if(!el)return;el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),120)}

/* ================= ON-MAP ATTACKS ================= */
let fast=false;
const D=ms=>ms*(fast?.3:1);
const EL_COL={fire:'#ff8a3c',water:'#5ab4ff',wind:'#8ae8b0',earth:'#c8a060',lightning:'#ffe14a',illusion:'#b46aff',light:'#fff2b0',crystal:'#ff5a6a',nature:'#7ad85a',dark:'#b46aff'};
function hitSfx(w,ranged){return w.kind==='staff'&&!ranged?'swing':w.t==='art'?({fire:'fire',water:'water',wind:'wind',earth:'earth',lightning:'thunder',illusion:'dark',light:'heal',crystal:'broke'}[w.el]||'fire'):w.t==='bow'?'arrow':ranged?'throw':w.kind==='whip'?'whip':w.kind==='chain'?'chain':w.kind==='fan'||w.kind==='umbrella'?'wind':'swing'}
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
    if(e.proc&&e.proc!==SKILLS.siphon.n)pop(X,e.proc,'crit');
    if(e.crit){sfx('critcharge');const el=uEls[X.id];if(el)el.animate([{filter:'none'},{filter:'brightness(2.2) drop-shadow(0 0 6px #fff)'},{filter:'none'}],{duration:D(320)});await sleep(D(260))}
    sfx(hitSfx(w,ranged));
    if(ranged){lunge(X,Y,-6);await shoot(X,Y,w)}else{lunge(X,Y);await sleep(D(140))}
    if(e.hit){sfx(e.crit?'crit':'hit');Y.hp=Y===a?e.hpA:e.hpD;pop(Y,(e.crit?'Crit ':'')+'-'+e.dmg,e.crit?'crit':'dmg');flash(Y);lunge(Y,X,-6);
      if(w.t==='art')burst(Y,EL_COL[w.el]||'#c8b8ff');if(w.el==='crystal')shatterFx(Y);if(e.crit){shake();burst(Y,'#fff')}if(e.guard)pop(Y,e.guard,'heal');
      if(e.heal){X.hp=X===a?e.hpA:e.hpD;pop(X,'+'+e.heal,'heal')}}
    else{sfx('miss');pop(Y,'Miss','miss');lunge(Y,X,-10)}
    render();await sleep(D(430))}
}
async function showExp(u,g){
  if(!g)return;const host=vp,box=document.createElement('div');box.className='expbox';
  box.innerHTML=`<span>EXP</span><span class="xb"><i style="width:${g.from}%"></i></span><span class="xn">${g.from}</span>`;host.appendChild(box);
  const bar=box.querySelector('i'),num=box.querySelector('.xn'),total=g.from+g.amt,t0=performance.now(),dur=D(650)+g.amt*D(6);
  await new Promise(r=>{(function step(t){const k=Math.min(1,(t-t0)/dur),v=Math.round(g.from+g.amt*k),shown=v>=100&&g.gains?v-100:Math.min(v,100);bar.style.width=shown+'%';num.textContent=shown;if(k<1)requestAnimationFrame(step);else r()})(t0)});
  await sleep(D(450));box.remove();
}

