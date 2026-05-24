import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Particles from "./Particles";
import WallText from "./WallText";

const services = [
  {
    title: "Modular Kitchens",
    desc: "Tailored cabinetry, drawers and finishes — engineered to the millimetre for your space.",
    icon: ModuleIcon,
  },
  {
    title: "Interior Design",
    desc: "Full-room storytelling: mood, materials, lighting and rhythm in one cohesive vision.",
    icon: InteriorIcon,
  },
  {
    title: "Smart Kitchen Solutions",
    desc: "Voice-aware lighting, occupancy sensing, and connected appliances quietly integrated.",
    icon: SmartIcon,
  },
  {
    title: "Space Optimization",
    desc: "Hidden storage, pull-out pantries and clever corners that make every square foot earn its keep.",
    icon: SpaceIcon,
  },
  {
    title: "Installation",
    desc: "White-glove install by trained crews — site protection, calibration, and a final walkthrough.",
    icon: InstallIcon,
  },
  {
    title: "Custom Design",
    desc: "Bespoke kitchens drawn to a single brief — from millwork details to artisanal hardware.",
    icon: CustomIcon,
  },
];

export default function WhatWeDo() {
  return (
    <section
      id="designs"
      className="relative isolate overflow-hidden py-32 md:py-40"
    >
      <Particles density={50} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-ink-900 via-ink-900/0 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Header />
        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Card key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-xs uppercase tracking-[0.4em] text-amber-warm/80"
        >
          What we do
        </motion.span>
        {/* Title is rendered via WallText so it feels projected onto the
            back wall rather than printed on a flat layer. */}
        <div className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-white">
          <WallText
            as="h2"
            text="Six disciplines, one quiet kitchen."
            stagger={0.07}
            accentLast={false}
          />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-sm text-sm font-light text-white/60"
      >
        Every Lumen kitchen is the result of these services working in concert
        — never bolted on, always composed.
      </motion.p>
    </div>
  );
}

type CardProps = {
  title: string;
  desc: string;
  icon: () => JSX.Element;
  index: number;
};

/**
 * Card with the "emerge from light" treatment.
 *
 * When the card enters the viewport, a small amber glow is born above it
 * and expands into the card's footprint. The card itself rises from below
 * with a blur fade, giving the impression that it is being projected by
 * the light rather than scrolled in.
 */
function Card({ title, desc, icon: Icon, index }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative">
      {/* Aura — appears just before the card to play the "birth" beat */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          inView
            ? {
                opacity: [0, 1, 0.6, 0],
                scale: [0.5, 1.05, 1.15, 1.25],
              }
            : {}
        }
        transition={{
          delay: index * 0.08,
          duration: 2.2,
          ease: [0.22, 0.8, 0.2, 1],
          times: [0, 0.35, 0.7, 1],
        }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,210,154,0.45), rgba(255,184,107,0.12) 35%, transparent 70%)",
            filter: "blur(22px)",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(12px)", scale: 0.96 }}
        animate={
          inView
            ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, y: 60, filter: "blur(12px)", scale: 0.96 }
        }
        transition={{
          delay: 0.18 + index * 0.08,
          duration: 1.0,
          ease: [0.22, 0.8, 0.2, 1],
        }}
        className="group relative"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 5 + index * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
          className="glass relative flex h-full flex-col gap-5 rounded-2xl p-7 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-amber-warm/30"
        >
          {/* Hover halo */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(400px circle at 50% 0%, rgba(255,184,107,0.18), transparent 60%)",
            }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-warm transition-all duration-500 group-hover:border-amber-warm/40 group-hover:bg-amber-warm/10 group-hover:shadow-[0_0_30px_rgba(255,184,107,0.35)]">
              <Icon />
            </div>
            <span className="font-display text-xs text-white/30">
              0{index + 1}
            </span>
          </div>
          <h3 className="font-display text-2xl text-white">{title}</h3>
          <p className="text-sm font-light leading-relaxed text-white/60">
            {desc}
          </p>
          <div className="mt-auto flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40 transition-colors duration-500 group-hover:text-amber-warm">
            Learn more
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* --- icons --- */
const baseIcon = "h-5 w-5 stroke-current fill-none stroke-[1.4]";

function ModuleIcon() {
  return (
    <svg viewBox="0 0 24 24" className={baseIcon}>
      <rect x="3" y="3" width="8" height="8" rx="1.2" />
      <rect x="13" y="3" width="8" height="8" rx="1.2" />
      <rect x="3" y="13" width="8" height="8" rx="1.2" />
      <rect x="13" y="13" width="8" height="8" rx="1.2" />
    </svg>
  );
}
function InteriorIcon() {
  return (
    <svg viewBox="0 0 24 24" className={baseIcon}>
      <path d="M3 20V8l9-5 9 5v12" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}
function SmartIcon() {
  return (
    <svg viewBox="0 0 24 24" className={baseIcon}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}
function SpaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className={baseIcon}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 12h8M12 4v16" />
    </svg>
  );
}
function InstallIcon() {
  return (
    <svg viewBox="0 0 24 24" className={baseIcon}>
      <path d="M3 12l4-4 5 5 9-9" />
      <path d="M14 4h7v7" />
    </svg>
  );
}
function CustomIcon() {
  return (
    <svg viewBox="0 0 24 24" className={baseIcon}>
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
      <path d="M14 6l3 3" />
    </svg>
  );
}
