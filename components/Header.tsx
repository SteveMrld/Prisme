'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import articlesData from '../lib/articles.json'
import visuels from '../lib/visuels'
import { createClient } from '../lib/supabase'
import styles from './Header.module.css'

const RECENT_KEY = 'soara_recent_searches'
const RECENT_MAX = 5

type SearchHit = {
  href: string
  title: string
  description: string
  category: string
}
type SearchBuckets = { articles: SearchHit[]; grandsFormats: SearchHit[]; atlas: SearchHit[] }

const stripTags = (s: string) => (s || '').replace(/<[^>]+>/g, '')

function Highlight({ text, query }: { text: string; query: string }) {
  const safe = stripTags(text)
  const q = query.trim()
  if (!q) return <>{safe}</>
  const lower = safe.toLowerCase()
  const qLower = q.toLowerCase()
  const parts: React.ReactNode[] = []
  let cursor = 0
  while (cursor < safe.length) {
    const idx = lower.indexOf(qLower, cursor)
    if (idx === -1) { parts.push(safe.slice(cursor)); break }
    if (idx > cursor) parts.push(safe.slice(cursor, idx))
    parts.push(<strong key={idx}>{safe.slice(idx, idx + q.length)}</strong>)
    cursor = idx + q.length
  }
  return <>{parts}</>
}

const rubriques = [
  { label: 'Géopolitique', href: '/geo' },
  { label: 'Économie', href: '/eco' },
  { label: 'Tech', href: '/tech' },
  { label: 'Environnement', href: '/env' },
  { label: 'Société', href: '/soc' },
  { label: 'Culture', href: '/culture' },
  { label: 'Portraits', href: '/portraits' },
  { label: 'Indicateurs', href: '/indicateurs' },
]

const formats = [
  { label: 'Soara TV', href: '/tv', desc: 'Analyses en mouvement' },
  { label: 'Signal Map', href: '/signal-map', desc: 'Carte des tensions en temps réel' },
  { label: 'Grand Entretien', href: '/entretien/diarra', desc: 'Cheick Modibo Diarra · À venir' },
  { label: 'Recoupement', href: '/recoupement', desc: 'Vérification par IA' },
  { label: 'Changer le monde', href: '/solutions', desc: '157 solutions ChangeNow 2026' },
  { label: 'Rétrospective', href: '/retrospective', desc: "Les ruptures de 2025" },
  { label: 'Atlas', href: '/visuels', desc: 'Cartes & visualisations' },
]

const navItems = [
  { label: 'Signal', href: '/signal', className: 'signal' },
  { label: 'Géopolitique', href: '/geo', className: 'geo' },
  { label: 'Économie', href: '/eco', className: 'eco' },
  { label: 'Tech', href: '/tech', className: 'tech' },
  { label: 'Environnement', href: '/env', className: 'env' },
  { label: 'Société', href: '/soc', className: 'soc' },
  { label: 'Culture', href: '/culture', className: 'culture' },
  { label: 'Portraits', href: '/portraits', className: 'portrait' },
  { label: 'Indicateurs', href: '/indicateurs', className: 'eco' },
  { label: 'Grands formats', href: '/grands-formats', className: 'concept' },
  { label: 'Atlas', href: '/visuels', className: 'concept' },
  { label: 'Rétrospective', href: '/retrospective', className: 'concept' },
  { label: 'Solutions', href: '/solutions', className: 'env' },
]

export default function Header({ activeNav }: { activeNav?: string }) {
  const [date, setDate] = useState('')
  const [user, setUser] = useState<any>(undefined)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchBuckets>({ articles: [], grandsFormats: [], atlas: [] })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Index plat pre-calcule au mount, pour ne pas re-mapper a chaque keystroke
  const searchIndex = useMemo<SearchBuckets>(() => {
    const articles: SearchHit[] = []
    const grandsFormats: SearchHit[] = []
    for (const a of (articlesData as any[])) {
      const hit: SearchHit = {
        href: a.grandFormat ? `/grands-formats/${a.slug}` : `/articles/${a.slug}`,
        title: a.title || '',
        description: a.description || '',
        category: a.categoryLabel || a.category || '',
      }
      if (a.grandFormat) grandsFormats.push(hit)
      else articles.push(hit)
    }
    const atlas: SearchHit[] = visuels.map(v => ({
      href: v.href,
      title: v.title,
      description: v.description,
      category: v.eyebrow,
    }))
    return { articles, grandsFormats, atlas }
  }, [])

  useEffect(() => {
    const d = new Date()
    setDate(d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Charge les recherches recentes au mount (cote client uniquement)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setRecentSearches(parsed.filter(s => typeof s === 'string').slice(0, RECENT_MAX))
      }
    } catch {}
  }, [])

  // Echap : ferme menus + blur input. "/" : ouvre search et focus, sauf si
  // l'utilisateur tape deja dans un input / textarea / contenteditable.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
        inputRef.current?.blur()
        return
      }
      if (e.key === '/') {
        const t = e.target as HTMLElement | null
        const tag = t?.tagName
        const isField = tag === 'INPUT' || tag === 'TEXTAREA' || (t?.isContentEditable ?? false)
        if (isField) return
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const matchesQuery = (hit: SearchHit, q: string) => {
    const needle = q.toLowerCase()
    return (
      hit.title.toLowerCase().includes(needle) ||
      hit.description.toLowerCase().includes(needle) ||
      hit.category.toLowerCase().includes(needle)
    )
  }

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    if (q.trim().length < 2) {
      setSearchResults({ articles: [], grandsFormats: [], atlas: [] })
      return
    }
    setSearchResults({
      articles: searchIndex.articles.filter(h => matchesQuery(h, q)).slice(0, 5),
      grandsFormats: searchIndex.grandsFormats.filter(h => matchesQuery(h, q)).slice(0, 4),
      atlas: searchIndex.atlas.filter(h => matchesQuery(h, q)).slice(0, 4),
    })
  }

  const totalResults = searchResults.articles.length + searchResults.grandsFormats.length + searchResults.atlas.length

  const firstResultHref = (): string | null => {
    return (
      searchResults.articles[0]?.href ||
      searchResults.grandsFormats[0]?.href ||
      searchResults.atlas[0]?.href ||
      null
    )
  }

  const pushRecent = (q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) return
    const updated = [trimmed, ...recentSearches.filter(r => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, RECENT_MAX)
    setRecentSearches(updated)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)) } catch {}
  }

  const clearRecent = () => {
    setRecentSearches([])
    try { localStorage.removeItem(RECENT_KEY) } catch {}
  }

  const submitRecent = (q: string) => {
    setSearchQuery(q)
    handleSearch(q)
    pushRecent(q)
    inputRef.current?.focus()
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchResults({ articles: [], grandsFormats: [], atlas: [] })
  }

  return (
    <header className={styles.header}>

      {/* ── DESKTOP HEADER ── */}
      <div className={styles.desktopHeader}>
        <div className={styles.desktopHeaderTop}>
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
                <Link href="/lectures" className={styles.megaLink} onClick={() => setMenuOpen(false)}>Mes lectures</Link>
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
                if (e.key === 'Enter') {
                  const target = firstResultHref()
                  if (target) {
                    pushRecent(searchQuery)
                    router.push(target)
                    closeSearch()
                  }
                }
              }}
            />
            {!searchQuery && <span className={styles.searchHint} aria-hidden>esc</span>}
            <button className={styles.searchClose} onClick={closeSearch} aria-label="Fermer">✕</button>
          </div>

          {/* Recherches recentes : visibles uniquement quand la query est vide */}
          {searchQuery.trim().length < 2 && recentSearches.length > 0 && (
            <div className={styles.searchRecent}>
              <div className={styles.searchRecentHead}>
                <span className={styles.searchRecentLabel}>Recherches récentes</span>
                <button className={styles.searchRecentClear} onClick={clearRecent}>Effacer</button>
              </div>
              {recentSearches.map(q => (
                <button key={q} className={styles.searchRecentItem} onClick={() => submitRecent(q)}>
                  <span>{q}</span>
                  <span className={styles.searchRecentArrow}>↗</span>
                </button>
              ))}
            </div>
          )}

          {/* Resultats categorises */}
          {totalResults > 0 && (
            <>
              {searchResults.articles.length > 0 && (
                <div className={styles.searchSection}>
                  <div className={styles.searchSectionLabel}>
                    <span>Articles</span>
                    <span className={styles.searchSectionCount}>{searchResults.articles.length}</span>
                  </div>
                  {searchResults.articles.map(hit => (
                    <Link key={hit.href} href={hit.href}
                      className={styles.searchResultItem}
                      onClick={() => { pushRecent(searchQuery); closeSearch() }}>
                      <span className={styles.searchResultCat}>{hit.category}</span>
                      <span>
                        <span className={styles.searchResultTitle}>
                          <Highlight text={hit.title} query={searchQuery} />
                        </span>
                        {hit.description && (
                          <span className={styles.searchResultDesc}>
                            <Highlight text={hit.description} query={searchQuery} />
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.grandsFormats.length > 0 && (
                <div className={styles.searchSection}>
                  <div className={styles.searchSectionLabel}>
                    <span>Grands formats</span>
                    <span className={styles.searchSectionCount}>{searchResults.grandsFormats.length}</span>
                  </div>
                  {searchResults.grandsFormats.map(hit => (
                    <Link key={hit.href} href={hit.href}
                      className={styles.searchResultItem}
                      onClick={() => { pushRecent(searchQuery); closeSearch() }}>
                      <span className={styles.searchResultCat}>{hit.category}</span>
                      <span>
                        <span className={styles.searchResultTitle}>
                          <Highlight text={hit.title} query={searchQuery} />
                        </span>
                        {hit.description && (
                          <span className={styles.searchResultDesc}>
                            <Highlight text={hit.description} query={searchQuery} />
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.atlas.length > 0 && (
                <div className={styles.searchSection}>
                  <div className={styles.searchSectionLabel}>
                    <span>Atlas</span>
                    <span className={styles.searchSectionCount}>{searchResults.atlas.length}</span>
                  </div>
                  {searchResults.atlas.map(hit => (
                    <Link key={hit.href} href={hit.href}
                      className={styles.searchResultItem}
                      onClick={() => { pushRecent(searchQuery); closeSearch() }}>
                      <span className={styles.searchResultCat}>{hit.category}</span>
                      <span>
                        <span className={styles.searchResultTitle}>
                          <Highlight text={hit.title} query={searchQuery} />
                        </span>
                        {hit.description && (
                          <span className={styles.searchResultDesc}>
                            <Highlight text={hit.description} query={searchQuery} />
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {searchQuery.length >= 2 && totalResults === 0 && (
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
<button className={styles.moreBtn} onClick={() => setMobilePanelOpen(o => !o)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="21" y1="6" x2="9" y2="6"/><circle cx="5" cy="6" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="21" y1="12" x2="9" y2="12"/><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="21" y1="18" x2="9" y2="18"/><circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none"/>
          </svg>
        </button>
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
            <Link href="/tv" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Soara TV</Link>
            <Link href="/entretien/diarra" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Grand Entretien</Link>
            <Link href="/solutions" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Changer le monde</Link>
            <Link href="/retrospective" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Rétrospective</Link>
            <Link href="/visuels" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Atlas</Link>
            <div className={styles.mobilePanelSection}>À propos</div>
            <Link href="/lectures" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Mes lectures</Link>
            <Link href="/apropos" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>À propos</Link>
            <Link href="/contributeurs" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Contributeurs</Link>
            <Link href="/mentions" className={styles.mobilePanelLink} onClick={() => setMobilePanelOpen(false)}>Mentions légales</Link>
          </div>
        </div>
      )}

    </header>
  )
}
