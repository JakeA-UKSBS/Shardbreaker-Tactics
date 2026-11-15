/* Modal dialogs, level-ups, tutorial tips and the options menu */
/* ================= MODALS ================= */
function modal(html){modalEl.innerHTML=`<div class="mbox">${html}</div>`;modalEl.hidden=false;return new Promise(res=>{modalEl.onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;modalEl.hidden=true;modalEl.onclick=null;res(b.dataset.m)}})}
async function levelUp(u,g){
  const rows=shown(u).map(s=>`<div data-s="${s}"><span>${SL[s]}</span><span><b class="v">${g.old[s]}</b><em></em></span></div>`).join('');
  const done=modal(`<div class="lvhead"><img src="${portrait(u)}" alt=""><div><div class="eyebrow">Growth</div><h2>${u.name}</h2><p class="lvn">Lv ${g.old.lv}</p></div></div><div class="lvl">${rows}</div><div class="mbtns"><button class="go" type="button" data-m="ok" disabled>Continue</button></div>`);
  /* quick: the level ticks over, then every stat that grew goes up together with one ding */
  modalEl.querySelector('.lvn').textContent=`Lv ${g.old.lv} → ${u.lv}`;await sleep(fast?120:260);
  for(const s of ST){if(!g.gains[s]||s==='learned')continue;const row=modalEl.querySelector(`[data-s="${s}"]`);if(!row)continue;
    row.classList.add('up');row.querySelector('.v').textContent=g.old[s]+1;row.querySelector('em').textContent='+1'}sfx('ding');
  if(g.gains.learned){const sk=SKILLS[g.gains.learned],row=document.createElement('div');row.className='lvsk';row.innerHTML=`<span>New skill</span><b>${sk.n}</b><small>${sk.d}</small>`;modalEl.querySelector('.lvl').after(row);sfx('fanfare')}
  const b=modalEl.querySelector('[data-m]');if(b)b.disabled=false;
  await done;await evolveCheck(u);
}
/* units evolve the moment they reach PROMO_LV: pick a path, then the ascension plays */
async function evolveCheck(u){if(u.team!=='p'||CLS[u.cls].tier===2||!CLS[u.cls].promo||u.lv<PROMO_LV)return;const was=busy;busy=true;const L0=u.look,to=await promoPick(u,true);u._nl=u.look;u.look=L0;await ascend(u,to);busy=was;if(state&&state.units.includes(u))render()}
function tip(id,title,text){
  if(!settings.tips||settings.seen.includes(id)||!modalEl.hidden)return;
  settings.seen.push(id);saveOpts();
  modalEl.innerHTML=`<div class="mbox tipbox"><div class="eyebrow">Tip</div><h2>${title}</h2><p>${text}</p><div class="mbtns"><button type="button" data-m="off">Turn off tutorials</button><button class="go" type="button" data-m="ok">Got it</button></div><p class="hint">You can turn them back on in Options.</p></div>`;
  modalEl.hidden=false;modalEl.onclick=e=>{const b=e.target.closest('[data-m]');if(b){if(b.dataset.m==='off'){settings.tips=false;saveOpts();toast('Tutorials off')}modalEl.hidden=true;modalEl.onclick=null}};
}
/* ---- SFX testing (Options > SFX testing) ----
   Every sound name with a play button. Drop an audio file on a row to hear it in place of that sound (this session only),
   tweak its volume, then Copy gives the SFX_FILE line (05-sound.js) to paste in, with the file saved to sfx/. */
const SFX_WHEN={select:'left-click confirm',decline:'right-click back',move:'unit picked up to move',step:'footsteps on foot',hoof:'cavalry moving',flap:'fliers moving',
  jump:'climbing to higher ground',swing:'heavy weapons, lances, staffs',slash:'blades',claw:'fangs and claws',arrow:'bows',throw:'javelins, throwing axes',hit:'a blow lands',
  miss:'a miss',critcharge:'crit wind-up',crit:'crit impact',swordcrit:'sword crit impact',block:'shield block, Guard',broke:'weapon breaks, trap, shatter',death:'a unit falls',
  fire:'fire spells, Burn',water:'water spells',ice:'ice spells',thunder:'lightning',wind:'wind spells',earth:'earth/stone abilities, ground slams',dark:'dark magic, life drain',
  sandswipe:'sand attacks, Sand in Eyes',poison:'Poison lands',debuff:'a debuff lands',slow:'Slow lands',heal:'heals, salves, camps',levelup:'stat gains on level up',
  ding:'level up, reward',item:'item, relic or gold gained',fanfare:'victory, big reward',phase:'player phase starts',ephase:'enemy phase starts',bell:'battle starts',
  rise:'boss intro build-up',burst:'boss intro hit',tick:'small UI steps, counters',equip:'equipping gear',buy:'buying',anvil:'smith events (reforge)',book:'reading events',
  lever:'Caged Traveller lock',pour:'drinks, Bog Witch tea, fountain',chestopen:'chests and caches opening',paper:'merchant and tailor wares'};
async function sfxTest(){
  const names=[...new Set([...Object.keys(SFX_FILE),...Object.keys(SFX)])].sort(),drop={};let done=false;
  const src=n=>drop[n]?`dropped: ${drop[n]}`:SFX_FILE[n]?SFX_FILE[n][0].replace('sfx/',''):'synth';
  const row=n=>`<div class="sfxr" data-n="${n}"><button type="button" class="go" data-p="${n}">▶</button><div><b>${n}</b>${SFX_MUTED.has(n)?' <em>(muted)</em>':''}<span>${SFX_WHEN[n]||''}</span></div>
    <span class="sfxs">${src(n)}</span><input type="range" min="0" max="1" step="0.05" value="${SFX_FILE[n]?SFX_FILE[n][1]:.6}" data-v="${n}" ${SFX_FILE[n]?'':'disabled'} title="Volume">
    <button type="button" data-c="${n}" ${SFX_FILE[n]?'':'disabled'}>Copy</button></div>`;
  const p=modal(`<h2>SFX testing</h2><p class="hint">${settings.sound?'':'<b>Sound is off in Options.</b> '}Drop an audio file on a row to try it as that sound (until you reload).</p>
    <div class="sfxt">${names.map(row).join('')}</div><div class="mbtns"><button type="button" data-m="close" class="go">Back</button></div>`);
  const box=modalEl.querySelector('.mbox');box.classList.add('sfxbox');
  const play=n=>{const c=audio();if(!c)return;try{if(AU.buf[n]){if(n==='step')[0,.16].forEach((d,i)=>playBuf(n,d,i?.92:1.04));else playBuf(n)}else SFX[n]()}catch(_){}};/* ignores the mute list */
  const redo=n=>{const r=box.querySelector(`.sfxr[data-n="${n}"]`);r.outerHTML=row(n)};
  box.addEventListener('click',e=>{const b=e.target.closest('[data-p],[data-c]');if(!b)return;e.stopPropagation();
    if(b.dataset.p)play(b.dataset.p);
    else{const n=b.dataset.c,f=SFX_FILE[n],line=`${n}:['${f[0]}',${f[1]}]`;navigator.clipboard?.writeText(line).then(()=>toast('Copied: '+line),()=>toast(line))}});
  box.addEventListener('input',e=>{const n=e.target.dataset.v;if(n&&SFX_FILE[n])SFX_FILE[n][1]=+e.target.value});
  box.addEventListener('change',e=>{const n=e.target.dataset.v;if(n)play(n)});
  box.addEventListener('dragover',e=>{e.preventDefault();const r=e.target.closest('.sfxr');box.querySelectorAll('.sfxr.over').forEach(x=>x!==r&&x.classList.remove('over'));if(r)r.classList.add('over')});
  box.addEventListener('dragleave',e=>{const r=e.target.closest('.sfxr');if(r&&!r.contains(e.relatedTarget))r.classList.remove('over')});
  box.addEventListener('drop',async e=>{e.preventDefault();const r=e.target.closest('.sfxr'),f=e.dataTransfer.files[0];box.querySelectorAll('.over').forEach(x=>x.classList.remove('over'));
    if(!r||!f)return;const n=r.dataset.n,c=audio();if(!c){toast('Turn sound on in Options first');return}
    try{AU.buf[n]=await c.decodeAudioData(await f.arrayBuffer());SFX_FILE[n]=['sfx/'+f.name,SFX_FILE[n]?SFX_FILE[n][1]:.6];drop[n]=f.name;redo(n);play(n)}catch(_){toast(`Couldn't read ${f.name} as audio`)}});
  /* stop a missed drop from opening the file in the tab */
  const stop=e=>e.preventDefault();addEventListener('dragover',stop);addEventListener('drop',stop);
  await p;removeEventListener('dragover',stop);removeEventListener('drop',stop);
}
function saveOpts(){try{localStorage.setItem(OPTS,JSON.stringify(settings))}catch(_){}}
async function optionsMenu(fromTitle){
  for(;;){
    const row=(k,l,v)=>`<div class="opt"><span>${l}</span><button type="button" data-m="${k}" class="${v?'go':''}">${v?'On':'Off'}</button></div>`;
    const m=await modal(`<h2>Options</h2>${row('anim','Animations',settings.anim)}${row('sound','Sound and music',settings.sound)}${row('steps','Walking sounds',settings.steps!==false)}${row('tips','Tutorial tips',settings.tips)}<div class="opt"><span>Colour scheme</span><button type="button" data-m="theme">${THEMES[settings.theme]||'Tavern'}</button></div>${row('dev','Dev mode (testing)',settings.dev)}<button type="button" data-m="chart">Effective damage chart</button><button type="button" data-m="sfxtest">SFX testing</button><div class="mbtns">${fromTitle?'':'<button type="button" data-m="title">Quit to title</button>'}<button class="go" type="button" data-m="close">Close</button></div>`);
    if(m==='chart'){await effChart();continue}if(m==='sfxtest'){await sfxTest();continue}if(m==='theme'){const ks=Object.keys(THEMES);settings.theme=ks[(ks.indexOf(settings.theme)+1)%ks.length];applyTheme();saveOpts();continue}if(m==='anim')settings.anim=!settings.anim;else if(m==='sound'){settings.sound=!settings.sound;sfx('select');const k=bgmKey;if(bgm)bgm.pause();bgm=null;bgmKey='';music(k);const ak=ambKey;if(amb)amb.pause();amb=null;ambKey='';ambience(ak)}else if(m==='steps'){settings.steps=settings.steps===false;if(settings.steps)stepSfx({cls:''})}else if(m==='tips'){settings.tips=!settings.tips;if(settings.tips)settings.seen=[]}else if(m==='dev'){settings.dev=!settings.dev;if(state)render()}
    else if(m==='title'){saveGame();document.querySelectorAll('.nmap,.tav,.sheet').forEach(e=>e.hidden=true);titleScreen();return}else return;
    saveOpts();
  }
}

