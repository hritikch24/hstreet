import { profile } from '@/business/profile';
import { store } from '@/engine/store';
import { PaperworkForm } from '@/ui/PaperworkForm';

export default async function NewPaperworkPage({ searchParams }: PageProps<'/hq/paperwork/new'>) {
  const sp = await searchParams;
  const clients = await store.client.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, shopName: true, siteAddress: true, town: true } });
  return (
    <div className="grid gap-5">
      <h1 className="text-[1.8rem]">New quote or invoice</h1>
      <PaperworkForm
        clients={clients}
        preselect={typeof sp.client === 'string' ? sp.client : undefined}
        defaultVat={profile.vatRegistered.value ? 20 : 0}
      />
    </div>
  );
}
