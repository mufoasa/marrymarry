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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const description = language === 'sq' && service.description_sq
    ? service.description_sq
    : language === 'mk' && service.description_mk
    ? service.description_mk
    : service.description;

  const allImages = service.cover_image 
    ? [service.cover_image, ...(service.images?.filter(img => img !== service.cover_image) || [])]
    : service.images || [];

  const priceDisplay = service.price_from && service.price_to
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

      toast({
        title: t('success'),
        description: t('inquirySent'),
      });
      setIsInquiryOpen(false);
      setFormData({ name: '', email: '', phone: '', message: '', event_date: '' });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('inquiryError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="py-8 overflow-x-hidden w-full max-w-full">
      <div className="container mx-auto px-4 max-w-full">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/services" className="gap-2 flex items-center">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
        </Button>

        {/* Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-full">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 max-w-full">
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted max-w-full">
                <Image
                  src={allImages[currentImageIndex] || '/placeholder.svg'}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                      idx === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image src={img || '/placeholder.svg'} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-base">
                  {categoryIcons[service.category]} {t(service.category)}
                </Badge>
                {service.is_featured && (
                  <Badge className="bg-primary text-primary-foreground">{t('featured')}</Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">{service.name}</h1>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5" />
                <span>{service.address ? `${service.address}, ${service.city}` : service.city}</span>
              </div>

              {description && (
                <Card className="max-w-full">
                  <CardHeader>
                    <CardTitle>{t('description')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 max-w-full">
            {/* Pricing */}
            {priceDisplay && (
              <Card className="max-w-full">
                <CardHeader>
                  <CardTitle>{t('pricing')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{priceDisplay}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card className="max-w-full">
              <CardHeader>
                <CardTitle>{t('contact')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.contact_phone && (
                  <a href={`tel:${service.contact_phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                    <Phone className="h-5 w-5" />
                    <span>{service.contact_phone}</span>
                  </a>
                )}
                {service.contact_email && (
                  <a href={`mailto:${service.contact_email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                    <Mail className="h-5 w-5" />
                    <span>{service.contact_email}</span>
                  </a>
                )}
                {service.website && (
                  <a href={service.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                    <Globe className="h-5 w-5" />
                    <span>{t('website')}</span>
                  </a>
                )}
                {service.instagram && (
                  <a href={`https://instagram.com/${service.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                    <Instagram className="h-5 w-5" />
                    <span>{service.instagram}</span>
                  </a>
                )}

                {/* Inquiry Form */}
                <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4" size="lg">{t('sendInquiry')}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('sendInquiry')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t('fullName')} *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t('email')} *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_date">{t('eventDate')}</Label>
                        <Input
                          id="event_date"
                          type="date"
                          value={formData.event_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">{t('message')} *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          rows={4}
                          required
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
