/* Gear, trading, skill allocation and summons */
/* ---- gear: non-weapon items that work while carried (one of each kind counts), and can be traded ---- */
Object.assign(IT,{
  leatherArmour:{n:'Leather Armour',t:'gear',kind:'armor',uses:1,gear:{def:2},key:'leatherArmour'},
  chainmail:{n:'Chainmail',t:'gear',kind:'armor',uses:1,gear:{def:4,spd:-1},tint:'steel',key:'chainmail'},
  wardingCloak:{n:'Warding Cloak',t:'gear',kind:'cloak',uses:1,gear:{res:3},key:'wardingCloak'},
  travellersBoots:{n:'Traveller’s Boots',t:'gear',kind:'boots',uses:1,gear:{mov:1},key:'travellersBoots'},
  ironGauntlets:{n:'Iron Gauntlets',t:'gear',kind:'gauntlet',uses:1,gear:{str:2},key:'ironGauntlets'},
  /* Buckthor Moccasin's shoes (the dwarf cobbler event) */
  featherstep:{n:'Featherstep Moccasins',t:'gear',kind:'boots',uses:1,gear:{spd:2},tint:'moccasin',key:'featherstep'},
  hobnailBoots:{n:'Hobnail Boots',t:'gear',kind:'boots',uses:1,gear:{def:2},tint:'hobnail',key:'hobnailBoots'}
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
function gearArt(p,kd,c){
  if(kd==='armor'){p.poly([[3,3],[6,2],[10,2],[13,3],[13,13],[8,15],[3,13]],c.tint==='steel'?'#b3d0f0':'#8a5a32');p.rect(7,3,2,11,c.tint==='steel'?'#7f889b':'#5a3a22');p.rect(3,6,10,1,c.tint==='steel'?'#7f889b':'#6a4428')}
  if(kd==='cloak'){p.poly([[5,2],[11,2],[14,15],[2,15]],'#4a5a8a');p.poly([[5,2],[8,2],[6,15],[2,15]],'#3a4870');p.ell(8,3,2,1.5,GOLD)}
  if(kd==='boots'){const[b1,b2,trim]=c.tint==='moccasin'?['#c9a070','#d8b080','#c8322e']:c.tint==='hobnail'?['#3a2e2a','#4a3c36','#9aa3b5']:['#7a5230','#8a6040',GOLD];
    p.rect(3,4,4,8,b1);p.rect(3,11,7,3,b1);p.rect(9,4,4,8,b2);p.rect(9,11,6,3,b2);p.rect(3,4,4,1,trim);p.rect(9,4,4,1,trim);
    if(c.tint==='hobnail')for(const x of[4,6,8,10,12,14])p.set(x,14,'#c8d0dc');if(c.tint==='moccasin')for(const[x,y]of[[4,7],[6,9],[10,7],[12,9]])p.set(x,y,'#3a8ac8')}
  if(kd==='gauntlet'){p.rect(4,6,8,8,'#9aa3b5');p.rect(4,3,2,4,'#9aa3b5');p.rect(7,2,2,5,'#9aa3b5');p.rect(10,3,2,4,'#9aa3b5');p.rect(4,12,8,2,'#6a7385')}
}

/* ---- skill rewards: pick who learns it; a unit without room can forget a learned skill ---- */
const SKILL_POOL=()=>Object.keys(SKILLS).filter(k=>!['command','venom','stoneGaze'].includes(k)&&!SKILLS[k].kit);
async function allocSkill(k,title){
  const sk=SKILLS[k];
  for(;;){
    const why=u=>has(u,k)?'Already knows it':null;
    const u=await pickUnit(title||`New skill: ${sk.n}`,`<b>${sk.n}</b> (capacity ${sk.cost}): ${sk.d} Choose who learns it.`,why,'Skip',sk.cost);
    if(!u)return null;
    if(!learnBlock(u,k)){(u.skills=u.skills||[]).push({id:k,src:'scroll'});sfx('fanfare');toast(`${u.name} learns ${sk.n}`);return u}
    const can=(u.skills||[]).filter(x=>x.src==='scroll'&&capUsed(u)-SKILLS[x.id].cost+sk.cost<=capOf(u));
    const m=await modal(`<h2>${u.name} has no room</h2><p>${sk.n} needs ${sk.cost} capacity; ${u.name} has ${capOf(u)-capUsed(u)} free.${can.length?' Forget a learned skill to make room?':' Nothing they could forget would free enough room.'}</p>
      <div class="inv">${can.map((x,i)=>`<button type="button" class="it" data-m="f${i}"><span><b>Forget ${SKILLS[x.id].n}</b> · ${SKILLS[x.id].d}</span></button>`).join('')}</div><div class="mbtns"><button type="button" data-m="back">Back</button></div>`);
    if(m==='back')continue;const x=can[+m.slice(1)];u.skills.splice(u.skills.indexOf(x),1);u.skills.push({id:k,src:'scroll'});sfx('fanfare');toast(`${u.name} learns ${sk.n}`);return u;
  }
}

/* ---- summons ---- */
const isSummoner=u=>u.cls.startsWith('G.summoner.');
const canSummon=u=>isSummoner(u)&&(u.sumLeft||0)>0&&summonTile(u);
/* ---- familiars: each Summoner is bonded to one spirit for life (u.familiar) ---- */
const FAMILIARS={spiritWolf:{cls:'SpiritWolf',n:'Spirit Wolf',d:'fast, bites in melee'},stoneWarden:{cls:'StoneWarden',n:'Stone Warden',d:'slow and sturdy, a wall for the back line'},
  wisp:{cls:'Wisp',n:'Wisp',d:'floats, casts light magic at range 1–2'},spiritHawk:{cls:'SpiritHawk',n:'Spirit Hawk',d:'flies, quick strikes'},
  spiritFrog:{cls:'SpiritFrog',n:'Spirit Frog',d:'wades through water, lashes its tongue from 1–2 tiles'}};
/* CLS / FOE fields: see the CLASSES and ENEMY STATS keys in 01-data.js */
Object.assign(CLS,{SpiritWolf:{n:'Spirit Wolf',w:['blade'],body:'beast',mov:6},StoneWarden:{n:'Stone Warden',w:['heavy'],body:'golem',mov:4},
  Wisp:{n:'Wisp',w:['art'],body:'flame',mov:5,fly:true},SpiritHawk:{n:'Spirit Hawk',w:['blade'],body:'hawk',mov:7,fly:true},
  SpiritFrog:{n:'Spirit Frog',w:['blade'],body:'beast',mov:5,wade:true}});
IT.tongue={n:'Tongue',t:'blade',kind:'claw',mt:4,hit:90,crit:5,r:[1,2],uses:99,key:'fangs'};
Object.assign(FOE,{SpiritWolf:{b:[16,5,0,5,8,2,2,2],g:[.5,.35,0,.35,.45,.15,.1,.15],items:['fangs'],look:{fur:'#8ad8ff',eye:'#ffffff',spirit:true}},
  StoneWarden:{b:[22,6,0,3,2,1,8,4],g:[.7,.35,0,.2,.1,.05,.35,.2],items:['slam'],look:{body:'#8ab0d0',eye:'#e8faff',spirit:true}},
  Wisp:{b:[14,0,6,6,6,3,1,6],g:[.45,0,.4,.35,.4,.2,.05,.35],items:['dawnSigil'],look:{body:'#9fe8ff',core:'#f3fdff',rim:'#3a88d8',spirit:true}},
  SpiritHawk:{b:[13,5,0,7,10,3,1,3],g:[.4,.35,0,.35,.45,.2,.1,.15],items:['talons'],look:{body:'#7ac8f0',spirit:true}},
  SpiritFrog:{b:[17,5,0,6,6,3,3,4],g:[.55,.35,0,.35,.35,.2,.15,.2],items:['tongue'],look:{body:'#7ad8b0',belly:'#e8fff4',eye:'#ffffff',spirit:true}}});
const famOf=u=>FAMILIARS[u.familiar]||FAMILIARS.spiritWolf;
function summonTile(u){const probe={cls:famOf(u).cls};let best=null,bd=1e9;
  for(const[dx,dy]of DIRS){const x=u.x+dx,y=u.y+dy;if(x<0||y<0||x>=MW||y>=MH||unitAt(x,y)||mcost(probe,x,y)>=99)continue;
    const d=Math.min(99,...state.units.filter(o=>o.team==='e').map(o=>Math.abs(o.x-x)+Math.abs(o.y-y)));if(d<bd){bd=d;best={x,y}}}return best}
function allyMon(c,lv,name,id){const m=mkMon(c,lv);Object.assign(m,{team:'p',summon:true,id,name,acted:false});m.items.forEach(i=>delete i.d);return m}
/* a familiar's level: the summoner's (−1, +3 once ascended), but never below the enemies on this floor, so it keeps up
   late in the run. From Act 2 it is tougher on top: +4 HP and +1 Str, Mag, Def and Res for each act past the first */
function sumLv(u){const act=run.act||1,foeLv=1+Math.floor(((act-1)*10+flScale(run.n))*.6);return Math.max(1,u.lv+(CLS[u.cls].tier===2?3:0)-1,foeLv)}
function sumBoost(m){const k=(run.act||1)-1;if(k<=0)return m;m.maxhp+=4*k;m.hp=m.maxhp;for(const s of['str','mag','def','res'])m[s]+=k;return m}
function doSummon(u){const F=famOf(u),t=summonTile(u);if(!t)return;u.sumLeft--;const m=sumBoost(allyMon(F.cls,sumLv(u),`${u.name}’s ${F.n}`,'sum'+(run.uid++)));m.x=t.x;m.y=t.y;m.acted=true;m.owner=u.id;state.units.push(m);sfx('rise');pop(m,'Summoned','heal')}
function battleAllies(){
  for(const u of state.units)if(u.team==='p'&&isSummoner(u))u.sumLeft=CLS[u.cls].tier===2?2:1;
}

