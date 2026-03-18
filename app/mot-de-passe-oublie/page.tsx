'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import styles from './reset.module.css'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError('Une erreur est survenue. Vérifiez votre adresse email.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>Pris<em>me</em></div>

          {sent ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h1 className={styles.successTitle}>Lien envoyé</h1>
              <p className={styles.successText}>
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <Link href="/connexion" className={styles.btn}>Retour à la connexion</Link>
            </div>
          ) : (
            <>
              <h1 className={styles.title}>Mot de passe oublié</h1>
              <p className={styles.sub}>Entrez votre email — nous vous enverrons un lien pour choisir un nouveau mot de passe.</p>

              {error && <div className={styles.error}>{error}</div>}

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
                <button className={styles.btn} disabled={loading}>
                  {loading ? 'Envoi…' : 'Envoyer le lien'}
                </button>
              </form>

              <Link href="/connexion" className={styles.back}>← Retour à la connexion</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
