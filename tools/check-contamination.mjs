#!/usr/bin/env node
/**
 * Fails if anything identifying another site in the portfolio appears in
 * this repo: brand names, domains, phone numbers, addresses, email
 * addresses, ad tags, asset paths, storage keys or IndexNow key files.
 * Comments count too.
 *
 * Markers are gathered at run time from the portfolio registry and from each
 * other repo's own config, tests and source, so this file names nobody.
 *
 *   node tools/check-contamination.mjs [--show-markers]
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, SKIP_DIRS, otherSites } from './portfolio.mjs';

const TEXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.jsx', '.json', '.md', '.txt', '.css', '.html', '.svg', '.py', '.prisma', '.yml', '.yaml', '.env', '.example', '']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Words too common to flag alone; the full brand is still checked. */
const ORDINARY_WORDS = new Set(['urban', 'safe', 'secure', 'high', 'street', 'shop', 'shopfront', 'shopfronts', 'royal', 'city', 'metro', 'prime', 'first', 'united', 'british', 'national']);

const POSTCODE =/\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\b/g;
const digits = (s) => String(s).replace(/\D/g, '');

/** Collects markers for one other site. Each marker: { text, kind }. */
async function markersFor(site) {
  const m = new Map();
  const add = (text, kind) => {
    if (!text) return;
    const t = String(text).trim();
    if (t.length < 5 || /^placeholder|^TBD|^same /i.test(t)) return;
    if (!m.has(t.toLowerCase())) m.set(t.toLowerCase(), { text: t, kind });
  };

  // Registry facts. A brand's first word counts on its own when it is a
  // distinctive name rather than an ordinary English word.
  add(site.brand, 'brand');
  const firstWord = String(site.brand ?? '').split(/\s+/)[0].toLowerCase();
  if (firstWord.length >= 5 && !ORDINARY_WORDS.has(firstWord)) add(firstWord, 'brand word');
  if (site.domain) {
    add(site.domain.replace(/^www\./, ''), 'domain');
    add(site.domain.replace(/^www\./, '').split('.')[0], 'domain');
  }
  for (const ph of Array.isArray(site.phones) ? site.phones : []) {
    if (digits(ph).length >= 10) add(digits(ph), 'phone');
  }
  for (const pc of String(site.address ?? '').match(POSTCODE) ?? []) add(pc, 'postcode');
  for (const tag of String(site.adsTag ?? '').match(/AW-\d+/g) ?? []) add(tag, 'ads tag');

  const repo = site.repoPath;

  // A template repo's own marker list, if it has one.
  const cfgTest = join(repo, 'tests', 'site-config.mjs');
  if (existsSync(cfgTest)) {
    try {
      const mod = await import(pathToFileURL(cfgTest).href);
      const self = Object.values(mod.SITES ?? {}).find((s) => s.domain && site.domain && s.domain === site.domain);
      if (self) {
        for (const k of self.markers ?? []) add(k, 'site-config marker');
        add(self.name, 'brand');
      }
    } catch {
      // Unreadable config: registry markers still apply.
    }
  }

  // A hand-built repo's business config.
  for (const rel of ['config/site.ts', 'business/profile.ts']) {
    const p = join(repo, rel);
    if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf8');
    for (const [, v] of src.matchAll(/\b(?:name|shortName|domain|host):\s*'([^']+)'/g)) add(v, 'config');
    for (const [, v] of src.matchAll(/street:\s*'([^']+)'/g)) add(v, 'address');
    for (const [, v] of src.matchAll(/postcode:\s*'([^']+)'/g)) add(v, 'postcode');
  }

  // Source-derived: addresses, emails, storage keys, handles.
  const files = walk(repo).filter((f) => ['.ts', '.tsx', '.js', '.mjs'].includes(extname(f)));
  const domainRoot = site.domain ? site.domain.replace(/^www\./, '').split('.')[0] : null;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const [, v] of src.matchAll(/streetAddress['"]?\s*:\s*['"]([^'"]+)['"]/g)) add(v, 'address');
    for (const [, v] of src.matchAll(/postalCode['"]?\s*:\s*['"]([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})['"]/g)) add(v, 'postcode');
    for (const [, v] of src.matchAll(/(?:local|session)Storage\.(?:get|set|remove)Item\(\s*['"]([^'"]+)['"]/g)) add(v, 'storage key');
    if (/(?:local|session)Storage/.test(src)) {
      for (const [, v] of src.matchAll(/\b[A-Z_]*KEY\s*=\s*['"]([^'"]+)['"]/g)) add(v, 'storage key');
    }
    for (const [, v] of src.matchAll(/(?:instagram|facebook|tiktok)\.com\/([A-Za-z0-9_.]{4,})/g)) add(v, 'social handle');
    if (domainRoot) {
      for (const [e] of src.matchAll(new RegExp(`[\\w.+-]+@${domainRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\w.]*`, 'g'))) add(e, 'email');
    }
  }

  // Asset paths and IndexNow key files.
  for (const dir of ['public/assets', 'public/photos', 'public/images', 'public/img']) {
    const p = join(repo, dir);
    if (!existsSync(p)) continue;
    for (const f of walk(p)) add(relative(join(repo, 'public'), f).split('\\').join('/'), 'asset path');
  }
  const pub = join(repo, 'public');
  if (existsSync(pub)) {
    for (const name of readdirSync(pub)) if (/^[0-9a-f]{16,}\.txt$/i.test(name)) add(name.replace(/\.txt$/i, ''), 'IndexNow key');
  }

  return [...m.values()];
}

function normalise(text) {
  return text.toLowerCase().replace(/[\s_-]+/g, ' ');
}

const show = process.argv.includes('--show-markers');
const sites = otherSites();
const all = [];
for (const s of sites) for (const mk of await markersFor(s)) all.push({ ...mk, site: s.key });
console.log(`Contamination check: ${all.length} markers from ${sites.length} other sites.`);
if (show) for (const mk of all) console.log(`  [${mk.site}] ${mk.kind}: ${mk.text}`);

const hits = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (rel.startsWith('public/work/')) continue; // photographs, checked by check-photo-dupes.py
  if (!TEXT.has(extname(file)) && !/\.(env|gitignore)/.test(file)) continue;
  const raw = readFileSync(file, 'utf8');
  raw.split('\n').forEach((line, i) => {
    const low = normalise(line);
    const lineDigits = line.replace(/(\d)[\s-]+(?=\d)/g, '$1');
    for (const mk of all) {
      const hit = mk.kind === 'phone' ? lineDigits.includes(mk.text) : low.includes(normalise(mk.text));
      if (hit) hits.push({ rel, line: i + 1, mk, excerpt: line.trim().slice(0, 120) });
    }
  });
}

if (hits.length) {
  console.error(`\n${hits.length} contamination hit(s):`);
  for (const h of hits) console.error(`  ${h.rel}:${h.line}  [${h.mk.site} ${h.mk.kind}: ${h.mk.text}]  ${h.excerpt}`);
  process.exit(1);
}
console.log('No markers from any other site found. Clean.');
