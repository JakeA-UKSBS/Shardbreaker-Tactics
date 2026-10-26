/* Old intro and cutscene engine, and class-change screens */
/* ================= NEW GAME INTRO ================= */
async function introScene(party){
  const el=document.createElement('div');el.className='intro';
  const look=u=>sprite(u,'idle',mapWk(u)),lord=party.find(u=>u.lord)||party[0];
  const foes=['Bandit','Swordsman','SectGuard','Crossbowman'].map(k=>fig(FOE[k].look,k,'e','idle',FOE[k].items[0]));
  const ash=Array.from({length:28},()=>`<i style="left:${(Math.random()*100).toFixed(1)}%;--d:${(5+Math.random()*6).toFixed(1)}s;--dl:${(-Math.random()*8).toFixed(1)}s;--x:${(Math.random()*40-20).toFixed(0)}px"></i>`).join('');
  el.innerHTML=`<div class="in-room"><div class="in-lamp"></div><img class="in-sleeper" src="${look(lord)}" alt=""></div>
   <div class="in-world"><div class="in-ruins"></div><div class="in-ash">${ash}</div>
    <div class="in-foes">${foes.map(f=>`<img src="${f}" alt="">`).join('')}</div>
    <div class="in-party">${party.map(u=>`<img src="${look(u)}" alt="">`).join('')}</div></div>
   <p class="in-cap" aria-live="polite"></p><button type="button" class="in-skip">Skip</button>`;
  document.body.appendChild(el);
  let skip=false;const cap=el.querySelector('.in-cap');
  const done=new Promise(res=>el.querySelector('.in-skip').addEventListener('click',()=>{skip=true;res()},{once:true}));
  const w=ms=>Promise.race([sleep(ms),done]);
  const say=async(t,ms)=>{if(skip)return;cap.classList.remove('on');await w(350);if(skip)return;cap.textContent=t;cap.classList.add('on');await w(ms)};
  const steps=async()=>{
    await w(300);el.classList.add('s1');
    await say(`The night before ${lord.name} turns eighteen.`,2200);
    if(skip)return;el.classList.add('s2');sfx('bell');
    await say('At midnight, a bell begins to ring.',2600);
    if(skip)return;el.classList.add('s3');
    await say('Everyone hears it once. Nobody can stay awake.',2600);
    if(skip)return;el.classList.add('s4');cap.classList.remove('on');await w(1400);
    await say('Then they open their eyes somewhere else.',2000);
    if(skip)return;el.classList.add('s5');await w(1300);
    if(skip)return;el.classList.add('s6');sfx('rise');await w(1100);
    if(skip)return;el.classList.add('s7');sfx('ephase');
    await say('Strangers, waking at the same moment, in a world where the dead still walk.',3200);
  };
  await Promise.race([steps(),done]);
  el.classList.add('out');await sleep(500);el.remove();
}

/* ================= CUTSCENES ================= */
function captioner(el){
  let skip=false;const cap=el.querySelector('.in-cap');
  const done=new Promise(res=>el.querySelector('.in-skip').addEventListener('click',()=>{skip=true;res()},{once:true}));
  const w=ms=>Promise.race([sleep(ms),done]);
  const say=async(t,ms)=>{if(skip)return;cap.classList.remove('on');await w(350);if(skip)return;cap.textContent=t;cap.classList.add('on');await w(ms)};
  return{w,say,done,skipped:()=>skip};
}
const SCENES={
  async takeoff(){
    const el=document.createElement('div');el.className='intro shipsc';
    el.innerHTML=`<div class="ss-cloud c2"></div><div class="ss-cliff"></div><div class="ss-ship"><img class="ss-wings" src="${shipWingArt()}" alt=""><img class="ss-body" src="${shipSideArt()}" alt=""></div><div class="ss-cloud c1"></div><p class="in-cap" aria-live="polite"></p><button type="button" class="in-skip">Skip</button>`;
    document.body.appendChild(el);const{w,say,done,skipped}=captioner(el);
    const steps=async()=>{
      await say('Gruu presses both hands to the keel. Old runes wake along the hull.',2400);if(skipped())return;
      el.classList.add('s2');sfx('rise');await w(900);if(skipped())return;
      el.classList.add('s3');await say('With a groan of timber, the wooden wings unfold.',2400);if(skipped())return;
      el.classList.add('s4');sfx('burst');await say('The ship lifts off the cliff and into the sea of cloud.',3200);
    };
    await Promise.race([steps(),done]);el.classList.add('out');await sleep(500);el.remove();
  }
};

/* ================= CLASS CHANGE ================= */
function promote(u,to){
  const from=u.cls;to=to||CLS[from].promo;const b=CLS[to].bonus.slice();
  /* a new movement type on promotion also brings its stat tilt (gains only) */
  if(from.startsWith('G.')&&to.startsWith('G.')){const s1=MOVES[from.split('.')[2]].st||[],s2=MOVES[to.split('.')[2]].st||[];b.forEach((v,i)=>b[i]=v+Math.max(0,(s2[i]||0)-(s1[i]||0)))}
  const old={lv:u.lv,cap:capOf(u)};ST.forEach(s=>old[s]=s==='hp'?u.maxhp:u[s]);
  const gift=CLS[to].gift&&u.items.length<5?CLS[to].gift:null;if(gift)u.items.push({k:gift,u:IT[gift].uses});
  if(u._nl){u.look=u._nl;delete u._nl}
  u.cls=to;u.lv=1;u.exp=0;u.cap=capOf(u)+PROMO_CAP;u.mov=CLS[to].mov;
  ST.forEach((s,i)=>{if(s==='hp'){u.maxhp+=b[i];u.hp+=b[i]}else u[s]+=b[i]});u.lck+=b[3];
  return{from,to,old,b,gift};
}
async function ascend(u,to){
  const wk=mapWk(u),before=fig(u.look,u.cls,'p','idle',wk),r=promote(u,to),after=fig(u.look,u.cls,'p','idle',wk),still=!settings.anim||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el=document.createElement('div');el.className='asc';
  const parts=Array.from({length:36},()=>`<i class="asc-p" style="left:${10+Math.random()*80}%;--x:${(Math.random()*60-30).toFixed(0)}px;--d:${(1.6+Math.random()*1.8).toFixed(2)}s;--dl:${(Math.random()*2).toFixed(2)}s"></i>`).join('');
  el.innerHTML=`<div class="asc-stage"><div class="asc-pillar"></div><div class="asc-ring"></div><div class="asc-ring r2"></div>${parts}<div class="asc-wave"></div><img class="asc-spr" src="${before}" alt=""></div>
   <div class="asc-txt"><div class="eyebrow">Ascension</div><h2>${u.name}</h2><p class="asc-cls"><span>${CLS[r.from].n}</span> → <b>${CLS[r.to].n}</b></p>${heroDef(u.id)?.ascend?`<p class="asc-why">${heroDef(u.id).ascend.replaceAll('{lord}',u.name)}</p>`:''}</div>
   <div class="asc-box" hidden><div class="lvl">${shown(u).map((s,i)=>`<div data-s="${s}"><span>${SL[s]}</span><span><b class="v">${r.old[s]}</b><em></em></span></div>`).join('')}</div>
   <p class="asc-cap">Skill capacity <b>${r.old.cap} → ${capOf(u)}</b> · Move <b>${u.mov}</b> · Wields <b>${CLS[u.cls].w.map(t=>TN[t]).join(', ')}</b>${r.gift?` · Gains a <b>${IT[r.gift].n}</b>`:''}</p>
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

