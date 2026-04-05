'use client'
import { useEffect, useRef, useState } from 'react'

export function FadeSection({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='translateY(0)'; obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity:0, transform:'translateY(28px)', transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  )
}

export function FadeCard({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='translateY(0)'; obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity:0, transform:'translateY(20px)', transition:`opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s` }}>
      {children}
    </div>
  )
}

export function StaggerGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='translateY(0)'; obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity:0, transform:'translateY(16px)', transition:`opacity 0.5s ease ${index*0.07}s, transform 0.5s ease ${index*0.07}s` }}>
      {children}
    </div>
  )
}

export function HeroParallax({ src, alt }: { src: string, alt: string }) {
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const scrollY = window.scrollY
      ref.current.style.transform = `translateY(${scrollY * 0.25}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', willChange:'transform', transition:'transform 0.1s linear' }}
    />
  )
}

export function AnimatedCounter({ value, label }: { value: string, label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const num = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = performance.now()
        const animate = (now: number) => {
          const p = Math.min((now - start) / 1000, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = value.replace(/[0-9.]+/, String(Math.round(ease * num)))
          if (p < 1) requestAnimationFrame(animate)
          else el.textContent = value
        }
        requestAnimationFrame(animate)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])
  return <span ref={ref}>{value}</span>
}

export function EnCeMoment({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function StatCount({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function AnimatedGrain() { return null }
