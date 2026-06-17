import Link from 'next/link'
import PictureImg from './PictureImg'
import type { Interview } from '../lib/interviews'
import styles from './HomeInterviewBanner.module.css'

/* Zone vedette entretiens : grands entretiens publiés uniquement (max 2).
   Statique, pas de rotation. Côte à côte sur desktop, empilés sur mobile.
   Hauteurs réservées via aspect-ratio sur les images pour empêcher tout
   reflow au chargement. */
export default function FeaturedInterviews({ items }: { items: Interview[] }) {
  if (items.length === 0) return null
  const safeItems = items.slice(0, 2)

  return (
    <div
      className={styles.featured}
      data-count={safeItems.length}
    >
      {safeItems.map(interview => {
        const subject = interview.interviewSubject
        const italic = interview.interviewSubjectItalic || ''
        const head = italic && subject.endsWith(italic)
          ? subject.slice(0, subject.length - italic.length).trim()
          : subject

        return (
          <Link
            key={interview.slug}
            href={`/entretien/${interview.slug}`}
            className={styles.root}
            data-interview-type={interview.interviewType}
          >
            <div className={styles.banner}>
              <span className={styles.bannerLabel}>Grand Entretien</span>
              <span className={styles.bannerDate}>N°&nbsp;{interview.interviewIssue}</span>
            </div>

            <div className={styles.img}>
              <PictureImg src={interview.image} alt={interview.interviewSubject} />
            </div>

            <div className={styles.body}>
              <h3 className={styles.name}>
                {italic ? (
                  <>{head} <em>{italic}</em></>
                ) : (
                  subject
                )}
              </h3>
              {interview.interviewRole && (
                <p className={styles.role}>{interview.interviewRole}</p>
              )}
              {interview.interviewQuote && (
                <blockquote className={styles.quote}>
                  «&nbsp;{interview.interviewQuote}&nbsp;»
                </blockquote>
              )}
              <span className={styles.cta}>Lire l'entretien →</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
