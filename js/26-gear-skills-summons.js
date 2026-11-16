/* Gear, trading, skill allocation and summons */
/* ---- gear: non-weapon items that work while carried (one of each kind counts), and can be traded ---- */
Object.assign(IT,{
  leatherArmour:{n:'Leather Armour',t:'gear',kind:'armor',uses:1,gear:{def:2},key:'leatherArmour'},
  chainmail:{n:'Chainmail',t:'gear',kind:'armor',uses:1,gear:{def:3},tint:'steel',key:'chainmail'},
  wardingCloak:{n:'Warding Cloak',t:'gear',kind:'cloak',uses:1,gear:{res:3},key:'wardingCloak'},
  travellersBoots:{n:'Traveller’s Boots',t:'gear',kind:'boots',uses:1,gear:{mov:1},key:'travellersBoots'},
  ironGauntlets:{n:'Iron Gauntlets',t:'gear',kind:'gauntlet',uses:1,gear:{str:2},key:'ironGauntlets'}
});
const GEAR_N={def:'Def',res:'Res',spd:'Spd',mov:'Move',str:'Str'};
function gearOf(u){const g={def:0,res:0,spd:0,mov:0,str:0},seen=new Set();
  for(const it of u.items||[]){const x=IT[it.k];if(!x||x.t!=='gear'||seen.has(it.k))continue;seen.add(it.k);for(const s in x.gear)g[s]+=x.gear[s]}return g}
const gearText=x=>Object.entries(x.gear).map(([s,v])=>`${v>0?'+':''}${v} ${GEAR_N[s]}`).join(', ');
const tradable=k=>!WTYPES.includes(IT[k].t)&&IT[k].t!=='spirit';
const tradeMates=u=>u.summon?[]:state.units.filter(o=>o!==u&&o.team==='p'&&!o.summon&&o.hp>0&&man(o,u)===1);
/* trading: click one of your items to hand it over, or one of theirs to take it. Doesn't use up the action. */
async function tradeWith(u){
  let mates=tradeMates(u),o=mates[0];
  for(;;){
    const col=(a,b,tag)=>`<div class="tcol"><div class="ch"><b>${a.name}</b><span>${a.items.length}/5</span></div><div class="inv">${a.items.map((it,i)=>{const x=IT[it.k],ok=tradable(it.k)&&b.items.length<5;
      return`<button type="button" class="it" data-m="${ok?tag+i:'no'}"${ok?'':' aria-disabled="true"'}><img src="${icon(it.k)}" alt="">${x.n}${tradable(it.k)?'':' <em>weapon</em>'}<span class="u">${x.t==='gear'?gearText(x):(x.r?`Rng ${rngTxt(x.r)} · `:'')+it.u+'/'+x.uses}</span></button>`}).join('')||'<p class="skd">No items.</p>'}</div></div>`;
    const m=await modal(`<div class="eyebrow">Trade</div><h2>${u.name} and ${o.name}</h2><p>Click an item to pass it across. Salves and gear can be traded; weapons can’t.</p>
      ${mates.length>1?`<div class="mbtns">${mates.map((x,i)=>`<button type="button" data-m="w${i}"${x===o?' class="go"':''}>${x.name}</button>`).join('')}</div>`:''}
      <div class="trade">${col(u,o,'g')}${col(o,u,'t')}</div><div class="mbtns"><button class="go" type="button" data-m="done">Done</button></div>`);
    if(m==='done')return;if(m==='no')continue;
    if(m[0]==='w'){o=mates[+m.slice(1)];continue}
    const[from,to]=m[0]==='g'?[u,o]:[o,u],it=from.items.splice(+m.slice(1),1)[0];to.items.push(it);sfx('item');
  }
}

/* ---- skill rewards: a unit learns a skill from its role's list (ROLES[role].skills in 14-classes.js) ---- */
const roleOfU=u=>{const c=u.cast&&castDef(u.cast);return(c?c.cls:u.cls).split('.')[1]};
const roleSkills=u=>((ROLES[roleOfU(u)]||{}).skills||[]).filter(k=>SKILLS[k]&&!has(u,k));
async function learnSkill(title){
  for(;;){
    const u=await pickUnit(title||`Learn a ${rwTag('skill','skill')}`,'Choose who learns. Each unit picks from the skills that suit their role.',u=>roleSkills(u).length?null:'Knows them all','Skip',null,'skill');
    if(!u)return null;
    const opts=shuffle(roleSkills(u).slice()).slice(0,3);
    const m=await modal(`<div class="eyebrow">${rwTag('skill')}</div><h2>${u.name} learns…</h2><div class="inv">${opts.map((k,i)=>`<button type="button" class="it" data-m="s${i}"><span><b>${SKILLS[k].n}</b> · ${SKILLS[k].d}</span></button>`).join('')}</div><div class="mbtns"><button type="button" data-m="back">Back</button></div>`);
    if(m==='back')continue;const k=opts[+m.slice(1)];(u.skills=u.skills||[]).push({id:k,src:'learned'});sfx('fanfare');toast(`${u.name} learns ${SKILLS[k].n}`);return u}
}
/* a set skill (treasure 'skill:<id>'): pick who learns it */
async function allocSkill(k,title){
  const sk=SKILLS[k];
  const u=await pickUnit(title||`New ${rwTag('skill','skill')}: ${sk.n}`,`<b>${sk.n}</b>: ${sk.d} Choose who learns it.`,u=>has(u,k)?'Already knows it':null,'Skip',null,'skill');
  if(!u)return null;
  (u.skills=u.skills||[]).push({id:k,src:'learned'});sfx('fanfare');toast(`${u.name} learns ${sk.n}`);return u;
}

/* ---- summons ---- */
const isSummoner=u=>u.cls.startsWith('G.summoner.');
const canSummon=u=>isSummoner(u)&&(u.sumLeft||0)>0&&summonTile(u);
/* ---- familiars: a Summoner's bonded spirit (u.familiar). Only the Spirit Frog now (Seren's) ---- */
const FAMILIARS={spiritFrog:{cls:'SpiritFrog',n:'Spirit Frog',d:'wades through water, spits acid from 1–2 tiles'}};
/* CLS / FOE fields: see the CLASSES and ENEMY STATS keys in 01-data.js */
Object.assign(CLS,{SpiritFrog:{n:'Spirit Frog',w:['blade'],body:'beast',mov:5,wade:true}});
IT.tongue={n:'Acid Spew',acid:true,t:'blade',kind:'claw',mt:4,hit:90,crit:5,r:[1,2],uses:99,key:'fangs'};
Object.assign(FOE,{SpiritFrog:{b:[17,5,0,6,6,3,3,4],g:[.55,.35,0,.35,.35,.2,.15,.2],items:['tongue'],look:{body:'#7ad8b0',belly:'#e8fff4',eye:'#ffffff',spirit:true}}});
const famOf=u=>FAMILIARS[u.familiar]||FAMILIARS.spiritFrog;
function summonTile(u){const probe={cls:famOf(u).cls};let best=null,bd=1e9;
  for(const[dx,dy]of DIRS){const x=u.x+dx,y=u.y+dy;if(x<0||y<0||x>=MW||y>=MH||unitAt(x,y)||mcost(probe,x,y)>=99)continue;
    const d=Math.min(99,...state.units.filter(o=>o.team==='e').map(o=>Math.abs(o.x-x)+Math.abs(o.y-y)));if(d<bd){bd=d;best={x,y}}}return best}
function allyMon(c,lv,name,id){const m=mkMon(c,lv);Object.assign(m,{team:'p',summon:true,id,name,acted:false});m.items.forEach(i=>delete i.d);return m}
/* a familiar's level: the summoner's (−1, +3 once ascended), but never below the enemies on this floor, so it keeps up
   late in the run. From Act 2 it is tougher on top: +4 HP and +1 Str, Mag, Def and Res for each act past the first */
function sumLv(u){const act=run.act||1,foeLv=1+Math.floor(((act-1)*10+flScale(run.n))*.6);return Math.max(1,u.lv+(CLS[u.cls].tier===2?3:0)-1,foeLv)}
function sumBoost(m){const k=(run.act||1)-1;if(k<=0)return m;m.maxhp+=4*k;m.hp=m.maxhp;for(const s of['str','mag','def','res'])m[s]+=k;return m}
function doSummon(u){const F=famOf(u),t=summonTile(u);if(!t)return;u.sumLeft--;const m=sumBoost(allyMon(F.cls,sumLv(u),`${u.name}’s ${F.n}`,'sum'+(run.uid++)));m.x=t.x;m.y=t.y;m.acted=true;m.owner=u.id;state.units.push(m);sfx('heal');pop(m,'Summoned','heal')}
function battleAllies(){
  for(const u of state.units)if(u.team==='p'&&isSummoner(u))u.sumLeft=CLS[u.cls].tier===2?2:1;
}

