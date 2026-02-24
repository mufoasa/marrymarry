import React from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marry.mk - Find Your Perfect Wedding Venue",
  description:
    "Discover and book stunning wedding halls across Macedonia.",
};

export const viewport: Viewport = {
  themeColor: "#b08968",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src="/register-sw.js" strategy="afterInteractive" />
      </head>

      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
