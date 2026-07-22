"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { projects, type Project } from "@/data/content";
import { DrawnRule, MaskedHeading, Reveal } from "./motion-primitives";
import { ProjectVisual } from "./ProjectVisual";
import { ProjectScreen } from "./ProjectScreen";
import { MotionBackdrop } from "./MotionBackdrop";

/* Screen placement inside the media area, by card shape × device. Phones
   hang centred and crop at the bottom edge; browsers pin near the top
   (or centre vertically in a featured side column) and bleed below.
   Every variant un-tilts a couple of degrees on hover. */
const SCREEN_POS = {
  featuredPhone:
    "absolute top-6 left-1/2 w-56 -translate-x-1/2 rotate-[2deg] transition-transform duration-500 group-hover:rotate-0 md:top-10 md:w-60",
  featuredBrowser:
    "absolute inset-x-6 top-8 rotate-[-1.5deg] transition-transform duration-500 group-hover:rotate-0 sm:inset-x-10 md:top-1/2 md:-translate-y-1/2",
  phone:
    "absolute top-6 left-1/2 w-56 -translate-x-1/2 rotate-[2deg] transition-transform duration-500 group-hover:rotate-0",
  browser:
    "absolute inset-x-6 top-6 rotate-[-1.5deg] transition-transform duration-500 group-hover:rotate-0 sm:inset-x-10 sm:top-8",
} as const;

/* Diameter of the hover spotlight blob, in px. */
const SPOT = 380;

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className={className}
      aria-hidden
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* Pointer-tracked spotlight. Driven by transform rather than by
     animating a radial-gradient's `at` position: moving the gradient
     repaints the whole card every frame, whereas translating a
     pre-rendered blob is a compositor-only operation. */
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  /* Pointer-tracked tilt — a couple of degrees, spring-damped, mouse
     only. Enough to make the card feel physical without shearing the
     type. Springs so leave snaps back with a little life. */
  const rx = useSpring(0, { stiffness: 120, damping: 16, mass: 0.6 });
  const ry = useSpring(0, { stiffness: 120, damping: 16, mass: 0.6 });

  return (
    <motion.article
      ref={ref}
      layout
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        if (reduced) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        // Centre the 380px blob on the pointer.
        mx.set(e.clientX - r.left - SPOT / 2);
        my.set(e.clientY - r.top - SPOT / 2);
        // Tilt toward the pointer. Touch drags scroll — never tilt there.
        if (e.pointerType === "mouse") {
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rx.set(-py * 3.5);
          ry.set(px * 3.5);
        }
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{
        duration: 0.5,
        delay: reduced ? 0 : Math.min(index * 0.06, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative flex flex-col overflow-hidden border border-ink-line bg-ink-soft transition-colors duration-300 hover:border-accent ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Pointer spotlight — transform-only, composited */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full opacity-0 blur-[70px] transition-opacity duration-300 will-change-transform group-hover:opacity-100"
        style={{
          x: mx,
          y: my,
          width: SPOT,
          height: SPOT,
          /* Token, not a literal — the spotlight has to follow the theme. */
          background: "color-mix(in srgb, var(--color-accent) 30%, transparent)",
        }}
      />

      {/* Media first in the DOM so phones read image-then-text; on wide
          featured cards it becomes the right column instead. */}
      <div className={project.featured ? "flex-1 md:grid md:grid-cols-2" : "flex flex-1 flex-col"}>
        <div
          className={`relative overflow-hidden border-b border-ink-line bg-ink ${
            project.featured
              ? "aspect-[16/10] sm:aspect-[16/8] md:order-2 md:aspect-auto md:border-b-0 md:border-l"
              : "aspect-[16/10]"
          }`}
        >
          {project.motion ? (
            <MotionBackdrop src={project.motion} />
          ) : (
            <ProjectVisual category={project.category} slug={project.slug} />
          )}
          <ProjectScreen
            slug={project.slug}
            className={
              SCREEN_POS[
                project.featured
                  ? project.device === "phone"
                    ? "featuredPhone"
                    : "featuredBrowser"
                  : project.device
              ]
            }
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-between p-8 md:order-1 md:p-10">
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="type-label text-accent-bright">{project.category}</span>
              <span className="type-label text-paper-dim">{project.year}</span>
            </div>

            <h3
              className={`type-display mb-4 ${
                project.featured ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"
              }`}
            >
              {project.title}
            </h3>

            <p className="mb-8 max-w-lg leading-relaxed text-paper-dim">{project.blurb}</p>
          </div>

          <div>
            <p className="type-label mb-6 text-paper">{project.metric}</p>

            <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </div>

      {/* Stretched link: the whole card is one target, but the tags and
          metric stay outside the anchor's accessible name. */}
      <Link
        href={`/work/${project.slug}`}
        data-cursor="View"
        className="absolute inset-0 z-10"
        aria-label={`${project.title} — read case study`}
      />

      <ArrowIcon className="absolute top-8 right-8 h-5 w-5 text-paper-dim opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100 md:top-10 md:right-10" />
    </motion.article>
  );
}

export function Projects() {
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <section id="work" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14">
          <div className="flex flex-col justify-between gap-8 pb-10 md:flex-row md:items-end">
            <div>
              <Reveal>
                <p className="type-label mb-5 text-accent-bright">01 — Selected Work</p>
              </Reveal>
              <MaskedHeading
                lines={["Things I've", "Worked On"]}
                className="type-display text-[clamp(2rem,4.5vw,3.75rem)]"
              />
            </div>

            <Reveal delay={0.15}>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active === cat}
                    onClick={() => setActive(cat)}
                    className={`type-label cursor-pointer border px-4 py-2 transition-colors duration-200 ${
                      active === cat
                        ? "border-paper bg-paper text-ink"
                        : "border-ink-line text-paper-dim hover:border-paper hover:text-paper"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
          <DrawnRule />
        </div>

        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
