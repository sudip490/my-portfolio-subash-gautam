"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";

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

/* Follow rate, in e-folds per second: the dot closes ~90% of the gap to
   the pointer every 100ms. High enough to still feel attached to the
   hand, low enough to read as a glide rather than a hard lock. */
const FOLLOW = 24;
/* Size: snappy enough that the swell finishes before the dot has caught
   up, so the two read as one gesture. */
const SWELL = { type: "spring", stiffness: 400, damping: 30 } as const;

/* The dot is laid out at its swollen size and scaled *down* to rest, not
   the other way round: the browser rasterises the circle once at its box
   size, so growing a 12px dot to 56px would enlarge those pixels and
   leave a soft edge on hover. Minifying a big circle stays clean. */
const DOT = 56;
const DOT_REST = 12 / DOT;
const BADGE = 84;

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
  /* The last word shown, kept after label clears so the badge still has
     something to shrink with instead of emptying on its first frame. */
  const [shownLabel, setShownLabel] = useState("");

  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Hide the native cursor only once ours is confirmed rendering, so a
    // touch device or reduced-motion visitor never loses it.
    document.documentElement.classList.add("has-custom-cursor");

    /* Where the pointer is, and where the dot currently is. pointermove
       does nothing but write into `to`: a high-polling-rate mouse fires
       it a dozen times per frame, and driving the transform from the
       event meant a dozen redundant style writes for one painted frame.
       The rAF loop is the only thing that touches the DOM, exactly once
       per frame, which is the whole trick to a cursor that doesn't
       shimmer. */
    const to = { x: -100, y: -100 };
    const at = { x: -100, y: -100 };
    let placed = false;

    const move = (e: PointerEvent) => {
      to.x = e.clientX;
      to.y = e.clientY;
      // First sighting: appear where the pointer is, don't fly in from
      // the corner.
      if (!placed) {
        at.x = to.x;
        at.y = to.y;
        placed = true;
      }
    };

    /* Hover state rides on pointerover, which only fires when the pointer
       crosses into a different element. Running these closest() lookups
       and two setStates off pointermove meant a full React render between
       every frame of the follow — that queueing is what made the dot feel
       like it was catching rather than gliding. */
    const over = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, [role='tab']")));
      const next = el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null;
      setLabel(next);
      if (next) setShownLabel(next);
    };

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      /* 1 - e^-kt rather than a flat per-frame fraction. A fixed step
         closes the gap more than twice as fast on a 165Hz panel as on a
         60Hz one, so the same code feels different on every machine and
         visibly coarser on the slow ones. This converges over the same
         wall-clock time whatever the refresh rate. */
      const k = 1 - Math.exp(-FOLLOW * dt);
      at.x += (to.x - at.x) * k;
      at.y += (to.y - at.y) * k;

      /* translate3d, not translate: keeps the dot on its own compositor
         layer, so following the pointer costs a transform rather than a
         repaint. Sub-pixel values are kept — rounding to whole pixels is
         what makes slow cursor movement look like it's stepping. */
      wrap.current?.style.setProperty(
        "transform",
        `translate3d(${at.x}px, ${at.y}px, 0)`
      );
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    /* The blend has to live on this element, not on the dot inside it.
       Anything that creates a stacking context — and the transform below
       does — forms an isolated group, so a blended child would have had
       nothing left to difference against but its own transparent parent.
       Dropped while a label shows so the badge's text stays legible over
       whatever it happens to be sitting on. */
    <div
      ref={wrap}
      aria-hidden
      className={`pointer-events-none fixed top-0 left-0 z-[90] ${
        label ? "" : "mix-blend-difference"
      }`}
      /* Written once by React on mount and never diffed again (the value
         is identical on every render), which leaves the rAF loop free to
         own this property outright. */
      style={{ transform: "translate3d(-100px, -100px, 0)", willChange: "transform" }}
    >
      {/* Both children are laid out once at a fixed size and driven by
          scale alone. Animating width/height put a layout pass and a
          repaint on every frame of the swell; scale is a transform, so it
          stays on the compositor. */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{ width: DOT, height: DOT, top: -DOT / 2, left: -DOT / 2 }}
        animate={{ scale: label ? 0 : hot ? 1 : DOT_REST }}
        transition={SWELL}
      />
      <motion.div
        className="absolute flex items-center justify-center overflow-hidden rounded-full bg-accent"
        style={{ width: BADGE, height: BADGE, top: -BADGE / 2, left: -BADGE / 2 }}
        initial={false}
        animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
        transition={SWELL}
      >
        <span className="type-label whitespace-nowrap text-paper">
          {label ?? shownLabel}
        </span>
      </motion.div>
    </div>
  );
}
