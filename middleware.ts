import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Maintenance mode — redirige tout vers /bientot sauf la page elle-même
  if (process.env.MAINTENANCE_MODE === 'true') {
    const { pathname } = request.nextUrl
    if (pathname !== '/bientot' && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon')) {
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

  // Route admin — réservée à steve.moradel@gmail.com
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    if (!user || user.email !== 'steve.moradel@gmail.com') {
      return NextResponse.redirect(new URL('/connexion', request.url))
    }
  }

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
