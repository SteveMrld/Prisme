-- =========================================================
-- Verrou anti-course pour Recoupement
-- cf. RAPPORT_AUDIT §5.2 : un utilisateur pouvait lancer N requêtes
-- Anthropic en parallèle alors qu'il n'avait que 10 crédits. Le débit
-- DB est atomique mais l'appel Anthropic partait avant le débit, donc
-- les N appels étaient déjà facturés à Steve.
--
-- Solution : verrou unique par utilisateur, posé atomiquement AVANT
-- l'appel Anthropic. Un timeout (120 s, > Vercel maxDuration 60 s)
-- libère le verrou automatiquement si la fonction crashe sans le
-- libérer proprement.
-- =========================================================

-- Colonne timestamp du verrou en cours sur les profils
alter table public.profiles
  add column if not exists recoupement_inflight_at timestamptz;

-- Tentative atomique d'acquisition du verrou.
-- Renvoie true si le verrou a été posé (utilisateur libre), false si une
-- requête est déjà en cours (et moins de p_timeout_seconds se sont écoulées).
create or replace function public.try_lock_recoupement(
  p_user_id          uuid,
  p_timeout_seconds  integer default 120
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  acquired boolean := false;
begin
  update public.profiles
     set recoupement_inflight_at = now()
   where id = p_user_id
     and (
       recoupement_inflight_at is null
       or recoupement_inflight_at < now() - make_interval(secs => p_timeout_seconds)
     )
  returning true into acquired;

  return coalesce(acquired, false);
end;
$$;

-- Libération du verrou (à appeler en finally après l'appel Anthropic,
-- qu'il ait réussi ou échoué).
create or replace function public.unlock_recoupement(p_user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set recoupement_inflight_at = null
   where id = p_user_id;
$$;

grant execute on function public.try_lock_recoupement(uuid, integer) to service_role;
grant execute on function public.unlock_recoupement(uuid)             to service_role;
