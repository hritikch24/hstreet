import Image from 'next/image';
import Link from 'next/link';
import { profile, radius } from '@/business/profile';
import { home } from '@/copy/pages';
import { photoByName } from '@/copy/job-photos';
import { faqNode, firmNode, graph, ownerNode, pageMeta, pageNode, siteNode } from '@/engine/search-meta';
import { JsonLd, PhotoGrid, Questions } from '@/ui/blocks';
import { CallbackBox } from '@/ui/CallbackBox';
import { InstallCards, RepairList } from '@/ui/InstallCards';
import { PhotoForQuote } from '@/ui/reach';

export const metadata = pageMeta({ path: '/', title: home().title, description: home().description });

const HERO = 'black-aluminium-shopfront-parade-obscured-glass';
const proof = [
  'black-frontage-sliding-doors-shutter-box',
  'automatic-sliding-doors-convenience-store-aisles',
  'purple-roller-shutter-closed',
  'black-steel-double-fire-exit-doors',
  'white-aluminium-double-panel-doors',
  'aluminium-glazing-sliding-doors-new-unit-night',
];

export default function HomePage() {
  const c = home();
  const hero = photoByName(HERO);
  return (
    <>
      <JsonLd
        data={graph(
          pageNode({ path: '/', name: c.title, description: c.description, image: hero.file }),
          firmNode(),
          siteNode(),
          ownerNode(),
          faqNode('/', c.questions),
        )}
      />

      {/* Hero: a large headline beside one photograph of our own work. */}
      <section className="shell grid gap-12 pt-10 pb-14 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-16 lg:pt-16 lg:pb-20">
        <div>
          <p className="kicker text-accent">{c.kicker}</p>
          <h1 className="mt-5 text-[2.7rem] leading-[1.02] sm:text-[4rem] lg:text-[4.6rem]">{c.h1}</h1>
          <p className="mt-7 max-w-[48ch] text-[1.15rem] leading-relaxed text-ink-soft sm:text-[1.25rem]">{c.answer}</p>
          <div className="mt-9 max-w-xl">
            <PhotoForQuote />
          </div>
        </div>
        <figure>
          <div className="zoom">
            <Image
              src={hero.file}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              preload
              sizes="(min-width: 1024px) 520px, 100vw"
              className="aspect-[4/5] h-auto w-full object-cover"
            />
          </div>
          <figcaption className="flex justify-between gap-4 pt-3 text-[0.85rem] text-slate">
            <span>{hero.caption}</span>
            <Link href="/our-work" className="shrink-0 text-slate">
              Our work
            </Link>
          </figcaption>
        </figure>
      </section>

      {/* Three plain facts, as a ruled row. */}
      <section className="shell">
        <dl className="grid border-t border-ink md:grid-cols-3">
          {[
            ['Installed UK-wide', 'Priced from your photos and surveyed before anything is made.'],
            [`Repairs within ${radius()} miles`, 'Shutters, glass, locks and doors, from Birmingham.'],
            ['Emergency line, 24 hours', 'Answered every day of the year.'],
          ].map(([t, d], i) => (
            <div
              key={t}
              className={`border-b border-rule py-7 md:pr-8 ${i > 0 ? 'md:border-l md:pl-8' : ''}`}
            >
              <dt className="font-serif text-[1.5rem] leading-tight">{t}</dt>
              <dd className="mt-2 text-slate">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Installs, shown with a real job photo each. */}
      <section className="shell pt-24 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <p className="kicker text-accent">Fitted anywhere in the UK</p>
            <h2 className="mt-3 text-[2.2rem] sm:text-[3rem]">{c.linesHeading}</h2>
          </div>
          <p className="max-w-[38ch] text-slate">
            Every price is a guide to give you an idea. We confirm yours in writing before any work starts.
          </p>
        </div>
        <div className="mt-12">
          <InstallCards />
        </div>
        <p className="mt-12 border-t border-rule pt-6 text-ink-soft">
          Not in Birmingham? We fit anywhere in the UK.{' '}
          <Link href="/nationwide" className="font-semibold">
            How a UK-wide job works
          </Link>
        </p>
      </section>

      {/* Repairs: the radius, said plainly. */}
      <section className="mt-24 bg-ink text-stone">
        <div className="shell grid gap-14 py-20 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20 lg:py-24">
          <div>
            <p className="kicker text-accent-soft">Repairs and emergencies</p>
            <h2 className="mt-4 text-[2.2rem] !text-stone sm:text-[3rem]">Birmingham and up to {radius()} miles</h2>
            <p className="mt-5 max-w-[46ch] text-stone/75">
              Stuck shutters, broken glass, automatic doors that won’t open, doors that won’t lock. The emergency line is
              answered day and night, and we aim to reach you {profile.response.value.emergency}. Further out than that we
              don’t take repairs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/repairs" className="btn bg-stone text-ink hover:bg-white">
                Repairs and emergencies
              </Link>
              <Link href="/get-a-quote?job=repair" className="btn border border-stone/50 text-stone hover:bg-stone/10">
                Book a repair
              </Link>
            </div>
          </div>
          <RepairList />
        </div>
      </section>

      {/* How a remote price works: a numbered run, not a row of boxes. */}
      <section className="shell py-24">
        <h2 className="text-[2.2rem] sm:text-[3rem]">{c.howHeading}</h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {c.how.map((h, i) => (
            <li key={h.step} className="border-t border-ink pt-5 lg:pr-8 lg:[&:not(:first-child)]:pl-8 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-rule">
              <span className="font-serif text-[2.8rem] leading-none text-accent">{i + 1}</span>
              <h3 className="mt-3 text-[1.1rem]">{h.step}</h3>
              <p className="mt-1 text-slate">{h.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10">
          <Link href="/guides/photograph-and-measure-your-shopfront" className="btn btn-plain">
            Which photos and measurements to send
          </Link>
        </p>
      </section>

      <section className="bg-stone-deep py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[2.2rem] sm:text-[3rem]">{c.proofHeading}</h2>
            <Link href="/our-work" className="font-semibold">
              All our work
            </Link>
          </div>
          <p className="mt-3 max-w-[60ch] text-slate">{c.proofNote}</p>
          <div className="mt-10">
            <PhotoGrid photos={proof.map(photoByName)} />
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-stone">
        <div className="shell grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="text-[2rem] !text-stone sm:text-[2.6rem]">Not sure what you need?</h2>
            <p className="mt-3 max-w-[52ch] text-stone/75">
              Tell us where the shop is and we will ring you to talk it through: a new front, a shutter, a door, or a
              repair. No obligation, and no hard sell.
            </p>
          </div>
          <CallbackBox job="install" service="not-sure" tone="ink" heading="Ask us to call you" />
        </div>
      </section>

      <div className="py-10">
        <Questions questions={c.questions} heading="Questions shop owners ask first" />
      </div>
    </>
  );
}
