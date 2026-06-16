'use client'
import { useEffect, useState } from 'react'
import BookmarkButton from './BookmarkButton'
import BackButton from './BackButton'
import Header from './Header'
import NewsletterForm from './NewsletterForm'
import styles from './ArticleLayout.module.css'
import { ReadingProgress, ReadingTimeCounter, ScrollDepth, StickyReadingHeader } from './ArticleAnimations'
import { formatReadTime } from '../lib/format'

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
  avif?: boolean
  slug?: string
  content: string
  author?: string
  authorRole?: string
  authorBio?: string
  related?: any[]
  imageCredit?: string
  imagePosition?: string
  imageFit?: string
  imageHeight?: string
  format?: string
  lang?: string
  hasEnglish?: boolean
  adSlot?: React.ReactNode
}

const formatLabels: Record<string, string> = {
  'grand-entretien': 'Grand Entretien',
  'enquete': 'Enquête',
  'reportage': 'Reportage',
  'analyse': 'Analyse',
  'tribune': 'Tribune',
}

const categoryColors: Record<string, string> = {
  geo: '#1A3E6B', eco: '#B86A1A', tech: '#4A2080',
  env: '#2D6B4A', soc: '#7A2D2D', culture: '#6B1A3A',
  portrait: '#7B5380'
}

// Initiales pour l'avatar texte
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

// Portrait URL depuis /public/portraits/
function portraitUrl(name: string): string | null {
  const map: Record<string, string> = {
    'Agathe Cagé':        '/portraits/cage.jpg',
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
    'Abad Boumsong':      '/portraits/boumsong.jpg',
  }
  return map[name] || null
}

// Lien d'auteur (site perso ou page Wikipédia) affiché dans le bloc
// signature de fin d'article, avec picto. Clés strictement identiques
// à portraitUrl (accents compris) pour qu'aucun mismatch silencieux.
function authorLink(name: string): { url: string; type: 'website' | 'wikipedia' } | null {
  const map: Record<string, { url: string; type: 'website' | 'wikipedia' }> = {
    'Majda Vincent':    { url: 'https://majdavincent.com/',                       type: 'website' },
    'Steve Moradel':    { url: 'https://stevemoradel.com/',                       type: 'website' },
    'Abad Boumsong':    { url: 'https://leprincedespoetes.fr/',                   type: 'website' },
    'Jade Desroses':    { url: 'https://lespagesdejade.com/',                     type: 'website' },
    'Agathe Cagé':      { url: 'https://fr.wikipedia.org/wiki/Agathe_Cagé',       type: 'wikipedia' },
    'Élisabeth Moreno': { url: 'https://fr.wikipedia.org/wiki/Élisabeth_Moreno',  type: 'wikipedia' },
  }
  return map[name] || null
}

const WebsiteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="2.5" x2="12" y2="21.5" />
    <path d="M2.5 12 H 21.5" />
    <path d="M2.5 8 H 21.5" />
    <path d="M2.5 16 H 21.5" />
  </svg>
)

const WikipediaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <text x="12" y="18" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="18" fontWeight="400">W</text>
  </svg>
)

export default function ArticleLayout({
  title, description, image, category, categoryLabel,
  readTime, date, hasInternalHeader = false, hasHeroInContent = false, premium: isPremiumContent = false, avif = false, content, slug = '',
  author = 'Steve Moradel',
  authorRole = '',
  authorBio = '',
  related = [],
  imageCredit = '',
  imagePosition,
  imageFit,
  imageHeight,
  format,
  lang = 'fr',
  hasEnglish = false,
  adSlot = null
}: ArticleLayoutProps) {
  const color = categoryColors[category] || '#0A0A0A'
  const minutes = parseInt(readTime) || 8

  // Article signé par un contributeur extérieur : chapeau en gras serif et
  // bloc bio enrichi en fin d'article. On exclut la rédaction "Soara" qui
  // n'est pas un contributeur nommé. Détection automatique : tout futur
  // contributeur ajouté à articles.json hérite du traitement sans config.
  const isContributor = !!author && author !== 'Steve Moradel' && author !== 'Soara'

  // Whitelist drop cap : seul overton conserve la lettrine.
  // cygne et predateurs retirés (régression animations rapportée le 2026-05-13,
  // root cause non isolée depuis le CLI). À ré-investiguer avec preview navigateur.
  const HAS_DROP_CAP = ['overton']
  const showDropCap = slug ? HAS_DROP_CAP.includes(slug) : false

  const MONTHS_FR: Record<string, string> = {
    '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
    '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
    '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
  }
  const MONTHS_EN: Record<string, string> = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December'
  }
  const displayDate = date
    ? (() => { const [y, m] = date.split('-'); return `${MONTHS_FR[m] || m} ${y}` })()
    : 'Mars 2026'
  // Date complète pour byline : "18 avril 2026" en FR, "April 18, 2026" en EN
  const fullDate = date
    ? (() => {
        const [y, m, d] = date.split('-')
        const dayNum = parseInt(d, 10)
        if (lang === 'en') {
          return `${MONTHS_EN[m] || m} ${dayNum}, ${y}`
        }
        return `${dayNum} ${(MONTHS_FR[m] || m).toLowerCase()} ${y}`
      })()
    : ''

  useEffect(() => {
    const article = document.querySelector('.soara-article')
    if (!article) return
    article.querySelectorAll('script').forEach((el: Element) => {
      const s = document.createElement('script')
      s.textContent = (el as HTMLScriptElement).textContent || ''
      el.parentNode?.replaceChild(s, el)
    })
  }, [])

  // Reveal-on-scroll des elements editoriaux structurants dans le corps.
  // Le contenu est injecte par dangerouslySetInnerHTML, donc on l'instrumente
  // au mount via un observer. Une seule passe par element (unobserve apres).
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const article = document.querySelector('.soara-article')
    if (!article) return

    const targets = article.querySelectorAll(
      'figure, blockquote, .pull-quote, h2'
    )
    if (!targets.length) return

    targets.forEach(el => el.classList.add('article-reveal'))

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('article-revealed')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [content])

  return (
    <>
      <div className="no-print">
        <ReadingProgress />
        <ReadingTimeCounter totalMinutes={minutes} />
        <ScrollDepth />
        <StickyReadingHeader title={title} categoryLabel={categoryLabel} color={color} />
        <Header activeNav={category} />
        <BackButton />
      </div>

      {/* TOUS SAUF PORTRAIT : titre + chapeau d'abord */}
      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          {format && formatLabels[format] && (
            <div style={{display:'flex',justifyContent:'center',marginBottom:'18px'}}>
              <span style={{display:'inline-block',background:'#0A0A0A',color:'#C8A96E',fontFamily:"'DM Sans',sans-serif",fontSize:'10px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',padding:'6px 14px',border:'1px solid #C8A96E',borderRadius:'2px'}}>{formatLabels[format]}</span>
            </div>
          )}
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>{isNaN(parseInt(readTime)) ? readTime : `${readTime} min de lecture`}</span>
            <span className={styles.readDate}>{displayDate}</span>
          </div>
          <div className={styles.titleRow}>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
            {isPremiumContent && (
              <span style={{display:'inline-block',background:'#C8A96E',color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:'9px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'4px 10px',borderRadius:'3px',marginTop:'10px',width:'fit-content'}}>★ PREMIUM</span>
            )}
            {avif && (
              <span style={{display:'inline-block',background:'#7A1A2E',color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:'8px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'3px 8px',borderRadius:'2px',marginTop:'10px',marginLeft:isPremiumContent?'8px':'0',width:'fit-content'}}>À VIF</span>
            )}
          </div>
          {description && (
            <p className={styles.chapeau}>{description}</p>
          )}
        </div>
      )}

      {/* IMAGE après le titre pour tous sauf portrait (skip si déjà dans le contenu) */}
      {image && !hasHeroInContent && (
        <figure className={category === 'portrait' ? '' : styles.heroWrap} style={category === 'portrait' ? {width:'100%', margin:'24px 0', background:'transparent'} : {}}>
          <img src={image} alt={title} className={category === 'portrait' ? '' : styles.heroImg}
            style={category === 'portrait'
              ? {width:'100%', maxHeight:'480px', height:'auto', display:'block', objectFit:'contain'}
              : {
                  ...(imagePosition ? {objectPosition: imagePosition} : {}),
                  ...(imageFit ? {objectFit: imageFit as any} : {}),
                  ...(imageHeight ? {height: imageHeight} : {}),
                  ...(imageFit === 'contain' ? {background:'#F8F4EE'} : {})
                }} />
          {imageCredit && <figcaption className={styles.imageCredit}>{imageCredit}</figcaption>}
        </figure>
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
            <div style={{flex:1, minWidth:0}}>
              <div className={styles.bylineTopName}>
                <span className={styles.bylinePrefix}>{lang === 'en' ? 'By ' : 'Par '}</span>{author}
                {authorRole && <span className={styles.bylineSep}> · </span>}
                {authorRole && <span className={styles.bylineTopRole}>{authorRole}</span>}
              </div>
              {fullDate && (
                <div className={styles.bylineDate}>
                  {lang === 'en' ? `Published ${fullDate}` : `Publié le ${fullDate}`}
                </div>
              )}
            </div>
            {hasEnglish && (
              <a
                href={lang === 'en' ? `/articles/${slug}` : `/articles/${slug}?lang=en`}
                className={styles.langToggle}
              >
                {lang === 'en' ? 'Lire en français' : 'Read in English'}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Toggle EN également affiché sur les articles à header interne
          (eau, france_maritime, taiwan, cygne, overton, predateurs) qui n'ont pas la byline ci-dessus */}
      {hasInternalHeader && hasEnglish && (
        <div className={styles.langToggleStandalone}>
          <a
            href={lang === 'en' ? `/articles/${slug}` : `/articles/${slug}?lang=en`}
            className={styles.langToggle}
          >
            {lang === 'en' ? 'Lire en français' : 'Read in English'}
          </a>
        </div>
      )}

      {/* ── LAYOUT DESKTOP : article + sidebar ── */}
      <div className={styles.articlePageLayout}>
      <div className={styles.articleMainCol}>
      <div className={`${hasInternalHeader ? styles.articleBodyFull : styles.articleBody}${showDropCap ? ' has-drop-cap' : ''}`}>
        {isPremiumContent ? (
          <div className={styles.paywallWrap}>
            <div className={styles.paywallContent}>
              <div className="soara-article" dangerouslySetInnerHTML={{ __html: content }} />
              <div className={styles.paywallGradient} />
            </div>
            <div className={styles.paywallBox}>
              <div className={styles.paywallEyebrow}>Contenu réservé aux abonnés</div>
              <h3 className={styles.paywallTitle}>Continuez la lecture</h3>
              <p className={styles.paywallDesc}>Accédez à l'intégralité de cet article et à tous les grands formats Soara.</p>
              <a href="/abonnement" className={styles.paywallCta}>S&apos;abonner, dès 9,99€/mois</a>
              <a href="/connexion" className={styles.paywallLogin}>Déjà abonné&nbsp;? Se connecter</a>
            </div>
          </div>
        ) : (
          <div className="soara-article" dangerouslySetInnerHTML={{ __html: content }} />
        )}

        {/* SPONSOR — bloc partenaire en fin d'article (hors paywall actif) */}
        {!isPremiumContent && adSlot && <div className="no-print">{adSlot}</div>}

        {/* CTA ABONNEMENT — articles gratuits uniquement */}
        {!isPremiumContent && (
          <div className="no-print" style={{borderTop:'2px solid #1a1a1a',margin:'48px 0 0',padding:'40px 0 0',textAlign:'center'}}>
            <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#C8A96E',marginBottom:'12px'}}>Soara · Média d'analyse indépendant</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(20px,3vw,28px)',fontWeight:400,color:'#1a1a1a',marginBottom:'10px',lineHeight:1.2}}>Accédez à tous les grands formats</h3>
            <p style={{fontSize:'14px',color:'#888',maxWidth:'340px',margin:'0 auto 24px',lineHeight:1.6,fontStyle:'italic',fontFamily:"'Playfair Display',serif"}}>Analyses approfondies, données exclusives, formats inédits. Sans publicité, sans algorithme.</p>
            <a href="/abonnement" style={{display:'inline-block',background:'#1a1a1a',color:'#fff',textDecoration:'none',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',padding:'13px 28px',marginBottom:'10px'}}>S'abonner, dès 9,99€/mois</a>
            <br/>
            <a href="/connexion" style={{fontSize:'11px',color:'#aaa',textDecoration:'none'}}>Déjà abonné ? Se connecter</a>
          </div>
        )}

        {/* SIGNATURE BAS — variante enrichie pour les contributeurs externes
            (photo plus grande, paragraphe bio sous le rôle) */}
        <div className={`${styles.authorSignature}${isContributor ? ' ' + styles.authorSignatureContributor : ''}`}>
          {portraitUrl(author)
            ? <img src={portraitUrl(author)!} alt={author} className={styles.authorSigAvatar} style={{objectFit:'cover',objectPosition:'top center'}} />
            : <div className={styles.authorSigAvatar}>{initials(author)}</div>
          }
          <div className={styles.authorSigBody}>
            <div className={styles.authorSigLabel}>{isContributor ? (lang === 'en' ? 'About the author' : 'À propos') : (lang === 'en' ? 'Author' : 'Auteur')}</div>
            <div className={styles.authorSigName}>{author}</div>
            {authorRole && <div className={styles.authorSigRole}>{authorRole}</div>}
            {isContributor && authorBio && (
              <p className={styles.authorSigBio} dangerouslySetInnerHTML={{ __html: authorBio }} />
            )}
            {(() => {
              const link = authorLink(author)
              if (!link) return null
              const isWiki = link.type === 'wikipedia'
              const aria = isWiki ? `Page Wikipédia de ${author}` : `Site de ${author}`
              return (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={aria}
                  className={styles.authorSigLink}
                >
                  {isWiki ? <WikipediaIcon /> : <WebsiteIcon />}
                  <span>{isWiki ? 'Wikipédia' : 'Site personnel'}</span>
                </a>
              )
            })()}
          </div>
        </div>
      </div>

      </div>{/* articleMainCol */}

      {/* ── SIDEBAR DROITE — articles liés (desktop uniquement) ── */}
      {related.length > 0 && (
        <div className={`${styles.articleSidebar} no-print`}>
          <div className={styles.sidebarTitle}>À lire aussi</div>
          {related.map((a: any) => (
            <a key={a.slug} href={`/articles/${a.slug}`} className={styles.sidebarItem}>
              {a.image && <img src={a.image} alt={a.title.replace(/<[^>]+>/g, '')} className={styles.sidebarThumb} style={a.imagePosition ? { objectPosition: a.imagePosition } : undefined} />}
              <div>
                <div className={styles.sidebarCat}>{a.categoryLabel || a.category?.toUpperCase()}</div>
                <div className={styles.sidebarItemTitle}>{a.title.replace(/<[^>]+>/g, '')}</div>
              </div>
            </a>
          ))}
        </div>
      )}
      </div>{/* articlePageLayout */}

      {/* ── ARTICLES LIÉS (mobile uniquement) ── */}
      {related.length > 0 && (
        <div className={`${styles.related} no-print`}>
          <div className={styles.relatedHead}>
            <div className={styles.relatedLabel}>Lire aussi</div>
            <div className={styles.relatedLine} />
          </div>
          {category === 'portrait' ? (
            <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
              {related.map((a: any) => (
                <a key={a.slug} href={`/articles/${a.slug}`} style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 0',borderBottom:'1px solid #eee',textDecoration:'none',color:'inherit'}}>
                  {a.image && (
                    <div style={{width:'72px',height:'72px',flexShrink:0,borderRadius:'4px',overflow:'hidden',background:'#f5f5f5'}}>
                      <img src={a.image} alt={a.title.replace(/<[^>]+>/g,'')} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center top',display:'block'}} />
                    </div>
                  )}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#7B5380',marginBottom:'4px',fontFamily:"'DM Sans',sans-serif"}}>Portrait · {formatReadTime(a.readTime, 'short')}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:'15px',lineHeight:1.3,color:'#111',fontWeight:400}}>{a.title.replace(/<[^>]+>/g,'')}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
          <div className={styles.relatedGrid}>
            {related.map((a: any) => (
              <a key={a.slug} href={`/articles/${a.slug}`} className={styles.relatedCard}>
                {a.image && (
                  <div className={styles.relatedImgWrap}>
                    <img src={a.image} alt={a.title.replace(/<[^>]+>/g, '')} className={styles.relatedImg} style={a.imagePosition ? { objectPosition: a.imagePosition } : undefined} />
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
          )}
        </div>
      )}





      <div className={`${styles.actionBar} no-print`}>
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
        {slug && <BookmarkButton slug={slug} title={title} image={image} description={description} readTime={readTime} categoryLabel={categoryLabel} iconOnly />}
      </div>

      {/* ── BOOKMARK ── */}
      {slug && (
        <div className="no-print" style={{
          maxWidth: 760, margin: '0 auto', padding: '0 24px 32px',
          display: 'flex', justifyContent: 'center'
        }}>
          <BookmarkButton slug={slug} title={title} image={image} description={description} readTime={readTime} categoryLabel={categoryLabel} />
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      <div className={`${styles.newsletter} no-print`}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <div className={styles.newsletterLabel}>Soara · Newsletter</div>
            <div className={styles.newsletterTitle}>Recevoir les analyses chaque semaine</div>
            <p className={styles.newsletterDesc}>Les grands formats, le Signal, les portraits. Sans algorithme, sans bruit.</p>
          </div>
          <NewsletterForm ctaLabel="S'abonner" />
        </div>
      </div>

      <footer className={`${styles.footer} no-print`}>
        Soara &nbsp;·&nbsp; Média d'analyse indépendant &nbsp;·&nbsp; 2026
      </footer>

      <PrintFooter slug={slug} />
    </>
  )
}

function PrintFooter({ slug }: { slug?: string }) {
  const [meta, setMeta] = useState<{ url: string; date: string }>({ url: '', date: '' })
  useEffect(() => {
    const url = slug ? `soara.fr/articles/${slug}` : (typeof window !== 'undefined' ? window.location.host + window.location.pathname : '')
    const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    setMeta({ url, date })
  }, [slug])
  return (
    <div className="print-footer print-only">
      Article Soara · {meta.url} · imprimé le {meta.date}
    </div>
  )
}
