import { getAllInterviews, type Interview } from '../lib/interviews'
import { isFutureDay } from '../lib/dates'
import FeaturedInterviews from './FeaturedInterviews'
import InterviewCarousel from './InterviewCarousel'
import styles from './HomeInterviewBanner.module.css'

/* Section entretiens de la home.
   Zone vedette = grands entretiens publiés, plafonnée à 2, triés du plus
   récent au plus ancien. Auto-pilotée par la date : un grand entretien
   à venir reste en teaser dans la rangée jusqu'à sa date, puis monte
   automatiquement en zone vedette une fois publié.
   Rangée = tout le reste (interviews classiques, grands entretiens à
   venir, etc.), triés du plus récent au plus ancien. */
export default function HomeInterviewBanner() {
  const all = getAllInterviews()

  const isPublishedGrand = (i: Interview) =>
    i.interviewType === 'grand'
    && i.interviewStatus === 'published'
    && !isFutureDay(i.date)

  const featured = all
    .filter(isPublishedGrand)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  const featuredSlugs = new Set(featured.map(i => i.slug))
  const others = all
    .filter(i => !featuredSlugs.has(i.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12)

  if (featured.length === 0 && others.length === 0) return null

  return (
    <div className={styles.wrap}>
      <FeaturedInterviews items={featured} />

      {others.length > 0 && (
        <section className={styles.carousel} aria-label="Les entretiens Soara">
          <div className={styles.carouselTitle}>Les entretiens Soara</div>
          <InterviewCarousel items={others} />
        </section>
      )}
    </div>
  )
}
