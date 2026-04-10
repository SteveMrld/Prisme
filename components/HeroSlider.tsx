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

interface HeroSliderProps {
  articles: Article[]
}

export default function HeroSlider({ articles }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('left')

  const goTo = useCallback((index: number, dir: 'left' | 'right' = 'left') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 400)
  }, [animating])

  useEffect(() => {
    if (articles.length <= 1) return
    const interval = setInterval(() => {
      goTo((current + 1) % articles.length, 'left')
    }, 5000)
    return () => clearInterval(interval)
  }, [current, articles.length, goTo])

  if (!articles.length) return null

  const article = articles[current]
  const href = article.grandFormatUrl || `/articles/${article.slug}`

  return (
    <div style={{ position: 'relative' }}>
      {/* HERO */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 0.4s ease',
        opacity: animating ? 0 : 1,
        transform: animating
          ? `translateX(${direction === 'left' ? '-24px' : '24px'})`
          : 'translateX(0)',
      }}>
        <Link href={href} className={styles.uneHero}>
          {article.image && (
            <div className={styles.uneHeroImg}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
              />
              <div className={styles.uneHeroOverlay} />
            </div>
          )}
          <div className={styles.uneHeroBody}>
            <span className={styles.uneHeroTag} style={{ background: categoryColors[article.category] }}>
              {categoryLabels[article.category] || article.category}
            </span>
            <h2 className={styles.uneHeroTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
            {article.description && (
              <p className={styles.uneHeroDesc}>{article.description}</p>
            )}
            <div className={styles.uneHeroMeta}>
              <span>{article.author || 'Steve Moradel'}</span>
              <span className={styles.uneHeroDot}>·</span>
              <span>{isNaN(parseInt(article.readTime || '')) ? article.readTime : `${article.readTime} min de lecture`}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* INDICATEURS */}
      {articles.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          padding: '16px 0 8px',
        }}>
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'left' : 'right')}
              aria-label={`Article ${i + 1}`}
              style={{
                width: i === current ? '28px' : '8px',
                height: '4px',
                borderRadius: '2px',
                border: 'none',
                background: i === current ? 'var(--geo, #1A3E6B)' : '#DDD9D2',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
