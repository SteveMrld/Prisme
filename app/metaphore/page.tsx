import Link from 'next/link'
import Header from '../../components/Header'
import metaphores from '../../lib/metaphores.json'
import styles from './metaphore.module.css'

export const metadata = {
  title: 'La Métaphore du Samedi',
  description: "Chaque samedi, une illustration conceptuelle pour comprendre ce que le monde révèle. Une image, une thèse, un texte court. Les archives consultables de La Métaphore du Samedi de Soara.",
  alternates: { canonical: 'https://soara.fr/metaphore' },
  openGraph: {
    type: 'website',
    url: 'https://soara.fr/metaphore',
    title: 'La Métaphore du Samedi · Soara',
    description: "Chaque samedi, une illustration conceptuelle pour comprendre ce que le monde révèle. Une image, une thèse, un texte court.",
    siteName: 'Soara',
    locale: 'fr_FR',
  },
}

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
  date: string
  dateISO: string
}

export default function MetaphoreIndex() {
  const all = (metaphores as Metaphore[]).slice().sort((a, b) =>
    new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  )

  return (
    <>
      <Header />
      <main className={styles.main}>

        {/* Cartouche éditorial sobre : filets fins, titre serif, ligne italique.
            Pas de bannière, pas d'aplat. Esprit du cartouche des Lettres. */}
        <header className={styles.cartouche}>
          <div className={styles.cartoucheBody}>
            <span className={styles.cartoucheKicker}>Soara · Hebdomadaire</span>
            <h1 className={styles.cartoucheTitle}>
              La Métaphore du <em>Samedi</em>
            </h1>
            <p className={styles.cartoucheLede}>
              Chaque samedi, une illustration conceptuelle pour comprendre ce que le monde révèle. Une image, une thèse, un texte court.
            </p>
          </div>
        </header>

        {/* Galerie image-forward numérotée. Sur mobile, file horizontale
            scroll-snap avec pagination par points (ancres CSS). */}
        <section className={styles.gallery} aria-label="Archives">
          <ol className={styles.list}>
            {all.map((m, i) => (
              <li
                key={m.slug}
                id={`metaphore-${m.numero}`}
                className={styles.item}
              >
                <Link href={`/metaphore/${m.slug}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    <img src={m.image} alt={m.imageAlt} loading={i === 0 ? undefined : 'lazy'} />
                    <span className={styles.cardNum} aria-hidden="true">
                      N° {String(m.numero).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardDate}>{m.date}</span>
                    <h2 className={styles.cardTitle}>{m.title}</h2>
                    <p className={styles.cardThese}>{m.these}</p>
                    <span className={styles.cardCta}>Voir la métaphore →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          {all.length > 1 && (
            <nav className={styles.dots} aria-label="Pagination">
              {all.map(m => (
                <a
                  key={m.slug}
                  href={`#metaphore-${m.numero}`}
                  className={styles.dot}
                  aria-label={`Aller à la métaphore N° ${String(m.numero).padStart(2, '0')}`}
                >
                  <span aria-hidden="true" />
                </a>
              ))}
            </nav>
          )}
        </section>
      </main>
    </>
  )
}
