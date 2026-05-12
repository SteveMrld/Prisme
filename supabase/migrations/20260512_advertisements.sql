-- =========================================================
-- Emplacements publicitaires éditoriaux SOARA
-- Brand Studio NYT / Le Monde Tendances, pas d'AdSense
-- =========================================================

create table if not exists public.advertisements (
  id            uuid primary key default gen_random_uuid(),
  slot_id       text not null,
  image_url     text,
  title         text not null,
  body          text,
  target_url    text not null,
  advertiser    text not null,
  start_date    date not null,
  end_date      date not null,
  active        boolean not null default true,
  impressions   bigint not null default 0,
  clicks        bigint not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists advertisements_slot_active_idx
  on public.advertisements (slot_id, active, start_date, end_date);

alter table public.advertisements enable row level security;

drop policy if exists ads_public_read on public.advertisements;
create policy ads_public_read on public.advertisements
  for select
  using (
    active = true
    and current_date between start_date and end_date
  );

drop policy if exists ads_admin_all on public.advertisements;
create policy ads_admin_all on public.advertisements
  for all
  using (auth.jwt() ->> 'email' = 'steve.moradel@gmail.com')
  with check (auth.jwt() ->> 'email' = 'steve.moradel@gmail.com');

create or replace function public.bump_ad_impression(ad_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.advertisements
     set impressions = impressions + 1
   where id = ad_id;
$$;

create or replace function public.bump_ad_click(ad_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.advertisements
     set clicks = clicks + 1
   where id = ad_id;
$$;

grant execute on function public.bump_ad_impression(uuid) to anon, authenticated, service_role;
grant execute on function public.bump_ad_click(uuid)      to anon, authenticated, service_role;

-- Bucket de stockage des images publicitaires (à exécuter une fois côté Supabase) :
--   insert into storage.buckets (id, name, public) values ('ads', 'ads', true);
--   create policy "ads_public_read"  on storage.objects for select using (bucket_id = 'ads');
--   create policy "ads_admin_write"  on storage.objects for insert with check (
--     bucket_id = 'ads' and auth.jwt() ->> 'email' = 'steve.moradel@gmail.com'
--   );
--   create policy "ads_admin_update" on storage.objects for update using (
--     bucket_id = 'ads' and auth.jwt() ->> 'email' = 'steve.moradel@gmail.com'
--   );
--   create policy "ads_admin_delete" on storage.objects for delete using (
--     bucket_id = 'ads' and auth.jwt() ->> 'email' = 'steve.moradel@gmail.com'
--   );
