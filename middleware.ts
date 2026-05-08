import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Maintenance mode — redirige tout vers /bientot sauf la page elle-même
  // Exception : prisme-peach.vercel.app reste toujours accessible (env preview)
  // Maintenance mode : actif uniquement en production (soara.fr)
  // prisme-peach.vercel.app reste accessible (VERCEL_ENV !== 'production')
  const isProd = process.env.VERCEL_ENV === 'production'

  const previewCookie = request.cookies.get('soara_preview')?.value === 'true'

  if (process.env.MAINTENANCE_MODE === 'true' && isProd && !previewCookie) {
    const { pathname } = request.nextUrl
    const isStaticAsset = /\.(jpg|jpeg|png|gif|webp|avif|svg|ico|mp4|webm|woff|woff2|ttf|otf|css|js|json|txt|xml|pdf)$/i.test(pathname)
    const isAllowed = pathname === '/bientot' || pathname === '/preview-unlock' || pathname === '/connexion' || pathname === '/compte' || pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/api/') || isStaticAsset
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
