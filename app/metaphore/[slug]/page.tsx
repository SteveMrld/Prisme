import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
import metaphores from '../../../lib/metaphores.json'
import styles from './metaphore-detail.module.css'

const BASE_URL = 'https://soara.fr'

type Metaphore = {
  slug: string
  numero: number
  title: string
  these: string
  evenement: string
  image: string
  imageAlt: string
  texte: string
  artiste: string
  artisteUrl?: string
  date: string
  dateISO: string
}

export function generateStaticParams() {
  return (metaphores as Metaphore[]).map(m => ({ slug: m.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const m = (metaphores as Metaphore[]).find(x => x.slug === params.slug)
  if (!m) return {}
  const url = `${BASE_URL}/metaphore/${params.slug}`
  return {
    title: `${m.title} · La Métaphore du Samedi`,
    description: m.these,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${m.title} · La Métaphore du Samedi`,
      description: m.these,
      siteName: 'Soara',
      locale: 'fr_FR',
      images: [{ url: m.image, alt: m.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${m.title} · La Métaphore du Samedi`,
      description: m.these,
      images: [m.image],
    },
  }
}

export default function MetaphorePage({ params }: { params: { slug: string } }) {
  const all = (metaphores as Metaphore[]).slice().sort((a, b) =>
    new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  )
  const idx = all.findIndex(x => x.slug === params.slug)
  if (idx === -1) notFound()

  const m = all[idx]
  // Plus récent (suivant) à gauche dans la chronologie inversée : idx - 1.
  // Plus ancien (précédent) : idx + 1.
  const newer = idx > 0 ? all[idx - 1] : null
  const older = idx < all.length - 1 ? all[idx + 1] : null

  return (
    <>
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>

          {/* Illustration plein cadre 16:9 en tête, sans rognage agressif. */}
          <figure className={styles.hero}>
            <img src={m.image} alt={m.imageAlt} />
          </figure>

          <header className={styles.head}>
            <div className={styles.metaTop}>
              <span className={styles.label}>La Métaphore du Samedi</span>
              <span className={styles.metaSep} aria-hidden="true">·</span>
              <span className={styles.numero}>N° {String(m.numero).padStart(2, '0')}</span>
              <span className={styles.metaSep} aria-hidden="true">·</span>
              <time className={styles.date} dateTime={m.dateISO}>{m.date}</time>
            </div>
            <h1 className={styles.title}>{m.title}</h1>
            <p className={styles.these}>{m.these}</p>
          </header>

          <div className={styles.body}>
            <p className={styles.texte}>{m.texte}</p>
          </div>

          <footer className={styles.foot}>
            <p className={styles.credit}>
              <span className={styles.creditLabel}>Illustration</span>
              <span className={styles.creditName}>
                {m.artisteUrl ? (
                  <a href={m.artisteUrl} target="_blank" rel="noopener noreferrer">{m.artiste}</a>
                ) : m.artiste}
              </span>
            </p>
          </footer>

          <nav className={styles.nav} aria-label="Navigation entre éditions">
            {older ? (
              <Link href={`/metaphore/${older.slug}`} className={`${styles.navLink} ${styles.navPrev}`}>
                <span className={styles.navDir}>← Édition précédente</span>
                <span className={styles.navMeta}>N° {String(older.numero).padStart(2, '0')} · {older.date}</span>
                <span className={styles.navTitle}>{older.title}</span>
              </Link>
            ) : <span className={styles.navSpacer} />}
            {newer ? (
              <Link href={`/metaphore/${newer.slug}`} className={`${styles.navLink} ${styles.navNext}`}>
                <span className={styles.navDir}>Édition suivante →</span>
                <span className={styles.navMeta}>N° {String(newer.numero).padStart(2, '0')} · {newer.date}</span>
                <span className={styles.navTitle}>{newer.title}</span>
              </Link>
            ) : <span className={styles.navSpacer} />}
          </nav>

          <div className={styles.cta}>
            <Link href="/metaphore" className={styles.ctaBack}>← Toutes les métaphores</Link>
          </div>
        </article>
      </main>
    </>
  )
}
