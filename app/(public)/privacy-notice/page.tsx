import { profile } from '@/business/profile';
import { privacyPage } from '@/copy/pages';
import { pageMeta } from '@/engine/search-meta';
import { Opening, Section } from '@/ui/blocks';
import { CountingSwitch } from '@/ui/CountingSwitch';

const c = privacyPage();
export const metadata = pageMeta({ path: '/privacy-notice', title: c.title, description: c.description });

export default function PrivacyPage() {
  return (
    <>
      <Opening
        h1={c.h1}
        answer={`${profile.name} records how the site is used, and what you tell us in an enquiry, so we can price and do the job. We don’t sell it, and we don’t use advertising cookies unless we add them later and ask you first.`}
      />
      <Section heading="Who is responsible for your information">
        <div className="prose-shop max-w-[68ch]">
          <p>
            {profile.legalName}, company number {profile.companyNumber.value}, registered in England and Wales.
            Registered office: {profile.registeredOffice}. You can reach us at{' '}
            <a href={`mailto:${profile.email.value}`}>{profile.email.value}</a>.
          </p>
        </div>
      </Section>
      <Section heading="When you visit" tone="deep">
        <div className="prose-shop max-w-[68ch]">
          <p>
            Each page view is counted on our own server: the page, where you came from, campaign tags in the link,
            your device and browser type, and the country and city worked out from your connection. The last part of
            your IP address is removed before anything is stored. A random visit number is kept in your browser tab
            until you close it, so we can tell one visit from many.
          </p>
          <p>We also count taps on our phone number and WhatsApp links, to see which pages lead to a call.</p>
        </div>
        <div className="mt-5">
          <CountingSwitch />
        </div>
      </Section>
      <Section heading="When you send an enquiry">
        <div className="prose-shop max-w-[68ch]">
          <p>
            We keep your name, phone number, email if you give one, the town or postcode of the job, what you need,
            your message and any photos you attach. We use them to reply, price and do the work, and we keep them
            for as long as we might need them for the job, its paperwork and any later question about the work.
          </p>
          <p>An email copy of each enquiry goes to us through our email provider.</p>
        </div>
      </Section>
      <Section heading="Your rights" tone="deep">
        <div className="prose-shop max-w-[68ch]">
          <p>
            You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email{' '}
            <a href={`mailto:${profile.email.value}`}>{profile.email.value}</a>. If you are unhappy with how we
            handle it, you can complain to the Information Commissioner’s Office.
          </p>
        </div>
      </Section>
    </>
  );
}
