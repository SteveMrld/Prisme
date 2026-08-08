'use client'

import { useEffect, useState } from 'react'
import { SWG_SCRIPT_URL } from '../lib/swg'
import styles from './SwgSubscribe.module.css'

declare global {
  interface Window {
    SWG?: any[]
  }
}

/**
 * Bouton "S'abonner avec Google" affiché sous le paywall.
 *
 * Le lecteur paie avec le moyen de paiement de son compte Google, sans
 * formulaire de carte. Le parcours est ouvert manuellement par showOffers()
 * plutôt que par la bannière automatique de Google, pour rester dans notre
 * propre mise en page.
 *
 * Le bouton ne s'affiche que si le script Google répond. Tant que la
 * publication est en cours d'examen chez Google, showOffers() ne renvoie
 * rien : le composant se retire de lui-même pour ne pas laisser un bouton
 * mort dans le paywall.
 */
export default function SwgSubscribe() {
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    window.SWG = window.SWG || []
    window.SWG.push((subscriptions: any) => {
      if (cancelled) return
      try {
        subscriptions.init('www.soara.fr')
      } catch {
        // init() peut déjà avoir été appelé par une autre instance du
        // composant sur la même page. Sans conséquence.
      }
      setReady(true)
    })

    if (!document.getElementById('swg-script')) {
      const s = document.createElement('script')
      s.id = 'swg-script'
      s.async = true
      s.src = SWG_SCRIPT_URL
      s.setAttribute('subscriptions-control', 'manual')
      document.head.appendChild(s)
    }

    return () => { cancelled = true }
  }, [])

  if (!ready) return null

  function openOffers() {
    setBusy(true)
    window.SWG?.push((subscriptions: any) => {
      try {
        subscriptions.showOffers({ isClosable: true })
      } finally {
        setBusy(false)
      }
    })
  }

  return (
    <>
      <div className={styles.separator}><span>ou</span></div>
      <button type="button" className={styles.button} onClick={openOffers} disabled={busy}>
        <svg className={styles.icon} viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
          <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.42 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
        </svg>
        S&apos;abonner avec Google
      </button>
      <div className={styles.note}>Paiement par votre compte Google, sans saisie de carte</div>
    </>
  )
}
