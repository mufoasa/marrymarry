'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/context';
import { Search } from 'lucide-react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/venues?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/venues');
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://www.newsnationnow.com/wp-content/uploads/sites/108/2025/04/GettyImages-2090025382.jpg?w=1752&h=986&crop=1")`,
        }}
      />

      {/* Optional SVG Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 text-center z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight text-balance">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto text-pretty">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/90 border-border text-base text-black placeholder-gray-500"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                {t('search')}
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-white">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-semibold text-primary">1+</div>
              <div className="text-sm text-gray-200">Verified Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-semibold text-primary">1000+</div>
              <div className="text-sm text-gray-200">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-semibold text-primary">15+</div>
              <div className="text-sm text-gray-200">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
