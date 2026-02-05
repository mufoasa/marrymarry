import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Separator } from "@/components/ui/separator"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              By using Marry.mk, you agree to comply with these terms. Please read carefully before using our services.
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4 max-w-4xl space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Using Our Platform</h2>
            <p className="text-muted-foreground">
              You may browse venues, submit bookings, and communicate with venue owners responsibly. Unauthorized actions are prohibited.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Booking Rules</h2>
            <p className="text-muted-foreground">
              All bookings are subject to approval by venue owners. Payments are all handled outside of Marry.mk's reach!
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Account Responsibility</h2>
            <p className="text-muted-foreground">
              Keep your account credentials safe. Notify us immediately of any unauthorized access.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Marry.mk is not responsible for issues arising from bookings, cancellations, or disputes with venue owners.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms periodically. Continued use of our platform constitutes acceptance of updated terms.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
