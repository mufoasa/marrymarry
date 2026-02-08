import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServiceDetail } from '@/components/services/service-detail';
import type { Service } from '@/lib/types/database';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

async function getService(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (error || !data) {
    return null;
  }

  return data as Service;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getService(id);
  
  if (!service) {
    return { title: 'Service Not Found | Marry.mk' };
  }

  return {
    title: `${service.name} | Marry.mk`,
    description: service.description || `Wedding service provider in ${service.city}`,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ServiceDetail service={service} />
      </main>
      <Footer />
    </div>
  );
}
