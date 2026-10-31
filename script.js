(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (_) {}
  if (saved) root.dataset.theme = saved;
  $('#themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (_) {}
  });

  /* ---------- Mobile menu ---------- */
  const links = $('#navLinks');
  $('#menuBtn').addEventListener('click', () => links.classList.toggle('open'));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  /* ---------- Scroll: progress, nav, active link ---------- */
  const progress = $('#progress'), nav = $('#nav');
  const sections = $$('main section[id]');
  const onScroll = () => {
    const h = document.documentElement;
    progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 20);
    let cur = '';
    sections.forEach(s => { if (h.scrollTop + 140 >= s.offsetTop) cur = s.id; });
    $$('#navLinks a:not(.btn)').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Cursor glow ---------- */
  const glow = $('.cursor-glow');
  window.addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });

  /* ---------- Reveal on scroll + count up ---------- */
  const countUp = el => {
    const target = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1600;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      const c = $('[data-count]', en.target);
      if (c && !c.dataset.done) { c.dataset.done = 1; countUp(c); }
      io.unobserve(en.target);
    });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- 3D tilt on cards ---------- */
  if (matchMedia('(hover:hover)').matches) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }

  /* ---------- Case filters ---------- */
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#filters button').forEach(x => x.classList.toggle('active', x === b));
    $$('#cases .case').forEach(c => {
      c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.p !== b.dataset.f);
    });
  });

  /* ---------- Gallery: real screenshots + filters ---------- */
  // If a figure has data-img="images/file.jpg", swap the mock for the real screenshot.
  $$('#gallery-grid .shot-card').forEach(card => {
    const src = card.dataset.img;
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.alt = $('figcaption b', card).textContent;
    img.loading = 'lazy';
    img.onload = () => { $('.shot', card).replaceWith(img); };
  });

  $('#gFilters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#gFilters button').forEach(x => x.classList.toggle('active', x === b));
    $$('#gallery-grid .shot-card').forEach(c => {
      c.classList.toggle('hide', b.dataset.g !== 'all' && c.dataset.g !== b.dataset.g);
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox'), lbInner = $('#lbInner'), lbCap = $('#lbCap');
  const openLb = card => {
    const media = $('.shot, img', card).cloneNode(true);
    lbInner.replaceChildren(media);
    lbCap.textContent = $('figcaption b', card).textContent + ' · ' + $('figcaption span', card).textContent;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  $('#gallery-grid').addEventListener('click', e => {
    const card = e.target.closest('.shot-card'); if (card) openLb(card);
  });
  $('#lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* ---------- Hero chart (no library) ---------- */
  const canvas = $('#heroChart'), ctx = canvas.getContext('2d');
  const data = [1.9, 2.3, 2.1, 2.9, 3.4, 3.2, 4.1, 4.6, 4.4, 5.2, 5.5, 5.8];
  let prog = 0;
  function drawChart() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = 170;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const max = 6.5, pad = 6;
    const pts = data.map((v, i) => [pad + i * (w - pad * 2) / (data.length - 1), h - 10 - (v / max) * (h - 24)]);
    const n = Math.max(2, Math.floor(prog * pts.length));
    const vis = pts.slice(0, n);
    ctx.strokeStyle = 'rgba(150,155,200,.15)'; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const y = 10 + i * (h - 20) / 3; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(108,92,255,.45)'); g.addColorStop(1, 'rgba(108,92,255,0)');
    ctx.beginPath(); ctx.moveTo(vis[0][0], h);
    vis.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(vis[vis.length - 1][0], h); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    const lg = ctx.createLinearGradient(0, 0, w, 0);
    lg.addColorStop(0, '#6c5cff'); lg.addColorStop(.6, '#00d4ff'); lg.addColorStop(1, '#ff4d8d');
    ctx.beginPath(); vis.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.strokeStyle = lg; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
    const l = vis[vis.length - 1];
    ctx.beginPath(); ctx.arc(l[0], l[1], 5, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(l[0], l[1], 9, 0, 7); ctx.strokeStyle = 'rgba(0,212,255,.5)'; ctx.stroke();
  }
  function animateChart() {
    prog = Math.min(prog + 0.02, 1);
    drawChart();
    $('#roasLive').textContent = data[Math.max(0, Math.floor(prog * data.length) - 1)].toFixed(1) + 'x';
    if (prog < 1) requestAnimationFrame(animateChart);
  }
  animateChart();
  window.addEventListener('resize', drawChart);

  /* ---------- ROAS calculator ---------- */
  const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
  function calc() {
    const budget = +$('#cBudget').value || 0, aov = +$('#cAov').value || 0;
    const margin = Math.min(Math.max(+$('#cMargin').value || 1, 1), 100) / 100;
    const roas = +$('#cRoas').value;
    $('#roasVal').textContent = roas.toFixed(1);
    const rev = budget * roas, orders = aov ? rev / aov : 0;
    const be = 1 / margin;
    const profit = rev * margin - budget;
    $('#oRev').textContent = fmt(rev);
    $('#oOrders').textContent = Math.round(orders).toLocaleString('en-US');
    $('#oBE').textContent = be.toFixed(2) + 'x';
    const p = $('#oProfit');
    p.textContent = (profit < 0 ? '-' : '+') + fmt(Math.abs(profit));
    p.className = profit < 0 ? 'neg' : 'pos';
  }
  ['cBudget', 'cAov', 'cMargin', 'cRoas'].forEach(id => $('#' + id).addEventListener('input', calc));
  calc();
/* ---------- Newsletter (Formspree, no page reload) ---------- */
$('#newsletter').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target, msg = $('#nlMsg');
  msg.style.color = '';
  msg.textContent = 'Subscribing...';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      msg.textContent = 'Thanks! You are on the list.';
      form.reset();
    } else {
      msg.style.color = '#ff6b81';
      msg.textContent = 'Something went wrong. Please try again.';
    }
  } catch (_) {
    msg.style.color = '#ff6b81';
    msg.textContent = 'Network error. Please try again.';
  }
});
    /* ---------- Contact form → WhatsApp ---------- */
  // Put your WhatsApp number here (country code, no + sign).
  const WA_NUMBER = '8801605321372';
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const text = `Hello! My name is ${f.get('name')}.\nBusiness/website: ${f.get('biz') || '-'}\nPlatform: ${f.get('platform')}\nGoal & budget: ${f.get('msg') || '-'}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
})();
