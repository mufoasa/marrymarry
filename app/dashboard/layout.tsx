import React from "react"
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import type { Profile } from '@/lib/types/database';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/auth/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <DashboardSidebar profile={profile as Profile} userEmail={user.email || ''} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
