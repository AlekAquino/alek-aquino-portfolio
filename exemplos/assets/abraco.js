(() => {
 'use strict';
 const nav=document.querySelector('.header-15 #site-nav');
 const current=nav?.querySelector('[aria-current=page]');
 if(current)nav.scrollLeft=Math.max(0,current.offsetLeft-nav.offsetLeft-(nav.clientWidth-current.offsetWidth)/2);
 const root=document.querySelector('[data-abraco-album]');
 if(!root||typeof window.EmblaCarousel!=='function')return;
 const viewport=root.querySelector('[data-abraco-viewport]'),slides=[...root.querySelectorAll('.abraco-slide')];
 const previous=root.querySelector('[data-abraco-prev]'),next=root.querySelector('[data-abraco-next]'),controls=root.querySelector('[data-abraco-controls]'),status=root.querySelector('[data-abraco-status]');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let api;
 const options=()=>({loop:false,align:'start',containScroll:'trimSnaps',duration:reduced.matches?0:25,watchDrag:!reduced.matches,watchSlides:false});
 const update=()=>{if(!api)return;const index=api.selectedScrollSnap();previous.disabled=!api.canScrollPrev();next.disabled=!api.canScrollNext();status.textContent=`Imagem ${index+1} de ${slides.length}`;slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',String(i!==index)));};
 const destroy=()=>{api?.destroy();api=null;root.classList.remove('is-mounted');controls.hidden=true;viewport.removeAttribute('tabindex');viewport.removeAttribute('aria-label');slides.forEach(slide=>slide.removeAttribute('aria-hidden'));};
 const mount=()=>{
  if(api)return;root.classList.add('is-mounted');
  try{api=window.EmblaCarousel(viewport,options());controls.hidden=false;viewport.tabIndex=0;viewport.setAttribute('aria-label','Álbum de três imagens. Use as setas para navegar.');api.on('select',update).on('reInit',update);update();}catch{destroy();}
 };
 previous.addEventListener('click',()=>api?.scrollPrev(reduced.matches));next.addEventListener('click',()=>api?.scrollNext(reduced.matches));
 viewport.addEventListener('keydown',ev=>{if(!api)return;if(ev.key==='ArrowLeft'){ev.preventDefault();api.scrollPrev(reduced.matches);}if(ev.key==='ArrowRight'){ev.preventDefault();api.scrollNext(reduced.matches);}if(ev.key==='Home'){ev.preventDefault();api.scrollTo(0,reduced.matches);}if(ev.key==='End'){ev.preventDefault();api.scrollTo(slides.length-1,reduced.matches);}});
 reduced.addEventListener('change',()=>{if(api){const index=api.selectedScrollSnap();api.reInit({...options(),startIndex:index});api.scrollTo(index,true);update();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&api)api.scrollTo(api.selectedScrollSnap(),true);});
 addEventListener('pagehide',destroy);addEventListener('pageshow',ev=>{if(ev.persisted)mount();});mount();
})();
