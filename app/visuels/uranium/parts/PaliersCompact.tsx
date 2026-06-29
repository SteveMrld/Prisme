// @ts-nocheck
import { C, hex } from '../data'

/* ════════════════════════════════════════════════════════════════
   PALIERS COMPACTS
   Une ligne horizontale avec 5 seuils, marqueur qui auto-avance
   ════════════════════════════════════════════════════════════════ */
export default function PaliersCompact({ paliers, activeIndex }) {
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
