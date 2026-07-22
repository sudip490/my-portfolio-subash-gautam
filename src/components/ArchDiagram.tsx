"use client";

/* Scroll-animated system diagram for the case studies.

   Layout is computed from data (content.ts `architecture`) — tiers become
   columns, nodes stack inside them, and edges are curves that draw
   themselves in when the section enters the viewport, with accent dots
   riding each path to show which way the data flows. Everything is one
   SVG so it scales as a unit; on small screens the container scrolls
   sideways rather than shrinking the type below legibility. */

import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef } from "react";
import type { Architecture, ArchNode } from "@/data/content";

const NODE_W = 208;
const NODE_H = 54;
const GAP_Y = 22;
const GAP_X = 104;
const PAD = 10;
const TIER_LABEL_H = 44;

type Placed = ArchNode & { x: number; y: number; tier: number; row: number };

/* Path between two nodes, plus where its label sits. Cross-tier links
   curve between column edges; same-tier links run straight down the
   column between stacked nodes. */
function edgeGeom(from: Placed, to: Placed) {
  if (from.tier === to.tier) {
    const x = from.x + NODE_W / 2;
    const down = from.y < to.y;
    const y1 = down ? from.y + NODE_H : from.y;
    const y2 = down ? to.y : to.y + NODE_H;
    return {
      d: `M ${x} ${y1} L ${x} ${y2}`,
      lx: x + 10,
      ly: (y1 + y2) / 2 + 3,
      anchor: "start" as const,
    };
  }
  const ltr = from.x < to.x;
  const x1 = ltr ? from.x + NODE_W : from.x;
  const x2 = ltr ? to.x : to.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const y2 = to.y + NODE_H / 2;
  const dx = (x2 - x1) * 0.42;
  return {
    d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
    lx: (x1 + x2) / 2,
    ly: (y1 + y2) / 2 - 7,
    anchor: "middle" as const,
  };
}

export function ArchDiagram({ architecture }: { architecture: Architecture }) {
  const { tiers, edges } = architecture;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  /* mpath needs document-unique ids — two diagrams can never collide. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const maxStack = Math.max(...tiers.map((t) => t.nodes.length * (NODE_H + GAP_Y) - GAP_Y));
  const width = PAD * 2 + tiers.length * NODE_W + (tiers.length - 1) * GAP_X;
  const height = TIER_LABEL_H + maxStack + PAD;

  const placed = new Map<string, Placed>();
  tiers.forEach((tier, ti) => {
    const stackH = tier.nodes.length * (NODE_H + GAP_Y) - GAP_Y;
    tier.nodes.forEach((node, ni) => {
      placed.set(node.id, {
        ...node,
        tier: ti,
        row: ni,
        x: PAD + ti * (NODE_W + GAP_X),
        y: TIER_LABEL_H + (maxStack - stackH) / 2 + ni * (NODE_H + GAP_Y),
      });
    });
  });

  return (
    <div ref={ref} className="overflow-x-auto pb-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[860px]"
        role="img"
        aria-label={`System architecture: ${tiers.map((t) => t.label).join(" → ")}`}
      >
        {/* Column headings */}
        {tiers.map((tier, ti) => (
          <motion.text
            key={tier.label}
            x={PAD + ti * (NODE_W + GAP_X) + NODE_W / 2}
            y={16}
            textAnchor="middle"
            className="fill-paper-dim font-mono text-[10px] uppercase"
            style={{ letterSpacing: "0.2em" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: reduced ? 0 : ti * 0.1 }}
          >
            {tier.label}
          </motion.text>
        ))}

        {/* Edges draw in after their endpoints have appeared */}
        {edges.map((edge, i) => {
          const from = placed.get(edge.from);
          const to = placed.get(edge.to);
          if (!from || !to) return null;
          const { d, lx, ly, anchor } = edgeGeom(from, to);
          const delay = reduced ? 0 : 0.5 + i * 0.07;
          return (
            <g key={`${edge.from}-${edge.to}`}>
              {edge.dashed ? (
                /* pathLength animation owns stroke-dasharray, so dashed
                   edges fade in instead of drawing in. */
                <motion.path
                  id={`arch${uid}e${i}`}
                  d={d}
                  fill="none"
                  strokeWidth={1.2}
                  strokeDasharray="3 6"
                  className="stroke-paper-dim"
                  strokeOpacity={0.35}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay }}
                />
              ) : (
                <motion.path
                  id={`arch${uid}e${i}`}
                  d={d}
                  fill="none"
                  strokeWidth={1.2}
                  strokeLinecap="square"
                  className="stroke-paper-dim"
                  strokeOpacity={0.35}
                  initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
                  animate={inView ? (reduced ? { opacity: 1 } : { pathLength: 1 }) : {}}
                  transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {edge.label && (
                <motion.text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  className="fill-paper-dim font-mono text-[8.5px] uppercase"
                  style={{ letterSpacing: "0.15em" }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 0.9 } : {}}
                  transition={{ duration: 0.5, delay: delay + 0.35 }}
                >
                  {edge.label}
                </motion.text>
              )}
              {/* Flow dot riding the path. SMIL, so it costs no JS per frame. */}
              {inView && !reduced && (
                <circle r={2.4} className="fill-accent-bright">
                  <animateMotion
                    dur={`${2.6 + (i % 4) * 0.45}s`}
                    begin={`${delay + 0.4}s`}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#arch${uid}e${i}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {[...placed.values()].map((node) => {
          const delay = reduced ? 0 : 0.1 + node.tier * 0.14 + node.row * 0.07;
          const labelFill = node.accent
            ? "fill-accent-bright"
            : node.ext
              ? "fill-paper-dim"
              : "fill-paper";
          return (
            <motion.g
              key={node.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={NODE_H}
                className={
                  node.accent ? "fill-ink-soft stroke-accent-bright" : "fill-ink-soft stroke-ink-line"
                }
                strokeWidth={node.accent ? 1.5 : 1}
                strokeDasharray={node.ext ? "4 4" : undefined}
              />
              {node.accent && (
                <rect x={node.x} y={node.y} width={3} height={NODE_H} className="fill-accent" />
              )}
              <text
                x={node.x + NODE_W / 2}
                y={node.y + (node.sub ? NODE_H / 2 - 4 : NODE_H / 2 + 4)}
                textAnchor="middle"
                className={`${labelFill} font-mono text-[11px] uppercase`}
                style={{ letterSpacing: "0.12em" }}
              >
                {node.label}
              </text>
              {node.sub && (
                <text
                  x={node.x + NODE_W / 2}
                  y={node.y + NODE_H / 2 + 14}
                  textAnchor="middle"
                  className="fill-paper-dim font-mono text-[8.5px]"
                  style={{ letterSpacing: "0.08em" }}
                >
                  {node.sub}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
