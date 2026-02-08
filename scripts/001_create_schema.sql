-- Marry.mk Wedding Hall Booking Platform Database Schema

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'hall_owner', 'admin')),
  preferred_language text default 'en',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Halls table
create table if not exists public.halls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  city text not null,
  address text,
  capacity integer not null,
  price_per_event numeric(10, 2) not null,
  amenities text[] default '{}',
  images text[] default '{}',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean default false,
  admin_notes text,
  contact_email text,
  contact_phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Reservations table
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  hall_id uuid not null references public.halls(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  event_date date not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  notes text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (hall_id, event_date)
);

-- Contact inquiries table
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  hall_id uuid references public.halls(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.halls enable row level security;
alter table public.reservations enable row level security;
alter table public.inquiries enable row level security;

-- Profiles policies
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Halls policies
drop policy if exists "Anyone can view approved halls" on public.halls;
create policy "Anyone can view approved halls"
  on public.halls for select
  using (status = 'approved');

drop policy if exists "Hall owners can view their own halls" on public.halls;
create policy "Hall owners can view their own halls"
  on public.halls for select
  using (owner_id = auth.uid());

drop policy if exists "Hall owners can insert their own halls" on public.halls;
create policy "Hall owners can insert their own halls"
  on public.halls for insert
  with check (owner_id = auth.uid());

drop policy if exists "Hall owners can update their own halls" on public.halls;
create policy "Hall owners can update their own halls"
  on public.halls for update
  using (owner_id = auth.uid());

drop policy if exists "Admins can view all halls" on public.halls;
create policy "Admins can view all halls"
  on public.halls for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can update all halls" on public.halls;
create policy "Admins can update all halls"
  on public.halls for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can delete any hall" on public.halls;
create policy "Admins can delete any hall"
  on public.halls for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Reservations policies
drop policy if exists "Customers can view their own reservations" on public.reservations;
create policy "Customers can view their own reservations"
  on public.reservations for select
  using (customer_id = auth.uid());

drop policy if exists "Customers can create reservations" on public.reservations;
create policy "Customers can create reservations"
  on public.reservations for insert
  with check (customer_id = auth.uid());

drop policy if exists "Hall owners can view reservations for their halls" on public.reservations;
create policy "Hall owners can view reservations for their halls"
  on public.reservations for select
  using (
    exists (
      select 1 from public.halls
      where halls.id = reservations.hall_id
      and halls.owner_id = auth.uid()
    )
  );

drop policy if exists "Hall owners can update reservations for their halls" on public.reservations;
create policy "Hall owners can update reservations for their halls"
  on public.reservations for update
  using (
    exists (
      select 1 from public.halls
      where halls.id = reservations.hall_id
      and halls.owner_id = auth.uid()
    )
  );

drop policy if exists "Admins can view all reservations" on public.reservations;
create policy "Admins can view all reservations"
  on public.reservations for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Inquiries policies
drop policy if exists "Anyone can create inquiries" on public.inquiries;
create policy "Anyone can create inquiries"
  on public.inquiries for insert
  with check (true);

drop policy if exists "Hall owners can view inquiries for their halls" on public.inquiries;
create policy "Hall owners can view inquiries for their halls"
  on public.inquiries for select
  using (
    exists (
      select 1 from public.halls
      where halls.id = inquiries.hall_id
      and halls.owner_id = auth.uid()
    )
  );

drop policy if exists "Admins can view all inquiries" on public.inquiries;
create policy "Admins can view all inquiries"
  on public.inquiries for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, preferred_language)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'customer'),
    coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create indexes for better query performance
create index if not exists idx_halls_status on public.halls(status);
create index if not exists idx_halls_city on public.halls(city);
create index if not exists idx_halls_featured on public.halls(is_featured);
create index if not exists idx_halls_owner on public.halls(owner_id);
create index if not exists idx_reservations_hall on public.reservations(hall_id);
create index if not exists idx_reservations_customer on public.reservations(customer_id);
create index if not exists idx_reservations_date on public.reservations(event_date);
