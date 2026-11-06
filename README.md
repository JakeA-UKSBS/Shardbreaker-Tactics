# Shardbreaker Tactics

An isometric, height-based fork of Shardbreaker (FFTA / Tactics Ogre style) with inspiration from GBA Fire emblem games. See [docs/DESIGN.md](docs/DESIGN.md) for where it's heading and what's built so far. Below is the original Shardbreaker readme.

See [docs/VISUALS.md](docs/VISUALS.md) for pictures of every region, boss, monster, class, weapon, tile and scene, and [docs/INFO.md](docs/INFO.md) for the numbers: recruit odds, base stats and growths, weapons, effectiveness, skills, relics and regions.

## Run it
Open `index.html` in a browser (or serve the folder, e.g. VS Code's Live Server). `index.html` is just the page shell; the styles are in `css/style.css` and the game is split into numbered files in `js/`, loaded in order (plain scripts sharing one global scope, no build step). On PC: Esc or right-click backs out of a move or menu, E ends the turn, the mouse wheel zooms.

The fixed art (tiles, icons, relics, scenes, backdrops) loads from PNGs in `art/`: edit them in any pixel editor and refresh. See [art/README.md](art/README.md) for sizes and the export tool.

## Music
Drop mp3 files into a `music/` folder next to `index.html`: `title.mp3`, `tavern.mp3`, `swamp.mp3`, `forest.mp3`, `mountain.mp3`, `labyrinth.mp3`, `desert.mp3`, `snow.mp3`, `cavern.mp3`, `heart.mp3` (Act 3). Each loops while you're in that region (map and battles). Missing files are skipped. "Sound and music" in Options turns it off.

## Regions
Each run picks 2 of these 6 as its acts (`BIOMES`, `ACTS`). Each has 2-3 battle maps, a boss map, a monster pool and a rule.
| Region | Monsters | Rule | Boss |
| --- | --- | --- | --- |
| Sobek’s Mire | Bog Lurkers, Lamias, Mud Monsters | Starting a turn in ankle-deep water or mangrove roots costs 1 Move; sand is solid | Krondis the alligator |
| Cursed Woodland | Wolves, Cursed Stags, Blighted Treants | Cursed thickets: +25 Avoid, 2 Move to enter | The Hollow Bear |
| Volcanic Isle | Magma Golems, Fire Sprites | Magma blocks foot units; fliers and fire creatures cross it | Pyraxis, the Magma Dragon |
| Sandstone Desert | Jackals, Sand Worms, Sandstone Golems | Quicksand costs 1 Move next turn; sandstone outcrops (cream feldspar with smoky quartz) give cover | The Pyrite Colossus |
| Frostveil Reaches | Frost Wolves, Frost Sprites, Agate Golems, Ice Trolls (placeholder art) | Deep snow costs 1 Move next turn (snow creatures ignore it); frozen lakes −10 Avoid; blue agate gives cover | The Yeti (placeholder art) |
| Gemstone Caverns | Gemsnails, Gem Golems | Emerald, ruby and sapphire clusters give cover; walls are iridescent rock | Amethyra, the Amethyst Turtle |

Only creatures are enemies; there are no human foes.

Defend fights: from floor 2, a quarter of normal battles are a settlement to hold for 5-7 turns, with monsters arriving from the top of the map each turn (`TOWN`, `town_<region>` maps, each region's `town` ground and cover). 


## A run
- Title subtitle: "Break the blight". Battle titles say what the fight is ("Battle", "Elite Battle", "Defend the Settlement"); boss fights use the boss's name.
- Early ease: in Act 1, enemies deal 3 less damage on floors 1-3, 2 less on 4-6 and 1 less on 7-9; the first two floors have 2 enemies.
- A run opens in Ithren the Sage's tent (`sageScene()`): he talks over his crystal ball (4 lines, naming the run's two regions), then asks how deep into the blight to go once Ascension is unlocked. Then the Crossroads (`musterScene()`): Your candidates stand around a campfire, with the run's two regions on the signpost. Travellers start at Lv 2. Tap travellers to see their card and choose 3, then Set out. Each act's map starts from a flag node at the bottom. Fallen units are gone for the rest of the run; you only lose when the whole squad falls.
- Each act is a branching node map (`genMap()` in `js/18-node-map.js`), following Slay the Spire's map: 15 floors on 4 lanes that cross now and then, then the boss on floor 16. Act 3 is a short straight road instead: tavern, elite, event, camp, then the Crystal Heart.
- Fixed floors: 1 is a battle, 8 a treasure room, 15 a camp (rest) and 16 the boss. Every other floor is rolled from `ROOM_W`:

  | Room | Chance | Rules |
  | --- | --- | --- |
  | Battle | 45% | |
  | Event | 23% | |
  | Camp (rest) | 12% | Not before floor 6, not on floor 14, never twice in a row |
  | Elite | 10% | Not before floor 6, never twice in a row; shown as a horned skull |
  | Tavern | 10% | Never twice in a row |

  A roll that breaks a rule is rolled again, so on floors where a room isn't allowed (camps and elites before floor 6, say) the others come up a little more often.
- On top of the odds, every route through floors 1-14 must have 6-9 fights (elites count) and at least one camp before the fixed one on 15 (`FIGHTS`, `routeOk()`). A lane that fails is rolled again.
- Each map gets 6-8 crossings between neighbouring lanes, never on the same or neighbouring floors, and only where every route still passes those checks.
- Nodes: Battle; Elite (Elder leader, always drops a relic (1 of 2) and a jade weapon for a unit you choose); Recruit (pick 1 of 3; team caps at 6, `TEAM_CAP`); Rest (train one unit +1 level); Treasure (pick 1 of 3 items); Event (`EVENTS`); Tavern; Boss.
- Gold: 30 to start, then 25 per battle, 45 per elite, 80 per boss (`GOLDWIN`). Spent at taverns.
- Tavern (`tavernNode()`): talk to Marla the innkeeper and pick as many options as you can afford before leaving. Drinks (`DRINKS`): a round of ale (+30 EXP for everyone) or a spirit for one unit (+1 to a stat for good). Food (`MEALS`): squad-wide buffs for 2-3 fights (+2 damage, +15 Hit, +2 Def/Res, +1 Move, poison immunity), counted down after each won fight and shown on the map. Sellswords: 3 units for hire at 40 + 15 per level. Rumours: a hint about the region's boss and rule. Music slot: `music/tavern.mp3`.
- Events and Act 2 events: see [docs/EVENTS.md](docs/EVENTS.md).
- Special weapons from events: Jade weapons (Jian, Fang, Spear, Axe, Bow; Crit 30-35), Spark and Thunderhead lightning sigils, Longbow (Rng 2-3), Throwing Knives (Rng 1-2), Far Charm (heals at Rng 1-10), and in Act 2 Meteor Sigil and Heaven's Bolt (Rng 3-10, 5 uses). A unit carrying several charms heals with whichever one reaches.
- Forged weapons use keys like `ironAxe~2` (+2 Mt and +5 Hit per level; charms heal +5), built on demand by `ensureIt()`.
- Enemy strength climbs with floor and act (floors are scaled to a 10-floor curve by `flScale()`, so a longer map doesn't make enemies tougher): Lv 1 on Act 1 floor 1, about Lv 6 by floor 9, Lv 7+ in Act 2. Numbers grow with the floor too. Each region's `pool` lists its monsters with the floor they start appearing on (all are open in Act 2). Elites use the region's tougher `elitePool`, are led by an Elder of its strongest monster, and fight 2 levels higher with one extra enemy.
- Saves cover both the map and battles, so Continue picks up wherever you left off.
- Every run has a seed (shown on the draft and defeat screens). All rolls come from it.

## Where things live
`js/01-data.js` items, weapons, skills · `02-rng-units` random numbers, unit constructors · `03-pixel-art` sprite drawing (`Px`, `fig`, `BIG`) · `05-sound` · `06-rules` combat maths · `07-reach-camera` movement and camera · `08-render` board and unit sheet · `09-battle-scene` fight animation · `09b-battle-rig` posed battle sprites (Fighter, Swordsman) · `10-cutscenes` · `11-modals` · `12-turns` actions, AI, turn loop · `13-save` · `14-units` classes, looks, unit generation · `15-regions-monsters` · `16-maps-battles` maps and `genBattle()` · `17-ui-cards` · `18-node-map` · `19-items-treasure` · `20-events` · `21-progress` achievements and Ascension · `22-relics` · `23-promotion` · `24-tavern` · `25-crossroads-sage` · `26-gear-skills-summons` · `27-run-flow` · `28-startup`. A file can call anything from any other file at run time; only code that runs while the files load has to come after what it uses.

- Region bosses are 2×2 (`u.sz=2`, x/y is the top-left). `man()` measures between footprints and `unitAt()` checks every cell, so movement, range, the danger map and the AI all handle them. Their sprites are 64×64: hand-drawn in `BIG` (the Roc, the Bone Wyrm), otherwise the 32px art doubled.
- `ROLES`, `MOVES`, `KIT`: the class parts. Movement is foot, armoured (Knights only) or mounted (7 move, slowed by forest and hills; names like Lance Cavalier, Troubadour). A class is role + movement + weapon, keyed like `G.skirm.foot.pole.1`. `ensureCls()` builds it, plus its promoted version (`.2`, adds a second weapon type).
- Summoner role (`ROLES.summoner`, unlocked by the Apprentice achievement: finish a run with a Sigilist in the squad): a staff caster (Crook Staff: Rng 1, hits harder; Rune Staff: Rng 1-2; both use Mag) with a Summon action once per battle (twice once promoted). The minion is the Summoner's own bonded familiar (`FAMILIARS`, `u.familiar`, rolled when the unit is made): Spirit Wolf, Stone Warden, Wisp or Spirit Hawk. Familiars are pale-blue translucent spirits, never region creatures. Summons are allies you control (blue glow) but they don't gain EXP themselves (a summon's EXP goes to its Summoner), don't count towards losing, and leave after the battle.
- Stats: units show and level HP, Str or Mag (whichever their class uses), Luck, Spd, Def and Res. Skl is folded into Luck (`foldLuck()`), which drives Hit (Luck×2), Crit (Luck÷2, minus half the foe's Luck; only your units can crit) and skill procs. Every level-up gives +1 to each shown stat.
- Weapon weight (`WT`): each point of Wt above the wielder's Str (Mag for sigils) costs 1 attack speed (`AS()`), which is used for doubling and Avoid. Steel weapons hit harder but weigh more.
- Weapons never break (except Meteor and Heaven’s Bolt, 5 uses each). Weapon range (Rng) is shown next to every weapon in item lists and unit cards. Killer weapons (Moonglass Edge, Barbed Spear, Reaver Axe, Hawkeye Bow, Stiletto) have high crit. Found in treasure rooms.
- Shieldmaiden role (`ROLES.shield`): wields both swords and lances (starts with one), with a shield, on foot or mounted (never armoured). Starts with Guardian (adjacent allies take 2 less damage), Steadfast, Taunt or Spell Ward. Promotes to Shield Warden.
- Knight role (`ROLES.knight`): wields both swords and lances (starts with one); always armoured, with a shield; very high HP and Def, low Res and Spd. Starts with Pike Wall (+4 Def and +10 Hit against mounted units and fliers), Steadfast, Iron Skin or Retaliate. Promotes to General.
- Shields are drawn on the off arm (`L.shield`: round or kite, in team colours).
- Fighter (`ROLES.bruiser`): the hard hitter with an axe or lance; promotes to Warrior.
- Rogues and Summoners always go on foot.
- Swordsman role (`ROLES.sword`): swords only, fast duelist with high Spd and crit; promotes to Swordmaster. Never armoured.
- Rogue role: dagger user (Dirk, Twin Daggers, Stiletto) with +15 class crit; Assassin when promoted.
- Skills (`SKILLS`), on top of the originals: Hit and Run, Quick Draw, Flurry, Whirlwind, Retaliate, Iron Skin, Spell Ward, Momentum, Fleet Foot, Taunt, Quick Study, Early Edge, Wolfsbane (vs claws, fangs, blades), Stonebane (vs slams, heavy blows), Hexbane (vs sigils, magic). Each role starts with one from its own list. A fifth of sigil casters start with dark magic. There are no scrolls: skills found after battles (40% chance), in treasure rooms or at the Shrine are given straight to a unit you choose (`allocSkill()`); a unit without capacity can forget a learned skill to make room.
- `genUnit()`: rolls stats, growths, starting skill, kit, name and look.
- `genLook()`, `GEAR`, `SKINS`, `HAIRC`, `CLOTH`: the random sprite parts. Sprites are 32×32, drawn in code by `fig()`.
- Monsters: `Wolf`, `Lamia`, `Minotaur` in `CLS`/`FOE`, looks from `monLook()`. Wolves use the `beast` body in `fig()`.
- `MAPS`: battle maps, grouped by region. `genBattle()` picks a map and enemies from the act's region. Region terrain letters are listed at the top of the REGIONS section; tile art is `bioTile()`.
- Region monster sprites are bodies in `fig()` (`mud`, `gator`, `golem`, `flame`, `dragon`, `storm`, `eye`), with looks from `MONLOOK`.
- Reinforcements (`def.waves`) are plain data, `{turn:[{c,lv,x,y,ifBoss}]}`, so they survive a save.
- Mounted units are drawn by `horseUnder()`: a random-coloured horse with team barding, rider laid on top.
- EXP is 1.5× the Fire Emblem formula (`EXP_RATE`), so units evolve during Act 1.
- Promotion: a unit evolves as soon as it reaches Lv 5 (`PROMO_LV`, `evolveCheck()` after any level-up), choosing from up to 3 paths (`promoOptions()`): the usual upgrade, a new movement type, and a new role that keeps the weapon.
- Flying units (`MOVES.flying`, needs the Sky Riders unlock): pegasus riders for skirmishers, casters and menders, wyverns for brutes and guards. Drawn by `horseUnder()` with wings.
- Relics (`RELICS`): team passives for the run. Elites offer 1 of 2, the Act 1 boss 1 of 3, treasure rooms sometimes hold one. Combat effects go through `relicCalc()`, move through `relicMov()`. Shown on the map; tap one to read it.
- Act 2 (`run.act`): a second 9-floor map after the Act 1 boss, with gremlins and gloomwings added, and the Lamia Queen in the Serpent Palace as the final boss.
- Progression (saved in `embermarch2.profile`, shown under Records on the title screen):
  - Relics: 15 are open from the start (including Iron Rose: −3 damage taken below half HP; Aventurine: +10 Avoid, +5 Crit; Horn of Plenty: +15 gold per won fight and meals last 1 fight longer); 6 more join the pool after 2, 4 and 6 runs (`RELICS[k].x`).
  - Ascension (`ASC`, up to 5): winning at your highest level opens the next. Each level adds to the last: +1 enemy level; tougher bosses and elite leaders; no early ease and no starting gold; another +1 level and +1 enemy per battle; every enemy has a skill.
  - Achievements (`ACH`), checked when a run ends. Some unlock extras (`UNLOCKS`): Try, Try and Try Again (play a run to the end, win or lose) → Rewind in Options; First Run (finish a run) → difficulty (Ascension) choice at New Run; Field Hospital (3 Menders) → Heirloom, Volley (3 bow users) → Wider Draft, Cavalry Charge (3 mounted) → Sky Riders, Full House (6 units) → Second Look, Not a Scratch (no losses) → Veterans (travellers start at Lv 3). Badge-only: Arcane Circle, Sky Fleet, Feast, Cartographer.
  - Run History (title screen) is in development; runs are already recorded in `prof.hist`.
- Gear (`t:'gear'`): Leather Armour, Chainmail, Warding Cloak, Traveller's Boots, Iron Gauntlets. Bonuses apply while carried (one of each counts; `gearOf()`). Found in treasure rooms and monster drops.
- Trade: a unit next to an ally gets a Trade option. Salves, scrolls and gear can be passed across; weapons can't. Trading doesn't use the unit's action.
- Tutorials: off by default. Turn on Tutorial tips in Options to get a tip the first time you reach each screen; every tip has a Turn off tutorials button.



