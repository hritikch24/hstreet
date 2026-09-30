/**
 * Numbers for the back office and for the owner's combined dashboard.
 *
 * `statsPayload()` returns the same JSON shape the owner's other sites return
 * from their metrics endpoints (period, traffic, leads, callClicks, sources,
 * dropOff, heatmaps), so the combined dashboard reads this site with no
 * special casing. Field names inside that shape are fixed by the dashboard;
 * the tables behind them are this site's own. Extra keys (`routing`,
 * `whatsappTaps`) are additions the dashboard ignores.
 */
import { store } from '@/engine/store';
import { SOURCE_SQL } from '@/engine/visit-source';

type Row = Record<string, unknown>;

const plain = (rows: Row[]) =>
  rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, typeof v === 'bigint' ? Number(v) : v])));

const q = (sql: string, since: Date) => store.$queryRawUnsafe<Row[]>(sql, since).then(plain).catch(() => [] as Row[]);

const LONDON = `AT TIME ZONE 'Europe/London'`;

export function hoursFrom(url: URL): number {
  const h = Number(url.searchParams.get('hours'));
  const d = Number(url.searchParams.get('days'));
  if (Number.isFinite(h) && h > 0) return Math.min(Math.round(h), 8760);
  if (Number.isFinite(d) && d > 0) return Math.min(Math.round(d), 365) * 24;
  return 24;
}

export async function statsPayload(hours: number) {
  const since = new Date(Date.now() - hours * 3600_000);

  const [
    totalViews,
    sessions,
    topPages,
    topReferrers,
    devices,
    browsers,
    countries,
    cities,
    ips,
    utmSources,
    daily,
    leadTotal,
    byStatus,
    byService,
    byLocation,
    leadSources,
    recent,
    leadDaily,
    tapTotal,
    tapPages,
    tapActions,
    tapDaily,
    tapRecent,
    trafficSources,
    landings,
    funnel,
    exitPages,
    entryPages,
    viewsHeat,
    leadsHeat,
    tapsHeat,
    byJobType,
    byRegion,
  ] = await Promise.all([
    store.visit.count({ where: { seenAt: { gte: since } } }),
    q(`SELECT COUNT(DISTINCT visit_id)::bigint AS n FROM visits WHERE seen_at >= $1`, since),
    q(`SELECT path, COUNT(*)::bigint AS views FROM visits WHERE seen_at >= $1 GROUP BY path ORDER BY views DESC LIMIT 20`, since),
    q(`SELECT referrer, COUNT(*)::bigint AS views FROM visits WHERE seen_at >= $1 AND coalesce(referrer,'') <> '' GROUP BY referrer ORDER BY views DESC LIMIT 15`, since),
    q(`SELECT coalesce(device,'unknown') AS device, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 GROUP BY 1 ORDER BY count DESC`, since),
    q(`SELECT coalesce(browser,'unknown') AS browser, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 GROUP BY 1 ORDER BY count DESC`, since),
    q(`SELECT coalesce(country,'unknown') AS country, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 GROUP BY 1 ORDER BY count DESC LIMIT 15`, since),
    q(`SELECT city, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 AND coalesce(city,'') <> '' GROUP BY city ORDER BY count DESC LIMIT 15`, since),
    q(`SELECT coalesce(ip_prefix,'unknown') AS ip, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 GROUP BY 1 ORDER BY count DESC LIMIT 20`, since),
    q(`SELECT utm_source, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 AND utm_source IS NOT NULL GROUP BY utm_source ORDER BY count DESC LIMIT 10`, since),
    q(`SELECT to_char(seen_at ${LONDON}, 'YYYY-MM-DD') AS date, COUNT(*)::bigint AS views FROM visits WHERE seen_at >= $1 GROUP BY 1 ORDER BY 1`, since),

    store.enquiry.count({ where: { receivedAt: { gte: since } } }),
    q(`SELECT status, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY status ORDER BY count DESC`, since),
    q(`SELECT service, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY service ORDER BY count DESC`, since),
    q(`SELECT coalesce(town, place) AS location, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY 1 ORDER BY count DESC LIMIT 15`, since),
    q(`SELECT coalesce(source,'Not known') AS source, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY 1 ORDER BY count DESC`, since),
    store.enquiry
      .findMany({ where: { receivedAt: { gte: since } }, orderBy: { receivedAt: 'desc' }, take: 20 })
      .catch(() => []),
    q(`SELECT to_char(received_at ${LONDON}, 'YYYY-MM-DD') AS date, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY 1 ORDER BY 1`, since),

    store.phoneTap.count({ where: { tappedAt: { gte: since } } }).catch(() => 0),
    q(`SELECT path AS page, COUNT(*)::bigint AS count FROM phone_taps WHERE tapped_at >= $1 GROUP BY path ORDER BY count DESC LIMIT 15`, since),
    q(`SELECT CASE kind WHEN 'whatsapp' THEN 'whatsapp_click' ELSE 'call_click' END AS action, COUNT(*)::bigint AS count FROM phone_taps WHERE tapped_at >= $1 GROUP BY 1 ORDER BY count DESC`, since),
    q(`SELECT to_char(tapped_at ${LONDON}, 'YYYY-MM-DD') AS date, COUNT(*)::bigint AS count FROM phone_taps WHERE tapped_at >= $1 GROUP BY 1 ORDER BY 1`, since),
    q(`SELECT CASE kind WHEN 'whatsapp' THEN 'whatsapp_click' ELSE 'call_click' END AS action, visit_id AS session_id, target AS phone, path AS page,
        coalesce(device,'') AS device, coalesce(browser,'') AS browser, coalesce(ip_prefix,'') AS ip, coalesce(country,'') AS country, tapped_at AS created_at
       FROM phone_taps WHERE tapped_at >= $1 ORDER BY tapped_at DESC LIMIT 50`, since),

    q(`SELECT ${SOURCE_SQL} AS source, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 GROUP BY 1 ORDER BY count DESC`, since),
    q(`WITH firsts AS (
         SELECT DISTINCT ON (visit_id) visit_id, path, referrer, utm_source, utm_medium, gclid
         FROM visits WHERE seen_at >= $1 ORDER BY visit_id, seen_at)
       SELECT path, ${SOURCE_SQL} AS source, COUNT(*)::bigint AS sessions FROM firsts GROUP BY 1, 2 ORDER BY sessions DESC LIMIT 30`, since),
    q(`WITH v AS (
         SELECT visit_id, COUNT(*) AS views,
           bool_or(path IN ('/aluminium-shopfronts','/roller-shutters','/automatic-doors','/security-doors','/aluminium-doors',
                            '/shutter-repairs','/shopfront-glass','/lock-and-door-repairs','/nationwide','/repairs')
                   OR path LIKE '/repairs/%' OR path LIKE '/nationwide/%') AS saw_offer,
           bool_or(path IN ('/get-a-quote','/talk-to-us')) AS reached_convert
         FROM visits WHERE seen_at >= $1 GROUP BY visit_id),
       t AS (SELECT DISTINCT visit_id FROM phone_taps WHERE tapped_at >= $1
             UNION SELECT DISTINCT visit_id FROM enquiries WHERE received_at >= $1 AND visit_id IS NOT NULL)
       SELECT COUNT(*)::bigint AS sessions,
              COUNT(*) FILTER (WHERE v.views >= 2)::bigint AS engaged,
              COUNT(*) FILTER (WHERE v.saw_offer)::bigint AS saw_offer,
              COUNT(*) FILTER (WHERE v.reached_convert)::bigint AS reached_convert,
              COUNT(t.visit_id)::bigint AS acted
       FROM v LEFT JOIN t USING (visit_id)`, since),
    q(`WITH r AS (SELECT path, row_number() OVER (PARTITION BY visit_id ORDER BY seen_at DESC) AS n FROM visits WHERE seen_at >= $1)
       SELECT path, COUNT(*)::bigint AS views, COUNT(*) FILTER (WHERE n = 1)::bigint AS exits
       FROM r GROUP BY path HAVING COUNT(*) >= 3 ORDER BY exits DESC LIMIT 25`, since),
    q(`WITH s AS (SELECT visit_id, COUNT(*) AS views FROM visits WHERE seen_at >= $1 GROUP BY visit_id),
            e AS (SELECT DISTINCT ON (visit_id) visit_id, path FROM visits WHERE seen_at >= $1 ORDER BY visit_id, seen_at)
       SELECT e.path, COUNT(*)::bigint AS sessions, COUNT(*) FILTER (WHERE s.views = 1)::bigint AS bounced
       FROM e JOIN s USING (visit_id) GROUP BY e.path HAVING COUNT(*) >= 3 ORDER BY sessions DESC LIMIT 25`, since),
    q(`SELECT extract(dow FROM seen_at ${LONDON})::int AS dow, extract(hour FROM seen_at ${LONDON})::int AS hour, COUNT(*)::bigint AS count FROM visits WHERE seen_at >= $1 GROUP BY 1, 2`, since),
    q(`SELECT extract(dow FROM received_at ${LONDON})::int AS dow, extract(hour FROM received_at ${LONDON})::int AS hour, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY 1, 2`, since),
    q(`SELECT extract(dow FROM tapped_at ${LONDON})::int AS dow, extract(hour FROM tapped_at ${LONDON})::int AS hour, COUNT(*)::bigint AS count FROM phone_taps WHERE tapped_at >= $1 GROUP BY 1, 2`, since),
    q(`SELECT job_type, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY job_type`, since),
    q(`SELECT job_type, coalesce(region, 'Not located') AS region, COUNT(*)::bigint AS count FROM enquiries WHERE received_at >= $1 GROUP BY 1, 2 ORDER BY count DESC`, since),
  ]);

  const whatsapp = tapActions.find((r) => r.action === 'whatsapp_click');

  return {
    period: { days: hours / 24, since: since.toISOString() },
    traffic: {
      totalViews,
      uniqueSessions: Number(sessions[0]?.n ?? 0),
      topPages,
      topReferrers,
      devices,
      browsers,
      countries,
      cities,
      ips,
      utmSources,
      daily,
    },
    leads: {
      total: leadTotal,
      byStatus,
      byService,
      byLocation,
      bySource: leadSources,
      daily: leadDaily,
      recent: recent.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email ?? '',
        phone: e.phone,
        location: e.town ?? e.place,
        service: e.service,
        message: e.message,
        source: e.source,
        sessionId: e.visitId,
        status: e.status,
        createdAt: e.receivedAt,
        updatedAt: e.updatedAt,
        jobType: e.jobType,
      })),
    },
    callClicks: {
      total: tapTotal,
      byPage: tapPages,
      byAction: tapActions,
      daily: tapDaily,
      recent: tapRecent,
    },
    sources: { bySource: trafficSources, landings },
    dropOff: { funnel: funnel[0] ?? null, exitPages, entryPages },
    heatmaps: { views: viewsHeat, leads: leadsHeat, calls: tapsHeat },
    whatsappTaps: Number(whatsapp?.count ?? 0),
    routing: { byJobType, byRegion },
  };
}

export type Stats = Awaited<ReturnType<typeof statsPayload>>;
