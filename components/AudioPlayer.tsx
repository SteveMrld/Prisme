'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './AudioPlayer.module.css'

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

const SPEEDS = [1, 1.25, 1.5, 2]

// Lecteur « Écouter cet article ». Marche pour un grand format comme pour un
// entretien : il suffit de lui passer l'URL du fichier audio.
export default function AudioPlayer({
  src,
  minutes,
  label = "Écouter l'article",
}: {
  src: string
  minutes?: number
  label?: string
}) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(0)

  useEffect(() => {
    const a = ref.current
    if (!a) return
    const onTime = () => setCur(a.currentTime)
    const onMeta = () => setDur(a.duration)
    const onEnd = () => setPlaying(false)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
    }
  }, [])

  const toggle = () => {
    const a = ref.current
    if (!a) return
    if (a.paused) {
      a.play()
      setPlaying(true)
    } else {
      a.pause()
      setPlaying(false)
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = ref.current
    if (!a || !dur) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    a.currentTime = Math.max(0, Math.min(1, ratio)) * dur
    setCur(a.currentTime)
  }

  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length
    setSpeedIdx(next)
    if (ref.current) ref.current.playbackRate = SPEEDS[next]
  }

  const pct = dur ? (cur / dur) * 100 : 0
  const totalLabel = dur ? fmt(dur) : minutes ? `${minutes} min` : ''

  return (
    <div className={styles.player}>
      <audio ref={ref} src={src} preload="metadata" />

      <button
        type="button"
        className={styles.play}
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Lecture'}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className={styles.main}>
        <div className={styles.label}>
          {label}
          {totalLabel ? ` · ${totalLabel}` : ''}
        </div>
        <div className={styles.bar} onClick={seek}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={styles.time}>{fmt(cur)}</div>

      <button
        type="button"
        className={styles.speed}
        onClick={cycleSpeed}
        aria-label="Vitesse de lecture"
      >
        {SPEEDS[speedIdx]}×
      </button>
    </div>
  )
}
