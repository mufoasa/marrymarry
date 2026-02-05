import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your privacy is our priority. We are committed to protecting your personal information and ensuring your data is handled responsibly.
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4 max-w-4xl space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p className="text-muted-foreground">
              We may collect details such as your name, email, phone number, and booking preferences to provide our services efficiently.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              Your data helps us manage bookings, improve our platform, and communicate with you effectively. We never sell your personal information.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cookies & Tracking</h2>
            <p className="text-muted-foreground">
              Cookies are used to enhance user experience and performance. You can manage your preferences in your browser.
            </p>
            <Separator />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              Questions about privacy? Reach out via our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
