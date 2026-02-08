'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/venues/booking-form';
import { useLanguage } from '@/lib/i18n/context';
import { 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  ChevronLeft,
  Check,
  ImageIcon
} from 'lucide-react';
import type { Hall } from '@/lib/types/database';

interface VenueDetailProps {
  hall: Hall;
  bookedDates: string[];
}

const amenityLabels: Record<string, string> = {
  parking: 'Parking',
  catering: 'Catering',
  music: 'Music/DJ',
  decoration: 'Decoration',
  outdoor: 'Outdoor Space',
  ac: 'Air Conditioning',
  wifi: 'WiFi',
  stage: 'Stage',
  garden: 'Garden',
  pool: 'Pool',
};

export function VenueDetail({ hall, bookedDates }: VenueDetailProps) {
  const [selectedImage, setSelectedImage] = useState(hall.cover_image || hall.images?.[0]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { t, language } = useLanguage();

  const description = language === 'sq' 
    ? hall.description_sq || hall.description 
    : language === 'mk' 
      ? hall.description_mk || hall.description 
      : hall.description;

  const allImages = hall.cover_image 
    ? [hall.cover_image, ...hall.images.filter(img => img !== hall.cover_image)]
    : hall.images;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <Link 
        href="/venues" 
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('back')} {t('toVenues')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
              {selectedImage ? (
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt={hall.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === image ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${hall.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hall Info */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
              {hall.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{hall.address || hall.location}, {hall.city}</span>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>
                  {hall.capacity_min && `${hall.capacity_min}-`}{hall.capacity_max} {t('guests')}
                </span>
              </div>
              {hall.price_per_guest && (
                <div className="font-medium">
                  {t('from')} <span className="text-primary text-lg">&euro;{hall.price_per_guest}</span> {t('perGuest')}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">{t('description')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {hall.amenities && hall.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">{t('amenities')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hall.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{amenityLabels[amenity] || amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-serif">{t('bookThisVenue')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hall.base_price && (
                <div className="text-center py-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">{t('startingFrom')}</div>
                  <div className="text-3xl font-serif font-semibold text-primary">
                    &euro;{hall.base_price.toLocaleString()}
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowBookingForm(true)}
              >
                {t('bookNow')}
              </Button>

              {/* Contact Info */}
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="font-medium">{t('contactVenue')}</h4>
                {hall.contact_phone && (
                  <a 
                    href={`tel:${hall.contact_phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {hall.contact_phone}
                  </a>
                )}
                {hall.contact_email && (
                  <a 
                    href={`mailto:${hall.contact_email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {hall.contact_email}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm 
          hall={hall} 
          bookedDates={bookedDates}
          onClose={() => setShowBookingForm(false)} 
        />
      )}
    </div>
  );
}
