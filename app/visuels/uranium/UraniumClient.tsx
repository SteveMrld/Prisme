// @ts-nocheck
'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Header from '../../../components/Header'

/* ════════════════════════════════════════════════════════════════
   LA CASCADE — Enrichissement de l'uranium
   Atlas Soara. Pas d'images. Pas de vidéo. Pas de charts. Pas d'IA.
   Une grammaire visuelle construite à partir d'un seul objet :
   la centrifugeuse, répétée à l'échelle des capacités réelles.
   Sources : WNA, World Nuclear Fuel Report, septembre 2025,
             Centrus Energy 10-K, février 2026.
   ════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#0b0a08',
  surface: '#121110',
  text: '#efeae0',
  dim: '#8a837a',
  muted: '#5a544c',
  line: '#2a2620',
  lineSoft: '#1a1814',
  accent: '#b8922a',       // jaune uranium, désaturé
  accentSoft: '#6a5318',
  accentDim: '#3a2f10',
  red: '#8e3a2b',           // pour les seuils militaires
}

/* Capacités d'enrichissement mondiales, en millions d'UTS par an
   Source : WNA World Nuclear Fuel Report, septembre 2025,
   reprise par Centrus Energy dans sa présentation investisseurs
   de février 2026. */
const PROVIDERS = [
  {
    name: 'Rosatom',
    entity: 'TENEX',
    country: 'Russie',
    swu: 27,
    share: 43,
    plants: ['Novouralsk', 'Zelenogorsk', 'Angarsk', 'Seversk'],
    color: C.accent,
  },
  {
    name: 'Urenco',
    entity: 'consortium',
    country: 'Royaume-Uni · Pays-Bas · Allemagne · États-Unis',
    swu: 17,
    share: 27,
    plants: ['Capenhurst', 'Almelo', 'Gronau', 'Eunice'],
    color: C.text,
  },
  {
    name: 'CNNC',
    entity: 'China National Nuclear',
    country: 'Chine',
    swu: 11,
    share: 17,
    plants: ['Lanzhou', 'Hanzhong'],
    color: C.text,
  },
  {
    name: 'Orano',
    entity: 'Georges Besse II',
    country: 'France',
    swu: 7.5,
    share: 12,
    plants: ['Tricastin'],
    color: C.text,
  },
  {
    name: 'Centrus',
    entity: 'American Centrifuge',
    country: 'États-Unis',
    swu: 0.1,
    share: 0.1,
    plants: ['Piketon'],
    color: C.dim,
  },
]

/* Les seuils d'enrichissement */
const PALIERS = [
  {
    value: '0,7',
    label: 'Uranium naturel',
    desc: "La proportion d'uranium 235 présente dans tout gisement exploité. Tout le reste, 99,3 %, est de l'uranium 238 non fissile. L'enrichissement commence là.",
    military: false,
  },
  {
    value: '3 à 5',
    label: 'LEU, combustible civil',
    desc: "Le seuil de fonctionnement des quelque 440 réacteurs à eau pressurisée qui produisent aujourd'hui l'essentiel de l'électricité nucléaire mondiale.",
    military: false,
  },
  {
    value: '≤ 20',
    label: 'HALEU, petits réacteurs',
    desc: "Le palier visé par les réacteurs modulaires de nouvelle génération et par la plupart des réacteurs de recherche. Rosatom y règne sans rival commercial occidental, ce que Washington a érigé en vulnérabilité stratégique.",
    military: false,
  },
  {
    value: '60',
    label: 'Le palier iranien',
    desc: "Le niveau déclaré depuis 2021 à Natanz et Fordo, bien au-delà du plafond de 3,67 % fixé par l'accord de Vienne de 2015. Un seuil qui ne sert aucun usage civil standard.",
    military: false,
    flagged: true,
  },
  {
    value: '≥ 90',
    label: 'HEU, qualité militaire',
    desc: "L'uranium hautement enrichi. À partir de ce seuil, quelques dizaines de kilogrammes suffisent à constituer le cœur d'une arme nucléaire.",
    military: true,
  },
]

/* Installations nommées, pour la litanie typographique */
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

/* Une centrifugeuse stylisée. Un seul motif, répété. */
function Centrifuge({ w = 10, h = 42, color = C.text, opacity = 1 }) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 10 42"
      style={{ display: 'block', opacity, flexShrink: 0 }}
    >
      {/* corps principal */}
      <rect x="3" y="4" width="4" height="34" fill={color} />
      {/* tête arrondie */}
      <rect x="3" y="2" width="4" height="2" fill={color} />
      <rect x="4" y="1" width="2" height="1" fill={color} />
      {/* base */}
      <rect x="2" y="38" width="6" height="2" fill={color} />
      {/* axe central visible */}
      <rect x="4.5" y="4" width="1" height="34" fill={C.bg} opacity="0.5" />
    </svg>
  )
}

/* Pour transformer une capacité en nombre d'icônes.
   Une centrifugeuse affichée = 250 000 UTS/an. */
const UNIT = 0.25
const iconCount = (swu) => Math.max(1, Math.round(swu / UNIT))

export default function UraniumClient() {
  const [reveal, setReveal] = useState(new Set())
  const [activePalier, setActivePalier] = useState(0)
  const sectionRefs = useRef([])
  const palierRefs = useRef([])

  // Observer pour révéler progressivement les sections
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setReveal((prev) => new Set(prev).add(e.target.dataset.id))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    sectionRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Observer pour le palier actif dans le scroll
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
      `}</style>

      <div style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>

      {/* ═══ I — OUVERTURE ═══ */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        data-id="hero"
        style={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.accent,
          marginBottom: 40,
          opacity: isRevealed('hero') ? 1 : 0,
          transition: 'opacity 900ms ease',
        }}>
          Atlas · Mouvement I · Géopolitique nucléaire
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 'clamp(44px, 7.5vw, 104px)',
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 48,
          maxWidth: 1100,
          opacity: isRevealed('hero') ? 1 : 0,
          transform: isRevealed('hero') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1200ms ease 200ms, transform 1200ms ease 200ms',
        }}>
          La cascade<br/>
          <em style={{ color: C.accent, fontStyle: 'italic' }}>du monde.</em>
        </h1>

        <p style={{
          fontSize: 'clamp(18px, 2.1vw, 24px)',
          lineHeight: 1.55,
          color: C.text,
          maxWidth: 720,
          fontWeight: 300,
          margin: 0,
          marginBottom: 72,
          opacity: isRevealed('hero') ? 1 : 0,
          transition: 'opacity 1400ms ease 600ms',
        }}>
          L'uranium enrichi tient aujourd'hui une place comparable à celle du pétrole
          dans les équilibres du XXᵉ siècle. Quatre entités en contrôlent l'essentiel.
          Quatre dont une en Occident. Quatre dont une seule fabrique, aujourd'hui,
          ce dont les réacteurs de demain auront besoin.
        </p>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          letterSpacing: '0.08em',
          color: C.dim,
          display: 'flex',
          gap: 40,
          flexWrap: 'wrap',
          opacity: isRevealed('hero') ? 1 : 0,
          transition: 'opacity 1600ms ease 1000ms',
        }}>
          <div>
            <div style={{ color: C.muted, marginBottom: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Longueur</div>
            <div>Lecture 8 minutes</div>
          </div>
          <div>
            <div style={{ color: C.muted, marginBottom: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Sources</div>
            <div>WNA, AIEA, CEA, Centrus 10-K</div>
          </div>
          <div>
            <div style={{ color: C.muted, marginBottom: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Format</div>
            <div>Visualisation pure</div>
          </div>
        </div>

        {/* indication de scroll */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: isRevealed('hero') ? 0.6 : 0,
          transition: 'opacity 1800ms ease 1400ms',
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dim }}>
            Descendre
          </div>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.dim}, transparent)` }} />
        </div>
      </section>

      {/* ═══ II — LE SEUIL ORIGINEL : 0,7 % ═══ */}
      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        data-id="origine"
        style={{
          padding: '160px 24px',
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

          {/* Chiffre géant */}
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(120px, 22vw, 260px)',
              lineHeight: 0.85,
              fontWeight: 300,
              color: C.accent,
              letterSpacing: '-0.04em',
              opacity: isRevealed('origine') ? 1 : 0.1,
              transition: 'opacity 1500ms ease',
            }}>
              0,7
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

          {/* Explication */}
          <div style={{ paddingTop: 40 }}>
            <p style={{
              fontSize: 'clamp(19px, 2vw, 23px)',
              lineHeight: 1.6,
              color: C.text,
              fontWeight: 300,
              margin: 0,
              marginBottom: 32,
            }}>
              Tout part de là. L'uranium extrait des mines du Niger, du Canada,
              du Kazakhstan, de Namibie ou d'Ouzbékistan contient environ sept parties
              pour mille d'uranium 235, le seul isotope fissile. Le reste, 99,3 %, est
              de l'uranium 238, inerte dans un réacteur à eau légère.
            </p>
            <p style={{
              fontSize: 'clamp(17px, 1.7vw, 20px)',
              lineHeight: 1.65,
              color: C.dim,
              fontWeight: 300,
              margin: 0,
            }}>
              Enrichir, c'est séparer. Depuis les années 1940, l'humanité a développé
              trois familles de procédés pour accomplir cette séparation à l'échelle
              industrielle : la diffusion gazeuse, abandonnée pour son coût énergétique,
              la centrifugation, devenue dominante, et la technologie laser, encore
              expérimentale. Toutes accomplissent la même opération, plus ou moins bien,
              plus ou moins vite, plus ou moins discrètement.
            </p>
          </div>
        </div>

        {/* Grille 1000 points */}
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
            marginBottom: 24,
          }}>
            1 000 atomes d'uranium naturel, représentés
          </div>
          <DotGrid total={1000} highlight={7} />
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: C.dim,
            marginTop: 16,
            display: 'flex',
            gap: 28,
            flexWrap: 'wrap',
          }}>
            <span><span style={{ color: C.accent }}>■</span> 7 atomes d'U-235</span>
            <span><span style={{ color: C.muted }}>■</span> 993 atomes d'U-238</span>
          </div>
        </div>
      </section>

      {/* ═══ III — LA CASCADE ═══ */}
      <section
        ref={(el) => (sectionRefs.current[2] = el)}
        data-id="cascade"
        style={{
          padding: '160px 24px 100px',
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
          fontSize: 'clamp(36px, 5.5vw, 72px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 28,
          maxWidth: 900,
        }}>
          Chaque trait vertical est une capacité de <em style={{ color: C.accent }}>250 000 unités de travail de séparation</em> par an.
        </h2>
        <p style={{
          fontSize: 'clamp(16px, 1.6vw, 19px)',
          lineHeight: 1.65,
          color: C.dim,
          fontWeight: 300,
          margin: 0,
          marginBottom: 80,
          maxWidth: 720,
        }}>
          Cinq acteurs se partagent la quasi-totalité du marché commercial. La
          dissymétrie que révèle cette composition, à elle seule, résume plusieurs
          décennies de stratégie industrielle.
        </p>

        {/* La cascade elle-même */}
        <div style={{
          overflowX: 'auto',
          marginLeft: -24,
          marginRight: -24,
          paddingLeft: 24,
          paddingRight: 24,
        }}>
          <div style={{
            display: 'flex',
            gap: 48,
            alignItems: 'flex-end',
            minWidth: 'min-content',
            paddingBottom: 24,
          }}>
            {PROVIDERS.map((p, i) => {
              const count = iconCount(p.swu)
              const displayCount = p.swu < 0.5 ? 1 : count
              return (
                <div
                  key={p.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    minWidth: p.name === 'Rosatom' ? 360 : 220,
                    flexShrink: 0,
                    opacity: isRevealed('cascade') ? 1 : 0,
                    transform: isRevealed('cascade') ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 900ms ease ${i * 140}ms, transform 900ms ease ${i * 140}ms`,
                  }}
                >
                  {/* Les centrifugeuses, en colonne dense */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    marginBottom: 24,
                    maxWidth: p.name === 'Rosatom' ? 360 : 220,
                  }}>
                    {Array.from({ length: displayCount }).map((_, idx) => (
                      <Centrifuge
                        key={idx}
                        color={p.color}
                        opacity={p.name === 'Centrus' ? 0.5 : 1}
                      />
                    ))}
                    {p.name === 'Centrus' && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10,
                        color: C.muted,
                        fontStyle: 'italic',
                        marginLeft: 8,
                        alignSelf: 'center',
                      }}>
                        capacité commerciale négligeable
                      </div>
                    )}
                  </div>

                  {/* Bloc légende */}
                  <div style={{
                    borderTop: `1px solid ${p.name === 'Rosatom' ? C.accent : C.line}`,
                    paddingTop: 16,
                    width: '100%',
                  }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      fontWeight: 500,
                      color: p.name === 'Rosatom' ? C.accent : C.text,
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}>
                      {p.name}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: C.dim,
                      marginBottom: 14,
                    }}>
                      {p.country}
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22,
                      color: C.text,
                      marginBottom: 2,
                    }}>
                      {p.swu < 0.5 ? '< 1' : p.swu} M UTS
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: p.name === 'Rosatom' ? C.accent : C.dim,
                    }}>
                      {p.share < 1 ? '< 1' : p.share} % du marché mondial
                    </div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 14,
                      fontStyle: 'italic',
                      color: C.muted,
                      marginTop: 14,
                      lineHeight: 1.5,
                    }}>
                      {p.plants.join(', ')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Phrase de conclusion sobre */}
        <div style={{
          marginTop: 100,
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

      {/* ═══ IV — LES PALIERS ═══ */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        data-id="paliers"
        style={{
          padding: '160px 0 100px',
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
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 28,
            maxWidth: 900,
          }}>
            Le même atome, enrichi à des degrés différents, fait tourner une ville ou rase une capitale.
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 1.6vw, 19px)',
            lineHeight: 1.65,
            color: C.dim,
            fontWeight: 300,
            margin: 0,
            maxWidth: 720,
          }}>
            Cinq paliers suffisent à décrire toute la géopolitique de l'atome civil et militaire.
          </p>
        </div>

        {/* Les paliers, empilés avec scrollytelling */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          position: 'relative',
        }} className="uranium-paliers-grid">

          {/* Colonne gauche : jauge collante */}
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
            <Gauge activeIndex={activePalier} paliers={PALIERS} />
          </div>

          {/* Colonne droite : paliers déroulants */}
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
                }}
              >
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

      {/* ═══ V — LA LITANIE DES INSTALLATIONS ═══ */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        data-id="installations"
        style={{
          padding: '160px 24px 140px',
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
          fontSize: 'clamp(36px, 5.5vw, 72px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 80,
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
                  padding: '28px 0',
                  borderBottom: `1px solid ${C.line}`,
                  gap: 24,
                  opacity: isRevealed('installations') ? 1 : 0,
                  transform: isRevealed('installations') ? 'translateX(0)' : 'translateX(-10px)',
                  transition: `opacity 600ms ease ${i * 40}ms, transform 600ms ease ${i * 40}ms`,
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
                  fontSize: 'clamp(28px, 3.6vw, 44px)',
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

      {/* ═══ VI — LA DÉPENDANCE ═══ */}
      <section
        ref={(el) => (sectionRefs.current[5] = el)}
        data-id="dependance"
        style={{
          padding: '160px 24px 120px',
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
          fontSize: 'clamp(36px, 5.5vw, 72px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: 64,
          maxWidth: 900,
        }}>
          Ce que Rosatom produit, l'Occident l'achète.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40,
          marginBottom: 80,
        }}>
          <FactBlock
            value="≈ 25 %"
            label="des services d'enrichissement destinés aux réacteurs américains provenaient encore de Russie en 2024"
            source="National Interest, décembre 2025"
          />
          <FactBlock
            value="700 M€"
            label="dépensés par les utilities européennes en combustible russe en 2024, selon les estimations de Bruegel"
            source="Bruegel, 2025"
            accent
          />
          <FactBlock
            value="10 ans"
            label="délai estimé pour qu'une nouvelle installation d'enrichissement atteigne sa pleine capacité, de la conception à l'exploitation"
            source="Centrus, 10-K 2026"
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

        <div style={{ marginTop: 60 }}>
          <p style={{
            fontSize: 'clamp(17px, 1.7vw, 20px)',
            lineHeight: 1.65,
            color: C.text,
            fontWeight: 300,
            marginBottom: 24,
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

      {/* ═══ SOURCES ═══ */}
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
          gap: 32,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16,
          lineHeight: 1.6,
          color: C.dim,
          fontStyle: 'italic',
        }}>
          <div>
            World Nuclear Association, <em style={{ fontStyle: 'normal' }}>World Nuclear Fuel Report</em>, septembre 2025.
          </div>
          <div>
            Centrus Energy, <em style={{ fontStyle: 'normal' }}>Investor Presentation</em>, février 2026, et formulaire 10-K 2025.
          </div>
          <div>
            Bruegel, <em style={{ fontStyle: 'normal' }}>EU Reliance on Russian Nuclear Fuel</em>, 2025.
          </div>
          <div>
            Agence internationale de l'énergie atomique, <em style={{ fontStyle: 'normal' }}>IAEA Safeguards Reports</em>, 2024 et 2025.
          </div>
          <div>
            CEA, Dossier pédagogique <em style={{ fontStyle: 'normal' }}>L'enrichissement de l'uranium</em>.
          </div>
          <div>
            Thunder Said Energy, <em style={{ fontStyle: 'normal' }}>Uranium enrichment by country and company</em>, 2024.
          </div>
        </div>

        <div style={{
          marginTop: 80,
          paddingTop: 32,
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

/* ─────────────────────────────────────────────────────
   Grille de 1 000 points, 7 en jaune uranium
   ───────────────────────────────────────────────────── */
function DotGrid({ total = 1000, highlight = 7 }) {
  const dots = useMemo(() => {
    const arr = Array.from({ length: total }, (_, i) => i)
    // répartir 7 indices "au hasard" mais stables
    const accentIdx = new Set([97, 203, 341, 518, 662, 789, 901])
    return arr.map((i) => accentIdx.has(i))
  }, [total, highlight])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(50, 1fr)',
      gap: 4,
      maxWidth: 760,
    }}>
      {dots.map((isAccent, i) => (
        <div
          key={i}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            background: isAccent ? C.accent : C.muted,
            opacity: isAccent ? 1 : 0.35,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Jauge verticale des paliers (colonne gauche sticky)
   ───────────────────────────────────────────────────── */
function Gauge({ activeIndex, paliers }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 400,
      height: '70vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Axe vertical */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 1,
        background: C.line,
      }} />

      {/* Axe actif en accent, du bas à la position active */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 0,
        width: 2,
        height: `${((activeIndex + 1) / paliers.length) * 100}%`,
        background: paliers[activeIndex]?.military ? C.red : C.accent,
        transition: 'height 600ms ease, background 400ms ease',
        transform: 'translateX(-50%)',
      }} />

      {/* Marqueurs */}
      {paliers.map((p, i) => {
        const isActive = i === activeIndex
        const isPast = i < activeIndex
        // inversé : plus haut = plus enrichi
        const pos = ((paliers.length - 1 - i) / (paliers.length - 1)) * 100
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${pos}%`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transform: 'translateY(-50%)',
              transition: 'all 400ms ease',
            }}
          >
            <div style={{
              flex: 1,
              textAlign: 'right',
              fontFamily: "'Playfair Display', serif",
              fontSize: isActive ? 36 : 18,
              fontWeight: isActive ? 500 : 300,
              color: isActive
                ? (p.military ? C.red : C.accent)
                : isPast ? C.text : C.muted,
              opacity: isActive ? 1 : 0.5,
              transition: 'all 400ms ease',
              letterSpacing: '-0.01em',
              paddingRight: 8,
            }}>
              {p.value}
              <span style={{ fontSize: '0.5em', opacity: 0.6, marginLeft: 4 }}>%</span>
            </div>
            <div style={{
              width: isActive ? 24 : 10,
              height: isActive ? 24 : 10,
              borderRadius: '50%',
              background: isActive
                ? (p.military ? C.red : C.accent)
                : isPast ? C.text : C.muted,
              border: isActive ? `3px solid ${C.bg}` : 'none',
              boxShadow: isActive ? `0 0 0 1px ${p.military ? C.red : C.accent}` : 'none',
              transition: 'all 400ms ease',
              zIndex: 2,
            }} />
            <div style={{
              flex: 1,
              textAlign: 'left',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isActive ? 12 : 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isActive
                ? C.text
                : isPast ? C.dim : C.muted,
              opacity: isActive ? 1 : 0.5,
              transition: 'all 400ms ease',
              paddingLeft: 8,
            }}>
              {p.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Bloc de fait chiffré
   ───────────────────────────────────────────────────── */
function FactBlock({ value, label, source, accent = false }) {
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
        {value}
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        lineHeight: 1.5,
        color: C.text,
        fontWeight: 300,
        marginBottom: 16,
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
