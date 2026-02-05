"use client"

import React, { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/i18n/context"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast({ title: t("error"), description: t("fillRequiredFields"), variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      // Implement your email/send logic here
      toast({ title: t("success"), description: t("messageSent") })
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      toast({ title: t("error"), description: t("messageError"), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24 px-4 container mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6 text-center">
          Contact Us
        </h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("loading") : t("sendMessage")}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
