/* =====================================================
   MOBILE MENU
   ===================================================== */
(function () {
  const t = document.getElementById('mobileMenuToggle');
  const m = document.getElementById('mobileNav');
  if (!t || !m) return;
  const icon = t.querySelector('i');
  const close = () => {
    m.classList.remove('open');
    t.setAttribute('aria-expanded', 'false');
    icon.className = 'fa-solid fa-bars';
  };
  t.addEventListener('click', () => {
    const open = m.classList.toggle('open');
    t.setAttribute('aria-expanded', open);
    icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  m.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* =====================================================
   SLIDER HERO + PRELOADER   (poori file mein hero ka code sirf EK baar)
   ===================================================== */
(function () {
  const root  = document.getElementById('home');
  const stage = document.getElementById('tsStage');
  const pl    = document.getElementById('preloader');
  const unlock = () => document.body.classList.remove('pl-lock');

  if (!root || !stage || !root.classList.contains('ts')) {
    if (pl) pl.remove();
    unlock();
    return;
  }

  /* ---------- SETTINGS (yahan badlo) ---------- */
  const WHATSAPP  = '923001234567';    // apna WhatsApp number (country code ke saath, bina +)
  const FOLDER    = 'assets/images/';  // images ka folder
  const AUTO      = true;              // false karo to slider khud nahi chalega
  const INTRO_MS  = 4200;              // intro screen kitni der dikhe (ms)
  const SLIDE_MS  = 5200;              // har flavour kitni der dikhe (ms)
  const LOGO_MS   = 1100;              // preloader mein logo kam az kam kitni der (ms)
  const FRAME_MS  = 300;               // har flavour kitni der (5 x 300 = 1.5 sec)
  const EXPAND_MS = 1000;              // circle poori screen kitni der mein bhare (ms)
  const LOAD_MAX  = 6000;              // images ka max intezar (ms)
  const INTRO     = { bg: '#FFBFCB', ink: '#A32B58' };

  const DATA = [
    { word: 'STRAWBERRY', name: 'Strawberry Cupcake', emo: '🧁',
      desc: 'Fluffy vanilla sponge with silky strawberry cream and a fresh berry on top.',
      bg: '#FFB3C6', ink: '#F0214F', main: 'strawberry.png', ing: 's1.jpg' },
    { word: 'CHOCOLATE', name: 'Double Chocolate Cupcake', emo: '🍫',
      desc: 'Deep cocoa flavour topped with velvety chocolate cream and shavings.',
      bg: '#E7BEA6', ink: '#A5623B', main: 'chocolate.png', ing: 'c1.jpg' },
    { word: 'MANGO', name: 'Golden Mango Cupcake', emo: '🥭',
      desc: 'Sun-ripened mango cream, naturally smooth with tropical warmth.',
      bg: '#FFE595', ink: '#E5301F', main: 'mango.png', ing: 'm1.jpg' },
    { word: 'PISTACHIO', name: 'Pistachio Cupcake', emo: '🧁',
      desc: 'Roasted pistachios folded into a creamy, buttery, nutty frosting.',
      bg: '#D3E18B', ink: '#6C9A2C', main: 'pista.png', ing: 'p1.jpg' },
    { word: 'VANILLA', name: 'Vanilla Bean Cupcake', emo: '🧁',
      desc: 'Classic vanilla made with rich, creamy depth and delicate sweetness.',
      bg: '#FBEEDF', ink: '#E5483E', main: 'vanilla.png', ing: 'v1.jpg' }
  ];
  const INTRO_ORDER = [3, 2, 4, 0, 1];

  const calm  = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine  = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- elements ---------- */
  const slidesEl = document.getElementById('tsSlides');
  const pk       = document.getElementById('tsPk');
  const thumbsEl = document.getElementById('tsThumbs');
  const buy      = document.getElementById('tsBuy');
  const F = f => FOLDER + f;

  /* ---------- build slides ---------- */
  slidesEl.innerHTML = DATA.map((d, i) => {
    const L = [...d.word].map((c, k) => `<i style="--i:${k}">${c}</i>`).join('');
    return `
    <article class="ts-slide" data-i="${i}">
      <h2 class="ts-sr">${d.name}</h2>
      <div class="ts-word" aria-hidden="true"><span class="w">${L}</span><span class="wb">${L}</span></div>
      <div class="ts-bgi"><img data-ko="1" data-src="${F(d.ing)}" alt=""></div>
      <div class="ts-ing ia"><img data-ko="1" data-src="${F(d.ing)}" alt=""></div>
      <div class="ts-ing ib"><img data-ko="1" data-src="${F(d.ing)}" alt=""></div>
      <div class="ts-mainwrap"><div class="ts-main">
        <span class="ts-emo">${d.emo}</span>
        <img data-src="${F(d.main)}" data-alt="${d.name}" alt="">
      </div></div>
      <p class="ts-desc"><b>${d.name}</b>${d.desc}</p>
    </article>`;
  }).join('');
  const slides = [...slidesEl.children];

  pk.innerHTML = INTRO_ORDER.map((idx, k) => {
    const d = DATA[idx];
    return `<div class="ts-pi p${idx}" data-go="${idx}" role="button" aria-label="${d.name}" tabindex="0">
      <div class="ts-pii" style="--dl:${(k * 0.12).toFixed(2)}s">
        <span class="ts-emo">${d.emo}</span>
        <img data-src="${F(d.main)}" data-alt="${d.name}" alt="">
      </div></div>`;
  }).join('');

  thumbsEl.innerHTML = DATA.map((d, i) =>
    `<button class="ts-thumb" data-go="${i}" aria-label="${d.name}" style="background:${d.ink}">
       <span class="tm">${d.emo}</span><img data-src="${F(d.main)}" alt="">
     </button>`).join('');
  const thumbs = [...thumbsEl.children];

  /* =====================================================
     IMAGE CLEAN (hero): white/checkerboard background hatao + crop
     file:// par canvas block ho to ingredient image multiply blend se ghul jati hai
     ===================================================== */
  const cache = {};
  function process(im) {
    const s = Math.min(1, 900 / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * s), h = Math.round(im.naturalHeight * s);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(im, 0, 0, w, h);
    const id = x.getImageData(0, 0, w, h), p = id.data;

    const isBg = i => {
      if (p[i + 3] < 10) return true;
      const r = p[i], g = p[i + 1], b = p[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      return mn > 178 && mx - mn < 16;
    };
    const gone = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    let sp = 0;
    const seed = (px, py) => {
      const k = py * w + px;
      if (!gone[k] && isBg(k * 4)) { gone[k] = 1; stack[sp++] = k; }
    };
    for (let px = 0; px < w; px++) { seed(px, 0); seed(px, h - 1); }
    for (let py = 0; py < h; py++) { seed(0, py); seed(w - 1, py); }
    while (sp) {
      const k = stack[--sp], px = k % w, py = (k / w) | 0;
      if (px > 0)     seed(px - 1, py);
      if (px < w - 1) seed(px + 1, py);
      if (py > 0)     seed(px, py - 1);
      if (py < h - 1) seed(px, py + 1);
    }
    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const k = py * w + px, i = k * 4;
        if (gone[k]) { p[i + 3] = 0; continue; }
        const edge = (px > 0 && gone[k - 1]) || (px < w - 1 && gone[k + 1]) || (py > 0 && gone[k - w]) || (py < h - 1 && gone[k + w]);
        if (edge) {
          const mx = Math.max(p[i], p[i + 1], p[i + 2]), mn = Math.min(p[i], p[i + 1], p[i + 2]);
          if (mn > 165 && mx - mn < 30) p[i + 3] = 110;
        }
        if (p[i + 3] > 20) {
          if (px < x0) x0 = px; if (px > x1) x1 = px;
          if (py < y0) y0 = py; if (py > y1) y1 = py;
        }
      }
    }
    x.putImageData(id, 0, 0);
    if (x1 <= x0 || y1 <= y0) return c.toDataURL('image/png');
    const pad = Math.round(Math.max(w, h) * 0.01);
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
    x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
    const o = document.createElement('canvas');
    o.width = cw; o.height = ch;
    o.getContext('2d').drawImage(c, x0, y0, cw, ch, 0, 0, cw, ch);
    return o.toDataURL('image/png');
  }
  function loadClean(src) {
    if (cache[src]) return cache[src];
    return (cache[src] = new Promise(res => {
      const im = new Image();
      im.onload = () => {
        try { res({ url: process(im), raw: false }); }
        catch (e) { res({ url: src, raw: true }); }   // canvas block (file://)
      };
      im.onerror = () => res(null);                    // file nahi mili
      im.src = src;
    }));
  }

  function showEmoji(img) {
    img.style.display = 'none';
    const prev = img.previousElementSibling;
    if (prev && (prev.classList.contains('ts-emo') || prev.classList.contains('tm'))) prev.classList.add('show');
  }
  function applyImg(img) {
    return loadClean(img.dataset.src).then(r => {
      if (!r) { showEmoji(img); return; }
      return new Promise(res => {
        img.addEventListener('load', () => { img.alt = img.dataset.alt || ''; res(); }, { once: true });
        img.addEventListener('error', () => { showEmoji(img); res(); }, { once: true });
        if (r.raw && img.dataset.ko) {
          const box = img.closest('.ts-ing, .ts-bgi');
          if (box) box.classList.add('blend');
        } else {
          img.classList.add('ok');
        }
        img.src = r.url;
      });
    });
  }
  const loads = [...root.querySelectorAll('img[data-src]')].map(applyImg);

  /* ---------- sizing ---------- */
  function fit() {
    root.style.setProperty('--vh', (stage.clientHeight / 100) + 'px');
    const W = stage.clientWidth, H = stage.clientHeight;
    slides.forEach(s => {
      const w = s.querySelector('.ts-word');
      w.style.fontSize = '100px';
      const base = w.querySelector('.w').offsetWidth || 1;
      let size = 100 * (W * (W < 820 ? 0.92 : 0.86)) / base;
      size = Math.min(size, H * (W < 820 ? 0.3 : 0.5));
      w.style.fontSize = size + 'px';
    });
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);

  /* ---------- state ---------- */
  let cur = -1, mode = 'intro', locked = false;

  function theme(t) {
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--ink', t.ink);
  }
  function setBuy(i) {
    const txt = encodeURIComponent(`Hi Temptations Bakery! I'd like to order: ${DATA[i].name}`);
    buy.href = `https://wa.me/${WHATSAPP}?text=${txt}`;
  }
  function leaveCurrent() {
    if (cur < 0) return;
    const old = slides[cur];
    old.classList.remove('on');
    old.classList.add('leave');
    setTimeout(() => old.classList.remove('leave'), 850);
    thumbs[cur].classList.remove('on');
  }
  function show(i, dir) {
    root.style.setProperty('--d', dir);
    void root.offsetWidth;
    leaveCurrent();
    cur = i;
    slides[i].classList.add('on');
    thumbs[i].classList.add('on');
    theme(DATA[i]);
    setBuy(i);
  }
  function lock() { locked = true; setTimeout(() => (locked = false), 900); }

  function enter(i) {
    if (locked) return;
    lock();
    mode = 'slider';
    root.dataset.mode = 'slider';
    show(i, 1);
  }
  function go(i, dir) {
    if (mode !== 'slider' || locked) return;
    i = (i + DATA.length) % DATA.length;
    if (i === cur) return;
    lock();
    show(i, dir);
  }
  function toIntro() {
    if (mode === 'intro') return;
    mode = 'intro';
    root.dataset.mode = 'intro';
    leaveCurrent();
    cur = -1;
    theme(INTRO);
  }

  /* =====================================================
     AUTOPLAY: intro -> flavour 1 -> 2 -> 3 -> 4 -> 5 -> 1 ...
     ===================================================== */
  let timer = null, inView = true, paused = false;
  function schedule(ms) {
    clearTimeout(timer);
    if (!AUTO) return;
    timer = setTimeout(tick, ms);
  }
  function tick() {
    const ok = inView && !document.hidden;
    if (!ok) { paused = true; timer = setTimeout(tick, 500); return; }
    if (paused) { paused = false; schedule(1800); return; }
    if (mode === 'intro') enter(0);
    else go(cur + 1, 1);
    schedule(SLIDE_MS);
  }
  function manual(fn) {
    fn();
    schedule(mode === 'intro' ? INTRO_MS : SLIDE_MS);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(e => { inView = e[0].isIntersecting; }, { threshold: 0.35 }).observe(root);
  }

  /* ---------- events ---------- */
  document.getElementById('tsExplore').addEventListener('click', () => manual(() => enter(0)));
  document.getElementById('tsBack').addEventListener('click',    () => manual(toIntro));
  document.getElementById('tsUp').addEventListener('click',      () => manual(() => go(cur - 1, -1)));
  document.getElementById('tsDown').addEventListener('click',    () => manual(() => go(cur + 1, 1)));

  stage.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (!t) return;
    const i = +t.dataset.go;
    manual(() => { if (mode === 'intro') enter(i); else go(i, i > cur ? 1 : -1); });
  });
  stage.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.ts-pi')) {
      e.preventDefault(); manual(() => enter(+e.target.dataset.go));
    }
  });
  document.addEventListener('keydown', e => {
    const r = root.getBoundingClientRect();
    if (r.bottom < 100 || r.top > innerHeight - 100) return;
    if (e.key === 'ArrowRight') manual(() => go(cur + 1, 1));
    if (e.key === 'ArrowLeft')  manual(() => go(cur - 1, -1));
  });

  let sx = 0, sy = 0;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      const dir = dx < 0 ? 1 : -1;
      manual(() => go(cur + dir, dir));
    }
  }, { passive: true });

  if (fine && !calm) {
    stage.addEventListener('mousemove', e => {
      const rr = stage.getBoundingClientRect();
      root.style.setProperty('--px', ((e.clientX - rr.left) / rr.width  - 0.5) * 2);
      root.style.setProperty('--py', ((e.clientY - rr.top)  / rr.height - 0.5) * 2);
      if (mode !== 'slider' || cur < 0) return;
      const w = slides[cur].querySelector('.ts-word');
      const r = w.getBoundingClientRect();
      w.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      w.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    stage.addEventListener('mouseleave', () => {
      root.style.setProperty('--px', 0);
      root.style.setProperty('--py', 0);
      slides.forEach(s => {
        const w = s.querySelector('.ts-word');
        w.style.setProperty('--mx', '-999px');
        w.style.setProperty('--my', '-999px');
      });
    });
  }

  /* =====================================================
     PRELOADER: logo -> 5 flavours -> circle poori screen -> home page
     ===================================================== */
  const plCircle = document.getElementById('plCircle');
  const plLogo   = document.getElementById('plLogo');
  const plImg    = document.getElementById('plImg');
  const plEmo    = document.getElementById('plEmo');
  const plName   = document.getElementById('plName');

  const decode = url => new Promise(res => {
    const i = new Image();
    i.onload = i.onerror = () => res();
    i.src = url;
    if (i.decode) i.decode().then(res, res);
  });

  function setFrame(i, f) {
    const d = DATA[i];
    plCircle.style.backgroundColor = d.bg;
    plName.textContent = d.word;
    if (plLogo) plLogo.style.display = 'none';
    if (f) {
      plEmo.style.display = 'none';
      plImg.style.display = 'block';
      plImg.src = f.url;
      plImg.classList.remove('pop');
      void plImg.offsetWidth;
      plImg.classList.add('pop');
    } else {
      plImg.style.display = 'none';
      plEmo.textContent = d.emo;
      plEmo.style.display = 'grid';
    }
  }

  function expand() {
    return new Promise(res => {
      const r  = plCircle.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const far = Math.max(
        Math.hypot(cx, cy), Math.hypot(innerWidth - cx, cy),
        Math.hypot(cx, innerHeight - cy), Math.hypot(innerWidth - cx, innerHeight - cy)
      );
      plCircle.style.setProperty('--fill', (far * 2 / r.width) * 1.04);
      pl.classList.add('pl-expand');
      plCircle.classList.add('fill');
      plCircle.style.backgroundColor = INTRO.bg;
      setTimeout(res, EXPAND_MS);
    });
  }

  async function boot() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    await Promise.all([
      Promise.race([Promise.all(loads), sleep(LOAD_MAX)]),
      sleep(LOGO_MS)
    ]);

    if (pl && plCircle) {
      const frames = await Promise.all(DATA.map(d => loadClean(F(d.main))));
      await Promise.all(frames.map(f => (f ? decode(f.url) : null)));
      for (let i = 0; i < DATA.length; i++) {
        setFrame(i, frames[i]);
        await sleep(FRAME_MS);
      }
      await expand();
    }
  }

  function finish() {
    fit();
    root.classList.add('ready');
    if (pl) {
      pl.classList.add('pl-gone');
      setTimeout(() => pl.remove(), 700);
    }
    unlock();
    schedule(INTRO_MS);
  }

  theme(INTRO);
  boot().then(finish, finish);
})();

/* =====================================================
   FOOTER: images ka background hatana + reveal + subscribe
   ===================================================== */
(function () {
  const ft = document.querySelector('.ft');
  if (!ft) return;

  const FOLDER = 'assets/images/';
  const EXTS   = ['png', 'webp', 'jpg', 'jpeg'];     // har naam ke saath ye extension try hote hain
  const imgs   = [...ft.querySelectorAll('img[data-clean]')];

  const loadImg = src => new Promise(res => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });

  /* border ke rang se milta background flood-fill se hatao, phir crop */
  function clean(im) {
    const s = Math.min(1, 900 / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * s), h = Math.round(im.naturalHeight * s);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(im, 0, 0, w, h);
    const id = x.getImageData(0, 0, w, h), p = id.data;      // file:// par yahin error aata hai

    let R = 0, G = 0, B = 0, n = 0;
    [[3, 3], [w - 4, 3], [3, h - 4], [w - 4, h - 4]].forEach(([a, b]) => {
      const i = (b * w + a) * 4;
      if (p[i + 3] > 200) { R += p[i]; G += p[i + 1]; B += p[i + 2]; n++; }
    });
    if (n) { R /= n; G /= n; B /= n; }
    const TOL = 62;
    const dist = i => Math.hypot(p[i] - R, p[i + 1] - G, p[i + 2] - B);
    const isBg = i => p[i + 3] < 10 || (n > 0 && dist(i) < TOL);

    const gone = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    let sp = 0;
    const seed = (px, py) => {
      const k = py * w + px;
      if (!gone[k] && isBg(k * 4)) { gone[k] = 1; stack[sp++] = k; }
    };
    for (let px = 0; px < w; px++) { seed(px, 0); seed(px, h - 1); }
    for (let py = 0; py < h; py++) { seed(0, py); seed(w - 1, py); }
    while (sp) {
      const k = stack[--sp], px = k % w, py = (k / w) | 0;
      if (px > 0)     seed(px - 1, py);
      if (px < w - 1) seed(px + 1, py);
      if (py > 0)     seed(px, py - 1);
      if (py < h - 1) seed(px, py + 1);
    }

    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const k = py * w + px, i = k * 4;
        if (gone[k]) { p[i + 3] = 0; continue; }
        const edge = (px > 0 && gone[k - 1]) || (px < w - 1 && gone[k + 1]) || (py > 0 && gone[k - w]) || (py < h - 1 && gone[k + w]);
        if (edge && n) {
          const d = dist(i);
          if (d < TOL * 1.8) p[i + 3] = Math.round(255 * Math.min(1, Math.max(0, (d - TOL) / (TOL * 0.8))));
        }
        if (p[i + 3] > 20) {
          if (px < x0) x0 = px; if (px > x1) x1 = px;
          if (py < y0) y0 = py; if (py > y1) y1 = py;
        }
      }
    }
    x.putImageData(id, 0, 0);
    if (x1 <= x0 || y1 <= y0) return c.toDataURL('image/png');
    const pad = Math.round(Math.max(w, h) * 0.01);
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
    x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
    const o = document.createElement('canvas');
    o.width = cw; o.height = ch;
    o.getContext('2d').drawImage(c, x0, y0, cw, ch, 0, 0, cw, ch);
    return o.toDataURL('image/png');
  }

  async function run(img) {
    const kind  = img.dataset.clean;                          // "white" ya "pink"
    const bases = (img.dataset.base || '').split('|');         // pehli mili hui file use hoti hai
    for (const b of bases) {
      for (const e of EXTS) {
        const src = FOLDER + b + '.' + e;
        const im = await loadImg(src);
        if (!im) continue;
        let url = src, ok = false;
        try { url = clean(im); ok = true; } catch (err) { /* canvas block */ }
        if (!ok) img.classList.add(kind === 'pink' ? 'ft-ko-pink' : 'ft-ko-white');   // SVG filter fallback
        img.addEventListener('load', () => img.classList.add('ready'), { once: true });
        img.src = url;
        return;
      }
    }
    img.style.display = 'none';                               // koi file nahi mili
  }
  imgs.forEach(run);

  /* scroll par ek ek karke aaye */
  const rv = [...ft.querySelectorAll('.ft-rv')];
  if ('IntersectionObserver' in window) {
    ft.classList.add('ft-js');
    rv.forEach((el, i) => { el.style.transitionDelay = (i % 5) * 80 + 'ms'; });
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        o.unobserve(en.target);
      });
    }, { threshold: 0.1 });
    rv.forEach(el => obs.observe(el));
  }

  /* subscribe form (abhi demo: sirf thank you dikhata hai) */
  const form = document.getElementById('ftForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button span');
      const input = form.querySelector('input');
      const old = btn.textContent;
      btn.textContent = 'Thank you!';
      input.value = '';
      setTimeout(() => { btn.textContent = old; }, 3000);
    });
  }
})();