'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './ticker.module.css'

function todayFr() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const ITEMS = [
  { cat: 'Cuba–USA',     color: '#C0392B', text: "Décret Trump, sanctions massives sur l'énergie et la finance, USS Abraham Lincoln au large de La Havane" },
  { cat: 'Afrique',      color: '#1A3E6B', text: "Sommet Africa Forward à Nairobi, Macron annonce 23 milliards d'euros d'investissements pour le continent" },
  { cat: 'UE–IA',        color: '#1A5C4A', text: "L'Union européenne interdit les IA de nudification non consentie, 569 voix pour, entrée en vigueur le 2 décembre 2026" },
  { cat: 'Restitutions', color: '#B86A1A', text: "La France adopte à l'unanimité la loi-cadre des restitutions coloniales, simple décret désormais suffisant" },
  { cat: 'Taïwan',       color: '#1A3E6B', text: "Pékin réaffirme sa ligne rouge après les déclarations japonaises sur une intervention possible en cas de force chinoise" },
]

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
