import Link from 'next/link';
import { serviceLabel } from '@/engine/enquiry-shape';
import { statsPayload } from '@/engine/stats';
import { Bars, Kpi, num, Periods, Pill, when } from '@/ui/hq-bits';

const ALLOWED = [24, 168, 720, 2160];

export default async function Dashboard({ searchParams }: PageProps<'/hq'>) {
  const asked = Number((await searchParams).hours);
  const hours = ALLOWED.includes(asked) ? asked : 168;
  const s = await statsPayload(hours);
  const calls = s.callClicks.total - s.whatsappTaps;
  const visitors = s.traffic.uniqueSessions;
  const conversion = visitors ? (((s.leads.total + s.callClicks.total) / visitors) * 100).toFixed(1) : '0.0';
  const jobs = Object.fromEntries(s.routing.byJobType.map((r) => [String(r.job_type), Number(r.count)]));

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.8rem]">Dashboard</h1>
        <Periods hours={hours} base="/hq" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Visitors" value={num(visitors)} hint="separate visits" />
        <Kpi label="Page views" value={num(s.traffic.totalViews)} />
        <Kpi label="Enquiries" value={num(s.leads.total)} hint={`${num(jobs.install ?? 0)} install · ${num(jobs.repair ?? 0)} repair`} />
        <Kpi label="Call taps" value={num(calls)} />
        <Kpi label="WhatsApp taps" value={num(s.whatsappTaps)} />
        <Kpi label="Conversion" value={`${conversion}%`} hint="enquiries + taps ÷ visitors" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Bars title="Install enquiries by region" rows={s.routing.byRegion.filter((r) => r.job_type === 'install')} label="region" />
        <Bars title="Repair enquiries by region" rows={s.routing.byRegion.filter((r) => r.job_type === 'repair')} label="region" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Bars title="Top pages" rows={s.traffic.topPages} label="path" count="views" />
        <Bars title="Where visitors came from" rows={s.sources.bySource} label="source" />
        <Bars title="Visitor cities" rows={s.traffic.cities} label="city" />
        <Bars title="Enquiries by service" rows={s.leads.byService.map((r) => ({ ...r, service: serviceLabel(String(r.service)) }))} label="service" />
        <Bars title="Enquiries by source" rows={s.leads.bySource} label="source" />
        <Bars title="Taps by page" rows={s.callClicks.byPage} label="page" />
      </div>

      <section className="plate p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[1.1rem]">Recent enquiries</h2>
          <Link href="/hq/enquiries" className="text-sm font-bold">
            All enquiries
          </Link>
        </div>
        {s.leads.recent.length === 0 ? (
          <p className="mt-2 text-slate">None in this period.</p>
        ) : (
          <ul className="mt-2 divide-y divide-rule">
            {s.leads.recent.map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
                <Pill tone={e.jobType === 'repair' ? 'signal' : 'navy'}>{e.jobType}</Pill>
                <Link href={`/hq/enquiries/${e.id}`} className="font-bold">
                  {e.name}
                </Link>
                <span className="text-slate">
                  {serviceLabel(e.service)} · {e.location}
                </span>
                <span className="ml-auto text-sm text-slate">{when(e.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
