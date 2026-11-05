/**
 * Access to the read-only metrics page, /metrics?key=<METRICS_KEY>.
 *
 * The key is the METRICS_KEY environment variable, or "admin" when that is not
 * set. It is checked on every request: no cookie, no redirect, so the address
 * always has the form /metrics?key=admin.
 *
 * Because the default is guessable, /metrics shows counts only. Names, phone
 * numbers, enquiry details, clients, quotes and photos live under /hq, which
 * stays behind HQ_KEY (16+ characters) and has no default.
 */
import { same } from '@/engine/hq-gate';

const DEFAULT_KEY = 'admin';

const metricsKey = () => process.env.METRICS_KEY?.trim() || DEFAULT_KEY;

export function metricsKeyIsRight(given: string | string[] | undefined): boolean {
  if (typeof given !== 'string' || !given) return false;
  return same(given, metricsKey());
}
