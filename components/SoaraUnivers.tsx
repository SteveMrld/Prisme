'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './SoaraUnivers.module.css'

// ── Indicateurs live ──────────────────────────────────────
const BASE_IND = [
  { id:'brent',  label:'Pétrole Brent', value:121.88, unit:'$',  delta:+0.42, color:'#E8A056' },
  { id:'gold',   label:'Or',            value:3248,   unit:'$',  delta:+27,   color:'#C8A96E' },
  { id:'eurusd', label:'EUR / USD',     value:1.0821, unit:'',   delta:-0.003,color:'#4dd9ac' },
  { id:'usdcny', label:'USD / CNY',     value:7.2841, unit:'',   delta:+0.008,color:'#6AB0E8' },
]

function LiveIndicateurs() {
  const [inds, setInds] = useState(BASE_IND)
  const [flash, setFlash] = useState<string|null>(null)

  useEffect(() => {
    const t = setInterval(() => {
      const idx = Math.floor(Math.random() * BASE_IND.length)
      setInds(prev => prev.map((ind, i) => i !== idx ? ind : {
        ...ind,
        value: ind.value * (1 + (Math.random() - 0.5) * 0.0004),
        delta: ind.delta * (0.92 + Math.random() * 0.16),
      }))
      setFlash(BASE_IND[idx].id)
      setTimeout(() => setFlash(null), 400)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  const fmt = (v: number) => v > 100 ? v.toFixed(2) : v.toFixed(4)

  return (
    <div className={styles.indGrid}>
      {inds.map(ind => (
        <div key={ind.id} className={`${styles.indCell} ${flash === ind.id ? styles.indFlash : ''}`}>
          <div className={styles.indLabel}>{ind.label}</div>
          <div className={styles.indVal} style={{color: ind.color}}>
            {ind.unit}{fmt(ind.value)}
          </div>
          <div className={`${styles.indDelta} ${ind.delta >= 0 ? styles.up : styles.down}`}>
            {ind.delta >= 0 ? '▲' : '▼'} {Math.abs(ind.delta).toFixed(ind.value > 100 ? 2 : 4)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Tensions éditoriales (pas de globe simulé) ────────────
const ZONES = [
  { name:'Iran — États-Unis',   status:'Crise active',    color:'#FC8181', dot:'#FC8181' },
  { name:'Ukraine — Russie',    status:'Conflit ouvert',  color:'#FC8181', dot:'#FC8181' },
  { name:'Mer de Chine',        status:'Tension élevée',  color:'#F6AD55', dot:'#F6AD55' },
  { name:'Sahel',               status:'Déstabilisation', color:'#F6AD55', dot:'#F6AD55' },
  { name:'Détroit d\'Ormuz',    status:'Surveillance',    color:'#F6E05E', dot:'#F6E05E' },
]

// ── Component ─────────────────────────────────────────────
export default function SoaraUnivers() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Soara · Outils</div>
        <h2 className={styles.title}>L'univers <em>Soara</em></h2>
        <p className={styles.subtitle}>Des instruments vivants pour lire le monde autrement.</p>
      </div>

      <div className={styles.grid}>

        {/* ── SIGNAL MAP ── carte rouge, liste éditoriale */}
        <Link href="/signal-map" className={`${styles.card} ${styles.cardSignal}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardEyebrow} style={{color:'#FC8181'}}>Signal Map</span>
            <span className={styles.liveTag}><span className={styles.liveDot}/>LIVE</span>
          </div>
          <h3 className={styles.cardTitle}>Zones de tension</h3>
          <div className={styles.zoneList}>
            {ZONES.map(z => (
              <div key={z.name} className={styles.zoneItem}>
                <span className={styles.zoneDot} style={{background: z.dot}}/>
                <span className={styles.zoneName}>{z.name}</span>
                <span className={styles.zoneStatus} style={{color: z.color}}>{z.status}</span>
              </div>
            ))}
          </div>
          <span className={styles.cardCta}>Ouvrir le globe →</span>
        </Link>

        {/* ── INDICATEURS ── carte dorée, chiffres pulsants */}
        <Link href="/indicateurs" className={`${styles.card} ${styles.cardInd}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardEyebrow} style={{color:'#C8A96E'}}>Indicateurs</span>
            <span className={styles.updateTag}>↻ temps réel</span>
          </div>
          <h3 className={styles.cardTitle}>Marchés & géopolitique</h3>
          <LiveIndicateurs />
          <span className={styles.cardCta}>Tous les indicateurs →</span>
        </Link>

        {/* ── ATLAS ── carte bleue, liste chapitres */}
        <Link href="/visuels" className={`${styles.card} ${styles.cardAtlas}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardEyebrow} style={{color:'#6AB0E8'}}>Atlas</span>
          </div>
          <h3 className={styles.cardTitle}>Visualisations animées</h3>
          <div className={styles.atlasList}>
            {[
              {n:'I',   t:'La naissance d\'un empire',   tag:'Dollar'},
              {n:'II',  t:'Les routes de la soie',        tag:'Chine'},
              {n:'III', t:'L\'arc de crise',              tag:'Géopolitique'},
            ].map(c => (
              <div key={c.n} className={styles.atlasItem}>
                <span className={styles.atlasN} style={{color:'#6AB0E8'}}>{c.n}</span>
                <span className={styles.atlasT}>{c.t}</span>
                <span className={styles.atlasTag}>{c.tag}</span>
              </div>
            ))}
          </div>
          <span className={styles.cardCta}>Explorer l'Atlas →</span>
        </Link>

      </div>
    </section>
  )
}
