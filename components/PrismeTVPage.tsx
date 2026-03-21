'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import styles from './PrismeTVPage.module.css'

const episodes = [
  {
    id: '01',
    slug: 'inde',
    title: "L'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 05',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/prisme_inde_v4-3_qp2iyl',
    description: "1,44 milliard d'habitants. 7% de croissance par an. Une puissance nucléaire qui refuse de choisir son camp entre Washington et Moscou. L'Inde est peut-être la grande puissance du siècle qui vient.",
    date: 'Mars 2026',
  },
]

export default function PrismeTVPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState(0)
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

  return (
    <main className={styles.main}>

      {/* ── Hero header ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div className={styles.logoBadge}>
              <span className={styles.logoText}>PRISME</span>
              <span className={styles.logoTV}>TV</span>
            </div>
            <div className={styles.heroPulse}>
              <span className={styles.pulseDot} />
              <span className={styles.pulseLabel}>Format vidéo</span>
            </div>
          </div>
          <h1 className={styles.heroTitle}>
            Les grandes questions du monde,<br />
            <em>vues autrement.</em>
          </h1>
          <p className={styles.heroBaseline}>
            Géopolitique, économie, société — en formats courts, rigoreux et visuels.<br />
            Un nouvel épisode tous les quinze jours.
          </p>
          <div className={styles.heroLine} />
        </div>
      </div>

      {/* ── Player section ── */}
      <div className={styles.playerSection}>
        <div className={styles.playerInner}>

          {/* Player */}
          <div className={styles.playerCol}>
            <div className={styles.playerWrap}>
              <video
                ref={videoRef}
                src={ep.file}
                className={styles.video}
                onEnded={() => setPlaying(false)}
                playsInline
                preload="metadata"
              />

              {!playing && (
                <button className={styles.playBtn} onClick={handlePlay}>
                  <span className={styles.playCircle}>▶</span>
                </button>
              )}
              {playing && (
                <button className={styles.pauseOverlay} onClick={handlePlay} />
              )}

              <div className={styles.videoBadges}>
                <span className={styles.catBadge}>{ep.category}</span>
                <span className={styles.durBadge}>{ep.duration}</span>
              </div>
            </div>

            {/* Under player */}
            <div className={styles.epMeta}>
              <span className={styles.epId}>Épisode #{ep.id}</span>
              <span className={styles.epDate}>{ep.date}</span>
            </div>
            <h2 className={styles.epTitle}>{ep.title}</h2>
            <p className={styles.epDesc}>{ep.description}</p>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarTitle}>Tous les épisodes</div>

            {episodes.map((e, i) => (
              <button
                key={e.slug}
                className={`${styles.epCard} ${i === active ? styles.epCardActive : ''}`}
                onClick={() => {
                  setActive(i)
                  setPlaying(false)
                  if (videoRef.current) videoRef.current.load()
                }}
              >
                <div className={styles.epCardNum}>#{e.id}</div>
                <div className={styles.epCardBody}>
                  <div className={styles.epCardTitle}>{e.title}</div>
                  <div className={styles.epCardMeta}>
                    <span>{e.category}</span>
                    <span>·</span>
                    <span>{e.duration}</span>
                    <span>·</span>
                    <span>{e.date}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* Next episode */}
            <div className={styles.nextEp}>
              <div className={styles.nextEpLabel}>Prochain épisode</div>
              <div className={styles.nextEpTitle}>Dans 15 jours</div>
              <div className={styles.nextEpHint}>Abonnez-vous pour être notifié</div>
              <Link href="/abonnement" className={styles.nextEpCta}>
                S'abonner →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Manifesto ── */}
      <div className={styles.manifesto}>
        <div className={styles.manifestoInner}>
          <div className={styles.manifestoLabel}>Notre approche</div>
          <p className={styles.manifestoText}>
            PRISME TV ne fait pas de l'information en continu. On prend le temps d'expliquer,
            de contextualiser, de sourcer. Chaque épisode est une analyse visuelle — construite
            comme un article de fond, racontée comme un documentaire.
          </p>
          <Link href="/apropos" className={styles.manifestoLink}>
            En savoir plus sur PRISME →
          </Link>
        </div>
      </div>

    </main>
  )
}
