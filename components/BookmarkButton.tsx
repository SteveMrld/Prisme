'use client'
import { useState, useEffect } from 'react'
import styles from './BookmarkButton.module.css'

export default function BookmarkButton({ slug, title, iconOnly }: { slug: string; title: string; iconOnly?: boolean }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('soara_bookmarks') || '[]')
      setSaved(bookmarks.some((b: any) => b.slug === slug))
    } catch {}
  }, [slug])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const bookmarks = JSON.parse(localStorage.getItem('soara_bookmarks') || '[]')
      let updated
      if (saved) {
        updated = bookmarks.filter((b: any) => b.slug !== slug)
      } else {
        updated = [...bookmarks, { slug, title, savedAt: Date.now(), image: (document.querySelector('meta[property="og:image"]') as HTMLMetaElement)?.content || '', description: (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || '', categoryLabel: (document.querySelector('[data-category-label]') as HTMLElement)?.dataset.categoryLabel || '', readTime: (document.querySelector('[data-read-time]') as HTMLElement)?.dataset.readTime || '' }]
      }
      localStorage.setItem('soara_bookmarks', JSON.stringify(updated))
      setSaved(!saved)
    } catch {}
  }

  return (
    <button
      className={iconOnly ? `${styles.actionBtn} ${saved ? styles.actionSaved : ''}` : `${styles.btn} ${saved ? styles.saved : ''}`}
      onClick={toggle}
      title={saved ? 'Retirer des lectures' : 'Sauvegarder'}
      aria-label={saved ? 'Retirer des lectures' : 'Sauvegarder'}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      {!iconOnly && <span className={styles.label}>{saved ? 'Sauvegardé' : 'Sauvegarder'}</span>}
    </button>
  )
}
