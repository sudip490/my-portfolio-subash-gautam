/* Canonical origin for metadata, sitemap, and JSON-LD.
   Set NEXT_PUBLIC_SITE_URL in your host's env to your real domain —
   Vercel exposes VERCEL_PROJECT_PRODUCTION_URL automatically. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
