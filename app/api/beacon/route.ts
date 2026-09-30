import { store } from '@/engine/store';
import { clip, geo, ipPrefix, isPrivatePath } from '@/engine/request-bits';

/** Records one page view. Always answers 204 so a failure never shows to a visitor. */
export async function POST(request: Request) {
  try {
    const b = (await request.json()) as Record<string, unknown>;
    const path = clip(b.path, 300);
    const visitId = clip(b.visit, 64);
    if (!path || !visitId || !path.startsWith('/') || isPrivatePath(path)) return new Response(null, { status: 204 });
    await store.visit.create({
      data: {
        path,
        visitId,
        referrer: clip(b.referrer, 500),
        utmSource: clip(b.utmSource, 120),
        utmMedium: clip(b.utmMedium, 120),
        utmCampaign: clip(b.utmCampaign, 120),
        gclid: clip(b.gclid, 200),
        device: clip(b.device, 20),
        browser: clip(b.browser, 30),
        ...geo(request.headers),
        ipPrefix: ipPrefix(request.headers),
      },
    });
  } catch (err) {
    console.error('[beacon] page view not stored', err);
  }
  return new Response(null, { status: 204 });
}
