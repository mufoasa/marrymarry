import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24 px-4 container mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6 text-center">
          Privacy Policy
        </h1>
        <div className="prose max-w-3xl mx-auto text-foreground">
          <p>Your privacy is important to us. At Marry.mk, we are committed to protecting your personal information and respecting your privacy.</p>
          <h2>Information We Collect</h2>
          <p>We may collect information such as your name, email, phone number, and details about your wedding venue preferences when you use our platform.</p>
          <h2>How We Use Your Information</h2>
          <p>Your data is used to provide services, improve your experience, process bookings, and communicate with you about your requests.</p>
          <h2>Data Sharing</h2>
          <p>We do not sell your personal information. We may share information with venue owners for booking purposes, or comply with legal obligations if required.</p>
          <h2>Cookies</h2>
          <p>We use cookies to enhance site performance and user experience. You can manage cookie preferences in your browser.</p>
          <h2>Contact Us</h2>
          <p>If you have questions about this policy, please reach out via our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
