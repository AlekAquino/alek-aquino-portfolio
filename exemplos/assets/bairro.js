const root=document.querySelector('[data-bairro-map]');
if(root){
 const activate=root.querySelector('[data-map-activate]'),viewport=root.querySelector('[data-map-viewport]'),poster=root.querySelector('[data-map-poster]'),controls=root.querySelector('[data-map-controls]'),status=root.querySelector('[data-map-status]');
 const zoomIn=root.querySelector('[data-map-in]'),zoomOut=root.querySelector('[data-map-out]'),reset=root.querySelector('[data-map-reset]'),drag=root.querySelector('[data-map-drag]'),roomButtons=[...root.querySelectorAll('[data-map-room]')];
 const rooms={entrada:{label:'Entrada',bounds:[[65,48],[215,298]]},conversa:{label:'Conversa',bounds:[[245,48],[495,408]]},consultorio:{label:'Consultório',bounds:[[245,445],[495,845]]},familia:{label:'Espaço da família',bounds:[[65,335],[215,845]]}};
 const bounds=[[0,0],[560,900]];let map,highlight,observer,libraryPromise,sequence=0,L;
 const sync=()=>{if(!map)return;zoomIn.disabled=map.getZoom()>=map.getMaxZoom()-.01;zoomOut.disabled=map.getZoom()<=map.getMinZoom()+.01;};
 const overview=()=>{if(!map)return;map.setMinZoom(-3);map.fitBounds(bounds,{padding:[16,16],animate:false});const min=map.getZoom();map.setMinZoom(min);map.setMaxZoom(min+2);highlight?.remove();highlight=null;roomButtons.forEach(b=>b.setAttribute('aria-pressed','false'));status.textContent='Visão geral do esquema conceitual.';sync();};
 const dispose=()=>{sequence++;observer?.disconnect();observer=null;map?.remove();map=null;highlight=null;poster.hidden=false;viewport.hidden=true;controls.hidden=true;activate.hidden=false;activate.disabled=false;roomButtons.forEach(b=>{b.hidden=true;b.removeAttribute('aria-pressed');});drag.setAttribute('aria-pressed','false');drag.textContent='Ativar arrasto';status.textContent='Esquema ilustrativo estático.';};
 activate.hidden=false;
 activate.addEventListener('click',async()=>{
  const current=++sequence;activate.disabled=true;status.textContent='Preparando o esquema…';
  try{
   libraryPromise||=import('./vendor/leaflet/leaflet.js').then(()=>window.L);L=await libraryPromise;if(current!==sequence)return;
   if(!L?.map)throw new Error('map');viewport.hidden=false;
   map=L.map(viewport,{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,zoomSnap:.25,zoomDelta:.5,attributionControl:false,zoomControl:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,dragging:false,keyboard:false,touchZoom:false,inertia:false,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false});
   L.imageOverlay(new URL('./bairro/esquema.svg',import.meta.url).href,bounds,{alt:'Esquema conceitual de quatro ambientes'}).on('error',()=>{dispose();status.textContent='O esquema interativo não carregou. A ilustração e as descrições continuam disponíveis.';}).addTo(map);
   map.setMaxBounds([[-100,-100],[660,1000]]);overview();map.on('zoomend',sync);poster.hidden=true;controls.hidden=false;activate.hidden=true;activate.disabled=false;roomButtons.forEach(b=>{b.hidden=false;b.setAttribute('aria-pressed','false');});
   if('ResizeObserver' in window){observer=new ResizeObserver(()=>{if(map)map.invalidateSize({pan:false,animate:false});});observer.observe(viewport);}
   viewport.focus();
  }catch{if(current!==sequence)return;libraryPromise=null;dispose();status.textContent='O esquema interativo está indisponível. Continue pela ilustração e pelos textos.';}
 });
 zoomIn.addEventListener('click',()=>{map?.zoomIn(.5,{animate:false});sync();});zoomOut.addEventListener('click',()=>{map?.zoomOut(.5,{animate:false});sync();});reset.addEventListener('click',overview);
 drag.addEventListener('click',()=>{if(!map)return;const active=drag.getAttribute('aria-pressed')==='true';if(active)map.dragging.disable();else map.dragging.enable();drag.setAttribute('aria-pressed',String(!active));drag.textContent=active?'Ativar arrasto':'Desativar arrasto';});
 for(const button of roomButtons)button.addEventListener('click',()=>{if(!map)return;const room=rooms[button.dataset.mapRoom];if(!room)return;highlight?.remove();highlight=L.rectangle(room.bounds,{color:'#a44e35',weight:3,fillOpacity:.05,interactive:false}).addTo(map);map.fitBounds(room.bounds,{padding:[24,24],animate:false});roomButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));status.textContent=room.label+' — ambiente conceitual ilustrativo.';sync();viewport.focus({preventScroll:true});viewport.scrollIntoView({block:'center',behavior:'auto'});});
 viewport.addEventListener('keydown',ev=>{if(!map)return;const moves={ArrowLeft:[-60,0],ArrowRight:[60,0],ArrowUp:[0,-60],ArrowDown:[0,60]};if(moves[ev.key]){ev.preventDefault();map.panBy(moves[ev.key],{animate:false});}if(ev.key==='Home'){ev.preventDefault();overview();}if(ev.key==='+'||ev.key==='='){ev.preventDefault();map.zoomIn(.5,{animate:false});}if(ev.key==='-'){ev.preventDefault();map.zoomOut(.5,{animate:false});}sync();});
 addEventListener('pagehide',dispose);
}
