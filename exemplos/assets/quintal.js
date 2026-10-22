'use strict';
(() => {
  const root=document.querySelector('[data-quintal-tooth]');
  if(!root||!window.lottie)return;
  const poster=root.querySelector('[data-tooth-poster]');
  const container=root.querySelector('[data-tooth-player]');
  const replay=root.querySelector('[data-tooth-replay]');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let animation,visible=false,loading=false,generation=0,dataPromise;
  function dispose(){generation++;loading=false;if(animation)animation.destroy();animation=null;poster.hidden=false;replay.hidden=true;delete root.dataset.ready;root.dataset.animation='static';}
  async function mount(){
    if(animation||loading||!visible||reduced.matches||document.hidden)return;
    loading=true;const token=++generation;
    try{
      dataPromise||=fetch('../../assets/quintal/dente.json').then(response=>{if(!response.ok)throw new Error('animation');return response.json();});
      const data=await dataPromise;
      if(token!==generation||!visible||reduced.matches||document.hidden){loading=false;return;}
      animation=window.lottie.loadAnimation({container,renderer:'svg',loop:false,autoplay:false,animationData:JSON.parse(JSON.stringify(data)),rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
      animation.addEventListener('DOMLoaded',()=>{if(!animation)return;root.dataset.ready='true';poster.hidden=true;replay.hidden=false;root.dataset.animation='playing';animation.play();});
      animation.addEventListener('complete',()=>{root.dataset.animation='complete';});
      loading=false;
    }catch{dispose();}
  }
  function sync(){
    if(reduced.matches){dispose();return;}
    if(!visible||document.hidden){if(animation&&root.dataset.animation==='playing'){animation.pause();root.dataset.animation='paused';}return;}
    if(animation&&root.dataset.animation==='paused'){animation.play();root.dataset.animation='playing';}else mount();
  }
  replay.addEventListener('click',()=>{if(animation&&!reduced.matches){root.dataset.animation='playing';animation.goToAndPlay(0,true);}});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(root);}else{visible=true;sync();}
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  addEventListener('pagehide',dispose);addEventListener('pageshow',event=>{if(event.persisted)sync();});
})();
