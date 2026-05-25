import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import WallText from "./WallText";

const floaters = [
  {
    src: "https://images.unsplash.com/photo-1556909114-44e3e9399a2e?auto=format&fit=crop&w=600&q=80",
    style: { top: "12%", left: "6%" },
    size: "h-40 w-32 md:h-56 md:w-44",
    delay: 0.1,
    drift: 14,
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
    style: { top: "8%", right: "10%" },
    size: "h-44 w-32 md:h-64 md:w-48",
    delay: 0.25,
    drift: -18,
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    style: { bottom: "18%", left: "12%" },
    size: "h-36 w-28 md:h-52 md:w-40",
    delay: 0.4,
    drift: 22,
  },
  {
    src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&q=80",
    style: { bottom: "10%", right: "8%" },
    size: "h-44 w-32 md:h-60 md:w-44",
    delay: 0.55,
    drift: -10,
  },
];

const lines = [
  "Every kitchen begins as a feeling —",
  "a memory of warmth, of evenings,",
  "of the gentle clatter of a meal in motion.",
  "We design backwards from that feeling.",
];

/**
 * BehindMagic
 *
 * The story-deepest section. Three things signal that we've arrived
 * "behind the magic":
 *
 *   - The bulb dips lower than anywhere else on the page (handled in
 *     BulbScene's stage map at p≈0.78), so the cone fully washes this
 *     section.
 *   - Multiple light beams crisscross the scene at different angles,
 *     with their travel speeds tied to scroll progress.
 *   - The headline lines emerge as projected text on the back wall.
 *
 * The kitchen-related floaters drift in 3D — small parallax differences
 * between them sell the depth.
 */
export default function BehindMagic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Three beams travelling at different speeds and from different sides.
  const beam1Y = useTransform(scrollYProgress, [0, 1], [-160, 220]);
  const beam2Y = useTransform(scrollYProgress, [0, 1], [240, -260]);
  const beam3Y = useTransform(scrollYProgress, [0, 1], [-80, 160]);
  const beam1Rot = useTransform(scrollYProgress, [0, 1], [4, -3]);
  const beam2Rot = useTransform(scrollYProgress, [0, 1], [-6, 5]);
  const beam3Rot = useTransform(scrollYProgress, [0, 1], [12, -8]);
  const beamOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0]
  );

  // Camera-in feel — slight scale rises through the section
  const camScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 1]);

  return (
    <section
      id="story"
      ref={ref}
      className="relative isolate min-h-[140vh] overflow-hidden py-40"
    >
      {/* Crossing light beams. Each is a thin gradient strip, rotated and
          translated by scroll, with a soft glow blur. The angles are
          deliberately different so the section reads as "shafts of light
          falling through". */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-0 h-full w-[2px] beam"
        style={{ y: beam1Y, rotate: beam1Rot, opacity: beamOpacity }}
      />
      <motion.div
        className="pointer-events-none absolute right-1/3 top-0 h-full w-[2px] beam"
        style={{ y: beam2Y, rotate: beam2Rot, opacity: beamOpacity }}
      />
      <motion.div
        className="pointer-events-none absolute left-2/3 top-0 h-full w-[1px] beam"
        style={{ y: beam3Y, rotate: beam3Rot, opacity: beamOpacity }}
      />

      {/* Soft amber wash that sits behind the floaters and copy */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,184,107,0.08), transparent 60%)",
        }}
      />

      {/* Floaters */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: camScale }}
      >
        {floaters.map((f, i) => (
          <Floater key={i} {...f} progress={scrollYProgress} />
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-xs uppercase tracking-[0.4em] text-amber-warm/80"
        >
          Behind the magic
        </motion.span>

        {/* Each line is its own WallText so they emerge sequentially as if
            being projected line by line. */}
        <div className="mt-8 font-display text-[clamp(2.4rem,6vw,6rem)] leading-[1.02] text-white">
          {lines.map((l, i) => (
            <div key={i} className="block">
              <WallText
                as="p"
                text={l}
                stagger={0.06}
                accentLast={i === lines.length - 1}
                className="block"
              />
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-12 max-w-xl text-base font-light leading-relaxed text-white/60"
        >
          Light, material and ritual become a single continuous gesture. The
          result is not a kitchen that performs — it is a kitchen that listens.
        </motion.p>
      </div>
    </section>
  );
}

function Floater({
  src,
  style,
  size,
  delay,
  drift,
  progress,
}: {
  src: string;
  style: React.CSSProperties;
  size: string;
  delay: number;
  drift: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [80, -80]);
  const r = useTransform(progress, [0, 1], [drift / 4, -drift / 4]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 60 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 1.4, ease: [0.22, 0.8, 0.2, 1] }}
      className={`absolute ${size} overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]`}
      style={{ ...style, y, rotate: r }}
    >
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ filter: "brightness(0.7) saturate(0.85)" }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{
          duration: 12 + drift / 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,184,107,0.18),transparent_60%)]" />
    </motion.div>
  );
}
