import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const headline = ["Living", "kitchens,", "shaped", "by", "light."];

const wordVariants = {
  hidden: { y: "120%", opacity: 0, filter: "blur(8px)" },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: 0.9 + i * 0.12,
      duration: 0.9,
      ease: [0.22, 0.8, 0.2, 1],
    },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The kitchen plate behind everything reveals from black, then drifts away
  const plateY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const plateOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.55]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[110vh] items-end justify-center overflow-hidden pb-28"
    >
      {/* Kitchen plate that fades up from darkness as light intensifies */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: plateY, scale: plateScale, opacity: plateOpacity }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.6, delay: 0.4, ease: "easeOut" }}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 70%",
            filter: "saturate(0.8) brightness(0.55)",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,7,11,0.85)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-ink-900" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink-900 to-transparent" />
      </motion.div>

      {/* Headline & CTAs */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="mb-6 text-xs uppercase tracking-[0.4em] text-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Studio Lumen — Smart Modular Kitchens
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] text-white">
          {headline.map((word, i) => (
            <span
              key={i}
              className="mr-3 inline-block overflow-hidden align-baseline"
            >
              <motion.span
                className="inline-block"
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="show"
              >
                {i === headline.length - 1 ? (
                  <span className="italic text-amber-warm">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-xl text-base font-light text-white/65 md:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
        >
          We design, craft and install modular kitchens that feel less like a
          room — and more like the heart of a home, gently lit and quietly
          intelligent.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.9 }}
        >
          <a
            href="#designs"
            className="btn-primary group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            Explore Designs
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="btn-ghost rounded-full px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
          >
            Book Consultation
          </a>
          <a
            href="#contact"
            className="rounded-full px-6 py-3 text-sm font-light text-white/60 transition-colors hover:text-white"
          >
            Get Free Quote
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 1.2 }}
          className="mt-20 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40"
        >
          <span>Scroll to enter</span>
          <motion.span
            className="block h-10 w-px bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [0.6, 1, 0.6] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
