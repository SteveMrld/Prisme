'use client'
import { useEffect, useState, ReactNode } from 'react'
import Header from './Header'
import BookmarkButton from './BookmarkButton'
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
  showPaywall?: boolean
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
  const hasInternalHeader = !!(content?.includes('class="atop"') || content?.includes('class="article-header"'))
  const hasHeroInContent  = !!(content?.includes('art-hero-wrap') || content?.includes('art-hero-img') || content?.includes('portrait-hero') || article?.category === 'portrait')

  // Articles liés
  const sameCat = (articlesData as any[]).filter(a => a.category === category && a.slug !== slug)
  const otherCat = (articlesData as any[]).filter(a => a.category !== category && a.slug !== slug)
  const related = [...sameCat, ...otherCat].slice(0, 4)

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

      {/* ── COVER IMAGE (si pas dans le HTML) ── */}
      {image && !hasHeroInContent && (
        <div className={styles.heroWrap}>
          <img src={image} alt={title.replace(/<[^>]+>/g, '')} className={styles.heroImg}
            style={{
              objectPosition: imagePosition,
              height: imageHeight + 'px',
              objectFit: (article?.imageFit || 'cover') as 'cover' | 'contain',
              background: article?.imageFit === 'contain' ? '#F8F4EE' : undefined
            }} />
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
          (showPaywall ?? article?.premium) ? (
            <div style={{position:'relative'}}>
              <div style={{maxHeight:'620px',overflow:'hidden',position:'relative'}}>
                <div className="soara-article" dangerouslySetInnerHTML={{ __html: content }} />
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'340px',background:'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,1) 100%)',pointerEvents:'none'}} />
              </div>
              <div style={{textAlign:'center',padding:'0 24px 48px',background:'#fff'}}>
                <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#C8A96E',marginBottom:'14px'}}>Contenu réservé aux abonnés</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:400,letterSpacing:'-0.5px',color:'#1a1a1a',marginBottom:'12px',lineHeight:1.2}}>Continuez la lecture</h3>
                <p style={{fontSize:'15px',color:'#888',maxWidth:'360px',margin:'0 auto 28px',lineHeight:1.65,fontStyle:'italic',fontFamily:"'Playfair Display',serif"}}>Accédez à l'intégralité de cet article et à tous les grands formats Soara.</p>
                <a href="/abonnement" style={{display:'inline-block',background:'#1a1a1a',color:'#fff',textDecoration:'none',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'14px 32px',marginBottom:'12px'}}>S&apos;abonner — dès 9,99€/mois</a>
                <br/>
                <a href="/connexion" style={{fontSize:'11px',color:'#888',textDecoration:'none'}}>Déjà abonné&nbsp;? Se connecter</a>
              </div>
            </div>
          ) : (
            <div className="soara-article" dangerouslySetInnerHTML={{ __html: content }} />
          )
        )}
        {/* Contenu React (dette-souveraine, etc.) */}
        {children && (
          (showPaywall ?? article?.premium) ? (
            <div style={{position:'relative'}}>
              <div style={{maxHeight:'620px',overflow:'hidden',position:'relative'}}>
                {children}
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'340px',background:'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,1) 100%)',pointerEvents:'none'}} />
              </div>
              <div style={{textAlign:'center',padding:'0 24px 48px',background:'#fff'}}>
                <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#C8A96E',marginBottom:'14px'}}>Contenu réservé aux abonnés</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:400,letterSpacing:'-0.5px',color:'#1a1a1a',marginBottom:'12px',lineHeight:1.2}}>Continuez la lecture</h3>
                <p style={{fontSize:'15px',color:'#888',maxWidth:'360px',margin:'0 auto 28px',lineHeight:1.65,fontStyle:'italic',fontFamily:"'Playfair Display',serif"}}>Accédez à l'intégralité de cet article et à tous les grands formats Soara.</p>
                <a href="/abonnement" style={{display:'inline-block',background:'#1a1a1a',color:'#fff',textDecoration:'none',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'14px 32px',marginBottom:'12px'}}>S&apos;abonner — dès 9,99€/mois</a>
                <br/>
                <a href="/connexion" style={{fontSize:'11px',color:'#888',textDecoration:'none'}}>Déjà abonné&nbsp;? Se connecter</a>
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
