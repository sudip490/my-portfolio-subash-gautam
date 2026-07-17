"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/data/content";

/* Full-bleed intro: a count to 100, then the panel splits and lifts
   away. Skipped entirely for reduced-motion visitors. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Reduced-motion visitors skip the intro entirely; the component
    // renders nothing, so only the parent needs telling.
    if (reduced) {
      onDone();
      return;
    }

    let raf = 0;
    const start = performance.now();
    const DURATION = 1600;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // easeOutExpo so the number races then settles.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setGone(true);
          onDone();
        }, 350);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onDone]);

  // Hold the page still while the intro panel is up.
  useEffect(() => {
    if (reduced || gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [reduced, gone]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          /* Purely decorative: the real content is already in the DOM
             beneath it, so don't announce a counting animation. */
          aria-hidden
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-10 md:px-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between">
            <span className="type-label text-paper-dim">{site.name}</span>
            <span className="type-label text-paper-dim">{site.location}</span>
          </div>

          {/* Progress rule */}
          <motion.div
            className="h-px w-full origin-left bg-ink-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            transition={{ ease: "linear" }}
          >
            <div className="h-full w-full bg-accent" />
          </motion.div>

          <div className="flex items-end justify-between gap-6">
            <span className="type-label max-w-xs text-paper-dim">{site.role}</span>
            <span className="type-display text-[clamp(4rem,18vw,14rem)] tabular-nums">
              {count}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
