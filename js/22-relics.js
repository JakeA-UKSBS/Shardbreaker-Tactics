/* Relics and their combat hooks */
/* ---- relics: team passives for the rest of the run. r = rarity (c common, u uncommon, r rare); x = needs Old Relics ---- */
const RELICS={
  banner:{n:'Unbroken Banner',r:'c',d:'Units at full HP deal +2 damage.'},
  whetstone:{n:'Whetstone',r:'c',d:'All units gain +10 Hit.'},
  boots:{n:'Swift Boots',r:'c',d:'All units gain +1 Move.'},
  salvebag:{n:'Herbalist’s Bag',r:'c',d:'Units heal 3 HP at the start of each of your turns.'},
  shield:{n:'Tower Shield',r:'c',d:'Units next to an ally gain +2 Def and Res.'},
  tome:{n:'Old Tome',r:'u',d:'Units gain 50% more EXP.'},
  coin:{n:'Lucky Coin',r:'u',d:'All units gain +10 Crit.'},
  fang:{n:'Vampire Fang',r:'u',d:'Units heal 5 HP when they defeat an enemy.'},
  horn:{n:'War Horn',r:'u',d:'On turn 1 of each battle, units deal +3 damage.'},
  phoenix:{n:'Phoenix Feather',r:'r',d:'Once per run, the first unit to fall survives with 1 HP.'},
  crown:{n:'Slayer’s Crown',r:'r',d:'Units deal +4 damage to bosses and elite leaders.'},
  lantern:{n:'Pathfinder’s Lantern',r:'r',d:'Recruit nodes offer 4 units, 1 level higher.'},
  quiver:{n:'Endless Quiver',r:'u',x:2,d:'Bows deal +3 damage.'},
  focusgem:{n:'Focus Gem',r:'u',x:2,d:'Arts deal +2 damage and gain +10 Hit.'},
  spurs:{n:'Golden Spurs',r:'u',x:4,d:'Mounted and flying units gain +1 Move and +10 Avoid.'},
  bulwark:{n:'Iron Bulwark',r:'u',x:4,d:'Armoured units take 2 less damage.'},
  anvil:{n:'Pocket Anvil',r:'r',x:6,d:'The Wandering Smith reforges twice.'},
  hawk:{n:'Falconer’s Whistle',r:'u',d:'A hawk fights beside you in every battle. If it falls, it’s back for the next one.'},
  mirror:{n:'Mirror Charm',r:'r',x:6,d:'Enemies get −10 Hit against your units.'},
  ironrose:{n:'Iron Rose',r:'u',d:'Units below half HP take 3 less damage.'},
  aventurine:{n:'Aventurine',r:'c',d:'All units gain +10 Avoid and +5 Crit.'},
  trophies:{n:'Hunter’s Trophies',r:'u',d:'Effective hits deal 2 more damage.'},
  plenty:{n:'Horn of Plenty',r:'u',d:'+15 gold after every won fight, and tavern meals last 1 fight longer.'},
  /* starter relics: Ithren offers 3 of the r:'s' ones before you pick a squad; r:'h' ones join the Heirloom pick (unlocked by Field Hospital). Neither drops anywhere else */
  poultice:{n:'Herbal Poultice',r:'s',d:'Salves heal 2 more HP.'},
  satchel:{n:'Sage’s Satchel',r:'h',d:'Everyone in your starting squad carries an extra Salve.'},
  waybread:{n:'Waybread',r:'h',d:'Units recover 3 more HP after each fight.'},
  purse:{n:'Coin Purse',r:'s',d:'Start the run with 30 more gold.'},
  ward:{n:'Ithren’s Ward',r:'s',d:'All your units get +1 Res.'},
  sprig:{n:'Sprig of Renewal',r:'s',d:'Every unit heals 1 HP at the start of each player phase.'}
};
const RC={c:'#9fd8ff',u:'#c58aff',r:'#ffd23f',s:'#9fe8a0',h:'#e8b87a'},RN={c:'Common',u:'Uncommon',r:'Rare',s:'Starter',h:'Heirloom'};
const salveAmt=k=>IT[k].amt+(R('poultice')?2:0);
const R=id=>!!(run&&run.relics&&run.relics.includes(id));
function relicArt(k){const c='R|'+k;if(sprCache[c])return sprCache[c];const p=Px(16,16),col=RC[RELICS[k].r];
  p.line(4,1,8,6,GOLD);p.line(12,1,8,6,GOLD);p.poly([[8,5],[13,9],[8,15],[3,9]],col);p.poly([[8,5],[13,9],[8,9]],shade(col,1.25));p.set(7,8,'#ffffff');p.outline(OUT);return sprCache[c]=p.url()}
function relicPool(rs){return Object.keys(RELICS).filter(k=>!R(k)&&rs.includes(RELICS[k].r)&&relicOpen(k))}
async function relicPick(n,rs,title,text,first){
  /* first: relics that are always offered (the Heirloom pick always has one heirloom relic) */
  const opts=[...(first||[]).filter(Boolean),...shuffle(relicPool(rs))].slice(0,n);if(!opts.length)return null;
  const m=await modal(`<div class="eyebrow">Relic</div><h2>${title}</h2>${text?`<p>${text}</p>`:''}<div class="inv big">${opts.map((k,i)=>`<button type="button" class="it" data-m="r${i}"><img src="${relicArt(k)}" alt=""><span><b>${RELICS[k].n}</b> · ${RELICS[k].d}</span><em>${RN[RELICS[k].r]}</em></button>`).join('')}</div>`);
  const k=opts[+m.slice(1)];(run.relics=run.relics||[]).push(k);sfx('fanfare');toast(`${RELICS[k].n} obtained`);return k;
}
/* combat hooks, called from calc(): only your units benefit */
function relicCalc(x,xw,y){
  const o={pow:0,df:0,acc:0,avo:0,crit:0};if(!run)return o;
  /* early ease: in Act 1, enemies deal 2 less damage on floors 1-3 and 1 less on 4-6 */
  if(x.team==='e'&&!A(3)&&(run.act||1)===1&&flScale(run.n)<7)o.pow-=2-Math.floor((flScale(run.n)-1)/3);
  /* Ithren's Ward: +1 Res, which only matters against magic, so it's added to the defence there */
  if(y.team==='p'&&xw.mag&&R('ward'))o.df+=1;
  if(x.team==='p'){if(M('boar'))o.pow+=2;if(M('bread'))o.acc+=15}if(y.team==='p'&&M('pie'))o.df+=2;
  if(!run.relics)return o;
  if(x.team==='p'){
    if(R('banner')&&x.hp===x.maxhp)o.pow+=2;
    if(R('horn')&&state.turn===1)o.pow+=3;
    if(R('crown')&&y.boss)o.pow+=4;
    if(R('quiver')&&xw.t==='bow')o.pow+=3;
    if(R('focusgem')&&xw.t==='art'){o.pow+=2;o.acc+=10}
    if(R('whetstone'))o.acc+=10;
    if(R('coin'))o.crit+=10;
    if(R('aventurine'))o.crit+=5;
  }else if(R('mirror'))o.acc-=10;
  if(y.team==='p'){
    if(R('shield')&&state.units.some(a=>a!==y&&a.team==='p'&&a.hp>0&&man(a,y)===1))o.df+=2;
    if(R('bulwark')&&CLS[y.cls].body==='armor')o.df+=2;
    if(R('spurs')&&CLS[y.cls].mnt)o.avo+=10;
    if(R('aventurine'))o.avo+=10;
    if(R('ironrose')&&y.hp<y.maxhp/2)o.df+=3;
  }
  return o;
}
const relicMov=u=>u.team!=='p'?0:(R('boots')?1:0)+(R('spurs')&&CLS[u.cls].mnt?1:0)+(M('stew')?1:0)-(Wo('weary')?1:0);

