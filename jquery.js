$(function () {
  /* ===== Formulário (placeholder) ===== */
  $('.contact-form').on('submit', function (e) {
    e.preventDefault();
    alert('Formulário enviado com sucesso!');
  });

/* ===== Cabeçalho encolhível ===== */
const header = document.querySelector('.site-header');
const contact = document.querySelector('.contact-info');

if (header) {
  const END = 500;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / END, 1);

    // Calcular valores de shrink
    const padding = 18 - (10 * progress); // padding progressivo
    const logoSize = window.innerWidth >= 768 ? 60 : 60 - (22 * progress); // logo menor no mobile
    let opacity = window.innerWidth >= 768 ? 1 : 1 - (progress * 0.6); // fade do contato no mobile
    opacity = Math.max(opacity, 0); // não deixar negativo

    // Aplicar variáveis CSS
    header.style.setProperty('--header-padding', `${padding}px`);
    header.style.setProperty('--logo-size', `${logoSize}px`);
    header.style.setProperty('--contacts-opacity', opacity);

    // Ajustar padding-top do body para compensar o header fixo
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';

    // Classe is-min quando atingir progressão máxima
    if (progress >= 1) {
      header.classList.add('is-min');
    } else {
      header.classList.remove('is-min');
    }

    ticking = false;
  }

  // Chamar no load para setar valores iniciais
  updateHeader();

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

  

  /* ===== Carrossel de produtos — rolagem contínua ===== */
const $viewport = $('.carousel .viewport');
const $track    = $('.carousel .track');

let perView = 2,
    slideWidth = 0,
    offset = 0,
    lastTs = 0,
    speed = 40,
    rafId = null;

/* ===== Drag ===== */
let isDragging = false;
let startX = 0;
let lastX = 0;
let dragVelocity = 0;

function getPerView(){
  return window.innerWidth <= 900 ? 1 : 2;
}

function resetClones(){
  $track.children('.clone').remove();
}

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
    $slides.each(function(){
      $(this).clone(true).addClass('clone').appendTo($track);
    });
    total = $track.children().length * slideWidth;
  }
}

function moveFirstToEnd(){
  const $f = $track.children().first();
  $f.appendTo($track);
  offset -= slideWidth;
}

function moveLastToStart(){
  const $l = $track.children().last();
  $l.prependTo($track);
  offset += slideWidth;
}

function update(){
  $track.css('transform', `translateX(${-offset}px)`);
}

function normalize(){
  while (offset >= slideWidth) moveFirstToEnd();
  while (offset < 0) moveLastToStart();
  update();
}

/* ===== Animação principal ===== */
function animate(ts){
  if (!lastTs) lastTs = ts;
  const dt = (ts - lastTs) / 1000;
  lastTs = ts;

  if (!isDragging){
    offset += speed * dt + dragVelocity;
    dragVelocity *= 0.95; // inércia
  }

  normalize();
  rafId = requestAnimationFrame(animate);
}

/* ===== Drag handlers ===== */
function startDrag(x){
  isDragging = true;
  startX = lastX = x;
  dragVelocity = 0;
}

function moveDrag(x){
  if (!isDragging) return;

  const dx = x - lastX;
  lastX = x;

  offset -= dx;
  dragVelocity = -dx;
  normalize();
}

function endDrag(){
  isDragging = false;
}

/* ===== Mouse ===== */
$viewport.on('mousedown', e => startDrag(e.clientX));
$(window).on('mousemove', e => moveDrag(e.clientX));
$(window).on('mouseup', endDrag);

/* ===== Touch ===== */
$viewport.on('touchstart', e => {
  startDrag(e.touches[0].clientX);
});

$viewport.on('touchmove', e => {
  moveDrag(e.touches[0].clientX);
});

$viewport.on('touchend touchcancel', endDrag);

/* ===== Setup ===== */
function setup(){
  cancelAnimationFrame(rafId);
  rafId = null;

  resetClones();
  setSizes();
  ensureFill();
  setSizes();

  offset = 0;
  update();
  lastTs = 0;

  rafId = requestAnimationFrame(animate);
}

/* ===== Botões ===== */
$('.carousel .next').on('click', () => {
  offset += slideWidth;
  normalize();
});

$('.carousel .prev').on('click', () => {
  offset -= slideWidth;
  normalize();
});

/* ===== Resize ===== */
let rT = null;
$(window).on('resize', function(){
  clearTimeout(rT);
  rT = setTimeout(setup, 150);
});

/* ===== Init ===== */
setup();

/* ===== Galeria cards ===== */
  $(window).on('load', function() {

  const $viewport = $('.galeria-slider');
  const $track = $('.galeria-track');
  const $originalImgs = $track.find('img');
  const $lb = $('.lightbox');
  const $lbImg = $('.lightbox-img');

  if (!$viewport.length || !$track.length) return;

  // ==== Cria clones para loop infinito
  const $firstClones = $originalImgs.clone().addClass('clone');
  const $lastClones = $originalImgs.clone().addClass('clone');
  $track.prepend($lastClones);
  $track.append($firstClones);

  const totalOriginal = $originalImgs.length;

  // ==== Variáveis de medida e posição
  let imgWidth = $originalImgs[0].getBoundingClientRect().width;
  let translateX = -imgWidth * totalOriginal;
  $track.css('transform', `translateX(${translateX}px)`);

  function updateWidth() {
    imgWidth = $originalImgs[0].getBoundingClientRect().width;
  }
  $(window).on('resize', updateWidth);

  // ==== Drag + inércia
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let lastTs = 0;
  let speed = 50; // pixels per second for auto-scroll
  let dragStarted = false;

  // Função principal de animação para inércia
  function animate(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    if(!dragging){
      translateX -= speed * dt; // auto-scroll left
      translateX += velocity;
      velocity *= 0.95; // desacelera gradualmente
    }

    // Loop infinito
    const minTranslate = -imgWidth * totalOriginal * 2;
    const maxTranslate = 0;
    if (translateX <= minTranslate) translateX += imgWidth * totalOriginal;
    if (translateX >= maxTranslate) translateX -= imgWidth * totalOriginal;

    $track.css('transform', `translateX(${translateX}px)`);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ==== Eventos de drag
  function startDrag(x){
    dragging = true;
    lastX = x;
    velocity = 0;
    dragStarted = false;
  }

  function moveDrag(x){
    if(!dragging) return;
    const dx = x - lastX;
    lastX = x;
    translateX += dx;
    velocity = dx; // atualiza velocidade
    if(Math.abs(dx) > 1) dragStarted = true;
    $track.css('transform', `translateX(${translateX}px)`);

    // Loop infinito
    const minTranslate = -imgWidth * totalOriginal * 2;
    const maxTranslate = 0;
    if (translateX <= minTranslate) translateX += imgWidth * totalOriginal;
    if (translateX >= maxTranslate) translateX -= imgWidth * totalOriginal;
  }

  function endDrag(){
    dragging = false;
  }

  // ==== Eventos mouse
  $viewport[0].addEventListener('mousedown', e => { e.preventDefault(); startDrag(e.clientX); });
  window.addEventListener('mousemove', e => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);

  // ==== Eventos touch
  $viewport[0].addEventListener('touchstart', e => { e.preventDefault(); startDrag(e.touches[0].clientX); });
  $viewport[0].addEventListener('touchmove', e => {
    e.preventDefault(); // previne scroll da página
    moveDrag(e.touches[0].clientX);
  }, { passive: false });
  $viewport[0].addEventListener('touchend', endDrag);
  $viewport[0].addEventListener('touchcancel', endDrag);

  // ==== Lightbox
  let gi = 0;

  $originalImgs.on('click', function() {
    if(dragStarted) {
      dragStarted = false;
      return;
    }
    gi = $(this).index();
    $lbImg.attr('src', $(this).attr('src'));
    $lb.addClass('active');
  });

  $('.lightbox .close').on('click', () => $lb.removeClass('active'));
  $('.lightbox .next').on('click', () => {
    gi = (gi + 1) % totalOriginal;
    $lbImg.attr('src', $originalImgs.eq(gi).attr('src'));
  });
  $('.lightbox .prev').on('click', () => {
    gi = (gi - 1 + totalOriginal) % totalOriginal;
    $lbImg.attr('src', $originalImgs.eq(gi).attr('src'));
  });
  $lb.on('click', e => {
    if ($(e.target).is('.lightbox, .lightbox-img')) $lb.removeClass('active');
  });

});

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

 // ==== Reviews — scroll horizontal infinito =====
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("reviewsTrack");
  const skeleton = document.querySelector(".reviews-skeleton");

  // Clona conteúdo para loop infinito
  track.innerHTML += track.innerHTML;

  let pos = 0;
  let velocity = 0;
  let isHover = false;

  // Remove skeleton
  setTimeout(() => {
    skeleton.style.display = "none";
  }, 1000);

  // Scroll por mouse (PC)
  track.addEventListener("wheel", e => {
    e.preventDefault();
    velocity += e.deltaY * 0.04;
  }, { passive: false });

  // Pausa ao hover
  track.addEventListener("mouseenter", () => isHover = true);
  track.addEventListener("mouseleave", () => isHover = false);

  function animate() {
    if (!isHover) {
      velocity += 0.03; // auto-scroll suave
    }

    pos += velocity;
    velocity *= 0.92; // inércia real

    const half = track.scrollWidth / 2;
    if (pos >= half) pos -= half;
    if (pos <= 0) pos += half;

    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});

