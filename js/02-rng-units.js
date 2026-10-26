/* Seeded random numbers and the basic unit constructors */
/* ================= STATE ================= */
let state,history=[],rewinds=3,chStart=null,MAP=[],MW=8,MH=11;
let ui='idle',sel=null,pre=null,origin=null,moveSet=null,fringe=null,targets=[],tmode='atk',pending=null,pendW=0,phase='player',busy=false,over=null,inspect=null,danger=false,details=false,itemSel=null,terInfo='';
let settings={anim:true,sound:true,tips:false,seen:[],lord:'m',rewind:false,dev:false,theme:'tavern'};
/* colour schemes: tavern (warm wood and gold, like the story scenes) or jade (Obsidian & Jade) */
const THEMES={tavern:'Tavern',jade:'Obsidian & Jade'};
function applyTheme(){const t=THEMES[settings.theme]?settings.theme:'tavern';for(const k in THEMES)document.documentElement.classList.toggle('th-'+k,k===t)}
let threatTile=null;
let foeSeq=0;
const $=s=>document.querySelector(s);
const vp=$('#vp'),boardEl=$('#board'),panel=$('#panel'),modalEl=$('#modal');
const key=(x,y)=>x+','+y;
const clone=o=>JSON.parse(JSON.stringify(o));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* bosses fill 2×2 (u.sz=2, x/y = top-left); distance is between footprints */
const man=(a,b)=>{const as=a.sz||1,bs=b.sz||1;return Math.max(0,a.x-(b.x+bs-1),b.x-(a.x+as-1))+Math.max(0,a.y-(b.y+bs-1),b.y-(a.y+as-1))};
const cellsOf=(x,y,s)=>{const o=[];for(let j=0;j<(s||1);j++)for(let i=0;i<(s||1);i++)o.push([x+i,y+j]);return o};
/* Seeded RNG (mulberry32): every roll in a run comes from the run's seed, so a run can be replayed. */
let rngS=1;
function seedRng(v){rngS=(v>>>0)||1}
function rand(){rngS=(rngS+0x6D2B79F5)>>>0;let t=rngS;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
const rn=()=>rand()*100;
const ri=(a,b)=>a+Math.floor(rand()*(b-a+1));
const pick=a=>a[Math.floor(rand()*a.length)];
const unitAt=(x,y)=>state.units.find(u=>u.hp>0&&x>=u.x&&y>=u.y&&x<u.x+(u.sz||1)&&y<u.y+(u.sz||1));
const byId=id=>state.units.find(u=>u.id===id);
const ter=(x,y)=>TER[MAP[y][x]];

function mkHero(h){const u={id:h.id,name:h.name,cls:h.cls,team:'p',lv:h.lv,exp:0,skill:h.skill,skills:[],cap:BASE_CAP,look:h.look,pic:h.pic,g:h.g,lord:!!h.lord,mov:CLS[h.cls].mov,items:h.items.map(k=>({k,u:IT[k].uses})),acted:false,x:0,y:0};ST.forEach((s,i)=>u[s]=h.s[i]);u.maxhp=u.hp;return u}
function foe(cls,lv,x,y,o={}){
  const t=FOE[cls],u={id:'f'+(foeSeq++),name:o.name||CLS[cls].n,cls,team:'e',lv,exp:0,x,y,acted:false,hold:!!o.hold,mov:CLS[cls].mov,skill:o.skill||null,pic:t.pic};
  ST.forEach((s,i)=>u[s]=t.b[i]+Math.floor(t.g[i]*(lv-1)));u.maxhp=u.hp;
  u.items=(o.items||t.items).map(k=>({k,u:IT[k].uses}));if(o.carry)u.items.push({k:o.carry,u:IT[o.carry].uses,d:true});
  u.look=Object.assign({hair:HAIRS[foeSeq%HAIRS.length]},t.look);return foldLuck(u);
}
function boss(b){return foldLuck(boss0(b))}
function boss0(b){const u={id:b.id,name:b.name,cls:b.cls,team:'e',lv:b.lv,exp:0,x:b.x,y:b.y,acted:false,boss:true,mov:b.mov||0,skill:b.skill,look:b.look,pic:b.pic};ST.forEach((s,i)=>u[s]=b.s[i]);u.maxhp=u.hp;u.items=b.items.map(k=>({k,u:IT[k].uses}));if(b.carry)u.items.push({k:b.carry,u:IT[b.carry].uses,d:true});return u}
function recruitFoe(id,x,y){const u=mkHero(heroDef(id));return Object.assign(u,{team:'e',x,y,recruit:true,hold:true})}
function recruitGreen(id,x,y){return Object.assign(recruitFoe(id,x,y),{team:'g'})}

