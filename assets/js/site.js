/* Melhorias progressivas. Conteúdo, links, FAQ e mídias existem sem este script. */
(() => {
  'use strict';
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');

  function closeMenu(returnFocus = false) {
    header.removeAttribute('data-menu-open');
    header.querySelectorAll('.nav-dropdown[open]').forEach(dropdown => { dropdown.open = false; });
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.menu-label').textContent = 'Menu';
    menuButton.setAttribute('aria-label', 'Abrir menu');
    if (returnFocus) menuButton.focus();
  }
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    if (open) { closeMenu(); return; }
    header.setAttribute('data-menu-open', '');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fechar menu');
    menuButton.querySelector('.menu-label').textContent = 'Fechar';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const dropdown = header.querySelector('.nav-dropdown[open]');
    if (dropdown) { dropdown.open = false; dropdown.querySelector('summary').focus(); return; }
    if (header.hasAttribute('data-menu-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());
  // Somente esconder o menu móvel depois de seus controles estarem prontos.
  body.setAttribute('data-enhanced', '');

  const controls = document.querySelector('.portfolio-controls');
  if (controls) {
    const buttons = [...controls.querySelectorAll('[data-filter]')];
    const search = controls.querySelector('input');
    const cards = [...document.querySelectorAll('[data-project]')];
    const status = document.querySelector('.results-count');
    const empty = document.querySelector('.empty-state');
    const normal = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const parameters = new URLSearchParams(window.location.search);
    const allowed = new Set(buttons.map(button => button.dataset.filter));
    let area = allowed.has(parameters.get('area')) ? parameters.get('area') : 'todos';
    search.value = (parameters.get('busca') || '').slice(0, 80);
    function applyFilters(updateUrl = true) {
      search.value = search.value.slice(0, 80);
      const query = normal(search.value.trim());
      let count = 0;
      cards.forEach(card => {
        const categoryMatches = area === 'todos' || card.dataset.categories.split(' ').includes(area);
        const contentMatches = normal(card.textContent).includes(query);
        card.hidden = !(categoryMatches && contentMatches);
        if (!card.hidden) count++;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === area)));
      status.textContent = `${count} ${count === 1 ? 'projeto encontrado' : 'projetos encontrados'}`;
      empty.hidden = count !== 0;
      if (updateUrl) {
        const url = new URL(window.location.href);
        if (area !== 'todos') url.searchParams.set('area', area); else url.searchParams.delete('area');
        if (search.value.trim()) url.searchParams.set('busca', search.value.trim()); else url.searchParams.delete('busca');
        history.replaceState(null, '', url);
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => { area = button.dataset.filter; applyFilters(); }));
    search.addEventListener('input', () => applyFilters());
    document.querySelector('[data-reset-filters]').addEventListener('click', () => {
      area = 'todos'; search.value = ''; applyFilters(); search.focus();
    });
    controls.hidden = false;
    applyFilters(false);
    window.addEventListener('pageshow', () => applyFilters(false));
  }

  const dialog = document.querySelector('.lightbox');
  const imageLinks = [...document.querySelectorAll('[data-gallery]')];
  let imageIndex = 0;
  let opener = null;
  if (dialog && typeof dialog.showModal === 'function' && imageLinks.length) {
    const image = dialog.querySelector('.lightbox-image');
    const caption = dialog.querySelector('figcaption');
    const counter = dialog.querySelector('[data-image-counter]');
    const prev = dialog.querySelector('[data-prev-image]');
    const next = dialog.querySelector('[data-next-image]');
    function showImage(index) {
      imageIndex = index;
      const link = imageLinks[index];
      image.src = link.href;
      image.alt = link.dataset.caption;
      caption.textContent = link.dataset.caption;
      counter.textContent = `${index + 1} de ${imageLinks.length}`;
      prev.disabled = index === 0;
      next.disabled = index === imageLinks.length - 1;
    }
    imageLinks.forEach((link, index) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); opener = link; showImage(index); dialog.showModal();
    }));
    prev.addEventListener('click', () => showImage(Math.max(0, imageIndex - 1)));
    next.addEventListener('click', () => showImage(Math.min(imageLinks.length - 1, imageIndex + 1)));
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { image.removeAttribute('src'); if (opener) opener.focus(); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' && imageIndex > 0) { event.preventDefault(); showImage(imageIndex - 1); }
      if (event.key === 'ArrowRight' && imageIndex < imageLinks.length - 1) { event.preventDefault(); showImage(imageIndex + 1); }
    });
  }

  const form = document.querySelector('[data-brief-form]');
  if (form) {
    form.hidden = false;
    const result = form.querySelector('.brief-result');
    const allowedAreas = new Set([...form.querySelectorAll('select[name="area"] option')].map(option => option.value));
    const messageField = form.querySelector('[name="mensagem"]');
    form.addEventListener('input', () => { result.hidden = true; });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const idea = String(data.get('mensagem') || '').trim().slice(0, 1200);
      if (!idea) { messageField.setCustomValidity('Conte um pouco sobre o projeto.'); messageField.reportValidity(); return; }
      const area = allowedAreas.has(data.get('area')) ? data.get('area') : 'Ainda quero entender as possibilidades';
      const message = `Olá, Alek! Quero conversar sobre um projeto.\n\nÁrea: ${area}\nMinha ideia: ${idea}`;
      const link = form.querySelector('[data-brief-link]');
      link.href = `https://wa.me/5548991155774?text=${encodeURIComponent(message)}`;
      result.hidden = false;
      link.focus();
    });
    messageField.addEventListener('input', () => messageField.setCustomValidity(''));
  }

  // Uma mídia iniciada pelo visitante interrompe outras da mesma página.
  const videos = [...document.querySelectorAll('video')];
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));

  // Uma abertura coordenada, em vez de repetir fade-up em todos os blocos.
  const animated = new Set();
  const hero = document.querySelector('[data-hero-scene]');
  if (!reduced.matches && Element.prototype.animate) {
    const launch = (element, frames, duration, delay = 0) => {
      if (!element) return;
      const animation = element.animate(frames, {duration, delay, easing: 'cubic-bezier(.22,1,.36,1)'});
      animated.add(animation);
      animation.onfinish = () => animated.delete(animation);
    };
    if (hero) {
      hero.querySelectorAll('.headline-line').forEach((line, index) => launch(line, [
        {transform:'translateY(22px)',opacity:.25}, {transform:'translateY(0)',opacity:1}
      ], 850, index * 100));
      const heroMark = hero.querySelector('.hero-photo');
      if (hero.classList.contains('hero-centered')) {
        const markOpacity = heroMark ? Number.parseFloat(getComputedStyle(heroMark).opacity) : 0;
        launch(heroMark, [{opacity:markOpacity * .5}, {opacity:markOpacity}], 1100);
      } else {
        launch(heroMark, [
          {opacity:.45, transform:'translateX(20px) scale(1.025)'}, {opacity:1, transform:'translateX(0) scale(1.025)'}
        ], 1100);
      }
      launch(hero.querySelector('.actions'), [{opacity:.55}, {opacity:1}], 750, 200);
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reduced.matches) return;
        launch(entry.target, [
          {clipPath:'inset(6% 0 0 0)',transform:'translateY(12px)'},
          {clipPath:'inset(0% 0 0 0)',transform:'translateY(0)'}
        ], 850);
      }), {threshold:.12});
      document.querySelectorAll('.project-cover').forEach(element => observer.observe(element));
    }
  }
  const scene = document.querySelector('[data-scroll-scene]');
  let scheduled = false;
  let sceneProgress = null;
  let sceneStage = -1;
  let sceneNear = true;
  if (scene && 'IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver(entries => {
      sceneNear = entries[0].isIntersecting;
      scene.toggleAttribute('data-motion-near', sceneNear && !reduced.matches);
      if (sceneNear) scheduleScroll();
    }, { rootMargin: '180px' });
    sceneObserver.observe(scene);
  }
  function updateScroll() {
    scheduled = false;
    // Agrupar leituras antes de escrever estilos evita forcar layout repetidamente.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const heroRect = hero && !reduced.matches && !mobile.matches ? hero.getBoundingClientRect() : null;
    const rect = scene && sceneNear && !reduced.matches ? scene.getBoundingClientRect() : null;
    const reading = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    header.style.setProperty('--reading', String(reading));
    if (heroRect && heroRect.bottom > 0) hero.style.setProperty('--hero-scroll', String(Math.max(0, Math.min(1, -heroRect.top / heroRect.height))));
    if (!rect) return;
    const clamp = value => Math.min(1, Math.max(0, value));
    const target = mobile.matches
      ? clamp((window.innerHeight * .65 - rect.top) / (rect.height + window.innerHeight * .3))
      : clamp((88 - rect.top) / Math.max(1, rect.height - (window.innerHeight - 88)));
    if (sceneProgress === null) sceneProgress = target;
    const delta = target - sceneProgress;
    sceneProgress = Math.abs(delta) < .0004 ? target : sceneProgress + delta * .22;
    scene.style.setProperty('--scene', sceneProgress.toFixed(4));
    scene.style.setProperty('--scene-mid', clamp((sceneProgress - .1) / .26).toFixed(4));
    scene.style.setProperty('--scene-end', clamp((sceneProgress - .58) / .25).toFixed(4));
    const stage = Math.min(2, Math.floor(sceneProgress * 3));
    if (stage !== sceneStage) {
      sceneStage = stage;
      scene.querySelectorAll('[data-scene-stage]').forEach((item, index) => item.toggleAttribute('data-active', index === stage));
    }
    if (Math.abs(target - sceneProgress) > .0004) scheduleScroll();
  }
  function scheduleScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      animated.forEach(animation => animation.finish());
      if (scene) {
        ['--scene', '--scene-mid', '--scene-end'].forEach(name => scene.style.removeProperty(name));
        scene.querySelectorAll('[data-scene-stage]').forEach(item => item.removeAttribute('data-active'));
      }
      if (hero) hero.style.removeProperty('--hero-scroll');
      if (scene) scene.removeAttribute('data-motion-near');
      sceneProgress = null; sceneStage = -1;
    }
    scheduleScroll();
  });
  scheduleScroll();
})();
