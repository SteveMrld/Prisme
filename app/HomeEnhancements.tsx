'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── 1. GRAIN ANIMÉ ──────────────────────────────────────────
export function AnimatedGrain() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        animation: 'grainShift 0.5s steps(1) infinite',
      }}
    />
  )
}

// ── 2. COUNTUP STAT ────────────────────────────────────────
export function StatCount({ value, suffix = '', prefix = '', label }: {
  value: number; suffix?: string; prefix?: string; label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const dur = 1800
    const start = Date.now()
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * value))
      if (p >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px 0', borderBottom: '1px solid var(--bord)' }}
    >
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(32px, 4vw, 52px)',
        fontWeight: 300,
        color: 'var(--encre)',
        lineHeight: 1,
        letterSpacing: '-1.5px',
      }}>
        {prefix}{count.toLocaleString('fr-FR')}{suffix}
      </span>
      <span style={{
        fontSize: '9px',
        fontWeight: 600,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: 'var(--gris-l)',
        lineHeight: 1.6,
      }}>{label}</span>
    </motion.div>
  )
}

// ── 3. SECTION "EN CE MOMENT" ──────────────────────────────
const actus = [
  { cat: 'GÉOPOLITIQUE', catColor: 'var(--geo)', text: 'Iran frappe Ras Laffan — dommages considérables sur le 1er site GNL mondial', time: 'Il y a 2h', href: '/articles/france_maritime' },
  { cat: 'ÉCONOMIE', catColor: 'var(--eco)', text: 'Brent +6% à 87$ — première hausse significative depuis trois semaines', time: 'Il y a 4h', href: '/articles/techgeo' },
  { cat: 'GÉOPOLITIQUE', catColor: 'var(--geo)', text: 'Trump/South Pars : Washington ouvre des négociations directes sur le gaz iranien', time: 'Il y a 5h', href: '/articles/venezuela' },
]

export function EnCeMoment() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % actus.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        borderTop: '1px solid var(--bord)',
        borderBottom: '1px solid var(--bord)',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        minHeight: '72px',
      }}>
        {/* Label gauche */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRight: '1px solid var(--bord)',
          padding: '0 20px',
          background: 'var(--encre)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#e03030',
            boxShadow: '0 0 0 0 rgba(224,48,48,0.4)',
            animation: 'livePulse 1.8s ease-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '8px', fontWeight: 700,
            letterSpacing: '2.5px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            whiteSpace: 'nowrap',
          }}>En ce moment</span>
        </div>

        {/* Actus défilantes */}
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          {actus.map((a, i) => (
            <motion.a
              key={i}
              href={a.href}
              animate={{
                opacity: i === active ? 1 : 0,
                y: i === active ? 0 : 8,
              }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center',
                gap: '14px', padding: '0 28px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: '7px', fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: a.catColor, flexShrink: 0,
              }}>{a.cat}</span>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                fontWeight: 400,
                color: 'var(--encre)',
                lineHeight: 1.3,
                flex: 1,
              }}>{a.text}</span>
              <span style={{
                fontSize: '9px', color: 'var(--gris-l)',
                letterSpacing: '0.5px', flexShrink: 0,
                display: 'none',
              }} className="actu-time">{a.time}</span>
            </motion.a>
          ))}

          {/* Dots navigation */}
          <div style={{
            position: 'absolute', right: '20px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', gap: '5px', zIndex: 2,
          }}>
            {actus.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? '14px' : '5px',
                  height: '5px',
                  borderRadius: '3px',
                  background: i === active ? 'var(--encre)' : 'var(--bord)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease', padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
