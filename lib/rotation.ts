/* Rotation déterministe par seed. La home Soara appelle ces helpers
   à chaque requête SSR pour faire varier les articles affichés sans
   rebuild. Le seed quotidien rend la page stable sur 24h (cohérent
   pour Google, pour les partages de lien et pour la lecture).
   PRNG : xmur3 pour hasher la chaîne, mulberry32 pour la séquence. */

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(seed: number): () => number {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createPRNG(seed: string): () => number {
  const seeded = xmur3(seed)
  return mulberry32(seeded())
}

export function dailySeed(date?: Date): string {
  const d = date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

/* Seed par tranche horaire. slotHours=4 → 4 changements par jour. */
export function slotSeed(slotHours: number, date?: Date): string {
  const d = date ?? new Date()
  const slot = Math.floor(d.getHours() / slotHours)
  return `${dailySeed(d)}-s${slot}`
}

export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  const rng = createPRNG(seed)
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export type PickOpts<T> = {
  /* Fonction retournant la clé de diversification (ex: catégorie).
     Utilisée pour garantir que les premiers tirages couvrent
     minDiversity clés distinctes. */
  diversifyBy?: (item: T) => string | undefined
  minDiversity?: number
}

export function pickFromPool<T>(
  pool: readonly T[],
  seed: string,
  n: number,
  opts: PickOpts<T> = {}
): T[] {
  const shuffled = seededShuffle(pool, seed)
  const { diversifyBy, minDiversity = 0 } = opts

  if (!diversifyBy || minDiversity <= 0) {
    return shuffled.slice(0, n)
  }

  const result: T[] = []
  const seen = new Set<string>()
  const remaining = [...shuffled]

  while (result.length < n && remaining.length > 0) {
    const needDiverse = seen.size < minDiversity
    let idx = -1
    if (needDiverse) {
      idx = remaining.findIndex(item => {
        const key = diversifyBy(item)
        return key !== undefined && !seen.has(key)
      })
    }
    if (idx === -1) idx = 0
    const picked = remaining.splice(idx, 1)[0]
    result.push(picked)
    const key = diversifyBy(picked)
    if (key !== undefined) seen.add(key)
  }
  return result
}

/* Parse un override de date depuis l'URL (?date=YYYYMMDD ou YYYY-MM-DD).
   Renvoie undefined si la valeur est invalide. Sert à prévisualiser
   d'autres jours sur la preview sans attendre. */
export function parseDateOverride(s?: string | null): Date | undefined {
  if (!s) return undefined
  const clean = s.replace(/-/g, '')
  if (!/^\d{8}$/.test(clean)) return undefined
  const y = Number(clean.slice(0, 4))
  const m = Number(clean.slice(4, 6)) - 1
  const d = Number(clean.slice(6, 8))
  const dt = new Date(y, m, d, 12, 0, 0)
  return isNaN(dt.getTime()) ? undefined : dt
}

/* Override de l'heure (?hour=0..23), utile pour prévisualiser
   les tranches de slot horaire (POPULAR tourne sur slot 4h). */
export function applyHourOverride(d: Date, h?: string | null): Date {
  if (!h) return d
  const n = Number(h)
  if (!Number.isFinite(n) || n < 0 || n > 23) return d
  const out = new Date(d.getTime())
  out.setHours(n, 0, 0, 0)
  return out
}
