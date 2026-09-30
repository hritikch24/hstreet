#!/usr/bin/env node
/**
 * How much of this site's wording also appears on the other sites in the
 * portfolio, measured as shared 8-word sequences.
 *
 * Ours: the visible text (and meta descriptions) of every page in the build,
 * plus llms.txt. Theirs: string literals and JSX text in each other repo's
 * source, plus its Markdown, text and HTML files.
 *
 *   npm run build && node tools/check-overlap.mjs [--max=0.5] [--list]
 *
 * Fails if the shared share of our 8-grams exceeds --max percent.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { ROOT, SKIP_DIRS, otherSites } from './portfolio.mjs';

const N = 8;
const arg = (name, fallback) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=')[1] : fallback;
};
const MAX = Number(arg('max', '0.5'));
const LIST = process.argv.includes('--list');

const CODE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const PROSE = new Set(['.md', '.mdx', '.txt', '.html']);

function files(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, acc);
    else acc.push(p);
  }
  return acc;
}

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', middot: '·', pound: '£' };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);

function visibleText(html) {
  const descriptions = [...html.matchAll(/<meta[^>]+name="description"[^>]+content="([^"]*)"/gi)].map((m) => m[1]);
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decode(`${descriptions.join('\n')}\n${body}`);
}

function codeText(src) {
  const out = [];
  for (const m of src.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) out.push(m[1] ?? m[2] ?? m[3] ?? '');
  for (const m of src.matchAll(/>([^<>{}]*[A-Za-z]{3,}[^<>{}]*)</g)) out.push(m[1]);
  return out.join('\n');
}

function grams(text) {
  const w = text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9£']+/g, ' ').split(' ').filter(Boolean);
  const set = new Set();
  for (let i = 0; i + N <= w.length; i++) set.add(w.slice(i, i + N).join(' '));
  return set;
}

// Ours
const built = join(ROOT, '.next', 'server', 'app');
if (!existsSync(built)) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(2);
}
const ours = new Map();
const questions = new Map(); // normalised question heading -> page
const flat = (t) => t.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9£']+/g, ' ').trim();
for (const f of files(built)) {
  const rel = relative(built, f);
  if (rel.startsWith('_') || rel.startsWith('hq')) continue;
  let text = null;
  if (f.endsWith('.html')) {
    const html = readFileSync(f, 'utf8');
    text = visibleText(html);
    for (const m of html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)) {
      const q = decode(m[1].replace(/<[^>]+>/g, '')).trim();
      if (q.endsWith('?')) questions.set(flat(q), rel);
    }
  }
  else if (rel === 'llms.txt.body') text = readFileSync(f, 'utf8');
  if (text === null) continue;
  for (const g of grams(text)) if (!ours.has(g)) ours.set(g, rel);
}

// Theirs, per site
const sites = otherSites();
const theirs = new Map(); // gram -> [site, file]
const corpus = {}; // site -> one flattened string, for exact question matches
for (const s of sites) {
  corpus[s.key] = '';
  for (const f of files(s.repoPath)) {
    const ext = extname(f).toLowerCase();
    if (!CODE.has(ext) && !PROSE.has(ext)) continue;
    const raw = readFileSync(f, 'utf8');
    const text = CODE.has(ext) ? codeText(raw) : ext === '.html' ? visibleText(raw) : raw;
    for (const g of grams(text)) if (!theirs.has(g)) theirs.set(g, [s.key, relative(s.repoPath, f)]);
    corpus[s.key] += ` ${flat(text)} `;
  }
}

// Question headings are short, so an 8-gram check can miss a copied FAQ.
const copiedQuestions = [];
for (const [q, page] of questions) {
  for (const [site, text] of Object.entries(corpus)) if (text.includes(` ${q} `)) copiedQuestions.push({ q, page, site });
}

const shared = [...ours.keys()].filter((g) => theirs.has(g));
const pct = ours.size ? (shared.length / ours.size) * 100 : 0;
const bySite = {};
for (const g of shared) bySite[theirs.get(g)[0]] = (bySite[theirs.get(g)[0]] ?? 0) + 1;

console.log(`Overlap check (${N}-word sequences) against ${sites.map((s) => s.key).join(', ')}`);
console.log(`  our sequences:    ${ours.size}`);
console.log(`  their sequences:  ${theirs.size}`);
console.log(`  shared:           ${shared.length} (${pct.toFixed(2)}%)`);
for (const [k, n] of Object.entries(bySite)) console.log(`    with ${k}: ${n}`);
if (LIST || shared.length <= 40) {
  for (const g of shared) console.log(`  "${g}"\n      ours: ${ours.get(g)}   theirs: ${theirs.get(g).join(' ')}`);
}
console.log(`  question headings: ${questions.size} checked, ${copiedQuestions.length} found elsewhere`);
for (const c of copiedQuestions) console.log(`    "${c.q}" (ours: ${c.page}, also in ${c.site})`);
if (copiedQuestions.length) {
  console.error('\nQuestion headings must be unique to this site.');
  process.exit(1);
}
if (pct > MAX) {
  console.error(`\nOverlap ${pct.toFixed(2)}% is above the ${MAX}% limit.`);
  process.exit(1);
}
console.log(`Within the ${MAX}% limit.`);
