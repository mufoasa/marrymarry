'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/lib/i18n/context';
import { Edit, Eye, MapPin, Users, Building2 } from 'lucide-react';
import type { Hall } from '@/lib/types/database';

interface OwnerVenuesListProps {
  venues: Hall[];
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function OwnerVenuesList({ venues }: OwnerVenuesListProps) {
  const { t } = useLanguage();

  if (venues.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('noVenuesYet')}</h3>
        <p className="text-muted-foreground mb-4">{t('addFirstVenueDescription')}</p>
        <Button asChild>
          <Link href="/dashboard/venues/new">{t('addFirstVenue')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">{t('image')}</TableHead>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('location')}</TableHead>
            <TableHead>{t('capacity')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell>
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  {venue.cover_image ? (
                    <Image
                      src={venue.cover_image || "/placeholder.svg"}
                      alt={venue.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{venue.name}</div>
                {venue.is_featured && (
                  <Badge variant="secondary" className="mt-1 text-xs">{t('featured')}</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.city}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {venue.capacity_max}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusStyles[venue.status]}>
                  {t(venue.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {venue.status === 'approved' && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/venues/${venue.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/venues/${venue.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
