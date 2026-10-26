/* Board rendering, unit cards and the unit sheet */
/* ================= RENDER ================= */

/* ==================================================================
   THE BOARD: tiles and unit elements
   ================================================================== */
const uEls={};
function buildBoard(){
  boardEl.innerHTML='';for(const id in uEls)delete uEls[id];
  const c=CH[state.ch];boardEl.classList.toggle('bright',!!c.bright);boardEl.style.background=MAP.some(r=>r.includes('~'))?'linear-gradient(#26304a,#56668c 55%,#8e9ab8)':'';
  if(MAP.some(r=>/[dMhH]/.test(r))){const im=document.createElement('img');im.className='underlay';im.alt='';im.src=shipArt(!!c.wreck);im.style.width=MW*T+'px';im.style.height=MH*T+'px';boardEl.appendChild(im)}
  boardEl.style.gridTemplateColumns=`repeat(${MW},${T}px)`;boardEl.style.width=MW*T+'px';boardEl.style.height=MH*T+'px';
  /* boulders and features (hills, chests, houses, shrines, tents, crags, trees) sit on the map's usual ground */const gc={};for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=ter(x,y);if(t.c<99&&!OVER_T.includes(t.k))gc[t.k]=(gc[t.k]||0)+1}const gk=Object.keys(gc).sort((a,b)=>gc[b]-gc[a])[0]||'plain';
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=document.createElement('div'),tk=ter(x,y).k;const vol=CH[state.ch]&&CH[state.ch].biome==='mountain',ov=tk==='hill'&&vol?'crag':tk;
    t.className=tk==='boulder'?'tile t-'+gk+' boulder':OVER_T.includes(ov)&&gk!=='plain'?`tile t-${gk} ov ov-${ov}`:'tile t-'+tk;t.dataset.k=key(x,y);boardEl.appendChild(t)}
}
function threatMap(){const m=new Map();for(const e of state.units.filter(u=>u.team==='e'&&u.hp>0&&!u.recruit)){const ms=reach(e),all=new Set([...ms,...fringeOf(e,ms)]);for(const k of all){if(!m.has(k))m.set(k,[]);m.get(k).push(e.id)}}return m}
function threatLine(k){const ids=danger&&threatMap().get(k);if(!ids||!ids.length)return danger?'<p class="hint">No enemy can reach this tile next turn.</p>':'';return`<p class="hint" style="color:#f0a08a">In reach of ${ids.length} enem${ids.length>1?'ies':'y'}: <b>${ids.map(i=>byId(i).name).join(', ')}</b> (ringed in red).</p>`}
/* 2x2 bosses: scale the art so the creature itself fills its whole 2x2 footprint (art has empty margins) */
const FILLS={};
function fillBox(img,src,flip){const go=f=>{if(img.dataset.s!==src)return;img.style.transformOrigin=`${f.cx}% ${f.by}%`;img.style.transform=`translate(${50-f.cx}%,${100-f.by}%) scale(${f.k*(flip?-1:1)},${f.k})`};
  if(FILLS[src])return go(FILLS[src]);const im=new Image();im.onload=()=>{const W=im.width,H=im.height,cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');cx.drawImage(im,0,0);const d=cx.getImageData(0,0,W,H).data;
    let x0=W,x1=0,y0=H,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>0){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
    if(x1<x0)return;const bw=(x1-x0+1)/W,bh=(y1-y0+1)/H,k=Math.min(1/bw,1/bh,1.7)*.96;FILLS[src]={k,cx:(x0+x1+1)/2/W*100,by:(y1+1)/H*100};go(FILLS[src])};im.src=src}

/* ==================================================================
   RENDER: tiles, units (sprites, HP bars, type badges, deaths), top bar, then the panel
   ================================================================== */
function render(){
  const dg=danger&&phase==='player'?threatMap():new Map();
  const tk=danger&&phase==='player'?(ui==='terrain'?threatTile:(sel&&(ui==='menu'||ui==='target'||ui==='confirm'||ui==='items'))?key(byId(sel).x,byId(sel).y):null):null,thr=new Set(tk&&dg.get(tk)||[]);
  const tset=new Set(targets.flatMap(u=>cellsOf(u.x,u.y,u.sz||1).map(c=>key(...c)))),su=sel&&byId(sel),healer=su&&staffIdx(su)>=0&&!atkTargets(su).length&&eqIdx(su)<0;
  boardEl.querySelectorAll('.tile').forEach(t=>{
    const k=t.dataset.k;t.classList.remove('mv','atk','hl','dg','tg','cur');
    if(dg.has(k))t.classList.add('dg');
    if(state.visited.includes(k))t.classList.add('vis');
    t.classList.toggle('trap',!!(state.sprung&&state.sprung.includes(k)));
    if((ui==='move'||(ui==='idle'&&inspect))&&moveSet){if(moveSet.has(k))t.classList.add('mv');else if(fringe.has(k))t.classList.add(healer?'hl':'atk')}
    if((ui==='target'||ui==='confirm')&&tset.has(k))t.classList.add(tmode==='heal'?'hl':'atk','tg');
    if(pending&&cellsOf(pending.x,pending.y,pending.sz||1).some(c=>key(...c)===k))t.classList.add('cur');
    if(ui==='terrain'&&k===threatTile)t.classList.add('cur');
  });
  const live=new Set();
  for(const u of state.units){
    live.add(u.id);let el=uEls[u.id];
    if(!el){el=document.createElement('div');el.innerHTML='<img alt=""><div class="hpb"><i></i></div>';boardEl.appendChild(el);uEls[u.id]=el}
    el.className='unit '+u.team+(u.summon?' sum':'')+(u.stone?' stone':'')+(u.psn?' psn':'')+(u.boss?' boss':'')+(u.look&&u.look.magma?' magma':'')+(u.look&&u.look.spirit?' spirit':'')+(u.acted&&u.team==='p'?' done':'')+(thr.has(u.id)?' threat':'');
    el.style.left=u.x*T+'px';el.style.top=u.y*T+'px';{const w=(u.sz||1)*T+'px';if(el.style.width!==w){el.style.width=el.style.height=w;el.firstChild.style.width=el.firstChild.style.height=w}}
    if(u.hp<=0&&!el.dataset.dead&&el.isConnected&&el.style.opacity!==''){el.dataset.dead=1;dieFx(el,boardEl,(u.x+(u.sz||1)/2)*T,(u.y+(u.sz||1)/2)*T,u,1,settings.anim)}else if(u.hp>0)delete el.dataset.dead;
    el.style.opacity=u.hp>0?1:0;
    const src=sprite(u,'idle',mapWk(u)),img=el.firstChild;if(img.dataset.s!==src){img.src=src;img.dataset.s=src;img.style.transform='';img.style.transformOrigin='';if(u.sz>1&&src.startsWith('data:'))fillBox(img,src,u.team==='e')}img.classList.toggle('hi',isHi(u.cls,u.sz));
    el.querySelector('.hpb i').style.width=(u.hp/u.maxhp*100)+'%';
  }
  for(const id in uEls)if(!live.has(id)){uEls[id].remove();delete uEls[id]}
  $('#turn').textContent=`Floor ${run?run.n:1} · Turn ${state.turn}`+(phase==='enemy'?' · Enemy':'');
  $('#obj').innerHTML=`<div><b>Goal</b>${goalShort()}</div><div><b>Lose</b>${loseText()}</div>`;
  const idle=phase==='player'&&!busy&&!over;
  $('#btnRewind').hidden=!rwOn();$('#btnRewind').textContent='Rewind '+rewinds;$('#btnRewind').disabled=!(idle&&rewinds>0&&history.length);
  $('#btnEnd').disabled=!idle;
  $('#btnEnd').classList.toggle('pulse',idle&&state.units.filter(u=>u.team==='p').every(u=>u.acted));
  $('#btnDanger').classList.toggle('on',danger);
  $('#btnDev').hidden=!settings.dev;
  renderPanel();
}

/* ==================================================================
   UNIT CARD AND ITEM LIST: shared bits of the side panel
   ================================================================== */
function terrText(t){return t.n+(t.df?` +${t.df} Def`:'')+(t.av?` ${t.av>0?'+':''}${t.av} Avo`:'')+(t.slow?' · −1 Move':'')}
function statBox(l,v){return`<div><small>${l}</small>${v}</div>`}
function itemRows(u,btn){
  const ei=eqIdx(u);
  return`<div class="inv">${u.items.map((it,i)=>{const w=IT[it.k],tag=btn?'button':'div';
    return`<${tag} class="it${i===ei?' eqd':''}${btn&&itemSel===i?' sel':''}"${btn?` data-act="item:${i}" type="button"`:''}><img src="${icon(it.k)}" alt="">${w.n}${it.d?' <em>drops</em>':''}<span class="u">${[w.r&&w.t!=='item'?`Rng ${rngTxt(w.r)}`:'',endless(it.k)?'':`${it.u}/${w.uses}`].filter(Boolean).join(' · ')}</span></${tag}>`}).join('')||'<p class="skd">No items.</p>'}</div>`;
}
function card(u){
  const ei=eqIdx(u),si=staffIdx(u),wi=ei>=0?ei:si,w=wi>=0?IT[u.items[wi].k]:null,sk=u.skill&&SKILLS[u.skill],t=ter(u.x,u.y);
  let h=`<div class="uc ${u.team}"><img class="por" src="${portrait(u)}" alt=""><div class="uci">
   <div class="ch"><b>${u.name}</b><span>${CLS[u.cls].n} · Lv ${u.lv}</span></div>
   <div class="hp"><span class="bar"><i style="width:${u.hp/u.maxhp*100}%"></i></span><span>${u.hp}/${u.maxhp} HP</span></div>
   ${u.team==='p'?`<div class="xp"><span class="bar"><i style="width:${u.exp}%"></i></span><span>${u.exp} EXP</span></div>`:''}
   <div class="eq">${w?`<img src="${icon(w.key)}" alt="">${w.n} (Rng ${rngTxt(w.r)})`:'Unarmed'}${sk?` · <b class="sk">${sk.n}</b>`:''} · ${terrText(t)}${u.psn?` · <b class="psnt">Poisoned (${u.psn})</b>`:''}${(()=>{const g=gearOf(u),t=Object.entries(g).filter(([,v])=>v).map(([k,v])=>`${v>0?'+':''}${v} ${GEAR_N[k]}`);return t.length?` · Gear ${t.join(', ')}`:''})()}</div>
   ${u.recruit?`<div class="eq sk">Can be recruited: move ${lordName()} next to ${u.name} and Talk.</div>`:''}
  </div><button class="mini" type="button" data-act="sheet:${u.id}">Details</button></div>`;
  return h;
}

/* ---- unit sheet (two pages, cycles through the same team) ---- */
const TN={blade:'Blade',heavy:'Heavy',pole:'Polearm',bow:'Bow',reach:'Reach',art:'Sigil',spirit:'Charm',item:'Item'};
let sheetU=null,sheetPg=0,sheetIt=null,sheetRm=null;

/* ==================================================================
   UNIT SHEET: the full stats pop-up (Personal / Items or Stats tabs)
   ================================================================== */
function sheetEl(){
  let el=$('#sheet');if(el)return el;
  el=document.createElement('div');el.id='sheet';el.className='sheet';el.hidden=true;document.body.appendChild(el);
  let sx=null,sy=0,swiped=false;
  el.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;swiped=false});
  el.addEventListener('pointerup',e=>{if(sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){swiped=true;cycleSheet(dx<0?1:-1)}});
  el.addEventListener('click',e=>{if(swiped){swiped=false;return}const b=e.target.closest('[data-s]');if(!b){if(e.target===el)closeSheet();return}
    const a=b.dataset.s;
    if(a==='x')closeSheet();
    else if(a==='chart')effChart();
    else if(a==='prev'||a==='next')cycleSheet(a==='next'?1:-1);
    else if(a==='p0'||a==='p1'){sheetPg=+a[1];sheetIt=null;sfx('tick');drawSheet()}
    else if(a[0]==='i'){const i=+a.slice(1);sheetIt=sheetIt===i?null:i;drawSheet()}
    else if(a.startsWith('rm')){const i=+a.slice(2),u=byId(sheetU);if(sheetRm===i){u.skills.splice(i,1);sheetRm=null;sfx('broke');saveGame()}else sheetRm=i;drawSheet()}});
  document.addEventListener('keydown',e=>{if(el.hidden)return;if(e.key==='Escape')closeSheet();else if(e.key==='ArrowRight')cycleSheet(1);else if(e.key==='ArrowLeft')cycleSheet(-1)});
  return el;
}
function sheetList(u){return state.units.filter(o=>o.team===u.team&&o.hp>0)}
function openSheet(u){if(!u)return;sheetU=u.id;sheetPg=0;sheetIt=null;sheetRm=null;sfx('select');drawSheet();sheetEl().hidden=false}
function closeSheet(){sheetEl().hidden=true;sheetU=null}
function cycleSheet(d){const u=byId(sheetU);if(!u)return;const L=sheetList(u);if(L.length<2)return;sheetU=L[(L.indexOf(u)+d+L.length)%L.length].id;sheetIt=null;sheetRm=null;sfx('tick');drawSheet()}
function skillBlock(u){
  const row=(id,tag,dim)=>`<div class="skr${dim?' dim':''}"><b>${SKILLS[id].n}</b><span class="tag">${tag}</span><small>${SKILLS[id].d}</small></div>`;
  let rows=u.skill?row(u.skill,'Personal'):'';
  (u.skills||[]).forEach((x,i)=>{rows+=row(x.id,x.src==='lv10'?'Lv 10':`${SKILLS[x.id].cost}${u.team==='p'?` <button type="button" class="${sheetRm===i?'warn':''}" data-s="rm${i}">${sheetRm===i?'Remove? Scroll is lost':'Remove'}</button>`:''}`)});
  const h=u.team==='p'&&heroDef(u.id);if(h&&h.lv10&&!has(u,h.lv10)&&!CLS[u.cls].tier)rows+=row(h.lv10,`Learns at Lv ${PROMO_LV}`,true);
  const cap=u.team==='p'?`<span class="capn">Capacity ${capUsed(u)}/${capOf(u)}</span>`:'';
  return`<div class="sskill"><div class="skh"><span class="sl">Skills</span>${cap}</div>${u.team==='p'?`<div class="capbar"><i style="width:${capUsed(u)/capOf(u)*100}%"></i></div>`:''}<div class="skl">${rows||'<small class="capn">None</small>'}</div></div>`;
}
function rngTxt(r){return r[0]===r[1]?r[0]:r[0]+'–'+r[1]}
const BRKN={blade:'claws, fangs and blades',heavy:'slams, axes and heavy blows',art:'sigils and magic',pole:'polearms'};
function itemInfo(u,k){
  const x=IT[k];
  if(x.t==="item")return`<b>${x.n}</b> · Restores ${salveAmt(k)} HP and cures poison. Usable on the map between fights too.`;
  if(x.t==='gear')return`<b>${x.n}</b> · Gear · ${gearText(x)} while carried. Can be traded.`;
  if(x.t==='scroll'){const sk=SKILLS[x.skill];return`<b>${x.n}</b> · Teaches ${sk.n} (cost ${sk.cost}). ${sk.d} Use it from the Items menu.`}
  if(x.t==='crest')return`<b>${x.n}</b> · Lets a unit at Lv ${PROMO_LV}+ ascend to a stronger class, with +${PROMO_CAP} skill capacity.`;
  if(x.t==='spirit')return`<b>${x.n}</b> · ${TN.spirit} · Heals ${x.amt} HP · Rng ${rngTxt(x.r)}`+(canUse(u,k)?'':` · ${u.name} can't use this.`);
  return`<b>${x.n}</b> · ${TN[x.t]}${x.el?' · '+ELN[x.el]:''} · Mt ${x.mt} · Hit ${x.hit} · Crit ${x.crit||0} · Wt ${x.wt||0} · Rng ${rngTxt(x.r)}${x.brk?` · +50 Hit and Avoid against ${BRKN[x.brk]}`:''}${x.wt&&u.str!=null&&wtOver(u,x)?` · ${u.name} loses ${wtOver(u,x)} Spd`:''}${x.mag?' · Uses Mag':''}${x.thrown?' · Thrown':''}${effOf(x).length?` · <span class="effv">Effective vs ${effOf(x).map(t=>TAGS[t].n).join(', ')}</span>`:''}`+(canUse(u,k)?'':` · ${u.name} can't wield this.`);
}
function drawSheet(){
  const u=byId(sheetU),el=sheetEl();if(!u){closeSheet();return}
  const L=sheetList(u),idx=L.indexOf(u)+1,ei=eqIdx(u),w=ei>=0?IT[u.items[ei].k]:null,sk=u.skill&&SKILLS[u.skill],t=ter(u.x,u.y);
  const bar=(l,v)=>`<div class="srow"><span class="sl">${l}</span><span class="sbar"><i style="width:${Math.min(100,v/30*100)}%"></i></span><b>${v}</b></div>`;
  const wt=CLS[u.cls].w.map(tp=>{const k=Object.keys(IT).find(k=>IT[k].t===tp);return`<span class="wt">${k?`<img src="${icon(k)}" alt="">`:''}${TN[tp]}</span>`}).join('');
  let pg;
  if(sheetPg===0){
    pg=`<div class="sgrid">${shown(u).filter(s=>s!=='hp').map(s=>bar(SL[s],u[s])).join('')}</div>
    <div class="sinfo"><div><span class="sl">Move</span><b>${u.mov}</b></div><div><span class="sl">Terrain</span><b>${terrText(t)}</b></div><div class="wide"><span class="sl">Weapons</span><span class="wts">${wt}</span></div></div>
    ${skillBlock(u)}
    ${u.recruit?`<p class="srec">Can be recruited: move ${lordName()} next to ${u.name} and Talk.</p>`:''}`;
  }else{
    const atk=w?(w.mag?u.mag:u.str)+w.mt:'–',hit=w?w.hit+u.lck*2:'–',crit=w?(w.crit||0)+(CLS[u.cls].crit||0)+Math.floor(u.lck/2):'–';
    pg=`<div class="scmb">${[['Atk',atk],['Hit',hit],['Crit',crit],['Avo',AS(u,w)*2+u.lck],['AS',AS(u,w)],['Rng',w?rngTxt(w.r):'–']].map(([l,v])=>`<div><span class="sl">${l}</span><b>${v}</b></div>`).join('')}</div>
    <div class="sitems">${u.items.map((it,i)=>{const x=IT[it.k];return`<button type="button" class="srit${i===ei?' eqd':''}${sheetIt===i?' sel':''}${isWpn(it.k)&&!canUse(u,it.k)?' no':''}" data-s="i${i}"><span class="e">${i===ei?'E':''}</span><img src="${icon(it.k)}" alt="">${x.n}${it.d?' <em>drops</em>':''}<span class="u">${[x.r&&x.t!=='item'?`Rng ${rngTxt(x.r)}`:'',endless(it.k)?'':`${it.u}/${x.uses}`].filter(Boolean).join(' · ')}</span></button>`}).join('')||'<p class="sid">No items.</p>'}</div>
    ${sheetIt!=null&&u.items[sheetIt]?`<p class="sid">${itemInfo(u,u.items[sheetIt].k)}</p>`:(isHi(u.cls,u.sz)||u.team==='p'?'<p class="sid dim">Tap an item to see its stats. E marks the equipped weapon.</p>':'<p class="sid dim">Tap an attack to see its stats.</p>')}`;
  }
  const dis=L.length<2?' disabled':'';
  el.innerHTML=`<div class="sbx ${u.team}" role="dialog" aria-label="${u.name} details">
   <div class="snav"><button type="button" data-s="prev" aria-label="Previous unit"${dis}>◀</button><span>${{p:'Allies',e:'Enemies',g:'Others'}[u.team]} · ${idx}/${L.length}</span><button type="button" data-s="next" aria-label="Next unit"${dis}>▶</button><button type="button" class="sx" data-s="x" aria-label="Close">✕</button></div>
   <div class="shd"><img src="${portrait(u)}" alt=""><div class="shi"><b class="sn">${u.name}</b><span class="sc">${CLS[u.cls].n}${u.boss?' <em>Boss</em>':''}</span>${tagsOf(u).length?`<button type="button" class="stags" data-s="chart" aria-label="Effective damage chart">${tagsOf(u).map(t=>`<img src="${tagArt(t)}" alt="">${TAGS[t].n}`).join(' · ')}</button>`:''}<span class="slv">Lv ${u.lv}${u.team==='p'?` · ${u.exp} EXP`:''}</span><div class="hp"><span class="bar"><i style="width:${u.hp/u.maxhp*100}%"></i></span><span>${u.hp}/${u.maxhp} HP</span></div></div></div>
   <div class="stabs"><button type="button" data-s="p0" class="${sheetPg===0?'cur':''}">Personal</button><button type="button" data-s="p1" class="${sheetPg===1?'cur':''}">${isHi(u.cls,u.sz)||u.team==='p'?'Items':'Stats'}</button></div>
   <div class="spg">${pg}</div></div>`;
}

/* ==================================================================
   SIDE PANEL AND FLOATING MENUS: what the panel shows in each ui state, plus the
   command menu and the forecast pop-out that float beside units on the board
   ================================================================== */
function renderPanel(){
  let h='',fm='';const u=sel&&byId(sel);
  if(over)h=`<p class="hint">${over==='win'?'Chapter cleared.':'The run has ended.'}</p>`;
  else if(phase==='enemy')h='<p class="hint">The enemy is moving…</p>';
  else if(ui==='move')h=card(u)+`<p class="hint">Tap a blue tile to move, or a red enemy to attack it from the best tile. Tap ${u.name} to act in place.</p><div class="acts"><button type="button" data-act="cancel">Cancel</button></div>`;
  else if(ui==='menu'){
    const at=atkTargets(u).length,ht=healTargets(u).length,gf=giftHere(u),tk=talkTarget(u);
    h=card(u)+threatLine(key(u.x,u.y));fm=`<div class="acts">${tk?'<button class="go" type="button" data-act="talk">Talk</button>':''}${at?'<button class="go" type="button" data-act="attack">Attack</button>':''}${ht?'<button class="go" type="button" data-act="heal">Heal</button>':''}${gf?`<button class="go" type="button" data-act="gift">${gf.kind}</button>`:''}${canSummon(u)?`<button class="go" type="button" data-act="summon">Summon ${famOf(u).n}</button>`:''}<button type="button" data-act="items">Items</button>${tradeMates(u).length?'<button type="button" data-act="trade">Trade</button>':''}<button type="button" data-act="wait">Wait</button><button type="button" data-act="cancel">Back</button></div>`;
  }
  else if(ui==='items'){
    const it=itemSel!=null?u.items[itemSel]:null;let ops='';
    if(it){if(isWpn(it.k)&&canUse(u,it.k)&&itemSel!==eqIdx(u))ops+='<button class="go" type="button" data-act="equip">Equip</button>';if(IT[it.k].t==='item'&&(u.hp<u.maxhp||u.psn))ops+='<button class="go" type="button" data-act="use">Use</button>';if(IT[it.k].t==='scroll'){const r=learnBlock(u,IT[it.k].skill);ops+=r?`<span class="hint">${r}</span>`:`<button class="go" type="button" data-act="learn">Learn ${SKILLS[IT[it.k].skill].n} (${SKILLS[IT[it.k].skill].cost})</button>`}if(IT[it.k].t==='crest'){const r=promoBlock(u);ops+=r?`<span class="hint">${r}</span>`:`<button class="go" type="button" data-act="ascend">Ascend…</button>`}if(isWpn(it.k)&&!canUse(u,it.k))ops+=`<span class="hint">${u.name} can't wield this.</span>`}
    h=`<div class="ch"><b>${u.name}</b><span>Items · ${u.hp}/${u.maxhp} HP</span></div>`+itemRows(u,true)+`<div class="acts">${ops}<button type="button" data-act="menu">Back</button></div>`;
  }
  else if(ui==='target'){const gf=giftHere(u),tk=talkTarget(u),sw=tmode==='atk'?(healTargets(u).length?'<button class="go" type="button" data-act="heal">Heal</button>':''):(atkTargets(u).length?'<button class="go" type="button" data-act="attack">Attack</button>':'');h=card(u)+`<p class="hint">Tap a highlighted ${tmode==='heal'?'ally to heal':'enemy to see the forecast'}, then tap it again to ${tmode==='heal'?'heal':'attack'}.</p>`;fm=`<div class="acts">${sw}${tk?'<button class="go" type="button" data-act="talk">Talk</button>':''}${gf?`<button class="go" type="button" data-act="gift">${gf.kind}</button>`:''}${canSummon(u)?`<button class="go" type="button" data-act="summon">Summon ${famOf(u).n}</button>`:''}<button type="button" data-act="items">Items</button>${tradeMates(u).length?'<button type="button" data-act="trade">Trade</button>':''}<button type="button" data-act="wait">Wait</button><button type="button" data-act="menu">Back</button></div>`}
  else if(ui==='confirm'){
    if(tmode==='heal'){const si=spiritFor(u,pending),w=IT[u.items[si].k],amt=Math.min(w.amt,pending.maxhp-pending.hp);
      h=`<div class="wsel"><img src="${icon(w.key)}" alt="">${w.n}</div><p class="hint">Heal <b>${pending.name}</b>: ${pending.hp} → ${pending.hp+amt} HP. Tap ${pending.name} again or press Heal.</p><div class="acts"><button class="go" type="button" data-act="doheal">Heal</button><button type="button" data-act="back">Back</button></div>`}
    else{
      const f=forecast(u,pendW,pending),A=f.A,D=f.D,list=wpnsAt(u,f.dist);
      const aft=(hp,s)=>Math.max(0,hp-(s?s.dmg*s.n:0)),effT=tagsOf(pending).filter(t=>effOf(f.aw).includes(t)||Object.entries(SLAYER).some(([k,v])=>v===t&&has(u,k))||(t==='spectral'&&/Paladin/.test(CLS[u.cls].n)));
      /* the forecast pops out on the board next to the fight; the panel keeps the attacker's card */
      h=card(u)+`<p class="hint">Attack ${pending.name}? Tap it again, or press Attack.</p>`;
      fm=`<div class="ufc-h"><span class="pc">${u.name}</span>${list.length>1?'<button class="mini" type="button" data-act="wprev" aria-label="Previous weapon">◀</button>':''}<img src="${icon(f.aw.key)}" alt="" title="${f.aw.n}">${list.length>1?'<button class="mini" type="button" data-act="wnext" aria-label="Next weapon">▶</button>':''}<span class="ec">${pending.name}</span></div>
      <div class="ufc-w">${f.aw.n}<button class="mini" type="button" data-act="chart" aria-label="Effective damage chart">?</button></div>
      <div class="ufc-g"><b>${u.hp}→${aft(u.hp,D)}</b><i>HP</i><b>${pending.hp}→${aft(pending.hp,A)}</b><b>${A.dmg}${A.n>1?' ×2':''}</b><i>DMG</i><b>${D?D.dmg+(D.n>1?' ×2':''):'–'}</b><b>${A.hit}%</b><i>HIT</i><b>${D?D.hit+'%':'–'}</b><b>${A.crit}%</b><i>CRT</i><b>${D?D.crit+'%':'–'}</b></div>
      ${A.eff?`<button type="button" class="effl" data-act="chart">${effT.map(t=>`<img src="${tagArt(t)}" alt="">`).join('')}Effective ×${A.eff}</button>`:''}
      <div class="ufc-b"><button class="go" type="button" data-act="attack-go">Attack</button><button type="button" data-act="back">Back</button></div>`;
    }
  }
  else if(inspect)h=card(inspect)+(inspect.team==='e'?'<p class="hint">Red tiles show where it can strike next turn.</p>':'');
  else if(ui==='terrain')h=terInfo;
  else h=`<p class="hint"><b>${CH[state.ch].title}.</b> Tap a blue unit to move it. Drag to pan the map, pinch to zoom.</p>`;
  panel.innerHTML=h;
  /* the command menu floats beside the unit on the board, FE-style */
  let mEl=$('#umenu');if(!mEl||!mEl.isConnected){mEl=document.createElement('div');mEl.id='umenu';mEl.className='umenu';boardEl.appendChild(mEl);
    for(const ev of['pointerdown','pointerup','wheel'])mEl.addEventListener(ev,e=>e.stopPropagation());mEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||busy)return;act(b.dataset.act)})}
  const pop=ui==='confirm'&&tmode==='atk'&&pending;mEl.classList.toggle('ufc',!!pop);
  if(fm&&pop){mEl.innerHTML=fm;mEl.hidden=false;const w=mEl.offsetWidth,hh=mEl.offsetHeight,P=pending,np=P.sz||1,avoid=[u,P];
    /* beside the target, on the side that covers neither fighter and stays on the map */
    const cl=(l,t)=>[Math.max(0,Math.min(l,MW*T-w)),Math.max(0,Math.min(t,MH*T-hh))];
    const spots=[cl((P.x+np)*T+6,P.y*T-20),cl(P.x*T-6-w,P.y*T-20),cl(P.x*T-w/2+T/2,P.y*T-hh-6),cl(P.x*T-w/2+T/2,(P.y+np)*T+6)];
    const hits=([l,t])=>avoid.filter(o=>o.x*T<l+w&&(o.x+(o.sz||1))*T>l&&o.y*T<t+hh&&(o.y+(o.sz||1))*T>t).length;
    const sp=spots.slice().sort((a,b)=>hits(a)-hits(b))[0];mEl.style.left=sp[0]+'px';mEl.style.top=sp[1]+'px'}
  else if(fm&&u){mEl.innerHTML=fm;mEl.hidden=false;const w=mEl.offsetWidth,hh=mEl.offsetHeight,n=u.sz||1,top=Math.max(0,Math.min(u.y*T-8,MH*T-hh));
    /* beside the unit, on whichever side doesn't cover a target or run off the map */
    const spots=[[(u.x+n)*T+6,top],[u.x*T-6-w,top],[(u.x+n)*T+6,(u.y+n)*T+4],[u.x*T-6-w,(u.y+n)*T+4]].filter(([l,t])=>l>=0&&l+w<=MW*T&&t+hh<=MH*T+40);
    const clear=([l,t])=>!(ui==='target'||ui==='confirm')||!targets.some(o=>o.x*T<l+w&&(o.x+(o.sz||1))*T>l&&o.y*T<t+hh&&(o.y+(o.sz||1))*T>t);
    const sp=spots.find(clear)||spots[0]||[(u.x+n)*T+6,top];mEl.style.left=sp[0]+'px';mEl.style.top=sp[1]+'px'}else mEl.hidden=true;
}
panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||busy)return;act(b.dataset.act)});

