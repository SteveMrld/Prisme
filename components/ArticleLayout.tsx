import Header from './Header'
import styles from './ArticleLayout.module.css'
import { ReadingProgress, ReadingTimeCounter, ScrollDepth } from './ArticleAnimations'

interface ArticleLayoutProps {
  title: string
  description: string
  image: string
  category: string
  categoryLabel: string
  readTime: string
  hasInternalHeader?: boolean
  content: string
  author?: string
  authorRole?: string
}

const categoryColors: Record<string, string> = {
  geo: '#1A3E6B', eco: '#B86A1A', tech: '#4A2080',
  env: '#2D6B4A', soc: '#7A2D2D', culture: '#6B1A3A',
  portrait: '#C4A265', concept: '#1A1A3E', sciences: '#1A5C4A'
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
  readTime, hasInternalHeader = false, content,
  author = 'Steve Moradel',
  authorRole = 'Fondateur · Directeur de la rédaction'
}: ArticleLayoutProps) {
  const color = categoryColors[category] || '#0A0A0A'
  const minutes = parseInt(readTime) || 8

  return (
    <>
      <ReadingProgress />
      <ReadingTimeCounter totalMinutes={minutes} />
      <ScrollDepth />
      <Header activeNav={category} />

      {image && !hasInternalHeader && (
        <div className={styles.heroWrap}>
          <img
            src={image}
            alt={title}
            className={styles.heroImg}
            style={
              category === 'portrait'
                ? { height: '420px', objectPosition: 'center 15%' }
                : {}
            }
          />
        </div>
      )}

      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>{readTime} min de lecture</span>
            <span className={styles.readDate}>Mars 2026</span>
          </div>
          <div className={styles.titleRow}>
            <span className={styles.pBadgeArticle}>P</span>
            <span className={styles.audioBadgeArticle} title="Disponible en audio">🎧</span>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
          </div>

          {/* BYLINE HAUT */}
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

      <div className={hasInternalHeader ? styles.articleBodyFull : styles.articleBody}>
        <div className="prisme-article" dangerouslySetInnerHTML={{ __html: content }} />

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

      {/* ── PARTAGE ── */}
      <div className={styles.shareBar}>
        <span className={styles.shareLabel}>Partager cet article</span>
        <div className={styles.shareBtns}>
          <button className={styles.shareBtn} onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            const el = document.getElementById('share-copied')
            if (el) { el.style.opacity = '1'; setTimeout(() => el.style.opacity = '0', 2000) }
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Copier le lien
          </button>
          <a className={styles.shareBtn} href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=Lu sur Prisme`} target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X
          </a>
          <a className={styles.shareBtn} href={`https://wa.me/?text=${encodeURIComponent('Lu sur Prisme : ' + (typeof window !== 'undefined' ? window.location.href : ''))}`} target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.956.535 3.782 1.462 5.346L2 22l4.789-1.436A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 11.998 2z"/></svg>
            WhatsApp
          </a>
        </div>
        <span id="share-copied" className={styles.shareCopied} style={{opacity:0}}>✓ Lien copié</span>
      </div>

      {/* ── NEWSLETTER ── */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <div className={styles.newsletterLabel}>Prisme · Newsletter</div>
            <div className={styles.newsletterTitle}>Recevoir les analyses chaque semaine</div>
            <p className={styles.newsletterDesc}>Les grands formats, le Signal, les portraits. Sans algorithme, sans bruit.</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={e => { e.preventDefault(); window.location.href = '/abonnement'; }}>
            <input type="email" placeholder="votre@email.com" className={styles.newsletterInput} required />
            <button type="submit" className={styles.newsletterBtn}>S'abonner →</button>
          </form>
        </div>
      </div>

      <footer className={styles.footer}>
        Prisme &nbsp;·&nbsp; Média d'analyse indépendant &nbsp;·&nbsp; 2026
      </footer>
    </>
  )
}
