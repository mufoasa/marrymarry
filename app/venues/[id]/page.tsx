import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VenueDetail } from '@/components/venues/venue-detail';
import type { Hall, Reservation } from '@/lib/types/database';

interface VenuePageProps {
  params: Promise<{ id: string }>;
}

async function getHall(id: string): Promise<Hall | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('halls')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getReservations(hallId: string): Promise<Reservation[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('reservations')
    .select('event_date, status')
    .eq('hall_id', hallId)
    .in('status', ['pending', 'confirmed']);

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  return data || [];
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { id } = await params;
  const [hall, reservations] = await Promise.all([
    getHall(id),
    getReservations(id),
  ]);

  if (!hall) {
    notFound();
  }

  const bookedDates = reservations.map(r => r.event_date);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <VenueDetail hall={hall} bookedDates={bookedDates} />
      </main>
      <Footer />
    </div>
  );
}
