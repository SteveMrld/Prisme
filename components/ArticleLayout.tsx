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
  hasInternalHeader?: boolean
  hasHeroInContent?: boolean
  premium?: boolean
  slug?: string
  content: string
  author?: string
  authorRole?: string
  related?: any[]
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
  readTime, hasInternalHeader = false, hasHeroInContent = false, premium: isPremiumContent = false, content, slug = '',
  author = 'Steve Moradel',
  authorRole = 'Fondateur · Directeur de la rédaction',
  related = []
}: ArticleLayoutProps) {
  const color = categoryColors[category] || '#0A0A0A'
  const minutes = parseInt(readTime) || 8

  useEffect(() => {
    const article = document.querySelector('.confins-article')
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
            style={{ height: '420px', objectPosition: 'center 15%' }} />
        </div>
      )}

      {/* TOUS SAUF PORTRAIT : titre + chapeau d'abord */}
      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>{isNaN(parseInt(readTime)) ? readTime : `${readTime} min de lecture`}</span>
            <span className={styles.readDate}>Mars 2026</span>
          </div>
          <div className={styles.titleRow}>
            <span className={styles.pBadgeArticle}>P</span>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          {description && (
            <p className={styles.chapeau}>{description}</p>
          )}
        </div>
      )}

      {/* IMAGE après le titre pour tous sauf portrait (skip si déjà dans le contenu) */}
      {category !== 'portrait' && image && !hasHeroInContent && (
        <div className={styles.heroWrap}>
          <img src={image} alt={title} className={styles.heroImg} />
        </div>
      )}

      {/* BYLINE — uniquement pour les articles sans header interne
          (les articles avec header interne ont leur propre structure dans le HTML) */}
      {!hasInternalHeader && (
        <div className={styles.bylineUniversal}>
          <div className={styles.bylineTop}>
            {portraitUrl(author)
              ? <img src={portraitUrl(author)!} alt={author} className={styles.bylineTopAvatar} style={{objectFit:'cover',objectPosition:'top center'}} />
              : <div className={styles.bylineTopAvatar}>{initials(author)}</div>
            }
            <div>
              <div className={styles.bylineTopName}>{author}</div>
              <div className={styles.bylineTopRole}>{authorRole}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── BARRE ACTIONS — casque + partage natif + marque-page ── */}
      <div className={hasInternalHeader ? styles.articleBodyFull : styles.articleBody}>
        {isPremiumContent ? (
          <div className={styles.paywallWrap}>
            <div className={styles.paywallContent}>
              <div className="confins-article" dangerouslySetInnerHTML={{ __html: content }} />
              <div className={styles.paywallGradient} />
            </div>
            <div className={styles.paywallBox}>
              <div className={styles.paywallEyebrow}>Contenu réservé aux abonnés</div>
              <h3 className={styles.paywallTitle}>Continuez la lecture</h3>
              <p className={styles.paywallDesc}>Accédez à l'intégralité de cet article et à tous les grands formats Confins.</p>
              <a href="/abonnement" className={styles.paywallCta}>S&apos;abonner — dès 9,99€/mois</a>
              <a href="/connexion" className={styles.paywallLogin}>Déjà abonné&nbsp;? Se connecter</a>
            </div>
          </div>
        ) : (
          <div className="confins-article" dangerouslySetInnerHTML={{ __html: content }} />
        )}

        {/* SIGNATURE BAS */}
        <div className={styles.authorSignature}>
          {portraitUrl(author)
            ? <img src={portraitUrl(author)!} alt={author} className={styles.authorSigAvatar} style={{objectFit:'cover',objectPosition:'top center'}} />
            : <div className={styles.authorSigAvatar}>{initials(author)}</div>
          }
          <div className={styles.authorSigBody}>
            <div className={styles.authorSigLabel}>Auteur</div>
            <div className={styles.authorSigName}>{author}</div>
            <div className={styles.authorSigRole}>{authorRole}</div>
          </div>
        </div>
      </div>

      {/* ── ARTICLES LIÉS ── */}
      {related.length > 0 && (
        <div className={styles.related}>
          <div className={styles.relatedHead}>
            <div className={styles.relatedLabel}>Lire aussi</div>
            <div className={styles.relatedLine} />
          </div>
          <div className={styles.relatedGrid}>
            {related.map((a: any) => (
              <a key={a.slug} href={`/articles/${a.slug}`} className={styles.relatedCard}>
                {a.image && (
                  <div className={styles.relatedImgWrap}>
                    <img src={a.image} alt={a.title} className={styles.relatedImg} />
                    <div className={styles.relatedImgOverlay} />
                  </div>
                )}
                <div className={styles.relatedBody}>
                  <div className={styles.relatedMeta}>
                    <span className={styles.relatedCat}>{a.category?.toUpperCase()}</span>
                    <span className={styles.relatedTime}>{isNaN(parseInt(a.readTime)) ? a.readTime : `${a.readTime} min`}</span>
                  </div>
                  <div className={styles.relatedTitle}>{a.title.replace(/<[^>]+>/g, '')}</div>
                  {a.author && <div className={styles.relatedAuthor}>Par {a.author}</div>}
                  <span className={styles.relatedCta}>Lire →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}





      <div className={styles.actionBar}>
        <button className={styles.actionBtn} title="Écouter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
            <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
          </svg>
        </button>
        <button className={styles.actionBtn} title="Partager" onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ title: typeof document !== 'undefined' ? document.title : '', url: typeof window !== 'undefined' ? window.location.href : '' })
          }
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
        {slug && <BookmarkButton slug={slug} title={title} iconOnly />}
      </div>

      {/* ── NEWSLETTER ── */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <div className={styles.newsletterLabel}>Confins · Newsletter</div>
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
        Confins &nbsp;·&nbsp; Média d'analyse indépendant &nbsp;·&nbsp; 2026
      </footer>
    </>
  )
}
