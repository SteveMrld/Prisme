// @ts-nocheck
import { C } from '../data'
import CentrifugeAnatomy from '../parts/CentrifugeAnatomy'

/* ═══════════════════════════════════════════════════
    II.5 — LA MÉCANIQUE
    Anatomie d'une centrifugeuse : comment ça sépare
    ═══════════════════════════════════════════════════ */
export default function Mecanique({ sectionRef, revealed }) {
  return (
    <section
      ref={sectionRef}
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

      <CentrifugeAnatomy revealed={revealed} />
    </section>
  )
}
