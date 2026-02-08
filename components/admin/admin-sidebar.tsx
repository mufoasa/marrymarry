'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  LogOut,
  Shield,
  CheckCircle,
  Home,
  Menu,
  Sparkles,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      title: t('overview'),
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: t('approvals'),
      href: '/admin/approvals',
      icon: CheckCircle,
    },
    {
      title: t('venues'),
      href: '/admin/venues',
      icon: Building2,
    },
    {
      title: t('serviceApprovals'),
      href: '/admin/service-approvals',
      icon: Sparkles,
    },
    {
      title: t('users'),
      href: '/admin/users',
      icon: Users,
    },
    {
      title: t('reservations'),
      href: '/admin/reservations',
      icon: Calendar,
    },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: t('error'),
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } else {
      router.push('/');
    }
  };

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="p-4 md:p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-semibold">{t('adminPanel')}</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
          <Link href="/" onClick={onNavigate}>
            <Home className="h-4 w-4 mr-2" />
            {t('backToSite')}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-lg font-serif font-semibold">{t('adminPanel')}</span>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex flex-col h-full">
              <SidebarContent onNavigate={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
