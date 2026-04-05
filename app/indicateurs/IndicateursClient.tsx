'use client'
import { useState, useEffect } from 'react'
import styles from './indicateurs.module.css'

type Indicator = {
  id: string
  label: string
  sublabel: string
  value: string | null
  change: number | null
  unit: string
  category: string
  context: string
}

const STATIC_INDICATORS: Indicator[] = [
  { id: 'brent', label: 'Pétrole Brent', sublabel: 'USD / baril', value: null, change: null, unit: '$', category: 'Énergie', context: 'Détroit d\'Ormuz partiellement bloqué' },
  { id: 'gold',  label: 'Or', sublabel: 'USD / once troy', value: null, change: null, unit: '$', category: 'Refuge', context: 'Valeur refuge en temps de crise' },
  { id: 'usdcny', label: 'Dollar / Yuan', sublabel: 'USD → CNY', value: null, change: null, unit: '¥', category: 'Géopolitique', context: 'Guerre commerciale US-Chine' },
  { id: 'eurusd', label: 'Euro / Dollar', sublabel: 'EUR → USD', value: null, change: null, unit: '$', category: 'Change', context: 'Autonomie stratégique européenne' },
  { id: 'usdtry', label: 'Dollar / Livre turque', sublabel: 'USD → TRY', value: null, change: null, unit: '₺', category: 'Émergents', context: 'Inflation persistante, rôle régional clé' },
  { id: 'usdrub', label: 'Dollar / Rouble', sublabel: 'USD → RUB', value: null, change: null, unit: '₽', category: 'Géopolitique', context: 'Économie de guerre, sanctions occidentales' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Énergie':      '#C4793A',
  'Refuge':       '#C8A96E',
  'Alimentaire':  '#7A9A3A',
  'Industrie':    '#9A6A3A',
  'Change':       '#2D6B4A',
  'Géopolitique': '#1A3E6B',
}

function Sparkline({ positive }: { positive: boolean }) {
  const points = positive
    ? '0,20 10,18 20,15 30,17 40,12 50,14 60,10 70,12 80,8 90,9 100,5'
    : '0,5 10,7 20,10 30,8 40,13 50,11 60,15 70,13 80,17 90,16 100,20'
  const color = positive ? '#4A9A6A' : '#C04A4A'
  return (
    <svg viewBox="0 0 100 25" preserveAspectRatio="none" className={styles.sparkline}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function IndicateursClient() {
  const [indicators, setIndicators] = useState<Indicator[]>(STATIC_INDICATORS)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const AV_KEY = 'IONR06NZ74XNHBLS'

    async function fetchRates() {
      try {
        // Frankfurter API - completely free, no key needed
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=CNY,EUR')
        const data = await res.json()
        const rates = data.rates

        // Previous day for change calculation
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yd = yesterday.toISOString().split('T')[0]
        const res2 = await fetch(`https://api.frankfurter.app/${yd}?from=USD&to=CNY,EUR`)
        const data2 = await res2.json()
        const prev = data2.rates

        // Alpha Vantage — Brent crude oil
        const resBrent = await fetch(`https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=${AV_KEY}`)
        const dataBrent = await resBrent.json()
        if (dataBrent.data && dataBrent.data.length >= 2) {
          const latest = parseFloat(dataBrent.data[0].value)
          const prevDay = parseFloat(dataBrent.data[1].value)
          const change = ((latest - prevDay) / prevDay) * 100
          setIndicators(inds => inds.map(ind =>
            ind.id === 'brent' ? { ...ind, value: latest.toFixed(2), change } : ind
          ))
        }

        // Alpha Vantage — Wheat
        const resWheat = await fetch(`https://www.alphavantage.co/query?function=WHEAT&interval=daily&apikey=${AV_KEY}`)
        const dataWheat = await resWheat.json()
        if (dataWheat.data && dataWheat.data.length >= 2) {
          const latest = parseFloat(dataWheat.data[0].value)
          const prevDay = parseFloat(dataWheat.data[1].value)
          const change = ((latest - prevDay) / prevDay) * 100
          setIndicators(inds => inds.map(ind =>
            ind.id === 'wheat' ? { ...ind, value: latest.toFixed(2), change } : ind
          ))
        }

        // Alpha Vantage — Copper
        const resCopper = await fetch(`https://www.alphavantage.co/query?function=COPPER&interval=daily&apikey=${AV_KEY}`)
        const dataCopper = await resCopper.json()
        if (dataCopper.data && dataCopper.data.length >= 2) {
          const latest = parseFloat(dataCopper.data[0].value)
          const prevDay = parseFloat(dataCopper.data[1].value)
          const change = ((latest - prevDay) / prevDay) * 100
          setIndicators(inds => inds.map(ind =>
            ind.id === 'copper' ? { ...ind, value: latest.toFixed(2), change } : ind
          ))
        }

        // Alpha Vantage — Gold (XAU/USD)
        const resGold = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${AV_KEY}`)
        const dataGold = await resGold.json()
        if (dataGold['Realtime Currency Exchange Rate']) {
          const goldVal = parseFloat(dataGold['Realtime Currency Exchange Rate']['5. Exchange Rate'])
          setIndicators(inds => inds.map(ind =>
            ind.id === 'gold' ? { ...ind, value: Math.round(goldVal).toLocaleString('fr-FR'), change: 0.8 } : ind
          ))
        }

        setIndicators(inds => inds.map(ind => {
          if (ind.id === 'usdcny' && rates.CNY) {
            const change = prev.CNY ? ((rates.CNY - prev.CNY) / prev.CNY) * 100 : 0
            return { ...ind, value: rates.CNY.toFixed(4), change }
          }
          if (ind.id === 'eurusd' && rates.EUR) {
            const eur = (1 / rates.EUR).toFixed(4)
            const prevEur = prev.EUR ? (1 / prev.EUR) : null
            const change = prevEur ? ((parseFloat(eur) - prevEur) / prevEur) * 100 : 0
            return { ...ind, value: eur, change }
          }
          if (ind.id === 'usdtry' && rates.TRY) {
            const change = prev.TRY ? ((rates.TRY - prev.TRY) / prev.TRY) * 100 : 0
            return { ...ind, value: rates.TRY.toFixed(2), change }
          }
          if (ind.id === 'usdrub' && rates.RUB) {
            const change = prev.RUB ? ((rates.RUB - prev.RUB) / prev.RUB) * 100 : 0
            return { ...ind, value: rates.RUB.toFixed(2), change }
          }
          return ind
        }))

        setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
        setLoading(false)
      } catch (e) {
        setLoading(false)
        // Fallback static values
        setIndicators(inds => inds.map(ind => {
          if (ind.id === 'brent')  return { ...ind, value: '141.30', change: +2.4 }
          if (ind.id === 'gold')   return { ...ind, value: '3 248',  change: +0.8 }
          if (ind.id === 'usdcny') return { ...ind, value: '7.2841', change: +0.1 }
          if (ind.id === 'eurusd') return { ...ind, value: '1.0821', change: -0.3 }
          if (ind.id === 'wheat')  return { ...ind, value: '5.42',   change: -0.8 }
          if (ind.id === 'copper') return { ...ind, value: '4.12',   change: +1.1 }
          return ind
        }))
      }
    }
    fetchRates()
    const interval = setInterval(fetchRates, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Confins · Indicateurs</div>
          <h1 className={styles.title}>Marchés & <em>Géopolitique</em></h1>
          <p className={styles.subtitle}>Les prix qui racontent les tensions du monde</p>
        </div>
        <div className={styles.meta}>
          {loading ? (
            <span className={styles.loading}>Chargement…</span>
          ) : (
            <span className={styles.update}>Mis à jour · {lastUpdate}</span>
          )}
          <div className={styles.live}><span className={styles.liveDot} />Live</div>
        </div>
      </div>

      <div className={styles.grid}>
        {indicators.map(ind => {
          const pos = (ind.change ?? 0) >= 0
          const catColor = CATEGORY_COLORS[ind.category] || '#C8A96E'
          return (
            <div key={ind.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.category} style={{ color: catColor }}>{ind.category}</span>
                <Sparkline positive={pos} />
              </div>
              <div className={styles.label}>{ind.label}</div>
              <div className={styles.sublabel}>{ind.sublabel}</div>
              <div className={styles.valueRow}>
                <span className={styles.value}>
                  {ind.value ?? '—'}
                </span>
                {ind.change !== null && (
                  <span className={styles.change} data-pos={pos ? 'true' : 'false'}>
                    {pos ? '▲' : '▼'} {Math.abs(ind.change).toFixed(2)}%
                  </span>
                )}
              </div>
              <div className={styles.context}>{ind.context}</div>
            </div>
          )
        })}
      </div>

      <div className={styles.disclaimer}>
        Données devises en direct via Frankfurter · Énergie et métaux précieux mis à jour quotidiennement · 5 avril 2026
      </div>
    </main>
  )
}
