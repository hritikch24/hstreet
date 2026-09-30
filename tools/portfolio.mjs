/**
 * Where the other sites in the portfolio live, read from the portfolio
 * registry at run time. Nothing about another site is written into this repo:
 * the checks discover names, numbers and paths from the registry and from
 * each repo's own config.
 *
 * Registry: $PORTFOLIO_REGISTRY, or ../seo-plan/portfolio-registry.json.
 */
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SELF_KEY = 'highstreet';

export function registryPath() {
  return process.env.PORTFOLIO_REGISTRY ?? resolve(ROOT, '..', 'seo-plan', 'portfolio-registry.json');
}

export function loadRegistry() {
  const p = registryPath();
  if (!existsSync(p)) {
    console.error(`Portfolio registry not found at ${p}. Set PORTFOLIO_REGISTRY.`);
    process.exit(2);
  }
  return JSON.parse(readFileSync(p, 'utf8'));
}

const expand = (p) => (p.startsWith('~/') ? join(homedir(), p.slice(2)) : p);

/** The other sites, with their repo paths resolved. Missing repos are reported and skipped. */
export function otherSites() {
  const reg = loadRegistry();
  const out = [];
  for (const site of reg.sites) {
    if (site.key === SELF_KEY) continue;
    const repo = expand(site.repo);
    if (!existsSync(repo)) {
      console.warn(`  (skipping ${site.key}: repo not found at ${repo})`);
      continue;
    }
    out.push({ ...site, repoPath: repo });
  }
  if (out.length === 0) {
    console.error('No other repos found; nothing to compare against.');
    process.exit(2);
  }
  return out;
}

export const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.vercel', 'out', 'build', 'coverage', '_old_site']);
