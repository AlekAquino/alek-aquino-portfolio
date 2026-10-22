import {computePosition,autoUpdate,offset,flip,shift} from './vendor/floating-ui/floating-ui.dom.esm.js';

const desktop=matchMedia('(min-width:1001px)');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const header=document.querySelector('.header-02');
const picker=document.querySelector('.clareira-picker');
const reference=picker?.querySelector('summary');
const panel=picker?.querySelector('.clareira-help-panel');
let cleanup=null;
function stopPositioning(){if(cleanup){cleanup();cleanup=null;}if(panel){panel.style.removeProperty('position');panel.style.removeProperty('left');panel.style.removeProperty('top');}}
function position(){
 stopPositioning();
 if(!desktop.matches||!picker?.open)return;
 panel.style.position='fixed';
 cleanup=autoUpdate(reference,panel,()=>{
  computePosition(reference,panel,{strategy:'fixed',placement:'bottom-start',middleware:[offset(16),flip(),shift({padding:16})]}).then(({x,y})=>{
   if(!picker.open||!desktop.matches)return;
   panel.style.left=`${x}px`;panel.style.top=`${y}px`;panel.dataset.positioned='true';
  });
 },{animationFrame:false});
}
picker?.addEventListener('toggle',position);desktop.addEventListener('change',position);
const hero=document.querySelector('[data-clareira-depth]');let frame=0;
function paint(){frame=0;if(!hero)return;const box=hero.getBoundingClientRect();const progress=reduced.matches?0:Math.max(0,Math.min(1,-box.top/Math.max(1,box.height)));hero.style.setProperty('--clareira-depth',progress.toFixed(4));header?.classList.toggle('is-scrolled',box.top<-20);}
function requestPaint(){if(!frame)frame=requestAnimationFrame(paint);}
if(hero){addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',requestPaint);reduced.addEventListener('change',requestPaint);paint();}
addEventListener('pagehide',()=>{stopPositioning();if(frame){cancelAnimationFrame(frame);frame=0;}});
addEventListener('pageshow',event=>{if(event.persisted){position();requestPaint();}});
