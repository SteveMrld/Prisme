'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import articlesData from '../../lib/articles.json'
import styles from './lectures.module.css'

type Bookmark = {
  slug: string
  title?: string
  savedAt: number
  image?: string
  description?: string
  categoryLabel?: string
  readTime?: string
}

type Article = {
  slug: string
  title: string
  description: string
  category: string
  categoryLabel?: string
  image?: string
  readTime?: string
  date?: string
}

const categoryLabels: Record<string, string> = {
  signal: 'Signal',
  geo: 'Géopolitique',
  eco: 'Économie',
  tech: 'Tech',
  env: 'Environnement',
  soc: 'Société',
  culture: 'Culture',
  portraits: 'Portraits',
  portrait: 'Portrait',
  indicateurs: 'Indicateurs',
}

function formatSavedAt(ts: number): string {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function LecturesClient() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('soara_bookmarks') || '[]') as Bookmark[]
      const sorted = saved
        .filter(b => b && b.slug)
        .sort((a, b) => (Number(b.savedAt) || 0) - (Number(a.savedAt) || 0))
      setBookmarks(sorted)
    } catch {}
    setHydrated(true)
  }, [])

  const remove = (slug: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b.slug !== slug)
      try {
        localStorage.setItem('soara_bookmarks', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const resolveArticle = (slug: string): Article | undefined =>
    (articlesData as Article[]).find(a => a.slug === slug)

  return (
    <main className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Espace personnel</span>
          <h1 className={styles.title}>Mes lectures</h1>
          <p className={styles.lede}>Les articles que vous avez mis de côté.</p>
        </div>
      </header>

      <div className={styles.inner}>
        {!hydrated ? (
          <div className={styles.placeholder} aria-hidden="true" />
        ) : bookmarks.length === 0 ? (
          <section className={styles.empty} aria-live="polite">
            <p className={styles.emptyQuote}>
              «&nbsp;Aucune lecture sauvegardée pour le moment.&nbsp;»
            </p>
            <p className={styles.emptySub}>
              Cliquez sur le signet d&apos;un article pour le retrouver ici, hors flux,
              quand le moment sera venu de le lire.
            </p>
            <Link href="/grands-formats" className={styles.emptyCta}>
              Explorer les Grands formats →
            </Link>
          </section>
        ) : (
          <>
            <div className={styles.gridHead}>
              <span className={styles.gridCount}>
                {bookmarks.length} article{bookmarks.length > 1 ? 's' : ''} dans ma liste
              </span>
            </div>

            <section className={styles.grid} aria-label="Articles sauvegardés">
              {bookmarks.map((b) => {
                const article = resolveArticle(b.slug)
                const title = article?.title || b.title || b.slug
                const image = article?.image || b.image
                const description = article?.description || b.description
                const cat =
                  article?.categoryLabel ||
                  b.categoryLabel ||
                  categoryLabels[article?.category || ''] ||
                  ''
                const readTime = article?.readTime || b.readTime
                const savedStr = formatSavedAt(Number(b.savedAt))

                return (
                  <article key={b.slug} className={styles.card}>
                    <Link
                      href={`/articles/${b.slug}`}
                      className={styles.cardLink}
                      aria-label={`Lire : ${title.replace(/<[^>]+>/g, '')}`}
                    >
                      <div className={styles.cardImgWrap}>
                        {image ? (
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 420px"
                            className={styles.cardImg}
                          />
                        ) : (
                          <div className={styles.cardImgFallback} />
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        {cat && <div className={styles.cardCat}>{cat}</div>}
                        <h2
                          className={styles.cardTitle}
                          dangerouslySetInnerHTML={{ __html: title }}
                        />
                        {description && (
                          <p className={styles.cardDesc}>{description}</p>
                        )}
                        <div className={styles.cardMeta}>
                          {readTime && <span>{readTime} min de lecture</span>}
                          {readTime && savedStr && <span aria-hidden="true">·</span>}
                          {savedStr && <span>Sauvegardé le {savedStr}</span>}
                        </div>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => remove(b.slug)}
                      className={styles.removeBtn}
                      aria-label="Retirer des lectures"
                      title="Retirer des lectures"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </article>
                )
              })}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
