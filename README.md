# Lumen — Living Kitchens

A cinematic, scroll-storytelling site for a smart-kitchen studio. Dark premium
aesthetic, hanging-bulb hero that travels across the page, glassmorphism cards,
GSAP-pinned horizontal showcase, glowing process timeline, floating story
section, rotating testimonials, and a glowing contact form.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (entrance, scroll-linked transforms, micro-interactions)
- GSAP + ScrollTrigger (pinned horizontal showcase, per-card parallax)
- Lenis (smooth scrolling, synchronized with GSAP)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview
```

## Structure

```
src/
  App.tsx                  # composition root
  index.css                # tokens, utilities, glass / beam / spotlight
  lib/useLenis.ts          # smooth scroll + ScrollTrigger sync
  components/
    BulbScene.tsx          # global hanging bulb that morphs across scroll
    Navigation.tsx         # blur-on-scroll header
    Hero.tsx               # word-by-word headline, kitchen reveal, CTAs
    WhatWeDo.tsx           # floating glass service cards + particles
    Showcase.tsx           # GSAP pinned horizontal scroll, per-image parallax
    HowWeWork.tsx          # scroll-filled glowing process timeline
    BehindMagic.tsx        # floating kitchen objects, cinematic copy reveal
    Testimonials.tsx       # rotating glass carousel with side depth cards
    Contact.tsx            # form with glow focus, contact rows, footer
    Particles.tsx          # canvas-based light particle field
```

## Notes on the cinematic system

- The hanging bulb is rendered once globally and bound to `useScroll`. Its cord
  lengthens, the bulb migrates upward, and its light cone stretches downward
  as the user scrolls — so every section is lit by the same source.
- Sections never abruptly cut: each uses radial-gradient seams and shared
  ambient lighting for a continuous transformation.
- Animations are GPU-friendly (transform / opacity / filter) and respect
  prefers-reduced-motion via Lenis defaults.
