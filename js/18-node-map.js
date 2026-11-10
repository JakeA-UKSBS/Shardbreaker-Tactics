/* The branching node map and its screen */
/* ---- node map ----
   Acts 1 and 2: 15 floors, then a camp and the boss, laid out like Slay the Spire's map: 5-6 paths climb a 6-column grid,
   stepping up, up-left or up-right without crossing, so rows hold different numbers of rooms and paths split and merge.
   3-4 starting rooms, and at least 2 diamonds (a room that splits in two and joins back up two floors later).
   Fixed floors (FIXED_FL): 1 is a battle, 8 a treasure room, and every TAVERN_EVERY floors a tavern (4 and 12); taverns
   aren't rolled anywhere else. Every other room is rolled from ROOM_W, with its rules: no elite or camp before floor 6,
   no camp on floor 14 (a camp follows 15), and no elite or camp twice in a row on any path. On top of the odds, every
   route must pass ROUTE_OK: 5-8 fights (elites count) and at least one camp. One side of the map (left or right three
   columns) rolls from ROOM_W (monster-heavy), the other from ROOM_W_LIGHT (more events). Act 3 stays a short straight road. */
const FLOORS=15,COLS=6,TREASURE_FL=8,TAVERN_EVERY=4,ROWS=FLOORS-1,FIGHTS=[5,8];
/* the room a floor always has, or null if it's rolled. TAVERN_EVERY=0 puts taverns back in the rolls (add tavern to ROOM_W) */
const fixedRoom=fl=>fl===1?'battle':fl===TREASURE_FL?'treasure':TAVERN_EVERY&&fl%TAVERN_EVERY===0?'tavern':null;
/* ROOM_W: relative chance of each room type when a room is rolled (out of 100). NO_REPEAT: types that can't come twice in a row. */
const ROOM_W={battle:47,event:31,rest:12,elite:10},ROOM_W_LIGHT={battle:36,event:42,rest:12,elite:10},NO_REPEAT=['elite','rest','tavern'];
const NODE_N={tavern:'Tavern',battle:'Battle',elite:'Elite',recruit:'Recruit',rest:'Rest',event:'Event',treasure:'Treasure',boss:'Boss'};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* can room t go on floor fl, coming from a room of type prev? */
function roomOk(t,fl,prev){if((t==='elite'||t==='rest')&&fl<6)return false;if(t==='rest'&&fl===FLOORS-1)return false;return!(prev===t&&NO_REPEAT.includes(t))}
/* does every route pass? Worked from the top down: each room keeps the fewest/most fights and fewest camps on any route above it */
function routesOk(rows){let up=null;
  for(let r=rows.length-1;r>=0;r--)up=rows[r].map(n=>{const f=n.t==='battle'||n.t==='elite'?1:0,c=n.t==='rest'?1:0,nx=n.next.map(j=>up[j]);
    return nx.length?{lo:f+Math.min(...nx.map(x=>x.lo)),hi:f+Math.max(...nx.map(x=>x.hi)),c:c+Math.min(...nx.map(x=>x.c))}:{lo:f,hi:f,c}});
  return up.every(x=>x.lo>=FIGHTS[0]&&x.hi<=FIGHTS[1]&&x.c>=1)}
/* the shape: rows of {c (column), next:[indices in the row above]} */
function genLayout(){
  for(let k=0;k<500;k++){
    const starts=shuffle([...Array(COLS).keys()]).slice(0,ri(3,4)),paths=[...starts,...Array.from({length:ri(5,6)-starts.length},()=>pick(starts))],E=new Set();
    for(let c of paths)for(let r=0;r<ROWS-1;r++){
      const opts=shuffle([c-1,c,c+1].filter(d=>d>=0&&d<COLS&&!(d===c+1&&E.has(`${r},${c+1},${c}`))&&!(d===c-1&&E.has(`${r},${c-1},${c}`))));
      const d=opts[0];E.add(`${r},${c},${d}`);c=d}
    const cols=Array.from({length:ROWS},()=>new Set());starts.forEach(c=>cols[0].add(c));for(const e of E){const[r,,d]=e.split(',').map(Number);cols[r+1].add(d)}
    const rows=cols.map(s=>[...s].sort((a,b)=>a-b).map(c=>({c,next:[]})));
    for(const e of E){const[r,c,d]=e.split(',').map(Number);rows[r].find(n=>n.c===c).next.push(rows[r+1].findIndex(n=>n.c===d))}
    rows.forEach(row=>row.forEach(n=>n.next.sort((a,b)=>a-b)));
    if(rows.some(row=>row.length<2||row.length>5))continue;
    /* diamonds: a room with two ways up that meet again on the floor after */
    let dia=0;rows.slice(0,-2).forEach((row,r)=>row.forEach(n=>{if(n.next.length<2)return;const a=new Set();n.next.forEach(j=>rows[r+1][j].next.forEach(q=>a.has(q)?dia++:a.add(q)))}));
    if(dia>=2)return rows}
  return null}
function fillRooms(rows){
  const heavyLeft=rand()<.5,par=rows.map((row,r)=>row.map((_,i)=>r?rows[r-1].filter(p=>p.next.includes(i)):[]));
  for(let k=0;k<400;k++){
    rows.forEach((row,r)=>row.forEach((n,i)=>{const fl=r+1,fx=fixedRoom(fl);if(fx){n.t=fx;return}
      const W=(n.c<COLS/2)===heavyLeft?ROOM_W:ROOM_W_LIGHT,tot=Object.values(W).reduce((a,b)=>a+b);n.t='battle';
      for(let q=0;q<60;q++){let x=rand()*tot,t='battle';for(const[y,w]of Object.entries(W))if((x-=w)<0){t=y;break}if(par[r][i].every(p=>roomOk(t,fl,p.t))){n.t=t;break}}}));
    if(routesOk(rows))return true}
  return false}
function genMap(){
  /* act 3 is a straight road: tavern, elite, an act-3 event, camp, then the Crystal Heart */
  if((run&&run.act||1)>=3){const rows=['tavern','elite','event','rest','boss'].map((t,r,a)=>[{t,x:50,next:r<a.length-1?[0]:[]}]);return{rows}}
  let rows=null;for(let k=0;k<50&&!rows;k++){const L=genLayout();if(L&&fillRooms(L))rows=L}
  rows.forEach(row=>row.forEach(n=>n.x=10+n.c*16+ri(-3,3)));
  rows.push([{t:'rest',x:50,next:[0]}],[{t:'boss',x:50,next:[]}]);rows[ROWS-1].forEach(n=>n.next=[0]);
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
  const nodes=M.map((row,r)=>row.map((n,i)=>{const cur=run.pos&&run.pos.r===r&&run.pos.i===i,c=['nd','n-'+n.t,isOk(r,i)?'ok':'',vis.has(r+','+i)?'vis':'',cur?'cur':''].join(' ');
    return`<button type="button" class="${c}" style="left:${n.x}%;top:${Y(r)}px" data-n="${r},${i}" ${isOk(r,i)?'':'tabindex="-1"'} aria-label="${NODE_N[n.t]}${cur?' (you are here)':''}"><img src="${nodeIcon(n.t)}" alt="">${cur?`<i class="nflag"><img src="${flagArt()}" alt=""></i>`:''}</button>`}).join('')).join('')
    +`<button type="button" class="nd n-start ${run.pos?'vis':'cur'}" style="left:50%;top:${Y(-1)}px" data-start="1" aria-label="Start"><img src="${flagArt()}" alt=""></button>`;
  mapEl.innerHTML=`<div class="nm-head"><div class="eyebrow">Act ${run.act||1} of ${ACTS} · ${seedTag(run.seed)}${run.asc?` · Ascension ${run.asc}`:''} · <span class="gold">${gold()} gold</span></div><h2>${actBiome().n}</h2>${anyRoom?'<div class="eyebrow gold">Dev: pick any room</div>':''}${preview?`<button type="button" class="go nm-close" data-close="1">${typeof preview==='string'?preview:'Back to the Crossroads'}</button>`:''}</div>
    <div class="nm-scroll"><div class="nm-board" style="height:${H}px"><svg class="nm-trails" width="100%" height="${H}"></svg>${nodes}</div></div>
    ${(run.relics||[]).length||(run.meals||[]).length?`<div class="nm-relics">${(run.relics||[]).map(k=>`<button type="button" class="rl" data-rel="${k}" aria-label="${RELICS[k].n}"><img src="${relicArt(k)}" alt=""></button>`).join('')}${(run.meals||[]).map(x=>`<button type="button" class="rl ml" data-meal="${x.id}" aria-label="${MEALS[x.id].n}"><img src="${mealArt(x.id)}" alt=""><i>${x.n}</i></button>`).join('')}</div>`:''}
    <aside class="nm-side"><div class="ns-gold"><img src="${coinArt()}" alt="">${gold()} gold</div>
      <div class="ns-h gold">Relics${(run.relics||[]).length?` · ${run.relics.length}`:''}</div>${(run.relics||[]).map(k=>`<div class="ns-row"><img src="${relicArt(k)}" alt=""><span><b>${RELICS[k].n}</b>${RELICS[k].d}</span></div>`).join('')||''}
      ${(run.meals||[]).length?`<div class="ns-h">Meals</div>${run.meals.map(x=>`<div class="ns-row"><img src="${mealArt(x.id)}" alt=""><span><b>${MEALS[x.id].n}</b>${MEALS[x.id].d} · ${x.n} fight${x.n>1?'s':''} left</span></div>`).join('')}`:''}</aside>
    <div class="nm-info"></div>
    <aside class="nm-side nm-unit" hidden></aside>
    <div class="nm-squad">${run.roster.map((u,ui)=>`<div data-u="${ui}" role="button" tabindex="0"><img src="${uSpr(u)}" alt=""><span>${u.name}</span><small>Lv ${u.lv}</small>${squadHp(u)}</div>`).join('')}</div>`;
  tip('map','The road ahead','Click a glowing room to see what it is, then click it again to go there. 15 floors: fights (the red skull is an elite), events and camps that heal, with a tavern every 4 floors and a treasure room halfway. Then a camp and the boss.');
  mapEl.hidden=false;mapEl.style.background=`radial-gradient(ellipse at 50% 0%,${actBiome().bg},#121018 72%)`;
  mapEl._trails=()=>drawTrails(M,Y,vis);mapEl._trails();
  const sc=mapEl.querySelector('.nm-scroll'),focus=!anyRoom&&ok[0]?Y(ok[0].r):run.pos?Y(run.pos.r):H;sc.scrollTop=Math.max(0,focus-sc.clientHeight/2);
  /* the unit panel floats over the map; click the unit again, the ✕, anywhere off the panel, Esc or right-click to close it */
  const closeUnit=()=>{const box=mapEl.querySelector('.nm-unit');if(box)box.hidden=true;mapEl.querySelectorAll('.nm-squad .on').forEach(x=>x.classList.remove('on'))};
  mapEl.oncontextmenu=e=>{e.preventDefault();closeUnit()};mapEl.onkeydown=null;
  if(!mapEl._esc){mapEl._esc=1;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mapEl.hidden&&mapEl._close)mapEl._close()})}mapEl._close=closeUnit;
  return new Promise(res=>{let sel=null;mapEl.onclick=e=>{
    if(e.target.closest('[data-ux]')){closeUnit();return}
    if(!e.target.closest('.nm-unit,[data-u]'))closeUnit();
    if(preview&&e.target.closest('[data-equip],[data-drop],[data-salve]'))return;/* no changing kit while only looking */
    if(e.target.closest('[data-close]')){mapEl.onclick=null;mapEl.hidden=true;sfx('decline');return res(null)}
    const eq=e.target.closest('[data-equip]');if(eq){const u=run.roster[+eq.dataset.uu],it=u.items.splice(+eq.dataset.equip,1)[0];u.items.unshift(it);sfx('equip');saveGame();
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
/* the paths between rooms: curving trails of footprints. Drawn in pixels (so prints aren't squashed) and redrawn on resize.
   Each trail's bend comes from its rooms' positions, so it's the same every time the map opens. Walked trails are red. */
function drawTrails(M,Y,vis){
  const svg=mapEl.querySelector('.nm-trails');if(!svg)return;const W=svg.parentNode.clientWidth,H=+svg.getAttribute('height');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const hsh=(a,b,c)=>{const v=Math.sin(a*12.9898+b*78.233+c*37.719)*43758.5453;return v-Math.floor(v)};let out='';
  const trail=(x1,y1,x2,y2,walked,seed)=>{const dx=x2-x1,dy=y2-y1,L0=Math.hypot(dx,dy),px=-dy/L0,py=dx/L0,h=hsh(...seed),a=(10+h*16)*(h<.5?-1:1),b=hsh(seed[2],seed[0],seed[1])<.5?1:-.6;
    const c1=[x1+dx*.33+px*a,y1+dy*.33+py*a],c2=[x1+dx*.66+px*a*b,y1+dy*.66+py*a*b],at=t=>{const u=1-t;return[u*u*u*x1+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*x2,u*u*u*y1+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*y2]};
    const pts=[];for(let i=0;i<=60;i++)pts.push(at(i/60));let len=0,next=26,k=0;const lens=[0];for(let i=1;i<pts.length;i++)lens.push(len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
    for(let i=1;i<pts.length&&next<len-26;i++){if(lens[i]<next)continue;const[ax,ay]=pts[i-1],[bx,by]=pts[i],ang=Math.atan2(by-ay,bx-ax),s=k++%2?3:-3,x=bx-Math.sin(ang)*s,y=by+Math.cos(ang)*s;
      out+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang*180/Math.PI+90).toFixed(0)})" fill="${walked?'#8b2e16':'#5b3d20'}" opacity="${walked?1:.75}"><ellipse cy="-1.2" rx="1.8" ry="2.4"/><ellipse cy="2.6" rx="1.3" ry="1.3"/></g>`;next+=11}};
  M.forEach((row,r)=>row.forEach((n,i)=>n.next.forEach(j=>{const m=M[r+1]&&M[r+1][j];if(m)trail(n.x*W/100,Y(r),m.x*W/100,Y(r+1),vis.has(r+','+i)&&vis.has((r+1)+','+j),[r,i,j])})));
  M[0].forEach((n,i)=>trail(W/2,Y(-1),n.x*W/100,Y(0),vis.has('0,'+i),[-1,0,i]));
  svg.innerHTML=out}
addEventListener('resize',()=>{if(!mapEl.hidden&&mapEl._trails)mapEl._trails()});
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
  run.phase='map';saveGame();music(actBiome().id);ambience(null);
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
