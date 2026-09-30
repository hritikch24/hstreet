import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { PASS_COOKIE, passIsValid } from '@/engine/hq-gate';

/**
 * Second lock behind the proxy: every /hq page and /api/hq handler checks the
 * pass cookie itself, so a proxy misconfiguration can't expose the back office.
 */
export async function hqAllowed(): Promise<boolean> {
  return passIsValid((await cookies()).get(PASS_COOKIE)?.value);
}

export async function requireHqPage(): Promise<void> {
  if (!(await hqAllowed())) notFound();
}

export const hidden = () => new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } });

/** Redirect back to a back-office page after a form post. */
export const back = (request: Request, path: string) =>
  Response.redirect(new URL(path, request.url), 303);
