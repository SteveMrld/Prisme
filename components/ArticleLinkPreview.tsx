'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import articlesData from '../lib/articles.json'
import visuelsData, { type Visuel } from '../lib/visuels'
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

type Preview = {
  title: string
  image?: string
  eyebrow?: string
  meta?: string
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

const visuelsByHref: Record<string, Visuel> = {}
visuelsData.forEach(v => { visuelsByHref[v.href] = v })

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

function articleToPreview(a: Article): Preview {
  const eyebrow = a.categoryLabel || (a.category ? CATEGORY_FALLBACK[a.category] || a.category : '')
  return {
    title: a.title,
    image: a.image,
    eyebrow,
    meta: [formatReadTime(a.readTime), formatDateFR(a.date)].filter(Boolean).join(' · '),
  }
}

function visuelToPreview(v: Visuel): Preview {
  return {
    title: v.title,
    image: v.image,
    eyebrow: v.eyebrow,
    meta: v.format,
  }
}

function getPreviewFromHref(href: string): Preview | null {
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
  path = path.split(/[?#]/)[0].replace(/\/$/, '')

  if (path.startsWith('/visuels/')) {
    const v = visuelsByHref[path]
    return v ? visuelToPreview(v) : null
  }
  if (path.startsWith('/articles/')) {
    const slug = path.slice(10)
    const a = articlesBySlug[slug]
    if (a) return articleToPreview(a)
    const v = visuelsByHref[path]
    return v ? visuelToPreview(v) : null
  }
  if (path.startsWith('/grands-formats/')) {
    const a = articlesByGfUrl[path] || articlesBySlug[path.slice(16)]
    if (a) return articleToPreview(a)
    const v = visuelsByHref[path]
    return v ? visuelToPreview(v) : null
  }
  return null
}

type State = {
  preview: Preview
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
      const preview = getPreviewFromHref(href)
      if (!preview) return

      if (currentTargetRef.current === target) return
      currentTargetRef.current = target as HTMLAnchorElement
      clearTimer()

      timerRef.current = window.setTimeout(() => {
        const rect = (target as HTMLAnchorElement).getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const above = spaceBelow < TOOLTIP_APPROX_HEIGHT + GAP + 16
        const x = rect.left + rect.width / 2 + window.scrollX
        const y = above ? rect.top + window.scrollY : rect.bottom + window.scrollY
        setState({ preview, x, y, above })
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

  const p = state.preview

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
      {p.image && (
        <div className={styles.image}>
          <img src={p.image} alt="" loading="lazy" />
        </div>
      )}
      <div className={styles.body}>
        {p.eyebrow && <div className={styles.eyebrow}>{p.eyebrow}</div>}
        <div className={styles.title}>{p.title}</div>
        {p.meta && <div className={styles.meta}>{p.meta}</div>}
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
