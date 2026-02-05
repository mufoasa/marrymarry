'use client';

import React, { useState } from 'react';
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
    const q = searchQuery.trim();
    router.push(q ? `/venues?search=${encodeURIComponent(q)}` : '/venues');
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">

      {/* IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1920&q=80')",
        }}
      />

      {/* DARK OVERLAY (NO background color!) */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* PATTERN */}
      <div
        className="absolute inset-0 z-20 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-30 container mx-auto px-4 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto">

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
            {t('heroTitle')}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10">
            {t('heroSubtitle')}
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="pl-10 h-12 bg-white/95 text-black"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                {t('search')}
              </Button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}
