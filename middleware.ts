import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { computeMaintenanceToken, timingSafeEqualStr } from './lib/maintenance-token'

export async function middleware(request: NextRequest) {
  // Maintenance mode — redirige tout vers /bientot sauf la page elle-même
  // Exception : prisme-peach.vercel.app reste toujours accessible (env preview)
  // Maintenance mode : actif uniquement en production (soara.fr)
  // prisme-peach.vercel.app reste accessible (VERCEL_ENV !== 'production')
  const isProd = process.env.VERCEL_ENV === 'production'

  // Laissez-passer : cookie httpOnly signé. Le serveur a posé un HMAC du payload
  // fixe "preview-ok" avec MAINTENANCE_COOKIE_SECRET. On recalcule l'HMAC attendu
  // et on compare en constant-time. Tout cookie en clair ("true", etc.) échoue.
  const rawToken = request.cookies.get('soara_preview')?.value || ''
  const secret = process.env.MAINTENANCE_COOKIE_SECRET || ''
  let previewOk = false
  if (secret && rawToken) {
    const expected = await computeMaintenanceToken(secret)
    previewOk = timingSafeEqualStr(rawToken, expected)
  }

  // Lancement programmé : si LAUNCH_AT est défini (ISO 8601 avec fuseau, ex.
  // 2026-06-22T12:22:00+02:00), la maintenance se lève automatiquement à cette
  // date/heure, sans redéploiement. Avant l'heure le site reste fermé ; à
  // l'heure pile, la requête suivante passe. LAUNCH_AT absent => comportement
  // inchangé (la maintenance reste pilotée par MAINTENANCE_MODE).
  const launchAt = process.env.LAUNCH_AT ? Date.parse(process.env.LAUNCH_AT) : NaN
  const beforeLaunch = Number.isNaN(launchAt) ? true : Date.now() < launchAt

  if (process.env.MAINTENANCE_MODE === 'true' && isProd && beforeLaunch && !previewOk) {
    const { pathname } = request.nextUrl
    const isStaticAsset = /\.(jpg|jpeg|png|gif|webp|avif|svg|ico|mp4|webm|woff|woff2|ttf|otf|css|js|json|txt|xml|pdf)$/i.test(pathname)
    const allowedApiPaths = new Set([
      '/api/stripe/webhook',
      '/api/stripe/checkout',
      '/api/stripe/portal',
      '/api/newsletter',
      '/api/briefing',
      '/api/ads/click',
      '/api/preview-unlock',
    ])
    const isAllowedApi =
      pathname.startsWith('/api/auth/') ||
      pathname.startsWith('/api/recoupement') ||
      allowedApiPaths.has(pathname)
    const isAllowed =
      pathname === '/bientot' ||
      pathname === '/inscription-confirmee' ||
      pathname === '/preview-unlock' ||
      pathname === '/connexion' ||
      pathname === '/compte' ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      isAllowedApi ||
      isStaticAsset
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/bientot', request.url))
    }
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si env vars absentes, on laisse passer sans auth check
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Route admin — auth gérée côté client dans la page

  // Routes protégées — compte abonné
  if (request.nextUrl.pathname.startsWith('/compte')) {
    if (!user) {
      return NextResponse.redirect(new URL('/connexion?redirect=/compte', request.url))
    }
  }

  // Si déjà connecté, redirige /connexion vers /compte
  if (request.nextUrl.pathname === '/connexion' && user) {
    return NextResponse.redirect(new URL('/compte', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
