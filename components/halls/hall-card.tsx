'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/context';
import { MapPin, Users, Star } from 'lucide-react';
import type { Hall } from '@/lib/types/database';

interface HallCardProps {
  hall: Hall;
  featured?: boolean;
}

export function HallCard({ hall, featured = false }: HallCardProps) {
  const { t, language } = useLanguage();

  // Get description based on language
  const description = language === 'sq' 
    ? hall.description_sq || hall.description 
    : language === 'mk' 
      ? hall.description_mk || hall.description 
      : hall.description;

  return (
    <Card className={`overflow-hidden group transition-all duration-300 hover:shadow-lg ${featured ? 'border-primary/20' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {hall.cover_image ? (
          <Image
            src={hall.cover_image || "/placeholder.svg"}
            alt={hall.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {t('featured')}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif text-lg font-semibold mb-1 line-clamp-1">{hall.name}</h3>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>{hall.city}</span>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {hall.capacity_min && `${hall.capacity_min}-`}{hall.capacity_max} {t('guests')}
            </span>
          </div>
          {hall.price_per_guest && (
            <div className="text-sm font-medium">
              {t('from')} <span className="text-primary">&euro;{hall.price_per_guest}</span> {t('perGuest')}
            </div>
          )}
        </div>

        <Button asChild className="w-full" variant={featured ? 'default' : 'outline'}>
          <Link href={`/venues/${hall.id}`}>
            {t('viewDetails')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
