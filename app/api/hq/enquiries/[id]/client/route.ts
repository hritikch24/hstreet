import { back, hidden, hqAllowed } from '@/engine/hq-session';
import { store } from '@/engine/store';

/** Adds the enquirer to the client list, linked to the enquiry. */
export async function POST(request: Request, ctx: RouteContext<'/api/hq/enquiries/[id]/client'>) {
  if (!(await hqAllowed())) return hidden();
  const { id } = await ctx.params;
  const e = await store.enquiry.findUnique({ where: { id }, include: { client: true } });
  if (!e) return hidden();
  if (!e.client) {
    await store.client.create({
      data: { name: e.name, phone: e.phone, email: e.email, town: e.town ?? e.place, enquiryId: e.id },
    });
  }
  return back(request, '/hq/clients');
}
