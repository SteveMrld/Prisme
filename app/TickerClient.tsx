'use client'
import { useEffect, useState } from 'react'
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

export default function Ticker() {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(todayFr())
    const now = new Date()
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const t = setTimeout(() => setDate(todayFr()), msToMidnight)
    return () => clearTimeout(t)
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
        <div className={styles.track}>
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
