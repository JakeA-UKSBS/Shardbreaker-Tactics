/* Flying Ship tiles */
/* ================= SHIP ART ================= */
/* The ship is drawn under transparent deck/hull/mast tiles, built from the map letters: d deck, h hull, M mast, H helm. */
function shipArt_draw(wreck){
  const S=16,p=Px(MW*S,MH*S),isShip=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&'dMhH'.includes(MAP[y][x]),hs=(x,y)=>((x*73856093)^(y*19349663))>>>0;
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(MAP[y][x]==='~'&&hs(x,y)%4===0)p.ell(x*S+6+hs(x,y)%5,y*S+9,6+hs(x,y)%4,2.6,'rgba(225,232,245,.35)');
  const mastRows=MAP.map((r,y)=>r.includes('M')?y:-1).filter(y=>y>=0);
  if(!wreck&&mastRows.length){for(let y=mastRows[0];y<=mastRows.at(-1)+1&&y<MH;y++){const row=MAP[y],a=row.search(/[dMhH]/);if(a<0)continue;let b=a;for(let x=a;x<row.length;x++)if('dMhH'.includes(row[x]))b=x;
    const L=a*S,R=(b+1)*S,lenL=Math.min(2*S,L),lenR=Math.min(2*S,MW*S-R);
    for(let k=0;k<4;k++){const yy=y*S+2+k*4,c=k%2?'#8a5a34':'#b07a42';p.line(L-1,yy,L-lenL+k*3,yy-5+k,c,2);p.line(R,yy,R+lenR-1-k*3,yy-5+k,c,2)}}}
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=MAP[y][x];if(!'dMhH'.includes(c))continue;const X=x*S,Y=y*S;
    if(c==='h'){p.rect(X,Y,S,S,wreck?'#4e3220':'#6b4325');for(let j=3;j<S;j+=5)p.rect(X,Y+j,S,1,'#3a2414');if(hs(x,y)%3===0)p.ell(X+8,Y+8,2.2,2.2,wreck?'#2a1a10':'#9fd8ff')}
    else{p.rect(X,Y,S,S,wreck?'#7a5534':'#9a6a3e');for(let j=0;j<S;j+=4)p.rect(X,Y+j,S,1,wreck?'#5c3e24':'#7a5230');p.set(X+hs(x,y)%12+2,Y+2,'#4a2d16');if(wreck&&hs(x,y)%4===0)p.rect(X+3,Y+5,6,3,'#2a1a10')}
    for(const[dx,dy]of DIRS)if(!isShip(x+dx,y+dy)){if(dx===1)p.rect(X+S-2,Y,2,S,'#3d2512');if(dx===-1)p.rect(X,Y,2,S,'#3d2512');if(dy===1)p.rect(X,Y+S-2,S,2,'#3d2512');if(dy===-1)p.rect(X,Y,S,2,'#3d2512')}
    if(c==='H'){/* the ship's wheel: eight spokes with handles, a thick wooden rim and a brass hub, on a small post */
      const cx=X+8,cy=Y+7;p.ell(cx,Y+13,5,1.6,'#4a2e1a');p.rect(cx-1,cy+3,3,6,'#5a3a22');
      for(let k=0;k<8;k++){const a=k*Math.PI/4,ex=cx+Math.cos(a)*7,ey=cy+Math.sin(a)*7;p.line(cx,cy,Math.round(ex),Math.round(ey),'#7a5230');p.set(Math.round(ex),Math.round(ey),'#e0b878')}
      p.ring(cx,cy,5,'#4a2e1a');p.ring(cx,cy,4.4,'#c99a5a');p.ring(cx,cy,3.8,'#8a5a32');p.ell(cx,cy,1.8,1.8,GOLD);p.set(cx,cy,'#8a6a20');p.set(cx-1,cy-1,'#fff0b0')}}
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(MAP[y][x]==='M'){const X=x*S+8,Y=y*S+8,w=22,sy=Y-15;
    p.ell(X,Y,4,4,'#5a3a20');p.ell(X,Y,2,2,'#3a2414');
    if(wreck)p.poly([[X-w,sy],[X+w*.5,sy+2],[X+w*.1,sy+9],[X-w*.4,sy+7],[X-w*.7,sy+13]],'#b9ad8e');
    else{p.poly([[X-w,sy],[X+w,sy],[X+w-3,sy+13],[X-w+3,sy+13]],'#efe6cf');p.rect(X-w,sy,2*w,2,'#c9b98f');p.rect(X-w+3,sy+11,2*w-6,2,'#c9b98f');p.ell(X,sy+6,2.5,2.5,'#9fd8ff')}}
  return p.url();
}
function shipSideArt_draw(){const p=Px(120,72);
  p.poly([[10,44],[110,44],[100,60],[22,60]],'#7a5230');p.rect(12,44,98,4,'#5a3a20');for(let x=20;x<100;x+=10)p.rect(x,50,2,8,'#4f331d');
  [30,60,88].forEach(x=>p.ell(x,54,2,2,'#9fd8ff'));
  p.poly([[108,44],[118,34],[116,46],[106,52]],'#7a5230');p.ell(118,33,2,2,GOLD);p.poly([[12,44],[4,32],[12,35],[17,44]],'#6b4325');
  [[35,10],[60,3],[85,10]].forEach(([x,t])=>{p.rect(x,t,2,41,'#4f331d');for(let k=0;k<3;k++){const y=t+3+k*12,w=14-k*2;p.poly([[x-w,y],[x+w+2,y],[x+w,y+10],[x-w+2,y+10]],CREAM);p.rect(x-w,y,2*w+2,1,'#c9b98f')}});
  p.outline(OUT);return p.url()}
function shipWingArt_draw(){const p=Px(120,72);for(let k=0;k<6;k++){p.line(42,46,4+k*3,18+k*5,k%2?'#8a5a34':'#b07a42',3);p.line(78,46,114-k*3,18+k*5,k%2?'#8a5a34':'#b07a42',3)}p.outline(OUT);return p.url()}

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function shipArt(wreck){return art('ship/ship'+(wreck?'-wreck':''),()=>shipArt_draw(wreck))}
function shipSideArt(){return art('ship/side',()=>shipSideArt_draw())}
function shipWingArt(){return art('ship/wing',()=>shipWingArt_draw())}
