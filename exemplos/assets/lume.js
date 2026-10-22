(() => {
  'use strict';
  const group=document.querySelector('.lume-menu');
  if(!group)return;
  group.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&group.open){event.stopPropagation();group.open=false;group.querySelector('summary').focus();}
  });
  document.addEventListener('click',event=>{if(group.open&&!group.contains(event.target))group.open=false;});
  for(const bar of document.querySelectorAll('.care-explorer-layout [role=tablist]'))bar.setAttribute('aria-orientation','vertical');
})();
