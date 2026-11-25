/**
 * animations.js — acabamento visual.
 * Nada aqui é necessário para ler ou navegar pelo conteúdo.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Revelação durante a rolagem ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length || reduceMotion || !('IntersectionObserver' in window)) { root.classList.remove('anim-ready'); return; }

    // Pequeno escalonamento entre irmãos do mesmo grid
    items.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty('--reveal-delay', Math.min(index, 5) * 0.06 + 's');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });

    // Confirma que o observador está ativo (o <head> desfaz .anim-ready se isso não acontecer)
    root.classList.add('anim-ready', 'anim-live');

    // Segurança: se algo impedir o observador de disparar, revela tudo
    window.setTimeout(function () {
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
      });
    }, 1500);
  }

  /* ---------- Spotlight que segue o cursor nos cards ---------- */
  function initSpotlight() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var frame = null;
    var last = null;

    document.addEventListener('pointermove', function (e) {
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var card = last.target.closest && last.target.closest('.spotlight');
        if (!card) return;
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (last.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (last.clientY - rect.top) + 'px');
      });
    }, { passive: true });
  }

  try { initReveal(); } catch (e) { root.classList.remove('anim-ready'); }
  try { initSpotlight(); } catch (e) { /* efeito opcional */ }
})();
