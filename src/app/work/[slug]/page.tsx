import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, site } from "@/data/content";
import { CaseStudyBody } from "@/components/CaseStudyBody";

/* Pre-render every case study at build time. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  /* Bare title only — the root layout's `%s — ${site.name}` template
     appends the name. Open Graph has no template applied to it, so it
     carries the fully-qualified form. */
  return {
    title: project.title,
    description: project.blurb,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.blurb,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return <CaseStudyBody project={project} next={next} />;
}
