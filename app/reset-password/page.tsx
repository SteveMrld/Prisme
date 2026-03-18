'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import styles from '../mot-de-passe-oublie/reset.module.css'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Lien expiré ou invalide. Recommencez depuis la page de connexion.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/compte'), 2000)
    }
    setLoading(false)
  }

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>Pris<em>me</em></div>

          {done ? (
            <div className={styles.success}>
              <div className={styles.successIcon}></div>
              <h1 className={styles.successTitle}>Mot de passe mis à jour</h1>
              <p className={styles.successText}>Redirection vers votre compte…</p>
            </div>
          ) : (
            <>
              <h1 className={styles.title}>Nouveau mot de passe</h1>
              <p className={styles.sub}>Choisissez un mot de passe d'au moins 8 caractères.</p>

              {error && <div className={styles.error}>{error}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label}>Nouveau mot de passe</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <button className={styles.btn} disabled={loading}>
                  {loading ? 'Mise à jour…' : 'Mettre à jour'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}
