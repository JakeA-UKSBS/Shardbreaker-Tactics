/* Player actions, fights, enemy AI and the turn loop */
/* ================= TURN FLOW ================= */

/* ==================================================================
   SELECTING AND MOVING: select a unit, show its reach, tap to move
   ================================================================== */
function clearSel(){sel=null;moveSet=null;fringe=null;targets=[];pending=null;inspect=null;itemSel=null}
function select(u){clearSel();sel=u.id;pre=clone(state);origin={x:u.x,y:u.y};moveSet=reach(u);fringe=fringeOf(u,moveSet);ui='move';render()}
function cancelMove(){const u=sel&&byId(sel);if(u&&origin){u.x=origin.x;u.y=origin.y}clearSel();ui='idle';render()}
function springTrap(u){const c=CH[state.ch],k=key(u.x,u.y);if(!c.traps||!c.traps.includes(k)||(state.sprung||[]).includes(k))return;
  (state.sprung=state.sprung||[]).push(k);const d=Math.min(6,u.hp-1);u.hp-=d;pop(u,'Trap -'+d,'dmg');sfx('chain');toast(`${u.name} set off a trap`)}
function freeNear(x,y,taken,u){const seen=new Set([key(x,y)]),q=[[x,y]];
  while(q.length){const[cx,cy]=q.shift(),k=key(cx,cy),c=u?mcost(u,cx,cy):ter(cx,cy).c;if(c<99&&!taken.has(k))return{x:cx,y:cy};
    for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy,nk=key(nx,ny);if(nx<0||ny<0||nx>=MW||ny>=MH||seen.has(nk))continue;seen.add(nk);q.push([nx,ny])}}
  return{x,y}}
function afterMove(u){
  /* always the command menu after moving: Attack / Heal are options in it, not the default */
  ui='menu';
  render();
}
function openConfirm(t){pending=t;const u=byId(sel);if(tmode==='atk')pendW=wpnsAt(u,man(u,t))[0];ui='confirm';render();
  if(tmode==='atk')tip('forecast','Battle forecast','This shows damage, hit chance and crit chance for both sides. A gold Effective chip means a hit deals double weapon might. Tap the enemy again, or press Attack, to strike.');}
function bestApproach(u,o){
  let best=null,bs2=-1e9;
  for(const k of moveSet){const[x,y]=k.split(',').map(Number),d=Math.abs(x-o.x)+Math.abs(y-o.y);if(!wpnsAt(u,d).length)continue;
    const s=(x===origin.x&&y===origin.y?100:0)+ter(x,y).av-(Math.abs(x-origin.x)+Math.abs(y-origin.y));if(s>bs2){bs2=s;best={x,y}}}
  return best;
}

/* ==================================================================
   TAPS ON THE MAP: what a tap does in each ui state (idle, move, menu, target, confirm)
   ================================================================== */
function tap(x,y){
  if(busy||over||phase!=='player'||!modalEl.hidden)return;
  const o=unitAt(x,y),k=key(x,y);
  if(ui==='move'){
    const u=byId(sel);
    if(moveSet.has(k)){stepSfx(u);u.x=x;u.y=y;springTrap(u);afterMove(u);return}
    if(o&&o.team==='e'&&fringe.has(k)){const t=bestApproach(u,o);if(t){if(t.x!==u.x||t.y!==u.y)stepSfx(u);u.x=t.x;u.y=t.y;targets=atkTargets(u);tmode='atk';openConfirm(o);return}}
    if(o&&o.team==='p'&&!o.acted&&o!==u){cancelMove();select(o);return}
    cancelMove();return;
  }
  if(ui==='menu'||ui==='items'){cancelMove();return}
  if(ui==='target'||ui==='confirm'){const t=targets.find(t=>x>=t.x&&y>=t.y&&x<t.x+(t.sz||1)&&y<t.y+(t.sz||1));/* any tile of a 2×2 boss counts */
    if(t&&ui==='confirm'&&t===pending){act(tmode==='heal'?'doheal':'attack-go');return}
    if(t){sfx('select');openConfirm(t)}else{pending=null;ui='menu';render()}return}
  clearSel();
  if(o&&o.team==='p'&&!o.acted){sfx('select');select(o);return}
  if(o){sfx('select');inspect=o;moveSet=reach(o);fringe=fringeOf(o,moveSet);ui='idle';render();return}
  const t=ter(x,y),vil=MAP[y][x]==='V';
  terInfo=`<div class="ch"><b>${t.n}</b><span>Terrain</span></div><p class="hint">${t.c>=99?'Impassable.':'Move cost '+t.c+'.'}${t.df?' +'+t.df+' Def.':''}${t.av?' +'+t.av+' Avoid.':''}${t.heal?' Heals 10% HP each turn.':''}${vil?(state.visited.includes(k)?' Already visited.':' Move a unit here and choose Visit for a gift.'):''}${MAP[y][x]==='C'?(state.visited.includes(k)?' Empty.':' Move a unit here and choose Open.'):''}</p>`;
  threatTile=k;terInfo+=threatLine(k);ui='terrain';render();
}

/* ==================================================================
   ENDING AN ACTION: commit the move, finish, prompt to end the turn
   ================================================================== */
function commit(){history.push(pre);const u=byId(sel);if(u)u.acted=true}
function finishAction(){clearSel();ui='idle';render();checkEnd();if(over)return;saveGame();promptEnd()}
function promptEnd(){setTimeout(async()=>{
  if(phase!=='player'||over||busy||!modalEl.hidden||!storyEl.hidden||!state.units.filter(u=>u.team==='p').every(u=>u.acted))return;
  const m=await modal(`<h2>All units have moved</h2><p>End your turn and let the enemy move?</p><div class="mbtns"><button type="button" data-m="no">Not yet</button><button class="go" type="button" data-m="end">End turn</button></div>`);
  if(m==='end'&&phase==='player'&&!busy&&!over)enemyPhase()},350)}

/* ==================================================================
   CHARTS: the effective-damage chart (live) and the old weapon/element cycle (switched off)
   ================================================================== */
function cycleSvg(nodes,R,lab){
  const n=nodes.length,cx=120,cy=n===3?112:108,H=n===3?200:205,r=n===3?28:22;
  const pts=nodes.map((_,i)=>{const a=(-90+i*360/n)*Math.PI/180;return[cx+R*Math.cos(a),cy+R*Math.sin(a)]});
  let svg=`<svg viewBox="0 0 240 ${H}" width="100%" style="max-width:280px;display:block;margin:0 auto" role="img" aria-label="${lab}"><defs><marker id="ah${n}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#d8b15a"/></marker></defs>`;
  for(let i=0;i<n;i++){const[a,b]=pts[i],[c,d]=pts[(i+1)%n],L=Math.hypot(c-a,d-b),ux=(c-a)/L,uy=(d-b)/L;svg+=`<line x1="${a+ux*(r+2)}" y1="${b+uy*(r+2)}" x2="${c-ux*(r+4)}" y2="${d-uy*(r+4)}" stroke="#d8b15a" stroke-width="2.5" marker-end="url(#ah${n})"/>`}
  nodes.forEach((nd,i)=>{const[a,b]=pts[i];svg+=`<circle cx="${a}" cy="${b}" r="${r}" fill="${nd.c}"/>`;
    if(nd.icons){nd.icons.forEach((k,j)=>{svg+=`<image href="${icon(k)}" x="${a-17+j*16}" y="${b-17}" width="18" height="18" style="image-rendering:pixelated"/>`});svg+=`<text x="${a}" y="${b+14}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1a1420" font-family="system-ui,sans-serif">${nd.l}</text>`}
    else svg+=`<text x="${a}" y="${b+4}" text-anchor="middle" font-size="${nd.l.length>6?8.5:11}" font-weight="700" fill="#1a1420" font-family="system-ui,sans-serif">${nd.l}</text>`});
  return svg+'</svg>';
}
/* the effective-damage chart: pictures, not paragraphs. Each row: what it is → what beats it */
function effChart(){
  const ic=k=>`<img src="${icon(k)}" alt="${IT[k].n}" title="${IT[k].n}">`,tg=t=>`<img src="${tagArt(t)}" alt="">`,sk=k=>`<span class="ec-sk" title="${SKILLS[k].d}">${SKILLS[k].n}</span>`;
  const rows=[['flier',['shortBow','crossbow','longbow'],null,'×2'],['armoured',['warHammer'],'heavybane','×2'],['beast',['huntSpear'],'bladebane','×2'],['colossal',['giantslayer'],null,'×2'],['spectral',['lightT','holySword'],'polebane','×2',1],['plant',['flameT'],null,'×2']];
  return modal(`<div class="eyebrow">Effective damage</div><h2>What beats what</h2>
    <div class="ec">${rows.map(([t,ws,s,m,pal])=>`<div class="ec-r"><div class="ec-w">${ws.map(ic).join('')}${s?sk(s):''}${pal?'<span class="ec-sk" title="Paladins are effective against spectres with any weapon">Paladins</span>':''}</div><span class="ec-a">▶<em>${m}</em></span><div class="ec-t">${tg(t)}<b>${TAGS[t].n}</b></div></div>`).join('')}</div>
    <p class="hint">Effective hits multiply weapon might. A monster's type is on its info sheet.</p>
    <div class="mbtns"><button class="go" type="button" data-m="ok">Close</button></div>`);
}
function typeChart(){
  const wpn=cycleSvg([{l:'Blades',c:'#c9d3e2',icons:['ironJian','ironDao']},{l:'Heavy',c:'#d8b88a',icons:['ironAxe','ironJi']},{l:'Polearms',c:'#e0a49a',icons:['ironSpear','javelin']}],70,'Weapon cycle');
  const ele=cycleSvg(['fire','nature','water'].map(e=>({l:ELN[e],c:ELC[e]})),70,'Element cycle');
  const ic=k=>`<img src="${icon(k)}" alt="" style="width:22px;height:22px;image-rendering:pixelated;vertical-align:middle">`;
  return modal(`<div class="eyebrow">Type chart</div><h2>Weapons</h2>${wpn}
   <p>Each arrow points at what it beats. Advantage gives +15 Hit and +1 damage.</p>
   <h2>Arts</h2>${ele}
   <p><b>Dark</b> sigils heal their user for a third of the damage they deal.</p>
   <p><b>Neutral:</b> ${['shortBow','crossbow','lightT'].map(ic).join('')} bows, crossbows and Light sigils. Arts against weapons are always neutral.</p>
   <p><b>Bows beat fliers:</b> double weapon might against Harpies, wyverns and anything else with wings.</p>
   <div class="mbtns"><button class="go" type="button" data-m="ok">Close</button></div>`);
}


/* ==================================================================
   COMMAND MENU ACTIONS: everything the buttons do (attack, heal, items, trade, wait…)
   ================================================================== */
async function act(a){
  const u=sel&&byId(sel);
  if(a.startsWith('sheet:')){openSheet(byId(a.slice(6)));return}
  if(a==='chart'){effChart();return}
  if(a==='cancel'){cancelMove();return}
  if(a==='menu'){pending=null;targets=[];itemSel=null;ui='menu';render();return}
  if(a==='attack'){targets=atkTargets(u);tmode='atk';pending=null;ui='target';render();return}
  if(a==='heal'){targets=healTargets(u);tmode='heal';pending=null;ui='target';render();return}
  if(a==='back'){pending=null;ui='target';render();return}
  if(a==='items'){itemSel=null;ui='items';render();return}
  if(a==='trade'){busy=true;await tradeWith(u);busy=false;render();return}
  if(a.startsWith('item:')){itemSel=+a.slice(5);render();return}
  if(a==='equip'){const it=u.items.splice(itemSel,1)[0];u.items.unshift(it);itemSel=0;render();return}
  if(a==='wprev'||a==='wnext'){const l=wpnsAt(u,man(u,pending)),i=l.indexOf(pendW);pendW=l[(i+(a==='wnext'?1:l.length-1))%l.length];render();return}
  if(a==='wait'){commit();finishAction();return}
  if(a==='summon'){if(!canSummon(u))return;commit();doSummon(u);finishAction();return}
  if(a==='learn'){const it=u.items[itemSel],k=IT[it.k].skill;if(learnBlock(u,k))return;(u.skills=u.skills||[]).push({id:k,src:'scroll'});u.items.splice(itemSel,1);itemSel=null;sfx('item');toast(`${u.name} learned ${SKILLS[k].n}`);saveGame();render();return}
  if(a==='ascend'){if(promoBlock(u))return;const to=await promoPick(u);if(!to){render();return}commit();u.items.splice(itemSel,1);itemSel=null;busy=true;clearSel();ui='idle';render();await ascend(u,to);busy=false;finishAction();return}
  if(a==='use'){commit();const it=u.items[itemSel],amt=Math.min(salveAmt(it.k),u.maxhp-u.hp);u.hp+=amt;if(u.psn){u.psn=0;toast(`${u.name} is cured`)}it.u--;if(it.u<=0)u.items.splice(itemSel,1);pop(u,'+'+amt,'heal');finishAction();return}
  if(a==='gift'&&/^(gold:|pyrite)/.test(giftHere(u).item)){commit();const g=giftHere(u),n=g.item==='pyrite'?0:+g.item.slice(5);state.visited.push(g.k);run.gold=gold()+n;sfx(n?'item':'broke');clearSel();ui='idle';render();
    await modal(`<div class="itemget"><img src="${chestArt()}" alt=""><div class="eyebrow">${n?'Found':'Fool’s gold'}</div><h2>${n?n+' gold':'Pyrite'}</h2><p>${n?`${u.name} scoops up ${n} gold.`:'It glitters like gold, but it’s pyrite. Worthless.'}</p></div><div class="mbtns"><button class="go" type="button" data-m="ok">OK</button></div>`);
    finishAction();return}
  if(a==='gift'){commit();const g=giftHere(u),full=u.items.length>=5;state.visited.push(g.k);sfx('item');if(!full)u.items.push({k:g.item,u:IT[g.item].uses});else(state.loot=state.loot||[]).push(g.item);clearSel();ui='idle';render();
    await modal(`<div class="itemget"><img src="${icon(g.item)}" alt=""><div class="eyebrow">${g.kind==='Visit'?'Received':'Found'}</div><h2>${IT[g.item].n}</h2><p>${full?`${u.name}'s bag is full. It's added to the spoils, so you can hand it out after the battle.`:`${u.name} obtained ${IT[g.item].n}.`}</p><p class="skd">${itemInfo(u,g.item).replace(/^<b>[^<]*<\/b> · /,'')}</p></div><div class="mbtns"><button class="go" type="button" data-m="ok">OK</button></div>`);
    finishAction();return}
  if(a==='talk'){commit();const r=talkTarget(u),lines=TALKS[r.id]||[[r.id,'I\'ll fight with you.']];clearSel();ui='idle';render();
    for(const[who,line]of lines){const sp=who==='lord'?u:r;await modal(`<div class="talk"><img src="${portrait(sp)}" alt=""><p><b>${sp.name}</b>${line.replace('{lord}',u.name)}</p></div><div class="mbtns"><button class="go" type="button" data-m="ok">Next</button></div>`)}
    const h=heroDef(r.id);r.team='p';r.recruit=false;r.hold=false;r.acted=false;r.g=h.g;r.items.forEach(i=>delete i.d);sfx('item');toast(`${r.name} joined you`);finishAction();return}
  if(a==='doheal'){commit();const t=pending,si=spiritFor(u,t),w=IT[u.items[si].k],amt=Math.min(w.amt,t.maxhp-t.hp);t.hp+=amt;u.items[si].u--;if(u.items[si].u<=0){toast(w.n+' broke');u.items.splice(si,1)}pop(t,'+'+amt,'heal');sfx('heal');clearSel();ui='idle';busy=true;render();
    const g=gainExp(u,Math.round(15*EXP_RATE));await showExp(u,g);if(g&&g.gains)await levelUp(u,g);busy=false;finishAction();return}
  if(a==='attack-go'){commit();const t=pending,it=u.items.splice(pendW,1)[0];u.items.unshift(it);clearSel();ui='idle';await fight(u,0,t);saveGame();promptEnd();return}
}

/* ==================================================================
   COMBAT: resolve a fight, play it, then EXP, item use, poison and other after-effects
   ================================================================== */
async function fight(a,ai,d){
  busy=true;render();if(ensureVisible(d.x,d.y))await sleep(380);
  const res=resolve(a,ai,d);
  if(settings.anim)await scenePlay(a,d,res);else await quickPlay(a,d,res);
  a.hp=res.hpA;d.hp=res.hpD;
  for(const u of[a,d])if(u.team==='p'&&u.hp<=0&&R('phoenix')&&!run.phx){u.hp=1;run.phx=1;pop(u,'Phoenix!','heal');sfx('rise');toast(`The Phoenix Feather saves ${u.name}`)}
  for(const[u,i,n]of[[a,ai,res.used.a],[d,res.f.di,res.used.d]]){if(i<0||!n)continue;const it=u.items[i];if(endless(it.k))continue;it.u-=n;if(it.u<=0){u.items.splice(i,1);sfx('broke');toast(`${u.name}'s ${IT[it.k].n} broke`)}}
  for(const u of [a,d])if(u.turncoat&&u.team==='e'&&u.hp>0&&u.hp<=Math.ceil(u.maxhp/3)){u.team='p';u.turncoat=false;u.acted=true;state.freed=true;pop(u,'Freed!','heal');sfx('ding')}
  const p=a.team==='p'?a:d.team==='p'?d:null,o=p===a?d:a;
  for(const e of res.ev)if(e.psn){const t=e.by==='a'?d:a;if(t.team==='p'&&M('soup'))continue;if(t.hp>0){t.psn=3;pop(t,'Poisoned','crit')}}
  for(const e of res.ev)if(e.stone){const t=e.by==='a'?d:a;if(t.hp>0&&!t.boss){t.stone=1;pop(t,'Stone!','crit');sfx('earth')}}
  /* a summon's EXP goes to the unit that summoned it */
  const ep=p&&p.summon?state.units.find(x=>x.id===p.owner&&x.hp>0):p;
  if(p&&p.hp>0&&ep){const dealt=res.ev.some(e=>(e.by==='a')===(p===a)&&e.dmg>0);const g=gainExp(ep,Math.min(100,Math.round(expFor(ep,o,dealt,o.hp<=0)*EXP_RATE*(R('tome')?1.5:1)*(has(ep,'quickstudy')?2:1))));if(ep!==p&&g)toast(`${ep.name} gains ${g.amt} EXP`);await showExp(ep,g);if(g&&g.gains)await levelUp(ep,g)}
  if(p&&o.hp<=0&&p.hp>0&&R('fang')){const h=Math.min(5,p.maxhp-p.hp);if(h){p.hp+=h;pop(p,'+'+h,'heal')}}
  if(p&&o.hp<=0&&p.hp>0)/* enemy drops go to the spoils: after the win the Found picker asks who takes each one */
    for(const it of o.items.filter(i=>i.d)){(state.loot=state.loot||[]).push(it.k);pop(o,IT[it.k].n+' dropped','heal');toast(`${IT[it.k].n} dropped: added to the spoils`)}
  await closeScene();
  if(a.hp>0&&d.hp<=0&&a.team==='p'&&phase==='player'&&has(a,'momentum')&&a.gf!==state.turn){a.gf=state.turn;a.acted=false;pop(a,'Momentum!','heal')}
  if(a.hp>0&&has(a,'hitrun')&&man(a,d)===1){let best=null,bd=-1;for(const[dx,dy]of DIRS){const x=a.x+dx,y=a.y+dy;if(x<0||y<0||x>=MW||y>=MH||unitAt(x,y)||mcost(a,x,y)>=99)continue;
    const dd=Math.min(99,...state.units.filter(o=>hostile(o,a)&&o.hp>0).map(o=>man(o,{x,y})));if(dd>bd){bd=dd;best={x,y}}}if(best&&bd>1){a.x=best.x;a.y=best.y}}
  render();if(a.hp<=0||d.hp<=0)await sleep(380);
  state.units=state.units.filter(u=>u.hp>0);busy=false;render();checkEnd();
}

/* ==================================================================
   GOALS AND WIN/LOSS: rout, boss, defend, protect; checkEnd() after every action
   ================================================================== */
const foesLeft=()=>state.units.filter(u=>u.team==='e'&&u.hp>0&&!u.recruit).length;
function protectU(){const c=CH[state.ch];return c.protect?state.units.find(u=>u.id===c.protect):null}
function goalWon(){const c=CH[state.ch],g=c.goal||'boss';
  if(g==='rout')return foesLeft()===0;
  if(g==='defend')return state.turn>c.turns;
  if(g==='reach'){const l=state.units.find(u=>u.lord);return!!l&&MAP[l.y][l.x]==='X'}
  if(g==='duel')return state.stage===2&&foesLeft()===0;
  return!state.units.some(u=>u.boss)}
function goalText(){const c=CH[state.ch],g=c.goal||'boss',b=state.units.find(u=>u.boss);
  if(g==='rout')return`Rout the enemy <span class="on">${foesLeft()} left</span>`;
  if(g==='defend')return`Hold out for ${c.turns} turns <span class="on">turn ${Math.min(state.turn,c.turns)} of ${c.turns}</span>`;
  if(g==='reach')return`Get ${lordName()} to the exit`;
  if(g==='duel')return state.stage===2?`Defeat the Shell Matriarch and her horde <span class="on">${foesLeft()} left</span>`:'Break Silas free: bring him to a third of his HP or less, alone. If he dies, he is gone for good.';
  return`Defeat ${b?b.name:'the boss'}`}
function goalShort(){const c=CH[state.ch],g=c.goal||'boss',b=state.units.find(u=>u.boss);
  if(g==='rout')return`Rout · ${foesLeft()} left`;
  if(g==='defend')return`Hold · turn ${Math.min(state.turn,c.turns)}/${c.turns}`;
  if(g==='reach')return'Reach the exit';
  if(g==='duel')return state.stage===2?`Rout · ${foesLeft()} left`:'Break Silas free';
  return`Defeat ${b?b.name.replace(/^(The|Captain|Matron) /,'').replace(/ the .*/,''):'boss'}`}
function loseText(){return'Every unit falls'}
function checkEnd(){if(over)return;const c=CH[state.ch];
  if(!state.units.some(u=>u.team==='p'&&!u.summon)){over='lose';render();loseScreen();return}
  if(c.goal==='duel'&&state.stage!==2&&!state.units.some(u=>u.id==='silas'&&u.team==='e')){stageTwo();return}
  if(goalWon()){over='win';render();winScreen()}}

/* ==================================================================
   REINFORCEMENTS AND PHASE START: waves, stage two, healing at the start of a phase
   ================================================================== */
function spawnWaves(t){const w=CH[state.ch].waves;if(!w||!w[t])return;const bo=state.units.find(u=>u.boss&&u.team==='e'&&u.id==='boss');
  const fs=typeof w[t]==='function'?w[t]():w[t].filter(d=>!d.ifBoss||bo).map((d,i)=>{const u=mkMon(d.c,d.lv);u.id=`w${t}_${i}`;u.x=d.ifBoss?bo.x:d.x;u.y=d.ifBoss?bo.y:d.y;return u});
  if(!fs.length)return;const taken=new Set(state.units.filter(u=>u.hp>0).flatMap(u=>cellsOf(u.x,u.y,u.sz).map(c=>key(...c))));
  for(const f of fs){const p=freeNear(f.x,f.y,taken,f);f.x=p.x;f.y=p.y;taken.add(key(p.x,p.y));state.units.push(f)}render();toast(bo&&CH[state.ch].waves[t][0]?.ifBoss?CH[state.ch].summonTxt||`${bo.name} raises the dead!`:'Enemy reinforcements!')}
async function stageTwo(){
  busy=true;const c=CH[state.ch];state.stage=2;render();await sleep(500);
  await playStory(STORY[state.ch]&&(state.freed?STORY[state.ch].freed:STORY[state.ch].mid));
  const taken=new Set(state.units.map(u=>key(u.x,u.y)));
  (state.reserve||[]).forEach((h,i)=>{const st=c.start2[i]||c.start2.at(-1),p=freeNear(st[0],st[1],taken,h);h.x=p.x;h.y=p.y;h.acted=false;taken.add(key(p.x,p.y));state.units.push(h)});state.reserve=[];
  for(const f of c.horde()){const p=freeNear(f.x,f.y,taken,f);f.x=p.x;f.y=p.y;taken.add(key(p.x,p.y));state.units.push(f)}
  busy=false;render();banner('The party arrives','p');saveGame();
}
function phaseHeal(team){
  for(const u of state.units)if(u.team===team&&u.psn>0){const d=Math.min(3,u.hp-1);if(d>0){u.hp-=d;pop(u,'-'+d,'crit')}u.psn--}
  for(const u of state.units)if(u.team===team&&ter(u.x,u.y).heal&&u.hp<u.maxhp){const a=Math.min(Math.ceil(u.maxhp*.1),u.maxhp-u.hp);u.hp+=a;pop(u,'+'+a,'heal')}
  for(const c of state.units.filter(u=>u.team===team&&has(u,'renewal')))for(const u of state.units)if(u.team===team&&u!==c&&man(u,c)===1&&u.hp<u.maxhp){const a=Math.min(5,u.maxhp-u.hp);u.hp+=a;pop(u,'+'+a,'heal')}
  if(team==='p'&&R('sprig'))for(const u of state.units)if(u.team==='p'&&u.hp>0&&u.hp<u.maxhp){u.hp++;pop(u,'+1','heal')}
  if(team==='p'&&R('salvebag'))for(const u of state.units)if(u.team==='p'&&u.hp<u.maxhp){const a=Math.min(3,u.maxhp-u.hp);u.hp+=a;pop(u,'+'+a,'heal')}
}

/* ==================================================================
   ENEMY AI: distance field, plan an attack (or close in), then run the enemy phase
   ================================================================== */
function field(ts,u){
  const dist={},q=[];for(const p of ts){dist[key(p.x,p.y)]=0;q.push([p.x,p.y])}
  while(q.length){q.sort((a,b)=>dist[key(...a)]-dist[key(...b)]);const[x,y]=q.shift(),d=dist[key(x,y)];
    for(const[dx,dy]of DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const c=u?mcost(u,nx,ny):ter(nx,ny).c;if(c>=99)continue;const nd=d+c,k=key(nx,ny);if(dist[k]===undefined||nd<dist[k]){dist[k]=nd;q.push([nx,ny])}}}
  return dist;
}
function aiPlan(e){
  const tiles=[...reach(e)].map(k=>k.split(',').map(Number)),ps=state.units.filter(u=>u.hp>0&&hostile(u,e));let best=null;
  for(const[x,y]of tiles)for(const p of ps){const d=man({x,y,sz:e.sz},p);
    for(const wi of wpnsAt(e,d)){const f=forecast({...e,x,y},wi,p),A=f.A,D=f.D;
      const s=A.dmg*A.n*A.hit/100+(A.dmg*A.n>=p.hp?40:0)-(D?D.dmg*D.n*D.hit/200:0)+ter(x,y).av/10+(p.lord?3:0)+(has(p,'taunt')||markedU(p)?25:0);
      if(!best||s>best.s)best={s,tile:{x,y},target:p,wi}}}
  if(best||e.hold||e.mov===0)return best||{};
  const F=field(ps,e);let bt=null,bv=1e9;for(const[x,y]of tiles){const v=(F[key(x,y)]??999)-ter(x,y).av/100;if(v<bv){bv=v;bt={x,y}}}
  return{tile:bt};
}
async function enemyPhase(){
  history.push(clone(state));clearSel();ui='idle';phase='enemy';busy=true;render();
  for(const u of state.units)if(u.team==='p')u.stone=0;
  if(state.units.some(u=>u.team==='g')){phaseHeal('g');await runAI('g');if(over)return}
  banner('Enemy Phase','e');await sleep(950);
  phaseHeal('e');render();await runAI('e');
  busy=false;if(over)return;
  spawnWaves(state.turn+1);
  state.turn++;state.units.forEach(u=>u.acted=false);phase='player';phaseHeal('p');
  checkEnd();if(over)return;
  for(const u of state.units)if(u.team==='p'&&u.stone)u.acted=true;
  render();banner('Player Phase','p');
  const l=state.units.find(u=>u.lord);if(l)ensureVisible(l.x,l.y);saveGame();
  if(state.ch===0)tip('enemy','Plan around the enemy','Press Danger to shade every tile an enemy can reach next turn.');
}
async function runAI(team){
  if(team==='g'){banner('Other Phase','g');await sleep(950)}
  for(const e of state.units.filter(u=>u.team===team)){
    if(e.hp<=0||over)continue;if(e.stone){e.stone=0;render();continue}const plan=aiPlan(e);
    if(plan.tile&&(plan.tile.x!==e.x||plan.tile.y!==e.y)){if(ensureVisible(plan.tile.x,plan.tile.y))await sleep(300);stepSfx(e);e.x=plan.tile.x;e.y=plan.tile.y;render();await sleep(330)}
    if(plan.target&&plan.target.hp>0){await fight(e,plan.wi,plan.target);busy=true}
    if(over)break;
  }
}

