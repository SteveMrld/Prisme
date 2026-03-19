import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
  matcher: ['/compte/:path*', '/connexion'],
}
