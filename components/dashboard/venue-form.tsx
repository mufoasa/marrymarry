'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from '@/hooks/use-toast';
import type { Hall } from '@/lib/types/database';

interface VenueFormProps {
  hall?: Hall;
}

const amenityOptions = [
  { id: 'parking', label: 'Parking' },
  { id: 'catering', label: 'Catering Service' },
  { id: 'music', label: 'Music/DJ' },
  { id: 'decoration', label: 'Decoration' },
  { id: 'outdoor', label: 'Outdoor Space' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'stage', label: 'Stage' },
  { id: 'garden', label: 'Garden' },
  { id: 'pool', label: 'Pool' },
];

export function VenueForm({ hall }: VenueFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: hall?.name || '',
    description: hall?.description || '',
    description_sq: hall?.description_sq || '',
    description_mk: hall?.description_mk || '',
    location: hall?.location || '',
    city: hall?.city || '',
    address: hall?.address || '',
    capacity_min: hall?.capacity_min?.toString() || '',
    capacity_max: hall?.capacity_max?.toString() || '',
    price_per_guest: hall?.price_per_guest?.toString() || '',
    base_price: hall?.base_price?.toString() || '',
    contact_phone: hall?.contact_phone || '',
    contact_email: hall?.contact_email || '',
    cover_image: hall?.cover_image || '',
    images: hall?.images || [],
    amenities: hall?.amenities || [],
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenityId]
        : prev.amenities.filter(a => a !== amenityId),
    }));
  };
  
  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };
  
  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: t('error'),
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);

    const supabase = createClient();

    const hallData = {
      owner_id: userId,
      name: formData.name,
      description: formData.description || null,
      description_sq: formData.description_sq || null,
      description_mk: formData.description_mk || null,
      location: formData.location,
      city: formData.city,
      address: formData.address || null,
      capacity_min: formData.capacity_min ? parseInt(formData.capacity_min) : null,
      capacity_max: parseInt(formData.capacity_max),
      price_per_guest: formData.price_per_guest ? parseFloat(formData.price_per_guest) : null,
      base_price: formData.base_price ? parseFloat(formData.base_price) : null,
      contact_phone: formData.contact_phone || null,
      contact_email: formData.contact_email || null,
      cover_image: formData.cover_image || null,
      images: formData.images,
      amenities: formData.amenities,
      status: hall ? hall.status : 'pending' as const,
    };

    let error;

    if (hall) {
      const { error: updateError } = await supabase
        .from('halls')
        .update(hallData)
        .eq('id', hall.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('halls')
        .insert(hallData);
      error = insertError;
    }

    if (error) {
      console.error('Error saving venue:', error);
      toast({
        title: t('error'),
        description: 'Failed to save venue. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: t('success'),
      description: hall ? 'Venue updated successfully!' : 'Venue submitted for approval!',
    });
    router.push('/dashboard/venues');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('description')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('venueName')} *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')} (English)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description_sq">{t('description')} (Albanian)</Label>
              <Textarea
                id="description_sq"
                name="description_sq"
                value={formData.description_sq}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_mk">{t('description')} (Macedonian)</Label>
              <Textarea
                id="description_mk"
                name="description_mk"
                value={formData.description_mk}
                onChange={handleChange}
                rows={4}
              />
            </div>
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
              <Label htmlFor="city">{t('city')} *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('location')} *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t('address')}</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Capacity & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('capacity')} & {t('pricing')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity_min">{t('capacityMin')}</Label>
              <Input
                id="capacity_min"
                name="capacity_min"
                type="number"
                min="1"
                value={formData.capacity_min}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity_max">{t('capacityMax')} *</Label>
              <Input
                id="capacity_max"
                name="capacity_max"
                type="number"
                min="1"
                value={formData.capacity_max}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price_per_guest">{t('pricePerGuest')} (EUR)</Label>
              <Input
                id="price_per_guest"
                name="price_per_guest"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_guest}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_price">{t('basePrice')} (EUR)</Label>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.base_price}
                onChange={handleChange}
              />
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
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">{t('contactEmail')}</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
              />
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
          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover_image">{t('coverImage')} URL</Label>
            <Input
              id="cover_image"
              name="cover_image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.cover_image}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your venue&apos;s main image
            </p>
            {formData.cover_image && (
              <div className="mt-2 relative w-40 h-28 rounded-md overflow-hidden border">
                <img 
                  src={formData.cover_image || "/placeholder.svg"} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Additional Images */}
          <div className="space-y-3">
            <Label>Additional Images</Label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add multiple images to showcase your venue
            </p>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 rounded-md overflow-hidden border">
                      <img 
                        src={imageUrl || "/placeholder.svg"} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('amenities')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2">
            {amenityOptions.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={formData.amenities.includes(amenity.id)}
                  onCheckedChange={(checked) => 
                    handleAmenityChange(amenity.id, checked as boolean)
                  }
                />
                <Label htmlFor={amenity.id} className="font-normal text-sm">
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? t('loading') : hall ? t('save') : t('submitBooking')}
        </Button>
      </div>
    </form>
  );
}
