# Shardbreaker Tactics

An isometric, height-based fork of Shardbreaker (FFTA / Tactics Ogre style) with inspiration from GBA Fire emblem games. See [docs/DESIGN.md](docs/DESIGN.md) for where it's heading and what's built so far. Below is the original Shardbreaker readme.

See [docs/VISUALS.md](docs/VISUALS.md) for pictures of every region, boss, monster, class, weapon, tile and scene, and [docs/INFO.md](docs/INFO.md) for the numbers: recruit odds, base stats and growths, weapons, effectiveness, skills, relics and regions.

## Run it
Open `index.html` in a browser (or serve the folder, e.g. VS Code's Live Server). `index.html` is just the page shell; the styles are in `css/style.css` and the game is split into numbered files in `js/`, loaded in order (plain scripts sharing one global scope, no build step). On PC: Esc or right-click backs out of a move or menu, E ends the turn, the mouse wheel zooms.

The fixed art (tiles, icons, relics, scenes, backdrops) loads from PNGs in `art/`: edit them in any pixel editor and refresh. See [art/README.md](art/README.md) for sizes and the export tool.

## Music
Drop mp3 files into a `music/` folder next to `index.html`: `title.mp3`, `tavern.mp3`, `swamp.mp3`, `forest.mp3`, `mountain.mp3`, `desert.mp3`, `snow.mp3`, `cavern.mp3`, `heart.mp3` (Act 3). Each loops while you're in that region (map and battles). Missing files are skipped. "Sound and music" in Options turns it off.

## Regions
Each run picks 2 of these 6 as its acts (`BIOMES`, `ACTS`). Each has 2-3 battle maps, a boss map, a monster pool and a rule.
| Region | Monsters | Rule | Boss |
| --- | --- | --- | --- |
| Sobek’s Mire | Bog Lurkers, Lamias, Mud Monsters | Starting a turn in ankle-deep water or mangrove roots costs 1 Move; sand is solid | Krondis the alligator |
| Cursed Woodland | Wolves, Cursed Stags, Blighted Treants | Cursed thickets: +10 Avoid, 2 Move to enter | The Hollow Bear |
| Volcanic Isle | Magma Golems, Fire Sprites | Magma blocks foot units; fliers and fire creatures cross it | Pyraxis, the Magma Dragon |
| Sandstone Desert | Jackals, Sand Worms, Sandstone Golems | Quicksand costs 1 Move next turn; sandstone outcrops (cream feldspar with smoky quartz) give cover | The Pyrite Colossus |
| Frostveil Reaches | Frost Wolves, Frost Sprites, Agate Golems, Ice Trolls (placeholder art) | Deep snow costs 1 Move next turn (snow creatures ignore it); frozen lakes −10 Avoid; blue agate gives cover | The Yeti (placeholder art) |
| Gemstone Caverns | Gemsnails, Gem Golems | Emerald, ruby and sapphire clusters give cover; walls are iridescent rock | Amethyra, the Amethyst Turtle |

Only creatures are enemies; there are no human foes.

Defend fights: from floor 2, a quarter of normal battles are a settlement to hold for 5-7 turns, with monsters arriving from the top of the map each turn (`TOWN`, `town_<region>` maps, each region's `town` ground and cover). 


## A run
- Title subtitle: "Break the blight". Battle titles say what the fight is ("Battle", "Elite Battle", "Defend the Settlement"); boss fights use the boss's name.
- Early ease: in Act 1, enemies deal 3 less damage on floors 1-3, 2 less on 4-6 and 1 less on 7-9; the first two floors have 2 enemies.

Crossroads (`musterScene()`): Your candidates stand around a campfire, with the run's two regions on the signpost. Travellers start at Lv 2. Tap travellers to see their card and choose 3, then Set out. Each act's map starts from a flag node at the bottom. Fallen units are gone for the rest of the run; you only lose when the whole squad falls.


## branching
- Each act is a branching node map (`genMap()` in `js/18-node-map.js`), following Slay the Spire's map: 15 floors on 4 lanes that cross now and then, then the boss on floor 16. Act 3 is a short straight road instead: tavern, elite, event, camp, then the Crystal Heart.
- Fixed floors: 1 is a battle, 8 a treasure room, 15 a camp (rest) and 16 the boss. Every other floor is rolled. Two random lanes per map are monster lanes and roll from `ROOM_W`; the other two roll from `ROOM_W_LIGHT`:

  | Room | Monster lanes | Event lanes | Rules |
  | --- | --- | --- | --- |
  | Battle | 45 | 35 | |
  | Event | 23 | 30 | |
  | Camp (rest) | 12 | 12 | Not before floor 6, not on floor 14, never twice in a row |
  | Elite | 10 | 10 | Not before floor 6, never twice in a row; shown as a horned skull |
  | Tavern | 10 | 13 | Never twice in a row |

  A roll that breaks a rule is rolled again, so on floors where a room isn't allowed (camps and elites before floor 6, say) the others come up a little more often.
- On top of the odds, every route through floors 1-14 must have 6-9 fights (elites count) and at least one camp before the fixed one on 15 (`FIGHTS`, `routeOk()`). A lane that fails is rolled again. On top of that, the event lanes have 6-8 fights and at most two battles on floors 2-5.
- Each map gets 6-8 crossings between neighbouring lanes, never on the same or neighbouring floors, and only where every route still passes those checks.
- Nodes: Battle; Elite (Elder leader, always drops a relic (1 of 2) and a jade weapon for a unit you choose); Recruit (pick 1 of 3; team caps at 6, `TEAM_CAP`); Rest (train one unit +1 level); Treasure (pick 1 of 3 items); Event (`EVENTS`); Tavern; Boss.
- Gold: 30 to start, then 25 per battle, 45 per elite, 80 per boss (`GOLDWIN`). Spent at taverns.

## tavern
- Tavern (`tavernNode()`): talk to Marla the innkeeper and pick as many options as you can afford before leaving. Drinks (`DRINKS`): a round of ale (+30 EXP for everyone) or a spirit for one unit (+1 to a stat for good). Food (`MEALS`): squad-wide buffs for 2-3 fights (+2 damage, +15 Hit, +2 Def/Res, +1 Move, poison immunity), counted down after each won fight and shown on the map. Sellswords: 3 units for hire at 40 + 15 per level. 
- Events and Act 2 events: see [docs/EVENTS.md](docs/EVENTS.md).

  ## weapons
- Forged weapons use keys like `ironAxe~2` (+2 Mt and +5 Hit per level; charms heal +5), built on demand by `ensureIt()`.
- Weapon weight (`WT`): each point of Wt above the wielder's Str (Mag for sigils) costs 1 attack speed (`AS()`), which is used for doubling and Avoid. Steel weapons hit harder but weigh more.
- 

## Where things live
`js/01-data.js` items, weapons, skills · `02-rng-units` random numbers, unit constructors · `03-pixel-art` sprite drawing (`Px`, `fig`, `BIG`) · `05-sound` · `06-rules` combat maths · `07-reach-camera` movement and camera · `08-render` board and unit sheet · `09-battle-scene` fight animation · `09b-battle-rig` posed battle sprites (Fighter, Swordsman) · `10-cutscenes` · `11-modals` · `12-turns` actions, AI, turn loop · `13-save` · `14-units` classes, looks, unit generation · `15-regions-monsters` · `16-maps-battles` maps and `genBattle()` · `17-ui-cards` · `18-node-map` · `19-items-treasure` · `20-events` · `21-progress` achievements and Ascension · `22-relics` · `23-promotion` · `24-tavern` · `25-crossroads-sage` · `26-gear-skills-summons` · `27-run-flow` · `28-startup`. A file can call anything from any other file at run time; only code that runs while the files load has to come after what it uses.


## bosses
- Region bosses are 2×2 (`u.sz=2`, x/y is the top-left). `man()` measures between footprints and `unitAt()` checks every cell, so movement, range, the danger map and the AI all handle them. Their sprites are 64×64: hand-drawn in `BIG` 

## summoner [maybe make more generic]
- Summoner role (`ROLES.summoner`): a staff caster (Crook Staff: Rng 1, hits harder; Rune Staff: Rng 1-2; both use Mag) with a Summon action once per battle (twice once promoted). The minion is the Summoner's own bonded familiar (`FAMILIARS`, `u.familiar`, rolled when the unit is made): Spirit Wolf, Stone Warden, Wisp or Spirit Hawk.


## monsters
- Monsters: `Wolf`, `Lamia` in `CLS`/`FOE`, looks from `monLook()`. Wolves use the `beast` body in `fig()`.
- `MAPS`: battle maps, grouped by region. `genBattle()` picks a map and enemies from the act's region. Region terrain letters are listed at the top of the REGIONS section; tile art is `bioTile()`.
- Region monster sprites are bodies in `fig()` (`mud`, `gator`, `golem`, `flame`, `dragon`, `storm`, `eye`), with looks from `MONLOOK`.
- Reinforcements (`def.waves`) are plain data, `{turn:[{c,lv,x,y,ifBoss}]}`, so they survive a save.


## calcs
- EXP is 1.5× the Fire Emblem formula (`EXP_RATE`), so units evolve during Act 1.
- Relics (`RELICS`): team passives for the run. Elites offer 1 of 2, the Act 1 boss 1 of 3, treasure rooms sometimes hold one. Combat effects go through `relicCalc()`, move through `relicMov()`. Shown on the map; tap one to read it.


- Trade: a unit next to an ally gets a Trade option. Salves and gear can be passed across; weapons can't. Trading doesn't use the unit's action.
- Tutorials: off by default. Turn on Tutorial tips in Options to get a tip the first time you reach each screen; every tip has a Turn off tutorials button.



