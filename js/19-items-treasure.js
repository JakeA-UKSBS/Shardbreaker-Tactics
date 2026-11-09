/* Forged weapons, shared pickers and treasure rooms */
/* ---- forged weapons: key "base~N" is base +N (+2 Mt, +5 Hit per level, up to +3). Built on demand like classes. ---- */
const FORGE_MAX=3;
function ensureIt(k){if(IT[k]||!k.includes('~'))return k;const[b,n]=k.split('~'),B=IT[b],N=+n;IT[k]=Object.assign(clone(B),{n:`${B.n} +${N}`,key:k,base:b,forge:N},B.t==='spirit'?{amt:B.amt+5*N}:{mt:B.mt+2*N,hit:B.hit+5*N});return k}
function forgeLv(it){return IT[it.k].forge||0}
function forge(it){const B=IT[it.k],n=(B.forge||0)+1;if(n>FORGE_MAX)return false;it.k=ensureIt((B.base||it.k)+'~'+n);return true}
const STEEL={blade:'knightlySword',heavy:'cleaver',pole:'steelSpear',bow:'ironwoodBow'};
/* the Weaponmaster's trade-ups: each weapon line goes to its next tier, keeping the kind of weapon */
const UPGRADE={wornSword:'knightlySword',knightlySword:'jadeJian',ironSpear:'steelSpear',steelSpear:'jadeSpear',hatchet:'cleaver',cleaver:'jadeAxe',
  shortBow:'ironwoodBow',ironwoodBow:'jadeBow',longbow:'yewGreatbow',hookedBlade:'moonglassEdge',javelin:'pilum',throwingAxe:'tomahawk',throwingKnives:'steelKnives',crossbow:'arbalest',dirk:'jadeFang',twinDaggers:'jadeFang',stiletto:'jadeFang',
  claymore:'greatsword',greatsword:'zweihander'};
/* the next tier of a unit's weapon (keeps any reforging); null if there's nothing better */
function tierUp(u,it){const B=IT[it.k],up=UPGRADE[B.base||it.k],f=B.forge||0;return up&&canUse(u,up)?(f?ensureIt(up+'~'+f):up):null}

/* ---- shared pickers ---- */
function itemText(k){return itemInfo({cls:'Villager',name:''},k).replace(/ · [^·]*can't (wield|use) this\./,'')}
/* reward colours: artifact blue, weapon red, skill green, item yellow (css .rw-*) */
const RWK={artifact:'Artifact',weapon:'Weapon',skill:'Skill',item:'Item'},rwTag=(k,t)=>`<span class="rw rw-${k}">${t||RWK[k]}</span>`;
/* kind: one of RWK, shown as a coloured eyebrow. The skill pie only shows when a skill is being learned (add given) */
async function pickUnit(title,text,ok,skipLabel='Cancel',add,kind){
  const L=run.roster.map((u,i)=>({u,i,why:ok?ok(u):null}));
  const m=await modal(`${kind?`<div class="eyebrow">${rwTag(kind)}</div>`:''}<h2>${title}</h2>${text?`<p>${text}</p>`:''}<div class="draft">${L.map(({u,i,why})=>`<button type="button" class="dcard" data-m="u${i}"${why?' disabled':''}>${unitCard(u,false,add,false,add==null)}${why?`<span class="dno">${why}</span>`:''}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">${skipLabel}</button></div>`);
  return m==='skip'?null:run.roster[+m.slice(1)];
}
const full=u=>u.items.length>=5?'Inventory full':null;
/* put item k in u's bag; if it's full, ask which item to swap out (that one is left behind). false if they cancel */
/* the equipped weapon can be swapped out too, as long as the unit is left with at least one weapon (or staff) it can use;
   the next one in the bag is then equipped */
const usableWpn=(u,k)=>(isWpn(k)||IT[k].t==='spirit')&&canUse(u,k);
async function stow(u,k){if(u.items.length<5){u.items.push({k,u:IT[k].uses});return true}
  const eq=eqIdx(u),keeps=i=>[...u.items.filter((_,j)=>j!==i).map(it=>it.k),k].some(x=>usableWpn(u,x));
  const m=await modal(`<h2>${u.name}’s bag is full</h2><p>Swap something out for the <b>${IT[k].n}</b>? The item you swap out is left behind.</p><div class="draft">${u.items.map((it,i)=>`<button type="button" class="dcard" data-m="s${i}"${keeps(i)?'':' disabled'}><div class="dimg"><img src="${icon(it.k)}" alt=""></div><div class="dtxt"><span>${itemText(it.k)}${IT[it.k].t==='item'?` <span class="uses">${it.u}/${IT[it.k].uses}</span>`:''}${i===eq?' <b>(equipped)</b>':''}${keeps(i)?'':' <b>(only weapon)</b>'}</span></div></button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Don’t swap</button></div>`);
  if(m==='skip')return false;const n=+m.slice(1),out=u.items[n];u.items.splice(n,1,{k,u:IT[k].uses});toast(`${u.name} leaves the ${IT[out.k].n} behind`);
  if(n===eq){const e=eqIdx(u);if(e>=0)toast(`${u.name} equips the ${IT[u.items[e].k].n}`)}return true}
/* the best steel weapon for a unit's weapon type (the elite's reward) */
const steelFor=u=>{if(canUse(u,'zweihander')&&!canUse(u,'knightlySword'))return'zweihander';if(canUse(u,'steelKnives')&&!canUse(u,'knightlySword'))return'steelKnives';for(const t of CLS[u.cls].w)if(STEEL[t]&&canUse(u,STEEL[t]))return STEEL[t];return null};
/* the steel weapons by name, for offers (only the spear has "Steel" in its name) */
const steelList=()=>[...Object.entries(STEEL).map(([t,k])=>`${IT[k].n} (${TN[t]})`),`${IT.steelKnives.n} (rogues)`,`${IT.zweihander.n} (Zwei)`].join(', ');
/* does anyone in the squad already carry this item? (weapon offers skip these, so loot isn't a duplicate) */
const squadHas=k=>!!run&&(run.roster||[]).some(u=>u.items.some(it=>it.k===k));
const weaponOf=u=>u.items.find(it=>(isWpn(it.k)||IT[it.k].t==='spirit')&&canUse(u,it.k));

/* ---- treasure: the vault holds one thing (an item, a skill or a relic), then who takes it ---- */
async function treasureNode(){
  const pool=['knightlySword','cleaver','steelSpear','ironwoodBow','moonglassEdge','greatsword','claymore','zweihander','flamberge','javelin','throwingAxe','crossbow','stormSigil','crookStaff','runeStaff','dawnStaff','salve','barbedSpear','reaverAxe','hawkeyeBow','warHammer','huntingSpear','giantslayer','holySword','stiletto','pilum','tomahawk','steelKnives','galeSword','arbalest','leatherArmour','chainmail','wardingCloak','travellersBoots','ironGauntlets'];
  const mk=()=>{const r=rand(),rp=relicPool(['c','u']);if(rp.length&&r<.2)return'relic:'+pick(rp);if(r<.3)return'skill:'+pick(SKILL_POOL());return pick(pool.filter(k=>!isWpn(k)&&IT[k].t!=='spirit'||run.roster.some(u=>canUse(u,k))&&!squadHas(k)))};
  let k=mk();
  for(;;){
    const row=k.startsWith('skill:')?`<img src="${icon('ascensionFragment')}" alt=""><span><b>${SKILLS[k.slice(6)].n}</b> · ${rwTag('skill')} · ${SKILLS[k.slice(6)].d}</span>`:k.startsWith('relic:')?`<img src="${relicArt(k.slice(6))}" alt=""><span><b>${RELICS[k.slice(6)].n}</b> · ${rwTag('artifact')} · ${RELICS[k.slice(6)].d}</span>`:`<img src="${icon(k)}" alt=""><span>${itemText(k)}</span>`;
    const m=await modal(`<div class="eyebrow">Treasure</div><h2>A sealed vault</h2><div class="inv big"><button type="button" class="it" data-m="take">${row}</button></div>${canReroll()?'<div class="mbtns"><button type="button" data-m="reroll">Reroll (once this act)</button></div>':''}`);
    if(m==='reroll'){run.rr[run.act||1]=1;k=mk();sfx('tick');continue}
    if(k.startsWith('skill:')){if(await allocSkill(k.slice(6)))return;continue}
    if(k.startsWith('relic:')){const r=k.slice(6);(run.relics=run.relics||[]).push(r);sfx('fanfare');toast(`${RELICS[r].n} obtained`);return}
    const kd=isWpn(k)?'weapon':'item',u=await pickUnit(`Who carries the ${rwTag(kd,IT[k].n)}?`,'If their bag is full, you can swap something out.',u=>isWpn(k)&&!canUse(u,k)?'Can’t wield it':null,'Leave it',undefined,kd);
    if(!u)return;if(!await stow(u,k))continue;sfx('item');toast(`${u.name} takes the ${IT[k].n}`);return;
  }
}

