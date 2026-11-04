import Link from 'next/link';
import { allGuides } from '@/copy/guides';
import { graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening } from '@/ui/blocks';

const path = '/guides';
const title = 'Shopfront Measurements & Shutter Help';
const description = 'Shopfront costs, planning permission, shutter repair or replace, glass types and what to do after a break-in. Practical guides for shop owners.';

export const metadata = pageMeta({ path, title, description });

export default function GuidesPage() {
  const trail = [{ name: 'Home', path: '/' }, { name: 'Guides', path }];
  return (
    <>
      <JsonLd data={graph(pageNode({ path, name: title, description, type: 'CollectionPage', modified: '2026-11-05' }), trailNode(path, trail))} />
      <Opening trail={trail} kicker="Before you book" h1="Help with your shopfront or shutter" answer="Start with the problem in front of you: getting measurements ready for a quote, choosing how a shutter opens, or working out what is safe to check when it stops moving." />
      <section className="shell pb-10" aria-label="Practical guides">
        {allGuides().map((guide) => (
          <article key={guide.slug} className="border-t border-rule py-7">
            <h2 className="text-[1.5rem]"><Link href={`/guides/${guide.slug}`}>{guide.h1}</Link></h2>
            <p className="mt-3 max-w-[68ch] text-slate">{guide.description}</p>
          </article>
        ))}
        <p className="mt-8 max-w-[68ch]">Need a fitter to look at it? <Link href="/get-a-quote">Send photos for a quote</Link>, or <Link href="/repairs">check repair coverage and emergency contact details</Link>.</p>
      </section>
    </>
  );
}
