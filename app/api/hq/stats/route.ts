import { cookies } from 'next/headers';
import { bearerIsValid, NOINDEX, PASS_COOKIE, passIsValid } from '@/engine/hq-gate';
import { hoursFrom, statsPayload } from '@/engine/stats';

/**
 * Metrics JSON for the owner's combined dashboard (Bearer HQ_STATS_TOKEN),
 * or for the back office itself (pass cookie). Same shape as the owner's
 * other sites' metrics endpoints.
 */
export async function GET(request: Request) {
  const viaBearer = bearerIsValid(request.headers.get('authorization'));
  const viaCookie = await passIsValid((await cookies()).get(PASS_COOKIE)?.value);
  if (!viaBearer && !viaCookie) {
    return Response.json({ error: 'Unauthorised.' }, { status: 401, headers: NOINDEX });
  }
  try {
    const data = await statsPayload(hoursFrom(new URL(request.url)));
    return Response.json(data, { headers: { ...NOINDEX, 'cache-control': 'no-store' } });
  } catch (err) {
    console.error('[hq/stats]', err);
    return Response.json({ error: 'Failed to fetch metrics.' }, { status: 500, headers: NOINDEX });
  }
}
