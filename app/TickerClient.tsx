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
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Détroit d\'Ormuz — Trump annonce avoir négocié le passage de 20 pétroliers, premier déblocage depuis le début du conflit' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Iran — un soldat de l\'ONU tué au Liban, les frappes israélo-américaines continuent sur les infrastructures' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Carburants — opérations escargots des transporteurs routiers sur le périphérique parisien ce lundi matin' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Semi-conducteurs — la production mondiale pénalisée par une pénurie d\'hélium liée à la guerre au Moyen-Orient' },
  { cat: 'France', color: 'var(--soc)', text: 'Municipales 2026 — nouveaux maires installés, primaire de la gauche en difficulté avant la présidentielle 2027' },
  { cat: 'Europe', color: 'var(--geo)', text: 'UE — hubs de retour pour migrants adoptés, vifs débats sur la conformité avec le droit international' },
  { cat: 'France', color: 'var(--soc)', text: 'Violences périscolaires à Paris — 700 parents exigent des sanctions et un audit indépendant à la mairie' },
  { cat: 'Justice', color: 'var(--soc)', text: 'Loge Athanor — procès des crimes commandités par une loge maçonnique s\'ouvre ce lundi devant la justice' },
  { cat: 'Culture', color: 'var(--culture)', text: 'Vol à Florence — trois tableaux de Renoir, Cézanne et Matisse dérobés dans un musée italien' },
  { cat: 'France', color: 'var(--soc)', text: 'Changement d\'heure — passage à l\'heure d\'été ce dimanche, les horloges ont avancé d\'une heure' },
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
