/* Combat maths: weapons in range, calc(), forecasts, movement costs and reach */
/* ================= RULES ================= */
const isWpn=k=>WTYPES.includes(IT[k].t);
/* weapons never wear out, except the few big ones with a handful of uses (Meteor, Heaven’s Bolt) */
const endless=k=>isWpn(k)&&IT[k].uses>5;
/* Fliers cross sky and rough ground at cost 1, but not walls, masts or crags. */
function mcost(u,x,y){const t=ter(x,y);if(CLS[u.cls].phase)return 1;if(t.k==='lava'&&CLS[u.cls].lava)return 1;if(CLS[u.cls].fly)return['wall','mast','cliff','cavewall'].includes(t.k)?99:1;if(CLS[u.cls].mnt&&(t.k==='forest'||t.k==='hill'))return t.c+1;return t.c}
/* Teams: p = player, e = enemy, g = green 'other' units that fight the enemy and can be recruited. */
const hostile=(a,b)=>(a.team==='e')!==(b.team==='e');
/* Skills: u.skill is the personal skill (free). u.skills holds extras: {id,src:'lv10'} (free) or {id,src:'scroll'} (costs capacity). */
const has=(u,id)=>u.skill===id||!!(u.skills&&u.skills.some(x=>x.id===id));
const capUsed=u=>(u.skills||[]).reduce((a,x)=>a+(x.src==='scroll'?SKILLS[x.id].cost:0),0);
const capOf=u=>u.cap||BASE_CAP;
function learnBlock(u,k){if(has(u,k))return`${u.name} already knows ${SKILLS[k].n}.`;const c=SKILLS[k].cost;if(capUsed(u)+c>capOf(u))return`Needs ${c} capacity; ${u.name} has ${capOf(u)-capUsed(u)} free.`;return null}
function promoBlock(u){if(u.team!=='p')return'Only allies can ascend.';if(!CLS[u.cls].promo)return`${u.name} has already ascended.`;if(u.lv<PROMO_LV)return`${u.name} needs Lv ${PROMO_LV} to ascend.`;return null}
const elv=u=>u.lv+(CLS[u.cls].tier===2?15:0);
const canUse=(u,k)=>CLS[u.cls].w.includes(IT[k].t);
function wpnsAt(u,dist){const out=[];u.items.forEach((it,i)=>{const w=IT[it.k];if(isWpn(it.k)&&canUse(u,it.k)&&it.u>0&&dist>=w.r[0]&&dist<=w.r[1])out.push(i)});return out}
function staffIdx(u){return u.items.findIndex(it=>IT[it.k].t==='spirit'&&canUse(u,it.k)&&it.u>0)}
function eqIdx(u){return u.items.findIndex(it=>isWpn(it.k)&&canUse(u,it.k))}
function maxRange(u){let m=0;u.items.forEach(it=>{if((isWpn(it.k)||IT[it.k].t==='spirit')&&canUse(u,it.k))m=Math.max(m,IT[it.k].r[1])});return m}
function minRange(u){let m=9;u.items.forEach(it=>{if((isWpn(it.k)||IT[it.k].t==='spirit')&&canUse(u,it.k))m=Math.min(m,IT[it.k].r[0])});return m===9?1:m}
function aura(u){if(u.team!=='p')return 0;const l=state.units.find(o=>has(o,'rally')&&o.hp>0&&o.team===u.team&&o.id!==u.id);return l&&man(l,u)<=2?10:0}

const TYPES_ON=false;
/* ---- body tags and effective damage ----
   Monsters carry body tags; some weapons (and the slayer skills) are effective against a tag: ×2 weapon Mt (bows vs fliers too).
   One-way for now: only your side (and green allies) deal effective hits; your own units have no tags. */
const TAGS={flier:{n:'Flier'},armoured:{n:'Armoured'},beast:{n:'Beast'},colossal:{n:'Colossal'},spectral:{n:'Spectral'},plant:{n:'Plant'}};
const TAG_ORDER=['flier','armoured','beast','colossal','spectral','plant'];
const BODY_TAGS={golem:['armoured'],snail:['armoured'],turtle:['armoured'],cubes:['armoured'],armor:['armoured'],beast:['beast'],gator:['beast'],snake:['beast'],bear:['beast'],worm:['beast'],
  mount:['beast'],hawk:['beast'],roc:['beast'],dragon:['beast'],ghost:['spectral'],flame:['spectral'],frost:['spectral'],storm:['spectral'],shroom:['plant']};
const TAG_FIX={Treant:['plant'],StoneWarden:['armoured'],MiniGolem:['armoured']};
function tagsOf(u){if(!u||!u.cls||u.cls.startsWith('G.'))return[];const C=CLS[u.cls]||{};let t=(TAG_FIX[u.cls]||BODY_TAGS[C.body]||[]).slice();if(C.fly)t.unshift('flier');if((u.sz||1)>1)t.push('colossal');return[...new Set(t)]}
/* what a weapon is effective against: its own list, plus bows vs fliers, light sigils vs spectres, fire sigils vs plants */
function effOf(w){const o=(w&&w.eff||[]).slice();if(w&&w.t==='bow')o.push('flier');if(w&&w.el==='light')o.push('spectral');if(w&&w.el==='fire')o.push('plant');return o}
/* Paladins are holy warriors: everything they swing is effective against spectres */
const SLAYER={bladebane:'beast',heavybane:'armoured',polebane:'spectral'};
function effHit(x,xw,y){if(x.team==='e')return 0;const tg=tagsOf(y);if(!tg.length)return 0;const e=effOf(xw);for(const k in SLAYER)if(has(x,k))e.push(SLAYER[k]);
  if(CLS[x.cls]&&/Paladin/.test(CLS[x.cls].n))e.push('spectral');
  const hit=tg.filter(t=>e.includes(t));if(!hit.length)return 0;return 2}
function calc(x,xw,y,yw,ctx){
  const t=ter(y.x,y.y),RB=relicCalc(x,xw,y),gx=gearOf(x),gy=gearOf(y);let adv=0;
  /* weapon triangle and elements are switched off for now: every matchup is neutral (TRI, ELE and typeChart() are kept for later) */
  if(TYPES_ON){if(yw&&TRI[xw.t]===yw.t)adv=1;else if(yw&&TRI[yw.t]===xw.t)adv=-1;
  if(yw&&xw.t==='art'&&yw.t==='art'){if(ELE[xw.el]===yw.el)adv=1;else if(ELE[yw.el]===xw.el)adv=-1}}
  const eff=effHit(x,xw,y)||(xw.t==='bow'&&CLS[y.cls].fly?2:0);let pow=(xw.mag?x.mag:x.str)+xw.mt*(eff||1)+(eff&&R('trophies')?2:0)+adv+RB.pow+(xw.mag?0:gx.str);if(has(x,'kindle')&&ctx.init===x)pow+=2;
  const yf=!!CLS[y.cls].fly;let df=(xw.mag?y.res+gy.res:y.def+gy.def)+(yf?0:t.df)+RB.df;if(has(y,'brace')&&ctx.phase==='enemy'&&ctx.init!==y)df+=4;
  if(state.units.some(o=>o!==y&&o.team===y.team&&o.hp>0&&man(o,y)===1&&has(o,'guardian')))df+=2;const xm=CLS[x.cls].mnt||CLS[x.cls].fly,ym=CLS[y.cls].mnt||CLS[y.cls].fly;if(has(y,'pikewall')&&xm)df+=4;
  const dead=has(x,'deadeye');
  const acc=xw.hit+x.lck*2+(xw.brk&&yw&&yw.t===xw.brk?50:0)+(has(x,'earlyedge')&&state.turn<=5?20:0)+adv*15+aura(x)+(dead?20:0)+RB.acc+(has(x,'pikewall')&&ym?10:0);
  const avo=AS(y,yw)*2+y.lck+(yw&&yw.brk&&yw.brk===xw.t?50:0)+(has(y,'earlyedge')&&state.turn<=5?20:0)+(dead||yf?0:t.av)+aura(y)+RB.avo;
  let crit=RB.crit+(xw.crit||0)+(CLS[x.cls].crit||0)+Math.floor(x.lck/2)-Math.floor(y.lck/2);if(has(x,'focus')&&!state.units.some(o=>o!==x&&o.team===x.team&&o.hp>0&&man(o,x)===1))crit+=10;if(has(x,'fury')&&x.hp*2<=x.maxhp)crit+=15;
  return{dmg:Math.max(0,pow-df),pow,df,hit:clamp(acc-avo,0,100),crit:x.team==='e'?0:clamp(crit,0,100),n:AS(x,xw)+(has(x,'swift')&&ctx.init===x?3:0)-AS(y,yw)>=4?2:1,adv,eff};
}
function forecast(a,ai,d){
  const dist=man(a,d),aw=IT[a.items[ai].k],dl=d.stone?[]:wpnsAt(d,dist),di=dl.length?dl[0]:-1,dw=di>=0?IT[d.items[di].k]:null,ctx={init:a,phase};
  return{A:calc(a,aw,d,dw,ctx),D:dw?calc(d,dw,a,aw,ctx):null,ai,di,aw,dw,dist};
}
function resolve(a,ai,d){
  const f=forecast(a,ai,d),hp={a:a.hp,d:d.hp},mx={a:a.maxhp,d:d.maxhp},U={a:a.items[ai].u,d:f.di>=0?d.items[f.di].u:0},used={a:0,d:0},ev=[];
  const order=['a'];if(f.D)order.push('d');if(f.A.n>1)order.push('a');if(f.D&&f.D.n>1)order.push('d');
  if(f.D&&has(d,'quickdraw')&&d.hp*2<=d.maxhp){order.splice(order.indexOf('d'),1);order.unshift('d')}
  for(const sd of['a','d'])if((sd==='a'||f.D)&&has(sd==='a'?a:d,'flurry')&&rn()<(sd==='a'?a:d).spd){order.splice(order.indexOf(sd)+1,0,sd)}
  let whirled=false;
  for(const s of order){
    const o=s==='a'?'d':'a',X=s==='a'?a:d,Y=s==='a'?d:a,S=s==='a'?f.A:f.D;
    if(hp.a<=0||hp.d<=0)break;if(U[s]-used[s]<=0)continue;used[s]++;
    const e={by:s,hit:false,crit:false,dmg:0,proc:null,guard:null,heal:0};
    if((rn()+rn())/2<S.hit){
      e.hit=true;let dmg=S.dmg;
      if(has(X,'sunder')&&rn()<X.lck*1.5){e.proc=SKILLS.sunder.n;dmg=Math.max(0,S.pow-Math.floor(S.df/2))}
      if(!whirled&&has(X,'whirlwind')&&rn()<X.lck/2){whirled=true;e.proc=SKILLS.whirlwind.n;dmg=Math.floor(S.dmg/2)*5}
      if(rn()<S.crit){e.crit=true;dmg*=3}
      const XW0=s==='a'?f.aw:f.dw;
      if(has(Y,'shieldwall')&&dmg>0&&rn()<Y.lck*2){e.guard=SKILLS.shieldwall.n;dmg=Math.floor(dmg/2)}
      else if(has(Y,XW0&&XW0.mag?'spellward':'ironskin')&&dmg>0&&rn()<Y.lck*2){e.guard=SKILLS[XW0&&XW0.mag?'spellward':'ironskin'].n;dmg=Math.floor(dmg/2)}
      dmg=Math.min(dmg,hp[o]);hp[o]-=dmg;e.dmg=dmg;
      if(has(X,'stone')&&hp[o]>0&&rn()<X.lck){e.stone=true;e.proc=e.proc||SKILLS.stone.n}
      if((has(X,'spore')||has(X,'venom'))&&hp[o]>0&&dmg>0){e.psn=true;e.proc=e.proc||SKILLS[has(X,'spore')?'spore':'venom'].n}
      if(has(X,'siphon')&&dmg>0&&rn()<X.lck*2){e.proc=SKILLS.siphon.n;e.heal=Math.min(dmg,mx[s]-hp[s]);hp[s]+=e.heal}
      if(has(Y,'retaliate')&&f.dist===1&&dmg>0&&hp[o]>0&&rn()<Y.lck){const back=Math.min(dmg,hp[s]);hp[s]-=back;e.guard=SKILLS.retaliate.n}
      const XW=s==='a'?f.aw:f.dw;if(XW&&XW.drain&&dmg>0){const dh=Math.min(Math.ceil(dmg/3),mx[s]-hp[s]);if(dh>0){hp[s]+=dh;e.heal+=dh}}
    }
    e.hpA=hp.a;e.hpD=hp.d;e.broke=U[s]-used[s]<=0;ev.push(e);
  }
  return{f,ev,hpA:hp.a,hpD:hp.d,used};
}
/* EXP multiplier: at 1.5, a unit that fights in most battles reaches Lv 5 (and evolves) during Act 1 */
const EXP_RATE=1.2;
function expFor(p,o,dealt,killed){if(!dealt&&!killed)return 1;let x=Math.max(1,Math.floor((31+elv(o)-elv(p))/3));if(killed)x+=Math.max(0,(elv(o)-elv(p))*3+20+(o.boss?40:0));return Math.min(100,x)}
function gainExp(u,amt){
  if(u.summon)return null;
  if(u.lv>=20)return null;const from=u.exp;u.exp+=amt;let gains=null,old=null;
  if(u.exp>=100){u.exp-=100;old={lv:u.lv};ST.forEach(s=>old[s]=s==='hp'?u.maxhp:u[s]);u.lv++;gains={};
    shown(u).forEach(s=>gains[s]=1);
    for(const s in gains){if(s==='learned')continue;if(s==='hp'){u.maxhp++;u.hp++}else u[s]++}
    if(u.lv>=20)u.exp=0;
    if(u.team==='p'&&u.lv===PROMO_LV&&!CLS[u.cls].tier){const h=heroDef(u.id);if(h&&h.lv10&&!has(u,h.lv10)){(u.skills=u.skills||[]).push({id:h.lv10,src:'lv10'});gains.learned=h.lv10}}
  }
  return{from,amt,to:u.exp,gains,old};
}

