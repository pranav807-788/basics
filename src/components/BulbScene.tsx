import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LightCone from "./LightCone";

/**
 * BulbScene — the master storytelling object.
 *
 * The bulb is the single thread the user follows through the whole site. It
 * powers on at load, hangs from the ceiling, and responds to two inputs:
 *
 *   1. Scroll position (the "story stage")
 *      Each section of the page has its own keyframe for bulb height,
 *      cord length, light intensity, and pendulum sway amplitude. As the
 *      user scrolls, those properties interpolate continuously, never
 *      cutting between sections — the bulb dips low to reveal a section,
 *      then rises and swings as it transitions to the next.
 *
 *   2. The cursor (the "camera")
 *      The pendulum reacts to the mouse with a subtle lag, and a floor
 *      shadow at the bottom of the screen tracks the bulb's lateral
 *      position so the whole environment feels lit by it.
 *
 * Realistic pendulum motion is achieved by driving the pendulum's rotation
 * with a requestAnimationFrame loop that combines a sine-wave swing whose
 * amplitude is read from the scroll-driven `swayMV` motion value with the
 * cursor's horizontal offset.
 */

/* -----------------------------------------------------------------------
 * Stage map.
 *
 * Each row is [scrollProgress, bulbY, intensity, cordLength, swayDeg].
 *
 *   bulbY:    px offset from the top of the viewport. Positive = lower.
 *             Big positive numbers dip the bulb deep into a section to
 *             reveal it; negative numbers raise it for transitions.
 *   intensity: 0..1 brightness multiplier for the cone, halo, and shadow.
 *   cordLen:   how long the cord is in px (the pendulum's pivot is at the
 *             top of the cord, so longer cord = wider arc).
 *   swayDeg:   amplitude of the natural pendulum swing in degrees.
 * --------------------------------------------------------------------- */
const STAGES: Array<[number, number, number, number, number]> = [
  // p,    bulbY, intensity, cord, sway
  [0.0, -160, 0.1, 60, 0.4], // start: dim, raised
  [0.03, -120, 0.45, 100, 0.9], // power-on
  [0.07, 40, 1.0, 180, 1.6], // hero — bulb dips, lights everything
  [0.16, -90, 0.7, 240, 2.6], // hero -> services transition (rises, swings)
  [0.24, 30, 0.95, 280, 1.4], // services revealed
  [0.34, -90, 0.65, 320, 2.2], // services -> showcase
  [0.42, -50, 0.85, 350, 1.0], // showcase (pinned horizontal — bulb stays)
  [0.52, -50, 0.7, 380, 1.6], // showcase -> process
  [0.6, 70, 1.0, 410, 1.2], // process — bulb dips for the timeline
  [0.7, -40, 0.7, 440, 2.6], // process -> behind the magic
  [0.78, 150, 1.05, 500, 3.6], // BEHIND THE MAGIC — bulb very low, dramatic swing
  [0.86, -20, 0.7, 520, 2.0], // bridge to testimonials
  [0.92, 30, 0.9, 540, 1.2], // testimonials
  [0.96, 60, 0.95, 560, 0.9], // contact
  [1.0, -240, 0.1, 380, 0.3], // END — bulb recedes, scene fades to dark
];

const STOPS = STAGES.map((s) => s[0]);
const Y_FRAMES = STAGES.map((s) => s[1]);
const I_FRAMES = STAGES.map((s) => s[2]);
const C_FRAMES = STAGES.map((s) => s[3]);
const S_FRAMES = STAGES.map((s) => s[4]);

export default function BulbScene() {
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // ----- scroll-driven motion values -----
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const bulbY = useTransform(smooth, STOPS, Y_FRAMES);
  const intensityMV = useTransform(smooth, STOPS, I_FRAMES);
  const cordLen = useTransform(smooth, STOPS, C_FRAMES);
  const swayMV = useTransform(smooth, STOPS, S_FRAMES);

  // The cone stretches between sections (transitions feel like the beam is
  // straining downward) and slightly compresses at section centers.
  const coneScaleY = useTransform(
    smooth,
    [0, 0.07, 0.16, 0.24, 0.34, 0.42, 0.52, 0.6, 0.7, 0.78, 0.86, 0.92, 0.96, 1],
    [0.6, 1.0, 1.6, 1.0, 1.7, 1.0, 1.5, 1.0, 1.7, 1.0, 1.4, 1.0, 1.0, 0.4]
  );

  // At the very end of the page, scale and fade the entire bulb assembly so
  // the camera feels like it is pulling backward.
  const endScale = useTransform(smooth, [0.95, 1], [1, 0.55]);
  const endOpacity = useTransform(smooth, [0.96, 1], [1, 0.25]);

  // Ambient bloom over the page's top — subtle but ties the whole site to
  // the bulb when scrolled near the hero.
  const ambient = useTransform(smooth, [0, 0.1, 0.95, 1], [0.2, 1, 0.6, 0.1]);

  // ----- pendulum physics (rAF) -----
  // The pendulum's rotation is the sum of:
  //   a) a sine-wave natural swing whose amplitude is `swayMV`, and
  //   b) a small offset from the cursor's horizontal position (eased).
  // Tracking these with motion values keeps re-renders out of the loop.
  const rotMV = useMotionValue(0);
  const bulbXMV = useMotionValue(0); // lateral pixel offset of the bulb
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const easedMx = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      // Ease the cursor offset so the pendulum doesn't snap with the mouse.
      easedMx.current += (mouseX.current - easedMx.current) * 0.05;
      const amp = swayMV.get();
      // Sine wave at ~0.85Hz feels like a real pendulum on a long cord.
      const swingDeg = Math.sin(t * 0.95) * amp;
      const cursorDeg = easedMx.current * 1.6;
      const totalDeg = swingDeg + cursorDeg;
      rotMV.set(totalDeg);
      // Convert pendulum angle + cord length into a lateral pixel offset for
      // the floor shadow.
      const rad = (totalDeg * Math.PI) / 180;
      bulbXMV.set(Math.sin(rad) * (cordLen.get() + 60));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [swayMV, rotMV, cordLen, bulbXMV]);

  // Mount-in animation gate — initial drop from above the viewport.
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  // ----- derived shadow / glow values -----
  const shadowOpacity = useTransform(intensityMV, [0, 0.4, 1], [0, 0.25, 0.55]);
  const shadowScale = useTransform(intensityMV, [0, 1], [0.7, 1.2]);

  // Cursor spotlight tracks the cursor for the whole site.
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMx(e.clientX / window.innerWidth);
      setMy(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      style={{
        ["--mx" as string]: `${mx * 100}%`,
        ["--my" as string]: `${my * 100}%`,
      }}
    >
      {/* Ambient warm wash at the top of the page — softens hero entry */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[60vh] bg-radial-glow"
        style={{ opacity: ambient }}
      />

      {/* Cursor spotlight — site-wide */}
      <div className="absolute inset-0 spotlight" />

      {/* FLOOR SHADOW — large soft ellipse near the bottom of the viewport
          that tracks the bulb's lateral motion. This is what sells the
          "the bulb is lighting the whole room" feeling. */}
      <motion.div
        className="absolute bottom-[-15vh] left-1/2 h-[35vh] w-[110vw] -translate-x-1/2"
        style={{ opacity: shadowOpacity, scale: shadowScale, x: bulbXMV }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background:
              "radial-gradient(ellipse at center 100%, rgba(255,184,107,0.55), rgba(255,184,107,0.18) 30%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* BULB ASSEMBLY — the y-position is scroll-driven; the entire cord +
          bulb pivots around the top of the cord (the pendulum's pivot). */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        initial={{ y: -260, opacity: 0 }}
        animate={{ y: 0, opacity: mounted ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.22, 0.8, 0.2, 1], delay: 0.2 }}
        style={{ y: bulbY, scale: endScale, opacity: endOpacity }}
      >
        <motion.div
          className="origin-top"
          style={{
            rotate: rotMV,
            transformOrigin: "50% 0%",
          }}
        >
          {/* Cord — its height is scroll-driven so the bulb settles at the
              right hanging distance for each section. */}
          <motion.div
            style={{ height: cordLen }}
            className="mx-auto w-px bg-gradient-to-b from-white/45 via-white/15 to-transparent"
          />

          {/* Bulb + cone live at the bottom of the cord */}
          <div className="relative mx-auto">
            {/* The light cone — visible projection volume + particles */}
            <LightCone intensity={intensityMV} scaleY={coneScaleY} />

            {/* Soft global halo around the bulb */}
            <motion.div
              className="absolute left-1/2 top-1 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,210,154,0.55), rgba(255,184,107,0.16) 40%, transparent 65%)",
                filter: "blur(20px)",
                opacity: intensityMV,
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* The bulb itself — drawn as SVG so the highlights stay crisp */}
            <Bulb intensity={intensityMV} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Bulb — pure SVG. The filament glow is a separate <feGaussianBlur> filter
 * so we can drive its strength via the parent intensity if we choose to.
 */
function Bulb({ intensity }: { intensity: MotionValue<number> }) {
  const dropShadow = useTransform(
    intensity,
    (v) =>
      `drop-shadow(0 0 ${4 + v * 32}px rgba(255,184,107,${0.15 + v * 0.5}))`
  );
  return (
    <motion.svg
      width="78"
      height="120"
      viewBox="0 0 78 120"
      style={{ filter: dropShadow }}
      className="relative"
    >
      <defs>
        <radialGradient id="bulbFill" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#fff5dc" />
          <stop offset="35%" stopColor="#ffd29a" />
          <stop offset="70%" stopColor="#ffb86b" />
          <stop offset="100%" stopColor="#5b270a" />
        </radialGradient>
        <linearGradient id="cap" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2a2e3b" />
          <stop offset="100%" stopColor="#0f1117" />
        </linearGradient>
      </defs>

      {/* Filament line from cord to bulb cap */}
      <line
        x1="39"
        y1="0"
        x2="39"
        y2="14"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      {/* Cap */}
      <rect x="30" y="14" width="18" height="14" rx="2" fill="url(#cap)" />
      <rect x="32" y="22" width="14" height="2" fill="rgba(255,255,255,0.12)" />

      {/* Glass envelope */}
      <ellipse cx="39" cy="62" rx="30" ry="36" fill="url(#bulbFill)" />

      {/* Filament */}
      <path
        d="M30 60 q4 -10 9 0 q5 10 9 0"
        fill="none"
        stroke="rgba(255,245,220,0.95)"
        strokeWidth="1.2"
      />

      {/* Highlight */}
      <ellipse
        cx="29"
        cy="48"
        rx="6"
        ry="10"
        fill="rgba(255,255,255,0.4)"
      />
    </motion.svg>
  );
}
