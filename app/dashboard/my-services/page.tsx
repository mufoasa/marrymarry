'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/context';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import type { Service } from '@/lib/types/database';

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchServices() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      setServices(data || []);
      setIsLoading(false);
    }
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const supabase = createClient();
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold">{t('myServices')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('manageServices')}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/my-services/new" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('addService')}
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium text-muted-foreground mb-4">{t('noServicesYet')}</p>
            <Button asChild>
              <Link href="/dashboard/my-services/new" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('addService')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {service.cover_image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border">
                      <img
                        src={service.cover_image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{t(service.category)} &middot; {service.city}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(service.status)}>
                        {t(service.status)}
                      </Badge>
                      {service.price_from && (
                        <span className="text-sm text-muted-foreground">
                          {t('from')} &euro;{Number(service.price_from).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {service.status === 'approved' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/services/${service.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/my-services/${service.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
