// Read only the two public values these helpers need (not lib/site.ts), so client components that
// link through SiteLink don't pull the rest of the site settings, such as the embed URL, into shared bundles.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

// Centralised URL helpers. next/link and file-convention metadata add the base path themselves;
// these helpers are only for plain <a href> and <img src> values that Next.js does not rewrite.

/** Prefix a public asset path (e.g. /og.png) with the deployment base path. */
export function asset(path: string): string {
  if (!path.startsWith('/')) throw new Error(`Asset paths must start with "/": ${path}`);
  return `${basePath}${path}`;
}

/** Ensure a site route ends with a trailing slash to match the static export layout. */
export function route(path: string): string {
  if (!path.startsWith('/')) throw new Error(`Routes must start with "/": ${path}`);
  const [pathname, hash] = path.split('#', 2);
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return hash ? `${withSlash}#${hash}` : withSlash;
}

/** Full-document href for a site route, including the base path. */
export function documentHref(path: string): string {
  return `${basePath}${route(path)}`;
}

/** Absolute URL for metadata, or undefined when the deployed URL is not known at build time. */
export function absoluteUrl(path: string): string | undefined {
  return siteUrl ? `${siteUrl}${route(path)}` : undefined;
}

export const CONTACT_ROUTE = '/contact/';

/** Contact is entered and left with full-document navigation (see components/site-link.tsx). */
export function isContactRoute(path: string | null | undefined): boolean {
  if (!path) return false;
  const pathname = path.split(/[?#]/, 1)[0];
  return route(pathname) === CONTACT_ROUTE;
}

/** In-page anchor on the menu page for one section or item id. */
export function menuAnchor(id: string): string {
  return `/menu/#${id}`;
}
