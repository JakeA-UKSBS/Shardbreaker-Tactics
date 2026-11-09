/* Run state, classes built from role + movement + weapon (the cast's classes), and monster setup */
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
    b:[17,0,3,4,6,5,1,6],gr:[[50,5],[0,10],[40,55],[30,45],[40,55],[40,60],[10,20],[40,60]],bonus:[4,0,2,1,2,0,1,3]},
  rogue:{n:'Rogue',n2:'Assassin',w:['blade'],body:'tunic',crit:5,skills:['flurry','whirlwind','hitAndRun','wolfsbane','focus'],
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
/* WN: weapon type names. SEC: second weapon type gained on promotion. */
const WN={blade:'Blade',heavy:'Axe',pole:'Lance',bow:'Bow'};
const SEC={blade:'pole',heavy:'blade',pole:'heavy',bow:'blade',art:'spirit'};
/* Class keys look like G.role.move.weapon.tier and are rebuilt on demand, so saves only store the key. */
function ensureCls(k){
  if(CLS[k]||!k.startsWith('G.'))return k;
  const[,r,m,w,t]=k.split('.'),R=ROLES[r],M=MOVES[m],t2=t==='2';
  const ws=w==='spirit'?['spirit']:(r==='shield'||r==='knight')?['blade','pole']:[w];if(t2&&SEC[w]&&!ws.includes(SEC[w])&&!['shield','knight','sword','rogue'].includes(r))ws.push(SEC[w]);
  CLS[k]={n:(M.pre&&r!=='knight'?M.pre+' ':'')+(WN[w]&&!['rogue','shield','knight','sword','bruiser'].includes(r)?WN[w]+' ':'')+(M.names?M.names[r][t2?1:0]:R.nw&&R.nw[w]?R.nw[w][t2?1:0]:t2?R.n2:R.n),w:ws,body:m==='armour'?'armor':R.body,mov:M.mov+(t2?1:0),crit:R.crit||0,mnt:!!M.mnt,fly:!!M.fly};
  if(t2)Object.assign(CLS[k],{tier:2,bonus:R.bonus});else{CLS[k].promo=`G.${r}.${m}.${w}.2`;ensureCls(CLS[k].promo)}
  return k;
}

/* ---- monsters ---- */
/* fields: see the CLASSES key in 01-data.js */
Object.assign(CLS,{
  Wolf:{n:'Wolf',w:['blade'],body:'beast',mov:6,crit:5},
  Lamia:{n:'Lamia',w:['art'],body:'serpent',mov:5}
});
IT.fangs={n:'Fangs',t:'blade',kind:'claw',mt:5,hit:85,crit:5,r:[1,1],uses:99,key:'fangs'};
IT.talons={n:'Talons',t:'blade',kind:'claw',mt:4,hit:90,crit:5,r:[1,1],uses:99,key:'talons'};
/* fields: see the ENEMY STATS key in 01-data.js (b/g order: HP, Str, Mag, Skl, Spd, Lck, Def, Res) */
Object.assign(FOE,{
  Wolf:{b:[15,5,0,3,7,1,2,0],g:[.55,.35,0,.3,.45,.1,.15,.05],items:['fangs'],look:{}},
  Lamia:{b:[18,0,5,4,4,1,3,4],g:[.6,0,.4,.3,.3,.1,.15,.3],items:['thornSigil'],look:{}}
});
function monLook(c){
  if(MONLOOK[c])return MONLOOK[c]();
  return clone(FOE[c].look||{});
}
function mkMon(c,lv){const u=foe(c,lv,0,0);u.look=monLook(c);/* monsters move 1 less than their class (4+ only), so they rarely reach you on turn 1 */if(u.mov>=4)u.mov--;
  return u}
