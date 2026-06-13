// Token de laissez-passer maintenance : HMAC-SHA256("preview-ok", SECRET).
// Utilise Web Crypto pour rester compatible Edge Runtime (middleware Next.js).
// Le serveur calcule et pose le token dans un cookie httpOnly. Le middleware
// recalcule et compare en constant-time. Le code d'accès lui-même n'est jamais
// dans le bundle client : seul le résultat de l'HMAC (du payload fixe) circule.

const PAYLOAD = 'preview-ok'

export async function computeMaintenanceToken(secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(PAYLOAD))
  const bytes = new Uint8Array(sig)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
