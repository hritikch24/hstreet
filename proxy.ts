import { NextResponse, type NextRequest } from 'next/server';
import { NOINDEX, PASS_COOKIE, keyIsRight, passFor, passIsValid } from '@/engine/hq-gate';

/**
 * Guards the back office. Anyone without the key gets the ordinary 404 page,
 * so /hq looks exactly like a page that doesn't exist. Everything under
 * /hq and /api carries X-Robots-Tag: noindex, nofollow.
 */
function hidden(request: NextRequest) {
  const res = NextResponse.rewrite(new URL('/hq-no-such-page', request.url));
  for (const [k, v] of Object.entries(NOINDEX)) res.headers.set(k, v);
  return res;
}

function withNoindex(res: NextResponse) {
  for (const [k, v] of Object.entries(NOINDEX)) res.headers.set(k, v);
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!pathname.startsWith('/hq') && !pathname.startsWith('/api/hq')) {
    return withNoindex(NextResponse.next());
  }

  // The combined dashboard authenticates with a bearer token; the route checks it.
  if (pathname === '/api/hq/stats' && request.headers.get('authorization')) {
    return withNoindex(NextResponse.next());
  }

  const given = searchParams.get('key');
  if (given !== null && pathname.startsWith('/hq')) {
    if (!(await keyIsRight(given))) return hidden(request);
    const clean = request.nextUrl.clone();
    clean.searchParams.delete('key');
    const res = NextResponse.redirect(clean, 303);
    res.cookies.set(PASS_COOKIE, await passFor(given), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return withNoindex(res);
  }

  if (!(await passIsValid(request.cookies.get(PASS_COOKIE)?.value))) return hidden(request);

  // State-changing requests must come from this site's own pages.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    if (!origin || new URL(origin).host !== request.nextUrl.host) return hidden(request);
  }

  return withNoindex(NextResponse.next());
}

export const config = {
  matcher: ['/hq', '/hq/:path*', '/api/:path*'],
};
