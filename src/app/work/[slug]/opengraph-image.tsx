import { ImageResponse } from "next/og";
import { projects, getProject, site } from "@/data/content";
import { truncate } from "@/lib/truncate";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* One static PNG per case study, generated at build. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#08080a" }} />,
      size
    );
  }

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#4f83ff", letterSpacing: 3 }}>
            {project.category.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", letterSpacing: 3 }}>
            {project.year}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: -4,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#a1a1aa",
              maxWidth: 940,
              lineHeight: 1.4,
            }}
          >
            {truncate(project.blurb, 140)}
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
          <div style={{ display: "flex", fontSize: 26, color: "#2563eb", letterSpacing: 2 }}>
            {project.metric.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    size
  );
}
