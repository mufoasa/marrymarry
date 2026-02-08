"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Users, MoreHorizontal, Check, X, Loader2, Building2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Reservation } from "@/lib/types/database"
import Image from "next/image"

interface ReservationWithHall extends Reservation {
  hall?: {
    id: string
    name: string
    city: string
    cover_image: string | null
  }
}

interface ReservationsListProps {
  reservations: ReservationWithHall[]
  isOwner: boolean
}

export function ReservationsList({ reservations: initialReservations, isOwner }: ReservationsListProps) {
  const { t } = useLanguage()
  const [reservations, setReservations] = useState<ReservationWithHall[]>(initialReservations)
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    setUpdating(id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("reservations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Reservation ${status === "confirmed" ? "confirmed" : "cancelled"}`,
      })
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      )
    }
    setUpdating(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("confirmed")}</Badge>
      case "cancelled":
        return <Badge variant="destructive">{t("cancelled")}</Badge>
      default:
        return <Badge variant="secondary">{t("pending")}</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">{t("noReservations")}</p>
          <p className="text-muted-foreground">
            {isOwner ? t("noReservationsDesc") : "You haven't made any reservations yet"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("allReservations")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("venue")}</TableHead>
                {isOwner && <TableHead>{t("customer")}</TableHead>}
                <TableHead>{t("eventDate")}</TableHead>
                <TableHead>{t("guestCount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                {isOwner && <TableHead className="text-right">{t("actions")}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {reservation.hall?.cover_image ? (
                        <Image
                          src={reservation.hall.cover_image || "/placeholder.svg"}
                          alt={reservation.hall.name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{reservation.hall?.name}</p>
                        <p className="text-sm text-muted-foreground">{reservation.hall?.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  {isOwner && (
                    <TableCell>
                      <div>
                        <p className="font-medium">{reservation.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{reservation.customer_email}</p>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(reservation.event_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {reservation.guest_count}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    {reservation.total_price
                      ? `€${Number(reservation.total_price).toLocaleString()}`
                      : "-"}
                  </TableCell>
                  {isOwner && (
                    <TableCell className="text-right">
                      {reservation.status === "pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={updating === reservation.id}>
                              {updating === reservation.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateStatus(reservation.id, "confirmed")}>
                              <Check className="h-4 w-4 mr-2" />
                              {t("confirm")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateStatus(reservation.id, "cancelled")}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              {t("cancel")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {reservation.hall?.cover_image ? (
                      <Image
                        src={reservation.hall.cover_image || "/placeholder.svg"}
                        alt={reservation.hall.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{reservation.hall?.name}</p>
                      <p className="text-sm text-muted-foreground">{reservation.hall?.city}</p>
                    </div>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>

                {isOwner && (
                  <div className="mb-3 p-2 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium">{reservation.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{reservation.customer_email}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(reservation.event_date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {reservation.guest_count} guests
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {reservation.total_price
                      ? `€${Number(reservation.total_price).toLocaleString()}`
                      : "-"}
                  </span>
                  {isOwner && reservation.status === "pending" && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateStatus(reservation.id, "confirmed")}
                        disabled={updating === reservation.id}
                      >
                        {updating === reservation.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateStatus(reservation.id, "cancelled")}
                        disabled={updating === reservation.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
