import Header from '../components/Header'
import Link from 'next/link'
import styles from './not-found.module.css'

export const metadata = {
  title: '404 — Page introuvable · Prisme',
}

export default function NotFound() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.num}>404</div>
          <h1 className={styles.title}>Cette page <em>n'existe pas</em></h1>
          <p className={styles.desc}>
            Elle a peut-être été déplacée, supprimée, ou n'a jamais existé.
            Ce qui existe, en revanche, c'est le reste du site.
          </p>
          <div className={styles.links}>
            <Link href="/" className={styles.btnPrimary}>Retour à l'accueil</Link>
            <Link href="/geo" className={styles.btnSecondary}>Géopolitique →</Link>
            <Link href="/tech" className={styles.btnSecondary}>Technologie →</Link>
            <Link href="/signal" className={styles.btnSecondary}>Signal →</Link>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
