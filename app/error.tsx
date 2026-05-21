'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import styles from './not-found.module.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[soara] runtime error', error)
  }, [error])

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.inner}>

          <div className={styles.eyebrowRow}>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.eyebrow}>Erreur · Une page a déraillé</span>
            <span className={styles.rule} aria-hidden="true" />
          </div>

          <div className={styles.num} aria-hidden="true">!</div>

          <h1 className={styles.title}>
            Quelque chose s&apos;est interrompu<br />
            <em>au moment de charger cette page.</em>
          </h1>

          <p className={styles.lede}>
            Le problème vient de chez nous, pas de vous. Vous pouvez réessayer
            tout de suite, ou revenir à l&apos;accueil et reprendre votre
            lecture ailleurs.
          </p>

          <div className={styles.ctas}>
            <button
              type="button"
              onClick={() => reset()}
              className={styles.btnPrimary}
              style={{ cursor: 'pointer' }}
            >
              Réessayer
            </button>
            <Link href="/" className={styles.btnSecondary}>
              Retour à l&apos;accueil →
            </Link>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 32,
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 11,
                letterSpacing: '0.12em',
                textAlign: 'center',
                color: '#8B8378',
              }}
            >
              Réf : {error.digest}
            </p>
          )}

        </div>
      </main>
    </>
  )
}
