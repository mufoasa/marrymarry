"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Building2, MapPin, Users, Phone, Mail, Check, X, Loader2, Eye, Star } from "lucide-react"
import Image from "next/image"
import type { Hall, Profile } from "@/lib/types/database"

interface HallWithOwner extends Hall {
  owner: Pick<Profile, "id" | "full_name" | "phone"> | null
}

interface PendingApprovalsListProps {
  halls: HallWithOwner[]
}

export function PendingApprovalsList({ halls: initialHalls }: PendingApprovalsListProps) {
  const router = useRouter()
  const [halls, setHalls] = useState(initialHalls)
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; hallId: string | null }>({
    open: false,
    hallId: null,
  })
  const [rejectReason, setRejectReason] = useState("")
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; hall: HallWithOwner | null }>({
    open: false,
    hall: null,
  })

  async function handleApprove(hallId: string, makeFeatured = false) {
    setProcessing(hallId)
    const supabase = createClient()

    const { error } = await supabase
      .from("halls")
      .update({
        status: "approved",
        is_featured: makeFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", hallId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve venue",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Venue approved${makeFeatured ? " and featured" : ""}`,
      })
      setHalls((prev) => prev.filter((h) => h.id !== hallId))
      router.refresh()
    }
    setProcessing(null)
  }

  async function handleReject() {
    if (!rejectDialog.hallId) return
    
    setProcessing(rejectDialog.hallId)
    const supabase = createClient()

    const { error } = await supabase
      .from("halls")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", rejectDialog.hallId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject venue",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Venue Rejected",
        description: "The venue owner will be notified",
      })
      setHalls((prev) => prev.filter((h) => h.id !== rejectDialog.hallId))
      router.refresh()
    }
    setProcessing(null)
    setRejectDialog({ open: false, hallId: null })
    setRejectReason("")
  }

  if (halls.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Check className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-muted-foreground">No venues pending approval</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {halls.map((hall) => (
          <Card key={hall.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              {hall.cover_image ? (
                <Image
                  src={hall.cover_image || "/placeholder.svg"}
                  alt={hall.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-amber-500">Pending</Badge>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{hall.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {hall.city}, {hall.location}
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Up to {hall.capacity_max} guests</span>
                </div>
                {hall.price_per_guest && (
                  <div className="text-muted-foreground">
                    €{Number(hall.price_per_guest).toFixed(0)}/guest
                  </div>
                )}
              </div>

              {hall.owner && (
                <div className="mt-3 p-2 bg-muted/50 rounded-md text-sm">
                  <p className="font-medium">{hall.owner.full_name || "Unknown Owner"}</p>
                  {hall.owner.phone && (
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {hall.owner.phone}
                    </p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setDetailsDialog({ open: true, hall })}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1"
                  onClick={() => handleApprove(hall.id)}
                  disabled={processing === hall.id}
                >
                  {processing === hall.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setRejectDialog({ open: true, hallId: hall.id })}
                  disabled={processing === hall.id}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleApprove(hall.id, true)}
                disabled={processing === hall.id}
              >
                <Star className="h-4 w-4 mr-2" />
                Approve & Feature
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, hallId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Venue</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this venue? You can optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, hallId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing !== null}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Venue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, hall: null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailsDialog.hall && (
            <>
              <DialogHeader>
                <DialogTitle>{detailsDialog.hall.name}</DialogTitle>
                <DialogDescription>
                  {detailsDialog.hall.city}, {detailsDialog.hall.location}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {detailsDialog.hall.cover_image && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={detailsDialog.hall.cover_image || "/placeholder.svg"}
                      alt={detailsDialog.hall.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Capacity</p>
                    <p>{detailsDialog.hall.capacity_min || 0} - {detailsDialog.hall.capacity_max} guests</p>
                  </div>
                  {detailsDialog.hall.price_per_guest && (
                    <div>
                      <p className="font-medium text-muted-foreground">Price per Guest</p>
                      <p>€{Number(detailsDialog.hall.price_per_guest).toFixed(2)}</p>
                    </div>
                  )}
                  {detailsDialog.hall.base_price && (
                    <div>
                      <p className="font-medium text-muted-foreground">Base Price</p>
                      <p>€{Number(detailsDialog.hall.base_price).toFixed(2)}</p>
                    </div>
                  )}
                  {detailsDialog.hall.contact_phone && (
                    <div>
                      <p className="font-medium text-muted-foreground">Contact Phone</p>
                      <p>{detailsDialog.hall.contact_phone}</p>
                    </div>
                  )}
                </div>

                {detailsDialog.hall.description && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{detailsDialog.hall.description}</p>
                  </div>
                )}

                {detailsDialog.hall.amenities && detailsDialog.hall.amenities.length > 0 && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {detailsDialog.hall.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
