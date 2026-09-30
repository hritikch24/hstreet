/**
 * Every public page, and whether it may be indexed.
 *
 * The sitemap, each page's robots meta and the sanity check all come from
 * `mayIndex()`, so they cannot disagree.
 */
import { profile } from '@/business/profile';
import { guides } from '@/copy/guides';
import { installCities } from '@/copy/install-cities';
import { repairAreas } from '@/copy/repair-areas';
import { services } from '@/copy/services';
import { siteIsLive } from '@/engine/go-live';

/** Pages that are useful to visitors but not worth a search result. */
const NEVER_INDEX = new Set(['/privacy-notice']);

/** Install cities published as pages (the configured list, filtered to written copy). */
export function publishedCitySlugs(): string[] {
  const written = new Set(installCities().map((c) => c.slug));
  return profile.installCities.value.filter((s) => written.has(s)).slice(0, 6);
}

export function mayIndex(path: string): boolean {
  if (!siteIsLive()) return false;
  if (NEVER_INDEX.has(path)) return false;
  if (path.startsWith('/nationwide/') && profile.installCities.isPlaceholder) return false;
  return true;
}

export function publicPaths(): string[] {
  return [
    '/',
    ...services().map((s) => s.path),
    '/nationwide',
    ...publishedCitySlugs().map((s) => `/nationwide/${s}`),
    '/repairs',
    ...repairAreas().map((a) => `/repairs/${a.slug}`),
    '/our-work',
    '/prices',
    '/get-a-quote',
    ...guides().map((g) => `/guides/${g.slug}`),
    '/the-firm',
    '/talk-to-us',
    '/privacy-notice',
  ];
}

export const indexablePaths = () => publicPaths().filter(mayIndex);
