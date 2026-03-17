'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState } from 'react'
import styles from './connexion.module.css'

export default function ConnexionPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>Pris<em>me</em></div>
          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.sub}>Accédez à vos articles et à votre espace abonné.</p>

          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Adresse e-mail</label>
              <input
                type="email"
                className={styles.input}
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Mot de passe</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className={styles.btn}>Se connecter</button>
            <a href="#" className={styles.forgot}>Mot de passe oublié ?</a>
          </div>

          <div className={styles.divider}><span>Pas encore abonné ?</span></div>
          <Link href="/abonnement" className={styles.subscribe}>
            Découvrir Prisme →
          </Link>
        </div>
      </div>
    </>
  )
}
