/*HERO */
/* ================= HERO: parallax + floating sweets ================= */
(function () {
  const hero = document.querySelector('.hx-hero');
  if (!hero) return;
  const bg  = document.getElementById('hxBg');
  const fx  = document.getElementById('hxFx');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  if (fine && !calm) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      bg.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
    });
    hero.addEventListener('mouseleave', () => bg.style.transform = '');
  }

  if (!calm) {
    const items = ['💗', '✨', '⭐', '🌸', '🍓', '💖'];
    const colors = ['#EE3A80', '#F7B731', '#7ED0C3', '#F6A9C6'];
    const count = window.innerWidth < 820 ? 8 : 16;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'hx-p';
      if (Math.random() > 0.4) {
        p.textContent = items[Math.floor(Math.random() * items.length)];
        p.style.fontSize = (12 + Math.random() * 14) + 'px';
      } else {
        p.style.width  = '5px';
        p.style.height = (14 + Math.random() * 8) + 'px';
        p.style.borderRadius = '5px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
      }
      p.style.left = (Math.random() * 100) + '%';
      p.style.setProperty('--sx', (Math.random() * 120 - 60) + 'px');
      p.style.animationDuration = (9 + Math.random() * 9) + 's';
      p.style.animationDelay = (-Math.random() * 14) + 's';
      fx.appendChild(p);
    }
  }
})();

/*ZIG ZAG */

/* TEMPTATIONS BAKERY — ZIGZAG SCROLL REVEAL */

(() => {
  const sections = document.querySelectorAll(
    ".tb-zigzag-section"
  );

  if (!sections.length) return;

  sections.forEach((section) => {
    const rows = section.querySelectorAll(
      ".tb-zigzag-row"
    );

    // Show everything if IntersectionObserver is unavailable
    if (!("IntersectionObserver" in window)) {
      rows.forEach((row) => {
        row.classList.add("tb-zigzag-visible");
      });
      return;
    }

    // Enable the reveal animation only after JS initializes
    section.classList.add("tb-zigzag-js");

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("tb-zigzag-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    rows.forEach((row) => {
      observer.observe(row);
    });
  });
})();


/*CENTER CAKE */

