'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import articlesData from '../lib/articles.json'
import { createClient } from '../lib/supabase'
import styles from './Header.module.css'
import DarkModeToggle from '../app/DarkModeToggle'

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
  { label: 'Rétrospective', href: '/retrospective', className: 'concept' },
  { label: 'Solutions', href: '/solutions', className: 'env' },
]

const secondaryItems = [
  { label: 'Confins TV', href: '/prismetv', desc: 'Analyses en mouvement' },
  { label: 'Signal Map', href: '/signal-map', desc: 'Carte des tensions géopolitiques' },
  { label: 'Rétrospective 2025', href: '/retrospective', desc: "Les ruptures de l'année" },
  { label: 'Grand Entretien', href: '/entretien/diarra', desc: 'Cheick Modibo Diarra · À venir' },
  { label: 'Contributeurs', href: '/contributeurs', desc: 'La rédaction Confins' },
  { label: 'Changer le monde', href: '/solutions', desc: '157 solutions pour la planète' },
  { label: 'À propos', href: '/apropos', desc: 'Notre projet éditorial' },
]

export default function Header({ activeNav }: { activeNav?: string }) {
  const [date, setDate] = useState('')
  const [user, setUser] = useState<any>(undefined)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
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

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    if (q.trim().length < 2) { setSearchResults([]); return }
    const results = (articlesData as any[]).filter(a =>
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      a.description?.toLowerCase().includes(q.toLowerCase()) ||
      a.author?.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6)
    setSearchResults(results)
  }

  const handleSearchOpen = () => {
    setSearchOpen(o => !o)
    setSearchQuery('')
    setSearchResults([])
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <span className={styles.date}>{date}</span>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>Con<em>fins</em></Link>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.moreBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Plus"
          >···</button>
          <button
            className={styles.searchBtn}
            onClick={handleSearchOpen}
            aria-label="Rechercher"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
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
        {searchOpen && (
          <div className={styles.searchPanel}>
            <div className={styles.searchBar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                autoFocus
                type="text"
                placeholder="Rechercher un article, un sujet…"
                className={styles.searchInput}
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') { setSearchOpen(false); setSearchResults([]) }
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    router.push('/articles/' + searchResults[0].slug)
                    setSearchOpen(false)
                  }
                }}
              />
              <button className={styles.searchClose} onClick={() => { setSearchOpen(false); setSearchResults([]) }}>✕</button>
            </div>
            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((a: any) => (
                  <Link key={a.slug} href={'/articles/' + a.slug}
                    className={styles.searchResultItem}
                    onClick={() => { setSearchOpen(false); setSearchResults([]) }}>
                    <span className={styles.searchResultCat}>{a.category}</span>
                    <span className={styles.searchResultTitle} dangerouslySetInnerHTML={{ __html: a.title }} />
                  </Link>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className={styles.searchEmpty}>Aucun résultat pour « {searchQuery} »</div>
            )}
          </div>
        )}
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

      {/* PANEL PAGES SECONDAIRES */}
      {menuOpen && (
        <div className={styles.morePanel}>
          <div className={styles.morePanelInner}>
            <div className={styles.morePanelHead}>
              <span className={styles.morePanelTitle}>Explorer Confins</span>
              <button className={styles.morePanelClose} onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            <div className={styles.morePanelGrid}>
              {secondaryItems.map(item => (
                <Link key={item.href} href={item.href} className={styles.morePanelItem} onClick={() => setMenuOpen(false)}>
                  <div className={styles.morePanelLabel}>{item.label}</div>
                  <div className={styles.morePanelDesc}>{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.morePanelBackdrop} onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  )
}
