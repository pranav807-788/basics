import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLenis } from "./lib/useLenis";
import BulbScene from "./components/BulbScene";
import CinematicTunnel from "./components/CinematicTunnel";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import Showcase from "./components/Showcase";
import HowWeWork from "./components/HowWeWork";
import BehindMagic from "./components/BehindMagic";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";

/**
 * App
 *
 * Stacking order from back to front:
 *   z-0   CinematicTunnel  — perspective grid + drifting depth points
 *   z-10  Page content     — sections of the site
 *   z-30  BulbScene        — bulb, cone, particles, floor shadow, spotlight
 *   z-40  Navigation
 *   z-50  Grain overlay (from `.grain::after`)
 *
 * The bulb sits *above* content so its halo and cone wash over the page,
 * while the tunnel sits *behind* content so the page literally exists inside
 * the tunnel. Sections are kept transparent where possible so the tunnel
 * lines remain faintly visible — that's what creates the "you are inside a
 * 3D space" feel without any WebGL.
 */
export default function App() {
  useLenis();
  return (
    <div className="relative grain min-h-screen overflow-x-hidden bg-ink-900 text-white">
      {/* The world */}
      <CinematicTunnel />

      {/* The protagonist */}
      <BulbScene />

      <Navigation />

      <main className="relative z-10">
        <Hero />
        {/* Section seams are kept very soft and short — the bulb + tunnel
            already provide visual continuity, so we only need the lightest
            of gradient blends to mask any remaining edge. */}
        <Seam />
        <WhatWeDo />
        <Seam />
        <Showcase />
        <Seam />
        <HowWeWork />
        <Seam />
        <BehindMagic />
        <Seam />
        <Testimonials />
        <Seam />
        <Contact />
        <EndTransition />
      </main>
    </div>
  );
}

/**
 * Soft seam between sections. Uses a downward gradient rather than a hard
 * line so the bulb's projection appears to bleed through without a cut.
 */
function Seam() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative -my-12 h-24 bg-gradient-to-b from-transparent via-ink-900/40 to-transparent"
    />
  );
}

/**
 * EndTransition
 *
 * The closing beat of the storyboard. As the user reaches the bottom of the
 * page we:
 *   - dim everything to deep black with a slow fade,
 *   - centre a soft halo around the bulb's now-receded position,
 *   - whisper a final line of copy beneath it,
 *   - never abruptly cut.
 *
 * The bulb itself is already shrinking and rising via the BulbScene's stage
 * map (final keyframe), so this section is mainly a vignette to seal the
 * scene.
 */
function EndTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const veil = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 0.95]);
  const haloOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.55, 0.15]
  );
  const haloScale = useTransform(scrollYProgress, [0, 1], [0.7, 1.4]);
  const lineY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const lineOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.85, 1],
    [0, 0.7, 1, 0.4]
  );

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative isolate flex min-h-[80vh] items-end justify-center overflow-hidden pb-24"
    >
      {/* Black veil — fades the world away */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-ink-900"
        style={{ opacity: veil }}
      />

      {/* Final halo behind the receding bulb */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,184,107,0.35), rgba(255,184,107,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
          opacity: haloOpacity,
          scale: haloScale,
        }}
      />

      {/* Closing whisper */}
      <motion.p
        className="relative z-10 max-w-md text-center text-xs uppercase tracking-[0.5em] text-white/55"
        style={{ y: lineY, opacity: lineOpacity }}
      >
        Lights out.
        <br />
        <span className="mt-3 block normal-case tracking-[0.25em] text-white/35">
          Until the next room.
        </span>
      </motion.p>
    </section>
  );
}
