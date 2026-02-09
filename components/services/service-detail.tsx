'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Service } from '@/lib/types/database';

interface ServiceDetailProps {
  service: Service;
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

export function ServiceDetail({ service }: ServiceDetailProps) {
  const { language, t } = useLanguage();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    event_date: '',
  });

  const description =
    language === 'sq' && service.description_sq
      ? service.description_sq
      : language === 'mk' && service.description_mk
      ? service.description_mk
      : service.description;

  const allImages = service.cover_image
    ? [service.cover_image, ...service.images.filter((img) => img !== service.cover_image)]
    : service.images;

  const priceDisplay =
    service.price_from && service.price_to
      ? `€${service.price_from} - €${service.price_to}`
      : service.price_from
      ? `${t('from')} €${service.price_from}`
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('service_inquiries').insert({
        service_id: service.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        event_date: formData.event_date || null,
      });

      if (error) throw error;

      toast({ title: t('success'), description: t('inquirySent') });
      setIsInquiryOpen(false);
      setFormData({ name: '', email: '', phone: '', message: '', event_date: '' });
    } catch {
      toast({
        title: t('error'),
        description: t('inquiryError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="py-8 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 overflow-x-hidden">
        {/* Back */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/services" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Gallery */}
            {allImages.length > 0 && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={allImages[currentImageIndex] || '/placeholder.svg'}
                  alt={service.name}
                  fill
                  className="object-contain bg-background"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />

                {allImages.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md ${
                      idx === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-base">
                  {categoryIcons[service.category]} {t(service.category)}
                </Badge>
                {service.is_featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    {t('featured')}
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-semibold break-words">
                {service.name}
              </h1>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="break-words">
                  {service.address
                    ? `${service.address}, ${service.city}`
                    : service.city}
                </span>
              </div>

              {description && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('description')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap break-words">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6 min-w-0">
            {priceDisplay && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('pricing')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{priceDisplay}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t('contact')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 break-words">
                {service.contact_phone && (
                  <a href={`tel:${service.contact_phone}`} className="flex gap-3">
                    <Phone className="h-5 w-5" />
                    {service.contact_phone}
                  </a>
                )}
                {service.contact_email && (
                  <a href={`mailto:${service.contact_email}`} className="flex gap-3">
                    <Mail className="h-5 w-5" />
                    {service.contact_email}
                  </a>
                )}
                {service.website && (
                  <a href={service.website} target="_blank" className="flex gap-3">
                    <Globe className="h-5 w-5" />
                    {t('website')}
                  </a>
                )}
                {service.instagram && (
                  <a
                    href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                    target="_blank"
                    className="flex gap-3"
                  >
                    <Instagram className="h-5 w-5" />
                    {service.instagram}
                  </a>
                )}

                <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">{t('sendInquiry')}</Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md w-full">
                    <DialogHeader>
                      <DialogTitle>{t('sendInquiry')}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label>{t('fullName')} *</Label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>{t('email')} *</Label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>{t('phone')}</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>{t('eventDate')}</Label>
                        <Input
                          type="date"
                          value={formData.event_date}
                          onChange={(e) =>
                            setFormData({ ...formData, event_date: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>{t('message')} *</Label>
                        <Textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t('loading') : t('send')}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
