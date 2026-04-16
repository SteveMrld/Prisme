'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'

const EN_PORTRAIT_SLUGS = new Set(["morin","obama","morrison","musk","tutu","nooyi","moreno","wanghuning"])

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
        transform: 'translateY(16px)',
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
        width: '100%', height: '112%', objectFit: 'cover',
        display: 'block', willChange: 'transform',
        marginTop: '-6%',
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

export function PortraitsSlider({ articles }: { articles: Array<{ slug: string; image: string; title: string; description?: string }> }) {
  const [current, setCurrent] = React.useState(0)
  const total = articles.length
  const touchStartX = React.useRef<number>(0)

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
  }

  // Show 3 cards at once, centered on current
  const visible = [-1, 0, 1].map(offset => {
    const idx = (current + offset + total) % total
    return { article: articles[idx], offset }
  })

  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '0 0 16px' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ display: 'flex', gap: '16px', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}>
        {visible.map(({ article, offset }) => (
          <a
            key={article.slug + offset}
            href={`/articles/${article.slug}`}
            style={{
              flex: '0 0 calc(33.333% - 11px)',
              textDecoration: 'none',
              color: 'inherit',
              opacity: offset === 0 ? 1 : 0.5,
              transform: offset === 0 ? 'scale(1)' : 'scale(0.92)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <div style={{ background: '#f5f4f1', overflow: 'hidden', aspectRatio: '3/4' }}>
              <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
            </div>
            <div style={{ padding: '12px 4px 0' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>Portrait</span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 700, color: '#111', lineHeight: 1.3, marginTop: '4px' }} dangerouslySetInnerHTML={{ __html: article.title }} />
              {EN_PORTRAIT_SLUGS.has(article.slug) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: '1.5px', color: '#C8A96E', textTransform: 'uppercase', marginTop: '5px' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  EN
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={prev} style={{ background: 'none', border: '1px solid #DDD9D2', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '16px' }}>←</button>
        <div style={{ display: 'flex', gap: '6px' }}>
          {articles.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? '#C8A96E' : '#DDD9D2', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
          ))}
        </div>
        <button onClick={next} style={{ background: 'none', border: '1px solid #DDD9D2', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '16px' }}>→</button>
      </div>
    </div>
  )
}
