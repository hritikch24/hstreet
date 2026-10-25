import Link from 'next/link';
import { known, profile } from '@/business/profile';
import { firmPage } from '@/copy/pages';
import { firmNode, graph, ownerNode, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, Section, TwoAreas } from '@/ui/blocks';

const c = firmPage();
export const metadata = pageMeta({ path: '/the-firm', title: c.title, description: c.description });

export default function FirmPage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'The firm', path: '/the-firm' },
  ];
  const owner = known(profile.owner);
  const team = known(profile.team) ?? [];
  return (
    <>
      <JsonLd data={graph(pageNode({ path: '/the-firm', name: c.h1, description: c.description, type: 'AboutPage' }), firmNode(), ownerNode(), trailNode('/the-firm', trail))} />
      <Opening trail={trail} h1={c.h1} answer={c.answer} />

      <Section heading={c.ownerHeading}>
        {owner ? (
          <div className="plate max-w-2xl p-5">
            <p className="sign text-[1.4rem]">{owner.name}</p>
            <p className="mt-1">{owner.trade}</p>
            {team.length > 0 && (
              <ul className="prose-shop mt-4">
                {team.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="max-w-[68ch]">
            This website is run by {profile.legalName}, a private limited company registered in England and Wales,
            company number {profile.companyNumber.value}. Registered office: {profile.registeredOffice}.
          </p>
        )}
      </Section>

      <Section heading="Two services, two areas" tone="deep">
        <TwoAreas />
      </Section>

      <Section heading={c.howHeading}>
        <ul className="prose-shop max-w-[68ch]">
          {c.how.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Section>

      <Section heading={c.notHeading}>
        <ul className="prose-shop max-w-[68ch]">
          {c.not.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/talk-to-us" className="font-bold">
            Phone, WhatsApp and opening hours
          </Link>
        </p>
      </Section>
    </>
  );
}
