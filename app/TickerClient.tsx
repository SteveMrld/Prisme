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
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Moyen-Orient — Trump propose un plan de paix, l\'Iran tire des missiles vers Israël, Bahreïn et le Koweït' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Iran–USA — Téhéran en position de force, pas prêt à céder malgré les menaces, selon l\'ancien conseiller Malley' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Liban — la France s\'oppose à l\'occupation du sud par Israël' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Carburants — prix à la pompe en hausse, le gouvernement refuse toute aide, tensions sociales croissantes' },
  { cat: 'Tech', color: 'var(--tech)', text: 'OpenAI ferme Sora, son application de vidéos générées par IA' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Bridor — le champion français discret devient leader mondial de la boulangerie industrielle surgelée' },
  { cat: 'Société', color: 'var(--soc)', text: 'Municipales 2026 — second tour, maires sortants hués, alliance gauche-droite à Strasbourg, Marseille sous tension' },
  { cat: 'France', color: 'var(--soc)', text: 'Mort de Lionel Jospin — l\'ancien Premier ministre et père des 35 heures s\'est éteint' },
  { cat: 'Afrique', color: 'var(--geo)', text: 'Sahel — le Sahel représente plus de 50% des morts du terrorisme mondial selon le Global Terrorism Index 2026' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Ingérence électorale — une société israélienne aurait ciblé trois candidats LFI aux municipales selon Le Canard Enchaîné' },
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
