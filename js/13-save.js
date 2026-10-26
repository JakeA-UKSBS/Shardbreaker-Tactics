/* Save/load and chapter setup */
/* ================= CHAPTERS / SAVE ================= */
const SAVE='sbtactics.save.v1',OPTS='sbtactics.opts';
function saveGame(){if(!run)return;const map=run.phase==='map';try{localStorage.setItem(SAVE,JSON.stringify({state:map?null:state,rewinds,chStart:map?null:chStart,run,def:map?null:CH[0],rng:rngS}))}catch(_){}}
function loadGame(){try{return JSON.parse(localStorage.getItem(SAVE))}catch(_){return null}}
function setMap(){MAP=CH[state.ch].map;MW=MAP[0].length;MH=MAP.length}
function setupChapter(ci,roster){
  foeSeq=0;const c=CH[ci];setMapFor(ci);
  (c.join||[]).forEach(id=>{if(!roster.some(r=>r.id===id))roster.push(mkHero(heroDef(id)))});
  let heroes=roster.map(h=>Object.assign(clone(h),{hp:Math.max(1,Math.min(h.maxhp,h.hp==null?h.maxhp:h.hp)),acted:false,stone:0,psn:0}));if(Wo('wound'))heroes.forEach(h=>h.hp=Math.max(1,h.hp-5));
  const extra=[],fs=c.foes();let reserve=[],stage=2;
  if(c.goal==='duel'){const sl=heroes.find(h=>h.id==='silas');
    if(sl){heroes=heroes.filter(h=>h!==sl);reserve=heroes.filter(h=>!h.lord);heroes=heroes.filter(h=>h.lord);Object.assign(sl,{team:'e',x:c.duelist[0],y:c.duelist[1],turncoat:true});extra.push(sl);stage=1}
    else fs.push(...c.horde())}
  const taken=new Set([...fs,...extra].flatMap(u=>cellsOf(u.x,u.y,u.sz).map(c=>key(...c))));
  heroes.forEach((h,i)=>{const st=c.start[i]||c.start.at(-1),p=freeNear(st[0],st[1],taken,h);h.x=p.x;h.y=p.y;taken.add(key(p.x,p.y))});
  state={ch:ci,turn:1,units:[...heroes,...extra,...fs],visited:[],sprung:[],stage,reserve};
  history=[];rewinds=3;chStart=clone(state);enterMap();
}
function setMapFor(ci){MAP=CH[ci].map;MW=MAP[0].length;MH=MAP.length}
function npc(id,x,y,o){return Object.assign(mkHero(heroDef(id)),{team:'g',x,y,hold:true},o||{})}
function enterMap(){setMap();over=null;phase='player';busy=false;ui='idle';clearSel();buildBoard();render();requestAnimationFrame(()=>initCam())}
async function chapterIntro(){
  const c=CH[state.ch];
  await modal(`<div class="eyebrow">Act ${run.act||1} · Floor ${run.n} of ${RUN_LEN} · ${NODE_N[run.kind]||'Battle'}</div><h2>${c.title}</h2><p>${c.intro.replaceAll('{lord}',lordName())}</p><div class="lvl" style="grid-template-columns:1fr"><div><span style="color:var(--gold)">Goal</span><span>${goalText().replace(/<[^>]+>/g,' ').trim()}</span></div><div><span style="color:var(--red)">Lose</span><span>${loseText()}</span></div></div><div class="mbtns"><button class="go" type="button" data-m="go">Begin</button></div>`);
  banner('Player Phase','p');saveGame();
  {const B=BIOMES[c.biome];if(B&&B.tip)tip(...B.tip)}
  if(state.ch===0)tip('basics','Moving your units','Tap a blue unit to see where it can go: blue tiles are moves, red tiles are what it can hit. Tap a tile to move there, or tap a red enemy to attack it straight away. Dead woods give +20 Avoid and +1 Def, so fight from the trees when you can.');
  if(state.ch===1)tip('defend','Hold the camp','You win by surviving: the goal counts the turns. Plug the gaps in the palisade, and expect new enemies every turn.');
  if(state.ch===2)tip('traps','Traps and gremlins','Some labyrinth tiles hide traps that hurt whoever steps on them. Sprung traps stay marked.');
  if(state.ch===6)tip('fliers','Fliers','Fliers cross open sky and ignore terrain bonuses. Bows deal double damage to them.');
  if(state.ch===1)tip('items','Villages, chests and recruits','Move any unit onto a village or chest and choose Visit or Open to collect an item. Under Items you can equip weapons, use Salves and learn skills from scrolls. Some enemies can be recruited: put your lord next to them and choose Talk.');
}
