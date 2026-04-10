'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './app/page.module.css'

interface Article {
  slug: string
  title: string
  description?: string
  image?: string
  category: string
  readTime?: string
  author?: string
  grandFormatUrl?: string
}

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Concept', sciences: 'Sciences',
}

const categoryColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
  portrait: 'var(--portrait)', concept: 'var(--concept)', sciences: 'var(--sciences)',
}

export default function HeroSlider({ articles }: { articles: Article[] }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((index: number, dir: 'left' | 'right' = 'left') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => { setCurrent(index); setAnimating(false) }, 380)
  }, [animating])

  const pauseAndGo = useCallback((index: number, dir: 'left' | 'right') => {
    goTo(index, dir)
    setPaused(true)
    setTimeout(() => setPaused(false), 12000)
  }, [goTo])

  const goNext = useCallback(() => pauseAndGo((current + 1) % articles.length, 'left'), [current, articles.length, pauseAndGo])
  const goPrev = useCallback(() => pauseAndGo((current - 1 + articles.length) % articles.length, 'right'), [current, articles.length, pauseAndGo])

  useEffect(() => {
    if (articles.length <= 1 || paused) return
    const t = setInterval(() => goTo((current + 1) % articles.length, 'left'), 8000)
    return () => clearInterval(t)
  }, [current, articles.length, goTo, paused])

  if (!articles.length) return null
  const article = articles[current]
  const href = article.grandFormatUrl || `/articles/${article.slug}`

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        transition: 'opacity 0.38s ease, transform 0.38s ease',
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${direction === 'left' ? '-20px' : '20px'})` : 'translateX(0)',
      }}>
        <Link href={href} className={styles.uneHero}>
          {article.image && (
            <div className={styles.uneHeroImg}>
              <img src={article.image} alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
              <div className={styles.uneHeroOverlay} />
            </div>
          )}
          <div className={styles.uneHeroBody}>
            <span className={styles.uneHeroTag} style={{ background: categoryColors[article.category] }}>
              {categoryLabels[article.category] || article.category}
            </span>
            <h2 className={styles.uneHeroTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
            {article.description && <p className={styles.uneHeroDesc}>{article.description}</p>}
            <div className={styles.uneHeroMeta}>
              <span>{article.author || 'Steve Moradel'}</span>
              <span className={styles.uneHeroDot}>·</span>
              <span>{isNaN(parseInt(article.readTime || '')) ? article.readTime : `${article.readTime} min de lecture`}</span>
            </div>
          </div>
        </Link>
      </div>

      {articles.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 6px' }}>
          <button onClick={goPrev} aria-label="Précédent" style={{
            background: 'none', border: '1px solid #DDD9D2', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#6B6355', fontSize: '14px', flexShrink: 0,
          }}>←</button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {articles.map((_, i) => (
              <button key={i} onClick={() => pauseAndGo(i, i > current ? 'left' : 'right')}
                aria-label={`Article ${i + 1}`} style={{
                  width: i === current ? '28px' : '8px', height: '4px', borderRadius: '2px',
                  border: 'none', background: i === current ? 'var(--geo, #1A3E6B)' : '#DDD9D2',
                  cursor: 'pointer', padding: 0, transition: 'all 0.3s ease',
                }} />
            ))}
          </div>

          <button onClick={goNext} aria-label="Suivant" style={{
            background: 'none', border: '1px solid #DDD9D2', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#6B6355', fontSize: '14px', flexShrink: 0,
          }}>→</button>
        </div>
      )}
    </div>
  )
}
