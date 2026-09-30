import { notFound } from 'next/navigation';
import { serviceLabel } from '@/engine/enquiry-shape';
import { store } from '@/engine/store';
import { DraftReply } from '@/ui/DraftReply';
import { Pill, when } from '@/ui/hq-bits';

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

export default async function EnquiryPage({ params }: PageProps<'/hq/enquiries/[id]'>) {
  const { id } = await params;
  const e = await store.enquiry.findUnique({
    where: { id },
    include: {
      photos: { select: { id: true, sizeBytes: true } },
      drafts: { orderBy: { draftedAt: 'desc' }, take: 5 },
      client: { select: { id: true } },
    },
  });
  if (!e) notFound();

  const rows: [string, string | null][] = [
    ['Reference', e.ref],
    ['Received', when(e.receivedAt)],
    ['Wants', e.wants === 'callback' ? 'A callback' : 'A quote'],
    ['Service', serviceLabel(e.service)],
    ['Typed place', e.place],
    ['Located as', [e.town, e.postcode, e.region].filter(Boolean).join(', ') || 'Not located'],
    ['Distance from base', e.milesFromBase !== null ? `${e.milesFromBase} miles` : 'Unknown'],
    ['Phone', e.phone],
    ['Email', e.email],
    ['Reply by', e.contactBy],
    ['Came from', e.source ? `${e.source}${e.landingPath ? `, landed on ${e.landingPath}` : ''}` : null],
  ];

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[1.8rem]">{e.name}</h1>
        <Pill tone={e.jobType === 'repair' ? 'signal' : 'navy'}>{e.jobType}</Pill>
        {e.jobType === 'repair' && e.inRepairArea === false && <Pill tone="signal">outside repair radius</Pill>}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="plate p-4">
          <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[10rem_1fr]">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-slate">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
          </dl>
          {e.message && (
            <div className="mt-4 border-t border-rule pt-3">
              <p className="text-slate">Message</p>
              <p className="mt-1 whitespace-pre-wrap">{e.message}</p>
            </div>
          )}
          {e.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-rule pt-3">
              {e.photos.map((p) => (
                <a key={p.id} href={`/api/hq/photos/${p.id}`} target="_blank" rel="noopener">
                  {/* Private photos served from the database; next/image would cache them publicly. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/hq/photos/${p.id}`} alt={`Photo sent with enquiry ${e.ref}`} className="aspect-square w-full border border-rule object-cover" />
                </a>
              ))}
            </div>
          )}
        </section>

        <div className="grid content-start gap-5">
          <form method="post" action={`/api/hq/enquiries/${e.id}`} className="plate grid gap-3 p-4">
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={e.status} className="field">
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label className="label" htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={3} defaultValue={e.notes ?? ''} className="field" />
            <button className="btn btn-plain">Save</button>
          </form>

          {e.client ? (
            <p className="plate p-4">This enquiry is already on the client list.</p>
          ) : (
            <form method="post" action={`/api/hq/enquiries/${e.id}/client`} className="plate p-4">
              <p>Won the job, or quoting properly? Add them to the client list.</p>
              <button className="btn btn-plain mt-3">Add as client</button>
            </form>
          )}
        </div>
      </div>

      <DraftReply enquiryId={e.id} preferred={e.contactBy === 'email' ? 'email' : 'whatsapp'} phone={e.phone} email={e.email} earlier={e.drafts.map((d) => ({ id: d.id, channel: d.channel, body: d.body }))} />
    </div>
  );
}
