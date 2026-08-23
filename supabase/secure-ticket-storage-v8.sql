-- Sister Trip v8: private ticket storage.
-- Public-safe migration: contains schema/policy definitions only, never ticket data.

alter table public.ticket_assets
  add column if not exists storage_path text,
  add column if not exists original_name text,
  add column if not exists byte_size bigint,
  add column if not exists uploaded_by uuid references auth.users(id) on delete set null,
  add column if not exists offline_allowed boolean not null default true;

alter table public.ticket_assets alter column asset_data drop not null;
create unique index if not exists ticket_assets_storage_path_uidx on public.ticket_assets(storage_path) where storage_path is not null;
create index if not exists ticket_assets_trip_source_idx on public.ticket_assets(trip_id, source_ref);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trip-tickets', 'trip-tickets', false, 15728640, array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "trip ticket members read" on storage.objects;
drop policy if exists "trip ticket owners insert" on storage.objects;
drop policy if exists "trip ticket owners update" on storage.objects;
drop policy if exists "trip ticket owners delete" on storage.objects;

create policy "trip ticket members read" on storage.objects
for select to authenticated
using (
  bucket_id = 'trip-tickets'
  and exists (
    select 1 from public.trip_members tm
    where tm.user_id = (select auth.uid())
      and tm.trip_id::text = (storage.foldername(name))[1]
  )
);

create policy "trip ticket owners insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'trip-tickets'
  and exists (
    select 1 from public.trips t
    where t.owner_user_id = (select auth.uid())
      and t.id::text = (storage.foldername(name))[1]
  )
);

create policy "trip ticket owners update" on storage.objects
for update to authenticated
using (
  bucket_id = 'trip-tickets'
  and exists (
    select 1 from public.trips t
    where t.owner_user_id = (select auth.uid())
      and t.id::text = (storage.foldername(name))[1]
  )
)
with check (
  bucket_id = 'trip-tickets'
  and exists (
    select 1 from public.trips t
    where t.owner_user_id = (select auth.uid())
      and t.id::text = (storage.foldername(name))[1]
  )
);

create policy "trip ticket owners delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'trip-tickets'
  and exists (
    select 1 from public.trips t
    where t.owner_user_id = (select auth.uid())
      and t.id::text = (storage.foldername(name))[1]
  )
);

revoke execute on function public.accept_trip_invite(text,text) from public, anon;
revoke execute on function public.is_trip_member(uuid) from public, anon;
revoke execute on function public.is_trip_owner(uuid) from public, anon;
grant execute on function public.accept_trip_invite(text,text) to authenticated;
grant execute on function public.is_trip_member(uuid) to authenticated;
grant execute on function public.is_trip_owner(uuid) to authenticated;
