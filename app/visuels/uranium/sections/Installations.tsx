// @ts-nocheck
import { C, INSTALLATIONS } from '../data'

/* ═══════════════════════════════════════════════════
    V — INSTALLATIONS
    ═══════════════════════════════════════════════════ */
export default function Installations({ sectionRef, revealed }) {
  return (
    <section
      ref={sectionRef}
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
                animation: revealed ? `fadeUp 500ms ease ${i * 40}ms both` : 'none',
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
  )
}
