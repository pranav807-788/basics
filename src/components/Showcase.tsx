import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const kitchens = [
  {
    title: "Obsidian Veil",
    style: "Minimalist · Matte Black",
    area: "320 sq ft",
    materials: "Fenix laminate · Brass · Smoked oak",
    img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Aurum Kitchen",
    style: "Warm Modern · Walnut",
    area: "280 sq ft",
    materials: "Walnut · Travertine · Antique brass",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Cloud Galley",
    style: "Soft Scandinavian",
    area: "210 sq ft",
    materials: "White oak · Quartz · Linen",
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Studio Ember",
    style: "Industrial · Concrete",
    area: "360 sq ft",
    materials: "Microcement · Steel · Reclaimed teak",
    img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Halcyon House",
    style: "Cinematic Lighting",
    area: "295 sq ft",
    materials: "Lacquer · Marble · Bronze",
    img: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalScroll = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Per-card depth: image floats slightly slower than card frame
      gsap.utils.toArray<HTMLElement>(".showcase-img").forEach((el) => {
        gsap.to(el, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative isolate h-screen overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-start gap-2 px-8 pt-24 md:px-14">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.4em] text-amber-warm/80"
        >
          Featured Showcase
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] text-white"
        >
          Recent kitchens, <span className="italic text-amber-warm">in motion.</span>
        </motion.h2>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-full items-center gap-8 px-[10vw] will-change-transform"
        style={{ width: "max-content" }}
      >
        {kitchens.map((k, i) => (
          <article
            key={k.title}
            className="group relative flex h-[68vh] w-[58vw] shrink-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-800/60 md:w-[42vw]"
            style={{ perspective: 1200 }}
          >
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={k.img}
                alt={k.title}
                loading="lazy"
                className="showcase-img absolute inset-0 h-full w-[120%] object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.8,0.2,1)] group-hover:scale-105"
                style={{ filter: "saturate(0.85) brightness(0.78)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,184,107,0.18),transparent_55%)]" />

              {/* Top label */}
              <div className="absolute left-6 top-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-warm shadow-[0_0_8px_2px_rgba(255,184,107,0.7)]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/70">
                  Project · 0{i + 1}
                </span>
              </div>

              {/* Hover overlay details */}
              <div className="absolute inset-x-6 bottom-6 flex flex-col gap-4">
                <h3 className="font-display text-3xl text-white md:text-4xl">
                  {k.title}
                </h3>

                <div className="grid max-w-md grid-cols-1 gap-2 text-xs text-white/70 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:grid-cols-2 [transform:translateY(8px)]">
                  <Detail label="Style" value={k.style} />
                  <Detail label="Area" value={k.area} />
                  <Detail label="Materials" value={k.materials} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {k.style}
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur transition-all duration-500 group-hover:border-amber-warm/60 group-hover:bg-amber-warm/10 group-hover:text-amber-warm"
                  >
                    View project
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* End spacer */}
        <div className="h-1 w-[10vw] shrink-0" />
      </div>

      {/* Subtle progress hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
        <span className="h-px w-10 bg-white/30" />
        Scroll horizontally
        <span className="h-px w-10 bg-white/30" />
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
        {label}
      </div>
      <div className="font-light text-white/85">{value}</div>
    </div>
  );
}
