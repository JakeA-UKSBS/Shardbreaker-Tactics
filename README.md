# Shardbreaker (roguelike)

A run-based tactics roguelike in the style of GBA Fire Emblem. Built for PC first (map left, command panel right), and still playable on phones. Forked from Nightbound's engine.

See [docs/VISUALS.md](docs/VISUALS.md) for pictures of every region, boss, monster, class, weapon, tile and scene, and [docs/INFO.md](docs/INFO.md) for the numbers: recruit odds, base stats and growths, weapons, effectiveness, skills, relics and regions.

## Run it
Open `index.html` in a browser (or serve the folder, e.g. VS Code's Live Server). `index.html` is just the page shell; the styles are in `css/style.css` and the game is split into numbered files in `js/`, loaded in order (plain scripts sharing one global scope, no build step). On PC: Esc or right-click backs out of a move or menu, E ends the turn, the mouse wheel zooms.

The fixed art (tiles, icons, relics, scenes, backdrops) loads from PNGs in `art/`: edit them in any pixel editor and refresh. See [art/README.md](art/README.md) for sizes and the export tool.

## Music
Drop mp3 files into a `music/` folder next to `index.html`: `title.mp3`, `tavern.mp3`, `mushroom.mp3`, `shadow.mp3`, `swamp.mp3`, `forest.mp3`, `mountain.mp3`, `ship.mp3`, `labyrinth.mp3`, `desert.mp3`, `snow.mp3`, `cavern.mp3`. Each loops while you're in that region (map and battles). Missing files are skipped. "Sound and music" in Options turns it off.

## Regions
Each run picks 2 of these 10 as its acts (`BIOMES`, `ACTS`). Each has 2-3 battle maps, a boss map, a monster pool and a rule.
| Region | Monsters | Rule | Boss |
| --- | --- | --- | --- |
| Mycelia | Sporelings, Mindsnails | Spores poison on a hit (3 HP a turn for 3 turns; a Salve cures it) | King Morel the Blighted |
| Sunless Isle | Skeletons, Skeleton Archers, Ghosts | Ghosts pass through walls; dark magic drains | The Bone Wyrm (raises skeletons every other turn) |
| Bog of Eternal Stench | Bog Lurkers, Lamias, Mud Monsters | Starting a turn in ankle-deep water or mangrove roots costs 1 Move; sand is solid | Krondis the alligator |
| Cursed Woodland | Wolves, Cursed Stags, Blighted Treants | Cursed thickets: +25 Avoid, 2 Move to enter | The Hollow Bear |
| Volcanic Isle | Boulder Golems, Fire Sprites, Harpies | Magma blocks foot units; fliers and fire creatures cross it | Pyraxis, the Magma Dragon |
| The Flying Ship | Harpies, Wyverns | Defend the deck for 5-6 turns; fliers arrive every turn | The Great Roc |
| The Labyrinth | Gremlins, Beholders (stone gaze) | Maze corridors | A Minotaur lord |
| Sandstone Desert | Jackals, Sand Worms, Sandstone Golems | Quicksand costs 1 Move next turn; sandstone outcrops (cream feldspar with smoky quartz) give cover | The Pyrite Colossus |
| Agate Peaks | Frost Wolves, Frost Sprites, Agate Golems | Deep snow costs 1 Move next turn (snow creatures ignore it); frozen lakes −10 Avoid; blue agate gives cover | Glacius, the Agate Wyrm |
| Gemstone Caverns | Gremlins, Gemsnails, Gem Golems | Chests everywhere: gold, or worthless pyrite; emerald, ruby and sapphire clusters give cover; walls are iridescent rock | Amethyra, the Amethyst Turtle |

Only creatures are enemies; there are no human foes.

Defend fights: from floor 2, a quarter of normal battles (outside the Flying Ship and the Labyrinth) are a settlement to hold for 5-7 turns, with monsters arriving from the top of the map each turn (`TOWN`, `town_<region>` maps, each region's `town` ground and cover). Chests (`C`) on any map hold 15-30 gold, or pyrite (30%).


## A run
- Title subtitle: "Break the blight". Battle titles are just the place name ("Oasis", "Old Mineshaft (Elite)").
- Every opening draft includes at least one Mender (healer).
- Early ease: in Act 1, enemies deal 3 less damage on floors 1-3, 2 less on 4-6 and 1 less on 7-9; the first two floors have 2 enemies.
- A run opens in Ithren the Sage's tent (`sageScene()`): he talks over his crystal ball (4 lines, naming the run's two regions), then asks how deep into the blight to go once Ascension is unlocked. Then the Crossroads (`musterScene()`): Your candidates stand around a campfire, with the run's two regions on the signpost. Travellers start at Lv 2. Tap travellers to see their card and choose 3, then Set out. Each act's map starts from a flag node at the bottom. Fallen units are gone for the rest of the run; you only lose when the whole squad falls.
- Each act is a branching node map (`genMap()`): 10 floors of 3 lanes, then a shared campfire (rest) on floor 11 and the boss on floor 12.
- Every path holds exactly `MIX`: 3 battles, 1 elite (never before floor 4; shown as a red horned skull on the map), 1 recruit, 1 tavern, 1 rest, 2 events, 1 treasure. One lane swaps a battle for a second elite (`MIX_HARD`), so the riskier route is there if you want it. Lanes are shuffles of the same mix, and a crossing between lanes is only kept if every path through the map still matches, so no route skips the treasure room. Change `MIX` to change the length and mix.
- Nodes: Battle; Elite (Elder leader, always drops a relic (1 of 2) and a jade weapon for a unit you choose); Recruit (pick 1 of 3; team caps at 6, `TEAM_CAP`); Rest (train one unit +1 level); Treasure (pick 1 of 3 items); Event (`EVENTS`); Tavern; Boss.
- Gold: 30 to start, then 25 per battle, 45 per elite, 80 per boss (`GOLDWIN`). Spent at taverns.
- Tavern (`tavernNode()`): talk to Marla the innkeeper and pick as many options as you can afford before leaving. Drinks (`DRINKS`): a round of ale (+30 EXP for everyone) or a spirit for one unit (+1 to a stat for good). Food (`MEALS`): squad-wide buffs for 2-3 fights (+2 damage, +15 Hit, +2 Def/Res, +1 Move, poison immunity), counted down after each won fight and shown on the map. Sellswords: 3 units for hire at 40 + 15 per level. Rumours: a hint about the region's boss and rule. Music slot: `music/tavern.mp3`.
- Events (`EVENTS`) don't repeat within a run while fresh ones are left. They open a full-screen scene drawn for that event (`eventScene()`, tinted to the region), with choices underneath and the outcome shown in the same box: Wandering Smith, Abandoned Armoury, Shrine of Trial, Training Ground, Travelling Merchant (3 items for gold), Gambler's Table (bet 30 for 60), The Golden Idol (rare relic for −2 max HP all round), The Caged Traveller (free unit), Healing Spring (+3 max HP for one, or +1 Res for all), Wishing Well (25 gold for +1 Luck all round, or fish for coins), Old Battlefield (search for gear at a risk, or +20 EXP).
  - More events: Jade Tomb, Storm Altar, Specialist's Cache (crates matched to your squad: Longbow if you have an archer, Throwing Knives for a Rogue, Far Charm for a Mender, Spark Sigil for a caster, Rune Staff for a Summoner), Old Veteran, Statue of Valour, Drill Sergeant, Toll Bridge, Bog Witch, Strange Fog, Suspicious Chest, Ruined Library.
  - Act 2 only (`act:2`): Fallen Star (Meteor Sigil), Storm Spire (Heaven's Bolt or Far Charm), The Oracle, Mountain Sage, Dragon's Hoard.
  - Woes (`WOES`, `run.woes`): bad luck from events, shown in red on the map and counted down after each won fight. Ambushed (every unit starts the next fight 5 HP down), Weary Legs (−1 Move), Marked (one unit acts as if it had Taunt).
- Special weapons from events: Jade weapons (Jian, Fang, Spear, Axe, Bow; Crit 30-35), Spark and Thunderhead lightning sigils, Longbow (Rng 2-3), Throwing Knives (Rng 1-2), Far Charm (heals at Rng 1-10), and in Act 2 Meteor Sigil and Heaven's Bolt (Rng 3-10, 5 uses). A unit carrying several charms heals with whichever one reaches.
- Forged weapons use keys like `ironAxe~2` (+2 Mt and +5 Hit per level; charms heal +5), built on demand by `ensureIt()`.
- Enemy strength climbs with floor and act (floors are scaled to a 10-floor curve by `flScale()`, so a longer map doesn't make enemies tougher): Lv 1 on Act 1 floor 1, about Lv 6 by floor 9, Lv 7+ in Act 2. Numbers grow with the floor too. Each region's `pool` lists its monsters with the floor they start appearing on (all are open in Act 2). Elites use the region's tougher `elitePool`, are led by an Elder of its strongest monster, and fight 2 levels higher with one extra enemy.
- Saves cover both the map and battles, so Continue picks up wherever you left off.
- Every run has a seed (shown on the draft and defeat screens). All rolls come from it.

## Where things live
`js/01-data.js` items, weapons, skills · `02-rng-units` random numbers, unit constructors · `03-pixel-art` sprite drawing (`Px`, `fig`, `BIG`) · `04-ship-art` · `05-sound` · `06-rules` combat maths · `07-reach-camera` movement and camera · `08-render` board and unit sheet · `09-battle-scene` fight animation · `09b-battle-rig` posed battle sprites (Fighter, Swordsman) · `10-cutscenes` · `11-modals` · `12-turns` actions, AI, turn loop · `13-save` · `14-units` classes, looks, unit generation · `15-regions-monsters` · `16-maps-battles` maps and `genBattle()` · `17-ui-cards` · `18-node-map` · `19-items-treasure` · `20-events` · `21-progress` achievements and Ascension · `22-relics` · `23-promotion` · `24-tavern` · `25-crossroads-sage` · `26-gear-skills-summons` · `27-run-flow` · `28-startup`. A file can call anything from any other file at run time; only code that runs while the files load has to come after what it uses.

- Region bosses are 2×2 (`u.sz=2`, x/y is the top-left). `man()` measures between footprints and `unitAt()` checks every cell, so movement, range, the danger map and the AI all handle them. Their sprites are 64×64: hand-drawn in `BIG` (the Roc, the Bone Wyrm), otherwise the 32px art doubled.
- `ROLES`, `MOVES`, `KIT`: the class parts. Movement is foot, armoured (Knights only) or mounted (7 move, slowed by forest and hills; names like Lance Cavalier, Troubadour). A class is role + movement + weapon, keyed like `G.skirm.foot.pole.1`. `ensureCls()` builds it, plus its promoted version (`.2`, adds a second weapon type).
- Summoner role (`ROLES.summoner`, unlocked by the Apprentice achievement: finish a run with a Sigilist in the squad): a staff caster (Crook Staff: Rng 1, hits harder; Rune Staff: Rng 1-2; both use Mag) with a Summon action once per battle (twice once promoted). The minion is the Summoner's own bonded familiar (`FAMILIARS`, `u.familiar`, rolled when the unit is made): Spirit Wolf, Stone Warden, Wisp or Spirit Hawk. Familiars are pale-blue translucent spirits, never region creatures. Summons and the hawk are allies you control (blue glow) but they don't gain EXP themselves (a summon's EXP goes to its Summoner), don't count towards losing, and leave after the battle.
- Falconer's Whistle relic: a hawk (weak flier) joins every battle and comes back next fight if it falls.
- Stats: units show and level HP, Str or Mag (whichever their class uses), Luck, Spd, Def and Res. Skl is folded into Luck (`foldLuck()`), which drives Hit (Luck×2), Crit (Luck÷2, minus half the foe's Luck; only your units can crit) and skill procs. Every level-up gives +1 to each shown stat.
- Weapon weight (`WT`): each point of Wt above the wielder's Str (Mag for sigils) costs 1 attack speed (`AS()`), which is used for doubling and Avoid. Steel weapons hit harder but weigh more.
- Breaker weapons (Spellbreaker, Axebreaker, Swordbreaker): +50 Hit and Avoid against sigils and magic, heavy blows (slams, axes) and blades/claws/fangs respectively. Weapons never break (except Meteor and Heaven’s Bolt, 5 uses each). Weapon range (Rng) is shown next to every weapon in item lists and unit cards. Killer weapons (Moonglass Edge, Barbed Spear, Reaver Axe, Hawkeye Bow, Stiletto) have high crit. Found in treasure rooms.
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
- Monsters: `Wolf`, `Harpy`, `LamiaM`, `MinotaurM` in `CLS`/`FOE`, looks from `monLook()`. Wolves use the `beast` body in `fig()`.
- `MAPS`: battle maps, grouped by region. `genBattle()` picks a map and enemies from the act's region. Region terrain letters are listed at the top of the REGIONS section; tile art is `bioTile()`.
- Region monster sprites are bodies in `fig()` (`shroom`, `ghost`, `mud`, `gator`, `golem`, `flame`, `dragon`, `storm`, `eye`, riderless `mount`), with looks from `MONLOOK`. Skeletons are humanoids with `look.skel`.
- Reinforcements (`def.waves`) are plain data, `{turn:[{c,lv,x,y,ifBoss}]}`, so they survive a save.
- Mounted units are drawn by `horseUnder()`: a random-coloured horse with team barding, rider laid on top.
- EXP is 1.5× the Fire Emblem formula (`EXP_RATE`), so units evolve during Act 1.
- Promotion: a unit evolves as soon as it reaches Lv 5 (`PROMO_LV`, `evolveCheck()` after any level-up), choosing from up to 3 paths (`promoOptions()`): the usual upgrade, a new movement type, and a new role that keeps the weapon.
- Flying units (`MOVES.flying`, needs the Sky Riders unlock): pegasus riders for skirmishers, casters and menders, wyverns for brutes and guards. Drawn by `horseUnder()` with wings.
- Relics (`RELICS`): team passives for the run. Elites offer 1 of 2, the Act 1 boss 1 of 3, treasure rooms sometimes hold one. Combat effects go through `relicCalc()`, move through `relicMov()`. Shown on the map; tap one to read it.
- Act 2 (`run.act`): a second 9-floor map after the Act 1 boss, with gremlins, gloomwings, mindsnails and storm harpies added, and the Lamia Queen in the Serpent Palace as the final boss.
- Progression (saved in `embermarch2.profile`, shown under Records on the title screen):
  - Relics: 15 are open from the start (including Iron Rose: −3 damage taken below half HP; Aventurine: +10 Avoid, +5 Crit; Horn of Plenty: +15 gold per won fight and meals last 1 fight longer); 6 more join the pool after 2, 4 and 6 runs (`RELICS[k].x`).
  - Ascension (`ASC`, up to 5): winning at your highest level opens the next. Each level adds to the last: +1 enemy level; tougher bosses and elite leaders; no early ease and no starting gold; another +1 level and +1 enemy per battle; every enemy has a skill.
  - Achievements (`ACH`), checked when a run ends. Some unlock extras (`UNLOCKS`): Try, Try and Try Again (play a run to the end, win or lose) → Rewind in Options; First Run (finish a run) → difficulty (Ascension) choice at New Run; Field Hospital (3 Menders) → Heirloom, Volley (3 bow users) → Wider Draft, Cavalry Charge (3 mounted) → Sky Riders, Full House (6 units) → Second Look, Not a Scratch (no losses) → Veterans (travellers start at Lv 3). Badge-only: Arcane Circle, Sky Fleet, Feast, Cartographer.
  - Run History (title screen) is in development; runs are already recorded in `prof.hist`.
- Gear (`t:'gear'`): Leather Armour, Chainmail, Warding Cloak, Traveller's Boots, Iron Gauntlets. Bonuses apply while carried (one of each counts; `gearOf()`). Found in treasure rooms and monster drops.
- Trade: a unit next to an ally gets a Trade option. Salves, scrolls and gear can be passed across; weapons can't. Trading doesn't use the unit's action.
- Tutorials: off by default. Turn on Tutorial tips in Options to get a tip the first time you reach each screen; every tip has a Turn off tutorials button.
- Magic: fire > nature > water > fire, light > dark. Dark sigils drain 25% of damage dealt.

## Not built yet
A final fight after Act 2 against a great malignant crystal (like Slay the Spire's Heart), Run History screen, archetypes (named unlockable classes), more events, Act 3.
