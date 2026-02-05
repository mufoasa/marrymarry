import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { OwnerVenuesList } from '@/components/dashboard/owner-venues-list';
import { Plus } from 'lucide-react';
import type { Hall } from '@/lib/types/database';

async function getOwnerVenues(userId: string): Promise<Hall[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('halls')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching venues:', error);
    return [];
  }

  return data || [];
}

export default async function OwnerVenuesPage() {
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

  const venues = await getOwnerVenues(user.id);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold">My Venues</h1>
          <p className="text-muted-foreground mt-1">Manage your wedding halls</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/venues/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Venue
          </Link>
        </Button>
      </div>

      <OwnerVenuesList venues={venues} />
    </div>
  );
}
