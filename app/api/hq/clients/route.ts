import { back, hidden, hqAllowed } from '@/engine/hq-session';
import { clip } from '@/engine/request-bits';
import { store } from '@/engine/store';

export async function POST(request: Request) {
  if (!(await hqAllowed())) return hidden();
  const f = await request.formData();
  const name = clip(f.get('name'), 120);
  const phone = clip(f.get('phone'), 40);
  if (!name || !phone) return back(request, '/hq/clients');
  await store.client.create({
    data: {
      name,
      phone,
      shopName: clip(f.get('shopName'), 120),
      email: clip(f.get('email'), 160),
      siteAddress: clip(f.get('siteAddress'), 300),
      town: clip(f.get('town'), 80),
      notes: clip(f.get('notes'), 4000),
    },
  });
  return back(request, '/hq/clients');
}
