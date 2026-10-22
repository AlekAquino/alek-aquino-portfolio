'use strict';
const AlekContact = (() => {
  const data=ALEK_CATALOG_DATA;
  const phone=data.company.whatsapp_phone;
  const models=new Map(data.models.map(m=>[m.id,m]));
  function url(ids) {
    if(!/^55\d{10,11}$/.test(phone))return null;
    const chosen=[...new Set(ids)].filter(id=>models.has(id)).map(id=>models.get(id));
    if(!chosen.length)return null;
    const message=chosen.length===1
      ?`Olá, Alek! Escolhi o modelo ${chosen[0].id} — ${chosen[0].name}, da coleção ${chosen[0].collection}. Quero conversar sobre a personalização desse modelo.`
      :`Olá, Alek! Estes são os modelos que escolhi da coleção ${data.company.collection.name}: ${chosen.map(m=>`${m.id} — ${m.name}`).join('; ')}. Quero conversar sobre a personalização.`;
    const target=new URL(`https://wa.me/${phone}`);
    target.searchParams.set('text',message);
    return target.href;
  }
  function setLink(link,ids) {
    if(!link)return;
    const target=url(ids);link.hidden=!target;
    if(target)link.href=target;else link.removeAttribute('href');
  }
  return Object.freeze({url,setLink});
})();
