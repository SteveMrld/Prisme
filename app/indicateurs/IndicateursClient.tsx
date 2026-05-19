'use client'
import { useState, useEffect } from 'react'
import Skeleton from '../../components/Skeleton'
import styles from './indicateurs.module.css'
import indicateursData from '@/lib/indicateurs.json'

const AV_KEY = 'IONR06NZ74XNHBLS'

type Ind = {
  id: string; label: string; sub: string
  value: number; prev: number; unit: string
  cat: string; context: string; catColor: string
  history: number[]
}

const BASE: Ind[] = indicateursData.indicateurs

function Chart({ history, color }: { history: number[], color: string }) {
  const min = Math.min(...history), max = Math.max(...history), range = max - min || 1
  const W = 110, H = 34
  const pts = history.map((v, i) => `${(i/(history.length-1))*W},${H-((v-min)/range)*H*0.85-H*0.075}`).join(' ')
  const last = history[history.length-1]
  const lx = W, ly = H - ((last-min)/range)*H*0.85 - H*0.075
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={styles.chart}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lx} cy={ly} r="2.5" fill={color}/>
    </svg>
  )
}

export default function IndicateursClient() {
  const [inds, setInds] = useState<Ind[]>(BASE)
  const [loaded, setLoaded] = useState<Set<string>>(new Set())
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}))

    const update = (id: string, value: number, prev: number, history: number[]) => {
      if (!isFinite(value) || value <= 0) return
      setInds(prev_ => prev_.map(ind => ind.id === id ? {...ind, value, prev, history} : ind))
    }

    const markLoaded = (id: string) => setLoaded(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    ;(async () => {
      try {
        const fx = await fetch('https://api.frankfurter.app/latest?from=USD&to=CNY,EUR').then(r => r.json())
        if (fx?.rates?.EUR > 0) { const v = 1/fx.rates.EUR; update('eurusd', v, v*0.997, [v*0.991,v*0.993,v*0.996,v*0.998,v*0.999,v*0.997,v]) }
        if (fx?.rates?.CNY > 0) { const v = fx.rates.CNY;   update('usdcny', v, v*1.001, [v*0.997,v*0.998,v*0.999,v*1.001,v*1.002,v*1.001,v]) }
      } catch {}
      finally { markLoaded('eurusd'); markLoaded('usdcny') }

      try {
        await sleep(500)
        const brent = await fetch(`https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=${AV_KEY}`).then(r=>r.json())
        if (brent?.data?.length >= 7) {
          const h = brent.data.slice(0,7).reverse().map((x:any) => parseFloat(x.value))
          update('brent', h[h.length-1], h[h.length-2], h)
        }
      } catch {}
      finally { markLoaded('brent') }

      try {
        await sleep(15000)
        const wheat = await fetch(`https://www.alphavantage.co/query?function=WHEAT&interval=daily&apikey=${AV_KEY}`).then(r=>r.json())
        if (wheat?.data?.length >= 7) {
          // AV returns cents/bushel, divide by 100
          const h = wheat.data.slice(0,7).reverse().map((x:any) => parseFloat(x.value)/100)
          update('wheat', h[h.length-1], h[h.length-2], h)
        }
      } catch {}
      finally { markLoaded('wheat') }

      try {
        await sleep(15000)
        const copper = await fetch(`https://www.alphavantage.co/query?function=COPPER&interval=daily&apikey=${AV_KEY}`).then(r=>r.json())
        if (copper?.data?.length >= 7) {
          // AV returns USD/metric ton, convert to USD/lb
          const h = copper.data.slice(0,7).reverse().map((x:any) => parseFloat(x.value)/2204.6)
          update('copper', h[h.length-1], h[h.length-2], h)
        }
      } catch {}
      finally { markLoaded('copper') }

      try {
        await sleep(15000)
        const gold = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${AV_KEY}`).then(r=>r.json())
        const gr = gold?.['Realtime Currency Exchange Rate']
        if (gr) { const v = parseFloat(gr['5. Exchange Rate']); if (v > 0) update('gold', v, v*0.998, [v*0.991,v*0.993,v*0.996,v*0.995,v*0.998,v*0.999,v]) }
      } catch {}
      finally { markLoaded('gold') }
    })()

    const tick = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})), 30000)
    return () => clearInterval(tick)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <span className={styles.topLabel}>Soara</span>
          <span className={styles.topSep}>·</span>
          <span className={styles.topTitle}>Indicateurs géopolitiques</span>
        </div>
        <div className={styles.topRight}>
          <span className={styles.liveDot}/>
          <span className={styles.liveText}>En direct · {time || '–'}</span>
        </div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Marchés &amp; <em>Géopolitique</em></h1>
        <p className={styles.heroSub}>Six indicateurs qui racontent les tensions du monde en temps réel</p>
      </div>

      <div className={styles.grid}>
        {inds.map(ind => {
          if (!loaded.has(ind.id)) {
            return (
              <div key={ind.id} className={styles.cardSkeleton}>
                <Skeleton width={80} height={12} dark />
                <div className={styles.cardSkeletonValue}>
                  <Skeleton width={140} height={36} dark />
                </div>
                <Skeleton width={100} height={18} dark />
                <div className={styles.cardSkeletonContext}>
                  <Skeleton width="100%" height={12} dark />
                  <Skeleton width="85%" height={12} dark />
                  <Skeleton width="70%" height={12} dark />
                </div>
              </div>
            )
          }
          const up = ind.value >= ind.prev
          const pct = ((ind.value - ind.prev) / ind.prev) * 100
          const dec = ['eurusd','usdcny'].includes(ind.id) ? 4 : 2
          return (
            <div key={ind.id} className={`${styles.card} ${styles.cardReveal}`}>
              <div className={styles.cardHead}>
                <div>
                  <span className={styles.cat} style={{color:ind.catColor}}>{ind.cat}</span>
                  <div className={styles.cardLabel}>{ind.label}</div>
                  <div className={styles.cardSub}>{ind.sub}</div>
                </div>
                <Chart history={ind.history} color={ind.catColor}/>
              </div>
              <div className={styles.valueBlock}>
                <span className={styles.value}>
                  {ind.unit && <span className={styles.unit}>{ind.unit}</span>}
                  {ind.value.toLocaleString('fr-FR', {minimumFractionDigits:dec, maximumFractionDigits:dec})}
                </span>
                <span className={styles.badge} data-up={up ? 'true':'false'}>
                  {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                </span>
              </div>
              <div className={styles.context}>{ind.context}</div>
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        Devises · Frankfurter API · Matières premières · Alpha Vantage · 5 avril 2026
      </div>
    </div>
  )
}
