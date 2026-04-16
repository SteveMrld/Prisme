import { notFound, redirect } from 'next/navigation'
import ArticleLayout from '../../../components/ArticleLayout'
import GrandFormatLayout from '../../../components/GrandFormatLayout'
import articlesData from '../../../lib/articles.json'
import { createClient } from '../../../lib/supabase-server'
import fs from 'fs'
import path from 'path'

const GRAND_FORMAT_SLUGS = ['france_maritime', 'eau', 'techgeo', 'taiwan', 'semico', 'medias', 'terres-rares', 'architecture-desordre', 'chambre-ratification', 'palantir']

// Ces slugs ont leur contenu dans /grands-formats/[slug]/page.tsx (JSX inline)
const REDIRECT_TO_GRAND_FORMAT = [
  'chambre-ratification',
  'architecture-desordre',
  'skunkworks',
  'palantir',
  'bases-militaires',
  'dette-souveraine',
  'terres-rares',
]

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

export default async function ArticlePage({ params, searchParams }: { params: { slug: string }, searchParams?: { lang?: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) notFound()

  // Redirection vers la page grand format dédiée
  if (REDIRECT_TO_GRAND_FORMAT.includes(params.slug)) {
    redirect(`/grands-formats/${params.slug}`)
  }

  const lang = searchParams?.lang === 'en' ? 'en' : 'fr'
  const contentFile = lang === 'en' ? `${params.slug}-en.html` : `${params.slug}.html`
  const contentPath = path.join(process.cwd(), 'lib', 'content', contentFile)
  let content = ''
  let hasEnglish = false
  try {
    const enPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}-en.html`)
    hasEnglish = fs.existsSync(enPath)
  } catch {}
  try {
    content = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    content = '<p>Contenu à venir.</p>'
  }


  const isPremium = (article as any).premium === true

  // Bypass paywall pour l'admin ou les abonnés actifs
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const ADMIN_EMAIL = 'steve.moradel@gmail.com'
  const isAdmin = user?.email === ADMIN_EMAIL

  let isSubscribed = false
  if (user && !isAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()
    isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  }

  const showPaywall = isPremium && !isAdmin && !isSubscribed

  const hasInternalHeader =
    content.includes('class="atop"') ||
    content.includes('class="article-header"')

  const hasHeroInContent =
    content.includes('art-hero-wrap') ||
    content.includes('art-hero-img') ||
    content.includes('portrait-hero') ||
    (article as any).category === 'portrait'

  // URL toggle EN/FR — calculée côté serveur, passée comme prop string
  const toggleBase = REDIRECT_TO_GRAND_FORMAT.includes(params.slug)
    ? `/grands-formats/${params.slug}`
    : `/articles/${params.slug}`
  const toggleUrl = hasEnglish
    ? (lang === 'en' ? toggleBase : `${toggleBase}?lang=en`)
    : null

  // Articles liés — même catégorie, exclu l'article courant
  // Pour les portraits : tous les autres portraits
  const related = (articlesData as any[])
    .filter(a => a.category === article.category && a.slug !== params.slug)
    .slice(0, article.category === 'portrait' ? 10 : 3)

  // Grand format → layout dédié
  if (GRAND_FORMAT_SLUGS.includes(params.slug)) {
    return (
      <GrandFormatLayout slug={params.slug} content={content} showPaywall={showPaywall} lang={lang} hasEnglish={hasEnglish} toggleUrl={toggleUrl || undefined} />
    )
  }

  return (
    <ArticleLayout
      title={lang === 'en' && (article as any).titleEn ? (article as any).titleEn : article.title}
      description={lang === 'en' && (article as any).descriptionEn ? (article as any).descriptionEn : article.description}
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
      lang={lang}
      hasEnglish={hasEnglish}
      toggleUrl={toggleUrl || undefined}
    />
  )
}
// Sat Apr  4 09:37:33 UTC 2026
