"use client";

import { ticker } from "@/data/content";

/* Marquee proof strip under the hero. The track holds two copies of the
   list and slides -50% on a loop, so the seam is invisible. The global
   reduced-motion rule zeroes the animation, which simply parks it on the
   first copy — still readable, nothing to special-case. The second copy
   is aria-hidden so screen readers hear the list once. */
export function Ticker() {
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
    <div className="overflow-hidden border-y border-ink-line py-5 hover:[&>div]:[animation-play-state:paused]">
      <div className="flex w-max [animation:marquee_36s_linear_infinite]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
