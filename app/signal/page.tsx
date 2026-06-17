import Header from '../../components/Header'
import Link from 'next/link'
import styles from './signal.module.css'
import filSignal from '@/lib/fil-signal.json'
import SignalFeed from './SignalFeed'
import { parseSignalDate } from '../../lib/signal-dates'

const signals = filSignal.breves

// Date du bandeau : la brève la plus récente du fil.
const bandDate =
  signals
    .slice()
    .sort(
      (a, b) =>
        (parseSignalDate(b.date)?.sort ?? 0) - (parseSignalDate(a.date)?.sort ?? 0)
    )[0]?.date ?? filSignal.date_maj

export const metadata = {
  title: 'Signal',
  description: 'L\'actualité qui compte. Les faits bruts, sans bruit.',
  alternates: { canonical: 'https://soara.fr/signal' },
}

export default function SignalPage() {
  return (
    <>
      <Header activeNav="signal" />

      <div className={styles.band}>
        <div className={styles.bandLeft}>
          <span className={styles.livePill}>
            <span className={styles.liveDot} />
            LIVE
          </span>
          <div>
            <div className={styles.bandLabel}>Signal</div>
            <div className={styles.bandDesc}>L'actualité qui compte. Les faits bruts, sans bruit.</div>
          </div>
        </div>
        <div className={styles.bandDate}>{bandDate}</div>
      </div>

      <SignalFeed breves={signals} />

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
