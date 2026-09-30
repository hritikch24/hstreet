import { hidden, hqAllowed } from '@/engine/hq-session';
import { DRAFT_MODEL, draftReply } from '@/engine/reply-writer';
import { store } from '@/engine/store';

export const maxDuration = 60;

export async function POST(request: Request, ctx: RouteContext<'/api/hq/enquiries/[id]/draft'>) {
  if (!(await hqAllowed())) return hidden();
  const { id } = await ctx.params;
  const { channel } = (await request.json().catch(() => ({}))) as { channel?: string };
  const ch = channel === 'email' ? 'email' : 'whatsapp';
  const e = await store.enquiry.findUnique({ where: { id }, include: { _count: { select: { photos: true } } } });
  if (!e) return hidden();

  const result = await draftReply(
    {
      ref: e.ref,
      jobType: e.jobType,
      service: e.service,
      place: e.place,
      town: e.town,
      inRepairArea: e.inRepairArea,
      milesFromBase: e.milesFromBase,
      wants: e.wants,
      name: e.name,
      message: e.message,
      photoCount: e._count.photos,
    },
    ch,
  );
  if (!result.ok) return Response.json(result, { status: 502 });
  await store.replyDraft.create({ data: { enquiryId: id, channel: ch, body: result.text, model: DRAFT_MODEL } });
  return Response.json(result);
}
