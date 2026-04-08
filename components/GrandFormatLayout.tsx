'use client'
import { useEffect, useState, ReactNode } from 'react'
import Header from './Header'
import { ReadingProgress, ScrollDepth, StickyReadingHeader } from './ArticleAnimations'
import styles from './GrandFormatLayout.module.css'
import articlesData from '../lib/articles.json'

const categoryColors: Record<string, string> = {
  geo: '#1A3E6B', eco: '#B86A1A', tech: '#4A2080',
  env: '#2D6B4A', soc: '#7A2D2D', culture: '#6B1A3A',
  portrait: '#C8A96E', concept: '#1A1A3E', sciences: '#1A5C4A'
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
}: GrandFormatLayoutProps) {

  // Résoudre les métadonnées depuis articles.json ou les props
  const article = slug ? (articlesData as any[]).find(a => a.slug === slug) : null
  const title       = titleProp    || article?.title       || ''
  const description = descProp     || article?.description || ''
  const image       = imageProp    || article?.image       || ''
  const category    = catProp      || article?.category    || 'geo'
  const categoryLabel = catLabelProp || article?.categoryLabel || 'Grand format'
  const readTime    = rtProp       || article?.readTime    || '12'
  const date        = dateProp     || article?.date        || ''
  const author      = authorProp   || article?.author      || 'Steve Moradel'
  const authorRole  = roleProp     || article?.authorRole  || 'Fondateur · Prisme'

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
  const hasInternalHeader = !!(content?.includes('class="atop"') || content?.includes('class="article-header"'))
  const hasHeroInContent  = !!(content?.includes('art-hero-wrap') || content?.includes('art-hero-img') || content?.includes('portrait-hero') || article?.category === 'portrait')

  // Articles liés
  const related = (articlesData as any[])
    .filter(a => a.category === category && a.slug !== slug)
    .slice(0, 3)

  useEffect(() => {
    if (!content) return
    const art = document.querySelector('.confins-article')
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

      {/* ── COVER IMAGE (si pas dans le HTML) ── */}
      {image && !hasHeroInContent && (
        <div className={styles.heroWrap}>
          <img src={image} alt={title.replace(/<[^>]+>/g, '')} className={styles.heroImg} />
        </div>
      )}

      {/* ── HEADER (si pas dans le HTML) ── */}
      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>{minutes} min de lecture</span>
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

      {/* ── BODY ── */}
      <div className={`${styles.body} grand-format-body`}>
        {/* Contenu HTML classique */}
        {content && (
          <div className="confins-article" dangerouslySetInnerHTML={{ __html: content }} />
        )}
        {/* Contenu React (dette-souveraine, etc.) */}
        {children}

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
      {related.length > 0 && (
        <div className={styles.related}>
          <div className={styles.relatedHead}>
            <span className={styles.relatedLabel}>Lire aussi</span>
            <div className={styles.relatedLine} />
          </div>
          <div className={styles.relatedGrid}>
            {related.map((a: any) => (
              <a key={a.slug} href={a.customRoute || `/articles/${a.slug}`} className={styles.relatedCard}>
                {a.image && <img src={a.image} alt={a.title.replace(/<[^>]+>/g,'')} className={styles.relatedThumb} />}
                <div className={styles.relatedCat}>{(a.categoryLabel || a.category || '').toUpperCase()}</div>
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
