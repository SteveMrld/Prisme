import Link from 'next/link'
import { getHomeInterviewsPartition } from '../lib/interviews'
import InterviewCarousel from './InterviewCarousel'
import styles from './HomeInterviewsRow.module.css'

/* Rangée pleine largeur « Les entretiens Soara », à placer hors de
   .homeTop (à côté de .lettreMardi / .atlasSection). Liste tous les
   entretiens hors zone vedette : interviews classiques publiées,
   grands entretiens à venir en cartes teaser. */
export default function HomeInterviewsRow() {
  const { others } = getHomeInterviewsPartition()
  if (others.length === 0) return null
  return (
    <section className={styles.section} aria-label="Les entretiens Soara">
      <div className={styles.grid}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Les entretiens Soara</span>
          <h2 className={styles.title}>Conversations au long cours</h2>
          <p className={styles.lede}>Des grands entretiens avec celles et ceux qui pensent le monde, à distance de l'actualité immédiate.</p>
        </div>
        <div className={styles.carouselWrap}>
          <InterviewCarousel items={others} />
        </div>
        <Link href="/explorer" className={styles.cta}>
          <span className={styles.ctaText}>Tous les entretiens</span>
          <span className={styles.ctaArrow} aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
