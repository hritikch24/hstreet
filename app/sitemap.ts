import type { MetadataRoute } from 'next';
import { absolute, profile } from '@/business/profile';
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
    lastModified: profile.copyReviewedOn,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.6 : 0.8,
  }));
}
