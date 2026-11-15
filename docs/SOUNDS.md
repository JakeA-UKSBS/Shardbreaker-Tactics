# Sound checklist

Everything in the game that needs (or could use) a sound.

- ✅ recorded sound in `sfx/`
- 🔶 placeholder synth beep (in `js/05-sound.js`, swapped out automatically once a file of the same name is added to `SFX_FILE`)
- ❌ nothing yet

Recorded sounds so far come from Leohpaz's *RPG Essentials SFX - Free!*, Helton Yan's *Pixel Combat* and FilmCow (events, swamp ambience).

---

## 1. Music (none yet: `music/` doesn't exist)
Files go in `music/<key>.mp3` and are picked up automatically (`MUSIC` in `16-maps-battles.js`).

| Track | File | Status |
|---|---|---|
| Title screen | `music/title.mp3` | ❌ |
| Tavern | `music/tavern.mp3` | ❌ |
| Cursed Woodland (Act 1) | `music/forest.mp3` | ❌ |
| Sobek's Mire (Act 1) | `music/swamp.mp3` | ❌ |
| Sandstone Desert (Act 1) | `music/desert.mp3` | ❌ |
| Volcanic Isle (Act 2) | `music/mountain.mp3` | ❌ |
| Frostveil Reaches (Act 2) | `music/snow.mp3` | ❌ |
| Gemstone Caverns (Act 2) | `music/cavern.mp3` | ❌ |
| The Heart of the Blight (Act 3) | `music/heart.mp3` | ❌ |
| Boss fights (one shared, or one per boss) | not hooked up yet | ❌ |
| Node map | not hooked up yet (keeps playing what was on) | ❌ |
| Victory / defeat stings | not hooked up yet (synth `fanfare`) | 🔶 |
| Sage / story scenes | not hooked up yet | ❌ |

## 2. Region ambience (loops quietly under battles)
`AMBIENCE` in `16-maps-battles.js`.

| Region | Idea | Status |
|---|---|---|
| Sobek's Mire | frogs, insects, water | ✅ `swamp-ambience.mp3` |
| Cursed Woodland | creaking wood, wind in dead branches, distant crows | ❌ |
| Sandstone Desert | dry wind, sand hiss | ❌ |
| Volcanic Isle | lava bubbling, rumbles | ❌ |
| Frostveil Reaches | howling wind, ice creaks | ❌ |
| Gemstone Caverns | dripping water, crystal hum | ❌ |
| The Heart | low crystal drone, heartbeat | ❌ |
| Tavern | crowd chatter, fire crackle, mugs | ❌ |

## 3. Combat: attacks
| Sound | When | Status |
|---|---|---|
| `slash` | blades (swords, daggers) | ✅ |
| `swing` | heavy weapons, lances, staff bonks | 🔶 |
| `claw` | fangs/claws (monsters) | ✅ |
| `arrow` | bows | 🔶 |
| `throw` | javelins, throwing axes | 🔶 |
| `hit` | a blow lands | 🔶 |
| `miss` | a whiff | 🔶 |
| `critcharge` | crit wind-up | 🔶 |
| `crit` / `swordcrit` | crit impact | ✅ swords / 🔶 others |
| `block` | shield block / Guard | ✅ |
| `broke` | weapon breaks, shields shatter | 🔶 |
| `death` | a unit falls | 🔶 |

## 4. Combat: magic and elements
| Sound | Used by | Status |
|---|---|---|
| `fire` | fire spells, Burn, fire monsters | ✅ |
| `water` | water spells | ✅ |
| `ice` | ice spells, Ice Shield | ✅ |
| `thunder` | lightning (Corvin) | ✅ |
| `wind` | wind spells | ✅ |
| `earth` | earth/stone abilities, stalagmites, ground slams | 🔶 |
| `dark` | dark magic, life drain, curses | 🔶 |
| `heal` | heals, salves, camps | ✅ |
| holy / light | Mender, Saint, Paladin abilities (currently `heal`) | ❌ |
| summon | Seren's familiar appearing | ❌ |
| `sandswipe` | sand attacks, Sand in Eyes | ✅ |

## 5. Statuses (landing on a unit)
| Status | Status of sound |
|---|---|
| Poison | ✅ `poison` |
| Slow, Weak, Sundered, Blind, Root (debuffs) | ✅ shared `debuff` (Slow plays it quieter) |
| Burn | ✅ via `fire` |
| Stun | ❌ (dizzy/bonk) |
| Buffs: Rallied, Valour, Anthem, Steady, Shell, Shield Up, Covered, Guard, Challenged | ❌ (one shared "buff" sound would cover them) |
| Status wearing off | ❌ |

## 6. Movement
| Sound | Status |
|---|---|
| `step`: footsteps on foot | ✅ (grass only) |
| footsteps per ground: sand, snow, stone, mud/water | ❌ |
| `hoof`: cavalry | 🔶 |
| `flap`: fliers (Drake Rider, harpies, sprites) | 🔶 |
| `jump`: climbing to higher ground | ✅ |
| `move` | 🔶 |
| Monsters with their own movement (worms burrowing, golems stomping, slithering Lamias) | ❌ |

## 7. Monsters (attack / hurt / death cries)
None have their own voice yet: all use the shared attack sounds.

| Region | Monsters |
|---|---|
| Cursed Woodland | Wolf (howl ability), Cursed Stag, Blighted Treant |
| Sobek's Mire | Bog Lurker, Lamia, Mud Monster |
| Sandstone Desert | Jackal, Sand Worm, Sandstone Golem |
| Volcanic Isle | Hell Hound, Fire Sprite, Boulder Golem |
| Frostveil Reaches | Frost Wolf, Frost Sprite, Ice Worm, Ice Troll |
| Gemstone Caverns | Gem Golem |
| The Heart | Shardling, Prism, Crystal Sentinel |
| Familiar | Seren's frog |

**Bosses** (roars for Rhi's boss cutscenes, plus attacks): Krondis, Hollow Bear, Pyrite Colossus, Magma Dragon, Yeti, Amethyst Turtle, the Crystal Heart (plus its crystals shattering). ❌ all; the boss intro currently uses synth `rise` / `burst`.

## 8. Turn flow and battle UI
| Sound | When | Status |
|---|---|---|
| `phase` | player phase starts | 🔶 |
| `ephase` | enemy phase starts | 🔶 |
| `bell` | battle start | 🔶 |
| `ding` | level up / reward / objective | 🔶 |
| `levelup` | stat gains | ✅ |
| ascension / promotion | 🔶 (synth) |
| `fanfare` | victory | 🔶 |
| defeat sting | ❌ |
| hold-fight turn counter / reinforcements arriving | ❌ |
| `tick` | small UI steps, counters | 🔶 |
| `select` / `decline` | left/right click | ✅ (muted for now) |
| hover over a tile or menu option | ❌ |

## 9. Node map and run flow
| Sound | Status |
|---|---|
| picking a room | ❌ (uses `tick`) |
| treasure room chest | ✅ `chestopen` |
| camp: fire crackle on arrival, rest/heal | ❌ fire / ✅ heal |
| Crossroads (signpost, choosing) | ❌ |
| entering a new act / region | ❌ |
| relic gained | 🔶 `item` |
| gold gained / spent | 🔶 `item` / ✅ `buy` |
| weapon forged / upgraded | 🔶 `item` (`anvil` used in events) |
| run timer / run end summary | ❌ |

## 10. Tavern
| Sound | Status |
|---|---|
| ordering a drink | ✅ `pour` |
| food (Roast Boar, Honey Bread, Fish Pie, Pepper Stew, Mushroom Soup) | ❌ (plate/eating) |
| hiring a recruit | ❌ |
| innkeeper greeting | ❌ |
| buying | ✅ `buy` |

## 11. Events
Each event plays one sound when it opens (`EV_SFX` in `20-events.js`); results use the shared `item` / `heal` / `ding` / `broke` / `fanfare`.

| Event | Opening sound |
|---|---|
| The Wandering Smith, The Weaponmaster, The Dwarf Smith | ✅ `anvil` |
| The Enchanter's Study, The Ruined Library, The Gnome Scholar | ✅ `book` |
| A Suspicious Chest, Abandoned Armoury, The Specialist's Cache, The Frozen Cache | ✅ `chestopen` |
| The Healing Fountain, The Bog Witch | ✅ `pour` |
| The Caged Traveller | ✅ `lever` |
| Travelling Merchant, The Tailor | ✅ `paper` |
| Blood Shrine | ❌ (heartbeat / drip) |
| Training Ground | ❌ (clashing wood) |
| Gambler's Table | ❌ (dice) |
| The Golden Idol | ❌ (rumble / trap) |
| The Wandering Minstrel | ❌ (lute) |
| Wishing Well | ❌ (coin plop) |
| Old Battlefield | ❌ (wind, crows) |
| The Wayside Chapel | ❌ (choir / bell) |
| The Empty Throne | ❌ (echo) |
| The Storm Altar, The Storm Spire | ❌ (thunder rumble; `thunder` plays on some results) |
| The Old Veteran | ❌ |
| Statue of Valour | ❌ (stone) |
| The Toll Bridge | ❌ (creaking bridge, coins) |
| The Strange Fog | ❌ (eerie) |
| The Crystal-Touched Beast | ❌ (growl, crystal) |
| The Fallen Star | ❌ (shimmer) |
| The Oracle | ❌ (mystic chime) |
| The Mountain Sage | ❌ |
| The Black Onyx | ❌ (dark hum) |
| The Sinking Sands | ❌ (sand) |
| Ithren's Echo | ❌ |
| Those Who Came Before | ❌ (ghostly) |
| Buckthor Moccasin (not added yet) | ❌ |

## 12. Menus and screens
| Sound | Status |
|---|---|
| Title screen buttons | ❌ |
| `equip` (items, gear) | ✅ |
| Opening/closing panels and modals | ❌ |
| Settings toggles | ❌ |
| Run History, achievements | ❌ |
| Dialogue text blips (when dialogue goes in) | ❌ |
