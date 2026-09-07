/* interactions.js — cursor, nav-spy, spotlight, scramble, magnetic, ripple */
(function(){
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* 1. CUSTOM CURSOR */
  const dot=document.getElementById('cursor-dot'), ring=document.getElementById('cursor-ring');
  if(dot&&ring&&!('ontouchstart' in window)){
    let mx=-100,my=-100,rx=-100,ry=-100,visible=false;
    document.addEventListener('mousemove',e=>{
      mx=e.clientX; my=e.clientY;
      dot.style.left=mx+'px'; dot.style.top=my+'px';
      if(!visible){ visible=true; dot.style.opacity='1'; ring.style.opacity='1'; }
    });
    (function lerp(){ rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
      ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(lerp); })();
    document.querySelectorAll('a,button,.skill-card,.mission-card,.info-card,.badge-card').forEach(el=>{
      el.addEventListener('mouseenter',()=>{ ring.style.width='50px'; ring.style.height='50px'; ring.style.borderColor='var(--signal)'; dot.style.transform='translate(-50%,-50%) scale(1.6)'; });
      el.addEventListener('mouseleave',()=>{ ring.style.width='30px'; ring.style.height='30px'; ring.style.borderColor='rgba(0,229,255,.45)'; dot.style.transform='translate(-50%,-50%) scale(1)'; });
    });
  }

  /* 2. NAV SCROLL-SPY */
  const header=document.getElementById('site-header');
  const navLinks=document.querySelectorAll('nav.links a[data-section]');
  const sections=Array.from(navLinks).map(a=>document.getElementById(a.dataset.section)).filter(Boolean);

  function updateNav(){
    if(window.scrollY>10) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
    const mid=window.scrollY+window.innerHeight/2;
    let active=sections[0];
    sections.forEach(s=>{ if(s.offsetTop<=mid)active=s; });
    navLinks.forEach(a=>{
      const wasActive=a.classList.contains('active');
      const isActive=a.dataset.section===active?.id;
      if(!wasActive&&isActive){ a.classList.add('nav-flash'); a.addEventListener('animationend',()=>a.classList.remove('nav-flash'),{once:true}); }
      a.classList.toggle('active',isActive);
    });
  }
  window.addEventListener('scroll',updateNav,{passive:true});
  updateNav();

  /* 3. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(!t)return; e.preventDefault();
      window.scrollTo({ top:t.offsetTop-(header?.offsetHeight||60)-8, behavior:'smooth' });
    });
  });

  /* 4. MISSION CARD SPOTLIGHT + TILT */
  if(!reduced){
    document.querySelectorAll('.mission-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
        const tx=((e.clientY-r.top)/r.height-.5)*-5;
        const ty=((e.clientX-r.left)/r.width-.5)*5;
        card.style.transform=`translateY(-5px) rotateX(${tx}deg) rotateY(${ty}deg)`;
      });
      card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
    });
  }

  /* 5. HERO ROLE TEXT CYCLE (scramble) */
  if(!reduced){
    const roles=['Full-Stack Developer','AI Systems Builder','React + Flask Engineer','B.Tech CSE Student'];
    const el=document.getElementById('hero-role-text');
    if(el){
      let idx=0;
      const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';
      function scrambleTo(target){
        let iter=0;
        const id=setInterval(()=>{
          el.textContent=target.split('').map((c,i)=>i<iter?c:CHARS[Math.floor(Math.random()*CHARS.length)]).join('');
          if(iter>=target.length){ clearInterval(id); el.textContent=target; }
          iter+=.5;
        },36);
      }
      setInterval(()=>{ idx=(idx+1)%roles.length; scrambleTo(roles[idx]); },3500);
    }
  }

  /* 6. BRAND GLITCH on hover */
  const brand=document.querySelector('.brand');
  if(brand&&!reduced){
    brand.addEventListener('mouseenter',()=>{
      let i=0; const orig='AST_DEV'; const C='#@!%$&*';
      const id=setInterval(()=>{
        brand.innerHTML=orig.split('').map((c,idx)=>{
          if(idx<i||c==='_')return c==='_'?'<span>_</span>':c;
          return C[Math.floor(Math.random()*C.length)];
        }).join('');
        if(i>=orig.length){ clearInterval(id); brand.innerHTML='AST<span>_</span>DEV'; }
        i++;
      },42);
    });
  }

  /* 7. MAGNETIC BUTTONS */
  if(!reduced){
    document.querySelectorAll('.btn-primary,.btn-ghost,.nav-cta').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{
        const r=btn.getBoundingClientRect();
        btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.2}px)`;
      });
      btn.addEventListener('mouseleave',()=>{ btn.style.transform=''; });
    });
  }

  /* 8. CHIP RIPPLE */
  const rkf=document.createElement('style');
  rkf.textContent='@keyframes ripple{to{transform:scale(4);opacity:0}}';
  document.head.appendChild(rkf);
  document.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',e=>{
      const r=document.createElement('span');
      Object.assign(r.style,{position:'absolute',borderRadius:'50%',background:'rgba(0,229,255,.25)',pointerEvents:'none',transform:'scale(0)',animation:'ripple .5s ease forwards',width:'60px',height:'60px',margin:'-30px',left:e.offsetX+'px',top:e.offsetY+'px'});
      chip.style.position='relative'; chip.style.overflow='hidden';
      chip.appendChild(r); setTimeout(()=>r.remove(),600);
    });
  });

  /* 9. ACH TAG SCRAMBLE on reveal */
  if(!reduced){
    const aObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const tag=e.target.querySelector('.cert-meta');
          if(tag){
            const orig=tag.textContent; let i=0;
            const C='ABCDEFGHIJKLMNOPQRSTUVWXYZ/0-9';
            const id=setInterval(()=>{
              tag.textContent=orig.split('').map((c,idx)=>idx<i||c===' '?c:C[Math.floor(Math.random()*C.length)]).join('');
              if(i>=orig.length){ clearInterval(id); tag.textContent=orig; }
              i+=.8;
            },32);
          }
          aObs.unobserve(e.target);
        }
      });
    },{threshold:.7});
    document.querySelectorAll('.cert-card').forEach(r=>aObs.observe(r));
  }

  /* 10. PHOTO PARALLAX */
  if(!reduced){
    const frame=document.querySelector('.hero-photo-frame');
    if(frame){ window.addEventListener('scroll',()=>{ frame.style.transform=`translateY(${window.scrollY*.10}px)`; },{passive:true}); }
  }

  /* 11. FOOTER TYPEWRITER */
  if(!reduced){
    const fl=document.querySelector('.footer-tag');
    if(fl){
      const text=fl.textContent; fl.textContent='';
      const fo=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            let i=0; const id=setInterval(()=>{ fl.textContent=text.slice(0,i)+(i<text.length?'|':''); if(i>=text.length)clearInterval(id); i++; },38);
            fo.unobserve(e.target);
          }
        });
      },{threshold:.8});
      fo.observe(fl);
    }
  }

  /* 12. BACK TO TOP */
  const btt=document.querySelector('.back-top');
  if(btt){ btt.addEventListener('click',e=>{ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }); }

})();
