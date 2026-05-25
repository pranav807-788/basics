/* ==============================================================
   The Magic Bulb — Storytelling Scroll Experience
   --------------------------------------------------------------
   Architecture
     • A single fixed SVG (#globalBulb) holds five state-groups.
     • A master GSAP timeline tied to ScrollTrigger drives a JS
       state object {x, y, scale}, applied per-frame via onUpdate.
     • The same timeline crossfades the five .bulb-state groups so
       the silhouette and filament transition in lockstep with
       the bulb's path.
     • An ambient radial-gradient layer (#globalGlow) tracks the
       bulb so every section catches the light cast.
     • Per-section interactions (dot matrix, cupboards, tablet
       carousel, wooden door) live in isolated init functions.
   ============================================================== */

(() => {
  'use strict';

  // ---------- GSAP / ScrollTrigger setup ----------
  if (!window.gsap) {
    console.warn('[MagicBulb] GSAP failed to load.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cached refs
  const bulb        = document.getElementById('globalBulb');
  const wire        = document.getElementById('bulbWire');
  const states      = gsap.utils.toArray('.bulb-state');
  const sections    = gsap.utils.toArray('.story-section');
  const navLinks    = gsap.utils.toArray('.nav-link');
  const heroZone    = document.getElementById('heroHoverZone');
  const dotCanvas   = document.getElementById('dotMatrix');
  const tablet      = document.getElementById('tablet');
  const tabletTrack = document.getElementById('tabletTrack');
  const tabletGlare = document.getElementById('tabletGlare');
  const doorHandle  = document.getElementById('doorHandle');
  const doorLeft    = document.getElementById('doorLeft');
  const doorRight   = document.getElementById('doorRight');
  const contactForm = document.getElementById('contactForm');

  /* ============================================================
     1. GLOBAL BULB — scroll-driven motion, morphing, glow
     ============================================================ */

  // Section waypoints, expressed as fractions of viewport (0..1)
  // Five points = five sections. Slight curve via intermediate Y values.
  const waypoints = [
    { x: 0.30, y: 0.18, scale: 1.00, state: 0 }, // S1 hanging, top-center-left
    { x: 0.10, y: 0.50, scale: 0.85, state: 1 }, // S2 wall sconce, left-mid
    { x: 0.50, y: 0.22, scale: 1.00, state: 2 }, // S3 surreal core, top-center
    { x: 0.78, y: 0.52, scale: 0.95, state: 3 }, // S4 table lamp, right-mid
    { x: 0.18, y: 0.20, scale: 0.90, state: 4 }, // S5 vintage lantern, top-left
  ];

  // Live state object that GSAP animates and we apply per frame
  const bulbState = {
    x: waypoints[0].x,
    y: waypoints[0].y,
    scale: waypoints[0].scale,
    glow: 1,
  };

  function applyBulbTransform() {
    const px = bulbState.x * window.innerWidth;
    const py = bulbState.y * window.innerHeight;
    bulb.style.left = px + 'px';
    bulb.style.top  = py + 'px';
    bulb.style.transform =
      `translate(-50%, -50%) scale(${bulbState.scale})`;

    // Glow follows the bulb in viewport space
    document.documentElement.style.setProperty('--glow-x', px + 'px');
    document.documentElement.style.setProperty('--glow-y', py + 'px');
    document.documentElement.style.setProperty(
      '--glow-strength',
      String(bulbState.glow)
    );
    // Larger glow when the bulb is bigger
    document.documentElement.style.setProperty(
      '--glow-radius',
      (38 * bulbState.scale) + 'vmin'
    );
  }
  applyBulbTransform();
  window.addEventListener('resize', applyBulbTransform);

  // Initial state visibility — only state 0 visible
  states.forEach((g, i) => gsap.set(g, { opacity: i === 0 ? 1 : 0 }));

  /* ----- Master timeline: 4 segments (1->2, 2->3, 3->4, 4->5) ----- */
  const master = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: prefersReducedMotion ? false : 1.5, // inertia / lag
    },
    defaults: { ease: 'power1.inOut' },
    onUpdate: applyBulbTransform,
  });

  // For each transition, animate state object across 1 unit of timeline.
  // Crossfade the active SVG group with a slight overlap for liquidity.
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to   = waypoints[i + 1];
    const t    = i; // segment start time

    // --- Path: animate x along a curve by tweening with a midpoint
    // We approximate a cubic-bezier feel by stacking two keyframes.
    master.to(bulbState, {
      x: (from.x + to.x) / 2 + (to.x > from.x ? 0.04 : -0.04),
      y: Math.min(from.y, to.y) + Math.abs(to.y - from.y) * 0.35,
      scale: (from.scale + to.scale) / 2,
      duration: 0.5,
      ease: 'power1.out',
    }, t);
    master.to(bulbState, {
      x: to.x,
      y: to.y,
      scale: to.scale,
      duration: 0.5,
      ease: 'power1.in',
    }, t + 0.5);

    // --- Crossfade SVG state groups in the second half of the segment
    master.to(states[from.state], { opacity: 0, duration: 0.32 }, t + 0.55);
    master.to(states[to.state],   { opacity: 1, duration: 0.32 }, t + 0.55);
  }

  // The hanging wire only exists in section 1 — fade out as we leave
  master.to(wire, { opacity: 0, duration: 0.4 }, 0.4);
  master.set(wire, { display: 'none' }, 0.85);

  /* ============================================================
     2. NAV — active link tracks scroll position
     ============================================================ */
  sections.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          const link = navLinks.find(
            (l) => Number(l.dataset.nav) === i + 1
          );
          if (link) link.classList.add('is-active');
        }
      },
    });
  });

  // Smooth scroll for nav clicks (browser native is fine)
  navLinks.forEach((l) =>
    l.addEventListener('click', (e) => {
      const id = l.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    })
  );

  /* ============================================================
     3. SECTION 1 — Hanging-bulb hover + brand reveal
     ============================================================ */
  // Allow pointer events on the bulb only while we're in section 1
  ScrollTrigger.create({
    trigger: '#section-1',
    start: 'top 80%',
    end: 'bottom 50%',
    onToggle: (self) => {
      document.body.classList.toggle('bulb-hoverable', self.isActive);
      document.body.classList.toggle('section-1-active', self.isActive);
      if (!self.isActive) document.body.classList.remove('bulb-lit');
    },
  });
  // Set initial state — section 1 is active on load
  document.body.classList.add('section-1-active', 'bulb-hoverable');

  const lightOn  = () => document.body.classList.add('bulb-lit');
  const lightOff = () => document.body.classList.remove('bulb-lit');

  // Hover targets: the bulb itself and the hot zone behind it
  [bulb, heroZone].forEach((el) => {
    if (!el) return;
    el.addEventListener('mouseenter', lightOn);
    el.addEventListener('mouseleave', lightOff);
    el.addEventListener('focus', lightOn);
    el.addEventListener('blur', lightOff);
  });

  /* ============================================================
     4. SECTION 1 — Interactive dot matrix (canvas)
     ============================================================ */
  if (dotCanvas) {
    const ctx = dotCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [];
    let mouse = { x: -9999, y: -9999, active: false };

    function buildGrid() {
      const rect = dotCanvas.getBoundingClientRect();
      dotCanvas.width  = rect.width * dpr;
      dotCanvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = 28;
      const cols = Math.floor(rect.width / spacing);
      const rows = Math.floor(rect.height / spacing);
      const offX = (rect.width  - cols * spacing) / 2 + spacing / 2;
      const offY = (rect.height - rows * spacing) / 2 + spacing / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offX + c * spacing;
          const y = offY + r * spacing;
          dots.push({ ox: x, oy: y, x, y });
        }
      }
    }
    buildGrid();
    window.addEventListener('resize', buildGrid);

    dotCanvas.addEventListener('mousemove', (e) => {
      const rect = dotCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    dotCanvas.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -9999; mouse.y = -9999;
    });

    function renderDots() {
      const w = dotCanvas.clientWidth;
      const h = dotCanvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy);
        const radius = 110;

        let tx = d.ox, ty = d.oy, glow = 0.25, size = 1.2;
        if (mouse.active && dist < radius) {
          const f = (1 - dist / radius);
          // Repel slightly along vector, then settle
          tx = d.ox + (dx / dist) * f * 12;
          ty = d.oy + (dy / dist) * f * 12;
          glow = 0.25 + f * 0.6;
          size = 1.2 + f * 1.6;
        }
        // Gentle ease toward target
        d.x += (tx - d.x) * 0.18;
        d.y += (ty - d.y) * 0.18;

        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247,216,150,${glow})`;
        ctx.fill();
      }
      requestAnimationFrame(renderDots);
    }
    requestAnimationFrame(renderDots);
  }

  /* ============================================================
     5. SECTION 3 — Cupboards: keyboard accessibility
     (hover handled by CSS; click/Enter toggles for touch + a11y)
     ============================================================ */
  document.querySelectorAll('.cupboard').forEach((card) => {
    const toggle = () => card.classList.toggle('is-open');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ============================================================
     6. SECTION 4 — Tablet carousel (RTL infinite + cursor scrub)
     ============================================================ */
  if (tabletTrack && tablet) {
    // Duplicate cards for a seamless loop
    const originals = [...tabletTrack.children];
    originals.forEach((c) => tabletTrack.appendChild(c.cloneNode(true)));

    let trackX = 0;
    let baseSpeed = 0.6;        // px per frame, RTL
    let userSpeed = baseSpeed;  // adjusted by cursor X
    let halfWidth = 0;

    function measure() {
      // Width of just the originals (half the cloned track)
      halfWidth = tabletTrack.scrollWidth / 2;
    }
    measure();
    window.addEventListener('resize', measure);

    function tickCarousel() {
      trackX -= userSpeed;
      if (-trackX >= halfWidth) trackX += halfWidth;
      tabletTrack.style.transform = `translateX(${trackX}px)`;
      requestAnimationFrame(tickCarousel);
    }
    requestAnimationFrame(tickCarousel);

    // Cursor-reactive speed: hover -> map mouse X across the screen
    // Left side ≈ slow / nearly paused; right side ≈ much faster.
    tablet.addEventListener('mousemove', (e) => {
      const rect = tablet.getBoundingClientRect();
      const t = (e.clientX - rect.left) / rect.width; // 0..1
      // 0 -> 0.15 (very slow), 1 -> 4.5 (fast scrub)
      userSpeed = 0.15 + t * 4.35;

      // Glare follows mouse X
      if (tabletGlare) {
        const off = (t - 0.5) * 80;
        tabletGlare.style.transform = `translateX(${off}px)`;
      }
    });
    tablet.addEventListener('mouseleave', () => {
      userSpeed = baseSpeed;
      if (tabletGlare) tabletGlare.style.transform = 'translateX(0)';
    });
  }

  /* ============================================================
     7. SECTION 5 — Wooden door 3D split + contact reveal
     ============================================================ */
  let doorOpen = false;

  function openDoor() {
    if (doorOpen) return;
    doorOpen = true;
    document.body.classList.add('door-open');

    // Sweep open with a slight inertia, then bring up the form
    gsap.to(doorLeft, {
      rotateY: -105,
      duration: 1.4,
      ease: 'power3.inOut',
    });
    gsap.to(doorRight, {
      rotateY: 105,
      duration: 1.4,
      ease: 'power3.inOut',
    });

    // After the doors are mostly open, dim the doors so the chamber pops
    gsap.to([doorLeft, doorRight], {
      filter: 'brightness(0.55)',
      duration: 0.8,
      delay: 0.4,
    });
  }

  function closeDoor() {
    if (!doorOpen) return;
    doorOpen = false;
    document.body.classList.remove('door-open');
    gsap.to(doorLeft,  { rotateY: 0, duration: 0.9, ease: 'power3.inOut' });
    gsap.to(doorRight, { rotateY: 0, duration: 0.9, ease: 'power3.inOut' });
    gsap.to([doorLeft, doorRight], { filter: 'brightness(1)', duration: 0.6 });
  }

  if (doorHandle) {
    doorHandle.addEventListener('click', (e) => {
      e.stopPropagation();
      doorOpen ? closeDoor() : openDoor();
    });
    // Hover hint — gentle handle nudge
    doorHandle.addEventListener('mouseenter', () => {
      gsap.to(doorHandle, { x: -2, duration: 0.2 });
    });
    doorHandle.addEventListener('mouseleave', () => {
      gsap.to(doorHandle, { x: 0, duration: 0.2 });
    });
  }

  /* ============================================================
     8. SECTION 5 — Contact form submission feedback
     ============================================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.contact-submit');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Signal sent ✓';
      btn.disabled = true;
      gsap.fromTo(
        btn,
        { scale: 0.96 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      );
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        contactForm.reset();
      }, 2400);
    });
  }

  /* ============================================================
     9. Refresh ScrollTrigger after fonts settle
     ============================================================ */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
