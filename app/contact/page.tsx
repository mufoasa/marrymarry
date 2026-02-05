"use client"

import React, { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      // Implement send logic
      toast({ title: "Success", description: "Message sent successfully" })
      setName(""); setEmail(""); setMessage("")
    } catch {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 container mx-auto px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Have questions? Send us a message and we’ll get back to you promptly.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
