const root=document.querySelector('[data-acervo-search]');
if(root){
 const form=root.querySelector('form'),input=form.querySelector('input'),list=root.querySelector('[data-acervo-results]'),status=root.querySelector('[role=status]');
 const fallback=[['prevencao.html','Prevenção e rotina'],['ortodontia.html','Ortodontia'],['infancia.html','Cuidado na infância'],['primeira-visita.html','Primeira visita']];
 const allowed=new Set(['index.html','cuidados.html','prevencao.html','ortodontia.html','infancia.html','clinica.html','primeira-visita.html','duvidas.html','contato.html']);
 let modulePromise,timer,sequence=0;
 const start=()=>modulePromise||=(async()=>{const api=await import('./acervo/pagefind/pagefind.js');await api.options({noWorker:true,baseUrl:new URL('../odontologia/14-acervo/',import.meta.url).pathname,bundlePath:new URL('./acervo/pagefind/',import.meta.url).pathname});return api;})();
 const append=(url,title,excerpt)=>{const li=document.createElement('li'),link=document.createElement('a'),heading=document.createElement('strong');link.href=url;heading.textContent=title;link.append(heading);if(excerpt){const text=document.createElement('p');text.textContent=excerpt;link.append(text);}li.append(link);list.append(li);};
 const defaults=message=>{list.replaceChildren();list.classList.remove('is-results');for(const [url,title] of fallback)append(url,title);status.textContent=message;};
 const search=async()=>{
  clearTimeout(timer);const current=++sequence,query=input.value.trim().slice(0,100);
  if(!query){defaults('Comece por um destes assuntos.');return;}
  status.textContent='Pesquisando no caderno…';
  try{
   const api=await start(),result=await api.search(query),data=await Promise.all(result.results.slice(0,9).map(r=>r.data()));
   if(current!==sequence)return;
   list.replaceChildren();list.classList.add('is-results');let count=0;
   for(const item of data){const url=new URL(item.url,location.href);if(url.origin!==location.origin||!url.pathname.startsWith('/exemplos/odontologia/14-acervo/')||!allowed.has(url.pathname.split('/').pop()))continue;append(url.pathname+url.hash,item.meta.title||'Ler assunto',item.plain_excerpt||'');count++;}
   if(!count){defaults('Nenhum assunto encontrado. Tente avaliação, infância ou alinhamento, ou use os caminhos abaixo.');return;}
   status.textContent=`${count} ${count===1?'página encontrada':'páginas encontradas'}.`;
  }catch{if(current!==sequence)return;modulePromise=null;defaults('A busca está indisponível agora. Continue pelos assuntos abaixo.');}
 };
 form.hidden=false;
 form.addEventListener('submit',ev=>{ev.preventDefault();search();});
 input.addEventListener('input',()=>{clearTimeout(timer);sequence++;timer=setTimeout(search,200);});
 addEventListener('pagehide',()=>{clearTimeout(timer);sequence++;});
}
