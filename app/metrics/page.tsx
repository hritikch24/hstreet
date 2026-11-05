import { notFound } from 'next/navigation';
import { profile } from '@/business/profile';
import { serviceLabel } from '@/engine/enquiry-shape';
import { metricsKeyIsRight } from '@/engine/metrics-gate';
import { statsPayload } from '@/engine/stats';
import { Bars, Kpi, num, Periods } from '@/ui/hq-bits';

const ALLOWED = [24, 168, 720, 2160];

/**
 * Read-only metrics at /metrics?key=…. Counts only: no enquiry names, contact
 * details or photos (those are in /hq, behind the stronger key).
 */
export default async function MetricsPage({ searchParams }: PageProps<'/metrics'>) {
  const params = await searchParams;
  if (!metricsKeyIsRight(params.key)) notFound();

  const asked = Number(params.hours);
  const hours = ALLOWED.includes(asked) ? asked : 168;
  const s = await statsPayload(hours);

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
          <Periods hours={hours} base="/metrics" query={`key=${encodeURIComponent(String(params.key))}`} />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Kpi label="Visitors" value={num(visitors)} hint="separate visits" />
          <Kpi label="Page views" value={num(s.traffic.totalViews)} />
          <Kpi label="Enquiries" value={num(s.leads.total)} hint={`${num(jobs.install ?? 0)} install · ${num(jobs.repair ?? 0)} repair`} />
          <Kpi label="Call taps" value={num(calls)} />
          <Kpi label="WhatsApp taps" value={num(s.whatsappTaps)} />
          <Kpi label="Conversion" value={`${conversion}%`} hint="enquiries + taps ÷ visitors" />
        </div>

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
