/**
 * Public URL of the site, for absolute links (sitemap, robots, share previews).
 * Order: NEXT_PUBLIC_SITE_URL if you set one (e.g. a custom domain), then the production
 * address Vercel provides at build time, then localhost for local builds.
 * Server-only: used in metadata, robots and sitemap, never in the browser.
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

export const ROUTES = ["/", "/tour", "/about", "/contact"] as const;
