'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './connexion.module.css'

export default function ConnexionPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleGoogle() {
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/compte`,
          queryParams: { prompt: 'select_account' },
        },
      })
      if (error) throw error
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Connexion Google indisponible.' })
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/compte`,
          },
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Lien envoyé : vérifiez votre boîte mail.' })
        return
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/compte`,
          },
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Compte créé : vérifiez votre email pour confirmer.' })
        return
      }

      // mode === 'login'
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/compte')
      router.refresh()

    } catch (err: any) {
      const msg = err.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : err.message === 'User already registered'
        ? 'Un compte existe déjà avec cet email.'
        : err.message || 'Une erreur est survenue.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>So<em>ara</em></div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => { setMode('login'); setMessage(null) }}
            >Connexion</button>
            <button
              className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
              onClick={() => { setMode('signup'); setMessage(null) }}
            >Créer un compte</button>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <button type="button" className={styles.google} onClick={handleGoogle} disabled={loading}>
            <svg className={styles.googleIcon} viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.42 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
            </svg>
            Continuer avec Google
          </button>

          <div className={styles.separator}><span>ou</span></div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Adresse e-mail</label>
              <input
                type="email"
                className={styles.input}
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {mode !== 'magic' && (
              <div className={styles.field}>
                <label className={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            )}

            <button className={styles.btn} disabled={loading}>
              {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : mode === 'signup' ? 'Créer mon compte' : 'Recevoir le lien'}
            </button>
            {mode === 'login' && (
              <Link href="/mot-de-passe-oublie" className={styles.forgot}>
                Mot de passe oublié ?
              </Link>
            )}
          </form>

          {mode === 'login' && (
            <button
              className={styles.magic}
              onClick={() => { setMode('magic'); setMessage(null) }}
            >
              Connexion par lien magique →
            </button>
          )}

          {mode === 'magic' && (
            <button
              className={styles.magic}
              onClick={() => { setMode('login'); setMessage(null) }}
            >
              ← Retour connexion classique
            </button>
          )}

          <div className={styles.divider}><span>Pas encore abonné ?</span></div>
          <Link href="/abonnement" className={styles.subscribe}>
            Découvrir Soara →
          </Link>
        </div>
      </div>
    </>
  )
}
