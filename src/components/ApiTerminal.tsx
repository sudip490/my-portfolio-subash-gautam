"use client";

/* The case-study terminal: types out a request against the project's API
   when it scrolls into view, then reveals the response line by line and a
   status verdict. All content comes from content.ts (`apiDemo`) — this
   component only owns the typing.

   Reduced motion (or no JS-yet) renders the finished transcript, and a
   visually-hidden copy carries the whole exchange for screen readers so
   they never meet a half-typed command. */

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ApiDemo } from "@/data/content";

const TICK_MS = 14;
const CHARS_PER_TICK = 2;

export function ApiTerminal({ demo }: { demo: ApiDemo }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduced = useReducedMotion();
  const cmd = demo.request.join("\n");
  const [typed, setTyped] = useState(0);
  const done = typed >= cmd.length;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(cmd.length);
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    /* A beat of quiet before the "keystrokes" start. */
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += CHARS_PER_TICK;
        setTyped(i);
        if (i >= cmd.length) clearInterval(interval);
      }, TICK_MS);
    }, 450);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [inView, reduced, cmd.length]);

  return (
    <div ref={ref} className="overflow-hidden border border-ink-line bg-ink-soft/60">
      {/* Full transcript for assistive tech; the animation is decorative. */}
      <p className="sr-only">
        {`${demo.title}. Request: ${cmd}. Response: ${demo.response
          .map((l) => l.text)
          .join(" ")} ${demo.status.text}`}
      </p>

      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-ink-line px-4 py-3" aria-hidden>
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-line" />
          <span className="h-2 w-2 rounded-full bg-ink-line" />
          <span className="h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="truncate font-mono text-[10px] tracking-[0.15em] text-paper-dim uppercase">
          {demo.title}
        </span>
      </div>

      <div
        className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed md:p-6 md:text-[13px]"
        aria-hidden
      >
        <pre className="whitespace-pre">
          <span className="text-accent-bright select-none">$ </span>
          <span className="text-paper">{cmd.slice(0, typed)}</span>
          {!done && inView && !reduced && (
            <motion.span
              className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-paper-dim"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          )}
        </pre>

        {done && (
          <div className="mt-4">
            {demo.response.map((line, i) => (
              <motion.pre
                key={i}
                className={`whitespace-pre ${line.hl ? "text-accent-bright" : "text-paper-dim"}`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.3 + i * 0.06 }}
              >
                {line.text}
              </motion.pre>
            ))}
            {/* Same diegetic terminal colours ProjectScreen already uses
                for tickers — not part of the site palette on purpose. */}
            <motion.p
              className={`mt-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] ${
                demo.status.tone === "ok" ? "text-emerald-400" : "text-red-400"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: reduced ? 0 : 0.4 + demo.response.length * 0.06,
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {demo.status.text}
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}
