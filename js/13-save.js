/* Save/load and battle setup */
/* ================= BATTLE SETUP / SAVE ================= */
const SAVE='sbtactics.save.v2'/* v2: items, skills and monsters renamed to match their in-game names; v1 runs are dropped */,OPTS='sbtactics.opts';
/* SAVES_ON: run saves are switched off while the game is changing a lot (removed content kept breaking old saves). Set true to bring Continue back. */
const SAVES_ON=false;
function saveGame(){if(!SAVES_ON||!run)return;const map=run.phase==='map';try{localStorage.setItem(SAVE,JSON.stringify({state:map?null:state,chStart:map?null:chStart,run,def:map?null:BATTLE,rng:rngS}))}catch(_){}}
/* dropGone: strips skills and items that no longer exist (e.g. Pierce and Lifetaker, and their scrolls) from a save, so older runs still load */
function dropGone(o){if(!o||typeof o!=='object')return;
  if(Array.isArray(o.skills))o.skills=o.skills.filter(x=>!x||!x.id||SKILLS[x.id]);
  if(Array.isArray(o.items))o.items=o.items.filter(i=>!i||!i.k||IT[i.k]);
  if(Array.isArray(o.relics))o.relics=o.relics.filter(k=>RELICS[k]);
  if(Array.isArray(o.units))o.units=o.units.filter(u=>!u||!u.cls||CLS[u.cls]);
  for(const v of Object.values(o))dropGone(v)}
function loadGame(){if(!SAVES_ON){try{localStorage.removeItem(SAVE)}catch(_){}return null}try{const sv=JSON.parse(localStorage.getItem(SAVE));dropGone(sv);return sv}catch(_){return null}}
function setupBattle(roster){
  foeSeq=0;const c=BATTLE;setMap();
  const heroes=roster.map(h=>Object.assign(clone(h),{hp:Math.max(1,Math.min(h.maxhp,h.hp==null?h.maxhp:h.hp)),acted:false,stone:0,psn:0}));
  const fs=c.foes();
  const taken=new Set(fs.flatMap(u=>cellsOf(u.x,u.y,u.sz).map(c=>key(...c))));
  heroes.forEach((h,i)=>{const st=c.start[i]||c.start.at(-1),p=freeNear(st[0],st[1],taken,h);h.x=p.x;h.y=p.y;taken.add(key(p.x,p.y))});
  abReset(heroes);
  state={turn:1,units:[...heroes,...fs]};
  chStart=clone(state);enterMap();
}
/* heights: a map's own h rows (one digit per tile), else hills and rubble sit 1 level up */
function heightsOf(c){return c.h?c.h.map(r=>[...r].map(Number)):c.map.map(r=>[...r].map(ch=>TER[ch]&&TER[ch].k==='hill'?1:0))}
function setMap(){MAP=BATTLE.map;MW=MAP[0].length;MH=MAP.length;HM=heightsOf(BATTLE)}
function enterMap(){setMap();over=null;phase='player';busy=false;ui='idle';clearSel();buildBoard();render();requestAnimationFrame(()=>initCam())}
async function battleIntro(){
  const c=BATTLE;
  await modal(`<div class="eyebrow">Act ${run.act||1} · Floor ${run.n} of ${actLen()}</div><h2>${c.title}</h2><p>${c.intro}</p><div class="lvl" style="grid-template-columns:1fr"><div><span style="color:var(--gold)">Goal</span><span>${goalText().replace(/<[^>]+>/g,' ').trim()}</span></div><div><span style="color:var(--red)">Lose</span><span>${loseText()}</span></div></div><div class="mbtns"><button class="go" type="button" data-m="go">Begin</button></div>`);
  banner('Player Phase','p');saveGame();
  {const B=BIOMES[c.biome];if(B&&B.tip)tip(...B.tip)}
  tip('basics','Moving your units','Click a blue unit to see where it can go: blue tiles are moves, red tiles are what it can hit. Click a tile to move there, or click a red enemy to attack it straight away. Dead woods give +20 Avoid and +1 Def, so fight from the trees when you can.');
}
