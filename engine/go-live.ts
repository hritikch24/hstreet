import { outstandingFacts, profile } from '@/business/profile';

/**
 * Stops the site being made indexable while anything in business/profile.ts
 * is still a placeholder.
 *
 * Called from the root layout, sitemap and robots, so it runs during
 * prerendering: flipping `indexable` to true with placeholders left makes
 * `next build` fail with the list of what is missing.
 */
export function assertReadyForSearch(): void {
  if (!profile.indexable) return;
  const missing = outstandingFacts();
  if (missing.length === 0) return;
  const list = missing.map((m) => `  - ${m.path}: ${m.ask}`).join('\n');
  throw new Error(
    `business/profile.ts has indexable: true but ${missing.length} fact(s) are still placeholders:\n${list}\n` +
      'Replace them (or set indexable back to false) before building.',
  );
}

/** Whether the whole site may be indexed right now. */
export const siteIsLive = () => profile.indexable && outstandingFacts().length === 0;
