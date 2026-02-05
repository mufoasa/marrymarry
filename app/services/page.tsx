import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServicesList } from '@/components/services/services-list';
import type { Service } from '@/lib/types/database';

export const metadata = {
  title: 'Wedding Services | Marry.mk',
  description: 'Find the best wedding service providers - photographers, decorators, hair salons, makeup artists, and more.',
};

async function getServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data as Service[];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ServicesList initialServices={services} />
      </main>
      <Footer />
    </div>
  );
}
