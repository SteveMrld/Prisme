'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import PictureImg from './PictureImg'
import type { Interview } from '../lib/interviews'
import { formatFrDate, isFutureDay } from '../lib/dates'
import styles from './HomeInterviewBanner.module.css'

const ROTATION_MS = 7000

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function FeaturedInterviewRotator({ items }: { items: Interview[] }) {
  const safeItems = items.slice(0, 3)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (safeItems.length <= 1) return
    if (reduced) return
    if (paused) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIndex(i => (i + 1) % safeItems.length)
    }, ROTATION_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [index, paused, reduced, safeItems.length])

  if (safeItems.length === 0) return null

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIndex(i)
  }

  return (
    <div
      className={styles.rotator}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={styles.rotatorViewport}>
        {safeItems.map((interview, i) => {
          const isComing = interview.interviewStatus === 'coming' || isFutureDay(interview.date)
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
          const isActive = i === index

          return (
            <Link
              key={interview.slug}
              href={`/entretien/${interview.slug}`}
              className={styles.root}
              data-interview-type={interview.interviewType}
              data-active={isActive}
              aria-hidden={isActive ? undefined : true}
              tabIndex={isActive ? 0 : -1}
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
          )
        })}
      </div>

      {safeItems.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Entretiens phares">
          {safeItems.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              aria-label={`Voir ${it.interviewSubject}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
