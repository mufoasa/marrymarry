import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24 px-4 container mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6 text-center">
          Terms of Service
        </h1>
        <div className="prose max-w-3xl mx-auto text-foreground">
          <p>Welcome to Marry.mk. By using our website, you agree to comply with these terms.</p>
          <h2>Use of Our Platform</h2>
          <p>You may use our platform to browse venues, make bookings, and communicate with venue owners. Unauthorized use is prohibited.</p>
          <h2>Booking and Payments</h2>
          <p>All bookings are subject to approval by venue owners. Payments are handled securely and may involve third-party services.</p>
          <h2>Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use.</p>
          <h2>Limitation of Liability</h2>
          <p>Marry.mk is not liable for issues arising from venue bookings, cancellations, or disputes between customers and venue owners.</p>
          <h2>Changes to Terms</h2>
          <p>We may update these terms periodically. Continued use of the platform constitutes acceptance of the updated terms.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
