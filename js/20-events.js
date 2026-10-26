/* Event scenes, events, woes and event helpers */
/* ---- events: a scene of what's happening, a short text, and choices. Each choice's go() returns the outcome text, or null to step back. ---- */
const REG_SKY={mushroom:['#2a2040','#5a3a6a','#8a5a8a'],shadow:['#14121e','#24223a','#3a3450'],swamp:['#1a2a24','#2e4a3a','#4a6a4a'],forest:['#1a221c','#2e3a2e','#4a5240'],
  mountain:['#2a1414','#5a2a1e','#a8482a'],ship:['#26304a','#56668c','#8e9ab8'],labyrinth:['#141218','#24202c','#34303e'],
  desert:['#c8783a','#e8a85a','#f3d08a'],snow:['#4a6a9a','#8aaad0','#c8daf0'],cavern:['#120e1a','#221a2e','#342a44']};
const REG_GROUND={mushroom:'#4e4058',shadow:'#34303c',swamp:'#3f5a4a',forest:'#3e4436',mountain:'#3a3034',ship:'#7a5230',labyrinth:'#4a4652',desert:'#c9a060',snow:'#e4ecf4',cavern:'#3a3444'};
function eventScene(prop){
  const B=actBiome(),c='EV|'+prop+'|'+B.id;if(sprCache[c])return sprCache[c];
  const W=160,H=90,p=Px(W,H),sky=REG_SKY[B.id]||REG_SKY.forest,gr=REG_GROUND[B.id]||'#3e4436';
  if(['smith','spar','witch','library','armoury'].includes(prop)){const wl=prop==='witch'?'#3a3028':'#4a4038',wl2=shade(wl,.8);p.rect(0,0,W,64,wl);for(let y=0;y<64;y+=8)for(let x=(y/8%2)*8;x<W;x+=16)p.rect(x,y,15,7,wl2);
    p.rect(142,14,14,18,sky[2]);p.rect(142,14,14,6,sky[1]);p.rect(148,14,2,18,'#2a1e14');p.rect(142,22,14,2,'#2a1e14');
    for(const x of[0,52,104])p.rect(x,0,6,64,'#3a2a1a');p.rect(0,0,W,5,'#3a2a1a');p.rect(0,62,W,28,'#6a4a2a');for(let y=64;y<90;y+=5)p.rect(0,y,W,1,'#4a3218');for(let i=0;i<14;i++)p.rect((i*37)%W,64+((i*13)%5)*5,1,5,'#4a3218')}
  else{sky.forEach((col,i)=>p.rect(0,i*20,W,20,col));p.rect(0,60,W,30,gr);for(let i=0;i<40;i++)p.set((i*41)%W,62+(i*17)%26,shade(gr,i%2?1.15:.85));
  p.poly([[0,60],[20,48],[44,58],[70,46],[100,58],[126,44],[160,56],[160,60]],shade(sky[0],1.1));}
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
    p.ell(84,66,16,7,'#2a2630');p.ell(84,61,13,4,'#7fd36a');for(const[x,y]of[[78,55],[88,52],[83,48]])p.ell(x,y,2,2,'#a8f08a');S(70,70,4,6,INK);S(94,70,4,6,INK);
    S(118,38,12,26,'#3a2a4a');p.poly([[114,38],[134,38],[124,22]],'#3a2a4a');p.ell(124,40,4,4,'#c9a080');p.set(122,40,INK);p.set(126,40,INK);p.line(112,50,104,58,'#3a2a4a',2);S(130,46,3,18,WD)}
  if(prop==='fog'){S(76,30,2,30,WD);p.poly([[78,30],[90,33],[78,36]],'#efe6cf');p.line(40,62,60,40,'#5a4a3a');p.line(120,64,100,42,'#5a4a3a')}
  if(prop==='chest'){S(64,52,32,16,WD);p.ell(80,52,16,6,WD,(x,y)=>y<=52);S(64,56,32,2,G);S(78,54,4,6,G);for(const[x,y]of[[40,40],[120,36],[132,46],[28,48]]){p.set(x,y,'#ff3a3a');p.set(x+3,y,'#ff3a3a')}}
  if(prop==='library'){for(const x of[24,68,112]){S(x,22,26,46,WD2);for(let r=0;r<4;r++){S(x+1,25+r*10,24,1,WD);for(let b=0;b<8;b++)S(x+2+b*3,26+r*10,2,8,['#c8322e','#3a6a9a','#7fd36a','#c9a050','#8a4ab0'][(b+r+x)%5])}}
    p.ell(98,70,9,3,ST1);p.ell(58,72,5,2,ST2);S(54,66,10,4,'#e8dcc0');S(55,66,4,4,'#d8ccb0');p.ell(150,40,3,4,'#ffd27a')}
  if(prop==='crater'){p.line(10,4,70,48,'#ffd27a',2);p.line(14,4,72,46,'#fff2b0');p.ell(80,64,30,8,'#2a2026');p.ell(80,62,24,5,'#4a3a3a');p.ell(80,58,9,7,'#a8482a');p.ell(80,57,5,4,'#ff8a3c');p.ell(79,56,2,2,YL);
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
/* the cage's bars, drawn over the traveller inside */
function cageBarsArt_draw(){if(sprCache.CAGEBARS)return sprCache.CAGEBARS;const p=Px(160,90);for(let x=60;x<=100;x+=8){p.rect(x,33,1,34,METAL);p.rect(x+1,33,1,34,'#5a6070')}p.rect(58,30,44,3,METAL2);p.rect(58,30,44,1,METAL);p.rect(58,67,44,3,METAL2);p.ring(93,42,2.5,GOLD);p.set(93,45,GOLD);return sprCache.CAGEBARS=p.url()}
function evShow(E,text,opts){
  evEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${eventScene(E.art)}" alt="">${E.ov&&E.card?E.ov:''}<span class="tv-gold">${gold()} gold</span></div>
    <div class="tv-box"><div class="tv-name">${E.t}</div><p class="tv-text">${text}</p>${E.card&&opts.length>1?E.card:''}<div class="tv-opts">${opts.map(([k,l,sub,dis])=>`<button type="button" class="tv-o" data-t="${k}"${dis?' disabled':''}>${l}${sub?`<span>${sub}</span>`:''}</button>`).join('')}</div></div>`;
  evEl.hidden=false;
  return new Promise(res=>{evEl.onclick=e=>{const b=e.target.closest('[data-t]');if(!b||b.disabled)return;sfx('tick');res(b.dataset.t)}});
}
const lvAvg=()=>Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length));
const EVENTS={
  smith:{t:'The Wandering Smith',art:'smith',d:'A smith with a cart-mounted forge waves you over. “One weapon, no charge. I like the look of you.”',o:[
    {l:'Reforge a weapon',sub:'+2 Mt and +5 Hit (charms heal +5), up to +3',go:async()=>{
      const u=await pickUnit('Whose weapon?','Choose a weapon to reforge.',u=>{const w=weaponOf(u);return!w?'No weapon':forgeLv(w)>=FORGE_MAX?'Already +3':null});
      if(!u)return null;const w=weaponOf(u),old=IT[w.k].n;forge(w);if(R('anvil'))forge(w);sfx('item');return`Sparks fly. ${u.name}’s ${old} comes back as the <b>${IT[w.k].n}</b>: Mt ${IT[w.k].mt}, Hit ${IT[w.k].hit}.`}},
    {l:'Move on',go:async()=>'You thank the smith and keep walking.'}]},
  armoury:{t:'Abandoned Armoury',art:'armoury',d:'Racks of old weapons, most rusted through. A few are still good, and there are medicine jars on a shelf.',o:[
    {l:'Take a steel weapon',sub:'One unit gets the steel version of their weapon',go:async()=>{
      const u=await pickUnit('Who takes a weapon?','Only fighters with blades, axes, lances or bows can use these.',u=>!STEEL[CLS[u.cls].w[0]]?'Nothing for them':full(u));
      if(!u)return null;const st=STEEL[CLS[u.cls].w[0]];sfx('item');
      u.items.push({k:st,u:IT[st].uses});return`${u.name} pulls a <b>${IT[st].n}</b> from the rack. Mt ${IT[st].mt}, Wt ${IT[st].wt}.`}},
    {l:'Take the medicine',sub:'2 Salves',go:async()=>{evEl.hidden=true;const a=await giveTo('qiPill','The first of two Salves.',true),b=await giveTo('qiPill','The second Salve.',true);evEl.hidden=false;return[a,b].filter(Boolean).map(u=>`${u.name} takes a Salve.`).join(' ')||'You leave the medicine on the shelf.'}}]},
  /* the spellcasters' version of the armoury: a sigil or charm is enchanted (+1, like the smith) */
  enchanter:{t:'The Enchanter’s Study',art:'library',d:'A tower room full of half-finished sigils. The enchanter left in a hurry, but the inks are still wet.',o:[
    {l:'Enchant a sigil or charm',sub:'+2 Mt and +5 Hit (charms heal +5), up to +3',need:()=>run.roster.some(u=>{const w=weaponOf(u);return w&&['art','spirit'].includes(IT[w.k].t)}),go:async()=>{
      const u=await pickUnit('Whose sigil or charm?','Sigils hit harder; charms heal more.',u=>{const w=weaponOf(u);return!w||!['art','spirit'].includes(IT[w.k].t)?'No sigil or charm':forgeLv(w)>=FORGE_MAX?'Already +3':null});
      if(!u)return null;const w=weaponOf(u),old=IT[w.k].n;forge(w);sfx('item');return`${u.name} copies the enchanter’s runes onto their ${old}. It is now the <b>${IT[w.k].n}</b>.`}},
    {l:'Read the notes',sub:'Casters, Menders and Summoners gain 40 EXP',go:async()=>{await expAll(run.roster.filter(u=>CLS[u.cls].w.includes('art')||CLS[u.cls].w.includes('spirit')),40);return'Dense, but worth it. The spellcasters gain 40 EXP.'}}]},
  shrine:{t:'Shrine of Trial',art:'shrine',d:'A cracked altar, still warm. Words cut into the stone: <i>give blood, and be taught</i>.',o:[
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
    make:()=>{const stock=shuffle(['warHammer','huntSpear','giantslayer','holySword','steelJian','steelSpear','steelAxe','steelBow','leather','cloak','boots','gauntlet','greaterMend','stiletto']).slice(0,3),price=k=>IT[k].t==='gear'?40:IT[k].brk||IT[k].crit>=20?55:45;
      return[...stock.map(k=>({l:`${IT[k].n} · ${price(k)}g`,sub:itemText(k),cost:price(k),go:async()=>{
        const u=await pickUnit(`Who takes the ${IT[k].n}?`,'Units with full inventories can’t carry it.',u=>full(u)||(isWpn(k)&&!canUse(u,k)?'Can’t wield it':null));if(!u)return null;
        spend(price(k));u.items.push({k,u:IT[k].uses});return`${u.name} takes the <b>${IT[k].n}</b>. “Pleasure doing business.”`}})),{l:'Just looking',go:async()=>'The merchant shrugs and waves you on.'}]}},
  gamble:{t:'Gambler’s Table',art:'gamble',d:'A grinning stranger rattles two dice in a cup. “Double or nothing, friend?”',o:[
    {l:'Bet 30 gold',sub:'Even odds to win 60',cost:30,go:async()=>{spend(30);if(rand()<.5){run.gold+=60;sfx('fanfare');return'Two sixes. The stranger laughs and pays out 60 gold.'}sfx('broke');return'Snake eyes. The stranger pockets your 30 gold.'}},
    {l:'Walk away',go:async()=>'“Suit yourself.”'}]},
  idol:{t:'The Golden Idol',art:'idol',d:'A golden idol with ruby eyes sits on a plinth. It hums. Everyone feels it watching.',o:[
    {l:'Take it',sub:'Gain a rare relic; every unit loses 2 max HP for good',go:async()=>{const k=pick(relicPool(['r']));if(!k)return'The plinth is empty.';run.relics.push(k);run.roster.forEach(u=>{u.maxhp=Math.max(10,u.maxhp-2);u.hp=Math.min(u.hp,u.maxhp)});sfx('earth');return`The eyes go dark. You carry away the <b>${RELICS[k].n}</b>: ${RELICS[k].d} Everyone feels a little weaker (−2 max HP).`}},
    {l:'Leave it',go:async()=>'You back away slowly. The humming stops when it’s out of sight.'}]},
  cage:{t:'The Caged Traveller',art:'cage',d:'A traveller sits in a monster’s cage, half starved. “Get me out of here and I’ll fight for you.”',o:null,make:()=>{const nu=genUnit(lvAvg());EVENTS.cage.card=`<div class="dcard on ev-card">${unitCard(nu)}</div>`;EVENTS.cage.ov=`<img class="ev-ov" src="${uSpr(nu)}" alt=""><img class="tv-bg" src="${cageBarsArt()}" alt="">`;return[
    {l:'Break the lock',sub:`${nu.name} joins your squad`,go:async()=>{
      if(run.roster.length>=TEAM_CAP){const d=await modal(`<h2>Who stays behind?</h2><p>${nu.name} (${CLS[nu.cls].n}) takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);
        if(d==='skip')return null;run.roster.splice(+d.slice(1),1)}
      run.roster.push(nu);sfx('item');return`The lock gives. <b>${nu.name}</b>, a ${CLS[nu.cls].n}, joins the squad.`}},
    {l:'Leave them',go:async()=>'You walk on. The traveller’s shouts follow you a long way.'}]}},
  spring:{t:'Healing Spring',art:'spring',d:'A clear spring bubbles up between the rocks. The water glows faintly.',o:[
    {l:'One unit bathes',sub:'+3 max HP for good',go:async()=>{const u=await pickUnit('Who bathes in the spring?','They gain 3 max HP for good.');if(!u)return null;u.maxhp+=3;u.hp+=3;sfx('heal');return`${u.name} climbs out feeling years younger. Max HP ${u.maxhp}.`}},
    {l:'Everyone drinks',sub:'Every unit gains +1 Res',go:async()=>{run.roster.forEach(u=>u.res++);sfx('heal');return'The water tastes of rain. Every unit gains 1 Res.'}}]},
  well:{t:'Wishing Well',art:'well',d:'An old stone well, its bottom lost in the dark. Coins glint far below.',o:[
    {l:'Toss in 25 gold',sub:'Every unit gains +1 Luck',cost:25,go:async()=>{spend(25);run.roster.forEach(u=>u.lck++);sfx('ding');return'The coins vanish without a sound. Every unit feels luckier (+1 Luck).'}},
    {l:'Fish for coins',sub:'Win some gold, but someone might get hurt',go:async()=>{if(rand()<.6){const g=ri(20,45);run.gold+=g;sfx('item');return`You haul up a bucket of old coins: ${g} gold.`}const u=pick(run.roster);u.maxhp=Math.max(10,u.maxhp-2);u.hp=Math.min(u.hp,u.maxhp);sfx('broke');return`The rope snaps. ${u.name} cuts their hands badly on the way up (−2 max HP).`}},
    {l:'Leave it',go:async()=>'You keep your coins.'}]},
  battlefield:{t:'Old Battlefield',art:'battlefield',d:'Rusted armour and broken weapons litter the ground. Whatever happened here was a long time ago.',o:[
    {l:'Search the dead',sub:'Find a weapon or gear; it may cost you',go:async()=>{const k=pick(['steelJian','steelSpear','steelAxe','steelBow','moonDao','barbedSpear','reaverAxe','hawkeyeBow','chain','leather','gauntlet']);evEl.hidden=true;const u=await giveTo(k,'Pulled from the mud.',true);evEl.hidden=false;
      let t=u?`${u.name} pulls a <b>${IT[k].n}</b> from the mud.`:`You leave the ${IT[k].n} in the mud.`;
      if(rand()<.35){const v=pick(run.roster);v.maxhp=Math.max(10,v.maxhp-2);v.hp=Math.min(v.hp,v.maxhp);t+=` ${v.name} is cut by old blades in the search (−2 max HP).`}sfx('item');return t}},
    {l:'Pay respects',sub:'Every unit gains 20 EXP',go:async()=>{evEl.hidden=true;for(const u of run.roster){const g=gainExp(u,20);if(g&&g.gains)await levelUp(u,g)}return'You bury what you can. The squad marches on quieter, and wiser (+20 EXP).'}}]}
};
/* ---- woes: bad luck from events that lasts a fight or two (shown on the map in red) ---- */
const WOES={wound:{n:'Ambushed',d:'Every unit starts the next fight 5 HP down'},weary:{n:'Weary Legs',d:'Every unit has −1 Move'},marked:{n:'Marked',d:'Enemies would rather attack this unit'}};
const Wo=id=>!!(run&&run.woes&&run.woes.some(w=>w.id===id&&w.n>0));
const markedU=u=>u.team==='p'&&!!(run&&run.woes&&run.woes.some(w=>w.id==='marked'&&w.u===u.id));
function addWoe(id,n,u){(run.woes=run.woes||[]).push({id,n,u:u&&u.id,nm:u&&u.name})}
const woeText=w=>`<b>${WOES[w.id].n}${w.nm?': '+w.nm:''}.</b> ${WOES[w.id].d} for ${w.n} more fight${w.n>1?'s':''}.`;
function woeArt_draw(id){const c='WO|'+id;if(sprCache[c])return sprCache[c];const p=Px(16,16);
  if(id==='wound'){p.line(3,13,13,3,'#c8322e',2);p.line(3,3,13,13,'#c8322e',2);p.ell(8,8,2,2,'#ff8a7a')}
  if(id==='weary'){p.rect(3,6,4,7,'#7a5230');p.rect(3,11,6,3,'#7a5230');p.rect(10,3,2,6,'#c8322e');p.poly([[8,9],[14,9],[11,13]],'#c8322e')}
  if(id==='marked'){p.ring(8,8,6,'#c8322e');p.ring(8,8,3,'#c8322e');p.ell(8,8,1.2,1.2,'#ff8a7a');p.line(8,0,8,4,'#c8322e');p.line(8,12,8,15,'#c8322e')}
  p.outline(OUT);return sprCache[c]=p.url()}
/* ---- event helpers ---- */
async function expAll(us,n){evEl.hidden=true;for(const u of us){let left=n;while(left>0){const g=gainExp(u,Math.min(100,left));left-=100;if(g&&g.gains)await levelUp(u,g)}}}
function bump(u,s,n){if(s==='hp'){u.maxhp+=n;u.hp+=n}else u[s]+=n}
const SN={hp:'max HP',str:'Str',mag:'Mag',lck:'Luck',spd:'Spd',def:'Def',res:'Res'};
const powS=u=>usesMag(u)?'mag':'str';
const isRoleU=(u,r)=>u.cls.startsWith(`G.${r}.`);
const canAny=k=>run.roster.some(u=>canUse(u,k));
/* the jade (killer) weapon that suits a unit, if any */
const jadePick=()=>{const ks=[...new Set(run.roster.map(jadeFor).filter(Boolean))];return ks.length?pick(ks):'jadeJian'};
function jadeFor(u){if(isRoleU(u,'rogue'))return'jadeFang';const m={blade:'jadeJian',pole:'jadeSpear',heavy:'jadeAxe',bow:'jadeBow',art:'thunderhead'};for(const t of CLS[u.cls].w)if(m[t])return m[t];return null}
/* every item the squad gains goes through this picker; found=true shows it as "Found: X" with a Leave it option */
async function giveTo(k,why,found){const u=await pickUnit(found?`Found: ${IT[k].n}`:`Who takes the ${IT[k].n}?`,found?`${why?why+' ':''}${itemText(k)}`:why||itemText(k),u=>full(u)||(isWpn(k)&&!canUse(u,k)?'Can’t wield it':null),found?'Leave it':'Cancel');if(!u)return null;u.items.push({k,u:IT[k].uses});sfx('item');return u}
Object.assign(EVENTS,{
  jadetomb:{t:'The Jade Tomb',art:'tomb',d:'A warrior’s tomb, its door carved from a single slab of jade. Inside, the grave goods are still bright.',o:null,make:()=>{const k=jadePick();return[
    {l:`Take the ${IT[k].n}`,sub:itemText(k),go:async()=>{const u=await giveTo(k,'Jade weapons crit far more often.');return u&&`${u.name} lifts the <b>${IT[k].n}</b> from its rest. Mt ${IT[k].mt}, Crit ${IT[k].crit}.`}},
    {l:'Pry out the jade eyes',sub:'+70 gold; someone is Marked for 2 fights',go:async()=>{run.gold=gold()+70;const v=pick(run.roster);addWoe('marked',2,v);sfx('broke');return`70 gold of jade comes free. Something in the dark takes note of <b>${v.name}</b>. Enemies will go for them for the next 2 fights.`}},
    {l:'Leave the dead in peace',go:async()=>'You close the door behind you.'}]}},
  stormaltar:{t:'The Storm Altar',art:'stormaltar',d:'Lightning strikes the same black altar again and again. A sigil sits in the scorch mark, crackling.',o:[
    {l:'Take the Thunderhead Sigil',sub:'A high-crit lightning sigil',need:()=>canAny('thunderhead'),go:async()=>{const u=await giveTo('thunderhead');return u&&`${u.name} snatches the <b>Thunderhead Sigil</b> between strikes.`}},
    {l:'Take the Spark Sigil',sub:'A light, quick lightning sigil',need:()=>canAny('sparkT'),go:async()=>{const u=await giveTo('sparkT');return u&&`${u.name} takes the <b>Spark Sigil</b>. Their hair stands on end.`}},
    {l:'Everyone touches the stone',sub:'Every unit +1 Spd; Ambushed next fight (−5 HP)',go:async()=>{run.roster.forEach(u=>u.spd++);addWoe('wound',1);sfx('thunder');return'The jolt knocks everyone flat. Faster for it (+1 Spd), but still singed for the next fight.'}}]},
  cache:{t:'The Specialist’s Cache',art:'cache',d:'A sealed quartermaster’s cache. Each crate is stencilled for a different trade.',o:null,
    make:()=>{const has=f=>run.roster.some(f),o=[];
      if(has(u=>CLS[u.cls].w.includes('bow')))o.push('longbow');if(has(u=>isRoleU(u,'rogue')))o.push('throwKnives');if(has(u=>isRoleU(u,'support')))o.push('farMend');
      if(has(u=>isRoleU(u,'caster')))o.push('sparkT');if(has(u=>isRoleU(u,'summoner')))o.push('runeStaff');if(o.length<2)o.push(pick(['steelJian','steelSpear','steelAxe']));
      return[...o.slice(0,3).map(k=>({l:`Open the ${IT[k].n} crate`,sub:itemText(k),go:async()=>{const u=await giveTo(k);return u&&`${u.name} takes the <b>${IT[k].n}</b>.`}})),{l:'Leave it sealed',go:async()=>'Not your trade.'}]}},
  veteran:{t:'The Old Veteran',art:'veteran',d:'A grey-bearded soldier sits by a fire, sharpening a notched blade. “Sit. I’ve stories, if you’ve time.”',o:[
    {l:'Hear his stories',sub:'Every unit gains 30 EXP',go:async()=>{await expAll(run.roster,30);return'Old wars, old mistakes. Every unit gains 30 EXP.'}},
    {l:'Ask him to train one',sub:'One unit gains 100 EXP',go:async()=>{const u=await pickUnit('Who trains with him?','They gain 100 EXP.');if(!u)return null;await expAll([u],100);return`The veteran drills ${u.name} until dark. 100 EXP.`}}]},
  statue:{t:'Statue of Valour',art:'statue',d:'A stone hero, sword raised. People leave offerings at its feet, and some say it answers.',o:[
    {l:'One unit kneels',sub:'+2 Str or Mag for good',go:async()=>{const u=await pickUnit('Who kneels?','+2 Str (Mag for casters) for good.');if(!u)return null;const s=powS(u);bump(u,s,2);sfx('ding');return`${u.name} rises stronger (+2 ${SN[s]}).`}},
    {l:'Everyone leaves an offering',sub:'Every unit +1 Def',go:async()=>{run.roster.forEach(u=>u.def++);sfx('ding');return'The stone seems to nod. Every unit gains 1 Def.'}}]},
  drill:{t:'The Drill Sergeant',art:'drill',d:'A drill sergeant barks at nobody in an empty yard. “You lot! Footwork! Now!”',o:[
    {l:'Pay for a private lesson',sub:'One unit +2 Spd for good',cost:30,go:async()=>{const u=await pickUnit('Who takes the lesson?','+2 Spd for good.');if(!u)return null;spend(30);bump(u,'spd',2);sfx('ding');return`${u.name} can barely walk afterwards, but they’re quicker (+2 Spd).`}},
    {l:'Join the free drill',sub:'Every unit +1 Spd; Weary Legs next fight (−1 Move)',go:async()=>{run.roster.forEach(u=>u.spd++);addWoe('weary',1);sfx('ding');return'Laps until everyone drops. Every unit gains 1 Spd, but legs will be heavy next fight.'}}]},
  toll:{t:'The Toll Bridge',art:'bridge',d:'Armed thugs block the only bridge. “Forty gold a head. Well, forty gold for the lot of you.”',o:[
    {l:'Pay the toll',sub:'40 gold',cost:40,go:async()=>{spend(40);return'They step aside, grinning.'}},
    {l:'Fight through',sub:'Every unit gains 30 EXP; Ambushed next fight (−5 HP)',go:async()=>{await expAll(run.roster,30);addWoe('wound',1);return'You clear the bridge. Everyone gains 30 EXP, but the squad is still bruised for the next fight.'}}]},
  witch:{t:'The Bog Witch',art:'witch',d:'A crooked hut, a bubbling pot, and a woman who already knows your names. “Coin for you, or a brew? Everything has a price.”',o:[
    {l:'Take her gold',sub:'+60 gold; a random unit is Marked for 2 fights',go:async()=>{run.gold=gold()+60;const v=pick(run.roster);addWoe('marked',2,v);sfx('dark');return`She counts out 60 gold and points a bony finger at <b>${v.name}</b>. Enemies will go for them for the next 2 fights.`}},
    {l:'Buy a brew',sub:'One unit +2 Res and +2 max HP for good',cost:25,go:async()=>{const u=await pickUnit('Who drinks?','+2 Res and +2 max HP for good.');if(!u)return null;spend(25);bump(u,'res',2);bump(u,'hp',2);sfx('heal');return`${u.name} gags it down. +2 Res, +2 max HP.`}},
    {l:'Back away',go:async()=>'“Another time, then.”'}]},
  fog:{t:'The Strange Fog',art:'fog',d:'A thick white fog rolls over the road. There’s a shortcut through it, if you trust your feet.',o:[
    {l:'Take the shortcut',sub:'Every unit gains 40 EXP; Weary Legs for 2 fights (−1 Move)',go:async()=>{await expAll(run.roster,40);addWoe('weary',2);return'You stumble out the far side hours later. Everyone gains 40 EXP, but the squad is footsore for 2 fights.'}},
    {l:'Wait for it to lift',go:async()=>'By noon the road is clear.'}]},
  chest:{t:'A Suspicious Chest',art:'chest',d:'A fine chest sits alone in the middle of the road. Nobody around. Nobody at all.',o:[
    {l:'Open it',sub:'Gold, or an ambush',go:async()=>{if(rand()<.55){run.gold=gold()+70;sfx('fanfare');return'70 gold, and no catch. Lucky.'}const v=pick(run.roster);addWoe('wound',1);addWoe('marked',1,v);sfx('broke');return`It’s a trap. Bandits scatter, but they’ll be back next fight: everyone starts 5 HP down, and they’re after <b>${v.name}</b>.`}},
    {l:'Leave it',go:async()=>'You give it a wide berth.'}]},
  library:{t:'The Ruined Library',art:'library',d:'Half the roof is gone, but the shelves still stand. Rain has spared a few tomes.',o:[
    {l:'Study the tomes',sub:'Casters, Menders and Summoners gain 60 EXP; others 20',go:async()=>{evEl.hidden=true;const m=run.roster.filter(u=>CLS[u.cls].w.includes('art')||CLS[u.cls].w.includes('spirit'));await expAll(m,60);await expAll(run.roster.filter(u=>!m.includes(u)),20);return'A long afternoon of reading. The spellcasters gain 60 EXP, everyone else 20.'}},
    {l:'Take the storm tome',sub:'The Spark Sigil',need:()=>canAny('sparkT'),go:async()=>{const u=await giveTo('sparkT');return u&&`${u.name} pockets the <b>Spark Sigil</b>.`}}]},
  /* Act 2 only */
  star:{t:'The Fallen Star',act:2,art:'crater',d:'A crater, still smoking. At its heart a sigil has burned itself into the star-iron.',o:[
    {l:'Take the Meteor Sigil',sub:'Rng 3–10, 5 uses, huge damage',need:()=>canAny('meteorT'),go:async()=>{const u=await giveTo('meteorT');return u&&`${u.name} pries the <b>Meteor Sigil</b> free. It’s warm to the touch.`}},
    {l:'Sell the star-iron',sub:'+80 gold',go:async()=>{run.gold=gold()+80;sfx('item');return'The iron fetches 80 gold in the next town.'}}]},
  spire:{t:'The Storm Spire',act:2,art:'spire',d:'A tower that drinks lightning. At the top, a sigil and a charm hang in the air, waiting.',o:[
    {l:'Take Heaven’s Bolt',sub:'Lightning sigil, Rng 3–10, 5 uses',need:()=>canAny('boltT'),go:async()=>{const u=await giveTo('boltT');return u&&`${u.name} takes <b>Heaven’s Bolt</b>. The sky rumbles.`}},
    {l:'Take the Far Charm',sub:'Heals at Rng 1–10',need:()=>canAny('farMend'),go:async()=>{const u=await giveTo('farMend');return u&&`${u.name} takes the <b>Far Charm</b>.`}},
    {l:'Climb to the top',sub:'Every unit +1 Spd and +1 Luck; Ambushed next fight',go:async()=>{run.roster.forEach(u=>{u.spd++;u.lck++});addWoe('wound',1);sfx('thunder');return'Struck, all of you. Every unit gains 1 Spd and 1 Luck, and starts the next fight singed.'}}]},
  oracle:{t:'The Oracle',act:2,art:'oracle',d:'A blindfolded oracle turns a crystal in her hands. “I see what each of you lacks.”',o:[
    {l:'Hear your weakness',sub:'Every unit +1 to their lowest stat',go:async()=>{const t=run.roster.map(u=>{const s=shown(u).filter(k=>k!=='hp').sort((a,b)=>u[a]-u[b])[0];bump(u,s,1);return`${u.name} +1 ${SN[s]}`});sfx('ding');return t.join(', ')+'.'}},
    {l:'A full reading',sub:'One unit +1 to every stat',cost:50,go:async()=>{const u=await pickUnit('Whose fortune?','+1 to every stat for good.');if(!u)return null;spend(50);shown(u).forEach(s=>bump(u,s,1));sfx('fanfare');return`The oracle smiles at ${u.name}. +1 to everything.`}}]},
  sage:{t:'The Mountain Sage',act:2,art:'sage',d:'A sage sits on a peak above the clouds. He opens one eye. “One of you. Not all.”',o:[
    {l:'Train with the sage',sub:'One unit gains 200 EXP',go:async()=>{const u=await pickUnit('Who climbs to him?','They gain 200 EXP.');if(!u)return null;await expAll([u],200);return`${u.name} comes down a week later, changed. 200 EXP.`}},
    {l:'Meditate below',sub:'Every unit gains 50 EXP',go:async()=>{await expAll(run.roster,50);return'Quiet, cold, and useful. Every unit gains 50 EXP.'}}]},
  hoard:{t:'The Dragon’s Hoard',act:2,art:'hoard',d:'A dragon’s hoard, the dragon long dead. Mostly. Something big still breathes somewhere below.',o:null,make:()=>{const k=jadePick();return[
    {l:`Grab the ${IT[k].n} and run`,sub:`${IT[k].n} + 40 gold; Ambushed and someone Marked next fight`,go:async()=>{const u=await pickUnit(`Who grabs the ${IT[k].n}?`,itemText(k),u=>full(u)||(canUse(u,k)?null:'Can’t wield it'));if(!u)return null;
      u.items.push({k,u:IT[k].uses});run.gold=gold()+40;addWoe('wound',1);addWoe('marked',1,u);sfx('fanfare');return`${u.name} grabs the <b>${IT[k].n}</b> and a fistful of gold. Something wakes. You’ll be hunted next fight, ${u.name} most of all.`}},
    {l:'Pocket some gold quietly',sub:'+40 gold',go:async()=>{run.gold=gold()+40;sfx('item');return'40 gold, and nothing stirs.'}}]}}
});
async function eventNode(){
  const ks=Object.keys(EVENTS).filter(k=>!EVENTS[k].act||EVENTS[k].act===(run.act||1)),seen=run.seenEv=run.seenEv||[],fresh=ks.filter(k=>!seen.includes(k)),ek=pick(fresh.length?fresh:ks),E=EVENTS[ek],opts=(E.card=null,E.o||E.make());seen.push(ek);
  music(actBiome().id);
  for(;;){
    const m=await evShow(E,E.d,opts.map((x,i)=>{const poor=x.cost&&gold()<x.cost,none=x.need&&!x.need();return[String(i),x.l,(x.sub||'')+(poor?' (not enough gold)':none?' (nobody can use it)':''),poor||none]}));
    const r=await opts[+m].go();evEl.hidden=false;
    if(r==null)continue;
    await evShow(E,r,[['ok','Continue','']]);evEl.hidden=true;evEl.onclick=null;return;
  }
}

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function cageBarsArt(){return art('scenes/cage-bars',()=>cageBarsArt_draw())}
function woeArt(id){return art('woes/'+id,()=>woeArt_draw(id))}
