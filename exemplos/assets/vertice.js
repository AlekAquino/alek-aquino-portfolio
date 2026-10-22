'use strict';
(() => {
 const index=document.querySelector('.detail-index');
 const content=document.querySelector('.detail-guide article');
 if(!index||!content||!window.tocbot)return;
 const fallback=[...index.querySelectorAll(':scope>a')];
 const toc=document.createElement('div');toc.className='vertice-toc';index.append(toc);
 for(const heading of content.querySelectorAll('.care-chapter h2'))heading.id=heading.parentElement.id+'-titulo';
 function mount(){
  window.tocbot.init({tocElement:toc,contentElement:content,headingSelector:'.care-chapter h2',includeHtml:false,scrollSmooth:false,orderedList:false,headingsOffset:80,collapseDepth:6,throttleTimeout:80});
  if(toc.querySelector('a'))for(const link of fallback)link.hidden=true;
 }
 function dispose(){window.tocbot.destroy();for(const link of fallback)link.hidden=false;}
 mount();addEventListener('pagehide',dispose);addEventListener('pageshow',e=>{if(e.persisted)mount();});
})();
