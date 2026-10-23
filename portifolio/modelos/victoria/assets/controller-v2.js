'use strict';
(() => {
  document.body.classList.add('js-ready');
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const mobile = matchMedia('(max-width:1000px)');
  const expandedNavigation = header && header.dataset.navigation === 'overlay';
  let open = false;
  function renderMenu() {
    if (!menu || !nav) return;
    const collapsible = mobile.matches || expandedNavigation;
    menu.hidden = !collapsible;
    nav.hidden = collapsible && !open;
    menu.setAttribute('aria-expanded', String(open && collapsible));menu.setAttribute('aria-label',open&&collapsible?'Fechar menu':'Abrir menu');
    header.classList.toggle('is-open', open && collapsible);
    const label=menu.querySelector('[data-menu-label]');
    if(label)label.textContent=header.dataset.modelHeader==='01'?(open&&collapsible?'Fechar':'Menu'):(open&&collapsible?'Fechar menu':'Abrir menu');
  }
  if (menu && nav) {
    menu.addEventListener('click', () => { open = !open; renderMenu(); });
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' && open) { open = false; renderMenu(); menu.focus(); }
    });
    document.addEventListener('click', ev => {
      if (open && !header.contains(ev.target)) { open = false; renderMenu(); }
    });
    nav.addEventListener('click',ev=>{if(ev.target.closest('a')){open=false;renderMenu();}});
    document.addEventListener('click',ev=>{
      for(const group of nav.querySelectorAll('details[open]'))if(!group.contains(ev.target))group.open=false;
    });
    for(const group of nav.querySelectorAll('details')) {
      group.addEventListener('toggle',()=>{if(group.open)for(const other of nav.querySelectorAll('details'))if(other!==group)other.open=false;});
      group.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&group.open){ev.stopPropagation();group.open=false;group.querySelector('summary').focus();}});
    }
    mobile.addEventListener('change', () => { open = false; renderMenu(); });
    renderMenu();
  }

  for (const group of document.querySelectorAll('[data-tabs]')) {
    const bar = group.querySelector('[role=tablist]');
    const tabs = [...group.querySelectorAll('[role=tab]')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    if (!bar || panels.some(p => !p)) continue;
    bar.hidden = false;
    group.classList.add('is-tabs');
    function choose(index, focus = false) {
      tabs.forEach((tab,i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
        panels[i].setAttribute('role','tabpanel');
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab,i) => {
      tab.addEventListener('click', () => choose(i));
      tab.addEventListener('keydown', ev => {
        let next;
        const vertical=bar.getAttribute('aria-orientation')==='vertical';
        if (ev.key === (vertical?'ArrowDown':'ArrowRight')) next = (i+1)%tabs.length;
        if (ev.key === (vertical?'ArrowUp':'ArrowLeft')) next = (i+tabs.length-1)%tabs.length;
        if (ev.key === 'Home') next = 0;
        if (ev.key === 'End') next = tabs.length-1;
        if (next !== undefined) { ev.preventDefault(); choose(next,true); }
      });
    });
    choose(0);
  }

  for (const gallery of document.querySelectorAll('[data-gallery]')) {
    const slides = [...gallery.querySelectorAll('[data-slide]')];
    const prev = gallery.querySelector('[data-prev]');
    const next = gallery.querySelector('[data-next]');
    const status = gallery.querySelector('[data-gallery-status]');
    let index = 0;
    gallery.classList.add('is-gallery');
    gallery.querySelector('.gallery-controls').hidden = false;
    function show(value) {
      index = Math.max(0, Math.min(slides.length-1,value));
      slides.forEach((slide,i) => { slide.hidden = i !== index; });
      prev.disabled = index === 0; next.disabled = index === slides.length-1;
      status.textContent = `Imagem ${index+1} de ${slides.length}`;
    }
    prev.addEventListener('click',()=>show(index-1));
    next.addEventListener('click',()=>show(index+1));
    gallery.addEventListener('keydown',ev=>{
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
        ev.preventDefault(); show(index+(ev.key === 'ArrowRight'?1:-1));
      }
    });
    show(0);
  }

  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const desktop=matchMedia('(min-width:801px)');
  const hero=document.querySelector('.hero');let queued=false;
  function motionUpdate(){const p=hero&&!reduced.matches&&desktop.matches?Math.max(0,Math.min(1,scrollY/700)):0;if(hero)hero.style.setProperty('--float',p);queued=false;}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(motionUpdate)}},{passive:true});reduced.addEventListener('change',motionUpdate);desktop.addEventListener('change',motionUpdate);motionUpdate();
  const topic=document.querySelector('#assunto');
  if(topic){const messages={consulta:'Olá! Gostaria de informações para marcar uma consulta com a Dra. Victória Vieira em Tramandaí.',estetica:'Olá! Gostaria de informações sobre avaliação para cuidados estéticos e clareamento.',ortodontia:'Olá! Gostaria de informações sobre avaliação para ortodontia.',endodontia:'Olá! Gostaria de informações sobre avaliação para tratamento de canal.'};const preview=document.querySelector('[data-message]');const link=document.querySelector('[data-whatsapp]');function update(){const text=messages[topic.value]||messages.consulta;preview.textContent=text;link.href='https://wa.me/5551992354527?text='+encodeURIComponent(text)}topic.addEventListener('change',update);update()}
})();
