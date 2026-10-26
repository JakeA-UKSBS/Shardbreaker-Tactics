/* Profile, achievements, unlocks, Ascension, Records */
/* ---- profile: what carries over between runs (runs played, wins, ascension, achievements, unlocks) ---- */
const PROF='sbtactics.profile';
let prof={un:[],runs:0,wins:0,asc:0,ach:[],bosses:[]};
function loadProf(){try{const p=JSON.parse(localStorage.getItem(PROF));if(p)prof=Object.assign(prof,p)}catch(_){}}
function saveProf(){try{localStorage.setItem(PROF,JSON.stringify(prof))}catch(_){}}
const unl=k=>prof.un.includes(k);
/* Rewind is retired: it never turns on (the button stays hidden) */
const rwOn=()=>false;
/* rewards that achievements hand out */
const UNLOCKS={
  summoner:{n:'Summoner',d:'Summoners can join: casters who call a creature from each region.'},
  ascension:{n:'Difficulty',d:'Choose an Ascension level when you start a run.'},
  funds:{n:'Travel Funds',d:'Start each run with 20 more gold.'},
  gourmet:{n:'Gourmet',d:'Tavern meals last 1 more fight.'},
  reroll:{n:'Second Look',d:'Once per act, reroll a recruit or treasure offer.'},
  draft6:{n:'Wider Draft',d:'The Crossroads offers 6 travellers instead of 5.'},
  flying:{n:'Sky Riders',d:'Pegasus and wyvern riders can join, and promotions can take to the air.'},
  startRelic:{n:'Heirloom',d:'Start each run by choosing 1 of 2 relics, one of them always Waybread or the Sage’s Satchel.'},
  veterans:{n:'Veterans',d:'Your Crossroads travellers start at Lv 3.'}
};
/* achievements: checked when a run ends. sq = the squad still standing at the end */
const isRole=(u,r)=>u.cls.startsWith(`G.${r}.`),wields=(u,t)=>CLS[u.cls].w.includes(t);
const ACH=[
  {id:'played',n:'Try, Try and Try Again',d:'Play a run to the end, win or lose.',ok:()=>true,rw:'funds'},
  {id:'first',n:'First Run',d:'Finish a run.',win:1,ok:()=>true,rw:'ascension'},
  {id:'hospital',n:'Field Hospital',d:'Finish a run with 3 or more Menders in the squad.',win:1,ok:sq=>sq.filter(u=>isRole(u,'support')).length>=3,cnt:sq=>sq.filter(u=>isRole(u,'support')).length,need:3,rw:'startRelic'},
  {id:'volley',n:'Volley',d:'Finish a run with 3 or more bow users in the squad.',win:1,ok:sq=>sq.filter(u=>wields(u,'bow')).length>=3,cnt:sq=>sq.filter(u=>wields(u,'bow')).length,need:3,rw:'draft6'},
  {id:'cavalry',n:'Cavalry Charge',d:'Finish a run with 3 or more mounted units in the squad.',win:1,ok:sq=>sq.filter(u=>CLS[u.cls].mnt&&!CLS[u.cls].fly).length>=3,cnt:sq=>sq.filter(u=>CLS[u.cls].mnt&&!CLS[u.cls].fly).length,need:3,rw:'flying'},
  {id:'fullhouse',n:'Full House',d:'Finish a run with a full squad of 6.',win:1,ok:sq=>sq.length>=6,cnt:sq=>sq.length,need:6,rw:'reroll'},
  {id:'untouched',n:'Not a Scratch',d:'Finish a run without losing a single unit.',win:1,ok:()=>!run.lost,rw:'veterans'},
  {id:'mage',n:'Apprentice',d:'Finish a run with a Sigilist (mage) in the squad.',win:1,ok:sq=>sq.some(u=>isRole(u,'caster')),rw:'summoner'},
  {id:'arcane',n:'Arcane Circle',d:'Finish a run with 3 or more sigil casters in the squad.',win:1,ok:sq=>sq.filter(u=>wields(u,'art')&&!isRole(u,'support')).length>=3,cnt:sq=>sq.filter(u=>wields(u,'art')&&!isRole(u,'support')).length,need:3,rw:null},
  {id:'skyfleet',n:'Sky Fleet',d:'Finish a run with 3 or more fliers in the squad.',win:1,ok:sq=>sq.filter(u=>CLS[u.cls].fly).length>=3,cnt:sq=>sq.filter(u=>CLS[u.cls].fly).length,need:3,rw:null},
  {id:'feast',n:'Feast',d:'Eat a meal at 2 taverns in one run.',ok:()=>(run.ate||0)>=2,cnt:()=>run.ate||0,need:2,rw:'gourmet'},
  {id:'explorer',n:'Cartographer',d:'Defeat the boss of every region, across any number of runs.',ok:()=>biomeIds().every(b=>prof.bosses.includes(b)),prog:()=>prof.bosses.filter(b=>biomeIds().includes(b)).length,need:biomeIds().length,rw:null}
];
/* extra relics join the pool after this many runs (RELICS[k].x) */
const relicOpen=k=>!RELICS[k].x||prof.runs>=RELICS[k].x;
/* ascension: harder runs, one level opens each time you win at your highest level */
const ASC_MAX=5;
const ASC=['Normal','Enemies are 1 level higher.','Bosses and elite leaders are much tougher.','No early ease, you start with no gold, and units recover only 5 HP after a fight.','Enemies are another level higher, with one more in each battle.','Every enemy knows a combat skill.'];
const A=n=>!!(run&&(run.asc||0)>=n);
async function ascPick(){
  if(!prof.asc||!unl('ascension'))return 0;
  const m=await modal(`<div class="eyebrow">New run</div><h2>Ascension</h2><p>Each level adds to the ones before it. Win at your highest level to open the next.</p>
    <div class="inv">${Array.from({length:prof.asc+1},(_,i)=>`<button type="button" class="it" data-m="a${i}"><span><b>${i?'Ascension '+i:'Normal'}</b> · ${i?ASC[i]:'The standard run.'}</span></button>`).join('')}</div>
    <div class="mbtns"><button type="button" data-m="back">Back</button></div>`);
  return m==='back'?null:+m.slice(1);
}
/* called once when a run ends; returns lines describing anything new */
function endRun(won){
  (prof.hist=prof.hist||[]).unshift({date:Date.now(),seed:run.seed,won,asc:run.asc||0,act:run.act||1,floor:run.n,regions:run.biomes,squad:(run.roster||[]).map(u=>({n:u.name,c:CLS[u.cls].n,lv:u.lv})),fallen:run.fallen||[],relics:run.relics||[]});prof.hist.length=Math.min(prof.hist.length,30);
  const out=[],sq=run.roster||[],before=new Set(Object.keys(RELICS).filter(relicOpen));
  prof.runs++;if(won){prof.wins++;if((run.asc||0)>=prof.asc&&prof.asc<ASC_MAX){prof.asc++;out.push(`<b>Ascension ${prof.asc}</b> is open: ${ASC[prof.asc]}`)}}
  /* best progress so far on counted achievements (shown as bars on the Unlocks screen) */
  prof.best=prof.best||{};for(const a of ACH)if(a.cnt&&(!a.win||won))prof.best[a.id]=Math.max(prof.best[a.id]||0,a.cnt(sq));
  for(const a of ACH){if(prof.ach.includes(a.id)||(a.win&&!won)||!a.ok(sq))continue;prof.ach.push(a.id);
    out.push(`Achievement: <b>${a.n}</b>${a.rw&&!unl(a.rw)?` · unlocks <b>${UNLOCKS[a.rw].n}</b> (${UNLOCKS[a.rw].d})`:''}`);if(a.rw&&!unl(a.rw))prof.un.push(a.rw)}
  const fresh=Object.keys(RELICS).filter(k=>relicOpen(k)&&!before.has(k));if(fresh.length)out.push(`New relics join the pool: ${fresh.map(k=>`<b>${RELICS[k].n}</b>`).join(', ')}`);
  saveProf();return out;
}
/* run history: the last 30 runs, newest first. Old entries are drawn defensively, since relics, classes and regions can change between versions */
async function historyScreen(){
  const H=prof.hist||[],d=t=>{try{return new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short'})+' '+new Date(t).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}catch(_){return''}};
  const card=h=>`<div class="hist ${h.won?'won':'lost'}"><div class="hh"><b>${h.won?'Victory':'Defeat'}</b><span>${d(h.date)}${h.asc?` · Ascension ${h.asc}`:''} · Seed ${h.seed}</span></div>
    <p>${h.won?'Cleared':'Fell in'} ${[...(h.regions||[]).slice(0,2),'heart'].slice(0,h.won?3:h.act||1).map(r=>BIOMES[r]?BIOMES[r].n:r).join(' → ')}${h.won?'':` · Act ${h.act||1}, floor ${h.floor||1} of ${RUN_LEN}`}</p>
    <div class="hsq">${(h.squad||[]).map(u=>`<span>${u.n} <small>${u.c} · Lv ${u.lv}</small></span>`).join('')}${(h.fallen||[]).map(u=>`<span class="dead">${u.n} <small>${u.c} · fell A${u.act} F${u.floor}</small></span>`).join('')}</div>
    ${(h.relics||[]).length?`<div class="hrel">${h.relics.filter(k=>RELICS[k]).map(k=>`<img src="${relicArt(k)}" alt="${RELICS[k].n}" title="${RELICS[k].n}: ${RELICS[k].d}">`).join('')}</div>`:''}</div>`;
  await modal(`<div class="eyebrow">${prof.runs} run${prof.runs===1?'':'s'} · ${prof.wins} won</div><h2>Run History</h2>
    <div class="hlist">${H.length?H.map(card).join(''):'<p class="hint">No runs yet. Finished runs show up here.</p>'}</div>
    <div class="mbtns"><button class="go" type="button" data-m="back">Back</button></div>`);
}
const newsHTML=lines=>lines.length?`<div class="news">${lines.map(l=>`<p>${l}</p>`).join('')}</div>`:'';
/* the Unlocks screen: each achievement shows the picture of what it unlocks; tap one to see how to get it.
   Achievements with progress (best so far) are grouped first with a bar; finished ones go last. */
function unlockArt(k){const c='UNL|'+k;if(sprCache[c])return sprCache[c];let u;
  if(k==='summoner')u=hiFig({style:'long',gear:'hood',cloth:'#5a3a8a',skin:'#e0b090',hair:'#2a2230'},ensureCls('G.summoner.foot.art.1'),'p','idle','crookStaff');
  else if(k==='flying')u=hiFig({style:'tail',hair:'#8a2a22',cloth:'#3a7cc0',mount:'pegasus',horse:'#f3f0e8'},ensureCls('G.skirm.flying.pole.1'),'p','idle','ironSpear');
  else if(k==='startRelic')u=relicArt('waybread');else if(k==='veterans')u=icon('crest');else if(k==='funds')u=coinArt();else if(k==='gourmet')u=mealArt('boar');else if(k==='draft6')u=campArt();
  else{const p=Px(16,16);if(k==='ascension'){p.poly([[8,1],[13,7],[8,15],[3,7]],'#c8283a');p.poly([[8,1],[13,7],[8,8]],'#ff5a6a');p.line(8,2,8,14,'#ffb0b8')}
    if(k==='reroll'){p.rect(1,5,8,8,'#efe6cf');p.rect(7,2,8,8,'#e0d6bc');for(const[x,y]of[[3,7],[6,10],[9,4],[12,7]])p.set(x,y,INK)}if(k==='none'){p.ell(8,8,5,5,'#5a5466')}
    p.outline(OUT);u=p.url()}
  return sprCache[c]=u}
async function recordsScreen(){
  const best=prof.best||{},row=a=>{const got=prof.ach.includes(a.id),now=a.prog?a.prog():best[a.id]||0,U=a.rw&&UNLOCKS[a.rw];
    return`<button type="button" class="ach2${got?' got':''}" aria-expanded="false"><img src="${unlockArt(a.rw||'none')}" alt=""><span class="a2t"><b>${a.n}</b>${U?`<small>${U.n}</small>`:'<small>No unlock yet</small>'}
      ${a.need&&!got?`<span class="a2bar"><i style="width:${Math.min(100,now/a.need*100)}%"></i></span><small class="a2n">${now}/${a.need}${a.prog?'':' best'}</small>`:''}
      <span class="a2d">${a.d}${U?` <em>Unlocks ${U.n}: ${U.d}</em>`:''}</span></span>${got?'<span class="a2ok">✓</span>':''}</button>`};
  const done=ACH.filter(a=>prof.ach.includes(a.id)),prog=ACH.filter(a=>!prof.ach.includes(a.id)&&a.need),rest=ACH.filter(a=>!prof.ach.includes(a.id)&&!a.need);
  const sec=(t,L)=>L.length?`<div class="a2h">${t}</div>${L.map(row).join('')}`:'';
  const m=modal(`<h2>Unlocks</h2><div class="a2list">${sec('In progress',prog)}${sec('Locked',rest)}${sec('Unlocked',done)}</div><div class="mbtns"><button class="go" type="button" data-m="back">Back</button></div>`);
  modalEl.querySelectorAll('.ach2').forEach(b=>b.addEventListener('click',()=>{const o=b.classList.toggle('open');b.setAttribute('aria-expanded',String(o));sfx('tick')}));
  await m;
}

