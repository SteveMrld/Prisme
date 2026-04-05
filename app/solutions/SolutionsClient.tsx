'use client'
import { useState, useMemo } from 'react'
import styles from './solutions.module.css'
import { solutions, type Solution } from './data'

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
  "Finance d'impact":    '#2A4A6A',
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
    return solutions.filter((s: Solution) => {
      const matchCat = activeCat === 'Tout' || s.cat === activeCat
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.country.toLowerCase().includes(search.toLowerCase()) ||
        s.rawCat.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCat, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { 'Tout': solutions.length }
    solutions.forEach((s: Solution) => { c[s.cat] = (c[s.cat] || 0) + 1 })
    return c
  }, [])

  return (
    <div className={styles.page}>

      {/* FILTRES */}
      <div className={styles.filtersWrap}>
        <div className={styles.searchBar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className={styles.filters}>
          {CATS.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCat === cat ? styles.active : ''}`}
              style={activeCat === cat ? { background: CAT_COLORS[cat] || '#0A0A0A', borderColor: CAT_COLORS[cat] || '#0A0A0A', color: '#fff' } : {}}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
              <span className={styles.filterCount}>{counts[cat] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* COMPTEUR */}
      <div className={styles.counter}>
        <span className={styles.counterNum}>{filtered.length}</span>
        <span className={styles.counterLabel}>
          {activeCat !== 'Tout' ? activeCat : 'solutions'}
          {search ? ` · "${search}"` : ''}
        </span>
      </div>

      {/* LISTE ÉDITORIALE */}
      <div className={styles.list}>
        {filtered.map((s: Solution, i: number) => (
          <a
            key={i}
            href={s.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
          >
            <div className={styles.itemIndex}>{String(i + 1).padStart(2, '0')}</div>
            <div className={styles.itemBar} style={{ background: CAT_COLORS[s.cat] || '#3A3A3A' }} />
            <div className={styles.itemBody}>
              <div className={styles.itemMeta}>
                <span className={styles.itemCat} style={{ color: CAT_COLORS[s.cat] || '#3A3A3A' }}>{s.cat}</span>
                <span className={styles.itemCountry}>{FLAG[s.country] || ''} {s.country}</span>
              </div>
              <div className={styles.itemName}>{s.name}</div>
              <div className={styles.itemRaw}>{s.rawCat}</div>
            </div>
            <div className={styles.itemArrow}>→</div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>Aucune solution pour cette recherche.</div>
      )}
    </div>
  )
}
