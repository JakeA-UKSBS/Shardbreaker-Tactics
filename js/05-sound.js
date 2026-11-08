/* Sound effects */
/* ================= SOUND ================= */
const AU={ctx:null,nb:null};
/* master volume for every sound effect (music has its own, in music()) */
const SFX_VOL=.7;
function audio(){
  if(!settings.sound)return null;
  if(!AU.ctx){try{AU.ctx=new(window.AudioContext||window.webkitAudioContext)();AU.out=AU.ctx.createGain();AU.out.gain.value=SFX_VOL;AU.out.connect(AU.ctx.destination);const n=AU.ctx.sampleRate,b=AU.ctx.createBuffer(1,n,n),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;AU.nb=b}catch(_){return null}}
  if(!AU.buf){AU.buf={};for(const n in SFX_FILE)fetch(SFX_FILE[n][0]).then(r=>r.arrayBuffer()).then(b=>AU.ctx.decodeAudioData(b)).then(d=>{AU.buf[n]=d}).catch(()=>{})}/* recorded sounds load once; until then (or offline) the synth versions play */
  if(AU.ctx.state==='suspended')AU.ctx.resume();return AU.ctx;
}
/* recorded sounds (sfx/, Helton Yan's Pixel Combat pack): name -> [file, volume]. These replace the synth sound of the same name once loaded */
const SFX_FILE={sandswipe:['sfx/sand-swipe.mp3',.8],levelup:['sfx/aura-up.mp3',.5],step:['sfx/boots-grass.mp3',.45],swordcrit:['sfx/sword-crit.mp3',.8],jump:['sfx/retro-jump.mp3',.5],
  /* RPG Essentials Free pack: element attacks and poisoning */
  fire:['sfx/fire-explosion.mp3',.6],water:['sfx/water.mp3',.6],thunder:['sfx/thunder.mp3',.6],wind:['sfx/wind.mp3',.6],ice:['sfx/ice-explosion.mp3',.6],poison:['sfx/poison.mp3',.6],
  heal:['sfx/heal.mp3',.5],debuff:['sfx/debuff.mp3',.55],claw:['sfx/claw.mp3',.8],block:['sfx/block.mp3',.9],slash:['sfx/slash.mp3',.7],
  /* UI */
  select:['sfx/confirm.mp3',.5],decline:['sfx/decline.mp3',.6],equip:['sfx/equip.mp3',.7],buy:['sfx/buy.mp3',.6],
  /* events */
  anvil:['sfx/anvil.mp3',.45],book:['sfx/book.mp3',.5],lever:['sfx/lever.mp3',.4],pour:['sfx/pour.mp3',.45],chestopen:['sfx/chest-open.mp3',.45],paper:['sfx/paper.mp3',.7]};
function playBuf(n,delay=0,rate=1){const c=AU.ctx,s=c.createBufferSource(),g=c.createGain();s.buffer=AU.buf[n];s.playbackRate.value=rate;g.gain.value=SFX_FILE[n][1];s.connect(g).connect(AU.out);s.start(c.currentTime+delay)}
function tone(f,dur,o={}){const c=audio();if(!c)return;const t=c.currentTime+(o.delay||0),os=c.createOscillator(),g=c.createGain();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);if(o.slide)os.frequency.exponentialRampToValueAtTime(o.slide,t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.vol||.2,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);os.connect(g).connect(AU.out);os.start(t);os.stop(t+dur+.03)}
function noise(dur,o={}){const c=audio();if(!c)return;const t=c.currentTime+(o.delay||0),s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.nb;fl.type=o.type||'bandpass';fl.frequency.setValueAtTime(o.f||1200,t);if(o.slide)fl.frequency.exponentialRampToValueAtTime(o.slide,t+dur);fl.Q.value=o.q||1;g.gain.setValueAtTime(o.vol||.3,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl).connect(g).connect(AU.out);s.start(t);s.stop(t+dur+.03)}
const SFX={
  select:()=>tone(988,.05,{type:'square',vol:.04}),
  move:()=>tone(587,.07,{type:'square',vol:.04,slide:880}),
  /* footsteps while a unit walks: soft thuds on foot, clip-clop for mounts, wingbeats for fliers */
  step:()=>[0,.09,.18].forEach((d,i)=>noise(.06,{vol:.18-i*.03,f:260+i*30,type:'lowpass',delay:d})),
  hoof:()=>[0,.07,.15,.22].forEach((d,i)=>{noise(.04,{vol:.14,f:1300+(i%2)*500,q:3,delay:d});tone(300+(i%2)*80,.04,{type:'triangle',vol:.04,delay:d})}),
  flap:()=>[0,.14].forEach(d=>noise(.13,{vol:.16,f:500,slide:1400,q:.7,delay:d})),
  swing:()=>noise(.18,{vol:.22,f:700,slide:3200,q:.8}),
  hit:()=>{noise(.14,{vol:.55,f:500,type:'lowpass'});tone(150,.16,{type:'triangle',vol:.35,slide:55})},
  /* crits: a rising charge on the wind-up, then a heavy crack with a ring on impact */
  critcharge:()=>{tone(300,.32,{type:'sawtooth',vol:.06,slide:1400});noise(.32,{vol:.18,f:600,slide:4000,q:2})},
  crit:()=>{noise(.08,{vol:.9,f:3800,q:1.5});tone(1400,.22,{type:'sawtooth',vol:.1,slide:300});noise(.4,{vol:.9,f:600,type:'lowpass',delay:.02});tone(80,.45,{type:'triangle',vol:.6,slide:35,delay:.02});[1568,2093].forEach((f,i)=>tone(f,.5,{vol:.05,delay:.06+i*.04}))},
  miss:()=>noise(.22,{vol:.16,f:2600,slide:700,q:2}),
  arrow:()=>{tone(320,.08,{type:'triangle',vol:.16,slide:120});noise(.26,{vol:.12,f:3200,slide:1500,q:3,delay:.03})},
  fire:()=>noise(.45,{vol:.35,f:280,slide:1800,type:'lowpass'}),
  dark:()=>{tone(200,.45,{type:'sawtooth',vol:.06,slide:80});noise(.4,{vol:.2,f:450,q:2})},
  thunder:()=>noise(.6,{vol:.6,f:2500,type:'lowpass',slide:180}),
  throw:()=>noise(.3,{vol:.15,f:1500,slide:800,q:4}),
  heal:()=>[660,880,1320].forEach((f,i)=>tone(f,.28,{vol:.08,delay:i*.07})),
  bell:()=>[[196,.16],[392,.07],[588,.05],[784,.035],[1046,.02]].forEach(([f,v])=>tone(f,2.6,{vol:v})),
  rise:()=>{tone(220,2.2,{type:'triangle',vol:.05,slide:880});noise(2.2,{vol:.12,f:900,slide:5000,q:1.2})},
  burst:()=>{noise(.7,{vol:.55,f:220,type:'lowpass'});tone(98,.8,{type:'triangle',vol:.3,slide:49});[784,988,1175,1568,1976].forEach((f,i)=>tone(f,.5,{type:'triangle',vol:.06,delay:.12+i*.07}))},
  ding:()=>{tone(1568,.55,{vol:.1});tone(3136,.4,{vol:.03})},
  fanfare:()=>[523,587,659,784,880,1047].forEach((f,i)=>tone(f,i===5?.5:.11,{type:'triangle',vol:.08,delay:i*.08})),
  death:()=>tone(420,.65,{type:'square',vol:.05,slide:70}),
  broke:()=>noise(.22,{vol:.3,f:3200,q:5}),
  phase:()=>[392,440,587].forEach((f,i)=>tone(f,.16,{type:'square',vol:.045,delay:i*.09})),
  ephase:()=>[330,294,220].forEach((f,i)=>tone(f,.18,{type:'square',vol:.045,delay:i*.1})),
  item:()=>[784,988,1175,1568].forEach((f,i)=>tone(f,.14,{type:'square',vol:.045,delay:i*.08})),
  tick:()=>tone(1760,.025,{type:'square',vol:.02}),
  water:()=>{noise(.45,{vol:.3,f:600,slide:250,q:3});tone(520,.3,{vol:.06,slide:260})},
  wind:()=>noise(.35,{vol:.25,f:1800,slide:4000,q:1.5}),
  earth:()=>{noise(.5,{vol:.55,f:180,type:'lowpass'});tone(70,.4,{type:'triangle',vol:.4,slide:40})},
};
/* synth stand-ins for recorded-only sounds */
Object.assign(SFX,{jump:()=>tone(330,.12,{type:'square',vol:.04,slide:660}),swordcrit:()=>SFX.crit(),ice:()=>SFX.water(),poison:()=>SFX.dark(),debuff:()=>SFX.dark(),claw:()=>SFX.swing(),slash:()=>SFX.swing(),block:()=>SFX.broke(),decline:()=>SFX.ephase(),equip:()=>SFX.tick(),buy:()=>SFX.item(),anvil:()=>{},book:()=>{},lever:()=>{},pour:()=>{},chestopen:()=>{},paper:()=>{},sandswipe:()=>SFX.swing(),levelup:()=>{}});
function sfx(n){if(!n||!settings.sound)return;try{if(audio()&&AU.buf[n]){if(n==='step')[0,.16].forEach((d,i)=>playBuf(n,d,i?.92:1.04));/* two footfalls */else playBuf(n)}else SFX[n]()}catch(_){}}
/* tx,ty: where the unit is going; walkers (not fliers) also hop when it's higher ground */
function stepSfx(u,tx,ty){if(settings.steps===false)return;const C=CLS[u.cls]||{};sfx(C.fly?'flap':C.mnt?'hoof':'step');if(!C.fly&&tx!=null&&hOf(tx,ty)>hOf(u.x,u.y))sfx('jump')}
document.addEventListener('pointerdown',()=>{if(settings.sound)audio()},{capture:true});

