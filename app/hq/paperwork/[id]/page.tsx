import { notFound } from 'next/navigation';
import { profile } from '@/business/profile';
import type { Line } from '@/engine/paperwork';
import { store } from '@/engine/store';
import { gbp } from '@/ui/hq-bits';
import { PrintThis } from '@/ui/PrintThis';

const STATES = ['draft', 'sent', 'accepted', 'paid', 'void'];
const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' });

export default async function PaperworkDoc({ params }: PageProps<'/hq/paperwork/[id]'>) {
  const { id } = await params;
  const d = await store.paperwork.findUnique({ where: { id } });
  if (!d) notFound();
  const lines = d.lines as unknown as Line[];
  const a = profile.address.value;

  return (
    <div className="grid gap-4">
      <div className="no-print flex flex-wrap items-center gap-3">
        <PrintThis />
        <form method="post" action={`/api/hq/paperwork/${d.id}`} className="flex items-center gap-2">
          <label htmlFor="state" className="font-bold">State</label>
          <select id="state" name="state" defaultValue={d.state} className="field min-h-0 w-auto py-1.5">
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="btn btn-plain min-h-0 py-1.5">Save</button>
        </form>
      </div>

      <article className="mx-auto w-full max-w-3xl border-2 border-navy bg-white p-6 sm:p-10">
        <header className="flex flex-wrap justify-between gap-4 border-b-4 border-navy pb-4">
          <div>
            <p className="sign text-[1.6rem]">{profile.name}</p>
            <p className="text-sm text-slate">
              {[a.street, a.locality, a.city, a.postcode].filter(Boolean).join(', ')}
              <br />
              {profile.phone.value.display} · {profile.email.value}
              {!profile.companyNumber.isPlaceholder && <><br />Company no. {profile.companyNumber.value}</>}
            </p>
          </div>
          <div className="text-right">
            <p className="sign text-[1.6rem] uppercase">{d.kind}</p>
            <p className="font-bold">{d.ref}</p>
            <p className="text-sm">Issued {day(d.issuedOn)}</p>
            {d.dueOn && <p className="text-sm">Due {day(d.dueOn)}</p>}
          </div>
        </header>
        <section className="mt-5">
          <p className="text-sm uppercase tracking-wider text-slate">For</p>
          <p className="font-bold">{d.billTo}</p>
          {d.billAddress && <p>{d.billAddress}</p>}
        </section>
        <table className="mt-6 w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-navy text-sm uppercase tracking-wider text-slate">
              <th className="py-2 pr-2">Description</th>
              <th className="py-2 pr-2 text-right">Qty</th>
              <th className="py-2 pr-2 text-right">Unit</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-rule">
                <td className="py-2 pr-2">{l.description}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{l.quantity}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{gbp(l.unitPence)}</td>
                <td className="py-2 text-right tabular-nums">{gbp(Math.round(l.quantity * l.unitPence))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 ml-auto w-full max-w-xs text-right">
          <p className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{gbp(d.subtotalPence)}</span></p>
          {d.vatPercent > 0 && (
            <p className="flex justify-between"><span>VAT {d.vatPercent}%</span><span className="tabular-nums">{gbp(d.vatPence)}</span></p>
          )}
          <p className="mt-1 flex justify-between border-t-2 border-navy pt-1 text-[1.2rem] font-bold">
            <span>Total</span>
            <span className="tabular-nums">{gbp(d.totalPence)}</span>
          </p>
        </div>
        {d.terms && <p className="mt-6 whitespace-pre-wrap text-sm">{d.terms}</p>}
      </article>
    </div>
  );
}
