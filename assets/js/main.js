
(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang=document.documentElement.lang==='en'?'en':'hr';
  const words={hr:{ok:'Hvala! Vaš upit je uspješno poslan.',err:'Došlo je do pogreške. Pokušajte ponovno ili nas kontaktirajte telefonom.',map:'Mapa se može učitati nakon prihvaćanja kolačića.',close:'Zatvori'},en:{ok:'Thank you! Your enquiry has been sent.',err:'Something went wrong. Please try again or contact us by phone.',map:'The map can load after you accept cookies.',close:'Close'}}[lang];

  const header=$('.header'); addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>20),{passive:true});
  const menuBtn=$('.menu-btn'), mobile=$('.mobile-menu');
  menuBtn?.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
  $$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>mobile?.classList.remove('open')));

  // Intro once per session; skipped for reduced motion.
  const intro=$('.intro');
  if(intro){
    const seen=sessionStorage.getItem('dreamcomeIntro');
    const hide=()=>{intro.classList.add('hide');sessionStorage.setItem('dreamcomeIntro','1');setTimeout(()=>intro.remove(),800)};
    if(seen||reduced){intro.remove()} else {setTimeout(hide,2400);$('.intro-skip')?.addEventListener('click',hide)}
  }

  if(!reduced && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
    $$('.reveal').forEach(el=>io.observe(el));
  } else $$('.reveal').forEach(el=>el.classList.add('visible'));

  // FAQ
  $$('.faq-q').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');const isOpen=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(isOpen));}));

  // Counters
  const counters=$$('[data-count]');
  if(counters.length){const run=el=>{const target=+el.dataset.count,suffix=el.dataset.suffix||'';if(reduced){el.textContent=target+suffix;return}let n=0;const steps=40;const tick=()=>{n++;el.textContent=Math.round(target*n/steps)+suffix;if(n<steps)requestAnimationFrame(tick)};tick()};const ci=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run(e.target);ci.unobserve(e.target)}}));counters.forEach(c=>ci.observe(c));}

  // Testimonial slider
  const testimonials=$$('.testimonial'); let ti=0;
  if(testimonials.length>1&&!reduced){setInterval(()=>{testimonials[ti].classList.remove('active');ti=(ti+1)%testimonials.length;testimonials[ti].classList.add('active')},5000)}

  // Gallery filters + lightbox
  $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{ $$('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active'); const f=btn.dataset.filter; $$('.gallery-item').forEach(it=>it.hidden=!(f==='all'||it.dataset.cat===f));}));
  const lightbox=$('.lightbox');
  $$('.gallery-item').forEach(it=>it.addEventListener('click',()=>{if(!lightbox)return;const img=$('img',it);$('img',lightbox).src=img.src;$('img',lightbox).alt=img.alt;lightbox.classList.add('open');document.body.classList.add('no-scroll')}));
  const closeLb=()=>{lightbox?.classList.remove('open');document.body.classList.remove('no-scroll')};
  $('.lightbox-close')?.addEventListener('click',closeLb);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLb()});addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});
  // Basic swipe to close on mobile.
  let sx=0;lightbox?.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lightbox?.addEventListener('touchend',e=>{if(Math.abs(e.changedTouches[0].clientX-sx)>80)closeLb()},{passive:true});

  // Dynamic enquiry form.
  const form=$('#booking-form');
  if(form){
    const type=$('#type');
    const groups=$$('[data-for]');
    const qp=new URLSearchParams(location.search).get('type');
    if(type && qp && [...type.options].some(o=>o.value===qp)) type.value=qp;
    const update=()=>groups.forEach(g=>g.hidden=!g.dataset.for.split(',').includes(type.value));
    type?.addEventListener('change',update); update();
    form.addEventListener('submit',async e=>{
      e.preventDefault(); const status=$('.form-status',form); status.className='form-status';
      if(!form.reportValidity()) return;
      const btn=$('button[type=submit]',form);btn.disabled=true;
      try{const fd=new FormData(form);const res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});const data=await res.json();if(!data.success)throw new Error('submit');status.textContent=words.ok;status.classList.add('show','success');form.reset();update();}
      catch(err){status.textContent=words.err;status.classList.add('show','error')}finally{btn.disabled=false}
    });
  }

  // GDPR cookie banner; no non-essential scripts before consent.
  const cookie=$('.cookie'), choice=localStorage.getItem('dreamcomeCookies');
  const setCookie=v=>{localStorage.setItem('dreamcomeCookies',v);cookie?.classList.remove('show');updateMap(v==='accepted')};
  const updateMap=accepted=>{$$('.map-consent').forEach(box=>{if(accepted){box.innerHTML='<div><strong>Google Maps</strong><p>'+ (lang==='hr'?'Ovdje se u produkciji umeće Google Maps iframe za [adresa], [grad].':'In production, the Google Maps iframe for [address], [city] is inserted here.') +'</p></div>'} else box.innerHTML='<div><strong>'+words.map+'</strong><p>'+(lang==='hr'?'Možete promijeniti odabir brisanjem postavki web-mjesta u pregledniku.':'You can change the choice by clearing this site’s settings in your browser.')+'</p></div>'})};
  if(!choice)cookie?.classList.add('show'); updateMap(choice==='accepted');
  $('[data-cookie=accept]')?.addEventListener('click',()=>setCookie('accepted'));$('[data-cookie=reject]')?.addEventListener('click',()=>setCookie('rejected'));
})();
