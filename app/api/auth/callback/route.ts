import { createClient } from '../../../../lib/supabase-server'
import { NextResponse } from 'next/server'

/* N'autorise que des chemins internes relatifs (same-origin). Filtre les
   bypass classiques d'open redirect : double slash, antislash, userinfo
   "@", scheme "://". En cas d'échec : fallback /.
   cf. RAPPORT_AUDIT §2.3 — l'attaque "?next=@evil.com" résultait en un
   redirect vers evil.com car `${origin}@evil.com` se parse host=evil.com. */
function safeNext(raw: string | null): string {
  if (!raw) return '/'
  if (!raw.startsWith('/')) return '/'
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/'
  if (raw.includes('://') || raw.includes('@')) return '/'
  return raw
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next') ?? '/compte')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=auth`)
}
