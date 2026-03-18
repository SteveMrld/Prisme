'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode, useRef, useEffect, useState } from 'react'

const ease = [0.22, 1, 0.36, 1]

export function ParallaxHero({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.img src={src} alt={alt} className={className} style={{ y }} />
    </div>
  )
}

// Barre de progression dorée en haut
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '2px', background: 'var(--or)',
        scaleX: scrollYProgress, transformOrigin: '0%', zIndex: 100,
      }}
    />
  )
}

// Compteur "X min restantes" — bas droite, apparaît après 5% de scroll
export function ReadingTimeCounter({ totalMinutes }: { totalMinutes: number }) {
  const { scrollYProgress } = useScroll()
  const [remaining, setRemaining] = useState(totalMinutes)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setVisible(v > 0.05 && v < 0.95)
      setRemaining(Math.max(1, Math.ceil((1 - v) * totalMinutes)))
    })
  }, [scrollYProgress, totalMinutes])

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', bottom: '28px', right: '20px', zIndex: 50,
        background: 'var(--encre)', padding: '7px 13px',
        display: 'flex', alignItems: 'center', gap: '7px',
        pointerEvents: 'none',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
        fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.6)',
      }}>
        {remaining} min
      </span>
    </motion.div>
  )
}
