import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ServiceForm } from '@/components/dashboard/service-form';
import type { Service } from '@/lib/types/database';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!service) redirect('/dashboard/my-services');

  return <ServiceForm service={service as Service} />;
}
