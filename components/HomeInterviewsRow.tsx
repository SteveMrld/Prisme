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
      <div className={styles.head}>
        <span className={styles.eyebrow}>Les entretiens Soara</span>
      </div>
      <InterviewCarousel items={others} />
    </section>
  )
}
