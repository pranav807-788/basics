# The Magic Bulb

A cinematic, scroll-driven storytelling experience built with vanilla HTML, CSS, and JavaScript. A single light bulb travels down the page through five worlds, morphing as it goes: a hanging Edison bulb, a wall sconce, a surreal eye-core, a desk lamp, and finally a vintage cage lantern. The bulb's glow casts realistic ambient light onto every section it passes through.

## Live demo

Once GitHub Pages is enabled, the site will be served at:

```
https://<your-username>.github.io/the-magic-bulb/
```

## What's inside

- `index.html` — semantic structure for the five sections plus a single fixed SVG holding all bulb states layered together.
- `styles.css` — atmospheric dark theme, walls, desk surface, lamp cones, cupboards, tablet bezel, wooden door with grain and recessed panels, glowing form underlines.
- `app.js` — the GSAP master timeline + ScrollTrigger driving bulb position, scale, and crossfades; canvas dot matrix; cursor-reactive carousel; door-open animation.

## Sections

1. **Creative Entry** — a hanging Edison bulb. Hover it to illuminate the brand mark. The dot matrix on the right responds to your cursor.
2. **Behind the Magic** — the bulb morphs into a wall sconce projecting a warm cone across the about copy.
3. **Our Playground** — a surreal eye-core overhead, with three cupboard cards (SEO, SEM, SMM) that swing open on hover.
4. **Made with Magic** — a brass desk lamp pours light onto a tablet running an infinite portfolio carousel. Hover the tablet to scrub through projects.
5. **Knock on Our Door** — a vintage cage lantern hangs upper-left. The brass handle on the wooden door triggers a 3D split, revealing the contact form.

## Tech

- [GSAP 3.12](https://gsap.com/) + ScrollTrigger + MotionPath plugin (CDN)
- [Tailwind Play CDN](https://tailwindcss.com/) for utilities
- Inline SVG for all five bulb states (no image assets to ship)
- Google Fonts: Cormorant Garamond + Inter

## Run locally

The site is fully static. Any local server works:

```bash
python -m http.server 8000
```

Then open <http://127.0.0.1:8000/>.

## Built with

[Kiro](https://kiro.dev) — AI-powered development environment.
