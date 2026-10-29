import type { MetadataRoute } from 'next';
import { absolute } from '@/business/profile';
import { assertReadyForSearch } from '@/engine/go-live';
import { indexablePaths } from '@/engine/route-plan';

/**
 * Indexable pages only. While the site is noindex (placeholders remain) this
 * is deliberately empty: listing pages that say "noindex" sends mixed signals.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  assertReadyForSearch();
  return indexablePaths().map((path) => ({
    url: absolute(path),
    // A copy review is not a significant update to every URL. Omit lastmod
    // until actual per-page modification dates are tracked.
  }));
}
