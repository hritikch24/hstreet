import { hidden, hqAllowed } from '@/engine/hq-session';
import { store } from '@/engine/store';

/** Serves a photo attached to an enquiry, to the back office only. */
export async function GET(_request: Request, ctx: RouteContext<'/api/hq/photos/[id]'>) {
  if (!(await hqAllowed())) return hidden();
  const { id } = await ctx.params;
  const photo = await store.enquiryPhoto.findUnique({ where: { id } });
  if (!photo) return hidden();
  return new Response(new Uint8Array(photo.bytes), {
    headers: {
      'content-type': photo.mime,
      'cache-control': 'private, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
