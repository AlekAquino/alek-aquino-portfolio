import Fuse from './vendor/fuse/fuse.basic.js';

// Dados editoriais fixos: não recebe HTML, URLs externas ou conteúdo de terceiros.
const pages = [
  {url:'index.html',title:'Início',description:'Conheça a Conecta Odontologia e os caminhos para começar.',terms:'home apresentação'},
  {url:'cuidados.html',title:'Áreas de cuidado',description:'Prevenção, ortodontia e cuidado na infância.',terms:'serviços tratamentos especialidades'},
  {url:'prevencao.html',title:'Prevenção e rotina',description:'Conheça os assuntos de um acompanhamento individual.',terms:'higiene limpeza rotina cuidados avaliação'},
  {url:'ortodontia.html',title:'Ortodontia',description:'Alinhamento, função e possibilidades para conversar.',terms:'aparelho alinhador alinhamento mordida dentes'},
  {url:'infancia.html',title:'Cuidado na infância',description:'Preparação, adaptação e participação da família.',terms:'criança infantil odontopediatria bebê filhos responsáveis'},
  {url:'clinica.html',title:'A clínica',description:'Explore a proposta de espaço e acolhimento.',terms:'ambiente equipe espaço conhecer'},
  {url:'primeira-visita.html',title:'Primeira visita',description:'Entenda como começa a conversa e prepare suas perguntas.',terms:'consulta encontro avaliação começar agendar'},
  {url:'duvidas.html',title:'Dúvidas',description:'Primeiro encontro, valores, condições e orientações de contato.',terms:'perguntas FAQ preço custo valor pagamento horário endereço'},
  {url:'contato.html',title:'Contato',description:'Informações a confirmar com a clínica e prévia local de mensagem.',terms:'telefone localização endereço horários falar conversa'}
];
const allowed = new Set(pages.map(page => page.url));
const index = new Fuse(pages, {
  keys: [{name:'title',weight:3},{name:'terms',weight:2},{name:'description',weight:1}],
  threshold:0.32, ignoreLocation:true, ignoreDiacritics:true, minMatchCharLength:2
});
for (const group of document.querySelectorAll('[data-site-search]')) {
  const input = group.querySelector('[data-search-query]');
  const clear = group.querySelector('[data-search-clear]');
  const list = group.querySelector('[data-search-results]');
  const status = group.querySelector('[data-search-status]');
  group.querySelector('[data-search-controls]').hidden = false;
  function render() {
    const query = input.value.trim().slice(0,100);
    const found = query ? index.search(query,{limit:9}).map(result=>result.item) : [pages[1],pages[6],pages[7],pages[8]];
    list.replaceChildren();
    for (const page of found) {
      if (!allowed.has(page.url)) continue;
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      const title = document.createElement('strong');
      const description = document.createElement('span');
      anchor.setAttribute('href',page.url);
      title.textContent = page.title;
      description.textContent = page.description;
      anchor.append(title,description); item.append(anchor); list.append(item);
    }
    status.textContent = !query ? 'Caminhos para começar' : found.length ? `${found.length} ${found.length===1?'página encontrada':'páginas encontradas'}` : 'Nenhuma página encontrada. Tente “primeira visita”, “criança” ou “alinhamento”.';
    clear.hidden = query.length===0;
  }
  input.addEventListener('input',render);
  clear.addEventListener('click',()=>{input.value='';render();input.focus();});
  input.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown' && list.querySelector('a')){event.preventDefault();list.querySelector('a').focus();}
  });
  list.addEventListener('keydown',event=>{
    if(event.key==='ArrowUp' && document.activeElement===list.querySelector('a')){event.preventDefault();input.focus();}
  });
  render();
}
const dialog = document.querySelector('#conecta-search-dialog');
const trigger = document.querySelector('[data-search-open]');
if (dialog && trigger && typeof dialog.showModal==='function') {
  trigger.hidden = false;
  trigger.addEventListener('click',()=>{dialog.showModal();dialog.querySelector('input').focus();});
  dialog.querySelector('[data-search-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const stops=[...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href]')].filter(element=>element.getClientRects().length&&!element.closest('[hidden]'));
    const first=stops[0],last=stops[stops.length-1];
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  dialog.addEventListener('close',()=>trigger.focus());
  addEventListener('pagehide',()=>{if(dialog.open)dialog.close();});
}
