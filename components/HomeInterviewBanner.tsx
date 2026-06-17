import { getNextInterviewForHome, getAllInterviews, type Interview } from '../lib/interviews'
import FeaturedInterviewRotator from './FeaturedInterviewRotator'
import InterviewCarousel from './InterviewCarousel'
import styles from './HomeInterviewBanner.module.css'

export default function HomeInterviewBanner() {
  const pinned = getNextInterviewForHome()
  if (!pinned) return null

  const publishedRecent = getAllInterviews()
    .filter(i => i.interviewStatus === 'published' && i.slug !== pinned.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  const rotationRaw: Interview[] = [pinned, ...publishedRecent]
  const seen = new Set<string>()
  const rotation: Interview[] = []
  for (const it of rotationRaw) {
    if (seen.has(it.slug)) continue
    seen.add(it.slug)
    rotation.push(it)
    if (rotation.length >= 3) break
  }

  const rotationSlugs = new Set(rotation.map(i => i.slug))
  const others = getAllInterviews()
    .filter(o => !rotationSlugs.has(o.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12)

  return (
    <div className={styles.wrap}>
      <FeaturedInterviewRotator items={rotation} />

      {others.length > 0 && (
        <section className={styles.carousel} aria-label="Les entretiens Soara">
          <div className={styles.carouselTitle}>Les entretiens Soara</div>
          <InterviewCarousel items={others} />
        </section>
      )}
    </div>
  )
}
