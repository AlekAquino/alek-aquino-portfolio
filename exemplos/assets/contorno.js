const group=document.querySelector('[data-contorno-tabs]');
if(group)(async()=>{
 const bar=group.querySelector('[role=tablist]'),tabs=[...bar.querySelectorAll('[role=tab]')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let activeAnimation=null,waapi=null;
 try{({waapi}=await import('./vendor/anime/modules/waapi/index.js'));}catch{/* Abas sem movimento continuam pelo controlador semântico. */}
 const stop=()=>{activeAnimation?.revert();activeAnimation=null;};
 const change=()=>{
  stop();
  const tab=tabs.find(t=>t.getAttribute('aria-selected')==='true');
  const panel=tab&&document.getElementById(tab.getAttribute('aria-controls'));
  if(panel&&!panel.hidden&&waapi&&!reduced.matches&&!document.hidden)activeAnimation=waapi.animate(panel,{opacity:[.25,1],y:[12,0],duration:280,ease:'out(3)'});
 };
 bar.addEventListener('click',change);
 bar.addEventListener('keydown',ev=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(ev.key))change();});
 reduced.addEventListener('change',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 addEventListener('pagehide',stop);
})();
