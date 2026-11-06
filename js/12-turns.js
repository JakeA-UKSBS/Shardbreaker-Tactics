/* Player actions, fights, enemy AI and the turn loop */
/* ================= TURN FLOW ================= */

/* ==================================================================
   SELECTING AND MOVING: select a unit, show its reach, click to move
   ================================================================== */
function clearSel(){sel=null;moveSet=null;fringe=null;targets=[];pending=null;inspect=null;itemSel=null;abSel=null;abT=null;aimSet=null}
function select(u){clearSel();sel=u.id;origin={x:u.x,y:u.y};moveSet=reach(u);fringe=fringeOf(u,moveSet);ui='move';render()}
function cancelMove(){const u=sel&&byId(sel);if(u&&origin){u.x=origin.x;u.y=origin.y}clearSel();ui='idle';render()}
function freeNear(x,y,taken,u){const seen=new Set([key(x,y)]),q=[[x,y]];
  while(q.length){const[cx,cy]=q.shift(),k=key(cx,cy),c=u?mcost(u,cx,cy):ter(cx,cy).c;if(c<99&&!taken.has(k))return{x:cx,y:cy};
    for(const[dx,dy]of DIRS){const nx=cx+dx,ny=cy+dy,nk=key(nx,ny);if(nx<0||ny<0||nx>=MW||ny>=MH||seen.has(nk))continue;seen.add(nk);q.push([nx,ny])}}
  return{x,y}}
function afterMove(u){
  /* always the command menu after moving: Attack / Heal are options in it, not the default */
  ui='menu';
  render();
}
function openConfirm(t){pending=t;const u=byId(sel);if(tmode==='atk')pendW=wpnsAt(u,man(u,t),t)[0];ui='confirm';render();
  if(tmode==='atk')tip('forecast','Battle forecast','This shows damage, hit chance and crit chance for both sides. A gold Effective chip means a hit deals double weapon might. Click the enemy again, or press Attack, to strike.');}
function bestApproach(u,o){
  let best=null,bs2=-1e9;
  for(const k of moveSet){const[x,y]=k.split(',').map(Number),d=Math.abs(x-o.x)+Math.abs(y-o.y);if(!wpnsAt({...u,x,y},d,o).length)continue;
    const s=(x===origin.x&&y===origin.y?100:0)+ter(x,y).av-(Math.abs(x-origin.x)+Math.abs(y-origin.y));if(s>bs2){bs2=s;best={x,y}}}
  return best;
}

/* the best tile in reach to heal ally o from (staying put if possible) */
function healApproach(u,o){
  let best=null,bs2=-1e9;
  for(const k of moveSet){const[x,y]=k.split(',').map(Number);if(spiritFor({...u,x,y},o)<0)continue;
    const s=(x===origin.x&&y===origin.y?100:0)+ter(x,y).av-(Math.abs(x-origin.x)+Math.abs(y-origin.y));if(s>bs2){bs2=s;best={x,y}}}
  return best;
}

/* ==================================================================
   TAPS ON THE MAP: what a click does in each ui state (idle, move, menu, target, confirm)
   ================================================================== */
function tap(x,y){
  if(busy||over||phase!=='player'||!modalEl.hidden)return;
  const o=unitAt(x,y),k=key(x,y);
  if(ui==='move'){
    const u=byId(sel);
    if(moveSet.has(k)){stepSfx(u,x,y);u.x=x;u.y=y;if(u.tumbled){u.tumbled=0;fringe=null}afterMove(u);return}
    if(o&&o.team==='e'&&fringe.has(k)){const t=bestApproach(u,o);if(t){if(t.x!==u.x||t.y!==u.y)stepSfx(u,t.x,t.y);u.x=t.x;u.y=t.y;targets=atkTargets(u);tmode='atk';openConfirm(o);return}}
    if(o&&o.team==='p'&&o!==u&&o.hp<o.maxhp&&staffIdx(u)>=0){const t=healApproach(u,o);if(t){if(t.x!==u.x||t.y!==u.y)stepSfx(u,t.x,t.y);u.x=t.x;u.y=t.y;targets=healTargets(u);tmode='heal';openConfirm(o);return}}
    if(o&&o.team==='p'&&!o.acted&&o!==u){cancelMove();select(o);return}
    cancelMove();return;
  }
  if(ui==='aim'){abTap(x,y);return}
  if(ui==='menu'||ui==='items'||ui==='abil'){cancelMove();return}
  if(ui==='target'||ui==='confirm'){const t=targets.find(t=>x>=t.x&&y>=t.y&&x<t.x+(t.sz||1)&&y<t.y+(t.sz||1));/* any tile of a 2×2 boss counts */
    if(t&&ui==='confirm'&&t===pending){act(tmode==='heal'?'doheal':'attack-go');return}
    if(t){sfx('select');openConfirm(t)}else{pending=null;ui='menu';render()}return}
  clearSel();
  if(o&&o.team==='p'&&!o.acted){sfx('select');select(o);return}
  if(o){sfx('select');inspect=o;moveSet=reach(o);fringe=fringeOf(o,moveSet);ui='idle';render();return}
  const t=ter(x,y);
  terInfo=`<div class="ch"><b>${t.n}</b><span>Terrain · Height ${hOf(x,y)}</span></div><p class="hint">${t.c>=99?'Impassable.':'Move cost '+t.c+'.'}${t.df?' +'+t.df+' Def.':''}${t.av?' +'+t.av+' Avoid.':''}${t.heal?' Heals 10% HP each turn.':''}</p>`;
  threatTile=k;terInfo+=threatLine(k);ui='terrain';render();
}

/* ==================================================================
   ENDING AN ACTION: commit the move, finish, prompt to end the turn
   ================================================================== */
function commit(){const u=byId(sel);if(u)u.acted=true}
function finishAction(){clearSel();ui='idle';render();checkEnd();if(over)return;saveGame();promptEnd()}
function promptEnd(){setTimeout(async()=>{
  if(phase!=='player'||over||busy||!modalEl.hidden||!state.units.filter(u=>u.team==='p').every(u=>u.acted))return;
  const m=await modal(`<h2>All units have moved</h2><p>End your turn and let the enemy move?</p><div class="mbtns"><button type="button" data-m="no">Not yet</button><button class="go" type="button" data-m="end">End turn</button></div>`);
  if(m==='end'&&phase==='player'&&!busy&&!over)enemyPhase()},350)}

/* ==================================================================
   CHARTS: the effective-damage chart
   ================================================================== */
/* the effective-damage chart: pictures, not paragraphs. Each row: what it is → what beats it */
function effChart(){
  const ic=k=>`<img src="${icon(k)}" alt="${IT[k].n}" title="${IT[k].n}">`,tg=t=>`<img src="${tagArt(t)}" alt="">`,sk=k=>`<span class="ec-sk" title="${SKILLS[k].d}">${SKILLS[k].n}</span>`;
  const rows=[['flier',['shortBow','crossbow','longbow'],null,'×2'],['armoured',['warHammer'],'stonebane','×2'],['beast',['huntingSpear'],'wolfsbane','×2'],['colossal',['giantslayer'],null,'×2'],['spectral',['dawnSigil','holySword'],'spiritbane','×2',1],['plant',['emberSigil'],null,'×2']];
  return modal(`<div class="eyebrow">Effective damage</div><h2>What beats what</h2>
    <div class="ec">${rows.map(([t,ws,s,m,pal])=>`<div class="ec-r"><div class="ec-w">${ws.map(ic).join('')}${s?sk(s):''}${pal?'<span class="ec-sk" title="Paladins are effective against spectres with any weapon">Paladins</span>':''}</div><span class="ec-a">▶<em>${m}</em></span><div class="ec-t">${tg(t)}<b>${TAGS[t].n}</b></div></div>`).join('')}</div>
    <p class="hint">Effective hits multiply weapon might. A monster's type is on its info sheet.</p>
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
  if(a==='abil'||a.startsWith('ab:')||a==='abuse'){await abAct(u,a);return}
  if(a==='menu'){pending=null;targets=[];itemSel=null;ui='menu';render();return}
  if(a==='attack'){targets=atkTargets(u);tmode='atk';pending=null;ui='target';render();return}
  if(a==='heal'){targets=healTargets(u);tmode='heal';pending=null;ui='target';render();return}
  if(a==='back'){pending=null;ui='target';render();return}
  if(a==='items'){itemSel=null;ui='items';render();return}
  if(a==='trade'){busy=true;await tradeWith(u);busy=false;render();return}
  if(a.startsWith('item:')){itemSel=+a.slice(5);render();return}
  if(a==='equip'){const it=u.items.splice(itemSel,1)[0];u.items.unshift(it);itemSel=0;render();return}
  if(a==='wprev'||a==='wnext'){const l=wpnsAt(u,man(u,pending),pending),i=l.indexOf(pendW);pendW=l[(i+(a==='wnext'?1:l.length-1))%l.length];render();return}
  if(a==='wait'){commit();finishAction();return}
  if(a==='summon'){if(!canSummon(u))return;commit();doSummon(u);finishAction();return}
  if(a==='use'){commit();const it=u.items[itemSel],amt=Math.min(salveAmt(it.k),u.maxhp-u.hp);u.hp+=amt;if(u.psn){u.psn=0;toast(`${u.name} is cured`)}it.u--;if(it.u<=0)u.items.splice(itemSel,1);pop(u,'+'+amt,'heal');finishAction();return}
  if(a==='doheal'){commit();const t=pending,si=spiritFor(u,t),w=IT[u.items[si].k],amt=Math.min(w.amt,t.maxhp-t.hp);t.hp+=amt;if(!endless(u.items[si].k)){u.items[si].u--;if(u.items[si].u<=0){toast(w.n+' shattered');u.items.splice(si,1)}}pop(t,'+'+amt,'heal');sfx('heal');clearSel();ui='idle';busy=true;render();
    const g=gainExp(u,Math.round(15*EXP_RATE));await showExp(u,g);if(g&&g.gains)await levelUp(u,g);busy=false;finishAction();return}
  if(a==='attack-go'){commit();const t=pending,it=u.items.splice(pendW,1)[0];u.items.unshift(it);clearSel();ui='idle';await fight(u,0,t);saveGame();promptEnd();return}
}

/* ==================================================================
   COMBAT: resolve a fight, play it, then EXP, item use, poison and other after-effects
   ================================================================== */
async function fight(a,ai,d){
  busy=true;render();if(ensureVisible(d.x,d.y))await sleep(380);
  const res=resolve(a,ai,d);
  await quickPlay(a,d,res);
  a.hp=res.hpA;d.hp=res.hpD;
  for(const u of[a,d])if(u.team==='p'&&u.hp<=0&&R('phoenix')&&!run.phx){u.hp=1;run.phx=1;pop(u,'Phoenix!','heal');sfx('rise');toast(`The Phoenix Feather saves ${u.name}`)}
  for(const[u,i,n]of[[a,ai,res.used.a],[d,res.f.di,res.used.d]]){if(i<0||!n)continue;const it=u.items[i];if(endless(it.k))continue;it.u-=n;if(it.u<=0){u.items.splice(i,1);sfx('broke');toast(`${u.name}'s ${IT[it.k].n} shattered`)}}
  const p=a.team==='p'?a:d.team==='p'?d:null,o=p===a?d:a;
  for(const e of res.ev)if(e.psn){const t=e.by==='a'?d:a;if(t.team==='p'&&M('soup'))continue;if(t.hp>0){t.psn=3;pop(t,'Poisoned','crit')}}
  for(const e of res.ev)if(e.stone){const t=e.by==='a'?d:a;if(t.hp>0&&!t.boss){t.stone=1;pop(t,'Stone!','crit');sfx('earth');toast(`${t.name} is turned to stone and loses ${t.team==='p'?'their':'its'} next turn`)}}
  /* a summon's EXP goes to the unit that summoned it */
  const ep=p&&p.summon?state.units.find(x=>x.id===p.owner&&x.hp>0):p;
  if(p&&p.hp>0&&ep){const dealt=res.ev.some(e=>(e.by==='a')===(p===a)&&e.dmg>0);const g=gainExp(ep,Math.min(100,Math.round(expFor(ep,o,dealt,o.hp<=0)*EXP_RATE*(R('tome')?1.5:1)*(has(ep,'quickStudy')?2:1))));if(ep!==p&&g)toast(`${ep.name} gains ${g.amt} EXP`);await showExp(ep,g);if(g&&g.gains)await levelUp(ep,g)}
  if(p&&o.hp<=0&&p.hp>0&&R('fang')){const h=Math.min(5,p.maxhp-p.hp);if(h){p.hp+=h;pop(p,'+'+h,'heal')}}
  if(p&&o.hp<=0&&p.hp>0)/* enemy drops go to the spoils: after the win the Found picker asks who takes each one */
    for(const it of o.items.filter(i=>i.d)){(state.loot=state.loot||[]).push(it.k);sfx('item');notify(`${IT[it.k].n} dropped`,'Added to the spoils: choose who takes it after the fight.',icon(it.k))}
  if(p&&o.hp<=0&&p.hp>0&&o.team==='e'&&!o.summon)dropGold();
  if(a.hp>0&&d.hp<=0&&a.team==='p'&&phase==='player'&&has(a,'momentum')&&a.gf!==state.turn){a.gf=state.turn;a.acted=false;pop(a,'Momentum!','heal')}
  if(a.hp>0&&has(a,'hitAndRun')&&man(a,d)===1){let best=null,bd=-1;for(const[dx,dy]of DIRS){const x=a.x+dx,y=a.y+dy;if(x<0||y<0||x>=MW||y>=MH||unitAt(x,y)||mcost(a,x,y)>=99||!canStep(a,a.x,a.y,x,y))continue;
    const dd=Math.min(99,...state.units.filter(o=>hostile(o,a)&&o.hp>0).map(o=>man(o,{x,y})));if(dd>bd){bd=dd;best={x,y}}}if(best&&bd>1){a.x=best.x;a.y=best.y}}
  render();if(a.hp<=0||d.hp<=0)await sleep(380);
  state.units=state.units.filter(u=>u.hp>0);busy=false;render();checkEnd();
}

/* ==================================================================
   GOALS AND WIN/LOSS: rout, boss, defend, protect; checkEnd() after every action
   ================================================================== */
const foesLeft=()=>state.units.filter(u=>u.team==='e'&&u.hp>0).length;
function goalWon(){const c=BATTLE,g=c.goal||'boss';
  if(g==='rout')return foesLeft()===0;
  if(g==='defend')return state.turn>c.turns;
  return!state.units.some(u=>u.boss)}
function goalText(){const c=BATTLE,g=c.goal||'boss',b=state.units.find(u=>u.boss);
  if(g==='rout')return`Rout the enemy <span class="on">${foesLeft()} left</span>`;
  if(g==='defend')return`Hold out for ${c.turns} turns <span class="on">turn ${Math.min(state.turn,c.turns)} of ${c.turns}</span>`;
  return`Defeat ${b?b.name:'the boss'}`}
function goalShort(){const c=BATTLE,g=c.goal||'boss',b=state.units.find(u=>u.boss);
  if(g==='rout')return`Rout · ${foesLeft()} left`;
  if(g==='defend')return`Hold · turn ${Math.min(state.turn,c.turns)}/${c.turns}`;
  return`Defeat ${b?b.name.replace(/^(The|Captain|Matron) /,'').replace(/ the .*/,''):'boss'}`}
function loseText(){return'Every unit falls'}
function checkEnd(){if(over)return;
  if(!state.units.some(u=>u.team==='p'&&!u.summon)){over='lose';render();loseScreen();return}
  if(goalWon()){over='win';render();winScreen()}}

/* ==================================================================
   REINFORCEMENTS AND PHASE START: waves and healing at the start of a phase
   ================================================================== */
function spawnWaves(t){const w=BATTLE.waves;if(!w||!w[t])return;const bo=state.units.find(u=>u.boss&&u.team==='e'&&u.id==='boss');
  const fs=typeof w[t]==='function'?w[t]():w[t].filter(d=>!d.ifBoss||bo).map((d,i)=>{const u=mkMon(d.c,d.lv);u.id=`w${t}_${i}`;u.x=d.ifBoss?bo.x:d.x;u.y=d.ifBoss?bo.y:d.y;return u});
  if(!fs.length)return;const taken=new Set(state.units.filter(u=>u.hp>0).flatMap(u=>cellsOf(u.x,u.y,u.sz).map(c=>key(...c))));
  for(const f of fs){const p=freeNear(f.x,f.y,taken,f);f.x=p.x;f.y=p.y;taken.add(key(p.x,p.y));state.units.push(f)}render();toast(bo&&BATTLE.waves[t][0]?.ifBoss?BATTLE.summonTxt||`${bo.name} raises the dead!`:'Enemy reinforcements!')}
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
  const tiles=[...reach(e)].map(k=>k.split(',').map(Number));let ps=state.units.filter(u=>u.hp>0&&hostile(u,e)),best=null;
  /* Challenged: only the challenger counts as a target, if it can be reached this turn */
  if(hasSt(e,'challenged')){const ch=byId(e.st.challenged.by);if(ch&&ch.hp>0&&tiles.some(([x,y])=>wpnsAt({...e,x,y},man({x,y,sz:e.sz},ch),ch).length))ps=[ch]}
  for(const[x,y]of tiles)for(const p of ps){const d=man({x,y,sz:e.sz},p);
    for(const wi of wpnsAt({...e,x,y},d,p)){const f=forecast({...e,x,y},wi,p),A=f.A,D=f.D;
      const s=A.dmg*A.n*A.hit/100+(A.dmg*A.n>=p.hp?40:0)-(D?D.dmg*D.n*D.hit/200:0)+ter(x,y).av/10+(has(p,'taunt')?25:0);
      if(!best||s>best.s)best={s,tile:{x,y},target:p,wi}}}
  if(best||e.hold||e.mov===0)return best||{};
  const F=field(ps,e);let bt=null,bv=1e9;for(const[x,y]of tiles){const v=(F[key(x,y)]??999)-ter(x,y).av/100;if(v<bv){bv=v;bt={x,y}}}
  return{tile:bt};
}
async function enemyPhase(){
  clearSel();ui='idle';phase='enemy';busy=true;tickSt('p','end');render();
  for(const u of state.units)if(u.team==='p')u.stone=0;
  banner('Enemy Phase','e');await sleep(950);
  phaseHeal('e');tickSt('e','start');burnTick('e');render();await runAI('e');tickSt('e','end');
  busy=false;if(over)return;
  spawnWaves(state.turn+1);
  state.turn++;state.units.forEach(u=>u.acted=false);phase='player';phaseHeal('p');abPlayerStart();
  checkEnd();if(over)return;
  for(const u of state.units)if(u.team==='p'&&u.stone)u.acted=true;
  render();banner('Player Phase','p');
  saveGame();
  tip('enemy','Plan around the enemy','Press Danger to shade every tile an enemy can reach next turn.');
}
/* the Crystal Heart, on even turns: a 3×3 blast of crystal on your tankiest unit (highest max HP + Def) and whoever
   stands next to them. It can't miss; Res is taken off as usual. */
async function crystalStorm(e){
  const ps=state.units.filter(u=>u.hp>0&&hostile(u,e));if(!ps.length)return;
  const t=ps.reduce((a,b)=>b.maxhp+b.def>a.maxhp+a.def?b:a),w=IT.shatter,hit=ps.filter(u=>Math.abs(u.x-t.x)<=1&&Math.abs(u.y-t.y)<=1);
  if(ensureVisible(t.x,t.y))await sleep(300);toast('The Crystal Heart unleashes a Crystal Storm!');sfx('critcharge');await sleep(D(500));shake();
  for(const u of hit){const c=calc(e,w,u,null,{init:e,phase}),d=Math.min(u.hp,dmgMods(e,u,{init:e},Math.max(0,c.pow-c.df)));u.hp-=d;sfx('broke');shatterFx(u);pop(u,'-'+d,'crit');flash(u)}
  render();await sleep(D(700));
  for(const u of hit)if(u.hp<=0&&R('phoenix')&&!run.phx){u.hp=1;run.phx=1;pop(u,'Phoenix!','heal');toast(`The Phoenix Feather saves ${u.name}`)}
  state.units=state.units.filter(u=>u.hp>0);render();checkEnd();
}
async function runAI(team){
  for(const e of state.units.filter(u=>u.team===team)){
    if(e.hp<=0||over)continue;if(e.stone){e.stone=0;render();continue}if(hasSt(e,'stun')){pop(e,'Stunned','miss');await sleep(300);continue}
    if(e.boss&&e.cls==='CrystalHeart'&&state.turn%2===0){await crystalStorm(e);if(over)break;continue}const plan=aiPlan(e);
    if(plan.tile&&(plan.tile.x!==e.x||plan.tile.y!==e.y)){if(ensureVisible(plan.tile.x,plan.tile.y))await sleep(300);stepSfx(e,plan.tile.x,plan.tile.y);e.x=plan.tile.x;e.y=plan.tile.y;render();await sleep(330)}
    /* Cover: the protector takes the hit instead, if the attacker can reach them from here */
    if(plan.target&&hasSt(plan.target,'cover')){const cv=byId(plan.target.st.cover.by);if(cv&&cv.hp>0&&cv!==plan.target){const wl=wpnsAt(e,man(e,cv),cv);if(wl.length){pop(cv,'Cover!','heal');plan.target=cv;plan.wi=wl[0];await sleep(250)}}}
    if(plan.target&&plan.target.hp>0){await fight(e,plan.wi,plan.target);busy=true}
    if(over)break;
  }
}

