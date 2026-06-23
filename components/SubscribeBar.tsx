'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './SubscribeBar.module.css'

// Bandeau de conversion discret (newsletter en action principale, rappel
// d'abonnement en lien secondaire). Glisse en bas après un court délai, se
// ferme d'un clic, et ne réapparaît pas pendant SUPPRESS_DAYS une fois fermé
// ou une inscription effectuée. Suppression mémorisée par appareil.
const STORAGE_KEY = 'soara_subbar'
const SUPPRESS_DAYS = 30
const SHOW_DELAY_MS = 3500

// Routes où le bandeau n'a pas lieu d'être (tunnel d'inscription, compte,
// pages déjà dédiées à la conversion, back-office).
const HIDDEN_PREFIXES = [
  '/bientot',
  '/connexion',
  '/compte',
  '/abonnement',
  '/inscription-confirmee',
  '/reset-password',
  '/mot-de-passe-oublie',
  '/preview-unlock',
  '/admin',
  '/lettres',
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

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
    /* localStorage indisponible (navigation privée stricte) : on ignore */
  }
}

export default function SubscribeBar() {
  const pathname = usePathname() || '/'
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const reduced = useRef(false)

  const hiddenRoute = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  useEffect(() => {
    if (!mounted || hiddenRoute || isSuppressed()) return
    const t = setTimeout(() => setVisible(true), reduced.current ? 0 : SHOW_DELAY_MS)
    return () => clearTimeout(t)
  }, [mounted, hiddenRoute])

  const close = () => {
    setClosing(true)
    setTimeout(() => setVisible(false), 280)
  }

  const dismiss = () => {
    remember()
    close()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
      if (!res.ok) throw new Error('http_' + res.status)
      setStatus('success')
      remember()
      setTimeout(close, 4500)
    } catch {
      setStatus('error')
    }
  }

  if (!visible || hiddenRoute) return null

  return (
    <div
      className={`${styles.bar} no-print`}
      data-closing={closing ? 'true' : 'false'}
      role="region"
      aria-label="Inscription à la lettre du mardi"
    >
      <div className={styles.inner}>
        {status === 'success' ? (
          <p className={styles.success}>
            Vérifiez votre boîte mail pour confirmer votre inscription. À mardi.
          </p>
        ) : (
          <>
            <div className={styles.text}>
              <span className={styles.label}>
                La lettre du <em>mardi</em>
              </span>
              <span className={styles.sub}>
                Une lecture par semaine pour prendre de la hauteur sur l&rsquo;actualité. Gratuit.
              </span>
            </div>

            <form className={styles.form} onSubmit={submit} noValidate>
              <input
                className={styles.input}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="votre@email.com"
                aria-label="Votre adresse e-mail"
                value={email}
                data-error={status === 'error' ? 'true' : 'false'}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                disabled={status === 'submitting'}
              />
              <button
                className={styles.btn}
                type="submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Inscription…' : "S'inscrire"}
              </button>
            </form>

            <Link href="/abonnement" className={styles.secondary}>
              ou soutenir Soara
            </Link>
          </>
        )}
      </div>

      <button className={styles.close} onClick={dismiss} aria-label="Fermer ce bandeau">
        ×
      </button>
    </div>
  )
}
