/* 3D terrain: standing props (trees, rocks, gems, tombstones...) and height maps for every region */

/* ---- standing props ----
   tile kind -> size of its upright sprite (× a tile). The feature stands on the tile's ground like a unit does,
   instead of being painted flat onto the diamond. Solid ones (boulders, rocks, spires) no longer raise a block. */
const PROPS={forest:1.3,hill:1,village:1,fort:1.1,chest:.75,tent:1.1,cliff:1.1,crag:1.1,boulder:1.15,
  shroom:1.15,tomb:.85,mangrove:1.25,curse:1.15,sandstone:1,agate:1,emerald:1,ruby:1,sapphire:1,malachite:.9,
  'bgem-g':1,'bgem-r':1,'bgem-b':1,'bgem-v':1,spire:1.45};
const PROP_BIO1=['shroom','tomb','mangrove','curse'];
/* the feature alone (transparent round it), and the ground under it */
function propArt(k,used){if(OVER_T.includes(k))return tileArt(k,used,true);if(k==='boulder')return boulderArt();
  return art('tiles/'+k+'-bare',()=>PROP_BIO1.includes(k)?bioTile_draw(k,'f'):bioTile2_draw(k,'f'))}
function propGroundArt(k){return art('tiles/'+k+'-ground',()=>PROP_BIO1.includes(k)?bioTile_draw(k,'g'):bioTile2_draw(k,'g'))}
/* the ground class: the shared features (trees, chests, boulders...) sit on the map's usual ground, region features on their own */
const propGround=(k,gk)=>OVER_T.includes(k)||k==='boulder'||k==='curse'?'t-'+gk:'t-g-'+k;
texStyle.textContent+=Object.keys(PROPS).filter(k=>!OVER_T.includes(k)&&k!=='boulder').map(k=>`.t-g-${k}{background:url(${propGroundArt(k)}) 0 0/100% 100%}`).join('');
/* stand a prop on tile x,y (called by buildBoard). Its base sits a little below the tile's centre */
/* the Sunless Isle's boulders are a mix of rocks, rubble, skulls, dead trees and crystal (art/props/sunless-*, scale × the boulder's size) */
const SUNLESS_ROCKS=[['rock',1],['rocks',1],['rubble',1],['deadtree',1.1],['crystal',1],['skulls',.6]];
/* other regions' boulders: CraftPix rocks (art/props/<name>.png, padded square, scale × the boulder's size). Regions not listed keep the plain boulder */
const REGION_ROCKS={desert:[['sand-rock',1.1]],snow:[['ice-block',.9],['snow-peaks',1.1]],forest:[['moss-rock',1.1]],swamp:[['moss-rock',1.1]],mountain:[['red-spire',1.1]],heart:[['red-spire',1.1]]};
/* tile kinds drawn with CraftPix rocks in every region: the desert's Sandstone Rocks (k) mix the sand rock with the pale stone piles */
/* ROCK_W: widest a single rock prop is drawn, in px (a tile is 68 wide) */
const ROCK_W=54;
const KIND_ROCKS={sandstone:[['sand-rock',1.1],['sunless-rock',.95],['sunless-rocks',.9]],
  /* the Cursed Woodland: Dead Wood (f) is bare dead trees; the Cursed Thicket (y) is a bramble bush or a dark mushroom tree */
  forest:[['wood-deadtree-1',1],['wood-deadtree-2',1],['wood-deadtree-3',.95]],
  curse:[['wood-bush',.8],['wood-shroom-1',.9],['wood-shroom-2',.9],['wood-shroom-3',.9]],
  /* the swamp's Mangrove Roots: rooted swamp trees */
  mangrove:[['swamp-tree-1',1.25],['swamp-tree-2',1.25],['swamp-tree-3',1.3],['swamp-tree-4',1.3]]};
/* decoration on shallow water: reeds and lily pads on some tiles (no effect on play). [art, share of tiles, size × a tile] */
const WATER_DECOR=[['reeds-1',.12,.55],['reeds-2',.12,.65],['reeds-3',.1,.65],['lilypad-1',.1,.4],['lilypad-2',.08,.4]];
function placeDecor(x,y){const h=((Math.imul(x+3,2654435761)^Math.imul(y+7,40503))>>>0)%1000/1000;let acc=0;
  for(const[n,share,sz]of WATER_DECOR){acc+=share;if(h>=acc)continue;if(!ART_PNG.has('props/'+n))return;
    const im=document.createElement('img'),c=scrC(x,y),w=Math.round(T*sz),lily=n.startsWith('lily');im.className='prop';im.alt='';im.dataset.k=key(x,y);im.dataset.p='decor';im.src='art/props/'+n+'.png';
    Object.assign(im.style,{left:c.x-w/2+(lily?((x*5+y*3)%7-3)*2:0)+'px',top:c.y+(lily?w/2:6)-w+'px',width:w+'px',height:w+'px',zIndex:(x+y)*4+2});boardEl.appendChild(im);return}}
/* two boulders side by side are drawn as one big rock across both tiles (REGION_BIG: the wide rock per region) */
const REGION_BIG={desert:'sand-rock',forest:'moss-rock',swamp:'moss-rock'};
let bigRocks=null,bigFor=null;
/* pairs adjacent boulders, scanning row by row: {anchor key: partner [x,y]}, and each partner key -> 'skip' */
function boulderPairs(){if(bigFor===MAP)return bigRocks;bigFor=MAP;bigRocks={};const isB=(x,y)=>MAP[y]&&TER[MAP[y][x]]&&TER[MAP[y][x]].k==='boulder';
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(!isB(x,y)||bigRocks[key(x,y)])continue;
    for(const[px,py]of[[x+1,y],[x,y+1]])if(isB(px,py)&&!bigRocks[key(px,py)]&&hOf(px,py)===hOf(x,y)){bigRocks[key(x,y)]=[px,py];bigRocks[key(px,py)]='skip';break}}
  return bigRocks}
function placeProp(x,y,k){const im=document.createElement('img'),c=scrC(x,y);let w=Math.round(T*PROPS[k]),src=propArt(k,state.visited.includes(key(x,y)));
  if(k==='boulder'&&actBiome().id==='shadow'){const[n,sc]=SUNLESS_ROCKS[(x*7+y*13)%SUNLESS_ROCKS.length];if(ART_PNG.has('props/sunless-'+n)){src='art/props/sunless-'+n+'.png';w=Math.round(w*sc)}}
  else if(k==='boulder'&&REGION_ROCKS[actBiome().id]||KIND_ROCKS[k]){const rs=KIND_ROCKS[k]||REGION_ROCKS[actBiome().id],[n,sc]=rs[(x*7+y*13)%rs.length];if(ART_PNG.has('props/'+n)){src='art/props/'+n+'.png';w=Math.round(w*sc)}}
  let cx=c.x,cy=c.y,z=(x+y)*4+3;
  /* single rocks sit inside their own diamond: no wider than ROCK_W and based nearer the tile's centre, so wide ones don't hang off the map's edge */
  const rock=(k==='boulder'||k==='sandstone')&&src.startsWith('art/props/');let base=8;if(rock){w=Math.min(w,ROCK_W);base=3}
  const big=k==='boulder'&&REGION_BIG[actBiome().id]&&ART_PNG.has('props/'+REGION_BIG[actBiome().id])&&boulderPairs()[key(x,y)];
  if(big==='skip')return;/* drawn by its partner */
  if(big){const c2=scrC(...big);cx=(c.x+c2.x)/2;cy=Math.max(c.y,c2.y);z=(big[0]+big[1])*4+3;src='art/props/'+REGION_BIG[actBiome().id]+'.png';w=Math.round(T*PROPS[k]*1.9);base=8}
  im.className='prop';im.alt='';im.dataset.k=key(x,y);im.dataset.p=k;im.src=src;
  Object.assign(im.style,{left:cx-w/2+'px',top:cy+base-w+'px',width:w+'px',height:w+'px',zIndex:z});boardEl.appendChild(im)}
/* each render: opened chests swap art, and tall props fade when a unit stands just behind them */
function propsRender(){
  const occ=new Set(state.units.filter(u=>u.hp>0).flatMap(u=>cellsOf(u.x,u.y,u.sz||1).map(c=>key(...c))));
  boardEl.querySelectorAll('img.prop').forEach(im=>{const[x,y]=im.dataset.k.split(',').map(Number),k=im.dataset.p;
    if(k==='chest'){const s=propArt(k,state.visited.includes(im.dataset.k));if(im.getAttribute('src')!==s)im.src=s}
    im.classList.toggle('fade',PROPS[k]>=1&&[[x-1,y],[x,y-1],[x-1,y-1]].some(([a,b])=>occ.has(key(a,b))))})}

/* ---- height maps ----
   Every region's battle and boss maps have hand-made height maps (see 16-maps-battles.js; edit them with tools/map-editor.html).
   Any outdoor map without one (the towns) gets one generated from its own layout,
   the same every time (seeded by the map's name):
   - smooth rolling noise, higher toward the top of the map (where the enemies wait), scaled by the region's profile
   - water, lava, the frozen lake and quicksand are the low ground; the starting rows are flat ground
   - no step between walkable tiles is more than 1, so every unit can still go everywhere it could before
   - rocks, walls and other solid tiles sit at the height of the ground around them
   Indoor maps (crypt, chapel, the Labyrinth) and the ship's deck stay flat. */
/* HPROF: height profile per region. a = how tall the hills get (in steps); swamp = flat with only sand and mangrove raised 1 step; dune = rolling dune ridges */
const HPROF={mushroom:{a:2},shadow:{a:2},swamp:{a:1,swamp:1},forest:{a:2},mountain:{a:3},desert:{a:2,dune:1},snow:{a:3},cavern:{a:2},heart:{a:2}};
const FLAT_MAPS=new Set(['crypt','chapel']);
function autoHeights(id,m,P){
  const H=m.map.length,W=m.map[0].length,a=P.a;
  const rnd=(x,y,i)=>{let h=2166136261;for(const c of id+'|'+x+'|'+y+'|'+i)h=Math.imul(h^c.charCodeAt(0),16777619);return((h>>>0)%10007)/10007};
  const sm=t=>t*t*(3-2*t),noise=(x,y,s,i)=>{const gx=x/s,gy=y/s,x0=Math.floor(gx),y0=Math.floor(gy),fx=sm(gx-x0),fy=sm(gy-y0),v=(X,Y)=>rnd(X,Y,i);
    const top=v(x0,y0)+(v(x0+1,y0)-v(x0,y0))*fx,bot=v(x0,y0+1)+(v(x0+1,y0+1)-v(x0,y0+1))*fx;return top+(bot-top)*fy};
  const T=(x,y)=>TER[m.map[y][x]],low=t=>['water','mud','lava','ice','quicksand'].includes(t.k)||P.swamp&&t.k==='shallow',solid=t=>t.c>=99&&!low(t);
  const ph=rnd(0,0,9)*6.28,starts=new Set((m.start||[]).map(([x,y])=>x+','+y));
  const h=[];for(let y=0;y<H;y++){h.push([]);for(let x=0;x<W;x++){const t=T(x,y);let v;
    if(P.swamp)v=['sand','mangrove'].includes(t.k)?1:0;
    else{const n=P.dune?.5+.5*Math.sin(x*.85+y*.45+ph)*(.6+.4*noise(x,y,3,1)):.65*noise(x,y,4,0)+.35*noise(x,y,2,1);
      v=Math.round(n*a*1.15+(1-y/(H-1))*a*.85-.35*a)}
    if(low(t)||y>=H-2||starts.has(x+','+y))v=0;else if(y===H-3)v=Math.min(v,1);
    h[y].push(Math.max(0,Math.min(a+1,v)))}}
  /* no step of more than 1 between walkable tiles (only ever lowers, toward the fixed low ground) */
  const walk=(x,y)=>!solid(T(x,y));
  for(let changed=true;changed;){changed=false;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!walk(x,y))continue;
      for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||!walk(nx,ny))continue;
        if(h[y][x]>h[ny][nx]+1){h[y][x]=h[ny][nx]+1;changed=true}}}}
  /* solid tiles sit on the highest ground next to them */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!walk(x,y)){let best=-1;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&walk(nx,ny))best=Math.max(best,h[ny][nx])}
    if(best>=0)h[y][x]=best}
  return h.map(r=>r.join(''));
}
for(const b in BIOMES){const B=BIOMES[b],P=HPROF[b];if(!P)continue;
  for(const id of[...(B.maps||[]),B.bossMap,'town_'+b]){const m=MAPS[id];if(m&&!m.h&&!FLAT_MAPS.has(id))m.h=autoHeights(id,m,P)}}
