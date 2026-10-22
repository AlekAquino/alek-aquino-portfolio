# Alek Aquino — Soluções Digitais

Site oficial: https://alekaquinosolucoesdigitais.com/

HTML, CSS e JavaScript nativos, sem build obrigatório. A raiz da branch `main`
é publicada pelo GitHub Pages no domínio já configurado em `CNAME`.
Preservar `CNAME` e `.nojekyll`. Fazer alterações em uma branch, revisar o diff
e integrar à `main`; conferir o job `pages-build-deployment` e o domínio público.

## Organização

- `index.html`: apresentação e seleção de trabalhos.
- `portfolio/`, `projetos/`: acervo filtrável e páginas de cada projeto.
- `servicos/`, `sobre/`, `contato/`, `privacidade/`: páginas institucionais.
- `assets/css/components-glass.css`: materiais e componentes compartilhados.
- `assets/css/hero.css`, `assets/js/hero-video.js`: abertura e vídeo decorativo.
- `assets/js/site.js`, `glass.js`: navegação, filtros, galeria e interações.
- `favicon.ico`, ícones PNG e `site.webmanifest`: identidade no navegador.
- `robots.txt`, `sitemap.xml`: rastreamento permitido; não comprovam indexação.

Para visualizar, executar `python -m http.server 8780 --bind 127.0.0.1` nesta pasta
e abrir http://127.0.0.1:8780/. Evitar abrir HTML por file://, pois os caminhos
são relativos à raiz do domínio e há um módulo JavaScript local.

Somente Hair Tempple tem site publicado confirmado. Os demais casos indicam sua
condição de demonstração ou peça do portfólio. A galeria em `/portfolio/modelos/` apresenta os 21 modelos odontológicos. Os exemplos em
`/exemplos/odontologia/` abrem em nova guia. A escolha segue pelo WhatsApp, sem
compra ou download. As demonstrações preservam noindex e dados fictícios.

Não há Analytics, Ads, pixel, backend de formulário ou envio automático. O contato
prepara uma mensagem para revisão no WhatsApp. Não incluir credenciais no site.
GitHub Pages mantém HTTPS; os HTML incluem CSP por meta. Headers adicionais
dependem do provedor e não são configurados por arquivos `_headers` neste host.

Vidro: biblioteca MIT local em `assets/vendor/liquid-glass/`, renderizador CSS.
Vídeos decorativos têm poster, pausa e alternativa com movimento reduzido.
Licença da biblioteca em sua pasta; não implica licença para reutilizar marcas,
fotografias ou peças dos clientes fora deste portfólio.

## Recuperação

Versão anterior à reformulação: commit `8fc889dad79e0b05164834233f56d9bfcbc86860`.
Restaurar por um novo commit de reversão após conferir o escopo, sem force push.

WhatsApp: https://wa.me/5548991155774 · Instagram: https://www.instagram.com/alek.aquino/
