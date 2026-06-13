import Header from '../../components/Header'
import Link from 'next/link'
import styles from './signal.module.css'
import filSignal from '@/lib/fil-signal.json'

const signals = filSignal.breves

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
        <div className={styles.bandDate}>26 avril 2026</div>
      </div>

      <div className={styles.feed}>
        {signals.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.itemMeta}>
              <span className={styles.itemDot} style={{ background: item.catColor }} />
              <span className={styles.itemCat} style={{ color: item.catColor }}>{item.cat}</span>
              <span className={styles.itemDate}>{item.date}</span>
            </div>
            <h2 className={styles.itemHeadline}>{item.headline}</h2>
            <p className={styles.itemBody}>{item.body}</p>
          </div>
        ))}
      </div>

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
