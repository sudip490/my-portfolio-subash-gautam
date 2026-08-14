import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, site, type Project } from "@/data/content";
import { siteUrl } from "@/lib/site-url";
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
    /* Metadata merges shallowly, so the root layout's canonical:"/" would
       otherwise stand — telling search engines every case study is a
       duplicate of the homepage and keeping all eight out of the index. */
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.blurb,
      url: `${siteUrl}/work/${slug}`,
      siteName: site.name,
      type: "article",
    },
  };
}

/* Describes the case study as a work Subash authored and places it on a
   Home › Work trail, so search engines can surface it as its own result
   rather than an unlabelled page under the portfolio. */
function CaseStudyJsonLd({ project }: { project: Project }) {
  const url = `${siteUrl}/work/${project.slug}`;
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        headline: `${project.title} — ${project.category}`,
        description: project.blurb,
        url,
        image: `${url}/opengraph-image`,
        datePublished: project.year,
        keywords: project.tags.join(", "),
        author: { "@type": "Person", name: site.name, url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored locally in content.ts, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
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

  return (
    <>
      <CaseStudyJsonLd project={project} />
      <CaseStudyBody project={project} next={next} />
    </>
  );
}
