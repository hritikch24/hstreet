#!/usr/bin/env node
/**
 * Tells IndexNow (Bing, Yandex, Seznam and others) about this site's pages.
 *
 *   INDEXNOW_KEY=<this site's own key> node tools/indexnow.mjs [path …]
 *
 * With no paths, submits every URL in the live sitemap. Refuses to run while
 * the live sitemap is empty, which is the case until the site is indexable.
 *
 * The key belongs to this site alone: generate a fresh one (32 hex chars),
 * set INDEXNOW_KEY in Vercel so /indexnow-key.txt serves it, and never reuse
 * a key from any other site.
 */
const HOST = 'www.highstreetshopfronts.co.uk';
const ORIGIN = `https://${HOST}`;
const key = process.env.INDEXNOW_KEY?.trim();

if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  console.error('Set INDEXNOW_KEY to this site’s own key (8 to 128 letters, digits or dashes).');
  process.exit(2);
}

const served = await fetch(`${ORIGIN}/indexnow-key.txt`).then((r) => (r.ok ? r.text() : null)).catch(() => null);
if (served?.trim() !== key) {
  console.error(`${ORIGIN}/indexnow-key.txt does not serve this key yet. Set INDEXNOW_KEY in Vercel and redeploy.`);
  process.exit(1);
}

let urls = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : `${ORIGIN}${p.startsWith('/') ? p : `/${p}`}`));
if (urls.length === 0) {
  const xml = await fetch(`${ORIGIN}/sitemap.xml`).then((r) => r.text());
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (urls.length === 0) {
  console.error('The live sitemap is empty: the site is still noindex. Nothing to submit.');
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${ORIGIN}/indexnow-key.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URL(s).`);
process.exit(res.ok ? 0 : 1);
