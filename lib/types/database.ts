export type UserRole = 'customer' | 'hall_owner' | 'service_owner' | 'admin';
export type HallStatus = 'pending' | 'approved' | 'rejected';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export type Language = 'en' | 'sq' | 'mk';
export type ServiceCategory = 'hair_salon' | 'nail_salon' | 'makeup' | 'decorator' | 'photographer' | 'videographer' | 'florist' | 'catering' | 'music_dj' | 'wedding_planner' | 'transport' | 'other';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  preferred_language: Language;
  created_at: string;
  updated_at: string;
}

export interface Hall {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  description_sq: string | null;
  description_mk: string | null;
  location: string;
  city: string;
  address: string | null;
  capacity_min: number | null;
  capacity_max: number;
  price_per_guest: number | null;
  base_price: number | null;
  amenities: string[];
  images: string[];
  cover_image: string | null;
  status: HallStatus;
  is_featured: boolean;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  hall_id: string;
  customer_id: string;
  event_date: string;
  guest_count: number;
  total_price: number | null;
  status: ReservationStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  hall?: Hall;
}

export interface Inquiry {
  id: string;
  hall_id: string | null;
  customer_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  event_date: string | null;
  guest_count: number | null;
  is_read: boolean;
  created_at: string;
  // Joined fields
  hall?: Hall;
}

export interface Service {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  description_sq: string | null;
  description_mk: string | null;
  category: ServiceCategory;
  location: string;
  city: string;
  address: string | null;
  price_from: number | null;
  price_to: number | null;
  images: string[];
  cover_image: string | null;
  status: HallStatus;
  is_featured: boolean;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}
