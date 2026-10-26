/* Promotion choices */
/* ---- promotion choices: the usual upgrade, plus a new movement type and a new role that keep the weapon ---- */
const mvOk=(r,w,m)=>r==='knight'?m==='armour':(r==='rogue'||r==='summoner')?m==='foot':m==='armour'?false:m==='flying'?w!=='bow'&&unl('flying'):true;
function promoOptions(u){
  if(!u.cls.startsWith('G.'))return[CLS[u.cls].promo];
  const[,r,m,w]=u.cls.split('.'),out=[`G.${r}.${m}.${w}.2`];
  const mvs=['foot','armour','mounted','flying'].filter(x=>x!==m&&mvOk(r,w,x));if(mvs.length)out.push(`G.${r}.${pick(mvs)}.${w}.2`);
  const roles=Object.keys(ROLES).filter(x=>x!==r&&ROLES[x].w.includes(w)&&(x!=='summoner'||unl('summoner')));if(roles.length){const r2=pick(roles);out.push(`G.${r2}.${mvOk(r2,w,m)?m:r2==='knight'?'armour':'foot'}.${w}.2`)}
  return[...new Set(out)].map(ensureCls);
}
/* movement changes on promotion need a mount (or a helm) on the sprite */
function lookFor(L,to){const l=clone(L),m=to.split('.')[2];
  if((m==='mounted'||m==='flying')&&!l.horse)Object.assign(l,mountLook(m,to.split('.')[1]));
  if(m!=='flying'&&l.mount){delete l.mount;if(m==='mounted')Object.assign(l,mountLook(m,to.split('.')[1]));else delete l.horse}if(m==='flying'&&!l.mount)Object.assign(l,mountLook(m,to.split('.')[1]));
  if(m==='armour'&&!l.gear)l.gear='helm';return l}
function mountLook(m,role){
  if(m==='flying'){const wy=role==='bruiser'||role==='tank';return{mount:wy?'wyvern':'pegasus',horse:wy?pick(['#4f7a4a','#5a4a7a','#7a4a3a','#3a5a6a']):pick(['#f3f0e8','#e0e6f0','#f0e0e8'])}}
  return{horse:pick(['#7a5230','#4a3426','#c9c3b8','#2a2226','#a8743a','#8a8f9a','#e8e2d0'])};
}
async function promoPick(u,forced){
  const opts=promoOptions(u);if(opts.length<2)return opts[0];
  const views=opts.map(k=>({k,look:lookFor(u.look,k)}));
  const m=await modal(`<div class="eyebrow">Lv ${PROMO_LV} · Ascension</div><h2>Choose ${u.name}’s ascension</h2><p>${u.name} the ${CLS[u.cls].n} can ascend into one of these classes. Whichever you pick, they keep their weapon, gain +${PROMO_CAP} skill capacity and go back to Lv 1 (keeping their stats). Each card shows the class and the stat bonus it adds.</p>
    <div class="draft">${views.map((v,i)=>{const C=CLS[v.k],tmp=Object.assign(clone(u),{cls:v.k,look:v.look,id:u.id+'~p'+i});
      return`<button type="button" class="dcard" data-m="c${i}"><div class="dimg"><img src="${sprite(tmp,'idle',mapWk(u))}" alt=""></div><div class="dtxt"><b>${C.n}</b><span class="dcls">Move ${C.mov} · ${C.w.map(t=>TN[t]).join(', ')}${C.fly?' · Flies':''}</span><span class="dst">Bonus: ${shown(u).map(s=>{const v=s==='lck'?C.bonus[3]+C.bonus[5]:C.bonus[ST.indexOf(s)];return v?`${SL[s]} +${v}`:''}).filter(Boolean).join(' ')}</span></div></button>`}).join('')}</div>
    ${forced?'':'<div class="mbtns"><button type="button" data-m="no">Not yet (ascend later)</button></div>'}`);
  if(m==='no')return null;const v=views[+m.slice(1)];u.look=v.look;return v.k;
}


