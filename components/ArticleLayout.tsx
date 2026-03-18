import Header from './Header'
import styles from './ArticleLayout.module.css'

interface ArticleLayoutProps {
  title: string
  description: string
  image: string
  category: string
  categoryLabel: string
  readTime: string
  hasInternalHeader?: boolean
  content: string
}

const categoryColors: Record<string, string> = {
  geo: '#1A3E6B', eco: '#B86A1A', tech: '#4A2080',
  env: '#2D6B4A', soc: '#7A2D2D', culture: '#6B1A3A',
  portrait: '#C4A265', concept: '#1A1A3E'
}

export default function ArticleLayout({
  title, description, image, category, categoryLabel,
  readTime, hasInternalHeader = false, content
}: ArticleLayoutProps) {
  const color = categoryColors[category] || '#0A0A0A'

  return (
    <>
      <Header activeNav={category} />

      {image && !hasInternalHeader && (
        <div className={styles.heroWrap}>
          <img src={image} alt={title} className={styles.heroImg} />
        </div>
      )}

      {!hasInternalHeader && (
        <div className={styles.articleHeader} style={{ borderLeftColor: color }}>
          <div className={styles.eyebrow}>
            <span className={styles.tag} style={{ background: color }}>{categoryLabel}</span>
            <span className={styles.readTime}>{readTime} min</span>
          </div>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
          <p className={styles.description}>{description}</p>
        </div>
      )}

      <div className={hasInternalHeader ? styles.articleBodyFull : styles.articleBody}>
        <div className="prisme-article" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <footer className={styles.footer}>
        Prisme &nbsp;·&nbsp; Média d'analyse indépendant &nbsp;·&nbsp; 2026
      </footer>
    </>
  )
}
