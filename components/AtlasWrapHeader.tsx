import Link from 'next/link'
import styles from './AtlasWrapHeader.module.css'

interface Props {
  category: string
  title: string
  description?: string
}

export default function AtlasWrapHeader({ category, title, description }: Props) {
  return (
    <header className={styles.wrap}>
      <Link href="/visuels" className={styles.back}>← Atlas</Link>
      <div className={styles.eyebrow} aria-label="Fil d'Ariane">
        <span className={styles.eyebrowItem}>Atlas</span>
        <span className={styles.eyebrowSep}>·</span>
        <span className={styles.eyebrowItem}>{category}</span>
        <span className={styles.eyebrowSep}>·</span>
        <span className={styles.eyebrowCurrent}>{title}</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.desc}>{description}</p>}
    </header>
  )
}
