import Link from 'next/link'
import Header from '../../components/Header'
import { FleuronIcon } from '../../components/LettresIcons'
import NewsletterForm from '../../components/NewsletterForm'
import lettres from '../../lib/lettres.json'
import styles from './lettres.module.css'

export const metadata = {
  title: 'La lettre du mardi',
  description: "Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire. Les archives consultables de la lettre du mardi de Soara.",
  alternates: { canonical: 'https://soara.fr/lettres' },
  openGraph: {
    type: 'website',
    url: 'https://soara.fr/lettres',
    title: 'La lettre du mardi · Soara',
    description: 'Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire.',
    siteName: 'Soara',
    locale: 'fr_FR',
  },
}

export default function LettresIndex() {
  const all = (lettres as any[]).slice().sort((a, b) =>
    new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  )

  return (
    <>
      <Header />
      <main className={styles.main}>

        {/* Cartouche éditorial : titre, picto en accent, ligne italique,
            cadré de deux filets fins. Sobre, sans aplat ni bannière. */}
        <header className={styles.cartouche}>
          <svg
            className={styles.cartoucheCurve}
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M0,286 C260,268 520,214 760,150 C940,102 1080,58 1200,18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,300 C280,286 560,240 820,178 C1000,136 1110,102 1200,72"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className={styles.cartoucheBody}>
            <span className={styles.cartouchePicto} aria-hidden="true">
              <FleuronIcon width={26} height={26} />
            </span>
            <h1 className={styles.cartoucheTitle}>
              La lettre du <em>mardi</em>
            </h1>
            <p className={styles.cartoucheLede}>
              Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire.
            </p>
            <p className={styles.cartoucheNote}>
              C'est le seul rendez-vous où Soara prend l'actualité au moment où elle est encore chaude, avant que les positions ne se figent. La lettre part d'un fait précis pour aller chercher ce qu'il engage, sans s'en tenir au cadre occidental qui organise d'ordinaire le débat.
            </p>
          </div>
        </header>

        <div className={styles.subscribe}>
          <div className={styles.subscribeInner}>
            <span className={styles.subscribeLabel}>Recevoir la lettre chaque mardi</span>
            <NewsletterForm />
          </div>
        </div>

        <section className={styles.list}>
          {all.map(l => (
            <Link key={l.slug} href={`/lettres/${l.slug}`} className={styles.item}>
              <div className={styles.itemMeta}>
                <span className={styles.itemNum}>N° {String(l.numero).padStart(2, '0')}</span>
                <span className={styles.itemDate}>{l.date}</span>
              </div>
              <h2 className={styles.itemTitle}>{l.title}</h2>
              <p className={styles.itemTeaser}>{l.teaser}</p>
              <span className={styles.itemCta}>Lire la lettre →</span>
            </Link>
          ))}
        </section>
      </main>
    </>
  )
}
