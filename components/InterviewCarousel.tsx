'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Interview } from '../lib/interviews'
import { formatFrDate, isFutureDay } from '../lib/dates'
import styles from './HomeInterviewBanner.module.css'

// Rangée défilante des entretiens. Sur mobile, swipe natif. Sur desktop, la
// scrollbar est masquée, donc on ajoute deux flèches discrètes et un fondu de
// bord qui n'apparaissent que quand il reste quelque chose à faire défiler.
export default function InterviewCarousel({ items }: { items: Interview[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const touchStartX = useRef(0)
  const touchStartScroll = useRef(0)

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

  // Repli manuel : sur les navigateurs où le scroll tactile natif est avalé
  // (root overflow, etc.), on détecte le swipe et on défile par programme.
  // On ne le déclenche que si le scroll natif n'a pas bougé, pour ne pas
  // doubler le geste là où il fonctionne déjà.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartScroll.current = trackRef.current?.scrollLeft ?? 0
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const el = trackRef.current
    if (!el) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const movedNatively = Math.abs(el.scrollLeft - touchStartScroll.current) > 8
    if (!movedNatively && Math.abs(dx) > 40) {
      scrollByDir(dx > 0 ? 1 : -1)
    }
  }

  return (
    <div
      className={styles.carouselViewport}
      data-can-left={canLeft}
      data-can-right={canRight}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
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
          const dateFuture = isFutureDay(o.date)
          const isComing = o.interviewStatus === 'coming' || dateFuture
          // Libellé concis pour tenir dans le coin bas-droit de la carte
          // sans empiéter sur le nom : « Le 29 juin 2026 » plutôt que
          // « Disponible le 29 juin 2026 ». « À venir » inchangé.
          const comingLabel = dateFuture ? `Le ${formatFrDate(o.date)}` : 'À venir'
          return (
            <Link key={o.slug} href={`/entretien/${o.slug}`} className={styles.cardLink}>
              <article
                className={styles.card}
                data-interview-type={o.interviewType}
                data-coming={isComing ? 'true' : undefined}
              >
                <div className={styles.cardImg}>
                  <img
                    src={o.image}
                    alt={o.interviewSubject}
                    style={o.cardFocus ? { objectPosition: o.cardFocus } : undefined}
                  />
                </div>
                <span className={styles.cardBadge}>{kind}</span>
                <div className={styles.cardText}>
                  {isComing && (
                    <span className={styles.cardComing}>{comingLabel}</span>
                  )}
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
