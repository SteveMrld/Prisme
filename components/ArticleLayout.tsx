'use client'
import { useEffect } from 'react'
import BookmarkButton from './BookmarkButton'
import Header from './Header'
import styles from './ArticleLayout.module.css'
import { ReadingProgress, ReadingTimeCounter, ScrollDepth, StickyReadingHeader } from './ArticleAnimations'

interface ArticleLayoutProps {
  title: string
  description: string
  image: string
  category: string
  categoryLabel: string
  readTime: string
  date?: string
  hasInternalHeader?: boolean
  hasHeroInContent?: boolean
  premium?: boolean
  slug?: string
  content: string
  author?: string
  authorRole?: string
  related?: any[]
  imageCredit?: string
  lang?: string
  hasEnglish?: boolean
}

const categoryColors: Record<string, string> = {
  geo: '#1A3E6B', eco: '#B86A1A', tech: '#4A2080',
  env: '#2D6B4A', soc: '#7A2D2D', culture: '#6B1A3A',
  portrait: '#C8A96E', concept: '#1A1A3E', sciences: '#1A5C4A'
}

// Initiales pour l'avatar texte
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

// Portrait URL depuis /public/portraits/
function portraitUrl(name: string): string | null {
  const map: Record<string, string> = {
    'Léo Cottencin':      '/portraits/cottencin.jpg',
    'Jade Desroses':      '/portraits/desroses.jpg',
    'Laetitia Hélouet':   '/portraits/helouet.jpg',
    'Fatemeh Jailani':    '/portraits/jailani.jpg',
    'Claire Le Flécher':  '/portraits/leflecher.jpg',
    'Élodie Mielczareck': '/portraits/mielczareck.jpg',
    'Élisabeth Moreno':   '/portraits/moreno.jpg',
    'Éric Ouzounian':     '/portraits/ouzounian.jpg',
    'Pierre Sonigo':      '/portraits/sonigo.jpg',
    'Majda Vincent':      '/portraits/vincent.jpg',
  }
  return map[name] || null
}

export default function ArticleLayout({
  title, description, image, category, categoryLabel,
  readTime, date, hasInternalHeader = false, hasHeroInContent = false, premium: isPremiumContent = false, content, slug = '',
  author = 'Steve Moradel',
  authorRole = '',
  related = [],
  imageCredit = '',
  lang = 'fr',
  hasEnglish = false,
}: ArticleLayoutProps) {
  const color = categoryColors[category] || '#0A0A0A'
  const minutes = parseInt(readTime) || 8

  const MONTHS_FR: Record<string, string> = {
    '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
    '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
    '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
  }
  const displayDate = date
    ? (() => { const [y, m] = date.split('-'); return `${MONTHS_FR[m] || m} ${y}` })()
    : 'Mars 2026'

  useEffect(() => {
    const article = document.querySelector('.soara-article')
    if (!article) return

    // Execute scripts injected via dangerouslySetInnerHTML
    article.querySelectorAll('script').forEach((oldScript: Element) => {
      const newScript = document.createElement('script')
      newScript.textContent = (oldScript as HTMLScriptElement).textContent || ''
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
    // Re-trigger iframes
    article.querySelectorAll('.content-embed iframe').forEach((iframe: Element) => {
      const el = iframe as HTMLIFrameElement
      const src = el.getAttribute('src') || ''
      if (src) { el.src = ''; setTimeout(() => { el.src = src }, 80) }
    })

    // Scroll reveal — stagger par élément
    const targets = article.querySelectorAll('.pull-quote, .content-embed, .notes-section')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.style.transitionDelay = `${i * 0.04}s`
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' })

    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <ReadingProgress />
      <ReadingTimeCounter totalMinutes={minutes} />
      <ScrollDepth />
      <StickyReadingHeader title={title} categoryLabel={categoryLabel} color={color} />
      <Header activeNav={category} />

      {/* PORTRAIT : image d'abord */}
      {category === 'portrait' && image && !hasHeroInContent && (
        <div className={styles.heroWrap}>
          <img src={image} alt={title} className={styles.heroImg}
            style={{ height: '420px', objectFit: 'contain', objectPosition: 'center center', background: '#fff' }} />
        </div>
      )}

      {/* TOUS SAUF PORTRAIT : titre + chapeau d'abord */}
      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>
              {isNaN(parseInt(readTime)) ? readTime : `${readTime} min de lecture`}
            </span>
            <span className={styles.readDate}>{displayDate}</span>

          </div>
          <div className={styles.titleRow}>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
            {isPremiumContent && (
              <span style={{display:'inline-block',background:'#C8A96E',color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:'9px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'4px 10px',borderRadius:'3px',marginTop:'10px',width:'fit-content'}}>★ PREMIUM</span>
            )}
          </div>
          {description && (
            <p className={styles.chapeau}>{description}</p>
          )}
        </div>
      )}
          }
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
        {slug && <BookmarkButton slug={slug} title={title} image={image} description={description} readTime={readTime} categoryLabel={categoryLabel} iconOnly />}
      </div>

      {/* ── BOOKMARK ── */}
      {slug && (
        <div style={{
          maxWidth: 760, margin: '0 auto', padding: '0 24px 32px',
          display: 'flex', justifyContent: 'center'
        }}>
          <BookmarkButton slug={slug} title={title} image={image} description={description} readTime={readTime} categoryLabel={categoryLabel} />
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <div className={styles.newsletterLabel}>Soara · Newsletter</div>
            <div className={styles.newsletterTitle}>Recevoir les analyses chaque semaine</div>
            <p className={styles.newsletterDesc}>Les grands formats, le Signal, les portraits. Sans algorithme, sans bruit.</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={async e => { e.preventDefault(); const form = e.currentTarget; const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value; if (!email) return; await fetch('/api/newsletter', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email}) }); if (typeof window !== 'undefined') window.location.href = '/abonnement'; }}>
            <input type="email" placeholder="votre@email.com" className={styles.newsletterInput} required />
            <button type="submit" className={styles.newsletterBtn}>S&apos;abonner →</button>
          </form>
        </div>
      </div>

      <footer className={styles.footer}>
        Soara &nbsp;·&nbsp; Média d'analyse indépendant &nbsp;·&nbsp; 2026
      </footer>
    </>
  )
}
