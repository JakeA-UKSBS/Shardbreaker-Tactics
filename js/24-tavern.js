/* Gold, meals and the tavern */
/* ---- gold and meals ---- */
const GOLDWIN={battle:25,elite:45,boss:80};
const gold=()=>run&&run.gold||0;
/* food: temporary buffs that last n fights (counted down after each won fight) */
const MEALS={
  boar:{n:'Roast Boar',p:35,f:3,d:'+2 damage'},
  bread:{n:'Honey Bread',p:25,f:3,d:'+15 Hit'},
  pie:{n:'Fish Pie',p:30,f:3,d:'+2 Def and Res'},
  stew:{n:'Pepper Stew',p:40,f:2,d:'+1 Move'},
  soup:{n:'Mushroom Soup',p:20,f:3,d:'Immune to poison'}
};
const M=id=>!!(run&&run.meals&&run.meals.some(m=>m.id===id&&m.n>0));
function mealArt(id){const c='ML|'+id;if(sprCache[c])return sprCache[c];const p=Px(16,16);
  p.ell(8,12,7,3,'#d8d0bc');p.ell(8,11,6,2,'#efe6cf');
  if(id==='boar'){p.ell(8,8,5,3.5,'#8a4a2a');p.ell(7,7,2,1,'#b06a3a');p.line(12,6,15,3,'#efe6cf')}
  if(id==='bread'){p.ell(8,8,5,3,'#c98a3a');p.line(5,7,7,9,'#8a5a2a');p.line(8,7,10,9,'#8a5a2a');p.ell(11,5,2,1.5,'#ffd23f')}
  if(id==='pie'){p.ell(8,9,5.5,2.6,'#c9a050');p.ell(8,8,5,2,'#e0bc6a');p.poly([[12,6],[15,4],[14,8]],'#7a9ab8')}
  if(id==='stew'){p.ell(8,9,5.5,2.5,'#5a3a2a');p.ell(8,8,4.5,1.6,'#c8322e');p.set(6,8,'#7fd36a');p.set(10,7,'#ffd23f')}
  if(id==='soup'){p.ell(8,9,5.5,2.5,'#7a5a3a');p.ell(8,8,4.5,1.6,'#c9a070');p.ell(6,7,1.6,1,'#d8483a');p.ell(10,8,1.4,1,'#d8483a')}
  p.outline(OUT);return sprCache[c]=p.url()}
function mugArt(){const c='MUG';if(sprCache[c])return sprCache[c];const p=Px(16,16);p.rect(4,5,7,9,'#a8743a');p.rect(4,5,7,1,'#7a5230');p.rect(4,10,7,1,'#7a5230');p.ring(12,9,2.4,'#7a5230');p.ell(7.5,4,4.5,2,'#f3f0e8');p.ell(5,3,1.5,1,'#ffffff');p.rect(5,6,1,7,'#c98a4a');p.outline(OUT);return sprCache[c]=p.url()}
function afterFightMeals(){if(!run)return;for(const k of['meals','woes']){if(!run[k])continue;run[k].forEach(m=>m.n--);run[k]=run[k].filter(m=>m.n>0)}}

/* ---- the tavern ---- */
const KEEPER={name:'Marla',look:{style:'bun',hair:'#8a2a22',skin:'#e8b98f',cloth:'#5a6a3a',sash:'#7a5230',eye:'#3a5a8a',apron:true}};
const DRINKS={
  ale:{n:'A round of ale',p:25,d:'Every unit gains 30 EXP.',all:true},
  whiskey:{n:'Dragonfire Whiskey',p:45,d:'One unit gains +1 Str or Mag (whichever is higher).',st:u=>u.mag>u.str?'mag':'str'},
  cordial:{n:'Moonberry Cordial',p:45,d:'One unit gains +1 Spd.',st:()=>'spd'},
  stout:{n:'Ironbark Stout',p:45,d:'One unit gains +1 Def.',st:()=>'def'},
  tea:{n:'Sage Tea',p:35,d:'One unit gains +1 Res and +1 Luck.',st:()=>['res','lck']}
};
const GREET=['“Mind the step, it’s been loose for years. What’ll it be?”','“Sit anywhere that isn’t sticky. What can I get you?”','“You look like you’ve walked through worse than rain. Drink?”','“Another band of heroes. Coin first, stories after.”'];
function tavernArt(){const c='TAV';if(sprCache[c])return sprCache[c];const W=160,H=90,p=Px(W,H);
  p.rect(0,0,W,H,'#4a3020');for(let x=0;x<W;x+=12)p.rect(x,0,1,H,'#3a2418');for(let x=6;x<W;x+=12)for(let y=6;y<60;y+=20)p.set(x,y,'#6a4a30');
  p.rect(8,10,28,22,'#2a1a10');p.rect(10,12,24,18,'#1a2240');p.rect(21,12,2,18,'#2a1a10');p.rect(10,20,24,2,'#2a1a10');[[13,14],[28,15],[16,25],[30,26],[25,13]].forEach(([x,y])=>p.set(x,y,'#f3f0e8'));p.ell(31,16,2,2,'#f3e6b0');
  for(const sy of[24,44]){p.rect(46,sy,106,3,'#2a1a10');p.rect(46,sy,106,1,'#6a4a30');
    for(let i=0;i<11;i++){const x=50+i*9,col=['#3a6a3a','#7a2a2a','#2a4a6a','#a8743a','#5a3a6a'][(i+sy)%5],h=7+(i*3+sy)%5;
      if((i+sy)%4===3){p.rect(x-1,sy-6,7,6,'#c9a070');p.rect(x-1,sy-6,7,1,'#a8743a');continue}
      p.rect(x,sy-h,5,h,col);p.rect(x+1,sy-h-3,3,3,col);p.rect(x+1,sy-h-4,3,1,'#c9a070');p.rect(x+1,sy-h+2,1,h-4,shade(col,1.4))}}
  p.ell(150,10,9,9,'#5a3a24');p.ell(150,10,4,5,'#ffd27a');p.ell(150,10,2,3,'#fff6d0');p.line(150,0,150,4,'#2a1a10');
  p.ell(14,62,8,10,'#7a5230');p.rect(6,56,16,2,'#4a2e1a');p.rect(6,66,16,2,'#4a2e1a');p.ell(14,52,8,2,'#8a6040');
  p.rect(0,70,W,20,'#2a1a12');for(let x=0;x<W;x+=20)p.rect(x,70,1,20,'#1e120c');
  return sprCache[c]=p.url()}
function counterArt(){const c='CTR';if(sprCache[c])return sprCache[c];const p=Px(160,34);
  p.rect(0,8,160,26,'#5a3a22');p.rect(0,8,160,5,'#8a5a32');p.rect(0,8,160,1,'#b07a42');for(let x=10;x<160;x+=20){p.rect(x,14,1,20,'#4a2e1a');p.rect(x+2,16,16,1,'#6a4428')}
  for(const x of[28,44,118]){p.rect(x,1,7,8,'#a8743a');p.ell(x+3.5,1,4,1.5,'#f3f0e8');p.ring(x+8,4,2,'#7a5230')}
  p.rect(132,2,6,7,'#3a6a3a');p.rect(133,0,4,2,'#3a6a3a');
  return sprCache[c]=p.url()}
const tavEl=document.createElement('div');tavEl.className='tav';tavEl.hidden=true;document.body.appendChild(tavEl);
function tavShow(text,opts){
  /* opts: [key,label,sub?,disabled?] -> resolves with the chosen key */
  tavEl.querySelector('.tv-text').innerHTML=text;
  tavEl.querySelector('.tv-gold').textContent=gold()+' gold';
  tavEl.querySelector('.tv-opts').innerHTML=opts.map(([k,l,sub,dis])=>`<button type="button" class="tv-o" data-t="${k}"${dis?' disabled':''}>${l}${sub?`<span>${sub}</span>`:''}</button>`).join('');
  return new Promise(res=>{tavEl.onclick=e=>{const b=e.target.closest('[data-t]');if(!b||b.disabled)return;sfx('tick');res(b.dataset.t)}});
}
function spend(n){run.gold=gold()-n;sfx('item')}
async function tavernNode(){
  const look={...KEEPER.look},keeper=fig(look,'Heir','g','idle',null),bought=new Set(),done={},B=actBiome();
  const hires=Array.from({length:3},()=>{const lv=Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length)+ri(-1,1));return genUnit(lv)});
  const price=u=>40+15*u.lv;
  tavEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${tavernArt()}" alt=""><img class="tv-keeper" src="${keeper}" alt="${KEEPER.name}"><img class="tv-counter" src="${counterArt()}" alt=""><span class="tv-gold"></span></div>
    <div class="tv-box"><div class="tv-name">${KEEPER.name}, the innkeeper</div><p class="tv-text"></p><div class="tv-opts"></div></div>`;
  tavEl.hidden=false;music('tavern');run.roster.forEach(u=>u.hp=u.maxhp);
  tip('tavern','The tavern','Spend the gold you earn from fights: one drink, one meal and one hire per visit. Food lasts a few fights; drink boosts are permanent.');
  let text=pick(GREET)+' (A night’s rest here heals everyone fully.)';
  for(;;){
    const m=await tavShow(text,[['drink','Drinks at the bar',done.drink?'You’ve had your drink':'Ale, spirits and tea',done.drink],['food','Something to eat',done.food?'You’ve eaten':`Buffs for a few fights${(run.meals||[]).length?` · ${run.meals.length} active`:''}`,done.food],['hire','Anyone looking for work?',done.hire?'You’ve hired someone':`${hires.length} sellsword${hires.length===1?'':'s'} at the tables`,done.hire],/*['rumour','Heard any rumours?',''],*/['leave','Head back out','']]);
    if(m==='leave'){tavEl.hidden=true;tavEl.onclick=null;music(B.id);return}
    if(m==='rumour'){text=pick([`“They say ${B.boss.name||'a minotaur lord'} is waiting at the end of ${theN(B)}. ${B.tip[2]}”`,`“A traveller came through last week, white as milk. Said ${theN(B)} is no place for the unprepared. ${B.tip[2]}”`]);continue}
    if(m==='drink'){
      for(;;){const d=await tavShow('“Here’s what I’m pouring tonight.”',[...Object.entries(DRINKS).map(([k,x])=>[k,`<img class="tv-ic" src="${mugArt()}" alt="">${x.n} · ${x.p}g`,x.d+(bought.has(k)?' (sold out)':''),bought.has(k)||gold()<x.p]),['back','Back','']]);
        if(d==='back')break;const x=DRINKS[d];
        if(x.all){spend(x.p);bought.add(d);done.drink=1;tavEl.hidden=true;for(const u of run.roster){const g=gainExp(u,30);if(g&&g.gains)await levelUp(u,g)}tavEl.hidden=false;text='“To the road!” The whole squad drinks, and tells each other stories that get bigger with every round.';break}
        tavEl.hidden=true;const u=await pickUnit(`Who drinks the ${x.n}?`,x.d);tavEl.hidden=false;if(!u)continue;
        spend(x.p);bought.add(d);done.drink=1;const ss=[].concat(x.st(u));ss.forEach(s=>{if(s==='hp'){u.maxhp++;u.hp++}else u[s]++});
        text=`${u.name} downs the ${x.n}. ${ss.map(s=>SL[s]+' +1').join(', ')}. “Steady now.”`;break}
      continue}
    if(m==='food'){
      const act=(run.meals||[]).map(x=>`${MEALS[x.id].n} (${x.n} fight${x.n>1?'s':''} left)`).join(', ');
      const f=await tavShow(`“Kitchen’s open. It all lasts a few fights, for the whole table.”${act?` Still in your bellies: ${act}.`:''}`,[...Object.entries(MEALS).map(([k,x])=>[k,`<img class="tv-ic" src="${mealArt(k)}" alt="">${x.n} · ${x.p}g`,`${x.d} for ${x.f} fights${M(k)?' (already eaten)':''}`,M(k)||gold()<x.p]),['back','Back','']]);
      if(f!=='back'){spend(MEALS[f].p);done.food=1;run.ate=(run.ate||0)+1;(run.meals=run.meals||[]).push({id:f,n:MEALS[f].f+(R('plenty')?1:0)+(unl('gourmet')?1:0)});text=`The ${MEALS[f].n} arrives steaming. ${MEALS[f].d} for the next ${MEALS[f].f} fights.`}
      continue}
    if(m==='hire'){
      if(!hires.length){text='“That’s everyone who wanted work tonight.”';continue}
      const full=run.roster.length>=TEAM_CAP;
      const h=await tavShow(`“They’ll follow you for the right price.”${full?` Your squad is full (${TEAM_CAP}), so someone would have to stay behind.`:''}`,[...hires.map((u,i)=>['h'+i,`<img class="tv-spr" src="${uSpr(u)}" alt="">${u.name} · ${price(u)}g`,`${CLS[u.cls].n} · Lv ${u.lv} · HP ${u.maxhp} Str ${u.str} Mag ${u.mag} Spd ${u.spd} Def ${u.def}`,gold()<price(u)]),['back','Back','']]);
      if(h==='back')continue;const nu=hires[+h.slice(1)];
      if(full){tavEl.hidden=true;const d=await modal(`<h2>Who stays behind?</h2><p>${nu.name} takes their place.</p><div class="draft">${run.roster.map((u,i)=>`<button type="button" class="dcard" data-m="d${i}">${unitCard(u)}</button>`).join('')}</div><div class="mbtns"><button type="button" data-m="skip">Keep my squad</button></div>`);tavEl.hidden=false;
        if(d==='skip')continue;run.roster.splice(+d.slice(1),1)}
      spend(price(nu));done.hire=1;run.roster.push(nu);hires.splice(hires.indexOf(nu),1);text=`${nu.name} finishes their drink and picks up their gear. “When do we leave?”`;continue}
  }
}


