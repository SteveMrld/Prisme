import { MetadataRoute } from 'next'
import articlesData from '../lib/articles.json'
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
// /revue) gardent la date du jour, c'est ce qui correspond à leur réalité.
// Les autres ont une date fixe, mise à jour manuellement quand la page bouge.
// Cohérent avec la dernière vague de chantiers (audit pré-launch).
const STATIC_REVISED = new Date('2026-05-15')

const STATIC_PAGES = [
  { url: '/',              priority: 1.0,  changeFrequency: 'daily',   lastModified: new Date()   },
  { url: '/signal',        priority: 0.9,  changeFrequency: 'daily',   lastModified: new Date()   },
  { url: '/visuels',       priority: 0.8,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
  { url: '/grands-formats',priority: 0.8,  changeFrequency: 'weekly',  lastModified: STATIC_REVISED },
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
    .filter(a => !a.interviewType)
    .map(article => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: articleDate(article),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const interviews = getAllInterviews().map(i => ({
    url: `${BASE_URL}/entretien/${i.slug}`,
    lastModified: articleDate(i),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...statics, ...categories, ...grandsFormats, ...articles, ...interviews]
}
