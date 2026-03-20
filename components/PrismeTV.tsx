'use client'

import { useRef, useState } from 'react'
import styles from './PrismeTV.module.css'

const episodes = [
  {
    slug: 'inde',
    title: "L'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 19',
    file: '/videos/prisme_inde_v4.mp4',
    description: "1,44 milliard d'habitants. 7% de croissance. Une puissance qui ne choisit pas son camp.",
  },
]

export default function PrismeTV() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)

  const ep = episodes[active]

  const handlePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const handleEnded = () => setPlaying(false)

  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.labelRow}>
          <span className={styles.dot} />
          <span className={styles.label}>Chaîne PRISME</span>
        </div>
        <p className={styles.sub}>Formats vidéo · Analyses en mouvement</p>
      </div>

      <div className={styles.layout}>
        {/* Player */}
        <div className={styles.playerWrap}>
          <video
            ref={videoRef}
            src={ep.file}
            className={styles.video}
            onEnded={handleEnded}
            playsInline
            preload="metadata"
          />

          {/* Overlay play button */}
          {!playing && (
            <button className={styles.playBtn} onClick={handlePlay} aria-label="Lire">
              <span className={styles.playIcon}>▶</span>
            </button>
          )}

          {/* Click anywhere to pause */}
          {playing && (
            <button className={styles.pauseOverlay} onClick={handlePlay} aria-label="Pause" />
          )}

          {/* Episode badge */}
          <div className={styles.badge}>
            <span className={styles.badgeCat}>{ep.category}</span>
            <span className={styles.badgeDur}>{ep.duration}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.epTitle}>{ep.title}</div>
          <p className={styles.epDesc}>{ep.description}</p>

          <div className={styles.epList}>
            {episodes.map((e, i) => (
              <button
                key={e.slug}
                className={`${styles.epItem} ${i === active ? styles.epItemActive : ''}`}
                onClick={() => {
                  setActive(i)
                  setPlaying(false)
                  if (videoRef.current) {
                    videoRef.current.load()
                  }
                }}
              >
                <span className={styles.epNum}>#{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.epItemTitle}>{e.title}</span>
                <span className={styles.epDur}>{e.duration}</span>
              </button>
            ))}

            {/* Prochain épisode placeholder */}
            <div className={styles.epNext}>
              <span className={styles.epNextLabel}>Prochain épisode</span>
              <span className={styles.epNextTitle}>À paraître · Dans 15 jours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
