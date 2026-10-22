(() => {
 'use strict';
 const header=document.querySelector('.header-16'),button=header?.querySelector('[data-atlas-menu]'),nav=header?.querySelector('#site-nav');
 if(button&&nav){
  let open=false;
  const render=()=>{nav.hidden=!open;button.setAttribute('aria-expanded',String(open));button.firstChild.textContent=open?'Fechar índice ':'Explorar o site ';button.querySelector('span').textContent=open?'−':'＋';};
  button.hidden=false;render();button.addEventListener('click',()=>{open=!open;render();});
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&open){open=false;render();button.focus();}});
  document.addEventListener('click',ev=>{if(open&&!header.contains(ev.target)){open=false;render();}});
  nav.addEventListener('click',ev=>{if(ev.target.closest('a')){open=false;render();}});
 }
 const root=document.querySelector('[data-atlas-directory]');
 if(!root||typeof window.List!=='function')return;
 const controls=root.querySelector('[data-atlas-filters]'),query=controls.querySelector('[data-atlas-query]'),area=controls.querySelector('[data-atlas-area]'),sort=controls.querySelector('[data-atlas-sort]'),clear=controls.querySelector('[data-atlas-clear]'),status=root.querySelector('[data-atlas-status]'),empty=root.querySelector('[data-atlas-empty]');
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
 let list;
 try{list=new window.List(root,{valueNames:[{data:['area','order']},'atlas-title','atlas-summary'],page:20});}catch{return;}
 const collator=new Intl.Collator('pt-BR',{sensitivity:'base'});
 const report=()=>{const count=list.matchingItems.length;status.textContent=`${count} de ${list.items.length} assuntos`;empty.hidden=count!==0;};
 const filter=()=>{
  const q=normalize(query.value.slice(0,100)),selected=['prevencao','ortodontia','infancia'].includes(area.value)?area.value:'all';
  list.filter(item=>{const values=item.values();return(selected==='all'||values.area===selected)&&normalize(values['atlas-title']+' '+values['atlas-summary']).includes(q);});
  if(sort.value==='title')list.sort('atlas-title',{sortFunction:(a,b)=>collator.compare(a.values()['atlas-title'],b.values()['atlas-title'])});
  else list.sort('order',{order:'asc'});
  report();
 };
 controls.hidden=false;
 query.addEventListener('input',filter);area.addEventListener('change',filter);sort.addEventListener('change',filter);
 clear.addEventListener('click',()=>{query.value='';area.value='all';sort.value='path';filter();query.focus();});
 list.on('updated',report);filter();
})();
