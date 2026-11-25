/**
 * main.js — funcionalidades do portfólio.
 * Cada recurso é inicializado de forma isolada: se um falhar,
 * os demais continuam funcionando e o conteúdo segue acessível.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var CONFIG = window.PORTFOLIO_CONFIG || {};
  var I18N = window.PORTFOLIO_I18N || { en: {}, ui: { pt: {}, en: {} } };
  var state = { lang: 'pt' };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var storage = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } }
  };

  function ui(key) {
    var dict = I18N.ui && I18N.ui[state.lang];
    return (dict && dict[key]) || (I18N.ui && I18N.ui.pt && I18N.ui.pt[key]) || '';
  }

  function safe(name, fn) {
    try { fn(); } catch (err) {
      if (window.console && console.warn) console.warn('[portfolio] falha em "' + name + '":', err);
    }
  }

  function get(obj, path) {
    return path.split('.').reduce(function (acc, k) { return acc && acc[k] != null ? acc[k] : undefined; }, obj);
  }

  /* ---------- Configuração (links e dados opcionais) ---------- */
  function isSafeUrl(url) {
    return /^(https?:|mailto:)/i.test(url) || /^[\w./-]+$/.test(url);
  }

  function resumeHref() {
    var r = CONFIG.resume || {};
    return (state.lang === 'en' && r.en) ? r.en : (r.pt || '');
  }

  function applyConfig() {
    var links = {
      linkedin: CONFIG.linkedin || '',
      email: CONFIG.email ? 'mailto:' + CONFIG.email : '',
      resume: resumeHref()
    };

    $$('[data-config-link]').forEach(function (el) {
      var url = links[el.getAttribute('data-config-link')];
      if (url && isSafeUrl(url)) {
        el.setAttribute('href', url);
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });

    $$('[data-config-text]').forEach(function (el) {
      var value = get(CONFIG, el.getAttribute('data-config-text'));
      el.textContent = value || '';
    });

    $$('[data-config-wrap]').forEach(function (el) {
      el.hidden = !get(CONFIG, el.getAttribute('data-config-wrap'));
    });
  }

  /* ---------- Idioma ---------- */
  var originals = new WeakMap();
  var attrOriginals = new WeakMap();
  var meta = {
    title: document.title,
    description: ($('meta[name="description"]') || {}).content || ''
  };

  function parseAttrSpec(spec) {
    return spec.split(';').map(function (pair) {
      var i = pair.indexOf(':');
      return { attr: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
    }).filter(function (p) { return p.attr && p.key; });
  }

  function translateTree(scope, lang) {
    var dict = I18N.en || {};

    $$('[data-i18n]', scope).forEach(function (el) {
      if (!originals.has(el)) originals.set(el, el.textContent);
      var key = el.getAttribute('data-i18n');
      el.textContent = (lang === 'en' && dict[key]) ? dict[key] : originals.get(el);
    });

    $$('[data-i18n-attr]', scope).forEach(function (el) {
      var saved = attrOriginals.get(el);
      if (!saved) { saved = {}; attrOriginals.set(el, saved); }
      parseAttrSpec(el.getAttribute('data-i18n-attr')).forEach(function (p) {
        if (!(p.attr in saved)) saved[p.attr] = el.getAttribute(p.attr) || '';
        el.setAttribute(p.attr, (lang === 'en' && dict[p.key]) ? dict[p.key] : saved[p.attr]);
      });
    });
  }

  function setLang(lang, persist) {
    state.lang = lang === 'en' ? 'en' : 'pt';
    var en = state.lang === 'en';

    translateTree(document, state.lang);
    root.setAttribute('lang', en ? 'en' : 'pt-BR');
    document.title = en ? I18N.en['meta.title'] : meta.title;
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', en ? I18N.en['meta.description'] : meta.description);

    var btn = $('#lang-toggle');
    if (btn) {
      btn.setAttribute('aria-label', ui('langSwitch'));
      btn.setAttribute('lang', en ? 'pt-BR' : 'en'); // o rótulo está no idioma de destino
      var label = $('.lang-btn__label', btn);
      if (label) label.textContent = ui('langLabel');
    }

    var menuBtn = $('#menu-toggle');
    if (menuBtn) {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-label', ui(open ? 'menuClose' : 'menuOpen'));
    }

    applyConfig();
    if (modal.current) modal.render(modal.current);
    if (persist) storage.set('ll-lang', state.lang);
  }

  function initLang() {
    var param = null;
    try { param = new URLSearchParams(location.search).get('lang'); } catch (e) { /* navegador antigo */ }
    var initial = param || storage.get('ll-lang') || 'pt';
    if (initial === 'en') setLang('en', false); else applyConfig();

    var btn = $('#lang-toggle');
    if (btn) btn.addEventListener('click', function () {
      setLang(state.lang === 'en' ? 'pt' : 'en', true);
    });
  }

  /* ---------- Tema ---------- */
  function initTheme() {
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      storage.set('ll-theme', next);
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#fafafa' : '#0a0a0b');
    });
  }

  /* ---------- Menu mobile ---------- */
  function initMenu() {
    var btn = $('#menu-toggle');
    var nav = $('#nav');
    if (!btn || !nav) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', ui(open ? 'menuClose' : 'menuOpen'));
      nav.classList.toggle('is-open', open);
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    var mq = window.matchMedia('(min-width: 921px)');
    var onChange = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Rolagem: header, progresso e voltar ao topo ---------- */
  function initScroll() {
    var header = $('.header');
    var bar = $('.progress__bar');
    var toTop = $('#to-top');
    var ticking = false;

    if (toTop) {
      toTop.hidden = false;
      toTop.addEventListener('click', function () {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        var main = $('#conteudo');
        if (main) main.focus({ preventScroll: true });
      });
    }

    var max = 0;
    function measure() { max = document.documentElement.scrollHeight - window.innerHeight; }

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (bar) bar.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
      if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', function () { measure(); update(); }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); update(); }).observe(document.body);
    requestAnimationFrame(function () { measure(); update(); });
  }

  /* ---------- Seção ativa na navegação ---------- */
  function initActiveSection() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('.nav__link');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a === map[entry.target.id];
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });

    // Ao voltar ao hero, nenhuma seção fica marcada
    var hero = document.getElementById('inicio');
    if (hero) new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* ---------- Filtro de projetos ---------- */
  function initFilters() {
    var buttons = $$('.filter');
    var grid = $('.projects');
    var status = $('#filter-status');
    if (!buttons.length || !grid) return;
    var cards = $$('.project', grid);

    function matches(card, filter) {
      return filter === 'all' || (card.getAttribute('data-tags') || '').split(/\s+/).indexOf(filter) !== -1;
    }

    // Contagem de projetos em cada filtro (calculada pelas tags, sem números fixos no HTML)
    buttons.forEach(function (btn) {
      var counter = $('.filter__count', btn);
      var key = btn.getAttribute('data-filter');
      if (counter) counter.textContent = String(cards.filter(function (c) { return matches(c, key); }).length);
    });

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        grid.classList.toggle('is-filtered', filter !== 'all');

        var count = 0;
        cards.forEach(function (card) {
          var show = matches(card, filter);
          var wasHidden = card.classList.contains('is-hidden');
          card.classList.toggle('is-hidden', !show);
          if (show) {
            count++;
            card.classList.add('is-visible');
            card.classList.remove('is-entering');
            if (wasHidden || filter !== 'all') {
              void card.offsetWidth; // reinicia a animação
              card.classList.add('is-entering');
            }
          }
        });

        if (status) {
          status.textContent = filter === 'all'
            ? ui('filterAll').replace('{n}', count)
            : ui('filterSome').replace('{n}', count).replace('{c}', ($('span', btn) || btn).textContent.trim());
        }
      });
    });
  }

  /* ---------- Modal de estudo de caso ---------- */
  var modal = {
    el: null,
    current: null,
    trigger: null,

    render: function (id) {
      var source = document.getElementById('case-' + id);
      var card = source && source.closest('.project');
      if (!source || !card) return false;
      var title = $('.project__title', card);
      var cat = $('.project__cat', card);
      $('#modal-title').textContent = title ? title.textContent : '';
      $('#modal-cat').textContent = cat ? cat.textContent : '';

      var body = $('#modal-body');
      while (body.firstChild) body.removeChild(body.firstChild);
      Array.prototype.forEach.call(source.children, function (child) {
        body.appendChild(child.cloneNode(true));
      });
      return true;
    },

    open: function (id, trigger) {
      if (!this.el || !this.render(id)) return;
      this.current = id;
      this.trigger = trigger || null;
      if (typeof this.el.showModal === 'function') this.el.showModal();
      else this.el.setAttribute('open', '');
      root.classList.add('modal-open');
      var close = $('[data-close]', this.el);
      if (close) close.focus();
    },

    close: function () {
      if (!this.el) return;
      if (typeof this.el.close === 'function' && this.el.open) this.el.close();
      else { this.el.removeAttribute('open'); this.onClosed(); }
    },

    onClosed: function () {
      root.classList.remove('modal-open');
      this.current = null;
      if (this.trigger && document.contains(this.trigger)) this.trigger.focus();
      this.trigger = null;
    }
  };

  function initModal() {
    modal.el = $('#case-modal');
    if (!modal.el) return;

    $$('[data-case]').forEach(function (btn) {
      btn.addEventListener('click', function () { modal.open(btn.getAttribute('data-case'), btn); });
    });

    modal.el.addEventListener('click', function (e) {
      // Clique fora da caixa (no backdrop) ou no botão de fechar
      if (e.target === modal.el || e.target.closest('[data-close]')) modal.close();
    });
    modal.el.addEventListener('close', function () { modal.onClosed(); });
    // Fallback para navegadores sem <dialog>
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.current && typeof modal.el.showModal !== 'function') modal.close();
    });
  }

  /* ---------- Copiar e-mail ---------- */
  function initCopy() {
    var btn = $('#copy-email');
    var status = $('#copy-status');
    if (!btn || !CONFIG.email) return;
    var timer;

    function feedback(ok) {
      if (status) status.textContent = ui(ok ? 'copied' : 'copyFailed');
      if (!ok) return;
      btn.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(function () { btn.classList.remove('is-copied'); }, 2000);
    }

    function legacyCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }

    btn.addEventListener('click', function () {
      var text = CONFIG.email;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { feedback(true); }, function () { feedback(legacyCopy(text)); });
      } else {
        feedback(legacyCopy(text));
      }
    });
  }

  /* ---------- Ano no rodapé ---------- */
  function initYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  safe('modal', initModal);
  safe('idioma', initLang);
  safe('tema', initTheme);
  safe('menu', initMenu);
  safe('rolagem', initScroll);
  safe('seção ativa', initActiveSection);
  safe('filtros', initFilters);
  safe('copiar e-mail', initCopy);
  safe('ano', initYear);
})();
