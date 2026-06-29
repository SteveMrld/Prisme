// @ts-nocheck
import { C, PALIERS } from '../data'
import PaliersCompact from '../parts/PaliersCompact'

/* ═══════════════════════════════════════════════════
    IV — LES PALIERS (compact, auto-animation)
    ═══════════════════════════════════════════════════ */
export default function Paliers({ sectionRef, activeIndex }) {
  return (
    <section
      ref={sectionRef}
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

      <PaliersCompact paliers={PALIERS} activeIndex={activeIndex} />
    </section>
  )
}
