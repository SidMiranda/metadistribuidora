$(function () {
  /* ===== Formulário (placeholder) ===== */
  $('.contact-form').on('submit', function (e) {
    e.preventDefault();
    alert('Formulário enviado com sucesso!');
  });

  /* ===== Carrossel de produtos — rolagem contínua ===== */
  const $viewport = $('.carousel .viewport');
  const $track    = $('.carousel .track');
  let perView = 2, slideWidth = 0, offset = 0, lastTs = 0, speed = 40;
  function getPerView(){ return window.innerWidth <= 900 ? 1 : 2; }
  function resetClones(){ $track.children('.clone').remove(); }
  function setSizes(){
    perView = getPerView();
    slideWidth = $viewport.width() / perView;
    $track.children().css('min-width', slideWidth + 'px');
  }
  function ensureFill(){
    const $slides = $track.children();
    const vw = $viewport.width();
    let total = $slides.length * slideWidth;
    while (total < vw * 3){
      $slides.each(function(){ $(this).clone(true).addClass('clone').appendTo($track); });
      total = $track.children().length * slideWidth;
    }
  }
  function moveFirstToEnd(){ const $f=$track.children().first(); $f.appendTo($track); offset -= slideWidth; }
  function moveLastToStart(){ const $l=$track.children().last(); $l.prependTo($track); offset += slideWidth; }
  function update(){ $track.css('transform',`translateX(${-offset}px)`); }
  function normalize(){ while(offset >= slideWidth) moveFirstToEnd(); while(offset < 0) moveLastToStart(); update(); }
  function animate(ts){
    if(!lastTs) lastTs = ts;
    const dt = (ts - lastTs)/1000; lastTs = ts;
    offset += speed * dt; normalize();
    requestAnimationFrame(animate);
  }
  function setup(){
    cancelAnimationFrame(rafId); rafId=null;
    resetClones(); setSizes(); ensureFill(); setSizes(); offset=0; update(); rafId=requestAnimationFrame(animate);
  }
  let rafId = requestAnimationFrame(animate);
  $('.carousel .next').on('click', ()=>{ offset += slideWidth; normalize(); });
  $('.carousel .prev').on('click', ()=>{ offset -= slideWidth; normalize(); });
  let rT=null; $(window).on('resize', function(){ clearTimeout(rT); rT=setTimeout(setup,150); });
  setup();

  /* ===== Galeria / Lightbox ===== */
  const $gTrack = $('.galeria-track');
  const $gImgs  = $gTrack.find('img');
  const $lb     = $('.lightbox');
  const $lbImg  = $('.lightbox-img');
  let gi = 0;
  $gImgs.on('click', function(){ gi = $(this).index(); $lbImg.attr('src', $(this).attr('src')); $lb.addClass('active'); });
  $('.lightbox .close').on('click', ()=> $lb.removeClass('active'));
  $('.lightbox .next').on('click', function(){ gi = (gi+1)%$gImgs.length; $lbImg.attr('src',$gImgs.eq(gi).attr('src')); });
  $('.lightbox .prev').on('click', function(){ gi = (gi-1+$gImgs.length)%$gImgs.length; $lbImg.attr('src',$gImgs.eq(gi).attr('src')); });
  $lb.on('click', function(e){ if($(e.target).is('.lightbox, .lightbox-img')) $lb.removeClass('active'); });

  /* ===== Carrossel de clientes ===== */
  (function(){
    const $vp = $('.clients .c-viewport');
    if(!$vp.length) return;
    const $tr = $('.clients .c-track');
    const $it = $('.clients .c-item');
    const $dots = $('.clients .c-dots');
    let per = 6, w=0, idx=0, tmr=null;
    function perView(){
      const ww = window.innerWidth;
      if (ww<=520) return 2; if(ww<=760) return 3; if(ww<=1024) return 4; return 6;
    }
    function sizes(){
      per = perView(); w = $vp.width()/per; $it.css('min-width', w+'px');
    }
    function dots(){
      $dots.empty(); const pages = Math.max(1, Math.ceil($it.length/per));
      for(let i=0;i<pages;i++){ $('<button/>').toggleClass('active', i===idx).appendTo($dots).on('click', ()=>{ idx=i; upd(); }); }
    }
    function upd(){ $tr.css('transform',`translateX(${-idx*w}px)`); $dots.children().removeClass('active').eq(idx).addClass('active'); }
    function next(){ const max = Math.max(0, Math.ceil($it.length/per)-1); idx = (idx>=max)?0:idx+1; upd(); }
    function prev(){ const max = Math.max(0, Math.ceil($it.length/per)-1); idx = (idx<=0)?max:idx-1; upd(); }
    $('.clients .c-next').on('click', ()=>{ stop(); next(); start(); });
    $('.clients .c-prev').on('click', ()=>{ stop(); prev(); start(); });
    function start(){ stop(); tmr=setInterval(next,3000); }
    function stop(){ if(tmr) clearInterval(tmr); }
    $(window).on('resize', function(){ const first = idx*per; sizes(); idx = Math.floor(first/per); dots(); upd(); });
    $('.clients-carousel').on('mouseenter', stop).on('mouseleave', start);
    sizes(); dots(); upd(); start();
  })();
});
