'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import EauVizClient from './EauVizClient'
import styles from './EauScrollytellingLayout.module.css'

export default function EauScrollytellingWrapper({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0)
  const narrativeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!narrativeRef.current) return
    const sections = Array.from(
      narrativeRef.current.querySelectorAll<HTMLElement>('[data-chapter-idx]'),
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-chapter-idx'))
            if (!Number.isNaN(idx)) setActive(idx)
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.scrollytelling}>
      <div ref={narrativeRef} className={styles.narrativeCol}>
        {children}
      </div>
      <aside className={styles.mapCol}>
        <div className={styles.mapSticky}>
          <EauVizClient activeChapter={active} />
        </div>
      </aside>
    </div>
  )
}
