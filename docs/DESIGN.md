# Shardbreaker Tactics — design notes

Where this fork is heading, and why. It started as a straight copy of Shardbreaker (the GBA Fire Emblem-style roguelike). This file holds the ideas. When one is decided, move it to **Decided**. When one is built, say so.

Inspiration to look at: Final Fantasy Tactics Advance, Tactics Ogre, Fell Seal: Arbiter's Mark, Crawl Tactics.

## Decided

- **Separate repo.** Shardbreaker stays as it is, and the big changes are tried here.
- **Fixed roster.** There is a pool of named characters instead of random recruits, so players can have favourites. Some characters only join through events. Jake is still working out the details.
- **Height maps.** Maps use Ogre-style height levels. Height should matter for range, damage or hit, and movement (jump/climb).

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

- Is it still a roguelike run structure, a story campaign, or a hybrid like Crawl Tactics?
- How does height work with the side-on battle animations? Keep them, or switch to on-map attacks like FFTA?
- What do jobs replace? The current tier 1 to tier 2 promotion, the evolve-at-PROMO_LV system, or both?
- With a fixed roster, does permadeath stay?

## Carried over from Shardbreaker

Everything in the copy works as it did at the fork point: body tags and effectiveness, relics, the tavern, events, Ascension and the hi-res unit rigs. docs/VISUALS.md and docs/INFO.md describe that starting point.
