// @ts-nocheck
import { C } from '../data'
import CountUp from '../parts/CountUp'
import DotGrid from '../parts/DotGrid'

/* ═══════════════════════════════════════════════════
    II — 0,7 % (compact)
    ═══════════════════════════════════════════════════ */
export default function Origine({ sectionRef, revealed }) {
  return (
    <section
      ref={sectionRef}
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
            <CountUp target={0.7} duration={1800} decimals={1} trigger={revealed} />
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
        <DotGrid total={1000} revealed={revealed} />
      </div>
    </section>
  )
}
