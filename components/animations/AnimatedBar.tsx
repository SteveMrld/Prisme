'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Bar {
  label: string
  value: number
  color?: string
  suffix?: string
}

interface Props {
  bars: Bar[]
  title?: string
}

export default function AnimatedBar({ bars, title }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} style={{
      margin: '40px 0',
      padding: '28px 32px',
      background: 'var(--papier)',
      borderLeft: '3px solid var(--or)',
    }}>
      {title && (
        <div style={{
          fontSize: '8px',
          fontWeight: 700,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: 'var(--gris-l)',
          marginBottom: '20px',
        }}>{title}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {bars.map((bar, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--gris)', fontWeight: 500 }}>{bar.label}</span>
              <span style={{ fontSize: '12px', color: bar.color || 'var(--or)', fontWeight: 600 }}>
                {bar.value}{bar.suffix || '%'}
              </span>
            </div>
            <div style={{ height: '4px', background: 'var(--bord)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${bar.value}%` } : {}}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: bar.color || 'var(--or)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
