import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    title: "Consultation",
    desc: "A relaxed conversation about how you cook, host and live. We listen first, sketch second.",
  },
  {
    title: "Planning",
    desc: "3D layouts, lighting studies and material moodboards — the architecture of your kitchen.",
  },
  {
    title: "Design",
    desc: "Bespoke joinery, hardware and finish selection. Detail drawings to the millimetre.",
  },
  {
    title: "Manufacturing",
    desc: "Crafted in our workshop with precision CNC, hand-finished by trained makers.",
  },
  {
    title: "Installation",
    desc: "White-glove installation, calibration of smart systems, and a quiet final reveal.",
  },
];

export default function HowWeWork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="process"
      className="relative isolate overflow-hidden py-32 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,184,107,0.06),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-xs uppercase tracking-[0.4em] text-amber-warm/80"
        >
          How we work
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
          className="mt-3 max-w-4xl font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-white"
        >
          A five-act process,{" "}
          <span className="italic text-amber-warm">unhurried</span>.
        </motion.h2>

        <div ref={ref} className="relative mt-24 pl-6 md:pl-14">
          {/* Background rail */}
          <div className="absolute inset-y-0 left-2 w-px bg-white/10 md:left-6" />
          {/* Glowing rail (fills with scroll) */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-2 top-0 w-px md:left-6"
          >
            <div
              className="h-full w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(255,210,154,0.95) 30%, rgba(255,184,107,0.6))",
                boxShadow:
                  "0 0 14px rgba(255,184,107,0.55), 0 0 30px rgba(255,184,107,0.35)",
              }}
            />
          </motion.div>

          <ol className="flex flex-col gap-16 md:gap-20">
            {steps.map((s, i) => (
              <Step key={s.title} index={i} {...s} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  desc,
}: {
  index: number;
  title: string;
  desc: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 30%"],
  });
  const dotScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.15]);
  const dotGlow = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.45, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-12, 0]);

  return (
    <motion.li
      ref={ref}
      style={{ opacity, x }}
      className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-10"
    >
      {/* dot */}
      <motion.span
        style={{ scale: dotScale }}
        className="absolute -left-[28px] top-2 grid h-5 w-5 place-items-center rounded-full md:-left-[44px]"
      >
        <span className="absolute inset-0 rounded-full bg-amber-warm" />
        <motion.span
          style={{ opacity: dotGlow }}
          className="absolute -inset-3 rounded-full"
        >
          <span
            className="block h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,184,107,0.55), transparent 70%)",
              filter: "blur(4px)",
            }}
          />
        </motion.span>
      </motion.span>

      <div className="md:w-32 shrink-0">
        <div className="font-display text-5xl text-white/15 md:text-6xl">
          0{index + 1}
        </div>
      </div>

      <div className="max-w-xl">
        <h3 className="font-display text-2xl text-white md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-white/60 md:text-base">
          {desc}
        </p>
      </div>
    </motion.li>
  );
}
