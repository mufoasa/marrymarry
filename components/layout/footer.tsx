'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { Heart } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-lg font-serif font-semibold">Marry.mk</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find your perfect wedding venue in Macedonia. We connect couples with stunning halls for their special day.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-foreground transition-colors">
                  {t('venues')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-foreground transition-colors">
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Venues */}
          <div>
            <h4 className="font-semibold mb-4">For Venues</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-foreground transition-colors">
                  Venue Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Marry.mk. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}
