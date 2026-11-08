// Export the named cast (js/14b-cast.js) as preview PNGs in docs/visuals/cast/:
//   <id>.png / <id>_<ascension>.png   the 64px map sprite at 3x, for the base class and each ascension
//   <id>..._poses.png                  the 96px battle frames: idle, wind-up, strike, follow-through, crit wind-up
//   cast_sheet.png                     every character with their ascensions
// Run: node tools/export-cast.mjs   (needs Node and Playwright, like export-art.mjs)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'visuals', 'cast');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage();
page.on('pageerror', e => console.warn('page error:', e.message));
await page.route('**/music/**', r => r.abort());
await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href);
await page.waitForTimeout(500);

const files = await page.evaluate(async () => {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; };
  const out = {}, S = 3, POSE = ['idle', 'windup', 'swing', 'follow', 'critup'];
  const rows = [];
  for (const c of CAST) {
    // every form: the base class, then each ascension
    const forms = [{ tag: '', n: CLS[c.cls].n, cls: c.cls, wk: c.wk, look: c.look },
      ...Object.entries(c.asc || {}).map(([k, a]) => ({ tag: '_' + a.n.toLowerCase().replace(/ /g, ''), n: a.n, cls: k, wk: a.wk, look: a.look }))];
    const row = [];
    for (const f of forms) {
      const im = await load(hiArt(f.look, f.cls, 'p', f.wk, 'idle', 0, 64));
      row.push([f, im]);
      let [cv, x] = canvas(64 * S, 64 * S); x.drawImage(im, 0, 0, 64 * S, 64 * S); out[c.id + f.tag + '.png'] = cv.toDataURL();
      [cv, x] = canvas(96 * 2 * POSE.length, 96 * 2);
      for (let k = 0; k < POSE.length; k++) x.drawImage(await load(hiArt(f.look, f.cls, 'p', f.wk, POSE[k], 0, 96)), k * 192, 0, 192, 192);
      out[c.id + f.tag + '_poses.png'] = cv.toDataURL();
    }
    rows.push([c, row]);
  }
  // sheet: one row per character, base class first then its ascensions
  const CW = 64 * 4, CH = 64 * 4 + 26, NW = 150, PER = 2, COLS = 2, RW = NW + 3 * CW + 20;
  const [cv, x] = canvas(COLS * RW, Math.ceil(rows.length / PER) * CH);
  x.fillStyle = '#2a2230'; x.fillRect(0, 0, cv.width, cv.height); x.imageSmoothingEnabled = false;
  rows.forEach(([c, row], k) => {
    const X = (k % COLS) * RW, Y = Math.floor(k / COLS) * CH;
    x.fillStyle = '#efe6cf'; x.font = 'bold 22px sans-serif'; x.textAlign = 'left'; x.fillText(c.name, X + 8, Y + CW / 2);
    row.forEach(([f, im], j) => {
      const fx = X + NW + j * CW; x.drawImage(im, fx, Y, CW, CW);
      x.font = (j ? 'bold ' : '') + '17px sans-serif'; x.textAlign = 'center'; x.fillStyle = j ? '#e2b553' : '#c9c3b8';
      x.fillText(f.n, fx + CW / 2, Y + CW + 18);
    });
  });
  out['cast_sheet.png'] = cv.toDataURL();
  return out;
});
for (const [f, url] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), Buffer.from(url.split(',')[1], 'base64'));
console.log(`wrote ${Object.keys(files).length} PNGs to docs/visuals/cast/`);
await browser.close();
