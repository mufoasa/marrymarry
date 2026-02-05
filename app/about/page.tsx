import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24 px-4 container mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6 text-center">
          About Marry.mk
        </h1>
        <div className="prose max-w-3xl mx-auto text-foreground">
          <p>Marry.mk is Macedonia’s leading platform for finding and booking wedding venues. Our mission is to make your wedding planning simple and stress-free.</p>
          <h2>Our Vision</h2>
          <p>We aim to connect couples with the perfect venues and trusted wedding services, helping create unforgettable celebrations.</p>
          <h2>Our Team</h2>
          <p>We are a passionate team of wedding enthusiasts and tech professionals committed to delivering the best user experience.</p>
          <h2>Contact Us</h2>
          <p>Have questions or suggestions? Reach out through our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
