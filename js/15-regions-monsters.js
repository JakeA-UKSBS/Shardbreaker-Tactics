/* Region terrain tiles, region monsters and the BIOMES table */
/* ================= REGIONS =================
   Each act takes place in one region (picked from the run's seed). A region sets its maps, monster pool, boss,
   terrain rule and music. Map letters for region terrain: , mycelium · q giant toadstool · ; grave soil · t tombstone
   · s ankle-deep water (−1 Move next turn) · n sand · v mangrove roots · y cursed thicket · b basalt · l magma. */
Object.assign(TER,{
  ',':{n:'Mycelium',k:'myc',c:1,av:0,df:0},'q':{n:'Giant Toadstool',k:'shroom',c:2,av:20,df:1},
  ';':{n:'Grave Soil',k:'grave',c:1,av:0,df:0},'t':{n:'Tombstone',k:'tomb',c:2,av:15,df:2},
  's':{n:'Ankle-deep Water',k:'shallow',c:1,av:0,df:0,slow:true},'n':{n:'Sand',k:'sand',c:1,av:0,df:0},'v':{n:'Mangrove Roots',k:'mangrove',c:2,av:20,df:1,slow:true},
  'y':{n:'Cursed Thicket',k:'curse',c:2,av:25,df:1},'b':{n:'Basalt',k:'basalt',c:1,av:0,df:0},'l':{n:'Magma',k:'lava',c:99,av:0,df:0}
});
function bioTile(k){
  const p=Px(16,16),o=Px(16,16),dots=(c,pts)=>pts.forEach(([x,y])=>p.set(x,y,c)),S=[[2,3],[9,2],[13,6],[4,12],[11,13],[7,8],[14,11]];
  if(k==='myc'||k==='shroom'){p.rect(0,0,16,16,'#4e4058');p.line(0,5,7,9,'#665576');p.line(7,9,16,6,'#665576');p.line(4,16,9,9,'#665576');p.line(11,0,12,7,'#5c4d6a');dots('#c9b8ff',[[3,3],[12,12],[8,13],[14,2]])}
  if(k==='shroom'){o.rect(6,9,4,6,'#efe6cf');o.rect(6,9,1,6,'#cfc4aa');o.ell(8,7,7,4.5,'#d8483a',(x,y)=>y<=8);o.rect(2,8,12,1,'#a8302a');o.ell(5,5,1.3,1,'#fff');o.ell(10,4,1.5,1.1,'#fff');o.ell(12,7,1,1,'#fff')}
  if(k==='grave'||k==='tomb'){p.rect(0,0,16,16,'#34303c');S.forEach(([x,y])=>{p.set(x,y,'#2a2630');p.set(x+1,y-1,'#47434f')})}
  if(k==='tomb'){o.ell(8,5,4,3,'#8a8794',(x,y)=>y<=5);o.rect(4,5,8,9,'#8a8794');o.rect(4,13,8,2,'#5a5762');o.rect(7,6,2,5,'#5a5762');o.rect(5,7,6,2,'#5a5762');o.rect(4,5,1,8,'#6f6c78')}
  if(k==='shallow'||k==='mangrove'){p.rect(0,0,16,16,'#3f5a4a');[[1,3],[8,6],[3,11],[11,12]].forEach(([x,y])=>p.line(x,y,x+3,y,'#5f7f6a'));p.set(13,3,'#7a9a6a');p.line(6,14,6,11,'#6a8a4a')}
  if(k==='mangrove'){o.line(2,15,5,8,'#5a3a24',2);o.line(13,15,10,8,'#5a3a24',2);o.line(7,15,7,8,'#4a2e1c',2);o.ell(8,5,7,4.5,'#2f5a32');o.ell(5,4,3,2,'#3f7a42');o.ell(11,5,3,2,'#3f7a42')}
  if(k==='sand'){p.rect(0,0,16,16,'#b8a070');dots('#a08858',S);dots('#d0bc8c',[[3,2],[10,1],[14,5],[5,11],[12,12]])}
  if(k==='curse'){p.rect(0,0,16,16,'#3e4436');o.line(1,14,6,3,'#3a2a3a',2);o.line(14,14,9,2,'#3a2a3a',2);o.line(4,9,12,5,'#4a2e4a');o.line(3,6,13,11,'#4a2e4a');o.set(6,3,'#c77dff');o.set(9,2,'#c77dff');o.set(12,5,'#8a3a6a')}
  if(k==='basalt'){p.rect(0,0,16,16,'#3a3034');p.line(2,4,6,7,'#2a2226');p.line(6,7,5,12,'#2a2226');p.line(10,2,13,9,'#2a2226');p.set(6,8,'#ff7a2a');p.set(12,6,'#c84a1a')}
  if(k==='lava'){p.rect(0,0,16,16,'#c8401a');p.ell(5,5,3,2,'#ff9a2e');p.ell(11,11,3.5,2.5,'#ff9a2e');p.ell(5,5,1.2,.8,'#ffe14a');p.ell(11,11,1.5,1,'#ffe14a');p.line(0,9,7,9,'#7a2010');p.line(9,2,15,4,'#7a2010')}
  o.outline('#1a1414');for(let i=0;i<256;i++)if(o.g[i])p.g[i]=o.g[i];
  return p.url();
}
texStyle.textContent+=['myc','shroom','grave','tomb','shallow','mangrove','sand','curse','basalt','lava'].map(k=>`.t-${k}{background:url(${bioTile(k)}) 0 0/100% 100%}`).join('');

/* ---- monsters ---- */
IT.spores={n:'Spore Puff',t:'art',kind:'talisman',el:'nature',mt:3,hit:90,crit:0,r:[1,1],uses:99,mag:true,key:'spores'};
IT.sporeCloud={n:'Spore Cloud',t:'art',kind:'talisman',el:'nature',mt:5,hit:85,crit:0,r:[1,2],uses:99,mag:true,key:'sporeCloud'};
IT.slam={n:'Slam',t:'heavy',kind:'claw',mt:7,hit:75,crit:0,r:[1,1],uses:99,key:'slam'};
IT.bite={n:'Bite',t:'heavy',kind:'claw',mt:9,hit:75,crit:10,r:[1,1],uses:99,key:'bite'};
IT.antlers={n:'Antlers',t:'pole',kind:'claw',mt:6,hit:85,crit:5,r:[1,1],uses:99,key:'antlers'};
IT.mallet={n:'Mallet',t:'heavy',kind:'claw',mt:6,hit:85,crit:0,r:[1,1],uses:99,key:'mallet'};
IT.hooves={n:'Hooves',t:'blade',kind:'claw',mt:5,hit:90,crit:0,r:[1,1],uses:99,key:'hooves'};
IT.breath={n:'Magma Breath',t:'art',kind:'talisman',el:'fire',mt:9,hit:80,crit:0,r:[1,2],uses:99,mag:true,key:'breath'};
SKILLS.venom={n:'Venom',cost:15,d:'On a hit, poisons the target: it loses 3 HP at the start of each of its turns for 3 turns (never below 1 HP).'};
IT.scroll_venom={n:'Venom Scroll',t:'scroll',kind:'scroll',skill:'venom',uses:1,key:'scroll_venom'};
SKILLS.spore={n:'Poison Spores',cost:15,d:'On a hit, poisons the target: it loses 3 HP at the start of each of its turns for 3 turns (never below 1 HP).'};
IT.scroll_spore={n:'Poison Spores Scroll',t:'scroll',kind:'scroll',skill:'spore',uses:1,key:'scroll_spore'};
Object.assign(CLS,{
  Hawk:{n:'Hawk',w:['blade'],body:'hawk',mov:7,fly:true},
  Gnome:{n:'Gnome',w:['heavy'],body:'gnome',mov:5},Snake:{n:'Snake',w:['blade'],body:'snake',mov:5,wade:true},
  Sporeling:{n:'Sporeling',w:['art'],body:'shroom',mov:5},Myconid:{n:'Myconid',w:['art'],body:'shroom',mov:4},MorelKing:{n:'Mushroom King',w:['art'],body:'shroom',mov:0},
  Skeleton:{n:'Skeleton',w:['blade','bow'],body:'vest',mov:5},Ghost:{n:'Ghost',w:['art'],body:'ghost',mov:5,phase:true},
  MudMonster:{n:'Mud Monster',w:['heavy'],body:'mud',mov:4,wade:true},Krondis:{n:'Alligator',w:['heavy'],body:'gator',mov:4,wade:true},
  CursedStag:{n:'Cursed Stag',w:['pole'],body:'beast',mov:6},HollowStag:{n:'Hollow Stag',w:['pole'],body:'beast',mov:4},
  Boulder:{n:'Boulder Golem',w:['heavy'],body:'golem',mov:4},FireSprite:{n:'Fire Sprite',w:['art'],body:'flame',mov:5,lava:true},MagmaDragon:{n:'Magma Dragon',w:['art','heavy'],body:'dragon',mov:0,lava:true},
  WyvernM:{n:'Wyvern',w:['heavy'],body:'mount',mov:6,fly:true},PegasusM:{n:'Pegasus',w:['blade'],body:'mount',mov:7,fly:true},Tempest:{n:'Storm Elemental',w:['art'],body:'storm',mov:3,fly:true},
  Beholder:{n:'Beholder',w:['art'],body:'eye',mov:4},
  Lurker:{n:'Bog Lurker',w:['blade'],body:'gator',mov:4,wade:true},Treant:{n:'Blighted Treant',w:['heavy'],body:'golem',mov:3}
});
CLS.LamiaM.wade=true;
Object.assign(FOE,{
  Hawk:{b:[12,4,0,6,9,3,1,2],g:[.4,.3,0,.3,.4,.2,.1,.1],items:['talons'],look:{}},
  Gnome:{b:[16,5,0,5,4,5,4,3],g:[.55,.35,0,.35,.25,.35,.25,.2],items:['mallet'],look:{}},
  Snake:{b:[14,4,0,6,7,2,2,2],g:[.45,.3,0,.35,.4,.15,.1,.15],items:['fangs'],look:{}},
  Sporeling:{b:[14,0,4,4,6,4,2,3],g:[.5,0,.35,.3,.4,.3,.1,.2],items:['spores'],look:{}},
  Myconid:{b:[20,0,5,3,2,2,4,5],g:[.7,0,.35,.25,.15,.1,.25,.25],items:['sporeCloud'],look:{}},
  Skeleton:{b:[16,5,0,4,4,0,3,0],g:[.6,.4,0,.35,.3,0,.2,.05],items:['ironJian'],look:{}},
  Ghost:{b:[15,0,5,4,6,2,1,5],g:[.5,0,.4,.3,.4,.15,.05,.35],items:['darkT'],look:{}},
  MudMonster:{b:[26,6,0,2,1,0,6,0],g:[.9,.4,0,.2,.1,0,.3,0],items:['slam'],look:{}},
  CursedStag:{b:[17,6,0,5,8,2,2,2],g:[.6,.4,0,.35,.45,.15,.1,.15],items:['antlers'],look:{}},
  Boulder:{b:[24,7,0,2,1,0,10,0],g:[.8,.4,0,.2,.05,0,.4,0],items:['slam'],look:{}},
  FireSprite:{b:[14,0,5,5,7,2,1,4],g:[.5,0,.4,.35,.45,.15,.05,.3],items:['flameT'],look:{}},
  WyvernM:{b:[20,7,0,4,4,0,6,0],g:[.7,.45,0,.3,.25,.05,.3,.05],items:['bite'],look:{}},
  PegasusM:{b:[16,4,2,6,8,4,2,6],g:[.55,.3,.1,.4,.45,.3,.1,.35],items:['hooves'],look:{}},
  Beholder:{b:[20,0,6,6,3,2,4,6],g:[.6,0,.4,.35,.2,.1,.2,.3],items:['darkT'],look:{}},
  Lurker:{b:[18,6,0,4,5,1,4,0],g:[.65,.4,0,.3,.3,.1,.2,.05],items:['fangs'],look:{}},
  Treant:{b:[24,6,0,3,1,0,6,3],g:[.8,.4,0,.25,.1,0,.3,.15],items:['slam'],look:{}}
});
const MONLOOK={
  Sporeling:()=>({cap:pick(['#d8483a','#e8a23a','#c85aa8','#4a9ad8']),stem:'#efe6cf',small:true}),
  Myconid:()=>({cap:pick(['#8a5a3a','#6a7a3a','#7a4a8a']),stem:'#d8ccb0'}),
  Skeleton:()=>({crysSmall:true,skel:true,style:'bald',skin:'#e8e2d0',cloth:pick(['#3a3540','#4a3a2a','#2a3a3a']),eye:'#ff5a3a',gear:rand()<.4?'helm':undefined}),
  Ghost:()=>({crys:false,body:pick(['#d8e0f0','#c8e8e0','#e0d0f0']),eye:'#7fe3ff'}),
  MudMonster:()=>({body:pick(['#5a4a32','#4a4a2a','#5a3a2a'])}),
  CursedStag:()=>({fur:pick(['#4a3a4a','#5a4a3a','#3a3040']),eye:'#ff3a5a',antlers:'#d8d0bc',antler2:'#b07ae8',crys:false}),
  Boulder:()=>({body:pick(['#7a746e','#6a625c','#8a8278']),eye:'#ff9a3c'}),
  FireSprite:()=>({crys:false,body:pick(['#ff8a3c','#ff6a2a','#ffaa3c'])}),
  WyvernM:()=>({crysAt:[{dot:[13,21]},{dot:[16,21]},{dot:[19,21]},{dot:[23,17]}],mount:'wyvern',horse:pick(['#4f7a4a','#5a4a7a','#7a4a3a','#3a5a6a'])}),
  PegasusM:()=>({mount:'pegasus',horse:pick(['#f3f0e8','#e0e6f0','#3a3440'])}),
  Gnome:()=>({hat:pick(['#c8322e','#3a7a3a','#c87a2a','#6a3a8a']),cloth:pick(['#3a6ab0','#5a3a22','#3a7a5a'])}),
  Snake:()=>({body:pick(['#4f8a3a','#7a6a2a','#3a6a5a'])}),
  Lurker:()=>({crysSmall:true,body:pick(['#4a5a32','#3a4a3a','#5a5a3a'])}),
  Treant:()=>({body:pick(['#5a4a32','#4a3a2a','#6a5a3a']),eye:'#9aff6a',leaves:pick(['#3f7a42','#5a6a2a','#6a3a5a'])}),
  Beholder:()=>({body:pick(['#8a4a6a','#4a6a8a','#6a4a3a']),eye:pick(['#5fc2a0','#ffd23f','#ff5a3a'])})
};
const BIOMES={
  mushroom:{n:'Mycelia',noThe:1,bg:'#3a2a48',d:'Glowing mycelium and giant toadstools. The fungus folk have turned feverish under the blight, and their spores poison on a hit.',
    tip:['spores','Poison spores','Fungus attacks poison on a hit: 3 damage at the start of each of your turns for 3 turns. A Salve cures it.'],
    maps:['glade','hollow','ring'],bossMap:'mushThrone',pool:[['Sporeling',4],['Mindsnail',2,3]],elitePool:[['Mindsnail',3],['Sporeling',2]],
    boss:{name:'King Morel the Blighted',cls:'MorelKing',s:[36,0,9,6,3,4,7,8],items:['sporeCloud'],skill:'spore',look:{cap:'#6a3a6a',stem:'#bab2a0',crown:true,blight:true}}},
  shadow:{n:'Sunless Isle',bg:'#24223a',d:'A haunted land of graves and crypts. Skeletons walk, and ghosts drift straight through walls.',
    tip:['ghosts','Ghosts','Ghosts ignore terrain and can pass through walls. Their dark magic heals them for a third of the damage dealt.'],
    maps:['graveyard','crypt','village'],bossMap:'chapel',pool:[['Skeleton',4],['Ghost',2,3]],elitePool:[['Ghost',3],['Skeleton',2]],
    boss:{name:'The Bone Wyrm',cls:'BoneWyrm',s:[32,0,11,8,5,3,6,9],items:['darkT'],skill:'focus',summon:'Skeleton',look:{bones:true,glow:'#c77dff'}}},
  swamp:{n:'Bog of Eternal Stench',bg:'#22362c',d:'Mangrove roots and ankle-deep water. Lurkers and lamias hunt the shallows; the sand banks are solid ground.',
    tip:['swamp','Ankle-deep water','A unit that starts its turn in the water or the mangrove roots has 1 less Move. Sand is solid ground. Fliers and swamp creatures ignore this.'],
    maps:['flats','road','bog'],bossMap:'lair',pool:[['Lurker',3],['LamiaM',3,2],['MudMonster',2,4]],elitePool:[['MudMonster',3],['LamiaM',2],['Lurker',2]],
    boss:{name:'Krondis',cls:'Krondis',mov:4,s:[40,13,0,5,5,2,10,1],items:['bite'],skill:'fury',look:{body:'#5a6a86',belly:'#5a7a4a',crown:true}}},
  forest:{n:'Cursed Woodland',bg:'#26302a',d:'A dead forest under a curse. The deer here have gone wrong, wolves hunt in packs, and the trees themselves are waking up.',
    tip:['woods','Cursed thickets','Cursed thickets give +25 Avoid and +1 Def, but cost 2 Move to enter. Stags are fast: keep your back line covered.'],
    maps:['woodland','brook','clearing'],bossMap:'heart',pool:[['Wolf',4],['CursedStag',3,2],['Treant',2,5]],elitePool:[['Treant',3],['CursedStag',3],['Wolf',2]],
    boss:{name:'The Hollow Bear',cls:'HollowBear',mov:4,s:[38,13,0,6,5,3,8,3],items:['slam'],skill:'fury',look:{fur:'#3a2a24',eye:'#ff3a3a',core:'#ff6aa8'}}},
  mountain:{n:'Volcanic Isle',bg:'#3a2420',d:'Basalt slopes cut by rivers of magma. Golems block the passes, and fire sprites float over the lava.',
    tip:['lava','Magma','Magma can’t be crossed on foot. Fliers and fire creatures move over it freely.'],
    maps:['fields','caldera','ridge'],bossMap:'crater',pool:[['FireSprite',3],['Boulder',3,3],['Harpy',1,4]],elitePool:[['Boulder',3],['FireSprite',2],['Harpy',1]],
    boss:{name:'Pyraxis, the Magma Dragon',cls:'MagmaDragon',s:[42,12,10,6,4,2,10,6],items:['breath'],skill:'brace',look:{body:'#4a2420',magma:true,big:true,crysSmall:true,crysCol:'#3a2a4a'}}},
  ship:{n:'The Flying Ship',bg:'#26304a',d:'A sky-galleon under attack. Hold the deck while wyverns, pegasi and harpies dive from the clouds.',
    tip:['ship','Defend the ship','Hold the deck until the turn count runs out; more fliers arrive every turn. Bows deal double damage to fliers.'],
    maps:['deck','galleon'],bossMap:'deck',pool:[['Harpy',3],['WyvernM',2,3]],elitePool:[['WyvernM',3],['Harpy',2]],
    boss:{name:'The Great Roc',cls:'Roc',mov:4,s:[36,12,6,7,8,3,7,6],items:['talons','galeT'],skill:'swift',look:{body:'#8a5a2a',head:'#efe6cf',beak:'#e8b83a'}}},
  labyrinth:{n:'The Labyrinth',bg:'#2a2630',d:'Stone corridors with no daylight. Something with too many eyes watches from the dark.',
    tip:['maze','The Labyrinth','Beholders can turn units to stone with their gaze. Stone units skip their next turn.'],
    maps:['maze1','vaults','pillars'],bossMap:'mazeHeart',pool:[['Gremlin',3],['Beholder',2,3]],elitePool:[['Beholder',3],['Gremlin',2]],
    boss:{name:'',cls:'MinotaurM',s:[34,12,0,6,4,2,9,2],items:['steelAxe'],skill:'fury',look:{style:'bald',horns:true,beard:true,hair:'#2a1a14',skin:'#7a4e32',cloth:'#4a3a2a',eye:'#ff5a3a',hornGem:'#d8323a',crysAt:[{core:[15,19],col:'#d8323a'}]}}}
};
