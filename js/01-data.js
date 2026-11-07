/* Items, weapons, classes, skills: the static game data */
/* ================= DATA ================= */
const PICS={};

/* STAT ORDER: every 8-number stat array in the game (b, g, s, bonus, st, gr) uses this order:
   [HP, Str, Mag, Skl, Spd, Lck, Def, Res]. Skl is folded into Luck for display (see foldLuck). */
const ST=['hp','str','mag','skl','spd','lck','def','res'];
const SL={hp:'HP',str:'Str',mag:'Mag',skl:'Skl',spd:'Spd',lck:'Luck',def:'Def',res:'Res'};
/* the stats a unit shows and levels: HP, Str or Mag (by class), Luck, Spd, Def, Res. Skl is folded into Luck. */
const usesMag=u=>CLS[u.cls].w.every(t=>t==='art'||t==='spirit');
const shown=u=>['hp',usesMag(u)?'mag':'str','lck','spd','def','res'];
const foldLuck=u=>{u.lck=Math.max(u.lck||0,u.skl||0);return u};
/* attack speed (FE9): weight above your Str (Mag for sigils) slows doubling and dodging */
const wtOver=(u,w)=>Math.max(0,(w&&w.wt||0)-(w&&w.mag?u.mag:u.str));
const AS=(u,w)=>Math.max(0,u.spd+gearOf(u).spd-wtOver(u,w));
/* DIRS: the 4 neighbouring tiles (right, left, down, up). T: tile size in px for the old flat board. */
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
const T=48;
/* TERRAIN, keyed by the letter used in MAPS:
   n = name shown in the tile info, k = art key (tiles/<k>.png and CSS class t-<k>),
   c = Move cost to enter (99 = impassable), av = Avoid bonus, df = Def bonus,
   slow = −1 Move next turn for a unit that starts there. */
const TER={
  '.':{n:'Ashgrass',k:'plain',c:1,av:0,df:0},'f':{n:'Dead Wood',k:'forest',c:2,av:10,df:1},'m':{n:'Rubble',k:'hill',c:3,av:30,df:2},
  'w':{n:'Black Water',k:'water',c:99,av:0,df:0},'=':{n:'Bridge',k:'bridge',c:1,av:0,df:0},
  'R':{n:'Crag',k:'cliff',c:99,av:0,df:0}
};
/* ITEMS AND WEAPONS:
   n = name, t = weapon type (blade/heavy/pole/bow/art/spirit, or item/gear), kind = which icon/sprite shape to draw,
   mt = Might (added to Str or Mag for damage), hit = Hit %, crit = Crit %, r = [min, max] range in tiles, uses = durability (99 = unbreakable),
   wt = weight (set from WT below), el = element of a sigil, mag = uses Mag instead of Str, tint = steel/jade colouring,
   key = icon art key (icons/<key>.png), eff = effective against (×2 damage), amt = HP healed by a staff/salve. */
const IT={
  wornSword:{n:'Worn Sword',t:'blade',kind:'sword',mt:5,hit:90,crit:0,r:[1,1],uses:40},
  twinDaggers:{n:'Twin Daggers',t:'blade',kind:'twindagger',mt:4,hit:95,crit:5,r:[1,1],uses:40},
  knightlySword:{n:'Knightly Sword',t:'blade',kind:'sword',mt:8,hit:75,crit:0,r:[1,1],uses:30,tint:'steel'},
  thornRapier:{n:'Thorn Rapier',t:'blade',kind:'rapier',mt:5,hit:100,crit:10,r:[1,1],uses:30},
  hookedBlade:{n:'Hooked Blade',t:'blade',kind:'scimitar',mt:7,hit:80,crit:5,r:[1,1],uses:35},
  moonglassEdge:{n:'Moonglass Edge',t:'blade',kind:'scimitar',mt:7,hit:80,crit:30,r:[1,1],uses:20,tint:'killer'},
  ironSpear:{n:'Iron Spear',t:'pole',kind:'spear',mt:7,hit:80,crit:0,r:[1,1],uses:45},
  steelSpear:{n:'Steel Spear',t:'pole',kind:'spear',mt:10,hit:70,crit:0,r:[1,1],uses:30,tint:'steel'},
  javelin:{n:'Javelin',t:'pole',kind:'javelin',mt:6,hit:65,crit:0,r:[1,2],uses:20,thrown:true},
  hatchet:{n:'Hatchet',t:'heavy',kind:'axe',mt:8,hit:75,crit:0,r:[1,1],uses:45},
  cleaver:{n:'Cleaver',t:'heavy',kind:'axe',mt:11,hit:65,crit:0,r:[1,1],uses:30,tint:'steel'},
  throwingAxe:{n:'Throwing Axe',t:'heavy',kind:'axe',mt:7,hit:60,crit:0,r:[1,2],uses:20,thrown:true},
  halberd:{n:'Halberd',t:'heavy',kind:'halberd',mt:9,hit:70,crit:0,r:[1,1],uses:40},
  shortBow:{n:'Short Bow',t:'bow',kind:'bow',mt:6,hit:85,crit:0,r:[2,2],uses:45},
  ironwoodBow:{n:'Ironwood Bow',t:'bow',kind:'bow',mt:9,hit:70,crit:0,r:[2,2],uses:30,tint:'steel'},
  crossbow:{n:'Crossbow',t:'bow',kind:'crossbow',mt:8,hit:80,crit:0,r:[2,2],uses:35},
  emberSigil:{n:'Ember Sigil',t:'art',kind:'talisman',el:'fire',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  tideSigil:{n:'Tide Sigil',t:'art',kind:'talisman',el:'water',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  stormSigil:{n:'Storm Sigil',t:'art',kind:'talisman',el:'lightning',mt:8,hit:80,crit:5,r:[1,2],uses:35,mag:true},
  thornSigil:{n:'Thorn Sigil',t:'art',kind:'talisman',el:'nature',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  dawnSigil:{n:'Dawn Sigil',t:'art',kind:'talisman',el:'light',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  umbralSigil:{n:'Umbral Sigil',t:'art',kind:'talisman',el:'dark',mt:5,hit:85,crit:0,r:[1,2],uses:40,mag:true,drain:true},
  crookStaff:{n:'Crook Staff',t:'art',kind:'staff',mt:6,hit:85,crit:0,r:[1,1],uses:45,mag:true},
  runeStaff:{n:'Rune Staff',t:'art',kind:'staff',mt:4,hit:85,crit:0,r:[1,2],uses:40,mag:true},
  mendingStaff:{n:'Mending Staff',t:'spirit',kind:'staff',amt:10,r:[1,1],uses:30},
  dawnStaff:{n:'Dawn Staff',t:'spirit',kind:'staff',amt:20,r:[1,1],uses:20,tint:'mend'},
  greatsword:{n:'Greatsword',t:'blade',kind:'greatsword',mt:11,hit:70,crit:5,r:[1,1],uses:30,tint:'steel'},
  claws:{n:'Claws',t:'blade',kind:'twin',mt:4,hit:85,crit:10,r:[1,1],uses:99},
  labrys:{n:'Labrys',t:'heavy',kind:'axe',mt:12,hit:75,crit:10,r:[1,1],uses:30,tint:'steel'},
  salve:{n:'Salve',t:'item',kind:'pill',amt:10,uses:3}
};
for(const k in IT)IT[k].key=k;
/* ---- weapon weight (Wt): weight above the wielder's Str (Mag for sigils) costs that much attack speed ---- */
Object.assign(IT,{
  dirk:{n:'Dirk',t:'blade',kind:'dagger',mt:3,hit:95,crit:15,r:[1,1],uses:45,key:'dirk'},
  stiletto:{n:'Stiletto',t:'blade',kind:'dagger',thin:true,mt:4,hit:90,crit:25,r:[1,1],uses:30,key:'stiletto'},
  barbedSpear:{n:'Barbed Spear',t:'pole',kind:'spear',mt:8,hit:75,crit:30,r:[1,1],uses:20,tint:'killer',key:'barbedSpear'},
  reaverAxe:{n:'Reaver Axe',t:'heavy',kind:'axe',mt:10,hit:65,crit:30,r:[1,1],uses:20,tint:'killer',key:'reaverAxe'},
  hawkeyeBow:{n:'Hawkeye Bow',t:'bow',kind:'bow',mt:7,hit:80,crit:30,r:[2,2],uses:20,tint:'killer',key:'hawkeyeBow'}
});
/* WT: weapon weight. Weight above the wielder's Str (Mag for sigils) is taken off their attack speed (see wtOver/AS). */
const WT={wornSword:4,twinDaggers:2,knightlySword:8,thornRapier:3,hookedBlade:6,moonglassEdge:6,greatsword:12,ironSpear:6,steelSpear:10,javelin:8,hatchet:7,cleaver:11,throwingAxe:9,halberd:9,labrys:13,
  shortBow:3,ironwoodBow:7,crossbow:6,emberSigil:2,tideSigil:3,stormSigil:5,thornSigil:3,dawnSigil:2,umbralSigil:5,crookStaff:4,runeStaff:3,
  dirk:1,stiletto:2,barbedSpear:7,reaverAxe:9,hawkeyeBow:5};
for(const k in WT)IT[k].wt=WT[k];
/* ---- special weapons from events: jade (killer) weapons, lightning sigils, long-range sigils and charms ---- */
Object.assign(IT,{
  jadeJian:{n:'Jade Jian',t:'blade',kind:'sword',mt:7,hit:80,crit:30,r:[1,1],uses:25,tint:'jade',wt:5},
  jadeFang:{n:'Jade Fang',t:'blade',kind:'dagger',mt:5,hit:90,crit:35,r:[1,1],uses:25,tint:'jade',wt:2},
  jadeSpear:{n:'Jade Spear',t:'pole',kind:'spear',mt:9,hit:75,crit:30,r:[1,1],uses:25,tint:'jade',wt:8},
  jadeAxe:{n:'Jade Axe',t:'heavy',kind:'axe',mt:11,hit:65,crit:30,r:[1,1],uses:25,tint:'jade',wt:10},
  jadeBow:{n:'Jade Bow',t:'bow',kind:'bow',mt:8,hit:75,crit:30,r:[2,2],uses:25,tint:'jade',wt:5},
  longbow:{n:'Longbow',t:'bow',kind:'bow',mt:6,hit:70,crit:0,r:[2,3],uses:30,wt:6},
  /* steel-tier ranged variants (reach 1–2, the arbalest 2–3): trade-ups for the javelin, throwing axe, throwing knives and crossbow */
  pilum:{n:'Pilum',t:'pole',kind:'javelin',mt:9,hit:70,crit:0,r:[1,2],uses:20,thrown:true,wt:9,tint:'steel'},
  tomahawk:{n:'Tomahawk',t:'heavy',kind:'axe',mt:10,hit:65,crit:0,r:[1,2],uses:20,thrown:true,wt:9,tint:'steel'},
  steelKnives:{n:'Steel Knives',t:'blade',kind:'dagger',mt:5,hit:90,crit:10,r:[1,2],uses:30,thrown:true,wt:2,tint:'steel'},
  galeSword:{n:'Gale Sword',t:'blade',kind:'sword',mt:6,hit:80,crit:0,r:[1,2],uses:25,wt:6,tint:'steel'},
  arbalest:{n:'Arbalest',t:'bow',kind:'crossbow',mt:11,hit:75,crit:0,r:[2,3],uses:30,wt:10,tint:'steel'},
  yewGreatbow:{n:'Yew Greatbow',t:'bow',kind:'bow',mt:9,hit:75,crit:0,r:[2,3],uses:30,wt:8,tint:'steel'},
  throwingKnives:{n:'Throwing Knives',t:'blade',kind:'dagger',mt:3,hit:90,crit:10,r:[1,2],uses:30,thrown:true,wt:1},
  sparkSigil:{n:'Spark Sigil',t:'art',kind:'talisman',el:'lightning',mt:4,hit:95,crit:15,r:[1,2],uses:40,mag:true,wt:2},
  thunderheadSigil:{n:'Thunderhead Sigil',t:'art',kind:'talisman',el:'lightning',mt:8,hit:75,crit:30,r:[1,2],uses:25,mag:true,wt:6},
  heavensBolt:{n:'Heaven’s Bolt',t:'art',kind:'talisman',el:'lightning',mt:10,hit:65,crit:5,r:[3,10],uses:5,mag:true,wt:8},
  meteorSigil:{n:'Meteor Sigil',t:'art',kind:'talisman',el:'earth',mt:13,hit:60,crit:0,r:[3,10],uses:5,mag:true,wt:9},
  /* slayer weapons: effective (×2 Mt) against one body tag */
  warHammer:{n:'War Hammer',t:'heavy',kind:'hammer',mt:8,hit:70,crit:0,r:[1,1],uses:30,wt:10,eff:['armoured']},
  huntingSpear:{n:'Hunting Spear',t:'pole',kind:'spear',mt:7,hit:80,crit:0,r:[1,1],uses:30,wt:6,eff:['beast']},
  holySword:{n:'Holy Sword',t:'blade',kind:'sword',mt:8,hit:80,crit:5,r:[1,1],uses:25,wt:6,eff:['spectral'],tint:'holy'},
  giantslayer:{n:'Giantslayer',t:'blade',kind:'greatsword',mt:9,hit:70,crit:0,r:[1,1],uses:25,wt:10,eff:['colossal'],tint:'steel'},
  farStaff:{n:'Far Staff',t:'spirit',kind:'staff',amt:10,r:[1,10],uses:15,tint:'mend'},
  /* two-handed swords (kind greatsword): heavy, hard-hitting blades. Zwei wields only these */
  claymore:{n:'Claymore',t:'blade',kind:'greatsword',mt:9,hit:75,crit:0,r:[1,1],uses:40,wt:10},
  zweihander:{n:'Zweihänder',t:'blade',kind:'greatsword',mt:14,hit:65,crit:5,r:[1,1],uses:30,wt:14,tint:'steel'},
  flamberge:{n:'Flamberge',t:'blade',kind:'greatsword',mt:12,hit:70,crit:20,r:[1,1],uses:25,wt:12,tint:'killer'}
});
for(const k in IT)IT[k].key=k;

/* WTYPES: weapon types. ELN: element display names. */
const WTYPES=['blade','heavy','pole','bow','art'];
const ELN={light:'Light',dark:'Dark',fire:'Fire',nature:'Nature',water:'Water',wind:'Wind',earth:'Earth',lightning:'Lightning',illusion:'Illusion'};
/* CLASSES, keyed by class id (shared by player classes and monsters):
   n = class name shown in game, w = weapon types it can use, body = which sprite body fig() draws (tunic/robe/vest/armor/beast/golem...),
   mov = Move, crit = bonus Crit %, promo = class it promotes to, tier = 2 for promoted classes, bonus = stats added on promotion (stat order above),
   fly = flier (ignores terrain, weak to bows), mnt = mounted, wade = ignores water slowdown, phase = walks through walls, lava = can cross magma,
   jump = how high a step it can climb (default 2). */
const CLS={
  /* a plain townsfolk body for NPC figures (the innkeeper, recruit icons) */
  Villager:{n:'Villager',w:['blade'],body:'tunic',mov:5}
};
/* SKILLS: n = name, cost = skill capacity it takes up (units have BASE_CAP to spend), d = description shown in game. */
const SKILLS={
  command:{n:'Command',cost:10,d:'Allies within 2 tiles gain +10 Hit and +10 Avoid.'},
  steadfast:{n:'Steadfast',cost:5,d:'+4 Def and Res when attacked during the enemy phase.'},
  keenEye:{n:'Keen Eye',cost:5,d:'+20 Hit, and the target\'s terrain gives no Avoid.'},
  kindle:{n:'Kindle',cost:5,d:'+2 Mag when this unit starts the fight.'},
  swiftstrike:{n:'Swiftstrike',cost:5,d:'+3 Spd for doubling when this unit starts the fight.'},
  wrath:{n:'Wrath',cost:10,d:'+15 Crit while at half HP or less.'},
  focus:{n:'Focus',cost:10,d:'+10 Crit when no ally is adjacent.'},
  renewal:{n:'Renewal',cost:10,d:'Adjacent allies recover 5 HP at the start of each of your turns.'},
  bulwark:{n:'Bulwark',cost:15,d:'Luck×2% chance: halves damage from an incoming strike.'},
  stoneGaze:{n:'Stone Gaze',cost:15,d:'Luck% chance on a hit: the target turns to stone, loses its next turn and can\'t counter. Bosses and an Aegis are immune.'}
};
/* more skills */
Object.assign(SKILLS,{
  hitAndRun:{n:'Hit and Run',cost:10,d:'After attacking in melee, steps back one tile if there is room.'},
  quickDraw:{n:'Quick Draw',cost:15,d:'When attacked at half HP or less, strikes first.'},
  flurry:{n:'Flurry',cost:15,d:'Spd% chance of an extra strike in each fight.'},
  whirlwind:{n:'Whirlwind',cost:15,d:'Luck÷2% chance: one strike becomes five hits at half damage.'},
  retaliate:{n:'Retaliate',cost:15,d:'Luck% chance, when hit in melee, to deal the same damage back.'},
  ironSkin:{n:'Iron Skin',cost:10,d:'Luck×2% chance to halve physical damage taken.'},
  spellWard:{n:'Spell Ward',cost:10,d:'Luck×2% chance to halve magic damage taken.'},
  momentum:{n:'Momentum',cost:15,d:'Once per turn, defeating an enemy on your turn lets this unit act again.'},
  fleetFoot:{n:'Fleet Foot',cost:10,d:'+2 Move.'},
  taunt:{n:'Taunt',cost:5,d:'Enemies would rather attack this unit.'},
  quickStudy:{n:'Quick Study',cost:10,d:'Gains double EXP.'},
  earlyEdge:{n:'Early Edge',cost:10,d:'+20 Hit and Avoid on turns 1 to 5.'},
  wolfsbane:{n:'Wolfsbane',cost:10,d:'Effective (×2) against Beasts.'},
  spiritbane:{n:'Spiritbane',cost:10,d:'Effective (×2) against Spectral foes.'},
  stonebane:{n:'Stonebane',cost:10,d:'Effective (×2) against Armoured foes.'},
  guardian:{n:'Guardian',cost:10,d:'Adjacent allies take 2 less damage.'},
  pikeWall:{n:'Pike Wall',cost:5,d:'+4 Def and +10 Hit against mounted units and fliers.'}
});
/* BASE_CAP: skill capacity a unit starts with. PROMO_CAP: extra capacity on promotion. PROMO_LV: level a unit can promote at. */
const BASE_CAP=20,PROMO_CAP=5,PROMO_LV=5;
/* ENEMY STATS, keyed by class id (must also exist in CLS):
   b = base stats at level 1, g = growth per level (a fixed amount, not a % chance), both in stat order [HP, Str, Mag, Skl, Spd, Lck, Def, Res].
   A foe's stat = b + floor(g × (level − 1)), see foe() in 02-rng-units.js.
   items = weapons/attacks it carries (keys in IT), pic = portrait art key, look = sprite options (colours are hex: skin, eye, hair, cloth, wing, shell...).
   Monsters with an entry in MONLOOK get a random look from there instead. */
const FOE={};
/* HAIRS: dark hair colours (hex) */
const HAIRS=['#1d1a24','#2a2230','#3a2a20','#241c1c','#4a3a30'];

/* BATTLE: the current battle (made by genBattle) */
let BATTLE=null;

