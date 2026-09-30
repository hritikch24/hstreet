'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ClientOption {
  id: string;
  name: string;
  shopName: string | null;
  siteAddress: string | null;
  town: string | null;
}

type Row = { description: string; quantity: string; unit: string };

const pence = (pounds: string) => Math.round((Number(pounds) || 0) * 100);
const money = (p: number) => (p / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

export function PaperworkForm({ clients, preselect, defaultVat }: { clients: ClientOption[]; preselect?: string; defaultVat: number }) {
  const router = useRouter();
  const start = clients.find((c) => c.id === preselect);
  const [kind, setKind] = useState<'quote' | 'invoice'>('quote');
  const [clientId, setClientId] = useState(start?.id ?? '');
  const [billTo, setBillTo] = useState(start ? [start.name, start.shopName].filter(Boolean).join(', ') : '');
  const [billAddress, setBillAddress] = useState(start ? [start.siteAddress, start.town].filter(Boolean).join(', ') : '');
  const [rows, setRows] = useState<Row[]>([{ description: '', quantity: '1', unit: '' }]);
  const [vat, setVat] = useState(String(defaultVat));
  const [terms, setTerms] = useState('');
  const [dueOn, setDueOn] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const subtotal = rows.reduce((s, r) => s + Math.round((Number(r.quantity) || 0) * pence(r.unit)), 0);
  const vatPence = Math.round((subtotal * (Number(vat) || 0)) / 100);

  const pick = (id: string) => {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c) {
      setBillTo([c.name, c.shopName].filter(Boolean).join(', '));
      setBillAddress([c.siteAddress, c.town].filter(Boolean).join(', '));
    }
  };

  const set = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  async function save() {
    setBusy(true);
    setError('');
    const res = await fetch('/api/hq/paperwork', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        kind,
        clientId,
        billTo,
        billAddress,
        vatPercent: Number(vat) || 0,
        terms,
        dueOn: kind === 'invoice' ? dueOn : '',
        lines: rows.map((r) => ({ description: r.description, quantity: Number(r.quantity), unitPence: pence(r.unit) })),
      }),
    }).catch(() => null);
    const body = (await res?.json().catch(() => null)) as { ok?: boolean; id?: string; error?: string } | null;
    setBusy(false);
    if (body?.ok && body.id) router.push(`/hq/paperwork/${body.id}`);
    else setError(body?.error ?? 'Could not save.');
  }

  return (
    <div className="plate grid gap-4 p-4">
      <div className="flex gap-4">
        {(['quote', 'invoice'] as const).map((k) => (
          <label key={k} className="flex items-center gap-2 font-bold">
            <input type="radio" checked={kind === k} onChange={() => setKind(k)} /> {k === 'quote' ? 'Quote' : 'Invoice'}
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="pw-client">Client</label>
          <select id="pw-client" className="field" value={clientId} onChange={(e) => pick(e.target.value)}>
            <option value="">Not on the client list</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}{c.shopName ? ` (${c.shopName})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pw-to">Bill to</label>
          <input id="pw-to" className="field" value={billTo} onChange={(e) => setBillTo(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="pw-addr">Address</label>
          <input id="pw-addr" className="field" value={billAddress} onChange={(e) => setBillAddress(e.target.value)} />
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate">
            <th className="py-1 pr-2">Description</th>
            <th className="w-20 py-1 pr-2">Qty</th>
            <th className="w-28 py-1 pr-2">Unit £</th>
            <th className="w-24 py-1 text-right">Line</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="py-1 pr-2"><input aria-label="Description" className="field" value={r.description} onChange={(e) => set(i, 'description', e.target.value)} /></td>
              <td className="py-1 pr-2"><input aria-label="Quantity" inputMode="decimal" className="field" value={r.quantity} onChange={(e) => set(i, 'quantity', e.target.value)} /></td>
              <td className="py-1 pr-2"><input aria-label="Unit price in pounds" inputMode="decimal" className="field" value={r.unit} onChange={(e) => set(i, 'unit', e.target.value)} /></td>
              <td className="py-1 text-right tabular-nums">{money(Math.round((Number(r.quantity) || 0) * pence(r.unit)))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-plain justify-self-start" onClick={() => setRows((rs) => [...rs, { description: '', quantity: '1', unit: '' }])}>
        Add a line
      </button>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="pw-vat">VAT %</label>
          <input id="pw-vat" inputMode="decimal" className="field" value={vat} onChange={(e) => setVat(e.target.value)} />
        </div>
        {kind === 'invoice' && (
          <div>
            <label className="label" htmlFor="pw-due">Due on</label>
            <input id="pw-due" type="date" className="field" value={dueOn} onChange={(e) => setDueOn(e.target.value)} />
          </div>
        )}
        <div className="self-end text-right">
          <p>Subtotal {money(subtotal)}</p>
          <p>VAT {money(vatPence)}</p>
          <p className="text-[1.3rem] font-bold text-navy">Total {money(subtotal + vatPence)}</p>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="pw-terms">Terms and notes</label>
        <textarea id="pw-terms" rows={3} className="field" value={terms} onChange={(e) => setTerms(e.target.value)} />
      </div>
      {error && <p className="font-bold text-signal">{error}</p>}
      <button type="button" onClick={save} disabled={busy} className="btn btn-signal justify-self-start">
        {busy ? 'Saving…' : `Save ${kind}`}
      </button>
    </div>
  );
}
