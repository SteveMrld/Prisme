import { notFound } from 'next/navigation'
import ArticleLayout from '../../../components/ArticleLayout'
import articlesData from '../../../lib/articles.json'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://prisme-peach.vercel.app'

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Concept'
}

export async function generateStaticParams() {
  return articlesData.map((article: any) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) return {}

  const cleanTitle = article.title.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
  const url = `${BASE_URL}/articles/${params.slug}`
  const ogImage = article.image || `${BASE_URL}/og-default.jpg`

  return {
    title: cleanTitle,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: cleanTitle,
      description: article.description,
      siteName: 'Prisme',
      locale: 'fr_FR',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: article.description,
      images: [ogImage],
    },
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) notFound()

  const contentPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}.html`)
  let content = ''
  try {
    content = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    content = '<p>Contenu à venir.</p>'
  }

  const hasInternalHeader =
    content.includes('class="atop"') ||
    content.includes('class="article-header"') ||
    content.includes('class="essentiel"')

  return (
    <ArticleLayout
      title={article.title}
      description={article.description}
      image={article.image}
      category={article.category}
      categoryLabel={categoryLabels[article.category] || 'Article'}
      readTime={article.readTime}
      hasInternalHeader={hasInternalHeader}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ArticleLayout>
  )
}
