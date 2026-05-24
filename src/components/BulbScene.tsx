import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * The hanging bulb is a global cinematic anchor. It enters on load, drifts
 * naturally, follows the cursor subtly, and morphs as the user scrolls:
 * - cord lengthens
 * - bulb migrates upward
 * - light cone stretches downward, becoming the lighting for every section
 */
export default function BulbScene() {
  const [mounted, setMounted] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.6,
  });

  // Cord lengthens slowly, then bulb climbs as we leave the hero
  const cordLength = useTransform(smooth, [0, 0.08, 0.2], [120, 220, 360]);
  const bulbY = useTransform(smooth, [0, 0.08, 0.2, 1], [0, 40, -40, -120]);
  const bulbScale = useTransform(smooth, [0, 0.2, 1], [1, 0.9, 0.7]);
  const coneScaleY = useTransform(smooth, [0, 0.2, 1], [1, 1.6, 2.4]);
  const coneOpacity = useTransform(
    smooth,
    [0, 0.05, 0.5, 0.85, 1],
    [0, 0.9, 0.7, 0.5, 0.35]
  );
  const ambientOpacity = useTransform(smooth, [0, 0.1, 1], [0, 1, 0.6]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMx(x);
      setMy(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      style={{
        // Spotlight follows cursor for the whole site
        ["--mx" as string]: `${(mx * 0.5 + 0.5) * 100}%`,
        ["--my" as string]: `${(my * 0.5 + 0.5) * 100}%`,
      }}
    >
      {/* Ambient bloom on top */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[60vh] bg-radial-glow"
        style={{ opacity: ambientOpacity }}
      />

      {/* Global cursor spotlight */}
      <div className="absolute inset-0 spotlight" />

      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: mounted ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.22, 0.8, 0.2, 1], delay: 0.2 }}
        style={{ y: bulbY }}
      >
        {/* Cord */}
        <motion.div
          style={{ height: cordLength }}
          className="mx-auto w-px bg-gradient-to-b from-white/40 via-white/15 to-transparent"
        />

        {/* Pendulum group with subtle natural sway + cursor reaction */}
        <motion.div
          className="relative mx-auto"
          animate={{ rotate: [-1.2, 1.2, -1.2] }}
          transition={{
            duration: 6.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            transformOrigin: "50% -360px",
          }}
        >
          <motion.div
            animate={{ x: mx * 8, rotate: mx * 1.5 }}
            transition={{ type: "spring", stiffness: 30, damping: 14 }}
            style={{ scale: bulbScale }}
            className="relative"
          >
            {/* Light cone */}
            <motion.div
              className="cone absolute left-1/2 top-6 h-[110vh] w-[80vw] -translate-x-1/2 origin-top"
              style={{
                opacity: coneOpacity,
                scaleY: coneScaleY,
              }}
            />

            {/* Soft global halo */}
            <motion.div
              className="absolute left-1/2 top-1 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,210,154,0.35), rgba(255,184,107,0.1) 40%, transparent 65%)",
                filter: "blur(20px)",
                opacity: ambientOpacity,
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* The bulb itself */}
            <svg
              width="78"
              height="120"
              viewBox="0 0 78 120"
              className="relative drop-shadow-[0_0_30px_rgba(255,184,107,0.55)]"
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
              {/* Filament line from cord to bulb */}
              <line
                x1="39"
                y1="0"
                x2="39"
                y2="14"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
              />
              {/* Cap */}
              <rect
                x="30"
                y="14"
                width="18"
                height="14"
                rx="2"
                fill="url(#cap)"
              />
              <rect
                x="32"
                y="22"
                width="14"
                height="2"
                fill="rgba(255,255,255,0.12)"
              />
              {/* Glass */}
              <ellipse cx="39" cy="62" rx="30" ry="36" fill="url(#bulbFill)" />
              {/* Filament */}
              <path
                d="M30 60 q4 -10 9 0 q5 10 9 0"
                fill="none"
                stroke="rgba(255,245,220,0.9)"
                strokeWidth="1.2"
              />
              {/* Highlight */}
              <ellipse
                cx="29"
                cy="48"
                rx="6"
                ry="10"
                fill="rgba(255,255,255,0.35)"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
