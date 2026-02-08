import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Building2, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function getMyBookings(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      hall:halls(id, name, city, cover_image, contact_phone, contact_email)
    `)
    .eq("customer_id", userId)
    .order("event_date", { ascending: true })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

export default async function MyBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const bookings = await getMyBookings(user.id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.event_date) >= new Date() && b.status !== "cancelled"
  )
  const pastBookings = bookings.filter(
    (b) => new Date(b.event_date) < new Date() || b.status === "cancelled"
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-1">View and manage your venue reservations</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No bookings yet</p>
            <p className="text-muted-foreground mb-4">Start exploring venues to make your first reservation</p>
            <Button asChild>
              <Link href="/venues">Browse Venues</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-32 h-32 relative bg-muted flex-shrink-0">
                        {booking.hall?.cover_image ? (
                          <Image
                            src={booking.hall.cover_image || "/placeholder.svg"}
                            alt={booking.hall.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{booking.hall?.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.hall?.city}
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(booking.event_date)}
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {booking.guest_count} guests
                          </p>
                        </div>

                        {booking.total_price && (
                          <p className="mt-2 font-semibold text-primary">
                            Total: €{Number(booking.total_price).toLocaleString()}
                          </p>
                        )}

                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/venues/${booking.hall?.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Venue
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Past & Cancelled</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="opacity-75">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{booking.hall?.name}</CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.event_date)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {booking.guest_count} guests
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
