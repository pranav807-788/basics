import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * CinematicTunnel
 *
 * A fixed-position background that creates the illusion of a camera moving
 * forward through 3D space. It is composed of three layers:
 *
 * 1. Floor + ceiling perspective grids — repeating gradients rotated into
 *    3D so they converge toward a vanishing point. The grid's
 *    background-position is animated by the page's scroll progress, giving
 *    the sensation of forward motion.
 *
 * 2. Drifting depth points — small light specks placed at random points in
 *    a virtual depth field. They translate toward the camera as the user
 *    scrolls, then loop back when they pass through it.
 *
 * 3. Vanishing-point fog — a soft radial fade at the horizon that hides the
 *    grid lines as they collapse to the vanishing point and supplies the
 *    "tunnel of light" feel.
 *
 * The whole tunnel listens to the cursor and tilts subtly, so the user
 * feels they are "looking around" while the camera keeps moving forward.
 */
export default function CinematicTunnel() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Page-level scroll drives the grid's forward motion.
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.8,
  });

  // The floor's vertical scroll. Two layers run at slightly different speeds
  // to create a parallax "depth" feel.
  const floorBgY = useTransform(smooth, [0, 1], [0, 4800]);
  const floorBgYSlow = useTransform(smooth, [0, 1], [0, 2400]);
  const ceilBgY = useTransform(smooth, [0, 1], [0, -4400]);

  // Cursor-driven camera tilt. We update CSS variables on the wrapper so we
  // can reuse the same parallax for any nested layers without React re-renders.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let camX = 0;
    let camY = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      // Lerp toward the cursor for a soft "camera ease".
      camX += (targetX - camX) * 0.06;
      camY += (targetY - camY) * 0.06;
      el.style.setProperty("--camx", camX.toFixed(3));
      el.style.setProperty("--camy", camY.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Pre-compute a stable random distribution for depth points.
  const points = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        // x in viewport % (-30..130 to allow off-screen entries)
        x: -20 + Math.random() * 140,
        // distance: 0 = at camera, 1 = far away
        depth: 0.1 + Math.random() * 0.9,
        // vertical band — most points cluster around the horizon
        band: Math.random() * 0.7 + 0.15,
        delay: Math.random() * 8,
        duration: 14 + Math.random() * 18,
        size: 1 + Math.random() * 2.4,
      })),
    []
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          // Subtle page-wide parallax tilt driven by cursor.
          perspective: "900px",
          perspectiveOrigin: "50% 50%",
        } as React.CSSProperties
      }
    >
      {/* Base ink wash so the grids read as light against darkness */}
      <div className="absolute inset-0 bg-ink-900" />

      {/* CEILING grid — rotated upward, runs slower, dimmer */}
      <div
        className="absolute inset-x-[-30%] top-[-40%] h-[120%] camera-parallax"
        style={{
          transformOrigin: "50% 100%",
          transform:
            "rotateX(-72deg) translateZ(-100px) rotateX(calc(var(--camy,0) * -1.8deg)) rotateY(calc(var(--camx,0) * 1.4deg))",
          opacity: 0.55,
        }}
      >
        <motion.div
          className="tunnel-grid tunnel-grid--dense"
          style={{ backgroundPositionY: ceilBgY }}
        />
      </div>

      {/* FLOOR grid (far layer) */}
      <div
        className="absolute inset-x-[-30%] bottom-[-40%] h-[120%] camera-parallax"
        style={{
          transformOrigin: "50% 0%",
          transform:
            "rotateX(72deg) translateZ(-100px) rotateX(calc(var(--camy,0) * 1.8deg)) rotateY(calc(var(--camx,0) * 1.4deg))",
          opacity: 0.45,
        }}
      >
        <motion.div
          className="tunnel-grid tunnel-grid--dense"
          style={{ backgroundPositionY: floorBgYSlow }}
        />
      </div>

      {/* FLOOR grid (near layer) — brighter and faster, gives forward speed */}
      <div
        className="absolute inset-x-[-20%] bottom-[-30%] h-[110%] camera-parallax"
        style={{
          transformOrigin: "50% 0%",
          transform:
            "rotateX(70deg) translateZ(0) rotateX(calc(var(--camy,0) * 1.4deg)) rotateY(calc(var(--camx,0) * 1deg))",
          opacity: 0.85,
        }}
      >
        <motion.div
          className="tunnel-grid"
          style={{ backgroundPositionY: floorBgY }}
        />
      </div>

      {/* Vanishing-point fog — hides the seam where lines collapse */}
      <div className="depth-fog" />

      {/* A soft amber halo at the horizon — hint of the bulb's room */}
      <div
        className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,184,107,0.10), rgba(255,184,107,0.04) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Drifting depth points — emerge from horizon and sweep past camera */}
      <DepthPoints points={points} />
    </div>
  );
}

type Point = {
  id: number;
  x: number;
  depth: number;
  band: number;
  delay: number;
  duration: number;
  size: number;
};

/**
 * Depth points are rendered as plain divs with a CSS animation that scales +
 * translates them toward the viewer. We use animation-delay to stagger them so
 * the field never feels uniform.
 */
function DepthPoints({ points }: { points: Point[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="absolute inset-0">
      {points.map((p) => (
        <div
          key={p.id}
          className="depth-point"
          style={{
            left: `${p.x}%`,
            top: `${p.band * 100}%`,
            width: p.size,
            height: p.size,
            animation: ready
              ? `tunnel-fly ${p.duration}s linear ${p.delay}s infinite`
              : "none",
            // Initial 3D depth sets each point on the perspective trajectory.
            transform: `translateZ(${-200 - p.depth * 600}px)`,
          }}
        />
      ))}
      {/* Inline keyframes so we don't need an extra CSS file. The animation
          drives both translateZ (depth) and opacity for a fade-in/out cycle. */}
      <style>{`
        @keyframes tunnel-fly {
          0% {
            transform: translate3d(0, 0, -800px) scale(0.2);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          70% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, 60vh, 600px) scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
