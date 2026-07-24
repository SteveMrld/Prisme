import Link from 'next/link'
import Header from '../../components/Header'
import { FleuronIcon } from '../../components/LettresIcons'
import NewsletterForm from '../../components/NewsletterForm'
import styles from './newsletter.module.css'

export const metadata = {
  title: 'Newsletter',
  description: "La newsletter de Soara. Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire. Inscription gratuite.",
  alternates: { canonical: 'https://soara.fr/newsletter' },
  openGraph: {
    type: 'website',
    url: 'https://soara.fr/newsletter',
    title: 'La newsletter de Soara',
    description: 'Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire.',
    siteName: 'Soara',
    locale: 'fr_FR',
    images: [{ url: '/og-soara.jpg', width: 1200, height: 630, alt: 'Soara' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La newsletter de Soara',
    description: 'Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire.',
    images: ['/og-soara.jpg'],
  },
}

export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.picto} aria-hidden="true">
            <FleuronIcon width={28} height={28} />
          </span>
          <h1 className={styles.title}>
            La lettre du <em>mardi</em>
          </h1>
          <p className={styles.lede}>
            La newsletter de Soara. Chaque mardi, une analyse signée Steve Moradel, écrite à partir de ce que la semaine vient de produire.
          </p>
          <div className={styles.form}>
            <NewsletterForm />
          </div>
          <p className={styles.reassure}>
            Un seul courriel par semaine, jamais de publicité, désinscription en un clic.
          </p>
          <Link href="/lettres" className={styles.secondary}>
            Parcourir les lettres déjà parues →
          </Link>
        </section>
      </main>
    </>
  )
}
