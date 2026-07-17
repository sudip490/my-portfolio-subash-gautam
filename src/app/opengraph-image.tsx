import { ImageResponse } from "next/og";
import { site } from "@/data/content";
import { truncate } from "@/lib/truncate";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Rendered at build time into a static PNG. This is what LinkedIn,
   Slack, X, and iMessage show when the link is shared. */
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* accent bar */}
        <div style={{ display: "flex", height: 8, width: 160, background: "#2563eb" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: -4,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#a1a1aa",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {truncate(site.summary, 130)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #26262d",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#fafafa", letterSpacing: 2 }}>
            {site.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", letterSpacing: 2 }}>
            {site.location.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    size
  );
}
