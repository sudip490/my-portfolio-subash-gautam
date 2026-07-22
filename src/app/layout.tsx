import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site, skills } from "@/data/content";
import { siteUrl } from "@/lib/site-url";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.summary,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.summary,
    url: siteUrl,
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

/* schema.org Person — lets search engines associate the name, role,
   location, skills, and profile links as one entity. */
function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.summary,
    url: siteUrl,
    email: `mailto:${site.email}`,
    /* Absolute — consumers of JSON-LD won't resolve a site-relative path. */
    image: `${siteUrl}${site.photo}`,
    /* Omit the address entirely when there's no location — shipping
       addressLocality:"" tells search engines the field exists and is
       empty, which is worse than not claiming one. */
    ...(site.location
      ? { address: { "@type": "PostalAddress", addressLocality: site.location } }
      : {}),
    knowsAbout: skills.flatMap((g) => g.items),
    sameAs: site.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored locally in content.ts, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
      /* data-theme is stamped pre-hydration by the script below, so the
         server's version of this attribute is allowed to differ. */
      suppressHydrationWarning
    >
      <body className="min-h-full">
        {/* Re-apply the saved theme before anything paints — without this,
            themed visitors get a cobalt flash on every navigation. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
        <a href="#main" className="skip-link type-label bg-paper px-5 py-4 text-ink">
          Skip to content
        </a>
        {children}
        <ThemeSwitcher />
        <PersonJsonLd />
      </body>
    </html>
  );
}
