-- =========================================================
-- Quota mensuel Recoupement — 10 requêtes / mois / abonné
-- =========================================================

create table if not exists public.recoupement_usage (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  year_month  text        not null,
  count       integer     not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (user_id, year_month)
);

alter table public.recoupement_usage enable row level security;

drop policy if exists "users read own usage" on public.recoupement_usage;
create policy "users read own usage"
  on public.recoupement_usage
  for select
  using (auth.uid() = user_id);

create or replace function public.increment_recoupement_usage(
  p_user_id     uuid,
  p_year_month  text,
  p_max         integer default 10
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.recoupement_usage (user_id, year_month, count)
  values (p_user_id, p_year_month, 1)
  on conflict (user_id, year_month)
  do update set
    count = public.recoupement_usage.count + 1,
    updated_at = now()
  returning count into new_count;

  if new_count > p_max then
    update public.recoupement_usage
      set count = p_max, updated_at = now()
      where user_id = p_user_id and year_month = p_year_month;
    return -1;
  end if;

  return new_count;
end;
$$;

grant execute on function public.increment_recoupement_usage(uuid, text, integer) to authenticated, service_role;
