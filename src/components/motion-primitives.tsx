"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useRef, type ReactNode } from "react";

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

/* MaskedLines' scroll-triggered sibling: the same per-line mask reveal,
   but fired by the section entering the viewport instead of the intro
   sequence. Renders an h2 — this is for section headings. Lines are
   ReactNode so a line can carry its own effect (see Contact). */
export function MaskedHeading({
  lines,
  className,
  lineClassName,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.09 } },
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
    <motion.h2
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {lines.map((text, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span className={`block ${lineClassName ?? ""}`} variants={line}>
            {text}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

/* One word of a ScrollFillWords heading. Split out so the per-word
   useTransform runs in a component whose count never changes. */
function FillWord({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: string;
}) {
  const start = index / total;
  /* Colour, not opacity: dim words must stay legible — this is the
     heading, not decoration. Ink-line grey up to paper. */
  const color = useTransform(progress, [start, start + 1 / total], ["#3d3d46", "#fafafa"]);

  return (
    <motion.span style={{ color }}>
      {children}{" "}
    </motion.span>
  );
}

/* Scroll-linked heading fill: words brighten one by one as the heading
   rides up the viewport, so reading pace and scroll pace line up. */
export function ScrollFillWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    /* Fill starts as the heading clears the fold and completes while
       it's still comfortably readable — never half-lit at rest. */
    offset: ["start 0.92", "start 0.4"],
  });

  if (reduced) return <h2 className={className}>{text}</h2>;

  const words = text.split(" ");

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <FillWord key={`${word}-${i}`} progress={scrollYProgress} index={i} total={words.length}>
          {word}
        </FillWord>
      ))}
    </h2>
  );
}

/* Hairline that draws itself left-to-right on entering the viewport.
   Stands in for static border-b on section headers. */
export function DrawnRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left bg-ink-line ${className ?? ""}`}
      initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={reduced ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduced ? 0.2 : 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
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
