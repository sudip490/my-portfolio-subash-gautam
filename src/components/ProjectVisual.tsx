/* Generative artwork for the featured project cards. The featured cards
   span two columns, and everything they say lives in the left half — the
   right half sat completely empty. Real product shots can't fill it (most
   of this work ships inside other companies' banking apps), so each card
   draws its own abstract instead, keyed to what the project is: candles
   for trading, a service mesh for banking, a contribution grid for the
   personal builds.

   Everything is seeded from the slug — no Math.random, so the server and
   client render the identical SVG and hydration never sees a mismatch. */

import type { ReactNode } from "react";

/* Small deterministic PRNG (mulberry32) seeded from the slug. */
function rng(seed: string) {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LINE = "var(--color-ink-line)";
const DIM = "var(--color-paper-dim)";
const ACCENT = "var(--color-accent-bright)";

/* Trading — a candlestick walk with the close-price line over it. */
function Candles({ seed }: { seed: string }) {
  const rand = rng(seed);
  const candles: ReactNode[] = [];
  const closes: string[] = [];
  let price = 210 + rand() * 40;

  for (let i = 0; i < 15; i++) {
    const x = 24 + i * 31;
    const open = price;
    /* Biased upward — it's a portfolio, the chart is allowed to be kind. */
    const close = open - (rand() - 0.42) * 52;
    price = close;
    const top = Math.min(open, close);
    const bottom = Math.max(open, close);
    const up = close < open;
    const last = i === 14;
    const color = last ? ACCENT : up ? DIM : LINE;

    candles.push(
      <g key={i} stroke={color} strokeOpacity={last ? 0.9 : 0.55}>
        <line x1={x + 5} y1={top - 6 - rand() * 14} x2={x + 5} y2={bottom + 6 + rand() * 14} />
        <rect
          x={x}
          y={top}
          width={10}
          height={Math.max(bottom - top, 3)}
          fill={last ? ACCENT : up ? "transparent" : LINE}
          fillOpacity={last ? 0.6 : 0.5}
        />
      </g>
    );
    closes.push(`${x + 5},${close}`);
  }

  return (
    <svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {[72, 144, 216, 288].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke={LINE} strokeOpacity="0.45" />
      ))}
      {candles}
      <polyline
        points={closes.join(" ")}
        fill="none"
        stroke={ACCENT}
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* Digital banking — a mesh of services, each wired to its neighbours,
   one of them accented as the node the card is really about. */
function Mesh({ seed }: { seed: string }) {
  const rand = rng(seed);
  const nodes = Array.from({ length: 11 }, () => ({
    x: 36 + rand() * 408,
    y: 36 + rand() * 288,
  }));
  const hot = Math.floor(rand() * nodes.length);

  /* Each node connects to its two nearest neighbours; dedupe pairs. */
  const edges = new Set<string>();
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach((e) => edges.add([Math.min(i, e.j), Math.max(i, e.j)].join("-")));
  });

  return (
    <svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {Array.from(edges).map((key) => {
        const [a, b] = key.split("-").map(Number);
        const isHot = a === hot || b === hot;
        return (
          <line
            key={key}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={isHot ? ACCENT : DIM}
            strokeOpacity={isHot ? 0.55 : 0.25}
            strokeDasharray={isHot ? "5 5" : undefined}
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          {i === hot && (
            <rect
              x={n.x - 11}
              y={n.y - 11}
              width={22}
              height={22}
              fill="none"
              stroke={ACCENT}
              strokeOpacity="0.6"
            />
          )}
          <rect
            x={n.x - 5}
            y={n.y - 5}
            width={10}
            height={10}
            fill={i === hot ? ACCENT : "transparent"}
            fillOpacity={i === hot ? 0.8 : 0}
            stroke={i === hot ? ACCENT : DIM}
            strokeOpacity={i === hot ? 1 : 0.55}
          />
        </g>
      ))}
    </svg>
  );
}

/* Personal — a commit-graph grid: small squares, some of them lit. */
function Grid({ seed }: { seed: string }) {
  const rand = rng(seed);
  const cells: ReactNode[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 11; col++) {
      const v = rand();
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={26 + col * 40}
          y={22 + row * 40}
          width={16}
          height={16}
          fill={v > 0.82 ? ACCENT : v > 0.55 ? LINE : "transparent"}
          fillOpacity={v > 0.82 ? 0.75 : 0.8}
          stroke={v > 0.82 ? ACCENT : LINE}
          strokeOpacity={v > 0.82 ? 0.9 : 0.7}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {cells}
    </svg>
  );
}

export function ProjectVisual({ category, slug }: { category: string; slug: string }) {
  const art =
    category === "Trading" ? (
      <Candles seed={slug} />
    ) : category === "Digital Banking" ? (
      <Mesh seed={slug} />
    ) : (
      <Grid seed={slug} />
    );

  return (
    <div
      aria-hidden
      /* Fills its container as a backdrop behind a ProjectScreen mockup;
         brightens a step on card hover along with the spotlight. */
      className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70"
    >
      {art}
    </div>
  );
}
