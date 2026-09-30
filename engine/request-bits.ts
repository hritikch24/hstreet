/**
 * What a request tells us about where it came from, trimmed to what the
 * dashboards need. IP addresses are shortened before they are stored.
 */
export function geo(headers: Headers) {
  const country = headers.get('x-vercel-ip-country') || null;
  const rawCity = headers.get('x-vercel-ip-city');
  let city: string | null = null;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }
  return { country, city: city ? city.slice(0, 80) : null };
}

export function ipPrefix(headers: Headers): string | null {
  const ip = (headers.get('x-forwarded-for')?.split(',')[0] ?? headers.get('x-real-ip') ?? '').trim();
  if (!ip) return null;
  if (ip.includes('.')) {
    const parts = ip.split('.');
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : null;
  }
  if (ip.includes(':')) return `${ip.split(':').slice(0, 3).join(':')}::/48`;
  return null;
}

export const clip = (v: unknown, n: number): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s.slice(0, n) : null;
};

/** Paths never counted as visits. */
export const isPrivatePath = (path: string) => path.startsWith('/hq') || path.startsWith('/api');
