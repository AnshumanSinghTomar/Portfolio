/* boot.js */
(function(){
  'use strict';
  const boot    = document.getElementById('boot');
  const skip    = document.getElementById('boot-skip');
  const bfill   = document.getElementById('bfill');
  const bbarWrap= document.querySelector('.boot-bar-wrap');
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const lines   = [{id:'b1',d:100},{id:'b2',d:480},{id:'b3',d:880},{id:'b4',d:1260}];

  function end(){
    boot.classList.add('hide');
    setTimeout(()=>{ boot.style.display='none'; },600);
  }
  if(reduced){ end(); return; }
  lines.forEach(({id,d})=>setTimeout(()=>{ const el=document.getElementById(id); if(el)el.classList.add('show'); },d));
  setTimeout(()=>{ if(bbarWrap)bbarWrap.classList.add('show'); },1480);
  setTimeout(()=>{ if(bfill)bfill.style.width='100%'; },1530);
  setTimeout(end,2550);
  skip?.addEventListener('click',end);
})();
