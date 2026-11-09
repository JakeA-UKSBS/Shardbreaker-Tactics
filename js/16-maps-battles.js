/* Desert, snow and cavern regions, music, battle maps, settlements and genBattle() */
/* ---- new regions: Sandstone Desert, Frostveil Reaches, Gemstone Caverns ---- */
/* fields: see the CLASSES key in 01-data.js */
Object.assign(CLS,{
  Jackal:{n:'Jackal',w:['blade'],body:'beast',mov:6},SandWorm:{n:'Sand Worm',w:['heavy'],body:'worm',mov:4,wade:true},SandstoneGolem:{n:'Sandstone Golem',w:['heavy'],body:'golem',mov:4},
  PyriteColossus:{n:'Pyrite Colossus',w:['heavy'],body:'cubes',mov:0},
  FrostWolf:{n:'Frost Wolf',w:['blade'],body:'beast',mov:6,wade:true},AgateGolem:{n:'Agate Golem',w:['heavy'],body:'golem',mov:4,wade:true},FrostSprite:{n:'Frost Sprite',w:['art'],body:'frost',mov:5,wade:true},
  AgateWyrm:{n:'Agate Wyrm',w:['art','heavy'],body:'dragon',mov:0},
  GemGolem:{n:'Gem Golem',w:['heavy'],body:'golem',mov:4},
  AmethystTurtle:{n:'Amethyst Turtle',w:['heavy','art'],body:'turtle',mov:0},
  HollowBear:{n:'Hollow Bear',w:['heavy'],body:'bear',mov:4},
  /* the Ice Troll is a placeholder humanoid brute until it gets its own art; the Yeti keeps the golem body for rules, its art is Rhi's art/bosses/yeti.png */
  IceTroll:{n:'Ice Troll',w:['heavy'],body:'vest',mov:4,wade:true,crit:5,weak:'fire'},
  Yeti:{n:'Yeti',w:['heavy'],body:'golem',mov:4,wade:true},
  Sage:{n:'Sage',w:['art'],body:'robe',mov:0}
});
IT.crystalBall={n:'Crystal Ball',t:'item',kind:'orb',uses:1,key:'crystalBall'};
IT.frostBreath={n:'Frost Breath',t:'art',kind:'talisman',el:'water',mt:9,hit:80,crit:0,r:[1,2],uses:99,mag:true,key:'frostBreath'};
IT.crystalShards={n:'Crystal Shards',t:'art',kind:'talisman',el:'earth',mt:7,hit:80,crit:10,r:[1,2],uses:99,mag:true,key:'crystalShards'};
/* fields: see the ENEMY STATS key in 01-data.js (b/g order: HP, Str, Mag, Skl, Spd, Lck, Def, Res) */
Object.assign(FOE,{
  Jackal:{b:[14,5,0,4,8,2,1,0],g:[.5,.35,0,.3,.5,.15,.1,.05],items:['fangs'],look:{}},
  SandWorm:{b:[20,6,0,4,4,1,4,1],g:[.7,.4,0,.3,.25,.1,.2,.05],items:['bite'],look:{}},
  SandstoneGolem:{b:[24,7,0,2,2,0,9,1],g:[.8,.4,0,.2,.1,0,.35,.05],items:['slam'],look:{}},
  FrostWolf:{b:[16,5,0,4,7,1,2,2],g:[.55,.35,0,.3,.45,.1,.15,.15],items:['fangs'],look:{}},
  AgateGolem:{b:[22,6,0,2,1,0,8,4],g:[.75,.4,0,.2,.05,0,.3,.2],items:['slam'],look:{}},
  IceTroll:{b:[24,8,0,3,3,0,5,1],g:[.8,.5,0,.25,.2,.05,.3,.05],items:['slam'],look:{}},
  FrostSprite:{b:[14,0,4,5,7,2,1,4],g:[.5,0,.4,.35,.45,.15,.05,.3],items:['tideSigil'],look:{}},
  GemGolem:{b:[22,7,0,3,2,0,9,3],g:[.75,.4,0,.25,.1,0,.35,.15],items:['slam'],look:{}}
});
/* GEMS: crystal colours (green, red, blue, gold, violet) */
const GEMS=['#3aa86a','#c8323a','#3a5ac8','#c8a83a','#9a5ac8'];
Object.assign(MONLOOK,{
  Jackal:()=>({fur:pick(['#c9a060','#b08850','#d8b878']),eye:'#ffd23f'}),
  SandWorm:()=>({body:pick(['#c98a6a','#b8785a','#d8a07a'])}),
  SandstoneGolem:()=>({body:pick(['#c9945a','#b8824a','#d8a46a']),eye:'#ffd23f'}),
  FrostWolf:()=>({crysSmall:true,fur:pick(['#e8eef8','#c8d8ec','#b0c4e0']),eye:'#7fe3ff'}),
  AgateGolem:()=>({body:pick(['#5a8ac8','#4a7ab8','#7aa8d8']),eye:'#e8f4ff'}),
  IceTroll:()=>({style:'bald',skin:pick(['#9ab8d0','#8aa8c4','#a8c8dc']),cloth:'#4a5a6a',eye:'#7fe3ff'}),
  FrostSprite:()=>({crys:false,body:pick(['#9fd8ff','#7fc8ff','#b8e4ff'])}),
  GemGolem:()=>({body:pick(GEMS),eye:'#ffffff'})
});
/* fields: see the TERRAIN key in 01-data.js */
Object.assign(TER,{
  'D':{n:'Deep Mud',k:'mud',c:99,av:0,df:0},/* the swamp's impassable ground: its maps' water (w) becomes this */
  'k':{n:'Sandstone Rocks',k:'sandstone',c:99,av:0,df:0},'^':{n:'Boulders',k:'boulder',c:99,av:0,df:0},'z':{n:'Quicksand',k:'quicksand',c:1,av:0,df:0,slow:true},
  'o':{n:'Snow',k:'snow',c:1,av:0,df:0},'j':{n:'Deep Snow',k:'deepsnow',c:1,av:0,df:0,slow:true},'a':{n:'Blue Agate',k:'agate',c:2,av:10,df:2},'i':{n:'Frozen Lake',k:'ice',c:1,av:-10,df:0},
  'c':{n:'Cave Floor',k:'cave',c:1,av:0,df:0},'x':{n:'Iridescent Rock',k:'cavewall',c:99,av:0,df:0},'g':{n:'Malachite',k:'malachite',c:2,av:10,df:2},
  'e':{n:'Emerald Cluster',k:'emerald',c:2,av:10,df:2},'u':{n:'Ruby Cluster',k:'ruby',c:2,av:10,df:2},'p':{n:'Sapphire Cluster',k:'sapphire',c:2,av:10,df:2},
  /* the Heart of the Blight: scorched ground with glowing gem veins, blighted gem clusters and crystal spires */
  'S':{n:'Scorched Ground',k:'scorch',c:1,av:0,df:0},'G':{n:'Blighted Emerald',k:'bgem-g',c:2,av:10,df:2},'U':{n:'Blighted Ruby',k:'bgem-r',c:2,av:10,df:2},
  'P':{n:'Blighted Sapphire',k:'bgem-b',c:2,av:10,df:2},'Y':{n:'Blighted Amethyst',k:'bgem-v',c:2,av:10,df:2},'K':{n:'Crystal Spire',k:'spire',c:99,av:0,df:0}
});
texStyle.textContent+=['sandstone','quicksand','snow','deepsnow','agate','ice','cave','cavewall','emerald','ruby','sapphire','scorch','bgem-g','bgem-r','bgem-b','bgem-v','spire'].map(k=>`.t-${k}{background:url(${bioTile2(k)}) 0 0/100% 100%}`).join('');
/* fields: see the REGIONS key in 15-regions-monsters.js */
Object.assign(BIOMES,{
  desert:{n:'Sandstone Desert',bg:'#4a3a24',town:['n','k'],townN:'Oasis Town',d:'Dunes and sandstone ruins under a white sun. Jackals run in packs, and the quicksand swallows the careless.',
    tip:['desert','Quicksand','A unit that starts its turn in quicksand has 1 less Move. Sandstone rocks block the way.'],
    maps:['dunes','oasis','canyon'],bossMap:'sunTemple',pool:[['Jackal',4],['SandWorm',3,2],['SandstoneGolem',2,4]],elitePool:[['SandstoneGolem',3],['Jackal',2],['SandWorm',2]],
    boss:{name:'The Pyrite Colossus',cls:'PyriteColossus',s:[42,13,0,5,3,2,12,7],items:['slam'],skill:'steadfast',look:{body:'#c9a83a',eye:'#fff2b0',crysAt:[{core:[14,19],col:'#3ad87a'}]}}},
  snow:{n:'Frostveil Reaches',bg:'#2a3a4e',town:['o','a'],townN:'Hill Village',d:'Snowfields studded with blue agate. Frost wolves hunt the drifts, and the golems are made of the agate itself.',
    tip:['snow','Deep snow','A unit that starts its turn in deep snow has 1 less Move (snow creatures ignore it). Frozen lakes give −10 Avoid; blue agate gives +10 Avoid and +2 Def.'],
    maps:['tundra','frozenLake','agateField'],bossMap:'agateSpire',pool:[['FrostWolf',4],['FrostSprite',3,2],['AgateGolem',2,4],['IceTroll',2,5]],elitePool:[['AgateGolem',3],['IceTroll',2],['FrostWolf',2],['FrostSprite',2]],
    boss:{name:'The Yeti',cls:'Yeti',mov:4,s:[42,13,0,6,5,2,9,8],items:['slam'],skill:'wrath',look:{body:'#e8eef8',eye:'#7fe3ff'}}},
  cavern:{n:'Gemstone Caverns',bg:'#2a2436',town:['c','e'],townN:'Miners’ Camp',d:'Caves glittering with emerald, ruby and sapphire, and golems made of the gems themselves.',
    tip:['cavern','Gem clusters','Gem clusters give +10 Avoid and +2 Def. The cave walls can’t be crossed.'],
    maps:['geode','mineshaft','glitter'],bossMap:'amethystHollow',pool:[['GemGolem',1]],elitePool:[['GemGolem',1]],
    boss:{name:'Amethyra, the Amethyst Turtle',cls:'AmethystTurtle',s:[46,11,8,5,2,3,14,11],items:['slam','crystalShards'],skill:'steadfast',look:{body:'#6a7a5a',shell:'#4a3a5a',gem:'#b07ae8',crys:false}}}
});
Object.assign(BIOMES.swamp,{town:['n','v'],townN:'Stilt Village'});Object.assign(BIOMES.forest,{town:['.','f'],townN:'Woodcutters’ Hamlet'});Object.assign(BIOMES.mountain,{town:['b','m'],townN:'Smelters’ Camp'});
for(const k in BIOMES)BIOMES[k].id=k;
/* region name with its article: 'the Cursed Woodland', 'The Labyrinth', 'Sobek’s Mire' */
const theN=B=>B.noThe||/^The /.test(B.n)?B.n:'the '+B.n,TheN=B=>{const t=theN(B);return t[0].toUpperCase()+t.slice(1)};
/* acts 1 and 2 are drawn from the regions; act 3 is always the Heart of the Blight */
const ACTS=3;
const MUSIC={title:'music/title.mp3',tavern:'music/tavern.mp3'};for(const k in BIOMES)MUSIC[k]=`music/${k}.mp3`;
let bgm=null,bgmKey='';
/* Background music: drop mp3s into music/ (title.mp3, swamp.mp3, forest.mp3, mountain.mp3, desert.mp3, snow.mp3, cavern.mp3, heart.mp3). Missing files are skipped. */
/* ambience loops quietly under a region's battles (on top of its music) */
const AMBIENCE={swamp:'sfx/swamp-ambience.mp3'};let amb=null,ambKey='';
function ambience(k){k=k||'';if(k===ambKey&&amb)return;ambKey=k;try{if(amb)amb.pause();amb=null;if(!settings.sound||!AMBIENCE[k])return;amb=new Audio(AMBIENCE[k]);amb.loop=true;amb.volume=.35;amb.play().catch(()=>{})}catch(_){}}
function music(k){if(k===bgmKey&&bgm)return;bgmKey=k;try{if(bgm)bgm.pause();bgm=null;if(!settings.sound||!MUSIC[k])return;bgm=new Audio(MUSIC[k]);bgm.loop=true;bgm.volume=.45;bgm.play().catch(()=>{})}catch(_){}}

/* BATTLE MAPS: n = name, map = rows of terrain letters (top row first, see TER for each letter), start = [x, y] tiles your units deploy on. */
const MAPS={
  /* Swamp */
  flats:{n:'Mangrove Flats',map:["sssnnssssv","vssnnsswws","ssssssswws","ssvsssssss","nssssvsssn","nssssssssn","ssswwsssss","vsswwssvss","sssssnnsss","ssssnnnsss"],start:[[4,9],[5,9],[6,9],[5,8],[6,8],[3,9]]},
  road:{n:'Sunken Road',map:["wssnnnnnss","ssvnsssnvs","ssnnsvsnns","ssnsssssns","vsnssssssn","ssnnsssnns","ssvnnnnnvs","wsssnnnsss","wwsssnsssw","sssssnssss"],start:[[5,9],[4,9],[6,9],[5,8],[4,7],[6,7]]},
  bog:{n:'Bog Pools',map:["vsswwwwssv","ssssnnssss","wsssnnssss","wssvssvssw","ssssssssss","nnsswwssnn","nnsswwssnn","svssssssvs","sssnnnnsss","ssssnnssss"],start:[[4,9],[5,9],[3,8],[4,8],[5,8],[6,8]]},
  lair:{n:'Krondis’s Lair',map:["wssnnnnssw","sssnnnnnss","ssvssssvss","ssssssssss","vsswwwwssv","ssswwwwsss","snnssssnns","snnssssnns","sssnnnnsss","ssssnnssss"],start:[[4,9],[5,9],[3,8],[4,8],[5,8],[6,8]],boss:[5,1]},
  /* Cursed Woodland */
  woodland:{n:'Cursed Woodland',map:["...y..f...","^f....y..f","y..f..^^.y","..f..f....","^....y..f.",".y.f.....y","f^.....f..","..y..f..y.","f.........",".........."],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  brook:{n:'Black Brook',map:[".f....y...","y..ff....f","...f..y...","w=wwwwww=w","...y..f...","f.....f..y","..f......f","y....y....","...f....f.",".........."],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  clearing:{n:'Hunter’s Clearing',map:["f........f",".^f....f..",".^.^..^...","f.........","....y.....",".....^^..f","..f....f..","..........","..........",".........."],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  heart:{n:'The Hollow Heart',map:["f..f...f.f","^^y.....y.","....f.f...","..y.....y.","f^..y.y..f","..f....^f.","y.........","...f...f..","..........",".........."],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]],boss:[5,0]},
  /* Volcanic Isle */
  fields:{n:'Magma Fields',map:["bbbllbbbbR","mbbbllbbbb","bbbbbllbmb","bbbbbblbbb","bmbbbbbbbb","bbllbbbmbb","bbblllbbbb","mbbbbbbbbm","bbbbbbbbbb","bbbbbbbbbb"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  caldera:{n:'Caldera Pass',map:["bbmbllbmbb","bbbllllbbb","mbbllllbbm","bbbbllbbbb","bbbbbbbbbb","lbbmbbmbbl","bbbbbbbbbb","bmbbbbbbmb","bbbbbbbbbb","bbbbbbbbbb"],start:[[4,9],[5,9],[3,9],[6,9],[3,8],[5,8]]},
  ridge:{n:'Rockslide Ridge',map:["bbbbRbbbbl","mRbbbbbbbl","bbRbbbblll","bbRRbbRlbb","bbbbbbbbll","llbbmbbbbl","blbbbbbmbb","llbRbbbbbb","lbbbbbbbbb","lbbbbbbbbb"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  crater:{n:'Dragon’s Crater',map:["llbbbbbbll","lbbbbbbbbl","bbmbbbbmbb","bbbbllbbbb","bbbllllbbb","bbbbllbbbb","bmbbbbbbmb","bbbbbbbbbb","bbbbbbbbbb","bbbbbbbbbb"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]],boss:[5,0]},
};
Object.assign(MAPS,{
  /* Act 3: the Heart of the Blight */
  heartHall:{n:'Hall of Veins',map:["SSKSSSSKSS","SYSSUSSGSS","SSSSSSSSPS","KSSGSSUSSK","SSSSKKSSSS","SPSSSSSSYS","SSSUSSGSSS","SSSSSSSSSS","SYSSSSSSUS","SSSSSSSSSS"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  heartCore:{n:'Heart Chamber',map:["KSSSSSSSSK","SSYSSSSUSS","SSSSSSSSSS","SGSSSSSSPS","SSSSSSSSSS","KSUSSSSYSK","SSSSGSSSSS","SSPSSSSUSS","SSSSSSSSSS","SSSSSSSSSS","SSSSSSSSSS"],start:[[4,10],[5,10],[3,10],[6,10],[4,9],[5,9]],boss:[4,1]}
});
Object.assign(MAPS,{
  dunes:{n:"Shifting Dunes",map:["knffzznnnw","knnnzznwwk","wwzznnnnnn","nwwwnnnnnn","nzzwwnffzz","nnnnnnnfzz","nnnnnnnnzn","nnnnnnknzn","knnnnnnnnn","knnnnnnnnn"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  oasis:{n:"Oasis",map:["nnnnwwnnnn","nnnwwwwnnn","knnnwwnnnk","nnnnnnnnnn","zznnknnzzn","zznnnnnzzn","nnnnnnnnnn","nknnnnnnkn","nnnnnnnnnn","nnnnnnnnnn"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  canyon:{n:"Sandstone Canyon",map:["nnnnzznnnn","nnknnnnknn","nnknnnnknn","nnnnnnnnnn","zznnkknnzz","nnnnkknnnn","nknnnnnnkn","nnnnnnnnnn","nnnnnnnnnn","nnnnnnnnnn"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  sunTemple:{n:"Temple of the Sun",map:["knnnnnnnnk","nnnnnnnnnn","nknnnnnnkn","nnnnzznnnn","nnnnzznnnn","knnnnnnnnk","nnnknnknnn","nnnnnnnnnn","nnnnnnnnnn","nnnnnnnnnn"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]],boss:[5,0]},
  tundra:{n:"Open Tundra",map:["ojjooooojj","ojjooaoooo","ooo^^ooooo","aoooojjooo","oo^ojjjooo","oooooooooo","ojjooa^oo^","ooooooojjo","oooooooooo","oooooooooo"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  frozenLake:{n:"Frozen Lake",map:["oooiiiiioo","ooiiiiiii^","aoiiiaiii^","ooiiiiiiio","oooiiiiioo","ojjoo^ojjo","^jjoaoojjo","oooooooooo","oooooooooo","oooooooooo"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  agateField:{n:"Agate Field",map:["ooooojjooo","oaaoo^^oaa","o^ooaaoooo","j^oo^ooooj","ooao^oooao","oooojjoooo","ao^oooooao","oooooooooo","oooooooooo","oooooooooo"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  agateSpire:{n:"Agate Spire",map:["aooooooooa","oooo^ooooo","^jjoooojjo","ooooaaoo^o","jooooooooo","oaoooooaoo","oooooooooo","ojjoooojjo","oooooooooo","oooooooooo"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]],boss:[4,0]},
  geode:{n:"Geode Chamber",map:["ccceccuccc","cccccccccc","cpcxxxxcec","cccccccccc","xcccccccxx","cuccccccpc","ccccxxcccc","cecccccccu","cccccccccc","cccccccccc"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  mineshaft:{n:"Old Mineshaft",map:["ccxcccxccc","ccxcecxcce","cccccccccc","xxcxxxxcxx","ccccuccccc","cecccccpcc","xccxxxxccx","cccccccccu","cccccccccc","cccccccccc"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  glitter:{n:"Glittering Hall",map:["ccecccucee","cccccccccc","cuccpccecp","ccccccccc^","eccccccccc","^ccp^ccucc","^ccccc^cce","cucccccccc","cccccccccc","cccccccccc"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]},
  amethystHollow:{n:"Amethyst Hollow",map:["xxcccccccx","xccccccuuc","pcccccccue","ppccxxccee","cccccccccc","xucccccccx","xuucccccpp","cccccccccc","cccccccccx","xxccccccxx"],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]],boss:[4,0]}
});

/* hand-made height maps (greybox): one digit per tile, 0 = ground. Maps without h get hills and rubble at 1. */
MAPS.woodland.h=["5443210011", "4443210012", "4440000012", "0000000001", "0000000000", "0011000000", "0000000210", "0002000110", "0022000000", "0010000000"];
MAPS.brook.h=["4433333344", "3333333333", "3333333333", "0100000010", "1111111111", "1111111111", "1122111111", "1122110000", "0000000000", "0000000000"];
MAPS.clearing.h=["1111111111", "1111222111", "1112222211", "0112332110", "0112332100", "0011221000", "0001110000", "0000000000", "0000000000", "0000000000"];
MAPS.heart.h=["2213333122", "2213333122", "1112222111", "0001111000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000"];
/* Sandstone Desert */
MAPS.dunes.h=["1110001111", "1111001111", "1122000111", "1111000114", "2000000023", "1100000023", "0001100111", "1112222111", "2223333222", "2223333222"];
MAPS.oasis.h=["2210000122", "2100000012", "2100000012", "1100000011", "0000000001", "0000000001", "1000000001", "1100000011", "0000000000", "0000000000"];
MAPS.canyon.h=["3321001233", "3331001333", "3331001333", "3321001233", "0010000100", "1000000001", "1100000011", "0000000000", "0000000000", "0000000000"];
MAPS.sunTemple.h=["1234444321", "1233443321", "1223333221", "0112002110", "0011001100", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000"];
/* Frostveil Reaches */
MAPS.tundra.h=["2221112222", "2210001122", "1100000111", "1000000011", "0000000000", "0000000000", "0001110000", "0011221100", "1122332211", "1123333211"];
MAPS.frozenLake.h=["2210000012", "2100000001", "2100010001", "1100000001", "1110000011", "1111111111", "1111111111", "0000000000", "0000000000", "0000000000"];
MAPS.agateField.h=["3333333333", "3443333344", "2322332222", "1211211111", "1121111121", "0000110000", "1000000010", "0000000000", "0000000000", "0000000000"];
MAPS.agateSpire.h=["3344444433", "2333433332", "2222332222", "1112222111", "0011111100", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000"];
/* Gemstone Caverns */
MAPS.geode.h=["3333333333", "3222222223", "3211111123", "2100000012", "2100000012", "2100000012", "2110000112", "2221111222", "2222222222", "2222222222"];
MAPS.mineshaft.h=["2222222222", "2222222222", "2222222222", "2222222222", "1111111111", "1111111111", "1111111111", "0000000000", "0000000000", "0000000000"];
MAPS.glitter.h=["1111111111", "1111111111", "1112222111", "1122332211", "1123333211", "1122332211", "0011221100", "0000110000", "0000000000", "0000000000"];
MAPS.amethystHollow.h=["3334444335", "2333222234", "2333222222", "2212222211", "0012211100", "0002220000", "0011000000", "0010000000", "0011000001", "0000000001"];
/* Sobek’s Mire */
MAPS.flats.h=["0001100001", "1001100000", "0000000000", "0010000000", "1000010001", "1000000001", "0000000000", "1000000100", "0000122100", "0001222100"];
MAPS.road.h=["0002222200", "0012000210", "0011010110", "0010000010", "1010000001", "0011000110", "0011111110", "0000111000", "0000010000", "0000010000"];
MAPS.bog.h=["1000000001", "0000110000", "0000110000", "0001001000", "0000000000", "1100000011", "1100000011", "0100000010", "0001111000", "0000110000"];
MAPS.lair.h=["0001222100", "0002333200", "0011111100", "0000000000", "0000000000", "0000000000", "0110000110", "0110000110", "0001111000", "0000110000"];
/* Volcanic Isle */
MAPS.fields.h=["2220022333", "2221002223", "1111100222", "1111110111", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000"];
MAPS.caldera.h=["3333003333", "3330000333", "2220000222", "2222002222", "1111111111", "0111111110", "0000000000", "0000000000", "0000000000", "0000000000"];
MAPS.ridge.h=["1111111111", "1111111111", "0020000000", "0022000011", "0000000001", "0111111121", "1122222211", "2233333322", "3334444333", "3344444433"];
MAPS.crater.h=["0034444300", "0233333320", "1222222221", "1111001111", "1110000111", "1111001111", "0111111110", "0000000000", "0000000000", "0000000000"];
/* settlements for Defend fights: one hand-made map per region, in its own terrain. Enemies arrive along the top two
   rows; tents (A) and the shrine (F) heal and give cover in the middle; you start along the bottom. */
const TOWNS={
  swamp:["ssssnnssss","svssnnssvs","ssnnnnnnss","wsnvnnvnsw","wsnnnnnnsw","ssnnnnnnss","snvnnnnvns","ssnnnnnnss","ssnnnnnnss","sssnnnnsss"],
  desert:["nnnnnnnnnn","nknnnnnnkn","nnnnzznnnn","knnnnnnnnk","nnnnwwnnnn","nnnnwwnnnn","knnnnnnnnk","nnnnnnnnnn","nnnnnnnnnn","nnnnnnnnnn"],
  forest:["..........",".f......f.","...^..^...","f..y..y..f","..........",".f......f.","^........^","..y....y..","..........",".........."],
  mountain:["bbbbbbbbbb","bmbbbbbbmb","bbbRbbRbbb","lbbbbbbbbl","bbbbmmbbbb","bbbbbbbbbb","RbbbbbbbbR","bbmbbbbmbb","bbbbbbbbbb","bbbbbbbbbb"],
  snow:["oooooooooo","oaoojjooao","ooo^oo^ooo","jooooooooj","ooooiioooo","oooooooooo","^oooooooo^","ooaooooaoo","oooooooooo","oooooooooo"],
  cavern:["cccccccccc","cecccccccu","cccxccxccc","pccccccccp","cccceccccc","cccccccccc","xccccccccx","ccuccccecc","cccccccccc","cccccccccc"]
};
for(const k in TOWNS)if(BIOMES[k])MAPS['town_'+k]={n:BIOMES[k].townN,map:TOWNS[k],start:[[4,9],[5,9],[3,9],[6,9],[4,8],[5,8]]};
/* settlement height maps (made from the old generated ones, so they look the same; edit them with tools/map-editor.html) */
MAPS.town_swamp.h=["0000110000", "0100110010", "0011111100", "0011111100", "0011011100", "0011111100", "0111011110", "0011111100", "0000000000", "0000000000"];
MAPS.town_desert.h=["1233222122", "1332111133", "2221001123", "2222111123", "2221001222", "2221001222", "2210011222", "1100011111", "0000000000", "0000000000"];
MAPS.town_forest.h=["2222222222", "2222222222", "2222222112", "2222222112", "2222221111", "2211111111", "2111111111", "1111111101", "0000000000", "0000000000"];
MAPS.town_mountain.h=["3443234443", "2333333432", "1233323321", "0122222210", "1211112221", "2221112222", "2221112222", "1111111111", "0000000000", "0000000000"];
MAPS.town_snow.h=["4444444433", "3334334333", "3334224333", "2232112333", "2221001232", "1122112232", "1111112222", "0011111111", "0000000000", "0000000000"];
MAPS.town_cavern.h=["2222222222", "2222222222", "1112222112", "1112222111", "1111222111", "1111111111", "1111111111", "1111110000", "0000000000", "0000000000"];
/* ADJ: adjectives for generated names */
const ADJ=['Howling','Silent','Broken','Ashen','Bitter','Hollow','Moonlit','Drowned'];
function spawnTiles(m){
  const out=[];for(let y=0;y<m.map.length;y++)for(let x=0;x<m.map[0].length;x++){const t=TER[m.map[y][x]];if(t.c>=99)continue;const d=Math.min(...m.start.map(([sx,sy])=>Math.abs(sx-x)+Math.abs(sy-y)));if(d>=4)out.push({x,y,d})}
  return shuffle(out);
}
function actBiome(){const a=run&&run.act||1;if(a>=3)return BIOMES.heart;
  return BIOMES[run&&run.biomes&&run.biomes[a-1]]||BIOMES.forest}
/* bosses lumber: they move, but only a couple of tiles a turn */
/* BOSS_MOV: max tiles a boss moves per turn */
const BOSS_MOV=2;
/* ROCK_MAX: most rocks left on a battle map (the rest are cleared, see genBattle); two boulders side by side count as one */
const ROCK_MAX=3;
function genBattle(n,kind){
  const act=run&&run.act||1,B=actBiome(),bossFight=kind==='boss',elite=kind==='elite',town=!bossFight&&!elite&&MAPS['town_'+B.id]&&(run&&run.n||1)>=2&&rand()<.25;
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
  const bossName=B.boss.name,turns=town?ri(5,7):0;
  const goal=bossFight?'boss':town?'defend':'rout';
  const def={biome:B.id,title:bossFight?(B.boss&&B.boss.name||'Boss Battle'):town?'Defend the Settlement':elite?'Elite Battle':'Battle',/* no map names in titles; bosses go by their own name */goal,turns,map:m.map,h:m.h,start:m.start,gifts:{},
    intro:bossFight&&B.boss.intro?B.boss.intro:bossFight?`${bossName} waits for you in the ${m.n}. Defeat it to clear ${theN(B)}.`:town?`Crystallised beasts are closing on the ${m.n.toLowerCase()}. Hold them off for ${turns} turns.`:elite?`A pack led by something old and strong holds the ${m.n.toLowerCase()}. Rout them all.`:`${count} monsters wait in the ${m.n.toLowerCase()}. Rout them.`};
  /* drops: 12% of enemies carry something, at most one weapon a battle, and never a weapon the squad already has */
  def.foes=()=>{const tiles=spawnTiles(m),out=[];let wDrop=0;
    list.forEach((c,i)=>{const lv=Math.max(1,lvBase+(rand()<.3?1:0)-(c==='Wolf'?1:0)+(elite?2:0)),u=mkMon(c,lv),t=tiles[i%tiles.length];u.x=t.x;u.y=t.y;
      if(elite&&i===0){u.name='Elder '+u.name;u.boss=true;const eb=A(2)?2:1;ST.forEach(k=>{if(k==='hp'){u.maxhp+=6*eb;u.hp+=6*eb}else u[k]+=2*eb});u.skill=u.skill||pick(['wrath','steadfast','swiftstrike','bulwark'])}
      if(rand()<.12){const k=pick(['salve','salve','salve','knightlySword','cleaver','steelSpear','ironwoodBow','javelin','throwingAxe','throwingKnives','leatherArmour','wardingCloak','travellersBoots'].filter(k=>!isWpn(k)||!wDrop&&!squadHas(k)));if(isWpn(k))wDrop=1;u.items.push({k,u:IT[k].uses,d:true})}out.push(u)});
    if(bossFight){let[bx,by]=MAPS[mk].boss||[6,3];/* the map's boss:[x,y] is where the boss stands */
      const b=B.boss,up=[10,3,3,3,2,2,3,3].map((v,i)=>v*(act-1)+(A(2)?[8,2,2,1,1,0,2,2][i]:0));
      const bsz=b.sz||2,fits=(x,y)=>cellsOf(x,y,bsz).every(([cx,cy])=>cy>=0&&cx>=0&&cy<m.map.length&&cx<m.map[0].length&&TER[m.map[cy][cx]].c<99);
      for(const[dx,dy]of[[0,0],[-1,0],[0,-1],[-1,-1],[1,0],[0,1]])if(fits(bx+dx,by+dy)){bx+=dx;by+=dy;break}
      const bu=boss({id:'boss',name:bossName,cls:b.cls,lv:6+6*(act-1),mov:b.mov!=null?b.mov:BOSS_MOV,x:bx,y:by,s:b.s.map((v,i)=>v+up[i]),items:b.items,skill:b.skill,look:b.look?clone(b.look):monLook(b.cls)});bu.sz=bsz;
      if(b.bars){bu.bars=b.bars;bu.maxhp=bu.hp=Math.ceil(bu.hp*2/b.bars)*b.bars}/* health bars: double HP split into equal bars */
      const bc=new Set(cellsOf(bx,by,bsz).map(c=>key(...c))),tk=new Set([...bc,...out.map(u=>key(u.x,u.y))]);
      for(const u of out)if(bc.has(key(u.x,u.y))){let t=null;for(const s of spawnTiles(m))if(!tk.has(key(s.x,s.y))){t=s;break}if(t){u.x=t.x;u.y=t.y;tk.add(key(t.x,t.y))}}
      out.push(bu)}
    if(A(5))out.forEach(u=>{if(!u.skill)u.skill=pick(['wrath','steadfast','swiftstrike','bulwark','focus'])});
    return out};
  /* reinforcements are plain data so they survive a save: {turn:[{c,lv,x,y,ifBoss}]} */
  const W={};
  if(town){const top=[];m.map.forEach((r,y)=>{if(y<=1)[...r].forEach((ch,x)=>{if(TER[ch].c<99)top.push({x,y})})});shuffle(top);let e=0;for(let t=2;t<=turns;t++)W[t]=Array.from({length:1+(t%2)+(act>=2?1:0)},()=>({c:roll(),lv:Math.max(1,lvBase-1),...top[(e++)%top.length]}))}
  /* summoning bosses: two more every other turn. summon:'*' picks from the region's pool */
  if(bossFight&&B.boss.summon){const sc=()=>B.boss.summon==='*'?roll():B.boss.summon;for(const t of(B.id==='heart'?[3,5,7]:[3,5,7,9]))W[t]=[{c:sc(),lv:lvBase,x:6,y:3,ifBoss:1},{c:sc(),lv:lvBase,x:6,y:3,ifBoss:1}];def.summonTxt=B.boss.summonTxt}
  if(Object.keys(W).length)def.waves=W;
  return def;
}

texStyle.textContent+=`.tile.boulder::before{inset:0;background:url(${boulderArt()}) 0 0/100% 100%}`;

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function bioTile2(k){return art('tiles/'+k)}
function mudArt(){return art('tiles/mud')}
texStyle.textContent+=`.t-mud{background:url(${mudArt()}) 0 0/100% 100%}`;
function boulderArt(){return art('tiles/boulder')}
