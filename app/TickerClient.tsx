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
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Moyen-Orient — Un avion américain abattu par l'Iran, escalade au 35e jour du conflit" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Détroit d'Ormuz — L'Iran impose un péage de 2 millions de dollars par navire, soit 20 fois le tarif du canal de Panama" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Trump — Promet de frapper l'Iran 'extrêmement durement' encore 2 à 3 semaines, puis de partir" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Macron — Juge 'irréaliste' une intervention militaire pour libérer Ormuz, appelle à négocier avec Téhéran" },
  { cat: 'Espace', color: 'var(--tech)', text: "Artemis II — Décollage réussi, 4 astronautes en orbite autour de la Lune pour la 1re fois depuis 1972" },
  { cat: 'Économie', color: 'var(--eco)', text: "Carburants — Les compagnies pétrolières réalisent 80 millions d'euros de sur-profits par jour selon Greenpeace" },
  { cat: 'Économie', color: 'var(--eco)', text: "Énergie — 800 000 Français ont renoncé à partir à l'étranger cet été à cause de la hausse des prix" },
  { cat: 'France', color: 'var(--soc)', text: "Grenoble — 3 rugbymen condamnés en appel pour viol à des peines allant jusqu'à 14 ans de réclusion" },
  { cat: 'France', color: 'var(--soc)', text: "Saint-Denis — Le nouveau maire appelle à un grand rassemblement citoyen contre le racisme" },
  { cat: 'Semaine Sainte', color: 'var(--culture)', text: "Pâques 2026 — Le pape Léon XIV préside la veillée pascale à Saint-Pierre de Rome ce samedi soir" },
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
