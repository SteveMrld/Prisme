'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './GrandFormatsCarousel.module.css'

export type CarouselGrandFormat = {
  slug: string
  title: string
  category: string
  categoryLabel: string
  image: string
  href: string
  isComing: boolean
  comingLabel: string
}

/* Carrousel grands formats : mêmes mécaniques que InterviewCarousel
   (swipe natif + flèches desktop + fondus de bord + repli tactile +
   snap proximity). Style de carte différent (paysage 3:2, titre serif),
   et état teaser pour les grands formats à paraître. */
export default function GrandFormatsCarousel({ items }: { items: CarouselGrandFormat[] }) {
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
      className={styles.viewport}
      data-can-left={canLeft}
      data-can-right={canRight}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Grands formats précédents"
        onClick={() => scrollByDir(-1)}
      >
        ‹
      </button>

      <div className={styles.track} ref={trackRef}>
        {items.map(gf => (
          <Link key={gf.slug} href={gf.href} className={styles.cardLink}>
            <article className={styles.card} data-cat={gf.category} data-coming={gf.isComing ? 'true' : undefined}>
              <div className={styles.img}>
                <img src={gf.image} alt={gf.title.replace(/<[^>]+>/g, '')} loading="lazy" />
              </div>
              <div className={styles.body}>
                <span className={styles.cat}>{gf.categoryLabel}</span>
                <h4 className={styles.title} dangerouslySetInnerHTML={{ __html: gf.title }} />
                {gf.isComing && (
                  <span className={styles.coming}>Disponible le {gf.comingLabel}</span>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        aria-label="Grands formats suivants"
        onClick={() => scrollByDir(1)}
      >
        ›
      </button>
    </div>
  )
}
