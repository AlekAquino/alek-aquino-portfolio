import { createLiquidGlass } from '../vendor/liquid-glass/liquid-glass.js';

// Codigo MIT fixado no commit documentado em evidencias/liquid-glass-origem.json.
// Mantem links/botoes nativos, sem mover texto ou trocar a ordem de foco.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const instances = [];
const register = (element, options) => {
  try {
    // Vidro CSS evita recapturar o fundo por deslocamento SVG durante a rolagem.
    const pointer = options.pointer !== false;
    const instance = createLiquidGlass(element, { ...options, pointer: pointer && !reduced.matches, mode: 'css' });
    instances.push({instance, pointer});
    return instance;
  } catch (error) {
    // A alternativa CSS ja esta aplicada: um efeito nao pode quebrar navegacao.
    console.warn('A superfície de vidro está usando a alternativa CSS.', error);
  }
};

document.querySelectorAll('.main-nav').forEach(element => {
  register(element, { radius: 32, refraction: 0, blur: 7, light: 40, resolution: .65 });
});
document.querySelectorAll('.portfolio-dropdown').forEach(element => register(element, {
  radius: 22, refraction: 14, blur: 14, light: 25, resolution: .5, mode: 'css'
}));
document.querySelectorAll('.button,.menu-toggle,.header-contact,.project-quickplay,.cover-action,.image-enlarge,.icon-button,.filter-list button,.text-link,.next-project a').forEach(element => register(element, {
  shape: 'pill', refraction: 0, blur: 4, light: 45, resolution: .75
}));
document.querySelectorAll('.process-list li').forEach(element => register(element, {
  radius: 28, refraction: 0, blur: 6, light: 26, resolution: .5
}));
document.querySelectorAll('.service-item').forEach(element => register(element, {
  radius: 26, refraction: 0, blur: 0, light: 16, pointer: false
}));
document.querySelectorAll('.faq summary').forEach(element => register(element, {
  radius: 22, refraction: 0, blur: 3, light: 22
}));
reduced.addEventListener('change', () => instances.forEach(({instance,pointer}) => instance.update({ pointer: pointer && !reduced.matches })));
window.addEventListener('pagehide', event => {
  if (!event.persisted) instances.forEach(({instance}) => instance.destroy());
});
