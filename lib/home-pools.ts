/* Pools éditoriaux de la home Soara.
   Chaque pool est une liste de slugs éligibles à un emplacement.
   La sélection effective se fait dans app/page.tsx via lib/rotation.ts
   à partir d'un seed quotidien. Le LEAD des grands formats et son
   premier secondaire restent figés en page.tsx, leur jugement
   éditorial est sanctuaire. */

import articlesData from './articles.json'

type Article = (typeof articlesData)[number]
const ALL = articlesData as Article[]

function bySlug(slugs: readonly string[]): Article[] {
  const out: Article[] = []
  for (const s of slugs) {
    const a = ALL.find(x => x.slug === s)
    if (a) out.push(a)
  }
  return out
}

/* HERO : pool élargi de 14 articles à forte charge visuelle et éditoriale.
   Le carousel client en tirera 6 par jour. */
export const HERO_POOL = bySlug([
  'wanghuning', 'afrique', 'pollinisation', 'empire-du-droit',
  'terres-rares', 'chambre-ratification', 'chine', 'palantir',
  'empire-du-dollar', 'tiedeur-des-heritiers', 'monopoly',
  'dette-souveraine', 'architecture-desordre', 'skunkworks',
])

/* UNDER_HERO : articles affichés sous le hero (3 colonne gauche
   + 2 colonne droite avec image). */
export const UNDER_HERO_POOL = bySlug([
  'empire-du-droit', 'societe-du-consentement', 'wanghuning',
  'moreno', 'dette-souveraine', 'blackrock', 'fiscalite',
  'reseaux', 'maladie-sans-filet', 'lecture',
])

/* Pool pour les grands formats après le LEAD et son SECONDARY1
   (qui restent codés en dur dans page.tsx). Sert à tirer SECONDARY2,
   TERTIARY (3) et QUATERNARY (6). */
export const GF_POOL_AFTER_LEAD = bySlug([
  'palantir', 'skunkworks', 'dette-souveraine', 'france_maritime',
  'taiwan', 'semico', 'architecture-desordre', 'medias', 'eau',
  'techgeo', 'monopoly', 'blackrock', 'empire-du-dollar', 'chine',
  'afrique', 'wanghuning',
])

/* À LIRE AUSSI (zone 1, colonne gauche). Articles courts, autonomes,
   bonne entrée par un fil thématique. */
export const ALSO_READ_POOL = bySlug([
  'eau', 'lecture', 'france_maritime', 'kintsugi', 'fragilite',
  'silence', 'ia_ecriture', 'ce-que-nous-laissons-entrer',
  'derniere-generation', 'arctique', 'reseaux',
])

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

/* POPULAR (rotation 4h). Pool de candidats à la section "Les plus lus".
   Tourne quatre fois par jour via slotSeed(4). */
export const POPULAR_POOL = bySlug([
  'architecture-desordre', 'moreno', 'lecture', 'palantir', 'skunkworks',
  'wanghuning', 'empire-du-droit', 'blackrock', 'monopoly', 'afrique',
  'chine', 'pollinisation',
])
