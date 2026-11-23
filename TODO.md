# Shardbreaker Tactics: to-do

A snapshot of what's outstanding, as of 19 November 2026. Tick things off or delete them as they're done.

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
- [ ] Type icons: Infernal, Ooze, Ice, Scaled (16px placeholders)
- [ ] Artifact icons: Duellist's Charm, Wyrmscale, Innkeeper's Token, Crimson Edge (placeholders)
- [ ] Fruit icons: Vigour Apple, Quickberries (placeholders)
- [ ] Flame Sigil and Blizzard Sigil icons (copies of the Fire and Frost Sigil icons)
- [ ] Event scenes still drawn in code: Antiquities Dealer, The Stables, The Orchard, Jungle Maze, Tablet of the Ancients, Relaxing Outcrop
- [ ] Spare frames not used yet: Kaya's 7th (bow drawn again), Celestine's 7th

## Decisions to make

- [ ] **Worms:** the Sand Worm has no type at all, so nothing is effective against it. The Ice Worm is Ice.
- [ ] **Desert, floors 1 to 3:** only Sand Worms spawn there since the Jackal went. It needs a new early monster.
- [ ] **Seren's Spirit Bolt:** keep it or cut it? It's her only damaging ability. It no longer has an element.
- [ ] **Bows vs Beast:** bows and the Hunting Spear both double against beasts. Watch whether bows get too strong.
- [ ] **Thunder Sigil:** now the 8 Mt armoury upgrade; check it feels right next to the Storm Sigil.
- [ ] **Jun's Asura Slash:** currently a dash up to 2 tiles. Should it be a 2-range sword wave that doesn't move him instead?
- [ ] **Iron Bulwark** wording: it counts units with armour bodies (Aldric, Arthur, Celestine); reword to say so?
- [ ] Offered earlier, never confirmed: frog poison; a +5 max HP fish at the Old Fisherman

## Weapons

The big overhaul is planned; until then, these are thin. Starting weapons are excluded from the counts.

| Who | Weapon type | Other weapons they can use |
|---|---|---|
| Lysander | Healing staff | 2: Mending Staff, Far Staff. He starts with no weapon at all |
| Kili, Kaya | Bow | 3: the other bows (Short, Long, Hawkeye, Yew Greatbow) |
| Rook | Dagger | 4: Stiletto, Jade Fangs, Steel Knives, Throwing Knives |
| Rhyn, Jun, Raptor | Sword | 4: Twin Khopesh / Worn Sword, Jade Jian, Gale Sword, Holy Sword |
| Celestine | Sword | 4: Worn Sword, Twin Khopesh, Jade Jian, Gale Sword |
| Zwei | Greatsword | 4: Giantslayer, Claymore, Zweihänder, Flamberge |
| Vaar | Axe | 5: Steel Hatchet, Throwing Axe, Reaver Axe, Tomahawk, War Hammer |
| Aldric, Arthur | Spear | 5: Steel Spear, Atlatl, Javelin, Qiang, Hunting Spear |
| Sigil users | Sigil | 5 to 8, but limited by signature elements (below) |

Gaps by element (signature sigils are locked to one person):

- [ ] **Dark** (Morrigan): only her starting Umbral Sigil; no dark upgrade.
- [ ] **Light** (Maelis): only her starting Dawn Sigil; no light upgrade.
- [ ] **Summoner** (Seren): the Rune Crook is the only attack staff; no upgrade.
- [ ] **Ice** (Corvin): only the Blizzard Sigil.
- [ ] **Fire** (Klaus): only the Flame Sigil.
- [ ] **Healing staves:** only 3 exist in the whole game (Mending, Far, plus Maelis's start).
- [ ] **Bows:** the Short Bow and Longbow are both 2–3 with similar stats; give them distinct roles.
- [ ] **Armoury stock:** 26 items now; you plan to add more.

## Skills

Skill rewards (The Sphinx, Tablet of the Ancients) offer 3 skills from the unit's role list. The short lists are:

| Role | Who | Skills |
|---|---|---|
| Knight | Aldric, Celestine | 3: Steadfast, Iron Skin, Retaliate |
| Summoner | Seren | 3: Kindle, Focus, Quick Study |
| Sigilist | Morrigan, Corvin, Drecken, Klaus | 4: Kindle, Focus, Spell Ward, Quick Study |
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

No regular monster has a passive; only bosses do (Wrath, Steadfast, Focus).

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

- [ ] Wolves / Frost Wolves: Pack Tactics (+Hit next to another wolf)
- [ ] Oozes: split when hit by a sword or lightning (5e-style)
- [ ] Golems: Heavy (can't be pushed)
- [ ] Crystal monsters: Shatter (damage nearby units when they die)
- [ ] Ice Troll: Regenerate switched off by fire

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
  - the newer effect sheets (`heal.png`, `light-burst.png`, `holy-bolt.png`, `lamia-acid.png`): are these PVFX Foundry too?
  - the oakhold menu sounds (source and licence)
  - the tagirijus heartbeats (check the pack's licence file)
- [x] `.unit.magma` CSS class is never applied now that monster looks are gone.
- [x] Long one-line CSS rules could be broken onto separate lines (optional; the split into 7 files is done).
