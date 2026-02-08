import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Calendar, Clock, CheckCircle, XCircle, Sparkles } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalHalls },
    { count: pendingHalls },
    { count: approvedHalls },
    { count: totalUsers },
    { count: hallOwners },
    { count: totalReservations },
    { count: pendingReservations },
    { count: totalServices },
    { count: pendingServices },
  ] = await Promise.all([
    supabase.from("halls").select("*", { count: "exact", head: true }),
    supabase.from("halls").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("halls").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "hall_owner"),
    supabase.from("reservations").select("*", { count: "exact", head: true }),
    supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ])

  return {
    totalHalls: totalHalls || 0,
    pendingHalls: pendingHalls || 0,
    approvedHalls: approvedHalls || 0,
    totalUsers: totalUsers || 0,
    hallOwners: hallOwners || 0,
    totalReservations: totalReservations || 0,
    pendingReservations: pendingReservations || 0,
    totalServices: totalServices || 0,
    pendingServices: pendingServices || 0,
  }
}

async function getRecentHalls() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("halls")
    .select(`
      id,
      name,
      city,
      status,
      created_at,
      owner:profiles(full_name, email:id)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

export default async function AdminDashboardPage() {
  const stats = await getStats()
  const recentHalls = await getRecentHalls()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of platform activity and pending actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHalls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedHalls} approved, {stats.pendingHalls} pending
            </p>
          </CardContent>
        </Card>

        <Link href="/admin/approvals">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingHalls}</div>
              <p className="text-xs text-muted-foreground">Venues awaiting review</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.hallOwners} venue owners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingReservations} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
          </CardContent>
        </Card>

        <Link href="/admin/service-approvals">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingServices}</div>
              <p className="text-xs text-muted-foreground">Services awaiting review</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Venues */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Venue Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentHalls.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No venues submitted yet</p>
          ) : (
            <div className="space-y-4">
              {recentHalls.map((hall) => (
                <div
                  key={hall.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{hall.name}</p>
                    <p className="text-sm text-muted-foreground">{hall.city}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(hall.created_at).toLocaleDateString()}
                    </span>
                    {hall.status === "approved" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Approved
                      </span>
                    ) : hall.status === "rejected" ? (
                      <span className="flex items-center gap-1 text-destructive text-sm">
                        <XCircle className="h-4 w-4" />
                        Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 text-sm">
                        <Clock className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
