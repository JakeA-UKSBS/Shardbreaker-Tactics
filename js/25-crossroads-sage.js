/* The Sage's tent intro and the Crossroads squad pick */
/* ---- the muster: the run's opening scene at the crossroads, where you pick your starting squad ---- */
function musterArt_draw(){const c='MUS';if(sprCache[c])return sprCache[c];const W=160,H=90,p=Px(W,H);
  ['#2a2a4a','#3a3456','#5a4060','#8a5060','#c87058','#e8a060'].forEach((col,i)=>p.rect(0,i*8,W,8,col));p.ell(40,46,9,9,'#ffd27a');p.ell(40,46,6,6,'#fff0c0');
  p.poly([[0,52],[18,34],[34,46],[52,30],[74,48],[96,32],[118,46],[140,28],[160,42],[160,60],[0,60]],'#3a2e48');
  p.poly([[0,58],[24,46],[50,56],[80,44],[110,56],[136,46],[160,54],[160,64],[0,64]],'#2a2436');
  p.rect(0,60,W,30,'#3e4a2e');for(let i=0;i<60;i++)p.set((i*37)%W,62+(i*13)%28,i%2?'#4e5a3a':'#34402a');
  p.poly([[66,90],[94,90],[86,60],[74,60]],'#6a5a3e');p.poly([[74,60],[86,60],[83,52],[77,52]],'#5a4a34');
  p.line(80,74,72,80,'#5a3a22',2);p.line(72,74,88,80,'#4a2e1a',2);p.poly([[80,62],[85,72],[80,75],[75,72]],'#ff8a3c');p.poly([[80,66],[82,72],[80,74],[78,72]],'#ffe14a');
  p.rect(18,66,10,7,'#7a5a3a');p.rect(16,64,14,3,'#5a3a22');p.rect(112,70,12,6,'#5a4a3a');
  return sprCache[c]=p.url()}
function flagArt_draw(){const c='FLAG';if(sprCache[c])return sprCache[c];const p=Px(16,16);p.rect(4,1,1,14,'#8a6040');p.poly([[5,2],[14,4],[5,8]],'#d8483a');p.line(5,3,11,4,'#f0c850');p.rect(2,14,5,1,'#5a3a22');p.outline(OUT);return sprCache[c]=p.url()}
const musEl=document.createElement('div');musEl.className='tav mus';musEl.hidden=true;document.body.appendChild(musEl);
const STAT_HELP=[['HP','Health. A unit falls at 0.'],['Str','Damage with blades, axes, lances and bows (fighters).'],['Mag','Damage with sigils, and healing (casters).'],['Luck','Hit chance and critical hits, and guards against enemy crits. Some skills trigger off Luck.'],['Spd','Avoid. 4 more Spd than your foe means you strike twice.'],['Def','Cuts physical damage taken.'],['Res','Cuts magic damage taken.'],['Wt','Weapon weight. Each point above your Str (or Mag) costs 1 Spd.'],['Move','Tiles the unit can move each turn.']];
const statHelpHTML=()=>`<div class="stathelp" hidden>${STAT_HELP.map(([k,d])=>`<div><b>${k}</b><span>${d}</span></div>`).join('')}</div>`;
/* ---- the sage's tent: Ithren talks over his crystal ball, then (once unlocked) asks how deep into the blight to go ---- */
function sageRoomArt_draw(){const c='SAGEROOM';if(sprCache[c])return sprCache[c];const W=160,H=90,p=Px(W,H);
  p.rect(0,0,W,H,'#1e1428');for(let x=0;x<W;x+=16){p.poly([[x,0],[x+8,0],[x+12,90],[x+4,90]],'#2a1c38');p.line(x+8,0,x+12,90,'#352448')}
  p.poly([[0,0],[160,0],[160,8],[120,14],[80,6],[40,14],[0,8]],'#3a2650');for(const x of[20,60,100,140])p.ell(x,10,2,3,GOLD);
  for(const[x,y]of[[18,44],[142,48]]){p.rect(x-2,y,4,10,'#efe6cf');p.ell(x,y-2,1.6,2.4,'#ffd27a');p.set(x,y-3,'#fff6c0');p.ell(x,y-2,6,6,'#3a2a3a',(a,b)=>!p.g[b*W+a])}
  p.rect(0,70,W,20,'#2a1e22');for(let i=0;i<30;i++)p.set((i*53)%W,72+(i*7)%16,'#3a2a2e');
  return sprCache[c]=p.url()}
function sageTableArt_draw(){const c='SAGETABLE';if(sprCache[c])return sprCache[c];const W=160,H=90,p=Px(W,H);
  p.poly([[44,66],[116,66],[124,90],[36,90]],'#4a2a5a');p.ell(80,66,36,6,'#5a3670');for(let x=40;x<122;x+=6)p.line(x,68,x-2,90,'#3a2048');p.rect(44,64,72,2,GOLD);
  p.rect(72,58,16,4,'#b8912f');p.rect(70,61,20,2,'#8a6a20');
  p.outline('#120a18');return sprCache[c]=p.url()}
function sageBallArt_draw(){const c='SAGEBALL';if(sprCache[c])return sprCache[c];const W=160,H=90,p=Px(W,H);
  p.ell(80,46,13,13,'#7a4ab8');p.ell(81,45,10.5,10.5,'#9a6ad8');p.ell(83,43,6,6,'#c9a8ff');p.ell(75,40,2.4,1.8,'#ffffff');p.set(87,52,'#e0c8ff');p.set(73,50,'#5a2a98');
  for(let a=0;a<10;a++)p.set(80+Math.round(17*Math.cos(a/10*6.28)),46+Math.round(16*Math.sin(a/10*6.28)),'#d8b8ff');
  p.outline('#120a18');return sprCache[c]=p.url()}
const sgEl=document.createElement('div');sgEl.className='tav sg';sgEl.hidden=true;document.body.appendChild(sgEl);
async function sageScene(){
  const B1=BIOMES[run.biomes[0]],B2=BIOMES[run.biomes[1]],sage=fig({style:'long',beard:true,hair:'#e8e2d0',gear:'hood',cloth:'#3a4a8a',skin:'#e0b090',sash:GOLD},'Sage','p','idle',null);
  const lines=['Ah, you came. Sit, sit. Look into the glass with me.',
    'A blight has taken root in these lands: malignant crystals. They grow through living creatures and twist them into something cruel.',
    'Worse, the crystallised beasts give off a scent that drives people to rage. The nearby kingdoms are already at each other’s throats.',
    `The glass shows where the blight runs deepest: first ${theN(B1)}, then ${theN(B2)}. Beyond them lies its source, the Crystal Heart. Shatter it, and the scent will fade.`,
    'An army would only feed the war. A small band can slip through. Travellers have gathered at the crossroads. Choose three to walk this road, and choose well: not all of them will come back.'];
  /* difficulty: arrows over the crystal ball, only once Ascension is unlocked */
  let asc=0;const diffHTML=()=>prof.asc?`<div class="sg-diff"><button type="button" data-d="-1" aria-label="Easier"${asc<=0?' disabled':''}>◀</button><span><b>${asc?'Ascension '+asc:'Normal'}</b><small>${asc?ASC[asc]:'The standard run.'}</small></span><button type="button" data-d="1" aria-label="Harder"${asc>=prof.asc?' disabled':''}>▶</button></div>`:'';
  const tint=()=>{const f=sgEl.querySelector('.sg-fg');if(f)f.style.filter=asc?`hue-rotate(${asc*18}deg) saturate(${1+asc*.15})`:''};
  const show=(text,opts)=>{sgEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${sageRoomArt()}" alt=""><img class="sg-sage" src="${sage}" alt=""><img class="tv-bg" src="${sageTableArt()}" alt=""><img class="tv-bg sg-fg" src="${sageBallArt()}" alt="">${diffHTML()}</div>
    <div class="tv-box"><div class="tv-name">Ithren the Sage</div><p class="tv-text">“${text}”</p><div class="tv-opts">${opts.map(([k,l])=>`<button type="button" class="tv-o" data-s="${k}">${l}</button>`).join('')}</div></div>`;
    sgEl.hidden=false;tint();return new Promise(res=>{sgEl.onclick=e=>{const d=e.target.closest('[data-d]');if(d&&!d.disabled){asc=Math.max(0,Math.min(prof.asc,asc+ +d.dataset.d));sfx('tick');sgEl.querySelector('.sg-diff').outerHTML=diffHTML();tint();return}
      const b=e.target.closest('[data-s]');if(!b)return;sfx('tick');res(b.dataset.s)}})};
  /* after the first full telling, a Skip jumps straight to the difficulty on the orb */
  for(let i=0;i<lines.length;i++){const last=i===lines.length-1,m=await show(lines[i],[['next',last?'To the Crossroads':'Continue'],...(prof.sageSeen&&!last?[['skip','Skip']]:[])]);
    if(m==='skip'){if(prof.asc)await show('Then you know the road. How deep into the blight will you go?',[['next','To the Crossroads']]);break}}
  if(!prof.sageSeen){prof.sageSeen=1;saveProf()}
  sgEl.hidden=true;sgEl.onclick=null;return asc;
}
function sageArt(){return sprCache.SAGE||(sprCache.SAGE=fig({style:'long',beard:true,hair:'#e8e2d0',gear:'hood',cloth:'#3a4a8a',skin:'#e0b090',sash:GOLD},'Sage','p','idle','crystalBall'))}
async function musterScene(opts,need){
  const chosen=[],B1=BIOMES[run.biomes[0]],B2=BIOMES[run.biomes[1]],n=opts.length;
  /* stand the travellers in an arc around the campfire: the far ones behind it, smaller */
  const ang=i=>Math.PI*(1-i/(n-1)),pos=i=>50+38*Math.cos(ang(i)),up=i=>8+24*Math.sin(ang(i)),sc=i=>1-.22*Math.sin(ang(i));
  musEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${musterArt()}" alt="">
      <div class="ms-post" aria-label="Signpost"><span class="ms-sign"><small>Act 1</small>${B1.n}</span><span class="ms-sign"><small>Act 2</small>${B2.n}</span><span class="ms-sign"><small>Act 3</small>${BIOMES.heart.n}</span></div>
      ${opts.map((u,i)=>`<button type="button" class="mu" data-u="${i}" style="left:${pos(i)}%;bottom:${up(i)}%;--s:${sc(i)};z-index:${10-Math.round(Math.sin(ang(i))*5)}" aria-label="${u.name}"><img src="${uSpr(u)}" alt=""${pos(i)>50?' class="fl"':''}><span>${u.name}</span></button>`).join('')}
      <button type="button" class="ms-map" data-g="map" aria-label="Look at the map" title="Look at the map"><img src="${mapIconArt()}" alt="">Map</button><span class="tv-gold">Seed ${run.seed}</span></div>
    <div class="tv-box"><div class="ms-head"><b class="ms-count"></b><button type="button" class="mini ms-info" data-g="info" aria-expanded="false">ⓘ What do stats do?</button></div>${statHelpHTML()}
      <div class="ms-cards"></div>
      <div class="mbtns"><button type="button" data-g="back">Back</button><button type="button" class="go" data-g="go" disabled>Set out</button></div></div>`;
  musEl.hidden=false;
  tip('muster','Choose your squad','Tap 3 travellers to bring them along. Their cards show stats, weapon and skill, and “What do stats do?” explains the numbers. Every Crossroads has at least one Mender to heal. Units who fall are gone for the rest of the run.');
  const draw=()=>{musEl.querySelectorAll('.mu').forEach(b=>b.classList.toggle('on',chosen.includes(+b.dataset.u)));
    const g=musEl.querySelector('[data-g="go"]');g.disabled=chosen.length!==need;g.textContent=`Set out (${chosen.length}/${need})`;
    musEl.querySelector('.ms-count').textContent=chosen.length===need?'Your squad is ready.':`Tap ${need-chosen.length===need?need:need-chosen.length} more traveller${need-chosen.length===1?'':'s'} to bring along.`;
    musEl.querySelector('.ms-cards').innerHTML=chosen.map(i=>{const u=opts[i],sk=SKILLS[u.skill];return`<div class="dcard on">${unitCard(u)}<button type="button" class="mini ms-x" data-u="${i}" aria-label="Remove ${u.name}">✕</button><p class="ms-sk"><b>${sk.n}:</b> ${sk.d}${isSummoner(u)?` <b>Familiar:</b> ${famOf(u).n}, ${famOf(u).d}. Called once per battle.`:''}</p></div>`}).join('')};
  draw();
  return new Promise(res=>{musEl.onclick=e=>{
    const u=e.target.closest('[data-u]');if(u){const i=+u.dataset.u,k=chosen.indexOf(i);if(k>=0)chosen.splice(k,1);else if(chosen.length<need)chosen.push(i);else toast(`Only ${need} can come. Remove someone first.`);sfx('tick');draw();return}
    const g=e.target.closest('[data-g]');if(!g||g.disabled)return;
    if(g.dataset.g==='map'){musEl.hidden=true;sfx('select');mapScreen(true).then(()=>{musEl.hidden=false});return}
    if(g.dataset.g==='info'){const h=musEl.querySelector('.stathelp');h.hidden=!h.hidden;g.setAttribute('aria-expanded',String(!h.hidden));return}
    musEl.onclick=null;musEl.hidden=true;sfx('select');
    res(g.dataset.g==='go'?chosen.map(i=>opts[i]):null)}});
}

/* PNG art: each of these uses art/<key>.png when it exists, else the drawing code above (see art() in 03-pixel-art.js) */
function musterArt(){return art('scenes/crossroads',()=>musterArt_draw())}
function flagArt(){return art('nodes/start',()=>flagArt_draw())}
function sageRoomArt(){return art('scenes/sage-room',()=>sageRoomArt_draw())}
function sageTableArt(){return art('scenes/sage-table',()=>sageTableArt_draw())}
function sageBallArt(){return art('scenes/sage-ball',()=>sageBallArt_draw())}
