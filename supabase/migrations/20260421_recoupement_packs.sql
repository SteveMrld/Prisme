-- =========================================================
-- Packs de recoupements achetés à l'unité (Stripe one-shot)
-- =========================================================

-- Colonne crédits extra (accumulés via achats de packs)
alter table public.profiles
  add column if not exists recoupement_extra_credits integer not null default 0;

-- Nouvelle logique de consommation :
-- 1) On consomme d'abord sur le quota mensuel (10 max)
-- 2) Si épuisé, on consomme sur extra_credits (pack acheté)
-- 3) Si rien des deux, on refuse (-1)
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
  current_month_count integer := 0;
  extra_credits       integer := 0;
  new_count           integer;
begin
  -- Lecture du compteur mensuel actuel
  select count into current_month_count
    from public.recoupement_usage
    where user_id = p_user_id and year_month = p_year_month;

  if current_month_count is null then current_month_count := 0; end if;

  -- Cas 1 : encore du quota mensuel disponible
  if current_month_count < p_max then
    insert into public.recoupement_usage (user_id, year_month, count)
    values (p_user_id, p_year_month, 1)
    on conflict (user_id, year_month)
    do update set
      count = public.recoupement_usage.count + 1,
      updated_at = now()
    returning count into new_count;
    return new_count;
  end if;

  -- Cas 2 : quota mensuel épuisé, on regarde les extras
  select recoupement_extra_credits into extra_credits
    from public.profiles where id = p_user_id;

  if extra_credits is null then extra_credits := 0; end if;

  if extra_credits > 0 then
    update public.profiles
      set recoupement_extra_credits = recoupement_extra_credits - 1
      where id = p_user_id;
    -- On retourne p_max + 1 pour signaler que c'est une conso sur extras
    -- Le client n'en a pas vraiment besoin, il lit extra_credits séparément
    return p_max + 1;
  end if;

  -- Cas 3 : rien nulle part
  return -1;
end;
$$;

grant execute on function public.increment_recoupement_usage(uuid, text, integer) to authenticated, service_role;

-- Fonction pour créditer un pack (utilisée uniquement par le webhook Stripe)
create or replace function public.grant_recoupement_pack(
  p_user_id uuid,
  p_amount  integer default 10
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_total integer;
begin
  update public.profiles
    set recoupement_extra_credits = coalesce(recoupement_extra_credits, 0) + p_amount
    where id = p_user_id
    returning recoupement_extra_credits into new_total;
  return new_total;
end;
$$;

grant execute on function public.grant_recoupement_pack(uuid, integer) to service_role;
