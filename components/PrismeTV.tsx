'use client'

import { useRef, useState } from 'react'
import styles from './PrismeTV.module.css'

const episodes = [
  {
    id: '02',
    slug: 'afrique',
    title: "L'Afrique : ce qu'on ne vous a pas appris",
    category: 'Géopolitique',
    duration: '2 min 02',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME2_v7-2_mm8oxv',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_1,w_1280,h_720,c_fill,f_jpg,q_80/PRISME2_v7-2_mm8oxv.jpg',
    description: "54 pays. 2 000 langues. Le continent le plus riche, le plus mal compris.",
  },
  {
    id: '01',
    slug: 'inde',
    title: "L'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 19',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/prisme_inde_v10-3_a57ifu',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_2,w_1280,h_720,c_fill,f_jpg,q_80/prisme_inde_v10-3_a57ifu.jpg',
    description: "1,44 milliard d'habitants. 7% de croissance. Une puissance qui ne choisit pas son camp.",
  },
]

export default function PrismeTV() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  const [fading, setFading] = useState(false)

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

  const switchTo = (i: number) => {
    if (i === active || fading) return
    setFading(true)
    setPlaying(false)
    setTimeout(() => {
      setActive(i)
      setError(false)
      if (videoRef.current) videoRef.current.load()
      setFading(false)
    }, 350)
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
          <span className={styles.tvEpNum}>0{episodes.length}</span>
          <span className={styles.tvEpLabel}>épisodes</span>
        </div>
      </div>

      <div className={styles.layout}>

        <div className={styles.playerOuter}>
          <div className={`${styles.playerWrap} ${fading ? styles.fadeOut : styles.fadeIn}`}>
            <video
              ref={videoRef}
              src={ep.file}
              className={styles.video}
              onEnded={() => { setPlaying(false); switchTo((active + 1) % episodes.length) }}
              onError={() => setError(true)}
              playsInline
              preload="none"
            />

            {/* Thumbnail overlay — visible avant play, masqué après */}
            {!playing && !error && (
              <img
                src={ep.thumb}
                alt={ep.title}
                className={styles.thumb}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}

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

            {/* Watermark TV */}
            <div className={styles.tvBug}>
              <span className={styles.tvBugName}>PRISME</span>
              <span className={styles.tvBugEp}>Ép. {ep.id}</span>
            </div>

            <div className={styles.badge}>
              <span className={styles.badgeCat}>{ep.category}</span>
              <span className={styles.badgeDur}>{ep.duration}</span>
            </div>
          </div>

          <div className={`${styles.playerFooter} ${fading ? styles.fadeOut : styles.fadeIn}`}>
            <div className={styles.playerFooterTitle}>{ep.title}</div>
            <div className={styles.playerFooterDesc}>{ep.description}</div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Tous les épisodes</div>
          <div className={styles.epList}>
            {episodes.map((e, i) => (
              <button
                key={e.slug}
                className={`${styles.epItem} ${i === active ? styles.epItemActive : ''}`}
                onClick={() => switchTo(i)}
              >
                <span className={styles.epNum}>#{e.id}</span>
                <div className={styles.epInfo}>
                  <span className={styles.epItemTitle}>{e.title}</span>
                  <span className={styles.epCat}>{e.category} · {e.duration}</span>
                </div>
                {i === active && <span className={styles.epNow}>▶</span>}
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
