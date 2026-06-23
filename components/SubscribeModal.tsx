'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './SubscribeModal.module.css'

// Modal d'entrée déclenchée à l'engagement (jamais à l'arrivée immédiate, pour
// ne pas tomber sous la pénalité Google des interstitielles intrusives).
// Newsletter en action principale, abonnement en second. Une seule fois puis
// mémorisée. Coordonnée avec SubscribeBar via la clé partagée et un drapeau de
// session, pour ne jamais afficher les deux ensemble.
const PROMPT_KEY = 'soara_prompt' // partagée avec SubscribeBar
const SESSION_KEY = 'soara_modal_session'
const SUPPRESS_DAYS = 30
const MIN_DELAY_MS = 8000 // pas de modal avant 8 s
const FALLBACK_MS = 30000 // sinon, au bout de 30 s
const SCROLL_RATIO = 0.45 // ou après 45 % de défilement

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
    const raw = localStorage.getItem(PROMPT_KEY)
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
    localStorage.setItem(PROMPT_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}

export default function SubscribeModal() {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const shownRef = useRef(false)
  const reduced = useRef(false)

  const hiddenRoute = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hiddenRoute || isSuppressed()) return

    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Revendique la session : le bandeau du bas s'efface tant que la modal
    // est en jeu.
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }

    let mounted = true
    const reveal = () => {
      if (!mounted || shownRef.current) return
      shownRef.current = true
      setOpen(true)
      cleanup()
    }

    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      if (max > 0 && h.scrollTop / max >= SCROLL_RATIO) reveal()
    }

    const minTimer = setTimeout(() => {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }, MIN_DELAY_MS)
    const maxTimer = setTimeout(reveal, FALLBACK_MS)

    function cleanup() {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
      window.removeEventListener('scroll', onScroll)
    }

    return () => {
      mounted = false
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenRoute])

  // Verrou du défilement de l'arrière-plan + fermeture au clavier (Échap)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 240)
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

  if (!open || hiddenRoute) return null

  return (
    <div
      className={`${styles.overlay} no-print`}
      data-closing={closing ? 'true' : 'false'}
      onClick={dismiss}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="soara-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={dismiss} aria-label="Fermer">
          ×
        </button>

        {status === 'success' ? (
          <p className={styles.success}>
            Vérifiez votre boîte mail pour confirmer votre inscription. À mardi.
          </p>
        ) : (
          <>
            <div className={styles.eyebrow}>Soara</div>
            <h2 id="soara-modal-title" className={styles.title}>
              Prenez de la hauteur, <em>chaque semaine</em>
            </h2>
            <p className={styles.desc}>
              La lettre du mardi&nbsp;: une lecture par semaine pour regarder le
              monde autrement. Gratuit, sans bruit.
            </p>

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
                autoFocus
              />
              <button
                className={styles.btn}
                type="submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Inscription…' : "S'inscrire gratuitement"}
              </button>
            </form>

            <div className={styles.secondary}>
              <span>Envie de tout lire&nbsp;?</span>{' '}
              <Link href="/abonnement" className={styles.secondaryLink} onClick={dismiss}>
                Découvrir l&rsquo;abonnement, dès 9,99&nbsp;€/mois
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
