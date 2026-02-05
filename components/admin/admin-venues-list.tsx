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
import { toast } from "@/hooks/use-toast"
import { MoreHorizontal, Star, StarOff, Trash2, Check, X, Search, Loader2 } from "lucide-react"
import type { Hall, Profile } from "@/lib/types/database"

interface HallWithOwner extends Hall {
  owner: Pick<Profile, "id" | "full_name"> | null
}

interface AdminVenuesListProps {
  halls: HallWithOwner[]
}

export function AdminVenuesList({ halls: initialHalls }: AdminVenuesListProps) {
  const router = useRouter()
  const [halls, setHalls] = useState(initialHalls)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [processing, setProcessing] = useState<string | null>(null)

  const filteredHalls = halls.filter((hall) => {
    const matchesSearch =
      hall.name.toLowerCase().includes(search.toLowerCase()) ||
      hall.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || hall.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function updateHall(hallId: string, updates: Partial<Hall>) {
    setProcessing(hallId)
    const supabase = createClient()

    const { error } = await supabase
      .from("halls")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", hallId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update venue",
        variant: "destructive",
      })
    } else {
      toast({ title: "Success", description: "Venue updated" })
      setHalls((prev) =>
        prev.map((h) => (h.id === hallId ? { ...h, ...updates } : h))
      )
      router.refresh()
    }
    setProcessing(null)
  }

  async function deleteHall(hallId: string) {
    if (!confirm("Are you sure you want to delete this venue?")) return

    setProcessing(hallId)
    const supabase = createClient()

    const { error } = await supabase.from("halls").delete().eq("id", hallId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive",
      })
    } else {
      toast({ title: "Deleted", description: "Venue has been removed" })
      setHalls((prev) => prev.filter((h) => h.id !== hallId))
      router.refresh()
    }
    setProcessing(null)
  }

  const getStatusBadge = (status: string, isFeatured: boolean) => {
    return (
      <div className="flex items-center gap-2">
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
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <CardTitle>Venues ({filteredHalls.length})</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues..."
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Venue</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHalls.map((hall) => (
              <TableRow key={hall.id}>
                <TableCell className="font-medium">{hall.name}</TableCell>
                <TableCell>{hall.owner?.full_name || "Unknown"}</TableCell>
                <TableCell>{hall.city}</TableCell>
                <TableCell>{hall.capacity_max} guests</TableCell>
                <TableCell>{getStatusBadge(hall.status, hall.is_featured || false)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={processing === hall.id}>
                        {processing === hall.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {hall.status !== "approved" && (
                        <DropdownMenuItem onClick={() => updateHall(hall.id, { status: "approved" })}>
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {hall.status !== "rejected" && (
                        <DropdownMenuItem onClick={() => updateHall(hall.id, { status: "rejected" })}>
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {hall.is_featured ? (
                        <DropdownMenuItem onClick={() => updateHall(hall.id, { is_featured: false })}>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove Featured
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => updateHall(hall.id, { is_featured: true })}>
                          <Star className="h-4 w-4 mr-2" />
                          Make Featured
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteHall(hall.id)}
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
      </CardContent>
    </Card>
  )
}
