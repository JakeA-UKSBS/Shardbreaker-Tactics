/* Desert, snow and cavern regions, music, battle maps, settlements and genBattle() */
/* ---- new regions: Sandstone Desert, Frostveil Reaches, Gemstone Caverns ---- */
/* fields: see the CLASSES key in 01-data.js */
Object.assign(CLS,{
  SandWorm:{n:'Sand Worm',w:['heavy'],body:'worm',mov:4,wade:true},SandstoneGolem:{n:'Sandstone Golem',w:['heavy'],body:'golem',mov:4},
  PyriteColossus:{n:'Pyrite Colossus',w:['heavy'],body:'cubes',mov:0},
  FrostWolf:{n:'Frost Wolf',w:['blade'],body:'beast',mov:6,wade:true},IceWorm:{n:'Ice Worm',w:['heavy'],body:'worm',mov:4,wade:true},
  AgateWyrm:{n:'Agate Wyrm',w:['art','heavy'],body:'dragon',mov:0},
  GemGolem:{n:'Gem Golem',w:['heavy'],body:'golem',mov:4},
  AmethystTurtle:{n:'Amethyst Turtle',w:['heavy','art'],body:'turtle',mov:0},
  HollowBear:{n:'Hollow Bear',w:['heavy'],body:'bear',mov:4},
  /* the Ice Troll is a placeholder humanoid brute until it gets its own art; the Yeti keeps the golem body for rules, its art is Rhi's art/bosses/yeti.png */
  IceTroll:{n:'Ice Troll',w:['heavy'],body:'vest',mov:4,wade:true,crit:5},
  Yeti:{n:'Yeti',w:['heavy'],body:'golem',mov:4,wade:true},
  Sage:{n:'Sage',w:['art'],body:'robe',mov:0}
});
/* elemental resistances (half damage): the monsters 5e would call immune */
for(const[k,e]of Object.entries({HellHound:'fire',MagmaDragon:'fire',FireSprite:'fire',BoulderGolem:'fire',FrostWolf:'ice',IceWorm:'ice',Yeti:'ice'}))if(CLS[k])CLS[k].res=e;
IT.crystalBall={n:'Crystal Ball',t:'item',kind:'orb',uses:1,key:'crystalBall'};
IT.frostBreath={n:'Frost Breath',t:'art',kind:'talisman',el:'water',mt:9,hit:80,crit:0,r:[1,2],uses:99,mag:true,key:'frostBreath'};
IT.crystalShards={n:'Crystal Shards',t:'art',kind:'talisman',el:'earth',mt:7,hit:80,crit:10,r:[1,2],uses:99,mag:true,key:'crystalShards'};
/* fields: see the ENEMY STATS key in 01-data.js (b/g order: HP, Str, Mag, Skl, Spd, Lck, Def, Res) */
Object.assign(FOE,{
  SandWorm:{b:[20,6,0,4,4,1,4,1],g:[.7,.4,0,.3,.25,.1,.2,.05],items:['bite'],look:{}},
  SandstoneGolem:{b:[24,7,0,2,2,0,9,1],g:[.8,.4,0,.2,.1,0,.35,.05],items:['slam'],look:{}},
  FrostWolf:{b:[16,5,0,4,7,1,2,2],g:[.55,.35,0,.3,.45,.1,.15,.15],items:['fangs']},
  IceWorm:{b:[21,6,0,4,4,1,5,2],g:[.7,.4,0,.3,.25,.1,.25,.1],items:['bite'],look:{}},
  IceTroll:{b:[24,8,0,3,3,0,5,1],g:[.8,.5,0,.25,.2,.05,.3,.05],items:['slam'],look:{}},
  GemGolem:{b:[22,7,0,3,2,0,9,3],g:[.75,.4,0,.25,.1,0,.35,.15],items:['slam'],look:{}}
});
/* GEMS: crystal colours (green, red, blue, gold, violet) */
const GEMS=['#3aa86a','#c8323a','#3a5ac8','#c8a83a','#9a5ac8'];
Object.assign(MONLOOK,{
  SandWorm:()=>({body:pick(['#c98a6a','#b8785a','#d8a07a'])}),
  SandstoneGolem:()=>({body:pick(['#c9945a','#b8824a','#d8a46a']),eye:'#ffd23f'}),
  IceWorm:()=>({body:pick(['#c8dcec','#b0c8e0','#d8e8f4'])}),
  IceTroll:()=>({style:'bald',skin:pick(['#9ab8d0','#8aa8c4','#a8c8dc']),cloth:'#4a5a6a',eye:'#7fe3ff'}),
  GemGolem:()=>({body:pick(GEMS),eye:'#ffffff'})
});
/* fields: see the TERRAIN key in 01-data.js */
Object.assign(TER,{
  'D':{n:'Deep Mud',k:'mud',c:99,av:0,df:0},/* the swamp's impassable ground: its maps' water (w) becomes this */
  'k':{n:'Sandstone Rocks',k:'sandstone',c:99,av:0,df:0},'^':{n:'Boulders',k:'boulder',c:99,av:0,df:0},'z':{n:'Quicksand',k:'quicksand',c:1,av:0,df:0,slow:true},'C':{n:'Cactus',k:'cactus',c:2,av:10,df:0},
  'o':{n:'Snow',k:'snow',c:1,av:0,df:0},'j':{n:'Deep Snow',k:'deepsnow',c:1,av:0,df:0,slow:true},'a':{n:'Blue Agate',k:'agate',c:2,av:10,df:2},'i':{n:'Frozen Lake',k:'ice',c:1,av:-10,df:0},
  'c':{n:'Cave Floor',k:'cave',c:1,av:0,df:0},'x':{n:'Iridescent Rock',k:'cavewall',c:99,av:0,df:0},'g':{n:'Malachite',k:'malachite',c:2,av:10,df:2},
  'e':{n:'Emerald Cluster',k:'emerald',c:2,av:10,df:2},'u':{n:'Ruby Cluster',k:'ruby',c:2,av:10,df:2},'p':{n:'Sapphire Cluster',k:'sapphire',c:2,av:10,df:2},
  /* the Heart of the Blight: scorched ground with glowing gem veins, blighted gem clusters and crystal spires */
  'S':{n:'Scorched Ground',k:'scorch',c:1,av:0,df:0},'G':{n:'Blighted Emerald',k:'bgem-g',c:2,av:10,df:2},'U':{n:'Blighted Ruby',k:'bgem-r',c:2,av:10,df:2},
  'P':{n:'Blighted Sapphire',k:'bgem-b',c:2,av:10,df:2},'Y':{n:'Blighted Amethyst',k:'bgem-v',c:2,av:10,df:2},'K':{n:'Crystal Spire',k:'spire',c:99,av:0,df:0}
});
texStyle.textContent+=['sandstone','quicksand','snow','deepsnow','agate','ice','cave','cavewall','emerald','ruby','sapphire','scorch','bgem-g','bgem-r','bgem-b','bgem-v','spire'].map(k=>`.t-${k}{background:url(${bioTile2(k)}) 0 0/100% 100%}`).join('');
texStyle.textContent+=`.tile.frz{background:url(${bioTile2('ice')}) 0 0/100% 100% !important}`;/* water frozen by an ice ability */
/* fields: see the REGIONS key in 15-regions-monsters.js */
Object.assign(BIOMES,{
  desert:{n:'Sandstone Desert',bg:'#4a3a24',town:['n','k'],townN:'Oasis Town',d:'Dunes and sandstone ruins under a white sun. Sand worms hunt beneath the dunes, and the quicksand swallows the careless.',
    tip:['desert','Quicksand','A unit that starts its turn in quicksand has 1 less Move. Sandstone rocks block the way.'],
    maps:['dunes','oasis','canyon'],bossMap:'sunTemple',pool:[['SandWorm',4],['SandstoneGolem',2,4]],elitePool:[['SandstoneGolem',3],['SandWorm',2]],
    boss:{name:'The Pyrite Colossus',cls:'PyriteColossus',mov:3,s:[42,13,0,5,3,2,12,7],items:['slam'],skill:'steadfast',look:{body:'#c9a83a',eye:'#fff2b0',crysAt:[{core:[14,19],col:'#3ad87a'}]}}},
  snow:{n:'Frostveil Reaches',bg:'#2a3a4e',town:['o','a'],townN:'Hill Village',d:'Snowfields studded with blue agate. Frost wolves hunt the drifts, and ice worms tunnel beneath them.',
    tip:['snow','Deep snow','A unit that starts its turn in deep snow has 1 less Move (snow creatures ignore it). Frozen lakes give −10 Avoid; blue agate gives +10 Avoid and +2 Def.'],
    maps:['tundra','frozenLake','agateField'],bossMap:'agateSpire',pool:[['FrostWolf',4],['IceWorm',2,4],['IceTroll',2,5]],elitePool:[['IceWorm',3],['IceTroll',2],['FrostWolf',2]],
    boss:{name:'The Yeti',cls:'Yeti',mov:4,s:[42,13,0,6,5,2,9,8],items:['slam'],skill:'wrath',look:{body:'#e8eef8',eye:'#7fe3ff'}}},
  cavern:{n:'Gemstone Caverns',bg:'#2a2436',town:['c','e'],townN:'Miners’ Camp',d:'Caves glittering with emerald, ruby and sapphire, and golems made of the gems themselves.',
    tip:['cavern','Gem clusters','Gem clusters give +10 Avoid and +2 Def. The cave walls can’t be crossed.'],
    maps:['geode','mineshaft','glitter'],bossMap:'amethystHollow',pool:[['GemGolem',1]],elitePool:[['GemGolem',1]],
    boss:{name:'Amethyra, the Amethyst Turtle',cls:'AmethystTurtle',s:[46,11,8,5,2,3,14,11],items:['slam','crystalShards'],skill:'steadfast'}}
});
Object.assign(BIOMES.swamp,{town:['n','v'],townN:'Stilt Village'});Object.assign(BIOMES.forest,{town:['.','f'],townN:'Woodcutters’ Hamlet'});Object.assign(BIOMES.mountain,{town:['b','m'],townN:'Smelters’ Camp'});
for(const k in BIOMES)BIOMES[k].id=k;
/* region name with its article: 'the Cursed Woodland', 'The Labyrinth', 'Sobek’s Mire' */
const theN=B=>B.noThe||/^The /.test(B.n)?B.n:'the '+B.n,TheN=B=>{const t=theN(B);return t[0].toUpperCase()+t.slice(1)};
/* acts 1 and 2 are drawn from the regions; act 3 is always the Heart of the Blight */
const ACTS=3;
/* REGION_ACTS: the regions each act draws from, so monsters can be balanced for their act */
const REGION_ACTS=[['forest','swamp','desert'],['mountain','snow','cavern']];
const MUSIC={title:'music/title.mp3',tavern:'music/tavern.mp3'};/* regions have ambience instead of music (AMBIENCE) */
let bgm=null,bgmKey='';
/* Background music: music/title.mp3 and music/tavern.mp3. Missing files are skipped. */
/* ambience: a region's sound, looping on its map, events and battles (regions have no music) */
const AMBIENCE={swamp:'sfx/swamp-ambience.mp3'};let amb=null,ambKey='';
function ambience(k){k=k||'';if(k===ambKey&&amb)return;ambKey=k;try{if(amb)amb.pause();amb=null;if(!settings.sound||!AMBIENCE[k])return;amb=new Audio(AMBIENCE[k]);amb.loop=true;amb.volume=.35*(settings.volAmb??1);amb.play().catch(()=>{})}catch(_){}}
/* in a region: its ambience, no music */
function regionSound(k){music(null);ambience(k)}
/* Options volume sliders: apply to what's playing now */
function applyVol(){if(AU.out)AU.out.gain.value=SFX_VOL*(settings.volSfx??1);if(bgm)bgm.volume=.45*(settings.volMusic??1);if(amb)amb.volume=.35*(settings.volAmb??1)}
function music(k){if(k===bgmKey&&bgm)return;bgmKey=k;try{if(bgm)bgm.pause();bgm=null;if(!settings.sound||!MUSIC[k])return;bgm=new Audio(MUSIC[k]);bgm.loop=true;bgm.volume=.45*(settings.volMusic??1);bgm.play().catch(()=>{})}catch(_){}}

/* BATTLE MAPS: n = name, map = rows of terrain letters (top row first, see TER for each letter), start = [x, y] tiles your units deploy on. */
const MAPS={
  /* Swamp */
  flats:{n:'Mangrove Flats',map:["sssssnnnssssssv","sssssnnnssssssv","vvsssnnnssswwws","ssssssssssswwws","ssssssssssswwws","sssvvssssssssss","nnssssssvsssssn","nnssssssvsssssn","nnssssssssssssn","ssssswwwsssssss","ssssswwwsssssss","vvssswwwsssvsss","ssssssssnnnssss","ssssssssnnnssss","ssssssnnnnnssss"],start:[[6,14],[7,14],[8,14],[7,13],[8,13],[5,14]]},
  road:{n:'Sunken Road',map:["wwsssnnnnnnnsss","wwsssnnnnnnnsss","sssvvnsssssnvvs","sssnnnssvssnnns","sssnnnssvssnnns","sssnnsssssssnns","vvsnnsssssssssn","vvsnnsssssssssn","sssnnnsssssnnns","sssvvnnnnnnnvvs","sssvvnnnnnnnvvs","wwssssnnnnnssss","wwwsssssnsssssw","wwwsssssnsssssw","ssssssssnssssss"],start:[[8,14],[7,14],[9,14],[8,13],[7,12],[9,12]]},
  bog:{n:'Bog Pools',map:["vvssswwwwwwsssv","vvssswwwwwwsssv","ssssssnnnssssss","wwssssnnnssssss","wwssssnnnssssss","wwsssvsssvvsssw","sssssssssssssss","sssssssssssssss","nnnssswwwsssnnn","nnnssswwwsssnnn","nnnssswwwsssnnn","ssvsssssssssvvs","sssssnnnnnnssss","sssssnnnnnnssss","ssssssnnnssssss"],start:[[6,14],[7,14],[5,13],[6,13],[7,13],[8,13]]},
  lair:{n:'Krondis’s Lair',map:["wwsssnnnnnnsssw","wwsssnnnnnnsssw","sssssnnnnnnnsss","sssvvssssssvsss","sssvvssssssvsss","sssssssssssssss","vvssswwwwwwsssv","vvssswwwwwwsssv","ssssswwwwwwssss","ssnnnssssssnnns","ssnnnssssssnnns","ssnnnssssssnnns","sssssnnnnnnssss","sssssnnnnnnssss","ssssssnnnssssss"],start:[[6,14],[7,14],[5,13],[6,13],[7,13],[8,13]],boss:[7,1]},
  /* Cursed Woodland */
  woodland:{n:'Cursed Woodland',map:[".....y...ff....",".....y...ff....","^^f......yy...f","yy...f...^^^..y","yy...f...^^^..y","...ff...f......","^^......y...ff.","^^......y...ff.","..y..f........y","ff^........f...","ff^........f...","...yy...f...yy.","ff.............","ff.............","..............."],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  brook:{n:'Black Brook',map:["..f......yy....","..f......yy....","yy...fff......f",".....f...yy....",".....f...yy....","ww=wwwwwwwww==w",".....y...ff....",".....y...ff....","ff.......ff...y","...ff.........f","...ff.........f","yy......y......",".....f......ff.",".....f......ff.","..............."],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  clearing:{n:'Hunter’s Clearing',map:["ff............f","ff............f","..^ff......f...","..^..^...^^....","..^..^...^^....","ff.............","......yy.......","......yy.......","........^^^...f","...ff......f...","...ff......f...","...............","...............","...............","..............."],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  heart:{n:'The Hollow Heart',map:["ff...f.....f..f","ff...f.....f..f","^^^yy.......yy.","......ff.ff....","......ff.ff....","...yy.......yy.","ff^...yy.yy...f","ff^...yy.yy...f","...ff......^ff.","yy.............","yy.............",".....f.....f...","...............","...............","..............."],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]],boss:[7,0]},
  /* Volcanic Isle */
  fields:{n:'Magma Fields',map:["bbbbblllbbbbbbR","bbbbblllbbbbbbR","mmbbbblllbbbbbb","bbbbbbbblllbmmb","bbbbbbbblllbmmb","bbbbbbbbbllbbbb","bbmbbbbbbbbbbbb","bbmbbbbbbbbbbbb","bbblllbbbbbmbbb","bbbbbllllbbbbbb","bbbbbllllbbbbbb","mmbbbbbbbbbbbbm","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  caldera:{n:'Caldera Pass',map:["bbbmmblllbbmbbb","bbbmmblllbbmbbb","bbbbbllllllbbbb","mmbbbllllllbbbm","mmbbbllllllbbbm","bbbbbblllbbbbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","llbbbmbbbmmbbbl","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbmbbbbbbbbbmmb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb"],start:[[6,14],[7,14],[5,14],[8,14],[5,13],[7,13]]},
  ridge:{n:'Rockslide Ridge',map:["bbbbbbRRbbbbbbl","bbbbbbRRbbbbbbl","mmRbbbbbbbbbbbl","bbbRRbbbbbbllll","bbbRRbbbbbbllll","bbbRRRbbbRRlbbb","bbbbbbbbbbbblll","bbbbbbbbbbbblll","lllbbbmmbbbbbbl","bblbbbbbbbbmbbb","bblbbbbbbbbmbbb","lllbbRbbbbbbbbb","llbbbbbbbbbbbbb","llbbbbbbbbbbbbb","llbbbbbbbbbbbbb"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  crater:{n:'Dragon’s Crater',map:["lllbbbbbbbbblll","lllbbbbbbbbblll","llbbbbbbbbbbbbl","bbbmmbbbbbbmbbb","bbbmmbbbbbbmbbb","bbbbbblllbbbbbb","bbbbbllllllbbbb","bbbbbllllllbbbb","bbbbbblllbbbbbb","bbmbbbbbbbbbmmb","bbmbbbbbbbbbmmb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]],boss:[6,0]},
};
Object.assign(MAPS,{
  /* Act 3: the Heart of the Blight */
  heartHall:{n:'Hall of Veins',map:["SSSKKSSSSSSKSSS","SSSKKSSSSSSKSSS","SSYSSSUUSSSGSSS","SSSSSSSSSSSSPPS","SSSSSSSSSSSSPPS","KKSSSGSSSUUSSSK","SSSSSSKKKSSSSSS","SSSSSSKKKSSSSSS","SSPSSSSSSSSSYYS","SSSSSUSSSGGSSSS","SSSSSUSSSGGSSSS","SSSSSSSSSSSSSSS","SSYSSSSSSSSSUUS","SSYSSSSSSSSSUUS","SSSSSSSSSSSSSSS"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  heartCore:{n:'Heart Chamber',map:["KKSSSSSSSSSSSSK","KKSSSSSSSSSSSSK","SSSYYSSSSSSUSSS","SSSSSSSSSSSSSSS","SSSSSSSSSSSSSSS","SSGSSSSSSSSSPPS","SSSSSSSSSSSSSSS","KKSUUSSSSSSYSSK","KKSUUSSSSSSYSSK","SSSSSSGGSSSSSSS","SSSPPSSSSSSUSSS","SSSSSSSSSSSSSSS","SSSSSSSSSSSSSSS","SSSSSSSSSSSSSSS","SSSSSSSSSSSSSSS"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]],boss:[6,1]}
});
Object.assign(MAPS,{
  dunes:{n:"Shifting Dunes",map:["kknfffzzznnnnnw","kknfffzzznnnnnw","kknnnnzzznnwwwk","wwwzzznnnnnnnnn","wwwzzznnnnnnnnn","nnwwwwnnnnnnnnn","nnzzzwwwnfffzzz","nnzzzwwwnfffzzz","nnnnnnnnnnnfzzz","nnnnnnnnnnnnzzn","nnnnnnnnnnnnzzn","nnnnnnnnnkknzzn","kknnnnnnnnnnnnn","kknnnnnnnnnnnnn","kknnnnnnnnnnnnn"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  oasis:{n:"Oasis",map:["nnnnnnwwwnnnnnn","nnnnnnwwwnnnnnn","nnnnnwwwwwwnnnn","kknnnnwwwnnnnnk","kknnnnwwwnnnnnk","nnnnnnnnnnnnnnn","zzznnnkknnnzzzn","zzznnnkknnnzzzn","zzznnnnnnnnzzzn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnknnnnnnnnnkkn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  canyon:{n:"Sandstone Canyon",map:["nnnnnnzzznnnnnn","nnnnnnzzznnnnnn","nnnkknnnnnnknnn","nnnkknnnnnnknnn","nnnkknnnnnnknnn","nnnnnnnnnnnnnnn","zzznnnkkknnnzzz","zzznnnkkknnnzzz","nnnnnnkkknnnnnn","nnknnnnnnnnnkkn","nnknnnnnnnnnkkn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  sunTemple:{n:"Temple of the Sun",map:["kknnnnnnnnnnnnk","kknnnnnnnnnnnnk","nnnnnnnnnnnnnnn","nnknnnnnnnnnkkn","nnknnnnnnnnnkkn","nnnnnnzzznnnnnn","nnnnnnzzznnnnnn","nnnnnnzzznnnnnn","kknnnnnnnnnnnnk","nnnnnknnnkknnnn","nnnnnknnnkknnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]],boss:[7,0]},
  tundra:{n:"Open Tundra",map:["oojjjooooooojjj","oojjjooooooojjj","oojjjoooaoooooo","ooooo^^^ooooooo","ooooo^^^ooooooo","aaoooooojjjoooo","ooo^^ojjjjjoooo","ooo^^ojjjjjoooo","ooooooooooooooo","oojjjoooa^^ooo^","oojjjoooa^^ooo^","ooooooooooojjjo","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  frozenLake:{n:"Frozen Lake",map:["oooooiiiiiiiooo","oooooiiiiiiiooo","oooiiiiiiiiiii^","aaoiiiiiaiiiii^","aaoiiiiiaiiiii^","oooiiiiiiiiiiio","oooooiiiiiiiooo","oooooiiiiiiiooo","oojjjooo^oojjjo","^^jjjoaaooojjjo","^^jjjoaaooojjjo","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  agateField:{n:"Agate Field",map:["oooooooojjjoooo","oooooooojjjoooo","ooaaaooo^^^oaaa","oo^oooaaaoooooo","oo^oooaaaoooooo","jj^ooo^^ooooooj","oooaao^^ooooaao","oooaao^^ooooaao","oooooojjjoooooo","aao^^oooooooaao","aao^^oooooooaao","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  agateSpire:{n:"Agate Spire",map:["aaooooooooooooa","aaooooooooooooa","oooooo^^ooooooo","^^jjjoooooojjjo","^^jjjoooooojjjo","ooooooaaaooo^^o","jjooooooooooooo","jjooooooooooooo","ooaooooooooaooo","ooooooooooooooo","ooooooooooooooo","oojjjoooooojjjo","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]],boss:[6,0]},
  geode:{n:"Geode Chamber",map:["cccccecccuucccc","cccccecccuucccc","ccccccccccccccc","ccpccxxxxxxceec","ccpccxxxxxxceec","ccccccccccccccc","xxccccccccccxxx","xxccccccccccxxx","ccucccccccccppc","ccccccxxxcccccc","ccccccxxxcccccc","ccecccccccccccu","ccccccccccccccc","ccccccccccccccc","ccccccccccccccc"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  mineshaft:{n:"Old Mineshaft",map:["cccxxccccxxcccc","cccxxccccxxcccc","cccxxceecxxccce","ccccccccccccccc","ccccccccccccccc","xxxccxxxxxxcxxx","ccccccuuccccccc","ccccccuuccccccc","cceccccccccpccc","xxcccxxxxxxcccx","xxcccxxxxxxcccx","ccccccccccccccu","ccccccccccccccc","ccccccccccccccc","ccccccccccccccc"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  glitter:{n:"Glittering Hall",map:["ccceeccccuuceee","ccceeccccuuceee","ccccccccccccccc","ccucccppccceccp","ccucccppccceccp","cccccccccccccc^","eeccccccccccccc","eeccccccccccccc","^^cccp^^cccuccc","^^ccccccc^^ccce","^^ccccccc^^ccce","ccucccccccccccc","ccccccccccccccc","ccccccccccccccc","ccccccccccccccc"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]]},
  amethystHollow:{n:"Amethyst Hollow",map:["xxxcccccccccccx","xxxcccccccccccx","xxcccccccccuuuc","ppccccccccccuue","ppccccccccccuue","pppcccxxxccceee","ccccccccccccccc","ccccccccccccccc","xxucccccccccccx","xxuuucccccccppp","xxuuucccccccppp","ccccccccccccccc","ccccccccccccccx","ccccccccccccccx","xxxcccccccccxxx"],start:[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]],boss:[6,0]}
});

/* hand-made height maps (greybox): one digit per tile, 0 = ground. Maps without h get hills and rubble at 1. */
MAPS.woodland.h=["554443221000111", "554443221000111", "444443221000112", "444440000000112", "444440000000112", "000000000000001", "000000000000000", "000000000000000", "000111000000000", "000000000002110", "000000000002110", "000002000001110", "000222000000000", "000222000000000", "000110000000000"];
MAPS.brook.h=["444333333333444", "444333333333444", "333333333333333", "333333333333333", "333333333333333", "001000000000110", "111111111111111", "111111111111111", "111111111111111", "111222111111111", "111222111111111", "111222111000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.clearing.h=["111111111111111", "111111111111111", "111111222221111", "111112222222111", "111112222222111", "001112333221110", "001112333221000", "001112333221000", "000111222110000", "000001111000000", "000001111000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.heart.h=["222113333331222", "222113333331222", "222113333331222", "111112222221111", "111112222221111", "000001111110000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
/* Sandstone Desert */
MAPS.dunes.h=["111110000111111", "111110000111111", "111111000111111", "111222000001111", "111222000001111", "111111000001114", "220000000000223", "220000000000223", "111000000000223", "000001110001111", "000001110001111", "111112222221111", "222223333332222", "222223333332222", "222223333332222"];
MAPS.oasis.h=["222110000001222", "222110000001222", "221000000000112", "221000000000112", "221000000000112", "111000000000111", "000000000000001", "000000000000001", "000000000000001", "110000000000001", "110000000000001", "111000000000111", "000000000000000", "000000000000000", "000000000000000"];
MAPS.canyon.h=["333221000112333", "333221000112333", "333331000113333", "333331000113333", "333331000113333", "333221000112333", "000110000001000", "000110000001000", "110000000000001", "111000000000111", "111000000000111", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.sunTemple.h=["112334444443221", "112334444443221", "112333444333221", "112223333332221", "112223333332221", "001112000221110", "000111000111000", "000111000111000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
/* Frostveil Reaches */
MAPS.tundra.h=["222221111222222", "222221111222222", "222110000111222", "111000000001111", "111000000001111", "110000000000111", "000000000000000", "000000000000000", "000000000000000", "000001111000000", "000001111000000", "000111222111000", "111222333222111", "111222333222111", "111223333332111"];
MAPS.frozenLake.h=["222110000000112", "222110000000112", "221000000000001", "221000001000001", "221000001000001", "111000000000001", "111110000000111", "111110000000111", "111111111111111", "111111111111111", "111111111111111", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.agateField.h=["333333333333333", "333333333333333", "334443333333444", "223222333222222", "223222333222222", "112111221111111", "111221111111221", "111221111111221", "000000111000000", "110000000000110", "110000000000110", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.agateSpire.h=["333444444444333", "333444444444333", "223333443333332", "222222333222222", "222222333222222", "111112222221111", "000111111111000", "000111111111000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
/* Gemstone Caverns */
MAPS.geode.h=["333333333333333", "333333333333333", "332222222222223", "332111111111223", "332111111111223", "221000000000112", "221000000000112", "221000000000112", "221000000000112", "221110000001112", "221110000001112", "222221111112222", "222222222222222", "222222222222222", "222222222222222"];
MAPS.mineshaft.h=["222222222222222", "222222222222222", "222222222222222", "222222222222222", "222222222222222", "222222222222222", "111111111111111", "111111111111111", "111111111111111", "111111111111111", "111111111111111", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.glitter.h=["111111111111111", "111111111111111", "111111111111111", "111112222221111", "111112222221111", "111222333222111", "111223333332111", "111223333332111", "111222333222111", "000111222111000", "000111222111000", "000000111000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.amethystHollow.h=["333334444443335", "333334444443335", "223333222222334", "223333222222222", "223333222222222", "222112222222111", "000112221111000", "000112221111000", "000002222000000", "000111000000000", "000111000000000", "000110000000000", "000111000000001", "000111000000001", "000000000000001"];
/* Sobek’s Mire */
MAPS.flats.h=["000001110000001", "000001110000001", "110001110000000", "000000000000000", "000000000000000", "000110000000000", "110000001000001", "110000001000001", "110000000000001", "000000000000000", "000000000000000", "110000000001000", "000000112221000", "000000112221000", "000001222221000"];
MAPS.road.h=["000002222222000", "000002222222000", "000112000002110", "000111001001110", "000111001001110", "000110000000110", "110110000000001", "110110000000001", "000111000001110", "000111111111110", "000111111111110", "000000111110000", "000000001000000", "000000001000000", "000000001000000"];
MAPS.bog.h=["110000000000001", "110000000000001", "000000111000000", "000000111000000", "000000111000000", "000001000110000", "000000000000000", "000000000000000", "111000000000111", "111000000000111", "111000000000111", "001000000000110", "000001111110000", "000001111110000", "000000111000000"];
MAPS.lair.h=["000001222221000", "000001222221000", "000002333332000", "000111111111000", "000111111111000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "001110000001110", "001110000001110", "001110000001110", "000001111110000", "000001111110000", "000000111000000"];
/* Volcanic Isle */
MAPS.fields.h=["222220002223333", "222220002223333", "222221000222223", "111111110002222", "111111110002222", "111111111001111", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.caldera.h=["333333000333333", "333333000333333", "333330000003333", "222220000002222", "222220000002222", "222222000222222", "111111111111111", "111111111111111", "001111111111110", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.ridge.h=["111111111111111", "111111111111111", "111111111111111", "000220000000000", "000220000000000", "000222000000111", "000000000000001", "000000000000001", "001111111111221", "111222222222111", "111222222222111", "222333333333222", "333334444443333", "333334444443333", "333444444444333"];
MAPS.crater.h=["000334444443000", "000334444443000", "002333333333220", "112222222222221", "112222222222221", "111111000111111", "111110000001111", "111110000001111", "111111000111111", "001111111111110", "001111111111110", "000000000000000", "000000000000000", "000000000000000", "000000000000000"];
/* settlements for Defend fights: one hand-made map per region, in its own terrain. Enemies arrive along the top two
   rows; you start along the bottom (TOWN_START). All maps are 15x15 (scaled up from the old 10x10 ones, Nov 2026). */
/* where you deploy in every settlement */
const TOWN_START=[[6,14],[7,14],[5,14],[8,14],[6,13],[7,13]];
const TOWNS={
  swamp:["ssssssnnnssssss","ssssssnnnssssss","ssvsssnnnsssvvs","sssnnnnnnnnnsss","sssnnnnnnnnnsss","wwsnnvnnnvvnssw","wwsnnnnnnnnnssw","wwsnnnnnnnnnssw","sssnnnnnnnnnsss","ssnvvnnnnnnvnns","ssnvvnnnnnnvnns","sssnnnnnnnnnsss","sssnnnnnnnnnsss","sssnnnnnnnnnsss","sssssnnnnnnssss"],
  desert:["nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnknnnnnnnnnkkn","nnnnnnzzznnnnnn","nnnnnnzzznnnnnn","kknnnnnnnnnnnnk","nnnnnnwwwnnnnnn","nnnnnnwwwnnnnnn","nnnnnnwwwnnnnnn","kknnnnnnnnnnnnk","kknnnnnnnnnnnnk","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn","nnnnnnnnnnnnnnn"],
  forest:["...............","...............","..f.........ff.",".....^...^^....",".....^...^^....","ff...y...yy...f","...............","...............","..f.........ff.","^^............^","^^............^","...yy......y...","...............","...............","..............."],
  mountain:["bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbmbbbbbbbbbmmb","bbbbbRbbbRRbbbb","bbbbbRbbbRRbbbb","llbbbbbbbbbbbbl","bbbbbbmmmbbbbbb","bbbbbbmmmbbbbbb","bbbbbbbbbbbbbbb","RRbbbbbbbbbbbbR","RRbbbbbbbbbbbbR","bbbmmbbbbbbmbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb","bbbbbbbbbbbbbbb"],
  snow:["ooooooooooooooo","ooooooooooooooo","ooaooojjjoooaao","ooooo^ooo^^oooo","ooooo^ooo^^oooo","jjooooooooooooj","ooooooiiioooooo","ooooooiiioooooo","ooooooooooooooo","^^oooooooooooo^","^^oooooooooooo^","oooaaooooooaooo","ooooooooooooooo","ooooooooooooooo","ooooooooooooooo"],
  cavern:["ccccccccccccccc","ccccccccccccccc","ccecccccccccccu","cccccxcccxxcccc","cccccxcccxxcccc","ppccccccccccccp","cccccceeccccccc","cccccceeccccccc","ccccccccccccccc","xxccccccccccccx","xxccccccccccccx","cccuucccccceccc","ccccccccccccccc","ccccccccccccccc","ccccccccccccccc"]
};
for(const k in TOWNS)if(BIOMES[k])MAPS['town_'+k]={n:BIOMES[k].townN,map:TOWNS[k],start:TOWN_START};
/* settlement height maps (made from the old generated ones, so they look the same; edit them with tools/map-editor.html) */
MAPS.town_swamp.h=["000000111000000", "000000111000000", "001000111000110", "000111111111000", "000111111111000", "000111111111000", "000111001111000", "000111001111000", "000111111111000", "001111001111110", "001111001111110", "000111111111000", "000000000000000", "000000000000000", "000000000000000"];
MAPS.town_desert.h=["112333222221222", "112333222221222", "113332111111333", "222221000111223", "222221000111223", "222222111111223", "222221000112222", "222221000112222", "222221000112222", "222110001112222", "222110001112222", "111000001111111", "000000000000000", "000000000000000", "000000000000000"];
MAPS.town_forest.h=["222222222222222", "222222222222222", "222222222222222", "222222222221112", "222222222221112", "222222222221112", "222222222111111", "222222222111111", "222111111111111", "221111111111111", "221111111111111", "111111111111001", "000000000000000", "000000000000000", "000000000000000"];
MAPS.town_mountain.h=["334443223444443", "334443223444443", "223333333334332", "112333332333221", "112333332333221", "001222222222110", "112111111222221", "112111111222221", "222221111222222", "222221111222222", "222221111222222", "111111111111111", "000000000000000", "000000000000000", "000000000000000"];
MAPS.town_snow.h=["444444444444333", "444444444444333", "333334333443333", "333334222443333", "333334222443333", "222332111223333", "222221000112332", "222221000112332", "111222111222332", "111111111222222", "111111111222222", "000111111111111", "000000000000000", "000000000000000", "000000000000000"];
MAPS.town_cavern.h=["222222222222222", "222222222222222", "222222222222222", "111112222221112", "111112222221112", "111112222221111", "111111222221111", "111111222221111", "111111111111111", "111111111111111", "111111111111111", "111111111000000", "000000000000000", "000000000000000", "000000000000000"];
/* ADJ: adjectives for generated names */
const ADJ=['Howling','Silent','Broken','Ashen','Bitter','Hollow','Moonlit','Drowned'];
function spawnTiles(m){
  const out=[];for(let y=0;y<m.map.length;y++)for(let x=0;x<m.map[0].length;x++){const t=TER[m.map[y][x]];if(t.c>=99)continue;const d=Math.min(...m.start.map(([sx,sy])=>Math.abs(sx-x)+Math.abs(sy-y)));if(d>=6)out.push({x,y,d})}
  return shuffle(out);
}
function actBiome(){const a=run&&run.act||1;if(a>=3)return BIOMES.heart;
  return BIOMES[run&&run.biomes&&run.biomes[a-1]]||BIOMES.forest}
/* bosses lumber: they move, but only a couple of tiles a turn */
/* BOSS_MOV: max tiles a boss moves per turn */
const BOSS_MOV=2;
/* ROCK_MAX: most rocks left on a battle map (the rest are cleared, see genBattle); two boulders side by side count as one */
const ROCK_MAX=7;/* on a 15x15 map */
/* ACT2_UP: Act 2 monsters (not bosses, who scale on their own) are a little stronger: extra levels, HP, and Str/Mag for whichever they use */
const ACT2_UP={lv:1,hp:2,atk:1};
function genBattle(n,kind){
  const act=run&&run.act||1,B=actBiome(),bossFight=kind==='boss',elite=kind==='elite',town=!bossFight&&!elite&&MAPS['town_'+B.id]&&!!(run&&run.def);/* set from the node (nodeDef in 18-node-map.js) */
  const mk=bossFight?B.bossMap:town?'town_'+B.id:pick(B.maps);let m=MAPS[mk];
  /* tidy the hand-made map: at most ROCK_MAX rocks (boulders ^, sandstone k, crags R).
     What's removed becomes the map's most common ground. */
  {const ROCKS=['^','k','R'],rs=[],pair={};m.map.forEach((r,y)=>[...r].forEach((ch,x)=>{if(!ROCKS.includes(ch))return;
     /* a boulder next to the one before it (left or above) is kept or dropped with it, so the pair can be drawn as one big rock */
     const solo=k=>pair[k]===k&&Object.values(pair).filter(v=>v===k).length===1,isB=([a,b])=>m.map[b]&&m.map[b][a]==='^';
     const p=ch==='^'&&[[x-1,y],[x,y-1]].filter(isB).map(([a,b])=>a+','+b).find(solo);
     if(p)pair[x+','+y]=p;else{pair[x+','+y]=x+','+y;rs.push(x+','+y)}}));
   const cnt={};m.map.join('').split('').forEach(c=>{if(TER[c]&&TER[c].c<99)cnt[c]=(cnt[c]||0)+1});
   const g=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0],dropR=new Set(rs.length>ROCK_MAX?shuffle(rs.slice()).slice(ROCK_MAX):[]),drop=new Set(Object.keys(pair).filter(k=>dropR.has(pair[k])));
   const mud=B.id==='swamp';/* the swamp's water is deep mud instead */
   m={...m,map:m.map.map((r,y)=>[...r].map((ch,x)=>drop.has(x+','+y)?g:mud&&ch==='w'?'D':ch).join(''))}}
  /* difficulty climbs with the floor and the act: act 1 floor 1 is Lv 1, act 1 floor 9 is Lv 6, act 2 starts at Lv 7 */
  const fl=flScale(run&&run.n),diff=(act-1)*10+fl,lvBase=1+Math.floor(diff*.6)+(A(1)?1:0)+(A(4)?1:0);
  const pool=(elite?B.elitePool:B.pool).filter(p=>act>=2||fl>=(p[2]||1)),tot=pool.reduce((a,p)=>a+p[1],0);
  const roll=()=>{let r=rand()*tot;for(const[c,w]of pool){if((r-=w)<0)return c}return pool[0][0]};
  const count=bossFight?(B.id==='heart'?0:act>=2?5:4):town?Math.min(4,1+Math.floor(fl/4)+(act-1)):Math.min(7,2+Math.floor(fl/3)+(act-1)*2+(elite?1:0)+(A(4)?1:0)),list=elite?[B.elitePool[0][0]]:[];
  while(list.length<count){const c=roll();list.push(c);if(c==='Wolf'&&list.length<count&&rand()<.6)list.push('Wolf')}
  const bossName=B.boss.name,turns=town?ri(5,6):0;
  const goal=bossFight?'boss':town?'defend':'rout';
  const def={biome:B.id,title:bossFight?(B.boss&&B.boss.name||'Boss Battle'):town?'Defend the Settlement':elite?'Elite Battle':'Battle',/* no map names in titles; bosses go by their own name */goal,turns,map:m.map,h:m.h,start:m.start,gifts:{},
    intro:bossFight&&B.boss.intro?B.boss.intro:bossFight?`${bossName} waits for you in the ${m.n}. Defeat it to clear ${theN(B)}.`:town?`Crystallised beasts are closing on the ${m.n.toLowerCase()}. Hold them off for ${turns} turns.`:elite?`A pack led by something old and strong holds the ${m.n.toLowerCase()}. Rout them all.`:''};/* ordinary fights: no intro line, the goal says it */
  /* drops: 12% of enemies carry something, at most one weapon a battle, and never a weapon the squad already has */
  def.foes=()=>{const tiles=spawnTiles(m),out=[];let wDrop=0;
    list.forEach((c,i)=>{const lv=Math.max(1,lvBase+(rand()<.3?1:0)-(c==='Wolf'?1:0)+(elite?2:0)+(act===2?ACT2_UP.lv:0)),u=mkMon(c,lv),t=tiles[i%tiles.length];u.x=t.x;u.y=t.y;
      if(act===2){u.maxhp+=ACT2_UP.hp;u.hp+=ACT2_UP.hp;if(u.str)u.str+=ACT2_UP.atk;if(u.mag)u.mag+=ACT2_UP.atk}
      if(elite&&i===0){u.name='Elder '+u.name;u.boss=true;const eb=A(2)?2:1;ST.forEach(k=>{if(k==='hp'){u.maxhp+=6*eb;u.hp+=6*eb}else u[k]+=2*eb});u.skill=u.skill||pick(['wrath','steadfast','swiftstrike','bulwark'])}
      if(rand()<.12){const k=pick(['salve','salve','salve','claymore','steelHatchet','steelSpear','yewGreatbow','javelin','javelin','throwingAxe','throwingAxe','throwingKnives','leatherArmour','wardingCloak','travellersBoots'].filter(k=>!isWpn(k)||!wDrop&&!squadHas(k)));if(isWpn(k))wDrop=1;u.items.push({k,u:IT[k].uses,d:true})}out.push(u)});
    if(bossFight){let[bx,by]=MAPS[mk].boss||[6,3];/* the map's boss:[x,y] is where the boss stands */
      const b=B.boss,up=[10,3,3,3,2,2,3,3].map((v,i)=>v*(act-1)+(A(2)?[8,2,2,1,1,0,2,2][i]:0));
      const bsz=b.sz||2,fits=(x,y)=>cellsOf(x,y,bsz).every(([cx,cy])=>cy>=0&&cx>=0&&cy<m.map.length&&cx<m.map[0].length&&TER[m.map[cy][cx]].c<99);
      for(const[dx,dy]of[[0,0],[-1,0],[0,-1],[-1,-1],[1,0],[0,1]])if(fits(bx+dx,by+dy)){bx+=dx;by+=dy;break}
      const bu=boss({id:'boss',name:bossName,cls:b.cls,lv:6+6*(act-1),mov:b.mov!=null?b.mov:BOSS_MOV,x:bx,y:by,s:b.s.map((v,i)=>v+up[i]),items:b.items,skill:b.skill,look:b.look?clone(b.look):monLook(b.cls)});bu.sz=bsz;
      if(b.bars){bu.bars=b.bars;bu.maxhp=bu.hp=Math.ceil(bu.hp*2/b.bars)*b.bars}/* health bars: double HP split into equal bars */
      if(b.hp)bu.maxhp=bu.hp=b.hp+(A(2)?16:0);/* a set HP (the Crystal Heart: 200 at Normal, the same Ascension 2 bonus as before) */
      const bc=new Set(cellsOf(bx,by,bsz).map(c=>key(...c))),tk=new Set([...bc,...out.map(u=>key(u.x,u.y))]);
      for(const u of out)if(bc.has(key(u.x,u.y))){let t=null;for(const s of spawnTiles(m))if(!tk.has(key(s.x,s.y))){t=s;break}if(t){u.x=t.x;u.y=t.y;tk.add(key(t.x,t.y))}}
      out.push(bu)}
    if(A(5))out.forEach(u=>{if(!u.skill)u.skill=pick(['wrath','steadfast','swiftstrike','bulwark','focus'])});
    return out};
  /* reinforcements are plain data so they survive a save: {turn:[{c,lv,x,y,ifBoss}]} */
  const W={};
  /* defend maps: waves come in from a few entry points (3 of: top-left, top, top-right, left side, right side), never the cast's side */
  if(town){const H=m.map.length,Wd=m.map[0].length,mid=Math.floor(Wd/2),sy=Math.floor(H/3);
    const anchors=[[0,0],[mid,0],[Wd-1,0],[0,sy],[Wd-1,sy]];
    const zones=shuffle(anchors.map(([ax,ay])=>{const z=[];for(let y=0;y<H/2;y++)for(let x=0;x<Wd;x++)if((x<=1||x>=Wd-2||y<=1)&&Math.abs(x-ax)+Math.abs(y-ay)<=2&&TER[m.map[y][x]].c<99)z.push({x,y});return shuffle(z)}).filter(z=>z.length)).slice(0,3);
    const used=zones.map(()=>0);let e=0;
    for(let t=2;t<=turns;t++)W[t]=Array.from({length:1+(t%2)+(act>=2?1:0)},()=>{const i=(e++)%zones.length,z=zones[i];return{c:roll(),lv:Math.max(1,lvBase-1),...z[(used[i]++)%z.length]}})}
  /* summoning bosses: two more every other turn. summon:'*' picks from the region's pool */
  if(bossFight&&B.boss.summon){const sc=()=>B.boss.summon==='*'?roll():B.boss.summon;for(const t of(B.id==='heart'?[3,5,7]:[3,5,7,9])){const sx=Math.round(m.map[0].length*.6),sy=Math.round(m.map.length*.3);W[t]=[{c:sc(),lv:lvBase,x:sx,y:sy,ifBoss:1},{c:sc(),lv:lvBase,x:sx,y:sy,ifBoss:1}]};def.summonTxt=B.boss.summonTxt}
  if(Object.keys(W).length)def.waves=W;
  return def;
}

texStyle.textContent+=`.tile.boulder::before{inset:0;background:url(${boulderArt()}) 0 0/100% 100%}`;

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function bioTile2(k){return art('tiles/'+k)}
function mudArt(){return art('tiles/mud')}
texStyle.textContent+=`.t-mud{background:url(${mudArt()}) 0 0/100% 100%}`;
function boulderArt(){return art('tiles/boulder')}
