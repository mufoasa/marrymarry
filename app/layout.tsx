'use client'

import React, { useEffect, useState } from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/components/providers'
import './globals.css'

// Fonts
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: 'Marry.mk - Find Your Perfect Wedding Venue',
  description: 'Discover and book stunning wedding halls across Macedonia. Browse venues, check availability, and make your dream wedding a reality.',
  keywords: ['wedding', 'venue', 'hall', 'Macedonia', 'booking', 'celebration'],
  
}

export const viewport: Viewport = {
  themeColor: '#b08968',
  width: 'device-width',
  initialScale: 1,
}

// Terms of Service Popup Component
function TermsPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('acceptedTerms')
    if (!accepted) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('acceptedTerms', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 text-center shadow-xl border border-gray-200">
        <h2 className="text-2xl font-serif font-semibold mb-4 text-foreground">Terms of Service</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          By using this website, you agree to our Terms of Service. Please read them carefully before proceeding.
        </p>
        <button
          onClick={handleAccept}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <TermsPopup /> {/* <-- Terms popup included here */}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
