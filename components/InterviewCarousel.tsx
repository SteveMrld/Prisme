'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Interview } from '../lib/interviews'
import styles from './HomeInterviewBanner.module.css'

// Rangée défilante des entretiens. Sur mobile, swipe natif. Sur desktop, la
// scrollbar est masquée, donc on ajoute deux flèches discrètes et un fondu de
// bord qui n'apparaissent que quand il reste quelque chose à faire défiler.
export default function InterviewCarousel({ items }: { items: Interview[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scrollByDir = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div
      className={styles.carouselViewport}
      data-can-left={canLeft}
      data-can-right={canRight}
    >
      <button
        type="button"
        className={`${styles.carArrow} ${styles.carArrowLeft}`}
        aria-label="Entretiens précédents"
        onClick={() => scrollByDir(-1)}
      >
        ‹
      </button>

      <div className={styles.carouselTrack} ref={trackRef}>
        {items.map(o => {
          const kind = o.interviewType === 'grand' ? 'Grand Entretien' : 'Interview'
          return (
            <Link key={o.slug} href={`/entretien/${o.slug}`} className={styles.cardLink}>
              <article className={styles.card} data-interview-type={o.interviewType}>
                <div className={styles.cardImg}>
                  <img
                    src={o.image}
                    alt={o.interviewSubject}
                    style={o.cardFocus ? { objectPosition: o.cardFocus } : undefined}
                  />
                </div>
                <span className={styles.cardBadge}>{kind}</span>
                <div className={styles.cardText}>
                  <h4 className={styles.cardName}>{o.interviewSubject}</h4>
                  {o.interviewRole && (
                    <p className={styles.cardRole}>{o.interviewRole}</p>
                  )}
                </div>
              </article>
            </Link>
          )
        })}
      </div>

      <button
        type="button"
        className={`${styles.carArrow} ${styles.carArrowRight}`}
        aria-label="Entretiens suivants"
        onClick={() => scrollByDir(1)}
      >
        ›
      </button>
    </div>
  )
}
