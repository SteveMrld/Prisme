'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PictureImg from './PictureImg'
import styles from './HeroInline.module.css'
import { formatReadTime, stripHtml } from '../lib/format'

interface HeroArticle {
  slug: string
  title: string
  description?: string
  image?: string
  catLabel: string
  catColor?: string
  grandFormatUrl?: string
  premium?: boolean
  readTime?: string
}

interface Props {
  articles: HeroArticle[]
  intervalMs?: number
}

export default function HeroInline({ articles, intervalMs = 7000 }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (articles.length <= 1) return
    const t = setInterval(() => {
      setCurrent(c => (c + 1) % articles.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [articles.length, intervalMs])

  const a = articles[current]
  if (!a) return null
  const href = a.grandFormatUrl || `/articles/${a.slug}`

  return (
    <article className={styles.wrap}>
      <Link href={href} className={styles.link}>
        <div className={styles.imgWrap}>
          {articles.map((art, i) => (
            <div
              key={art.slug}
              className={`${styles.imgSlide} ${i === current ? styles.active : ''}`}
            >
              {art.image && <PictureImg src={art.image} alt={stripHtml(art.title)} className={styles.img} />}
            </div>
          ))}
        </div>
        <div className={styles.body}>
          <span className={styles.cat}>{a.catLabel}</span>
          <h2
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: a.title }}
          />
          {a.description && <p className={styles.desc}>{a.description}</p>}
          {a.readTime && <span className={styles.meta}>{formatReadTime(a.readTime, 'long')}</span>}
        </div>
      </Link>
      {articles.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Articles à la une">
          {articles.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Article ${i + 1}`}
              aria-selected={i === current}
              role="tab"
            />
          ))}
        </div>
      )}
    </article>
  )
}
