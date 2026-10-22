import { createLiquidGlass } from './brand/liquid-glass/liquid-glass.js';

// Mesma biblioteca/material da Alek. CSS, sem refração SVG ou vídeo adicional.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pointer=matchMedia('(hover: hover) and (pointer: fine)');
const instances=[];
const register=(element,nav=false)=>{
  if(element.dataset.lgRenderer)return;
  try{
    const interactive=!nav;
    const instance=createLiquidGlass(element,{mode:'css',shape:'pill',radius:nav?32:999,
      refraction:0,blur:nav?7:4,light:nav?30:40,pointer:interactive&&pointer.matches&&!reduced.matches});
    instances.push({instance,interactive});
  }catch{/* O material CSS permanece utilizável sem a biblioteca. */}
};

const header=document.querySelector('.catalog-header');
const toggle=header?.querySelector('.catalog-menu-toggle');
if(header&&toggle){
  const close=(focus=false)=>{
    header.removeAttribute('data-menu-open');toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menu');toggle.querySelector('.menu-word').textContent='Menu';
    if(focus)toggle.focus();
  };
  toggle.addEventListener('click',()=>{
    if(toggle.getAttribute('aria-expanded')==='true'){close();return;}
    header.setAttribute('data-menu-open','');toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Fechar menu');toggle.querySelector('.menu-word').textContent='Fechar';
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.hasAttribute('data-menu-open'))close(true);});
  document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
  header.querySelector('nav').addEventListener('click',event=>{if(event.target.closest('a'))close();});
  matchMedia('(max-width:850px)').addEventListener('change',()=>close());
  document.body.classList.add('catalog-enhanced');
}

document.querySelectorAll('.catalog-header nav').forEach(element=>register(element,true));
const controls=document.querySelectorAll('button,.catalog-button,.model-preview-link,.whatsapp-link,.back-link,.viewer-toolbar>a,.model-tools>a,.compare-links>a,.footer-official');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){register(entry.target);observer.unobserve(entry.target);}});
  },{rootMargin:'120px'});
  controls.forEach(element=>observer.observe(element));
}else controls.forEach(element=>register(element));
const updatePointers=()=>instances.forEach(({instance,interactive})=>instance.update({pointer:interactive&&pointer.matches&&!reduced.matches}));
reduced.addEventListener('change',updatePointers);pointer.addEventListener('change',updatePointers);
window.addEventListener('pagehide',event=>{if(!event.persisted)instances.forEach(({instance})=>instance.destroy());});

if(!reduced.matches&&Element.prototype.animate){
  for(const [selector,delay] of [['.catalog-intro',0],['.cover-composition',90]]){
    document.querySelector(selector)?.animate([{opacity:.65,transform:'translateY(12px)'},{opacity:1,transform:'none'}],
      {duration:650,delay,easing:'cubic-bezier(.22,1,.36,1)'});
  }
}
