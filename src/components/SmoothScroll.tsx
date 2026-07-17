"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

/* Lenis inertial scrolling. Bails out entirely when the visitor
   prefers reduced motion so native scrolling stays untouched. */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    /* lerp, not duration: duration-based easing restarts its curve on
       every wheel event, so continuous scrolling fights itself and feels
       floaty. A lerp converges toward the target each frame instead —
       responsive under fast input, still smooth. */
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      // Native momentum on touch is already good; don't fight it.
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Let in-page anchors drive Lenis rather than native jump.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
