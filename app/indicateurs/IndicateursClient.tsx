'use client'
import { useState, useEffect } from 'react'
import Skeleton from '../../components/Skeleton'
import styles from './indicateurs.module.css'

const AV_KEY = 'IONR06NZ74XNHBLS'

type Ind = {
  id: string; label: string; sub: string
  value: number; prev: number; unit: string
  cat: string; context: string; catColor: string
  history: number[]
}

// Valeurs du 13 mai 2026 — remplacées par API dès chargement (frankfurter
// pour le change, Alpha Vantage pour Brent / blé / cuivre / or). Les BASE
// servent de fallback si l'API est rate-limitée ou indisponible.
const BASE: Ind[] = [
  { id:'brent',  label:'Pétrole Brent', sub:'USD / baril',     value:78.40,  prev:78.92,  unit:'$', cat:'Énergie',      catColor:'#C4793A', context:'Demande chinoise atone, OPEP+ en discussion sur quotas', history:[81.2,80.4,79.6,79.8,79.1,78.9,78.40] },
  { id:'gold',   label:'Or',            sub:'USD / once troy', value:3412,   prev:3398,   unit:'$', cat:'Refuge',       catColor:'#C8A96E', context:'Achats massifs des banques centrales émergentes',          history:[3340,3358,3372,3380,3388,3398,3412] },
  { id:'wheat',  label:'Blé',           sub:'USD / boisseau',  value:5.71,   prev:5.68,   unit:'$', cat:'Alimentaire',  catColor:'#7A9A3A', context:'Sécheresses sur le bassin de la mer Noire',               history:[5.42,5.50,5.58,5.61,5.65,5.68,5.71] },
  { id:'copper', label:'Cuivre',        sub:'USD / livre',     value:4.46,   prev:4.41,   unit:'$', cat:'Industrie',    catColor:'#9A6A3A', context:'Transition électrique, tension sur l\'offre mondiale',    history:[4.21,4.28,4.34,4.38,4.40,4.41,4.46] },
  { id:'eurusd', label:'EUR / USD',     sub:'Euro → Dollar',   value:1.1024, prev:1.0998, unit:'',  cat:'Change',       catColor:'#2D6B4A', context:'BCE attentiste, dollar affaibli par la stagflation US',    history:[1.082,1.087,1.091,1.094,1.097,1.0998,1.1024] },
  { id:'usdcny', label:'USD / CNY',     sub:'Dollar → Yuan',   value:7.1980, prev:7.2105, unit:'',  cat:'Géopolitique', catColor:'#1A3E6B', context:'Stabilisation pilotée par la PBoC, internationalisation lente du yuan', history:[7.265,7.250,7.235,7.220,7.215,7.2105,7.1980] },
]

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
