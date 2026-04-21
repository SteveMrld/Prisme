import { createClient } from './supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'steve.moradel@gmail.com'
const MONTHLY_LIMIT = 10

export type AuthResult =
  | { ok: true; userId: string; isAdmin: boolean; email: string }
  | { ok: false; status: number; error: string }

export type QuotaResult =
  | { ok: true; used: number; remaining: number; limit: number }
  | { ok: false; status: number; error: string; used?: number; limit?: number }

function currentYearMonth(): string {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

function supabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Vérifie que l'utilisateur est connecté ET abonné actif (ou admin).
 */
export async function requireActiveSubscriber(): Promise<AuthResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, status: 401, error: 'Non authentifié' }
  }

  if (user.email === ADMIN_EMAIL) {
    return { ok: true, userId: user.id, isAdmin: true, email: user.email }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.subscription_status !== 'active') {
    return { ok: false, status: 403, error: 'Abonnement requis' }
  }

  return { ok: true, userId: user.id, isAdmin: false, email: user.email ?? '' }
}

/**
 * Lit le quota sans l'incrémenter (pour afficher l'état à l'utilisateur).
 */
export async function readQuota(userId: string, isAdmin: boolean): Promise<QuotaResult> {
  if (isAdmin) {
    return { ok: true, used: 0, remaining: 9999, limit: 9999 }
  }

  const admin = supabaseAdmin()
  const { data } = await admin
    .from('recoupement_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('year_month', currentYearMonth())
    .maybeSingle()

  const used = data?.count ?? 0
  return {
    ok: true,
    used,
    remaining: Math.max(0, MONTHLY_LIMIT - used),
    limit: MONTHLY_LIMIT,
  }
}

/**
 * Incrémente le compteur de manière atomique via la RPC Supabase.
 * Retourne -1 (via status 429) si le quota est dépassé.
 */
export async function consumeQuota(userId: string, isAdmin: boolean): Promise<QuotaResult> {
  if (isAdmin) {
    return { ok: true, used: 0, remaining: 9999, limit: 9999 }
  }

  const admin = supabaseAdmin()
  const { data, error } = await admin.rpc('increment_recoupement_usage', {
    p_user_id: userId,
    p_year_month: currentYearMonth(),
    p_max: MONTHLY_LIMIT,
  })

  if (error) {
    return { ok: false, status: 500, error: 'Erreur quota : ' + error.message }
  }

  const count = data as number

  if (count === -1) {
    return {
      ok: false,
      status: 429,
      error: 'Quota mensuel atteint',
      used: MONTHLY_LIMIT,
      limit: MONTHLY_LIMIT,
    }
  }

  return {
    ok: true,
    used: count,
    remaining: Math.max(0, MONTHLY_LIMIT - count),
    limit: MONTHLY_LIMIT,
  }
}

export { MONTHLY_LIMIT }
