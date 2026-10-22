/* Acesso: sugestões fixas; nenhuma consulta ou mensagem sai desta página. */
(() => {
 'use strict';
 const more=document.querySelector('.acesso-more');
 if(more){document.addEventListener('keydown',e=>{if(e.key==='Escape'&&more.open){more.open=false;more.querySelector('summary').focus();}});document.addEventListener('click',e=>{if(!more.contains(e.target))more.open=false;});}
 const form=document.querySelector('[data-acesso-search]'),host=document.querySelector('[data-acesso-autocomplete]');
 if(!form||!host||typeof window.accessibleAutocomplete!=='function')return;
 const pages=[['Início','index.html'],['Cuidados','cuidados.html'],['Prevenção e rotina','prevencao.html'],['Ortodontia','ortodontia.html'],['Cuidado na infância','infancia.html'],['A clínica','clinica.html'],['Primeira visita','primeira-visita.html'],['Dúvidas','duvidas.html'],['Contato','contato.html']];
 const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
 try{
  window.accessibleAutocomplete({element:host,id:'acesso-destino',name:'destino',autoselect:false,showAllValues:true,minLength:1,confirmOnBlur:false,
   source:(query,populate)=>populate(pages.map(p=>p[0]).filter(label=>normalize(label).includes(normalize(query)))),
   tNoResults:()=> 'Nenhuma página encontrada. Tente outro assunto.',
   tStatusQueryTooShort:()=> 'Digite um assunto para encontrar uma página.',tStatusNoResults:()=> 'Nenhuma página encontrada.',
   tStatusSelectedOption:(option,length,index)=>`${option}. Opção ${index+1} de ${length}.`,
   tStatusResults:(length,selected)=>`${length} ${length===1?'página disponível':'páginas disponíveis'}. ${selected||''}`,
   tAssistiveHint:()=> 'Use as setas para percorrer as opções e Enter para selecionar. Depois, use o botão Abrir página.',
   onConfirm:option=>{if(pages.some(p=>p[0]===option))form.querySelector('[data-acesso-status]').textContent=`${option} selecionada. Use Abrir página para continuar.`;}
  });
  const input=host.querySelector('input:not([aria-hidden="true"])');
  if(!input)return;input.maxLength=80;
  form.hidden=false;
  form.addEventListener('submit',event=>{event.preventDefault();const page=pages.find(p=>normalize(p[0])===normalize(input.value));if(!page){form.querySelector('[data-acesso-status]').textContent='Selecione uma das páginas sugeridas ou use os caminhos abaixo.';input.focus();return;}window.location.assign(page[1]);});
 }catch{form.hidden=true;host.replaceChildren();}
})();
