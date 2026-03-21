'use client'

import { useRef, useState } from 'react'
import styles from './PrismeTV.module.css'

const episodes = [
  {
    slug: 'inde',
    title: "L'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 19',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/prisme_inde_v10-3_a57ifu',
    description: "1,44 milliard d'habitants. 7% de croissance. Une puissance qui ne choisit pas son camp.",
  },
]

export default function PrismeTV() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  const ep = episodes[active]

  const handlePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play().catch(() => setError(true))
      setPlaying(true)
    }
  }

  return (
    <section className={styles.wrap}>

      <div className={styles.tvHeader}>
        <div className={styles.tvHeaderLeft}>
          <div className={styles.tvLogo}>
            <span className={styles.tvLogoText}>PRISME</span>
            <span className={styles.tvLogoTag}>TV</span>
          </div>
          <div className={styles.tvMeta}>
            <span className={styles.tvDot} />
            <span className={styles.tvMetaText}>Analyses en mouvement</span>
          </div>
        </div>
        <div className={styles.tvEpCount}>
          <span className={styles.tvEpNum}>01</span>
          <span className={styles.tvEpLabel}>épisode</span>
        </div>
      </div>

      <div className={styles.layout}>

        <div className={styles.playerOuter}>
          <div className={styles.playerWrap}>
            <video
              ref={videoRef}
              src={ep.file}
              className={styles.video}
              onEnded={() => setPlaying(false)}
              onError={() => setError(true)}
              playsInline
              preload="metadata"
            />

            {!playing && !error && (
              <button className={styles.playBtn} onClick={handlePlay} aria-label="Lire">
                <span className={styles.playIcon}>▶</span>
              </button>
            )}

            {error && (
              <div className={styles.errorMsg}>Vidéo indisponible</div>
            )}

            {playing && (
              <button className={styles.pauseOverlay} onClick={handlePlay} aria-label="Pause" />
            )}

            <div className={styles.badge}>
              <span className={styles.badgeCat}>{ep.category}</span>
              <span className={styles.badgeDur}>{ep.duration}</span>
            </div>
          </div>

          <div className={styles.playerFooter}>
            <div className={styles.playerFooterTitle}>{ep.title}</div>
            <div className={styles.playerFooterDesc}>{ep.description}</div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Dans cet épisode</div>
          <div className={styles.epList}>
            {episodes.map((e, i) => (
              <button
                key={e.slug}
                className={`${styles.epItem} ${i === active ? styles.epItemActive : ''}`}
                onClick={() => {
                  setActive(i)
                  setPlaying(false)
                  setError(false)
                  if (videoRef.current) videoRef.current.load()
                }}
              >
                <span className={styles.epNum}>#{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.epInfo}>
                  <span className={styles.epItemTitle}>{e.title}</span>
                  <span className={styles.epCat}>{e.category}</span>
                </div>
                <span className={styles.epDur}>{e.duration}</span>
              </button>
            ))}

            <div className={styles.epNext}>
              <span className={styles.epNextLabel}>Prochain épisode</span>
              <span className={styles.epNextTitle}>À paraître · Dans 15 jours</span>
            </div>
          </div>

          <div className={styles.sidebarNote}>
            Un nouveau format tous les 15 jours.<br />
            Analyses visuelles en 60–90 secondes.
          </div>
        </div>

      </div>
    </section>
  )
}
