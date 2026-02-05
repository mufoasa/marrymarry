'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCard } from './service-card';
import { useLanguage } from '@/lib/i18n/context';
import { Search } from 'lucide-react';
import type { Service, ServiceCategory } from '@/lib/types/database';

interface ServicesListProps {
  initialServices: Service[];
}

const categories: ServiceCategory[] = [
  'hair_salon',
  'nail_salon', 
  'makeup',
  'decorator',
  'photographer',
  'videographer',
  'florist',
  'catering',
  'music_dj',
  'wedding_planner',
  'transport',
  'other',
];

export function ServicesList({ initialServices }: ServicesListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = useMemo(() => {
    const citySet = new Set(initialServices.map(s => s.city));
    return Array.from(citySet).sort();
  }, [initialServices]);

  const filteredServices = useMemo(() => {
    return initialServices.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesCity = selectedCity === 'all' || service.city === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [initialServices, searchQuery, selectedCategory, selectedCity]);

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            {t('weddingServices')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('servicesSubtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-4 mb-8 border">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{t(cat)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder={t('allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCities')}</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">{t('noResults')}</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCity('all');
            }}>
              {t('clearFilters')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} featured={service.is_featured} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
