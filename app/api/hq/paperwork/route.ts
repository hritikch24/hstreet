import { hidden, hqAllowed } from '@/engine/hq-session';
import { cleanLines, totals } from '@/engine/paperwork';
import { clip } from '@/engine/request-bits';
import { store } from '@/engine/store';

/** Creates a quote or invoice. Refs run HSQ-0001… for quotes, HSI-0001… for invoices. */
export async function POST(request: Request) {
  if (!(await hqAllowed())) return hidden();
  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return Response.json({ ok: false, error: 'Bad request' }, { status: 400 });
  const kind = b.kind === 'invoice' ? 'invoice' : 'quote';
  const lines = cleanLines(b.lines);
  const billTo = clip(b.billTo, 160);
  if (!billTo || lines.length === 0) {
    return Response.json({ ok: false, error: 'Add who it is for and at least one line.' }, { status: 422 });
  }
  const vatPercent = Math.max(0, Math.min(30, Number(b.vatPercent) || 0));
  const count = await store.paperwork.count({ where: { kind } });
  const ref = `${kind === 'invoice' ? 'HSI' : 'HSQ'}-${String(count + 1).padStart(4, '0')}`;
  const clientId = clip(b.clientId, 40);
  const due = clip(b.dueOn, 10);
  const doc = await store.paperwork.create({
    data: {
      kind,
      ref,
      clientId: clientId || null,
      billTo,
      billAddress: clip(b.billAddress, 400),
      lines: lines as unknown as object,
      ...totals(lines, vatPercent),
      vatPercent,
      terms: clip(b.terms, 2000),
      dueOn: due ? new Date(due) : null,
    },
  });
  return Response.json({ ok: true, id: doc.id });
}
