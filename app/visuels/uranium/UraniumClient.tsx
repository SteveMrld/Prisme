// @ts-nocheck
'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Header from '../../../components/Header'
import { C, PROVIDERS, PALIERS, INSTALLATIONS, hex } from './data'

/* ════════════════════════════════════════════════════════════════
   URANIUM : LA CASCADE DU MONDE
   Atlas Soara. Refonte compacte mobile-first.
   Toutes les animations en pur CSS, démarrées au chargement.
   ════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════
   CENTRIFUGEUSE EN CSS PUR
   Un cylindre avec stripes diagonales qui défilent.
   Fonctionne partout, animation toujours visible.
   ════════════════════════════════════════════════════════════════ */
function Centrifuge({ w = 14, h = 60, color = C.text, speed = 1, className = '' }) {
  const stripeDur = `${(0.9 / speed).toFixed(2)}s`
  const particleDur = `${(2.4 / speed).toFixed(2)}s`
  return (
    <div className={`cf-wrap ${className}`} style={{
      width: w,
      height: h,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Tête (moteur) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: Math.max(2, h * 0.03),
        background: color,
        opacity: 0.9,
      }} />
      <div style={{
        position: 'absolute',
        top: Math.max(2, h * 0.03),
        left: '10%',
        right: '10%',
        height: Math.max(2, h * 0.03),
        background: color,
        opacity: 0.9,
      }} />

      {/* Corps principal avec stripes animées */}
      <div style={{
        position: 'absolute',
        top: Math.max(3, h * 0.05),
        bottom: Math.max(3, h * 0.05),
        left: 0,
        right: 0,
        overflow: 'hidden',
        background: `linear-gradient(to right,
          ${hex(color, 0.35)} 0%,
          ${color} 20%,
          ${hex(color, 0.82)} 50%,
          ${color} 80%,
          ${hex(color, 0.35)} 100%)`,
      }}>
        {/* stripes qui défilent vers le haut (rotation visible) */}
        <div style={{
          position: 'absolute',
          inset: '-20% -20%',
          background: `repeating-linear-gradient(
            55deg,
            transparent 0,
            transparent 3px,
            rgba(0,0,0,0.3) 3px,
            rgba(0,0,0,0.3) 5px
          )`,
          animation: `cfStripes ${stripeDur} linear infinite`,
        }} />
        {/* particule d'enrichissement */}
        <div style={{
          position: 'absolute',
          left: '50%',
          width: Math.max(2, w * 0.15),
          height: Math.max(2, w * 0.15),
          borderRadius: '50%',
          background: C.accentBright,
          boxShadow: `0 0 ${Math.max(3, w * 0.4)}px ${C.accent}`,
          transform: 'translateX(-50%)',
          animation: `cfParticle ${particleDur} linear infinite`,
        }} />
      </div>

      {/* Base */}
      <div style={{
        position: 'absolute',
        bottom: Math.max(2, h * 0.02),
        left: 0,
        right: 0,
        height: Math.max(2, h * 0.04),
        background: color,
        opacity: 0.95,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '-10%',
        right: '-10%',
        height: Math.max(1, h * 0.02),
        background: color,
        opacity: 0.6,
      }} />
    </div>
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
    startRef.current = null
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
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════ */
export default function UraniumClient() {
  const [reveal, setReveal] = useState(new Set(['hero'])) // hero actif dès le load
  const [autoPalier, setAutoPalier] = useState(0)
  const sectionRefs = useRef([])

  // Observer les sections pour les reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setReveal((prev) => new Set(prev).add(e.target.dataset.id))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )
    sectionRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Auto-avancée de la jauge des paliers dès que la section est visible
  useEffect(() => {
    if (!reveal.has('paliers')) return
    let i = 0
    setAutoPalier(0)
    const interval = setInterval(() => {
      i = (i + 1) % PALIERS.length
      setAutoPalier(i)
    }, 2400)
    return () => clearInterval(interval)
  }, [reveal])

  const isRevealed = (id) => reveal.has(id)
  const currentPalier = PALIERS[autoPalier]

  return (
    <>
      <Header activeNav="concept" />

      <style jsx global>{`
        body { background: ${C.bg}; }

        /* ── animations des centrifugeuses ── */
        @keyframes cfStripes {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
        @keyframes cfParticle {
          0% { bottom: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; }
        }

        /* ── autres animations ── */
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.15); }
        }
        @keyframes sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes flowRight {
          0% { left: -4px; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { left: calc(100% + 4px); opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 0 0 ${C.red}; }
          50% { box-shadow: 0 0 0 14px rgba(142, 58, 43, 0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(18px, -22px); opacity: 0.9; }
        }

        /* ── animations anatomiques ── */
        @keyframes u235Rise {
          0% { bottom: 0%; opacity: 0; transform: translateX(0); }
          10% { opacity: 1; }
          50% { transform: translateX(-2px); }
          90% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; transform: translateX(0); }
        }
        @keyframes u238Fall {
          0% { top: 0%; opacity: 0; }
          12% { opacity: 0.8; }
          88% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes feedPulse {
          0%, 100% { opacity: 0.5; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(-4px); }
        }
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <div style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>

      {/* ═══════════════════════════════════════════════════
          I — HERO
          Centrifugeuse géante qui tourne derrière le titre.
          Animations actives dès le load.
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        data-id="hero"
        style={{
          position: 'relative',
          minHeight: '92vh',
          padding: '80px 24px 40px',
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* centrifugeuses flottantes en fond */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '4vw',
          zIndex: 0,
          opacity: 0.92,
          pointerEvents: 'none',
        }} className="uranium-hero-cf">
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ animation: 'floatY 5s ease-in-out infinite' }}>
              <Centrifuge w={28} h={140} color={C.dim} speed={0.7} />
            </div>
            <div style={{ animation: 'floatY 4s ease-in-out 0.4s infinite' }}>
              <Centrifuge w={38} h={200} color={C.accent} speed={0.9} />
            </div>
            <div style={{ animation: 'breathe 6s ease-in-out 0.2s infinite' }}>
              <Centrifuge w={72} h={360} color={C.accent} speed={1.2} />
            </div>
            <div style={{ animation: 'floatY 4.6s ease-in-out 0.6s infinite' }}>
              <Centrifuge w={38} h={200} color={C.accent} speed={0.9} />
            </div>
            <div style={{ animation: 'floatY 5.4s ease-in-out 0.1s infinite' }}>
              <Centrifuge w={28} h={140} color={C.dim} speed={0.7} />
            </div>
          </div>
        </div>

        {/* voile pour la lisibilité du texte sur mobile */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to right, ${C.bg} 0%, ${hex(C.bg, 0.82)} 40%, transparent 75%)`,
          zIndex: 1,
          pointerEvents: 'none',
        }} className="uranium-hero-veil" />

        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 780,
          animation: 'fadeUp 900ms ease both',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 28,
          }}>
            Atlas · Géopolitique nucléaire
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: 'clamp(46px, 8vw, 104px)',
            lineHeight: 1,
            letterSpacing: '-0.025em',
            margin: 0,
            marginBottom: 32,
          }}>
            La cascade<br/>
            <em style={{ color: C.accent, fontStyle: 'italic' }}>du monde.</em>
          </h1>

          <p style={{
            fontSize: 'clamp(17px, 1.9vw, 21px)',
            lineHeight: 1.55,
            color: C.text,
            maxWidth: 580,
            fontWeight: 300,
            margin: 0,
            marginBottom: 32,
          }}>
            De 0,7 à 90 pour cent. Une grammaire industrielle en six plans,
            qui résume la géographie du nucléaire civil et militaire.
          </p>

          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.08em',
            color: C.dim,
            display: 'flex',
            gap: 28,
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ color: C.muted, marginBottom: 4, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Lecture</div>
              <div>5 minutes</div>
            </div>
            <div>
              <div style={{ color: C.muted, marginBottom: 4, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Données</div>
              <div>WNA sept. 2025</div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: 0.5,
          zIndex: 2,
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dim }}>
            Descendre
          </div>
          <div style={{
            width: 1,
            height: 36,
            background: `linear-gradient(to bottom, ${C.dim}, transparent)`,
            animation: 'floatY 2.4s ease-in-out infinite',
          }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          II — 0,7 % (compact)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        data-id="origine"
        style={{
          padding: '80px 24px 60px',
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
          marginBottom: 32,
        }}>
          Mouvement I · Le seuil originel
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: 40,
          alignItems: 'center',
        }} className="uranium-grid-2">

          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(96px, 20vw, 220px)',
              lineHeight: 0.85,
              fontWeight: 300,
              color: C.accent,
              letterSpacing: '-0.04em',
            }}>
              <CountUp target={0.7} duration={1800} decimals={1} trigger={isRevealed('origine')} />
              <span style={{ fontSize: '0.32em', color: C.text, marginLeft: 6 }}>%</span>
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: C.dim,
              marginTop: 18,
              maxWidth: 280,
            }}>
              L'uranium 235 dans l'uranium extrait des mines
            </div>
          </div>

          <div>
            <p style={{
              fontSize: 'clamp(17px, 1.8vw, 20px)',
              lineHeight: 1.55,
              color: C.text,
              fontWeight: 300,
              margin: 0,
              marginBottom: 20,
            }}>
              Tout part de là. L'uranium extrait du Niger, du Canada, du Kazakhstan
              ou d'Ouzbékistan contient sept parties pour mille d'uranium 235,
              le seul isotope fissile.
            </p>
            <p style={{
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              lineHeight: 1.6,
              color: C.dim,
              fontWeight: 300,
              margin: 0,
            }}>
              Enrichir, c'est séparer. Trois familles de procédés existent :
              diffusion gazeuse, centrifugation, laser. La centrifugation
              domine l'industrie depuis les années 1990.
            </p>
          </div>
        </div>

        {/* Grille 1000 points, plus compacte */}
        <div style={{
          marginTop: 56,
          paddingTop: 32,
          borderTop: `1px solid ${C.lineSoft}`,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.dim,
            marginBottom: 20,
          }}>
            1 000 atomes d'uranium naturel · 7 sont fissiles
          </div>
          <DotGrid total={1000} revealed={isRevealed('origine')} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          II.5 — LA MÉCANIQUE
          Anatomie d'une centrifugeuse : comment ça sépare
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[6] = el)}
        data-id="mecanique"
        style={{
          padding: '80px 24px 80px',
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
          Mouvement II · La mécanique
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(30px, 4.5vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 16,
        }}>
          À l'intérieur d'une <em style={{ color: C.accent }}>centrifugeuse.</em>
        </h2>
        <p style={{
          fontSize: 'clamp(15px, 1.5vw, 17px)',
          lineHeight: 1.6,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
          marginBottom: 48,
          maxWidth: 680,
        }}>
          Un cylindre vertical qui tourne à 70 000 tours par minute. Le gaz d'hexafluorure
          d'uranium entre par le milieu. La force centrifuge plaque les molécules lourdes
          contre la paroi. Les légères, enrichies en U-235, remontent au centre.
        </p>

        <CentrifugeAnatomy revealed={isRevealed('mecanique')} />
      </section>

      {/* ═══════════════════════════════════════════════════
          III — LA CASCADE MONDIALE
          Barres horizontales proportionnelles à la capacité.
          Au-dessus de chaque nom, un cluster de centrifugeuses qui tournent.
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[2] = el)}
        data-id="cascade"
        style={{
          padding: '80px 24px 60px',
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
          Mouvement III · La cascade mondiale
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(30px, 4.5vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 16,
        }}>
          Cinq acteurs. Une <em style={{ color: C.accent }}>dissymétrie</em> qui tient le monde.
        </h2>
        <p style={{
          fontSize: 'clamp(15px, 1.5vw, 17px)',
          lineHeight: 1.6,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
          marginBottom: 44,
          maxWidth: 640,
        }}>
          Les capacités mondiales d'enrichissement, mesurées en millions d'unités
          de travail de séparation par an. Source WNA, septembre 2025.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {PROVIDERS.map((p, i) => (
            <ProviderBar
              key={p.name}
              provider={p}
              index={i}
              maxSwu={PROVIDERS[0].swu}
              revealed={isRevealed('cascade')}
            />
          ))}
        </div>

        <div style={{
          marginTop: 48,
          paddingTop: 28,
          borderTop: `1px solid ${C.lineSoft}`,
          maxWidth: 780,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(19px, 2.2vw, 26px)',
            lineHeight: 1.45,
            fontWeight: 400,
            color: C.text,
            margin: 0,
            fontStyle: 'italic',
          }}>
            Moscou détient à elle seule près d'une fois et demie la capacité
            combinée de tous les sites européens.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          IV — LES PALIERS (compact, auto-animation)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        data-id="paliers"
        style={{
          padding: '80px 24px 80px',
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
          Mouvement IV · L'échelle des seuils
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(30px, 4.5vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 16,
        }}>
          Le même atome, <em style={{ color: C.accent }}>fait tourner une ville ou rase une capitale.</em>
        </h2>
        <p style={{
          fontSize: 'clamp(15px, 1.5vw, 17px)',
          lineHeight: 1.6,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
          marginBottom: 48,
          maxWidth: 640,
        }}>
          Cinq paliers suffisent à décrire toute la géopolitique de l'atome.
        </p>

        <PaliersCompact paliers={PALIERS} activeIndex={autoPalier} />
      </section>

      {/* ═══════════════════════════════════════════════════
          V — INSTALLATIONS
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        data-id="installations"
        style={{
          padding: '80px 24px 60px',
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
          marginBottom: 20,
        }}>
          Mouvement V · Géographie industrielle
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(28px, 4vw, 48px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 40,
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
                  gridTemplateColumns: '40px 1fr auto',
                  alignItems: 'baseline',
                  padding: '18px 0',
                  borderBottom: `1px solid ${C.line}`,
                  gap: 16,
                  animation: isRevealed('installations') ? `fadeUp 500ms ease ${i * 40}ms both` : 'none',
                }}
              >
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: '0.08em',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(22px, 2.8vw, 32px)',
                    fontWeight: 400,
                    color,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}>
                    {place}
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    fontStyle: 'italic',
                    color: C.dim,
                    marginTop: 2,
                  }}>
                    {country}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isMilitary ? C.red : isContested ? C.accent : C.muted,
                  border: `1px solid ${isMilitary ? C.red : isContested ? C.accentSoft : C.line}`,
                  padding: '3px 8px',
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

      {/* ═══════════════════════════════════════════════════
          VI — LA DÉPENDANCE
          ═══════════════════════════════════════════════════ */}
      <section
        ref={(el) => (sectionRefs.current[5] = el)}
        data-id="dependance"
        style={{
          padding: '80px 24px 80px',
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
          marginBottom: 20,
        }}>
          Mouvement VI · La dépendance
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(30px, 4.5vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 44,
          maxWidth: 900,
        }}>
          Ce que Rosatom produit, <em style={{ color: C.accent }}>l'Occident l'achète.</em>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 28,
          marginBottom: 48,
        }}>
          <FactBlock target={25} suffix=" %"
            label="de l'enrichissement des réacteurs américains provenait encore de Russie en 2024"
            source="National Interest, déc. 2025"
            trigger={isRevealed('dependance')} />
          <FactBlock target={700} suffix=" M€"
            label="dépensés par les utilities européennes en combustible russe en 2024"
            source="Bruegel, 2025"
            trigger={isRevealed('dependance')}
            accent />
          <FactBlock target={10} suffix=" ans"
            label="pour qu'une nouvelle installation d'enrichissement atteigne sa pleine capacité"
            source="Centrus, 10-K 2026"
            trigger={isRevealed('dependance')} />
        </div>

        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(19px, 2.3vw, 26px)',
          lineHeight: 1.45,
          fontWeight: 400,
          color: C.text,
          margin: 0,
          marginBottom: 32,
          fontStyle: 'italic',
          maxWidth: 820,
          paddingTop: 32,
          borderTop: `1px solid ${C.line}`,
        }}>
          La souveraineté énergétique européenne ne se joue pas seulement
          dans les gazoducs. Elle se joue aussi dans la quantité d'uranium 235
          que Moscou consent à séparer pour Paris, Bruxelles et Washington.
        </p>

        <p style={{
          fontSize: 'clamp(15px, 1.5vw, 17px)',
          lineHeight: 1.6,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
          maxWidth: 720,
        }}>
          Urenco, Orano et Centrus étendent leurs capacités. Le département
          de l'Énergie américain a engagé 3,4 milliards de dollars en contrats
          de long terme. Ces investissements ne porteront leurs fruits qu'à
          la fin de la décennie. D'ici là, la cascade du monde reste russe.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════
          SOURCES
          ═══════════════════════════════════════════════════ */}
      <section style={{
        padding: '60px 24px 100px',
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
          marginBottom: 24,
        }}>
          Sources
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 14,
          lineHeight: 1.55,
          color: C.dim,
          fontStyle: 'italic',
        }}>
          <div>World Nuclear Association, <span style={{ fontStyle: 'normal' }}>World Nuclear Fuel Report</span>, sept. 2025.</div>
          <div>Centrus Energy, <span style={{ fontStyle: 'normal' }}>10-K 2025</span>, fév. 2026.</div>
          <div>Bruegel, <span style={{ fontStyle: 'normal' }}>EU Reliance on Russian Nuclear Fuel</span>, 2025.</div>
          <div>AIEA, <span style={{ fontStyle: 'normal' }}>Safeguards Reports</span>, 2024–2025.</div>
          <div>CEA, <span style={{ fontStyle: 'normal' }}>L'enrichissement de l'uranium</span>.</div>
          <div>Thunder Said Energy, <span style={{ fontStyle: 'normal' }}>Uranium enrichment by country</span>, 2024.</div>
        </div>

        <div style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: `1px solid ${C.line}`,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.08em',
          color: C.muted,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
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
          :global(.uranium-grid-2) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          :global(.uranium-hero-cf) {
            opacity: 0.22 !important;
            padding-right: 0 !important;
            justify-content: center !important;
          }
          :global(.uranium-hero-veil) {
            background: linear-gradient(to bottom, ${hex(C.bg, 0.3)} 0%, ${hex(C.bg, 0.8)} 100%) !important;
          }
        }
      `}</style>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   PROVIDER BAR
   Barre horizontale proportionnelle + cluster de centrifugeuses
   ════════════════════════════════════════════════════════════════ */
function ProviderBar({ provider, index, maxSwu, revealed }) {
  const widthPct = (provider.swu / maxSwu) * 100
  const isRosatom = provider.name === 'Rosatom'
  const isNegligible = provider.swu < 0.5
  const cfCount = isNegligible ? 1 : Math.max(3, Math.round((provider.swu / maxSwu) * 24))
  const color = isRosatom ? C.accent : C.text

  return (
    <div style={{
      animation: revealed ? `fadeUp 600ms ease ${index * 120}ms both` : 'none',
    }}>
      {/* ligne du haut : nom + métriques */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 14,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isRosatom ? 'clamp(24px, 3.5vw, 34px)' : 'clamp(20px, 2.8vw, 28px)',
            fontWeight: 500,
            color: color,
            letterSpacing: '-0.01em',
          }}>
            {provider.name}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.dim,
          }}>
            {provider.country}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            color: color,
            fontWeight: 400,
          }}>
            {isNegligible ? '< 1' : provider.swu}
            <span style={{ fontSize: 10, marginLeft: 4, color: C.dim, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em' }}>
              M UTS
            </span>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: isRosatom ? C.accent : C.dim,
            minWidth: 44,
            textAlign: 'right',
          }}>
            {isNegligible ? '< 1' : provider.share} %
          </div>
        </div>
      </div>

      {/* rangée de centrifugeuses au-dessus de la barre */}
      <div style={{
        display: 'flex',
        gap: 3,
        marginBottom: 8,
        alignItems: 'flex-end',
        minHeight: 44,
      }}>
        {Array.from({ length: cfCount }).map((_, i) => (
          <div
            key={i}
            style={{
              animation: revealed
                ? `fadeUp 400ms ease ${index * 120 + i * 20}ms both`
                : 'none',
            }}
          >
            <Centrifuge
              w={10}
              h={40}
              color={color}
              speed={0.7 + (i % 4) * 0.2}
            />
          </div>
        ))}
      </div>

      {/* barre de progression */}
      <div style={{
        position: 'relative',
        height: 6,
        background: C.lineSoft,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${widthPct}%`,
          background: `linear-gradient(90deg, ${color}, ${isRosatom ? C.accentBright : hex(C.text, 0.85)})`,
          transformOrigin: 'left',
          animation: revealed
            ? `barGrow 1200ms cubic-bezier(.3,.1,.2,1) ${index * 120}ms both`
            : 'none',
          boxShadow: isRosatom ? `0 0 12px ${hex(C.accent, 0.6)}` : 'none',
        }} />
        {/* sweep lumineux */}
        {isRosatom && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${hex(C.accentBright, 0.5)}, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'sweep 3.5s linear infinite',
          }} />
        )}
      </div>

      {/* plants */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 13,
        fontStyle: 'italic',
        color: C.muted,
      }}>
        {provider.plants}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PALIERS COMPACTS
   Une ligne horizontale avec 5 seuils, marqueur qui auto-avance
   ════════════════════════════════════════════════════════════════ */
function PaliersCompact({ paliers, activeIndex }) {
  const active = paliers[activeIndex]
  const isMilitary = active?.military
  const fillPct = ((activeIndex + 1) / paliers.length) * 100
  const barColor = isMilitary ? C.red : C.accent

  return (
    <div style={{
      position: 'relative',
    }}>
      {/* Rail horizontal */}
      <div style={{
        position: 'relative',
        height: 14,
        background: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: 7,
        overflow: 'hidden',
        marginBottom: 48,
      }}>
        {/* remplissage */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${fillPct}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${barColor})`,
          transition: 'width 900ms cubic-bezier(.3,.1,.2,1), background 500ms ease',
          boxShadow: `0 0 16px ${hex(barColor, 0.6)}`,
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 20,
            height: '100%',
            background: `radial-gradient(ellipse at right, ${isMilitary ? C.redBright : C.accentBright} 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }} />
        </div>
        {/* marqueurs de position */}
        {paliers.map((p, i) => {
          const pos = (i / (paliers.length - 1)) * 100
          const isActive = i === activeIndex
          const isPast = i < activeIndex
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${pos}%`,
                top: '50%',
                width: isActive ? 18 : 8,
                height: isActive ? 18 : 8,
                borderRadius: '50%',
                background: isActive
                  ? (p.military ? C.red : C.accent)
                  : isPast ? C.accent : C.bg,
                border: isActive ? `2px solid ${C.bg}` : `1px solid ${isPast ? C.accent : C.line}`,
                transform: 'translate(-50%, -50%)',
                transition: 'all 500ms cubic-bezier(.3,.1,.2,1)',
                zIndex: 2,
                boxShadow: isActive
                  ? `0 0 0 4px ${C.bg}, 0 0 16px ${p.military ? C.red : C.accent}`
                  : 'none',
                animation: isActive && p.military ? 'pulseRed 1.8s infinite' : 'none',
              }}
            />
          )
        })}
      </div>

      {/* Labels sous le rail */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${paliers.length}, 1fr)`,
        gap: 4,
        marginBottom: 48,
      }}>
        {paliers.map((p, i) => {
          const isActive = i === activeIndex
          const isPast = i < activeIndex
          return (
            <div
              key={i}
              style={{
                textAlign: 'center',
                transition: 'all 400ms ease',
                opacity: isActive ? 1 : (isPast ? 0.7 : 0.4),
              }}
            >
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isActive ? 'clamp(26px, 3.2vw, 36px)' : 'clamp(16px, 2vw, 22px)',
                fontWeight: isActive ? 500 : 300,
                color: isActive
                  ? (p.military ? C.red : C.accent)
                  : isPast ? C.text : C.dim,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                transition: 'all 500ms cubic-bezier(.3,.1,.2,1)',
              }}>
                {p.value}
                <span style={{ fontSize: '0.45em', opacity: 0.6, marginLeft: 2 }}>%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Zone de détail de l'actif */}
      <div style={{
        padding: '28px 24px',
        border: `1px solid ${active?.military ? C.red : C.line}`,
        borderLeft: `3px solid ${active?.military ? C.red : active?.flagged ? C.accent : C.text}`,
        background: active?.military ? hex(C.red, 0.04) : C.surface,
        minHeight: 140,
        transition: 'all 500ms ease',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: active?.military ? C.red : active?.flagged ? C.accent : C.dim,
          marginBottom: 12,
        }}>
          Palier {String.fromCharCode(8544 + activeIndex)}
          {active?.flagged && ' · hors traité'}
          {active?.military && ' · franchissement militaire'}
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(24px, 3vw, 34px)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: C.text,
          marginBottom: 14,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
        }}>
          {active?.label}
        </div>
        <p style={{
          fontSize: 'clamp(15px, 1.6vw, 18px)',
          lineHeight: 1.55,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
        }}>
          {active?.desc}
        </p>
      </div>

      <div style={{
        marginTop: 16,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: C.muted,
        textAlign: 'center',
      }}>
        Palier {activeIndex + 1} / {paliers.length}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   DOT GRID : 1000 points, 7 en accent qui pulsent
   ════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   CENTRIFUGE ANATOMY
   Grande centrifugeuse en coupe avec flux de particules animés.
   U-235 (ocre) remonte au centre. U-238 (muet) descend sur les parois.
   ════════════════════════════════════════════════════════════════ */
function CentrifugeAnatomy({ revealed }) {
  const cfH = 440  // hauteur de la centrifugeuse
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center',
    }} className="uranium-grid-2">

      {/* SCHÉMA */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        height: cfH + 60,
        margin: '0 auto',
      }}>
        {/* Indicateur rotation */}
        <div style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: C.accent,
          whiteSpace: 'nowrap',
          animation: 'breathe 2.5s ease-in-out infinite',
        }}>
          ↻ 70 000 tours / minute
        </div>

        {/* Moteur */}
        <div style={{
          position: 'absolute',
          top: 28,
          left: '32%',
          right: '32%',
          height: 14,
          background: C.dim,
        }} />
        <div style={{
          position: 'absolute',
          top: 38,
          left: '28%',
          right: '28%',
          height: 8,
          background: C.muted,
        }} />

        {/* Tube extérieur (casing) */}
        <div style={{
          position: 'absolute',
          top: 46,
          left: '15%',
          right: '15%',
          height: cfH - 60,
          border: `2px solid ${C.dim}`,
          borderRadius: 4,
          background: `linear-gradient(to right,
            ${hex(C.surface, 0.8)} 0%,
            ${hex(C.bg, 0.5)} 50%,
            ${hex(C.surface, 0.8)} 100%)`,
          overflow: 'hidden',
        }}>

          {/* Rotor intérieur (qui "tourne" via stripes défilantes) */}
          <div style={{
            position: 'absolute',
            top: 8,
            left: '12%',
            right: '12%',
            bottom: 8,
            background: `linear-gradient(to right,
              ${hex(C.text, 0.08)} 0%,
              ${hex(C.text, 0.18)} 30%,
              ${hex(C.text, 0.12)} 50%,
              ${hex(C.text, 0.18)} 70%,
              ${hex(C.text, 0.08)} 100%)`,
            overflow: 'hidden',
            borderLeft: `1px solid ${hex(C.text, 0.2)}`,
            borderRight: `1px solid ${hex(C.text, 0.2)}`,
          }}>
            {/* stripes de rotation rapide */}
            <div style={{
              position: 'absolute',
              inset: '-30% -30%',
              background: `repeating-linear-gradient(
                60deg,
                transparent 0,
                transparent 5px,
                rgba(255,255,255,0.08) 5px,
                rgba(255,255,255,0.08) 7px
              )`,
              animation: 'cfStripes 0.5s linear infinite',
            }} />

            {/* Particules U-235 qui montent au centre */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`u235-${i}`} style={{
                position: 'absolute',
                left: `${40 + (i % 3) * 8}%`,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: C.accentBright,
                boxShadow: `0 0 10px ${C.accent}, 0 0 4px ${C.accentBright}`,
                animation: revealed
                  ? `u235Rise ${3 + (i % 3) * 0.4}s linear ${i * 0.35}s infinite`
                  : 'none',
              }} />
            ))}

            {/* Particules U-238 qui descendent sur les parois */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`u238-left-${i}`} style={{
                position: 'absolute',
                left: '5%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: C.dim,
                opacity: 0.8,
                animation: revealed
                  ? `u238Fall ${2.8 + (i % 3) * 0.3}s linear ${i * 0.4 + 0.2}s infinite`
                  : 'none',
              }} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`u238-right-${i}`} style={{
                position: 'absolute',
                right: '5%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: C.dim,
                opacity: 0.8,
                animation: revealed
                  ? `u238Fall ${2.8 + (i % 3) * 0.3}s linear ${i * 0.4 + 0.6}s infinite`
                  : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* Base */}
        <div style={{
          position: 'absolute',
          top: cfH - 14 + 46,
          left: '10%',
          right: '10%',
          height: 6,
          background: C.dim,
        }} />
        <div style={{
          position: 'absolute',
          top: cfH - 8 + 46,
          left: '5%',
          right: '5%',
          height: 3,
          background: C.muted,
        }} />

        {/* Flèche d'entrée (feed) à droite, milieu */}
        <div style={{
          position: 'absolute',
          top: `${46 + (cfH - 60) * 0.5 - 8}px`,
          right: -6,
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: C.text,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 30,
            height: 2,
            background: C.text,
            position: 'relative',
            animation: revealed ? 'feedPulse 2s ease-in-out infinite' : 'none',
          }}>
            <div style={{
              position: 'absolute',
              right: 0,
              top: -4,
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: `6px solid ${C.text}`,
            }} />
          </div>
        </div>

        {/* Sortie haute : enrichie */}
        <div style={{
          position: 'absolute',
          top: 60,
          left: -6,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: `6px solid ${C.accent}`,
            animation: revealed ? 'arrowPulse 2s ease-in-out infinite' : 'none',
          }} />
          <div style={{
            width: 30,
            height: 2,
            background: C.accent,
            marginLeft: -6,
          }} />
        </div>

        {/* Sortie basse : appauvrie */}
        <div style={{
          position: 'absolute',
          bottom: 56,
          left: -6,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: `6px solid ${C.muted}`,
          }} />
          <div style={{
            width: 30,
            height: 2,
            background: C.muted,
            marginLeft: -6,
          }} />
        </div>
      </div>

      {/* LÉGENDE ANNOTÉE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}>
        <AnnotationRow
          num="1"
          title="Entrée · UF₆ à 0,7 %"
          desc="Le gaz d'hexafluorure d'uranium, légèrement enrichi en U-235, est injecté au milieu du rotor."
          color={C.text}
        />
        <AnnotationRow
          num="2"
          title="Rotor · 70 000 tours/min"
          desc="Tournant à des vitesses proches du mur sonique, le rotor génère une force centrifuge d'environ un million de fois la gravité terrestre."
          color={C.text}
        />
        <AnnotationRow
          num="3"
          title="Paroi · U-238 appauvri"
          desc="Plus lourdes, les molécules contenant de l'uranium 238 sont plaquées contre la paroi extérieure et descendent vers la sortie basse."
          color={C.muted}
          dim
        />
        <AnnotationRow
          num="4"
          title="Centre · U-235 enrichi"
          desc="Plus légères, les molécules d'U-235 restent au centre du rotor et remontent vers la sortie haute, où le gaz collecté est légèrement plus riche."
          color={C.accent}
        />
        <AnnotationRow
          num="5"
          title="Répéter des milliers de fois"
          desc="Une seule centrifugeuse n'enrichit que de 0,1 à 0,2 point. Il en faut des dizaines de milliers en série, raccordées en cascades, pour atteindre les 5 % du combustible civil."
          color={C.accent}
          emphasis
        />
      </div>
    </div>
  )
}

function AnnotationRow({ num, title, desc, color, dim = false, emphasis = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr',
      gap: 16,
      alignItems: 'start',
      opacity: dim ? 0.85 : 1,
      paddingBottom: emphasis ? 0 : 16,
      borderBottom: emphasis ? 'none' : `1px solid ${C.lineSoft}`,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28,
        fontWeight: 400,
        color: color,
        lineHeight: 1,
        fontStyle: 'italic',
      }}>
        {num}
      </div>
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: color,
          marginBottom: 8,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: C.dim,
          fontWeight: 300,
        }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

function DotGrid({ total = 1000, revealed }) {
  const accentIdx = useMemo(() => new Set([97, 203, 341, 518, 662, 789, 901]), [])
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(50, 1fr)',
      gap: 3,
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
              opacity: revealed ? (isAccent ? 1 : 0.3) : 0,
              borderRadius: '50%',
              transition: `opacity 500ms ease ${Math.min(i * 0.3, 300)}ms`,
              animation: isAccent && revealed
                ? `dotPulse 2.4s ease-in-out ${(i % 7) * 0.3}s infinite`
                : 'none',
              boxShadow: isAccent && revealed ? `0 0 8px ${C.accent}` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   FACT BLOCK ANIMÉ
   ════════════════════════════════════════════════════════════════ */
function FactBlock({ target, suffix = '', label, source, accent = false, trigger }) {
  return (
    <div style={{
      borderTop: `2px solid ${accent ? C.accent : C.line}`,
      paddingTop: 18,
      animation: trigger ? 'fadeUp 700ms ease both' : 'none',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(34px, 4vw, 52px)',
        fontWeight: 400,
        color: accent ? C.accent : C.text,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        marginBottom: 16,
      }}>
        <CountUp target={target} duration={1800} trigger={trigger} suffix={suffix} />
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 15,
        lineHeight: 1.5,
        color: C.text,
        fontWeight: 300,
        marginBottom: 12,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.muted,
      }}>
        {source}
      </div>
    </div>
  )
}
