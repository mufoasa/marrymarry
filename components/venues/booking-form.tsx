"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import { toast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, CalendarDays, Users, User, Mail, Phone } from "lucide-react"
import type { Hall } from "@/lib/types/database"

interface BookingFormProps {
  hall: Hall
  bookedDates: string[]
  onClose: () => void
}

export function BookingForm({ hall, bookedDates, onClose }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [guestCount, setGuestCount] = useState(hall.capacity_min || 50)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const supabase = createClient()

  // Pre-fill form if user is logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
      if (user?.user_metadata?.full_name) setName(user.user_metadata.full_name)
    })
  }, [supabase])

  const bookedDateSet = new Set(bookedDates)

  const isDateBooked = (date: Date) => {
    const dateString = formatDateLocal(date)
    return bookedDateSet.has(dateString)
  }

  // Helper to format date in local timezone YYYY-MM-DD
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({ title: t("error"), description: t("selectDate"), variant: "destructive" })
      return
    }
    if (!name || !email) {
      toast({ title: t("error"), description: t("fillRequiredFields"), variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    const eventDate = formatDateLocal(date)

    // Double-check availability
    const { data: existingBooking } = await supabase
      .from("reservations")
      .select("id")
      .eq("hall_id", hall.id)
      .eq("event_date", eventDate)
      .in("status", ["pending", "confirmed"])
      .maybeSingle()

    if (existingBooking) {
      toast({ title: t("error"), description: t("dateNotAvailable"), variant: "destructive" })
      setIsSubmitting(false)
      return
    }

    // Calculate total price
    const totalPrice = hall.price_per_guest
      ? Number(hall.price_per_guest) * guestCount
      : hall.base_price
      ? Number(hall.base_price)
      : null

    const { error } = await supabase.from("reservations").insert({
      hall_id: hall.id,
      event_date: eventDate,
      guest_count: guestCount,
      total_price: totalPrice,
      customer_name: name,
      customer_email: email,
      customer_phone: phone || null,
      notes: notes || null,
      status: "pending",
    })

    if (error) {
      console.error("Booking error:", error)
      toast({
        title: t("error"),
        description: error.code === "23505" ? t("dateNotAvailable") : t("bookingError"),
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    setIsSuccess(true)
    toast({ title: t("success"), description: t("bookingSubmitted") })

    setTimeout(() => {
      onClose()
      router.refresh()
    }, 2500)
  }

  if (isSuccess) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("bookingConfirmed")}</h3>
            <p className="text-muted-foreground px-4">{t("bookingConfirmationMessage")}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg sm:text-xl">{t("bookVenue")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4" /> {t("selectDate")} *
            </Label>
            <div className="flex justify-center border rounded-lg p-2 overflow-x-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today || isDateBooked(date)
                }}
                modifiers={{ booked: (date) => isDateBooked(date) }}
                modifiersStyles={{ booked: { textDecoration: "line-through", color: "var(--muted-foreground)" } }}
                className="rounded-md"
              />
            </div>
            {date && (
              <p className="text-sm text-center text-muted-foreground">
                {t("selectedDate")}: {date.toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <Label htmlFor="guestCount" className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" /> {t("guestCount")} *
            </Label>
            <Input
              id="guestCount"
              type="number"
              min={hall.capacity_min || 1}
              max={hall.capacity_max}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="h-11"
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("capacity")}: {hall.capacity_min || 1} - {hall.capacity_max} {t("guests")}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">{t("yourDetails")}</h4>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" /> {t("fullName")} *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("enterYourName")}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" /> {t("email")} *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("enterYourEmail")}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" /> {t("phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("enterYourPhone")}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm">{t("notes")}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={t("notesPlaceholder")}
              />
            </div>
          </div>

          {/* Price Estimate */}
          {hall.price_per_guest && date && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("estimatedTotal")}</span>
                <span className="text-lg sm:text-xl font-serif font-semibold text-primary">
                  &euro;{(Number(hall.price_per_guest) * guestCount).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("priceDisclaimer")}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 order-2 sm:order-1">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !date} className="flex-1 h-11 order-1 sm:order-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t("loading")}
                </>
              ) : (
                t("submitBooking")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
