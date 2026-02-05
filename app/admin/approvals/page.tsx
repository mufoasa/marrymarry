import { createClient } from "@/lib/supabase/server"
import { PendingApprovalsList } from "@/components/admin/pending-approvals-list"

async function getPendingHalls() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("halls")
    .select(`
      *,
      owner:profiles(id, full_name, phone)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function ApprovalsPage() {
  const pendingHalls = await getPendingHalls()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-foreground">Pending Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve venue submissions from hall owners
        </p>
      </div>

      <PendingApprovalsList halls={pendingHalls} />
    </div>
  )
}
