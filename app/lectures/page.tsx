'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import articlesData from '../../lib/articles.json'
import Header from '../../components/Header'
import BottomNav from '../../components/BottomNav'

interface SavedArticle {
  slug: string
  title: string
  description: string
  category: string
  categoryLabel: string
  image: string
  readTime: string
  savedAt: number
}

export default function LecturesPage() {
  const [articles, setArticles] = useState<SavedArticle[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('soara_bookmarks') || '[]')
    const enriched = saved.map((item: any) => {
      const found = (articlesData as any[]).find(a => a.slug === item.slug)
      return {
        ...item,
        image: item.image || found?.image || '',
        description: item.description || found?.description || '',
        readTime: item.readTime || found?.readTime || '',
        categoryLabel: item.categoryLabel || found?.categoryLabel || '',
      }
    })
    setArticles(enriched.sort((a: SavedArticle, b: SavedArticle) => b.savedAt - a.savedAt))
    setLoaded(true)
  }, [])

  const remove = (slug: string) => {
    const updated = articles.filter(a => a.slug !== slug)
    setArticles(updated)
    localStorage.setItem('soara_bookmarks', JSON.stringify(updated))
  }

  const clear = () => {
    setArticles([])
    localStorage.removeItem('soara_bookmarks')
  }

  return (
    <>
      <Header activeNav="" />
      <main style={{ minHeight: '100vh', background: '#faf8f5', paddingBottom: 100 }}>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 20px 0' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: '#C8A96E', marginBottom: 12 }}>
            Vos lectures sauvegardées
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, borderBottom: '2px solid #1a1a1a', paddingBottom: 16 }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 700, color: '#0a0908', lineHeight: 1.1 }}>
              Vos lectures
            </h1>
            {articles.length > 0 && (
              <button onClick={clear} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: '#9a9590', background: 'none', border: 'none', cursor: 'pointer' }}>
                Tout effacer
              </button>
            )}
          </div>

          {!loaded ? null : articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c8c4be" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontStyle: 'italic', color: '#9a9590' }}>
                Aucun article sauvegardé.<br />Appuyez sur le signet sur chaque article pour le retrouver ici.
              </p>
            </div>
          ) : (
            <div>
              {articles.map(a => (
                <div key={a.slug} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: '1px solid #e8e4de', alignItems: 'flex-start' }}>
                  <div style={{ width: 80, height: 60, flexShrink: 0, background: '#e8e4de', borderRadius: 2, overflow: 'hidden' }}>
                    {a.image && (
                      <img
                        src={a.image}
                        alt={a.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: '#C8A96E', marginBottom: 4 }}>
                      {a.categoryLabel} · {a.readTime} min
                    </div>
                    <Link href={`/articles/${a.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700, color: '#0a0908', lineHeight: 1.3, marginBottom: 4 }}>
                        {a.title}
                      </h3>
                    </Link>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontStyle: 'italic', color: '#6b6560', lineHeight: 1.5, margin: 0 }}>
                      {a.description?.substring(0, 100)}…
                    </p>
                  </div>
                  <button onClick={() => remove(a.slug)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c8c4be', padding: 4, flexShrink: 0 }} title="Supprimer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
