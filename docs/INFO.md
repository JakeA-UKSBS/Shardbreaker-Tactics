# Shardbreaker — game info

Numbers pulled straight from the game data. Regenerate this file after balance changes instead of editing it by hand.

## Who you can recruit

Every generated unit (Crossroads, recruit rooms, tavern, events) picks a **role** at random, then a **weapon** from that role's list, then a **movement type**. The Crossroads always includes at least one Mender.

- **Role:** equal odds: 1 in 9 (1 in 10 once the Summoner is unlocked).
- **Movement:** Knights are always armoured. Rogues and Summoners always walk. Everyone else is 22% mounted, otherwise on foot; once Sky Riders is unlocked, 15% of those on foot fly instead (never bow users).

| Role | Promotes to | Weapons | Move odds (before Sky Riders) | Move odds (with Sky Riders) |
|---|---|---|---|---|
| Fighter | Warrior | Heavy, Polearm | Foot 78% · Mounted 22% | Foot 66% · Mounted 22% · Flying 12% |
| Guard | Bastion | Blade, Heavy, Polearm | Foot 78% · Mounted 22% | Foot 66% · Mounted 22% · Flying 12% |
| Skirmisher | Duelist | Blade, Polearm, Bow | Foot 78% · Mounted 22% | Foot 70% · Mounted 22% · Flying 7.8% |
| Sigilist | Runelord | Sigil | Foot 78% · Mounted 22% | Foot 66% · Mounted 22% · Flying 12% |
| Mender | Lightbearer | Charm | Foot 78% · Mounted 22% | Foot 66% · Mounted 22% · Flying 12% |
| Rogue | Assassin | Blade | Foot 100% | Foot 100% |
| Swordsman | Swordmaster | Blade | Foot 78% · Mounted 22% | Foot 66% · Mounted 22% · Flying 12% |
| Shieldmaiden | Shield Warden | Blade, Polearm | Foot 78% · Mounted 22% | Foot 66% · Mounted 22% · Flying 12% |
| Knight | General | Blade, Polearm | Armour 100% | Armour 100% |
| Summoner (unlock) | Conjurer | Sigil | Foot 100% | Foot 100% |

### Chance of each exact class (before unlocks)

| Class | Role | Weapon | Movement | Chance |
|---|---|---|---|---|
| Rogue | Rogue | Blade | foot | 11% |
| Sigilist | Sigilist | Sigil | foot | 8.7% |
| Mender | Mender | Charm | foot | 8.7% |
| Swordsman | Swordsman | Blade | foot | 8.7% |
| Knight | Knight | Blade | armour | 5.6% |
| Knight | Knight | Polearm | armour | 5.6% |
| Fighter | Fighter | Heavy | foot | 4.3% |
| Fighter | Fighter | Polearm | foot | 4.3% |
| Shieldmaiden | Shieldmaiden | Blade | foot | 4.3% |
| Shieldmaiden | Shieldmaiden | Polearm | foot | 4.3% |
| Blade Guard | Guard | Blade | foot | 2.9% |
| Axe Guard | Guard | Heavy | foot | 2.9% |
| Lance Guard | Guard | Polearm | foot | 2.9% |
| Blade Skirmisher | Skirmisher | Blade | foot | 2.9% |
| Lance Skirmisher | Skirmisher | Polearm | foot | 2.9% |
| Bow Skirmisher | Skirmisher | Bow | foot | 2.9% |
| Battlemage | Sigilist | Sigil | mounted | 2.4% |
| Troubadour | Mender | Charm | mounted | 2.4% |
| Blade Rider | Swordsman | Blade | mounted | 2.4% |
| Rider | Fighter | Heavy | mounted | 1.2% |
| Rider | Fighter | Polearm | mounted | 1.2% |
| Shield Rider | Shieldmaiden | Blade | mounted | 1.2% |
| Shield Rider | Shieldmaiden | Polearm | mounted | 1.2% |
| Blade Cavalier | Guard | Blade | mounted | 0.8% |
| Axe Cavalier | Guard | Heavy | mounted | 0.8% |
| Lance Cavalier | Guard | Polearm | mounted | 0.8% |
| Blade Outrider | Skirmisher | Blade | mounted | 0.8% |
| Lance Outrider | Skirmisher | Polearm | mounted | 0.8% |
| Bow Outrider | Skirmisher | Bow | mounted | 0.8% |

### Base stats and growths

Base stats get ±1 random. Growths are the % chance per level, rolled once per unit within the range shown. Skl is folded into Luck (a unit keeps the higher of the two). **Note:** in this build every level-up gives +1 to each shown stat; growths only apply while a recruit is levelled up to its starting level.

| Role | HP | Str | Mag | Skl | Spd | Lck | Def | Res |
|---|---|---|---|---|---|---|---|---|
| Fighter | 21 (75–95%) | 7 (45–65%) | 0 (0–10%) | 4 (30–45%) | 4 (30–45%) | 2 (15–35%) | 4 (20–35%) | 1 (5–20%) |
| Guard | 22 (80–100%) | 5 (40–55%) | 0 (0–10%) | 3 (25–40%) | 2 (15–30%) | 1 (15–30%) | 7 (35–50%) | 1 (5–20%) |
| Skirmisher | 18 (60–80%) | 5 (35–50%) | 0 (0–15%) | 7 (45–65%) | 8 (50–70%) | 4 (30–50%) | 3 (15–30%) | 2 (15–30%) |
| Sigilist | 17 (55–70%) | 0 (0–10%) | 6 (45–65%) | 5 (35–50%) | 5 (35–55%) | 3 (20–40%) | 2 (10–20%) | 5 (35–55%) |
| Mender | 17 (50–65%) | 0 (0–10%) | 3 (40–55%) | 4 (30–45%) | 6 (40–55%) | 5 (40–60%) | 1 (10–20%) | 6 (40–60%) |
| Rogue | 16 (50–65%) | 5 (30–45%) | 0 (0–10%) | 7 (45–60%) | 9 (55–70%) | 6 (40–60%) | 2 (10–20%) | 1 (10–25%) |
| Swordsman | 18 (60–75%) | 6 (40–55%) | 0 (0–10%) | 7 (45–60%) | 9 (55–70%) | 4 (30–45%) | 3 (15–25%) | 1 (10–25%) |
| Shieldmaiden | 20 (70–90%) | 4 (35–50%) | 0 (0–10%) | 4 (30–45%) | 5 (30–45%) | 3 (20–40%) | 6 (30–45%) | 4 (20–35%) |
| Knight | 24 (85–100%) | 5 (45–60%) | 0 (0–10%) | 3 (20–35%) | 1 (10–25%) | 0 (10–25%) | 9 (40–55%) | 0 (0–15%) |
| Summoner | 16 (50–65%) | 0 (0–10%) | 5 (40–55%) | 4 (30–45%) | 5 (35–50%) | 3 (25–45%) | 2 (10–20%) | 5 (35–50%) |

Movement adjusts stats: **armour** +2 HP, +1 Str, -2 Spd, +3 Def; **flying** -1 HP, +1 Spd, +1 Lck, -1 Def, +1 Res; **mounted** +1 HP, +1 Spd, -1 Res. Move: foot 5, armour 4, mounted 7, flying 6 (+1 when promoted).

### Personal skills (one picked per unit)

| Role | Possible personal skill |
|---|---|
| Fighter | Wrath, Swiftstrike, Steadfast, Quick Draw, Momentum, Stonebane |
| Guard | Steadfast, Taunt, Iron Skin, Retaliate, Spiritbane |
| Skirmisher | Swiftstrike, Focus, Keen Eye, Hit and Run, Flurry, Early Edge |
| Sigilist | Kindle, Focus, Spell Ward, Quick Study |
| Mender | Renewal, Spell Ward, Fleet Foot, Quick Study |
| Rogue | Flurry, Whirlwind, Hit and Run, Wolfsbane, Focus |
| Swordsman | Swiftstrike, Flurry, Focus, Wolfsbane, Early Edge |
| Shieldmaiden | Guardian, Steadfast, Taunt, Spell Ward |
| Knight | Pike Wall, Steadfast, Iron Skin, Retaliate |
| Summoner | Kindle, Focus, Quick Study |

### Starting weapons

| Weapon type | Starting weapon (equal odds) |
|---|---|
| Blade | Worn Sword, Thorn Rapier, Hooked Blade |
| Heavy | Hatchet, Halberd |
| Polearm | Iron Spear, Javelin |
| Bow | Short Bow, Crossbow |
| Sigil | Ember Sigil, Dawn Sigil, Ember Sigil, Dawn Sigil, Umbral Sigil |

Menders start with a Mending Charm and a Dawn Sigil. Summoners start with a Crook or Rune Staff. Rogues start with a Dirk (2 in 4), Twin Daggers or a Stiletto. Shieldmaidens and Knights never start with twin blades or rapiers. Everyone else also carries a Salve.

## Weapons

Weapons never break (except the 5-use Meteor and Heaven's Bolt).

| Weapon | Type | Mt | Hit | Crit | Wt | Rng | Effective vs |
|---|---|---|---|---|---|---|---|
| Worn Sword | Blade | 5 | 90 | 0 | 4 | 1 |  |
| Twin Daggers | Blade | 4 | 95 | 5 | 2 | 1 |  |
| Knightly Sword | Blade | 8 | 75 | 0 | 8 | 1 |  |
| Thorn Rapier | Blade | 5 | 100 | 10 | 3 | 1 |  |
| Hooked Blade | Blade | 7 | 80 | 5 | 6 | 1 |  |
| Moonglass Edge | Blade | 7 | 80 | 30 | 6 | 1 |  |
| Iron Spear | Polearm | 7 | 80 | 0 | 6 | 1 |  |
| Steel Spear | Polearm | 10 | 70 | 0 | 10 | 1 |  |
| Javelin | Polearm | 6 | 65 | 0 | 8 | 1–2 |  |
| Hatchet | Heavy | 8 | 75 | 0 | 7 | 1 |  |
| Cleaver | Heavy | 11 | 65 | 0 | 11 | 1 |  |
| Throwing Axe | Heavy | 7 | 60 | 0 | 9 | 1–2 |  |
| Halberd | Heavy | 9 | 70 | 0 | 9 | 1 |  |
| Short Bow | Bow | 6 | 85 | 0 | 3 | 2 | Flier |
| Ironwood Bow | Bow | 9 | 70 | 0 | 7 | 2 | Flier |
| Crossbow | Bow | 8 | 80 | 0 | 6 | 2 | Flier |
| Thorn Whip | Reach | 4 | 85 | 0 | 3 | 1–2 |  |
| Chain Sickle | Reach | 6 | 75 | 0 | 5 | 1–2 |  |
| War Fan | Reach | 5 | 85 | 5 | 3 | 1–2 |  |
| Bone Parasol | Reach | 6 | 80 | 0 | 5 | 1–2 |  |
| Ember Sigil | Sigil (Fire) | 5 | 90 | 0 | 2 | 1–2 | Plant |
| Tide Sigil | Sigil (Water) | 5 | 90 | 0 | 3 | 1–2 |  |
| Gale Sigil | Sigil (Wind) | 4 | 95 | 5 | 2 | 1–2 |  |
| Stone Sigil | Sigil (Earth) | 7 | 75 | 0 | 6 | 1–2 |  |
| Storm Sigil | Sigil (Lightning) | 8 | 80 | 5 | 5 | 1–2 |  |
| Mirror Sigil | Sigil (Illusion) | 6 | 85 | 0 | 3 | 1–2 |  |
| Thorn Sigil | Sigil (Nature) | 5 | 90 | 0 | 3 | 1–2 |  |
| Dawn Sigil | Sigil (Light) | 5 | 90 | 0 | 2 | 1–2 | Spectral |
| Umbral Sigil | Sigil (Dark) | 5 | 85 | 0 | 5 | 1–2 |  |
| Crook Staff | Sigil | 6 | 85 | 0 | 4 | 1 |  |
| Rune Staff | Sigil | 4 | 85 | 0 | 3 | 1–2 |  |
| Glimmer | Sigil (Light) | 2 | 85 | 0 | 1 | 1–2 | Spectral |
| Greatsword | Blade | 11 | 70 | 5 | 12 | 1 |  |
| Labrys | Heavy | 12 | 75 | 10 | 13 | 1 |  |
| Dirk | Blade | 3 | 95 | 15 | 1 | 1 |  |
| Stiletto | Blade | 4 | 90 | 25 | 2 | 1 |  |
| Spellbreaker | Blade | 6 | 80 | 0 | 6 | 1 |  |
| Axebreaker | Polearm | 7 | 80 | 0 | 7 | 1 |  |
| Swordbreaker | Heavy | 8 | 75 | 0 | 8 | 1 |  |
| Barbed Spear | Polearm | 8 | 75 | 30 | 7 | 1 |  |
| Reaver Axe | Heavy | 10 | 65 | 30 | 9 | 1 |  |
| Hawkeye Bow | Bow | 7 | 80 | 30 | 5 | 2 | Flier |
| Jade Jian | Blade | 7 | 80 | 30 | 5 | 1 |  |
| Jade Fang | Blade | 5 | 90 | 35 | 2 | 1 |  |
| Jade Spear | Polearm | 9 | 75 | 30 | 8 | 1 |  |
| Jade Axe | Heavy | 11 | 65 | 30 | 10 | 1 |  |
| Jade Bow | Bow | 8 | 75 | 30 | 5 | 2 | Flier |
| Longbow | Bow | 6 | 70 | 0 | 6 | 2–3 | Flier |
| Throwing Knives | Blade | 3 | 90 | 10 | 1 | 1–2 |  |
| Spark Sigil | Sigil (Lightning) | 4 | 95 | 15 | 2 | 1–2 |  |
| Thunderhead Sigil | Sigil (Lightning) | 8 | 75 | 30 | 6 | 1–2 |  |
| Heaven’s Bolt | Sigil (Lightning) | 10 | 65 | 5 | 8 | 3–10 |  |
| Meteor Sigil | Sigil (Earth) | 13 | 60 | 0 | 9 | 3–10 |  |
| War Hammer | Heavy | 8 | 70 | 0 | 10 | 1 | Armoured |
| Hunting Spear | Polearm | 7 | 80 | 0 | 6 | 1 | Beast |
| Holy Sword | Blade | 8 | 80 | 5 | 6 | 1 | Spectral |
| Giantslayer | Blade | 9 | 70 | 0 | 10 | 1 | Colossal |

## Effective damage

An effective hit multiplies weapon Mt ×2. Only your side deals them for now.

| Monster type | Who has it | Beaten by |
|---|---|---|
| Flier | Gloomwing, Storm Harpy, Harpy, Hawk, Wyvern, Pegasus, Roc, Wisp, Spirit Hawk | Bows |
| Armoured | Mindsnail, Fallen Sentinel, Iron Husk, Boulder Golem, Sandstone Golem, Pyrite Colossus, Agate Golem, Gem Golem, Gemsnail, Amethyst Turtle, Pebble Golem, Stone Warden | War Hammer, Stonebane |
| Beast | Wolf, Hawk, Snake, Alligator, Cursed Stag, Magma Dragon, Wyvern, Pegasus, Bog Lurker, Jackal, Sand Worm, Frost Wolf, Agate Wyrm, Hollow Bear, Bone Wyrm, Roc, Spirit Wolf, Spirit Hawk | Hunting Spear, Wolfsbane |
| Colossal | Every 2×2 boss | Giantslayer |
| Spectral | Ghost, Fire Sprite, Frost Sprite, Wisp | Light sigils, Holy Sword, Spiritbane, Paladins |
| Plant | Sporeling, Myconid, Mushroom King, Blighted Treant | Fire sigils |

## Skills

Learned skills cost capacity (base 20, +5 when promoted). Personal skills are free.

| Skill | Cost | Effect |
|---|---|---|
| Steadfast | 5 | +4 Def and Res when attacked during the enemy phase. |
| Keen Eye | 5 | +20 Hit, and the target's terrain gives no Avoid. |
| Kindle | 5 | +2 Mag when this unit starts the fight. |
| Swiftstrike | 5 | +3 Spd for doubling when this unit starts the fight. |
| Wrath | 10 | +15 Crit while at half HP or less. |
| Focus | 10 | +10 Crit when no ally is adjacent. |
| Renewal | 10 | Adjacent allies recover 5 HP at the start of each of your turns. |
| Pierce | 15 | Luck×1.5% chance: the strike ignores half the target's Def. |
| Bulwark | 15 | Luck×2% chance: halves damage from an incoming strike. |
| Stone Gaze | 20 | Luck% chance on a hit: the target turns to stone, loses its next turn and can't counter. Bosses are immune. |
| Lifetaker | 20 | Luck×2% chance: restores HP equal to the damage dealt. |
| Hit and Run | 10 | After attacking in melee, steps back one tile if there is room. |
| Quick Draw | 15 | When attacked at half HP or less, strikes first. |
| Flurry | 15 | Spd% chance of an extra strike in each fight. |
| Whirlwind | 20 | Luck÷2% chance: one strike becomes five hits at half damage. |
| Retaliate | 15 | Luck% chance, when hit in melee, to deal the same damage back. |
| Iron Skin | 10 | Luck×2% chance to halve physical damage taken. |
| Spell Ward | 10 | Luck×2% chance to halve magic damage taken. |
| Momentum | 20 | Once per turn, defeating an enemy on your turn lets this unit act again. |
| Fleet Foot | 10 | +2 Move. |
| Taunt | 5 | Enemies would rather attack this unit. |
| Quick Study | 10 | Gains double EXP. |
| Early Edge | 10 | +20 Hit and Avoid on turns 1 to 5. |
| Wolfsbane | 10 | Effective (×2) against Beasts. |
| Spiritbane | 10 | Effective (×2) against Spectral foes. |
| Stonebane | 10 | Effective (×2) against Armoured foes. |
| Guardian | 10 | Adjacent allies take 2 less damage. |
| Pike Wall | 5 | +4 Def and +10 Hit against mounted units and fliers. |

## Relics

| Relic | Rarity | Effect |
|---|---|---|
| Unbroken Banner | Common | Units at full HP deal +2 damage. |
| Whetstone | Common | All units gain +10 Hit. |
| Swift Boots | Common | All units gain +1 Move. |
| Herbalist’s Bag | Common | Units heal 3 HP at the start of each of your turns. |
| Tower Shield | Common | Units next to an ally gain +2 Def and Res. |
| Old Tome | Uncommon | Units gain 50% more EXP. |
| Lucky Coin | Uncommon | All units gain +10 Crit. |
| Vampire Fang | Uncommon | Units heal 5 HP when they defeat an enemy. |
| War Horn | Uncommon | On turn 1 of each battle, units deal +3 damage. |
| Phoenix Feather | Rare | Once per run, the first unit to fall survives with 1 HP. |
| Slayer’s Crown | Rare | Units deal +4 damage to bosses and elite leaders. |
| Pathfinder’s Lantern | Rare | Recruit nodes offer 4 units, 1 level higher. |
| Endless Quiver | Uncommon (after 2 runs) | Bows deal +3 damage. |
| Focus Gem | Uncommon (after 2 runs) | Arts deal +2 damage and gain +10 Hit. |
| Golden Spurs | Uncommon (after 4 runs) | Mounted and flying units gain +1 Move and +10 Avoid. |
| Iron Bulwark | Uncommon (after 4 runs) | Armoured units take 2 less damage. |
| Pocket Anvil | Rare (after 6 runs) | The Wandering Smith reforges twice. |
| Falconer’s Whistle | Uncommon | A hawk fights beside you in every battle. If it falls, it’s back for the next one. |
| Mirror Charm | Rare (after 6 runs) | Enemies get −10 Hit against your units. |
| Iron Rose | Uncommon | Units below half HP take 3 less damage. |
| Aventurine | Common | All units gain +10 Avoid and +5 Crit. |
| Hunter’s Trophies | Uncommon | Effective hits deal 2 more damage. |
| Horn of Plenty | Uncommon | +15 gold after every won fight, and tavern meals last 1 fight longer. |
| Herbal Poultice | Starter | Salves heal 2 more HP. |
| Sage’s Satchel | Heirloom | Everyone in your starting squad carries an extra Salve. |
| Waybread | Heirloom | Units recover 3 more HP after each fight. |
| Coin Purse | Starter | Start the run with 30 more gold. |
| Ithren’s Ward | Starter | All your units get +1 Res. |
| Sprig of Renewal | Starter | Every unit heals 1 HP at the start of each player phase. |

## Rules of thumb

- **EXP:** ×1.2. Units promote at Lv 5 (+5 skill capacity). Every level-up is +1 to each shown stat.
- **HP between fights:** survivors recover 5 HP after a win (3 from Ascension 3; Waybread +3). Taverns and the camp before the boss heal fully. Salves can be used on the road map.
- **Early ease:** in Act 1, enemies deal 2 less damage on floors 1–3 and 1 less on 4–6 (off from Ascension 3).
- **Bosses:** 2×2, move 2, Colossal.
- **Loot:** skill after 40% of fights (half of those are the region's slayer skill), Salve after 50%, slayer weapon after 15% of battles and 35% of elites (only if someone can wield it).
- **Inn:** one drink, one meal and one hire per visit.
- **Ascension levels:** 1: Enemies are 1 level higher. · 2: Bosses and elite leaders are much tougher. · 3: No early ease, you start with no gold, and units recover only 5 HP after a fight. · 4: Enemies are another level higher, with one more in each battle. · 5: Every enemy knows a combat skill.

## Regions

| Region | Monsters (weight; from floor) | Elite pack | Boss |
|---|---|---|---|
| Mycelia | Sporeling 4, Mindsnail 2 (fl 3+) | Mindsnail, Sporeling | King Morel the Blighted |
| Sunless Isle | Skeleton 4, Ghost 2 (fl 3+) | Ghost, Skeleton | The Bone Wyrm |
| Bog of Eternal Stench | Bog Lurker 3, Lamia 3 (fl 2+), Mud Monster 2 (fl 4+) | Mud Monster, Lamia, Bog Lurker | Krondis |
| Cursed Woodland | Wolf 4, Cursed Stag 3 (fl 2+), Blighted Treant 2 (fl 5+) | Blighted Treant, Cursed Stag, Wolf | The Hollow Bear |
| Volcanic Isle | Fire Sprite 3, Boulder Golem 3 (fl 3+), Harpy 1 (fl 4+) | Boulder Golem, Fire Sprite, Harpy | Pyraxis, the Magma Dragon |
| The Flying Ship | Harpy 3, Wyvern 2 (fl 3+) | Wyvern, Harpy | The Great Roc |
| The Labyrinth | Gremlin 3, Beholder 2 (fl 3+) | Beholder, Gremlin | Minotaur lord |
| Sandstone Desert | Jackal 4, Sand Worm 3 (fl 2+), Sandstone Golem 2 (fl 4+) | Sandstone Golem, Jackal, Sand Worm | The Pyrite Colossus |
| Agate Peaks | Frost Wolf 4, Frost Sprite 3 (fl 2+), Agate Golem 2 (fl 4+) | Agate Golem, Frost Wolf, Frost Sprite | Glacius, the Agate Wyrm |
| Gemstone Caverns | Gremlin 3, Gemsnail 3 (fl 2+), Gem Golem 2 (fl 4+) | Gem Golem, Gemsnail, Gremlin | Amethyra, the Amethyst Turtle |
