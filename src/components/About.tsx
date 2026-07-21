"use client";

import Image from "next/image";
import { about, site, skills } from "@/data/content";
import { Reveal, ScrollFillWords } from "./motion-primitives";

export function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:px-10 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full bg-accent opacity-10 blur-[150px]"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="type-label mb-5 text-accent-bright">02 — About</p>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24">
          <div>
            {/* Words light up with scroll position — the heading reads
                itself to you at the pace you scroll. */}
            <ScrollFillWords
              text={about.heading}
              className="type-display mb-12 text-[clamp(2rem,4.5vw,3.75rem)] tracking-tight"
            />

            <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
              <Reveal>
                {/* Square source, so a square frame — no cropping guesswork.
                    priority is off: this sits well below the fold and would
                    otherwise compete with the hero for bandwidth. */}
                <Image
                  src={site.photo}
                  alt={`${site.name}, ${site.role}`}
                  width={800}
                  height={800}
                  sizes="(min-width: 640px) 11rem, 9rem"
                  className="h-36 w-36 shrink-0 border border-ink-line object-cover grayscale transition-all duration-500 hover:grayscale-0 sm:h-44 sm:w-44"
                />
              </Reveal>

              <div className="space-y-6">
                {about.paragraphs.map((para, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <p className="max-w-xl text-lg leading-relaxed text-paper-dim">{para}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Reveal>
              <p className="type-label mb-8 text-paper-dim">Operating Principles</p>
            </Reveal>

            <dl className="mb-16 space-y-px">
              {about.principles.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="border-l-2 border-ink-line py-4 pl-6 transition-colors duration-300 hover:border-accent">
                    <dt className="type-display mb-2 text-xl">{p.title}</dt>
                    <dd className="text-sm leading-relaxed text-paper-dim">{p.body}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal>
              <p className="type-label mb-8 text-paper-dim">Toolkit</p>
            </Reveal>

            <div className="space-y-6">
              {skills.map((group, i) => (
                <Reveal key={group.group} delay={i * 0.06}>
                  <div className="border-t border-ink-line pt-4">
                    <p className="type-label mb-3 text-accent-bright">{group.group}</p>
                    <p className="font-mono text-sm leading-relaxed text-paper-dim">
                      {group.items.join("  ·  ")}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
