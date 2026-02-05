"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface BookingFormData {
  hallId: string
  eventDate: string
  guestCount: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  notes?: string
}

export async function createBooking(data: BookingFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "You must be logged in to make a reservation" }
  }

  // Check if the date is already booked
  const { data: existingBooking } = await supabase
    .from("reservations")
    .select("id")
    .eq("hall_id", data.hallId)
    .eq("event_date", data.eventDate)
    .neq("status", "cancelled")
    .single()

  if (existingBooking) {
    return { error: "This date is already booked. Please select another date." }
  }

  // Get hall details for pricing
  const { data: hall } = await supabase
    .from("halls")
    .select("price_per_guest, base_price, capacity_max")
    .eq("id", data.hallId)
    .single()

  if (!hall) {
    return { error: "Venue not found" }
  }

  if (data.guestCount > hall.capacity_max) {
    return { error: `Guest count exceeds venue capacity of ${hall.capacity_max}` }
  }

  // Calculate total price
  let totalPrice = 0
  if (hall.base_price) {
    totalPrice = Number(hall.base_price)
  }
  if (hall.price_per_guest) {
    totalPrice += Number(hall.price_per_guest) * data.guestCount
  }

  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      hall_id: data.hallId,
      customer_id: user.id,
      event_date: data.eventDate,
      guest_count: data.guestCount,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone || null,
      notes: data.notes || null,
      total_price: totalPrice > 0 ? totalPrice : null,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Booking error:", error)
    return { error: "Failed to create reservation. Please try again." }
  }

  revalidatePath(`/venues/${data.hallId}`)
  revalidatePath("/dashboard/reservations")

  return { success: true, reservation }
}

export async function getBookedDates(hallId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("reservations")
    .select("event_date")
    .eq("hall_id", hallId)
    .neq("status", "cancelled")
    .gte("event_date", new Date().toISOString().split("T")[0])

  return data?.map((r) => r.event_date) || []
}

export async function cancelReservation(reservationId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "You must be logged in" }
  }

  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", reservationId)
    .eq("customer_id", user.id)

  if (error) {
    return { error: "Failed to cancel reservation" }
  }

  revalidatePath("/dashboard/reservations")
  return { success: true }
}
