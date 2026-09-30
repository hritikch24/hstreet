/**
 * Serves this site's own IndexNow key, set in INDEXNOW_KEY. The submission
 * script passes this URL as keyLocation. 404 until the key is set.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return new Response('Not found', { status: 404 });
  return new Response(key, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
