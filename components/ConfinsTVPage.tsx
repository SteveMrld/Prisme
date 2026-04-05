'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './ConfinsTVPage.module.css'

const episodes = [
  {
    id: '01',
    slug: 'inde',
    title: "L\'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 19',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/prisme_inde_v10-3_a57ifu.mp4',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_3,w_1280,h_720,c_fill,f_jpg,q_80/prisme_inde_v10-3_a57ifu.jpg',
    description: "1,44 milliard d\'habitants. 7% de croissance. Une puissance qui ne choisit pas son camp.",
  },
  {
    id: '02',
    slug: 'afrique',
    title: "L\'Afrique : ce qu\'on ne vous a pas appris",
    category: 'Géopolitique',
    duration: '2 min 02',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME2_v7-2_mm8oxv',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/PRISME2_v7-2_mm8oxv.jpg',
    description: "54 pays. 2 000 langues. Le continent le plus riche, le plus mal compris.",
  },
  {
    id: '03',
    slug: 'biologie',
    title: "La biologie devient un logiciel",
    category: 'Science',
    duration: '2 min 07',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME3_v4_fixed_ugm8uc',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/PRISME3_v4_fixed_ugm8uc.jpg',
    description: "CRISPR, AlphaFold, Neuralink. L\'IA a donné à l\'humanité le pouvoir de réécrire le vivant.",
  },
  {
    id: '04',
    slug: 'nucleaire',
    title: "L\'arme qui a failli nous tuer",
    category: 'Géopolitique',
    duration: '2 min 25',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME4_v3_otrvbg',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/PRISME4_v3_otrvbg.jpg',
    description: "12 700 ogives. 32 accidents. L\'arme censée protéger le monde a failli le détruire.",
  },
  {
    id: '05',
    slug: 'inegalites',
    title: "8 hommes. 3,5 milliards. Le même patrimoine.",
    category: 'Économie',
    duration: '2 min 07',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME5_v3_kauhvi',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/PRISME5_v3_kauhvi.jpg',
    description: "1% possède plus que les 99% restants. Pandora Papers, crises, IA — comment les inégalités s\'accélèrent.",
  },
  {
    id: '06',
    slug: 'asteroide',
    title: "Nous sommes l\'astéroïde",
    category: 'Biodiversité',
    duration: '1 min 49',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME6_v2_koofw8',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/PRISME6_v2_koofw8.jpg',
    description: "69% des vertébrés sauvages disparus depuis 1970. La 6e extinction est différente — c\'est la première causée par une seule espèce.",
  },
]

export default function ConfinsTVPage() {
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
              <span className={styles.logoText}>CONFINS</span>
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
                preload="none"
                poster={ep.thumb}
              />

              {/* Thumbnail visible avant lecture */}
              {!playing && (
                <img
                  src={ep.thumb}
                  alt={ep.title}
                  className={styles.thumb}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}

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
                <span className={styles.channelName}>CONFINS</span>
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
              <span className={styles.epDate}>{'2025'}</span>
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
                <div className={styles.epCardThumb}>
                  <img src={e.thumb} alt={e.title} className={styles.epCardThumbImg} />
                  {i === active && <span className={styles.epCardThumbPlay}>▶</span>}
                </div>
                <div className={styles.epCardBody}>
                  <div className={styles.epCardNum}>Ép. {e.id}</div>
                  <div className={styles.epCardTitle}>{e.title}</div>
                  <div className={styles.epCardMeta}>
                    <span>{e.category}</span>
                    <span>·</span>
                    <span>{e.duration}</span>
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
            CONFINS TV ne fait pas de l'information en continu. On prend le temps d'expliquer,
            de contextualiser, de sourcer. Chaque épisode est une analyse visuelle — construite
            comme un article de fond, racontée comme un documentaire.
          </p>
          <Link href="/apropos" className={styles.manifestoLink}>
            En savoir plus sur CONFINS →
          </Link>
        </div>
      </div>

    </main>
  )
}
