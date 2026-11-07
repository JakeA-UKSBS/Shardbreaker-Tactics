/* Combat maths: weapons in range, calc(), forecasts, movement costs and reach */
/* ================= RULES ================= */
const isWpn=k=>WTYPES.includes(IT[k].t);
/* weapons never wear out, except the few big ones with a handful of uses (Meteor, Heaven’s Bolt) */
/* endless: never loses uses. Every weapon with more than 5 uses, and all healing staves; only Heaven's Bolt and Meteor Sigil (5) run out */
const endless=k=>(isWpn(k)&&IT[k].uses>5)||IT[k].t==='spirit';
/* Fliers cross sky and rough ground at cost 1, but not walls, masts or crags. */
function mcost(u,x,y){const t=ter(x,y);if(CLS[u.cls].phase)return 1;if(t.k==='lava'&&CLS[u.cls].lava)return 1;if(CLS[u.cls].fly)return['wall','cliff','cavewall'].includes(t.k)?99:1;if(CLS[u.cls].mnt&&(t.k==='forest'||t.k==='hill'))return t.c+1;return t.c}
/* Teams: p = player, e = enemy, g = green 'other' units that fight the enemy and can be recruited. */
const hostile=(a,b)=>(a.team==='e')!==(b.team==='e');
/* Skills: u.skill is the personal skill (takes PERSONAL_CAP). u.skills holds extras: {id,src:"scroll"} (costs capacity). */
const has=(u,id)=>u.skill===id||!!(u.skills&&u.skills.some(x=>x.id===id));
/* skill capacity used: the personal skill always takes PERSONAL_CAP, scroll-learned skills take their cost */
const PERSONAL_CAP=5;
const capUsed=u=>(u.skill&&u.team!=='e'?PERSONAL_CAP:0)+(u.skills||[]).reduce((a,x)=>a+(x.src==='scroll'?SKILLS[x.id].cost:0),0);
const capOf=u=>u.cap||BASE_CAP;
function learnBlock(u,k){if(has(u,k))return`${u.name} already knows ${SKILLS[k].n}.`;const c=SKILLS[k].cost;if(capUsed(u)+c>capOf(u))return`Needs ${c} capacity; ${u.name} has ${capOf(u)-capUsed(u)} free.`;return null}
const elv=u=>u.lv+(CLS[u.cls].tier===2?15:0);
/* a few characters wield only certain kinds within their class's weapon types (Zwei: two-handed swords) */
const ONLY_KIND={zwei:['greatsword']};
/* lightning is Corvin's element: only Corvin can wield lightning sigils */
const canUse=(u,k)=>CLS[u.cls].w.includes(IT[k].t)&&(IT[k].el!=='lightning'||u.cast==='corvin')&&(!u.cast||!ONLY_KIND[u.cast]||!WTYPES.includes(IT[k].t)||ONLY_KIND[u.cast].includes(IT[k].kind));
/* ---- height (Ogre/FFTA style) ----
   Each tile has a height level (hOf). A unit can only step up or down JUMP levels at a time (fliers ignore it).
   Attacking from above: +10 Hit and +1 damage per level (max 3); from below: -10 Hit per level.
   Bows reach 1 tile further for every 2 levels of height over the target (max +2). */
const JUMP=2,jumpOf=u=>(CLS[u.cls].jump??JUMP)-(has(u,'plate')?1:0);
function canStep(u,fx,fy,tx,ty){const C=CLS[u.cls];if(C.fly||C.phase||(u.sz||1)>1)return true;return Math.abs(hOf(tx,ty)-hOf(fx,fy))<=jumpOf(u)}
const hDiff=(a,b)=>clamp(hOf(a.x,a.y)-hOf(b.x,b.y),-3,3);
/* the range shown on cards and sheets: the weapon's, plus Eagle Eye (height bonus only applies per target) */
const rngShow=(u,w)=>[w.r[0],w.r[1]+(typeof eagle==='function'?eagle(u,w):0)];
function rngBonus(w,a,b){return a&&b&&w.t==='bow'?clamp(Math.floor((hOf(a.x,a.y)-hOf(b.x,b.y))/2),0,2):0}
/* o (the target) is optional: without it, height can't add bow range */
function wpnsAt(u,dist,o){const out=[];u.items.forEach((it,i)=>{const w=IT[it.k];if(isWpn(it.k)&&canUse(u,it.k)&&it.u>0&&dist>=w.r[0]&&dist<=w.r[1]+rngBonus(w,u,o)+eagle(u,w))out.push(i)});return out}
function staffIdx(u){return u.items.findIndex(it=>IT[it.k].t==='spirit'&&canUse(u,it.k)&&it.u>0)}
function eqIdx(u){return u.items.findIndex(it=>isWpn(it.k)&&canUse(u,it.k))}
function maxRange(u){let m=0;u.items.forEach(it=>{if((isWpn(it.k)||IT[it.k].t==='spirit')&&canUse(u,it.k))m=Math.max(m,IT[it.k].r[1]+(IT[it.k].t==='bow'?2:0)+eagle(u,IT[it.k]))});return m}
function minRange(u){let m=9;u.items.forEach(it=>{if((isWpn(it.k)||IT[it.k].t==='spirit')&&canUse(u,it.k))m=Math.min(m,IT[it.k].r[0])});return m===9?1:m}
function aura(u){if(u.team!=='p')return 0;const l=state.units.find(o=>has(o,'command')&&o.hp>0&&o.team===u.team&&o.id!==u.id);return l&&man(l,u)<=2?10:0}

/* ---- body tags and effective damage ----
   Monsters carry body tags; some weapons (and the slayer skills) are effective against a tag: ×2 weapon Mt (bows vs fliers too).
   One-way for now: only your side (and green allies) deal effective hits; your own units have no tags. */
const TAGS={flier:{n:'Flier'},armoured:{n:'Armoured'},beast:{n:'Beast'},colossal:{n:'Colossal'},spectral:{n:'Spectral'},plant:{n:'Plant'}};
const BODY_TAGS={golem:['armoured'],snail:['armoured'],turtle:['armoured'],cubes:['armoured'],armor:['armoured'],beast:['beast'],gator:['beast'],bear:['beast'],worm:['beast'],
  hawk:['beast'],dragon:['beast'],sentinel:['armoured'],flame:['spectral'],frost:['spectral'],storm:['spectral']};
const TAG_FIX={BlightedTreant:['plant'],StoneWarden:['armoured']};
function tagsOf(u){if(!u||!u.cls||u.cls.startsWith('G.'))return[];const C=CLS[u.cls]||{};let t=(TAG_FIX[u.cls]||BODY_TAGS[C.body]||[]).slice();if(C.fly)t.unshift('flier');if((u.sz||1)>1)t.push('colossal');return[...new Set(t)]}
/* what a weapon is effective against: its own list, plus bows vs fliers, light sigils vs spectres, fire sigils vs plants */
function effOf(w){const o=(w&&w.eff||[]).slice();if(w&&w.t==='bow')o.push('flier');if(w&&w.el==='light')o.push('spectral');if(w&&w.el==='fire')o.push('plant');return o}
/* Paladins are holy warriors: everything they swing is effective against spectres */
const SLAYER={wolfsbane:'beast',stonebane:'armoured',spiritbane:'spectral'};
function effHit(x,xw,y){if(x.team==='e')return 0;const tg=tagsOf(y);if(!tg.length)return 0;const e=effOf(xw);for(const k in SLAYER)if(has(x,k))e.push(SLAYER[k]);
  if(CLS[x.cls]&&/Paladin/.test(CLS[x.cls].n))e.push('spectral');
  const hit=tg.filter(t=>e.includes(t));if(!hit.length)return 0;return 2}
function calc(x,xw,y,yw,ctx){
  const t=ter(y.x,y.y),RB=relicCalc(x,xw,y),SB=stCalc(x,xw,y),gx=gearOf(x),gy=gearOf(y);
  const eff=effHit(x,xw,y)||(xw.t==='bow'&&CLS[y.cls].fly?2:0);const hd=hDiff(x,y);let pow=Math.max(0,hd)+(xw.mag?x.mag:x.str)+xw.mt*(eff||1)+(eff&&R('trophies')?2:0)+RB.pow+SB.pow+(xw.mag?0:gx.str);if(has(x,'kindle')&&ctx.init===x)pow+=2;
  const yf=!!CLS[y.cls].fly;let df=(xw.mag?y.res+gy.res:y.def+gy.def)+(yf?0:t.df)+RB.df+SB.df;if(has(y,'steadfast')&&ctx.phase==='enemy'&&ctx.init!==y)df+=4;
  if(state.units.some(o=>o!==y&&o.team===y.team&&o.hp>0&&man(o,y)===1&&has(o,'guardian')))df+=2;const xm=CLS[x.cls].mnt||CLS[x.cls].fly,ym=CLS[y.cls].mnt||CLS[y.cls].fly;if(has(y,'pikeWall')&&xm)df+=4;
  const dead=has(x,'keenEye');
  const acc=hd*10+xw.hit+x.lck*2+(has(x,'earlyEdge')&&state.turn<=5?20:0)+aura(x)+(dead?20:0)+RB.acc+SB.acc+(has(x,'pikeWall')&&ym?10:0);
  const avo=AS(y,yw)*2+y.lck+(has(y,'earlyEdge')&&state.turn<=5?20:0)+(dead||yf?0:t.av)+aura(y)+RB.avo+SB.avo;
  let crit=RB.crit+SB.crit+(xw.crit||0)+(CLS[x.cls].crit||0)+Math.floor(x.lck/2)-Math.floor(y.lck/2);if(has(x,'focus')&&!state.units.some(o=>o!==x&&o.team===x.team&&o.hp>0&&man(o,x)===1))crit+=10;if(has(x,'wrath')&&x.hp*2<=x.maxhp)crit+=15;
  return{dmg:dmgMods(x,y,ctx,Math.max(0,pow-df)),pow,df,hit:clamp(acc-avo,0,100),crit:x.team==='e'?0:clamp(crit,0,100),n:AS(x,xw)+(has(x,'swiftstrike')&&ctx.init===x?3:0)-AS(y,yw)>=4?2:1,eff,hd};
}
/* forecast: the numbers for the combat preview, before anything is rolled.
   a attacks d with a's item at index ai. The defender counters with the first weapon that reaches
   this distance (none if it's turned to stone). A and D are calc() results for each side:
   hit, dmg, crit, n (strikes per round, 2 if fast enough to double), pow and df. */
function forecast(a,ai,d){
  const dist=man(a,d),aw=IT[a.items[ai].k],dl=d.stone?[]:wpnsAt(d,dist,a),di=dl.length?dl[0]:-1,dw=di>=0?IT[d.items[di].k]:null,ctx={init:a,phase};
  return{A:calc(a,aw,d,dw,ctx),D:dw?calc(d,dw,a,aw,ctx):null,ai,di,aw,dw,dist};
}
/* resolve: plays one exchange out strike by strike and returns the events for the battle scene to animate.
   hp, mx, U (weapon uses) and used are tracked per side ('a' attacker, 'd' defender). */
function resolve(a,ai,d){
  const f=forecast(a,ai,d),hp={a:a.hp,d:d.hp},mx={a:a.maxhp,d:d.maxhp},U={a:a.items[ai].u,d:f.di>=0?d.items[f.di].u:0},used={a:0,d:0},ev=[];
  /* strike order, FE-style: attacker, defender's counter, then each side's follow-up if it doubles */
  const order=['a'];if(f.D)order.push('d');if(f.A.n>1)order.push('a');if(f.D&&f.D.n>1)order.push('d');
  /* Quick Draw: a defender at half HP or less strikes first */
  if(f.D&&has(d,'quickDraw')&&d.hp*2<=d.maxhp){order.splice(order.indexOf('d'),1);order.unshift('d')}
  /* Flurry: Spd% chance of one extra strike, straight after that side's first */
  for(const sd of['a','d'])if((sd==='a'||f.D)&&has(sd==='a'?a:d,'flurry')&&rn()<(sd==='a'?a:d).spd){order.splice(order.indexOf(sd)+1,0,sd)}
  let whirled=false;/* Whirlwind can only fire once per exchange */
  for(const s of order){
    const o=s==='a'?'d':'a',X=s==='a'?a:d,Y=s==='a'?d:a,S=s==='a'?f.A:f.D;
    /* stop once someone falls; skip a side whose weapon has shattered (only the 5-use sigils can) */
    if(hp.a<=0||hp.d<=0)break;if(U[s]-used[s]<=0)continue;used[s]++;
    const e={by:s,hit:false,crit:false,dmg:0,proc:null,guard:null,heal:0};
    /* hit roll: the average of two rolls, as in the GBA games (high hit rates land more often than shown, low ones less) */
    if((rn()+rn())/2<S.hit){
      e.hit=true;let dmg=S.dmg;
      /* attacker skills: Whirlwind (Luck÷2%) turns this strike into five half-damage hits; then the crit roll (×3) */
      if(!whirled&&has(X,'whirlwind')&&rn()<X.lck/2){whirled=true;e.proc=SKILLS.whirlwind.n;dmg=Math.floor(S.dmg/2)*5}
      if(rn()<S.crit){e.crit=true;dmg*=3}
      const XW0=s==='a'?f.aw:f.dw;
      /* defender skills, Luck×2%, halve the damage: Bulwark against anything, else Spell Ward against magic or Iron Skin against physical */
      if(has(Y,'bulwark')&&dmg>0&&rn()<Y.lck*2){e.guard=SKILLS.bulwark.n;dmg=Math.floor(dmg/2)}
      else if(has(Y,XW0&&XW0.mag?'spellWard':'ironSkin')&&dmg>0&&rn()<Y.lck*2){e.guard=SKILLS[XW0&&XW0.mag?'spellWard':'ironSkin'].n;dmg=Math.floor(dmg/2)}
      /* damage can't go below 0 HP */
      dmg=Math.min(dmg,hp[o]);hp[o]-=dmg;e.dmg=dmg;
      /* on-hit effects. Stone Gaze (Luck%): target is turned to stone (Lamia). Venom: target is poisoned */
      if(has(X,'stoneGaze')&&hp[o]>0&&rn()<X.lck){e.stone=true;e.proc=e.proc||SKILLS.stoneGaze.n}
      if(has(X,'venom')&&hp[o]>0&&dmg>0){e.psn=true;e.proc=e.proc||SKILLS.venom.n}
      /* Retaliate (Luck%): a melee hit is dealt straight back to the striker */
      if(has(Y,'retaliate')&&f.dist===1&&dmg>0&&hp[o]>0&&rn()<Y.lck){const back=Math.min(dmg,hp[s]);hp[s]-=back;e.guard=SKILLS.retaliate.n}
      /* drain weapons (dark magic): heal a third of the damage dealt */
      const XW=s==='a'?f.aw:f.dw;if(XW&&XW.drain&&dmg>0){const dh=Math.min(Math.ceil(dmg/3),mx[s]-hp[s]);if(dh>0){hp[s]+=dh;e.heal+=dh}}
    }
    /* HP after this strike, and whether the weapon just shattered, for the animation */
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
  }
  return{from,amt,to:u.exp,gains,old};
}

