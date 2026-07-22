"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site, contact } from "@/data/content";
import { MaskedHeading, Reveal } from "./motion-primitives";
import { Magnetic } from "./Magnetic";

/* Outlined type that fills solid left-to-right as it scrolls up the
   viewport — the sentence completes itself on the way in. The filled
   copy sits on top of the stroked one behind a clip-path window driven
   by scroll progress; negative vertical insets keep tight display
   line-height from shaving the glyphs. */
function StrokeFill({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    (v) => `inset(-0.15em ${(1 - v) * 100}% -0.15em 0)`
  );

  if (reduced) return <span className="text-stroke">{text}</span>;

  return (
    <span ref={ref} className="relative inline-block">
      <span className="text-stroke">{text}</span>
      <motion.span aria-hidden style={{ clipPath }} className="absolute inset-0 text-paper">
        {text}
      </motion.span>
    </span>
  );
}

/* Local time in Kathmandu, mounted client-side only: the server renders
   the placeholder, so hydration never compares two different clocks. */
function KathmanduTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="type-label text-paper-dim">
      Kathmandu, Nepal — <span className="text-paper">{time ?? "--:--"}</span> NPT
    </p>
  );
}

export function Contact() {
  const reduced = useReducedMotion();
  /* Page is prerendered, so this is evaluated at build time on the server
     and again at hydration in the browser. Across a new year those
     disagree — suppress rather than ship a hydration error to a site that
     may sit deployed for years. */
  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-ink-line px-6 pt-28 pb-10 md:px-10 md:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent opacity-20 blur-[150px]"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="type-label mb-5 text-accent-bright">06 — Contact</p>
        </Reveal>

        <MaskedHeading
          lines={["Let's Work", <StrokeFill key="together" text="Together" />]}
          className="type-display mb-10 text-[clamp(2.25rem,6vw,5rem)]"
        />

        {/* Pitch and email on the left, the places I already live on the
            right — the column the section never had. */}
        <div className="grid gap-16 lg:grid-cols-[1fr_24rem] lg:gap-24">
          <div>
            <Reveal delay={0.1}>
              <p className="mb-14 max-w-xl text-lg leading-relaxed text-paper-dim md:text-xl">
                {contact.pitch}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <Magnetic strength={0.18} className="inline-block w-full max-w-3xl">
                <motion.a
                  href={`mailto:${site.email}`}
                  whileHover={reduced ? undefined : { scale: 1.015 }}
                  whileTap={reduced ? undefined : { scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  className="group inline-flex w-full cursor-pointer items-center justify-between gap-6 border border-paper bg-paper px-8 py-7 text-ink transition-colors duration-300 hover:bg-accent hover:text-paper md:px-10 md:py-9"
                >
                  <span className="type-display text-xl break-all md:text-3xl">{site.email}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    aria-hidden
                    className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 md:h-8 md:w-8"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </motion.a>
              </Magnetic>
            </Reveal>

            {site.resumeUrl && (
              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <a
                    href={site.resumeUrl}
                    className="type-label group inline-flex cursor-pointer items-center gap-3 border border-paper px-7 py-4 transition-colors duration-300 hover:bg-paper hover:text-ink"
                  >
                    Download Resume
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      aria-hidden
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    >
                      <path d="M12 4v12M6 12l6 6 6-6" />
                    </svg>
                  </a>
                  <p className="text-sm text-paper-dim">
                    PDF, one page — or read it in the browser.
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.2}>
            <p className="type-label mb-2 text-paper-dim">Elsewhere</p>
            <ul>
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex cursor-pointer items-center justify-between border-b border-ink-line py-5 transition-colors duration-200 hover:text-accent-bright"
                  >
                    <span className="type-display text-xl md:text-2xl">{social.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      aria-hidden
                      className="h-4 w-4 text-paper-dim transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <KathmanduTime />
            </div>
          </Reveal>
        </div>

        <footer className="mt-28 flex flex-col gap-6 border-t border-ink-line pt-8 md:flex-row md:items-center md:justify-between">
          {/* Location is optional — without the guard the em-dash dangles. */}
          <p className="type-label text-paper-dim" suppressHydrationWarning>
            © {year} {site.name}
            {site.location && ` — ${site.location}`}
          </p>

          {/* Socials moved up into the Elsewhere column — repeating them
              two inches below would just be noise. */}
          <a
            href="#top"
            className="type-label cursor-pointer text-paper-dim transition-colors duration-200 hover:text-accent-bright"
          >
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
