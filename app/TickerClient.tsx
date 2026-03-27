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
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Iran–USA — Trump reporte son ultimatum, Téhéran juge la proposition américaine "à sens unique et injuste"' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Détroit d\'Ormuz — Israël élimine le commandant de la marine des Gardiens de la Révolution, responsable du blocage' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Moyen-Orient — manifestations pour le cessez-le-feu dans toute la France ce samedi 28 mars' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Carburants — le gouvernement annonce des aides pour les "gros rouleurs" face à la hausse des prix' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Bourses européennes — rebond attendu à l\'ouverture après le report de l\'ultimatum américain à l\'Iran' },
  { cat: 'France', color: 'var(--soc)', text: 'Jospin — hommage national aux Invalides jeudi, obsèques au cimetière du Montparnasse, Macron préside la cérémonie' },
  { cat: 'Europe', color: 'var(--geo)', text: 'UE — le Parlement européen valide la création de "hubs de retour" pour les migrants hors de l\'Union' },
  { cat: 'France', color: 'var(--soc)', text: 'Présidentielle 2027 — François Fillon définitivement écarté, sa condamnation scelle son avenir politique jusqu\'en 2030' },
  { cat: 'France', color: 'var(--soc)', text: 'Primaire de la gauche — mal engagée après les municipales, Faure et Tondelier sortent affaiblis du second tour' },
  { cat: 'Société', color: 'var(--soc)', text: 'Loana — la première star de la téléréalité française retrouvée morte à Nice, décès accidentel selon le parquet' },
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
