"use client";

import { experience } from "@/data/content";
import { Reveal } from "./motion-primitives";

export function Experience() {
  return (
    <section id="experience" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 border-b border-ink-line pb-10">
            <p className="type-label mb-5 text-accent-bright">03 — Experience</p>
            <h2 className="type-display text-[clamp(2.5rem,7vw,6rem)]">Where I&apos;ve Worked</h2>
          </div>
        </Reveal>

        <ol>
          {experience.map((role, i) => (
            <Reveal key={role.company} delay={i * 0.08}>
              <li className="group grid gap-6 border-b border-ink-line py-10 transition-colors duration-300 hover:border-accent md:grid-cols-[minmax(0,14rem)_1fr] md:gap-16 md:py-14">
                <div>
                  <p className="type-label mb-3 text-paper-dim">{role.period}</p>
                  <p className="type-display text-2xl text-accent-bright transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                    {role.company}
                  </p>
                </div>

                <div>
                  <h3 className="type-display mb-4 text-2xl md:text-3xl">{role.title}</h3>
                  <p className="mb-6 max-w-2xl leading-relaxed text-paper-dim">{role.blurb}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border border-ink-line px-3 py-1 font-mono text-xs text-paper-dim"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
