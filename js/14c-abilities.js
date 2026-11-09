/* Character abilities: each named character has a signature kit, a passive and 3 abilities (docs/CHARACTERS.md).
   Spells cost MP (full at the start of each fight, +2 at the start of each of your turns); physical skills have a
   cooldown in turns. Ability damage is a multiple of the unit's normal attack power (Str or Mag + weapon Mt, with
   height, effectiveness and relics), and the target's Def or Res is taken off afterwards. Abilities aren't countered, and hit 10 less often than a normal attack (ABIL_HIT).
   So far the 9 starting-roster characters have kits; the rest still have a random personal skill. */

/* ---- statuses ----
   u.st = {key:{n,by}}. 'end' statuses count down at the end of the unit's own phase (so a Root put on an enemy
   during your turn lasts through its next phase); 'start' ones count down at the start of it (so a Guard you put
   up lasts through the enemy's next phase). */
const STATUS={
  burn:{n:'Burn',tick:'end',bad:1,d:'Takes 2 damage at the start of each of its turns. Standing in water puts it out.'},
  chill:{n:'Slow',tick:'end',bad:1,d:'−2 Move.'},
  root:{n:'Root',tick:'end',bad:1,d:'Can’t move, but can still act.'},
  stun:{n:'Stun',tick:'end',bad:1,d:'Skips its next turn.'},
  blind:{n:'Blind',tick:'end',bad:1,d:'−20 Hit.'},
  sandEyes:{n:'Sand in Eyes',tick:'end',bad:1,d:'−10 Hit.'},
  weak:{n:'Weak',tick:'end',bad:1,d:'Deals 30% less damage.'},
  sunder:{n:'Sundered',tick:'end',bad:1,d:'−3 Def.'},
  challenged:{n:'Challenged',tick:'end',bad:1,d:'Must attack whoever challenged it, if it can reach them.'},
  guard:{n:'Guard',tick:'start',d:'Takes 30% less damage.'},
  smoke:{n:'Smoke',tick:'start',d:'+30 Avoid.'},
  rally:{n:'Rallied',tick:'start',d:'+2 Str and +2 Def.'},
  cover:{n:'Covered',tick:'start',d:'Attacks on this unit hit its protector instead, if they can.'},
  steady:{n:'Steady',tick:'start',d:'Can’t be pushed.'},
  shell:{n:'Shell',tick:'start',d:'+2 Def and +2 Res.'},
  shieldUp:{n:'Shield Up',tick:'start',d:'Counterattacks deal 1.3×.'},
  valour:{n:'Valour',tick:'start',d:'Deals 20% more damage.'},
  anthem:{n:'Anthem',tick:'start',d:'Deals 30% more damage and +10 Hit.'},
  iceShield:{n:'Ice Shield',tick:'start',d:'+3 Def.'}
};
const hasSt=(u,k)=>!!(u&&u.st&&u.st[k]&&u.st[k].n>0);
/* status immunities: Rook (Slippery) can't be Rooted; an Aegis can't be turned to Stone (nor can bosses) */
function stImmune(u,k){if(!u)return false;if(k==='root'&&has(u,'slippery'))return true;if(k==='stone')return!!u.boss||CLS[u.cls]&&CLS[u.cls].n==='Aegis';return false}
function addSt(u,k,n,by){if(stImmune(u,k))return;if(!u.st)u.st={};const o=u.st[k];u.st[k]={n:Math.max(n,o?o.n:0),by:by?by.id:(o&&o.by)};if(k==='stun'&&u.team==='p')u.acted=true}
function tickSt(team,when){for(const u of state.units)if(u.team===team&&u.st){for(const k in u.st)if(STATUS[k]&&STATUS[k].tick===when){u.st[k].n--;if(u.st[k].n<=0)delete u.st[k]}}}
/* at the start of a team's phase: burns hurt (but don't kill), water puts them out */
function burnTick(team){for(const u of state.units)if(u.team===team&&hasSt(u,'burn')&&u.hp>0){if(['water','shallow'].includes(ter(u.x,u.y).k)){delete u.st.burn;pop(u,'Doused','heal');continue}const d=Math.min(2,u.hp-1);if(d>0){u.hp-=d;pop(u,'Burn -'+d,'crit')}}}
const stList=u=>Object.keys(u.st||{}).filter(k=>hasSt(u,k)&&STATUS[k]);

/* ---- kit passives (they become the character's personal skill) ---- */
Object.assign(SKILLS,{
  eagleEye:{n:'Eagle Eye',cost:5,kit:1,d:'+1 range on every bow shot, on top of the height bonus.'},
  ironBody:{n:'Iron Body',cost:5,kit:1,d:'Can’t be pushed or pulled.'},
  siphon:{n:'Siphon',cost:5,kit:1,d:'Her dark spells heal her for 25% of the damage they deal.'},
  attunement:{n:'Attunement',cost:5,kit:1,d:'A spell of a different element from her last one costs 2 less MP.'},
  plate:{n:'Plate',cost:5,kit:1,d:'Physical hits deal 2 less damage to him; −1 Jump.'},
  lastLight:{n:'Last Light',cost:5,kit:1,d:'Her heals restore 50% more on allies below half HP.'},
  slippery:{n:'Slippery',cost:5,kit:1,d:'Can move through enemy tiles, and can’t be Rooted.'},
  bulwarkAura:{n:'Bulwark',cost:5,kit:1,d:'Allies next to her take 30% less damage from ranged attacks.'},
  beginnersLuck:{n:'Beginner’s Luck',cost:5,kit:1,d:'+10 Crit and +10 Avoid while at full HP.'},
  audience:{n:'Audience',cost:5,kit:1,d:'Allies within 2 tiles of him get +10 Hit.'},
  twinBolt:{n:'Lightning Strikes Twice',cost:5,kit:1,d:'With a lightning sigil: +3 Spd when checking for a double attack, but his second strike deals 0.8× damage.'}
});

/* ---- abilities ----
   mp / cd: cost. side: foe, ally, self (centred on the user) or tile (an empty tile, for Leap).
   r: range from the user ([min,max], or 'wpn' = their weapon's range). shape: one, cross, area (3×3), burst1 (3×3 round
   the user), burst2 (2 tiles round the user), pierce (2 tiles in a line), cone (1 tile in front, then the 3 tiles behind it).
   aim: 'any' = aim at any tile in range (area spells); 'dir' = pick a direction (an adjacent tile).
   dmg: × attack power; hit: + Hit; hits: number of strikes; mag: uses Mag (a spell); el: element (colour, Attunement).
   st: [status, turns, chance] on the enemies hit; give: [status, turns] on the allies in the shape; self: statuses on the user.
   heal: × (Mag + 5); cure: removes bad statuses; push: tiles pushed back; once: once a fight; encore: the ally can act again. */
const ABIL={
  /* Kili (Archer) */
  aimedShot:{n:'Aimed Shot',cd:2,side:'foe',r:[2,5],dmg:1.5,sure:1,d:'A careful shot from range 2–5: 1.5× damage, and it never misses.'},
  pinningArrow:{n:'Pinning Arrow',cd:3,side:'foe',r:'wpn',dmg:.8,st:['root',1],d:'0.8× damage, and the target is Rooted (can’t move) next turn.'},
  volley:{n:'Volley',cd:4,side:'foe',r:[3,5],shape:'area',aim:'any',dmg:.7,d:'Arrows rain on a 3×3 area 3–5 tiles away: 0.7× damage to every enemy in it.'},
  /* Vaar (Brawler) */
  palmStrike:{n:'Palm Strike',cd:1,side:'foe',r:[1,1],dmg:1,push:2,d:'1.0× damage and push 2. Slamming into a wall or unit hurts more; falling off a ledge hurts too.'},
  flurry:{n:'Flurry',cd:3,side:'foe',r:[1,1],dmg:.5,hits:3,d:'3 quick strikes of 0.5×.'},
  leap:{n:'Leap',cd:4,side:'tile',r:[1,3],shape:'area',dmg:1.2,d:'Leap to an empty tile up to 3 away, ignoring height, and slam down: 1.2× damage to every enemy around the landing.'},
  /* Morrigan (Cultist) */
  drainTouch:{n:'Drain Touch',mp:4,mag:1,el:'dark',side:'foe',r:[1,1],dmg:1.2,d:'1.2× magic damage to an adjacent enemy.'},
  hex:{n:'Hex',mp:5,mag:1,el:'dark',side:'foe',r:[1,3],st:['weak',2],d:'The target is Weak (deals 30% less damage) for 2 turns.'},
  darkPulse:{n:'Dark Pulse',mp:10,mag:1,el:'dark',side:'self',shape:'burst1',dmg:1,d:'1.0× magic damage to every enemy around her.'},
  /* Corvin (Ice Mage) */
  iceShard:{n:'Ice Shard',mp:4,mag:1,el:'ice',side:'foe',r:[1,3],dmg:1,st:['chill',1],d:'1.0× magic damage up to 3 away, and Slow (−2 Move).'},
  iceShield:{n:'Ice Shield',mp:5,el:'ice',side:'ally',r:[0,3],give:['iceShield',3],d:'An ally up to 3 away (or herself) gets +3 Def for 3 turns.'},
  frostWall:{n:'Frost Wall',mp:8,el:'ice',side:'tile',wall:2,r:[1,3],shape:'wall',d:'Three tiles in a row, up to 3 away, freeze into ice walls for 2 enemy turns. Enemies can’t move through them; allies can.'},
  blizzard:{n:'Blizzard',mp:10,mag:1,el:'ice',side:'foe',r:[1,3],shape:'area',aim:'any',dmg:.7,st:['chill',1],d:'A 3×3 storm of ice up to 3 away: 0.7× magic damage and Slow to every enemy in it.'},
  /* Drecken (Storm Mage) */
  spark:{n:'Spark',mp:4,mag:1,el:'lightning',side:'foe',r:[1,3],dmg:1,st:['stun',1,.15],d:'1.0× magic damage up to 3 away, 15% chance to Stun.'},
  thunderclap:{n:'Thunderclap',mp:10,mag:1,el:'lightning',side:'self',shape:'burst1',dmg:1.1,st:['stun',1,.3],d:'1.1× magic damage to every enemy around him, 30% chance to Stun each.'},
  /* Pepr (Poisoner) */
  poisonDart:{n:'Poison Dart',cd:2,side:'foe',r:[2,3],dmg:.6,psn:1,d:'0.6× damage from 2–3 tiles away, and the target is Poisoned.'},
  noxiousCloud:{n:'Noxious Cloud',cd:4,side:'foe',r:[1,3],shape:'area',aim:'any',dmg:.3,psn:1,st:['weak',1],d:'A 3×3 cloud up to 3 away: 0.3× damage, Poison and Weak (30% less damage) for a turn on every enemy in it.'},
  /* unused for now (was Corvin's) */
  flameBurst:{n:'Flame Burst',mp:5,mag:1,el:'fire',side:'foe',r:[1,3],shape:'cross',aim:'any',dmg:.9,st:['burn',2,.3],d:'A cross of fire up to 3 away: 0.9× magic damage, 30% chance to Burn.'},
  frostWave:{n:'Frost Wave',mp:7,mag:1,el:'ice',side:'foe',r:[1,1],shape:'cone',aim:'dir',dmg:.9,st:['chill',1],d:'A cone of frost (4 tiles): 0.9× magic damage and Slow (−2 Move).'},
  chainLightning:{n:'Chain Lightning',mp:9,mag:1,el:'lightning',side:'foe',r:[1,4],dmg:1,chain:[2,.6],d:'1.0× magic damage, then it bounces up to 2 times, each to an enemy within 2 tiles of the last one hit, at 0.6×.'},
  /* Aldric (Knight) */
  sunder:{n:'Sunder',cd:2,side:'foe',r:[1,1],dmg:1.2,st:['sunder',2],d:'1.2× damage, and the target has −3 Def for 2 turns.'},
  valiantThrust:{n:'Valiant Thrust',cd:3,side:'foe',r:[1,1],shape:'pierce',aim:'dir',dmg:1,d:'A lunge through 2 tiles in a line: 1.0× damage to both.'},
  cover:{n:'Cover',cd:3,side:'ally',r:[1,1],give:['cover',1],d:'Until his next turn, attacks on an adjacent ally hit him instead.'},
  /* Maelis (Mender); Purify is also Aletta’s */
  mend:{n:'Mend',mp:4,side:'ally',r:[0,3],heal:1.2,d:'Heal an ally up to 3 away (or herself): 1.2× (Mag + 5).'},
  circleOfRest:{n:'Circle of Rest',mp:8,side:'ally',r:[0,3],shape:'cross',aim:'any',heal:.8,cure:1,d:'Heals every ally in a cross for 0.8× (Mag + 5) and cures their bad statuses.'},
  purify:{n:'Purify',mp:3,side:'ally',r:[0,3],cure:1,d:'Cures every bad status on an ally up to 3 away (or herself): Poison and Stone too.'},
  sanctuary:{n:'Sanctuary',mp:10,side:'ally',r:[0,2],shape:'area',aim:'any',give:['guard',1],d:'Guard (30% less damage) on every ally in a 3×3 area until your next turn.'},
  /* Rook (Rogue) */
  backstab:{n:'Backstab',cd:2,side:'foe',r:[1,1],dmg:1,backstab:1,d:'1.0× damage, doubled from higher ground or when another ally is next to the target.'},
  smokeBomb:{n:'Smoke Bomb',cd:4,side:'self',shape:'burst1',st:['blind',1],give:['smoke',1],d:'Enemies around him are Blinded (−20 Hit); he and allies around him get +30 Avoid until your next turn.'},
  tumble:{n:'Tumble',cd:2,side:'self',tumble:1,free:1,d:'Move up to 2 more tiles, ignoring height. Doesn’t use his action.'},
  /* Brynhildr (Shieldmaiden) */
  shieldBash:{n:'Shield Bash',cd:2,side:'foe',r:[1,1],dmg:1,push:1,d:'1.0× damage and push 1.'},
  challenge:{n:'Challenge',cd:3,side:'self',shape:'burst2',st:['challenged',1],d:'Enemies within 2 tiles must attack her next turn, if they can reach her.'},
  holdTheLine:{n:'Hold the Line',cd:4,side:'self',self:[['guard',1],['steady',1]],d:'Guard (30% less damage), and she can’t be pushed, until your next turn.'},
  /* Raptor (Adventurer) */
  rally:{n:'Rally',cd:3,side:'self',shape:'burst1',give:['rally',2],others:1,d:'Allies around him get +2 Str and +2 Def for 2 turns.'},
  cleanCut:{n:'Clean Cut',cd:2,side:'foe',r:[1,1],dmg:1.2,hit:10,d:'1.2× damage, as accurate as a normal attack.'},
  shieldUp:{n:'Shield Up',cd:3,side:'self',self:[['guard',1],['shieldUp',1]],d:'Guard, and his counterattacks deal 1.3×, until your next turn.'},
  /* Lysander (Minstrel) */
  songOfValour:{n:'Song of Valour',mp:6,side:'self',shape:'burst2',give:['valour',2],others:1,d:'Allies within 2 tiles deal 20% more damage for 2 turns.'},
  lullaby:{n:'Lullaby',mp:8,side:'foe',r:[1,1],shape:'cone',aim:'dir',st:['stun',1,.5],d:'A cone of song (4 tiles): 50% chance to Stun each enemy hit.'},
  soothingBallad:{n:'Soothing Ballad',cd:3,side:'self',shape:'burst1',heal:.6,d:'A gentle tune: allies around him heal 0.6× (Mag + 5). Ready again 3 turns later.'},
  encore:{n:'Encore',mp:15,once:1,side:'ally',r:[1,3],encore:1,d:'An ally up to 3 away who has already acted can act again this turn. Once a fight.'},
  /* Bard versions of Lysander's songs (KITS.lysander.asc) */
  anthem:{n:'Anthem of Valour',mp:6,side:'self',shape:'burst2',give:['anthem',2],others:1,d:'Allies within 2 tiles deal 30% more damage and get +10 Hit for 2 turns.'},
  grandLullaby:{n:'Lullaby',mp:6,side:'foe',r:[1,1],shape:'cone',aim:'dir',st:['stun',1,.65],d:'A cone of song (4 tiles): 65% chance to Stun each enemy hit.'},
  soothingHymn:{n:'Soothing Hymn',cd:2,side:'self',shape:'burst1',heal:.8,cure:1,d:'Allies around him heal 0.8× (Mag + 5) and are cured of bad statuses. Ready again 2 turns later.'},
};
/* the kits: passive, MP pool (spellcasters) and abilities */
const KITS={
  kili:{passive:'eagleEye',mp:0,abil:['aimedShot','pinningArrow','volley']},
  vaar:{passive:'ironBody',mp:0,abil:['palmStrike','flurry','leap']},
  morrigan:{passive:'siphon',mp:24,abil:['drainTouch','hex','darkPulse']},
  corvin:{mp:28,abil:['iceShard','frostWave','blizzard','iceShield','frostWall']},/* no kit passive yet: keeps her random skill */
  drecken:{passive:'twinBolt',mp:28,abil:['spark','chainLightning','thunderclap']},
  aldric:{passive:'plate',mp:0,abil:['sunder','valiantThrust','cover']},
  maelis:{passive:'lastLight',mp:26,abil:['mend','purify','circleOfRest','sanctuary']},
  aletta:{mp:12,abil:['purify']},/* no kit passive yet: keeps her random skill */
  pepr:{passive:'venom',mp:0,abil:['poisonDart','noxiousCloud','tumble']},
  rook:{passive:'slippery',mp:0,abil:['backstab','smokeBomb','tumble']},
  brynhildr:{passive:'bulwarkAura',mp:0,abil:['shieldBash','challenge','holdTheLine']},
  raptor:{passive:'beginnersLuck',mp:0,abil:['rally','cleanCut','shieldUp']},
  lysander:{passive:'audience',mp:24,abil:['songOfValour','lullaby','soothingBallad','encore'],
    asc:{'Bard':{songOfValour:'anthem',lullaby:'grandLullaby',soothingBallad:'soothingHymn'}}}/* as a Bard: stronger songs, shorter waits */
};
const kitOf=u=>u&&u.cast&&KITS[u.cast]||null;
const abilOf=u=>{if(u&&u.team==='e'&&MKITS[u.cls])return MKITS[u.cls];const k=kitOf(u);if(!k)return[];const sw=k.asc&&k.asc[CLS[u.cls].n];return sw?k.abil.map(id=>sw[id]||id):k.abil};

/* ---- monster moves: 2 per monster, cooldowns only (no MP). Extra fields: stone (Stone, bosses immune), psn (Poison),
   solo (a self move that only affects the user), healPct (heals this share of max HP),
   wounded ([HP share, mult]: uses mult instead of dmg on a target below that share of its max HP), recoil (HP the user loses if every hit misses; never below 1). The enemy AI picks between
   these and a normal attack by score (aiAbil in 12-turns.js). Monsters not listed here still only attack. */
Object.assign(ABIL,{
  stoneGaze:{n:'Stone Gaze',cd:4,mag:1,side:'foe',r:[1,1],dmg:.5,stone:1,d:'0.5× magic damage, and the target is turned to Stone: it skips its next turn and can’t counter. Bosses and an Aegis are immune.'},
  constrict:{n:'Constrict',cd:3,side:'foe',r:[1,1],dmg:.8,st:['root',1],psn:1,d:'0.8× damage; the target is Rooted and Poisoned.'},
  mudSpit:{n:'Mud Spit',cd:3,side:'foe',r:[2,3],dmg:.8,st:['chill',1],d:'0.8× damage from 2–3 tiles away, and the target is Slowed.'},
  engulf:{n:'Engulf',cd:3,side:'foe',r:[1,1],dmg:1,st:['blind',2],d:'1.0× damage, and the target is Blinded for 2 turns.'},
  howl:{n:'Howl',cd:4,side:'self',shape:'burst2',give:['rally',2],others:1,d:'Allies within 2 tiles are Rallied (+2 Str, +2 Def) for 2 turns.'},
  hamstring:{n:'Hamstring',cd:3,side:'foe',r:[1,1],dmg:.8,st:['chill',1],d:'0.8× damage, and the target is Slowed.'},
  frostBite:{n:'Frost Bite',cd:3,side:'foe',r:[1,1],dmg:1,st:['chill',1],d:'1.0× damage, and the target is Slowed.'},
  graspingRoots:{n:'Grasping Roots',cd:3,side:'foe',r:[1,3],st:['root',1],d:'Roots burst from the ground up to 3 away: the target is Rooted.'},
  barkSkin:{n:'Bark Skin',cd:4,side:'self',solo:1,self:[['guard',1]],d:'Guard (30% less damage) until its next turn.'},
  maul:{n:'Maul',cd:3,side:'foe',r:[1,1],dmg:1.5,st:['sunder',2],d:'1.5× damage, and the target is Sundered (−3 Def) for 2 turns.'},
  roar:{n:'Roar',cd:4,side:'self',shape:'burst2',st:['weak',1],d:'Enemies within 2 tiles are Weakened (deal 30% less damage).'},
  fireball:{n:'Fireball',cd:3,mag:1,el:'fire',side:'foe',r:[2,3],dmg:.8,st:['burn',2],d:'A fireball from 2–3 tiles away: 0.8× magic damage and Burn.'},
  flicker:{n:'Flicker',cd:3,side:'tile',r:[1,4],d:'Blinks to an empty tile up to 4 away.'},
  moltenFist:{n:'Molten Fist',cd:3,side:'foe',r:[1,1],dmg:1.2,st:['burn',2],d:'1.2× damage and Burn.'},
  eruption:{n:'Eruption',cd:4,side:'self',shape:'burst1',dmg:.8,d:'0.8× damage to every enemy around it.'},
  searingBreath:{n:'Searing Breath',cd:3,mag:1,el:'fire',side:'foe',r:[1,1],shape:'cone',aim:'dir',dmg:1,st:['burn',2],d:'A cone of fire (4 tiles): 1.0× magic damage and Burn.'},
  wingGust:{n:'Wing Gust',snd:'wind',cd:4,side:'self',shape:'burst2',dmg:.5,push:1,d:'0.5× damage and push 1 to every enemy within 2 tiles.'},
  burrow:{n:'Burrow',cd:3,side:'tile',r:[1,4],shape:'area',dmg:1,d:'Tunnels to an empty tile up to 4 away and bursts out: 1.0× damage to every enemy around it.'},
  sandBlast:{n:'Sand Blast',cd:3,side:'foe',r:[1,1],shape:'cone',aim:'dir',dmg:.8,st:['blind',2],d:'A cone of sand (4 tiles): 0.8× damage and Blind.'},
  clubSmash:{n:'Club Smash',cd:3,side:'foe',r:[1,1],dmg:1.5,d:'1.5× damage.'},
  deathRoll:{n:'Death Roll',snd:'water',fx:krondisRollFx,cd:3,side:'foe',r:[1,1],dmg:.5,hits:3,d:'Grabs and rolls: three hits of 0.5× damage.'},
  stalagmite:{n:'Stalagmite',cd:3,side:'foe',r:[1,3],dmg:1,flat:5,st:['chill',1],d:'Pyrite bursts up under a target up to 3 away: 5 damage (ignores Def), and the target is Slowed.'},
  sandStream:{n:'Sand Stream',cd:3,side:'foe',r:[1,3],st:['sandEyes',2],d:'Sand in the eyes of a target up to 3 away: −10 Hit for 2 turns.'},
  sandBurn:{n:'Sand Burn',cd:3,side:'foe',r:[1,2],dmg:.6,st:['burn',2],d:'Scalding sand from up to 2 away: 0.6× damage and Burn.'},
  groundSlam:{n:'Ground Slam',cd:3,side:'self',shape:'burst1',dmg:.7,d:'0.7× damage to every enemy around it.'},
  charge:{n:'Charge',cd:3,side:'foe',r:[1,2],dmg:1.2,charge:1,d:'Charges a target up to 2 away (one tile further than it can reach): 1.2× damage.'},
  iceBlitz:{n:'Ice Blitz',snd:'ice',cd:3,mag:1,el:'water',side:'foe',r:[1,2],dmg:.4,hits:3,d:'Three shards of ice from up to 2 away: three hits of 0.4× magic damage.'},
  iceSpray:{n:'Ice Spray',snd:'ice',cd:3,side:'foe',r:[1,1],shape:'cone',aim:'dir',dmg:.8,st:['chill',1],d:'A cone of ice (4 tiles): 0.8× damage and Slow.'},
  flameBite:{n:'Flame Bite',cd:3,side:'foe',r:[1,1],dmg:1,st:['burn',2],d:'1.0× damage and Burn.'},
  ripAndTear:{n:'Rip and Tear',cd:3,side:'foe',r:[1,1],dmg:1,wounded:[.75,1.2],d:'1.0× damage, or 1.2× if the target is below 75% HP.'},
  slime:{n:'Slime',cd:3,side:'foe',r:[1,2],dmg:.6,psn:1,d:'0.6× damage from up to 2 away, and the target is Poisoned.'},
  gemRush:{n:'Gem Rush',cd:3,side:'foe',r:[1,1],dmg:1.4,recoil:2,d:'1.4× damage. If it misses, the user takes 2 damage.'},
  hunkerDown:{n:'Hunker Down',once:1,side:'self',solo:1,self:[['shell',99]],when:u=>u.hp*2<u.maxhp,d:'Below half HP: withdraws into her shell and her amethysts grow, +2 Def and +2 Res for the rest of the fight.'},
  regenerate:{n:'Regenerate',cd:4,side:'self',solo:1,healPct:.3,d:'Heals 30% of its max HP.'}
});
const MKITS={
  Lamia:['stoneGaze','constrict'],MudMonster:['mudSpit','engulf'],
  Wolf:['howl','hamstring'],BlightedTreant:['graspingRoots','barkSkin'],HollowBear:['maul','roar'],
  FireSprite:['fireball','flicker'],BoulderGolem:['moltenFist','eruption'],MagmaDragon:['searingBreath','wingGust'],
  SandWorm:['burrow','sandBlast'],Krondis:['deathRoll'],PyriteColossus:['stalagmite'],SandstoneGolem:['sandStream','sandBurn'],Yeti:['groundSlam'],CursedStag:['charge'],FrostSprite:['iceBlitz'],AmethystTurtle:['hunkerDown'],FrostWolf:['frostBite','howl'],Jackal:['ripAndTear'],BogLurker:['slime'],GemGolem:['gemRush'],CrystalSentinel:['gemRush'],IceWorm:['burrow','iceSpray'],HellHound:['flameBite','howl'],IceTroll:['clubSmash','regenerate']
};
/* the Moves block on an enemy's Details sheet */
function monSheet(u){const l=u.team==='e'?MKITS[u.cls]:null;if(!l)return'';
  return`<div class="sskill"><div class="skh"><span class="sl">Moves</span></div><div class="skl">${l.map(id=>{const a=ABIL[id],cd=(u.cd||{})[id]||0;return`<div class="skr"><b>${a.n}</b><span class="tag">${cd?`Ready in ${cd}`:'Ready'} · CD ${a.cd}</span><small>${a.d}</small></div>`}).join('')}</div></div>`}
/* the moves line on an enemy's info card */
function monMoves(u){const l=u.team==='e'?MKITS[u.cls]:null;if(!l)return'';return`<div class="eq">Moves: ${l.map(id=>{const cd=(u.cd||{})[id]||0;return`<b class="sk" title="${ABIL[id].d}">${ABIL[id].n}</b>${cd?` (ready in ${cd})`:''}`}).join(' · ')}</div>`}
const mpMax=u=>(kitOf(u)||{mp:0}).mp;
const MP_REGEN=2;
/* abilities are a little less accurate than a basic attack */
const ABIL_HIT=-10;
/* MP cost after Attunement */
function abCost(u,id){const a=ABIL[id];if(!a.mp)return 0;return Math.max(0,a.mp-(has(u,'attunement')&&u.lastEl&&a.el&&u.lastEl!==a.el?2:0))}
/* why an ability can't be used right now (null if it can) */
function abBlock(u,id){const a=ABIL[id],cd=(u.cd||{})[id]||0;if(a.once&&cd>0)return'Used this fight';if(cd>0)return`Ready in ${cd} turn${cd>1?'s':''}`;if(a.mp&&(u.mp||0)<abCost(u,id))return'Not enough MP';
  if(a.side!=='self'&&!aimTiles(u,id).size)return'No target in range';return null}

/* ---- combat hooks (called from calc, reach and the turn loop) ---- */
/* the last step of every damage roll: Weak, Guard, Bulwark, Shield Up */
/* br (optional): collects [label, multiplier] for the dev-mode breakdown */
function dmgMods(x,y,ctx,dmg,br){
  let m=1;const f=(l,v)=>{m*=v;if(br)br.push([l,v])};if(hasSt(x,'weak'))f('Weak',.7);if(hasSt(x,'anthem'))f('Anthem',1.3);else if(hasSt(x,'valour'))f('Valour',1.2);if(hasSt(y,'guard'))f('Target on Guard',.7);if(hasSt(x,'shieldUp')&&ctx&&ctx.init!==x)f('Shield Up counter',1.3);
  if(man(x,y)>1&&state.units.some(o=>o!==y&&o.hp>0&&o.team===y.team&&man(o,y)===1&&has(o,'bulwarkAura')))f('Bulwark aura vs ranged',.7);
  return Math.max(0,Math.round(dmg*m));
}
/* Pow/Def/Hit/Avoid/Crit changes from statuses and passives, added inside calc() */
function stCalc(x,xw,y){
  const phys=!xw.mag,fx=x.hp>=x.maxhp,fy=y.hp>=y.maxhp;
  return{pow:(hasSt(x,'rally')&&phys?2:0),df:(phys&&hasSt(y,'rally')?2:0)-(phys&&hasSt(y,'sunder')?3:0)+(hasSt(y,'shell')?2:0)+(phys&&has(y,'plate')?2:0)+(phys&&hasSt(y,'iceShield')?3:0),
    acc:(hasSt(x,'blind')?-20:0)+(hasSt(x,'sandEyes')?-10:0)+(hasSt(x,'anthem')?10:0)+(state.units.some(o=>o!==x&&o.hp>0&&o.team===x.team&&has(o,'audience')&&man(o,x)<=2)?10:0),avo:(hasSt(y,'smoke')?30:0)+(has(y,'beginnersLuck')&&fy?10:0),crit:(has(x,'beginnersLuck')&&fx?10:0)};
}
const eagle=(u,w)=>w&&w.t==='bow'&&has(u,'eagleEye')?1:0;
/* zone of control: starting next to a hostile unit costs 1 Move (Slippery ignores it). Doesn't stack with Slow: the bigger penalty applies */
const zoc=u=>!has(u,'slippery')&&state.units.some(o=>o.hp>0&&hostile(o,u)&&man(o,u)===1);
const stMov=u=>Math.max(hasSt(u,'chill')?2:0,zoc(u)?1:0);

/* ---- shapes and targets ---- */
const inB=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH;
function abRange(u,id){const a=ABIL[id];if(a.r!=='wpn')return a.r;let r0=9,r1=0;u.items.forEach(it=>{const w=IT[it.k];if(isWpn(it.k)&&canUse(u,it.k)){r0=Math.min(r0,w.r[0]);r1=Math.max(r1,w.r[1]+eagle(u,w))}});return r1?[r0,r1]:[1,1]}
/* the tiles an ability touches when aimed at (tx,ty) */
function shapeTiles(u,id,tx,ty){
  const a=ABIL[id],sh=a.shape||'one',out=[];const add=(x,y)=>{if(inB(x,y))out.push([x,y])};
  if(a.side==='self'){const R=sh==='burst2'?2:1,z=u.sz||1;for(let y=u.y-R;y<u.y+z+R;y++)for(let x=u.x-R;x<u.x+z+R;x++){const d=man(u,{x,y});if(!d)continue;if(sh==='burst2'?d<=2:Math.max(Math.max(0,u.x-x,x-(u.x+z-1)),Math.max(0,u.y-y,y-(u.y+z-1)))<=1)add(x,y)}return out}
  if(sh==='one')add(tx,ty);
  else if(sh==='cross'){add(tx,ty);for(const[dx,dy]of DIRS)add(tx+dx,ty+dy)}
  else if(sh==='wall'){const ac=Math.abs(tx-u.x)>=Math.abs(ty-u.y);for(let s=-1;s<=1;s++)add(tx+(ac?0:s),ty+(ac?s:0))}
  else if(sh==='area'){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)add(tx+dx,ty+dy)}
  else{const dx=Math.sign(tx-u.x),dy=Math.sign(ty-u.y),px=-dy,py=dx;
    if(sh==='pierce'){add(u.x+dx,u.y+dy);add(u.x+2*dx,u.y+2*dy)}
    if(sh==='cone')for(let d=1;d<=2;d++)for(let s=-(d-1);s<=d-1;s++)add(u.x+dx*d+px*s,u.y+dy*d+py*s)}
  return out;
}
/* the units an ability hits when aimed at (tx,ty): {foes, allies} */
function abHits(u,id,tx,ty){
  const a=ABIL[id],ts=shapeTiles(u,id,tx,ty),seen=new Set(),foes=[],allies=[];
  for(const[x,y]of ts){const o=unitAt(x,y);if(!o||o.hp<=0||seen.has(o.id))continue;seen.add(o.id);if(hostile(o,u))foes.push(o);else if(o!==u)allies.push(o)}
  if(a.side==='ally'&&ts.some(([x,y])=>x===u.x&&y===u.y))allies.unshift(u);
  if(a.side==='self'&&(a.give||a.self)&&!a.others&&!allies.includes(u))allies.unshift(u);
  if(a.solo)return{foes:[],allies:[u]};
  return{foes:a.side==='ally'?[]:foes,allies:a.side==='foe'||a.side==='tile'?[]:allies};
}
/* where an ability can be aimed: a Set of tile keys */
function aimTiles(u,id){
  const a=ABIL[id],[r0,r1]=abRange(u,id)||[0,0],s=new Set();
  if(a.side==='self'){s.add(key(u.x,u.y));return s}
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const d=Math.abs(x-u.x)+Math.abs(y-u.y);if(d<r0||d>r1)continue;
    if(a.aim==='dir'){if(d===1&&abHits(u,id,x,y).foes.length)s.add(key(x,y));continue}
    if(a.side==='tile'){const o=unitAt(x,y);if(!o&&mcost(u,x,y)<99)s.add(key(x,y));continue}
    if(a.aim==='any'){const h=abHits(u,id,x,y);if((a.side==='ally'?h.allies:h.foes).length)s.add(key(x,y));continue}
    const o=unitAt(x,y);if(o&&o.hp>0&&(a.side==='foe'?hostile(o,u):!hostile(o,u)&&(o!==u||r0===0)&&(!a.encore||o.acted)))s.add(key(x,y))}
  return s;
}

/* ---- damage and healing numbers (used by the forecast and when the ability goes off) ---- */
function abWeapon(u,a){
  if(a.mag){const i=u.items.findIndex(it=>IT[it.k].t==='art'&&canUse(u,it.k));const w=i>=0?IT[u.items[i].k]:{mt:4,hit:90,t:'art',mag:true};return Object.assign({},w,{el:a.el||w.el,mag:true})}
  const i=eqIdx(u);return i>=0?IT[u.items[i].k]:{n:'Fists',mt:0,hit:85,t:'blade',r:[1,1]};
}
function abBackstab(u,t){return hDiff(u,t)>0||state.units.some(o=>o!==u&&o.team===u.team&&o.hp>0&&man(o,t)===1)}
/* expected numbers against one target: {dmg (per strike), hit, n (strikes)} */
function abVs(u,id,t,mult){
  const a=ABIL[id],w=abWeapon(u,a),c=calc(u,w,t,null,{init:u,phase});let m=(mult||a.dmg||0);if(a.backstab&&abBackstab(u,t))m*=2;if(!mult&&a.wounded&&t.hp<t.maxhp*a.wounded[0])m=a.wounded[1];
  return{dmg:a.flat||dmgMods(u,t,{init:u},Math.max(0,Math.round(c.pow*m)-c.df)),hit:a.sure?100:clamp(c.hit+(a.hit||0)+ABIL_HIT,0,100),n:a.hits||1,eff:c.eff,c,m};
}
function healAmt(u,id,t){const a=ABIL[id];let h=a.healPct?Math.round(t.maxhp*a.healPct):Math.round((u.mag+5)*a.heal);if(has(u,'lastLight')&&t.hp*2<t.maxhp)h=Math.round(h*1.5);return Math.min(h,t.maxhp-t.hp)}
/* who Chain Lightning jumps to */
function chainTo(u,id,t){const a=ABIL[id],out=[];let at=t;for(let i=0;i<a.chain[0];i++){const n=state.units.filter(o=>o!==t&&!out.includes(o)&&o.hp>0&&hostile(o,u)&&man(o,at)<=2).sort((p,q)=>man(p,at)-man(q,at))[0];if(!n)break;out.push(n);at=n}return out}

/* ---- pushing ---- */
const canPush=t=>!(t.sz>1)&&!t.boss&&!has(t,'ironBody')&&!hasSt(t,'steady');
function pushUnit(u,t,n){
  if(!canPush(t)){pop(t,'Unmoved','miss');return 0}
  let dx=t.x-u.x,dy=t.y-u.y;if(Math.abs(dx)>=Math.abs(dy)){dx=Math.sign(dx);dy=0}else{dy=Math.sign(dy);dx=0}let hurt=0;
  for(let i=0;i<n;i++){const nx=t.x+dx,ny=t.y+dy,o=inB(nx,ny)&&unitAt(nx,ny);
    if(!inB(nx,ny)||mcost(t,nx,ny)>=99||o||hOf(nx,ny)-hOf(t.x,t.y)>jumpOf(t)){const d=Math.min(3,t.hp);t.hp-=d;hurt+=d;pop(t,'Slam -'+d,'dmg');sfx('earth');break}
    const fall=hOf(t.x,t.y)-hOf(nx,ny);t.x=nx;t.y=ny;if(fall>=2){const d=Math.min(2*fall,t.hp);t.hp-=d;hurt+=d;pop(t,'Fall -'+d,'dmg')}}
  return hurt;
}

/* ---- using an ability ---- */
async function useAbility(u,id,tx,ty){
  const a=ABIL[id];busy=true;
  if(a.mp){u.mp-=abCost(u,id);if(a.el)u.lastEl=a.el}if(a.cd)(u.cd=u.cd||{})[id]=a.cd;if(a.once)(u.cd=u.cd||{})[id]=99;
  pop(u,a.n,'heal');await sleep(D(350));
  if(a.wall){(state.ice=state.ice||{});for(const[x,y]of shapeTiles(u,id,tx,ty))if(!unitAt(x,y)&&ter(x,y).c<99)state.ice[key(x,y)]=a.wall;sfx('ice');render();await sleep(D(250))}
  else if(a.side==='tile'){stepSfx(u,tx,ty);u.x=tx;u.y=ty;render();await sleep(D(250));sfx('earth');shake()}
  /* Charge: run up next to the target first (the free tile beside it nearest the charger) */
  if(a.charge){const t=unitAt(tx,ty);if(t&&man(u,t)>1){const opts=DIRS.map(([dx,dy])=>({x:t.x+dx,y:t.y+dy})).filter(p=>p.x>=0&&p.y>=0&&p.x<MW&&p.y<MH&&!unitAt(p.x,p.y)&&mcost(u,p.x,p.y)<99).sort((p,q)=>man(u,p)-man(u,q));
    if(opts[0]){stepSfx(u,opts[0].x,opts[0].y);u.x=opts[0].x;u.y=opts[0].y;render();await sleep(D(200))}}}
  const{foes,allies}=abHits(u,id,tx,ty),w=abWeapon(u,a),killed=[];let exp=0,elSnd=a.snd||(a.mag?(/^frost/.test(id)?'ice':hitSfx(w,true)):null);
  /* damage */
  for(const t of foes){
    const ranged=a.mag||man(u,t)>1;let landed=true;if(!a.dmg){/* status only: still has to hit */if(a.st){landed=(rn()+rn())/2<abVs(u,id,t).hit;if(!landed){sfx('miss');pop(t,'Miss','miss');mapPose(t,'dodge',u);await sleep(D(220));mapPose(t,'idle')}}}
    else{const n=a.hits||1,V=abVs(u,id,t);let total=0;
      for(let k=0;k<n&&t.hp>0;k++){if(a.mag||a.snd){sfx(elSnd);elSnd=null}else sfx(ranged?'arrow':hitSfx(w,false));if(a.fx){if(!k)await a.fx(u,t)}else if(ranged&&(a.shape||'one')==='one'||!ranged)await swingAt(u,t,w,false,ranged);else mapPose(u,'swing',t);
        if((rn()+rn())/2<V.hit){const d=Math.min(V.dmg,t.hp);t.hp-=d;total+=d;sfx('hit');pop(t,'-'+d,'dmg');flash(t);if(a.mag)burst(t,EL_COL[a.el]||'#c8b8ff')}else{sfx('miss');pop(t,'Miss','miss');mapPose(t,'dodge',u)}
        await sleep(D(n>1?160:220));mapPose(u,'idle');mapPose(t,'idle');render();await sleep(D(n>1?60:110))}
      landed=total>0;
      if(a.recoil&&!total&&u.hp>1){const d=Math.min(a.recoil,u.hp-1);u.hp-=d;pop(u,'-'+d,'dmg');flash(u);render();await sleep(D(200))}
      if(total&&has(u,'siphon')&&a.el==='dark'){const h=Math.min(Math.ceil(total/4),u.maxhp-u.hp);if(h){u.hp+=h;pop(u,'+'+h,'heal')}}
      exp+=expFor(u,t,total>0,t.hp<=0);
      if(t.hp>0&&total&&a.push){pushUnit(u,t,a.push);render();await sleep(D(250))}
      if(a.chain&&t.hp>0||a.chain)for(const c of chainTo(u,id,t)){const V2=abVs(u,id,c,a.chain[1]);sfx('thunder');burst(c,EL_COL.lightning);
        if((rn()+rn())/2<V2.hit){const d=Math.min(V2.dmg,c.hp);c.hp-=d;pop(c,'-'+d,'dmg');flash(c);exp+=expFor(u,c,true,c.hp<=0);if(c.hp<=0)killed.push(c)}else pop(c,'Miss','miss');render();await sleep(D(260))}
      if(t.hp<=0){killed.push(t);continue}}
    if(a.st&&landed&&t.hp>0&&!stImmune(t,a.st[0])&&(!a.st[2]||rn()<a.st[2]*100)){addSt(t,a.st[0],a.st[1],u);if(STATUS[a.st[0]].bad)sfx(a.st[0]==='chill'?'slow':'debuff');pop(t,STATUS[a.st[0]].n,'crit');await sleep(D(200))}
    if(a.psn&&landed&&t.hp>0&&!(t.team==='p'&&M('soup'))){t.psn=3;sfx('poison');pop(t,'Poisoned','crit');await sleep(D(200))}
    if(a.stone&&landed&&t.hp>0&&!stImmune(t,'stone')){t.stone=1;pop(t,'Stone!','crit');sfx('earth');toast(`${t.name} is turned to stone and loses ${t.team==='p'?'their':'its'} next turn`);await sleep(D(200))}
    if(!a.dmg)exp+=10;
  }
  /* healing, buffs, cures */
  for(const t of allies){
    if(a.heal||a.healPct){const h=healAmt(u,id,t);if(h){t.hp+=h;pop(t,'+'+h,'heal')}exp+=12}
    if(a.cure){let c=0;if(t.st)for(const k of Object.keys(t.st))if(STATUS[k]&&STATUS[k].bad){delete t.st[k];c=1}if(t.psn){t.psn=0;c=1}if(t.stone){t.stone=0;c=1}if(c){pop(t,'Cured','heal');exp+=6}}
    if(a.give){addSt(t,a.give[0],a.give[1],u);pop(t,STATUS[a.give[0]].n,'heal');exp+=6}
    if(a.encore){t.acted=false;pop(t,'Encore!','heal');exp+=10}
  }
  if(a.heal||a.healPct||a.give||a.cure||a.encore)sfx('heal');
  for(const[k,n]of a.self||[]){addSt(u,k,n,u);pop(u,STATUS[k].n,'heal')}
  render();await sleep(D(300));
  /* defeated enemies: relic heal, drops and gold, as in a normal fight */
  for(const o of new Set(killed)){if(R('fang')&&u.hp>0){const h=Math.min(5,u.maxhp-u.hp);if(h){u.hp+=h;pop(u,'+'+h,'heal')}}
    for(const it of o.items.filter(i=>i.d)){(state.loot=state.loot||[]).push(it.k);sfx('item');notify(`${IT[it.k].n} dropped`,'Added to the spoils: choose who takes it after the fight.',icon(it.k))}
    if(o.team==='e'&&!o.summon)dropGold()}
  if(u.team==='p'&&u.hp>0&&exp){const g=gainExp(u,Math.min(100,Math.round(Math.max(10,exp)*EXP_RATE*(R('tome')?1.5:1)*(has(u,'quickStudy')?2:1))));await showExp(u,g);if(g&&g.gains)await levelUp(u,g)}
  for(const o of foes)if(o.team==='p'&&o.hp<=0&&R('phoenix')&&!run.phx){o.hp=Math.min(10,o.maxhp);run.phx=1;pop(o,'Phoenix!','heal');sfx('rise');toast(`The Phoenix Feather saves ${o.name}`)}
  state.units=state.units.filter(o=>o.hp>0);busy=false;render();checkEnd();
}
/* Tumble: a free 2-tile move that ignores height, then back to the command menu */
function tumbleSet(u){const s=new Set([key(u.x,u.y)]);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=u.x+dx,y=u.y+dy;if(Math.abs(dx)+Math.abs(dy)>2||!inB(x,y))continue;if(!unitAt(x,y)&&mcost(u,x,y)<99)s.add(key(x,y))}return s}

/* ---- phase hooks ---- */
/* a battle starts: full MP, no cooldowns or statuses */
function abReset(us){for(const u of us){u.mp=mpMax(u);u.cd={};u.st={};delete u.lastEl}}
/* your phase starts: MP back, cooldowns tick, your buffs fade, burns hurt, stunned units sit out */
function abPlayerStart(){if(state.ice)for(const k in state.ice)if(--state.ice[k]<=0)delete state.ice[k];for(const u of state.units)if(u.team==='p'){if(mpMax(u))u.mp=Math.min(mpMax(u),(u.mp||0)+MP_REGEN);for(const k in u.cd||{})if(u.cd[k]>0)u.cd[k]--}
  tickSt('p','start');burnTick('p');for(const u of state.units)if(u.team==='p'&&hasSt(u,'stun')){u.acted=true;pop(u,'Stunned','miss')}}

/* ---- the Abilities menu, aiming and the forecast ---- */
let abSel=null,abT=null,aimSet=null;
const SHAPE_N={one:'',cross:'Cross',area:'3×3 area',burst1:'Around the user',burst2:'Within 2 of the user',pierce:'2 tiles in a line',cone:'Cone, 4 tiles'};
function abCostTxt(u,id){const a=ABIL[id];return a.mp?`${abCost(u,id)} MP${a.once?' · once':''}`:`CD ${a.cd}`}
function abRangeTxt(u,id){const a=ABIL[id];if(a.side==='self')return SHAPE_N[a.shape]||'Self';const r=abRange(u,id);return`Rng ${r[0]===r[1]?r[0]:r[0]+'–'+r[1]}${a.shape&&a.shape!=='one'?' · '+SHAPE_N[a.shape]:''}`}
function mpLine(u){const m=mpMax(u);return m?`<div class="mpl"><span class="bar"><i style="width:${(u.mp||0)/m*100}%"></i></span><span>${u.mp||0}/${m} MP</span></div>`:''}
function stChips(u){const l=stList(u).map(k=>[STATUS[k].n,STATUS[k].d,STATUS[k].bad,u.st[k].n]);if(u.psn)l.push(['Poison','Takes 2 damage at the start of each of its turns (never below 1 HP). A Salve cures it.',1,u.psn]);if(u.stone)l.push(['Stone','Skips its next turn and can’t counter.',1,1]);if(state&&state.units&&state.units.includes(u)&&u.hp>0&&!hasSt(u,'chill')&&zoc(u))l.push(['Engaged','Next to an enemy: −1 Move.',1,1]);
  return l.length?`<div class="stc">${l.map(([n,d,bad,t])=>`<span class="st ${bad?'bad':'good'}" title="${d}">${n}${t>1&&t<50?' '+t:''}</span>`).join('')}</div>`:''}
/* the list of a unit's abilities (floating menu) */
function abList(u){
  return`<div class="abl"><div class="abl-h"><b>Abilities</b>${mpMax(u)?`<span>${u.mp||0}/${mpMax(u)} MP</span>`:''}</div>${abilOf(u).map(id=>{const a=ABIL[id],why=abBlock(u,id);
    return`<button type="button" class="ab${why?' off':''}" data-act="ab:${id}"${why?' disabled':''}><span class="abn">${a.n}<i>${abCostTxt(u,id)}</i></span><span class="abr">${abRangeTxt(u,id)}${a.free?' · Free':''}</span><span class="abd">${why?`<em>${why}.</em> `:''}${a.d}</span></button>`}).join('')}
    <button type="button" data-act="menu">Back</button></div>`;
}
/* the forecast for an aimed ability */
function abForecast(u,id,tx,ty){
  const a=ABIL[id],{foes,allies}=abHits(u,id,tx,ty),rows=[];
  for(const t of foes){let txt='';if(a.dmg){const V=abVs(u,id,t),tot=V.dmg*V.n;txt=`<b>${V.dmg}${V.n>1?' ×'+V.n:''}</b> dmg · <b>${V.hit}%</b> · ${t.hp}→${Math.max(0,t.hp-tot)} HP${V.eff?' · <span class="effv">Effective</span>':''}`;
      if(a.chain)txt+=` · jumps to ${chainTo(u,id,t).map(c=>`${c.name} (${abVs(u,id,c,a.chain[1]).dmg})`).join(', ')||'nobody'}`;if(a.push)txt+=canPush(t)?` · push ${a.push}`:' · can’t be pushed'}
    if(a.st)txt+=`${txt?' · ':''}${STATUS[a.st[0]].n}${a.st[2]?` (${a.st[2]*100}%)`:''}${a.dmg?'':` · <b>${abVs(u,id,t).hit}%</b>`}`;if(!txt)continue;rows.push(`<div class="abf-r"><span class="ec">${t.name}</span>${txt}</div>`)}
  for(const t of allies){let txt='';if(a.heal)txt=`+<b>${healAmt(u,id,t)}</b> HP → ${t.hp+healAmt(u,id,t)}/${t.maxhp}`;if(a.cure){const c=[...stList(t).filter(k=>STATUS[k].bad).map(k=>STATUS[k].n),...(t.psn?['Poison']:[]),...(t.stone?['Stone']:[])];if(c.length)txt+=`${txt?' · ':''}cures ${c.join(', ')}`;else if(!a.heal)txt='nothing to cure'}if(a.give)txt+=`${txt?' · ':''}${STATUS[a.give[0]].n}`;if(!txt&&!a.heal)continue;rows.push(`<div class="abf-r"><span class="pc">${t.name}</span>${txt||'–'}</div>`)}
  for(const[k]of a.self||[])rows.push(`<div class="abf-r"><span class="pc">${u.name}</span>${STATUS[k].n}: ${STATUS[k].d}</div>`);
  if(a.side==='tile')rows.unshift(`<div class="abf-r"><span class="pc">${u.name}</span>leaps here</div>`);
  if(a.tumble)rows.push(`<div class="abf-r"><span class="pc">${u.name}</span>moves up to 2 tiles, then can still act</div>`);
  return`<div class="ufc-h"><span class="pc">${u.name}</span><b class="abfn">${a.n}</b><span class="abfc">${abCostTxt(u,id)}</span></div>${rows.join('')||'<div class="abf-r">Nobody is in the area.</div>'}
    <div class="ufc-b"><button class="go" type="button" data-act="abuse">Use</button><button type="button" data-act="abil">Back</button></div>`+(a.dmg?devPanel(foes.map(t=>{const V=abVs(u,id,t);return devBreak(u,t,V.c,{n:a.n,m:V.m,flat:a.flat,dmg:V.dmg,hit:V.hit,hitAdd:a.sure?0:(a.hit||0)+ABIL_HIT,sure:a.sure,hits:a.hits||1})})):'');
}
/* the panel and floating menu for the 'abil' and 'aim' states */
function abPanel(u){
  if(ui==='abil')return{h:card(u)+'<p class="hint">Choose an ability.</p>',fm:abList(u)};
  const a=ABIL[abSel];
  if(abT)return{h:card(u)+`<p class="hint">${a.n}: click the same tile again, or press Use.</p>`,fm:abForecast(u,abSel,abT.x,abT.y)};
  return{h:card(u)+`<p class="hint">${a.n}: ${a.side==='tile'?'click a tile to leap to':a.aim==='dir'?'click a direction next to '+u.name:a.side==='ally'?'click an ally':a.aim==='any'?'click where to aim it':'click a target'}.</p>`,fm:`<div class="acts"><button type="button" data-act="abil">Back</button></div>`};
}
/* the tiles to light up while aiming: range (aimSet) and the area of the chosen tile */
function abTileCls(k){if(ui!=='aim'||!abSel)return null;const a=ABIL[abSel],out=[];
  if(aimSet&&aimSet.has(k))out.push(a.side==='ally'?'hl':'atk');
  if(abT){const u=byId(sel);if(u&&shapeTiles(u,abSel,abT.x,abT.y).some(([x,y])=>key(x,y)===k))out.push('tg','cur');if(a.side!=='self'&&k===key(abT.x,abT.y))out.push('cur')}
  return out}
/* actions: open the list, pick an ability, use it */
async function abAct(u,a){
  if(a==='abil'){abSel=null;abT=null;aimSet=null;ui='abil';render();return}
  if(a.startsWith('ab:')){const id=a.slice(3);if(abBlock(u,id))return;abSel=id;const A=ABIL[id];
    if(A.tumble){if(A.cd)(u.cd=u.cd||{})[id]=A.cd;abSel=null;moveSet=tumbleSet(u);fringe=new Set();u.tumbled=1;ui='move';sfx('select');render();return}
    aimSet=aimTiles(u,id);abT=A.side==='self'?{x:u.x,y:u.y}:null;ui='aim';sfx('select');render();return}
  if(a==='abuse'&&abSel&&abT){const id=abSel,t=abT;commit();abSel=null;abT=null;aimSet=null;clearSel();ui='idle';await useAbility(u,id,t.x,t.y);if(over)return;
    if(ABIL[id].free&&u.hp>0){u.acted=false}saveGame();promptEnd();render();return}
}
function abTap(x,y){const k=key(x,y),u=byId(sel);if(!aimSet||!aimSet.has(k)){if(ABIL[abSel].side==='self')return;abT=null;ui='abil';render();return}
  if(abT&&abT.x===x&&abT.y===y){act('abuse');return}abT={x,y};sfx('select');render()}
