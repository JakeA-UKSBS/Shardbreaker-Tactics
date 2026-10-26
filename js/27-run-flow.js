/* Run flow: new run, battles, title screen, win/lose, restore */
/* ---- flow ---- */
async function beginBattle(){
  run.fights=(run.fights||0)+1;const def=genBattle(run.fights,run.kind);CH.length=0;CH.push(def);
  setupChapter(0,run.roster);battleAllies();rewinds=3;saveGame();music(def.biome);await chapterIntro();
}
async function newRun(){
  const seed=(Date.now()^Math.floor(Math.random()*1e9))>>>0;seedRng(seed);
  run={seed,n:0,uid:1,roster:[],pos:null,path:[],act:1,relics:[],rr:{},gold:30,meals:[],lost:0,ate:0};/* greybox: Act 1 is always the Cursed Woodland, whose maps are the hand-made height maps */run.biomes=['forest',...shuffle(biomeIds().filter(b=>b!=='forest'))].slice(0,ACTS);
  const opts=Array.from({length:unl('draft6')?6:5},(_,i)=>genUnit(unl('veterans')?3:2,i===0?'support':undefined));shuffle(opts);
  run.map=genMap();titleEl.hidden=true;const asc=await sageScene();if(asc===null){titleEl.hidden=false;return false}run.asc=asc;if(A(3))run.gold=0;if(unl('funds'))run.gold+=20;
  {const k=await relicPick(3,['s'],'Ithren’s gift','“Take this to assist you.”');if(k==='purse')run.gold+=30}
const squad=await musterScene(opts,3);if(!squad)return false;
  run.roster=squad;
  if(unl('startRelic'))await relicPick(2,['c','u'],'An heirloom','Choose a relic to carry from the start.',[pick(relicPool(['h']))]);
  if(R('satchel'))squad.forEach(u=>{if(u.items.length<5)u.items.push({k:'qiPill',u:IT.qiPill.uses})});
  await mapStep();return true;
}
async function titleScreen(){
  music('title');
  for(;;){
    const sv=loadGame(),items=[];
    if(sv&&sv.run)items.push(['cont','Continue']);
    items.push(['new','New Run'],['records',`Unlocks · ${prof.ach.length}/${ACH.length}`],['hist','Run History'],['opts','Options']);
    const m=await titleMenu(items);
    if(m==='opts'){await optionsMenu(true);continue}
    if(m==='records'){await recordsScreen();continue}
    if(m==='hist'){await historyScreen();continue}
    if(m==='cont'){titleEl.hidden=true;restore(sv);if(run.phase==='map')mapStep();else banner('Player Phase','p');return}
    if(await newRun())return;
  }
}
/* HP carries between fights: survivors recover 5 HP after a win (3 from Ascension 3); the tavern and the camp before the boss heal fully */
const afterHeal=()=>(A(3)?3:5)+(R('waybread')?3:0);
async function winScreen(){
  await sleep(600);
  const survivors=state.units.filter(u=>u.team==='p'&&!u.summon),fallen=chStart.units.filter(s=>s.team==='p'&&!survivors.some(u=>u.id===s.id));
  run.roster=survivors.map(u=>{const r=clone(u);r.hp=Math.min(r.maxhp,r.hp+afterHeal());r.acted=false;r.stone=0;return r});
  const bossWin=run.kind==='boss',final=bossWin&&(run.act||1)>=ACTS,rw=battleRewards();
  run.lost=(run.lost||0)+fallen.length;(run.fallen=run.fallen||[]).push(...fallen.map(u=>({n:u.name,c:CLS[u.cls].n,act:run.act||1,floor:run.n})));if(bossWin&&!prof.bosses.includes(actBiome().id)){prof.bosses.push(actBiome().id);saveProf()}
  const gg=(GOLDWIN[run.kind]||GOLDWIN.battle)+(R('plenty')?15:0)+(rw.gold||0);run.gold=gold()+gg;afterFightMeals();
  const ro=survivors.map(u=>`<div><img src="${portrait(u)}" alt="">${u.name}<span class="hint">Lv ${u.lv} · ${Math.min(u.maxhp,u.hp+afterHeal())}/${u.maxhp} HP</span></div>`).join('')+fallen.map(u=>`<div class="dead"><img src="${portrait(u)}" alt="">${u.name}<span class="hint">Fallen</span></div>`).join('');
  await modal(`<div class="eyebrow">Act ${run.act||1} · Floor ${run.n} of ${actLen()} won · Turn ${state.turn}</div><h2>${CH[0].title}</h2><p>${final?'The run is complete.':bossWin?`${TheN(actBiome())} is cleared. The road leads on to ${theN(run.act>=2?BIOMES.heart:BIOMES[run.biomes[run.act]])}.`:`Survivors recover ${afterHeal()} HP. Taverns and camps heal fully.`}</p><div class="roster">${ro}</div><p>${rw.length?`Found: ${rw.map(k=>`<b>${IT[k].n}</b>`).join(', ')}. `:''}<span class="gold">+${gg} gold</span></p><div class="mbtns"><button class="go" type="button" data-m="next">${final?'Finish':'Press on'}</button></div>`);
  for(const k of rw)await giveTo(k,'From the battlefield.',true);
  if(run.pendSkill){const k=run.pendSkill;run.pendSkill=null;await allocSkill(k,`Found: ${SKILLS[k].n}`)}
  if(run.kind==='elite'){await relicPick(2,['c','u'],'The elite’s spoils','');
    const u=await pickUnit('A jade weapon in the Elder’s hoard','Who takes it? They get the jade weapon that suits them.',u=>full(u)||(jadeFor(u)?null:'Nothing for them'),'Leave it');
    if(u){const k=jadeFor(u);u.items.push({k,u:IT[k].uses});sfx('item');toast(`${u.name} takes the ${IT[k].n}`)}}
  if(bossWin&&!final)await relicPick(3,['u','r'],'The boss’s hoard','');
  if(final){const news=endRun(true);sfx('fanfare');await modal(`<div class="endban win">Victory</div><div class="eyebrow">Seed ${run.seed}${run.asc?` · Ascension ${run.asc}`:''}</div><h2>The blight is broken</h2><p>${run.roster.length} of your squad made it to the end.</p>${newsHTML(news)}<div class="roster">${run.roster.map(u=>`<div><img src="${portrait(u)}" alt="">${u.name}<span class="hint">${CLS[u.cls].n}</span></div>`).join('')}</div><div class="mbtns"><button class="go" type="button" data-m="ok">Back to title</button></div>`);
    try{localStorage.removeItem(SAVE)}catch(_){}run=null;titleScreen();return}
  if(bossWin){run.act=(run.act||1)+1;run.map=genMap();run.pos=null;run.path=[];const B=actBiome();
    await modal(`<div class="eyebrow">Act ${run.act}</div><h2>${B.n}</h2><p>${B.d}</p><div class="mbtns"><button class="go" type="button" data-m="ok">Press on</button></div>`)}
  await mapStep();
}
async function loseScreen(){
  await sleep(500);const can=rwOn()&&rewinds>0&&history.length;
  const sq=chStart.units.filter(u=>u.team==='p'&&!u.summon);
  const m=await modal(`<div class="endban lose">Defeat</div><div class="eyebrow">Seed ${run.seed}${run.asc?` · Ascension ${run.asc}`:''}</div><h2>The run ends</h2><p>Your squad fell in Act ${run.act||1}, floor ${run.n} of ${RUN_LEN}, in ${TheN(actBiome()).replace(/^The /,'the ')}.</p><div class="roster">${sq.map(u=>`<div class="dead"><img src="${portrait(u)}" alt="">${u.name}<span class="hint">${CLS[u.cls].n} · Lv ${u.lv}</span></div>`).join('')}</div>${can?`<p>You have ${rewinds} rewind${rewinds>1?'s':''} left.</p>`:''}<div class="mbtns">${can?'<button class="go" type="button" data-m="rewind">Rewind</button>':''}<button type="button" data-m="title">Back to title</button></div>`);
  if(m==='rewind'){rewind();return}
  const news=endRun(false);if(news.length)await modal(`<h2>Progress</h2>${newsHTML(news)}<div class="mbtns"><button class="go" type="button" data-m="ok">Back to title</button></div>`);
  try{localStorage.removeItem(SAVE)}catch(_){}run=null;titleScreen();
}
function rewind(){if(!rwOn()||rewinds<=0||!history.length||busy)return;if(ui!=='idle')cancelMove();state=history.pop();rewinds--;over=null;phase='player';clearSel();ui='idle';render();saveGame()}
function restore(d){
  run=d.run;seedRng(d.rng);
  const fix=us=>us.forEach(u=>{ensureCls(u.cls);u.items.forEach(it=>ensureIt(it.k))});
  fix(run.roster);if(run.phase==='map')return;
  CH.length=0;CH.push(d.def);
  fix([...d.state.units,...(d.chStart?d.chStart.units:[])]);
  state=d.state;history=d.history||[];rewinds=d.rewinds??3;chStart=d.chStart||clone(state);enterMap();
}
