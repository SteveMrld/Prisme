'use client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase'
import AdminNav from '../../components/AdminNav'
import styles from './dashboard.module.css'

const CARDS = [
  {
    href: '/admin/articles',
    title: 'Articles',
    desc: "Rédiger, éditer et publier les articles, grands formats et portraits du magazine.",
    meta: 'Éditorial',
  },
  {
    href: '/admin/publicite',
    title: 'Publicité',
    desc: "Gérer les emplacements éditoriaux sponsorisés et suivre les performances.",
    meta: 'Brand Studio',
  },
  {
    href: '/admin/audience',
    title: 'Audience',
    desc: "Fréquentation, articles les plus lus, sources et appareils. Les chiffres à présenter aux régies et annonceurs.",
    meta: 'Mesure',
  },
]

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === 'steve.moradel@gmail.com') {
        setAuthorized(true)
        setUserEmail(user.email)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <div className={styles.center}>Chargement…</div>
  if (!authorized) return <div className={styles.center}>Accès refusé.</div>

  return (
    <div className={styles.wrapper}>
      <AdminNav active="dashboard" />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>Console</div>
          <h1 className={styles.title}>Console SOARA</h1>
          <p className={styles.subtitle}>
            Connecté en tant que <span className={styles.email}>{userEmail}</span>. Choisissez un module pour commencer.
          </p>
        </header>

        <section className={styles.grid}>
          {CARDS.map(c => (
            <Link key={c.href} href={c.href} className={styles.card}>
              <div className={styles.cardMeta}>{c.meta}</div>
              <div className={styles.cardTitle}>{c.title}</div>
              <div className={styles.cardDesc}>{c.desc}</div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
