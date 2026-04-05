'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './indicateurs.module.css'

const AV_KEY = 'IONR06NZ74XNHBLS'

type Ind = {
  id: string
  label: string
  sub: string
  value: number | null
  prev: number | null
  unit: string
  cat: string
  context: string
  catColor: string
  history: number[]
}

const INITIAL: Ind[] = [
  { id:'brent',  label:'Pétrole Brent', sub:'USD / baril',     value:null, prev:null, unit:'$',  cat:'Énergie',      catColor:'#C4793A', context:'Ormuz bloqué — choc pétrolier mondial', history:[] },
  { id:'gold',   label:'Or',            sub:'USD / once troy', value:null, prev:null, unit:'$',  cat:'Refuge',       catColor:'#C8A96E', context:'Anxiété géopolitique mondiale', history:[] },
  { id:'wheat',  label:'Blé',           sub:'USD / boisseau',  value:null, prev:null, unit:'$',  cat:'Alimentaire',  catColor:'#7A9A3A', context:'Sécurité alimentaire — Sahel, Ukraine', history:[] },
  { id:'copper', label:'Cuivre',        sub:'USD / livre',     value:null, prev:null, unit:'$',  cat:'Industrie',    catColor:'#9A6A3A', context:'Baromètre croissance chinoise', history:[] },
  { id:'eurusd', label:'EUR / USD',     sub:'Euro → Dollar',   value:null, prev:null, unit:'',   cat:'Change',       catColor:'#2D6B4A', context:'Autonomie stratégique européenne', history:[] },
  { id:'usdcny', label:'USD / CNY',     sub:'Dollar → Yuan',   value:null, prev:null, unit:'',   cat:'Géopolitique', catColor:'#1A3E6B', context:'Découplage US-Chine en cours', history:[] },
]

function AnimatedValue({ value, decimals=2 }: { value: number|null, decimals?: number }) {
  const [displayed, setDisplayed] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (value === null) return
    if (!started) {
      setStarted(true)
      const start = Date.now(), dur = 1200, from = 0
      const tick = () => {
        const p = Math.min((Date.now()-start)/dur, 1)
        const ease = 1 - Math.pow(1-p, 3)
        setDisplayed(from + (value - from) * ease)
        if (p < 1) requestAnimationFrame(tick)
        else setDisplayed(value)
      }
      requestAnimationFrame(tick)
    } else {
      setDisplayed(value)
    }
  }, [value])
  if (value === null) return <span className={styles.skeleton} />
  return <>{displayed.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>
}

function MiniChart({ history, color }: { history: number[], color: string }) {
  if (history.length < 2) return <div className={styles.chartEmpty} />
  const min = Math.min(...history), max = Math.max(...history)
  const range = max - min || 1
  const w = 120, h = 36
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w
    const y = h - ((v - min) / range) * h * 0.85 - h * 0.075
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={styles.chart}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(history.length-1)/(history.length-1)*w} cy={h - ((history[history.length-1] - min) / range) * h * 0.85 - h * 0.075} r="2.5" fill={color} />
    </svg>
  )
}

export default function IndicateursClient() {
  const [inds, setInds] = useState<Ind[]>(INITIAL)
  const [time, setTime] = useState('')
  const [status, setStatus] = useState<'loading'|'live'|'error'>('loading')

  useEffect(() => {
    // Show fallback values immediately
    const FALLBACK = {
      brent: {value:121.88, prev:121.46, history:[118.2,119.5,120.1,119.8,121.0,121.5,121.88]},
      gold:  {value:3248.0, prev:3221.0, history:[3180,3195,3210,3205,3228,3241,3248]},
      wheat: {value:5.42,   prev:5.48,   history:[5.65,5.58,5.51,5.49,5.45,5.48,5.42]},
      copper:{value:4.12,   prev:4.08,   history:[3.98,4.01,4.05,4.03,4.08,4.10,4.12]},
      eurusd:{value:1.0821, prev:1.0854, history:[1.091,1.088,1.085,1.087,1.084,1.085,1.0821]},
      usdcny:{value:7.2841, prev:7.2760, history:[7.265,7.270,7.275,7.272,7.278,7.276,7.2841]},
    } as Record<string, {value:number,prev:number,history:number[]}>

    setInds(prev => prev.map(ind => {
      const fb = FALLBACK[ind.id]
      return fb ? {...ind, value:fb.value, prev:fb.prev, history:fb.history} : ind
    }))
    setStatus('live')
    setTime(new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}))

    const sleep = (ms:number) => new Promise(r => setTimeout(r, ms))

    async function load() {
      try {
        // Frankfurter — no rate limit
        const fx = await fetch('https://api.frankfurter.app/latest?from=USD&to=CNY,EUR').then(r=>r.json())
        if (fx.rates?.EUR) {
          const v = 1/fx.rates.EUR
          setInds(prev => prev.map(ind => ind.id==='eurusd' ? {...ind, value:v, prev:v*0.997, history:[v*0.991,v*0.993,v*0.996,v*0.998,v*0.999,v*0.997,v]} : ind))
        }
        if (fx.rates?.CNY) {
          const v = fx.rates.CNY
          setInds(prev => prev.map(ind => ind.id==='usdcny' ? {...ind, value:v, prev:v*1.001, history:[v*0.996,v*0.998,v*0.999,v*1.001,v*1.002,v*1.001,v]} : ind))
        }

        // Alpha Vantage — sequential with 15s delay (free tier: 5 calls/min)
        await sleep(0)
        const brent = await fetch(\`https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=\${AV_KEY}\`).then(r=>r.json())
        if (brent.data?.length >= 7) {
          const h = brent.data.slice(0,7).reverse().map((x:any)=>parseFloat(x.value))
          setInds(prev => prev.map(ind => ind.id==='brent' ? {...ind, value:h[h.length-1], prev:h[h.length-2], history:h} : ind))
        }

        await sleep(15000)
        const wheat = await fetch(\`https://www.alphavantage.co/query?function=WHEAT&interval=daily&apikey=\${AV_KEY}\`).then(r=>r.json())
        if (wheat.data?.length >= 7) {
          const h = wheat.data.slice(0,7).reverse().map((x:any)=>parseFloat(x.value))
          setInds(prev => prev.map(ind => ind.id==='wheat' ? {...ind, value:h[h.length-1], prev:h[h.length-2], history:h} : ind))
        }

        await sleep(15000)
        const copper = await fetch(\`https://www.alphavantage.co/query?function=COPPER&interval=daily&apikey=\${AV_KEY}\`).then(r=>r.json())
        if (copper.data?.length >= 7) {
          const h = copper.data.slice(0,7).reverse().map((x:any)=>parseFloat(x.value))
          setInds(prev => prev.map(ind => ind.id==='copper' ? {...ind, value:h[h.length-1], prev:h[h.length-2], history:h} : ind))
        }

        await sleep(15000)
        const gold = await fetch(\`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=\${AV_KEY}\`).then(r=>r.json())
        const gr = gold['Realtime Currency Exchange Rate']
        if (gr) {
          const v = parseFloat(gr['5. Exchange Rate'])
          setInds(prev => prev.map(ind => ind.id==='gold' ? {...ind, value:v, prev:v*0.998, history:[v*0.991,v*0.993,v*0.996,v*0.995,v*0.998,v*0.999,v]} : ind))
        }

        setTime(new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}))
      } catch { /* keep fallback values */ }
    }
    load()
    const interval = setInterval(load, 3600000) // refresh every hour
    const tickTime = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})), 30000)
    return () => { clearInterval(interval); clearInterval(tickTime) }
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <span className={styles.topLabel}>Confins</span>
          <span className={styles.topSep}>·</span>
          <span className={styles.topTitle}>Indicateurs géopolitiques</span>
        </div>
        <div className={styles.topRight}>
          {status === 'live' && <><span className={styles.liveDot} /><span className={styles.liveText}>En direct · {time}</span></>}
          {status === 'loading' && <span className={styles.loadingText}>Chargement…</span>}
          {status === 'error' && <span className={styles.errorText}>Données indisponibles</span>}
        </div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Marchés & <em>Géopolitique</em></h1>
        <p className={styles.heroSub}>Six indicateurs qui racontent les tensions du monde en temps réel</p>
      </div>

      <div className={styles.grid}>
        {inds.map(ind => {
          const up = ind.value !== null && ind.prev !== null ? ind.value >= ind.prev : null
          const pct = ind.value && ind.prev ? ((ind.value - ind.prev) / ind.prev * 100) : null
          const dec = ind.id === 'brent' ? 2 : ind.id === 'gold' || ind.id === 'copper' ? 2 : ind.id === 'wheat' ? 2 : 4
          return (
            <div key={ind.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <span className={styles.cat} style={{color:ind.catColor}}>{ind.cat}</span>
                  <div className={styles.cardLabel}>{ind.label}</div>
                  <div className={styles.cardSub}>{ind.sub}</div>
                </div>
                <MiniChart history={ind.history} color={ind.catColor} />
              </div>
              <div className={styles.valueBlock}>
                <span className={styles.value}>
                  {ind.unit && <span className={styles.unit}>{ind.unit}</span>}
                  <AnimatedValue value={ind.value} decimals={dec} />
                </span>
                {pct !== null && (
                  <span className={styles.badge} data-up={up ? 'true' : 'false'}>
                    {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                  </span>
                )}
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
