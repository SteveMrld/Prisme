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
        setMessage({ type: 'success', text: 'Lien envoyé — vérifiez votre boîte mail.' })
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
        setMessage({ type: 'success', text: 'Compte créé — vérifiez votre email pour confirmer.' })
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
          <div className={styles.logo}>Pris<em>me</em></div>

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
            Découvrir Prisme →
          </Link>
        </div>
      </div>
    </>
  )
}
