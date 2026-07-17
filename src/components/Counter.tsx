"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/* Counts a numeric stat up when it scrolls into view. Preserves any
   non-numeric characters in the source string ("99.98%", "5+", "40+")
   so the animation lands on exactly the authored value. */
export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  // Derived during render — a plain string, so it's stable in deps.
  const numeric = value.match(/[\d.]+/)?.[0] ?? null;
  const animatable = numeric !== null && !reduced;

  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!animatable || !inView || numeric === null) return;

    const target = parseFloat(numeric);
    const decimals = (numeric.split(".")[1] ?? "").length;
    const DURATION = 1400;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(value.replace(numeric, (target * eased).toFixed(decimals)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, numeric, animatable]);

  // Pre-animation resting state: the same string zeroed out, so layout
  // width doesn't jump when the count starts.
  const resting =
    animatable && numeric !== null
      ? value.replace(numeric, (0).toFixed((numeric.split(".")[1] ?? "").length))
      : value;

  return (
    <span ref={ref} className="tabular-nums">
      {display ?? resting}
    </span>
  );
}
