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

        {/* ── ATLAS ── carte bleue, chapitres animés */}
        <Link href="/visuels" className={`${styles.card} ${styles.cardSignal}`} style={{borderColor:'rgba(106,176,232,.15)'}}>
          <div className={styles.cardTop}>
            <span className={styles.cardEyebrow} style={{color:'#6AB0E8'}}>Atlas · Dollar</span>
          </div>
          <h3 className={styles.cardTitle}>La naissance d'un empire</h3>
          <div className={styles.zoneList}>
            {[
              {n:'I',   t:'La naissance d\'un empire', sub:'De Bretton Woods au pétrodollar', color:'#C8A96E'},
              {n:'II',  t:'L\'arme financière',         sub:'SWIFT, sanctions, gel d\'avoirs', color:'#6AB0E8'},
              {n:'III', t:'Le crépuscule ?',            sub:'Dédollarisation, BRICS, yuan',   color:'#4dd9ac'},
            ].map(c => (
              <div key={c.n} className={styles.zoneItem}>
                <span className={styles.zoneDot} style={{background: c.color, borderRadius:0, width:'8px', height:'2px'}}/>
                <span className={styles.zoneName}>{c.n} · {c.t}</span>
                <span className={styles.zoneStatus} style={{color: c.color}}>{c.sub}</span>
              </div>
            ))}
          </div>
          <span className={styles.cardCta}>Explorer l'Atlas →</span>
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

        {/* ── SIGNAL MAP ── pleine largeur, tensions live */}
        <Link href="/signal-map" className={`${styles.card} ${styles.cardAtlas}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardEyebrow} style={{color:'#FC8181'}}>Signal Map</span>
            <span className={styles.liveTag}><span className={styles.liveDot}/>LIVE</span>
          </div>
          <h3 className={styles.cardTitle}>Les zones de tension du monde en temps réel</h3>
          <div className={styles.atlasList}>
            {[
              {n:'🔴', t:'Iran — États-Unis',    tag:'Crise active'},
              {n:'🔴', t:'Ukraine — Russie',     tag:'Conflit ouvert'},
              {n:'🟡', t:'Mer de Chine',         tag:'Tension élevée'},
            ].map(c => (
              <div key={c.n} className={styles.atlasItem}>
                <span className={styles.atlasN}>{c.n}</span>
                <span className={styles.atlasT}>{c.t}</span>
                <span className={styles.atlasTag}>{c.tag}</span>
              </div>
            ))}
          </div>
          <span className={styles.cardCta}>Ouvrir le globe interactif →</span>
        </Link>

      </div>
    </section>
  )
}
