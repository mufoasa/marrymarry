import React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            About Marry.mk
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Connecting couples with the perfect wedding venues across Macedonia.
          </p>
        </section>

        <section className="py-16 container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent>
              <CardTitle className="text-xl font-semibold">Our Mission</CardTitle>
              <p className="text-muted-foreground mt-2">
                Simplify wedding planning by offering a curated selection of trusted venues and services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <CardTitle className="text-xl font-semibold">Our Vision</CardTitle>
              <p className="text-muted-foreground mt-2">
                To make every couple’s wedding day memorable by providing seamless booking experiences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <CardTitle className="text-xl font-semibold">Our Team</CardTitle>
              <p className="text-muted-foreground mt-2">
                A dedicated team of wedding and tech professionals committed to excellence and user satisfaction.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  )
}
