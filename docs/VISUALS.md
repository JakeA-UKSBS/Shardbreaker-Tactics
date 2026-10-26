# Shardbreaker — Visuals

A picture guide to the game as it stands: every region, its monsters and boss, sample characters for each class, weapons, tiles and scenes. All art is drawn in code at 32×32 (bosses 64×64), shown here enlarged.

**Pitch:** malignant crystals are spreading through the land's creatures, and the scent of the crystallised beasts is driving the kingdoms to war. Ithren the Sage sends a small band to break the crystals at their heart. A run is 2 acts in 2 of 10 regions; you recruit, promote and lose units along the way. Every enemy is a creature, and every creature is crystallised; each boss has its own crystal colour.

## Contents
- [Opening scenes](#opening-scenes)
- [Regions and bosses](#regions-and-bosses)
- [Familiars](#familiars)
- [Battle sprites](#battle-sprites)
- [Characters](#characters)
- [Weapons](#weapons)
- [Region tiles](#region-tiles)
- [Event scenes](#event-scenes)

## Opening scenes

| Ithren's tent | The Crossroads |
| --- | --- |
| ![Ithren's tent](visuals/scenes/sage_tent.png) | ![Crossroads](visuals/scenes/crossroads.png) |

Ithren explains the blight over his crystal ball (difficulty arrows appear above it once Ascension is unlocked), then the squad is picked at the Crossroads: 3 of 5 travellers, always one Mender.

## Regions and bosses

Bosses fill 2×2 squares on the map. The Roc, Bone Wyrm, Krondis and Hollow Bear are drawn at full 64×64; the others are their 32px art doubled for now.

### Mycelia

Glowing mycelium and giant toadstools. The fungus folk have turned feverish under the blight, and their spores poison on a hit. **Rule:** Fungus attacks poison on a hit: 3 damage at the start of each of your turns for 3 turns. A Salve cures it.

| Boss: King Morel the Blighted | Attacking |
| --- | --- |
| ![King Morel the Blighted](visuals/bosses/mushroom.png) | ![King Morel the Blighted attacking](visuals/bosses/mushroom_attack.png) |

| Sporeling | Mindsnail |
| --- | --- |
| ![Sporeling](visuals/monsters/Sporeling.png) | ![Mindsnail](visuals/monsters/Mindsnail.png) |

### Sunless Isle

A haunted land of graves and crypts. Skeletons walk, and ghosts drift straight through walls. **Rule:** Ghosts ignore terrain and can pass through walls. Their dark magic heals them for a third of the damage dealt.

| Boss: The Bone Wyrm | Attacking |
| --- | --- |
| ![The Bone Wyrm](visuals/bosses/shadow.png) | ![The Bone Wyrm attacking](visuals/bosses/shadow_attack.png) |

| Skeleton | Ghost |
| --- | --- |
| ![Skeleton](visuals/monsters/Skeleton.png) | ![Ghost](visuals/monsters/Ghost.png) |

### Bog of Eternal Stench

Mangrove roots and ankle-deep water. Lurkers and lamias hunt the shallows; the sand banks are solid ground. **Rule:** A unit that starts its turn in the water or the mangrove roots has 1 less Move. Sand is solid ground. Fliers and swamp creatures ignore this.

| Boss: Krondis | Attacking |
| --- | --- |
| ![Krondis](visuals/bosses/swamp.png) | ![Krondis attacking](visuals/bosses/swamp_attack.png) |

| Bog Lurker | Lamia | Mud Monster |
| --- | --- | --- |
| ![Bog Lurker](visuals/monsters/Lurker.png) | ![Lamia](visuals/monsters/LamiaM.png) | ![Mud Monster](visuals/monsters/MudMonster.png) |

### Cursed Woodland

A dead forest under a curse. The deer here have gone wrong, wolves hunt in packs, and the trees themselves are waking up. **Rule:** Cursed thickets give +25 Avoid and +1 Def, but cost 2 Move to enter. Stags are fast: keep your back line covered.

| Boss: The Hollow Bear | Attacking |
| --- | --- |
| ![The Hollow Bear](visuals/bosses/forest.png) | ![The Hollow Bear attacking](visuals/bosses/forest_attack.png) |

| Wolf | Cursed Stag | Blighted Treant |
| --- | --- | --- |
| ![Wolf](visuals/monsters/Wolf.png) | ![Cursed Stag](visuals/monsters/CursedStag.png) | ![Blighted Treant](visuals/monsters/Treant.png) |

### Volcanic Isle

Basalt slopes cut by rivers of magma. Golems block the passes, and fire sprites float over the lava. **Rule:** Magma can’t be crossed on foot. Fliers and fire creatures move over it freely.

| Boss: Pyraxis, the Magma Dragon | Attacking |
| --- | --- |
| ![Pyraxis, the Magma Dragon](visuals/bosses/mountain.png) | ![Pyraxis, the Magma Dragon attacking](visuals/bosses/mountain_attack.png) |

| Fire Sprite | Boulder Golem | Harpy |
| --- | --- | --- |
| ![Fire Sprite](visuals/monsters/FireSprite.png) | ![Boulder Golem](visuals/monsters/Boulder.png) | ![Harpy](visuals/monsters/Harpy.png) |

### The Flying Ship

A sky-galleon under attack. Hold the deck while wyverns, pegasi and harpies dive from the clouds. **Rule:** Hold the deck until the turn count runs out; more fliers arrive every turn. Bows deal double damage to fliers.

| Boss: The Great Roc | Attacking |
| --- | --- |
| ![The Great Roc](visuals/bosses/ship.png) | ![The Great Roc attacking](visuals/bosses/ship_attack.png) |

| Harpy | Wyvern |
| --- | --- |
| ![Harpy](visuals/monsters/Harpy.png) | ![Wyvern](visuals/monsters/WyvernM.png) |

### The Labyrinth

Stone corridors with no daylight. Something with too many eyes watches from the dark. **Rule:** Beholders can turn units to stone with their gaze. Stone units skip their next turn.

| Boss: Minotaur lord | Attacking |
| --- | --- |
| ![Minotaur lord](visuals/bosses/labyrinth.png) | ![Minotaur lord attacking](visuals/bosses/labyrinth_attack.png) |

| Gremlin | Beholder |
| --- | --- |
| ![Gremlin](visuals/monsters/Gremlin.png) | ![Beholder](visuals/monsters/Beholder.png) |

### The Heart of the Blight

Scorched ground split by veins of glowing gem. Every crystal in these lands grew from what waits here. **Rule:** The Heart never moves, but it strikes from 2 to 6 tiles away. Get next to it: it can’t hit what’s beside it. It calls more blighted monsters every other turn.

| Boss: The Crystal Heart | Attacking |
| --- | --- |
| ![The Crystal Heart](visuals/bosses/heart.png) | ![The Crystal Heart attacking](visuals/bosses/heart_attack.png) |

| Shardling | Prism | Crystal Sentinel |
| --- | --- | --- |
| ![Shardling](visuals/monsters/Shardling.png) | ![Prism](visuals/monsters/Prism.png) | ![Crystal Sentinel](visuals/monsters/Sentinel.png) |

### Sandstone Desert

Dunes and sandstone ruins under a white sun. Jackals run in packs, and the quicksand swallows the careless. **Rule:** A unit that starts its turn in quicksand has 1 less Move. Sandstone rocks block the way.

| Boss: The Pyrite Colossus | Attacking |
| --- | --- |
| ![The Pyrite Colossus](visuals/bosses/desert.png) | ![The Pyrite Colossus attacking](visuals/bosses/desert_attack.png) |

| Jackal | Sand Worm | Sandstone Golem |
| --- | --- | --- |
| ![Jackal](visuals/monsters/Jackal.png) | ![Sand Worm](visuals/monsters/SandWorm.png) | ![Sandstone Golem](visuals/monsters/SandGolem.png) |

### Agate Peaks

Snowfields studded with blue agate. Frost wolves hunt the drifts, and the golems are made of the agate itself. **Rule:** A unit that starts its turn in deep snow has 1 less Move (snow creatures ignore it). Frozen lakes give −10 Avoid; blue agate gives +20 Avoid and +2 Def.

| Boss: Glacius, the Agate Wyrm | Attacking |
| --- | --- |
| ![Glacius, the Agate Wyrm](visuals/bosses/snow.png) | ![Glacius, the Agate Wyrm attacking](visuals/bosses/snow_attack.png) |

| Frost Wolf | Frost Sprite | Agate Golem |
| --- | --- | --- |
| ![Frost Wolf](visuals/monsters/FrostWolf.png) | ![Frost Sprite](visuals/monsters/FrostSprite.png) | ![Agate Golem](visuals/monsters/AgateGolem.png) |

### Gemstone Caverns

Caves glittering with emerald, ruby and sapphire, and chests everywhere. Not everything that shines is gold. **Rule:** Open chests for gold, but some hold only pyrite. Gem clusters give +20 Avoid and +2 Def.

| Boss: Amethyra, the Amethyst Turtle | Attacking |
| --- | --- |
| ![Amethyra, the Amethyst Turtle](visuals/bosses/cavern.png) | ![Amethyra, the Amethyst Turtle attacking](visuals/bosses/cavern_attack.png) |

| Gremlin | Gemsnail | Gem Golem |
| --- | --- | --- |
| ![Gremlin](visuals/monsters/Gremlin.png) | ![Gemsnail](visuals/monsters/Gemsnail.png) | ![Gem Golem](visuals/monsters/GemGolem.png) |

## Familiars

Each Summoner is bonded to one familiar for life and calls it once per battle (twice once promoted). Familiars are spirits, not region creatures: pale blue, translucent and crystal-free.

| Spirit Wolf: fast, bites in melee | Stone Warden: slow and sturdy, a wall for the back line | Wisp: floats, casts light magic at range 1–2 | Spirit Hawk: flies, quick strikes |
| --- | --- | --- | --- |
| ![Spirit Wolf](visuals/familiars/spiritWolf.png) | ![Stone Warden](visuals/familiars/stoneWarden.png) | ![Wisp](visuals/familiars/wisp.png) | ![Spirit Hawk](visuals/familiars/spiritHawk.png) |

## Battle sprites

Every generated unit is drawn from body parts (`js/09b-battle-rig.js`). The same drawing is the 64px map sprite and the 96px battle frames. Each weapon kind uses one pose set; each set has the same eight frames: two idle breaths, wind-up, crit wind-up, swing (the hit frame), follow-through, hit flinch and dodge. Mounts move with the rider (horses rear on the wind-up and gallop on the strike).

### Heavy: axes, halberds, hammers, greatswords

![Heavy: axes, halberds, hammers, greatswords](visuals/rigs/heavy.png)

### Blade: swords, scimitars, twin blades

![Blade: swords, scimitars, twin blades](visuals/rigs/blade.png)

### Thrust: spears, javelins, rapiers

![Thrust: spears, javelins, rapiers](visuals/rigs/thrust.png)

### Dagger: daggers, whips, chains

![Dagger: daggers, whips, chains](visuals/rigs/dagger.png)

### Bow: bows and crossbows

![Bow: bows and crossbows](visuals/rigs/bow.png)

### Cast: sigils

![Cast: sigils](visuals/rigs/cast.png)

### Cast: staves

![Cast: staves](visuals/rigs/cast_staff.png)

### Cast: charms

![Cast: charms](visuals/rigs/charm.png)

### Armoured (Knight)

![Armoured (Knight)](visuals/rigs/armour.png)

### Mounted (horse)

![Mounted (horse)](visuals/rigs/mounted.png)

### Flying (pegasus)

![Flying (pegasus)](visuals/rigs/flying.png)

### Flying (wyvern)

![Flying (wyvern)](visuals/rigs/wyvern.png)

## Characters

Looks are random (hair, skin, cloth, headgear, cape, beard; mounts get random coats with team barding). A few rolls per class, with the promoted form after the first of each movement type. Rogues, Summoners and Knights only have one movement type.

### Fighter

| Fighter | Warrior (promoted) | Fighter | Rider | Warlord (promoted) |
| --- | --- | --- | --- | --- |
| ![Fighter](visuals/classes/bruiser_0.png) | ![Warrior (promoted)](visuals/classes/bruiser_1.png) | ![Fighter](visuals/classes/bruiser_2.png) | ![Rider](visuals/classes/bruiser_3.png) | ![Warlord (promoted)](visuals/classes/bruiser_4.png) |

| Rider | Wyvern Rider | Wyvern Lord (promoted) | Wyvern Rider |
| --- | --- | --- | --- |
| ![Rider](visuals/classes/bruiser_5.png) | ![Wyvern Rider](visuals/classes/bruiser_6.png) | ![Wyvern Lord (promoted)](visuals/classes/bruiser_7.png) | ![Wyvern Rider](visuals/classes/bruiser_8.png) |

### Guard

| Axe Guard | Axe Bastion (promoted) | Axe Guard | Lance Cavalier | Lance Paladin (promoted) |
| --- | --- | --- | --- | --- |
| ![Axe Guard](visuals/classes/tank_0.png) | ![Axe Bastion (promoted)](visuals/classes/tank_1.png) | ![Axe Guard](visuals/classes/tank_2.png) | ![Lance Cavalier](visuals/classes/tank_3.png) | ![Lance Paladin (promoted)](visuals/classes/tank_4.png) |

| Axe Cavalier | Lance Wyvern Knight | Lance Dragonmaster (promoted) | Axe Wyvern Knight |
| --- | --- | --- | --- |
| ![Axe Cavalier](visuals/classes/tank_5.png) | ![Lance Wyvern Knight](visuals/classes/tank_6.png) | ![Lance Dragonmaster (promoted)](visuals/classes/tank_7.png) | ![Axe Wyvern Knight](visuals/classes/tank_8.png) |

### Skirmisher

| Lance Skirmisher | Lance Duelist (promoted) | Blade Skirmisher | Lance Outrider | Lance Ranger (promoted) |
| --- | --- | --- | --- | --- |
| ![Lance Skirmisher](visuals/classes/skirm_0.png) | ![Lance Duelist (promoted)](visuals/classes/skirm_1.png) | ![Blade Skirmisher](visuals/classes/skirm_2.png) | ![Lance Outrider](visuals/classes/skirm_3.png) | ![Lance Ranger (promoted)](visuals/classes/skirm_4.png) |

| Lance Outrider | Blade Pegasus Knight | Blade Falcon Knight (promoted) | Blade Pegasus Knight |
| --- | --- | --- | --- |
| ![Lance Outrider](visuals/classes/skirm_5.png) | ![Blade Pegasus Knight](visuals/classes/skirm_6.png) | ![Blade Falcon Knight (promoted)](visuals/classes/skirm_7.png) | ![Blade Pegasus Knight](visuals/classes/skirm_8.png) |

### Sigilist

| Sigilist | Runelord (promoted) | Sigilist | Battlemage | Archmage (promoted) |
| --- | --- | --- | --- | --- |
| ![Sigilist](visuals/classes/caster_0.png) | ![Runelord (promoted)](visuals/classes/caster_1.png) | ![Sigilist](visuals/classes/caster_2.png) | ![Battlemage](visuals/classes/caster_3.png) | ![Archmage (promoted)](visuals/classes/caster_4.png) |

| Battlemage | Sky Mage | Storm Sage (promoted) | Sky Mage |
| --- | --- | --- | --- |
| ![Battlemage](visuals/classes/caster_5.png) | ![Sky Mage](visuals/classes/caster_6.png) | ![Storm Sage (promoted)](visuals/classes/caster_7.png) | ![Sky Mage](visuals/classes/caster_8.png) |

### Mender

| Mender | Lightbearer (promoted) | Mender | Troubadour | Valkyrie (promoted) |
| --- | --- | --- | --- | --- |
| ![Mender](visuals/classes/support_0.png) | ![Lightbearer (promoted)](visuals/classes/support_1.png) | ![Mender](visuals/classes/support_2.png) | ![Troubadour](visuals/classes/support_3.png) | ![Valkyrie (promoted)](visuals/classes/support_4.png) |

| Troubadour | Sky Mender | Seraph (promoted) | Sky Mender |
| --- | --- | --- | --- |
| ![Troubadour](visuals/classes/support_5.png) | ![Sky Mender](visuals/classes/support_6.png) | ![Seraph (promoted)](visuals/classes/support_7.png) | ![Sky Mender](visuals/classes/support_8.png) |

### Rogue

| Rogue | Assassin (promoted) | Rogue |
| --- | --- | --- |
| ![Rogue](visuals/classes/rogue_0.png) | ![Assassin (promoted)](visuals/classes/rogue_1.png) | ![Rogue](visuals/classes/rogue_2.png) |

### Swordsman

| Swordsman | Swordmaster (promoted) | Swordsman | Blade Rider | Blade Lord (promoted) |
| --- | --- | --- | --- | --- |
| ![Swordsman](visuals/classes/sword_0.png) | ![Swordmaster (promoted)](visuals/classes/sword_1.png) | ![Swordsman](visuals/classes/sword_2.png) | ![Blade Rider](visuals/classes/sword_3.png) | ![Blade Lord (promoted)](visuals/classes/sword_4.png) |

| Blade Rider | Sky Blade | Sky Master (promoted) | Sky Blade |
| --- | --- | --- | --- |
| ![Blade Rider](visuals/classes/sword_5.png) | ![Sky Blade](visuals/classes/sword_6.png) | ![Sky Master (promoted)](visuals/classes/sword_7.png) | ![Sky Blade](visuals/classes/sword_8.png) |

### Shieldmaiden

| Shieldmaiden | Shield Warden (promoted) | Shieldmaiden | Shield Rider | Shield Lord (promoted) |
| --- | --- | --- | --- | --- |
| ![Shieldmaiden](visuals/classes/shield_0.png) | ![Shield Warden (promoted)](visuals/classes/shield_1.png) | ![Shieldmaiden](visuals/classes/shield_2.png) | ![Shield Rider](visuals/classes/shield_3.png) | ![Shield Lord (promoted)](visuals/classes/shield_4.png) |

| Shield Rider | Sky Shield | Valkyrie Knight (promoted) | Sky Shield |
| --- | --- | --- | --- |
| ![Shield Rider](visuals/classes/shield_5.png) | ![Sky Shield](visuals/classes/shield_6.png) | ![Valkyrie Knight (promoted)](visuals/classes/shield_7.png) | ![Sky Shield](visuals/classes/shield_8.png) |

### Knight

| Knight | General (promoted) | Knight |
| --- | --- | --- |
| ![Knight](visuals/classes/knight_0.png) | ![General (promoted)](visuals/classes/knight_1.png) | ![Knight](visuals/classes/knight_2.png) |

### Summoner

| Summoner | Conjurer (promoted) | Summoner |
| --- | --- | --- |
| ![Summoner](visuals/classes/summoner_0.png) | ![Conjurer (promoted)](visuals/classes/summoner_1.png) | ![Summoner](visuals/classes/summoner_2.png) |

## Weapons

| Jade Jian | Jade Fang | Jade Spear | Jade Axe | Jade Bow | Spark Sigil |
| --- | --- | --- | --- | --- | --- |
| ![Jade Jian](visuals/weapons/jadeJian.png) | ![Jade Fang](visuals/weapons/jadeFang.png) | ![Jade Spear](visuals/weapons/jadeSpear.png) | ![Jade Axe](visuals/weapons/jadeAxe.png) | ![Jade Bow](visuals/weapons/jadeBow.png) | ![Spark Sigil](visuals/weapons/sparkT.png) |

| Thunderhead Sigil | Meteor Sigil | Heaven’s Bolt | Longbow | Throwing Knives | Crook Staff |
| --- | --- | --- | --- | --- | --- |
| ![Thunderhead Sigil](visuals/weapons/thunderhead.png) | ![Meteor Sigil](visuals/weapons/meteorT.png) | ![Heaven’s Bolt](visuals/weapons/boltT.png) | ![Longbow](visuals/weapons/longbow.png) | ![Throwing Knives](visuals/weapons/throwKnives.png) | ![Crook Staff](visuals/weapons/crookStaff.png) |

| Rune Staff | Far Charm | Dirk | Twin Daggers | Stiletto | Crossbow |
| --- | --- | --- | --- | --- | --- |
| ![Rune Staff](visuals/weapons/runeStaff.png) | ![Far Charm](visuals/weapons/farMend.png) | ![Dirk](visuals/weapons/dirk.png) | ![Twin Daggers](visuals/weapons/twinBlades.png) | ![Stiletto](visuals/weapons/stiletto.png) | ![Crossbow](visuals/weapons/crossbow.png) |

| Knightly Sword | Hatchet | Iron Spear | Short Bow | Ember Sigil | Umbral Sigil |
| --- | --- | --- | --- | --- | --- |
| ![Knightly Sword](visuals/weapons/steelJian.png) | ![Hatchet](visuals/weapons/ironAxe.png) | ![Iron Spear](visuals/weapons/ironSpear.png) | ![Short Bow](visuals/weapons/shortBow.png) | ![Ember Sigil](visuals/weapons/flameT.png) | ![Umbral Sigil](visuals/weapons/darkT.png) |

Jade weapons are the high-crit (killer) line; Meteor Sigil and Heaven's Bolt reach 3–10 tiles in Act 2; staves belong to Summoners; daggers to Rogues.

## Region tiles

| Sandstone Rocks | Quicksand | Snow | Deep Snow | Blue Agate | Frozen Lake |
| --- | --- | --- | --- | --- | --- |
| ![Sandstone Rocks](visuals/tiles/sandstone.png) | ![Quicksand](visuals/tiles/quicksand.png) | ![Snow](visuals/tiles/snow.png) | ![Deep Snow](visuals/tiles/deepsnow.png) | ![Blue Agate](visuals/tiles/agate.png) | ![Frozen Lake](visuals/tiles/ice.png) |

| Cave Floor | Iridescent Rock | Emerald Cluster | Ruby Cluster | Sapphire Cluster |
| --- | --- | --- | --- | --- |
| ![Cave Floor](visuals/tiles/cave.png) | ![Iridescent Rock](visuals/tiles/cavewall.png) | ![Emerald Cluster](visuals/tiles/emerald.png) | ![Ruby Cluster](visuals/tiles/ruby.png) | ![Sapphire Cluster](visuals/tiles/sapphire.png) |

The iridescent cave walls and feldspar-with-smoky-quartz sandstone are based on museum mineral photos.

## Event scenes

| smith | armoury | enchanter |
| --- | --- | --- |
| ![smith](visuals/scenes/event_smith.png) | ![armoury](visuals/scenes/event_armoury.png) | ![enchanter](visuals/scenes/event_enchanter.png) |

| shrine | spar | merchant |
| --- | --- | --- |
| ![shrine](visuals/scenes/event_shrine.png) | ![spar](visuals/scenes/event_spar.png) | ![merchant](visuals/scenes/event_merchant.png) |

| gamble | idol | cage |
| --- | --- | --- |
| ![gamble](visuals/scenes/event_gamble.png) | ![idol](visuals/scenes/event_idol.png) | ![cage](visuals/scenes/event_cage.png) |

| spring | well | battlefield |
| --- | --- | --- |
| ![spring](visuals/scenes/event_spring.png) | ![well](visuals/scenes/event_well.png) | ![battlefield](visuals/scenes/event_battlefield.png) |

| jadetomb | stormaltar | cache |
| --- | --- | --- |
| ![jadetomb](visuals/scenes/event_jadetomb.png) | ![stormaltar](visuals/scenes/event_stormaltar.png) | ![cache](visuals/scenes/event_cache.png) |

| veteran | statue | drill |
| --- | --- | --- |
| ![veteran](visuals/scenes/event_veteran.png) | ![statue](visuals/scenes/event_statue.png) | ![drill](visuals/scenes/event_drill.png) |

| toll | witch | fog |
| --- | --- | --- |
| ![toll](visuals/scenes/event_toll.png) | ![witch](visuals/scenes/event_witch.png) | ![fog](visuals/scenes/event_fog.png) |

| chest | library | star |
| --- | --- | --- |
| ![chest](visuals/scenes/event_chest.png) | ![library](visuals/scenes/event_library.png) | ![star](visuals/scenes/event_star.png) |

| spire | oracle | sage |
| --- | --- | --- |
| ![spire](visuals/scenes/event_spire.png) | ![oracle](visuals/scenes/event_oracle.png) | ![sage](visuals/scenes/event_sage.png) |

| hoard | echo | fallen |
| --- | --- | --- |
| ![hoard](visuals/scenes/event_hoard.png) | ![echo](visuals/scenes/event_echo.png) | ![fallen](visuals/scenes/event_fallen.png) |

| seam |
| --- |
| ![seam](visuals/scenes/event_seam.png) |

Each event scene is tinted to the region it appears in (shown here in the first region).

---
Images are exported from the game with a headless browser (`fig()`, `icon()`, `bioTile2()`, `eventScene()` and the scene functions), scaled up with nearest-neighbour. The full design decisions live in the Shardbreaker spec doc (Decisions tab).

## High-res units

Every generated unit is built from body parts (js/09b-battle-rig.js). Map sprites are 64px and battle frames are 96px.

![Map sprites: classes, weapons and mounts](visuals/units/map_sprites.png)

Battle poses for every weapon set and mount are under **Battle sprites** above.


## Title screen

A blighted red crystal in the distance, with corruption veins pulsing through the land and red shards drifting upward.

![Title screen](visuals/scenes/title.png)

## Effective damage

Monsters carry body tags, shown on their info sheet and in the forecast: wing (Flier), shell (Armoured), paw (Beast), crown (Colossal), ghost (Spectral), leaf (Plant). Slayer weapons and skills deal ×2 weapon might to their tag, and so do bows against fliers.

![Effective damage chart](visuals/scenes/effective_chart.png)

A possible variant with three crystals and more veins (`TITLE_MULTI=true` in js/28-startup.js):

![Title, three crystals](visuals/scenes/title_multi.png)

## The Flying Ship

The ship isn't a tile set: it's drawn on the fly from the map letters (d deck, h hull, M mast, H helm) by `shipArt()` in `js/04-ship-art.js`, with sails either side. Two layouts:

| Main Deck | Galleon Deck |
|---|---|
| ![Main Deck](visuals/scenes/map_deck.png) | ![Galleon Deck](visuals/scenes/map_galleon.png) |

## Battle backdrops

The side-on fight scene uses a backdrop for the current region (`battleBgArt` in js/09-battle-scene.js, 160×90, horizon at y 63). Regions without one fall back to the old terrain gradients. `heart` is Act 3.

![Battle backdrops](visuals/scenes/battle_backdrops.png)
