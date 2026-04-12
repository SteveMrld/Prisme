import { notFound } from 'next/navigation'
import ArticleLayout from '../../../components/ArticleLayout'
import GrandFormatLayout from '../../../components/GrandFormatLayout'
import articlesData from '../../../lib/articles.json'
import { createClient } from '../../../lib/supabase-server'
import fs from 'fs'
import path from 'path'

const GRAND_FORMAT_SLUGS = ['france_maritime', 'eau', 'techgeo', 'taiwan', 'semico']

const BASE_URL = 'https://soara.fr'

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Concept', sciences: 'Sciences'
}

export const dynamic = 'force-dynamic'

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
      siteName: 'Soara',
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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) notFound()

  const contentPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}.html`)
  let content = ''
  try {
    content = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    content = '<p>Contenu à venir.</p>'
  }

  const isPremium = (article as any).premium === true

  // Bypass paywall pour l'admin
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const ADMIN_EMAIL = 'steve.moradel@gmail.com'
  const isAdmin = user?.email === ADMIN_EMAIL
  const showPaywall = isPremium && !isAdmin

  const hasInternalHeader =
    content.includes('class="atop"') ||
    content.includes('class="article-header"')

  const hasHeroInContent =
    content.includes('art-hero-wrap') ||
    content.includes('art-hero-img') ||
    content.includes('portrait-hero') ||
    (article as any).category === 'portrait'

  // Articles liés — même catégorie, exclu l'article courant
  // Pour les portraits : tous les autres portraits
  const related = (articlesData as any[])
    .filter(a => a.category === article.category && a.slug !== params.slug)
    .slice(0, article.category === 'portrait' ? 10 : 3)

  // Grand format → layout dédié
  if (GRAND_FORMAT_SLUGS.includes(params.slug)) {
    return (
      <GrandFormatLayout slug={params.slug} content={content} />
    )
  }

  return (
    <ArticleLayout
      title={article.title}
      description={article.description}
      image={article.image}
      category={article.category}
      categoryLabel={categoryLabels[article.category] || 'Article'}
      readTime={String(article.readTime)}
      hasInternalHeader={hasInternalHeader}
      hasHeroInContent={hasHeroInContent}
      premium={showPaywall}
      date={(article as any).date}
      slug={article.slug}
      content={content}
      author={(article as any).author || 'Steve Moradel'}
      authorRole={(article as any).authorRole || ''}
      imageCredit={(article as any).imageCredit || ''}
      related={related}
    />
  )
}
// Sat Apr  4 09:37:33 UTC 2026
