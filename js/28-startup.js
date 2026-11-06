/* Title menu, dev menu and start() */

const titleEl=document.createElement('div');titleEl.className='title';titleEl.hidden=true;document.body.appendChild(titleEl);
/* the title scene: a great blighted crystal in the distance, its red veins spreading through the land */
function titleCrystalArt_draw(){const c='TCRYS';if(sprCache[c])return sprCache[c];const W=120,p=Px(W,W),D='#4a0614',M='#8a1224',R='#c8283a',L='#ff5a6a',H='#ffb0b8';
  const spire=(x,base,top,w,lean)=>{const t=[x+lean,top],bl=[x-w,base],br=[x+w,base],ml=[x-w*.8+lean*.3,top+(base-top)*.25],mr=[x+w*.8+lean*.3,top+(base-top)*.25];
    p.poly([t,mr,br,bl,ml],R);p.poly([t,ml,bl,[x+lean*.2,base]],M);p.poly([t,[x+lean*.2,base],br,mr],L);p.line(Math.round(t[0]),Math.round(t[1]),Math.round(x+lean*.2),base,H);
    for(let k=0;k<3;k++){const y=top+(base-top)*(.35+k*.2);p.line(Math.round(x-w*.6),Math.round(y),Math.round(x+lean*.1),Math.round(y+6),D)}};
  spire(30,104,62,9,-10);spire(92,104,56,10,9);spire(44,106,40,10,-5);spire(78,106,36,11,5);spire(60,108,6,16,0);
  p.poly([[8,108],[24,98],[44,104],[60,100],[78,104],[98,97],[114,108],[114,120],[8,120]],'#1a0c14');p.line(20,104,52,110,D,2);p.line(70,110,104,103,D,2);
  for(const[x,y]of[[58,30],[64,52],[57,72],[47,60],[80,62]])p.set(x,y,'#fff0f2');
  p.outline('#14060c');return sprCache[c]=p.url()}
/* TITLE_MULTI: a maybe — two smaller crystals either side, with more veins between them */
let TITLE_MULTI=false;
function titleVeins(srcs=[[50,1]]){/* branching veins from each crystal's foot, drawn as SVG so they can pulse */
  let s=1;const r=()=>{s=(s*16807)%2147483647;return s/2147483647},paths=[];
  const grow=(x,y,a,len,d)=>{let pts=[[x,y]];for(let i=0;i<6;i++){a+=(r()-.5)*.7;x+=Math.cos(a)*len/6;y+=Math.sin(a)*len/6*.55;pts.push([x,y])}
    paths.push({d:'M'+pts.map(q=>q.map(v=>v.toFixed(1)).join(' ')).join('L'),w:Math.max(.12,.55-d*.14),o:1-d*.2});if(d<3)for(let k=0;k<2;k++)if(r()<.75)grow(x,y,a+(r()-.5)*1.4,len*.62,d+1)};
  for(const[ox,wt]of srcs){const n=Math.round(9*wt);for(let k=0;k<n;k++){const a=Math.PI*(k/Math.max(1,n-1))+(r()-.5)*.25;grow(ox,70,a+(a<Math.PI/2?-.15:.15),(34+r()*14)*(.6+wt*.4),wt<1?1:0)}
    for(let k=0;k<Math.round(4*wt);k++)grow(ox,70,Math.PI/2+(r()-.5)*2.4,26*wt,1)}
  return`<svg class="tveins" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="vglow"><feGaussianBlur stdDeviation=".6"/></filter></defs>
    <g fill="none" stroke-linecap="round">${paths.map(q=>`<path d="${q.d}" stroke="#2a0610" stroke-width="${(q.w*2.2).toFixed(2)}" opacity="${q.o.toFixed(2)}"/>`).join('')}</g>
    <g class="vlit" fill="none" stroke-linecap="round" filter="url(#vglow)">${paths.map((q,i)=>`<path d="${q.d}" stroke="#ff3a4a" stroke-width="${q.w.toFixed(2)}" opacity="${(q.o*.9).toFixed(2)}" style="animation-delay:${(i%7)*.4}s"/>`).join('')}</g>
    <g fill="none" stroke-linecap="round">${paths.map(q=>`<path d="${q.d}" stroke="#ffb0b8" stroke-width="${(q.w*.35).toFixed(2)}" opacity="${(q.o*.6).toFixed(2)}"/>`).join('')}</g></svg>`}
function titleMenu(items){
  return new Promise(res=>{
    /* wide screens: title and menu on the left, the crystal on the right; narrow: stacked with the crystal behind */
    const wide=innerWidth>=900,cx=wide?64:50,extra=TITLE_MULTI?(wide?[[34,.55],[90,.45]]:[[18,.5],[84,.45]]):[];
    titleEl.innerHTML=`<div class="tsky"></div>${titleVeins([[cx,1],...extra.map(([x])=>[x,.6])])}${extra.map(([x,k])=>`<img class="tcrys sm" src="${titleCrystalArt()}" alt="" style="left:${x}%;--k:${k}">`).join('')}<img class="tcrys" src="${titleCrystalArt()}" alt="" style="left:${cx}%"><div class="tembers">${Array.from({length:34},(_,i)=>`<i class="${i%3?'':'sh'}" style="left:${(i*37+11)%100}%;animation-delay:${((i*0.73)%7).toFixed(2)}s;animation-duration:${(6+(i%6)*1.3).toFixed(1)}s;--dx:${(i%2?1:-1)*(10+(i*7)%40)}px"></i>`).join('')}</div>
    <div class="tcol"><div class="tlogo"><h1 class="tname">Shardbreaker</h1><p class="tsub">Break the blight</p></div>
    <nav class="tmenu">${items.map(([k,l])=>`<button type="button" data-t="${k}">${l}</button>`).join('')}</nav></div>`;
    titleEl.hidden=false;
    titleEl.onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;sfx('select');res(b.dataset.t)};
  });
}
$('#btnEnd').addEventListener('click',async()=>{if(busy||over||phase!=='player'||!modalEl.hidden)return;if(ui!=='idle')cancelMove();
  const left=state.units.filter(u=>u.team==='p'&&!u.acted).length;
  const m=await modal(`<h2>End your turn?</h2><p>${left?`${left} unit${left>1?'s have':' has'} not moved yet.`:'Every unit has moved.'}</p><div class="mbtns"><button type="button" data-m="no">No</button><button class="go" type="button" data-m="end">Yes, end turn</button></div>`);
  if(m==='end'&&!busy&&!over&&phase==='player')enemyPhase()});
$('#btnDanger').addEventListener('click',()=>{danger=!danger;render();if(danger)tip('danger','Danger zone','Red tiles are where enemies can strike next turn. Click a tile, or move a unit onto one, to see which enemies they are.')});
/* the cog: options from anywhere (not while a dialog is open or a fight is playing out) */
$('#cog').addEventListener('click',()=>{if(!modalEl.hidden)return;const screen=[...document.querySelectorAll('.nmap,.tav')].some(e=>!e.hidden);if(busy&&!screen&&titleEl.hidden)return;sfx('tick');optionsMenu(!titleEl.hidden)});
/* view the act map mid-battle, then return to the fight */
$('#btnMap').addEventListener('click',()=>{if(!busy&&modalEl.hidden&&run&&run.map)mapScreen('Back to the battle')});
$('#btnDev').addEventListener('click',()=>{if(!busy&&!over&&modalEl.hidden)devMenu()});
/* Dev mode: win the current battle straight away. */
async function devMenu(){
  const m=await modal(`<div class="eyebrow">Dev mode</div><h2>Skip ahead</h2><p>Win this battle straight away. ${run?seedTag(run.seed):'Seed -'}.</p><div class="mbtns"><button type="button" data-m="close">Close</button><button class="go" type="button" data-m="win">Win this battle</button></div>`);
  if(m==='win'){cancelMove();over='win';render();winScreen()}
}
function start(data){
  loadProf();
  try{const o=JSON.parse(localStorage.getItem(OPTS));if(o){settings=Object.assign(settings,o);if(!settings.tipsV2){settings.tips=false;settings.tipsV2=1;saveOpts()}}}catch(_){}
  applyTheme();
  if(data&&data.run&&data.state){restore(data);return}
  /* A throwaway battle sits behind the title screen, with 3 of the starting cast. */
  seedRng(7);run={seed:7,n:1,uid:1,roster:[]};run.roster=shuffle(CAST.filter(c=>c.joins==='start')).slice(0,3).map(c=>castUnit(c.id,1));BATTLE=genBattle(1);setupBattle(run.roster);run=null;
  titleScreen();
}
window.claude?.hot?.snapshot?.(()=>({state,chStart,run,def:BATTLE,rng:rngS}));
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function titleCrystalArt(){return art('title/crystal',()=>titleCrystalArt_draw())}
