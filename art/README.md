# Art (PNGs)

The game loads its fixed art from the PNGs in this folder. Swap a PNG and refresh to see it in the game.

Each PNG's path is its key: `icons/ironJian.png` is the key `icons/ironJian`. `manifest.js` lists the keys that have a PNG. Anything not listed is still drawn by the code.

## Editing a PNG

1. Open it in a pixel editor such as Piskel, LibreSprite, Pixelorama or Aseprite.
2. Keep the **same size** and a **transparent background**, and save as **PNG**. The game scales art up itself and keeps the pixels sharp, so never resize.
3. Save over the file and refresh the game.

You only need to rebuild the manifest when you **add** or **delete** a PNG: `node tools/export-art.mjs --manifest`.

| Folder | What | Size |
|---|---|---|
| `tiles/` | Map tiles. Files ending `-bare` are features drawn over the region's ground (transparent around them); `-used` is a visited village or opened chest | 16×16 |
| `icons/` | Item and weapon icons | 16×16 |
| `relics/`, `meals/`, `woes/`, `tags/`, `nodes/`, `ui/` | Small icons (relics, tavern meals, woes, body-type tags, map rooms, coin/map/mug) | 16×16 |
| `backdrops/` | Fight-scene backdrop per region (horizon at y 63) | 160×90 |
| `scenes/` | Tavern, Crossroads, Ithren's tent, cage bars | 160×90 (`tavern-counter` is 160×34) |
| `title/` | Title-screen crystal | 120×120 |
| `bosses/` | The Crystal Heart (act 3 boss, 3×3 tiles): idle and `-strike` | 96×96 |
| `ship/` | Flying Ship parts (region is switched off for now) | as exported |

## The code-drawn versions

The drawing code is kept in the game files as the generator and the fallback.

- **See the code-drawn art:** open `index.html?codeart`.
- **Make PNGs for any new art keys:** run `node tools/export-art.mjs`. It never overwrites an existing PNG, so your edits are safe.
- **Redraw something from code on purpose** (overwriting the PNG): `node tools/export-art.mjs --force icons/ironJian`, or a whole folder with `--force tiles/`.
- **List every key:** `--list`.

The tool needs Node and Playwright: `npm i -D playwright && npx playwright install chromium`.

## Not PNGs yet

These are still drawn in code:

- **Units and monsters:** their looks (hair, skin, cloth, gem colours) are randomised per unit.
- **The other bosses.**
- **Event scenes:** each one combines the region's background with the event's prop.
