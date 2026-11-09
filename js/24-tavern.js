/* Gold, meals and the tavern */
/* ---- gold and meals ---- */
/* GOLDWIN: gold earned for winning each kind of fight */
const GOLDWIN={battle:25,elite:45,boss:80};
const gold=()=>run&&run.gold||0;
/* food: temporary buffs that last n fights (counted down after each won fight) */
/* p = price in gold, f = how many fights it lasts, d = effect shown in game */
const MEALS={
  boar:{n:'Roast Boar',p:35,f:3,d:'+2 damage'},
  bread:{n:'Honey Bread',p:25,f:3,d:'+15 Hit'},
  pie:{n:'Fish Pie',p:30,f:3,d:'+2 Def and Res'},
  stew:{n:'Pepper Stew',p:40,f:2,d:'+1 Move'},
  soup:{n:'Mushroom Soup',p:20,f:3,d:'Immune to poison'}
};
const M=id=>!!(run&&run.meals&&run.meals.some(m=>m.id===id&&m.n>0));
function afterFightMeals(){if(!run)return;if(run.meals){run.meals.forEach(m=>m.n--);run.meals=run.meals.filter(m=>m.n>0)}}

/* ---- the tavern ---- */
/* KEEPER: the innkeeper's name and sprite colours */
const KEEPER={name:'Marla',look:{style:'bun',hair:'#8a2a22',skin:'#e8b98f',cloth:'#5a6a3a',sash:'#7a5230',eye:'#3a5a8a',apron:true}};
/* p = price in gold, d = effect, all = affects the whole squad, st = which stat(s) the chosen unit gains */
const DRINKS={
  ale:{n:'A round of ale',p:25,d:'Every unit gains 15 EXP.',all:true},
  whiskey:{n:'Dragonfire Whiskey',p:45,d:'One unit gains +1 Str or Mag (whichever is higher).',st:u=>u.mag>u.str?'mag':'str'},
  cordial:{n:'Moonberry Cordial',p:45,d:'One unit gains +1 Spd.',st:()=>'spd'},
  stout:{n:'Ironbark Stout',p:45,d:'One unit gains +1 Def.',st:()=>'def'},
  tea:{n:'Sage Tea',p:35,d:'One unit gains +1 Res and +1 Luck.',st:()=>['res','lck']}
};
const GREET=['“Mind the step, it’s been loose for years. What’ll it be?”','“Sit anywhere that isn’t sticky. What can I get ya?”','“You look like you’ve walked through worse than rain. Drink?”','“Another band of heroes. Coin first, stories after.”'];
const tavEl=document.createElement('div');tavEl.className='tav';tavEl.hidden=true;document.body.appendChild(tavEl);
function tavShow(text,opts){
  /* opts: [key,label,sub?,disabled?] -> resolves with the chosen key */
  tavEl.querySelector('.tv-text').innerHTML=text;
  tavEl.querySelector('.tv-gold').textContent=gold()+' gold';
  tavEl.querySelector('.tv-opts').innerHTML=opts.map(([k,l,sub,dis])=>`<button type="button" class="tv-o" data-t="${k}"${dis?' disabled':''}>${l}${sub?`<span>${sub}</span>`:''}</button>`).join('');
  return new Promise(res=>{tavEl.onclick=e=>{const b=e.target.closest('[data-t]');if(!b||b.disabled)return;sfx('tick');res(b.dataset.t)}});
}
function spend(n){run.gold=gold()-n;sfx('buy')}
function keeperArt(){return art('npcs/innkeeper')}
async function tavernNode(){
  const look={...KEEPER.look},keeper=keeperArt(),bought=new Set(),done={},B=actBiome();
  const hires=castOffer(3,Math.max(1,Math.round(run.roster.reduce((a,u)=>a+u.lv,0)/run.roster.length)),'tavern');
  /* hires who join already advanced (Lv 1 but strong: Sigrun, Kaya, and the after-Act-1 cast) cost 45 more */
  const price=u=>40+15*u.lv+(CLS[u.cls].tier===2?45:0);
  tavEl.innerHTML=`<div class="tv-scene"><img class="tv-bg" src="${tavernArt()}" alt=""><img class="tv-keeper" src="${keeper}" alt="${KEEPER.name}"><img class="tv-counter" src="${counterArt()}" alt=""><span class="tv-gold"></span></div>
    <div class="tv-box"><div class="tv-name">${KEEPER.name}, the innkeeper</div><p class="tv-text"></p><div class="tv-opts"></div></div>`;
  tavEl.hidden=false;music('tavern');
  tip('tavern','The tavern','Spend the gold you earn from fights: one drink, one meal and one hire per visit. Food lasts a few fights; drink boosts are permanent.');
  let text=pick(GREET);
  for(;;){
    const m=await tavShow(text,[['drink','Drinks at the bar',done.drink?'You’ve had your drink':'Ale, spirits and tea',done.drink],['food','Something to eat',done.food?'You’ve eaten':`Buffs for a few fights${(run.meals||[]).length?` · ${run.meals.length} active`:''}`,done.food],['hire','Anyone looking for work?',done.hire?'You’ve hired someone':`${hires.length} sellsword${hires.length===1?'':'s'} at the tables`,done.hire],/*['rumour','Heard any rumours?',''],*/['leave','Head back out','']]);
    if(m==='leave'){tavEl.hidden=true;tavEl.onclick=null;music(B.id);return}
    if(m==='rumour'){text=pick([`“They say ${B.boss.name||'a minotaur lord'} is waiting at the end of ${theN(B)}. ${B.tip[2]}”`,`“A traveller came through last week, white as milk. Said ${theN(B)} is no place for the unprepared. ${B.tip[2]}”`]);continue}
    if(m==='drink'){
      for(;;){const d=await tavShow('“Here’s what I’m pouring tonight.”',[...Object.entries(DRINKS).map(([k,x])=>[k,`<img class="tv-ic" src="${mugArt()}" alt="">${x.n} · ${x.p}g`,x.d+(bought.has(k)?' (sold out)':''),bought.has(k)||gold()<x.p]),['back','Back','']]);
        if(d==='back')break;const x=DRINKS[d];if(x.all)sfx('pour');
        if(x.all){spend(x.p);bought.add(d);done.drink=1;tavEl.hidden=true;for(const u of run.roster){const g=gainExp(u,30);if(g&&g.gains)await levelUp(u,g)}tavEl.hidden=false;text='“To the road!” The whole squad drinks, and tells each other stories that get bigger with every round.';break}
        tavEl.hidden=true;const u=await pickUnit(`Who drinks the ${x.n}?`,x.d);tavEl.hidden=false;if(!u)continue;
        spend(x.p);sfx('pour');bought.add(d);done.drink=1;const ss=[].concat(x.st(u));ss.forEach(s=>{if(s==='hp'){u.maxhp++;u.hp++}else u[s]++});
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
      spend(price(nu));done.hire=1;run.roster.push(nu);castJoined(nu);hires.splice(hires.indexOf(nu),1);text=`${nu.name} finishes their drink and picks up their gear. “When do we leave?”`;continue}
  }
}

/* PNG art (art/<key>.png, see art() in 03-art.js) */
function mealArt(id){return art('meals/'+id)}
function mugArt(){return art('ui/mug')}
function tavernArt(){return art('scenes/tavern')}
function counterArt(){return art('scenes/tavern-counter')}
