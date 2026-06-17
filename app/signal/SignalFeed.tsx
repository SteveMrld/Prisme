'use client'

import { useState } from 'react'
import styles from './signal.module.css'
import { parseSignalDate } from '../../lib/signal-dates'

type Breve = {
  date: string
  cat: string
  catColor: string
  headline: string
  body: string
}

export default function SignalFeed({ breves }: { breves: Breve[] }) {
  // Regroupement par mois.
  const map = new Map<string, { label: string; items: Breve[] }>()
  for (const b of breves) {
    const d = parseSignalDate(b.date)
    const key = d?.key ?? '0000-00'
    const label = d?.label ?? 'Plus anciennes'
    if (!map.has(key)) map.set(key, { label, items: [] })
    map.get(key)!.items.push(b)
  }

  // Mois du plus récent au plus ancien, brèves triées dans chaque mois.
  const months = Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, g]) => ({
      key,
      label: g.label,
      items: g.items
        .slice()
        .sort(
          (x, y) =>
            (parseSignalDate(y.date)?.sort ?? 0) -
            (parseSignalDate(x.date)?.sort ?? 0)
        ),
    }))

  const [selected, setSelected] = useState(months[0]?.key ?? '')
  const current = months.find(m => m.key === selected) ?? months[0]

  return (
    <>
      {months.length > 1 && (
        <nav className={styles.months} aria-label="Archives par mois">
          {months.map(m => (
            <button
              key={m.key}
              type="button"
              className={`${styles.monthTab} ${m.key === selected ? styles.monthTabActive : ''}`}
              onClick={() => setSelected(m.key)}
            >
              {m.label}
            </button>
          ))}
        </nav>
      )}

      <div className={styles.feed}>
        {current?.items.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.itemMeta}>
              <span className={styles.itemDot} style={{ background: item.catColor }} />
              <span className={styles.itemCat} style={{ color: item.catColor }}>
                {item.cat}
              </span>
              <span className={styles.itemDate}>{item.date}</span>
            </div>
            <h2 className={styles.itemHeadline}>{item.headline}</h2>
            <p className={styles.itemBody}>{item.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
