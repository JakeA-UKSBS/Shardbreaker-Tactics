# Shardbreaker Tactics: to-do

A snapshot of what's outstanding, as of 24 November 2026. Tick things off or delete them as they're done.

## Open GitHub issues

- [ ] #171 Camera: WASD panning, zoom to the action, zoom out on player phase
- [ ] #134 Events: add more skill rewards
- [ ] #112 Controller support
- [ ] #109 Skip button for dialogue and cutscenes
- [ ] #108 Buff EXP gains once stat growths are rebalanced
- [ ] #107 Class-based stat growths instead of +1 to every stat
- [ ] #194 Godot port prep

## Waiting on art (Rhi)

- [ ] Maelis's light attack animation (Smite borrows the holy-pillar effect until then)
- [ ] Type icons: Ice, Scaled (16px placeholders; Infernal and Ooze are done)
- [ ] Artifact icons: Duellist's Charm, Wyrmscale, Innkeeper's Token, Crimson Edge (placeholders)
- [ ] Fruit icons: Vigour Apple, Quickberries (placeholders)
- [ ] New item icons borrowing others for now: Tenebrous Seal (Umbral Sigil), Holy Seal (Dawn Sigil), Regen Staff (Mending Staff), Rapid Bow (Short Bow), Horse Bow (Longbow); the Lyre has a quick placeholder
- [ ] Event scenes still drawn in code: Antiquities Dealer, The Stables, The Orchard, Jungle Maze, Tablet of the Ancients, Relaxing Outcrop
- [ ] Spare frames not used yet: Kaya's 7th (bow drawn again), Celestine's 7th

## Decisions to make

- [ ] **Desert, floors 1 to 3:** only Sand Worms spawn there since the Jackal went. It needs a new early monster.
- [ ] **Seren's Spirit Bolt:** keep it or cut it? It's her only damaging ability. It no longer has an element.
- [ ] **Bows vs Beast:** bows and the Hunting Spear both double against beasts. Watch whether bows get too strong.
- [ ] **Thunder Sigil:** now the 8 Mt armoury upgrade; check it feels right next to the Storm Sigil.
- [ ] Offered earlier, never confirmed: a +5 max HP fish at the Old Fisherman (no frog poison)

## Weapons

The big overhaul is planned; until then, these are thin. Starting weapons are excluded from the counts.

| Who | Weapon type | Other weapons they can use |
|---|---|---|
| Lysander | Lyre (instrument) | 0: his Lyre can't attack or heal, and he can't use staves |
| Kili, Kaya | Bow | 5: the other bows (Short, Long, Rapid, Hawkeye, Yew Greatbow). Kaya starts with the Horse Bow |
| Rook | Dagger | 4: Stiletto, Jade Fangs, Steel Knives, Throwing Knives |
| Rhyn, Jun, Raptor | Sword | 4: Twin Khopesh / Worn Sword, Jade Jian, Gale Sword, Holy Sword |
| Celestine | Sword | 4: Worn Sword, Twin Khopesh, Jade Jian, Gale Sword |
| Zwei | Greatsword | 4: Giantslayer, Claymore, Zweihänder, Flamberge |
| Vaar | Axe | 5: Steel Hatchet, Throwing Axe, Reaver Axe, Tomahawk, War Hammer |
| Aldric, Arthur | Spear | 5: Steel Spear, Atlatl, Javelin, Qiang, Hunting Spear |
| Sigil users | Sigil | 5 to 8, but limited by signature elements (below) |

Gaps by element (signature sigils are locked to one person):

- [x] **Dark** (Morrigan): Tenebrous Seal added as her upgrade.
- [x] **Light** (Maelis): Holy Seal added as her upgrade.
- [ ] **Summoner** (Seren): the Rune Crook is the only attack staff; no upgrade.
- [ ] **Ice** (Yvera): only the Blizzard Sigil.
- [ ] **Fire** (Klaus): only the Flame Sigil.
- [ ] **Healing staves:** 3 now (Mending, Far and the new Regen Staff: heal 10, then 3 HP a turn for 3 turns).
- [x] **Bows:** the Longbow now reaches 2–4; the new Rapid Bow gets +2 Spd for doubling.
- [ ] **Armoury stock:** 30 items now; you plan to add more.

## Skills

Skill rewards (The Sphinx, Tablet of the Ancients) offer 3 skills from the unit's role list. The short lists are:

| Role | Who | Skills |
|---|---|---|
| Knight | Aldric, Celestine | 3: Steadfast, Iron Skin, Retaliate |
| Summoner | Seren | 3: Kindle, Focus, Quick Study |
| Sigilist | Morrigan, Yvera, Drecken, Klaus | 4: Kindle, Focus, Spell Ward, Quick Study |
| Mender | Maelis, Lysander | 4: Renewal, Spell Ward, Fleet Foot, Quick Study |
| Shieldmaiden | Rhyn, Raptor | 4: Guardian, Steadfast, Taunt, Spell Ward |
| Guard | Arthur | 5: Steadfast, Taunt, Iron Skin, Retaliate, Fiendbane |
| Rogue | Rook | 5: Flurry, Whirlwind, Hit and Run, Wolfsbane, Focus |
| Swordsman | Jun, Zwei | 5: Swiftstrike, Flurry, Focus, Wolfsbane, Early Edge |
| Fighter | Vaar | 6: Wrath, Swiftstrike, Steadfast, Quick Draw, Momentum, Stonebane |
| Skirmisher | Kili, Kaya | 6: Swiftstrike, Focus, Keen Eye, Hit and Run, Flurry, Early Edge |

- [ ] Knight and Summoner run dry after 1 reward each (3 skills, 3 offered).
- [ ] Sigilists, Menders and Shieldmaidens need a couple more each.
- [ ] Summoner skills could lean into the summons (stronger or longer-lived spirits).

## Monsters

Wolves, golems, the Ice Troll and the Blighted Croc have passives (see below); otherwise only bosses do (Wrath, Steadfast, Focus).

**No abilities at all:**

- [ ] Shardling (crystals)
- [ ] Prism (crystals)
- [ ] Crystal Sentinel (crystals)
- [ ] Blighted Croc (swamp)
- [ ] The Crystal Heart (final boss: Focus passive, no moves)
- [ ] Spirit Frog (summon; maybe fine as it is)

**Only one ability:**

- [ ] Swamp Ooze: Mud Spit
- [ ] Blighted Stag: Charge
- [ ] Gem Golem: Boulder Toss
- [ ] Krondis (boss): Death Roll
- [ ] The Yeti (boss): Ground Slam
- [ ] Amethyra (boss): Hunker Down

**Passive ideas for regular monsters:**

- [x] Wolves / Frost Wolves: Pack Tactics (+10 Hit next to another wolf)
- [ ] Oozes: split when hit by a sword or lightning (5e-style)
- [x] Golems: Heavy (can't be pushed or pulled)
- [ ] Crystal monsters: Shatter (damage nearby units when they die)
- [x] Ice Troll: Troll Blood (3 HP a turn, switched off by fire)
- [x] Blighted Croc: Swamp Swimmer (+1 Spd in water)

## Events

37 events in total. Acts 1 and 2 share most of them; acts 2 and 3 have only a few of their own.

**Any act (1 or 2):** The Wandering Smith, The Enchanter's Study, Blood Shrine, Training Ground, Gambler's Table, The Golden Idol, The Caged Traveller, The Weaponmaster, The Wandering Minstrel, The Sphinx, The Old Fisherman, Antiquities Dealer, The Stables, The Orchard, Jungle Maze, Tablet of the Ancients, Relaxing Outcrop, Wishing Well, Old Battlefield, The Wayside Chapel, The Empty Throne, Statue of Valour, The Toll Bridge, The Bog Witch, A Suspicious Chest, The Crystal-Touched Beast, The Black Onyx, The Sinking Sands, The Frozen Cache, The Dwarf Smith, The Tailor, The Gnome Scholar.

**Act 2 only:** The Fallen Star, The Storm Spire, The Oracle.

**Act 3 only:** Ithren's Echo, Those Who Came Before.

- [ ] Act 2 has only 3 events of its own.
- [ ] Act 3's straight road has only 2.
- [ ] More skill-reward events (#134).
- [ ] Region-specific events: only a few are tied to a region (Sinking Sands, Frozen Cache, Bog Witch, Storm Spire).

## Housekeeping

- [ ] **Credits** (art/CREDITS.md) still to confirm:
  - the Lamia's acid effect (`art/fx/lamia-acid.png`): not PVFX Foundry; source and licence
  - the oakhold menu sounds (source and licence)
  - the tagirijus heartbeats (check the pack's licence file)
- [x] `.unit.magma` CSS class is never applied now that monster looks are gone.
- [x] Long one-line CSS rules could be broken onto separate lines (optional; the split into 7 files is done).
