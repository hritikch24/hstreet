import { connection } from 'next/server';
import Link from 'next/link';
import { store } from '@/engine/store';
import { profile } from '@/business/profile';
import { ReviewAsk, when } from '@/ui/hq-bits';

export default async function ClientsPage() {
  await connection();
  const clients = await store.client.findMany({
    orderBy: { addedAt: 'desc' },
    take: 300,
    include: { _count: { select: { paperwork: true } }, enquiry: { select: { id: true, jobType: true } } },
  });
  return (
    <div className="grid gap-5">
      <h1 className="text-[1.8rem]">Clients</h1>

      <details className="panel p-4">
        <summary className="cursor-pointer font-bold text-ink">Add a client by hand</summary>
        <form method="post" action="/api/hq/clients" className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ['name', 'Name', true],
            ['shopName', 'Shop name', false],
            ['phone', 'Phone', true],
            ['email', 'Email', false],
            ['siteAddress', 'Site address', false],
            ['town', 'Town', false],
          ].map(([name, label, required]) => (
            <div key={String(name)}>
              <label className="label" htmlFor={`c-${name}`}>{label}</label>
              <input id={`c-${name}`} name={String(name)} required={Boolean(required)} className="field" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label" htmlFor="c-notes">Notes</label>
            <textarea id="c-notes" name="notes" rows={2} className="field" />
          </div>
          <button className="btn btn-accent sm:col-span-2 sm:justify-self-start">Save client</button>
        </form>
      </details>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-ink text-xs uppercase tracking-wider text-slate">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Shop</th>
              <th className="py-2 pr-3">Phone</th>
              <th className="py-2 pr-3">Town</th>
              <th className="py-2 pr-3">Paperwork</th>
              <th className="py-2 pr-3">Review</th>
              <th className="py-2 pr-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-rule">
                <td className="py-2 pr-3 font-bold">
                  {c.name}
                  {c.enquiry && (
                    <Link href={`/hq/enquiries/${c.enquiry.id}`} className="ml-2 text-sm font-normal">
                      enquiry
                    </Link>
                  )}
                </td>
                <td className="py-2 pr-3">{c.shopName}</td>
                <td className="py-2 pr-3"><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                <td className="py-2 pr-3">{c.town}</td>
                <td className="py-2 pr-3">
                  <Link href={`/hq/paperwork/new?client=${c.id}`}>New quote or invoice</Link>
                  {c._count.paperwork > 0 && <span className="text-slate"> · {c._count.paperwork} so far</span>}
                </td>
                <td className="py-2 pr-3">
                  <ReviewAsk phone={c.phone} name={c.name} link={profile.googleReviewLink} />
                </td>
                <td className="py-2 pr-3 text-slate">{when(c.addedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && <p className="mt-3 text-slate">No clients yet.</p>}
      </div>
    </div>
  );
}
