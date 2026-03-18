'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import CountUp from './CountUp'

interface Stat {
  num: number
  prefix?: string
  suffix?: string
  label: string
  color?: string
}

interface Props {
  stats: Stat[]
}

export default function AnimatedStats({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
      gap: '1px',
      background: 'var(--bord)',
      margin: '40px 0',
    }}>
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: 'var(--bg)', padding: '24px 28px' }}
        >
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '40px',
            fontWeight: 300,
            letterSpacing: '-1.5px',
            color: s.color || 'var(--encre)',
            lineHeight: 1,
            marginBottom: '10px',
          }}>
            {s.prefix || ''}
            <CountUp value={s.num} suffix={s.suffix || ''} duration={2.5} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--gris-m)', lineHeight: 1.5 }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
