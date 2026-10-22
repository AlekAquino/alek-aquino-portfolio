'use strict';
(() => {
  const cards=[...document.querySelectorAll('[data-model]')];
  const cardById=new Map(cards.map(c=>[c.dataset.model,c]));
  const search=document.getElementById('model-search');
  const category=document.getElementById('category');
  const favoritesOnly=document.getElementById('favorites-only');
  const clearFilters=document.getElementById('clear-filters');
  const status=document.getElementById('collection-status');
  const storageStatus=document.getElementById('storage-status');
  const selected=new Set();
  const dialog=document.getElementById('compare-dialog');
  const openCompare=document.getElementById('open-compare');
  const tray=document.getElementById('compare-tray');
  const comparisonViews=[];
  function clearComparison(){for(const view of comparisonViews)view.observer?.disconnect();comparisonViews.length=0;document.getElementById('compare-frames').replaceChildren();}
  let onlyFavorites=false;
  let favorites=AlekSelection.load();
  document.querySelector('[data-enhanced]').hidden=false;
  const chosenIds=()=>[...new Set([...favorites.ids,...selected])].filter(id=>cardById.has(id));
  function reflectContact(){AlekContact.setLink(document.getElementById('contact-selection'),chosenIds());AlekContact.setLink(document.getElementById('contact-tray'),[...selected]);}
  const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
  function reportStorage() {
    storageStatus.textContent=favorites.available?'':'Favoritos indisponíveis neste navegador. Você ainda pode comparar os modelos e encaminhar sua escolha pelo WhatsApp.';
  }
  function update() {
    search.value=search.value.slice(0,100);
    const q=normalize(search.value.slice(0,100));
    let count=0;
    for(const card of cards) {
      const id=card.dataset.model;
      card.hidden=!(category.value==='all'||card.dataset.category===category.value)||!normalize(card.dataset.search).includes(q)||(onlyFavorites&&!favorites.ids.includes(id));
      if(!card.hidden)count++;
      const button=card.querySelector('[data-favorite]');
      const chosen=favorites.ids.includes(id);
      button.setAttribute('aria-pressed',String(chosen));
      button.textContent=chosen?'♥ Favoritado':'♡ Favoritar';
      button.setAttribute('aria-label',`${chosen?'Remover':'Guardar'} ${card.querySelector('h2').textContent} ${chosen?'dos':'nos'} favoritos`);
    }
    status.textContent=`${count} ${count===1?'modelo disponível':'modelos disponíveis'} · ${favorites.ids.length} ${favorites.ids.length===1?'favorito':'favoritos'}`;
    document.getElementById('collection-empty').hidden=count!==0;
    favoritesOnly.setAttribute('aria-pressed',String(onlyFavorites));
    reportStorage();
    reflectContact();
  }
  for(const button of document.querySelectorAll('[data-favorite]')) {
    button.hidden=false;
    button.addEventListener('click',()=>{favorites=AlekSelection.toggle(button.dataset.favorite);update();});
  }
  favoritesOnly.hidden=false;clearFilters.hidden=false;
  favoritesOnly.addEventListener('click',()=>{onlyFavorites=!onlyFavorites;update();});
  search.addEventListener('input',update);category.addEventListener('change',update);
  clearFilters.addEventListener('click',()=>{search.value='';category.value='all';onlyFavorites=false;update();});
  const clearFavorites=document.createElement('button');
  clearFavorites.type='button';clearFavorites.textContent='Limpar favoritos';
  clearFavorites.addEventListener('click',()=>{favorites=AlekSelection.clear();update();});
  favoritesOnly.after(clearFavorites);

  function updateComparison() {
    tray.hidden=selected.size===0;
    document.getElementById('compare-count').textContent=`${selected.size} de 2 modelos selecionados`;
    openCompare.disabled=selected.size!==2;
    for(const input of document.querySelectorAll('[data-compare]'))input.checked=selected.has(input.dataset.compare);
    reflectContact();
  }
  for(const input of document.querySelectorAll('[data-compare]')) {
    input.closest('label').hidden=false;
    input.addEventListener('change',()=>{
      const id=input.dataset.compare;
      if(input.checked&&selected.size>=2){input.checked=false;status.textContent='Compare dois modelos por vez. Remova um para escolher outro.';return;}
      if(input.checked)selected.add(id);else selected.delete(id);
      updateComparison();
    });
  }
  document.getElementById('clear-compare').addEventListener('click',()=>{selected.clear();updateComparison();});
  openCompare.addEventListener('click',()=>{
    if(selected.size!==2)return;
    const area=document.getElementById('compare-frames');clearComparison();
    for(const id of selected) {
      const card=cardById.get(id);if(!card)continue;
      const column=document.createElement('section');
      const title=document.createElement('h3');title.textContent=`${id} · ${card.querySelector('h2').textContent}`;
      const frame=document.createElement('iframe');
      const model=ALEK_CATALOG_DATA.models.find(item=>item.id===id);
      if(!model)continue;
      const publicUrl=new URL(model.path.split('/').pop()+'/index.html',ALEK_CATALOG_DATA.company.examples_base_url);
      const url=new URL(ALEK_CATALOG_DATA.company.gallery_published?publicUrl.pathname:model.path+'/index.html',location.href);
      if(url.origin!==location.origin||!url.pathname.endsWith('/index.html'))continue;
      frame.src=url.href;frame.title=`Modelo ${title.textContent}`;
      const viewport=document.createElement('div');viewport.className='compare-viewport';
      const canvas=document.createElement('div');canvas.className='compare-canvas';canvas.append(frame);viewport.append(canvas);
      const links=document.createElement('div');links.className='compare-links';
      const full=document.createElement('a');full.href=publicUrl.href;full.target='_blank';full.rel='noopener noreferrer';full.textContent='Abrir site atual ↗';
      const preview=document.createElement('a');preview.href='viewer.html?modelo='+id;preview.textContent='Prévia desktop e celular';links.append(full,preview);
      column.append(title,viewport,links);area.append(column);
      let previous=0;
      const fit=()=>{const available=viewport.clientWidth;if(!available||available===previous)return;previous=available;const scale=Math.min(1,available/1440);canvas.style.width=(1440*scale)+'px';canvas.style.height=(900*scale)+'px';frame.style.width='1440px';frame.style.height='900px';frame.style.transform='scale('+scale+')';};
      const observer='ResizeObserver' in window?new ResizeObserver(fit):null;observer?.observe(viewport);comparisonViews.push({observer,fit});
    }
    if(typeof dialog.showModal==='function'){dialog.showModal();for(const view of comparisonViews)view.fit();}else status.textContent='Comparação em janela indisponível. Abra os dois modelos pelos links dos cartões.';
  });
  document.getElementById('close-compare').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{clearComparison();openCompare.focus();});

  addEventListener('storage',()=>{favorites=AlekSelection.load();update();});
  update();
})();
