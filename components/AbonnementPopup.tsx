'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AbonnementPopup.module.css'

// Pop-up d'abonnement déclenché par l'engagement : il n'apparaît qu'une fois
// que le lecteur a parcouru une bonne partie d'un article (jamais à l'arrivée
// sur le site, ce qui serait intrusif et pénalisé par Google). Il reste affiché
// jusqu'à action ou fermeture, ne se montre qu'une fois par SUPPRESS_DAYS, et
// seulement sur les pages d'article.
const STORAGE_KEY = 'soara_abo_popup'
const SUPPRESS_DAYS = 30
const SCROLL_TRIGGER = 0.55

function isSuppressed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const ts = Number(raw)
    if (!ts) return true
    return Date.now() - ts < SUPPRESS_DAYS * 86_400_000
  } catch {
    return false
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    /* indisponible en navigation privée stricte : on ignore */
  }
}

export default function AbonnementPopup() {
  const pathname = usePathname() || '/'
  const onArticle = pathname.startsWith('/articles/')
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const shownRef = useRef(false)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    remember()
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 240)
  }, [])

  // Déclenchement à la profondeur de lecture
  useEffect(() => {
    if (!onArticle || shownRef.current || isSuppressed()) return
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      if (total <= 0) return
      if (window.scrollY / total >= SCROLL_TRIGGER) {
        shownRef.current = true
        setOpen(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onArticle])

  // Échap pour fermer + focus sur le bouton de fermeture à l'ouverture
  useEffect(() => {
    if (!open) return
    closeBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      className={`${styles.overlay} no-print`}
      data-closing={closing ? 'true' : 'false'}
      onClick={close}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="abo-pop-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className={styles.close}
          onClick={close}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className={styles.eyebrow}>L&rsquo;expérience Soara, en entier</div>
        <h2 id="abo-pop-title" className={styles.title}>
          Lisez tout <em>Soara</em>
        </h2>
        <p className={styles.desc}>
          Abonnez-vous pour accéder à tous les grands formats, aux archives et
          aux données exclusives. Sans publicité, sans algorithme.
        </p>
        <div className={styles.price}>
          dès 9,99&nbsp;€ <span className={styles.per}>/ mois</span>
        </div>

        <Link href="/abonnement" className={styles.cta} onClick={remember}>
          S&rsquo;abonner
        </Link>
        <button className={styles.later} onClick={close}>
          Plus tard
        </button>
        <Link href="/connexion" className={styles.login} onClick={remember}>
          Déjà abonné&nbsp;? Se connecter
        </Link>
      </div>
    </div>
  )
}
