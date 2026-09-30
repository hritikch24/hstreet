import Link from 'next/link';
import { serviceLabel } from '@/engine/enquiry-shape';
import { store } from '@/engine/store';
import { Pill, when } from '@/ui/hq-bits';

const TYPES = ['install', 'repair'] as const;

export default async function EnquiriesPage({ searchParams }: PageProps<'/hq/enquiries'>) {
  const sp = await searchParams;
  const type = TYPES.find((t) => t === sp.type);
  const region = typeof sp.region === 'string' ? sp.region : undefined;
  const where = {
    ...(type ? { jobType: type } : {}),
    ...(region ? { region: region === 'Not located' ? null : region } : {}),
  };
  const [rows, regions] = await Promise.all([
    store.enquiry.findMany({ where, orderBy: { receivedAt: 'desc' }, take: 200, include: { _count: { select: { photos: true } } } }),
    store.enquiry.groupBy({ by: ['jobType', 'region'], _count: { _all: true } }),
  ]);

  const tab = (t?: string) =>
    `rounded border-2 px-3 py-1 text-sm font-bold no-underline ${t === type ? 'border-navy bg-navy text-cream' : 'border-rule text-navy'}`;

  return (
    <div className="grid gap-5">
      <h1 className="text-[1.8rem]">Enquiries</h1>
      <div className="flex flex-wrap gap-1">
        <Link href="/hq/enquiries" className={tab(undefined)}>All</Link>
        <Link href="/hq/enquiries?type=install" className={tab('install')}>Installs (UK-wide)</Link>
        <Link href="/hq/enquiries?type=repair" className={tab('repair')}>Repairs (Birmingham)</Link>
      </div>

      <section className="plate p-4">
        <h2 className="text-[1.1rem]">By region</h2>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          {TYPES.map((t) => (
            <div key={t}>
              <p className="text-sm font-bold uppercase tracking-wider text-slate">{t === 'install' ? 'Installs' : 'Repairs'}</p>
              <ul className="mt-1">
                {regions
                  .filter((r) => r.jobType === t)
                  .sort((a, b) => b._count._all - a._count._all)
                  .map((r) => (
                    <li key={`${t}-${r.region}`}>
                      <Link href={`/hq/enquiries?type=${t}&region=${encodeURIComponent(r.region ?? 'Not located')}`}>
                        {r.region ?? 'Not located'}
                      </Link>{' '}
                      <span className="text-slate">{r._count._all}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-navy text-xs uppercase tracking-wider text-slate">
              <th className="py-2 pr-3">Received</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Service</th>
              <th className="py-2 pr-3">Where</th>
              <th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-rule align-top">
                <td className="py-2 pr-3 whitespace-nowrap text-slate">{when(e.receivedAt)}</td>
                <td className="py-2 pr-3">
                  <Pill tone={e.jobType === 'repair' ? 'signal' : 'navy'}>{e.jobType}</Pill>
                  {e.wants === 'callback' && <> <Pill tone="slate">callback</Pill></>}
                </td>
                <td className="py-2 pr-3">
                  <Link href={`/hq/enquiries/${e.id}`} className="font-bold">{e.name}</Link>
                  {e._count.photos > 0 && <span className="text-slate"> · {e._count.photos} photo(s)</span>}
                </td>
                <td className="py-2 pr-3">{serviceLabel(e.service)}</td>
                <td className="py-2 pr-3">
                  {e.town ?? e.place}
                  {e.region && <span className="text-slate"> · {e.region}</span>}
                  {e.jobType === 'repair' && e.inRepairArea === false && <> <Pill tone="signal">outside radius</Pill></>}
                  {e.inRepairArea === null && e.jobType === 'repair' && <> <Pill tone="slate">check distance</Pill></>}
                </td>
                <td className="py-2 pr-3">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="mt-3 text-slate">No enquiries match.</p>}
      </div>
    </div>
  );
}
