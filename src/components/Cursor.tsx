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
  /* Set by anything carrying data-cursor="…" (project cards say "View").
     With a label the dot stops being a dot: it grows into a solid accent
     badge with the word inside, and drops the difference blend so the
     text is guaranteed legible whatever it's over. */
  const [label, setLabel] = useState<string | null>(null);

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
      setLabel(el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hot ? 56 : 12;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed top-0 left-0 z-[90] ${
        label ? "" : "mix-blend-difference"
      }`}
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className={`flex items-center justify-center overflow-hidden rounded-full ${
          label ? "bg-accent" : "bg-white"
        }`}
        animate={{
          width: size,
          height: size,
          x: -size / 2,
          y: -size / 2,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="type-label whitespace-nowrap text-paper"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
