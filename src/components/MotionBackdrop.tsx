"use client";

/* Looping motion-video backdrop for the project visuals — real footage
   behind the device mockups, standing in for ProjectVisual's generated
   canvas. Clips live in /public/work/motion as ~6s muted 960px loops
   with a poster frame alongside (same name, .jpg).

   The video is lazy (preload="none") and only plays while on screen;
   reduced-motion visitors keep the poster and it never starts. Ink
   washes on top keep type and mockups legible over live footage. */

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function MotionBackdrop({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "120px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <video
        ref={ref}
        src={src}
        poster={src.replace(/\.mp4$/, ".jpg")}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover opacity-40 saturate-[0.8]"
      />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
    </div>
  );
}
