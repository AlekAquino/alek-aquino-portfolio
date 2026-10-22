import autoAnimate from './vendor/auto-animate/auto-animate-lifecycle.js';

const root=document.querySelector('[data-lume-planner]');
if(root){
  const list=root.querySelector('[data-lume-question-list]');
  const choices=[...root.querySelectorAll('input[type=checkbox]')];
  const nodes=new Map([...list.children].map(node=>[node.dataset.question,node]));
  const status=root.querySelector('[data-lume-status]');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let controller,visible=false;
  function stop(){if(controller)controller.destroy();controller=null;root.dataset.lumeMotion='static';}
  function sync(){
    if(reduced.matches||document.hidden||!visible){stop();return;}
    if(!controller){controller=autoAnimate(list,{duration:220,easing:'ease-out'});root.dataset.lumeMotion='active';}
  }
  function render(){
    for(const choice of choices){
      const node=nodes.get(choice.value);
      if(choice.checked&&!list.contains(node))list.append(node);
      else if(!choice.checked&&list.contains(node))node.remove();
    }
    const count=choices.filter(choice=>choice.checked).length;
    status.textContent=count?`${count} ${count===1?'pergunta selecionada':'perguntas selecionadas'}`:'Selecione os assuntos que quer esclarecer.';
  }
  list.replaceChildren();
  root.querySelector('[data-lume-choices]').hidden=false;
  choices.forEach(choice=>choice.addEventListener('change',render));
  render();
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});
    observer.observe(root);
  }
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  addEventListener('pagehide',stop);
  addEventListener('pageshow',event=>{if(event.persisted)sync();});
}
