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
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Iran–États-Unis — La délégation iranienne arrive au Pakistan pour les négociations de paix, première rencontre directe depuis le début du conflit" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Moyen-Orient — Trêve au Liban, déblocage partiel du détroit d'Ormuz : les points de négociation entre Téhéran et Washington" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Liban — La présidence annonce des discussions avec Israël mardi à Washington, Netanyahou sous pression sur le cessez-le-feu" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Iran — Enrichissement d'uranium au cœur des négociations au Pakistan, Trump maintient sa pression sur Téhéran" },
  { cat: 'Espace', color: 'var(--tech)', text: "Artemis II — L'équipage devient les humains les plus éloignés de la Terre de toute l'histoire, à plus de 406 000 km" },
  { cat: 'Économie', color: 'var(--eco)', text: "Carburants — 12% des stations-essence françaises en rupture partielle, les prix continuent de peser sur le pouvoir d'achat" },
  { cat: 'Tech', color: 'var(--tech)', text: "Terafab — La méga-usine de semi-conducteurs annoncée par Musk s'inscrit dans un écosystème Tesla-SpaceX-xAI visant la souveraineté spatiale américaine" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Soudan — L'ONU documente plus de 1000 civils tués dans le camp de Zamzam, la pire crise humanitaire mondiale se poursuit" },
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
