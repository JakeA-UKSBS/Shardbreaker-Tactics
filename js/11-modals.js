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
function saveOpts(){try{localStorage.setItem(OPTS,JSON.stringify(settings))}catch(_){}}
async function optionsMenu(fromTitle){
  for(;;){
    const row=(k,l,v)=>`<div class="opt"><span>${l}</span><button type="button" data-m="${k}" class="${v?'go':''}">${v?'On':'Off'}</button></div>`;
    const m=await modal(`<h2>Options</h2>${row('anim','Battle animations',settings.anim)}${row('sound','Sound and music',settings.sound)}${row('steps','Walking sounds',settings.steps!==false)}${row('tips','Tutorial tips',settings.tips)}<div class="opt"><span>Colour scheme</span><button type="button" data-m="theme">${THEMES[settings.theme]||'Tavern'}</button></div>${row('dev','Dev mode (testing)',settings.dev)}<button type="button" data-m="chart">Effective damage chart</button><div class="mbtns">${fromTitle?'':'<button type="button" data-m="title">Back to title</button>'}<button class="go" type="button" data-m="close">Close</button></div>`);
    if(m==='chart'){await effChart();continue}if(m==='theme'){const ks=Object.keys(THEMES);settings.theme=ks[(ks.indexOf(settings.theme)+1)%ks.length];applyTheme();saveOpts();continue}if(m==='anim')settings.anim=!settings.anim;else if(m==='sound'){settings.sound=!settings.sound;sfx('select');const k=bgmKey;if(bgm)bgm.pause();bgm=null;bgmKey='';music(k)}else if(m==='steps'){settings.steps=settings.steps===false;if(settings.steps)stepSfx({cls:''})}else if(m==='rewind'){settings.rewind=!settings.rewind;if(state)render()}else if(m==='tips'){settings.tips=!settings.tips;if(settings.tips)settings.seen=[]}else if(m==='dev'){settings.dev=!settings.dev;if(state)render()}
    else if(m==='title'){saveGame();document.querySelectorAll('.nmap,.tav,.sheet').forEach(e=>e.hidden=true);titleScreen();return}else return;
    saveOpts();
  }
}

