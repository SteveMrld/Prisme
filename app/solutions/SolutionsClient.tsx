'use client'
import { useState, useMemo } from 'react'
import styles from './solutions.module.css'
import { solutions, type Solution } from './data'

const CATS_CONFIG = [
  { key: 'Économie circulaire', emoji: '♻️', color: '#1A3E6B', bg: '#EEF3FA' },
  { key: 'Agriculture',         emoji: '🌾', color: '#6B4A1A', bg: '#FAF3EE' },
  { key: 'Biodiversité',        emoji: '🌿', color: '#2A5A2A', bg: '#F0F7F0' },
  { key: 'Énergie',             emoji: '⚡', color: '#B86A1A', bg: '#FDF5EE' },
  { key: 'Eau',                 emoji: '💧', color: '#1A4A7A', bg: '#EEF3FB' },
  { key: 'Océans',              emoji: '🌊', color: '#0D3A6B', bg: '#EEF2FA' },
  { key: 'Matériaux',           emoji: '🧱', color: '#5A3A2A', bg: '#F7F3F0' },
  { key: 'Inclusion',           emoji: '🤝', color: '#5A1A5A', bg: '#F7EEF7' },
  { key: "Finance d'impact",    emoji: '📊', color: '#1A3A5A', bg: '#EEF2F7' },
  { key: 'Climat',              emoji: '🌍', color: '#1A4A5A', bg: '#EEF5F5' },
  { key: 'Mobilité',            emoji: '🚀', color: '#1A3A5A', bg: '#EEF2FA' },
  { key: 'Santé',               emoji: '❤️', color: '#7A1A2A', bg: '#FAEEf0' },
  { key: 'Sciences & Tech',     emoji: '🔬', color: '#4A2080', bg: '#F3EEF7' },
  { key: 'Autre',               emoji: '✨', color: '#3A3A3A', bg: '#F5F5F5' },
]

const FLAG: Record<string, string> = {
  'France': '🇫🇷', 'Netherlands': '🇳🇱', 'Ukraine': '🇺🇦', 'United Kingdom': '🇬🇧',
  'United States': '🇺🇸', 'Germany': '🇩🇪', 'Belgium': '🇧🇪', 'Switzerland': '🇨🇭',
  'Kenya': '🇰🇪', 'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Denmark': '🇩🇰',
  'India': '🇮🇳', 'Israel': '🇮🇱', 'Luxembourg': '🇱🇺', 'Cameroon': '🇨🇲',
  'Ghana': '🇬🇭', 'Finland': '🇫🇮', 'Italy': '🇮🇹', 'Japan': '🇯🇵',
  'Norway': '🇳🇴', 'Poland': '🇵🇱', 'Singapore': '🇸🇬', 'Slovenia': '🇸🇮',
  'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Sweden': '🇸🇪',
  'Dominican Republic': '🇩🇴', 'Mauritania': '🇲🇷', 'Saudi Arabia': '🇸🇦',
}

export default function SolutionsClient() {
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    const filtered = solutions.filter((s: Solution) => {
      const matchCat = !activeCat || s.cat === activeCat
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.country.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
    const groups: Record<string, Solution[]> = {}
    filtered.forEach((s: Solution) => {
      if (!groups[s.cat]) groups[s.cat] = []
      groups[s.cat].push(s)
    })
    return groups
  }, [activeCat, search])

  const totalFiltered = Object.values(grouped).flat().length

  return (
    <div className={styles.page}>

      {/* BARRE STICKY */}
      <div className={styles.stickyBar}>
        <div className={styles.searchWrap}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher une solution, un pays…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className={styles.catTabs}>
          <button
            className={`${styles.catTab} ${!activeCat ? styles.catTabActive : ''}`}
            onClick={() => setActiveCat(null)}
          >
            Tout · {solutions.length}
          </button>
          {CATS_CONFIG.filter(c => solutions.some(s => s.cat === c.key)).map(c => (
            <button
              key={c.key}
              className={`${styles.catTab} ${activeCat === c.key ? styles.catTabActive : ''}`}
              style={activeCat === c.key ? { background: c.color, color: '#fff', borderColor: c.color } : {}}
              onClick={() => setActiveCat(activeCat === c.key ? null : c.key)}
            >
              {c.emoji} {c.key.split(' ')[0]} · {solutions.filter(s => s.cat === c.key).length}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className={styles.content}>
        {totalFiltered === 0 && (
          <div className={styles.empty}>Aucun résultat.</div>
        )}

        {CATS_CONFIG.filter(c => grouped[c.key]?.length > 0).map(catConf => {
          const items = grouped[catConf.key]
          return (
            <section key={catConf.key} className={styles.catSection}>
              {/* HEADER CATÉGORIE */}
              <div className={styles.catHeader} style={{ borderLeftColor: catConf.color }}>
                <span className={styles.catEmoji}>{catConf.emoji}</span>
                <div>
                  <h2 className={styles.catTitle} style={{ color: catConf.color }}>{catConf.key}</h2>
                  <span className={styles.catCount}>{items.length} solution{items.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* GRILLE CARDS */}
              <div className={styles.cardsGrid}>
                {items.map((s: Solution, i: number) => (
                  <a
                    key={i}
                    href={s.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.card}
                    style={{
                      '--cat-color': catConf.color,
                      '--cat-bg': catConf.bg,
                    } as any}
                  >
                    <div className={styles.cardInner}>
                      <div className={styles.cardCountry}>
                        {FLAG[s.country] || ''} {s.country}
                      </div>
                      <div className={styles.cardName}>{s.name}</div>
                      <div className={styles.cardSub}>{s.rawCat}</div>
                      <div className={styles.cardLink}>
                        Voir le projet →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
