import { createClient } from "@/lib/supabase/server"
import { PendingServicesList } from "@/components/admin/pending-services-list"

async function getPendingServices() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("services")
    .select(`
      *,
      owner:profiles(id, full_name, phone)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function ServiceApprovalsPage() {
  const pendingServices = await getPendingServices()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-foreground">Service Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve service submissions from providers
        </p>
      </div>

      <PendingServicesList services={pendingServices} />
    </div>
  )
}
