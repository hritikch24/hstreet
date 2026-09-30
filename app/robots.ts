import type { MetadataRoute } from 'next';
import { absolute } from '@/business/profile';
import { assertReadyForSearch, siteIsLive } from '@/engine/go-live';

/** Answer engines named explicitly, so the rule for them is never ambiguous. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Google-Extended',
];

const PRIVATE = ['/hq', '/api/'];

export default function robots(): MetadataRoute.Robots {
  assertReadyForSearch();
  // Before launch the pages carry placeholder phone numbers and prices. Search
  // engines honour the noindex tag; answer-engine crawlers may not, so they are
  // kept out entirely until every fact is real.
  const live = siteIsLive();
  return {
    rules: [
      live ? { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE } : { userAgent: AI_CRAWLERS, disallow: '/' },
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: absolute('/'),
  };
}
