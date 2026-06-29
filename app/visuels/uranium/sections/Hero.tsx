// @ts-nocheck
import { C, hex } from '../data'
import Centrifuge from '../parts/Centrifuge'

/* ═══════════════════════════════════════════════════
    I — HERO
    Centrifugeuse géante qui tourne derrière le titre.
    Animations actives dès le load.
    ═══════════════════════════════════════════════════ */
export default function Hero({ sectionRef }) {
  return (
    <section
      ref={sectionRef}
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
  )
}
