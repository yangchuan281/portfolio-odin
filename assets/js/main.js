/* ═══════════════════════════════════════════════════════════════
   Dwarf Tiger — portfolio interactions
   No dependencies. Everything degrades gracefully if JS fails:
   content is in the HTML, so nothing critical depends on JS.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Year ─────────────────────────────────────────────────── */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Theme ────────────────────────────────────────────────── */
  (function theme() {
    var btn = $('#themeBtn');
    if (!btn) return;

    var SUN  = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
    var MOON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';

    function apply(mode) {
      document.documentElement.setAttribute('data-theme', mode);
      btn.innerHTML = mode === 'dark' ? SUN : MOON;
      btn.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', mode === 'dark' ? '#06070a' : '#f3f5f2');
      try { localStorage.setItem('odin-theme', mode); } catch (e) {}
    }

    apply(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
    });
  })();

  /* ── Live clock ───────────────────────────────────────────── */
  (function clock() {
    var out = $('#clockTxt');
    if (!out) return;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function draw() {
      var d = new Date();
      out.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    draw();
    setInterval(draw, 1000);
  })();

  /* ── Welcome gate ─────────────────────────────────────────────
     Home page only. Any click, any key: the door opens. Returning from
     a project page does not re-gate you — you already came in once.
     With JS off the gate is display:none (only html.js shows it), and
     if this file dies the boot script drops html.js after 1.5s. */
  var gateWasOpen = false;

  (function gate() {
    var el = $('#gate');
    if (!el) return;

    /* Arriving from the case pages is not a first visit. */
    var back = false;
    try {
      var ref = document.referrer || '';
      if (ref.indexOf(location.origin) === 0) {
        var path = ref.slice(location.origin.length).split(/[?#]/)[0];
        back = path === '/projects.html' || path.indexOf('/projects/') === 0;
      }
    } catch (e) {}
    if (back) {
      if (el.parentNode) el.parentNode.removeChild(el);
      return;
    }

    gateWasOpen = true;
    document.documentElement.classList.add('gate-open');

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;

      document.documentElement.classList.remove('gate-open');
      el.classList.add('is-out');

      var drop = function () { if (el.parentNode) el.parentNode.removeChild(el); };
      if (reduced) drop(); else setTimeout(drop, 560);

      document.dispatchEvent(new CustomEvent('odin:entered'));
    }

    el.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      /* the language switch lives on the gate — Enter there is not "enter" */
      if (e.target && e.target.closest && e.target.closest('#gateLang')) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') close();
    });
  })();

  /* ── Typewriter (hero command) ────────────────────────────── */
  (function typewriter() {
    var el = $('#typed');
    if (!el) return;
    var text = el.getAttribute('data-text') || '';
    var started = false;

    if (reduced) { el.textContent = text; return; }

    function start() {
      if (started) return;
      started = true;

      var i = 0;
      el.textContent = '';
      setTimeout(function loop() {
        el.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(loop, 14 + Math.random() * 22);
      }, gateWasOpen ? 260 : 480);
    }

    /* Behind the gate there is nobody to read it — type on the way in. */
    if (gateWasOpen) {
      document.addEventListener('odin:entered', start, { once: true });
    } else {
      start();
    }
  })();

  /* ── Scroll reveal ────────────────────────────────────────── */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      window.__odinReady = true;
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (n) { io.observe(n); });
    window.__odinReady = true;

    /* Safety net: if the observer never fires (or throttled iframes don't
       report intersection), anything already inside the viewport at 1.2s
       is shown anyway. Items further down keep their scroll reveal. */
    setTimeout(function () {
      items.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) n.classList.add('is-in');
      });
    }, 1200);
  })();

  /* ── Nav: stuck state + active section ───────────────────── */
  (function nav() {
    var bar = $('#nav');
    var links = $$('.nav__links a');

    var onScroll = function () {
      if (!bar) return;
      bar.classList.toggle('is-stuck', window.scrollY > 14);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (a) {
      /* Single-page anchors only. Cross-page links (projects.html,
         index.html#about on a detail page) are marked is-active in the
         markup and must not clear it. */
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      var id = href.slice(1);
      if (id) map[id] = a;
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        if (map[id]) map[id].classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  })();

  /* ── Spotlight cursor glow (pointer devices only) ─────────── */
  (function spotlight() {
    if (reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var el = $('#spotlight');
    if (!el) return;

    var x = 0, y = 0, raf = null;
    document.body.classList.add('has-pointer');

    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        raf = null;
      });
    }, { passive: true });
  })();

  /* ── Copy email ───────────────────────────────────────────── */
  (function copy() {
    var btn = $('#copyBtn');
    if (!btn) return;

    function flash() {
      btn.classList.add('is-copied');
      setTimeout(function () { btn.classList.remove('is-copied'); }, 1900);
    }

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(flash).catch(fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); flash(); } catch (e) { /* mailto already handy */ }
        document.body.removeChild(ta);
      }
    });
  })();

  /* ── Screenshot lightbox ──────────────────────────────────── */
  (function lightbox() {
    var box = $('#lb');
    var img = $('#lbImg');
    var cap = $('#lbCap');
    var closeBtn = $('#lbClose');
    if (!box || !img) return;

    var returnTo = null;

    function open(shot) {
      var full = shot.getAttribute('data-full');
      if (!full) return;
      var label = shot.getAttribute('data-cap');
      if (!label) {
        var c = shot.querySelector('.shot__cap');
        label = c ? c.textContent : '';
      }
      img.src = full;
      img.alt = label || 'screenshot';
      if (cap) cap.textContent = label || '';
      returnTo = shot;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (box.hidden) return;
      box.hidden = true;
      document.body.style.overflow = '';
      if (returnTo && returnTo.focus) returnTo.focus();
      returnTo = null;
    }

    $$('.shot').forEach(function (shot) {
      shot.addEventListener('click', function () { open(shot); });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb__fig')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  /* ── Mobile menu ──────────────────────────────────────────── */
  (function burger() {
    var btn = $('#burger');
    var menu = $('#navLinks');
    if (!btn || !menu) return;

    function close() {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    $$('a', menu).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

})();
