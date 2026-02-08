'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HallCard } from '@/components/halls/hall-card';
import { useLanguage } from '@/lib/i18n/context';
import { ArrowRight } from 'lucide-react';
import type { Hall } from '@/lib/types/database';

interface FeaturedHallsProps {
  halls: Hall[];
}

export function FeaturedHalls({ halls }: FeaturedHallsProps) {
  const { t } = useLanguage();

  if (halls.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            {t('featuredTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('featuredSubtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} featured />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/venues" className="gap-2">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
