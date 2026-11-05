# Art (PNGs)

The game loads its fixed art from the PNGs in this folder. Swap a PNG and refresh to see it in the game.

Each PNG's path is its key: `icons/ironJian.png` is the key `icons/ironJian`. `manifest.js` lists the keys that have a PNG. Anything not listed is still drawn by the code.

## Editing a PNG

1. Open it in a pixel editor such as Aseprite, Piskel, LibreSprite or Pixelorama. In Aseprite, just File > Open the PNG; to see an attack play, open each frame as a new frame (`windup`, `swing`, `follow`) in one file, then save each frame back over its own PNG.
2. Keep the **same size** and a **transparent background**, and save as **PNG**. The game scales art up itself and keeps the pixels sharp, so never resize.
3. Save over the file and refresh the game.

You only need to rebuild the manifest when you **add** or **delete** a PNG: `node tools/export-art.mjs --manifest`.

| Folder | What | Size |
|---|---|---|
| `tiles/` | Map tiles. Files ending `-bare` are features drawn over the region's ground (transparent around them); `-used` is a visited village or opened chest | 16×16 |
| `icons/` | Item and weapon icons | 16×16 |
| `relics/`, `meals/`, `woes/`, `tags/`, `nodes/`, `ui/` | Small icons (relics, tavern meals, woes, body-type tags, map rooms, coin/map/mug) | 16×16 |
| `backdrops/` | Fight-scene backdrop per region (horizon at y 63) | 160×90 |
| `scenes/` | Tavern, Crossroads, Ithren's tent, cage bars, the Bog Witch's hut (`witch-hut`, 640×360, used instead of the code-drawn witch scene), the Healing Fountain's courtyard (`fountain`, 576×324), the Caged Traveller's village (`village`, 576×324) | 160×90 (`tavern-counter` is 160×34) |
| `title/` | Title-screen crystal | 120×120 |
| `bosses/` | The Crystal Heart (act 3 boss, 3×3 tiles): idle and `-strike` | 96×96 |
| `cast/<character>/` | The named cast: `<class>-<pose>.png` for their starting class and each ascension. Poses: `idle`, and the attack frames `windup`, `swing`, `follow`, `critup`. Drawn with the character's listed weapon, so weapon upgrades don't change the picture | 64×64 |
| `monsters/` | Every monster, region boss (except the big hand-drawn ones in `bosses/` and the Roc and Bone Wyrm) and summon: `<Class>.png` standing and `<Class>-strike.png` attacking. One fixed look each, so a monster no longer gets random colours | 32×32 |
| `bosses/hollow-bear`, `bosses/krondis` | The Hollow Bear and Krondis (2×2 bosses), facing right; add `<name>-strike` for an attack pose | 128×128 |
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

- **Generated units** (random recruits and sellswords): their looks are random, drawn by the unit rig.
- **The Roc and Bone Wyrm:** 64px boss art drawn in `BIG`.
- **Event scenes:** each one combines the region's background with the event's prop.
