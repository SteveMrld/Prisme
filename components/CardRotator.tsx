'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CardRotator.module.css'

interface Article {
  slug: string
  title: string
  image?: string
  catLabel: string
  grandFormatUrl?: string
  readTime?: string
}

export default function CardRotator({ articles }: { articles: Article[] }) {
  const [cur, setCur] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = (idx: number) => {
    if (idx === cur) return
    setFading(true)
    setTimeout(() => { setCur(idx); setFading(false) }, 300)
  }
  const next = () => goTo((cur + 1) % articles.length)
  const prev = () => goTo((cur - 1 + articles.length) % articles.length)

  useEffect(() => {
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [cur])

  const a = articles[cur]
  const href = a.grandFormatUrl || `/articles/${a.slug}`

  return (
    <div className={styles.wrap}>
      <Link href={href} className={`${styles.content} ${fading ? styles.fading : ''}`}>
        {a.image && (
          <div className={styles.imgWrap}>
            <img src={a.image} alt={a.title.replace(/<[^>]+>/g, '')} />
          </div>
        )}
        <div className={styles.body}>
          <span className={styles.cat}>{a.catLabel}</span>
          <h3 className={styles.title} dangerouslySetInnerHTML={{__html: a.title}} />
          {a.readTime && <span className={styles.time}>{isNaN(parseInt(a.readTime)) ? a.readTime : `${a.readTime} min`}</span>}
        </div>
      </Link>

      <div className={styles.nav}>
        <button className={styles.arrow} onClick={prev} aria-label="Précédent">‹</button>
        <div className={styles.dots}>
          {articles.map((_, i) => (
            <button key={i} className={`${styles.dot} ${i === cur ? styles.dotActive : ''}`}
              onClick={() => goTo(i)} aria-label={`Article ${i+1}`} />
          ))}
        </div>
        <button className={styles.arrow} onClick={next} aria-label="Suivant">›</button>
      </div>
    </div>
  )
}
