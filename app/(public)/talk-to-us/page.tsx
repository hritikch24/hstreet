import Link from 'next/link';
import { addressLine, hasStreetAddress, hoursText, profile, radius } from '@/business/profile';
import { contactPage } from '@/copy/pages';
import { firmNode, graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, Section } from '@/ui/blocks';
import { CallLink, ChatGlyph, PhoneGlyph, WhatsAppLink } from '@/ui/reach';

const c = contactPage();
export const metadata = pageMeta({ path: '/talk-to-us', title: c.title, description: c.description });

export default function TalkToUsPage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Talk to us', path: '/talk-to-us' },
  ];
  return (
    <>
      <JsonLd data={graph(pageNode({ path: '/talk-to-us', name: c.h1, description: c.description, type: 'ContactPage' }), firmNode(), trailNode('/talk-to-us', trail))} />
      <Opening trail={trail} h1={c.h1} answer={c.answer} />
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel p-5">
            <h2 className="text-[1.3rem]">WhatsApp</h2>
            <p className="mt-2">Best for a quote: send a photo of your shopfront.</p>
            <WhatsAppLink className="btn btn-wa mt-3">
              <ChatGlyph /> {profile.whatsapp.value.display}
            </WhatsAppLink>
          </div>
          <div className="panel p-5">
            <h2 className="text-[1.3rem]">Phone</h2>
            <p className="mt-2">Best for a repair, or anything urgent. We answer day and night.</p>
            <CallLink className="btn btn-accent mt-3">
              <PhoneGlyph /> {profile.phone.value.display}
            </CallLink>
          </div>
          <div className="panel p-5">
            <h2 className="text-[1.3rem]">Email</h2>
            <p className="mt-2">For drawings, landlord letters and paperwork.</p>
            <a href={`mailto:${profile.email.value}`} className="mt-3 inline-block font-bold break-all">
              {profile.email.value}
            </a>
          </div>
        </div>
      </Section>
      <Section heading="When are you open?" tone="deep">
        <ul className="grid max-w-md gap-1">
          {profile.hours.value.map((h) => (
            <li key={h.days} className="flex justify-between gap-4 border-b border-rule py-2">
              <span>{h.days}</span>
              <span className="font-bold">{hoursText(h)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-4 py-2">
            <span>Emergency repairs</span>
            <span className="font-bold">{profile.emergencyHours.value}</span>
          </li>
        </ul>
      </Section>
      <Section heading={hasStreetAddress() ? 'Where are you?' : 'Where we work'}>
        <p className="max-w-[68ch]">
          {hasStreetAddress() ? `${addressLine()}. ` : 'We are based in Birmingham and come to you. '}Installations go
          anywhere in the UK; repairs cover Birmingham and up to {radius()} miles from it. We speak{' '}
          {profile.languages.value.join(', ')}.
        </p>
        <p className="mt-4">
          <Link href="/get-a-quote" className="btn btn-accent">
            Get a quote
          </Link>
        </p>
      </Section>
    </>
  );
}
