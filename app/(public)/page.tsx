import Link from 'next/link';
import { home } from '@/copy/pages';
import { photoByName } from '@/copy/job-photos';
import { installServices, repairServices } from '@/copy/services';
import { faqNode, firmNode, graph, ownerNode, pageMeta, siteNode } from '@/engine/search-meta';
import { JsonLd, PhotoGrid, Questions, TwoAreas, WorkPhoto } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

export const metadata = pageMeta({ path: '/', title: home().title, description: home().description });

const heroPhotos = ['black-aluminium-shopfront-parade-obscured-glass', 'grey-roller-shutter-full-shop-frontage'];
const proof = [
  'black-aluminium-shopfront-sliding-doors-daylight',
  'automatic-sliding-doors-convenience-store-aisles',
  'purple-roller-shutter-closed',
  'black-steel-double-fire-exit-doors',
  'white-aluminium-double-panel-doors',
  'aluminium-glazing-sliding-doors-new-unit-night',
];

export default function HomePage() {
  const c = home();
  return (
    <>
      <JsonLd data={graph(firmNode(), siteNode(), ownerNode(), faqNode('/', c.questions))} />

      <section className="bg-navy pb-10 text-cream">
        <div className="shell grid gap-8 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:pt-12">
          <div>
            <p className="kicker text-cream/70">{c.kicker}</p>
            <h1 className="mt-3 text-[2.1rem] !text-cream sm:text-[3rem]">{c.h1}</h1>
            <p className="mt-4 max-w-[60ch] text-[1.125rem] text-cream/90">{c.answer}</p>
            <div className="mt-6">
              <PhotoForQuote tone="navy" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:self-center">
            {heroPhotos.map((name, i) => (
              <WorkPhoto
                key={name}
                photo={photoByName(name)}
                preload={i === 0}
                sizes="(min-width: 1024px) 540px, 50vw"
                className={i === 0 ? 'lg:col-span-2' : 'lg:hidden'}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-10">
        <TwoAreas />
      </section>

      <section className="shell py-4">
        <h2 className="text-[1.6rem] sm:text-[2rem]">{c.linesHeading}</h2>
        <ul className="mt-5 divide-y-2 divide-rule border-y-2 border-navy">
          {[...installServices(), ...repairServices()].map((s) => (
            <li key={s.path}>
              <Link
                href={s.path}
                className="group grid gap-1 py-4 no-underline sm:grid-cols-[16rem_1fr_auto] sm:items-baseline sm:gap-6"
              >
                <span className="sign text-[1.3rem] group-hover:underline">{s.name}</span>
                <span className="text-ink">{s.summary}</span>
                <span className="text-sm font-bold text-signal">
                  {s.kind === 'install' ? 'Fitted UK-wide' : 'Birmingham only'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-cream-deep py-10">
        <div className="shell">
          <h2 className="text-[1.6rem] sm:text-[2rem]">{c.howHeading}</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.how.map((h, i) => (
              <li key={h.step} className="plate p-5">
                <span className="sign text-[2rem] text-signal">{i + 1}</span>
                <h3 className="mt-1 text-[1.1rem]">{h.step}</h3>
                <p className="mt-1 text-[0.98rem]">{h.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5">
            <Link href="/guides/photograph-and-measure-your-shopfront" className="font-bold">
              Which photos and measurements to send
            </Link>
          </p>
        </div>
      </section>

      <section className="shell py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[1.6rem] sm:text-[2rem]">{c.proofHeading}</h2>
          <Link href="/our-work" className="font-bold">
            All our work
          </Link>
        </div>
        <p className="mt-2 text-slate">{c.proofNote}</p>
        <div className="mt-5">
          <PhotoGrid photos={proof.map(photoByName)} />
        </div>
      </section>

      <Questions questions={c.questions} />
    </>
  );
}
