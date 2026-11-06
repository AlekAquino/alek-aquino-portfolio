'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(focus=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');if(focus)menu.focus()}
menu.addEventListener('click',()=>{const v=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(v));menu.setAttribute('aria-label',v?'Fechar menu':'Abrir menu')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu()});
matchMedia('(max-width:900px)').addEventListener('change',()=>closeMenu());
const wa='https://wa.me/5551995692614?text=';
document.querySelectorAll('[data-whatsapp]').forEach(a=>{a.href=wa+encodeURIComponent('Olá! Quero planejar meus móveis com a NAZA.');a.target='_blank';a.rel='noopener noreferrer';a.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('naza:contact',{detail:{channel:'whatsapp',location:a.closest('section')?.id||'navigation'}})))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true)});
const projects=window.NAZA_PROJECTS||[],track=document.querySelector('#project-track');
if(track){
 const cards=[...track.querySelectorAll('[data-project]')],filters=[...document.querySelectorAll('[data-filter]')],status=document.querySelector('.gallery-status'),prev=document.querySelector('.gallery-prev'),next=document.querySelector('.gallery-next'),search=document.querySelector('#project-search');
 let selectedCategory='todos';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 function arrows(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-3}
 function filter(key){selectedCategory=key;const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const query=normalize(search?.value.trim()||'');filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===key)));cards.forEach(c=>{const p=projects[Number(c.dataset.project)];c.hidden=(key!=='todos'&&c.dataset.category!==key)||(query&&!normalize(p.title+' '+p.desc+' '+p.label).includes(query))});const n=cards.filter(c=>!c.hidden).length;status.textContent=n?n+(n===1?' projeto':' projetos')+' · deslize para explorar':'Nenhum projeto encontrado. Tente outro termo ou ambiente.';track.scrollTo({left:0,behavior:'instant'});requestAnimationFrame(arrows)}
 search?.addEventListener('input',()=>filter(selectedCategory));
 function move(d){const c=cards.find(c=>!c.hidden);if(c)track.scrollBy({left:d*(c.getBoundingClientRect().width+18),behavior:reduced.matches?'instant':'smooth'})}
 filters.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',arrows,{passive:true});
 track.addEventListener('keydown',e=>{if(e.target===track&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
 new ResizeObserver(arrows).observe(track);
 document.body.classList.add('gallery-ready');arrows();
 const dialog=document.querySelector('#lightbox'),photo=dialog.querySelector('#lightbox-image'),back=dialog.querySelector('.photo-prev'),forward=dialog.querySelector('.photo-next'),thumbs=dialog.querySelector('.lightbox-thumbs');
 let current=null,index=0,source=null,overflow='';
 function show(i){index=Math.max(0,Math.min(i,current.images.length-1));const p=current.images[index];const stage=photo.parentElement;stage.classList.add('loading');stage.classList.remove('failed');photo.onload=()=>stage.classList.remove('loading');photo.onerror=()=>{stage.classList.remove('loading');stage.classList.add('failed')};dialog.querySelector('#lightbox-description').textContent=current.desc+(p.stage?' Registro: '+p.stage+'.':'');photo.src=p.src;photo.alt=p.alt+' — foto '+(index+1);photo.width=p.width;photo.height=p.height;if(photo.complete&&photo.naturalWidth)stage.classList.remove('loading');dialog.querySelector('#lightbox-count').textContent='Foto '+(index+1)+' de '+current.images.length;back.disabled=index===0;forward.disabled=index===current.images.length-1;back.hidden=forward.hidden=current.images.length===1;[...thumbs.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(index===j)))}
 cards.forEach(b=>b.addEventListener('click',()=>{current=projects[Number(b.dataset.project)];if(!current)return;source=b;dialog.querySelector('#lightbox-title').textContent=current.title;dialog.querySelector('#lightbox-category').textContent=current.label;dialog.querySelector('#lightbox-description').textContent=current.desc;dialog.querySelector('.lightbox-cta').href=wa+encodeURIComponent('Olá! Vi o projeto "'+current.title+'" no site da NAZA e quero conversar sobre um móvel para o meu espaço.');thumbs.replaceChildren();current.images.forEach((p,i)=>{const t=document.createElement('button');t.type='button';t.setAttribute('aria-label','Ver foto '+(i+1));t.setAttribute('aria-pressed',String(i===0));const im=document.createElement('img');im.src=p.thumb;im.alt='';im.width=76;im.height=58;t.append(im);t.addEventListener('click',()=>show(i));thumbs.append(t)});show(0);overflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal()}));
 back.addEventListener('click',()=>show(index-1));forward.addEventListener('click',()=>show(index+1));
 dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=overflow;source?.focus({preventScroll:true})});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1))}});
 let swipe=null;const stage=dialog.querySelector('.lightbox-stage');
 stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipe={x:e.clientX,y:e.clientY}});
 stage.addEventListener('pointerup',e=>{if(swipe){const x=e.clientX-swipe.x,y=e.clientY-swipe.y;if(Math.abs(x)>55&&Math.abs(x)>Math.abs(y)*1.4)show(index+(x<0?1:-1));swipe=null}});
 stage.addEventListener('pointercancel',()=>swipe=null);
}
