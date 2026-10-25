/** Small presentational pieces for the back office. */
import Link from 'next/link';

export const num = (n: unknown) => Number(n ?? 0).toLocaleString('en-GB');
export const gbp = (pence: number) =>
  (pence / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
export const when = (d: Date | string) =>
  new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate">{label}</p>
      <p className="mt-1 text-[1.9rem] font-bold tabular-nums text-ink">{value}</p>
      {hint && <p className="text-sm text-slate">{hint}</p>}
    </div>
  );
}

export function Bars({ title, rows, label, count = 'count' }: { title: string; rows: Record<string, unknown>[]; label: string; count?: string }) {
  const max = Math.max(1, ...rows.map((r) => Number(r[count] ?? 0)));
  return (
    <section className="panel p-4">
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
                  <div className="h-2.5 rounded bg-stone-deep">
                    <div className="h-2.5 rounded bg-ink" style={{ width: `${(Number(r[count] ?? 0) / max) * 100}%` }} />
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
          className={`rounded border px-3 py-1 text-sm font-bold no-underline ${h === hours ? 'border-ink bg-ink text-stone' : 'border-rule text-ink'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export function Pill({ children, tone = 'ink' }: { children: React.ReactNode; tone?: 'ink' | 'accent' | 'wa' | 'slate' }) {
  const cls = { ink: 'bg-ink text-stone', accent: 'bg-accent text-white', wa: 'bg-wa text-white', slate: 'bg-stone-deep text-ink' }[tone];
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${cls}`}>{children}</span>;
}

/**
 * A WhatsApp message asking a customer for a Google review, with the
 * business's review link. Reviews are what move a local firm up the map.
 */
export function ReviewAsk({ phone, name, link }: { phone: string; name: string; link: string }) {
  if (!link) {
    return (
      <span className="text-sm text-slate" title="Add googleReviewLink in business/profile.ts">
        Review link not set
      </span>
    );
  }
  const digits = phone.replace(/\D/g, '');
  const wa = digits.startsWith('0') ? `44${digits.slice(1)}` : digits;
  const first = name.trim().split(/\s+/)[0] || 'there';
  const text = `Hi ${first}, thank you for choosing us. If you're happy with the work, a short Google review would really help a small local firm: ${link}`;
  return (
    <a href={`https://wa.me/${wa}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener" className="font-bold text-wa">
      Ask for a review
    </a>
  );
}
