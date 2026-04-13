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
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Iran–États-Unis — Blocus naval américain des ports iraniens en vigueur depuis ce matin, Trump menace d'éliminer tout navire iranien" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Détroit d'Ormuz — Pétrole dépasse les $100 le baril, 20% du pétrole mondial bloqué par la crise Iran-USA" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Iran — Négociations d'Islamabad échouées après 21 heures de pourparlers, Vance quitte le Pakistan sans accord" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Ukraine — Russie viole le cessez-le-feu de Pâques 2 299 fois, 4 civils tués et 35 blessés malgré la trêve" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Hongrie — Orban battu après 16 ans au pouvoir, Peter Magyar remporte une victoire historique avec un taux de participation record" },
  { cat: 'Économie', color: 'var(--eco)', text: "Carburants — 12% des stations-essence françaises en rupture partielle, la crise d'Ormuz aggrave la situation" },
  { cat: 'Géopolitique', color: 'var(--geo)', text: "Liban — 2 055 morts depuis le début du conflit, le Royaume-Uni appelle à inclure Beyrouth dans le cessez-le-feu Iran-USA" },
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
