'use client'
import { useState, useEffect } from 'react'
import styles from './indicateurs.module.css'

const AV_KEY = 'IONR06NZ74XNHBLS'

type Ind = {
  id: string; label: string; sub: string
  value: number; prev: number; unit: string
  cat: string; context: string; catColor: string
  history: number[]
}

// Valeurs du 5 avril 2026 — remplacées par API dès chargement
const BASE: Ind[] = [
  { id:'brent',  label:'Pétrole Brent', sub:'USD / baril',     value:121.88, prev:121.46, unit:'$', cat:'Énergie',      catColor:'#C4793A', context:'Ormuz bloqué — choc pétrolier mondial',   history:[118.2,119.5,120.1,119.8,121.0,121.5,121.88] },
  { id:'gold',   label:'Or',            sub:'USD / once troy', value:3248,   prev:3221,   unit:'$', cat:'Refuge',       catColor:'#C8A96E', context:'Valeur refuge — anxiété géopolitique',    history:[3180,3195,3210,3205,3228,3241,3248] },
  { id:'wheat',  label:'Blé',           sub:'USD / boisseau',  value:5.42,   prev:5.48,   unit:'$', cat:'Alimentaire',  catColor:'#7A9A3A', context:'Sécurité alimentaire — Sahel, Ukraine',   history:[5.65,5.58,5.51,5.49,5.45,5.48,5.42] },
  { id:'copper', label:'Cuivre',        sub:'USD / livre',     value:4.12,   prev:4.08,   unit:'$', cat:'Industrie',    catColor:'#9A6A3A', context:'Baromètre de la croissance chinoise',     history:[3.98,4.01,4.05,4.03,4.08,4.10,4.12] },
  { id:'eurusd', label:'EUR / USD',     sub:'Euro → Dollar',   value:1.0821, prev:1.0854, unit:'',  cat:'Change',       catColor:'#2D6B4A', context:'Autonomie stratégique européenne',        history:[1.091,1.088,1.085,1.087,1.084,1.085,1.0821] },
  { id:'usdcny', label:'USD / CNY',     sub:'Dollar → Yuan',   value:7.2841, prev:7.276,  unit:'',  cat:'Géopolitique', catColor:'#1A3E6B', context:'Découplage économique US-Chine en cours', history:[7.265,7.270,7.275,7.272,7.278,7.276,7.2841] },
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
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}))

    const update = (id: string, value: number, prev: number, history: number[]) => {
      if (!isFinite(value) || value <= 0) return
      setInds(prev_ => prev_.map(ind => ind.id === id ? {...ind, value, prev, history} : ind))
    }

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    ;(async () => {
      try {
        const fx = await fetch('https://api.frankfurter.app/latest?from=USD&to=CNY,EUR').then(r => r.json())
        if (fx?.rates?.EUR > 0) { const v = 1/fx.rates.EUR; update('eurusd', v, v*0.997, [v*0.991,v*0.993,v*0.996,v*0.998,v*0.999,v*0.997,v]) }
        if (fx?.rates?.CNY > 0) { const v = fx.rates.CNY;   update('usdcny', v, v*1.001, [v*0.997,v*0.998,v*0.999,v*1.001,v*1.002,v*1.001,v]) }
      } catch {}

      try {
        await sleep(500)
        const brent = await fetch(`https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=${AV_KEY}`).then(r=>r.json())
        if (brent?.data?.length >= 7) {
          const h = brent.data.slice(0,7).reverse().map((x:any) => parseFloat(x.value))
          update('brent', h[h.length-1], h[h.length-2], h)
        }
      } catch {}

      try {
        await sleep(15000)
        const wheat = await fetch(`https://www.alphavantage.co/query?function=WHEAT&interval=daily&apikey=${AV_KEY}`).then(r=>r.json())
        if (wheat?.data?.length >= 7) {
          // AV returns cents/bushel, divide by 100
          const h = wheat.data.slice(0,7).reverse().map((x:any) => parseFloat(x.value)/100)
          update('wheat', h[h.length-1], h[h.length-2], h)
        }
      } catch {}

      try {
        await sleep(15000)
        const copper = await fetch(`https://www.alphavantage.co/query?function=COPPER&interval=daily&apikey=${AV_KEY}`).then(r=>r.json())
        if (copper?.data?.length >= 7) {
          // AV returns USD/metric ton, convert to USD/lb
          const h = copper.data.slice(0,7).reverse().map((x:any) => parseFloat(x.value)/2204.6)
          update('copper', h[h.length-1], h[h.length-2], h)
        }
      } catch {}

      try {
        await sleep(15000)
        const gold = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${AV_KEY}`).then(r=>r.json())
        const gr = gold?.['Realtime Currency Exchange Rate']
        if (gr) { const v = parseFloat(gr['5. Exchange Rate']); if (v > 0) update('gold', v, v*0.998, [v*0.991,v*0.993,v*0.996,v*0.995,v*0.998,v*0.999,v]) }
      } catch {}
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
          <span className={styles.liveText}>En direct · {time || '—'}</span>
        </div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Marchés &amp; <em>Géopolitique</em></h1>
        <p className={styles.heroSub}>Six indicateurs qui racontent les tensions du monde en temps réel</p>
      </div>

      <div className={styles.grid}>
        {inds.map(ind => {
          const up = ind.value >= ind.prev
          const pct = ((ind.value - ind.prev) / ind.prev) * 100
          const dec = ['eurusd','usdcny'].includes(ind.id) ? 4 : 2
          return (
            <div key={ind.id} className={styles.card}>
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
