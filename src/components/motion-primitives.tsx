"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";

/* Reveal-on-scroll wrapper. Collapses to a plain fade when the
   visitor has prefers-reduced-motion set. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduced ? 0.2 : 0.7,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* Per-line mask reveal for oversized display type. Each line sits in
   an overflow-hidden track and slides up from below the mask. */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  play = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /* Gate the entrance so it can wait for an intro sequence to clear. */
  play?: boolean;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.15 },
    },
  };

  const line: Variants = {
    hidden: reduced ? { opacity: 0 } : { y: "110%" },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: reduced ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate={play ? "show" : "hidden"}
    >
      {lines.map((text) => (
        <span key={text} className="block overflow-hidden pb-[0.06em]">
          <motion.span className={`block ${lineClassName ?? ""}`} variants={line}>
            {text}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

/* Fixed scroll-progress bar across the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  /* A stiff, heavily-damped spring only — Lenis already smooths the
     underlying scroll position, so a soft spring here double-smooths and
     the bar visibly trails the page. This just takes the edge off. */
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-accent will-change-transform"
      style={{ scaleX }}
    />
  );
}
