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
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Qatar — QatarEnergy déclare force majeure sur l\'ensemble de sa production GNL après de nouvelles frappes iraniennes sur Ras Laffan' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Énergie — Brent à 108$/baril après avoir touché 119$, gaz naturel européen TTF +40% depuis le début du conflit' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Iran–Israël — Netanyahu : « la guerre finira plus tôt que les gens ne le pensent » — Détroit d\'Ormuz partiellement rouvert' },
  { cat: 'Afrique', color: 'var(--geo)', text: 'Sahel — l\'Alliance des États du Sahel représente désormais plus de 50% des morts du terrorisme mondial selon l\'IEP' },
  { cat: 'Afrique', color: 'var(--geo)', text: 'Tchad — un drone d\'origine soudanaise abattu près de N\'Djamena, la guerre civile soudanaise déborde aux frontières' },
  { cat: 'Société', color: 'var(--soc)', text: 'France — Aïd el-Fitr ce vendredi 20 mars, fin du Ramadan 2026 confirmée par la Grande Mosquée de Paris' },
  { cat: 'Afrique', color: 'var(--geo)', text: 'Cotonou — sommet militaire trilatéral France–Côte d\'Ivoire–Bénin sur la lutte contre le jihadisme sahélien' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Golfe — Koweït : deux raffineries frappées par des missiles iraniens, Abu Dhabi ferme Habshan après des débris interceptés' },
  { cat: 'Économie', color: 'var(--eco)', text: 'LNG — 17% de la capacité d\'exportation qatarie hors ligne pour 3 à 5 ans, Europe et Asie en alerte sur les approvisionnements' },
  { cat: 'Société', color: 'var(--soc)', text: 'France — Municipales 2026 : tractations de dernière minute avant le dépôt des listes du second tour' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Francophonie — 20 mars, Journée internationale sous le signe « jeunesse et paix » dans 88 États membres' },
  { cat: 'Afrique', color: 'var(--geo)', text: 'Sénégal — score ITIE de 89/100, premier rang mondial en transparence dans la gestion des ressources extractives' },
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
