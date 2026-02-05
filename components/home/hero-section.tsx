'use client';

import React from "react"

import { useState } from 'react';
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
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{
      backgroundImage:
        "url('https://www.newsnationnow.com/wp-content/uploads/sites/108/2025/04/GettyImages-2090025382.jpg?w=1752&h=986&crop=1')",
    }}
  />

  {/* Dark / Brand Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background z-10" />

  {/* Optional subtle pattern (VERY light) */}
  <div
    className="absolute inset-0 opacity-[0.04] z-20 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />

  {/* Content */}
  <div className="relative z-30 container mx-auto px-4 py-16 text-center">
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
        {t('heroTitle')}
      </h1>

      <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
        {t('heroSubtitle')}
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background/95 border-border text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8">
            {t('search')}
          </Button>
        </div>
      </form>

      {/* Stats */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-white">
        <div>
          <div className="text-4xl font-serif font-semibold">50+</div>
          <div className="text-sm text-white/80">Verified Venues</div>
        </div>
        <div>
          <div className="text-4xl font-serif font-semibold">1000+</div>
          <div className="text-sm text-white/80">Happy Couples</div>
        </div>
        <div>
          <div className="text-4xl font-serif font-semibold">15+</div>
          <div className="text-sm text-white/80">Cities Covered</div>
        </div>
      </div>
    </div>
  </div>
</section>
