/* Unit cards, recruit node, battle rewards */
/* ---- UI ---- */
const uSpr=u=>sprite(u,'idle',mapWk(u));
/* skill capacity as a small pie: gold = used by learned skills, pale = what a skill on offer would take */
function capPie(u,add=0){const c=capOf(u),n=capUsed(u),a=Math.min(add,Math.max(0,c-n)),over=n+add>c;
  return`<span class="cap${over?' over':''}" title="Skill capacity: ${n} of ${c} used${add?`, this skill takes ${add}`:''}" style="--u:${n/c*100}%;--a:${(n+a)/c*100}%"></span><span class="capn">${n}${add?`+${add}`:''}/${c}</span>`}
function unitCard(u,on,add,exp,nopie){
  const S=shown(u),w=u.items.map(i=>IT[i.k]).filter(i=>i.t!=='item'),ls=(u.skills||[]).map(x=>SKILLS[x.id].n);
  return`<div class="dimg"><img src="${uSpr(u)}" alt=""></div><div class="dtxt"><b>${u.name}</b><span class="dcls">${CLS[u.cls].n} · Lv ${u.lv}${exp?`<span class="dexp"><i style="width:${u.exp||0}%"></i></span>${u.exp||0}/100 EXP`:''}</span>
  <span class="dst">${S.map(k=>`${SL[k]} <b>${k==='hp'?(u.hp!=null&&u.hp<u.maxhp?`${u.hp}/${u.maxhp}`:u.maxhp):u[k]}</b>`).join(' ')}</span>
  <span class="dsk">${SKILLS[u.skill].n}${ls.length?', '+ls.join(', '):''} · ${w.map(i=>`<img src="${icon(i.key)}" alt="">${i.n}${i.r?` (Rng ${rngTxt(rngShow(u,i))})`:''}`).join(' ')}</span></div>${nopie?'':`<div class="dcap">${capPie(u,add)}</div>`}${on?'<span class="dtick">✓</span>':''}`;
}
const canReroll=()=>unl('reroll')&&!(run.rr=run.rr||{})[run.act||1];
/* the second Crossroads, as Act 2 begins: 2 already-advanced veterans wait by the fire and one joins */
async function actCrossroads(){
  /* as Act 3 begins: a relic instead (1 of 3, uncommon or rare) */
  if((run.act||1)>=3){await relicPick(3,['u','r'],'The last crossroads','The road to the Heart. Take one thing with you.');return}
  /* as Act 2 begins: 1 of 2 veterans. If the veterans have run out, anyone still unrecruited fills in */
  const where=castPool('act1').length>=2?'act1':'recruit';if(!castPool(where).length)return;const lv=Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length))+(R('lantern')?1:0);
  const pick=await musterScene(castOffer(2,lv,where),1,true),nu=pick&&pick[0];if(!nu)return;
  if(run.roster.length>=TEAM_CAP){const d=await modal(`<h2>Who leaves?</h2><p>Your squad is full (${TEAM_CAP}). ${nu.name} takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);
    if(d==='skip')return;run.roster.splice(+d.slice(1),1)}
  run.roster.push(nu);castJoined(nu);sfx('item');toast(`${nu.name} joins the squad`);
}
async function recruitNode(where='recruit'){
  const lv=Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length))+(R('lantern')?1:0),mk=()=>castOffer(where==='act1'?2:R('lantern')?4:3,lv,where);if(where==='act1'&&!castPool('act1').length)return;
  let opts=mk();const full=run.roster.length>=TEAM_CAP;
  for(;;){
    const m=await modal(`<div class="eyebrow">${where==='act1'?`Act ${run.act||1}`:'Recruit'}</div><h2>${where==='act1'?'Veterans of the road want to join':'Someone wants to join'}</h2><p>${full?`Your squad is full (${TEAM_CAP}). Recruiting means letting someone go.`:'Pick one, or press on without them.'}</p>
      <div class="draft">${opts.map((u,i)=>`<button type="button" class="dcard" data-m="r${i}">${unitCard(u)}</button>`).join('')}</div>
      <div class="mbtns"><button type="button" data-m="skip">Skip</button>${where!=='act1'&&canReroll()?'<button type="button" data-m="reroll">Reroll (once this act)</button>':''}</div>`);
    if(m==='skip')return;
    if(m==='reroll'){run.rr[run.act||1]=1;opts=mk();sfx('tick');continue}
    const nu=opts[+m.slice(1)];
    if(full){const d=await modal(`<h2>Who leaves?</h2><p>${nu.name} takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);
      if(d==='skip')return;run.roster.splice(+d.slice(1),1)}
    run.roster.push(nu);castJoined(nu);sfx('item');toast(`${nu.name} joins the squad`);return;
  }
}
/* slayer loot follows the region: the body tags of its monsters pick which slayer weapon or skill can drop */
const SLAYER_WPN={armoured:'warHammer',beast:'huntingSpear',colossal:'giantslayer',spectral:'holySword'},SLAYER_SKILL={beast:'wolfsbane',armoured:'stonebane',spectral:'spiritbane'};
function regionTags(withBoss){const B=actBiome(),t=[];for(const[c,w]of[...B.pool,...B.elitePool])for(const g of tagsOf({cls:c}))for(let i=0;i<w;i++)t.push(g);if(withBoss)t.push('colossal','colossal');return t}
/* returns the item keys found after a win; winScreen offers each one with the Found picker.
   Includes anything that was left behind because a unit's bag was full (state.loot) */
function battleRewards(){
  const out=(state.loot||[]).slice();if(state.gold)out.gold=state.gold;const add=k=>{if(!isWpn(k)||run.roster.some(u=>canUse(u,k))&&!squadHas(k)&&!out.includes(k))out.push(k)};
  const elite=run.kind==='elite',rt=regionTags(elite);
  /* slayer weapon: 15% after a battle, 35% after an elite */
  if(rand()<(elite?.35:.15)){const ws=rt.filter(t=>SLAYER_WPN[t]);if(ws.length)add(SLAYER_WPN[pick(ws)])}
  /* skills are rare: 10% after a battle, 40% after an elite; half the time it's the slayer skill for this region's monsters */
  if(rand()<(elite?.4:.1)){const ss=rt.filter(t=>SLAYER_SKILL[t]).map(t=>SLAYER_SKILL[t]).filter(k=>!run.roster.every(u=>has(u,k)));run.pendSkill=ss.length&&rand()<.5?pick(ss):pick(SKILL_POOL())}
  if(rand()<.5)add('salve');
  return out;
}


