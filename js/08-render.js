/* bosses with health bars (the Crystal Heart): HP split into equal bars, each its own colour; the crystal starts blue, turns purple, and ends red on its last bar */
const BAR_COL=[null,'#ff4d5e','#b46cff','#bfe6ff'],BAR_HF=[null,'','hue-rotate(-80deg)','hue-rotate(-160deg) saturate(.6) brightness(1.25)'];
function barsOf(u){if(!u.bars)return null;const per=u.maxhp/u.bars,n=Math.max(0,Math.ceil(u.hp/per));return{n,frac:n?(u.hp-(n-1)*per)/per:0}}
/* Board rendering, unit cards and the unit sheet */
/* ================= RENDER ================= */

/* ==================================================================
   THE BOARD: tiles and unit elements
   ================================================================== */
const uEls={};
function buildBoard(){
  boardEl.innerHTML='';for(const id in uEls)delete uEls[id];
  boardEl.style.background=MAP.some(r=>r.includes('~'))?'linear-gradient(#26304a,#56668c 55%,#8e9ab8)':'';
  /* isometric: each tile is its square art mapped onto a diamond (the top face), over a block of side faces down to the ground */
  const mx=Math.max(0,...MAP.flatMap((r,y)=>[...r].map((_,x)=>vhOf(x,y))));
  OX=MH*TW/2;OY=56+mx*HS;BW=(MW+MH)*TW/2;BH=OY+(MW+MH)*TH/2+HS+12;
  boardEl.classList.add('iso');boardEl.style.gridTemplateColumns='';boardEl.style.width=BW+'px';boardEl.style.height=BH+'px';
  /* features (trees, rocks, gems...) stand up as props (16b-terrain3d.js) on the map's usual ground */const gc={};for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=ter(x,y);if(t.c<99&&!OVER_T.includes(t.k)&&!PROPS[t.k])gc[t.k]=(gc[t.k]||0)+1}const gk=Object.keys(gc).sort((a,b)=>gc[b]-gc[a])[0]||'plain';
  const firstOf={};
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=document.createElement('div'),tk=ter(x,y).k;const vol=BATTLE&&BATTLE.biome==='mountain',ov=tk==='hill'&&vol?'crag':tk;
    t.className=PROPS[ov]?'tile '+propGround(ov,gk):'tile t-'+tk;t.dataset.k=key(x,y);
    if(!PROPS[ov]){const v=tileVariant(tk,x,y);if(v)t.style.backgroundImage=`url(${v})`}
    const vh=vhOf(x,y),p=tileTop(x,y,vh),z=(x+y)*4;
    Object.assign(t.style,{left:p.x+'px',top:p.y+'px',zIndex:z+1,transform:`matrix(${TW/2/T},${TH/2/T},${-TW/2/T},${TH/2/T},0,0)`});
    const D=(vh+1)*HS,sd=document.createElement('div'),sk=t.className.split(' ')[1];sd.className='blk';sd.dataset.t=sk;
    Object.assign(sd.style,{left:p.x-TW/2+'px',top:p.y+'px',width:TW+'px',height:TH+D+'px',zIndex:z});
    sd.innerHTML=`<svg width="${TW}" height="${TH+D}"><polygon points="0,${TH/2} ${TW/2},${TH} ${TW/2},${TH+D} 0,${TH/2+D}" fill="var(--c)"/><polygon points="0,${TH/2} ${TW/2},${TH} ${TW/2},${TH+D} 0,${TH/2+D}" fill="#000" opacity=".3"/><polygon points="${TW/2},${TH} ${TW},${TH/2} ${TW},${TH/2+D} ${TW/2},${TH+D}" fill="var(--c)"/><polygon points="${TW/2},${TH} ${TW},${TH/2} ${TW},${TH/2+D} ${TW/2},${TH+D}" fill="#000" opacity=".5"/><path d="M0 ${TH/2}L${TW/2} ${TH}L${TW} ${TH/2}" stroke="#fff" stroke-opacity=".32" fill="none"/></svg>`;
    boardEl.appendChild(sd);boardEl.appendChild(t);firstOf[sk]=firstOf[sk]||t;if(PROPS[ov])placeProp(x,y,ov);else if(tk==='shallow')placeDecor(x,y)}
  /* side faces take the average colour of their tile's art */
  for(const k in firstOf){const m=/url\("?(.*?)"?\)/.exec(getComputedStyle(firstOf[k]).backgroundImage);if(!m)continue;sideColor(m[1],c=>boardEl.querySelectorAll(`.blk[data-t="${k}"]`).forEach(e=>e.style.setProperty('--c',c)))}
}
/* ground variants: art/tiles/<kind>-2.png, -3... are mixed in with the main tile, the same pattern every time.
   The main tile still shows on about half the tiles. Add a kind here once its variant PNGs exist. */
const TILE_VARS={plain:['plain-2','plain-3','plain-6'],sand:['sand-2','sand-3','sand-4'],snow:['snow-2'],ice:['ice-2','ice-3','ice-4'],water:['water-2','water-3','water-4'],basalt:['basalt-2']};
function tileVariant(k,x,y){const vs=(TILE_VARS[k]||[]).filter(v=>ART_PNG.has('tiles/'+v));if(!vs.length)return null;
  const h=(Math.imul(x+1,73856093)^Math.imul(y+1,19349663))>>>0,i=h%(vs.length*2);return i<vs.length?'art/tiles/'+vs[i]+'.png':null}
const SIDEC={};
function sideColor(src,cb){if(SIDEC[src])return cb(SIDEC[src]);const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d');cx.drawImage(im,0,0,1,1);let d;try{d=cx.getImageData(0,0,1,1).data}catch(_){return}/* opened from file://: PNG art can't be read back, keep the default */cb(SIDEC[src]=`rgb(${d[0]},${d[1]},${d[2]})`)};im.src=src}
function threatMap(){const m=new Map();for(const e of state.units.filter(u=>u.team==='e'&&u.hp>0)){const ms=reach(e),all=new Set([...ms,...fringeOf(e,ms)]);for(const k of all){if(!m.has(k))m.set(k,[]);m.get(k).push(e.id)}}return m}
function threatLine(k){const ids=danger&&threatMap().get(k);if(!ids||!ids.length)return danger?'<p class="hint">No enemy can reach this tile next turn.</p>':'';return`<p class="hint" style="color:#f0a08a">In reach of ${ids.length} enem${ids.length>1?'ies':'y'}: <b>${ids.map(i=>byId(i).name).join(', ')}</b> (ringed in red).</p>`}
/* 2x2 bosses: scale the art so the creature itself fills its whole 2x2 footprint (art has empty margins) */
const FILLS={};
function fillBox(img,src,flip){const go=f=>{if(img.dataset.s!==src)return;img.style.transformOrigin=`${f.cx}% ${f.by}%`;img.style.transform=`translate(${50-f.cx}%,${100-f.by}%) scale(${f.k*(flip?-1:1)},${f.k})`};
  if(FILLS[src])return go(FILLS[src]);const im=new Image();im.onload=()=>{const W=im.width,H=im.height,cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');cx.drawImage(im,0,0);let d;try{d=cx.getImageData(0,0,W,H).data}catch(_){return}/* file:// PNGs can't be read back */
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
    if((ui==='move'||(ui==='idle'&&inspect))&&moveSet){if(moveSet.has(k))t.classList.add('mv');else if(fringe.has(k))t.classList.add(healer?'hl':'atk')}
    if((ui==='target'||ui==='confirm')&&tset.has(k))t.classList.add(tmode==='heal'?'hl':'atk','tg');
    {const ac=abTileCls(k);if(ac&&ac.length)t.classList.add(...ac)}
    if(pending&&cellsOf(pending.x,pending.y,pending.sz||1).some(c=>key(...c)===k))t.classList.add('cur');
    if(ui==='terrain'&&k===threatTile)t.classList.add('cur');
  });
  const live=new Set();
  for(const u of state.units){
    live.add(u.id);let el=uEls[u.id];
    if(!el){el=document.createElement('div');el.innerHTML='<img alt=""><div class="hpb"><i></i></div>';boardEl.appendChild(el);uEls[u.id]=el}
    el.className='unit '+u.team+(u.summon?' sum':'')+(u.stone?' stone':'')+(u.psn?' psn':'')+(u.boss?' boss':'')+(u.look&&u.look.magma?' magma':'')+(u.look&&u.look.spirit?' spirit':'')+(u.acted&&u.team==='p'?' done':'')+(thr.has(u.id)?' threat':'');
    const ub=uBox(u);el.style.left=ub.l+'px';el.style.top=ub.t+'px';el.style.zIndex=unitZ(u);{const w=ub.w+'px';if(el.style.width!==w){el.style.width=el.style.height=w;el.firstChild.style.width=el.firstChild.style.height=w}}
    if(u.hp<=0&&!el.dataset.dead&&el.isConnected&&el.style.opacity!==''){el.dataset.dead=1;dieFx(el,boardEl,ub.l+ub.w/2,ub.t+ub.h/2,u,1)}else if(u.hp>0)delete el.dataset.dead;
    el.style.opacity=u.hp>0?1:0;
    const src=sprite(u,'idle',mapWk(u)),img=el.firstChild;if(img.dataset.s!==src){img.src=src;img.dataset.s=src;img.style.transform='';img.style.transformOrigin='';if(u.sz===2||u.sz>1&&src.startsWith('data:'))fillBox(img,src,u.team==='e');/* bosses: load and measure the strike frame now so the first attack shows it */if(u.sz>1){const s2=sprite(u,'strike',mapWk(u));if(!FILLS[s2])fillBox(new Image(),s2)}}img.classList.toggle('hi',isHi(u.cls,u.sz));
    {const bi=el.querySelector('.hpb i'),bb=barsOf(u);bi.style.width=(bb?bb.frac:u.hp/u.maxhp)*100+'%';
     if(bb){bi.style.background=BAR_COL[bb.n]||'';bi.parentNode.style.background=bb.n>1?BAR_COL[bb.n-1]:'';el.style.setProperty('--hf',BAR_HF[bb.n]||'');
      const was=+el.dataset.bars||u.bars;el.dataset.bars=bb.n;if(bb.n<was&&u.hp>0){pop(u,'The shell shatters!','dmg');sfx('broke');toast(`${u.name} cracks: ${bb.n} bar${bb.n===1?'':'s'} left`)}}}
  }
  for(const id in uEls)if(!live.has(id)){uEls[id].remove();delete uEls[id]}
  propsRender();
  $('#turn').textContent=`Floor ${run?run.n:1} · Turn ${state.turn}`+(phase==='enemy'?' · Enemy':'');
  $('#obj').innerHTML=`<div><b>Goal</b>${goalShort()}</div><div><b>Lose</b>${loseText()}</div>`;
  const idle=phase==='player'&&!busy&&!over;

  $('#btnEnd').disabled=!idle;
  $('#btnEnd').classList.toggle('pulse',idle&&state.units.filter(u=>u.team==='p').every(u=>u.acted));
  $('#btnDanger').classList.toggle('on',danger);
  $('#btnDev').hidden=!settings.dev;
  {const b=$('#btnMap');b.hidden=!(run&&run.map);if(!b.hidden&&!b.firstChild.src)b.firstChild.src=mapIconArt()}
  renderPanel();
}

/* ==================================================================
   UNIT CARD AND ITEM LIST: shared bits of the side panel
   ================================================================== */
function terrText(t){return t.n+(t.df?` +${t.df} Def`:'')+(t.av?` ${t.av>0?'+':''}${t.av} Avo`:'')+(t.slow?' · −1 Move':'')}
function itemRows(u,btn){
  const ei=eqIdx(u);
  return`<div class="inv">${u.items.map((it,i)=>{const w=IT[it.k],tag=btn?'button':'div';
    return`<${tag} class="it${i===ei?' eqd':''}${btn&&itemSel===i?' sel':''}"${btn?` data-act="item:${i}" type="button"`:''}><img src="${icon(it.k)}" alt="">${w.n}${it.d?' <em>drops</em>':''}<span class="u">${[w.r&&w.t!=='item'?`Rng ${rngTxt(w.r)}`:'',endless(it.k)?'':`${it.u}/${w.uses}`].filter(Boolean).join(' · ')}</span></${tag}>`}).join('')||'<p class="skd">No items.</p>'}</div>`;
}
function card(u){
  const ei=eqIdx(u),si=staffIdx(u),wi=ei>=0?ei:si,w=wi>=0?IT[u.items[wi].k]:null,sk=u.skill&&SKILLS[u.skill],t=ter(u.x,u.y);
  let h=`<div class="uc ${u.team}"><img class="por" src="${portrait(u)}" alt=""><div class="uci">
   <div class="ch"><b>${u.name}</b><span>${CLS[u.cls].n} · Lv ${u.lv}</span></div>
   <div class="hp"><span class="bar"><i style="width:${u.bars?barsOf(u).frac*100:u.hp/u.maxhp*100}%${u.bars?`;background:${BAR_COL[barsOf(u).n]}`:''}"></i></span><span>${u.hp}/${u.maxhp} HP${u.bars?` · Bar ${barsOf(u).n}/${u.bars}`:''}</span></div>
   ${u.team==='p'?`<div class="xp"><span class="bar"><i style="width:${u.exp}%"></i></span><span>${u.exp} EXP</span></div>`:''}${mpLine(u)}${stChips(u)}${monMoves(u)}
   <div class="eq">${w?`<img src="${icon(w.key)}" alt="">${w.n} (Rng ${rngTxt(rngShow(u,w))})`:'Unarmed'}${sk?` · <b class="sk">${sk.n}</b>`:''} · ${terrText(t)} · H${hOf(u.x,u.y)}${u.psn?` · <b class="psnt">Poisoned (${u.psn})</b>`:''}${(()=>{const g=gearOf(u),t=Object.entries(g).filter(([,v])=>v).map(([k,v])=>`${v>0?'+':''}${v} ${GEAR_N[k]}`);return t.length?` · Gear ${t.join(', ')}`:''})()}</div>
  </div><button class="mini" type="button" data-act="sheet:${u.id}">Details</button></div>
  <div class="ueq"><div class="ueq-h">Equipment</div>${itemRows(u,false)}</div>`;
  return h;
}

/* ---- unit sheet (two pages, cycles through the same team) ---- */
const TN={blade:'Blade',heavy:'Heavy',pole:'Polearm',bow:'Bow',art:'Sigil',spirit:'Staff',item:'Item'};
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
  (u.skills||[]).forEach((x,i)=>{rows+=row(x.id,`${SKILLS[x.id].cost}${u.team==='p'?` <button type="button" class="${sheetRm===i?'warn':''}" data-s="rm${i}">${sheetRm===i?'Remove? Scroll is lost':'Remove'}</button>`:''}`)});
  const cap=u.team==='p'?`<span class="capn">Capacity ${capUsed(u)}/${capOf(u)}</span>`:'';
  return`<div class="sskill"><div class="skh"><span class="sl">Skills</span>${cap}</div>${u.team==='p'?`<div class="capbar"><i style="width:${capUsed(u)/capOf(u)*100}%"></i></div>`:''}<div class="skl">${rows||'<small class="capn">None</small>'}</div></div>`;
}
function rngTxt(r){return r[0]===r[1]?r[0]:r[0]+'–'+r[1]}
function itemInfo(u,k){
  const x=IT[k];
  if(x.t==="item")return`<b>${x.n}</b> · Restores ${salveAmt(k)} HP and cures poison. Usable on the map between fights too.`;
  if(x.t==='gear')return`<b>${x.n}</b> · Gear · ${gearText(x)} while carried. Can be traded.`;
  if(x.t==='spirit')return`<b>${x.n}</b> · ${TN.spirit} · Heals ${x.amt} HP · Rng ${rngTxt(x.r)}`+(canUse(u,k)?'':` · ${u.name} can't use this.`);
  return`<b>${x.n}</b> · ${TN[x.t]}${x.el?' · '+ELN[x.el]:''} · Mt ${x.mt} · Hit ${x.hit} · Crit ${x.crit||0} · Wt ${x.wt||0} · Rng ${rngTxt(x.r)}${x.wt&&u.str!=null&&wtOver(u,x)?` · ${u.name} loses ${wtOver(u,x)} Spd`:''}${x.mag?' · Uses Mag':''}${x.thrown?' · Thrown':''}${effOf(x).length?` · <span class="effv">Effective vs ${effOf(x).map(t=>TAGS[t].n).join(', ')}</span>`:''}`+(canUse(u,k)?'':` · ${u.name} can't wield this.`);
}
function drawSheet(){
  const u=byId(sheetU),el=sheetEl();if(!u){closeSheet();return}
  const L=sheetList(u),idx=L.indexOf(u)+1,ei=eqIdx(u),w=ei>=0?IT[u.items[ei].k]:null,sk=u.skill&&SKILLS[u.skill],t=ter(u.x,u.y);
  const bar=(l,v)=>`<div class="srow"><span class="sl">${l}</span><span class="sbar"><i style="width:${Math.min(100,v/30*100)}%"></i></span><b>${v}</b></div>`;
  const wt=CLS[u.cls].w.map(tp=>{const k=Object.keys(IT).find(k=>IT[k].t===tp);return`<span class="wt">${k?`<img src="${icon(k)}" alt="">`:''}${TN[tp]}</span>`}).join('');
  let pg;
  if(sheetPg===0){
    /* immunities: can't be pushed (bosses, big monsters, Iron Body, Steady), Stone, Root */
    const imm=[...(canPush(u)?[]:['Knockback']),...(stImmune(u,'stone')?['Stone']:[]),...(stImmune(u,'root')?['Root']:[])];
    pg=`<div class="sgrid">${shown(u).filter(s=>s!=='hp').map(s=>bar(SL[s],u[s])).join('')}</div>
    <div class="sinfo"><div><span class="sl">Move</span><b>${u.mov}</b></div><div><span class="sl">Terrain</span><b>${terrText(t)}</b></div><div class="wide"><span class="sl">Weapons</span><span class="wts">${wt}</span></div>${imm.length?`<div class="wide"><span class="sl">Immune</span><b>${imm.join(', ')}</b></div>`:''}</div>
    ${skillBlock(u)}${monSheet(u)}`;
  }else{
    const atk=w?(w.mag?u.mag:u.str)+w.mt:'–',hit=w?w.hit+u.lck*2:'–',crit=w?(w.crit||0)+(CLS[u.cls].crit||0)+Math.floor(u.lck/2):'–';
    pg=`<div class="scmb">${[['Atk',atk],['Hit',hit],['Crit',crit],['Avo',AS(u,w)*2+u.lck],['AS',AS(u,w)],['Rng',w?rngTxt(rngShow(u,w)):'–']].map(([l,v])=>`<div><span class="sl">${l}</span><b>${v}</b></div>`).join('')}</div>
    <div class="sitems">${u.items.map((it,i)=>{const x=IT[it.k];return`<button type="button" class="srit${i===ei?' eqd':''}${sheetIt===i?' sel':''}${isWpn(it.k)&&!canUse(u,it.k)?' no':''}" data-s="i${i}"><span class="e">${i===ei?'E':''}</span><img src="${icon(it.k)}" alt="">${x.n}${it.d?' <em>drops</em>':''}<span class="u">${[x.r&&x.t!=='item'?`Rng ${rngTxt(x.r)}`:'',endless(it.k)?'':`${it.u}/${x.uses}`].filter(Boolean).join(' · ')}</span></button>`}).join('')||'<p class="sid">No items.</p>'}</div>
    ${sheetIt!=null&&u.items[sheetIt]?`<p class="sid">${itemInfo(u,u.items[sheetIt].k)}</p>`:(isHi(u.cls,u.sz)||u.team==='p'?'<p class="sid dim">Click an item to see its stats. E marks the equipped weapon.</p>':'<p class="sid dim">Click an attack to see its stats.</p>')}`;
  }
  const dis=L.length<2?' disabled':'';
  el.innerHTML=`<div class="sbx ${u.team}" role="dialog" aria-label="${u.name} details">
   <div class="snav"><button type="button" data-s="prev" aria-label="Previous unit"${dis}>◀</button><span>${{p:'Allies',e:'Enemies',g:'Others'}[u.team]} · ${idx}/${L.length}</span><button type="button" data-s="next" aria-label="Next unit"${dis}>▶</button><button type="button" class="sx" data-s="x" aria-label="Close">✕</button></div>
   <div class="shd"><img src="${portrait(u)}" alt=""><div class="shi"><b class="sn">${u.name}</b><span class="sc">${CLS[u.cls].n}${u.boss?' <em>Boss</em>':''}</span>${tagsOf(u).length?`<button type="button" class="stags" data-s="chart" aria-label="Effective damage chart">${tagsOf(u).map(t=>`<img src="${tagArt(t)}" alt="">${TAGS[t].n}`).join(' · ')}</button>`:''}<span class="slv">Lv ${u.lv}${u.team==='p'?` · ${u.exp} EXP`:''}</span><div class="hp"><span class="bar"><i style="width:${u.bars?barsOf(u).frac*100:u.hp/u.maxhp*100}%${u.bars?`;background:${BAR_COL[barsOf(u).n]}`:''}"></i></span><span>${u.hp}/${u.maxhp} HP${u.bars?` · Bar ${barsOf(u).n}/${u.bars}`:''}</span></div></div></div>
   <div class="stabs"><button type="button" data-s="p0" class="${sheetPg===0?'cur':''}">Personal</button><button type="button" data-s="p1" class="${sheetPg===1?'cur':''}">${isHi(u.cls,u.sz)||u.team==='p'?'Items':'Stats'}</button></div>
   <div class="spg">${pg}</div></div>`;
}

/* ==================================================================
   SIDE PANEL AND FLOATING MENUS: what the panel shows in each ui state, plus the
   command menu and the forecast pop-out that float beside units on the board
   ================================================================== */
function renderPanel(){
  let h='',fm='';const u=sel&&byId(sel);
  if(over)h=`<p class="hint">${over==='win'?'Battle won.':'The run has ended.'}</p>`;
  else if(phase==='enemy')h=(acting&&acting.hp>0?card(acting):'')+'<p class="hint">The enemy is moving…</p>';
  else if(ui==='move')h=card(u)+`<p class="hint">Click a blue tile to move, or a red enemy to attack it from the best tile. Click ${u.name} to act in place.</p><div class="acts"><button type="button" data-act="cancel">Cancel</button></div>`;
  else if(ui==='menu'){
    const at=atkTargets(u).length,ht=healTargets(u).length;
    h=card(u)+threatLine(key(u.x,u.y));fm=`<div class="acts">${abilOf(u).length?'<button class="go" type="button" data-act="abil">Abilities</button>':''}${at?'<button class="go" type="button" data-act="attack">Attack</button>':''}${ht?'<button class="go" type="button" data-act="heal">Heal</button>':''}${canSummon(u)?`<button class="go" type="button" data-act="summon">Summon ${famOf(u).n}</button>`:''}<button type="button" data-act="items">Items</button>${tradeMates(u).length?'<button type="button" data-act="trade">Trade</button>':''}<button type="button" data-act="wait">Wait</button><button type="button" data-act="cancel">Back</button></div>`;
  }
  else if(ui==='abil'||ui==='aim'){const r=abPanel(u);h=r.h;fm=r.fm}
  else if(ui==='items'){
    const it=itemSel!=null?u.items[itemSel]:null;let ops='';
    if(it){if(isWpn(it.k)&&canUse(u,it.k)&&itemSel!==eqIdx(u))ops+='<button class="go" type="button" data-act="equip">Equip</button>';if(IT[it.k].t==='item'&&(u.hp<u.maxhp||u.psn))ops+='<button class="go" type="button" data-act="use">Use</button>';if(isWpn(it.k)&&!canUse(u,it.k))ops+=`<span class="hint">${u.name} can't wield this.</span>`}
    h=`<div class="ch"><b>${u.name}</b><span>Items · ${u.hp}/${u.maxhp} HP</span></div>`+itemRows(u,true)+`<div class="acts">${ops}<button type="button" data-act="menu">Back</button></div>`;
  }
  else if(ui==='target'){const sw=tmode==='atk'?(healTargets(u).length?'<button class="go" type="button" data-act="heal">Heal</button>':''):(atkTargets(u).length?'<button class="go" type="button" data-act="attack">Attack</button>':'');h=card(u)+`<p class="hint">Click a highlighted ${tmode==='heal'?'ally to heal':'enemy to see the forecast'}, then click it again to ${tmode==='heal'?'heal':'attack'}.</p>`;fm=`<div class="acts">${sw}${canSummon(u)?`<button class="go" type="button" data-act="summon">Summon ${famOf(u).n}</button>`:''}<button type="button" data-act="items">Items</button>${tradeMates(u).length?'<button type="button" data-act="trade">Trade</button>':''}<button type="button" data-act="wait">Wait</button><button type="button" data-act="menu">Back</button></div>`}
  else if(ui==='confirm'){
    if(tmode==='heal'){const si=spiritFor(u,pending),w=IT[u.items[si].k],amt=Math.min(w.amt,pending.maxhp-pending.hp);
      h=`<div class="wsel"><img src="${icon(w.key)}" alt="">${w.n}</div><p class="hint">Heal <b>${pending.name}</b>: ${pending.hp} → ${pending.hp+amt} HP. Click ${pending.name} again or press Heal.</p><div class="acts"><button class="go" type="button" data-act="doheal">Heal</button><button type="button" data-act="back">Back</button></div>`}
    else{
      const f=forecast(u,pendW,pending),A=f.A,D=f.D,list=wpnsAt(u,f.dist,pending);
      const aft=(hp,s)=>Math.max(0,hp-(s?s.dmg*s.n:0)),effT=tagsOf(pending).filter(t=>effOf(f.aw).includes(t)||Object.entries(SLAYER).some(([k,v])=>v===t&&has(u,k))||(t==='spectral'&&/Paladin/.test(CLS[u.cls].n)));
      /* the forecast pops out on the board next to the fight; the panel keeps the attacker's card */
      h=card(u)+`<p class="hint">Attack ${pending.name}? Click it again, or press Attack.</p>`;
      fm=`<div class="ufc-h"><span class="pc">${u.name}</span>${list.length>1?'<button class="mini" type="button" data-act="wprev" aria-label="Previous weapon">◀</button>':''}<img src="${icon(f.aw.key)}" alt="" title="${f.aw.n}">${list.length>1?'<button class="mini" type="button" data-act="wnext" aria-label="Next weapon">▶</button>':''}<span class="ec">${pending.name}</span></div>
      <div class="ufc-w">${f.aw.n}<button class="mini" type="button" data-act="chart" aria-label="Effective damage chart">?</button></div>
      ${A.hd?`<div class="ufc-w hgt">${A.hd>0?`High ground: +${A.hd*10} Hit, +${A.hd} Dmg`:`Low ground: ${A.hd*10} Hit`}</div>`:''}
      <div class="ufc-g"><b>${u.hp}→${aft(u.hp,D)}</b><i>HP</i><b>${pending.hp}→${aft(pending.hp,A)}</b><b>${A.dmg}${A.n>1?' ×2':''}</b><i>DMG</i><b>${D?D.dmg+(D.n>1?' ×2':''):'–'}</b><b>${A.hit}%</b><i>HIT</i><b>${D?D.hit+'%':'–'}</b><b>${A.crit}%</b><i>CRT</i><b>${D?D.crit+'%':'–'}</b></div>
      ${A.eff?`<button type="button" class="effl" data-act="chart">${effT.map(t=>`<img src="${tagArt(t)}" alt="">`).join('')}Effective ×${A.eff}</button>`:''}
      <div class="ufc-b"><button class="go" type="button" data-act="attack-go">Attack</button><button type="button" data-act="back">Back</button></div>`;
    }
  }
  else if(inspect)h=card(inspect)+(inspect.team==='e'?'<p class="hint">Red tiles show where it can strike next turn. Right-click enemies to see detailed stats.</p>':'');
  else if(ui==='terrain')h=terInfo;
  else h=`<p class="hint"><b>${BATTLE.title}.</b> Click a blue unit to move it. Right-click enemies to see detailed stats. Drag to pan the map, scroll to zoom.</p>`;
  panel.innerHTML=h;
  /* the command menu and the forecast dock in a bottom corner of the map view, on the side away from the fight */
  let mEl=$('#umenu');if(!mEl||!mEl.isConnected){mEl=document.createElement('div');mEl.id='umenu';mEl.className='umenu';vp.appendChild(mEl);
    for(const ev of['pointerdown','pointerup','wheel'])mEl.addEventListener(ev,e=>e.stopPropagation());mEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||busy)return;act(b.dataset.act)})}
  const pop=ui==='confirm'&&tmode==='atk'&&pending||ui==='aim'&&abT&&ABIL[abSel].side!=='self'&&unitAt(abT.x,abT.y);mEl.classList.toggle('ufc',!!pop||ui==='aim'&&!!abT);mEl.classList.toggle('aim',ui==='aim');
  if(fm&&(pop||u)){mEl.innerHTML=fm;mEl.hidden=false;const xs=[u,pop?pending:null].filter(Boolean).map(o=>{const r=uBox(o);return cam.x+(r.l+r.w/2)*cam.s}),mid=xs.reduce((a,x)=>a+x,0)/xs.length;
    mEl.classList.toggle('dl',mid>vb().w/2);mEl.classList.toggle('dr',mid<=vb().w/2)}else mEl.hidden=true;
}
panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||busy)return;act(b.dataset.act)});
