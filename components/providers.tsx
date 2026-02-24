'use client';

import { I18nProvider } from '@/lib/i18n/context';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .catch(err => console.log('SW registration failed:', err));
    }
  }, []);

  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}
