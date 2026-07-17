"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { useInView, useReducedMotion } from "motion/react";

/* three + R3F are ~150KB — keep them out of the initial bundle and off
   the server entirely. */
const ShaderPlane = dynamic(() => import("./ShaderPlane"), { ssr: false });

/* One-shot WebGL capability probe, cached so the throwaway canvas is
   only ever created once. */
let webglSupport: boolean | null = null;
function detectWebgl() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

const subscribe = () => () => {};

export function ShaderBackdrop() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });

  const hasWebgl = useSyncExternalStore(subscribe, detectWebgl, () => false);
  const active = hasWebgl && !reduced;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {/* Fallback sits underneath permanently: it's what no-WebGL and
          reduced-motion visitors see, and it also means the canvas can
          fade in over something rather than over empty ink. */}
      <div className="absolute -top-40 -right-32 h-[36rem] w-[36rem] rounded-full bg-accent opacity-20 blur-[140px]" />
      <div className="absolute bottom-0 -left-20 h-[28rem] w-[28rem] rounded-full bg-accent opacity-10 blur-[130px]" />

      {/* Mounted once and kept alive. Scrolling away pauses the render
          loop via `running` — it must NOT unmount, because tearing down
          and rebuilding the WebGL context on every scroll is precisely
          what causes the hitch. */}
      {active && <ShaderPlane running={inView} />}
    </div>
  );
}
