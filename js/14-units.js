/* Run state, class building, names, random looks, unit generation */
/* ================= RUN (roguelike) ================= */
/* Act 1: a branching node map of ROWS floors, then the boss on floor RUN_LEN (both defined with the map below). Units, classes, looks, maps and enemies all come from the run's seed. */
/* TEAM_CAP: max units in the squad */
const TEAM_CAP=6;
let run=null;

/* ---- classes from parts: role + movement + weapon ---- */
/* b = base stats, gr = growth ranges (%), both in ST order: HP Str Mag Skl Spd Lck Def Res */
/* also: n / n2 = base and promoted class name, w = weapon types, body = sprite body, crit = bonus Crit %, skills = starting skill pool,
   gr = [min, max] growth % per stat (rolled per unit), bonus = stats added on promotion */
const ROLES={
  bruiser:{n:'Fighter',n2:'Warrior',w:['heavy','pole'],body:'vest',crit:5,skills:['wrath','swiftstrike','steadfast','quickDraw','momentum','stonebane'],
    b:[21,7,0,4,4,2,4,1],gr:[[75,95],[45,65],[0,10],[30,45],[30,45],[15,35],[20,35],[5,20]],bonus:[5,3,0,1,2,0,2,1]},
  tank:{n:'Guard',n2:'Bastion',w:['blade','heavy','pole'],body:'armor',skills:['steadfast','taunt','ironSkin','retaliate','spiritbane'],
    b:[22,5,0,3,2,1,7,1],gr:[[80,100],[40,55],[0,10],[25,40],[15,30],[15,30],[35,50],[5,20]],bonus:[6,2,0,1,1,0,4,2]},
  skirm:{n:'Skirmisher',n2:'Duelist',w:['blade','pole','bow'],body:'tunic',crit:10,skills:['swiftstrike','focus','keenEye','hitAndRun','flurry','earlyEdge'],
    b:[18,5,0,7,8,4,3,2],gr:[[60,80],[35,50],[0,15],[45,65],[50,70],[30,50],[15,30],[15,30]],bonus:[3,2,0,3,3,0,1,2]},
  caster:{n:'Sigilist',n2:'Runelord',w:['art'],body:'robe',skills:['kindle','focus','spellWard','quickStudy'],
    b:[17,0,6,5,5,3,2,5],gr:[[55,70],[0,10],[45,65],[35,50],[35,55],[20,40],[10,20],[35,55]],bonus:[3,0,3,2,1,0,1,3]},
  support:{n:'Mender',n2:'Lightbearer',w:['spirit'],body:'robe',skills:['renewal','spellWard','fleetFoot','quickStudy'],
    b:[17,0,3,4,6,5,1,6],gr:[[50,65],[0,10],[40,55],[30,45],[40,55],[40,60],[10,20],[40,60]],bonus:[4,0,2,1,2,0,1,3]},
  rogue:{n:'Rogue',n2:'Assassin',w:['blade'],body:'tunic',crit:15,skills:['flurry','whirlwind','hitAndRun','wolfsbane','focus'],
    b:[16,5,0,7,9,6,2,1],gr:[[50,65],[30,45],[0,10],[45,60],[55,70],[40,60],[10,20],[10,25]],bonus:[3,2,0,3,3,2,1,1]},
  /* fast duelist: swords only, high Spd and crit */
  sword:{n:'Swordsman',n2:'Swordmaster',w:['blade'],body:'tunic',crit:10,skills:['swiftstrike','flurry','focus','wolfsbane','earlyEdge'],
    b:[18,6,0,7,9,4,3,1],gr:[[60,75],[40,55],[0,10],[45,60],[55,70],[30,45],[15,25],[10,25]],bonus:[3,3,0,3,3,0,1,1]},
  /* tanks with a shield: the Shieldmaiden protects her neighbours, the Knight is an armoured wall */
  shield:{n:'Shieldmaiden',n2:'Shield Warden',w:['blade','pole'],body:'tunic',shield:true,skills:['guardian','steadfast','taunt','spellWard'],
    b:[20,4,0,4,5,3,6,4],gr:[[70,90],[35,50],[0,10],[30,45],[30,45],[20,40],[30,45],[20,35]],bonus:[5,2,0,1,2,0,3,3]},
  knight:{n:'Knight',n2:'General',w:['blade','pole'],body:'armor',shield:true,skills:['pikeWall','steadfast','ironSkin','retaliate'],
    b:[24,5,0,3,1,0,9,0],gr:[[85,100],[45,60],[0,10],[20,35],[10,25],[10,25],[40,55],[0,15]],bonus:[7,3,0,1,0,0,5,1]},
  /* summons a minion from the current region once per battle (twice once promoted) */
  summoner:{n:'Summoner',n2:'Conjurer',w:['art'],body:'robe',skills:['kindle','focus','quickStudy'],
    b:[16,0,5,4,5,3,2,5],gr:[[50,65],[0,10],[40,55],[30,45],[35,50],[25,45],[10,20],[35,50]],bonus:[3,0,3,2,1,0,1,3]}
};
/* MOVES: movement types. mov = Move, pre = name prefix, st = stat changes in stat order [HP, Str, Mag, Skl, Spd, Lck, Def, Res],
   mnt = mounted, fly = flier, names = class names per role [base, promoted] */
const MOVES={foot:{mov:5},armour:{pre:'Iron',mov:4,st:[2,1,0,0,-2,0,3,0]},
  /* Mounted: 7 move, slowed by forest and hills. Names replace the role word, e.g. Lance Cavalier. */
  flying:{mov:6,mnt:true,fly:true,st:[-1,0,0,0,1,1,-1,1],names:{bruiser:['Wyvern Rider','Wyvern Lord'],tank:['Wyvern Knight','Dragonmaster'],skirm:['Pegasus Knight','Falcon Knight'],caster:['Sky Mage','Storm Sage'],support:['Sky Mender','Seraph'],summoner:['Sky Caller','Storm Caller'],rogue:['Sky Raider','Sky Reaver'],sword:['Sky Blade','Sky Master'],shield:['Sky Shield','Valkyrie Knight'],knight:['Wyvern Knight','Dragonmaster']}},
  mounted:{mov:7,mnt:true,st:[1,0,0,0,1,0,0,-1],names:{bruiser:['Rider','Warlord'],tank:['Cavalier','Paladin'],skirm:['Outrider','Ranger'],caster:['Battlemage','Archmage'],support:['Troubadour','Valkyrie'],summoner:['Beastcaller','Beastmaster'],rogue:['Raider','Marauder'],sword:['Blade Rider','Blade Lord'],shield:['Shield Rider','Shield Lord'],knight:['Cavalier','Paladin']}}};
/* WN: weapon type names. SEC: second weapon type gained on promotion. KIT: starting weapons per type (keys in IT). */
const WN={blade:'Blade',heavy:'Axe',pole:'Lance',bow:'Bow'};
const SEC={blade:'pole',heavy:'blade',pole:'heavy',bow:'blade',art:'spirit'};
const KIT={blade:['wornSword','thornRapier','hookedBlade'],heavy:['hatchet','halberd'],pole:['ironSpear','javelin'],bow:['shortBow','crossbow'],art:['emberSigil','dawnSigil','emberSigil','dawnSigil','umbralSigil']};
/* Class keys look like G.role.move.weapon.tier and are rebuilt on demand, so saves only store the key. */
function ensureCls(k){
  if(CLS[k]||!k.startsWith('G.'))return k;
  const[,r,m,w,t]=k.split('.'),R=ROLES[r],M=MOVES[m],t2=t==='2';
  const ws=w==='spirit'?['spirit']:(r==='shield'||r==='knight')?['blade','pole']:[w];if(t2&&SEC[w]&&!ws.includes(SEC[w])&&!['shield','knight','sword','rogue'].includes(r))ws.push(SEC[w]);
  CLS[k]={n:(M.pre&&r!=='knight'?M.pre+' ':'')+(WN[w]&&!['rogue','shield','knight','sword','bruiser'].includes(r)?WN[w]+' ':'')+(M.names?M.names[r][t2?1:0]:R.nw&&R.nw[w]?R.nw[w][t2?1:0]:t2?R.n2:R.n),w:ws,body:m==='armour'?'armor':R.body,mov:M.mov+(t2?1:0),crit:R.crit||0,mnt:!!M.mnt,fly:!!M.fly};
  if(t2)Object.assign(CLS[k],{tier:2,bonus:R.bonus});else{CLS[k].promo=`G.${r}.${m}.${w}.2`;ensureCls(CLS[k].promo)}
  return k;
}

/* ---- names ---- */
/* NA + NB: name parts joined to make random unit names */
const NA=['Ael','Bran','Cor','Dar','El','Fen','Gar','Hal','Is','Jor','Kael','Lir','Mor','Nym','Or','Per','Ryn','Sel','Tor','Ul','Vey','Wyn','Yr','Zan','Ash','Bel','Cy','Ed','Mar','Thal'];
const NB=['a','an','ric','wyn','eth','is','or','ira','en','ius','elle','ard','as','yn','orn','ia','ith','os','ene','ren'];
const genName=(sx)=>pick(NA)+pick(sx==='f'?['a','ira','elle','ia','ene','wyn','is','yn']:sx==='m'?['ric','ard','orn','ius','os','an','or','eth']:NB);
const BOSSN=['Gorvak','Bruul','Hraxa','Murgh','Tarvos','Kragga'],BOSST=['the Horned','Bloodhoof','the Ironhide','of the Maze'];

/* ---- random looks: hair, headgear, outfit colours, skin, extras ---- */
/* random look palettes (hex): skin tones, hair colours, clothing, sashes, eye colours; GEAR: headwear options per role */
const SKINS=['#f6dcc4','#f3cfa6','#e8b98f','#c98e62','#a8714a','#7a4e32'];
const HAIRC=['#1d1a24','#3a2a20','#6b4226','#a8743a','#d9b25a','#e8e2d0','#8a2a22','#3a4a6a','#c9c3cf','#4a2a4a'];
const CLOTH=['#3a7cc0','#4a8a5a','#8a3a3a','#6a4a8a','#a8743a','#3a6a7a','#7a6a4a','#8a5a7a','#4a5a3a','#5a6a8a','#2f4f6f','#9a4a2a'];
const SASH=['#e2b553','#c8322e','#efe6cf','#5fc2a0','#2a2230','#9fd8ff'];
const EYES=['#2a2230','#3a5a8a','#3a6a3a','#6a3a2a','#5a4a7a'];
const GEAR={sword:['headband','ribbon','none','circlet','none'],shield:['helm','ribbon','headband','circlet'],knight:['helm','helm','helm','none'],rogue:['hood','ribbon','headband','none'],summoner:['hood','veil','circlet','hood'],bruiser:['headband','none','none','circlet'],tank:['helm','helm','none','headband'],skirm:['hood','ribbon','headband','cap','none'],
  caster:['hood','veil','hairpin','guan','circlet','none'],support:['veil','hairpin','circlet','hood','none']};
function genLook(role,mv,w){
  const st=pick(['long','bun','tail','wild','topknot','short','short','bald']);
  let gear=pick(GEAR[role]);if(w==='bow'&&rand()<.4)gear='cap';if(mv==='armour'&&rand()<.4)gear='helm';
  const L={style:st,gear:gear==='none'?undefined:gear,hair:pick(HAIRC),skin:pick(SKINS),cloth:pick(CLOTH),sash:pick(SASH),eye:pick(EYES)};
  if(rand()<.2&&st!=='long')L.beard=true;
  /* Shieldmaidens (on foot) are women, Knights are men; mounted and flying shield units can be either */
  if(role==='shield'&&mv==='foot'){L.fem=true;delete L.beard;if(!['long','bun','tail','topknot'].includes(L.style))L.style=pick(['long','bun','tail'])}
  if(role==='knight'){L.masc=true;if(L.style==='long')L.style=pick(['short','wild'])}
  if(rand()<.25)L.cape=true;
  if(ROLES[role]&&ROLES[role].shield)L.shield=pick(['round','kite']);
  if(mv==='mounted'||mv==='flying')Object.assign(L,mountLook(mv,role));
  return L;
}

/* ---- units ---- */
function startItems(role,w){
  if(role==='support')return[{k:'mendingStaff',u:IT.mendingStaff.uses},{k:'salve',u:IT.salve.uses}];
  if(role==='summoner'){const k=pick(['crookStaff','runeStaff']);return[{k,u:IT[k].uses},{k:'salve',u:IT.salve.uses}]}
  if(role==='rogue'){const k=pick(['dirk','dirk','twinDaggers','stiletto']);return[{k,u:IT[k].uses},{k:'salve',u:IT.salve.uses}]}
  const kit=(role==='shield'||role==='knight')?KIT[w].filter(k=>!['twin','rapier'].includes(IT[k].kind)&&k!=='thornRapier'):KIT[w],k=pick(kit.length?kit:KIT[w]);return[{k,u:IT[k].uses},{k:'salve',u:IT.salve.uses}];
}
function genUnit(lv,role){
  role=role||pick(Object.keys(ROLES).filter(r=>r!=='summoner'||unl('summoner')));const R=ROLES[role],w=pick(R.w);
  /* only Knights wear heavy armour; Rogues and Summoners always go on foot */const heavy=role==='knight',grounded=role==='rogue'||role==='summoner';let mv=heavy?'armour':!grounded&&rand()<.22?'mounted':'foot';
  if(mv==='foot'&&!grounded&&w!=='bow'&&unl('flying')&&rand()<.15)mv='flying';
  const cls=ensureCls(`G.${role}.${mv}.${w}.1`),M=MOVES[mv];
  const s=R.b.map(v=>Math.max(0,v+ri(-1,1)));if(M.st)M.st.forEach((d,i)=>s[i]=Math.max(0,s[i]+d));
  const g=R.gr.map(([a,b])=>ri(a,b));
  const u={id:'u'+(run.uid++),name:genName(role==='shield'&&mv==='foot'?'f':role==='knight'?'m':0),cls,team:'p',lv:1,exp:0,skill:pick(R.skills),skills:[],cap:BASE_CAP,look:genLook(role,mv,w),g,mov:CLS[cls].mov,items:startItems(role,w),acted:false,x:0,y:0};
  ST.forEach((k,i)=>u[k]=s[i]);u.maxhp=u.hp;
  for(;u.lv<lv;u.lv++)ST.forEach((k,i)=>{if(rand()*100<g[i]){if(k==='hp')u.maxhp++;else u[k]++}});
  if(role==='summoner')u.familiar=pick(Object.keys(FAMILIARS));
  u.hp=u.maxhp;return foldLuck(u);
}

/* ---- monsters ---- */
/* fields: see the CLASSES key in 01-data.js */
Object.assign(CLS,{
  Wolf:{n:'Wolf',w:['blade'],body:'beast',mov:6,crit:5},
  Harpy:{n:'Harpy',w:['blade'],body:'robe',mov:6,fly:true},
  Lamia:{n:'Lamia',w:['art'],body:'serpent',mov:5},
  Minotaur:{n:'Minotaur',w:['heavy'],body:'vest',mov:4,crit:10}
});
IT.fangs={n:'Fangs',t:'blade',kind:'claw',mt:5,hit:85,crit:5,r:[1,1],uses:99,key:'fangs'};
IT.talons={n:'Talons',t:'blade',kind:'claw',mt:4,hit:90,crit:5,r:[1,1],uses:99,key:'talons'};
/* fields: see the ENEMY STATS key in 01-data.js (b/g order: HP, Str, Mag, Skl, Spd, Lck, Def, Res) */
Object.assign(FOE,{
  Wolf:{b:[15,5,0,3,7,1,2,0],g:[.55,.35,0,.3,.45,.1,.15,.05],items:['fangs'],look:{}},
  Harpy:{b:[16,5,0,5,6,2,1,2],g:[.5,.35,0,.35,.4,.15,.1,.2],items:['talons'],look:{}},
  Lamia:{b:[18,0,5,4,4,1,3,4],g:[.6,0,.4,.3,.3,.1,.15,.3],items:['thornSigil'],look:{}},
  Minotaur:{b:[24,8,0,3,2,0,5,0],g:[.8,.5,0,.25,.15,.05,.3,.05],items:['hatchet'],look:{}}
});
function monLook(c){
  if(MONLOOK[c])return MONLOOK[c]();
  if(c==='Wolf')return{crysSmall:true,fur:pick(['#8a8f9a','#6b5a48','#3a3640','#c9c3b8','#9a7a52']),eye:'#ffd23f'};
  if(c==='Harpy'){const wg=pick(['#6b5240','#55607a','#7a5a7a','#4a4a3a']);return{style:'wild',hair:pick(HAIRC),skin:pick(['#c9b6a0','#a9a3c0','#b8c4a8']),wing:wg,cloth:wg,eye:'#ffd23f'}}
  if(c==='Lamia')return{style:pick(['long','tail','wild']),hair:pick(HAIRC),tail:pick(['#4f8a5a','#3a7a7a','#7a5aa0','#8a7a3a']),cloth:pick(CLOTH),skin:pick(['#d6c0a0','#b8c8a8','#c9b6a0']),eye:'#ffd23f'};
  if(c!=='Minotaur')return clone(FOE[c].look||{});
  return{style:'bald',horns:true,beard:true,hair:'#2a1a14',skin:pick(['#7a4e32','#5a3a2a','#8a6a4a']),cloth:'#4a3a2a',eye:'#ff5a3a'};
}
/* ---- monster PNGs (art/monsters/) ----
   monsterClasses(): every monster the game can spawn (region pools, bosses, summons, familiars). Bosses drawn as big 64px art (BIG) are left out.
   monsterArt(): the code-drawn sprite with one fixed look, for tools/export-art.mjs to save as the starting PNG. */
function monsterClasses(){const out=new Set();
  for(const B of Object.values(BIOMES)){for(const p of[...(B.pool||[]),...(B.elitePool||[])])out.add(p[0]);if(B.boss){if(B.boss.summon&&B.boss.summon!=='*')out.add(B.boss.summon);if(!BIG[CLS[B.boss.cls].body+(B.boss.look&&B.boss.look.bones?'_bones':'')])out.add(B.boss.cls)}}
  for(const f of Object.values(FAMILIARS))out.add(f.cls);
  out.add('Hawk');/* the Hawk relic's ally */
  return[...out].filter(c=>CLS[c]).sort()}
function monsterArt(c,strike){return art('monsters/'+c+(strike?'-strike':''),()=>{
  const boss=Object.values(BIOMES).find(B=>B.boss&&B.boss.cls===c),s0=rngS;seedRng(7);
  const L=boss?clone(boss.boss.look||{}):monLook(c);rngS=s0;
  return fig(L,c,FOE[c]&&FOE[c].look&&FOE[c].look.spirit?'p':'e',strike?'strike':'idle',FOE[c]&&FOE[c].items[0],1)})}
function mkMon(c,lv){const u=foe(c,lv,0,0);u.look=monLook(c);
  if(c==='Lamia'||c==='Beholder')u.skill='stoneGaze';if(c==='Sporeling')u.skill='poisonSpores';
  if(c==='Skeleton'&&rand()<.35){u.items[0]={k:'shortBow',u:IT.shortBow.uses};u.name='Skeleton Archer'}
  return u}

