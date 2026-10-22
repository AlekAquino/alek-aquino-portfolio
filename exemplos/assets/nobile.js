import PhotoSwipeLightbox from './vendor/photoswipe/photoswipe-lightbox.esm.js';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let lightbox,returnTarget;
function mount(){
 if(lightbox||!document.querySelector('.nobile-gallery-grid'))return;
 lightbox=new PhotoSwipeLightbox({gallery:'.nobile-gallery-grid',children:'a[data-pswp-width]',pswpModule:()=>import('./vendor/photoswipe/photoswipe.esm.js'),loop:false,wheelToZoom:false,bgOpacity:.96,showHideAnimationType:reduced.matches?'none':'fade',showAnimationDuration:reduced.matches?0:240,hideAnimationDuration:reduced.matches?0:200,zoomAnimationDuration:reduced.matches?0:220,closeTitle:'Fechar galeria',zoomTitle:'Ampliar ou reduzir imagem',arrowPrevTitle:'Imagem anterior',arrowNextTitle:'Próxima imagem',errorMsg:'Não foi possível carregar a imagem. Feche a galeria e tente novamente.',escKey:true,arrowKeys:true,trapFocus:true,returnFocus:true});
 lightbox.addFilter('itemData',item=>{
  const url=new URL(item.src||'',location.href);
  const allowed=url.origin===location.origin&&/\/assets\/exclusivos\/05\/[a-z0-9-]+\.jpg$/.test(url.pathname);
  return {...item,type:'image',html:undefined,src:allowed?url.href:'',srcset:undefined};
 });
 lightbox.on('beforeOpen',()=>{returnTarget=document.activeElement?.closest('a[data-pswp-width]');});
 lightbox.on('afterInit',()=>{const dialog=lightbox.pswp?.element;if(dialog){dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Imagens da Nobile');}});
 lightbox.on('openingAnimationEnd',()=>lightbox.pswp?.element?.focus({preventScroll:true}));
 lightbox.on('destroy',()=>{if(returnTarget?.isConnected)returnTarget.focus({preventScroll:true});returnTarget=undefined;});
 lightbox.init();
}
function dispose(){lightbox?.destroy();lightbox=undefined;}
mount();addEventListener('pagehide',dispose);addEventListener('pageshow',event=>{if(event.persisted)mount();});
