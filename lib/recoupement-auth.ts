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
export async function readQuota(userId: string, isAdmin: boolean): Promise<QuotaResult & { extraCredits?: number }> {
  if (isAdmin) {
    return { ok: true, used: 0, remaining: 9999, limit: 9999, extraCredits: 0 }
  }

  const admin = supabaseAdmin()

  const [usageRes, profileRes] = await Promise.all([
    admin
      .from('recoupement_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('year_month', currentYearMonth())
      .maybeSingle(),
    admin
      .from('profiles')
      .select('recoupement_extra_credits')
      .eq('id', userId)
      .maybeSingle(),
  ])

  const used = usageRes.data?.count ?? 0
  const extraCredits = profileRes.data?.recoupement_extra_credits ?? 0

  return {
    ok: true,
    used,
    remaining: Math.max(0, MONTHLY_LIMIT - used),
    limit: MONTHLY_LIMIT,
    extraCredits,
  }
}

/**
 * Incrémente le compteur de manière atomique via la RPC Supabase.
 * Logique : d'abord le quota mensuel, puis les extra_credits, sinon 429.
 */
export async function consumeQuota(userId: string, isAdmin: boolean): Promise<QuotaResult & { consumedFromExtras?: boolean; extraCredits?: number }> {
  if (isAdmin) {
    return { ok: true, used: 0, remaining: 9999, limit: 9999, extraCredits: 0 }
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
  const consumedFromExtras = count === MONTHLY_LIMIT + 1

  // On relit l'état final pour le renvoyer à l'UI
  const after = await readQuota(userId, false)
  const extraCredits = (after as any).extraCredits ?? 0

  if (count === -1) {
    return {
      ok: false,
      status: 429,
      error: 'Quota mensuel atteint',
      used: MONTHLY_LIMIT,
      limit: MONTHLY_LIMIT,
      extraCredits: 0,
    }
  }

  return {
    ok: true,
    used: consumedFromExtras ? MONTHLY_LIMIT : count,
    remaining: consumedFromExtras ? 0 : Math.max(0, MONTHLY_LIMIT - count),
    limit: MONTHLY_LIMIT,
    consumedFromExtras,
    extraCredits,
  }
}

export { MONTHLY_LIMIT }
