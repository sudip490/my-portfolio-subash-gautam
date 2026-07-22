"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/data/content";
import { Reveal, MaskedLines, ScrollProgress } from "./motion-primitives";
import { Counter } from "./Counter";
import { Cursor } from "./Cursor";
import { Grain } from "./Grain";
import { SmoothScroll } from "./SmoothScroll";
import { Magnetic } from "./Magnetic";
import { site } from "@/data/content";
import { ProjectScreen } from "./ProjectScreen";
import { ProjectVisual } from "./ProjectVisual";
import { ArchDiagram } from "./ArchDiagram";
import { ApiTerminal } from "./ApiTerminal";

export function CaseStudyBody({ project, next }: { project: Project; next: Project }) {
  const { study } = project;

  return (
    <>
      <Grain />
      <Cursor />
      <SmoothScroll />
      <ScrollProgress />

      {/* Minimal nav — just an escape hatch back to the index. */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-line bg-ink/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="type-label text-paper hover:text-accent-bright">
            ← {site.name}
          </Link>
          <Link href="/#work" className="type-label text-paper-dim hover:text-paper">
            All Work
          </Link>
        </nav>
      </header>

      <main id="main">
        {/* ---- Title ---- */}
        <section className="relative overflow-hidden px-6 pt-36 pb-16 md:px-10 md:pt-48">
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]"
          />
          <div className="relative mx-auto max-w-[1400px]">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <span className="type-label text-accent-bright">{project.category}</span>
              <span className="type-label text-paper-dim">{project.year}</span>
            </div>

            <MaskedLines
              lines={[project.title]}
              className="type-display text-[clamp(2rem,4.5vw,3.75rem)]"
            />

            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-paper-dim md:text-2xl">
              {study.overview}
            </p>

            <dl className="mt-14 grid gap-8 border-t border-ink-line pt-10 sm:grid-cols-3">
              {[
                { k: "Role", v: study.role },
                { k: "Timeline", v: study.timeline },
                { k: "Team", v: study.team },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="type-label mb-3 text-paper-dim">{row.k}</dt>
                  <dd className="leading-relaxed">{row.v}</dd>
                </div>
              ))}
            </dl>

            {/* The product itself — same screen the card shows, full size. */}
            <Reveal delay={0.1}>
              <div className="group relative mt-16 overflow-hidden border border-ink-line bg-ink-soft/60">
                <ProjectVisual category={project.category} slug={project.slug} />
                <ProjectScreen
                  slug={project.slug}
                  className={
                    project.device === "phone"
                      ? "relative mx-auto my-10 w-60 md:my-16 md:w-72"
                      : "relative mx-auto my-10 w-full max-w-3xl px-6 md:my-16"
                  }
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Outcomes ---- */}
        {study.outcomes && study.outcomes.length > 0 && (
          <section className="border-y border-ink-line bg-ink-soft px-6 py-16 md:px-10">
            <div className="mx-auto grid max-w-[1400px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {study.outcomes.map((o, i) => (
                <Reveal key={o.label} delay={i * 0.06}>
                  <div>
                    <p className="type-display mb-3 text-4xl text-accent-bright md:text-5xl">
                      <Counter value={o.value} />
                    </p>
                    <p className="type-label text-paper-dim">{o.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ---- Architecture ---- */}
        {study.architecture && (
          <section className="border-b border-ink-line px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto max-w-[1400px]">
              <Reveal>
                <span className="type-label mb-4 block text-accent-bright">System Design</span>
                <h2 className="type-display text-2xl md:text-4xl">Architecture</h2>
              </Reveal>
              <div className="mt-12 md:mt-16">
                <ArchDiagram architecture={study.architecture} />
              </div>
              {study.architecture.note && (
                <Reveal delay={0.15}>
                  <p className="mt-8 max-w-2xl font-mono text-xs leading-relaxed tracking-wide text-paper-dim">
                    <span className="text-accent-bright">— </span>
                    {study.architecture.note}
                  </p>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* ---- Narrative ---- */}
        <section className="px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            {study.sections.map((s, i) => (
              <Reveal key={s.heading}>
                <article className="grid gap-6 border-b border-ink-line py-12 last:border-0 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16 md:py-16">
                  <div>
                    <span className="type-label mb-4 block text-accent-bright">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="type-display text-2xl md:text-3xl">{s.heading}</h2>
                  </div>
                  <p className="max-w-2xl text-lg leading-relaxed text-paper-dim">{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- API demo ---- */}
        {study.apiDemo && (
          <section className="border-t border-ink-line bg-ink-soft/40 px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
              <Reveal>
                <div>
                  <span className="type-label mb-4 block text-accent-bright">In Practice</span>
                  <h2 className="type-display text-2xl md:text-3xl">The API, Live</h2>
                  <p className="mt-6 max-w-sm text-base leading-relaxed text-paper-dim">
                    {study.apiDemo.note}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <ApiTerminal demo={study.apiDemo} />
              </Reveal>
            </div>
          </section>
        )}

        {/* ---- Stack + links ---- */}
        <section className="border-t border-ink-line px-6 py-16 md:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="type-label mb-4 text-paper-dim">Built With</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-ink-line px-3 py-1 font-mono text-xs text-paper-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {study.links && study.links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {study.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-label cursor-pointer border border-paper px-5 py-3 transition-colors hover:bg-paper hover:text-ink"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---- Next project ---- */}
        <section className="relative overflow-hidden border-t border-ink-line">
          <Link href={`/work/${next.slug}`} className="group block px-6 py-24 md:px-10 md:py-32">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-accent opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08]"
            />
            <div className="relative mx-auto max-w-[1400px]">
              <p className="type-label mb-6 text-paper-dim">Next Project</p>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <motion.h2 className="type-display text-[clamp(2rem,4.5vw,3.75rem)] transition-transform duration-500 group-hover:translate-x-3">
                  {next.title}
                </motion.h2>
                <Magnetic strength={0.3}>
                  <span className="type-label border border-paper px-6 py-4">View →</span>
                </Magnetic>
              </div>
            </div>
          </Link>
        </section>

        {/* ---- Contact ---- */}
        <footer className="border-t border-ink-line px-6 py-14 md:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <a
              href={`mailto:${site.email}`}
              className="type-display cursor-pointer text-xl break-all hover:text-accent-bright md:text-2xl"
            >
              {site.email}
            </a>
            <ul className="flex flex-wrap gap-6">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="type-label cursor-pointer text-paper-dim hover:text-accent-bright"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </main>
    </>
  );
}
