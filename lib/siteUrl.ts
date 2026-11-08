/**
 * Public URL of the site, for absolute links (sitemap, robots, share previews).
 * Set NEXT_PUBLIC_SITE_URL on Vercel after deploying; falls back to localhost.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const ROUTES = ["/", "/tour", "/about", "/contact"] as const;
