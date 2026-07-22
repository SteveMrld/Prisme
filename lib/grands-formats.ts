/* Registre des 11 grands formats Soara. Source de vérité unique pour
   les sections home qui les listent (carrousel home, futures pages
   d'index). Les entrées présentes dans articles.json sont reprises
   telles quelles ; les 3 grands formats qui n'ont pas d'entrée JSON
   (bases-militaires, climat, inegalites — visualisations interactives
   sans cover documentée) sont décrits inline ici. */

import articlesData from './articles.json'

export type GrandFormat = {
  slug: string
  title: string
  category: string
  categoryLabel: string
  image: string
  date: string
  href: string
}

const CAT_LABELS: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
}

/* Liste canonique des 11 slugs. L'ordre ici n'a pas d'importance :
   la home applique sortByRecency par score d'âge à chaque chargement. */
const GRAND_FORMAT_SLUGS: string[] = [
  'le-verger-et-le-fruit',
  'pollinisation',
  'chambre-ratification',
  'palantir',
  'architecture-desordre',
  'skunkworks',
  'terres-rares',
  'medias',
  'dette-souveraine',
  'bases-militaires',
  'climat',
  'inegalites',
]

/* Métadonnées inline pour les grands formats sans entrée articles.json. */
const INLINE: Record<string, GrandFormat> = {
  'bases-militaires': {
    slug: 'bases-militaires',
    title: "L'Empire invisible",
    category: 'geo',
    categoryLabel: 'Géopolitique',
    image: '/articles/atlas/05_empire-invisible.jpg',
    date: '2026-04-09',
    href: '/grands-formats/bases-militaires',
  },
  'climat': {
    slug: 'climat',
    title: 'Cinq siècles de fièvre',
    category: 'env',
    categoryLabel: 'Environnement',
    image: '/articles/atlas/07_la-terre-a-toujours-change.jpg',
    date: '2026-04-15',
    href: '/grands-formats/climat',
  },
  'inegalites': {
    slug: 'inegalites',
    title: 'Le grand partage',
    category: 'eco',
    categoryLabel: 'Économie',
    image: '/articles/atlas/06_en-1980-ils-etaient-tous-pareils.jpg',
    date: '2026-04-22',
    href: '/grands-formats/inegalites',
  },
}

export function getAllGrandFormats(): GrandFormat[] {
  const allArticles = articlesData as any[]
  const out: GrandFormat[] = []
  for (const slug of GRAND_FORMAT_SLUGS) {
    if (INLINE[slug]) {
      out.push(INLINE[slug])
      continue
    }
    const a = allArticles.find(x => x.slug === slug)
    if (!a) continue
    out.push({
      slug: a.slug,
      title: a.title,
      category: a.category,
      categoryLabel: a.categoryLabel || CAT_LABELS[a.category] || a.category,
      image: a.image,
      date: a.date,
      href: a.grandFormatUrl || `/grands-formats/${a.slug}`,
    })
  }
  return out
}
