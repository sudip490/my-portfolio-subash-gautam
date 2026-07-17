"use client";

import { education, volunteering, interests, type Credential } from "@/data/content";
import { Reveal } from "./motion-primitives";

function Entry({ item }: { item: Credential }) {
  return (
    <li className="group border-b border-ink-line py-8 transition-colors duration-300 last:border-0 hover:border-accent">
      <p className="type-label mb-3 text-paper-dim">{item.period}</p>
      <h3 className="type-display mb-2 text-xl md:text-2xl">{item.title}</h3>
      <p className="type-label mb-4 text-accent-bright">{item.org}</p>
      {item.note && (
        <p className="max-w-xl leading-relaxed text-paper-dim">{item.note}</p>
      )}
    </li>
  );
}

export function Background() {
  return (
    <section id="background" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 border-b border-ink-line pb-10">
            <p className="type-label mb-5 text-accent-bright">04 — Background</p>
            <h2 className="type-display text-[clamp(2.5rem,7vw,6rem)]">Off The Clock</h2>
          </div>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <Reveal>
              <p className="type-label mb-6 text-paper-dim">Education</p>
            </Reveal>
            <ul>
              {education.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <Entry item={item} />
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal>
              <p className="type-label mb-6 text-paper-dim">Volunteering</p>
            </Reveal>
            <ul>
              {volunteering.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <Entry item={item} />
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.12}>
              <div className="mt-12">
                <p className="type-label mb-5 text-paper-dim">Also</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag) => (
                    <span
                      key={tag}
                      className="border border-ink-line px-3 py-1 font-mono text-xs text-paper-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
