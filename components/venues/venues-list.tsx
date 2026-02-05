'use client';

import React from "react"

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HallCard } from '@/components/halls/hall-card';
import { useI18n } from '@/lib/i18n/context';
import { Search, X } from 'lucide-react';
import type { Hall } from '@/lib/types/database';

interface VenuesListProps {
  initialHalls: Hall[];
  cities: string[];
  initialSearch?: string;
  initialCity?: string;
}

export function VenuesList({ 
  initialHalls, 
  cities, 
  initialSearch = '', 
  initialCity = '' 
}: VenuesListProps) {
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, city);
  };

  const updateFilters = (newSearch: string, newCity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSearch) {
      params.set('search', newSearch);
    } else {
      params.delete('search');
    }
    
    if (newCity && newCity !== 'all') {
      params.set('city', newCity);
    } else {
      params.delete('city');
    }

    router.push(`/venues?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCity('');
    router.push('/venues');
  };

  const hasFilters = search || city;

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 p-4 bg-muted/30 rounded-lg">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          
          <Select 
            value={city || 'all'} 
            onValueChange={(value) => {
              setCity(value === 'all' ? '' : value);
              updateFilters(search, value === 'all' ? '' : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button type="submit">
              {t('search')}
            </Button>
            {hasFilters && (
              <Button type="button" variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {initialHalls.length} {initialHalls.length === 1 ? 'venue' : 'venues'} found
      </div>

      {/* Halls Grid */}
      {initialHalls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initialHalls.map((hall) => (
            <HallCard key={hall.id} hall={hall} featured={hall.is_featured} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">{t('noResults')}</p>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
