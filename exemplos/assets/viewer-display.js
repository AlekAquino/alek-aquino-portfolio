'use strict';
(() => {
  const stage=document.getElementById('viewer-stage');
  const canvas=document.getElementById('viewer-canvas');
  const frame=document.getElementById('model-frame');
  const status=document.getElementById('viewer-status');
  if(!stage||!canvas||!frame)return;
  document.body.classList.add('viewer-page');
  let geometry='';
  function fit(){
    const mobile=stage.classList.contains('device-mobile');
    const width=mobile?390:1440,height=mobile?844:900;
    const style=getComputedStyle(stage);
    const available=Math.max(1,stage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight));
    const key=available+'/'+width;
    if(key===geometry)return;
    geometry=key;
    const scale=Math.min(1,available/width);
    canvas.style.width=(width*scale)+'px';canvas.style.height=(height*scale)+'px';
    frame.style.width=width+'px';frame.style.height=height+'px';frame.style.transform='scale('+scale+')';
    stage.dataset.previewWidth=String(width);
  }
  function reflect(){
    fit();
    if(!status.textContent.startsWith('Favoritos indisponíveis'))status.textContent='Prévia '+(stage.classList.contains('device-mobile')?'de celular · 390 × 844 px.':'de desktop · 1440 × 900 px. A moldura reduz a escala para caber na tela.');
  }
  for(const button of document.querySelectorAll('[data-device]'))button.addEventListener('click',()=>{
    reflect();const url=new URL(location.href);url.searchParams.set('modo',button.dataset.device);history.replaceState(null,'',url.pathname+url.search);
  });
  const requested=new URLSearchParams(location.search).get('modo');
  if(requested==='mobile'||(!requested&&matchMedia('(max-width:600px)').matches))document.querySelector('[data-device=mobile]').click();
  if('ResizeObserver' in window)new ResizeObserver(fit).observe(stage);else addEventListener('resize',fit);
  frame.addEventListener('load',()=>{
    try{
      const selected=document.getElementById('viewer-model').value;
      const url=new URL(frame.contentWindow.location.href);
      const model=ALEK_CATALOG_DATA.models.find(item=>item.id===selected);
      const prefix=model?(ALEK_CATALOG_DATA.company.gallery_published
        ?new URL(model.path.split('/').pop()+'/',ALEK_CATALOG_DATA.company.examples_base_url).pathname
        :new URL(model.path+'/',document.baseURI).pathname):'';
      const page=url.pathname.split('/').pop();
      if(model&&url.origin===location.origin&&url.pathname.startsWith(prefix)&&/^(index|cuidados|prevencao|ortodontia|infancia|clinica|primeira-visita|duvidas|contato)\.html$/.test(page)){
        document.getElementById('open-full').href=new URL(model.path.split('/').pop()+'/'+page,ALEK_CATALOG_DATA.company.examples_base_url).href;
      }
    }catch{/* O link direto do modelo continua disponível. */}
    reflect();
  });
  reflect();
})();
