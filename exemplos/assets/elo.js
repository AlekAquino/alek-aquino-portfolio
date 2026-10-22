/* Galeria manual: sem autoplay, dados remotos ou conteúdo HTML recebido. */
(() => {
  'use strict';
  const root = document.querySelector('[data-elo-gallery]');
  if (!root || typeof window.Splide !== 'function') return;
  let carousel;
  function mount() {
    if (carousel) return;
    carousel = new window.Splide(root, {
      type: 'slide', rewind: false, autoplay: false, perPage: 2,
      perMove: 1, gap: 28, speed: 400, pagination: true,
      keyboard: 'focused', live: true, drag: true,
      breakpoints: { 800: { perPage: 1, gap: 20 } },
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: false },
      i18n: {
        prev: 'Imagem anterior', next: 'Próxima imagem', first: 'Primeira imagem',
        last: 'Última imagem', slideX: 'Ir para a imagem %s', pageX: 'Ir para o grupo %s',
        slideLabel: '%s de %s', carousel: 'galeria', slide: 'imagem',
        select: 'Selecione uma imagem para mostrar', play: 'Iniciar', pause: 'Pausar'
      }
    });
    carousel.on('pagination:mounted', data => {
      data.items.forEach((item, index) => { item.button.textContent = String(index + 1); });
    });
    try { carousel.mount(); } catch { carousel.destroy(true); carousel = null; }
  }
  addEventListener('pagehide', () => { if (carousel) carousel.destroy(true); carousel = null; });
  addEventListener('pageshow', event => { if (event.persisted) mount(); });
  mount();
})();
