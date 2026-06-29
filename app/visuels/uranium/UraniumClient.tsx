// @ts-nocheck
'use client'
import { useState, useEffect, useRef } from 'react'
import Header from '../../../components/Header'
import { C, PROVIDERS, PALIERS, INSTALLATIONS, hex } from './data'
import Centrifuge from './parts/Centrifuge'
import CountUp from './parts/CountUp'
import ProviderBar from './parts/ProviderBar'
import PaliersCompact from './parts/PaliersCompact'
import CentrifugeAnatomy from './parts/CentrifugeAnatomy'
import DotGrid from './parts/DotGrid'
import FactBlock from './parts/FactBlock'

/* ════════════════════════════════════════════════════════════════
   URANIUM : LA CASCADE DU MONDE
   Atlas Soara. Refonte compacte mobile-first.
   Toutes les animations en pur CSS, démarrées au chargement.
   ════════════════════════════════════════════════════════════════ */

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
