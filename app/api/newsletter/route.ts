import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const LIST_ID = Number(process.env.BREVO_LIST_ID || '6') // liste "Abonnés Soara"
// Double opt-in : template Brevo qui envoie l'email de confirmation, et URL
// où l'utilisateur atterrit après clic. Les deux sont configurés côté Brevo
// (template DOI dédié) puis passés via env vars.
const DOI_TEMPLATE_ID = Number(process.env.BREVO_DOI_TEMPLATE_ID || '0')
const DOI_REDIRECT_URL = process.env.BREVO_DOI_REDIRECT_URL
  || 'https://soara.fr/lettres?confirmed=1'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5
const buckets = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
  }
  const bucket = buckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false
  bucket.count++
  return true
}

/* Validation email serveur. Regex pragmatique RFC 5322-ish : un local-part
   sans espace ni @, suivi d'un domaine avec au moins un point. Pas la regex
   RFC complète (illisible et permet des bizarreries peu réalistes en B2C),
   mais suffisamment stricte pour rejeter "x@y", "a@@b", "@", "foo@bar". */
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/
function isValidEmail(email: string): boolean {
  if (email.length > 254) return false
  return EMAIL_RE.test(email)
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes, réessayez dans une minute.' },
      { status: 429 }
    )
  }

  const { email: rawEmail } = (await req.json()) as { email?: string }
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Adresse email invalide.' },
      { status: 400 }
    )
  }

  if (!DOI_TEMPLATE_ID) {
    // Garde-fou : pas de fallback silencieux en single opt-in. Mieux vaut
    // un 500 explicite qu'une inscription par défaut sans consentement.
    console.error('[newsletter] BREVO_DOI_TEMPLATE_ID manquant, DOI désactivé')
    return NextResponse.json({ error: 'Newsletter indisponible' }, { status: 500 })
  }

  // Double opt-in : Brevo envoie un email de confirmation. Le contact
  // n'est ajouté à `LIST_ID` qu'après clic sur le lien. Pas d'inscription
  // unilatérale possible avec un email de tiers.
  const callBrevo = () =>
    fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [LIST_ID],
        templateId: DOI_TEMPLATE_ID,
        redirectionUrl: DOI_REDIRECT_URL,
      }),
    })

  // Retries sur 5xx Brevo (incidents transitoires côté fournisseur).
  // Pauses 300 ms puis 600 ms avant les deux re-tentatives.
  const RETRY_DELAYS_MS = [300, 600]
  let res: Response | null = null
  let lastErr: unknown = null

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      res = await callBrevo()
    } catch (err) {
      lastErr = err
      res = null
    }
    if (res && res.status < 500) break
    if (attempt < RETRY_DELAYS_MS.length) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]))
    }
  }

  // Échec réseau ou 5xx persistant : on logue pour reprise éventuelle,
  // jamais d'erreur technique côté UX.
  if (!res) {
    console.error('[newsletter] Brevo fetch failed', { email, err: String(lastErr) })
    return NextResponse.json({ success: true, doi: true })
  }

  // 201 = email DOI envoyé, 204 = contact déjà confirmé dans la liste
  if (res.ok || res.status === 204) {
    return NextResponse.json({ success: true, doi: true })
  }

  const data = await res.json().catch(() => ({} as Record<string, unknown>))

  // Si le contact existe déjà comme confirmé dans la liste, Brevo renvoie
  // un `duplicate_parameter` : succès côté UX.
  if ((data as { code?: string })?.code === 'duplicate_parameter') {
    return NextResponse.json({ success: true, doi: false })
  }

  // 5xx persistant ou 4xx non-duplicate : on logue (email + statut + code),
  // mais on renvoie le message rassurant pour ne pas exposer la panne.
  console.error('[newsletter] Brevo DOI error', {
    email,
    status: res.status,
    code: (data as { code?: string })?.code,
  })
  return NextResponse.json({ success: true, doi: true })
}
