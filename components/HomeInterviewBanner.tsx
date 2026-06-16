import Link from 'next/link'
import PictureImg from './PictureImg'
import { getNextInterviewForHome, getAllInterviews } from '../lib/interviews'
import InterviewCarousel from './InterviewCarousel'
import styles from './HomeInterviewBanner.module.css'

function formatFrDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const day = d.getDate()
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const dayLabel = day === 1 ? '1er' : String(day)
  return `${dayLabel} ${month} ${year}`
}

export default function HomeInterviewBanner() {
  const interview = getNextInterviewForHome()
  if (!interview) return null

  const isComing = interview.interviewStatus === 'coming'
  const isGrand = interview.interviewType === 'grand'

  const cta = isComing ? 'Lire dès la parution →' : 'Lire l\'entretien →'
  const eyebrowRight = isComing
    ? formatFrDate(interview.date)
    : `N° ${interview.interviewIssue}`

  const subject = interview.interviewSubject
  const italic = interview.interviewSubjectItalic || ''
  const head = italic && subject.endsWith(italic)
    ? subject.slice(0, subject.length - italic.length).trim()
    : subject

  const others = getAllInterviews()
    .filter(o => o.slug !== interview.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12)

  return (
    <div className={styles.wrap}>
      <Link
        href={`/entretien/${interview.slug}`}
        className={styles.root}
        data-interview-type={interview.interviewType}
      >
        <div className={styles.banner}>
          <span className={styles.bannerLabel}>
            {isGrand ? 'Grand Entretien' : 'Interview'}
          </span>
          <span className={styles.bannerDate}>{eyebrowRight}</span>
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
          <span className={styles.cta}>{cta}</span>
        </div>
      </Link>

      {others.length > 0 && (
        <section className={styles.carousel} aria-label="Les entretiens Soara">
          <div className={styles.carouselTitle}>Les entretiens Soara</div>
          <InterviewCarousel items={others} />
        </section>
      )}
    </div>
  )
}
