"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { stack } from "@/data/content";
import { ICONS } from "./stackIcons";

/* A C: circle centre off to the right, cards riding the left of the ring.
   The centred card sits at the bulge and the rest curve back toward the
   edge above and below it — ~200px across, ~440px tall, so it hugs the
   hero's right side instead of spanning it. */
const RADIUS = 260;
const STEP = 16;
const WINDOW = 4;

/* Cards step along the arch on their own. No arrows, so this is the only
   thing that moves it — it must never stop. */
const AUTO_MS = 2500;

function wrap(i: number, len: number) {
  return ((i % len) + len) % len;
}

const START = Math.max(
  stack.findIndex((s) => s.name === "Node.js"),
  0
);

export function TechArc() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(START);
  const len = stack.length;
  /* Unique per instance: the arc renders twice (pinned on desktop, in-flow
     on mobile), so a hardcoded id would duplicate in the DOM. */
  const headingId = useId();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => wrap(a + 1, len)), AUTO_MS);
    return () => clearInterval(id);
  }, [reduced, len]);

  return (
    <div aria-labelledby={headingId} role="group" className="relative h-[34rem] w-[14rem]">
      <h2 id={headingId} className="sr-only">
        Technology stack
      </h2>

      <ul className="contents">
        {stack.map((item, i) => {
          /* Shortest signed distance around the ring, so wrapping from the
             last card to the first travels one step, not len-1. */
          let offset = i - active;
          if (offset > len / 2) offset -= len;
          if (offset < -len / 2) offset += len;
          if (Math.abs(offset) > WINDOW) return null;

          const angle = offset * STEP;
          const rad = (angle * Math.PI) / 180;
          /* Swapped from the arch: the ring's centre is to the RIGHT, so
             the bulge runs left and cards fall away vertically. x barely
             moves, y carries the travel — that's what makes a C. */
          const x = RADIUS * (1 - Math.cos(rad));
          const y = RADIUS * Math.sin(rad);

          const dist = Math.abs(offset);
          const isActive = offset === 0;
          const icon = item.icon ? ICONS[item.icon] : null;

          return (
            <motion.li
              key={item.name}
              className="absolute top-1/2 left-0 will-change-transform"
              style={{ zIndex: WINDOW - dist }}
              animate={{
                x,
                y: `calc(-50% + ${y}px)`,
                rotate: -angle,
                opacity: 1 - Math.min(dist * 0.18, 0.72),
                scale: 1 - Math.min(dist * 0.08, 0.32),
              }}
              transition={
                reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }
              }
            >
              {/* Card holds only the mark; the name sits under it, the way
                  the reference hangs a price beneath each flag. */}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${item.name} — ${item.label}`}
                aria-current={isActive ? "true" : undefined}
                className="relative flex cursor-pointer flex-col items-center"
              >
                <span
                  className={`flex h-[3rem] w-[4rem] items-center justify-center border bg-ink transition-colors duration-300 ${
                    isActive ? "border-accent-bright" : "border-ink-line hover:border-paper-dim"
                  }`}
                >
                  {icon ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className={`h-5 w-5 transition-colors duration-300 ${
                        isActive ? "fill-accent-bright" : "fill-paper-dim"
                      }`}
                    >
                      <path d={icon.path} />
                    </svg>
                  ) : (
                    /* No icon in the set — the wordmark carries the card. */
                    <span
                      aria-hidden
                      className={`type-display text-[0.7rem] transition-colors duration-300 ${
                        isActive ? "text-accent-bright" : "text-paper-dim"
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </span>

                {/* Only the centred card is named. Every card carrying its
                    own label collided — "REDIS POSTGRESQL NODE.JS" ran into
                    one another, because tech names need more room than the
                    arc gives each card. The reference does the same thing:
                    only the live flags get a price, the rest just read OUT.
                    Absolute so the name doesn't shift the card off the arc
                    when it appears. */}
                <span
                  className={`type-label absolute top-full left-1/2 mt-2 -translate-x-1/2 text-center text-[0.55rem] leading-none whitespace-nowrap transition-opacity duration-300 ${
                    isActive ? "text-paper opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                >
                  {item.name}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
