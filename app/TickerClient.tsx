'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

function todayFr() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const tickerItems = [
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Iran frappe Ras Laffan — dommages considérables sur le 1er site GNL mondial au Qatar' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Brent +6% à 114$/baril, gaz naturel +30% — marchés énergétiques en état d\'alerte' },
  { cat: 'Sciences', color: 'var(--sciences)', text: 'CRISPR in vivo — des cellules CAR-T anticancéreuses créées directement dans l\'organisme (Nature, 18 mars 2026)' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Trump menace de détruire South Pars si l\'Iran attaque à nouveau le Qatar' },
  { cat: 'Sciences', color: 'var(--sciences)', text: 'Test sanguin NHS — détection précoce de 50 types de cancers avant tout symptôme, résultats attendus en 2026' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Détroit d\'Ormuz bloqué par l\'Iran — 20% des exportations pétrolières mondiales suspendues' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Macron appelle à un moratoire sur les frappes des infrastructures civiles et énergétiques' },
  { cat: 'Sciences', color: 'var(--sciences)', text: 'Semaine du Cerveau 2026 — 120 villes françaises, neurosciences & plasticité cérébrale' },
  { cat: 'Société', color: 'var(--soc)', text: 'Municipales 2026 — second tour dimanche dans 1 600 communes, Paris-Marseille-Lyon en suspens' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Mojtaba Khamenei, nouveau Guide suprême d\'Iran — Ali Larijani tué dans une frappe israélienne' },
  { cat: 'Économie', color: 'var(--eco)', text: 'BCE — réunion de politique monétaire ce jeudi, décision sur les taux attendue à 14h15' },
]

export default function Ticker() {
  const [date, setDate] = useState('')
  const trackRef = useRef<HTMLDivElement>(null)

  // Date mise à jour à minuit
  useEffect(() => {
    setDate(todayFr())
    const now = new Date()
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const t = setTimeout(() => setDate(todayFr()), msToMidnight)
    return () => clearTimeout(t)
  }, [])

  // Pause sur touch mobile
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const pause = () => track.style.animationPlayState = 'paused'
    const play  = () => track.style.animationPlayState = 'running'
    track.addEventListener('touchstart', pause, { passive: true })
    track.addEventListener('touchend', play, { passive: true })
    return () => {
      track.removeEventListener('touchstart', pause)
      track.removeEventListener('touchend', play)
    }
  }, [])

  return (
    <div className={styles.ticker}>
      <div className={styles.tickerLeft}>
        <span className={styles.livePill}>
          <span className={styles.liveDot}></span>
          LIVE
        </span>
        <span className={styles.tickerDate}>{date}</span>
      </div>

      <div className={styles.tickerWrap}>
        {/* Masques dégradés gauche/droite */}
        <div className={styles.tickerFadeL} aria-hidden="true" />
        <div className={styles.tickerFadeR} aria-hidden="true" />

        <div className={styles.tickerTrack} ref={trackRef}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              {/* Pill catégorie coloré */}
              <span className={styles.tickerPill} style={{ background: item.color }}>
                {item.cat}
              </span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <Link href="/signal" className={styles.tickerSignal}>Signal →</Link>
    </div>
  )
}
