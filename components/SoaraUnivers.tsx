'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './SoaraUnivers.module.css'

// ── Indicateurs mini (données live) ──────────────────────
const BASE_IND = [
  { id:'brent',  label:'Brent',    value:121.88, unit:'$', delta:+0.42, color:'#C4793A' },
  { id:'gold',   label:'Or',       value:3248,   unit:'$', delta:+27,   color:'#C8A96E' },
  { id:'eurusd', label:'EUR/USD',  value:1.0821, unit:'',  delta:-0.003,color:'#4dd9ac' },
  { id:'usdcny', label:'USD/CNY',  value:7.2841, unit:'',  delta:+0.008,color:'#1A7ABF' },
]

function MiniIndicateurs() {
  const [inds, setInds] = useState(BASE_IND)
  const [tick, setTick] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setInds(prev => prev.map(ind => ({
        ...ind,
        value: ind.value * (1 + (Math.random() - 0.5) * 0.0003),
        delta: ind.delta * (0.95 + Math.random() * 0.1),
      })))
      setTick(t => !t)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const fmt = (v: number, unit: string) => {
    if (unit === '$' && v > 100) return `${unit}${v.toFixed(2)}`
    if (unit === '$') return `${unit}${v.toFixed(3)}`
    return v.toFixed(4)
  }

  return (
    <div className={styles.indGrid}>
      {inds.map(ind => (
        <div key={ind.id} className={styles.indCard}>
          <div className={styles.indLabel}>{ind.label}</div>
          <div className={`${styles.indValue} ${tick ? styles.indPulse : ''}`} style={{color: ind.color}}>
            {fmt(ind.value, ind.unit)}
          </div>
          <div className={`${styles.indDelta} ${ind.delta >= 0 ? styles.up : styles.down}`}>
            {ind.delta >= 0 ? '▲' : '▼'} {Math.abs(ind.delta).toFixed(ind.value > 100 ? 2 : 4)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Tensions mini (points qui pulsent) ───────────────────
function MiniGlobe() {
  return (
    <div className={styles.globeWrap}>
      <iframe
        src="/signal-map"
        className={styles.globeIframe}
        scrolling="no"
        title="Signal Map"
      />
      <div className={styles.globeOverlay} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────
export default function SoaraUnivers() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Soara · Outils</div>
        <h2 className={styles.title}>L'univers <em>Soara</em></h2>
        <p className={styles.subtitle}>Données, cartes, analyses — des instruments pour comprendre le monde en temps réel.</p>
      </div>

      <div className={styles.grid}>

        {/* SIGNAL MAP */}
        <Link href="/signal-map" className={styles.card}>
          <div className={styles.cardVisual}>
            <MiniGlobe />
          </div>
          <div className={styles.cardBody}>
            <span className={styles.cardLabel}>Signal Map</span>
            <h3 className={styles.cardTitle}>Les zones de tension en temps réel</h3>
            <p className={styles.cardDesc}>Globe interactif · 12 zones · Mises à jour continues</p>
            <span className={styles.cardCta}>Ouvrir la carte →</span>
          </div>
        </Link>

        {/* INDICATEURS */}
        <Link href="/indicateurs" className={styles.card}>
          <div className={styles.cardVisual}>
            <MiniIndicateurs />
          </div>
          <div className={styles.cardBody}>
            <span className={styles.cardLabel}>Indicateurs</span>
            <h3 className={styles.cardTitle}>Les marchés qui font la géopolitique</h3>
            <p className={styles.cardDesc}>Pétrole, Or, Devises — données live</p>
            <span className={styles.cardCta}>Voir tous les indicateurs →</span>
          </div>
        </Link>

        {/* ATLAS */}
        <Link href="/visuels" className={`${styles.card} ${styles.cardWide}`}>
          <div className={styles.cardVisual}>
            <div className={styles.atlasPreview}>
              <div className={styles.atlasLine}><span className={styles.atlasNum}>I</span><span className={styles.atlasTitle}>La naissance d'un empire</span><span className={styles.atlasTag}>Dollar</span></div>
              <div className={styles.atlasLine}><span className={styles.atlasNum}>II</span><span className={styles.atlasTitle}>Les routes de la soie</span><span className={styles.atlasTag}>Chine</span></div>
              <div className={styles.atlasLine}><span className={styles.atlasNum}>III</span><span className={styles.atlasTitle}>L'arc de crise</span><span className={styles.atlasTag}>Géopolitique</span></div>
              <div className={styles.atlasDeco}>
                <div className={styles.atlasBar} style={{width:'80%', background:'#C8A96E'}}/>
                <div className={styles.atlasBar} style={{width:'60%', background:'#1A7ABF'}}/>
                <div className={styles.atlasBar} style={{width:'45%', background:'#FC8181'}}/>
              </div>
            </div>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.cardLabel}>Atlas</span>
            <h3 className={styles.cardTitle}>Cartes et visualisations animées</h3>
            <p className={styles.cardDesc}>Géopolitique, économie — présentées autrement</p>
            <span className={styles.cardCta}>Explorer l'Atlas →</span>
          </div>
        </Link>

      </div>
    </section>
  )
}
