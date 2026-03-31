import { NextResponse } from 'next/server'
import articlesData from '../../lib/articles.json'

const BASE_URL = 'https://prisme-peach.vercel.app'
const SITE_NAME = 'Prisme'
const SITE_DESC = "Média d'analyse indépendant — Géopolitique, économie, technologie, société."

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Concept',
}

export async function GET() {
  const articles = (articlesData as any[])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)

  const items = articles.map(a => {
    const title = a.title.replace(/<[^>]+>/g, '').replace(/&/g, '&amp;')
    const desc = (a.description || '').replace(/&/g, '&amp;')
    const url = `${BASE_URL}/articles/${a.slug}`
    const cat = categoryLabels[a.category] || a.category
    const date = new Date(a.date).toUTCString()
    return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <description>${desc}</description>
      <pubDate>${date}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <category>${cat}</category>
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>fr</language>
    <atom:link href="${BASE_URL}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
