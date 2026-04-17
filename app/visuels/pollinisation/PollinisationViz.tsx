// @ts-nocheck
'use client'
import { useEffect, useRef, useState } from 'react'

/* ── DONNÉES ─────────────────────────────────────── */

const COLONY_LOSS = [
  { country: 'États-Unis', code: 'US', loss2000: 15, loss2010: 29, loss2023: 48, x: 18, y: 38 },
  { country: 'France',     code: 'FR', loss2000: 12, loss2010: 24, loss2023: 44, x: 46, y: 30 },
  { country: 'Allemagne',  code: 'DE', loss2000: 10, loss2010: 22, loss2023: 38, x: 49, y: 27 },
  { country: 'Italie',     code: 'IT', loss2000: 8,  loss2010: 20, loss2023: 35, x: 50, y: 33 },
  { country: 'Espagne',    code: 'ES', loss2000: 11, loss2010: 26, loss2023: 41, x: 44, y: 34 },
  { country: 'Chine',      code: 'CN', loss2000: 6,  loss2010: 18, loss2023: 32, x: 73, y: 34 },
  { country: 'Inde',       code: 'IN', loss2000: 5,  loss2010: 12, loss2023: 28, x: 68, y: 42 },
  { country: 'Brésil',     code: 'BR', loss2000: 4,  loss2010: 14, loss2023: 31, x: 28, y: 58 },
  { country: 'Canada',     code: 'CA', loss2000: 14, loss2010: 27, loss2023: 42, x: 17, y: 27 },
  { country: 'Australie',  code: 'AU', loss2000: 3,  loss2010: 9,  loss2023: 18, x: 78, y: 68 },
]

const CROPS = [
  { name: 'Amandes',     dep: 100, value: 5.6,  color: '#7B5380', emoji: '🌰' },
  { name: 'Café',        dep: 95,  value: 9.1,  color: '#5B3A6B', emoji: '☕' },
  { name: 'Cacao',       dep: 80,  value: 4.3,  color: '#8B4513', emoji: '🍫' },
  { name: 'Tomates',     dep: 75,  value: 11.8, color: '#C0392B', emoji: '🍅' },
  { name: 'Fraises',     dep: 90,  value: 3.2,  color: '#E74C3C', emoji: '🍓' },
  { name: 'Soja',        dep: 40,  value: 23.4, color: '#27AE60', emoji: '🌱' },
  { name: 'Colza',       dep: 50,  value: 2.8,  color: '#F39C12', emoji: '🌼' },
  { name: 'Coton',       dep: 25,  value: 7.2,  color: '#95A5A6', emoji: '🌿' },
  { name: 'Blé',         dep: 5,   value: 42.1, color: '#D4AC0D', emoji: '🌾' },
  { name: 'Maïs',        dep: 5,   value: 38.7, color: '#F0E68C', emoji: '🌽' },
]

const FRACTURE = [
  { region: 'Amérique du Nord',   access: 85, pop: 500,   farmers: 3,   x: 17, y: 35 },
  { region: 'Europe',             access: 78, pop: 750,   farmers: 10,  x: 48, y: 28 },
  { region: 'Chine / Corée',      access: 60, pop: 1500,  farmers: 240, x: 73, y: 35 },
  { region: 'Amérique latine',    access: 20, pop: 660,   farmers: 60,  x: 27, y: 57 },
  { region: 'Asie du Sud',        access: 8,  pop: 2000,  farmers: 300, x: 67, y: 44 },
  { region: 'Afrique subsaharienne', access: 3, pop: 1200, farmers: 400, x: 50, y: 58 },
  { region: 'Moyen-Orient',       access: 30, pop: 400,   farmers: 15,  x: 57, y: 38 },
]

/* ── HOOK scroll ─────────────────────────────────── */
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const onScroll = () => {
        const rect = el.getBoundingClientRect()
        const total = el.offsetHeight - window.innerHeight
        if (total <= 0) { setProgress(1); return }
        const scrolled = -rect.top
        setProgress(Math.max(0, Math.min(1, scrolled / total)))
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }, { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return progress
}

function useInView(ref, threshold = 0.3) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, threshold])
  return visible
}

/* ── ACTE 1 : L'effondrement ─────────────────────── */
function ActeEffondrement() {
  const ref = useRef(null)
  const visible = useInView(ref, 0.2)
  const [year, setYear] = useState(0)
  const [hovered, setHovered] = useState(null)

  const years = [2000, 2010, 2023]
  const yearKeys = ['loss2000', 'loss2010', 'loss2023']

  useEffect(() => {
    if (!visible) return
    let i = 0
    const interval = setInterval(() => {
      if (i < years.length - 1) { i++; setYear(i) }
      else clearInterval(interval)
    }, 1200)
    return () => clearInterval(interval)
  }, [visible])

  const currentKey = yearKeys[year]

  return (
    <div ref={ref} style={{ padding: '64px 0 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontFamily: "'DM Sans',sans-serif", marginBottom: '12px' }}>Acte I</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#111', marginBottom: '12px' }}>
          L'effondrement silencieux
        </h2>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#666', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
          Perte annuelle de colonies d'abeilles par région, en pourcentage
        </p>
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '40px' }}>
        {years.map((y, i) => (
          <button key={y} onClick={() => setYear(i)}
            style={{
              padding: '8px 24px', border: 'none', cursor: 'pointer',
              background: year === i ? '#111' : 'transparent',
              color: year === i ? '#fff' : '#999',
              fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: 600,
              letterSpacing: '1px', transition: 'all 0.3s',
              borderBottom: year === i ? '2px solid #111' : '2px solid #eee',
            }}>
            {y}
          </button>
        ))}
      </div>

      {/* Bulle monde */}
      <div style={{ position: 'relative', height: '320px', maxWidth: '680px', margin: '0 auto' }}>
        {/* Fond carte simplifié */}
        <svg viewBox="0 0 100 75" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <ellipse cx="50" cy="38" rx="48" ry="34" fill="#111" />
        </svg>

        {COLONY_LOSS.map((d, i) => {
          const val = d[currentKey]
          const size = 18 + val * 0.6
          const opacity = 0.3 + (val / 50) * 0.7
          const isHot = val >= 40
          return (
            <div key={d.code}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: `${d.x}%`, top: `${d.y}%`,
                transform: 'translate(-50%,-50%)',
                width: `${size}px`, height: `${size}px`,
                borderRadius: '50%',
                background: isHot
                  ? `rgba(180,20,20,${opacity})`
                  : `rgba(90,30,110,${opacity})`,
                border: hovered?.code === d.code ? '2px solid #111' : '1.5px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isHot ? `0 0 ${size/2}px rgba(180,20,20,0.25)` : 'none',
              }}>
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>
                {val}%
              </span>
            </div>
          )
        })}

        {/* Tooltip */}
        {hovered && (
          <div style={{
            position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
            background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '4px',
            fontFamily: "'DM Sans',sans-serif", fontSize: '12px', whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 10,
          }}>
            <strong>{hovered.country}</strong> — {hovered[currentKey]}% de pertes en {years[year]}
            <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
              vs {hovered.loss2000}% en 2000
            </div>
          </div>
        )}
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
        {[['< 20%', 'rgba(90,30,110,0.4)'], ['20–39%', 'rgba(90,30,110,0.7)'], ['≥ 40%', 'rgba(180,20,20,0.8)']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans',sans-serif", fontSize: '11px', color: '#666' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '13px', color: '#999' }}>
        Sources : USDA Honey Bee Colonies Report 2023, COLOSS BeeBook Europa 2023
      </div>
    </div>
  )
}

/* ── ACTE 2 : Ce qui disparaîtrait ──────────────── */
function ActeAssiette() {
  const ref = useRef(null)
  const visible = useInView(ref, 0.2)
  const [revealed, setRevealed] = useState(0)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    if (!visible) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setRevealed(i)
      if (i >= CROPS.length) clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [visible])

  const sorted = [...CROPS].sort((a, b) => b.dep - a.dep)

  return (
    <div ref={ref} style={{ padding: '64px 0 80px', background: '#fafaf8' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontFamily: "'DM Sans',sans-serif", marginBottom: '12px' }}>Acte II</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#111', marginBottom: '12px' }}>
          Ce qui disparaîtrait de notre assiette
        </h2>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#666', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
          Dépendance des cultures à la pollinisation animale
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        {sorted.map((crop, i) => (
          <div key={crop.name}
            onMouseEnter={() => setHovered(crop)}
            onMouseLeave={() => setHovered(null)}
            style={{
              marginBottom: '14px',
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <span style={{ fontSize: '16px', width: '22px' }}>{crop.emoji}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, color: '#333', width: '80px', flexShrink: 0 }}>{crop.name}</span>
              <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${crop.dep}%`,
                  background: crop.dep >= 75 ? '#B91C1C' : crop.dep >= 40 ? '#7B5380' : '#9CA3AF',
                  borderRadius: '3px',
                  transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                  transitionDelay: `${i * 0.05}s`,
                }} />
              </div>
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 700,
                color: crop.dep >= 75 ? '#B91C1C' : crop.dep >= 40 ? '#7B5380' : '#9CA3AF',
                width: '38px', textAlign: 'right', flexShrink: 0,
              }}>{crop.dep}%</span>
            </div>
          </div>
        ))}
      </div>

      {hovered && (
        <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '14px', color: '#555', minHeight: '24px' }}>
          {hovered.dep >= 75
            ? `Les ${hovered.name.toLowerCase()} disparaîtraient presque entièrement sans pollinisateurs.`
            : hovered.dep >= 40
            ? `La production de ${hovered.name.toLowerCase()} chuterait de plus de moitié.`
            : `Le ${hovered.name.toLowerCase()} est peu dépendant des pollinisateurs.`
          }
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{ display: 'inline-flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['≥ 75% — disparition quasi-totale', '#B91C1C'], ['40–74% — perte majeure', '#7B5380'], ['< 40% — peu affecté', '#9CA3AF']].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans',sans-serif", fontSize: '11px', color: '#666' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '13px', color: '#999' }}>
        Source : IPBES Global Assessment on Pollinators 2016, FAO 2023
      </div>
    </div>
  )
}

/* ── ACTE 3 : La fracture ────────────────────────── */
function ActeFracture() {
  const ref = useRef(null)
  const visible = useInView(ref, 0.2)
  const [hovered, setHovered] = useState(null)

  const sorted = [...FRACTURE].sort((a, b) => a.access - b.access)

  return (
    <div ref={ref} style={{ padding: '64px 0 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontFamily: "'DM Sans',sans-serif", marginBottom: '12px' }}>Acte III</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#111', marginBottom: '12px' }}>
          Qui pourra se payer<br /><em style={{ color: '#B91C1C' }}>la pollinisation artificielle ?</em>
        </h2>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#666', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
          Probabilité d'accès aux technologies de pollinisation artificielle d'ici 2035, par région
        </p>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
        {sorted.map((d, i) => {
          const isVulnerable = d.access < 20
          return (
            <div key={d.region}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 16px', marginBottom: '8px',
                background: hovered?.region === d.region ? '#f5f5f5' : 'transparent',
                borderLeft: `3px solid ${isVulnerable ? '#B91C1C' : d.access >= 60 ? '#27AE60' : '#D97706'}`,
                borderRadius: '2px', cursor: 'default',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
              }}>
              <div style={{ width: '160px', flexShrink: 0 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, color: '#222' }}>{d.region}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: '#999', marginTop: '2px' }}>
                  {d.farmers}M agriculteurs
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: visible ? `${d.access}%` : '0%',
                    background: isVulnerable ? '#B91C1C' : d.access >= 60 ? '#27AE60' : '#D97706',
                    borderRadius: '4px',
                    transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.08 + 0.2}s`,
                  }} />
                </div>
              </div>
              <div style={{
                width: '44px', textAlign: 'right', flexShrink: 0,
                fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: 700,
                color: isVulnerable ? '#B91C1C' : d.access >= 60 ? '#27AE60' : '#D97706',
              }}>
                {d.access}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Chiffre-clé */}
      <div style={{
        maxWidth: '480px', margin: '48px auto 0',
        borderTop: '1px solid #eee', borderBottom: '1px solid #eee',
        padding: '32px 24px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(48px,8vw,80px)', fontWeight: 400, color: '#B91C1C', lineHeight: 1 }}>
          700M
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '16px', color: '#555', marginTop: '12px' }}>
          agriculteurs dans les pays à faible revenu dépendent entièrement des pollinisateurs sauvages, sans alternative possible
        </div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: '#bbb', marginTop: '12px', letterSpacing: '1px' }}>
          SOURCE : FAO, THE STATE OF FOOD AND AGRICULTURE 2023
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '13px', color: '#999' }}>
        Estimation SOARA d'après FAO 2023, Dronenomics Report 2024, USAID Agricultural Outlook
      </div>
    </div>
  )
}

/* ── COMPOSANT PRINCIPAL ─────────────────────────── */
export default function PollinisationViz() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", maxWidth: '100%', overflow: 'hidden' }}>

      {/* Séparateur d'entrée */}
      <div style={{
        textAlign: 'center', padding: '48px 20px 32px',
        borderTop: '1px solid #e8e4df',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '1px', background: '#ccc' }} />
          <span style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', fontFamily: "'DM Sans',sans-serif" }}>
            Données
          </span>
          <div style={{ width: '40px', height: '1px', background: '#ccc' }} />
        </div>
      </div>

      <ActeEffondrement />

      <div style={{ borderTop: '1px solid #e8e4df' }} />
      <ActeAssiette />

      <div style={{ borderTop: '1px solid #e8e4df' }} />
      <ActeFracture />

    </div>
  )
}
