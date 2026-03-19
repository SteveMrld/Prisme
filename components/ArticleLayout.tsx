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
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />

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

      <footer className={styles.footer}>
        Prisme &nbsp;·&nbsp; Média d'analyse indépendant &nbsp;·&nbsp; 2026
      </footer>
    </>
  )
}
