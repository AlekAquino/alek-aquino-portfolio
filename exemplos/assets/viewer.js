'use strict';
(() => {
  const select=document.getElementById('viewer-model');
  const frame=document.getElementById('model-frame');
  const status=document.getElementById('viewer-status');
  const favorite=document.getElementById('viewer-favorite');
  let models=[];let current=null;
  function reflectFavorite() {
    const saved=AlekSelection.load();
    const chosen=!!current&&saved.ids.includes(current.id);
    favorite.setAttribute('aria-pressed',String(chosen));
    favorite.textContent=chosen?'♥ Favoritado':'♡ Favoritar';
    if(!saved.available)status.textContent='Favoritos indisponíveis neste navegador. A navegação continua disponível.';
  }
  function show(id,replace=false) {
    current=models.find(m=>m.id===id)||models[0];
    if(!current)return;
    select.value=current.id;
    const path=`${current.path}/index.html`;
    const publicPath=new URL(current.path.split('/').pop()+'/index.html',ALEK_CATALOG_DATA.company.examples_base_url);
    frame.src=ALEK_CATALOG_DATA.company.gallery_published?publicPath.pathname:path;frame.title=`Prévia do modelo ${current.name}`;
    document.getElementById('open-full').href=new URL(current.path.split('/').pop()+'/index.html',ALEK_CATALOG_DATA.company.examples_base_url).href;
    document.getElementById('viewer-name').textContent=current.name;
    document.getElementById('viewer-code').textContent=`Modelo ${current.id} / Odontologia`;
    AlekContact.setLink(document.getElementById('viewer-contact'),[current.id]);
    document.getElementById('viewer-contact').setAttribute('aria-label',`Encaminhar pelo WhatsApp a escolha do modelo ${current.id} ${current.name}`);
    document.getElementById('viewer-concept').textContent=current.concept;
    document.getElementById('viewer-motion').textContent=current.motion;
    document.title=`Modelo ${current.id} · ${current.name} | Alek`;
    if(replace){const url=new URL(location.href);url.searchParams.set('modelo',current.id);history.replaceState(null,'',url.pathname+url.search);}
    reflectFavorite();
    favorite.hidden=false;
  }
  select.addEventListener('change',()=>show(select.value,true));
  favorite.addEventListener('click',()=>{if(current){AlekSelection.toggle(current.id);reflectFavorite();}});
  for(const button of document.querySelectorAll('[data-device]'))button.addEventListener('click',()=>{
    const mobile=button.dataset.device==='mobile';
    document.getElementById('viewer-stage').className=`viewer-stage device-${mobile?'mobile':'desktop'}`;
    for(const b of document.querySelectorAll('[data-device]'))b.setAttribute('aria-pressed',String(b===button));
  });
  function load(data){
    if(!Array.isArray(data))throw new Error('shape');
    models=data.filter(m=>typeof m.id==='string'&&/^(0[1-9]|1[0-9]|2[01])$/.test(m.id)&&typeof m.path==='string'&&/^modelos\/(0[1-9]|1[0-9]|2[01])-[a-z]+$/.test(m.path));
    if(models.length!==21)throw new Error('incomplete');
    const requested=new URLSearchParams(location.search).get('modelo');
    if(requested&&!models.some(m=>m.id===requested))status.textContent='Modelo não encontrado. Exibindo a primeira opção da coleção.';
    show(requested||'01');
  }
  try{load(ALEK_CATALOG_DATA.models);}catch{status.textContent='Não foi possível carregar o seletor. Volte à galeria e use “Abrir site atual” no cartão escolhido.';select.disabled=true;favorite.disabled=true;}
  addEventListener('storage',reflectFavorite);
})();
