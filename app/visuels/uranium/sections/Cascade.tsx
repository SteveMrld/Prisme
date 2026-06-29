// @ts-nocheck
import { C, PROVIDERS } from '../data'
import ProviderBar from '../parts/ProviderBar'

/* ═══════════════════════════════════════════════════
    III — LA CASCADE MONDIALE
    Barres horizontales proportionnelles à la capacité.
    Au-dessus de chaque nom, un cluster de centrifugeuses qui tournent.
    ═══════════════════════════════════════════════════ */
export default function Cascade({ sectionRef, revealed }) {
  return (
    <section
      ref={sectionRef}
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
            revealed={revealed}
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
  )
}
