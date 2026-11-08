/* Class-change screens */
/* ================= CLASS CHANGE ================= */
function promote(u,to){
  const from=u.cls;to=to||CLS[from].promo;const b=CLS[to].bonus.slice();
  /* a new movement type on promotion also brings its stat tilt (gains only) */
  if(from.startsWith('G.')&&to.startsWith('G.')){const s1=MOVES[from.split('.')[2]].st||[],s2=MOVES[to.split('.')[2]].st||[];b.forEach((v,i)=>b[i]=v+Math.max(0,(s2[i]||0)-(s1[i]||0)))}
  const old={lv:u.lv,cap:capOf(u)};ST.forEach(s=>old[s]=s==='hp'?u.maxhp:u[s]);
  const gift=CLS[to].gift&&u.items.length<5?CLS[to].gift:null;if(gift)u.items.push({k:gift,u:IT[gift].uses});
  if(u._nl){u.look=u._nl;delete u._nl}
  castSwap(u,to);
  u.cls=to;u.lv=1;u.exp=0;u.cap=capOf(u)+PROMO_CAP;u.mov=CLS[to].mov;
  ST.forEach((s,i)=>{if(s==='hp'){u.maxhp+=b[i];u.hp+=b[i]}else u[s]+=b[i]});u.lck+=b[3];
  return{from,to,old,b,gift};
}
async function ascend(u,to){
  const before=castPng(u,'idle'),r=promote(u,to),after=castPng(u,'idle'),still=!settings.anim||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el=document.createElement('div');el.className='asc';
  const parts=Array.from({length:36},()=>`<i class="asc-p" style="left:${10+Math.random()*80}%;--x:${(Math.random()*60-30).toFixed(0)}px;--d:${(1.6+Math.random()*1.8).toFixed(2)}s;--dl:${(Math.random()*2).toFixed(2)}s"></i>`).join('');
  el.innerHTML=`<div class="asc-stage"><div class="asc-pillar"></div><div class="asc-ring"></div><div class="asc-ring r2"></div>${parts}<div class="asc-wave"></div><img class="asc-spr" src="${before}" alt=""></div>
   <div class="asc-txt"><div class="eyebrow">Ascension</div><h2>${u.name}</h2><p class="asc-cls"><span>${CLS[r.from].n}</span> → <b>${CLS[r.to].n}</b></p></div>
   <div class="asc-box" hidden><div class="lvl">${shown(u).map((s,i)=>`<div data-s="${s}"><span>${SL[s]}</span><span><b class="v">${r.old[s]}</b><em></em></span></div>`).join('')}</div>
   <p class="asc-cap">Skill capacity <b>${r.old.cap} → ${capOf(u)}</b> · Move <b>${u.mov}</b> · Wields <b>${CLS[u.cls].w.map(t=>CLS[r.from].w.includes(t)?TN[t]:`<span class="asc-new">${TN[t]}</span>`).join(', ')}</b>${r.gift?` · Gains a <b>${IT[r.gift].n}</b>`:''}</p>
   <p class="asc-cap dim">Level resets to 1. EXP is earned as an ascended unit from now on.</p>
   <div class="mbtns"><button class="go" type="button" data-m="ok" disabled>Continue</button></div></div><div class="asc-flash"></div>`;
  document.body.appendChild(el);
  let skip=still;el.addEventListener('click',e=>{if(!e.target.closest('[data-m]'))skip=true});
  const w=ms=>skip?Promise.resolve():sleep(ms),spr=el.querySelector('.asc-spr');
  if(!still){
    sfx('bell');await w(700);el.classList.add('rise');sfx('rise');await w(1500);
    el.classList.add('charge');await w(900);
  }
  spr.src=after;el.classList.remove('charge');el.classList.add('burst');sfx('burst');
  await w(still?0:900);el.querySelector('.asc-box').hidden=false;
  for(const s of shown(u)){const inc=s==='lck'?r.b[3]+r.b[5]:r.b[ST.indexOf(s)];if(!inc)continue;const row=el.querySelector(`[data-s="${s}"]`);row.classList.add('up');row.querySelector('.v').textContent=r.old[s]+inc;row.querySelector('em').textContent='+'+inc;sfx('ding');await w(220)}
  const btn=el.querySelector('[data-m]');btn.disabled=false;btn.focus();
  await new Promise(res=>btn.addEventListener('click',res,{once:true}));
  el.classList.add('out');await sleep(250);el.remove();
}

