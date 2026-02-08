'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import type { Service, ServiceCategory } from '@/lib/types/database';

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'hair_salon', 'nail_salon', 'makeup', 'decorator', 'photographer',
  'videographer', 'florist', 'catering', 'music_dj', 'wedding_planner',
  'transport', 'other'
];

const MK_CITIES = [
  'Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Ohrid',
  'Veles', 'Strumica', 'Gostivar', 'Stip', 'Kavadarci', 'Kocani',
  'Struga', 'Kicevo', 'Gevgelija', 'Negotino', 'Debar', 'Resen',
];

interface ServiceFormProps {
  service?: Service;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    description_sq: service?.description_sq || '',
    description_mk: service?.description_mk || '',
    category: service?.category || '' as ServiceCategory,
    location: service?.location || '',
    city: service?.city || '',
    address: service?.address || '',
    price_from: service?.price_from?.toString() || '',
    price_to: service?.price_to?.toString() || '',
    contact_phone: service?.contact_phone || '',
    contact_email: service?.contact_email || '',
    website: service?.website || '',
    instagram: service?.instagram || '',
    cover_image: service?.cover_image || '',
    images: service?.images || [],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId && !service) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      name: formData.name,
      description: formData.description || null,
      description_sq: formData.description_sq || null,
      description_mk: formData.description_mk || null,
      category: formData.category,
      location: formData.location,
      city: formData.city,
      address: formData.address || null,
      price_from: formData.price_from ? Number(formData.price_from) : null,
      price_to: formData.price_to ? Number(formData.price_to) : null,
      contact_phone: formData.contact_phone || null,
      contact_email: formData.contact_email || null,
      website: formData.website || null,
      instagram: formData.instagram || null,
      cover_image: formData.cover_image || null,
      images: formData.images,
      ...(service ? {} : { owner_id: userId, status: 'pending' }),
    };

    let error;
    if (service) {
      ({ error } = await supabase.from('services').update(payload).eq('id', service.id));
    } else {
      ({ error } = await supabase.from('services').insert(payload));
    }

    if (error) {
      toast({ title: t('error'), description: error.message, variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    toast({ title: t('success'), description: service ? 'Service updated!' : 'Service submitted for approval!' });
    router.push('/dashboard/my-services');
    router.refresh();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('back')}
      </Button>

      <h1 className="text-3xl font-serif font-semibold mb-8">
        {service ? t('editService') : t('addService')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('description')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('venueName')}</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-background" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('allCategories')}</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as ServiceCategory }))}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t('allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{t(cat)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (EN)</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_sq">Description (SQ)</Label>
              <Textarea id="description_sq" name="description_sq" value={formData.description_sq} onChange={handleChange} rows={3} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_mk">Description (MK)</Label>
              <Textarea id="description_mk" name="description_mk" value={formData.description_mk} onChange={handleChange} rows={3} className="bg-background" />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('location')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')}</Label>
                <Select value={formData.city} onValueChange={(v) => setFormData(prev => ({ ...prev, city: v, location: v }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('city')} />
                  </SelectTrigger>
                  <SelectContent>
                    {MK_CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('address')}</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} className="bg-background" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('pricing')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price_from">{t('from')} (&euro;)</Label>
                <Input id="price_from" name="price_from" type="number" min="0" value={formData.price_from} onChange={handleChange} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_to">To (&euro;)</Label>
                <Input id="price_to" name="price_to" type="number" min="0" value={formData.price_to} onChange={handleChange} className="bg-background" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('contact')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">{t('contactPhone')}</Label>
                <Input id="contact_phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">{t('contactEmail')}</Label>
                <Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} className="bg-background" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">{t('website')}</Label>
                <Input id="website" name="website" type="url" placeholder="https://" value={formData.website} onChange={handleChange} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" name="instagram" placeholder="@username" value={formData.instagram} onChange={handleChange} className="bg-background" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('uploadImages')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cover_image">{t('coverImage')} URL</Label>
              <Input id="cover_image" name="cover_image" type="url" placeholder="https://example.com/image.jpg" value={formData.cover_image} onChange={handleChange} className="bg-background" />
              {formData.cover_image && (
                <div className="mt-2 relative w-40 h-28 rounded-md overflow-hidden border">
                  <img src={formData.cover_image || "/placeholder.svg"} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Additional Images</Label>
              <div className="flex gap-2">
                <Input type="url" placeholder="https://example.com/image.jpg" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 bg-background" />
                <Button type="button" onClick={addImage} variant="outline">Add</Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-24 rounded-md overflow-hidden border">
                        <img src={imageUrl || "/placeholder.svg"} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(imageUrl)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t('cancel')}</Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? t('loading') : t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
