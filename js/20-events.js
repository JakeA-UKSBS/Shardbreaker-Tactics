/* Event scenes, events and event helpers */
/* ---- events: a scene of what's happening, a short text, and choices. Each choice's go() returns the outcome text, or null to step back. ---- */
/* REG_SKY: event-scene sky per region, 3 bands top to bottom (hex). REG_GROUND: the ground colour under it. */
const REG_SKY={heart:['#0e0408','#2e0c16','#4e1424'],swamp:['#1a2a24','#2e4a3a','#4a6a4a'],forest:['#1a221c','#2e3a2e','#4a5240'],
  mountain:['#2a1414','#5a2a1e','#a8482a'],
  desert:['#c8783a','#e8a85a','#f3d08a'],snow:['#4a6a9a','#8aaad0','#c8daf0'],cavern:['#120e1a','#221a2e','#342a44']};
const REG_GROUND={heart:'#1e1416',swamp:'#3f5a4a',forest:'#3e4436',mountain:'#3a3034',desert:'#c9a060',snow:'#e4ecf4',cavern:'#3a3444'};
/* PROP_FIG: a scene prop's PNG laid over the scene (art/scenes/<png>.png). PROP_OWN: props whose PNG replaces the code-drawn one outright */
const PROP_FIG={well:'well',smith:'anvil',shrine:'altar',library:'desk',study:'potions'},PROP_OWN=['well','smith','shrine'];
const propFig=prop=>PROP_FIG[prop]&&ART_PNG.has('scenes/'+PROP_FIG[prop])?PROP_FIG[prop]:null;
function eventScene(prop){
  if(prop==='witch'&&ART_PNG.has('scenes/witch-hut'))return'art/scenes/witch-hut.png';/* Rhi's hut, drawn at 640x360 */
  const B=actBiome(),c='EV|'+prop+'|'+B.id;if(sprCache[c])return sprCache[c];
  const W=160,H=90,p=Px(W,H),sky=REG_SKY[B.id]||REG_SKY.forest,gr=REG_GROUND[B.id]||'#3e4436';
  if(['smith','spar','witch','library','armoury','study','chapel','throne'].includes(prop)){const wl=prop==='witch'?'#3a3028':'#4a4038',wl2=shade(wl,.8);p.rect(0,0,W,64,wl);for(let y=0;y<64;y+=8)for(let x=(y/8%2)*8;x<W;x+=16)p.rect(x,y,15,7,wl2);
    p.rect(142,14,14,18,sky[2]);p.rect(142,14,14,6,sky[1]);p.rect(148,14,2,18,'#2a1e14');p.rect(142,22,14,2,'#2a1e14');
    for(const x of[0,52,104])p.rect(x,0,6,64,'#3a2a1a');p.rect(0,0,W,5,'#3a2a1a');p.rect(0,62,W,28,'#6a4a2a');for(let y=64;y<90;y+=5)p.rect(0,y,W,1,'#4a3218');for(let i=0;i<14;i++)p.rect((i*37)%W,64+((i*13)%5)*5,1,5,'#4a3218')}
  else{sky.forEach((col,i)=>p.rect(0,i*20,W,20,col));p.rect(0,60,W,30,gr);for(let i=0;i<40;i++)p.set((i*41)%W,62+(i*17)%26,shade(gr,i%2?1.15:.85));
  p.poly([[0,60],[20,48],[44,58],[70,46],[100,58],[126,44],[160,56],[160,60]],shade(sky[0],1.1));}
  const own=PROP_OWN.includes(prop)&&propFig(prop);if(own)prop='_'+prop;/* the PNG draws this prop, so skip the code-drawn one */
  const S=(x,y,w,h,col)=>p.rect(x,y,w,h,col),G=GOLD,M=METAL,M2=METAL2,WD='#7a5230',WD2='#4f331d';
  if(prop==='smith'){S(22,40,30,24,'#4a3a3a');S(26,44,22,12,'#2a1a14');p.ell(37,52,9,5,'#ff8a3c');p.ell(37,51,5,3,'#ffe14a');S(28,30,18,10,'#5a4a4a');S(32,8,10,22,'#4a3a3a');
    S(70,62,20,14,WD2);S(64,54,32,8,M2);S(60,52,40,4,M);S(96,54,8,3,M);S(108,36,30,3,WD2);for(const x of[112,120,128])p.line(x,39,x,52,M);p.rect(118,52,5,6,WD2);p.line(126,39,124,50,M2,2);
    for(const[x,y]of[[78,44],[84,40],[72,42],[88,46]])p.set(x,y,'#ffe14a');S(104,40,3,22,WD);S(100,38,10,5,M2)}
  if(prop==='armoury'){for(const x of[24,104]){S(x,30,3,34,WD);S(x+30,30,3,34,WD);S(x,34,33,2,WD2);S(x,50,33,2,WD2)}
    /* left rack: swords with crossguards, and a staff */
    for(let i=0;i<4;i++){const x=29+i*6;p.line(x,52,x,26,i%2?M:M2);p.line(x-2,46,x+2,46,G);p.rect(x,47,1,4,WD2);p.set(x,25,'#ffffff')}p.line(53,52,53,22,WD,2);p.ell(53,21,2,2,'#b07ae8');
    /* right rack: spears and axes */
    for(let i=0;i<3;i++){const x=110+i*8;p.line(x,52,x,24,WD);p.poly([[x-2,25],[x+2,25],[x,19]],M)}p.line(134,52,134,30,WD,2);p.poly([[134,30],[140,27],[140,36],[134,34]],M2);
    /* medicine shelf: jars and a red-cross chest */
    S(66,46,26,2,WD2);for(const[x,c]of[[68,'#c9a070'],[74,'#7ad6a0'],[80,'#c9a070'],[86,'#d8a0c8']]){S(x,40,4,6,c);S(x,39,4,1,WD2)}
    S(70,62,18,10,'#a8743a');S(70,62,18,2,'#7a5230');S(78,64,2,6,'#d8382a');S(76,66,6,2,'#d8382a')}
  if(prop==='shrine'){S(62,50,36,18,'#6a6672');S(58,46,44,5,'#8a8794');S(66,54,28,2,'#4a4652');p.ell(80,44,8,6,'#c8322e');p.ell(80,44,4,3,'#ff8a7a');
    for(const x of[56,104]){S(x,40,3,10,'#efe6cf');p.set(x+1,38,'#ffd27a');p.set(x+1,37,'#ffe14a')}for(let i=0;i<8;i++)p.set(70+i*3,30-(i%3)*3,'#ff5a5a')}
  if(prop==='spar'){for(const x of[44,96]){S(x+6,40,3,30,WD);p.ell(x+7,40,7,6,'#c9a46a');S(x,46,16,3,'#c9a46a');p.ell(x+7,38,3,3,'#a8844c');p.line(x+4,52,x+10,52,'#8a6a3a')}
    p.line(76,70,86,52,M,2);p.line(84,70,74,52,M2,2);S(120,40,22,2,WD2);for(const x of[124,130,136])p.line(x,42,x,60,WD)}
  if(prop==='merchant'){S(50,48,60,18,WD);S(50,48,60,3,WD2);p.poly([[46,48],[114,48],[106,30],[54,30]],'#c8322e');for(let x=56;x<106;x+=10)p.line(x,31,x-2,47,'#efe6cf');
    p.ell(58,68,6,6,WD2);p.ell(102,68,6,6,WD2);p.ell(58,68,2,2,M2);p.ell(102,68,2,2,M2);S(64,42,6,6,'#3a6a3a');S(74,40,5,8,'#7a2a2a');S(84,43,8,5,G);S(96,41,5,7,'#2a4a6a')}
  if(prop==='gamble'){S(58,52,44,4,WD);S(62,56,4,14,WD2);S(94,56,4,14,WD2);S(68,46,6,6,'#efe6cf');p.set(70,48,INK);p.set(72,50,INK);S(78,47,6,6,'#efe6cf');p.set(80,49,INK);
    for(let i=0;i<5;i++)p.ell(90+i*1.5,50-i*1.4,3,1.2,G);p.ell(64,50,2,1,G)}
  if(prop==='idol'){S(68,56,24,12,'#5a5762');S(72,30,16,26,G);p.ell(80,28,8,7,G);S(74,26,4,3,'#c8322e');S(82,26,4,3,'#c8322e');
    for(let a=0;a<12;a++)p.set(80+Math.round(16*Math.cos(a/12*6.28)),34+Math.round(14*Math.sin(a/12*6.28)),'#ffe14a')}
  if(prop==='cage'){S(58,66,44,4,M2);S(58,30,44,4,M2);S(60,34,40,32,'#2a2430')}
  if(prop==='spring'){p.ell(80,64,30,8,'#6a6672');p.ell(80,63,26,6,'#4fb2ff');p.ell(80,62,18,3,'#9fd8ff');for(const[x,y,r]of[[54,60,5],[106,61,6],[60,66,4]])p.ell(x,y,r,r*.7,'#7a746e');
    for(let i=0;i<6;i++)p.set(70+i*4,52-(i%2)*4,'#bff5e0')}
  if(prop==='well'){p.ell(80,62,16,6,'#6a6672');S(64,48,32,14,'#8a8794');for(let y=50;y<62;y+=4)S(64,y,32,1,'#6a6672');S(66,30,3,20,WD);S(91,30,3,20,WD);p.poly([[60,32],[100,32],[80,22]],'#7a2a2a');p.line(80,32,80,44,'#c9a070');S(78,44,5,4,WD)}
  if(prop==='battlefield'){p.line(44,70,52,46,M,2);p.line(110,70,104,50,M2,2);p.ell(70,68,6,4,M);p.ell(96,70,5,3,M2);S(84,36,2,34,WD);p.poly([[86,36],[100,40],[86,46]],'#7a2a2a');
    p.ell(60,70,3,2,'#e8e2d0');p.ell(118,68,4,2,'#e8e2d0');p.line(120,70,128,60,'#e8e2d0')}
  const JD='#5fd3a0',JD2='#2f8a66',ST1='#6a6672',ST2='#8a8794',ST3='#4a4652',YL='#ffe14a';
  const zig=(x,y0,y1)=>{let x0=x,y=y0;while(y<y1){const nx=x0+(((y/6)|0)%2?4:-4);p.line(x0,y,nx,y+6,YL,2);x0=nx;y+=6}};
  if(prop==='tomb'){S(52,34,56,34,ST1);S(48,30,64,6,ST2);S(44,26,72,4,ST3);S(66,40,28,28,JD2);S(68,42,24,26,JD);p.line(80,42,80,68,JD2);p.ell(80,52,3,3,'#e9fff5');for(const x of[50,106])S(x,36,4,32,ST2)}
  if(prop==='stormaltar'){p.ell(80,14,40,9,'#2a2a3a');p.ell(60,18,20,6,'#3a3a4a');p.ell(104,16,22,6,'#3a3a4a');zig(82,22,50);S(64,52,32,14,'#2a2630');S(60,48,40,5,'#3a3640');p.ell(80,46,5,3,YL);p.ell(80,46,2,1.5,'#ffffff')}
  if(prop==='cache'){S(46,50,22,18,WD);S(46,50,22,2,WD2);S(72,54,20,14,WD2);S(96,44,24,24,WD);S(96,44,24,2,WD2);
    for(const[x,y]of[[50,56],[100,52]])S(x,y,12,3,'#efe6cf');for(let y=30;y<=44;y++)p.set(104+Math.round(3*Math.sin(Math.PI*(y-30)/14)),y,BROWN);p.line(58,48,64,40,M);p.line(62,48,68,40,M);p.ell(82,52,4,3,'#7ad6ff')}
  if(prop==='veteran'){p.ell(64,68,9,3,'#5a4a4a');p.poly([[58,66],[64,52],[70,66]],'#ff8a3c');p.poly([[61,66],[64,58],[67,66]],YL);
    S(92,52,12,14,'#5a5a6a');p.ell(98,48,4,4,'#e0b090');p.poly([[95,50],[101,50],[98,57]],'#e8e2d0');S(96,44,5,2,'#e8e2d0');S(86,62,8,6,'#5a4a3a');p.line(112,68,116,44,M,2);S(110,54,8,2,G)}
  if(prop==='statue'){S(64,58,32,10,ST1);S(60,54,40,4,ST2);S(74,34,12,20,ST2);p.ell(80,30,5,5,ST2);p.line(86,36,94,14,'#c9c9d0',2);S(84,34,6,2,ST1);
    for(const[x,y]of[[66,52],[92,52],[70,50]])p.ell(x,y,1.5,1.5,'#ff8a7a');p.ell(88,52,1.5,1.5,G)}
  if(prop==='drill'){for(const x of[40,70,100]){S(x+6,42,3,28,WD);p.ell(x+7,42,6,5,'#c9a46a');S(x+1,47,14,3,'#c9a46a')}S(128,24,2,46,WD);p.poly([[130,24],[146,28],[130,34]],'#c8322e')}
  if(prop==='bridge'){p.rect(0,52,W,14,'#3a6a9a');p.rect(0,54,W,2,'#5a8aba');p.rect(0,62,W,2,'#2a5a8a');
    /* bridge running away from the viewer: wide at the bottom, narrow at the far bank */
    p.poly([[56,90],[104,90],[86,48],[74,48]],WD);for(let y=50;y<90;y+=4){const t=(y-48)/42,l=74-18*t,r=86+18*t;p.line(l,y,r,y,WD2)}
    p.line(56,90,74,48,WD2,2);p.line(104,90,86,48,WD2,2);for(const[x1,y1,x2,y2]of[[52,90,72,44],[108,90,88,44]])p.line(x1,y1-8,x2,y2,'#5a3a22',2);
    /* toll gate and thugs at the far end */
    S(70,34,2,16,WD2);S(88,34,2,16,WD2);S(70,34,20,2,WD);S(76,38,8,8,'#5a4a5a');p.ell(80,35,3,3,'#d8a070');S(92,40,6,8,'#4a3a3a');p.ell(95,38,2.5,2.5,'#c9906a');p.line(99,36,99,48,M2);p.poly([[98,36],[100,36],[99,32]],M)}
  if(prop==='witch'){S(14,30,34,2,WD2);S(14,44,34,2,WD2);for(const[x,y,c]of[[16,24,'#7fd36a'],[24,25,'#c8322e'],[32,24,'#9a6ad8'],[40,25,'#c9a070'],[18,38,'#5fb2d8'],[28,38,'#7fd36a'],[38,38,'#e8a23a']]){S(x,y,5,6,c);S(x+1,y-1,3,1,WD2)}
    for(const x of[60,70,80,90])p.line(x,0,x+1,10,'#5a7a3a');for(const x of[60,70,80,90])p.ell(x+1,11,2,3,'#6a8a3a');
    p.ell(84,66,16,7,'#2a2630');p.ell(84,61,13,4,'#7fd36a');for(const[x,y]of[[78,55],[88,52],[83,48]])p.ell(x,y,2,2,'#a8f08a');S(70,70,4,6,INK);S(94,70,4,6,INK);}
    /* the witch herself is a hand-drawn PNG laid over the scene (art/scenes/witch.png, see EV_FIG) */
  if(prop==='throne'){S(70,16,20,6,G);p.poly([[70,16],[80,8],[90,16]],G);p.ell(80,12,2,2,'#c8322e');S(70,22,20,30,'#7a2a2a');S(72,24,16,26,'#9a3a3a');S(66,44,28,8,G);S(66,52,4,14,G);S(90,52,4,14,G);S(68,46,24,4,'#9a3a3a')}
  if(prop==='fog'){S(76,30,2,30,WD);p.poly([[78,30],[90,33],[78,36]],'#efe6cf');p.line(40,62,60,40,'#5a4a3a');p.line(120,64,100,42,'#5a4a3a')}
  if(prop==='chest'){/* the chest itself is Rhi's PNG laid over the scene (art/scenes/chest.png, see EV_FIG) */for(const[x,y]of[[40,40],[120,36],[132,46],[28,48]]){p.set(x,y,'#ff3a3a');p.set(x+3,y,'#ff3a3a')}}
  if(prop==='library'){for(const x of[24,68,112]){S(x,22,26,46,WD2);for(let r=0;r<4;r++){S(x+1,25+r*10,24,1,WD);for(let b=0;b<8;b++)S(x+2+b*3,26+r*10,2,8,['#c8322e','#3a6a9a','#7fd36a','#c9a050','#8a4ab0'][(b+r+x)%5])}}
    p.ell(98,70,9,3,ST1);p.ell(58,72,5,2,ST2);S(54,66,10,4,'#e8dcc0');S(55,66,4,4,'#d8ccb0');p.ell(150,40,3,4,'#ffd27a')}
  if(prop==='crater'){p.line(10,4,70,48,'#ffd27a',2);p.line(14,4,72,46,'#fff2b0');}/* the crater itself is Rhi's meteor PNG (art/scenes/meteor.png); the code-drawn one is the fallback */
  if(prop==='crater'&&!ART_PNG.has('scenes/meteor')){p.ell(80,64,30,8,'#2a2026');p.ell(80,62,24,5,'#4a3a3a');p.ell(80,58,9,7,'#a8482a');p.ell(80,57,5,4,'#ff8a3c');p.ell(79,56,2,2,YL);
    for(let i=0;i<6;i++)p.set(66+i*6,48-(i%2)*4,'#9a9aa8')}
  if(prop==='spire'){S(72,16,16,52,ST1);S(70,60,20,8,ST2);for(let y=20;y<60;y+=8)S(74,y,3,4,'#2a2630');p.poly([[70,16],[90,16],[80,4]],ST3);zig(80,-6,4);p.ell(80,10,4,4,YL);p.ell(30,10,24,6,'#2a2a3a');p.ell(130,12,24,6,'#2a2a3a')}
  if(prop==='oracle'){S(62,58,36,4,WD);S(66,62,4,10,WD2);S(90,62,4,10,WD2);p.ell(80,52,6,6,'#c58aff');p.ell(78,50,2,2,'#f0e0ff');
    const R='#4a3a6a',R2='#34284e',R3='#6a5a8e';p.poly([[100,30],[112,30],[118,70],[94,70]],R);p.poly([[100,30],[104,30],[100,70],[94,70]],R2);p.line(108,34,112,70,R3);p.line(104,40,106,70,R2);
    p.poly([[98,24],[114,24],[116,36],[96,36]],R2);p.ell(106,30,5,5,'#d8a070');S(101,28,10,2,'#efe6cf');p.set(104,31,'#a8604a');p.set(108,31,'#a8604a');
    p.poly([[98,42],[90,50],[86,52],[88,54],[94,52],[100,48]],R3);S(86,52,3,2,'#d8a070');S(118,60,3,10,R2);
    for(let a=0;a<8;a++)p.set(80+Math.round(10*Math.cos(a/8*6.28)),52+Math.round(9*Math.sin(a/8*6.28)),'#e0c0ff')}
  if(prop==='sage'){p.poly([[10,62],[60,16],[110,62]],ST1);p.poly([[48,27],[60,16],[72,27],[64,25],[60,29],[56,25]],'#efe6cf');p.ell(16,36,18,4,'#e8ecf4');
    /* tree: trunk and broad canopy */
    S(130,30,6,34,WD2);p.line(132,36,120,28,WD2,2);p.line(134,34,146,26,WD2,2);p.ell(118,24,24,12,'#3f6a3a');p.ell(108,20,12,7,'#4f7a42');p.ell(130,22,10,6,'#4f7a42');p.ell(120,16,10,5,'#5f8a4a');
    /* seated figure, legs crossed, hands resting, eyes closed */
    const O='#c8782a',O2='#a85a1a',Sk='#d8a070';p.ell(112,66,14,5,O2);p.ell(112,64,12,4,O);p.poly([[104,64],[120,64],[117,46],[107,46]],O);p.poly([[107,46],[111,46],[108,64],[104,64]],O2);
    p.ell(112,41,5,5,Sk);p.line(110,41,111,41,INK);p.line(113,41,114,41,INK);p.set(112,44,'#a8604a');p.ell(112,36,2,1.5,Sk);S(108,58,9,3,Sk);
    p.ell(112,40,9,9,null,(x,y)=>false);for(let a=0;a<16;a++)p.set(112+Math.round(9*Math.cos(a/16*6.28)),40+Math.round(9*Math.sin(a/16*6.28)),'#ffe8a0')}
  if(prop==='hoard'){p.ell(80,66,40,8,'#b8912f');p.ell(80,62,30,7,G);p.ell(70,58,14,6,'#ffd96a');p.ell(96,60,10,4,'#ffd96a');p.ell(64,48,10,7,'#e8e2d0');p.ell(60,48,2,2,INK);p.ell(67,48,2,2,INK);
    p.line(98,56,104,36,JD,2);S(100,50,8,2,G);p.ell(86,54,3,3,JD);p.ell(78,56,2,2,'#c8322e');for(const[x,y]of[[120,40],[124,40]])p.set(x,y,'#ff3a3a')}
  p.outline('#120e14');
  if(prop==='fog'){const mix=(h,a)=>{const n=parseInt(h.slice(1),16),f=[n>>16,(n>>8)&255,n&255].map((v,i)=>Math.round(v*(1-a)+[224,228,236][i]*a));return'#'+f.map(v=>v.toString(16).padStart(2,'0')).join('')};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=p.g[y*W+x];if(!g)continue;const d=.5*Math.sin(x/14+y/9)+.5*Math.sin(x/23-y/6),a=Math.max(0,Math.min(.6,.22+.18*d+(y>44?.18:0)));p.g[y*W+x]=mix(g,a)}}
  return sprCache[c]=p.url();
}
const evEl=document.createElement('div');evEl.className='tav ev';evEl.hidden=true;document.body.appendChild(evEl);
function evShow(E,text,opts){
  evEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${eventScene(E.art)}" alt="">${[].concat(E.fig||[],propFig(E.art)||[]).filter(f=>ART_PNG.has('scenes/'+f)).map(f=>`<img class="ev-fig ev-${f}" src="art/scenes/${f}.png" alt="">`).join('')}${E.ov||''}<span class="tv-gold">${gold()} gold</span></div>
    <div class="tv-box"><div class="tv-name">${E.t}</div><p class="tv-text">${text}</p>${E.card&&opts.length>1?E.card:''}<div class="tv-opts">${opts.map(([k,l,sub,dis])=>`<button type="button" class="tv-o" data-t="${k}"${dis?' disabled':''}>${l}${sub?`<span>${sub}</span>`:''}</button>`).join('')}</div></div>`;
  evEl.hidden=false;
  return new Promise(res=>{evEl.onclick=e=>{const b=e.target.closest('[data-t]');if(!b||b.disabled)return;sfx('tick');res(b.dataset.t)}});
}
const lvAvg=()=>Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length));
/* EVENTS: t = title, art = scene prop drawn by eventScene(), fig = PNG figure(s) laid over it (art/scenes/<fig>.png; a name or a list), d = intro text,
   o = options: l = button label, sub = small text under it, cost = gold, need = check it can be chosen, go = what happens */
const EVENTS={
  smith:{t:'The Wandering Smith',art:'smith',d:'A travelling smith has taken over an old roadside forge for the night, and waves you over. “One weapon, no charge. For your journey.”',o:[
    {l:'Reforge a weapon',sub:'+2 Mt and +5 Hit (staves heal +5), up to +3',go:async()=>{
      const u=await pickUnit('Whose weapon?','Choose a weapon to reforge.',u=>{const w=weaponOf(u);return!w?'No weapon':forgeLv(w)>=FORGE_MAX?'Already +3':null});
      if(!u)return null;const w=weaponOf(u),old=IT[w.k].n;forge(w);if(R('anvil'))forge(w);sfx('item');return`Sparks fly. ${u.name}’s ${old} comes back as the <b>${IT[w.k].n}</b>: Mt ${IT[w.k].mt}, Hit ${IT[w.k].hit}.`}},
    {l:'Move on',go:async()=>'You thank the smith and keep walking.'}]},
  armoury:{t:'Abandoned Armoury',art:'armoury',d:'Racks of old weapons, most rusted through. A few are still good, and there are medicine jars on a shelf.',o:[
    {l:'Take a better weapon',sub:'One unit gets a stronger weapon of their kind',go:async()=>{
      const u=await pickUnit('Who takes a weapon?',`They get the one that suits them: ${steelList()}.`,u=>steelFor(u)?null:'Nothing for them');
      if(!u)return null;const st=steelFor(u);if(!await stow(u,st))return null;sfx('item');
      return`${u.name} pulls a <b>${IT[st].n}</b> from the rack. Mt ${IT[st].mt}, Wt ${IT[st].wt}.`}},
    {l:'Take the medicine',sub:'2 Salves',go:async()=>{evEl.hidden=true;const a=await giveTo('salve','The first of two Salves.',true),b=await giveTo('salve','The second Salve.',true);evEl.hidden=false;return[a,b].filter(Boolean).map(u=>`${u.name} takes a Salve.`).join(' ')||'You leave the medicine on the shelf.'}}]},
  /* the spellcasters' version of the armoury: a sigil or staff is enchanted (+1, like the smith) */
  enchanter:{t:'The Enchanter’s Study',art:'study',d:'A tower full of books on enchantment and arcane knowledge.',o:[
    {l:'Enchant a sigil or staff',sub:'+2 Mt and +5 Hit (staves heal +5), up to +3',need:()=>run.roster.some(u=>{const w=weaponOf(u);return w&&['art','spirit'].includes(IT[w.k].t)}),go:async()=>{
      const u=await pickUnit('Whose sigil or staff?','Sigils hit harder; staves heal more.',u=>{const w=weaponOf(u);return!w||!['art','spirit'].includes(IT[w.k].t)?'No sigil or staff':forgeLv(w)>=FORGE_MAX?'Already +3':null});
      if(!u)return null;const w=weaponOf(u),old=IT[w.k].n;forge(w);sfx('item');return`${u.name} copies the enchanter’s runes onto their ${old}. It is now the <b>${IT[w.k].n}</b>.`}},
    {l:'Study the tomes',sub:'One unit +2 Mag for good',go:async()=>{const u=await pickUnit('Who studies?','+2 Mag for good.');if(!u)return null;bump(u,'mag',2);sfx('ding');return`${u.name} reads until the candles gutter out, and comes away with a head full of power (+2 Mag).`}},
    {l:'Read the notes',sub:'Casters, Menders and Summoners gain 25 EXP',go:async()=>{await expAll(run.roster.filter(u=>CLS[u.cls].w.includes('art')||CLS[u.cls].w.includes('spirit')),25);return'Dense, but worth it. The spellcasters gain 25 EXP.'}}]},
  shrine:{t:'Blood Shrine',art:'shrine',d:'A cracked altar, still warm. Words cut into the stone: <i>blood for knowledge</i>.',o:[
    {l:'Offer blood',sub:'One unit loses 3 max HP for good and learns a random skill',go:async()=>{
      const u=await pickUnit('Who offers blood?','They lose 3 max HP for good.',u=>u.maxhp<=12?'Too weak':null);if(!u)return null;
      const ks=SKILL_POOL().filter(k=>!has(u,k));if(!ks.length)return`The altar stays cold. ${u.name} already knows everything it could teach.`;const k=pick(ks);
      u.maxhp-=3;u.hp=Math.min(u.hp,u.maxhp);sfx('earth');let how;
      if(!learnBlock(u,k)){u.skills.push({id:k,src:'scroll'});how=`learns <b>${SKILLS[k].n}</b>`}else{const can=(u.skills||[]).filter(x=>x.src==='scroll');if(can.length){const old=can[0];u.skills.splice(u.skills.indexOf(old),1);u.skills.push({id:k,src:'scroll'});how=`forgets ${SKILLS[old.id].n} and learns <b>${SKILLS[k].n}</b>`}else how=`glimpses ${SKILLS[k].n}, but has no room to keep it`}
      return`${u.name} bleeds on the stone (max HP ${u.maxhp}) and ${how}. ${SKILLS[k].d}`}},
    {l:'Leave it',go:async()=>'Some lessons aren’t worth the price.'}]},
  spar:{t:'Training Ground',art:'spar',d:'An empty yard with straw dummies and blunted weapons. Someone kept it in good order.',o:[
    {l:'Everyone spars',sub:'All units gain 50 EXP',go:async()=>{evEl.hidden=true;for(const u of run.roster){const g=gainExp(u,50);if(g&&g.gains)await levelUp(u,g)}return'A good, hard session. Every unit gains 50 EXP.'}},
    {l:'Move on',go:async()=>'No time to train today.'}]},
  merchant:{t:'Travelling Merchant',art:'merchant',d:'A covered wagon, a tired mule and a merchant who is very pleased to see paying customers.',o:null,
    make:()=>{const stock=shuffle(['warHammer','huntingSpear','giantslayer','holySword','claymore','flamberge','knightlySword','steelSpear','cleaver','ironwoodBow','javelin','throwingAxe','throwingKnives','galeSword','arbalest','leatherArmour','wardingCloak','travellersBoots','ironGauntlets','dawnStaff','stiletto']).slice(0,3),price=k=>IT[k].t==='gear'?40:IT[k].crit>=20?55:45;
      return[...stock.map(k=>({l:`${IT[k].n} · ${price(k)}g`,sub:itemText(k),cost:price(k),go:async()=>{
        const u=await pickUnit(`Who takes the ${IT[k].n}?`,'If their bag is full, you can swap something out.',u=>(isWpn(k)||IT[k].t==='spirit')&&!canUse(u,k)?(IT[k].t==='spirit'?'Can’t use staves':'Can’t wield it'):null);if(!u)return null;
        if(!await stow(u,k))return null;spend(price(k));return`${u.name} takes the <b>${IT[k].n}</b>. “Pleasure doing business.”`}})),{l:'Just looking',go:async()=>'The merchant shrugs and waves you on.'}]}},
  gamble:{t:'Gambler’s Table',art:'gamble',d:'A grinning stranger rattles two dice in a cup. “Double or nothing, friend?”',o:[
    {l:'Bet 30 gold',sub:'Even odds to win 60',cost:30,go:async()=>{spend(30);if(rand()<.5){run.gold+=60;sfx('fanfare');return'Two sixes. The stranger laughs and pays out 60 gold.'}sfx('broke');return'Snake eyes. The stranger pockets your 30 gold.'}},
    {l:'Walk away',go:async()=>'“Suit yourself.”'}]},
  idol:{t:'The Golden Idol',art:'idol',d:'A golden idol with ruby eyes sits on a plinth. It hums. Everyone feels it watching.',o:[
    {l:'Take it',sub:'Gain a rare relic; every unit loses 2 max HP for good',go:async()=>{const k=pick(relicPool(['r']));if(!k)return'The plinth is empty.';run.relics.push(k);run.roster.forEach(u=>{u.maxhp=Math.max(10,u.maxhp-2);u.hp=Math.min(u.hp,u.maxhp)});sfx('earth');return`The eyes go dark. You carry away the <b>${RELICS[k].n}</b>: ${RELICS[k].d} Everyone feels a little weaker (−2 max HP).`}},
    {l:'Leave it',go:async()=>'You back away slowly. The humming stops when it’s out of sight.'}]},
  cage:{t:'The Caged Traveller',art:'cage',d:'A traveller sits in a monster’s cage, half starved. “Get me out of here and I’ll fight for you.”',o:null,make:()=>{const nu=castOffer(1,lvAvg(),'recruit')[0];EVENTS.cage.card=`<div class="dcard on ev-card">${unitCard(nu)}</div>`;EVENTS.cage.ov=`<img class="ev-ov" src="${uSpr(nu)}" alt=""><img class="tv-bg" src="${cageBarsArt()}" alt="">`;return[
    {l:'Break the lock',sub:`${nu.name} joins your squad`,go:async()=>{
      if(run.roster.length>=TEAM_CAP){const d=await modal(`<h2>Who stays behind?</h2><p>${nu.name} (${CLS[nu.cls].n}) takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);
        if(d==='skip')return null;run.roster.splice(+d.slice(1),1)}
      run.roster.push(nu);castJoined(nu);sfx('item');return`The lock gives. <b>${nu.name}</b>, a ${CLS[nu.cls].n}, joins the squad.`}},
    {l:'Leave them',go:async()=>'You walk on. The traveller’s shouts follow you a long way.'}]}},
  weaponmaster:{t:'The Weaponmaster',art:'armoury',d:'A scarred weaponmaster sits behind a table of fine arms. “Your blades are a disgrace. Give me one, and coin, and I’ll give you something worthy.”',o:[
    {l:'Trade up a weapon',sub:'35 gold: a better weapon of the same kind',cost:35,need:()=>run.roster.some(u=>{const w=weaponOf(u);return w&&tierUp(u,w)}),go:async()=>{
      const u=await pickUnit('Whose weapon?','They get the next tier of the same weapon, keeping any reforging.',u=>{const w=weaponOf(u);return!w?'No weapon':tierUp(u,w)?null:'Nothing better for them'});
      if(!u)return null;const w=weaponOf(u),old=IT[w.k].n,up=tierUp(u,w);w.k=up;w.u=IT[up].uses;spend(35);return`The weaponmaster weighs your ${old}, snorts, and hands over the <b>${IT[up].n}</b>: Mt ${IT[up].mt}, Hit ${IT[up].hit}.`}},
    {l:'Leave them',go:async()=>'You walk on.'}]},
  /* Lysander joins only through this event */
  minstrel:{t:'The Wandering Minstrel',art:'veteran',ok:()=>!(run.castUsed||[]).includes('lysander')&&!run.roster.some(u=>u.cast==='lysander'),
    d:'A man in a feathered cap sits by the road, tuning a lyre. “Monster hunters! Every ballad needs heroes. Mind if I come along and write yours?”',o:null,make:()=>{const nu=castUnit('lysander',lvAvg());EVENTS.minstrel.card=`<div class="dcard on ev-card">${unitCard(nu)}</div>`;return[
    {l:'Let him come',sub:`${nu.name} joins your squad`,go:async()=>{
      if(run.roster.length>=TEAM_CAP){const d=await modal(`<h2>Who stays behind?</h2><p>${nu.name} (${CLS[nu.cls].n}) takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);
        if(d==='skip')return null;run.roster.splice(+d.slice(1),1)}
      run.roster.push(nu);castJoined(nu);sfx('item');return`<b>${nu.name}</b> slings his lyre over his shoulder. “I’ll make you all sound taller.”`}},
    {l:'Ask for a song and move on',sub:'Every unit gains 10 EXP',go:async()=>{await expAll(run.roster,10);return'He plays something rousing about a dragon. Every unit gains 10 EXP.'}}]}},
  spring:{t:'The Healing Fountain',art:'spring',d:'A fountain splashes in a quiet castle courtyard. The water glows faintly.',o:[
    {l:'One unit bathes',sub:'+3 max HP for good',go:async()=>{const u=await pickUnit('Who bathes in the fountain?','They gain 3 max HP for good.');if(!u)return null;u.maxhp+=3;u.hp+=3;sfx('heal');return`${u.name} climbs out feeling years younger. Max HP ${u.maxhp}.`}},
    {l:'Everyone drinks',sub:'Every unit gains +1 Res',go:async()=>{run.roster.forEach(u=>u.res++);sfx('heal');return'The water tastes of rain. Every unit gains 1 Res.'}}]},
  well:{t:'Wishing Well',art:'well',d:'An old stone well, its bottom lost in the dark. Coins glint far below.',o:[
    {l:'Toss in 25 gold',sub:'Every unit gains +1 Luck',cost:25,go:async()=>{spend(25);run.roster.forEach(u=>u.lck++);sfx('ding');return'The coins vanish without a sound. Every unit feels luckier (+1 Luck).'}},
    {l:'Leave it',go:async()=>'You keep your coins.'}]},
  battlefield:{t:'Old Battlefield',art:'battlefield',d:'Rusted armour and broken weapons litter the ground. Whatever happened here was a long time ago.',o:[
    {l:'Search the dead',sub:'Find a weapon or gear; it may cost you',go:async()=>{const k=pick(['knightlySword','steelSpear','cleaver','ironwoodBow','moonglassEdge','barbedSpear','reaverAxe','hawkeyeBow','chainmail','leatherArmour','ironGauntlets']);evEl.hidden=true;const u=await giveTo(k,'Pulled from the mud.',true);evEl.hidden=false;
      let t=u?`${u.name} pulls a <b>${IT[k].n}</b> from the mud.`:`You leave the ${IT[k].n} in the mud.`;
      if(rand()<.35){const v=pick(run.roster);v.maxhp=Math.max(10,v.maxhp-2);v.hp=Math.min(v.hp,v.maxhp);t+=` ${v.name} is cut by old blades in the search (−2 max HP).`}sfx('item');return t}},
    {l:'Pay respects',sub:'Every unit gains 20 EXP',go:async()=>{evEl.hidden=true;for(const u of run.roster){const g=gainExp(u,20);if(g&&g.gains)await levelUp(u,g)}return'You bury what you can. The squad marches on quieter, and wiser (+20 EXP).'}}]},
  /* the chapel's healer stands to the right of the window (art/npcs/healer.png, see .ev-healer) */
  chapel:{t:'The Wayside Chapel',art:'chapel',fig:['stained-glass','banner'],d:'Light pours through a stained-glass window onto the pews. A healer in white looks up from her prayers. “Rest a while. I can mend you, or send you on with a blessing.”',o:null,
    make:()=>{EVENTS.chapel.ov=`<img class="ev-ov2 ev-healer" src="${healerArt()}" alt="">`;return[
    {l:'Ask her to heal you',sub:'Every unit heals to full HP',go:async()=>{run.roster.forEach(u=>u.hp=u.maxhp);sfx('heal');return'She lays her hands on each of you in turn. Every wound closes.'}},
    {l:'Ask for her blessing',sub:'Choose a relic',go:async()=>{evEl.hidden=true;const k=await relicPick(3,['c','u'],'The healer’s blessing','She presses something into your hands. “Carry this, and come back to us.”');evEl.hidden=false;return k?`You leave with the <b>${RELICS[k].n}</b>.`:'She has nothing left to give.'}}]}},
  throne:{t:'The Empty Throne',art:'throne',d:'A throne room with no king. Dust lies thick on the red tiles, and a jewelled crown still rests on the seat.',o:null,
    make:()=>{EVENTS.throne.ov='<div class="ev-floor"></div>';return[
    {l:'Take the crown',sub:'Gain the Crystal Crown: +3 damage, but enemies get +10 Hit against you',need:()=>!R('gemcrown'),go:async()=>{run.relics.push('gemcrown');sfx('dark');return`The crown is lighter than it looks. Under the jewels, crystal has grown into the gold, and it pulses faintly in your hands. <b>${RELICS.gemcrown.n}</b>: ${RELICS.gemcrown.d}`}},
    {l:'Break the crown',sub:'Every unit gains 5 EXP',go:async()=>{await expAll(run.roster,5);sfx('broke');return'The gems crack, and something inside them screams thinly before going quiet. Better no one wears it. Every unit gains 5 EXP.'}}]}}
};
/* hurt: knock HP off every unit now (never below 1); HP carries into the next fight */
const hurtAll=n=>run.roster.forEach(u=>u.hp=Math.max(1,u.hp-n));
/* ---- event helpers ---- */
async function expAll(us,n){evEl.hidden=true;for(const u of us){let left=n;while(left>0){const g=gainExp(u,Math.min(100,left));left-=100;if(g&&g.gains)await levelUp(u,g)}}}
function bump(u,s,n){if(s==='hp'){u.maxhp+=n;u.hp+=n}else u[s]+=n}
const SN={hp:'max HP',str:'Str',mag:'Mag',lck:'Luck',spd:'Spd',def:'Def',res:'Res'};
const powS=u=>usesMag(u)?'mag':'str';
const isRoleU=(u,r)=>u.cls.startsWith(`G.${r}.`);
const canAny=k=>run.roster.some(u=>canUse(u,k));
/* the jade (killer) weapon that suits a unit, if any */
/* every item the squad gains goes through this picker; found=true shows it as "Found: X" with a Leave it option */
async function giveTo(k,why,found){for(;;){const u=await pickUnit(found?`Found: ${IT[k].n}`:`Who takes the ${IT[k].n}?`,found?`${why?why+' ':''}${itemText(k)}`:why||itemText(k),u=>(isWpn(k)||IT[k].t==='spirit')&&!canUse(u,k)?(IT[k].t==='spirit'?'Can’t use staves':'Can’t wield it'):null,found?'Leave it':'Cancel');if(!u)return null;if(!await stow(u,k))continue;sfx('item');return u}}
Object.assign(EVENTS,{
  /* only turns up when Corvin is in the squad, and the sigil is his */
  stormaltar:{t:'The Storm Altar',art:'stormaltar',ok:()=>run.roster.some(u=>u.cast==='corvin'),d:'Lightning strikes the same black altar again and again. A sigil sits in the scorch mark, crackling.',o:[
    {l:'Take the Thunderhead Sigil',sub:'A high-crit lightning sigil for Corvin',go:async()=>{const u=run.roster.find(u=>u.cast==='corvin');if(!u||!await stow(u,'thunderheadSigil'))return null;sfx('item');return`${u.name} snatches the <b>Thunderhead Sigil</b> between strikes.`}},
    {l:'Everyone touches the stone',sub:'Every unit +1 Spd and loses 5 HP',go:async()=>{run.roster.forEach(u=>u.spd++);hurtAll(5);sfx('thunder');return'The jolt knocks everyone flat. Faster for it (+1 Spd), but singed (−5 HP).'}}]},
  cache:{t:'The Specialist’s Cache',art:'cache',d:'A sealed quartermaster’s cache. Each crate is stencilled for a different trade.',o:null,
    make:()=>{const has=f=>run.roster.some(f),o=[];
      if(has(u=>CLS[u.cls].w.includes('bow')))o.push('longbow');if(has(u=>isRoleU(u,'rogue')))o.push('throwingKnives');if(has(u=>isRoleU(u,'support')))o.push('farStaff');
      if(has(u=>canUse(u,'sparkSigil')))o.push('sparkSigil');if(has(u=>isRoleU(u,'summoner')))o.push('runeStaff');if(o.length<2)o.push(pick(['knightlySword','steelSpear','cleaver']));
      return[...o.slice(0,3).map(k=>({l:`Open the ${IT[k].n} crate`,sub:itemText(k),go:async()=>{const u=await giveTo(k);return u&&`${u.name} takes the <b>${IT[k].n}</b>.`}})),{l:'Leave it sealed',go:async()=>'Not your trade.'}]}},
  veteran:{t:'The Old Veteran',art:'veteran',d:'A grey-bearded soldier sits by a fire, sharpening a notched blade. “Sit. I’ve stories, if you’ve time.”',o:[
    {l:'Hear his stories',sub:'Every unit gains 20 EXP',go:async()=>{await expAll(run.roster,20);return'Old wars, old mistakes. Every unit gains 20 EXP.'}},
    {l:'Ask him to train one',sub:'One unit gains 60 EXP',go:async()=>{const u=await pickUnit('Who trains with him?','They gain 60 EXP.');if(!u)return null;await expAll([u],60);return`The veteran drills ${u.name} until dark. 60 EXP.`}}]},
  statue:{t:'Statue of Valour',art:'statue',d:'A stone hero, sword raised. People leave offerings at its feet, and some say it answers.',o:[
    {l:'One unit kneels',sub:'+2 Str or Mag for good',go:async()=>{const u=await pickUnit('Who kneels?','+2 Str (Mag for casters) for good.');if(!u)return null;const s=powS(u);bump(u,s,2);sfx('ding');return`${u.name} rises stronger (+2 ${SN[s]}).`}},
    {l:'Everyone leaves an offering',sub:'Every unit +1 Def',go:async()=>{run.roster.forEach(u=>u.def++);sfx('ding');return'The stone seems to nod. Every unit gains 1 Def.'}}]},
  toll:{t:'The Toll Bridge',art:'bridge',d:'Armed thugs block the only bridge. “Forty gold for the lot of you.”',o:[
    {l:'Pay the toll',sub:'40 gold',cost:40,go:async()=>{spend(40);return'They step aside, grinning.'}},
    {l:'Fight through',sub:'Every unit gains 20 EXP and loses 5 HP',go:async()=>{await expAll(run.roster,20);hurtAll(5);return'You clear the bridge. Everyone gains 20 EXP, but the squad is bruised (−5 HP).'}}]},
  witch:{t:'The Bog Witch',art:'witch',fig:['witch','cauldron'],d:'A crooked hut, a bubbling pot, and a woman who already knows your names. “At least stay for a cup of tea, won’t you?”',o:[
    {l:'Rest for a while',sub:'Every unit heals to full HP',go:async()=>{run.roster.forEach(u=>u.hp=u.maxhp);sfx('heal');return'You doze by the fire while the pot bubbles. Everyone wakes up fully healed.'}},
    {l:'Stay for a drink',sub:'One unit +1 Res and +2 max HP for good',go:async()=>{const u=await pickUnit('Who drinks?','+1 Res and +2 max HP for good.');if(!u)return null;bump(u,'res',1);bump(u,'hp',2);sfx('heal');return`${u.name} gags it down. +1 Res, +2 max HP.`}},
    {l:'Back away',go:async()=>'“Another time, then.”'}]},
  fog:{t:'The Strange Fog',art:'fog',d:'A thick white fog rolls over the road. There’s a shortcut through it, if you trust your feet.',o:[
    {l:'Take the shortcut',sub:'Every unit gains 25 EXP and loses 5 HP',go:async()=>{await expAll(run.roster,25);hurtAll(5);return'You stumble out the far side hours later. Everyone gains 25 EXP, but the squad is battered (−5 HP).'}},
    {l:'Send a scout ahead',sub:'One unit gains 50 EXP, but drops to half HP',go:async()=>{const u=await pickUnit('Who scouts ahead?','+50 EXP, but drops to half HP.');if(!u)return null;await expAll([u],50);u.hp=Math.min(u.hp,Math.ceil(u.maxhp/2));return`${u.name} vanishes into the white and returns at dusk, scratched up but sharper for it.`}},
    {l:'Wait for it to lift',go:async()=>'By noon the road is clear.'}]},
  chest:{t:'A Suspicious Chest',art:'chest',fig:'chest',d:'A fine chest sits alone in the middle of the road. Nobody around. Nobody at all.',o:[
    {l:'Open it',sub:'Gold, or an ambush',go:async()=>{if(rand()<.65){run.gold=gold()+70;sfx('fanfare');return'70 gold, and no catch. Lucky.'}hurtAll(5);sfx('broke');return'It’s a trap. Everyone loses 5 HP.'}},
    {l:'Leave it',go:async()=>'You give it a wide berth.'}]},
  library:{t:'The Ruined Library',art:'library',d:'Half the roof is gone, but the shelves still stand. Rain has spared a few tomes.',o:[
    {l:'Study the tomes',sub:'Casters, Menders and Summoners gain 35 EXP; others 10',go:async()=>{evEl.hidden=true;const m=run.roster.filter(u=>CLS[u.cls].w.includes('art')||CLS[u.cls].w.includes('spirit'));await expAll(m,35);await expAll(run.roster.filter(u=>!m.includes(u)),10);return'A long afternoon of reading. The spellcasters gain 35 EXP, everyone else 10.'}},
    {l:'Take the storm tome',sub:'The Spark Sigil',need:()=>canAny('sparkSigil'),go:async()=>{const u=await giveTo('sparkSigil');return u&&`${u.name} pockets the <b>Spark Sigil</b>.`}}]},
  /* Act 2 only */
  star:{t:'The Fallen Star',act:2,ok:()=>run.roster.some(u=>u.cast==='ash'),art:'crater',fig:'meteor',d:'A crater, still smoking. At its heart a sigil has burned itself into the star-iron.',o:[
    {l:'Take the Meteor Sigil',sub:'Ash takes it: Rng 3–10, 5 uses, huge damage',go:async()=>{const u=run.roster.find(u=>u.cast==='ash');if(!await stow(u,'meteorSigil'))return null;sfx('item');return `${u.name} pries the <b>Meteor Sigil</b> free. It’s warm to the touch.`}},
    {l:'Sell the star-iron',sub:'+80 gold',go:async()=>{run.gold=gold()+80;sfx('item');return'The iron fetches 80 gold in the next town.'}}]},
  spire:{t:'The Storm Spire',act:2,art:'spire',d:'A tower that drinks lightning. At the top, a sigil and a staff hang in the air, waiting.',o:[
    {l:'Take Heaven’s Bolt',sub:'Corvin only: long-range lightning sigil, Rng 3–10, 5 uses',need:()=>run.roster.some(u=>u.cast==='corvin'),go:async()=>{const u=run.roster.find(u=>u.cast==='corvin');if(!await stow(u,'heavensBolt'))return null;sfx('item');return `${u.name} takes <b>Heaven’s Bolt</b>. The sky rumbles.`}},
    {l:'Take the Far Charm',sub:'Menders only: a ranged heal, Rng 1–10',need:()=>run.roster.some(u=>isRoleU(u,'support')),go:async()=>{const u=await pickUnit('Who takes the Far Charm?',itemText('farStaff'),u=>isRoleU(u,'support')?null:'Menders only');if(!u||!await stow(u,'farStaff'))return null;sfx('item');return `${u.name} takes the <b>Far Charm</b>.`}},
    {l:'Climb to the top',sub:'Every unit +1 Spd and +1 Luck, and loses 5 HP',go:async()=>{run.roster.forEach(u=>{u.spd++;u.lck++});hurtAll(5);sfx('thunder');return'Struck, all of you. Every unit gains 1 Spd and 1 Luck, but is singed (−5 HP).'}}]},
  oracle:{t:'The Oracle',act:2,art:'oracle',d:'A blindfolded oracle turns a crystal in her hands. “I see what each of you lacks.”',o:[
    {l:'Hear your weakness',sub:'Every unit +1 to their lowest stat',go:async()=>{const t=run.roster.map(u=>{const s=shown(u).filter(k=>k!=='hp').sort((a,b)=>u[a]-u[b])[0];bump(u,s,1);return`${u.name} +1 ${SN[s]}`});sfx('ding');return t.join(', ')+'.'}},
    {l:'A full reading',sub:'One unit levels up',cost:50,go:async()=>{const u=await pickUnit('Whose fortune?','They gain a level.',u=>u.lv>=20?'Max level':null);if(!u)return null;spend(50);await expAll([u],100-u.exp);return`The oracle smiles at ${u.name}.`}}]},
  sage:{t:'The Mountain Sage',act:2,art:'sage',d:'A sage sits on a peak above the clouds. He opens one eye. “You may listen, or rest. It would be wise to wait before continuing.”',o:[
    {l:'Meditate with the sage',sub:'Every unit gains 30 EXP',go:async()=>{await expAll(run.roster,30);return'The sage breathes, and you breathe with him. When you open your eyes, the world feels clearer. Every unit gains 30 EXP.'}},
    {l:'Rest below',sub:'Every unit heals 10 HP',go:async()=>{run.roster.forEach(u=>u.hp=Math.min(u.maxhp,u.hp+10));sfx('heal');return'Every unit rests up before continuing.'}}]}
});
/* ---- region events: each only turns up in its own region ---- */
const inReg=id=>()=>actBiome().id===id;
Object.assign(EVENTS,{
  onyx:{t:'The Black Onyx',art:'shrine',ok:inReg('cavern'),d:'Deep in a side tunnel, a shard of black onyx pulses like a slow heartbeat. The air around it is still: it’s drinking in the wild mana of the caves.',o:[
    {l:'Take the shard',sub:'Relic: crystal creatures deal 1 less damage to you',go:async()=>{run.relics.push('onyx');sfx('dark');return'The shard is cold and heavy. The crystals nearby dim as you pass.'}},
    {l:'Leave it',go:async()=>'Some things are better left in the dark.'}]},
  ankh:{t:'The Sinking Sands',art:'idol',ok:inReg('desert'),d:'Half sunk in the quicksand, a golden ankh glints in the sun. Reaching it means wading in.',o:[
    {l:'Wade in for it',sub:'Relic: every unit +1 Def; every unit −1 Spd for good',go:async()=>{run.roster.forEach(u=>bump(u,'spd',-1));run.relics.push('ankh');sfx('item');return'You haul it out, and the sand nearly has you. The ankh is yours (+1 Def), but every unit loses 1 Spd.'}},
    {l:'Leave it',go:async()=>'The sand can keep it.'}]},
  icecache:{t:'The Frozen Cache',art:'cache',ok:inReg('snow'),d:'Under a sheet of blue ice, someone stashed supplies and never came back. The only path down is glassy and steep.',o:[
    {l:'Climb down',sub:'Pick 1 of 2 relics; someone slips and takes 2 damage',go:async()=>{const v=pick(run.roster);v.hp=Math.max(1,v.hp-2);const k=await relicPick(2,['c','u'],'The Frozen Cache','Chip one free before the ice closes over again.');return`${v.name} slips on the way down (−2 HP).${k?` You dig out <b>${RELICS[k].n}</b>.`:''}`}},
    {l:'Leave it',go:async()=>'Not worth a broken neck.'}]},
  dwarf:{t:'The Dwarf Smith',art:'smith',ok:inReg('mountain'),d:'A dwarf works an anvil on the lip of a lava flow. “Best heat on the isle. I’ll do one for you, no charge. I like the look of you.”',o:[
    {l:'Hand over a weapon',sub:'Reforge one weapon +1, free',need:()=>run.roster.some(u=>weaponOf(u)&&forgeLv(weaponOf(u))<FORGE_MAX),go:async()=>{const u=await pickUnit('Whose weapon?','It gains +1 (up to +3).',u=>!weaponOf(u)?'No weapon':forgeLv(weaponOf(u))>=FORGE_MAX?'Already +3':null);if(!u)return null;const it=weaponOf(u);forge(it);sfx('item');return`The dwarf hammers it in the lava light. <b>${IT[it.k].n}</b>.`}},
    {l:'Leave',go:async()=>'“Suit yourself.”'}]},
  tailor:{t:'The Tailor',art:'merchant',ok:inReg('mountain'),d:'A tailor sells fireproof cloth from a cart at the foot of the volcano. “Heat-proofed by hand. You’ll thank me later.”',o:[
    {l:'Buy a heat-proof cloak',sub:'One unit +3 Res for good',cost:50,go:async()=>{const u=await pickUnit('Who wears it?','+3 Res for good.');if(!u)return null;spend(50);bump(u,'res',3);sfx('item');return`${u.name} looks very smart in it. +3 Res.`}},
    {l:'Buy the imbued gloves',sub:'Relic: every unit +2 Res',cost:100,go:async()=>{spend(100);run.relics.push('gloves');sfx('fanfare');return'Enough pairs for everyone, each stitched with a warding rune. Every unit gains 2 Res.'}},
    {l:'Leave',go:async()=>'“Your loss.”'}]},
  gnome:{t:'The Gnome Scholar',art:'library',ok:inReg('forest'),d:'A gnome sits on a stump, surrounded by crystal shards and very full notebooks. “I’m not much of a fighter, but I’m happy to share what I know for the cause.”',o:[
    {l:'Take his research notes',sub:'Relic: +2 damage against crystal creatures',go:async()=>{run.relics.push('notes');sfx('item');return'“Hit them where the facets meet. Trust me.” You take the notes.'}},
    {l:'Hear him out',sub:'Every unit gains 20 EXP',go:async()=>{await expAll(run.roster,20);return'He talks until sunset. Every unit gains 20 EXP.'}}]}
});
/* ---- act 3 events: only these appear on the road to the Crystal Heart ---- */
Object.assign(EVENTS,{
  echo:{t:'Ithren’s Echo',act:3,art:'sage',d:'The air shivers, and Ithren’s voice comes through the crystal, faint and far away. “You’re close now. I can give you one thing. Choose.”',o:[
    {l:'“Mend us”',sub:'Everyone heals fully',go:async()=>{run.roster.forEach(u=>u.hp=u.maxhp);sfx('heal');return'Warmth runs through the squad, and every wound closes.'}},
    {l:'“Sharpen us”',sub:'Every unit +1 Str and +1 Mag',go:async()=>{run.roster.forEach(u=>{bump(u,'str',1);bump(u,'mag',1)});sfx('ding');return'Your hands steady. Every unit gains 1 Str and 1 Mag.'}},
    {l:'“Shield us”',sub:'Every unit +2 Res',go:async()=>{run.roster.forEach(u=>bump(u,'res',2));sfx('ding');return'A pale light settles over the squad. Every unit gains 2 Res.'}}]},
  fallen:{t:'Those Who Came Before',act:3,art:'battlefield',d:'Another squad got this far. Their gear lies where they fell, half grown over with red crystal.',o:null,make:()=>{
    const last=(prof.hist||[]).flatMap(h=>h.fallen||[])[0];if(last)EVENTS.fallen.d=`Another squad got this far. Their gear lies where they fell, half grown over with red crystal. One of the blades is ${last.n}’s.`;return[
    ...(last?[{l:`Take ${last.n}’s keepsake`,sub:'Pick 1 of 2 relics',go:async()=>{const k=await relicPick(2,['u','r'],`${last.n}’s keepsake`,'They carried it this far. It can go a little further.');return k&&`You take <b>${RELICS[k].n}</b> from ${last.n}’s pack. It feels right that it goes on.`}}]:[]),
    {l:'Bury them',sub:'Every unit gains 30 EXP',go:async()=>{await expAll(run.roster,30);return'You do what you can for them. The squad goes on quieter (+30 EXP).'}}]}}
});
async function eventNode(){
  /* act 3 only draws act-3 events; acts 1 and 2 never do */
  const A3=(run.act||1)>=3,ks=Object.keys(EVENTS).filter(k=>(A3?EVENTS[k].act===3:!EVENTS[k].act||EVENTS[k].act===(run.act||1))&&(!EVENTS[k].ok||EVENTS[k].ok())),seen=run.seenEv=run.seenEv||[],fresh=ks.filter(k=>!seen.includes(k)),ek=pick(fresh.length?fresh:ks),E=EVENTS[ek],opts=(E.card=null,E.o||E.make());seen.push(ek);
  music(actBiome().id);
  for(;;){
    const m=await evShow(E,E.d,opts.map((x,i)=>{const poor=x.cost&&gold()<x.cost,none=x.need&&!x.need();return[String(i),x.l,(x.sub||'')+(poor?' (not enough gold)':none?' (nobody can use it)':''),poor||none]}));
    const r=await opts[+m].go();evEl.hidden=false;
    if(r==null)continue;
    await evShow(E,r,[['ok','Continue','']]);evEl.hidden=true;evEl.onclick=null;return;
  }
}

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function healerArt(){return art('npcs/healer')}
function cageBarsArt(){return art('scenes/cage-bars')}
