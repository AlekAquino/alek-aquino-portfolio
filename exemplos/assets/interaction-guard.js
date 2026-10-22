/* Desestímulo a atalhos de inspeção, solicitado pelo responsável.
   Não bloqueia DevTools do navegador nem protege código ou assets públicos. */
(() => {
  'use strict';
  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    const inspect = event.key === 'F12'
      || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key))
      || (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key));
    if (inspect) event.preventDefault();
  });
  // Limites de usabilidade no navegador. Um futuro backend deve validar de novo.
  document.querySelectorAll('input[type="search"], textarea').forEach(field => {
    const limit = field.maxLength > 0 ? Math.min(field.maxLength, 1200)
      : field.tagName === 'TEXTAREA' ? 1200 : 100;
    field.maxLength = limit;
    field.addEventListener('input', () => {
      if (field.value.length > limit) field.value = field.value.slice(0, limit);
    });
  });
})();
