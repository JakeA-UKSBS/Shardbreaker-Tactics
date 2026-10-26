/* Unit cards, recruit node, battle rewards */
/* ---- UI ---- */
const uSpr=u=>sprite(u,'idle',mapWk(u));
/* skill capacity as a small pie: gold = used by learned skills, pale = what a skill on offer would take */
function capPie(u,add=0){const c=capOf(u),n=capUsed(u),a=Math.min(add,Math.max(0,c-n)),over=n+add>c;
  return`<span class="cap${over?' over':''}" title="Skill capacity: ${n} of ${c} used" style="--u:${n/c*100}%;--a:${(n+a)/c*100}%"></span><span class="capn">${n}${add?`+${add}`:''}/${c}</span>`}
function unitCard(u,on,add){
  const S=shown(u),w=u.items.map(i=>IT[i.k]).filter(i=>i.t!=='item'),ls=(u.skills||[]).map(x=>SKILLS[x.id].n);
  return`<div class="dimg"><img src="${uSpr(u)}" alt=""></div><div class="dtxt"><b>${u.name}</b><span class="dcls">${CLS[u.cls].n} · Lv ${u.lv}</span>
  <span class="dst">${S.map(k=>`${SL[k]} <b>${k==='hp'?(u.hp!=null&&u.hp<u.maxhp?`${u.hp}/${u.maxhp}`:u.maxhp):u[k]}</b>`).join(' ')}</span>
  <span class="dsk">${SKILLS[u.skill].n}${ls.length?', '+ls.join(', '):''} · ${w.map(i=>`<img src="${icon(i.key)}" alt="">${i.n}${i.r?` (Rng ${rngTxt(i.r)})`:''}`).join(' ')}</span></div><div class="dcap">${capPie(u,add)}</div>${on?'<span class="dtick">✓</span>':''}`;
}
const canReroll=()=>unl('reroll')&&!(run.rr=run.rr||{})[run.act||1];
async function recruitNode(){
  const lv=Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length))+(R('lantern')?1:0),mk=()=>Array.from({length:R('lantern')?4:3},()=>genUnit(lv));
  let opts=mk();const full=run.roster.length>=TEAM_CAP;
  for(;;){
    const m=await modal(`<div class="eyebrow">Recruit</div><h2>Someone wants to join</h2><p>${full?`Your squad is full (${TEAM_CAP}). Recruiting means letting someone go.`:'Pick one, or press on without them.'}</p>
      <div class="draft">${opts.map((u,i)=>`<button type="button" class="dcard" data-m="r${i}">${unitCard(u)}</button>`).join('')}</div>
      <div class="mbtns"><button type="button" data-m="skip">Skip</button>${canReroll()?'<button type="button" data-m="reroll">Reroll (once this act)</button>':''}</div>`);
    if(m==='skip')return;
    if(m==='reroll'){run.rr[run.act||1]=1;opts=mk();sfx('tick');continue}
    const nu=opts[+m.slice(1)];
    if(full){const d=await modal(`<h2>Who leaves?</h2><p>${nu.name} takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);
      if(d==='skip')return;run.roster.splice(+d.slice(1),1)}
    run.roster.push(nu);sfx('item');toast(`${nu.name} joins the squad`);return;
  }
}
/* slayer loot follows the region: the body tags of its monsters pick which slayer weapon or skill can drop */
const SLAYER_WPN={armoured:'warHammer',beast:'huntSpear',colossal:'giantslayer',spectral:'holySword'},SLAYER_SKILL={beast:'bladebane',armoured:'heavybane',spectral:'polebane'};
function regionTags(withBoss){const B=actBiome(),t=[];for(const[c,w]of[...B.pool,...B.elitePool])for(const g of tagsOf({cls:c}))for(let i=0;i<w;i++)t.push(g);if(withBoss)t.push('colossal','colossal');return t}
/* returns the item keys found after a win; winScreen offers each one with the Found picker.
   Includes chests nobody opened and anything that was left behind because a unit's bag was full (state.loot) */
function battleRewards(){
  const out=(state.loot||[]).slice(),add=k=>{if(!isWpn(k)||run.roster.some(u=>canUse(u,k)))out.push(k)};
  for(const[k,it]of Object.entries(CH[state.ch].gifts||{})){const[x,y]=k.split(',').map(Number);if(MAP[y]&&MAP[y][x]==='C'&&!state.visited.includes(k)){if(/^gold:/.test(it))out.gold=(out.gold||0)+ +it.slice(5);else if(it!=='pyrite')add(it)}}
  const elite=run.kind==='elite',rt=regionTags(elite);
  /* slayer weapon: 15% after a battle, 35% after an elite */
  if(rand()<(elite?.35:.15)){const ws=rt.filter(t=>SLAYER_WPN[t]);if(ws.length)add(SLAYER_WPN[pick(ws)])}
  /* skills: 40%; half the time it's the slayer skill for this region's monsters */
  if(rand()<.4){const ss=rt.filter(t=>SLAYER_SKILL[t]).map(t=>SLAYER_SKILL[t]).filter(k=>!run.roster.every(u=>has(u,k)));run.pendSkill=ss.length&&rand()<.5?pick(ss):pick(SKILL_POOL())}
  if(rand()<.5)add('qiPill');
  return out;
}


