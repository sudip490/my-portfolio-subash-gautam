"use client";

import { packages } from "@/data/content";
import { Reveal } from "./motion-primitives";

export function OpenSource() {
  return (
    <section id="open-source" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 border-b border-ink-line pb-10">
            <p className="type-label mb-5 text-accent-bright">05 — Open Source</p>
            <h2 className="type-display text-[clamp(2.5rem,7vw,6rem)]">On npm</h2>
          </div>
        </Reveal>

        <ul>
          {packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 0.08}>
              <li className="group grid gap-5 border-b border-ink-line py-10 transition-colors duration-300 hover:border-accent md:grid-cols-[1fr_minmax(0,9rem)] md:gap-16 md:py-12">
                <div>
                  <a
                    href={pkg.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-display cursor-pointer text-xl break-all transition-colors hover:text-accent-bright md:text-2xl"
                  >
                    {pkg.name}
                  </a>

                  <p className="mt-4 max-w-2xl leading-relaxed text-paper-dim">{pkg.blurb}</p>

                  {/* The one-liner is the point: it turns a claim into
                      something the reader can run before they finish the
                      sentence. Only shown where it actually does something. */}
                  {pkg.try && (
                    <code className="mt-5 block w-fit max-w-full overflow-x-auto border border-ink-line bg-ink-soft px-4 py-3 font-mono text-xs text-paper-dim">
                      {pkg.try}
                    </code>
                  )}
                </div>

                <div className="flex items-start gap-6 md:flex-col md:items-end md:gap-3 md:text-right">
                  <div>
                    <p className="type-display text-2xl text-accent-bright md:text-3xl">
                      {pkg.downloads}
                    </p>
                    <p className="type-label mt-1 text-paper-dim">Downloads</p>
                  </div>
                  <p className="type-label text-paper-dim">v{pkg.version}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
