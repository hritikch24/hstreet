/**
 * Is a job inside the Birmingham repair radius?
 *
 * Accepts a full postcode, an outcode (e.g. "B23") or a place name, looks it
 * up on postcodes.io (free, no key), and measures straight-line miles from
 * the base in business/profile.ts. If the lookup fails, the answer is
 * "unknown" and the enquiry is accepted and flagged for the owner to check,
 * rather than turning a customer away on a guess.
 */
import { profile, radius } from '@/business/profile';

export interface Reach {
  status: 'inside' | 'outside' | 'unknown';
  miles?: number;
  town?: string;
  region?: string;
  postcode?: string;
}

const FULL = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;
const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/i;

function miles(lat: number, lng: number): number {
  const { lat: bLat, lng: bLng } = profile.base.value;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat - bLat);
  const dLng = rad(lng - bLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(bLat)) * Math.cos(rad(lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

async function lookup(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(4000), headers: { accept: 'application/json' } });
  if (!res.ok) return null;
  return ((await res.json()) as { result?: unknown }).result ?? null;
}

type Located = { lat: number; lng: number; town?: string; region?: string; postcode?: string };

async function locate(input: string): Promise<Located | null> {
  const q = input.trim();
  const full = q.match(FULL);
  if (full) {
    const r = (await lookup(`https://api.postcodes.io/postcodes/${encodeURIComponent(full[1] + full[2])}`)) as {
      latitude: number;
      longitude: number;
      admin_district?: string;
      region?: string;
      postcode: string;
    } | null;
    if (r?.latitude) return { lat: r.latitude, lng: r.longitude, town: r.admin_district, region: r.region, postcode: r.postcode };
  }
  if (OUTCODE.test(q)) {
    const r = (await lookup(`https://api.postcodes.io/outcodes/${encodeURIComponent(q)}`)) as {
      latitude: number;
      longitude: number;
      admin_district?: string[];
    } | null;
    if (r?.latitude) return { lat: r.latitude, lng: r.longitude, town: r.admin_district?.[0], postcode: q.toUpperCase() };
  }
  const r = (await lookup(`https://api.postcodes.io/places?limit=1&q=${encodeURIComponent(q)}`)) as {
    latitude: number;
    longitude: number;
    name_1?: string;
    region?: string;
  }[] | null;
  const place = r?.[0];
  if (place?.latitude) return { lat: place.latitude, lng: place.longitude, town: place.name_1, region: place.region };
  return null;
}

export async function reachOf(input: string): Promise<Reach> {
  if (!input || input.trim().length < 2) return { status: 'unknown' };
  try {
    const at = await locate(input);
    if (!at) return { status: 'unknown' };
    const m = Math.round(miles(at.lat, at.lng) * 10) / 10;
    return {
      status: m <= radius() ? 'inside' : 'outside',
      miles: m,
      town: at.town,
      region: at.region,
      postcode: at.postcode,
    };
  } catch {
    return { status: 'unknown' };
  }
}
