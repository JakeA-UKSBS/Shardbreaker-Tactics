/* Px canvas helper, unit/monster bodies (fig), 64px boss art, weapon icons, tiles */
/* ================= PIXEL ART ================= */
const OUT='#1a1420',SKIN='#f3cfa6',SKIN2='#d6a07a',METAL='#c3cad6',METAL2='#7f889b',BROWN='#7a5230',BROWN2='#4f331d',GOLD='#e2b553',CREAM='#efe6cf',JADE='#5fc2a0',RED='#c8322e',INK='#2a2230';
const TEAMC={p:{a:'#3a7cc0',A:'#22507f',s:'#ece6d4'},e:{a:'#4a3d66',A:'#2a2140',s:'#1c1826'},g:{a:'#3f8f5a',A:'#25603a',s:'#e6efd8'}};
const ELC={dark:'#9a6ad8',nature:'#7fd36a',light:'#fff2b0',fire:'#ff8a3c',water:'#4fb2ff',wind:'#7fe0a8',earth:'#c9a060',lightning:'#ffe14a',illusion:'#c58aff',spirit:'#bff5e0'};
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
/* ==================================================================
   32px WEAPONS: drawn in the hand of the small sprites (idle / strike)
   ================================================================== */
function drawWeapon(p,w,ax,ay,strike,back){
  if(!w)return;const c=wcol(w),k=w.kind;
  if(back){p.line(ax,ay,ax-5,ay+8,c.blade);p.line(ax-1,ay-1,ax+1,ay+1,GOLD);return}
  if(k==='greatsword'){if(strike){p.line(ax+1,ay-1,ax+8,ay+12,c.blade,3);p.line(ax-2,ay-1,ax+3,ay-3,c.hilt,2)}else{p.line(ax+1,ay-1,ax+8,ay-17,c.blade,3);p.line(ax+3,ay-2,ax+9,ay-17,c.edge);p.line(ax-2,ay-1,ax+4,ay+1,c.hilt,2);p.set(ax-1,ay+3,RED);p.set(ax-2,ay+4,RED)}}
  if(k==='sword'||k==='twin'||k==='rapier'){
    const thin=k==='rapier';
    if(strike){p.line(ax+1,ay,ax+6,ay+11,c.blade,thin?1:2);p.line(ax-1,ay-2,ax+3,ay+2,c.hilt);p.set(ax-2,ay-3,RED)}
    else{const len=thin?16:14;p.line(ax+1,ay-1,ax+1+len*.42,ay-1-len,c.blade,thin?1:2);if(!thin)p.line(ax+2,ay-2,ax+1+len*.42,ay-1-len,c.edge);
      if(thin)p.ring(ax+1,ay-1,1.6,c.hilt);else p.line(ax-1,ay-2,ax+3,ay+1,c.hilt);p.set(ax-1,ay+2,RED);p.set(ax-2,ay+3,RED);p.set(ax-1,ay+4,RED)}
  }
  if(k==='orb'){const o='#9a6ad8';p.ell(ax+3,ay-3,3.6,3.6,o);p.ell(ax+3.5,ay-3.5,2.4,2.4,'#c9a8ff');p.set(ax+2,ay-5,'#ffffff');p.set(ax+3,ay-5,'#f0e6ff');p.set(ax+5,ay-1,shade(o,.7));p.rect(ax,ay+1,7,1,GOLD);p.rect(ax+1,ay+2,5,1,shade(GOLD,.7))}
  if(k==='dagger'||k==='twindagger'){const thin=w.thin;
    if(strike){p.line(ax+1,ay,ax+8,ay-1,c.blade,thin?1:2);if(!thin)p.line(ax+2,ay-1,ax+8,ay-2,c.edge);p.line(ax,ay-2,ax,ay+2,c.hilt);p.set(ax-1,ay,RED)}
    else{p.line(ax+1,ay+1,ax+3,ay+8,c.blade,thin?1:2);if(!thin)p.line(ax+2,ay+1,ax+4,ay+8,c.edge);p.line(ax-1,ay,ax+3,ay,c.hilt);p.set(ax+1,ay-2,RED);p.set(ax+1,ay-1,shade(c.hilt,.7))}
  }
  if(k==='scimitar'){
    const pts=strike?[[ax,ay],[ax+4,ay+3],[ax+6,ay+7],[ax+5,ay+11]]:[[ax+1,ay-1],[ax+4,ay-6],[ax+5,ay-11],[ax+3,ay-15]];
    for(let i=0;i<3;i++)p.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],c.blade,2);
    p.line(pts[1][0]+1,pts[1][1],pts[2][0]+1,pts[2][1],c.edge);p.rect(ax-1,ay,2,2,c.hilt);
  }
  if(k==='spear'||k==='javelin'||k==='halberd'){
    const s=k==='javelin'?.72:1;
    if(strike){p.line(ax-12*s,ay+1,ax+5,ay-1,BROWN);p.poly([[ax+4,ay-3],[ax+8,ay-1],[ax+4,ay+1]],c.blade);
      if(k==='halberd')p.poly([[ax+1,ay-1],[ax+3,ay-7],[ax+6,ay-6],[ax+4,ay-1]],c.blade);else p.ell(ax+3,ay+1.5,1.6,1.2,RED)}
    else{const tx=ax+6*s,ty=ay-16*s;p.line(ax-4,ay+9,tx,ty,BROWN);p.poly([[tx-1,ty+1],[tx+2,ty-5],[tx+2,ty+1]],c.blade);
      if(k==='halberd')p.poly([[tx,ty+2],[tx+6,ty],[tx+6,ty+6],[tx+1,ty+4]],c.blade);else p.ell(tx,ty+3,1.5,1.5,RED)}
  }
  if(k==='hammer'){
    if(strike){p.line(ax-1,ay-1,ax+5,ay+7,BROWN,2);p.rect(ax+4,ay+5,6,5,c.blade);p.rect(ax+4,ay+5,6,1,c.edge)}
    else{p.line(ax+1,ay+3,ax+3,ay-13,BROWN,2);p.rect(ax,ay-19,8,6,c.blade);p.rect(ax,ay-19,8,1,c.edge);p.rect(ax+7,ay-18,1,4,shade(c.blade,.7))}
  }
  if(k==='axe'){
    if(strike){p.line(ax-1,ay-1,ax+4,ay+7,BROWN,2);p.poly([[ax+3,ay+4],[ax+8,ay+1],[ax+8,ay+12],[ax+3,ay+10]],c.blade);p.line(ax+8,ay+2,ax+8,ay+11,c.edge)}
    else{p.line(ax+1,ay+3,ax+3,ay-14,BROWN,2);p.poly([[ax+3,ay-16],[ax+9,ay-19],[ax+9,ay-8],[ax+3,ay-10]],c.blade);p.line(ax+9,ay-18,ax+9,ay-9,c.edge)}
  }
  if(k==='bow'){for(let y=ay-12;y<=ay+6;y++)p.set(ax+3+Math.round(3*Math.sin(Math.PI*(y-ay+12)/18)),y,BROWN);p.set(ax+3,ay-12,GOLD);p.set(ax+3,ay+6,GOLD);p.line(ax+3,ay-12,ax+3,ay+6,CREAM);if(strike)p.line(ax-4,ay-3,ax+8,ay-3,'#e8dfc6')}
  if(k==='crossbow'){p.rect(ax-4,ay-1,10,2,BROWN);p.rect(ax-1,ay+1,2,3,BROWN2);p.line(ax+5,ay-5,ax+6,ay-1,METAL2);p.line(ax+6,ay,ax+5,ay+4,METAL2);p.set(ax+4,ay-6,METAL);p.set(ax+4,ay+5,METAL);
    p.line(ax+4,ay-5,ax+1,ay-1,'#f3ecd8');p.line(ax+1,ay,ax+4,ay+4,'#f3ecd8');if(strike)p.line(ax+6,ay-1,ax+11,ay-1,CREAM);else{p.line(ax+1,ay-2,ax+8,ay-2,'#c9b98f');p.set(ax+8,ay-2,METAL)}}
  if(k==='whip'){const col='#9a3a72';if(strike){for(let i=0;i<=12;i++)p.set(ax+i*.7,ay-i*.8+Math.sin(i*.9)*1.6,col)}else{p.ring(ax+1,ay+3,2.6,col);p.ring(ax+1,ay+3,1.4,col)}p.rect(ax-1,ay-1,2,2,BROWN2)}
  if(k==='chain'){if(strike){for(let i=0;i<9;i+=1.5)p.set(ax+i,ay-i*.9,METAL2);p.poly([[ax+8,ay-9],[ax+12,ay-12],[ax+10,ay-7]],c.blade)}else{for(let i=0;i<8;i+=1.5)p.set(ax+1,ay+i,METAL2);p.poly([[ax,ay+8],[ax+4,ay+11],[ax,ay+11]],c.blade)}p.poly([[ax-1,ay-4],[ax+3,ay-6],[ax+1,ay-1]],c.blade)}
  if(k==='fan'){if(strike){p.poly([[ax,ay],[ax+5,ay-9],[ax+10,ay-5],[ax+10,ay+2]],CREAM);for(let i=0;i<4;i++)p.line(ax,ay,ax+5+i*1.7,ay-9+i*3,INK);p.line(ax+5,ay-9,ax+10,ay+2,RED)}else{p.line(ax,ay+1,ax+3,ay-6,INK,2);p.set(ax+3,ay-7,RED)}}
  if(k==='umbrella'){const pk='#e58fb0';if(strike){p.line(ax,ay,ax+4,ay-8,BROWN);p.ell(ax+4,ay-9,7,4,pk,(x,y)=>y<=ay-9);p.line(ax-3,ay-9,ax+11,ay-9,shade(pk,.7))}else{p.line(ax-3,ay+8,ax+3,ay-14,pk,2);p.rect(ax-4,ay+8,2,2,BROWN)}}
  if(k==='talisman'){p.rect(ax-1,ay-5,3,6,'#f1d97a');p.set(ax,ay-4,RED);p.set(ax,ay-2,RED);
    if(strike){p.ell(ax+6,ay-3,3,3,c.el);p.ell(ax+6,ay-3,1.3,1.3,'#ffffff')}else p.ell(ax+3,ay-7,1.6,1.6,c.el)}
  if(k==='staff'){const o='#c58aff';if(strike){p.line(ax-3,ay-2,ax+6,ay+4,BROWN,2);p.ell(ax+7,ay+5,2.2,2.2,o);p.set(ax+7,ay+4,'#ffffff')}else{p.line(ax-3,ay+9,ax+3,ay-15,BROWN,2);p.ell(ax+3,ay-16,2.2,2.2,o);p.set(ax+3,ay-17,'#ffffff')}}
  if(k==='spirit'){p.ell(ax+2,ay-3,2.4,2.4,w.tint==='mend'?'#7ad6ff':JADE);p.set(ax+1,ay-4,'#ffffff');if(strike){p.set(ax+6,ay-8,'#e9fff5');p.set(ax-1,ay-9,'#e9fff5');p.set(ax+7,ay-2,'#e9fff5')}}
}
function hairFront(p,L,hair,hair2,TC,cloth){
  const s=L.style,g=L.gear,cov=g==='helm'||g==='douli'||g==='hood'||g==='veil'||g==='cap';
  if(!cov&&s!=='bald'){p.ell(15.5,7.6,5.6,4,hair,(x,y)=>y<=8);p.rect(10,8,3,5,hair);p.set(17,8,hair);p.set(19,8,hair)}
  if(s==='bald')p.set(14,6,'#fff3e0');
  if(!cov){
    if(s==='topknot'){p.ell(15,3,2.3,2.1,hair);p.rect(14,4,3,1,GOLD)}
    if(s==='long'){p.ell(13,3.6,2.1,1.8,hair);p.rect(19,9,1,5,hair)}
    if(s==='bun'){p.ell(11.5,4,2.2,2,hair);p.ell(19.5,4,2.2,2,hair)}
    if(s==='tail')p.ell(12,4,2,2,hair);
    if(s==='wild'){p.poly([[11,5],[8,1],[14,4]],hair);p.poly([[14,4],[16,0],[18,4]],hair);p.rect(19,8,2,3,hair)}
  }
  if(g==='guan'){p.rect(13,1,5,3,GOLD);p.rect(14,0,3,1,GOLD);p.line(10,3,21,2,JADE)}
  if(g==='hairpin'){p.line(10,3,17,1,GOLD);p.set(17,1,RED);p.set(9,4,RED)}
  if(g==='ribbon'){p.line(11,5,6,11,TC.a);p.line(11,6,7,13,TC.a)}
  if(g==='headband'){p.rect(10,6,11,1,TC.a);p.line(10,7,7,11,TC.a)}
  if(g==='helm'){const H1='#c9d2e0',H2='#9aa3b5',H3='#6a7385';p.poly([[10,8],[13,8],[13,13],[10,12]],H3);p.ell(15.5,7.6,5.8,4.8,H2,(x,y)=>y<=8);p.ell(16.5,6.6,4,3.2,H1,(x,y)=>y<=8);p.line(14,3,18,3,'#eef2f8');
    p.rect(10,8,12,1,H3);p.set(12,8,GOLD);p.set(19,8,GOLD);p.rect(16,9,1,2,H3);p.poly([[12,3],[16,1],[20,2],[16,3]],TC.A);p.set(16,1,shade(TC.A,1.4))}
  if(g==='douli'){p.poly([[5,9],[26,9],[15.5,1]],'#c9a46a');p.line(9,8,15.5,2,'#a8844c');p.line(22,8,15.5,2,'#a8844c');p.rect(8,9,15,1,'#8a6a3c')}
  if(g==='hood'||g==='veil'){const hc=g==='veil'?'#3a2a4a':cloth;p.ell(15.5,7,6.6,4,hc,(x,y)=>y<=7);p.rect(10,7,3,8,hc)}
  if(g==='cap'){const cc=shade(cloth,.8);p.ell(15.5,6.5,5.8,3.2,cc,(x,y)=>y<=7);p.rect(8,7,15,2,shade(cc,.8));p.rect(10,9,2,3,hair);p.line(18,4,24,0,CREAM);p.line(19,4,25,1,'#d8d0bc');p.set(24,0,RED)}
  if(g==='circlet'){p.rect(10,6,12,1,GOLD);p.set(15,5,GOLD);p.set(16,5,GOLD);p.set(15,6,'#9fd8ff');p.set(16,6,'#9fd8ff')}
  if(L.beard){p.rect(16,14,3,3,hair);p.rect(17,12,3,1,hair)}
}
function horseUnder(p,L,TC,cloth,strike,bare){
  /* a horse, pegasus (L.mount='pegasus') or wyvern under the rider; the rider's legs are dropped and the rest lifted 3px */
  const q=Px(32,32),hc=L.horse||'#7a5230',hc2=shade(hc,.72),hi=shade(hc,1.18),rear=strike?-2:0,wy=L.mount==='wyvern',peg=L.mount==='pegasus',mane=peg?'#e8e2d0':shade(hc,.45);
  if(wy||peg){const up=strike?-2:0,wc=wy?shade(hc,.85):'#ffffff',wc2=wy?shade(hc,.6):'#b9c4d6';
    if(wy){q.poly([[11,19],[1,3+up],[5,7+up],[8,3+up],[11,9+up],[15,6+up],[18,19]],wc);q.line(11,19,1,3+up,wc2);q.line(12,18,8,3+up,wc2);q.line(14,18,15,6+up,wc2)}
    else{q.poly([[12,19],[0,7+up],[4,7+up],[2,10+up],[7,8+up],[5,12+up],[10,10+up],[10,13+up],[17,18]],wc);q.line(12,18,1,8+up,wc2);q.line(13,17,6,9+up,wc2);q.line(14,17,10,11+up,wc2)}}
  if(wy)q.poly([[7,20],[0,25],[0,27],[9,23]],hc2);else q.poly([[5,19],[1,22],[1,27],[3,27],[7,22]],mane);
  q.rect(7,25,2,6,hc2);q.rect(20,25+rear,2,6,hc2);
  q.ell(15,22,10,4.4,hc);q.line(8,19,20,18,hi);if(wy)for(let x=10;x<20;x+=3)q.set(x,25,hc2);
  q.rect(10,25,2,6,hc);q.rect(23,25+rear,2,6,hc);
  [[6,30],[9,30],[19,30+rear],[22,30+rear]].forEach(([x,y])=>q.rect(x,y,3,1,wy?shade(hc,.5):INK));
  q.poly([[20,21],[23,12+rear],[27,11+rear],[27,21]],hc);
  if(wy){q.poly([[25,10+rear],[31,12+rear],[31,15+rear],[26,16+rear]],hc);q.line(24,10+rear,22,6+rear,'#e8e2d0');q.line(26,10+rear,25,5+rear,'#e8e2d0');
    q.set(28,11+rear,'#ffd23f');q.set(31,13+rear,INK);for(let y=13;y<20;y+=2)q.set(21+(20-y)/4,y+rear/2,hc2)}
  else{q.poly([[25,11+rear],[31,14+rear],[31,17+rear],[27,17+rear]],hc);q.line(22,12+rear,20,20,mane,2);q.poly([[24,11+rear],[25,7+rear],[27,11+rear]],hc2);q.set(27,13+rear,INK);q.set(30,15+rear,INK);q.line(26,16+rear,22,19,BROWN2)}
  if(!bare){q.poly([[10,18],[20,18],[19,25],[11,25]],TC.a);q.rect(10,18,10,1,GOLD);q.rect(11,24,8,1,shade(TC.a,.7))}
  for(let y=0;y<32;y++)for(let x=0;x<32;x++){const c=p.g[y*32+x];if(!c||(y>=24&&x>=8&&x<=23))continue;if(y-3>=0)q.set(x,y-3,c)}
  if(!bare){q.rect(14,19,3,5,shade(cloth,.7));q.rect(14,24,4,2,INK)}
  q.outline(OUT);return q.url();
}
const sprCache={};
/* ---- PNG art ----
   Fixed art (tiles, item icons, relics, meals, woes, map nodes, scenes, battle backdrops, the title crystal) loads from
   art/<key>.png when art/manifest.js lists it. The drawing code stays as the generator: tools/export-art.mjs runs it
   to make the PNGs (it never overwrites an existing one unless told to), and it's the fallback for any key without a PNG.
   Units and monsters are still drawn in code. Add ?codeart to the page URL to see the code-drawn versions. */
const ART_PNG=new Set(typeof ART_FILES!=='undefined'&&!/[?&]codeart\b/.test(location.search)?ART_FILES:[]);
const ART_GEN={};/* key -> its drawing function, so tools/export-art.mjs can find every key */
function art(key,draw){ART_GEN[key]=draw;if(ART_PNG.has(key))return'art/'+key+'.png';const c='ART|'+key;return sprCache[c]||(sprCache[c]=draw())}
/* crystallised creatures: every enemy grows gem shards along the top of its silhouette, plus a facet in its body */
const CRYS=['#b07ae8','#5fd3e8','#e86a9a','#6ae8a0','#e8c85a'];
/* hand-placed crystals (32px coords): {core:[x,y]} = a facet set into the body, {gem:[x,y,h]} = a small shard */
function crysAt(P,list){for(const c of list){const col=c.col||'#b07ae8',hi=shade(col,1.5),lo=shade(col,.62);
  if(c.core){const[x,y]=c.core;P.set(x,y-1,col);P.set(x-1,y,col);P.set(x,y,hi);P.set(x+1,y,lo);P.set(x,y+1,lo);P.set(x-1,y-1,OUT);P.set(x+1,y-1,OUT);P.set(x-1,y+1,OUT);P.set(x+1,y+1,OUT)}
  if(c.dot){const[x,y]=c.dot;P.set(x,y,col);P.set(x+1,y,lo);P.set(x,y-1,hi)}
  if(c.gem){const[x,y,h]=c.gem;P.poly([[x-2,y+1],[x,y-h-1],[x+2,y+1]],OUT);P.poly([[x-1,y],[x,y-h],[x+1,y]],col);P.line(x,y-h+1,x,y,hi)}}}
function crystallise(P,cls,big,small,sc){if(small){const W=32,g=P.g;let h=0;for(const ch of cls)h=(h*31+ch.charCodeAt(0))>>>0;const col=sc||CRYS[h%CRYS.length];
    const top=[];for(let x=0;x<W;x++){top[x]=-1;for(let y=0;y<W;y++)if(g[y*W+x]){top[x]=y;break}}const xs=top.map((y,x)=>y>=0?x:-1).filter(x=>x>=0),a=xs[0],b=xs.at(-1);
    /* small scale-like gems along the middle of the back */
    for(let i=0;i<5;i++){const x=Math.round(a+(b-a)*(.35+i*.08)),y=top[x];if(y<1)continue;P.set(x,y,col);P.set(x,y-1,shade(col,1.4));P.set(x+1,y,shade(col,.7))}return}
  const W=32,g=P.g,top=[];for(let x=0;x<W;x++){top[x]=-1;for(let y=0;y<W;y++)if(g[y*W+x]){top[x]=y;break}}
  const xs=top.map((y,x)=>y>=0?x:-1).filter(x=>x>=0);if(xs.length<4)return;
  let h=0;for(const ch of cls)h=(h*31+ch.charCodeAt(0))>>>0;const col=CRYS[h%CRYS.length],hi=shade(col,1.45),lo=shade(col,.7);
  const a=xs[0],b=xs.at(-1),span=b-a;
  [.28,.52,.74].forEach((f,i)=>{const x=Math.round(a+span*f+((h>>>(i*3))%3)-1),y0=top[x];if(y0<0)return;const ht=Math.min(y0,(big?5:3)+((h>>>(i*2))%3)),w2=big?2:1;if(ht<2)return;
    const pts=[[x-w2,y0+2],[x,y0+1-ht],[x+w2+1,y0+2]];
    P.poly(pts.map(([px,py],j)=>[px+(j===0?-1:j===2?1:0),py+(j===1?-1:0)]),OUT);P.poly(pts,col);P.line(x,y0+1-ht+1,x,y0+1,hi);P.set(x+w2,y0+1,lo)});
  const ys=xs.map(x=>top[x]),mx=Math.round(a+span*.4),my=Math.min(W-6,top[mx]+Math.round((W-top[mx])*.45));
  if(g[my*W+mx]&&g[(my+1)*W+mx+1]&&g[my*W+mx]!==OUT){P.set(mx,my,col);P.set(mx+1,my,hi);P.set(mx,my+1,lo);P.set(mx+1,my+1,col)}
}
function fig(L,cls,team,pose,wk,sz){
  if(typeof isHi==='function'&&isHi(cls,sz))return hiFig(L||{},cls,team,pose,wk);
  if(sz===2){const B=BIG[CLS[cls].body+(L.bones?'_bones':'')];if(B)return B(L,pose==='strike');pxScale=2}
  if(team==='e'&&!CLS[cls].tier&&!String(cls).startsWith('G.')&&!L.blight){pxHook=P=>L.crys===false?0:L.crysAt?crysAt(P,L.crysAt):crystallise(P,cls,!!L.big||/Wyrm|Dragon|Colossus|Turtle|King|Stag|Krondis|Tempest|Roc/.test(cls),L.crysSmall,L.crysCol)}
  pxMini=!!L.mini;try{return fig0(L,cls,team,pose,wk)}finally{pxHook=null;pxScale=1;pxMini=false}
}
/* ==================================================================
   64px BOSS ART: hand-drawn big bodies for 2x2 bosses (BIG[body])
   ================================================================== */
const BIG={};
/* a clean gem crystal for 64px art: dark rim, face, lit edge, shaded side */
function gem64(p,x,y,h,w,col,lean=0){const hi=shade(col,1.5),lo=shade(col,.62),tx=x+lean;
  p.poly([[x-w-1,y+1],[tx,y-h-1],[x+w+1,y+1]],OUT);p.poly([[x-w,y],[tx,y-h],[x+w,y]],col);p.poly([[tx,y-h],[x+w,y],[x+1,y]],lo);p.line(tx-1,y-h+2,x-w+1,y-1,hi)}
/* ---- 64px boss art: roc ---- */
BIG.roc=(L,strike)=>{const p=Px(64,64),c=L.body||'#8a5a2a',c2=shade(c,.7),c3=shade(c,1.28),c4=shade(c,.48),hd=L.head||'#efe6cf',hd2=shade(hd,.78),bk=L.beak||'#e8b83a',bk2=shade(bk,.62),ft='#e8b83a',o=strike?5:0;
  /* tail fan */
  p.poly([[20,44],[3,46],[0,52],[4,52],[1,58],[7,57],[5,62],[12,58],[22,52]],c2);for(const[x,y]of[[3,47],[1,55],[6,60]])p.line(21,48,x,y,c4);
  /* far wing behind, raised */
  p.poly([[32,28],[8,0],[12,8],[2,6],[10,14],[0,16],[10,22],[4,28],[20,32]],c4);for(const[x,y]of[[8,0],[2,6],[0,16],[4,28]])p.line(30,28,x,y,shade(c4,.75));
  /* body with chest feathers */
  p.ell(32,42,17,12,c);p.ell(34,47,12,6,c3,(x,y)=>y>=45);p.ell(22,42,8,9,c2,(x,y)=>x<24);
  for(let r=0;r<3;r++)for(let x=26+r*2;x<=44-r*2;x+=4)p.line(x,44+r*3,x+2,45+r*3,c2);
  /* near wing raised high: covert rows, then separated primaries */
  p.poly([[24,34],[14,10],[20,14],[24,4],[30,10],[34,2],[40,10],[44,6],[46,16],[42,30]],c);
  p.poly([[26,32],[18,14],[24,16],[28,8],[32,14],[36,8],[40,14],[42,28]],c3);
  for(const[x,y]of[[14,10],[24,4],[34,2],[44,6]])p.line(x,y,x+(38-x)*.45,y+(28-y)*.45,c2,2);
  for(let y=20;y<32;y+=4)p.line(24,y+2,42,y,c2);
  /* legs and talons */
  for(const x of[28,40]){p.rect(x,52,4,6,ft);p.line(x,53,x+3,53,shade(ft,.7));p.line(x,56,x+3,56,shade(ft,.7));
    p.line(x-2+o,58,x-4+o,62,INK,2);p.line(x+1+o,58,x+1+o,63,INK,2);p.line(x+4+o,58,x+6+o,62,INK,2)}
  /* white neck and head, fierce eye, big hooked beak */
  p.poly([[38,30],[44,14],[54,12],[52,34]],hd);p.line(44,18,46,32,hd2);p.line(48,16,50,32,hd2);
  p.ell(51,16,8,7,hd);p.line(46,11,56,11,hd2,2);
  p.rect(50,13,4,3,INK);p.rect(51,13,2,2,L.eye||'#ff5a3a');p.set(51,13,'#ffffff');
  p.poly([[56,12],[62,14],[63,19],[61,24],[59,20],[57,19]],bk);p.line(57,18,62,18,bk2);p.poly([[61,20],[63,19],[62,25],[60,24]],bk2);
  if(strike){p.poly([[56,20],[61,22],[58,26]],bk2);p.set(57,22,'#7a2a1a')}
  /* malignant crystals growing from the back, between the wings */
  {const B='#4a8ae8',B2='#a8d8ff',B3='#2a4a9a';for(const[x,y,r]of[[30,40,3],[37,46,2]]){p.poly([[x,y-r-1],[x+r+1,y],[x,y+r+1],[x-r-1,y]],OUT);p.poly([[x,y-r],[x+r,y],[x,y+r],[x-r,y]],B);p.poly([[x,y-r],[x+r,y],[x,y]],B2);p.poly([[x,y],[x+r,y],[x,y+r]],B3)}}
  p.outline(OUT);return p.url()};
/* ---- 64px boss art: dragon_bones ---- */
BIG.dragon_bones=(L,strike)=>{const p=Px(64,64),bn='#e8e2d0',bn2='#b8b09a',bn3='#8a8270',dk='#2e2240',dk2='#3e2e54',gl=L.glow||'#c77dff',gl2='#f3e6ff',o=strike?4:0;
  /* tattered wing: membrane scraps with holes, bare finger bones */
  p.poly([[28,30],[14,4],[10,14],[2,16],[8,26],[2,34],[12,38],[24,40]],dk);p.poly([[26,30],[14,8],[12,16],[6,18],[10,26],[6,32],[14,36]],dk2);
  for(const[x,y,r]of[[11,20,2.5],[8,30,2],[16,32,1.6],[14,14,1.5],[20,22,2.2],[5,24,1.6],[18,36,1.4],[22,30,1.8],[9,9,1.4]])p.ell(x,y,r,r,null);for(const[x,y]of[[2,20],[4,30],[8,36],[18,40],[10,6],[3,12]])p.poly([[x-2,y-2],[x+3,y],[x-1,y+3]],null);
  p.line(28,30,16,10,bn,2);for(const[x,y]of[[14,4],[2,16],[2,34],[12,38]])p.line(16,10,x,y,bn2);p.line(28,30,12,38,bn2);p.ell(16,10,1.6,1.6,bn);p.ell(28,30,2,2,bn);
  /* spine: tail tip to skull, vertebrae with dark gaps */
  const sp=[[2,60],[8,56],[14,52],[20,46],[26,40],[32,34],[40,32],[46,26],[49,19],[50,14]];
  for(let i=0;i<sp.length-1;i++)p.line(sp[i][0],sp[i][1],sp[i+1][0],sp[i+1][1],bn,3);
  for(let i=1;i<sp.length-1;i++){p.set(sp[i][0],sp[i][1]-2,bn2);p.set(sp[i][0]+1,sp[i][1]-2,bn3)}
  for(let i=0;i<sp.length-1;i+=1){const[x,y]=sp[i];p.set(x+1,y+1,bn3)}
  /* ribcage around a glowing core */
  p.ell(33,44,5,5,dk);p.ell(33,44,3.4,3.4,gl);p.ell(32,43,1.6,1.6,gl2);for(const[x,y]of[[27,40],[39,41],[33,50],[29,47],[37,47]])p.set(x,y,gl);
  for(let i=0;i<6;i++){const x=24+i*3.2,y=38-i*.6;p.line(x,y,x-2,y+8,bn,2);p.line(x-2,y+8,x+1,y+14,bn);p.set(x+1,y+14,bn2)}
  p.line(22,52,42,51,bn2);
  /* pelvis and legs: femur, shin, clawed foot */
  p.ell(20,48,3,2,bn);for(const[x,y,f]of[[18,50,-1],[22,50,1]]){p.line(x,y,x+f*2,y+6,bn,2);p.line(x+f*2,y+6,x,y+11,bn,2);p.ell(x+f*2,y+6,1.2,1.2,bn2);p.line(x,y+11,x-3,y+12,bn);p.line(x,y+11,x+3,y+12,bn)}
  for(const[x,y]of[[38,48],[42,48]]){p.line(x,y,x+1,y+6,bn,2);p.line(x+1,y+6,x,y+11,bn,2);p.line(x,y+11,x+3,y+12,bn);p.line(x,y+11,x-2,y+12,bn)}
  /* skull: long snout, hollow glowing socket, nasal hole, teeth, back-swept horns, dropping jaw */
  p.poly([[44,10],[52,6],[60,8],[63,12],[62,15],[50,16],[45,15]],bn);p.line(46,15,62,14,bn3);p.line(50,7,58,8,'#ffffff');
  p.ell(51,11,2.6,2.2,INK);p.ell(51,11,1.2,1,gl);p.set(51,10,gl2);p.set(60,11,INK);p.set(61,11,INK);
  p.poly([[47,16],[62,16+o],[61,19+o],[49,19]],bn2);for(let x=50;x<62;x+=3){p.set(x,16,INK);p.set(x+1,17+o,INK)}
  p.line(46,9,38,2,bn,2);p.line(38,2,35,1,bn2);p.line(49,7,44,0,bn2,2);
  if(strike){p.line(62,18,63,26,gl,2);p.set(61,22,gl2);p.set(63,28,gl)}
  /* crystals pushing out of the spine */
  gem64(p,40,30,8,2,'#7ad84a',-1);gem64(p,26,38,6,2,'#8ae86a',1);gem64(p,46,24,5,1,'#7ad84a',1);
  p.outline(OUT);return p.url()};
/* ---- 64px boss art: gator ---- */
BIG.gator=(L,strike)=>{const p=Px(64,64),c=L.body||'#5a6a86',c2=shade(c,.72),c3=shade(c,1.25),c4=shade(c,.5),bl=L.belly||'#5a7a4a',bl2=shade(bl,.75),gd='#e0a830',gd2=shade(gd,.7),cl='#c86a32',cl2='#6a2a1a',tt='#efe6cf',mo='#e8a090',o=strike?4:0;
  /* thick tail sweeping off to the left */
  p.poly([[14,40],[4,44],[0,52],[3,54],[10,50],[18,48]],c2);for(let x=3;x<15;x+=3)p.poly([[x,46-(x>>2)],[x+1,43-(x>>2)],[x+2,46-(x>>2)]],c4);
  /* hunched body: slate back with ridge scutes, green belly */
  p.ell(28,40,20,15,c);p.ell(30,47,16,8,bl,(x,y)=>y>=44);p.ell(24,32,14,8,c3,(x,y)=>y<=31&&p.g[y*64+x]);
  for(let x=12;x<=40;x+=4){const y=Math.round(28-Math.sin((x-10)/32*3.1)*3);p.poly([[x-2,y+2],[x,y-2],[x+2,y+2]],c4)}
  for(let x=18;x<44;x+=5)p.line(x,46,x+2,50,bl2);
  /* hind leg: big thigh, clawed foot */
  p.ell(14,46,8,9,c2);p.ell(13,44,5,6,c);p.rect(8,54,10,4,c2);for(const x of[8,12,16]){p.line(x,58,x-2,62,tt);p.set(x-1,60,tt)}
  /* massive foreleg with cream claws */
  p.poly([[38,38],[48,40],[50,54],[44,58],[36,56]],c);p.line(40,44,48,46,c2);p.line(39,50,48,52,c2);p.rect(36,56,14,4,c2);for(const x of[37,42,47]){p.line(x,60,x+2,63,tt);p.set(x+1,62,tt)}
  /* head: long armoured snout, open toothy jaw, red eye under a gold headpiece */
  p.poly([[40,12],[52,8],[60,12],[63,16],[63,20],[50,22],[42,22]],c);p.line(44,13,58,11,c3);p.set(61,15,INK);p.set(62,15,c4);
  p.poly([[44,22],[63,21],[63,23],[46,24]],mo);for(let x=47;x<63;x+=3){p.poly([[x,21],[x+1,24],[x+2,21]],tt)}
  p.poly([[44,24],[62,24+o],[60,30+o],[46,30]],bl);p.poly([[46,24],[60,24+o],[59,26+o],[47,26]],mo);for(let x=48;x<60;x+=3){p.poly([[x,26+o],[x+1,23+o],[x+2,26+o]],tt)}
  p.poly([[38,10],[50,7],[54,12],[46,15],[38,16]],c2);for(let x=40;x<54;x+=4)p.poly([[x,11],[x+1,8],[x+2,11]],c4);p.line(40,15,52,12,c4);
  p.rect(47,13,3,2,'#d8282a');p.set(48,13,'#ff8a7a');
  if(strike){p.line(63,24,63,30,tt);p.set(62,27,tt)}
  /* one malignant crystal set in the headpiece */
  gem64(p,46,9,7,2,'#ff8a3a',1);
  p.outline(OUT);return p.url()};
/* ---- 64px boss art: bear ---- */
BIG.bear=(L,strike)=>{const p=Px(64,64),c=L.fur||'#3a2a24',c2=shade(c,.68),c3=shade(c,1.4),c4=shade(c,.45),sn=shade(c,1.7),ey=L.eye||'#ff3a3a',core=L.core||'#ff6aa8',cl='#e8e2d0',o=strike?4:0;
  /* far legs */
  p.rect(10,44,9,14,c4);p.rect(34,46,9,12,c4);
  /* body with a high shoulder hump */
  p.ell(26,40,21,14,c);p.ell(36,28,14,11,c);p.ell(24,46,16,7,c2,(x,y)=>y>=44);
  for(let i=0;i<14;i++){const x=10+i*3,y=Math.round(30-Math.sin((x-6)/40*3.1)*10)+(i%2);p.line(x,y,x+1,y+3,c3)}
  /* near hind leg and front leg, heavy paws with cream claws */
  p.ell(14,46,8,9,c);p.rect(8,52,12,6,c);p.rect(6,57,14,3,c2);for(const x of[7,11,15,19]){p.line(x,60,x-1,62,cl)}
  p.poly([[38,36],[50,38],[52,56],[38,56]],c);p.line(40,42,48,44,c2);p.rect(36,56,17,4,c2);for(const x of[37,41,45,49,52]){p.line(x,60,x+1,63,cl)}
  /* a blight crystal grown into the shoulder, its veins spreading through the fur */
  const vn=shade(core,.62),vh=shade(core,1.1);
  for(const pts of[[[44,40],[40,37],[37,36]],[[44,40],[40,43],[38,45]],[[44,40],[46,35],[47,32]],[[44,40],[47,45],[48,48]]])
    for(let i=0;i+1<pts.length;i++){p.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],vn);if(i===0)p.set(Math.round((pts[0][0]+pts[1][0])/2),Math.round((pts[0][1]+pts[1][1])/2),vh)}
  p.poly([[44,34],[49,40],[44,46],[39,40]],OUT);p.poly([[44,36],[47,40],[44,44],[41,40]],core);p.poly([[44,36],[47,40],[44,40]],shade(core,1.45));p.poly([[44,40],[47,40],[44,44]],shade(core,.65));
  /* head: ears, brow, glowing eye, long snout, jaw that drops on the attack */
  p.ell(52,24,10,9,c);p.ell(46,16,3,3,c);p.ell(54,15,3,3,c);p.ell(46,16,1.5,1.5,c4);p.ell(54,15,1.5,1.5,c4);
  p.poly([[56,22],[63,24],[63,30],[56,31]],sn);p.rect(61,23,3,3,INK);p.line(50,21,57,20,c4);p.rect(53,22,3,2,INK);p.set(54,22,ey);p.set(55,22,shade(ey,1.4));
  p.poly([[52,30],[62,31+o],[61,34+o],[53,34]],c2);if(strike){for(let x=55;x<62;x+=2){p.set(x,31,cl);p.set(x,32+o,cl)}p.poly([[55,31],[61,31],[60,32+o],[56,33]],'#7a1a1a')}
  p.outline(OUT);return p.url()};
/* ==================================================================
   32px SPRITES (fig0): one branch per monster body type, then the generic
   humanoid body (tunic, robe, armour, vest, serpent) for anything else.
   ================================================================== */
function fig0(L,cls,team,pose,wk){
  const sk=L.skin||SKIN,sk2=L.skin?shade(L.skin,.85):SKIN2;
  const p=Px(32,32),TC=TEAMC[team],body=CLS[cls].body,hair=L.hair||'#1d1a24',hair2=shade(hair,.7),cloth=L.cloth||TC.a,cloth2=shade(cloth,.72),sash=L.sash||(team!=='e'?GOLD:'#2b2330'),inner=TC.s,strike=pose==='strike',w=wk?IT[wk]:null;
  /* ---- body: snails (Mindsnail, Gemsnail) ---- */
  if(body==='snail'){const b=sk,b2=shade(sk,.75),sh=L.shell||'#b98fbf',sh2=shade(sh,.68),ey=L.eye||'#c77dff',lean=strike?-3:0;
    p.poly([[3,30],[29,30],[27,25],[6,24]],b);p.rect(4,29,24,1,b2);
    p.ell(18,18,9.5,9.5,sh);p.ring(18,18,7,sh2);p.ring(19,18,4.5,sh2);p.ring(19.5,18.5,2.2,sh2);p.line(10,22,26,22,shade(sh,.85));
    p.ell(7+lean,24,4,3.5,b);p.line(6+lean,21,4+lean,12,b2);p.line(9+lean,21,11+lean,12,b2);p.ell(4+lean,11,1.8,1.8,ey);p.ell(11+lean,11,1.8,1.8,ey);
    p.outline(OUT);return p.url()}
  /* ---- body: riderless mounts (Wyvern, Pegasus) ---- */
  if(body==='mount'){return horseUnder(Px(32,32),L,TC,cloth,strike,true)}
  /* ---- body: gnome ---- */
  if(body==='gnome'){const hat=L.hat||'#c8322e',coat=L.cloth||'#3a6ab0',sk='#f3cfa6',bd='#f3f0e8',w=strike?4:0;
    p.rect(11,27,4,3,'#5a3a22');p.rect(17,27,4,3,'#5a3a22');p.poly([[10,18],[22,18],[23,27],[9,27]],coat);p.rect(10,23,13,2,'#7a5230');
    p.ell(16,14,5,4,sk);p.poly([[10,15],[22,15],[19,24],[16,26],[13,24]],bd);p.ell(16,15,1.8,1.6,'#e89a8a');p.set(14,13,INK);p.set(18,13,INK);
    p.poly([[9,12],[23,12],[16,0]],hat);p.rect(9,11,14,2,shade(hat,.75));p.set(16,1,'#ffffff');
    p.line(22,20,26+w,16-w,'#7a5230',2);p.rect(25+w,12-w,4,4,'#9aa3b5');p.rect(8,20,3,3,sk);
    p.outline(OUT);return p.url()}
  /* ---- body: sand worm ---- */
  if(body==='worm'){const c=L.body||'#c98a6a',c2=shade(c,.75),c3=shade(c,1.15),sd='#b8a070',o=strike?3:0;
    p.ell(14,29,11,3,sd);p.ell(14,28,8,1.6,shade(sd,.85));
    for(let i=0;i<6;i++){const t=i/5,x=9+t*10+o*t,y=27-Math.sin(t*2.6)*15;p.ell(x,y,6.2-t*.6,5,i%2?c:c2);p.line(x-4,y+1,x+4,y+1,shade(c,.6))}
    const hx=20+o,hy=10-o;p.ell(hx,hy,7,6.2,c3);p.ell(hx+1.5,hy,4.2,4.2,'#5a1a1a');for(const[a,b]of[[0,-3],[2.5,-2],[3,1],[1,3],[-1.5,2.5],[-1.5,-2]])p.set(hx+1.5+a,hy+b,'#f3f0e8');p.ell(hx+1.5,hy,1.4,1.4,'#2a0a0a');
    p.outline(OUT);return p.url()}
  /* ---- body: snake ---- */
  if(body==='snake'){const c=L.body||'#4f8a3a',c2=shade(c,.7),bl='#d8d08a',r=strike?-4:0;
    p.ell(16,26,10,4,c);p.ell(16,26,6,2,c2);p.ell(14,22,7,3.2,c);p.line(9,26,4,24,c,2);
    p.poly([[18,21],[22,12+r],[25,12+r],[22,22]],c);for(let y=14;y<21;y+=2)p.set(21,y+r/2,bl);
    p.ell(24,10+r,4,3,c);p.rect(24,8+r,2,2,'#ffd23f');p.set(25,9+r,INK);p.line(28,11+r,31,11+r,'#c8322e');p.set(31,10+r,'#c8322e');p.set(31,12+r,'#c8322e');
    for(let x=10;x<23;x+=3)p.set(x,24,c2);
    p.outline(OUT);return p.url()}
  /* ---- body: hawk ---- */
  if(body==='hawk'){const c=L.body||'#8a5a32',c2=shade(c,.7),bl='#e8dcc0',f=strike?4:0;
    p.poly([[6,14-f],[14,16],[12,20],[2,18-f]],c2);p.poly([[26,14-f],[18,16],[20,20],[30,18-f]],c2);
    p.ell(16,19,5,6,c);p.ell(16,21,3.5,4,bl);for(let y=19;y<25;y+=2)p.line(14,y,18,y,shade(bl,.85));
    p.poly([[13,24],[19,24],[18,29],[14,29]],c2);p.ell(16,12,4,3.5,c);p.rect(14,10,1,2,INK);p.rect(18,10,1,2,INK);p.set(14,10,'#ffd23f');p.set(18,10,'#ffd23f');
    p.poly([[15,13],[17,13],[16,16]],'#e2b553');p.rect(13,28,2,2,'#e2b553');p.rect(17,28,2,2,'#e2b553');
    p.outline(OUT);return p.url()}
  /* ---- body: mushroom folk (Sporeling, Myconid, Mushroom King) ---- */
  if(body==='shroom'){const k=L.small?.75:1,X=x=>16+(x-16)*k,Y=y=>31-(31-y)*k,cap=L.cap||'#d8483a',cap2=shade(cap,.72),st=L.stem||'#efe6cf',st2=shade(st,.8),sq=strike?2:0;
    p.poly([[X(11),Y(17)],[X(21),Y(17)],[X(22),Y(29)],[X(10),Y(29)]],st);p.rect(X(10),Y(17),Math.max(1,2*k),12*k,st2);
    p.rect(X(10),Y(29),4*k,2,st2);p.rect(X(18),Y(29),4*k,2,st2);
    if(L.blight){const gl=L.eye||'#5fe8d8';p.rect(X(12),Y(20),4,3,INK);p.rect(X(17),Y(20),4,3,INK);p.line(X(11),Y(19),X(15),Y(20),INK);p.line(X(17),Y(20),X(21),Y(19),INK);p.rect(X(13),Y(21),2,1,gl);p.rect(X(18),Y(21),2,1,gl);
      p.rect(X(13),Y(25),7,2,INK);for(const x of[13,15,17,19])p.set(X(x),Y(25),'#e8e2d0');p.set(X(14),Y(26),'#e8e2d0');p.set(X(18),Y(26),'#e8e2d0');p.line(X(11),Y(18),X(12),Y(27),shade(st,.65));p.line(X(20),Y(18),X(21),Y(26),shade(st,.65))}
    else{p.rect(X(13),Y(20),2,3,INK);p.rect(X(18),Y(20),2,3,INK);p.set(X(13),Y(20),'#ffffff');p.set(X(18),Y(20),'#ffffff');
    p.set(X(14),Y(24),INK);p.rect(X(15),Y(25),3,1,INK);p.set(X(18),Y(24),INK);p.set(X(12),Y(23),'#f0a0a0');p.set(X(20),Y(23),'#f0a0a0')}
    p.ell(16,Y(12)-sq,12*k,8*k,cap,(x,y)=>y<=Y(16)-sq);p.rect(X(4),Y(15)-sq,24*k,2,cap2);for(let x=X(6);x<X(26);x+=2)p.set(x,Y(16)-sq,'#d9c9a8');
    if(L.blight){const g='#5fe8d8',g2='#e8fffb',g3='#2a9a8a',c3=shade(cap,1.35),c4=shade(cap,.5);
      p.ell(19,9-sq,7,4,c3,(x,y)=>y<=12-sq&&p.g[y*32+x]);p.ell(9,13-sq,5,3,cap2,(x,y)=>y<=16-sq&&p.g[y*32+x]);p.rect(5,16-sq,22,1,c4);
      for(let x=7;x<26;x+=3)p.line(x,16-sq,x+1,17-sq,c4);p.line(9,9-sq,13,13-sq,c4);p.line(21,7-sq,24,12-sq,c4);
      for(const[x,y,h,w]of[[9,8,7,2],[16,5,9,2],[22,7,7,2],[26,11,4,1]]){p.poly([[x-w-1,y+1-sq],[x,y-h-1-sq],[x+w+1,y+1-sq]],OUT);p.poly([[x-w,y-sq],[x,y-h-sq],[x+w,y-sq]],g);p.line(x+1,y-h+2-sq,x+w,y-sq,g3);p.line(x-1,y-h+3-sq,x-1,y-1-sq,g2)}
      if(L.crown){p.rect(13,15-sq,7,1,'#8a6a20');p.set(14,14-sq,'#8a6a20');p.set(16,14-sq,'#8a6a20');p.set(18,14-sq,'#8a6a20');p.set(16,15-sq,g)}}
    else{[[10,10],[17,6],[22,11],[14,13],[25,14]].forEach(([x,y])=>p.ell(X(x),Y(y)-sq,1.6*k,1.3*k,'#ffffff'));
    if(L.crown){p.rect(12,1,9,2,GOLD);[12,16,20].forEach(x=>p.rect(x,0,1,1,GOLD));p.set(16,1,RED)}}
    if(strike)for(const[x,y]of[[27,18],[29,15],[30,20],[26,14],[31,17]])p.set(x,y,'#c58aff');
    p.outline(OUT);return p.url()}
  /* ---- body: ghost ---- */
  if(body==='ghost'){const c=L.body||'#d8e0f0',c2=shade(c,.78),b=strike?-2:0,ey=L.eye||'#7fe3ff';
    p.ell(16,12+b,8,8,c);p.rect(8,12+b,16,12,c);for(let i=0;i<4;i++)p.poly([[8+i*4,24+b],[12+i*4,24+b],[10+i*4,28+b+(i%2)]],c);
    p.rect(8,12+b,2,12,c2);p.line(8,17+b,4,21+b,c2,2);if(strike)p.line(23,15+b,30,12+b,c,2);else p.line(23,17+b,27,21+b,c,2);
    p.ell(13,12+b,1.8,2.6,INK);p.ell(19,12+b,1.8,2.6,INK);p.set(13,12+b,ey);p.set(19,12+b,ey);p.ell(16,18+b,1.6,2.2,INK);
    p.outline(OUT);return p.url()}
  /* ---- body: mud monster ---- */
  if(body==='mud'){const c=L.body||'#5a4a32',c2=shade(c,.7),c3=shade(c,1.25),s=strike?4:0;
    p.ell(16,30,13,2,c2);p.ell(16,22,11,8,c);p.ell(16,14,7,7,c);p.rect(6,24,2,5,c2);p.rect(24,23,2,6,c2);
    p.ell(12,12,2,1.5,c3);p.ell(20,20,2,1.4,c3);p.line(13,7,11,4,'#4f8a5a');p.line(18,7,20,3,'#4f8a5a');p.set(16,7,'#6aaa5a');
    p.ell(13,14,1.9,1.9,'#ffd23f');p.ell(19,13,1.9,1.9,'#ffd23f');p.set(13,14,INK);p.set(19,13,INK);p.ell(16,19,3,1.4,'#2a1a10');
    p.line(25,19,27+s,15-s,c,3);p.ell(28+s,14-s,2.5,2.5,c);
    p.outline(OUT);return p.url()}
  /* ---- body: gator (Lurker, Krondis) ---- */
  if(body==='gator'){const c=L.body||'#4f6a3a',c2=shade(c,.7),bl='#c9c08a',o=strike?4:0;
    p.poly([[0,23],[8,19],[10,25],[1,25]],c2);p.ell(14,22,8,4.5,c);p.ell(14,25,6,1.4,bl);for(let x=8;x<=20;x+=3)p.set(x,18,c2);
    p.rect(8,25,3,4,c2);p.rect(17,25,3,4,c2);p.rect(11,25,3,4,c);p.rect(20,25,3,4,c);
    p.poly([[20,19],[31,20],[31,23],[20,25]],c);p.poly([[20,18],[31,19-o],[31,21-o],[21,21]],c);p.line(21,21,31,22,'#7a2a2a');
    for(let x=23;x<31;x+=2){p.set(x,22,'#ffffff');if(o)p.set(x,20-o+1,'#ffffff')}p.ell(23,18,2,1.5,c);p.rect(22,17,2,2,'#ffd23f');p.set(23,17,INK);
    if(L.crown){p.rect(20,13,6,2,GOLD);p.set(20,12,GOLD);p.set(23,12,GOLD);p.set(25,12,GOLD)}
    p.outline(OUT);return p.url()}
  /* ---- body: pyrite cube colossus ---- */
  if(body==='cubes'){const G1='#a8945a',G2='#c8b47a',G3='#7a6a44',G4='#f0e6c0',ED='#3e3420',eye=L.eye||'#fff2b0',s=strike?3:0;
    /* one pyrite cube: dark seam, lit top, brassy front, shaded side, with striations */
    const cube=(x,y,n)=>{const d=Math.max(1,Math.round(n/3));p.poly([[x-1,y+d],[x+d-1,y-1],[x+n+d+1,y-1],[x+n+d+1,y+n],[x+n,y+n+d+1],[x-1,y+n+d+1]],ED);p.rect(x,y+d,n,n,G2);p.poly([[x,y+d],[x+d,y],[x+n+d,y],[x+n,y+d]],G4);p.poly([[x+n,y+d],[x+n+d,y],[x+n+d,y+n],[x+n,y+n+d]],G3);
      for(let i=2;i<n;i+=2)p.line(x+1,y+d+i,x+n-1,y+d+i,G1);};
    cube(9,20,5);cube(17,20,5);cube(8,25,5);cube(18,25,5);
    cube(5,12,3);cube(4,16,3);cube(4,20,3);
    cube(9,10,11);cube(11,1,8);
    /* slim right arm: hangs down at rest, swings out level to strike */
    if(strike){cube(25,12,3);cube(28,12,3)}else{cube(25,12,3);cube(25,16,3);cube(25,20,3)}
    p.rect(13,6,2,2,eye);p.rect(16,6,2,2,eye);
    p.outline(OUT);return p.url()}
  /* ---- body: turtle ---- */
  if(body==='turtle'){const c=L.body||'#6a7a5a',c2=shade(c,.7),sh=L.shell||'#4a3a5a',sh2=shade(sh,.7),cr=L.gem||'#b07ae8',cr2=shade(cr,1.35),o=strike?3:0;
    p.rect(5,25,4,5,c2);p.rect(18,25,4,5,c2);p.rect(9,26,4,4,c);p.rect(22,26,3,4,c);p.poly([[2,24],[0,27],[4,26]],c);
    p.ell(13,22,11,7,sh,(x,y)=>y<=25);p.rect(2,24,23,2,sh2);p.line(6,20,20,20,sh2);p.line(13,16,13,24,sh2);
    p.poly([[5,19],[7,10],[9,19]],cr);p.poly([[10,17],[13,3],[16,17]],cr);p.poly([[16,19],[19,8],[22,19]],cr);p.line(13,5,13,15,cr2);p.line(19,10,19,17,cr2);p.set(7,12,cr2);
    p.ell(26+o,21,3.5,3,c);p.rect(22,21,4,3,c);p.set(27+o,20,INK);p.line(25+o,23,29+o,23,c2);
    p.outline(OUT);return p.url()}
  /* ---- body: golems and treants ---- */
  if(body==='golem'){const c=L.body||'#7a746e',c2=shade(c,.7),c3=shade(c,1.2),gl=L.eye||'#ff9a3c',s=strike?3:0;
    p.poly([[8,12],[24,11],[27,24],[22,28],[10,28],[5,22]],c);p.poly([[12,4],[20,4],[22,11],[10,11]],c);p.line(8,12,6,22,c2,2);p.line(12,4,10,11,c2);
    p.ell(12,15,2.5,1.5,c3);p.ell(20,8,1.5,1,c3);p.line(15,15,17,19,gl);p.line(17,19,15,23,gl);
    p.rect(13,7,2,1,gl);p.rect(18,7,2,1,gl);if(L.leaves){p.ell(16,3,7,3,L.leaves);p.ell(10,5,3,2,shade(L.leaves,1.2));p.ell(22,5,3,2,shade(L.leaves,1.2));p.line(8,13,3,9,c2);p.line(24,12,29,8,c2)}p.ell(4,20,3.5,4,c);p.ell(27+s,17-s,3.8,4,c);p.ell(27+s,17-s,1.5,1.5,c2);
    p.rect(10,27,4,4,c2);p.rect(18,27,4,4,c2);
    p.outline(OUT);return p.url()}
  /* ---- body: frost sprite (snowflake) ---- */
  if(body==='frost'){/* a living snowflake: six branching ice arms around a glowing face */const c=L.body||'#9fd8ff',hi='#f2fbff',dk=shade(c,.7),r0=strike?Math.PI/6:0,cx=16,cy=15;
    for(let k=0;k<6;k++){const a=r0+k*Math.PI/3,ex=cx+Math.cos(a)*12,ey=cy+Math.sin(a)*12;p.line(cx,cy,Math.round(ex),Math.round(ey),c,2);
      for(const d of[5,8.5]){const bx=cx+Math.cos(a)*d,by=cy+Math.sin(a)*d,l=d<6?3.5:2.5;for(const s of[-1,1]){const b=a+s*Math.PI/3;p.line(Math.round(bx),Math.round(by),Math.round(bx+Math.cos(b)*l),Math.round(by+Math.sin(b)*l),dk)}}
      p.set(Math.round(ex),Math.round(ey),hi)}
    p.ell(cx,cy,5.5,5.5,c);p.ell(cx,cy,4.2,4.2,hi);p.rect(cx-3,cy-1,2,2,'#2a4a7a');p.rect(cx+1,cy-1,2,2,'#2a4a7a');p.set(cx-3,cy-1,hi);p.set(cx+1,cy-1,hi);p.line(cx-1,cy+2,cx+1,cy+2,dk);
    if(strike)[[4,4],[28,6],[27,26],[5,25]].forEach(([x,y])=>p.set(x,y,hi));
    p.outline(OUT);return p.url()}
  /* ---- body: fire sprite / wisp ---- */
  if(body==='flame'){const c=L.body||'#ff8a3c',c2=L.core||'#ffe14a',c3=L.rim||'#c8322e',f=strike?3:0;
    p.poly([[16,1],[22,9],[25,18],[22,26],[10,26],[7,18],[10,9],[12,12]],c3);p.ell(16,19,7,7,c);p.poly([[16,5],[21,14],[11,14]],c);p.ell(16,21,4,4,c2);
    p.rect(13,18,2,2,INK);p.rect(18,18,2,2,INK);p.set(15,22,INK);p.set(17,22,INK);[[8,6],[24,5],[27,13],[5,14]].forEach(([x,y])=>p.set(x,y,c2));
    if(strike){p.ell(27,16,3,3,c);p.ell(28,16,1.5,1.5,c2)}p.ell(16,30,5,1,'#3a1a14');
    p.outline(OUT);return p.url()}
  /* ---- body: dragons ---- */
  if(body==='dragon'&&L.bones){const bn='#e8e2d0',bn2='#a8a08a',dk='#3a2a48',gl=L.glow||'#c77dff',o=strike?2:0;
    /* tattered membrane scraps between bare wing bones */
    p.poly([[13,15],[6,5],[8,11]],dk);p.poly([[13,17],[3,12],[6,17]],dk);
    for(const[x,y]of[[3,1],[1,9],[0,16],[3,22]]){p.line(13,15,x,y,bn);p.set(x,y,bn2)}p.ell(13,16,1.5,1.5,bn);
    /* spine from tail tip over the back to the neck, with vertebrae */
    const sp=[[0,30],[3,27],[7,24],[11,18],[15,16],[19,16],[21,12],[23,9]];for(let i=0;i<sp.length-1;i++)p.line(sp[i][0],sp[i][1],sp[i+1][0],sp[i+1][1],bn,2);sp.forEach(([x,y],i)=>{if(i%2)p.set(x,y-1,bn2)});
    /* ribcage: curved ribs hanging from the spine around a glowing core */
    p.ell(15,22,2.2,2.2,gl);p.set(15,21,'#f3e6ff');
    for(let x=10;x<=19;x+=2){const t=Math.min(x-9,20-x);p.line(x,17,x-1,22+Math.min(3,t),bn);p.set(x-1,23+Math.min(3,t),bn2)}p.line(9,26,19,26,bn2);
    /* bony legs with joints and claws */
    for(const[x,y]of[[10,25],[19,25]]){p.line(x,y,x-1,28,bn);p.line(x-1,28,x,31,bn);p.set(x-1,28,bn2);p.set(x+1,31,bn)}
    for(const[x,y]of[[13,25],[21,25]]){p.line(x,y,x+1,28,bn2);p.line(x+1,28,x,31,bn2)}
    /* skull: hollow glowing socket, teeth, horns */
    p.poly([[21,5],[27,4],[31,7],[31,9],[24,10],[22,10]],bn);p.line(22,9,30,9,bn2);p.rect(24,6,3,2,INK);p.set(25,6,gl);p.set(26,7,gl);p.set(29,7,INK);
    p.poly([[23,10],[31,10+o],[30,11+o],[24,12]],bn2);for(let x=25;x<31;x+=2){p.set(x,10,INK);p.set(x,11+o,INK)}
    p.line(22,5,18,0,bn);p.line(24,4,22,0,bn2);
    if(strike){p.line(31,11,31,15,gl,2);p.set(30,13,'#f3e6ff')}
    p.outline(OUT);return p.url()}
  /* ---- body: roc ---- */
  if(body==='roc'){const c=L.body||'#8a5a2a',c2=shade(c,.68),c3=shade(c,1.3),c4=shade(c,.45),hd=L.head||'#efe6cf',bk=L.beak||'#e8b83a',o=strike?3:0;
    /* tail fan, far wing, body */
    p.poly([[9,22],[1,24],[0,28],[3,27],[2,30],[6,28],[10,26]],c2);p.line(9,23,1,26,c4);p.line(9,24,3,29,c4);
    p.poly([[15,14],[2,0],[4,5],[0,6],[5,10],[1,13],[9,16]],c4);
    p.ell(15,20,8,6,c);p.ell(16,23,6,3,c3,(x,y)=>y>=22);for(let x=11;x<=20;x+=3)p.set(x,24,c2);
    /* near wing raised high, with feather tips */
    p.poly([[12,16],[5,1],[9,3],[11,0],[14,3],[17,1],[18,6],[19,14]],c);p.poly([[12,16],[7,4],[10,6],[13,4],[16,7],[18,14]],c3);
    for(const[x,y]of[[5,1],[11,0],[17,1]])p.line(x,y,14,13,c2);p.line(12,16,19,14,c2);
    /* talons */
    for(const x of[14,19]){p.line(x,25,x+o,29,bk,2);p.set(x-1+o,31,INK);p.set(x+1+o,31,INK);p.set(x+o,31,bk)}
    /* white head, hooked golden beak, fierce eye */
    p.poly([[19,15],[22,8],[26,8],[24,17]],hd);p.ell(25,9,4,3.6,hd);p.line(22,12,23,16,shade(hd,.8));
    p.poly([[27,8],[31,9],[31,12],[29,13],[28,11]],bk);p.line(29,12,30,13,shade(bk,.6));if(strike)p.poly([[27,11],[30,13],[27,13]],shade(bk,.75));
    p.rect(25,8,2,1,INK);p.set(26,8,L.eye||'#ff5a3a');p.line(24,7,27,7,shade(hd,.7));
    p.outline(OUT);return p.url()}
  /* ---- body: dragons ---- */
  if(body==='dragon'){const c=L.body||'#5a2a22',c2=shade(c,.68),c3=shade(c,1.3),c4=shade(c,.45),lv=L.glow||'#ff8a3c',ly=L.glow2||'#ffe14a',bn='#e8e2d0',o=strike?2:0;
    /* wing behind: dark membrane, light bones fanning from the shoulder */
    p.poly([[13,15],[3,1],[6,6],[1,9],[5,12],[0,16],[6,18],[3,22],[13,20]],c4);p.poly([[13,16],[5,4],[7,8],[3,11],[6,14],[2,17],[13,19]],c2);
    p.line(13,15,3,1,c3);p.line(13,16,1,9,c3);p.line(13,17,0,16,c3);p.line(13,18,3,22,c3);
    /* tail, curling down-left */
    p.poly([[9,23],[3,25],[0,30],[3,29],[7,27],[11,27]],c2);p.line(3,25,1,29,c);p.poly([[0,30],[-1,27],[2,27]],c3);
    /* far legs (dark), body, near legs */
    p.rect(9,26,3,5,c4);p.rect(18,26,3,5,c4);
    p.ell(14,22,8,6,c);p.ell(13,25,7,2.6,c2,(x,y)=>y>=24);p.line(9,18,17,17,c3);p.line(8,19,9,18,c3);
    p.ell(15,25,5,2.3,lv);for(let x=11;x<=19;x+=2)p.set(x,25,shade(lv,.75));p.line(11,24,19,24,ly);
    p.rect(11,27,3,4,c);p.rect(20,27,3,4,c);p.rect(11,27,1,4,c3);p.rect(20,27,1,4,c3);for(const x of[11,13,20,22])p.set(x,31,bn);
    /* neck with a belly strip */
    p.poly([[18,19],[21,10],[26,9],[24,21]],c);p.line(19,18,22,10,c3);for(let y=11;y<20;y+=2)p.set(24-Math.round((y-11)*.12),y,lv);
    /* head: snout, jaw, brow, glowing eye, swept horns */
    p.poly([[21,5],[27,4],[31,7],[31,10],[26,11],[22,11]],c);p.line(22,5,28,5,c3);p.line(23,9,31,9,c2);
    p.poly([[23,10],[31,10+o],[30,12+o],[24,12]],c2);for(let x=26;x<31;x+=2)p.set(x,10+o,bn);
    p.rect(24,6,3,2,INK);p.rect(25,6,2,1,ly);p.line(23,5,27,5,c4);p.set(30,8,INK);
    p.line(22,5,18,0,bn);p.line(23,5,20,1,bn);p.line(25,4,23,0,bn);
    if(L.magma){for(const[x,y]of[[10,16],[13,15],[16,15],[19,14]])p.poly([[x-1,y+1],[x,y-3],[x+2,y+1]],c4);
      p.line(9,20,13,22,lv);p.line(13,22,12,25,lv);p.line(16,18,19,21,lv);p.line(19,21,21,20,ly);p.line(7,8,10,12,lv);p.line(4,14,8,15,lv);p.set(22,8,lv);p.set(28,7,lv);
      p.ell(15,25,5.5,2.8,ly);p.ell(15,25,3,1.5,'#fff6c0')}
    if(strike){p.line(31,11,31,15,lv,2);p.line(30,12,31,17,ly);p.set(29,14,ly)}
    p.outline(OUT);return p.url()}
  /* ---- body: storm elemental ---- */
  if(body==='storm'){const c='#8a96b8',c2='#5a6688',c3='#c8d0e8',bo='#ffe14a';
    p.ell(10,12,6,5,c);p.ell(20,9,7,6,c);p.ell(16,15,9,6,c);p.ell(25,14,5,4,c);p.ell(16,19,9,3,c2);p.ell(19,6,3,1.5,c3);p.ell(9,9,2,1,c3);
    p.rect(12,13,3,2,'#9fd8ff');p.rect(19,12,3,2,'#9fd8ff');p.line(13,17,19,17,c2);
    p.line(16,21,13,25,bo,2);p.line(13,25,17,26,bo,2);p.line(17,26,14,31,bo,2);if(strike){p.line(26,15,29,19,bo,2);p.line(29,19,27,22,bo,2);p.line(27,22,31,27,bo,2)}
    p.outline(OUT);return p.url()}
  /* ---- body: beholder ---- */
  if(body==='eye'){const c=L.body||'#8a4a6a',c2=shade(c,.7),ey='#f3f0e8',ir=L.eye||'#5fc2a0';
    [[-8,-1],[-4,-2],[0,-2],[4,-2],[8,-1]].forEach(([dx],i)=>{const tx=16+dx*1.4,ty=3+(i%2);p.line(16+dx*.6,10,tx,ty+2,c2);p.ell(tx,ty,1.7,1.7,ey);p.set(Math.round(tx),Math.round(ty),ir)});
    p.ell(16,18,10,9,c);p.ell(13,21,6,5,c2,(x,y)=>x<12);p.ell(16,17,5,4.5,ey);p.ell(16,17,2.6,2.6,ir);p.ell(16,17,1,1,INK);p.line(11,13,21,13,c2);
    p.line(10,24,22,24,'#2a1a1a');for(let x=11;x<22;x+=2)p.set(x,25,'#ffffff');
    if(strike)p.line(21,17,31,14,'#c77dff',2);
    p.outline(OUT);return p.url()}
  /* ---- body: four-legged beasts (wolves, jackals, stags) ---- */
  if(body==='beast'){const f=L.fur||'#8a8f9a',f2=shade(f,.7),f3=shade(f,1.25),ey=L.eye||'#ffd23f',ln=strike?3:0;
    p.poly([[6+ln,17],[1+ln,11],[2+ln,9],[8+ln,15]],f2);
    p.rect(8+ln,22,2,7,f2);p.rect(18+ln,22,2,7,f2);
    p.ell(14+ln,19,8,4.6,f);p.ell(14+ln,21.5,5,1.6,f3);p.line(9+ln,16,18+ln,15,f2);
    p.rect(11+ln,22,2,7,f);p.rect(21+ln,22,2,7,f);p.rect(7+ln,29,3,1,f2);p.rect(10+ln,29,3,1,f);p.rect(17+ln,29,3,1,f2);p.rect(20+ln,29,3,1,f);
    p.ell(23+ln,14,4.6,4.4,f);p.poly([[25+ln,12],[31,14],[31,17],[25+ln,18]],f);p.rect(26+ln,17,5-ln,1,f3);
    p.poly([[19+ln,11],[20+ln,5],[23+ln,10]],f2);p.poly([[23+ln,10],[25+ln,5],[26+ln,11]],f);p.set(24+ln,8,'#c87a7a');
    if(L.antlers){const a=L.antlers;p.line(21+ln,9,19+ln,2,a);p.line(20+ln,5,17+ln,3,a);{const a2=L.antler2||a;p.line(24+ln,9,27+ln,1,a2);p.line(26+ln,5,29+ln,3,a2);if(L.antler2){p.set(27+ln,1,shade(a2,1.5));p.set(25+ln,7,shade(a2,1.5))}}}
    p.rect(25+ln,12,2,1,ey);p.set(31,14,OUT);
    if(strike){p.line(27,17,31,19,'#c8322e');p.set(28,18,'#ffffff');p.set(30,18,'#ffffff')}
    p.outline(OUT);return p.url()}
  /* ---- body: gremlin ---- */
  if(body==='gremlin'){const c=sk,c2=shade(sk,.72),cl='#e8e2d0',st=strike?3:0;
    p.ell(16,24,6,5,c);p.ell(16,17,5,4.5,c);p.poly([[12,16],[4,10],[12,13]],c2);p.poly([[20,16],[28,10],[20,13]],c2);
    p.rect(13,16,2,2,'#ffd23f');p.rect(18,16,2,2,'#ffd23f');p.rect(14,20,4,1,'#2a1a1a');p.set(15,21,cl);p.set(17,21,cl);
    p.line(11,23,8-st,27-st,c2,2);p.line(21,23,24+st,27-st,c2,2);p.set(7-st,29-st,cl);p.set(25+st,29-st,cl);p.rect(12,29,3,2,c2);p.rect(17,29,3,2,c2);
    p.outline(OUT);return p.url()}
  if(CLS[cls].fly&&!CLS[cls].mnt){const wc=L.wing||'#3b3050',wc2=shade(wc,.7);p.poly([[12,15],[1,5],[3,13],[0,20],[11,21]],wc);p.poly([[19,15],[30,5],[28,13],[31,20],[20,21]],wc);p.line(12,15,2,7,wc2);p.line(19,15,29,7,wc2);p.line(11,18,2,16,wc2);p.line(20,18,29,16,wc2)}
  if(L.style==='long'&&L.gear!=='helm')p.rect(10,8,4,13,hair2);
  if(L.style==='tail'&&L.gear!=='douli')p.line(11,4,8,14,hair2,2);
  if(L.style==='wild')p.poly([[10,6],[6,13],[11,11]],hair2);
  if(L.gear==='hood'||L.gear==='veil')p.ell(15.5,10.5,6.6,6.8,L.gear==='veil'?'#2a1e36':shade(cloth,.85));
  if(L.cape||CLS[cls].tier===2)p.poly([[10,15],[15,15],[13,31],[6,31]],TC.A);
  if(w&&w.kind==='twin')drawWeapon(p,w,10,23,strike,true);
  if(w&&w.kind==='twindagger'){const c=wcol(w);p.line(10,24,8,29,c.blade);p.line(9,23,12,24,c.hilt)}
  /* ---- body: robe ---- */
  if(body==='robe')p.poly([[9,16],[13,16],[13,24],[8,25]],cloth2);else{p.rect(10,16,3,7,body==='vest'?sk2:body==='armor'?TC.A:cloth2);p.rect(10,22,3,2,sk2)}
  /* ---- body: robe ---- */
  if(body==='robe'){p.poly([[11,15],[20,15],[22,30],[9,30]],cloth);p.poly([[11,15],[13,15],[12,30],[9,30]],cloth2);p.rect(10,29,12,1,inner);p.rect(11,30,4,2,INK);p.rect(17,30,4,2,INK)}
  else if(body!=='serpent'){const pants=body==='armor'?TC.A:body==='vest'?'#3a3040':'#4a4034';p.rect(12,24,3,5,pants);p.rect(17,24,3,5,pants);p.rect(11,28,4,3,INK);p.rect(17,28,4,3,INK)}
  /* ---- body: serpent ---- */
  if(body==='serpent'){const tl=L.tail||'#4f8a5a',tl2=shade(tl,.7);p.poly([[11,21],[20,21],[22,25],[25,28],[24,31],[8,31],[6,29],[9,25]],tl);p.poly([[6,29],[3,27],[2,24],[4,25],[8,28]],tl2);for(let x=9;x<23;x+=3)p.set(x,27,tl2);p.rect(9,30,15,1,tl2);p.poly([[11,15],[20,15],[20,22],[11,22]],cloth);p.rect(11,15,2,7,cloth2)}
  /* ---- body: tunic ---- */
  if(body==='tunic'){p.poly([[11,15],[20,15],[21,26],[10,26]],cloth);p.rect(11,15,2,11,cloth2)}
  if(L.apron){p.rect(12,18,8,9,'#e8e2d0');p.rect(12,18,8,1,'#c9c3b8');p.line(12,18,14,15,'#e8e2d0');p.line(19,18,17,15,'#e8e2d0');p.rect(14,22,3,2,'#c9c3b8')}
  /* ---- body: armor ---- */
  if(body==='armor'){p.rect(10,15,11,9,METAL);for(let y=16;y<24;y+=2)p.rect(10,y,11,1,METAL2);p.poly([[10,23],[21,23],[22,28],[9,28]],cloth);p.ell(11,16,3,2.2,cloth);p.ell(20,16,3,2.2,cloth);p.rect(14,18,3,3,GOLD)}
  /* ---- body: vest ---- */
  if(body==='vest'){p.rect(11,15,9,9,sk);p.rect(15,16,1,5,sk2);p.poly([[11,15],[14,15],[13,24],[11,24]],cloth);p.poly([[17,15],[20,15],[20,24],[18,24]],cloth)}
  if(body==='robe'||body==='tunic')p.poly([[13,15],[18,15],[15.5,19]],inner);
  if(body!=='armor'){p.rect(11,21,10,2,sash);p.line(13,23,12,27,sash)}
  if(L.shield){const sc=TC.A,rim=METAL2;if(L.shield==='round'){p.ell(9.5,20,4.6,5,rim);p.ell(9.5,20,3.6,4,sc);p.ell(9.5,20,1.3,1.3,GOLD)}
    else{p.poly([[5,15],[14,15],[14,22],[9.5,28],[5,22]],rim);p.poly([[6,16],[13,16],[13,22],[9.5,26.5],[6,22]],sc);p.rect(9,17,1,8,GOLD);p.rect(7,19,5,1,GOLD)}}
  p.rect(14,13,3,3,sk2);
  p.ell(15.5,10,4.8,5.2,sk);p.rect(11,11,2,2,sk2);
  p.rect(18,9,1,2,L.eye||INK);p.rect(14,9,1,2,L.eye||INK);p.rect(18,8,2,1,hair2);p.rect(13,8,2,1,hair2);p.rect(16,12,2,1,'#c0786a');
  hairFront(p,L,hair,hair2,TC,cloth);
  if(L.skel){const ey=L.eye||'#ff5a3a';p.rect(13,8,3,3,INK);p.rect(17,8,3,3,INK);p.set(14,9,ey);p.set(18,9,ey);p.set(16,11,INK);p.rect(14,13,4,1,INK);p.set(15,13,sk);p.set(17,13,sk);
    if(body==='vest'){for(const y of[16,18,20])p.line(13,y,17,y,INK);p.line(15,15,15,23,shade(sk,.8))}}
  if(L.horns){const h2=L.hornGem||'#d8d0bc';p.line(12,6,9,2,'#d8d0bc',2);p.line(9,2,8,0,'#d8d0bc');p.line(19,6,22,2,h2,2);p.line(22,2,23,0,h2);if(L.hornGem){p.set(21,3,shade(h2,1.5));p.set(23,0,shade(h2,1.5))}}
  if(CLS[cls].tier===2){p.rect(9,14,4,2,GOLD);p.rect(19,14,4,2,GOLD);p.rect(12,5,7,1,GOLD);p.set(15,4,'#9fd8ff')}
  const fsl=body==='vest'?sk:cloth;
  if(strike){drawWeapon(p,w,25,16,true);if(body==='robe')p.poly([[18,15],[25,13],[26,17],[18,19]],fsl);else p.rect(18,15,7,3,fsl);p.rect(25,15,2,3,sk)}
  else{drawWeapon(p,w,20,21,false);if(body==='robe')p.poly([[18,16],[21,16],[23,23],[18,23]],fsl);else p.rect(18,16,3,6,fsl);p.rect(20,21,2,2,sk)}
  if(CLS[cls].mnt)return horseUnder(p,L,TC,cloth,strike);
  p.outline(OUT);return p.url();
}
/* ==================================================================
   ITEM ICONS (16px): one line per weapon kind, then gear
   ================================================================== */
function iconArt_draw(k){
  const w=IT[k],p=Px(16,16),c=wcol(w),kd=w.kind;
  if(kd==='greatsword'){p.line(3,13,14,1,c.blade,2);p.line(4,13,14,2,c.edge);p.line(1,10,6,15,c.hilt,2);p.set(1,15,RED)}
  if(kd==='sword'){p.line(4,12,13,2,c.blade);p.line(5,12,13,3,c.edge);p.line(2,9,6,13,c.hilt);p.set(2,14,RED);p.set(1,15,RED)}
  if(kd==='dagger'){p.line(4,12,10,6,c.blade,2);p.line(5,12,11,6,c.edge);p.line(3,8,7,12,c.hilt,2);p.line(2,13,3,14,shade(c.hilt,.7),2);p.set(1,15,RED)}
  if(kd==='twindagger'){p.line(3,9,8,4,c.blade,2);p.line(2,6,5,9,c.hilt);p.line(8,14,13,9,c.blade,2);p.line(7,11,10,14,c.hilt);p.set(1,10,RED);p.set(6,15,RED)}
  if(kd==='twin'){p.line(3,12,13,2,c.blade);p.line(3,2,13,12,c.blade);p.line(2,10,5,13,GOLD);p.line(2,5,5,2,GOLD)}
  if(kd==='rapier'){p.line(4,12,14,1,c.blade);p.ring(4.5,11.5,2,c.hilt);p.set(2,14,BROWN)}
  if(kd==='scimitar'){p.line(3,13,6,8,c.blade,2);p.line(6,8,10,4,c.blade,2);p.line(10,4,14,3,c.blade,2);p.rect(2,13,2,2,c.hilt)}
  if(kd==='spear'||kd==='javelin'){p.line(2,14,11,5,BROWN);p.poly([[10,4],[15,1],[12,7]],c.blade);if(kd==='spear')p.ell(9.5,7,1.5,1.5,RED)}
  if(kd==='halberd'){p.line(2,15,11,4,BROWN);p.poly([[10,3],[14,0],[12,5]],c.blade);p.poly([[10,6],[14,4],[15,9],[11,8]],c.blade)}
  if(kd==='hammer'){p.line(3,14,9,5,BROWN,2);p.poly([[7,1],[14,5],[11,10],[4,6]],c.blade);p.line(7,1,14,5,c.edge);p.line(11,10,14,5,shade(c.blade,.7))}
  if(kd==='axe'){p.line(4,14,9,3,BROWN,2);p.poly([[8,1],[14,1],[14,8],[9,7]],c.blade)}
  if(kd==='bow'){for(let y=1;y<=14;y++)p.set(5+Math.round(5*Math.sin(Math.PI*(y-1)/13)),y,BROWN);p.line(5,1,5,14,CREAM)}
  if(kd==='crossbow'){p.rect(2,7,12,2,BROWN);p.rect(3,9,2,4,BROWN2);p.line(11,1,12,7,METAL2,2);p.line(12,8,11,14,METAL2,2);p.line(11,2,6,7,'#f3ecd8');p.line(6,8,11,13,'#f3ecd8');p.line(5,6,14,6,'#c9b98f');p.set(14,6,METAL)}
  if(kd==='whip'){p.ring(7,8,5,'#9a3a72');p.ring(7,8,3,'#9a3a72');p.rect(11,11,3,3,BROWN2)}
  if(kd==='chain'){for(let i=0;i<10;i+=2)p.set(2+i,12-i*.6,METAL2);p.poly([[11,2],[15,1],[13,7]],c.blade)}
  if(kd==='fan'){p.poly([[3,13],[2,4],[8,1],[14,4],[13,13]],CREAM);for(let i=0;i<5;i++)p.line(8,14,2+i*3,3+(i%4===0?1:0),INK);p.rect(7,13,2,2,RED)}
  if(kd==='umbrella'){p.ell(8,7,7,4,'#e58fb0',(x,y)=>y<=7);p.line(8,7,8,14,BROWN);p.set(7,14,BROWN)}
  if(kd==='talisman'){p.rect(4,1,7,14,'#f1d97a');p.line(7,3,7,11,RED);p.rect(6,5,3,1,RED);p.ell(12,12,2.6,2.6,c.el)}
  if(kd==='staff'){if(w.r[1]>1){p.line(3,14,11,4,BROWN,2);p.ell(12,3,2.6,2.6,'#c58aff');p.set(12,2,'#ffffff')}else{p.line(3,14,10,5,BROWN,2);p.ring(11,4,2.6,BROWN);p.set(13,6,BROWN);p.ell(10,5,1.2,1.2,'#c58aff')}}
  if(kd==='spirit'){p.ell(8,8,5,5,w.tint==='mend'?'#7ad6ff':JADE);p.ell(6.5,6.5,1.5,1.5,'#e9fff5')}
  if(kd==='scroll'){p.rect(3,4,10,8,'#e9dcb4');p.rect(3,4,10,1,'#cbb98a');p.ell(3,8,1.6,4.2,'#b89f68');p.ell(13,8,1.6,4.2,'#b89f68');p.line(5,7,11,7,'#8a7a5a');p.line(5,9,10,9,'#8a7a5a');p.rect(7,11,2,3,RED)}
  if(kd==='crest'){p.poly([[8,1],[12,5],[13,11],[3,11],[4,5]],GOLD);p.poly([[8,2],[10,5],[11,10],[8,10]],'#f3dc9a');p.rect(2,11,12,2,'#b8912f');p.ell(8,14,1.6,1.4,'#9fd8ff')}
  if(kd==='claw'){for(let i=0;i<3;i++)p.line(3+i*4,14,7+i*3,3,'#e8e2d0',1);p.line(3,14,13,14,'#8a7a5a')}
  if(kd==='pill'){p.ell(8,11,4.5,4,'#c98a3a');p.ell(8,5,2.6,2.4,'#c98a3a');p.rect(7,1,2,2,RED);p.set(6,10,'#f3d9a6')}
  if(['armor','cloak','boots','gauntlet'].includes(kd))gearArt(p,kd,w);
  if(w.thrown)p.set(1,1,GOLD);
  if(w.forge)for(let i=0;i<w.forge;i++)p.rect(13,1+i*3,2,2,'#ffe14a');
  p.outline(OUT);return p.url();
}
/* body-tag icons (wing, shell, paw, crown, wisp, leaf) for map badges, sheets and the effectiveness chart */
function tagArt_draw(t){const c='TAG|'+t;if(sprCache[c])return sprCache[c];const p=Px(16,16);
  if(t==='flier'){p.poly([[2,10],[6,4],[14,2],[11,6],[14,7],[9,9],[12,11],[6,12]],'#e8eef8');p.line(4,10,12,4,'#9aa8c0')}
  if(t==='armoured'){p.ell(8,9,6,5.5,'#9aa3b5');p.ell(8,8,4.4,4,'#c3cad6');p.line(4,9,12,9,'#6a7385');p.line(8,4,8,13,'#6a7385');p.set(6,6,'#eef2f8')}
  if(t==='beast'){p.ell(8,10,3.4,3,'#c9a070');for(const[x,y]of[[3.5,6],[6.5,4],[9.5,4],[12.5,6]])p.ell(x,y,1.6,1.8,'#c9a070')}
  if(t==='colossal'){p.poly([[2,12],[2,5],[5,8],[8,3],[11,8],[14,5],[14,12]],GOLD);p.rect(2,11,13,2,'#b8912f');p.set(8,7,RED);p.set(5,10,'#9fd8ff');p.set(11,10,'#9fd8ff')}
  if(t==='spectral'){p.ell(8,7,5,5,'#d8e0f0');p.poly([[3,8],[13,8],[13,14],[11,12],[9,14],[7,12],[5,14],[3,12]],'#d8e0f0');p.rect(6,6,1,2,INK);p.rect(9,6,1,2,INK)}
  if(t==='plant'){p.poly([[3,13],[4,6],[9,2],[13,3],[12,9],[7,12]],'#6ab04a');p.line(3,13,11,4,'#3f7a2a');p.line(6,9,9,10,'#3f7a2a');p.line(8,6,7,3,'#3f7a2a')}
  p.outline(OUT);return sprCache[c]=p.url()}
function mapWk(u){const i=u.items.findIndex(it=>WTYPES.includes(IT[it.k].t)||IT[it.k].t==='spirit');return i>=0?u.items[i].k:null}
function sprite(u,pose,wk){const k=[u.id,u.name,u.cls,u.team,pose,wk,u.sz||1,JSON.stringify(u.look)].join('|');return sprCache[k]||(sprCache[k]=fig(u.look,u.cls,u.team,pose,wk,u.sz))}
function portraitArt(L,cls,team,sz){return fig(L,cls,team,'idle',null,sz)}
function portrait(u){if(u.pic&&PICS[u.pic])return PICS[u.pic];const k='P|'+u.id+'|'+u.name+'|'+u.cls+'|'+u.team+'|'+JSON.stringify(u.look);return sprCache[k]||(sprCache[k]=portraitArt(u.look,u.cls,u.team,u.sz))}
function picOf(h){return h.pic&&PICS[h.pic]?PICS[h.pic]:portraitArt(h.look,h.cls,'p')}
function icon(k){const c='I|'+k;return sprCache[c]||(sprCache[c]=iconArt(k))}

/* ==================================================================
   BASE TERRAIN TILES (16px)
   ================================================================== */
/* bare=true: only the feature (no grass), so it can sit on any region's ground */
const OVER_T=['forest','hill','village','fort','chest','tent','cliff','crag'];
function tileArt_draw(kind,used,bare){
  const p=Px(16,16),o=Px(16,16),G='#4b5244',G2='#3e4439',G3='#5c6453';
  if(!bare)p.rect(0,0,16,16,G);if(!bare)[[2,3],[9,2],[13,6],[4,12],[11,13],[7,8],[14,11]].forEach(([x,y])=>{p.set(x,y,G2);p.set(x+1,y-1,G3)});
  if(kind==='forest'){[[4,15],[11,14]].forEach(([x,b])=>{const D='#2e2a2c',D2='#4a423d';o.line(x,b,x,4,D,2);o.line(x,8,x-3,4,D);o.line(x-3,4,x-4,1,D);o.line(x+1,6,x+4,2,D2);o.line(x+4,2,x+5,0,D2);o.line(x,4,x+1,0,D)})}
  if(kind==='hill'){o.poly([[0,16],[5,3],[10,16]],'#77736e');o.poly([[6,16],[11,5],[16,16]],'#8f8a83');o.line(5,3,3,9,'#b5b0a6');o.line(11,5,9,10,'#c4beb3');o.rect(4,3,2,1,'#e8e4dc');o.rect(10,5,2,1,'#e8e4dc')}
  if(kind==='village'){o.rect(3,9,10,6,used?'#a9a39a':'#e3d6b6');o.poly([[0,9],[2,6],[14,6],[16,9],[13,8],[3,8]],used?'#55545a':'#33394a');o.rect(2,5,12,1,used?'#6a6a70':'#4a5266');o.rect(7,11,2,4,used?'#555':RED);o.rect(4,10,2,2,used?'#666':'#f4d36a');o.rect(10,10,2,2,used?'#666':'#f4d36a')}
  if(kind==='fort'){o.rect(1,12,14,3,'#6f6c74');o.rect(2,4,3,8,'#8c8a90');o.rect(11,7,3,5,'#8c8a90');o.rect(2,3,5,1,'#a5a2aa');o.rect(5,10,6,2,'#55525a');o.ell(8,6,1.8,1.8,'#9fd8ff')}
  if(kind==='chest'){if(used){o.rect(4,4,8,3,'#b5413a');o.rect(4,8,8,5,'#8a2a26');o.rect(5,8,6,2,'#24160c');o.rect(4,10,8,1,GOLD)}else{o.rect(4,7,8,6,'#8a2a26');o.rect(4,7,8,2,'#b5413a');o.rect(4,9,8,1,GOLD);o.rect(7,9,2,2,GOLD)}}
  if(kind==='shellwall'){p.rect(0,0,16,16,'#d9c3b4');o.ell(8,8,7.2,7.2,'#ecc9d8');o.ring(8,8,5.4,'#c99fb5');o.ring(9,8,3.4,'#c99fb5');o.ring(9.4,8.3,1.6,'#b07f9c');o.line(1,13,15,13,'#e3b9cc')}
  if(kind==='shellfloor'){p.rect(0,0,16,16,'#f1e6da');p.ring(0,16,9,'#e6d2dc');p.ring(16,0,9,'#d9e4ea');p.ring(0,16,5,'#ead9e2');p.set(8,8,'#ffffff');p.set(3,4,'#ffffff');p.set(12,11,'#ffffff')}
  if(kind==='tent'){o.poly([[1,14],[8,2],[15,14]],'#8a7a5a');o.poly([[8,2],[11,14],[5,14]],'#5a4a34');o.line(8,2,8,14,'#3a2e20')}
  if(kind==='crag'){/* volcanic crag: dark basalt peaks with glowing seams */o.poly([[0,16],[4,4],[8,9],[11,2],[16,16]],'#2e2428');o.poly([[4,4],[8,9],[6,16],[1,16]],'#3e3236');o.line(11,2,9,9,'#4a3c40');o.line(10,9,12,14,'#ff7a2a');o.set(5,11,'#ff9a3c');o.set(11,3,'#6a5a5e');o.set(4,5,'#6a5a5e')}
  if(kind==='cliff'){o.poly([[0,16],[3,2],[7,6],[10,0],[14,7],[16,16]],'#3e3a44');o.line(3,2,5,10,'#5a5562');o.line(10,0,11,8,'#5a5562')}
  o.outline('#1a2414');for(let i=0;i<256;i++)if(o.g[i])p.g[i]=o.g[i];
  return p.url();
}
const texStyle=document.createElement('style');
texStyle.textContent=`.t-fort{background:url(${tileArt('fort')}) 0 0/100% 100%;box-shadow:none}.t-plain{background:url(${tileArt('plain')}) 0 0/100% 100%}.t-forest{background:url(${tileArt('forest')}) 0 0/100% 100%}.t-hill{background:url(${tileArt('hill')}) 0 0/100% 100%}.t-village{background:url(${tileArt('village')}) 0 0/100% 100%}.t-village.vis{background:url(${tileArt('village',1)}) 0 0/100% 100%}.t-chest{background:url(${tileArt('chest')}) 0 0/100% 100%}.t-chest.vis{background:url(${tileArt('chest',1)}) 0 0/100% 100%}`;
/* features drawn over the region's own ground (see buildBoard): no green grass under a chest in a cave */
texStyle.textContent+=OVER_T.map(k=>`.tile.ov-${k}::before{inset:0;background:url(${tileArt(k,0,true)}) 0 0/100% 100%}`).join('')+`.tile.ov-village.vis::before{background-image:url(${tileArt('village',1,true)})}.tile.ov-chest.vis::before{background-image:url(${tileArt('chest',1,true)})}`;
texStyle.textContent+=`.board.bright .t-wall{background:url(${tileArt('shellwall')}) 0 0/100% 100%;filter:none}.board.bright .t-floor{background:url(${tileArt('shellfloor')}) 0 0/100% 100%;filter:none}.t-tent{background:url(${tileArt('tent')}) 0 0/100% 100%}.t-cliff{background:url(${tileArt('cliff')}) 0 0/100% 100%}`;
document.body.appendChild(texStyle);

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function iconArt(k){return art('icons/'+String(k).split('~')[0],()=>iconArt_draw(k))}
function tagArt(t){return art('tags/'+t,()=>tagArt_draw(t))}
function tileArt(kind,used,bare){return art('tiles/'+kind+(used?'-used':'')+(bare?'-bare':''),()=>tileArt_draw(kind,used,bare))}
