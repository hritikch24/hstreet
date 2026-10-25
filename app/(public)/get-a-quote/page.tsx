import { garageLive, profile, radius } from '@/business/profile';
import { quotePage } from '@/copy/pages';
import { graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening } from '@/ui/blocks';
import { QuoteForm } from '@/ui/QuoteForm';
import { PhotoForQuote } from '@/ui/reach';

const c = quotePage();
export const metadata = pageMeta({ path: '/get-a-quote', title: c.title, description: c.description });

export default function QuotePage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Get a quote', path: '/get-a-quote' },
  ];
  return (
    <>
      <JsonLd data={graph(pageNode({ path: '/get-a-quote', name: c.h1, description: c.description }), trailNode('/get-a-quote', trail))} />
      <Opening trail={trail} h1={c.h1} answer={c.answer} />
      <div className="shell grid gap-8 pb-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section aria-labelledby="form-heading" className="panel p-5 sm:p-6">
          <h2 id="form-heading" className="text-[1.4rem] sm:text-[1.6rem]">
            Tell us about the job
          </h2>
          <div className="mt-5">
            <QuoteForm radiusMiles={radius()} phoneDisplay={profile.phone.value.display} garage={garageLive()} />
          </div>
        </section>
        <aside className="grid gap-4 lg:sticky lg:top-4">
          <PhotoForQuote />
          <div className="rounded-[2px] border border-dashed border-ink-soft p-4 text-[0.98rem]">
            <p className="font-bold text-ink">Repairs: Birmingham and up to {radius()} miles</p>
            <p className="mt-1">
              New installations go anywhere in the UK.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
