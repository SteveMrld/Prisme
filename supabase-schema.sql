-- ============================================================
-- PRISME — Schema Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- Table profiles (étend auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text default 'inactive' check (
    subscription_status in ('active', 'inactive', 'past_due', 'canceled')
  ),
  subscription_end_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Lecture de son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Modification de son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Crée automatiquement un profil à chaque inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at automatique
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
