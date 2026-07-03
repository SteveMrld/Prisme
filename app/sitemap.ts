import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import articlesData from '../lib/articles.json'
import lettresData from '../lib/lettres.json'
import { getAllInterviews } from '../lib/interviews'

const BASE_URL = 'https://soara.fr'

const CATEGORIES = ['geo', 'eco', 'tech', 'env', 'soc', 'culture', 'portraits']

// Mapping URL slug → category key in articles.json (la route /portraits
// liste les articles de catégorie "portrait" au singulier).
const URL_TO_CAT: Record<string, string> = {
  geo: 'geo', eco: 'eco', tech: 'tech', env: 'env',
  soc: 'soc', culture: 'culture', portraits: 'portrait',
}

// lastModified par page statique. Les pages réellement live (/, /signal,
// /revue, /indicateurs) gardent la date du jour, c'est ce qui correspond
// à leur réalité. Les autres ont une date fixe, mise à jour manuellement
// quand la page bouge. /lettres prend la date de la dernière lettre publiée.
const STATIC_REVISED = new Date('2026-05-15')

const LETTRES_LATEST = lettresData.length > 0
  ? new Date(Math.max(...(lettresData as any[]).map(l => new Date(l.dateISO).getTime())))
  : STATIC_REVISED

const STATIC_PAGES = [
  { url: '/',              priority: 1.0,  changeFrequency: 'daily',   lastModified: new Date()   },
  { url: '/signal',        priority: 0.9,  changeFrequency: 'daily',   lastModified: new Date()   },
  { url: '/revue',         priority: 0.8,  changeFrequency: 'daily',   lastModified: new Date()   },
  { url: '/indicateurs',   priority: 0.7,  changeFrequency: 'daily',   lastModified: new Date()   },
  { url: '/lettres',       priority: 0.9,  changeFrequency: 'weekly',  lastModified: LETTRES_LATEST },
  { url: '/visuels',       priority: 0.8,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/grands-formats',priority: 0.8,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/signal-map',    priority: 0.7,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/tv',            priority: 0.7,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/bibliotheque',  priority: 0.6,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/solutions',     priority: 0.7,  changeFrequency: 'monthly', lastModified: STATIC_REVISED },
  { url: '/explorer',      priority: 0.6,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/retrospective', priority: 0.6,  changeFrequency: 'yearly',  lastModified: STATIC_REVISED },
  { url: '/apropos',       priority: 0.5,  changeFrequency: 'monthly', lastModified: STATIC_REVISED },
  { url: '/contributeurs', priority: 0.5,  changeFrequency: 'monthly', lastModified: STATIC_REVISED },
  { url: '/mentions',      priority: 0.3,  changeFrequency: 'yearly',  lastModified: STATIC_REVISED },
  { url: '/abonnement',    priority: 0.7,  changeFrequency: 'monthly', lastModified: STATIC_REVISED },
] as const

// Date de référence pour les grands formats publiés : on prend la date max
// trouvée dans articles.json pour le slug correspondant, et on retombe sur
// STATIC_REVISED si le slug n'est pas représenté côté JSON.
const GRANDS_FORMATS = [
  'architecture-desordre',
  'bases-militaires',
  'chambre-ratification',
  'climat',
  'dette-souveraine',
  'inegalites',
  'medias',
  'palantir',
  'pollinisation',
  'skunkworks',
  'terres-rares',
]

function articleDate(a: any): Date {
  const d = a.dateModified || a.date
  if (!d) return STATIC_REVISED
  const parsed = new Date(d)
  return isNaN(parsed.getTime()) ? STATIC_REVISED : parsed
}

function maxDate(dates: Date[]): Date {
  if (dates.length === 0) return STATIC_REVISED
  return new Date(Math.max(...dates.map(d => d.getTime())))
}

// N'annoncer à Google que les pages qui portent réellement du contenu.
// Un article dont le fichier corps est absent rend un placeholder vide,
// ce qui pollue le sitemap et tire la qualité perçue du site vers le bas.
function hasBody(slug: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'lib', 'content', `${slug}.html`))
  } catch {
    return false
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = STATIC_PAGES.map(p => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: p.lastModified,
    changeFrequency: p.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: p.priority,
  }))

  const categories = CATEGORIES.map(cat => {
    const key = URL_TO_CAT[cat]
    const datesInCat = (articlesData as any[])
      .filter(a => a.category === key && !a.interviewType)
      .map(articleDate)
    return {
      url: `${BASE_URL}/${cat}`,
      lastModified: maxDate(datesInCat),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  const grandsFormats = GRANDS_FORMATS.map(slug => {
    const a = (articlesData as any[]).find(x => x.slug === slug)
    return {
      url: `${BASE_URL}/grands-formats/${slug}`,
      lastModified: a ? articleDate(a) : STATIC_REVISED,
      changeFrequency: 'yearly' as const,
      priority: 0.9,
    }
  })

  const articles = (articlesData as any[])
    .filter(a => !a.interviewType && hasBody(a.slug))
    .map(article => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: articleDate(article),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const interviews = getAllInterviews()
    .filter(i => i.interviewStatus === 'published' && hasBody(i.slug))
    .map(i => ({
      url: `${BASE_URL}/entretien/${i.slug}`,
      lastModified: articleDate(i),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const lettres = (lettresData as any[]).map(l => {
    const parsed = new Date(l.dateISO)
    return {
      url: `${BASE_URL}/lettres/${l.slug}`,
      lastModified: isNaN(parsed.getTime()) ? STATIC_REVISED : parsed,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }
  })

  return [...statics, ...categories, ...grandsFormats, ...articles, ...interviews, ...lettres]
}
