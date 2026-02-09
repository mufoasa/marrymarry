import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              At Marry.mk, your privacy is our priority. We are committed to protecting your personal information and handling it responsibly.
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 container mx-auto px-4 max-w-4xl space-y-10">

          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              This Privacy Policy explains how Marry.mk collects, uses, and protects your personal information when you use our platform to find and book wedding venues.
            </p>
            <Separator />
          </div>

          {/* Information We Collect */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            <p className="text-muted-foreground">
              To provide our services effectively, we may collect the following:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Personal Identifiers:</strong> Name, email address, and phone number.</li>
              <li><strong>Booking Details:</strong> Wedding dates, guest counts, and venue preferences.</li>
              <li><strong>Technical Data:</strong> IP addresses, browser information, and cookies for site performance.</li>
            </ul>
            <Separator />
          </div>

          {/* How We Use Your Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              Your data is used only to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Facilitate communication between you and venue owners.</li>
              <li>Manage and confirm booking requests.</li>
              <li>Improve our platform’s functionality and user experience.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              We do <strong>not</strong> sell, rent, or trade your personal information to third-party marketers.
            </p>
            <Separator />
          </div>

          {/* Data Sharing */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
            <p className="text-muted-foreground">
              We only share your personal information with the specific venue owners you contact through our platform. Once shared, the venue's own privacy practices apply. We encourage you to review their policies.
            </p>
            <Separator />
          </div>

          {/* Data Retention & Security */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Retention & Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard measures to protect your information. We retain personal data only as long as necessary to provide our services or comply with legal obligations.
            </p>
            <Separator />
          </div>

          {/* Your Rights */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">
              Under the Law on Personal Data Protection of North Macedonia, you have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction or deletion of your personal data.</li>
              <li>Withdraw consent for data processing at any time.</li>
            </ul>
            <Separator />
          </div>

          {/* Cookies */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Cookies & Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies to remember your preferences and analyze site traffic. You can disable cookies in your browser settings, but some features of Marry.mk may not work properly as a result.
            </p>
            <Separator />
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
            <p className="text-muted-foreground">
              For questions about this Privacy Policy or to exercise your rights, please reach out through our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.
            </p>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
}
