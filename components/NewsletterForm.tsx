'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './NewsletterForm.module.css'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  /** Label du bouton avant submit. Defaut "S'inscrire gratuitement". */
  ctaLabel?: string
  /** Placeholder du champ email. */
  placeholder?: string
  /** Message editorial affiche apres succes + collapse. */
  successMessage?: string
}

export default function NewsletterForm({
  ctaLabel = "S'inscrire gratuitement",
  placeholder = 'votre@email.com',
  successMessage = 'Vous recevrez la lettre du mardi dans votre boîte. À très vite.',
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [done, setDone] = useState(false)
  const reducedMotion = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Apres 2s de success : declenche le collapse, ou bascule direct
  // sur l'etat final si l'utilisateur a demande reduced motion.
  useEffect(() => {
    if (status !== 'success') return
    if (reducedMotion.current) {
      setDone(true)
      return
    }
    const t = setTimeout(() => setCollapsed(true), 2000)
    return () => clearTimeout(t)
  }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrMsg('Cette adresse est invalide. Vérifiez et réessayez.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setErrMsg('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) throw new Error('http_' + res.status)
      setStatus('success')
    } catch {
      setErrMsg("Inscription impossible pour le moment. Réessayez dans un instant.")
      setStatus('error')
    }
  }

  if (done) {
    return <div className={styles.confirmed}>{successMessage}</div>
  }

  return (
    <div
      className={styles.formWrap}
      data-collapsed={collapsed ? 'true' : 'false'}
      onTransitionEnd={e => {
        if (collapsed && e.propertyName === 'grid-template-rows') setDone(true)
      }}
    >
      <div className={styles.formInner}>
        <form onSubmit={submit} className={styles.form} noValidate>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (status === 'error') { setStatus('idle'); setErrMsg('') }
            }}
            placeholder={placeholder}
            required
            aria-label="Votre adresse e-mail"
            disabled={status === 'success' || status === 'submitting'}
            data-error={status === 'error' ? 'true' : 'false'}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={status === 'success' || status === 'submitting'}
            className={styles.btn}
            data-state={status}
          >
            {status === 'success' ? (
              <>
                <span className={styles.btnCheck} aria-hidden>✓</span>
                <span>Inscription confirmée</span>
              </>
            ) : status === 'submitting' ? (
              'Inscription…'
            ) : (
              ctaLabel
            )}
          </button>
          {status === 'error' && errMsg && (
            <div className={styles.error} role="alert">{errMsg}</div>
          )}
        </form>
      </div>
    </div>
  )
}
