'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './Header.module.css'

const navItems = [
  { label: 'Signal', href: '/signal', className: 'signal' },
  { label: 'Géopolitique', href: '/geo', className: 'geo' },
  { label: 'Économie', href: '/eco', className: 'eco' },
  { label: 'Tech', href: '/tech', className: 'tech' },
  { label: 'Environnement', href: '/env', className: 'env' },
  { label: 'Société', href: '/soc', className: 'soc' },
  { label: 'Culture', href: '/culture', className: 'culture' },
  { label: 'Portraits', href: '/portraits', className: 'portrait' },
  { label: 'Visuels', href: '/visuels', className: 'concept' },
]

export default function Header({ activeNav }: { activeNav?: string }) {
  const [date, setDate] = useState('')

  useEffect(() => {
    const d = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    setDate(d.toLocaleDateString('fr-FR', options))
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <span className={styles.date}>{date}</span>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>Pris<em>me</em></Link>
        </div>
        <div className={styles.actions}>
          <Link href="/connexion" className={styles.btnLogin}>Connexion</Link>
          <Link href="/abonnement" className={styles.btnSubscribe}>S'abonner</Link>
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
