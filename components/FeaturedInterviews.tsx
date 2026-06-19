import Link from 'next/link'
import PictureImg from './PictureImg'
import type { Interview } from '../lib/interviews'
import { isFutureDay, formatFrDate } from '../lib/dates'
import styles from './HomeInterviewBanner.module.css'

/* Zone vedette entretiens : grands entretiens, max 2. Un entretien
   marqué featuredOnHome peut être épinglé même à venir, et reçoit
   alors un badge « Disponible le X » ; sa carte mène au teaser sans
   exposer les questions. Statique, pas de rotation. Côte à côte sur
   desktop, empilés sur mobile. */
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
        const dateFuture = isFutureDay(interview.date)
        const isComing = interview.interviewStatus === 'coming' || dateFuture
        const comingLabel = dateFuture
          ? `Disponible le ${formatFrDate(interview.date)}`
          : 'À venir'

        return (
          <Link
            key={interview.slug}
            href={`/entretien/${interview.slug}`}
            className={styles.root}
            data-interview-type={interview.interviewType}
            data-coming={isComing ? 'true' : undefined}
          >
            <div className={styles.banner}>
              <span className={styles.bannerLabel}>Grand Entretien</span>
              <span className={styles.bannerDate}>N°&nbsp;{interview.interviewIssue}</span>
            </div>

            <div className={styles.img}>
              <PictureImg src={interview.image} alt={interview.interviewSubject} />
              {isComing && (
                <span className={styles.featuredComing}>{comingLabel}</span>
              )}
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
              <span className={styles.cta}>
                {isComing ? 'Découvrir le teaser →' : "Lire l'entretien →"}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
