/* animations.js — scroll reveal, counters, XP bars, particles, career nodes */
(function(){
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* 1. SCROLL REVEAL */
  const SEL = '.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger,.section-glow';
  if(!reduced){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    },{ threshold:0.08 });
    document.querySelectorAll(SEL).forEach(el=>obs.observe(el));
  } else {
    document.querySelectorAll(SEL).forEach(el=>el.classList.add('visible'));
  }

  /* 2. HUD COUNTERS */
  function animCount(el){
    const target=parseFloat(el.dataset.count), dec=parseInt(el.dataset.decimals||'0'), suf=el.dataset.suffix||'';
    const dur=1400, t0=performance.now();
    (function step(now){
      const p=Math.min((now-t0)/dur,1), e=1-Math.pow(1-p,4);
      el.textContent=(target*e).toFixed(dec)+suf;
      if(p<1)requestAnimationFrame(step);
    })(t0);
  }
  if(!reduced){
    const co=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.querySelectorAll('[data-count]').forEach(animCount); co.unobserve(e.target); }
      });
    },{ threshold:0.5 });
    document.querySelectorAll('.hud-panels,.hero-meta').forEach(el=>co.observe(el));
  }

  /* 3. SCROLL PROGRESS BAR */
  const bar=document.getElementById('scroll-progress');
  if(bar){
    window.addEventListener('scroll',()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      bar.style.width=(window.scrollY/max*100).toFixed(2)+'%';
    },{passive:true});
  }

  /* 4. XP BARS */
  if(!reduced){
    const xpObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const fill=e.target.querySelector('.xp-fill');
          if(fill){
            const xp=fill.dataset.xp||'0';
            fill.style.setProperty('--xp-w',xp+'%');
            e.target.classList.add('xp-filled');
          }
          xpObs.unobserve(e.target);
        }
      });
    },{ threshold:0.3 });
    document.querySelectorAll('.skill-card').forEach(c=>xpObs.observe(c));
  } else {
    document.querySelectorAll('.skill-card').forEach(c=>{
      const fill=c.querySelector('.xp-fill');
      if(fill){ fill.style.setProperty('--xp-w',(fill.dataset.xp||'0')+'%'); c.classList.add('xp-filled'); }
    });
  }

  /* 5. CAREER NODE LINE STAGGER */
  if(!reduced){
    const cnObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('cn-vis'); cnObs.unobserve(e.target); }
      });
    },{ threshold:0.2 });
    document.querySelectorAll('.career-node').forEach(n=>cnObs.observe(n));
  } else {
    document.querySelectorAll('.career-node').forEach(n=>n.classList.add('cn-vis'));
  }

  /* 6. PARTICLES */
  if(!reduced){
    const canvas=document.getElementById('particles');
    if(canvas){
      const ctx=canvas.getContext('2d');
      let mouse={x:-999,y:-999};
      function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
      resize();
      window.addEventListener('resize',resize,{passive:true});
      window.addEventListener('mousemove',e=>{ mouse.x=e.clientX; mouse.y=e.clientY; },{passive:true});

      const P=Array.from({length:60},()=>({
        x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
        r:Math.random()*1.4+.3, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
        o:Math.random()*.4+.07
      }));

      (function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        P.forEach(p=>{
          const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<90){ p.vx+=dx/d*.035; p.vy+=dy/d*.035; }
          const sp=Math.sqrt(p.vx*p.vx+p.vy*p.vy);
          if(sp>.75){ p.vx*=.75/sp; p.vy*=.75/sp; }
          p.x+=p.vx; p.y+=p.vy;
          if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
          if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle=`rgba(0,229,255,${p.o})`; ctx.fill();
        });
        for(let i=0;i<P.length;i++) for(let j=i+1;j<P.length;j++){
          const dx=P[i].x-P[j].x,dy=P[i].y-P[j].y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<120){ ctx.beginPath(); ctx.moveTo(P[i].x,P[i].y); ctx.lineTo(P[j].x,P[j].y);
            ctx.strokeStyle=`rgba(0,229,255,${.07*(1-d/120)})`; ctx.lineWidth=.7; ctx.stroke(); }
        }
        requestAnimationFrame(draw);
      })();
    }
  }

  /* 7. SECTION TITLE DATA-TEXT for glitch */
  document.querySelectorAll('.sec-title').forEach(el=>{ el.dataset.text=el.textContent; });

  /* 8. STICKY PAGE COUNTER */
  const pc = document.getElementById('page-counter');
  const pcCurrent = pc?.querySelector('.pc-current');
  const pageSections = Array.from(document.querySelectorAll('section[data-page]'));

  if(pc && pcCurrent && pageSections.length) {
    pc.classList.add('visible');
    window.addEventListener('scroll', () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let current = pageSections[0];
      pageSections.forEach(s => { if(s.offsetTop <= mid) current = s; });
      const page = current?.dataset.page || '01';
      if(pcCurrent.textContent !== page) {
        pcCurrent.style.transform = 'translateY(-8px)';
        pcCurrent.style.opacity = '0';
        setTimeout(() => {
          pcCurrent.textContent = page;
          pcCurrent.style.transform = 'translateY(0)';
          pcCurrent.style.opacity = '1';
        }, 150);
      }
    }, { passive: true });
  }

  /* 9. ADD ED-LABEL TO EACH SEC-HEADER */
  const edLabels = {
    about:    '[ 02 / 07 ]',
    career:   '[ 03 / 07 ]',
    skills:   '[ 04 / 07 ]',
    work:     '[ 05 / 07 ]',
    awards:   '[ 06 / 07 ]',
    manifesto:'[ 07 / 07 ]',
  };
  document.querySelectorAll('section[id]').forEach(sec => {
    const label = edLabels[sec.id];
    if(!label) return;
    const header = sec.querySelector('.sec-header, .manifesto-header');
    if(!header) return;
    if(!header.querySelector('.ed-label')) {
      const el = document.createElement('div');
      el.className = 'ed-label mono';
      el.textContent = label;
      header.insertBefore(el, header.firstChild);
    }
  });

})();
