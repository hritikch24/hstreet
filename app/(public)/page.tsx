import Image from 'next/image';
import Link from 'next/link';
import { profile, radius } from '@/business/profile';
import { home } from '@/copy/pages';
import { photoByName } from '@/copy/job-photos';
import { repairServices } from '@/copy/services';
import { faqNode, firmNode, graph, ownerNode, pageMeta, pageNode, siteNode } from '@/engine/search-meta';
import { JsonLd, PhotoGrid, Questions } from '@/ui/blocks';
import { CallbackBox } from '@/ui/CallbackBox';
import { InstallCards } from '@/ui/InstallCards';
import { PhotoForQuote } from '@/ui/reach';

export const metadata = pageMeta({ path: '/', title: home().title, description: home().description });

const HERO = 'black-aluminium-shopfront-parade-obscured-glass';
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

      {/* Hero: the work itself, full bleed, with the offer over it. */}
      <section className="relative overflow-hidden bg-navy text-cream">
        <div className="relative aspect-[16/10] sm:aspect-[16/8] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%]">
          <Image src={hero.file} alt={hero.alt} fill preload sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/35 lg:to-transparent" />
          <p className="absolute right-3 bottom-2 hidden rounded bg-navy-deep/70 px-2 py-1 text-xs text-cream/85 lg:block">
            Our work: {hero.caption.toLowerCase()}
          </p>
        </div>
        <div className="shell relative pt-2 pb-10 lg:flex lg:min-h-[38rem] lg:items-center lg:py-16">
          <div className="lg:w-[50%]">
            <p className="kicker text-cream/75">{c.kicker}</p>
            <h1 className="mt-3 text-[2.2rem] !text-cream sm:text-[3.2rem]">{c.h1}</h1>
            <p className="mt-4 max-w-[56ch] text-[1.125rem] text-cream/90">{c.answer}</p>
            <div className="mt-6">
              <PhotoForQuote tone="navy" />
            </div>
          </div>
        </div>
      </section>

      {/* Installs, shown with a real job photo each. */}
      <section className="shell py-12">
        <p className="kicker text-signal">Fitted anywhere in the UK</p>
        <h2 className="mt-2 text-[1.8rem] sm:text-[2.2rem]">{c.linesHeading}</h2>
        <div className="signrule" aria-hidden="true" />
        <div className="mt-7">
          <InstallCards
            extra={
              <Link
                href="/nationwide"
                className="lift flex h-full flex-col justify-between rounded-[10px] bg-navy p-5 text-cream no-underline"
              >
                <span>
                  <span className="sign block text-[1.4rem] !text-cream">Not in Birmingham?</span>
                  <span className="mt-2 block text-cream/90">
                    We fit anywhere in the UK. See how a price, survey and fit work when the team travels to you.
                  </span>
                </span>
                <span className="mt-4 font-bold text-cream underline">How UK-wide installs work</span>
              </Link>
            }
          />
        </div>
      </section>

      {/* Repairs: Birmingham only, said plainly. */}
      <section className="bg-signal text-white">
        <div className="shell grid gap-6 py-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="kicker text-white/80">Repairs and emergencies</p>
            <h2 className="mt-2 text-[1.8rem] !text-white sm:text-[2.2rem]">Birmingham and up to {radius()} miles</h2>
            <p className="mt-3 max-w-[52ch] text-white/95">
              Stuck shutters, broken glass, doors that won’t lock. We aim to reach an emergency{' '}
              {profile.response.value.emergency}. We don’t do repairs anywhere else.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {repairServices().map((s) => (
              <li key={s.path}>
                <Link href={s.path} className="lift block h-full rounded-[10px] bg-white p-4 text-ink no-underline">
                  <span className="sign block text-[1.15rem]">{s.name}</span>
                  <span className="mt-1 block text-[0.95rem]">{s.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How a remote price works: a numbered run, not a row of boxes. */}
      <section className="shell py-12">
        <h2 className="text-[1.8rem] sm:text-[2.2rem]">{c.howHeading}</h2>
        <div className="signrule" aria-hidden="true" />
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {c.how.map((h, i) => (
            <li key={h.step} className="border-t-4 border-navy pt-4">
              <span className="sign text-[2.4rem] leading-none text-signal">{i + 1}</span>
              <h3 className="mt-2 text-[1.15rem]">{h.step}</h3>
              <p className="mt-1">{h.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          <Link href="/guides/photograph-and-measure-your-shopfront" className="btn btn-plain">
            Which photos and measurements to send
          </Link>
        </p>
      </section>

      <section className="bg-cream-deep py-12">
        <div className="shell">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[1.8rem] sm:text-[2.2rem]">{c.proofHeading}</h2>
            <Link href="/our-work" className="font-bold">
              All our work
            </Link>
          </div>
          <div className="signrule" aria-hidden="true" />
          <p className="mt-3 text-slate">{c.proofNote}</p>
          <div className="mt-6">
            <PhotoGrid photos={proof.map(photoByName)} />
          </div>
        </div>
      </section>

      <section className="bg-navy py-10 text-cream">
        <div className="shell grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="text-[1.8rem] !text-cream sm:text-[2.2rem]">Not sure what you need?</h2>
            <p className="mt-3 max-w-[52ch] text-cream/90">
              Tell us where the shop is and we will ring you to talk it through: a new front, a shutter, a door, or a
              repair in Birmingham. No obligation, and no hard sell.
            </p>
          </div>
          <CallbackBox job="install" service="not-sure" tone="navy" heading="Ask us to call you" />
        </div>
      </section>

      <div className="py-4">
        <Questions questions={c.questions} heading="Questions shop owners ask first" />
      </div>
    </>
  );
}
