'use client'
import { useState, useEffect } from 'react'
import styles from './BookmarkButton.module.css'

export default function BookmarkButton({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('confins_bookmarks') || '[]')
      setSaved(bookmarks.some((b: any) => b.slug === slug))
    } catch {}
  }, [slug])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const bookmarks = JSON.parse(localStorage.getItem('confins_bookmarks') || '[]')
      let updated
      if (saved) {
        updated = bookmarks.filter((b: any) => b.slug !== slug)
      } else {
        updated = [...bookmarks, { slug, title, savedAt: new Date().toISOString() }]
      }
      localStorage.setItem('confins_bookmarks', JSON.stringify(updated))
      setSaved(!saved)
    } catch {}
  }

  return (
    <button
      className={`${styles.btn} ${saved ? styles.saved : ''}`}
      onClick={toggle}
      title={saved ? 'Retirer des lectures' : 'Sauvegarder'}
      aria-label={saved ? 'Retirer des lectures' : 'Sauvegarder'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      <span className={styles.label}>{saved ? 'Sauvegardé' : 'Sauvegarder'}</span>
    </button>
  )
}
