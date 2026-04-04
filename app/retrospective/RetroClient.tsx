'use client'
import { useEffect, useRef } from 'react'
import styles from './retrospective.module.css'

export function AnimatedItem({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(32px)',
        transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s`,
      }}
    >
      {children}
    </div>
  )
}

export function AnimatedStat({ num, unit, label }: { num: string, unit?: string, label: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = parseFloat(num.replace(/[^0-9.]/g, ''))
    if (isNaN(target)) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 1200
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(ease * target * 10) / 10
            el.textContent = num.includes('.') ? current.toFixed(1) : String(Math.round(current))
            if (progress < 1) requestAnimationFrame(animate)
            else el.textContent = num.replace(/[0-9.]+/, String(target))
          }
          requestAnimationFrame(animate)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [num])

  return <span ref={ref}>{num}</span>
}

export function HeroAnimated({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}
    >
      {children}
    </div>
  )
}
