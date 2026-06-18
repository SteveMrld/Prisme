import type { Metadata } from 'next'
import styles from '../bientot/bientot.module.css'

export const metadata: Metadata = {
  title: 'Inscription confirmée',
  robots: { index: false, follow: false },
}

export default function InscriptionConfirmeePage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logo}>SOARA</div>
        <p className={styles.tagline}>Comprendre le monde. Éclairer l&apos;avenir.</p>
        <div className={styles.divider} />
        <p className={styles.date}>Lancement&nbsp;· lundi 22 juin 2026</p>

        <p className={styles.captureLead} style={{ marginTop: 56, fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.35, color: '#FAFAF8' }}>
          Inscription confirmée
        </p>
        <p className={styles.captureLead} style={{ marginTop: 14 }}>
          Votre adresse est bien enregistrée. Vous recevrez nos publications dès l&apos;ouverture.
        </p>
      </div>
    </div>
  )
}
