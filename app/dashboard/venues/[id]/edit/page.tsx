"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { VenueForm } from "@/components/dashboard/venue-form"
import { useLanguage } from "@/lib/i18n/context"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Hall } from "@/lib/types/database"

export default function EditVenuePage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [hall, setHall] = useState<Hall | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHall() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("halls")
        .select("*")
        .eq("id", params.id)
        .eq("owner_id", user.id)
        .single()

      if (error || !data) {
        router.push("/dashboard/venues")
        return
      }

      setHall(data)
      setLoading(false)
    }

    fetchHall()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!hall) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/venues">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {t("editVenue")}
          </h1>
          <p className="text-muted-foreground">{hall.name}</p>
        </div>
      </div>

      <VenueForm hall={hall} />
    </div>
  )
}
