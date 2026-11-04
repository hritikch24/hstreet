/**
 * Every public page, and whether it may be indexed.
 *
 * The sitemap, each page's robots meta and the sanity check all come from
 * `mayIndex()`, so they cannot disagree.
 */
import { profile } from '@/business/profile';
import { allGuides } from '@/copy/guides';
import { installCities } from '@/copy/install-cities';
import { repairAreas } from '@/copy/repair-areas';
import { servicePages } from '@/copy/services';
import { GARAGE_PATHS, garagePublished } from '@/copy/garage-doors';
import { siteIsLive } from '@/engine/go-live';

/**
 * Pages that are useful to visitors but not worth a search result, or not
 * launched yet. /see-it-on-your-shop stays out of search until it is linked
 * from the site (the owner will decide where).
 */
const NEVER_INDEX = new Set(['/privacy-notice', '/see-it-on-your-shop']);

/** Install cities published as pages (the configured list, filtered to written copy). */
export function publishedCitySlugs(): string[] {
  const written = new Set(installCities().map((c) => c.slug));
  return profile.installCities.value.filter((s) => written.has(s)).slice(0, 6);
}

export function mayIndex(path: string): boolean {
  if (!siteIsLive()) return false;
  if (NEVER_INDEX.has(path)) return false;
  // A garage draft shown on a preview is never indexable.
  if (GARAGE_PATHS.has(path) && !garagePublished()) return false;
  if (path.startsWith('/nationwide/') && profile.installCities.isPlaceholder) return false;
  return true;
}

export function publicPaths(): string[] {
  return [
    '/',
    ...servicePages().map((s) => s.path),
    '/nationwide',
    ...publishedCitySlugs().map((s) => `/nationwide/${s}`),
    '/repairs',
    ...repairAreas().map((a) => `/repairs/${a.slug}`),
    '/our-work',
    '/see-it-on-your-shop',
    '/prices',
    '/get-a-quote',
    '/guides',
    ...allGuides().map((g) => `/guides/${g.slug}`),
    '/the-firm',
    '/talk-to-us',
    '/privacy-notice',
  ];
}

export const indexablePaths = () => publicPaths().filter(mayIndex);
