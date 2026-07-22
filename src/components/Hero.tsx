"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { hero, site } from "@/data/content";
import { MaskedLines } from "./motion-primitives";
import { Counter } from "./Counter";
import { ShaderBackdrop } from "./ShaderBackdrop";
import { TechArc } from "./TechArc";

export function Hero({ ready = true }: { ready?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax drift on the headline as the hero scrolls away.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  // The cue is an invitation to scroll — first movement should retire it.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, reduced ? 1 : 0]);

  return (
    <section
      id="top"
      ref={ref}
      /* justify-start, not center: centring split the leftover height above
         and below the copy, so ~180px opened up between the nav and the
         availability line no matter how far the top padding came down.
         Anchored to the top, pt is the gap. */
      className="relative flex min-h-svh flex-col justify-start overflow-hidden px-6 pt-28 pb-16 md:px-10"
    >
      {/* Live shader field, or a static glow where WebGL/motion is off */}
      <ShaderBackdrop />

      {/* Grid sits above the shader, masked out toward the centre */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      {/* Tall and narrow, so it rides the right edge rather than sitting in
          the corner. Absolutely placed rather than gridded beside the copy:
          giving it a column squeezed the intro to two words a line.

          Shown at every width now, always pinned to the right beside the
          headline — the same composition as desktop. It just scales down on
          narrower screens (origin top-right) so it tucks into the space to
          the right of the headline instead of covering it. pointer-events are
          off below lg so the shrunk arc never swallows taps meant for the
          copy; the tap-to-select interaction stays on desktop where it fits.
          top-28 matches the section's pt-28 so the arc starts on the
          availability line rather than floating below it. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="pointer-events-none absolute top-24 right-1 origin-top-right scale-[0.5] sm:top-28 sm:right-4 sm:scale-[0.72] md:right-6 md:scale-[0.85] lg:right-10 lg:scale-100 lg:pointer-events-auto"
      >
        <TechArc />
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center gap-3"
        >
          {site.available && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
            </span>
          )}
          {/* Location is optional: with it blank the em-dash was left dangling
              at the end of the line with nothing after it. */}
          <span className="type-label text-paper-dim">
            {site.available ? "Available for work" : "Currently engaged"}
            {site.location && ` — ${site.location}`}
          </span>
        </motion.div>

        <MaskedLines
          play={ready}
          lines={hero.headline}
          /* Down from 11.5vw: the headline shares the row with the wheel
             now, so it sizes against its own column rather than the page. */
          className="type-display text-[clamp(2.25rem,5.5vw,5rem)]"
          lineClassName="[&:nth-child(2)]:text-accent-bright"
        />

        {/* Two columns only from lg up: below that the stats sit their own
            full-width row under the intro. At md the auto-width stats column
            grabbed max-content — all three in a row — which crushed the intro
            to two words a line and wrapped the third stat onto an orphan row
            that read as missing on phones. */}
        <div className="mt-20 grid gap-12 border-t border-ink-line pt-10 lg:grid-cols-[1fr_auto] lg:gap-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-lg leading-relaxed text-paper-dim md:text-xl"
          >
            {hero.intro}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            /* Explicit grid, not flex-wrap: three fixed columns can never
               orphan the third stat. Stacked on phones so the long labels
               stay legible, three-up once there's room. */
            className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="type-label mb-2 text-paper-dim">{stat.label}</dt>
                <dd className="type-display text-3xl md:text-4xl">
                  <Counter value={stat.value} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Scroll cue, desktop only — on phones the stats already run past
          the fold, so the page explains itself. Entrance waits for the
          intro like everything else; scroll fades it via cueOpacity. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-6 hidden md:left-10 md:block"
      >
        <motion.div style={{ opacity: cueOpacity }} className="flex items-center gap-4">
          <span className="relative block h-10 w-px overflow-hidden bg-ink-line">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent-bright" />
          </span>
          <span className="type-label text-paper-dim">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
