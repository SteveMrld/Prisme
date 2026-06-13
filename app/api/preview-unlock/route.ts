import { NextRequest, NextResponse } from 'next/server'
import { computeMaintenanceToken, timingSafeEqualStr } from '../../../lib/maintenance-token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Endpoint serveur de vérification du code de maintenance. Le code et le secret
// HMAC ne sont jamais exposés au client : ils vivent dans les env vars Vercel
// (MAINTENANCE_CODE, MAINTENANCE_COOKIE_SECRET). En cas de succès, on pose
// un cookie httpOnly signé que le middleware vérifie sur chaque requête.

export async function POST(req: NextRequest) {
  const envCode = process.env.MAINTENANCE_CODE || ''
  const secret = process.env.MAINTENANCE_COOKIE_SECRET || ''

  if (!envCode || !secret) {
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  const submitted = String(body?.code || '').trim()
  if (!submitted || !timingSafeEqualStr(submitted, envCode)) {
    return NextResponse.json({ ok: false, error: 'invalid_code' }, { status: 401 })
  }

  const token = await computeMaintenanceToken(secret)
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'soara_preview',
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return res
}
