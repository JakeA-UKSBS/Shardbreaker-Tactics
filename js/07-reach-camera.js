/* Movement reach, heal/gift/talk targets, and the pan/zoom camera */
/* ================= MAP LOGIC ================= */
/* ankle-deep water: a unit that starts its turn in it has 1 less Move (fliers, ghosts and swamp creatures ignore it) */
function slowOf(u){const C=CLS[u.cls];return ter(u.x,u.y).slow&&!C.fly&&!C.wade&&!C.phase?1:0}
function reach(u){
  const dist={[key(u.x,u.y)]:0},q=[[u.x,u.y]];
  while(q.length){
    q.sort((a,b)=>dist[key(...a)]-dist[key(...b)]);const[x,y]=q.shift(),d=dist[key(x,y)];
    for(const[dx,dy]of DIRS){const nx=x+dx,ny=y+dy,sz=u.sz||1;if(nx<0||ny<0||nx+sz>MW||ny+sz>MH)continue;
      const cs=cellsOf(nx,ny,sz),nd=d+Math.max(...cs.map(([cx,cy])=>mcost(u,cx,cy)));if(nd>u.mov+relicMov(u)+gearOf(u).mov+(has(u,'fleetfoot')?2:0)-slowOf(u))continue;if(cs.some(([cx,cy])=>{const o=unitAt(cx,cy);return o&&o!==u&&hostile(o,u)}))continue;
      const k=key(nx,ny);if(dist[k]===undefined||nd<dist[k]){dist[k]=nd;q.push([nx,ny])}}
  }
  const s=new Set();for(const k in dist){const[x,y]=k.split(',').map(Number);if(cellsOf(x,y,u.sz).every(([cx,cy])=>{const o=unitAt(cx,cy);return!o||o===u}))s.add(k)}return s;
}
function fringeOf(u,ms){
  const f=new Set(),r0=minRange(u),r1=maxRange(u);if(!r1)return f;
  const sz=u.sz||1;for(const k of ms){const[x,y]=k.split(',').map(Number);for(let dy=-r1;dy<=r1+sz-1;dy++)for(let dx=-r1;dx<=r1+sz-1;dx++){const nx=x+dx,ny=y+dy,d=man({x,y,sz},{x:nx,y:ny});if(d<r0||d>r1||nx<0||ny<0||nx>=MW||ny>=MH)continue;const kk=key(nx,ny);if(!ms.has(kk))f.add(kk)}}
  return f;
}
const atkTargets=u=>state.units.filter(o=>o.hp>0&&hostile(o,u)&&wpnsAt(u,man(u,o)).length);
function spiritFor(u,o){const d=man(u,o);return u.items.findIndex(it=>IT[it.k].t==='spirit'&&canUse(u,it.k)&&it.u>0&&d>=IT[it.k].r[0]&&d<=IT[it.k].r[1])}
function healTargets(u){if(staffIdx(u)<0)return[];return state.units.filter(o=>o.hp>0&&o.team===u.team&&o!==u&&o.hp<o.maxhp&&spiritFor(u,o)>=0)}
function giftHere(u){const k=key(u.x,u.y),c=MAP[u.y][u.x];if(u.team!=='p'||(c!=='V'&&c!=='C')||state.visited.includes(k)||!CH[state.ch].gifts[k])return null;return{k,kind:c==='V'?'Visit':'Open',item:CH[state.ch].gifts[k]}}
function talkTarget(u){if(!u.lord)return null;return state.units.find(o=>o.recruit&&o.team!=='p'&&o.hp>0&&man(o,u)===1)||null}

/* ================= CAMERA ================= */
let cam={x:0,y:0,s:1};
function vb(){const r=vp.getBoundingClientRect();return{w:r.width,h:r.height,l:r.left,t:r.top,bw:MW*T,bh:MH*T}}
function fitS(){const b=vb();return Math.min(b.w/b.bw,b.h/b.bh)}
function minS(){return Math.min(fitS(),1)}
function clampCam(){const b=vb();cam.s=clamp(cam.s,minS(),2.2);const sw=b.bw*cam.s,sh=b.bh*cam.s;cam.x=sw<=b.w?(b.w-sw)/2:clamp(cam.x,b.w-sw,0);cam.y=sh<=b.h?(b.h-sh)/2:clamp(cam.y,b.h-sh,0)}
function applyCam(anim){clampCam();boardEl.style.transition=anim?'transform .35s ease':'none';boardEl.style.transform=`translate(${cam.x}px,${cam.y}px) scale(${cam.s})`}
function centerOn(x,y,anim){const b=vb();cam.x=b.w/2-(x+.5)*T*cam.s;cam.y=b.h/2-(y+.5)*T*cam.s;applyCam(anim)}
function ensureVisible(x,y){const b=vb(),m=T*cam.s*1.2,px=cam.x+(x+.5)*T*cam.s,py=cam.y+(y+.5)*T*cam.s;if(px<m||px>b.w-m||py<m||py>b.h-m){centerOn(x,y,true);return true}return false}
function initCam(){const f=fitS();cam.s=f>=.75?f:1;const a=state.units.find(u=>u.lord)||state.units[0];centerOn(a.x,a.y,false)}
const ptrs=new Map();let gest=null;
vp.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  try{vp.setPointerCapture(e.pointerId)}catch(_){}
  ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1)gest={t:'tap',sx:e.clientX,sy:e.clientY,cx:cam.x,cy:cam.y};
  else if(ptrs.size===2){const[p,q]=[...ptrs.values()];gest={t:'pinch',d0:Math.hypot(p.x-q.x,p.y-q.y)||1,s0:cam.s,cx:cam.x,cy:cam.y,mx:(p.x+q.x)/2,my:(p.y+q.y)/2}}
});
vp.addEventListener('pointermove',e=>{
  if(!ptrs.has(e.pointerId)||!gest)return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(gest.t==='tap'&&Math.hypot(e.clientX-gest.sx,e.clientY-gest.sy)>9)gest.t='pan';
  if(gest.t==='pan'){cam.x=gest.cx+e.clientX-gest.sx;cam.y=gest.cy+e.clientY-gest.sy;applyCam()}
  else if(gest.t==='pinch'&&ptrs.size===2){const b=vb(),[p,q]=[...ptrs.values()],d=Math.hypot(p.x-q.x,p.y-q.y),mx=(p.x+q.x)/2-b.l,my=(p.y+q.y)/2-b.t,wx=(gest.mx-b.l-gest.cx)/gest.s0,wy=(gest.my-b.t-gest.cy)/gest.s0;cam.s=clamp(gest.s0*d/gest.d0,minS(),2.2);cam.x=mx-wx*cam.s;cam.y=my-wy*cam.s;applyCam()}
});
function ptrUp(e){
  if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
  if(gest&&gest.t==='tap'&&ptrs.size===0&&e.type==='pointerup'){const b=vb(),x=Math.floor((e.clientX-b.l-cam.x)/cam.s/T),y=Math.floor((e.clientY-b.t-cam.y)/cam.s/T);if(x>=0&&y>=0&&x<MW&&y<MH)tap(x,y)}
  if(ptrs.size===0)gest=null;else if(gest&&gest.t==='pinch'){const p=[...ptrs.values()][0];gest={t:'pan',sx:p.x,sy:p.y,cx:cam.x,cy:cam.y}}
}
vp.addEventListener('pointerup',ptrUp);vp.addEventListener('pointercancel',ptrUp);
vp.addEventListener('wheel',e=>{e.preventDefault();const b=vb(),mx=e.clientX-b.l,my=e.clientY-b.t,wx=(mx-cam.x)/cam.s,wy=(my-cam.y)/cam.s;cam.s=clamp(cam.s*(e.deltaY<0?1.12:.89),minS(),2.2);cam.x=mx-wx*cam.s;cam.y=my-wy*cam.s;applyCam()},{passive:false});
addEventListener('resize',()=>applyCam());
/* keyboard and mouse: Esc backs out; right-click backs out mid-action (after moving: undo the move), and inspects a unit when nothing is selected; E ends the turn */
function backOut(){if(busy||!modalEl.hidden||phase!=='player'||over)return;const sh=document.querySelector('.sheet');if(sh&&!sh.hidden)return;
  if(ui==='move'||ui==='menu')act('cancel');else if(ui==='confirm')act('back');else if(ui==='target')act('menu');else if(ui==='items')act('menu');else{clearSel();ui='idle';render()}}
document.addEventListener('keydown',e=>{if(e.key==='Escape')backOut();else if((e.key==='e'||e.key==='E')&&modalEl.hidden&&!busy)$('#btnEnd').click()});
vp.addEventListener('contextmenu',e=>{e.preventDefault();const b=vb(),x=Math.floor((e.clientX-b.l-cam.x)/cam.s/T),y=Math.floor((e.clientY-b.t-cam.y)/cam.s/T),o=x>=0&&y>=0&&x<MW&&y<MH&&unitAt(x,y);
  if(ui==='idle'&&o&&o.hp>0&&modalEl.hidden&&!busy)openSheet(o);else backOut()});

