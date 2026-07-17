import Link from "next/link";
import { site } from "@/data/content";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute h-[30rem] w-[30rem] rounded-full bg-accent opacity-20 blur-[140px]"
      />

      <div className="relative">
        <h1 className="type-display text-[clamp(6rem,26vw,20rem)] leading-none">404</h1>
        <p className="type-label mt-6 text-accent-bright">Route not found</p>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-paper-dim">
          This page returned nothing. Unlike the systems I build, it has no retry
          policy — so you&apos;ll have to go back manually.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="type-label cursor-pointer border border-paper bg-paper px-6 py-4 text-ink transition-colors hover:bg-accent hover:text-paper"
          >
            Back Home
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="type-label cursor-pointer border border-ink-line px-6 py-4 text-paper-dim transition-colors hover:border-paper hover:text-paper"
          >
            Report It
          </a>
        </div>
      </div>
    </main>
  );
}
