"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { ticker } from "@/data/content";

/* Base drift in track-% per second. The track holds two copies, so 50%
   is one full loop — this matches the old CSS marquee's 36s lap. */
const BASE_SPEED = 1.4;

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* Marquee proof strip under the hero. Used to be a fixed-rate CSS
   animation; now the track is driven by rAF so it can react to scroll —
   it surges with scroll velocity and flips direction when the visitor
   scrolls back up, which makes the page feel like one connected machine.
   Reduced motion: the loop never runs, the strip parks on the first copy.
   The second copy is aria-hidden so screen readers hear the list once. */
export function Ticker() {
  const reduced = useReducedMotion();

  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  /* Unclamped: a hard fling can push past the 4x boost and it still reads
     as momentum rather than a capped speed. */
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false });

  /* -1 drifts left. Flips to follow the last scroll direction. */
  const direction = useRef(-1);
  const hovering = useRef(false);
  /* Eased 0..1 multiplier so hover pauses glide instead of freezing. */
  const pause = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const target = hovering.current ? 0 : 1;
    pause.current += (target - pause.current) * Math.min(1, delta / 160);

    const vf = velocityFactor.get();
    if (vf < 0) direction.current = 1;
    else if (vf > 0) direction.current = -1;

    let moveBy = direction.current * BASE_SPEED * (delta / 1000) * pause.current;
    moveBy += moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ticker.map((item) => (
        <li key={item} className="type-label flex items-center whitespace-nowrap text-paper-dim">
          <span aria-hidden className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-accent-bright" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="overflow-hidden border-y border-ink-line py-5"
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <motion.div style={{ x }} className="flex w-max">
        {row(false)}
        {row(true)}
      </motion.div>
    </div>
  );
}
