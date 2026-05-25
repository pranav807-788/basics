import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

type Props = {
  /** Heading content. Word-by-word reveal is applied automatically when the
   *  child is a string; for richer markup pass JSX in `children`. */
  text?: string;
  children?: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Per-word stagger in seconds. */
  stagger?: number;
  /** Accent the last word with the amber tone. */
  accentLast?: boolean;
  /** Trigger only once when scrolled into view. Default true. */
  once?: boolean;
};

/**
 * WallText
 *
 * Renders text as if it were projected onto a surface by the bulb's light.
 * Each word fades up out of darkness with a soft amber glow and a slight
 * vertical drift, while a subtle 3D translateZ adds depth. The combined
 * effect makes the type feel born from the projection cone rather than
 * placed on top of it.
 */
export default function WallText({
  text,
  children,
  as: Tag = "h2",
  className = "",
  stagger = 0.08,
  accentLast = false,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-15% 0px -10% 0px" });

  // Split a string heading into words so we can stagger them. Preserve
  // newlines/spaces as expected.
  const words = text ? text.split(" ") : null;

  const inner = words ? (
    words.map((w, i) => {
      const isLast = i === words.length - 1;
      const accent = accentLast && isLast;
      return (
        <span
          key={i}
          className="mr-[0.22em] inline-block overflow-hidden align-baseline"
        >
          <motion.span
            className={`inline-block ${
              accent ? "italic text-amber-warm" : ""
            }`}
            initial={{
              y: "120%",
              opacity: 0,
              filter: "blur(14px)",
              rotateX: 22,
            }}
            animate={
              inView
                ? {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    rotateX: 0,
                  }
                : {}
            }
            transition={{
              delay: i * stagger,
              duration: 1.05,
              ease: [0.22, 0.8, 0.2, 1],
            }}
            style={{ transformOrigin: "50% 100%" }}
          >
            {w}
          </motion.span>
        </span>
      );
    })
  ) : (
    <motion.span
      className="inline-block"
      initial={{ y: 40, opacity: 0, filter: "blur(14px)" }}
      animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.1, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.span>
  );

  const wrapStyle = { transformStyle: "preserve-3d" } as const;
  const cls = `wall-text ${className}`;

  return (
    <div ref={ref} style={{ perspective: "1000px" }} className="inline-block">
      {Tag === "h1" ? (
        <h1 className={cls} style={wrapStyle}>
          {inner}
        </h1>
      ) : Tag === "h3" ? (
        <h3 className={cls} style={wrapStyle}>
          {inner}
        </h3>
      ) : Tag === "p" ? (
        <p className={cls} style={wrapStyle}>
          {inner}
        </p>
      ) : (
        <h2 className={cls} style={wrapStyle}>
          {inner}
        </h2>
      )}
    </div>
  );
}
