import { getHomeInterviewsPartition } from '../lib/interviews'
import InterviewCarousel from './InterviewCarousel'
import styles from './HomeInterviewsRow.module.css'

/* Rangée « Les entretiens Soara », hors zone vedette. Présentation centrée :
   intitulé + intro au-dessus, cartes des entretiens dessous. */
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
      </div>
    </section>
  )
}
