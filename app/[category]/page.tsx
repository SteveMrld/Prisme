import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import articlesData from '../../lib/articles.json'
import styles from './category.module.css'
import { AnimBand, AnimFeatured, AnimGrid, AnimCard } from './CategoryAnimations'
import { formatReadTime, stripHtml } from '../../lib/format'
import CategorySidebar from '../../components/CategorySidebar'
import type { CategoryKey } from '../../lib/category-modules'

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
    color: '#C8A96E',
    cssVar: 'var(--portrait)',
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
}

/* Nav activeNav key */
const URL_TO_NAV: Record<string, string> = {
  geo: 'geo', eco: 'eco', tech: 'tech', env: 'env',
  soc: 'soc', culture: 'culture', portraits: 'portrait',
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map(cat => ({ category: cat }))
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const config = CATEGORIES[params.category]
  if (!config) return {}
  const url = `https://soara.fr/${params.category}`
  return {
    title: config.labelLong,
    description: config.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${config.labelLong} · Soara`,
      description: config.description,
      siteName: 'Soara',
      locale: 'fr_FR',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: config.labelLong }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.labelLong} · Soara`,
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
  const articles = (articlesData as any[]).filter(a => a.category === categoryKey && !a.interviewType && !a.excludeFromCategoryList)

  const [featured, ...rest] = articles

  return (
    <>
      <Header activeNav={URL_TO_NAV[category]} />

      {/* BANDEAU RUBRIQUE */}
      <AnimBand className={styles.band} color={config.color}>
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
      </AnimBand>

      {articles.length === 0 ? (
        <div className={styles.empty}>
          <p>Les premiers articles de cette rubrique arrivent bientôt.</p>
          <Link href="/" className={styles.emptyBack}>← Retour à l'accueil</Link>
        </div>
      ) : (
        <div className={styles.layout} data-cat={categoryKey}>
          <div className={styles.mainCol}>

            {/* PORTRAITS : liste vignettes horizontales spécifique */}
            {params.category === "portraits" ? (
              <div className={styles.portraitsList}>
                {articles.map((article: any) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.portraitItem}>
                    {article.image && (
                      <div className={styles.portraitImg}>
                        <img src={article.image} alt={stripHtml(article.title)} />
                      </div>
                    )}
                    <div className={styles.portraitBody}>
                      <div className={styles.portraitEyebrow}>
                        Portrait · {formatReadTime(article.readTime, 'short')}{(article as any).premium ? ' · ★' : ''}
                      </div>
                      <div className={styles.portraitTitle} dangerouslySetInnerHTML={{__html: article.title.replace(/\n/g,' ')}} />
                      {article.description && (
                        <div className={styles.portraitDesc}>{article.description}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <AnimFeatured>
                  {/* ARTICLE FEATURED */}
                  {featured && (
                    <Link href={featured.grandFormatUrl || `/articles/${featured.slug}`} className={styles.featured}>
                      {featured.image && (
                        <div className={styles.featuredImgWrap}>
                          <img src={featured.image} alt={stripHtml(featured.title)} className={styles.featuredImg} />
                        </div>
                      )}
                      <div className={styles.featuredBody}>
                        <div className={styles.featuredEyebrow}>
                          <span className={styles.featuredTag} style={{ background: config.color }}>
                            {config.label}
                          </span>
                          <span className={styles.featuredTime}>{formatReadTime(featured.readTime, 'short')}</span>
                        </div>
                        <h2 className={styles.featuredTitle}>
                          <span dangerouslySetInnerHTML={{ __html: featured.title.replace(/\n/g, ' ') }} />
                        </h2>
                        {(featured as any).premium && <span className={styles.premiumBadge}>★ Premium</span>}
                        <p className={styles.featuredDeck}>{featured.description}</p>
                        <span className={styles.featuredCta} style={{ color: config.color }}>
                          Lire l'analyse →
                        </span>
                      </div>
                    </Link>
                  )}
                </AnimFeatured>

                {/* LISTE VERTICALE DES AUTRES ARTICLES (deux colonnes oblige) */}
                {rest.length > 0 && (
                  <AnimGrid className={styles.articleList}>
                    {rest.map(article => (
                      <AnimCard key={article.slug}>
                        <Link href={article.grandFormatUrl || `/articles/${article.slug}`} className={styles.articleRow}>
                          {article.image && (
                            <div className={styles.articleImg}>
                              <img src={article.image} alt={stripHtml(article.title)} />
                            </div>
                          )}
                          <div className={styles.articleBody}>
                            <div className={styles.articleEyebrow}>
                              <span className={styles.articleCat} style={{ color: config.color }}>{config.label}</span>
                              <span className={styles.articleTime}>{formatReadTime(article.readTime, 'short')}</span>
                              {(article as any).premium && <span className={styles.articlePremium}>★ Premium</span>}
                            </div>
                            <h3 className={styles.articleTitle}>
                              <span dangerouslySetInnerHTML={{ __html: article.title.replace(/\n/g, ' ') }} />
                            </h3>
                            {article.description && (
                              <p className={styles.articleDeck}>{article.description}</p>
                            )}
                            {(article as any).author && (
                              <div className={styles.articleAuthor}>Par {(article as any).author}</div>
                            )}
                          </div>
                        </Link>
                      </AnimCard>
                    ))}
                  </AnimGrid>
                )}
              </>
            )}
          </div>

          <div className={styles.sideCol}>
            <CategorySidebar category={categoryKey as CategoryKey} />
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
