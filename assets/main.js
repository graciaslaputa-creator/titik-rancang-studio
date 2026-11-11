(() => {
  'use strict';
  const phone = '6285963971915';
  const whatsapp = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const rupiah = value => new Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('#main-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const subButton = document.querySelector('.submenu-toggle');
  const submenu = document.querySelector('#services-menu');
  const mobile = window.matchMedia('(max-width: 800px)');
  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-menu-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  header?.after(backdrop);
  function syncMenuState(open) {
    const active = open && mobile.matches;
    document.body.classList.toggle('mobile-menu-open', active);
    if(nav) nav.inert = mobile.matches && !open;
    document.querySelectorAll('main, .site-footer, .service-sticky').forEach(element => { element.inert = active; });
  }
  function setSub(open) { if(submenu) submenu.hidden=!open; subButton?.setAttribute('aria-expanded',String(open)); }
  function setMenu(open) {
    nav?.classList.toggle('is-open',open);
    menuButton?.setAttribute('aria-expanded',String(open));
    menuButton?.setAttribute('aria-label',open?'Tutup menu':'Buka menu');
    syncMenuState(open);
    if(!open)setSub(false);
  }
  syncMenuState(false);
  backdrop.addEventListener('click',()=>{setMenu(false);menuButton?.focus();});
  menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
  subButton?.addEventListener('click',()=>setSub(subButton.getAttribute('aria-expanded')!=='true'));
  nav?.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
  document.addEventListener('pointerdown',event=>{if(!header?.contains(event.target))setMenu(false);});
  document.querySelector('.services-nav')?.addEventListener('focusout',event=>{if(!event.currentTarget.contains(event.relatedTarget))setSub(false);});
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab' && mobile.matches && menuButton?.getAttribute('aria-expanded')==='true') {
      const focusable=[...header.querySelectorAll('a[href],button')].filter(element=>element.getClientRects().length && getComputedStyle(element).visibility!=='hidden');
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
    }
    if(event.key!=='Escape')return;
    if(subButton?.getAttribute('aria-expanded')==='true'){setSub(false);subButton.focus();}
    else if(menuButton?.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();}
  });
  mobile.addEventListener('change',()=>setMenu(false));
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const selected=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item=>{
      item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));
    });
    const cards=[...document.querySelectorAll('[data-category]')];
    cards.forEach(card=>{card.hidden=selected!=='Semua'&&card.dataset.category!==selected;});
    document.querySelector('.project-grid')?.classList.toggle('is-filtered',selected!=='Semua');
    const status=document.querySelector('[data-filter-status]');
    if(status)status.textContent=`${cards.filter(card=>!card.hidden).length} studi desain ditampilkan.`;
  }));
  const calculator=document.querySelector('[data-calculator]');
  if(calculator){
    const packages={basic:{name:'Basic',price:35000},standard:{name:'Standard',price:50000},pro:{name:'Pro',price:90000},'standard-rab':{name:'Standard + RAB',price:60000}};
    const area=document.querySelector('#area'), select=document.querySelector('#package');
    const output=document.querySelector('#kalkulator output'), formula=document.querySelector('[data-estimate-formula]'), link=document.querySelector('[data-estimate-link]');
    function calculate(){
      const selected=packages[select.value],number=Number(area.value);
      const rateLabel=document.querySelector('[data-estimate-rate]');
      if(rateLabel)rateLabel.textContent=selected?`${rupiah(selected.price)}/m²`:'Pilih paket';
      const valid=selected&&area.value!==''&&Number.isFinite(number)&&number>0&&number<=1000000;
      link.hidden=!valid;
      if(!valid){output.textContent='Masukkan luas yang valid';formula.textContent='Pilih luas dan paket untuk melihat estimasi.';link.removeAttribute('href');return;}
      const total=Math.round(number*selected.price);
      output.textContent=rupiah(total);formula.textContent=`${area.value} m² × ${rupiah(selected.price)}/m²`;
      link.href=whatsapp(`Halo Titik Rancang, saya tertarik paket ${selected.name}. Luas bangunan: ${area.value} m². Harga paket: ${rupiah(selected.price)}/m². Estimasi biaya desain: ${rupiah(total)}. Mohon informasi lingkup dan penawaran lebih lanjut.`);
    }
    calculator.addEventListener('submit',event=>event.preventDefault());
    calculator.addEventListener('input',calculate);calculator.addEventListener('change',calculate);calculate();
  }
  const inquiry=document.querySelector('[data-inquiry]');
  if(inquiry){
    const draft=inquiry.querySelector('[data-inquiry-draft]'),error=inquiry.querySelector('[data-inquiry-error]'),link=inquiry.querySelector('[data-inquiry-link]');
    inquiry.addEventListener('input',()=>{draft.hidden=true;error.hidden=true;link.href=whatsapp('Halo Titik Rancang, saya ingin mendiskusikan dukungan proyek B2B.');});
    inquiry.addEventListener('submit',event=>{
      event.preventDefault();
      const data=new FormData(inquiry);
      const company=String(data.get('company')||'').trim(),project=String(data.get('project')||'').trim(),deadline=String(data.get('deadline')||'').trim();
      if(!company||!project||!deadline){error.textContent='Lengkapi nama perusahaan, jenis proyek, dan target waktu.';error.hidden=false;draft.hidden=true;return;}
      const message=`Halo Titik Rancang, kami ingin mengajukan penawaran dukungan proyek B2B.\n\nNama perusahaan: ${company}\nJenis proyek: ${project}\nTarget waktu: ${deadline}\nKebutuhan/brief: ${String(data.get('brief')||'').trim()||'Akan kami jelaskan melalui chat.'}\n\nMohon informasi lingkup kerja, jadwal, dan penawaran biaya.`;
      inquiry.querySelector('[data-inquiry-message]').textContent=message;
      link.href=whatsapp(message);error.hidden=true;draft.hidden=false;
    });
  }
})();
