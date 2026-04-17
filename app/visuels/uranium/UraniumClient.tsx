// @ts-nocheck
'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Header from '../../../components/Header'

/* ════════════════════════════════════════════════════════════════
   LA CASCADE — Enrichissement de l'uranium
   Atlas Soara. Grammaire visuelle : la centrifugeuse animée,
   répétée à l'échelle des capacités réelles, traversée par un flux
   de particules qui s'enrichissent.
   Sources : WNA Sept 2025, Centrus 10-K Fév 2026, Bruegel, CEA, AIEA
   ════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#0b0a08',
  surface: '#121110',
  text: '#efeae0',
  dim: '#8a837a',
  muted: '#5a544c',
  line: '#2a2620',
  lineSoft: '#1a1814',
  accent: '#b8922a',
  accentBright: '#d9ad3a',
  accentSoft: '#6a5318',
  accentDim: '#3a2f10',
  red: '#8e3a2b',
  redBright: '#b84a36',
}

const PROVIDERS = [
  { name: 'Rosatom', country: 'Russie', swu: 27, share: 43,
    plants: ['Novouralsk', 'Zelenogorsk', 'Angarsk', 'Seversk'] },
  { name: 'Urenco', country: 'RU · PB · DE · USA', swu: 17, share: 27,
    plants: ['Capenhurst', 'Almelo', 'Gronau', 'Eunice'] },
  { name: 'CNNC', country: 'Chine', swu: 11, share: 17,
    plants: ['Lanzhou', 'Hanzhong'] },
  { name: 'Orano', country: 'France', swu: 7.5, share: 12,
    plants: ['Tricastin'] },
  { name: 'Centrus', country: 'États-Unis', swu: 0.1, share: 0.1,
    plants: ['Piketon'] },
]

const PALIERS = [
  { value: '0,7', num: 0.7, label: 'Uranium naturel',
    desc: "La proportion d'uranium 235 présente dans tout gisement exploité. Tout le reste, 99,3 %, est de l'uranium 238 non fissile. L'enrichissement commence là.",
    military: false },
  { value: '3 à 5', num: 5, label: 'LEU · combustible civil',
    desc: "Le seuil de fonctionnement des quelque 440 réacteurs à eau pressurisée qui produisent aujourd'hui l'essentiel de l'électricité nucléaire mondiale.",
    military: false },
  { value: '≤ 20', num: 20, label: 'HALEU · petits réacteurs',
    desc: "Le palier visé par les réacteurs modulaires de nouvelle génération et par la plupart des réacteurs de recherche. Rosatom y règne sans rival commercial occidental.",
    military: false },
  { value: '60', num: 60, label: 'Le palier iranien', flagged: true,
    desc: "Le niveau déclaré depuis 2021 à Natanz et Fordo, bien au-delà du plafond de 3,67 % fixé par l'accord de Vienne de 2015. Un seuil qui ne sert aucun usage civil standard.",
    military: false },
  { value: '≥ 90', num: 90, label: 'HEU · qualité militaire',
    desc: "L'uranium hautement enrichi. À partir de ce seuil, quelques dizaines de kilogrammes suffisent à constituer le cœur d'une arme nucléaire.",
    military: true },
]

const INSTALLATIONS = [
  ['Novouralsk', 'Russie', 'civil'],
  ['Zelenogorsk', 'Russie', 'civil'],
  ['Angarsk', 'Russie', 'civil'],
  ['Seversk', 'Russie', 'civil'],
  ['Capenhurst', 'Royaume-Uni', 'civil'],
  ['Almelo', 'Pays-Bas', 'civil'],
  ['Gronau', 'Allemagne', 'civil'],
  ['Eunice', 'États-Unis', 'civil'],
  ['Tricastin', 'France', 'civil'],
  ['Lanzhou', 'Chine', 'civil'],
  ['Hanzhong', 'Chine', 'civil'],
  ['Piketon', 'États-Unis', 'HALEU'],
  ['Natanz', 'Iran', 'contesté'],
  ['Fordo', 'Iran', 'contesté'],
  ['Yongbyon', 'Corée du Nord', 'militaire'],
]

const UNIT = 0.3
const iconCount = (swu) => Math.max(1, Math.round(swu / UNIT))

/* ════════════════════════════════════════════════════════════════
   CENTRIFUGEUSE ANIMÉE
   ════════════════════════════════════════════════════════════════ */
function SpinningCentrifuge({ size = 'md', color = C.text, speed = 1, delay = 0, active = true }) {
  const dims = {
    xs: { w: 8, h: 34 },
    sm: { w: 10, h: 44 },
    md: { w: 14, h: 60 },
    lg: { w: 22, h: 96 },
    xl: { w: 42, h: 180 },
  }[size] || { w: 14, h: 60 }

  const id = useMemo(() => `cf-${Math.random().toString(36).slice(2, 9)}`, [])
  const rotorDur = `${(1.2 / speed).toFixed(2)}s`
  const gasDur = `${(2.4 / speed).toFixed(2)}s`

  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox="0 0 14 60"
      style={{ display: 'block', flexShrink: 0, filter: active ? 'none' : 'saturate(0.3)' }}
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="3.5" y="5" width="7" height="50" rx="0.5" />
        </clipPath>
        <linearGradient id={`${id}-tube`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.4" />
          <stop offset="0.2" stopColor={color} stopOpacity="1" />
          <stop offset="0.5" stopColor={color} stopOpacity="0.85" />
          <stop offset="0.8" stopColor={color} stopOpacity="1" />
          <stop offset="1" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect x="4" y="1" width="6" height="2" fill={color} opacity="0.9" />
      <rect x="5" y="0" width="4" height="1" fill={color} opacity="0.7" />

      <rect x="3.5" y="3" width="7" height="54" fill={`url(#${id}-tube)`} />
      <rect x="3.5" y="3" width="7" height="54" fill="none" stroke={color} strokeWidth="0.4" opacity="0.5" />

      <g clipPath={`url(#${id}-clip)`}>
        <g>
          <line x1="0" y1="0" x2="14" y2="18" stroke={C.bg} strokeWidth="0.8" opacity="0.45" />
          <line x1="0" y1="12" x2="14" y2="30" stroke={C.bg} strokeWidth="0.8" opacity="0.45" />
          <line x1="0" y1="24" x2="14" y2="42" stroke={C.bg} strokeWidth="0.8" opacity="0.45" />
          <line x1="0" y1="36" x2="14" y2="54" stroke={C.bg} strokeWidth="0.8" opacity="0.45" />
          <line x1="0" y1="48" x2="14" y2="66" stroke={C.bg} strokeWidth="0.8" opacity="0.45" />
          <line x1="0" y1="60" x2="14" y2="78" stroke={C.bg} strokeWidth="0.8" opacity="0.45" />
          {active && (
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 -12"
              to="0 0"
              dur={rotorDur}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          )}
        </g>
      </g>

      {active && (
        <circle cx="7" cy="30" r="0.8" fill={C.accentBright} opacity="0.9">
          <animate attributeName="cy" from="50" to="4" dur={gasDur} begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur={gasDur} begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      )}

      <rect x="2.5" y="56" width="9" height="2.5" fill={color} opacity="0.9" />
      <rect x="1.5" y="58" width="11" height="1" fill={color} opacity="0.6" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════
   COUNT UP
   ════════════════════════════════════════════════════════════════ */
function CountUp({ target, duration = 1600, decimals = 0, suffix = '', trigger = true }) {
  const [val, setVal] = useState(0)
  const startRef = useRef(null)
  useEffect(() => {
    if (!trigger) return
    let raf
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const p = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, trigger])
  return <>{val.toFixed(decimals).replace('.', ',')}{suffix}</>
}

/* ════════════════════════════════════════════════════════════════
   PARTICULES DE FOND (hero)
   ════════════════════════════════════════════════════════════════ */
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      dur: 8 + Math.random() * 10,
      delay: Math.random() * 8,
      isAccent: Math.random() < 0.1,
    })), []
  )

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      opacity: 0.5,
    }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.isAccent ? C.accentBright : C.dim,
          boxShadow: p.isAccent ? `0 0 6px ${C.accent}` : 'none',
          animation: `particleFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   LIGNE CASCADE
   ════════════════════════════════════════════════════════════════ */
function CascadeRow({ provider, revealed, rowIndex, isRosatom }) {
  const count = iconCount(provider.swu)
  const displayCount = provider.swu < 0.5 ? 1 : count

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      paddingBottom: 28,
      borderBottom: `1px solid ${C.lineSoft}`,
      marginBottom: 28,
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 700ms ease ${rowIndex * 140}ms, transform 700ms ease ${rowIndex * 140}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isRosatom ? 32 : 26,
          fontWeight: 500,
          color: isRosatom ? C.accent : C.text,
          letterSpacing: '-0.01em',
        }}>
          {provider.name}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.dim,
        }}>
          {provider.country}
        </div>
        <div style={{ flex: 1, height: 1, background: C.lineSoft, minWidth: 40 }} />
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          color: isRosatom ? C.accent : C.text,
          fontWeight: 400,
        }}>
          {provider.swu < 0.5 ? '< 1' : provider.swu}
          <span style={{ fontSize: 12, marginLeft: 6, color: C.dim, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.1em' }}>
            M UTS/AN
          </span>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          color: isRosatom ? C.accent : C.dim,
          minWidth: 54,
          textAlign: 'right',
        }}>
          {provider.share < 1 ? '< 1' : provider.share} %
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        alignItems: 'flex-end',
        minHeight: 66,
      }}>
        {Array.from({ length: displayCount }).map((_, idx) => (
          <div
            key={idx}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0.4)',
              transition: `opacity 400ms ease ${rowIndex * 100 + idx * 8}ms, transform 400ms cubic-bezier(.2,.8,.3,1.2) ${rowIndex * 100 + idx * 8}ms`,
            }}
          >
            <SpinningCentrifuge
              size="md"
              color={isRosatom ? C.accent : C.text}
              speed={0.6 + (idx % 4) * 0.2}
              delay={(rowIndex * 0.2 + idx * 0.015) % 1.2}
              active={revealed}
            />
          </div>
        ))}
        {provider.name === 'Centrus' && revealed && (
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 13,
            color: C.muted,
            marginLeft: 10,
            alignSelf: 'center',
          }}>
            capacité commerciale négligeable
          </div>
        )}
      </div>

      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 14,
        fontStyle: 'italic',
        color: C.dim,
        marginTop: 2,
      }}>
        {provider.plants.join(' · ')}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PIPELINE DE SÉPARATION
   ════════════════════════════════════════════════════════════════ */
function SeparationPipeline() {
  const stages = 7
  return (
    <div style={{ position: 'relative', padding: '40px 0', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        minHeight: 200,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 2,
          background: `linear-gradient(to right, ${C.muted} 0%, ${C.dim} 30%, ${C.accent} 70%, ${C.accentBright} 100%)`,
          opacity: 0.3,
          transform: 'translateY(-50%)',
        }} />

        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: C.accentBright,
            boxShadow: `0 0 8px ${C.accent}`,
            animation: `flowRight 4s linear ${i * 0.4}s infinite`,
            transform: 'translateY(-50%)',
          }} />
        ))}

        {Array.from({ length: stages }).map((_, i) => {
          const enrichment = (i + 1) / stages
          return (
            <div key={i} style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              flex: 1,
            }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <SpinningCentrifuge
                    key={j}
                    size="sm"
                    color={i === stages - 1 ? C.accentBright : enrichment > 0.5 ? C.accent : C.text}
                    speed={0.8 + i * 0.15}
                    delay={i * 0.08 + j * 0.03}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                color: enrichment > 0.6 ? C.accent : C.muted,
                letterSpacing: '0.08em',
                marginTop: 4,
              }}>
                ÉTAGE {i + 1}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 20px 0',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        <div style={{ color: C.dim }}>
          <div>Entrée</div>
          <div style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", letterSpacing: 0, textTransform: 'none', color: C.text }}>
            UF₆ à 0,7 %
          </div>
        </div>
        <div style={{ color: C.accent, textAlign: 'right' }}>
          <div>Sortie</div>
          <div style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", letterSpacing: 0, textTransform: 'none', color: C.accent }}>
            UF₆ à 5 %
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════ */
export default function UraniumClient() {
  const [reveal, setReveal] = useState(new Set())
  const [activePalier, setActivePalier] = useState(0)
  const sectionRefs = useRef([])
  const palierRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setReveal((prev) => new Set(prev).add(e.target.dataset.id))
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    sectionRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActivePalier(Number(e.target.dataset.index))
          }
        })
      },
      { threshold: 0.55 }
    )
    palierRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const isRevealed = (id) => reveal.has(id)

  return (
    <>
      <Header activeNav="concept" />

      <style jsx global>{`
        body { background: ${C.bg}; }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(20px, -20px); opacity: 0.8; }
        }
        @keyframes flowRight {
          0% { left: -4px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { left: calc(100% + 4px); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 ${C.red}; }
          50% { box-shadow: 0 0 0 10px rgba(142, 58, 43, 0); }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-24px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.25); }
        }
      `}</style>

      <div style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>

      {/* I — OUVERTURE */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        data-id="hero"
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          alignItems: 'center',
          padding: '100px 32px 60px',
          maxWidth: 1400,
          margin: '0 auto',
          gap: 40,
        }}
        className="uranium-hero-grid"
      >
        <ParticleField />

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 18,
          position: 'relative',
          zIndex: 2,
          opacity: isRevealed('hero') ? 1 : 0,
          transform: isRevealed('hero') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1200ms ease, transform 1200ms ease',
        }}>
          <SpinningCentrifuge size="md" color={C.dim} speed={0.5} delay={0.2} />
          <SpinningCentrifuge size="lg" color={C.accent} speed={0.7} delay={0} />
          <SpinningCentrifuge size="xl" color={C.accent} speed={0.9} delay={0.05} />
          <SpinningCentrifuge size="lg" color={C.accent} speed={0.7} delay={0.15} />
          <SpinningCentrifuge size="md" color={C.dim} speed={0.5} delay={0.3} />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 32,
            opacity: isRevealed('hero') ? 1 : 0,
            transition: 'opacity 900ms ease',
          }}>
            Atlas · Mouvement I · Géopolitique nucléaire
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 40,
            opacity: isRevealed('hero') ? 1 : 0,
            transform: isRevealed('hero') ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1200ms ease 200ms, transform 1200ms ease 200ms',
          }}>
            La cascade<br/>
            <em style={{ color: C.accent, fontStyle: 'italic' }}>du monde.</em>
          </h1>

          <p style={{
            fontSize: 'clamp(17px, 1.8vw, 21px)',
            lineHeight: 1.55,
            color: C.text,
            maxWidth: 620,
            fontWeight: 300,
            margin: 0,
            marginBottom: 40,
            opacity: isRevealed('hero') ? 1 : 0,
            transition: 'opacity 1400ms ease 600ms',
          }}>
            L'uranium enrichi tient aujourd'hui une place comparable à celle du pétrole
            dans les équilibres du XXᵉ siècle. Quatre entités en contrôlent l'essentiel,
            dont une seule en Occident.
          </p>

          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.08em',
            color: C.dim,
            display: 'flex',
            gap: 36,
            flexWrap: 'wrap',
            opacity: isRevealed('hero') ? 1 : 0,
            transition: 'opacity 1600ms ease 1000ms',
          }}>
            <div>
              <div style={{ color: C.muted, marginBottom: 4, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Lecture</div>
              <div>8 minutes</div>
            </div>
            <div>
              <div style={{ color: C.muted, marginBottom: 4, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Sources</div>
              <div>WNA · AIEA · CEA · Centrus 10-K</div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: isRevealed('hero') ? 0.6 : 0,
          transition: 'opacity 1800ms ease 1400ms',
          zIndex: 2,
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dim }}>
            Descendre
          </div>
          <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${C.dim}, transparent)` }} />
        </div>
      </section>

      {/* II — LE SEUIL ORIGINEL */}
      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        data-id="origine"
        style={{
          padding: '140px 24px',
          maxWidth: 1200,
          margin: '0 auto',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.dim,
          marginBottom: 48,
        }}>
          Mouvement II · Le seuil originel
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) 1.2fr',
          gap: 80,
          alignItems: 'start',
        }} className="uranium-grid-2">

          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(120px, 22vw, 260px)',
              lineHeight: 0.85,
              fontWeight: 300,
              color: C.accent,
              letterSpacing: '-0.04em',
            }}>
              <CountUp target={0.7} duration={2200} decimals={1} trigger={isRevealed('origine')} />
              <span style={{ fontSize: '0.35em', color: C.text, marginLeft: 8 }}>%</span>
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: C.dim,
              marginTop: 24,
            }}>
              Uranium 235 dans l'uranium naturel
            </div>
          </div>

          <div style={{ paddingTop: 40 }}>
            <p style={{
              fontSize: 'clamp(18px, 1.9vw, 22px)',
              lineHeight: 1.6,
              color: C.text,
              fontWeight: 300,
              margin: 0,
              marginBottom: 32,
            }}>
              Tout part de là. L'uranium extrait des mines du Niger, du Canada,
              du Kazakhstan, de Namibie ou d'Ouzbékistan contient environ sept parties
              pour mille d'uranium 235, le seul isotope fissile. Le reste, 99,3 %,
              est de l'uranium 238, inerte dans un réacteur à eau légère.
            </p>
            <p style={{
              fontSize: 'clamp(16px, 1.6vw, 19px)',
              lineHeight: 1.65,
              color: C.dim,
              fontWeight: 300,
              margin: 0,
            }}>
              Enrichir, c'est séparer. Depuis les années 1940, l'humanité a développé
              trois familles de procédés : la diffusion gazeuse, abandonnée pour son
              coût énergétique, la centrifugation, devenue dominante, et la technologie
              laser, encore expérimentale. Toutes accomplissent la même opération,
              plus ou moins bien, plus ou moins vite, plus ou moins discrètement.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 90,
          paddingTop: 48,
          borderTop: `1px solid ${C.lineSoft}`,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.dim,
            marginBottom: 24,
          }}>
            1 000 atomes d'uranium naturel
          </div>
          <DotGrid total={1000} revealed={isRevealed('origine')} />
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: C.dim,
            marginTop: 16,
            display: 'flex',
            gap: 28,
            flexWrap: 'wrap',
          }}>
            <span><span style={{ color: C.accent }}>●</span> 7 atomes d'U-235 (fissile)</span>
            <span><span style={{ color: C.muted }}>●</span> 993 atomes d'U-238 (inerte)</span>
          </div>
        </div>

        <div style={{
          marginTop: 100,
          paddingTop: 48,
          borderTop: `1px solid ${C.lineSoft}`,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.dim,
            marginBottom: 8,
          }}>
            Le principe
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 2.4vw, 30px)',
            lineHeight: 1.35,
            color: C.text,
            fontWeight: 400,
            maxWidth: 760,
            marginBottom: 12,
            fontStyle: 'italic',
          }}>
            Le gaz d'hexafluorure d'uranium traverse une chaîne de centrifugeuses.
            À chaque étage, il s'enrichit un peu plus.
          </div>
          <SeparationPipeline />
        </div>
      </section>

      {/* III — LA CASCADE */}
      <section
        ref={(el) => (sectionRefs.current[2] = el)}
        data-id="cascade"
        style={{
          padding: '140px 24px 100px',
          maxWidth: 1400,
          margin: '0 auto',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.dim,
          marginBottom: 24,
        }}>
          Mouvement III · Capacité mondiale
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(34px, 5vw, 68px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 24,
          maxWidth: 980,
        }}>
          Chaque trait qui tourne est une capacité de <em style={{ color: C.accent }}>300 000 UTS par an</em>.
        </h2>
        <p style={{
          fontSize: 'clamp(15px, 1.5vw, 18px)',
          lineHeight: 1.65,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
          marginBottom: 64,
          maxWidth: 720,
        }}>
          Cinq acteurs se partagent la quasi-totalité du marché commercial. La dissymétrie
          que révèle cette composition, à elle seule, résume plusieurs décennies de
          stratégie industrielle.
        </p>

        <div>
          {PROVIDERS.map((p, i) => (
            <CascadeRow
              key={p.name}
              provider={p}
              revealed={isRevealed('cascade')}
              rowIndex={i}
              isRosatom={p.name === 'Rosatom'}
            />
          ))}
        </div>

        <div style={{
          marginTop: 60,
          paddingTop: 48,
          borderTop: `1px solid ${C.lineSoft}`,
          maxWidth: 820,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 2.5vw, 30px)',
            lineHeight: 1.45,
            fontWeight: 400,
            color: C.text,
            margin: 0,
            fontStyle: 'italic',
          }}>
            Moscou détient à elle seule près d'une fois et demie la capacité
            combinée de tous les sites européens. Ce rapport de force est
            l'invariant structurel du nucléaire civil contemporain.
          </p>
        </div>
      </section>

      {/* IV — LES PALIERS */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        data-id="paliers"
        style={{
          padding: '140px 0 80px',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.dim,
            marginBottom: 24,
          }}>
            Mouvement IV · L'échelle des seuils
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: 'clamp(34px, 5vw, 68px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 24,
            maxWidth: 980,
          }}>
            Le même atome, enrichi à des degrés différents, fait tourner une ville ou rase une capitale.
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            lineHeight: 1.65,
            color: C.dim,
            fontWeight: 300,
            margin: 0,
            maxWidth: 720,
          }}>
            Cinq paliers suffisent à décrire toute la géopolitique de l'atome.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          position: 'relative',
        }} className="uranium-paliers-grid">

          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            borderRight: `1px solid ${C.lineSoft}`,
          }} className="uranium-gauge">
            <LiquidGauge activeIndex={activePalier} paliers={PALIERS} />
          </div>

          <div>
            {PALIERS.map((p, i) => (
              <div
                key={i}
                ref={(el) => (palierRefs.current[i] = el)}
                data-index={i}
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '80px 48px',
                  borderBottom: i < PALIERS.length - 1 ? `1px solid ${C.lineSoft}` : 'none',
                  position: 'relative',
                }}
              >
                {p.military && (
                  <div style={{
                    position: 'absolute',
                    top: 40,
                    right: 48,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: C.red,
                    animation: 'pulseGlow 1.8s ease-out infinite',
                  }} />
                )}
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: p.military ? C.red : C.dim,
                  marginBottom: 24,
                }}>
                  Palier {String.fromCharCode(8544 + i)} {p.flagged && '· hors traité'} {p.military && '· franchissement militaire'}
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(72px, 12vw, 180px)',
                  lineHeight: 0.9,
                  fontWeight: 300,
                  color: p.military ? C.red : p.flagged ? C.accent : C.text,
                  letterSpacing: '-0.04em',
                  marginBottom: 16,
                }}>
                  {p.value}
                  <span style={{ fontSize: '0.3em', marginLeft: 8, color: C.dim }}>%</span>
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(22px, 2.6vw, 32px)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: C.text,
                  marginBottom: 28,
                  letterSpacing: '-0.01em',
                }}>
                  {p.label}
                </div>
                <p style={{
                  fontSize: 'clamp(16px, 1.6vw, 19px)',
                  lineHeight: 1.65,
                  color: C.dim,
                  fontWeight: 300,
                  margin: 0,
                  maxWidth: 540,
                }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* V — INSTALLATIONS */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        data-id="installations"
        style={{
          padding: '140px 24px 120px',
          maxWidth: 1200,
          margin: '0 auto',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.dim,
          marginBottom: 24,
        }}>
          Mouvement V · Géographie industrielle
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(34px, 5vw, 68px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 60,
          maxWidth: 900,
        }}>
          Les lieux où se fait l'enrichissement.
        </h2>

        <ol style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          borderTop: `1px solid ${C.line}`,
        }}>
          {INSTALLATIONS.map(([place, country, kind], i) => {
            const isContested = kind === 'contesté'
            const isMilitary = kind === 'militaire'
            const color = isMilitary ? C.red : isContested ? C.accent : C.text
            return (
              <li
                key={place}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto auto',
                  alignItems: 'baseline',
                  padding: '24px 0',
                  borderBottom: `1px solid ${C.line}`,
                  gap: 24,
                  animation: isRevealed('installations') ? `slideInLeft 500ms ease ${i * 40}ms backwards` : 'none',
                  opacity: isRevealed('installations') ? 1 : 0,
                }}
              >
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: '0.1em',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(26px, 3.4vw, 42px)',
                  fontWeight: 400,
                  color,
                  letterSpacing: '-0.01em',
                }}>
                  {place}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 16,
                  fontStyle: 'italic',
                  color: C.dim,
                }}>
                  {country}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isMilitary ? C.red : isContested ? C.accent : C.muted,
                  border: `1px solid ${isMilitary ? C.red : isContested ? C.accentSoft : C.line}`,
                  padding: '4px 10px',
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                }}>
                  {kind}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* VI — DÉPENDANCE */}
      <section
        ref={(el) => (sectionRefs.current[5] = el)}
        data-id="dependance"
        style={{
          padding: '140px 24px 120px',
          maxWidth: 1200,
          margin: '0 auto',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.dim,
          marginBottom: 24,
        }}>
          Mouvement VI · La dépendance
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(34px, 5vw, 68px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 60,
          maxWidth: 900,
        }}>
          Ce que Rosatom produit, l'Occident l'achète.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 40,
          marginBottom: 80,
        }}>
          <FactBlock
            target={25}
            suffix=" %"
            label="des services d'enrichissement destinés aux réacteurs américains provenaient encore de Russie en 2024"
            source="National Interest, déc. 2025"
            trigger={isRevealed('dependance')}
          />
          <FactBlock
            target={700}
            suffix=" M€"
            label="dépensés par les utilities européennes en combustible russe en 2024"
            source="Bruegel, 2025"
            trigger={isRevealed('dependance')}
            accent
          />
          <FactBlock
            target={10}
            suffix=" ans"
            label="délai estimé pour qu'une nouvelle installation d'enrichissement atteigne sa pleine capacité"
            source="Centrus, 10-K 2026"
            trigger={isRevealed('dependance')}
          />
        </div>

        <div style={{
          padding: '48px 0',
          borderTop: `1px solid ${C.line}`,
          borderBottom: `1px solid ${C.line}`,
          maxWidth: 780,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 2.5vw, 30px)',
            lineHeight: 1.5,
            fontWeight: 400,
            color: C.text,
            margin: 0,
            fontStyle: 'italic',
          }}>
            La souveraineté énergétique européenne ne dépend pas seulement des gazoducs.
            Elle se joue aussi dans la quantité d'uranium 235 que Moscou consent à
            séparer pour le compte de Paris, Bruxelles et Washington.
          </p>
        </div>

        <div style={{ marginTop: 48 }}>
          <p style={{
            fontSize: 'clamp(17px, 1.7vw, 20px)',
            lineHeight: 1.65,
            color: C.text,
            fontWeight: 300,
            marginBottom: 20,
            maxWidth: 760,
          }}>
            L'Europe et les États-Unis ont lancé leur rattrapage. Urenco étend ses
            capacités à Capenhurst, Almelo, Gronau et Eunice. Orano prépare un site
            à Oak Ridge visant un million d'UTS supplémentaires à horizon 2030.
            Le département de l'Énergie américain a engagé 3,4 milliards de dollars
            en contrats de long terme pour sécuriser la filière.
          </p>
          <p style={{
            fontSize: 'clamp(17px, 1.7vw, 20px)',
            lineHeight: 1.65,
            color: C.dim,
            fontWeight: 300,
            margin: 0,
            maxWidth: 760,
          }}>
            Cette réorientation ne produira ses effets qu'au milieu de la prochaine
            décennie. D'ici là, la cascade du monde reste russe.
          </p>
        </div>
      </section>

      {/* SOURCES */}
      <section style={{
        padding: '100px 24px 140px',
        maxWidth: 1200,
        margin: '0 auto',
        borderTop: `1px solid ${C.line}`,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.dim,
          marginBottom: 32,
        }}>
          Sources
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15,
          lineHeight: 1.6,
          color: C.dim,
          fontStyle: 'italic',
        }}>
          <div>World Nuclear Association, <em style={{ fontStyle: 'normal' }}>World Nuclear Fuel Report</em>, septembre 2025.</div>
          <div>Centrus Energy, <em style={{ fontStyle: 'normal' }}>Investor Presentation</em>, février 2026, et formulaire 10-K 2025.</div>
          <div>Bruegel, <em style={{ fontStyle: 'normal' }}>EU Reliance on Russian Nuclear Fuel</em>, 2025.</div>
          <div>AIEA, <em style={{ fontStyle: 'normal' }}>Safeguards Reports</em>, 2024 et 2025.</div>
          <div>CEA, Dossier pédagogique <em style={{ fontStyle: 'normal' }}>L'enrichissement de l'uranium</em>.</div>
          <div>Thunder Said Energy, <em style={{ fontStyle: 'normal' }}>Uranium enrichment by country and company</em>, 2024.</div>
        </div>

        <div style={{
          marginTop: 64,
          paddingTop: 28,
          borderTop: `1px solid ${C.line}`,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.08em',
          color: C.muted,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <span>Atlas Soara · Cartographie éditoriale</span>
          <a href="/visuels" style={{ color: C.accent, textDecoration: 'none' }}>
            Retour à l'Atlas ↗
          </a>
        </div>
      </section>

      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          :global(.uranium-hero-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.uranium-grid-2) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.uranium-paliers-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.uranium-gauge) {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

/* DOT GRID avec points pulsants */
function DotGrid({ total = 1000, revealed }) {
  const accentIdx = useMemo(() => new Set([97, 203, 341, 518, 662, 789, 901]), [])
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(50, 1fr)',
      gap: 4,
      maxWidth: 760,
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isAccent = accentIdx.has(i)
        return (
          <div
            key={i}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              background: isAccent ? C.accent : C.muted,
              opacity: revealed ? (isAccent ? 1 : 0.35) : 0,
              borderRadius: '50%',
              transition: `opacity 600ms ease ${Math.min(i * 0.4, 400)}ms`,
              animation: isAccent && revealed ? `dotPulse 2.4s ease-in-out ${(i % 7) * 0.3}s infinite` : 'none',
              boxShadow: isAccent && revealed ? `0 0 6px ${C.accent}` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

/* LIQUID GAUGE animée */
function LiquidGauge({ activeIndex, paliers }) {
  const total = paliers.length
  const fillHeight = ((activeIndex + 1) / total) * 100
  const isMilitary = paliers[activeIndex]?.military
  const fillColor = isMilitary ? C.red : C.accent

  return (
    <div style={{
      width: '100%',
      maxWidth: 440,
      height: '78vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '2%',
        bottom: '2%',
        width: 36,
        background: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: 4,
        overflow: 'hidden',
        transform: 'translateX(-50%)',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${fillHeight}%`,
          background: `linear-gradient(to top, ${fillColor} 0%, ${isMilitary ? C.redBright : C.accentBright} 100%)`,
          transition: 'height 900ms cubic-bezier(.3,.1,.2,1), background 500ms ease',
          boxShadow: `0 -8px 16px -4px ${isMilitary ? C.red : C.accent}`,
        }}>
          <div style={{
            position: 'absolute',
            top: -2,
            left: 0,
            right: 0,
            height: 4,
            background: `radial-gradient(ellipse at center, ${isMilitary ? C.redBright : C.accentBright} 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }} />
        </div>

        {paliers.map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: -4,
            right: -4,
            top: `${((total - 1 - i) / (total - 1)) * 96 + 2}%`,
            height: 1,
            background: C.line,
            opacity: 0.8,
          }} />
        ))}
      </div>

      {paliers.map((p, i) => {
        const isActive = i === activeIndex
        const isPast = i < activeIndex
        const pos = ((paliers.length - 1 - i) / (paliers.length - 1)) * 100
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${pos}%`,
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 16,
              transform: 'translateY(-50%)',
              transition: 'all 400ms ease',
            }}
          >
            <div style={{
              textAlign: 'right',
              fontFamily: "'Playfair Display', serif",
              fontSize: isActive ? 42 : 20,
              fontWeight: isActive ? 500 : 300,
              color: isActive
                ? (p.military ? C.red : C.accent)
                : isPast ? C.text : C.muted,
              opacity: isActive ? 1 : (isPast ? 0.8 : 0.4),
              transition: 'all 500ms cubic-bezier(.3,.1,.2,1)',
              letterSpacing: '-0.02em',
              paddingRight: 12,
              lineHeight: 1,
            }}>
              {p.value}
              <span style={{ fontSize: '0.45em', opacity: 0.6, marginLeft: 2 }}>%</span>
            </div>

            <div style={{
              width: 36,
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                width: isActive ? 44 : 16,
                height: isActive ? 44 : 16,
                borderRadius: '50%',
                background: isActive
                  ? (p.military ? C.red : C.accent)
                  : isPast ? C.accent : C.surface,
                border: `2px solid ${isActive ? (p.military ? C.redBright : C.accentBright) : isPast ? C.accentSoft : C.line}`,
                transition: 'all 500ms cubic-bezier(.3,.1,.2,1)',
                zIndex: 3,
                boxShadow: isActive
                  ? `0 0 0 4px ${C.bg}, 0 0 20px ${p.military ? C.red : C.accent}`
                  : 'none',
                animation: isActive && p.military ? 'pulseGlow 1.8s infinite' : 'none',
              }} />
            </div>

            <div style={{
              textAlign: 'left',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isActive ? 12 : 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isActive
                ? C.text
                : isPast ? C.dim : C.muted,
              opacity: isActive ? 1 : (isPast ? 0.7 : 0.4),
              transition: 'all 400ms ease',
              paddingLeft: 12,
              lineHeight: 1.3,
            }}>
              {p.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* FACT BLOCK animé */
function FactBlock({ target, suffix = '', label, source, accent = false, trigger }) {
  const decimals = String(target).includes('.') ? 1 : 0
  return (
    <div style={{
      borderTop: `2px solid ${accent ? C.accent : C.line}`,
      paddingTop: 20,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(38px, 4vw, 54px)',
        fontWeight: 400,
        color: accent ? C.accent : C.text,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        marginBottom: 20,
      }}>
        <CountUp target={target} duration={1800} decimals={decimals} suffix={suffix} trigger={trigger} />
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 17,
        lineHeight: 1.5,
        color: C.text,
        fontWeight: 300,
        marginBottom: 14,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.muted,
      }}>
        {source}
      </div>
    </div>
  )
}
