import { motion, MotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  /** 0..1 light strength — drives both the cone gradient and particle alpha. */
  intensity: MotionValue<number>;
  /** vertical scale factor — stretches the beam during transitions. */
  scaleY: MotionValue<number>;
};

/**
 * LightCone
 *
 * The visible projection volume that descends from the bulb. Two things stack
 * here:
 *
 *  - A radial gradient "cone" element that visually cuts a beam of light
 *    through the dark scene. Its opacity and vertical scale are driven by
 *    motion values from the BulbScene so it stretches during transitions and
 *    dims/brightens with the bulb's mood.
 *
 *  - A canvas-rendered particle field clipped to the cone shape. Particles
 *    drift downward and gently sideways as if they were dust catching the
 *    light. They fade with the parent intensity, so when the bulb dims so do
 *    the motes.
 */
export default function LightCone({ intensity, scaleY }: Props) {
  const coneOpacity = useTransform(intensity, [0, 0.4, 1], [0, 0.45, 0.9]);
  const haloOpacity = useTransform(intensity, [0, 0.4, 1], [0, 0.5, 1]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 origin-top">
      {/* Beam: the visible light cone */}
      <motion.div
        className="cone absolute left-1/2 top-0 h-[120vh] w-[78vw] -translate-x-1/2 origin-top"
        style={{ opacity: coneOpacity, scaleY }}
      />

      {/* Inner halo at the bulb tip — adds the warm bloom */}
      <motion.div
        className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,154,0.45), rgba(255,184,107,0.12) 40%, transparent 65%)",
          filter: "blur(20px)",
          opacity: haloOpacity,
        }}
      />

      {/* Particle field constrained to the cone via a CSS mask */}
      <motion.div
        className="cone-clip absolute left-1/2 top-0 h-[120vh] w-[78vw] -translate-x-1/2 origin-top"
        style={{ scaleY, opacity: useTransform(intensity, [0, 1], [0.2, 1]) }}
      >
        <ConeParticles intensity={intensity} />
      </motion.div>
    </div>
  );
}

/**
 * Canvas particle field — kept lightweight so the bulb assembly stays
 * smooth on lower-end devices. ~70 particles, devicePixelRatio aware,
 * auto-paused when not in viewport (via Page Visibility).
 */
function ConeParticles({ intensity }: { intensity: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let paused = false;

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
    const COUNT = 70;
    let ps: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: COUNT }, () => spawn());
    };

    // Particles spawn near the top of the cone where the bulb sits.
    const spawn = (atTop = false): P => {
      // Distribute horizontally with a slight bias toward center — the cone
      // is widest there.
      const x = w * (0.5 + (Math.random() - 0.5) * 0.85);
      const y = atTop ? Math.random() * 40 : Math.random() * h;
      return {
        x,
        y,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: 0.18 + Math.random() * 0.45, // drift downward
        a: 0.45 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2,
      };
    };

    const tick = () => {
      if (paused) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      const I = Math.max(0, Math.min(1, intensity.get()));

      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.04;

        // Wrap when leaving the bottom — re-emit near the top of the cone.
        if (p.y > h) {
          Object.assign(p, spawn(true));
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const flicker = 0.65 + Math.sin(p.tw) * 0.35;
        const a = p.a * flicker * I;
        if (a < 0.02) continue;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 210, 154, ${a})`;
        ctx.shadowColor = `rgba(255, 184, 107, ${a * 0.8})`;
        ctx.shadowBlur = 14;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      paused = document.hidden;
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ filter: "blur(0.3px)" }}
    />
  );
}
