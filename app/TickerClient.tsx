'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './ticker.module.css'
import filSignal from '../lib/fil-signal.json'

function todayFr() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

type Breve = {
  cat: string
  catColor: string
  headline: string
  tickerCat?: string
  tickerText?: string
}

const ITEMS = (filSignal.breves as Breve[])
  .filter(b => b.tickerText)
  .map(b => ({
    cat: b.tickerCat || b.cat,
    color: b.catColor,
    text: b.tickerText as string,
  }))

// Vitesse de defilement en pixels par seconde, independante du nombre de breves.
const SPEED_DESKTOP = 55
const SPEED_MOBILE = 45

export default function Ticker() {
  const [date, setDate] = useState('')
  const trackRef = useRef<HTMLDivElement>(null)
  const lastWidth = useRef(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setDate(todayFr())
    const now = new Date()
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const t = setTimeout(() => setDate(todayFr()), msToMidnight)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const measure = () => {
      const half = el.scrollWidth / 2
      if (!half) return
      if (Math.abs(half - lastWidth.current) < 40) return
      lastWidth.current = half
      const speed = window.matchMedia('(max-width: 600px)').matches ? SPEED_MOBILE : SPEED_DESKTOP
      setDuration(half / speed)
    }

    measure()
    const fonts = (document as any).fonts
    if (fonts && fonts.ready) fonts.ready.then(measure).catch(() => {})

    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return (
    <div className={styles.ticker}>
      <div className={styles.left}>
        <span className={styles.live}>
          <span className={styles.dot} />
          LIVE
        </span>
        <span className={styles.date}>{date}</span>
      </div>

      <div className={styles.trackWrap}>
        <div className={styles.fadeL} aria-hidden="true" />
        <div className={styles.fadeR} aria-hidden="true" />
        <div
          className={styles.track}
          ref={trackRef}
          style={duration ? { animationDuration: `${duration}s` } : undefined}
        >
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span key={i} className={styles.item}>
              <span className={styles.pill} style={{background: item.color}}>{item.cat}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <Link href="/signal" className={styles.signalLink}>Signal →</Link>
    </div>
  )
}
