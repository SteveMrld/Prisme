'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import styles from './explorer.module.css'

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Analyse', sciences: 'Sciences',
}

const categoryColors: Record<string, string> = {
  geo: '#C8621A', eco: '#1A6BC8', tech: '#8B1AC8',
  env: '#1A8B3A', soc: '#C8A91A', culture: '#C81A4A',
  portrait: '#C8A96E', concept: '#6E8BC8', sciences: '#1AC8C8',
}

export default function ExplorerClient({ articles }: { articles: any[] }) {
  const [current, setCurrent] = useState(0)
  const touchStartY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Formats spéciaux
  const specialFormats = [
    {
      slug: 'signal-map',
      title: 'Signal Map — <em>La carte des tensions</em>',
      description: 'Un globe interactif en temps réel. Les zones de tension, les routes maritimes, les arcs de connexion géopolitique.',
      category: 'visuel',
      image: 'https://res.cloudinary.com/dnbyi8fw6/image/fetch/f_auto,q_auto,w_1200/https://i.ibb.co/jvvQx1mw/img-arctique.jpg',
      customRoute: '/signal-map',
      readTime: 'Interactif',
    },
    {
      slug: 'inde-video',
      title: "L'Inde, <em>la puissance silencieuse</em>",
      description: "Un milliard et demi d'habitants, la plus grande démocratie du monde, une ambition géopolitique qui ne dit pas encore son nom.",
      category: 'tv',
      image: 'https://res.cloudinary.com/dnbyi8fw6/image/upload/f_auto,q_auto/prisme_inde_v10-3_a57ifu.jpg',
      customRoute: '/prismetv',
      readTime: 'Vidéo · 3 min',
    },
    {
      slug: 'grand-entretien',
      title: 'Grand Entretien — <em>Cheick Modibo Diarra</em>',
      description: 'Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali.',
      category: 'portrait',
      image: '/portraits/diarra.png',
      customRoute: '/entretien/diarra',
      readTime: 'À paraître',
    },
    {
      slug: 'solutions',
      title: 'Changer <em>le monde</em>',
      description: '157 solutions concrètes sélectionnées par ChangeNow 2026. Un globe, des données, des idées.',
      category: 'visuel',
      image: 'https://res.cloudinary.com/dnbyi8fw6/image/fetch/f_auto,q_auto,w_1200/https://i.ibb.co/nN5hN0sQ/img-empires.jpg',
      customRoute: '/solutions',
      readTime: 'Interactif',
    },
  ]

  const articlesFeatured = articles
    .filter((a: any) => a.image && a.image !== '')
    .slice(0, 10)

  const allItems = [...specialFormats, ...articlesFeatured]
  const featured = allItems

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) < 50) return
    if (diff > 0 && current < featured.length - 1) setCurrent(c => c + 1)
    if (diff < 0 && current > 0) setCurrent(c => c - 1)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && current < featured.length - 1) setCurrent(c => c + 1)
      if (e.key === 'ArrowUp' && current > 0) setCurrent(c => c - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [current, featured.length])

  const article = featured[current]
  const slug = article.customRoute || `/articles/${article.slug}`
  const catLabel = categoryLabels[article.category] || article.category
  const catColor = categoryColors[article.category] || '#C8A96E'

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carte principale */}
      <div className={styles.card}>
        {/* Image de fond */}
        <div className={styles.imgWrap}>
          <img src={article.image} alt={article.title} className={styles.img} />
          <div className={styles.overlay} />
        </div>

        {/* Contenu */}
        <div className={styles.content}>
          <span className={styles.cat} style={{ color: catColor }}>{catLabel}</span>
          <h2
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: article.title }}
          />
          {article.description && (
            <p className={styles.desc}>{article.description}</p>
          )}
          <Link href={slug} className={styles.cta}>
            Lire l'article →
          </Link>
        </div>

        {/* Indicateurs */}
        <div className={styles.dots}>
          {featured.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <button
            className={styles.navBtn}
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >↑</button>
          <span className={styles.counter}>{current + 1} / {featured.length}</span>
          <button
            className={styles.navBtn}
            onClick={() => setCurrent(c => Math.min(featured.length - 1, c + 1))}
            disabled={current === featured.length - 1}
          >↓</button>
        </div>
      </div>
    </div>
  )
}
