'use client'
import { useEffect, useState } from 'react'
import styles from './ArticleTOC.module.css'

type Heading = { id: string; text: string }

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64) || 'section'
}

export default function ArticleTOC() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const article = document.querySelector('.grand-format-body .soara-article') as HTMLElement | null
    if (!article) return

    const h2s = Array.from(article.querySelectorAll('h2'))
    if (h2s.length < 2) return

    const usedIds = new Set<string>()
    const list: Heading[] = h2s.map(h2 => {
      const text = (h2.textContent || '').trim()
      const base = h2.id || slugify(text)
      let unique = base
      let i = 2
      while (usedIds.has(unique)) {
        unique = `${base}-${i++}`
      }
      usedIds.add(unique)
      h2.id = unique
      return { id: unique, text }
    })
    setHeadings(list)

    if (h2s[0]) setActiveId(h2s[0].id)

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-120px 0px -55% 0px',
        threshold: 0,
      }
    )
    h2s.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  if (headings.length < 2) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
    if (typeof window.history?.replaceState === 'function') {
      window.history.replaceState(null, '', `#${id}`)
    }
    setActiveId(id)
  }

  return (
    <nav className={styles.toc} aria-label="Table des matières">
      <div className={styles.label}>Sommaire</div>
      <ul className={styles.list}>
        {headings.map(h => (
          <li
            key={h.id}
            className={`${styles.item} ${activeId === h.id ? styles.itemActive : ''}`}
          >
            <a
              href={`#${h.id}`}
              onClick={e => handleClick(e, h.id)}
              className={styles.link}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
