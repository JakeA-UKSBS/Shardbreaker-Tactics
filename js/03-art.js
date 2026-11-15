/* Art: PNG paths for every fixed picture (art(), sprites, portraits, icons, tiles), plus the Px canvas helper and palette
   that the unit rig (09b) and the few things still drawn live (event scenes, slash trails, unlock icons) use */
/* ================= ART ================= */
/* shared palette: OUT = sprite outline, SKIN/SKIN2 = default skin and its shadow, METAL/METAL2 = steel and its shadow, BROWN/BROWN2 = wood/leather,
   GOLD, CREAM, JADE, RED, INK = near-black for eyes and details */
const OUT='#1a1420',SKIN='#f3cfa6',SKIN2='#d6a07a',METAL='#c3cad6',METAL2='#7f889b',BROWN='#7a5230',BROWN2='#4f331d',GOLD='#e2b553',CREAM='#efe6cf',JADE='#5fc2a0',RED='#c8322e',INK='#2a2230';
/* TEAMC: team colours. p = player (blue), e = enemy (purple), g = guest/ally (green); a = main, A = shadow, s = trim */
const TEAMC={p:{a:'#3a7cc0',A:'#22507f',s:'#ece6d4'},e:{a:'#4a3d66',A:'#2a2140',s:'#1c1826'},g:{a:'#3f8f5a',A:'#25603a',s:'#e6efd8'}};
/* ELC: glow colour per magic element */
const ELC={dark:'#9a6ad8',nature:'#7fd36a',light:'#fff2b0',fire:'#ff8a3c',water:'#4fb2ff',ice:'#bfefff',wind:'#7fe0a8',earth:'#c9a060',lightning:'#ffe14a',illusion:'#c58aff',spirit:'#bff5e0',crystal:'#ff5a6a'};
function shade(h,f){const n=parseInt(h.slice(1),16);const c=[n>>16,(n>>8)&255,n&255].map(v=>clamp(Math.round(v*f),0,255));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')}
let pxHook=null,pxScale=1,pxMini=false;
function Px(w,h){const g=new Array(w*h).fill(null);const P={w,h,g,
  set(x,y,c){x=Math.floor(x);y=Math.floor(y);if(x>=0&&y>=0&&x<w&&y<h)g[y*w+x]=c},
  rect(x,y,ww,hh,c){for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)P.set(x+i,y+j,c)},
  ell(cx,cy,rx,ry,c,f){for(let y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx);x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1&&(!f||f(x,y)))P.set(x,y,c)}},
  ring(cx,cy,r,c){for(let a=0;a<64;a++)P.set(cx+r*Math.cos(a/64*6.283),cy+r*Math.sin(a/64*6.283),c)},
  line(x0,y0,x1,y1,c,t=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;for(let a=0;a<t;a++)for(let b=0;b<t;b++)P.set(Math.round(x)+a,Math.round(y)+b,c)}},
  poly(pts,c){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;pts.forEach(([x,y])=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)});
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){const px=x+.5,py=y+.5;let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))ins=!ins}if(ins)P.set(x,y,c)}},
  outline(c){const o=g.slice();for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(o[y*w+x])continue;for(const[dx,dy]of DIRS){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&o[ny*w+nx]&&o[ny*w+nx]!==c){g[y*w+x]=c;break}}}},
  url(){if(pxMini&&w===32&&h===32){pxMini=false;const o=g.slice();g.fill(null);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const sx=Math.floor(16+(x-16)/.7),sy=Math.floor(31-(31-y)/.7);if(sx>=0&&sx<32&&sy>=0&&sy<32&&o[sy*32+sx])g[y*32+x]=o[sy*32+sx]}}if(pxHook&&w===32&&h===32){const f=pxHook;pxHook=null;f(P)}const k=w===32&&h===32?pxScale:1;pxScale=1;const cv=document.createElement('canvas');cv.width=w*k;cv.height=h*k;const cx=cv.getContext('2d');for(let i=0;i<g.length;i++)if(g[i]){cx.fillStyle=g[i];cx.fillRect((i%w)*k,((i/w)|0)*k,k,k)}return cv.toDataURL()}
};return P}
function wcol(w){const t=w&&w.tint;return{blade:t==='steel'?'#b3d0f0':t==='jade'?'#5fd3a0':t==='holy'?'#fff2c0':METAL,edge:t==='holy'?'#ffffff':'#f4f7fb',hilt:t==='killer'?RED:GOLD,el:w&&w.el?ELC[w.el]:ELC.spirit}}
const sprCache={};
/* ---- PNG art ----
   All fixed art loads from art/<key>.png (art/manifest.js lists the keys that have one). Nothing is drawn in code as a fallback.
   The unit rig (09b) is kept only to make PNGs for new cast members: tools/export-art.mjs registers them in ART_GEN. */
const ART_PNG=new Set(typeof ART_FILES!=='undefined'?ART_FILES:[]);
const ART_GEN={};/* cast key -> its rig drawing, for tools/export-art.mjs (see castArt in 14b-cast.js) */
function art(key){return'art/'+key+'.png'}
/* monsters: art/monsters/<Class>.png (and <Class>-strike.png for the attack pose); bosses drawn big (2×2, 3×3) use art/bosses/<name>.png,
   keyed by class or body. Drawn facing right; enemies are flipped to face left in game. */
const BOSS_PNG={bear:'hollow-bear',gator:'krondis',Yeti:'yeti',crystal:'crystal-heart'};
/* Rhi draws boss art facing LEFT (the way enemies face), so everything in art/bosses/ is shown as drawn;
   monster art is still drawn facing right. Add a path to ART_LEFT if a non-boss piece is ever drawn facing left. */
const ART_LEFT=new Set([]);
function artLeft(src){src=String(src);const o=sheetOf(src);if(o)return!!o.s.left;return src.startsWith('art/bosses/')||ART_LEFT.has(String(src).replace(/^art\/|(-strike)?\.png$/g,''))}
/* animated monsters: art/monsters/<Class>-sheet.png, n frames of fw x fh side by side, kept exactly as drawn.
   No slicing or waiting: the sheet is a CSS background on the sprite, positioned on one frame (cropped to x0..x0+w, centred
   on the body), and flipped by the artl class if drawn facing left (left:true). It loads like any other PNG, works opened
   straight from disk, and needs no plain <Class>.png: when a hand-drawn sheet arrives, delete the old PNGs and their manifest
   lines. Frame 0 is idle; an attack plays windup -> swing (the hit) -> follow (any left out stay on the idle frame).
   abil: {abilityId: [frames]} plays those frames when the monster uses that ability. Shown 48px tall (the width follows). */
const MON_SHEET={HellHound:{n:6,fw:120,fh:64,x0:20,w:100,left:true,windup:[1,2],swing:3,follow:[4,5]},
  Wolf:{n:5,fw:100,fh:64,x0:0,w:100,left:true,windup:[1,2],swing:3,follow:[4]},
  FrostWolf:{n:4,fw:100,fh:64,x0:0,w:92,left:true,abil:{howl:[1,2,3]}}};
const BLANK='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
/* sprite()/portrait() hand back 'sheet:<Class>:<frame>' for these; sheetOf reads it back */
const sheetOf=src=>{const m=/^sheet:(\w+):(\d+)$/.exec(src||'');return m&&MON_SHEET[m[1]]?{cls:m[1],i:+m[2],s:MON_SHEET[m[1]]}:null};
/* background properties for frame src drawn h px tall, centred in a box bw px wide (bw omitted: the frame's own width) */
function sheetBg(src,h,bw){const o=sheetOf(src),s=o.s,k=h/s.fh,w=s.w*k,dx=bw==null?0:(bw-w)/2;
  return{'background-image':`url(art/monsters/${o.cls}-sheet.png)`,'background-repeat':'no-repeat','background-size':`${s.n*s.fw*k}px ${h}px`,'background-position':`${(-(o.i*s.fw+s.x0)*k+dx).toFixed(2)}px 0`}}
const SHEET_PROPS=['background-image','background-repeat','background-size','background-position'];
/* put src on a map sprite img: a sheet frame (sized 48px tall, centred on the tile) or, for anything else, clear that styling.
   Returns true if it was a sheet frame (the caller then leaves img.src alone) */
function sheetFit(img,src){const o=sheetOf(src);
  if(o){if(img.getAttribute('src')!==BLANK)img.src=BLANK;img.dataset.s=src;const w=o.s.w*48/o.s.fh,bg=sheetBg(src,48);for(const k in bg)img.style.setProperty(k,bg[k]);
    img.style.setProperty('width',w+'px','important');img.style.marginLeft=(48-w)/2+'px';img.style.maxWidth='none';img.style.transformOrigin='50% 50%';img.classList.toggle('artl',!!o.s.left);return true}
  if(img.style.backgroundImage){SHEET_PROPS.forEach(k=>img.style.removeProperty(k));img.style.removeProperty('width');img.style.marginLeft='';img.style.maxWidth=''}return false}
/* an <img>'s attributes for a portrait box h px square: a plain src, or a blank src with the sheet frame as its background */
function picAttrs(src,h){if(!sheetOf(src))return`src="${src}"`;const o=sheetOf(src),bg=sheetBg(src,h,h);
  return`src="${BLANK}" style="${Object.entries(bg).map(([k,v])=>k+':'+v).join(';')}${o.s.left?';transform:scaleX(-1)':''}"`}
function monPng(cls,pose,sz){const b=sz>=2&&(BOSS_PNG[cls]||BOSS_PNG[CLS[cls].body]),k=b?'bosses/'+b:'monsters/'+cls;
  if(!b&&MON_SHEET[cls])return`sheet:${cls}:${pose==='strike'?MON_SHEET[cls].swing:0}`;
  return'art/'+k+(pose==='strike'&&ART_PNG.has(k+'-strike')?'-strike':'')+'.png'}
function mapWk(u){const i=u.items.findIndex(it=>WTYPES.includes(IT[it.k].t)||IT[it.k].t==='spirit');return i>=0?u.items[i].k:null}
function sprite(u,pose){return u.cast?castPng(u,pose==='strike'?'swing':'idle'):monPng(u.cls,pose,u.sz)}
/* cast members use their idle PNG (hand-drawn, like Vaar, or exported from the rig) so portraits match the map sprite */
function portrait(u){if(u.pic&&PICS[u.pic])return PICS[u.pic];return u.cast?castPng(u,'idle'):monPng(u.cls,'idle',u.sz)}
const icon=k=>iconArt(k);

/* ==================================================================
   BASE TERRAIN TILES (16px)
   ================================================================== */
const OVER_T=['forest','hill','cliff','crag'];
const texStyle=document.createElement('style');
texStyle.textContent=`.t-plain{background:url(${tileArt('plain')}) 0 0/100% 100%}.t-forest{background:url(${tileArt('forest')}) 0 0/100% 100%}.t-hill{background:url(${tileArt('hill')}) 0 0/100% 100%}`;
/* features drawn over the region's own ground (see buildBoard) */
texStyle.textContent+=OVER_T.map(k=>`.tile.ov-${k}::before{inset:0;background:url(${tileArt(k,0,true)}) 0 0/100% 100%}`).join('');
texStyle.textContent+=`.t-cliff{background:url(${tileArt('cliff')}) 0 0/100% 100%}`;
document.body.appendChild(texStyle);

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function iconArt(k){return art('icons/'+String(k).split('~')[0])}
function tagArt(t){return art('tags/'+t)}
/* bare=true: only the feature (no grass), so it can sit on any region's ground */
function tileArt(kind,used,bare){return art('tiles/'+kind+(used?'-used':'')+(bare?'-bare':''))}
