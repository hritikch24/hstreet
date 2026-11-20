import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { profile } from '@/business/profile';
import { activity } from '@/engine/activity';
import { serviceLabel } from '@/engine/enquiry-shape';
import { PASS_COOKIE, passIsValid } from '@/engine/hq-gate';
import { metricsKeyIsRight, metricsKeyIsStrong } from '@/engine/metrics-gate';
import { statsPayload } from '@/engine/stats';
import { Bars, Kpi, num, Periods, Pill } from '@/ui/hq-bits';

const ALLOWED = [1, 24, 168, 720, 2160];

const clock = (d: string) =>
  new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/London' });

/**
 * Read-only metrics at /metrics?key=…. Counts only: no enquiry names, contact
 * details or photos (those are in /hq, behind the stronger key).
 *
 * The visitor panel (shortened IP, pages seen, call and WhatsApp taps per
 * visitor) is shown only when the request is strongly authorised: a pass cookie
 * from /hq, or a METRICS_KEY of 16+ characters. The default key is guessable.
 */
export default async function MetricsPage({ searchParams }: PageProps<'/metrics'>) {
  const params = await searchParams;
  if (!metricsKeyIsRight(params.key)) notFound();

  const asked = Number(params.hours);
  const hours = ALLOWED.includes(asked) ? asked : 168;
  const s = await statsPayload(hours);

  const seeVisitors = metricsKeyIsStrong() || (await passIsValid((await cookies()).get(PASS_COOKIE)?.value));
  const who = seeVisitors ? await activity(hours) : null;

  const calls = s.callClicks.total - s.whatsappTaps;
  const visitors = s.traffic.uniqueSessions;
  const conversion = visitors ? (((s.leads.total + s.callClicks.total) / visitors) * 100).toFixed(1) : '0.0';
  const jobs = Object.fromEntries(s.routing.byJobType.map((r) => [String(r.job_type), Number(r.count)]));
  const visitSources = Object.entries(
    s.sources.landings.reduce<Record<string, number>>((acc, r) => {
      acc[String(r.source)] = (acc[String(r.source)] ?? 0) + Number(r.sessions ?? 0);
      return acc;
    }, {}),
  )
    .map(([source, count]) => ({ source, count }))
    .sort((x, y) => y.count - x.count);

  return (
    <div className="min-h-dvh bg-stone">
      <header className="bg-ink text-stone">
        <div className="shell py-3">
          <p className="sign text-[1.15rem] !text-stone">Metrics · {profile.name}</p>
        </div>
      </header>
      <main className="shell grid gap-5 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[1.8rem]">Metrics</h1>
          <Periods hours={hours} base="/metrics" query={`key=${encodeURIComponent(String(params.key))}`} withHour />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Kpi label="Visitors" value={num(visitors)} hint="separate visits" />
          <Kpi label="Page views" value={num(s.traffic.totalViews)} />
          <Kpi label="Enquiries" value={num(s.leads.total)} hint={`${num(jobs.install ?? 0)} install · ${num(jobs.repair ?? 0)} repair`} />
          <Kpi label="Call taps" value={num(calls)} />
          <Kpi label="WhatsApp taps" value={num(s.whatsappTaps)} />
          <Kpi label="Conversion" value={`${conversion}%`} hint="enquiries + taps ÷ visitors" />
        </div>


        {who ? (
          <section className="panel p-4">
            <h2 className="text-[1.1rem]">Visitors in the last {hours === 1 ? 'hour' : `${hours} hours`}</h2>
            <p className="mt-1 text-sm text-slate">
              One row per visit (a browser tab). The address is the shortened one the site stores (last part removed), so it
              narrows a visit down to a network, not a person. Visits that tapped Call or WhatsApp, or sent an enquiry, come first.
            </p>
            {who.visitors.length === 0 ? (
              <p className="mt-2 text-slate">No visits in this period.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[56rem] text-left text-[0.9rem]">
                  <thead>
                    <tr className="border-b border-rule text-xs uppercase tracking-wider text-slate">
                      <th className="py-2 pr-3">Last seen</th>
                      <th className="py-2 pr-3">IP (shortened)</th>
                      <th className="py-2 pr-3">Where</th>
                      <th className="py-2 pr-3">Device</th>
                      <th className="py-2 pr-3">Came from</th>
                      <th className="py-2 pr-3">Pages</th>
                      <th className="py-2 pr-3">Did</th>
                      <th className="py-2">Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {who.visitors.map((v) => (
                      <tr key={v.visitId} className="border-b border-rule align-top">
                        <td className="whitespace-nowrap py-2 pr-3 tabular-nums">{clock(v.lastSeen)}</td>
                        <td className="whitespace-nowrap py-2 pr-3 font-mono text-[0.85rem]">{v.ip || '—'}</td>
                        <td className="py-2 pr-3">{v.city || '—'}</td>
                        <td className="py-2 pr-3">{[v.device, v.browser].filter(Boolean).join(' · ') || '—'}</td>
                        <td className="max-w-[10rem] truncate py-2 pr-3" title={v.source}>{v.source}</td>
                        <td className="py-2 pr-3">
                          <span className="tabular-nums text-slate">{v.views} · </span>
                          {v.paths.slice(0, 6).join(' → ')}
                          {v.paths.length > 6 ? ' …' : ''}
                        </td>
                        <td className="space-x-1 py-2 pr-3">
                          {v.whatsapp > 0 && <Pill tone="wa">WhatsApp ×{v.whatsapp}</Pill>}
                          {v.calls > 0 && <Pill tone="accent">Call ×{v.calls}</Pill>}
                          {v.enquiries > 0 && <Pill>Enquiry ×{v.enquiries}</Pill>}
                          {v.whatsapp + v.calls + v.enquiries === 0 && <span className="text-slate">browsed</span>}
                        </td>
                        <td className="py-2 font-mono text-[0.8rem] text-slate">{v.visitId.slice(0, 8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <section className="panel p-4">
            <h2 className="text-[1.1rem]">Visitors</h2>
            <p className="mt-1 text-slate">
              The visitor list is hidden on the default key. Open /hq once in this browser, or set METRICS_KEY to 16 or more
              characters, then reload this page.
            </p>
          </section>
        )}

        {who && (
          <section className="panel p-4">
            <h2 className="text-[1.1rem]">Call and WhatsApp taps</h2>
            {who.taps.length === 0 ? (
              <p className="mt-2 text-slate">No taps in this period.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[44rem] text-left text-[0.9rem]">
                  <thead>
                    <tr className="border-b border-rule text-xs uppercase tracking-wider text-slate">
                      <th className="py-2 pr-3">When</th>
                      <th className="py-2 pr-3">Tap</th>
                      <th className="py-2 pr-3">IP (shortened)</th>
                      <th className="py-2 pr-3">Where</th>
                      <th className="py-2 pr-3">Device</th>
                      <th className="py-2 pr-3">On page</th>
                      <th className="py-2">Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {who.taps.map((t, i) => (
                      <tr key={i} className="border-b border-rule">
                        <td className="whitespace-nowrap py-2 pr-3 tabular-nums">{clock(t.at)}</td>
                        <td className="py-2 pr-3">
                          <Pill tone={t.kind === 'whatsapp' ? 'wa' : 'accent'}>{t.kind === 'whatsapp' ? 'WhatsApp' : 'Call'}</Pill>
                        </td>
                        <td className="whitespace-nowrap py-2 pr-3 font-mono text-[0.85rem]">{t.ip || '—'}</td>
                        <td className="py-2 pr-3">{t.city || '—'}</td>
                        <td className="py-2 pr-3">{[t.device, t.browser].filter(Boolean).join(' · ') || '—'}</td>
                        <td className="py-2 pr-3">{t.path}</td>
                        <td className="py-2 font-mono text-[0.8rem] text-slate">{t.visitId.slice(0, 8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <Bars title="Page views by day" rows={s.traffic.daily} label="date" count="views" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Bars title="Top pages" rows={s.traffic.topPages} label="path" count="views" />
          <Bars title="Where visits started" rows={visitSources} label="source" />
          <Bars title="Referrers" rows={s.traffic.topReferrers} label="referrer" count="views" />
          <Bars title="Visitor cities" rows={s.traffic.cities} label="city" />
          <Bars title="Devices" rows={s.traffic.devices} label="device" />
          <Bars title="Taps by page" rows={s.callClicks.byPage} label="page" />
          <Bars title="Enquiries by service" rows={s.leads.byService.map((r) => ({ ...r, service: serviceLabel(String(r.service)) }))} label="service" />
          <Bars title="Enquiries by source" rows={s.leads.bySource} label="source" />
          <Bars title="Enquiries by region" rows={s.routing.byRegion} label="region" />
        </div>
      </main>
    </div>
  );
}
