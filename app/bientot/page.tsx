'use client'
import { useState } from 'react'
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
        <p className={styles.date}>Lancement&nbsp;· lundi 22 juin 2026</p>

        <div className={styles.intro}>
          <p className={styles.introP}>SOARA est un média d&apos;analyse indépendant. Sa raison d&apos;être n&apos;est pas de produire du contenu, mais de faire de la lumière&nbsp;: éclairer ce qu&apos;on ne voit plus.</p>
          <p className={styles.introP}>L&apos;information abonde. La compréhension manque. Chaque jour, des milliers d&apos;articles décrivent les événements sans expliquer les structures qui les produisent. SOARA fait l&apos;inverse, et écrit sur ce qui dure.</p>
          <p className={styles.introP}>Sans actionnaire, sans dépendance à la publicité, sans subvention. Des lecteurs qui paient pour une analyse libre, qui peut dire que la politique africaine de la France a échoué sans que personne n&apos;appelle pour demander de nuancer.</p>
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
