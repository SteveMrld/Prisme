import { MetadataRoute } from 'next'
import articlesData from '../lib/articles.json'
import { getAllInterviews } from '../lib/interviews'

const BASE_URL = 'https://soara.fr'

const CATEGORIES = ['geo', 'eco', 'tech', 'env', 'soc', 'culture', 'portraits']

const STATIC_PAGES = [
  { url: '/',              priority: 1.0,  changeFrequency: 'daily'   },
  { url: '/signal',        priority: 0.9,  changeFrequency: 'daily'   },
  { url: '/visuels',       priority: 0.8,  changeFrequency: 'weekly'  },
  { url: '/grands-formats',priority: 0.8,  changeFrequency: 'weekly'  },
  { url: '/apropos',       priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/contributeurs', priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/mentions',      priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/abonnement',    priority: 0.7,  changeFrequency: 'monthly' },
] as const

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const statics = STATIC_PAGES.map(p => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: now,
    changeFrequency: p.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: p.priority,
  }))

  const categories = CATEGORIES.map(cat => ({
    url: `${BASE_URL}/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const grandsFormats = GRANDS_FORMATS.map(slug => ({
    url: `${BASE_URL}/grands-formats/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.9,
  }))

  const articles = (articlesData as any[])
    .filter(a => !a.interviewType)
    .map(article => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const interviews = getAllInterviews().map(i => ({
    url: `${BASE_URL}/entretien/${i.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...statics, ...categories, ...grandsFormats, ...articles, ...interviews]
}
