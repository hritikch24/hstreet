import { reachOf } from '@/engine/coverage';

/** Live check used by the quote form: is this place inside the repair radius? */
export async function GET(request: Request) {
  const where = new URL(request.url).searchParams.get('where') ?? '';
  const reach = await reachOf(where.slice(0, 80));
  return Response.json(reach, { headers: { 'cache-control': 'private, max-age=300' } });
}
