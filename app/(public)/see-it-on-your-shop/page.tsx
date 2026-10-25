import Link from 'next/link';
import { profile } from '@/business/profile';
import { graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening } from '@/ui/blocks';
import { Visualiser } from '@/ui/visualiser/Visualiser';

const TITLE = 'See a New Shopfront on Your Shop';
const DESCRIPTION =
  'Take a photo of your shop, mark the opening and see a new aluminium shopfront or roller shutter on it, in the colours we fit. Then send it for a price.';

export const metadata = pageMeta({ path: '/see-it-on-your-shop', title: TITLE, description: DESCRIPTION });

export default function SeeItOnYourShopPage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'See it on your shop', path: '/see-it-on-your-shop' },
  ];
  return (
    <>
      <JsonLd data={graph(pageNode({ path: '/see-it-on-your-shop', name: TITLE, description: DESCRIPTION }), trailNode('/see-it-on-your-shop', trail))} />
      <Opening
        trail={trail}
        kicker="Try before you choose"
        h1="See a new shopfront on your shop"
        answer="Take a photo of your shop from across the road, drag four corners onto the opening, and try frame colours, door positions, glass and shutters on it. Your photo stays on your phone unless you choose to send it to us for a price."
      />
      <section className="shell pb-10">
        <ol className="mb-6 grid gap-3 text-[0.98rem] sm:grid-cols-3">
          {[
            ['Photo', 'Straight on, in daylight, the whole frontage in shot.'],
            ['Corners', 'Drag the red corners onto the corners of the opening.'],
            ['Choose', 'Try colours and styles, then send it for a price.'],
          ].map(([h, t], i) => (
            <li key={h} className="flex gap-3 border-t border-ink pt-3">
              <span className="sign text-[1.8rem] leading-none text-accent">{i + 1}</span>
              <span>
                <strong className="block text-ink">{h}</strong>
                {t}
              </span>
            </li>
          ))}
        </ol>
        <Visualiser phoneDisplay={profile.phone.value.display} />
        <p className="mt-8 max-w-[68ch] text-[0.98rem]">
          Curved, recessed or listed frontages don’t fit four corners well. For those,{' '}
          <Link href="/get-a-quote">send us a photo</Link> and we’ll draw it properly after the survey.
        </p>
      </section>
    </>
  );
}
