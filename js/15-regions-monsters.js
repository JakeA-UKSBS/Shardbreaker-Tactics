/* Region terrain tiles, region monsters and the BIOMES table */
/* ================= REGIONS =================
   Each act takes place in one region (picked from the run's seed). A region sets its maps, monster pool, boss,
   terrain rule and music. Map letters for region terrain: s ankle-deep water (−1 Move next turn) · n sand · v mangrove roots · y cursed thicket · b basalt · l magma. */
/* fields: see the TERRAIN key in 01-data.js */
Object.assign(TER,{
  's':{n:'Ankle-deep Water',k:'shallow',c:1,av:0,df:0,slow:true},'n':{n:'Sand',k:'sand',c:1,av:0,df:0},'v':{n:'Mangrove Roots',k:'mangrove',c:2,av:20,df:1,slow:true},
  'y':{n:'Cursed Thicket',k:'curse',c:2,av:25,df:1},'b':{n:'Basalt',k:'basalt',c:1,av:0,df:0},'l':{n:'Magma',k:'lava',c:99,av:0,df:0}
});
function bioTile_draw(k,part){
  const p=Px(16,16),o=Px(16,16),dots=(c,pts)=>pts.forEach(([x,y])=>p.set(x,y,c)),S=[[2,3],[9,2],[13,6],[4,12],[11,13],[7,8],[14,11]];
  if(k==='shallow'||k==='mangrove'){p.rect(0,0,16,16,'#3f5a4a');[[1,3],[8,6],[3,11],[11,12]].forEach(([x,y])=>p.line(x,y,x+3,y,'#5f7f6a'));p.set(13,3,'#7a9a6a');p.line(6,14,6,11,'#6a8a4a')}
  if(k==='mangrove'){o.line(2,15,5,8,'#5a3a24',2);o.line(13,15,10,8,'#5a3a24',2);o.line(7,15,7,8,'#4a2e1c',2);o.ell(8,5,7,4.5,'#2f5a32');o.ell(5,4,3,2,'#3f7a42');o.ell(11,5,3,2,'#3f7a42')}
  if(k==='sand'){p.rect(0,0,16,16,'#b8a070');dots('#a08858',S);dots('#d0bc8c',[[3,2],[10,1],[14,5],[5,11],[12,12]])}
  if(k==='curse'){p.rect(0,0,16,16,'#3e4436');o.line(1,14,6,3,'#3a2a3a',2);o.line(14,14,9,2,'#3a2a3a',2);o.line(4,9,12,5,'#4a2e4a');o.line(3,6,13,11,'#4a2e4a');o.set(6,3,'#c77dff');o.set(9,2,'#c77dff');o.set(12,5,'#8a3a6a')}
  if(k==='basalt'){p.rect(0,0,16,16,'#3a3034');p.line(2,4,6,7,'#2a2226');p.line(6,7,5,12,'#2a2226');p.line(10,2,13,9,'#2a2226');p.set(6,8,'#ff7a2a');p.set(12,6,'#c84a1a')}
  if(k==='lava'){p.rect(0,0,16,16,'#c8401a');p.ell(5,5,3,2,'#ff9a2e');p.ell(11,11,3.5,2.5,'#ff9a2e');p.ell(5,5,1.2,.8,'#ffe14a');p.ell(11,11,1.5,1,'#ffe14a');p.line(0,9,7,9,'#7a2010');p.line(9,2,15,4,'#7a2010')}
  /* part 'g': the ground alone; 'f': the feature alone (a standing prop, see 16b-terrain3d.js) */
  o.outline('#1a1414');if(part==='f')return o.url();if(part!=='g')for(let i=0;i<256;i++)if(o.g[i])p.g[i]=o.g[i];
  return p.url();
}
texStyle.textContent+=['shallow','mangrove','sand','curse','basalt','lava'].map(k=>`.t-${k}{background:url(${bioTile(k)}) 0 0/100% 100%}`).join('');

/* ---- monsters ---- */
IT.slam={n:'Slam',t:'heavy',kind:'claw',mt:7,hit:75,crit:0,r:[1,1],uses:99,key:'slam'};
IT.bite={n:'Bite',t:'heavy',kind:'claw',mt:9,hit:75,crit:10,r:[1,1],uses:99,key:'bite'};
IT.antlers={n:'Antlers',t:'pole',kind:'claw',mt:6,hit:85,crit:5,r:[1,1],uses:99,key:'antlers'};
IT.mallet={n:'Mallet',t:'heavy',kind:'claw',mt:6,hit:85,crit:0,r:[1,1],uses:99,key:'mallet'};
IT.hooves={n:'Hooves',t:'blade',kind:'claw',mt:5,hit:90,crit:0,r:[1,1],uses:99,key:'hooves'};
/* the Crystal Heart's attack: crystals grow on the target and shatter. Long range, but it can't strike next to itself */
IT.shatter={n:'Shatter',t:'art',kind:'talisman',el:'crystal',mt:6,hit:85,crit:0,r:[2,6],uses:99,mag:true,key:'shatter'};
IT.magmaBreath={n:'Magma Breath',t:'art',kind:'talisman',el:'fire',mt:9,hit:80,crit:0,r:[1,2],uses:99,mag:true,key:'magmaBreath'};
SKILLS.venom={n:'Venom',cost:15,d:'On a hit, poisons the target: it loses 2 HP at the start of each of its turns for 3 turns (never below 1 HP).'};
/* fields: see the CLASSES key in 01-data.js */
Object.assign(CLS,{
  MudMonster:{n:'Mud Monster',w:['heavy'],body:'mud',mov:4,wade:true},Krondis:{n:'Alligator',w:['heavy'],body:'gator',mov:4,wade:true},
  CursedStag:{n:'Cursed Stag',w:['pole'],body:'beast',mov:6},
  BoulderGolem:{n:'Magma Golem',w:['heavy'],body:'golem',mov:4},FireSprite:{n:'Fire Sprite',w:['art'],body:'flame',mov:5,lava:true},MagmaDragon:{n:'Magma Dragon',w:['art','heavy'],body:'dragon',mov:0,lava:true},
  CrystalHeart:{n:'Crystal Heart',w:['art'],body:'crystal',mov:0},
  /* the Heart's own creatures (Act 3) */
  Shardling:{n:'Shardling',w:['blade'],body:'shardling',mov:5},Prism:{n:'Prism',w:['art'],body:'prism',mov:4,fly:true},CrystalSentinel:{n:'Crystal Sentinel',w:['heavy'],body:'sentinel',mov:3},
  BogLurker:{n:'Bog Lurker',w:['blade'],body:'gator',mov:4,wade:true},BlightedTreant:{n:'Blighted Treant',w:['heavy'],body:'golem',mov:3}
});
CLS.Lamia.wade=true;
/* fields: see the ENEMY STATS key in 01-data.js (b/g order: HP, Str, Mag, Skl, Spd, Lck, Def, Res) */
Object.assign(FOE,{
  MudMonster:{b:[26,6,0,2,1,0,6,0],g:[.9,.4,0,.2,.1,0,.3,0],items:['slam'],look:{}},
  CursedStag:{b:[17,6,0,5,8,2,2,2],g:[.6,.4,0,.35,.45,.15,.1,.15],items:['antlers'],look:{}},
  BoulderGolem:{b:[24,7,0,2,1,0,10,0],g:[.8,.4,0,.2,.05,0,.4,0],items:['slam'],look:{}},
  FireSprite:{b:[14,0,5,5,7,2,1,4],g:[.5,0,.4,.35,.45,.15,.05,.3],items:['emberSigil'],look:{}},
  Shardling:{b:[16,6,0,5,8,0,3,1],g:[.55,.4,0,.35,.4,0,.2,.1],items:['claws'],look:{}},
  Prism:{b:[15,0,6,5,4,0,2,6],g:[.5,0,.4,.3,.25,0,.1,.35],items:['crystalShards'],look:{}},
  CrystalSentinel:{b:[24,7,0,3,2,0,9,2],g:[.8,.4,0,.25,.1,0,.4,.1],items:['slam'],look:{}},
  BogLurker:{b:[18,6,0,4,5,1,4,0],g:[.65,.4,0,.3,.3,.1,.2,.05],items:['fangs'],look:{}},
  BlightedTreant:{b:[24,6,0,3,1,0,6,3],g:[.8,.4,0,.25,.1,0,.3,.15],items:['slam'],look:{}}
});
/* MONLOOK: a function per monster that rolls its sprite look each time one spawns. pick([...]) chooses one of the hex colours at random.
   Common fields: body/fur/skin = main colour, eye = eye colour, cloth = clothing, gem = crystal colour,
   crys:false = no malignant crystals stuck on it, crysSmall = small crystals only, crysAt = where its crystals sit on the 32px sprite,
   mount/horse = mount type and its colour, leaves/antlers = extra part colours. */
const MONLOOK={
  MudMonster:()=>({body:pick(['#5a4a32','#4a4a2a','#5a3a2a'])}),
  CursedStag:()=>({fur:pick(['#4a3a4a','#5a4a3a','#3a3040']),eye:'#ff3a5a',antlers:'#d8d0bc',antler2:'#b07ae8',crys:false}),
  BoulderGolem:()=>({body:pick(['#7a746e','#6a625c','#8a8278']),eye:'#ff9a3c'}),
  FireSprite:()=>({crys:false,body:pick(['#ff8a3c','#ff6a2a','#ffaa3c'])}),
  /* crystal creatures: mostly blood red, sometimes another gem. crys:false = no extra crystals stuck on (they are crystal) */
  Shardling:()=>({crys:false,gem:pick(['#c8283a','#c8283a','#c8283a','#2a9a5a','#3a5ac8','#8a3ac0'])}),Prism:()=>({crys:false,gem:pick(['#c8283a','#c8283a','#3a5ac8','#8a3ac0'])}),CrystalSentinel:()=>({crys:false,gem:pick(['#a8202e','#a8202e','#2a8a4a','#7a3ab0'])}),
  BogLurker:()=>({crysSmall:true,body:pick(['#4a5a32','#3a4a3a','#5a5a3a'])}),
  BlightedTreant:()=>({body:pick(['#5a4a32','#4a3a2a','#6a5a3a']),eye:'#9aff6a',leaves:pick(['#3f7a42','#5a6a2a','#6a3a5a'])})
};
/* biomeIds: the regions a run can draw (the Heart is always Act 3) */
const biomeIds=()=>Object.keys(BIOMES).filter(b=>b!=='heart');
/* REGIONS: n = name, noThe = don't say 'the', bg = map-screen background colour, d = description, tip = [id, title, help text],
   maps = battle map ids (in MAPS), bossMap = the boss's map, town = [ground, cover] letters for Defend fights, townN = settlement name,
   pool / elitePool = enemies as [class id, weight, first floor it can appear on (default 1)]: weight is the relative chance of being picked,
     and in Act 2 every floor limit is ignored. An elite fight is led by an Elder of the first elitePool entry.
   boss: name, cls (class id), mov, s = stats in stat order [HP, Str, Mag, Skl, Spd, Lck, Def, Res], items, skill, summon, look (sprite colours). */
const BIOMES={
  swamp:{n:'Sobek’s Mire',noThe:1,bg:'#22362c',d:'Mangrove roots and ankle-deep water. Lurkers and lamias hunt the shallows; the sand banks are solid ground.',
    tip:['swamp','Ankle-deep water','A unit that starts its turn in the water or the mangrove roots has 1 less Move. Sand is solid ground. Fliers and swamp creatures ignore this.'],
    maps:['flats','road','bog'],bossMap:'lair',pool:[['BogLurker',3],['Lamia',3,2],['MudMonster',2,4]],elitePool:[['MudMonster',3],['Lamia',2],['BogLurker',2]],
    boss:{name:'Krondis',cls:'Krondis',mov:4,s:[40,13,0,5,5,2,10,1],items:['bite'],skill:'wrath',look:{body:'#5a6a86',belly:'#5a7a4a',crown:true}}},
  forest:{n:'Cursed Woodland',bg:'#26302a',d:'A dead forest under a curse. The deer here have gone wrong, wolves hunt in packs, and the trees themselves are waking up.',
    tip:['woods','Cursed thickets','Cursed thickets give +25 Avoid and +1 Def, but cost 2 Move to enter. Stags are fast: keep your back line covered.'],
    maps:['woodland','brook','clearing'],bossMap:'heart',pool:[['Wolf',4],['CursedStag',3,2],['BlightedTreant',2,5]],elitePool:[['BlightedTreant',3],['CursedStag',3],['Wolf',2]],
    boss:{name:'The Hollow Bear',cls:'HollowBear',mov:4,s:[38,13,0,6,5,3,8,3],items:['slam'],skill:'wrath',look:{fur:'#3a2a24',eye:'#ff3a3a',core:'#ff6aa8'}}},
  mountain:{n:'Volcanic Isle',bg:'#3a2420',d:'Basalt slopes cut by rivers of magma. Golems block the passes, and fire sprites float over the lava.',
    tip:['lava','Magma','Magma can’t be crossed on foot. Fliers and fire creatures move over it freely.'],
    maps:['fields','caldera','ridge'],bossMap:'crater',pool:[['FireSprite',3],['BoulderGolem',3,3]],elitePool:[['BoulderGolem',3],['FireSprite',2]],
    boss:{name:'Pyraxis, the Magma Dragon',cls:'MagmaDragon',s:[42,12,10,6,4,2,10,6],items:['magmaBreath'],skill:'steadfast',look:{body:'#4a2420',magma:true,big:true,crysSmall:true,crysCol:'#3a2a4a'}}},
  /* Act 3, the end of every run: not in the region draw (biomeIds). Its monsters are the Heart's own crystal creatures */
  heart:{n:'The Heart of the Blight',noThe:1,bg:'#3a1018',d:'Scorched ground split by veins of glowing gem. Every crystal in these lands grew from what waits here.',
    tip:['heart','The Crystal Heart','The Heart never moves, but it strikes from 2 to 6 tiles away. Get next to it: it can’t hit what’s beside it. On even turns it hurls a Crystal Storm at your toughest unit and everyone next to them, so spread out. It calls more blighted monsters on turns 3, 5 and 7.'],
    maps:['heartHall'],bossMap:'heartCore',pool:[['Shardling',4],['Prism',3],['CrystalSentinel',2]],elitePool:[['CrystalSentinel',3],['Shardling',2],['Prism',2]],
    boss:{name:'The Crystal Heart',cls:'CrystalHeart',sz:3,mov:0,s:[56,0,8,8,0,0,8,8],items:['shatter'],skill:'focus',summon:'*',bars:3,summonTxt:'The Crystal Heart calls the blighted!',intro:'The Crystal Heart beats at the centre of the chamber, and every crystal in these lands beats with it. Shatter it to end the blight.',look:{crys:false}}}
};

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function bioTile(k){return art('tiles/'+k,()=>bioTile_draw(k))}
