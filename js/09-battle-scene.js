/* Hit popups and the side-on battle animation */
/* ================= FX ================= */
function pop(u,txt,cls){const p=document.createElement('div');p.className='pop '+cls;p.textContent=txt;p.style.left=u.x*T+'px';p.style.top=u.y*T+'px';boardEl.appendChild(p);setTimeout(()=>p.remove(),950)}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;vp.appendChild(d);setTimeout(()=>d.remove(),1900)}
function banner(t,c){sfx(c==='e'?'ephase':'phase');const b=document.createElement('div');b.className='banner '+c;b.textContent=t;vp.appendChild(b);setTimeout(()=>b.remove(),1150)}
function lunge(a,d){const el=uEls[a.id];if(!el)return;el.style.transform=`translate(${Math.sign(d.x-a.x)*12}px,${Math.sign(d.y-a.y)*12}px)`;setTimeout(()=>el.style.transform='',150)}
function flash(u){const el=uEls[u.id];if(!el)return;el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),120)}

/* ================= BATTLE SCENE ================= */
const bs=$('#bs'),stage=$('#stage');let fast=false,sc=null;
const D=ms=>ms*(fast?.3:1);
bs.addEventListener('click',()=>{fast=true});
function sideHTML(u,w,S){return`<div class="sn">${u.name} <span style="font-size:12px;opacity:.7">Lv ${u.lv}</span></div><div class="sw">${w?`<img src="${icon(w.key)}" alt="">${w.n}`:'—'}</div><div class="ss"><span>HIT</span><b>${S?S.hit:'–'}</b><span>DMG</span><b>${S?S.dmg:'–'}</b><span>CRT</span><b>${S?S.crit:'–'}</b></div><div class="shp"><b class="hpn">${u.hp}</b><div class="hpbar"><i style="width:${u.hp/u.maxhp*100}%"></i></div></div>`}
function centerOf(s){const r=$('#fw'+s).getBoundingClientRect(),sr=stage.getBoundingClientRect();return{x:r.left-sr.left+r.width/2,y:r.top-sr.top+r.height*.55}}
function gapPx(){const a=centerOf('l'),b=centerOf('r');return Math.max(0,Math.abs(b.x-a.x)-$('#fwl').offsetWidth*.8)}
function bnum(s,txt,cls){const c=centerOf(s),n=document.createElement('div');n.className='bnum '+(cls||'');n.textContent=txt;n.style.left=(c.x-20)+'px';n.style.top=(c.y-60)+'px';stage.appendChild(n);n.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-30px)',opacity:1,offset:.7},{transform:'translateY(-40px)',opacity:0}],{duration:D(900),fill:'forwards'}).finished.then(()=>n.remove())}
async function skillBanner(s,name){const b=$('#sk'+s);b.textContent=name;await b.animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none',offset:.2},{opacity:1,transform:'none',offset:.8},{opacity:0}],{duration:D(900)}).finished}
function hpAnim(u,to){
  const s=u===sc.L?'l':'r',side=$('#side'+s),num=side.querySelector('.hpn'),bar=side.querySelector('.hpbar i'),from=sc.hp[u.id];sc.hp[u.id]=to;
  return new Promise(res=>{const t0=performance.now(),dur=D(380);(function step(t){const k=Math.min(1,(t-t0)/dur),v=Math.round(from+(to-from)*k);num.textContent=v;bar.style.width=(v/u.maxhp*100)+'%';if(k<1)requestAnimationFrame(step);else res()})(t0)});
}
async function strikeAnim(X,Y,e,w,dist){
  const xs=X===sc.L?'l':'r',ys=xs==='l'?'r':'l',xw=$('#fw'+xs),yw=$('#fw'+ys),xi=$('#fig'+xs),yi=$('#fig'+ys),dir=xs==='l'?1:-1;
  const ranged=w.t==='bow'||(w.t==='art'&&!(w.kind==='staff'&&dist<2))||(w.thrown&&dist>1),gap=gapPx(),xr=rigIdle[xs],yr=rigIdle[ys];
  if(e.proc&&e.proc!==SKILLS.siphon.n)await skillBanner(xs,e.proc);
  if(e.crit){sfx('critcharge');xi.animate([{filter:'none'},{filter:'brightness(2.2) drop-shadow(0 0 6px #fff)'},{filter:'none'}],{duration:D(380)});await $('#flashv').animate([{opacity:0},{opacity:.85},{opacity:0}],{duration:D(380)}).finished}
  if(xr){rigShow(xs,e.crit?'critup':'windup');await sleep(D(e.crit?260:150))}
  if(!ranged)await xw.animate([{transform:'translateX(0)'},{transform:`translateX(${dir*gap}px)`}],{duration:D(190),easing:'cubic-bezier(.6,0,.9,.7)',fill:'forwards'}).finished;
  else await xw.animate([{transform:'translateX(0)'},{transform:`translateX(${-dir*10}px)`}],{duration:D(140),fill:'forwards'}).finished;
  if(xr)rigShow(xs,'swing');else xi.src=sprite(X,'strike',w.key);
  sfx(w.kind==='staff'&&!ranged?'swing':w.t==='art'?({fire:'fire',water:'water',wind:'wind',earth:'earth',lightning:'thunder',illusion:'dark',light:'heal',crystal:'broke'}[w.el]||'fire'):w.t==='bow'?'arrow':ranged?'throw':w.kind==='whip'?'whip':w.kind==='chain'?'chain':w.kind==='fan'||w.kind==='umbrella'?'wind':'swing');
  const yc=centerOf(ys);
  if(ranged){
    const xc=centerOf(xs);
    if(w.el==='earth'){const r=document.createElement('div');r.className='rock';r.style.left=(yc.x-18)+'px';stage.appendChild(r);await r.animate([{transform:'translateY(-300px) rotate(0)'},{transform:`translateY(${yc.y-40}px) rotate(200deg)`}],{duration:D(380),easing:'ease-in'}).finished;r.remove()}
    else if(w.el==='lightning'){const b=document.createElement('div');b.className='bolt';b.style.left=(yc.x-9)+'px';b.style.height=(yc.y+20)+'px';stage.appendChild(b);await b.animate([{opacity:0},{opacity:1},{opacity:.3},{opacity:1},{opacity:0}],{duration:D(420)}).finished;b.remove()}
    else{const pj=document.createElement('div');pj.className='proj '+(w.t==='bow'?'arrow':w.t==='art'?(w.el||'arcane'):'spin');stage.appendChild(pj);const sx=xc.x-15,sy=xc.y-30,ex=yc.x-15,ey=yc.y-30;const flip=dir<0?' scaleX(-1)':'';
      await pj.animate([{transform:`translate(${sx}px,${sy}px)${flip}`},{transform:`translate(${ex}px,${ey}px)${flip}${w.t!=='bow'&&w.t!=='art'?' rotate(720deg)':''}`}],{duration:D(w.t==='bow'?260:380),easing:'linear'}).finished;pj.remove()}
  }else{const sl=document.createElement('div');sl.className='slash';sl.style.left=(yc.x-55)+'px';sl.style.top=(yc.y-75)+'px';stage.appendChild(sl);sl.animate([{transform:`rotate(${dir>0?-60:240}deg) scale(.6)`,opacity:1},{transform:`rotate(${dir>0?60:120}deg) scale(1.1)`,opacity:0}],{duration:D(240)}).finished.then(()=>sl.remove())}
  const yHp=Y===sc.a?e.hpA:e.hpD,xHp=X===sc.a?e.hpA:e.hpD;
  if(e.hit){
    if(e.guard)skillBanner(ys,e.guard);
    if(w.el==='crystal')shatterFx(yc.x,yc.y);
    if(yr)rigShow(ys,'hit');yi.animate([{filter:'brightness(4)'},{filter:'none'}],{duration:D(200)});if(xr)setTimeout(()=>rigShow(xs,'follow'),D(90));
    sfx(e.crit?'crit':'hit');bnum(ys,e.crit?'CRIT '+e.dmg:String(e.dmg),e.crit?'crit':'');
    /* crits shake the whole scene */if(e.crit)stage.animate([{transform:'translate(0,0)'},{transform:'translate(-8px,4px)'},{transform:'translate(7px,-3px)'},{transform:'translate(-5px,2px)'},{transform:'translate(3px,-1px)'},{transform:'translate(0,0)'}],{duration:D(380)});
    await Promise.all([hpAnim(Y,yHp),yw.animate([{transform:'translateX(0)'},{transform:`translateX(${dir*(e.crit?14:8)}px)`},{transform:`translateX(${-dir*5}px)`},{transform:'translateX(0)'}],{duration:D(260)}).finished]);
    if(e.heal){skillBanner(xs,'Siphon');bnum(xs,'+'+e.heal,'heal');await hpAnim(X,xHp)}
  }else{
    sfx('miss');bnum(ys,'MISS','miss');if(yr)rigShow(ys,'dodge');if(xr)setTimeout(()=>rigShow(xs,'follow'),D(90));
    await yw.animate([{transform:'translateX(0)'},{transform:`translateX(${dir*34}px)`},{transform:'translateX(0)'}],{duration:D(340),easing:'ease-out'}).finished;
  }
  await sleep(D(160));
  if(yr)rigShow(ys,'idle');if(xr)rigShow(xs,'idle');else xi.src=sprite(X,'idle',w.key);
  await xw.animate([{transform:`translateX(${ranged?-dir*10:dir*gap}px)`},{transform:'translateX(0)'}],{duration:D(200),fill:'forwards'}).finished;
}

/* ==================================================================
   BATTLE BACKDROPS: one pixel-art scene per region (160x90, scaled to fill).
   The horizon sits at y=63 so fighters stand on the ground band.
   ================================================================== */
function battleBgArt_draw(id){const c='BG|'+id;if(sprCache[c])return sprCache[c];const W=160,H=90,p=Px(W,H),G=63;
  const sky=cols=>cols.forEach((col,i)=>p.rect(0,Math.round(i*G/cols.length),W,Math.ceil(G/cols.length)+1,col));
  const ridge=(pts,col)=>p.poly([[0,G+1],...pts,[W,G+1]],col);
  const ground=(a,b,dots)=>{p.rect(0,G,W,H-G,a);p.rect(0,G,W,2,b);for(let i=0;i<70;i++)p.set((i*53+7)%W,G+3+(i*17)%(H-G-3),dots[i%dots.length])};
  const dots=(n,col,y0,y1)=>{for(let i=0;i<n;i++)p.set((i*41+13)%W,y0+(i*29)%(y1-y0),col)};
  if(id==='forest'){sky(['#1a2420','#22302a','#2c3e32','#3a4e3c']);ridge([[0,40],[20,34],[44,42],[70,30],[100,40],[130,32],[160,38]],'#24342a');
    for(const x of[12,40,66,96,124,150]){p.rect(x,22,3,41,'#1a221c');p.line(x+1,30,x-6,22,'#1a221c');p.line(x+1,36,x+8,27,'#1a221c');p.line(x+1,26,x+4,18,'#1a221c')}
    ground('#2e4325','#3f5a30',['#3a5230','#24361e']);dots(12,'#c77dff',G+4,H-2)}
  else if(id==='mushroom'){sky(['#1e1428','#2a1c3a','#3a2650','#4e3462']);
    for(const[x,h,r]of[[18,30,14],[60,40,20],[110,26,12],[146,36,16]]){p.rect(x-2,G-h,5,h,'#2a1e34');p.ell(x,G-h,r,r*.5,'#3a2648',(a,b)=>b<=G-h+1)}
    ground('#4e4058','#665576',['#c9b8ff','#5c4d6a']);dots(18,'#d8c8ff',8,40)}
  else if(id==='shadow'){sky(['#0e0e1a','#161628','#1e1e36','#2a2a44']);p.ell(124,16,7,7,'#e8e6f0');p.ell(127,14,6,6,'#1a1a30');dots(26,'#9a9ab8',2,36);
    ridge([[0,50],[30,46],[60,52],[90,44],[120,50],[160,46]],'#1a1824');for(const x of[20,46,80,104,140]){p.rect(x,G-9,7,9,'#34303c');p.ell(x+3.5,G-9,3.5,3,'#34303c',(a,b)=>b<=G-9)}
    p.line(64,G,62,30,'#14121c',2);p.line(63,40,54,32,'#14121c');p.line(63,36,72,28,'#14121c');ground('#2a2630','#3a3644',['#47434f','#24202a'])}
  else if(id==='swamp'){sky(['#1a2620','#223228','#2e4234','#3c5440']);for(const x of[16,52,96,134]){p.line(x,G,x-3,24,'#1e2a20',2);p.line(x,G,x+4,26,'#1e2a20');p.ell(x,22,12,6,'#1e3020')}
    p.rect(0,G,W,8,'#3a5a4a');p.rect(0,G,W,1,'#5f7f6a');for(let i=0;i<10;i++)p.line((i*31)%W,G+3+(i%3),(i*31)%W+6,G+3+(i%3),'#5f7f6a');p.rect(0,G+8,W,H-G-8,'#3f3a2a');dots(30,'#4a4632',G+9,H-1)}
  else if(id==='mountain'){sky(['#2a0e0e','#4a1612','#7a2a18','#a84a22']);ridge([[0,44],[22,36],[40,44]],'#2a1a1a');
    p.poly([[50,G],[80,14],[92,14],[122,G]],'#2a1c1e');p.rect(80,12,12,4,'#ff7a2a');p.ell(86,10,8,4,'#ff9a3c');for(let i=0;i<5;i++)p.line(84+i,16,78-i*3,40+i*4,'#c8401a');
    ridge([[110,G-14],[140,G-22],[160,G-12]],'#24181a');ground('#3a3034','#4a3c40',['#ff7a2a','#2a2226']);p.line(10,G+12,40,G+16,'#c8401a');p.line(100,G+10,130,G+18,'#c8401a');dots(14,'#ffb070',4,30)}
  else if(id==='ship'){sky(['#26304a','#36446a','#4a5c86','#6a7ea8']);for(const[x,y,w]of[[20,20,18],[70,12,26],[124,24,20],[100,40,14]]){p.ell(x,y,w,4,'#c8d4ec');p.ell(x+4,y-2,w*.6,3,'#e4ecf8')}
    p.rect(0,G,W,H-G,'#7a5230');for(let y=G+3;y<H;y+=5)p.rect(0,y,W,1,'#5a3a22');p.rect(0,G,W,3,'#4f331d');for(let x=6;x<W;x+=22)p.rect(x,G-10,3,10,'#4f331d');p.rect(0,G-11,W,2,'#6b4325')}
  else if(id==='labyrinth'){p.rect(0,0,W,G,'#24202c');for(let y=0;y<G;y+=8)for(let x=(y/8%2)*10;x<W;x+=20){p.rect(x,y,19,7,'#2e2a38');p.rect(x,y,19,1,'#3a3644')}
    for(const x of[30,80,130]){p.ell(x,26,13,10,'#3a2e30');p.ell(x,25,8,7,'#4a3630');p.rect(x-1,24,3,8,'#5a3a22');p.ell(x,22,3,4,'#ff9a3c');p.ell(x,22,1.5,2,'#ffe14a')}ground('#3a3640','#4a4652',['#2a2630','#504c5a'])}
  else if(id==='desert'){sky(['#e8a060','#f0b878','#f6d09a','#f8e0b4']);p.ell(118,18,8,8,'#fff6d8');ridge([[0,48],[34,40],[66,50],[100,42],[140,50],[160,44]],'#d8a46a');
    for(const[x,h]of[[24,22],[132,30]]){p.rect(x,G-h,12,h,'#c9945a');p.rect(x,G-h,12,3,'#e0b07a');p.rect(x+8,G-h,4,h,'#a8743a')}ground('#c9a060','#e0bc80',['#b08850','#e8cc90'])}
  else if(id==='snow'){sky(['#5a7090','#7a90b0','#a0b4cc','#c8d6e4']);ridge([[0,40],[24,22],[44,36],[72,14],[100,34],[126,20],[160,36]],'#8aa0bc');
    for(const[x,y]of[[24,22],[72,14],[126,20]])p.poly([[x-6,y+6],[x,y],[x+6,y+6]],'#f4f8ff');ridge([[0,52],[40,46],[80,54],[120,46],[160,52]],'#c8d8ec');ground('#e4ecf4','#ffffff',['#c8d4e4','#f4f8ff']);dots(30,'#ffffff',2,50)}
  else if(id==='cavern'){p.rect(0,0,W,G,'#1a1622');for(let x=0;x<W;x+=12){const h=6+(x*7)%14;p.poly([[x,0],[x+12,0],[x+6,h]],'#241e2c')}
    for(const[x,col]of[[20,'#9a5ac8'],[58,'#3aa86a'],[104,'#c8323a'],[140,'#3a5ac8']]){p.ell(x+2,G-10,15,13,shade(col,.28));p.ell(x+2,G-8,9,8,shade(col,.4));p.poly([[x-6,G],[x-3,G-16],[x,G]],col);p.poly([[x-1,G],[x+3,G-22],[x+7,G]],shade(col,1.2));p.line(x+3,G-20,x+3,G-2,shade(col,1.6))}
    ground('#3a3444','#4a4456',['#2e2838','#9a5ac8'])}
  /* the Heart of the Blight: a blood-red dark, far spires, scorched ground with gem-lit cracks */
  else if(id==='heart'){sky(['#0e0408','#1e0810','#2e0c16','#3e1020']);for(const[x,h,w]of[[18,30,6],[46,44,8],[122,40,7],[148,26,5]]){p.poly([[x-w,G],[x,G-h],[x+w,G]],'#4a0c18');p.line(x,G-h+2,x,G-2,'#7a1424')}
    p.poly([[64,G],[80,8],[96,G]],'#5a0e1c');p.poly([[80,8],[96,G],[80,G]],'#7a1224');p.line(80,10,80,G-2,'#c8283a');
    ground('#1e1416','#2c1e20',['#140c0e','#261a1c']);for(const[x,c]of[[24,'#3fd38a'],[70,'#ff3a4a'],[112,'#b46aff'],[140,'#4a7aff']]){p.line(x-8,G+8,x,G+12,'#3a0c14');p.line(x,G+12,x+9,G+9,'#3a0c14');p.set(x,G+12,c);p.set(x-4,G+10,shade(c,.7))}}
  else{sky(['#121522','#1e2436','#2a3146','#3a4258']);ground('#363b33','#454a40',['#2a2e28'])}
  return sprCache[c]=p.url()}
async function scenePlay(a,d,res){
  fast=false;const L=a.team==='e'?a:d,R=L===a?d:a,f=res.f;
  sc={a,d,L,R,hp:{[a.id]:a.hp,[d.id]:d.hp}};
  const tk=ter(d.x,d.y).k,bio=CH[state.ch]&&CH[state.ch].biome;stage.className='stage'+(bio?' bgr':tk==='forest'?' forest':['floor','throne','wall','carpet','light','exit'].includes(tk)?' castle':tk==='hill'?' hill':['sky','deck','mast','hull','helm'].includes(tk)?' sky':'');
  /* each region has its own backdrop */stage.style.backgroundImage=bio?`url(${battleBgArt(bio)})`:'';
  const wOf=u=>u===a?f.aw:f.dw,sOf=u=>u===a?f.A:f.D;
  $('#figl').src=sprite(L,'idle',wOf(L)?.key||mapWk(L));$('#figr').src=sprite(R,'idle',wOf(R)?.key||mapWk(R));
  rigStart('l',L,wOf(L));rigStart('r',R,wOf(R));
  $('#sidel').innerHTML=sideHTML(L,wOf(L),sOf(L));$('#sider').classList.toggle('g',R.team==='g');$('#sider').innerHTML=sideHTML(R,wOf(R),sOf(R));
  ['l','r'].forEach(s=>{const el=$('#fw'+s);el.getAnimations().forEach(x=>x.cancel());el.style.opacity=1});
  $('#fwl').style.left=f.dist>1?'2%':'7%';$('#fwr').style.right=f.dist>1?'2%':'7%';
  bs.hidden=false;await bs.animate([{opacity:0},{opacity:1}],{duration:D(220)}).finished;await sleep(D(280));
  for(const e of res.ev){const X=e.by==='a'?a:d,Y=X===a?d:a;await strikeAnim(X,Y,e,wOf(X),f.dist)}
  for(const[u,hp]of[[a,res.hpA],[d,res.hpD]])if(hp<=0){const s=u===L?'l':'r',fw=$('#fw'+s),sb=stage.getBoundingClientRect(),fb=fw.getBoundingClientRect();
    await dieFx(fw,stage,fb.left-sb.left+fb.width/2,fb.top-sb.top+fb.height*.55,u,2)}
  await sleep(D(200));
}
/* the Crystal Heart's Shatter: red crystal shards burst off the target */
function shatterFx(cx,cy){sfx('broke');for(let i=0;i<14;i++){const sh=document.createElement('i'),a=i/14*6.283,r=24+Math.random()*26,sz=4+Math.random()*5;sh.className='shard';
  Object.assign(sh.style,{left:cx+'px',top:(cy-20)+'px',width:sz+'px',height:sz*1.8+'px',background:['#ff5a6a','#c8283a','#ffb0b8','#8a1224'][i%4]});stage.appendChild(sh);
  sh.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r}px)) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:D(520),easing:'cubic-bezier(.2,.7,.4,1)',fill:'forwards'}).finished.then(()=>sh.remove())}}
/* death: the unit flashes white, staggers, then shatters into crystal shards (k scales the shards up for the battle scene) */
function dieFx(el,host,cx,cy,u,k=1,quiet){if(!quiet){sfx('death');setTimeout(()=>sfx('broke'),D(260))}
  const cols=u.team==='e'?['#c58aff','#9fd8ff','#efe0ff','#7a5ac8']:['#f3f0e8','#ffd27a','#bfe8ff','#d8d0bc'];
  setTimeout(()=>{for(let i=0;i<12;i++){const sh=document.createElement('i'),a=i/12*6.283+Math.random()*.4,r=(26+Math.random()*30)*k,sz=(3+Math.random()*4)*k;sh.className='shard';
    Object.assign(sh.style,{left:cx+'px',top:cy+'px',width:sz+'px',height:sz*1.6+'px',background:cols[i%cols.length]});host.appendChild(sh);
    sh.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r+10*k}px)) rotate(${Math.random()*540-270}deg)`,opacity:0}],{duration:D(650+Math.random()*250),easing:'cubic-bezier(.2,.7,.4,1)',fill:'forwards'}).finished.then(()=>sh.remove())}},D(260));
  return el.animate([{filter:'none',transform:'none',opacity:1},{filter:'brightness(4) saturate(0)',transform:'translateX(-3px)',opacity:1,offset:.15},{filter:'none',transform:'translateX(3px)',opacity:1,offset:.3},{filter:'brightness(4) saturate(0)',transform:'scale(1.05)',opacity:1,offset:.42},{filter:'brightness(4) saturate(0)',transform:'scale(.7)',opacity:0}],{duration:D(620),easing:'ease-in',fill:k>1?'forwards':'none'}).finished}
async function closeScene(){rigStop('l');rigStop('r');if(bs.hidden)return;await bs.animate([{opacity:1},{opacity:0}],{duration:D(200)}).finished;bs.hidden=true;stage.querySelectorAll('.bnum,.proj,.slash,.bolt').forEach(n=>n.remove())}
async function quickPlay(a,d,res){
  for(const e of res.ev){const X=e.by==='a'?a:d,Y=X===a?d:a;lunge(X,Y);await sleep(150);
    if(e.proc&&e.proc!==SKILLS.siphon.n)pop(X,e.proc,'crit');
    if(e.hit){sfx(e.crit?'crit':'hit');Y.hp=Y===a?e.hpA:e.hpD;pop(Y,(e.crit?'Crit ':'')+'-'+e.dmg,e.crit?'crit':'dmg');flash(Y);if(e.heal){X.hp=X===a?e.hpA:e.hpD;pop(X,'+'+e.heal,'heal')}}else{sfx('miss');pop(Y,'Miss','miss')}
    render();await sleep(430)}
}
async function showExp(u,g){
  if(!g)return;const host=bs.hidden?vp:stage,box=document.createElement('div');box.className='expbox';
  box.innerHTML=`<span>EXP</span><span class="xb"><i style="width:${g.from}%"></i></span><span class="xn">${g.from}</span>`;host.appendChild(box);
  const bar=box.querySelector('i'),num=box.querySelector('.xn'),total=g.from+g.amt,t0=performance.now(),dur=D(650)+g.amt*D(6);
  await new Promise(r=>{(function step(t){const k=Math.min(1,(t-t0)/dur),v=Math.round(g.from+g.amt*k),shown=v>=100&&g.gains?v-100:Math.min(v,100);bar.style.width=shown+'%';num.textContent=shown;if(k<1)requestAnimationFrame(step);else r()})(t0)});
  await sleep(D(450));box.remove();
}

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function battleBgArt(id){return art('backdrops/'+id,()=>battleBgArt_draw(id))}
