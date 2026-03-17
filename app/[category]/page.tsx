import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import articlesData from '../../lib/articles.json'
import styles from './category.module.css'

/* ── Config rubriques ── */
const CATEGORIES: Record<string, {
  label: string
  labelLong: string
  description: string
  color: string
  cssVar: string
}> = {
  geo: {
    label: 'Géopolitique',
    labelLong: 'Géopolitique',
    description: 'Puissance, souveraineté, conflits. Les forces qui reconfigurent l\'ordre mondial.',
    color: '#1A3E6B',
    cssVar: 'var(--geo)',
  },
  eco: {
    label: 'Économie',
    labelLong: 'Économie',
    description: 'Capital, marchés, inégalités. Les mécanismes qui structurent le monde réel.',
    color: '#B86A1A',
    cssVar: 'var(--eco)',
  },
  tech: {
    label: 'Tech',
    labelLong: 'Technologie',
    description: 'IA, semi-conducteurs, plateformes. Ce que la technologie fait à nos sociétés.',
    color: '#4A2080',
    cssVar: 'var(--tech)',
  },
  env: {
    label: 'Environnement',
    labelLong: 'Environnement',
    description: 'Climat, ressources, transitions. Les limites planétaires comme enjeu politique.',
    color: '#2D6B4A',
    cssVar: 'var(--env)',
  },
  soc: {
    label: 'Société',
    labelLong: 'Société',
    description: 'Médias, réseaux, identités. Les mutations silencieuses du lien social.',
    color: '#7A2D2D',
    cssVar: 'var(--soc)',
  },
  culture: {
    label: 'Culture',
    labelLong: 'Culture',
    description: 'Littérature, philosophie, arts. Ce que les œuvres disent de leur époque.',
    color: '#6B1A3A',
    cssVar: 'var(--culture)',
  },
  portraits: {
    label: 'Portraits',
    labelLong: 'Portraits',
    description: 'Des trajectoires singulières. Des hommes et des femmes qui ont marqué leur époque.',
    color: '#C4A265',
    cssVar: 'var(--portrait)',
  },
  visuels: {
    label: 'Visuels',
    labelLong: 'Visuels & Concepts',
    description: 'Infographies, animations, concepts. Les idées qui se comprennent mieux en les voyant.',
    color: '#1A1A3E',
    cssVar: 'var(--concept)',
  },
}

/* Mapping URL slug → category key in articles.json */
const URL_TO_CATEGORY: Record<string, string> = {
  geo: 'geo',
  eco: 'eco',
  tech: 'tech',
  env: 'env',
  soc: 'soc',
  culture: 'culture',
  portraits: 'portrait',
  visuels: 'concept',
}

/* Nav activeNav key */
const URL_TO_NAV: Record<string, string> = {
  geo: 'geo', eco: 'eco', tech: 'tech', env: 'env',
  soc: 'soc', culture: 'culture', portraits: 'portrait', visuels: 'concept',
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map(cat => ({ category: cat }))
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const config = CATEGORIES[params.category]
  if (!config) return {}
  const url = `https://prisme-peach.vercel.app/${params.category}`
  return {
    title: config.labelLong,
    description: config.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${config.labelLong} — Prisme`,
      description: config.description,
      siteName: 'Prisme',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: config.labelLong }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.labelLong} — Prisme`,
      description: config.description,
      images: ['/og-default.jpg'],
    },
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params
  const config = CATEGORIES[category]
  if (!config) notFound()

  const categoryKey = URL_TO_CATEGORY[category]
  const articles = (articlesData as any[]).filter(a => a.category === categoryKey)

  const [featured, ...rest] = articles

  return (
    <>
      <Header activeNav={URL_TO_NAV[category]} />

      {/* BANDEAU RUBRIQUE */}
      <div className={styles.band} style={{ borderColor: config.color }}>
        <div className={styles.bandInner}>
          <div className={styles.bandLabel} style={{ color: config.color }}>
            {config.label}
          </div>
          <h1 className={styles.bandTitle}>{config.labelLong}</h1>
          <p className={styles.bandDesc}>{config.description}</p>
        </div>
        <div className={styles.bandCount} style={{ color: config.color }}>
          {articles.length} article{articles.length > 1 ? 's' : ''}
        </div>
      </div>

      {articles.length === 0 ? (
        <div className={styles.empty}>
          <p>Les premiers articles de cette rubrique arrivent bientôt.</p>
          <Link href="/" className={styles.emptyBack}>← Retour à l'accueil</Link>
        </div>
      ) : (
        <div className={styles.content}>

          {/* ARTICLE FEATURED */}
          {featured && (
            <Link href={`/articles/${featured.slug}`} className={styles.featured}>
              {featured.image && (
                <div className={styles.featuredImgWrap}>
                  <img src={featured.image} alt={featured.title} className={styles.featuredImg} />
                </div>
              )}
              <div className={styles.featuredBody}>
                <div className={styles.featuredEyebrow}>
                  <span className={styles.featuredTag} style={{ background: config.color }}>
                    {config.label}
                  </span>
                  <span className={styles.featuredTime}>{featured.readTime} min</span>
                </div>
                <h2
                  className={styles.featuredTitle}
                  dangerouslySetInnerHTML={{ __html: featured.title.replace(/\n/g, ' ') }}
                />
                <p className={styles.featuredDeck}>{featured.description}</p>
                <span className={styles.featuredCta} style={{ color: config.color }}>
                  Lire l'analyse →
                </span>
              </div>
            </Link>
          )}

          {/* GRILLE DES AUTRES ARTICLES */}
          {rest.length > 0 && (
            <div className={styles.grid}>
              {rest.map(article => (
                <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.card}>
                  {article.image && (
                    <div className={styles.cardImgWrap}>
                      <img src={article.image} alt={article.title} className={styles.cardImg} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardEyebrow}>
                      <span className={styles.cardTime}>{article.readTime} min</span>
                    </div>
                    <h3
                      className={styles.cardTitle}
                      dangerouslySetInnerHTML={{ __html: article.title.replace(/\n/g, ' ') }}
                    />
                    <p className={styles.cardDeck}>{article.description}</p>
                    <span className={styles.cardCta} style={{ color: config.color }}>
                      Lire →
                    </span>
                  </div>
                  <div className={styles.cardAccent} style={{ background: config.color }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
