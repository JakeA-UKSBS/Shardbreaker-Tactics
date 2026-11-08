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
| `relics/`, `meals/`, `tags/`, `nodes/`, `ui/` | Small icons (relics, tavern meals, body-type tags, map rooms, coin/map/mug) | 16×16 |
| `backdrops/` | Fight-scene backdrop per region (horizon at y 63) | 160×90 |
| `scenes/` | Tavern, Crossroads, Ithren's tent, cage bars, the Bog Witch's hut (`witch-hut`, 640×360) | 160×90 (`tavern-counter` is 160×34) |
| `npcs/` | Marla the innkeeper and the chapel healer | 32×32 |
| `title/` | Title-screen crystal | 120×120 |
| `bosses/` | The Crystal Heart (act 3 boss, 3×3 tiles): idle and `-strike` | 96×96 |
| `cast/<character>/` | The named cast: `<class>-<pose>.png` for their starting class and each ascension. Poses: `idle`, and the attack frames `windup`, `swing`, `follow`, `critup`. Drawn with the character's listed weapon, so weapon upgrades don't change the picture | 64×64 |
| `monsters/` | Every monster, region boss (except the big hand-drawn ones in `bosses/`) and summon: `<Class>.png` standing and `<Class>-strike.png` attacking. One fixed look each, so a monster no longer gets random colours | 32×32 |
| `bosses/hollow-bear`, `bosses/krondis`, `bosses/yeti` | The Hollow Bear, Krondis and the Yeti (2×2 bosses), facing right; add `<name>-strike` for an attack pose | 128×128 |
| `bosses/krondis-roll` | Krondis's Death Roll: 8 frames side by side, facing left, his body in the left 128px of each frame | 2400×128 (300×128 a frame) |

## No code-drawn fallback

The game draws nothing in code: if a PNG is missing, the picture is missing. Add or replace the PNG, then rebuild the manifest.

The one exception is the **unit rig** (`js/09b-unit-rig.js`), kept to start a new character's sprites:

1. Add the character (or a new class for one) to `js/14b-cast.js` with a `look`.
2. Run `node tools/export-art.mjs`. It writes `cast/<id>/<class>-<pose>.png` for any frames that don't have a PNG yet (it never overwrites one), and rebuilds the manifest.
3. Paint over those PNGs.

- **Redraw a character from the rig on purpose** (overwriting): `node tools/export-art.mjs --force cast/kili/`.
- **List every cast key:** `--list`.

The tool needs Node and Playwright: `npm i -D playwright && npx playwright install chromium`.

## Still drawn live

- **Event scenes:** each one combines the region's background with the event's prop.
- **Slash trails** on attacks, and the **Unlocks** screen icons.
