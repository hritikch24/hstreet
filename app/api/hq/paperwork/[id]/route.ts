import { back, hidden, hqAllowed } from '@/engine/hq-session';
import { store } from '@/engine/store';

const STATES = new Set(['draft', 'sent', 'accepted', 'paid', 'void']);

export async function POST(request: Request, ctx: RouteContext<'/api/hq/paperwork/[id]'>) {
  if (!(await hqAllowed())) return hidden();
  const { id } = await ctx.params;
  const state = String((await request.formData()).get('state') ?? '');
  if (STATES.has(state)) await store.paperwork.update({ where: { id }, data: { state } });
  return back(request, `/hq/paperwork/${id}`);
}
