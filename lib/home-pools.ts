/* Pools éditoriaux de la home Soara.
   Auto-alimentés depuis articles.json par règles : tout article ajouté
   au JSON (image + date) rejoint automatiquement la rotation sans édition
   de ce fichier. Les seuls leviers éditoriaux par article sont les champs
   `featured` (force le passage en tête) et `hideFromHome` (exclut de la
   rotation home sans toucher aux rubriques).
   La sélection effective se fait dans app/page.tsx via lib/rotation.ts
   à partir d'un seed quotidien. Le LEAD des grands formats et son premier
   secondaire restent figés (sanctuaire éditorial), exposés ici pour que
   les pools puissent les exclure proprement. */

import articlesData from './articles.json'
import { recencyScore } from './recency'
import { randomShuffle } from './rotation'

type Article = (typeof articlesData)[number]
const ALL = articlesData as Article[]

/* Tri par score de récence : groupe les items par palier de score, puis
   shuffle dans chaque palier pour faire varier l'article entre deux
   chargements à fraîcheur équivalente. Les articles futurs (score -1)
   sont écartés sauf si includeFuture=true (sert au gating « à paraître »
   du chantier 3 pour la rangée grands formats). */
export type RecencyItem = { date: string; featured?: boolean }

export function sortByRecency<T extends RecencyItem>(
  items: readonly T[],
  nowTs: number,
  opts: { includeFuture?: boolean } = {},
): T[] {
  const buckets = new Map<number, T[]>()
  for (const a of items) {
    const s = recencyScore(a.date, a.featured === true, nowTs)
    if (s < 0 && !opts.includeFuture) continue
    if (!buckets.has(s)) buckets.set(s, [])
    buckets.get(s)!.push(a)
  }
  const keys = Array.from(buckets.keys()).sort((x, y) => y - x)
  const out: T[] = []
  for (const k of keys) out.push(...randomShuffle(buckets.get(k)!))
  return out
}

/* Pick guidé par le score de récence (au lieu d'un shuffle pur).
   Préserve maxPerCat / diversifyBy. Les articles plus frais sortent
   en tête, le shuffle ne joue qu'à fraîcheur égale (palier de score). */
export function pickByRecency<T extends RecencyItem>(
  pool: readonly T[],
  n: number,
  nowTs: number,
  opts: {
    diversifyBy?: (a: T) => string | undefined
    maxPerCat?: number
    includeFuture?: boolean
  } = {},
): T[] {
  const sorted = sortByRecency(pool, nowTs, { includeFuture: opts.includeFuture })
  const { diversifyBy, maxPerCat } = opts
  if (!diversifyBy || !maxPerCat || maxPerCat < 1) return sorted.slice(0, n)
  const result: T[] = []
  const counts = new Map<string, number>()
  const overflow: T[] = []
  for (const item of sorted) {
    if (result.length >= n) break
    const key = diversifyBy(item)
    if (key === undefined) { result.push(item); continue }
    const c = counts.get(key) ?? 0
    if (c < maxPerCat) {
      result.push(item)
      counts.set(key, c + 1)
    } else {
      overflow.push(item)
    }
  }
  while (result.length < n && overflow.length > 0) result.push(overflow.shift()!)
  return result
}

/* LEAD et SECONDARY1 des grands formats : jugement éditorial figé.
   Exportés pour que app/page.tsx s'aligne sur la même source. */
export const GF_LEAD_SLUG = 'chambre-ratification'
export const GF_SECONDARY_1_SLUG = 'terres-rares'

/* HERO_LEAD_SLUGS : articles épinglés en tête du carrousel hero, dans
   l'ordre donné, hors tirage aléatoire. Tableau vide pour repasser la
   rotation en mode entièrement automatique. Leurs catégories sont
   retirées des cats non-geo tirées au sort dans app/page.tsx pour
   éviter qu'un autre article de la même rubrique apparaisse juste
   derrière. Le nombre d'épinglés réduit d'autant les slides tirées au
   sort, le total du hero restant fixé par HERO_TOTAL. */
export const HERO_LEAD_SLUGS: string[] = [
  'le-verger-et-le-fruit',
  'la-guerre-des-moi',
]

const SANCTUARY = new Set<string>([GF_LEAD_SLUG, GF_SECONDARY_1_SLUG])
const HERO_PIN = new Set<string>(HERO_LEAD_SLUGS)

/* Liste des grands formats. Doit rester alignée avec GRAND_FORMAT_SLUGS
   dans app/articles/[slug]/page.tsx. */
const GRAND_FORMAT_SLUGS = new Set<string>([
  'pollinisation', 'france_maritime', 'eau', 'techgeo', 'taiwan',
  'semico', 'medias', 'terres-rares', 'architecture-desordre',
  'chambre-ratification', 'palantir', 'science-race',
])

/* Critères d'éligibilité à la home : image présente, pas en
   `hideFromHome`, pas une interview (les interviews ont leur propre
   bandeau via HomeInterviewBanner). */
function eligible(a: Article): boolean {
  if (!(a as any).image) return false
  if ((a as any).hideFromHome === true) return false
  if ((a as any).interviewType) return false
  return true
}

/* HERO : tous les articles à image hors sanctuaire ET hors HERO_LEAD_SLUGS
   (qui est injecté à part en position 0 dans app/page.tsx). Les portraits
   sont admis ici mais la sélection dans page.tsx ne les retient pas pour
   le hero (cf. HERO_NON_GEO_CATS). */
export const HERO_POOL: Article[] = ALL.filter(a =>
  eligible(a) && !SANCTUARY.has(a.slug) && !HERO_PIN.has(a.slug)
)

/* UNDER_HERO : même règle que HERO (articles à image, hors portraits,
   hors sanctuaire). Exclut aussi HERO_PIN pour éviter qu'un article
   épinglé en tête du hero apparaisse aussi dans la rangée sous-hero. */
export const UNDER_HERO_POOL: Article[] = ALL.filter(a =>
  eligible(a) && a.category !== 'portrait' && !SANCTUARY.has(a.slug) && !HERO_PIN.has(a.slug)
)

/* Grands formats après le LEAD et son SECONDARY1 (figés en page.tsx).
   Sert à tirer SECONDARY2, TERTIARY (3) et QUATERNARY (6). */
export const GF_POOL_AFTER_LEAD: Article[] = ALL.filter(a =>
  eligible(a) && GRAND_FORMAT_SLUGS.has(a.slug) && !SANCTUARY.has(a.slug)
)

/* À LIRE AUSSI : catalogue éligible hors portraits + sanctuaire.
   La diversification de catégories est imposée par pickFromPool. */
export const ALSO_READ_POOL: Article[] = ALL.filter(a =>
  eligible(a) && a.category !== 'portrait' && !SANCTUARY.has(a.slug)
)

/* POPULAR : catalogue éligible hors portraits. Tourne sur 4h.
   Peut contenir un sanctuaire (la popularité ne correspond pas à un
   placement éditorial figé, c'est juste une page lue). */
export const POPULAR_POOL: Article[] = ALL.filter(a =>
  eligible(a) && a.category !== 'portrait'
)

/* ATLAS (zone 2, bande pleine largeur). Visualisations interactives,
   pas des articles. Cartes référencées par leur route /visuels/X. */
export type AtlasCard = {
  href: string
  tag: string
  title: string
  image: string
}

export const ATLAS_POOL: AtlasCard[] = [
  { href: '/visuels/predateurs',     tag: 'Géopolitique',  title: 'Le monde des prédateurs',         image: '/articles/img-predateurs.jpg' },
  { href: '/visuels/naval',          tag: 'Géopolitique',  title: 'Les mers du pouvoir',             image: '/articles/atlas/09_les-mers-du-pouvoir.jpg' },
  { href: '/visuels/cables',         tag: 'Technologie',   title: 'Câbles sous-marins',              image: '/articles/atlas/13_cables-sous-marins.jpg' },
  { href: '/visuels/uranium',        tag: 'Géopolitique',  title: "La cascade de l'uranium",         image: '/articles/atlas/01_uranium-cascade-monde.jpg' },
  { href: '/visuels/empire-du-dollar', tag: 'Économie',    title: "L'empire du dollar",              image: '/articles/atlas/15_empire-du-dollar.jpg' },
  { href: '/visuels/france_maritime',tag: 'Géopolitique',  title: 'La France maritime',              image: '/articles/atlas/12_la-france-maritime.jpg' },
  { href: '/visuels/medias-pouvoir', tag: 'Société',       title: 'Médias occidentaux',              image: '/articles/atlas/04_medias-occidentaux.jpg' },
  { href: '/visuels/eau-carte',      tag: 'Environnement', title: "L'eau, prochaine fracture",       image: '/articles/atlas/11_leau-prochaine-grande-fracture.jpg' },
]
