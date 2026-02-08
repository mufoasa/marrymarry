import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ReservationsList } from '@/components/dashboard/reservations-list';
import type { Reservation, Profile } from '@/lib/types/database';

async function getReservations(profile: Profile): Promise<Reservation[]> {
  const supabase = await createClient();

  if (profile.role === 'customer') {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        hall:halls(id, name, city, cover_image)
      `)
      .eq('customer_id', profile.id)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
    return data || [];
  }

  if (profile.role === 'hall_owner') {
    // First get owner's halls
    const { data: halls } = await supabase
      .from('halls')
      .select('id')
      .eq('owner_id', profile.id);

    if (!halls || halls.length === 0) return [];

    const hallIds = halls.map(h => h.id);

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        hall:halls(id, name, city, cover_image)
      `)
      .in('hall_id', hallIds)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
    return data || [];
  }

  return [];
}

export default async function ReservationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role === 'admin') {
    redirect('/dashboard');
  }

  const reservations = await getReservations(profile as Profile);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold">
          {profile.role === 'customer' ? 'My Reservations' : 'Venue Reservations'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {profile.role === 'customer' 
            ? 'View and manage your booking requests'
            : 'Manage booking requests for your venues'}
        </p>
      </div>

      <ReservationsList 
        reservations={reservations} 
        isOwner={profile.role === 'hall_owner'} 
      />
    </div>
  );
}
