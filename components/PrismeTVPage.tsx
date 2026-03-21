'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './PrismeTVPage.module.css'

const episodes = [
  {
    id: '02',
    slug: 'afrique',
    title: "L'Afrique : ce qu'on ne vous a pas appris",
    category: 'Géopolitique',
    duration: '2 min 02',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME2_v7-2_mm8oxv',
    description: "54 pays. 2 000 langues. Le continent le plus vaste, le plus riche en ressources, le plus jeune en population. Et pourtant le plus mal compris. Ce qu'on ne vous a jamais vraiment expliqué.",
    date: 'Mars 2026',
  },
  {
    id: '01',
    slug: 'inde',
    title: "L'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 19',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/prisme_inde_v10-3_a57ifu',
    description: "1,44 milliard d'habitants. 7% de croissance par an. Une puissance nucléaire qui refuse de choisir son camp entre Washington et Moscou. L'Inde est peut-être la grande puissance du siècle qui vient.",
    date: 'Mars 2026',
  },
]

export default function PrismeTVPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [fadeIn, setFadeIn] = useState(true)
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

  const switchEpisode = useCallback((i: number) => {
    if (i === active || transitioning) return
    setTransitioning(true)
    setFadeIn(false)
    setPlaying(false)
    setTimeout(() => {
      setActive(i)
      if (videoRef.current) videoRef.current.load()
      setFadeIn(true)
      setTransitioning(false)
    }, 400)
  }, [active, transitioning])

  // Auto-play next episode on end
  const handleEnded = () => {
    setPlaying(false)
    const next = (active + 1) % episodes.length
    switchEpisode(next)
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
            Géopolitique, économie, société — en formats courts, rigoureux et visuels.<br />
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
            <div className={`${styles.playerWrap} ${fadeIn ? styles.playerFadeIn : styles.playerFadeOut}`}>
              <video
                ref={videoRef}
                src={ep.file}
                className={styles.video}
                onEnded={handleEnded}
                playsInline
                preload="metadata"
                poster=""
              />

              {!playing && (
                <button className={styles.playBtn} onClick={handlePlay}>
                  <span className={styles.playCircle}>▶</span>
                </button>
              )}
              {playing && (
                <button className={styles.pauseOverlay} onClick={handlePlay} />
              )}

              {/* TV channel overlay — top right */}
              <div className={styles.channelBug}>
                <span className={styles.channelName}>PRISME</span>
                <span className={styles.channelDot}>·</span>
                <span className={styles.channelEp}>Ép. {ep.id}</span>
              </div>

              <div className={styles.videoBadges}>
                <span className={styles.catBadge}>{ep.category}</span>
                <span className={styles.durBadge}>{ep.duration}</span>
              </div>
            </div>

            {/* Under player */}
            <div className={`${styles.epMeta} ${fadeIn ? styles.playerFadeIn : styles.playerFadeOut}`}>
              <span className={styles.epId}>Épisode #{ep.id}</span>
              <span className={styles.epDate}>{ep.date}</span>
            </div>
            <h2 className={`${styles.epTitle} ${fadeIn ? styles.playerFadeIn : styles.playerFadeOut}`}>{ep.title}</h2>
            <p className={`${styles.epDesc} ${fadeIn ? styles.playerFadeIn : styles.playerFadeOut}`}>{ep.description}</p>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarTitle}>Tous les épisodes</div>

            {episodes.map((e, i) => (
              <button
                key={e.slug}
                className={`${styles.epCard} ${i === active ? styles.epCardActive : ''}`}
                onClick={() => switchEpisode(i)}
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
                {i === active && <span className={styles.epCardNow}>▶ En cours</span>}
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
