import { connection } from 'next/server';
import Link from 'next/link';
import { store } from '@/engine/store';
import { gbp, Pill, when } from '@/ui/hq-bits';

export default async function PaperworkPage() {
  await connection();
  const docs = await store.paperwork.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.8rem]">Quotes & invoices</h1>
        <Link href="/hq/paperwork/new" className="btn btn-signal">New quote or invoice</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-navy text-xs uppercase tracking-wider text-slate">
              <th className="py-2 pr-3">Ref</th>
              <th className="py-2 pr-3">For</th>
              <th className="py-2 pr-3">Total</th>
              <th className="py-2 pr-3">State</th>
              <th className="py-2 pr-3">Issued</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-rule">
                <td className="py-2 pr-3">
                  <Link href={`/hq/paperwork/${d.id}`} className="font-bold">{d.ref}</Link>{' '}
                  <Pill tone={d.kind === 'invoice' ? 'signal' : 'navy'}>{d.kind}</Pill>
                </td>
                <td className="py-2 pr-3">{d.billTo}</td>
                <td className="py-2 pr-3 tabular-nums">{gbp(d.totalPence)}</td>
                <td className="py-2 pr-3">{d.state}</td>
                <td className="py-2 pr-3 text-slate">{when(d.issuedOn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {docs.length === 0 && <p className="mt-3 text-slate">Nothing yet.</p>}
      </div>
    </div>
  );
}
