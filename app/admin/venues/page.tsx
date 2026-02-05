import { createClient } from "@/lib/supabase/server"
import { AdminVenuesList } from "@/components/admin/admin-venues-list"

async function getAllHalls() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("halls")
    .select(`
      *,
      owner:profiles(id, full_name)
    `)
    .order("created_at", { ascending: false })

  return data || []
}

export default async function AdminVenuesPage() {
  const halls = await getAllHalls()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-foreground">All Venues</h1>
        <p className="text-muted-foreground mt-1">Manage all venues on the platform</p>
      </div>

      <AdminVenuesList halls={halls} />
    </div>
  )
}
