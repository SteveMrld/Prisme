'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import styles from './Header.module.css'

const navItems = [
  { label: 'Signal', href: '/signal', className: 'signal' },
  { label: 'Géopolitique', href: '/geo', className: 'geo' },
  { label: 'Économie', href: '/eco', className: 'eco' },
  { label: 'Tech', href: '/tech', className: 'tech' },
  { label: 'Environnement', href: '/env', className: 'env' },
  { label: 'Société', href: '/soc', className: 'soc' },
  { label: 'Sciences', href: '/sciences', className: 'sciences' },
  { label: 'Culture', href: '/culture', className: 'culture' },
  { label: 'Portraits', href: '/portraits', className: 'portrait' },
  { label: 'Visuels', href: '/visuels', className: 'concept' },
  { label: 'Rétrospective 2025', href: '/retrospective', className: 'retro' },
]

export default function Header({ activeNav }: { activeNav?: string }) {
  const [date, setDate] = useState('')
  const [user, setUser] = useState<any>(undefined) // undefined = loading
  const supabase = createClient()

  useEffect(() => {
    const d = new Date()
    setDate(d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))

    // Auth state
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <span className={styles.date}>{date}</span>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>Pris<em>me</em></Link>
        </div>
        <div className={styles.actions}>
          {user === undefined ? (
            <div className={styles.actionsPlaceholder} />
          ) : user ? (
            <>
              <Link href="/compte" className={styles.btnLogin}>Mon compte</Link>
              <Link href="/abonnement" className={styles.btnSubscribe}>S'abonner</Link>
            </>
          ) : (
            <>
              <Link href="/connexion" className={styles.btnLogin}>Connexion</Link>
              <Link href="/abonnement" className={styles.btnSubscribe}>S'abonner</Link>
            </>
          )}
        </div>
      </div>
      <nav className={styles.nav}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${styles[item.className]} ${activeNav === item.className ? styles.active : ''}`}
          >
            {item.label}
            {item.className === 'signal' && <span className={styles.signalDot}></span>}
          </Link>
        ))}
      </nav>
    </header>
  )
}
