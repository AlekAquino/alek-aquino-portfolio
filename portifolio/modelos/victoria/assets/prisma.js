import { createLiquidGlass } from './vendor/liquid-glass-web/liquid-glass.js';

const motion=matchMedia('(prefers-reduced-motion:reduce)');
const transparency=matchMedia('(prefers-reduced-transparency:reduce)');
const compact=matchMedia('(max-width:800px)');
const surfaces=[];
function material(shape){return {shape,radius:20,refraction:26,blur:5,light:30,pointer:!motion.matches&&!transparency.matches,mode:compact.matches||motion.matches||transparency.matches?'css':'auto',resolution:.75};}
function mount(){
 if(surfaces.length)return;
 for(const node of document.querySelectorAll('[data-prisma-glass],.photo-gallery .gallery-controls,.header-06 .nav-submenu')){
  try{
   const shape=node.classList.contains('gallery-controls')?'pill':'rounded';
   const glass=createLiquidGlass(node,material(shape));
   surfaces.push({node,glass,shape});node.dataset.prismaGlass='ready';
  }catch{node.dataset.prismaGlass='fallback';}
 }
}
function refresh(){
 for(const {glass,shape} of surfaces)glass.update(material(shape));
 for(const bar of document.querySelectorAll('.prisma-explorer [role=tablist]'))bar.setAttribute('aria-orientation',bar.closest('[data-tabs]').dataset.tabsOrientation==='horizontal'||compact.matches?'horizontal':'vertical');
}
function dispose(){for(const {node,glass} of surfaces){glass.destroy();delete node.dataset.prismaGlass;}surfaces.length=0;}
motion.addEventListener('change',refresh);transparency.addEventListener('change',refresh);compact.addEventListener('change',refresh);
addEventListener('pagehide',dispose);addEventListener('pageshow',event=>{if(event.persisted)mount();});
// Em uma hospedagem cuja CSP não admite os mapas PNG em memória, manter CSS.
addEventListener('securitypolicyviolation',event=>{
 if(event.effectiveDirective==='img-src'&&(event.blockedURI==='data'||event.blockedURI.startsWith('data:'))){
  for(const {glass,node} of surfaces){glass.update({mode:'css'});node.dataset.prismaGlass='css-fallback';}
 }
});
mount();refresh();
