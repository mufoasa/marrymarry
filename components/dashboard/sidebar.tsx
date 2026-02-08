"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import {
  Heart,
  Home,
  Building2,
  Calendar,
  LogOut,
  ChevronLeft,
  Shield,
  Menu,
  Sparkles,
} from "lucide-react"
import type { Profile } from "@/lib/types/database"

interface SidebarProps {
  profile: Profile
  userEmail: string
}

function SidebarContent({ profile, userEmail, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getNavItems = () => {
    const baseItems = [
      {
        href: "/dashboard",
        label: t("overview"),
        icon: Home,
      },
    ]

    if (profile.role === "hall_owner") {
      return [
        ...baseItems,
        {
          href: "/dashboard/venues",
          label: t("myVenues"),
          icon: Building2,
        },
        {
          href: "/dashboard/reservations",
          label: t("reservations"),
          icon: Calendar,
        },
      ]
    }

    if (profile.role === "service_provider") {
      return [
        ...baseItems,
        {
          href: "/dashboard/my-services",
          label: t("myServices"),
          icon: Sparkles,
        },
      ]
    }

    if (profile.role === "admin") {
      return [
        ...baseItems,
        {
          href: "/admin",
          label: t("adminPanel"),
          icon: Shield,
        },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <span className="text-lg font-serif font-semibold text-sidebar-foreground">Marry.mk</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {profile.full_name || userEmail}
          </p>
          <p className="text-xs text-sidebar-foreground/60 capitalize">
            {profile.role.replace("_", " ")}
          </p>
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToSite")}
          </Link>
          <button
            onClick={() => {
              handleSignOut()
              onNavigate?.()
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ profile, userEmail }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <span className="text-lg font-serif font-semibold">Marry.mk</span>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SidebarContent 
              profile={profile} 
              userEmail={userEmail} 
              onNavigate={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-sidebar flex-col shrink-0">
        <SidebarContent profile={profile} userEmail={userEmail} />
      </aside>
    </>
  )
}
