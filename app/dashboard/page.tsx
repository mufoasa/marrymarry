import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Users, TrendingUp } from 'lucide-react';
import type { Profile } from '@/lib/types/database';
import { redirect } from 'next/navigation';

interface DashboardStats {
  totalReservations?: number;
  pendingReservations?: number;
  confirmedReservations?: number;
  totalVenues?: number;
  pendingVenues?: number;
  totalUsers?: number;
  unreadInquiries?: number;
}

async function getDashboardData() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { profile: null, stats: {} };
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { profile: null, stats: {} };
  }

  let stats: DashboardStats = {};

  if (profile.role === 'customer') {
    const [reservationsRes, pendingRes, confirmedRes] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('customer_id', profile.id),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('customer_id', profile.id).eq('status', 'pending'),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('customer_id', profile.id).eq('status', 'confirmed'),
    ]);

    stats = {
      totalReservations: reservationsRes.count || 0,
      pendingReservations: pendingRes.count || 0,
      confirmedReservations: confirmedRes.count || 0,
    };
  }

  if (profile.role === 'hall_owner') {
    const { data: hallIds } = await supabase
      .from('halls')
      .select('id')
      .eq('owner_id', profile.id);

    const ids = hallIds?.map(h => h.id) || [];

    const [venuesRes, reservationsRes, pendingRes, inquiriesRes] = await Promise.all([
      supabase.from('halls').select('*', { count: 'exact', head: true }).eq('owner_id', profile.id),
      ids.length > 0 
        ? supabase.from('reservations').select('*', { count: 'exact', head: true }).in('hall_id', ids)
        : Promise.resolve({ count: 0 }),
      ids.length > 0 
        ? supabase.from('reservations').select('*', { count: 'exact', head: true }).in('hall_id', ids).eq('status', 'pending')
        : Promise.resolve({ count: 0 }),
      ids.length > 0 
        ? supabase.from('inquiries').select('*', { count: 'exact', head: true }).in('hall_id', ids).eq('is_read', false)
        : Promise.resolve({ count: 0 }),
    ]);

    stats = {
      totalVenues: venuesRes.count || 0,
      totalReservations: reservationsRes.count || 0,
      pendingReservations: pendingRes.count || 0,
      unreadInquiries: inquiriesRes.count || 0,
    };
  }

  if (profile.role === 'admin') {
    const [totalVenuesRes, pendingVenuesRes, totalUsersRes, totalReservationsRes] = await Promise.all([
      supabase.from('halls').select('*', { count: 'exact', head: true }),
      supabase.from('halls').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
    ]);

    stats = {
      totalVenues: totalVenuesRes.count || 0,
      pendingVenues: pendingVenuesRes.count || 0,
      totalUsers: totalUsersRes.count || 0,
      totalReservations: totalReservationsRes.count || 0,
    };
  }

  return { profile: profile as Profile, stats };
}

export default async function DashboardPage() {
  const { profile, stats } = await getDashboardData();
  
  if (!profile) {
    redirect('/auth/login');
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold">
          Welcome back, {profile?.full_name || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your {profile?.role === 'admin' ? 'platform' : 'activity'}
        </p>
      </div>

      {/* Customer Stats */}
      {profile?.role === 'customer' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmedReservations}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hall Owner Stats */}
      {profile?.role === 'hall_owner' && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Venues</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVenues}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadInquiries}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Stats */}
      {profile?.role === 'admin' && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVenues}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVenues}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
