'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/services/service-card';
import { useLanguage } from '@/lib/i18n/context';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/types/database';

interface FeaturedServicesProps {
  services: Service[];
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  const { t } = useLanguage();

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            {t('weddingServices')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('servicesSubtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/services" className="gap-2">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
