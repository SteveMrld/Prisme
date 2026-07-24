/* Registre des grands formats Soara. SOURCE DE VÉRITÉ UNIQUE, consommée
   par le carrousel de la home (components/HomeGrandFormats.tsx) et par
   la page d'onglet (components/GrandsFormatsIndex.tsx). Ajouter un grand
   format ici suffit désormais à le faire apparaître aux deux endroits.

   Historique de la correction : une seconde liste vivait en dur dans
   GrandsFormatsIndex.tsx et les deux avaient divergé. Trois entrées
   inscrites ici ne sont pas des grands formats mais des Visuels
   (bases-militaires, climat, inegalites, cf. lib/visuels.ts) : elles ont
   été retirées. Pollinisation et Climatisation, absentes de la liste
   d'affichage, ont été rétablies.

   `title`, `eyebrow` et `desc` sont les libellés affichés dans la grille
   de l'onglet. Ils peuvent différer d'articles.json, où le titre porte du
   balisage et la description sert de chapô. `image` et `date` sont
   résolus depuis articles.json pour rester alignés sur le reste du site. */

import articlesData from './articles.json'

export type GrandFormat = {
  slug: string
  title: string
  category: string
  categoryLabel: string
  image: string
  date: string
  href: string
  /* Affichage de la grille d'onglet. `displayTitle` est le titre en
     clair, sans balisage, tel qu'il figurait dans l'ancienne liste. Le
     champ `title` reste celui d'articles.json, balisage compris, parce
     que le carrousel de la home l'affiche en HTML. */
  displayTitle: string
  cat: string
  eyebrow: string
  desc: string
}

const CAT_LABELS: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
}

type Fiche = {
  slug: string
  cat: string
  title: string
  eyebrow: string
  desc: string
}

/* Ordre d'affichage dans l'onglet. La home, elle, applique sortByRecency
   à chaque chargement et ignore cet ordre. */
const FICHES: Fiche[] = [
  {
    slug: 'le-verger-et-le-fruit', cat: 'tech',
    title: "Le verger et le fruit",
    eyebrow: 'Technologie · Géopolitique',
    desc: "En 1998, Microsoft offrait à la Chine un laboratoire. Un quart de siècle plus tard, Pékin tend le même geste vers l'Afrique.",
  },
  {
    slug: 'palantir', cat: 'tech',
    title: "Palantir. L'ontologie de l'ennemi",
    eyebrow: 'Tech · Puissance',
    desc: "Comment une entreprise de data a vendu à l'État la capacité de penser la menace.",
  },
  {
    slug: 'chambre-ratification', cat: 'geo',
    title: "La chambre de ratification",
    eyebrow: 'Géopolitique · Pouvoir',
    desc: "Comment se décide vraiment une guerre, pas dans les capitales, mais dans les pièces où personne ne regarde.",
  },
  {
    slug: 'skunkworks', cat: 'tech',
    title: "Skunk Works · L'usine à l'impossible",
    eyebrow: 'Tech · Défense',
    desc: "Comment Lockheed a inventé l'avion invisible dans un hangar secret en Californie.",
  },
  {
    slug: 'terres-rares', cat: 'geo',
    title: "Terres rares : la guerre invisible",
    eyebrow: 'Géopolitique · Environnement',
    desc: "Du cobalt du Katanga au verrou chinois du raffinage, une nouvelle géographie de la dépendance.",
  },
  {
    slug: 'pollinisation', cat: 'env',
    title: "La ruche vide",
    eyebrow: 'Environnement · Économie',
    desc: "L'abeille disparaît, et un marché se met en place derrière elle, fait de brevets, de drones et de pollinisation facturée.",
  },
  {
    slug: 'climatisation', cat: 'env',
    title: "La chaleur déplacée",
    eyebrow: 'Environnement · Technologie',
    desc: "Elle ne fabrique pas de froid, elle déplace la chaleur d'une pièce vers la rue. Et la rue se réchauffe.",
  },
  {
    slug: 'medias', cat: 'soc',
    title: "Médias · Les prédateurs",
    eyebrow: 'Société · Pouvoir',
    desc: "Qui possède l'information ? La carte mondiale de la concentration des médias.",
  },
  {
    slug: 'dette-souveraine', cat: 'eco',
    title: "Dette souveraine",
    eyebrow: 'Économie · Géopolitique',
    desc: "Quand la dette devient une arme géopolitique. Les États pris en otage par leurs créanciers.",
  },
  {
    slug: 'architecture-desordre', cat: 'geo',
    title: "L'architecture du désordre",
    eyebrow: 'Géopolitique · Droit',
    desc: "Pourquoi le droit international ne fonctionne que quand les grandes puissances veulent bien.",
  },
]

export function getAllGrandFormats(): GrandFormat[] {
  const allArticles = articlesData as any[]
  const out: GrandFormat[] = []
  for (const f of FICHES) {
    const a = allArticles.find(x => x.slug === f.slug)
    if (!a) continue
    out.push({
      slug: f.slug,
      title: a.title,
      category: a.category,
      categoryLabel: a.categoryLabel || CAT_LABELS[a.category] || a.category,
      image: a.image,
      date: a.date,
      href: a.grandFormatUrl || `/grands-formats/${f.slug}`,
      displayTitle: f.title,
      cat: f.cat,
      eyebrow: f.eyebrow,
      desc: f.desc,
    })
  }
  return out
}
