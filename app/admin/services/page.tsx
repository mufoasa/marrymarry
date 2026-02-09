import { createClient } from "@/lib/supabase/server"
import { AdminServicesList } from "@/components/admin/admin-services-list"

async function getAllServices() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("services")
    .select(`
      *,
      owner:profiles(id, full_name)
    `)
    .order("created_at", { ascending: false })

  return data || []
}

export default async function AdminServicesPage() {
  const services = await getAllServices()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-foreground">All Services</h1>
        <p className="text-muted-foreground mt-1">Manage all service providers on the platform</p>
      </div>

      <AdminServicesList services={services} />
    </div>
  )
}
