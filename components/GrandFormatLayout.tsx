'use client'
import { useEffect, useState, ReactNode } from 'react'
import Header from './Header'
import BookmarkButton from './BookmarkButton'
import { ReadingProgress, ScrollDepth, StickyReadingHeader } from './ArticleAnimations'
import styles from './GrandFormatLayout.module.css'
import articlesData from '../lib/articles.json'

const CAT_LABELS: Record<string,string> = {
  geo:'Géopolitique', eco:'Économie', tech:'Technologie',
  env:'Environnement', soc:'Société', culture:'Culture',
  portrait:'Portrait', concept:'Concept', sciences:'Sciences'
}

const categoryColors: Record<string, string> = {
  geo: '#1A3E6B', eco: '#B86A1A', tech: '#4A2080',
  env: '#2D6B4A', soc: '#7A2D2D', culture: '#6B1A3A',
  portrait: '#7B5380', concept: '#1A1A3E', sciences: '#1A5C4A'
}

const portraitMap: Record<string, string> = {
  'Léo Cottencin':      '/portraits/cottencin.jpg',
  'Jade Desroses':      '/portraits/desroses.jpg',
  'Élisabeth Moreno':   '/portraits/moreno.jpg',
  'Éric Ouzounian':     '/portraits/ouzounian.jpg',
  'Steve Moradel':      '',
}

interface GrandFormatLayoutProps {
  // Pour les articles HTML classiques
  slug?: string
  content?: string
  showPaywall?: boolean
  lang?: string
  hasEnglish?: boolean
  toggleUrl?: string
  // Pour les pages React custom (dette-souveraine)
  children?: ReactNode
  // Métadonnées (override si pas de slug)
  title?: string
  description?: string
  image?: string
  category?: string
  categoryLabel?: string
  readTime?: string
  date?: string
  author?: string
  authorRole?: string
}

export default function GrandFormatLayout({
  slug, content, children,
  title: titleProp, description: descProp, image: imageProp,
  category: catProp, categoryLabel: catLabelProp,
  readTime: rtProp, date: dateProp,
  author: authorProp, authorRole: roleProp,
  showPaywall,
  lang = 'fr',
  hasEnglish = false,
  toggleUrl,
}: GrandFormatLayoutProps) {

  // Résoudre les métadonnées depuis articles.json ou les props
  const article = slug ? (articlesData as any[]).find(a => a.slug === slug) : null
  const title       = (lang === 'en' && (article as any)?.titleEn)
    ? (article as any).titleEn
    : (titleProp || article?.title || '')
  const description = (lang === 'en' && (article as any)?.descriptionEn)
    ? (article as any).descriptionEn
    : (descProp || article?.description || '')
  const image       = imageProp    || article?.image       || ''
  const category    = catProp      || article?.category    || 'geo'
  const categoryLabel = catLabelProp || article?.categoryLabel || 'Grand format'
  const readTime    = rtProp       || article?.readTime    || '12'
  const date        = dateProp     || article?.date        || ''
  const author      = authorProp   || article?.author      || 'Steve Moradel'
  const imagePosition = article?.imagePosition || 'center 30%'
  const imageHeight = article?.imageHeight ? parseInt(article.imageHeight) : 520
  const authorRole  = roleProp     || article?.authorRole  || ''

  const color = categoryColors[category] || '#B91C1C'
  const minutes = parseInt(readTime) || 12

  const MONTHS_FR: Record<string, string> = {
    '01':'Janvier','02':'Février','03':'Mars','04':'Avril',
    '05':'Mai','06':'Juin','07':'Juillet','08':'Août',
    '09':'Septembre','10':'Octobre','11':'Novembre','12':'Décembre'
  }
  const displayDate = date
    ? (() => { const [y, m] = date.split('-'); return `${MONTHS_FR[m] || m} ${y}` })()
    : 'Avril 2026'

  const portrait = portraitMap[author]

  // Détection header interne (articles HTML existants)
  const gfBase = (article as any)?.grandFormatUrl || (slug ? `/grands-formats/${slug}` : '')
  const gfToggleHref = lang === 'en' ? gfBase : (gfBase ? `${gfBase}?lang=en` : '')
  const hasInternalHeader = !!(content?.includes('class="atop"') || content?.includes('class="article-header"'))
  const hasHeroInContent  = !!(content?.includes('art-hero-wrap') || content?.includes('art-hero-img') || content?.includes('portrait-hero') || article?.category === 'portrait')

  // Articles liés — toujours 4 articles
  const _allArticles = articlesData as any[]
  const _explicitSlugs: string[] = (article?.relatedSlugs as string[]) || []
  let related: any[]
  if (_explicitSlugs.length > 0) {
    related = _explicitSlugs
      .map(s => _allArticles.find(a => a.slug === s))
      .filter((a): a is any => Boolean(a))
  } else {
    const _sameCat = _allArticles.filter(a => a.category === category && a.slug !== slug && a.image)
    const _otherCat = _allArticles.filter(a => a.category !== category && a.slug !== slug && a.image)
    related = [..._sameCat, ..._otherCat].slice(0, 4)
  }

  useEffect(() => {
    if (!content) return
    const art = document.querySelector('.soara-article')
    if (!art) return
    art.querySelectorAll('script').forEach((old: Element) => {
      const s = document.createElement('script')
      s.textContent = (old as HTMLScriptElement).textContent || ''
      old.parentNode?.replaceChild(s, old)
    })
    art.querySelectorAll('.content-embed iframe').forEach((iframe: Element) => {
      const el = iframe as HTMLIFrameElement
      const src = el.getAttribute('src') || ''
      if (src) { el.src = ''; setTimeout(() => { el.src = src }, 80) }
    })
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' })
    art.querySelectorAll('.pull-quote, .content-embed, .notes-section')
      .forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [content])

  return (
    <>
      <ReadingProgress />
      <ScrollDepth />
      <StickyReadingHeader title={title.replace(/<[^>]+>/g, '')} categoryLabel={categoryLabel} color={color} />
      <Header />

      {/* ── HEADER (si pas dans le HTML) ── */}
      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>
              {minutes} min de lecture
            </span>
            {hasEnglish && slug && (
              <a href={gfToggleHref}
                style={{fontFamily:"'DM Sans',sans-serif",fontSize:'10px',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase' as const,color:'#C8A96E',textDecoration:'none',borderBottom:'1.5px solid #C8A96E',paddingBottom:'1px',marginLeft:'8px'}}>
                {lang === 'en' ? 'Lire en français' : 'Read in English'}
              </a>
            )}
            <span className={styles.readDate}>{displayDate}</span>
          </div>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
          {description && <p className={styles.chapeau}>{description}</p>}
        </div>
      )}

      {/* ── BYLINE (si pas dans le HTML) ── */}
      {!hasInternalHeader && (
        <div className={styles.byline}>
          <div className={styles.avatar}>
            {portrait ? <img src={portrait} alt={author} /> : author.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className={styles.authorName}>{author}</div>
            <div className={styles.authorRole}>{authorRole}</div>
          </div>
        </div>
      )}

      {/* ── COVER IMAGE (après le header) ── */}
      {image && !hasHeroInContent && (
        <div className={styles.heroWrap} style={{height: imageHeight + 'px', maxHeight: 'none'}}>
          <img src={image} alt={title.replace(/<[^>]+>/g, '')} className={styles.heroImg}
            style={{
              objectPosition: imagePosition,
              height: imageHeight + 'px',
              objectFit: (article?.imageFit || 'cover') as 'cover' | 'contain',
              background: article?.imageFit === 'contain' ? '#F8F4EE' : undefined
            }} />
        </div>
      )}

      {/* ── BODY ── */}
      <div className={`${styles.body} grand-format-body`}>
        {content && (
          (showPaywall ?? article?.premium) ? (
            <div className={styles.paywallWrap}>
              <div className={styles.paywallTeaser}>
                <div
                  className="soara-article"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className={styles.paywallFade} />
              </div>
              <div className={styles.paywallBox}>
                <div className={styles.paywallEyebrow}>Contenu réservé aux abonnés</div>
                <h3 className={styles.paywallTitle}>Continuez la lecture</h3>
                <p className={styles.paywallDesc}>Accédez à l&apos;intégralité de cet article et à tous les grands formats Soara.</p>
                <a href="/abonnement" className={styles.paywallCta}>S&apos;abonner — dès 9,99€/mois</a>
                <a href="/connexion" className={styles.paywallLogin}>Déjà abonné&nbsp;? Se connecter</a>
              </div>
            </div>
          ) : (
            <div className="soara-article" dangerouslySetInnerHTML={{ __html: content }} />
          )
        )}
        {/* Contenu React (dette-souveraine, etc.) — masqué si content EN fourni */}
        {children && !content && (
          (showPaywall ?? article?.premium) ? (
            <div className={styles.paywallWrap}>
              <div className={`${styles.paywallTeaser} ${styles.paywallTeaserReact}`}>
                {children}
                <div className={styles.paywallFade} />
              </div>
              <div className={styles.paywallBox}>
                <div className={styles.paywallEyebrow}>Contenu réservé aux abonnés</div>
                <h3 className={styles.paywallTitle}>Continuez la lecture</h3>
                <p className={styles.paywallDesc}>Accédez à l&apos;intégralité de cet article et à tous les grands formats Soara.</p>
                <a href="/abonnement" className={styles.paywallCta}>S&apos;abonner — dès 9,99€/mois</a>
                <a href="/connexion" className={styles.paywallLogin}>Déjà abonné&nbsp;? Se connecter</a>
              </div>
            </div>
          ) : (
            <>{children}</>
          )
        )}

        {/* ── BOOKMARK ── */}
        {slug && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 32px', display: 'flex', justifyContent: 'center' }}>
            <BookmarkButton slug={slug} title={title} image={image} description={description} readTime={readTime} categoryLabel={categoryLabel} />
          </div>
        )}

        {/* Signature bas */}
        <div className={styles.signature}>
          <div className={styles.avatar}>
            {portrait ? <img src={portrait} alt={author} /> : author.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className={styles.sigLabel}>Auteur</div>
            <div className={styles.sigName}>{author}</div>
            <div className={styles.sigRole}>{authorRole}</div>
          </div>
        </div>
      </div>

      {/* ── ARTICLES LIÉS ── */}
      {related.length > 0 && !article?.hideAutoRelated && (
        <div className={styles.related}>
          <div className={styles.relatedHead}>
            <span className={styles.relatedLabel}>Lire aussi</span>
            <div className={styles.relatedLine} />
          </div>
          <div className={styles.relatedGrid}>
            {related.map((a: any) => (
              <a key={a.slug} href={a.customRoute || `/articles/${a.slug}`} className={styles.relatedCard}>
                {a.image && <img src={a.image} alt={a.title.replace(/<[^>]+>/g,'')} className={styles.relatedThumb} style={a.imagePosition ? {objectPosition: a.imagePosition} : undefined} />}
                <div className={styles.relatedCat}>{(a.categoryLabel || CAT_LABELS[a.category as string] || a.category || '').toUpperCase()}</div>
                <div className={styles.relatedTitle}>{a.title.replace(/<[^>]+>/g, '')}</div>
                <span className={styles.relatedCta}>Lire l'analyse →</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
