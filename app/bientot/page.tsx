import styles from './bientot.module.css'

export const metadata = {
  title: 'SOARA — Bientôt',
  robots: 'noindex, nofollow',
}

export default function BientotPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logo}>SOARA</div>
        <p className={styles.tagline}>Média d&apos;analyse indépendant</p>
        <div className={styles.divider} />
        <p className={styles.date}>Lancement — 1<sup>er</sup> juin 2026</p>
      </div>
    </div>
  )
}
