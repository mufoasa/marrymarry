'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import type { Service } from '@/lib/types/database';

interface ServiceCardProps {
  service: Service;
  featured?: boolean;
}

const categoryIcons: Record<string, string> = {
  hair_salon: '💇',
  nail_salon: '💅',
  makeup: '💄',
  decorator: '🎨',
  photographer: '📷',
  videographer: '🎬',
  florist: '💐',
  catering: '🍽️',
  music_dj: '🎵',
  wedding_planner: '📋',
  transport: '🚗',
  other: '✨',
};

export function ServiceCard({ service, featured }: ServiceCardProps) {
  const { language, t } = useLanguage();

  const description = language === 'sq' && service.description_sq
    ? service.description_sq
    : language === 'mk' && service.description_mk
    ? service.description_mk
    : service.description;

  const priceDisplay = service.price_from && service.price_to
    ? `€${service.price_from} - €${service.price_to}`
    : service.price_from
    ? `${t('from')} €${service.price_from}`
    : null;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? 'ring-2 ring-primary' : ''}`}>
      <div className="relative aspect-[4/3]">
        <Image
          src={service.cover_image || '/placeholder.svg'}
          alt={service.name}
          fill
          className="object-cover"
        />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            <Star className="h-3 w-3 mr-1" />
            {t('featured')}
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
          {categoryIcons[service.category]} {t(service.category)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif text-xl font-semibold mb-2 line-clamp-1">{service.name}</h3>
        
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span>{service.city}</span>
        </div>

        {description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          {priceDisplay && (
            <span className="text-lg font-semibold text-primary">{priceDisplay}</span>
          )}
          <Button asChild size="sm" className="ml-auto">
            <Link href={`/services/${service.id}`}>{t('viewDetails')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
