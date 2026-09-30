import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guideBySlug, guides } from '@/copy/guides';
import { faqNode, graph, pageMeta, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening } from '@/ui/blocks';
import { Paras } from '@/ui/Prose';

export const dynamicParams = false;

export function generateStaticParams() {
  return guides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<'/guides/[slug]'>) {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return pageMeta({ path: `/guides/${g.slug}`, title: g.title, description: g.description });
}

export default async function GuidePage({ params }: PageProps<'/guides/[slug]'>) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  const trail = [
    { name: 'Home', path: '/' },
    { name: g.h1, path },
  ];
  const asQuestions = g.sections.map((s) => ({ q: s.heading, a: s.paras, list: s.steps }));
  return (
    <>
      <JsonLd data={graph(faqNode(path, asQuestions), trailNode(path, trail))} />
      <Opening trail={trail} kicker="Guide" h1={g.h1} answer={g.answer} />
      <article className="shell pb-6">
        {g.sections.map((s) => (
          <section key={s.heading} className="mt-8 border-l-4 border-signal pl-4 sm:pl-6">
            <h2 className="text-[1.35rem] sm:text-[1.6rem]">{s.heading}</h2>
            <div className="mt-3">
              <Paras paras={s.paras} />
              {s.steps && (
                <ol className="mt-3 grid max-w-[68ch] list-decimal gap-2 pl-6 marker:font-bold marker:text-signal">
                  {s.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        ))}
        <p className="mt-10">
          <Link href={g.next.href} className="btn btn-signal">
            {g.next.label}
          </Link>
        </p>
      </article>
    </>
  );
}
