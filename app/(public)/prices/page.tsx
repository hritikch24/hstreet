import Link from 'next/link';
import { priceBasis, priceRange, profile, vatNote, type PriceKey } from '@/business/profile';
import { pricesPage } from '@/copy/pages';
import { graph, pageMeta, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, Section } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

const c = pricesPage();
export const metadata = pageMeta({ path: '/prices', title: c.title, description: c.description });

const installRows: { key: PriceKey; name: string; href: string; lead: string }[] = [
  { key: 'shopfront', name: 'Aluminium shopfront', href: '/aluminium-shopfronts', lead: profile.leadTimes.value.shopfront },
  { key: 'shutterManual', name: 'Roller shutter, manual', href: '/roller-shutters', lead: profile.leadTimes.value.shutter },
  { key: 'shutterElectric', name: 'Roller shutter, electric', href: '/roller-shutters', lead: profile.leadTimes.value.shutter },
  { key: 'autoDoors', name: 'Automatic sliding doors', href: '/automatic-doors', lead: profile.leadTimes.value.autoDoors },
  { key: 'steelDoor', name: 'Steel security door', href: '/security-doors', lead: profile.leadTimes.value.steelDoor },
  { key: 'fireExitPair', name: 'Double fire-exit doors', href: '/security-doors', lead: profile.leadTimes.value.steelDoor },
  { key: 'aluminiumDoor', name: 'Aluminium door', href: '/aluminium-doors', lead: profile.leadTimes.value.aluminiumDoor },
];

const repairRows: { key: PriceKey; name: string; href: string }[] = [
  { key: 'shutterRepair', name: 'Shutter repair', href: '/shutter-repairs' },
  { key: 'emergencyCallout', name: 'Emergency callout', href: '/repairs' },
  { key: 'glassPane', name: 'Replacement glass', href: '/shopfront-glass' },
  { key: 'lockRepair', name: 'Door, lock and closer repair', href: '/lock-and-door-repairs' },
];

function PriceTable({ rows, lead }: { rows: { key: PriceKey; name: string; href: string; lead?: string }[]; lead: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-navy text-sm uppercase tracking-wider text-slate">
            <th className="py-2 pr-4">Job</th>
            <th className="py-2 pr-4">Price range</th>
            <th className="py-2 pr-4">{lead}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-rule align-top">
              <td className="py-3 pr-4">
                <Link href={r.href} className="font-bold">
                  {r.name}
                </Link>
                <span className="block text-sm text-slate">{priceBasis(r.key)}</span>
              </td>
              <td className="py-3 pr-4 font-bold whitespace-nowrap text-navy">{priceRange(r.key)}</td>
              <td className="py-3 pr-4">{r.lead ?? profile.response.value.standard}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PricesPage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Prices', path: '/prices' },
  ];
  return (
    <>
      <JsonLd data={graph(trailNode('/prices', trail))} />
      <Opening trail={trail} h1={c.h1} answer={`${c.answer} ${vatNote()}`} />
      <Section heading={c.installHeading}>
        <PriceTable rows={installRows} lead="Order to fitted" />
      </Section>
      <Section heading={c.repairHeading} tone="deep">
        <PriceTable rows={repairRows} lead="Usual response" />
      </Section>
      <Section heading={c.movesHeading}>
        <ul className="prose-shop max-w-[68ch]">
          {c.moves.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="mt-8 max-w-2xl">
          <PhotoForQuote />
        </div>
      </Section>
    </>
  );
}
