const header=document.querySelector('.header-18');
if(header){
 const trigger=header.querySelector('[data-forma-menu]'),nav=header.querySelector('#site-nav');
 const dialog=document.createElement('dialog');
 if(typeof dialog.showModal==='function'){
  dialog.id='forma-menu-dialog';dialog.className='forma-menu-dialog';dialog.setAttribute('aria-labelledby','forma-menu-title');
  const top=document.createElement('div');top.className='forma-menu-top';
  const title=document.createElement('h2');title.id='forma-menu-title';title.textContent='Explore a Forma';
  const close=document.createElement('button');close.type='button';close.textContent='Fechar índice ×';close.setAttribute('aria-label','Fechar índice');top.append(title,close);dialog.append(top,nav);document.body.append(dialog);
  trigger.hidden=false;
  trigger.addEventListener('click',()=>{dialog.showModal();trigger.setAttribute('aria-expanded','true');document.body.classList.add('forma-index-open');});
  close.addEventListener('click',()=>dialog.close());nav.addEventListener('click',ev=>{if(ev.target.closest('a'))dialog.close();});
  dialog.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');document.body.classList.remove('forma-index-open');trigger.focus();});
  dialog.addEventListener('click',ev=>{const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();});
 }
}

const gallery=document.querySelector('[data-forma-gallery]');
if(gallery){
 const links=[...gallery.querySelectorAll('[data-forma-photo]')].filter(link=>{const u=new URL(link.href);return u.origin===location.origin&&/^\/assets\/exclusivos\/18\/(abertura|ambiente|prevencao|ortodontia|infancia)-v1\.jpg$/.test(u.pathname)&&!u.search&&!u.hash;});
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let libraryPromise,instance,opener,sequence=0,selectedIndex=0;let inertRoots=[];
 const restore=()=>{for(const [node,previous] of inertRoots)node.inert=previous;inertRoots=[];document.removeEventListener('keydown',trap,true);opener?.focus();};
 const trap=ev=>{
  if(ev.key!=='Tab')return;const modal=document.querySelector('#glightbox-body');if(!modal)return;
  const controls=[...modal.querySelectorAll('button,a[href]')].filter(e=>!e.disabled&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');if(!controls.length)return;
  const first=controls[0],last=controls.at(-1);if(ev.shiftKey&&(document.activeElement===first||!controls.includes(document.activeElement))){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&(document.activeElement===last||!controls.includes(document.activeElement))){ev.preventDefault();first.focus();}
 };
 const sync=index=>{const modal=document.querySelector('#glightbox-body');if(!modal)return;const status=modal.querySelector('[data-forma-lightbox-status]');status.textContent=`Imagem ${index+1} de ${links.length} · ilustração da Forma`;modal.querySelector('.gprev').disabled=index===0;modal.querySelector('.gnext').disabled=index===links.length-1;};
 const markup='<div id="glightbox-body" class="glightbox-container forma-lightbox" tabindex="-1" role="dialog" aria-modal="true" aria-label="Galeria de fotografias da Forma"><div class="gloader visible"></div><div class="goverlay"></div><div class="gcontainer"><div id="glightbox-slider" class="gslider"></div><p class="forma-lightbox-status" data-forma-lightbox-status role="status"></p><button class="gclose gbtn" type="button" aria-label="Fechar galeria" data-taborder="3"><span aria-hidden="true">×</span></button><button class="gprev gbtn" type="button" aria-label="Imagem anterior" data-taborder="2"><span aria-hidden="true">←</span></button><button class="gnext gbtn" type="button" aria-label="Próxima imagem" data-taborder="1"><span aria-hidden="true">→</span></button></div></div>';
 const mount=async()=>{
  libraryPromise||=import('./vendor/glightbox/glightbox.min.js').then(()=>window.GLightbox);const create=await libraryPromise;if(instance)return instance;
  instance=create({selector:null,elements:links.map(link=>({href:link.href,type:'image',title:'',description:'',alt:link.querySelector('img').alt,zoomable:true,draggable:!reduced.matches})),lightboxHTML:markup,slideHTML:'<div class="gslide"><div class="gslide-inner-content"><div class="ginner-container"><div class="gslide-media"></div></div></div></div>',loop:false,preload:false,autoplayVideos:false,autofocusVideos:false,keyboardNavigation:true,touchNavigation:!reduced.matches,draggable:!reduced.matches,openEffect:'none',closeEffect:'none',slideEffect:reduced.matches?'none':'fade',plyr:{css:'',js:''}});
  instance.on('open',()=>{inertRoots=[...document.querySelectorAll('body>header,body>main,body>footer,body>.demo-bar,body>.skip')].map(node=>[node,node.inert]);inertRoots.forEach(([node])=>{node.inert=true;});document.addEventListener('keydown',trap,true);document.querySelector('#glightbox-body .gclose')?.focus();});
  instance.on('close',restore);instance.on('slide_before_change',({current})=>{selectedIndex=current.slideIndex;});instance.on('slide_changed',({current})=>{selectedIndex=current.slideIndex;sync(selectedIndex);});instance.on('slide_after_load',({slideIndex})=>{if(slideIndex===selectedIndex)sync(slideIndex);});return instance;
 };
 links.forEach((link,index)=>link.addEventListener('click',async ev=>{ev.preventDefault();const current=++sequence;opener=link;try{const box=await mount();if(current!==sequence)return;selectedIndex=index;box.openAt(index);sync(index);}catch{libraryPromise=null;instance=null;restore();location.assign(link.href);}}));
 const dispose=()=>{sequence++;instance?.destroy();instance=null;restore();};
 reduced.addEventListener('change',dispose);addEventListener('pagehide',dispose);
}
