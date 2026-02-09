import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              By using Marry.mk, you agree to these Terms of Service. Please read carefully before accessing or using our platform.
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 container mx-auto px-4 max-w-4xl space-y-10">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Marry.mk,Martohu.mk or Vencaj.mk, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Nature of Service</h2>
            <p className="text-muted-foreground">
              Marry.mk is an intermediary platform connecting users with third-party wedding venues owners. We are not a party to any contracts between Couples and Owners and do not guarantee outcomes of any booking.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Booking & Payment Policy</h2>
            <p className="text-muted-foreground">
              <strong>Approval:</strong> All bookings are subject to individual venue approval and availability. <br />
              <strong>Payments:</strong> All payments, deposits, and fees are handled directly between Couples and Owners. Marry.mk does not process, store, or protect payments. <br />
              <strong>No Escrow:</strong> Marry.mk does not provide escrow or financial protection.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Accuracy of Information</h2>
            <p className="text-muted-foreground">
              We strive to provide accurate venue information, but Marry.mk does not guarantee completeness or reliability of descriptions, images, or pricing. Users should verify details directly with the venue before booking.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, Marry.mk is not liable for any damages, including but not limited to: cancellations or no-shows, disputes regarding venue quality, personal injury, property damage, or loss of data.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">6. User Conduct & Account Security</h2>
            <p className="text-muted-foreground">
              Users are responsible for maintaining account security. Use the platform only for lawful purposes. We may suspend or terminate accounts engaging in fraudulent or unauthorized activities.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content created by Marry.mk, including logos, design, and text, is owned by Marry.mk. By uploading photos or reviews, you grant a non-exclusive right for display on the Platform to help other users.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the Republic of North Macedonia. Any disputes fall under the exclusive jurisdiction of courts in North Macedonia.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms at any time. Continued use of Marry.mk after updates constitutes acceptance of the revised terms.
            </p>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
}
