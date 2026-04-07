'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

// ── Courbe d'accélération éditorial — douce, élégante
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.dataset.revealed = 'true'
        obs.disconnect()
      }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

// ── Section fade-up — léger, 28px, courbe souple
export function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useReveal(0.06)
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(32px)',
        transition: `opacity 0.75s ${EASE} ${delay}s, transform 0.75s ${EASE} ${delay}s`,
      }}
      onTransitionEnd={() => {}}
      data-fade-section
    >
      {children}
    </div>
  )
}

// ── Carte fade-up individuelle
export function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useReveal(0.08)
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: `opacity 0.6s ${EASE} ${delay}s, transform 0.6s ${EASE} ${delay}s`,
      }}
      data-fade-card
    >
      {children}
    </div>
  )
}

// ── Grille staggerée — chaque enfant entre avec 60ms de décalage
export function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = Array.from(el.querySelectorAll('[data-stagger-item]')) as HTMLElement[]
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1'
            item.style.transform = 'translateY(0)'
          }, i * 60)
        })
        obs.disconnect()
      }
    }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} className={className}>{children}</div>
}

export function StaggerItem({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div
      data-stagger-item
      style={{
        opacity: 0,
        transform: 'translateY(18px)',
        transition: `opacity 0.55s ${EASE}, transform 0.55s ${EASE}`,
      }}
    >
      {children}
    </div>
  )
}

// ── Parallax image — scroll lent sur le hero
export function HeroParallax({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.transform = `translateY(${window.scrollY * 0.18}px)`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      style={{
        width: '100%', height: '108%', objectFit: 'cover',
        display: 'block', willChange: 'transform',
        marginTop: '-4%',
      }}
    />
  )
}

// ── Compteur animé au scroll
export function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return <div>{value} {label}</div>
}

// ── Wrappers passthrough
export function EnCeMoment({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function StatCount({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function AnimatedGrain() { return null }

// ── Inject le CSS d'activation
// Les [data-revealed] doivent déclencher l'animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    [data-fade-section][data-revealed="true"],
    [data-fade-card][data-revealed="true"] {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `
  document.head.appendChild(style)
}
