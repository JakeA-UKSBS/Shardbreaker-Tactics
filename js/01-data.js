/* Items, weapons, classes, skills: the static game data */
/* ================= DATA ================= */
const PICS={};

const ST=['hp','str','mag','skl','spd','lck','def','res'];
const SL={hp:'HP',str:'Str',mag:'Mag',skl:'Skl',spd:'Spd',lck:'Luck',def:'Def',res:'Res'};
/* the stats a unit shows and levels: HP, Str or Mag (by class), Luck, Spd, Def, Res. Skl is folded into Luck. */
const usesMag=u=>CLS[u.cls].w.every(t=>t==='art'||t==='spirit');
const shown=u=>['hp',usesMag(u)?'mag':'str','lck','spd','def','res'];
const foldLuck=u=>{u.lck=Math.max(u.lck||0,u.skl||0);return u};
/* attack speed (FE9): weight above your Str (Mag for sigils) slows doubling and dodging */
const wtOver=(u,w)=>Math.max(0,(w&&w.wt||0)-(w&&w.mag?u.mag:u.str));
const AS=(u,w)=>Math.max(0,u.spd+gearOf(u).spd-wtOver(u,w));
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
const T=48;
const TER={
  '.':{n:'Ashgrass',k:'plain',c:1,av:0,df:0},'f':{n:'Dead Wood',k:'forest',c:2,av:20,df:1},'m':{n:'Rubble',k:'hill',c:3,av:30,df:2},
  'w':{n:'Black Water',k:'water',c:99,av:0,df:0},'=':{n:'Bridge',k:'bridge',c:1,av:0,df:0},'F':{n:'Ruined Shrine',k:'fort',c:1,av:20,df:2,heal:true},'C':{n:'Cache',k:'chest',c:1,av:0,df:0},
  '_':{n:'Flagstones',k:'floor',c:1,av:0,df:0},'#':{n:'Wall',k:'wall',c:99,av:0,df:0},'T':{n:'Altar',k:'throne',c:1,av:30,df:3,heal:true},
  'V':{n:'Ruined House',k:'village',c:1,av:10,df:0},
  '~':{n:'Open Sky',k:'sky',c:99,av:0,df:0},'d':{n:'Deck',k:'deck',c:1,av:0,df:0},'M':{n:'Mast',k:'mast',c:99,av:0,df:0},'h':{n:'Hull',k:'hull',c:99,av:0,df:0},
  'H':{n:'Helm',k:'helm',c:1,av:10,df:1},'X':{n:'Exit',k:'exit',c:1,av:0,df:0},'A':{n:'Tent',k:'tent',c:1,av:10,df:1,heal:true},'r':{n:'Carpet',k:'carpet',c:1,av:0,df:0},
  'L':{n:'Light Font',k:'light',c:1,av:10,df:1,heal:true},'R':{n:'Crag',k:'cliff',c:99,av:0,df:0}
};
/* Weapon types: blade > heavy > pole > blade. bow and reach are neutral.
   Arts (t:'art'): fire > nature > water > fire, and light > dark. Dark is neutral to the rest but drains life (heals 25% of damage dealt). */
const IT={
  ironJian:{n:'Worn Sword',t:'blade',kind:'sword',mt:5,hit:90,crit:0,r:[1,1],uses:40},
  twinBlades:{n:'Twin Daggers',t:'blade',kind:'twindagger',mt:4,hit:95,crit:5,r:[1,1],uses:40},
  steelJian:{n:'Knightly Sword',t:'blade',kind:'sword',mt:8,hit:75,crit:0,r:[1,1],uses:30,tint:'steel'},
  needle:{n:'Thorn Rapier',t:'blade',kind:'rapier',mt:5,hit:100,crit:10,r:[1,1],uses:30},
  ironDao:{n:'Hooked Blade',t:'blade',kind:'scimitar',mt:7,hit:80,crit:5,r:[1,1],uses:35},
  moonDao:{n:'Moonglass Edge',t:'blade',kind:'scimitar',mt:7,hit:80,crit:30,r:[1,1],uses:20,tint:'killer'},
  ironSpear:{n:'Iron Spear',t:'pole',kind:'spear',mt:7,hit:80,crit:0,r:[1,1],uses:45},
  steelSpear:{n:'Steel Spear',t:'pole',kind:'spear',mt:10,hit:70,crit:0,r:[1,1],uses:30,tint:'steel'},
  javelin:{n:'Javelin',t:'pole',kind:'javelin',mt:6,hit:65,crit:0,r:[1,2],uses:20,thrown:true},
  ironAxe:{n:'Hatchet',t:'heavy',kind:'axe',mt:8,hit:75,crit:0,r:[1,1],uses:45},
  steelAxe:{n:'Cleaver',t:'heavy',kind:'axe',mt:11,hit:65,crit:0,r:[1,1],uses:30,tint:'steel'},
  throwAxe:{n:'Throwing Axe',t:'heavy',kind:'axe',mt:7,hit:60,crit:0,r:[1,2],uses:20,thrown:true},
  ironJi:{n:'Halberd',t:'heavy',kind:'halberd',mt:9,hit:70,crit:0,r:[1,1],uses:40},
  shortBow:{n:'Short Bow',t:'bow',kind:'bow',mt:6,hit:85,crit:0,r:[2,2],uses:45},
  steelBow:{n:'Ironwood Bow',t:'bow',kind:'bow',mt:9,hit:70,crit:0,r:[2,2],uses:30,tint:'steel'},
  crossbow:{n:'Crossbow',t:'bow',kind:'crossbow',mt:8,hit:80,crit:0,r:[2,2],uses:35},
  whip:{n:'Thorn Whip',t:'reach',kind:'whip',mt:4,hit:85,crit:0,r:[1,2],uses:40},
  chainBlade:{n:'Chain Sickle',t:'reach',kind:'chain',mt:6,hit:75,crit:0,r:[1,2],uses:35},
  ironFan:{n:'War Fan',t:'reach',kind:'fan',mt:5,hit:85,crit:5,r:[1,2],uses:40},
  parasol:{n:'Bone Parasol',t:'reach',kind:'umbrella',mt:6,hit:80,crit:0,r:[1,2],uses:35},
  flameT:{n:'Ember Sigil',t:'art',kind:'talisman',el:'fire',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  tideT:{n:'Tide Sigil',t:'art',kind:'talisman',el:'water',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  galeT:{n:'Gale Sigil',t:'art',kind:'talisman',el:'wind',mt:4,hit:95,crit:5,r:[1,2],uses:40,mag:true},
  stoneT:{n:'Stone Sigil',t:'art',kind:'talisman',el:'earth',mt:7,hit:75,crit:0,r:[1,2],uses:35,mag:true},
  thunderT:{n:'Storm Sigil',t:'art',kind:'talisman',el:'lightning',mt:8,hit:80,crit:5,r:[1,2],uses:35,mag:true},
  mirageT:{n:'Mirror Sigil',t:'art',kind:'talisman',el:'illusion',mt:6,hit:85,crit:0,r:[1,2],uses:40,mag:true},
  natureT:{n:'Thorn Sigil',t:'art',kind:'talisman',el:'nature',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  lightT:{n:'Dawn Sigil',t:'art',kind:'talisman',el:'light',mt:5,hit:90,crit:0,r:[1,2],uses:40,mag:true},
  darkT:{n:'Umbral Sigil',t:'art',kind:'talisman',el:'dark',mt:5,hit:85,crit:0,r:[1,2],uses:40,mag:true,drain:true},
  crookStaff:{n:'Crook Staff',t:'art',kind:'staff',mt:6,hit:85,crit:0,r:[1,1],uses:45,mag:true},
  runeStaff:{n:'Rune Staff',t:'art',kind:'staff',mt:4,hit:85,crit:0,r:[1,2],uses:40,mag:true},
  glimmer:{n:'Glimmer',t:'art',kind:'talisman',el:'light',mt:2,hit:85,crit:0,r:[1,2],uses:45,mag:true},
  spiritMend:{n:'Mending Charm',t:'spirit',kind:'spirit',amt:10,r:[1,1],uses:30},
  greaterMend:{n:'Dawn Charm',t:'spirit',kind:'spirit',amt:20,r:[1,1],uses:20,tint:'mend'},
  greatsword:{n:'Greatsword',t:'blade',kind:'greatsword',mt:11,hit:70,crit:5,r:[1,1],uses:30,tint:'steel'},
  claws:{n:'Claws',t:'blade',kind:'twin',mt:4,hit:85,crit:10,r:[1,1],uses:99},
  labrys:{n:'Labrys',t:'heavy',kind:'axe',mt:12,hit:75,crit:10,r:[1,1],uses:30,tint:'steel'},
  qiPill:{n:'Salve',t:'item',kind:'pill',amt:10,uses:3}
};
for(const k in IT)IT[k].key=k;
/* ---- weapon weight (Wt): weight above the wielder's Str (Mag for sigils) costs that much attack speed ---- */
Object.assign(IT,{
  dirk:{n:'Dirk',t:'blade',kind:'dagger',mt:3,hit:95,crit:15,r:[1,1],uses:45,key:'dirk'},
  stiletto:{n:'Stiletto',t:'blade',kind:'dagger',thin:true,mt:4,hit:90,crit:25,r:[1,1],uses:30,key:'stiletto'},
  lancebreaker:{n:'Spellbreaker',t:'blade',kind:'sword',mt:6,hit:80,crit:0,r:[1,1],uses:35,brk:'art',key:'lancebreaker'},
  axebreaker:{n:'Axebreaker',t:'pole',kind:'spear',mt:7,hit:80,crit:0,r:[1,1],uses:35,brk:'heavy',key:'axebreaker'},
  swordbreaker:{n:'Swordbreaker',t:'heavy',kind:'axe',mt:8,hit:75,crit:0,r:[1,1],uses:35,brk:'blade',key:'swordbreaker'},
  barbedSpear:{n:'Barbed Spear',t:'pole',kind:'spear',mt:8,hit:75,crit:30,r:[1,1],uses:20,tint:'killer',key:'barbedSpear'},
  reaverAxe:{n:'Reaver Axe',t:'heavy',kind:'axe',mt:10,hit:65,crit:30,r:[1,1],uses:20,tint:'killer',key:'reaverAxe'},
  hawkeyeBow:{n:'Hawkeye Bow',t:'bow',kind:'bow',mt:7,hit:80,crit:30,r:[2,2],uses:20,tint:'killer',key:'hawkeyeBow'}
});
const WT={ironJian:4,twinBlades:2,steelJian:8,needle:3,ironDao:6,moonDao:6,greatsword:12,ironSpear:6,steelSpear:10,javelin:8,ironAxe:7,steelAxe:11,throwAxe:9,ironJi:9,labrys:13,
  shortBow:3,steelBow:7,crossbow:6,whip:3,chainBlade:5,ironFan:3,parasol:5,flameT:2,tideT:3,galeT:2,stoneT:6,thunderT:5,mirageT:3,natureT:3,lightT:2,darkT:5,crookStaff:4,runeStaff:3,glimmer:1,
  dirk:1,stiletto:2,lancebreaker:6,axebreaker:7,swordbreaker:8,barbedSpear:7,reaverAxe:9,hawkeyeBow:5};
for(const k in WT)IT[k].wt=WT[k];
/* ---- special weapons from events: jade (killer) weapons, lightning sigils, long-range sigils and charms ---- */
Object.assign(IT,{
  jadeJian:{n:'Jade Jian',t:'blade',kind:'sword',mt:7,hit:80,crit:30,r:[1,1],uses:25,tint:'jade',wt:5},
  jadeFang:{n:'Jade Fang',t:'blade',kind:'dagger',mt:5,hit:90,crit:35,r:[1,1],uses:25,tint:'jade',wt:2},
  jadeSpear:{n:'Jade Spear',t:'pole',kind:'spear',mt:9,hit:75,crit:30,r:[1,1],uses:25,tint:'jade',wt:8},
  jadeAxe:{n:'Jade Axe',t:'heavy',kind:'axe',mt:11,hit:65,crit:30,r:[1,1],uses:25,tint:'jade',wt:10},
  jadeBow:{n:'Jade Bow',t:'bow',kind:'bow',mt:8,hit:75,crit:30,r:[2,2],uses:25,tint:'jade',wt:5},
  longbow:{n:'Longbow',t:'bow',kind:'bow',mt:6,hit:70,crit:0,r:[2,3],uses:30,wt:6},
  throwKnives:{n:'Throwing Knives',t:'blade',kind:'dagger',mt:3,hit:90,crit:10,r:[1,2],uses:30,thrown:true,wt:1},
  sparkT:{n:'Spark Sigil',t:'art',kind:'talisman',el:'lightning',mt:4,hit:95,crit:15,r:[1,2],uses:40,mag:true,wt:2},
  thunderhead:{n:'Thunderhead Sigil',t:'art',kind:'talisman',el:'lightning',mt:8,hit:75,crit:30,r:[1,2],uses:25,mag:true,wt:6},
  boltT:{n:'Heaven’s Bolt',t:'art',kind:'talisman',el:'lightning',mt:10,hit:65,crit:5,r:[3,10],uses:5,mag:true,wt:8},
  meteorT:{n:'Meteor Sigil',t:'art',kind:'talisman',el:'earth',mt:13,hit:60,crit:0,r:[3,10],uses:5,mag:true,wt:9},
  /* slayer weapons: effective (×2 Mt) against one body tag */
  warHammer:{n:'War Hammer',t:'heavy',kind:'hammer',mt:8,hit:70,crit:0,r:[1,1],uses:30,wt:10,eff:['armoured']},
  huntSpear:{n:'Hunting Spear',t:'pole',kind:'spear',mt:7,hit:80,crit:0,r:[1,1],uses:30,wt:6,eff:['beast']},
  holySword:{n:'Holy Sword',t:'blade',kind:'sword',mt:8,hit:80,crit:5,r:[1,1],uses:25,wt:6,eff:['spectral'],tint:'holy'},
  giantslayer:{n:'Giantslayer',t:'blade',kind:'greatsword',mt:9,hit:70,crit:0,r:[1,1],uses:25,wt:10,eff:['colossal'],tint:'steel'},
  farMend:{n:'Far Charm',t:'spirit',kind:'spirit',amt:10,r:[1,10],uses:15,tint:'mend'}
});
for(const k in IT)IT[k].key=k;

const WTYPES=['blade','heavy','pole','bow','reach','art'];
const TRI={blade:'heavy',heavy:'pole',pole:'blade'};
const ELE={fire:'nature',nature:'water',water:'fire'};
const ELN={light:'Light',dark:'Dark',fire:'Fire',nature:'Nature',water:'Water',wind:'Wind',earth:'Earth',lightning:'Lightning',illusion:'Illusion'};
const CLS={
  Heir:{n:'Initiate',w:['blade'],body:'tunic',mov:5,crit:10,promo:'Vanguard'},SpearGuard:{n:'Warden',w:['pole'],body:'armor',mov:5,promo:'Bastion'},Halberdier:{n:'Breaker',w:['heavy'],body:'vest',mov:5,promo:'Ravager'},
  Archer:{n:'Hunter',w:['bow'],body:'tunic',mov:5,promo:'Deadshot'},Adept:{n:'Sigilist',w:['art'],body:'robe',mov:5,promo:'Runelord'},Healer:{n:'Mender',w:['spirit','art'],body:'robe',mov:5,promo:'Lightbearer'},
  Lamia:{n:'Lamia',w:['pole'],body:'serpent',mov:5,promo:'Gorgon'},
  LamiaE:{n:'Lamia',w:['pole'],body:'serpent',mov:5},
  Merc:{n:'Sellsword',w:['blade'],body:'tunic',mov:5,crit:5,promo:'Warblade'},
  /* Ascended classes. bonus = stat gains on class change (HP Str Mag Skl Spd Lck Def Res). */
  Vanguard:{n:'Vanguard',w:['blade','pole'],body:'tunic',mov:6,crit:10,tier:2,bonus:[4,2,1,2,2,0,2,2]},
  Bastion:{n:'Bastion',w:['pole','blade'],body:'armor',mov:5,tier:2,bonus:[6,2,0,1,1,0,4,2]},
  Ravager:{n:'Ravager',w:['heavy','blade'],body:'vest',mov:5,crit:10,tier:2,bonus:[6,3,0,1,2,0,2,1]},
  Deadshot:{n:'Deadshot',w:['bow','blade'],body:'tunic',mov:6,crit:5,tier:2,bonus:[3,2,0,3,2,0,1,2]},
  Runelord:{n:'Runelord',w:['art','spirit'],body:'robe',mov:5,tier:2,bonus:[3,0,3,2,1,0,1,3]},
  Gremlin:{n:'Gremlin',w:['blade'],body:'gremlin',mov:6,crit:10},
  Gloomwing:{n:'Gloomwing',w:['blade'],body:'robe',mov:7,fly:true},
  StormHarpy:{n:'Storm Harpy',w:['art'],body:'robe',mov:6,fly:true},
  Minotaur:{n:'Minotaur',w:['heavy'],body:'vest',mov:4,crit:10},
  MireBeast:{n:'Nightmare',w:['blade'],body:'gremlin',mov:4,crit:5},
  Mindsnail:{n:'Mindsnail',w:['art'],body:'snail',mov:3},
  Skywright:{n:'Skywright',w:['art','heavy'],body:'robe',mov:6,tier:2},
  Warblade:{n:'Warblade',w:['blade','heavy'],body:'tunic',mov:6,crit:10,tier:2,gift:'greatsword',bonus:[4,3,0,2,2,0,2,1]},
  Gorgon:{n:'Gorgon',w:['pole','art'],body:'serpent',mov:6,tier:2,bonus:[4,1,3,2,1,0,2,3]},
  Lightbearer:{n:'Lightbearer',w:['spirit','art'],body:'robe',mov:5,tier:2,bonus:[4,0,2,1,2,0,1,3]},
  Bandit:{n:'Fallen Brute',w:['heavy'],body:'vest',mov:5},SectGuard:{n:'Fallen Sentinel',w:['pole'],body:'armor',mov:5},Crossbowman:{n:'Fallen Archer',w:['bow'],body:'tunic',mov:5},
  HexAdept:{n:'Storm Husk',w:['art'],body:'robe',mov:5},TideAdept:{n:'Drowned Husk',w:['art'],body:'robe',mov:5},GaleAdept:{n:'Gale Husk',w:['art'],body:'robe',mov:5},
  Swordsman:{n:'Fallen Duelist',w:['blade'],body:'tunic',mov:5,crit:5},IronGuard:{n:'Iron Husk',w:['pole'],body:'armor',mov:4},
  FanDancer:{n:'Veil Dancer',w:['reach'],body:'robe',mov:5},ChainReaper:{n:'Chain Reaper',w:['reach'],body:'tunic',mov:5},Assassin:{n:'Pale Stalker',w:['reach'],body:'robe',mov:5},
  Warlord:{n:'Nightmare',w:['heavy','pole'],body:'armor',mov:4},Butcher:{n:'Butcher',w:['blade','heavy'],body:'vest',mov:5,crit:5},Matron:{n:'Demon Matron',w:['art'],body:'robe',mov:5}
};
const SKILLS={
  rally:{n:'Command',cost:10,d:'Allies within 2 tiles gain +10 Hit and +10 Avoid.'},
  brace:{n:'Steadfast',cost:5,d:'+4 Def and Res when attacked during the enemy phase.'},
  deadeye:{n:'Keen Eye',cost:5,d:'+20 Hit, and the target\'s terrain gives no Avoid.'},
  kindle:{n:'Kindle',cost:5,d:'+2 Mag when this unit starts the fight.'},
  swift:{n:'Swiftstrike',cost:5,d:'+3 Spd for doubling when this unit starts the fight.'},
  fury:{n:'Wrath',cost:10,d:'+15 Crit while at half HP or less.'},
  focus:{n:'Focus',cost:10,d:'+10 Crit when no ally is adjacent.'},
  renewal:{n:'Renewal',cost:10,d:'Adjacent allies recover 5 HP at the start of each of your turns.'},
  sunder:{n:'Pierce',cost:15,d:'Luck×1.5% chance: the strike ignores half the target\'s Def.'},
  shieldwall:{n:'Bulwark',cost:15,d:'Luck×2% chance: halves damage from an incoming strike.'},
  stone:{n:'Stone Gaze',cost:20,d:'Luck% chance on a hit: the target turns to stone, loses its next turn and can\'t counter. Bosses are immune.'},
  siphon:{n:'Lifetaker',cost:20,d:'Luck×2% chance: restores HP equal to the damage dealt.'}
};
/* Skill scrolls (one per skill except Command) and the class-change item. */
Object.assign(SKILLS,{
  hitrun:{n:'Hit and Run',cost:10,d:'After attacking in melee, steps back one tile if there is room.'},
  quickdraw:{n:'Quick Draw',cost:15,d:'When attacked at half HP or less, strikes first.'},
  flurry:{n:'Flurry',cost:15,d:'Spd% chance of an extra strike in each fight.'},
  whirlwind:{n:'Whirlwind',cost:20,d:'Luck÷2% chance: one strike becomes five hits at half damage.'},
  retaliate:{n:'Retaliate',cost:15,d:'Luck% chance, when hit in melee, to deal the same damage back.'},
  ironskin:{n:'Iron Skin',cost:10,d:'Luck×2% chance to halve physical damage taken.'},
  spellward:{n:'Spell Ward',cost:10,d:'Luck×2% chance to halve magic damage taken.'},
  momentum:{n:'Momentum',cost:20,d:'Once per turn, defeating an enemy on your turn lets this unit act again.'},
  fleetfoot:{n:'Fleet Foot',cost:10,d:'+2 Move.'},
  taunt:{n:'Taunt',cost:5,d:'Enemies would rather attack this unit.'},
  quickstudy:{n:'Quick Study',cost:10,d:'Gains double EXP.'},
  earlyedge:{n:'Early Edge',cost:10,d:'+20 Hit and Avoid on turns 1 to 5.'},
  bladebane:{n:'Wolfsbane',cost:10,d:'Effective (×2) against Beasts.'},
  polebane:{n:'Spiritbane',cost:10,d:'Effective (×2) against Spectral foes.'},
  heavybane:{n:'Stonebane',cost:10,d:'Effective (×2) against Armoured foes.'},
  guardian:{n:'Guardian',cost:10,d:'Adjacent allies take 2 less damage.'},
  pikewall:{n:'Pike Wall',cost:5,d:'+4 Def and +10 Hit against mounted units and fliers.'}
});
for(const k in SKILLS)if(k!=='rally')IT['scroll_'+k]={n:SKILLS[k].n+' Scroll',t:'scroll',kind:'scroll',skill:k,uses:1,key:'scroll_'+k};
IT.crest={n:'Ascension Fragment',t:'crest',kind:'crest',uses:1,key:'crest'};
const BASE_CAP=20,PROMO_CAP=5,PROMO_LV=5;
const START_PARTY=['lord','maren','dax','oti','silas','kestrel'];
const heroDef=id=>HEROES.find(h=>h.id===id);
function lordName(){return'Your squad'}
const FOE={
  LamiaE:{b:[19,5,0,4,4,0,4,2],g:[.7,.4,0,.35,.3,.05,.2,.15],items:['ironSpear'],pic:'javelin',look:{style:'long',tail:'#55635c'}},
  Bandit:{b:[20,5,0,1,3,0,2,0],g:[.8,.45,0,.2,.25,.05,.15,.05],items:['ironAxe'],pic:'earth',look:{style:'bald',gear:'headband',beard:true}},
  SectGuard:{b:[18,4,0,3,2,0,4,0],g:[.75,.35,0,.3,.25,.05,.25,.05],items:['ironSpear'],pic:'javelin',look:{style:'topknot',gear:'helm'}},
  Crossbowman:{b:[17,4,0,4,3,1,3,1],g:[.7,.35,0,.35,.3,.1,.15,.1],items:['crossbow'],pic:'crossbow',look:{style:'topknot',gear:'hood'}},
  HexAdept:{b:[16,0,4,3,3,0,1,4],g:[.6,0,.4,.35,.3,.1,.1,.3],items:['thunderT'],pic:'lightning',look:{style:'long',gear:'veil'}},
  TideAdept:{b:[16,0,4,3,3,0,1,4],g:[.6,0,.4,.35,.3,.1,.1,.3],items:['tideT'],pic:'water',look:{style:'bun',gear:'hairpin'}},
  GaleAdept:{b:[16,0,4,4,4,0,1,4],g:[.6,0,.4,.35,.35,.1,.1,.3],items:['galeT'],pic:'wind',look:{style:'tail',gear:'ribbon'}},
  Swordsman:{b:[19,4,0,6,6,1,3,1],g:[.75,.35,0,.4,.4,.1,.2,.1],items:['ironDao'],pic:'rapier',look:{style:'tail'}},
  IronGuard:{b:[22,6,0,3,1,0,9,0],g:[.8,.4,0,.3,.1,.05,.35,.05],items:['ironSpear'],pic:'javelin',look:{style:'topknot',gear:'helm'}},
  FanDancer:{b:[18,4,0,6,6,2,2,3],g:[.7,.35,0,.4,.4,.15,.1,.2],items:['ironFan'],pic:'fan',look:{style:'bun',gear:'ribbon'}},
  ChainReaper:{b:[19,5,0,4,5,0,3,1],g:[.75,.4,0,.3,.3,.05,.2,.1],items:['chainBlade'],pic:'chain',look:{style:'wild'}},
  Assassin:{b:[18,5,0,6,6,2,2,2],g:[.7,.4,0,.4,.4,.15,.15,.15],items:['parasol'],pic:'umbrella',look:{style:'long',gear:'ribbon'}}
};
for(const k in FOE)Object.assign(FOE[k].look,{skin:'#b9c2cc',eye:'#7fe3ff',hair:'#d9dde3'});
/* Nightmare creatures (not Fallen, so not pale). Fliers are weak to bows. */
FOE.Gremlin={b:[14,4,0,5,8,2,1,1],g:[.5,.3,0,.4,.5,.2,.1,.1],items:['claws'],pic:'twin',look:{skin:'#5f6e52',crysSmall:true}};
FOE.Gloomwing={b:[18,6,0,5,7,1,2,3],g:[.6,.4,0,.35,.45,.1,.1,.2],items:['claws'],pic:'twin',look:{style:'wild',hair:'#2a2236',skin:'#8f8aa6',eye:'#ffd23f',cloth:'#3b3050',wing:'#3b3050'}};
FOE.Mindsnail={b:[24,0,7,5,2,2,8,7],g:[.6,0,.4,.3,.1,.1,.3,.3],items:['mirageT'],pic:'illusion',look:{skin:'#a8b59a',shell:'#b98fbf',eye:'#c77dff'}};
FOE.StormHarpy={b:[17,0,6,5,6,1,1,5],g:[.55,0,.4,.35,.4,.1,.1,.3],items:['thunderT'],pic:'lightning',look:{style:'long',hair:'#c8d0e0',skin:'#a9a3c0',eye:'#9fd8ff',cloth:'#4a5a7a',wing:'#55607a'}};
const HAIRS=['#1d1a24','#2a2230','#3a2a20','#241c1c','#4a3a30'];

/* Battles are generated per run (see RUN below). CH holds the current battle only. */
const CH=[];
const STORY={};

