'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import articlesData from '../lib/articles.json'
import styles from './ArticleLinkPreview.module.css'

type Article = {
  slug: string
  title: string
  description?: string
  image?: string
  category?: string
  categoryLabel?: string
  readTime?: string
  date?: string
  grandFormatUrl?: string
}

const HOVER_DELAY = 400
const GAP = 12
const TOOLTIP_WIDTH = 280
const TOOLTIP_APPROX_HEIGHT = 280

const CATEGORY_FALLBACK: Record<string, string> = {
  geo: 'Géopolitique',
  eco: 'Économie',
  tech: 'Tech',
  env: 'Environnement',
  soc: 'Société',
  sciences: 'Sciences',
  culture: 'Culture',
  portrait: 'Portraits',
  portraits: 'Portraits',
  concept: 'Concept',
  indicateurs: 'Indicateurs',
}

const articlesBySlug: Record<string, Article> = {}
const articlesByGfUrl: Record<string, Article> = {}
;(articlesData as Article[]).forEach(a => {
  if (a.slug) articlesBySlug[a.slug] = a
  if (a.grandFormatUrl) articlesByGfUrl[a.grandFormatUrl] = a
})

function getArticleFromHref(href: string): Article | null {
  if (!href) return null
  let path = href
  if (path.startsWith('http')) {
    try {
      const u = new URL(path)
      if (u.host !== window.location.host) return null
      path = u.pathname
    } catch {
      return null
    }
  }
  path = path.split(/[?#]/)[0]

  if (path.startsWith('/articles/')) {
    const slug = path.slice(10).replace(/\/$/, '')
    return articlesBySlug[slug] || null
  }
  if (path.startsWith('/grands-formats/')) {
    const clean = path.replace(/\/$/, '')
    if (articlesByGfUrl[clean]) return articlesByGfUrl[clean]
    const slug = clean.slice(16)
    return articlesBySlug[slug] || null
  }
  return null
}

function formatDateFR(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatReadTime(rt?: string): string {
  if (!rt) return ''
  if (/^\d+$/.test(rt)) return `${rt} min`
  return rt
}

type State = {
  article: Article
  x: number
  y: number
  above: boolean
}

export default function ArticleLinkPreview() {
  const [state, setState] = useState<State | null>(null)
  const timerRef = useRef<number | null>(null)
  const currentTargetRef = useRef<HTMLAnchorElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return

    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href) return
      const article = getArticleFromHref(href)
      if (!article) return

      if (currentTargetRef.current === target) return
      currentTargetRef.current = target as HTMLAnchorElement
      clearTimer()

      timerRef.current = window.setTimeout(() => {
        const rect = (target as HTMLAnchorElement).getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const above = spaceBelow < TOOLTIP_APPROX_HEIGHT + GAP + 16
        const x = rect.left + rect.width / 2 + window.scrollX
        const y = above ? rect.top + window.scrollY : rect.bottom + window.scrollY
        setState({ article, x, y, above })
      }, HOVER_DELAY)
    }

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a')
      if (!target) return
      if (currentTargetRef.current === target) {
        currentTargetRef.current = null
        clearTimer()
        setState(null)
      }
    }

    const handleScroll = () => {
      if (currentTargetRef.current || state) {
        currentTargetRef.current = null
        clearTimer()
        setState(null)
      }
    }

    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      window.removeEventListener('scroll', handleScroll)
      clearTimer()
    }
  }, [])

  if (!mounted || !state) return null

  const a = state.article
  const eyebrow = a.categoryLabel || (a.category ? CATEGORY_FALLBACK[a.category] || a.category : '')

  const node = (
    <div
      className={`${styles.tooltip} ${state.above ? styles.above : styles.below}`}
      style={{
        left: `${state.x}px`,
        top: `${state.y}px`,
        width: `${TOOLTIP_WIDTH}px`,
      }}
      role="tooltip"
      aria-hidden="true"
    >
      {a.image && (
        <div className={styles.image}>
          <img src={a.image} alt="" loading="lazy" />
        </div>
      )}
      <div className={styles.body}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <div className={styles.title}>{a.title}</div>
        <div className={styles.meta}>
          {[formatReadTime(a.readTime), formatDateFR(a.date)].filter(Boolean).join(' · ')}
        </div>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
