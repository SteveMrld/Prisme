import Link from 'next/link'
import Header from '../../components/Header'
import lettres from '../../lib/lettres.json'
import styles from './lettres.module.css'

export const metadata = {
  title: 'La lettre du mardi',
  description: "Chaque mardi, une analyse pour penser la semaine plutôt que la subir. Les archives consultables de la lettre du mardi de Soara.",
  alternates: { canonical: 'https://soara.fr/lettres' },
  openGraph: {
    type: 'website',
    url: 'https://soara.fr/lettres',
    title: 'La lettre du mardi · Soara',
    description: 'Chaque mardi, une analyse pour penser la semaine plutôt que la subir.',
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
        <header className={styles.head}>
          <div className={styles.eyebrow}>Soara · Newsletter</div>
          <h1 className={styles.title}>La lettre du <em>mardi</em></h1>
          <p className={styles.lede}>
            Chaque mardi, une analyse pour penser la semaine plutôt que la subir.
          </p>
          <Link href="/abonnement" className={styles.subscribe}>
            S'abonner gratuitement →
          </Link>
        </header>

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
