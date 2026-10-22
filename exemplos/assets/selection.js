'use strict';
// Somente IDs de modelos são persistidos; entradas de storage nunca viram HTML/URL.
const AlekSelection = (() => {
  const valid = new Set(Array.from({length:21},(_,i)=>String(i+1).padStart(2,'0')));
  const key = 'alek-odontologia-favoritos-v1';
  function load() {
    try {
      const stored = localStorage.getItem(key)||'[]';
      if(stored.length>4096)return {ids:[],available:false};
      const raw = JSON.parse(stored);
      return {ids:Array.isArray(raw)?[...new Set(raw.filter(x=>typeof x==='string'&&valid.has(x)))]:[],available:true};
    } catch { return {ids:[],available:false}; }
  }
  function save(ids) {
    const clean=[...new Set(ids.filter(x=>valid.has(x)))];
    try { localStorage.setItem(key,JSON.stringify(clean)); return {ids:clean,available:true}; }
    catch { return {ids:[],available:false}; }
  }
  function toggle(id) {
    if(!valid.has(id))return load();
    const state=load(); if(!state.available)return state;
    return save(state.ids.includes(id)?state.ids.filter(x=>x!==id):[...state.ids,id]);
  }
  function clear() {
    try {localStorage.removeItem(key);return {ids:[],available:true};}
    catch {return {ids:[],available:false};}
  }
  return Object.freeze({load,toggle,clear});
})();
