/* Uma única mídia decorativa; imagem estática permanece como alternativa. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero-centered');
  const video = hero?.querySelector('[data-hero-video]');
  const toggle = hero?.querySelector('[data-toggle-hero-video]');
  if (!hero || !video || !toggle) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 760px)');
  const connection = navigator.connection;
  let inView = true;
  let userPaused = false;
  let currentSource = '';
  let failedSource = '';

  video.muted = true;
  video.defaultMuted = true;
  function label() {
    toggle.textContent = userPaused ? 'Animar fundo' : 'Pausar fundo';
    toggle.setAttribute('aria-label', userPaused ? 'Retomar animação do fundo' : 'Pausar animação do fundo');
    toggle.setAttribute('aria-pressed', String(userPaused));
  }
  function sync() {
    if (reduced.matches || connection?.saveData) {
      video.pause();
      if (currentSource) {
        video.removeAttribute('src');
        video.load();
        currentSource = '';
      }
      hero.classList.remove('has-video-frame');
      toggle.hidden = true;
      return;
    }
    if (!inView || document.hidden) {
      video.pause();
      label();
      return;
    }
    const wanted = small.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
    if (userPaused) {
      video.pause();
      if (wanted !== currentSource && currentSource) {
        video.removeAttribute('src');
        video.load();
        currentSource = '';
        hero.classList.remove('has-video-frame');
      }
      toggle.hidden = false;
      label();
      return;
    }
    if (failedSource === wanted) return;
    if (wanted !== currentSource) {
      hero.classList.remove('has-video-frame');
      toggle.hidden = true;
      video.pause();
      video.src = wanted;
      video.poster = small.matches ? '/assets/images/hero-liquid-gold-mobile-v1.webp' : '/assets/images/hero-liquid-gold-v1.webp';
      currentSource = wanted;
      video.load();
    }
    const playback = video.play();
    playback?.catch(() => {
      hero.classList.remove('has-video-frame');
      toggle.hidden = true;
    });
    label();
  }
  video.addEventListener('playing', () => {
    hero.classList.add('has-video-frame');
    toggle.hidden = false;
    label();
  });
  video.addEventListener('error', () => {
    failedSource = currentSource;
    hero.classList.remove('has-video-frame');
    toggle.hidden = true;
  });
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    sync();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      sync();
    }, {threshold: .02}).observe(hero);
  }
  reduced.addEventListener('change', sync);
  small.addEventListener('change', sync);
  connection?.addEventListener?.('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', sync);
  sync();
})();
