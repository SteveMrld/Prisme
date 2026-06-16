import { notFound, redirect } from 'next/navigation'
import ArticleLayout from '../../../components/ArticleLayout'
import GrandFormatLayout from '../../../components/GrandFormatLayout'
import EauScrollytellingLayout from '../../../components/EauScrollytellingLayout'
import AdSlot from '../../../components/AdSlot'
import articlesData from '../../../lib/articles.json'
import { createClient } from '../../../lib/supabase-server'
import fs from 'fs'
import path from 'path'

const GRAND_FORMAT_SLUGS = ['pollinisation', 'france_maritime', 'eau', 'techgeo', 'taiwan', 'semico', 'medias', 'terres-rares', 'architecture-desordre', 'chambre-ratification', 'palantir', 'science-race']

// Ces slugs ont leur contenu dans /grands-formats/[slug]/page.tsx (JSX inline)
const REDIRECT_TO_GRAND_FORMAT = [
  'pollinisation',
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
  portrait: 'Portrait'
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

  // Présence d'une version EN, détectée par l'existence du fichier `<slug>-en.html`.
  // Sert à émettre hreflang fr/en/x-default. Le routage EN est ?lang=en.
  const enPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}-en.html`)
  let hasEnglishMeta = false
  try { hasEnglishMeta = fs.existsSync(enPath) } catch {}

  return {
    title: cleanTitle,
    description: article.description,
    alternates: {
      canonical: url,
      ...(hasEnglishMeta ? {
        languages: {
          'fr-FR': url,
          'en-US': `${url}?lang=en`,
          'x-default': url,
        },
      } : {}),
    },
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

// JSON-LD NewsArticle pour chaque article du site. Émis dans <body>, Google
// le lit où qu'il soit. Image et mainEntityOfPage sont absolus en soara.fr
// (cohérent avec metadataBase et OG). Pas de dateModified réel dans le schéma
// articles : on retombe sur datePublished. Le jour où on ajoutera ce champ
// dans articles.json, il sera utilisé automatiquement.
// Normalise une date "YYYY-MM-DD" (format articles.json) en ISO 8601 complet
// "YYYY-MM-DDTHH:MM:SSZ" attendu par Google Rich Results pour NewsArticle.
// Si la valeur est déjà complète ou invalide, on la laisse passer.
function toIsoDateTime(raw?: string): string {
  if (!raw) return ''
  const d = new Date(raw)
  return isNaN(d.getTime()) ? raw : d.toISOString()
}

function buildArticleJsonLd(article: any, slug: string) {
  const cleanTitle = String(article.title || '').replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
  const url = `${BASE_URL}/articles/${slug}`
  const imageRaw: string = article.image || '/og-default.jpg'
  const imageAbs = imageRaw.startsWith('http') ? imageRaw : `${BASE_URL}${imageRaw}`
  const author = article.author || 'Steve Moradel'
  const authorEntry: Record<string, any> = { '@type': 'Person', name: author }
  if (article.authorRole) authorEntry.jobTitle = article.authorRole
  const datePublished = toIsoDateTime(article.date)
  const dateModified = toIsoDateTime(article.dateModified || article.date)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: cleanTitle,
    description: article.description || '',
    image: [imageAbs],
    datePublished,
    dateModified,
    author: [authorEntry],
    publisher: {
      '@type': 'Organization',
      name: 'Soara',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

export default async function ArticlePage({ params, searchParams }: { params: { slug: string }, searchParams?: { lang?: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) notFound()

  // Redirection vers la page grand format dédiée
  if (REDIRECT_TO_GRAND_FORMAT.includes(params.slug)) {
    redirect(`/grands-formats/${params.slug}`)
  }

  // Redirection vers la route entretien dédiée pour les interviews
  if ((article as any).interviewType) {
    redirect(`/entretien/${params.slug}`)
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



  if (hasEnglish && !GRAND_FORMAT_SLUGS.includes(params.slug)) {
    // Le lien de traduction est maintenant rendu par ArticleLayout dans la byline.
    // Rien à injecter ici. On garde juste la logique hasEnglish pour passer la prop.
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
    content.includes('portrait-hero')

  // Si paywall actif, on tronque le contenu cote serveur a N paragraphes (defaut 3).
  // N est configurable par article via `premiumTeaserParagraphs` dans articles.json.
  if (showPaywall) {
    const { truncatePremiumHtml } = await import('../../../lib/truncate-premium')
    const teaserN = (article as any).premiumTeaserParagraphs ?? 3
    content = truncatePremiumHtml(content, teaserN)
  }

  // Articles liés — mélangés à chaque requête (page force-dynamic), pour varier
  // les recommandations. Portraits : 10 autres portraits mélangés. Sinon : mix
  // 2 même catégorie + 2 d'une autre catégorie, shuffle.
  const _shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  const _allOthers = (articlesData as any[]).filter(a => a.slug !== params.slug)
  let related: any[]
  if (article.category === 'portrait') {
    related = _shuffle(_allOthers.filter(a => a.category === 'portrait')).slice(0, 10)
  } else {
    const _sc = _shuffle(_allOthers.filter(a => a.category === article.category && a.image))
    const _oc = _shuffle(_allOthers.filter(a => a.category !== article.category && a.image))
    related = _shuffle([..._sc.slice(0, 2), ..._oc.slice(0, 2)])
  }

  const articleJsonLd = buildArticleJsonLd(article, params.slug)
  const jsonLdScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />
  )

  // Scrollytelling dédié pour l'article eau (carte sticky + IntersectionObserver)
  if (params.slug === 'eau') {
    return (
      <>
        {jsonLdScript}
        <EauScrollytellingLayout
          article={article as any}
          showPaywall={showPaywall}
          lang={lang}
          hasEnglish={hasEnglish}
        />
      </>
    )
  }

  // Grand format → layout dédié
  if (GRAND_FORMAT_SLUGS.includes(params.slug)) {
    return (
      <>
        {jsonLdScript}
        <GrandFormatLayout slug={params.slug} content={content} showPaywall={showPaywall} lang={lang} hasEnglish={hasEnglish} />
      </>
    )
  }

  return (
    <>
    {jsonLdScript}
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
      avif={(article as any).avif === true}
      date={(article as any).date}
      slug={article.slug}
      content={content}
      author={(article as any).author || 'Steve Moradel'}
      authorRole={(article as any).authorRole || ''}
      authorBio={(article as any).authorBio || ''}
      imageCredit={(article as any).imageCredit || ''}
      imagePosition={(article as any).imagePosition}
      imageFit={(article as any).imageFit}
      imageHeight={(article as any).imageHeight}
      format={(article as any).format}
      related={related}
      lang={lang}
      hasEnglish={hasEnglish}
      adSlot={
        <AdSlot slotId="article" variant="inline" />
      }
    />
    </>
  )
}
// Sat Apr  4 09:37:33 UTC 2026
