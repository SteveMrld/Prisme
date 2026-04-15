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
  { cat: 'Iran–USA',    color: '#C0392B', text: "Blocus naval américain — pétrole à 103$, 20% de l'approvisionnement mondial menacé" },
  { cat: 'Hongrie',     color: '#1A3E6B', text: "Orban battu après 16 ans — Peter Magyar remporte une victoire historique" },
  { cat: 'Ukraine',     color: '#1A3E6B', text: "Cessez-le-feu de Pâques violé 2 299 fois par la Russie" },
  { cat: 'Détroit d\'Ormuz', color: '#B86A1A', text: "Carburants en rupture dans 12% des stations françaises" },
  { cat: 'Soudan',      color: '#1A3E6B', text: "ONU — pire crise humanitaire mondiale, 14 millions de déplacés" },
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
