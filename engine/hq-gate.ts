/**
 * Access to the back office (/hq) and its API (/api/hq/*).
 *
 *  - Open /hq?key=<HQ_KEY> once. The proxy checks it, sets an HttpOnly pass
 *    cookie and redirects to /hq without the key in the address bar.
 *  - Without a valid pass, /hq and /api/hq answer 404, as if they didn't exist.
 *  - /api/hq/stats also accepts `Authorization: Bearer <HQ_STATS_TOKEN>`, for
 *    the owner's combined metrics dashboard.
 *
 * Uses Web Crypto only, so it runs in the proxy and in route handlers alike.
 */
export const PASS_COOKIE = 'hss_hq_pass';

const enc = new TextEncoder();

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison of two strings. */
export function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passFor(key: string): Promise<string> {
  return hmacHex(key, 'hss-hq-pass-v1');
}

export async function keyIsRight(given: string | null): Promise<boolean> {
  const key = process.env.HQ_KEY;
  if (!key || key.length < 16 || !given) return false;
  return same(await passFor(given), await passFor(key));
}

export async function passIsValid(cookie: string | undefined): Promise<boolean> {
  const key = process.env.HQ_KEY;
  if (!key || key.length < 16 || !cookie) return false;
  return same(cookie, await passFor(key));
}

export function bearerIsValid(header: string | null): boolean {
  const token = process.env.HQ_STATS_TOKEN;
  if (!token || token.length < 16 || !header) return false;
  const [scheme, value] = header.split(' ');
  return scheme === 'Bearer' && !!value && same(value, token);
}

export const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow' };
