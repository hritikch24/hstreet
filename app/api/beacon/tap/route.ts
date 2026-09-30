import { store } from '@/engine/store';
import { clip, geo, ipPrefix } from '@/engine/request-bits';

/** Records a tap on a phone or WhatsApp link. */
export async function POST(request: Request) {
  try {
    const b = (await request.json()) as Record<string, unknown>;
    const kind = b.kind === 'whatsapp' ? 'whatsapp' : b.kind === 'call' ? 'call' : null;
    const visitId = clip(b.visit, 64);
    const path = clip(b.path, 300);
    if (!kind || !visitId || !path) return new Response(null, { status: 204 });
    await store.phoneTap.create({
      data: {
        kind,
        target: clip(b.target, 300) ?? '',
        path,
        visitId,
        referrer: clip(b.referrer, 500),
        utmSource: clip(b.utmSource, 120),
        utmMedium: clip(b.utmMedium, 120),
        utmCampaign: clip(b.utmCampaign, 120),
        device: clip(b.device, 20),
        browser: clip(b.browser, 30),
        ...geo(request.headers),
        ipPrefix: ipPrefix(request.headers),
      },
    });
  } catch (err) {
    console.error('[beacon] tap not stored', err);
  }
  return new Response(null, { status: 204 });
}
