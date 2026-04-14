'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './HeroRotator.module.css'

interface HeroArticle {
  slug: string
  title: string
  description?: string
  image?: string
  catLabel: string
  catColor: string
  grandFormatUrl?: string
  premium?: boolean
}

interface Props {
  articles: HeroArticle[]
  intervalMs?: number
}

export default function HeroRotator({ articles, intervalMs = 4500 }: Props) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)

  const goTo = (idx: number) => {
    if (idx === current || animating) return
    setAnimating(true)
    setPrev(current)
    setCurrent(idx)
    setTimeout(() => { setPrev(null); setAnimating(false) }, 600)
  }

  useEffect(() => {
    const t = setInterval(() => {
      goTo((current + 1) % articles.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [current, animating])

  const a = articles[current]
  const href = a.grandFormatUrl || `/articles/${a.slug}`

  return (
    <div className={styles.wrap}>
      {/* Images en couches — fade entre elles */}
      <div className={styles.imgLayer}>
        {articles.map((art, i) => (
          <div
            key={art.slug}
            className={`${styles.imgSlide} ${i === current ? styles.active : ''}`}
          >
            {art.image && (
              <img src={art.image} alt={art.title} className={styles.img} />
            )}
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      {/* Contenu */}
      <Link href={href} className={styles.content}>
        <span className={styles.cat} style={{ color: a.catColor }}>{a.catLabel}</span>
        <h2
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: a.title }}
        />
        {a.description && <p className={styles.desc}>{a.description}</p>}
        {a.premium && <span className={styles.premium}>★ Premium</span>}
      </Link>

      {/* Points de navigation */}
      <div className={styles.dots}>
        {articles.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Article ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
