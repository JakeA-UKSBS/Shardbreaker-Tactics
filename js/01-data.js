/* Items, weapons, classes, skills: the static game data */
/* ================= DATA ================= */
const PICS={};

/* STAT ORDER: every 8-number stat array in the game (b, g, s, bonus, st, gr) uses this order:
   [HP, Str, Mag, Skl, Spd, Lck, Def, Res]. */
const ST=['hp','str','mag','skl','spd','lck','def','res'];
const SL={hp:'HP',str:'Str',mag:'Mag',skl:'Skl',spd:'Spd',lck:'Luck',def:'Def',res:'Res'};
/* the stats a unit shows and levels: HP, Str or Mag (by class), Skl, Luck, Spd, Def, Res. */
const usesMag=u=>CLS[u.cls].w.every(t=>t==='art'||t==='spirit');
const shown=u=>['hp',usesMag(u)?'mag':'str','skl','lck','spd','def','res'];
/* attack speed (FE9): weight above your Str (Mag for sigils) slows doubling and dodging */
const wtOver=(u,w)=>Math.max(0,(w&&w.wt||0)-(w&&w.mag?u.mag:u.str));
/* Outlander (Vaar): +1 Skl and +1 Spd while no ally is next to him */
const OL=u=>has(u,'outlander')&&typeof state!=='undefined'&&state&&state.units&&!state.units.some(o=>o!==u&&o.team===u.team&&o.hp>0&&man(o,u)===1)?1:0;
/* monster passives: always on, shown on the enemy card */
const MON_PASSIVE={Wolf:'pack',FrostWolf:'pack',BoulderGolem:'heavy',SandstoneGolem:'heavy',GemGolem:'heavy',IceTroll:'trollBlood',BogLurker:'swampSwim'};
const PASSIVE={pack:{n:'Pack Tactics',d:'+10 Hit when next to another wolf.'},heavy:{n:'Heavy',d:"Can't be pushed or pulled."},trollBlood:{n:'Troll Blood',d:'Regains 3 HP each turn. Fire or burning stops it for a turn.'},swampSwim:{n:'Swamp Swimmer',d:'+1 Spd in swamp water and mangrove roots.'}};
const pasOf=u=>u&&u.team==='e'?MON_PASSIVE[u.cls]:null;
const SWIM=u=>pasOf(u)==='swampSwim'&&typeof ter==='function'&&typeof state!=='undefined'&&typeof MAP!=='undefined'&&MAP&&MAP[u.y]&&['water','shallow','mangrove'].includes((ter(u.x,u.y)||{}).k)?1:0;
const AS=(u,w)=>Math.max(0,u.spd+OL(u)+SWIM(u)+gearOf(u).spd-wtOver(u,w));
/* DIRS: the 4 neighbouring tiles (right, left, down, up). T: tile size in px for the old flat board. */
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
const T=48;
/* TERRAIN, keyed by the letter used in MAPS:
   n = name shown in the tile info, k = art key (tiles/<k>.png and CSS class t-<k>),
   c = Move cost to enter (99 = impassable), av = Avoid bonus, df = Def bonus,
   slow = −1 Move next turn for a unit that starts there.
   '_' = Void: no tile at all (cut a corner or edge off a map). Nothing is drawn, nothing can stand, fly or be pushed there. */
const TER={
  '.':{n:'Ashgrass',k:'plain',c:1,av:0,df:0},'f':{n:'Dead Wood',k:'forest',c:2,av:10,df:1},'m':{n:'Rubble',k:'hill',c:3,av:10,df:2},
  'w':{n:'Black Water',k:'water',c:99,av:0,df:0},'=':{n:'Bridge',k:'bridge',c:1,av:0,df:0},
  'R':{n:'Crag',k:'cliff',c:99,av:0,df:0},
  '_':{n:'Void',k:'void',c:99,av:0,df:0,v:1}
};
/* ITEMS AND WEAPONS:
   n = name, t = weapon type (blade/heavy/pole/bow/art/spirit, or item/gear), kind = which icon/sprite shape to draw,
   mt = Might (added to Str or Mag for damage), hit = Hit %, crit = Crit %, r = [min, max] range in tiles, uses = durability (99 = unbreakable),
   wt = weight (set from WT below), el = element of a sigil, mag = uses Mag instead of Str, tint = steel/jade colouring,
   key = icon art key (icons/<key>.png), eff = effective against (×2 damage), amt = HP healed by a staff/salve. */
const IT={
  wornSword:{n:'Worn Sword',t:'blade',kind:'sword',mt:5,hit:90,crit:0,r:[1,1],uses:40},
  twinDaggers:{n:'Twin Daggers',t:'dagger',kind:'twindagger',mt:4,hit:95,crit:5,r:[1,1],uses:40},
  ironSpear:{n:'Iron Spear',t:'pole',kind:'spear',mt:7,hit:85,crit:0,r:[1,1],uses:45},
  steelSpear:{n:'Steel Spear',t:'pole',kind:'spear',mt:10,hit:75,crit:0,r:[1,1],uses:30,tint:'steel'},
  /* Raptor's: twin khopesh (a sword with a bit more crit) and, once he's a Hero, the atlatl (javelin stats). Placeholder art */
  twinKhopesh:{n:'Twin Khopesh',t:'blade',kind:'sword',mt:5,hit:90,crit:10,r:[1,1],uses:40},
  atlatl:{n:'Atlatl',t:'pole',kind:'javelin',mt:7,hit:80,crit:0,r:[1,2],uses:20,thrown:true},
  javelin:{n:'Javelin',t:'pole',kind:'javelin',mt:6,hit:80,crit:0,r:[1,2],uses:20,thrown:true},
  hatchet:{n:'Hatchet',t:'heavy',kind:'axe',mt:8,hit:75,crit:0,r:[1,1],uses:45},
  steelHatchet:{n:'Steel Hatchet',t:'heavy',kind:'axe',mt:11,hit:65,crit:0,r:[1,1],uses:30,tint:'steel'},
  throwingAxe:{n:'Throwing Axe',t:'heavy',kind:'axe',mt:7,hit:60,crit:0,r:[1,2],uses:20,thrown:true},
  shortBow:{n:'Short Bow',t:'bow',kind:'bow',mt:6,hit:85,crit:0,r:[2,3],uses:45},
  fireSigil:{n:'Fire Sigil',t:'art',kind:'talisman',el:'fire',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  frostSigil:{n:'Frost Sigil',t:'art',kind:'talisman',el:'ice',mt:7,hit:85,crit:5,r:[1,2],uses:35,mag:true},
  stormSigil:{n:'Storm Sigil',t:'art',kind:'talisman',el:'lightning',mt:4,hit:95,crit:15,r:[1,2],uses:40,mag:true},
  poisonSpit:{n:'Poison Spit',acid:true,t:'art',kind:'talisman',mt:5,hit:90,crit:0,r:[1,2],uses:99,mag:true,psn:.3,d:'30% chance to poison on a hit.'},/* the Lamia's attack: the frog's acid glob (acid:true), magic, sometimes poisons */
  dawnSigil:{n:'Dawn Sigil',t:'art',kind:'talisman',el:'light',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  umbralSigil:{n:'Umbral Sigil',t:'art',kind:'talisman',el:'dark',mt:5,hit:85,crit:0,r:[1,2],uses:40,mag:true,drain:true},
  runeCrook:{n:'Rune Crook',t:'art',kind:'staff',mt:4,hit:85,crit:0,r:[1,2],uses:40,mag:true},
  mendingStaff:{n:'Mending Staff',t:'spirit',kind:'staff',amt:10,r:[1,2],uses:30},
  greatsword:{n:'Greatsword',t:'blade',kind:'greatsword',mt:11,hit:70,crit:5,r:[1,1],uses:30,tint:'steel'},
  claws:{n:'Claws',t:'blade',kind:'twin',mt:4,hit:85,crit:10,r:[1,1],uses:99},
  salve:{n:'Salve',t:'item',kind:'pill',amt:10,uses:3}
};
/* every item's icon key is its own id (icons/<id>.png): set in one go rather than typed on each item */
for(const k in IT)IT[k].key=k;
/* ---- weapon weight (Wt): weight above the wielder's Str (Mag for sigils) costs that much attack speed ---- */
Object.assign(IT,{
  stiletto:{n:'Stiletto',t:'dagger',kind:'dagger',thin:true,mt:4,hit:90,crit:25,r:[1,1],uses:30,key:'stiletto'},
  qiang:{n:'Qiang',t:'pole',kind:'spear',mt:8,hit:80,crit:30,r:[1,1],uses:20,tint:'killer',key:'qiang'},
  reaverAxe:{n:'Reaver Axe',t:'heavy',kind:'axe',mt:10,hit:65,crit:30,r:[1,1],uses:20,tint:'killer',key:'reaverAxe'},
  hawkeyeBow:{n:'Hawkeye Bow',t:'bow',kind:'bow',mt:7,hit:80,crit:30,r:[2,3],uses:20,tint:'killer',key:'hawkeyeBow'}
});
/* WT: weapon weight. Weight above the wielder's Str (Mag for sigils) is taken off their attack speed (see wtOver/AS). */
const WT={wornSword:4,twinKhopesh:4,atlatl:8,twinDaggers:2,greatsword:12,ironSpear:6,steelSpear:10,javelin:8,hatchet:7,steelHatchet:11,throwingAxe:9,
  shortBow:3,fireSigil:2,frostSigil:4,stormSigil:2,dawnSigil:2,umbralSigil:5,runeCrook:3,
  stiletto:2,qiang:7,reaverAxe:9,hawkeyeBow:5};
/* weights differ per item, so they're a table (the items added further down set wt on themselves instead) */
for(const k in WT)IT[k].wt=WT[k];
/* ---- special weapons from events: jade (killer) weapons, lightning sigils, long-range sigils and charms ---- */
Object.assign(IT,{
  jadeJian:{n:'Jade Jian',t:'blade',kind:'sword',mt:7,hit:80,crit:30,r:[1,1],uses:25,tint:'jade',wt:5},
  jadeFangs:{n:'Jade Fangs',t:'dagger',kind:'dagger',mt:5,hit:90,crit:35,r:[1,1],uses:25,tint:'jade',wt:2},
  longbow:{n:'Longbow',t:'bow',kind:'bow',mt:6,hit:75,crit:0,r:[2,3],uses:30,wt:6},
  /* steel-tier ranged variants (reach 1–2): trade-ups for the javelin, throwing axe and throwing knives */
  tomahawk:{n:'Tomahawk',t:'heavy',kind:'axe',mt:10,hit:65,crit:0,r:[1,2],uses:20,thrown:true,wt:9,tint:'steel'},
  steelKnives:{n:'Steel Knives',t:'dagger',kind:'dagger',mt:5,hit:90,crit:10,r:[1,2],uses:30,thrown:true,wt:2,tint:'steel'},
  galeSword:{n:'Gale Sword',t:'blade',kind:'sword',mt:6,hit:80,crit:0,r:[1,2],uses:25,wt:6,tint:'steel'},
  yewGreatbow:{n:'Yew Greatbow',t:'bow',kind:'bow',mt:9,hit:80,crit:5,r:[2,4],uses:30,wt:8,tint:'steel'},
  throwingKnives:{n:'Throwing Knives',t:'dagger',kind:'dagger',mt:3,hit:90,crit:10,r:[1,2],uses:30,thrown:true,wt:1},
  /* armoury stock (not dropped or given by events) */
  flameSigil:{n:'Flame Sigil',t:'art',kind:'talisman',el:'fire',mt:8,hit:80,crit:5,r:[1,2],uses:30,mag:true,wt:4,key:'fireSigil'},
  blizzardSigil:{n:'Blizzard Sigil',t:'art',kind:'talisman',el:'ice',mt:9,hit:80,crit:5,r:[1,2],uses:30,mag:true,wt:5,key:'frostSigil'},
  thunderSigil:{n:'Thunder Sigil',armoury:true,t:'art',kind:'talisman',el:'lightning',mt:8,hit:80,crit:5,r:[1,2],uses:35,mag:true,wt:5},
  heavensBolt:{n:'Heaven’s Bolt',t:'art',kind:'talisman',el:'lightning',mt:10,hit:65,crit:5,r:[3,10],uses:5,mag:true,wt:8},
  meteorSigil:{n:'Meteor Sigil',t:'art',kind:'talisman',el:'earth',mt:13,hit:60,crit:0,r:[3,10],uses:5,mag:true,wt:9},
  /* slayer weapons: effective (×2 Mt) against one body tag */
  warHammer:{n:'War Hammer',t:'heavy',kind:'hammer',mt:8,hit:70,crit:0,r:[1,1],uses:30,wt:10,eff:['armoured']},
  huntingSpear:{n:'Hunting Spear',t:'pole',kind:'spear',mt:7,hit:85,crit:0,r:[1,1],uses:30,wt:6,eff:['beast']},
  holySword:{n:'Holy Sword',t:'blade',kind:'sword',mt:8,hit:80,crit:5,r:[1,1],uses:25,wt:6,eff:['infernal'],tint:'holy',holy:true},
  giantslayer:{n:'Giantslayer',t:'blade',kind:'greatsword',mt:9,hit:70,crit:0,r:[1,1],uses:25,wt:10,eff:['colossal'],tint:'steel'},
  farStaff:{n:'Far Staff',t:'spirit',kind:'staff',amt:10,r:[1,10],uses:15,tint:'mend'},
  /* two-handed swords (kind greatsword): heavy, hard-hitting blades. Zwei wields only these */
  claymore:{n:'Claymore',t:'blade',kind:'greatsword',mt:9,hit:75,crit:0,r:[1,1],uses:40,wt:10},
  zweihander:{n:'Zweihänder',t:'blade',kind:'greatsword',mt:14,hit:65,crit:5,r:[1,1],uses:30,wt:14,tint:'steel'},
  flamberge:{n:'Flamberge',t:'blade',kind:'greatsword',mt:12,hit:70,crit:20,r:[1,1],uses:25,wt:12,tint:'killer'}
});
/* again, for the items just added */
for(const k in IT)IT[k].key=k;

/* WTYPES: the weapon types (dagger = knives and daggers, for Rogues and Assassins; art = magic weapons: sigils and attack staves;
   spirit = healing staves, which aren't weapons).
   ELN: element names shown on weapons (only the elements a weapon actually has). */
const WTYPES=['blade','dagger','heavy','pole','bow','art'];
const ELN={light:'Light',dark:'Dark',fire:'Fire',ice:'Ice',lightning:'Lightning',earth:'Earth',crystal:'Neutral'};
/* CLASSES, keyed by class id (shared by player classes and monsters):
   n = class name shown in game, w = weapon types it can use, body = body type (tunic/robe/vest/armor/beast/golem...: used by the unit rig, tags and the boss PNG lookup),
   mov = Move, crit = bonus Crit %, promo = class it promotes to, tier = 2 for promoted classes, bonus = stats added on promotion (stat order above),
   fly = flier (ignores terrain), mnt = mounted, wade = ignores water slowdown, phase = walks through walls, lava = can cross magma,
   jump = how high a step it can climb (default 2). */
const CLS={
  /* a plain townsfolk body for NPC figures (the innkeeper, recruit icons) */
  Villager:{n:'Villager',w:['blade'],body:'tunic',mov:5}
};
/* SKILLS: n = name, d = description shown in game. A unit has one personal skill (u.skill) and any number learned during the run (u.skills). */
const SKILLS={
  command:{n:'Command',d:'Allies within 2 tiles gain +10 Hit and +10 Avoid.'},
  steadfast:{n:'Steadfast',d:'+4 Def and Res when attacked during the enemy phase.'},
  keenEye:{n:'Keen Eye',d:'+20 Hit, and the target\'s terrain gives no Avoid.'},
  kindle:{n:'Kindle',d:'+2 Mag when this unit starts the fight.'},
  swiftstrike:{n:'Swiftstrike',d:'+3 Spd for doubling when this unit starts the fight.'},
  wrath:{n:'Wrath',d:'+15 Crit while at half HP or less.'},
  focus:{n:'Focus',d:'+10 Crit when no ally is adjacent.'},
  renewal:{n:'Renewal',d:'Adjacent allies recover 5 HP at the start of each of your turns.'},
  bulwark:{n:'Bulwark',d:'Luck×2% chance: halves damage from an incoming strike.'},
  stoneGaze:{n:'Stone Gaze',d:'Luck% chance on a hit: the target turns to stone, loses its next turn and can\'t counter. Bosses are immune.'}
};
/* more skills */
Object.assign(SKILLS,{
  hitAndRun:{n:'Hit and Run',d:'After attacking in melee, steps back one tile if there is room.'},
  quickDraw:{n:'Quick Draw',d:'When attacked at half HP or less, strikes first.'},
  flurry:{n:'Flurry',d:'Spd% chance of an extra strike in each fight.'},
  whirlwind:{n:'Whirlwind',d:'Luck÷2% chance: one strike becomes five hits at half damage.'},
  retaliate:{n:'Retaliate',d:'Luck% chance, when hit in melee, to deal the same damage back.'},
  ironSkin:{n:'Iron Skin',d:'Luck×2% chance to halve physical damage taken.'},
  spellWard:{n:'Spell Ward',d:'Luck×2% chance to halve magic damage taken.'},
  momentum:{n:'Momentum',d:'Once per turn, defeating an enemy on your turn lets this unit act again.'},
  fleetFoot:{n:'Fleet Foot',d:'+2 Move.'},
  taunt:{n:'Taunt',d:'Enemies would rather attack this unit.'},
  quickStudy:{n:'Quick Study',d:'Gains double EXP.'},
  earlyEdge:{n:'Early Edge',d:'+20 Hit and Avoid on turns 1 to 5.'},
  wolfsbane:{n:'Wolfsbane',d:'Effective (×2) against Beasts.'},
  fiendbane:{n:'Fiendbane',d:'Effective (×2) against Infernal foes.'},
  stonebane:{n:'Stonebane',d:'Effective (×2) against Armoured foes.'},
  guardian:{n:'Guardian',d:'Adjacent allies take 2 less damage.'}
});
/* PROMO_LV: level a unit can promote at */
const PROMO_LV=5;
/* ENEMY STATS, keyed by class id (must also exist in CLS):
   b = base stats at level 1, g = growth per level (a fixed amount, not a % chance), both in stat order [HP, Str, Mag, Skl, Spd, Lck, Def, Res].
   A foe's stat = b + floor(g × (level − 1)), see foe() in 02-state-rng.js.
   items = weapons/attacks it carries (keys in IT), pic = portrait art key, look = optional flags (spirit: the summon glow).
   Monster art is all PNG now (art/monsters, art/bosses). */
const FOE={};

/* BATTLE: the current battle (made by genBattle) */
let BATTLE=null;


/* armoury stock: upgrades only (nothing a unit starts with) */
for(const k of ['stiletto', 'jadeJian', 'jadeFangs', 'claymore', 'flamberge', 'galeSword', 'steelKnives', 'throwingKnives', 'holySword', 'giantslayer', 'steelSpear', 'qiang', 'huntingSpear', 'javelin', 'steelHatchet', 'reaverAxe', 'warHammer', 'throwingAxe', 'tomahawk', 'hawkeyeBow', 'yewGreatbow', 'thunderSigil', 'farStaff', 'zweihander', 'flameSigil', 'blizzardSigil'])if(IT[k])IT[k].armoury=true;
