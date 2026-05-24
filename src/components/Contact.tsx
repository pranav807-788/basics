import { motion } from "framer-motion";
import { useState } from "react";
import Particles from "./Particles";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-32 md:py-40"
    >
      <Particles density={70} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,107,0.12),transparent_55%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-xs uppercase tracking-[0.4em] text-amber-warm/80"
          >
            Begin together
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
            className="mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-white"
          >
            Tell us about your{" "}
            <span className="italic text-amber-warm">kitchen.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/60 md:text-base"
          >
            Share a few details and we&rsquo;ll set up a relaxed conversation —
            online or at our studio. No pressure, no quotes until you ask.
          </motion.p>

          <div className="mt-12 flex flex-col gap-5">
            <ContactRow
              label="Phone"
              value="+91 98220 14422"
              href="tel:+919822014422"
              icon={<PhoneIcon />}
            />
            <ContactRow
              label="Email"
              value="studio@lumen.kitchen"
              href="mailto:studio@lumen.kitchen"
              icon={<MailIcon />}
            />
            <ContactRow
              label="WhatsApp"
              value="Chat with the studio"
              href="https://wa.me/919822014422"
              icon={<WhatsappIcon />}
              accent
            />
          </div>

          <div className="mt-12 flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-warm/40 hover:bg-amber-warm/10 hover:text-amber-warm hover:shadow-[0_0_20px_rgba(255,184,107,0.4)]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>

      <Footer />
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon,
  accent,
}: {
  label: string;
  value: string;
  href: string;
  icon: JSX.Element;
  accent?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
      className={`group flex items-center gap-4 rounded-2xl border border-white/8 px-5 py-4 transition-all duration-500 hover:border-white/20 ${
        accent ? "bg-amber-warm/5" : ""
      }`}
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-xl border border-white/10 ${
          accent
            ? "bg-amber-warm/10 text-amber-warm shadow-[0_0_24px_rgba(255,184,107,0.3)]"
            : "bg-white/5 text-amber-warm"
        }`}
      >
        {icon}
      </span>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
          {label}
        </div>
        <div className="text-base text-white/85">{value}</div>
      </div>
      <span className="text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-warm">
        →
      </span>
    </motion.a>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 0.8, 0.2, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="glass-strong relative rounded-3xl p-8 md:p-10"
    >
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(255,184,107,0.18),transparent_55%)] opacity-70" />
      <div className="relative grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name" placeholder="Your name" />
          <Field label="Phone" placeholder="+91 ..." type="tel" />
        </div>
        <Field label="Email" placeholder="you@home.com" type="email" />
        <Field label="Project area" placeholder="e.g. 240 sq ft" />
        <Field label="Tell us about it" placeholder="A few words about the space and how you cook..." textarea />
        <button
          type="submit"
          className="btn-primary group mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
        >
          {sent ? "Thank you — we'll be in touch" : "Send enquiry"}
          {!sent && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </button>
        <p className="text-center text-xs text-white/40">
          We respond within one working day.
        </p>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="group flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-amber-warm/50 focus:bg-white/[0.04] focus:shadow-[0_0_28px_-6px_rgba(255,184,107,0.45)]"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-amber-warm/50 focus:bg-white/[0.04] focus:shadow-[0_0_28px_-6px_rgba(255,184,107,0.45)]"
        />
      )}
    </label>
  );
}

function Footer() {
  return (
    <div className="relative mx-auto mt-32 flex max-w-6xl flex-col items-start justify-between gap-6 border-t border-white/5 px-6 pt-10 text-xs text-white/40 md:flex-row md:items-center">
      <div className="flex items-center gap-2 text-white/60">
        <span className="h-2 w-2 rounded-full bg-amber-warm shadow-[0_0_10px_rgba(255,184,107,0.7)]" />
        <span className="font-display text-base text-white">Lumen</span>
        <span className="ml-2 text-white/30">— Living Kitchens</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a className="hover:text-white" href="#designs">
          Designs
        </a>
        <a className="hover:text-white" href="#process">
          Process
        </a>
        <a className="hover:text-white" href="#story">
          Story
        </a>
        <a className="hover:text-white" href="#reviews">
          Reviews
        </a>
        <a className="hover:text-white" href="#contact">
          Contact
        </a>
      </div>
      <div>© {new Date().getFullYear()} Lumen Studio</div>
    </div>
  );
}

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
        <circle cx="12" cy="12" r="9" />
        <path d="M11 8c2.5 0 4 1.6 4 3.6 0 2.4-1.3 4.4-3.3 4.4-1 0-1.8-.6-1.6-1.4l.6-2.6" />
        <path d="M10.4 17.5L9 22" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
        <path d="M3 6h5a2.5 2.5 0 010 5H3zM3 11h6a2.5 2.5 0 010 5H3z" />
        <path d="M14 13c0-2 1.5-3.5 3.5-3.5S21 11 21 13H14zM14 13c0 2 1.5 3.5 3.5 3.5 1.4 0 2.5-.7 3-1.7" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
      <path d="M5 4h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
      <path d="M4 20l1.4-4A8 8 0 1112 20H8z" />
      <path d="M9 11c0 2 1.5 4 3.5 4l1-1 2 1c0 1.5-1 2-2 2" />
    </svg>
  );
}
