/**
 * Names where a visit came from, in words the owner uses: "Google search",
 * "Google Ads", "WhatsApp". The same rules run in SQL for the dashboards
 * (SOURCE_SQL) and in code for single enquiries (sourceOf).
 */
export interface Arrival {
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  gclid?: string | null;
}

export function sourceOf(a: Arrival): string {
  const ref = (a.referrer ?? '').toLowerCase();
  const src = (a.utmSource ?? '').toLowerCase();
  const med = (a.utmMedium ?? '').toLowerCase();
  if (a.gclid || ['cpc', 'ppc', 'paid'].includes(med)) return 'Google Ads';
  if (src === 'gbp' || src === 'google-business-profile') return 'Google Business Profile';
  if (!ref && !src) return 'Direct';
  if (ref.includes('gemini.google')) return 'Gemini';
  if (ref.includes('google.')) return 'Google search';
  if (ref.includes('bing.')) return 'Bing';
  if (ref.includes('chatgpt.com') || ref.includes('openai.com')) return 'ChatGPT';
  if (ref.includes('perplexity.ai')) return 'Perplexity';
  if (ref.includes('claude.ai')) return 'Claude';
  if (ref.includes('whatsapp')) return 'WhatsApp';
  if (ref.includes('facebook.') || ref.includes('instagram.')) return 'Facebook / Instagram';
  if (src) return src;
  return 'Other website';
}

/** SQL twin of sourceOf, for a table with referrer, utm_source, utm_medium, gclid. */
export const SOURCE_SQL = `CASE
  WHEN gclid IS NOT NULL AND gclid <> '' THEN 'Google Ads'
  WHEN lower(coalesce(utm_medium,'')) IN ('cpc','ppc','paid') THEN 'Google Ads'
  WHEN lower(coalesce(utm_source,'')) IN ('gbp','google-business-profile') THEN 'Google Business Profile'
  WHEN coalesce(referrer,'') = '' AND coalesce(utm_source,'') = '' THEN 'Direct'
  WHEN referrer ILIKE '%gemini.google%' THEN 'Gemini'
  WHEN referrer ILIKE '%google.%' THEN 'Google search'
  WHEN referrer ILIKE '%bing.%' THEN 'Bing'
  WHEN referrer ILIKE '%chatgpt.com%' OR referrer ILIKE '%openai.com%' THEN 'ChatGPT'
  WHEN referrer ILIKE '%perplexity.ai%' THEN 'Perplexity'
  WHEN referrer ILIKE '%claude.ai%' THEN 'Claude'
  WHEN referrer ILIKE '%whatsapp%' THEN 'WhatsApp'
  WHEN referrer ILIKE '%facebook.%' OR referrer ILIKE '%instagram.%' THEN 'Facebook / Instagram'
  WHEN coalesce(utm_source,'') <> '' THEN utm_source
  ELSE 'Other website'
END`;
