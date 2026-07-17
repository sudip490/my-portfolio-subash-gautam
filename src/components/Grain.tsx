"use client";

/* Static film-grain overlay. Inline SVG turbulence as a data URI so
   there's no network request and no external asset to ship.

   Deliberately NOT using mix-blend-mode: a fixed, full-viewport blended
   layer forces the compositor to re-blend everything beneath it on every
   frame, which shows up as scroll jank. A plain low-opacity layer is
   composited once and costs nothing to keep on screen. */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="180" height="180" filter="url(#n)" opacity="0.55"/>
    </svg>`
  );

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.05]"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundRepeat: "repeat",
        // Promote once; never repaint.
        transform: "translateZ(0)",
      }}
    />
  );
}
