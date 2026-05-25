import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const reviews = [
  {
    name: "Aanya Mehra",
    role: "Architect, Mumbai",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    text:
      "It feels less like a renovation and more like a quiet performance. Lumen turned the kitchen into the most lived-in room of the house.",
    rating: 5,
  },
  {
    name: "Rohan Iyer",
    role: "Founder, Hearthco",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    text:
      "The smart lighting alone is unreal. Cooking late at night feels cinematic ΓÇö and the team handled every tiny detail without a single nudge.",
    rating: 5,
  },
  {
    name: "Sophia Khan",
    role: "Homeowner, Bengaluru",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
    text:
      "I've never seen joinery this precise. Six months in, every drawer still glides like the day they handed it over.",
    rating: 5,
  },
  {
    name: "David Lin",
    role: "Restaurant Owner",
    img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=300&q=80",
    text:
      "We trusted Lumen with our flagship's open kitchen. The result is a stage ΓÇö guests literally stop to watch the chefs work.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % reviews.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="reviews"
      className="relative isolate overflow-hidden py-32 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,184,107,0.08),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-xs uppercase tracking-[0.4em] text-amber-warm/80"
            >
              Voices
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
              className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-white"
            >
              From the people who{" "}
              <span className="italic text-amber-warm">live</span> in them.
            </motion.h2>
          </div>
          <div className="flex items-center gap-3">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-10 bg-amber-warm shadow-[0_0_12px_rgba(255,184,107,0.6)]"
                    : "w-4 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stage */}
        <div className="relative mt-16 h-[460px] md:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -40, rotateX: -6 }}
              transition={{ duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
              className="absolute inset-0 mx-auto max-w-3xl"
              style={{ transformPerspective: 1200 }}
            >
              <Card review={reviews[active]} />
            </motion.div>
          </AnimatePresence>

          {/* Side shadow cards for depth */}
          <SideCard side="left" review={reviews[(active - 1 + reviews.length) % reviews.length]} />
          <SideCard side="right" review={reviews[(active + 1) % reviews.length]} />
        </div>
      </div>
    </section>
  );
}

function Card({ review }: { review: (typeof reviews)[number] }) {
  return (
    <div
      className="group glass-strong relative h-full w-full rounded-3xl p-8 md:p-12 transition-shadow duration-500 hover:shadow-[0_0_60px_-10px_rgba(255,184,107,0.4)]"
      style={{ transform: "rotate(-1.4deg)" }}
    >
      <div className="absolute -inset-px rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,184,107,0.15),transparent_60%)] opacity-60" />

      <div className="relative flex h-full flex-col gap-8">
        <div className="flex items-center gap-4">
          <img
            src={review.img}
            alt={review.name}
            className="h-14 w-14 rounded-full border border-white/15 object-cover"
          />
          <div>
            <div className="font-display text-xl text-white">{review.name}</div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
              {review.role}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>
        </div>

        <p className="font-display text-2xl leading-snug text-white/90 md:text-3xl">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>
    </div>
  );
}

function SideCard({
  side,
  review,
}: {
  side: "left" | "right";
  review: (typeof reviews)[number];
}) {
  const x = side === "left" ? "-65%" : "65%";
  const rotate = side === "left" ? -10 : 10;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 0.3, x, rotate }}
      className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-full max-w-3xl -translate-x-1/2 lg:block"
    >
      <div className="glass h-full w-full rounded-3xl p-12">
        <div className="flex items-center gap-4">
          <img
            src={review.img}
            alt=""
            className="h-12 w-12 rounded-full border border-white/10 object-cover grayscale"
          />
          <div>
            <div className="font-display text-lg text-white/60">
              {review.name}
            </div>
          </div>
        </div>
        <p className="mt-6 line-clamp-3 text-base font-light text-white/30">
          {review.text}
        </p>
      </div>
    </motion.div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-amber-warm">
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.7L18 22l-6-3.6L6 22l1.5-7.3L2 10l7.1-1.1z" />
    </svg>
  );
}
