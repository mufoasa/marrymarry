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
import { useLanguage } from "@/lib/i18n/context"
import { MapPin, Phone, Check, X, Loader2, Eye, Star, Sparkles, Globe, Instagram, DollarSign } from "lucide-react"
import Image from "next/image"
import type { Service, Profile } from "@/lib/types/database"

interface ServiceWithOwner extends Service {
  owner: Pick<Profile, "id" | "full_name" | "phone"> | null
}

interface PendingServicesListProps {
  services: ServiceWithOwner[]
}

export function PendingServicesList({ services: initialServices }: PendingServicesListProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [services, setServices] = useState(initialServices)
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; serviceId: string | null }>({
    open: false,
    serviceId: null,
  })
  const [rejectReason, setRejectReason] = useState("")
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; service: ServiceWithOwner | null }>({
    open: false,
    service: null,
  })

  async function handleApprove(serviceId: string, makeFeatured = false) {
    setProcessing(serviceId)
    const supabase = createClient()

    const { error } = await supabase
      .from("services")
      .update({
        status: "approved",
        is_featured: makeFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serviceId)

    if (error) {
      toast({
        title: t("error"),
        description: "Failed to approve service",
        variant: "destructive",
      })
    } else {
      toast({
        title: t("success"),
        description: `Service approved${makeFeatured ? " and featured" : ""}`,
      })
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      router.refresh()
    }
    setProcessing(null)
  }

  async function handleReject() {
    if (!rejectDialog.serviceId) return

    setProcessing(rejectDialog.serviceId)
    const supabase = createClient()

    const { error } = await supabase
      .from("services")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", rejectDialog.serviceId)

    if (error) {
      toast({
        title: t("error"),
        description: "Failed to reject service",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Service Rejected",
        description: "The service provider will be notified",
      })
      setServices((prev) => prev.filter((s) => s.id !== rejectDialog.serviceId))
      router.refresh()
    }
    setProcessing(null)
    setRejectDialog({ open: false, serviceId: null })
    setRejectReason("")
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Check className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-muted-foreground">No services pending approval</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              {service.cover_image ? (
                <Image
                  src={service.cover_image || "/placeholder.svg"}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Sparkles className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-amber-500">{t("pending")}</Badge>
              <Badge className="absolute top-2 left-2" variant="secondary">
                {t(service.category)}
              </Badge>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {service.city}{service.address ? `, ${service.address}` : ''}
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                {(service.price_from || service.price_to) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {service.price_from ? `${Number(service.price_from).toFixed(0)}` : ''}
                      {service.price_from && service.price_to ? ' - ' : ''}
                      {service.price_to ? `${Number(service.price_to).toFixed(0)}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {service.owner && (
                <div className="mt-3 p-2 bg-muted/50 rounded-md text-sm">
                  <p className="font-medium">{service.owner.full_name || "Unknown Provider"}</p>
                  {service.owner.phone && (
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {service.owner.phone}
                    </p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setDetailsDialog({ open: true, service })}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1"
                  onClick={() => handleApprove(service.id)}
                  disabled={processing === service.id}
                >
                  {processing === service.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t("approve")}
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setRejectDialog({ open: true, serviceId: service.id })}
                  disabled={processing === service.id}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("reject")}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleApprove(service.id, true)}
                disabled={processing === service.id}
              >
                <Star className="h-4 w-4 mr-2" />
                Approve & Feature
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, serviceId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this service? You can optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, serviceId: null })}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing !== null}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, service: null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {detailsDialog.service && (
            <>
              <DialogHeader>
                <DialogTitle>{detailsDialog.service.name}</DialogTitle>
                <DialogDescription>
                  <Badge variant="secondary" className="mr-2">{t(detailsDialog.service.category)}</Badge>
                  {detailsDialog.service.city}{detailsDialog.service.address ? `, ${detailsDialog.service.address}` : ''}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {detailsDialog.service.cover_image && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={detailsDialog.service.cover_image || "/placeholder.svg"}
                      alt={detailsDialog.service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Gallery */}
                {detailsDialog.service.images && detailsDialog.service.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {detailsDialog.service.images.map((img, i) => (
                      <div key={i} className="aspect-video relative rounded-md overflow-hidden">
                        <Image src={img || "/placeholder.svg"} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {(detailsDialog.service.price_from || detailsDialog.service.price_to) && (
                    <div>
                      <p className="font-medium text-muted-foreground">Price Range</p>
                      <p>
                        {detailsDialog.service.price_from ? `${Number(detailsDialog.service.price_from).toFixed(0)}` : ''}
                        {detailsDialog.service.price_from && detailsDialog.service.price_to ? ' - ' : ''}
                        {detailsDialog.service.price_to ? `${Number(detailsDialog.service.price_to).toFixed(0)}` : ''}
                      </p>
                    </div>
                  )}
                  {detailsDialog.service.contact_phone && (
                    <div>
                      <p className="font-medium text-muted-foreground">Phone</p>
                      <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{detailsDialog.service.contact_phone}</p>
                    </div>
                  )}
                  {detailsDialog.service.contact_email && (
                    <div>
                      <p className="font-medium text-muted-foreground">Email</p>
                      <p>{detailsDialog.service.contact_email}</p>
                    </div>
                  )}
                  {detailsDialog.service.website && (
                    <div>
                      <p className="font-medium text-muted-foreground">Website</p>
                      <p className="flex items-center gap-1"><Globe className="h-3 w-3" />{detailsDialog.service.website}</p>
                    </div>
                  )}
                  {detailsDialog.service.instagram && (
                    <div>
                      <p className="font-medium text-muted-foreground">Instagram</p>
                      <p className="flex items-center gap-1"><Instagram className="h-3 w-3" />{detailsDialog.service.instagram}</p>
                    </div>
                  )}
                </div>

                {detailsDialog.service.description && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">{t("description")}</p>
                    <p className="text-sm">{detailsDialog.service.description}</p>
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
