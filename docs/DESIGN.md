# Shardbreaker Tactics — design notes

Where this fork is heading, and why. It started as a straight copy of Shardbreaker (the GBA Fire Emblem-style roguelike). This file holds the ideas. When one is decided, move it to **Decided**. When one is built, say so.

Inspiration to look at: Final Fantasy Tactics Advance, Tactics Ogre, Fell Seal: Arbiter's Mark, Crawl Tactics.

## Decided

- **Separate repo.** Shardbreaker stays as it is, and the big changes are tried here.
- **Fixed roster.** There is a pool of named characters instead of random recruits, so players can have favourites. Some characters only join through events. Jake is still working out the details.
- **Height maps.** Maps use Ogre-style height levels. Height should matter for range, damage or hit, and movement (jump/climb). *Built as a greybox, see below.*
- **Roguelike runs with a named cast.** Runs stay, but the units are named characters rather than random recruits. The story comes out between runs (Hades-style): breaking bigger crystals unlocks scenes and new characters.
- **No side-on battle scenes.** Attacks play on the map, FFTA-style. Side-on scenes fight with height, and every named character would need a second full sprite set. *Built.*

## Built: the isometric greybox

A first pass to test whether height makes fights more interesting before any art goes in.

- **Isometric board.** Tiles are drawn as diamonds with block sides down to the ground (08-render.js `buildBoard`). The tile art is reused for the top faces, and the sides take its average colour. Walls, boulders and other solid tiles stand a level or two taller (looks only). Tapping picks units first, then the front-most tile face (07-reach-camera.js `pickAt`).
- **Heights.** A map can carry `h` rows, one digit per tile (0 = ground). Maps without them put hills and rubble at height 1. The Cursed Woodland's four maps have hand-made heights, and Act 1 is always the Cursed Woodland for now so every run starts on them (27-run-flow.js).
- **Height rules** (06-rules.js):
  - **Jump:** a unit can only step up or down 2 levels at a time (`JUMP`, or a class's own `jump`). Fliers, ghosts and 2x2 bosses ignore it.
  - **High ground:** +10 Hit and +1 damage per level above the target (max 3); -10 Hit per level below. The forecast shows it.
  - **Bows:** +1 range for every 2 levels above the target (max +2).
- **On-map attacks** (09-battle-scene.js `quickPlay`): melee hops toward the target, bows and thrown weapons fire an arcing projectile, sigils fly straight and burst in their element's colour, crits flash and shake the map, crystal weapons shatter shards. The battle scene, its backdrops and the battle-frame rig are gone. The Options toggle is now just "Animations" (it still covers the promotion scene).

## The reason to fight

In Shardbreaker you just kill crystallised monsters. There's no reason to defend places or people. The idea for this fork:

- **Break the gems to stop the spread.** The crystals spread, so the goal is to shatter the gems growing on creatures before they spread further. That could make "break the gem" its own action or objective, separate from killing.
- Things the crystals could corrupt, each giving an objective type:
  - **The land itself.** Tiles slowly turn to crystal. A cleansing NPC has to channel at a shrine for N turns while you protect them.
  - **People.** Infected villagers turn into crystal zombies if you don't reach them in time. That's a rescue objective.
  - **Creatures.** Crystals zombify animals and monsters. Breaking the gem might free some instead of killing them.
- Objective mix to aim for: rout, break the gems (all or N), defend or escort a cleanser, rescue, survive N turns, and reach the exit.

## Classes and abilities (FFTA / Fell Seal style)

- Jobs instead of fixed classes. Each unit has a main job plus a secondary job's ability set.
- Abilities are learned through jobs (JP-style) or through weapons (FFTA-style). The skill-capacity pie from Shardbreaker could become the passive/reaction budget.
- Give the named NPCs and characters fun signature abilities.

## Maps

- **Set rooms in rotation** instead of procedural maps. They're hand-made (needed for height to work well), with random elements: enemy placement, hazards and loot.
- **Hazards:** crystal growth, lava, collapsing ledges, gusts that push units, and so on.
- **Chests:** walking away from fights to open chests felt odd in Shardbreaker. Possible fixes: put loot in the reward screen, or tie chests to the objective (a chest sits next to a crystal node, and cleansing it opens the chest).

## Open questions

- What do jobs replace? The current tier 1 to tier 2 promotion, the evolve-at-PROMO_LV system, or both?
- With a fixed roster, does permadeath stay? One option: a fallen character is out for the rest of the run but back for the next one.
- Sprites need two facings (front-diagonal and back-diagonal, mirrored) to read properly in isometric. Units still use the front-facing map sprites.

## Carried over from Shardbreaker

Everything in the copy works as it did at the fork point: body tags and effectiveness, relics, the tavern, events, Ascension and the hi-res unit sprites. docs/VISUALS.md and docs/INFO.md describe that starting point.
