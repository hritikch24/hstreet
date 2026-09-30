/** Small presentational pieces for the back office. */
import Link from 'next/link';

export const num = (n: unknown) => Number(n ?? 0).toLocaleString('en-GB');
export const gbp = (pence: number) =>
  (pence / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
export const when = (d: Date | string) =>
  new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="plate p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate">{label}</p>
      <p className="mt-1 text-[1.9rem] font-bold tabular-nums text-navy">{value}</p>
      {hint && <p className="text-sm text-slate">{hint}</p>}
    </div>
  );
}

export function Bars({ title, rows, label, count = 'count' }: { title: string; rows: Record<string, unknown>[]; label: string; count?: string }) {
  const max = Math.max(1, ...rows.map((r) => Number(r[count] ?? 0)));
  return (
    <section className="plate p-4">
      <h2 className="text-[1.1rem]">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-slate">Nothing yet in this period.</p>
      ) : (
        <table className="mt-3 w-full text-[0.95rem]">
          <tbody>
            {rows.slice(0, 12).map((r, i) => (
              <tr key={i}>
                <td className="max-w-0 truncate py-1 pr-3" title={String(r[label] ?? '')}>
                  {String(r[label] ?? '—')}
                </td>
                <td className="w-2/5 py-1">
                  <div className="h-2.5 rounded bg-cream-deep">
                    <div className="h-2.5 rounded bg-navy" style={{ width: `${(Number(r[count] ?? 0) / max) * 100}%` }} />
                  </div>
                </td>
                <td className="w-14 py-1 text-right tabular-nums text-slate">{num(r[count])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export function Periods({ hours, base }: { hours: number; base: string }) {
  const options = [
    ['24h', 24],
    ['7 days', 168],
    ['30 days', 720],
    ['90 days', 2160],
  ] as const;
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(([label, h]) => (
        <Link
          key={h}
          href={`${base}?hours=${h}`}
          className={`rounded border-2 px-3 py-1 text-sm font-bold no-underline ${h === hours ? 'border-navy bg-navy text-cream' : 'border-rule text-navy'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export function Pill({ children, tone = 'navy' }: { children: React.ReactNode; tone?: 'navy' | 'signal' | 'wa' | 'slate' }) {
  const cls = { navy: 'bg-navy text-cream', signal: 'bg-signal text-white', wa: 'bg-wa text-white', slate: 'bg-cream-deep text-ink' }[tone];
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${cls}`}>{children}</span>;
}
