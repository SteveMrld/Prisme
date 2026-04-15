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
const TENSIONS = [
  { name:'Iran–USA',    x:58, y:42, level:'crisis',  color:'#FC8181' },
  { name:'Ukraine',     x:52, y:28, level:'crisis',  color:'#FC8181' },
  { name:'Mer de Chine',x:78, y:42, level:'tension', color:'#F6AD55' },
  { name:'Sahel',       x:48, y:52, level:'tension', color:'#F6AD55' },
  { name:'Taïwan',      x:80, y:40, level:'watch',   color:'#F6E05E' },
  { name:'Arctique',    x:50, y:10, level:'watch',   color:'#F6E05E' },
]

function MiniGlobe() {
  return (
    <div className={styles.globeWrap}>
      <svg viewBox="0 0 100 60" className={styles.globeSvg}>
        {/* Fond monde simplifié */}
        <ellipse cx="50" cy="30" rx="48" ry="28" fill="#0D1F3C" opacity=".6"/>
        {/* Continents stylisés */}
        <path d="M18 20 Q22 15 28 18 Q32 22 30 28 Q24 32 18 28 Z" fill="#1A2A3A"/>
        <path d="M42 18 Q52 14 62 17 Q68 22 65 32 Q58 36 48 33 Q40 28 42 18 Z" fill="#1A2A3A"/>
        <path d="M70 20 Q80 18 84 24 Q82 32 76 34 Q70 30 70 20 Z" fill="#1A2A3A"/>
        <path d="M44 34 Q52 32 56 38 Q52 46 44 44 Z" fill="#1A2A3A"/>
        {/* Points de tension */}
        {TENSIONS.map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={t.y} r="3" fill={t.color} opacity=".2">
              <animate attributeName="r" values="3;5;3" dur={`${1.5 + i*0.3}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".2;.05;.2" dur={`${1.5 + i*0.3}s`} repeatCount="indefinite"/>
            </circle>
            <circle cx={t.x} cy={t.y} r="2" fill={t.color}/>
          </g>
        ))}
      </svg>
      <div className={styles.globeLegend}>
        {TENSIONS.slice(0,3).map(t => (
          <span key={t.name} className={styles.globeLegendItem}>
            <span className={styles.globeDot} style={{background: t.color}}/>
            {t.name}
          </span>
        ))}
      </div>
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
