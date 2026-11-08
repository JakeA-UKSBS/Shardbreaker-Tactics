
## The reason to fight

In Shardbreaker you just kill crystallised monsters. *add exposition - a crystal has become sentient from mana and is corrupting the land and creatures.?* 



## Built: the isometric greybox

A first pass to test whether height makes fights more interesting before any art goes in.

- **Isometric board.** Tiles are drawn as diamonds with block sides down to the ground (08-render.js `buildBoard`). The tile art is reused for the top faces, and the sides take its average colour. Walls, boulders and other solid tiles stand a level or two taller (looks only). Tapping picks units first, then the front-most tile face (07-reach-camera.js `pickAt`).
- **Heights.** A map can carry `h` rows, one digit per tile (0 = ground). Maps without them put hills and rubble at height 1. The Cursed Woodland's four maps have hand-made heights, and Act 1 is always the Cursed Woodland for now so every run starts on them (27-run-flow.js).
- **Height rules** (06-rules.js):
  - **Jump:** a unit can only step up or down 2 levels at a time (`JUMP`, or a class's own `jump`). Fliers and 2x2 bosses ignore it.
  - **High ground:** +10 Hit and +1 damage per level above the target (max 3); -10 Hit per level below. The forecast shows it.
  - **Bows:** +1 range for every 2 levels above the target (max +2).
- **On-map attacks** (09-battle-scene.js `quickPlay`): melee hops toward the target, bows and thrown weapons fire an arcing projectile, sigils fly straight and burst in their element's colour, crits flash and shake the map, crystal weapons shatter shards. The battle scene, its backdrops and the battle-frame rig are gone. The Options toggle is now just "Animations" (it still covers the promotion scene).

 
## Classes and abilities (FFTA / Fell Seal style)

Decided:

- **Signature kits.** Each character has their own kit (a passive and 3 abilities) plus 1–2 slots to customise.
- **Costs.** Spells cost MP and physical skills have cooldowns. MP starts full and slowly refills.
- **Forecast.** Skill multipliers (for example 1.5× Mag) are shown in the forecast.
- **Statuses.** Status effects and immunities are kept light.
- **Ability shapes.** Line, pierce, cross, area, cone, arc and burst.

Still to flesh out: the story scenes, and narrowing the longlist into roles that make sense together.

## combat *calc etc 

## Maps

- **Set rooms in rotation** instead of procedural maps. They're hand-made (needed for height to work well), with random elements: enemy placement, hazards and loot.
- **Hazards:** crystal growth, lava, collapsing ledges, gusts that push units etc.
- 


