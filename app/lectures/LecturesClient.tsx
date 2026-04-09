'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './lectures.module.css'
import articlesData from '../../lib/articles.json'

type Bookmark = { slug: string; title: string; savedAt: string }

export default function LecturesClient() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('soara_bookmarks') || '[]')
      setBookmarks(saved.sort((a: Bookmark, b: Bookmark) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()))
    } catch {}
  }, [])

  const remove = (slug: string) => {
    const updated = bookmarks.filter(b => b.slug !== slug)
    setBookmarks(updated)
    localStorage.setItem('soara_bookmarks', JSON.stringify(updated))
  }

  const getArticle = (slug: string) => (articlesData as any[]).find(a => a.slug === slug)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>Soara · Personnel</div>
        <h1 className={styles.title}>Mes <em>lectures</em></h1>
        <p className={styles.count}>{bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} sauvegardé{bookmarks.length !== 1 ? 's' : ''}</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p className={styles.emptyText}>Aucun article sauvegardé pour l'instant.</p>
          <Link href="/" className={styles.emptyLink}>Explorer Soara →</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {bookmarks.map(b => {
            const article = getArticle(b.slug)
            if (!article) return null
            return (
              <div key={b.slug} className={styles.item}>
                {article.image && <img src={article.image} alt={article.title} className={styles.thumb} />}
                <div className={styles.body}>
                  <div className={styles.cat}>{article.categoryLabel}</div>
                  <Link href={`/articles/${b.slug}`} className={styles.itemTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
                  <div className={styles.itemMeta}>
                    {article.author && <span>{article.author}</span>}
                    <span>·</span>
                    <span>{article.readTime} min</span>
                    <span>·</span>
                    <span>Sauvegardé le {new Date(b.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => remove(b.slug)} title="Retirer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
