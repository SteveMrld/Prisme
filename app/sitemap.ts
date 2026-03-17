import { MetadataRoute } from 'next'
import articlesData from '../lib/articles.json'

const BASE_URL = 'https://prisme-peach.vercel.app'

const CATEGORIES = ['geo', 'eco', 'tech', 'env', 'soc', 'culture', 'portraits', 'visuels']

const STATIC_PAGES = [
  { url: '/',              priority: 1.0,  changeFrequency: 'daily'   },
  { url: '/signal',        priority: 0.9,  changeFrequency: 'daily'   },
  { url: '/apropos',       priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/contributeurs', priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/mentions',      priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/abonnement',    priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/entretien/diarra', priority: 0.8, changeFrequency: 'weekly' },
] as const

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

  const articles = (articlesData as any[]).map(article => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...statics, ...categories, ...articles]
}
