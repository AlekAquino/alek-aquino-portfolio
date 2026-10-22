/* Fotografia contextual. O texto e a rolagem não dependem da biblioteca. */
(() => {
  'use strict';
  const story = document.querySelector('[data-flow-story]');
  if (!story) return;
  const steps = [...story.querySelectorAll('[data-flow-step]')];
  const photos = [...story.querySelectorAll('[data-flow-photo]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 1000px), (max-height: 560px)');
  let observer;
  function choose(index) {
    photos.forEach((photo, i) => { photo.hidden = i !== index; });
    story.dataset.flowActive = String(index);
  }
  function stop() {
    if (observer) observer.destroy();
    observer = null;
    delete story.dataset.flowReady;
    delete story.dataset.flowActive;
    photos.forEach(photo => { photo.hidden = false; });
  }
  function start() {
    stop();
    if (reduced.matches || compact.matches || !('IntersectionObserver' in window) || typeof window.scrollama !== 'function') return;
    try {
      story.dataset.flowReady = 'true';
      choose(0);
      observer = window.scrollama();
      observer.setup({ step: steps, offset: 0.5, progress: false, debug: false })
        .onStepEnter(({ index }) => choose(index));
    } catch { stop(); }
  }
  reduced.addEventListener('change', start);
  compact.addEventListener('change', start);
  addEventListener('pagehide', stop);
  addEventListener('pageshow', event => { if (event.persisted) start(); });
  start();
})();
