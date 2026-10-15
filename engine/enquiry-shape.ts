/**
 * The rules for a valid enquiry, shared by the form (for instant feedback)
 * and the API (which is the authority). No server-only imports here.
 */
export const JOB_TYPES = ['install', 'repair'] as const;
export type JobType = (typeof JOB_TYPES)[number];

/** `garage` choices are offered only while the garage pages are live; the API accepts them either way. */
export const SERVICE_CHOICES: Record<JobType, { value: string; label: string; garage?: true }[]> = {
  install: [
    { value: 'aluminium-shopfront', label: 'New aluminium shopfront' },
    { value: 'roller-shutter', label: 'New roller shutter' },
    { value: 'automatic-doors', label: 'Automatic doors' },
    { value: 'security-door', label: 'Steel security or fire-exit door' },
    { value: 'aluminium-door', label: 'Aluminium door' },
    { value: 'garage-door-install', label: 'New garage door', garage: true },
    { value: 'not-sure', label: 'Not sure yet' },
  ],
  repair: [
    { value: 'shutter-repair', label: 'Shutter repair' },
    { value: 'glass', label: 'Broken glass' },
    { value: 'door-or-lock', label: 'Door, lock or closer' },
    { value: 'garage-door-repair', label: 'Garage door repair', garage: true },
    { value: 'emergency', label: 'Emergency: shop can’t be locked' },
  ],
};

export const isGarageService = (value: string) => value.startsWith('garage-door-');

export const DOOR_KINDS = [
  { value: 'roller', label: 'Roller' },
  { value: 'sectional', label: 'Sectional (panels up under the roof)' },
  { value: 'up-and-over', label: 'Up-and-over (one leaf)' },
  { value: 'side-hinged', label: 'Side-hinged (two leaves)' },
  { value: 'not-sure', label: 'Not sure' },
] as const;

export const TIMINGS = [
  { value: 'now', label: 'As soon as possible' },
  { value: 'month', label: 'Within a month' },
  { value: 'later', label: 'Just pricing it up' },
] as const;

export const MAX_PHOTOS = 3;
export const MAX_PHOTO_BYTES = 1_400_000;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface EnquiryInput {
  jobType: JobType;
  service: string;
  place: string;
  name: string;
  phone: string;
  email?: string;
  contactBy: 'phone' | 'whatsapp' | 'email';
  message?: string;
  wants: 'quote' | 'callback';
  /** Garage enquiries only. */
  doorType?: string;
  timing?: string;
}

export type Problems = Partial<Record<keyof EnquiryInput | 'photos', string>>;

const PHONE = /^\+?[\d\s()-]{10,18}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function checkEnquiry(raw: Record<string, unknown>): { ok: true; value: EnquiryInput } | { ok: false; problems: Problems } {
  const s = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '');
  const problems: Problems = {};
  const jobType = s('jobType') as JobType;
  if (!JOB_TYPES.includes(jobType)) problems.jobType = 'Choose a new installation or a repair.';
  const service = s('service');
  if (JOB_TYPES.includes(jobType) && !SERVICE_CHOICES[jobType].some((c) => c.value === service))
    problems.service = 'Choose what you need.';
  const place = s('place');
  if (place.length < 2 || place.length > 80) problems.place = 'Give the town or postcode of the shop.';
  const name = s('name');
  if (name.length < 2 || name.length > 80) problems.name = 'Tell us your name.';
  const phone = s('phone');
  if (!PHONE.test(phone) || phone.replace(/\D/g, '').length < 10) problems.phone = 'Give a phone number we can call.';
  const email = s('email');
  if (email && !EMAIL.test(email)) problems.email = 'That email address doesn’t look right.';
  const contactBy = (['phone', 'whatsapp', 'email'].includes(s('contactBy')) ? s('contactBy') : 'phone') as EnquiryInput['contactBy'];
  if (contactBy === 'email' && !email) problems.email = 'Add an email address, or choose phone or WhatsApp.';
  const message = s('message');
  if (message.length > 2000) problems.message = 'Please keep the message under 2,000 characters.';
  const wants = s('wants') === 'callback' ? 'callback' : 'quote';
  // Optional fixed choices: an unknown value is dropped, not an error.
  const doorType = isGarageService(service) && DOOR_KINDS.some((d) => d.value === s('doorType')) ? s('doorType') : undefined;
  const timing = TIMINGS.some((t) => t.value === s('timing')) ? s('timing') : undefined;

  if (Object.keys(problems).length) return { ok: false, problems };
  return {
    ok: true,
    value: { jobType, service, place, name, phone, email: email || undefined, contactBy, message: message || undefined, wants, doorType, timing },
  };
}

export const doorLabel = (value?: string) => DOOR_KINDS.find((d) => d.value === value)?.label;
export const timingLabel = (value?: string) => TIMINGS.find((t) => t.value === value)?.label;

export const serviceLabel = (value: string) =>
  [...SERVICE_CHOICES.install, ...SERVICE_CHOICES.repair].find((c) => c.value === value)?.label ?? value;
