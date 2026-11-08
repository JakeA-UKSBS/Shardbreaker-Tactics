/* The branching node map and its screen */
/* ---- node map ----
   Acts 1 and 2: 15 floors, then the boss (16 rows), on 4 lanes that cross now and then, following Slay the Spire's map.
   Fixed floors: 1 is a battle, 8 a treasure room and 15 a camp. Every other room is rolled from ROOM_W, with its rules:
   no elite or camp before floor 6, no camp on floor 14 (the camp on 15 is next), and no elite, camp or tavern twice in
   a row on any path. On top of the odds, every route (floors 1-14) must pass ROUTE_OK: 6-9 fights (elites count) and at
   least one camp before the fixed one on 15, so no route is a slog or a walkover. Two random lanes per map are
   monster lanes (ROOM_W odds, 6-9 fights as before); the other two roll from ROOM_W_LIGHT (a few more events and
   taverns), hold 6-8 fights and have at most two battles on floors 2-5. Act 3 stays a short straight road. */
const FLOORS=15,LANES=4,TREASURE_FL=8,ROWS=FLOORS-1,FIGHTS=[6,9];
const routeOk=c=>(c.battle||0)+(c.elite||0)>=FIGHTS[0]&&(c.battle||0)+(c.elite||0)<=FIGHTS[1]&&(c.rest||0)>=1;
/* does every route through the rolled floors pass routeOk? */
function routesOk(rows){const walk=(r,i,c)=>{const t=rows[r][i].t;c={...c,[t]:(c[t]||0)+1};return r===rows.length-1?routeOk(c):rows[r][i].next.every(j=>walk(r+1,j,c))};
  return rows[0].every((_,i)=>walk(0,i,{}))}
/* ROOM_W: relative chance of each room type when a floor is rolled (out of 100). NO_REPEAT: types that can't come twice in a row. */
const ROOM_W={battle:45,event:23,rest:12,elite:10,tavern:10},ROOM_W_LIGHT={battle:35,event:30,rest:12,elite:10,tavern:13},NO_REPEAT=['elite','rest','tavern'];
const NODE_N={tavern:'Tavern',battle:'Battle',elite:'Elite',recruit:'Recruit',rest:'Rest',event:'Event',treasure:'Treasure',boss:'Boss'};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* can room t go on floor fl, coming from a room of type prev? */
function roomOk(t,fl,prev){if((t==='elite'||t==='rest')&&fl<6)return false;if(t==='rest'&&fl===FLOORS-1)return false;return!(prev===t&&NO_REPEAT.includes(t))}
function rollRoom(fl,prev,W=ROOM_W){
  if(fl===1)return'battle';if(fl===TREASURE_FL)return'treasure';const tot=Object.values(W).reduce((a,b)=>a+b);
  for(let k=0;k<60;k++){let r=rand()*tot,t='battle';for(const[x,w]of Object.entries(W))if((r-=w)<0){t=x;break}if(roomOk(t,fl,prev))return t}
  return'battle';
}
function genMap(){
  /* act 3 is a straight road: tavern, elite, an act-3 event, camp, then the Crystal Heart */
  if((run&&run.act||1)>=3){const rows=['tavern','elite','event','rest','boss'].map((t,r,a)=>[{t,x:50,next:r<a.length-1?[0]:[]}]);return{rows}}
  /* each lane is re-rolled until it passes routeOk on its own */
  const heavy=shuffle([...Array(LANES).keys()]).slice(0,2),hv=i=>heavy.includes(i);
  const lane=(_,i)=>{const W=hv(i)?ROOM_W:ROOM_W_LIGHT,F=hv(i)?FIGHTS:[6,8];
    for(let k=0;k<500;k++){const a=[];for(let r=0;r<ROWS;r++)a.push(rollRoom(r+1,r?a[r-1]:null,W));const c={};a.forEach(t=>c[t]=(c[t]||0)+1);const f=(c.battle||0)+(c.elite||0);if(routeOk(c)&&f>=F[0]&&f<=F[1]&&(hv(i)||a.slice(1,5).filter(t=>t==='battle').length<=2))return a}
    return['battle','event','battle','tavern','battle','rest','battle','treasure','event','battle','rest','battle','event','battle']};
  const lanes=Array.from({length:LANES},lane),rows=[];
  for(let r=0;r<ROWS;r++)rows.push(lanes.map((l,i)=>({t:l[r],next:r<ROWS-1?[i]:[]})));
  /* crossings: 6-8 per map, never two on the same floor or on neighbouring floors, never one that breaks the no-repeat rule,
     and only if every route still passes routeOk */
  const cand=[];for(let r=0;r<ROWS-1;r++)for(let i=0;i<LANES;i++)for(const j of[i-1,i+1])if(j>=0&&j<LANES)cand.push([r,i,j]);
  const want=ri(6,8),used=new Set();let got=0;
  for(const[r,i,j]of shuffle(cand)){if(got>=want)break;if(used.has(r)||used.has(r-1)||used.has(r+1))continue;
    if(!roomOk(rows[r+1][j].t,r+2,rows[r][i].t))continue;rows[r][i].next.push(j);if(!routesOk(rows)){rows[r][i].next.pop();continue}used.add(r);got++}
  rows.push([{t:'rest',next:[0]}],[{t:'boss',next:[]}]);rows[ROWS-1].forEach(n=>n.next=[0]);
  rows.forEach(row=>row.forEach((n,i)=>n.x=row.length===1?50:14+i*24+ri(-4,4)));
  return{rows};
}
const RUN_LEN=ROWS+2;
/* floors in the current act's map (act 3 is shorter) */
const actLen=()=>run&&run.map&&run.map.rows?run.map.rows.length:RUN_LEN;
/* difficulty runs on a 10-floor scale whatever the map length */
const flScale=n=>Math.round((n||1)*10/RUN_LEN);
const NODE_IC={};
function nodeIcon(t){if(t==='boss')return bossIcon();return NODE_IC[t]||(NODE_IC[t]=t==='battle'?swordsArt():t==='elite'?eliteArt():t==='rest'?(ART_PNG.has('nodes/rest-map')?'art/nodes/rest-map.png':campArt()):t==='treasure'?chestArt():t==='tavern'?(ART_PNG.has('nodes/tavern')?'art/nodes/tavern.png':mugArt()):t==='event'?eventArt():
  t==='recruit'?recruitArt():bossIcon())}
function recruitArt(){return art('nodes/recruit')}
function bossIcon(){const B=actBiome();return monPng(B.boss.cls,'idle',B.boss.sz||2)}
function reachable(){const M=run.map.rows;if(!run.pos)return M[0].map((_,i)=>({r:0,i}));const n=M[run.pos.r][run.pos.i];return run.pos.r+1<M.length?n.next.map(i=>({r:run.pos.r+1,i})):[]}
const mapEl=document.createElement('div');mapEl.className='nmap';mapEl.hidden=true;document.body.appendChild(mapEl);
/* preview: look at the map without moving (nothing can be picked); a string is the close button's label.
   Used from the Crossroads (true) and mid-battle ('Back to the battle'). In dev mode every room can be picked. */
function mapScreen(preview){
  const M=run.map.rows,RH=92,H=(M.length+1)*RH+124,anyRoom=!preview&&settings.dev,ok=preview?[]:anyRoom?M.flatMap((row,r)=>row.map((_,i)=>({r,i}))):reachable(),isOk=(r,i)=>ok.some(o=>o.r===r&&o.i===i);
  const Y=r=>H-36-(r+1)*RH-(r===M.length-1?50:0),vis=new Set((run.path||[]).map(p=>p.r+','+p.i));
  let lines='';M.forEach((row,r)=>row.forEach((n,i)=>n.next.forEach(j=>{const m=M[r+1]&&M[r+1][j];if(!m)return;const walked=vis.has(r+','+i)&&vis.has((r+1)+','+j);
    lines+=`<line x1="${n.x}" y1="${Y(r)}" x2="${m.x}" y2="${Y(r+1)}" stroke="${walked?'#8b2e16':'#5b3d20'}" stroke-width="${walked?2.5:1.5}" stroke-dasharray="${walked?'':'3 4'}" vector-effect="non-scaling-stroke"/>`})));
  M[0].forEach((n,i)=>{const walked=vis.has('0,'+i);lines+=`<line x1="50" y1="${Y(-1)}" x2="${n.x}" y2="${Y(0)}" stroke="${walked?'#8b2e16':'#5b3d20'}" stroke-width="${walked?2.5:1.5}" stroke-dasharray="${walked?'':'3 4'}" vector-effect="non-scaling-stroke"/>`});
  const nodes=M.map((row,r)=>row.map((n,i)=>{const cur=run.pos&&run.pos.r===r&&run.pos.i===i,c=['nd','n-'+n.t,isOk(r,i)?'ok':'',vis.has(r+','+i)?'vis':'',cur?'cur':''].join(' ');
    return`<button type="button" class="${c}" style="left:${n.x}%;top:${Y(r)}px" data-n="${r},${i}" ${isOk(r,i)?'':'tabindex="-1"'} aria-label="${NODE_N[n.t]}${cur?' (you are here)':''}"><img src="${nodeIcon(n.t)}" alt="">${cur?`<i class="nflag"><img src="${flagArt()}" alt=""></i>`:''}</button>`}).join('')).join('')
    +`<button type="button" class="nd n-start ${run.pos?'vis':'cur'}" style="left:50%;top:${Y(-1)}px" data-start="1" aria-label="Start"><img src="${flagArt()}" alt=""></button>`;
  mapEl.innerHTML=`<div class="nm-head"><div class="eyebrow">Act ${run.act||1} of ${ACTS} · ${seedTag(run.seed)}${run.asc?` · Ascension ${run.asc}`:''} · <span class="gold">${gold()} gold</span></div><h2>${actBiome().n}</h2>${anyRoom?'<div class="eyebrow gold">Dev: pick any room</div>':''}${preview?`<button type="button" class="go nm-close" data-close="1">${typeof preview==='string'?preview:'Back to the Crossroads'}</button>`:''}</div>
    <div class="nm-scroll"><div class="nm-board" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" width="100%" height="${H}">${lines}</svg>${nodes}</div></div>
    ${(run.relics||[]).length||(run.meals||[]).length?`<div class="nm-relics">${(run.relics||[]).map(k=>`<button type="button" class="rl" data-rel="${k}" aria-label="${RELICS[k].n}"><img src="${relicArt(k)}" alt=""></button>`).join('')}${(run.meals||[]).map(x=>`<button type="button" class="rl ml" data-meal="${x.id}" aria-label="${MEALS[x.id].n}"><img src="${mealArt(x.id)}" alt=""><i>${x.n}</i></button>`).join('')}</div>`:''}
    <aside class="nm-side"><div class="ns-gold"><img src="${coinArt()}" alt="">${gold()} gold</div>
      <div class="ns-h gold">Relics${(run.relics||[]).length?` · ${run.relics.length}`:''}</div>${(run.relics||[]).map(k=>`<div class="ns-row"><img src="${relicArt(k)}" alt=""><span><b>${RELICS[k].n}</b>${RELICS[k].d}</span></div>`).join('')||''}
      ${(run.meals||[]).length?`<div class="ns-h">Meals</div>${run.meals.map(x=>`<div class="ns-row"><img src="${mealArt(x.id)}" alt=""><span><b>${MEALS[x.id].n}</b>${MEALS[x.id].d} · ${x.n} fight${x.n>1?'s':''} left</span></div>`).join('')}`:''}</aside>
    <div class="nm-info"></div>
    <aside class="nm-side nm-unit" hidden></aside>
    <div class="nm-squad">${run.roster.map((u,ui)=>`<div data-u="${ui}" role="button" tabindex="0"><img src="${uSpr(u)}" alt=""><span>${u.name}</span><small>Lv ${u.lv}</small>${squadHp(u)}</div>`).join('')}</div>`;
  tip('map','The road ahead','Click a glowing room to see what it is, then click it again to go there. 15 floors: fights (the red skull is an elite), events, camps that heal, taverns, and a treasure room halfway. Then a camp and the boss.');
  mapEl.hidden=false;mapEl.style.background=`radial-gradient(ellipse at 50% 0%,${actBiome().bg},#121018 72%)`;
  const sc=mapEl.querySelector('.nm-scroll'),focus=!anyRoom&&ok[0]?Y(ok[0].r):run.pos?Y(run.pos.r):H;sc.scrollTop=Math.max(0,focus-sc.clientHeight/2);
  /* the unit panel floats over the map; click the unit again, the ✕, anywhere off the panel, Esc or right-click to close it */
  const closeUnit=()=>{const box=mapEl.querySelector('.nm-unit');if(box)box.hidden=true;mapEl.querySelectorAll('.nm-squad .on').forEach(x=>x.classList.remove('on'))};
  mapEl.oncontextmenu=e=>{e.preventDefault();closeUnit()};mapEl.onkeydown=null;
  if(!mapEl._esc){mapEl._esc=1;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mapEl.hidden&&mapEl._close)mapEl._close()})}mapEl._close=closeUnit;
  return new Promise(res=>{let sel=null;mapEl.onclick=e=>{
    if(e.target.closest('[data-ux]')){closeUnit();return}
    if(!e.target.closest('.nm-unit,[data-u]'))closeUnit();
    if(preview&&e.target.closest('[data-equip],[data-drop],[data-salve]'))return;/* no changing kit while only looking */
    if(e.target.closest('[data-close]')){mapEl.onclick=null;mapEl.hidden=true;sfx('select');return res(null)}
    const eq=e.target.closest('[data-equip]');if(eq){const u=run.roster[+eq.dataset.uu],it=u.items.splice(+eq.dataset.equip,1)[0];u.items.unshift(it);sfx('tick');saveGame();
      const side=eq.closest('.nm-side,.nm-info');if(side)side.innerHTML=unitBox(u);toast(`${u.name} equips the ${IT[it.k].n}`);return}
    const dr=e.target.closest('[data-drop]');if(dr){const u=run.roster[+dr.dataset.uu],i=+dr.dataset.drop,it=u.items[i],side=dr.closest('.nm-side,.nm-info');
      modal(`<h2>Drop the ${IT[it.k].n}?</h2><p>${u.name} leaves it behind. It’s gone for good.</p><div class="mbtns"><button type="button" data-m="no">Keep it</button><button type="button" class="go" data-m="yes">Drop it</button></div>`).then(m=>{
        if(m!=='yes'||u.items[i]!==it||eqIdx(u)===i)return;u.items.splice(i,1);sfx('tick');saveGame();if(side&&side.isConnected)side.innerHTML=unitBox(u);toast(`${u.name} drops the ${IT[it.k].n}`)});return}
    const sv=e.target.closest('[data-salve]');if(sv){const u=run.roster[+sv.dataset.uu],it=u.items[+sv.dataset.salve],amt=Math.min(salveAmt(it.k),u.maxhp-u.hp);u.hp+=amt;it.u--;if(it.u<=0)u.items.splice(+sv.dataset.salve,1);sfx('heal');saveGame();
      sv.closest('.nm-side,.nm-info').innerHTML=unitBox(u);const sm=mapEl.querySelector(`.nm-squad [data-u="${+sv.dataset.uu}"] .sq-hp`);if(sm)sm.outerHTML=squadHp(u);toast(`${u.name} recovers ${amt} HP`);return}
    const su=e.target.closest('[data-u]');if(su){const u=run.roster[+su.dataset.u],box=mapEl.querySelector('.nm-unit');sfx('select');
      if(su.classList.contains('on')&&!box.hidden){closeUnit();return}
      mapEl.querySelectorAll('.nm-squad .on').forEach(x=>x.classList.remove('on'));su.classList.add('on');box.hidden=false;box.innerHTML=unitBox(u);return}
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
/* HP under each squad member on the map: a bar (green, amber below half, red below a quarter) and the number */
const squadHp=u=>{const f=u.hp/u.maxhp;return`<span class="sq-hp${f<.25?' lo':f<.5?' mid':''}"><i><b style="width:${f*100}%"></b></i><em>${u.hp}/${u.maxhp}</em></span>`};
const unitBox=u=>`<button type="button" class="nu-x" data-ux="1" aria-label="Close">✕</button>${unitDetail(u)}`;
/* a unit's full details for the map screen: stats, skills (with capacity) and items */
function unitDetail(u){const C=CLS[u.cls],sk=[u.skill,...(u.skills||[]).map(x=>x.id)].filter(Boolean);
  return`<div class="nu-head"><img src="${portrait(u)}" alt=""><div><b>${u.name}</b><span>${C.n} · Lv ${u.lv} · ${u.exp} EXP</span><span>HP ${u.hp}/${u.maxhp} · Move ${u.mov}</span></div></div>
  <div class="nu-stats">${shown(u).filter(k=>k!=='hp').map(k=>`<div><span>${SL[k]}</span><b>${u[k]}</b></div>`).join('')}</div>
  <div class="ns-h">Skills <small>${capPie(u)}</small></div>${sk.map((id,i)=>`<div class="ns-row"><span><b>${SKILLS[id].n}${i===0?' (personal)':''}</b>${SKILLS[id].d}</span></div>`).join('')}
  <div class="ns-h">Items</div>${u.items.map((it,ii,_a,ei=eqIdx(u))=>`<div class="ns-row${ii===ei?' eqd':''}"><img src="${icon(it.k)}" alt=""><span>${itemText(it.k).replace('</b> · ','</b>')}${IT[it.k].t==='item'?` <span class="uses">${it.u}/${IT[it.k].uses}</span>`:''}</span>${IT[it.k].t==='item'&&u.hp<u.maxhp?`<button type="button" class="mini go" data-salve="${ii}" data-uu="${run.roster.indexOf(u)}">Use</button>`:''}${ii===ei?'<span class="ns-eq">Equipped</span>':`${isWpn(it.k)&&canUse(u,it.k)?`<button type="button" class="mini go" data-equip="${ii}" data-uu="${run.roster.indexOf(u)}">Equip</button>`:''}<button type="button" class="mini ns-drop" data-drop="${ii}" data-uu="${run.roster.indexOf(u)}" aria-label="Drop ${IT[it.k].n}">Drop</button>`}</div>`).join('')||'<p class="ns-none">No items.</p>'}
  <div class="ns-h">Wields</div><p class="ns-none">${C.w.map(t=>TN[t]).join(', ')}</p>`}
async function restNode(){
  run.roster.forEach(u=>u.hp=u.maxhp);
  const train=R('bedroll')?60:30;
  if(R('kettle')){await expAll(run.roster,10);toast('Camp Kettle: everyone gains 10 EXP')}
  const m=await modal(`<div class="eyebrow">Rest</div><h2>A quiet camp</h2><p>Everyone rests and heals fully. Choose one unit to train: they gain ${train} EXP.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="t${i}">${unitCard(u,false,0,true)}</button>`).join('')}</div>`);
  await expAll([run.roster[+m.slice(1)]],train);
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

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function mapIconArt(){return art('ui/map')}
function coinArt(){return art('ui/coin')}
function swordsArt(){return art('nodes/battle')}
function eliteArt(){return art('nodes/elite')}
function campArt(){return art('nodes/rest')}
function chestArt(){return art('nodes/treasure')}
function eventArt(){return art('nodes/event')}
