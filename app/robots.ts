import type { MetadataRoute } from 'next';
import { absolute } from '@/business/profile';
import { assertReadyForSearch } from '@/engine/go-live';

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
  return {
    rules: [
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE },
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: absolute('/'),
  };
}
