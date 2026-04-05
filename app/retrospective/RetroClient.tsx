'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './retrospective.module.css'

/* ── SCROLL PROGRESS ── */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, height:'2px', zIndex:999, background:'var(--bord)' }}>
      <div style={{ height:'100%', background:'var(--encre)', width:`${pct}%`, transition:'width 0.1s linear' }} />
    </div>
  )
}

/* ── HERO ANIMATED ── */
export function HeroAnimated({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }, [])
  return <div ref={ref}>{children}</div>
}

/* ── ANIMATED ITEM ── */
export function AnimatedItem({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
        obs.disconnect()
      }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity:0, transform:'translateY(40px)', transition:`opacity 0.8s ease ${index * 0.05}s, transform 0.8s ease ${index * 0.05}s` }}>
      {children}
    </div>
  )
}

/* ── ANIMATED STAT ── */
export function AnimatedStat({ num, label }: { num: string, label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = parseFloat(num.replace(/[^0-9.]/g, ''))
    if (isNaN(target)) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const dur = 1400
        const startTime = performance.now()
        const go = (now: number) => {
          const p = Math.min((now - startTime) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = num.includes('.') ? (ease * target).toFixed(1) : String(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(go)
          else el.textContent = num.replace(/[0-9.]+/, String(target))
        }
        requestAnimationFrame(go)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [num])
  return <span ref={ref}>{num}</span>
}

/* ── BAR CHART ── */
function BarChart({ data, color }: { data: { label: string, value: number }[], color: string }) {
  const ref = useRef<SVGGElement>(null)
  const max = Math.max(...data.map(d => d.value))
  const W = 200, H = 80, bar = W / data.length - 6
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rects = el.querySelectorAll('rect')
    rects.forEach(r => { r.style.height = '0'; r.style.y = '80' })
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        rects.forEach((r, i) => {
          const h = parseFloat(r.getAttribute('data-h') || '0')
          const y = H - h
          setTimeout(() => {
            r.style.transition = `height 0.7s ease ${i * 0.1}s, y 0.7s ease ${i * 0.1}s`
            r.style.height = `${h}px`
            r.style.y = `${y}px`
          }, 100)
        })
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <svg width={W} height={H + 18} style={{ overflow:'visible' }}>
      <g ref={ref}>
        {data.map((d, i) => {
          const h = (d.value / max) * (H - 4)
          const x = i * (bar + 6)
          return (
            <g key={i}>
              <rect x={x} y={H - h} width={bar} data-h={h} height={h} fill={color} opacity={0.85} rx={2} />
              <text x={x + bar / 2} y={H + 14} textAnchor="middle" fontSize={8} fill="var(--gris-l)">{d.label}</text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/* ── DONUT CHART ── */
function DonutChart({ pct, color, label }: { pct: number, color: string, label: string }) {
  const ref = useRef<SVGCircleElement>(null)
  const r = 30, cx = 40, cy = 40
  const circ = 2 * Math.PI * r
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.strokeDashoffset = String(circ)
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transition = 'stroke-dashoffset 1.2s ease'
        el.style.strokeDashoffset = String(circ * (1 - pct / 100))
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [pct, circ])
  return (
    <svg width={80} height={80}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bord)" strokeWidth={8} />
      <circle ref={ref} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={circ} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight="600" fill="var(--encre)">{pct}%</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize={7} fill="var(--gris-l)">{label}</text>
    </svg>
  )
}

/* ── LINE CHART ── */
function LineChart({ data, color }: { data: number[], color: string }) {
  const ref = useRef<SVGPathElement>(null)
  const W = 200, H = 70
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / (max - min || 1)) * (H - 8) - 4
    return `${x},${y}`
  })
  const d = `M ${pts.join(' L ')}`
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const len = el.getTotalLength()
    el.style.strokeDasharray = String(len)
    el.style.strokeDashoffset = String(len)
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transition = 'stroke-dashoffset 1.5s ease'
        el.style.strokeDashoffset = '0'
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <svg width={W} height={H} style={{ overflow:'visible' }}>
      <polyline points={pts.join(' ')} fill="none" stroke="var(--bord)" strokeWidth={1} />
      <path ref={ref} d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── THERMOMETER ── */
function Thermometer({ value, max, color }: { value: number, max: number, color: string }) {
  const ref = useRef<SVGRectElement>(null)
  const pct = value / max
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transition = 'height 1.2s ease, y 1.2s ease'
        el.style.height = `${pct * 60}px`
        el.style.y = `${60 - pct * 60}px`
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [pct])
  return (
    <svg width={80} height={90}>
      <rect x={32} y={4} width={16} height={66} rx={8} fill="var(--bord)" />
      <rect ref={el => { if (el) { el.setAttribute('data-el', '1') } }}
        x={32} y={64} width={16} data-h={pct * 60} height={0} rx={8} fill={color} />
      <circle cx={40} cy={76} r={10} fill={color} />
      <text x={40} y={80} textAnchor="middle" fontSize={9} fontWeight="700" fill="#fff">{value}°</text>
    </svg>
  )
}

/* ── GAUGE ── */
function TensionGauge({ level, color }: { level: number, color: string }) {
  const ref = useRef<SVGPathElement>(null)
  const r = 35, cx = 50, cy = 50
  const startAngle = -180, endAngle = 0
  const toRad = (a: number) => (a * Math.PI) / 180
  const arcPath = (a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(toRad(a1)), y1 = cy + r * Math.sin(toRad(a1))
    const x2 = cx + r * Math.cos(toRad(a2)), y2 = cy + r * Math.sin(toRad(a2))
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }
  const angle = startAngle + (level / 10) * 180
  const nx = cx + (r - 8) * Math.cos(toRad(angle))
  const ny = cy + (r - 8) * Math.sin(toRad(angle))
  return (
    <svg width={100} height={60}>
      <path d={arcPath(-180, 0)} fill="none" stroke="var(--bord)" strokeWidth={8} />
      <path d={arcPath(-180, startAngle + (level / 10) * 180)} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--encre)" strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill="var(--encre)" />
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={8} fill="var(--gris-l)">Niveau {level}/10</text>
    </svg>
  )
}

/* ── CHART SELECTOR ── */
export function MonthChart({ cat, chartType, chartData, color }: {
  cat: string, chartType: string, chartData: any, color: string
}) {
  if (chartType === 'bar') return <BarChart data={chartData} color={color} />
  if (chartType === 'donut') return <DonutChart pct={chartData.pct} color={color} label={chartData.label} />
  if (chartType === 'line') return <LineChart data={chartData} color={color} />
  if (chartType === 'gauge') return <TensionGauge level={chartData} color={color} />
  if (chartType === 'thermo') return <Thermometer value={chartData.value} max={chartData.max} color={color} />
  return null
}
