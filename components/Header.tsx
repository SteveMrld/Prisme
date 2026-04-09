'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import articlesData from '../lib/articles.json'
import { createClient } from '../lib/supabase'
import styles from './Header.module.css'

const rubriques = [
  { label: 'Géopolitique', href: '/geo' },
  { label: 'Économie', href: '/eco' },
  { label: 'Tech', href: '/tech' },
  { label: 'Environnement', href: '/env' },
  { label: 'Société', href: '/soc' },
  { label: 'Sciences', href: '/sciences' },
  { label: 'Culture', href: '/culture' },
  { label: 'Portraits', href: '/portraits' },
  { label: 'Indicateurs', href: '/indicateurs' },
]

const formats = [
  { label: 'Soara TV', href: '/prismetv', desc: 'Analyses en mouvement' },
  { label: 'Signal Map', href: '/signal-map', desc: 'Carte des tensions en temps réel' },
  { label: 'Grand Entretien', href: '/entretien/diarra', desc: 'Cheick Modibo Diarra · À venir' },
  { label: 'Recoupement', href: '/recoupement', desc: 'Vérification par IA' },
  { label: 'Changer le monde', href: '/solutions', desc: '157 solutions ChangeNow 2026' },
  { label: 'Rétrospective', href: '/retrospective', desc: "Les ruptures de 2025" },
  { label: 'Grands Formats', href: '/visuels', desc: 'Visualisations interactives' },
]

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
  { label: 'Indicateurs', href: '/indicateurs', className: 'eco' },
  { label: 'Visuels', href: '/visuels', className: 'concept' },
  { label: 'Rétrospective', href: '/retrospective', className: 'concept' },
  { label: 'Solutions', href: '/solutions', className: 'env' },
]

export default function Header({ activeNav }: { activeNav?: string }) {
  const [date, setDate] = useState('')
  const [user, setUser] = useState<any>(undefined)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const d = new Date()
    setDate(d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Fermer menu sur Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false) } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
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

  return (
    <header className={styles.header}>

      {/* ── DESKTOP HEADER ── */}
      <div className={styles.desktopHeader}>
        <div className={styles.desktopLeft}>
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <button className={styles.searchBtn} onClick={() => { setSearchOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 50) }} aria-label="Rechercher">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <Link href="/" className={styles.desktopLogo}>So<em>ara</em></Link>

        <div className={styles.desktopRight}>
          {user === undefined ? <div className={styles.actionsPlaceholder} /> : user ? (
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

      {/* ── MEGA MENU DESKTOP ── */}
      {menuOpen && (
        <>
          <div className={styles.megaMenu}>
            <div className={styles.megaMenuInner}>
              <div className={styles.megaCol}>
                <div className={styles.megaColTitle}>Rubriques</div>
                {rubriques.map(r => (
                  <Link key={r.href} href={r.href} className={styles.megaLink} onClick={() => setMenuOpen(false)}>
                    {r.label}
                  </Link>
                ))}
              </div>
              <div className={styles.megaDivider} />
              <div className={styles.megaCol}>
                <div className={styles.megaColTitle}>Formats</div>
                {formats.map(f => (
                  <Link key={f.href} href={f.href} className={styles.megaLinkFmt} onClick={() => setMenuOpen(false)}>
                    <span className={styles.megaLinkLabel}>{f.label}</span>
                    <span className={styles.megaLinkDesc}>{f.desc}</span>
                  </Link>
                ))}
              </div>
              <div className={styles.megaDivider} />
              <div className={styles.megaCol}>
                <div className={styles.megaColTitle}>Soara</div>
                <Link href="/apropos" className={styles.megaLink} onClick={() => setMenuOpen(false)}>À propos</Link>
                <Link href="/contributeurs" className={styles.megaLink} onClick={() => setMenuOpen(false)}>Contributeurs</Link>
                <Link href="/abonnement" className={styles.megaLink} onClick={() => setMenuOpen(false)}>S'abonner</Link>
                <Link href="/mentions" className={styles.megaLink} onClick={() => setMenuOpen(false)}>Mentions légales</Link>
              </div>
            </div>
          </div>
          <div className={styles.megaBackdrop} onClick={() => setMenuOpen(false)} />
        </>
      )}

      {/* ── SEARCH PANEL DESKTOP ── */}
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

      {/* ── MOBILE HEADER (inchangé) ── */}
      <div className={styles.mobileHeader}>
        <div className={styles.headerTop}>
          <span className={styles.date}>{date}</span>
          <div className={styles.logoWrap}>
            <Link href="/" className={styles.logo}>So<em>ara</em></Link>
          </div>
          <div className={styles.actions}>
<button className={styles.moreBtn} onClick={() => setMobilePanelOpen(o => !o)} aria-label="Plus">···</button>
            <button className={styles.searchBtn} onClick={() => { setSearchOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 50) }} aria-label="Rechercher">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            {user === undefined ? <div className={styles.actionsPlaceholder} /> : user ? (
              <Link href="/abonnement" className={styles.btnSubscribe}>S'abonner</Link>
            ) : (
              <Link href="/abonnement" className={styles.btnSubscribe}>S'abonner</Link>
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
      </div>

      {/* Panel mobile */}
      {mobilePanelOpen && (
        <div className={styles.mobilePanelOverlay} onClick={() => setMobilePanelOpen(false)}>
          <div className={styles.mobilePanel} onClick={e => e.stopPropagation()}>
            <div className={styles.mobilePanelHead}>
              <span className={styles.mobilePanelTitle}>Menu</span>
              <button onClick={() => setMobilePanelOpen(false)} className={styles.mobilePanelClose}>✕</button>
            </div>
            <div className={styles.mobilePanelSection}>Rubriques</div>
            <Link href="/geo" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Géopolitique</Link>
            <Link href="/eco" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Économie</Link>
            <Link href="/tech" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Tech</Link>
            <Link href="/env" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Environnement</Link>
            <Link href="/soc" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Société</Link>
            <Link href="/portraits" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Portraits</Link>
            <div className={styles.mobilePanelSection}>Formats</div>
            <Link href="/signal-map" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Signal Map</Link>
            <Link href="/prismetv" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Soara TV</Link>
            <Link href="/entretien/diarra" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Grand Entretien</Link>
            <Link href="/solutions" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Changer le monde</Link>
            <Link href="/retrospective" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Rétrospective</Link>
            <div className={styles.mobilePanelSection}>À propos</div>
            <Link href="/apropos" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>À propos</Link>
            <Link href="/contributeurs" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Contributeurs</Link>
            <Link href="/mentions" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Mentions légales</Link>
          </div>
        </div>
      )}

    </header>
  )
}
