'use client'

import { useRef, useState } from 'react'
import styles from './SoaraTV.module.css'

const episodes = [
  {
    id: '01',
    slug: 'inde',
    title: "L'Inde, le siècle qui vient",
    category: 'Géopolitique',
    duration: '1 min 19',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/soara_inde_final-1_hitfsr',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/soara_inde_final-1_hitfsr.jpg',
    description: "1,44 milliard d'habitants. 7% de croissance. Une puissance qui ne choisit pas son camp.",
  },
  {
    id: '02',
    slug: 'afrique',
    title: "L'Afrique : ce qu'on ne vous a pas appris",
    category: 'Géopolitique',
    duration: '2 min 02',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/soara_afrique_ep2-1_xp6mvu',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/soara_afrique_ep2-1_xp6mvu.jpg',
    description: "54 pays. 2 000 langues. Le continent le plus riche, le plus mal compris.",
  },
  {
    id: '03',
    slug: 'biologie',
    title: "La biologie devient un logiciel",
    category: 'Science',
    duration: '2 min 07',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/soara_biologie_ep3_ouqzr4',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/soara_biologie_ep3_ouqzr4.jpg',
    description: "CRISPR, AlphaFold, Neuralink. L'IA a donné à l'humanité le pouvoir de réécrire le vivant.",
  },
  {
    id: '04',
    slug: 'nucleaire',
    title: "L'arme qui a failli nous tuer",
    category: 'Géopolitique',
    duration: '2 min 25',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/soara_arme_ep4_eo7uyk',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/soara_arme_ep4_eo7uyk.jpg',
    description: "12 700 ogives. 32 accidents. L'arme censée protéger le monde a failli le détruire.",
  },
  {
    id: '05',
    slug: 'inegalites',
    title: "8 hommes. 3,5 milliards. Le même patrimoine.",
    category: 'Économie',
    duration: '2 min 07',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/PRISME5_v3_kauhvi',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/PRISME5_v3_kauhvi.jpg',
    description: "1% possède plus que les 99% restants. Pandora Papers, crises, IA : comment les inégalités s'accélèrent.",
  },
  {
    id: '06',
    slug: 'asteroide',
    title: "Nous sommes l'astéroïde",
    category: 'Biodiversité',
    duration: '1 min 49',
    file: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/f_mp4,q_auto/soara_asteroide_ep6_qkipn3',
    thumb: 'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_1280,h_720,c_fill,f_jpg,q_80/soara_asteroide_ep6_qkipn3.jpg',
    description: "69% des vertébrés sauvages disparus depuis 1970. La 6e extinction est différente : c'est la première causée par une seule espèce.",
  },
]

export default function SoaraTV() {
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
            <span className={styles.tvLogoText}>SOARA</span>
            <span className={styles.tvLogoTag}>TV</span>
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
              poster={ep.thumb}
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
              <span className={styles.tvBugName}>SOARA</span>
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
                <div className={styles.epThumb}>
                  <img src={e.thumb} alt={e.title} className={styles.epThumbImg} />
                  {i === active && <span className={styles.epThumbPlay}>▶</span>}
                </div>
                <div className={styles.epInfo}>
                  <span className={styles.epNum}>Ép. {e.id}</span>
                  <span className={styles.epItemTitle}>{e.title}</span>
                  <span className={styles.epCat}>{e.category} · {e.duration}</span>
                </div>
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
