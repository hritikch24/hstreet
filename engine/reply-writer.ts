/**
 * Drafts a reply to an enquiry for the owner to edit and send themselves.
 * Nothing is sent to the customer automatically.
 *
 * Calls the Claude Messages API with plain fetch (no SDK, to keep the
 * dependency list to the core stack). Needs ANTHROPIC_API_KEY.
 */
import { priceRange, profile, radius } from '@/business/profile';
import { serviceLabel } from '@/engine/enquiry-shape';

export const DRAFT_MODEL = 'claude-opus-5-5';

export interface DraftSubject {
  ref: string;
  jobType: string;
  service: string;
  place: string;
  town: string | null;
  inRepairArea: boolean | null;
  milesFromBase: number | null;
  wants: string;
  name: string;
  message: string | null;
  photoCount: number;
}

function facts(): string {
  return [
    `Business: ${profile.name}. ${profile.oneLiner}`,
    `Installations (new shopfronts, shutters, automatic doors, steel and aluminium doors) are fitted anywhere in the UK.`,
    `Repairs and emergency callouts are ONLY within ${radius()} miles of Birmingham. Never offer a repair outside that.`,
    `Price ranges (only quote these, as ranges, and say a survey confirms the price):`,
    `  aluminium shopfront ${priceRange('shopfront')}; manual shutter ${priceRange('shutterManual')}; electric shutter ${priceRange('shutterElectric')};`,
    `  automatic doors ${priceRange('autoDoors')}; steel door ${priceRange('steelDoor')}; aluminium door ${priceRange('aluminiumDoor')};`,
    `  shutter repair ${priceRange('shutterRepair')}; emergency callout ${priceRange('emergencyCallout')}; glass pane ${priceRange('glassPane')}; lock repair ${priceRange('lockRepair')}.`,
    `Emergency response aim: ${profile.response.value.emergency}. Other repairs: ${profile.response.value.standard}.`,
  ].join('\n');
}

const SYSTEM = `You draft short replies from a Birmingham shopfront and shutter fitter to customers who sent an enquiry. The owner reads, edits and sends the draft themselves.

Write in plain British English, the way a tradesperson talks to a shop owner: friendly, direct, no marketing language, no exclamation marks. Many customers read English as a second language, so use short sentences and common words.

Only use the facts given. Never invent prices, dates, guarantees, availability or anything about the customer's shop. If something is unknown, ask the customer for it (usually a photo of the shopfront and the rough width of the opening). Never promise a repair outside the repair area.

Return only the message text, with no subject line and no notes to the owner.`;

export async function draftReply(e: DraftSubject, channel: 'whatsapp' | 'email'): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ok: false, error: 'ANTHROPIC_API_KEY is not set.' };

  const enquiry = [
    `Reference: ${e.ref}`,
    `Customer name: ${e.name}`,
    `Type: ${e.jobType === 'repair' ? 'repair' : 'new installation'} (${serviceLabel(e.service)})`,
    `Where: ${e.place}${e.town ? ` (${e.town})` : ''}`,
    e.milesFromBase !== null ? `Straight-line distance from base: ${e.milesFromBase} miles` : 'Distance: unknown',
    e.jobType === 'repair'
      ? `Inside repair area: ${e.inRepairArea === null ? 'unknown, check' : e.inRepairArea ? 'yes' : 'no'}`
      : '',
    `They asked for: ${e.wants === 'callback' ? 'a callback' : 'a quote'}`,
    `Photos attached: ${e.photoCount}`,
    `Their message: ${e.message ?? '(none)'}`,
  ]
    .filter(Boolean)
    .join('\n');

  const shape =
    channel === 'whatsapp'
      ? 'Write a WhatsApp message: under 90 words, no greeting line longer than "Hi <first name>,", sign off with the business name.'
      : 'Write an email body: under 160 words, greet by first name, sign off with the business name.';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'server-side-fallback-2026-07-01',
      },
      body: JSON.stringify({
        model: DRAFT_MODEL,
        max_tokens: 16000,
        fallbacks: 'default',
        output_config: { effort: 'low' },
        system: SYSTEM,
        messages: [
          {
            role: 'user',
            content: `Business facts:\n${facts()}\n\nEnquiry:\n${enquiry}\n\n${shape}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) return { ok: false, error: `Claude API returned ${res.status}` };
    const data = (await res.json()) as { stop_reason?: string; content?: { type: string; text?: string }[] };
    if (data.stop_reason === 'refusal') return { ok: false, error: 'The model declined to draft this one. Write it by hand.' };
    const text = (data.content ?? [])
      .filter((b) => b.type === 'text' && b.text)
      .map((b) => b.text)
      .join('\n')
      .trim();
    return text ? { ok: true, text } : { ok: false, error: 'Empty draft returned.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Request failed' };
  }
}
