-- Profiles table: one row per user, holds subscription status
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row when someone signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trips table (mirrors the current localStorage shape)
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  template_id text not null,
  destination text,
  departure_airport text,
  arrival_airport text,
  start_date date,
  end_date date,
  items jsonb not null default '[]'::jsonb,
  document_items jsonb not null default '[]'::jsonb,
  research_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.trips enable row level security;

create policy "Users can view their own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trips"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "Users can delete their own trips"
  on public.trips for delete
  using (auth.uid() = user_id);
