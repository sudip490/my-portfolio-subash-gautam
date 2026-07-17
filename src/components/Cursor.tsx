"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* Pointer capability read through useSyncExternalStore so it's derived
   during render rather than set from an effect. */
const POINTER_QUERY = "(pointer: fine)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(POINTER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(POINTER_QUERY).matches;
const getServerSnapshot = () => false;

/* Blend-mode cursor dot that swells over interactive elements.
   Desktop pointers only — hidden on touch and for reduced motion. */
export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const enabled = finePointer && !reduced;

  const [hot, setHot] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    // Hide the native cursor only once ours is confirmed rendering, so a
    // touch device or reduced-motion visitor never loses it.
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, [role='tab']")));
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          width: hot ? 56 : 12,
          height: hot ? 56 : 12,
          x: hot ? -28 : -6,
          y: hot ? -28 : -6,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </motion.div>
  );
}
