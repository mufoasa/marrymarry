"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/i18n/context"
import {
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  Check,
  X,
  Search,
  Loader2,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
} from "lucide-react"
import type { Service, Profile } from "@/lib/types/database"

interface ServiceWithOwner extends Service {
  owner: Pick<Profile, "id" | "full_name"> | null
}

interface AdminServicesListProps {
  services: ServiceWithOwner[]
}

const CATEGORY_LABELS: Record<string, string> = {
  hair_salon: "Hair Salon",
  nail_salon: "Nail Salon",
  makeup: "Makeup Artist",
  decorator: "Decorator",
  photographer: "Photographer",
  videographer: "Videographer",
  florist: "Florist",
  catering: "Catering",
  music_dj: "Music & DJ",
  wedding_planner: "Wedding Planner",
  transport: "Transport",
  other: "Other",
}

export function AdminServicesList({ services: initialServices }: AdminServicesListProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [services, setServices] = useState(initialServices)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceWithOwner | null>(null)

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  async function updateService(serviceId: string, updates: Partial<Service>) {
    setProcessing(serviceId)
    const supabase = createClient()

    const { error } = await supabase
      .from("services")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", serviceId)

    if (error) {
      toast({
        title: t("error"),
        description: "Failed to update service",
        variant: "destructive",
      })
    } else {
      toast({ title: t("success"), description: "Service updated" })
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, ...updates } : s))
      )
      router.refresh()
    }
    setProcessing(null)
  }

  async function deleteService(serviceId: string) {
    if (!confirm("Are you sure you want to delete this service?")) return

    setProcessing(serviceId)
    const supabase = createClient()

    const { error } = await supabase.from("services").delete().eq("id", serviceId)

    if (error) {
      toast({
        title: t("error"),
        description: "Failed to delete service",
        variant: "destructive",
      })
    } else {
      toast({ title: t("success"), description: "Service has been removed" })
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      router.refresh()
    }
    setProcessing(null)
  }

  const getStatusBadge = (status: string, isFeatured: boolean) => (
    <div className="flex items-center gap-2 flex-wrap">
      {status === "approved" ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      ) : status === "rejected" ? (
        <Badge variant="destructive">Rejected</Badge>
      ) : (
        <Badge variant="secondary">Pending</Badge>
      )}
      {isFeatured && (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Star className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
    </div>
  )

  const getCategoryBadge = (category: string) => (
    <Badge variant="outline" className="text-xs">
      {t(category) || CATEGORY_LABELS[category] || category}
    </Badge>
  )

  const formatPrice = (from: number | null, to: number | null) => {
    if (!from && !to) return "-"
    if (from && to) return `${from.toLocaleString()} - ${to.toLocaleString()} MKD`
    if (from) return `${t("from")} ${from.toLocaleString()} MKD`
    return `${t("from")} ${to?.toLocaleString()} MKD`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <CardTitle>Services ({filteredServices.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No services found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium hover:underline text-left"
                          onClick={() => setSelectedService(service)}
                        >
                          {service.name}
                        </button>
                      </TableCell>
                      <TableCell>{getCategoryBadge(service.category)}</TableCell>
                      <TableCell>{service.owner?.full_name || "Unknown"}</TableCell>
                      <TableCell>{service.city}</TableCell>
                      <TableCell className="text-sm">
                        {formatPrice(service.price_from, service.price_to)}
                      </TableCell>
                      <TableCell>{getStatusBadge(service.status, service.is_featured)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={processing === service.id}>
                              {processing === service.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedService(service)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {service.status !== "approved" && (
                              <DropdownMenuItem onClick={() => updateService(service.id, { status: "approved" })}>
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {service.status !== "rejected" && (
                              <DropdownMenuItem onClick={() => updateService(service.id, { status: "rejected" })}>
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            {service.status === "approved" && (
                              <DropdownMenuItem onClick={() => updateService(service.id, { status: "rejected" })}>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Disable
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {service.is_featured ? (
                              <DropdownMenuItem onClick={() => updateService(service.id, { is_featured: false })}>
                                <StarOff className="h-4 w-4 mr-2" />
                                Remove Featured
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => updateService(service.id, { is_featured: true, status: "approved" })}>
                                <Star className="h-4 w-4 mr-2" />
                                Make Featured
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedService.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Cover Image */}
                {selectedService.cover_image && (
                  <div className="rounded-lg overflow-hidden border h-48">
                    <img
                      src={selectedService.cover_image || "/placeholder.svg"}
                      alt={selectedService.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Status & Category */}
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedService.status, selectedService.is_featured)}
                  {getCategoryBadge(selectedService.category)}
                </div>

                {/* Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{selectedService.city}</p>
                        {selectedService.address && (
                          <p className="text-muted-foreground">{selectedService.address}</p>
                        )}
                      </div>
                    </div>
                    {selectedService.contact_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedService.contact_phone}</span>
                      </div>
                    )}
                    {selectedService.contact_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedService.contact_email}</span>
                      </div>
                    )}
                    {selectedService.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={selectedService.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          {selectedService.website}
                        </a>
                      </div>
                    )}
                    {selectedService.instagram && (
                      <div className="flex items-center gap-2 text-sm">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedService.instagram}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Owner</p>
                      <p className="text-sm">{selectedService.owner?.full_name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Price Range</p>
                      <p className="text-sm">{formatPrice(selectedService.price_from, selectedService.price_to)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">{new Date(selectedService.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedService.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm leading-relaxed">{selectedService.description}</p>
                  </div>
                )}

                {/* Gallery */}
                {selectedService.images && selectedService.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Gallery ({selectedService.images.length} images)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedService.images.map((img, i) => (
                        <div key={i} className="rounded-md overflow-hidden border h-24">
                          <img src={img || "/placeholder.svg"} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {selectedService.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateService(selectedService.id, { status: "approved" })
                        setSelectedService(null)
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {selectedService.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        updateService(selectedService.id, { status: "rejected" })
                        setSelectedService(null)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  )}
                  {selectedService.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateService(selectedService.id, { status: "rejected" })
                        setSelectedService(null)
                      }}
                    >
                      <EyeOff className="h-4 w-4 mr-1" />
                      Disable
                    </Button>
                  )}
                  {selectedService.is_featured ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateService(selectedService.id, { is_featured: false })
                        setSelectedService(null)
                      }}
                    >
                      <StarOff className="h-4 w-4 mr-1" />
                      Remove Featured
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-700 border-amber-300 hover:bg-amber-50 bg-transparent"
                      onClick={() => {
                        updateService(selectedService.id, { is_featured: true, status: "approved" })
                        setSelectedService(null)
                      }}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Make Featured
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
