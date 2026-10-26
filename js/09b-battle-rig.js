/* High-res units: every generated unit (G.* classes) is drawn from body parts (legs, torso, arms, head, hair, gear,
   weapon, mount) at a higher resolution than the 32px monster art. The same drawing makes the map sprite (64x64, idle)
   and the battle frames (96x96, posed and animated), so a unit looks the same everywhere.
   Poses are joint angles in degrees (0 = right, 90 = down, -90 = up). bx/by shift the body, lean tips the torso forward,
   arm/fore = weapon arm (upper arm, forearm), wpn = weapon angle, back/backFore = the other arm, step = front foot. */
const isHi=(cls,sz)=>!sz&&typeof cls==='string'&&cls.startsWith('G.');

/* ==================================================================
   POSES
   Every pose set has the same frames: idle (2 breathing frames), windup,
   critup (the bigger wind-up before a crit), swing (the hit lands),
   follow (follow-through), hit (recoil when struck) and dodge.
   Extra flags: draw = bowstring pulled back, glow = magic glow at the hand
   (1 small, 2 big), flap = wing/mane flap and mount head-bob.
   ================================================================== */
/* P0 is the neutral stance every pose starts from */
const P0={bx:0,by:0,lean:0,arm:70,fore:40,wpn:-75,back:105,backFore:95,step:0,spread:4,tilt:0,flap:0};
const pose=o=>Object.assign({},P0,o);
const POSES={

  /* ============================================================
     HEAVY: axes, halberds, hammers, greatswords. Big overhead chop.
     ============================================================ */
  heavy:{idle:[pose({}),pose({by:1,wpn:-72,flap:1})],
    windup:pose({lean:-4,arm:-100,fore:-125,wpn:-150,back:130,step:-2}),
    critup:pose({lean:-3,by:-4,arm:-95,fore:-105,wpn:-100,back:-100,backFore:-95,step:-3,spread:6}),
    swing:pose({bx:3,lean:6,arm:25,fore:45,wpn:40,back:55,backFore:40,step:6,spread:7,flap:1}),
    follow:pose({bx:4,lean:7,arm:70,fore:95,wpn:120,back:80,backFore:90,step:6,spread:7}),
    hit:pose({bx:-3,lean:-6,arm:85,fore:70,wpn:-40,back:80,tilt:-2}),
    dodge:pose({bx:-6,lean:-7,arm:40,fore:-20,wpn:-80,back:60,step:-5,spread:2})},

  /* ============================================================
     BLADE: swords, scimitars, twin blades. Raised slash across the body.
     ============================================================ */
  blade:{idle:[pose({arm:40,fore:10,wpn:-35}),pose({by:1,arm:42,fore:12,wpn:-33,flap:1})],
    windup:pose({lean:-3,arm:-80,fore:-100,wpn:-160,back:140,step:-1}),
    critup:pose({lean:-3,by:-3,arm:-100,fore:-115,wpn:-95,back:-110,backFore:-100,step:-2,spread:6}),
    swing:pose({bx:4,lean:6,arm:5,fore:10,wpn:15,back:160,backFore:175,step:7,spread:8,flap:1}),
    follow:pose({bx:5,lean:7,arm:50,fore:70,wpn:95,back:150,step:7,spread:8}),
    hit:pose({bx:-3,lean:-6,arm:70,fore:40,wpn:-20,back:80,tilt:-2}),
    dodge:pose({bx:-7,lean:-8,arm:20,fore:-30,wpn:-60,back:50,step:-6,spread:2})},

  /* ============================================================
     THRUST: spears, javelins, rapiers. Pull back, then a straight lunge.
     ============================================================ */
  thrust:{idle:[pose({arm:75,fore:-20,wpn:-82}),pose({by:1,arm:76,fore:-18,wpn:-81,flap:1})],
    windup:pose({bx:-2,lean:-4,arm:135,fore:0,wpn:-4,back:40,backFore:10,step:-2}),
    critup:pose({bx:-3,lean:-5,by:-2,arm:150,fore:-10,wpn:-12,back:30,backFore:0,step:-3,spread:6}),
    swing:pose({bx:5,lean:6,arm:0,fore:0,wpn:0,back:20,backFore:10,step:7,spread:8,flap:1}),
    follow:pose({bx:5,lean:6,arm:8,fore:6,wpn:6,back:40,backFore:30,step:7,spread:8}),
    hit:pose({bx:-3,lean:-6,arm:80,fore:-10,wpn:-60,back:80,tilt:-2}),
    dodge:pose({bx:-7,lean:-8,arm:60,fore:-30,wpn:-75,back:50,step:-6,spread:2})},

  /* ============================================================
     DAGGER: daggers, twin daggers, whips, chains. A quick low stab.
     ============================================================ */
  dagger:{idle:[pose({arm:70,fore:20,wpn:10}),pose({by:1,arm:72,fore:22,wpn:12,flap:1})],
    windup:pose({lean:-2,arm:120,fore:60,wpn:-30,back:30,backFore:-20,step:-1}),
    critup:pose({lean:-3,by:-3,arm:-70,fore:-90,wpn:80,back:40,backFore:-30,step:-2,spread:6}),
    swing:pose({bx:6,lean:8,arm:-5,fore:0,wpn:0,back:150,backFore:170,step:8,spread:8,flap:1}),
    follow:pose({bx:6,lean:8,arm:20,fore:30,wpn:30,back:140,step:8,spread:8}),
    hit:pose({bx:-3,lean:-6,arm:80,fore:50,wpn:20,back:80,tilt:-2}),
    dodge:pose({bx:-8,lean:-8,arm:40,fore:0,wpn:0,back:50,step:-6,spread:2})},

  /* ============================================================
     BOW: bows and crossbows. windup draws the string, swing releases.
     ============================================================ */
  bow:{idle:[pose({arm:75,fore:55,wpn:65}),pose({by:1,arm:76,fore:56,wpn:66,flap:1})],
    windup:pose({lean:-1,arm:0,fore:0,wpn:0,back:5,backFore:178,draw:1}),
    critup:pose({lean:-2,by:-2,arm:-8,fore:-8,wpn:-8,back:-3,backFore:172,draw:1,spread:6}),
    swing:pose({lean:-1,arm:0,fore:0,wpn:0,back:165,backFore:175,flap:1}),
    follow:pose({lean:0,arm:3,fore:3,wpn:3,back:150,backFore:160}),
    hit:pose({bx:-3,lean:-6,arm:80,fore:60,wpn:60,back:80,tilt:-2}),
    dodge:pose({bx:-7,lean:-8,arm:50,fore:30,wpn:40,back:50,step:-6,spread:2})},

  /* ============================================================
     CAST: sigils, staves, charms, orbs, fans. Raise the hand, then throw
     the spell forward; glow grows on the wind-up and peaks on release.
     ============================================================ */
  cast:{idle:[pose({arm:70,fore:25,wpn:-70}),pose({by:1,arm:71,fore:24,wpn:-71,flap:1})],
    windup:pose({lean:-3,arm:-60,fore:-85,wpn:-90,back:120,step:-1,glow:1}),
    critup:pose({lean:-3,by:-3,arm:-95,fore:-95,wpn:-90,back:-100,backFore:-95,step:-2,spread:6,glow:2}),
    swing:pose({bx:3,lean:4,arm:-12,fore:-8,wpn:-40,back:150,backFore:170,step:5,spread:7,glow:2,flap:1}),
    follow:pose({bx:3,lean:4,arm:5,fore:5,wpn:-30,back:140,step:5,spread:7,glow:1}),
    hit:pose({bx:-3,lean:-6,arm:80,fore:40,wpn:-50,back:80,tilt:-2}),
    dodge:pose({bx:-7,lean:-8,arm:50,fore:10,wpn:-60,back:50,step:-6,spread:2})}
};

/* which pose set each weapon kind uses */
const KIND_POSE={hammer:'heavy',axe:'heavy',halberd:'heavy',greatsword:'heavy',sword:'blade',scimitar:'blade',twin:'blade',spear:'thrust',javelin:'thrust',rapier:'thrust',
  dagger:'dagger',twindagger:'dagger',bow:'bow',crossbow:'bow',talisman:'cast',staff:'cast',spirit:'cast',orb:'cast',fan:'cast',whip:'dagger',chain:'dagger',umbrella:'thrust'};
/* frame timings for an attack and a crit: [pose, ms, does the hit land on this frame?] */
const STRIPS={attack:[['windup',150],['swing',90,true],['follow',220]],crit:[['critup',260],['swing',80,true],['follow',260]]};

/* draw one unit. W = canvas size (64 map, 96 battle); the hip sits at (hx,hy) */

/* ==================================================================
   DRAWING A UNIT
   hiArt() draws one frame back to front: mount, cape and back hair, legs,
   back arm (shield or off-hand weapon), torso, shield, head (face, hair,
   gear), then the weapon arm and the weapon itself.
   W = canvas size: 64 for the map sprite, 96 for battle frames.
   ================================================================== */
function hiArt(L,cls,team,wk,name,i,W){
  L=L||{};const w=wk?IT[wk]:null,kind=w?w.kind:'none',ps=POSES[KIND_POSE[kind]||'blade'],P=name==='idle'?ps.idle[i||0]:(ps[name]||ps.idle[0]);
  const C=CLS[cls]||{},[,role,mv]=cls.split('.'),body=C.body||'tunic',TC=TEAMC[team]||TEAMC.p,mnt=mv==='mounted',fly=mv==='flying',seat=mnt||fly;
  const p=Px(W,W),big=W>64,X0=big?38:26,Y0=big?62:39;
  const sk=L.skin||SKIN,sk2=shade(sk,.82),hair=L.hair||'#3a2a1a',hair2=shade(hair,.7),hair3=shade(hair,1.25),cl=L.cloth||TC.a,cl2=shade(cl,.72),cl3=shade(cl,1.2),sash=L.sash||GOLD,inner=TC.s||CREAM,
    boot='#2a1e18',pants=body==='vest'?'#4a3a2a':body==='armor'?METAL2:shade(cl,.55),c=wcol(w),t2=C.tier===2,fem=!!L.fem;
  const pt=(x,y,a,l)=>[x+Math.cos(a*Math.PI/180)*l,y+Math.sin(a*Math.PI/180)*l];
  const limb=(a,b,col,t)=>p.line(Math.round(a[0]-(t>2?1:0)),Math.round(a[1]-(t>2?1:0)),Math.round(b[0]-(t>2?1:0)),Math.round(b[1]-(t>2?1:0)),col,t);
  const lift=fly?-3+(P.flap?1:0):0,hx=X0+P.bx,hy=Y0+P.by+lift+(seat?2:0),nx=hx+P.lean,ny=hy-17,head=[nx+1+P.tilt,ny-7],FT=Y0+22;
  /* ---- mount (behind the rider) ---- */
  const mc=L.horse||'#7a5230',mc2=shade(mc,.72),mc3=shade(mc,1.18),wy=L.mount==='wyvern',peg=L.mount==='pegasus',mane=peg?'#e8e2d0':shade(mc,.45),bxH=X0+P.bx,byH=Y0+lift;
  const wing=(far)=>{const up=P.flap?-4:0,base=[bxH-2,byH+3],col=far?shade(wy?shade(mc,.85):'#ffffff',.75):wy?shade(mc,.85):'#ffffff',edge=wy?shade(mc,.55):'#b9c4d6';
    if(wy){const tip=[bxH-26,byH-24+up],m1=[bxH-16,byH-18+up],m2=[bxH-6,byH-22+up];p.poly([base,tip,[bxH-22,byH-8+up],m1,[bxH-11,byH-5],m2,[bxH+4,byH-3],[bxH+6,byH+4]],col);limb(base,tip,edge,1);limb(base,m1,edge,1);limb(base,m2,edge,1)}
    else{for(let k=0;k<6;k++){const a=-158+k*13+(P.flap?-8:0),e=pt(...base,a,27-k*2);p.poly([base,e,pt(...base,a+11,22-k*2)],col);limb(pt(...base,a,5),e,edge,1)}}};
  if(fly)wing(true);
  if(seat){
    /* the mount moves with the pose: rears on the wind-up, gallops (legs stretched) on the strike, bobs its head at idle */
    const rearUp=/windup|critup/.test(name),gal=/swing|follow/.test(name),bob=name==='idle'&&P.flap?1:0;
    const leg=(x,dark,front)=>{const col=dark?mc2:mc,y0=byH+10,lift=(front&&rearUp?5:0)+(fly?3:0),dx=gal?(front?3:-3):front&&rearUp?3:0,f=[x+1+dx,FT-1-lift];
      p.line(x+1,y0,Math.round(f[0]),Math.round(f[1])-2,col,3);p.rect(Math.round(f[0]),Math.round(f[1])-1,3,2,wy?shade(mc,.5):INK)};
    if(wy){/* wyvern: long body, thick hind legs, tail, neck and horned head */
      p.poly([[bxH-12,byH+4],[bxH-26,byH+10],[bxH-30,byH+16],[bxH-20,byH+12],[bxH-10,byH+10]],mc2);
      p.ell(bxH+1,byH+6,15,6.5,mc);p.ell(bxH+1,byH+9,12,3,shade(mc,1.25));leg(bxH-6,true,false);leg(bxH+4,false,false);p.rect(bxH+3,byH+8,5,7,mc);
      p.poly([[bxH+11,byH+3],[bxH+22,byH-12],[bxH+26,byH-10],[bxH+16,byH+6]],mc);p.ell(bxH+27,byH-13,6.5,4,mc);p.poly([[bxH+30,byH-15],[bxH+37,byH-12],[bxH+30,byH-9]],mc);
      p.line(bxH+23,byH-16,bxH+19,byH-22,'#e8e2d0');p.line(bxH+26,byH-16,bxH+25,byH-23,'#e8e2d0');p.set(bxH+29,byH-14,'#ffd23f');
      for(let k=0;k<4;k++)p.set(bxH+13+k*2,byH-2-k*3,mc3)}
    else{/* horse or pegasus: long body under the rider, neck and head well forward */
      const B=bxH-1,Y=byH,hY=(rearUp?-3:gal?1:0)+bob;p.poly([[B-15,Y+2],[B-21,Y+8],[B-20,Y+16],[B-17,Y+16],[B-15,Y+8]],mane);
      leg(B-14,true,false);leg(B+9,true,true);p.ell(B,Y+6,17,7,mc);p.ell(B+12,Y+4,6,6,mc);p.line(B-12,Y,B+8,Y-1,mc3);p.line(B-10,Y+12,B+8,Y+12,mc2);leg(B-11,false,false);leg(B+13,false,true);
      p.poly([[B+12,Y+3],[B+18,Y-11+hY],[B+24,Y-12+hY],[B+21,Y+5]],mc);p.ell(B+25,Y-12+hY,6.5,4,mc);p.ell(B+30,Y-9+hY,3.4,3,mc);p.set(B+32,Y-9+hY,INK);
      p.poly([[B+20,Y-15+hY],[B+21,Y-20+hY],[B+23,Y-15+hY]],mc2);p.line(B+18,Y-13+hY,B+13,Y+2,mane,3);p.set(B+25,Y-13+hY,INK);p.line(B+28,Y-7+hY,B+20,Y,BROWN2);p.line(B+20,Y,B+5,Y-1,BROWN2)}
    /* saddle cloth */p.poly([[hx-8,hy-1],[hx+7,hy-1],[hx+6,hy+6],[hx-7,hy+6]],TC.a);p.rect(hx-8,hy-1,15,1,GOLD);p.rect(hx-7,hy+5,13,1,shade(TC.a,.7));
    if(fly)wing(false);
  }
  /* ---- cape and back hair (behind the body) ---- */
  if(L.cape||t2){const cc=shade(TC.A,1),cc2=shade(TC.A,.8);p.poly([[nx-8,ny+1],[nx+1,ny+1],[hx-2,seat?hy+4:hy+14],[hx-12+P.bx*-.3,seat?hy+6:hy+19],[nx-12,ny+12]],cc);p.line(nx-6,ny+3,hx-9,seat?hy+5:hy+17,cc2)}
  if(L.gear!=='helm'&&L.gear!=='hood'&&L.gear!=='veil'){
    if(L.style==='long')p.poly([[head[0]-7,head[1]-3],[head[0]-2,head[1]-3],[head[0]-2,head[1]+10],[head[0]-8,head[1]+12]],hair2);
    if(L.style==='tail'){limb([head[0]-5,head[1]-4],[head[0]-10,head[1]+2],hair2,3);limb([head[0]-10,head[1]+2],[head[0]-10,head[1]+9],hair2,2)}}
  /* ---- legs ---- */
  if(seat){/* the near leg hangs over the saddle */const kn=[hx+6,hy+3],ft=[hx+5,hy+10];limb([hx,hy-1],kn,pants,5);limb(kn,ft,pants,4);p.rect(Math.round(ft[0])-2,Math.round(ft[1]),7,3,body==='armor'?METAL:boot)}
  else if(body==='robe'){const sf=P.step;p.rect(hx-4+sf*.3,FT-2,6,3,boot);p.rect(hx+3+sf,FT-2,6,3,boot);
    p.poly([[hx-7,hy],[hx+7,hy],[hx+10+sf,FT-1],[hx-10,FT-1]],cl);p.poly([[hx-7,hy],[hx-3,hy],[hx-5,FT-1],[hx-10,FT-1]],cl2);p.line(hx+3,hy+1,hx+5+sf*.6,FT-2,shade(cl,.6));p.rect(hx-9,FT-2,19+sf,1,inner)}
  else{const bf=[hx-P.spread+P.bx*.3,FT],ff=[hx+P.spread+P.step,FT],bk=[(hx+bf[0])/2-2,hy+11],fk=[(hx+ff[0])/2+2,hy+11],bt=body==='armor'?METAL2:boot;
    limb([hx-2,hy],bk,shade(pants,.8),5);limb(bk,bf,shade(pants,.8),4);p.rect(Math.round(bf[0])-3,FT-2,7,3,bt);
    limb([hx+1,hy],fk,pants,5);limb(fk,ff,pants,4);p.rect(Math.round(ff[0])-2,FT-2,8,3,bt);
    if(body==='armor'){limb(fk,[fk[0]+1,fk[1]+8],METAL,3);p.ell(fk[0],fk[1],2.4,2,METAL)}}
  /* ---- back arm (behind the torso), with a shield or a second weapon ---- */
  const sb=[nx-5,ny+3],eb=pt(...sb,P.back,8),hb=pt(...eb,P.backFore,7),sleeve=body==='vest'?sk2:body==='armor'?METAL2:cl2;
  limb(sb,eb,sleeve,4);limb(eb,hb,body==='armor'?METAL2:sk2,3);p.ell(hb[0],hb[1],2,2,sk2);
  if(kind==='twin'||kind==='twindagger'){const a=P.backFore-30;limb(hb,pt(...hb,a,kind==='twin'?14:8),c.blade,2);limb(pt(...hb,a+90,2),pt(...hb,a-90,2),c.hilt,1)}
  /* ---- torso ---- */
  const sh=fem?8:9;
  if(body==='armor'){p.poly([[hx-7,hy+1],[hx+7,hy+1],[nx+sh+1,ny+1],[nx-sh-1,ny+1]],METAL);p.poly([[hx-7,hy+1],[hx-3,hy+1],[nx-5,ny+1],[nx-sh-1,ny+1]],METAL2);
    for(let k=4;k<15;k+=4)p.line(Math.round(nx-sh+k*.1),ny+k,Math.round(nx+sh-k*.1),ny+k,METAL2);p.rect(nx-2,ny+5,4,4,t2?GOLD:cl);
    if(!seat){p.poly([[hx-8,hy],[hx+8,hy],[hx+9,hy+6],[hx-9,hy+6]],cl);for(let x=hx-7;x<hx+8;x+=4)p.line(x,hy+1,x,hy+5,cl2)}
    p.ell(nx-8,ny+3,4,3,METAL2);p.ell(nx+8,ny+3,4,3,METAL);if(t2){p.rect(nx+5,ny+1,6,1,GOLD);p.rect(nx-11,ny+1,6,1,GOLD)}}
  else{p.poly([[hx-7,hy+1],[hx+7,hy+1],[nx+sh,ny+1],[nx-sh,ny+1]],cl);p.poly([[hx-7,hy+1],[hx-3,hy+1],[nx-5,ny+1],[nx-sh,ny+1]],cl2);p.ell(nx-8,ny+3,3,2.5,cl2);p.ell(nx+8,ny+3,3,2.5,cl);
    if(body==='vest'){p.poly([[hx-3,hy-2],[hx+4,hy-2],[nx+4,ny+2],[nx-2,ny+2]],sk);p.line(nx+1,ny+4,hx+1,hy-4,sk2);p.line(nx-1,ny+8,nx+3,ny+8,sk2)}
    else{p.poly([[nx-2,ny+1],[nx+4,ny+1],[nx+1,ny+6]],inner);p.line(nx+3,ny+6,hx+3,hy-1,cl3)}
    if(fem&&body!=='vest')p.line(nx+1,ny+7,nx+6,ny+7,cl2);
    if(body==='tunic'&&!seat){p.poly([[hx-7,hy+1],[hx+7,hy+1],[hx+9+P.step*.3,hy+8],[hx-9,hy+8]],cl);p.line(hx-8,hy+7,hx+8,hy+7,cl2)}
    if(t2){p.ell(nx+8,ny+2,3,1.5,GOLD);p.ell(nx-8,ny+2,3,1.5,shade(GOLD,.8))}}
  if(L.apron){p.rect(hx-5,ny+7,10,hy-ny+3,'#e8e2d0');p.rect(hx-5,ny+7,10,1,'#c9c3b8')}
  p.rect(hx-7,hy-3,14,3,body==='armor'?BROWN2:sash);p.rect(hx-1,hy-3,3,3,t2?GOLD:shade(sash,.7));
  /* ---- shield on the back arm, in front of the body ---- */
  if(L.shield){const s=[Math.round(hb[0])+2,Math.round(hb[1])-2],sc=TC.A,rim=METAL2;
    if(L.shield==='round'){p.ell(s[0],s[1],6,6.5,rim);p.ell(s[0],s[1],4.8,5.3,sc);p.ell(s[0],s[1],1.6,1.6,GOLD);p.line(s[0]-3,s[1]-3,s[0]-1,s[1]-4,shade(sc,1.4))}
    else{p.poly([[s[0]-6,s[1]-7],[s[0]+6,s[1]-7],[s[0]+6,s[1]+2],[s[0],s[1]+9],[s[0]-6,s[1]+2]],rim);p.poly([[s[0]-5,s[1]-6],[s[0]+5,s[1]-6],[s[0]+5,s[1]+2],[s[0],s[1]+7.5],[s[0]-5,s[1]+2]],sc);p.rect(s[0],s[1]-5,1,11,GOLD);p.rect(s[0]-3,s[1]-2,7,1,GOLD)}}
  /* ---- head: neck, hood back, face, hair, gear ---- */
  const[cx,cy]=head,hood=L.gear==='hood'||L.gear==='veil',hc=L.gear==='veil'?'#3a2a4a':shade(cl,.85);
  p.rect(nx-1,ny-2,4,4,sk2);
  if(hood){p.ell(cx-1,cy-1,7.6,8,hc);p.poly([[cx-8,cy+2],[cx+2,cy+4],[cx+4,cy+9],[cx-9,cy+9]],hc)}
  p.ell(cx,cy,6.2,6.8,sk);p.ell(cx-2,cy+1,3,4,sk2,(x,y)=>x<cx-2);p.rect(cx-3,cy,2,2,shade(sk,.75));
  const bare=!hood&&L.gear!=='helm'&&L.gear!=='douli';
  if(bare&&L.style!=='bald'){p.ell(cx-1,cy-3,6.8,5,hair,(x,y)=>y<=cy-2||x<cx-3);p.poly([[cx+1,cy-5],[cx+6,cy-4],[cx+5,cy-2],[cx+2,cy-3]],hair);p.line(cx-3,cy-7,cx+2,cy-7,hair3);
    if(L.style==='topknot'){p.ell(cx-1,cy-9,2.6,2.4,hair);p.rect(cx-2,cy-8,3,1,GOLD)}
    if(L.style==='bun')p.ell(cx-5,cy-6,2.8,2.6,hair);
    if(L.style==='tail')p.ell(cx-6,cy-4,2,2,hair);
    if(L.style==='wild'){p.poly([[cx-6,cy-4],[cx-10,cy-9],[cx-3,cy-6]],hair);p.poly([[cx-2,cy-7],[cx,cy-12],[cx+2,cy-7]],hair);p.poly([[cx+2,cy-6],[cx+6,cy-9],[cx+4,cy-4]],hair)}
    if(L.style==='long'||fem)p.rect(cx-6,cy-2,2,6,hair)}
  if(L.style==='bald'&&bare)p.set(cx-1,cy-5,'#fff3e0');
  /* face */const ey=L.eye||INK;p.rect(cx+2,cy-1,2,2,ey);p.set(cx+2,cy-1,'#ffffff');p.line(cx+1,cy-3,cx+3,cy-3,bare?hair2:shade(sk,.7));p.set(cx+6,cy+1,sk2);p.rect(cx+2,cy+3,fem?2:3,1,fem?'#c0606a':'#a8685a');
  if(fem){p.set(cx+4,cy-2,INK);p.set(cx+5,cy-1,ey)}
  if(L.beard){p.ell(cx+1,cy+4,4.4,2.6,hair);p.rect(cx+2,cy+3,2,1,'#a8685a')}
  const g=L.gear;
  if(g==='helm'){p.ell(cx,cy-3,7.4,5.6,METAL,(x,y)=>y<=cy-1);p.ell(cx+1,cy-5,4.4,3,'#e4e9f0',(x,y)=>y<=cy-3);p.rect(cx-7,cy-2,14,2,METAL2);p.rect(cx+4,cy-1,2,4,METAL2);p.rect(cx-7,cy-1,3,6,METAL2);
    p.poly([[cx-3,cy-8],[cx+1,cy-11],[cx+3,cy-8]],TC.A);p.line(cx-1,cy-10,cx-7,cy-13,TC.A,2)}
  if(g==='headband'){p.rect(cx-6,cy-4,13,2,TC.A);limb([cx-6,cy-3],[cx-11,cy+2],TC.A,1);limb([cx-6,cy-2],[cx-10,cy+4],TC.A,1)}
  if(g==='ribbon'){p.ell(cx-6,cy-4,2,1.6,TC.a);limb([cx-6,cy-3],[cx-10,cy+3],TC.a,1);limb([cx-6,cy-3],[cx-8,cy+5],TC.a,1)}
  if(g==='circlet'){p.rect(cx-6,cy-4,13,1,GOLD);p.rect(cx+3,cy-5,2,2,'#9fd8ff')}
  if(g==='hairpin'){limb([cx-8,cy-7],[cx-1,cy-9],GOLD,1);p.set(cx-1,cy-9,RED)}
  if(g==='guan'){p.rect(cx-3,cy-10,6,4,GOLD);p.rect(cx-2,cy-11,4,1,GOLD);limb([cx-8,cy-8],[cx+7,cy-9],JADE,1)}
  if(g==='cap'){const cc=shade(cl,.8);p.ell(cx,cy-4,7,4,cc,(x,y)=>y<=cy-3);p.rect(cx-6,cy-3,15,2,shade(cc,.8));limb([cx-2,cy-7],[cx-10,cy-13],CREAM,1);limb([cx-3,cy-7],[cx-11,cy-12],'#d8d0bc',1);p.set(cx-10,cy-13,RED)}
  if(g==='douli'){p.poly([[cx-12,cy-2],[cx+12,cy-2],[cx,cy-12]],'#c9a46a');limb([cx-8,cy-3],[cx,cy-11],'#a8844c',1);limb([cx+8,cy-3],[cx,cy-11],'#a8844c',1);p.rect(cx-11,cy-2,22,1,'#8a6a3c')}
  if(t2&&g!=='helm'&&g!=='douli'){p.rect(cx-3,cy-8,6,1,GOLD);p.set(cx,cy-9,'#9fd8ff')}
  /* ---- weapon arm and weapon ---- */
  const sf=[nx+5,ny+3],ef=pt(...sf,P.arm,9),hf=pt(...ef,P.fore,8),a=P.wpn;
  limb(sf,ef,body==='vest'?sk:body==='armor'?METAL:cl,5);limb(ef,hf,body==='armor'?METAL2:sk,4);
  drawHiWeapon(p,kind,w,c,hf,a,P,hb,pt,limb);
  p.ell(hf[0],hf[1],2,2,sk);
  p.outline(OUT);return p.url();
}

/* ==================================================================
   WEAPONS
   drawHiWeapon() draws the held weapon from the hand h along angle a.
   One branch per weapon kind: hammer · axe/halberd · greatsword · sword ·
   scimitar · rapier · dagger · spear/javelin · bow/crossbow · staff ·
   talisman (sigil) · spirit charm/orb · fan · whip/chain · umbrella.
   ================================================================== */
function drawHiWeapon(p,kind,w,c,h,a,P,hb,pt,limb){
  if(!w)return;
  /* hammer: a short haft with a square block head */
  if(kind==='hammer'){const tip=pt(...h,a,18),bt=pt(...h,a+180,4);limb(bt,tip,BROWN,3);const h1=pt(...tip,a+90,5),h2=pt(...tip,a-90,5),b1=pt(...h1,a,6),b2=pt(...h2,a,6);p.poly([h1,b1,b2,h2],c.blade);limb(h1,b1,c.edge,1)}
  /* axe / halberd: haft, crescent head; halberds are longer with a spike */
  else if(kind==='axe'||kind==='halberd'){const len=kind==='halberd'?28:20,tip=pt(...h,a,len),bt=pt(...h,a+180,kind==='halberd'?6:4);limb(bt,tip,BROWN,3);
    const at=kind==='halberd'?pt(...h,a,len-4):tip,h1=pt(...at,a+90,8),h2=pt(...at,a-90,2),b1=pt(...h1,a+180,9),b2=pt(...h2,a+180,9);
    p.poly([h2,h1,pt(...h1,a+180,3.5),b1,b2],c.blade);limb(h1,b1,c.edge,1);limb(at,pt(...at,a+180,7),shade(c.blade,.7),1);if(kind==='halberd')p.poly([pt(...tip,a,5),pt(...tip,a+90,2),pt(...tip,a-90,2)],c.blade)}
  /* greatsword: long, thick blade */
  else if(kind==='greatsword'){const tip=pt(...h,a,28),bt=pt(...h,a+180,5);limb(bt,h,c.hilt,2);limb(pt(...h,a+90,4),pt(...h,a-90,4),c.hilt,2);limb(h,tip,c.blade,3);limb(pt(...h,a,3),tip,c.edge,1)}
  /* sword: grip, cross-guard, blade with an edge highlight */
  else if(kind==='sword'||kind==='twin'){const tip=pt(...h,a,21),bt=pt(...h,a+180,4);limb(bt,h,c.hilt,2);limb(pt(...h,a+90,3),pt(...h,a-90,3),c.hilt,2);limb(h,tip,c.blade,2);limb(pt(...h,a,2),pt(...tip,a+180,1),c.edge,1)}
  /* scimitar: a blade that curves as it goes */
  else if(kind==='scimitar'){let q=h;for(let k=0;k<4;k++){const n=pt(...q,a+k*9,5.5);limb(q,n,c.blade,2+(k===2?1:0));q=n}limb(pt(...h,a+180,4),h,c.hilt,2);limb(pt(...h,a+90,3),pt(...h,a-90,3),GOLD,1)}
  /* rapier: thin blade, ring guard */
  else if(kind==='rapier'){const tip=pt(...h,a,24);limb(pt(...h,a+180,4),h,c.hilt,2);p.ring(h[0],h[1],2.6,c.hilt);limb(h,tip,c.blade,1)}
  /* dagger: short blade */
  else if(kind==='dagger'||kind==='twindagger'){const tip=pt(...h,a,10);limb(pt(...h,a+180,3),h,c.hilt,2);limb(pt(...h,a+90,2),pt(...h,a-90,2),c.hilt,1);limb(h,tip,c.blade,w.thin?1:2)}
  /* spear / javelin: long shaft, leaf tip, red tassel on spears */
  else if(kind==='spear'||kind==='javelin'){const f=kind==="javelin"?15:20,tip=pt(...h,a,f),bt=pt(...h,a+180,kind==='javelin'?6:10);limb(bt,tip,BROWN,2);
    p.poly([pt(...tip,a,7),pt(...tip,a+90,2.6),pt(...tip,a-90,2.6)],c.blade);limb(tip,pt(...tip,a,6),c.edge,1);if(kind==='spear')p.ell(...pt(...tip,a+180,1),1.6,1.6,RED)}
  /* bow / crossbow: limbs across the aim line; when drawn, the string goes to the back hand with an arrow */
  else if(kind==='bow'||kind==='crossbow'){const b=a+90,tipA=pt(...pt(...h,b,12),a+180,5),tipB=pt(...pt(...h,b+180,12),a+180,5);
    if(kind==='crossbow'){limb(pt(...h,a+180,8),pt(...h,a,6),BROWN,3);const f=pt(...h,a,5);limb(pt(...f,b,8),f,METAL2,2);limb(pt(...f,b+180,8),f,METAL2,2);limb(pt(...f,b,8),pt(...h,a+180,2),CREAM,1);limb(pt(...f,b+180,8),pt(...h,a+180,2),CREAM,1)}
    else{let prev=tipA;for(let k=1;k<=8;k++){const t=-1+k/4,q=pt(...pt(...h,b,-12*t),a+180,5*t*t);limb(prev,q,c.hilt===RED?RED:BROWN,2);prev=q}
      const pull=P.draw?hb:null;if(pull){limb(tipA,pull,CREAM,1);limb(pull,tipB,CREAM,1);limb(pull,pt(...h,a,5),'#e8dfc6',1);p.poly([pt(...h,a,8),pt(...pt(...h,a,5),a+90,1.5),pt(...pt(...h,a,5),a-90,1.5)],METAL)}else limb(tipA,tipB,CREAM,1)}}
  /* staff: long shaft with an orb (ranged) or a crook (melee); glows when casting */
  else if(kind==='staff'){const tip=pt(...h,a,18),bt=pt(...h,a+180,10);limb(bt,tip,BROWN,2);const o='#c58aff';
    if(w.r&&w.r[1]>1){p.ell(tip[0],tip[1],3,3,o);p.set(tip[0]-1,tip[1]-1,'#ffffff')}else{p.ring(tip[0]+1,tip[1]-1,3,BROWN);p.ell(tip[0],tip[1],1.6,1.6,o)}
    if(P.glow)p.ell(tip[0],tip[1],3+P.glow*1.5,3+P.glow*1.5,c.el||o,(x,y)=>(x+y)%2===0)}
  /* talisman (sigil): a paper charm; on a cast an element-coloured glow appears ahead of it */
  else if(kind==='talisman'){const q=pt(...h,a,3);p.poly([pt(...q,a+90,2),pt(...q,a-90,2),pt(...pt(...q,a-90,2),a,7),pt(...pt(...q,a+90,2),a,7)],'#f1d97a');p.set(...pt(...q,a,3),RED);p.set(...pt(...q,a,5),RED);
    if(P.glow){const g=pt(...h,a,10);p.ell(g[0],g[1],2+P.glow*2,2+P.glow*2,c.el);p.ell(g[0],g[1],1+P.glow,1+P.glow,'#ffffff')}}
  /* spirit charm / orb: a glowing ball held up, sparkles when casting */
  else if(kind==='spirit'||kind==='orb'){const col=kind==='orb'?'#9a6ad8':w.tint==='mend'?'#7ad6ff':JADE,g=pt(...h,-90,4);p.ell(g[0],g[1],3+(P.glow||0),3+(P.glow||0),col);p.set(g[0]-1,g[1]-1,'#ffffff');if(P.glow)for(const d of[[-6,-4],[5,-6],[6,3],[-5,4]])p.set(g[0]+d[0],g[1]+d[1],'#e9fff5')}
  else if(kind==='fan'){p.poly([h,pt(...h,a-30,11),pt(...h,a+30,11)],CREAM);limb(h,pt(...h,a,11),RED,1)}
  else if(kind==='whip'||kind==='chain'){let q=h;for(let k=0;k<6;k++){const n=pt(...q,a+(k%2?20:-20),3.5);limb(q,n,kind==='whip'?'#9a3a72':METAL2,1);q=n}}
  else if(kind==='umbrella'){const tip=pt(...h,a,18);limb(h,tip,BROWN,1);p.poly([pt(...tip,a+180,8),pt(...pt(...tip,a+180,8),a+90,7),tip,pt(...pt(...tip,a+180,8),a-90,7)],'#e58fb0')}
}

/* map and card sprite (64x64) */

/* ==================================================================
   ENTRY POINTS
   hiFig: the 64px map/card sprite (cached).
   ================================================================== */
function hiFig(L,cls,team,pose,wk){const k=['HI',cls,team,pose,wk,JSON.stringify(L)].join('|');return sprCache[k]||(sprCache[k]=hiArt(L,cls,team,wk,pose==='strike'?'swing':'idle',0,64))}
