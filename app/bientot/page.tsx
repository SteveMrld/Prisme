'use client'
import { useState, useEffect } from 'react'
import styles from './bientot.module.css'

type EmailState =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }

export default function BientotPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<EmailState>({ kind: 'idle' })

  // Accès équipe : champ mot de passe masqué par défaut, révélé par
  // un petit lien discret en bas. La capture d'email reste l'action
  // principale.
  const [teamOpen, setTeamOpen] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)
  const [pwdPending, setPwdPending] = useState(false)

  // Compte à rebours jusqu'au lancement. La date doit correspondre à la
  // variable LAUNCH_AT définie côté Vercel.
  const LAUNCH_TS = new Date('2026-06-22T12:22:00+02:00').getTime()
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const remaining = now === null ? null : Math.max(0, LAUNCH_TS - now)
  const totalSec = remaining === null ? 0 : Math.floor(remaining / 1000)
  const cd = {
    d: Math.floor(totalSec / 86400),
    h: Math.floor((totalSec % 86400) / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
  }
  const pad2 = (n: number) => String(n).padStart(2, '0')

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state.kind === 'pending') return
    const value = email.trim()
    if (!value) {
      setState({ kind: 'error', message: 'Adresse email invalide.' })
      return
    }
    setState({ kind: 'pending' })
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
      const data = await res.json().catch(() => ({} as any))
      if (res.ok && data?.success) {
        const message = data.doi === false
          ? 'Vous êtes déjà inscrit. À très bientôt.'
          : 'Vérifiez votre boîte mail pour confirmer votre inscription.'
        setState({ kind: 'success', message })
        setEmail('')
        return
      }
      const fallback = res.status === 429
        ? 'Trop de requêtes, réessayez dans une minute.'
        : 'Une erreur est survenue. Réessayez.'
      setState({ kind: 'error', message: data?.error || fallback })
    } catch {
      setState({ kind: 'error', message: 'Une erreur est survenue. Réessayez.' })
    }
  }

  const onTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwdPending) return
    setPwdPending(true)
    setPwdError(false)
    try {
      const res = await fetch('/api/preview-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pwd.trim() }),
      })
      if (res.ok) {
        window.location.href = '/'
        return
      }
      setPwdError(true)
      setTimeout(() => setPwdError(false), 1800)
    } catch {
      setPwdError(true)
      setTimeout(() => setPwdError(false), 1800)
    } finally {
      setPwdPending(false)
    }
  }

  const isPending = state.kind === 'pending'
  const isSuccess = state.kind === 'success'
  const isError = state.kind === 'error'

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logo}>SOARA</div>
        <p className={styles.tagline}>Comprendre le monde. Éclairer l&apos;avenir.</p>
        <div className={styles.divider} />
        <p className={styles.date}>Lancement&nbsp;· lundi 22 juin 2026, 12h22</p>

        {remaining !== null && remaining > 0 && (
          <div className={styles.countdown} aria-label="Compte à rebours avant le lancement">
            <div className={styles.countUnit}><span className={styles.countNum}>{cd.d}</span><span className={styles.countLabel}>jours</span></div>
            <div className={styles.countUnit}><span className={styles.countNum}>{pad2(cd.h)}</span><span className={styles.countLabel}>heures</span></div>
            <div className={styles.countUnit}><span className={styles.countNum}>{pad2(cd.m)}</span><span className={styles.countLabel}>min</span></div>
            <div className={styles.countUnit}><span className={styles.countNum}>{pad2(cd.s)}</span><span className={styles.countLabel}>sec</span></div>
          </div>
        )}
        {remaining !== null && remaining <= 0 && (
          <p className={styles.countLive}>
            <a href="/" className={styles.countLink}>Le site est en ligne — entrer&nbsp;→</a>
          </p>
        )}

        <div className={styles.intro}>
          <p className={styles.introP}>SOARA est un média d&apos;analyse indépendant. Sa raison d&apos;être n&apos;est pas de produire du contenu, mais de faire de la lumière&nbsp;: éclairer ce qu&apos;on ne voit plus.</p>
          <p className={styles.introP}>L&apos;information abonde. La compréhension manque. Chaque jour, des milliers d&apos;articles décrivent les événements sans expliquer les structures qui les produisent. SOARA fait l&apos;inverse, et écrit sur ce qui dure.</p>
          <p className={styles.introP}>Sans actionnaire industriel, sans dépendance à la publicité, sans subvention. Des lecteurs qui paient pour une analyse qui leur est utile, et une rédaction libre de son ton, qui n&apos;a personne à ménager.</p>
          <p className={styles.introP}>Le monde ne se résume pas à l&apos;Occident. Ce qui compte se passe aussi en Asie, en Afrique, partout ailleurs. SOARA va le chercher là où il se trouve.</p>
        </div>

        <form className={styles.captureForm} onSubmit={onEmailSubmit} noValidate>
          <p className={styles.captureLead}>Soyez prévenu du lancement.</p>

          <div className={styles.captureRow}>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (isError || isSuccess) setState({ kind: 'idle' })
              }}
              className={`${styles.captureInput} ${isError ? styles.captureInputError : ''}`}
              disabled={isPending}
              aria-label="Adresse email"
            />
            <button
              type="submit"
              className={styles.captureBtn}
              disabled={isPending || isSuccess}
            >
              {isPending ? 'Envoi…' : isSuccess ? 'Merci' : 'Me prévenir'}
            </button>
          </div>

          {isSuccess && (
            <p className={styles.captureSuccess} role="status">{state.message}</p>
          )}
          {isError && (
            <p className={styles.captureError} role="alert">{state.message}</p>
          )}
        </form>

        <div className={styles.team}>
          {teamOpen ? (
            <form onSubmit={onTeamSubmit} className={styles.teamForm}>
              <input
                type="password"
                placeholder="Mot de passe"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className={`${styles.teamInput} ${pwdError ? styles.teamInputError : ''}`}
                aria-label="Mot de passe équipe"
                autoFocus
              />
              <button
                type="submit"
                className={styles.teamBtn}
                disabled={pwdPending}
              >
                {pwdPending ? '…' : 'Accéder'}
              </button>
              {pwdError && (
                <span className={styles.teamErrorMsg}>Mot de passe incorrect</span>
              )}
            </form>
          ) : (
            <button
              type="button"
              className={styles.teamToggle}
              onClick={() => setTeamOpen(true)}
            >
              Accès équipe
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
