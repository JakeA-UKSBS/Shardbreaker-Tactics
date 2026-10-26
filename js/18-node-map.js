/* The branching node map and its screen */
/* ---- node map ----
   ROWS floors of 3 lanes, then a camp and the boss. Each lane holds the CORE rooms plus FLEX more drawn at random
   (another recruit, event, elite or battle), so routes differ. A crossing between lanes is only kept if every path
   through the map still passes pathOk: a treasure room and a tavern, 4-5 fights, at most 2 elites. */
const CORE={battle:3,elite:1,tavern:1,rest:1,event:1,treasure:1},FLEX=['recruit','recruit','event','elite','battle'],FLEX_N=2;
const ROWS=Object.values(CORE).reduce((a,b)=>a+b,0)+FLEX_N;
const NODE_N={tavern:'Tavern',battle:'Battle',elite:'Elite',recruit:'Recruit',rest:'Rest',event:'Event',treasure:'Treasure',boss:'Boss'};
const NODE_D={tavern:'Heal fully, and spend gold on a drink, a meal and a sellsword.',battle:'Fight monsters for EXP and loot.',elite:'Elite fight: a stronger pack led by an Elder monster. Drops a relic and a jade weapon.',recruit:'Pick 1 of 3 new units.',rest:'Heal fully, and train one unit: it gains a level.',
  event:'Something unexpected: a smith, a shrine, an old armoury…',treasure:'A treasure room. Pick 1 of 3 items.',boss:'The act boss.'};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function laneOk(a){
  if(a[0]!=='battle'||a[1]==='rest'||a.at(-1)==='rest'||a.indexOf('elite')<3)return false;
  for(let i=0;i+2<a.length;i++)if(a[i]==='battle'&&a[i+1]==='battle'&&a[i+2]==='battle')return false;
  for(let i=0;i+1<a.length;i++)if(a[i]===a[i+1]&&a[i]!=='battle')return false;
  return true;
}
function laneFrom(){
  for(let k=0;k<200;k++){const a=shuffle([...Object.entries(CORE).flatMap(([t,n])=>Array(n).fill(t)),...shuffle(FLEX.slice()).slice(0,FLEX_N)]);if(laneOk(a))return a}
  return['battle','event','battle','tavern','elite','treasure','battle','rest','recruit','event'];
}
const pathOk=c=>c.treasure>=1&&c.tavern>=1&&(c.elite||0)<=2&&(c.battle||0)+(c.elite||0)>=4&&(c.battle||0)+(c.elite||0)<=5;
function pathsOk(rows){
  const walk=(r,i,c)=>{c={...c,[rows[r][i].t]:(c[rows[r][i].t]||0)+1};return r===ROWS-1?pathOk(c):rows[r][i].next.every(j=>walk(r+1,j,c))};
  return rows[0].every((_,i)=>walk(0,i,{}));
}
function genMap(){
  const lanes=[0,1,2].map(()=>{for(;;){const l=laneFrom(),c={};l.forEach(t=>c[t]=(c[t]||0)+1);if(pathOk(c))return l}}),rows=[];
  for(let r=0;r<ROWS;r++)rows.push(lanes.map(l=>({t:l[r],next:[]})));
  for(let r=0;r<ROWS-1;r++)rows[r].forEach((n,i)=>n.next=[i]);
  const cand=[];for(let r=0;r<ROWS-1;r++)for(let i=0;i<3;i++)for(const j of[i-1,i+1])if(j>=0&&j<3)cand.push([r,i,j]);
  for(const[r,i,j]of shuffle(cand)){if(rand()<.35)continue;rows[r][i].next.push(j);if(!pathsOk(rows))rows[r][i].next.pop()}
  rows.push([{t:'rest',next:[0]}],[{t:'boss',next:[]}]);rows[ROWS-1].forEach(n=>n.next=[0]);
  rows.forEach(row=>row.forEach((n,i)=>n.x=row.length===1?50:18+i*32+ri(-5,5)));
  return{rows};
}
function mapIconArt(){const c='MAPI';if(NODE_IC[c])return NODE_IC[c];const p=Px(16,16);p.poly([[1,3],[5,1],[10,3],[15,1],[15,13],[10,15],[5,13],[1,15]],'#e9dcb4');p.poly([[5,1],[10,3],[10,15],[5,13]],'#d8c898');
  p.line(3,11,6,8,'#8a5a32');p.line(6,8,9,9,'#8a5a32');p.line(9,9,12,5,'#8a5a32');p.set(12,4,RED);p.set(13,5,RED);p.set(11,5,RED);p.set(12,6,RED);p.set(3,12,'#3a6a9a');p.outline(OUT);return NODE_IC[c]=p.url()}
function coinArt(){const c='COIN';if(NODE_IC[c])return NODE_IC[c];const p=Px(16,16);p.ell(8,8,6,6,'#b8912f');p.ell(8,8,4.6,4.6,GOLD);p.ell(7,7,2,2,'#f3dc9a');p.rect(7,5,2,6,'#b8912f');p.outline(OUT);return NODE_IC[c]=p.url()}
function swordsArt(){const p=Px(16,16),B='#d8dde6',E='#f4f7fb';p.line(2,2,11,11,B,2);p.line(3,2,11,10,E);p.line(13,2,4,11,B,2);p.line(12,2,4,10,E);p.line(9,12,13,8,GOLD,2);p.line(2,8,6,12,GOLD,2);p.rect(12,12,2,2,RED);p.rect(2,12,2,2,RED);p.outline(OUT);return p.url()}
function eliteArt(){const p=Px(16,16),B='#e8e2d0',D='#8a2a22';p.line(3,6,1,1,B,2);p.line(12,6,14,1,B,2);p.ell(8,8,5,4.5,B);p.rect(5,11,6,3,B);p.rect(5,7,2,2,D);p.rect(9,7,2,2,D);p.set(5,7,'#ff5a3a');p.set(10,7,'#ff5a3a');p.set(8,10,INK);p.rect(6,13,1,1,INK);p.rect(8,13,1,1,INK);p.rect(10,13,1,1,INK);p.outline(OUT);return p.url()}
function campArt(){const p=Px(16,16);p.line(2,14,13,10,BROWN,2);p.line(2,10,13,14,BROWN2,2);p.poly([[8,1],[12,10],[8,12],[4,10]],'#ff8a3c');p.poly([[8,5],[10,10],[8,11],[6,10]],'#ffe14a');p.outline(OUT);return p.url()}
function chestArt(){const p=Px(16,16);p.rect(2,6,12,8,BROWN);p.ell(8,6,6,3,BROWN2,(x,y)=>y<=6);p.rect(2,8,12,1,GOLD);p.rect(7,8,2,3,GOLD);p.rect(2,6,1,8,BROWN2);p.rect(13,6,1,8,BROWN2);p.set(8,9,INK);p.outline(OUT);return p.url()}
function eventArt(){const p=Px(16,16);p.ell(8,8,6.5,6.5,'#6a4a8a');p.line(6,5,8,4,'#f3dc9a',2);p.line(9,4,10,6,'#f3dc9a',2);p.line(10,7,8,9,'#f3dc9a',2);p.rect(7,10,2,1,'#f3dc9a');p.rect(7,12,2,2,'#f3dc9a');p.outline(OUT);return p.url()}
const RUN_LEN=ROWS+2;
/* difficulty runs on a 10-floor scale whatever the map length */
const flScale=n=>Math.round((n||1)*10/RUN_LEN);
const NODE_IC={};
function nodeIcon(t){if(t==='boss')return bossIcon();return NODE_IC[t]||(NODE_IC[t]=t==='battle'?swordsArt():t==='elite'?eliteArt():t==='rest'?campArt():t==='treasure'?chestArt():t==='tavern'?mugArt():t==='event'?eventArt():
  t==='recruit'?fig({style:'short',hair:'#6b4226',cloth:'#3a7cc0'},'Heir','p','idle',null):bossIcon())}
function bossIcon(){const B=actBiome(),k='boss:'+B.id;if(NODE_IC[k])return NODE_IC[k];const s=rngS,L=B.boss.look?clone(B.boss.look):monLook(B.boss.cls);rngS=s;return NODE_IC[k]=fig(L,B.boss.cls,'e','idle',B.boss.items[0],2)}
function reachable(){const M=run.map.rows;if(!run.pos)return M[0].map((_,i)=>({r:0,i}));const n=M[run.pos.r][run.pos.i];return run.pos.r+1<M.length?n.next.map(i=>({r:run.pos.r+1,i})):[]}
const mapEl=document.createElement('div');mapEl.className='nmap';mapEl.hidden=true;document.body.appendChild(mapEl);
/* preview: look at the act's map from the Crossroads before choosing a squad (nothing can be picked) */
function mapScreen(preview){
  const M=run.map.rows,RH=74,H=(M.length+1)*RH+70,ok=preview?[]:reachable(),isOk=(r,i)=>ok.some(o=>o.r===r&&o.i===i);
  const Y=r=>H-36-(r+1)*RH-(r===M.length-1?26:0),vis=new Set((run.path||[]).map(p=>p.r+','+p.i));
  let lines='';M.forEach((row,r)=>row.forEach((n,i)=>n.next.forEach(j=>{const m=M[r+1]&&M[r+1][j];if(!m)return;const walked=vis.has(r+','+i)&&vis.has((r+1)+','+j);
    lines+=`<line x1="${n.x}" y1="${Y(r)}" x2="${m.x}" y2="${Y(r+1)}" stroke="${walked?'#d8b15a':'#5a5466'}" stroke-width="${walked?2.5:1.5}" stroke-dasharray="${walked?'':'3 4'}" vector-effect="non-scaling-stroke"/>`})));
  M[0].forEach((n,i)=>{const walked=vis.has('0,'+i);lines+=`<line x1="50" y1="${Y(-1)}" x2="${n.x}" y2="${Y(0)}" stroke="${walked?'#d8b15a':'#5a5466'}" stroke-width="${walked?2.5:1.5}" stroke-dasharray="${walked?'':'3 4'}" vector-effect="non-scaling-stroke"/>`});
  const nodes=M.map((row,r)=>row.map((n,i)=>{const cur=run.pos&&run.pos.r===r&&run.pos.i===i,c=['nd','n-'+n.t,isOk(r,i)?'ok':'',vis.has(r+','+i)?'vis':'',cur?'cur':''].join(' ');
    return`<button type="button" class="${c}" style="left:${n.x}%;top:${Y(r)}px" data-n="${r},${i}" ${isOk(r,i)?'':'tabindex="-1"'} aria-label="${NODE_N[n.t]}"><img src="${nodeIcon(n.t)}" alt=""></button>`}).join('')).join('')
    +`<button type="button" class="nd n-start ${run.pos?'vis':'cur'}" style="left:50%;top:${Y(-1)}px" data-start="1" aria-label="Start"><img src="${flagArt()}" alt=""></button>`;
  mapEl.innerHTML=`<div class="nm-head"><div class="eyebrow">Act ${run.act||1} of ${ACTS} · Seed ${run.seed}${run.asc?` · Ascension ${run.asc}`:''} · <span class="gold">${gold()} gold</span></div><h2>${actBiome().n}</h2>${preview?'<button type="button" class="go nm-close" data-close="1">Back to the Crossroads</button>':''}</div>
    <div class="nm-scroll"><div class="nm-board" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" width="100%" height="${H}">${lines}</svg>${nodes}</div></div>
    ${(run.relics||[]).length||(run.meals||[]).length||(run.woes||[]).length?`<div class="nm-relics">${(run.relics||[]).map(k=>`<button type="button" class="rl" data-rel="${k}" aria-label="${RELICS[k].n}"><img src="${relicArt(k)}" alt=""></button>`).join('')}${(run.meals||[]).map(x=>`<button type="button" class="rl ml" data-meal="${x.id}" aria-label="${MEALS[x.id].n}"><img src="${mealArt(x.id)}" alt=""><i>${x.n}</i></button>`).join('')}${(run.woes||[]).map((w,i)=>`<button type="button" class="rl ml wo" data-woe="${i}" aria-label="${WOES[w.id].n}"><img src="${woeArt(w.id)}" alt=""><i>${w.n}</i></button>`).join('')}</div>`:''}
    <aside class="nm-side"><div class="ns-gold"><img src="${coinArt()}" alt="">${gold()} gold</div>
      <div class="ns-h gold">Relics${(run.relics||[]).length?` · ${run.relics.length}`:''}</div>${(run.relics||[]).map(k=>`<div class="ns-row"><img src="${relicArt(k)}" alt=""><span><b>${RELICS[k].n}</b>${RELICS[k].d}</span></div>`).join('')||''}
      ${(run.meals||[]).length?`<div class="ns-h">Meals</div>${run.meals.map(x=>`<div class="ns-row"><img src="${mealArt(x.id)}" alt=""><span><b>${MEALS[x.id].n}</b>${MEALS[x.id].d} · ${x.n} fight${x.n>1?'s':''} left</span></div>`).join('')}`:''}
      ${(run.woes||[]).length?`<div class="ns-h woe">Woes</div>${run.woes.map(w=>`<div class="ns-row"><img src="${woeArt(w.id)}" alt=""><span>${woeText(w)}</span></div>`).join('')}`:''}</aside>
    <div class="nm-info"></div>
    <aside class="nm-side nm-unit" hidden></aside>
    <div class="nm-squad">${run.roster.map((u,ui)=>`<div data-u="${ui}" role="button" tabindex="0"><img src="${uSpr(u)}" alt=""><span>${u.name}</span><small>Lv ${u.lv}${u.hp<u.maxhp?` · ${u.hp}/${u.maxhp} HP`:''}</small></div>`).join('')}</div>`;
  tip('map','The road ahead','Tap a glowing room to see what it is, then tap it again to go there. Every route has a treasure room and a tavern, 4 or 5 fights (the red skull is an elite) and a rest, plus a mix of events and recruits. Then a camp and the boss.');
  mapEl.hidden=false;mapEl.style.background=`radial-gradient(ellipse at 50% 0%,${actBiome().bg},#121018 72%)`;
  const sc=mapEl.querySelector('.nm-scroll'),focus=ok[0]?Y(ok[0].r):H;sc.scrollTop=Math.max(0,focus-sc.clientHeight/2);
  /* the unit panel floats over the map; tap the unit again, the ✕, anywhere off the panel, Esc or right-click to close it */
  const closeUnit=()=>{const box=mapEl.querySelector('.nm-unit');if(box)box.hidden=true;mapEl.querySelectorAll('.nm-squad .on').forEach(x=>x.classList.remove('on'))};
  mapEl.oncontextmenu=e=>{e.preventDefault();closeUnit()};mapEl.onkeydown=null;
  if(!mapEl._esc){mapEl._esc=1;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mapEl.hidden&&mapEl._close)mapEl._close()})}mapEl._close=closeUnit;
  return new Promise(res=>{let sel=null;mapEl.onclick=e=>{
    if(e.target.closest('[data-ux]')){closeUnit();return}
    if(!e.target.closest('.nm-unit,[data-u]'))closeUnit();
    if(e.target.closest('[data-close]')){mapEl.onclick=null;mapEl.hidden=true;sfx('select');return res(null)}
    const sv=e.target.closest('[data-salve]');if(sv){const u=run.roster[+sv.dataset.uu],it=u.items[+sv.dataset.salve],amt=Math.min(salveAmt(it.k),u.maxhp-u.hp);u.hp+=amt;it.u--;if(it.u<=0)u.items.splice(+sv.dataset.salve,1);sfx('heal');saveGame();
      sv.closest('.nm-side,.nm-info').innerHTML=unitBox(u);const sm=mapEl.querySelector(`.nm-squad [data-u="${+sv.dataset.uu}"] small`);if(sm)sm.textContent=`Lv ${u.lv}${u.hp<u.maxhp?` · ${u.hp}/${u.maxhp} HP`:''}`;toast(`${u.name} recovers ${amt} HP`);return}
    const su=e.target.closest('[data-u]');if(su){const u=run.roster[+su.dataset.u],box=mapEl.querySelector('.nm-unit');sfx('select');
      if(su.classList.contains('on')&&!box.hidden){closeUnit();return}
      mapEl.querySelectorAll('.nm-squad .on').forEach(x=>x.classList.remove('on'));su.classList.add('on');box.hidden=false;box.innerHTML=unitBox(u);return}
    const wo=e.target.closest('[data-woe]');if(wo){mapEl.querySelector('.nm-info').innerHTML=woeText(run.woes[+wo.dataset.woe]);return}
    const ml=e.target.closest('[data-meal]');if(ml){const X=MEALS[ml.dataset.meal],n=run.meals.find(m=>m.id===ml.dataset.meal).n;mapEl.querySelector('.nm-info').innerHTML=`<b>${X.n}.</b> ${X.d} for ${n} more fight${n>1?'s':''}.`;return}
    const rl=e.target.closest('[data-rel]');if(rl){const X=RELICS[rl.dataset.rel];mapEl.querySelector('.nm-info').innerHTML=`<b>${X.n}.</b> ${X.d}`;return}
    const b=e.target.closest('.nd.ok');if(b){const[r,i]=b.dataset.n.split(',').map(Number),t=M[r][i].t;
      if(sel===b.dataset.n){mapEl.onclick=null;sfx('select');return res({r,i})}
      sel=b.dataset.n;mapEl.querySelectorAll('.nd.pick').forEach(x=>x.classList.remove('pick'));b.classList.add('pick');sfx('tick');
      mapEl.querySelector('.nm-info').innerHTML='';return}
    const st=e.target.closest('[data-start]');if(st&&preview){mapEl.onclick=null;mapEl.hidden=true;sfx('select');return res(null)}if(st){mapEl.querySelector('.nm-info').innerHTML=(run.act||1)===1?'<b>The Crossroads.</b> Where the run began.':`<b>The road in.</b> Where you entered ${theN(actBiome())}.`;return}
    const any=e.target.closest('.nd');if(any){const[r,i]=any.dataset.n.split(',').map(Number),t=M[r][i].t;mapEl.querySelector('.nm-info').innerHTML=''}
  }});
}
const unitBox=u=>`<button type="button" class="nu-x" data-ux="1" aria-label="Close">✕</button>${unitDetail(u)}`;
/* a unit's full details for the map screen: stats, skills (with capacity) and items */
function unitDetail(u){const C=CLS[u.cls],sk=[u.skill,...(u.skills||[]).map(x=>x.id)].filter(Boolean);
  return`<div class="nu-head"><img src="${portrait(u)}" alt=""><div><b>${u.name}</b><span>${C.n} · Lv ${u.lv} · ${u.exp} EXP</span><span>HP ${u.hp}/${u.maxhp} · Move ${u.mov}</span></div></div>
  <div class="nu-stats">${shown(u).filter(k=>k!=='hp').map(k=>`<div><span>${SL[k]}</span><b>${u[k]}</b></div>`).join('')}</div>
  <div class="ns-h">Skills <small>${capPie(u)}</small></div>${sk.map((id,i)=>`<div class="ns-row"><span><b>${SKILLS[id].n}${i===0?' (personal)':''}</b>${SKILLS[id].d}</span></div>`).join('')}
  <div class="ns-h">Items</div>${u.items.map((it,ii)=>`<div class="ns-row"><img src="${icon(it.k)}" alt=""><span>${itemText(it.k).replace('</b> · ','</b>')}${IT[it.k].t==='item'?` (${it.u} left)`:''}</span>${IT[it.k].t==='item'&&u.hp<u.maxhp?`<button type="button" class="mini go" data-salve="${ii}" data-uu="${run.roster.indexOf(u)}">Use</button>`:''}</div>`).join('')||'<p class="ns-none">No items.</p>'}
  <div class="ns-h">Wields</div><p class="ns-none">${C.w.map(t=>TN[t]).join(', ')}</p>`}
async function restNode(){
  run.roster.forEach(u=>u.hp=u.maxhp);sfx('heal');
  const m=await modal(`<div class="eyebrow">Rest</div><h2>A quiet camp</h2><p>Everyone rests and heals fully. You can also train one unit: they gain a level.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="t${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Move on</button></div>`);
  if(m==='skip')return;const u=run.roster[+m.slice(1)],g=gainExp(u,100);if(g&&g.gains)await levelUp(u,g);
}
async function mapStep(){
  run.phase='map';saveGame();music(actBiome().id);
  const pos=await mapScreen(),N=run.map.rows[pos.r][pos.i];
  run.pos=pos;(run.path=run.path||[]).push(pos);run.n=pos.r+1;run.kind=N.t;
  if(N.t==='recruit'){await recruitNode();return mapStep()}
  if(N.t==='rest'){await restNode();return mapStep()}
  if(N.t==='treasure'){await treasureNode();return mapStep()}
  if(N.t==='event'){await eventNode();return mapStep()}
  if(N.t==='tavern'){await tavernNode();return mapStep()}
  mapEl.hidden=true;run.phase='battle';await beginBattle();
}


