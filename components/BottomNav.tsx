'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.css'

const items = [
  {
    label: 'Accueil',
    href: '/',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    )
  },
  {
    label: 'Carte',
    href: '/signal-map',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    )
  },
  {
    label: 'Grands formats',
    href: '/geo',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="8" y1="14" x2="16" y2="14"/>
        <line x1="8" y1="17" x2="14" y2="17"/>
      </svg>
    )
  },
  {
    label: 'TV',
    href: '/prismetv',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 3l-4 4-4-4"/>
      </svg>
    )
  },
  {
    label: 'Recoupement',
    href: '/recoupement',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        <line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/>
      </svg>
    )
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.bottomNav}>
      {items.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} className={`${styles.item} ${active ? styles.active : ''}`}>
            <span className={styles.icon}>{item.icon(active)}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
