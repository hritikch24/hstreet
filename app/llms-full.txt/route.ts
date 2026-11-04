import { absolute, profile } from '@/business/profile';
import { allGuides } from '@/copy/guides';
import { installCities } from '@/copy/install-cities';
import { home, nationwide, repairsHub } from '@/copy/pages';
import { repairAreas } from '@/copy/repair-areas';
import { publishedGaragePages, services, type QA } from '@/copy/services';
import { publishedCitySlugs } from '@/engine/route-plan';

export const dynamic = 'force-static';

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
const qa = (list: QA[]) =>
  list.flatMap((q) => [`### ${q.q}`, ...q.a.map(plain), ...(q.list ?? []).map((l) => `- ${plain(l)}`), '']);

/**
 * Every answer on the site as plain text, grouped by page, for answer
 * engines that prefer one document. Built from the same copy as the pages.
 */
export function GET() {
  const cities = publishedCitySlugs();
  const out: string[] = [
    `# ${profile.name}: full answers`,
    '',
    `> ${profile.oneLiner}`,
    '',
    `Copy reviewed ${profile.copyReviewedOn}. Source pages are linked under each heading.`,
    '',
    `## Home (${absolute('/')})`,
    home().answer,
    '',
    ...qa(home().questions),
  ];
  for (const s of [...services(), ...publishedGaragePages()]) {
    out.push(`## ${s.name} (${absolute(s.path)})`, s.answer, '');
    for (const t of s.compare ?? []) {
      out.push(`### ${t.caption}`, `| ${t.head.map((h) => h || ' ').join(' | ')} |`, `|${t.head.map(() => ' --- ').join('|')}|`);
      for (const r of t.rows) out.push(`| ${r.join(' | ')} |`);
      out.push('');
    }
    out.push(...qa(s.questions));
  }
  out.push(`## UK-wide installation (${absolute('/nationwide')})`, nationwide().answer, '', ...qa(nationwide().questions));
  out.push(`## Repairs in Birmingham (${absolute('/repairs')})`, repairsHub().answer, '');
  for (const a of repairAreas()) out.push(`## Repairs in ${a.name} (${absolute(`/repairs/${a.slug}`)})`, a.answer, '', ...qa(a.questions));
  for (const c of installCities().filter((x) => cities.includes(x.slug))) {
    out.push(`## Installing in ${c.name} (${absolute(`/nationwide/${c.slug}`)})`, c.survey, ...c.onTheGround.map((l) => `- ${l}`), '', ...qa(c.questions));
  }
  for (const g of allGuides()) {
    out.push(`## ${g.h1} (${absolute(`/guides/${g.slug}`)})`, g.answer, '');
    for (const sec of g.sections) out.push(`### ${sec.heading}`, ...sec.paras.map(plain), ...(sec.steps ?? []).map((st, i) => `${i + 1}. ${st}`), '');
  }
  return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
