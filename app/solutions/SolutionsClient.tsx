'use client'
import { useState, useMemo } from 'react'
import styles from './solutions.module.css'
import { solutions } from './data'

const CAT_COLORS: Record<string, string> = {
  'Économie circulaire': '#1A3E6B',
  'Eau':                 '#2A5A8A',
  'Océans':              '#0D3A6B',
  'Agriculture':         '#6B4A1A',
  'Biodiversité':        '#4A3A1A',
  'Énergie':             '#B86A1A',
  'Matériaux':           '#5A3A2A',
  'Sciences & Tech':     '#4A2080',
  'Climat':              '#1A4A5A',
  'Santé':               '#7A1A2A',
  'Inclusion':           '#5A1A5A',
  "Finance d'impact":    '#2A4A2A',
  'Mobilité':            '#1A3A5A',
  'Autre':               '#3A3A3A',
}

const CATS = ['Tout', 'Économie circulaire', 'Agriculture', 'Biodiversité', 'Énergie', 'Eau', 'Océans', 'Matériaux', 'Inclusion', "Finance d'impact", 'Climat', 'Mobilité', 'Santé', 'Sciences & Tech']

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
  const [activeCat, setActiveCat] = useState('Tout')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return (solutions as any[]).filter(s => {
      const matchCat = activeCat === 'Tout' || s.cat === activeCat
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.country.toLowerCase().includes(search.toLowerCase()) ||
        s.rawCat.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCat, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { 'Tout': (solutions as any[]).length }
    ;(solutions as any[]).forEach(s => { c[s.cat] = (c[s.cat] || 0) + 1 })
    return c
  }, [])

  return (
    <div className={styles.page}>

      {/* SEARCH */}
      <div className={styles.searchBar}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Rechercher une solution, un pays…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {search && <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        {CATS.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCat === cat ? styles.active : ''}`}
            style={activeCat === cat ? { background: CAT_COLORS[cat] || '#0A0A0A', borderColor: CAT_COLORS[cat] || '#0A0A0A' } : {}}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
            <span className={styles.filterCount}>{counts[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* RESULTS COUNT */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>{filtered.length}</span>
        <span className={styles.resultsLabel}>
          {filtered.length === 1 ? 'solution' : 'solutions'}
          {activeCat !== 'Tout' ? ` · ${activeCat}` : ''}
          {search ? ` · "${search}"` : ''}
        </span>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {filtered.map((s: any, i: number) => (
          <a
            key={i}
            href={s.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
            style={{ '--accent': CAT_COLORS[s.cat] || '#2D7A4F' } as any}
          >
            <div className={styles.cardTop}>
              <span className={styles.cardCat} style={{ color: CAT_COLORS[s.cat] || '#2D7A4F' }}>
                {s.cat}
              </span>
              <span className={styles.cardCountry}>
                {FLAG[s.country] || ''} {s.country}
              </span>
            </div>
            <div className={styles.cardName}>{s.name}</div>
            <div className={styles.cardRaw}>{s.rawCat}</div>
            <div className={styles.cardArrow}>→</div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>Aucune solution trouvée pour cette recherche.</p>
        </div>
      )}
    </div>
  )
}
