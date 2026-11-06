/* Promotion choices */
/* ascension choices: each cast class lists the classes it can ascend into (CLS.asc, from CAST in 14b-cast.js) */
function promoOptions(u){return CLS[u.cls].asc||[CLS[u.cls].promo]}
async function promoPick(u,forced){
  const opts=promoOptions(u);if(opts.length<2){const l=castLook(u,opts[0]);if(l)u.look=l;return opts[0]}
  const views=opts.map(k=>({k,look:castLook(u,k)||u.look}));
  const m=await modal(`<div class="eyebrow">Lv ${PROMO_LV} · Ascension</div><h2>Choose ${u.name}’s ascension</h2><p>${u.name} the ${CLS[u.cls].n} can ascend into one of these classes. Whichever you pick, they keep their weapon, gain +${PROMO_CAP} skill capacity and go back to Lv 1 (keeping their stats). Each card shows the class and the stat bonus it adds.</p>
    <div class="draft">${views.map((v,i)=>{const C=CLS[v.k],tmp=Object.assign(clone(u),{cls:v.k,look:v.look,id:u.id+'~p'+i});
      return`<button type="button" class="dcard" data-m="c${i}"><div class="dimg"><img src="${sprite(tmp,'idle',mapWk(u))}" alt=""></div><div class="dtxt"><b>${C.n}</b><span class="dcls">Move ${C.mov} · ${C.w.map(t=>TN[t]).join(', ')}${C.fly?' · Flies':''}</span><span class="dst">Bonus: ${shown(u).map(s=>{const v=s==='lck'?C.bonus[3]+C.bonus[5]:C.bonus[ST.indexOf(s)];return v?`${SL[s]} +${v}`:''}).filter(Boolean).join(' ')}</span></div></button>`}).join('')}</div>
    ${forced?'':'<div class="mbtns"><button type="button" data-m="no">Not yet (ascend later)</button></div>'}`);
  if(m==='no')return null;const v=views[+m.slice(1)];u.look=v.look;return v.k;
}


