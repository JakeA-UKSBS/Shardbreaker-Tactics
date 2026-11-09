const musEl=document.createElement('div');musEl.className='tav mus';musEl.hidden=true;document.body.appendChild(musEl);
const STAT_HELP=[['HP','Health. A unit falls at 0.'],['Str','Damage with blades, axes, lances and bows (fighters).'],['Mag','Damage with sigils, and healing (casters).'],['Luck','Hit chance, avoid and critical hits. Some skills trigger off Luck.'],['Spd','Avoid. 4 more Spd than your foe means you strike twice.'],['Def','Cuts physical damage taken.'],['Res','Cuts magic damage taken.'],['Wt','Weapon weight. Each point above your Str (or Mag) costs 1 Spd.'],['Move','Tiles the unit can move each turn.']];
const statHelpHTML=()=>`<div class="stathelp" hidden>${STAT_HELP.map(([k,d])=>`<div><b>${k}</b><span>${d}</span></div>`).join('')}</div>`;
const sgEl=document.createElement('div');sgEl.className='tav sg';sgEl.hidden=true;document.body.appendChild(sgEl);
async function sageScene(){
  sgEl.innerHTML='';/* fresh tent each run */
  const sage='art/scenes/ithren.png';/* Rhi's Ithren and tent */
  const lines=['A vision of crystal. You will need to purge it from this land.'];
  /* difficulty: arrows over the crystal ball, only once Ascension is unlocked */
  let asc=0;const diffHTML=()=>prof.asc?`<div class="sg-diff"><button type="button" data-d="-1" aria-label="Easier"${asc<=0?' disabled':''}>◀</button><span><b>${asc?'Ascension '+asc:'Normal'}</b><small>${asc?ASC[asc]:'The standard run.'}</small></span><button type="button" data-d="1" aria-label="Harder"${asc>=prof.asc?' disabled':''}>▶</button></div>`:'';
  const tint=()=>{const f=sgEl.querySelector('.sg-fg');if(f)f.style.filter=asc?`hue-rotate(${asc*20}deg) saturate(${1+asc*.12})`:''/* violet at Normal, a step nearer red each level, red at Ascension 5 */};
  /* the tent is built once so the ball keeps bobbing; each line only swaps the dialogue box */
  const boxHTML=(text,opts)=>`<div class="tv-name">Ithren the Sage</div><p class="tv-text">“${text}”</p><div class="tv-opts">${opts.map(([k,l])=>`<button type="button" class="tv-o" data-s="${k}">${l}</button>`).join('')}</div>`;
  const show=(text,opts)=>{const box=sgEl.querySelector('.sg-box');if(box)box.innerHTML=boxHTML(text,opts);else sgEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${sageRoomArt()}" alt=""><img class="sg-sage" src="${sage}" alt=""><div class="sg-fg sg-orb"><img src="art/scenes/sage-orb-1.png" alt=""></div>${diffHTML()}</div>
    <div class="tv-box sg-box">${boxHTML(text,opts)}</div>`;
    sgEl.hidden=false;tint();return new Promise(res=>{sgEl.onclick=e=>{const d=e.target.closest('[data-d]');if(d&&!d.disabled){asc=Math.max(0,Math.min(prof.asc,asc+ +d.dataset.d));sfx('tick');sgEl.querySelector('.sg-diff').outerHTML=diffHTML();tint();return}
      const b=e.target.closest('[data-s]');if(!b)return;sfx('tick');res(b.dataset.s)}})};
  /* after the first full telling, a Skip jumps straight to the difficulty on the orb */
  for(let i=0;i<lines.length;i++){const last=i===lines.length-1,m=await show(lines[i],[['next',last?'To the Crossroads':'Continue'],...(prof.sageSeen&&!last?[['skip','Skip']]:[])]);
    if(m==='skip'){if(prof.asc)await show('Then you know the road. How deep into the blight will you go?',[['next','To the Crossroads']]);break}}
  if(!prof.sageSeen){prof.sageSeen=1;saveProf()}
  /* the tent stays up behind Ithren's gift until the Crossroads replaces it, so the title's throwaway battle never shows through */
  sgEl.onclick=null;return asc;
}
/* the Crossroads: pick need of opts. late = the second Crossroads after Act 1 (pick 1 of 2 veterans, no going back) */
async function musterScene(opts,need,late){
  const chosen=[],B1=BIOMES[run.biomes[0]],B2=BIOMES[run.biomes[1]],n=opts.length;
  const signs=late?[['Act 2',B2.n],['Beyond',BIOMES.heart.n]]:[['Act 1',B1.n],['Act 2',B2.n]];
  /* stand the travellers in an arc around the campfire: the far ones behind it, smaller */
  const ang=i=>Math.PI*(1-i/(n-1)),pos=i=>50+38*Math.cos(ang(i)),up=i=>8+24*Math.sin(ang(i)),sc=i=>1-.22*Math.sin(ang(i));
  musEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${musterArt()}" alt=""><img class="ms-fire" src="${campArt()}" alt="">
      <div class="ms-post" aria-label="Signpost">${signs.map(([a,b])=>`<span class="ms-sign"><small>${a}</small>${b}</span>`).join('')}</div>
      ${opts.map((u,i)=>`<button type="button" class="mu" data-u="${i}" style="left:${pos(i)}%;bottom:${up(i)}%;--s:${sc(i)};z-index:${10-Math.round(Math.sin(ang(i))*5)}" aria-label="${u.name}"><img src="${uSpr(u)}" alt=""${pos(i)>50?' class="fl"':''}><span>${u.name}</span></button>`).join('')}
      <button type="button" class="ms-map" data-g="map" aria-label="Look at the map" title="Look at the map"><img src="${mapIconArt()}" alt="">Map</button><span class="tv-gold">Seed ${run.seed}</span></div>
    <div class="tv-box"><div class="ms-head"><b class="ms-count"></b><button type="button" class="mini ms-info" data-g="info" aria-expanded="false">ⓘ What do stats do?</button></div>${statHelpHTML()}
      <div class="ms-cards"></div>
      <div class="mbtns">${late?'':'<button type="button" data-g="back">Back</button>'}<button type="button" class="go" data-g="go" disabled>Set out</button></div></div>`;
  musEl.hidden=false;sgEl.hidden=true;
  if(!late)tip('muster','Choose your squad','Click 3 travellers to bring them along. Their cards show stats, weapon and skill, and “What do stats do?” explains the numbers. Units who fall get back up at 1 HP once the fight is won (from Ascension 5 they’re gone for good).');
  const draw=()=>{musEl.querySelectorAll('.mu').forEach(b=>b.classList.toggle('on',chosen.includes(+b.dataset.u)));
    const g=musEl.querySelector('[data-g="go"]');g.disabled=chosen.length!==need;g.textContent=`Set out (${chosen.length}/${need})`;
    musEl.querySelector('.ms-count').textContent=chosen.length===need?'Your squad is ready.':late?'Two veterans wait at the crossroads. Only one can join you.':`Click ${need-chosen.length===need?need:need-chosen.length} more traveller${need-chosen.length===1?'':'s'} to bring along.`;
    musEl.querySelector('.ms-cards').innerHTML=chosen.map(i=>{const u=opts[i],sk=SKILLS[u.skill];return`<div class="dcard on">${unitCard(u)}<button type="button" class="mini ms-x" data-u="${i}" aria-label="Remove ${u.name}">✕</button><p class="ms-sk"><b>${sk.n}:</b> ${sk.d}${isSummoner(u)?` <b>Familiar:</b> ${famOf(u).n}, ${famOf(u).d}. Called once per battle.`:''}</p></div>`}).join('')};
  draw();
  return new Promise(res=>{musEl.onclick=e=>{
    const u=e.target.closest('[data-u]');if(u){const i=+u.dataset.u,k=chosen.indexOf(i);if(k>=0)chosen.splice(k,1);else if(chosen.length<need)chosen.push(i);else if(need===1)chosen.splice(0,1,i);else toast(`Only ${need} can come. Remove someone first.`);sfx('tick');draw();return}
    const g=e.target.closest('[data-g]');if(!g||g.disabled)return;
    if(g.dataset.g==='map'){musEl.hidden=true;sfx('select');mapScreen(true).then(()=>{musEl.hidden=false});return}
    if(g.dataset.g==='info'){const h=musEl.querySelector('.stathelp');h.hidden=!h.hidden;g.setAttribute('aria-expanded',String(!h.hidden));return}
    musEl.onclick=null;musEl.hidden=true;sfx('select');
    res(g.dataset.g==='go'?chosen.map(i=>opts[i]):null)}});
}

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function musterArt(){return art('scenes/crossroads')}
function flagArt(){return art('nodes/start')}
function sageRoomArt(){return art('scenes/sage-room')}
