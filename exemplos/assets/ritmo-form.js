const form=document.querySelector('[data-ritmo-form]');
if(form)(async()=>{
 const name=form.querySelector('[name=name]'),subject=form.querySelector('[name=subject]');
 const error=document.querySelector('#ritmo-name-error'),result=document.querySelector('[data-ritmo-result]');
 const text=document.querySelector('[data-ritmo-text]');
 const subjects=['Primeira visita','Áreas de cuidado','Localização e horários','Valores e condições'];
 const check=()=>name.value.trim().length>=2;
 const show=()=>{
  if(!check())return;
  const selected=subjects.includes(subject.value)?subject.value:subjects[0];
  text.textContent=`Olá! Pode me chamar de ${name.value.trim().slice(0,80)}. Quero conversar sobre ${selected.toLocaleLowerCase('pt-BR')}.`;
  result.hidden=false;result.focus();
 };
 form.querySelector('[type=submit]').hidden=false;
 let validator;
 try{
  const {default:JustValidate}=await import('./vendor/just-validate/just-validate-text.js');
  validator=new JustValidate(form,{errorFieldCssClass:'ritmo-invalid',errorLabelCssClass:'ritmo-validation-label',errorLabelStyle:{},errorFieldStyle:{},focusInvalidField:true,validateBeforeSubmitting:true});
  validator.addField(name,[{validator:check,errorMessage:'Use ao menos dois caracteres no nome de exemplo.'}],{errorsContainer:error}).onSuccess(ev=>{ev.preventDefault();name.removeAttribute('aria-invalid');show();}).onFail(()=>{name.setAttribute('aria-invalid','true');result.hidden=true;});
 }catch{
  form.addEventListener('submit',ev=>{ev.preventDefault();if(!check()){error.textContent='Use ao menos dois caracteres no nome de exemplo.';name.setAttribute('aria-invalid','true');name.focus();result.hidden=true;return;}error.textContent='';name.removeAttribute('aria-invalid');show();});
 }
 document.querySelector('[data-ritmo-clear]').addEventListener('click',()=>{form.reset();validator?.refresh();error.textContent='';text.textContent='';result.hidden=true;name.removeAttribute('aria-invalid');name.focus();});
 addEventListener('pagehide',ev=>{if(!ev.persisted)validator?.destroy();},{once:true});
})();
