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
    menu.setAttribute('aria-expanded', String(open && collapsible));
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

  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
  const search = document.querySelector('[data-faq-search]');
  if (search) {
    search.closest('label').hidden = false;
    const entries = [...document.querySelectorAll('.faq-item')];
    const status = document.querySelector('[data-faq-status]');
    const empty = document.querySelector('[data-faq-empty]');
    search.addEventListener('input',()=>{
      const q = normalize(search.value.slice(0,100));
      let count = 0;
      for (const item of entries) { item.hidden = !normalize(`${item.dataset.faqTopic||''} ${item.textContent}`).includes(q); if (!item.hidden) count++; }
      status.textContent = `${count} ${count===1?'resposta encontrada':'respostas encontradas'}`;
      empty.hidden = count !== 0;
    });
  }
  for (const select of document.querySelectorAll('[data-location-filter]')) {
    select.closest('label').hidden = false;
    const group = select.closest('.locations');
    const cards = [...group.querySelectorAll('[data-location]')];
    select.addEventListener('change',()=>{
      const allowed = ['all','urbano','jardim'];
      const value = allowed.includes(select.value)?select.value:'all';
      let count = 0;
      for (const card of cards) { card.hidden = value!=='all' && card.dataset.location!==value; if(!card.hidden)count++; }
      group.querySelector('[data-location-status]').textContent = `${count} ${count===1?'ambiente ilustrativo':'ambientes ilustrativos'}`;
    });
  }

  const form = document.querySelector('[data-contact]');
  if (form) {
    const name = form.querySelector('[name=name]');
    const subject = form.querySelector('[name=subject]');
    const error = form.querySelector('[data-form-error]');
    const result = document.querySelector('[data-message-result]');
    const text = document.querySelector('[data-message-text]');
    form.querySelector('[type=submit]').hidden = false;
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const value = name.value.trim().slice(0,80);
      if (!value) { error.hidden=false; error.textContent='Preencha um nome de exemplo para visualizar a mensagem.'; name.setAttribute('aria-invalid','true'); name.focus(); return; }
      name.removeAttribute('aria-invalid'); error.hidden=true;
      const subjects=['Primeira visita','Áreas de cuidado','Localização e horários','Valores e condições'];
      const selected = subjects.includes(subject.value)?subject.value:subjects[0];
      // Dados da pessoa entram exclusivamente como texto. Não há requisição, envio ou persistência.
      text.textContent=`Olá! Meu nome é ${value}. Gostaria de conversar sobre ${selected.toLocaleLowerCase('pt-BR')}.`;
      result.hidden=false; result.focus();
    });
    document.querySelector('[data-clear-message]').addEventListener('click',()=>{
      form.reset(); text.textContent=''; result.hidden=true; error.hidden=true; name.removeAttribute('aria-invalid'); name.focus();
    });
  }

  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const hero = document.querySelector('.hero');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  let frame = 0;
  function updateScenes() {
    frame=0;
    if(hero){
      const box=hero.getBoundingClientRect();
      const progress=reduced.matches?0:Math.max(0,Math.min(1,-box.top/Math.max(1,box.height)));
      hero.style.setProperty('--hero-progress',progress.toFixed(4));
    }
    for(const scene of scenes) {
      const box=scene.getBoundingClientRect();
      const progress=reduced.matches?0:Math.max(0,Math.min(1,(innerHeight-box.top)/(innerHeight+box.height)));
      scene.style.setProperty('--scene-progress',progress.toFixed(4));
    }
  }
  function requestScene() { if(!frame) frame=requestAnimationFrame(updateScenes); }
  if(scenes.length||hero) {
    addEventListener('scroll',requestScene,{passive:true}); addEventListener('resize',requestScene);
    reduced.addEventListener('change',requestScene); requestScene();
  }
})();
