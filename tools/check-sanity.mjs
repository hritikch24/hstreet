#!/usr/bin/env node
/**
 * Checks the build for the mistakes that quietly hurt search:
 *
 *  - every internal link points at a page or file that exists
 *  - every page has exactly one canonical, pointing at itself
 *  - no two pages share a title or a meta description; titles fit in a search
 *    result (60 characters) and descriptions run 70 to 160 characters
 *  - the sitemap lists exactly the pages whose robots meta allows indexing
 *  - every page has a robots meta tag, and every JSON-LD block parses
 *  - no placeholder phone number reaches structured data
 *  - robots.txt keeps every named crawler out of /hq and /api
 *  - /hq and /api/hq are absent from the sitemap and from public links
 *
 *   npm run build && node tools/check-sanity.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from './portfolio.mjs';

const APP = join(ROOT, '.next', 'server', 'app');
if (!existsSync(APP)) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(2);
}

const problems = [];
const fail = (msg) => problems.push(msg);

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const read = (rel) => readFileSync(join(APP, rel), 'utf8');
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const origin = (() => {
  const m = read('index.html').match(/<link rel="canonical" href="(https:\/\/[^/"]+)\/?"/);
  return m ? m[1] : null;
})();
if (!origin) {
  console.error('Home page has no canonical; cannot tell the site origin.');
  process.exit(1);
}

// Pages in the build.
const pages = new Map(); // path -> html
for (const f of walk(APP)) {
  const rel = relative(APP, f);
  if (!rel.endsWith('.html') || rel.startsWith('_') || rel.startsWith('hq')) continue;
  const path = rel === 'index.html' ? '/' : `/${rel.replace(/\.html$/, '')}`;
  pages.set(path, readFileSync(f, 'utf8'));
}
const routeFiles = new Set(['/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt', '/icon.svg']);
const publicFile = (p) => existsSync(join(ROOT, 'public', decodeURIComponent(p)));

const titles = new Map();
const descriptions = new Map();
const indexable = new Set();

for (const [path, html] of pages) {
  const canon = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  const expected = path === '/' ? origin : `${origin}${path}`;
  if (canon.length !== 1) fail(`${path}: ${canon.length} canonical tags`);
  else if (canon[0] !== expected) fail(`${path}: canonical is ${canon[0]}, expected ${expected}`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const plainTitle = title ? decode(title) : '';
  if (plainTitle.length > 60) fail(`${path}: title is ${plainTitle.length} characters (max 60): "${plainTitle}"`);
  if (!title) fail(`${path}: no <title>`);
  else if (titles.has(title)) fail(`${path}: title duplicates ${titles.get(title)}: "${title}"`);
  else titles.set(title, path);

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const plainDesc = desc ? decode(desc) : '';
  if (desc && (plainDesc.length > 160 || plainDesc.length < 70)) fail(`${path}: description is ${plainDesc.length} characters (want 70 to 160)`);
  if (!desc) fail(`${path}: no meta description`);
  else if (descriptions.has(desc)) fail(`${path}: description duplicates ${descriptions.get(desc)}`);
  else descriptions.set(desc, path);

  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1];
  if (!robots) fail(`${path}: no robots meta`);
  else if (!/noindex/.test(robots)) indexable.add(path);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      const flat = JSON.stringify(data);
      if (/0121 ?496|\+44121496|07700 ?900|447700900/.test(flat)) fail(`${path}: placeholder phone in JSON-LD`);
    } catch {
      fail(`${path}: JSON-LD does not parse`);
    }
  }

  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    if (target.startsWith('/hq') || target.startsWith('/api')) {
      fail(`${path}: public page links to private path ${href}`);
      continue;
    }
    if (!pages.has(target) && !routeFiles.has(target) && !publicFile(target)) fail(`${path}: dead link ${href}`);
  }
}

// Sitemap agrees with the robots meta of every page.
const sitemap = read('sitemap.xml.body');
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(origin, '') || '/'));
for (const p of listed) {
  if (!pages.has(p)) fail(`sitemap lists ${p}, which is not a built page`);
  else if (!indexable.has(p)) fail(`sitemap lists ${p}, but that page is noindex`);
  if (p.startsWith('/hq')) fail('sitemap lists a private path');
}
for (const p of indexable) if (!listed.has(p)) fail(`${p} is indexable but missing from the sitemap`);

// robots.txt
const robotsTxt = read('robots.txt.body');
for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', '*']) {
  const block = robotsTxt.split(/\n\s*\n/).find((b) => new RegExp(`^User-Agent: ${bot.replace('*', '\\*')}$`, 'mi').test(b));
  if (!block) fail(`robots.txt has no rule for ${bot}`);
  else if (!/^Disallow: \/$/m.test(block) && (!/Disallow: \/hq/.test(block) || !/Disallow: \/api\//.test(block)))
    fail(`robots.txt lets ${bot} into /hq or /api`);
}

if (!existsSync(join(APP, 'llms.txt.body'))) fail('llms.txt was not built');
if (!existsSync(join(APP, 'llms-full.txt.body'))) fail('llms-full.txt was not built');
// Before launch, answer-engine crawlers must be kept out (placeholder facts).
if (indexable.size === 0 && !/User-Agent: GPTBot[\s\S]*?Disallow: \/\n/.test(robotsTxt)) fail('robots.txt lets AI crawlers read placeholder facts before launch');

console.log(`Sanity check: ${pages.size} pages, ${indexable.size} indexable, ${listed.size} in the sitemap.`);
if (indexable.size === 0) console.log('  (Site is noindex while placeholders remain, so the sitemap is empty by design.)');
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('No dead links, one self-canonical per page, unique titles and descriptions, sitemap matches.');
