/* The named cast: each character's class, weapon and fixed look, drawn by the unit rig (js/09b-battle-rig.js).
   Look fields on top of the random ones (hair, skin, cloth, sash, eye, style, gear, cape, beard, fem, shield, mount, horse):
   body (tunic/robe/vest/armor), pants, boot, metal (armour tint), capeC, shieldC, shawl, collar, feather (list of colours),
   tattoo, scar, wraps (hand wraps), mask, voidFace, mist (dark mist round the hand), hand (casts from the open hand), el (spell glow colour),
   staff/orb (staff colours), nature (branch staff), jag (jagged daggers), dblAxe (two-headed axe), joust + lanceC (jousting lance),
   barding (horse armour), bolt / hem (robe trims), tails (sash ribbons), stance (idle: shoulder/low/guard/lowguard/draw/high), wpnArt (a pack weapon sprite from WPN_ART in place of the drawn one),
   bigBow (a larger bow), bracers (wristguards + shoulder plate), lapels, boots (tall boots), noCrown (no gold band when ascended),
   style also takes 'mane' (longer hair) and 'bunback', shield (round/kite/tower/aegis), gear also takes 'nursecap', prop ('lyre': held instead of a weapon).
   Preview them all: node tools/export-cast.mjs (writes docs/visuals/cast/). */

/* ---- the cast's classes ----
   Each class is drawn from a rig body: role.move.weapon.tier (the same parts as the generated classes).
   Its key is G.<rig>.<Name>, e.g. G.skirm.foot.bow.1.Archer, and CLS[key].n is the class name. */
const CAST_CLASSES={
  /* base classes */
  'Archer':'skirm.foot.bow.1','Brawler':'bruiser.foot.heavy.1','Cultist':'caster.foot.art.1','Elemental Mage':'caster.foot.art.1',
  'Knight':'knight.armour.pole.1','Mender':'support.foot.spirit.1','Rogue':'rogue.foot.blade.1','Shieldmaiden':'shield.foot.blade.1',
  'Adventurer':'shield.foot.blade.1','Cavalier':'tank.mounted.pole.1','Crossbowman':'skirm.foot.bow.1','Drake Rider':'bruiser.flying.pole.2',
  'Horse Archer':'skirm.mounted.bow.2','Swordsman':'sword.foot.blade.1','Pyromancer':'caster.foot.art.1','Minstrel':'support.foot.spirit.1',
  'Summoner':'summoner.foot.art.1',
  /* advanced classes */
  'Sniper':'skirm.foot.bow.2','Bow Cavalry':'skirm.mounted.bow.2','Berserker':'bruiser.foot.heavy.2','Witch':'caster.foot.art.2',
  'Shaman':'caster.foot.art.2','Archmage':'caster.foot.art.2','Stormlord':'caster.foot.art.2','Juggernaut':'knight.armour.heavy.2',
  'Paladin':'knight.mounted.pole.2','Saint':'support.foot.spirit.2','Crusader':'shield.armour.blade.2','Duelist':'sword.foot.blade.2',
  'Assassin':'rogue.foot.blade.2','Valkyrie':'shield.flying.pole.2','Aegis':'shield.armour.blade.2','Hero':'shield.foot.blade.2',
  'Warlord':'tank.mounted.heavy.2','Artillery':'tank.armour.bow.2','Swordmaster':'sword.foot.blade.2','Pyrolord':'caster.foot.art.2',
  'Grand Summoner':'summoner.foot.art.2','Bard':'support.foot.spirit.2','Mercenary':'sword.foot.blade.2','Warlock':'caster.foot.art.2'
};
/* ASC_BONUS: stats each advanced cast class adds on ascending (and joiners who start advanced get them too), in stat order */
const ASC_BONUS={
  'Sniper':[2,3,0,0,2,5,1,1],
  'Bow Cavalry':[3,2,0,0,4,2,1,1],
  'Artillery':[5,4,0,0,0,2,4,1],
  'Berserker':[6,5,0,0,2,2,1,0],
  'Witch':[2,0,4,0,2,2,0,4],
  'Shaman':[4,0,3,0,1,1,2,4],
  'Archmage':[2,0,5,0,1,2,1,4],
  'Stormlord':[3,0,4,0,4,1,0,2],
  'Pyrolord':[4,0,5,0,1,1,2,1],
  'Juggernaut':[7,4,0,0,0,0,5,1],
  'Paladin':[5,3,0,0,2,1,3,2],
  'Warlord':[6,4,0,0,1,1,3,1],
  'Saint':[3,0,4,0,1,2,0,5],
  'Crusader':[5,3,1,0,0,1,4,2],
  'Duelist':[3,3,0,0,3,3,2,1],
  'Assassin':[2,3,0,0,4,5,0,1],
  'Valkyrie':[3,3,0,0,3,1,1,4],
  'Aegis':[6,2,0,0,0,0,5,3],
  'Hero':[4,3,0,0,3,2,2,1],
  'Swordmaster':[2,3,0,0,5,4,0,1],
  'Bard':[3,0,3,0,3,3,1,2],
  'Grand Summoner':[4,0,5,0,2,2,2,4]};
const castCls=n=>`G.${CAST_CLASSES[n]}.${n.replace(/ /g,'')}`;
for(const n in CAST_CLASSES){const base=ensureCls('G.'+CAST_CLASSES[n]);const C=Object.assign({},CLS[base],{n});delete C.promo;if(ASC_BONUS[n])C.bonus=ASC_BONUS[n];CLS[castCls(n)]=C}

/* ---- the characters ----
   cls: their class, wk: the weapon they hold, look: their look.
   asc: one entry per ascension; its look is laid over the base look (wk is the weapon drawn in the previews).
   swap: on ascending, these weapons in their bag change (only Holt as a Sniper: crossbow → longbow, arbalest → greatbow; keeps reforging).
   gain: on ascending, they're given this weapon too (Crusaders get a holy sword alongside their staff). */
const CAST=[
  /* ---- starting roster ---- */
  {id:'kili',name:'Kili',cls:'Archer',wk:'longbow',joins:'start',look:{style:'tail',hair:'#4a3426',skin:'#e8b98f',cloth:'#4a6a3a',pants:'#5a4a32',sash:'#7a5230',feather:['#efe6cf','#c8322e','#efe6cf'],eye:'#3a6a3a'},
    asc:{'Sniper':{wk:'hawkeyeBow',look:{bigBow:true,capeC:'#2f4a2a',cloth:'#3f5a32',feather:['#efe6cf','#c8322e','#efe6cf','#c8322e']}},
         'Bow Cavalry':{wk:'longbow',look:{capeC:'#5a4a32',horse:'#7a5230'}}}},
  {id:'vaar',name:'Vaar',cls:'Brawler',wk:'hatchet',joins:'start',look:{style:'long',beard:true,hair:'#8a5a2a',skin:'#f3cfa6',cloth:'#6b4a2a',pants:'#4a3a2a',sash:'#a8743a',tattoo:'#3a6ab0',eye:'#3a5a8a'},
    asc:{'Berserker':{wk:'labrys',look:{style:'wild',capeC:'#5a4a3a',shawl:'#8a7a62',dblAxe:true,stance:'shoulder'}}}},
  {id:'morrigan',name:'Morrigan',cls:'Cultist',wk:'umbralSigil',joins:'start',look:{fem:true,style:'long',hair:'#c0282a',skin:'#f6dcc4',cloth:'#5a1a2a',sash:'#c8322e',cape:true,capeC:'#2a1420',hand:true,el:'#ff4a5a',eye:'#3a6a3a'},
    asc:{'Witch':{look:{cloth:'#2a1420',capeC:'#6a1a2a',collar:'#6a1a2a',gear:'hairpin',el:'#c060ff'}},
         'Shaman':{wk:'crookStaff',look:{hand:false,cloth:'#5a3a2a',shawl:'#8a6a4a',capeC:'#3a2a1e',feather:['#7a5230','#efe6cf'],staff:'#4f331d',orb:'#7fd36a'}}}},
  {id:'corvin',name:'Corvin',cls:'Elemental Mage',wk:'stormSigil',joins:'start',look:{fem:true,style:'bun',hair:'#2a2230',skin:'#f3cfa6',cloth:'#3a5a8a',sash:'#e2b553',cape:true,capeC:'#22284a',hand:true,eye:'#3a5a8a'},
    asc:{'Archmage':{wk:'heavensBolt',look:{cloth:'#2a3a7a',capeC:'#3a2a6a',collar:'#2a3a7a',gear:'circlet'}},
         'Stormlord':{look:{cloth:'#3a4a5a',capeC:'#1e2430',sash:'#9fd8ff',el:'#9fd8ff',style:'long',bolt:'#ffe14a'}}}},
  {id:'aldric',name:'Aldric',cls:'Knight',wk:'ironSpear',joins:'start',look:{style:'short',hair:'#6b4226',skin:'#e8b98f',cloth:'#b8322e',shield:'kite',shieldC:'#b8322e',eye:'#6a3a2a'},
    asc:{'Juggernaut':{look:{metal:'#9aa2b2',capeC:'#8a2420',shield:'tower',shieldC:'#8a2420',beard:true}},
         'Paladin':{look:{capeC:'#b8322e',horse:'#e8e2d0'}}}},
  {id:'maelis',name:'Maelis',cls:'Mender',wk:'mendingStaff',joins:'start',look:{fem:true,style:'long',hair:'#6b4226',skin:'#f6dcc4',cloth:'#efe6cf',sash:'#e2b553',shawl:'#fff8e8',staff:'#e2b553',orb:'#fff2b0',eye:'#3a5a8a'},
    asc:{'Saint':{look:{gear:'circlet',capeC:'#fff8e8',collar:'#efe6cf'}},
         'Crusader':{wk:'holySword',gain:'holySword',look:{metal:'#e8e2d0',shield:'kite',shieldC:'#efe6cf',capeC:'#e2b553',shawl:null}}}},
  {id:'rook',name:'Rook',cls:'Rogue',wk:'twinDaggers',joins:'start',look:{style:'wild',hair:'#1d1a24',skin:'#c98e62',cloth:'#3a3036',pants:'#2a2226',sash:'#5a4a3a',wraps:'#c9bfa8',jag:true,wpnArt:'dagger',stance:'lowguard',eye:'#2a2230'},
    asc:{'Duelist':{wk:'thornRapier',look:{cloth:'#4a3a4a',sash:'#c8322e',capeC:'#2a2230',jag:null}},
         'Assassin':{wk:'stiletto',look:{gear:'hood',mask:'#4a4656',capeC:'#1e1a22',cloth:'#2a2230'}}}},
  {id:'brynhildr',name:'Brynhildr',cls:'Shieldmaiden',wk:'wornSword',joins:'start',look:{fem:true,style:'tail',hair:'#d9b25a',skin:'#f6dcc4',cloth:'#5a6a3a',pants:'#3f4a2a',sash:'#a8743a',shield:'kite',shieldC:'#2f5a4a',eye:'#3a5a8a'},
    asc:{'Valkyrie':{look:{horse:'#f3f0e8',capeC:'#2f5a4a',feather:['#ffffff','#e8e2d0']}},
         'Aegis':{look:{metal:'#b8c0a8',shield:'aegis',capeC:'#3f4a2a'}}}},
  {id:'brin',name:'Brin',cls:'Adventurer',wk:'wornSword',joins:'start',look:{style:'short',hair:'#6b4226',skin:'#f3cfa6',cloth:'#c8682a',pants:'#5a4a3a',sash:'#7a5230',shield:'round',shieldC:'#c8682a',eye:'#3a6a3a'},
    asc:{'Hero':{wk:'knightlySword',look:{capeC:'#c8682a',shield:'kite',shieldC:'#a8501e',gear:'headband'}}}},
  /* ---- found during the run (joins:'tavern' only at the tavern, 'event' only through their own event) ---- */
  {id:'aletta',name:'Aletta',cls:'Mender',wk:'mendingStaff',joins:'run',look:{fem:true,style:'bun',hair:'#a8743a',skin:'#f3cfa6',cloth:'#5a8a5a',sash:'#efe6cf',shawl:'#dfe8d0',gear:'nursecap',eye:'#3a6a3a'},
    asc:{'Saint':{wk:'dawnStaff',look:{gear:'circlet',capeC:'#dfe8d0',staff:'#e2b553',orb:'#9fe8c0'}},
         'Crusader':{wk:'holySword',gain:'holySword',look:{gear:null,metal:'#b8d0b0',shield:'kite',shieldC:'#5a8a5a',capeC:'#3f6a3f',shawl:null}}}},
  {id:'trent',name:'Trent',cls:'Cavalier',wk:'ironSpear',joins:'start',look:{style:'short',hair:'#3a2a20',skin:'#e8b98f',cloth:'#3f7a4a',metal:'#a9c4a2',horse:'#4a3426',eye:'#3a6a3a'},
    asc:{'Paladin':{look:{capeC:'#3f7a4a',metal:'#c4dcbc',shield:'kite',shieldC:'#3f7a4a'}},
         'Warlord':{look:{capeC:'#25603a',metal:'#7a9a72',beard:true,barding:'#1e3a24',joust:true,lanceC:'#e8e2d0'}}}},
  {id:'holt',name:'Holt',cls:'Crossbowman',wk:'crossbow',joins:'run',look:{style:'short',hair:'#e8e2d0',skin:'#e8b98f',cloth:'#3a5a8a',pants:'#3a3a4a',sash:'#c9c3b8',eye:'#3a5a8a'},
    asc:{'Sniper':{wk:'longbow',swap:{crossbow:'longbow',arbalest:'yewGreatbow'},look:{bigBow:true,gear:'hood',capeC:'#2a3a5a'}},
         'Artillery':{look:{metal:'#9aa8c0',capeC:'#2a3a5a',beard:true}}}},
  {id:'sigrun',name:'Sigrun',cls:'Drake Rider',wk:'ironSpear',joins:'run',look:{body:'tunic',fem:true,style:'tail',hair:'#4a3a30',skin:'#f6dcc4',cloth:'#2a2630',pants:'#3a2430',sash:'#c8322e',shawl:'#a8322e',cape:true,capeC:'#6a2a5a',mount:'wyvern',horse:'#4f8a4a',eye:'#5a4a7a'}},
  {id:'kaya',name:'Kaya',cls:'Horse Archer',wk:'shortBow',joins:'run',look:{fem:true,style:'long',hair:'#d8c8ec',skin:'#e8b98f',cloth:'#8a6a4a',pants:'#5a4a32',sash:'#8a5a9a',horse:'#8a8f9a',eye:'#5a4a7a'}},
  {id:'jun',name:'Jun',cls:'Swordsman',wk:'wornSword',joins:'run',look:{body:'robe',style:'topknot',hair:'#1d1a24',skin:'#f3cfa6',cloth:'#2f4f8f',sash:'#efe6cf',stance:'low',style:'bunback',eye:'#2a2230'},
    asc:{'Swordmaster':{wk:'moonglassEdge',look:{capeC:'#1e2f5a',tails:'#efe6cf',bracers:'#a8b4c8',lapels:'#efe6cf',noCrown:true}}}},
  {id:'ash',name:'Ash',cls:'Pyromancer',wk:'emberSigil',joins:'run',look:{style:'short',hair:'#3a2a20',skin:'#e8b98f',cloth:'#a8322a',sash:'#e2b553',collar:'#a8322a',gear:'circlet',hand:true,eye:'#6a3a2a'},
    asc:{'Pyrolord':{look:{capeC:'#5a1a1a',el:'#ffb03c',style:'wild',hair:'#8a2a22',body:'robe',hem:'#ff8a3c'}},
         'Archmage':{wk:'meteorSigil',look:{capeC:'#3a1a3a',cloth:'#7a2a4a',collar:'#7a2a4a'}}}},
  {id:'lysander',name:'Lysander',cls:'Minstrel',wk:null,joins:'event',look:{body:'tunic',prop:'lyre',style:'short',hair:'#a8743a',skin:'#f3cfa6',cloth:'#8a5a7a',pants:'#4a3a4a',sash:'#efe6cf',gear:'cap',eye:'#3a5a8a'},
    asc:{'Bard':{look:{cape:true,capeC:'#5a3a5a',feather:['#c8322e','#efe6cf']}}}},/* placeholder Bard look until his art is drawn */
  /* ---- join after Act 1, already advanced ---- */
  {id:'nyx',name:'Nyx',cls:'Assassin',wk:'dirk',joins:'act1',look:{fem:true,style:'long',hair:'#1d1a24',skin:'#e8b98f',cloth:'#1e1a22',pants:'#141018',sash:'#5a4a7a',gear:'hood',mask:'#4a4656',capeC:'#1e1a22',jag:true,eye:'#9a6ad8'}},
  {id:'roark',name:'Roark',cls:'Berserker',wk:'reaverAxe',joins:'act1',look:{style:'wild',beard:true,hair:'#9a9aa2',skin:'#e8b98f',cloth:'#6a6a72',pants:'#3a3a40',sash:'#a8322a',capeC:'#8a2a22',scar:true,dblAxe:true,stance:'shoulder',eye:'#6a3a2a'}},
  {id:'valen',name:'Valen',cls:'Swordsman',wk:'knightlySword',joins:'act1',look:{style:'mane',hair:'#d9b25a',skin:'#f3cfa6',cloth:'#6a1e2a',pants:'#3a2228',sash:'#c9c3b8',stance:'guard',boots:'#4a3426',eye:'#3a5a8a'},
    asc:{'Swordmaster':{wk:'hookedBlade',look:{capeC:'#4a1420',stance:'high',tails:'#c9c3b8',bracers:'#a8b4c8',lapels:'#c9c3b8',noCrown:true}}}},
  {id:'celestine',name:'Celestine',cls:'Paladin',wk:'ironSpear',joins:'act1',look:{fem:true,style:'long',hair:'#d9b25a',skin:'#f6dcc4',cloth:'#3a6ab0',metal:'#e4ecf6',shield:'kite',shieldC:'#3a6ab0',capeC:'#2a4a8a',horse:'#f3f0e8',eye:'#3a5a8a'}},
  {id:'seren',name:'Seren',cls:'Summoner',familiar:'spiritFrog',wk:'runeStaff',joins:'run',look:{fem:true,style:'long',hair:'#1d1a24',skin:'#f3cfa6',cloth:'#4a8a9a',sash:'#cfe8f0',shawl:'#cfe8f0',capeC:'#2f6a7a',orb:'#9fe8ff',nature:true,eye:'#3a6a7a'},
    asc:{'Grand Summoner':{look:{cloth:'#2f6a7a',capeC:'#1f4a5a',collar:'#cfe8f0',gear:'circlet',orb:'#c8f4ff'}}}},
  {id:'zwei',name:'Zwei',cls:'Mercenary',wk:'greatsword',joins:'act1',look:{fem:true,style:'bun',hair:'#1d1a24',skin:'#a8714a',cloth:'#efe6cf',pants:'#c9bfa0',sash:'#e2b553',collar:'#2a5aa8',capeC:'#2a5aa8',stance:'shoulder',eye:'#2a2230'}},
  {id:'kyul',name:'Kyul',cls:'Warlock',wk:'umbralSigil',joins:'act1',look:{gear:'hood',skin:'#c9b6a0',cloth:'#1e2a22',sash:'#3fae6a',capeC:'#141a16',mask:'#141a16',mist:'#2a2230',hand:true,el:'#5fe08a',eye:'#3fae6a'}}
];
/* class names → class keys; each base class lists its ascensions for promotion */
CAST.forEach(c=>{const base=castCls(c.cls);c.cls=base;
  if(c.asc){const asc={};for(const n in c.asc){const a=c.asc[n],look=Object.assign({},c.look,a.look);
    for(const k in look)if(look[k]==null)delete look[k];
    if(CAST_CLASSES[n].split('.')[1]!=='flying')delete look.mount;else if(!look.mount)look.mount='pegasus';
    asc[castCls(n)]={n,wk:a.wk===undefined?c.wk:a.wk,swap:a.swap,gain:a.gain,look}}
  c.asc=asc;CLS[base].asc=[...new Set([...(CLS[base].asc||[]),...Object.keys(asc)])];CLS[base].promo=CLS[base].asc[0]}});
const castDef=id=>CAST.find(c=>c.id===id);
/* ---- cast PNGs: art/cast/<id>/<class>-<pose>.png replaces the rig-drawn frame (edit them in Aseprite or any pixel editor) ----
   One set per class the character can be (base and each ascension). Poses: idle, and the attack frames windup, swing,
   follow, critup (see STRIPS). The PNG is drawn with the character's listed weapon, so weapon upgrades don't show on it.
   Make the starting PNGs with: node tools/export-art.mjs */
const CAST_POSES=['idle','windup','swing','follow','critup'];
const castPngKey=(id,cls,pose)=>'cast/'+id+'/'+CLS[cls].n.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+pose;
function castPng(u,pose){if(!u||!u.cast)return null;const k=castPngKey(u.cast,u.cls,pose);return ART_PNG.has(k)?'art/'+k+'.png':null}
function castArt(id,cls,pose){const c=castDef(id),a=c.asc&&c.asc[cls];return art(castPngKey(id,cls,pose),()=>hiArt(clone(a?a.look:c.look),cls,'p',a?a.wk:c.wk,pose,0,64))}
function castArtAll(){for(const c of CAST)for(const cls of[c.cls,...Object.keys(c.asc||{})])for(const p of CAST_POSES)castArt(c.id,cls,p)}
/* weapon types: a cast class (and its ascensions) wields only the type its characters start with; Menders wield staves
   only (no sigils), and an ascension that gains a weapon (gain) adds that weapon's type (a Crusader: staves and blades) */
{const W={},add=(k,ts)=>(W[k]=W[k]||new Set(),ts.forEach(t=>W[k].add(t)));
  for(const c of CAST){const ts=c.cls.split('.')[1]==='support'?['spirit']:[c.wk?IT[c.wk].t:'spirit'];add(c.cls,ts);
    for(const k in c.asc){add(k,ts);if(c.asc[k].gain)add(k,[IT[c.asc[k].gain].t])}}
  for(const k in W)CLS[k].w=[...W[k]]}

/* ---- making cast units and offering them during a run ----
   The Crossroads offers starting-roster characters; whoever you don't take can turn up later.
   Recruits, the caged traveller and the tavern draw from those plus the 'run' characters (the tavern also has its own);
   from Act 2 the 'act1' characters (already advanced) join the pool. Each character joins at most once a run (run.castUsed). */
function castUnit(id,lv){
  const c=castDef(id),[,role,mv,,t]=c.cls.split('.'),R=ROLES[role],M=MOVES[mv];
  if(t==='2')lv=1; /* already-advanced characters always join at Lv 1 */
  const s=R.b.slice();if(M.st)M.st.forEach((d,i)=>s[i]=Math.max(0,s[i]+d));if(t==='2'&&CLS[c.cls].bonus)CLS[c.cls].bonus.forEach((d,i)=>s[i]+=d);
  const g=R.gr.map(([a,b])=>Math.round((a+b)/2)),items=[];
  if(c.wk)items.push({k:c.wk,u:IT[c.wk].uses});
  if(role==='support'&&c.wk!=='mendingStaff'&&CLS[c.cls].n!=='Minstrel')/* Lysander sings rather than carrying a staff */items.push({k:'mendingStaff',u:IT.mendingStaff.uses});
  items.push({k:'salve',u:IT.salve.uses});
  const u={id:'c'+(run.uid++),cast:id,name:c.name,cls:c.cls,team:'p',lv:1,exp:0,skill:KITS[id]?KITS[id].passive:pick(R.skills),skills:[],cap:BASE_CAP,look:clone(c.look),g,mov:CLS[c.cls].mov,items,acted:false,x:0,y:0};
  ST.forEach((k,i)=>u[k]=s[i]);u.maxhp=u.hp;
  for(;u.lv<lv;u.lv++)ST.forEach((k,i)=>{if(rand()*100<g[i]){if(k==='hp')u.maxhp++;else u[k]++}});
  if(role==='summoner')u.familiar=c.familiar||pick(Object.keys(FAMILIARS));
  u.hp=u.maxhp;return foldLuck(u);
}
/* who can turn up: where = 'recruit' (recruit node, cage), 'tavern' or 'act1' (the offer as Act 2 begins) */
function castPool(where){
  const used=new Set([...(run.castUsed||[]),...run.roster.map(u=>u.cast)]),act=run.act||1;
  return CAST.filter(c=>!used.has(c.id)&&(where==='act1'?c.joins==='act1':c.joins==='start'||c.joins==='run'||(where==='tavern'&&c.joins==='tavern')||(act>=2&&c.joins==='act1')));
}
/* n cast units for an offer, every eligible character equally likely. Anyone already offered this act (tavern, cage,
   recruit) is held back until there aren't enough unseen characters left to fill the offer */
function castOffer(n,lv,where){const act=run.act||1,seen=((run.seen=run.seen||{})[act]=run.seen[act]||[]),pool=castPool(where);
  const pick=[...shuffle(pool.filter(c=>!seen.includes(c.id))),...shuffle(pool.filter(c=>seen.includes(c.id)))].slice(0,n);
  for(const c of pick)if(!seen.includes(c.id))seen.push(c.id);return pick.map(c=>castUnit(c.id,lv))}
/* call when a unit joins the squad, so that character isn't offered again this run */
function castJoined(u){if(u&&u.cast)(run.castUsed=run.castUsed||[]).push(u.cast)}
/* the look a cast unit takes on ascending into class k */
function castLook(u,k){const c=u.cast&&castDef(u.cast),a=c&&c.asc[k];return a?clone(a.look):null}
/* on ascending: swap the listed weapon for the ascension's one (keeps the slot) */
function castSwap(u,to){const c=u.cast&&castDef(u.cast),a=c&&c.asc[to];if(!a)return;
  if(a.swap){const sw=typeof a.swap==='string'?{[a.swap]:a.wk}:a.swap,it=u.items.find(i=>sw[IT[i.k].base||i.k]);
    if(it){const f=IT[it.k].forge||0,to=sw[IT[it.k].base||it.k];it.k=f?ensureIt(to+'~'+f):to;it.u=IT[to].uses}}
  if(a.gain&&!u.items.some(i=>(IT[i.k].base||i.k)===a.gain)){if(u.items.length>=5){const j=u.items.findIndex(i=>IT[i.k].t==='item');if(j>=0)u.items.splice(j,1)}if(u.items.length<5)u.items.push({k:a.gain,u:IT[a.gain].uses})}}
