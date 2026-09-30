import { back, hidden, hqAllowed } from '@/engine/hq-session';
import { store } from '@/engine/store';

const STATUSES = new Set(['new', 'contacted', 'quoted', 'won', 'lost']);

export async function POST(request: Request, ctx: RouteContext<'/api/hq/enquiries/[id]'>) {
  if (!(await hqAllowed())) return hidden();
  const { id } = await ctx.params;
  const form = await request.formData();
  const status = String(form.get('status') ?? '');
  await store.enquiry.update({
    where: { id },
    data: {
      ...(STATUSES.has(status) ? { status } : {}),
      notes: String(form.get('notes') ?? '').slice(0, 4000) || null,
    },
  });
  return back(request, `/hq/enquiries/${id}`);
}
