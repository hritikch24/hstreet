/**
 * Who did what in a recent window, for the metrics page.
 *
 * Visitors are grouped by their visit number (one per browser tab). The only
 * address kept for a visitor is the shortened one stored with each view or tap
 * (IPv4 with the last octet zeroed, IPv6 cut to /48), as the privacy notice
 * says. Page paths and taps are shown; enquiry names and contact details are
 * not (those stay in /hq).
 */
import { store } from '@/engine/store';

type Row = Record<string, unknown>;

const plain = (rows: Row[]) =>
  rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, typeof v === 'bigint' ? Number(v) : v])));

const q = (sql: string, since: Date) => store.$queryRawUnsafe<Row[]>(sql, since).then(plain).catch(() => [] as Row[]);

export type VisitorRow = {
  visitId: string;
  ip: string;
  city: string;
  device: string;
  browser: string;
  source: string;
  firstSeen: string;
  lastSeen: string;
  views: number;
  paths: string[];
  calls: number;
  whatsapp: number;
  enquiries: number;
};

export type TapRow = {
  kind: string;
  path: string;
  visitId: string;
  ip: string;
  city: string;
  device: string;
  browser: string;
  at: string;
};

export async function activity(hours: number): Promise<{ visitors: VisitorRow[]; taps: TapRow[] }> {
  const since = new Date(Date.now() - hours * 3600_000);

  const [visitors, taps] = await Promise.all([
    q(
      `WITH v AS (
         SELECT visit_id,
                min(seen_at) AS first_seen, max(seen_at) AS last_seen, COUNT(*)::bigint AS views,
                (array_agg(ip_prefix ORDER BY seen_at DESC))[1] AS ip,
                (array_agg(city ORDER BY seen_at DESC))[1] AS city,
                (array_agg(device ORDER BY seen_at DESC))[1] AS device,
                (array_agg(browser ORDER BY seen_at DESC))[1] AS browser,
                (array_agg(coalesce(nullif(utm_source,''), nullif(referrer,''), 'direct') ORDER BY seen_at))[1] AS source,
                array_agg(path ORDER BY seen_at) AS paths
         FROM visits WHERE seen_at >= $1 GROUP BY visit_id),
       t AS (
         SELECT visit_id,
                COUNT(*) FILTER (WHERE kind = 'call')::bigint AS calls,
                COUNT(*) FILTER (WHERE kind = 'whatsapp')::bigint AS whatsapp
         FROM phone_taps WHERE tapped_at >= $1 GROUP BY visit_id),
       e AS (
         SELECT visit_id, COUNT(*)::bigint AS enquiries
         FROM enquiries WHERE received_at >= $1 AND visit_id IS NOT NULL GROUP BY visit_id)
       SELECT v.*, coalesce(t.calls, 0) AS calls, coalesce(t.whatsapp, 0) AS whatsapp, coalesce(e.enquiries, 0) AS enquiries
       FROM v LEFT JOIN t USING (visit_id) LEFT JOIN e USING (visit_id)
       ORDER BY (coalesce(t.calls, 0) + coalesce(t.whatsapp, 0) + coalesce(e.enquiries, 0)) DESC, v.last_seen DESC
       LIMIT 100`,
      since,
    ),
    q(
      `SELECT kind, path, visit_id, coalesce(ip_prefix, '') AS ip, coalesce(city, '') AS city,
              coalesce(device, '') AS device, coalesce(browser, '') AS browser, tapped_at AS at
       FROM phone_taps WHERE tapped_at >= $1 ORDER BY tapped_at DESC LIMIT 100`,
      since,
    ),
  ]);

  const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v ?? ''));

  return {
    visitors: visitors.map((r) => ({
      visitId: String(r.visit_id),
      ip: String(r.ip ?? ''),
      city: String(r.city ?? ''),
      device: String(r.device ?? ''),
      browser: String(r.browser ?? ''),
      source: String(r.source ?? 'direct'),
      firstSeen: iso(r.first_seen),
      lastSeen: iso(r.last_seen),
      views: Number(r.views ?? 0),
      paths: Array.isArray(r.paths) ? (r.paths as string[]) : [],
      calls: Number(r.calls ?? 0),
      whatsapp: Number(r.whatsapp ?? 0),
      enquiries: Number(r.enquiries ?? 0),
    })),
    taps: taps.map((r) => ({
      kind: String(r.kind),
      path: String(r.path),
      visitId: String(r.visit_id),
      ip: String(r.ip ?? ''),
      city: String(r.city ?? ''),
      device: String(r.device ?? ''),
      browser: String(r.browser ?? ''),
      at: iso(r.at),
    })),
  };
}
