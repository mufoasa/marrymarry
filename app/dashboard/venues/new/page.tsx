import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { VenueForm } from '@/components/dashboard/venue-form';

export default async function NewVenuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'hall_owner' && profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold">Add New Venue</h1>
        <p className="text-muted-foreground mt-1">Fill in the details of your wedding hall</p>
      </div>

      <VenueForm userId={user.id} />
    </div>
  );
}
