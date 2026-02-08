import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VenuesList } from '@/components/venues/venues-list';
import type { Hall } from '@/lib/types/database';

export const revalidate = 60;

interface VenuesPageProps {
  searchParams: Promise<{ search?: string; city?: string }>;
}

async function getApprovedHalls(search?: string, city?: string): Promise<Hall[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('halls')
    .select('*')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,location.ilike.%${search}%`);
  }

  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching halls:', error);
    return [];
  }

  return data || [];
}

async function getCities(): Promise<string[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('halls')
    .select('city')
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  const cities = [...new Set(data?.map(h => h.city) || [])];
  return cities.sort();
}

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const params = await searchParams;
  const [halls, cities] = await Promise.all([
    getApprovedHalls(params.search, params.city),
    getCities(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
              Wedding Venues
            </h1>
            <p className="text-muted-foreground">
              Browse our collection of stunning wedding halls across Macedonia
            </p>
          </div>
          
          <VenuesList 
            initialHalls={halls} 
            cities={cities}
            initialSearch={params.search}
            initialCity={params.city}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
