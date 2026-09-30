import { absolute, known, priceRange, profile, radius } from '@/business/profile';
import { guides } from '@/copy/guides';
import { repairAreas } from '@/copy/repair-areas';
import { installServices, repairServices } from '@/copy/services';

export const dynamic = 'force-static';

/**
 * A plain summary for answer engines: this business's own facts and key
 * pages, from the same config as the site. Contact details appear only once
 * they are confirmed.
 */
export function GET() {
  const phone = known(profile.phone);
  const address = known(profile.address);
  const email = known(profile.email);
  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.oneLiner}`,
    '',
    '## Facts',
    `- Based in Birmingham, England.${address ? ` Address: ${[address.street, address.locality, address.city, address.postcode].filter(Boolean).join(', ')}.` : ''}`,
    '- New installations (aluminium shopfronts, roller shutters, automatic doors, steel security and fire-exit doors, aluminium doors): anywhere in the UK.',
    `- Repairs and emergency callouts (shutters, shopfront glass, locks and doors): Birmingham and up to ${radius()} miles only, including ${repairAreas().map((a) => a.name).join(', ')}.`,
    ...(phone ? [`- Phone: ${phone.display}`] : []),
    ...(email ? [`- Email: ${email}`] : []),
    ...(known(profile.prices)
      ? [`- Typical prices: aluminium shopfront ${priceRange('shopfront')}; manual roller shutter ${priceRange('shutterManual')}; shutter repair ${priceRange('shutterRepair')}.`]
      : []),
    '',
    '## Installed UK-wide',
    ...installServices().map((s) => `- [${s.name}](${absolute(s.path)}): ${s.summary}`),
    `- [How UK-wide installation works](${absolute('/nationwide')})`,
    '',
    '## Repairs in Birmingham',
    ...repairServices().map((s) => `- [${s.name}](${absolute(s.path)}): ${s.summary}`),
    `- [Repairs and emergency callouts](${absolute('/repairs')})`,
    '',
    '## Guides',
    ...guides().map((g) => `- [${g.h1}](${absolute(`/guides/${g.slug}`)})`),
    '',
    '## More',
    `- [Full text of every answer on this site](${absolute('/llms-full.txt')})`,
    '',
    '## Other pages',
    `- [Prices](${absolute('/prices')})`,
    `- [Our work](${absolute('/our-work')})`,
    `- [The firm](${absolute('/the-firm')})`,
    `- [Get a quote](${absolute('/get-a-quote')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
