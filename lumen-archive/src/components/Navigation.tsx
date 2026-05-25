import { motion, useScroll, useTransform } from "framer-motion";

const links = [
  { label: "Designs", href: "#designs" },
  { label: "Process", href: "#process" },
  { label: "Story", href: "#story" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 60, 120], [0, 0.6, 1]);
  const blur = useTransform(scrollY, [0, 120], [0, 14]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0 -z-10 border-b border-white/5 bg-ink-900/60"
        style={{ opacity, backdropFilter: filter as unknown as string }}
      />
      <a href="#top" className="flex items-center gap-2 text-white">
        <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-amber-glow shadow-[0_0_16px_4px_rgba(255,184,107,0.8)]" />
        <span className="font-display text-xl tracking-wide">Lumen</span>
      </a>
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="group relative text-sm font-light text-white/70 transition-colors hover:text-white"
          >
            {l.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>
      <a
        href="#contact"
        className="hidden rounded-full px-4 py-2 text-sm font-medium md:inline-block btn-primary"
      >
        Book Consultation
      </a>
    </motion.header>
  );
}
