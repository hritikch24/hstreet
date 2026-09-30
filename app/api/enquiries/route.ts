import { profile, radius } from '@/business/profile';
import { reachOf } from '@/engine/coverage';
import { checkEnquiry, MAX_PHOTO_BYTES, MAX_PHOTOS, PHOTO_TYPES, serviceLabel } from '@/engine/enquiry-shape';
import { notifyOwner } from '@/engine/mailer';
import { store } from '@/engine/store';
import { sourceOf } from '@/engine/visit-source';

function newRef(): string {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const tail = Array.from(crypto.getRandomValues(new Uint8Array(3)), (b) => (b % 36).toString(36)).join('').toUpperCase();
  return `HS-${stamp}-${tail}`;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, message: 'The form could not be read. Please try again.' }, { status: 400 });
  }

  // Bots fill in the hidden field; people never see it.
  if (String(form.get('shop_website') ?? '').trim()) return Response.json({ ok: true, ref: 'HS-000000-OK' });

  const raw = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string'));
  const checked = checkEnquiry(raw);
  if (!checked.ok) return Response.json({ ok: false, problems: checked.problems }, { status: 422 });
  const e = checked.value;

  const files = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_PHOTOS) {
    return Response.json({ ok: false, problems: { photos: `Up to ${MAX_PHOTOS} photos, please.` } }, { status: 422 });
  }
  for (const f of files) {
    if (!PHOTO_TYPES.includes(f.type) || f.size > MAX_PHOTO_BYTES) {
      return Response.json({ ok: false, problems: { photos: 'Photos must be JPEG, PNG or WebP and under 1.4 MB each.' } }, { status: 422 });
    }
  }

  const reach = await reachOf(e.place);

  // Repairs stop at the radius. Offer a callback or an install quote instead.
  if (e.jobType === 'repair' && reach.status === 'outside' && e.wants !== 'callback') {
    return Response.json(
      {
        ok: false,
        outside: true,
        miles: reach.miles,
        message: `${reach.town ?? e.place} is about ${Math.round(reach.miles ?? 0)} miles from us, and we only do repairs within ${radius()} miles of Birmingham. We can still quote for a new installation there, or give you a call back to talk it through.`,
      },
      { status: 422 },
    );
  }

  const visitId = String(form.get('visit') ?? '').slice(0, 64) || null;
  const first = visitId
    ? await store.visit.findFirst({ where: { visitId }, orderBy: { seenAt: 'asc' } }).catch(() => null)
    : null;

  const ref = newRef();
  try {
    await store.enquiry.create({
      data: {
        ref,
        jobType: e.jobType,
        service: e.service,
        place: e.place,
        postcode: reach.postcode ?? null,
        town: reach.town ?? null,
        region: reach.region ?? null,
        milesFromBase: reach.miles ?? null,
        inRepairArea: reach.status === 'unknown' ? null : reach.status === 'inside',
        wants: e.wants,
        name: e.name,
        phone: e.phone,
        email: e.email ?? null,
        contactBy: e.contactBy,
        message: e.message ?? null,
        source: first ? sourceOf(first) : null,
        landingPath: first?.path ?? null,
        visitId,
        photos: {
          create: await Promise.all(
            files.map(async (f) => ({ mime: f.type, sizeBytes: f.size, bytes: Buffer.from(await f.arrayBuffer()) })),
          ),
        },
      },
    });
  } catch (err) {
    console.error('[enquiries] not stored', err);
    return Response.json(
      { ok: false, message: `Sorry, that didn’t go through. Please call ${profile.phone.value.display} or WhatsApp us instead.` },
      { status: 500 },
    );
  }

  await notifyOwner(`${e.jobType === 'repair' ? 'Repair' : 'Install'} enquiry ${ref}: ${serviceLabel(e.service)}, ${reach.town ?? e.place}`, [
    ['Reference', ref],
    ['Type', e.jobType === 'repair' ? 'Repair' : 'New installation'],
    ['Wants', e.wants === 'callback' ? 'A callback' : 'A quote'],
    ['Service', serviceLabel(e.service)],
    ['Where', `${e.place}${reach.town ? ` (${reach.town}${reach.region ? `, ${reach.region}` : ''})` : ''}`],
    ['Distance', reach.miles !== undefined ? `${reach.miles} miles from base` : 'Could not be located, check'],
    ['Name', e.name],
    ['Phone', e.phone],
    ['Email', e.email],
    ['Contact by', e.contactBy],
    ['Message', e.message],
    ['Photos', files.length ? `${files.length} attached (see /hq)` : null],
    ['Came from', first ? `${sourceOf(first)}, landed on ${first.path}` : null],
  ]);

  return Response.json({ ok: true, ref });
}
