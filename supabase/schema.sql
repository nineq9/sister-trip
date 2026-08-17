-- Sister Trip shared-data schema
-- Run in Supabase SQL editor AFTER the repository is private and a project is created.

create extension if not exists pgcrypto;

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date,
  ends_on date,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'member' check (role in ('owner','member')),
  avatar_key text,
  primary key (trip_id, user_id)
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  city text not null,
  name text not null,
  lat double precision,
  lng double precision,
  source_url text,
  photo_url text,
  story_title text,
  story_body text,
  audio_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  priority text not null check (priority in ('must','maybe')),
  created_at timestamptz not null default now(),
  unique (place_id, user_id)
);

create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  city text,
  flexibility text not null default 'flex' check (flexibility in ('locked','flex','wish')),
  lock_reason text,
  sort_order integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  itinerary_item_id uuid references public.itinerary_items(id) on delete set null,
  kind text not null check (kind in ('stay','transport','ticket','other')),
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  source_priority text not null default 'manual' check (source_priority in ('gmail','calendar','manual')),
  source_ref text,
  verification_status text not null default 'unverified' check (verification_status in ('verified','conflict','unverified')),
  private_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  city text not null,
  title text not null,
  hint text,
  answer text,
  place_id uuid references public.places(id) on delete set null,
  sort_order integer not null default 0
);

create table if not exists public.quest_progress (
  quest_id uuid not null references public.quests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz,
  primary key (quest_id, user_id)
);

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.places enable row level security;
alter table public.wishes enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.reservations enable row level security;
alter table public.quests enable row level security;
alter table public.quest_progress enable row level security;

create or replace function public.is_trip_member(target_trip uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = target_trip and user_id = auth.uid()
  );
$$;

create policy "members read trips" on public.trips
for select using (public.is_trip_member(id) or created_by = auth.uid());
create policy "owners create trips" on public.trips
for insert with check (created_by = auth.uid());
create policy "owners update trips" on public.trips
for update using (created_by = auth.uid());

create policy "members read membership" on public.trip_members
for select using (public.is_trip_member(trip_id));
create policy "trip owner manages membership" on public.trip_members
for all using (exists (select 1 from public.trips t where t.id = trip_id and t.created_by = auth.uid()))
with check (exists (select 1 from public.trips t where t.id = trip_id and t.created_by = auth.uid()));

create policy "members manage places" on public.places
for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy "members manage wishes" on public.wishes
for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id) and user_id = auth.uid());
create policy "members manage itinerary" on public.itinerary_items
for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy "members manage reservations" on public.reservations
for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy "members read quests" on public.quests
for select using (public.is_trip_member(trip_id));
create policy "members manage quest progress" on public.quest_progress
for all using (exists (select 1 from public.quests q where q.id = quest_id and public.is_trip_member(q.trip_id)))
with check (user_id = auth.uid() and exists (select 1 from public.quests q where q.id = quest_id and public.is_trip_member(q.trip_id)));

alter publication supabase_realtime add table public.wishes;
alter publication supabase_realtime add table public.itinerary_items;
alter publication supabase_realtime add table public.quest_progress;
